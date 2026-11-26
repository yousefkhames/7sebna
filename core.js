/* 7sebna core: money math, splits, balances, settlement. No DOM. */
(function (root) {
  'use strict';

  // ---- money: everything is integer minor units (1/100) ----
  function toMinor(v) {
    if (typeof v === 'number') return Math.round(v * 100);
    var s = String(v == null ? '' : v).trim();
    // Arabic-Indic digits and separators
    s = s.replace(/[\u0660-\u0669]/g, function (d) { return d.charCodeAt(0) - 0x660; })
         .replace(/[\u06F0-\u06F9]/g, function (d) { return d.charCodeAt(0) - 0x6F0; })
         .replace(/\u066B/g, '.').replace(/\u066C/g, '').replace(/,/g, '.').replace(/\s/g, '');
    if (!/^\d*\.?\d*$/.test(s) || s === '' || s === '.') return NaN;
    var parts = s.split('.');
    var whole = parseInt(parts[0] || '0', 10);
    var frac = (parts[1] || '').slice(0, 2);
    while (frac.length < 2) frac += '0';
    return whole * 100 + parseInt(frac, 10);
  }
  function fromMinor(m) { return m / 100; }

  // Largest-remainder distribution of `total` by non-negative weights.
  function distribute(total, weights) {
    var ids = Object.keys(weights);
    var sum = 0;
    ids.forEach(function (i) { sum += weights[i]; });
    var out = {};
    if (!ids.length || sum <= 0) return out;
    var given = 0, rem = [];
    ids.forEach(function (i) {
      var exact = total * weights[i] / sum;
      var fl = Math.floor(exact + 1e-9);
      out[i] = fl; given += fl;
      rem.push({ id: i, r: exact - fl });
    });
    rem.sort(function (a, b) { return b.r - a.r || (a.id < b.id ? -1 : 1); });
    var left = total - given;
    for (var k = 0; left > 0 && k < rem.length; k++, left--) out[rem[k].id] += 1;
    return out;
  }

  // split: {type:'equal',who:[ids]} | {type:'exact',amounts:{id:minor}} |
  //        {type:'percent',pct:{id:n}} | {type:'shares',shares:{id:n}}
  function computeShares(exp) {
    var s = exp.split || {}, total = exp.amount, w = {};
    if (s.type === 'exact') {
      var r = {};
      Object.keys(s.amounts || {}).forEach(function (i) { if (s.amounts[i] > 0) r[i] = s.amounts[i]; });
      return r;
    }
    if (s.type === 'percent') {
      Object.keys(s.pct || {}).forEach(function (i) { if (s.pct[i] > 0) w[i] = s.pct[i]; });
      return distribute(total, w);
    }
    if (s.type === 'shares') {
      Object.keys(s.shares || {}).forEach(function (i) { if (s.shares[i] > 0) w[i] = s.shares[i]; });
      return distribute(total, w);
    }
    (s.who || []).forEach(function (i) { w[i] = 1; });
    return distribute(total, w);
  }

  // Returns null if valid, else an error code.
  function validateExpense(exp) {
    if (!exp.desc || !String(exp.desc).trim()) return 'desc';
    if (!(exp.amount > 0) || !isFinite(exp.amount)) return 'amount';
    if (!exp.payer) return 'payer';
    var s = exp.split || {};
    if (s.type === 'exact') {
      var t = 0, n = 0;
      Object.keys(s.amounts || {}).forEach(function (i) { t += s.amounts[i]; if (s.amounts[i] > 0) n++; });
      if (!n) return 'who';
      if (t !== exp.amount) return 'exactSum';
    } else if (s.type === 'percent') {
      var p = 0, c = 0;
      Object.keys(s.pct || {}).forEach(function (i) { p += s.pct[i]; if (s.pct[i] > 0) c++; });
      if (!c) return 'who';
      if (Math.abs(p - 100) > 0.001) return 'percentSum';
    } else if (s.type === 'shares') {
      var q = 0;
      Object.keys(s.shares || {}).forEach(function (i) { q += s.shares[i] > 0 ? s.shares[i] : 0; });
      if (q <= 0) return 'who';
    } else if (!(s.who && s.who.length)) return 'who';
    return null;
  }

  // balance > 0: is owed money. balance < 0: owes money.
  function balances(group) {
    var b = {};
    (group.members || []).forEach(function (m) { b[m.id] = 0; });
    (group.expenses || []).forEach(function (e) {
      if (b[e.payer] === undefined) b[e.payer] = 0;
      b[e.payer] += e.amount;
      var sh = computeShares(e);
      Object.keys(sh).forEach(function (i) { if (b[i] === undefined) b[i] = 0; b[i] -= sh[i]; });
    });
    (group.payments || []).forEach(function (p) {
      if (b[p.from] === undefined) b[p.from] = 0;
      if (b[p.to] === undefined) b[p.to] = 0;
      b[p.from] += p.amount;
      b[p.to] -= p.amount;
    });
    return b;
  }

  // Greedy: always match largest debtor with largest creditor. At most n-1 transfers.
  function settle(bal) {
    var cr = [], de = [];
    Object.keys(bal).forEach(function (i) {
      if (bal[i] > 0) cr.push({ id: i, v: bal[i] });
      else if (bal[i] < 0) de.push({ id: i, v: -bal[i] });
    });
    var out = [];
    function bigFirst(a, b) { return b.v - a.v || (a.id < b.id ? -1 : 1); }
    while (cr.length && de.length) {
      cr.sort(bigFirst); de.sort(bigFirst);
      var c = cr[0], d = de[0], x = Math.min(c.v, d.v);
      out.push({ from: d.id, to: c.id, amount: x });
      c.v -= x; d.v -= x;
      if (c.v === 0) cr.shift();
      if (d.v === 0) de.shift();
    }
    return out;
  }

  function totals(group) {
    var spent = 0, byCat = {}, paid = {}, share = {};
    (group.expenses || []).forEach(function (e) {
      spent += e.amount;
      byCat[e.cat || 'other'] = (byCat[e.cat || 'other'] || 0) + e.amount;
      paid[e.payer] = (paid[e.payer] || 0) + e.amount;
      var sh = computeShares(e);
      Object.keys(sh).forEach(function (i) { share[i] = (share[i] || 0) + sh[i]; });
    });
    return { spent: spent, byCat: byCat, paid: paid, share: share };
  }

  // Remove a member only if they have no activity; otherwise caller must refuse.
  function memberInUse(group, id) {
    return (group.expenses || []).some(function (e) {
      return e.payer === id || computeShares(e)[id] > 0;
    }) || (group.payments || []).some(function (p) { return p.from === id || p.to === id; });
  }

  function csvEscape(v) { v = String(v == null ? '' : v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }
  function toCSV(group) {
    var name = {};
    group.members.forEach(function (m) { name[m.id] = m.name; });
    var rows = [['date', 'description', 'category', 'amount', 'paid_by', 'split']];
    group.expenses.forEach(function (e) {
      var sh = computeShares(e);
      rows.push([e.date, e.desc, e.cat, (e.amount / 100).toFixed(2), name[e.payer] || '',
        Object.keys(sh).map(function (i) { return (name[i] || '?') + ':' + (sh[i] / 100).toFixed(2); }).join(' | ')]);
    });
    return rows.map(function (r) { return r.map(csvEscape).join(','); }).join('\n');
  }

  // Sanitise imported JSON into a safe state. Returns {groups} or null.
  function sanitizeImport(data) {
    if (!data || !Array.isArray(data.groups)) return null;
    var str = function (v, n) { return String(v == null ? '' : v).slice(0, n || 80); };
    var num = function (v) { v = Number(v); return isFinite(v) ? Math.round(v) : 0; };
    var groups = data.groups.slice(0, 200).map(function (g) {
      var members = (Array.isArray(g.members) ? g.members : []).slice(0, 60).map(function (m) {
        return { id: str(m.id, 40), name: str(m.name, 40) };
      }).filter(function (m) { return m.id && m.name; });
      var ids = {}; members.forEach(function (m) { ids[m.id] = 1; });
      var expenses = (Array.isArray(g.expenses) ? g.expenses : []).slice(0, 5000).map(function (e) {
        return { id: str(e.id, 40), desc: str(e.desc, 100), amount: num(e.amount), payer: str(e.payer, 40),
          date: str(e.date, 10), cat: str(e.cat, 20) || 'other', split: e.split && typeof e.split === 'object' ? e.split : { type: 'equal', who: [] } };
      }).filter(function (e) { return e.id && ids[e.payer] && !validateExpense(e); });
      var payments = (Array.isArray(g.payments) ? g.payments : []).slice(0, 5000).map(function (p) {
        return { id: str(p.id, 40), from: str(p.from, 40), to: str(p.to, 40), amount: num(p.amount), date: str(p.date, 10) };
      }).filter(function (p) { return p.id && ids[p.from] && ids[p.to] && p.amount > 0 && p.from !== p.to; });
      return { id: str(g.id, 40) || ('g' + Math.random().toString(36).slice(2, 9)), name: str(g.name, 60) || 'Group',
        emoji: str(g.emoji, 4), currency: str(g.currency, 4) || 'EGP', members: members, expenses: expenses, payments: payments };
    });
    return { groups: groups };
  }

  var api = { toMinor: toMinor, fromMinor: fromMinor, distribute: distribute, computeShares: computeShares,
    validateExpense: validateExpense, balances: balances, settle: settle, totals: totals,
    memberInUse: memberInUse, toCSV: toCSV, sanitizeImport: sanitizeImport };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.Core = api;
})(typeof self !== 'undefined' ? self : this);
