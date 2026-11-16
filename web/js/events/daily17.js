/* Version 1.7: thirty small moments of ordinary life — the commute, the neighbours, the lift, the lost cat,
   the stranger who needs a hand. Most years are made of these. */
(function () {
  "use strict";
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function D(id, a, title, icon, t, o, w, f) { return E(id, a, title, icon, t, o, { w: w || 1.3, if: function (S, p) { return !p.jail && (!f || f(p)); } }); }
  function adult(p) { return p.age >= 18; }

  G.evs([
    D("dl_subway_seat", [16, 70], "地铁上的座位|A Seat on the Subway", "🚇", "早高峰的地铁上，你好不容易抢到一个座位。一位孕妇站在了你面前。|Rush hour: you’ve finally got a seat. A pregnant woman is standing in front of you.", [
      O("马上让座|Give it up at once", R("她笑着说了谢谢。你站了四十分钟，心情却很好。|She thanked you with a smile. You stood forty minutes and felt great.", { karma: 3, happy: 2 })),
      O("假装睡着|Pretend to be asleep", R("你闭着眼睛，一路都没睡着。|Eyes shut, you didn’t sleep a wink.", { karma: -3, stress: 2 }))
    ]),
    D("dl_neighbor_noise", [18, 90], "楼上的噪音|Noise from Upstairs", "🔊", "楼上邻居每天半夜都在拖椅子。你已经一周没睡好了。|The upstairs neighbours drag chairs around every midnight. You haven’t slept well in a week.", [
      O("带一盒水果上去聊聊|Take up a box of fruit and talk", RC(.75, "原来他们家老人得了失眠症，半夜睡不着。他们买了地毯，还送了你一罐自制的酱。|Their elderly father has insomnia and paces at night. They bought rugs and gave you homemade jam.", { eq: 3, happy: 3 }, "对方说“我们家又没吵”，砰地关上了门。|“We’re not making noise,” they said, and slammed the door.", { stress: 6 })),
      O("买一个震楼器|Buy a ceiling thumper", R("一场邻里大战开始了。|A neighbourhood war began.", { stress: 8, karma: -2 }))
    ], 1.3, adult),
    D("dl_lift", [10, 90], "被困电梯|Stuck in the Lift", "🛗", "电梯突然停在两层楼之间，里面只有你和一个哭闹的小孩。|The lift stops between floors — just you and a crying child.", [
      O("给孩子讲故事|Tell the child a story", R("救援人员打开门时，孩子正趴在你肩上听你讲第三个故事。孩子的妈妈连声道谢。|When rescuers opened the doors, the child was on your shoulder hearing story number three. The mother couldn’t thank you enough.", { eq: 4, karma: 4 })),
      O("一直按紧急按钮|Keep pressing the alarm", R("二十分钟后你们出来了。|You were out in twenty minutes.", { stress: 4 }))
    ]),
    D("dl_lost_cat", [8, 90], "走丢的猫|A Lost Cat", "🐈", "小区里贴满了寻猫启事。你在楼下的车底看到了一只一模一样的猫。|Lost-cat posters are everywhere. Under a car downstairs you spot the very same cat.", [
      O("用零食把它哄出来|Coax it out with treats", RC(.7, "你抱着猫敲开了主人的门。小女孩抱着猫哭了，坚持要把零花钱给你。|You carried the cat to its owner’s door. The little girl hugged it in tears and insisted on giving you her pocket money.", { karma: 6, happy: 6 }, "猫一溜烟跑了。你打电话告诉了主人位置。|It bolted. You called the owner with the location.", { karma: 3 })),
      O("拍照发给主人|Photograph it and send it to the owner", R("主人赶来抓到了猫，送了你一面小锦旗。|The owner came, caught it, and gave you a little banner.", { karma: 4 }))
    ]),
    D("dl_wrong_wechat", [14, 80], "发错的消息|A Message to the Wrong Person", "📱", "你把一条吐槽老板的消息，发到了公司大群里。|You sent a message ranting about your boss — to the company group chat.", [
      O("两分钟内撤回|Recall it within two minutes", RC(.6, "好像没人看到。你的心跳了一整天。|It seems no one saw. Your heart raced all day.", { stress: 6 }, "老板回了一个微笑的表情。|The boss replied with a smiley face.", { stress: 15, perf: -6 })),
      O("大方承认，顺便提几个建议|Own it and add some suggestions", RC(.4, "老板居然采纳了你的建议，还说“欢迎大家提意见”。|The boss actually took your suggestions: “Feedback welcome.”", { perf: 6, eq: 3 }, "你被叫进了办公室。|You were called into the office.", { perf: -10 }))
    ], 1.3, function (p) { return !!p.job; }),
    D("dl_old_photo", [20, 90], "老照片|An Old Photo", "🖼️", "整理旧物时，你翻出一张二十年前的合影，照片上的人有一半已经很多年没联系了。|Clearing out, you find a group photo from twenty years ago. You haven’t spoken to half of them in years.", [
      O("发到朋友圈，@每一个人|Post it and tag everyone", R("那天晚上，十几个老朋友在评论区聊到了凌晨。有人提议：“我们聚一聚吧。”|That night a dozen old friends chatted in the comments until dawn. Someone said: “Let’s meet up.”", { happy: 8, eq: 2 })),
      O("放回抽屉|Put it back in the drawer", R("你看了很久，才把它放回去。|You looked a long time before putting it away.", { eq: 1 }))
    ]),
    D("dl_street_musician", [10, 90], "街头艺人|A Street Musician", "🎻", "一个老人在寒风里拉二胡，琴盒里只有几枚硬币。|An old man plays the erhu in the cold wind; there are only a few coins in his case.", [
      O("放一张大钞，听完一整首|Drop a big note and listen to a whole piece", R("他拉的是你小时候外婆常哼的曲子。你站在那里，眼眶湿了。|It was the tune your grandmother used to hum. You stood there with wet eyes.", { karma: 4, eq: 3, money: -10 })),
      O("录一段视频发到网上|Film it and post it", RC(.3, "视频火了，第二天老人身边围满了人。|The video went viral; the next day a crowd surrounded him.", { karma: 6, fame: 1 }, "没什么人看。|Few people watched.", {}))
    ]),
    D("dl_rain_umbrella", [10, 80], "一把伞|An Umbrella", "☂️", "大雨里，一个陌生女孩站在公交站，没有带伞。你只有一把伞。|In a downpour, a girl stands at the bus stop without an umbrella. You have only one.", [
      O("把伞给她|Give her your umbrella", R("你淋着雨跑回了家。一周后，那把伞被洗干净送到了你公司的前台，夹着一张字条：“谢谢你。”|You ran home in the rain. A week later the umbrella arrived at your office, cleaned, with a note: “Thank you.”", { karma: 5, health: -1 })),
      O("一起撑伞等车|Share it while you wait", function (c) { if (G.ch(.25) && !N.partner()) { var n = N.mkRomantic({ love: 30, aff: 25 }); n.rel = "crush"; n.pin = 1; c.prm.m = n.name; H.fx(c, { happy: 6 }); return G.L("你们聊了一路。下车前，{m}问你要了电话。|You talked all the way. Before getting off, {m} asked for your number.", { m: n.name }); } H.fx(c, { happy: 3 }); return "车来了，你们笑着道别。|The bus came; you parted with a smile."; })
    ]),
    D("dl_flat_tire", [18, 80], "爆胎|A Flat Tyre", "🛞", "你的车在高速上爆胎了，离下一个出口还有十公里。|A tyre blows on the motorway, ten kilometres from the next exit.", [
      O("自己换备胎|Change it yourself", RC(.6, "你满手油污地换好了轮胎，觉得自己很厉害。|Covered in grease, you got it done and felt like a hero.", { happy: 4, smarts: 1 }, "千斤顶滑了，你差点被压到。|The jack slipped and nearly crushed you.", { health: -6, stress: 6 })),
      O("叫道路救援|Call roadside assistance", R("等了一个小时，花了几百块。|An hour’s wait and a hefty bill.", { money: -60, stress: 3 }))
    ], 1.2, function (p) { return !!p.flags.license; }),
    D("dl_food_poison", [10, 80], "路边摊|Street Food", "🍢", "你在路边摊吃了一串烤鱿鱼。半夜，你的肚子开始翻江倒海。|You ate a grilled squid skewer from a street stall. At midnight your stomach turns over.", [
      O("去急诊|Go to A&E", R("医生说是急性肠胃炎，挂了两瓶水。|Acute gastroenteritis, said the doctor — two IV drips.", { health: -5, money: -40 })),
      O("硬扛|Tough it out", RC(.6, "第二天你虚弱地爬了起来。|The next day you crawled out of bed, weak.", { health: -6 }, "你在卫生间里晕倒了，室友把你送进了医院。|You fainted in the bathroom; your flatmate took you to hospital.", { health: -14 }))
    ]),
    D("dl_parcel_theft", [18, 80], "被偷的快递|A Stolen Parcel", "📦", "你的快递在门口被人偷了，监控拍到了一个熟悉的身影——隔壁的小孩。|Your parcel was stolen from the doorstep. The camera shows a familiar figure — the kid next door.", [
      O("私下和孩子谈谈|Talk to the kid privately", R("孩子哭着承认了，说只是好奇里面是什么。你没有告诉他父母，他后来见到你总是很有礼貌。|He confessed in tears — he’d just been curious. You didn’t tell his parents; he was always polite to you after.", { karma: 5, eq: 3 })),
      O("找孩子的家长|Go to the parents", R("家长赔了钱，孩子挨了一顿打。|The parents paid you back; the boy got a hiding.", { money: 30, karma: -1 }))
    ], 1.1, adult),
    D("dl_gym_card", [18, 70], "健身卡|The Gym Membership", "🏋️", "你办了一张一年的健身卡。三个月过去了，你只去过两次。|You bought a year’s gym membership. Three months in, you’ve been twice.", [
      O("从明天开始每天去|Go every day starting tomorrow", RC(.4, "你真的坚持下来了！半年后你瘦了十斤。|You actually kept it up! Six months later you were lighter and fitter.", { health: 8, looks: 2, happy: 6 }, "你坚持了四天。|You lasted four days.", { happy: -2 })),
      O("把卡转让给同事|Transfer it to a colleague", R("同事练出了腹肌，请你吃了顿饭。|Your colleague got abs and bought you dinner.", { money: 50 }))
    ], 1.2, adult),
    D("dl_marathon_cheer", [8, 90], "路边的加油|Cheering the Runners", "🏃", "城市马拉松从你家楼下经过。一个跑者在你面前停下来，看起来快撑不住了。|The city marathon passes your building. A runner stops in front of you, close to collapse.", [
      O("递给他一瓶水，大声喊加油|Hand him water and shout encouragement", R("他喝完水，冲你竖了个大拇指，又跑了起来。后来你在新闻里看到，他是一位癌症康复者。|He drank, gave you a thumbs-up, and ran on. Later the news said he was a cancer survivor.", { karma: 4, happy: 5 }))
    ]),
    D("dl_wifi", [12, 90], "断网|The Internet Goes Down", "📶", "整个小区断网了，预计要修一天。|The whole estate has lost internet — a day’s repair, they say.", [
      O("出门走走|Go out for a walk", R("你在楼下发现了一家开了十年你却从没进去过的书店。|Downstairs you found a bookshop that had been there ten years — you’d never been in.", { happy: 5, smarts: 1 })),
      O("和家人玩桌游|Play board games with the family", R("你们笑了一整个晚上。有人提议以后每周断网一天。|You laughed all evening. Someone suggested an offline night every week.", { happy: 7, par: 2, kids: 2 }))
    ]),
    D("dl_doctor_queue", [18, 90], "医院排队|Queueing at the Hospital", "🏥", "你在医院排了三个小时的队。前面一个老人突然站不稳了。|Three hours in the hospital queue. The old man ahead of you suddenly sways.", [
      O("扶住他，大声叫医生|Catch him and shout for a doctor", R("是低血糖。医生说幸好你反应快。老人的儿子赶来后，执意要请你吃饭。|Low blood sugar. The doctor said your quick reaction helped. His son insisted on taking you to dinner.", { karma: 6 })),
      O("把自己的号让给他|Give him your place", R("你又多等了一个小时，但心里很踏实。|Another hour’s wait, but you felt at peace.", { karma: 4, stress: 2 }))
    ]),
    D("dl_birthday_forgot", [20, 80], "忘了的纪念日|A Forgotten Anniversary", "🎂", "伴侣一整天都没怎么理你。到了晚上你才想起来：今天是你们的纪念日。|Your partner has been cool all day. Only at night do you remember: it’s your anniversary.", [
      O("连夜去买花和蛋糕|Rush out for flowers and cake", RC(.6, "ta看到你气喘吁吁地抱着花回来，终于笑了。|Seeing you gasping at the door with flowers, they finally smiled.", { part: 4 }, "花店都关门了。你只买到了一束便利店的玫瑰。|Every florist was shut; you got gas-station roses.", { part: -3 })),
      O("老实道歉|Apologise honestly", R("ta叹了口气：“明年再忘，你就睡沙发。”|They sighed: “Forget next year and you’re on the sofa.”", { part: -2 }))
    ], 1.4, function () { return !!N.partner(); }),
    D("dl_hometown_food", [18, 80], "家乡的味道|A Taste of Home", "🥟", "你在异乡的街头闻到了一股熟悉的香味——是家乡的小吃。|In a strange city you catch a familiar smell — food from home.", [
      O("循着香味找过去|Follow the smell", R("老板是你的老乡。他多给了你一份，说“出门在外不容易”。你吃着吃着就想家了。|The owner was from your hometown and gave you extra: “It’s hard being away.” Eating it, you missed home.", { happy: 6, par: 2 })),
      O("给妈妈打个电话|Call your mother", R("妈妈说：“过年回来，妈给你做。”|Mum said: “Come home for New Year — I’ll make it for you.”", { par: 5 }))
    ], 1.2, function (p) { return p.age >= 18 && (p.country !== (p.flags.hometown || {}).c || p.city !== (p.flags.hometown || {}).city); }),
    D("dl_lottery_office", [20, 70], "办公室的彩票|The Office Lottery Pool", "🎫", "同事们凑钱买了一组彩票，问你要不要加入。|Colleagues are pooling for lottery tickets. Want in?", [
      O("加入|Join", RC(.04, "中了！每个人分到了一大笔钱，第二天一半的人辞职了。|You won! Everyone got a big share; half the office quit the next day.", { money: 30000, happy: 20 }, "没中。大家约好下周再买。|Nothing. Same again next week, everyone agreed.", { money: -10, eq: 1 })),
      O("不参加|Pass", R("那期什么也没中。你松了一口气。|That week nothing won. You were relieved.", {}))
    ], 1.1, function (p) { return !!p.job; }),
    D("dl_stray_dog", [8, 80], "跟着你回家的狗|A Dog Follows You Home", "🐕", "一只流浪狗跟了你一路，你走它也走，你停它也停。|A stray follows you all the way home — stopping when you stop.", [
      O("收养它|Adopt it", function (c) { if (G.S.assets.pets.length >= 4) { H.fx(c, { karma: 4 }); return "家里的毛孩子已经够多了，于是你帮它找到了一户好人家。|You already had plenty of pets, so you found it a good home."; } G.S.assets.pets.push({ id: G.uid(), kind: "dog", name: "小黄|Lucky", by: G.S.year - 1, aff: 75 }); H.fx(c, { happy: 10, karma: 4 }); return "你给它起名叫“小黄”。它从此再也没离开过你。|You named it Lucky. It never left your side again."; }),
      O("买根火腿肠给它|Buy it a sausage", R("它吃完舔了舔你的手，走了。|It ate, licked your hand, and trotted off.", { karma: 2, happy: 2 }))
    ]),
    D("dl_fortune_cookie", [12, 90], "签文|A Fortune", "🔮", "你在一家餐馆的签饼里抽到一张字条：“今年你会遇到改变命运的人。”|In a restaurant fortune cookie: “This year you will meet someone who changes your life.”", [
      O("当真|Believe it", R("那一年你对每一个陌生人都格外友善。年底回想，好像真的是这样。|That year you were extra kind to every stranger. Looking back, it may have been true.", { eq: 3, happy: 3 })),
      O("一笑了之|Laugh it off", R("你把字条夹进了钱包。|You tucked it into your wallet.", {}))
    ]),
    D("dl_volunteer_call", [16, 80], "献爱心|A Call for Help", "🤲", "单位组织给一个山区小学捐书。|Your workplace is collecting books for a mountain-village school.", [
      O("捐出你最喜欢的书，写上留言|Donate your favourite books, with notes inside", R("半年后，你收到了一封孩子写的信：“谢谢你，我也想当作家。”|Six months later a child wrote: “Thank you. I want to be a writer too.”", { karma: 6, happy: 5 })),
      O("捐点钱|Give money", R("你的名字出现在了捐款名单上。|Your name appeared on the donors list.", { karma: 3, money: -30 }))
    ], 1.1, function (p) { return !!p.job; }),
    D("dl_parking", [20, 80], "抢车位|The Parking Spot", "🅿️", "你看中的车位被一辆车抢了先。车主下来冲你耸耸肩。|Someone takes the parking space you were waiting for, then shrugs at you.", [
      O("算了，再找一个|Let it go and find another", R("你在拐角找到了一个更近的。|Round the corner you found a closer one.", { eq: 2 })),
      O("下车理论|Get out and argue", RC(.4, "对方不好意思地把车挪走了。|Embarrassed, they moved.", { happy: 2 }, "你们吵了起来，你迟到了。|You argued and were late.", { stress: 6 }))
    ], 1, function (p) { return !!p.flags.license && G.S.assets.cars.length > 0; }),
    D("dl_kid_question", [25, 70], "孩子的问题|A Child’s Question", "❓", "孩子突然问你：“你小时候的梦想是什么？现在实现了吗？”|Your child suddenly asks: “What was your dream when you were little? Did it come true?”", [
      O("认真回答|Answer honestly", R("你说了一个早就忘了的梦想。那天晚上，你想了很久。|You named a dream you’d long forgotten. That night, you thought about it a long time.", { eq: 4, kids: 4 })),
      O("反问孩子的梦想|Ask about theirs", R("孩子说想当宇航员。你说：“那我们一起努力。”|“An astronaut,” said your child. “Then let’s work towards it together,” you said.", { kids: 6 }))
    ], 1.3, function () { return N.rel("child").some(function (k) { var a = N.age(k); return k.alive && a >= 5 && a <= 14; }); }),
    D("dl_insomnia", [25, 90], "失眠|Insomnia", "🌙", "凌晨三点，你还睁着眼睛。脑子里全是明天要做的事。|3 a.m., still awake, your head full of tomorrow.", [
      O("起来写下所有担心的事|Get up and write down every worry", R("写完以后，你发现大部分事情其实没那么严重。你睡着了。|Written down, most of it wasn’t so bad. You fell asleep.", { stress: -8, eq: 2 })),
      O("刷手机到天亮|Scroll until dawn", R("你看完了一部剧，第二天顶着黑眼圈上班。|You finished a whole series and went to work with dark circles.", { health: -2, happy: 3 }))
    ]),
    D("dl_good_samaritan", [16, 85], "摔倒的老人|An Old Man Falls", "🧓", "一个老人在你面前摔倒了。周围的人都在犹豫。|An old man falls in front of you. People around hesitate.", [
      O("马上扶起来，打急救电话|Help him up and call an ambulance", R("老人的家属赶到后，握着你的手一直道谢。路人拍下了视频，网友都在夸你。|His family arrived and wouldn’t stop thanking you. A passer-by’s video drew praise online.", { karma: 8, fame: 1 })),
      O("先拍视频留证据，再扶|Film first for evidence, then help", R("你扶起了他。好在一切顺利。|You helped him up. All was well.", { karma: 4 }))
    ]),
    D("dl_neighbor_wedding", [18, 80], "邻居的婚礼|The Neighbours’ Wedding", "💒", "对门的年轻人要结婚了，邀请你去喝喜酒。|The young couple across the hall are getting married and invite you.", [
      O("包个红包去捧场|Go with a gift", R("你在婚宴上被安排和一群老同学坐在一起，竟然是你多年没联系的人。|You were seated with a group that turned out to include old friends you hadn’t seen in years.", { happy: 6, money: -60, eq: 2 })),
      O("托人带个红包|Send a gift via someone", R("新人回赠了一盒喜糖。|The couple sent back a box of wedding sweets.", { money: -40 }))
    ]),
    D("dl_first_salary_parent", [18, 30], "第一笔工资|Your First Pay", "💴", "你领到了人生第一笔工资。|Your very first pay cheque.", [
      O("给爸妈发个大红包|Send your parents a big red envelope", R("妈妈在家族群里发了截图，说了二十个“好孩子”。|Mum posted the screenshot in the family chat with twenty “good child”s.", { par: 8, happy: 6, money: -200, flag: "firstPay" })),
      O("全部存起来|Save it all", R("你看着存款数字，第一次觉得自己长大了。|Looking at the balance, you felt grown up for the first time.", { smarts: 1, flag: "firstPay" })),
      O("犒劳自己一顿大餐|Treat yourself to a feast", R("你吃到撑，觉得一切辛苦都值得。|You ate till you burst and felt it was all worth it.", { happy: 8, money: -80, flag: "firstPay" }))
    ], 2, function (p) { return !!p.job && !p.job.pt && !p.flags.firstPay; }),
    D("dl_misdial", [16, 90], "打错的电话|A Wrong Number", "☎️", "一个陌生的老奶奶打错了电话，把你当成了她的孙子/孙女，絮絮叨叨地说了好多。|An old woman dials the wrong number, takes you for her grandchild, and chats on and on.", [
      O("陪她聊下去|Keep chatting with her", R("你听她讲了半小时。最后她说：“我知道你不是我孙子。但谢谢你陪我说话。”|You listened half an hour. Finally she said: “I know you’re not my grandson. Thank you for talking to me.”", { karma: 6, eq: 4 })),
      O("告诉她打错了|Tell her it’s a wrong number", R("她道了歉，声音听起来有点失落。|She apologised; she sounded a little lost.", {}))
    ]),
    D("dl_blackout", [8, 90], "停电的夜晚|A Night Without Power", "🕯️", "整个城市大停电。窗外一片漆黑，但星星从来没有这么亮过。|A citywide blackout. Outside is pitch dark — and the stars have never been brighter.", [
      O("爬上楼顶看星星|Climb to the roof to see the stars", R("楼顶上已经有很多邻居了。有人弹起了吉他，大家一起唱歌。|Many neighbours were already up there. Someone played guitar and everyone sang.", { happy: 8, eq: 2 })),
      O("点蜡烛早点睡|Light a candle and sleep early", R("你睡了一个很久没有过的好觉。|You slept better than you had in ages.", { health: 2, stress: -4 }))
    ])
  ]);
})();
