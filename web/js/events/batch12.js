/* Batch 12 (version 1.4): the whole estate to the heir you choose, a will prompt at 65, real outcomes for
   whistleblowing, probabilities instead of certainties, harder top universities, a working-hours limit,
   a rewritten score with distinctive titles, honorary titles instead of "unemployed"/"retired", housing,
   children who support you in old age by their own nature, surname choice, renaming, matchmaking from a
   list, study-abroad advice, rules for families inside China's state system, real life stories for people. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC, FA = G.family, LO = G.love, ES = G.estate;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function setN(c, n) { c.npc = n; c.prm.n = n.name; var pr = G.pr ? G.pr(n.g) : {}; for (var k in pr) c.prm[k] = pr[k]; }
  function hash(s) { var h = 2166136261; s = String(s); for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  /* ================= money tokens never print as "[object Object]" ================= */
  var M0 = G.M;
  G.M = function (n, cid) { var o = M0(n, cid); try { Object.defineProperty(o, 'toString', { value: function () { return G.fm(this.m, this.c); }, enumerable: false }); } catch (e) { } return o; };
  var T0 = G.T;
  G.T = function (s, prm) { if (s && typeof s === 'object' && 'm' in s && 'c' in s) return G.fm(s.m, s.c); return T0.apply(this, arguments); };

  /* ================= an outcome that says you were fired really fires you ================= */
  var fx0 = H.fx;
  H.fx = function (c, eff) {
    if (eff && eff.fire) { var e2 = Object.assign({}, eff); delete e2.fire; fx0.call(this, c, e2); if (c.p.job) { G.career.leave(true); G.major('被公司开除|Fired by the company'); } return; }
    return fx0.apply(this, arguments);
  };

  /* ================= things are seldom certain ================= */
  function tiers(c, list) { var r = Math.random(), acc = 0; for (var i = 0; i < list.length; i++) { acc += list[i][0]; if (r < acc) { H.fx(c, list[i][2]); return list[i][1]; } } var l = list[list.length - 1]; H.fx(c, l[2]); return l[1]; }
  function setOpt(id, i, fn) { var d = G.EV[id]; if (d && d.o && d.o[i]) d.o[i].run = fn; }
  setOpt('w_pie', 0, function (c) { return tiers(c, [
    [.22, '公司真的上市了，你的期权值了一大笔钱！|The company really went public, and your options are worth a fortune!', { money: 40000, happy: 15 }],
    [.28, '没上市，但老板兑现了一半：你升职加薪了。|No IPO, but the boss kept half his word: you got a promotion and a raise.', { money: 8000, happy: 6, perf: 10 }],
    [.5, '一年后公司没上市，老板又画了新的饼。|A year later, no IPO — just a new round of promises.', { stress: 10, perf: 5 }]]); });
  setOpt('w_pie', 1, function (c) { return tiers(c, [
    [.15, '公司居然上市了。你手里那点期权也值了不少。|The company actually listed — even your few options are worth something.', { money: 10000, happy: 6 }],
    [.85, '你继续按部就班。|You keep doing your job as usual.', {}]]); });
  setOpt('a_mlm', 0, function (c) { return tiers(c, [
    [.12, '你跑得早，居然赚了一笔。|You got out early and actually made money.', { money: 4000, happy: 4, karma: -3 }],
    [.25, '你发现不对，赶紧退出，只拿回了一半。|You smelled a rat and pulled out — you got half back.', { money: -1500, happy: -3, smarts: 2 }],
    [.63, '这是传销！你血本无归，还被拉黑了不少朋友。|It was a pyramid scheme! You lost everything and alienated friends.', { money: -3000, happy: -10 }]]); });
  setOpt('a_trust_pitch', 0, function (c) {
    var m = Math.round(Math.max(0, c.p.money) * .2); c.money(-m); c.prm.m = G.M(m);
    var r = Math.random();
    if (r < .2) { c.money(Math.round(m * G.rf(1.2, 1.5))); return '两年下来真的拿到了利息，本金也回来了。|Two years on, the interest really came and so did the principal.'; }
    if (r < .45) { c.money(Math.round(m * G.rf(.4, .7))); H.fx(c, { happy: -4 }); return '项目暴雷前你撤了出来，拿回了一部分。|You got out before it collapsed and recovered part of it.'; }
    H.fx(c, { happy: -10 }); return '对方失联了，{m}打了水漂。|They vanished — {m} gone.';
  });

  /* ================= top universities are harder to reach ================= */
  var SC = G.school;
  SC.maxTier = function (sc) { return sc >= 95 ? 5 : sc >= 83 ? 4 : sc >= 66 ? 3 : sc >= 45 ? 2 : 1; };
  var adm0 = SC.admitChance;
  SC.admitChance = function (uniT, sc) { var v = adm0.apply(this, arguments); return uniT >= 5 ? v * .7 : v; };

  /* ================= the whole estate goes to the heir you name ================= */
  var plan0 = ES.plan;
  ES.plan = function () {
    var pl = plan0.apply(this, arguments), w = ES.will(), m = w && w.main && S().npcs[w.main];
    if (w && w.mode === 'one' && m && m.alive) {
      pl.share = {}; pl.share[m.id] = 1; pl.main = m.id; pl.company = m.id; pl.charity = 0;
      Object.keys(pl.houses).forEach(function (k) { pl.houses[k] = m.id; });
    }
    return pl;
  };
  ES.risk = function () { return 0; };
  ES.heir = function () { var w = ES.will(), m = w && w.mode === 'one' && w.main && S().npcs[w.main]; return m && m.alive ? m : null; };
  var comp0 = G.ending.compute;
  G.ending.compute = function () {
    var d = comp0.apply(this, arguments), h = ES.heir();
    if (h && d.heirs) { d.heirs = d.heirs.filter(function (x) { return x.id === h.id; }); if (!d.heirs.length) d.heirs = [{ id: h.id, name: h.name, age: N.age(h), g: h.g }]; d.heirOnly = 1; }
    return d;
  };
  // whoever you continue as receives everything; nobody else gets a share
  var cont12 = G.life.continueAs;
  G.life.continueAs = function (kid) {
    var d = S().ending, est = d && d.estate;
    if (est && est.lines) {
      var total = est.total - (est.tax || 0) - (est.charity || 0);
      est.lines = [{ id: kid.id, name: kid.name, amt: total, pct: 100, houses: [], company: !!S().assets.company }];
      est.plan.share = {}; est.plan.share[kid.id] = 1; est.plan.company = kid.id;
      Object.keys(est.plan.houses || {}).forEach(function (k) { est.plan.houses[k] = kid.id; });
    }
    var sp = N.partner(), spW = sp ? sp.wealth : 0;
    var visaCits = Object.keys(kid.visa || {}).filter(function (c) { return kid.visa[c] === 'cit'; });
    var cits = (kid.cits || []).concat(visaCits).filter(function (c, i, a) { return a.indexOf(c) === i; });
    var r = cont12.apply(this, arguments);
    if (sp) sp.wealth = spW; // the surviving parent does not take half
    // the lineage entry carries the full record (grade, timeline) of the life just finished
    var L = S().lineage || [], last = (G.meta.lives || []).filter(function (x) { return x.name === (L[L.length - 1] || {}).name; }).sort(function (a, b) { return b.at - a.at; })[0];
    if (L.length && last) Object.assign(L[L.length - 1], { title: last.title, score: last.score, grade: last.grade, td: last.td, ep: last.ep, cause: last.cause, nw: last.nw, cur: last.cur, tl: last.tl, gen: last.gen, org: last.org, c: last.c, g: last.g, age: last.age });
    if (cits.length) P().cits = cits;
    return r;
  };
  // the will-changing squabbles are gone
  ['k_rival_flatter', 'k_rival_care'].forEach(function (id) { delete G.EV[id]; });
  G.EVL = G.EVL.filter(function (d) { return G.EV[d.id] === d; });

  /* the will: name one heir */
  G.writeWillSimple = async function () {
    var ks = N.rel('child').filter(function (k) { return k.alive; }).sort(function (a, b) { return a.by - b.by; }).concat(N.rel('grandchild').filter(function (k) { return k.alive; }).sort(function (a, b) { return a.by - b.by; }));
    if (!ks.length) { G.UI.toast(G.L('你还没有孩子可以继承。|You have no children to inherit yet.')); return false; }
    var i = await G.UI.pick({ title: G.L('立遗嘱：指定继承人|Your Will: Name Your Heir'), text: G.L('全部遗产（钱、房子、公司）都留给这一个人（可以是孙辈）。你去世后，也会以这个人的身份继续人生。|Everything — money, homes, company — goes to this one person (a grandchild is fine). After you die, you\'ll continue life as them.'),
      items: ks.map(function (k) { return { t: G.L(k.name), sub: G.L('{r} · {a}岁 · {j}|{r} · age {a} · {j}', { r: N.relName(k), a: N.age(k), j: k.job || '—' }), npc: k }; }) });
    if (i < 0) return false;
    var k = ks[i]; P().will = { mode: 'one', main: k.id, mainPct: 1, y: S().year, cut: {}, houses: {}, notary: 1 };
    G.major('立下遗嘱：全部留给{n}|Made a will: everything to {n}', { n: k.name });
    return k;
  };
  G.ACT_CATS.forEach(function (c) { (c.items || []).forEach(function (a) {
    if (a.id === 'will') a.run = async function (act) { var k = await G.writeWillSimple(); if (!k) return 'cancel'; return G.result(act.n, '遗嘱已经公证：全部遗产都留给{n}。|Your will is notarised: everything goes to {n}.', { n: k.name }, [], act.i); };
    if (a.id === 'viewwill') a.run = async function (act) {
      var h = ES.heir(), nw = G.netWorth(), A = S().assets;
      var z = [], e = [];
      if (h) { z.push('继承人：' + G.T(h.name).split('|')[0] + '（全部遗产）'); e.push('Heir: ' + (String(h.name).split('|')[1] || h.name) + ' (the whole estate)'); }
      else { z.push('你还没有立遗嘱。去世后由你选择以哪个孩子的身份继续，全部遗产归那个孩子。'); e.push('No will yet. When you die, the child you continue as receives everything.'); }
      z.push('当前身家：' + G.fmL(nw, null, 0)); e.push('Current net worth: ' + G.fmL(nw, null, 1));
      A.houses.forEach(function (x) { z.push('🏠 ' + String(x.n).split('|')[0]); e.push('🏠 ' + (String(x.n).split('|')[1] || x.n)); });
      if (A.company) { z.push('🏢 ' + String(A.company.name).split('|')[0]); e.push('🏢 ' + (String(A.company.name).split('|')[1] || A.company.name)); }
      return G.result(act.n, z.join('\n').replace(/\|/g, '/') + '|' + e.join('\n').replace(/\|/g, '/'), null, [], act.i);
    };
  }); });
  G.evs([{ id: 'will_prompt', sys: 1, title: '该立遗嘱了|Time for a Will', icon: '📜',
    t: '你六十五岁了。律师朋友提醒你：早点把遗产安排好，家里才不会乱。|You\'re sixty-five. A lawyer friend suggests settling your estate now, so the family won\'t be thrown into disorder.',
    o: [{ t: '现在就立遗嘱|Write it now', run: async function (c) { var k = await G.writeWillSimple(); return k ? G.L('全部遗产都留给{n}。|Everything goes to {n}.', { n: k.name }) : '你想了想，还是先放一放。|You thought it over and put it off.'; } },
      { t: '以后再说|Later', run: function () { return '你把律师的名片收进了抽屉。|You put the lawyer\'s card in a drawer.'; } }] }]);

  /* ================= work has a yearly limit: 60 energy ================= */
  G.WORK_CAP = 60;
  G.isWorkAct = function (a) {
    if (!a || !a.e) return false;
    var hustle = (G.ACT_CATS.filter(function (c) { return c.id === 'hustle'; })[0] || { items: [] }).items;
    return (G.ACT_JOB || []).indexOf(a) >= 0 || (G.ACT_BIZ || []).indexOf(a) >= 0 || hustle.indexOf(a) >= 0 || /^jx_/.test(a.id);
  };
  G.workUsed = function () { var f = P().flags; return f.workY === S().year ? (f.workE || 0) : 0; };
  G.addWork = function (e) { var f = P().flags; if (f.workY !== S().year) { f.workY = S().year; f.workE = 0; } f.workE += e; };

  /* ================= honorary titles instead of "unemployed" or "retired" ================= */
  var HONORS = [
    ['found', '慈善基金会名誉主席|Honorary Chair of a Charitable Foundation', '🎗️'],
    ['relief', '国际救援联盟荣誉理事|Honorary Trustee, International Relief Alliance', '🌍'],
    ['art', '艺术基金会荣誉会长|Honorary President of an Arts Foundation', '🎨'],
    ['uni', '大学校董|University Trustee', '🎓'],
    ['museum', '博物馆名誉馆长|Honorary Museum Director', '🏛️'],
    ['child', '儿童福利基金会名誉会长|Honorary President, Children\'s Welfare Fund', '🧸']
  ];
  G.HONOR_FEE = 2e6;
  G.ACT_CATS = G.ACT_CATS.filter(function (c) { return c.id !== 'heir'; });
  G.ACT_CATS.push({ id: 'honor', n: '名誉头衔|Honorary Titles', i: '🎖️', items: [
    { id: 'honor_take', n: '出任名誉职位|Take an Honorary Post', i: '🎗️', d: '每年会费200万美元，名声每年上涨|$2M a year in dues; your fame grows every year', e: 0, a: [20, 120],
      if: function () { return !P().honor; },
      run: async function (a) {
        var fee = G.$(G.HONOR_FEE);
        var i = await G.UI.pick({ title: G.L('选择名誉职位|Choose an Honorary Post'), text: G.L('每年需交{m}。交不起时，头衔会被收回。|Dues are {m} a year. If you can\'t pay, the title is withdrawn.', { m: G.M(fee) }),
          items: HONORS.map(function (x) { return { t: G.L(x[1]), icon: x[2], dis: !G.canPay(fee) }; }) });
        if (i < 0 || !G.pay(fee)) return 'cancel';
        P().honor = { id: HONORS[i][0], n: HONORS[i][1], y: S().year, paidY: S().year }; G.major('出任{x}|Became {x}', { x: HONORS[i][1] });
        return G.quick(a, G.L('就职典礼上，你剪了彩，致了辞，第二天上了报纸。|At the ceremony you cut the ribbon and gave a speech; the next day you were in the papers.'), { fame: 6, karma: 3, happy: 5 });
      } },
    { id: 'honor_quit', n: '卸任名誉职位|Step Down from Your Honorary Post', i: '🚪', e: 0, a: [20, 120], if: function () { return !!P().honor; },
      run: async function (a) { var h = P().honor; P().honor = null; return G.quick(a, G.L('你卸任了{x}。|You stepped down as {x}.', { x: h.n }), { fame: -2 }); } }
  ] });
  var title12 = G.title;
  G.title = function () {
    var t = title12.apply(this, arguments), p = P();
    if (S().dead) return t;
    if (p.honor && /无业|Unemployed|退休|Retired|富二代|Heir to a Fortune|家族继承人|Family Heir|财务自由|Financially Independent|自由职业|Freelance|颐养天年/.test(t)) return p.honor.n;
    if (t === '无业|Unemployed') return p.age >= 60 ? '颐养天年|Enjoying Life' : '自由职业|Freelance';
    if (t === '退休|Retired') return '颐养天年|Enjoying Life';
    return t;
  };

  /* ================= housing ================= */
  var RENT = [
    [1, '合租单间|A Room in a Shared Flat', '🛏️', 4000, -3],
    [2, '一居室公寓|A One-Bedroom Apartment', '🏢', 9000, -2],
    [3, '高档服务式公寓|A Serviced Luxury Apartment', '🏙️', 26000, -1]
  ];
  G.RENT = RENT;
  function owns() { var p = P(); return S().assets.houses.some(function (h) { return h.live; }) || (p.home && p.home !== 'rent' && p.home !== 'parents'); }
  G.chooseRent = async function () {
    var i = await G.UI.pick({ title: G.L('租房|Renting'), text: G.L('租的房子越差，住得越憋屈，身体越容易出问题。|The worse the place, the more your health suffers.'),
      items: RENT.map(function (x) { var m = G.$(x[3]); return { t: G.L(x[1]), sub: G.L('每年{m} · 健康每年{h}|{m}/yr · health {h}/yr', { m: G.M(m), h: x[4] }), icon: x[2] }; }) });
    if (i < 0) return false;
    var p = P(); p.home = 'rent'; p.rent = { t: RENT[i][0], since: S().year };
    S().assets.houses.forEach(function (h) { h.live = false; });
    G.log('你搬进了{x}。|You moved into {x}.', { x: RENT[i][1] }); return true;
  };
  function buyAct() { var a = null; G.ACT_CATS.forEach(function (c) { c.items.forEach(function (x) { if (x.id === 'house') a = x; }); }); return a; }
  G.evs([{ id: 'grad_home', sys: 1, title: '住哪里？|Where Will You Live?', icon: '🏠',
    t: '毕业了，该搬出学校宿舍了。你打算租房，还是买房？|You\'ve graduated and must leave the dorm. Rent, or buy?',
    o: [{ t: '租房|Rent', run: async function (c) { var ok = await G.chooseRent(); return ok ? '你拿到了钥匙，开始了一个人的生活。|You got the keys and began life on your own.' : '你暂时在朋友家借住。|You crashed at a friend\'s place for now.'; } },
      { t: '买房|Buy', run: async function (c) { var a = buyAct(); if (a) { try { await a.run(a); } catch (e) { } } return owns() ? '你有了自己的房子。|You have a home of your own.' : '看了一圈，还是先租着吧。|After looking around, you decided to rent for now.'; } },
      { t: '先回爸妈家住|Move back in with your parents', if: function () { return N.rel('father', 'mother').length > 0; }, run: function (c) { c.p.home = 'parents'; c.p.rent = null; H.fx(c, { par: 3 }); return '妈妈把你的房间收拾得和以前一模一样。|Mom kept your room exactly as it was.'; } }] }]);
  var run12 = G.runEvent;
  G.runEvent = async function (id, prm, nid) {
    var r = await run12.apply(this, arguments);
    var s = S();
    if (s && !s.dead && id === 'sys_graduate' && !owns() && !P().flags.gradHome) { P().flags.gradHome = 1; await run12.call(this, 'grad_home'); }
    if (s && nid && s.npcs[nid] && G.EV[id] && typeof G.EV[id].title === 'string' && !G.EV[id].sys) story(s.npcs[nid], G.EV[id].title);
    return r;
  };

  /* ================= what happens to you every year ================= */
  var mt12 = G.money.tick;
  G.money.tick = function () {
    var r = mt12.apply(this, arguments), s = S(), p = s.p;
    if (s.dead) return r;
    // rent and the toll of not having a home of your own
    if (p.age >= 18 && !G.school.isStudent() && !p.jail) {
      if (owns()) { /* your own roof */ }
      else if (p.home === 'parents') { if (p.age >= 26) G.addStat('health', -1, true); }
      else {
        var t = RENT.filter(function (x) { return p.rent && x[0] === p.rent.t; })[0] || RENT[0];
        var cost = G.$(t[3]); if (G.fin) G.fin.tag = G.L('房租|Rent'); G.addMoney(-cost); if (G.fin) G.fin.tag = null;
        G.addStat('health', t[4], true);
      }
    }
    // honorary dues
    if (p.honor && p.honor.paidY !== s.year) {
      var fee = G.$(G.HONOR_FEE);
      if (p.money >= fee) { G.addMoney(-fee); p.honor.paidY = s.year; G.addStat('fame', G.ri(2, 4), true); G.addStat('karma', 1, true); }
      else { G.log('交不起会费，{x}的头衔被收回了。|You couldn\'t pay the dues; the title {x} was withdrawn.', { x: p.honor.n }); p.honor = null; }
    }
    // great wealth makes you known
    var nw = G.netWorth();
    if (nw >= G.$(5e6)) G.addStat('fame', Math.min(4, Math.max(1, Math.round(Math.log10(nw / G.$(5e6)) * 2 + 1))), true);
    // career peaks, for the final score
    var f = p.flags;
    if (p.mil && p.mil.off) f.peakMil = Math.max(f.peakMil || 0, p.mil.rank + 1);
    if (p.gov) f.peakGov = Math.max(f.peakGov || 0, p.gov.rank + 1);
    if (p.pol) f.peakPol = Math.max(f.peakPol || 0, p.pol.rank + 1);
    if (p.job && G.JOB[p.job.id]) f.peakJob = Math.max(f.peakJob || 0, (p.job.rank + 1) / G.JOB[p.job.id].r.length);
    if (s.assets.company) f.peakCo = Math.max(f.peakCo || 0, s.assets.company.val || 0);
    if (p.mil) f.wasMil = 1; if (p.gov || p.pol) f.wasSys = 1;
    // a will, at sixty-five
    if (p.age === 65 && !p.will && N.rel('child').length) (s.pendQ = s.pendQ || []).push({ id: 'will_prompt' });
    // children support you in old age, each by their own nature
    if (p.age >= 60) {
      var got = 0, who = [];
      N.rel('child').forEach(function (k) {
        if (N.age(k) < 25 || !(k.inc > 0)) return;
        var fil = G.filial(k);
        if (!G.ch(fil / 130)) return;
        var amt = Math.round(k.inc * G.rf(.03, .12) * (fil / 70));
        if (amt <= 0) return; k.wealth = Math.max(0, (k.wealth || 0) - amt); got += amt; who.push(k.name);
      });
      if (got > 0) { if (G.fin) G.fin.tag = G.L('子女孝敬|From your children'); G.addMoney(got); if (G.fin) G.fin.tag = null; G.log('{w}今年给了你{m}的生活费。|{w} sent you {m} this year.', { w: G.join(who, '、', ', '), m: G.M(got) }); }
    }
    // the China state-system rule on foreign passports
    if (cnSystem() && !f.passportQ) {
      var k2 = N.rel('child').filter(function (k) { return (k.cits || []).some(function (c) { return c !== 'cn'; }); })[0];
      if (k2) { f.passportQ = s.year; (s.pendQ = s.pendQ || []).push({ id: 'cn_kid_passport', nid: k2.id }); }
    }
    return r;
  };

  /* ================= children's affection comes from who they are ================= */
  G.filial = function (k) {
    if (k.filial == null) { var b = 25 + hash(k.id + ':' + (k.av || 0)) % 70; var per = { kind: 15, loyal: 15, sweet: 10, clingy: 8, rebel: -15, cynic: -10, greedy: -12, free: -8 }; k.filial = G.clamp(b + (per[k.pers] || 0), 5, 100); }
    return k.filial;
  };
  var gk12 = FA.growKid;
  FA.growKid = function (k, Q) {
    var r = gk12.apply(this, arguments);
    if (k && k.alive && k.rel === 'child') {
      var fil = G.filial(k); k.aff = Math.round(k.aff * .85 + fil * .15);
      if (!k.richPers && N.age(k) >= 12 && G.famClass && G.famClass() >= 2) k.richPers = G.pick(['挥金如土的纨绔|Big spender', '低调务实的富二代|Low-key and practical', '被精心培养的继承人|Groomed to take over', '叛逆的艺术家|Rebel artist', '热衷公益的慈善家|Born philanthropist']);
    }
    return r;
  };

  /* ================= China's state system: no foreign passports for your children ================= */
  function cnSystem() { var p = P(); return p.country === 'cn' && (p.mil || p.pol || p.gov || (p.job && /judge|prosecutor|法官|检察/.test(p.job.id + (G.JOB[p.job.id] ? G.JOB[p.job.id].n : '')))); }
  G.cnSystem = cnSystem;
  G.evs([{ id: 'cn_kid_passport', sys: 1, title: '组织谈话|A Talk with Your Superiors', icon: '🗂️', bad: 1,
    prep: function (c) { if (!c.npc || !cnSystem()) return false; c.prm.n = c.npc.name; },
    t: '组织上找你谈话：你的孩子{n}持有外国护照，按规定，你必须做出选择。|Your superiors call you in: your child {n} holds a foreign passport. The rules say you must choose.',
    o: [{ t: '让{n}放弃外国国籍|Have {n} renounce the foreign citizenship', run: function (c) { var k = c.npc; k.cits = ['cn']; k.visa = {}; G.dPush('aff', N.addAff(k, -15)); return '{n}很不情愿地交回了护照。|{n} reluctantly surrendered the passport.'; } },
      { t: '辞去公职|Resign your post', run: function (c) { var p = c.p; if (p.mil) G.mil && G.mil.leave ? G.mil.leave() : (p.mil = null); p.gov = null; p.pol = null; if (p.job && /judge|prosecutor/.test(p.job.id)) G.career.leave(true); p.flags.passportQ = 0; G.major('因子女外籍辞去公职|Resigned over a child\'s foreign passport'); H.fx(c, { happy: -8 }); return '你交出了工作证。走出大门时，天很蓝。|You handed in your badge. Outside, the sky was very blue.'; } }] }]);
  var emi12 = G.money.emigrate;
  G.money.emigrate = function (to) {
    var p = P(), west = ['us', 'gb', 'ca', 'au', 'nz', 'fr', 'de', 'it', 'es', 'ch', 'at', 'ie', 'pt'];
    if (p.country === 'cn' && (p.flags.wasMil || p.mil) && west.indexOf(to) >= 0) { G.UI.toast && G.UI.toast(G.L('你服过役，按规定不能移民到{c}。|As a former service member, you may not emigrate to {c}.', { c: G.C[to].n })); return false; }
    return emi12.apply(this, arguments);
  };

  /* ================= real life stories, not random ones ================= */
  function story(n, t, prm) { if (!n) return; n.story = n.story || []; var x = G.L(t, prm || {}), y = S().year; if (n.story.some(function (s) { return s[0] === y && s[1] === x; })) return; n.story.push([y, x]); if (n.story.length > 24) n.story.shift(); }
  G.npcStory = story;
  function byName(nm) { var out = null; if (!nm || typeof nm !== 'string') return null; N.all(function (n) { return n.name === nm; }).forEach(function (n) { out = n; }); return out; }
  ['log', 'major'].forEach(function (fn) {
    var f0 = G[fn]; if (!f0) return;
    G[fn] = function (t, prm) {
      var r = f0.apply(this, arguments);
      try { if (prm && S() && S().npcs) Object.keys(prm).forEach(function (k) { var n = byName(prm[k]); if (n) story(n, t, prm); }); } catch (e) { }
      return r;
    };
  });

  /* ================= children: names, surnames, matches, advice ================= */
  var baby12 = LO.baby;
  LO.baby = async function (other, adopted) {
    var k = await baby12.apply(this, arguments), p = P();
    if (k && other && !adopted && other.sur && p.sur && String(other.sur).split('|')[0] !== String(p.sur).split('|')[0]) {
      var dad = p.g === 'm' ? p : other, mom = p.g === 'm' ? other : p;
      var i = await G.UI.pick({ title: G.L('{n}跟谁姓？|Whose surname for {n}?', { n: k.name }), items: [{ t: G.L('随父姓：{s}|Father\'s: {s}', { s: dad.sur }), icon: '👨' }, { t: G.L('随母姓：{s}|Mother\'s: {s}', { s: mom.sur }), icon: '👩' }] });
      var sur = i === 1 ? mom.sur : dad.sur;
      if (sur && String(sur) !== String(k.sur)) { var cul = (k.cul || p.cul || G.C[p.country].names); k.sur = sur; k.name = G.mkName(cul, sur, k.giv || String(k.name), k.g); }
    }
    return k;
  };
  function kidPool(k) {
    var pool = [], n = G.ri(6, 10), cls = G.famClass ? G.famClass() : 1;
    for (var i = 0; i < n; i++) {
      var x = N.make({ rel: 'contact', g: k.g === 'm' ? 'f' : 'm', age: N.age(k) + G.ri(-4, 5), c: k.c || P().country });
      x.pin = 0; x.looks = G.clamp(x.looks + G.ri(-10, 20), 5, 100); x.smarts = G.clamp(x.smarts + G.ri(-10, 20), 5, 100);
      if (cls >= 2 && G.ch(.6)) { x.wealth = G.$(G.ri(5, 200) * 1e5); x.tags = (x.tags || []).concat(['rich']); }
      pool.push(x);
    }
    return pool.sort(function (a, b) { return (b.looks + b.smarts + Math.log10((b.wealth || 1) + 1) * 8) - (a.looks + a.smarts + Math.log10((a.wealth || 1) + 1) * 8); });
  }
  var acts12 = G.npcActs;
  G.npcActs = function (n) {
    var out = (acts12.apply(this, arguments) || []).filter(function (a) { return a.id !== 'buyhome'; });
    if (n.rel === 'child' && n.alive) {
      var success = (n.jr || 0) >= 2 || (n.inc || 0) >= G.$w(80000, n.c || P().country) || n.crowned || n.founder;
      if (success) out = out.filter(function (a) { return ['kjob', 'kplace', 'kfindjob', 'kvisa'].indexOf(a.id) < 0; });
      out.forEach(function (a) {
        if (a.id !== 'match') return;
        a.run = async function (k, act) {
          if (!G.pay(G.$(300))) return 'cancel';
          var pool = kidPool(k);
          var i = await G.UI.pick({ title: G.L('为{n}挑选相亲对象|Choose a Match for {n}', { n: k.name }), text: G.L('媒人送来了{c}份资料。|The matchmaker sent {c} profiles.', { c: pool.length }),
            items: pool.map(function (x) { return { t: G.L(x.name), sub: G.L('{a}岁 · {j} · 颜值{l} · 智力{s}{w}|{a} · {j} · looks {l} · smarts {s}{w}', { a: N.age(x), j: x.job || '—', l: x.looks, s: x.smarts, w: x.wealth > G.$(1e6) ? G.L(' · 家境优渥| · wealthy family') : '' }), npc: x }; }) });
          var chosen = i >= 0 ? pool[i] : null;
          pool.forEach(function (x) { if (x !== chosen) delete S().npcs[x.id]; });
          if (!chosen) return 'cancel';
          var ok = G.ch(.45 + (k.looks - 50) / 200 + (G.filial(k) - 50) / 250);
          if (ok) { chosen.pin = 1; chosen.inlaw = k.id; k.spouseId = chosen.id; G.dStart(); G.dPush('aff', N.addAff(k, 6)); var dl = G.dEnd(); story(k, '和{s}结婚了。|Married {s}.', { s: chosen.name }); return G.result(act.n, '{n}和{s}很聊得来，半年后结婚了。|{n} and {s} got on well and married six months later.', { n: k.name, s: chosen.name }, dl, act.i); }
          delete S().npcs[chosen.id]; G.dStart(); G.dPush('aff', N.addAff(k, -4)); var dl2 = G.dEnd();
          return G.result(act.n, '{n}见了{s}一面，说“不来电”。|{n} met {s} once and said there was no spark.', { n: k.name, s: chosen.name }, dl2, act.i);
        };
      });
      var a = N.age(n);
      out.push({ id: 'krename', n: a < 18 ? '给孩子改名|Rename Your Child' : '建议孩子改名|Suggest a New Name', i: '✏️', e: 3,
        run: async function (k, act) {
          var cul = k.cul || P().cul || G.C[P().country].names;
          var t = await G.UI.input({ title: G.L(act.n), text: G.L('新名字：|New name:'), def: k.giv || k.name, groups: G.nameGroups ? G.nameGroups(cul, k.sur, k.g, k.by, N.rel('child')) : null, require: '请写一个名字|Please enter a name' });
          if (!t) return 'cancel';
          var giv = String(t).split('|')[0].replace(String(k.sur || '').split('|')[0], '') || String(t);
          var nm = /·| /.test(String(t).split('|')[0]) || String(t).split('|')[0].indexOf(String(k.sur || '').split('|')[0]) === 0 ? t : G.mkName(cul, k.sur, t, k.g);
          if (N.age(k) >= 18 && !G.ch(.35 + G.filial(k) / 200)) { G.dStart(); G.dPush('aff', N.addAff(k, -3)); return G.result(act.n, '{n}说：“这个名字我用了这么多年，不改。”|{n} said: "I\'ve had this name for years. I\'m keeping it."', { n: k.name }, G.dEnd(), act.i); }
          var old = k.name; k.name = nm; k.giv = giv; story(k, '改名为{n}。|Changed name to {n}.', { n: nm });
          return G.result(act.n, '{o}改名为{n}。|{o} is now {n}.', { o: old, n: nm }, [], act.i);
        } });
    }
    return out;
  };
  // study abroad: which country teaches best, for this child — and where they want to go
  var EDU = { us: 98, gb: 96, ch: 93, sg: 92, de: 90, ca: 90, au: 88, jp: 88, fr: 87, nz: 84, ie: 85, kr: 84, at: 84, it: 80, es: 78, pt: 76, ar: 70, cn: 88, ru: 80, in: 74, br: 70, mx: 68, th: 66, za: 68 };
  G.eduFit = function (k, c) { var b = EDU[c] || 70, sm = (k.smarts || 50); var tilt = (hash(k.id + c) % 11) - 5; if (sm >= 75 && ['us', 'gb', 'ch', 'sg'].indexOf(c) >= 0) tilt += 3; if ((k.looks || 50) >= 70 && ['fr', 'it', 'gb'].indexOf(c) >= 0) tilt += 2; return G.clamp(b + tilt, 40, 100); };
  G.kidWants = function (k, cs) { return cs.slice().sort(function (a, b) { return (hash(k.id + 'w' + b) % 100) - (hash(k.id + 'w' + a) % 100); })[0]; };
  ['k_pick_school', 'k_pick_uni'].forEach(function (id) { var d = G.EV[id]; if (!d || !d.o) return; d.o.forEach(function (o) { var r0 = o.run; if (!r0) return; o.run = async function (c) { G._advKid = c.npc; try { return await r0.apply(this, arguments); } finally { G._advKid = null; } }; }); });
  var pick0 = null;
  G.adviseCountries = function (o) {
    var k = G._advKid; if (!k || !o || !o.items) return o;
    var L = o.items.map(function (it) { var c = null; Object.keys(G.C).forEach(function (x) { if (G.T(G.C[x].n) === G.T(it.t)) c = x; }); return c; });
    if (L.some(function (c) { return !c; })) return o;
    var best = L.slice().sort(function (a, b) { return G.eduFit(k, b) - G.eduFit(k, a); })[0], want = G.kidWants(k, L);
    o.items = o.items.map(function (it, i) { var c = L[i], tags = []; if (c === best) tags.push(G.T('教育最适合|Best education fit')); if (c === want) tags.push(G.T('{n}最想去|{n}\'s first choice', { n: k.name })); return Object.assign({}, it, { sub: G.T('教育水平{s}|Education {s}', { s: G.eduFit(k, c) }) + (tags.length ? ' · ' + tags.join(' · ') : '') }); });
    o.text = (o.text ? G.T(o.text) + '\n' : '') + G.T('{n}最想去{w}；对{n}来说，教育最好的是{b}。|{n} most wants {w}; the best education for {n} is in {b}.', { n: k.name, w: G.C[want].n, b: G.C[best].n });
    return o;
  };
  G.ACT_CATS.forEach(function (c) { (c.items || []).forEach(function (a) { if (a.id === 'exchange') a.$ = 700000; }); });

  /* ================= the final score: what you did, not just what you owned ================= */
  var comp12 = G.ending.compute;
  G.ending.compute = function () {
    var d = comp12.apply(this, arguments), s = S(), p = s.p, f = p.flags, c = s.cnt || {}, nw = G.netWorth();
    var parts = [], sc = 0;
    function add(k, v) { v = Math.round(v); if (v) { sc += v; parts.push({ k: k, v: v }); } }
    var milTop = G.MIL ? G.MIL.off.length : 12, peak = 0;
    if (f.monarch) peak = 150;
    if (c.leader) peak = Math.max(peak, 145);
    if ((f.peakMil || 0) >= milTop) peak = Math.max(peak, 145); else if ((f.peakMil || 0) >= 9) peak = Math.max(peak, 110); else if (c.general || (f.peakMil || 0) >= 7) peak = Math.max(peak, 85);
    if (c.topcop) peak = Math.max(peak, 80);
    if (c.ipo) peak = Math.max(peak, 85); if ((f.peakCo || 0) >= G.$(1e9)) peak = Math.max(peak, 120); else if ((f.peakCo || 0) >= G.$(1e8)) peak = Math.max(peak, 85);
    if (c.famerank >= 3) peak = Math.max(peak, 55 + c.famerank * 8);
    if ((f.peakJob || 0) >= 1) peak = Math.max(peak, 60); else if (f.peakJob) peak = Math.max(peak, Math.round(f.peakJob * 45));
    if (f.astronaut) peak = Math.max(peak, 110);
    add('事业与地位|Career & standing', peak);
    add('财富|Wealth', nw > 0 ? Math.min(55, Math.log10(nw / G.$(10000) + 1) * 11) : -10);
    add('名气|Fame', p.st.fame * .3);
    add('幸福|Happiness', ((d.hap || 50) - 40) * .7);
    add('寿命|Longevity', Math.min(p.age, 100) * .35);
    add('学历|Education', p.edu.deg * 2.5 + (p.edu.tier || 0) * 2);
    var kids = N.all(function (n) { return n.rel === 'child'; }), kidPts = 0;
    kids.forEach(function (k) { var e = k.edu || {}; kidPts += 3 + (e.tier >= 5 ? 8 : e.tier >= 4 ? 4 : 0) + (e.deg >= 6 ? 4 : e.deg >= 5 ? 2 : 0) + ((k.jr || 0) >= 2 ? 3 : 0) + (k.crowned ? 15 : 0); });
    add('子女|Children', Math.min(60, kidPts));
    add('家庭|Family', (N.spouse() ? 6 : 0) + Math.min(10, c.grandkids || 0));
    add('品德|Virtue', p.h.karma * .15);
    if (G.megaDone) add('家族功业|Family legacy', Math.min(60, G.megaDone() * 15));
    if (p.honor) add('荣誉|Honours', 8);
    add('成就|Achievements', Math.min(30, (s.ach || []).length));
    var grade = sc >= 330 ? 'SSS' : sc >= 280 ? 'SS' : sc >= 225 ? 'S' : sc >= 170 ? 'A' : sc >= 120 ? 'B' : sc >= 75 ? 'C' : 'D';
    d.score = Math.round(sc); d.grade = grade; d.parts = parts;
    // distinctive titles
    var t = null, gen = s.gen || 1, richBorn = ['tycoon', 'richest', 'merchant', 'noble'].indexOf(p.origin) >= 0;
    if ((f.peakMil || 0) >= milTop) t = ['cinc', '三军统帅|Commander of All Forces', '你站在了一个军人能到达的最高处。|You reached the highest place a soldier can stand.'];
    else if ((f.peakMil || 0) >= 9) t = ['marshal', '将星闪耀|A Constellation of Stars', '肩上的将星，是几十年风雨换来的。|The stars on your shoulders were earned through decades of storms.'];
    else if (gen >= 3 && richBorn && nw >= G.$(5e6)) t = ['rich3', '富三代|Third-Generation Fortune', '祖辈打下的江山，传到你手里没有败。|The fortune your grandparents built did not fall apart in your hands.'];
    else if (gen === 2 && richBorn && nw >= G.$(2e6) && peak < 40) t = ['rich2', '富二代|Born to Fortune', '含着金汤匙出生，也算过得体面。|Born with a silver spoon — and you kept it polished.'];
    else if ((c.lovers || 0) >= 6 || (c.marriages || 0) >= 3) t = ['amor', '多情|A Heart Too Big', '你爱过很多人，也被很多人爱过。|You loved many, and many loved you.'];
    else if (kidPts >= 30 && kids.length) t = ['parent', '教子有方|A Parent of Stars', '你最大的成就，是你的孩子们。|Your greatest achievement was your children.'];
    else if (p.honor && p.st.fame >= 50) t = ['honor', '德高望重|Widely Revered', '人们记得你的名字，也记得你做的善事。|People remember your name, and the good you did.'];
    else if (sc < 75 && peak < 15 && !kids.length) t = ['idle', '碌碌无为|An Unremarkable Life', '平平淡淡地来，平平淡淡地走。|You came quietly, and quietly you went.'];
    if (t) { d.title = t[1]; d.td = t[2]; d.epitaph = t[2]; }
    return d;
  };

  /* ================= small fixes ================= */
  // the hall of fame lists each life once
  function dedupeLives() { var M = G.meta; if (!M || !M.lives) return; var seen = {}; M.lives = M.lives.filter(function (x) { var k = x.name + '|' + x.by + '|' + x.dy + '|' + x.g; if (seen[k]) return false; seen[k] = 1; return true; }); }
  var lm12 = G.loadMeta; if (lm12) G.loadMeta = function () { var r = lm12.apply(this, arguments); dedupeLives(); return r; };
  var sm12 = G.saveMeta; if (sm12) G.saveMeta = function () { dedupeLives(); return sm12.apply(this, arguments); };
})();
