/* Succession: who gets the crown — or the family fortune — depends on whom your parents favor.
   Siblings compete, scheme and tell tales; you can too. Royals may one day reign. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function p() { return S().p; }
  function isRoyal() { var q = p(); return q.origin === 'royal' && !q.flags.exRoyal && !q.flags.trafficked; }
  var RICH = ['royal', 'noble', 'richest', 'tycoon', 'merchant', 'red', 'celebrity', 'mafia'];
  function dynasty() { var q = p(); return RICH.indexOf(q.origin) >= 0 && !q.flags.trafficked; }
  function parents() { return N.rel('father', 'mother').filter(function (n) { return n.alive; }); }
  function sibs() { return N.rel('sibling').filter(function (n) { return n.alive; }); }
  function king() { return N.all(function (n) { return n.alive && (n.rel === 'father' || n.rel === 'mother') && (n.king || n.queen && n.reign); })[0]; }
  /* favor is per parent: the father and the mother each have their own favorite, and each leaves
     their own fortune by their own favor. A half-sibling born outside the marriage is only one parent's child. */
  function kidOf(n, par) { return n.rel === 'sibling' && (!n.half || n.half === par.rel); }
  function head() { var k = king(); if (k) return k; return parents().slice().sort(function (a, b) { return (b.wealth || 0) - (a.wealth || 0); })[0] || null; }
  function favOf(n, par) {
    if (!par) { par = head(); if (!par) return n.fav != null ? n.fav : (n.fav = G.ri(40, 72)); }
    if (!kidOf(n, par)) return 0;
    n.fv = n.fv || {};
    if (n.fv[par.id] == null) { var b = n.fav != null ? n.fav : G.ri(40, 72) + (n.by < p().birthYear ? 4 : 0); n.fv[par.id] = G.clamp(Math.round(b + G.ri(-14, 14) - (n.illegit ? 10 : 0)), 0, 100); }
    return n.fv[par.id];
  }
  function bumpFav(n, d, only) { parents().forEach(function (par) { if (kidOf(n, par) && (!only || only === par)) { favOf(n, par); n.fv[par.id] = G.clamp(n.fv[par.id] + d, 0, 100); } }); }
  function myFavor(par) { par = par || head(); return par ? Math.round(G.clamp(par.aff, -100, 100)) : 0; }
  function plbl(par) { return isRoyal() || par.king || par.queen ? (par.rel === 'father' ? ['父王', 'The King'] : ['母后', 'The Queen']) : (par.rel === 'father' ? ['父亲', 'Father'] : ['母亲', 'Mother']); }
  function favLine(par, f) { var l = plbl(par); return G.T(l[0] + '偏爱{f}|' + l[1] + '\'s favor {f}', { f: Math.round(f) }); }
  function favTxt(n) { return parents().filter(function (par) { return kidOf(n, par); }).map(function (par) { return favLine(par, favOf(n, par)); }).join(' · '); }
  function myFavTxt() { return parents().map(function (par) { return favLine(par, myFavor(par)); }).join(' · '); }
  // how one parent's own fortune would be split among that parent's own children, by that parent's favor
  function estateSplit(par) {
    var q = p(), L = N.rel('sibling').filter(function (n) { return n.alive && kidOf(n, par); }).map(function (n) { return { npc: n, name: n.name, f: favOf(n, par) }; });
    L.push({ me: true, name: q.name, f: myFavor(par) - (q.crime.rec ? 20 : 0) - (q.flags.disowned ? 40 : 0) });
    var ws = 0; L.forEach(function (x) { x.w = Math.pow(Math.max(3, x.f), 4); ws += x.w; });
    L.forEach(function (x) { x.p = x.w / ws; });
    return L.sort(function (a, b) { return b.p - a.p; });
  }
  G.succ_split = estateSplit;
  function myScore() { var q = p(); return myFavor() + (q.st.eq - 50) / 5 + (q.st.smarts - 50) / 8 + Math.min(10, q.st.fame / 8) + Math.max(-10, Math.min(10, (q.h.karma || 0) / 6)) + (q.flags.court || 0) - (q.crime.rec ? 25 : 0); }
  function sibScore(n) { return favOf(n) + (n.court || 0) + (n.heir ? 8 : 0) - (n.illegit ? 15 : 0); }
  G.succ = {
    // children of the throne / fortune, best placed first
    line: function () {
      var me = { me: true, name: p().name, by: p().birthYear, score: myScore() };
      var L = sibs().filter(function (n) { return !(isRoyal() && n.illegit) && (!head() || kidOf(n, head())); }).map(function (n) { return { npc: n, name: n.name, by: n.by, score: sibScore(n) }; }).concat([me]);
      var designated = p().flags.crownHeir ? me : L.filter(function (x) { return x.npc && x.npc.heir; })[0];
      L.sort(function (a, b) { return a.by - b.by; });
      if (designated) { L.splice(L.indexOf(designated), 1); L.unshift(designated); }
      return L;
    },
    myPlace: function () { var L = G.succ.line(); for (var i = 0; i < L.length; i++) if (L[i].me) return i + 1; return 1; }
  };

  /* ---------------- setup: a royal house ---------------- */
  var create0 = G.life.create;
  G.life.create = function (o) {
    var r = create0.apply(this, arguments), q = p();
    if (q.origin === 'royal') {
      N.rel('father').forEach(function (n) { n.king = 1; n.job = '国王|King'; });
      N.rel('mother').forEach(function (n) { n.queen = 1; n.job = '王后|Queen'; });
      // a royal house usually has more than one child — and somebody is ahead of you
      if (!sibs().length && G.ch(.6)) { var s = N.make({ rel: 'sibling', g: G.ch(.5) ? 'm' : 'f', by: q.birthYear - G.ri(2, 6), c: q.country, cul: q.cul || q.country, sur: q.sur || null, aff: G.ri(30, 60) }); s.pin = 1; }
      var cap = G.C[q.country].cap || (G.C[q.country].cities[1] || [])[0]; if (cap) q.city = cap;
    }
    if (dynasty()) {
      // powerful fathers (and now and then mothers) have children outside the marriage — and you know exactly who they are
      var dad = N.rel('father')[0], mom = N.rel('mother')[0];
      sibs().forEach(function (s) { parents().forEach(function (par) { favOf(s, par); }); });
    }
    var L = G.succ.line(); if (L[0] && L[0].npc && isRoyal()) L[0].npc.heir = 1; else if (L[0] && L[0].me && isRoyal()) q.flags.crownHeir = 1;
    return r;
  };
  function mkHalf(par, by) {
    var q = p(), s = N.make({ rel: 'sibling', g: G.ch(.5) ? 'm' : 'f', by: by, c: q.country, cul: q.cul || q.country, aff: G.ri(10, 50) });
    s.illegit = 1; s.half = par.rel; s.pin = 1; s.older = by < q.birthYear;
    favOf(s, par); return s;
  }
  var cont0 = G.life.continueAs;
  G.life.continueAs = function (kid) {
    var oldG = p().g, r = cont0.apply(this, arguments);
    N.rel('sibling').forEach(function (n) { if (n.illegit && !n.half) n.half = oldG === 'm' ? 'father' : 'mother'; });
    return r;
  };
  var title0 = G.title;
  G.title = function () {
    var q = p();
    if (q.flags.monarch && !S().dead && !q.jail) return q.g === 'm' ? '国王|King' : '女王|Queen';
    if (isRoyal() && !q.jail) { var t = title0.apply(this, arguments); var base = q.flags.crownHeir ? (q.g === 'm' ? '王储|Crown Prince' : '王储|Crown Princess') : (q.g === 'm' ? '王子|Prince' : '公主|Princess'); if (!q.job && !q.gov && !q.mil && !q.fc && !S().assets.company) return base; return G.join([base, t], ' · ', ' · '); }
    return title0.apply(this, arguments);
  };
  // the king's children are princes; a reigning monarch's children too
  var rn0 = N.relName;
  N.relName = function (n) {
    var q = p();
    if (q.flags.monarch && n.rel === 'child' && (!n.illegit || n.ack)) return n.g === 'm' ? '王子|Prince' : '公主|Princess';
    if (n.rel === 'sibling' && n.illegit) { var older = n.by < q.birthYear || (n.by === q.birthYear && n.older), m = n.g === 'm'; return (n.half === 'mother' ? '同母异父的' : '同父异母的') + (m ? (older ? '哥哥' : '弟弟') : (older ? '姐姐' : '妹妹')) + '（私生）|Illegitimate Half-' + (m ? 'brother' : 'sister'); }
    if (q.flags.monarch && n.rel === 'spouse') return n.g === 'm' ? '亲王|Prince Consort' : '王后|Queen Consort';
    return rn0.apply(this, arguments);
  };

  /* ---------------- favor drifts; siblings scheme ---------------- */
  var FA = G.family, tick0 = FA.tick;
  FA.tick = function (Q) {
    var r = tick0.apply(this, arguments), q = p();
    if (!dynasty() || S().dead) return r;
    var ss = sibs(), ps = parents();
    if (ps.length && ss.length && q.age >= 8) {
      ss.forEach(function (s) {
        var up = N.age(s) >= 18 && /总经理|副总裁|董事|Director|President|Manager|Prince|Princess|王子|公主/.test(s.job || '') ? 1 : 0; ps.forEach(function (par) { if (kidOf(s, par)) bumpFav(s, G.ri(-3, 3) + up, par); });
        var schemer = ['scheme', 'ambit', 'competitive', 'boss', 'greedy', 'proud'].indexOf(s.pers) >= 0;
        if (schemer && q.age >= 12 && N.age(s) >= 12 && s.aff < 55 && (s.schN || 0) < 3 && G.ch(.07) && !s.schY) { s.schY = S().year; s.schN = (s.schN || 0) + 1; Q.push({ id: 'su_rival', nid: s.id }); }
        if (s.schY && S().year - s.schY > 6) s.schY = 0;
      });
      // the monarch / patriarch names an heir once the children are grown
      var top = ps.slice().sort(function (a, b) { return N.age(b) - N.age(a); })[0];
      if (!q.flags.heirNamed && q.age >= 18 && (N.age(top) >= 62 || G.ch(.04)) && G.ch(.35)) { q.flags.heirNamed = S().year; Q.push({ id: 'su_designate' }); }
    }
    return r;
  };
  // the crown passes when the monarch dies
  var nt0 = N.tick;
  N.tick = function () {
    var out = nt0.apply(this, arguments), q = p();
    if (isRoyal() && !q.flags.monarch && !q.flags.succDone) {
      var k = N.rel('father', 'mother').filter(function (n) { return n.king || n.queen && n.reign; })[0];
      if (k && !k.alive) { q.flags.succDone = 1; (S().pendQ = S().pendQ || []).push({ id: 'su_crown' }); }
    }
    return out;
  };

  /* ---------------- each parent's own estate follows that parent's own favor ---------------- */
  var inh0 = FA.inherit;
  FA.inherit = function (dead) {
    var q = p(), other = N.rel('father', 'mother').filter(function (n) { return n !== dead && n.alive; })[0];
    if (!dynasty() || (dead.rel !== 'father' && dead.rel !== 'mother')) return inh0.apply(this, arguments);
    var total = Math.max(0, dead.wealth) * (1 - (G.C[q.country].itax || 0));
    var L = estateSplit(dead), mine = 0, lines = [];
    L.forEach(function (x) { var amt = Math.round(total * x.p); if (x.me) mine = amt; else x.npc.wealth += amt; lines.push(G.T(x.name) + (x.me ? G.T('（你）| (you)') : x.npc.illegit ? G.T('（私生）| (illegitimate)') : '') + ' ' + Math.round(x.p * 100) + '%'); });
    dead.wealth = 0;
    if (mine > 0) { G.addMoney(mine); G.inc('inherit', mine); }
    var best = L[0], l = plbl(dead);
    if (L.length > 1) G.log(l[0] + '的遗嘱只看' + (dead.rel === 'father' ? '他' : '她') + '自己的偏爱：{l}。|' + l[1] + '\'s will followed ' + (dead.rel === 'father' ? 'his' : 'her') + ' own favor alone: {l}.', { l: lines.join('、') + '|' + lines.join(', ') });
    if (best.me && L.length > 1) G.log('你是' + l[0] + '最疼的孩子，' + (dead.rel === 'father' ? '他' : '她') + '的财产大多留给了你。|You were ' + l[1] + '\'s favorite; most of the fortune came to you.');
    else if (!best.me && best.npc) G.log('{n}才是' + l[0] + '最疼的孩子。|{n} was ' + l[1] + '\'s favorite all along.', { n: best.npc.name });
    if (best.me && !other && total > G.$(5e6) && !S().assets.company && q.origin !== 'royal' && q.origin !== 'red') {
      try { G.biz.start(G.pick(['trade', 'retail', 'tech', 'food'].filter(function (x) { return G.INDUSTRY[x]; })) || 'trade', Math.round(total * .4 / G.$(1))); G.major('继承了家族企业|Inherited the family business'); } catch (e) { }
    } else if (!best.me && best.npc) { N.addAff(best.npc, -5); if (G.ch(.5) && !other) (S().pendQ = S().pendQ || []).push({ id: 'n_sib_estate', nid: best.npc.id, prm: { m: G.M(Math.round(total * .2)) } }); }
    else if (best.me && L.length > 1) { var sec = L[1]; if (sec && sec.npc && sec.npc.illegit && G.ch(.6)) (S().pendQ = S().pendQ || []).push({ id: 'su_illegit_suit', nid: sec.npc.id, prm: { m: G.M(Math.round(total * .15)), v: Math.round(total * .15) } }); }
    return mine;
  };

  /* ---------------- actions: courting favor, telling tales ---------------- */
  function famCat() { return G.ACT_CATS.filter(function (c) { return c.id === 'family'; })[0]; }
  function pickSib(title) { var ss = sibs(); if (!ss.length) return Promise.resolve(null); return G.UI.pick({ title: G.L(title), items: ss.map(function (s) { return { t: s.name, sub: G.T(N.relName(s)) + ' · ' + favTxt(s), npc: s }; }) }).then(function (i) { return i < 0 ? null : ss[i]; }); }
  var ACTS = [
    { id: 'su_view', n: '继承形势|The Line of Succession', i: '📜', e: 0, if: function () { return dynasty() && (sibs().length > 0 || isRoyal()) && parents().length > 0; }, run: async function (a) {
      var L = G.succ.line(), items = [];
      if (isRoyal() || L.length > 1) L.forEach(function (x, i) { items.push({ t: (i + 1) + '. ' + G.T(x.name) + (x.me ? G.T('（你）| (you)') : ''), sub: (x.me ? myFavTxt() : favTxt(x.npc)) + (x.npc && x.npc.heir || x.me && p().flags.crownHeir ? G.T(' · 已被立为继承人| · Named heir') : ''), icon: x.me ? '⭐' : '👤' }); });
      parents().forEach(function (par) {
        var l = plbl(par), sp = estateSplit(par);
        items.push({ t: G.T(l[0] + '的遗产 · 约{m}|' + l[1] + '\'s estate · about {m}', { m: G.fm(Math.max(0, par.wealth || 0)) }), icon: '📜',
          sub: sp.map(function (x) { return G.T(x.name) + (x.me ? G.T('（你）| (you)') : x.npc.illegit ? G.T('（私生）| (illegitimate)') : '') + ' ' + Math.round(x.p * 100) + '%'; }).join(' · ') });
      });
      await G.UI.pick({ title: G.L(isRoyal() ? '王位继承顺位|Line of Succession to the Throne' : '家族继承形势|Who Will Inherit the Family', ''), text: G.L('父亲和母亲各有各的财产，各按自己对每个孩子的偏爱来分：谁最得父亲的心，父亲的钱就大多归谁；母亲的也一样。|Father and mother each have their own fortune and each splits it by their own favor: whoever Father favors most gets most of his; the same goes for Mother.'), items: items });
      return 'cancel';
    } },
    { id: 'su_please', n: '讨父母欢心|Win Your Parents\' Favor', i: '🫖', e: 15, if: function () { return dynasty() && parents().length > 0 && p().age >= 6; }, run: async function (a) {
      var ps = parents(), q = p(), par = ps[0];
      if (ps.length > 1) { var k = await G.UI.pick({ title: G.L('去讨谁的欢心？|Whose favor will you court?'), items: ps.map(function (n) { return { t: G.T(plbl(n)[0] + '|' + plbl(n)[1]), sub: G.T('现在对你的偏爱{f}|Current favor toward you {f}', { f: myFavor(n) }), npc: n }; }) }); if (k < 0) return 'cancel'; par = ps[k]; }
      G.dStart();
      var ok = G.ch(.5 + q.st.eq / 200), v = ok ? G.ri(5, 11) : G.ri(-2, 2); G.dPush('aff', N.addAff(par, v));
      var dl = G.dEnd(), dad = par.rel === 'father';
      var t = isRoyal() ? (dad ? (ok ? '你陪父王下了一下午的棋，故意输了一盘。他笑得很开心。|You played chess with the King all afternoon and lost one game on purpose. He laughed with delight.' : '你陪父王打猎，却一枪都没打中。他叹了口气。|You went hunting with the King and missed every shot. He sighed.') : (ok ? '你给母后读她最爱的诗，她听着听着握住了你的手。|You read the Queen her favorite poems; she took your hand as she listened.' : '你给母后读诗，她却一直在看文件。|You read poetry to the Queen, but she kept reading her papers.'))
        : (dad ? (ok ? '你陪爸爸打了一场高尔夫，他逢人就夸你。|You played a round of golf with Dad; he bragged about you to everyone.' : '你陪爸爸应酬，说错了一句话，他脸色一沉。|You joined Dad at a business dinner and said the wrong thing; his face darkened.') : (ok ? '你陪妈妈逛了一下午街，她说你是最贴心的孩子。|You spent the afternoon shopping with Mom; she called you her most thoughtful child.' : '你给妈妈准备了惊喜，她却说“又想要什么了？”|You planned a surprise for Mom; she just asked, "What do you want this time?"'));
      return G.result(a.n, t, null, dl, a.i);
    } },
    { id: 'su_court', n: '拉拢支持者|Win Over Supporters', i: '🤝', e: 20, $: 5000, if: function () { return dynasty() && p().age >= 16 && sibs().length > 0; }, run: function (a) {
      var q = p(); var g = G.ri(2, 6) + Math.round(q.st.eq / 30); q.flags.court = Math.min(30, (q.flags.court || 0) + g);
      return G.quick(a, isRoyal() ? '你在宫里宴请了几位重臣，他们开始在国王面前替你说话。|You hosted a few senior courtiers; they began speaking up for you before the King.' : '你和几位元老董事吃了饭，他们答应在关键时刻支持你。|You dined with the founding directors; they promised to back you when it counts.', { eq: 1, happy: -1 });
    } },
    { id: 'su_tell', n: '告发兄弟姐妹|Tell on a Sibling', i: '🗣️', e: 15, if: function () { return dynasty() && parents().length > 0 && sibs().length > 0 && p().age >= 8; }, run: async function (a) {
      var s = await pickSib('告发谁？|Tell on whom?'); if (!s) return 'cancel';
      return tellOn(a, s);
    } }
  ];
  async function tellOn(a, s) {
    var q = p(), ps = parents();
    var what = G.pick(['偷偷挪用家族的钱|secretly dipping into family money', '在外面胡作非为|running wild in public', '背地里说爸妈的坏话|badmouthing your parents behind their backs', '和家族的对头来往|consorting with the family\'s rivals']);
    G.dStart();
    var caught = G.ch(.32 - q.st.eq / 500 + (s.pers === 'scheme' ? .15 : 0)), r;
    if (caught) { ps.forEach(function (n) { G.dPush('aff', N.addAff(n, -10)); }); G.dPush('aff', N.addAff(s, -25)); bumpFav(s, 4); s.enemy = 1; r = '你告发{n}{w}，却被{n}当场拆穿——爸妈最讨厌搬弄是非的孩子。|You accused {n} of {w}, but {n} exposed you on the spot — your parents hate a tattletale.'; }
    else { var d = G.ri(8, 18); bumpFav(s, -d); G.dPush('aff', N.addAff(s, -8)); q.h.karma = (q.h.karma || 0) - 3; r = '你在爸妈面前“不经意”地提起{n}{w}。爸妈看{n}的眼神变了。|You "casually" mentioned to your parents that {n} has been {w}. They looked at {n} differently after that.'; }
    var dl = G.dEnd();
    return G.result(a.n, r, { n: s.name, w: what }, dl, a.i);
  }
  var cat = famCat();
  if (cat) ACTS.forEach(function (x) { cat.items.push(x); });
  // from a sibling's profile
  var acts0 = G.npcActs;
  G.npcActs = function (n) {
    var out = acts0.apply(this, arguments);
    if (n.rel !== 'sibling' || !n.alive || p().jail || !dynasty() || !parents().length || p().age < 8) return out;
    out.push({ id: 'su_tell1', n: '向爸妈告{him}的状|Tell Mom and Dad on Them', i: '🗣️', e: 15, run: function (s, a) { return tellOn(a, s); } });
    out.push({ id: 'su_ally', n: '结成同盟|Form an Alliance', i: '🤝', e: 10, run: function (s, a) { G.dStart(); var ok = s.aff > 40 && G.ch(.6); G.dPush('aff', N.addAff(s, ok ? 10 : -3)); if (ok) s.ally = 1; var dl = G.dEnd(); return G.result(a.n, ok ? '你和{n}约定：不管将来谁继承，都要互相照应。|You and {n} agreed: whoever inherits, you\'ll look after each other.' : '{n}笑了笑：“各凭本事吧。”|{n} smiled: "May the best one win."', { n: s.name }, dl, a.i); } });
    return out;
  };
  var info0 = G.npcInfo;
  G.npcInfo = function (n) {
    var r = info0.apply(this, arguments);
    if (n.rel === 'sibling' && n.illegit) r.push(['身世|Origins', n.half === 'mother' ? '母亲婚外所生|Born to your mother outside marriage' : '父亲婚外所生|Born to your father outside marriage']);
    if ((n.rel === 'father' || n.rel === 'mother') && dynasty() && n.alive && (sibs().length || 1)) { var sp = estateSplit(n); r.push(['遗产会给谁|Who gets this estate', sp.map(function (x) { return G.T(x.name) + (x.me ? G.T('（你）| (you)') : '') + ' ' + Math.round(x.p * 100) + '%'; }).join(' · ')]); }
    if (n.rel === 'sibling' && dynasty() && n.alive) { r.push(['父母偏爱|Parents\' favor', favTxt(n) || '—']); r.push(['你的偏爱|Your favor', myFavTxt() || '—']); if (n.heir) r.push(['继承|Succession', isRoyal() ? '储君|Heir to the throne' : '家族接班人|Named successor']); }
    return r;
  };

  /* ---------------- events ---------------- */
  G.evs([
    E('su_half_born', [6, 17], '外面的孩子|The Child Outside the Marriage', '🍼', '家里炸开了锅：{pa}在外面有了一个孩子，取名{n}。{ma}关起门哭了一整天。|The house is in uproar: {pa} has had a child with another woman, named {n}. Behind a locked door, {ma} cried all day.', [
      O('站在{ma}这边|Stand with {ma}', function (c) { G.dPush('aff', N.addAff(c.mom, 10)); G.dPush('aff', N.addAff(c.dad, -6)); N.addAff(c.npc, -10); return '你抱住了{ma}。{pa}看你的眼神有些复杂。|You held {ma} tight. {pa} gave you a complicated look.'; }),
      O('接纳这个新的弟弟妹妹|Welcome the new half-sibling', function (c) { G.dPush('aff', N.addAff(c.npc, 20)); G.dPush('aff', N.addAff(c.dad, 7)); G.dPush('aff', N.addAff(c.mom, -9)); return '你去看了襁褓里的{n}。{pa}很欣慰，{ma}却好几天没理你。|You went to see baby {n}. {pa} was moved; {ma} didn\'t speak to you for days.'; }),
      O('装作什么都不知道|Pretend you know nothing', R('你什么也没说。家里的气氛冷了很久。|You said nothing. The house stayed cold for a long time.', { happy: -3 }))
    ], { bad: 1, if: function () { var d = N.rel('father')[0], m = N.rel('mother')[0]; return dynasty() && d && m && d.alive && m.alive && !d.sep && !m.sep && N.age(d) < 62 && N.rel('sibling').filter(function (n) { return n.illegit; }).length < 2; },
      prep: function (c) { var d = N.rel('father')[0], m = N.rel('mother')[0]; if (!d || !m) return false; c.dad = d; c.mom = m; c.npc = mkHalf(d, S().year); c.npc.older = 0; c.prm.n = c.npc.name; var r = isRoyal(); c.prm.pa = r ? '父王|the King' : '爸爸|Dad'; c.prm.ma = r ? '母后|the Queen' : '妈妈|Mom'; } }),
    { id: 'su_illegit_suit', sys: 1, title: '私生子争产|The Illegitimate Heir Sues', icon: '⚖️', bad: 1,
      prep: function (c) { if (!c.npc || !c.npc.alive) return false; c.prm.n = c.npc.name; c.v = (c.prm && c.prm.v) || G.$(100000); },
      t: '{n}拿着DNA报告找了律师，说遗嘱是被人操纵的，要求至少再分{m}。|{n} has gone to lawyers with a DNA report, claiming the will was manipulated and demanding at least {m} more.',
      o: [
        { t: '私下给钱了事|Settle quietly', run: function (c) { var m = Math.min(Math.max(0, c.p.money), c.v); c.money(-m); c.npc.wealth += m; G.dPush('aff', N.addAff(c.npc, 12)); return '你签了一张支票，{n}撤诉了。|You wrote a cheque and {n} dropped the suit.'; } },
        { t: '法庭上见|See you in court', run: function (c) { var fee = Math.round(c.v * .15); c.money(-Math.min(Math.max(0, c.p.money), fee)); G.dPush('aff', N.addAff(c.npc, -35)); c.npc.enemy = 1; if (G.ch(.62)) { c.add('happy', 4); return '法官维持了原遗嘱。{n}走出法庭时没有看你一眼。|The judge upheld the will. {n} walked out without looking at you.'; } var m = Math.min(Math.max(0, c.p.money), c.v); c.money(-m); c.npc.wealth += m; c.add('happy', -8); c.add('fame', 2); return '你输了官司，还上了小报头条。|You lost the case — and made the tabloid front pages.'; } },
        { t: '认下这个手足，分一半给{him}|Embrace them as family and share half', run: function (c) { var m = Math.min(Math.max(0, c.p.money), Math.round(c.v / 2)); c.money(-m); c.npc.wealth += m; G.dPush('aff', N.addAff(c.npc, 35)); c.add('karma', 5); c.add('eq', 2); return '{n}愣了很久，说：“我以为你会恨我。”|{n} was silent for a long time, then said, "I thought you\'d hate me."'; } }
      ] },
    { id: 'su_rival', sys: 1, title: '兄弟阋墙|Sibling Rivalry', icon: '🐍', bad: 1,
      prep: function (c) { if (!c.npc || !c.npc.alive) return false; c.prm.n = c.npc.name; },
      t: function (c) { return isRoyal() ? '你听说{n}在父王面前说了你的坏话，说你“不堪大任”。|Word reaches you that {n} told the King you are "unfit for the duties ahead".' : '你听说{n}在爸妈面前告了你一状，说你乱花钱、不务正业。|You hear {n} told your parents you waste money and can\'t be trusted.'; },
      o: [
        { t: '去找爸妈解释|Go to your parents and explain', run: function (c) { var ok = G.ch(.45 + c.p.st.eq / 250); parents().forEach(function (n) { G.dPush('aff', N.addAff(n, ok ? 4 : -6)); }); return ok ? '爸妈听完你的解释，反而对{n}有些失望。|Your parents heard you out — and were a little disappointed in {n}.' : '你越解释越像在狡辩。|The more you explained, the guiltier you sounded.'; } },
        { t: '以牙还牙|Return the favor', run: function (c) { var s = c.npc, ok = G.ch(.5); if (ok) bumpFav(s, -12); else parents().forEach(function (n) { G.dPush('aff', N.addAff(n, -8)); }); G.dPush('aff', N.addAff(s, -15)); c.add('karma', -4); return ok ? '你抓到了{n}的把柄，爸妈对{n}的信任一落千丈。|You found dirt on {n}; your parents\' trust in {n} collapsed.' : '一家人吵成一团，爸妈对你们俩都很失望。|The whole family ended up shouting; your parents were disappointed in both of you.'; } },
        { t: '不理会，用行动证明自己|Ignore it and prove yourself', run: function (c) { c.add('eq', 2); c.add('happy', -2); return '你没有辩解。时间会说明一切。|You didn\'t defend yourself. Time would tell.'; } }
      ] },
    { id: 'su_designate', sys: 1, title: '立储|Naming an Heir', icon: '👑',
      prep: function (c) { var L = G.succ.line(); if (L.length < 2 && !isRoyal()) return false; var best = L.slice().sort(function (a, b) { return b.score - a.score; })[0]; c.best = best; c.prm.n = best.me ? p().name : best.name; },
      t: function (c) { return isRoyal() ? '父王召集了全家人和首相，宣布了王位继承人。所有人都屏住了呼吸……|The King gathers the family and the Prime Minister to announce the heir to the throne. Everyone holds their breath...' : '爸妈把所有孩子叫到一起，宣布了家族企业的接班人。|Your parents call all the children together to name the heir to the family business.'; },
      o: [
        { t: '静静听着|Listen in silence', run: function (c) {
          var b = c.best, q = c.p; sibs().forEach(function (s) { s.heir = 0; }); q.flags.crownHeir = 0;
          if (b.me) { q.flags.crownHeir = 1; c.add('happy', 12); c.add('fame', isRoyal() ? 8 : 2); sibs().forEach(function (s) { G.dPush('aff', N.addAff(s, s.ally ? 2 : -12)); }); G.major(isRoyal() ? '被立为王储|Named heir to the throne' : '被立为家族接班人|Named heir to the family business'); return isRoyal() ? '“王位继承人是——{n}。”所有人都看向了你。|"The heir to the throne is... {n}." Every eye turned to you.' : '“接班人是{n}。”你的兄弟姐妹们脸色都变了。|"The successor is {n}." Your siblings\' faces fell.'; }
          b.npc.heir = 1; c.add('happy', -8); G.dPush('aff', N.addAff(b.npc, 3)); 
          return isRoyal() ? '“王位继承人是——{n}。”你低下了头。|"The heir to the throne is... {n}." You lowered your head.' : '“接班人是{n}。”你攥紧了拳头。|"The successor is {n}." You clenched your fists.';
        } }
      ] },
    { id: 'su_crown', sys: 1, title: '国王驾崩|The King Is Dead', icon: '🕯️',
      prep: function (c) { var L = G.succ.line(); c.L = L; c.prm.n = L[0] && !L[0].me ? L[0].name : ''; },
      t: function (c) { var L = c.L; return L[0] && L[0].me ? '国王驾崩了。全国降半旗。首相走进来，单膝跪下：“陛下。”|The King is dead. Flags fly at half-mast. The Prime Minister enters and kneels: "Your Majesty."' : '国王驾崩了。按照继承顺序，{n}将继承王位。|The King is dead. By the line of succession, {n} will take the throne.'; },
      o: [
        { t: '接受王冠|Accept the crown', if: function (c) { return c.L[0] && c.L[0].me; }, run: function (c) { crown(c.p); return '加冕礼在古老的大教堂举行，全世界都在看。|The coronation takes place in the ancient cathedral, watched by the whole world.'; } },
        { t: '宣誓效忠新君|Swear loyalty to the new monarch', if: function (c) { return !(c.L[0] && c.L[0].me); }, run: function (c) { var n = c.L[0].npc; if (n) { n.king = 1; n.reign = 1; n.job = n.g === 'm' ? '国王|King' : '女王|Queen'; G.dPush('aff', N.addAff(n, 10)); } c.add('eq', 2); return '你在加冕礼上第一个跪下。新君扶起了你。|You were the first to kneel at the coronation. The new monarch raised you up.'; } },
        { t: '争夺王位|Contest the throne', if: function (c) { return !(c.L[0] && c.L[0].me) && c.p.age >= 18; }, run: function (c) { var n = c.L[0].npc, q = c.p, ch = .15 + (q.flags.court || 0) / 100 + (myScore() - sibScore(n)) / 200; if (G.ch(G.clamp(ch, .03, .6))) { if (n) { n.heir = 0; G.dPush('aff', N.addAff(n, -40)); n.enemy = 1; } crown(q); c.add('karma', -8); return '议会和王室元老站在了你这边。你戴上了王冠，{n}从此再没和你说过话。|Parliament and the royal elders backed you. You took the crown; {n} never spoke to you again.'; } if (n) { n.king = 1; n.reign = 1; n.job = n.g === 'm' ? '国王|King' : '女王|Queen'; G.dPush('aff', N.addAff(n, -30)); } c.add('fame', 6); c.add('happy', -15); q.flags.exiled = 1; G.major('王位之争失败|Lost the struggle for the throne'); return '政变失败了。新君念及亲情没有治罪，但你被剥夺了所有王室职务。|The bid failed. The new monarch spared you out of kinship, but stripped you of every royal role.'; } }
      ] }
  ]);
  function crown(q) {
    q.flags.monarch = { y: S().year }; q.flags.crownHeir = 0; q.flags.heads = (q.flags.heads || 0) + 1;
    G.addStat('fame', 30); G.addStat('happy', 10);
    N.rel('mother').forEach(function (n) { if (n.alive) { n.queen = 0; n.job = '太后|Queen Mother'; } });
    G.major('登基为{t}|Crowned {t}', { t: q.g === 'm' ? '国王|King' : '女王|Queen' });
  }

  /* ---------------- reigning ---------------- */
  G.ACT_CATS.push({ id: 'reign', n: '君主|The Crown', i: '👑', if: function () { return !!p().flags.monarch; }, items: [
    { id: 'rg_audience', n: '每周接见首相|Weekly Audience with the PM', i: '🎩', e: 10, run: function (a) { return G.quick(a, G.pick(['首相向你汇报了国家大事，你提了一个让他沉默很久的问题。|The PM briefed you on affairs of state; you asked a question that silenced him for a long while.', '你提醒首相：民众的生活比数字更重要。|You reminded the PM that people\'s lives matter more than statistics.']), { smarts: 1, eq: 1 }); } },
    { id: 'rg_visit', n: '国事访问|State Visit', i: '✈️', e: 25, run: function (a) { var c = G.pick(G.CLIST.filter(function (x) { return x !== p().country; })); return G.quick(a, '你对{c}进行了国事访问，两国签署了一系列合作协议。|You made a state visit to {c}; the two nations signed a raft of agreements.', { fame: 3, eq: 1, happy: 2 }, { c: G.C[c].n }); } },
    { id: 'rg_pardon', n: '行使特赦权|Grant a Royal Pardon', i: '🕊️', e: 15, run: function (a) { return G.quick(a, '你赦免了一位被冤枉多年的老人。他出狱那天，在王宫外跪了很久。|You pardoned an old man wrongly imprisoned for years. On his release he knelt outside the palace for a long time.', { karma: 8, fame: 2 }); } },
    { id: 'rg_charity', n: '王室慈善晚宴|Royal Charity Gala', i: '🎗️', e: 20, run: function (a) { return G.quick(a, '一晚上为儿童医院募集了上亿善款。|One evening raised a fortune for the children\'s hospital.', { karma: 6, fame: 3, happy: 2 }); } },
    { id: 'rg_abdicate', n: '退位|Abdicate', i: '🚪', e: 0, confirm: '退位后你将不再是君主，王位会传给你的继承人。确定吗？|Abdicate and the crown passes to your heir. Are you sure?', run: function (a) { var q = p(), k = N.rel('child').filter(function (n) { return n.alive && N.age(n) >= 18; }).sort(function (x, y) { return x.by - y.by; })[0]; q.flags.monarch = null; q.flags.abdicated = S().year; if (k) { k.job = k.g === 'm' ? '国王|King' : '女王|Queen'; k.reign = 1; k.king = 1; } G.major('退位|Abdicated the throne'); return G.quick(a, k ? '你在全国电视讲话中宣布退位，{n}继承了王位。|In a televised address you abdicated; {n} took the throne.' : '你宣布退位，王位传给了下一位继承人。|You abdicated; the crown passed down the line.', { happy: 6, fame: 4 }, { n: k ? k.name : '' }); } }
  ] });
  G.ACT_CATS[G.ACT_CATS.length - 1].items.forEach(function (x) { var f = x.if; x.if = function () { return !!p().flags.monarch && (!f || f()); }; });
  var st0 = G.status;
  if (st0) G.status = function () { var q = G.S && G.S.p; if (q && q.flags.monarch) return 3; return st0.apply(this, arguments); };

  /* playing on as the heir of a monarch */
  var cont = G.life.continueAs;
  G.life.continueAs = function (kid) {
    var wasMon = p().flags.monarch, wasRoyal = isRoyal() || wasMon;
    var r = cont.apply(this, arguments), q = G.S && G.S.p;
    if (q && wasRoyal) { q.origin = 'royal'; q.flags.exRoyal = 0; if (wasMon && q.age >= 18) { crown(q); G.log('你继承了王位。|You inherited the throne.'); } else if (wasMon) q.flags.crownHeir = 1; }
    return r;
  };
})();
