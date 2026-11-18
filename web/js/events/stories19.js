/* Version 1.9 stories: eight more great dynasties, each with storylines of its own; monarchs, tycoons and generals get
   events that fit who they are; children with big plans ask for your backing; half-siblings born outside the marriage. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function npc(id) { return id && S().npcs[id]; }

  /* ======================= eight more dynasties ======================= */
  var DYN = [
    { id: 'diamond', n: '钻石王朝|Diamond Dynasty', d: '曾祖父在南非的矿坑里捡到了第一颗钻石。如今，全世界每五颗钻石里，就有一颗经过你家的手。|Your great-grandfather picked up the first stone in a South African pit. Today one diamond in five passes through your family\'s hands.', w: [60000000, 600000000], inc: [3000000, 15000000], job: ['钻石集团主席|Chair of a Diamond Group', '珠宝帝国掌门人|Head of a Jewellery Empire'], st: { looks: 4, eq: 4 }, sib: [1, 3] },
    { id: 'media', n: '传媒帝国|Media Empire', d: '报纸、电视台、流媒体平台——你家决定了半个国家每天早上看到什么新闻。|Newspapers, TV networks, a streaming platform — your family decides what half the country reads each morning.', w: [40000000, 400000000], inc: [2500000, 12000000], job: ['传媒集团董事长|Media Group Chair', '电视网总裁|TV Network President'], st: { eq: 6, smarts: 3 }, sib: [1, 3] },
    { id: 'pharma', n: '制药世家|Pharmaceutical Dynasty', d: '家族药厂研发的一种药，救过几千万人的命。实验室比你家的客厅还大。|A drug from the family labs has saved tens of millions of lives. The laboratory is bigger than your living room.', w: [50000000, 500000000], inc: [3000000, 14000000], job: ['制药集团董事长|Pharma Group Chair', '首席科学家|Chief Scientist'], st: { smarts: 7 }, sib: [0, 2] },
    { id: 'autodyn', n: '汽车王朝|Automotive Dynasty', d: '你的姓氏就印在全世界几千万辆车的车标上。|Your surname is on the badge of tens of millions of cars.', w: [80000000, 800000000], inc: [4000000, 20000000], job: ['汽车集团董事长|Carmaker Chair', '赛车部门总监|Head of Motorsport'], st: { health: 3, smarts: 3, eq: 2 }, sib: [1, 3] },
    { id: 'chaebol', n: '财阀世家|A Chaebol Family', d: '从手机、造船到百货商场，你家的集团几乎什么都做。人们说，一辈子都逃不开你家的产品。|Phones, shipyards, department stores — the family conglomerate does almost everything. People say you can\'t live a day without its products.', w: [200000000, 2000000000], inc: [8000000, 40000000], job: ['集团会长|Group Chairman', '集团副会长|Group Vice-Chairman'], st: { smarts: 4, eq: 3 }, sib: [1, 3] },
    { id: 'gulf', n: '海湾财阀|A Gulf Merchant House', d: '你家在海湾经商已经七代人了。家里的私人飞机比亲戚还多。|Your family has traded on the Gulf for seven generations. There are more private jets than cousins.', w: [150000000, 1500000000], inc: [6000000, 30000000], job: ['家族商号掌门人|Head of the Merchant House', '主权基金董事|Sovereign Fund Director'], st: { eq: 5 }, sib: [2, 5] },
    { id: 'oldmoney', n: '欧洲老钱|European Old Money', d: '家族在阿尔卑斯山下有一座城堡，墙上挂着十七代祖先的画像。没有人记得钱最早是怎么来的。|The family has a castle below the Alps and seventeen generations of portraits on its walls. Nobody remembers where the money first came from.', w: [80000000, 800000000], inc: [3000000, 12000000], job: ['家族信托主席|Chair of the Family Trust', '私人银行合伙人|Private Bank Partner'], st: { looks: 4, eq: 5, smarts: 2 }, sib: [1, 3] },
    { id: 'aero', n: '航空航天世家|Aerospace Dynasty', d: '爷爷造了国家第一架喷气式客机，爸爸的公司正在造回收火箭。|Grandpa built the nation\'s first jet airliner; Dad\'s company is building reusable rockets.', w: [70000000, 700000000], inc: [3500000, 16000000], job: ['航天集团董事长|Aerospace Group Chair', '首席工程师|Chief Engineer'], st: { smarts: 8 }, sib: [0, 2] }
  ];
  DYN.forEach(function (o) { o.vip = 0; o.fl = ['rich']; if (!G.ORIGIN[o.id]) { G.ORIGINS.push(o); G.ORIGIN[o.id] = o; } });
  var DYN_IDS = DYN.map(function (o) { return o.id; });
  G.DYN19 = DYN_IDS;
  var fc = G.famClass;
  if (fc) G.famClass = function () { var c = fc.apply(this, arguments), p = S() && S().p; if (p && DYN_IDS.indexOf(p.origin) >= 0 && !p.flags.trafficked) c = Math.max(c, 3); return c; };
  function OX(id, org, a, title, icon, t, o, w) { return E(id, a, title, icon, t, o, { w: w || 3, if: function (S2, p) { return p.origin === org && !p.jail; } }); }
  function dad() { return N.rel('father', 'mother').filter(function (n) { return n.alive; })[0]; }

  G.evs([
    /* diamond */
    OX('d9_diamond_first', 'diamond', [6, 12], '第一颗原石|Your First Rough Stone', '💎', '爷爷把一块灰扑扑的石头放进你手心：“猜猜它值多少钱？”|Grandpa puts a dull grey pebble in your palm: "Guess what it\'s worth."', [
      O('说“一块钱”|Say "one dollar"', R('“两百万。”爷爷笑着说，“记住：最值钱的东西，一开始都不起眼。”|"Two million," he laughed. "Remember: the most valuable things look like nothing at first."', { smarts: 3, happy: 4 })),
      O('举起来对着光看|Hold it up to the light', R('爷爷愣了一下：“你天生就是干这行的。”|Grandpa paused. "You were born for this trade."', { smarts: 4, eq: 2, flag: 'gemEye' }))
    ]),
    OX('d9_diamond_mine', 'diamond', [16, 30], '矿区|The Mine', '⛏️', '你第一次跟着去非洲的矿区。工人们住在铁皮房里，每天下矿十二个小时。|For the first time you visit the mines in Africa. The workers live in tin shacks and go underground twelve hours a day.', [
      O('推动给矿工盖学校和医院|Push to build schools and clinics for the miners', R('董事会吵了三个月。最后，第一所学校以你的名字命名。|The board fought for three months. In the end, the first school bore your name.', { karma: 8, fame: 3, par: -3 })),
      O('这是生意|This is business', R('你在利润表上签了字。回程的飞机上，你一直没睡着。|You signed off on the profit sheet. On the flight home, you couldn\'t sleep.', { money: 200000, karma: -4 }))
    ]),
    OX('d9_diamond_heist', 'diamond', [25, 70], '金库失窃|The Vault Heist', '🕵️', '安特卫普的金库被盗，丢了价值三亿的钻石。警方怀疑有内鬼。|The Antwerp vault has been robbed — $300 million in stones. The police suspect an inside job.', [
      O('亲自调查|Investigate yourself', RC(function (c) { return .35 + c.p.st.smarts / 200; }, '你从监控里发现，跟了家族三十年的老保安每次换班都多停留七秒。钻石追回了大半。|On the tapes you noticed the family\'s guard of thirty years lingered seven seconds at every shift change. Most of the stones were recovered.', { fame: 4, smarts: 2, money: 500000 }, '线索断了。保险赔了一部分，剩下的成了家族的耻辱。|The trail went cold. Insurance covered part; the rest became a family shame.', { money: -2000000, stress: 10 })),
      O('交给警方|Leave it to the police', R('两年后，钻石在黑市上零零星星地出现。|Two years later, the stones trickled onto the black market.', { stress: 4 }))
    ]),
    /* media */
    OX('d9_media_front', 'media', [8, 14], '头版|The Front Page', '📰', '爸爸让你决定明天报纸头版用哪张照片。|Dad lets you choose tomorrow\'s front-page photo.', [
      O('选一张救火英雄的照片|A firefighter carrying a child', R('那张照片被评为年度新闻图片。|It became the news photo of the year.', { eq: 3, happy: 6 })),
      O('选一张明星的绯闻照|A celebrity caught kissing', R('那天报纸卖光了。爸爸说你“有商业头脑”。|The paper sold out. Dad said you had "commercial instincts".', { smarts: 2, karma: -1 }))
    ]),
    OX('d9_media_scoop', 'media', [22, 60], '独家|The Scoop', '🗞️', '你手下的记者拿到了一位部长的丑闻证据。部长的秘书打来电话：“开个价。”|One of your reporters has proof of a minister\'s scandal. The minister\'s secretary calls: "Name your price."', [
      O('照发不误|Run the story', R('部长下台了。你的报纸被告了七次，七次都赢了。|The minister resigned. Your paper was sued seven times and won every one.', { fame: 8, karma: 6, stress: 8 })),
      O('压下来，换一个人情|Kill it, for a favour', R('那位部长后来帮你拿下了一张广播牌照。你的记者辞职了。|The minister later helped you win a broadcasting licence. Your reporter quit.', { money: 3000000, karma: -8 }))
    ]),
    /* pharma */
    OX('d9_pharma_lab', 'pharma', [7, 13], '实验室参观日|Lab Open Day', '🧪', '你穿上小一号的白大褂，在实验室里看见了一只发着绿光的老鼠。|In a child-sized lab coat, you see a mouse that glows green.', [
      O('问它为什么发光|Ask why it glows', R('首席科学家给你讲了一下午的基因。那天起，你想当科学家。|The chief scientist explained genes all afternoon. From that day you wanted to be a scientist.', { smarts: 6 })),
      O('偷偷给它起名字|Secretly give it a name', R('它叫“小绿”。研究报告的致谢里，真的出现了这个名字。|You called it Greenie — and that name really appeared in the paper\'s acknowledgements.', { happy: 6, eq: 2 }))
    ]),
    OX('d9_pharma_price', 'pharma', [25, 70], '定价会|The Pricing Meeting', '💊', '公司新研发的抗癌药要定价了。财务部建议一盒定价三万美元。|The new cancer drug needs a price. Finance recommends $30,000 a box.', [
      O('在穷国按成本价卖|Sell at cost in poorer countries', R('利润少了很多，但联合国给你家颁了一枚奖章。|Profits fell sharply — and the UN gave the family a medal.', { fame: 8, karma: 10, money: -1000000 })),
      O('按建议定价|Take Finance\'s number', R('股价涨了百分之二十。一个病人的女儿在网上骂了你一整年。|The share price rose 20%. A patient\'s daughter cursed you online for a year.', { money: 4000000, karma: -6 }))
    ]),
    /* auto */
    OX('d9_auto_first', 'autodyn', [12, 17], '第一次开车|Your First Drive', '🏎️', '十二岁生日，爸爸带你去了家族的赛道，把一辆还没上市的新车钥匙交给了你。|On your twelfth birthday Dad takes you to the family test track and hands you the keys to a car not yet released.', [
      O('一脚油门踩到底|Floor it', RC(.7, '你跑出了比试车手还快的一圈。工程师们都围了过来。|You lapped faster than the test driver. The engineers crowded round.', { happy: 12, fame: 1 }, '你冲出了赛道，撞进了草堆。车没事，你也没事，但妈妈不让你再来了。|You spun off into the hay bales. Car and you fine — but Mum banned you.', { health: -3, par: -2 })),
      O('慢慢开，感受每一个弯|Take it slow and feel every corner', R('你回来说：“第三个弯的转向有点虚。”工程师们改了三个月。|You came back and said "The steering\'s vague in turn three." The engineers spent three months fixing it.', { smarts: 4 }))
    ]),
    OX('d9_auto_recall', 'autodyn', [25, 70], '召回|The Recall', '⚠️', '一款车型的刹车系统被发现有隐患。召回要花二十亿。|A brake fault has been found in one model. A recall would cost two billion.', [
      O('立刻全球召回|Recall worldwide, now', R('股价暴跌，但三年后，你家的车成了最被信任的品牌。|The shares tanked — and three years later yours was the most trusted brand in the world.', { karma: 8, fame: 5, money: -3000000 })),
      O('先悄悄观察|Quietly monitor it first', RC(.5, '运气好，没出事。|Luck held — nothing happened.', { money: 1000000 }, '一场车祸让事情曝光了。你在国会听证会上站了六个小时。|A crash exposed it. You stood six hours before a parliamentary hearing.', { fame: -10, stress: 20, money: -8000000 }))
    ]),
    /* chaebol */
    OX('d9_chaebol_seat', 'chaebol', [8, 14], '家族晚宴的座位|The Seating at Dinner', '🍱', '每年的家族晚宴，谁坐得离会长最近，大家都看在眼里。今年，你的座位被往前挪了两个。|At the annual family dinner, everyone notices who sits nearest the chairman. This year your seat moved two places closer.', [
      O('乖巧地给爷爷倒酒|Pour Grandfather\'s drink, sweetly', R('爷爷摸了摸你的头。堂兄的脸色很难看。|Grandfather patted your head. Your cousin\'s face darkened.', { eq: 4, flag: 'chaebolFav' })),
      O('当作什么都没发生|Act as if nothing happened', R('你埋头吃饭。大人们的眼神在桌子上来回飞。|You ate with your head down while the adults\' glances flew across the table.', { smarts: 2 }))
    ]),
    OX('d9_chaebol_war', 'chaebol', [25, 60], '继承之战|The War of Succession', '♟️', '会长病倒了。叔叔开始私下收购集团的股份。|The chairman has fallen ill. Your uncle has started quietly buying group shares.', [
      O('联合小股东反击|Rally the minority shareholders', RC(function (c) { return .4 + c.p.st.eq / 200; }, '股东大会上，你以百分之三的优势胜出，成了集团的继承人。|At the shareholders\' meeting you won by three per cent and became heir to the group.', { fame: 10, money: 5000000, stress: 12 }, '叔叔赢了。你被派去了海外分公司。|Your uncle won. You were sent to run the overseas branch.', { happy: -10, stress: 10 })),
      O('退出，不想卷进去|Step aside; you want no part of it', R('你搬去了国外，开了一家小画廊。家族的人说你“没出息”。你觉得很自由。|You moved abroad and opened a small gallery. The family called you a disappointment. You felt free.', { happy: 8, stress: -10 }))
    ]),
    /* gulf */
    OX('d9_gulf_falcon', 'gulf', [8, 14], '猎鹰|The Falcon', '🦅', '十岁生日，叔叔送了你一只猎鹰。它值一辆跑车的钱。|For your tenth birthday, your uncle gives you a falcon worth as much as a sports car.', [
      O('天天带它去沙漠训练|Train it in the desert every day', R('第二年，你的猎鹰在王室猎鹰大赛里拿了第三。|The next year your falcon came third in the royal falconry cup.', { happy: 8, health: 2, fame: 1 })),
      O('请专业的驯鹰师|Hire a professional falconer', R('驯鹰师把它训得很好。但它只认驯鹰师。|The falconer trained it well — but it only answered to him.', { happy: 3 }))
    ]),
    OX('d9_gulf_majlis', 'gulf', [20, 60], '议事厅|The Majlis', '🏛️', '家族长辈第一次让你坐在议事厅里，听他们讨论一笔两百亿的投资。|For the first time the elders let you sit in the majlis as they debate a twenty-billion investment.', [
      O('鼓起勇气发言|Find the courage to speak', RC(function (c) { return .35 + c.p.st.smarts / 200; }, '你指出了合同里的一个陷阱。长辈们沉默了一会儿，然后改了方案。|You pointed out a trap in the contract. The elders were silent — then changed the plan.', { fame: 3, smarts: 3, money: 1000000 }, '一位长辈打断了你：“年轻人，先听。”|An elder cut you off: "Young one — listen first."', { eq: 2, happy: -3 })),
      O('只听不说|Listen, say nothing', R('那一晚你学到的东西，比读四年商学院还多。|You learned more that night than in four years of business school.', { smarts: 4, eq: 2 }))
    ]),
    /* old money */
    OX('d9_old_portrait', 'oldmoney', [7, 13], '祖先画像|The Ancestors\' Portraits', '🖼️', '城堡的长廊里挂着十七幅画像。管家说，第十八幅的位置是留给你的。|Seventeen portraits line the castle gallery. The butler says the eighteenth space is kept for you.', [
      O('问每一位祖先的故事|Ask about every ancestor', R('有一位是将军，有一位是诗人，还有一位据说是个赌徒，输掉过半个城堡。|One was a general, one a poet — and one, they say, a gambler who lost half the castle.', { smarts: 4, happy: 3 })),
      O('对着空位做鬼脸|Pull a face at the empty space', R('管家假装没看见，嘴角却在偷笑。|The butler pretended not to see, but he was smiling.', { happy: 5 }))
    ]),
    OX('d9_old_debut', 'oldmoney', [16, 22], '初入社交界|Your Debut', '💃', '维也纳的社交季开始了。你要在舞会上第一次正式亮相。|The Vienna season begins. You make your formal debut at the ball.', [
      O('跳开场华尔兹|Open the ball with the first waltz', R('第二天，三家报纸登了你的照片。邀请函像雪片一样飞来。|The next day three papers ran your photo. Invitations poured in like snow.', { looks: 2, fame: 3, happy: 8 })),
      O('躲在阳台上和一个陌生人聊天|Hide on the balcony talking to a stranger', function (c) { var n = N.make({ rel: 'friend', age: c.p.age + G.ri(-1, 3), aff: 50, c: c.p.country }); n.pin = 1; c.prm.n = n.name; H.fx(c, { happy: 6, eq: 2 }); return '你们聊到舞会结束。后来你才知道，{n}是另一个古老家族的继承人。|You talked until the ball ended. Only later did you learn {n} was heir to another ancient house.'; })
    ]),
    /* aerospace */
    OX('d9_aero_launch', 'aero', [8, 14], '发射|The Launch', '🚀', '你站在发射场的控制室里，倒计时只剩十秒。爸爸紧紧握着你的手。|You stand in launch control as the countdown hits ten. Dad grips your hand.', [
      O('跟着一起倒数|Count down with them', RC(.8, '火箭升空，十分钟后，一级助推器稳稳落回了地面。整个控制室都疯了。|The rocket rose; ten minutes later the booster landed upright. The control room went wild.', { happy: 12, smarts: 3 }, '火箭在空中炸成了一团火球。爸爸一句话也没说，转身去开事故分析会。|The rocket exploded into a fireball. Dad said nothing and went straight to the failure review.', { eq: 4, stress: 6 })),
      O('偷偷许个愿|Make a secret wish', R('你许愿有一天能亲自坐上去。|You wished that one day you would ride one yourself.', { happy: 4, flag: 'aeroDream' }))
    ]),
    OX('d9_aero_contract', 'aero', [25, 65], '国家订单|The Government Contract', '🛰️', '政府要在你家和竞争对手之间选一家，承建下一代空间站。|The government will choose between your firm and a rival to build the next space station.', [
      O('押上全部，做最好的方案|Bet everything on the best design', RC(function (c) { return .45 + c.p.st.smarts / 250; }, '你们赢了。合同金额能让公司再干二十年。|You won — a contract to keep the company busy for twenty years.', { money: 10000000, fame: 8, stress: 10 }, '对手赢了。你们裁掉了三分之一的工程师。|The rival won. You laid off a third of your engineers.', { money: -5000000, stress: 15, happy: -8 })),
      O('和对手联合投标|Bid jointly with the rival', R('两家各拿一半。分不到最大的蛋糕，但谁也没输。|Each got half. Not the biggest slice — but nobody lost.', { money: 4000000, eq: 3 }))
    ])
  ]);

  /* ======================= rulers, tycoons, stars: their own storylines ======================= */
  function monarch(S2, p) { return !!p.flags.monarch && !p.jail; }
  function tycoon(S2, p) { return G.netWorth() > G.$(5e7) && !p.flags.monarch && !p.jail; }
  G.evs([
    E('k9_misdial', [20, 100], '深夜的电话|A Call in the Night', '☎️', '凌晨两点，你的私人电话响了。是一位已经退休的老首相：“陛下，有件事我憋了三十年，必须告诉您。”|At 2 a.m. your private line rings. A long-retired prime minister: "Your Majesty, there is something I have kept for thirty years that you must know."', [
      O('听他说完|Hear him out', R('他讲了一桩发生在你出生前的宫廷秘密。挂断电话后，你看着窗外，一直坐到天亮。|He told you a palace secret from before you were born. When he hung up, you sat by the window until dawn.', { smarts: 3, eq: 3, stress: 4 })),
      O('“明天来宫里说吧。”|"Come to the palace tomorrow."', R('第二天，他没有来。他的秘书说，老先生昨夜在睡梦中走了。|He never came. His secretary said the old man had died in his sleep that night.', { eq: 4, happy: -4 }))
    ], { if: monarch, w: 1.5 }),
    E('k9_heir_lesson', [35, 90], '储君的功课|The Heir\'s Lessons', '👑', '你的继承人今年要开始学习治国了。由谁来教，你说了算。|Your heir begins learning statecraft this year. Who teaches is your decision.', [
      O('亲自教|Teach them yourself', function (c) { var k = N.rel('child').filter(function (n) { return n.alive; })[0]; if (k) G.dPush('aff', N.addAff(k, 10)); H.fx(c, { eq: 3, stress: 4 }); return '每周四下午，你们在书房里一待就是三个小时。|Every Thursday afternoon you spent three hours together in the study.'; }),
      O('请最好的老师|Hire the finest tutors', R('老师们很称职。只是你的孩子说，他们更想要爸爸妈妈。|The tutors were excellent. Your child said they would rather have had you.', { money: -200000 }))
    ], { if: function (S2, p) { return monarch(S2, p) && N.rel('child').some(function (n) { return n.alive && N.age(n) >= 10 && N.age(n) <= 25; }); }, w: 1.5 }),
    E('k9_republic', [25, 100], '废除君主制的呼声|Calls for a Republic', '📣', '一份要求废除君主制的请愿书收集到了一百万个签名。|A petition to abolish the monarchy has gathered a million signatures.', [
      O('公开回应，承诺改革王室开支|Answer publicly; cut royal spending', R('你把三座行宫交给了国家。民调里，王室的支持率回升了十个点。|You gave three palaces to the nation. The crown\'s approval rose ten points.', { fame: 5, karma: 5, money: -2000000 })),
      O('保持沉默|Stay silent', RC(.6, '风波慢慢过去了。|The storm slowly blew over.', { stress: 6 }, '请愿变成了游行。你第一次感受到了王冠的重量。|The petition became a march. For the first time you felt the weight of the crown.', { stress: 15, fame: -5 }))
    ], { if: monarch, w: .8 }),
    E('k9_jubilee', [30, 110], '登基纪念|The Jubilee', '🎆', '今年是你登基的纪念年。全国放假三天。|This year marks your accession anniversary. The nation takes three days off.', [
      O('乘敞篷马车巡游全城|Ride through the capital in an open carriage', R('沿途站了一百万人。一个老兵向你敬了一个颤巍巍的军礼。|A million people lined the route. An old soldier gave you a trembling salute.', { fame: 6, happy: 10 })),
      O('把庆典的钱捐给医院|Give the celebration budget to hospitals', R('报纸说，这是最有意义的一次纪念。|The papers called it the most meaningful jubilee ever.', { karma: 8, fame: 4 }))
    ], { if: function (S2, p) { return monarch(S2, p) && p.flags.monarch && (S2.year - (p.flags.monarch.y || S2.year)) % 10 === 5; }, w: 4 }),
    E('t9_yacht', [25, 90], '游艇上的谈判|Negotiation on the Yacht', '🛥️', '一位竞争对手邀请你上他的游艇，开出了一个收购你一半产业的价格。|A rival invites you aboard his yacht and offers to buy half your empire.', [
      O('当场还价|Counter on the spot', RC(function (c) { return .4 + c.p.st.eq / 200; }, '你们在甲板上谈到日落，他多给了你三成。|You talked on deck until sunset; he added thirty per cent.', { money: 5000000, eq: 2 }, '他笑了笑：“那就当我没说。”|He smiled. "Then forget I asked."', { stress: 3 })),
      O('客气地拒绝|Politely decline', R('你们喝完了那瓶酒，什么都没谈成，却成了朋友。|You finished the bottle, agreed nothing, and became friends.', { eq: 3 }))
    ], { if: tycoon, w: 1.5 }),
    E('t9_heir_drama', [45, 90], '家产|The Family Fortune', '🗂️', '你的几个孩子在律师事务所吵了起来，为了将来谁拿得多。|Your children argue at the lawyer\'s office about who will get more someday.', [
      O('把他们都叫回家吃一顿饭|Bring them all home for dinner', function (c) { N.rel('child').forEach(function (n) { if (n.alive) N.addAff(n, 4); }); H.fx(c, { eq: 3, stress: -3 }); return '饭桌上没人提钱。临走时，老大抱了抱老二。|Nobody mentioned money at dinner. Leaving, the eldest hugged the second.'; }),
      O('宣布全部捐掉|Announce you\'ll give it all away', R('他们愣住了。这是这些年来他们第一次站在同一边——一起反对你。|They froze. For the first time in years they were on the same side — against you.', { fame: 4, karma: 4 }))
    ], { if: function (S2, p) { return tycoon(S2, p) && N.rel('child').filter(function (n) { return n.alive && N.age(n) >= 18; }).length >= 2; }, w: 1.5 })
  ]);

  /* ======================= children with big plans ======================= */
  G.evs([
    { id: 'k9_study_plan', sys: 1, title: function (c) { return G.L('{n}的决定|{n}\'s Decision', { n: c.npc.name }); }, icon: '🎒',
      prep: function (c) {
        var k = c.npc; if (!k || !k.alive) return false; var a = N.age(k); if (a < 16 || a > 24) return false;
        var to = G.pick(['sg', 'us', 'gb', 'ch', 'jp', 'au', 'ca', 'fr'].filter(function (x) { return x !== c.p.country && G.C[x]; }));
        c.prm.n = k.name; c.prm.c = G.C[to].n; c.prm.to = to; c.prm.cost = G.$(G.ri(120, 400) * 10000); c.prm.m = G.M(c.prm.cost);
        var sib = N.rel('child').filter(function (n) { return n.alive && n !== k && N.age(n) >= 18 && (n.wealth || 0) > c.prm.cost; })[0];
        if (sib) { c.prm.sib = sib.id; c.prm.s = sib.name; }
      },
      t: '{n}鼓起勇气对你说：“我想去{c}读书。”全部算下来，大概要{m}。|{n} gathers their courage: "I want to study in {c}." All told, about {m}.',
      o: [
        { t: function (c) { return G.L('“去吧，钱我来出。”|"Go. I\'ll pay."'); }, run: function (c) { var k = c.npc, m = c.prm.cost; if (!G.payKid(k, m)) return '你翻遍了账户，凑不出这笔钱。{n}说：“没关系。”可你知道ta很难过。|You searched every account and couldn\'t raise it. {n} said "It\'s fine" — but you knew it wasn\'t.'; k.stayAbroad = G.ch(.4) ? c.prm.to : null; if (k.edu) { k.edu.abroad = c.prm.to; } G.dPush('aff', N.addAff(k, 15)); return '{n}抱着你哭了。出发那天，ta在登机口回头看了你三次。|{n} hugged you and cried. At the gate on departure day, they looked back at you three times.'; } },
        { t: function (c) { return c.prm.s ? G.L('{s}说：“我支持，钱我出一半。”|{s} says: "I\'m in — I\'ll pay half."', c.prm) : G.L('一起想办法凑|Work out a way together'); }, run: function (c) {
          var k = c.npc, sib = npc(c.prm.sib), m = c.prm.cost;
          if (sib) { var half = Math.round(m / 2); sib.wealth -= half; if (!G.payKid(k, m - half)) { sib.wealth += half; return '钱还是不够。|It still wasn\'t enough.'; } G.dPush('aff', N.addAff(k, 12)); N.addAff(sib, 8); k.edu && (k.edu.abroad = c.prm.to); return '{s}给{n}转了钱，留言说：“好好读，别给咱家丢人。”|{s} sent {n} the money with a note: "Study hard. Don\'t shame the family."'; }
          var half2 = Math.round(m * .5); if (!G.payKid(k, half2)) return '钱还是不够。|It still wasn\'t enough.'; G.dPush('aff', N.addAff(k, 8)); k.edu && (k.edu.abroad = c.prm.to); return '你出一半，{n}申请了奖学金和助学贷款。ta说毕业后一分一分还给你。|You paid half; {n} won a scholarship and a student loan, and swore to pay you back every penny.';
        } },
        { t: '“先在国内读，研究生再说。”|"Study here first. We\'ll see about a master\'s."', run: function (c) { G.dPush('aff', N.addAff(c.npc, -8)); return '{n}没说话，回了房间。那天晚上，ta的房间灯亮到很晚。|{n} said nothing and went to their room. The light stayed on late that night.'; } }
      ] }
  ]);

  /* ======================= half-siblings born outside the marriage ======================= */
  function halfSib(c) { var L = N.rel('sibling').filter(function (n) { return n.alive && n.illegit; }); if (!L.length) return false; var s = G.pick(L); c.prm.sid = s.id; c.prm.s = s.name; c.prm.par = s.half === 'mother' ? G.L('妈妈|Mum') : G.L('爸爸|Dad'); }
  G.evs([
    E('h9_holiday', [8, 40], '另一个家|The Other Household', '🏮', '过年的时候，{par}说要出去一趟。你知道，ta是去看{s}。|At New Year, {par} says they need to step out. You know they\'re going to see {s}.', [
      O('跟着一起去|Go along', function (c) { var s = npc(c.prm.sid); if (s) G.dPush('aff', N.addAff(s, 12)); H.fx(c, { eq: 4 }); return '{s}开门看到你，愣住了。然后ta说：“进来吧，饺子刚出锅。”|{s} opened the door, saw you and froze. Then: "Come in — the dumplings are just done."'; }),
      O('假装不知道|Pretend not to know', R('你在客厅里陪妈妈看春晚，一句话也没说。|You watched the gala with your mother in silence.', { stress: 4 })),
      O('当面质问|Confront them', function (c) { N.rel('father', 'mother').forEach(function (n) { if (n.alive) N.addAff(n, -6); }); H.fx(c, { stress: 6 }); return '那天晚上，家里吵了一整夜。|There was shouting all night.'; })
    ], { prep: halfSib, w: 1.6 }),
    E('h9_school', [10, 22], '同一所学校|The Same School', '🏫', '你发现{s}转学到了你的学校，还被分到了你隔壁班。|You discover {s} has transferred to your school — into the class next door.', [
      O('主动去打招呼|Go and say hello', function (c) { var s = npc(c.prm.sid); if (s) G.dPush('aff', N.addAff(s, 10)); return '你们在食堂坐到了一起。全校都在偷偷看你们。|You sat together in the canteen while the whole school watched.'; }),
      O('装作不认识|Act like strangers', function (c) { var s = npc(c.prm.sid); if (s) G.dPush('aff', N.addAff(s, -5)); return '你们在走廊擦肩而过，谁也没回头。|You passed in the corridor and neither looked back.'; })
    ], { prep: halfSib, w: 1.2 }),
    E('h9_will', [25, 70], '遗嘱里的名字|A Name in the Will', '📜', '律师宣读{par}的遗嘱时，念到了{s}的名字。家里其他人的脸色都变了。|As the lawyer reads {par}\'s will, {s}\'s name comes up. Everyone else\'s face changes.', [
      O('站出来支持{s}|Stand up for {s}', function (c) { var s = npc(c.prm.sid); if (s) G.dPush('aff', N.addAff(s, 20)); H.fx(c, { karma: 5, eq: 3 }); return '“ta也是爸妈的孩子。”你说。{s}的眼眶红了。|"They\'re our parent\'s child too," you said. {s}\'s eyes filled.'; }),
      O('请律师争取|Contest it through lawyers', function (c) { var s = npc(c.prm.sid); if (s) G.dPush('aff', N.addAff(s, -25)); H.fx(c, { money: 50000, karma: -4, stress: 8 }); return '你多分到了一点。你们从此不再来往。|You got a little more. You never spoke again.'; })
    ], { prep: function (c) { if (halfSib(c) === false) return false; if (N.rel('father', 'mother').some(function (n) { return n.alive; })) return false; }, w: 2 })
  ]);

  /* ======================= children with their own personalities ======================= */
  function kidP(pers, a0, a1) { return function (c) { var L = N.rel('child').filter(function (k) { var a = N.age(k); return k.alive && (!pers || pers.indexOf(k.pers) >= 0) && a >= a0 && a <= a1; }); if (!L.length) return false; var k = G.pick(L); c.prm.kid = k.id; c.prm.k = k.name; }; }
  function kaff(c, v) { var k = npc(c.prm.kid); if (k) G.dPush('aff', N.addAff(k, v)); }
  G.evs([
    E('kp9_nerd_comp', [30, 75], '奥赛|The Olympiad', '🧮', '{k}被选进了国家数学奥赛集训队，要封闭训练两个月。|{k} has been picked for the national maths olympiad squad — two months of closed training.', [
      O('每周去探望|Visit every week', function (c) { kaff(c, 8); return '{k}说，看到你就不紧张了。最后拿了一块银牌。|{k} said seeing you made the nerves go. They came home with silver.'; }),
      O('让ta专心训练|Let them focus', function (c) { kaff(c, 2); if (G.ch(.4)) { H.fx(c, { fame: 2, happy: 8 }); return '{k}拿了金牌！你在电视上看到ta举着奖牌，眼泪掉了下来。|{k} won gold! You saw them holding the medal on TV and wept.'; } return '{k}拿了铜牌，自己有点失望。|{k} won bronze and was a little disappointed.'; })
    ], { prep: kidP(['nerd'], 13, 18), w: 2 }),
    E('kp9_rebel_tattoo', [30, 75], '纹身|The Tattoo', '🖊️', '{k}回家时，胳膊上多了一条龙。|{k} comes home with a dragon on their arm.', [
      O('“挺好看的。”|"It looks good."', function (c) { kaff(c, 10); return '{k}愣住了，然后笑了：“你是第一个这么说的。”|{k} froze, then grinned. "You\'re the first to say that."'; }),
      O('禁足一个月|Ground them for a month', function (c) { kaff(c, -12); return '{k}从窗户溜出去了三次。|{k} climbed out of the window three times.'; })
    ], { prep: kidP(['rebel', 'boss'], 15, 22), w: 2 }),
    E('kp9_artsy_show', [30, 80], '第一次画展|A First Exhibition', '🎨', '{k}在一家小画廊办了人生第一次画展，邀请你去看。|{k} has their first exhibition at a small gallery and invites you.', [
      O('买下最大的那幅|Buy the biggest piece', function (c) { kaff(c, 12); H.fx(c, { money: -3000 }); return '那幅画后来挂在了你家客厅，所有来的人都要问一句。|It hung in your living room, and every guest asked about it.'; }),
      O('认真看完每一幅|Look carefully at every piece', function (c) { kaff(c, 8); H.fx(c, { eq: 2 }); return '你在一幅画前停了很久——画的是小时候的你们俩。|You stopped a long time before one painting: the two of you, when they were little.'; })
    ], { prep: kidP(['artsy', 'romantic'], 16, 30), w: 2 }),
    E('kp9_chill_gap', [35, 80], '间隔年|A Gap Year', '🎒', '{k}说大学毕业后不想马上工作，想背包旅行一年。|{k} says they don\'t want a job straight after graduating — they want a year with a backpack.', [
      O('“去吧，注意安全。”|"Go. Stay safe."', function (c) { kaff(c, 10); return '{k}每到一个地方就给你寄一张明信片。一年后，冰箱上贴满了。|{k} sent a postcard from every stop. A year later, the fridge was covered.'; }),
      O('“先工作再说。”|"Work first."', function (c) { kaff(c, -6); return '{k}进了一家公司，干得不开心，两年后还是去了。|{k} took a job, was miserable, and went anyway two years later.'; })
    ], { prep: kidP(['chill', 'cheer'], 21, 25), w: 2 }),
    E('kp9_gold_car', [35, 85], '豪车|The Supercar', '🏎️', '{k}发来一张跑车的照片：“生日礼物，这个就行。”|{k} sends a photo of a supercar: "For my birthday. This one will do."', [
      O('买|Buy it', function (c) { kaff(c, 8); H.fx(c, { money: -300000 }); return '{k}开着它出去了。一个月后，它出现在了二手车网站上。|{k} drove off in it. A month later it was listed for sale.'; }),
      O('“自己挣。”|"Earn it."', function (c) { kaff(c, -10); if (G.ch(.4)) return '{k}气了一个月。三年后，ta用自己挣的钱买了一辆，开回来给你看。|{k} sulked for a month. Three years later they drove one home — bought with their own money.'; return '{k}说你小气，好几个月没回家。|{k} called you stingy and stayed away for months.'; })
    ], { prep: kidP(['gold', 'playboy'], 18, 30), w: 2 }),
    E('kp9_clingy_call', [35, 85], '每天一个电话|A Call Every Day', '📞', '{k}工作了，还是每天晚上九点给你打电话。今天，九点过了，电话没响。|{k} works now but still phones you at nine every night. Tonight nine o\'clock passes. Nothing.', [
      O('打过去|Call them', function (c) { kaff(c, 6); return '{k}在加班，声音很累。你们聊了五分钟，ta说：“幸好你打来了。”|{k} was working late and sounded exhausted. Five minutes in, they said: "I\'m glad you called."'; }),
      O('忍住不打|Hold back', function (c) { H.fx(c, { eq: 3 }); return '十点十分，电话响了。“对不起，今天太忙了。”|At ten past ten it rang. "Sorry — crazy day."'; })
    ], { prep: kidP(['clingy', 'gentle'], 22, 40), w: 2 }),
    E('kp9_honest_found', [30, 80], '捡到的钱|The Money They Found', '💼', '{k}捡到一个装着十万块的包，在原地等了三个小时，交给了失主。|{k} found a bag with a hundred thousand in cash, waited three hours on the spot, and returned it.', [
      O('夸ta|Praise them', function (c) { kaff(c, 8); H.fx(c, { happy: 6 }); return '失主送来一面锦旗，上面写着“拾金不昧”。你把它挂在了客厅。|The owner sent a silk banner honouring their honesty. You hung it in the living room.'; }),
      O('半开玩笑说“傻孩子”|Joke: "Silly kid"', function (c) { kaff(c, -3); return '{k}很认真地说：“那不是我的。”你突然觉得ta比你更像大人。|{k} said, quite serious: "It wasn\'t mine." Suddenly they seemed more grown-up than you.'; })
    ], { prep: kidP(['honest', 'gentle', 'prag'], 10, 30), w: 2 })
  ]);
  var mt = G.money.tick;
  G.money.tick = function () {
    var r = mt.apply(this, arguments), s = S(), p = s.p;
    if (s.dead) return r;
    try {
      N.rel('child').forEach(function (k) { var a = N.age(k); if (k.alive && !k.planAsk && a >= 17 && a <= 22 && G.ch(.12)) { k.planAsk = 1; (s.pendQ = s.pendQ || []).push({ id: 'k9_study_plan', nid: k.id }); } });
    } catch (e) { console.error(e); }
    return r;
  };

  /* ======================= achievements ======================= */
  [
    { id: 'shop_brand', i: '🏪', n: '从小摊到品牌|From Stall to Brand', d: '把一家小生意做到最高级|Grow a small business to its top level', f: function (S2) { return (S2.assets.shops || []).some(function (x) { return x.lv >= 4; }); } },
    { id: 'phone_fan', i: '📱', n: '数码控|Gadget Lover', d: '买一部顶配新手机|Buy a top-of-the-range new phone', f: function (S2, p) { return !!(p.phone && /折叠屏|Foldable/.test(G.T(p.phone.n))); } },
    { id: 'dyn_new', i: '🏰', n: '顶级世家|A Great House', d: '出生在一个新的顶级世家|Be born into one of the new great dynasties', f: function (S2, p) { return DYN_IDS.indexOf(p.origin) >= 0; } },
    { id: 'kidnap_escape', i: '🗝️', n: '虎口脱险|Out of the Lion\'s Mouth', d: '从绑匪手里逃脱|Escape from kidnappers', f: function (S2, p) { return !!p.flags.kidEscape; } }
  ].forEach(function (a) { if (!G.ACH.some(function (x) { return x.id === a.id; })) G.ACH.push(a); });
})();
