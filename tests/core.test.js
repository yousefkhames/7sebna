const test = require('node:test'); const assert = require('node:assert');
const C = require('../core.js');
test('toMinor parses', () => {
  assert.strictEqual(C.toMinor('12.5'), 1250); assert.strictEqual(C.toMinor('١٢٫٥٠'), 1250);
  assert.strictEqual(C.toMinor('12,5'), 1250); assert.strictEqual(C.toMinor('0.1'), 10);
  assert.strictEqual(C.toMinor('19.999'), 1999); assert.ok(isNaN(C.toMinor('abc'))); assert.ok(isNaN(C.toMinor('')));
  assert.ok(isNaN(C.toMinor('-5')));
});
test('distribute keeps total', () => {
  const r = C.distribute(1000, { a: 1, b: 1, c: 1 });
  assert.strictEqual(r.a + r.b + r.c, 1000);
  const q = C.distribute(1, { a: 1, b: 1, c: 1 }); assert.strictEqual(q.a + q.b + q.c, 1);
});
test('split types', () => {
  assert.deepStrictEqual(C.computeShares({ amount: 1000, split: { type: 'equal', who: ['a', 'b'] } }), { a: 500, b: 500 });
  assert.deepStrictEqual(C.computeShares({ amount: 1000, split: { type: 'percent', pct: { a: 70, b: 30 } } }), { a: 700, b: 300 });
  assert.deepStrictEqual(C.computeShares({ amount: 900, split: { type: 'shares', shares: { a: 2, b: 1 } } }), { a: 600, b: 300 });
  assert.deepStrictEqual(C.computeShares({ amount: 900, split: { type: 'exact', amounts: { a: 100, b: 800 } } }), { a: 100, b: 800 });
});
test('validation', () => {
  const ok = { desc: 'x', amount: 100, payer: 'a', split: { type: 'equal', who: ['a'] } };
  assert.strictEqual(C.validateExpense(ok), null);
  assert.strictEqual(C.validateExpense({ ...ok, desc: ' ' }), 'desc');
  assert.strictEqual(C.validateExpense({ ...ok, amount: 0 }), 'amount');
  assert.strictEqual(C.validateExpense({ ...ok, split: { type: 'equal', who: [] } }), 'who');
  assert.strictEqual(C.validateExpense({ ...ok, split: { type: 'exact', amounts: { a: 50 } } }), 'exactSum');
  assert.strictEqual(C.validateExpense({ ...ok, split: { type: 'percent', pct: { a: 50 } } }), 'percentSum');
});
const g = () => ({ members: [{ id: 'a' }, { id: 'b' }, { id: 'c' }], payments: [], expenses: [
  { id: 1, amount: 3000, payer: 'a', split: { type: 'equal', who: ['a', 'b', 'c'] } },
  { id: 2, amount: 1000, payer: 'b', split: { type: 'equal', who: ['a', 'b'] } }] });
