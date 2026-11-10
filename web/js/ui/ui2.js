/* UI additions: prison screens, school choice dialogs */
(function () {
  'use strict';
  var h = G.h, UI = G.UI, T = UI.T;
  function cageCard() {
    var j = G.S.p.jail;
    return h('div', { class: 'cagecard' }, h('div', { class: 'bars' }), h('div', { class: 'tx' },
      h('b', null, '⛓️ ' + T(j.pn || '监狱|Prison')),
      h('div', null, T('编号{no} · 罪名：{w}|No. {no} · Charge: {w}', { no: j.no || '—', w: j.why })),
      h('div', null, T('刑期{t}年，已服刑{y}年，还剩{l}年 · 改造表现{b}|{t}-year sentence · {y} served · {l} left · Conduct {b}', { t: j.tot, y: j.yrs, l: j.left, b: Math.round(j.beh) })),
      j.seized && j.seized.length ? h('div', { class: 'sz' }, T('被没收：|Seized: ') + j.seized.map(function (x) { return T(x); }).join(T('、|, '))) : null,
      h('div', { class: 'q' }, T('高墙之内，你失去了自由：不能工作、不能购物、不能旅行、不能约会，也见不到想见的人。你能做的，只有熬过每一天。|Behind these walls you have no freedom: no work, no shopping, no travel, no dates, no seeing the people you love. All you can do is get through each day.'))));
  }
  UI.cageCard = cageCard;
  var act0 = UI.tabActivities;
  UI.tabActivities = function () {
    if (!(G.S && G.S.p.jail)) return act0.apply(this, arguments);
    UI.sheet('高墙之内|Behind the Walls', function (b, rec) {
      b.appendChild(cageCard());
      b.appendChild(h('div', { class: 'grp' }, T('狱中能做的事|What you can do inside')));
      G.lifeActs().forEach(function (a) { b.appendChild(UI.actRow(a, function () { rec.refresh(); })); });
    });
  };
  var life0 = UI.tabLife;
  UI.tabLife = function () {
    if (!(G.S && G.S.p.jail)) return life0.apply(this, arguments);
    UI.sheet('人生|Life', function (b, rec) {
      b.appendChild(cageCard());
      G.lifeActs().forEach(function (a) { b.appendChild(UI.actRow(a, function () { rec.refresh(); })); });
    });
  };
  var chat0 = UI.chatList;
  UI.chatList = function () { if (G.S && G.S.p.jail) { UI.toast('监狱里没有手机，只能写信。|No phones in prison — only letters.'); return; } return chat0.apply(this, arguments); };
  var as0 = UI.tabAssets;
  UI.tabAssets = function () {
    if (!(G.S && G.S.p.jail)) return as0.apply(this, arguments);
    UI.sheet('资产|Assets', function (b) {
      var S = G.S, p = S.p, A = S.assets;
      b.appendChild(cageCard());
      var rows = [['现金|Cash', G.fm(p.money)], ['净资产|Net worth', G.fm(G.netWorth())]];
      A.houses.forEach(function (x) { rows.push(['🏠 ' + T(x.n), G.fm(x.val) + (x.mort ? T('（房贷{m}）| (mortgage {m})', { m: G.fm(x.mort) }) : '')]); });
      if (A.company) rows.push(['🏢 ' + T(A.company.name), G.fm(A.company.val)]);
      A.debt.forEach(function (d) { rows.push(['📉 ' + T(d.n), '−' + G.fm(d.amt)]); });
      var dl = h('dl', { class: 'kv' }); rows.forEach(function (r) { dl.appendChild(h('dt', null, T(r[0]))); dl.appendChild(h('dd', null, r[1])); });
      b.appendChild(h('div', { class: 'card' }, h('h5', null, '🔒 ' + T('资产已冻结|Assets Frozen')), h('p', { class: 'muted' }, T('服刑期间，你无法买卖或处置任何财产。房贷还在照常扣款，还不上银行就会收房。|While in prison you can\'t buy, sell or touch anything. Mortgage payments keep coming — miss them and the bank takes the house.')), dl));
    });
  };
})();
