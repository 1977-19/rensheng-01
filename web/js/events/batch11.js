/* Batch 11: fixes around inheriting and starting over, one nationality everywhere, no "potential" grade,
   nurture that pays off in exams, gold only on the best choice, heirs who travel and give, campus offers at
   graduation, names from every culture, mixed heritage, four new families, culture-aware hobbies,
   believable wealth for ordinary people, fewer layoffs, and many new stories. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC, FA = G.family, LO = G.love;
  function S() { return G.S; }
  function setN(c, n) { c.npc = n; c.prm.n = n.name; var pr = G.pr ? G.pr(n.g) : {}; for (var k in pr) c.prm[k] = pr[k]; }

  /* ================= the estate is settled once ================= */
  // reopening a finished life used to divide the estate again (with a fresh roll for any lawsuit)
  var run11 = G.ending.run;
  G.ending.run = async function () {
    var s = S();
    if (s && s.dead && s.ending && s.ending._done) { if (G.UI.ending) await G.UI.ending(s.ending); return; }
    await run11.apply(this, arguments);
    if (s && s.ending) s.ending._done = 1;
  };

  /* ================= the parent you were keeps their title ================= */
  G.titleAlive = function () { var s = S(), d = s.dead; s.dead = false; try { return G.title(); } finally { s.dead = d; } };
  function fixOldSelf(t, name, by) {
    if (!t || /无业|Unemployed|已故|Deceased/.test(t)) return;
    N.all(function (n) { return (n.wasYou || (n.name === name && n.by === by)) && (n.rel === 'father' || n.rel === 'mother'); }).forEach(function (n) { n.job = t; n.jobBase = null; });
  }
  var reb11 = G.life.rebirthAs;
  if (reb11) G.life.rebirthAs = function (kid) {
    var old = S().p, t = G.titleAlive(), nm = old.name, by = old.birthYear, inc = 0;
    try { if (old.job) inc = old.job.sal || 0; } catch (e) { }
    var r = reb11.apply(this, arguments);
    fixOldSelf(t, nm, by);
    N.all(function (n) { return n.wasYou; }).forEach(function (n) { if (inc) n.inc = inc; });
    var p = S().p; p.birthC = p.country;
    return r;
  };
  var cont11 = G.life.continueAs;
  G.life.continueAs = function (kid) {
    var old = S().p, t = G.titleAlive(), nm = old.name, by = old.birthYear, bornIn = kid.bornC || kid.c || old.birthC || old.country;
    var r = cont11.apply(this, arguments);
    fixOldSelf(t, nm, by);
    var p = S().p; p.birthC = bornIn;
    if (kid.cits && kid.cits.length) p.cits = kid.cits.slice();
    // the surviving parent's half of a large estate is real money, not a salary
    N.all(function (n) { return n.rel === 'father' || n.rel === 'mother'; }).forEach(function (n) { if (n.wealth > G.$(1e6)) n.richW = 1; });
    return r;
  };

  /* ================= one nationality, shown the same everywhere ================= */
  var create11 = G.life.create;
  G.life.create = function (o) { var s = create11.apply(this, arguments); if (s && s.p && !s.p.birthC) s.p.birthC = s.p.country; return s; };
  G.birthC = function (p) { p = p || S().p; return p.birthC || (p.imm && p.imm[0]) || p.country; };
  G.citsOf = function (p) { p = p || S().p; var c = p.cits && p.cits.length ? p.cits.slice() : [G.birthC(p)]; return c; };
  G.natText = function (p) { return G.citsOf(p).map(function (c) { return G.C[c] ? G.C[c].flag + ' ' + G.T(G.C[c].n) : c; }).join('  '); };
  G.bornText = function (p) { var c = G.birthC(p); return G.C[c] ? G.C[c].flag + ' ' + G.T(G.C[c].n) : c; };
  G.liveText = function (p) { p = p || S().p; var r = G.residence ? G.residence() : p.country; return (G.C[r] ? G.C[r].flag + ' ' + G.T(G.C[r].n) : r) + ' · ' + G.T(p.city || ''); };

  /* ================= no fixed "potential": how a child does depends on them and on you ================= */
  G.kidScore = function (k) {
    var e = k.edu || {}, v = Math.round((k.smarts || 50) * .55 + (e.perf || 50) * .3 + Math.min(20, (k.nur || 0) * .4) + (k.eq || 50) * .08);
    v = G.clamp(v, 5, 99); return { v: v, g: G.potGrade ? G.potGrade(v) : '' };
  };
  // what each kind of school gives, every year and once
  var SCH_NUR = { intl: 12, abroad: 15, priv: 8, key: 8, board: 4, pub: 0 }, SCH_PERF = { intl: 3, abroad: 4, priv: 2, key: 3, board: 1, pub: 0 };
  var BEST_ORDER = ['abroad', 'intl', 'key', 'priv', 'board', 'pub'];
  var grow11 = FA.growKid;
  FA.growKid = function (k, Q) {
    if (k && k.alive && k.rel === 'child') {
      var a = N.age(k), e = k.edu;
      k.nur = (k.nur || 0) + (k.inv || 0) * 2;
      if (e && e.stage && e.stage !== 'none' && e.stage !== 'done' && k.sch) e.perf = G.clamp((e.perf || 50) + (SCH_PERF[k.sch] || 0), 0, 100);
      // the year of the big exam: everything you put in shows up here
      if (a === 18 && e && e.stage === 'high') e.perf = G.clamp((e.perf || 50) + Math.min(22, (k.nur || 0) * .35), 0, 100);
    }
    var r = grow11.apply(this, arguments);
    if (k && k.alive && k.rel === 'child' && N.age(k) >= 18 && (k.unemp || k.neet) && richFamily()) k.job = '富二代|Heir to a Fortune';
    return r;
  };
  if (G.EV.k_pick_school) G.EV.k_pick_school.o.forEach(function (o, i) {
    var id = ['pub', 'key', 'priv', 'intl', 'board', 'abroad'][i], r0 = o.run; if (!r0) return;
    o.run = async function (c) {
      var k = c.npc, out = await r0.apply(this, arguments);
      if (k && k.sch === id) {
        k.nur = (k.nur || 0) + (SCH_NUR[id] || 0);
        var best = BEST_ORDER.filter(function (x) { return G.EV.k_pick_school.o[['pub', 'key', 'priv', 'intl', 'board', 'abroad'].indexOf(x)].if(c); })[0];
        if (id === best) { G.dPush('aff', N.addAff(k, G.ri(6, 10))); }
      }
      return out;
    };
  });
  if (G.EV.k_pick_uni) { var ab = G.EV.k_pick_uni.o[1], ar = ab && ab.run; if (ar) ab.run = async function (c) { var k = c.npc, s0 = k.smarts; k.smarts = G.clamp(s0 + Math.min(25, (k.nur || 0) * .3), 1, 100); try { return await ar.apply(this, arguments); } finally { k.smarts = s0; } }; }

  /* ================= gold means "the best one", and there is only one ================= */
  var RANK = [/出国|留学|海外|abroad|Abroad|overseas/, /国际|International/, /顶尖|顶级|最好的|名校|Top|best|Elite/, /私立|贵族|Private/, /私人医院|特需|VIP/, /保姆|富养|nanny|Lavish/, /寄宿|Boarding/, /捐资|Donat/];
  function rankOf(t) { for (var i = 0; i < RANK.length; i++) if (RANK[i].test(t)) return i; return 99; }
  function dedupe() {
    document.querySelectorAll('.veil').forEach(function (v) {
      var bs = [].slice.call(v.querySelectorAll('.opt:not(.solid), .row')), best = null, br = 99;
      bs.forEach(function (b) { var r = rankOf(b.textContent); if (r < br) { br = r; best = b; } });
      bs.forEach(function (b) { if (b !== best) b.classList.remove('prem'); else if (br < 99) b.classList.add('prem'); });
    });
  }
  // runs after the other observer has painted its gold
  var tidy = typeof MutationObserver === 'undefined' ? null : new MutationObserver(function () { setTimeout(dedupe, 0); });
  try { if (tidy) tidy.observe(document.body, { childList: true, subtree: true }); } catch (e) { }

  /* ================= heirs to a fortune ================= */
  function richFamily() { var p = S().p; return !!(p.flags.rich || (G.famClass && G.famClass() >= 2) || G.netWorth() >= G.$(5e6)); }
  G.richHeir = function () { var p = S().p; return p.age >= 16 && !S().dead && !p.jail && richFamily(); };
  var title11 = G.title;
  G.title = function () {
    var t = title11.apply(this, arguments), p = S().p;
    if (t === '无业|Unemployed' && !S().dead) {
      if (richFamily()) return p.age < 35 ? '富二代|Heir to a Fortune' : (p.flags.heir ? '家族继承人|Family Heir' : '财务自由|Financially Independent');
      if (p.st && G.netWorth() >= G.$(1e6)) return '财务自由|Financially Independent';
    }
    return t;
  };
  var TRIPS = [
    ['mald', '马尔代夫私人岛屿|A Private Island in the Maldives', '🏝️', 600000, { happy: 12, health: 3 }, '你包下了整座小岛，每天醒来就是一片透明的海。|You rented the whole island. Every morning began with a sea as clear as glass.'],
    ['ant', '南极探险邮轮|An Antarctic Expedition Cruise', '🐧', 450000, { happy: 10, smarts: 3 }, '冰山比楼还高，企鹅一点也不怕人。|Icebergs taller than buildings, and penguins with no fear of people at all.'],
    ['f1', '摩纳哥F1大奖赛|The Monaco Grand Prix', '🏎️', 900000, { happy: 12, fame: 4 }, '你在游艇甲板上看完了整场比赛，冠军开香槟时离你只有几十米。|You watched the whole race from a yacht deck; the champion sprayed champagne a few dozen metres away.'],
    ['paris', '巴黎时装周头排|Front Row at Paris Fashion Week', '👗', 500000, { looks: 4, fame: 5 }, '摄影师的闪光灯一直对着你。|The photographers\' flashes never left you.'],
    ['alps', '瑞士私人滑雪木屋|A Private Chalet in the Swiss Alps', '⛷️', 400000, { health: 5, happy: 8 }, '白天滑雪，晚上在壁炉边看雪落下来。|Skiing by day, watching the snow by the fire at night.'],
    ['aurora', '私人飞机追极光|Chasing the Aurora by Private Jet', '🌌', 1200000, { happy: 14 }, '绿色的光在头顶翻涌，你第一次觉得世界这么大。|Green light rippled overhead. For the first time you felt how big the world is.'],
    ['safari', '肯尼亚野生动物摄影之旅|A Wildlife Photography Safari in Kenya', '🦒', 350000, { happy: 8, eq: 2 }, '你拍到了一群大象在夕阳下过河。|You caught a herd of elephants crossing a river at sunset.'],
    ['space', '太空边缘亚轨道飞行|A Suborbital Flight to the Edge of Space', '🚀', 3500000, { happy: 18, fame: 8 }, '失重的那几分钟里，你看到了地球的弧线。|In those weightless minutes you saw the curve of the Earth.', 2021]
  ];
  var CAUSES = [
    ['water', '非洲净水计划|Clean Water for Africa', '💧', 3200000, '三十个村子用上了干净的井水。|Thirty villages now drink clean well water.'],
    ['vax', '全球儿童疫苗|Vaccines for the World\'s Children', '💉', 3500000, '一百万剂疫苗送到了最需要的地方。|A million doses reached the places that needed them most.'],
    ['forest', '雨林保护|Saving the Rainforest', '🌳', 4000000, '一片和城市一样大的雨林被保护了下来。|A rainforest the size of a city is now protected.'],
    ['ocean', '海洋塑料清理|Cleaning Plastic from the Ocean', '🌊', 3000000, '清理船从海里捞起了几千吨塑料。|The cleanup ships pulled thousands of tonnes of plastic from the sea.'],
    ['school', '战乱地区儿童教育|Schools for Children in War Zones', '📚', 3800000, '二十所学校重新响起了读书声。|Twenty schools filled with the sound of reading again.'],
    ['rare', '罕见病药物研发|Medicines for Rare Diseases', '🧬', 5000000, '一种罕见病第一次有了药。|For the first time, a rare disease has a medicine.']
  ];
  function yearLock(k) { var f = S().p.flags; return f[k] === S().year ? G.L('今年已经安排过了。|Already done this year.') : null; }
  G.ACT_CATS.push({ id: 'heir', n: '富二代生活|Life of a Fortune\'s Heir', i: '🛥️', items: [
    { id: 'heir_trip', n: '安排今年的旅行|Plan This Year\'s Trip', i: '✈️', d: '每年一次，花费几十万到几百万美元|Once a year — hundreds of thousands to millions of dollars', e: 0, a: [16, 110],
      if: function () { return G.richHeir(); }, lock: function () { return yearLock('tripY'); },
      run: async function (a) {
        var L = TRIPS.filter(function (x) { return !x[6] || S().year >= x[6]; });
        var i = await G.UI.pick({ title: G.L('今年去哪里？|Where to this year?'), items: L.map(function (x) { var m = G.$(x[3]); return { t: G.L(x[1]), sub: G.fm(m), icon: x[2], dis: !G.canPay(m) }; }) });
        if (i < 0) return 'cancel';
        var x = L[i], m = G.$(x[3]); if (!G.pay(m)) return 'cancel';
        S().p.flags.tripY = S().year; G.major('旅行：{x}|Trip: {x}', { x: x[1] });
        return G.quick(a, G.L(x[5]), x[4]);
      } },
    { id: 'heir_give', n: '支持世界公益|Support a Global Cause', i: '🌍', d: '每年一次，一次三百多万美元起|Once a year — from about $3 million', e: 0, a: [16, 110],
      if: function () { return G.richHeir(); }, lock: function () { return yearLock('giveY'); },
      run: async function (a) {
        var i = await G.UI.pick({ title: G.L('今年支持哪个项目？|Which cause this year?'), items: CAUSES.map(function (x) { var m = G.$(x[3]); return { t: G.L(x[1]), sub: G.fm(m), icon: x[2], dis: !G.canPay(m) }; }) });
        if (i < 0) return 'cancel';
        var x = CAUSES[i], m = G.$(x[3]); if (!G.pay(m)) return 'cancel';
        S().p.flags.giveY = S().year; G.inc('donated', m); G.major('资助{x}|Funded {x}', { x: x[1] });
        return G.quick(a, G.L(x[4]), { karma: 15, fame: 6, happy: 6 });
      } },
    { id: 'heir_art', n: '拍卖会买一件艺术品|Buy Art at Auction', i: '🖼️', e: 0, a: [20, 110],
      if: function () { return G.richHeir(); }, lock: function () { return yearLock('artY'); },
      run: async function (a) {
        var m = G.$(G.ri(8, 40) * 100000); if (!(await G.UI.confirm(G.L('举牌|Raise Your Paddle'), G.L('落槌价{m}。买下吗？|The hammer price is {m}. Buy it?', { m: G.M(m) })))) return 'cancel';
        if (!G.pay(m)) return 'cancel'; S().p.flags.artY = S().year;
        S().assets.art = (S().assets.art || 0) + Math.round(m * G.rf(.8, 1.5));
        return G.quick(a, G.L('你把画挂在了客厅。懂行的人都说你捡了个漏。|You hung the painting in the living room. Those who know say you got a bargain.'), { happy: 6, fame: 2 });
      } }
  ] });
  var nw11 = G.netWorth;
  G.netWorth = function () { var v = nw11.apply(this, arguments), s = S(); return v + (s && s.assets && s.assets.art ? s.assets.art : 0); };

  /* ================= graduation: the best job your degree can get ================= */
  function bestJobs(n) {
    var CR = G.career;
    return G.JOBS.filter(function (j) { return !j.pt && G.jobOk(j) && CR.qualify(j).ok; })
      .sort(function (a, b) { return CR.salary(b, 0) - CR.salary(a, 0); }).slice(0, n || 4);
  }
  G.bestJobs = bestJobs;
  if (G.EV.sys_graduate) G.EV.sys_graduate.o.unshift({
    t: function () { var L = bestJobs(1); return L.length ? G.L('接受最好的校招offer：{j}（{s}/年）|Take the best campus offer: {j} ({s}/yr)', { j: L[0].r[0], s: G.M(G.career.salary(L[0], 0)) }) : G.L('看看校招offer|See campus offers'); },
    if: function (c) { return !c.p.job && bestJobs(1).length > 0; },
    run: async function (c) {
      var L = bestJobs(4);
      var i = await G.UI.pick({ title: G.L('校招offer（按年薪排序）|Campus Offers (by salary)'), text: G.L('这些都是按你的学历和专业匹配到的岗位，薪水最高的排在最前面。|Matched to your degree and major, highest pay first.'),
        items: L.map(function (j, k) { return { t: G.L(j.r[0]), sub: G.L('{s}/年|{s}/yr', { s: G.M(G.career.salary(j, 0)) }) + (k === 0 ? G.L(' · 最好的|· the best') : ''), icon: k === 0 ? '🏆' : '💼' }; }) });
      if (i < 0) i = 0;
      var j = L[i]; G.career.hire(j);
      return G.L('你签下了{j}的offer，年薪{s}。|You signed with {j}. Salary: {s}/yr.', { j: j.r[0], s: G.M(c.p.job.sal) });
    } });

  /* ================= names from every culture ================= */
  var REGAL = { m: ['威廉|William', '亚历山大|Alexander', '亨利|Henry', '路易|Louis', '乔治|George', '爱德华|Edward', '塞巴斯蒂安|Sebastian', '西奥多|Theodore', '本杰明|Benjamin', '詹姆斯|James'],
    f: ['夏洛特|Charlotte', '伊丽莎白|Elizabeth', '维多利亚|Victoria', '索菲亚|Sophia', '奥利维亚|Olivia', '艾米莉亚|Amelia', '伊莎贝拉|Isabella', '克莱尔|Claire', '艾琳|Eileen', '格蕾丝|Grace'] };
  var CNG = { m: ['子轩|Zixuan', '浩然|Haoran', '宇航|Yuhang', '明哲|Mingzhe', '一诺|Yinuo', '思远|Siyuan', '景行|Jingxing', '承泽|Chengze'], f: ['若曦|Ruoxi', '诗涵|Shihan', '欣怡|Xinyi', '梓萱|Zixuan', '语桐|Yutong', '一诺|Yinuo', '安然|Anran', '知夏|Zhixia'] };
  function zh(x) { return String(x).split('|')[0]; } function en(x) { var s = String(x).split('|'); return s[1] || s[0]; }
  // the base suggestions are installed later by the UI; wrap whatever gets installed
  function extend(groups0) { return function (cul, sur, g, by, sibs) {
    var out = (groups0 ? groups0.apply(this, arguments) : null) || [], gg = g === 'f' ? 'f' : 'm';
    if (cul === 'cn') {
      var fn = G.shuffle(((G.NAMES.us || {})[gg] || REGAL[gg]).slice()).slice(0, 4);
      out.push({ label: G.L('外文名|Western-style names'), names: fn.map(function (x) { return zh(x) + '·' + zh(sur) + '|' + en(x) + ' ' + en(sur); }) });
      return out;
    }
    var C = G.NAMES[cul] || G.NAMES.us, pool = (C[gg] || []).slice();
    // same first letter as the older children: a family series
    var ini = null; (sibs || []).forEach(function (n) { var e = en(n.giv || n.name || ''); if (e && !ini) ini = e.charAt(0).toUpperCase(); });
    var byIni = {}; pool.forEach(function (x) { var k = en(x).charAt(0).toUpperCase(); (byIni[k] = byIni[k] || []).push(x); });
    if (!ini || !byIni[ini] || byIni[ini].length < 2) { var ks = Object.keys(byIni).filter(function (k) { return byIni[k].length >= 3; }); ini = ks.length ? G.pick(ks) : null; }
    if (ini && byIni[ini]) out.push({ label: G.L('“{i}”字母系列|The "{i}" series', { i: ini }), names: G.shuffle(byIni[ini].slice()).slice(0, 4).map(function (x) { return G.mkName(cul, sur, x, g); }) });
    out.push({ label: G.L('经典名字|Classic names'), names: G.shuffle(REGAL[gg].slice()).slice(0, 4).map(function (x) { return G.mkName(cul, sur, x, g); }) });
    out.push({ label: G.L('中文名|Chinese names'), names: G.shuffle(CNG[gg].slice()).slice(0, 4).map(function (x) { return G.mkName(cul, sur, x, g); }) });
    return out;
  }; }
  (function () { var cur = extend(G.nameGroups); Object.defineProperty(G, 'nameGroups', { configurable: true, get: function () { return cur; }, set: function (fn) { cur = extend(fn); } }); })();

  /* ================= mixed heritage ================= */
  var MIXC = ['us', 'gb', 'fr', 'de', 'jp', 'kr', 'it', 'es', 'au', 'ca', 'ru', 'br', 'th', 'za', 'ie', 'se'];
  function blendSkin(a, b) { return Math.round(((a == null ? 1 : a) + (b == null ? 1 : b)) / 2); }
  var baby11 = LO.baby;
  LO.baby = async function (other, adopted) {
    var k = await baby11.apply(this, arguments), p = S().p;
    if (k && other && !adopted && other.c && other.c !== p.country) {
      k.mixed = other.c; k.skin = blendSkin(p.skin, other.skin);
      k.cits = k.cits || [k.c || p.country]; if (k.cits.indexOf(other.c) < 0) k.cits.push(other.c);
      G.log('{n}是个混血宝宝，同时拥有两个国家的国籍。|{n} is of mixed heritage and holds two citizenships.', { n: k.name });
    }
    if (k) k.bornC = k.c || p.country;
    return k;
  };

  /* ================= four new families ================= */
  var NEW_ORIGINS = [
    { id: 'mixed', n: '混血家庭|Mixed-Heritage Family', d: '爸爸妈妈来自两个国家，你从小就说两种语言，长得也和别人有点不一样。|Your parents come from two countries. You grow up with two languages and a face people remember.', vip: 0,
      w: [60000, 400000], inc: [40000, 120000], job: ['外企职员|Multinational Employee', '翻译|Translator', '工程师|Engineer', '大学讲师|Lecturer'], st: { looks: 8, eq: 4 }, sib: [0, 2] },
    { id: 'diplomat', n: '驻外家庭|Expat Family', d: '父母被跨国公司派驻海外，你每隔几年就跟着搬去一个新国家。|Your parents are posted abroad by a multinational; every few years you move to a new country.', vip: 0,
      w: [150000, 600000], inc: [70000, 160000], job: ['跨国公司驻外高管|Expat Executive', '国际组织职员|International Organisation Staff'], st: { eq: 8, smarts: 4 }, sib: [0, 1] },
    { id: 'oldbrand', n: '百年老字号|Century-Old Family Shop', d: '祖上传下来一家百年老店，招牌比爷爷的年纪还大。|Your family runs a shop founded a century ago — its signboard is older than your grandfather.', vip: 0,
      w: [300000, 1500000], inc: [60000, 200000], job: ['老字号掌柜|Owner of a Heritage Shop', '老字号传承人|Heir to a Heritage Shop'], st: { eq: 5, health: 2 }, sib: [0, 2] },
    { id: 'space', n: '航天世家|Spaceflight Family', d: '爸爸是航天工程师，家里的书架上摆满了火箭模型。|Your father builds spacecraft; the shelves at home are full of rocket models.', vip: 0,
      w: [150000, 500000], inc: [80000, 180000], job: ['航天工程师|Spaceflight Engineer', '航天员教练|Astronaut Trainer'], st: { smarts: 10, health: 4 }, sib: [0, 1] }
  ];
  NEW_ORIGINS.forEach(function (o) { if (!G.ORIGIN[o.id]) { G.ORIGINS.push(o); G.ORIGIN[o.id] = o; } });
  var fc11 = G.famClass;
  if (fc11) G.famClass = function () { var c = fc11.apply(this, arguments), p = S() && S().p; if (p && ['mixed', 'diplomat', 'oldbrand', 'space'].indexOf(p.origin) >= 0) c = Math.max(c, 1); return c; };
  var create11b = G.life.create;
  G.life.create = function (o) {
    var s = create11b.apply(this, arguments), p = s && s.p;
    if (!p) return s;
    if (p.origin === 'mixed') {
      var fc = G.pick(MIXC.filter(function (x) { return x !== p.country && G.C[x]; })) || 'us';
      var dadForeign = G.ch(.5), par = N.rel(dadForeign ? 'father' : 'mother')[0];
      if (par) {
        var nm = G.genName(G.C[fc].names, par.g, par.by);
        par.c = fc; par.cul = G.C[fc].names; par.name = nm.name; par.sur = nm.sur; par.giv = nm.giv; par.skin = N.skinFor(fc);
        if (dadForeign) { var gv = G.genGiven(G.C[fc].names, p.g, p.birthYear); p.sur = nm.sur; p.giv = gv; p.name = G.mkName(G.C[fc].names, nm.sur, gv, p.g); N.rel('sibling').forEach(function (b) { b.sur = nm.sur; b.name = G.mkName(G.C[fc].names, nm.sur, G.genGiven(G.C[fc].names, b.g, b.by), b.g); }); }
      }
      p.skin = blendSkin(N.skinFor(p.country), N.skinFor(fc)); p.flags.mixed = fc;
      p.cits = [p.country, fc]; var lg = G.C[fc].lang; if (lg && p.langs.indexOf(lg) < 0) p.langs.push(lg);
      G.log('你是混血儿：一半{a}，一半{b}。|You are of mixed heritage: half {a}, half {b}.', { a: G.C[p.country].n, b: G.C[fc].n });
    }
    if (p.origin === 'diplomat') { var l2 = p.country === 'us' || p.country === 'gb' ? 'fr' : 'en'; if (p.langs.indexOf(l2) < 0) p.langs.push(l2); }
    return s;
  };
  function OE(id, org, a, title, icon, t, o, x) { x = x || {}; var f = x.if; x.if = function (S2, p) { return p.origin === org && !p.flags.heir && (!f || f(S2, p)); }; if (x.w == null) x.w = 2.6; return E(id, a, title, icon, t, o, x); }
  G.evs([
    // mixed heritage
    OE('or_mx_where', 'mixed', [6, 12], '“你是哪国人？”|"Where Are You From?"', '🌏', '新同学围着你问：“你到底是哪国人？”|The new kids crowd around: "So what are you, anyway?"', [
      O('“两国都是！”|"Both!"', R('你骄傲地说了两遍“你好”，一遍一种语言。大家都笑了。|You proudly said hello twice, once in each language. Everyone laughed.', { happy: 4, eq: 3 })),
      O('不说话，低下头|Say nothing and look down', R('那天放学，你问妈妈：“我为什么和别人不一样？”|After school you asked Mom: "Why am I different?"', { happy: -3, eq: 2 }))
    ]),
    OE('or_mx_grandma', 'mixed', [5, 16], '外国的外婆|Grandma from Abroad', '👵', '另一个国家的外婆第一次来看你，带了一整箱你没见过的零食。|Your grandmother from the other country visits for the first time, with a suitcase of snacks you\'ve never seen.', [
      O('用她的语言叫“外婆”|Call her "Grandma" in her language', R('外婆哭了，把你抱得紧紧的。|She cried and held you tight.', { happy: 6, eq: 2 })),
      O('害羞地躲在爸妈身后|Hide shyly behind your parents', R('临走前，你终于跑过去抱了她一下。|Just before she left, you ran over and hugged her.', { happy: 3 }))
    ]),
    OE('or_mx_model', 'mixed', [14, 22], '星探|A Talent Scout', '📸', '商场里，一个星探递来名片：“你的混血脸太适合拍广告了。”|At the mall a scout hands you a card: "Your face is perfect for commercials."', [
      O('去试镜|Go to the audition', RC(.6, '你拍了一支饮料广告，全城的公交站都贴着你的脸。|You shot a soft-drink ad; your face was on every bus stop in town.', { fame: 8, money: 3000, happy: 5 }, '导演说你“不够自然”。|The director said you weren\'t "natural enough."', { happy: -3 })),
      O('专心读书|Focus on school', R('你把名片夹在了课本里。|You tucked the card into a textbook.', { smarts: 2 }))
    ]),
    OE('or_mx_choose', 'mixed', [18, 18], '十八岁的国籍|Citizenship at Eighteen', '🛂', '你成年了，有的国家要求你在两个国籍里选一个。|You\'re eighteen; one of your countries asks you to choose a single citizenship.', [
      O('留在出生的国家|Keep the country you were born in', function (c) { var p = c.p, keep = G.birthC(p); if (G.NODUAL && G.NODUAL[keep]) p.cits = [keep]; H.fx(c, { eq: 2 }); return '你在表格上写下了名字。|You signed the form.'; }),
      O('两个都留着（能留就留）|Keep both, where the law allows', R('律师帮你办好了手续。|A lawyer sorted out the paperwork.', { money: -2000, happy: 2 }))
    ], { if: function (S2, p) { return p.cits && p.cits.length > 1; } }),
    // diplomats' children
    OE('or_dp_move', 'diplomat', [6, 15], '又要搬家了|Moving Again', '🧳', '爸爸的公司又把他派到另一个国家，全家要搬家了。|Dad\'s company is posting him to another country; the whole family is moving again.', [
      O('很快交到新朋友|Make new friends fast', R('三个月后，你已经能用当地话和同学吵架了。|Three months later you could argue with classmates in the local language.', { eq: 5, smarts: 2 })),
      O('哭着和老朋友告别|Say a tearful goodbye to old friends', R('你们约好每周视频。后来是每月，再后来……|You promised weekly video calls. Then monthly. Then…', { happy: -3, eq: 3 }))
    ], { rep: 1, cd: 3 }),
    OE('or_dp_reception', 'diplomat', [10, 17], '公司年会|The Company Gala', '🥂', '爸爸公司办年会，你被安排给各国同事的孩子当“小主人”。|Dad\'s company holds its annual gala; you\'re the "little host" for colleagues\' children from many countries.', [
      O('用三种语言聊天|Chat in three languages', R('一位老总说：“这孩子以后能做国际生意。”|One executive said: "This child will do international business one day."', { eq: 6, fame: 1 })),
      O('偷偷吃光甜点|Quietly eat all the desserts', R('第二天，妈妈收到了甜点师的道谢——他说从没见过这么捧场的客人。|The next day the pastry chef thanked Mom — he\'d never had such an appreciative guest.', { happy: 6 }))
    ]),
    OE('or_dp_crisis', 'diplomat', [8, 17], '撤侨|Evacuation', '🚨', '驻地突然发生动乱，公司连夜安排全家撤离。|Unrest breaks out where you live; the company evacuates your family overnight.', [
      O('帮着照顾更小的孩子|Help look after the younger children', R('飞机起飞时，一个小女孩一直攥着你的手。|As the plane took off, a little girl held your hand the whole way.', { karma: 6, eq: 4 })),
      O('紧紧跟着爸妈|Stay close to your parents', R('落地后，爸爸抱着你说：“没事了。”|When you landed, Dad held you: "It\'s over now."', { happy: -2, par: 4 }))
    ]),
    // heritage shop
    OE('or_ob_recipe', 'oldbrand', [10, 18], '祖传秘方|The Family Secret', '📜', '爷爷把你叫进里屋，拿出一本发黄的小册子：“这是咱家的秘方，传男也传女。”|Grandpa calls you into the back room and opens a yellowed notebook: "Our family\'s secret — for sons and daughters alike."', [
      O('一字一句背下来|Memorise every word', R('爷爷说你比你爸当年学得快。|Grandpa said you learned faster than your father did.', { smarts: 3, eq: 2 })),
      O('偷偷拍照存进手机|Secretly photograph it', R('爷爷看见了，没生气：“时代变了，存好就行。”|Grandpa saw and didn\'t mind: "Times change. Just keep it safe."', { smarts: 1 }))
    ]),
    OE('or_ob_offer', 'oldbrand', [22, 60], '收购邀约|An Offer to Buy', '🏢', '一家连锁集团想出高价收购你家的老字号。|A chain wants to buy your family\'s heritage shop for a high price.', [
      O('卖掉，换一笔大钱|Sell for a fortune', function (c) { c.money(c.$(G.ri(8, 20) * 100000)); H.fx(c, { happy: 2, karma: -2 }); return '签完字那天，你在老招牌下站了很久。|The day you signed, you stood under the old signboard a long time.'; }),
      O('不卖，守住招牌|Refuse and keep the name', R('你在门口挂了块新牌子：“百年老店，只此一家。”|You hung a new sign at the door: "One hundred years. Only here."', { karma: 4, happy: 3, fame: 2 }))
    ]),
    OE('or_ob_live', 'oldbrand', [18, 45], '老字号上直播|The Heritage Shop Goes Live', '📱', '店里生意一年不如一年，有人建议你开直播卖货。|Business shrinks every year. Someone suggests selling on livestream.', [
      O('穿上长衫开播|Put on a traditional gown and go live', RC(.6, '第一场直播就卖空了库存，订单排到了三个月后。|Your first stream sold out the stock; orders are booked three months ahead.', { money: 20000, fame: 5, happy: 5 }, '直播间只有十几个人，一半是亲戚。|A dozen viewers came — half of them relatives.', { happy: -2 })),
      O('老店就该慢慢来|An old shop should take its time', R('老顾客们说，还是那个味道。|The regulars say it tastes just as it always did.', { karma: 2 }))
    ]),
    // spaceflight family
    OE('or_sp_launch', 'space', [5, 14], '看火箭发射|Watching a Launch', '🚀', '爸爸带你去发射场，火箭升空的那一刻，大地都在震。|Dad takes you to the launch site. When the rocket lifts off, the ground shakes.', [
      O('跟着倒数|Count down with everyone', R('“三、二、一——点火！”你喊得嗓子都哑了。|"Three, two, one — ignition!" You shouted yourself hoarse.', { happy: 8, smarts: 2 })),
      O('偷偷看爸爸的表情|Watch your father\'s face', R('你看见爸爸眼里有泪。|You saw tears in your father\'s eyes.', { eq: 4, par: 4 }))
    ]),
    OE('or_sp_model', 'space', [9, 16], '火箭模型大赛|The Model Rocket Contest', '🛰️', '学校举办火箭模型比赛，全班都盯着你。|The school holds a model rocket contest, and the whole class is watching you.', [
      O('自己从头做|Build it all yourself', RC(.55, '你的火箭飞得最高，奖状被爸爸贴在了办公室。|Your rocket flew highest; Dad pinned the certificate up at his office.', { smarts: 4, happy: 5 }, '火箭飞到一半就散架了，你笑得比谁都大声。|It fell apart halfway up, and you laughed loudest of all.', { smarts: 2, happy: 2 })),
      O('请爸爸帮忙|Ask Dad to help', R('评委看出来了，给了个“最佳亲子合作奖”。|The judges noticed and gave you "Best Parent-Child Teamwork."', { happy: 3 }))
    ]),
    OE('or_sp_select', 'space', [24, 34], '航天员选拔|Astronaut Selection', '👨‍🚀', '航天员选拔开始了，体能、心理、学历，一项都不能差。|Astronaut selection has opened: fitness, psychology, education — nothing can be lacking.', [
      O('报名|Apply', function (c) { var p = c.p, ok = p.st.health >= 70 && p.st.smarts >= 70 && p.edu.deg >= 4; if (ok && G.ch(.5)) { p.flags.astronaut = 1; H.fx(c, { fame: 15, happy: 10 }); G.major('入选航天员队伍|Selected as an astronaut'); return '你入选了！穿上航天服的那天，爸爸拍了一百张照片。|You were selected! The day you put on the suit, Dad took a hundred photos.'; } H.fx(c, { happy: -3, eq: 2 }); return '你在最后一轮被刷下来了。爸爸说：“能走到这里，已经很了不起。”|You were cut in the final round. Dad said: "Getting this far is already remarkable."'; }),
      O('把梦想留给下一代|Leave the dream to the next generation', R('你在孩子的床头挂了一张星空图。|You hung a star chart above your child\'s bed.', { eq: 2 }))
    ])
  ]);

  /* ================= hobbies that fit the person's country ================= */
  var SWAP = { '打麻将|Mahjong': '打桥牌|Bridge', '下象棋|Chinese chess': '下国际象棋|Chess', '广场舞|Square dancing': '社区舞会|Community dances', '打太极|Tai chi': '瑜伽|Yoga', '听戏|Listening to opera': '听歌剧|Opera', '泡茶|Brewing tea': '烘焙|Baking', '打牌|Card games': '玩填字游戏|Crosswords',
    '吃火锅只吃清汤|Only eats the mild hotpot broth': '牛排只吃全熟|Will only eat steak well done' };
  var SWAP_JP = { '下象棋|Chinese chess': '下将棋|Shogi', '广场舞|Square dancing': '卡拉OK|Karaoke', '听戏|Listening to opera': '看歌舞伎|Kabuki', '吃火锅只吃清汤|Only eats the mild hotpot broth': '拉面一定要加溏心蛋|Ramen must come with a soft-boiled egg' };
  var SWAP_KR = { '打麻将|Mahjong': '打花图|Hwatu cards', '下象棋|Chinese chess': '下围棋|Go', '广场舞|Square dancing': '卡拉OK|Karaoke', '听戏|Listening to opera': '听盘索里|Pansori', '吃火锅只吃清汤|Only eats the mild hotpot broth': '每顿饭都要配泡菜|Needs kimchi with every meal' };
  var pers11 = G.persona;
  G.persona = function (n) {
    var x = pers11.apply(this, arguments), c = n.cul || n.c || 'cn';
    if (c === 'cn' || c === 'sg' || !x) return x;
    var map = c === 'jp' ? Object.assign({}, SWAP, SWAP_JP) : c === 'kr' ? Object.assign({}, SWAP, SWAP_KR) : SWAP;
    if (c === 'jp' && map['打麻将|Mahjong']) delete map['打麻将|Mahjong'];
    x.hob = (x.hob || []).map(function (h) { return map[h] || h; });
    if (x.quirk && map[x.quirk]) x.quirk = map[x.quirk];
    return x;
  };

  /* ================= ordinary people have ordinary savings ================= */
  var tick11 = N.tick;
  N.tick = function () {
    var r = tick11.apply(this, arguments), s = S();
    if (!s || !s.npcs) return r;
    N.all(function (n) { return n.alive; }).forEach(function (n) {
      n.peakInc = Math.max(n.peakInc || 0, n.inc || 0);
      var rich = n.richW || n.famW || n.wasYou || n.founder || n.crowned || n.king || n.queen || (n.tags && n.tags.some(function (t) { return t === 'rich' || t === 'celeb' || t === 'royal'; }));
      if (rich || n.rel === 'child' || n.rel === 'spouse') return;
      var age = N.age(n);
      // living costs and medical bills in old age
      if (age >= 70 && n.wealth > 0) n.wealth = Math.round(n.wealth * G.rf(.93, .97));
      var cap = Math.max(n.peakInc, G.$w(15000, n.c || 'us')) * 10;
      if (n.wealth > cap) n.wealth = Math.round(cap * G.rf(.85, 1));
    });
    return r;
  };

  /* ================= small fixes ================= */
})();
