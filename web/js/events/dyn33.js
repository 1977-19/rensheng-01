/* Version 3.3 — four rare top-tier dynasties, as powerful as a political dynasty.
   顶奢世家 (a top luxury house), 港岛豪门 (a harbour-city tycoon clan), 政商世家 (a political-business family),
   隐世家族 (an old clan nobody writes about). They are VIP origins like 红二代, carry top-level connections, and
   bring real advantages: a family trust that pays out every year from 18, family lawyers when you are in trouble,
   the best doctors when you are ill, a seat waiting in the family business, and a storyline of their own. */
(function () {
  'use strict';
  var N = G.N, H = G.EH;
  function S() { return G.S; }
  function P() { return G.S && G.S.p; }
  var NEW = [
    { id: 'luxtop', n: '顶奢世家|Top Luxury Dynasty', d: '全世界最贵的十个品牌里，有四个属于你家。巴黎、米兰、东京的旗舰店，橱窗都是你奶奶亲自定的。|Four of the world\'s ten most expensive brands belong to your family. Grandma still approves the windows in Paris, Milan and Tokyo.', vip: 3,
      w: [800000000, 6000000000], inc: [20000000, 80000000], job: ['集团主席|Group Chair', '创意总监|Creative Director'], st: { looks: 12, eq: 8, fame: 30 }, sib: [1, 3], fl: ['rich', 'elite'] },
    { id: 'hkclan', n: '港岛豪门|Harbour City Tycoon Clan', d: '码头、地产、酒店、赌牌，半山上那座大宅里住着四代人。每年家族年夜饭，财经记者都在门口等。|Ports, property, hotels, a casino licence — four generations live in the mansion on the Peak. Business reporters wait outside every New Year dinner.', vip: 3,
      w: [500000000, 4000000000], inc: [15000000, 60000000], job: ['家族集团主席|Chairman of the Family Group', '地产集团总裁|Property Group CEO'], st: { eq: 10, smarts: 6, fame: 25 }, sib: [1, 4], fl: ['rich', 'elite'] },
    { id: 'polbiz', n: '政商世家|Political-Business Dynasty', d: '爷爷做过部长，爸爸掌管着一家横跨能源和金融的集团，叔叔还在台上。一个电话，能办成别人一年办不成的事。|Grandpa was a minister, Dad runs a group spanning energy and finance, and an uncle is still in office. One phone call does what others can\'t do in a year.', vip: 3,
      w: [100000000, 1000000000], inc: [5000000, 30000000], job: ['集团董事长|Group Chairman', '部委司长|Ministry Director'], st: { eq: 12, smarts: 8, fame: 15 }, sib: [0, 2], fl: ['rich', 'elite'] },
    { id: 'hidden', n: '隐世家族|The Hidden Clan', d: '你家从不上富豪榜，可三家银行、五座港口和一个国家的半数矿山，背后都是同一个姓。家训只有一句：不显山，不露水。|Your family never appears on rich lists, yet three banks, five ports and half a nation\'s mines lead back to one surname. The family motto: never be seen.', vip: 3,
      w: [1000000000, 10000000000], inc: [10000000, 50000000], job: ['家族信托受托人|Family Trustee', '某基金会理事|Foundation Trustee'], st: { smarts: 10, eq: 8 }, sib: [0, 2], fl: ['rich', 'elite'] }
  ];
  NEW.forEach(function (o) { if (!G.ORIGIN[o.id]) { G.ORIGINS.push(o); G.ORIGIN[o.id] = o; } });
  var IDS = NEW.map(function (o) { return o.id; });
  G.DYN33 = IDS;
  function isDyn(p) { return p && IDS.indexOf(p.origin) >= 0 && !p.flags.trafficked; }

  // top connections, top family class
  var co = G.connOf; if (co) G.connOf = function (oid) { return IDS.indexOf(oid) >= 0 ? 3 : co.apply(this, arguments); };
  var fc = G.famClass; if (fc) G.famClass = function () { var c = fc.apply(this, arguments); return isDyn(P()) ? Math.max(c, 3) : c; };
  var op = G.originPerks;
  if (op) G.originPerks = function (o) {
    var t = op.apply(this, arguments);
    if (IDS.indexOf(o.id) < 0) return t;
    return G.join([t, G.L('💎 家族信托：18岁起每年分红 · 家族律师团：出事能捞人 · 顶级医疗 · 家族集团给你留着位子|💎 Family trust pays out every year from 18 · family lawyers get you out of trouble · the best doctors · a seat kept for you in the family group')], ' · ', ' · ');
  };

  /* ---------- the advantages, every year ---------- */
  var USD = { luxtop: [400000, 1500000], hkclan: [300000, 1200000], polbiz: [150000, 600000], hidden: [500000, 2000000] };
  var mt = G.money.tick;
  G.money.tick = function () {
    var r = mt.apply(this, arguments), s = S(), p = s.p, q = s.pendQ = s.pendQ || [];
    try {
      if (isDyn(p) && !s.dead) {
        var d = p.flags.dyn = p.flags.dyn || {};
        if (p.age >= 18 && !d.cut) {
          var u = USD[p.origin], m = G.$(G.ri(u[0], u[1]));
          if (G.fin) G.fin.tag = G.L('家族信托分红|Family trust payout'); G.addMoney(m); if (G.fin) G.fin.tag = null;
          if (!d.firstPay) { d.firstPay = s.year; q.push({ id: 'dyn_trust' }); }
        }
        if (p.jail && !d.bail) q.push({ id: 'dyn_bail' });
        if (p.age >= 22 && p.age <= 40 && !p.job && !d.seat && !p.jail && G.ch(.5)) q.push({ id: 'dyn_seat' });
        if (p.st.health < 35 && !d.doctors) q.push({ id: 'dyn_doctors' });
      }
    } catch (e) { console.error(e); }
    return r;
  };
  function oname() { var o = G.ORIGIN[P().origin]; return o ? G.T(o.n) : ''; }
  G.evs([
    { id: 'dyn_trust', sys: 1, title: '家族信托|The Family Trust', icon: '🏦', noFill: 1,
      t: function () { return G.L('十八岁生日那天，家族办公室的律师送来一份文件：从今年起，{o}的家族信托每年会把一笔分红打进你的账户。条件只有一个——不要让这个姓氏蒙羞。|On your eighteenth birthday the family office lawyer brings a document: from this year the {o} trust pays a dividend into your account every year. One condition — never shame the name.', { o: oname() }); },
      o: [{ t: '签字|Sign', run: function (c) { H.fx(c, { happy: 8 }); return '你签下了名字。银行发来短信的时候，你数了三遍后面的零。|You signed. When the bank\'s text arrived, you counted the zeros three times.'; } },
        { t: '问律师：“如果我不想要呢？”|Ask: "What if I don\'t want it?"', run: function (c) { H.fx(c, { eq: 4, happy: 2 }); return '律师愣了一下，笑了：“你父亲当年也这么问过。钱会一直在那里，等你想要的时候。”|The lawyer paused, then smiled: "Your father asked the same. The money will wait until you want it."'; } }] },
    { id: 'dyn_bail', sys: 1, title: '家族律师团|The Family Lawyers', icon: '⚖️', noFill: 1,
      prep: function (c) { var p = c.p; if (!p.jail || (p.flags.dyn || {}).bail) return false; p.flags.dyn.bail = S().year; },
      t: '你被关进去的第二天，三位西装革履的律师走进了会见室。领头的那位说：“家里让我们来接你回去。”|On your second day inside, three lawyers in sharp suits walk into the visiting room. The lead one says: "The family sent us to bring you home."',
      o: [{ t: '让他们去办|Let them handle it', run: function (c) { var p = c.p; if (G.ch(.85)) { var left = p.jail.left; p.jail.left = 0; if (G.jail && G.jail.release) try { G.jail.release(); } catch (e) { } else p.jail = null; H.fx(c, { fame: -4, karma: -3, happy: 10 }); return G.L('一个月后，你走出了大门。原本的{y}年刑期，变成了一纸“取保候审”。媒体骂了几天，很快就没人提了。|A month later you walked out. A {y}-year sentence had become "bail pending review". The press raged for a few days, then forgot.', { y: left || 1 }); } H.fx(c, { stress: 6 }); return '这一次，连家族律师也没办法。领头的律师说：“对不起，风头太紧了。”|This time even the family lawyers couldn\'t do it. "I\'m sorry," the lead one said. "The heat is too high."'; } },
        { t: '“我自己犯的错，自己扛。”|"My mistake. I\'ll serve my time."', run: function (c) { H.fx(c, { karma: 8, eq: 4 }); c.p.flags.dyn.cut = 0; return '律师们面面相觑，把文件收了回去。消息传回家，奶奶说：“这孩子，有骨气。”|The lawyers exchanged looks and packed up. When word reached home, Grandma said: "That child has backbone."'; } }] },
    { id: 'dyn_seat', sys: 1, title: '留给你的位子|A Seat Kept for You', icon: '🪑', noFill: 1,
      prep: function (c) { var d = c.p.flags.dyn = c.p.flags.dyn || {}; if (d.seat || c.p.job) return false; d.seat = S().year; },
      t: function () { return G.L('家族集团的董事会给你留了一个副总裁的位子，年薪是普通人的一百倍。你只需要点头。|The board of the {o} group has kept a vice-president\'s seat for you, at a hundred times an ordinary salary. You only have to nod.', { o: oname() }); },
      o: [{ t: '点头|Nod', run: function (c) { var p = c.p, m = G.$(G.ri(500, 1500) * 1000); G.addMoney(m); p.flags.famSeat = 1; H.fx(c, { fame: 4, happy: 6 }); G.major('进入家族集团担任副总裁|Became a vice-president of the family group'); return G.L('第一次董事会上，所有人都站起来跟你握手。你拿到了一份{m}的签约奖金。|At your first board meeting everyone stood to shake your hand. A signing bonus of {m}.', { m: G.M(m) }); } },
        { t: '先去外面闯一闯|Make your own way first', run: function (c) { H.fx(c, { smarts: 3, eq: 3, karma: 3 }); return '爸爸没说什么，只是把那张椅子的照片发给了你：“它会一直在这儿。”|Dad said nothing — just sent you a photo of the chair: "It will be here."'; } }] },
    { id: 'dyn_doctors', sys: 1, title: '顶级医疗团队|The Best Doctors', icon: '🩺', noFill: 1,
      prep: function (c) { var d = c.p.flags.dyn = c.p.flags.dyn || {}; if (d.doctors) return false; d.doctors = S().year; },
      t: '家族的私人医生连夜从三个国家请来了专家会诊。一架医疗专机停在了你家附近的机场。|The family physician flies in specialists from three countries overnight. A medical jet waits at the nearest airport.',
      o: [{ t: '接受治疗|Accept treatment', run: function (c) { H.fx(c, { health: 25, happy: 6 }); return '三个月后，你又能自己走路了。医生说，换作别人，可能没有这个机会。|Three months later you were walking again. The doctor said anyone else might not have had the chance.'; } }] }
  ]);

  /* ---------- their own storylines ---------- */
  var O = G.ODB;
  O('luxtop', [
    ['fam', 'heir_war', [8, 16], '谁来接班', '👑', '奶奶要退休了。爸爸和姑姑都想接掌集团，在家族晚宴上当着几十个人的面争了起来。妈妈拉着你的手离席，在走廊里说：“这个家迟早要散。”', [
      ['回到餐桌，给奶奶倒一杯茶', '整张桌子安静了。奶奶看了你很久，说：“十年以后，这个位子你来坐。”', { eq: 6, fame: 2 }, 'chosen'],
      ['跟妈妈回房间', '那一晚，爸爸和姑姑谁都没赢。可从那以后，家族的每一次聚会都像谈判。', { stress: 4 }, 'crack']
    ], { noGate: 1 }],
    ['kid', 'atelier', [5, 11], '工坊里的孩子', '✂️', '你在巴黎的老工坊里长大，老裁缝们教你分辨二十种丝绸。', [
      ['学会了蒙着眼睛摸出丝绸的产地', '首席裁缝说，你的手比他三十年的徒弟还准。', { smarts: 3, looks: 2 }, 'hands'],
      ['把边角料缝成一只小熊', '那只小熊后来被做成了品牌的限量款，排队的人从店门口排到了河边。', { happy: 8, fame: 2 }, 'bear']
    ]],
    ['sch', 'paparazzi', [12, 18], '镜头', '📸', '你第一次穿着自家品牌出现在秀场头排，第二天全球的时尚杂志都在讨论“继承人的品味”。', [
      ['低调：之后再也不坐头排', '你转进了一所没有人知道你姓什么的寄宿学校。', { happy: 4, smarts: 3 }, 'lowkey'],
      ['享受镜头', '你成了时尚圈最年轻的封面人物。', { fame: 8, looks: 2 }, 'icon']
    ]],
    ['soc', 'friends', [16, 28], '真朋友', '🥂', '你身边的人都想借你的姓氏：设计师想要合作，模特想要代言，同学想要一个限量包。只有一个人从来没提过任何要求。', [
      ['和这个人交朋友', function (c) { var n = G.N.make({ rel: 'friend', age: c.p.age + G.ri(-2, 2), aff: 70 }); n.pin = 1; return '{n}后来成了你一辈子的朋友。你送过ta很多东西，ta唯一收下的，是你亲手缝的那只小熊。'.replace('{n}', String(n.name).split('|')[0]); }, { eq: 4, happy: 6 }, 'true'],
      ['谁都不信', '你很安全，也很孤独。', { stress: 4 }, 'alone']
    ]],
    ['adu', 'creative', [24, 38], '你的第一个系列', '🧵', '你要发布自己的第一个系列。集团的老臣们说：“稳一点，做经典款。”', [
      ['做一个谁都没见过的系列', function (c, f) { return f.hands ? '你用小时候在工坊里学到的手艺，做出了一个没有一处机器缝线的系列。秀场上，奶奶第一个站起来鼓掌。' : '一半的评论说你疯了，另一半说你是天才。销量证明后者是对的。'; }, { fame: 10, money: 30000 }, 'bold'],
      ['做经典款', '系列卖得很好，没有人记得。', { money: 20000 }, 'safe']
    ]],
    ['turn', 'takeover', [32, 58], '敌意收购', '🦈', '一家美国集团在市场上悄悄吃进了你家百分之二十的股份，想要吞掉整个集团。', [
      ['召集全家，第一次团结起来', function (c, f) { return f.chosen ? '你给奶奶、爸爸、姑姑各打了一个电话。三房人第一次坐在同一张桌子上，签下了一致行动协议。收购失败了。' : '家族勉强团结了起来，代价是你让出了一半的控制权。'; }, { fame: 6, eq: 6, stress: 8 }, 'unite'],
      ['卖掉一部分品牌，换来现金反击', '你卖掉了两个品牌，保住了核心。奶奶说：“壮士断腕。”', { money: 200000, happy: -4 }, 'cut']
    ], { after: 'adu', gap: 3 }],
    ['late', 'window', [58, 90], '最后一个橱窗', '🪟', '就像当年的奶奶一样，你亲自设计了旗舰店的最后一个橱窗。', [
      ['放上那只小熊', '橱窗里只有一只用边角料缝的旧小熊。路过的人都停下来看，没有人知道它的故事。', { happy: 10 }],
      ['把位子交给下一代', '你把钥匙交给了孙辈：“橱窗，从今天起你来定。”', { happy: 8, kids: 4 }]
    ]]
  ], [
    [function (p, f) { return f.unite && f.bold; }, '顶奢掌门人', '你从工坊里长大，最后坐上了奶奶的位子，让一个百年的名字继续发光。'],
    [function (p, f) { return f.lowkey || f.true; }, '不靠姓氏的人', '世界只认识你的姓氏，你却守住了几个只认识你的人。'],
    [function (p, f) { return f.icon; }, '时尚偶像', '你一辈子都活在镜头里，并且很享受。'],
    [function () { return true; }, '顶奢世家之后', '丝绸、秀场和家族晚宴，是你的一生。']
  ]);
  O('hkclan', [
    ['fam', 'dinner', [8, 16], '四房年夜饭', '🧧', '家族年夜饭上，二房和三房为了一块填海地的开发权吵了起来，爷爷把筷子一摔：“我还没死！”你爸爸是长子，却一直没说话。', [
      ['给爷爷剥了一只虾', '爷爷吃了那只虾，脸色缓了下来，把那块地划给了你们这一房。', { eq: 6, par: 4 }, 'grandpa'],
      ['拉着堂兄弟去花园放烟花', '烟花放完回来，饭桌上已经吵完了。可你和堂兄弟们的交情，从那晚开始。', { happy: 6 }, ['cousins', 'crack']]
    ], { noGate: 1 }],
    ['kid', 'peak', [5, 11], '山顶的大宅', '🏯', '大宅里有三十个佣人，你最喜欢的是做了四十年的老管家。', [
      ['跟老管家去街市买菜', '你第一次坐叮叮车，第一次吃路边的鱼蛋。老管家说：“这才是这座城。”', { happy: 8, eq: 3 }, 'street'],
      ['在大宅里玩捉迷藏', '你在爷爷的书房里找到了一份泛黄的码头合同，上面的签名是太爷爷的。', { smarts: 3 }, 'history']
    ]],
    ['sch', 'kidnap', [12, 18], '绑架', '🚐', '放学路上，一辆面包车停在了你身边。', [
      ['用保镖教的方法拖延时间', '你在车里留下了线索。四个小时后，警察冲进了仓库。这件事登上了全城的头版。', { fame: 6, stress: 10 }, 'survivor'],
      ['乖乖配合', '家里付了赎金，你平安回家。从那以后，你出门要带四个保镖。', { stress: 12, money: -50000 }, 'scared']
    ]],
    ['soc', 'cousins', [18, 30], '堂兄弟们', '🎲', '堂兄弟们约你去澳门玩一晚，说是“谈点生意”。', [
      ['去，但只喝茶不赌', function (c, f) { return f.cousins ? '你们从烟花那晚就认识，几个人谈了一整夜，敲定了一个合作项目。' : '你只喝了一壶茶，把赌桌上的人都看清楚了。'; }, { eq: 4, money: 10000 }, 'deal'],
      ['不去', '他们说你“不合群”。', { stress: 2 }]
    ]],
    ['adu', 'harbour', [24, 38], '码头', '⚓', '家族最老的码头要不要卖给内地的国企？价钱很好，可那是太爷爷起家的地方。', [
      ['不卖，改造成智能港口', '你花了五年把老码头改造成了全亚洲最先进的自动化港口。', { money: 50000, fame: 6, smarts: 3 }, 'modern'],
      ['卖，用这笔钱投新能源', '码头换了主人，你的新能源公司成了家族新的支柱。', { money: 80000 }, 'pivot']
    ]],
    ['turn', 'will', [35, 60], '遗嘱', '📜', '爷爷去世了。遗嘱宣读的那天，四房人都坐在律师楼里，空气紧得像要爆炸。', [
      ['提议成立家族委员会，四房共治', function (c, f) { return f.grandpa ? '律师念到最后一页：爷爷指定由你来主持家族委员会。没有人反对。' : '大家吵了三个月，最后同意了。家族没有散。'; }, { eq: 6, fame: 4 }, 'council'],
      ['为你这一房争到最多', '你们赢了最大的一份，代价是堂兄弟们从此不再回大宅过年。', { money: 100000, happy: -6 }, 'grab']
    ], { noGate: 1 }],
    ['late', 'old_butler', [58, 90], '老管家的街市', '🐟', '你老了，又去了一次小时候和老管家去的那个街市。', [
      ['买一串鱼蛋', '味道和六十年前一模一样。', { happy: 10 }],
      ['给街市捐一座新的屋顶', '摊主们在新屋顶下给你挂了一块牌子：“多谢某某家”。', { karma: 6, fame: 2 }]
    ]]
  ], [
    [function (p, f) { return f.council; }, '大宅的主人', '你没有让四房人散掉，大宅的灯，一直亮着。'],
    [function (p, f) { return f.grab; }, '豪门赢家', '你赢下了最大的一份家产，也失去了满桌的亲人。'],
    [function (p, f) { return f.street; }, '山顶上长大的街坊', '你住在山顶，却一辈子记得街市里的鱼蛋。'],
    [function () { return true; }, '港岛豪门之后', '码头、大宅和财经版头条，是你的一生。']
  ]);
  O('polbiz', [
    ['fam', 'uncle', [8, 16], '叔叔的位置', '🏛️', '叔叔还在台上，爸爸的集团却要接一个政府项目。妈妈说这是“瓜田李下”，爸爸说“不接，别人也会接”。两个人吵到半夜，还压低着声音。', [
      ['问爸爸：“这样对吗？”', '爸爸沉默了很久。第二天，集团退出了投标。', { karma: 6, par: 3 }, 'clean'],
      ['偷偷记住了他们说的每一个名字', '你开始懂得这个家是怎么运转的。', { smarts: 4 }, ['game', 'crack']]
    ]],
    ['kid', 'visitors', [6, 12], '来家里的客人', '🍵', '家里总有客人来访，他们都对你特别客气，每次都带礼物。', [
      ['礼物都交给妈妈退回', '妈妈摸着你的头：“你记住，人家对你好，是因为你姓什么。”', { karma: 4, eq: 3 }, 'wary'],
      ['收下，并且记住谁送了什么', '你十岁就能说出每个叔叔伯伯的喜好。', { eq: 5 }, 'network']
    ]],
    ['sch', 'abroad', [15, 20], '名校', '🎓', '一封推荐信让你进了全国最好的大学。你知道写信的人是谁。', [
      ['入学后加倍努力，证明自己', '四年后你以第一名毕业。没有人再提那封推荐信。', { smarts: 6, stress: 4 }, 'earned'],
      ['把时间花在结交人脉上', '你认识了半个班的“官二代”和“富二代”。', { eq: 5, fame: 2 }, 'circle']
    ]],
    ['soc', 'fixer', [20, 32], '有人来找你办事', '📞', '一个老同学找到你：他公司的审批卡住了，想请你“跟你叔叔说一声”。', [
      ['拒绝', '老同学很失望。三年后，那家公司出了问题，你庆幸自己没有掺和。', { karma: 5 }, 'refuse'],
      ['打了那个电话', function (c, f) { return f.network ? '事情一天就办成了。你收到了一张“顾问费”的支票。' : '电话打了，事情办成了。你第一次感觉到这个姓氏的分量。'; }, { money: 20000, karma: -6 }, 'call']
    ]],
    ['adu', 'run', [28, 45], '从政还是从商', '🗳️', '家里希望你选一条路：进体制接叔叔的班，或者进集团接爸爸的班。', [
      ['从政', '你从基层干起，三年后当上了副县长。', { fame: 4, eq: 4 }, 'office'],
      ['从商', '你接手了集团的新能源板块。', { money: 50000, smarts: 3 }, 'business'],
      ['两条路都不选', '你开了一家律师事务所，专门帮普通人打行政官司。', { karma: 8, happy: 4 }, 'own']
    ]],
    ['turn', 'probe', [35, 62], '调查组', '🔍', '叔叔落马了。调查组也约谈了你。', [
      ['把知道的都说出来', function (c, f) { return f.refuse || f.clean ? '你一直离那些事远远的，调查组很快就结束了对你的问询。你成了家里唯一一个干干净净的人。' : '你交代了那个电话的事。你被处分了，但没有被追责。'; }, { karma: 8, stress: 10 }, 'truth'],
      ['动用剩下的关系', '一部分关系还在，一部分已经倒了。你保住了自己，却上了某个名单。', { stress: 14, karma: -6 }, 'dig']
    ], { after: 'adu', gap: 3 }],
    ['late', 'memoir', [60, 92], '回忆录', '📕', '出版社想请你写一本回忆录。', [
      ['写，写真实的', '回忆录出版后，有人说你背叛了家族，有人说你说了真话。', { fame: 4, karma: 4 }],
      ['不写', '你说：“我家的事，不需要再上一次报纸了。”', { happy: 4 }]
    ]]
  ], [
    [function (p, f) { return f.truth && (f.refuse || f.clean); }, '清白的世家子', '你生在权与钱交汇的地方，却一辈子没有弯过腰。'],
    [function (p, f) { return f.call || f.dig; }, '电话的代价', '一个电话能办成很多事，也能毁掉很多事。'],
    [function (p, f) { return f.own; }, '走第三条路的人', '你既没有从政，也没有从商，而是替普通人说话。'],
    [function () { return true; }, '政商世家之后', '饭桌上的名字、家里的客人和一个能打的电话，是你的一生。']
  ]);
  O('hidden', [
    ['fam', 'motto', [8, 16], '家训', '🕯️', '你在学校的作文里写了“我家有三家银行”。当天晚上，爷爷把全家叫到祠堂，爸爸在祖宗牌位前跪了一个小时——因为他没教好你。妈妈说这样的家规太冷，第一次顶撞了爷爷。', [
      ['跪在爸爸旁边', '爷爷看了你们俩很久，让你们起来，然后讲了家族三百年来为什么“不显山不露水”。', { eq: 6, smarts: 3 }, 'motto'],
      ['跑去找妈妈', '妈妈抱着你，在门外听完了整个家训。那一夜，她和爷爷谁也没睡。', { stress: 4 }, 'crack']
    ], { noGate: 1 }],
    ['kid', 'ordinary', [5, 11], '普通学校', '🎒', '按照家规，你上的是一所最普通的公立小学，穿的是普通的衣服，零花钱和同学一样多。', [
      ['当一个最普通的孩子', '你和班上的孩子一起踢球、吃路边摊。你是全家唯一一个会骑自行车的人。', { happy: 8, eq: 4 }, 'normal'],
      ['偷偷告诉同桌你家很有钱', '同桌不信，笑了你一个学期。', { happy: 2 }]
    ]],
    ['sch', 'test', [14, 20], '家族的考验', '🧭', '十六岁，按照家规，你要一个人身无分文地在陌生城市生活一个月。', [
      ['去', '你在一家面馆打了一个月工，学会了拉面，也学会了看人。回来那天，爷爷亲自在门口等你。', { eq: 6, smarts: 4, health: 2 }, 'trial'],
      ['偷偷带了一张卡', '你过得很舒服。回家后，爷爷什么都没说，只是把你的名字从家族理事会的候选名单上划掉了。', { happy: 4, fame: -1 }, 'cheat']
    ]],
    ['soc', 'stranger', [18, 32], '查你的人', '🕵️', '一个调查记者在写一篇关于“影子财团”的报道，找到了你。', [
      ['请他吃一碗你拉的面', function (c, f) { return f.trial ? '你们聊了一整晚。他最后没有写你家，而是写了一篇关于那家面馆的故事。' : '他很客气，但报道还是写了。不过没有写到你家的名字。'; }, { eq: 4 }, 'charm'],
      ['让家族律师处理', '报道被撤下了。那个记者后来换了行。', { karma: -4 }, 'silence']
    ]],
    ['adu', 'trustee', [26, 42], '理事会', '🗝️', '你被提名进入家族理事会。三百年来，理事会只有七个席位。', [
      ['接受', function (c, f) { return f.cheat ? '你的名字早被划掉了。是你自己后来十年的表现，让爷爷重新写上了它。' : '你成了理事会最年轻的成员，也第一次看到了家族真正的版图。'; }, { fame: 0, smarts: 4, money: 50000 }, 'seat'],
      ['婉拒，去做自己的事', '你成了一名乡村医生/教师。家族每年给你的学校捐一栋楼，不留名字。', { karma: 8, happy: 6 }, 'away']
    ]],
    ['turn', 'reveal', [35, 65], '露面', '🌅', '一场金融危机让一个国家濒临破产。家族可以出手救市，但代价是从此暴露在全世界的目光下。', [
      ['出手，即使暴露', '家族的名字第一次出现在了新闻里。几百万人的存款保住了。爷爷说：“三百年，等的就是这一天。”', { karma: 10, fame: 10 }, 'save'],
      ['不出手，守住家训', '家族又隐身了三十年。那个国家用了十年才缓过来。', { karma: -4 }, 'hide']
    ], { after: 'adu', gap: 3 }],
    ['late', 'ancestral', [60, 92], '祠堂', '🏮', '你成了家族里最年长的人，每年清明，由你在祠堂里讲家训。', [
      ['讲老规矩', '你讲了“不显山不露水”。孩子们听得很认真。', { happy: 6 }],
      ['加一句新的', '你在家训后面加了一句：“该露面的时候，也要敢露面。”', { happy: 8, karma: 3 }]
    ]]
  ], [
    [function (p, f) { return f.save; }, '走到阳光下的家族', '你的家族隐身了三百年，在最需要的时候，第一次站了出来。'],
    [function (p, f) { return f.trial && f.seat; }, '影子里的掌舵人', '你通过了家族最难的考验，掌握着一张世界上没人看得见的地图。'],
    [function (p, f) { return f.away || f.normal; }, '隐世家族里的普通人', '你拥有一切，却选择了最普通的生活。'],
    [function () { return true; }, '不显山，不露水', '你家很少有人知道，而你很喜欢这样。']
  ]);
})();
