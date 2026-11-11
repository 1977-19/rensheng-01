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
  function myFavor() { var ps = parents(); return ps.length ? Math.round(G.sum(ps, function (n) { return n.aff; }) / ps.length) : 0; }
  function favOf(n) { if (n.fav == null) n.fav = G.ri(40, 72) + (n.by < p().birthYear ? 4 : 0); return n.fav; }
  function myScore() { var q = p(); return myFavor() + (q.st.eq - 50) / 5 + (q.st.smarts - 50) / 8 + Math.min(10, q.st.fame / 8) + Math.max(-10, Math.min(10, (q.h.karma || 0) / 6)) + (q.flags.court || 0) - (q.crime.rec ? 25 : 0); }
  function sibScore(n) { return favOf(n) + (n.court || 0) + (n.heir ? 8 : 0); }
  G.succ = {
    // children of the throne / fortune, best placed first
    line: function () {
      var me = { me: true, name: p().name, by: p().birthYear, score: myScore() };
      var L = sibs().map(function (n) { return { npc: n, name: n.name, by: n.by, score: sibScore(n) }; }).concat([me]);
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
    if (dynasty()) sibs().forEach(function (s) { favOf(s); });
    var L = G.succ.line(); if (L[0] && L[0].npc && isRoyal()) L[0].npc.heir = 1; else if (L[0] && L[0].me && isRoyal()) q.flags.crownHeir = 1;
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
    if (q.flags.monarch && n.rel === 'child') return n.g === 'm' ? '王子|Prince' : '公主|Princess';
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
        favOf(s); s.fav = G.clamp(s.fav + G.ri(-3, 3) + (N.age(s) >= 18 && /总经理|副总裁|董事|Director|President|Manager|Prince|Princess|王子|公主/.test(s.job || '') ? 1 : 0), 0, 100);
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

  /* ---------------- the old parent's estate follows favor ---------------- */
  var inh0 = FA.inherit;
  FA.inherit = function (dead) {
    var q = p(), other = N.rel('father', 'mother').filter(function (n) { return n !== dead && n.alive; })[0];
    if (!dynasty() || other || (dead.rel !== 'father' && dead.rel !== 'mother') || !sibs().length) return inh0.apply(this, arguments);
    var total = Math.max(0, dead.wealth) * (1 - (G.C[q.country].itax || 0));
    var L = G.succ.line(), wsum = 0;
    L.forEach(function (x) { x.w = Math.pow(Math.max(5, x.score), 2.2); wsum += x.w; });
    var mine = 0, lines = [];
    L.forEach(function (x) { var amt = Math.round(total * x.w / wsum); if (x.me) mine = amt; else x.npc.wealth += amt; lines.push(G.T(x.name) + ' ' + Math.round(x.w / wsum * 100) + '%'); });
    dead.wealth = 0;
    if (mine > 0) { G.addMoney(mine); G.inc('inherit', mine); }
    var best = L.slice().sort(function (a, b) { return b.w - a.w; })[0];
    G.log('父母的遗嘱按偏爱分配：{l}。|Your parents\' will divided the fortune by favor: {l}.', { l: lines.join('、') + '|' + lines.join(', ') });
    if (best.me && total > G.$(5e6) && !S().assets.company && q.origin !== 'royal' && q.origin !== 'red') {
      try { G.biz.start(G.pick(['trade', 'retail', 'tech', 'food'].filter(function (x) { return G.INDUSTRY[x]; })) || 'trade', Math.round(total * .4 / G.$(1))); G.major('继承了家族企业|Inherited the family business'); } catch (e) { }
    } else if (!best.me && best.npc) { N.addAff(best.npc, -5); if (G.ch(.5)) (S().pendQ = S().pendQ || []).push({ id: 'n_sib_estate', nid: best.npc.id, prm: { m: G.M(Math.round(total * .2)) } }); }
    return mine;
  };

  /* ---------------- actions: courting favor, telling tales ---------------- */
  function famCat() { return G.ACT_CATS.filter(function (c) { return c.id === 'family'; })[0]; }
  function pickSib(title) { var ss = sibs(); if (!ss.length) return Promise.resolve(null); return G.UI.pick({ title: G.L(title), items: ss.map(function (s) { return { t: s.name, sub: G.T(N.relName(s)) + ' · ' + G.T('父母偏爱{f}|Parents\' favor {f}', { f: favOf(s) }), npc: s }; }) }).then(function (i) { return i < 0 ? null : ss[i]; }); }
  var ACTS = [
    { id: 'su_view', n: '继承形势|The Line of Succession', i: '📜', e: 0, if: function () { return dynasty() && (sibs().length > 0 || isRoyal()) && parents().length > 0; }, run: async function (a) {
      var L = G.succ.line();
      var items = L.map(function (x, i) { return { t: (i + 1) + '. ' + G.T(x.name) + (x.me ? G.T('（你）| (you)') : ''), sub: G.T('父母偏爱{f}|Parents\' favor {f}', { f: Math.round(x.me ? myFavor() : favOf(x.npc)) }) + (x.npc && x.npc.heir || x.me && p().flags.crownHeir ? G.T(' · 已被立为继承人| · Named heir') : ''), icon: x.me ? '⭐' : '👤' }; });
      await G.UI.pick({ title: G.L(isRoyal() ? '王位继承顺位|Line of Succession to the Throne' : '家族继承形势|Who Will Inherit the Family', ''), text: G.L('排名会随着父母的偏爱、你的能力和名声变化。偏爱最高的人，最有可能被立为继承人。|The order shifts with your parents\' favor, your abilities and reputation. The favorite is most likely to be named heir.'), items: items });
      return 'cancel';
    } },
    { id: 'su_please', n: '讨父母欢心|Win Your Parents\' Favor', i: '🫖', e: 15, if: function () { return dynasty() && parents().length > 0 && p().age >= 6; }, run: function (a) {
      var ps = parents(), q = p(); G.dStart();
      var ok = G.ch(.5 + q.st.eq / 200), v = ok ? G.ri(4, 9) : G.ri(-2, 2); ps.forEach(function (n) { G.dPush('aff', N.addAff(n, v)); });
      var dl = G.dEnd();
      var t = isRoyal() ? (ok ? '你陪父王下了一下午的棋，故意输了一盘。他笑得很开心。|You played chess with the King all afternoon and lost one game on purpose. He laughed with delight.' : '你给母后读诗，她却一直在看文件。|You read poetry to the Queen; she kept reading state papers.') : (ok ? '你陪爸妈吃了一顿饭，认真听他们讲当年创业的故事。|You took your parents to dinner and listened to the old stories of how they built it all.' : '你殷勤得有点过头，爸爸看穿了你的心思。|You tried a little too hard; Dad saw right through it.');
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
    if (caught) { ps.forEach(function (n) { G.dPush('aff', N.addAff(n, -10)); }); G.dPush('aff', N.addAff(s, -25)); s.fav = Math.min(100, favOf(s) + 4); s.enemy = 1; r = '你告发{n}{w}，却被{n}当场拆穿——爸妈最讨厌搬弄是非的孩子。|You accused {n} of {w}, but {n} exposed you on the spot — your parents hate a tattletale.'; }
    else { var d = G.ri(8, 18); s.fav = Math.max(0, favOf(s) - d); G.dPush('aff', N.addAff(s, -8)); q.h.karma = (q.h.karma || 0) - 3; r = '你在爸妈面前“不经意”地提起{n}{w}。爸妈看{n}的眼神变了。|You "casually" mentioned to your parents that {n} has been {w}. They looked at {n} differently after that.'; }
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
    if (n.rel === 'sibling' && dynasty() && n.alive) { r.push(['父母偏爱|Parents\' favor', String(Math.round(favOf(n))) + G.T('（你：|  (you: ') + myFavor() + G.T('）|)')]); if (n.heir) r.push(['继承|Succession', isRoyal() ? '储君|Heir to the throne' : '家族接班人|Named successor']); }
    return r;
  };

  /* ---------------- events ---------------- */
  G.evs([
    { id: 'su_rival', sys: 1, title: '兄弟阋墙|Sibling Rivalry', icon: '🐍', bad: 1,
      prep: function (c) { if (!c.npc || !c.npc.alive) return false; c.prm.n = c.npc.name; },
      t: function (c) { return isRoyal() ? '你听说{n}在父王面前说了你的坏话，说你“不堪大任”。|Word reaches you that {n} told the King you are "unfit for the duties ahead".' : '你听说{n}在爸妈面前告了你一状，说你乱花钱、不务正业。|You hear {n} told your parents you waste money and can\'t be trusted.'; },
      o: [
        { t: '去找爸妈解释|Go to your parents and explain', run: function (c) { var ok = G.ch(.45 + c.p.st.eq / 250); parents().forEach(function (n) { G.dPush('aff', N.addAff(n, ok ? 4 : -6)); }); return ok ? '爸妈听完你的解释，反而对{n}有些失望。|Your parents heard you out — and were a little disappointed in {n}.' : '你越解释越像在狡辩。|The more you explained, the guiltier you sounded.'; } },
        { t: '以牙还牙|Return the favor', run: function (c) { var s = c.npc, ok = G.ch(.5); if (ok) s.fav = Math.max(0, favOf(s) - 12); else parents().forEach(function (n) { G.dPush('aff', N.addAff(n, -8)); }); G.dPush('aff', N.addAff(s, -15)); c.add('karma', -4); return ok ? '你抓到了{n}的把柄，爸妈对{n}的信任一落千丈。|You found dirt on {n}; your parents\' trust in {n} collapsed.' : '一家人吵成一团，爸妈对你们俩都很失望。|The whole family ended up shouting; your parents were disappointed in both of you.'; } },
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
