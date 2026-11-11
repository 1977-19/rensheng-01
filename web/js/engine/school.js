/* Education system */
(function () {
  'use strict';
  var SC = G.school = {};
  var TUITION = { us: 30000, gb: 12000, au: 14000, ca: 10000, jp: 6000, kr: 7000, sg: 8000, cn: 1500, de: 400, fr: 400, it: 2000, es: 1600, ru: 2000, in: 1500, br: 300, mx: 600, th: 1500, za: 3000 };
  SC.tuition = function (cid, abroad) { return G.$((TUITION[cid] || 3000) * (abroad ? 2.2 : 1), cid); };
  function sysName(stage, good) {
    var p = G.S.p, city = p.city, n = G.ri(1, 30), cn = p.country === 'cn';
    if (stage === 'kinder') return G.L('{c}阳光幼儿园|{c} Sunshine Kindergarten', { c: city });
    if (stage === 'primary') return cn ? G.L('{c}第{n}小学|{c} No.{n} Primary School', { c: city, n: n }) : G.L('{c}小学|{c} Elementary School', { c: city });
    if (stage === 'middle') return cn ? G.L('{c}第{n}中学|{c} No.{n} Middle School', { c: city, n: n }) : G.L('{c}初级中学|{c} Middle School', { c: city });
    if (stage === 'high') return good ? (cn ? G.L('{c}第一中学|{c} No.1 High School', { c: city }) : G.L('{c}重点高中|{c} Academy', { c: city }))
      : (cn ? G.L('{c}第{n}高级中学|{c} No.{n} High School', { c: city, n: n }) : G.L('{c}高中|{c} High School', { c: city }));
    if (stage === 'voc') return G.L('{c}职业技术学校|{c} Vocational School', { c: city });
    return '';
  }
  /* school quality 1..5: drives how fast you grow and how well you test */
  SC.baseQ = function () {
    var S = G.S, p = S.p, q = 4.4 - ((p.tier || 3) - 1) * .55;       // big cities have better schools
    if (S.assets.houses.some(function (h) { return h.school; })) q += 1.2; // school-district home
    var fw = G.famWealth() + p.money;
    if (fw > G.$(2e6)) q += .8; else if (fw < G.$(20000)) q -= .6;
    if (p.flags.acafam || p.flags.elite) q += .6;
    return Math.round(G.clamp(q + G.rf(-.6, .6), 1, 5));
  };
  SC.Q_NAME = ['', '薄弱|Struggling', '普通|Ordinary', '不错|Good', '重点|Top-ranked', '顶尖|Elite'];
  SC.enter = function (stage, school, q) {
    var e = G.S.p.edu;
    e.stage = stage; e.grade = 0; e.school = school || sysName(stage); e.study = 0;
    e.q = q != null ? q : stage === 'voc' ? 2 : SC.baseQ();
    G.N.rel('classmate').forEach(function (n) { if (n.aff < 40) delete G.S.npcs[n.id]; });
  };
  SC.inSchool = function () { var s = G.S.p.edu.stage; return s && s !== 'none' && s !== 'done'; };
  SC.isStudent = function () { var s = G.S.p.edu.stage; return ['primary', 'middle', 'high', 'voc', 'uni', 'master', 'phd'].indexOf(s) >= 0; };
  SC.stageYears = function () { var e = G.S.p.edu, st = G.STAGES[e.stage]; if (!st) return 0; if (e.stage === 'uni' && e.major && G.MAJORS[e.major].y) return G.MAJORS[e.major].y; return st.y; };

  SC.tick = function (Q) {
    var S = G.S, p = S.p, e = p.edu, a = p.age, cn = p.country === 'cn';
    if (p.jail) { if (SC.inSchool()) { e.stage = 'none'; G.log('因为入狱，你被学校开除了。|You were expelled because of your prison sentence.'); } return; }
    if (p.mil && p.mil.cons && SC.inSchool()) return;
    var closed = cn && S.year >= 1966 && S.year <= 1968;
    if (!e.stage || e.stage === 'none') {
      if (a === 3 && !p.flags.noSchool) { SC.enter('kinder'); G.log('你上幼儿园了。|You started kindergarten.'); }
      else if (a === 6 && !p.flags.noSchool) { SC.enter('primary'); G.log('你背上书包，成了一名小学生。|You put on a backpack and became a primary school student.'); G.major('上小学|Started primary school'); }
      return;
    }
    if (e.stage === 'kinder') { if (a >= 6) { SC.enter('primary'); G.log('你背上书包，成了一名小学生。|You put on a backpack and became a primary school student.'); G.major('上小学|Started primary school'); } return; }
    if (e.stage === 'done') return;
    // performance update
    var q = e.q || 3;
    var tgt = p.st.smarts * .55 + e.study * 6 + p.st.happy * .1 + G.ri(-8, 8) + (G.has('genius') ? 8 : 0) + (G.has('slow') ? -8 : 0) - (p.h.stress > 70 ? 6 : 0) + (q - 3) * 3 + (G.circle ? G.circle.teacherBonus() : 0) - 4;
    if (closed) { tgt = e.perf; G.log('学校停课了，你整天无所事事。|School is closed. You have nothing to do all day.'); }
    e.perf = G.clamp(Math.round(e.perf * .55 + tgt * .45), 0, 100);
    if (e.study >= 3) G.addStat('smarts', 1, true);
    // better schools: faster growth, more pressure; weak schools: slower growth, more trouble
    if (!closed && e.stage !== 'kinder') {
      G.addStat('smarts', [0, -.4, .2, .8, 1.6, 2.4][q] + (e.study >= 2 ? (q - 2) * .3 : 0), true);
      if (q >= 4) G.addStat('stress', 4 + (q - 4) * 3, true);
      if (q >= 4) G.addStat('eq', .4, true);
    }
    e.study = 0;
    e.grade++;
    if (e.grade < SC.stageYears()) return;
    // graduation of stage
    switch (e.stage) {
      case 'primary':
        e.deg = 1; SC.enter('middle', null, e.perf > 85 ? Math.min(5, SC.baseQ() + 1) : null);
        G.log('小学毕业了，你升入了{s}。|You finished primary school and moved up to {s}.', { s: e.school });
        break;
      case 'middle':
        e.deg = 2;
        if (G.eduSys(p.country).hs) Q.push({ id: 'sys_hs_exam' });
        else if (e.perf < 25 && G.ch(.5)) { SC.enter('voc'); G.log('成绩不理想，你进入了职业学校。|Your grades were poor, so you went to vocational school.'); }
        else { SC.enter('high', sysName('high', e.perf > 75), e.perf > 85 ? 5 : e.perf > 75 ? 4 : null); G.log('你升入了{s}。|You moved up to {s}.', { s: e.school }); }
        break;
      case 'high': case 'voc':
        e.deg = 3; e.stage = 'done'; G.major('高中毕业|Graduated high school');
        if (cn && S.year >= 1966 && S.year <= 1976) Q.push({ id: 'sys_uni_recommend' });
        else Q.push({ id: 'sys_uni_exam' });
        break;
      case 'uni':
        e.deg = 4; e.stage = 'done'; G.major('大学毕业：{s}|Graduated from {s}', { s: e.school });
        G.inc('grads'); Q.push({ id: 'sys_graduate' });
        break;
      case 'master':
        e.deg = 5; e.stage = 'done'; G.major('获得硕士学位|Earned a master\'s degree');
        Q.push({ id: 'sys_graduate' });
        break;
      case 'phd':
        e.deg = 6; e.stage = 'done'; G.major('获得博士学位|Earned a PhD');
        G.addStat('fame', 3); Q.push({ id: 'sys_graduate' });
        break;
    }
  };

  /* exam score 0..100 */
  SC.examScore = function (gameScore) {
    var p = G.S.p, e = p.edu;
    var s = e.perf * .42 + p.st.smarts * .27 + (gameScore != null ? gameScore * 24 : G.nrm(p.st.smarts / 100, .12) * 24) + (G.stat('luck') / 12) + G.ri(-7, 6);
    if (G.has('genius')) s += 5;
    if (p.flags.guaranteed) { s += 16; p.flags.guaranteed = 0; }
    if (p.h.stress > 75) s -= 6;
    if (p.st.health < 40) s -= 4;
    return G.clamp(Math.round(s), 0, 100);
  };
  SC.maxTier = function (sc) { return sc >= 92 ? 5 : sc >= 81 ? 4 : sc >= 65 ? 3 : sc >= 45 ? 2 : 1; };
  SC.admitChance = function (uniT, sc) {
    var mt = SC.maxTier(sc);
    if (uniT <= mt - 1) return .98;
    if (uniT === mt) return .85;
    if (uniT === mt + 1) return .22;
    return .03;
  };
  async function takeExam(c, name) {
    var r = await c.game('exam', { name: name });
    return SC.examScore(r.score);
  }
  /* family pays tuition if possible */
  SC.payTuition = function (amt) {
    var par = G.N.rel('father', 'mother', 'grand').filter(function (n) { return n.wealth > amt; });
    if (par.length && G.dependent()) { par[0].wealth -= amt; return 'parents'; }
    if (G.S.p.money >= amt) { G.addMoney(-amt); return 'self'; }
    G.S.assets.debt.push({ k: 'stu', n: '助学贷款|Student Loan', amt: amt, r: .03 });
    return 'loan';
  };

  /* list of choices after uni exam */
  SC.uniChoices = function (sc, abroadCid) {
    var p = G.S.p, cid = abroadCid || p.country, sys = G.eduSys(cid), out = [];
    var mt = SC.maxTier(sc);
    sys.u.forEach(function (u) {
      if (u.t > mt + 1 && G.ch(.6)) return;
      out.push({ n: u.n, t: u.t, ch: SC.admitChance(u.t, sc), cid: cid });
    });
    return out;
  };
  SC.chLabel = function (ch) {
    var v = G.vip ? G.vip.tier() : 0;
    if (v >= 3) return G.L('录取率 {x}%|{x}% chance', { x: Math.round(ch * 100) });
    return ch > .8 ? '稳|Safe' : ch > .5 ? '较稳|Likely' : ch > .15 ? '冲|Reach' : '很难|Long shot';
  };
  SC.admit = function (u, major) {
    var p = G.S.p, e = p.edu;
    e.stage = 'uni'; e.grade = 0; e.school = u.n; e.tier = u.t; e.q = u.t; e.major = major; e.study = 0; e.perf = G.clamp(e.perf, 30, 100);
    if (u.cid && u.cid !== p.country) { e.abroad = u.cid; p.flags.abroad = u.cid; } else { e.abroad = null; }
    if (u.spec) e.spec = u.spec; else e.spec = null;
    G.major('考入{s}|Admitted to {s}', { s: u.n });
    G.inc('uni');
    if (u.t >= 5) G.inc('topuni');
  };
  SC.pickMajor = async function (c, spec) {
    if (spec === 'mil') return 'mil';
    if (spec === 'pol') return 'police';
    if (spec === 'art') return 'act';
    if (spec === 'mus') return 'music';
    if (spec === 'spo') return 'sport';
    var list = G.MAJOR_LIST.slice();
    var i = await G.UI.pick({ title: G.L('选择专业|Choose a Major'), text: G.L('你想学什么专业？|What do you want to study?'),
      items: list.map(function (m) { return { t: G.MAJORS[m].n, icon: '📘' }; }) });
    return list[i < 0 ? 0 : i];
  };

  /* ---------- system events ---------- */
  G.evs([
    { id: 'sys_hs_exam', sys: 1, title: function () { return G.eduSys(G.S.p.country).hs; }, icon: '📝',
      t: '{ex}要来了，这将决定你能上什么样的高中。|The {ex} is here. It decides which high school you get into.',
      prep: function (c) { c.prm.ex = G.eduSys(c.p.country).hs; },
      o: [
        { t: '认真考试（小游戏）|Take the exam (mini-game)', run: async function (c) { return SC.hsResult(c, await takeExam(c, c.prm.ex)); } },
        { t: '听天由命（自动）|Leave it to fate (auto)', run: function (c) { return SC.hsResult(c, SC.examScore(null)); } }
      ] },
    { id: 'sys_uni_exam', sys: 1, title: function () { return G.eduSys(G.S.p.country).ue; }, icon: '🎓',
      t: '人生最重要的考试之一——{ex}，就在眼前。|One of the biggest exams of your life — the {ex} — is here.',
      prep: function (c) { c.prm.ex = G.eduSys(c.p.country).ue; },
      o: [
        { t: '全力以赴（小游戏）|Give it everything (mini-game)', run: async function (c) { return SC.uniFlow(c, await takeExam(c, c.prm.ex)); } },
        { t: '听天由命（自动）|Leave it to fate (auto)', run: function (c) { return SC.uniFlow(c, SC.examScore(null)); } },
        { t: '不考了，直接工作|Skip it and start working', run: function (c) { c.p.edu.stage = 'done'; return '你决定不上大学，早点出来闯荡社会。|You decide to skip university and enter the working world early.'; } }
      ] },
    { id: 'sys_uni_recommend', sys: 1, title: '工农兵大学生|Worker-Peasant-Soldier Students', icon: '📜',
      t: '高考暂停，大学只通过推荐招生。|The Gaokao is suspended; universities admit only by recommendation.',
      o: [
        { t: '争取推荐名额|Try for a recommendation', run: function (c) {
          var ch = .08 + c.p.st.eq / 400 + Math.max(0, c.p.h.karma) / 400 + (c.p.flags.govfam || c.p.flags.redfam ? .4 : 0);
          if (G.ch(ch)) { var u = G.pick(G.eduSys('cn').u.filter(function (x) { return x.t >= 2 && x.t <= 4; })); SC.admit({ n: u.n, t: u.t }, G.pick(G.MAJOR_LIST)); SC.payTuition(SC.tuition('cn')); return G.L('你被推荐进入了{s}！|You were recommended to {s}!', { s: u.n }); }
          c.p.edu.stage = 'done'; return '名额被别人拿走了，你只能去工作。|Someone else got the spot. You go to work instead.';
        } },
        { t: '直接参加工作|Start working', run: function (c) { c.p.edu.stage = 'done'; return '你进了工厂，成了一名工人。|You join a factory as a worker.'; } }
      ] },
    { id: 'sys_graduate', sys: 1, title: '毕业了|Graduation', icon: '🎓',
      t: function (c) { return c.p.edu.abroad ? '你从{s}毕业了，接下来怎么走？|You graduated from {s}. What next?' : '你从{s}毕业了！接下来的路怎么走？|You graduated from {s}! What comes next?'; },
      prep: function (c) {
        var e = c.p.edu; c.prm.s = e.school || '学校|school';
        if (e.spec === 'mil') { G.mil.commission(); e.spec = null; return false; }
        if (e.spec === 'pol') { G.police.join(true); e.spec = null; return false; }
      },
      o: [
        { t: '找工作|Look for a job', run: async function (c) { await G.career.search(c); } },
        { t: '考研深造|Apply to grad school', if: function (c) { return c.p.edu.deg === 4; }, run: async function (c) {
          var r = await c.game('exam', { name: '研究生考试|Graduate Entrance Exam' });
          var sc = SC.examScore(r.score);
          if (sc >= 58) { var e = c.p.edu; e.stage = 'master'; e.grade = 0; SC.payTuition(SC.tuition(c.p.country)); return G.L('你考上了研究生！|You got into grad school!'); }
          return '差几分没考上，只能先去找工作了。|You missed the cutoff by a few points. Time to find work.';
        } },
        { t: '读博士|Pursue a PhD', if: function (c) { return c.p.edu.deg === 5 && c.p.edu.perf >= 55; }, run: function (c) { var e = c.p.edu; e.stage = 'phd'; e.grade = 0; return '你开始了漫长的读博生涯。|You begin the long road of a PhD.'; } },
        { t: '留在当地工作并移民|Stay and immigrate', if: function (c) { return !!c.p.edu.abroad && c.p.edu.abroad !== c.p.country; }, run: function (c) {
          var to = c.p.edu.abroad, ok = G.ch(.55 + c.p.edu.tier * .07 + (G.has('polyglot') ? .15 : 0));
          if (ok) { G.money.emigrate(to, true); return G.L('你拿到了工作签证，留在了{c}！|You got a work visa and stayed in {c}!', { c: G.C[to].n }); }
          return '签证没批下来，你只好回国。|Your visa was denied, so you went home.';
        } },
        { t: '先休息一年|Take a gap year', run: function (c) { c.add('happy', 8); return '你给自己放了个长假。|You give yourself a long break.'; } }
      ] }
  ]);

  SC.hsResult = function (c, sc) {
    var e = c.p.edu;
    if (sc >= 75) { SC.enter('high', sysName('high', true), sc >= 88 ? 5 : 4); c.add('happy', 6); return G.L('考了{s}分！你考进了{n}。|You scored {s}! You got into {n}.', { s: sc, n: e.school }); }
    if (sc >= 42) { SC.enter('high', null, sc >= 60 ? 3 : 2); return G.L('考了{s}分，你上了{n}。|You scored {s} and went to {n}.', { s: sc, n: e.school }); }
    if (sc >= 25) { SC.enter('voc'); c.add('happy', -4); return G.L('只考了{s}分，你去了职业学校。|Only {s}. You ended up at a vocational school.', { s: sc }); }
    e.stage = 'done'; c.add('happy', -8); return G.L('只考了{s}分，你没学上了。|Only {s}. No school would take you.', { s: sc });
  };

  /* full university admission flow (choose uni, major) */
  SC.uniFlow = async function (c, sc) {
    var p = c.p, e = p.edu, cid = p.country;
    G.log('你的{ex}成绩：{s}分（满分100）。|Your {ex} score: {s}/100.', { ex: G.eduSys(cid).ue, s: sc });
    var choices = SC.uniChoices(sc);
    var items = choices.map(function (u) { return { t: u.n, sub: G.L('{t}星 · {c}|{t}★ · {c}', { t: u.t, c: SC.chLabel(u.ch) }), icon: '🏛️', v: u }; });
    var sys = G.eduSys(cid), fw = G.famWealth() + p.money;
    if (p.st.health >= 60 && !p.crime.rec && sc >= 52) items.push({ t: sys.mil, sub: G.L('军校 · 需体能考核|Military Academy · physical test', {}), icon: '🎖️', v: { n: sys.mil, t: 4, spec: 'mil', ch: .8 } });
    if (p.st.health >= 55 && !p.crime.rec && sc >= 44) items.push({ t: sys.pol, sub: G.L('警校 · 需体能考核|Police Academy · physical test', {}), icon: '👮', v: { n: sys.pol, t: 3, spec: 'pol', ch: .8 } });
    items.push({ t: sys.art, sub: G.L('艺术院校 · 需专业面试|Arts school · audition', {}), icon: '🎭', v: { n: sys.art, t: 4, spec: 'art', ch: 0 } });
    items.push({ t: sys.mus, sub: G.L('音乐学院 · 需专业面试|Conservatory · audition', {}), icon: '🎼', v: { n: sys.mus, t: 4, spec: 'mus', ch: 0 } });
    if (p.st.health >= 65) items.push({ t: sys.spo, sub: G.L('体育院校 · 需体能测试|Sports university · fitness test', {}), icon: '🏅', v: { n: sys.spo, t: 3, spec: 'spo', ch: 0 } });
    if ((G.famClass && G.famClass() >= 2) || fw >= G.$(200000)) items.push({ t: G.L('捐资入学|Donate Your Way In'), sub: G.L('任选一所大学，家里出一大笔“捐赠”|Pick any university — your family makes a large "donation"'), icon: '💰', v: { donate: 1 } });
    if (fw > SC.tuition(cid) * 25 || p.flags.rich) items.push({ t: G.L('出国留学|Study Abroad'), sub: G.L('选择其他国家的大学|Pick a university in another country'), icon: '✈️', v: { abroad: 1 } });
    if (e.retake < 3) items.push({ t: G.eduSys(cid).retake, sub: G.L('明年再考一次|Try again next year'), icon: '🔁', v: { retake: 1 } });
    items.push({ t: G.L('不上大学了|Skip university'), icon: '🚶', v: { none: 1 } });
    var idx = await G.UI.pick({ title: G.L('填报志愿|University Application'), text: G.L('你考了{s}分，选择你想去的学校。|You scored {s}. Choose where to apply.', { s: sc }), items: items, noCancel: 1 });
    var v = (items[idx] || items[items.length - 1]).v;
    if (v.none) { e.stage = 'done'; return '你决定不读大学。|You decide not to go to university.'; }
    if (v.retake) { e.retake++; e.stage = 'high'; e.grade = SC.stageYears() - 1; c.add('happy', -5); G.inc('retake'); return '你决定复读一年，明年再战。|You decide to repeat the year and try again.'; }
    if (v.donate) {
      var DON = [0, 0, 150000, 400000, 1500000, 5000000];
      var pool = [];
      G.eduSys(cid).u.forEach(function (u) { pool.push({ u: u, c: cid }); });
      ['us', 'gb', 'ca', 'au', 'sg', 'jp', 'fr', 'de'].filter(function (x) { return x !== cid; }).forEach(function (x) { G.eduSys(x).u.filter(function (u) { return u.t >= 4; }).forEach(function (u) { pool.push({ u: u, c: x }); }); });
      pool.sort(function (a, b) { return b.u.t - a.u.t; });
      var di = await G.UI.pick({ title: G.L('选择大学|Choose a University'), text: G.L('分数不够没关系，只要“捐赠”到位。|Your score doesn\'t matter if the "donation" is right.'), items: pool.map(function (x) { var m = Math.round(G.$(DON[x.u.t] * (x.c === cid ? 1 : 1.5))); return { t: x.u.n, sub: G.C[x.c].flag + ' ' + G.L('{t}星 · 捐赠{m}|{t}★ · donation {m}', { t: x.u.t, m: G.M(m) }), icon: '🏛️' }; }) });
      if (di < 0) di = pool.length - 1;
      var pk = pool[di], cost = Math.round(G.$(DON[pk.u.t] * (pk.c === cid ? 1 : 1.5)));
      if (!(G.famFund ? G.famFund(cost) : G.pay(cost))) { e.stage = 'done'; c.add('happy', -8); return G.L('家里一时拿不出这笔捐赠，你错过了入学。|Your family couldn\'t raise the donation in time, and you missed enrollment.'); }
      var dm = await SC.pickMajor(c);
      SC.admit(pk.u, dm); if (pk.c !== cid) { e.abroad = pk.c; SC.payTuition(SC.tuition(pk.c, true)); } else SC.payTuition(SC.tuition(cid));
      c.add('happy', 6); c.add('karma', -2); G.inc('donateAdmit');
      return G.L('学校新建了一栋以你家命名的图书馆，你被{n}录取了。同学们背后都叫你“关系户”。|The university opened a new library bearing your family name — and admitted you to {n}. Behind your back, classmates call it what it is.', { n: pk.u.n });
    }
    if (v.abroad) {
      var cs = G.CLIST.filter(function (x) { return x !== cid; });
      var ci = await G.UI.pick({ title: G.L('选择留学国家|Choose a Country'), items: cs.map(function (x) { return { t: G.C[x].n, icon: G.C[x].flag }; }) });
      var to = cs[ci < 0 ? 0 : ci];
      var ab = SC.uniChoices(Math.min(100, sc + 6), to);
      var ui = await G.UI.pick({ title: G.L('选择大学|Choose a University'), items: ab.map(function (u) { return { t: u.n, sub: G.L('{t}星 · {c}|{t}★ · {c}', { t: u.t, c: SC.chLabel(u.ch) }), icon: '🏛️' }; }) });
      var u2 = ab[ui < 0 ? 0 : ui];
      if (!G.ch(u2.ch)) { e.stage = 'done'; c.add('happy', -10); return G.L('{n}拒绝了你的申请。|{n} rejected your application.', { n: u2.n }); }
      var mj = await SC.pickMajor(c);
      SC.admit(u2, mj); SC.payTuition(SC.tuition(to, true));
      c.add('happy', 10);
      return G.L('你被{n}录取了，即将出国留学！|You were admitted to {n}. Off to study abroad!', { n: u2.n });
    }
    if (v.spec) {
      var ok = true, gname = v.spec === 'mil' || v.spec === 'pol' || v.spec === 'spo' ? 'sprint' : 'rhythm';
      var r = await c.game(gname, { name: v.n });
      var need = v.spec === 'mil' ? .45 : v.spec === 'pol' ? .4 : .5;
      var bonus = (v.spec === 'art' && (G.has('actor') || c.p.st.looks > 75) ? .15 : 0) + (v.spec === 'mus' && G.has('music') ? .2 : 0) + (v.spec === 'spo' && G.has('athletic') ? .2 : 0);
      ok = r.score + bonus >= need && (v.spec !== 'art' && v.spec !== 'mus' || sc >= 35);
      if (!ok) { e.stage = 'done'; c.add('happy', -8); return G.L('{n}的专业考核没通过。|You failed the {n} entrance assessment.', { n: v.n }); }
      SC.admit(v, await SC.pickMajor(c, v.spec)); SC.payTuition(SC.tuition(cid));
      c.add('happy', 10);
      return G.L('你通过考核，被{n}录取了！|You passed the assessment and were admitted to {n}!', { n: v.n });
    }
    if (!G.ch(v.ch)) {
      // fall back to a lower tier
      var lower = choices.filter(function (u) { return u.t < v.t && u.ch > .8; });
      if (lower.length) { var lu = G.pick(lower); SC.admit(lu, await SC.pickMajor(c)); SC.payTuition(SC.tuition(cid)); c.add('happy', -3); return G.L('{a}没录取你，你被调剂到了{b}。|{a} turned you down; you were placed at {b} instead.', { a: v.n, b: lu.n }); }
      e.stage = 'done'; c.add('happy', -12); return G.L('{a}没有录取你，你落榜了。|{a} did not admit you. You missed out.', { a: v.n });
    }
    var m = await SC.pickMajor(c);
    SC.admit(v, m); SC.payTuition(SC.tuition(cid));
    c.add('happy', 8 + v.t * 2); if (v.t >= 4) c.add('fame', 2);
    return G.L('恭喜！你被{n}{m}专业录取了！|Congratulations! You were admitted to {n} to study {m}!', { n: v.n, m: G.MAJORS[m].n });
  };

  /* yearly tuition */
  SC.yearCost = function () {
    var p = G.S.p, e = p.edu;
    if (['uni', 'master', 'phd'].indexOf(e.stage) < 0 || e.grade === 0) return;
    if (e.stage === 'phd') return;
    var who = SC.payTuition(SC.tuition(e.abroad || p.country, !!e.abroad));
    if (who === 'loan' && !p.flags.stuLoan) { p.flags.stuLoan = 1; G.log('家里付不起学费，你申请了助学贷款。|Your family couldn\'t afford tuition, so you took out a student loan.'); }
  };
})();
