/* Version 1.9 (part 2): small businesses that keep running, named companies, a new phone every year,
   and real work for the professionals your hobbies made you. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function cat(id) { return G.ACT_CATS.filter(function (c) { return c.id === id; })[0]; }
  function item(id) { var f = null; G.ACT_CATS.forEach(function (c) { c.items.forEach(function (a) { if (a.id === id && !f) f = a; }); }); return f; }

  /* ===================== small businesses ===================== */
  var KIND = {
    stall: { n: '小摊|Street Stall', i: '🍢', open: 1500, base: 9000, grow: 1.6, cap: 5, lv: ['路边小摊|A roadside stall', '夜市固定摊位|A fixed night-market pitch', '小吃铺|A snack shop', '连锁小吃店|A small snack chain', '连锁品牌|A franchise brand'], y0: 0 },
    eshop: { n: '网店|Online Store', i: '🛒', open: 3000, base: 14000, grow: 1.8, cap: 5, lv: ['个人小店|A one-person shop', '皇冠店铺|A five-star shop', '品牌旗舰店|A brand flagship store', '电商公司|An e-commerce company', '头部电商品牌|A top e-commerce brand'], y0: 2003 },
    cafe: { n: '咖啡馆|Café', i: '☕', open: 60000, base: 30000, grow: 1.7, cap: 5, lv: ['街角小咖啡馆|A corner café', '网红咖啡馆|An Instagrammable café', '三家分店|Three branches', '城市连锁|A city chain', '全国品牌|A national brand'], y0: 1990 }
  };
  var MGR = [
    { n: '兼职店长|Part-time Manager', i: '🧑‍💼', fee: 12000, f: .55, d: '帮你看店，差不多能维持|Minds the shop; roughly holds steady' },
    { n: '全职店长|Full-time Manager', i: '👔', fee: 30000, f: .85, d: '靠谱，生意稳中有升|Reliable; business ticks up' },
    { n: '资深运营经理|Senior Operations Manager', i: '💼', fee: 70000, f: 1.1, d: '会扩张，利润明显增长|Knows how to grow; profits rise clearly' },
    { n: '金牌职业经理人|Star Professional Manager', i: '🏆', fee: 160000, f: 1.35, d: '把小生意做成品牌|Turns a small business into a brand' }
  ];
  G.SHOP_KIND = KIND; G.SHOP_MGR = MGR;
  function shops() { var A = S().assets; A.shops = A.shops || []; return A.shops; }
  function shopOf(kind) { return shops().filter(function (x) { return x.kind === kind; })[0]; }
  async function openShop(kind, a) {
    var K = KIND[kind], cost = G.$(K.open), p = P();
    if (!G.canPay(cost)) { G.UI.toast(G.L('开店需要{m}|Opening costs {m}', { m: G.M(cost) })); return 'cancel'; }
    var def = G.T(G.pick(['老{x}家的|Old {x}\'s ', '{x}记|{x}\'s ', '小{x}的|Little {x}\'s '])).replace('{x}', String(G.T(p.name)).slice(-1)) + G.T(K.n);
    var nm = await G.UI.input({ title: G.L('给你的{k}起个名字|Name your {k}', { k: K.n }), def: def });
    if (nm === null || nm === undefined) return 'cancel';
    nm = String(nm || def).slice(0, 24);
    G.pay(cost);
    shops().push({ id: G.uid(), kind: kind, name: nm, lv: 0, y0: S().year, mgr: -1, last: 0, workY: S().year, tot: 0 });
    G.major('开了一家{k}：{n}|Opened a {k}: {n}', { k: K.n, n: nm });
    return G.quick(a, '{n}开张了！第一位客人是你的邻居。|{n} is open! The first customer was your neighbour.', { happy: 8 }, { n: nm });
  }
  ['stall', 'eshop'].forEach(function (kind) {
    var it = item(kind); if (!it) return;
    var run0 = it.run;
    it.run = function (a) { if (!shopOf(kind)) return openShop(kind, a); return run0.apply(this, arguments); };
    it.n = kind === 'stall' ? '摆摊（开一家自己的小摊）|Run a Street Stall' : '开网店（长期经营）|Open an Online Store';
    var f = it.if; it.if = function () { if (shopOf(kind)) return false; return !f || f.apply(this, arguments); };
  });
  var hu = cat('hustle');
  if (hu) hu.items.push({ id: 'cafe_open', n: '开一家咖啡馆|Open a Café', i: '☕', e: 20, a: [20, 80], if: function () { return S().year >= 1990 && !shopOf('cafe') && !P().flags.monarch; }, run: function (a) { return openShop('cafe', a); } });
  function profit(x) {
    var K = KIND[x.kind], p = P(), worked = x.workY === S().year, m = x.mgr >= 0 ? MGR[x.mgr] : null;
    var f = worked ? 1 : m ? m.f : .35;
    if (worked && m) f = Math.max(f, m.f) + .15;
    var skill = 1 + (G.skill ? G.skill(x.kind === 'cafe' || x.kind === 'stall' ? 'cook' : 'biz') / 120 : 0) + (p.st.eq - 50) / 300;
    return Math.round(G.$(K.base) * Math.pow(K.grow, x.lv) * f * skill * G.rf(.6, 1.35));
  }
  function shopYear() {
    shops().forEach(function (x) {
      var m = x.mgr >= 0 ? MGR[x.mgr] : null, fee = m ? G.$(m.fee) : 0, pr = profit(x), net = pr - fee;
      x.last = net; x.tot = (x.tot || 0) + net;
      if (G.fin) G.fin.tag = G.L('{n}经营收入|{n} takings', { n: x.name });
      G.addMoney(net);
      if (G.fin) G.fin.tag = null;
      // a good manager grows the business on their own
      if (m && x.mgr >= 2 && x.lv < KIND[x.kind].cap - 1 && G.ch(x.mgr === 3 ? .22 : .1)) { x.lv++; G.log('在{m}的打理下，{n}升级成了{l}。|Under the {m}, {n} grew into {l}.', { m: m.n, n: x.name, l: KIND[x.kind].lv[x.lv] }); }
    });
  }
  G.shopYear = shopYear;
  // shop work lives on the Life tab, beside your job
  function shopActs() {
    var out = [];
    shops().forEach(function (x) {
      var K = KIND[x.kind];
      out.push({ id: 'shop_work_' + x.id, n: G.L('经营{n}|Run {n}', { n: x.name }), i: K.i, e: 20, run: function (a) {
        x.workY = S().year; var est = profit(x);
        return G.quick(a, G.pick(['你从早忙到晚，今天的流水破了纪录。|You worked from dawn to dusk; today\'s takings set a record.', '一位老顾客带来了三个新顾客。|A regular brought three new customers.', '你琢磨出一个新招牌产品，卖断了货。|You came up with a new best-seller and sold out.']) + G.L('（预计今年收入约{m}）|(This year\'s expected takings: ~{m})', { m: G.M(est) }), { happy: 3, eq: 1, stress: 4 });
      } });
      if (x.lv < K.cap - 1) out.push({ id: 'shop_up_' + x.id, n: G.L('扩张{n}|Expand {n}', { n: x.name }), i: '📈', e: 10, run: async function (a) {
        var cost = G.$(Math.round(K.open * 3 * Math.pow(2.6, x.lv + 1)));
        if (!(await G.UI.confirm(G.L(a.n), G.L('投入{m}，把{n}升级为“{l}”。|Invest {m} to grow {n} into "{l}".', { m: G.M(cost), n: x.name, l: K.lv[x.lv + 1] })))) return 'cancel';
        if (!G.pay(cost)) { G.UI.toast(G.L('钱不够|Not enough money')); return 'cancel'; }
        x.lv++; return G.quick(a, '{n}升级成了{l}！|{n} is now {l}!', { happy: 8, fame: x.lv >= 3 ? 2 : 0 }, { n: x.name, l: K.lv[x.lv] });
      } });
      out.push({ id: 'shop_mgr_' + x.id, n: x.mgr >= 0 ? G.L('{n}的经理人：{m}|{n}\'s manager: {m}', { n: x.name, m: MGR[x.mgr].n }) : G.L('给{n}请个经理人|Hire a Manager for {n}', { n: x.name }), i: '🧑‍💼', e: 0, run: async function (a) {
        var items = MGR.map(function (m, k) { return { t: m.n, icon: m.i, sub: G.L('年薪{m} · {d}|{m} a year · {d}', { m: G.M(G.$(m.fee)), d: m.d }) }; });
        if (x.mgr >= 0) items.push({ t: G.L('辞退经理人，自己来|Let them go and run it yourself'), icon: '🙋' });
        var i = await G.UI.pick({ title: G.L(a.n), text: G.L('没人打理的生意会慢慢冷清。经理人越贵，打理得越好。|A business nobody minds goes quiet. The pricier the manager, the better it runs.'), items: items });
        if (i < 0) return 'cancel';
        x.mgr = i < MGR.length ? i : -1;
        return G.quick(a, x.mgr >= 0 ? '你请了一位{m}来打理{n}。|You hired a {m} to run {n}.' : '你决定自己打理{n}。|You decided to run {n} yourself.', { stress: x.mgr >= 0 ? -4 : 0 }, { m: x.mgr >= 0 ? MGR[x.mgr].n : '', n: x.name });
      } });
      out.push({ id: 'shop_sell_' + x.id, n: G.L('转让{n}|Sell {n}', { n: x.name }), i: '🏷️', e: 0, run: async function (a) {
        var val = Math.round(Math.max(G.$(KIND[x.kind].open), (x.last > 0 ? x.last : 0) * 3) * (1 + x.lv * .5));
        if (!(await G.UI.confirm(G.L(a.n), G.L('有人愿意出{m}接手{n}。|Someone will pay {m} to take over {n}.', { m: G.M(val), n: x.name })))) return 'cancel';
        S().assets.shops = shops().filter(function (y) { return y !== x; }); G.addMoney(val);
        return G.quick(a, '你把{n}的钥匙交给了新老板。|You handed the keys of {n} to its new owner.', { happy: -2 }, { n: x.name });
      } });
    });
    return out;
  }
  G.shopActs = shopActs;
  var la = G.lifeActs;
  G.lifeActs = function () { var out = la.apply(this, arguments), p = P(); if (!p.jail && p.age >= 14 && shops().length) out = out.concat(shopActs()); return out; };
  var iw = G.isWorkAct;
  G.isWorkAct = function (a) { if (a && a.id && /^shop_(work|up)_/.test(a.id) && a.e) return true; return iw.apply(this, arguments); };

  /* ===================== a company with a name you chose ===================== */
  var st = item('startup');
  if (st) {
    var st0 = st.run;
    st.run = async function (a) {
      var r = await st0.apply(this, arguments), co = S().assets.company;
      if (r !== 'cancel' && co && !co.named) {
        var nm = await G.UI.input({ title: G.L('给公司起个名字|Name Your Company'), def: G.T(co.name) });
        if (nm) { co.name = String(nm).slice(0, 28); }
        co.named = 1;
      }
      return r;
    };
  }
  if (G.ACT_BIZ) G.ACT_BIZ.push({ id: 'co_rename', n: '给公司改名|Rename the Company', i: '✏️', e: 0, run: async function (a) {
    var co = S().assets.company, nm = await G.UI.input({ title: G.L(a.n), def: G.T(co.name) }); if (!nm) return 'cancel';
    var old = co.name; co.name = String(nm).slice(0, 28); co.named = 1;
    return G.quick(a, '{o}正式更名为{n}。|{o} is now officially {n}.', { fame: 1 }, { o: old, n: co.name });
  } });

  /* ===================== a new phone every year ===================== */
  var LINE = ['灵犀|Lumen', '星芒|Stellar', '青鸾|Phoenix'];
  G.phoneModel = function (y, tier) {
    y = y || S().year;
    if (y < 1995) return null;
    if (y < 2007) return { n: G.L('{b} 翻盖手机 {v}|{b} Flip {v}', { b: LINE[tier % 3], v: 'S' + (y - 1990) }), usd: [180, 320, 600][tier], gen: y };
    var v = y - 2006;
    return { n: G.L(['{b} {v}|{b} {v}', '{b} {v} Pro|{b} {v} Pro', '{b} {v} Ultra 折叠屏|{b} {v} Ultra Fold'][tier], { b: LINE[tier === 2 ? 1 : 0], v: v }), usd: [699, 1099, 1899][tier] + Math.max(0, v - 10) * 20, gen: y };
  };
  function buyPhone(forKid) {
    return async function (a) {
      var y = S().year, models = [0, 1, 2].map(function (t) { return G.phoneModel(y, t); }).filter(Boolean);
      var who = forKid;
      var i = await G.UI.pick({ title: G.L(forKid ? '给{n}买手机|A Phone for {n}' : '买新手机|Buy a New Phone', { n: forKid ? forKid.name : '' }), text: G.L('{y}年新品发布。|The {y} line-up is out.', { y: y }), items: models.map(function (m) { return { t: m.n, icon: '📱', sub: G.M(G.$(m.usd)), dis: !G.canPay(G.$(m.usd)) }; }) });
      if (i < 0) return 'cancel'; var m = models[i];
      if (!G.pay(G.$(m.usd))) return 'cancel';
      if (who) {
        who.phone = { n: m.n, y: y }; G.dStart(); G.dPush('aff', N.addAff(who, 6 + i * 4)); var dl = G.dEnd();
        return G.result(a.n, '{n}拆开包装，尖叫着抱住了你，然后立刻拍了一张开箱照发到了班级群。|{n} tore open the box, shrieked, hugged you — and posted an unboxing photo to the class chat at once.', { n: who.name }, dl, '📱');
      }
      P().phone = { n: m.n, y: y };
      S().assets.items.push({ id: G.uid(), k: 'phone', n: m.n, val: Math.round(G.$(m.usd) * .6), i: '📱' });
      return G.quick(a, G.pick(['新手机拿在手里的那一刻，你觉得整个世界都更清楚了。|The moment you held it, the world looked sharper.', '你花了一个晚上把所有照片和聊天记录搬了过去。|You spent an evening moving every photo and chat across.', '你给它挑了一个最贵的手机壳。|You bought it the most expensive case you could find.']), { happy: 4 + i * 2 });
    };
  }
  var shop = cat('shop');
  var phoneItem = { id: 'newphone', n: '买新手机|Buy a New Phone', i: '📱', e: 0, a: [12, 110], if: function () { return S().year >= 1995 && !(P().phone && P().phone.y === S().year); }, run: buyPhone(null) };
  (shop || cat('life')).items.unshift(phoneItem);
  var acts = G.npcActs;
  G.npcActs = function (n) {
    var out = acts.apply(this, arguments) || [];
    if (n && n.alive && n.rel === 'child' && N.age(n) >= 8 && S().year >= 2000 && !(n.phone && n.phone.y === S().year)) out.push({ id: 'kidphone', n: '给ta买新手机|Buy Them a New Phone', i: '📱', e: 0, run: buyPhone(n) });
    return out;
  };
  G.evs([
    { id: 'v19_phone_launch', sys: 1, title: '新品发布会|The Launch Event', icon: '📱',
      prep: function (c) { var m = G.phoneModel(S().year, 1); if (!m) return false; c.prm.m = m.n; c.prm.p = G.M(G.$(m.usd)); },
      t: '{m}发布了，起售价{p}。发布会上，那块新屏幕亮起来的时候，台下一片惊呼。|The {m} is out, from {p}. When the new screen lit up on stage, the audience gasped.',
      o: [{ t: '马上下单|Order one now', run: async function (c) { var m = G.phoneModel(S().year, 1), cost = G.$(m.usd); if (!G.pay(cost)) return '这个月的钱不够，你把它加进了购物车。|Not enough this month — it went into your basket.'; c.p.phone = { n: m.n, y: S().year }; S().assets.items.push({ id: G.uid(), k: 'phone', n: m.n, val: Math.round(cost * .6), i: '📱' }); c.add('happy', 6); return '三天后快递到了。你拆箱的手有点抖。|It arrived three days later. Your hands shook a little opening it.'; } },
        { t: '旧手机还能用|The old one still works', run: function (c) { c.add('smarts', 1); return '你把省下的钱存了起来。|You saved the money instead.'; } }] }
  ]);

  /* ===================== working professionals from hobbies ===================== */
  var PROACT = {
    climber: [['带队商业攀登|Lead a Commercial Expedition', '⛰️', 25, [30000, 120000], '你带着八名客户登顶，一个都没少。|You took eight clients to the summit and brought every one back.'], ['拍登山纪录片|Film a Climbing Documentary', '🎥', 20, [20000, 90000], '你的纪录片在电影节上拿了奖。|Your documentary won a festival award.']],
    angler: [['参加钓鱼锦标赛|Enter a Fishing Championship', '🏆', 20, [8000, 60000], '你钓上了一条破赛会纪录的大鱼。|You landed a fish that broke the tournament record.']],
    gamer: [['打职业联赛|Play in the Pro League', '🎮', 20, [20000, 200000], '你们战队拿下了季后赛。|Your team won the playoffs.']],
    chefpro: [['接私房菜订单|Cook for a Private Client', '🍽️', 15, [8000, 50000], '一位富豪包下了你一整个月的晚餐。|A tycoon booked your dinners for a whole month.'], ['出一本菜谱|Publish a Cookbook', '📗', 20, [10000, 80000], '你的菜谱上了畅销榜。|Your cookbook hit the bestseller list.']],
    foodie: [['探店拍视频|Review a Restaurant on Camera', '🍜', 15, [5000, 60000], '你的探店视频让一家老店排起了长队。|Your review put a queue outside an old family restaurant.']],
    photog: [['接商业拍摄|Take a Commercial Shoot', '📷', 15, [6000, 50000], '一家杂志用你的照片做了封面。|A magazine used your shot as its cover.']],
    runner: [['跑一场大满贯马拉松|Run a Major Marathon', '🏃', 20, [5000, 80000], '你跑出了个人最好成绩。|You ran a personal best.']],
    musician: [['驻唱演出|Play a Residency', '🎸', 15, [5000, 40000], '酒吧老板给你加了一倍的钱。|The bar owner doubled your fee.']]
  };
  function proActs() {
    var p = P(), k = p.flags.pro, L = PROACT[k]; if (!L || p.job) return [];
    return L.map(function (x, i) { return { id: 'pro_' + k + '_' + i, n: x[0], i: x[1], e: x[2], run: function (a) {
      var m = G.$(G.ri(x[3][0], x[3][1]) * (1 + (p.hob && p.hob[k] ? Math.min(2, p.hob[k] / 40) : 0)));
      G.dStart(); G.addMoney(m); G.addStat('fame', 1); G.addStat('happy', 4); var dl = G.dEnd();
      if (G.hobby) G.hobby(k);
      return G.result(a.n, G.join([x[4], G.L('收入{m}。|You earned {m}.', { m: G.M(m) })], ' ', ' '), null, dl, x[1]);
    } }; });
  }
  var la2 = G.lifeActs;
  G.lifeActs = function () { var out = la2.apply(this, arguments), p = P(); if (!p.jail && p.age >= 16 && p.flags.pro) out = proActs().concat(out); return out; };
  var iw2 = G.isWorkAct;
  G.isWorkAct = function (a) { if (a && a.id && /^pro_/.test(a.id) && a.e) return true; return iw2.apply(this, arguments); };

  /* ===================== yearly ===================== */
  var mt = G.money.tick;
  G.money.tick = function () {
    var r = mt.apply(this, arguments), s = S(), p = s.p;
    if (s.dead) return r;
    try {
      shopYear();
      if (p.age >= 14 && s.year >= 2008 && (!p.phone || s.year - p.phone.y >= 2) && !p.jail && G.ch(.35)) (s.pendQ = s.pendQ || []).push({ id: 'v19_phone_launch' });
    } catch (e) { console.error(e); }
    return r;
  };
})();
