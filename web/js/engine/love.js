/* Romance, marriage, children, family */
(function () {
  'use strict';
  var LO = G.love = {}, FA = G.family = {};
  var N = G.N;

  /* elite tags available for admirers / dating pools */
  LO.eliteTags = function () {
    var p = G.S.p, v = G.vip ? G.vip.tier() : 0, t = [];
    if (v >= 1 || p.flags.rich || N.netWorthScore() > .55) t.push('rich');
    if (v >= 2 || p.st.fame > 60) t.push('celeb');
    if (v >= 3) { t.push('red'); if (G.C[p.country].mon || G.ch(.3)) t.push('royal'); }
    return t;
  };
  LO.admirerRate = function () {
    var p = G.S.p, l = (p.st.looks - 45) / 30 + N.netWorthScore() * 1.6 + p.st.fame / 35 + (p.st.eq - 50) / 90;
    if (G.has('charm')) l *= 2; if (G.has('peach')) l *= 1.5;
    if (p.flags.rich) l += .6; if (p.flags.elite) l += .6;
    if (p.age > 50) l *= .35; if (p.age < 16) l *= .4;
    // taken: far fewer people try their luck (the very rich and famous still attract some)
    if (N.partner()) l *= (p.flags.rich || p.flags.elite || p.st.fame > 60 || N.netWorthScore() > .7) ? .3 : .12;
    return G.clamp(l, 0, 5);
  };
  LO.tick = function (Q) {
    var S = G.S, p = S.p;
    if (p.jail) return;
    // admirers
    if (p.age >= 14 && p.age <= 75) {
      var n = Math.min(N.partner() ? 1 : 3, G.poisson(LO.admirerRate() * .38));
      for (var i = 0; i < n; i++) {
        var tags = [], et = LO.eliteTags();
        if (p.age >= 18 && et.length && G.ch(.15 + N.netWorthScore() * .25 + p.st.fame / 300)) tags.push(G.pick(et));
        var a = N.mkRomantic({ tags: tags, love: G.ri(45, 80), aff: G.ri(15, 40) });
        a.sincere = G.clamp(a.sincere + (tags.length ? 0 : 0) - (N.netWorthScore() > .6 && G.PERS[a.pers].mo > 60 ? 30 : 0), 0, 100);
        Q.push({ id: 'sys_admirer', nid: a.id });
      }
    }
    // partner dynamics
    var pt = N.partner();
    if (pt && !pt.alive) { p.partner = null; pt = null; }
    if (pt) {
      pt.yrs = (pt.yrs || 0) + 1;
      var pe = G.PERS[pt.pers];
      pt.love = G.clamp(pt.love + (p.st.happy > 60 ? 1 : -2) + (pt.lt === S.year ? 2 : (pt.pers === 'clingy' ? -6 : -3)) + (pe.mo > 70 && N.netWorthScore() < .3 ? -4 : 0), 0, 100);
      // spouse shares income
      if (pt.rel === 'spouse' && pt.inc) { var share = Math.round(pt.inc * .3); G.S.p.money += share; }
      if (pt.rel === 'spouse' && pt.tags.length && pt.wealth > G.$(1e6) && G.ch(.3)) { var gift = Math.round(pt.wealth * .02); pt.wealth -= gift; G.S.p.money += gift; G.log('{n}给了你{m}零花钱。|{n} gave you {m} as pocket money.', { n: pt.name, m: G.M(gift) }); }
      // npc cheating
      if (!pt.cheat && G.ch((100 - pt.loyal) / 100 * .07 * (pt.love < 50 ? 2 : 1))) pt.cheat = 1;
      if (pt.cheat && G.ch(.3 + p.st.eq / 300 + (G.has('mind') ? .3 : 0))) Q.push({ id: 'sys_partner_cheat', nid: pt.id });
      else if (pt.love < 12) Q.push({ id: pt.rel === 'spouse' ? 'sys_divorce_req' : 'sys_dumped', nid: pt.id });
      else if (pt.rel === 'lover' && !pt.engaged && pt.love >= 80 && pt.yrs >= 2 && p.age >= 21 && G.ch(.25)) Q.push({ id: 'sys_npc_propose', nid: pt.id });
      // pregnancy
      if (LO.canConceive(pt)) {
        var wa = p.g === 'f' ? p.age : N.age(pt);
        var base = wa < 30 ? .55 : wa < 35 ? .42 : wa < 40 ? .25 : wa < 45 ? .08 : 0;
        if (G.has('fertile')) base *= 1.4;
        var ch = p.flags.tryBaby ? base : (pt.rel === 'spouse' ? base * .12 : base * .04);
        if (G.ch(ch)) Q.push({ id: 'sys_birth', nid: pt.id });
      }
    }
    p.flags.tryBaby = 0;
    // affairs found out
    N.rel('affair').forEach(function (a) { if (N.spouse() && G.ch(.25)) Q.push({ id: 'sys_affair_caught', nid: a.id }); });
  };
  LO.canConceive = function (pt) {
    var p = G.S.p; if (!pt || pt.g === p.g) return false;
    if (pt.rel !== 'spouse' && pt.rel !== 'lover') return false;
    return p.age >= 18 && N.age(pt) >= 18 && (p.g === 'f' ? p.age : N.age(pt)) < 50;
  };

  /* ---------- actions ---------- */
  LO.DATES = [
    { n: '散步聊天|Take a walk', p: 0, l: 3 },
    { n: '看电影|Movie night', p: 30, l: 5 },
    { n: '吃大餐|Fancy dinner', p: 150, l: 7 },
    { n: '游乐园|Amusement park', p: 120, l: 7 },
    { n: '看演唱会|Concert', p: 300, l: 9 },
    { n: '海边度假|Beach getaway', p: 2500, l: 14 },
    { n: '私人飞机环游世界|Private-jet world tour', p: 400000, l: 30 }
  ];
  LO.date = function (n, d) {
    var cost = G.$(d.p); if (cost && !G.pay(cost)) return null;
    var a = N.attract(n), pe = G.PERS[n.pers];
    var gain = d.l * (.6 + a) * (pe.mo > 70 && d.p > 1000 ? 1.5 : 1);
    if (n.pers === 'artsy' && d.p === 0) gain *= 1.8;
    N.addLove(n, gain); N.addAff(n, gain / 2); N.touch(n);
    G.addStat('happy', 4); G.inc('dates');
    return gain;
  };
  LO.confess = function (n) {
    var a = N.attract(n), ok = n.love >= 55 || G.ch(a * .9);
    N.touch(n);
    if (!N.canRomance(n)) return false;
    if (ok) { LO.becomeLovers(n); return true; }
    N.addAff(n, -6); G.addStat('happy', -8); return false;
  };
  LO.becomeLovers = function (n) {
    var p = G.S.p, old = N.partner();
    if (old && old !== n) { if (old.rel === 'spouse') { n.rel = 'affair'; N.addLove(n, 15); return; } old.rel = 'ex'; old.love = 10; }
    n.rel = 'lover'; n.love = Math.max(n.love, 60); n.yrs = 0; p.partner = n.id; n.pin = 1;
    G.major('和{n}在一起了|Started dating {n}', { n: n.name }); G.inc('lovers');
  };
  LO.propose = function (n) {
    var ring = G.S.assets.items.some(function (i) { return i.k === 'ring'; });
    var ch = (n.love - 45) / 50 + (ring ? .2 : 0) + (G.PERS[n.pers].mo > 70 && N.netWorthScore() > .5 ? .2 : 0);
    N.touch(n);
    if (G.ch(G.clamp(ch, .05, .95))) { n.engaged = 1; N.addLove(n, 10); G.inc('engaged'); return true; }
    N.addLove(n, -12); G.addStat('happy', -10); return false;
  };
  LO.marry = async function (n) {
    var p = G.S.p, cid = p.country;
    var legal = n.g !== p.g || G.canGayMarry(cid, G.S.year);
    if (!legal) { await G.result('婚姻|Marriage', '这里同性婚姻还不合法，你们只能以伴侣身份生活在一起。|Same-sex marriage isn\'t legal here yet, so you live together as partners.', null, [], '🏳️‍🌈'); n.civil = 1; return false; }
    // bride price (CN tradition)
    if (cid === 'cn' && p.g === 'm' && n.g === 'f' && G.S.year >= 1980) {
      var bp = G.$(G.ri(8, 40) * 1000 * (p.tier <= 2 ? 1.5 : 1));
      var i = await G.UI.event({ title: G.L('彩礼|Bride Price'), text: G.L('{n}家里提出要{m}彩礼。|{n}\'s family asks for a {m} bride price.', { n: n.name, m: G.M(bp) }), opts: [{ t: G.L('爽快答应|Agree') }, { t: G.L('讨价还价|Negotiate') }, { t: G.L('拒绝，婚不结了|Refuse and call it off') }], icon: '🧧' });
      if (i === 2) { n.engaged = 0; N.addLove(n, -25); return false; }
      if (i === 1) { if (G.ch(.5 + p.st.eq / 300)) bp = Math.round(bp * .5); else N.addAff(n, -8); }
      if (!G.pay(bp)) { var par = N.rel('father', 'mother').filter(function (x) { return x.wealth >= bp; })[0]; if (par) par.wealth -= bp; else { await G.result('彩礼|Bride Price', '你拿不出彩礼，婚事暂时搁置了。|You can\'t afford the bride price; the wedding is on hold.', null, [], '🧧'); return false; } }
    }
    var ws = G.WEDDING;
    var wi = await G.UI.pick({ title: G.L('婚礼|Wedding'), text: G.L('想办一场什么样的婚礼？|What kind of wedding?'), items: ws.map(function (w) { return { t: w.n, sub: G.M(G.$(w.p)), icon: '💒', dis: G.S.p.money < G.$(w.p) }; }), noCancel: 1 });
    var w = ws[wi] || ws[0]; if (!G.pay(G.$(w.p))) { w = ws[0]; }
    n.rel = 'spouse'; n.engaged = 0; n.wedY = G.S.year; n.love = Math.min(100, n.love + 10); p.partner = n.id; n.pin = 1;
    G.addStat('happy', w.h); if (w.fame) G.addStat('fame', w.fame);
    G.major('和{n}结婚了|Married {n}', { n: n.name }); G.inc('marriages');
    // relatives give red envelopes
    if (G.S.p.country === 'cn' && w.p > 100) { var gifts = G.$(G.ri(2, 15) * 1000); G.addMoney(gifts); }
    return true;
  };
  LO.breakup = function (n) { n.rel = 'ex'; n.love = 5; N.addAff(n, -25); G.S.p.partner = null; n.engaged = 0; G.addStat('happy', -6); G.inc('breakups'); };
  LO.divorce = function (n, mutual) {
    var S = G.S, p = S.p, nw = Math.max(0, G.netWorth()), take = n.prenup ? 0 : Math.round(nw * (mutual ? .5 : .55));
    if (take > 0) {
      var cash = Math.min(p.money, take); p.money -= cash; take -= cash;
      while (take > 0 && S.assets.houses.length) { var h = S.assets.houses.pop(); take -= (h.val - (h.mort || 0)); }
      while (take > 0 && S.assets.cars.length) { var c = S.assets.cars.pop(); take -= c.val; }
    }
    n.rel = 'ex'; n.exSpouse = 1; n.love = 0; N.addAff(n, -30); p.partner = null;
    G.addStat('happy', -15); G.major('和{n}离婚|Divorced {n}', { n: n.name }); G.inc('divorces');
    N.rel('child').forEach(function (k) { N.addAff(k, -15); });
  };
  LO.baby = async function (other, adopted) {
    var S = G.S, p = S.p;
    var g = G.ch(.5) ? 'm' : 'f';
    var sur = p.g === 'm' ? p.sur : (other && other.g === 'm' ? other.sur : p.sur);
    var cul = p.cul || G.C[p.country].names;
    var sug = [0, 1, 2].map(function () { return G.genGiven(cul, g, S.year); });
    var txt = await G.UI.input({ title: G.L('给宝宝起名|Name the Baby'), text: G.L('是个{g}！给{h}起个名字吧。|It\'s a {g}! Give {h} a name.', { g: g === 'm' ? '男孩|boy' : '女孩|girl', h: g === 'm' ? '他|him' : '她|her' }), sug: sug.map(function (s) { return G.mkName(cul, sur, s, g); }), def: G.mkName(cul, sur, sug[0], g) });
    var name = txt || G.mkName(cul, sur, sug[0], g);
    var lk = other ? Math.round((p.st.looks + other.looks) / 2 + G.ri(-12, 12)) : G.ri(30, 80);
    var sm = other ? Math.round((p.st.smarts + other.smarts) / 2 + G.ri(-12, 12)) : G.ri(30, 80);
    var kid = N.make({ rel: 'child', g: g, age: adopted ? G.ri(0, 4) : 0, name: name, sur: sur, looks: G.clamp(lk, 5, 100), smarts: G.clamp(sm, 5, 100), eq: G.ri(30, 70), health: G.ri(70, 100), aff: 80, c: p.country, orient: G.ch(.9) ? 'het' : G.ch(.5) ? 'gay' : 'bi' });
    kid.edu = { stage: 'none', grade: 0, perf: 50, deg: 0, study: 0, retake: 0 };
    kid.talents = G.ch(.6) ? [G.pick(G.TALENTS.filter(function (t) { return !t.neg; })).id] : [];
    kid.inv = 0; kid.pin = 1; kid.other = other ? other.id : null; kid.adopted = !!adopted;
    G.major(adopted ? '领养了{n}|Adopted {n}' : '{n}出生了|{n} was born', { n: name }); G.inc('kids');
    G.addStat('happy', 12);
    return kid;
  };

  /* ---------- family yearly ---------- */
  FA.tick = function (Q) {
    var S = G.S, p = S.p;
    // parents
    N.rel('father', 'mother').forEach(function (n) {
      if (n.away && p.age >= 14 && G.ch(.25)) { n.away = 0; G.log('{n}结束了在外打工的日子，回到了家。|{n} finally came home from working in the city.', { n: n.name }); }
      if (N.age(n) > 60 && n.health < 55 && !n.illY && G.ch(.25)) { n.illY = S.year; Q.push({ id: 'sys_parent_ill', nid: n.id }); }
    });
    // children
    N.rel('child').forEach(function (k) { FA.growKid(k, Q); });
    // grandchildren appear
    N.rel('child').forEach(function (k) {
      var a = N.age(k);
      if (a >= 23 && !k.spouseId && G.ch(.12)) { var sp = N.make({ rel: 'contact', g: k.g === 'm' ? 'f' : 'm', age: a + G.ri(-3, 3), c: k.c }); sp.pin = 1; sp.inlaw = k.id; k.spouseId = sp.id; G.log('{k}结婚了，对象是{s}。|{k} got married to {s}.', { k: k.name, s: sp.name }); G.addStat('happy', 6, true); }
      if (k.spouseId && a >= 25 && a <= 42 && G.ch(.12)) { var gk = N.make({ rel: 'grandchild', age: 0, sur: k.g === 'm' ? k.sur : null, c: k.c, aff: 60 }); gk.pin = 1; k.kids = (k.kids || []).concat([gk.id]); G.log('你当{x}了！{k}生了{g}。|You became a grand{y}! {k} had {g}.', { x: p.g === 'm' ? '爷爷|' : '奶奶|', y: p.g === 'm' ? 'father' : 'mother', k: k.name, g: gk.name }); G.addStat('happy', 8, true); G.inc('grandkids'); }
    });
  };
  FA.growKid = function (k, Q) {
    var a = N.age(k), e = k.edu || (k.edu = { stage: 'none', grade: 0, perf: 50, deg: 0, study: 0, retake: 0 });
    var inv = k.inv || 0; k.inv = 0;
    // adult "children" who never went through growKid (e.g. grandchildren who became your children when you played on as an heir)
    if (a >= 23 && !k.jobT) {
      if (e.stage !== 'done') { e.stage = 'done'; e.deg = e.deg || (G.ch(.5) ? 4 : 2); }
      var j1 = G.pick(e.deg >= 4 ? G.NPC_JOBS.slice(0, 22) : G.NPC_JOBS.slice(5, 20));
      k.job = j1.n; k.jobT = j1.n; k.inc = k.inc || G.$w(j1.u * G.rf(.8, 1.2), k.c);
      return;
    }
    if (a <= 20) k.smarts = G.clamp(k.smarts + G.ri(0, 2) + (inv > 0 ? 2 : 0), 1, 100);
    if (a >= 12 && a <= 20) k.looks = G.clamp(k.looks + G.ri(-2, 2), 1, 100);
    // education
    var school = G.S.assets.houses.some(function (h) { return h.school; }) ? 8 : 0;
    e.perf = G.clamp(Math.round(e.perf * .6 + (k.smarts * .55 + inv * 10 + school + G.ri(-10, 10)) * .4), 0, 100);
    if (a === 6) { e.stage = 'primary'; e.grade = 0; }
    else if (a === 12) { e.stage = 'middle'; e.grade = 0; e.deg = 1; }
    else if (a === 15) { e.stage = e.perf < 25 ? 'voc' : 'high'; e.grade = 0; e.deg = 2; }
    else if (a === 18) {
      e.deg = 3;
      var sc = e.perf * .6 + k.smarts * .4 + G.ri(-8, 8);
      if (sc > 42) {
        var u = G.pick(G.eduSys(k.c).u.filter(function (x) { return x.t === G.school.maxTier(sc); })) || G.pick(G.eduSys(k.c).u);
        e.stage = 'uni'; e.grade = 0; e.school = u.n; e.tier = u.t; e.major = G.pick(G.MAJOR_LIST);
        G.log('{k}考上了{u}！|{k} got into {u}!', { k: k.name, u: u.n }); G.addStat('happy', 4 + u.t, true);
        if (u.t >= 5) G.inc('kidTop');
        G.S.p.money -= Math.min(Math.max(0, G.S.p.money), G.school.tuition(k.c));
      } else { e.stage = 'done'; G.log('{k}没考上大学，直接工作了。|{k} didn\'t get into university and started working.', { k: k.name }); }
    } else if (a === 22 && e.stage === 'uni') { e.stage = 'done'; e.deg = 4; }
    else if (e.stage !== 'none' && e.stage !== 'done') e.grade++;
    if ((a === 22 || (a === 19 && e.stage === 'done')) && !k.jobT) {
      var jb = G.pick(e.deg >= 4 ? G.NPC_JOBS.slice(0, 22) : G.NPC_JOBS.slice(5, 20));
      k.job = jb.n; k.jobT = jb.n; k.inc = G.$w(jb.u * (e.deg >= 4 ? 1.2 : .9) * (1 + (e.tier || 0) * .08), k.c);
    }
    if (a < 18) { k.job = e.stage === 'none' ? (a < 3 ? '婴儿|Baby' : '学龄前|Preschooler') : G.STAGES[e.stage] ? G.STAGES[e.stage].n : '学生|Student'; }
  };
  FA.inherit = function (dead) {
    var S = G.S, p = S.p;
    var other = N.rel('father', 'mother').filter(function (n) { return n !== dead && n.alive; })[0];
    if (other && (dead.rel === 'father' || dead.rel === 'mother')) { other.wealth += dead.wealth; dead.wealth = 0; return 0; }
    var heirs = 1 + N.rel('sibling').length;
    var share = Math.round(Math.max(0, dead.wealth) * (1 - (G.C[p.country].itax || 0)) / heirs);
    if (share > 0) { G.addMoney(share); G.inc('inherit', share); }
    dead.wealth = 0;
    return share;
  };

  G.evs([
    { id: 'sys_admirer', sys: 1, title: '有人向你表白|A Confession', icon: '💌',
      prep: function (c) { if (!c.npc || !c.npc.alive) return false; c.prm.job = c.npc.job; c.prm.a = N.age(c.npc); c.prm.w = N.wealthLabel(c.npc); c.prm.l = N.looksLabel(c.npc.looks);
        N.pushChat(c.npc, G.pick(['我注意你很久了……可以做我{x}吗？|I\'ve been watching you for a while... will you be my {y}?', '其实我一直喜欢你。|The truth is, I\'ve always liked you.', '有空一起吃个饭吗？我想认识你。|Free for dinner sometime? I\'d love to get to know you.']), { x: G.S.p.g === 'm' ? '男朋友|' : '女朋友|', y: G.S.p.g === 'm' ? 'boyfriend' : 'girlfriend' }); },
      t: function (c) { return c.npc.tags.length ? '{n}（{a}岁，{job}，{w}，{l}）向你表白了！|{n} ({a}, {job}, {w}, {l}) confessed their feelings to you!' : '{n}（{a}岁，{job}，{l}）向你表白了。|{n} ({a}, {job}, {l}) confessed their feelings to you.'; },
      o: [
        { t: '答应{him}|Say yes', run: function (c) { var n = c.npc; if (N.partner() && N.spouse()) { n.rel = 'affair'; c.add('happy', 6); c.add('karma', -6); return '你瞒着另一半，和{n}偷偷在一起了。|Behind your partner\'s back, you secretly start seeing {n}.'; } var had = N.partner(); LO.becomeLovers(n); c.add('happy', 10); return had ? '你和前任分了手，和{n}在一起了。|You broke up with your ex and got together with {n}.' : '你们在一起了！|You\'re together now!'; } },
        { t: '先做朋友|Let\'s be friends first', run: function (c) { c.npc.rel = 'friend'; N.addAff(c.npc, 10); c.npc.pin = 0; return '你们先从朋友做起。|You start out as friends.'; } },
        { t: '拒绝|Turn {him} down', run: function (c) { c.npc.rel = 'contact'; N.addAff(c.npc, -10); c.add('fame', 0); return '你婉拒了{n}。|You politely turned {n} down.'; } }
      ] },
    { id: 'sys_npc_propose', sys: 1, title: '求婚|Proposal', icon: '💍',
      t: '{n}单膝跪地，拿出一枚戒指：“嫁给我吧！”|{n} kneels and holds out a ring: "Marry me!"',
      prep: function (c) { if (c.npc.g === 'f') c.prm.x = 1; if (!N.partner() || N.partner() !== c.npc) return false; },
      o: [
        { t: '我愿意！|Yes!', run: async function (c) { c.npc.engaged = 1; var ok = await LO.marry(c.npc); return ok ? '你们结婚了！|You got married!' : '婚礼没能办成。|The wedding didn\'t happen.'; } },
        { t: '还没准备好|I\'m not ready', run: function (c) { N.addLove(c.npc, -15); return '{n}有些失落。|{n} looks crestfallen.'; } }
      ] },
    { id: 'sys_partner_cheat', sys: 1, title: '背叛|Betrayal', icon: '💔', bad: 1,
      t: '你在{n}的手机里发现了暧昧的聊天记录——{he}出轨了。|You found flirty messages on {n}\'s phone — {he} has been cheating.',
      prep: function (c) { if (!c.npc || c.npc.id !== G.S.p.partner) return false; },
      o: [
        { t: '原谅{him}|Forgive {him}', run: function (c) { c.npc.cheat = 0; c.npc.loyal = G.clamp(c.npc.loyal + 15, 0, 100); N.addLove(c.npc, 10); c.add('happy', -10); return '{n}哭着发誓再也不会了。|{n} tearfully swears it will never happen again.'; } },
        { t: '大吵一架|Have a huge fight', run: function (c) { c.npc.cheat = 0; N.addLove(c.npc, -20); N.addAff(c.npc, -20); c.add('happy', -12); return '你们吵得天翻地覆。|You had a blowout fight.'; } },
        { t: '分手/离婚|Break up / divorce', run: function (c) { if (c.npc.rel === 'spouse') LO.divorce(c.npc, false); else LO.breakup(c.npc); return '你结束了这段感情。|You ended it.'; } }
      ] },
    { id: 'sys_dumped', sys: 1, title: '分手|Breakup', icon: '💔', bad: 1,
      t: '{n}说：“我们不合适，分手吧。”|{n} says, "We\'re not right for each other. Let\'s break up."',
      prep: function (c) { if (!c.npc || c.npc.id !== G.S.p.partner) return false; },
      o: [
        { t: '挽留{him}|Beg {him} to stay', run: function (c) { if (G.ch(.3 + c.p.st.eq / 300)) { N.addLove(c.npc, 25); return '{n}心软了，决定再给你一次机会。|{n} softens and gives you another chance.'; } LO.breakup(c.npc); return '{n}还是走了。|{n} left anyway.'; } },
        { t: '好聚好散|Let {him} go', run: function (c) { LO.breakup(c.npc); N.addAff(c.npc, 20); return '你们和平分手了。|You parted on good terms.'; } }
      ] },
    { id: 'sys_divorce_req', sys: 1, title: '离婚|Divorce', icon: '📄', bad: 1,
      t: '{n}把离婚协议书放在了桌上。|{n} puts divorce papers on the table.',
      prep: function (c) { if (!c.npc || c.npc.id !== G.S.p.partner) return false; },
      o: [
        { t: '努力挽回婚姻|Fight for the marriage', run: function (c) { if (G.ch(.35 + c.p.st.eq / 300)) { N.addLove(c.npc, 30); return '你们去做了婚姻咨询，关系有所缓和。|You went to counseling and things improved.'; } LO.divorce(c.npc, true); return '{n}心意已决，你们还是离婚了。|{n}\'s mind was made up; you divorced.'; } },
        { t: '签字|Sign the papers', run: function (c) { LO.divorce(c.npc, true); return '你们和平离婚了。|You divorced amicably.'; } }
      ] },
    { id: 'sys_affair_caught', sys: 1, title: '东窗事发|Caught Cheating', icon: '🔥', bad: 1,
      t: function (c) { var sp = N.spouse(); c.prm.s = sp ? sp.name : ''; return '{s}发现了你和{n}的事。|{s} found out about you and {n}.'; },
      prep: function (c) { if (!N.spouse()) return false; },
      o: [
        { t: '跪地求饶，和{n}断了|Beg forgiveness and end it with {n}', run: function (c) { var sp = N.spouse(); c.npc.rel = 'ex'; c.npc.love = 0; if (G.ch(.5)) { N.addLove(sp, -30); return '{s}勉强原谅了你。|{s} reluctantly forgave you.'; } LO.divorce(sp, false); return '{s}坚决要离婚。|{s} insisted on a divorce.'; } },
        { t: '离婚，和{n}在一起|Divorce and be with {n}', run: function (c) { var sp = N.spouse(); LO.divorce(sp, false); LO.becomeLovers(c.npc); return '你离了婚，和{n}光明正大地在一起了。|You divorced and openly got together with {n}.'; } }
      ] },
    { id: 'sys_birth', sys: 1, title: '新生命|New Life', icon: '👶', good: 1,
      t: function (c) { return G.S.p.g === 'f' ? '你怀孕了，十月怀胎后……|You got pregnant, and nine months later...' : '{n}怀孕了，十月怀胎后……|{n} got pregnant, and nine months later...'; },
      run: async function (c) { var k = await LO.baby(c.npc); if (G.S.p.g === 'f') c.add('health', -4); return G.L('{k}出生了！|{k} was born!', { k: k.name }); } },
    { id: 'sys_parent_ill', sys: 1, title: '家人病重|Family Illness', icon: '🏥', bad: 1,
      t: '{n}病倒了，住进了医院，治疗需要一大笔钱。|{n} fell seriously ill and was hospitalized. Treatment is expensive.',
      prep: function (c) { c.prm.m = G.M(G.$(25000)); },
      o: [
        { t: '倾尽全力治疗（{m}）|Pay for the best care ({m})', run: function (c) { var cost = c.$(25000); if (!c.pay(cost)) { if (c.npc.wealth >= cost) { c.npc.wealth -= cost; } else return '你拿不出这么多钱。|You can\'t come up with that much.'; } c.npc.health = G.clamp(c.npc.health + 30, 0, 100); N.addAff(c.npc, 20); c.add('karma', 5); return '{n}渐渐康复了，紧紧握着你的手。|{n} slowly recovers and holds your hand tight.'; } },
        { t: '常去医院陪护|Visit often', run: function (c) { c.npc.health = G.clamp(c.npc.health + 8, 0, 100); N.addAff(c.npc, 12); c.add('happy', -4); return '你每天下班都去医院陪{him}。|You go to the hospital every day after work.'; } },
        { t: '太忙了，没空管|Too busy to deal with it', run: function (c) { N.addAff(c.npc, -25); c.add('karma', -8); return '{n}很失望。|{n} is deeply disappointed.'; } }
      ] },
    { id: 'sys_npc_death', sys: 1, title: '离别|Farewell', icon: '🕯️', kind: 'sad',
      prep: function (c) { if (!c.npc) return false; c.prm.r = N.relName(c.npc); var imp = N.isFamily(c.npc) || c.npc.rel === 'lover' || c.npc.rel === 'friend' && c.npc.aff > 40 || c.npc.rel === 'mentor'; if (!imp) return false; },
      t: '你的{r}{n}离开了人世。|Your {r}, {n}, has passed away.',
      run: function (c) {
        var n = c.npc, p = c.p;
        c.add('happy', N.isFamily(n) ? -18 : -8);
        if (n.id === p.partner) { p.partner = null; n.widow = 1; G.major('{n}去世|{n} passed away', { n: n.name }); }
        if (n.rel === 'father' || n.rel === 'mother' || n.rel === 'grand') { var s = FA.inherit(n); G.major('{r}去世|{r} passed away', { r: c.prm.r }); if (s > 0) return G.L('你继承了{m}遗产。|You inherited {m}.', { m: G.M(s) }); }
        if (n.rel === 'child') { c.add('happy', -20); G.major('痛失{n}|Lost {n}', { n: n.name }); }
      } }
  ]);

  /* chat helper: npc sends a message (shows unread badge) */
  N.pushChat = function (n, text, prm) {
    var t = G.L(text, prm || {});
    n.chat = n.chat || []; n.chat.push({ f: 'n', t: t, y: G.S.year }); n.unread = (n.unread || 0) + 1;
    if (n.chat.length > 80) n.chat = n.chat.slice(-80);
    G.emit('chat', n);
  };
})();
