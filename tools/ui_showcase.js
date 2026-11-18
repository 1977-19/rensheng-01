// Screenshots of the 3.0 screens: node tools/ui_showcase.js [outdir] [lang]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const OUT = process.argv[2] || '/tmp/show', LANG = process.argv[3] || 'zh';
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const b = await chromium.launch();
  const page = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.join(__dirname, '..', 'web', 'index.html'));
  await page.evaluate(l => { G.settings.lang = l; G.setLang(l); G.saveSettings(); G.meta.stats.lives = 3; G.meta.seen3 = 1; G.UI.start(); }, LANG);
  await page.waitForTimeout(500);
  const shot = n => page.screenshot({ path: path.join(OUT, LANG + '_' + n + '.png') });
  await shot('a_start');
  await page.evaluate(() => G.UI.whatsNew()); await page.waitForTimeout(900); await shot('b_whatsnew');
  await page.evaluate(() => document.querySelectorAll('.veil').forEach(v => v.remove()));
  // a red second generation life
  await page.evaluate(() => { G.vip.tier = () => 3; G.life.create({ g: 'm', orient: 'het', country: 'cn', tier: 1, by: 1985, origin: 'red', talents: [] }); G.S.year += 9; G.S.p.age = 9; G.UI.main(); });
  await page.waitForTimeout(600); await shot('c_main_red');
  const showEv = async (id, name, fix) => {
    await page.evaluate(([id, fix]) => { const d = G.EV[id]; if (fix) eval(fix); d._if = d.if; d.if = null; d._who = d.who; d.who = null; window.__ev = G.runEvent(id); setTimeout(() => { d.if = d._if; d.who = d._who; }, 50); }, [id, fix]);
    await page.waitForTimeout(900); await shot(name);
    await page.evaluate(() => { const o = document.querySelector('.veil.on .opt'); if (o) o.click(); }); await page.waitForTimeout(1200);
    await shot(name + '_res');
    for (let i = 0; i < 6; i++) { await page.evaluate(() => { const o = document.querySelector('.veil.on .opt'); if (o) o.click(); }); await page.waitForTimeout(500); }
  };
  // keep the identity tag: run with who intact but if bypassed
  await page.evaluate(() => { const d = G.EV.r2_canteen; d.if = null; });
  await page.evaluate(() => { window.__ev = G.runEvent('r2_canteen'); }); await page.waitForTimeout(900); await shot('d_event_red');
  await page.evaluate(() => { const o = document.querySelector('.veil.on .opt'); if (o) o.click(); }); await page.waitForTimeout(1200); await shot('e_result');
  await page.evaluate(() => { document.querySelectorAll('.veil').forEach(v => v.remove()); G.busy = false; });
  await page.evaluate(() => { G.S.p.age = 30; window.__ev = G.runEvent('nyx_red_2'); }); await page.waitForTimeout(900); await shot('f_newyear');
  await page.evaluate(() => { document.querySelectorAll('.veil').forEach(v => v.remove()); });
  // naming a baby
  await page.evaluate(() => { const o = G.N.make({ rel: 'affair', g: 'f', age: 28, aff: 60 }); window.__b = G.love.baby(o, false); });
  await page.waitForTimeout(800); await shot('g_surname');
  await page.evaluate(() => { const o = document.querySelectorAll('.veil.on .row, .veil.on .opt'); if (o[1]) o[1].click(); }); await page.waitForTimeout(900); await shot('h_naming');
  await page.evaluate(() => { document.querySelectorAll('.veil').forEach(v => v.remove()); });
  // a spy-family card and a farewell
  await page.evaluate(() => { G.S.p.age = 16; G.S.p.origin = 'spyfam'; G.S.p.flags.spyfam = 1; const d = G.EV.sf2_truth; d.if = null; window.__ev = G.runEvent('sf2_truth'); }); await page.waitForTimeout(900); await shot('i_event_spy');
  await page.evaluate(() => { document.querySelectorAll('.veil').forEach(v => v.remove()); G.S.p.origin = 'red'; G.S.p.flags.r2Farewell = 0; G.S.p.age = 30; window.__ev = G.runEvent('r2_farewell'); }); await page.waitForTimeout(900); await shot('j_farewell');
  await page.evaluate(() => { document.querySelectorAll('.veil').forEach(v => v.remove()); G.log('📰 2015年，“互联网+”写进了政府工作报告。|📰 2015: "Internet Plus" enters the government work report.'); G.emit('change'); }); await page.waitForTimeout(600); await shot('k_main_news');
  // wizard origins
  await page.evaluate(() => { G.UI.wizard(); }); await page.waitForTimeout(300);
  for (let i = 0; i < 2; i++) { await page.click('.wf .big'); await page.waitForTimeout(250); }
  await page.evaluate(() => { const L = document.querySelector('.wf .mbody, .wf .body, .wf'); const r = [...document.querySelectorAll('.wf .tal')].find(x => /红二代|Political/.test(x.textContent)); if (r) r.scrollIntoView({ block: 'center' }); });
  await page.waitForTimeout(400); await shot('l_wizard_origin');
  console.log('errors', errs.length); errs.slice(0, 10).forEach(e => console.log(' ', e));
  await b.close();
})();
