/* Version 1.9: fixes and reworks from player feedback.
   - Born-again heirs keep the country (and crown) they were born to; continuing as a child keeps both parents.
   - The trust adviser draws a salary and can't be romanced; the trust can deposit automatically for 50 years.
   - Cut ties with anyone, family included; the powerful find people warm to them.
   - Universities abroad: your child's grades get them so far — higher tiers take a donation.
   - Monarchs rule from the Life tab, live in their country's palace, and have more to do; no delivery jobs for kings.
   - Honorary posts can be worked at, waive their dues, climb, and pay a stipend capped at $20M a year.
   - Ordinary parents leave modest estates — and sometimes debts. Adults no longer ask their parents for pocket money.
   - Ordinary-life storylines (wrong numbers, stolen parcels, subway seats, fortune cookies…) skip the elite.
   - Great works pay more, curing cancer lengthens lives, and a family of great builders is famous.
   - Tax audits, assassination and kidnapping attempts that can succeed, persuading a child to leave a partner,
     a DNA test that adds relatives, fairer salaries, cooking back in Life's Little Things. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function cat(id) { return G.ACT_CATS.filter(function (c) { return c.id === id; })[0]; }
  function item(id) { var f = null; G.ACT_CATS.forEach(function (c) { c.items.forEach(function (a) { if (a.id === id && !f) f = a; }); }); return f; }
  function q(id, nid, prm) { var s = S(); (s.pendQ = s.pendQ || []).push({ id: id, nid: nid, prm: prm }); }
  function elite() { var p = P(); return (G.status && G.status() >= 2) || !!p.flags.monarch; }
  G.elite19 = elite;

  /* ===================== 1. heirs keep their birthright ===================== */
  var reb19 = G.life.rebirthAs;
  G.life.rebirthAs = function (kid) {
    var s0 = S(), old = s0.p, c0 = kid.c, bc = kid.bornC || null;
    // the country you were born in, not the one you moved to as an adult
    if (!bc) { var h = old.flags.hometown; bc = old.country; if (h && h.c && (old.imm || []).length > 1 && kid.by < s0.year - 20) bc = h.c; }
    if (old.flags.monarch && G.C[old.country] && G.C[old.country].mon) bc = old.country;
    if (bc && G.C[bc]) kid.c = bc;
    var cits0 = kid.cits;
    var s;
    try { s = reb19.apply(this, arguments); } finally { kid.c = c0; }
    var p = s.p;
    if (bc && G.C[bc] && p.country !== bc && G.moveTo) G.moveTo(bc);
    p.cits = [p.country]; if (kid.mixed) p.flags.mixed = kid.mixed;
    if (p.origin === 'royal' && G.C[p.country] && !G.C[p.country].mon) { p.origin = 'noble'; }
    return s;
  };
  var ca19 = G.life.continueAs;
  G.life.continueAs = function (kid) {
    var s0 = S(), other = (kid.par2 && s0.npcs[kid.par2]) || (kid.other && s0.npcs[kid.other]) || null;
    var r = ca19.apply(this, arguments), s = S();
    if (other) {
      var want = other.g === 'm' ? 'father' : 'mother';
      if (!N.rel(want).length) { if (!s.npcs[other.id]) s.npcs[other.id] = other; other.rel = want; other.pin = 1; other.love = 0; other.trying = 0; other.preg = null; if (other.aff < 40) other.aff = 40; }
    }
    return r;
  };
  // every child remembers where they were born
  function stampBirth() { var p = P(); N.all(function (k) { return (k.rel === 'child' || k.rel === 'grandchild') && !k.bornC; }).forEach(function (k) { k.bornC = N.age(k) <= 1 ? p.country : (k.c || p.country); }); }

  /* ===================== 2. the trust adviser, and automatic deposits ===================== */
  var tr0 = G.EV.trust_review;
  if (tr0) {
    var tp0 = tr0.prep;
    tr0.prep = function (c) { var tr = S().assets.trust; if (tr && tr.auto && S().year <= tr.auto.until) return false; return tp0 ? tp0.apply(this, arguments) : true; };
    tr0.o.splice(1, 0,
      { t: '以后50年自动存：保留10%现金|Automatic for 50 years: keep 10% in cash', run: function (c) { var tr = S().assets.trust; tr.auto = { keep: .1, until: S().year + 50 }; return autoPut(true); } },
      { t: '以后50年自动存：保留20%现金|Automatic for 50 years: keep 20% in cash', run: function (c) { var tr = S().assets.trust; tr.auto = { keep: .2, until: S().year + 50 }; return autoPut(true); } });
  }
  function autoPut(say) {
    var tr = S().assets.trust, p = P(); if (!tr || !tr.auto) return '';
    var m = Math.round(Math.max(0, p.money) * (1 - tr.auto.keep)); if (m <= 0) return say ? G.L('已设置自动存入。|Automatic deposits are set.') : '';
    G.addMoney(-m); tr.amt += m;
    var t = G.L('自动存入信托{m}，保留{k}%现金。信托现在有{t}。|Automatically paid {m} into the trust, keeping {k}% in cash. It now holds {t}.', { m: G.M(m), k: Math.round(tr.auto.keep * 100), t: G.M(tr.amt) });
    if (!say) G.log(t);
    return t;
  }
  function trustYear() {
    var s = S(), tr = s.assets.trust; if (!tr) return;
    var n = tr.nid && s.npcs[tr.nid];
    if (n) { n.trustee = 1; if (!n.inc) n.inc = G.$w(G.ri(180000, 420000)); if (!n.wealth || n.wealth < G.$(300000)) n.wealth = G.$(G.ri(800, 3000) * 1000); }
    if (tr.auto && s.year <= tr.auto.until && tr.autoY !== s.year) { tr.autoY = s.year; autoPut(false); }
  }

  /* ===================== 3. cutting ties; the powerful are liked ===================== */
  var acts19 = G.npcActs;
  G.npcActs = function (n) {
    var out = acts19.apply(this, arguments) || [], p = P();
    if (!n || !n.alive) return out;
    var fam = N.family && N.family[n.rel];
    // romance never with the trust adviser
    if (n.trustee) out = out.filter(function (a) { return ['date', 'confess', 'propose', 'wed', 'flirt', 'kiss', 'hookup', 'seduce', 'affair', 'trybaby'].indexOf(a.id) < 0; });
    // grown-ups don't ask their parents for pocket money
    if (p.age >= 18 && ['father', 'mother', 'grand'].indexOf(n.rel) >= 0) out = out.filter(function (a) { return a.id !== 'askmoney'; });
    if (fam && n.rel !== 'spouse' && !out.some(function (a) { return a.id === 'cutfam'; })) out.push({ id: 'cutfam', n: '断绝关系|Cut Ties', i: '✂️', e: 0, run: async function (n2, a) {
      var i = await G.UI.event({ title: G.L(a.n), text: G.L('从此和{n}再无往来，ta会从你的关系列表里消失。确定吗？|From now on you and {n} are strangers — they disappear from your list. Are you sure?', { n: n.name }), opts: [{ t: G.L('确定断绝|Cut ties') }, { t: G.L('算了|Never mind') }] });
      if (i !== 0) return 'cancel';
      n.cut = S().year; n.aff = -100; n.pin = 0;
      G.dStart(); G.addStat('stress', 6); var dl = G.dEnd();
      return G.result(a.n, '你和{n}断绝了关系。|You cut ties with {n}.', { n: n.name }, dl, '✂️');
    } });
    // a child's partner: you may try to talk your child out of it
    if (n.rel === 'child' && n.spouseId && S().npcs[n.spouseId] && N.age(n) >= 18) out.push({ id: 'splitup', n: '劝ta分手|Talk Them Out of It', i: '💔', e: 10, if: function () { return n.splitY !== S().year; }, run: async function (n2, a) {
      n.splitY = S().year; var sp = S().npcs[n.spouseId], ch = .12 + Math.max(0, n.aff - 50) / 200 - (sp && sp.love > 70 ? .1 : 0);
      G.dStart();
      if (G.ch(ch)) { G.dPush('aff', N.addAff(n, -6)); if (sp) { sp.rel = 'contact'; sp.inlaw = null; sp.pin = 0; } n.spouseId = null; n.married = 0; var dl = G.dEnd(); return G.result(a.n, '{n}沉默了很久，最后点了点头。没过多久，ta们分开了。|{n} was quiet for a long time, then nodded. Not long after, they split up.', { n: n.name }, dl, '💔'); }
      G.dPush('aff', N.addAff(n, -12)); var dl2 = G.dEnd();
      return G.result(a.n, '“这是我的人生！”{n}摔门而去。|"It\'s my life!" {n} slammed the door.', { n: n.name }, dl2, '💔');
    } });
    return out;
  };
  function warmth() {
    var p = P(), s = S(), lvl = p.flags.monarch ? 3 : G.status ? G.status() : 0;
    if (G.netWorth() > G.$(1e8)) lvl = Math.max(lvl, 2);
    if (lvl < 2) return;
    N.all(function (n) { return n.alive && !n.cut && ['classmate', 'colleague', 'friend', 'contact', 'kin', 'boss', 'mentor'].indexOf(n.rel) >= 0; }).forEach(function (n) {
      if (G.ch(lvl >= 3 ? .7 : .5)) n.aff = Math.min(100, Math.max(n.aff, (n.aff || 0) + G.ri(4, 12), lvl >= 3 ? 70 : 60));
    });
    // a son- or daughter-in-law is always keen on you
    N.all(function (n) { return n.alive && n.inlaw && s.npcs[n.inlaw] && s.npcs[n.inlaw].rel === 'child'; }).forEach(function (n) { n.aff = Math.min(100, Math.max(n.aff || 0, 72) + G.ri(0, 4)); });
  }

  /* ===================== 4. universities abroad cost what they cost ===================== */
  async function pickAbroadUni(k, to, base) {
    var sys = G.eduSys(to), merit = G.clamp(Math.round(1.5 + (k.smarts || 50) / 25 + (k.sch === 'intl' || k.sch === 'abroad' ? .8 : 0) + ((k.edu && k.edu.perf) || 50) / 120 - .4), 2, 5);
    var DON = { 0: 0, 1: 800000, 2: 3000000, 3: 8000000 };
    var tiers = [5, 4, 3, 2].filter(function (t) { return sys.u.some(function (x) { return x.t === t; }); });
    var items = tiers.map(function (t) {
      var gap = Math.max(0, t - merit), cost = G.$(base) + G.$(DON[Math.min(3, gap)]);
      var u = sys.u.filter(function (x) { return x.t === t; })[0];
      return { t: G.L('{u}（{s}星）|{u} ({s}★)', { u: u.n, s: t }), icon: gap ? '🏛️' : '🎓', sub: gap ? G.L('成绩不够，需捐资{d} · 合计{m}|Grades fall short — a {d} donation · {m} in total', { d: G.M(G.$(DON[Math.min(3, gap)])), m: G.M(cost) }) : G.L('凭成绩可以申请 · 学费生活费{m}|Within reach on grades · tuition and living {m}', { m: G.M(cost) }), dis: !G.canPay(cost) && !(G.payKid && kidCanPay(k, cost)), u: u, cost: cost };
    });
    var i = await G.UI.pick({ title: G.L('{n}想申请哪所学校？|Which university for {n}?', { n: k.name }), text: G.L('以{n}的成绩，最高能申请到{t}星大学。更好的学校需要捐资。|On {n}\'s grades, a {t}★ university is within reach. Anything better takes a donation.', { n: k.name, t: merit }), items: items });
    if (i < 0) return null;
    return items[i];
  }
  function kidCanPay(k, m) { var p = P(); return Math.max(0, p.money) >= m; }
  var pu = G.EV.k_pick_uni;
  if (pu && pu.o && pu.o[1]) {
    pu.o[1].run = async function (c) {
      var k = c.npc, e = k.edu, cs = (G.ABROAD || ['us', 'gb', 'au', 'ca', 'jp', 'sg', 'de', 'fr']).filter(function (x) { return x !== c.p.country && G.C[x]; });
      var ci = await G.UI.pick({ title: G.L('去哪个国家？|Which country?'), items: cs.map(function (x) { return { t: G.C[x].n, icon: G.C[x].flag, sub: G.abroadWarn ? G.abroadWarn(k, x) : null }; }), noCancel: 1 });
      var to = cs[ci < 0 ? 0 : ci];
      var pick = await pickAbroadUni(k, to, 140000);
      if (!pick) return '你们决定再想想。|You decided to think it over.';
      if (!G.payKid(k, pick.cost)) return '钱不够。|Not enough money.';
      e.stage = 'uni'; e.grade = 0; e.school = pick.u.n; e.tier = pick.u.t; e.abroad = to; e.major = e.major || G.pick(G.MAJOR_LIST);
      if (G.ch(.35)) k.stayAbroad = to;
      G.dPush('aff', N.addAff(k, 8)); c.prm.u = pick.u.n; c.prm.c = G.C[to].n;
      return '{n}被{c}的{u}录取了！|{n} was admitted to {u} in {c}!';
    };
  }
  // the same rule for "send abroad" from a child's page
  var acts19b = G.npcActs;
  G.npcActs = function (n) {
    var out = acts19b.apply(this, arguments) || [];
    out.forEach(function (a) {
      if (a.id !== 'abroad' || a.v19) return; a.v19 = 1;
      a.run = async function (k, act) {
        var p = P(), a0 = N.age(k), base = k.edu && k.edu.stage === 'uni' ? 150000 : 220000;
        var dest = G.CLIST.filter(function (c) { return ['us', 'gb', 'au', 'ca', 'jp', 'sg', 'de', 'fr', 'ch', 'nz', 'ie'].indexOf(c) >= 0 && c !== p.country; });
        var i = await G.UI.pick({ title: G.L(act.n), items: dest.map(function (c) { return { t: G.C[c].n, icon: G.C[c].flag, sub: G.abroadWarn ? G.abroadWarn(k, c) : null }; }) });
        if (i < 0) return 'cancel';
        var c = dest[i], pick = await pickAbroadUni(k, c, base); if (!pick) return 'cancel';
        if (!G.pay(pick.cost)) { G.UI.toast(G.L('钱不够|Not enough money')); return 'cancel'; }
        var e = k.edu; e.abroad = c; e.abroadSchool = pick.u.n; e.abroadTier = pick.u.t;
        if (a0 >= 18) { e.stage = 'uni'; e.grade = 0; e.school = pick.u.n; e.tier = pick.u.t; e.major = e.major || G.pick(G.MAJOR_LIST); } else k.abroadPlan = 1;
        G.dStart(); G.dPush('aff', N.addAff(k, 15)); var dl = G.dEnd();
        G.major('送{n}出国留学|Sent {n} to study abroad', { n: k.name });
        return G.result(act.n, a0 >= 18 ? '{n}被{u}录取了！|{n} was admitted to {u}!' : '你为{n}申请了{u}，高中毕业后就出发。|You applied to {u} for {n}; they\'ll leave after high school.', { n: k.name, u: pick.u.n }, dl, '✈️');
      };
    });
    return out;
  };

  /* ===================== 5. the monarch ===================== */
  var PALACE = { gb: '白金汉宫|Buckingham Palace', jp: '皇居|the Imperial Palace', es: '马德里王宫|the Royal Palace of Madrid', th: '大皇宫|the Grand Palace', cn: '中南海|Zhongnanhai', kr: '青瓦台|the Blue House', us: '白宫|the White House', fr: '爱丽舍宫|the Élysée Palace', ru: '克里姆林宫|the Kremlin', de: '贝尔维尤宫|Bellevue Palace', in: '总统府|Rashtrapati Bhavan', it: '奎里纳莱宫|the Quirinal Palace', br: '黎明宫|the Alvorada Palace', mx: '国家宫|the National Palace', ca: '丽都厅|Rideau Hall', au: '政府大楼|Government House', sg: '总统府|the Istana', ie: '总统府|Áras an Uachtaráin', pt: '贝伦宫|Belém Palace', at: '霍夫堡宫|the Hofburg', ch: '联邦大厦|the Federal Palace', ar: '玫瑰宫|the Casa Rosada', za: '联合大厦|the Union Buildings', nz: '政府大楼|Government House' };
  G.palaceOf = function (c) { return PALACE[c] || G.L('{c}王宫|the Royal Palace of {c}', { c: G.C[c] ? G.C[c].n : '' }); };
  G.isRuler = function () { var p = P(); return !!(p && (p.flags.monarch || (p.gov && G.gov && G.gov.isTop && G.gov.isTop()))); };
  var rc = cat('reign');
  if (rc) {
    rc.hideAct = 1; // the crown lives on the Life tab now
    rc.items.splice(rc.items.length - 1, 0,
      { id: 'rg_welfare', n: '推动民生工程|Champion a Public Welfare Programme', i: '🏥', e: 20, run: async function (a) {
        var p = P(), opts = [1e6, 1e7, 5e7, 2e8].map(function (u) { return G.$(u); });
        var i = await G.UI.pick({ title: G.L(a.n), text: G.L('以王室的名义出资，带动政府和企业一起投入。名声的回报远高于普通捐款。|Fund it in the crown\'s name and draw in government and business. The renown far outweighs an ordinary donation.'), items: opts.map(function (m, k) { return { t: G.M(m), icon: ['🏫', '🏥', '🚰', '🏘️'][k], sub: G.L(['乡村学校|Village schools', '儿童医院|A children\'s hospital', '净水工程|Clean water', '保障住房|Affordable housing'][k]), dis: p.money < m }; }) });
        if (i < 0 || !G.pay(opts[i])) return 'cancel';
        var f = [6, 10, 15, 22][i];
        return G.quick(a, G.pick(['剪彩那天，孩子们举着你的画像站在路边。|On opening day, children lined the road holding up your portrait.', '一位老人握着你的手说：“这辈子，第一次喝上干净的水。”|An old man held your hand: "The first clean water of my life."', '报纸头版写着：“这才是王室该做的事。”|The front page read: "This is what a crown is for."']), { fame: f, karma: Math.round(f / 2), happy: 6 });
      } },
      { id: 'rg_honours', n: '授勋仪式|Investiture', i: '🎖️', e: 10, run: function (a) { var n = N.make({ rel: 'contact', age: G.ri(30, 80), aff: G.ri(60, 85), c: P().country }); n.pin = 1; n.job = G.L('勋章获得者|Honours Recipient'); return G.quick(a, '你为{n}佩戴上了勋章。台下掌声雷动。|You pinned the medal on {n}. The hall thundered with applause.', { fame: 2, eq: 1, happy: 3 }, { n: n.name }); } },
      { id: 'rg_speech', n: '新年致辞|New Year Address', i: '📺', e: 10, if: function () { return P().flags.speechY !== S().year; }, run: function (a) { P().flags.speechY = S().year; return G.quick(a, G.pick(['全国一半的人守在电视机前听你讲话。|Half the nation sat in front of the television to hear you.', '你讲到去年的洪灾，停顿了很久。那段沉默被剪进了新闻。|Speaking of last year\'s floods, you paused for a long time. The silence made the news.']), { fame: 3, eq: 2 }); } },
      { id: 'rg_tour', n: '王室巡游|Royal Tour of the Provinces', i: '🐎', e: 20, run: function (a) { return G.quick(a, '马车经过时，一个小女孩挣脱妈妈的手，把一束野花递给了你。|As the carriage passed, a little girl broke free of her mother to hand you wildflowers.', { fame: 4, happy: 6, health: -1 }); } },
      { id: 'rg_banquet', n: '国宴|State Banquet', i: '🍽️', e: 15, run: function (a) { var c = G.pick(G.CLIST.filter(function (x) { return x !== P().country; })); return G.quick(a, '你在{p}设国宴款待{c}元首，宴会厅里摆着三百年的银器。|You hosted the head of state of {c} at {p}; the hall glittered with three-hundred-year-old silver.', { fame: 3, eq: 2 }, { c: G.C[c].n, p: G.palaceOf(P().country) }); } },
      { id: 'rg_arts', n: '资助国家艺术|Patron of the Arts', i: '🎭', e: 10, $: 500000, run: function (a) { if (!G.pay(G.$(500000))) return 'cancel'; return G.quick(a, '国家歌剧院新的一季，节目单第一页印着你的名字。|The national opera\'s new season bore your name on the first page.', { fame: 3, happy: 4, smarts: 1 }); } },
      { id: 'rg_guard', n: '检阅仪仗队|Inspect the Guard', i: '💂', e: 8, run: function (a) { return G.quick(a, '军乐响起，你沿着仪仗队缓缓走过。|The band struck up as you walked slowly down the line.', { fame: 1, happy: 3 }); } }
    );
  }
  var la19 = G.lifeActs;
  G.lifeActs = function () {
    var out = la19.apply(this, arguments), p = P();
    if (p.flags.monarch && !p.jail && rc) {
      var reign = rc.items.filter(function (a) { return !a.if || a.if(); });
      out = reign.concat(out.filter(function (a) { return (G.ACT_IDLE || []).indexOf(a) < 0; }));
    }
    return out;
  };
  // rulers don't take ordinary jobs or side hustles
  var LOWJOB = /^(courier|rider|waiter|guard|cleaner|cashier|vendor|factory|driver|builder|farmer|hair|groomer|pt_.*)$/;
  var jok19 = G.jobOk;
  if (jok19) G.jobOk = function (j) { var p = P(); if (p && (p.flags.monarch || (G.status && G.status() >= 3)) && LOWJOB.test(j.id)) return false; return jok19.apply(this, arguments); };
  var hu = cat('hustle');
  if (hu) hu.items.forEach(function (a) { if (['stall', 'eshop', 'stream', 'talent', 'audition', 'casting', 'esports', 'sports', 'jobsearch'].indexOf(a.id) < 0) return; var f = a.if; a.if = function () { if (P().flags.monarch) return false; return !f || f.apply(this, arguments); }; });

  /* ===================== 6. honorary posts you can work at ===================== */
  var HRANK = ['理事|Trustee', '副会长|Vice-President', '会长|President', '名誉主席|Honorary Chair'];
  var hc = cat('honor');
  if (hc) {
    hc.items.splice(1, 0, { id: 'honor_work', n: '履行名誉职务|Carry Out Your Honorary Duties', i: '📋', e: 12, if: function () { return !!P().honor; }, run: function (a) {
      var hn = P().honor, g = G.ri(8, 15) + Math.round(P().st.eq / 20); hn.perf = Math.min(100, (hn.perf || 40) + g); hn.workY = S().year;
      return G.quick(a, G.pick(['你主持了年度理事会，把三年没谈拢的事谈成了。|You chaired the annual board and closed a deal stuck for three years.', '你亲自去了一趟受助的山区学校。|You went in person to one of the mountain schools the fund supports.', '你说服两位老朋友各捐了一大笔。|You talked two old friends into large gifts.']), { fame: 2, karma: 2, eq: 1 });
    } });
  }
  function honorYear() {
    var p = P(), hn = p.honor; if (!hn) return;
    hn.rank = hn.rank || 0; hn.perf = hn.perf == null ? 40 : hn.perf;
    if (hn.workY !== S().year) hn.perf = Math.max(0, hn.perf - 10);
    if (hn.perf >= 70) { hn.waive = S().year + 1; }
    if (hn.perf >= 80 && hn.rank < HRANK.length - 1 && G.ch(.45)) { hn.rank++; hn.perf -= 25; G.major('晋升为{x}|Promoted to {x}', { x: HRANK[hn.rank] }); G.addStat('fame', 4); }
    if (hn.rank >= 2) { var st = Math.min(G.$(2e7), G.$(G.ri(3, 6) * 1e5 * Math.pow(3, hn.rank - 1))); if (G.fin) G.fin.tag = G.L('名誉职位津贴|Honorary stipend'); G.addMoney(st); if (G.fin) G.fin.tag = null; }
  }
  // honorary dues are waived the year after good work
  G.honorRank = function () { var hn = P().honor; return hn ? HRANK[hn.rank || 0] : null; };
  var t19 = G.title;
  G.title = function () { var t = t19.apply(this, arguments), p = P(); if (p && p.honor && t === p.honor.n && p.honor.rank) return G.join([p.honor.n, HRANK[p.honor.rank]], ' · ', ' · '); return t; };

  /* ===================== 7. what ordinary parents leave ===================== */
  var inh19 = G.family.inherit;
  G.family.inherit = function (dead) {
    var p = P(), o = G.ORIGIN[p.origin] || {}, ordinary = !(o.w && o.w[1] >= 3e6) && !p.flags.rich && !p.flags.elite && (!G.famClass || G.famClass() <= 1);
    if (dead && (dead.rel === 'father' || dead.rel === 'mother') && !dead.wasYou && ordinary) {
      var other = N.rel('father', 'mother').filter(function (n) { return n !== dead && n.alive; })[0];
      if (!other) {
        if (G.ch(p.tier <= 2 ? .2 : .1)) { var debt = G.$(G.ri(8, 90) * 1000); dead.wealth = 0; q('v19_par_debt', dead.id, { m: G.M(debt), d: debt }); }
        else dead.wealth = Math.min(Math.max(0, dead.wealth || 0), G.$(G.ri(40, 300) * 1000));
      }
    }
    return inh19.apply(this, arguments);
  };

  /* ===================== 8. storylines that don't fit the elite ===================== */
  var COMMON = /^(dl_|t_lost_wallet|c_wallet|a_neighbor|o_dance|a_campusloan|a_scamcall|a_blind_corner|x_bikeshare|x_fortune2|x_old_ticket|a_bad_landlord|o_scamcall|rt_dance|rt_matchcorner)/;
  var KEEP = /^(dl_stray_dog)$/;
  var el19 = G.eligible;
  G.eligible = function (d) {
    if (d && d.id && COMMON.test(d.id) && !KEEP.test(d.id) && S() && S().p && elite()) return false;
    return el19.apply(this, arguments);
  };
  var pill = G.EV.sys_parent_ill;
  if (pill) { var pp0 = pill.prep; pill.prep = function (c) { if (elite()) { if (c.npc) { c.npc.health = Math.min(100, (c.npc.health || 50) + 10); G.log('家里的医疗团队照顾着{n}，你每天都能收到一份健康简报。|The family\'s medical team looks after {n}; you get a health briefing every day.', { n: c.npc.name }); } return false; } return pp0 ? pp0.apply(this, arguments) : true; }; }

  /* ===================== 9. great works ===================== */
  (G.MEGA || []).forEach(function (m) { if (!m.v19) { m.v19 = 1; m.ret = Math.round(m.ret * 1.6 * 1000) / 1000; } });
  function megaYear() {
    var p = P(), n = G.megaDone ? G.megaDone() : 0, L = S().legacy || {};
    if (n > 0) p.st.fame = Math.max(p.st.fame, Math.min(100, 45 + n * 6));
    p.flags.lifeBonus = (L.mega && L.mega.cure ? 5 : 0) + (L.mega && L.mega.ocean ? 1 : 0) + (L.mega && L.mega.fusion ? 1 : 0);
  }

  /* ===================== 10. fairer pay ===================== */
  var FIX = { rnd: [160000, 250000, 400000, 680000], econ: [95000, 160000, 260000, 420000], astronomer: [65000, 100000, 150000, 210000], vet: [55000, 80000, 120000, 170000], archaeo: [45000, 65000, 95000, 140000], sci: [70000, 110000, 170000, 280000] };
  G.JOBS.forEach(function (j) {
    if (FIX[j.id] && j.pay.length === FIX[j.id].length) j.pay = FIX[j.id].slice();
    else if (FIX[j.id]) j.pay = j.pay.map(function (v, i) { return FIX[j.id][Math.min(i, FIX[j.id].length - 1)]; });
    if (!j.pt && !FIX[j.id]) j.pay = j.pay.map(function (v) { return v > 150000 ? Math.round(v * .88) : v; });
  });
  (G.COLLECT || []).forEach(function (c) { if (!c.v19) { c.v19 = 1; c.drift = c.drift * .5; c.vol = c.vol * .75; } });

  /* ===================== 11. Life's Little Things: cooking is back ===================== */
  var lc = cat('life');
  if (lc && !lc.items.some(function (a) { return a.id === 'homecook'; })) lc.items.splice(1, 0, { id: 'homecook', n: '下厨做一桌菜|Cook a Proper Meal', i: '🍳', e: 8, a: [10, 115], run: function (a) {
    var t = G.hobby ? G.hobby('chefpro') : '';
    var fam = N.rel('spouse', 'child', 'father', 'mother').filter(function (n) { return n.alive && !n.cut; }); fam.forEach(function (n) { N.addAff(n, 2); });
    var r = G.quick(a, G.pick(['你做了一桌菜，大家吃得盘子都不剩。|You cooked a feast and not a plate came back with anything on it.', '你第一次成功做出了一道硬菜。|You pulled off a showstopper dish for the first time.', '你复刻了小时候吃过的味道。|You recreated a taste from your childhood.']), { happy: 5, eq: 1, sk: { cook: 3 } });
    if (t) G.log(String(t).replace(/^\n/, ''));
    return r;
  } });
  var dna = { id: 'dna_test', n: '做一次DNA检测|Take a DNA Test', i: '🧬', e: 5, $: 200, a: [16, 110], if: function () { return !P().flags.dna; }, run: function (a) {
    if (!G.pay(G.$(200))) return 'cancel'; var p = P(); p.flags.dna = S().year;
    var found = [];
    if (G.ch(.12)) { var n = N.make({ rel: 'sibling', age: p.age + G.ri(-12, 12), aff: G.ri(20, 45), sur: p.sur }); n.illegit = 1; n.half = G.ch(.75) ? 'father' : 'mother'; n.older = N.age(n) > p.age; n.pin = 1; n.dna = 1; found.push(n.name); }
    if (G.ch(.4)) { var k2 = N.make({ rel: 'kin', age: p.age + G.ri(-15, 15), aff: G.ri(25, 50), c: G.pick(G.CLIST) }); k2.kin = 'cousin'; k2.pin = 1; k2.dna = 1; found.push(k2.name); }
    var anc = G.pick(['北方游牧民族|northern nomads', '江南水乡|the southern water towns', '地中海沿岸|the Mediterranean coast', '东欧平原|the East European plain', '西非海岸|the West African coast', '安第斯山区|the Andes', '日本列岛|the Japanese islands']);
    return G.quick(a, found.length ? G.L('报告显示你有{a}的血统。更意外的是：你多了{k}个从没见过的亲人——{n}。他们出现在了你的关系列表里。|Your report shows roots in {a}. More surprising: {k} relatives you never knew — {n}. They\'re now in your relationships list.', { a: anc, k: found.length, n: found.join('、') }) : G.L('报告显示你有{a}的血统。没有发现失散的亲人。|Your report shows roots in {a}. No long-lost relatives turned up.', { a: anc }), { smarts: 1, happy: 3 });
  } };
  if (lc) lc.items.push(dna);
  if (lc) lc.items.push({ id: 'wreath', n: '编一顶花环戴上|Weave a Flower Wreath', i: '🌼', e: 5, a: [4, 45], if: function () { return P().g === 'f' && !P().flags.wreath; }, run: function (a) { P().flags.wreath = 1; return G.quick(a, '你在草地上编了一顶小雏菊花环，戴上以后，路过的人都忍不住多看了你一眼。|You wove a daisy wreath in the meadow; once you put it on, passers-by couldn\'t help looking twice.', { happy: 6, looks: 2 }); } });

  /* ===================== 12. new storylines ===================== */
  function rich(S2, p) { return G.netWorth() > G.$(5e6) || !!S2.assets.company || (S2.assets.shops || []).length > 0; }
  G.evs([
    { id: 'v19_par_debt', sys: 1, title: '父母留下的债|The Debt Your Parent Left', icon: '📄', bad: 1,
      t: '整理{n}的遗物时，你翻出了一沓欠条，一共{m}。债主已经找上门来了。|Going through {n}\'s things, you find a stack of IOUs — {m} in all. The creditors are already at the door.',
      prep: function (c) { if (c.npc) c.prm.n = c.npc.name; },
      o: [{ t: '父债子还，全部还清|Pay it all — a child pays a parent\'s debts', run: function (c) { var d = c.prm.d || 0; if (G.canPay(d)) { G.addMoney(-d); c.add('karma', 5); return '你还清了每一笔。最后一个债主走的时候，说你爸妈教了个好孩子。|You paid every one. The last creditor said your parents raised you well.'; } c.p.money -= d; c.add('stress', 15); return '你借钱还上了，背上了一身债。|You borrowed to pay it and are now deep in debt.'; } },
        { t: '放弃继承|Renounce the inheritance', run: function (c) { c.add('stress', 5); return '律师说，放弃继承就不用替父母还债。你签了字，心里很不是滋味。|The lawyer said renouncing the estate meant the debts weren\'t yours. You signed, feeling awful.'; } }] }
  ]);
  G.evs([
    E('v19_tax_audit', [25, 95], '税务稽查|A Tax Audit', '🧾', '税务局的稽查组敲开了你公司的门：“有人举报你们的账有问题。我们要查近五年的账。”|Tax inspectors arrive at your office: "We\'ve had a report about your books. We\'ll be examining the last five years."', [
      O('全力配合，补税认罚|Cooperate fully; pay what\'s due', function (c) { var m = Math.round(Math.max(G.$(20000), G.netWorth() * G.rf(.005, .02))); c.money(-m); c.add('stress', 8); c.add('karma', 2); return G.L('查了三个月，补缴税款和罚款共{m}。事情就此了结。|Three months of digging; back taxes and fines came to {m}. That was the end of it.', { m: G.M(m) }); }),
      O('请顶级税务律师|Hire a top tax lawyer', function (c) { var fee = G.$(G.ri(50, 200) * 1000); c.money(-fee); if (G.ch(.65)) { c.add('stress', 4); return G.L('律师找出了稽查组的三处错误。案子撤了，律师费{m}。|The lawyer found three errors in the audit. Case dropped; the fees were {m}.', { m: G.M(fee) }); } var m = Math.round(G.netWorth() * .03); c.money(-m); c.add('stress', 12); return G.L('律师也没办法，罚款{m}。|Even the lawyer couldn\'t help: a {m} fine.', { m: G.M(m) }); }),
      O('托人“打个招呼”|Have someone "put in a word"', function (c) { if (G.ch(.4)) { c.add('karma', -6); return '稽查组走了，再也没回来。|The inspectors left and never came back.'; } c.p.crime.rec = (c.p.crime.rec || 0) + 1; c.add('stress', 25); c.add('fame', -6); var m = Math.round(G.netWorth() * .08); c.money(-m); return G.L('你托的人自己先被查了。行贿加偷税，罚了{m}，还上了新闻。|The go-between was investigated first. Bribery plus evasion: a {m} fine and the evening news.', { m: G.M(m) }); })
    ], { if: rich, w: .5, bad: 1 }),
    E('v19_assassin', [20, 100], '刺杀|An Assassin', '🎯', '车队驶过广场时，一声枪响撕开了人群。|As your motorcade crosses the square, a gunshot tears through the crowd.', [
      O('（一切发生在一瞬间）|(It all happens in an instant)', function (c) {
        var guard = c.p.flags.monarch || (G.status && G.status() >= 3) ? .94 : .86;
        if (G.ch(guard)) { c.add('stress', 18); c.add('fame', 5); return '保镖把你按倒在车里。子弹打穿了车窗，离你的头只有一掌宽。|Your bodyguard threw you to the floor. The bullet came through the window a hand\'s width from your head.'; }
        if (G.ch(.55)) { c.add('health', -40); c.add('fame', 8); return '子弹打中了你的胸口。你在ICU里躺了一个月，奇迹般地活了下来。|The bullet hit your chest. A month in intensive care, and somehow you lived.'; }
        G.die(G.L('遇刺身亡|Assassinated')); return '';
      })
    ], { if: function (S2, p) { return (p.flags.monarch || (G.status && G.status() >= 3) || G.netWorth() > G.$(5e8)) && !p.jail; }, w: .25, bad: 1 }),
    E('v19_kidnap', [16, 90], '绑架|Kidnapped', '🚐', '从晚宴出来，你刚坐进车里，就发现司机不是你的司机。车门锁上了。|Leaving a dinner, you get into your car and realise the driver isn\'t yours. The doors lock.', [
      O('等家人交赎金|Wait for the ransom', function (c) { var m = Math.round(Math.max(G.$(1e6), G.netWorth() * G.rf(.05, .15))); c.money(-m); c.add('health', -8); c.add('stress', 30); c.add('happy', -15); G.major('被绑架，家人付了赎金|Kidnapped — the family paid the ransom'); return G.L('你在一间地下室里被关了二十三天。赎金{m}付清后，你被扔在了城郊的公路边。从那以后，你再也不坐后排了。|Twenty-three days in a basement. Once the {m} ransom was paid, you were dumped by a highway outside the city. You never sat in a back seat again.', { m: G.M(m) }); }),
      O('找机会逃跑|Watch for a chance to escape', function (c) { var ch = .3 + c.p.st.smarts / 300 + (c.p.h.fit || 0) / 300; if (G.ch(ch)) { c.p.flags.kidEscape = 1; c.add('fame', 8); c.add('stress', 20); G.major('从绑匪手里逃了出来|Escaped from kidnappers'); return '第四天夜里，你用一根铁丝撬开了手铐，从窗户爬了出去。你的故事被拍成了电影。|On the fourth night you picked the cuffs with a bit of wire and climbed out a window. Your story became a film.'; } if (G.ch(.25)) { G.die(G.L('被绑架后遇害|Killed by kidnappers')); return ''; } c.add('health', -20); c.add('stress', 35); var m = Math.round(G.netWorth() * .2); c.money(-m); return G.L('你被抓了回来，挨了一顿毒打。最后还是家人交了{m}赎金。|They caught you and beat you badly. In the end your family paid {m}.', { m: G.M(m) }); })
    ], { if: function (S2, p) { return G.netWorth() > G.$(2e7) && !p.jail && !p.flags.kidnapped; }, w: .2, bad: 1, prep: function (c) { c.p.flags.kidnapped = S().year; } })
  ]);

  /* ===================== affection changes remember whose they were (for the bars on result cards) ===================== */
  ['addAff', 'addLove'].forEach(function (fn) { var f0 = N[fn]; if (!f0) return; N[fn] = function (n) { G._lastNpc = n; G._lastK = fn === 'addAff' ? 'aff' : 'love'; return f0.apply(this, arguments); }; });
  var dp0 = G.dPush;
  G.dPush = function (k, n) {
    var who = G._lastNpc;
    if ((k === 'aff' || k === 'love') && who && G.D && G.D.on && n) {
      var L = G.D.list, cur = k === 'aff' ? who.aff : who.love;
      for (var i = 0; i < L.length; i++) if (L[i].k === k && L[i].wid === who.id) { L[i].n += n; L[i].v = cur; return; }
      L.push({ k: k, n: n, who: who.name, wid: who.id, v: cur }); return;
    }
    return dp0.apply(this, arguments);
  };

  /* ===================== yearly ===================== */
  var mt19 = G.money.tick;
  G.money.tick = function () {
    var r = mt19.apply(this, arguments), s = S();
    if (s.dead) return r;
    try { stampBirth(); trustYear(); warmth(); honorYear(); megaYear(); } catch (e) { console.error(e); }
    return r;
  };
  // honorary dues: skipped in a waived year
  var hfee = G.HONOR_FEE;
  Object.defineProperty(G, 'HONOR_FEE', { configurable: true, get: function () { var p = S() && S().p; if (p && p.honor && p.honor.waive === S().year) return 0; return hfee; }, set: function (v) { hfee = v; } });
})();
