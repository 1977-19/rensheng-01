/* Version 1.4 interface: a yearly limit on work with gentle suggestions, study-abroad advice in country lists,
   the departed in the relations list, graves with flowers, a simpler activities page grouped by life area,
   real life stories on profiles, a de-duplicated hall of fame. */
(function () {
  'use strict';
  var h = G.h, UI = G.UI, T = UI.T, tap = UI.tap, N = G.N;
  function S() { return G.S; }

  /* ---------------- work: at most 60 energy a year ---------------- */
  var SUGGEST = [
    { id: 'sg_partner', t: '陪伴侣约会|A date with your partner', i: '💞', e: 10, if: function () { return !!N.partner(); }, run: function () { var n = N.partner(); N.addLove(n, 6); N.touch && N.touch(n); G.addStat('happy', 4); return G.L('你们去吃了第一次约会的那家店。{n}笑得像当年一样。|You went back to the place of your first date. {n} smiled just like back then.', { n: n.name }); } },
    { id: 'sg_kids', t: '陪孩子玩一天|A day with the kids', i: '🧸', e: 10, if: function () { return N.rel('child').length > 0; }, run: function () { N.rel('child').forEach(function (k) { N.addAff(k, 4); }); G.addStat('happy', 5); return G.L('你们在公园待了一整天，回家时孩子在车上睡着了。|You spent the whole day in the park; the kids fell asleep in the car on the way home.'); } },
    { id: 'sg_parents', t: '回家陪爸妈吃饭|Dinner with your parents', i: '🍲', e: 8, if: function () { return N.rel('father', 'mother').length > 0; }, run: function () { N.rel('father', 'mother').forEach(function (n) { N.addAff(n, 5); }); G.addStat('happy', 3); return G.L('妈妈做了一桌你爱吃的菜。|Mom cooked all your favourite dishes.'); } },
    { id: 'sg_outdoor', t: '去郊外呼吸新鲜空气|Get out into the fresh air', i: '🌲', e: 8, run: function () { G.addStat('health', 4); G.addStat('happy', 4); G.addStat('stress', -8); return G.L('山里的空气是甜的。你很久没有睡得这么好了。|The mountain air tasted sweet. You slept better than you had in ages.'); } },
    { id: 'sg_sleep', t: '什么也不做，好好休息|Do nothing and rest', i: '😴', e: 5, run: function () { G.addStat('health', 2); G.addStat('stress', -10); return G.L('你睡到了自然醒。|You slept until you woke on your own.'); } }
  ];
  async function suggest(used) {
    var p = S().p, L = SUGGEST.filter(function (s) { return !s.if || s.if(); });
    if (!L.some(function (s) { return p.energy >= s.e; })) { UI.toast(G.L('今年的工作体力已用完（上限{c}点）。|This year\'s work energy is used up (limit {c}).', { c: G.WORK_CAP })); return; }
    var i = await UI.pick({ title: G.L('今年的工作已经够拼了|You\'ve Worked Enough This Year'),
      text: G.L('今年你已经在工作和公司上花了{u}点体力（每年上限{c}点）。剩下的体力留给生活吧：|You\'ve spent {u} energy on work and business this year (limit {c}). Give the rest to your life:', { u: used, c: G.WORK_CAP }),
      items: L.map(function (s) { return { t: G.L(s.t), sub: '⚡' + s.e, icon: s.i, dis: p.energy < s.e }; }) });
    if (i < 0) return;
    var s = L[i]; if (p.energy < s.e) return;
    p.energy -= s.e; G.dStart && G.dStart(); var txt = s.run(); var dl = G.dEnd ? G.dEnd() : [];
    await G.result(s.t, txt, null, dl, s.i); G.save('auto'); G.emit('change');
  }
  var da5 = UI.doAction;
  UI.doAction = async function (a, npc) {
    var p = S() && S().p;
    if (p && !npc && G.isWorkAct && G.isWorkAct(a) && !(a.lock && a.lock())) {
      var used = G.workUsed();
      if (used + (a.e || 0) > G.WORK_CAP) { await suggest(used); return; }
      var before = p.energy, r = await da5.apply(this, arguments);
      if (S() && S().p === p && p.energy < before) G.addWork(before - p.energy);
      return r;
    }
    return da5.apply(this, arguments);
  };

  /* ---------------- study-abroad advice inside country lists ---------------- */
  var pk5 = UI.pick;
  UI.pick = function (o) { if (G._advKid && G.adviseCountries) o = G.adviseCountries(Object.assign({}, o)); return pk5.call(this, o); };
  G.UI.pick = UI.pick;

  /* ---------------- activities, grouped by area of life ---------------- */
  var AREAS = [
    ['工作与事业|Work & Career', ['hustle', 'service', 'mega', 'honor', 'reign']],
    ['家庭与感情|Family & Love', ['family', 'social', 'elite']],
    ['生活|Everyday Life', ['health', 'fun', 'learn', 'travel']],
    ['钱与家|Money & Home', ['money', 'shop', 'move']]
  ];
  function visibleItem(a) { var p = S().p; if (a.a && (p.age < a.a[0] || p.age > a.a[1])) return false; if (a.era && G.eraOk && !G.eraOk(a.era)) return false; if (G.statusBlocks && G.statusBlocks(a)) return false; if (a.if && !a.if()) return false; return true; }
  UI.tabActivities = function () {
    UI.sheet('活动|Activities', function (b) {
      var used = {};
      var wu = G.workUsed ? G.workUsed() : 0;
      b.appendChild(h('div', { class: 'wcap' }, h('span', null, T('今年工作体力|Work energy this year')), h('div', { class: 'bar' }, h('i', { class: 'c-gold', style: { width: Math.min(100, wu / G.WORK_CAP * 100) + '%' } })), h('b', null, wu + '/' + G.WORK_CAP)));
      function row(c) {
        used[c.id] = 1;
        var lock = c.lock ? c.lock() : null, n = c.items.filter(visibleItem).length;
        if (!n && !lock) return null;
        return h('button', { class: 'row' + (lock ? ' lock dis' : ''), onclick: tap(function () { if (lock) { UI.toast(lock); return; } UI.catPage(c); }) },
          h('div', { class: 'ic' }, c.i), h('div', { class: 'tx' }, h('div', { class: 't' }, T(c.n)), lock ? h('div', { class: 's wrap' }, T(lock)) : null), h('div', { class: 'rt' }, h('span', { class: 'chip' }, String(n))));
      }
      AREAS.forEach(function (ar) {
        var rows = ar[1].map(function (id) { var c = G.ACT_CATS.filter(function (x) { return x.id === id; })[0]; return c ? row(c) : null; }).filter(Boolean);
        if (!rows.length) return;
        b.appendChild(h('div', { class: 'grp' }, T(ar[0])));
        rows.forEach(function (r) { b.appendChild(r); });
      });
      var rest = G.ACT_CATS.filter(function (c) { return !used[c.id]; }).map(row).filter(Boolean);
      if (rest.length) { b.appendChild(h('div', { class: 'grp' }, T('其他|More'))); rest.forEach(function (r) { b.appendChild(r); }); }
    });
  };

  /* ---------------- the departed, in the relations list ---------------- */
  var tr5 = UI.tabRelations;
  UI.tabRelations = function () {
    var r = tr5.apply(this, arguments);
    var sheets = document.querySelectorAll('.sheet'), sh = sheets[sheets.length - 1], body = sh && sh.querySelector('.sb');
    var gone = G.graves ? G.graves() : [];
    if (body && gone.length) {
      body.appendChild(h('div', { class: 'grp' }, T('已故的人|In Memory') + ' ' + gone.length));
      gone.forEach(function (n) {
        body.appendChild(h('button', { class: 'row gone', onclick: tap(function () { if (UI.grave) UI.grave(n); }) },
          h('div', { class: 'avwrap' }, h('div', { class: 'avs', html: G.avatarOf(n) })),
          h('div', { class: 'tx' }, h('div', { class: 't' }, T(n.name)), h('div', { class: 's' }, T(N.relName(n)) + ' · ' + (n.by || '?') + '–' + (n.died || '?') + (n.flowers ? ' · 💐' + n.flowers : ''))),
          h('div', { class: 'rt' }, h('span', { class: 'chip' }, T('扫墓|Visit')))));
      });
    }
    return r;
  };
  // the well-remembered get more flowers
  var gv5 = G.graves;
  if (gv5) G.graves = function () {
    return gv5.apply(this, arguments).map(function (n) {
      if (n.flowerBase == null) {
        var w = n.wealth || 0, job = String(n.job || ''), f = 2;
        if (w > G.$(1e6)) f += 6; else if (w > G.$(1e5)) f += 3;
        if (/国王|女王|King|Queen|董事|总裁|教授|将|院士|President|Chair|General/.test(job)) f += 6;
        if (n.rel === 'father' || n.rel === 'mother' || n.rel === 'spouse') f += 3;
        n.flowerBase = f + G.ri(0, 3);
      }
      n.flowers = Math.max(n.flowers || 0, n.flowerBase);
      return n;
    });
  };

  /* ---------------- hall of fame: once per life ---------------- */
  var rc5 = UI.records;
  UI.records = function () { if (G.loadMeta) G.loadMeta(); return rc5.apply(this, arguments); };

  /* ---------------- profiles: what really happened to them ---------------- */
  var ni5 = G.npcInfo;
  if (ni5) G.npcInfo = function (n) {
    var r = (ni5.apply(this, arguments) || []).filter(function (x) { return x && x[0] !== '人生经历|Their life lately'; });
    if (n.richPers) r.push(['性格（家境）|Character (upbringing)', n.richPers]);
    if (n.rel === 'child' && G.filial) r.push(['孝顺程度|Devotion to you', String(G.filial(n))]);
    if (n.story && n.story.length) r.push(['经历|What happened', n.story.slice(-8).reverse().map(function (x) { return x[0] + ' ' + G.T(x[1]); }).join('\n')]);
    return r;
  };
})();
