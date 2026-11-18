/* Version 2.0 systems.
   - Family first: divorced parents are shown as divorced; graves can be visited again and again and moved to finer cemeteries.
   - Prison really is prison: no weddings or naming from a cell, the prison infirmary or a regional hospital under guard,
     guards you can get to know (and fall for), and a pregnancy behind bars changes things.
   - Partners: same-sex couples can have children through surrogacy or IVF; a devoted partner may take in your child born
     outside the marriage, pays more every year, and may not outlive you; you can look after a partner's health.
   - Royals can't take their crown abroad; spies who leave are hunted as defectors; spy families pass the trade on.
   - Spy parents have real cover jobs and real money; high school abroad for the player; pricey high-society evenings;
     big-time crime that actually pays. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function P() { return G.S && G.S.p; }
  function cat(id) { return G.ACT_CATS.filter(function (c) { return c.id === id; })[0]; }
  function item(id) { var f = null; G.ACT_CATS.forEach(function (c) { c.items.forEach(function (a) { if (a.id === id && !f) f = a; }); }); return f; }
  function q(id, nid, prm) { var s = S(); (s.pendQ = s.pendQ || []).push({ id: id, nid: nid, prm: prm }); }
  var ROM = ['date', 'confess', 'propose', 'wed', 'flirt', 'kiss', 'hookup', 'seduce', 'affair', 'trybaby', 'surro', 'elope'];

  /* ===================== 1. family ===================== */
  var rn = N.relName;
  N.relName = function (n) {
    var r = rn.apply(this, arguments);
    if (n && (n.rel === 'father' || n.rel === 'mother') && n.sep) return G.join([r, '（已离婚）|(divorced)'], '', ' ');
    return r;
  };
  // a divorce in the story is a divorce in the family
  var dv = G.EV.c_divorce;
  if (dv) dv.o.forEach(function (o) { var r0 = o.run; o.run = function (c) { var t = r0.apply(this, arguments), f = N.rel('father')[0], m = N.rel('mother')[0]; if (f && m) { f.sep = f.sep || 0; m.sep = m.sep || 0; if (!f.sep && !m.sep) m.sep = 1; f.divY = m.divY = S().year; f.spouseId = null; m.spouseId = null; } c.p.flags.parentsDivorced = S().year; return t; }; });
  G.PLOTS = [
    { n: '公共墓园|Public Cemetery', usd: 0, i: '🪦' },
    { n: '园林式墓园|Garden Cemetery', usd: 30000, i: '🌳' },
    { n: '家族陵园|Family Mausoleum', usd: 300000, i: '🏛️' },
    { n: '私家纪念园|Private Memorial Park', usd: 3000000, i: '⛩️' }
  ];

  /* ===================== 2. prison ===================== */
  var opt0 = G.health.options;
  G.health.options = function (ill) {
    var L = opt0.apply(this, arguments), p = P();
    if (p && p.jail) {
      var d = G.ILL[ill.id], base = G.$(d.cost);
      return [{ n: '监狱医务室|Prison Infirmary', cost: Math.round(base * .1), m: .55 }, { n: '地区医院（狱警押送）|Regional Hospital (under guard)', cost: Math.round(base * .7), m: .9 }];
    }
    return L;
  };
  var baby0 = G.love.baby;
  G.love.baby = async function (other, adopted) {
    var p = P();
    if (!p.jail) return baby0.apply(this, arguments);
    // from a cell you name nothing: the other parent decides
    var U = G.UI, sp = U.pick, si = U.input;
    U.pick = async function () { return 0; }; U.input = async function (o) { return o && o.def; };
    try { var k = await baby0.apply(this, arguments); if (k && other) G.log('你在狱中。孩子由{o}取名为{n}。|You were in prison. {o} named the baby {n}.', { o: other.name, n: k.name }); return k; }
    finally { U.pick = sp; U.input = si; }
  };
  var acts = G.npcActs;
  G.npcActs = function (n) {
    var out = acts.apply(this, arguments) || [], p = P();
    if (!n || !n.alive) return out;
    if (p.jail) {
      // only visits, letters and the guard you're allowed to know
      out = out.filter(function (a) { return ROM.indexOf(a.id) < 0 && ['ivf', 'abroad', 'gift', 'outing', 'trip', 'vacation', 'kidphone', 'splitup', 'cutfam', 'alum'].indexOf(a.id) < 0; });
      if (n.guard && N.canRomance && !n.guardLove) out.push({ id: 'guardtalk', n: '隔着铁栏聊天|Talk Through the Bars', i: '💬', e: 5, run: function (n2, a) { N.touch(n); G.dStart(); G.dPush('aff', N.addAff(n, G.ri(5, 10))); n.love = Math.min(100, (n.love || 0) + G.ri(3, 9)); G.dPush('love', 0); var dl = G.dEnd(); if (n.love >= 60 && N.canRomance(n)) { n.guardLove = 1; n.rel = 'lover'; G.major('和狱警{n}秘密相恋|Fell secretly in love with the guard {n}', { n: n.name }); return G.result(a.n, '熄灯后，{n}在你的门口多站了一会儿：“等你出去那天，我来接你。”|After lights-out {n} lingered at your door: "The day you get out, I\'ll be there."', { n: n.name }, dl, '💗'); } return G.result(a.n, G.pick(['{n}给你带了一本书，说是“没收的”。|{n} brought you a book, "confiscated", they said.', '{n}查房时，悄悄多给了你一个苹果。|On rounds, {n} slipped you an extra apple.', '你们聊起了各自小时候的家乡。|You talked about the towns you grew up in.']), { n: n.name }, dl, '💬'); } });
      return out;
    }
    // surrogacy / IVF for a same-sex couple, right on the partner's page
    var pt = N.partner && N.partner();
    if (pt === n && n.g === p.g && p.age >= 22 && p.age <= 60) out.push({ id: 'surro', n: '代孕/试管生一个孩子|Have a Child by Surrogacy/IVF', i: '🧬', e: 20, run: async function (n2, a) {
      var cost = G.$(G.ri(60, 150) * 1000);
      if (!(await G.UI.confirm(G.L(a.n), G.L('找一家正规机构，费用约{m}。可能要等上一年多。|A reputable clinic costs about {m}, and it may take over a year.', { m: G.M(cost) })))) return 'cancel';
      if (!G.pay(cost)) { G.UI.toast(G.L('钱不够|Not enough money')); return 'cancel'; }
      if (!G.ch(.78)) return G.result(a.n, '这一次没有成功。医生说，可以再试一次。|It didn\'t work this time. The doctor says you can try again.', null, [], '🧬');
      var k = await G.love.baby(n);
      return G.result(a.n, '经过漫长的等待，{k}来到了你们身边。{n}抱着孩子哭了。|After a long wait, {k} arrived. {n} wept holding the baby.', { k: k.name, n: n.name }, [], '👶');
    } });
    // looking after a partner's health
    if ((n.rel === 'spouse' || n.rel === 'lover') && p.age >= 18) {
      out.push({ id: 'ptcheck', n: '陪ta做全面体检|Take Them for a Full Check-up', i: '🩺', e: 10, $: 2000, if: function () { return n.ckY !== S().year; }, run: function (n2, a) { n.ckY = S().year; var g = G.ri(4, 10); n.health = Math.min(100, (n.health || 60) + g); G.dStart(); G.dPush('aff', N.addAff(n, 4)); n.love = Math.min(100, (n.love || 0) + 3); var dl = G.dEnd(); return G.result(a.n, G.pick(['体检发现了一个小问题，及时处理了。{n}的健康+{g}。|The check-up caught a small problem in time. {n}\'s health +{g}.', '一切正常。回家路上，{n}一直握着你的手。（健康+{g}）|All clear. On the way home {n} held your hand the whole time. (Health +{g})']), { n: n.name, g: g }, dl, '🩺'); } });
      out.push({ id: 'ptspa', n: '送ta去顶级疗养院|Send Them to a Top Clinic', i: '🏥', e: 5, $: 50000, if: function () { return G.netWorth() > G.$(5e5); }, run: function (n2, a) { var g = G.ri(10, 18); n.health = Math.min(100, (n.health || 60) + g); G.dStart(); G.dPush('aff', N.addAff(n, 6)); var dl = G.dEnd(); return G.result(a.n, '{n}在瑞士的疗养院住了一个月，回来的时候气色好得像换了个人。（健康+{g}）|A month at a Swiss clinic, and {n} came back looking like a new person. (Health +{g})', { n: n.name, g: g }, dl, '🏥'); } });
      out.push({ id: 'ptgym', n: '一起锻炼|Work Out Together', i: '🏃', e: 10, run: function (n2, a) { n.health = Math.min(100, (n.health || 60) + 3); G.dStart(); G.addStat('health', 3); G.dPush('aff', N.addAff(n, 3)); var dl = G.dEnd(); return G.result(a.n, '你们一起跑完了五公里，在江边买了两瓶汽水。|You ran five kilometres together and bought two sodas by the river.', null, dl, '🏃'); } });
    }
    return out;
  };

  /* ===================== 3. devoted partners ===================== */
  function devoted(n) { return !!(n && n.alive && (n.devoted || n.pure || (n.pursued && n.love >= 85) || (n.love >= 95 && n.aff >= 80))); }
  G.isDevoted = devoted;
  function partnerYear() {
    var s = S(), p = s.p, sp = N.spouse ? N.spouse() : null;
    if (!sp || !sp.alive) return;
    if (!sp.devoted && devoted(sp)) { sp.devoted = 1; G.log('{n}对你的感情，好像永远不会变淡。|{n}\'s love for you never seems to fade.', { n: sp.name }); }
    if (sp.devoted) {
      sp.love = Math.min(100, Math.max(sp.love || 0, 90)); N.addAff(sp, 3);
      // a devoted partner with money shares it — twice as generously
      if ((sp.wealth || 0) > G.$(2e5) && G.giftIn) { var g = Math.round(Math.min(G.$(1e7), sp.wealth * .02)); if (g > 0) { sp.wealth -= g; G.giftIn(g, G.L('{n}给你的钱|Money from {n}', { n: sp.name })); } }
      // and takes in your child from outside the marriage
      N.all(function (k) { return k.rel === 'child' && k.alive && k.illegit && !k.spAck && N.age(k) < 26; }).forEach(function (k) { if (G.ch(.5)) q('v21_ack_kid', k.id, { sp: sp.id }); });
      N.all(function (k) { return k.rel === 'child' && k.alive && k.spAck && N.age(k) < 22; }).forEach(function (k) { var m = G.$(G.ri(2, 8) * 1000); if ((sp.wealth || 0) > m) { sp.wealth -= m; k.wealth = (k.wealth || 0) + m; N.addAff(k, 2); } });
    }
  }
  var comp = G.ending.compute;
  G.ending.compute = function () {
    var s = S(), sp = N.spouse ? N.spouse() : null;
    if (sp && sp.alive && sp.devoted && !s._devGone) {
      s._devGone = 1;
      if (G.ch(.55)) { sp.alive = false; sp.died = s.year; sp.cause = '思念成疾，随你而去|Followed you, heartbroken'; G.log('{n}没能熬过那个冬天。人们说，ta是随你去了。|{n} did not survive that winter. People said they went after you.', { n: sp.name }); }
      else { sp.mourn = 1; G.log('{n}从此再也没有爱上任何人。|{n} never loved anyone again.', { n: sp.name }); }
    }
    return comp.apply(this, arguments);
  };

  /* ===================== 4. royals and spies abroad ===================== */
  var emi = G.money.emigrate;
  G.money.emigrate = function (to) {
    var p = P(), from = p.country;
    if (p.flags.monarch && to !== from) { G.UI.toast && G.UI.toast(G.L('君主只能住在自己的国家。要移居国外，得先退位。|A monarch lives in their own realm. To move abroad, abdicate first.')); return false; }
    var r = emi.apply(this, arguments);
    if (r === false || p.country !== to || to === from) return r;
    if (p.origin === 'royal' && !p.flags.exRoyal) { p.flags.exRoyal = from; p.origin = 'noble'; G.major('移居{c}，放弃了王室身份|Moved to {c}, giving up royal status', { c: G.C[to].n }); }
    if (p.spy && !p.spy.youth && p.spy.ag === from) { p.flags.defector = from; G.major('叛逃到{c}|Defected to {c}', { c: G.C[to].n }); p.spy = null; }
    else if (p.flags.spyfam && from !== to && !p.flags.defector) p.flags.spyfamAbroad = from;
    if (to === p.flags.defector) q('v21_defector_home');
    return r;
  };
  function hunt() {
    var p = P(); if (p.jail) return;
    if (p.flags.defector && p.country !== p.flags.defector && G.ch(.08)) q('v21_defector_found');
    if (p.flags.spyfamAbroad && p.country !== p.flags.spyfamAbroad && !p.flags.spyfamWarned && G.ch(.12)) { p.flags.spyfamWarned = 1; q('v21_spyfam_watch'); }
  }
  // the trade runs in the family
  var ca = G.life.continueAs;
  G.life.continueAs = function (kid) {
    var old = P(), was = !!(old.spy || old.flags.spyfam || old.flags.spyDouble), ag = old.spy ? old.spy.ag : old.country, rk = old.spy ? old.spy.rank : 0;
    var r = ca.apply(this, arguments), p = P();
    if (was) { p.flags.spyfam = 1; p.flags.spyLegacy = { ag: ag, rank: rk }; if (p.age >= 18) q('v21_spy_legacy'); }
    return r;
  };
  var rb = G.life.rebirthAs;
  G.life.rebirthAs = function (kid) {
    var old = P(), was = !!(old.spy || old.flags.spyfam), ag = old.spy ? old.spy.ag : old.country;
    var r = rb.apply(this, arguments), p = P();
    if (was) { p.flags.spyfam = 1; p.flags.spyLegacy = { ag: ag, rank: 0 }; if (p.origin !== 'royal') p.origin = 'spyfam'; }
    return r;
  };

  /* ===================== 5. spy parents: real covers, real money ===================== */
  var COVER = [['外贸公司区域经理|Regional Manager, Trading Company', '国家安全部门处长|Section Chief, State Security'], ['外交部高级翻译|Senior Interpreter, Foreign Ministry', '情报机构外勤主管|Field Director, Intelligence Service'], ['驻外商会秘书长|Secretary-General, Overseas Chamber', '情报机构站长|Station Chief, Intelligence Service']];
  function spyParents() {
    var p = P(); if (p.origin !== 'spyfam' && !p.flags.spyfam) return;
    N.rel('father', 'mother').forEach(function (n) {
      if (!n.alive) return;
      if (!n.cover) { var c = G.pick(COVER); n.cover = c; n.job = c[0]; n.inc = Math.max(n.inc || 0, G.$w(G.ri(160, 420) * 1000)); n.wealth = Math.max(n.wealth || 0, G.$(G.ri(6, 25) * 1e5)); }
      if (p.flags.spyTruth && n.job === n.cover[0]) n.job = G.join([n.cover[1], G.L('（掩护身份：{c}）|(cover: {c})', { c: n.cover[0] })], '', ' ');
    });
  }
  var tr = G.EV.or_spy_truth;
  if (tr) tr.o.forEach(function (o) { var r0 = o.run; if (typeof r0 === 'function') o.run = function (c) { c.p.flags.spyTruth = 1; spyParents(); return r0.apply(this, arguments); }; });

  /* ===================== 6. high school abroad ===================== */
  var HSC = { us: 65000, gb: 55000, ca: 38000, au: 36000, sg: 34000, ch: 85000, jp: 20000, de: 12000, fr: 15000, nz: 28000 };
  G.HS_ABROAD = HSC;
  var learn = cat('learn') || cat('life');
  if (learn) learn.items.push({ id: 'hs_abroad', n: '申请出国读高中|Apply to High School Abroad', i: '🌍', e: 10, a: [13, 16], if: function () { var e = P().edu; return e && (e.stage === 'middle' || (e.stage === 'high' && (e.grade || 0) < 1)) && !e.hsAbroad && !P().flags.monarch; }, run: async function (a) {
    var p = P(), cs = Object.keys(HSC).filter(function (c) { return c !== p.country && G.C[c]; }), fam = G.famWealth ? G.famWealth() : 0;
    var i = await G.UI.pick({ title: G.L(a.n), text: G.L('每年学费加生活费，三年下来是一大笔钱。家里出不起，就只能在国内读。|Fees and living costs every year, for three years — a lot of money. If the family can\'t afford it, you study at home.'), items: cs.map(function (c) { var y = G.$(HSC[c]); return { t: G.C[c].n, icon: G.C[c].flag, sub: G.L('每年约{m} · 三年约{t}|~{m} a year · ~{t} for three years', { m: G.M(y), t: G.M(y * 3) }), dis: fam + p.money < y * 3 }; }) });
    if (i < 0) return 'cancel'; var c = cs[i], y = G.$(HSC[c]);
    if (fam + p.money < y * 3) return G.result(a.n, '爸妈算了一晚上的账，最后说：“家里供不起，就在国内好好读吧。”|Your parents did the sums all night, then said: "We can\'t afford it. Study hard here."', null, [], '🏠');
    if (!G.ch(.35 + p.st.smarts / 160)) return G.result(a.n, '你收到了一封拒信。没关系，国内的学校一样能读出名堂。|A rejection letter came. Never mind — you can do great things at home too.', null, [], '✉️');
    var e = p.edu; e.hsAbroad = c; e.hsFee = y; if (e.stage === 'middle') { G.school.enter('high'); e.grade = 0; }
    e.school = G.L('{c}的一所寄宿高中|A boarding school in {c}', { c: G.C[c].n });
    G.major('出国读高中（{c}）|Went to high school abroad ({c})', { c: G.C[c].n });
    return G.quick(a, '你拖着两个大箱子，在机场和爸妈告别。|You said goodbye to your parents at the airport, dragging two big suitcases.', { smarts: 3, eq: 2, happy: 4 });
  } });
  var uc = G.school.uniChoices;
  G.school.uniChoices = function (sc, abroadCid) {
    var p = P(), out = uc.apply(this, arguments);
    if (!abroadCid && p.edu && p.edu.hsAbroad) out = uc.call(this, Math.min(100, sc + 6), p.edu.hsAbroad).concat(out);
    return out;
  };
  function hsYear() {
    var p = P(), e = p.edu; if (!e || !e.hsAbroad || e.stage !== 'high') return;
    var fee = e.hsFee || G.$(30000), par = N.rel('father', 'mother', 'grand').filter(function (n) { return n.alive && n.wealth > fee; })[0];
    if (par) par.wealth -= fee; else if (p.money >= fee) G.addMoney(-fee); else { e.hsAbroad = null; G.log('家里供不起了，你转回了国内的高中。|The family could no longer pay; you transferred back to a school at home.'); return; }
    G.addStat('smarts', 1);
  }

  // mountaineering also lives in Life's Little Things, and pro climbers get it on the Life tab
  var lifeC = cat('life');
  if (lifeC && G.CLIMB && lifeC.items.indexOf(G.CLIMB) < 0) lifeC.items.splice(2, 0, G.CLIMB);
  var la = G.lifeActs;
  G.lifeActs = function () { var out = la.apply(this, arguments), p = P(); if (G.CLIMB && p.flags.pro === 'climber' && !p.jail && out.indexOf(G.CLIMB) < 0) out = [G.CLIMB].concat(out); return out; };

  /* ===================== 7. high society costs what it costs ===================== */
  var PRICE = { club: 250000, gala: 1000000, yachtp: 500000, royal_ball: 3000000 };
  Object.keys(PRICE).forEach(function (id) { var a = item(id); if (a) { a.$ = PRICE[id]; var l0 = a.lock; a.lock = function () { var m = G.$(PRICE[id]); if (P().money < m) return G.L('需要现金{m}|Needs {m} in cash', { m: G.M(m) }); return l0 ? l0.apply(this, arguments) : null; }; } });

  /* ===================== 8. crime that pays ===================== */
  var crimeC = cat('crime');
  var BIG = [
    { id: 'bc_vault', n: '策划银行金库大劫案|Plan a Bank Vault Heist', i: '🏦', e: 40, need: 3, take: [2e6, 2e7], risk: .35, yrs: 20, t: '你们挖了四十天的地道，在一个长周末打开了金库。|You dug a tunnel for forty days and opened the vault over a long weekend.' },
    { id: 'bc_art', n: '盗取博物馆名画|Steal a Masterpiece', i: '🖼️', e: 30, need: 2, take: [5e5, 8e6], risk: .3, yrs: 12, t: '凌晨三点，警报系统被你们的人提前改了代码。画框里只剩一张纸条。|At 3 a.m. the alarm had already been recoded by your inside man. The frame held only a note.' },
    { id: 'bc_crypto', n: '入侵交易所盗取加密货币|Hack a Crypto Exchange', i: '💻', e: 30, need: 2, take: [1e6, 3e7], risk: .25, yrs: 15, y0: 2014, t: '你们在交易所的冷钱包里找到了一个漏洞。四小时后，资金洗进了几百个账户。|You found a hole in the exchange\'s cold wallet. Four hours later the money was laundered through hundreds of accounts.' },
    { id: 'bc_fraud', n: '操纵股价|Run a Pump-and-Dump', i: '📈', e: 25, need: 1, take: [3e5, 5e6], risk: .28, yrs: 8, t: '你们用三百个账户把一只小盘股炒高了五倍，然后一夜之间全部抛掉。|Three hundred accounts pushed a small-cap up fivefold — then you dumped it all overnight.' },
    { id: 'bc_smuggle', n: '跨国走私集团|Run a Transnational Smuggling Ring', i: '🚢', e: 35, need: 3, take: [1e6, 1.2e7], risk: .32, yrs: 18, t: '十二个集装箱在三个港口之间转了一圈，海关的单据全是你们的人做的。|Twelve containers looped through three ports on paperwork your people had forged.' }
  ];
  if (crimeC) BIG.forEach(function (b) {
    crimeC.items.push({ id: b.id, n: b.n, i: b.i, e: b.e, a: [20, 70], if: function () { var p = P(); return !p.flags.monarch && (!b.y0 || S().year >= b.y0) && ((p.crime && p.crime.n || 0) + ((p.gang && p.gang.rank) || 0) >= b.need || p.st.smarts >= 80); }, run: async function (a) {
      var r = await G.UI.game('memory', { name: a.n, hard: 1 }), p = P(), risk = Math.max(.08, b.risk - (r.score - .5) * .4 - (p.st.smarts - 60) / 300);
      if (G.ch(risk)) { G.dStart(); G.addStat('fame', -5); var dl = G.dEnd(); var t = await G.crime.arrest(G.ctx(), G.L(a.n), b.yrs); return G.result(a.n, G.join(['计划败露了。|The plan fell apart.', t || ''], ' ', ' '), null, dl, '🚨'); }
      var m = G.$(Math.round(G.rf(b.take[0], b.take[1]) / 1000) * 1000);
      G.addMoney(m); p.h.heat = Math.min(100, (p.h.heat || 0) + 25); p.crime.n = (p.crime.n || 0) + 1; G.inc('bigcrime');
      G.major('{a}得手，分到{m}|Pulled off "{a}" — your cut: {m}', { a: b.n, m: G.M(m) });
      return G.quick(a, G.join([b.t, G.L('你分到了{m}。|Your cut: {m}.', { m: G.M(m) })], ' ', ' '), { happy: 10, stress: 15, karma: -10 });
    } });
  });

  /* ===================== 9. events for these systems ===================== */
  G.evs([
    { id: 'v21_ack_kid', sys: 1, title: '一个决定|A Decision', icon: '🤍',
      prep: function (c) { var sp = S().npcs[c.prm.sp]; if (!c.npc || !sp || !sp.alive) return false; c.prm.k = c.npc.name; c.prm.s = sp.name; },
      t: '{s}知道了{k}的存在。沉默了一整晚以后，ta对你说：“孩子没有错。从今天起，{k}也是我的孩子。”|{s} has learned about {k}. After a whole night of silence, they say: "The child did nothing wrong. From today, {k} is my child too."',
      o: [{ t: '抱住ta|Hold them', run: function (c) { var k = c.npc, sp = S().npcs[c.prm.sp]; k.spAck = 1; k.ack = 1; if (sp) { N.addAff(sp, 6); sp.love = Math.min(100, (sp.love || 0) + 5); } N.addAff(k, 15); c.add('happy', 10); return '那年春节，{k}第一次坐在了家里的饭桌上。{s}给ta包了一个最大的红包。|That New Year, {k} sat at the family table for the first time. {s} gave them the biggest red envelope of all.'; } }] },
    { id: 'v21_spy_legacy', sys: 1, title: '父辈的接班人|Heir to the Trade', icon: '🕶️',
      prep: function (c) { var p = c.p; if (p.spy || p.jail || !p.flags.spyLegacy) return false; c.prm.a = G.agencyName ? G.agencyName(p.flags.spyLegacy.ag) : ''; },
      t: '葬礼结束后，一位你从没见过的老人在墓园门口等你：“你父母为{a}工作了一辈子。如果你愿意，那份工作可以由你接着做。”|After the funeral an old man you\'ve never seen waits at the cemetery gate: "Your parent served {a} all their life. If you\'re willing, the work can pass to you."',
      o: [{ t: '接过来|Take it up', run: function (c) { var L = c.p.flags.spyLegacy; if (G.spyJoin) G.spyJoin(L.ag, Math.min(3, Math.max(1, Math.floor((L.rank || 0) / 2))), false); c.add('stress', 6); return '他递给你一枚旧硬币——那是你小时候在爸妈口袋里见过的。“从今天起，你就是我们的人了。”|He handed you an old coin — one you\'d seen in your parents\' pockets as a child. "From today, you are one of us."'; } },
        { t: '我想过自己的人生|I want a life of my own', run: function (c) { c.p.flags.spyLegacy = null; c.add('happy', 3); return '老人点点头：“这也是他们希望的。”|The old man nodded. "That is what they wanted for you, too."'; } }] },
    { id: 'v21_defector_found', sys: 1, title: '他们找到你了|They Found You', icon: '🕶️', bad: 1,
      t: '你在超市排队时，有人在你耳边说了你的真名——那个你已经很多年没听过的名字。|In a supermarket queue someone whispers your real name — one you haven\'t heard in years.',
      o: [{ t: '立刻联系当地情报部门|Call your new country\'s security service at once', run: function (c) { if (G.ch(.6)) { c.add('stress', 12); return '他们连夜把你转移到了安全屋，换了新身份。|They moved you to a safe house overnight with a new identity.'; } c.p.flags.defector = null; return G.crime.arrest(c, '叛逃|Defection', 15); } },
        { t: '跑|Run', run: function (c) { if (G.ch(.45)) { c.add('stress', 15); c.add('health', -5); return '你从后门冲了出去，换了三次车。你逃掉了——这一次。|You bolted out the back and changed cars three times. You got away — this time.'; } c.p.flags.defector = null; return G.crime.arrest(c, '叛逃|Defection', 18); } }] },
    { id: 'v21_defector_home', sys: 1, title: '回国|Home', icon: '🛂', bad: 1,
      t: '你一入境，就被带走了。|The moment you cross the border, you are taken.',
      o: [{ t: '……|…', run: function (c) { c.p.flags.defector = null; return G.crime.arrest(c, '叛逃|Defection', 15); } }] },
    { id: 'v21_spyfam_watch', sys: 1, title: '跟踪|Followed', icon: '👁️',
      t: '你发现，有一辆车已经连续三天停在你公寓楼下。车里的人说的是你的母语。|For three days the same car has been parked below your flat. The men inside speak your mother tongue.',
      o: [{ t: '打电话给爸妈|Call your parents', run: function (c) { c.add('stress', 5); N.rel('father', 'mother').forEach(function (n) { if (n.alive) N.addAff(n, 3); }); return '妈妈只说了一句：“他们只是确认你没有乱说话。好好生活，别回头。”|Mum said only: "They\'re checking you haven\'t talked. Live your life — and don\'t look back."'; } },
        { t: '搬家|Move house', run: function (c) { c.money(-G.$(5000)); c.add('stress', 3); return '你连夜搬到了另一个城市。|You moved to another city overnight.'; } }] },
    { id: 'v21_jail_preg', sys: 1, title: '狱中怀孕|Pregnant in Prison', icon: '🤰', jail: 1,
      t: '狱医拿着化验单看了你很久：“你怀孕了。”|The prison doctor stares at your test results a long time: "You\'re pregnant."',
      o: [{ t: '申请保外就医|Apply for medical release', run: function (c) { var j = c.p.jail; if (G.ch(.55 + (j.beh || 50) / 300)) { j.left = 0; c.p.flags.medRelease = 1; return '申请批下来了。你被保外就医，直到孩子出生。|Approved. You were released on medical grounds until the birth.'; } return '申请被驳回了。你只能在狱中待产。|Rejected. You will give birth in custody.'; } },
        { t: '咬牙撑下去|Grit your teeth and carry on', run: function (c) { c.p.jail.beh = Math.min(100, (c.p.jail.beh || 50) + 10); c.add('eq', 3); return '狱友们轮流给你留饭。一个老狱友说：“生下来，好好养。”|Your cellmates took turns saving you food. An old-timer said: "Have it, and raise it well."'; } }] }
  ]);
  // prison guards to meet
  function prisonYear() {
    var p = P(); if (!p.jail) return;
    if (!N.all(function (n) { return n.guard && n.alive; }).length && G.ch(.6)) {
      var g = p.orient === 'gay' ? p.g : p.orient === 'bi' ? (G.ch(.5) ? 'm' : 'f') : (p.g === 'm' ? 'f' : 'm');
      var n = N.make({ rel: 'contact', g: G.ch(.5) ? g : p.g, age: p.age + G.ri(-8, 8), aff: G.ri(10, 30), c: p.country }); n.guard = 1; n.pin = 1; n.job = '狱警|Prison Guard';
      G.log('新来的狱警{n}，好像对你格外留意。|The new guard, {n}, seems to pay you particular attention.', { n: n.name });
    }
    var lv = N.all(function (n) { return n.guard && n.guardLove && n.alive; })[0];
    if (lv && p.g === 'f' && lv.g === 'm' && !p.flags.jailPreg && G.ch(.12)) { p.flags.jailPreg = 1; q('v21_jail_preg'); }
  }

  /* ===================== yearly ===================== */
  var mt = G.money.tick;
  G.money.tick = function () {
    var r = mt.apply(this, arguments), s = S();
    if (s.dead) return r;
    try { partnerYear(); hunt(); spyParents(); hsYear(); prisonYear(); } catch (e) { console.error(e); }
    return r;
  };
})();
