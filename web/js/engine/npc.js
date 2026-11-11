/* NPCs: generation, relations, attraction, yearly simulation */
(function () {
  'use strict';
  function J(s, usd) { return { n: s, u: usd }; }
  G.NPC_JOBS = [
    J('公司职员|Office Worker', 45000), J('教师|Teacher', 50000), J('医生|Doctor', 150000), J('护士|Nurse', 60000), J('程序员|Programmer', 100000),
    J('销售|Salesperson', 50000), J('工厂工人|Factory Worker', 32000), J('司机|Driver', 38000), J('厨师|Chef', 35000), J('公务员|Civil Servant', 60000),
    J('律师|Lawyer', 130000), J('设计师|Designer', 60000), J('自由职业|Freelancer', 40000), J('小老板|Small Business Owner', 85000), J('外卖骑手|Delivery Rider', 36000),
    J('保安|Security Guard', 28000), J('警察|Police Officer', 58000), J('会计|Accountant', 55000), J('无业|Unemployed', 0), J('健身教练|Personal Trainer', 42000),
    J('金融分析师|Financial Analyst', 110000), J('记者|Journalist', 52000), J('摄影师|Photographer', 45000), J('理发师|Hairdresser', 32000), J('空乘|Flight Attendant', 50000),
    J('建筑师|Architect', 90000), J('工程师|Engineer', 85000), J('主播|Streamer', 55000), J('咖啡店老板|Café Owner', 60000), J('研究员|Researcher', 80000)
  ];
  G.ELITE_JOBS = {
    rich: [J('企业家|Entrepreneur', 900000), J('富二代|Heir to a Fortune', 350000), J('投资人|Venture Capitalist', 700000), J('地产大亨|Property Tycoon', 1600000), J('上市公司CEO|Public Company CEO', 1200000)],
    celeb: [J('影视明星|Film Star', 2200000), J('当红歌手|Pop Star', 1600000), J('超模|Supermodel', 1000000), J('顶流偶像|Top Idol', 2600000), J('体育明星|Sports Star', 2500000), J('千万粉丝网红|Mega Influencer', 900000)],
    red: [J('权贵子弟|Political Scion', 450000), J('高官之后|Child of a Senior Official', 400000), J('国企高管|State Enterprise Executive', 600000)],
    royal: [J('王室成员|Royal', 3500000), J('公爵|Duke', 2500000), J('伯爵|Count', 1500000)]
  };
  G.N = {};
  var N = G.N;

  N.age = function (n) { return G.S.year - n.by; };
  N.get = function (id) { return G.S.npcs[id]; };
  N.all = function (fn) { var o = G.S.npcs, r = []; for (var k in o) { if (!fn || fn(o[k])) r.push(o[k]); } return r; };
  N.rel = function () { var rs = Array.prototype.slice.call(arguments); return N.all(function (n) { return n.alive && rs.indexOf(n.rel) >= 0; }); };
  N.family = { father: 1, mother: 1, sibling: 1, child: 1, grand: 1, grandchild: 1, stepparent: 1, birthpar: 1, kin: 1 };
  N.partner = function () { var id = G.S.p.partner; return id ? G.S.npcs[id] : null; };
  N.spouse = function () { var n = N.partner(); return n && n.rel === 'spouse' ? n : null; };

  function skinFor(cid) { var w = (G.C[cid] || G.C.cn).skin; return G.wpick([0, 1, 2, 3, 4, 5], function (i) { return w[i]; }); }
  N.skinFor = skinFor;

  N.make = function (o) {
    var S = G.S; o = o || {};
    var cid = o.c || S.p.country, cc = G.C[cid] || G.C.cn;
    var g = o.g || (G.ch(.5) ? 'm' : 'f');
    var by = o.by != null ? o.by : S.year - (o.age != null ? o.age : G.ri(18, 45));
    var age = S.year - by;
    var nm = o.name ? { name: o.name, sur: o.sur || '', giv: o.giv || o.name } : G.genName(o.cul || cc.names, g, by, o.sur);
    var pers = o.pers || G.pick(G.PERS_LIST);
    var r = G.R();
    var n = {
      id: 'n' + (S.nid++), name: nm.name, sur: nm.sur, giv: nm.giv, g: g, by: by, c: cid, rel: o.rel || 'contact',
      looks: o.looks != null ? o.looks : G.clamp(Math.round(G.nrm(52, 16)), 5, 100),
      smarts: o.smarts != null ? o.smarts : G.clamp(Math.round(G.nrm(52, 16)), 5, 100),
      eq: o.eq != null ? o.eq : G.clamp(Math.round(G.nrm(50, 16)), 5, 100),
      health: o.health != null ? o.health : G.clamp(Math.round(G.nrm(age > 60 ? 60 : 82, 12)), 10, 100),
      pers: pers, orient: o.orient || (r < .9 ? 'het' : r < .95 ? 'gay' : 'bi'),
      aff: o.aff != null ? o.aff : 0, love: o.love != null ? o.love : 0,
      loyal: G.clamp(Math.round((o.loyal != null ? o.loyal : G.PERS[pers].lo) + G.nrm(0, 12)), 0, 100),
      sincere: G.clamp(Math.round(o.sincere != null ? o.sincere : G.nrm(62, 20)), 0, 100),
      alive: true, tags: o.tags || [], met: S.year, lt: S.year, chatY: 0, chatN: 0, chat: [], unread: 0,
      av: G.ri(1, 1e9), skin: o.skin != null ? o.skin : skinFor(cid), married: !!o.married
    };
    // job & money
    if (o.job) { n.job = o.job; n.inc = o.inc != null ? o.inc : 0; }
    else if (age < 6) { n.job = '学龄前|Preschooler'; n.inc = 0; }
    else if (age < 18) { n.job = '学生|Student'; n.inc = 0; }
    else if (age < 23 && G.ch(.45)) { n.job = '大学生|University Student'; n.inc = 0; }
    else if (age >= (cc.retire || 60) + 2) { n.job = '退休|Retired'; n.inc = G.$w(G.ri(12000, 30000), cid); }
    else {
      var tag = n.tags[0], pool = tag && G.ELITE_JOBS[tag] ? G.ELITE_JOBS[tag] : G.NPC_JOBS;
      var jb = G.pick(pool);
      if (tag === 'royal') jb = J(g === 'm' ? '王子|Prince' : '公主|Princess', 3500000);
      n.job = jb.n; n.inc = G.$w(jb.u * G.rf(.7, 1.4), cid);
    }
    n.wealth = o.wealth != null ? o.wealth : (age < 18 ? 0 : Math.max(0, Math.round(n.inc * G.rf(.3, 3) * Math.min(1, (age - 17) / 15) + (n.tags.length ? n.inc * G.rf(5, 30) : 0))));
    if (o.extra) for (var k in o.extra) n[k] = o.extra[k];
    S.npcs[n.id] = n;
    return n;
  };

  N.relName = function (n) {
    var m = n.g === 'm', p = G.S.p;
    switch (n.rel) {
      case 'father': return '父亲|Father';
      case 'mother': return '母亲|Mother';
      case 'stepparent': return m ? '继父|Stepfather' : '继母|Stepmother';
      case 'grand': return m ? '爷爷|Grandfather' : '奶奶|Grandmother';
      case 'sibling': var older = n.by < p.birthYear || (n.by === p.birthYear && n.older);
        return m ? (older ? '哥哥|Older Brother' : '弟弟|Younger Brother') : (older ? '姐姐|Older Sister' : '妹妹|Younger Sister');
      case 'lover': return n.engaged ? (m ? '未婚夫|Fiancé' : '未婚妻|Fiancée') : (m ? '男朋友|Boyfriend' : '女朋友|Girlfriend');
      case 'spouse': return m ? '丈夫|Husband' : '妻子|Wife';
      case 'ex': return n.exSpouse ? (m ? '前夫|Ex-husband' : '前妻|Ex-wife') : (m ? '前男友|Ex-boyfriend' : '前女友|Ex-girlfriend');
      case 'child': return m ? '儿子|Son' : '女儿|Daughter';
      case 'grandchild': return m ? '孙子|Grandson' : '孙女|Granddaughter';
      case 'friend': return n.aff >= 80 ? (m ? '死党|Best Buddy' : '闺蜜|Best Friend') : '朋友|Friend';
      case 'classmate': return '同学|Classmate';
      case 'colleague': return '同事|Coworker';
      case 'boss': return '上司|Boss';
      case 'admirer': return '追求者|Admirer';
      case 'crush': return '暗恋对象|Crush';
      case 'affair': return '情人|Secret Lover';
      case 'kin': var ka = N.age(n), pa = p.age;
        if (n.kin === 'nibling') return m ? '侄子/外甥|Nephew' : '侄女/外甥女|Niece';
        if (n.kin === 'aunt') return m ? '叔叔/舅舅|Uncle' : '姑姑/阿姨|Aunt';
        return ka > pa + 15 ? '长辈亲戚|Older Relative' : '亲戚|Relative';
      case 'enemy': return '仇人|Enemy';
      case 'rival': return '对手|Rival';
      case 'mentor': return '恩师|Mentor';
      case 'inmate': return '狱友|Cellmate';
      case 'gang': return '帮派兄弟|Gang Member';
      case 'teacher': return '老师|Teacher';
      default: return '认识的人|Acquaintance';
    }
  };
  N.isFamily = function (n) { return !!N.family[n.rel] || n.rel === 'spouse'; };

  /* orientation compatibility both ways */
  N.compatible = function (n) {
    var p = G.S.p;
    var pl = p.orient === 'bi' || (p.orient === 'gay' ? n.g === p.g : n.g !== p.g);
    var nl = n.orient === 'bi' || (n.orient === 'gay' ? p.g === n.g : p.g !== n.g);
    return pl && nl;
  };
  /* romance allowed: compatible, not family, both adults or both minors of similar age */
  N.canRomance = function (n) {
    if (!n || !n.alive || N.family[n.rel]) return false;
    if (!N.compatible(n)) return false;
    var pa = G.S.p.age, na = N.age(n);
    if (pa < 14 || na < 14) return false;
    if (pa < 18 || na < 18) return pa < 18 && na < 18 && Math.abs(pa - na) <= 2;
    return true;
  };
  N.netWorthScore = function () { // 0..1
    var nw = G.netWorth ? G.netWorth() : G.S.p.money, base = G.$(20000);
    if (nw <= 0) return 0;
    return G.clamp(Math.log10(nw / base + 1) / 3.2, 0, 1);
  };
  N.attract = function (n) {
    if (!N.canRomance(n)) return 0;
    var p = G.S.p, pe = G.PERS[n.pers] || G.PERS.cheer;
    var s = .12 + (p.st.looks / 100) * (.22 + pe.lk / 260) + (p.st.eq / 100) * .18 + N.netWorthScore() * (pe.mo / 140) + (p.st.fame / 100) * .14;
    var gap = Math.abs(N.age(n) - p.age);
    if (gap > 8) s -= (gap - 8) * (n.pers === 'gold' ? .006 : .022);
    if (G.has('charm')) s += .14;
    if (G.has('peach')) s += .05;
    if (p.st.happy < 25) s -= .05;
    if (p.jail) s -= .25;
    // looks gap: very attractive npcs are picky
    if (n.looks > 80 && p.st.looks < 50 && n.pers !== 'gold') s -= .08;
    return G.clamp(s, 0, 1);
  };

  /* generate a romance-compatible NPC (admirer / candidate) */
  N.mkRomantic = function (o) {
    o = o || {};
    var p = G.S.p, g;
    if (p.orient === 'het') g = p.g === 'm' ? 'f' : 'm';
    else if (p.orient === 'gay') g = p.g;
    else g = G.ch(.5) ? 'm' : 'f';
    var orient = (p.orient === 'het') ? (G.ch(.85) ? 'het' : 'bi') : (G.ch(.6) ? 'gay' : 'bi');
    if (g !== p.g && orient === 'gay') orient = 'het';
    if (g === p.g && orient === 'het') orient = 'gay';
    var age;
    if (p.age < 18) age = G.clamp(p.age + G.ri(-1, 1), 14, 17);
    else age = Math.max(18, p.age + G.ri(o.minGap != null ? o.minGap : -6, o.maxGap != null ? o.maxGap : 8));
    var ex = { rel: o.rel || 'admirer', g: g, orient: orient, age: age, tags: o.tags, love: o.love != null ? o.love : 0, aff: o.aff != null ? o.aff : 10, c: o.c };
    if (o.looks != null) ex.looks = o.looks;
    if (o.tags && o.tags.length) { ex.looks = ex.looks || G.clamp(Math.round(G.nrm(78, 10)), 50, 100); }
    return N.make(ex);
  };

  N.touch = function (n) { n.lt = G.S.year; };
  N.addAff = function (n, d) {
    if (d > 0 && G.has('social')) d *= 1.2;
    if (d > 0 && G.has('charm')) d *= 1.1;
    var o = n.aff; n.aff = G.clamp(Math.round(n.aff + d), -100, 100); return n.aff - o;
  };
  N.addLove = function (n, d) {
    if (d > 0 && G.has('charm')) d *= 1.25;
    var o = n.love; n.love = G.clamp(Math.round(n.love + d), 0, 100); return n.love - o;
  };

  /* yearly simulation of all NPCs */
  N.tick = function () {
    var S = G.S, p = S.p, out = [];
    N.all(function (n) { return n.alive; }).forEach(function (n) {
      var age = N.age(n), cc = G.C[n.c] || G.C.cn;
      // health
      if (age > 45) n.health -= G.ri(0, age > 70 ? 4 : 2);
      n.health = G.clamp(n.health + G.ri(-1, 1), 0, 100);
      // mortality
      var q = 0;
      if (age > 55) q = Math.pow((age - 50) / (cc.life + 12 - 50), 3) * .25;
      if (n.health < 30) q += (30 - n.health) / 120;
      if (age < 55) q += .0008;
      if (n.rel === 'child' || n.rel === 'grandchild') q *= .3;
      if (n.dieY) { q = S.year >= n.dieY ? 1 : 0; if (n.health <= 0) n.health = 5; }
      if (G.ch(Math.min(q, .6)) || n.health <= 0 || age > 108) { n.alive = false; n.died = S.year; out.push(n); return; }
      // aging into adulthood / jobs
      // life stages (range-based so nothing gets stuck if a year is skipped, e.g. after playing on as an heir).
      // The player's own children are grown by G.family.growKid.
      if (n.rel !== 'child' || n.jobT) {
        var ret = cc.retire || 60;
        if ((n.job === '婴儿|Baby') && age >= 3) n.job = '学龄前|Preschooler';
        if (n.job === '学龄前|Preschooler' && age >= 6) n.job = '学生|Student';
        if (n.job === '学生|Student' && age >= 18) {
          if (age < 21 && G.ch(.55)) n.job = '大学生|University Student';
          else { var j0 = G.pick(G.NPC_JOBS.slice(5, 20)); n.job = j0.n; n.inc = G.$w(j0.u * G.rf(.7, 1.1), n.c); }
        }
        if (n.job === '大学生|University Student' && age >= 23) { var jb = G.pick(G.NPC_JOBS.slice(0, 18)); n.job = jb.n; n.inc = G.$w(jb.u * G.rf(.8, 1.3), n.c); }
        if (age > ret && n.job !== '退休|Retired' && !n.tags.length && n.inc && (n.rel !== 'spouse' || age > ret + 5) && G.ch(age > ret + 4 ? 1 : .35)) { n.job = '退休|Retired'; n.inc = Math.round(n.inc * .45); }
      }
      // inflation of income
      var g = G.eraIdx(n.c, S.year) / G.eraIdx(n.c, S.year - 1);
      n.inc = Math.round((n.inc || 0) * g);
      n.wealth = Math.max(0, Math.round(n.wealth * g + (n.inc || 0) * G.rf(.05, .25)));
      // affection decay
      if (n.lt < S.year) {
        if (n.aff > 0) n.aff -= N.family[n.rel] ? 1 : (n.rel === 'spouse' || n.rel === 'lover') ? 2 : 3;
        else if (n.aff < 0) n.aff += 1;
        if ((n.rel === 'spouse' || n.rel === 'lover') && n.love > 0) n.love -= G.ri(1, 4);
      }
      n.chatN = 0;
    });
    N.prune();
    return out; // newly dead npcs
  };
  N.prune = function () {
    var S = G.S, keep = { father: 1, mother: 1, sibling: 1, child: 1, grand: 1, grandchild: 1, spouse: 1, lover: 1, stepparent: 1 };
    N.all().forEach(function (n) {
      if (keep[n.rel] || n.id === S.p.partner) return;
      if (n.pin) return;
      var idle = S.year - (n.lt || n.met);
      if (!n.alive && S.year - (n.died || 0) > 3) { delete S.npcs[n.id]; return; }
      if (n.rel === 'friend' && n.aff > 30) return;
      if (n.rel === 'ex' && idle < 15) return;
      if (n.rel === 'enemy' && idle < 10) return;
      if (n.aff < 25 && idle > 5) delete S.npcs[n.id];
      else if (idle > 12 && n.aff < 60) delete S.npcs[n.id];
    });
  };

  /* label for wealth tiers */
  N.wealthLabel = function (n) {
    var w = n.wealth || 0, b = G.$(10000, n.c);
    if (w > b * 10000) return '富可敌国|Unimaginably rich';
    if (w > b * 1000) return '超级富豪|Ultra-wealthy';
    if (w > b * 100) return '富豪|Wealthy';
    if (w > b * 20) return '富裕|Well-off';
    if (w > b * 3) return '小康|Comfortable';
    if (w > b * .3) return '普通|Average';
    return '拮据|Struggling';
  };
  N.looksLabel = function (v) {
    return v >= 90 ? '倾国倾城|Stunning' : v >= 75 ? '颜值很高|Very attractive' : v >= 60 ? '好看|Good-looking' : v >= 40 ? '普通|Average' : v >= 25 ? '一般|Plain' : '不太好看|Unattractive';
  };
})();
