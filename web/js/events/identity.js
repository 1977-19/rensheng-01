/* Every life its own: a palace childhood is not a council-flat childhood.
   Household staff, family titles, relatives who live like the family they belong to, teachers at elite schools,
   and storylines that only happen to royals, aristocrats, political dynasties, tycoons and stars. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  var VIP = ['royal', 'noble', 'richest', 'tycoon', 'red', 'celebrity', 'mafia'];
  function S() { return G.S; }
  function org() { return S().p.origin; }
  function isOrg() { var a = [].slice.call(arguments); return a.indexOf(org()) >= 0 && !S().p.flags.trafficked && !S().p.flags.exRoyal; }
  function par() { return N.rel('father', 'mother').filter(function (n) { return n.alive; }); }
  function pp(c, n) { if (!n) return false; c.npc = n; c.prm.n = n.name; return true; }

  /* ---------------- household staff ---------------- */
  var STAFF = {
    royal: [['礼仪老师|Etiquette Tutor', 'f', [45, 60], 'perfect', 120000], ['王室管家|Royal Butler', 'm', [52, 66], 'calm', 150000], ['贴身保镖|Personal Protection Officer', 'm', [30, 42], 'loyal', 110000]],
    noble: [['家庭女教师|Governess', 'f', [40, 58], 'trad', 90000], ['庄园管家|Estate Butler', 'm', [50, 66], 'calm', 100000]],
    richest: [['管家|Butler', 'm', [45, 60], 'calm', 120000], ['保镖|Bodyguard', 'm', [30, 45], 'loyal', 90000], ['专职司机|Chauffeur', 'm', [35, 55], 'honest', 60000]],
    tycoon: [['管家|Housekeeper', 'f', [40, 58], 'worrier', 80000], ['专职司机|Chauffeur', 'm', [35, 55], 'honest', 55000]],
    merchant: [['住家保姆|Live-in Nanny', 'f', [38, 55], 'kind', 30000], ['司机|Driver', 'm', [35, 55], 'honest', 35000]],
    red: [['警卫员|Security Guard', 'm', [24, 32], 'loyal', 30000], ['司机|Driver', 'm', [35, 50], 'calm', 30000]],
    celebrity: [['住家保姆|Live-in Nanny', 'f', [38, 55], 'gentle', 40000], ['爸妈的经纪人|Your Parents\' Agent', 'f', [30, 45], 'social', 120000]],
    mafia: [['保镖|Bodyguard', 'm', [28, 45], 'loyal', 60000]]
  };
  var create0 = G.life.create;
  G.life.create = function (o) {
    var r = create0.apply(this, arguments), p = S().p, L = STAFF[p.origin];
    if (L && !p.flags.trafficked) L.forEach(function (x) {
      var n = N.make({ rel: 'staff', g: x[1], age: G.ri(x[2][0], x[2][1]), job: x[0], inc: G.$w(x[4] * G.rf(.8, 1.3), p.country), wealth: G.$(x[4] * G.rf(2, 6)), aff: G.ri(35, 60), pers: x[3], c: p.country });
      n.pin = 1; n.staffT = x[0];
    });
    // brothers and sisters of a wealthy family live like one
    N.rel('sibling').forEach(function (s) { eliteUp(s); });
    return r;
  };
  var rn0 = N.relName;
  N.relName = function (n) {
    var p = S() && S().p;
    if (n.rel === 'staff') return p && p.origin === 'royal' && !p.flags.exRoyal ? '王宫职员|Palace Staff' : (n.staffT === '育儿保姆|Nanny' ? '孩子的保姆|The Children\'s Nanny' : '家里的人|Household Staff');
    if (p && p.origin === 'royal' && !p.flags.exRoyal && !p.flags.trafficked) {
      var m = n.g === 'm';
      if (n.rel === 'father') return n.king ? '父王|Father the King' : n.exKing ? '先王|The Late King' : '父亲|Father';
      if (n.rel === 'mother') return n.queen ? '母后|Mother the Queen' : '母亲|Mother';
      if (n.rel === 'sibling') { var older = n.by < p.birthYear; var b = m ? (older ? '王兄|Elder Brother' : '王弟|Younger Brother') : (older ? '王姐|Elder Sister' : '王妹|Younger Sister'); return n.heir ? b.split('|')[0] + '（储君）|' + b.split('|')[1] + ' (Heir)' : b; }
    }
    return rn0.apply(this, arguments);
  };

  /* ---------------- relatives match the family ---------------- */
  var EJOB = {
    royal: { m: [['王子|Prince', 3e6]], f: [['公主|Princess', 3e6]] },
    noble: { m: [['家族企业董事|Family Firm Director', 6e5], ['外交官|Diplomat', 2e5], ['艺术品收藏家|Art Collector', 4e5]], f: [['慈善基金会主席|Foundation Chair', 3e5], ['画廊主人|Gallery Owner', 3e5], ['外交官|Diplomat', 2e5]] },
    richest: { m: [['集团副总裁|Group Vice President', 2e6], ['投资基金合伙人|Investment Fund Partner', 3e6]], f: [['集团副总裁|Group Vice President', 2e6], ['奢侈品牌主理人|Luxury Brand Founder', 1.5e6]] },
    tycoon: { m: [['公司总经理|General Manager', 6e5], ['投资人|Investor', 8e5]], f: [['公司总经理|General Manager', 6e5], ['投资人|Investor', 8e5]] },
    merchant: { m: [['公司总经理|General Manager', 3e5], ['外贸老板|Trading Company Owner', 2.5e5]], f: [['公司总经理|General Manager', 3e5], ['连锁店老板|Chain Store Owner', 2e5]] },
    red: { m: [['国企高管|State Enterprise Executive', 2e5], ['部委司长|Ministry Department Head', 1e5], ['军队干部|Army Officer', 9e4]], f: [['国企高管|State Enterprise Executive', 2e5], ['投资公司董事|Investment Firm Director', 3e5]] },
    celebrity: { m: [['演员|Actor', 3e5], ['导演|Director', 4e5]], f: [['演员|Actress', 3e5], ['歌手|Singer', 3e5]] }
  };
  var FLOOR = { royal: 2e7, noble: 6e6, richest: 3e7, tycoon: 8e6, merchant: 1.5e6, red: 2e6, celebrity: 1.5e6 };
  var FAMR = ['sibling', 'kin', 'grand', 'father', 'mother'];
  function eliteUp(n) {
    var p = S().p, o = p.origin;
    if (!EJOB[o] || p.flags.trafficked || !n.alive || FAMR.indexOf(n.rel) < 0 || n.eliteSet) return;
    var a = N.age(n), fl = G.$(FLOOR[o]);
    if (a < 22) { n.wealth = Math.max(n.wealth || 0, Math.round(fl * .03)); if (o === 'royal' && n.rel === 'sibling') n.job = n.g === 'm' ? '王子|Prince' : '公主|Princess'; return; }
    if (n.rel === 'father' || n.rel === 'mother') { n.wealth = Math.max(n.wealth || 0, Math.round(fl * .5)); n.eliteSet = 1; return; }
    var j = G.pick(EJOB[o][n.g] || EJOB[o].m);
    if (!n.flagJob) { n.job = j[0]; n.inc = Math.max(n.inc || 0, G.$w(j[1] * G.rf(.7, 1.3), n.c)); }
    n.wealth = Math.max(n.wealth || 0, Math.round(fl * G.rf(.15, .6)));
    n.eliteSet = 1;
  }
  var ntick0 = N.tick;
  N.tick = function () {
    var r = ntick0.apply(this, arguments), p = S().p;
    if (EJOB[p.origin] && !p.flags.trafficked) N.all(function (n) { return n.alive && FAMR.indexOf(n.rel) >= 0; }).forEach(function (n) { if (N.age(n) >= 22 && !n.eliteSet) eliteUp(n); else if (N.age(n) < 22) eliteUp(n); });
    return r;
  };

  /* teachers at elite schools are not poor */
  var make0 = N.make;
  N.make = function (o) {
    o = o || {};
    var n = make0.apply(this, arguments), p = S() && S().p;
    if (p && n && (o.rel === 'teacher' || o.rel === 'tutor') && p.age < 22 && G.famClass && G.famClass() >= 2) {
      n.inc = Math.max(n.inc || 0, G.$w(G.ri(90, 180) * 1000, n.c)); n.wealth = Math.max(n.wealth || 0, G.$(G.ri(6, 20) * 1e5));
      if (/教师|老师|Teacher/.test(n.job || '')) n.job = (org() === 'royal' || org() === 'noble') ? '贵族学校教师|Teacher at an Elite Academy' : '国际学校教师|International School Teacher';
    }
    return n;
  };

  /* ---------------- generic events that don't fit ---------------- */
  var ASIA = ['cn', 'kr', 'jp', 'th', 'sg', 'in'];
  var NOT_ROYAL = ['c_fight_par', 't_shoes', 't_job1', 'c_fortune', 'c_pocket', 'x_rural_city'];
  var ROYAL_RX = /客厅|小区|楼下|邻居家|菜市场|公交|地摊|小卖部|网吧|挤地铁|出租屋|房东|红包/;
  var elig0 = G.eligible;
  G.eligible = function (d) {
    if (!elig0.apply(this, arguments)) return false;
    var p = S().p, o = p.origin;
    if (d.id === 'c_fortune' && ASIA.indexOf(p.country) < 0) return false;
    // each life only gets its own random share of the everyday childhood moments, so no two childhoods read alike
    if (/^(b|c|t)_/.test(d.id) && !d.sys && !d.idn && (G.hash(String(p.birthYear) + p.name + d.id) % 100) >= 58) return false;
    if (!p.flags.trafficked && !p.flags.exRoyal) {
      if ((o === 'royal' || o === 'noble') && (NOT_ROYAL.indexOf(d.id) >= 0 || (!d.sys && ROYAL_RX.test(String(d.title || '') + (typeof d.t === 'string' ? d.t : ''))))) return false;
      // the ordinary childhood still happens, just less: your own family's stories come first
      if (VIP.indexOf(o) >= 0 && ['c_steal_home', 'c_wallet', 'b_why', 'b_hide'].indexOf(d.id) >= 0 && o !== 'mafia') return false;
      if (VIP.indexOf(o) >= 0 && p.age < 18 && /^(b|c|t|s|k)_/.test(d.id) && !d.cls && !d.idn && G.ch(.65)) return false;
    }
    return true;
  };
  // these older chapters are now told in richer versions below / by the trust-fund system
  ['or_ry_etiquette', 'or_rc_trust'].forEach(function (id) { if (G.EV[id]) G.EV[id].if = function () { return false; }; });
  // the commoner in the tabloids is a real person now
  (function () {
    var d = G.EV.or_ry_tabloid; if (!d) return;
    d.prep = function (c) { var pt = N.partner(); if (!pt || (pt.tags && pt.tags.length)) { pt = N.mkRomantic({ rel: 'lover', love: G.ri(45, 70), aff: G.ri(40, 60), tags: [] }); pt.rel = 'lover'; pt.yrs = 0; S().p.partner = pt.id; } pp(c, pt); c.prm.n = pt.name; };
    d.t = '你和{n}约会的照片登上了小报头条——{n}只是个普通人。|Photos of you on a date with {n} — a commoner — splash across the tabloids.';
    d.o[0].run = function (c) { H.fx(c, { fame: 8, par: -8, happy: 6 }); G.dPush('love', N.addLove(c.npc, 12)); c.npc.public = 1; return '公众为你和{n}的爱情故事着迷，王室却很不高兴。|The public adores your love story with {n}; the family does not.'; };
    d.o[1].run = function (c) { H.fx(c, { happy: -8, rep: 2 }); G.love.breakup(c.npc); return '你保住了体面，{n}却伤心地离开了。|You kept up appearances; {n} left heartbroken.'; };
  })();

  /* ---------------- marrying into a royal house ---------------- */
  var CI = G.circle;
  if (CI && CI.ensureInlaws) {
    var ens = CI.ensureInlaws;
    CI.ensureInlaws = function (pt) {
      var L = ens.apply(this, arguments) || [];
      if (pt && pt.tags && pt.tags[0] === 'royal') L.forEach(function (x) { if (x.royalFix) return; x.royalFix = 1; x.c = pt.c; x.tags = ['royal']; x.job = x.g === 'm' ? '国王|King' : '王后|Queen'; x.wealth = Math.max(x.wealth || 0, G.$(G.ri(5, 40) * 1e7)); x.inc = Math.max(x.inc || 0, G.$w(5e6, x.c)); });
      return L;
    };
  }
  (function () {
    var d = G.EV.n_meet_parents; if (!d) return;
    function roy(c) { return !!(c.npc && c.npc.tags && c.npc.tags[0] === 'royal'); }
    var t0 = d.t;
    d.t = function (c) { return roy(c) ? '你受邀前往{k}的王宫，正式觐见{n}的父母——国王和王后。礼宾官提前把流程讲了三遍。|You are invited to the palace of {k} for a formal audience with {n}\'s parents — the King and Queen. The chief of protocol briefed you three times.' : t0; };
    var p0 = d.prep;
    d.prep = function (c) { var r = p0.apply(this, arguments); if (r === false) return false; if (roy(c)) c.prm.k = G.C[c.npc.c] ? G.C[c.npc.c].n : '王国|the kingdom'; return r; };
    d.o.forEach(function (o) { var f = o.if; o.if = function (c) { return !roy(c) && (!f || f.apply(this, arguments)); }; });
    d.o.push(
      { t: '行标准的宫廷礼|Perfect court etiquette', if: roy, run: function (c) { var ok = c.p.flags.etiquette || isOrg('royal', 'noble') || G.ch(.3 + c.p.st.eq / 200); c.L.forEach(function (x) { G.dPush('aff', N.addAff(x, ok ? 14 : -6)); }); c.npc.metPar = 1; return ok ? '你的礼节无可挑剔。国王对{n}低声说：“很有教养。”|Your manners were flawless. The King murmured to {n}, "Well brought up."' : '你在行屈膝礼时差点摔倒，王后礼貌地移开了目光。|You nearly toppled mid-curtsy; the Queen politely looked away.'; } },
      { t: '献上一件国宝级礼物|Present a priceless gift', if: roy, run: function (c) { var m = c.$(isOrg('royal') ? 0 : 200000); if (m && !c.pay(m)) { c.L.forEach(function (x) { G.dPush('aff', N.addAff(x, -4)); }); c.npc.metPar = 1; return '你准备的礼物在王宫里显得太寒酸了。|Your gift looked shabby inside the palace.'; } c.L.forEach(function (x) { G.dPush('aff', N.addAff(x, 10)); }); c.npc.metPar = 1; return isOrg('royal') ? '你代表王室赠送了一件古董瓷器，两国媒体都报道了这次会面。|You presented an antique porcelain on behalf of your house; both countries\' press covered the meeting.' : '国王把玩着你送的古董，难得地笑了。|The King turned your antique over in his hands and, rarely, smiled.'; } },
      { t: '和国王谈论两国关系|Talk diplomacy with the King', if: roy, run: function (c) { var ok = G.ch(.35 + c.p.st.smarts / 250); c.L.forEach(function (x) { G.dPush('aff', N.addAff(x, ok ? 12 : -8)); }); c.npc.metPar = 1; if (ok) G.addStat('fame', 2); return ok ? '国王和你聊了一个下午，最后说：“下次再来。”|The King talked with you all afternoon, then said, "Come again."' : '你说错了一句话，气氛瞬间凝固。|One wrong remark and the room froze.'; } }
    );
  })();

  /* ---------------- stories only your family lives ---------------- */
  function IE(id, orgs, a, title, icon, t, o, x) {
    x = x || {}; var f = x.if; orgs = [].concat(orgs);
    x.idn = 1; x.if = function (S2, p) { return orgs.indexOf(p.origin) >= 0 && !p.flags.trafficked && !p.flags.exRoyal && (!f || f(S2, p)); };
    if (x.w == null) x.w = 2.6; if (x.cd == null) x.cd = 40;
    return E(id, a, title, icon, t, o, x);
  }
  function staff(k) { return N.all(function (n) { return n.alive && n.rel === 'staff' && new RegExp(k).test(n.staffT || ''); })[0]; }
  function addStaff(t, g, pers, usd) { var p = S().p, n = N.make({ rel: 'staff', g: g, age: G.ri(35, 60), job: t, inc: G.$w(usd, p.country), wealth: G.$(usd * 3), aff: 40, pers: pers }); n.pin = 1; n.staffT = t; return n; }
  G.evs([
    /* ===== royal ===== */
    IE('ry_etiquette', ['royal', 'noble'], [4, 10], '礼仪课|Etiquette Lessons', '🫖', '{n}每天下午准时出现：怎么行礼、怎么拿刀叉、怎么在镜头前微笑……一个动作要练上百遍。|{n} arrives every afternoon on the dot: how to bow, how to hold the cutlery, how to smile for the cameras — each move practiced a hundred times.', [
      O('一丝不苟地学|Learn it to perfection', function (c) { c.p.flags.etiquette = 1; G.dPush('aff', N.addAff(c.npc, 8)); H.fx(c, { eq: 3, happy: -3, par: 4 }); return '你的礼仪成了王室里的模范。|Your manners became the model of the household.'; }),
      O('趁老师转身做鬼脸|Pull faces when the tutor turns away', function (c) { G.dPush('aff', N.addAff(c.npc, -8)); H.fx(c, { happy: 4, eq: -1 }); return '{n}从镜子里看到了，什么也没说，只是叹了口气。|{n} saw it in the mirror, said nothing, and sighed.'; }),
      O('问“为什么一定要这样？”|Ask "Why must it be done this way?"', function (c) { G.dPush('aff', N.addAff(c.npc, 3)); H.fx(c, { smarts: 2, happy: -1 }); return '{n}讲了一下午礼仪背后的历史，你第一次觉得这些规矩也挺有意思。|{n} spent the afternoon on the history behind each custom; for the first time it seemed interesting.'; })
    ], { prep: function (c) { var n = staff('礼仪|Governess|Etiquette|女教师') || addStaff(org() === 'royal' ? '礼仪老师|Etiquette Tutor' : '家庭女教师|Governess', 'f', 'perfect', 100000); pp(c, n); } }),
    IE('ry_balcony', 'royal', [5, 12], '阳台亮相|On the Palace Balcony', '🏰', '国庆日，你第一次跟着父王站在王宫阳台上。下面是望不到头的人群和上百台摄像机。|On National Day you stand on the palace balcony beside the King for the first time. Below: an endless crowd and a hundred cameras.', [
      O('标准地挥手微笑|Wave and smile perfectly', R('第二天的报纸称你“小小年纪就有王者风范”。|The next morning\'s papers said you "already carry yourself like royalty".', { fame: 5, par: 5, happy: -1 })),
      O('对着镜头扮鬼脸|Pull a face at the cameras', R('那张照片成了全国最火的表情包，母后很不高兴。|The photo became the nation\'s favorite meme. The Queen was not amused.', { fame: 8, happy: 4, par: -6 })),
      O('被人群吓哭了|Burst into tears at the noise', R('你被抱回了宫里。全国都在心疼你。|You were carried back inside. The whole country felt for you.', { fame: 3, happy: -4, eq: 1 }))
    ], { cd: 99, w: 4 }),
    IE('ry_banquet', 'royal', [9, 16], '第一次国宴|Your First State Banquet', '🍽️', '你被安排坐在来访的外国总统旁边。面前摆着十几把刀叉，所有人都在看你。|You\'re seated beside a visiting foreign president. A dozen forks and knives before you — and every eye on you.', [
      O('落落大方地聊你的爱好|Chat easily about your hobbies', function (c) { var ok = c.p.flags.etiquette || G.ch(.5 + c.p.st.eq / 300); H.fx(c, ok ? { fame: 4, eq: 2, par: 4 } : { happy: -4, eq: 1 }); return ok ? '总统笑着对父王说：“您的孩子很了不起。”|The president told the King, laughing, "Your child is remarkable."' : '你紧张得把总统的名字说错了。|You were so nervous you got the president\'s name wrong.'; }),
      O('全程安静，只用对刀叉|Stay quiet and just use the right fork', R('没有出错，也没人记得你。|No mistakes — and nobody remembered you.', { eq: 1, happy: -1 })),
      O('偷偷把不爱吃的菜塞给侍者|Slip the food you hate to a footman', R('侍者憋着笑帮你“处理”掉了。你们成了秘密盟友。|The footman, suppressing a smile, made it disappear. You became secret allies.', { happy: 3, eq: 1, smarts: -1 }))
    ], { cd: 99 }),
    IE('ry_parents_cold', 'royal', [6, 16], '国王与王后的冷战|The King and Queen\'s Cold War', '❄️', '父王和母后已经三个月没在同一张餐桌上吃饭了。宫里的人说话都压低了声音。|The King and Queen haven\'t shared a dinner table in three months. The whole palace speaks in whispers.', [
      O('替他们传话|Carry messages between them', R('你成了两边的小信使，累，但他们好像没那么僵了。|You became a tiny go-between — exhausting, but the frost seemed to thaw a little.', { eq: 3, happy: -3, par: 4 })),
      O('去问老管家|Ask the old butler', function (c) { var b = staff('管家|Butler'); if (b) { G.dPush('aff', N.addAff(b, 6)); } H.fx(c, { smarts: 1, eq: 2 }); return '老管家摸摸你的头：“大人的事，大人会处理好的。”他悄悄给你拿了一块点心。|The old butler patted your head: "Grown-ups will sort out grown-up things." He slipped you a pastry.'; }),
      O('假装什么都没发生|Pretend nothing is happening', R('你把自己关在房间里画画。|You shut yourself in your room and drew.', { happy: -4, smarts: 1 }))
    ], { bad: 1, cd: 99, if: function () { return par().length === 2; } }),
    IE('ry_school', ['royal', 'noble'], [12, 17], '贵族寄宿学校|The Old Boarding School', '🏫', '你被送进了一所有五百年历史的寄宿学校。这里的同学，父亲不是公爵就是部长。|You\'re sent to a five-hundred-year-old boarding school. Every classmate\'s father is a duke or a minister.', [
      O('放下身份，和大家打成一片|Drop the title and fit in', function (c) { var n = N.make({ rel: 'friend', age: c.p.age, aff: 50, tags: ['rich'], pers: G.pick(['loyal', 'funny', 'honest']) }); c.prm.f = n.name; H.fx(c, { eq: 4, happy: 3, smarts: -1 }); return '你和{f}成了一辈子的朋友。|You and {f} became friends for life.'; }),
      O('把精力都放在学习上|Throw yourself into your studies', R('你拿下了年级第一，但宿舍熄灯后常常觉得孤单。|You topped your year — and felt lonely after lights-out.', { smarts: 4, happy: -3 })),
      O('利用身份当上学生会主席|Use your name to win head of school', R('你赢了选举，也听到了背后的议论。|You won — and heard the whispers behind your back.', { eq: 2, fame: 2, karma: -2 }))
    ], { cd: 99 }),
    IE('ry_disguise', 'royal', [14, 30], '王宫外的一天|A Day Outside the Palace', '🧢', '你戴上帽子和口罩，甩开保镖，第一次像普通人一样走上街头。|In a cap and mask you slip your protection officers and walk the streets like an ordinary person for the first time.', [
      O('去吃路边摊|Eat at a street stall', RC(.7, '那是你吃过最好吃的东西。没人认出你。|The best thing you\'ve ever eaten. Nobody recognized you.', { happy: 8, eq: 2 }, '老板认出了你，第二天全网都是你吃烤串的照片。|The vendor recognized you; next day your skewer photo was everywhere.', { happy: 2, fame: 6, par: -5 })),
      O('坐一次地铁|Ride the subway', R('你在人群里站了一个小时，第一次知道普通人每天要挤多久。|You stood in the crush for an hour and learned what ordinary commutes are like.', { eq: 4, smarts: 1, happy: 2 })),
      O('找个小酒馆和陌生人聊天|Chat with strangers in a pub', function (c) { var n = N.mkRomantic({ rel: 'crush', love: G.ri(15, 35), tags: [] }); c.prm.n = n.name; H.fx(c, { happy: 6 }); return '你和{n}聊到深夜，{n}根本不知道你是谁。|You talked with {n} until late — {n} had no idea who you were.'; }, { if: function (c) { return c.p.age >= 18; } })
    ], { cd: 6 }),
    IE('ry_paparazzi', ['royal', 'noble', 'celebrity'], [12, 30], '长焦镜头|The Long Lens', '📷', '度假时，你在私人海滩上的照片被长焦镜头拍下，登上了好几国的小报。|On holiday, a long lens catches you on a private beach; the photos run in tabloids in several countries.', [
      O('起诉小报|Sue the tabloid', function (c) { var m = c.$(30000); if (!c.pay(m)) return '律师费太贵，你只能忍了。|The lawyers were too expensive; you had to let it go.'; var ok = G.ch(.55); H.fx(c, ok ? { money: m * 2, fame: 2, happy: 4 } : { fame: 3, happy: -4 }); return ok ? '你赢了官司，小报公开道歉并赔偿。|You won; the tabloid apologized and paid damages.' : '官司输了，照片反而被转载得更多。|You lost — and the photos spread even further.'; }),
      O('一笑置之|Laugh it off', R('你在社交媒体上发了一张更好看的照片自嘲，网友都夸你大方。|You posted a better photo of yourself as a joke; people loved your good humor.', { fame: 4, happy: 2, eq: 2 })),
      O('从此不再出门度假|Stop taking holidays altogether', R('你的世界变得越来越小。|Your world got smaller and smaller.', { happy: -6, health: -1 }))
    ], { cd: 8 }),
    IE('ry_service', 'royal', [18, 24], '王室子弟服役|The Royal Tradition of Service', '🎖️', '按照传统，王室子弟要在军队服役。你可以选择去前线部队，也可以待在后方。|By tradition, royals serve in the armed forces. You can join a frontline unit or stay behind the lines.', [
      O('去前线部队|Join a frontline unit', function (c) { if (G.ch(.12)) { H.fx(c, { health: -18, fame: 12, karma: 8 }); G.major('在服役中负伤|Wounded in service'); return '你在一次任务中负了伤，全国都在为你祈祷。|You were wounded on a mission; the whole country prayed for you.'; } H.fx(c, { health: 5, fame: 8, eq: 3, karma: 5 }); c.p.flags.served = 1; return '你和普通士兵同吃同住，回来时晒黑了，也更沉稳了。|You ate and slept beside ordinary soldiers and came back tanned and steadier.'; }),
      O('在指挥部做参谋|Serve as a staff officer at HQ', R('你学会了看地图、写报告，也认识了不少将军。|You learned maps and reports — and met a lot of generals.', { smarts: 3, eq: 2, fame: 2 })),
      O('以学业为由推迟|Defer, citing your studies', R('媒体讥讽你“娇生惯养”。|The press called you pampered.', { fame: -3, par: -6, smarts: 1 }))
    ], { cd: 99 }),
    IE('ry_spare', 'royal', [14, 32], '“备胎”|"The Spare"', '🃏', '报纸说你是“王室的备胎”：永远排在后面，永远不被期待。|The papers call you "the spare" — always further down the line, never expected to matter.', [
      O('投身慈善，做出自己的名字|Throw yourself into charity and make your own name', R('几年后，人们提起你，想到的是你的慈善事业。|Years later, people thought of your charity work when they heard your name.', { karma: 10, fame: 6, happy: 2 })),
      O('放纵自己，反正没人在乎|Party hard — no one cares anyway', R('你成了夜店常客和小报宠儿。|You became a nightclub regular and a tabloid favorite.', { happy: 6, fame: 5, health: -4, par: -8 })),
      O('偷偷写日记，记下一切|Secretly keep a diary of everything', function (c) { c.p.flags.memoir = 1; H.fx(c, { smarts: 2, eq: 2, happy: -1 }); return '也许有一天，这些日记会成为一本震动全国的书。|One day, this diary might become a book that shakes the nation.'; })
    ], { cd: 99, if: function () { return N.rel('sibling').some(function (s) { return s.alive && s.by < S().p.birthYear; }); } }),
    IE('ry_tour', 'royal', [18, 30], '第一次独立出访|Your First Solo Tour', '✈️', '你第一次代表王室独立出访，行程排满了：剪彩、演讲、和当地政要会面。|Your first solo tour representing the crown: ribbon-cuttings, speeches, meetings with officials.', [
      O('用当地语言演讲|Give a speech in the local language', function (c) { var ok = G.ch(.4 + c.p.st.smarts / 250); H.fx(c, ok ? { fame: 8, eq: 2 } : { fame: 2, happy: -3 }); return ok ? '全场起立鼓掌，当地报纸称你是“最好的外交官”。|A standing ovation; the local papers called you "the best diplomat".' : '你的口音逗笑了全场，好在大家很友好。|Your accent made the hall laugh — kindly, at least.'; }),
      O('严格按稿子来|Stick to the script', R('一切顺利，平平无奇。|Everything went smoothly — and forgettably.', { fame: 2, eq: 1 })),
      O('偷偷去探访一所贫民区学校|Make an unscheduled visit to a slum school', R('这段视频感动了无数人，礼宾官却气坏了。|The footage moved millions; the protocol chief was furious.', { fame: 10, karma: 8, par: -3 }))
    ], { cd: 99 }),
    IE('ry_match', ['royal', 'noble'], [19, 30], '门当户对|A Suitable Match', '💍', '宫里安排你和{c}的{n}见面。两家的长辈都在等你们“看对眼”。|The palace arranges for you to meet {n} of {c}. Both families are waiting for you two to "hit it off".', [
      O('认真接触|Give it a real chance', function (c) { var n = c.npc; n.pin = 1; G.dPush('love', N.addLove(n, G.ri(10, 28))); H.fx(c, { par: 8 }); return '{n}比你想象中有趣得多。|{n} is far more interesting than you expected.'; }),
      O('礼貌地拒绝|Politely decline', R('长辈们很失望，但你守住了自己的心。|The elders were disappointed, but you kept your heart your own.', { par: -8, happy: 2 })),
      O('答应联姻，只为责任|Agree to the match, out of duty', function (c) { var n = c.npc; n.pin = 1; n.rel = 'lover'; n.love = Math.max(n.love, 40); n.engaged = 1; c.p.partner = n.id; H.fx(c, { par: 12, happy: -4 }); G.major('与{n}订婚|Engaged to {n}', { n: n.name }); return '订婚的消息传遍了两个国家。|News of the engagement spread across two nations.'; }, { if: function () { return !N.partner(); } })
    ], { cd: 6, if: function () { return !N.spouse(); }, prep: function (c) { var mon = G.CLIST.filter(function (x) { return G.C[x].mon && x !== S().p.country; }); var cc = org() === 'royal' && mon.length ? G.pick(mon) : S().p.country; var n = N.mkRomantic({ rel: 'contact', tags: [org() === 'royal' ? 'royal' : 'rich'], love: G.ri(5, 25), aff: G.ri(20, 40), minGap: -4, maxGap: 4 }); n.c = cc; c.npc = n; c.prm.n = n.name; c.prm.c = G.C[cc].n; } }),
    /* ===== noble ===== */
    IE('nb_hunt', 'noble', [8, 16], '狩猎季|Hunting Season', '🦌', '秋天到了，家族庄园又迎来了一年一度的狩猎季，各地的贵族都来了。|Autumn brings the estate\'s annual hunting season; aristocrats arrive from across the country.', [
      O('跟着大人去打猎|Ride out with the hunt', R('你骑了一整天的马，晚宴上被夸“有家族风范”。|You rode all day; at dinner they said you had "the family spirit".', { health: 3, eq: 2, karma: -2 })),
      O('留在马厩照顾猎犬|Stay with the hounds in the kennels', R('你和猎犬们成了好朋友。|You became best friends with the hounds.', { happy: 4, karma: 2, eq: -1 })),
      O('偷偷放走一只被围的鹿|Secretly free a cornered deer', R('猎场看守看见了，冲你眨了眨眼。|The gamekeeper saw, and winked.', { karma: 6, happy: 3, par: -3 }))
    ], { cd: 99 }),
    IE('nb_debut', ['noble', 'royal', 'richest'], [16, 19], '社交季首秀|The Debutante Season', '💃', '你参加了人生第一场正式舞会，所有名门望族的年轻人都在这里“亮相”。|Your first formal ball: every young member of the great families is here to be "presented".', [
      O('跳遍整晚|Dance all night', function (c) { var n = N.mkRomantic({ rel: 'crush', tags: ['rich'], love: G.ri(15, 35) }); c.prm.n = n.name; H.fx(c, { happy: 6, eq: 2, fame: 2 }); return '你和{n}跳了三支舞，散场时互相留了联系方式。|You danced three times with {n} and swapped numbers at the end.'; }),
      O('在角落观察每一个人|Watch everyone from a corner', R('你记住了每个家族之间的恩怨。|You memorized every family feud in the room.', { smarts: 3, eq: 2, happy: -2 })),
      O('偷溜出去看星星|Sneak out to look at the stars', R('你在花园里遇到了同样溜出来的人，聊了很久。|In the garden you met someone else who\'d escaped, and talked for ages.', { happy: 4, eq: 1 }))
    ], { cd: 99 }),
    IE('nb_heirloom', 'noble', [7, 15], '祖传花瓶|The Heirloom Vase', '🏺', '你在长廊里踢球，把一只三百年的祖传花瓶踢碎了。|Playing ball in the long gallery, you smash a three-hundred-year-old heirloom vase.', [
      O('主动承认|Own up', R('祖父沉默了很久，说：“碎了的东西可以修，说谎的人修不好。”|Grandfather was silent a long time: "Broken things can be mended. Liars can\'t."', { karma: 5, eq: 3, happy: -3 })),
      O('嫁祸给猫|Blame the cat', RC(.5, '猫被关了三天禁闭。|The cat was confined for three days.', { happy: 2, karma: -4 }, '管家调出了监控……|The butler pulled the security footage...', { par: -10, karma: -4, happy: -4 })),
      O('偷偷用胶水粘好|Glue it back secretly', R('一年后才被发现，那时大家都笑了。|It was discovered a year later — by then everyone laughed.', { smarts: 2, happy: 1 }))
    ], { cd: 99 }),
    IE('nb_tax', ['noble'], [25, 60], '庄园的危机|The Estate in Peril', '🏚️', '高昂的遗产税和维护费让家族庄园入不敷出，有人建议卖掉几幅祖传的名画。|Death duties and upkeep are bleeding the estate dry. Someone suggests selling a few ancestral paintings.', [
      O('卖掉名画|Sell the paintings', R('名画拍出了天价，庄园保住了，但墙上空了。|The paintings fetched a fortune; the estate is saved, but the walls are bare.', { money: 3000000, happy: -4 })),
      O('把庄园开放给游客|Open the estate to tourists', R('每到周末，花园里都是游客。庄园活了过来。|Every weekend the gardens fill with visitors. The old place came alive.', { money: 400000, eq: 2, fame: 3 })),
      O('举债硬撑|Borrow to keep it all', function (c) { c.S.assets.debt.push({ k: 'loan', n: '庄园抵押贷款|Estate Mortgage', amt: c.$(2000000), r: .05 }); H.fx(c, { happy: -2 }); return '你保住了一切，也背上了沉重的债务。|You kept everything — and took on a crushing debt.'; })
    ], { cd: 99 }),
    /* ===== political dynasty ===== */
    IE('rd_guard', 'red', [5, 11], '警卫员叔叔|The Guard', '🫡', '大院门口的警卫员{n}教你敬礼，还偷偷给你看他的军功章。|{n}, the guard at the compound gate, teaches you to salute and secretly shows you his medals.', [
      O('天天跟着他练站岗|Practice standing guard with him every day', function (c) { G.dPush('aff', N.addAff(c.npc, 10)); H.fx(c, { health: 3, eq: 2, smarts: -1 }); return '你站得笔直，爷爷看了直点头。|You stood ramrod straight; Grandpa nodded his approval.'; }),
      O('缠着他讲打仗的故事|Beg him for war stories', function (c) { G.dPush('aff', N.addAff(c.npc, 6)); H.fx(c, { smarts: 2, happy: 2, health: -1 }); return '他讲的故事，比课本上的还精彩。|His stories beat the history books.'; }),
      O('让他帮你跑腿买零食|Make him run out for snacks', function (c) { G.dPush('aff', N.addAff(c.npc, -8)); H.fx(c, { happy: 3, eq: -2, par: -4 }); return '爸爸知道后狠狠批评了你：“他是战士，不是你的仆人。”|Dad was furious: "He is a soldier, not your servant."'; })
    ], { cd: 99, prep: function (c) { var n = staff('警卫|Guard') || addStaff('警卫员|Security Guard', 'm', 'loyal', 30000); pp(c, n); } }),
    IE('rd_dinner', 'red', [10, 18], '家宴上的叔叔伯伯|The Uncles at Dinner', '🍶', '家里来了几位叔叔伯伯，都是你在新闻里见过的人。饭桌上聊的事，你半懂不懂。|Several "uncles" come to dinner — all faces from the evening news. You only half follow the conversation.', [
      O('认真听，默默记|Listen closely and remember', R('那天的话，你多年后才明白。|You only understood those words years later.', { smarts: 3, eq: 3, happy: -1 })),
      O('给长辈们背一首诗|Recite a poem for the elders', R('一位伯伯拍着你的肩：“这孩子以后有出息。”|One uncle clapped your shoulder: "This one will go far."', { eq: 2, fame: 1, par: 5, happy: 1 })),
      O('插嘴发表自己的看法|Chime in with your own opinion', RC(.4, '大家都笑了，说你“有胆识”。|They laughed and called you bold.', { eq: 3, par: 3 }, '爸爸瞪了你一眼，饭后罚你写检讨。|Dad shot you a look; after dinner you wrote a self-criticism.', { happy: -4, eq: 2 }))
    ], { cd: 99 }),
    IE('rd_secret', 'red', [8, 16], '不能说的事|Things We Don\'t Talk About', '🤐', '同学问你：“你爸爸是做什么的？”你想起爸爸的叮嘱：家里的事，一个字都不能往外说。|A classmate asks what your dad does. You remember his warning: not one word about the family outside the house.', [
      O('说“普通上班族”|Say "just an office worker"', R('同学没再追问。你第一次学会了说谎。|They didn\'t press. It was the first time you learned to lie smoothly.', { eq: 3, karma: -1, happy: -1 })),
      O('得意地说出来|Boast about it', R('第二天全班都知道了，爸爸被人打了电话。你被关了一个月禁闭。|By morning the whole class knew; someone called your father. You were grounded for a month.', { happy: -6, par: -10, fame: 2 })),
      O('转移话题|Change the subject', R('你把话题岔到了球赛上。|You steered the talk to football.', { eq: 2, smarts: 1 }))
    ], { cd: 99 }),
    IE('rd_academy', ['red', 'military'], [17, 20], '军校还是名校|Military Academy or Top University', '🎖️', '家里给你两条路：进军校接受历练，或者去最好的大学读书。|The family offers two paths: a military academy to toughen you up, or the best university in the country.', [
      O('进军校|Military academy', function (c) { c.p.flags.milAcad = 1; H.fx(c, { health: 5, eq: 3, happy: -3, par: 6 }); return '你剃了平头，走进了军校大门。|You shaved your head and walked through the academy gates.'; }),
      O('去名校|Top university', function (c) { c.p.flags.uniBoost = (c.p.flags.uniBoost || 0) + 1; H.fx(c, { smarts: 3, par: 2 }); return '一封推荐信寄到了招生办。|A letter of recommendation made its way to the admissions office.'; }),
      O('都不要，我自己选|Neither — I\'ll choose for myself', R('家里很不高兴，但你第一次为自己做了决定。|The family was displeased, but you made your own choice for the first time.', { happy: 5, par: -8, eq: 2 }))
    ], { cd: 99 }),
    IE('rd_favor', 'red', [22, 50], '托你办事|Someone Wants a Favor', '📨', '一位老熟人带着厚厚的信封找上门：“只要你跟上面打个招呼……”|An old acquaintance arrives with a thick envelope: "If you could just have a word upstairs..."', [
      O('收下，帮这个忙|Take it and help', function (c) { c.p.h.heat = (c.p.h.heat || 0) + 20; H.fx(c, { money: c.$(80000), karma: -8, rep: 4 }); return '事情办成了。你知道，这种事一旦开头就停不下来。|It got done. You know this kind of thing never stops once it starts.'; }),
      O('婉拒|Politely refuse', R('他悻悻地走了，四处说你“不讲情面”。|He left sulking and told everyone you "don\'t do favors".', { karma: 4, rep: -2 })),
      O('报告给纪检部门|Report it to the discipline inspectors', R('你得罪了一圈人，却睡得很安稳。|You made enemies — and slept soundly.', { karma: 10, rep: -6, eq: 1 }))
    ], { cd: 8 }),
    /* ===== tycoon / richest ===== */
    IE('ty_island', ['richest', 'tycoon'], [8, 17], '私人海岛|The Private Island', '🏝️', '暑假，全家飞去了自家在海上的私人小岛。除了你们，岛上只有厨师、潜水教练和保镖。|For summer the family flies to its private island. Besides you: a chef, a diving instructor and the bodyguards.', [
      O('学潜水|Learn to dive', R('你在珊瑚礁里看到了一只海龟，那是你一生最难忘的画面。|You saw a sea turtle on the reef — a picture you never forgot.', { health: 4, happy: 5, smarts: -1 })),
      O('邀请同学一起来|Invite classmates along', function (c) { var n = N.make({ rel: 'friend', age: c.p.age, aff: 45 }); c.prm.n = n.name; H.fx(c, { happy: 5, eq: 2 }); return '{n}第一次坐私人飞机，兴奋得一夜没睡。|{n} had never been on a private jet and didn\'t sleep a wink.'; }),
      O('整天待在房间打游戏|Stay inside gaming all day', R('岛再美，也比不过屏幕。|However beautiful the island, it couldn\'t beat the screen.', { happy: 3, health: -2, smarts: -1 }))
    ], { cd: 99 }),
    IE('ty_car', ['richest', 'tycoon', 'merchant'], [16, 19], '一辆跑车|A Supercar for Your Birthday', '🏎️', '你的成年生日礼物，是一辆停在门口、系着大红蝴蝶结的跑车。|Your coming-of-age present is a supercar parked at the door, tied with a giant red bow.', [
      O('当晚就开出去飙车|Take it out racing that night', RC(.7, '风在耳边呼啸，你觉得自己是世界之王。|The wind roared past; you felt like king of the world.', { happy: 8, health: -1 }, '你撞上了护栏，跑车报废，自己进了医院。|You hit the barrier: the car was totaled and you ended up in hospital.', { health: -20, happy: -6, par: -6 })),
      O('卖掉，钱捐给慈善机构|Sell it and give the money to charity', R('你上了新闻。爸爸嘴上骂你“败家”，眼里却有骄傲。|You made the news. Dad grumbled about waste, but looked proud.', { karma: 12, fame: 4, par: 3 })),
      O('锁在车库里|Lock it in the garage', R('你还不想做别人眼中的“富二代”。|You\'re not ready to be the "rich kid" everyone expects.', { eq: 2, happy: -1 }))
    ], { cd: 99 }),
    IE('ty_board', ['richest', 'tycoon'], [16, 28], '列席董事会|A Seat at the Board Meeting', '📊', '爸爸让你列席集团董事会。一屋子西装革履的人，都在偷偷观察这位“未来的老板”。|Dad has you sit in on the board meeting. A room of suits quietly sizing up "the future boss".', [
      O('一言不发，认真记录|Say nothing and take notes', R('会后一位老董事说：“这孩子沉得住气。”|Afterwards an old director said, "This one keeps a cool head."', { smarts: 3, eq: 2, happy: -1, par: 3 })),
      O('当场质疑一项投资|Challenge an investment on the spot', function (c) { var ok = G.ch(.3 + c.p.st.smarts / 250); H.fx(c, ok ? { smarts: 2, eq: 2, par: 8, fame: 1 } : { happy: -5, par: -5 }); return ok ? '你说对了。三个月后那个项目暴雷，你一战成名。|You were right. Three months later that deal blew up — and you made your name.' : '你的问题暴露了你什么都不懂，会议室里一片尴尬。|Your question showed you knew nothing; the room went quiet with embarrassment.'; }),
      O('在桌下玩手机|Play on your phone under the table', R('爸爸会后把你的手机扔进了鱼缸。|After the meeting Dad dropped your phone in the fish tank.', { happy: -3, par: -6 }))
    ], { cd: 99 }),
    IE('ty_foundation', ['richest', 'tycoon', 'noble'], [22, 50], '家族基金会|The Family Foundation', '🎗️', '家族把慈善基金会交给你打理，每年有上亿的善款要分配。|The family hands you its charitable foundation — hundreds of millions to give away every year.', [
      O('资助偏远地区的学校|Fund schools in remote regions', R('十年后，第一批受资助的孩子考上了大学，写信感谢你。|Ten years on, the first sponsored children made it to university and wrote to thank you.', { karma: 12, fame: 5, happy: 5 })),
      O('拿来做公关和避税|Use it for PR and tax planning', R('账面很漂亮，你自己知道是怎么回事。|The books look beautiful. You know the truth.', { money: 500000, karma: -6 })),
      O('投入医学研究|Pour it into medical research', R('你资助的实验室发表了一项重要突破。|A lab you funded announced a major breakthrough.', { karma: 8, fame: 6, smarts: 2 }))
    ], { cd: 99 }),
    /* ===== celebrity ===== */
    IE('ce_reality', 'celebrity', [4, 10], '亲子综艺|The Family Reality Show', '🎬', '爸妈带你上了一档亲子综艺节目，一周后，全国观众都认识你了。|Your parents take you on a family reality show; a week later, the whole country knows your face.', [
      O('在镜头前尽情表现|Ham it up for the cameras', R('你成了节目里最受欢迎的孩子，片酬比爸妈还高。|You became the show\'s breakout kid — paid more than your parents.', { fame: 10, money: 20000, happy: 3, smarts: -1 })),
      O('躲在爸妈身后|Hide behind your parents', R('观众说你“害羞得好可爱”。|Viewers found your shyness adorable.', { fame: 5, happy: -2, eq: 1 })),
      O('在节目里说了家里的秘密|Spill a family secret on air', R('那一集收视率爆表，爸妈的脸色却很难看。|That episode set ratings records; your parents were not smiling.', { fame: 8, par: -8, happy: 2 }))
    ], { cd: 99 }),
    IE('ce_scandal', 'celebrity', [8, 18], '爸妈上了热搜|Your Parents Are Trending', '🔥', '一早醒来，爸妈的绯闻挂在热搜第一。学校门口围满了记者，同学们都在看你。|You wake to find your parents\' scandal at #1 trending. Reporters crowd the school gate; classmates stare.', [
      O('照常去上学|Go to school as usual', R('你低着头穿过记者群，一句话也没说。|You walked through the press pack with your head down, silent.', { eq: 4, happy: -5 })),
      O('在社交媒体上替爸妈说话|Defend your parents online', R('你的发言被转发了上百万次，有人骂，也有人心疼你。|Your post was shared a million times — some attacked you, some felt for you.', { fame: 6, happy: -3, par: 6 })),
      O('请假在家，不看手机|Stay home and stay offline', R('一周后，热搜换了别人。|A week later, someone else was trending.', { happy: -2, health: 1, smarts: 1 }))
    ], { bad: 1, cd: 99 }),
    IE('ce_nepo', 'celebrity', [16, 26], '“星二代”|"Nepo Baby"', '🌟', '你去试镜，还没开口，导演就笑了：“你爸妈打过招呼了。”网友说你是靠爸妈的“星二代”。|At an audition the director smiles before you speak: "Your parents already called." Online, you\'re the nepo baby.', [
      O('拒绝特殊照顾，从龙套做起|Refuse special treatment and start as an extra', R('三年后，你凭一部小成本电影拿了新人奖，没人再说你靠爸妈。|Three years later you won best newcomer for a tiny film; nobody called you a nepo baby again.', { fame: 6, eq: 4, happy: 3 })),
      O('接受安排，先红了再说|Take the help — fame first, worry later', R('你一夜之间成了主角，骂声也一夜之间铺天盖地。|You became a lead overnight — and the abuse arrived overnight too.', { fame: 10, happy: -4 })),
      O('干脆不进娱乐圈|Stay out of showbiz entirely', R('你选了一条和爸妈完全不同的路。|You chose a path nothing like your parents\'.', { happy: 4, smarts: 2, fame: -2 }))
    ], { cd: 99 }),
    /* ===== crime family ===== */
    IE('mf_dinner', 'mafia', [8, 16], '家族聚餐|Family Dinner', '🍝', '周日的家族聚餐，几位“叔叔”脸上都有疤。饭吃到一半，有人把一把枪放在了桌上。|Sunday family dinner. Several "uncles" have scars. Halfway through, someone sets a gun on the table.', [
      O('装作没看见，继续吃面|Pretend not to see and keep eating', R('爸爸满意地点了点头：“这孩子稳。”|Dad nodded approvingly: "Steady kid."', { eq: 3, happy: -3 })),
      O('问那是什么|Ask what that is', R('桌上一下子安静了。妈妈把你带离了餐桌。|The table went silent. Mom led you away.', { smarts: 1, happy: -4, par: -2 })),
      O('偷偷记下每个人说的话|Secretly remember every word', function (c) { c.p.flags.mafiaIntel = 1; H.fx(c, { smarts: 3, karma: -1, happy: -2 }); return '你知道得越来越多了。|You know more and more.'; })
    ], { cd: 99 })
  ]);
})();
