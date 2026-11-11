/* Batch 7: living where you study, shared costs for children, children's own wishes and marriages,
   potential scores, people with their own lives, trusts, royal blood through a spouse, no chat, fewer mis-taps. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, LO = G.love, FA = G.family;
  function S() { return G.S; }

  /* ================= where you actually live ================= */
  G.residence = function () { var p = S().p; return (G.school.isStudent() && (p.edu.abroad || p.flags.studyIn)) || p.country; };
  G.evs([
    { id: 'abroad_done', sys: 1, title: '毕业以后|After Graduation', icon: '🎓',
      prep: function (c) { c.to = c.p.flags.abroadDone; if (!c.to || !G.C[c.to]) return false; c.prm.c = G.C[c.to].n; c.prm.h = G.C[c.p.country].n; },
      t: '你在{c}读完了书。留下，还是回{h}？|You\'ve finished your studies in {c}. Stay, or go home to {h}?',
      o: [
        { t: '留在{c}，办工作签证|Stay in {c} on a work visa', run: function (c) { var to = c.to; c.p.flags.abroadDone = null; G.money.emigrate(to); return '你留在了{c}，开始了新的生活。|You stayed in {c} and began a new life.'; } },
        { t: '回{h}发展|Go home to {h}', run: function (c) { c.p.flags.abroadDone = null; c.add('happy', 3); return '飞机落地的那一刻，你闻到了家乡的味道。|The moment the plane touched down, you could smell home.'; } }
      ] }
  ]);
  // the "go abroad" choice in a family's story really sends you abroad
  if (G.EV) Object.keys(G.EV).forEach(function (id) {
    var d = G.EV[id]; (d.o || []).forEach(function (o) {
      if (typeof o.t === 'string' && /^出国留学\|Go abroad/.test(o.t) && o.run) { var r0 = o.run; o.run = function (c) { var r = r0.apply(this, arguments); if (c.p.flags.abroadDream && !c.p.flags.studyIn) { c.p.flags.studyIn = G.pick(['us', 'gb', 'au', 'ca'].filter(function (x) { return x !== c.p.country; })); G.log('你去了{c}读书，拿的是学生签证。|You went to study in {c} on a student visa.', { c: G.C[c.p.flags.studyIn].n }); } return r; }; }
    });
  });

  /* ================= paying for children: both parents, by what each has ================= */
  function otherParent(k) { var s = S(), o = (k.par2 && s.npcs[k.par2]) || (k.other && s.npcs[k.other]) || N.spouse(); return o && o.alive && !o.sep ? o : (o && o.alive && o.sep ? o : null); }
  G.payKid = function (k, m) {
    if (!m || m <= 0) return true;
    var p = S().p, o = k ? otherParent(k) : null, mine = Math.max(0, p.money), theirs = o ? Math.max(0, o.wealth || 0) : 0, tot = mine + theirs;
    if (tot < m) return false;
    var oShare = o && tot ? Math.round(m * theirs / tot) : 0, myShare = m - oShare;
    if (myShare > p.money) { oShare += myShare - Math.max(0, p.money); myShare = Math.max(0, p.money); }
    if (oShare > theirs) return false;
    if (myShare) G.addMoney(-myShare);
    if (oShare) { o.wealth -= oShare; if (G.D && G.D.on) G.dNote(G.L('{o}出了{x}，你出了{y}|{o} paid {x}, you paid {y}', { o: o.name, x: G.M(oShare), y: G.M(myShare) })); }
    return true;
  };
  G.kidPayAsk = async function (k, m) {
    var o = otherParent(k), items = [{ t: G.L('我来出（{o}按资产分摊）|I\'ll pay ({o} chips in by wealth)', { o: o ? o.name : G.L('一个人|alone') }), sub: G.M(m), icon: '💳' }];
    var kidCan = N.age(k) >= 16 && (k.wealth || 0) >= m;
    if (kidCan) items.push({ t: G.L('让{n}自己出|Let {n} pay', { n: k.name }), sub: G.L('{n}有{w}|{n} has {w}', { n: k.name, w: G.fm(k.wealth) }), icon: '👛' });
    if ((k.wealth || 0) >= m / 2) items.push({ t: G.L('各出一半|Split it half and half'), icon: '🤝' });
    if (items.length === 1) return G.payKid(k, m);
    var want = k.smarts > 60 || k.pers === 'proud' ? G.L('{n}说：“我自己有钱，可以自己出。”|{n} says: "I have my own money — I can pay."', { n: k.name }) : G.L('{n}看着你，等你决定。|{n} looks at you, waiting for your decision.', { n: k.name });
    var i = await G.UI.pick({ title: G.L('这笔钱谁出？|Who pays?'), text: want, items: items });
    if (i < 0) return false;
    if (items[i].icon === '👛') { k.wealth -= m; N.addAff(k, k.pers === 'proud' ? 3 : -1); return true; }
    if (items[i].icon === '🤝') { if (!G.payKid(k, Math.round(m / 2))) return false; k.wealth -= Math.round(m / 2); return true; }
    if (!G.payKid(k, m)) return false; N.addAff(k, 3); return true;
  };
  // a family "donation" comes from the family, not from an 18-year-old's pocket
  G.famFund = function (m) {
    var p = S().p, ps = N.rel('father', 'mother').filter(function (n) { return n.alive && (n.wealth || 0) > 0; }), fw = G.sum(ps, function (n) { return n.wealth; });
    if (fw + Math.max(0, p.money) < m) return false;
    var left = m; ps.forEach(function (n) { var t = Math.min(n.wealth, Math.round(m * n.wealth / Math.max(1, fw))); n.wealth -= t; left -= t; if (G.fin) G.fin.add('par', G.fin.who(n), t); });
    if (left > 0) { ps.forEach(function (n) { var t = Math.min(n.wealth, left); n.wealth -= t; left -= t; }); if (left > 0) G.addMoney(-left); }
    return true;
  };

  /* ================= a child's potential, at a glance ================= */
  G.kidScore = function (k) {
    var pers = { diligent: 8, kind: 4, proud: 2, rebel: -6, lazy: -10, anxious: -3, clingy: -2, cheerful: 3, gentle: 3 }[k.pers] || 0;
    var job = k.job ? 8 : 0, edu = k.edu ? (k.edu.perf || 50) : 50, deg = k.edu ? (k.edu.deg || 0) * 2 : 0;
    var v = (k.smarts || 50) * .32 + (k.eq || 50) * .2 + (k.health || 70) * .1 + (k.looks || 50) * .08 + edu * .14 + Math.max(-10, Math.min(10, (k.aff || 0) / 8)) + pers + job + deg - 8;
    v = Math.round(G.clamp(v, 1, 99));
    return { v: v, g: v >= 85 ? 'S' : v >= 72 ? 'A' : v >= 58 ? 'B' : v >= 45 ? 'C' : 'D' };
  };

  /* ================= everyone lives a life of their own ================= */
  function story(n, t, prm) { n.story = n.story || []; n.story.push([S().year, G.L(t, prm || {})]); if (n.story.length > 12) n.story.shift(); }
  G.npcStory = story;
  var nt7 = N.tick;
  N.tick = function () {
    var r = nt7.apply(this, arguments), s = S(), p = s.p;
    N.all(function (n) { return n.alive && (n.pin || n.aff >= 50) && n.rel !== 'grandchild'; }).forEach(function (n) {
      var a = N.age(n); if (a < 6 || !G.ch(a < 18 ? .25 : .3)) return;
      if (a < 18) { story(n, G.pick(['{n}在学校拿了奖状。|{n} won a certificate at school.', '{n}交到了一个最好的朋友。|{n} made a best friend.', '{n}迷上了画画。|{n} fell in love with drawing.', '{n}第一次参加了夏令营。|{n} went to summer camp for the first time.', '{n}期末考进了班级前十。|{n} finished in the top ten of the class.']), { n: n.name }); return; }
      var opts = [];
      if (a < 62 && n.job) opts.push(['{n}升职了，现在是部门里的骨干。|{n} got promoted and is now a key person in the department.', function () { n.inc = Math.round((n.inc || G.$w(30000)) * 1.15); }]);
      if (a < 55) opts.push(['{n}换了一份新工作。|{n} changed jobs.', function () { n.inc = Math.round((n.inc || G.$w(30000)) * G.rf(.9, 1.3)); }]);
      if (a >= 25 && a < 60 && (n.wealth || 0) > G.$(50000)) opts.push(['{n}买了房子，搬了新家。|{n} bought a home and moved in.', function () { n.wealth -= G.$(30000); }]);
      if (a >= 22 && a < 45 && !n.married && ['spouse', 'lover', 'affair', 'admirer', 'crush', 'ex'].indexOf(n.rel) < 0 && n.rel !== 'child') opts.push(['{n}结婚了。|{n} got married.', function () { n.married = 1; }]);
      if (n.married && a < 45 && (n.nkids || 0) < 3 && n.rel !== 'child') opts.push(['{n}当上了爸爸/妈妈。|{n} became a parent.', function () { n.nkids = (n.nkids || 0) + 1; }]);
      opts.push(['{n}去了一趟远门旅行。|{n} went on a long trip.', null]);
      if (a >= 50) opts.push(['{n}查出了一点小毛病，开始注意身体。|{n} got a minor diagnosis and started looking after their health.', function () { n.health = Math.max(5, (n.health || 70) - 6); }]);
      if (a >= 60 && n.job && !n.retired) opts.push(['{n}退休了。|{n} retired.', function () { n.retired = 1; }]);
      var x = G.pick(opts); if (x[1]) x[1](); story(n, x[0], { n: n.name });
    });
    return r;
  };
  var info7 = G.npcInfo;
  G.npcInfo = function (n) {
    var r = info7.apply(this, arguments) || [];
    if (n.rel === 'child' && n.alive) { var sc = G.kidScore(n); r.push(['综合潜力|Potential', sc.g + ' · ' + sc.v + G.T('（学习、性格、事业综合）| (study, character, career)')]); }
    if (n.story && n.story.length) r.push(['人生经历|Their life lately', n.story.slice(-4).reverse().map(function (x) { return x[0] + ' ' + G.T(x[1]); }).join('\n')]);
    if (n.studyIn && G.C[n.studyIn]) r.push(['留学|Studying in', G.C[n.studyIn].flag + ' ' + G.T(G.C[n.studyIn].n) + G.T('（学生签证）| (student visa)')]);
    return r;
  };

  /* ================= children marry within their world; some move abroad on their own ================= */
  var ELITE_JOBS = { rich: ['投资人|Investor', '集团副总裁|Group Vice President', '律所合伙人|Law Firm Partner', '外科医生|Surgeon'], red: ['处长|Division Chief', '外交官|Diplomat', '国企高管|State Firm Executive'], royal: ['公爵|Duke', '伯爵|Count', '外交官|Diplomat'], noble: ['庄园主|Estate Owner', '投资人|Investor'], celeb: ['演员|Actor', '歌手|Singer'] };
  G.kidSpouse = function (k, a) {
    var p = S().p, cls = G.famClass ? G.famClass() : 1, tag = null;
    if (p.flags.monarch || (p.origin === 'royal' && !p.flags.exRoyal)) tag = G.ch(.5) ? 'royal' : 'noble';
    else if (p.origin === 'red' && cls >= 2) tag = 'red';
    else if (p.origin === 'noble' && cls >= 2) tag = 'noble';
    else if (cls >= 2 || (k.wealth || 0) > G.$(1e6)) tag = 'rich';
    else if (p.st.fame >= 75) tag = G.ch(.5) ? 'celeb' : null;
    var sp = N.make({ rel: 'contact', g: k.g === 'm' ? 'f' : 'm', age: a + G.ri(-3, 3), c: k.c || p.country });
    if (tag) { sp.tags = [tag === 'noble' ? 'rich' : tag]; sp.wealth = G.$(G.ri(tag === 'royal' ? 50 : 10, tag === 'royal' ? 500 : 200) * 1e5); sp.job = G.pick(ELITE_JOBS[tag] || ELITE_JOBS.rich); sp.looks = Math.max(sp.looks || 50, G.ri(55, 85)); story(sp, '{n}出身{x}。|{n} comes from {y}.', { n: sp.name, x: { royal: '王室|', noble: '名门望族|', red: '权贵之家|', rich: '豪门|', celeb: '演艺世家|' }[tag], y: { royal: 'royalty', noble: 'an old aristocratic family', red: 'a powerful political family', rich: 'a wealthy family', celeb: 'a family of entertainers' }[tag] }); }
    return sp;
  };
  var BEST = ['us', 'ch', 'sg', 'au', 'ca', 'gb', 'de', 'nz', 'jp'];
  function kidPick(k) { var p = S().p; return BEST.filter(function (c) { return c !== (k.c || p.country) && G.C[c] && !(G.rivalBlock && G.rivalBlock(c)); }); }
  var ft7 = FA.tick;
  FA.tick = function (Q) {
    var r = ft7.apply(this, arguments), s = S(), p = s.p;
    N.rel('child').forEach(function (k) {
      if (!k.alive) return; var a = N.age(k);
      // ambitious grown children with money go where they think life is best
      if (a >= 23 && a <= 45 && !k.emig && ((k.wealth || 0) > G.$(150000) || (k.smarts || 0) > 78) && G.ch(.025)) {
        var cs = kidPick(k); if (cs.length) { var c = cs[0 + G.ri(0, Math.min(2, cs.length - 1))]; k.emig = 1; k.c = c; k.cits = k.cits || [p.country]; k.visa = k.visa || {}; k.visa[c] = 'work'; story(k, '{n}自己办好了手续，移民去了{c}。|{n} sorted out the paperwork alone and emigrated to {c}.', { n: k.name, c: G.C[c].n }); G.log('{n}没让你操心，自己移民去了{c}。|{n} didn\'t ask for your help — and emigrated to {c} on their own.', { n: k.name, c: G.C[c].n }); var sp = k.spouseId && s.npcs[k.spouseId]; if (sp) sp.c = c; }
      }
      // children say where they want to go
      if (a >= 16 && a <= 28 && !k.asked && !k.emig && (k.smarts || 0) > 55 && G.ch(.06)) { k.asked = 1; Q.push({ id: 'k_want_abroad', nid: k.id }); }
      if (k.studyIn && a > 24) k.studyIn = null;
    });
    // a famous spouse makes you famous too
    var sp = N.spouse(); if (sp && sp.alive && ((sp.tags || []).indexOf('celeb') >= 0 || (sp.fame || 0) >= 60)) { G.addStat('fame', G.ri(1, 2), true); if (!p.flags.celebSpouse) { p.flags.celebSpouse = 1; G.log('嫁娶了明星，你的名字也开始出现在新闻里。|Married to a star — your own name started showing up in the news.'); } }
    // royal blood through a spouse
    if (sp && sp.alive && (sp.tags || []).indexOf('royal') >= 0) N.rel('child').forEach(function (k) { if (k.alive && !k.royalLine) k.royalLine = sp.c || p.country; });
    N.rel('child').forEach(function (k) { if (k.alive && k.royalLine && !k.crowned && N.age(k) >= 18 && G.ch(.03)) Q.push({ id: 'k_throne', nid: k.id }); });
    // the trust advisor comes calling at 30 and at 50
    if ((p.age === 30 || p.age === 50 || p.age === 40) && !p.jail && G.netWorth() > G.$(1.5e6) && !(p.flags.trustAsk || {})[p.age]) { p.flags.trustAsk = p.flags.trustAsk || {}; p.flags.trustAsk[p.age] = 1; Q.push({ id: 'fin_trust' }); }
    // studying abroad ends
    if (!G.school.isStudent() && (p.flags.studyIn || p.edu.abroad) && !p.flags.abroadAsked) { p.flags.abroadAsked = 1; p.flags.abroadDone = p.edu.abroad || p.flags.studyIn; p.flags.studyIn = null; if (p.flags.abroadDone !== p.country) Q.push({ id: 'abroad_done' }); }
    // a trust pays every year
    var tr = s.assets.trust; if (tr && tr.amt > 0) { var y = Math.round(tr.amt * tr.rate); p.money += y; if (G.fin) G.fin.add('in', '家族信托收益|Family trust income', y); }
    return r;
  };
  G.evs([
    { id: 'k_want_abroad', sys: 1, title: function (c) { return G.L('{n}有话想说|{n} Has Something to Say', { n: c.npc.name }); }, icon: '🌍',
      prep: function (c) { var k = c.npc; if (!k || !k.alive) return false; var cs = kidPick(k); if (!cs.length) return false; c.to = G.pick(cs.slice(0, 4)); c.prm.c = G.C[c.to].n; c.cost = G.$(G.ri(4, 9) * 10000); c.prm.m = G.M(c.cost); c.prm.n = k.name; c.study = N.age(k) < 23; },
      t: function (c) { return c.study ? '{n}鼓起勇气说：“我想去{c}读书。”大概要{m}。|{n} gathers the courage to say: "I want to study in {c}." It\'ll cost about {m}.' : '{n}说：“我想去{c}发展，那边机会更多。”办手续大概要{m}。|{n} says: "I want to build a life in {c} — there are more chances there." The paperwork will cost about {m}.'; },
      o: [
        { t: '支持！钱我来出|Go for it — I\'ll pay', run: async function (c) { if (!(await G.kidPayAsk(c.npc, c.cost))) return '这笔钱一时凑不出来。|The money couldn\'t be found right now.'; var k = c.npc; k.visa = k.visa || {}; k.visa[c.to] = c.study ? 'study' : 'work'; if (c.study) k.studyIn = c.to; else { k.c = c.to; k.emig = 1; } G.dPush('aff', N.addAff(k, G.ri(8, 14))); story(k, c.study ? '{n}去{c}留学了。|{n} went to study in {c}.' : '{n}去{c}发展了。|{n} moved to {c} to build a life.', { n: k.name, c: G.C[c.to].n }); return '{n}抱住了你。|{n} threw their arms around you.'; } },
        { t: '支持，但让{n}自己想办法|Support it, but {n} pays their own way', run: function (c) { var k = c.npc; if ((k.wealth || 0) >= c.cost) { k.wealth -= c.cost; k.visa = k.visa || {}; k.visa[c.to] = c.study ? 'study' : 'work'; if (c.study) k.studyIn = c.to; else { k.c = c.to; k.emig = 1; } G.dPush('aff', N.addAff(k, 2)); return '{n}用自己攒的钱去了{c}。|{n} went to {c} on their own savings.'; } G.dPush('aff', N.addAff(k, -3)); return '{n}的钱不够，只好先放一放。|{n} didn\'t have enough and had to put it off.'; } },
        { t: '不同意|No', run: function (c) { G.dPush('aff', N.addAff(c.npc, -8)); return '{n}回了自己房间，一晚上没出来。|{n} went to their room and didn\'t come out all night.'; } }
      ] },
    { id: 'k_throne', sys: 1, title: '王位的召唤|The Throne Calls', icon: '👑',
      prep: function (c) { var k = c.npc; if (!k || !k.alive || k.crowned) return false; c.prm.n = k.name; c.prm.c = G.C[k.royalLine] ? G.C[k.royalLine].n : ''; },
      t: '{c}王室传来消息：王位后继无人，流着王室血脉的{n}被确认为继承人。|Word from the royal house of {c}: with no other heir, {n}, who carries royal blood, has been confirmed as successor.',
      o: [
        { t: '让{n}去继承王位|Let {n} take the throne', run: function (c) { var k = c.npc; k.crowned = 1; k.job = k.g === 'm' ? '国王|King' : '女王|Queen'; k.wealth = (k.wealth || 0) + G.$(5e7); k.tags = ['royal']; c.add('fame', 10); G.major('{n}登基|{n} took the throne', { n: k.name }); story(k, '{n}登基成为{c}的君主。|{n} was crowned monarch of {c}.', { n: k.name, c: c.prm.c }); return '加冕礼那天，你坐在第一排，哭得像个孩子。|On coronation day you sat in the front row and cried like a child.'; } },
        { t: '劝{n}放弃，过普通人的日子|Talk {n} into a normal life', run: function (c) { c.npc.royalLine = null; G.dPush('aff', N.addAff(c.npc, -4)); return '{n}放弃了继承权。|{n} renounced the claim.'; } }
      ] },
    { id: 'fin_trust', sys: 1, title: '家族信托|A Family Trust', icon: '🏦',
      prep: function (c) { c.amt = Math.round(Math.max(0, c.p.money) * .5); if (c.amt < G.$(3e5)) return false; c.prm.m = G.M(c.amt); c.prm.y = G.M(Math.round(c.amt * .045)); c.prm.b = G.M(Math.round(c.amt * .03)); },
      t: '私人银行的顾问约你喝茶：“{m}放进家族信托，每年稳定拿{y}，钱还能安全传给孩子。”|Your private banker invites you to tea: "Put {m} into a family trust — a steady {y} a year, and it passes safely to your children."',
      o: [
        { t: '设立家族信托（每年约{y}）|Set up the trust (about {y} a year)', run: function (c) { var s = S(); c.money(-c.amt); s.assets.trust = s.assets.trust || { amt: 0, rate: .045 }; s.assets.trust.amt += c.amt; G.major('设立家族信托|Set up a family trust'); return '签完字，你感觉肩上轻了一点。|After signing, your shoulders felt a little lighter.'; } },
        { t: '买稳健的国债基金（每年约{b}，随时能取）|Buy a safe bond fund (about {b} a year, withdraw anytime)', run: function (c) { var s = S(); c.money(-c.amt); s.assets.trust = s.assets.trust || { amt: 0, rate: .03 }; s.assets.trust.amt += c.amt; s.assets.trust.rate = Math.min(s.assets.trust.rate, .03); return '你把钱放进了最稳妥的地方。|You put the money somewhere very safe.'; } },
        { t: '算了，钱放在手里踏实|No thanks — I like my money close', run: function () { return '你礼貌地谢绝了。|You politely declined.'; } }
      ] }
  ]);
  // the trust counts toward what you own and passes on
  var nw0 = G.netWorth;
  G.netWorth = function () { var v = nw0.apply(this, arguments), s = S(); return v + (s && s.assets && s.assets.trust ? s.assets.trust.amt || 0 : 0); };

  /* ================= marriage that holds for practical reasons ================= */
  G.keepForMoney = function (sp) { var nw = G.netWorth(); return nw >= G.$(8e5) && nw > Math.max(1, sp.wealth || 0) * 3 && (sp.loyal || 50) < 90; };

  /* ================= the life you were, leaving it all to you ================= */
  var inh7 = FA.inherit;
  FA.inherit = function (dead) {
    if (dead && dead.wasYou && dead.legacy) {
      var total = Math.max(dead.wealth || 0, dead.legacy); dead.wealth = 0; dead.legacy = 0;
      G.addMoney(total); G.inc('inherit', total);
      G.log('上一世的你立下了遗嘱：全部遗产{m}都留给你。|The person you used to be left a will: the whole estate, {m}, goes to you.', { m: G.M(total) });
      return total;
    }
    return inh7.apply(this, arguments);
  };
  var reb7 = G.life.rebirthAs;
  if (reb7) G.life.rebirthAs = function (kid) {
    var nw = Math.max(0, G.netWorth()), willToKid = true;
    var s = reb7.apply(this, arguments);
    var me = N.all(function (n) { return n.wasYou; })[0]; if (me && willToKid) me.legacy = nw;
    return s;
  };

  /* ================= small corrections ================= */
  // no more chat: no messages, no inbox
  N.pushChat = function () { };
  if (G.chat) G.chat.unread = function () { return 0; };
  var acts7 = G.npcActs;
  G.npcActs = function (n) { return (acts7.apply(this, arguments) || []).filter(function (a) { return a.id !== 'chat'; }); };
  // seeing a doctor and getting treated cost no energy; supporting family costs none either
  (G.ACT_CATS || []).forEach(function (c) { (c.items || []).forEach(function (a) { if (c.id === 'health' && !/gym|run|yoga|diet|plastic|sport|fit|swim|marathon/.test(a.id)) a.e = 0; }); });
  var acts7b = G.npcActs;
  G.npcActs = function (n) { var L = acts7b.apply(this, arguments) || []; L.forEach(function (a) { if (['support', 'allow', 'kallow', 'gift'].indexOf(a.id) >= 0) a.e = 0; }); return L; };
  // a star doesn't sign up for after-school clubs and calligraphy classes
  (G.ACT_CATS || []).forEach(function (c) { (c.items || []).forEach(function (a) { if (a.id === 'club') { var if0 = a.if; a.if = function () { if (S().p.st.fame >= 70) return false; return if0 ? if0.apply(this, arguments) : true; }; } }); });
  ['o_college', 'or_m_classes'].forEach(function (id) { var d = G.EV[id]; if (!d) return; var if0 = d.if; d.if = function (S2, p) { if (p && p.st && p.st.fame >= 70) return false; return if0 ? if0.apply(this, arguments) : true; }; });
})();
