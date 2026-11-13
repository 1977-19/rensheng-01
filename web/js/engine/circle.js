/* Social circle: teachers, tutors, your kids' teachers and tutors, your partner's parents */
(function () {
  'use strict';
  var N = G.N, LO = G.love, SC = G.school;
  var CI = G.circle = {};
  var TEACH = ['teacher', 'tutor', 'kidteacher', 'kidtutor'];
  function alive(list) { return list.filter(function (n) { return n.alive; }); }
  function pr(n) { var o = { n: n.name }, x = G.pr(n.g); for (var k in x) o[k] = x[k]; return o; }

  /* ---------- relation names ---------- */
  var baseName = N.relName;
  N.relName = function (n) {
    var S = G.S, m = n.g === 'm';
    switch (n.rel) {
      case 'teacher': return '班主任|Homeroom Teacher';
      case 'tutor': return '家教老师|Private Tutor';
      case 'kidteacher': case 'kidtutor': {
        var k = S && S.npcs[n.kid], kn = k ? k.giv || k.name : '';
        return n.rel === 'kidteacher' ? G.L('{k}的班主任|{k}\'s Teacher', { k: kn }) : G.L('{k}的家教|{k}\'s Tutor', { k: kn });
      }
      case 'inlaw': {
        var pt = S && S.npcs[n.of], wed = pt && pt.rel === 'spouse';
        if (!wed) return m ? '对象的爸爸|Partner\'s Father' : '对象的妈妈|Partner\'s Mother';
        if (pt.g === 'f') return m ? '岳父|Father-in-law' : '岳母|Mother-in-law';
        return m ? '公公|Father-in-law' : '婆婆|Mother-in-law';
      }
    }
    return baseName(n);
  };

  /* ---------- partner's parents ---------- */
  CI.inlaws = function (pt) { return pt ? alive(N.all(function (n) { return n.rel === 'inlaw' && n.of === pt.id; })) : []; };
  CI.ensureInlaws = function (pt) {
    var S = G.S, p = S.p;
    if (!pt || N.age(pt) < 18 || p.age < 18) return [];
    if (pt.inl) return CI.inlaws(pt);
    pt.inl = 1;
    var pa = N.age(pt); if (pa > 62) return [];
    var rich = pt.tags && pt.tags.length, out = [];
    ['m', 'f'].forEach(function (g) {
      if (pa > 45 && G.ch(.35)) return; // older partners may have lost a parent
      var age = pa + G.ri(24, 33);
      var tagsP = rich ? pt.tags.slice() : [];
      var inc = rich ? G.$w(G.ri(300, 2500) * 1000) : G.$w(G.ri(18, 80) * 1000);
      if (age >= (G.C[pt.c || p.country].retire || 60) + 2 && !rich) inc = Math.round(inc * .45);
      var n = N.make({ rel: 'inlaw', g: g, age: age, c: pt.c, tags: tagsP, inc: inc, job: rich ? null : undefined, aff: G.ri(-5, 15),
        sur: g === 'm' ? pt.sur : undefined, wealth: rich ? G.$(G.ri(3, 60) * 1e6) : undefined });
      n.of = pt.id; n.inrole = g === 'm' ? 'father' : 'mother';
      // what they care about: money, status, character
      n.care = G.pick(rich ? ['money', 'status', 'status', 'char'] : ['money', 'char', 'status', 'char', 'money']);
      out.push(n);
    });
    return out;
  };
  /* how much the partner's parents approve of you (-100..100) */
  CI.approval = function (pt) {
    var L = CI.inlaws(pt); if (!L.length) return null;
    return Math.round(G.sum(L, function (n) { return n.aff; }) / L.length);
  };
  // what they'd think of you on first sight
  CI.firstImpression = function (n) {
    var p = G.S.p, nw = N.netWorthScore(), job = p.job ? G.JOB[p.job.id] : null;
    var s = (p.st.eq - 50) / 4 + (p.st.looks - 50) / 10;
    if (n.care === 'money') s += (nw - .3) * 40 + (G.S.assets.houses.length ? 8 : -6) + (G.S.assets.cars.length ? 4 : 0);
    if (n.care === 'status') s += (p.edu.deg >= 4 ? 6 : -4) + (p.edu.tier >= 4 ? 8 : 0) + (job && ['gov', 'med', 'law', 'edu'].indexOf(job.cat) >= 0 ? 10 : 0) + (p.gov || p.mil && p.mil.off ? 12 : 0) + (p.fc && p.fc.rank >= 2 ? 6 : 0);
    if (n.care === 'char') s += (p.h.karma - 20) / 4 + (p.crime.rec ? -20 : 0) + (p.gang ? -25 : 0);
    if (n.tags && n.tags.length) s -= (1 - nw) * 25; // wealthy families look down on you unless you match them
    return Math.round(s);
  };

  var becomeLovers = LO.becomeLovers;
  LO.becomeLovers = function (n) { becomeLovers(n); if (n.rel === 'lover') CI.ensureInlaws(n); };
  var propose = LO.propose;
  LO.propose = function (n) {
    var ap = CI.approval(n);
    if (ap != null && ap < -35 && G.ch(.55)) { N.touch(n); N.addLove(n, -6); G.addStat('happy', -8); G.log('{n}含着泪说：“我爸妈不同意……”|{n} said through tears, "My parents won\'t allow it..."', { n: n.name }); return false; }
    var ok = propose(n);
    if (!ok && ap != null && ap > 50 && G.ch(.35)) { n.engaged = 1; G.inc('engaged'); G.log('{n}的爸妈帮你说了好话，{n}最终点了头。|{n}\'s parents put in a good word, and {n} said yes after all.', { n: n.name }); return true; }
    return ok;
  };
  CI.bpFactor = function (pt) { var ap = CI.approval(pt); if (ap == null) return 1; return G.clamp(1.25 - ap / 100, .4, 1.6); };

  /* ---------- teachers & tutors ---------- */
  var TEACHER_JOB = { primary: '小学教师|Primary Teacher', middle: '初中教师|Middle School Teacher', high: '高中教师|High School Teacher', voc: '职校教师|Vocational Teacher' };
  var enter = SC.enter;
  SC.enter = function (stage, school, q) {
    enter(stage, school, q);
    var S = G.S;
    N.all(function (n) { return n.rel === 'teacher' || n.rel === 'tutor'; }).forEach(function (n) { if (n.aff >= 60) { n.rel = 'mentor'; } else delete S.npcs[n.id]; });
    if (TEACHER_JOB[stage]) {
      var e = S.p.edu, t = N.make({ rel: 'teacher', age: G.ri(28, 55), job: TEACHER_JOB[stage], inc: G.$w(G.ri(38, 60) * 1000), smarts: G.clamp(Math.round(G.nrm(66 + (e.q || 3) * 4, 10)), 30, 99), aff: G.ri(0, 15) });
      t.pin = 1;
    }
  };
  CI.teacher = function () { return alive(N.rel('teacher'))[0] || null; };
  CI.tutor = function () { return alive(N.rel('tutor'))[0] || null; };
  CI.kidTeacher = function (k) { return alive(N.all(function (n) { return n.rel === 'kidteacher' && n.kid === k.id; }))[0] || null; };
  CI.kidTutor = function (k) { return alive(N.all(function (n) { return n.rel === 'kidtutor' && n.kid === k.id; }))[0] || null; };
  CI.hireTutor = function (forKid) {
    var n = N.make({ rel: forKid ? 'kidtutor' : 'tutor', age: G.ri(21, 50), job: '家教老师|Private Tutor', inc: G.$w(G.ri(20, 45) * 1000), smarts: G.ri(65, 98), aff: G.ri(5, 20) });
    n.pin = 1; if (forKid) n.kid = forKid.id;
    return n;
  };
  // the player's own tutoring: called by the "Get a Tutor" activity
  CI.tutorBoost = function () {
    var t = CI.tutor(); if (!t) { t = CI.hireTutor(null); return { n: t, b: 2, fresh: true }; }
    N.touch(t); N.addAff(t, 2);
    var b = 2 + (t.smarts >= 85 ? 1 : 0) + (t.aff >= 50 ? 1 : 0) + (t.aff >= 80 ? 1 : 0);
    return { n: t, b: b };
  };
  // teacher goodwill nudges grades
  CI.teacherBonus = function () { var t = CI.teacher(); return t ? G.clamp(t.aff, -40, 100) / 18 : 0; };

  /* kids: teacher assigned when they start school; tutors cost a yearly fee */
  var growKid = G.family.growKid;
  G.family.growKid = function (k, Q) {
    var e0 = k.edu && k.edu.stage;
    var r = growKid(k, Q);
    var e = k.edu; if (!e) return r;
    if (e.stage !== e0) {
      N.all(function (n) { return n.rel === 'kidteacher' && n.kid === k.id; }).forEach(function (n) { delete G.S.npcs[n.id]; });
      if (TEACHER_JOB[e.stage]) { var t = N.make({ rel: 'kidteacher', age: G.ri(28, 55), job: TEACHER_JOB[e.stage], inc: G.$w(G.ri(38, 60) * 1000), aff: G.ri(0, 12) }); t.kid = k.id; t.pin = 1; }
    }
    var inSchool = ['primary', 'middle', 'high', 'voc'].indexOf(e.stage) >= 0;
    var kt = CI.kidTeacher(k);
    if (kt && inSchool) { k.inv = (k.inv || 0) + (kt.aff >= 50 ? 1 : 0); e.perf = G.clamp((e.perf || 50) + Math.round(kt.aff / 25), 0, 100); }
    var tu = CI.kidTutor(k);
    if (tu) {
      if (!inSchool) { delete G.S.npcs[tu.id]; }
      else if (G.pay(G.$(1800))) { k.inv = (k.inv || 0) + 1 + (tu.aff >= 50 ? 1 : 0) + (tu.smarts >= 85 ? 1 : 0); k.smarts = G.clamp(k.smarts + 1, 0, 100); }
      else { G.log('你付不起{k}的家教费，只好辞退了家教。|You couldn\'t pay {k}\'s tutor and had to let them go.', { k: k.name }); delete G.S.npcs[tu.id]; }
    }
    return r;
  };

  /* keep circle NPCs only while they matter */
  var prune = N.prune;
  N.prune = function () {
    var S = G.S;
    N.all().forEach(function (n) {
      if (n.rel === 'inlaw') { var pt = S.npcs[n.of]; if (!pt || !pt.alive || (pt.rel !== 'lover' && pt.rel !== 'spouse')) { if (n.aff < 50 || !pt) delete S.npcs[n.id]; else { n.rel = 'contact'; n.pin = 0; } } }
      else if (n.rel === 'kidteacher' || n.rel === 'kidtutor') { var k = S.npcs[n.kid]; if (!k || !k.alive || N.age(k) >= 19) delete S.npcs[n.id]; }
      else if ((n.rel === 'teacher' || n.rel === 'tutor') && !SC.inSchool()) { if (n.aff >= 60) { n.rel = 'mentor'; } else delete S.npcs[n.id]; }
    });
    prune();
  };

  /* ---------- profile actions ---------- */
  function res(a, text, prm, dl) { return G.result(a.n, text, prm, dl || [], a.i); }
  async function redEnvelope(n, a) {
    var tiers = [[200, '小意思|A small token'], [1000, '一份心意|A proper envelope'], [5000, '厚厚一沓|A thick wad']];
    var i = await G.UI.pick({ title: G.L(a.n), text: G.L('包多少？|How much?'), items: tiers.map(function (t) { var m = G.$(t[0]); return { t: t[1], sub: G.M(m), icon: '🧧', dis: G.S.p.money < m }; }) });
    if (i < 0) return 'cancel';
    var m = G.$(tiers[i][0]); if (!G.pay(m)) return 'cancel';
    G.dStart(); N.touch(n);
    var teacherish = TEACH.indexOf(n.rel) >= 0;
    if (teacherish && (n.pers === 'honest' || n.pers === 'nerd') && G.ch(.6)) {
      G.addMoney(m); N.addAff(n, -6); var d1 = G.dEnd();
      return res(a, '{n}把红包推了回来：“心意我领了，钱不能收。”|{n} pushed the envelope back: "I appreciate it, but I can\'t accept money."', pr(n), d1);
    }
    n.wealth += m;
    var rel = m / Math.max(G.$(300), (n.wealth || 0) * .015 + G.$(80));
    var gain = G.clamp(4 + Math.log2(rel + 1) * 5, 3, 28) * (n.pers === 'gold' ? 1.5 : 1) * (n.care === 'money' ? 1.4 : n.care === 'char' ? .7 : 1);
    G.dPush('aff', N.addAff(n, gain));
    if (teacherish) G.addStat('karma', -2);
    var dl = G.dEnd();
    var t = gain > 15 ? '{n}笑得合不拢嘴，拉着你的手说了好多客气话。|{n} beamed and couldn\'t stop thanking you.' : '{n}客气了几句，收下了。|{n} protested politely, then accepted.';
    return res(a, t, pr(n), dl);
  }
  var npcActs = G.npcActs;
  G.npcActs = function (n) {
    var out = npcActs(n), S = G.S, p = S.p;
    if (!n.alive) return out;
    var add = [];
    if (TEACH.indexOf(n.rel) >= 0 || n.rel === 'inlaw' || n.rel === 'boss') add.push({ id: 'redenv', n: '塞红包|Slip a Red Envelope', i: '🧧', e: 5, run: redEnvelope });
    if (n.rel === 'teacher' || n.rel === 'tutor') {
      add.push({ id: 'askq', n: '请教问题|Ask for Help', i: '🙋', e: 10, run: async function (n, a) { G.dStart(); N.touch(n); p.edu.study += n.aff >= 40 ? 1.5 : 1; G.dPush('aff', N.addAff(n, 3)); G.addStat('smarts', n.smarts >= 85 ? 1 : .5); var dl = G.dEnd(); return res(a, G.pick(['{n}放学后留下来给你讲了半小时。|{n} stayed after class to walk you through it.', '{n}夸你问得好，还给你推荐了几本书。|{n} praised your question and recommended some books.']), pr(n), dl); } });
    }
    if (n.rel === 'tutor' || n.rel === 'kidtutor') add.push({ id: 'dismiss', n: '辞退家教|Let the Tutor Go', i: '👋', e: 0, run: async function (n, a) { delete S.npcs[n.id]; return res(a, '你辞退了{n}。|You let {n} go.', pr(n)); } });
    if (n.rel === 'kidteacher') add.push({ id: 'ptmeet', n: '找老师沟通|Talk to the Teacher', i: '🗣️', e: 10, run: async function (n, a) {
      var k = S.npcs[n.kid]; G.dStart(); N.touch(n); G.dPush('aff', N.addAff(n, G.ri(3, 7))); if (k) { k.inv = (k.inv || 0) + 1; } var dl = G.dEnd();
      return res(a, G.pick(['老师说{k}上课挺认真，就是有点粗心。|The teacher says {k} pays attention but is a little careless.', '老师说{k}最近和同学闹了点矛盾，会多关注的。|The teacher says {k} has had friction with classmates and will keep an eye on it.', '老师说{k}很有潜力，建议多读课外书。|The teacher says {k} has real potential and should read more.']), { k: k ? k.name : '' }, dl);
    } });
    if (n.rel === 'inlaw') {
      add.push({ id: 'visit', n: '上门拜访|Pay a Visit', i: '🍎', e: 10, $: 120, run: async function (n, a) {
        if (!G.pay(G.$(120))) return 'cancel';
        G.dStart(); N.touch(n); var imp = CI.firstImpression(n), g = G.clamp(4 + imp / 6 + G.ri(-2, 3), -6, 14);
        G.dPush('aff', N.addAff(n, g)); var dl = G.dEnd();
        var t = g >= 8 ? G.pick(['{n}拉着你聊了一下午，临走还塞给你一袋自家包的饺子。|{n} chatted with you all afternoon and sent you home with homemade dumplings.', '{n}拿出珍藏的好酒招待你。|{n} brought out the good bottle for you.'])
          : g >= 2 ? G.pick(['{n}客客气气地招待了你。|{n} hosted you politely.', '{n}问了问你的工作，点了点头。|{n} asked about your work and nodded.'])
          : G.pick(['{n}全程板着脸，问你一个月挣多少。|{n} stayed stone-faced and asked how much you make a month.', '{n}话里话外都在拿你和别人家的孩子比。|{n} kept comparing you to other people\'s kids.']);
        return res(a, t, pr(n), dl);
      } });
      add.push({ id: 'help', n: '帮忙干活|Help Around the House', i: '🧹', e: 15, run: async function (n, a) {
        G.dStart(); N.touch(n); G.dPush('aff', N.addAff(n, G.ri(3, 8) + (n.care === 'char' ? 3 : 0))); G.addStat('health', -1); var dl = G.dEnd();
        return res(a, G.pick(['你帮{n}修好了漏水的水管。|You fixed {n}\'s leaky pipe.', '你帮{n}大扫除，累得腰酸背痛。|You helped {n} deep-clean the house and ached all over.', '你陪{n}去医院做了体检。|You took {n} to a medical checkup.']), pr(n), dl);
      } });
      add.push({ id: 'treat', n: '请吃大餐|Treat to a Fancy Dinner', i: '🍽️', e: 10, $: 600, run: async function (n, a) {
        if (!G.pay(G.$(600))) return 'cancel';
        G.dStart(); N.touch(n); CI.inlaws(S.npcs[n.of]).forEach(function (x) { G.dPush('aff', N.addAff(x, G.ri(4, 9) + (x.care === 'money' ? 2 : 0))); }); var dl = G.dEnd();
        return res(a, '一顿饭吃下来，{n}对你的称呼都亲热了不少。|By the end of dinner, {n} was calling you by a pet name.', pr(n), dl);
      } });
    }
    // child: hire a tutor
    if (n.rel === 'child' && N.age(n) >= 6 && N.age(n) < 18 && n.edu && ['primary', 'middle', 'high', 'voc'].indexOf(n.edu.stage) >= 0 && !CI.kidTutor(n)) {
      add.push({ id: 'kidtutor', n: '请家教|Hire a Tutor', i: '👩‍🏫', e: 10, run: async function (k, a) {
        var t = CI.hireTutor(k); N.addAff(k, G.ch(.5) ? -3 : 2);
        return res(a, '你给{k}请了家教{t}，每年{m}。在“关系”里能找到{t}。|You hired {t} as {k}\'s tutor for {m} a year. Find {t} under Relationships.', { k: k.name, t: t.name, m: G.M(G.$(1800)) });
      } });
    }
    // partner: meet the parents
    if ((n.rel === 'lover' || n.rel === 'spouse') && N.age(n) >= 18 && p.age >= 18 && !n.metPar) add.push({ id: 'meetpar', n: '见对方父母|Meet the Parents', i: '🏠', e: 15, run: async function (k, a) {
      var L = CI.ensureInlaws(k); if (!L.length) return res(a, '{n}的父母都已经不在了。|{n}\'s parents have both passed away.', pr(k));
      await G.runEvent('n_meet_parents', {}, k.id); return null;
    } });
    // insert before "block"
    var bi = out.map(function (x) { return x.id; }).indexOf('block');
    if (bi < 0) bi = out.length;
    return out.slice(0, bi).concat(add, out.slice(bi));
  };

  /* ---------- stories ---------- */
  var H = G.EH, E = H.E, O = H.O;
  function inlawEv(c) { var pt = N.partner(); if (!pt) return false; var L = CI.inlaws(pt); if (!L.length) return false; c.npc = pt; c.prm.n = pt.name; c.prm.pa = L[0].name; c.L = L; return true; }
  function addAll(c, v) { (c.L || []).forEach(function (x) { G.dPush('aff', N.addAff(x, v)); N.touch(x); }); }
  G.evs([
    { id: 'n_meet_parents', a: [18, 75], rep: 1, cd: 1, w: 3, title: '见家长|Meeting the Parents', icon: '🏠',
      if: function (S, p) { var pt = N.partner(); return !!(pt && !pt.metPar && (pt.yrs || 0) >= 1 && N.age(pt) >= 18 && N.age(pt) <= 62); },
      t: '{n}带你回家见父母。一进门，{pa}就上下打量着你。|{n} takes you home to meet the parents. The moment you walk in, {pa} looks you up and down.',
      prep: function (c) { if (!c.npc) c.npc = N.partner(); if (!c.npc || c.npc.metPar) return false; c.prm.n = c.npc.name; var L = CI.ensureInlaws(c.npc); if (!L.length) L = CI.inlaws(c.npc); if (!L.length) return false; c.L = L; c.prm.n = c.npc.name; c.prm.pa = L[0].name; },
      o: [
        O('提着贵重礼物上门|Arrive with expensive gifts', function (c) { if (!c.pay(c.$(2500))) { addAll(c, -4); return '你掏不出钱买礼物，空着手进了门，场面有点尴尬。|You couldn\'t afford gifts and showed up empty-handed. Awkward.'; } var s = 0; c.L.forEach(function (x) { var v = 8 + CI.firstImpression(x) / 4 + (x.care === 'money' ? 6 : 0); s += v; G.dPush('aff', N.addAff(x, v)); }); return s / c.L.length > 10 ? '两位老人笑得合不拢嘴，饭桌上一个劲给你夹菜。|Both parents beamed and kept piling food on your plate.' : '礼物收下了，但他们的问题一个接一个：房子、车子、存款……|They took the gifts — then came the questions: house, car, savings...'; }),
        O('嘴甜勤快，抢着洗碗|Sweet talk and do the dishes', function (c) { var s = 0; c.L.forEach(function (x) { var v = 4 + CI.firstImpression(x) / 4 + (c.p.st.eq - 50) / 6 + (x.care === 'char' ? 6 : 0); s += v; G.dPush('aff', N.addAff(x, v)); }); return s / c.L.length > 8 ? '{pa}偷偷跟{n}说：“这孩子不错，靠谱。”|{pa} whispered to {n}, "This one\'s a keeper."' : '你努力表现，但{pa}还是淡淡的。|You tried hard, but {pa} stayed lukewarm.'; }),
        O('做真实的自己|Just be yourself', function (c) { var s = 0; c.L.forEach(function (x) { var v = CI.firstImpression(x) / 3 + G.ri(-4, 6); s += v; G.dPush('aff', N.addAff(x, v)); }); return s / c.L.length > 6 ? '聊着聊着，你们发现很合得来。|The more you talked, the more you clicked.' : s / c.L.length < -4 ? '饭桌上气氛降到了冰点。回去的路上{n}一句话都没说。|Dinner went ice-cold. {n} didn\'t say a word on the way home.' : '一顿饭吃得平平淡淡。|Dinner was uneventful.'; })
      ] },
    H.E('n_inlaw_test', [20, 50], '丈母娘的考验|The Parents\' Conditions', '🏠', '{pa}把你叫到一边：“想娶/嫁我家{n}，至少得有套房吧？”|{pa} pulls you aside: "If you want to marry {n}, you\'d better at least own a home."', [
      O('拍胸脯保证会买|Promise you\'ll buy one', function (c) { addAll(c, 6); c.p.flags.housePromise = c.S.year; return '{pa}点了点头：“我们等着看。”|{pa} nodded: "We\'ll see."'; }),
      O('说感情比房子重要|Say love matters more than a house', function (c) { var ok = c.L.some(function (x) { return x.care === 'char'; }); addAll(c, ok ? 8 : -10); return ok ? '{pa}沉默了一会儿，说：“你说得对。”|{pa} was quiet a moment, then said, "You\'re right."' : '{pa}冷笑一声：“感情能当饭吃吗？”|{pa} scoffed: "Can you eat love?"'; }),
      O('带他们看你的房产证|Show them your deed', function (c) { addAll(c, 15); return '{pa}的态度立刻变了，开始张罗婚事。|{pa}\'s attitude changed on the spot — wedding planning began.'; }, { if: function (c) { return c.S.assets.houses.length > 0; } })
    ], { if: function (S, p) { var pt = N.partner(); return !!(pt && pt.rel === 'lover' && CI.inlaws(pt).length && p.age >= 22); }, prep: function (c) { if (!inlawEv(c)) return false; } }),
    H.E('n_inlaw_ill', [20, 70], '对方家人住院|A Parent in the Hospital', '🏥', '{n}的{r}突然住院了，手术费还差一大截。|{n}\'s {r} was suddenly hospitalized, and they\'re well short of the surgery costs.', [
      O('垫付全部手术费|Pay for the whole surgery', function (c) { var m = c.$(G.ri(8, 30) * 1000); if (!c.pay(m)) return '你拿不出这么多钱，只能干着急。|You don\'t have that much and can only watch helplessly.'; addAll(c, 30); G.dPush('love', N.addLove(c.npc, 15)); c.prm.m = G.M(m); return '你垫付了{m}。手术很成功，{pa}握着你的手哭了。|You paid {m}. The surgery went well, and {pa} wept holding your hand.'; }),
      O('每天去医院陪护|Visit every day', function (c) { addAll(c, 14); G.dPush('love', N.addLove(c.npc, 8)); c.add('health', -3); return '你跑前跑后，比亲儿女还上心。|You ran errands day and night, more devoted than their own kids.'; }),
      O('工作太忙，没去|Too busy to go', function (c) { addAll(c, -12); G.dPush('love', N.addLove(c.npc, -10)); return '{n}对你很失望。|{n} is deeply disappointed in you.'; })
    ], { bad: 1, rep: 1, cd: 8, if: function () { var pt = N.partner(); return !!(pt && CI.inlaws(pt).length); }, prep: function (c) { if (!inlawEv(c)) return false; var x = G.pick(c.L); c.prm.r = x.inrole === 'father' ? '爸爸|father' : '妈妈|mother'; c.prm.pa = x.name; } }),
    H.E('n_inlaw_meddle', [24, 70], '婆媳/翁婿矛盾|Trouble with the In-laws', '😤', '{pa}总是对你们的生活指手画脚：怎么花钱、怎么带孩子、几点睡觉……|{pa} keeps meddling in your life: how you spend, how you raise the kids, when you go to bed...', [
      O('忍了，以和为贵|Bite your tongue', function (c) { c.add('happy', -4); addAll(c, 4); return '你把委屈咽了下去。|You swallowed your frustration.'; }),
      O('让{n}去沟通|Ask {n} to talk to them', function (c) { if (G.ch(.5 + c.npc.love / 300)) { addAll(c, -2); G.dPush('love', N.addLove(c.npc, 4)); return '{n}站在了你这边，{pa}收敛了不少。|{n} took your side, and {pa} backed off.'; } G.dPush('love', N.addLove(c.npc, -8)); return '{n}说：“那是我爸妈，你让着点怎么了？”|{n} said, "They\'re my parents. Can\'t you just give a little?"'; }),
      O('正面硬刚|Confront them head-on', function (c) { addAll(c, -18); G.dPush('love', N.addLove(c.npc, -6)); return '你们大吵一架，{pa}摔门而去。|You had a huge fight, and {pa} stormed out.'; })
    ], { bad: 1, rep: 1, cd: 5, if: function () { var s = N.spouse(); return !!(s && CI.inlaws(s).length); }, prep: function (c) { var s = N.spouse(); var L = CI.inlaws(s); if (!L.length) return false; c.npc = s; c.L = [G.pick(L)]; c.prm.n = s.name; c.prm.pa = c.L[0].name; } }),
    H.E('n_inlaw_gift', [22, 70], '对方父母的心意|A Gift from the In-laws', '🎁', '{pa}托{n}给你带来了一份礼物，说是“一家人别客气”。|{pa} sent you a gift through {n}: "We\'re family now — no need to be polite."', [
      O('收下，回一份礼|Accept and send one back', function (c) { var v = Math.round(Math.min(c.L[0].wealth * .01, c.$(c.L[0].tags.length ? 50000 : 800))); c.money(v); addAll(c, 5); c.prm.m = G.M(v); return '那份礼物值{m}。你也精心挑了回礼。|The gift was worth {m}. You picked out a thoughtful gift in return.'; })
    ], { good: 1, rep: 1, cd: 6, if: function () { var pt = N.partner(); return !!(pt && CI.inlaws(pt).some(function (x) { return x.aff >= 55; })); }, prep: function (c) { var pt = N.partner(); var L = CI.inlaws(pt).filter(function (x) { return x.aff >= 55; }); if (!L.length) return false; c.npc = pt; c.L = L; c.prm.n = pt.name; c.prm.pa = L[0].name; } }),
    H.E('n_inlaw_oppose', [18, 45], '父母棒打鸳鸯|Forbidden Love', '💔', '{n}的父母坚决反对你们在一起，甚至要给{n}安排相亲。|{n}\'s parents flatly oppose your relationship and are setting {n} up on blind dates.', [
      O('带{n}私奔|Run away together', function (c) { addAll(c, -30); G.dPush('love', N.addLove(c.npc, 20)); c.add('happy', 4); return '你们收拾行李去了另一座城市。{n}说：“只要和你在一起就好。”|You packed up and moved to another city. {n} said, "As long as I\'m with you."'; }),
      O('用行动证明自己|Prove yourself to them', function (c) { c.p.flags.proveInlaws = c.S.year; addAll(c, 6); return '你决定用事业和真心打动他们。|You resolve to win them over with your career and sincerity.'; }),
      O('放手|Let go', function (c) { G.love.breakup(c.npc); return '你们流着泪分了手。|You broke up in tears.'; })
    ], { bad: 1, if: function () { var pt = N.partner(); var ap = pt && pt.rel === 'lover' ? CI.approval(pt) : null; return ap != null && ap < -30; }, prep: function (c) { if (!inlawEv(c)) return false; } }),
    H.E('n_teacher_recommend', [15, 19], '老师的推荐|A Teacher\'s Recommendation', '📜', '班主任{n}找到你：学校有一个保送/推荐名额，{he}想推荐你。|Your homeroom teacher, {n}, says there\'s one recommendation spot for top universities — and {he} wants to put you forward.', [
      O('感激地接受|Gratefully accept', function (c) { c.p.flags.guaranteed = 1; G.dPush('aff', N.addAff(c.npc, 5)); return '你的高考将获得巨大的加分！|You\'ll get a huge boost on the university entrance exam!'; }),
      O('让给更需要的同学|Give it to a classmate who needs it more', function (c) { H.fx(c, { karma: 10, eq: 2 }); G.dPush('aff', N.addAff(c.npc, 10)); return '{n}拍了拍你的肩：“好孩子。”|{n} patted your shoulder: "Good kid."'; })
    ], { good: 1, if: function (S, p) { var t = CI.teacher(); return !!(t && p.edu.stage === 'high' && t.aff >= 60 && p.edu.perf >= 70); }, prep: function (c) { var t = CI.teacher(); if (!t) return false; c.npc = t; c.prm.n = t.name; var x = G.pr(t.g); for (var k in x) c.prm[k] = x[k]; } }),
    H.E('n_teacher_talk', [7, 18], '老师找你谈话|A Talk with Your Teacher', '👩‍🏫', '班主任{n}把你叫到办公室。|Your homeroom teacher, {n}, calls you into the office.', [
      O('乖乖听着|Listen quietly', function (c) { var good = c.p.edu.perf >= 60; G.dPush('aff', N.addAff(c.npc, 4)); if (good) { H.fx(c, { happy: 3 }); return '{n}夸你最近进步很大，鼓励你冲一冲更好的学校。|{n} praised your progress and encouraged you to aim higher.'; } c.p.edu.study += 1; return '{n}语重心长地说：“你很聪明，就是不够用功。”|{n} said earnestly, "You\'re smart — you just don\'t work hard enough."'; }),
      O('顶嘴|Talk back', function (c) { G.dPush('aff', N.addAff(c.npc, -15)); H.fx(c, { par: -4 }); return '{n}气得打电话叫了家长。|{n} was so angry they called your parents.'; })
    ], { rep: 1, cd: 3, if: function () { return !!CI.teacher(); }, prep: function (c) { var t = CI.teacher(); if (!t) return false; c.npc = t; c.prm.n = t.name; } }),
    H.E('n_kidteacher_call', [26, 70], '老师的电话|A Call from School', '☎️', '{k}的班主任{n}打来电话：“{k}今天在学校出了点状况。”|{k}\'s teacher {n} calls: "{k} had a bit of an incident at school today."', [
      O('马上赶去学校|Rush to the school', function (c) { G.dPush('aff', N.addAff(c.npc, 6)); N.addAff(c.kid, 5); c.kid.inv = (c.kid.inv || 0) + 1; return G.pick(['原来{k}和同学打架了，你们一起道了歉。|{k} had gotten into a fight; you apologized together.', '原来{k}在课上晕倒了，好在只是低血糖。|{k} had fainted in class — just low blood sugar, luckily.']); }),
      O('让老师看着处理|Let the teacher handle it', function (c) { G.dPush('aff', N.addAff(c.npc, -6)); N.addAff(c.kid, -4); return '{n}的语气明显冷淡了。|{n}\'s tone turned noticeably cooler.'; })
    ], { bad: 1, rep: 1, cd: 4, if: function () { return N.all(function (n) { return n.rel === 'kidteacher' && n.alive; }).length > 0; }, prep: function (c) { var t = G.pick(N.all(function (n) { return n.rel === 'kidteacher' && n.alive; })); var k = t && G.S.npcs[t.kid]; if (!t || !k) return false; c.npc = t; c.kid = k; c.prm.n = t.name; c.prm.k = k.name; } })
  ]);
  G.EV.n_meet_parents.o.forEach(function (o) { var r = o.run; o.run = function (c) { c.npc.metPar = G.S.year; return r(c); }; });
})();
