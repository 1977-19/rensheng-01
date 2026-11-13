/* Version 1.6 features:
   - A life bucket list: at eighteen you choose three dreams; every one you fulfil is celebrated and counts at the end.
   - Collecting: stamps, wine, watches, art, trainers and rare books that rise and fall in value every year.
   - Pets that grow old, learn tricks and say goodbye. */
(function () {
  "use strict";
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function q(id, nid, prm) { var s = S(); (s.pendQ = s.pendQ || []).push({ id: id, nid: nid, prm: prm }); }
  function cnt(k) { return (S().cnt || {})[k] || 0; }

  /* ===================== the bucket list ===================== */
  var DREAMS = [
    { id: "world", n: "环游世界（旅行8次）|See the world (travel 8 times)", i: "🌍", ok: function () { return cnt("travel") >= 8; } },
    { id: "summit", n: "登上一座八千米高峰|Stand on an 8,000 m summit", i: "🏔️", ok: function () { return (P().hob && P().hob.climber >= 4) || P().flags.summit8k; } },
    { id: "million", n: "身家过百万美元|Be worth a million dollars", i: "💰", ok: function () { return G.netWorth() >= G.$(1e6); } },
    { id: "famous", n: "成为名人（名声70%）|Become famous (fame 70%)", i: "🌟", ok: function () { return P().st.fame >= 70; } },
    { id: "family", n: "结婚并生三个孩子|Marry and raise three children", i: "👨‍👩‍👧‍👦", ok: function () { return !!N.spouse() && N.rel("child").length >= 3; } },
    { id: "founder", n: "创办一家公司|Found a company", i: "🏢", ok: function () { return cnt("founded") > 0 || !!S().assets.company; } },
    { id: "phd", n: "拿到博士学位|Earn a doctorate", i: "🎓", ok: function () { return P().edu.deg >= 6; } },
    { id: "space", n: "去一次太空|Go to space", i: "🚀", ok: function () { return cnt("space") > 0 || P().flags.astronaut; } },
    { id: "polyglot", n: "学会三门语言|Speak three languages", i: "🗣️", ok: function () { return (P().langs || []).length >= 3; } },
    { id: "hero", n: "做一个好人（品德80以上）|Be a truly good person (virtue 80+)", i: "😇", ok: function () { return (P().h.karma || 0) >= 80; } },
    { id: "home", n: "拥有一套属于自己的房子|Own a home of your own", i: "🏡", ok: function () { return S().assets.houses.length > 0; } },
    { id: "hundred", n: "活到一百岁|Live to a hundred", i: "🎂", ok: function () { return P().age >= 100; } },
    { id: "pet", n: "养一只陪你很多年的宠物|Keep a pet for many years", i: "🐕", ok: function () { var pt = P().pet; return !!pt && S().year - pt.y >= 10; } },
    { id: "top", n: "做到行业顶尖|Reach the top of your field", i: "🏆", ok: function () { var f = P().flags; return (f.peakJob || 0) >= 1 || cnt("topcop") > 0 || cnt("general") > 0 || cnt("leader") > 0 || cnt("famerank") >= 3; } },
    { id: "book", n: "出版一本书|Publish a book", i: "📕", ok: function () { return !!P().flags.published || cnt("books") > 0; } },
    { id: "love", n: "遇见一生挚爱（伴侣爱意90以上）|Find the love of your life (partner love 90+)", i: "💞", ok: function () { var pt = N.partner(); return !!pt && pt.love >= 90; } }
  ];
  G.DREAMS = DREAMS;
  function dream(id) { return DREAMS.filter(function (d) { return d.id === id; })[0]; }
  function biJoin(ids) { var z = [], e = []; ids.forEach(function (id) { var t = String(dream(id).n), k = t.indexOf("|"); z.push(k < 0 ? t : t.slice(0, k)); e.push(k < 0 ? t : t.slice(k + 1)); }); return z.join("、") + "|" + e.join(", "); }
  G.evs([{ id: "bucket_pick", sys: 1, title: "十八岁的愿望清单|A Bucket List at Eighteen", icon: "📝",
    prep: function (c) { if (c.p.bucket) return false; },
    t: "十八岁生日那晚，你在本子上写下：这辈子一定要做到的三件事。|On the night you turn eighteen, you write in a notebook: three things I must do in this life.",
    o: [{ t: "认真写下三个愿望|Write down three dreams", run: async function (c) {
      var chosen = [], pool = DREAMS.slice();
      for (var k = 0; k < 3; k++) {
        var i = await G.UI.pick({ title: G.L("第{k}个愿望|Dream number {k}", { k: k + 1 }), items: pool.map(function (d) { return { t: d.n, icon: d.i }; }), noCancel: 1 });
        var d = pool.splice(i < 0 ? 0 : i, 1)[0]; chosen.push(d.id);
      }
      c.p.bucket = chosen.map(function (id) { return { id: id, done: 0 }; });
      return G.L("你把本子合上，放进了抽屉的最里面：{l}|You closed the notebook and tucked it at the back of a drawer: {l}", { l: biJoin(chosen) });
    } },
      { t: "让命运来决定|Let fate decide", run: function (c) {
        var pool = DREAMS.slice(), chosen = []; for (var k = 0; k < 3; k++) chosen.push(pool.splice(Math.floor(G.R() * pool.length), 1)[0].id);
        c.p.bucket = chosen.map(function (id) { return { id: id, done: 0 }; });
        return G.L("你闭着眼睛在清单上点了三下：{l}|Eyes closed, you jabbed the list three times: {l}", { l: biJoin(chosen) });
      } }] }]);
  function checkBucket() {
    var p = P(); if (!p.bucket) return;
    p.bucket.forEach(function (b) {
      var d = dream(b.id); if (!d || b.done) return;
      var ok = false; try { ok = d.ok(); } catch (e) { }
      if (ok) { b.done = S().year; G.major("实现了愿望：{d}|Fulfilled a dream: {d}", { d: d.n }); G.addStat("happy", 15, true); G.log("✅ 十八岁写下的愿望实现了：{d}|✅ A dream from your eighteenth birthday came true: {d}", { d: d.n }); }
    });
    if (p.bucket.every(function (b) { return b.done; }) && !p.flags.bucketAll) { p.flags.bucketAll = 1; G.major("三个愿望全部实现|All three dreams fulfilled"); G.addStat("happy", 20, true); }
  }
  var comp = G.ending.compute;
  G.ending.compute = function () {
    var d = comp.apply(this, arguments), p = P();
    try { checkBucket(); } catch (e) { }
    if (p.bucket) {
      var n = p.bucket.filter(function (b) { return b.done; }).length, v = n * 12 + (n === 3 ? 14 : 0);
      if (v) { d.score += v; (d.parts = d.parts || []).push({ k: "愿望清单|Bucket list", v: v }); }
      d.bucket = p.bucket.map(function (b) { var x = dream(b.id); return { n: x ? x.n : b.id, done: b.done }; });
      var sc = d.score; d.grade = sc >= 330 ? "SSS" : sc >= 280 ? "SS" : sc >= 225 ? "S" : sc >= 170 ? "A" : sc >= 120 ? "B" : sc >= 75 ? "C" : "D";
    }
    return d;
  };

  /* ===================== collecting ===================== */
  var COLL = [
    { id: "stamp", n: "邮票|Stamps", i: "📮", lo: 50, hi: 5000, vol: .12, drift: .04, y0: 1900 },
    { id: "wine", n: "名酒|Fine Wine", i: "🍷", lo: 300, hi: 30000, vol: .1, drift: .06, y0: 1900 },
    { id: "watch", n: "名表|Luxury Watches", i: "⌚", lo: 3000, hi: 200000, vol: .14, drift: .05, y0: 1950 },
    { id: "art", n: "艺术品|Artworks", i: "🖼️", lo: 2000, hi: 2000000, vol: .3, drift: .07, y0: 1900 },
    { id: "sneaker", n: "限量球鞋|Limited Sneakers", i: "👟", lo: 200, hi: 10000, vol: .25, drift: .03, y0: 1990 },
    { id: "book", n: "珍本古籍|Rare Books", i: "📜", lo: 500, hi: 80000, vol: .08, drift: .05, y0: 1900 },
    { id: "coin", n: "古钱币|Ancient Coins", i: "🪙", lo: 100, hi: 20000, vol: .1, drift: .04, y0: 1900 },
    { id: "nft", n: "数字藏品|Digital Collectibles", i: "🖥️", lo: 100, hi: 50000, vol: .6, drift: -.05, y0: 2018 }
  ];
  G.COLLECT = COLL;
  function collItems() { return S().assets.items.filter(function (x) { return x.coll; }); }
  async function buyColl(a) {
    var p = P(), L = COLL.filter(function (c) { return S().year >= c.y0; });
    var i = await G.UI.pick({ title: G.L(a.n), text: G.L("收藏品的价格每年都会涨跌。眼光好的人能赚大钱。|Collectibles rise and fall every year. A good eye can make a fortune.", null), items: L.map(function (c) { return { t: c.n, sub: G.L("{a} ~ {b}|{a} – {b}", { a: G.M(G.$(c.lo)), b: G.M(G.$(c.hi)) }), icon: c.i }; }) });
    if (i < 0) return "cancel"; var c = L[i];
    var tiers = [[c.lo, "入门|Entry-level"], [Math.sqrt(c.lo * c.hi), "精品|Fine"], [c.hi, "传世珍品|Museum-grade"]];
    var j = await G.UI.pick({ title: G.L(c.n), items: tiers.map(function (t) { return { t: G.L(t[1]), sub: G.M(G.$(t[0])), icon: c.i, dis: p.money < G.$(t[0]) }; }) });
    if (j < 0) return "cancel"; var price = G.$(tiers[j][0]);
    if (!G.pay(price)) return G.result(a.n, "钱不够。|Not enough money.", null, [], a.i);
    var eye = (p.st.smarts + p.st.eq) / 200 + (G.has("art") ? .1 : 0) + (p.flags.craftsman ? .1 : 0);
    var real = G.ch(.88 + eye * .1);
    var rec = { id: G.uid(), k: "coll_" + c.id, n: G.L("{t}{c}|{t} {c}", { t: tiers[j][1], c: c.n }), val: real ? Math.round(price * G.rf(.85, 1.2)) : Math.round(price * .05), cost: price, i: c.i, coll: c.id, fake: real ? 0 : 1 };
    S().assets.items.push(rec); G.inc("collect");
    p.flags.collect = (p.flags.collect || 0) + 1;
    if (!real) return G.result(a.n, "你兴高采烈地买下了它。（多年以后你才会知道……）|You bought it, delighted. (Years later you’ll find out…)", null, [], c.i);
    return G.result(a.n, "你把它小心地放进了展柜。|You placed it carefully in the display case.", null, [], c.i);
  }
  async function appraise(a) {
    var L = collItems(); if (!L.length) return G.result(a.n, "你还没有收藏品。|You don’t own any collectibles yet.", null, [], a.i);
    var tot = 0, cost = 0, lines = L.map(function (x) { tot += x.val; cost += x.cost || 0; var ch = x.cost ? Math.round((x.val / x.cost - 1) * 100) : 0; return G.T(x.n) + "  " + G.fm(x.val) + "  (" + (ch >= 0 ? "+" : "") + ch + "%)" + (x.fake && x.exposed ? G.T(" · 赝品| · forgery") : ""); });
    return G.result(a.n, G.L("你的收藏总价值{v}（买入{c}）：\n{l}|Your collection is worth {v} (cost {c}):\n{l}", { v: G.M(tot), c: G.M(cost), l: lines.join("\n") }), null, [], a.i);
  }
  async function sellColl(a) {
    var L = collItems(); if (!L.length) return G.result(a.n, "你还没有收藏品。|You don’t own any collectibles yet.", null, [], a.i);
    var i = await G.UI.pick({ title: G.L(a.n), text: G.L("拍卖行收取10%佣金。|The auction house takes 10%.", null), items: L.map(function (x) { return { t: x.n, sub: G.fm(x.val), icon: x.i }; }) });
    if (i < 0) return "cancel"; var x = L[i];
    if (x.fake) { x.exposed = 1; S().assets.items = S().assets.items.filter(function (y) { return y !== x; }); G.addMoney(Math.round(x.val * .5)); return G.result(a.n, "拍卖行的鉴定师摇摇头：“这是一件高仿。”|The auction house expert shook his head: “It’s a forgery.”", null, [{ k: "happy", n: G.addStat("happy", -8) }], a.i); }
    var got = Math.round(x.val * .9 * G.rf(.85, 1.3)); S().assets.items = S().assets.items.filter(function (y) { return y !== x; }); G.addMoney(got);
    var gain = got - (x.cost || 0);
    if (gain > G.$(1e6)) G.addStat("fame", 3);
    return G.result(a.n, gain >= 0 ? "落槌！{n}以{m}成交，赚了{g}。|Sold! {n} went for {m} — a gain of {g}." : "{n}以{m}成交，亏了{g}。|{n} sold for {m} — a loss of {g}.", { n: x.n, m: G.M(got), g: G.M(Math.abs(gain)) }, [], a.i);
  }
  G.ACT_CATS.push({ id: "collect", n: "收藏|Collecting", i: "🏺", items: [
    { id: "coll_buy", n: "买入收藏品|Buy a Collectible", i: "🛍️", e: 5, a: [14, 110], run: buyColl },
    { id: "coll_view", n: "看看我的收藏|View Your Collection", i: "🔍", e: 0, a: [14, 120], if: function () { return collItems().length > 0; }, run: appraise },
    { id: "coll_sell", n: "送去拍卖|Send to Auction", i: "🔨", e: 5, a: [14, 120], if: function () { return collItems().length > 0; }, run: sellColl }
  ] });

  /* ===================== pets that grow old ===================== */
  var PET = { dog: ["小狗|dog", 13], cat: ["小猫|cat", 16], rabbit: ["兔子|rabbit", 9], parrot: ["鹦鹉|parrot", 40] };
  G.evs([
    { id: "pet_trick", sys: 1, title: "宠物学会了新本领|A New Trick", icon: "🐾", prep: function (c) { if (!c.p.pet) return false; },
      t: function (c) { return G.pick(["你的宠物学会了握手，见人就伸爪子。|Your pet learned to shake hands and offers a paw to everyone.", "它学会了自己开门，还会把你的拖鞋叼过来。|It learned to open doors and fetch your slippers.", "你下班回家，它在门口已经等了一个小时。|You came home from work and it had been waiting by the door for an hour."]); },
      o: [{ t: "摸摸它的头|Pat its head", run: function (c) { c.add("happy", 6); c.add("stress", -5); return "它眯起眼睛，尾巴摇个不停。|It closed its eyes, tail going non-stop."; } }] },
    { id: "pet_old", sys: 1, title: "老伙计|Old Friend", icon: "🕯️", bad: 1, prep: function (c) { var pt = c.p.pet; if (!pt) return false; c.prm.y = S().year - pt.y; },
      t: "陪了你{y}年的宠物走得越来越慢了。今天早上，它没有像往常一样来叫你起床。|The pet who has been with you for {y} years has slowed down. This morning, it didn’t come to wake you as usual.",
      o: [{ t: "抱着它，陪它走完最后一程|Hold it through the end", run: function (c) { var y = c.prm.y; c.p.flags.petMem = (c.p.flags.petMem || 0) + 1; c.p.flags.lastPet = { k: c.p.pet.k, y: y }; c.p.pet = null; c.add("happy", -15); c.add("eq", 3); G.major("和陪伴{y}年的宠物告别|Said goodbye to a pet of {y} years", { y: y }); return "它在你怀里安静地睡着了。你在院子里给它种了一棵树。|It fell asleep quietly in your arms. You planted a tree for it in the garden."; } }] }
  ]);
  var mt = G.money.tick;
  G.money.tick = function () {
    var r = mt.apply(this, arguments), s = S(), p = s.p;
    if (s.dead) return r;
    // dreams: chosen at 18, checked every year
    if (p.age === 18 && !p.bucket && !p.jail) q("bucket_pick");
    try { checkBucket(); } catch (e) { }
    // collections drift with the market
    collItems().forEach(function (x) { var c = COLL.filter(function (y) { return y.id === x.coll; })[0]; if (!c) return; x.val = Math.max(1, Math.round(x.val * (1 + c.drift + G.nrm(0, c.vol)))); });
    // pets
    if (p.pet) { var info = PET[p.pet.k] || ["|", 14], age = s.year - p.pet.y; if (age >= info[1] - 2 && G.ch(.25 + (age - info[1]) * .1)) q("pet_old"); else if (G.ch(.18)) q("pet_trick"); G.addStat("happy", 1, true); G.addStat("stress", -2, true); }
    return r;
  };
  // the bucket list, on the life page
  var lifeC = G.ACT_CATS.filter(function (c) { return c.id === "life"; })[0];
  if (lifeC) lifeC.items.unshift({ id: "bucket_view", n: "我的愿望清单|My Bucket List", i: "📝", e: 0, a: [18, 120], if: function () { return !!P().bucket; }, run: async function (a) {
    var lines = P().bucket.map(function (b) { var d = dream(b.id); return (b.done ? "✅ " : "⬜ ") + G.T(d ? d.n : b.id) + (b.done ? G.T("（{y}年）| ({y})", { y: b.done }) : ""); });
    return G.result(a.n, lines.join("\n"), null, [], a.i);
  } });
  // published books and conquered summits count toward dreams
  ["memoir", "write"].forEach(function (id) { G.ACT_CATS.concat([{ items: G.ACT_RETIRED || [] }]).forEach(function (c) { c.items.forEach(function (x) { if (x.id === id && !x._pub) { x._pub = 1; var r0 = x.run; x.run = function () { P().flags.published = 1; return r0.apply(this, arguments); }; } }); }); });
})();
