/* Your children's own lives: which school they attend (and what it costs), a yearly allowance,
   study abroad, and real careers that keep going — so when you play on as one of them, their job comes with them. */
(function () {
  'use strict';
  var N = G.N, FA = G.family, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function pr(k) { return { n: k.name }; }
  function res(a, t, prm, dl) { return G.result(a.n, t, prm, dl || [], a.i); }
  var ABROAD = ['us', 'gb', 'ca', 'au', 'sg', 'jp', 'de', 'fr'];

  /* ---------------- schools ---------------- */
  var SCH = G.KSCHOOL = {
    pub: { n: '公立学校|Public School', i: '🏫', fee: 0, sm: .3, perf: 0, d: '免费，离家近，同学来自各行各业。|Free and close to home; classmates from every walk of life.' },
    key: { n: '重点学校|Top Public School', i: '🏅', fee: 1500, once: 15000, sm: 1.4, perf: 6, test: 55, d: '升学率高、竞争激烈。要有学区房或交一笔择校费，还得通过入学考试。|Top results and fierce competition. Needs a school-district home or a one-off fee — and an entrance test.' },
    priv: { n: '私立学校|Private School', i: '🎒', fee: 12000, sm: .9, perf: 3, eq: 1, d: '小班教学，设施一流，家长非富即贵。|Small classes, top facilities, well-connected parents.' },
    intl: { n: '国际学校|International School', i: '🌐', fee: 30000, sm: .8, perf: -2, eq: 1.4, abroad: .8, d: '全英文授课，直通海外大学；学费惊人，也会和本地升学体系脱节。|Taught in English, a pipeline to universities abroad — at a staggering price, and out of step with the local exam system.' },
    board: { n: '寄宿学校|Boarding School', i: '🛏️', fee: 14000, sm: 1.1, perf: 4, aff: -3, d: '封闭管理，独立自律，但一年见不了几次面。|Strict and self-reliant — but you\'ll barely see them.' },
    abroad: { n: '出国读中学|Secondary School Abroad', i: '✈️', fee: 50000, sm: 1.1, perf: 0, eq: 1, abroad: .95, aff: -4, minA: 12, d: '小留学生：语言和眼界飞速提升，但孤独和文化冲击也很大。|A young international student: language and horizons grow fast — so do loneliness and culture shock.' }
  };
  function feeOf(k, id) { return id === 'pub' ? 0 : G.$w(SCH[id].fee, k.c || S().p.country); }
  function inSchool(k) { var e = k.edu; return e && ['kinder', 'primary', 'middle', 'high', 'voc', 'none'].indexOf(e.stage) >= 0 && N.age(k) < 18 && N.age(k) >= 3; }

  /* ---------------- careers ---------------- */
  var RANKP = ['', '资深|Senior ', '主管·|Lead ', '经理·|Manager · ', '总监·|Director · '];
  function jobName(k) { var b = k.jobBase || k.jobT; if (!b) return k.job; var p = RANKP[k.jr || 0]; if (!p) return b; var z = b.split('|'); var q = p.split('|'); return q[0] + z[0] + '|' + q[1] + (z[1] || z[0]); }

  /* ---------------- actions on a child's profile ---------------- */
  var acts0 = G.npcActs;
  G.npcActs = function (n) {
    var out = acts0.apply(this, arguments), p = S().p;
    if (!n.alive || p.jail || (n.rel !== 'child' && n.rel !== 'grandchild')) return out;
    var a = N.age(n), add = [];
    // the old one-off allowance and the duplicate study-abroad button give way to the new ones
    out = out.filter(function (x) { return x.id !== 'allow' && !(x.id === 'abroad' && /留学\|Send to Study Abroad/.test(x.n)); });
    if (a >= 3 && a <= 17 && inSchool(n) && n.rel === 'child') add.push({ id: 'kschool', n: '选择学校|Choose a School', i: '🏫', e: 10, run: async function (k, act) {
      var ids = Object.keys(SCH).filter(function (id) { return !SCH[id].minA || a >= SCH[id].minA; });
      var cur = k.sch || 'pub';
      var items = ids.map(function (id) { var f = feeOf(k, id); return { t: SCH[id].n, icon: SCH[id].i, sub: (id === cur ? G.T('（当前）|(current) ') : '') + G.T(f ? G.L('每年{m}|{m} / year', { m: G.M(f) }) : '免费|Free') + ' · ' + G.T(SCH[id].d), dis: id === cur || p.money < f }; });
      var i = await G.UI.pick({ title: G.L('{n}去哪里上学？|Where should {n} go to school?', pr(k)), items: items });
      if (i < 0) return 'cancel';
      var id = ids[i], s = SCH[id], f = feeOf(k, id);
      if (id === 'key') {
        var dist = S().assets.houses.some(function (h) { return h.school; });
        if (!dist) { var once = G.$w(s.once, k.c || p.country); if (!(await G.UI.confirm(G.L(s.n), G.L('你没有学区房，需要交一笔{m}的择校费。|You don\'t own a school-district home, so there\'s a one-off fee of {m}.', { m: G.M(once) })))) return 'cancel'; if (!G.pay(once)) { G.UI.toast('钱不够|Not enough money'); return 'cancel'; } }
        if (k.smarts + G.ri(-10, 10) < s.test) { G.dStart(); G.dPush('aff', N.addAff(k, -4)); var dl0 = G.dEnd(); return res(act, '{n}没通过入学考试。{x}|{n} failed the entrance test.{x}', { n: k.name, x: dist ? '' : G.L('择校费不退。| The fee is non-refundable.') }, dl0); }
      }
      if (id === 'abroad') {
        var ci = await G.UI.pick({ title: G.L('去哪个国家？|Which country?'), items: ABROAD.filter(function (c) { return c !== p.country; }).map(function (c) { return { t: G.C[c].n, icon: G.C[c].flag }; }) });
        if (ci < 0) return 'cancel';
        k.schC = ABROAD.filter(function (c) { return c !== p.country; })[ci];
      }
      if (f && !G.payKid(k, f)) { G.UI.toast('钱不够|Not enough money'); return 'cancel'; }
      var like = id === 'pub' ? .7 : id === 'board' || id === 'abroad' ? (k.pers === 'rebel' || k.pers === 'clingy' ? .2 : .5) : .7;
      k.sch = id; k.schY = S().year; k.schPaid = S().year;
      G.dStart(); G.dPush('aff', N.addAff(k, id === 'board' || id === 'abroad' ? (G.ch(like) ? 3 : -4) : G.ri(2, 5))); var dl = G.dEnd();
      if (id !== 'pub') G.log('{n}转到了{s}。|{n} moved to {s}.', { n: k.name, s: s.n });
      var t = id === 'abroad' ? '机场里，{n}拖着比自己还高的行李箱，回头冲你挥了挥手。|At the airport, {n} dragged a suitcase taller than they were, then turned and waved.'
        : id === 'board' ? '你把{n}送到了寄宿学校。走的时候，{n}没有哭，你却哭了。|You dropped {n} at boarding school. {n} didn\'t cry — you did.'
        : id === 'intl' ? '{n}第一天就交了来自五个国家的朋友。|On day one, {n} made friends from five countries.'
        : id === 'pub' ? '{n}回到了家附近的公立学校。|{n} is back at the public school near home.'
        : '{n}背着新书包，走进了新学校。|{n} walked into the new school with a brand-new backpack.';
      return res(act, t, pr(k), dl);
    } });
    if (a >= 0) add.push({ id: 'kallow', n: n.allow ? '调整每月零花钱|Change Monthly Allowance' : '每月给零花钱|Give a Monthly Allowance', i: '🪙', e: 0, run: async function (k, act) {
      var base = a < 12 ? G.$(25) : a < 18 ? G.$(120) : G.$(700);
      var v = await G.UI.amount({ title: G.L('每月给{n}多少零花钱？|How much should {n} get each month?', pr(k)), text: G.L('每个月自动从你的账户里给。填0就是停掉。|Paid automatically every month. Enter 0 to stop.'), max: Math.max(Math.round(p.money / 12), base * 40), presets: [], def: k.allow ? Math.round(k.allow / 12) : base, zero: true });
      if (v == null) return 'cancel';
      var old = k.allow || 0; k.allow = Math.max(0, Math.round(v)) * 12;
      G.dStart(); G.dPush('aff', N.addAff(k, k.allow > old ? G.clamp(3 + Math.log2(k.allow / (base * 12) + 1) * 2, 2, 12) : k.allow < old ? -8 : 0)); var dl = G.dEnd();
      return res(act, !k.allow ? '你停掉了{n}的零花钱。|You stopped {n}\'s allowance.' : k.allow > base * 72 ? '{n}每个月的零花钱比很多大人的工资还多。|{n}\'s monthly allowance is more than many grown-ups earn.' : '从这个月起，{n}每月有{m}零花钱。|From this month on, {n} gets {m} a month.', { n: k.name, m: G.M(Math.round(k.allow / 12)) }, dl);
    } });
    if (a >= 22 && (n.unemp || !n.jobT) && n.rel === 'child' && (G.famClass ? G.famClass() >= 2 : G.netWorth() > G.$(3e6))) add.push({ id: 'kjob', n: '托关系安排工作|Pull Strings for a Job', i: '🤝', e: 15, run: async function (k, act) {
      var good = G.pick([['投资公司分析师|Investment Analyst', 140000], ['国企管理岗|State Enterprise Manager', 90000], ['律所助理|Law Firm Associate', 110000], ['家族企业副总|Family Firm VP', 220000]]);
      k.jobBase = good[0]; k.jobT = good[0]; k.jr = 0; k.jy = 0; k.unemp = 0; k.inc = G.$w(good[1], k.c); k.job = jobName(k); k.connected = 1;
      G.dStart(); G.dPush('aff', N.addAff(k, k.pers === 'proud' || k.pers === 'rebel' ? -5 : 8)); var dl = G.dEnd();
      return res(act, '一个电话，{n}就成了{j}。|One phone call and {n} became a {j}.', { n: k.name, j: good[0] }, dl);
    } });
    var bi = out.map(function (x) { return x.id; }).indexOf('block'); if (bi < 0) bi = out.length;
    return out.slice(0, bi).concat(add, out.slice(bi));
  };

  /* ---------------- yearly ---------------- */
  var grow = FA.growKid;
  FA.growKid = function (k, Q) {
    var p = S().p, a = N.age(k), s = SCH[k.sch || 'pub'] || SCH.pub;
    if (!k.alive) return grow.apply(this, arguments);
    // tuition
    if (k.sch && k.sch !== 'pub' && a < 18 && k.schPaid !== S().year) {
      var f = feeOf(k, k.sch);
      if (p.jail || (p.flags.blacklist && S().year < p.flags.blacklist) || !G.payKid(k, f)) { G.log('交不起{s}的学费，{n}只好转回了公立学校。|You couldn\'t pay {s}\'s fees, so {n} had to move back to public school.', { s: s.n, n: k.name }); k.sch = 'pub'; N.addAff(k, -8); s = SCH.pub; }
      else k.schPaid = S().year;
    }
    // the school shapes them
    if (a >= 5 && a < 18) {
      // better schools grow every talent faster
      var q = { pub: 1, key: 2.2, priv: 2, intl: 2, board: 2, abroad: 2.1 }[k.sch || 'pub'] || 1;
      k.smarts = G.clamp(k.smarts + (s.sm || 0) * 1.6 * G.rf(.5, 1), 1, 100);
      if (q > 1) { k.eq = G.clamp((k.eq || 50) + .4 * q * G.rf(.4, 1), 1, 100); k.health = G.clamp((k.health || 70) + .2 * q * G.rf(0, 1), 1, 100); if (k.edu) k.edu.perf = G.clamp((k.edu.perf || 50) + q * .6, 0, 100); }
      if (k.edu) k.edu.perf = G.clamp((k.edu.perf || 50) + (s.perf || 0) * .5, 0, 100);
      if (s.eq) k.eq = G.clamp((k.eq || 50) + s.eq * G.rf(.3, 1), 1, 100);
      if (s.aff) N.addAff(k, s.aff);
    }
    // international kids head abroad for university instead of sitting the local exam
    if (a === 18 && s.abroad && k.edu && !k.edu.abroad && G.ch(s.abroad)) {
      var c = k.schC || G.pick(ABROAD.filter(function (x) { return x !== p.country; })), cost = G.$(140000);
      if (G.pay(cost)) {
        var tier = G.clamp(Math.round(2 + k.smarts / 27 + G.rf(-.6, .6)), 2, 5), u = G.pick(G.eduSys(c).u.filter(function (x) { return x.t === tier; })) || G.pick(G.eduSys(c).u);
        k.edu.abroad = c; k.edu.abroadSchool = u.n; k.edu.abroadTier = u.t; k.abroadPlan = 1;
      } else G.log('学费太贵，{n}没能出国，只能参加国内考试。|Fees were too high; {n} couldn\'t go abroad and sat the local exam instead.', pr(k));
    }
    if (k.sch && a >= 18) { k.sch = null; k.schC = null; }
    // allowance
    if (k.allow && !p.jail) {
      if (G.pay(k.allow)) {
        k.wealth = (k.wealth || 0) + k.allow; N.addAff(k, G.ri(1, 3));
        var lim = (a < 12 ? G.$(800) : a < 18 ? G.$(4000) : G.$(30000));
        if (k.allow > lim * 2 && a < 22) { k.spoiled = (k.spoiled || 0) + 1; if (k.spoiled === 3 && k.pers !== 'gold' && k.pers !== 'spend') { k.pers = G.ch(.5) ? 'spend' : 'gold'; G.log('零花钱太多，{n}被宠坏了，花钱如流水。|Too much pocket money — {n} is spoiled and spends like water.', pr(k)); } }
      } else { G.log('你没钱再给{n}零花钱了。|You can\'t afford {n}\'s allowance anymore.', pr(k)); k.allow = 0; N.addAff(k, -5); }
    }
    var r = grow.apply(this, arguments);
    career(k, Q);
    return r;
  };
  function career(k, Q) {
    var a = N.age(k), p = S().p;
    if (a < 19 || !k.alive) return;
    if (k.jobT && !k.jobBase && !k.unemp) { k.jobBase = k.jobT; k.jr = 0; k.jy = 0; // spoiled kids may never leave home
      if ((k.spoiled || 0) >= 3 && G.ch(.4)) { k.neet = 1; k.unemp = 1; k.job = '啃老族|Living off Mom and Dad'; k.inc = 0; return; } }
    if (!k.jobBase) return;
    if (a >= (G.C[k.c || p.country].retire || 60) + 2) { if (k.job !== '退休|Retired') { k.job = '退休|Retired'; k.inc = Math.round((k.inc || 0) * .45); } return; }
    if (k.unemp) {
      if (k.neet) { if (G.ch(.15)) { k.neet = 0; k.unemp = 0; k.job = jobName(k); k.inc = G.$w(30000, k.c); G.log('{n}终于出去找了份工作。|{n} finally went out and got a job.', pr(k)); } else if (G.ch(.5)) Q.push({ id: 'k_neet', nid: k.id }); return; }
      if (G.ch(.55)) { k.unemp = 0; k.inc = Math.round(Math.max(G.$w(25000, k.c), (k.inc0 || G.$w(35000, k.c)) * G.rf(.8, 1.05))); k.job = jobName(k); G.log('{n}找到了新工作。|{n} found a new job.', pr(k)); }
      return;
    }
    k.jy = (k.jy || 0) + 1; k.inc = Math.round((k.inc || 0) * G.rf(1.01, 1.05));
    var tier = (k.edu && k.edu.tier) || 0;
    if ((k.jr || 0) < 4 && k.jy >= 2 && G.ch(.08 + k.smarts / 700 + tier * .02 + (k.eq || 50) / 1200 + (k.connected ? .05 : 0))) {
      k.jr = (k.jr || 0) + 1; k.inc = Math.round(k.inc * G.rf(1.2, 1.45)); k.job = jobName(k);
      G.log('{n}升职了，现在是{j}。|{n} was promoted to {j}.', { n: k.name, j: k.job }); N.addAff(k, 2);
    } else if (G.ch(.025 + (k.smarts < 40 ? .03 : 0)) && a < 55) {
      k.unemp = 1; k.inc0 = k.inc; k.inc = 0; k.job = '待业|Between Jobs';
      Q.push({ id: 'k_laidoff', nid: k.id });
    } else if (!k.founder && a >= 26 && a <= 45 && G.ch(.012 + (k.pers === 'ambit' || k.pers === 'brave' ? .02 : 0))) {
      Q.push({ id: 'k_startup', nid: k.id });
    }
  }
  // keep the displayed title in sync for kids who got their job before this update
  var info0 = G.npcInfo;
  G.npcInfo = function (n) {
    var rows = info0.apply(this, arguments);
    if (n.rel === 'child' || n.rel === 'grandchild') {
      if (n.sch && N.age(n) < 18) rows.unshift(['就读|Attends', G.T(SCH[n.sch].n) + (n.schC ? ' ' + G.C[n.schC].flag : '')]);
      if (n.jobBase && n.jy) rows.push(['工龄|Years working', G.L('{y}年|{y} yr', { y: n.jy })]);
    }
    return rows;
  };

  /* ---------------- their lives come to you ---------------- */
  function kidEv(c) { if (!c.npc || !c.npc.alive) return false; c.prm.n = c.npc.name; }
  G.evs([
    { id: 'k_neet', sys: 1, title: '啃老|Living off You', icon: '🛋️', bad: 1, prep: kidEv,
      t: '{n}又找你要钱了。快三十岁的人，每天在家睡到中午，打一整晚游戏。|{n} is asking for money again. Nearly thirty, sleeping till noon and gaming all night.',
      o: [
        { t: '给吧，自己的孩子|Give it — they\'re your child', run: function (c) { var m = c.$(G.ri(3, 10) * 1000); var g = Math.min(Math.max(0, c.p.money), m); c.money(-g); c.npc.wealth += g; G.dPush('aff', N.addAff(c.npc, 4)); c.add('happy', -3); return '你转了钱。{n}说了声“谢了”，又关上了房门。|You sent the money. {n} muttered "thanks" and shut the door.'; } },
        { t: '断供，逼TA出去工作|Cut them off and make them work', run: function (c) { var k = c.npc; G.dPush('aff', N.addAff(k, -15)); if (G.ch(.45)) { k.neet = 0; k.unemp = 0; k.inc = G.$w(28000, k.c); k.job = jobName(k); k.allow = 0; return '{n}摔门而去。三个月后，{n}发来消息：“我找到工作了。”|{n} stormed out. Three months later: "I got a job."'; } k.allow = 0; return '{n}说你“根本不爱我”，跑去亲戚家住了。|{n} said you "never loved me" and went to stay with relatives.'; } },
        { t: '帮TA开个小店|Set them up with a small shop', run: function (c) { var k = c.npc, m = c.$(50000); if (!c.pay(m)) return '你拿不出这笔钱。|You couldn\'t afford it.'; if (G.ch(.4 + k.smarts / 300)) { k.neet = 0; k.unemp = 0; k.jobBase = '店老板|Shop Owner'; k.jr = 0; k.inc = G.$w(45000, k.c); k.job = jobName(k); G.dPush('aff', N.addAff(k, 12)); return '小店居然经营得有模有样！|The shop is actually doing well!'; } G.dPush('aff', N.addAff(k, 3)); return '不到一年，店就倒闭了。|The shop closed within a year.'; } }
      ] },
    { id: 'k_laidoff', sys: 1, title: '孩子失业了|Your Child Lost Their Job', icon: '📦', bad: 1, prep: kidEv,
      t: '{n}打来电话，声音有点哑：“公司裁员，我被裁了。”|{n} calls, voice hoarse: "The company had layoffs. I\'m out."',
      o: [
        { t: '安慰TA，慢慢找|Comfort them — take your time', run: function (c) { G.dPush('aff', N.addAff(c.npc, 6)); return '“家里永远有你一口饭吃。”|"There\'s always a seat at our table for you."'; } },
        { t: '给一笔钱过渡|Send money to tide them over', run: function (c) { var m = Math.min(Math.max(0, c.p.money), c.$(G.ri(5, 15) * 1000)); c.money(-m); c.npc.wealth += m; G.dPush('aff', N.addAff(c.npc, 10)); return '{n}收下了钱，说一定会还你。|{n} took the money and promised to pay you back.'; } },
        { t: '动用人脉帮TA找工作|Use your connections', if: function (c) { return G.famClass() >= 2 || (c.p.gov && c.p.gov.rank >= 2) || c.S.assets.company; }, run: function (c) { var k = c.npc; k.unemp = 0; k.inc = Math.round((k.inc0 || G.$w(40000, k.c)) * 1.1); k.job = jobName(k); k.connected = 1; G.dPush('aff', N.addAff(k, 5)); return '一个星期后，{n}在朋友的公司上班了。|A week later, {n} started at a friend\'s company.'; } },
        { t: '“早叫你别选那个行业”|"I told you not to go into that field"', run: function (c) { G.dPush('aff', N.addAff(c.npc, -10)); return '{n}挂了电话。|{n} hung up.'; } }
      ] },
    { id: 'k_startup', sys: 1, title: '孩子要创业|Your Child Wants to Start a Business', icon: '🚀', prep: function (c) { if (kidEv(c) === false) return false; c.amt = c.$(G.ri(5, 30) * 10000); c.prm.m = G.M(c.amt); },
      t: '{n}兴冲冲地拿着商业计划书来找你，想辞职创业，需要{m}启动资金。|{n} bursts in with a business plan: they want to quit and start a company, and need {m} to launch.',
      o: [
        { t: '全力支持|Back them fully', run: function (c) { var k = c.npc, amt = c.amt; if (!c.pay(amt)) return '你拿不出这么多钱。|You don\'t have that kind of money.'; k.founder = 1; G.dPush('aff', N.addAff(k, 15)); if (G.ch(.25 + k.smarts / 400 + (k.eq || 50) / 600)) { k.jobBase = '公司创始人|Company Founder'; k.jr = 2; k.inc = Math.round(Math.max(k.inc || 0, G.$w(80000, k.c)) * G.rf(1.5, 4)); k.job = jobName(k); k.wealth += amt * G.ri(3, 15); return '三年后，{n}的公司拿到了融资，估值翻了好几倍！|Three years on, {n}\'s company raised a big round at many times the valuation!'; } k.unemp = 1; k.inc0 = k.inc; k.inc = 0; k.job = '待业|Between Jobs'; return '公司没撑过两年。{n}说：“至少我试过了。”|The company didn\'t last two years. {n} said, "At least I tried."'; } },
        { t: '先让TA用业余时间试试|Tell them to test it on the side first', run: function (c) { G.dPush('aff', N.addAff(c.npc, -2)); c.add('eq', 1); return '{n}有点失望，但承认你说得有道理。|{n} was a little disappointed, but admitted you had a point.'; } },
        { t: '坚决反对|Flatly refuse', run: function (c) { G.dPush('aff', N.addAff(c.npc, -12)); return '“你从来都不相信我。”|"You never believed in me."'; } }
      ] }
  ]);

  /* ---------------- playing on as your child keeps their life ---------------- */
  var MAP = { '教师': 'teacher', '医生': 'doctor', '护士': 'nurse', '程序员': 'coder', '销售': 'sales', '工厂工人': 'factory', '司机': 'driver', '厨师': 'chef', '律师': 'lawyer', '设计师': 'design', '外卖骑手': 'rider', '保安': 'guard', '会计': 'acct', '健身教练': 'trainer', '金融分析师': 'banker', '记者': 'journo', '摄影师': 'photo', '理发师': 'hair', '空乘': 'attendant', '建筑师': 'archi', '工程师': 'engr', '研究员': 'sci', '公司职员': 'mkt', '投资公司分析师': 'banker', '律所助理': 'lawyer', '国企管理岗': 'pm', '家族企业副总': 'consult' };
  var cont = G.life.continueAs;
  G.life.continueAs = function (kid) {
    var info = kid ? { base: kid.jobBase || kid.jobT, jr: kid.jr || 0, jy: kid.jy || 0, inc: kid.inc || 0, unemp: kid.unemp, neet: kid.neet, by: kid.by } : null;
    var r = cont.apply(this, arguments);
    var p = G.S && G.S.p;
    if (!info || !p || !info.base || info.unemp || p.age < 18 || p.job || p.gov || p.pol || p.fc) return r;
    var z = info.base.split('|')[0];
    try {
      if (z === '公务员') { G.gov.join(); p.gov.rank = Math.min(info.jr + 1, 4); p.gov.yrs = info.jy; }
      else if (z === '警察') { G.police.join(false); p.pol.rank = Math.min(info.jr + 1, 5); p.pol.yrs = info.jy; }
      else if (z === '主播') { G.fame.start('streamer'); p.fc.rank = Math.min(info.jr, 2); p.fc.fans = [5000, 80000, 1200000][p.fc.rank]; p.fc.yrs = info.jy; }
      else if (/老板|创始人|Founder/.test(info.base)) { var cap = Math.max(20000, Math.round(info.inc / G.$(1) * 3)); G.biz.start(G.pick(['retail', 'food', 'tech', 'trade'].filter(function (x) { return G.INDUSTRY[x]; })) || 'retail', cap); }
      else if (MAP[z] && G.JOB[MAP[z]]) {
        var J = G.JOB[MAP[z]]; G.career.hire(J);
        if (p.job) { p.job.rank = Math.min(info.jr, J.r.length - 1); p.job.yrs = info.jy; p.job.sal = Math.max(p.job.sal, info.inc); p.job.perf = 60; }
      }
      if (p.job || p.gov || p.pol || p.fc || G.S.assets.company) G.log('你继续着原来的工作：{j}。|You carry on with your work as {j}.', { j: info.base });
    } catch (e) { console.error(e); }
    return r;
  };
})();
