/* Version 1.7: the loose ends from playtesting.
   - Family money is real income: what a spouse or parents give an adult shows in the books and is taxed.
   - The nanny is paid half and half by both parents.
   - A spouse may quietly pay for your acknowledged child’s international school.
   - Children who study abroad may stay: a visa, then residency, then citizenship.
   - Everyone is born with one hobby they are made for — and it takes twice as fast. */
(function () {
  "use strict";
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function q(id, nid, prm) { var s = S(); (s.pendQ = s.pendQ || []).push({ id: id, nid: nid, prm: prm }); }

  /* ---------- money from family is income, and it is taxed ---------- */
  G.giftIn = function (m, tagZhEn, taxable) {
    if (!m || m <= 0) return 0;
    var p = P(), rate = taxable === false || p.age < 18 ? 0 : (G.C[p.country].tax || .2) * .6;
    if (G.fin) G.fin.tag = typeof tagZhEn === "string" ? G.L(tagZhEn) : tagZhEn; G.addMoney(m); if (G.fin) G.fin.tag = null;
    var tax = Math.round(m * rate);
    if (tax > 0) { if (G.fin) G.fin.tag = G.L("个人所得税（家庭赠与）|Income tax (family gifts)"); G.addMoney(-tax); if (G.fin) G.fin.tag = null; }
    return m - tax;
  };

  /* ---------- the nanny is paid by both parents ---------- */
  function otherParentOf(k) { var p = P(), id = k.par2 || k.other; var o = id && S().npcs[id]; if (o && o.alive) return o; var sp = N.spouse(); return sp && sp.alive ? sp : null; }
  G.payHalf = function (k, m) {
    var o = k ? otherParentOf(k) : null, half = Math.round(m / 2);
    if (o && (o.wealth || 0) >= half) { if (!G.pay(m - half)) return false; o.wealth -= half; return true; }
    return G.pay(m);
  };

  /* ---------- a spouse who pays for your acknowledged child ---------- */
  var pk = G.payKid;
  if (pk) G.payKid = function (k, m) {
    var sp = k && k.sponsor && S().npcs[k.sponsor];
    if (sp && sp.alive && (sp.wealth || 0) >= m) { sp.wealth -= m; return true; }
    return pk.apply(this, arguments);
  };
  G.evs([{ id: "sp_sponsor", sys: 1, title: "意想不到的支持|Unexpected Support", icon: "🏫",
    prep: function (c) { var sp = N.spouse(), k = c.npc; if (!sp || !k || !k.alive) return false; c.prm.s = sp.name; c.prm.n = k.name; },
    t: "{s}把一份国际学校的入学表格放在你面前：“{n}也是你的孩子。孩子没有错，学费我来出。”|{s} puts an international school application in front of you: “{n} is your child too. The child did nothing wrong. I’ll pay the fees.”",
    o: [{ t: "感动地接受|Accept, moved", run: function (c) { var k = c.npc, sp = N.spouse(); k.sponsor = sp.id; k.sch = "intl"; k.schY = S().year; k.schPaid = S().year; N.addLove(sp, 10); N.addAff(k, 12); c.add("happy", 8); return "{n}去了国际学校。开学那天，{s}亲自送{n}去的。|{n} started at the international school. On the first day, {s} took {n} there in person."; } },
      { t: "婉拒，不想欠ta的|Decline — you don’t want to owe them", run: function (c) { N.addLove(N.spouse(), -2); return "{s}叹了口气：“你总是这样。”|{s} sighed: “You’re always like this.”"; } }] }]);

  /* ---------- children who study abroad may stay ---------- */
  G.evs([{ id: "kid_stay_abroad", sys: 1, title: "孩子想留在国外|Your Child Wants to Stay", icon: "🛂",
    prep: function (c) { var k = c.npc; if (!k || !k.alive || !k.edu || !k.edu.abroad) return false; c.prm.n = k.name; c.prm.c = G.C[k.edu.abroad].n; },
    t: "{n}在电话里说：“{c}有一家公司给了我工作签证。我想留下来。”|{n} calls: “A company in {c} has offered me a work visa. I want to stay.”",
    o: [{ t: "支持ta|Support them", run: function (c) { var k = c.npc, to = k.edu.abroad; k.c = to; k.visa = { c: to, y: S().year, st: "work" }; N.addAff(k, 10); c.add("happy", 2); G.log("{n}拿到了{c}的工作签证，留在了那里。|{n} got a work visa for {c} and stayed.", { n: k.name, c: G.C[to].n }); return "你说：“想家了就回来。”电话那头，{n}哭了。|You said: “Come home whenever you miss us.” On the other end, {n} cried."; } },
      { t: "希望ta回来|Ask them to come home", run: function (c) { var k = c.npc; if (G.ch(.5)) { N.addAff(k, -4); return "{n}犹豫了很久，最后买了回国的机票。|{n} hesitated a long time, then booked a flight home."; } var to = k.edu.abroad; k.c = to; k.visa = { c: to, y: S().year, st: "work" }; N.addAff(k, -10); return "{n}沉默了很久：“对不起，我已经决定了。”|{n} was silent a long time: “I’m sorry. I’ve decided.”"; } }] }]);

  /* ---------- the hobby you were born for ---------- */
  var PRO = G.PRO_HOBBY || {};
  [["dancer", "舞蹈老师|Dance Teacher", [22000, 80000]], ["chefpro", "私房菜主厨|Private Chef", [30000, 160000]], ["photog", "自由摄影师|Freelance Photographer", [24000, 120000]],
   ["yogi", "瑜伽导师|Yoga Instructor", [24000, 90000]], ["runner", "职业跑者|Professional Runner", [20000, 150000]], ["chess", "职业棋手|Professional Board-Game Player", [18000, 200000]],
   ["gardener", "园艺设计师|Garden Designer", [26000, 110000]], ["musician", "驻唱乐手|Resident Musician", [20000, 90000]], ["martial", "武术教练|Martial Arts Coach", [24000, 85000]], ["astro", "天文摄影师|Astrophotographer", [18000, 70000]]
  ].forEach(function (x) { PRO[x[0]] = { n: x[1], pay: x[2] }; });
  var HOOK = { dance: "dancer", cook: "chefpro", photo: "photog", yoga: "yogi", run: "runner", board: "chess", garden: "gardener", instrument: "musician", martial: "martial", stars: "astro" };
  G.ACT_CATS.forEach(function (c) { c.items.forEach(function (a) { var k = HOOK[a.id]; if (!k || a._hob) return; a._hob = 1; var r0 = a.run; a.run = function () { var r = r0.apply(this, arguments); var t = G.hobby ? G.hobby(k) : ""; if (t) G.log(t.replace(/^\n/, "")); return r; }; }); });
  var GIFT_TXT = {
    angler: "坐在水边时，你比谁都有耐心。|By the water you have more patience than anyone.", climber: "你一看到高处就想往上爬。|You can’t see a height without wanting to climb it.",
    hiker: "你走再远的路都不觉得累。|You never tire, however far you walk.", gamer: "任何游戏你玩三遍就能通关。|You master any game in three tries.",
    reader: "你一天能读完一本书，还记得每一个细节。|You finish a book a day and remember every detail.", foodie: "你只尝一口就知道菜里放了什么。|One taste tells you every ingredient.",
    dancer: "音乐一响，你的身体就自己动了起来。|When music plays, your body just moves.", chefpro: "你炒的第一个菜就让全家抢光了。|Your very first dish was devoured by the family.",
    photog: "你随手拍的照片都像明信片。|Your casual snaps look like postcards.", yogi: "你的身体比同龄人柔软得多。|You’re far more flexible than anyone your age.",
    runner: "你跑起来像风一样。|You run like the wind.", chess: "你第一次下棋就赢了大人。|You beat an adult the first time you played chess.",
    gardener: "你种什么活什么。|Everything you plant thrives.", musician: "你听一遍就能把曲子弹出来。|You can play a tune after hearing it once.",
    martial: "你的反应快得惊人。|Your reflexes are astonishing.", astro: "你能叫出夜空里每一颗亮星的名字。|You can name every bright star in the sky."
  };
  G.GIFT_TXT = GIFT_TXT;
  G.evs([{ id: "gift_reveal", sys: 1, title: "天生的爱好|Born For It", icon: "🌟",
    prep: function (c) { var g = c.p.flags.gift; if (!g || !PRO[g]) return false; c.prm.g = PRO[g].n; c.prm.t = GIFT_TXT[g] || ""; },
    t: "{t}大人们说，你天生就适合这个。（天赋爱好：{g}——练这项爱好进步加倍，练够了能成为职业）|{t} The grown-ups say you were born for it. (Natural hobby: {g} — progress doubles, and with enough practice it becomes a career)",
    o: [{ t: "我喜欢！|I love it!", run: function (c) { c.add("happy", 6); return "你在心里悄悄记下了这件事。|You tucked the thought away in your heart."; } }] }]);
  var cr = G.life.create;
  G.life.create = function () { var r = cr.apply(this, arguments), p = S().p; if (!p.flags.gift) { var ks = Object.keys(PRO); p.flags.gift = ks[Math.floor(G.R() * ks.length)]; } return r; };

  /* ---------- yearly ---------- */
  var mt = G.money.tick;
  G.money.tick = function () {
    var r = mt.apply(this, arguments), s = S(), p = s.p;
    if (s.dead) return r;
    if (p.age === 8 && p.flags.gift && !p.flags.giftShown) { p.flags.giftShown = 1; q("gift_reveal"); }
    // a generous spouse and an acknowledged child
    var sp = N.spouse();
    if (sp && sp.alive && !p.flags.sponsorAsk && (sp.wealth || 0) > G.$(300000) && (sp.love || 0) >= 60) {
      var ak = N.rel("child").filter(function (k) { var a = N.age(k); return k.alive && k.illegit && k.ack && a >= 5 && a <= 15 && !k.sponsor && k.par2 !== sp.id; })[0];
      if (ak && G.ch(.25)) { p.flags.sponsorAsk = 1; q("sp_sponsor", ak.id); }
    }
    // children abroad: work visa → residency → citizenship
    N.rel("child", "grandchild").forEach(function (k) {
      if (!k.alive) return; var a = N.age(k);
      if (k.edu && k.edu.abroad && !k.visa && !k.stayAsk && a >= 21 && a <= 25 && k.edu.stage === "done") { k.stayAsk = 1; if (G.ch(.55 + (k.sch === "abroad" ? .2 : 0))) q("kid_stay_abroad", k.id); }
      if (k.visa && k.visa.st === "work" && s.year - k.visa.y >= 4) { k.visa.st = "pr"; G.log("{n}拿到了{c}的永久居留权。|{n} got permanent residency in {c}.", { n: k.name, c: G.C[k.visa.c].n }); }
      else if (k.visa && k.visa.st === "pr" && s.year - k.visa.y >= 8) { k.visa.st = "cit"; k.cits = (k.cits || [p.country]); if (k.cits.indexOf(k.visa.c) < 0) k.cits.push(k.visa.c); G.log("{n}成为了{c}公民。|{n} became a citizen of {c}.", { n: k.name, c: G.C[k.visa.c].n }); }
    });
    return r;
  };

  /* ---------- profiles show visas ---------- */
  var ni = G.npcInfo;
  G.npcInfo = function (n) {
    var r = ni.apply(this, arguments) || [];
    if (n.visa) r.push(["签证|Visa", G.C[n.visa.c].flag + " " + G.T(n.visa.st === "cit" ? "已入籍|Citizen" : n.visa.st === "pr" ? "永久居民|Permanent resident" : "工作签证|Work visa") + " · " + G.T(G.C[n.visa.c].n)]);
    if (n.sponsor && S().npcs[n.sponsor]) r.push(["学费由谁出|Fees paid by", S().npcs[n.sponsor].name]);
    return r;
  };
})();
