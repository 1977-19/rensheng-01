/* Version 3.5 interface: what your money means. Tap your money on the journal for "your fortune could buy…";
   the eye next to it hides the number. The assets page lists the same comparisons. */
(function () {
  'use strict';
  var h = G.h, UI = G.UI, T = UI.T, tap = UI.tap;
  if (!h || !UI) return;
  // [USD price, icon, singular label]
  var THINGS = [
    [4, '🧋', '杯奶茶|cups of bubble tea'],
    [1100, '📱', '部最新款手机|of the latest phones'],
    [45000, '🚗', '辆电动车|electric cars'],
    [350000, '🏎️', '辆超跑|supercars'],
    [1500000, '🏠', '套一线城市的房子|flats in a big city'],
    [30000000, '🏝️', '座私人小岛|private islands'],
    [65000000, '✈️', '架私人飞机|private jets'],
    [400000000, '🛥️', '艘超级游艇|superyachts'],
    [4000000000, '🏀', '支NBA球队|NBA teams'],
    [80000000000, '🏢', '家世界五百强公司|Fortune 500 companies']
  ];
  function count(n) { return n >= 1e8 ? T('{n}亿|{n}00M', { n: (n / 1e8).toFixed(n >= 1e9 ? 0 : 1) }) : n >= 1e4 ? T('{n}万|{n}0K', { n: (n / 1e4).toFixed(n >= 1e5 ? 0 : 1) }) : String(Math.floor(n)); }
  G.wealthSays = function (nw) {
    var usd = nw / G.$(1), out = [];
    if (usd <= 0) return [{ i: '🫙', t: G.L('现在的你，连一杯奶茶都得掂量掂量。|Right now even a bubble tea needs thinking about.') }];
    var fit = THINGS.filter(function (x) { return usd >= x[0]; });
    var top = fit.slice(-3).reverse();
    top.forEach(function (x) { out.push({ i: x[1], t: G.L('{n}{w}|{n} {w}', { n: count(usd / x[0]), w: x[2] }) }); });
    // years of an average salary
    var avg = (G.C[G.S.p.country] && G.C[G.S.p.country].wage) ? G.C[G.S.p.country].wage : G.$(12000);
    var yrs = nw / Math.max(1, avg);
    if (yrs >= 2) out.push({ i: '👷', t: G.L('一个普通人不吃不喝要干{y}年|An average worker would need {y} years of wages', { y: count(yrs) }) });
    if (usd >= 1e9) out.push({ i: '🌍', t: G.L('每天花一百万，能花{d}年|At a million a day it would last {d} years', { d: count(usd / 1e6 / 365) }) });
    return out;
  };
  UI.wealthCard = function () {
    var p = G.S.p, nw = G.netWorth();
    var body = h('div', { class: 'wsays' }, h('div', { class: 'wtot' }, G.settings.hideMoney ? '****' : G.fm(nw)), h('div', { class: 'wsub' }, T('净资产|Net worth')),
      G.wealthSays(nw).map(function (x) { return h('div', { class: 'wsx' }, h('span', null, x.i), h('span', null, T(x.t))); }));
    var md = UI.modal({ title: T('你的身家|Your Fortune'), icon: '💰', body: body, kind: 'v3', foot: [h('button', { class: 'opt solid', onclick: tap(function () { md.close(); }) }, T('知道了|OK'))], close: true });
    void p;
  };
})();
