/* Finance, assets, markets, world/history, emigration */
(function () {
  'use strict';
  var MO = G.money = {};
  function N_par() { return G.N.rel('father', 'mother', 'grand').filter(function (n) { return n.alive; }); }
  var W = G.world = {};

  /* ---------- world & markets ---------- */
  W.tick = function (Q) {
    var S = G.S, p = S.p, wd = S.world;
    var hist = G.HISTORY.filter(function (h) { return h.y === S.year && (h.c === 'all' || h.c === p.country); });
    var shock = { mk: 0, tech: null, hp: 0, job: 0, crypto: null };
    hist.forEach(function (h) { if (h.pandemic) wd.pandemicY = S.year; shock.mk += h.mk || 0; if (h.tech != null) shock.tech = (shock.tech || 0) + h.tech; shock.hp += h.hp || 0; shock.job += h.job || 0; });
    var fut = null;
    if (S.year > 2025 && G.ch(.55)) {
      fut = G.wpick(G.FUTURE.filter(function (f) { return !f.y0 || S.year >= f.y0; }));
      if (fut) { shock.mk += fut.mk || 0; if (fut.tech) shock.tech = (shock.tech || 0) + fut.tech; shock.hp += fut.hp || 0; shock.job += fut.job || 0; if (fut.crypto) shock.crypto = fut.crypto; }
    }
    // market returns
    var mk = {};
    G.INV_KEYS.forEach(function (k) {
      var I = G.INV[k], r = G.nrm(I.mu, I.sd);
      if (k === 'idx' || k === 'blue') r += shock.mk;
      if (k === 'tech') r += shock.tech != null ? shock.tech : shock.mk * 1.4;
      if (k === 'gold' && shock.mk < 0) r += -shock.mk * .4;
      if (k === 'bond') r += shock.mk * .1;
      if (k === 'crypto') { if (S.year < 2011) r = 0; else { r = shock.crypto != null ? shock.crypto : r + shock.mk * 1.5; if (S.year === 2013 || S.year === 2017 || S.year === 2021) r = G.rf(2, 9); if (S.year === 2018 || S.year === 2022) r = -G.rf(.6, .8); } }
      if (G.has('biz') && k !== 'bond') r += .03;
      mk[k] = Math.max(-.95, r);
    });
    wd.mk = mk; wd.mkRet = mk.idx; wd.jobShock = shock.job;
    // housing
    var boom = p.country === 'cn' && S.year >= 1998 && S.year <= 2020 ? .06 : 0;
    wd.hpR = G.nrm(.01 + boom, .04) + shock.hp;
    wd.hpi[p.country] = Math.max(.3, (wd.hpi[p.country] || 1) * (1 + wd.hpR));
    hist.forEach(function (h) { Q.push({ id: 'sys_history', prm: { t: h.t, h: h.h || 0, hap: h.hap || 0, cash: h.cash || 0, job: h.job || 0 } }); });
    if (fut) Q.push({ id: 'sys_history', prm: { t: fut.t, h: fut.h || 0, hap: fut.hap || 0, cash: 0, job: fut.job || 0, life: fut.life } });
    // special historical situations
    if (p.country === 'cn' && S.year >= 1968 && S.year <= 1977 && p.age >= 16 && p.age <= 22 && p.tier <= 3 && !p.flags.zhiqing && !p.mil) Q.push({ id: 'sys_countryside' });
    if (p.country === 'cn' && S.year === 1977 && p.age >= 18 && p.age <= 30 && p.edu.deg === 3 && !p.jail) Q.push({ id: 'sys_gaokao77' });
  };
  G.evs([
    { id: 'sys_history', sys: 1, title: '时代大事|Historic Event', icon: '📰', kind: 'news',
      t: function (c) { return c.prm.t; },
      run: function (c) {
        if (c.prm.h) c.add('health', c.prm.h);
        if (c.prm.hap) c.add('happy', c.prm.hap);
        if (c.prm.cash && c.p.money > 0) { var l = Math.round(c.p.money * -c.prm.cash); c.money(-l); }
        if (c.prm.life) c.p.flags.antiAge = 1;
        if (c.prm.job && c.p.job && !G.JOB[c.p.job.id].pt && G.ch(c.prm.job * 2)) { G.career.leave(); c.add('happy', -10); return '你也在这波浪潮中失去了工作。|You lost your job in the wave as well.'; }
      } },
    { id: 'sys_countryside', sys: 1, title: '上山下乡|Sent to the Countryside', icon: '🌾',
      t: '一纸通知下来，你要去农村插队落户了。|A notice arrives: you are to be sent down to the countryside.',
      o: [
        { t: '响应号召，奔赴农村|Go to the countryside', run: function (c) { c.p.flags.zhiqing = 1; c.p.tier = 5; c.add('health', 5); c.add('happy', -8); c.add('eq', 4); if (c.p.job) G.career.leave(); c.p.edu.stage = 'done'; G.major('上山下乡|Sent down to the countryside'); return '你背着行李来到了北方的一个小山村，开始了知青生活。|You arrive in a remote village with your bags and begin life as a sent-down youth.'; } },
        { t: '想办法参军|Try to join the army instead', if: function () { return G.mil.can(); }, run: function (c) { c.p.flags.zhiqing = 1; G.mil.enlist('army'); return '你穿上了军装，躲过了下乡。|You put on a uniform and avoided being sent down.'; } }
      ] },
    { id: 'sys_gaokao77', sys: 1, title: '恢复高考|The Gaokao Returns', icon: '📚',
      t: '恢复高考的消息传来，你还有机会上大学！|News arrives that the Gaokao is back — you still have a chance at university!',
      o: [
        { t: '参加高考|Sit the exam', run: function (c) { c.p.tier = c.p.flags.zhiqing ? 3 : c.p.tier; return G.school.uniFlow(c, G.school.examScore(G.rf(.3, .9))); } },
        { t: '算了，安心过日子|No, settle down', run: function () { return '你把机会留给了更年轻的人。|You leave the chance to younger people.'; } }
      ] }
  ]);

  /* ---------- income & expenses ---------- */
  MO.income = function () {
    var p = G.S.p, out = { work: 0, tax: 0, black: 0 };
    if (p.jail) { out.work = G.$w(300); return out; }
    if (p.job) out.work += p.job.sal;
    if (p.mil) out.work += G.mil.pay();
    if (p.pol) out.work += G.$w(G.POLICE.pay[p.pol.rank]);
    if (p.gov) out.work += G.gov.pay();
    if (p.fc) out.work += G.fame.income();
    if (p.retired) out.work += p.pension;
    if (p.gang) out.black += G.gang.income();
    var rate = (G.C[p.country].tax || .2) * Math.min(1.4, .6 + Math.log10(Math.max(1, out.work / G.$w(40000)) + 1));
    out.tax = Math.round(Math.max(0, out.work - G.$w(7000)) * rate); // personal allowance
    return out;
  };
  MO.living = function () {
    var S = G.S, p = S.p;
    if (G.dependent()) return 0;
    if (p.jail) return 0;
    var inc = MO.income();
    if (!inc.work && !inc.black && !G.S.assets.company) {
      if (p.age < 30 && N_par().length) return 0; // lives with parents
      return Math.round(G.$w(5500) * (G.has('thrifty') ? .7 : 1));
    }
    // what an ordinary household really burns through: food, transport, phone, insurance, rent, kids
    var c = G.$w(15000);
    var own = S.assets.houses.some(function (h) { return h.live; });
    if (!own) c += G.$w(13000);
    var sp = G.N.spouse(); if (sp) c += G.$w(5000);
    var kids = G.N.rel('child').filter(function (k) { return G.N.age(k) < 18 && !k.illegit; }), kc = kids.length * G.$w(8500);
    if (G.has('thrifty')) c *= .75; if (G.has('spender')) c *= 1.3;
    if (p.flags.lux) c *= 1.6;
    var earn = inc.work + inc.black - inc.tax;
    if (earn < c) c = Math.max(G.$w(own ? 6500 : 9500), earn * .94); // low earners scrape by, saving almost nothing
    else c += (earn - c) * .45;                                         // lifestyle creeps up with income
    return Math.round(c + kc);
  };
  MO.tick = function (Q) {
    var S = G.S, p = S.p, A = S.assets, mk = S.world.mk || {};
    var inc = MO.income(), spend = MO.living(), other = 0;
    // houses
    var g = G.eraIdx(p.country, S.year) / G.eraIdx(p.country, S.year - 1);
    A.houses.forEach(function (h) {
      h.val = Math.round(h.val * g * (1 + (S.world.hpR || 0)));
      if (h.mort > 0) { var pay = Math.min(h.pay, h.mort * 1.05); other += pay; h.mort = Math.max(0, Math.round(h.mort * 1.05 - pay)); }
      if (h.rent && !h.live) inc.work += Math.round(h.val * .028);
      other += Math.round(h.val * .004);
    });
    A.cars.forEach(function (c) { c.val = Math.round(c.val * .86); other += G.$(900) + Math.round(c.val * .01); });
    A.items.forEach(function (it) { it.val = Math.round(it.val * (it.inv ? (1 + G.nrm(.04, .12)) : .93)); });
    A.pets.forEach(function (pt) { other += G.$((G.PETS.filter(function (x) { return x.id === pt.kind; })[0] || { up: 500 }).up); });
    // investments
    var invGain = 0;
    for (var k in A.inv) { if (!A.inv[k]) continue; var r = mk[k] || 0; var d = Math.round(A.inv[k] * r); A.inv[k] = Math.max(0, A.inv[k] + d); invGain += d; }
    // debts
    A.debt.forEach(function (d) { d.amt = Math.round(d.amt * (1 + d.r)); });
    // kids allowance from parents
    var allow = 0;
    if (p.age >= 6 && G.dependent() && !(G.POCKET && G.POCKET[p.origin] && p.age < 18)) {
      var par = G.N.rel('father', 'mother', 'grand').filter(function (n) { return n.alive; });
      var fw = G.sum(par, function (n) { return n.wealth; });
      if (par.length) { var avgAff = G.sum(par, function (n) { return n.aff; }) / par.length; allow = Math.round(Math.max(0, fw) * .002 * (p.age / 10) * (.5 + avgAff / 100) + G.$(30) * p.age / 6); allow = Math.min(allow, Math.max(0, fw) * .02); par[0].wealth -= allow; }
    }
    // no home of your own: renting and moving wear you down
    if (p.age >= 22 && !G.dependent() && !p.jail && !A.houses.some(function (h) { return h.live; })) {
      var homeless = !inc.work && !inc.black && p.money < G.$(2000);
      G.addStat('health', homeless ? -4 : -1.5, true); G.addStat('happy', homeless ? -4 : -1, true); G.addStat('stress', homeless ? 8 : 3, true);
      if (homeless && G.ch(.3)) G.log('你居无定所，借住在朋友家的沙发上。|With nowhere to live, you crashed on a friend\'s couch.');
    }
    var cash = inc.work - inc.tax + inc.black - spend - other + allow;
    p.money += Math.round(cash + (p.money > 0 ? p.money * .01 : 0));
    S.cnt.earned = (S.cnt.earned || 0) + Math.max(0, inc.work + inc.black);
    // bills unpaid -> debt
    if (p.money < 0) {
      var amt = -p.money; p.money = 0;
      var cc = A.debt.filter(function (d) { return d.k === 'cc'; })[0];
      if (cc) cc.amt += amt; else A.debt.push({ k: 'cc', n: '信用卡欠款|Credit Card Debt', amt: amt, r: .18 });
      G.addStat('happy', -6, true); G.addStat('stress', 8, true);
      if (amt > G.$(30000) && G.ch(.3)) Q.push({ id: 'sys_debt_collector' });
    }
    // personal bankruptcy when debt spirals
    var debtTot = G.sum(A.debt, function (d) { return d.amt; });
    if (debtTot > Math.max(G.$(150000), (inc.work + inc.black) * 6) && !(S.flags.bkY && S.year - S.flags.bkY < 7)) { S.flags.bkY = S.year; Q.push({ id: 'sys_personal_bankrupt' }); }
    if (A.debt.some(function (d) { return d.k === 'shark' && d.amt > G.$(20000); }) && G.ch(.35)) Q.push({ id: 'sys_shark' });
    // auto-repay debts
    A.debt.forEach(function (d) { if (p.money > d.amt * .3 && d.amt > 0) { var pay = Math.min(d.amt, Math.round(p.money * .4)); d.amt -= pay; p.money -= pay; } });
    A.debt = A.debt.filter(function (d) { return d.amt > 1; });
    // summary
    if (!G.dependent() || inc.work) {
      var parts = [];
      if (inc.work) parts.push(G.L('收入{a}|income {a}', { a: G.M(inc.work) }));
      if (inc.black) parts.push(G.L('灰色收入{a}|under-the-table {a}', { a: G.M(inc.black) }));
      if (inc.tax) parts.push(G.L('缴税{a}|taxes {a}', { a: G.M(inc.tax) }));
      if (spend + other) parts.push(G.L('开销{a}|expenses {a}', { a: G.M(spend + other) }));
      if (invGain) parts.push(G.L('投资{s}{a}|investments {s}{a}', { s: invGain > 0 ? '+' : '', a: G.M(invGain) }));
      if (parts.length) G.logRaw(G.join([G.L('【财务】|[Finances] ')].concat([G.join(parts, '，', ', ')]), '', ''));
    } else if (allow > 0 && (!p.flags.allowY || allow > (p.flags.allowLast || 0) * 2.5)) { p.flags.allowY = S.year; p.flags.allowLast = allow; G.log('家里给了你{m}零花钱。|Your family gave you {m} in allowance.', { m: G.M(allow) }); }
    G.school.yearCost();
    G.biz.tick(Q);
  };
  G.evs([
    { id: 'sys_personal_bankrupt', sys: 1, title: '个人破产|Personal Bankruptcy', icon: '📉', bad: 1,
      t: '你的债务已经多到这辈子都还不清了。|Your debts have grown beyond anything you could repay in a lifetime.',
      o: [
        { t: '申请破产|File for bankruptcy', run: function (c) { var A = c.S.assets; A.houses = []; A.cars = []; A.items = []; A.inv = {}; A.debt = []; c.p.money = 0; c.p.flags.bankrupt = 1; c.add('happy', -20); c.add('fame', -2); G.major('个人破产|Declared personal bankruptcy'); G.inc('pbankrupt'); return '法院宣告你破产，资产被清算，债务一笔勾销。你从零开始。|The court declared you bankrupt. Your assets were liquidated and your debts wiped out. You start from zero.'; } },
        { t: '咬牙继续还|Keep paying', run: function (c) { c.add('stress', 20); c.add('happy', -8); return '你决定硬扛下去。|You decide to grind it out.'; } }
      ] },
    { id: 'sys_shark', sys: 1, title: '高利贷上门|Loan Sharks', icon: '🦈', bad: 1,
      t: '放高利贷的人堵住了你，手里拿着棍子。|The loan sharks corner you, clubs in hand.',
      o: [
        { t: '拿出所有现金|Hand over all your cash', run: function (c) { var d = c.S.assets.debt.filter(function (x) { return x.k === 'shark'; })[0]; var pay = Math.min(c.p.money, d ? d.amt : 0); c.money(-pay); if (d) d.amt -= pay; c.S.assets.debt = c.S.assets.debt.filter(function (x) { return x.amt > 1; }); return '他们拿走了钱，警告你下次没这么客气。|They took the money and warned you next time won\'t be so friendly.'; } },
        { t: '跑|Run', run: async function (c) { var r = await c.game('sprint', { name: '逃跑|Run' }); if (r.score > .5) return '你甩掉了他们。|You lost them.'; c.add('health', -20); return '你被打断了两根肋骨。|They broke two of your ribs.'; } },
        { t: '报警|Call the police', run: function (c) { c.S.assets.debt = c.S.assets.debt.filter(function (x) { return x.k !== 'shark'; }); c.add('happy', -5); return '警方端掉了这个高利贷团伙，你的债务作废了。|Police busted the loan-shark ring, and your debt was voided.'; } }
      ] }
  ]);
  G.ev({ id: 'sys_debt_collector', sys: 1, title: '催债上门|Debt Collectors', icon: '📞', bad: 1,
    t: '催收公司天天打电话，还找到了你的家人和同事。|Collectors call every day and have started contacting your family and coworkers.',
    o: [
      { t: '变卖资产还债|Sell assets to pay', run: function (c) { var A = c.S.assets, got = 0; A.cars.concat(A.items).forEach(function (x) { got += x.val; }); A.cars = []; A.items = []; c.money(got); return G.L('你卖掉了车和值钱的东西，换来{m}。|You sold your car and valuables for {m}.', { m: G.M(got) }); } },
      { t: '找家人借钱|Borrow from family', run: function (c) { var par = G.N.rel('father', 'mother', 'sibling').filter(function (n) { return n.wealth > c.$(5000); }); if (!par.length) return '家里也拿不出钱。|Your family has nothing to spare.'; var n = G.pick(par), m = Math.round(n.wealth * .3); n.wealth -= m; c.money(m); G.N.addAff(n, -8); return G.L('{n}借给了你{m}。|{n} lent you {m}.', { n: n.name, m: G.M(m) }); } },
      { t: '躲起来|Hide', run: function (c) { c.add('happy', -10); c.add('stress', 15); return '你关掉手机，躲了起来。|You turn off your phone and hide.'; } }
    ] });

  /* ---------- houses ---------- */
  MO.housePrice = function (h, tier) { var p = G.S.p; return Math.round(G.sqm(p.country, G.S.year, tier || p.tier) * h.a * h.m); };
  MO.buyHouse = function (h, mortgage) {
    var S = G.S, p = S.p, price = MO.housePrice(h);
    var down = mortgage ? Math.round(price * .3) : price;
    if (p.money < down) return false;
    G.addMoney(-down);
    var rec = { id: G.uid(), k: h.id, n: h.n, val: price, cost: price, mort: mortgage ? price - down : 0, y: S.year, city: p.city, c: p.country, school: !!h.school, live: !S.assets.houses.some(function (x) { return x.live; }), rent: false };
    if (mortgage) { var r = .05, n = 30, P = rec.mort; rec.pay = Math.round(P * r / (1 - Math.pow(1 + r, -n))); }
    S.assets.houses.push(rec);
    if (rec.live) p.home = rec.id;
    G.major('买下了{n}|Bought a {n}', { n: h.n }); G.inc('houses');
    return rec;
  };
  MO.sellHouse = function (rec) {
    var S = G.S, net = rec.val - (rec.mort || 0);
    G.addMoney(Math.round(net * .97));
    S.assets.houses = S.assets.houses.filter(function (x) { return x !== rec; });
    if (rec.live) { S.p.home = 'rent'; var other = S.assets.houses[0]; if (other) { other.live = true; other.rent = false; } }
    return net;
  };
  /* ---------- cars & items ---------- */
  MO.buyCar = function (cdef) { var S = G.S, pr = G.$(cdef.p); if (!G.pay(pr)) return false; S.assets.cars.push({ id: G.uid(), k: cdef.id, n: cdef.n, val: pr, i: cdef.i }); G.inc('cars'); return true; };
  MO.buyItem = function (it) { var S = G.S, pr = G.$(it.p); if (!G.pay(pr)) return false; S.assets.items.push({ id: G.uid(), k: it.id, n: it.n, val: pr, i: it.i, inv: it.inv }); G.addStat('happy', it.h * (G.has('spender') ? 1.5 : 1)); if (it.p > 1000000) G.addStat('fame', 2); G.inc('lux'); return true; };
  MO.sellAsset = function (list, rec, rate) { var S = G.S; G.addMoney(Math.round(rec.val * (rate || .9))); S.assets[list] = S.assets[list].filter(function (x) { return x !== rec; }); };
  /* ---------- investments ---------- */
  MO.invest = function (k, amt) { var A = G.S.assets; amt = Math.min(amt, G.S.p.money); if (amt <= 0) return 0; G.addMoney(-amt); A.inv[k] = (A.inv[k] || 0) + amt; G.inc('invested'); return amt; };
  MO.divest = function (k, amt) { var A = G.S.assets; amt = Math.min(amt, A.inv[k] || 0); if (amt <= 0) return 0; A.inv[k] -= amt; G.addMoney(Math.round(amt * .995)); return amt; };
  /* ---------- loans ---------- */
  MO.LOANS = [
    { k: 'bank', n: '银行贷款|Bank Loan', r: .06, max: function () { var i = MO.income().work; return i > 0 && !G.S.p.crime.rec ? i * 3 : 0; } },
    { k: 'online', n: '网络贷款|Online Lender', r: .36, max: function () { return G.S.p.age >= 18 ? G.$(6000) : 0; }, y0: 2010 },
    { k: 'shark', n: '高利贷|Loan Shark', r: 1, max: function () { return G.S.p.age >= 18 ? G.$(60000) : 0; } }
  ];
  MO.borrow = function (L, amt) { G.S.assets.debt.push({ k: L.k, n: L.n, amt: amt, r: L.r }); G.addMoney(amt); G.inc('loans'); };
  MO.repay = function (d, amt) { amt = Math.min(amt, d.amt, G.S.p.money); if (amt <= 0) return 0; d.amt -= amt; G.addMoney(-amt); G.S.assets.debt = G.S.assets.debt.filter(function (x) { return x.amt > 1; }); return amt; };
  /* ---------- lottery ---------- */
  MO.lottery = function (n) {
    var price = G.$(2), cost = price * n;
    if (!G.pay(cost)) return null;
    var win = 0, jack = false, mult = G.has('lucky') ? 2 : G.has('unlucky') ? .5 : 1;
    for (var i = 0; i < n; i++) {
      var r = G.R();
      if (r < 4e-7 * mult) { win += G.$(5000000); jack = true; }
      else if (r < 2e-5 * mult) win += G.$(20000);
      else if (r < 1e-3 * mult) win += G.$(200);
      else if (r < .06) win += price * 2;
    }
    G.addStat('gamble', n > 50 ? 2 : 0, true);
    if (win) G.addMoney(win);
    if (jack) { G.major('中了彩票头奖！|Won the lottery jackpot!'); G.inc('jackpot'); G.addStat('happy', 30); }
    return { win: win, cost: cost, jack: jack };
  };
  /* ---------- emigration ---------- */
  MO.emigrate = function (to, quiet) {
    var S = G.S, p = S.p, from = p.country, y = S.year;
    var f = G.$f(to, y) / G.$f(from, y);
    p.money = Math.round(p.money * f);
    var A = S.assets;
    A.houses.forEach(function (h) { h.val = Math.round(h.val * f); h.mort = Math.round((h.mort || 0) * f); h.pay = Math.round((h.pay || 0) * f); h.live = false; });
    A.cars.forEach(function (x) { x.val = Math.round(x.val * f); });
    A.items.forEach(function (x) { x.val = Math.round(x.val * f); });
    for (var k in A.inv) A.inv[k] = Math.round(A.inv[k] * f);
    A.debt.forEach(function (d) { d.amt = Math.round(d.amt * f); });
    if (A.company) { A.company.val = Math.round(A.company.val * f); A.company.base = Math.round(A.company.base * f); }
    G.N.all().forEach(function (n) { if (n.rel === 'spouse' || n.rel === 'lover' || n.rel === 'child') { n.wealth = Math.round(n.wealth * f); n.inc = Math.round((n.inc || 0) * f); n.c = to; } });
    if (p.job) { p.job.sal = Math.round(p.job.sal * G.$f(to, y) / G.$f(from, y) * (G.C[to].wg / G.C[to].pl) / (G.C[from].wg / G.C[from].pl)); if (!G.JOB[p.job.id].pt && !quiet) G.career.leave(); }
    p.gov = null; p.pol = null; if (p.mil && !p.mil.cons) p.mil = null;
    p.country = to; p.tier = 2; p.city = G.pick(G.C[to].cities[2]); p.home = 'rent';
    if (p.imm.indexOf(to) < 0) p.imm.push(to);
    S.world.hpi[to] = S.world.hpi[to] || 1;
    if (p.langs.indexOf(G.C[to].lang) < 0) p.flags.langBar = 1; else p.flags.langBar = 0;
    p.flags.abroad = null;
    G.major('移民到{c}|Emigrated to {c}', { c: G.C[to].n });
    G.inc('emigrate');
  };
})();
