/* Batch 8: potential fixed at birth (SSS … D) that shapes schooling and pay; one heir to a throne,
   chosen by you; real layoffs you fix yourself; adopted children named as such; and new stories. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC, FA = G.family, LO = G.love;
  function S() { return G.S; }

  /* ================= potential: decided at birth, never changes ================= */
  G.potGrade = function (v) { return v >= 97 ? 'SSS' : v >= 92 ? 'SS' : v >= 85 ? 'S' : v >= 72 ? 'A' : v >= 58 ? 'B' : v >= 45 ? 'C' : 'D'; };
  function seedPot(k, genes) {
    var v = Math.round(genes * .45 + G.ri(10, 52) + (G.ch(.04) ? 15 : 0));
    k.pot = G.clamp(v, 5, 99); return k.pot;
  }
  G.kidScore = function (k) {
    if (k.pot == null) { // children born before this version: read it once from who they already are, then it stays
      var v = (k.smarts || 50) * .45 + (k.eq || 50) * .2 + (k.health || 70) * .08 + (k.looks || 50) * .07 + G.ri(0, 18);
      k.pot = G.clamp(Math.round(v), 5, 99);
    }
    return { v: k.pot, g: G.potGrade(k.pot) };
  };
  var baby8 = LO.baby;
  LO.baby = async function (other, adopted) {
    var k = await baby8.apply(this, arguments);
    if (k && k.pot == null) { var p = S().p; seedPot(k, adopted ? G.ri(35, 75) : ((p.st.smarts || 50) + (other ? (other.smarts || 50) : 50)) / 2 + (G.has('genius') ? 8 : 0)); }
    return k;
  };
  var grow8 = FA.growKid;
  FA.growKid = function (k, Q) {
    var r = grow8.apply(this, arguments);
    if (!k || !k.alive) return r;
    var pot = G.kidScore(k).v, a = N.age(k);
    // potential pulls learning along — and decides how far a career can go
    if (a < 23) { k.smarts = G.clamp((k.smarts || 50) + (pot - 55) / 90, 1, 100); if (k.edu) k.edu.perf = G.clamp((k.edu.perf || 50) + (pot - 55) / 30, 0, 100); }
    var base = k.jobBase || k.jobT;
    if (base && !k.unemp && k.inc > 0 && k.potJob !== base) { k.potJob = base; k.inc = Math.round(k.inc * (.7 + pot / 160)); }
    // a monarch is a monarch — no day job
    if (k.crowned) { k.job = k.g === 'm' ? '国王|King' : '女王|Queen'; k.jobBase = null; k.jobT = null; k.jr = 0; k.unemp = 0; k.neet = 0; k.inc = Math.max(k.inc || 0, G.$w(2e6, k.c)); }
    return r;
  };

  /* ================= one heir to a throne, chosen by you ================= */
  function crown(k, line) {
    var s = S();
    k.crowned = 1; k.crownY = s.year; k.c = line; k.cits = [line]; k.visa = {}; k.studyIn = null;
    k.job = k.g === 'm' ? '国王|King' : '女王|Queen'; k.jobBase = null; k.jobT = null; k.jr = 0; k.unemp = 0; k.neet = 0;
    k.inc = G.$w(2e6, line); k.wealth = (k.wealth || 0) + G.$(5e7); k.tags = ['royal'];
    (k.kids || []).forEach(function (id) { var g = s.npcs[id]; if (g) { g.tags = ['royal']; g.c = line; g.cits = [line]; } });
    var sp = k.spouseId && s.npcs[k.spouseId]; if (sp) { sp.c = line; sp.tags = ['royal']; }
  }
  G.evs([
    { id: 'k_throne', sys: 1, title: '王位的召唤|The Throne Calls', icon: '👑',
      prep: function (c) {
        var k = c.npc, p = c.p; if (!k || !k.royalLine) return false;
        var line = k.royalLine; p.flags.throneLine = p.flags.throneLine || {}; if (p.flags.throneLine[line]) return false;
        c.line = line; c.cands = N.rel('child').filter(function (x) { return x.alive && x.royalLine === line && N.age(x) >= 18 && !x.crowned && !x.illegit && !x.adopted; }).sort(function (a, b) { return G.kidScore(b).v - G.kidScore(a).v; });
        if (!c.cands.length) return false;
        c.prm.c = G.C[line] ? G.C[line].n : '';
      },
      t: '{c}王室传来消息：王位后继无人。你的孩子身上流着王室的血，王室请你从中推举一位继承人——只能是一个。|Word from the royal house of {c}: there is no heir. Your children carry royal blood, and the palace asks you to put forward one successor — only one.',
      o: [
        { t: '亲自挑选最合适的继承人|Choose the heir yourself', run: async function (c) {
          var i = await G.UI.pick({ title: G.L('谁来继承王位？|Who will take the throne?'), items: c.cands.map(function (k) { var sc = G.kidScore(k); return { t: k.name, sub: G.L('潜力{g} · {a}岁 · {j}|Potential {g} · age {a} · {j}', { g: sc.g, a: N.age(k), j: k.job || '—' }), npc: k }; }) });
          if (i < 0) i = 0;
          var k = c.cands[i]; c.p.flags.throneLine[c.line] = k.id; crown(k, c.line);
          c.cands.forEach(function (o) { if (o !== k) { o.royalLine = null; N.addAff(o, o.pers === 'proud' ? -12 : -4); } });
          N.addAff(k, 15); c.add('fame', 10); G.major('{n}登基|{n} took the throne', { n: k.name });
          c.prm.n = k.name;
          return '加冕礼那天，{n}换上了{c}的国籍，放弃了其他所有护照。你坐在第一排，哭得像个孩子。|On coronation day {n} took {c} citizenship and gave up every other passport. You sat in the front row and cried like a child.';
        } },
        { t: '替孩子们放弃继承权|Renounce the claim for your children', run: function (c) { c.p.flags.throneLine[c.line] = -1; c.cands.forEach(function (k) { k.royalLine = null; }); return '你回信谢绝了。孩子们会过普通人的日子。|You wrote back declining. Your children will live ordinary lives.'; } }
      ] }
  ]);
  var ft8 = FA.tick;
  FA.tick = function (Q) {
    var r = ft8.apply(this, arguments), s = S(), p = s.p;
    // repair lives where two children were crowned for the same throne: the stronger one keeps it
    var byLine = {};
    N.rel('child').forEach(function (k) { if (k.crowned) { var l = k.c || 'x'; (byLine[l] = byLine[l] || []).push(k); } });
    Object.keys(byLine).forEach(function (l) {
      var L = byLine[l]; if (L.length < 2) return;
      L.sort(function (a, b) { return G.kidScore(b).v - G.kidScore(a).v; });
      L.slice(1).forEach(function (k) { k.crowned = 0; k.royalLine = null; k.job = k.g === 'm' ? '亲王|Prince' : '公主|Princess'; k.inc = G.$w(200000, k.c); });
      p.flags.throneLine = p.flags.throneLine || {}; p.flags.throneLine[l] = L[0].id;
    });
    return r;
  };

  /* ================= names: adopted, royal grandchildren ================= */
  var rn8 = N.relName;
  N.relName = function (n) {
    var s = S();
    if (n && n.rel === 'child' && n.adopted) return n.g === 'm' ? '养子（领养）|Adopted Son' : '养女（领养）|Adopted Daughter';
    if (n && n.rel === 'grandchild' && s) { var par = N.rel('child').filter(function (k) { return (k.kids || []).indexOf(n.id) >= 0; })[0]; if (par && par.crowned) { var kn = String(par.name).split('|'); return (n.g === 'm' ? '王子' : '公主') + '（' + kn[0] + '的孩子）|' + (n.g === 'm' ? 'Prince' : 'Princess') + ' (' + (kn[1] || kn[0]) + '\'s child)'; } }
    return rn8.apply(this, arguments);
  };
  var info8 = G.npcInfo;
  G.npcInfo = function (n) {
    var r = info8.apply(this, arguments) || [];
    r = r.filter(function (x) { return x[0] !== '综合潜力|Potential'; });
    if (n.rel === 'child' && n.alive) { var sc = G.kidScore(n); r.push(['天生潜力|Born potential', sc.g + ' · ' + sc.v + G.T('（出生就定下，影响升学和收入）| (set at birth; shapes schooling and pay)')]); }
    if (n.rel === 'child' && n.unemp && n.laidY) r.push(['工作状态|Work status', G.L('{y}年从“{j}”被裁员，正在找工作|Laid off from "{j}" in {y}; looking for work', { y: n.laidY, j: G.T(n.lastJob || '—') })]);
    if (n.rel === 'child' && n.adopted) r.push(['身世|Origins', '领养|Adopted']);
    return r;
  };

  /* ================= a real layoff, and you find the job yourself ================= */
  var LJ = [['初级|Junior ', .85], ['|', 1], ['高级|Senior ', 1.25]];
  var JOBS = [['销售经理|Sales Manager', 52000, 0], ['会计|Accountant', 48000, 4], ['工程师|Engineer', 70000, 4], ['产品经理|Product Manager', 80000, 4], ['教师|Teacher', 42000, 4], ['行政主管|Office Manager', 45000, 3], ['数据分析师|Data Analyst', 75000, 4], ['研究员|Researcher', 82000, 5], ['医生|Doctor', 120000, 5], ['店长|Store Manager', 40000, 0]];
  function offers(k) {
    var deg = k.edu ? (k.edu.deg || 0) : 0, pot = G.kidScore(k).v;
    return G.shuffle(JOBS.filter(function (j) { return deg >= j[2]; })).slice(0, 4).map(function (j) {
      var lv = pot >= 85 ? 2 : pot >= 58 ? 1 : 0, z = String(j[0]).split('|'), pre = String(LJ[lv][0]).split('|');
      return { t: pre[0] + z[0] + '|' + pre[1] + z[1], pay: Math.round(j[1] * LJ[lv][1]), ch: G.clamp(.45 + (k.smarts || 50) / 250 + pot / 400, .3, .95) };
    });
  }
  G.findKidJob = async function (k) {
    var p = S().p, L = offers(k);
    var items = L.map(function (o) { return { t: o.t, sub: G.L('年薪约{m} · 成功率{c}%|About {m} a year · {c}% chance', { m: G.M(G.$w(o.pay, k.c)), c: Math.round(o.ch * 100) }), icon: '💼' }; });
    if (S().assets.company) items.push({ t: G.L('来我的公司上班|Join my company'), sub: G.L('稳当，但别人会说闲话|Safe — but people will talk'), icon: '🏢' });
    var i = await G.UI.pick({ title: G.L('帮{n}找工作|Find {n} a Job', { n: k.name }), text: G.L('你翻遍招聘网站，帮{n}投了简历，也陪{h}去面试。|You combed the job sites, sent out {n}\'s résumé and went along to interviews.', { n: k.name, h: k.g === 'm' ? '他|him' : '她|her' }), items: items });
    if (i < 0) return null;
    if (i >= L.length) { k.jobBase = '家族企业经理|Family Firm Manager'; k.jobT = k.jobBase; k.jr = 0; k.jy = 0; k.unemp = 0; k.inc = G.$w(90000, k.c); k.job = k.jobBase; k.laidY = null; return G.L('{n}进了你的公司。|{n} joined your company.', { n: k.name }); }
    var o = L[i];
    if (!G.ch(o.ch)) return G.L('面试官说“我们会再联系你”，然后再也没有联系。|The interviewer said "we\'ll be in touch" — and never was.');
    k.jobBase = o.t; k.jobT = o.t; k.jr = 0; k.jy = 0; k.unemp = 0; k.neet = 0; k.inc = G.$w(o.pay, k.c); k.job = o.t; k.laidY = null; k.potJob = o.t;
    N.addAff(k, 10); if (G.npcStory) G.npcStory(k, '{n}找到了新工作：{j}。|{n} found a new job: {j}.', { n: k.name, j: o.t });
    return G.L('{n}拿到了offer：{j}。|{n} got the offer: {j}.', { n: k.name, j: o.t });
  };
  if (G.EV.k_laidoff) {
    var lo = G.EV.k_laidoff;
    lo.prep = function (c) { var k = c.npc; if (!k || !k.alive || !k.unemp) return false; c.prm.n = k.name; c.prm.j = k.lastJob || '工作|job'; };
    lo.t = '{n}打来电话，声音有点哑：“公司裁员，我被裁了。”{n}的工作状态已经变成了“被裁员·找工作中”。|{n} calls, voice hoarse: "The company had layoffs. I\'m out." {n} is now listed as laid off and job hunting.';
    lo.o = lo.o.filter(function (o) { return !/动用人脉/.test(String(o.t)); });
    lo.o.splice(1, 0, { t: '我亲自帮TA找工作|I\'ll find them a job myself', run: async function (c) { G.dPush('aff', N.addAff(c.npc, 6)); var r = await G.findKidJob(c.npc); return r || '你决定先让{n}休息一阵。|You decided to let {n} rest for a while.'; } });
  }
  var acts8 = G.npcActs;
  G.npcActs = function (n) {
    var L = acts8.apply(this, arguments) || [];
    if (n.rel === 'child' && n.alive && n.unemp && N.age(n) >= 18 && !n.neet) L.unshift({ id: 'kfindjob', n: '帮TA找工作|Help Them Find a Job', i: '💼', e: 0, run: async function (k, a) { var r = await G.findKidJob(k); return r ? { t: r } : 'cancel'; } });
    return L;
  };

  /* ================= new stories ================= */
  function setN(c, n) { c.npc = n; c.prm.n = n.name; var pr = G.pr ? G.pr(n.g) : {}; for (var k in pr) c.prm[k] = pr[k]; }
  function par70() { return H.par().filter(function (n) { return N.age(n) >= 70; })[0]; }
  G.evs([
    E('c_first_snow', [3, 8], '第一场雪|First Snow', '☃️', '早上拉开窗帘，整个世界都白了。|You pull back the curtains in the morning and the whole world has turned white.', [
      O('冲出去堆雪人|Run out and build a snowman', R('你给雪人戴上了爸爸的帽子，被追着跑了半条街。|You gave the snowman Dad\'s hat and got chased halfway down the street.', { happy: 8, health: 1 })),
      O('躺在雪地里画天使|Lie down and make snow angels', R('雪钻进了领口，你笑得停不下来。|Snow got down your collar and you couldn\'t stop laughing.', { happy: 7 })),
      O('趴在窗边看|Watch from the window', R('你看了一上午，直到雪把脚印都盖住。|You watched all morning until the snow covered every footprint.', { happy: 4, smarts: 1 }))
    ], { if: function (S2, p) { return ['th', 'sg', 'in', 'za', 'br', 'mx', 'au'].indexOf(p.country) < 0; } }),
    E('t_summer_job', [15, 18], '第一份暑期工|First Summer Job', '🧋', '奶茶店门口贴着“招暑期工”。|A sign on the bubble tea shop says "Summer help wanted".', [
      O('去应聘|Apply', function (c) { var m = c.$(G.ri(6, 12) * 100); c.money(m); H.fx(c, { eq: 3, happy: 3 }); c.prm.m = G.M(m); return '一个暑假摇了几千杯奶茶，赚了{m}。第一次花自己挣的钱，感觉不一样。|A summer of shaking a thousand drinks earned you {m}. Spending money you earned yourself felt different.'; }),
      O('暑假要用来玩|Summer is for fun', R('你和朋友们在河边度过了整个夏天。|You spent the whole summer by the river with your friends.', { happy: 6 }))
    ], { if: function (S2, p) { return G.famClass ? G.famClass() < 3 : true; } }),
    E('st_abroad_festival', [16, 30], '异国的节日|A Holiday Far from Home', '🏮', '留学的第一个春节（或者感恩节、圣诞节），宿舍楼里只剩下你一个人。|Your first big holiday studying abroad, and you\'re the only one left in the dorm.', [
      O('给家里打视频电话|Video-call home', R('妈妈把手机举到饭桌上，你隔着屏幕“吃”了一顿年夜饭。|Mom held the phone over the dinner table and you "ate" the feast through the screen.', { happy: 5, par: 6 })),
      O('约几个同乡一起包饺子|Gather other students for dumplings', R('饺子包得奇形怪状，但那天你一点都不想家。|The dumplings came out misshapen, but that day you didn\'t feel homesick at all.', { happy: 7, eq: 3 })),
      O('一个人去图书馆|Go to the library alone', R('空荡荡的图书馆里，你把下学期的书都预习了。|In the empty library you read ahead for next semester.', { smarts: 3, happy: -3 }))
    ], { if: function (S2, p) { return G.school.isStudent() && !!(p.edu.abroad || p.flags.studyIn); } }),
    E('a_qingming', [10, 90], '清明回乡|Tomb-Sweeping Day', '🌿', '清明节，家里商量要不要回祖籍扫墓。|It\'s Qingming, and the family is deciding whether to go back to the ancestral home to sweep the graves.', [
      O('回去|Go back', function (c) { H.fx(c, { happy: 4, karma: 2, par: 4 }); c.prm.x = c.p.anc ? c.p.anc.city : ''; return '在{x}的山坡上，你第一次认真读了祖辈墓碑上的字。|On a hillside in {x}, you read your ancestors\' headstones properly for the first time.'; }),
      O('今年太忙，网上祭扫|Too busy — pay respects online', R('你在网上点了一束花。心里有点空。|You clicked to send flowers online. It felt a little hollow.', { happy: -1 }))
    ], { rep: 1, cd: 4, if: function (S2, p) { return p.country === 'cn' && !!p.anc; } }),
    E('a_friend_wedding', [22, 45], '好朋友的婚礼|A Friend\'s Wedding', '💒', '{n}要结婚了，请你当伴郎（伴娘）。|{n} is getting married and wants you in the wedding party.', [
      O('包个大红包，还要上台致辞|A big gift and a speech', function (c) { var m = c.$(G.ri(5, 20) * 100); c.money(-m); H.fx(c, { npc: 12, eq: 2, happy: 4 }); return '你讲到你们俩小时候偷西瓜的事，全场笑翻。{n}抱着你哭了。|You told the story of the two of you stealing watermelons as kids; the room roared, and {n} hugged you in tears.'; }),
      O('人到就好|Just show up', R('你在角落里吃完了整只烤鸭。|You finished an entire roast duck in the corner.', { npc: 4, happy: 2 })),
      O('实在走不开|You really can\'t make it', R('{n}回了一个“没事”。你知道那不是没事。|{n} replied "it\'s fine." You knew it wasn\'t.', { npc: -10 }))
    ], { prep: function (c) { var f = N.rel('friend').filter(function (n) { return n.alive && n.aff >= 45 && N.age(n) >= 22 && !n.married; })[0]; if (!f) return false; setN(c, f); f.married = 1; if (G.npcStory) G.npcStory(f, '{n}结婚了，你当了伴郎（伴娘）。|{n} got married, with you in the wedding party.', { n: f.name }); } }),
    E('a_reunion', [38, 62], '二十年同学会|The 20-Year Reunion', '🍻', '毕业二十年的同学会。有人发了财，有人离了婚，有人没来。|The 20-year class reunion. Some got rich, some got divorced, some didn\'t come.', [
      O('和当年的同桌喝到深夜|Drink with your old deskmate till late', R('“你还记得吗……”这句话你们说了一百遍。|"Remember when…" — you said it a hundred times.', { happy: 6, eq: 2 })),
      O('听大家讲各自的人生|Listen to everyone\'s stories', R('原来每个人都过得不容易。你突然对自己的生活宽容了一点。|It turns out nobody had it easy. You felt a little gentler about your own life.', { happy: 3, karma: 2, eq: 3 })),
      O('借机谈成了一笔生意|Close a deal on the side', function (c) { var m = c.$(G.ri(5, 30) * 1000); c.money(m); c.prm.m = G.M(m); H.fx(c, { happy: 2 }); return '你和当年的班长谈成了合作，赚了{m}。|You struck a deal with the old class monitor and made {m}.'; }, { if: function (c) { return !!c.p.job || !!c.S.assets.company; } })
    ]),
    E('a_midnight_call', [28, 70], '凌晨的电话|The Midnight Call', '📞', '凌晨三点，电话响了：{n}在医院急诊。|At 3 a.m. the phone rings: {n} is in the emergency room.', [
      O('立刻赶过去|Go right now', function (c) { H.fx(c, { npc: 15, health: -2 }); c.npc.health = Math.min(100, (c.npc.health || 50) + 10); return '你在急诊室的走廊上坐到天亮。{n}醒来第一句话是：“你怎么来了。”|You sat in the ER corridor until dawn. The first thing {n} said on waking was "Why did you come?"'; }),
      O('先打钱，天亮再去|Send money now, go at daybreak', function (c) { var m = c.$(G.ri(2, 8) * 1000); c.money(-Math.min(Math.max(0, c.p.money), m)); H.fx(c, { npc: 5 }); return '钱到了，医生开始治疗。你一夜没睡。|The money arrived and treatment began. You didn\'t sleep.'; })
    ], { bad: 1, prep: function (c) { var n = par70(); if (!n) return false; setN(c, n); } }),
    E('o_photo_album', [62, 100], '旧相册|The Old Photo Album', '📷', '收拾柜子的时候，你翻出了一本发黄的相册。|Clearing out a cupboard, you find a yellowed photo album.', [
      O('叫孙辈们过来，一张张讲给他们听|Call the grandchildren and tell them each story', R('孩子们听得入迷，非要你明天接着讲。|The children were spellbound and made you promise to continue tomorrow.', { happy: 8, kids: 4 }), { if: function (c) { return N.rel('grandchild').length > 0 || N.rel('child').length > 0; } }),
      O('一个人慢慢翻|Leaf through it alone', R('翻到最后一页，你发现自己在笑。|By the last page you realized you were smiling.', { happy: 6 })),
      O('拿去扫描存档|Scan it all for the family', R('你把一辈子装进了一个U盘。|You fit a whole life onto a USB stick.', { happy: 3, smarts: 1 }))
    ]),
    E('a_parent_letter', [30, 80], '一封没寄出的信|An Unsent Letter', '✉️', '整理{n}的遗物时，你发现了一封写给你、却从没寄出的信。|Going through {n}\'s things, you find a letter addressed to you that was never sent.', [
      O('打开读|Open it', R('“我从来不太会说，但我一直为你骄傲。”你在地板上坐了很久。|"I never knew how to say it, but I was always proud of you." You sat on the floor for a long time.', { happy: 4, eq: 4 })),
      O('收起来，以后再读|Put it away for later', R('你把信放进了抽屉最里面。|You tucked the letter into the back of the drawer.', { happy: -1 }))
    ], { prep: function (c) { var n = N.rel('father', 'mother').filter(function (x) { return !x.alive; })[0]; if (!n) return false; setN(c, n); } }),
    E('k_prodigy', [7, 17], '天才少年|A Prodigy', '🏆', '{n}在全国竞赛里拿了金牌，记者找上了门。|{n} won gold at a national competition, and reporters are at the door.', [
      O('让{n}接受采访|Let {n} do the interviews', function (c) { H.fx(c, { npc: 6, fame: 3 }); c.npc.fame = (c.npc.fame || 0) + 10; return '第二天，{n}上了报纸。|The next day {n} was in the papers.'; }),
      O('低调，保护孩子|Keep it quiet and protect them', R('你婉拒了所有采访。{n}只想回去继续做题。|You declined every interview. {n} just wanted to get back to the problems.', { npc: 8, karma: 2 }))
    ], { prep: function (c) { var k = N.rel('child').filter(function (x) { return x.alive && N.age(x) >= 7 && N.age(x) <= 17 && G.kidScore(x).v >= 85 && !x.prodigy; })[0]; if (!k) return false; setN(c, k); k.prodigy = 1; } }),
    E('a_headhunter', [28, 55], '猎头的电话|The Headhunter Calls', '📱', '一个猎头打来电话：“有家公司开的薪水，比你现在高三成。”|A headhunter calls: "A company is offering thirty percent more than you make now."', [
      O('跳槽|Take it', function (c) { var j = c.p.job; if (j) { j.sal = Math.round((j.sal || 0) * 1.3); j.perf = Math.max(30, (j.perf || 50) - 10); } H.fx(c, { happy: 4 }); return '新公司、新同事、新的加班表。工资条好看多了。|New company, new colleagues, new overtime rota. The payslip looks much better.'; }),
      O('拿offer跟老板谈加薪|Use it to negotiate a raise', RC(.5, '老板给你加了15%。|Your boss gave you a 15% raise.', { happy: 5, perf: 5 }, '老板说“那你去吧”。你没走，但很尴尬。|Your boss said "then go." You stayed, awkwardly.', { happy: -5 })),
      O('谢谢，不考虑|Thanks, not interested', R('你挂了电话，继续干活。|You hung up and got back to work.', { perf: 2 }))
    ], { if: function (S2, p) { return !!p.job && p.st.smarts >= 55; } }),
    E('a_ex_airport', [28, 65], '机场偶遇|A Chance Meeting at the Airport', '✈️', '登机口前，你看见了{n}——多年不见的前任。|At the gate you spot {n} — the ex you haven\'t seen in years.', [
      O('走过去打招呼|Go over and say hello', R('你们聊了二十分钟，都说“挺好的”。登机的时候，你回头看了一眼。|You talked for twenty minutes; both of you said "I\'m doing fine." Boarding, you looked back once.', { npc: 8, happy: 2 })),
      O('假装没看见|Pretend you didn\'t see', R('你把帽子压低了一点。|You pulled your cap down a little lower.', { happy: -1 }))
    ], { prep: function (c) { var x = N.rel('ex').filter(function (n) { return n.alive; })[0]; if (!x) return false; setN(c, x); } }),
    E('a_trust_pitch', [30, 80], '“稳赚不赔”|"Can\'t Lose"', '🎩', '有人拿着精美的计划书找上门：年化30%，保本保息，“只对熟人开放”。|Someone shows up with a glossy brochure: 30% a year, principal guaranteed, "friends only."', [
      O('投一笔试试|Put some money in', function (c) { var m = Math.round(Math.max(0, c.p.money) * .2); c.money(-m); c.prm.m = G.M(m); if (G.ch(.15)) { c.money(Math.round(m * 1.3)); return '居然真的赚了。你有点不敢相信。|It actually paid out. You can hardly believe it.'; } H.fx(c, { happy: -10 }); return '三个月后，公司人去楼空，你的{m}打了水漂。|Three months later the office was empty, and your {m} was gone.'; }),
      O('报警|Call the police', R('警察说这个团伙已经骗了几百人。你帮了大忙。|The police said this ring had already cheated hundreds. You helped a lot.', { karma: 4, smarts: 1 })),
      O('请他出去|Show them the door', R('天上不会掉馅饼。|There\'s no such thing as a free lunch.', { smarts: 1 }))
    ], { if: function (S2, p) { return G.netWorth() > G.$(200000); } }),
    E('k_royal_visit', [40, 100], '王宫的请柬|An Invitation from the Palace', '🏰', '已经当上君主的{n}请你去王宫住几天。|{n}, now on the throne, invites you to stay at the palace for a few days.', [
      O('去|Go', R('卫兵向你敬礼，孙子孙女们叫你的时候，用的是宫廷礼仪。你有点想笑，又有点想哭。|The guards saluted you, and your grandchildren addressed you with court etiquette. You wanted to laugh, and a little to cry.', { happy: 10, fame: 3, npc: 8 })),
      O('太远了，视频就好|Too far — a video call will do', R('{n}在屏幕那头穿着礼服，冲你眨了眨眼。|On the screen, {n} winked at you in full regalia.', { npc: 3, happy: 3 }))
    ], { prep: function (c) { var k = N.rel('child').filter(function (x) { return x.alive && x.crowned; })[0]; if (!k) return false; setN(c, k); } }),
    E('a_twins_prank', [30, 60], '双胞胎的恶作剧|The Twins\' Prank', '👯', '学校打电话来：{n}和双胞胎{o}互换了身份上课，被老师发现了。|The school calls: {n} and twin {o} swapped places in class, and the teacher found out.', [
      O('严肃批评|Give them a serious talk', R('两个孩子低着头，嘴角却一直在偷笑。|Both kids hung their heads — but couldn\'t stop smirking.', { kids: -2 })),
      O('偷偷觉得好笑|Secretly find it hilarious', R('晚饭的时候，你让他们再表演了一遍。|At dinner you made them perform it again.', { kids: 5, happy: 5 }))
    ], { prep: function (c) { var k = N.rel('child').filter(function (x) { return x.alive && x.twin && N.age(x) >= 6 && N.age(x) <= 15; })[0]; if (!k || !S().npcs[k.twin]) return false; setN(c, k); c.prm.o = S().npcs[k.twin].name; } })
  ]);
})();
