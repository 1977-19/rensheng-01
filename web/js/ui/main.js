/* Main journal screen + boot */
(function () {
  'use strict';
  var h = G.h, UI = G.UI, T = UI.T, tap = UI.tap;
  var M = { on: false, el: {}, shown: 30 };
  var ICON = {
    assets: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h18v12H3zM3 8l3-4h12l3 4M16 14h2"/></svg>',
    people: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 11a2.5 2.5 0 1 0 0-5M21 20c0-2.6-1.6-4.8-4-5.6"/></svg>',
    life: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21V10M12 10c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6zM12 13c0-3-2.2-5-5-5 0 3 2.2 5 5 5z"/></svg>',
    acts: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z"/></svg>',
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1.1-4.6A8 8 0 1 1 21 12z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M5 12h.01M12 12h.01M19 12h.01"/></svg>'
  };
  UI.ICON = ICON;
  UI.main = function () {
    UI.closeAllSheets();
    M.on = true; M.shown = 30; M.skin = null;
    var hdr = h('div', { class: 'hdr' }), stats = h('div', { class: 'stats' }), diary = h('div', { class: 'diary lined' }), jbar = h('div', { class: 'jailbar' });
    var scene = h('div', { class: 'scene', 'aria-hidden': 'true' });
    var stamp = h('button', { class: 'pencil', 'aria-label': T('结束今年|End this year'), onclick: tap(nextYear) });
    var tools = h('div', { class: 'deskbar' });
    var tabs = h('div', { class: 'tabs' },
      tabBtn('t-yellow', '财产|Assets', ICON.assets, UI.tabAssets), tabBtn('t-red', '关系|People', ICON.people, UI.tabRelations),
      tabBtn('t-blue', '人生|Life', ICON.life, UI.tabLife), tabBtn('t-green', '活动|Activities', ICON.acts, UI.tabActivities));
    M.el = { hdr: hdr, stats: stats, diary: diary, stamp: stamp, tools: tools, jbar: jbar, scene: scene };
    var book = h('div', { class: 'book' }, h('div', { class: 'page' }, scene, h('i', { class: 'bmk', 'aria-hidden': 'true' }), hdr, stats, jbar, diary, h('div', { class: 'cage', 'aria-hidden': 'true' })));
    var root = h('div', { class: 'desk' }, tools, book, tabs, h('div', { class: 'pencilrow' }, stamp));
    UI.screen(root);
    render(true);
  };
  function tabBtn(cls, label, icon, fn) { return h('button', { class: 'tab ' + cls, onclick: tap(function () { if (!UI.busy && !G.busy) fn(); }) }, h('i', { class: 'ti', html: icon }), h('span', null, T(label))); }
  async function nextYear() {
    if (UI.busy || G.busy || !G.S || G.S.dead) return;
    var st = M.el.stamp; st.disabled = true;
    if (G.audio) { G.audio.init(); G.audio.sfx('stamp'); }
    G.native.haptic('medium');
    st.classList.remove('thud'); void st.offsetWidth; st.classList.add('thud');
    await G.ageUp();
    if (M.el.stamp) M.el.stamp.disabled = false;
    if (G.S && !G.S.dead && M.on) render(false);
  }
  function render(full) {
    if (!G.S || !M.el.hdr || !document.body.contains(M.el.hdr)) { M.on = false; return; }
    var S = G.S, p = S.p, v = G.vip.tier();
    // the journal follows who you are now
    var sk = G.skin();
    if (sk !== M.skin) {
      var first = M.skin == null; M.skin = sk; UI.applySkin(sk);
      M.el.scene.innerHTML = G.skinScene(sk);
      if (!first) { var dk = document.querySelector('.desk'); if (dk) { dk.classList.remove('reskin'); void dk.offsetWidth; dk.classList.add('reskin'); } UI.toast(G.L('人生翻开了新的一页：{n}|A new chapter in your journal: {n}', { n: G.skinData(sk).n })); }
    }
    // header: a polaroid taped to the page, then name, title label, purse
    var hd = M.el.hdr; hd.innerHTML = '';
    hd.appendChild(h('div', { class: 'pol' }, h('i', { class: 'tape' }), h('div', { class: 'av', html: G.avatarOf(p) }), h('i', { class: 'stk', html: G.skinSticker(sk) })));
    var nmEl = h('span', { class: 'nmt' }, T(p.name));
    hd.appendChild(h('div', { class: 'who' },
      h('div', { class: 'nm' }, nmEl),
      h('div', { class: 'ttl' }, h('span', null, G.C[G.residence ? G.residence() : p.country].flag + ' ' + T(G.title()) + (S.gen > 1 ? ' · ' + T('第{g}代|Gen {g}', { g: S.gen }) : ''))),
      (G.megaDone && (G.megaDone() > 0 || (S.lineage || []).length > 0)) ? h('button', { class: 'legacy', onclick: tap(function (e) { e.stopPropagation(); if (UI.familyTree) UI.familyTree(); }) }, T('📜 家族第{g}代|📜 Generation {g}', { g: S.gen || 1 }) + (G.megaDone() ? T(' · 🏛️ 百亿项目{m}项| · 🏛️ {m} mega projects', { m: G.megaDone() }) : '')) : null,
      h('div', { class: 'purse2' },
        h('div', { class: 'money num' + (p.money < 0 ? ' neg' : '') + (G.settings.hideMoney ? ' hid' : ''), onclick: tap(function (e) { e.stopPropagation(); if (UI.wealthCard) UI.wealthCard(); }) }, h('i', { class: 'note' }), G.settings.hideMoney ? '****' : G.fm(p.money), h('button', { class: 'eye', 'aria-label': T('隐藏资产|Hide money'), onclick: tap(function (e) { e.stopPropagation(); G.settings.hideMoney = !G.settings.hideMoney; G.saveSettings(); UI.refresh ? UI.refresh() : G.emit('change'); }) }, G.settings.hideMoney ? '🙈' : '👁️')),
        h('div', { class: 'energy' }, h('span', { class: 'lbl' }, T('体力|Energy')), h('span', { class: 'bar' }, h('i', { style: { width: (p.energy / Math.max(1, p.emax) * 100) + '%' } })), h('b', { class: 'num' }, p.energy + '/' + p.emax)))));
    requestAnimationFrame(function () { UI.fitText(nmEl, 22, 12); });
    var un = G.chat.unread(), tb = M.el.tools; tb.innerHTML = '';
    tb.appendChild(h('div', { class: 'agechip num' }, T('{a}岁|Age {a}', { a: p.age }), h('small', null, T('{y}年|{y}', { y: G.numEn(S.year) }))));
    tb.appendChild(h('div', { class: 'pills' },
      h('button', { class: 'pill', 'aria-label': T('菜单|Menu'), onclick: tap(menu) }, h('i', { class: 'pi', html: ICON.menu }))));
    // stats
    var sb = M.el.stats; sb.innerHTML = '';
    G.STAT_KEYS.forEach(function (k) { var d = G.STATS[k], val = Math.round(p.st[k]); sb.appendChild(h('div', { class: 'st' }, h('span', { class: 'l' }, T(d.n)), h('div', { class: 'bar' }, h('i', { class: 'c-' + d.c, style: { width: Math.max(val, 0) + '%' } })), h('b', { class: 'v num', style: { marginRight: '8px', whiteSpace: 'nowrap' } }, (Math.round(p.st[k] * 10) / 10) + '%'))); });
    // prison: bars over the whole page
    var desk = document.querySelector('.desk'), j = p.jail;
    if (desk) desk.classList.toggle('jailed', !!j);
    var jb = M.el.jbar; jb.innerHTML = '';
    if (j) jb.appendChild(h('div', null, h('b', null, '⛓️ ' + T(j.pn || '监狱|Prison')), h('span', null, T('编号{no} · 刑期{t}年 · 还剩{l}年|No. {no} · {t} yrs · {l} left', { no: j.no || '—', t: j.tot, l: j.left }))));
    // pencil label
    M.el.stamp.innerHTML = '';
    M.el.stamp.appendChild(h('span', { class: 'body' }, h('b', null, T(j ? '熬过这一年|Endure This Year' : '结束今年|End This Year')), h('small', null, T('过完{a}岁 · 盖章|Finish age {a} · stamp it', { a: p.age }))));
    M.el.stamp.appendChild(h('span', { class: 'tip', html: G.skinSticker(sk) }));
    renderDiary();
  }
  function renderDiary() {
    var S = G.S, d = M.el.diary, L = S.log;
    var atBottom = d.scrollHeight - d.scrollTop - d.clientHeight < 80;
    d.innerHTML = '';
    var start = Math.max(0, L.length - M.shown);
    if (start > 0) d.appendChild(h('button', { class: 'more', onclick: tap(function () { M.shown += 40; renderDiary(); d.scrollTop = 0; }) }, T('查看更早的日记|Show earlier entries')));
    for (var i = start; i < L.length; i++) {
      var e = L[i];
      var box = h('div', { class: 'yr' }, h('h4', null, h('span', { class: 'a num' }, T('{a}岁|Age {a}', { a: e.a })), h('span', { class: 'y num' }, T('{y}年|{y}', { y: G.numEn(e.y) }))));
      e.t.forEach(function (line) { var tx = T(line); box.appendChild(h('p', { class: /^【財?财?務?务?】|^\[Finances\]/.test(tx) ? 'n' : '' }, tx)); });
      d.appendChild(box);
    }
    if (atBottom || true) d.scrollTop = d.scrollHeight;
  }
  async function menu() {
    if (UI.busy || G.busy) return;
    var items = [{ t: '💾 存档|💾 Saves', f: UI.saves }, { t: '🏆 成就|🏆 Achievements', f: UI.achievements }, { t: '🏛️ 名人堂|🏛️ Hall of Fame', f: UI.records }, { t: '📜 家族谱系|📜 Family Tree', f: function () { UI.familyTree(); } }, { t: '🕯️ 扫墓|🕯️ Visit the Graves', f: function () { UI.graves(); } }, { t: '⚙️ 设置|⚙️ Settings', f: UI.settingsPage }];
    if (G.canRewind()) items.push({ t: '⏳ 时光倒流到今年年初（VIP）|⏳ Rewind to start of year (VIP)', f: function () { if (G.rewind()) { UI.toast('时光倒流！|Time rewinds!'); UI.main(); } } });
    items.push({ t: '🪦 结束这段人生|🪦 End this life', f: async function () { if (await UI.confirm('结束人生|End This Life', '确定要结束这段人生，查看结局吗？|End this life and see the ending?')) { G.die('自愿结束了人生旅程|Chose to end the journey'); G.ending.run(); } } });
    items.push({ t: '🏠 回到首页|🏠 Home', f: function () { G.save('auto'); UI.start(); } });
    var i = await UI.pick({ title: '菜单|Menu', items: items.map(function (x) { return { t: x.t }; }) });
    if (i >= 0) items[i].f();
  }
  UI.refresh = function () { if (M.on) render(false); UI.refreshSheets(); };
  G.on('change', function () { if (!G.S) return; if (M.on && !G.busy) render(false); else if (M.on) { try { render(false); } catch (e) { } } UI.refreshSheets(); });
  G.on('log', function () { if (M.on && M.el.diary) renderDiary(); });

  /* ---------- boot ---------- */
  function boot() {
    G.loadSettings(); G.loadMeta(); UI.applyTheme();
    if (window.matchMedia) { try { window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { UI.applyTheme(); }); } catch (e) { } }
    var first = function () { G.audio.init(); document.removeEventListener('touchend', first); document.removeEventListener('click', first); };
    document.addEventListener('touchend', first); document.addEventListener('click', first);
    window.addEventListener('error', function (e) { console.error(e.error || e.message); });
    UI.start();
  }
  G.boot = boot;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
