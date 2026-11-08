/* Gray economy careers with their own identities, and what really happens when a child is stolen */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function R3(s) { return s.split(','); }
  /* ---------- gray careers ---------- */
  var GR = G.GRAY = {
    loanshark: { n: '放高利贷|Loan Sharking', i: '💸', r: R3('放贷马仔|Loan Runner,贷款大哥|Loan Shark,地下钱庄老板|Underground Banker,金融“教父”|Shadow Financier'), pay: [30000, 120000, 450000, 1500000], heat: 9, a: 18, y0: 1950 },
    casino: { n: '地下赌场|Underground Casino', i: '🎰', r: R3('荷官|Croupier,看场子的|Floor Boss,赌场老板|Casino Owner,赌王|Gambling King'), pay: [25000, 90000, 380000, 1800000], heat: 10, a: 18, y0: 1950 },
    smuggle: { n: '走私|Smuggling', i: '🚤', r: R3('跑货的|Runner,船老大|Captain,走私商|Smuggler,走私大亨|Smuggling Tycoon'), pay: [35000, 130000, 500000, 2000000], heat: 11, a: 18, y0: 1950 },
    hacker: { n: '黑客|Black-Hat Hacking', i: '💻', r: R3('脚本小子|Script Kiddie,黑客|Hacker,黑客组织骨干|Crew Lead,传说中的黑客|Legendary Hacker'), pay: [20000, 110000, 420000, 1300000], heat: 8, a: 15, y0: 1995, req: function (p) { return p.st.smarts >= 70 || (p.sk && p.sk.code >= 40); }, reqT: '智力70以上或会编程|Smarts 70+ or coding skill' },
    fake: { n: '造假售假|Counterfeit Goods', i: '👜', r: R3('摆摊卖假货的|Street Seller,批发商|Wholesaler,造假工厂老板|Factory Boss,“山寨之王”|King of Knockoffs'), pay: [18000, 70000, 260000, 900000], heat: 6, a: 16, y0: 1980 },
    scalper: { n: '倒票黄牛|Ticket Scalping', i: '🎫', r: R3('黄牛|Scalper,票贩子头目|Scalper Boss,票务“大户”|Ticket Baron,黄牛党老大|Scalping Kingpin'), pay: [12000, 45000, 160000, 500000], heat: 3, a: 16, y0: 1980 },
    tomb: { n: '盗墓|Tomb Raiding', i: '⚱️', r: R3('学徒|Apprentice,摸金校尉|Tomb Raider,盗墓团伙头子|Crew Boss,“南派掌门”|Grand Master'), pay: [20000, 150000, 600000, 2500000], heat: 13, a: 18, y0: 1950, req: function (p) { return ['cn', 'eg', 'it', 'mx', 'gr'].indexOf(p.country) >= 0; }, reqT: '需在有古墓的国家（中国、意大利、墨西哥）|Needs a country with ancient tombs (China, Italy, Mexico)' },
    club: { n: '夜场生意|Nightlife Racket', i: '🪩', r: R3('服务生|Host,夜场经理|Club Manager,夜总会老板|Nightclub Owner,夜场大亨|Nightlife Mogul'), pay: [25000, 85000, 320000, 1100000], heat: 7, a: 18, y0: 1975 },
    collect: { n: '讨债|Debt Collection', i: '🧾', r: R3('收债员|Collector,讨债队长|Crew Chief,讨债公司老板|Agency Boss,“债王”|Debt King'), pay: [22000, 70000, 240000, 800000], heat: 8, a: 18, y0: 1980 },
    fixer: { n: '权钱掮客|Power Broker', i: '🤝', r: R3('跑腿的|Errand Runner,中间人|Middleman,掮客|Fixer,“白手套”|The White Glove'), pay: [40000, 160000, 650000, 2600000], heat: 9, a: 24, y0: 1980, req: function (p) { return p.st.eq >= 65; }, reqT: '情商65以上|EQ 65+' },
    fighter: { n: '地下黑拳|Underground Fighting', i: '🥊', r: R3('陪练|Sparring Partner,黑拳手|Cage Fighter,拳王|Champion,黑拳台老板|Fight Promoter'), pay: [15000, 80000, 280000, 900000], heat: 7, a: 18, y0: 1960, req: function (p) { return (p.h.fit || 0) >= 45 && p.st.health >= 60; }, reqT: '体能45以上、健康60以上|Fitness 45+, health 60+' },
    troll: { n: '网络水军|Troll Farm', i: '🤖', r: R3('水军|Paid Poster,水军头子|Crew Leader,舆情公司老板|“Reputation” Firm Owner,控评之王|King of Narratives'), pay: [10000, 50000, 220000, 750000], heat: 4, a: 16, y0: 2008 }
  };
  G.GRAY_LIST = Object.keys(GR);
  var GY = G.gray = {};
  GY.ok = function (id) { var g = GR[id], p = G.S.p; return p.age >= g.a && G.S.year >= g.y0 && !p.jail && !p.gov && !p.pol && (!g.req || g.req(p)); };
  GY.join = function (id) { var p = G.S.p; p.gray = { id: id, rank: 0, yrs: 0, yr: 0, perf: 50 }; G.inc('gray'); G.major('入行：{n}|Went into {n}', { n: GR[id].n }); };
  GY.title = function () { var g = G.S.p.gray; return g ? GR[g.id].r[g.rank] : ''; };
  GY.income = function () { var g = G.S.p.gray; if (!g) return 0; var G0 = GR[g.id]; return Math.round(G.$w(G0.pay[g.rank]) * G.rf(.55, 1.45) * (.7 + g.perf / 170)); };
  GY.leave = function (why) { var p = G.S.p; if (!p.gray) return; G.major('洗手不干了：{n}|Got out of {n}', { n: GR[p.gray.id].n }); p.flags.exGray = p.gray.id; p.gray = null; };
  GY.tick = function (Q) {
    var S = G.S, p = S.p, g = p.gray; if (!g || p.jail) return;
    g.yrs++; g.yr++; var G0 = GR[g.id];
    g.perf = G.clamp(Math.round(g.perf * .7 + (p.st.eq * .3 + p.st.smarts * .2 + (p.h.fit || 0) * .2 + G.ri(-15, 15)) * .3 + (g.eff || 0) * 6), 0, 100); g.eff = 0;
    G.addStat('heat', G0.heat * (1 + g.rank * .35) * G.rf(.6, 1.3), true);
    if (g.rank < 3 && g.yr >= 2 + g.rank && g.perf >= 50 + g.rank * 8 && G.ch(.35 + g.perf / 300)) { g.rank++; g.yr = 0; G.major('成为{r}|Became {r}', { r: G0.r[g.rank] }); if (g.rank === 3) { G.addStat('fame', 6, true); G.addStat('rep', 10, true); } }
    var bust = (p.h.heat - 25) / 220 + (g.rank >= 2 ? .03 : 0);
    if (G.ch(bust)) Q.push({ id: 'sys_gray_bust' });
    else if (G.ch(.45)) Q.push({ id: G.pick(['g_rival', 'g_snitch', 'g_bigdeal', 'g_cop'].concat(G.EV['g_' + g.id] ? ['g_' + g.id, 'g_' + g.id] : [])) });
  };
  // gray money is "black" income on the books
  var inc = G.money.income;
  G.money.income = function () { var o = inc(); if (G.S.p.gray && !G.S.p.jail) o.black += GY.income(); return o; };
  var title = G.title;
  G.title = function () { var p = G.S.p; if (p.gray && !p.jail && !p.job && !p.gov && !p.fc && !p.mil && !p.pol) return GY.title(); return title(); };
  var gt = G.gang.tick;
  G.gang.tick = function (Q) { gt(Q); GY.tick(Q); };

  /* activities */
  var cat = { id: 'gray', n: '灰色产业|Gray Economy', i: '🕶️', items: [] };
  G.GRAY_LIST.forEach(function (id) {
    var g = GR[id];
    cat.items.push({ id: 'gy_' + id, n: G.L('入行：{n}|Get into {n}', { n: g.n }), i: g.i, e: 20, a: [g.a, 80], era: g.y0,
      if: function () { var p = G.S.p; return !p.gray && G.S.year >= g.y0; },
      lock: function () { var p = G.S.p; if (p.gov || p.pol) return G.L('你身在公门，碰不得这些。|You serve the state — you can\'t touch this.'); if (g.req && !g.req(p)) return G.L('条件不够：{r}|Not qualified: {r}', { r: g.reqT }); return null; },
      run: async function (a) {
        var ok = await G.UI.confirm(G.L(a.n), G.L('来钱快，风险也大：随时可能被抓，案底会跟你一辈子。|Fast money, big risk: you could be arrested any time, and a record follows you for life.'));
        if (!ok) return 'cancel';
        GY.join(id); G.dStart(); G.addStat('karma', -6); G.addStat('heat', 8); var dl = G.dEnd();
        return G.result(a.n, '你成了一名{r}。|You\'re now a {r}.', { r: g.r[0] }, dl, a.i);
      } });
  });
  var bigJob = { id: 'gy_job', n: '干一票大的|Pull a Big Job', i: '💼', e: 25, if: function () { return !!G.S.p.gray; }, run: async function (a) {
    var g = G.S.p.gray, G0 = GR[g.id];
    var game = { hacker: 'math', fighter: 'fight', casino: 'blackjack', tomb: 'memory', smuggle: 'driving', fixer: 'quiz', troll: 'quiz', scalper: 'memory' }[g.id] || 'detective';
    var r = await G.UI.game(game, { name: a.n });
    G.dStart(); G.addStat('heat', 10 + g.rank * 4);
    if (r.win) { var m = Math.round(G.$w(G0.pay[g.rank]) * G.rf(.3, .9)); G.addMoney(m); g.eff += 2; var dl = G.dEnd(); return G.result(a.n, '这一票干得漂亮，到手{m}。|A clean job — you cleared {m}.', { m: G.M(m) }, dl, a.i); }
    G.addStat('heat', 10); G.addStat('health', g.id === 'fighter' ? -12 : -2); var dl2 = G.dEnd();
    return G.result(a.n, '出了岔子，你差点栽进去。|It went sideways — you nearly got caught.', null, dl2, a.i);
  } };
  var payoff = { id: 'gy_pay', n: '打点关系|Grease Some Palms', i: '🧧', e: 10, if: function () { return !!G.S.p.gray && G.S.p.h.heat > 10; }, run: function (a) {
    var m = G.$w(5000 + G.S.p.gray.rank * 15000); if (!G.pay(m)) return 'cancel';
    G.dStart(); G.addStat('heat', -G.ri(12, 25)); G.addStat('karma', -2); var dl = G.dEnd();
    return G.result(a.n, '你花了{m}打点上下，风声小了不少。|You spent {m} on the right people; things cooled down.', { m: G.M(m) }, dl, a.i);
  } };
  var launder = { id: 'gy_wash', n: '洗白资金|Clean Up Your Money', i: '🧼', e: 15, if: function () { return !!G.S.p.gray && G.S.p.money > G.$(20000); }, run: function (a) {
    var p = G.S.p, cut = Math.round(p.money * .12); G.addMoney(-cut);
    G.dStart(); G.addStat('heat', -15); var dl = G.dEnd();
    return G.result(a.n, '你通过几家“正规”公司把钱转了一圈，损耗了{m}，但干净多了。|You routed money through some "legitimate" businesses. It cost {m}, but it\'s much cleaner now.', { m: G.M(cut) }, dl, a.i);
  } };
  var quit = { id: 'gy_quit', n: '金盆洗手|Get Out for Good', i: '🕊️', e: 10, if: function () { return !!G.S.p.gray; }, run: function (a) {
    var g = G.S.p.gray, risky = g.rank >= 2 && G.ch(.35);
    GY.leave(); G.dStart(); G.addStat('karma', 6); var dl = G.dEnd();
    if (risky) { (G.S.pendQ = G.S.pendQ || []).push({ id: 'g_revenge' }); return G.result(a.n, '你宣布退出。有人不太高兴……|You announced you\'re out. Someone isn\'t happy about it...', null, dl, a.i); }
    return G.result(a.n, '你金盆洗手，从此只想过安稳日子。|You washed your hands of it. From now on, a quiet life.', null, dl, a.i);
  } };
  cat.items.push(bigJob, payoff, launder, quit);
  var ci = G.ACT_CATS.map(function (c) { return c.id; }).indexOf('crime');
  G.ACT_CATS.splice(ci < 0 ? G.ACT_CATS.length : ci, 0, cat);

  function gname(c) { var g = c.p.gray; if (!g) return false; c.prm.g = GR[g.id].n; c.prm.r = GR[g.id].r[g.rank]; }
  G.evs([
    { id: 'sys_gray_bust', sys: 1, title: '落网|Busted', icon: '🚨', bad: 1, prep: gname,
      t: '凌晨四点，警察破门而入。你的{g}生意被一锅端了。|At 4 a.m. the police break down the door. Your {g} operation has been rolled up.',
      o: [
        O('认罪|Plead guilty', function (c) { var g = c.p.gray, y = 1 + g.rank * 2 + G.ri(0, 2); var fine = Math.round(Math.max(0, c.p.money) * .5); c.money(-fine); G.gray.leave(); G.crime.jail(y, GR[g.id].n); return '你被没收了一半财产，判了{y}年。|Half your assets were seized; you got {y} years.'.replace('{y}', y).replace('{y}', y); }),
        O('请最好的律师|Hire the best lawyer', async function (c) { var g = c.p.gray, fee = c.$(30000 + g.rank * 60000); c.money(-Math.min(Math.max(0, c.p.money), fee)); var r = await c.game('detective', { name: '庭审|Trial' }); if (r.win && G.ch(.6)) { c.add('heat', -30); return '证据链断了，你被当庭释放！|The evidence fell apart — you walked free!'; } var y = 2 + g.rank * 2 + G.ri(0, 3); G.gray.leave(); G.crime.jail(y, GR[g.id].n); return '律师也救不了你。|Even the lawyer couldn\'t save you.'; }),
        O('供出上线，争取宽大|Flip on your bosses', function (c) { var g = c.p.gray; G.gray.leave(); var y = Math.max(1, g.rank); G.crime.jail(y, GR[g.id].n); c.add('karma', 4); (c.S.pendQ = c.S.pendQ || []).push({ id: 'g_revenge' }); return '你配合调查，只判了几年。但道上的人不会忘记。|You cooperated and got a light sentence. The underworld won\'t forget.'; })
      ] },
    { id: 'g_revenge', sys: 1, title: '旧账|Old Debts', icon: '🔪', bad: 1,
      t: '以前道上的人找上门来：“你以为说不干就能不干？”|Your old associates turn up: "You think you can just walk away?"',
      o: [
        O('花钱消灾|Pay them off', function (c) { var m = Math.round(Math.max(0, c.p.money) * .25); c.money(-m); c.prm.m = G.M(m); return '你给了{m}，他们暂时放过了你。|You paid {m}; they let you be — for now.'; }),
        O('报警寻求保护|Go to the police for protection', RC(.6, '警方介入，他们不敢再来了。|The police stepped in; they never came back.', { stress: 10 }, '你被打断了两根肋骨。|They broke two of your ribs.', { health: -18 })),
        O('硬碰硬|Fight back', async function (c) { var r = await c.game('fight', { name: '火拼|Showdown' }); if (r.win) { c.add('rep', 8); return '你把他们打了回去。|You drove them off.'; } c.add('health', -25); return '你寡不敌众，住进了医院。|You were outnumbered and ended up in hospital.'; })
      ] },
    E('g_rival', [16, 90], '同行抢地盘|A Rival Moves In', '⚔️', '另一伙人开始抢你的{g}生意。|A rival crew is muscling into your {g} business.', [
      O('谈判分地盘|Negotiate a split', RC(.5, '你们划清了地盘，相安无事。|You drew the lines and kept the peace.', { eq: 2 }, '谈崩了，对方放话要你好看。|Talks failed; they swore to make you pay.', { heat: 5, stress: 8 })),
      O('打回去|Hit back', async function (c) { var r = await c.game('fight', { name: '火拼|Turf War' }); if (r.win) { c.p.gray.eff += 2; c.add('heat', 8); c.add('rep', 5); return '你把对方赶出了地盘，名声大振。|You drove them out; your name grew.'; } c.add('health', -15); c.p.gray.perf -= 15; return '你吃了大亏。|You took a beating.'; }),
      O('举报对方|Tip off the police about them', RC(.5, '对方被抓了，你的生意更好了。|They got arrested; your business boomed.', { karma: -3 }, '警察顺藤摸瓜，也盯上了你。|The police followed the trail — to you.', { heat: 20 }))
    ], { bad: 1, rep: 1, cd: 2, if: function (S, p) { return !!p.gray; }, prep: gname }),
    E('g_snitch', [16, 90], '内鬼|A Rat in the Crew', '🐀', '你怀疑手下有人在给警察通风报信。|You suspect someone in your crew is feeding the police.', [
      O('悄悄换掉可疑的人|Quietly cut loose the suspects', R('你清理了队伍，风声小了。|You cleaned house; things quieted down.', { heat: -10 })),
      O('放假消息试探|Plant false info to smoke them out', RC(.55, '内鬼露了馅，被你踢出了团伙。|The rat took the bait and was kicked out.', { heat: -15, eq: 2 }, '你打草惊蛇，警察加快了行动。|You tipped your hand; the police moved faster.', { heat: 15 })),
      O('装作不知道|Pretend not to notice', R('你继续做生意，心里却一直不踏实。|Business as usual — but you never sleep well.', { stress: 10, heat: 5 }))
    ], { bad: 1, rep: 1, cd: 3, if: function (S, p) { return !!p.gray && p.gray.rank >= 1; }, prep: gname }),
    E('g_bigdeal', [16, 90], '一笔大买卖|The Big Score', '💰', '有人找你做一笔{g}的大生意，利润是平时的十倍，风险也是。|Someone offers you a huge {g} deal — ten times the usual profit, and ten times the risk.', [
      O('干！|Do it!', function (c) { var g = c.p.gray, G0 = GR[g.id]; if (G.ch(.55 + g.perf / 400)) { var m = Math.round(G.$w(G0.pay[g.rank]) * G.rf(1.5, 4)); c.money(m); c.add('heat', 15); g.eff += 3; c.prm.m = G.M(m); return '你赚了{m}！|You made {m}!'; } c.add('heat', 30); var l = Math.round(Math.max(0, c.p.money) * .3); c.money(-l); return '这是个圈套！你损失惨重，还被警察盯上了。|It was a setup! You lost big and the police are onto you.'; }),
      O('太冒险了|Too risky', R('你推掉了。|You passed.', {}))
    ], { rep: 1, cd: 2, if: function (S, p) { return !!p.gray; }, prep: gname }),
    E('g_cop', [16, 90], '保护伞|A Cop on the Take', '👮', '一位警官暗示：每年孝敬一笔，就保你平安。|An officer hints: pay him every year and you\'ll stay safe.', [
      O('孝敬|Pay up', function (c) { var m = c.$(15000 + c.p.gray.rank * 20000); if (!c.pay(m)) return '你拿不出这笔钱。|You can\'t afford it.'; c.add('heat', -25); c.p.flags.cop = c.S.year; return '从此你多了一把保护伞。|You now have protection.'; }),
      O('拒绝|Refuse', R('“你会后悔的。”|"You\'ll regret this."', { heat: 10 }))
    ], { rep: 1, cd: 4, if: function (S, p) { return !!p.gray && p.gray.rank >= 1; }, prep: gname }),
    E('g_loanshark', [18, 90], '还不上钱的人|The Debtor', '😰', '一个欠你钱的赌徒跪在你面前，说再逼他就只能去死了。|A gambler who owes you is on his knees, saying if you push him further he\'ll have nowhere left to go.', [
      O('免了他的债|Forgive the debt', R('他磕了三个头走了。你少赚了一笔，却睡得很安稳。|He bowed three times and left. You lost some money but slept well.', { karma: 10, money: -3000 })),
      O('照规矩办|Rules are rules', R('手下把他拖了出去。从那以后，你很少照镜子。|Your men dragged him out. After that, you avoided mirrors.', { karma: -12, money: 3000, heat: 8 })),
      O('给他一份工作抵债|Let him work it off', R('他成了你手下最忠心的人。|He became your most loyal man.', { karma: 4, rep: 3 }))
    ], { bad: 1, if: function (S, p) { return !!p.gray && p.gray.id === 'loanshark'; } }),
    E('g_casino', [18, 90], '豪客|The High Roller', '🎲', '一位挥金如土的豪客在你的赌场里连赢了十把。|A free-spending high roller has won ten hands in a row at your tables.', [
      O('让他赢，下次他会输更多|Let him win — he\'ll lose more later', RC(.6, '他第二天又来了，把赢的全输了回去，还多输了一倍。|He came back the next day and lost it all, and then some.', { money: 20000 }, '他拿着钱再也没出现。|He took the money and never came back.', { money: -15000 })),
      O('查查他是不是出千|Check if he\'s cheating', RC(.5, '果然是个老千！你“处理”了他。|He was cheating! You "handled" it.', { rep: 5, heat: 6 }, '他是清白的，还是个惹不起的人物……|He was clean — and someone you really shouldn\'t have crossed...', { stress: 15, heat: 10 }))
    ], { if: function (S, p) { return !!p.gray && p.gray.id === 'casino'; } }),
    E('g_tomb', [18, 90], '大墓|The Great Tomb', '🏺', '线人说山里发现了一座没被动过的大墓。|An informant says an untouched great tomb has been found in the mountains.', [
      O('带人下去|Go down with the crew', function (c) { if (G.ch(.12)) { c.add('health', -30); return '墓道塌了，你被埋了半天才被挖出来。|A tunnel collapsed; you were buried for hours before they dug you out.'; } var m = c.$(G.ri(5, 40) * 10000); c.money(m); c.add('heat', 25); c.prm.m = G.M(m); return '你们带出了一批国宝级文物，转手卖了{m}。|You brought out national-treasure-grade relics and sold them for {m}.'; }),
      O('良心不安，匿名报给文物局|Conscience pricks — tip off the heritage bureau anonymously', R('考古队进驻，那座墓被完整保护了下来。|Archaeologists moved in and the tomb was preserved intact.', { karma: 15 }))
    ], { if: function (S, p) { return !!p.gray && p.gray.id === 'tomb'; } }),
    E('g_hacker', [15, 90], '悬赏|The Bounty', '🧑‍💻', '一个匿名雇主出高价，让你攻破一家大公司的系统。|An anonymous client offers big money to break into a major corporation\'s systems.', [
      O('接单|Take the job', async function (c) { var r = await c.game('math', { name: '入侵|Breach' }); if (r.win) { var m = c.$(G.ri(5, 30) * 10000); c.money(m); c.add('heat', 20); c.prm.m = G.M(m); return '任务完成，比特币到账：{m}。|Done. Crypto payment received: {m}.'; } c.add('heat', 30); return '你触发了警报，对方安全团队正在追踪你。|You tripped an alarm; their security team is tracing you.'; }),
      O('转做白帽，报告漏洞|Go white-hat and report the flaw', function (c) { c.add('karma', 10); if (G.ch(.5)) { G.gray.leave(); G.career.hire(G.JOB.coder); return '这家公司被你的坦诚打动，直接聘请你做了安全工程师！|The company was so impressed by your honesty it hired you as a security engineer!'; } c.money(c.$(5000)); return '你拿到了一笔漏洞奖金。|You received a bug bounty.'; })
    ], { if: function (S, p) { return !!p.gray && p.gray.id === 'hacker'; } }),
    E('g_fighter', [18, 60], '生死局|The Death Match', '🩸', '有大老板出重金，要看一场没有裁判的比赛。|A rich patron offers a fortune for a fight with no referee.', [
      O('上台|Step into the cage', async function (c) { var r = await c.game('fight', { name: '生死局|No Rules' }); if (r.win) { c.money(c.$(80000)); c.add('fame', 3); c.p.gray.eff += 3; return '你赢了，全场疯狂。|You won. The crowd went wild.'; } c.add('health', -35); return '你被抬下了台，在医院躺了三个月。|You were carried out and spent three months in the hospital.'; }),
      O('不打了|Walk away', R('命比钱重要。|Your life is worth more.', {}))
    ], { if: function (S, p) { return !!p.gray && p.gray.id === 'fighter'; } }),
    E('g_troll', [16, 70], '黑公关订单|The Smear Order', '📱', '一位明星的团队出高价，要你抹黑他的竞争对手。|A celebrity\'s team pays big to smear his rival.', [
      O('接单|Take it', R('热搜刷了三天，对方的代言掉了一半。|It trended for three days; the rival lost half their endorsements.', { money: 15000, karma: -10, heat: 6 })),
      O('拒绝，这次太脏了|Refuse — this one\'s too dirty', R('你推掉了这单。|You turned it down.', { karma: 5 }))
    ], { if: function (S, p) { return !!p.gray && p.gray.id === 'troll'; } }),
    E('g_scalper', [16, 70], '天王演唱会|The Superstar\'s Concert', '🎤', '天王巨星要开演唱会，票一秒售罄，你手里囤了几百张。|A superstar\'s concert sold out in a second — and you\'re sitting on hundreds of tickets.', [
      O('十倍价格卖|Sell at ten times face value', RC(.7, '全部卖光，赚翻了！|Sold out — you made a killing!', { money: 12000, karma: -3 }, '主办方突然实名制验票，票全砸手里了。|The organizer suddenly required ID checks; you were stuck with all of them.', { money: -8000 })),
      O('平价卖给真粉丝|Sell at face value to real fans', R('粉丝们在网上感谢你这个“良心黄牛”。|Fans online thanked you as "the honest scalper."', { karma: 6, fame: 1 }))
    ], { if: function (S, p) { return !!p.gray && p.gray.id === 'scalper'; } }),
    E('g_smuggle', [18, 80], '海关突击|The Customs Raid', '🚢', '线人说海关明天要突击检查你那批货。|A tipster says customs will raid your shipment tomorrow.', [
      O('连夜转移|Move it overnight', RC(.6, '货被你抢先运走了，有惊无险。|You got the goods out just in time.', { stress: 8, money: 10000 }, '路上被截住了，货全没了。|You were stopped on the road and lost everything.', { money: -30000, heat: 15 })),
      O('沉货入海|Dump it in the sea', R('几百万的货沉进了大海，但没人能抓到证据。|A fortune sank into the sea — but there\'s no evidence left.', { money: -20000, heat: -15 })),
      O('找关系疏通|Pull some strings', function (c) { var m = c.$(25000); if (!c.pay(m)) return '你拿不出打点的钱，只能听天由命。|You couldn\'t pay the bribe and had to hope for the best.'; c.add('heat', -5); return '检查走了个过场。|The inspection was just for show.'; })
    ], { bad: 1, if: function (S, p) { return !!p.gray && p.gray.id === 'smuggle'; } }),
    E('g_fake', [18, 80], '打假行动|The Counterfeit Crackdown', '🏷️', '一个大品牌的律师团队开始追查你的工厂。|A luxury brand\'s lawyers have started tracing your factory.', [
      O('关厂换地方|Shut down and move', R('你连夜搬了厂，损失了一批设备。|You moved overnight and lost some equipment.', { money: -15000, heat: -10 })),
      O('转型做正品代工|Go legit as a contract manufacturer', function (c) { c.add('karma', 8); if (G.ch(.4)) { G.gray.leave(); c.money(c.$(40000)); return '你的工艺被一家正规品牌看中，从此洗白上岸！|A real brand liked your craftsmanship — you went legit for good!'; } c.add('heat', 5); return '转型没成功，还暴露了地址。|The pivot failed and exposed your address.'; }),
      O('继续干，赌他们找不到|Keep going and bet they won\'t find you', RC(.5, '风头过去了。|The storm passed.', { money: 15000 }, '律师函和警察一起上门了。|A legal letter and the police arrived together.', { heat: 30 }))
    ], { bad: 1, if: function (S, p) { return !!p.gray && p.gray.id === 'fake'; } }),
    E('g_club', [18, 80], '夜场风波|Trouble at the Club', '🍾', '一位喝醉的富二代在你的场子里砸了几十瓶酒，还打伤了服务员。|A drunk rich kid smashed dozens of bottles in your club and hurt a waiter.', [
      O('让他赔，加倍赔|Make him pay double', RC(.6, '他老爸派人送来了一大笔钱。|His father sent over a fat envelope.', { money: 30000, rep: 3 }, '他老爸来头太大，第二天你的场子就被查了。|His father was too powerful; your club was raided the next day.', { heat: 25, money: -20000 })),
      O('帮服务员报警|Help the waiter call the police', R('你失去了一个“贵客”，却得到了员工的忠心。|You lost a "VIP" but earned your staff\'s loyalty.', { karma: 8, heat: 5 })),
      O('息事宁人，送他回家|Smooth it over and send him home', R('他记住了你的“懂事”，后来带来了一大群朋友。|He remembered your discretion and later brought a whole crowd of friends.', { money: 12000, karma: -4 }))
    ], { if: function (S, p) { return !!p.gray && p.gray.id === 'club'; } }),
    E('g_collect', [18, 80], '老赖|The Deadbeat', '📒', '你要讨的这笔账，欠债的是一位刚失业的单亲妈妈。|The debt you\'re collecting belongs to a single mother who just lost her job.', [
      O('该怎么要就怎么要|Collect like always', R('你拿回了钱，她抱着孩子哭了一夜。|You got the money back. She cried all night holding her child.', { money: 8000, karma: -10 })),
      O('自己垫上，回去交差|Cover it yourself and report it paid', R('你掏了自己的腰包。|You paid it out of your own pocket.', { money: -8000, karma: 12 })),
      O('帮她找了份工作，分期还|Find her a job and set up installments', R('她后来每个月准时还钱，还给你寄过一封感谢信。|She paid on time every month and even sent you a thank-you letter.', { karma: 8, eq: 2 }))
    ], { bad: 1, if: function (S, p) { return !!p.gray && p.gray.id === 'collect'; } }),
    E('g_fixer', [20, 85], '大人物的请求|A Big Shot\'s Request', '🕴️', '一位大人物托你“摆平”一桩丑闻，报酬丰厚。|A powerful figure wants you to make a scandal disappear. The fee is huge.', [
      O('接下这单|Take the job', function (c) { if (G.ch(.65 + c.p.st.eq / 400)) { var m = c.$(G.ri(6, 25) * 10000); c.money(m); c.add('rep', 5); c.prm.m = G.M(m); return '事情办得干干净净，你拿到了{m}，还欠下了一个人情。|It was handled cleanly. You got {m} — and a favor owed.'; } c.add('heat', 30); return '记者先一步拿到了证据，你的名字也上了报纸。|A reporter got the evidence first — your name made the papers too.'; }),
      O('偷偷留一份证据|Keep a copy of the evidence', R('这份证据以后也许能救你的命，也可能要你的命。|That copy might save your life one day — or end it.', { money: 30000, stress: 10, rep: 2 })),
      O('婉拒|Politely decline', R('“有骨气。”他笑了笑，没再说什么。|"Principled," he smiled, and said nothing more.', { eq: 1 }))
    ], { if: function (S, p) { return !!p.gray && p.gray.id === 'fixer'; } })
  ]);

  /* ======================= STOLEN CHILDREN ======================= */
  G.traffick = function () {
    var S = G.S, p = S.p, old = p.name;
    N.rel('father', 'mother').forEach(function (n) { n.rel = 'birthpar'; n.pin = 1; n.searching = 1; n.aff = 90; });
    N.rel('sibling').forEach(function (n) { n.rel = 'kin'; n.kin = 'bsib'; n.pin = 1; });
    N.rel('grand').forEach(function (n) { delete S.npcs[n.id]; });
    N.rel('friend', 'classmate', 'crush').forEach(function (n) { delete S.npcs[n.id]; });
    var cul = p.cul || G.C[p.country].names, sur = G.genSur(cul);
    var f = N.make({ rel: 'father', g: 'm', age: p.age + G.ri(30, 45), sur: sur, job: '农民|Farmer', inc: G.$w(4000), aff: G.ri(10, 50), pers: G.pick(['honest', 'boss', 'cold', 'gentle']) });
    var m = N.make({ rel: 'mother', g: 'f', age: p.age + G.ri(28, 42), job: '农民|Farmer', inc: G.$w(3000), aff: G.ri(20, 60), pers: G.pick(['gentle', 'clingy', 'honest', 'cold']) });
    f.pin = m.pin = 1; f.wealth = m.wealth = G.$(800); f.buyer = m.buyer = 1;
    var giv = G.genGiven(cul, p.g, S.year);
    p.sur = sur; p.giv = giv; p.name = G.mkName(cul, sur, giv, p.g);
    var cs = G.C[p.country].cities || {}, t5 = cs[5] || cs[4];
    if (t5 && t5.length) p.city = G.pick(t5);
    p.tier = 5; p.flags.rich = 0; p.flags.trafficked = { y: S.year, old: old, age: p.age }; p.flags.trauma = 1;
    if (G.school.inSchool() && p.edu.stage !== 'kinder') { p.edu.q = 1; p.edu.perf = Math.max(0, p.edu.perf - 25); }
    G.major('被拐卖|Trafficked');
  };
  var rn2 = N.relName;
  N.relName = function (n) {
    if (n.rel === 'birthpar') return n.g === 'm' ? '亲生父亲|Birth Father' : '亲生母亲|Birth Mother';
    if (n.rel === 'kin' && n.kin === 'bsib') return n.g === 'm' ? '亲生兄弟|Birth Brother' : '亲生姐妹|Birth Sister';
    if ((n.rel === 'father' || n.rel === 'mother') && n.buyer && G.S.p.flags.trafficked) return n.g === 'm' ? '养父|Adoptive Father' : '养母|Adoptive Mother';
    return rn2(n);
  };
  var tit2 = G.title;
  G.title = function () { var p = G.S.p, t = tit2(); if (p.flags.trafficked && !p.flags.trafficked.found && p.age < 18 && !G.school.inSchool()) return '被拐儿童|Stolen Child'; return t; };
  function tf(S, p) { return !!p.flags.trafficked && !p.flags.trafficked.found; }
  function bp() { return N.rel('birthpar').filter(function (n) { return n.alive; }); }
  G.evs([
    E('c_lure', [3, 9], '“带你去找妈妈”|"Let\'s Go Find Mommy"', '🍬', '你在家门口玩，一个和蔼的阿姨蹲下来：“小朋友，阿姨带你去找妈妈好不好？”|Playing outside, a friendly woman crouches down: "Sweetie, shall I take you to your mommy?"', [
      O('跟她走|Go with her', function (c) { if (G.ch(.3)) { H.fx(c, { happy: -5, smarts: 1 }); return '走到巷口，邻居大爷认出了你，一把把你拉了回来。那个阿姨扭头就跑。|At the end of the lane an old neighbor recognized you and yanked you back. The woman ran.'; } G.traffick(); H.fx(c, { happy: -40, health: -8 }); return '你被抱上了一辆面包车，又换了火车。不知过了多少天，你被带到了一个陌生的山村。他们给你取了新名字：{x}。|You were carried into a van, then onto a train. Days later you arrived in an unfamiliar mountain village. They gave you a new name: {x}.'.replace('{x}', G.T(c.p.name)); }),
      O('大声喊“我不认识你！”|Shout "I don\'t know you!"', R('邻居们围了过来，那人慌忙跑了。妈妈后怕得抱着你哭了很久。|Neighbors came running and she fled. Mom held you and cried for a long time.', { smarts: 2, par: 5, happy: -3 })),
      O('跑回家告诉爸妈|Run home and tell your parents', R('爸爸报了警，第二天整条街都贴上了警示。|Dad called the police; the next day warnings were posted up and down the street.', { smarts: 2, eq: 1, happy: -1 }))
    ], { bad: 1, w: .35, if: function (S, p) { return !p.flags.rich && !p.flags.elite && p.tier >= 3 && (p.country === 'cn' || p.country === 'in' || p.country === 'mx' || p.country === 'th' || p.country === 'br') && H.hasPar() && S.year < 2020; } }),
    E('tf_memory', [5, 20], '模糊的记忆|Blurry Memories', '🌫️', '你总梦见一扇红色的门，门口有个人在喊一个名字——好像是你以前的名字。|You keep dreaming of a red door and someone calling a name — your old name, you think.', [
      O('把记得的都写下来|Write down everything you remember', R('你把那扇门、那条街、那个名字都写在了小本子上，藏在床底下。|You wrote down the door, the street, the name, and hid the notebook under your bed.', { smarts: 2, happy: -3, flag: 'tfNotes' })),
      O('逼自己忘掉|Force yourself to forget', R('你告诉自己，现在的家才是家。|You told yourself this is home now.', { happy: 2, eq: -1 }))
    ], { if: tf }),
    E('tf_home', [5, 17], '买来的家|The Bought Family', '🏚️', function (c) { var f = N.rel('father')[0]; return f && f.aff > 30 ? '养父母对你不错，把家里唯一的鸡蛋留给你吃。|Your adoptive parents are kind; they save the only egg for you.' : '养父脾气暴躁，一不顺心就打你，还不许你出村。|Your adoptive father has a vicious temper, beats you, and won\'t let you leave the village.'; }, [
      O('乖乖听话|Do as you\'re told', function (c) { H.par().forEach(function (n) { if (n.buyer) N.addAff(n, 8); }); H.fx(c, { happy: -2, eq: 2 }); return '你学会了看大人的脸色过日子。|You learned to read adults\' moods to survive.'; }),
      O('偷偷攒钱，想逃跑|Secretly save up to run away', function (c) { c.p.flags.tfSave = (c.p.flags.tfSave || 0) + 1; H.fx(c, { smarts: 1, stress: 6 }); return '你把捡来的硬币藏在墙缝里。|You hid scavenged coins in a crack in the wall.'; })
    ], { rep: 1, cd: 3, if: function (S, p) { return tf(S, p) && p.age < 18; } }),
    E('tf_escape', [9, 17], '逃跑|Escape', '🏃', '赶集的日子，看管你的人喝醉了。机会来了。|It\'s market day and your minder is drunk. This is your chance.', [
      O('跑！|Run!', async function (c) { var r = await c.game('sprint', { name: '逃出大山|Out of the Mountains' }); if (r.win && G.ch(.5 + (c.p.flags.tfSave || 0) * .1)) { c.p.flags.trafficked.ran = 1; G.EV.tf_found.o[0].run(c); return '你一路跑到镇上的派出所。警察通过数据库，找到了你的亲生父母！|You ran all the way to the town police station. Through their database, they found your birth parents!'; } H.fx(c, { health: -10, happy: -10 }); H.par().forEach(function (n) { if (n.buyer) N.addAff(n, -20); }); return '你被抓了回来，挨了一顿毒打。|You were caught and badly beaten.'; }),
      O('还不是时候|Not yet', R('你咬着牙，等更好的机会。|You grit your teeth and wait for a better chance.', { stress: 5 }))
    ], { bad: 1, if: function (S, p) { return tf(S, p) && p.age < 18; } }),
    E('tf_poster', [10, 60], '寻人启事|The Missing-Child Poster', '📰', '电视上播放着一则寻人启事，照片里的孩子……和你小时候一模一样。|A missing-child appeal plays on TV. The child in the photo looks exactly like you did.', [
      O('打电话过去|Call the number', function (c) { if (G.ch(.7)) { return G.EV.tf_found.o[0].run(c); } return '电话打不通了，号码已经停机。你哭了一整夜。|The number is disconnected. You cried all night.'; }),
      O('不敢面对|You can\'t face it', R('你关掉了电视，手一直在抖。|You turned off the TV, hands shaking.', { happy: -6 }))
    ], { if: function (S, p) { return tf(S, p) && bp().length > 0; }, era: { g: 1980, cn: 1995 } }),
    E('tf_dna', [18, 70], 'DNA寻亲|A DNA Database', '🧬', '公安推出了寻亲DNA数据库，被拐的人可以免费采血比对。|The police launch a DNA database for trafficked children — free samples.', [
      O('去采血|Give a sample', function (c) { if (bp().length && G.ch(.65)) return G.EV.tf_found.o[0].run(c); return '数据库里暂时没有匹配的人。你每年都会去问一次。|No match yet. You check back every year.'; }),
      O('算了|Forget it', R('也许有些答案，不知道更好。|Maybe some answers are better left unknown.', { eq: 1 }))
    ], { rep: 1, cd: 3, if: tf, era: { g: 2005, cn: 2009 } }),
    { id: 'tf_found', sys: 1, title: '回家|Coming Home', icon: '🏠', good: 1, t: '你找到了亲生父母。|You found your birth parents.',
      o: [O('（团聚）|(Reunion)', function (c) {
        var p = c.p, T0 = p.flags.trafficked; if (!T0) return '';
        T0.found = c.S.year; var B = bp(); B.forEach(function (n) { n.searching = 0; N.addAff(n, 10); });
        H.fx(c, { happy: 25, eq: 3 }); G.major('和亲生父母团聚|Reunited with birth parents');
        G.S.pendQ = G.S.pendQ || []; G.S.pendQ.push({ id: 'tf_choice' });
        return B.length ? G.L('认亲那天，{n}抱着你哭得站都站不稳：“我找了你{y}年……”|On the day you met, {n} held you, sobbing too hard to stand: "I searched for you for {y} years..."', { n: B[0].name, y: c.S.year - T0.y }) : '可惜，亲生父母都已经不在了。|Sadly, both your birth parents had already passed away.';
      })] },
    { id: 'tf_choice', sys: 1, title: '两个家|Two Families', icon: '⚖️', t: '找回了亲生父母，可养你长大的那个家怎么办？|You found your birth family. But what about the family that raised you?',
      o: [
        O('回到亲生父母身边|Return to your birth family', function (c) { var p = c.p; N.rel('father', 'mother').forEach(function (n) { if (n.buyer) { n.rel = 'contact'; n.pin = 0; } }); N.rel('birthpar').forEach(function (n) { n.rel = n.g === 'm' ? 'father' : 'mother'; }); N.all(function (n) { return n.kin === 'bsib'; }).forEach(function (n) { n.rel = 'sibling'; n.kin = null; }); if (p.flags.trafficked.old) { var o = p.flags.trafficked.old; p.name = o; } return '你改回了原来的名字，回到了那扇红色的门前。|You took back your old name and stood once more before that red door.'; }),
        O('两边都认|Keep both families', function (c) { N.rel('birthpar').forEach(function (n) { N.addAff(n, 5); }); c.add('eq', 3); return '你在两个家之间来回奔波，努力对得起每一个人。|You shuttle between two homes, trying to do right by everyone.'; }),
        O('报警追究买家|Report the buyers to the police', function (c) { N.rel('father', 'mother').forEach(function (n) { if (n.buyer) { n.rel = 'contact'; n.job = '服刑中|In Prison'; n.inc = 0; n.aff = -60; } }); N.rel('birthpar').forEach(function (n) { n.rel = n.g === 'm' ? 'father' : 'mother'; }); c.add('karma', 6); c.add('happy', -5); return '买家被判了刑。法庭上，养母一直在看你，你没有回头。|The buyers were convicted. In court your adoptive mother kept looking at you; you didn\'t look back.'; })
      ] },
    E('tf_trauma', [8, 40], '噩梦|Nightmares', '🌙', '你又梦见了那辆面包车。醒来时浑身是汗。|You dreamed of the van again and woke drenched in sweat.', [
      O('去看心理医生|See a therapist', R('慢慢地，噩梦少了。|Slowly, the nightmares faded.', { happy: 6, stress: -15, money: -600, flag: 'healed' })),
      O('一个人扛|Bear it alone', R('你学会了和黑暗共处，但很少真正开心过。|You learned to live with the dark, but were rarely truly happy.', { happy: -6, eq: 2 }))
    ], { bad: 1, rep: 1, cd: 4, if: function (S, p) { return p.flags.trauma && !p.flags.healed; } })
  ]);
  // ransom kidnapping now leaves a mark too
  var kid = G.EV.c_kidnap;
  if (kid) kid.o.forEach(function (o) { var r = o.run; o.run = async function (c) { var t = await r(c); c.p.flags.trauma = 1; c.p.flags.guarded = 1; return t; }; });
  // the old "stranger with candy" can now really end in a stolen childhood
  (function () {
    var d = G.EV.c_stranger, o = d && d.o && d.o[2];
    if (!o) return;
    o.run = function (c) {
      var p = c.p, can = p.age <= 11 && !p.flags.trafficked && !p.flags.guarded && H.hasPar() && p.tier >= 2 && !p.flags.rich && !p.flags.elite;
      if (can && G.ch(.4)) { G.traffick(); H.fx(c, { happy: -35, health: -6 }); return '他没有带你去买糖，而是把你塞进了一辆车。等你醒来，已经在一个陌生的村子里，有人逼你叫他们“爸爸妈妈”。|He didn\'t take you for candy — he shoved you into a car. When you woke up you were in a strange village, and strangers made you call them "Mom" and "Dad."'; }
      H.fx(c, { happy: -10, smarts: 1 }); N.rel('father', 'mother').forEach(function (n) { N.addAff(n, -2); });
      return '幸好一位警察叔叔认出了你，把你送回了家。|Luckily a police officer recognized you and brought you home.';
    };
  })();
})();
