/* All player actions (menus). Each action: {id,n,i,e,$,a:[min,max],if,lock,d,run} */
(function () {
  'use strict';
  var N = G.N;
  function fx(eff) { for (var k in eff) { if (k === 'money') G.addMoney(G.$(eff[k])); else G.addStat(k, eff[k]); } }
  async function quick(a, txt, eff, prm) { G.dStart(); fx(eff || {}); var dl = G.dEnd(); await G.result(a.n, G.pick ? (Array.isArray(txt) ? G.pick(txt) : txt) : txt, prm, dl, a.i); }
  G.quick = quick;
  function age(a, b) { return function () { var x = G.S.p.age; return x >= a && x <= (b || 200); }; }
  function sk(k, n) { var p = G.S.p; p.sk = p.sk || {}; p.sk[k] = G.clamp((p.sk[k] || 0) + n, 0, 100); return p.sk[k]; }
  G.skill = function (k) { var p = G.S.p; return (p.sk && p.sk[k]) || 0; };
  function par() { return N.rel('father', 'mother', 'grand').filter(function (n) { return n.alive; }); }
  function newCandidates(n, o) { var out = []; for (var i = 0; i < n; i++) out.push(N.mkRomantic(Object.assign({ rel: 'contact', love: G.ri(0, 25), aff: G.ri(0, 20) }, o || {}))); return out; }
  async function pickPerson(title, text, list) {
    var items = list.map(function (n) {
      var tags = n.tags.length ? ' · ' + G.T({ rich: '💰富豪|💰Rich', celeb: '🌟明星|🌟Celebrity', red: '🏛️权贵|🏛️Political elite', royal: '👑王室|👑Royal' }[n.tags[0]] || '') : '';
      return { t: n.name, sub: G.L('{a}岁 · {j} · {l}{t}|{a} · {j} · {l}{t}', { a: N.age(n), j: n.job, l: N.looksLabel(n.looks), t: tags }), npc: n };
    });
    var i = await G.UI.pick({ title: title, text: text, items: items });
    if (i < 0) { list.forEach(function (n) { if (!n.pin && n.rel === 'contact' && !n.chat.length) delete G.S.npcs[n.id]; }); return null; }
    var who = list[i]; who.met = G.S.year; N.touch(who);
    list.forEach(function (n) { if (n !== who && !n.pin && !n.chat.length) delete G.S.npcs[n.id]; });
    return who;
  }

  /* ===================== LIFE TAB (status dependent) ===================== */
  G.lifeActs = function () {
    var S = G.S, p = S.p, a = p.age, out = [];
    if (p.jail) return G.ACT_JAIL;
    if (a < 3) return G.ACT_BABY;
    if (p.gang) out = out.concat(G.ACT_GANG);
    if (p.mil) out = out.concat(G.ACT_MIL);
    if (p.pol) out = out.concat(G.ACT_POL);
    if (p.gov) out = out.concat(G.ACT_GOV);
    if (p.fc) out = out.concat(G.ACT_FAME);
    if (p.job) out = out.concat(G.ACT_JOB);
    if (S.assets.company) out = out.concat(G.ACT_BIZ);
    if (G.school.isStudent()) out = (['uni', 'master', 'phd'].indexOf(p.edu.stage) >= 0 ? G.ACT_UNI : G.ACT_SCHOOL).concat(out);
    else if (a < 6) out = G.ACT_KID.concat(out);
    if (p.retired) out = out.concat(G.ACT_RETIRED);
    if (!out.length || (a >= 16 && !p.job && !p.mil && !p.pol && !p.gov && !p.fc && !G.school.isStudent())) out = out.concat(G.ACT_IDLE);
    return out;
  };

  G.ACT_BABY = [
    { id: 'cry', n: '哇哇大哭|Cry Loudly', i: '😭', e: 5, run: function (a) { return quick(a, ['你哭得惊天动地，全家人都围着你转。|You wail so loudly the whole family comes running.', '你哭累了，在妈妈怀里睡着了。|You cry yourself to sleep in Mom\'s arms.'], { happy: 3 }); } },
    { id: 'babble', n: '咿呀学语|Babble', i: '🍼', e: 5, run: function (a) { return quick(a, ['你含糊地喊出了“妈妈”，妈妈激动得哭了。|You mumble "mama," and Mom tears up with joy.', '你冲着窗外的小鸟咿咿呀呀，好像在发表演讲。|You babble at the birds outside like you\'re giving a speech.'], { smarts: 1, eq: 1 }); } },
    { id: 'walk', n: '学走路|Learn to Walk', i: '🚼', e: 5, run: function (a) { return quick(a, ['你摇摇晃晃地迈出了人生第一步！|You wobble and take your very first step!', '你摔了个屁股墩，但又爬起来了。|You plop down on your bum, but get right back up.'], { health: 1 }); } },
    { id: 'cute', n: '卖萌|Be Adorable', i: '🥰', e: 5, run: function (a) { par().forEach(function (n) { N.addAff(n, 3); }); return quick(a, '你冲着大人咯咯笑，大家的心都化了。|You giggle at the grown-ups, and everyone melts.', { happy: 2 }); } }
  ];
  G.ACT_KID = [
    { id: 'play', n: '和小朋友玩|Play with Other Kids', i: '🧸', e: 10, run: function (a) { var f = N.make({ rel: 'friend', age: G.S.p.age + G.ri(-1, 1), aff: 25 }); return quick(a, '你和{n}玩得很开心，成了好朋友。|You had a great time with {n} and became friends.', { happy: 4, eq: 1 }, { n: f.name }); } },
    { id: 'draw', n: '画画|Draw Pictures', i: '🖍️', e: 10, run: function (a) { sk('art', 3); return quick(a, '你画了一幅“全家福”，被爸妈贴在了墙上。|You drew a family portrait; your parents pinned it on the wall.', { happy: 3, smarts: 1 }); } },
    { id: 'tv', n: '看动画片|Watch Cartoons', i: '📺', e: 5, run: function (a) { return quick(a, '你看动画片看得入了迷。|You were glued to the cartoons.', { happy: 4 }); } },
    { id: 'tantrum', n: '撒泼打滚|Throw a Tantrum', i: '😤', e: 5, run: function (a) { par().forEach(function (n) { N.addAff(n, -3); }); return quick(a, ['你在商场里打滚要玩具，最后被拎回了家。|You rolled on the mall floor for a toy and got carried home.', '你哭闹到最后，还是得到了一根棒棒糖。|You fussed until you finally got a lollipop.'], { happy: G.ri(-3, 4) }); } }
  ];
  var EXTRA = [
    { n: '足球比赛|Football Match', i: '⚽', g: 'penalty', st: 'health' },
    { n: '篮球赛|Basketball Game', i: '🏀', g: 'basketball', st: 'health' },
    { n: '运动会|Sports Day', i: '🚦', g: 'sprint', st: 'health' },
    { n: '奥数竞赛|Math Olympiad', i: '🧮', g: 'math', st: 'smarts' },
    { n: '知识竞赛|Quiz Bowl', i: '❓', g: 'quiz', st: 'smarts' },
    { n: '钢琴比赛|Piano Competition', i: '🎹', g: 'rhythm', st: 'eq', sk: 'music' },
    { n: '绘画比赛|Art Contest', i: '🎨', g: 'memory', st: 'looks', sk: 'art' },
    { n: '演讲比赛|Speech Contest', i: '🎤', g: 'quiz', st: 'eq' },
    { n: '小小发明家大赛|Young Inventors Fair', i: '💡', g: 'memory', st: 'smarts' },
    { n: '合唱团|Choir', i: '🎶', g: 'rhythm', st: 'eq', sk: 'music' },
    { n: '编程大赛|Coding Contest', i: '💻', g: 'math', st: 'smarts', sk: 'code', y0: 1985 },
    { n: '动物保护志愿者|Animal Rescue Volunteer', i: '🐶', st: 'eq' },
    { n: '舞蹈比赛|Dance Competition', i: '💃', g: 'rhythm', st: 'looks', sk: 'dance' },
    { n: '电竞社|Esports Club', i: '🎮', g: 'rhythm', st: 'smarts', y0: 2000 }
  ];
  G.EXTRA = EXTRA;
  async function extracurricular(a) {
    var list = EXTRA.filter(function (x) { return !x.y0 || G.S.year >= x.y0; });
    var i = await G.UI.pick({ title: G.L('课外活动|Extracurriculars'), items: list.map(function (x) { return { t: x.n, icon: x.i }; }) });
    if (i < 0) return 'cancel';
    return G.runExtra(list[i]);
  }
  G.runExtra = async function (x) {
    if (!x.g) { G.dStart(); G.addStat('karma', 5); G.addStat('eq', 2); G.addStat('happy', 4); var d0 = G.dEnd(); return G.result(x.n, '你照顾了好多流浪小动物，心里暖暖的。|You cared for lots of stray animals and felt warm inside.', null, d0, x.i); }
    var r = await G.UI.game(x.g, { name: x.n });
    if (x.sk) sk(x.sk, 4);
    G.dStart();
    var txt;
    if (r.score > .8) { G.addStat('fame', 3); G.addStat('happy', 8); G.addStat(x.st, 2); G.S.p.edu.perf += 3; txt = G.L('你在{n}中拿了第一名！奖状挂在了墙上。|You won first place in the {n}! The certificate went up on the wall.', { n: x.n }); G.major('{n}冠军|Won the {n}', { n: x.n }); G.inc('trophies'); }
    else if (r.score > .55) { G.addStat('happy', 5); G.addStat(x.st, 1); txt = G.L('你在{n}中表现不错，拿了个奖。|You did well in the {n} and won a prize.', { n: x.n }); }
    else { G.addStat('happy', -2); txt = G.L('你在{n}中表现一般，下次再努力。|An average showing in the {n}. Next time!', { n: x.n }); }
    var dl = G.dEnd();
    return G.result(x.n, txt, null, dl, x.i);
  }
  G.ACT_SCHOOL = [
    { id: 'study', n: '努力学习|Study Hard', i: '📖', e: 20, run: function (a) { G.S.p.edu.study++; return quick(a, ['你埋头苦读，成绩突飞猛进。|You buried yourself in books, and your grades shot up.', '你刷完了一整本习题集。|You finished an entire workbook.', '你熬夜复习到凌晨。|You studied until the small hours.'], { smarts: 2, perf: G.ri(3, 6), happy: -2, stress: 4 }); } },
    { id: 'slack', n: '上课摸鱼|Goof Off in Class', i: '😴', e: 5, run: function (a) { G.S.p.edu.study -= .5; if (G.ch(.25)) { par().forEach(function (n) { N.addAff(n, -4); }); return quick(a, '你上课睡觉被老师抓到，叫了家长。|The teacher caught you sleeping and called your parents.', { happy: -4 }); } return quick(a, ['你在课本上画了一整节课的漫画。|You doodled comics in your textbook all class.', '你和同桌传了一整节课的纸条。|You passed notes with your deskmate all period.'], { happy: 4 }); } },
    { id: 'skip', n: '逃课|Skip Class', i: '🏃', e: 10, a: [10, 18], run: function (a) { G.S.p.edu.study -= 1; if (G.ch(.35)) { par().forEach(function (n) { N.addAff(n, -8); }); return quick(a, '你逃课去网吧，被爸妈抓了个正着。|You skipped class for the internet café and got caught red-handed.', { happy: -6 }); } return quick(a, ['你翻墙出去玩了一下午，爽！|You hopped the wall and had the afternoon off. Sweet!', '你逃课去游戏厅打了一下午游戏。|You ditched class for the arcade.'], { happy: 7 }); } },
    { id: 'tutor', n: '找家教补课|Get a Tutor', i: '👩‍🏫', e: 15, $: 400, run: function (a) { var t = G.circle.tutorBoost(); G.S.p.edu.study += t.b; return quick(a, t.fresh ? '家里给你请了家教{n}，在“关系”里能找到{h}。|Your family hired {n} as your tutor. Find them under Relationships.' : G.pick(['{n}帮你把薄弱的科目补了上来。|{n} helped you shore up your weak subjects.', '{n}押中了好几道考题！|{n} predicted several exam questions!', '{n}给你讲了一套独家解题思路。|{n} taught you a trick for solving problems.']), { smarts: t.b >= 4 ? 3 : 2, happy: -1 }, { n: t.n.name, h: t.n.g === 'm' ? '他|him' : '她|her' }); } },
    { id: 'friend', n: '结交同学|Make a Friend', i: '🤝', e: 10, run: function (a) { var f = N.make({ rel: 'classmate', age: G.S.p.age + G.ri(-1, 1), aff: G.ri(15, 35) }); return quick(a, '你和同学{n}聊得很投机。|You hit it off with your classmate {n}.', { happy: 3, eq: 1 }, { n: f.name }); } },
  ].concat(EXTRA.map(function (x, k) { return { id: 'ex' + k, n: x.n, i: x.i, e: 15, grp: '🏆 课外活动|🏆 Extracurriculars', if: function () { return !x.y0 || G.S.year >= x.y0; }, run: function () { return G.runExtra(x); } }; })).concat([
    { id: 'monitor', n: '竞选班干部|Run for Class Monitor', i: '🎗️', e: 15, run: function (a) { var ok = G.ch(.2 + G.S.p.st.eq / 150); if (ok) G.S.p.flags.monitor = 1; return quick(a, ok ? '你当选了班长！|You were elected class monitor!' : '你落选了，只差几票。|You lost by a handful of votes.', ok ? { eq: 3, happy: 5 } : { happy: -3 }); } },
    { id: 'cheat', n: '考试作弊|Cheat on a Test', i: '📝', e: 10, a: [8, 30], run: function (a) { if (G.ch(.6)) { return quick(a, '你偷偷抄了答案，没被发现，这次考了个高分。|You copied answers, didn\'t get caught, and scored high.', { perf: G.ri(6, 10), karma: -4, smarts: -1 }); } par().forEach(function (n) { N.addAff(n, -10); }); return quick(a, '作弊被监考老师当场抓获，记了处分！|The proctor caught you cheating; it went on your record!', { perf: -10, happy: -10, karma: -4 }); } },
    { id: 'crush', n: '暗恋/早恋|Crush', i: '💘', e: 10, a: [13, 17], run: async function (a) {
      var cur = G.S.p.flags.crush && G.S.npcs[G.S.p.flags.crush];
      if (cur && cur.alive && ['classmate', 'friend', 'crush'].indexOf(cur.rel) >= 0 && N.canRomance(cur) && G.ch(.75)) {
        var noticed = G.ch(.12 + cur.love / 300 + (G.S.p.st.looks - 50) / 300);
        G.dStart(); G.dPush('love', N.addLove(cur, noticed ? 8 : 3)); N.touch(cur); var dl = G.dEnd();
        var lines = noticed ? ['{n}发现你在看{h}，冲你笑了一下。你的脸瞬间红透了。|{n} caught you looking — and smiled back. Your face went bright red.', '{n}借了你的橡皮，还回来时上面画了个笑脸。|{n} borrowed your eraser and returned it with a smiley face drawn on it.']
          : ['你偷偷看了{n}一整节课。|You stole glances at {n} all class long.', '你在日记本上写满了{n}的名字。|You filled a page of your diary with {n}\'s name.', '你故意绕远路，只为了和{n}同路回家。|You took the long way home just to walk the same route as {n}.', '你想跟{n}打招呼，话到嘴边又咽了回去。|You meant to say hi to {n}, but the words died in your throat.'];
        return G.result(a.n, G.pick(lines), { n: cur.name, h: cur.g === 'm' ? '他|him' : '她|her' }, dl, a.i);
      }
      var cands = N.rel('classmate', 'friend').filter(function (n) { return N.canRomance(n) && n.rel !== 'lover' && (!cur || n !== cur); });
      var n = cands.length && G.ch(.6) ? G.pick(cands) : N.mkRomantic({ rel: 'classmate', love: G.ri(10, 50), aff: 20 });
      G.S.p.flags.crush = n.id; if (n.rel === 'classmate') n.rel = 'crush';
      return G.result(a.n, '你偷偷喜欢上了{n}。去“关系”里找{h}聊聊吧。|You have a secret crush on {n}. Find {h} under "Relationships" and say hi.', { n: n.name, h: n.g === 'm' ? '他|him' : '她|her' }, [], a.i);
    } },
    { id: 'brawl', n: '和人打架|Get in a Fight', i: '👊', e: 15, a: [8, 18], run: async function (a) { var r = await G.UI.game('fight', { name: a.n }); G.dStart(); if (r.win) { G.addStat('rep', 5); G.addStat('happy', 3); } else { G.addStat('health', -6); G.addStat('happy', -5); } G.addStat('karma', -2); var dl = G.dEnd(); return G.result(a.n, r.win ? '你把对方揍趴下了，从此没人敢惹你。|You knocked them flat; nobody messes with you now.' : '你被揍得鼻青脸肿。|You got beaten black and blue.', null, dl, a.i); } },
    { id: 'skipgrade', n: '申请跳级|Skip a Grade', i: '⏩', e: 20, if: function () { var e = G.S.p.edu; return (G.has('prodigy') || G.has('genius')) && e.perf >= 80 && ['primary', 'middle'].indexOf(e.stage) >= 0 && !G.S.p.flags.skipped; }, run: function (a) { var e = G.S.p.edu; G.S.p.flags.skipped = 1; e.grade = Math.min(e.grade + 1, G.school.stageYears() - 1); return quick(a, '学校批准你跳级了！|The school approved your grade skip!', { happy: 6, fame: 2 }); } },
    { id: 'dropout', n: '退学|Drop Out', i: '🚪', e: 5, a: [14, 30], run: async function (a) { var ok = await G.UI.event({ title: G.L(a.n), text: G.L('确定要退学吗？|Are you sure you want to drop out?'), opts: [{ t: G.L('确定|Yes') }, { t: G.L('算了|Never mind') }] }); if (ok) return 'cancel'; G.S.p.edu.stage = 'done'; G.major('退学|Dropped out'); return quick(a, '你收拾书包，离开了学校。|You packed your bag and left school.', { happy: 2 }); } }
  ]);
  G.ACT_UNI = [
    { id: 'ustudy', n: '泡图书馆|Hit the Library', i: '📚', e: 20, run: function (a) { G.S.p.edu.study++; return quick(a, ['你在图书馆从早坐到晚。|You sat in the library from dawn to dusk.', '你的论文得了A。|Your paper got an A.'], { smarts: 2, happy: -1 }); } },
    { id: 'uskip', n: '翘课睡懒觉|Skip Class & Sleep In', i: '🛏️', e: 5, run: function (a) { G.S.p.edu.study -= .5; return quick(a, '你睡到了中午，舒服。|You slept until noon. Bliss.', { happy: 5 }); } },
    { id: 'club', n: '参加社团|Join a Club', i: '🎭', e: 15, run: function (a) { var f = N.make({ rel: 'friend', age: G.S.p.age + G.ri(-1, 2), aff: 30 }); return quick(a, '你加入了社团，认识了{n}。|You joined a club and met {n}.', { eq: 2, happy: 5 }, { n: f.name }); } },
    { id: 'intern', n: '找实习|Do an Internship', i: '🧑‍💼', e: 25, run: function (a) { var p = G.S.p; p.flags.intern = (p.flags.intern || 0) + 1; return quick(a, '你在一家公司实习，积累了不少经验。|You interned at a company and gained real experience.', { smarts: 1, eq: 2, money: 800 }); } },
    { id: 'parttime', n: '找兼职|Find a Part-time Job', i: '🧾', e: 15, run: async function () { await G.career.search(); } },
    { id: 'exchange', n: '出国交换|Study Abroad Exchange', i: '🌏', e: 30, $: 700000, run: function (a) { var c = G.pick(G.CLIST.filter(function (x) { return x !== G.S.p.country; })); var l = G.C[c].lang; if (G.S.p.langs.indexOf(l) < 0 && G.ch(.5)) G.S.p.langs.push(l); G.inc('travel'); return quick(a, '你去{c}交换了一学期，大开眼界。|You spent a semester in {c} and broadened your horizons.', { happy: 10, smarts: 2, eq: 2 }, { c: G.C[c].n }); } },
    { id: 'udrop', n: '退学|Drop Out', i: '🚪', e: 5, run: function (a) { G.S.p.edu.stage = 'done'; G.major('大学退学|Dropped out of university'); return quick(a, '你办了退学手续，决定去闯一闯。|You withdrew from university to go make your own way.', { happy: 3 }); } }
  ];
  G.ACT_JOB = [
    { id: 'work', n: '努力工作|Work Hard', i: '💪', e: 20, run: function (a) { G.S.p.job.eff++; return quick(a, ['你提前完成了项目，老板点了个赞。|You delivered early, and your boss gave you a thumbs-up.', '你主动承担了一个难啃的任务。|You volunteered for a tough assignment.'], { stress: 5, happy: -1 }); } },
    { id: 'overtime', n: '加班|Work Overtime', i: '🌙', e: 25, run: function (a) { var j = G.S.p.job; j.eff += 2; G.S.p.hab.night += 15; return quick(a, '你连续加班到深夜，眼睛都快睁不开了。|You worked late night after night; your eyes can barely stay open.', { stress: 10, health: -2, money: 600 }); } },
    { id: 'fish', n: '上班摸鱼|Slack Off at Work', i: '🐟', e: 5, run: function (a) { var j = G.S.p.job; j.eff -= .5; if (G.ch(.2)) { j.perf -= 8; return quick(a, '摸鱼被老板抓了个正着！|Your boss caught you slacking!', { happy: -5 }); } return quick(a, [G.S.year >= 2010 ? '你在工位上刷了一下午手机。|You scrolled your phone at your desk all afternoon.' : '你在工位上看了一下午报纸。|You read the newspaper at your desk all afternoon.', '你带薪上厕所半小时。|You took a 30-minute paid bathroom break.'], { happy: 4, stress: -4 }); } },
    { id: 'colleague', n: '和同事搞好关系|Bond with Coworkers', i: '🍻', e: 10, run: function (a) { N.rel('colleague', 'boss').forEach(function (n) { N.addAff(n, 5); N.touch(n); }); var y = G.S.year, east = ['cn', 'jp', 'kr', 'sg', 'th'].indexOf(G.S.p.country) >= 0; var treat = G.pick(y >= 2010 && east ? ['喝了奶茶|bubble tea', '吃了下午茶|afternoon snacks', '喝了咖啡|coffee'] : y >= 1995 ? ['喝了咖啡|coffee', '吃了甜甜圈|donuts', '吃了披萨|pizza', '下班喝了一杯|after-work drinks'] : ['吃了水果|fruit', '抽了烟|cigarettes', '下班喝了一杯|after-work drinks', '吃了点心|pastries']); return quick(a, G.L('你请同事们{t}，大家对你印象不错。|You treated everyone to {t}; they like you now.', { t: treat }), { eq: 1, money: -15 }); } },
    { id: 'flatter', n: '拍老板马屁|Suck Up to the Boss', i: '🙇', e: 10, run: function (a) { var j = G.S.p.job; if (G.ch(.5 + G.S.p.st.eq / 300)) { j.perf += 5; return quick(a, '老板被你哄得眉开眼笑。|Your boss beams at your flattery.', { karma: -1 }); } return quick(a, '马屁拍到了马腿上，老板一脸嫌弃。|The flattery backfired; your boss looks disgusted.', { happy: -3 }); } },
    { id: 'raise', n: '要求加薪|Ask for a Raise', i: '💹', e: 10, run: function (a) { var j = G.S.p.job, ch = (j.perf - 40) / 80 + G.S.p.st.eq / 300; if (j.raiseY === G.S.year) return quick(a, '你今年已经提过了。|You already asked this year.', {}); j.raiseY = G.S.year; if (G.ch(ch)) { var inc = Math.round(j.sal * G.rf(.05, .15)); j.sal += inc; return quick(a, '老板同意给你加薪{m}！|Your boss agreed to a {m} raise!', { happy: 6 }, { m: G.M(inc) }); } j.perf -= 3; return quick(a, '老板说“再等等”。|Your boss said, "Let\'s wait a bit."', { happy: -4 }); } },
    { id: 'jobhop', n: '跳槽|Look for a New Job', i: '🔀', e: 15, run: async function () { await G.career.search(); } },
    { id: 'quit', n: '辞职|Quit', i: '👋', e: 5, run: async function (a) { var i = await G.UI.event({ title: G.L(a.n), text: G.L('确定要辞职吗？|Really quit?'), opts: [{ t: G.L('辞职！|Quit!') }, { t: G.L('再想想|Think again') }] }); if (i) return 'cancel'; G.career.leave(); return quick(a, '你潇洒地递上了辞职信。|You handed in your resignation with a flourish.', { happy: 6, stress: -15 }); } }
  ];
  G.ACT_FAME = [
    { id: 'perform', n: '发布作品/演出|Perform / Release Work', i: '🎬', e: 25, run: async function () { await G.fame.perform(); } },
    { id: 'hype', n: '营销炒作|Buy Publicity', i: '📣', e: 10, $: 9000, run: function (a) { var f = G.S.p.fc; if (G.ch(.25)) { f.fans = Math.round(f.fans * .92); return quick(a, '买热搜被扒了出来，网友骂你“营销咖”。|Your paid trending spot was exposed; people call you a fraud.', { fame: -2, happy: -4 }); } var g = Math.round(f.fans * G.rf(.02, .08) + G.ri(100, 800)); f.fans += g; return quick(a, '你买了热搜，粉丝涨了{f}，但大多是僵尸粉。|You bought trending spots and gained {f} fans — mostly bots.', { fame: 1 }, { f: g }); } },
    { id: 'variety', n: '上综艺节目|Go on a Variety Show', i: '📺', e: 20, if: function () { return G.S.p.fc.rank >= 1; }, run: function (a) { var f = G.S.p.fc; if (G.ch(.35)) { f.fans = Math.round(f.fans * .97); return quick(a, '你在节目里被剪成了“反派”，弹幕全在骂你。|The edit made you the villain; the comments tore you apart.', { fame: 1, happy: -6, money: 800 * (f.rank + 1) }); } f.fans = Math.round(f.fans * G.rf(1.02, 1.12)); return quick(a, ['你在综艺里的一句话火遍全网。|One line you said on the show went viral.', '你在节目里被整蛊，观众笑翻了。|You got pranked on the show and audiences loved it.'], { fame: 2, happy: 3, money: 1000 * (f.rank + 1) }); } },
    { id: 'ad', n: '接广告代言|Take an Endorsement', i: '💰', e: 15, if: function () { return G.S.p.fc.rank >= 1; }, run: function (a) { var f = G.S.p.fc, m = Math.round(G.$(2500) * Math.pow(2.6, f.rank) * G.rf(.5, 1.2)); G.addMoney(m); if (G.ch(.12)) { f.fans = Math.round(f.fans * .8); return quick(a, '代言的产品爆雷了，你被骂惨了。|The product you endorsed blew up in scandal; you got slammed.', { fame: -4 }); } return quick(a, '你拿到了{m}代言费。|You earned {m} from the endorsement.', { happy: 3 }, { m: G.M(m) }); } },
    { id: 'fanmeet', n: '粉丝见面会|Fan Meeting', i: '🙋', e: 15, run: function (a) { var f = G.S.p.fc; f.perf += 5; return quick(a, '粉丝们热情地尖叫，你感动得哭了。|Fans screamed with excitement; you were moved to tears.', { happy: 8, fame: 1 }); } },
    { id: 'fquit', n: '退圈|Leave the Industry', i: '🚪', e: 5, run: function (a) { G.major('退出{f}行业|Left the {f} business', { f: G.FAME[G.S.p.fc.id].n }); G.S.p.fc = null; return quick(a, '你宣布退圈，回归普通生活。|You announced your retirement and returned to ordinary life.', { stress: -20 }); } }
  ];
  G.ACT_MIL = [
    { id: 'train', n: '刻苦训练|Train Hard', i: '🏋️', e: 20, run: function (a) { G.S.p.mil.merit += 3; return quick(a, ['你在训练场上挥汗如雨。|You poured sweat on the training ground.', '你的射击成绩全连第一。|You posted the best shooting score in the company.'], { health: 1, fit: 5, stress: 3 }); } },
    { id: 'leave', n: '请假探亲|Take Leave', i: '🏠', e: 15, run: function (a) { par().concat(N.rel('spouse', 'child')).forEach(function (n) { N.addAff(n, 6); N.touch(n); }); return quick(a, '你回家探亲，家人格外高兴。|You went home on leave; your family was overjoyed.', { happy: 8 }); } },
    { id: 'sf', n: '选拔特种部队|Try Out for Special Forces', i: '🦅', e: 30, if: function () { var m = G.S.p.mil; return m.br !== 'sf' && !m.cons; }, run: async function (a) { var r1 = await G.UI.game('sprint', { name: a.n }); var r2 = await G.UI.game('shooting', { name: a.n }); if ((r1.score + r2.score) / 2 + G.S.p.h.fit / 400 > .65) { G.S.p.mil.br = 'sf'; G.S.p.mil.merit += 10; G.major('入选特种部队|Joined the Special Forces'); return G.result(a.n, '你通过了地狱般的选拔，成为特种兵！|You survived hell-week selection and joined the Special Forces!', null, [], a.i); } return G.result(a.n, '你没能通过选拔。|You didn\'t make the cut.', null, [], a.i); } },
    { id: 'discharge', n: '申请退役|Leave the Military', i: '🎒', e: 5, if: function () { return !G.S.p.mil.cons; }, run: function (a) { G.career.retire(); G.S.p.retired = G.S.p.age >= 50; return quick(a, '你脱下军装，回到地方。|You took off the uniform and returned to civilian life.', { happy: 3 }); } }
  ];
  G.ACT_POL = [
    { id: 'patrol', n: '巡逻执勤|Patrol', i: '🚓', e: 15, run: function (a) { G.S.p.pol.merit += 2; return quick(a, ['你在街头巡逻，帮老奶奶找回了走丢的孙子。|On patrol you helped a grandma find her lost grandson.', '你拦下了一个酒驾司机。|You stopped a drunk driver.'], { karma: 2 }); } },
    { id: 'investigate', n: '主动查案|Take on a Case', i: '🔍', e: 20, run: async function (a) { var r = await G.UI.game('detective', {}); var o = G.S.p.pol; if (r.win) { o.merit += 6; o.cases++; G.inc('cases'); return G.result(a.n, '你揪出了真凶！|You found the real culprit!', null, [], a.i); } return G.result(a.n, '线索断了，案子陷入僵局。|The trail went cold.', null, [], a.i); } },
    { id: 'undercover', n: '卧底行动|Go Undercover', i: '🕶️', e: 30, if: function () { return G.S.p.pol.rank >= 1; }, run: async function (a) { var r = await G.UI.game('fight', { name: a.n }); if (G.ch(.06)) { G.die('卧底身份暴露，壮烈牺牲|Killed in the line of duty while undercover'); return; } var o = G.S.p.pol; if (r.score > .45) { o.merit += 15; G.addStat('fame', 3); G.major('卧底行动立功|Decorated for an undercover operation'); return G.result(a.n, '你潜伏数月，一举端掉了整个犯罪团伙！|After months undercover, you brought down the whole ring!', null, [], a.i); } return G.result(a.n, '你差点暴露，只好提前撤出。|You nearly blew your cover and had to pull out.', null, [], a.i); } },
    { id: 'pquit', n: '辞去警职|Resign from the Force', i: '👋', e: 5, run: function (a) { G.S.p.pol = null; return quick(a, '你交回了警徽。|You turned in your badge.', {}); } }
  ];
  G.ACT_GOV = [
    { id: 'gwork', n: '踏实工作|Work Diligently', i: '📋', e: 20, run: function (a) { var g = G.S.p.gov; g.eff = (g.eff || 0) + 1; g.appr = G.clamp(g.appr + 2, 0, 100); return quick(a, ['你把一项棘手的工作办得漂漂亮亮。|You handled a thorny assignment beautifully.', '你连续加班写完了年度报告。|You pulled late nights to finish the annual report.'], { stress: 4 }); } },
    { id: 'survey', n: '下基层调研|Visit the Grassroots', i: '🚶', e: 20, run: function (a) { var g = G.S.p.gov; g.appr = G.clamp(g.appr + G.ri(2, 6), 0, 100); return quick(a, '你走访了很多群众，了解到真实的情况。|You visited many ordinary people and learned how things really are.', { eq: 1, karma: 2 }); } },
    { id: 'network', n: '拉关系|Network', i: '🤝', e: 15, $: 500, run: function (a) { var g = G.S.p.gov; g.perf += 4; return quick(a, '你和几位领导吃了饭，关系近了一步。|You dined with several senior officials and grew closer.', { eq: 1 }); } },
    { id: 'speech', n: '公开演讲|Give a Public Speech', i: '🎙️', e: 20, if: function () { return G.S.p.gov.track === 'poli'; }, run: async function (a) { var r = await G.UI.game('quiz', { name: a.n, debate: 1 }); var g = G.S.p.gov, d = Math.round((r.score - .45) * 16); g.appr = G.clamp(g.appr + d, 0, 100); G.dStart(); G.addStat('fame', r.score > .6 ? 2 : 0); var dl = G.dEnd(); dl.push({ k: 'appr', n: d }); return G.result(a.n, d >= 0 ? '演讲很成功，掌声雷动。|The speech was a hit; thunderous applause.' : '演讲有些失误，被媒体批评。|You stumbled, and the press criticized you.', null, dl, a.i); } },
    { id: 'runhigher', n: '竞选更高职位|Run for Higher Office', i: '🗳️', e: 30, if: function () { var g = G.S.p.gov, L = G.poliLadder(G.S.p.country); return G.C[G.S.p.country].dem && g.track === 'poli' && g.yr >= 3 && g.appr >= 45 && g.rank < L.r.length - 1; }, run: async function (a) { var g = G.S.p.gov, L = G.poliLadder(G.S.p.country), t = g.rank + 1; if (!L.elect[t]) t = Math.min(t + 1, L.r.length - 1); var c = G.ctx(); var old = g.rank; var r = await G.gov.election(c, t); if (G.S.p.gov && G.S.p.gov.rank === old) { g.appr -= 5; } return G.result(a.n, r, null, [], a.i); } },
    { id: 'gquit', n: '辞职|Resign', i: '👋', e: 5, run: function (a) { G.S.p.gov = null; G.major('辞去公职|Resigned from public office'); return quick(a, '你辞去了公职。|You resigned from public office.', { stress: -10 }); } }
  ];
  G.ACT_BIZ = [
    { id: 'manage', n: '亲自管理公司|Run Your Company', i: '🏢', e: 25, run: function (a) { var co = G.S.assets.company; co.eff++; return quick(a, '你泡在公司里，事无巨细都亲自过问。|You lived at the office, overseeing every detail.', { stress: 6 }); } },
    { id: 'invest', n: '追加投资|Invest More', i: '💵', e: 10, run: async function (a) { var co = G.S.assets.company, amt = Math.round(G.S.p.money * .3); if (amt <= 0) return quick(a, '你没有可投的钱。|You have no cash to invest.', {}); G.addMoney(-amt); co.val += Math.round(amt * .85); co.base = Math.max(co.base, co.val * .3); return quick(a, '你向公司注资{m}。|You injected {m} into the company.', {}, { m: G.M(amt) }); } },
    { id: 'raise', n: '融资|Raise Funding', i: '🤝', e: 15, if: function () { return G.S.assets.company.own > .3; }, run: function (a) { var co = G.S.assets.company, cash = Math.round(co.val * .2); co.own *= .8; co.val += cash; return quick(a, '投资人注资{m}，换走了20%的股份。|Investors put in {m} for a 20% stake.', { happy: 3 }, { m: G.M(cash) }); } },
    { id: 'dividend', n: '调整分红|Change Dividend Policy', i: '🪙', e: 5, run: async function (a) { var co = G.S.assets.company; var i = await G.UI.pick({ title: G.L(a.n), items: [{ t: G.L('全部再投资（0%）|Reinvest everything (0%)') }, { t: G.L('适度分红（30%）|Moderate (30%)') }, { t: G.L('大量分红（70%）|Generous (70%)') }] }); if (i < 0) return 'cancel'; co.div = [0, .3, .7][i]; return quick(a, '分红政策已调整。|Dividend policy updated.', {}); } },
    { id: 'sell', n: '出售公司|Sell the Company', i: '🏷️', e: 0, run: async function (a) { var co = G.S.assets.company, cash = Math.round(co.val * co.own * G.rf(.8, 1.1)); var i = await G.UI.event({ title: G.L(a.n), text: G.L('有买家出价{m}，卖吗？|A buyer offers {m}. Sell?', { m: G.M(cash) }), opts: [{ t: G.L('卖！|Sell!') }, { t: G.L('不卖|No') }] }); if (i) return 'cancel'; G.addMoney(cash); G.S.assets.company = null; G.major('出售了{n}|Sold {n}', { n: co.name }); G.inc('exit'); return G.result(a.n, '你卖掉了公司，到手{m}。|You sold the company for {m}.', { m: G.M(cash) }, [], a.i); } }
  ];
  G.ACT_RETIRED = [
    { id: 'dance', n: '跳广场舞|Square Dancing', i: '💃', e: 10, run: function (a) { var f = N.make({ rel: 'friend', age: G.S.p.age + G.ri(-5, 5), aff: 30 }); return quick(a, '你在广场舞队认识了{n}。|You met {n} on the square-dancing team.', { happy: 6, health: 2 }, { n: f.name }); } },
    { id: 'chess', n: '公园下棋|Play Chess in the Park', i: '♟️', e: 10, run: function (a) { return quick(a, ['你连赢了三盘，围观的老头直叫好。|You won three games in a row; the onlookers cheered.', '你输了一下午，气得直拍大腿。|You lost all afternoon and slapped your knee in frustration.'], { happy: 4, smarts: 1 }); } },
    { id: 'grandkid', n: '带孙辈|Babysit the Grandkids', i: '👶', e: 15, if: function () { return N.rel('grandchild').length; }, run: function (a) { N.rel('grandchild').forEach(function (n) { N.addAff(n, 8); N.touch(n); }); return quick(a, '孙辈们围着你叫个不停，你笑得合不拢嘴。|The grandkids crowded around you, and you couldn\'t stop smiling.', { happy: 8 }); } },
    { id: 'memoir', n: '写回忆录|Write a Memoir', i: '✍️', e: 25, run: function (a) { var f = G.S.p.st.fame, m = Math.round(G.$(500) * (1 + f * f / 50)); G.addMoney(m); return quick(a, f > 40 ? '你的回忆录成了畅销书！|Your memoir became a bestseller!' : '你的回忆录在亲友间传阅。|Your memoir circulated among family and friends.', { fame: f > 40 ? 3 : 1, happy: 5 }); } }
  ];
  G.ACT_IDLE = [
    { id: 'jobsearch', n: '找工作|Look for a Job', i: '🔎', e: 15, a: [15, 75], run: async function () { await G.career.search(); } },
    { id: 'mooch', n: '向父母要钱|Ask Parents for Money', i: '🙏', e: 5, if: function () { return par().length; }, run: function (a) { var ps = par().filter(function (n) { return n.wealth > 0; }); if (!ps.length) return quick(a, '家里也没钱了。|Your family is broke too.', {}); var n = G.pick(ps), m = Math.round(Math.min(n.wealth * .05, G.$(2000)) * (n.aff + 30) / 100); if (m <= 0 || n.aff < 0) return quick(a, '{n}拒绝了你。|{n} refused.', { happy: -3 }, { n: n.name }); n.wealth -= m; G.addMoney(m); N.addAff(n, -3); return quick(a, '{n}叹了口气，给了你{m}。|{n} sighed and gave you {m}.', {}, { n: n.name, m: G.M(m) }); } },
    { id: 'reexam', n: '重新参加高考|Retake the University Exam', i: '📝', e: 30, a: [18, 40], if: function () { var e = G.S.p.edu; return e.deg === 3 && !G.school.isStudent(); }, run: async function (a) { var c = G.ctx(); var r = await G.UI.game('exam', { name: G.eduSys(G.S.p.country).ue }); var t = await G.school.uniFlow(c, G.school.examScore(r.score)); return G.result(a.n, t, null, [], a.i); } },
    { id: 'gradexam', n: '报考研究生|Apply to Grad School', i: '🎓', e: 30, a: [21, 50], if: function () { var e = G.S.p.edu; return (e.deg === 4 || e.deg === 5) && !G.school.isStudent(); }, run: async function (a) { var r = await G.UI.game('exam', { name: '研究生考试|Graduate Exam' }); var e = G.S.p.edu, sc = G.school.examScore(r.score); if (sc >= 58) { e.stage = e.deg === 4 ? 'master' : 'phd'; e.grade = 0; if (G.S.p.job) G.career.leave(); return G.result(a.n, '你被录取了，重返校园！|You were admitted — back to campus!', null, [], a.i); } return G.result(a.n, '没考上。|You didn\'t make it.', null, [], a.i); } }
  ];
  G.ACT_JAIL = [
    { id: 'jgym', n: '放风锻炼|Exercise in the Yard', i: '🏋️', e: 15, run: function (a) { G.S.p.jail.beh += 2; return quick(a, '你在操场上做了一千个俯卧撑。|You did a thousand push-ups in the yard.', { health: 2, fit: 5 }); } },
    { id: 'jread', n: '在图书室读书|Read in the Library', i: '📖', e: 15, run: function (a) { G.S.p.jail.beh += 3; return quick(a, '你读完了一本厚厚的书。|You finished a thick book.', { smarts: 2, happy: 1 }); } },
    { id: 'jwork', n: '狱中劳动|Prison Labor', i: '🧵', e: 20, run: function (a) { G.S.p.jail.beh += 5; return quick(a, '你在车间里踩了一整天缝纫机。|You worked the sewing machine all day.', { money: 30 }); } },
    { id: 'jfriend', n: '结交狱友|Befriend an Inmate', i: '🤝', e: 10, run: function (a) { var n = N.make({ rel: 'inmate', g: G.S.p.g, age: G.ri(20, 60), job: '囚犯|Inmate', aff: 25, pers: G.pick(['boss', 'rebel', 'honest', 'scheme']) }); return quick(a, '你和{n}成了朋友。|You befriended {n}.', { eq: 1 }, { n: n.name }); } },
    { id: 'jfight', n: '和狱霸打架|Fight the Yard Bully', i: '👊', e: 15, run: async function (a) { var r = await G.UI.game('fight', { name: a.n, hard: 1 }); var j = G.S.p.jail; j.beh -= 10; G.dStart(); if (r.win) { G.addStat('rep', 10); } else G.addStat('health', -12); var dl = G.dEnd(); if (G.ch(.4)) { j.left += 1; return G.result(a.n, '你被关了禁闭，刑期加了一年。|You went to solitary and got a year added.', null, dl, a.i); } return G.result(a.n, r.win ? '你打赢了，没人再敢惹你。|You won; no one messes with you now.' : '你被揍得很惨。|You got beaten badly.', null, dl, a.i); } },
    { id: 'jparole', n: '申请减刑|Apply for Reduced Sentence', i: '📝', e: 10, run: function (a) { var j = G.S.p.jail; if (j.beh >= 70 && G.ch(.4)) { j.left = Math.max(0, j.left - 1); return quick(a, '你表现良好，获得减刑一年！|For good behavior, your sentence was reduced by a year!', { happy: 8 }); } return quick(a, '申请被驳回了。|Your application was denied.', { happy: -2 }); } },
    { id: 'escape', n: '越狱|Escape', i: '🕳️', e: 40, run: async function (a) { var r = await G.UI.game('sprint', { name: a.n, hard: 1 }); var r2 = await G.UI.game('driving', { name: a.n }); var j = G.S.p.jail; if ((r.score + r2.score) / 2 > .62 && G.ch(.55)) { G.S.p.jail = null; G.S.p.h.heat = 90; G.S.p.flags.fugitive = 1; G.major('越狱成功|Escaped from prison'); G.inc('escape'); return G.result(a.n, '你翻过高墙，消失在夜色里！|You scaled the wall and vanished into the night!', null, [], a.i); } j.left += 3; j.beh = 0; return G.result(a.n, '越狱失败，你被抓了回来，刑期加了3年。|The escape failed. You were caught, with three years added.', null, [], a.i); } }
  ];
  G.ACT_GANG = [
    { id: 'protect', n: '收保护费|Collect Protection Money', i: '💼', e: 15, run: function (a) { var g = G.S.p.gang, m = Math.round(G.$(400) * (g.rank + 1) * G.rf(.6, 1.6)); G.addMoney(m); g.rep += 2; return quick(a, '你挨家挨户收了{m}。|You made the rounds and collected {m}.', { heat: 4, karma: -2 }, { m: G.M(m) }); } },
    { id: 'guard', n: '看场子|Guard a Venue', i: '🕶️', e: 15, run: function (a) { var g = G.S.p.gang; g.rep += 3; return quick(a, ['你在夜总会门口站了一晚上，相安无事。|You stood watch at the nightclub door; quiet night.', '有人闹事，你三两下就摆平了。|Someone started trouble; you settled it in seconds.'], { money: 150, heat: 2 }); } },
    { id: 'smuggle', n: '走私货物|Smuggle Goods', i: '🚢', e: 25, if: function () { return G.S.p.gang.rank >= 1; }, run: async function (a) { var r = await G.UI.game('driving', { name: a.n }); var g = G.S.p.gang; if (r.score > .45 || G.ch(.3)) { var m = Math.round(G.$(6000) * (g.rank + 1) * G.rf(.7, 1.6)); G.addMoney(m); g.rep += 6; G.addStat('heat', 10); return G.result(a.n, '货安全送到，你分到了{m}。|The cargo arrived safely; your cut was {m}.', { m: G.M(m) }, [], a.i); } G.addStat('heat', 20); if (G.ch(.4)) { var t = await G.crime.arrest(G.ctx(), '走私罪|Smuggling', 5); return G.result(a.n, t, null, [], a.i); } return G.result(a.n, '海关查得紧，货被扣了，你侥幸逃脱。|Customs seized the goods; you barely escaped.', null, [], a.i); } },
    { id: 'casino', n: '开地下赌场|Run an Underground Casino', i: '🎲', e: 25, if: function () { return G.S.p.gang.rank >= 2; }, run: function (a) { var g = G.S.p.gang, m = Math.round(G.$(15000) * g.rank * G.rf(.5, 1.8)); G.addMoney(m); g.rep += 5; return quick(a, '赌场生意兴隆，你抽成{m}。|The casino is booming; your cut is {m}.', { heat: 12, karma: -4 }, { m: G.M(m) }); } },
    { id: 'recruit', n: '招兵买马|Recruit Members', i: '🧑‍🤝‍🧑', e: 15, $: 1000, run: function (a) { var g = G.S.p.gang; g.rep += 6; var n = N.make({ rel: 'gang', g: G.ch(.8) ? 'm' : 'f', age: G.ri(17, 30), job: G.L('{g}成员|{g} member', { g: g.name }), aff: 40 }); return quick(a, '{n}拜你为大哥/大姐。|{n} swears loyalty to you.', { heat: 2 }, { n: n.name }); } },
    { id: 'bribecop', n: '打点警方|Pay Off the Cops', i: '💸', e: 10, run: function (a) { var p = G.S.p, cost = G.$(3000) * (p.gang.rank + 1); if (!G.pay(cost)) return quick(a, '钱不够。|Not enough cash.', {}); if (G.ch(.8)) { p.h.heat = Math.max(0, p.h.heat - 25); return quick(a, '你花{m}打点了关系，风头过去了。|You spent {m} greasing palms; the heat died down.', {}, { m: G.M(cost) }); } p.h.heat += 15; return quick(a, '你找错了人，对方是个硬骨头！|Wrong cop — this one\'s incorruptible!', {}); } },
    { id: 'launder', n: '洗白上岸|Go Legit', i: '🧼', e: 20, if: function () { return G.S.p.gang.rank >= 3; }, run: function (a) { var p = G.S.p; G.gang.leave(); p.h.heat = Math.max(0, p.h.heat - 40); if (!G.S.assets.company && p.money > G.$(100000)) { var ind = G.pick(['food', 'retail', 're', 'trade', 'media']); G.biz.start(ind, Math.min(p.money * .5, 2000000) / G.$f(p.country, G.S.year)); G.addMoney(-Math.round(p.money * .5)); } return quick(a, '你把黑钱洗进了正当生意，从此成了“企业家”。|You laundered your money into a legit business. Now you\'re an "entrepreneur."', { karma: 5 }); } },
    { id: 'gleave', n: '金盆洗手|Leave the Gang', i: '🙌', e: 10, run: function (a) { G.gang.leave(); if (G.ch(.25)) return quick(a, '帮派不肯放人，你被打成重伤。|The gang wouldn\'t let you go — you were beaten badly.', { health: -25 }); return quick(a, '你退出了江湖。|You left the underworld behind.', { karma: 5 }); } }
  ];
})();
