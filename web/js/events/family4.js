/* Your children's big school decisions come to you: when a child starts primary, middle and high school,
   and when they finish school, a choice pops up — international or public, boarding or abroad, which university.
   Children of royal and wealthy families also grow into lives that fit the family. */
(function () {
  'use strict';
  var N = G.N, FA = G.family;
  function S() { return G.S; }
  var SCH = G.KSCHOOL;
  var ABROAD = ['us', 'gb', 'ca', 'au', 'sg', 'jp', 'de', 'fr'];
  function fee(k, id) { return id === 'pub' ? 0 : G.$w(SCH[id].fee * (N.age(k) >= 15 ? 1.25 : 1), k.c || S().p.country); }
  var STAGE = { 6: ['小学|primary school', '🎒'], 12: ['初中|middle school', '📘'], 15: ['高中|high school', '🎓'] };
  var STAGE_T = { 6: '小学|Primary School', 12: '初中|Middle School', 15: '高中|High School' };
  var LABEL = {
    6: { pub: '家门口的公立小学|The public primary school nearby', key: '重点小学|A top public primary school', priv: '私立双语小学|A private bilingual primary school', intl: '国际小学|An international primary school', board: '寄宿制小学|A boarding primary school' },
    12: { pub: '普通公立初中|An ordinary public middle school', key: '重点初中|A top middle school', priv: '私立初中|A private middle school', intl: '国际初中|An international middle school', board: '寄宿制初中|A boarding middle school', abroad: '出国读初中|Middle school abroad' },
    15: { pub: '普通高中|An ordinary high school', key: '重点高中|A top high school', priv: '私立高中|A private high school', intl: '国际高中（读A-Level/IB）|An international high school (A-Level/IB)', board: '寄宿制高中|A boarding high school', abroad: '出国读高中|High school abroad' }
  };

  /* ---------------- yearly hook ---------------- */
  var grow = FA.growKid;
  FA.growKid = function (k, Q) {
    var a = N.age(k), r = grow.apply(this, arguments), p = S().p;
    if (!k.alive || k.rel !== 'child' || p.jail || S().dead) return r;
    if (STAGE[a] && !k['pk' + a] && k.edu && k.edu.stage !== 'none' && k.edu.stage !== 'done') { k['pk' + a] = 1; Q.push({ id: 'k_pick_school', nid: k.id, prm: { a: a } }); }
    if (a === 18 && !k.pk18 && k.edu && !k.abroadPlan) { k.pk18 = 1; Q.push({ id: 'k_pick_uni', nid: k.id }); }
    return r;
  };

  async function chooseSchool(c, id) {
    var k = c.npc, p = c.p, s = SCH[id], a = c.prm.a, f = fee(k, id);
    if (id === 'key') {
      var dist = S().assets.houses.some(function (h) { return h.school; });
      if (!dist) { var once = G.$w(s.once, k.c || p.country); if (!G.pay(once)) { k.sch = 'pub'; return '你拿不出择校费，{n}只能去普通学校。|You couldn\'t pay the placement fee, so {n} went to an ordinary school.'; } }
      if (k.smarts + G.ri(-10, 10) < s.test) { k.sch = 'pub'; G.dPush('aff', N.addAff(k, -3)); return '{n}没通过重点学校的入学考试，只好去了普通学校。|{n} failed the top school\'s entrance test and went to an ordinary school.'; }
    }
    if (id === 'abroad') {
      var cs = ABROAD.filter(function (x) { return x !== p.country; });
      var ci = await G.UI.pick({ title: G.L('去哪个国家？|Which country?'), items: cs.map(function (x) { return { t: G.C[x].n, icon: G.C[x].flag }; }), noCancel: 1 });
      k.schC = cs[ci < 0 ? 0 : ci];
    }
    if (f && !G.pay(f)) { k.sch = 'pub'; return '学费太贵了，{n}最后还是去了普通学校。|The fees were too high; {n} ended up at an ordinary school.'; }
    k.sch = id; k.schY = S().year; k.schPaid = S().year;
    var like = id === 'board' || id === 'abroad' ? (['rebel', 'clingy', 'anxious'].indexOf(k.pers) >= 0 ? .25 : .55) : .8;
    G.dPush('aff', N.addAff(k, G.ch(like) ? 3 : -5));
    c.prm.s = (LABEL[a] || LABEL[12])[id];
    if (id === 'abroad') c.prm.c = G.C[k.schC].n;
    return id === 'abroad' ? '{n}一个人去了{c}读书。走之前，{n}抱了你很久。|{n} left to study in {c} alone. Before going, {n} hugged you for a long time.'
      : id === 'board' ? '{n}住进了学校，周末才回家。|{n} moved into school and comes home only at weekends.'
      : id === 'intl' ? '{n}去了国际学校，第一天就交了好几个外国朋友。|{n} started at the international school and made foreign friends on day one.'
      : id === 'pub' ? '{n}去了{s}，离家近，每天走路上学。|{n} went to {s} — close by, an easy walk every day.'
      : '{n}进了{s}。|{n} started at {s}.';
  }
  function schoolOpt(id) {
    return { t: function (c) { var f = fee(c.npc, id); return G.L('{s}（{f}）|{s} ({f})', { s: (LABEL[c.prm.a] || LABEL[12])[id], f: f ? G.L('每年{m}|{m}/yr', { m: G.M(f) }) : G.L('免费|free') }); },
      if: function (c) { var a = c.prm.a; return !!(LABEL[a] || {})[id]; },
      dis: function (c) { if (id === 'pub') return false; if (c.p.flags.blacklist && S().year < c.p.flags.blacklist) return true; return !G.canPay(fee(c.npc, id)); },
      run: function (c) { return chooseSchool(c, id); } };
  }
  G.evs([
    { id: 'k_pick_school', sys: 1, title: function (c) { return G.L('{n}要上{s}了|{n} Is Starting {s}', { n: c.npc.name, s: STAGE_T[c.prm.a] }); }, icon: '🏫',
      prep: function (c) { if (!c.npc || !c.npc.alive) return false; c.prm.n = c.npc.name; c.prm.st = STAGE[c.prm.a] ? STAGE[c.prm.a][0] : ''; },
      t: function (c) {
        var k = c.npc, perf = k.edu ? Math.round(k.edu.perf) : 50;
        return G.L('{n}今年{a}岁，要上{st}了。{n}的成绩{g}。你打算让{n}去哪里读书？|{n} is {a} and about to start {st}. {n}\'s grades are {g}. Where should {n} go?', { n: k.name, a: c.prm.a, st: c.prm.st, g: perf >= 75 ? '名列前茅|near the top' : perf >= 55 ? '中上|above average' : perf >= 35 ? '一般|average' : '不太好|weak' });
      },
      o: ['pub', 'key', 'priv', 'intl', 'board', 'abroad'].map(schoolOpt) },
    { id: 'k_pick_uni', sys: 1, title: function (c) { return G.L('{n}高中毕业了|{n} Finishes High School', { n: c.npc.name }); }, icon: '🎓',
      prep: function (c) { if (!c.npc || !c.npc.alive || !c.npc.edu) return false; var e = c.npc.edu; c.prm.n = c.npc.name; c.prm.u = e.school || ''; c.prm.t = e.tier || 0; },
      t: function (c) { var e = c.npc.edu; return e.stage === 'uni' ? G.L('{n}考上了{u}（{t}星）。接下来怎么走？|{n} got into {u} ({t}★). What next?', c.prm) : G.L('{n}没考上大学。接下来怎么办？|{n} didn\'t get into university. What now?', c.prm); },
      o: [
        { t: function (c) { return G.L('就去{u}|Go to {u}', c.prm); }, if: function (c) { return c.npc.edu.stage === 'uni'; }, run: function (c) { G.dPush('aff', N.addAff(c.npc, 3)); return '{n}收拾行李，去{u}报到了。|{n} packed up and headed off to {u}.'; } },
        { t: function (c) { return G.L('送出国读大学（约{m}）|Study abroad (~{m})', { m: G.M(G.$(140000)) }); }, dis: function (c) { return !G.canPay(G.$(140000)) || !!(c.p.flags.blacklist && S().year < c.p.flags.blacklist); }, run: async function (c) {
          var k = c.npc, e = k.edu, cs = ABROAD.filter(function (x) { return x !== c.p.country; });
          var ci = await G.UI.pick({ title: G.L('去哪个国家？|Which country?'), items: cs.map(function (x) { return { t: G.C[x].n, icon: G.C[x].flag }; }), noCancel: 1 });
          var to = cs[ci < 0 ? 0 : ci];
          if (!G.pay(G.$(140000))) return '钱不够。|Not enough money.';
          var tier = G.clamp(Math.round(1.5 + k.smarts / 25 + (k.sch === 'intl' || k.sch === 'abroad' ? .8 : 0) + G.rf(-.6, .6)), 2, 5);
          var u = G.pick(G.eduSys(to).u.filter(function (x) { return x.t === tier; })) || G.pick(G.eduSys(to).u);
          e.stage = 'uni'; e.grade = 0; e.school = u.n; e.tier = u.t; e.abroad = to; e.major = e.major || G.pick(G.MAJOR_LIST);
          if (G.ch(.35)) k.stayAbroad = to;
          G.dPush('aff', N.addAff(k, 8)); c.prm.u = u.n; c.prm.c = G.C[to].n;
          return '{n}被{c}的{u}录取了！|{n} was admitted to {u} in {c}!';
        } },
        { t: '捐一栋楼，上顶尖名校|Donate a building for a top university', if: function (c) { return G.famClass && G.famClass() >= 2; }, run: function (c) {
          var k = c.npc, e = k.edu, cost = G.$(3000000);
          if (!G.pay(cost)) return '这笔捐赠实在拿不出来。|You couldn\'t raise that donation.';
          var u = G.pick(G.eduSys(k.c || c.p.country).u.filter(function (x) { return x.t >= 5; })) || G.pick(G.eduSys(k.c || c.p.country).u);
          e.stage = 'uni'; e.grade = 0; e.school = u.n; e.tier = u.t; e.abroad = null; e.major = e.major || G.pick(G.MAJOR_LIST); c.prm.u = u.n; c.add('karma', -2);
          return '学校多了一座以你家命名的图书馆，{n}进了{u}。|The university gained a library bearing your family\'s name — and {n} got into {u}.';
        } },
        { t: '复读一年再考|Repeat a year and try again', if: function (c) { return c.npc.edu.stage !== 'uni'; }, run: function (c) { var k = c.npc; k.edu.stage = 'high'; k.edu.perf = G.clamp(k.edu.perf + G.ri(5, 15), 0, 100); k.pk18 = 0; k.retakeY = S().year; k.by += 1; G.dPush('aff', N.addAff(k, -2)); return '{n}回到了高三的教室。|{n} went back to the final-year classroom.'; } },
        { t: '直接去工作|Start working', if: function (c) { return c.npc.edu.stage !== 'uni'; }, run: function (c) { G.dPush('aff', N.addAff(c.npc, 1)); return '{n}开始找工作了。|{n} started looking for work.'; } }
      ] }
  ]);

  /* ---------------- royal & wealthy children live like their family ---------------- */
  var EJ = {
    royal: function (k) { var heir = isHeir(k); return heir ? (k.g === 'm' ? '王储|Crown Prince' : '王储|Crown Princess') : (k.g === 'm' ? '王子|Prince' : '公主|Princess'); },
    noble: ['家族企业董事|Family Firm Director', '外交官|Diplomat', '慈善基金会主席|Foundation Chair', '艺术品收藏家|Art Collector'],
    rich: ['集团副总裁|Group Vice President', '投资基金合伙人|Investment Fund Partner', '家族企业总经理|Family Firm General Manager', '奢侈品牌主理人|Luxury Brand Founder'],
    red: ['国企高管|State Enterprise Executive', '部委司长|Ministry Department Head', '投资公司董事|Investment Firm Director', '军队干部|Army Officer'],
    celebrity: ['演员|Actor', '歌手|Singer', '导演|Director', '制片人|Producer']
  };
  function famKind() {
    var p = S().p;
    if (p.flags.monarch || (p.origin === 'royal' && !p.flags.exRoyal && !p.flags.trafficked)) return 'royal';
    if (p.origin === 'noble') return 'noble';
    if (p.origin === 'red' || p.flags.redfam) return 'red';
    if (p.origin === 'celebrity' && p.st.fame >= 40) return 'celebrity';
    if (G.famClass && G.famClass() >= 2) return 'rich';
    return null;
  }
  function isHeir(k) { var p = S().p, w = p.will; if (w && w.mode === 'one' && w.main === k.id) return true; var kids = N.rel('child').filter(function (x) { return x.alive && !x.illegit; }).sort(function (a, b) { return a.by - b.by; }); return !!(p.flags.monarch && kids[0] === k && !(w && w.mode === 'one')); }
  function eliteJob(k) {
    var kind = famKind(); if (!kind || k.illegit && !k.ack) return null;
    if (kind === 'royal') return EJ.royal(k);
    var L = EJ[kind]; return L[(k.av || 1) % L.length];
  }
  var OK_RX = /王子|公主|王储|Prince|Princess|总裁|合伙人|董事|主席|总经理|主理人|外交官|收藏家|高管|司长|干部|演员|歌手|导演|制片|医生|律师|教授|研究|工程师|分析师|创始人|Founder|高管|Executive|Doctor|Lawyer|Diplomat/;
  var grow2 = FA.growKid;
  FA.growKid = function (k, Q) {
    var r = grow2.apply(this, arguments), a = N.age(k);
    if (k.alive && k.rel === 'child' && a >= 18) {
      var j = eliteJob(k);
      if (j && (!OK_RX.test(G.T(k.job || '')) || famKind() === 'royal')) {
        if (famKind() === 'royal' || a >= 22 || k.edu && k.edu.stage === 'done') {
          if (G.T(k.job || '') !== G.T(j)) { k.jobBase = j; k.jobT = j; k.job = j; k.jr = k.jr || 0; k.unemp = 0; k.neet = 0; }
          var floor = G.$w(famKind() === 'royal' ? 400000 : 150000, k.c);
          k.inc = Math.max(k.inc || 0, floor); k.wealth = Math.max(k.wealth || 0, G.$(famKind() === 'royal' ? 5e6 : 1e6));
        }
      }
    }
    return r;
  };
  // royal children also read as princes and princesses in their info, heirs as crown prince/princess
  var rn0 = N.relName;
  N.relName = function (n) {
    var p = S() && S().p;
    if (p && n.rel === 'child' && famKind() === 'royal' && (!n.illegit || n.ack)) return isHeir(n) ? (n.g === 'm' ? '王储（儿子）|Crown Prince (son)' : '王储（女儿）|Crown Princess (daughter)') : (n.g === 'm' ? '王子（儿子）|Prince (son)' : '公主（女儿）|Princess (daughter)');
    return rn0.apply(this, arguments);
  };

  /* ---------------- every child has another parent ---------------- */
  var LO = G.love, baby0 = LO.baby;
  LO.baby = async function (other, adopted) {
    var k = await baby0.apply(this, arguments);
    if (k && other && !adopted) { if (!k.par2) k.par2 = other.id; other.pin = 1; }
    return k;
  };
  function otherParent(k) { var o = k.par2 && S().npcs[k.par2]; if (o) return o; var sp = N.spouse(); return sp && !k.adopted && !k.illegit ? sp : null; }
  // the other parent gives their own pocket money — generous or stingy depending on what they have
  var grow3 = FA.growKid;
  FA.growKid = function (k, Q) {
    var r = grow3.apply(this, arguments), a = N.age(k), o = otherParent(k);
    if (k.alive && k.rel === 'child' && a >= 3 && a < 22 && o && o.alive && !o.sep) {
      var base = (o.inc || 0) * (o.rel === 'spouse' ? .02 : .04) + Math.max(0, o.wealth || 0) * .004;
      var amt = Math.round(Math.min(base, Math.max(0, o.wealth || 0) * .2) * (.5 + (o.aff || 50) / 200) * (a < 12 ? .4 : 1));
      if (amt > 0) { o.wealth = Math.max(0, (o.wealth || 0) - amt); k.wealth = (k.wealth || 0) + amt; k.oAllow = amt; } else k.oAllow = 0;
    } else if (a >= 22) k.oAllow = 0;
    return r;
  };
  // when the other parent dies, what they had goes to their children
  var nt0 = N.tick;
  N.tick = function () {
    var out = nt0.apply(this, arguments) || [];
    out.forEach(function (d) {
      if (!d || d.rel === 'spouse' || d.rel === 'father' || d.rel === 'mother') return;
      var kids = N.all(function (n) { return n.alive && n.rel === 'child' && n.par2 === d.id; });
      if (!kids.length || (d.wealth || 0) <= 0) return;
      var each = Math.round(d.wealth * (1 - (G.C[d.c || S().p.country].itax || 0)) / kids.length);
      kids.forEach(function (k) { k.wealth = (k.wealth || 0) + each; k.oInh = (k.oInh || 0) + each; N.addAff(k, -2); });
      d.wealth = 0;
      G.log('{d}去世了，留给{k}每人{m}遗产。|{d} has died, leaving {m} each to {k}.', { d: d.name, k: kids.map(function (k) { return G.T(k.name); }).join('、') + '|' + kids.map(function (k) { return G.T(k.name); }).join(', '), m: G.M(each) });
    });
    return out;
  };
  var info0 = G.npcInfo;
  G.npcInfo = function (n) {
    var rows = info0.apply(this, arguments);
    if (n.rel === 'child') {
      var o = otherParent(n);
      if (o) rows.unshift([o.g === 'f' ? '母亲|Mother' : '父亲|Father', G.T(o.name) + (o.alive ? '' : G.T('（已故）| (deceased)')) + ' · ' + G.T(N.relName(o))]);
      var mine = n.allow ? Math.round(n.allow / 12) : 0, theirs = n.oAllow ? Math.round(n.oAllow / 12) : 0;
      if ((mine || theirs) && N.age(n) < 22) rows.push(['每月零花钱|Monthly allowance', G.T('你{a}|You {a}', { a: G.fm(mine) }) + (o ? ' · ' + G.T(o.g === 'f' ? '母亲{b}|Mother {b}' : '父亲{b}|Father {b}', { b: G.fm(theirs) }) : '')]);
      if (n.oInh) rows.push([o && o.g === 'm' ? '父亲的遗产|From father\'s estate' : '母亲的遗产|From mother\'s estate', G.fm(n.oInh)]);
    }
    return rows;
  };
  /* royal brothers and sisters: an heir is the Crown Prince, never a delivery rider */
  var nt1 = N.tick;
  N.tick = function () {
    var out = nt1.apply(this, arguments), p = S().p;
    if (p.origin === 'royal' && !p.flags.exRoyal && !p.flags.trafficked) N.rel('sibling').forEach(function (s) {
      if (!s.alive) return;
      var t = s.reign ? (s.g === 'm' ? '国王|King' : '女王|Queen') : s.heir ? (s.g === 'm' ? '王储|Crown Prince' : '王储|Crown Princess') : (s.g === 'm' ? '王子|Prince' : '公主|Princess');
      s.job = t; s.inc = Math.max(s.inc || 0, G.$w(s.reign ? 3e6 : 4e5, s.c)); s.wealth = Math.max(s.wealth || 0, G.$(s.reign ? 5e7 : 5e6));
    });
    return out;
  };
})();
