/* Main journal screen + boot */
(function () {
  'use strict';
  var h = G.h, UI = G.UI, T = UI.T, tap = UI.tap;
  var M = { on: false, el: {}, shown: 30 };
  UI.main = function () {
    UI.closeAllSheets();
    M.on = true; M.shown = 30;
    var hdr = h('div', { class: 'hdr' }), stats = h('div', { class: 'stats' }), diary = h('div', { class: 'diary lined' }), jbar = h('div', { class: 'jailbar' });
    var stamp = h('button', { class: 'pencil', 'aria-label': T('结束今年|End this year'), onclick: tap(nextYear) });
    var tools = h('div', { class: 'deskbar' });
    var tabs = h('div', { class: 'tabs' },
      tabBtn('t-yellow', '财产|Assets', UI.tabAssets), tabBtn('t-red', '关系|People', UI.tabRelations),
      tabBtn('t-blue', '人生|Life', UI.tabLife), tabBtn('t-green', '活动|Activities', UI.tabActivities));
    M.el = { hdr: hdr, stats: stats, diary: diary, stamp: stamp, tools: tools, jbar: jbar };
    var book = h('div', { class: 'book' }, h('i', { class: 'ring r1' }), h('i', { class: 'ring r2' }), h('i', { class: 'ring r3' }), h('i', { class: 'ring r4' }),
      h('div', { class: 'page' }, h('div', { class: 'ribbon' }, h('span', null, T('我的一生|My Life'))), hdr, stats, jbar, diary, h('div', { class: 'cage', 'aria-hidden': 'true' })));
    var root = h('div', { class: 'desk' }, h('i', { class: 'leaf l1' }), h('i', { class: 'leaf l2' }), tools, book, tabs, h('div', { class: 'pencilrow' }, stamp));
    UI.screen(root);
    render(true);
  };
  function tabBtn(cls, label, fn) { return h('button', { class: 'tab ' + cls, onclick: tap(function () { if (!UI.busy && !G.busy) fn(); }) }, h('span', null, T(label))); }
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
    // header
    var hd = M.el.hdr; hd.innerHTML = '';
    hd.appendChild(h('div', { class: 'av', html: G.avatarOf(p) }));
    // the name gets the whole width; money and energy sit on their own line underneath
    var nmEl = h('span', { class: 'nmt' }, T(p.name));
    hd.appendChild(h('div', { class: 'who' },
      h('div', { class: 'nm' }, nmEl, v ? h('span', { class: 'vipmark' }, 'VIP' + v) : null),
      h('div', { class: 'ttl' }, G.C[p.country].flag + ' ' + T(G.title()) + (S.gen > 1 ? ' · ' + T('第{g}代|Gen {g}', { g: S.gen }) : '')),
      h('div', { class: 'purse2' },
        h('div', { class: 'money num' + (p.money < 0 ? ' neg' : '') }, h('i', { class: 'note' }), G.fm(p.money)),
        h('div', { class: 'energy' }, h('span', { class: 'lbl' }, T('体力|Energy')), h('span', { class: 'bar' }, h('i', { style: { width: (p.energy / Math.max(1, p.emax) * 100) + '%' } }), h('b', { class: 'num' }, p.energy + '/' + p.emax))))));
    requestAnimationFrame(function () { UI.fitText(nmEl, 22, 12); });
    var un = G.chat.unread(), tb = M.el.tools; tb.innerHTML = '';
    tb.appendChild(h('div', { class: 'agechip num' }, T('{a}岁|Age {a}', { a: p.age }), h('small', null, T('{y}年|{y}', { y: G.numEn(S.year) }))));
    tb.appendChild(h('div', { class: 'pills' },
      h('button', { class: 'pill', 'aria-label': T('消息|Messages'), onclick: tap(function () { if (!UI.busy && !G.busy) UI.chatList(); }) }, '💬', un ? h('span', { class: 'badge' }, String(un)) : null),
      h('button', { class: 'pill', 'aria-label': T('菜单|Menu'), onclick: tap(menu) }, '•••')));
    // stats
    var sb = M.el.stats; sb.innerHTML = '';
    G.STAT_KEYS.forEach(function (k) { var d = G.STATS[k], val = Math.round(p.st[k]); sb.appendChild(h('div', { class: 'st' }, h('span', { class: 'l' }, T(d.n)), h('div', { class: 'bar' }, h('i', { class: 'c-' + d.c, style: { width: Math.max(val, 0) + '%' } }), h('b', { class: 'num' }, val + '%')))); });
    // prison: bars over the whole page
    var desk = document.querySelector('.desk'), j = p.jail;
    if (desk) desk.classList.toggle('jailed', !!j);
    var jb = M.el.jbar; jb.innerHTML = '';
    if (j) jb.appendChild(h('div', null, h('b', null, '⛓️ ' + T(j.pn || '监狱|Prison')), h('span', null, T('编号{no} · 刑期{t}年 · 还剩{l}年|No. {no} · {t} yrs · {l} left', { no: j.no || '—', t: j.tot, l: j.left }))));
    // pencil label
    M.el.stamp.innerHTML = '';
    M.el.stamp.appendChild(h('span', { class: 'body' }, h('b', null, T(j ? '熬过这一年|Endure This Year' : '结束今年|End This Year')), h('small', null, T('过完{a}岁|Finish age {a}', { a: p.age }))));
    M.el.stamp.appendChild(h('span', { class: 'tip' }));
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
    var items = [{ t: '💾 存档|💾 Saves', f: UI.saves }, { t: '🏆 成就|🏆 Achievements', f: UI.achievements }, { t: '🏛️ 名人堂|🏛️ Hall of Fame', f: UI.records }, { t: '💠 VIP|💠 VIP', f: UI.vipPage }, { t: '⚙️ 设置|⚙️ Settings', f: UI.settingsPage }];
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
