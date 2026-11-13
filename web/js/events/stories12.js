/* Version 1.4 stories: three new families of means, and everyday moments across a life. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }

  var NEW = [
    { id: 'techfam', n: '科技新贵家庭|Tech Founder Family', d: '爸爸创办的科技公司刚刚上市，家里一夜之间变得很有钱。|Your father\'s tech company has just gone public; the family became rich overnight.', vip: 0,
      w: [3000000, 20000000], inc: [400000, 2000000], job: ['科技公司创始人|Tech Company Founder', '首席技术官|Chief Technology Officer'], st: { smarts: 8 }, sib: [0, 1], fl: ['rich'] },
    { id: 'banker', n: '金融世家|Banking Dynasty', d: '祖父、父亲都是银行家，家里的饭桌上聊的是利率和并购。|Your grandfather and father were bankers; dinner talk is interest rates and mergers.', vip: 0,
      w: [5000000, 40000000], inc: [600000, 3000000], job: ['投资银行合伙人|Investment Bank Partner', '基金管理人|Fund Manager'], st: { smarts: 6, eq: 6 }, sib: [0, 2], fl: ['rich'] },
    { id: 'hotelier', n: '酒店集团世家|Hotel Dynasty', d: '家族经营着遍布各地的连锁酒店，你从小在总统套房里写作业。|Your family runs a hotel chain; you did homework in presidential suites.', vip: 0,
      w: [4000000, 30000000], inc: [500000, 2500000], job: ['酒店集团董事长|Hotel Group Chairman', '酒店集团总经理|Hotel Group Managing Director'], st: { looks: 5, eq: 8 }, sib: [0, 2], fl: ['rich'] }
  ];
  NEW.forEach(function (o) { if (!G.ORIGIN[o.id]) { G.ORIGINS.push(o); G.ORIGIN[o.id] = o; } });
  var fc = G.famClass;
  if (fc) G.famClass = function () { var c = fc.apply(this, arguments), p = S() && S().p; if (p && ['techfam', 'banker', 'hotelier'].indexOf(p.origin) >= 0 && !p.flags.trafficked) c = Math.max(c, 2); return c; };
  function OE(id, org, a, title, icon, t, o, x) { x = x || {}; var f = x.if; x.if = function (S2, p) { return p.origin === org && !p.flags.heir && (!f || f(S2, p)); }; if (x.w == null) x.w = 2.6; return E(id, a, title, icon, t, o, x); }

  G.evs([
    /* tech founders' children */
    OE('or_tf_ipo', 'techfam', [5, 12], '敲钟那天|The Day of the Bell', '🔔', '爸爸带你去交易所，看他敲响上市的钟。|Dad takes you to the exchange to watch him ring the opening bell.', [
      O('站在爸爸身边|Stand beside Dad', R('第二天，你和爸爸的合影上了财经杂志的封面。|The next day, the photo of you and Dad was on a business magazine cover.', { happy: 6, fame: 2 })),
      O('问爸爸“公司值多少钱”|Ask Dad "how much is the company worth?"', R('爸爸笑了：“值很多，但最值钱的是你。”|Dad laughed: "A lot. But you\'re worth more."', { happy: 4, eq: 2 }))
    ]),
    OE('or_tf_code', 'techfam', [10, 17], '第一个程序|Your First Program', '💻', '爸爸的工程师们教你写了第一行代码。|Dad\'s engineers teach you your first line of code.', [
      O('做一个小游戏|Make a little game', R('全公司都在玩你做的贪吃蛇。|The whole company played your Snake clone.', { smarts: 5, happy: 4 })),
      O('觉得太无聊|Find it boring', R('你更喜欢在公司的滑梯上玩。|You preferred the office slide.', { happy: 3 }))
    ]),
    OE('or_tf_board', 'techfam', [22, 40], '进董事会|A Seat on the Board', '🪑', '爸爸想让你进公司董事会。|Dad wants you on the company board.', [
      O('接下这个位置|Accept the seat', function (c) { c.p.flags.boardSeat = 1; H.fx(c, { fame: 5, eq: 3 }); return '第一次开会，老董事们都在打量你。|At your first meeting, the veteran directors sized you up.'; }),
      O('先去别的公司闯一闯|Prove yourself elsewhere first', R('爸爸嘴上不说，心里很骄傲。|Dad said nothing, but was proud.', { par: 5, smarts: 2 }))
    ]),
    /* banking dynasty */
    OE('or_bk_piggy', 'banker', [5, 10], '第一个存钱罐|Your First Piggy Bank', '🐷', '爷爷送你一个存钱罐，说：“钱要会生钱。”|Grandpa gives you a piggy bank: "Money should make money."', [
      O('每天存一点|Save a little every day', R('一年后爷爷按“利息”给你翻了一倍。|After a year, Grandpa doubled it as "interest."', { smarts: 3, money: 50 })),
      O('拿去买糖|Spend it on sweets', R('爷爷摇头：“第一课没及格。”|Grandpa shook his head: "Failed the first lesson."', { happy: 4 }))
    ]),
    OE('or_bk_intern', 'banker', [18, 24], '投行暑期实习|A Banking Internship', '📊', '你在家族的老朋友开的投行实习，每天工作十六个小时。|You intern at a family friend\'s investment bank, sixteen hours a day.', [
      O('咬牙坚持|Grit your teeth', R('实习结束，你拿到了正式offer。|At the end you received a full-time offer.', { smarts: 4, health: -3, eq: 2 })),
      O('只做到一半|Leave halfway', R('你发现自己不喜欢这一行。这也是收获。|You learned you don\'t like the trade. That counts too.', { happy: 3 }))
    ]),
    OE('or_bk_crisis', 'banker', [25, 60], '金融风暴|A Financial Storm', '🌪️', '市场暴跌，家族的银行也受到冲击。|The markets crash, and the family bank is hit.', [
      O('连夜开会稳住局面|Stay up all night to steady things', RC(.6, '你们挺过来了，还低价收购了一家同行。|You weathered it — and bought a rival cheaply.', { money: 50000, fame: 4 }, '损失惨重，但根基还在。|Heavy losses, but the foundations held.', { money: -30000, happy: -5 })),
      O('听长辈的，按兵不动|Follow the elders and hold still', R('风暴过后，一切慢慢回来了。|After the storm, things slowly returned.', { eq: 2 }))
    ]),
    /* hotel dynasty */
    OE('or_ht_suite', 'hotelier', [6, 12], '总统套房的作业|Homework in the Suite', '🛎️', '放学后你都在自家酒店的套房写作业，管家会送来热牛奶。|After school you study in the family hotel\'s suite; the butler brings warm milk.', [
      O('和每个员工做朋友|Befriend every employee', R('厨师长偷偷教你做了一道招牌菜。|The head chef secretly taught you a signature dish.', { eq: 5, happy: 3 })),
      O('专心写作业|Just focus on homework', R('你的成绩一直很好。|Your grades stayed excellent.', { smarts: 3 }))
    ]),
    OE('or_ht_guest', 'hotelier', [14, 30], '难缠的客人|A Difficult Guest', '🧳', '一位明星客人对什么都不满意，前台快哭了。|A celebrity guest is unhappy with everything; the receptionist is near tears.', [
      O('亲自去处理|Handle it yourself', RC(.65, '你换了房、送了花，明星临走时说下次还来。|You changed the room and sent flowers; the star promised to come back.', { eq: 5, fame: 2 }, '明星还是在网上发了差评。|The star still posted a bad review.', { happy: -3, eq: 2 })),
      O('让经理去|Let the manager handle it', R('经理处理得很好。你学到了怎么用人。|The manager handled it well. You learned to delegate.', { eq: 2 }))
    ]),
    OE('or_ht_new', 'hotelier', [25, 55], '新酒店开业|A New Hotel Opens', '🏨', '家族要在海边开一家新酒店，由你全权负责。|The family is opening a seaside hotel, and it\'s all yours to run.', [
      O('按自己的想法设计|Design it your way', RC(.55, '开业第一年就成了网红打卡地。|In its first year it became an Instagram favourite.', { money: 40000, fame: 5, happy: 6 }, '设计太大胆，客人不买账。|Too bold — guests didn\'t take to it.', { money: -20000, happy: -4 })),
      O('沿用家族的老规矩|Stick to the family playbook', R('稳稳当当，口碑很好。|Steady, and well reviewed.', { money: 15000 }))
    ]),
    /* ---------- everyday moments ---------- */
    E('c_kite', [5, 10], '放风筝|Flying a Kite', '🪁', '春天的风很好，爸爸给你扎了一只风筝。|The spring wind is perfect, and Dad has made you a kite.', [
      O('越放越高|Let it fly higher and higher', R('线放完了，风筝变成了天上的一个小点。|The string ran out; the kite became a dot in the sky.', { happy: 6 })),
      O('让爸爸先放|Let Dad fly it first', R('爸爸跑得满头大汗，你笑得停不下来。|Dad ran himself sweaty and you couldn\'t stop laughing.', { happy: 4, par: 3 }))
    ], { if: function () { return N.rel('father').length > 0; } }),
    E('c_spelling', [7, 11], '听写比赛|The Spelling Bee', '🔤', '班里举行听写比赛，最后只剩你和班长。|At the class spelling contest, it\'s down to you and the class monitor.', [
      O('沉着应对|Keep calm', RC(.5, '你赢了！奖品是一本字典。|You won! The prize was a dictionary.', { smarts: 3, happy: 5 }, '最后一个字写错了一笔。|You got one stroke wrong on the last word.', { smarts: 2, happy: -1 })),
      O('紧张得发抖|Shake with nerves', R('得了第二名，也很不错。|Second place is still great.', { smarts: 1, happy: 2 }))
    ]),
    E('t_science_fair', [12, 17], '科技节|The Science Fair', '🔬', '学校科技节，你想做一个作品参赛。|The school science fair is coming and you want to enter.', [
      O('做一个净水装置|Build a water purifier', RC(.55, '你的作品拿了一等奖，还被送到市里展出。|Your entry won first prize and went on to the city exhibition.', { smarts: 5, fame: 1 }, '装置漏水了，评委们笑着帮你擦桌子。|It leaked; the judges laughed and helped mop up.', { smarts: 2, happy: 1 })),
      O('做一个会走路的机器人|Build a walking robot', R('它走了三步就倒了，但大家都围过来看。|It took three steps and fell over, but everyone crowded round.', { smarts: 3, happy: 4 }))
    ]),
    E('t_first_job', [16, 19], '第一份暑期工|Your First Summer Job', '🧃', '暑假你在一家奶茶店打工。|You work at a bubble-tea shop for the summer.', [
      O('认真学手艺|Learn the trade properly', R('店长说你摇的奶茶最好喝。|The manager said your tea was the best.', { money: 600, eq: 3 })),
      O('只为了攒钱|Just for the money', R('你攒够了买新耳机的钱。|You saved enough for new headphones.', { money: 800, happy: 3 }))
    ]),
    E('a_promotion_dinner', [25, 50], '升职饭局|The Promotion Dinner', '🥘', '你升职了，部门同事起哄要你请客。|You\'ve been promoted, and the team insists you treat them.', [
      O('请大家吃顿好的|Treat everyone to a feast', R('那天之后，大家干活都格外卖力。|After that, everyone worked extra hard.', { eq: 4, money: -400, perf: 5 })),
      O('改天再说|Some other time', R('有人在背后小声说你小气。|Someone muttered that you were stingy.', { eq: -1 }))
    ], { if: function (S2, p) { return !!p.job && p.job.rank >= 1; } }),
    E('a_neighbor', [25, 70], '新邻居|New Neighbours', '🚪', '隔壁搬来了一家人，孩子正在楼道里哭。|A family moves in next door; their child is crying in the hallway.', [
      O('送一盘水果过去|Bring over a plate of fruit', R('后来两家常常串门，孩子叫你“干爸/干妈”。|The families became close; the child calls you godparent.', { happy: 5, karma: 3 })),
      O('关上门|Close the door', R('楼道很快安静了。|The hallway soon went quiet.', {}))
    ]),
    E('a_car_trip', [25, 60], '自驾游|A Road Trip', '🚗', '假期到了，你想开车去一个从没去过的地方。|The holidays are here, and you want to drive somewhere new.', [
      O('沿海岸线一路开|Follow the coast', R('你在一个不知名的小渔村看到了最美的日落。|In a nameless fishing village you saw the most beautiful sunset.', { happy: 8, money: -500 })),
      O('去山里露营|Camp in the mountains', R('夜里满天星星，你很久没这么安静过。|At night the sky was full of stars; you hadn\'t felt so still in years.', { happy: 6, health: 2, money: -300 }))
    ]),
    E('m_teen_talk', [38, 60], '孩子的心事|Your Child\'s Secret', '🤫', '{n}最近总是闷闷不乐。|{n} has seemed down lately.', [
      O('找个时间好好聊聊|Make time to talk', function (c) { N.addAff(c.npc, 8); return '{n}终于说了：被同学孤立了。你们一起想了办法。|{n} finally said: being left out at school. You worked it out together.'; }),
      O('给点零花钱让{n}开心|Give {n} some pocket money', function (c) { c.money(-c.$(200)); N.addAff(c.npc, 2); return '{n}说了声谢谢，回了房间。|{n} said thanks and went back to their room.'; })
    ], { prep: function (c) { var k = N.rel('child').filter(function (x) { return N.age(x) >= 12 && N.age(x) <= 17; })[0]; if (!k) return false; c.npc = k; c.prm.n = k.name; } }),
    E('m_anniversary', [30, 80], '结婚纪念日|Your Anniversary', '💍', '今天是你们的结婚纪念日。|Today is your wedding anniversary.', [
      O('精心准备惊喜|Plan a surprise', function (c) { var n = N.spouse(); if (n) N.addLove(n, 8); H.fx(c, { happy: 6, money: -300 }); return '你把第一次约会的地方原样布置了一遍。|You recreated the place of your first date.'; }),
      O('一起在家吃顿饭|A quiet dinner at home', function (c) { var n = N.spouse(); if (n) N.addLove(n, 4); H.fx(c, { happy: 4 }); return '简单，但很温暖。|Simple, and warm.'; })
    ], { if: function () { return !!N.spouse(); } }),
    E('o_photo_album_kids', [60, 100], '孩子们回来了|The Children Come Home', '🏡', '过年了，孩子们都回来了，家里一下子热闹起来。|It\'s the New Year, and all your children have come home.', [
      O('张罗一大桌菜|Cook a huge feast', function (c) { N.rel('child').forEach(function (k) { N.addAff(k, 4); }); H.fx(c, { happy: 8 }); return '你忙了一整天，看着他们吃，比自己吃还香。|You cooked all day; watching them eat was better than eating yourself.'; }),
      O('拍一张全家福|Take a family photo', function (c) { H.fx(c, { happy: 6 }); return '照片挂在了客厅最显眼的地方。|The photo hangs in the most prominent spot in the living room.'; })
    ], { if: function () { return N.rel('child').filter(function (k) { return N.age(k) >= 20; }).length >= 2; } }),
    E('o_chess_park', [62, 100], '公园里的棋局|A Game in the Park', '♟️', '公园里一位老人邀请你下一盘棋。|An old man in the park invites you to a game.', [
      O('认真下|Play seriously', RC(.5, '你赢了，他约你明天再来。|You won; he asked you to come again tomorrow.', { happy: 5, smarts: 1 }, '你输了，但聊得很开心。|You lost, but had a great talk.', { happy: 4 })),
      O('故意输给他|Let him win', R('他高兴得像个孩子。|He was as happy as a child.', { happy: 3, karma: 2 }))
    ]),
    E('o_teach_skill', [65, 100], '把手艺传下去|Passing On Your Craft', '🧶', '一个年轻人想向你学你最拿手的东西。|A young person wants to learn what you do best.', [
      O('倾囊相授|Teach everything you know', R('一年后，那个年轻人出师了，第一件作品送给了你。|A year later they finished training and gave you their first piece.', { happy: 7, karma: 4 })),
      O('只教一点皮毛|Teach just the basics', R('年轻人还是很感激。|They were grateful all the same.', { happy: 2 }))
    ])
  ]);
})();