test('balances sum to zero and settle clears them', () => {
  const b = C.balances(g());
  assert.strictEqual(b.a, 1500); assert.strictEqual(b.c, -1000); assert.strictEqual(b.b, -500);
  assert.strictEqual(b.a + b.b + b.c, 0);
  const plan = C.settle(b); const after = { ...b };
  plan.forEach(t => { after[t.from] += t.amount; after[t.to] -= t.amount; });
  assert.ok(Object.values(after).every(v => v === 0));
  assert.ok(plan.length <= 2);
});
test('payments reduce debt', () => {
  const x = g(); x.payments.push({ from: 'c', to: 'a', amount: 1000 });
  const b = C.balances(x); assert.strictEqual(b.c, 0);
  assert.deepStrictEqual(C.settle(b), [{ from: 'b', to: 'a', amount: 500 }]);
});
test('settle random fuzz: zero after, <= n-1 transfers', () => {
  for (let k = 0; k < 300; k++) {
    const n = 2 + Math.floor(Math.random() * 8); const ids = [...Array(n)].map((_, i) => 'm' + i);
    const grp = { members: ids.map(id => ({ id })), payments: [], expenses: [] };
    for (let e = 0; e < 12; e++) {
      const who = ids.filter(() => Math.random() < .6); if (!who.length) who.push(ids[0]);
      grp.expenses.push({ amount: 1 + Math.floor(Math.random() * 99999), payer: ids[Math.floor(Math.random() * n)], split: { type: 'equal', who } });
    }
    const b = C.balances(grp); assert.strictEqual(Object.values(b).reduce((a, c) => a + c, 0), 0);
    const plan = C.settle(b); assert.ok(plan.length <= n - 1);
    plan.forEach(t => { b[t.from] += t.amount; b[t.to] -= t.amount; });
    assert.ok(Object.values(b).every(v => v === 0));
  }
});
test('memberInUse', () => {
  assert.ok(C.memberInUse(g(), 'c')); assert.ok(!C.memberInUse({ members: [], expenses: [], payments: [] }, 'z'));
});
test('csv escapes', () => {
  const csv = C.toCSV({ members: [{ id: 'a', name: 'A,B' }], payments: [], expenses: [{ date: '2026-01-01', desc: 'say "hi"', cat: 'food', amount: 100, payer: 'a', split: { type: 'equal', who: ['a'] } }] });
  assert.ok(csv.includes('"say ""hi"""')); assert.ok(csv.includes('"A,B"'));
});
test('sanitizeImport drops junk', () => {
  assert.strictEqual(C.sanitizeImport({}), null);
  const r = C.sanitizeImport({ groups: [{ id: 'g1', name: 'T', members: [{ id: 'a', name: 'A' }, { id: '', name: 'x' }],
    expenses: [{ id: 'e', desc: 'd', amount: 100, payer: 'zzz', split: { type: 'equal', who: ['a'] } }, { id: 'e2', desc: 'd', amount: 100, payer: 'a', split: { type: 'equal', who: ['a'] } }], payments: [] }] });
  assert.strictEqual(r.groups[0].members.length, 1); assert.strictEqual(r.groups[0].expenses.length, 1);
});

test('absurd amounts rejected', () => {
  assert.strictEqual(C.validateExpense({ desc: 'x', amount: 1e15, payer: 'a', split: { type: 'equal', who: ['a'] } }), 'amount');
});
test('uneven split sums exactly (100.00 / 3)', () => {
  const r = C.computeShares({ amount: 10000, split: { type: 'equal', who: ['a', 'b', 'c'] } });
  assert.strictEqual(r.a + r.b + r.c, 10000);
});

test('settle finds the true minimum number of transfers', () => {
  // two independent pairs: greedy over the whole set would use 3, optimal is 2
  const b = { a: 5, b: 5, c: -5, d: -5 };
  const plan = C.settle(b); assert.strictEqual(plan.length, 2);
  // clusters {b,e} and {a,c,d,f} => 6 people - 2 clusters = 4 transfers
  const b2 = { a: 700, b: 300, c: 200, d: -600, e: -300, f: -300 };
  const p2 = C.settle(b2);
  const after = { ...b2 }; p2.forEach(p => { after[p.from] += p.amount; after[p.to] -= p.amount; });
  assert.ok(Object.values(after).every(v => v === 0));
  assert.strictEqual(p2.length, 4); // {a,d}+{b,e}... clusters: a-d 600 leaves 100; best is 2 clusters => 6-2=4
});
test('settle exact minimum vs brute force on random small groups', () => {
  function brute(bal) {
    const ids = Object.keys(bal).filter(i => bal[i] !== 0), n = ids.length;
    let bestClusters = 0;
    function go(rem, cnt) {
      if (!rem.length) { bestClusters = Math.max(bestClusters, cnt); return; }
      const first = rem[0], others = rem.slice(1);
      for (let m = 0; m < (1 << others.length); m++) {
        const grp = [first, ...others.filter((_, k) => m & (1 << k))];
        if (grp.reduce((s, i) => s + bal[i], 0) === 0) go(others.filter((_, k) => !(m & (1 << k))), cnt + 1);
      }
    }
    go(ids, 0);
    return n - bestClusters;
  }
  let seed = 7; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
  for (let r = 0; r < 300; r++) {
    const n = 2 + Math.floor(rnd() * 7), bal = {}; let s = 0;
    for (let i = 0; i < n - 1; i++) { const v = Math.round((rnd() - 0.5) * 10) * 100; bal['p' + i] = v; s += v; }
    bal['p' + (n - 1)] = -s;
    const plan = C.settle(bal);
    const after = { ...bal }; plan.forEach(p => { after[p.from] += p.amount; after[p.to] -= p.amount; });
    assert.ok(Object.values(after).every(v => v === 0));
    assert.strictEqual(plan.length, brute(bal), JSON.stringify(bal));
  }
});
