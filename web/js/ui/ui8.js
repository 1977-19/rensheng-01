/* Version 1.9 interface: work that runs itself every year (optional), the official residence on the assets page,
   and a souvenir photo from space on the life report. */
(function () {
  'use strict';
  var h = G.h, UI = G.UI, T = UI.T, tap = UI.tap, N = G.N;
  function S() { return G.S; }
  function P() { return G.S && G.S.p; }

  /* ---------------- the anime portraits (with flower wreaths) become the default, once ---------------- */
  var ls8 = G.loadSettings;
  G.loadSettings = function () { var r = ls8.apply(this, arguments), st = G.settings; if (st && !st.av19) { st.av19 = 1; if (st.avStyle !== 'classic') st.avStyle = 'anime'; G.saveSettings(); } return r; };

  /* ---------------- automatic yearly work ---------------- */
  var NOAUTO = /quit|sell|resign|retire|discharge|abdicate|rename|_mgr_|ipo|ceo|cut|co_back|loan|repay|dividend|invest$/;
  function autos() { var p = P(); p.autoActs = p.autoActs || []; return p.autoActs; }
  function findAct(id) {
    var L = [];
    try { L = L.concat(G.lifeActs() || []); } catch (e) { }
    G.ACT_CATS.forEach(function (c) { L = L.concat(c.items); });
    return L.filter(function (a) { return a && a.id === id; })[0];
  }
  var da8 = UI.doAction;
  UI.doAction = async function (a, npc) {
    var p = P(), before = p ? p.energy : 0;
    var r = await da8.apply(this, arguments);
    p = P();
    try {
      if (p && !G.S.dead && !npc && !UI._autoRun && G.settings.autoRepeat && G.isWorkAct && G.isWorkAct(a) && p.energy < before && !NOAUTO.test(a.id) && !autos().some(function (x) { return x.id === a.id; })) {
        var nm = typeof a.n === 'function' ? a.n() : a.n;
        var i = await UI.event({ title: G.L('以后每年自动做？|Do This Every Year?'), icon: '🔁', text: G.L('开启后，每年开始时会自动「{a}」，固定花{e}点体力，一直到你取消为止（在“活动”页可以取消）。|Each new year you\'ll automatically "{a}" for {e} energy, until you cancel it (on the Activities page).', { a: nm, e: a.e || 0 }), opts: [{ t: G.L('是，以后自动做|Yes, every year') }, { t: G.L('否|No') }] });
        if (i === 0) { autos().push({ id: a.id, n: nm, e: a.e || 0 }); UI.toast(G.L('已设为每年自动执行|Set to run every year')); }
      }
    } catch (e) { console.error(e); }
    return r;
  };
  async function runAutos() {
    var p = P(); if (!p || G.S.dead || p.jail || !autos().length) return;
    var lines = [], keep = [];
    var saved = { pick: UI.pick, game: UI.game, confirm: UI.confirm, input: UI.input, event: UI.event, result: UI.result, amount: UI.amount };
    UI._autoRun = 1;
    UI.pick = async function (o) { var it = (o && o.items) || []; for (var k = 0; k < it.length; k++) if (!it[k].dis) return k; return -1; };
    UI.game = async function () { var s = G.rf(.45, .85); return { score: s, win: s > .55, mult: 1 + s }; };
    UI.confirm = async function () { return true; };
    UI.input = async function (o) { return o && o.def; };
    UI.event = async function () { return 0; };
    UI.amount = async function () { return null; };
    UI.result = async function (o) { if (o && o.text) lines.push({ t: o.title, x: o.text }); };
    try {
      // check what can still be done this year, then keep cycling through the list until the energy runs out
      var live = [];
      autos().forEach(function (x) {
        var a = findAct(x.id);
        if (!a || (a.if && !a.if()) || (a.lock && a.lock())) { lines.push({ t: x.n, x: G.L('今年做不了，已从自动列表中移除。|Not possible this year — removed from the automatic list.') }); return; }
        keep.push(x); live.push({ x: x, a: a, n: 0 });
      });
      for (var round = 0; round < 15 && live.length && !G.S.dead; round++) {
        var ran = false;
        for (var i = 0; i < live.length; i++) {
          var it = live[i], a = it.a, e = a.e || 0;
          if (a.if && !a.if()) continue;
          if (e <= 0 && it.n > 0) continue; // free actions only once a year
          if (p.energy < e || (G.isWorkAct(a) && G.workUsed() + e > G.WORK_CAP)) continue;
          var price = a.$ ? G.$(a.$) : 0; if (price && !G.canPay(price)) continue;
          p.energy -= e; if (G.isWorkAct(a)) G.addWork(e); if (price) G.charge(price);
          var r = await a.run(a);
          if (r === 'cancel') { p.energy += e; if (price) G.addMoney(price); it.stop = 1; live.splice(i, 1); i--; continue; }
          it.n++; ran = true;
          if (G.S.dead) break;
        }
        if (!ran) break;
      }
      var head = live.filter(function (it) { return it.n > 0; }).map(function (it) { return G.L('{a} ×{n}（共{e}体力）|{a} ×{n} ({e} energy)', { a: it.x.n, n: it.n, e: it.n * (it.a.e || 0) }); });
      if (head.length) lines.unshift({ t: G.L('今年自动完成|Done automatically this year'), x: G.join([G.join(head, '；', '; '), G.L('。剩余体力{r}。|. Energy left: {r}.', { r: Math.max(0, Math.round(p.energy)) })], '', '') });
      P().autoActs = keep;
    } catch (err) { console.error(err); }
    finally { Object.assign(UI, saved); UI._autoRun = 0; }
    G.ach && G.ach.check && G.ach.check(); G.save('auto'); G.emit('change');
    if (lines.length && !G.S.dead) {
      await new Promise(function (res) {
        var md = UI.modal({ title: G.L('自动安排的工作|Your Automatic Work'), icon: '🔁', body: h('div', { class: 'autolist' }, lines.map(function (l) { return h('div', { class: 'card' }, h('b', null, T(l.t)), h('p', null, T(l.x))); })), foot: [h('button', { class: 'opt solid', onclick: tap(function () { md.close(); res(); }) }, T('好的|OK'))] });
        UI.tapAnywhere && UI.tapAnywhere(md, function () { md.close(); res(); });
      });
    }
    if (G.S.dead) { UI.closeAllSheets(); await G.ending.run(); }
  }
  UI.runAutos = runAutos;
  var age8 = G.ageUp;
  G.ageUp = async function () {
    var r = await age8.apply(this, arguments);
    try { if (G.S && !G.S.dead && typeof document !== 'undefined' && document.querySelector('.desk')) await runAutos(); } catch (e) { console.error(e); }
    return r;
  };
  // the list (and a way to stop each one) sits on the activities page
  var ta8 = UI.tabActivities;
  UI.tabActivities = function () {
    var r = ta8.apply(this, arguments), p = P();
    try {
      if (p && autos().length) {
        var sheets = document.querySelectorAll('.sheet'), sh = sheets[sheets.length - 1], body = sh && sh.querySelector('.sb');
        if (body) {
          var card = h('div', { class: 'card autocard' }, h('b', null, '🔁 ' + T('每年自动执行|Running every year')), autos().map(function (x) {
            return h('div', { class: 'autorow' }, h('span', null, T(x.n) + ' · ⚡' + x.e), h('button', { class: 'pk', onclick: tap(function () { P().autoActs = autos().filter(function (y) { return y !== x; }); UI.toast(G.L('已取消|Cancelled')); card.remove(); UI.tabActivities(); }) }, T('取消|Stop')));
          }));
          body.insertBefore(card, body.firstChild.nextSibling || null);
        }
      }
    } catch (e) { console.error(e); }
    return r;
  };

  /* ---------------- the official residence ---------------- */
  var as8 = UI.tabAssets;
  UI.tabAssets = function () {
    var r = as8.apply(this, arguments), p = P();
    try {
      if (p && G.isRuler && G.isRuler()) {
        var sheets = document.querySelectorAll('.sheet'), sh = sheets[sheets.length - 1], body = sh && sh.querySelector('.sb');
        if (body) body.insertBefore(h('div', { class: 'card palace' }, h('div', { class: 'pic' }, '🏰'), h('div', null, h('b', null, T('官邸|Official Residence')), h('div', null, T(G.palaceOf(p.country))), h('small', null, T('国家所有，供在位者居住|State-owned, home to whoever holds office')))), body.firstChild);
      }
    } catch (e) { console.error(e); }
    return r;
  };

  /* ---------------- a souvenir photo from space ---------------- */
  G.ACT_CATS.forEach(function (c) {
    if (c.id !== 'space') return;
    c.items.forEach(function (a) {
      if (a.v19) return; a.v19 = 1; var r0 = a.run;
      a.run = async function () {
        var p = P(), m0 = p.money, r = await r0.apply(this, arguments);
        if (P() === p && p.money < m0) { p.flags.spaceLog = p.flags.spaceLog || []; p.flags.spaceLog.push({ id: a.id, n: a.n, y: S().year, age: p.age }); }
        return r;
      };
    });
  });
  function spacePhoto(p, trip) {
    var dest = /mars/.test(trip.id) ? 'mars' : /moon/.test(trip.id) ? 'moon' : 'earth';
    var face = '';
    var d0 = G.S.dead, a0 = p.age; try { G.S.dead = false; p.age = trip.age; face = G.avatarOf(p); } catch (e) { } finally { G.S.dead = d0; p.age = a0; }
    var planet = dest === 'mars' ? '<circle cx="250" cy="250" r="120" fill="url(#mars)"/><circle cx="210" cy="220" r="14" fill="#9b3b22" opacity=".5"/><circle cx="290" cy="290" r="22" fill="#9b3b22" opacity=".4"/>'
      : dest === 'moon' ? '<circle cx="255" cy="250" r="115" fill="url(#moon)"/><circle cx="220" cy="215" r="16" fill="#9a9aa6" opacity=".6"/><circle cx="290" cy="280" r="24" fill="#9a9aa6" opacity=".5"/><circle cx="250" cy="300" r="10" fill="#9a9aa6" opacity=".6"/><circle cx="70" cy="70" r="26" fill="url(#earth)"/>'
      : '<circle cx="250" cy="300" r="190" fill="url(#earth)"/><path d="M120 250 C170 220 210 260 250 240 S330 210 370 250" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="10" stroke-linecap="round"/>';
    var stars = ''; for (var i = 0; i < 40; i++) stars += '<circle cx="' + Math.round(Math.random() * 400) + '" cy="' + Math.round(Math.random() * 300) + '" r="' + (Math.random() * 1.6 + .4).toFixed(1) + '" fill="#fff" opacity="' + (Math.random() * .6 + .3).toFixed(2) + '"/>';
    var svg = '<svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg"><defs>' +
      '<radialGradient id="earth" cx=".35" cy=".3"><stop offset="0" stop-color="#9fe3ff"/><stop offset=".55" stop-color="#2f7fd1"/><stop offset="1" stop-color="#173f8a"/></radialGradient>' +
      '<radialGradient id="moon" cx=".35" cy=".3"><stop offset="0" stop-color="#f4f2ea"/><stop offset="1" stop-color="#8d8a92"/></radialGradient>' +
      '<radialGradient id="mars" cx=".35" cy=".3"><stop offset="0" stop-color="#ffb07a"/><stop offset="1" stop-color="#b3442a"/></radialGradient>' +
      '<linearGradient id="sky8" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b0b2b"/><stop offset="1" stop-color="#2a1a5e"/></linearGradient></defs>' +
      '<rect width="400" height="300" fill="url(#sky8)"/>' + stars + '<g transform="translate(150 0)">' + planet + '</g></svg>';
    return h('div', { class: 'spacephoto' },
      h('div', { class: 'sp-bg', html: svg }),
      h('div', { class: 'sp-me' }, h('div', { class: 'helmet' }, h('div', { class: 'face', html: face }))),
      h('div', { class: 'sp-cap' }, T(trip.n) + ' · ' + trip.y + ' · ' + T('{a}岁|age {a}', { a: trip.age })));
  }
  var end8 = UI.ending;
  UI.ending = function (d) {
    var r = end8.apply(this, arguments);
    try {
      var p = P(), log = p && p.flags.spaceLog;
      if (log && log.length) {
        var rank = ['sp_zerog', 'sp_sub', 'sp_iss', 'sp_moon', 'sp_mars'];
        var best = log.slice().sort(function (a, b) { return rank.indexOf(b.id) - rank.indexOf(a.id); })[0];
        var rep = document.querySelector('.report');
        if (rep) rep.parentNode.insertBefore(h('div', { class: 'card spacecard' }, h('h5', null, T('🚀 太空纪念照|🚀 A Photo from Space')), spacePhoto(p, best), log.length > 1 ? h('small', null, T('一生去过太空{n}次|{n} trips beyond the sky in one life', { n: log.length })) : null), rep.nextSibling);
      }
    } catch (e) { console.error(e); }
    return r;
  };
})();
