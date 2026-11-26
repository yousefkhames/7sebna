// Real-browser click-through. Usage: node tests/e2e.js [baseUrl] [shotDir]
const puppeteer = require(process.env.PPT || 'puppeteer-core');
const assert = require('node:assert');
const base = process.argv[2] || 'http://localhost:8123/', shots = process.argv[3] || '/tmp/shots';
require('fs').mkdirSync(shots, { recursive: true });
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: 'new', args: ['--no-sandbox'] });
  const p = await b.newPage(); await p.setViewport({ width: 400, height: 820, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && errs.push(m.text()));
  p.on('dialog', d => d.accept());
  const click = async sel => { await p.waitForSelector(sel); await p.click(sel); await sleep(80); };
  const txt = () => p.evaluate(() => document.body.innerText);
  await p.goto(base, { waitUntil: 'networkidle0' });
  await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'networkidle0' });
  assert.equal(await p.evaluate(() => document.documentElement.dir), 'rtl');
  await p.screenshot({ path: shots + '/01-empty.png' });
  // sample data
  await click('[data-a=sample]'); await p.screenshot({ path: shots + '/02-home.png' });
  await click('.gcard'); await p.screenshot({ path: shots + '/03-expenses.png' });
  assert.ok((await txt()).includes('بنزين'));
  await click('[data-tab=bal]'); await p.screenshot({ path: shots + '/04-balances.png' });
  await click('[data-tab=set]'); await p.screenshot({ path: shots + '/05-settle.png' });
  const nTx = await p.$$eval('.tx', e => e.length); assert.ok(nTx >= 1 && nTx <= 3, 'plan size ' + nTx);
  // pay all, expect all settled
  for (let i = 0; i < nTx; i++) await click('[data-a=pay]');
  assert.ok((await txt()).includes('الكل متصفّي'));
  await click('[data-a=undoPay]'); assert.ok(await p.$('[data-a=pay]'));
  // switch to English
  await click('[data-a=settings]'); await click('[data-a=lang][data-v=en]');
  assert.equal(await p.evaluate(() => document.documentElement.dir), 'ltr');
  await click('[data-a=close]'); assert.ok((await txt()).includes('Settle up'));
  // new expense with percent split + validation
  await click('[data-tab=exp]'); await click('.fab');
  await click('[data-a=esave]'); assert.ok((await txt()).includes('Enter a description'));
  await p.type('#fdesc', 'Pizza night'); await p.type('#famt', '300');
  await click('[data-a=stype][data-v=percent]');
  const inputs = await p.$$('#splits input[data-s]');
  await inputs[0].type('50'); await inputs[1].type('30');
  await click('[data-a=esave]'); assert.ok((await txt()).includes('100'), 'percent error');
  await inputs[2].type('20'); await p.screenshot({ path: shots + '/06-split.png' });
  await click('[data-a=esave]'); await sleep(150);
  assert.ok((await txt()).includes('Pizza night'));
  // edit then delete
  await p.evaluate(() => [...document.querySelectorAll('.exp')].find(e => e.innerText.includes('Pizza')).click()); await sleep(100);
  assert.ok(await p.$('[data-a=edel]')); await click('[data-a=edel]'); await sleep(100);
  assert.ok(!(await txt()).includes('Pizza night'));
  // persistence
  await p.reload({ waitUntil: 'networkidle0' }); assert.ok((await txt()).includes('رحلة دهب'));
  // new group flow
  await click('[data-a=home]'); await click('[data-a=newGroup]');
  await p.type('#gname', 'Flat 4B'); await p.type('#gmem', 'Omar'); await click('[data-a=gaddm]'); await p.type('#gmem', 'Laila');
  await click('[data-a=gsave]'); await sleep(150); assert.ok((await txt()).includes('Flat 4B'));
  await click('[data-a=manage]'); await p.type('#mnew', 'Omar'); await click('[data-a=madd]'); assert.ok((await txt()).includes('already exists'));
  await click('[data-a=close]');
  // dark mode screenshot
  await click('[data-a=settings]'); await click('[data-a=theme][data-v=dark]'); await click('[data-a=close]'); await p.screenshot({ path: shots + '/07-dark.png' });
  assert.deepEqual(errs, [], 'console errors: ' + errs.join('|'));
  await b.close(); console.log('E2E PASS');
})().catch(e => { console.error('E2E FAIL', e.message); process.exit(1); });
