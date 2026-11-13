/* Parenting plan: raise a child frugally or lavishly, hire a nanny, get them visas or a second citizenship,
   and place your grown children in positions — in any country. Everything about one child lives on one page. */
(function () {
  'use strict';
  var N = G.N, FA = G.family;
  function S() { return G.S; }
  function res(a, t, prm, dl) { return G.result(a.n, t, prm, dl || [], a.i); }
  var PLAN = ['kschool', 'kallow', 'kraise', 'knanny', 'kvisa', 'kplace', 'kjob', 'kidclass', 'classes', 'strict', 'abroad', 'givemoney', 'buyhome', 'homework', 'support'];
  var RAISE = {
    poor: { n: '穷养|Raised Frugally', d: '吃穿够用就好，零花钱很少，凡事自己动手。|Enough to live on, little pocket money, do things yourself.', fx: { eq: .6, smarts: .3, happy: -.5 }, cost: 0 },
    norm: { n: '普通养|Raised Normally', d: '该给的给，该管的管。|Give what\'s needed, guide where needed.', fx: {}, cost: 0 },
    rich: { n: '富养|Raised in Comfort', d: '见世面、学才艺、穿好吃好，但容易被宠坏。|Travel, lessons, the best of everything — at the risk of spoiling them.', fx: { happy: .7, looks: .3, eq: .2, smarts: .2 }, cost: 12000 }
  };
  G.RAISE = RAISE;
  var ABROAD = ['us', 'gb', 'ca', 'au', 'sg', 'jp', 'de', 'fr', 'it', 'es', 'kr', 'cn', 'nz', 'ch', 'ie', 'at', 'pt', 'th', 'br', 'mx', 'ar', 'za', 'ru', 'in'];
  var CIT_COST = { us: 900000, gb: 2500000, ca: 1200000, au: 1500000, sg: 2500000, jp: 600000, de: 400000, fr: 500000, it: 300000, es: 600000, kr: 600000, cn: 0, ru: 300000, in: 300000, br: 200000, mx: 200000, th: 300000, za: 200000, nz: 1200000, ch: 3000000, ie: 900000, at: 800000, pt: 350000, ar: 150000 };

  var acts0 = G.npcActs;
  G.npcActs = function (n) {
    var out = acts0.apply(this, arguments), p = S().p;
    if (!n.alive || p.jail || n.rel !== 'child') return out;
    var a = N.age(n), add = [];
    add.push({ id: 'kraise', n: '养育方式|Parenting Style', i: '🧺', e: 0, if: function () { return a < 18; }, run: async function (k, act) {
      var ids = ['poor', 'norm', 'rich'], cur = k.raise || 'norm';
      var i = await G.UI.pick({ title: G.L('怎么养{n}？|How will you raise {n}?', { n: k.name }), items: ids.map(function (id) { var r = RAISE[id]; return { t: r.n, sub: (id === cur ? G.T('（当前）|(current) ') : '') + (r.cost ? G.T(G.L('每年{m}|{m} / yr', { m: G.M(G.$w(r.cost)) })) + ' · ' : '') + G.T(r.d) }; }) });
      if (i < 0) return 'cancel';
      k.raise = ids[i];
      return res(act, k.raise === 'poor' ? '你决定穷养{n}：东西要自己挣，钱要省着花。|You\'ll raise {n} frugally: earn what you want, spend with care.' : k.raise === 'rich' ? '你决定富养{n}：见最好的世面，用最好的东西。|You\'ll raise {n} in comfort: the best experiences, the best of everything.' : '你决定像普通人家一样养{n}。|You\'ll raise {n} like any ordinary family would.', { n: k.name });
    } });
    add.push({ id: 'knanny', n: n.nanny ? '辞退育儿保姆|Let the Nanny Go' : '聘请育儿保姆|Hire a Nanny', i: '👩‍🍼', e: 0, if: function () { return a < 14; },
      lock: function () { return n.nanny ? null : (G.vip.tier() >= 3 ? null : '钻石会员专享：聘请专业育儿保姆。|Diamond VIP only: hire a professional nanny.'); },
      run: async function (k, act) {
        if (k.nanny) { var old = S().npcs[k.nanny]; if (old) { old.rel = 'contact'; old.pin = 0; } k.nanny = 0; return res(act, '保姆走的那天，{n}哭了很久。|The day the nanny left, {n} cried for a long time.', { n: k.name }); }
        var fee = G.$w(18000), ok = await G.UI.confirm(G.L(act.n), G.L('专业育儿保姆每年{m}，会全方位照顾和培养{n}。|A professional nanny costs {m} a year and will care for and teach {n} in every way.', { m: G.M(fee), n: k.name }));
        if (!ok) return 'cancel';
        var nn = N.make({ rel: 'staff', g: 'f', age: G.ri(32, 52), job: '育儿保姆|Nanny', inc: fee, aff: 50, pers: G.pick(['gentle', 'kind', 'worrier', 'calm']) }); nn.pin = 1; nn.staffT = '育儿保姆|Nanny';
        k.nanny = nn.id; G.dStart(); G.dPush('aff', N.addAff(k, 5)); var dl = G.dEnd();
        return res(act, '{m}成了{n}的保姆。{n}很快就离不开她了。|{m} became {n}\'s nanny. Before long {n} couldn\'t do without her.', { m: nn.name, n: k.name }, dl);
      } });
    add.push({ id: 'kvisa', n: '签证与国籍|Visas & Citizenship', i: '🛂', e: 10, run: async function (k, act) {
      var cs = ABROAD.filter(function (c) { return c !== (k.c || p.country) && G.C[c]; }).sort(function (a, b) { return (G.rivalBlock && G.rivalBlock(a) ? 1 : 0) - (G.rivalBlock && G.rivalBlock(b) ? 1 : 0); });
      var ci = await G.UI.pick({ title: G.L('为{n}办理哪国的身份？|Which country for {n}?', { n: k.name }), items: cs.map(function (c) { var rb = G.rivalBlock && G.rivalBlock(c); if (rb) return { t: G.C[c].n, icon: G.C[c].flag, sub: G.T(rb), dis: true }; return { t: G.C[c].n, icon: G.C[c].flag, sub: G.T(G.L('投资入籍约{m}|Citizenship by investment ~{m}', { m: G.M(G.$(CIT_COST[c] || 800000)) })) }; }) });
      if (ci < 0) return 'cancel';
      var c = cs[ci];
      var kinds = [{ t: G.L('留学签证|Student visa'), sub: G.L('去那里读书|Study there'), k: 'study' }, { t: G.L('工作签证|Work visa'), sub: G.L('去那里工作|Work there'), k: 'work' }, { t: G.L('投资入籍|Citizenship by investment'), sub: G.L('拿到那个国家的国籍|Become a citizen', {}), k: 'cit' }];
      if (N.age(k) < 18) kinds = kinds.filter(function (x) { return x.k !== 'work'; });
      var ki = await G.UI.pick({ title: G.L('办理什么？|What kind?'), items: kinds });
      if (ki < 0) return 'cancel';
      var kd = kinds[ki].k, cost = kd === 'cit' ? G.$(CIT_COST[c] || 800000) : G.$(kd === 'study' ? 3000 : 6000);
      if (!(await G.kidPayAsk(k, cost))) { G.UI.toast('钱不够|Not enough money'); return 'cancel'; }
      var ch = kd === 'cit' ? .75 : kd === 'study' ? .8 + (k.smarts - 50) / 300 : .55 + (k.smarts - 50) / 250;
      G.dStart();
      if (!G.ch(ch)) { var dl0 = G.dEnd(); return res(act, '{c}拒绝了{n}的申请，钱打了水漂。|{c} turned down {n}\'s application. The money\'s gone.', { c: G.C[c].n, n: k.name }, dl0); }
      k.visa = k.visa || {}; k.visa[c] = kd;
      var lost = null;
      if (kd === 'cit') { k.cits = (k.cits || [k.c || p.country]); if (k.cits.indexOf(c) < 0) k.cits.push(c); var nd = k.cits.filter(function (x) { return x !== c && G.NODUAL && G.NODUAL[x]; }); if (nd.length || (G.NODUAL && G.NODUAL[c])) { lost = (G.NODUAL[c] ? k.cits.filter(function (x) { return x !== c; }) : nd); k.cits = k.cits.filter(function (x) { return lost.indexOf(x) < 0; }); if (lost.length) G.log('{c}不承认双重国籍，{n}拿到新国籍的同时放弃了{o}国籍。|{c} doesn\'t allow dual citizenship: in becoming a citizen, {n} gave up {o} citizenship.', { c: G.C[G.NODUAL[c] ? c : lost[0]].n, n: k.name, o: lost.map(function (x) { return G.T(G.C[x].n); }).join('、') }); } }
      if (kd === 'work' || kd === 'cit') { if (N.age(k) >= 18) k.c = c; }
      if (kd === 'study' && k.edu && N.age(k) < 22) { k.schC = c; }
      G.dPush('aff', N.addAff(k, 6)); var dl = G.dEnd();
      return res(act, kd === 'cit' ? '{n}拿到了{c}国籍，护照上多了一个国家。|{n} became a citizen of {c} — another passport in the drawer.' : kd === 'work' ? '{n}拿到了{c}的工作签证，搬去了那里。|{n} got a work visa for {c} and moved there.' : '{n}拿到了{c}的留学签证。|{n} got a student visa for {c}.', { n: k.name, c: G.C[c].n }, dl);
    } });
    add.push({ id: 'kplace', n: '为{him}安排职位|Arrange a Position', i: '🧑‍💼', e: 15, if: function () { return a >= 20; }, run: async function (k, act) {
      var cs = [k.c || p.country].concat((k.cits || []).filter(function (c) { return c !== (k.c || p.country); })).concat(Object.keys(k.visa || {}).filter(function (c) { return k.visa[c] === 'work'; }));
      cs = cs.filter(function (c, i) { return cs.indexOf(c) === i && G.C[c]; });
      var c = cs[0];
      if (cs.length > 1) { var ci = await G.UI.pick({ title: G.L('在哪个国家？|In which country?'), items: cs.map(function (x) { return { t: G.C[x].n, icon: G.C[x].flag }; }) }); if (ci < 0) return 'cancel'; c = cs[ci]; }
      var st = G.status ? G.status() : 0, deg = (k.edu && k.edu.deg) || 0;
      var POS = [
        { n: '你公司的高管|Executive at Your Company', u: 220000, need: function () { return !!S().assets.company; }, ch: .95, fee: 0 },
        { n: '投资银行分析师|Investment Bank Analyst', u: 150000, deg: 4, ch: .5, fee: 20000 },
        { n: '律师事务所律师|Law Firm Associate', u: 120000, deg: 4, ch: .5, fee: 15000 },
        { n: '医院医生|Hospital Doctor', u: 140000, deg: 5, ch: .45, fee: 20000 },
        { n: '科技公司工程师|Tech Company Engineer', u: 130000, deg: 4, ch: .55, fee: 10000 },
        { n: '大学讲师|University Lecturer', u: 80000, deg: 6, ch: .5, fee: 10000 },
        { n: '外交官|Diplomat', u: 100000, deg: 4, ch: .25, fee: 40000, st: 2 },
        { n: '政府官员|Government Official', u: 70000, deg: 4, ch: .35, fee: 30000, st: 2, home: 1 },
        { n: '军官|Army Officer', u: 70000, deg: 3, ch: .45, fee: 10000, home: 1 },
        { n: '国企管理层|State Enterprise Manager', u: 110000, deg: 4, ch: .4, fee: 30000, st: 1, home: 1 },
        { n: '商店店长|Store Manager', u: 50000, deg: 0, ch: .8, fee: 3000 }
      ].filter(function (x) { return (!x.need || x.need()) && (!x.home || c === p.country); });
      var items = POS.map(function (x) { var ok = deg >= (x.deg || 0) && st >= (x.st || 0); return { t: x.n, sub: G.T(G.L('年薪约{s} · 打点{f}|~{s}/yr · {f} in favors', { s: G.M(G.$w(x.u, c)), f: G.M(G.$(x.fee)) })) + (deg < (x.deg || 0) ? G.T(' · 学历不够| · Degree too low') : '') + (st < (x.st || 0) ? G.T(' · 你的地位不够| · You lack the standing') : ''), dis: !ok }; });
      var i = await G.UI.pick({ title: G.L('给{n}安排什么职位？|What position for {n}?', { n: k.name }), items: items });
      if (i < 0) return 'cancel';
      var x = POS[i];
      if (x.fee && !G.payKid(k, G.$(x.fee))) { G.UI.toast('钱不够|Not enough money'); return 'cancel'; }
      G.dStart();
      var ch = x.ch + (k.smarts - 50) / 250 + st * .08 + (G.famClass ? G.famClass() * .04 : 0);
      if (!G.ch(ch)) { G.dPush('aff', N.addAff(k, -2)); var dl0 = G.dEnd(); return res(act, '对方婉拒了，说{n}“还需要历练”。|They declined politely: {n} "needs more experience."', { n: k.name }, dl0); }
      k.jobBase = x.n; k.jobT = x.n; k.jr = 0; k.jy = 0; k.unemp = 0; k.neet = 0; k.c = c; k.inc = G.$w(x.u * G.rf(.85, 1.15), c); k.job = x.n; k.connected = 1;
      var pr = ['proud', 'rebel', 'stubborn'].indexOf(k.pers) >= 0;
      G.dPush('aff', N.addAff(k, pr ? -6 : 8)); var dl = G.dEnd();
      return res(act, pr ? '{n}去了{c}做{j}，却说：“我本来想靠自己的。”|{n} took the {j} post in {c}, but said: "I wanted to make it on my own."' : '{n}在{c}当上了{j}。|{n} is now a {j} in {c}.', { n: k.name, c: G.C[c].n, j: x.n }, dl);
    } });
    add.push({ id: 'kplan', n: '育儿方案|Parenting Plan', i: '👪', e: 0, run: function (k) { if (G.UI.parentPlan) G.UI.parentPlan(k); return 'cancel'; } });
    // everything sits directly on the child's profile — no extra page; duplicates are dropped
    var all = out.concat(add.filter(function (x) { return x.id !== 'kplan'; }));
    var drop = ['classes', 'support', 'kjob', 'setup', 'abroad'];
    if (!all.some(function (x) { return x.id === 'kidclass'; })) drop.splice(drop.indexOf('classes'), 1);
    if (!all.some(function (x) { return x.id === 'givemoney'; })) drop.splice(drop.indexOf('support'), 1);
    if (!all.some(function (x) { return x.id === 'match'; })) drop.splice(drop.indexOf('setup'), 1);
    return all.filter(function (x) { return drop.indexOf(x.id) < 0; });
  };

  /* yearly effects: raising style and nanny */
  var grow = FA.growKid;
  FA.growKid = function (k, Q) {
    var a = N.age(k), p = S().p;
    if (k.alive && a < 18) {
      var r = RAISE[k.raise || 'norm'];
      if (r.cost) { if (!p.jail && G.pay(G.$w(r.cost))) { for (var s in r.fx) k[s] = G.clamp((k[s] || 50) + r.fx[s] * G.rf(.5, 1.3), 1, 100); if (G.ch(.12)) k.spoiled = (k.spoiled || 0) + 1; } else k.raise = 'norm'; }
      else for (var s2 in r.fx) k[s2] = G.clamp((k[s2] || 50) + r.fx[s2] * G.rf(.5, 1.3), 1, 100);
      if (k.raise === 'poor' && a >= 10 && G.ch(.08)) N.addAff(k, -3);
      if (k.nanny) {
        var nn = S().npcs[k.nanny];
        if (!nn || !nn.alive || a >= 14) { if (nn) { nn.rel = 'contact'; nn.pin = 0; } k.nanny = 0; if (a >= 14) G.log('{n}长大了，保姆完成了她的使命。|{n} has grown up; the nanny\'s work is done.', { n: k.name }); }
        else if (G.payHalf ? G.payHalf(k, nn.inc || G.$w(18000)) : G.pay(nn.inc || G.$w(18000))) { k.smarts = G.clamp(k.smarts + G.rf(.6, 1.4), 1, 100); k.eq = G.clamp((k.eq || 50) + G.rf(.6, 1.4), 1, 100); k.health = G.clamp((k.health || 70) + 1, 1, 100); k.looks = G.clamp((k.looks || 50) + G.rf(0, .6), 1, 100); }
        else { nn.rel = 'contact'; nn.pin = 0; k.nanny = 0; G.log('你付不起保姆的工资，她离开了。|You couldn\'t pay the nanny, and she left.'); }
      }
    }
    return grow.apply(this, arguments);
  };
  var info0 = G.npcInfo;
  G.npcInfo = function (n) {
    var r = info0.apply(this, arguments);
    if (n.rel === 'child') {
      if (n.raise && n.raise !== 'norm' && N.age(n) < 18) r.push(['养育|Upbringing', RAISE[n.raise].n]);
      if (n.nanny && S().npcs[n.nanny]) r.push(['保姆|Nanny', S().npcs[n.nanny].name]);
      var cits = n.cits || [n.c || S().p.country]; r.push(['国籍|Nationality', cits.map(function (c) { return G.C[c] ? G.C[c].flag + ' ' + G.T(G.C[c].n) : c; }).join(' / ')]);
      if (n.visa) { var vs = Object.keys(n.visa).filter(function (c) { return n.visa[c] !== 'cit'; }); if (vs.length) r.push(['签证|Visas', vs.map(function (c) { return G.C[c].flag; }).join(' ')]); }
    }
    return r;
  };
})();
