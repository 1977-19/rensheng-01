/* Batch 6: playing on from a child's birth, many loves at once, twins, money ledger, a harder economy,
   one real job at a time, citizenship rules, welfare, ancestral homes, and many smaller corrections. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC, LO = G.love, FA = G.family;
  function S() { return G.S; }
  function bi(a, b, z, e) { var x = String(a).split('|'), y = String(b).split('|'); return x[0] + (z == null ? '·' : z) + y[0] + '|' + (x[1] || x[0]) + (e == null ? ' · ' : e) + (y[1] || y[0]); }

  /* ================= money ledger: who gave you what, where it went ================= */
  var FIN = G.fin = { tag: null, mute: 0 };
  function bucket() {
    var s = S(); if (!s || !s.p) return null;
    s.fin = s.fin || {};
    var b = s.fin[s.year];
    if (!b) { b = s.fin[s.year] = { a: s.p.age, in: {}, out: {}, par: {} }; var ks = Object.keys(s.fin).map(Number).sort(function (x, y) { return x - y; }); while (ks.length > 90) delete s.fin[ks.shift()]; }
    return b;
  }
  FIN.add = function (kind, label, amt) { amt = Math.round(Math.abs(amt || 0)); if (!amt) return; var b = bucket(); if (!b) return; var t = b[kind] || (b[kind] = {}); t[label] = (t[label] || 0) + amt; };
  FIN.who = function (n, what) { var r = N.relName(n); return what ? bi(r, what, '给的', ' · ') : r; };
  FIN.yearly = function (o) {
    if (o.work) FIN.add('in', '工资与收入|Wages & income', o.work);
    if (o.black) FIN.add('in', '灰色收入|Under-the-table income', o.black);
    if (o.interest) FIN.add('in', '存款利息|Interest', o.interest);
    if (o.inv > 0) FIN.add('in', '投资收益|Investment gains', o.inv); else if (o.inv < 0) FIN.add('out', '投资亏损|Investment losses', o.inv);
    (o.allowBy || []).forEach(function (x) { FIN.add('in', FIN.who(x[0], '零花钱|allowance'), x[1]); });
    if (o.tax) FIN.add('out', '个人所得税|Income tax', o.tax);
    if (o.living) FIN.add('out', '吃穿住行|Living costs', o.living);
    if (o.other) FIN.add('out', '房贷·车·宠物|Mortgage, car & pets', o.other);
  };
  var am0 = G.addMoney;
  G.addMoney = function (n) {
    var r = am0.apply(this, arguments);
    if (!FIN.mute && G.S && G.S.p && n) FIN.add(n > 0 ? 'in' : 'out', FIN.tag || (n > 0 ? '其他收入|Other income' : '其他开销|Other spending'), n);
    return r;
  };

  /* ================= a harder economy ================= */
  var sal0 = G.career.salary;
  G.career.salary = function () { return Math.round(sal0.apply(this, arguments) * .85); };
  // welfare and what each country takes or gives
  var WELF = { us: 8000, gb: 10000, fr: 11000, de: 12000, ca: 9500, au: 11000, nz: 10000, ie: 11000, ch: 15000, at: 11000, jp: 9000, kr: 6000, sg: 2500, it: 7000, es: 7000, pt: 5000, cn: 1500, ru: 2000, br: 1800, mx: 900, ar: 1200, za: 1200, th: 700, in: 0 };
  G.WELF = WELF;
  var GRAFT = { in: .04, ru: .03, br: .025, mx: .03, za: .025, ar: .03, th: .015 };
  var mt0 = G.money.tick;
  G.money.tick = function (Q) {
    var r = mt0.apply(this, arguments), s = S(), p = s.p;
    if (p.age >= 18 && !p.jail && !G.dependent()) {
      var inc = G.money.income(), w = WELF[p.country] || 0;
      // a safety net for people with no income — big in some countries, almost nothing in others
      if (!inc.work && !inc.black && !p.retired && w && G.netWorth() < G.$(20000)) {
        var amt = G.$w(w); p.money += amt; FIN.add('in', '社会救济金|Welfare benefits', amt);
        if (!p.flags.welfY || s.year - p.flags.welfY > 4) { p.flags.welfY = s.year; G.log('你领到了{c}的社会救济金，一年{m}。|You received {c} welfare benefits: {m} a year.', { c: G.C[p.country].n, m: G.M(amt) }); }
      }
      // in some places a slice of what you earn disappears into fees, "gifts" and red tape
      var gr = GRAFT[p.country];
      if (gr && inc.work > 0 && !(p.gov && p.gov.rank >= 3)) {
        var lose = Math.round(inc.work * gr * G.rf(.5, 1.3)); p.money -= lose; FIN.add('out', '打点·手续费·红包|Fees, "gifts" & red tape', lose);
        if (G.ch(.12)) G.log('办事处处要打点，今年又多花了{m}。|Getting anything done meant greasing palms — another {m} gone this year.', { m: G.M(lose) });
      }
    }
    return r;
  };

  /* ================= one real job at a time ================= */
  function svcName() { var p = S().p; if (p.mil) return '军队|the military'; if (p.pol) return '警队|the police'; if (p.gov && p.gov.track === 'civil') return '公务员|the civil service'; if (p.job) return '现在的工作|your current job'; return null; }
  ['mil', 'police', 'gov'].forEach(function (k) {
    var M = G[k]; if (!M || !M.can) return;
    var can0 = M.can;
    M.can = function () {
      var p = S().p;
      if (k !== 'mil' && p.mil) return false;
      if (k !== 'police' && p.pol) return false;
      if (k !== 'gov' && p.gov && p.gov.track === 'civil') return false;
      if (k === 'mil' && G.school.isStudent() && !p.flags.drafted) return false;
      return can0.apply(this, arguments);
    };
  });
  function clearOthers(keep) {
    var p = S().p, gone = [];
    if (keep !== 'mil' && p.mil && !p.mil.cons) { p.mil = null; gone.push('军职|military post'); }
    if (keep !== 'pol' && p.pol) { p.pol = null; gone.push('警职|police post'); }
    if (keep !== 'gov' && p.gov && p.gov.track === 'civil') { p.gov = null; gone.push('公职|civil-service post'); }
    if (gone.length) G.log('你辞去了原来的{x}——一个人只能有一份正式工作。|You resigned your {x} — you can only hold one real job at a time.', { x: gone.map(function (g) { return G.T(g); }).join('、') });
  }
  var enl0 = G.mil.enlist; G.mil.enlist = function () { clearOthers('mil'); return enl0.apply(this, arguments); };
  var pj0 = G.police.join; G.police.join = function () { clearOthers('pol'); return pj0.apply(this, arguments); };
  var gj0 = G.gov.join; G.gov.join = function () { clearOthers('gov'); return gj0.apply(this, arguments); };
  var hire0 = G.career.hire; G.career.hire = function (j) { if (j && !j.pt) clearOthers('job'); return hire0.apply(this, arguments); };
  // the apply buttons say why they're closed
  (G.ACT_CATS || []).forEach(function (c) { (c.items || []).forEach(function (a) {
    if (['enlist', 'police', 'civil'].indexOf(a.id) < 0 || !a.lock) return;
    var lk = a.lock;
    a.lock = function () {
      var p = S().p, x = svcName(), self = { enlist: 'mil', police: 'pol', civil: 'gov' }[a.id];
      if (a.id === 'enlist' && G.school.isStudent()) return G.L('还在上学，不能参军。先毕业或者退学。|You\'re still in school — graduate or drop out before enlisting.');
      if (x && !(self === 'mil' && p.mil) && !(self === 'pol' && p.pol) && !(self === 'gov' && p.gov) && (p.mil || p.pol || (p.gov && p.gov.track === 'civil'))) return G.L('你已经在{x}任职了。一个人只能有一份正式工作，先辞职再报考。|You already serve in {x}. One real job at a time — resign first.', { x: x });
      return lk.apply(this, arguments);
    };
  }); });
  // students are deferred from the draft until they finish school
  var svcTick = G.mil.tick;
  if (svcTick) G.mil.tick = function () { var p = S().p, cs = G.C[p.country].consc; if (cs && G.school.isStudent() && p.age >= cs.age - 1) p.flags.consDefer = 1; return svcTick.apply(this, arguments); };

  /* ================= jobs that need a master's or a PhD ================= */
  var DEG = { doctor: 5, sci: 6, psych: 5, judge: 5, diplomat: 5, quant: 6, ai: 5, archi: 5, pharm: 5, vet: 5 };
  Object.keys(DEG).forEach(function (id) { if (G.JOB[id]) G.JOB[id].deg = Math.max(G.JOB[id].deg || 0, DEG[id]); });
  [{ id: 'lecturer', n: '高校讲师|University Lecturer', r: ['讲师|Lecturer', '高级讲师|Senior Lecturer', '系主任|Head of Department'], pay: [52000, 76000, 110000], deg: 5, st: 3, cat: 'edu', req: { smarts: 62 } },
   { id: 'rnd', n: '研发科学家|R&D Scientist', r: ['研发科学家|R&D Scientist', '首席研发|Principal Scientist', '研发总监|R&D Director', '首席技术官|Chief Technology Officer'], pay: [95000, 150000, 240000, 420000], deg: 6, maj: ['bio', 'cs', 'eng', 'med', 'chem', 'phys'], st: 4, cat: 'tech', req: { smarts: 75 }, y0: 1980 },
   { id: 'surgeon', n: '外科主刀医生|Attending Surgeon', r: ['住院医师|Resident', '主治医师|Attending', '副主任医师|Associate Chief', '主任医师|Chief of Surgery'], pay: [70000, 140000, 230000, 380000], deg: 6, maj: ['med'], st: 5, cat: 'med', req: { smarts: 75, health: 55 } },
   { id: 'econ', n: '经济学家|Economist', r: ['研究员|Research Economist', '高级经济学家|Senior Economist', '首席经济学家|Chief Economist'], pay: [80000, 140000, 260000], deg: 6, maj: ['econ', 'fin'], st: 4, cat: 'biz', req: { smarts: 72 } },
   { id: 'think', n: '智库研究员|Think-Tank Fellow', r: ['研究助理|Research Associate', '研究员|Fellow', '高级研究员|Senior Fellow'], pay: [55000, 90000, 150000], deg: 5, st: 3, cat: 'gov', req: { smarts: 65 } }
  ].forEach(function (j) { if (!G.JOB[j.id]) { G.JOBS.push(j); G.JOB[j.id] = j; } });

  /* ================= love: more than one at a time ================= */
  var bl0 = LO.becomeLovers;
  LO.becomeLovers = function (n) {
    var p = S().p, old = N.partner();
    if (old && old !== n && old.alive && old.rel === 'lover') {
      n.rel = 'lover'; n.love = Math.max(n.love, 60); n.yrs = 0; n.pin = 1;
      G.major('和{n}在一起了|Started dating {n}', { n: n.name }); G.inc('lovers');
      try { if (G.circle && G.circle.ensureInlaws) G.circle.ensureInlaws(n); } catch (e) { }
      var all = N.rel('lover').filter(function (x) { return x.alive; });
      G.log('你同时和{l}交往着。|You are now seeing {l} at the same time.', { l: all.map(function (x) { return G.T(x.name); }).join('、') + '|' + all.map(function (x) { return G.T(x.name); }).join(', ') });
      return;
    }
    return bl0.apply(this, arguments);
  };
  var br0 = LO.breakup;
  LO.breakup = function (n) { var r = br0.apply(this, arguments), p = S().p; if (!p.partner) { var other = N.rel('lover').filter(function (x) { return x.alive && x !== n; }).sort(function (a, b) { return b.love - a.love; })[0]; if (other) p.partner = other.id; } return r; };
  var marry0 = LO.marry;
  LO.marry = async function (n) {
    if (!G.settings.autoGame && !(await G.UI.confirm(G.L('结婚|Marriage'), G.L('确定要和{n}结婚吗？结婚以后再想分开就是离婚了。|Are you sure you want to marry {n}? After this, leaving means divorce.', { n: n.name })))) { n.engaged = 0; return false; }
    var ok = await marry0.apply(this, arguments);
    if (ok) N.rel('lover').forEach(function (x) { if (x !== n && x.alive) { x.rel = 'affair'; G.log('你结了婚，和{n}的关系只能转到地下了。|Now that you\'re married, things with {n} had to go underground.', { n: x.name }); } });
    return ok;
  };
  var baby0 = LO.baby;
  LO.baby = async function (other, adopted) {
    var k = await baby0.apply(this, arguments), s = S();
    if (!k) return k;
    // an adopted child belongs to your spouse too — or to the partner who loves you most
    if (adopted && !k.par2) { var sp = N.spouse(), cand = sp || N.rel('lover').filter(function (x) { return x.alive; }).sort(function (a, b) { return b.aff - a.aff; })[0]; if (cand) { k.par2 = cand.id; k.other = cand.id; cand.pin = 1; } }
    if (other) other.trying = 0;
    s.p.flags.tryBaby = 0;
    // twins
    if (!adopted && !LO._twin && G.ch(G.has('fertile') ? .05 : .025)) {
      LO._twin = 1;
      try { var t = await LO.baby(other, false); if (t) { t.twin = k.id; k.twin = t.id; G.log('是双胞胎！{a}和{b}一起来到了这个世界。|Twins! {a} and {b} arrived together.', { a: k.name, b: t.name }); G.major('双胞胎出生了|Twins were born'); } } finally { LO._twin = 0; }
    }
    // how to raise them: asked right away instead of buried in the child's page
    (s.pendQ = s.pendQ || []).push({ id: 'k_raise_plan', nid: k.id });
    return k;
  };
  G.evs([
    { id: 'k_raise_plan', sys: 1, title: function (c) { return G.L('怎么养{n}？|How Will You Raise {n}?', { n: c.npc.name }); }, icon: '🧺',
      prep: function (c) { if (!c.npc || !c.npc.alive || N.age(c.npc) > 6) return false; c.prm.n = c.npc.name; c.fee = G.$w(18000); c.rich = G.$w((G.RAISE.rich || {}).cost || 12000); c.prm.f = G.M(c.fee); c.prm.r = G.M(c.rich); },
      t: '{n}来到了你的生活里。从今天起，你打算怎么养{him}？|{n} has arrived in your life. From today, how will you raise {him}?',
      o: [
        { t: '穷养：够用就好，凡事自己来|Frugally: enough to get by, do things yourself', run: function (c) { c.npc.raise = 'poor'; return '你决定穷养{n}，让{him}早早学会独立。|You\'ll raise {n} frugally, so {he} learns independence early.'; } },
        { t: '普通养：该给的给，该管的管|Normally: give what\'s needed, guide where needed', run: function (c) { c.npc.raise = 'norm'; return '你决定按部就班地养{n}。|You\'ll raise {n} the ordinary way.'; } },
        { t: '富养：见世面、学才艺（每年{r}）|Lavishly: travel, lessons (~{r} a year)', dis: function (c) { return c.p.money < c.rich * 2 && !G.parentsCover(c.rich * 2); }, run: function (c) { c.npc.raise = 'rich'; return '你决定富养{n}，给{him}最好的一切。|You\'ll raise {n} in comfort and give {him} the best of everything.'; } },
        { t: '富养，再请一位专业育儿保姆（每年{f}）|Lavishly, plus a professional nanny (~{f} a year)', dis: function (c) { return c.p.money < (c.fee + c.rich) * 2; }, run: function (c) {
          c.npc.raise = 'rich';
          var nn = N.make({ rel: 'contact', g: 'f', age: G.ri(30, 52), job: '育儿保姆|Nanny', inc: c.fee, aff: 50, pers: 'gentle' }); nn.pin = 1; c.npc.nanny = nn.id; c.prm.m = nn.name;
          return '你请了{m}来做{n}的保姆，你也能喘口气了。|You hired {m} as {n}\'s nanny — and finally got some sleep.';
        } }
      ] },
    // seeing two people at once rarely stays a secret forever
    E('lv_two_time', [16, 70], '脚踏两条船|Two at Once', '💔', '{n}在你的手机上看到了{o}发来的消息，脸色一下子变了。|{n} saw a message from {o} on your phone, and {his} face fell.', [
      O('选{n}，和{o}分手|Choose {n}, end it with {o}', function (c) { LO.breakup(c.o); G.dPush('love', N.addLove(c.npc, -6)); return '你删掉了{o}的联系方式。{n}半信半疑地留了下来。|You deleted {o}\'s number. {n} stayed — warily.'; }),
      O('选{o}，和{n}分手|Choose {o}, end it with {n}', function (c) { LO.breakup(c.npc); return '{n}摔门而去。|{n} slammed the door on the way out.'; }),
      O('坦白，问能不能都在一起|Come clean and ask if all of you can make it work', function (c) { if (G.ch(.18 + (G.has('charm') ? .15 : 0))) { c.add('happy', 4); return '出乎意料，{n}和{o}都没有走。你们的关系变得很复杂。|To your surprise, neither {n} nor {o} left. Things got complicated.'; } LO.breakup(c.npc); LO.breakup(c.o); c.add('happy', -10); return '两个人都离开了你。|Both of them left you.'; }),
      O('继续撒谎|Keep lying', RC(.45, '{n}暂时信了你。|{n} believed you — for now.', { karma: -3 }, '{n}当场拆穿了你，转身就走。|{n} saw straight through it and walked out.', { happy: -8 }))
    ], { rep: 1, cd: 3, bad: 1, prep: function (c) { var L = N.rel('lover').filter(function (x) { return x.alive; }); if (L.length < 2) return false; L.sort(function (a, b) { return b.love - a.love; }); c.npc = L[0]; c.o = L[1]; c.prm.n = c.npc.name; c.prm.o = c.o.name; var pr = G.pr(c.npc.g); for (var k in pr) c.prm[k] = pr[k]; } })
  ]);

  /* ================= playing on: reset what belonged to the parent's life ================= */
  var cont0 = G.life.continueAs;
  G.life.continueAs = function () { var s = S(); s.cnt = {}; s.done = {}; s.cool = {}; s.fin = {}; return cont0.apply(this, arguments); };

  /* ...or start the child's life over from the day they were born */
  function originFor(old, nw) {
    var o = old.origin, fl = old.flags, $ = G.$;
    if (fl.monarch || (o === 'royal' && !fl.exRoyal && !fl.trafficked)) return G.C[old.country].mon ? 'royal' : 'noble';
    if (['noble', 'red', 'mafia'].indexOf(o) >= 0 && !fl.trafficked) return o;
    if (old.gang && old.gang.rank >= 3) return 'mafia';
    if (nw > $(1e9)) return 'richest'; if (nw > $(2e7)) return 'tycoon';
    if (old.st.fame >= 75) return 'celebrity';
    if (nw > $(1e6)) return 'merchant';
    if (old.gov) return 'civil'; if (old.mil) return 'military'; if (old.pol) return 'police';
    if (old.edu.deg >= 6) return 'scholar';
    if (nw > $(150000)) return 'middle';
    if (old.tier >= 5) return 'rural';
    return 'worker';
  }
  G.life.rebirthAs = function (kid) {
    var s0 = S(), old = s0.p, deathY = s0.year, nw = Math.max(0, G.netWorth());
    var sp = (kid.par2 && s0.npcs[kid.par2]) || (kid.other && s0.npcs[kid.other]) || null;
    var sibs = N.rel('child').filter(function (k) { return k !== kid && !k.adopted; }).map(function (k) { return { name: k.name, sur: k.sur, g: k.g, by: k.by, av: k.av, looks: k.looks, smarts: k.smarts, illegit: k.illegit, par2: k.par2 }; });
    var oldC = { name: old.name, g: old.g, by: old.birthYear, looks: old.st.looks, seed: old.avSeed || G.hash(old.name + old.birthYear), skin: old.skin, job: old.job ? G.JOB[old.job.id].r[Math.min(old.job.rank, G.JOB[old.job.id].r.length - 1)] : null, monarch: !!old.flags.monarch, anc: old.anc };
    var spC = sp ? { name: sp.name, g: sp.g, by: sp.by, looks: sp.looks, av: sp.av, skin: sp.skin, died: sp.alive ? 0 : (sp.died || 0), job: sp.job } : null;
    var gen = (s0.gen || 1) + 1, origin = originFor(old, nw);
    var o = { g: kid.g, orient: kid.orient || 'het', country: kid.c || old.country, tier: old.tier, city: old.city, by: kid.by, origin: origin, talents: (kid.talents || []).slice(0, 3), anc: oldC.anc };
    o.name = kid.name; if (kid.sur) o.sur = kid.sur;
    G.life.create(o);
    var s = S(), p = s.p; s.gen = gen; p.flags.reborn = 1; if (kid.sur) p.sur = kid.sur; if (kid.av) p.avSeed = kid.av;
    // the parent you used to be, alive again — until the year they died
    var mine = N.rel(oldC.g === 'm' ? 'father' : 'mother')[0], theirs = N.rel(oldC.g === 'm' ? 'mother' : 'father')[0];
    if (mine) { mine.name = oldC.name; mine.g = oldC.g; mine.by = oldC.by; mine.av = oldC.seed; mine.looks = oldC.looks; if (oldC.skin != null) mine.skin = oldC.skin; mine.aff = G.ri(70, 90); mine.dieY = deathY; mine.wasYou = 1; mine.pin = 1; if (oldC.job) mine.job = oldC.job; if (origin !== 'royal') mine.wealth = Math.round(nw * .45); }
    if (theirs && spC) { theirs.name = spC.name; theirs.g = spC.g; theirs.by = spC.by; if (spC.av) theirs.av = spC.av; if (spC.looks) theirs.looks = spC.looks; if (spC.skin != null) theirs.skin = spC.skin; if (spC.died) theirs.dieY = spC.died; theirs.pin = 1; if (spC.job) theirs.job = spC.job; }
    else if (theirs && !spC) { theirs.alive = false; theirs.died = kid.by; }
    // brothers and sisters: the older ones are here already, the younger ones will come
    N.rel('sibling').forEach(function (n) { delete s.npcs[n.id]; });
    s.futureSibs = [];
    sibs.forEach(function (x) {
      if (x.by <= kid.by) { var n = N.make({ rel: 'sibling', g: x.g, by: x.by, name: x.name, sur: x.sur, looks: x.looks, smarts: x.smarts, aff: G.ri(40, 75) }); if (x.av) n.av = x.av; n.pin = 1; if (x.illegit) { n.illegit = 1; n.half = oldC.g === 'm' ? 'father' : 'mother'; } }
      else s.futureSibs.push(x);
    });
    G.log('第{g}代：你以{n}的身份，从出生那天重新开始。|Generation {g}: you begin again as {n}, from the day you were born.', { g: gen, n: p.name });
    G.major('作为第{g}代重新出生|Born again as generation {g}', { g: gen });
    return s;
  };
  // younger siblings arrive in their year; the parent you were leaves in theirs
  var nt0 = N.tick;
  N.tick = function () {
    var s = S();
    if (s && s.futureSibs && s.futureSibs.length) {
      s.futureSibs = s.futureSibs.filter(function (x) {
        if (x.by > s.year) return true;
        var n = N.make({ rel: 'sibling', g: x.g, by: x.by, name: x.name, sur: x.sur, looks: x.looks, smarts: x.smarts, aff: G.ri(50, 80) }); if (x.av) n.av = x.av; n.pin = 1;
        if (x.illegit) { n.illegit = 1; n.half = N.rel('father').some(function (f) { return f.wasYou; }) ? 'father' : 'mother'; }
        G.log('{n}出生了，你有了一个{x}。|{n} was born — you have a little {y}.', { n: n.name, x: n.g === 'm' ? '弟弟|' : '妹妹|', y: n.g === 'm' ? 'brother' : 'sister' });
        return false;
      });
    }
    return nt0.apply(this, arguments);
  };

  /* ================= endings: the romantic ================= */
  var title6 = G.ending.title;
  G.ending.title = function (nw, hap, kids) {
    var base = title6.apply(this, arguments), s = S(), c = s.cnt;
    var others = {}; N.rel('child').forEach(function (k) { var o = k.par2 || k.other; if (o) others[o] = 1; });
    var nOthers = Object.keys(others).length;
    if ((c.lovers || 0) >= 6 && nOthers >= 3 && ['happy', 'hard', 'plain', 'alone', 'free', 'drifter', 'richsad', 'young', 'heartbreak'].indexOf(base.k) >= 0)
      return { k: 'romeo', t: '情种|A Born Romantic', d: G.L('你这一生爱过{l}个人，和{o}个不同的人有过孩子。|You loved {l} people in one lifetime and had children with {o} different partners.', { l: c.lovers, o: nOthers }) };
    return base;
  };
  var epi6 = G.ending.epitaph;
  G.ending.epitaph = function (k) { if (k === 'romeo') return G.pick(['我爱过的每一个人，都是真心的。|Everyone I loved, I loved truly.', '风流一生，不悔。|A life of many loves — and no regrets.']); return epi6.apply(this, arguments); };

  /* ================= family tree: who married whom, whose child is whose ================= */
  function parentOfGrand(n) { return N.rel('child').filter(function (k) { return (k.kids || []).indexOf(n.id) >= 0; })[0] || null; }
  var rn6 = N.relName;
  N.relName = function (n) {
    var s = S();
    if (n && n.rel === 'grandchild') { var k = parentOfGrand(n); if (k) { var b = rn6.apply(this, arguments).split('|'); var kn = String(k.name).split('|'); return b[0] + '（' + kn[0] + '的' + (n.g === 'm' ? '儿子' : '女儿') + '）|' + (b[1] || b[0]) + ' (' + (kn[1] || kn[0]) + '\'s ' + (n.g === 'm' ? 'son' : 'daughter') + ')'; } }
    if (n && n.inlaw && s && s.npcs[n.inlaw] && s.npcs[n.inlaw].rel === 'child' && s.npcs[n.inlaw].spouseId === n.id) { var kk = String(s.npcs[n.inlaw].name).split('|'); return (n.g === 'f' ? '儿媳' : '女婿') + '（' + kk[0] + '的' + (n.g === 'f' ? '妻子' : '丈夫') + '）|' + (n.g === 'f' ? 'Daughter-in-law' : 'Son-in-law') + ' (' + (kk[1] || kk[0]) + '\'s ' + (n.g === 'f' ? 'wife' : 'husband') + ')'; }
    return rn6.apply(this, arguments);
  };
  var info6 = G.npcInfo;
  G.npcInfo = function (n) {
    var r = info6.apply(this, arguments) || [], s = S();
    if (n.rel === 'child') {
      var sp = n.spouseId && s.npcs[n.spouseId]; if (sp) r.push(['配偶|Spouse', sp.name]);
      var gk = (n.kids || []).map(function (id) { return s.npcs[id]; }).filter(Boolean); if (gk.length) r.push(['孩子|Children', gk.map(function (x) { return G.T(x.name); }).join('、')]);
      if (n.twin && s.npcs[n.twin]) r.push(['双胞胎|Twin', s.npcs[n.twin].name]);
    }
    if (n.rel === 'grandchild') { var k = parentOfGrand(n); if (k) { var sp2 = k.spouseId && s.npcs[k.spouseId]; r.push(['父母|Parents', G.T(k.name) + (sp2 ? ' & ' + G.T(sp2.name) : '')]); } }
    if (N.age(n) < 18 && n.famW) r.push(['家境|Family fortune', G.fm(n.famW)]);
    if (n.wasYou) r.push(['身份|Who', '上一世的你|You, in your last life']);
    return r;
  };
  // children of powerful families come from money even if their own piggy bank is small
  var mk6 = N.make;
  N.make = function (o) {
    var n = mk6.apply(this, arguments);
    try {
      var rich = (n.tags || []).some(function (t) { return ['rich', 'red', 'royal', 'elite', 'tycoon', 'noble', 'mafia', 'celeb'].indexOf(t) >= 0; });
      if (rich && N.age(n) < 18 && !n.famW) { n.famW = G.$(G.ri(5, 300) * 1e5); if (!n.wealth) n.wealth = G.$(G.ri(5, 80) * 100); }
      if (rich && N.age(n) >= 18 && (n.wealth || 0) < G.$(2e5)) n.wealth = G.$(G.ri(3, 80) * 1e5);
    } catch (e) { }
    return n;
  };

  /* ================= citizenship: no dual nationality in some places; rivals ================= */
  G.NODUAL = { cn: 1, in: 1, jp: 1, sg: 1, kr: 1, at: 1 };
  var RIVAL = [['cn', 'us'], ['cn', 'jp'], ['cn', 'gb'], ['cn', 'au'], ['cn', 'ca'], ['ru', 'us'], ['ru', 'gb'], ['ru', 'de'], ['ru', 'fr'], ['ru', 'ca'], ['ru', 'au'], ['ru', 'jp'], ['in', 'cn']];
  G.isRival = function (a, b) { return RIVAL.some(function (x) { return (x[0] === a && x[1] === b) || (x[0] === b && x[1] === a); }); };
  G.sensitive = function () { var p = S().p; return !!(p.gov || p.mil || p.pol || p.flags.monarch); };
  G.rivalBlock = function (c) { var p = S().p; if (!G.sensitive() || !G.isRival(p.country, c)) return null; return G.L('你在{x}任职，按规定家属不能取得{c}的身份。|You hold a sensitive post at home; by law your family can\'t take status in {c}.', { x: G.C[p.country].n, c: G.C[c].n }); };
  var emi0 = G.money.emigrate;
  G.money.emigrate = function (to) {
    var p = S().p, from = p.country;
    if (G.sensitive() && G.isRival(from, to)) { G.log('你在体制内任职，去不了{c}。|With your post, you couldn\'t go to {c}.', { c: G.C[to].n }); return; }
    p.cits = p.cits || [from];
    var r = emi0.apply(this, arguments);
    p.flags.immY = S().year; p.flags.immTo = to;
    return r;
  };
  G.evs([
    { id: 'imm_natural', sys: 1, title: '入籍|Naturalization', icon: '🛂',
      prep: function (c) { var p = c.p; p.cits = p.cits || [p.imm && p.imm[0] || p.country]; if (p.cits.indexOf(p.country) >= 0) return false; c.prm.c = G.C[p.country].n; var nd = p.cits.filter(function (x) { return G.NODUAL[x]; }); c.lose = G.NODUAL[p.country] ? p.cits.slice() : nd; c.prm.o = c.lose.map(function (x) { return G.T(G.C[x].n); }).join('、') || '—'; },
      t: function (c) { return c.lose.length ? '你在{c}住满了年限，可以申请入籍了。但要入籍，就得放弃{o}国籍。|You\'ve lived in {c} long enough to naturalize — but you\'d have to give up {o} citizenship.' : '你在{c}住满了年限，可以申请入籍了，而且可以保留原来的国籍。|You\'ve lived in {c} long enough to naturalize, and you can keep your old citizenship.'; },
      o: [
        { t: '入籍|Become a citizen', run: function (c) { var p = c.p; p.cits = p.cits.filter(function (x) { return c.lose.indexOf(x) < 0; }); p.cits.push(p.country); G.major('加入{c}国籍|Became a citizen of {c}', { c: G.C[p.country].n }); c.add('happy', 4); return '你在宣誓仪式上拿到了新护照。|You took the oath and received your new passport.'; } },
        { t: '保持原国籍，做永久居民|Keep your citizenship and stay a permanent resident', run: function (c) { c.p.flags.immNo = 1; return '你决定保留原来的国籍。|You decided to keep your original citizenship.'; } }
      ] }
  ]);
  var ft6 = FA.tick;
  FA.tick = function (Q) {
    var r = ft6.apply(this, arguments), s = S(), p = s.p;
    if (p.flags.immY && !p.flags.immNo && s.year - p.flags.immY >= 5 && p.age >= 18 && !(p.cits || []).some(function (x) { return x === p.country; }) && !p.flags.immAsked) { p.flags.immAsked = 1; Q.push({ id: 'imm_natural' }); }
    // poor households run out of road
    if (p.age < 18 && G.dependent() && G.famClass && G.famClass() === 0 && !p.jail) {
      var ps = N.rel('father', 'mother').filter(function (n) { return n.alive && !n.away; }), fw = G.sum(ps, function (n) { return n.wealth || 0; });
      if (ps.length && fw < G.$(4000) && G.ch(.15) && !(p.flags.brokeY && s.year - p.flags.brokeY < 3)) { p.flags.brokeY = s.year; Q.push({ id: 'fam_broke' }); }
    }
    return r;
  };
  G.evs([
    { id: 'fam_broke', sys: 1, title: '家里揭不开锅了|The Money Ran Out', icon: '🪫', bad: 1,
      prep: function (c) { var ps = N.rel('father', 'mother').filter(function (n) { return n.alive; }); if (!ps.length) return false; c.ps = ps; },
      t: function (c) { return G.pick(['爸爸干活时伤了腰，家里断了收入，米缸见了底。|Dad hurt his back at work; the income stopped and the rice jar is empty.', '家里欠的债到期了，催债的人天天上门。|The family debt came due, and the collectors come every day.', '一场病花光了家里所有的积蓄。|An illness swallowed every cent the family had saved.']); },
      o: [
        { t: '辍学去打工，帮家里还债|Quit school and work to help the family', if: function (c) { return c.p.age >= 13; }, run: function (c) { var p = c.p; if (G.school.isStudent()) { p.edu.stage = 'done'; } var m = G.$w(G.ri(3, 6) * 1000); c.ps[0].wealth += m; c.add('happy', -8); c.add('eq', 4); G.N.rel('father', 'mother').forEach(function (n) { N.addAff(n, 8); }); G.major('为了家里辍学打工|Left school to support the family'); return '你收起书包，去了城里的工厂。|You packed away your schoolbag and went to work in a city factory.'; } },
        { t: '向亲戚借钱|Borrow from relatives', run: function (c) { var m = G.$(G.ri(2, 6) * 1000); c.ps[0].wealth += m; c.add('happy', -4); return '亲戚借了钱，也给了很多脸色。|The relatives lent the money — along with plenty of cold looks.'; } },
        { t: '把家里能卖的都卖了|Sell everything you can', run: function (c) { var m = G.$(G.ri(1, 4) * 1000); c.ps[0].wealth += m; c.add('happy', -6); return '电视、自行车、妈妈的金耳环……都卖了。|The TV, the bicycle, Mom\'s gold earrings — all sold.'; } }
      ] }
  ]);


  /* ================= the "red" family means something different in every country ================= */
  var RED = {
    cn: null,
    us: ['政治世家|Political Dynasty', '祖父当过参议员，父亲是州长，感恩节的餐桌上坐着半个国会。|Grandpa was a senator and Dad is a governor; half of Congress comes to Thanksgiving.'],
    gb: ['政坛世家|Westminster Dynasty', '祖辈坐过内阁，父亲是议员，你从小在议会大厦的走廊里跑来跑去。|Your grandparents sat in Cabinet and your father is an MP; you grew up running through the halls of Westminster.'],
    jp: ['世袭议员家族|Hereditary Political Family', '祖父当过首相，父亲继承了他的选区，接下来大概轮到你。|Grandfather was Prime Minister, Father inherited his seat — and next, probably, it\'s you.'],
    kr: ['政治世家|Political Dynasty', '父亲是国会议员，家里的电话从早响到晚。|Father is a National Assembly member; the phone rings from dawn till night.'],
    ru: ['权贵之家|Nomenklatura Family', '父亲在克里姆林宫附近有一间办公室，你家的车牌没人敢拦。|Father has an office near the Kremlin; no one dares stop a car with your plates.'],
    in: ['政治王朝|Political Dynasty', '你的姓氏就是一个政党的招牌。|Your surname is a political party\'s brand.'],
    fr: ['政治世家|Political Dynasty', '祖父是部长，父亲是国民议会议员，家里的书房堆满了政策文件。|Grandfather was a minister and Father sits in the National Assembly; the study is buried in policy papers.']
  };
  function redFor(c) { return RED[c] === undefined ? ['政治世家|Political Dynasty', '祖辈是政坛元老，父辈身居要职，你的人脉从出生就铺好了。|Your grandparents were political elders and your parents hold high office; your network was built before you were born.'] : RED[c]; }
  var ro = G.ORIGIN.red;
  if (ro) {
    var rn = ro.n, rd = ro.d;
    var cur = function () { return (G.S && G.S.p && G.S.p.country) || G._wizC || 'cn'; };
    try {
      Object.defineProperty(ro, 'n', { configurable: true, get: function () { var r = redFor(cur()); return r ? r[0] : rn; } });
      Object.defineProperty(ro, 'd', { configurable: true, get: function () { var r = redFor(cur()); return r ? r[1] : rd; } });
    } catch (e) { }
  }
  if (G.famHome) { var fh0 = G.famHome; G.famHome = function () { var r = fh0.apply(this, arguments), p = S() && S().p; if (p && p.origin === 'red' && p.country !== 'cn' && /机关大院/.test(String(r))) return '首都的家族宅邸|The family residence in the capital'; return r; }; }
  if (G.EV.or_rd_compound) { var cmp = G.EV.or_rd_compound, if0 = cmp.if; cmp.if = function (S2, p) { if (p && p.country !== 'cn') return false; return if0 ? if0.apply(this, arguments) : true; }; }

  /* ================= ancestral home ================= */
  function pickAnc(p) {
    var c = p.country, cc = G.C[c];
    if (p.origin === 'immigrant' && p.cul && G.C[p.cul] && p.cul !== c) c = p.cul, cc = G.C[c];
    var tiers = [3, 4, 4, 5, 5]; var t = G.pick(tiers); var city = G.pick(cc.cities[t] || cc.cities[3]);
    return { c: c, city: city };
  }
  var cr6 = G.life.create;
  G.life.create = function (o) {
    var s = cr6.apply(this, arguments), p = s.p;
    if (o && o.anc) p.anc = o.anc;
    if (!p.anc) { p.anc = pickAnc(p); G.log('你的祖籍是{c}{x}。|Your ancestral home is {x}, {c}.', { c: G.C[p.anc.c].n, x: p.anc.city }); }
    return s;
  };
  G.ancName = function (p) { p = p || S().p; return p.anc ? G.T(G.C[p.anc.c].n) + ' · ' + G.T(p.anc.city) : '—'; };
  (G.ACT_CATS || []).forEach(function (c) {
    if (c.id !== 'move' || c._anc) return; c._anc = 1;
    c.items.push({ id: 'roots', n: '回祖籍寻根|Visit Your Ancestral Home', i: '🏮', e: 20, $: 800, a: [8, 110], if: function () { return !!S().p.anc && !S().p.jail; }, run: function (a) {
      var p = S().p, t = G.pick(['你在祠堂里找到了爷爷的名字，刻在族谱的第三页。|In the ancestral hall you found your grandfather\'s name on the third page of the family register.', '老家的人听说你是谁家的孩子，非要留你吃饭。|When the villagers learned whose family you came from, they insisted you stay for dinner.', '你站在老宅门口，忽然明白了自己从哪里来。|Standing at the old family house, you suddenly understood where you came from.']);
      G.inc('roots'); return G.quick(a, t, { happy: 6, eq: 2 });
    } });
  });
})();
