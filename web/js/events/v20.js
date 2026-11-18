/* Version 1.9.1: "人情世故" — great families get things done.
   - Red second generation and royals have the strongest connections; rich, star and dynasty families come next.
   - Connected families start mega projects for $1–2M, find business easier (new products succeed more often,
     contacts bring in contracts), get hired more easily, and red families rise faster in public office.
   - Children of a political family are "red second generation" — better placed than a mere rich kid.
   - The origin picker spells out each family's privileges, so the difference is easy to see. */
(function () {
  'use strict';
  var N = G.N;
  function S() { return G.S; }
  function P() { return G.S && G.S.p; }
  var TOP = { red: 3, royal: 3 };
  G.connOf = function (oid) {
    var o = G.ORIGIN[oid]; if (!o) return 0;
    if (TOP[oid]) return 3;
    var fl = o.fl || [];
    if (fl.indexOf('elite') >= 0 || (o.w && o.w[1] >= 2e7) || o.vip >= 1) return 2;
    if (fl.indexOf('rich') >= 0) return 2;
    return 0;
  };
  G.connLevel = function () {
    var p = P(); if (!p || p.flags.trafficked || p.flags.exRoyal) return 0;
    var c = G.connOf(p.origin);
    // a family that has risen high in this life counts too
    if (p.gov && p.gov.rank >= 5) c = Math.max(c, 2);
    if (p.flags.monarch) c = 3;
    return c;
  };
  G.originPerks = function (o, cid, y) {
    var c = G.connOf(o.id), out = [];
    if (o.w) out.push(G.L('家底约{a}~{b}|Family wealth ~{a}–{b}', { a: G.fmL ? G.fmL(G.$(o.w[0], cid, y, 3), cid, G.lang === 'en' ? 1 : 0) : G.M(G.$(o.w[0])), b: G.fmL ? G.fmL(G.$(o.w[1], cid, y, 3), cid, G.lang === 'en' ? 1 : 0) : G.M(G.$(o.w[1])) }));
    if (c >= 3) out.push(G.L('👑 顶级人脉：从政晋升更快、考公加分、求职更容易、公司和研发更顺；百亿项目只需100~200万|👑 Top connections: faster rise in office, exam bonus, easier hiring, smoother business and R&D; mega projects from $1–2M'));
    else if (c >= 2) out.push(G.L('💼 人情世故：公司和研发更顺、求职更容易；百亿项目只需100~200万|💼 Well connected: smoother business and R&D, easier hiring; mega projects from $1–2M'));
    return out.length ? G.join(out, ' · ', ' · ') : '';
  };

  /* hiring: a word from the family helps */
  var q0 = G.career && G.career.qualify;
  if (q0) G.career.qualify = function (j) { var q = q0.apply(this, arguments), c = G.connLevel(); if (q && c) q.ch = Math.min(.98, (q.ch || 0) + c * .07); return q; };

  /* business: new products succeed more often, especially with connections */
  var BIZ = G.ACT_BIZ || [];
  var rnd = BIZ.filter(function (a) { return a.id === 'co_rnd'; })[0];
  if (rnd) rnd.run = function (a) {
    var c = S().assets.company, p = P(), cl = G.connLevel();
    var ch = Math.min(.95, .62 + p.st.smarts / 400 + (G.has('biz') ? .1 : 0) + cl * .06);
    var w = G.ch(ch);
    c.val = Math.round(c.val * (w ? G.rf(1.15, 1.5) : .95));
    G.dStart(); if (w) G.addStat('happy', 6); else G.addStat('stress', 4); var dl = G.dEnd();
    return G.result(a.n, w ? G.L('新产品一上市就卖断了货！公司估值{v}。（这次成功率约{c}%）|The new product sold out on launch! Valuation: {v}. (Odds this time: ~{c}%)', { v: G.M(c.val), c: Math.round(ch * 100) }) : G.L('新产品反响平平，研发费打了水漂。（这次成功率约{c}%）|The new product flopped; the R&D money is gone. (Odds this time: ~{c}%)', { c: Math.round(ch * 100) }), null, dl, a.i);
  };

  /* yearly: contacts open doors */
  var mt = G.money.tick;
  G.money.tick = function () {
    var r = mt.apply(this, arguments), s = S(), p = s.p;
    if (s.dead) return r;
    try {
      var cl = G.connLevel();
      var co = s.assets.company;
      if (co && cl >= 2 && !p.jail) {
        co.eff = (co.eff || 0) + 1; // someone always knows someone
        if (G.ch(cl >= 3 ? .3 : .2)) (s.pendQ = s.pendQ || []).push({ id: 'v20_contract' });
      }
      if (cl >= 3 && p.gov && p.gov.track === 'civil') p.gov.perf = Math.min(100, (p.gov.perf || 50) + 6);
      if (cl >= 3 && p.pol) p.pol.merit = (p.pol.merit || 0) + 2;
      // children of a political family
      var red = p.origin === 'red' || (p.gov && p.gov.rank >= 5) || !!p.flags.monarch;
      if (red) N.rel('child').forEach(function (k) {
        if (!k.alive || N.age(k) < 18) return;
        if (!k.job || /富二代|Heir to a Fortune|无业|Unemployed/.test(k.job) || k.unemp || k.neet) {
          k.job = G.pick(['国企高管|State Enterprise Executive', '机关干部|Government Official', '驻外外交官|Diplomat Abroad', '投资公司合伙人|Investment Partner']); k.inc = Math.max(k.inc || 0, G.$w(G.ri(120, 400) * 1000)); k.unemp = 0; k.neet = 0; k.red2 = 1;
        }
      });
    } catch (e) { console.error(e); }
    return r;
  };
  G.evs([
    { id: 'v20_contract', sys: 1, title: '人情|A Favour Returned', icon: '🤝',
      prep: function (c) { var co = S().assets.company; if (!co) return false; c.prm.co = co.name; c.prm.who = G.pick(['父亲的老战友|an old comrade of your father\'s', '家里的世交|a family friend of three generations', '叔叔在部委的同学|your uncle\'s classmate at the ministry', '奶奶的牌友|your grandmother\'s mahjong partner', '你小学同学的爸爸|the father of a primary-school friend']); },
      t: '{who}打来电话：“听说{co}在找大客户？我这儿正好有一个项目。”|{who} calls: "I hear {co} is looking for a big client? I happen to have a project."',
      o: [
        { t: '接下来，登门道谢|Take it, and call round to say thanks', run: function (c) { var co = S().assets.company, up = G.rf(.1, .25); co.val = Math.round(co.val * (1 + up)); c.add('eq', 2); c.prm.v = G.M(co.val); return '项目谈得很顺。公司估值涨到了{v}。逢年过节，你都没忘了去看看对方。|The deal went smoothly; the company is now worth {v}. You never forgot to visit at New Year.'; } },
        { t: '婉谢，靠自己|Politely decline — do it yourself', run: function (c) { c.add('karma', 2); c.add('smarts', 1); return '对方笑了：“有骨气。”后来又给你介绍了两个人。|They laughed: "You\'ve got backbone." Later they introduced you to two more people anyway.'; } }
      ] }
  ]);
  // rich kids vs red second generation: the title says which
  var t20 = G.title;
  G.title = function () {
    var t = t20.apply(this, arguments), p = P();
    if (p && p.origin === 'red' && p.age < 35 && /富二代|Heir to a Fortune/.test(String(t))) return '红二代|Red Second Generation';
    return t;
  };
})();
