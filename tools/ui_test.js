// Playwright walkthrough: node tools/ui_test.js [outdir] [lang] [years]
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs');
const OUT = process.argv[2] || '/tmp/shots';
const LANG = process.argv[3] || 'zh';
const YEARS = +process.argv[4] || 25;
fs.mkdirSync(OUT, { recursive: true });
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, locale: LANG === 'en' ? 'en-US' : LANG === 'tw' ? 'zh-TW' : 'zh-CN' });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message + '\n' + (e.stack || '').split('\n').slice(0, 3).join('\n')));
  page.on('console', m => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto('file://' + path.join(__dirname, '..', 'web', 'index.html'));
  await page.evaluate(l => { G.settings.lang = l; G.setLang(l); G.settings.autoGame = false; G.saveSettings(); G.UI.start(); }, LANG);
  await page.waitForTimeout(300);
  const shot = async n => page.screenshot({ path: path.join(OUT, LANG + '_' + n + '.png') });
  await shot('01_start');
  // wizard
  await page.click('.start .btns .big.solid');
  for (let i = 0; i < 6; i++) { await page.waitForTimeout(150); if (i === 1) await shot('02_wiz_country'); if (i === 3) await shot('03_wiz_origin'); if (i === 4) await shot('04_wiz_talent'); if (i === 5) await shot('05_wiz_name'); await page.click('.wf .big'); }
  await page.waitForTimeout(400);
  await shot('06_main');
  async function drain(max = 150) {
    for (let k = 0; k < max; k++) {
      await page.waitForTimeout(120);
      const ghost = await page.$('.ghost');
      if (ghost) {
        const b = await page.$$('.ghost .intro .big'); if (b[1]) { try { await b[1].click({ timeout: 2000 }); } catch (e) { } continue; }
        // the instinct test: pick an answer, then move on
        const nx = await page.$('.ghost .gb > .big.solid'); if (nx) { try { await nx.click({ timeout: 2000 }); } catch (e) { } continue; }
        const op = await page.$$('.ghost .gb .opt'); if (op.length) { try { await op[Math.floor(Math.random() * op.length)].click({ timeout: 2000 }); } catch (e) { } await page.waitForTimeout(150); }
        continue;
      }
      const veil = await page.$$('.veil.on');
      if (!veil.length) { await page.waitForTimeout(500); if (!(await page.$$('.veil.on')).length && !(await page.evaluate(() => G.busy))) return; continue; }
      const top = veil[veil.length - 1];
      const sug = await top.$('.sug'); if (sug) { try { await sug.click({ timeout: 2000 }); } catch (e) { } }
      const btn = await top.$('.opt:not([disabled])') || await top.$('.row:not([disabled])') || await top.$('.x');
      if (btn) { try { await btn.click({ timeout: 2000 }); } catch (e) { } } else return;
    }
  }
  let shotYear = 0;
  for (let y = 0; y < YEARS; y++) {
    const dead = await page.evaluate(() => !G.S || G.S.dead);
    if (dead) break;
    await page.evaluate(() => G.UI.closeAllSheets());
    await page.click('.pencil');
    await page.waitForTimeout(200);
    if (y === 3 && !shotYear) { const v = await page.$('.veil'); if (v) { await shot('07_event'); shotYear = 1; } }
    await drain();
    await page.waitForTimeout(150);
    // use some energy via life actions
    if (y % 4 === 3 && await page.$('.foot')) {
      await page.click('.tabs .tab:nth-child(3)');
      await page.waitForTimeout(350);
      if (y === 15) await shot('09_life');
      const rows = await page.$$('.sheet.on .row:not(.dis)');
      if (rows.length) { await rows[Math.floor(Math.random() * rows.length)].click(); await drain(); }
      await page.evaluate(() => G.UI.closeAllSheets()); await page.waitForTimeout(300);
    }
  }
  await shot('08_main_later');
  if (!(await page.$('.foot'))) { await page.evaluate(() => { if (G.S && G.S.dead) { const h = G.life.heirs(); if (h.length) G.life.continueAs(h[0]); else { G.life.create({ g: 'f', country: 'us', tier: 2, by: 1990, origin: 'middle', talents: [] }); } } G.UI.main(); }); await page.waitForTimeout(400); }
  // tabs
  await page.click('.tabs .tab:nth-child(1)'); await page.waitForTimeout(350); await shot('10_assets'); await page.evaluate(() => G.UI.closeAllSheets()); await page.waitForTimeout(300);
  await page.click('.tabs .tab:nth-child(2)'); await page.waitForTimeout(350); await shot('11_people');
  const pr = await page.$('.sheet.on .row'); if (pr) { await pr.click(); await page.waitForTimeout(350); await shot('12_profile'); const chatBtn = await page.$('.veil .ab'); if (chatBtn) { await chatBtn.click(); await page.waitForTimeout(400); const q = await page.$$('.qk button'); if (q[0]) { await q[0].click(); await page.waitForTimeout(1500); } if (q[2]) { await q[2].click(); await page.waitForTimeout(1500); } await shot('13_chat'); } }
  await page.evaluate(() => { document.querySelectorAll('.veil').forEach(v => v.remove()); G.UI.closeAllSheets(); }); await page.waitForTimeout(300);
  await page.click('.tabs .tab:nth-child(4)'); await page.waitForTimeout(350); await shot('14_activities');
  const cat = await page.$('.sheet.on .row:not(.dis)'); if (cat) { await cat.click(); await page.waitForTimeout(350); await shot('15_category'); }
  await page.evaluate(() => G.UI.closeAllSheets()); await page.waitForTimeout(300);
  // mini-games screenshots
  for (const g of ['quiz', 'policy', 'detective', 'fight', 'rhythm', 'mahjong', 'penalty', 'blackjack']) {
    await page.evaluate(id => { window.__gr = null; G.UI.game(id, {}).then(r => window.__gr = r); }, g);
    await page.waitForTimeout(200);
    await page.click('.ghost .intro .big.solid');
    await page.waitForTimeout(g === 'rhythm' ? 1600 : 500);
    await shot('20_game_' + g);
    await page.evaluate(() => { const h = document.querySelector('.ghost'); if (h) h.remove(); });
  }
  // dark mode
  await page.evaluate(() => { G.settings.theme = 'dark'; G.UI.applyTheme(); G.UI.main(); });
  await page.waitForTimeout(300); await shot('30_dark');
  await page.evaluate(() => { G.settings.theme = 'light'; G.UI.applyTheme(); });
  // force ending
  await page.evaluate(() => { G.die('寿终正寝|Died peacefully of old age'); return G.ending.run(); });
  await page.waitForTimeout(800); await shot('40_ending');
  await page.evaluate(() => G.UI.vipPage()); await page.waitForTimeout(400); await shot('41_vip');
  await page.evaluate(() => { G.UI.closeAllSheets(); G.UI.settingsPage(); }); await page.waitForTimeout(400); await shot('42_settings');
  const info = await page.evaluate(() => ({ age: G.S && G.S.p.age, log: G.S && G.S.log.length, lastErr: G.lastError && String(G.lastError.stack || G.lastError) }));
  console.log('state', JSON.stringify(info));
  console.log('errors', errors.length); errors.slice(0, 15).forEach(e => console.log(' -', e));
  await browser.close();
})();
