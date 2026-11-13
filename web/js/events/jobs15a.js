/* Version 1.6 stories, part 1: every part-time, service and trade job gets its own moments —
   the regular customer, the night shift, the boss who notices, the day it all goes wrong. */
(function () {
  "use strict";
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function J(ids) { return function (S, p) { return !!(p.job && ids.indexOf(p.job.id) >= 0 && !p.jail); }; }
  function JE(id, ids, a, title, icon, t, o, w) { return E(id, a, title, icon, t, o, { if: J(ids), w: w || 2.2 }); }

  G.evs([
    /* ---------------- fast food ---------------- */
    JE("jf_fast_rush", ["pt_fast"], [14, 30], "午餐高峰|The Lunch Rush", "🍔", "中午十二点，取餐口排起了三十个人的长队，炸锅还坏了一个。|Noon. Thirty people at the counter, and one of the fryers just died.", [
      O("一个人顶两个岗位|Cover two stations yourself", R("你忙得连水都没喝一口，但没有一单出错。店长当晚请你吃了宵夜。|You never stopped for water, but not one order went wrong. The manager bought you a late dinner.", { perf: 8, health: -2, eq: 2 })),
      O("先安抚排队的顾客|Calm the queue first", R("你给等太久的人每人送了一份薯条，抱怨声一下子少了。|You handed free fries to everyone who had waited too long. The complaints stopped.", { perf: 4, eq: 3 })),
      O("偷偷躲进冷库喘口气|Hide in the walk-in freezer for a breather", RC(.6, "没人发现。三分钟后你满血复活。|No one noticed. Three minutes later you were good as new.", { stress: -6 }, "店长打开冷库门，和你四目相对。|The manager opened the freezer door and locked eyes with you.", { perf: -6 }))
    ]),
    JE("jf_fast_kid", ["pt_fast"], [14, 30], "攥着硬币的小孩|The Kid with Coins", "🪙", "一个小男孩把一把硬币摊在柜台上，数了三遍，还差两块钱买儿童套餐。|A little boy spreads a handful of coins on the counter, counts them three times, and is still two short for a kids’ meal.", [
      O("自己掏钱补上|Pay the difference yourself", R("他把玩具抱在怀里，回头冲你挥了好几次手。|He hugged the toy and turned back to wave at you several times.", { karma: 6, happy: 5, money: -2 })),
      O("给他换一个他买得起的|Offer something he can afford", R("你推荐了一个甜筒，他舔了一口，笑得眯起了眼睛。|You suggested an ice-cream cone. One lick and his whole face lit up.", { eq: 2, happy: 2 })),
      O("按规定办事|Stick to the rules", R("他把硬币一个个收回口袋，低着头走了。|He put the coins back one by one and left with his head down.", { karma: -3 }))
    ]),
    JE("jf_fast_secret", ["pt_fast"], [14, 30], "后厨的秘密|A Kitchen Secret", "🍟", "你发现同事把过期的肉饼重新放回了保温柜。|You catch a coworker putting expired patties back into the warmer.", [
      O("当面制止|Stop them right there", R("他骂了你一句，但还是把肉饼扔了。|He swore at you, but threw them out.", { karma: 5, perf: 2 })),
      O("告诉店长|Tell the manager", RC(.7, "店长换了一批新员工，还给你加了时薪。|The manager replaced the staff and gave you a raise.", { perf: 6, money: 200 }, "店长说“别多管闲事”。你在这里待不久了。|The manager told you to mind your own business. You won’t last here.", { happy: -5 })),
      O("装作没看见|Pretend you saw nothing", R("那天晚上你没吃店里的任何东西。|That night you didn’t eat anything from the store.", { karma: -3, stress: 3 }))
    ]),

    /* ---------------- convenience store ---------------- */
    JE("jf_shop_night", ["pt_shop", "cashier"], [16, 60], "凌晨三点的便利店|3 a.m. at the Store", "🏪", "凌晨三点，一个浑身湿透的人走进来，什么也不买，只是站在暖气旁边。|3 a.m. A man soaked to the skin walks in, buys nothing, and just stands by the heater.", [
      O("给他倒一杯热水|Pour him a cup of hot water", R("他捧着杯子说，今天是他失业的第一天。临走时他向你鞠了一躬。|Holding the cup, he said it was his first day without a job. He bowed to you as he left.", { karma: 5, eq: 3 })),
      O("请他离开|Ask him to leave", R("他点点头，又走回了雨里。|He nodded and walked back into the rain.", { karma: -2 })),
      O("和他聊聊天|Chat with him", RC(.3, "原来他是附近大公司的老板，那天只是想一个人静静。一周后他让人给你送来了一份工作邀请。|He turned out to own a big company nearby and just wanted to be alone that night. A week later, a job offer arrived for you.", { eq: 4, happy: 6, perf: 6 }, "你们聊了半小时天气。雨停了，他也走了。|You talked about the weather for half an hour. The rain stopped; so did he.", { eq: 2 }))
    ]),
    JE("jf_shop_robber", ["pt_shop", "cashier"], [16, 60], "柜台前的刀|A Knife at the Counter", "🔪", "一个戴口罩的人把刀拍在柜台上：“把钱拿出来。”|A masked man slaps a knife on the counter: “Give me the money.”", [
      O("照他说的做，按下报警按钮|Do as he says and hit the silent alarm", R("他拿着几百块跑了，十分钟后在两条街外被抓。|He ran with a few hundred and was caught two streets away ten minutes later.", { stress: 12, perf: 4 })),
      O("和他周旋，拖延时间|Stall him", RC(.5, "警车的声音越来越近，他扔下刀跑了。|Sirens grew closer; he dropped the knife and ran.", { stress: 10, fame: 2, perf: 6 }, "他不耐烦地划伤了你的手臂。|Impatient, he slashed your arm.", { health: -12, stress: 15 })),
      O("抄起拖把反抗|Fight back with the mop", RC(.35, "你把他打倒在地，店里的监控视频上了新闻。|You knocked him flat; the CCTV footage made the news.", { fame: 6, perf: 10, health: -3 }, "你被捅了一刀，在医院躺了半个月。|You were stabbed and spent two weeks in hospital.", { health: -30, stress: 20 }))
    ], 1.2),
    JE("jf_shop_regular", ["pt_shop", "cashier"], [16, 60], "每晚八点的老奶奶|The Old Lady at 8 p.m.", "👵", "每天晚上八点，一位老奶奶都会来买一盒牛奶。这周她已经三天没来了。|Every night at eight, an old lady buys a carton of milk. This week she hasn’t come for three days.", [
      O("下班后去她家看看|Check on her after your shift", RC(.6, "她摔倒在家里，已经两天没吃东西。你叫了救护车，救了她一命。|She had fallen at home and hadn’t eaten in two days. You called an ambulance and saved her life.", { karma: 12, happy: 8, fame: 1 }, "她只是去女儿家住几天了，还给你带回来一包特产。|She’d just been staying with her daughter — and brought you back a local treat.", { happy: 4 })),
      O("可能只是出门了吧|She’s probably just away", R("一周后她又来了，你松了一口气。|A week later she was back, and you breathed out.", {}))
    ]),

    /* ---------------- flyers / street work ---------------- */
    JE("jf_flyer_rain", ["pt_flyer"], [14, 30], "淋湿的传单|Soaked Flyers", "📄", "突然下起大雨，你手里还有三百张传单没发完。|A downpour starts and you still have three hundred flyers left.", [
      O("躲进商场门口继续发|Keep handing them out under the mall’s awning", R("你发完了最后一张，衣服湿透了，但拿到了全额工资。|You handed out the last one, drenched — and got full pay.", { perf: 5, health: -2 })),
      O("全部扔进垃圾桶|Dump them all in a bin", RC(.5, "没人发现。|Nobody found out.", { stress: -2 }, "老板派人跟着你，你一分钱也没拿到。|The boss had someone tailing you. You got nothing.", { money: -30, happy: -4 }))
    ]),
    JE("jf_flyer_star", ["pt_flyer"], [14, 30], "被星探拦下|Stopped by a Scout", "🌟", "你在街口发传单，一个拿着相机的人拦住了你：“有没有兴趣拍个广告？”|Handing out flyers on a corner, a man with a camera stops you: “Ever thought about doing an ad?”", [
      O("去试镜|Go to the audition", RC(function (c) { return .2 + c.p.st.looks / 200; }, "你拍了一支饮料广告，片酬是发一年传单的钱。|You shot a drinks commercial and earned a year’s worth of flyer money.", { money: 3000, fame: 4, looks: 2 }, "原来是要交“培训费”的骗局。你转身就走。|It was a scam asking for a “training fee”. You walked out.", { smarts: 2 })),
      O("没兴趣|Not interested", R("他耸耸肩，接过了你的一张传单。|He shrugged and took one of your flyers.", {}))
    ]),

    /* ---------------- coffee shop ---------------- */
    JE("jf_coffee_name", ["pt_coffee"], [15, 30], "杯子上的名字|The Name on the Cup", "☕", "一位常客每天都点同样的拿铁。今天ta问你：“你叫什么名字？”|A regular orders the same latte every day. Today they ask: “What’s your name?”", [
      O("在杯子上写下自己的名字和电话|Write your name and number on the cup", function (c) { if (G.ch(.5)) { var n = N.mkRomantic({ love: 35, aff: 25 }); n.rel = "crush"; n.pin = 1; c.prm.n = n.name; H.fx(c, { happy: 8 }); return G.L("第二天，杯子回到了柜台上，背面写着：“{n}，今晚七点？”|The next day the cup came back with a note: “{n}. Tonight at seven?”", { n: n.name }); } H.fx(c, { happy: -2 }); return "ta笑了笑，再也没来过。|They smiled — and never came back."; }),
      O("告诉ta名字就好|Just tell them your name", R("从此ta每天都会叫着你的名字点单。|From then on they ordered by name every day.", { happy: 3, eq: 1 }))
    ]),
    JE("jf_coffee_art", ["pt_coffee"], [15, 30], "拉花比赛|Latte Art Contest", "🎨", "店里要选人参加全市拉花比赛。|The café is choosing someone for the city latte-art competition.", [
      O("报名，天天练习|Sign up and practise every day", RC(.45, "你拉出的天鹅拿了第一名，店里多了很多慕名而来的客人。|Your swan took first place, and customers started coming just to see your work.", { fame: 3, perf: 10, happy: 8 }, "比赛那天你手抖了，拉成了一坨。|On the day your hand shook and the swan became a blob.", { happy: -3 })),
      O("让给同事|Let a coworker go", R("同事拿了第三名，请大家喝了一周奶茶。|Your coworker came third and bought bubble tea for everyone all week.", { eq: 2 }))
    ]),

    /* ---------------- tutoring ---------------- */
    JE("jf_tutor_kid", ["pt_tutor"], [16, 30], "不肯学习的孩子|The Kid Who Won’t Study", "📚", "你家教的孩子把作业本扔在地上：“学这些有什么用？”|The kid you tutor throws the workbook on the floor: “What’s the point of any of this?”", [
      O("陪他打一局游戏，然后讲游戏里的数学|Play a game with him, then show him the maths in it", RC(.65, "他第一次主动问你问题。期末他数学考了班级前五。|For the first time he asked you a question himself. He finished the term in the top five for maths.", { eq: 4, perf: 10, happy: 6 }, "他玩完游戏就不肯学了。家长不太满意。|After the game he refused to study. The parents weren’t pleased.", { perf: -5 })),
      O("严厉批评|Scold him", R("他哭了，家长也不太高兴。|He cried, and the parents weren’t happy either.", { perf: -3 })),
      O("告诉家长|Tell the parents", R("家长当着你的面把他骂了一顿。你觉得有点内疚。|The parents scolded him in front of you. You felt a bit guilty.", {}))
    ]),
    JE("jf_tutor_rich", ["pt_tutor"], [16, 30], "富豪家的家教|Tutoring for the Rich", "🏛️", "一个富豪家庭开出三倍时薪，请你给他们的女儿补习。他们家的门厅比你家还大。|A wealthy family offers triple pay to tutor their daughter. Their entrance hall is bigger than your home.", [
      O("接下来|Take it", RC(.5, "女儿考上了理想的学校，家长给你包了个大红包，还把你推荐给了朋友圈。|She got into her dream school; the parents gave you a fat bonus and recommended you to all their friends.", { money: 2500, eq: 3, perf: 8 }, "家长要求太多，你每周都被挑刺。|The parents nitpicked every week.", { stress: 10, money: 800 })),
      O("不习惯那种环境，婉拒|Decline — not your world", R("你继续教楼下那个调皮的男孩。|You kept tutoring the cheeky boy downstairs.", {}))
    ]),

    /* ---------------- modelling ---------------- */
    JE("jf_model_shoot", ["pt_model"], [16, 30], "临时加戏|An Extra Request", "📸", "拍摄进行到一半，摄影师让你换上一套暴露的衣服，说“这是客户的要求”。|Halfway through the shoot the photographer asks you to change into something revealing — “the client wants it.”", [
      O("拒绝，合同里没有|Refuse — it’s not in the contract", R("摄影师撇撇嘴，但还是按原计划拍完了。经纪人说你做得对。|The photographer sulked but finished as planned. Your agent said you did the right thing.", { karma: 3, eq: 2 })),
      O("要求加钱|Ask for more money", RC(.5, "客户爽快地加了三倍片酬。|The client cheerfully tripled your fee.", { money: 1500 }, "客户换了一个模特。|The client found another model.", { perf: -6 })),
      O("照做|Do it", R("照片很成功，但你看着网上的评论，心里不太舒服。|The photos were a hit, but the comments online made you uneasy.", { fame: 3, happy: -4 }))
    ]),
    JE("jf_model_cover", ["pt_model"], [16, 30], "杂志封面|A Magazine Cover", "📰", "一家时尚杂志临时缺人，问你能不能明天一早来拍封面。|A fashion magazine is short a model and asks if you can shoot a cover first thing tomorrow.", [
      O("通宵敷面膜，准时到|Sheet mask all night and show up on time", RC(function (c) { return .4 + c.p.st.looks / 250; }, "封面一出，好几家经纪公司打来了电话。|The cover dropped and several agencies called.", { fame: 8, money: 2000, looks: 1 }, "最后用了另一个模特的照片。|They used another model’s shot in the end.", { happy: -3 }))
    ]),

    /* ---------------- delivery ---------------- */
    JE("jf_deliver_wrong", ["pt_deliver", "rider"], [16, 55], "送错的外卖|The Wrong Order", "🛵", "你把两单外卖送反了。一位顾客打电话来破口大骂。|You swapped two deliveries. One customer calls, screaming.", [
      O("自己掏钱赔一份|Pay for a replacement yourself", R("顾客收回了差评，还给你打赏了五块钱。|The customer withdrew the bad review — and tipped you five.", { money: -20, karma: 3, eq: 2 })),
      O("解释是系统问题|Blame the app", RC(.5, "顾客信了。|The customer bought it.", {}, "顾客投诉到了平台，你被罚了两百块。|They complained to the platform; you were fined.", { money: -30, perf: -5 }))
    ]),
    JE("jf_rider_storm", ["pt_deliver", "rider"], [16, 55], "暴雨里的订单|Orders in the Storm", "⛈️", "台风天，平台的单价翻了三倍，路上的积水已经到膝盖。|Typhoon day. Delivery fees have tripled and the water is knee-deep.", [
      O("冲！|Go for it", RC(.75, "你一天赚了平时一周的钱。|You earned a week’s pay in one day.", { money: 400, health: -4, perf: 6 }, "电动车在水里熄火了，你推着车走了三公里。|The scooter died in the flood and you pushed it three kilometres.", { health: -8, money: -150 })),
      O("今天休息|Sit this one out", R("你在家看着窗外的雨，心疼那些还在路上的同行。|From home you watched the rain and felt for those still out there.", { stress: -4 }))
    ]),
    JE("jf_rider_old", ["pt_deliver", "rider"], [16, 55], "独居老人的订单|An Order for an Old Man", "🥡", "一位独居老人每天都点同一份粥，每次都想拉着你聊几句。|An old man living alone orders the same porridge every day and always wants to chat.", [
      O("每次多陪他聊两分钟|Spend two extra minutes with him each time", R("有一天他没开门。你报了警——他心脏病发作，被及时送进了医院。|One day he didn’t answer. You called the police — he’d had a heart attack and got to hospital in time.", { karma: 10, happy: 6 })),
      O("单子太多，放下就走|Too many orders — drop and go", R("你赶上了下一单的时间。|You made your next delivery on time.", { perf: 2 }))
    ]),
    JE("jf_rider_king", ["rider"], [18, 55], "单王争夺战|Race for Top Rider", "🏆", "站点要评选本月“单王”，奖金三千。你和另一个骑手只差五单。|The hub’s “Rider of the Month” pays a bonus. You’re five orders behind the leader.", [
      O("最后一天跑十六个小时|Ride sixteen hours on the last day", RC(.55, "你以两单之差赢了。站长当众给你戴上了绶带。|You won by two orders; the manager draped the sash on you in front of everyone.", { money: 400, perf: 10, health: -5 }, "你还是差三单，腰也伤了。|Still three short — and you hurt your back.", { health: -8 })),
      O("算了，身体要紧|Forget it, health first", R("那个月你每天都准时回家吃饭。|That month you were home for dinner every night.", { happy: 3 }))
    ]),

    /* ---------------- waiter ---------------- */
    JE("jf_waiter_spill", ["waiter"], [16, 60], "洒在西装上的汤|Soup on a Suit", "🍲", "你把一碗热汤洒在了一位客人的名牌西装上。|You spill hot soup on a guest’s designer suit.", [
      O("真诚道歉，主动处理|Apologise sincerely and deal with it", RC(.6, "客人哈哈一笑：“我年轻时也端过盘子。”他留下了一大笔小费。|He laughed: “I waited tables when I was young.” He left a huge tip.", { money: 100, eq: 3 }, "他要求你赔干洗费。|He demanded you pay for dry cleaning.", { money: -80 })),
      O("找经理来处理|Get the manager", R("经理赔了笑脸，事后扣了你半个月奖金。|The manager smoothed it over — and docked half your bonus.", { money: -60, perf: -4 }))
    ]),
    JE("jf_waiter_proposal", ["waiter"], [16, 60], "藏在蛋糕里的戒指|A Ring in the Cake", "💍", "一位客人偷偷交给你一枚戒指，让你藏进女朋友的甜点里。|A guest slips you a ring and asks you to hide it in his girlfriend’s dessert.", [
      O("精心布置|Set it up beautifully", R("她哭着说“我愿意”，全餐厅都在鼓掌。那对新人后来每年纪念日都来。|She said yes in tears, the whole room applauded, and the couple came back every anniversary.", { happy: 6, perf: 4, eq: 2 })),
      O("提醒他换个方式，怕她吞下去|Suggest another way — she might swallow it", R("戒指放在了甜点旁边的小盒子里。一样感人，还安全。|The ring went in a little box beside the dessert. Just as moving, and safe.", { smarts: 2, perf: 3 }))
    ]),
    JE("jf_waiter_critic", ["waiter"], [18, 60], "神秘的美食评论家|The Mystery Critic", "🍽️", "后厨传来消息：今晚有一位米其林评审匿名到访，可能就是你负责的那桌。|Word from the kitchen: a Michelin inspector is dining incognito tonight — possibly at your table.", [
      O("每桌都当成评审对待|Treat every table like the inspector’s", RC(.5, "餐厅拿到了一颗星。老板给每个人都发了红包，你那份最大。|The restaurant earned a star. The owner gave everyone a bonus — yours was the biggest.", { money: 500, perf: 12, happy: 8 }, "评审最后没写你们。|The inspector didn’t mention you in the end.", { perf: 2 })),
      O("猜一桌重点照顾|Guess which table and focus on it", RC(.3, "你猜对了！|You guessed right!", { perf: 10, money: 300 }, "你猜错了，真正的评审抱怨等了半小时。|Wrong table — the real inspector complained about waiting half an hour.", { perf: -8 }))
    ]),

    /* ---------------- courier ---------------- */
    JE("jf_courier_box", ["courier"], [18, 60], "破损的包裹|The Damaged Parcel", "📦", "一个包裹在运输中摔破了，露出里面的东西——一台古董相机。|A parcel broke open in transit, revealing an antique camera.", [
      O("如实上报|Report it honestly", R("公司赔偿了客户，客户在评价里特别感谢了你的诚实。|The company compensated the customer, who thanked you by name for your honesty.", { karma: 5, perf: 4 })),
      O("悄悄修好重新包装|Quietly fix it and repack", RC(.5, "客户什么都没发现。|The customer never noticed.", {}, "客户打开后发现镜头裂了，投诉到总部。|The customer found a cracked lens and complained to headquarters.", { perf: -10, money: -200 }))
    ]),
    JE("jf_courier_dog", ["courier"], [18, 60], "门口的大狗|The Big Dog at the Gate", "🐕", "一户人家的院子里有条大狗，每次你送件它都冲着你狂叫。|A big dog barks furiously every time you deliver to one house.", [
      O("每次带一根火腿肠|Bring a sausage every time", R("一个月后，它看见你就摇尾巴。主人说它从来没对外人这么亲。|A month later it wagged at the sight of you. The owner said it had never been so friendly to a stranger.", { happy: 5, eq: 2 })),
      O("放在门口就跑|Drop it and run", R("有一次你跑得太急，摔了一跤。|Once you ran so fast you tripped.", { health: -2 }))
    ]),
    JE("jf_courier_double11", ["courier"], [18, 60], "购物节|Shopping Festival", "🛒", "购物节过后，站点的包裹堆成了山，一周都送不完。|After the shopping festival, parcels pile to the ceiling. It’ll take a week to clear.", [
      O("连续加班七天|Work seven straight days", R("你瘦了五斤，拿到了一笔不错的奖金。|You lost five pounds and earned a good bonus.", { money: 600, health: -5, perf: 8 })),
      O("按正常节奏来|Keep to your normal pace", R("投诉多了几条，但你睡得很好。|A few more complaints, but you slept well.", { perf: -2, stress: -3 }))
    ]),

    /* ---------------- factory ---------------- */
    JE("jf_factory_line", ["factory"], [16, 60], "流水线上的改进|An Idea on the Line", "🏭", "你发现流水线上一个工序可以省掉一步，每天能多出两百件产品。|You notice one step on the line could be cut — two hundred more units a day.", [
      O("写成建议交给车间主任|Write it up for the supervisor", RC(.55, "建议被采纳了，你拿到了年度创新奖和一千块奖金。|It was adopted; you got the annual innovation award and a bonus.", { perf: 12, money: 300, smarts: 2 }, "主任把建议当成了自己的，报给了上面。|The supervisor passed it off as his own.", { happy: -6, karma: 1 })),
      O("自己悄悄这么干，早点下班|Just do it yourself and leave early", R("你每天提前一小时完成任务。|You finished an hour early every day.", { happy: 3 }))
    ]),
    JE("jf_factory_injury", ["factory", "builder"], [16, 65], "工友的手|A Coworker’s Hand", "🩹", "旁边工位的老王手被机器卷了进去。|The machine catches Old Wang’s hand at the next station.", [
      O("第一时间拉下急停|Hit the emergency stop at once", R("老王保住了手指。他老婆提着一篮鸡蛋来谢你。|He kept his fingers. His wife came with a basket of eggs to thank you.", { karma: 10, eq: 2 })),
      O("冲过去拉他|Pull him free", RC(.5, "你把他拉了出来，自己的胳膊也擦伤了。|You got him out and scraped your own arm.", { karma: 8, health: -4 }, "你也被卷了进去，伤了两根手指。|You were caught too and hurt two fingers.", { health: -15, karma: 6 }))
    ], 1.2),
    JE("jf_factory_strike", ["factory"], [18, 60], "拖欠的工资|Unpaid Wages", "✊", "厂里已经三个月没发工资了。工友们商量要罢工。|The factory hasn’t paid wages in three months. The workers are talking about a strike.", [
      O("带头罢工|Lead the strike", RC(.5, "老板扛不住，第二天就补发了工资。工友们都叫你“老大”。|The boss caved and paid up the next day. The others started calling you “boss”.", { money: 800, eq: 4, fame: 1 }, "你被列进了黑名单，丢了工作。|You were blacklisted and fired.", { happy: -10 })),
      O("找劳动部门投诉|File a complaint with the labour bureau", R("走了两个月流程，工资终于发了下来。|Two months of paperwork later, the wages came through.", { money: 600, smarts: 1 })),
      O("先忍着，另找出路|Put up with it and look elsewhere", R("你开始偷偷投简历。|You started sending out CVs on the quiet.", { stress: 4 }))
    ]),

    /* ---------------- security guard ---------------- */
    JE("jf_guard_thief", ["guard"], [18, 65], "深夜的仓库|The Warehouse at Night", "🔦", "巡逻时你听见仓库里有动静，手电筒照过去，是两个半大的孩子在偷零食。|On your rounds you hear noises in the warehouse — two teenagers stealing snacks.", [
      O("吓唬一下放他们走|Give them a scare and let them go", R("其中一个孩子后来考上了警校，回来看过你。|One of them later got into police academy and came back to visit you.", { karma: 6, happy: 4 })),
      O("按规定交给警察|Hand them to the police as required", R("你得到了公司的表扬，心里却有点沉。|The company praised you, but your heart felt heavy.", { perf: 6 }))
    ]),
    JE("jf_guard_fire", ["guard"], [18, 65], "监控里的烟|Smoke on the Monitor", "🔥", "凌晨，你在监控里看见地下车库冒出了烟。|In the small hours, smoke rises on the car-park camera.", [
      O("拉响警报，组织疏散|Sound the alarm and evacuate", R("整栋楼的人都安全撤离了。业主们给你送来了锦旗。|Everyone got out safely. The residents gave you a banner of thanks.", { fame: 3, karma: 8, perf: 10 })),
      O("先自己拿灭火器去看看|Grab an extinguisher and check it out", RC(.6, "只是一辆电动车短路，你把火扑灭了。|Just an e-bike shorting out; you put it out.", { perf: 8 }, "火势比你想的大，你被烟呛进了医院。|The fire was bigger than you thought; smoke put you in hospital.", { health: -15 }))
    ], 1.2),

    /* ---------------- cleaner ---------------- */
    JE("jf_clean_ring", ["cleaner"], [18, 70], "垃圾桶里的钻戒|A Diamond in the Bin", "💎", "打扫写字楼时，你在垃圾桶里发现了一枚钻戒。|Cleaning an office, you find a diamond ring in a bin.", [
      O("交给前台失物招领|Hand it to lost-and-found", R("失主是一位刚分手的女士，她哭着说这是外婆留给她的。|It belonged to a woman who’d just broken up — her grandmother’s ring, she sobbed.", { karma: 10, happy: 4 })),
      O("拿去当铺|Take it to a pawnshop", RC(.5, "你换了一大笔钱。|You got a lot of money for it.", { money: 2000, karma: -10 }, "监控拍到了你，你丢了工作。|The cameras caught you, and you lost your job.", { karma: -10, perf: -30 }))
    ]),
    JE("jf_clean_ceo", ["cleaner"], [18, 70], "加班的总裁|The CEO Working Late", "🧹", "晚上十一点，整层楼只剩总裁办公室还亮着灯。他问你：“你觉得这家公司怎么样？”|11 p.m. Only the CEO’s office is still lit. He asks you: “What do you think of this company?”", [
      O("说实话：员工都很累|Tell the truth: everyone’s exhausted", R("第二周，公司宣布取消周六加班。没人知道是因为你。|The next week the company scrapped Saturday overtime. No one knew it was because of you.", { karma: 6, eq: 3 })),
      O("说好话|Say something nice", R("他笑了笑，给了你一个红包。|He smiled and gave you a red envelope.", { money: 50 }))
    ]),

    /* ---------------- cashier ---------------- */
    JE("jf_cashier_fake", ["cashier"], [16, 65], "一张假钞|A Fake Note", "💵", "收银时你发现一位顾客递来的是一张假钞。|At the till, you realise a customer has handed you a counterfeit note.", [
      O("礼貌地请他换一张|Politely ask for another", R("他脸一红，换了一张真的。|He went red and swapped it.", { eq: 2 })),
      O("报警|Call the police", RC(.4, "他是一个假钞团伙的成员，你得到了警方的表彰。|He was part of a counterfeiting ring; the police commended you.", { fame: 2, karma: 4 }, "他只是个被骗的老人。你心里很不是滋味。|He was just an old man who’d been tricked. You felt awful.", { happy: -4 }))
    ]),

    /* ---------------- driver ---------------- */
    JE("jf_driver_birth", ["driver"], [20, 65], "车上要生了|Labour in the Back Seat", "🚗", "一位孕妇刚上车就破了羊水。|A pregnant woman’s waters break moments after she gets in.", [
      O("一路闯红灯冲向医院|Run every red light to the hospital", R("孩子在医院门口出生了，母子平安。罚单被交警撤销了。孩子的小名叫“的的”。|The baby was born at the hospital doors, mother and child safe. Police waived the tickets. The baby’s nickname: “Cabbie”.", { karma: 10, fame: 3, happy: 8 })),
      O("靠边打120|Pull over and call an ambulance", R("救护车来得很快，一切顺利。|The ambulance came fast; all went well.", { karma: 4 }))
    ]),
    JE("jf_driver_bag", ["driver"], [20, 65], "落在后座的包|A Bag Left Behind", "👜", "乘客下车后，你在后座发现一个包，里面有现金和一本护照。|After a fare, you find a bag on the back seat with cash and a passport.", [
      O("开回机场找人|Drive back to the airport to find them", R("失主差点误了飞机，抱着你哭了。她坚持给你一千块谢礼。|The owner nearly missed her flight and hugged you in tears, insisting on a reward.", { karma: 10, money: 150 })),
      O("交到警察局|Turn it in to the police", R("你收到了一封感谢信。|You received a thank-you letter.", { karma: 6 })),
      O("留下现金，扔掉包|Keep the cash, ditch the bag", RC(.5, "没人找来。|No one came looking.", { money: 500, karma: -12 }, "车上有行车记录仪，警察找上门了。|The dashcam recorded it; the police came knocking.", { karma: -12, money: -500, perf: -20 }))
    ]),
    JE("jf_driver_boss", ["driver"], [20, 65], "老板的秘密|The Boss’s Secret", "🤫", "你给老板开车三年，今天他让你把他送到一个陌生小区，嘱咐“别告诉我太太”。|Three years driving for your boss; today he asks you to drop him at an unfamiliar estate — “don’t tell my wife.”", [
      O("守口如瓶|Keep your mouth shut", R("年底，你的奖金翻了一倍。|Your year-end bonus doubled.", { money: 800, karma: -2 })),
      O("暗示太太|Drop a hint to his wife", RC(.5, "太太发现后离了婚，分走了一半家产，还把你请去当她的司机，工资翻倍。|She divorced him, took half, and hired you as her driver at double pay.", { money: 1000, karma: 2 }, "老板知道是你说的，你当天就被辞退了。|He found out it was you and fired you that day.", { perf: -40 }))
    ]),

    /* ---------------- chef ---------------- */
    JE("jf_chef_critic", ["chef"], [18, 70], "退回来的菜|Sent Back to the Kitchen", "👨‍🍳", "一位客人把你的招牌菜退了回来，说“太咸了”。|A guest sends your signature dish back — “too salty.”", [
      O("亲自出去问问|Go out and ask them yourself", RC(.6, "原来他是一位退休的老厨师。他教了你一个小窍门，你的菜从此更好吃了。|He was a retired chef who taught you a trick. Your dishes have been better ever since.", { smarts: 3, perf: 6, eq: 2 }, "他只是来找茬的。|He was just looking for trouble.", { stress: 5 })),
      O("重做一份|Remake it", R("他吃得一干二净。|He cleaned the plate.", { perf: 2 }))
    ]),
    JE("jf_chef_contest", ["chef"], [20, 60], "厨艺大赛|The Cooking Contest", "🏅", "一档电视厨艺比赛邀请你参加。|A televised cooking contest invites you to compete.", [
      O("参加，用家乡菜打动评委|Enter with a dish from home", RC(.4, "你拿了冠军，餐厅门口排起了长队。|You won, and queues formed outside your restaurant.", { fame: 10, perf: 15, money: 1000, happy: 10 }, "你止步八强，但评委说你的菜“有灵魂”。|You went out in the quarter-finals, but a judge said your food “has soul”.", { fame: 3, happy: 3 })),
      O("不去，厨房才是我的舞台|Decline — the kitchen is my stage", R("你继续每天在灶台前忙碌。|You kept working the stove every day.", {}))
    ]),
    JE("jf_chef_ownplace", ["chef"], [25, 60], "自己的小馆子|A Place of Your Own", "🏮", "街角有一家小饭馆要转让，老板想退休。|A little restaurant on the corner is for sale; the owner wants to retire.", [
      O("盘下来|Take it over", RC(function (c) { return .4 + c.p.st.eq / 300; }, "你的小馆子成了网红店，每天都要排队。|Your place became an online sensation with queues every day.", { money: -20000, happy: 10, fame: 4, flag: "ownDiner" }, "生意一直不温不火，一年后关门了。|Business never took off; it closed after a year.", { money: -20000, happy: -10 })),
      O("再攒攒钱|Save up a bit more", R("小馆子被别人盘走了。你偶尔还会去吃。|Someone else bought it. You still eat there sometimes.", {}))
    ]),

    /* ---------------- builder ---------------- */
    JE("jf_build_height", ["builder"], [18, 60], "三十层的风|Wind at Thirty Floors", "🏗️", "大风天，工头还是要求你们上三十层绑钢筋。|Gale-force wind, but the foreman still wants you up on the 30th floor tying rebar.", [
      O("拒绝，安全第一|Refuse — safety first", R("下午，隔壁工地的塔吊被风吹倒了。工头没再说什么。|That afternoon a crane on the next site blew over. The foreman said nothing more.", { karma: 3, health: 1 })),
      O("系好安全带上去|Clip in and go up", RC(.85, "你平安完成了任务，拿到了高空补贴。|You finished safely and got the height bonus.", { money: 150 }, "一阵风把你吹得撞到了钢梁上。|A gust slammed you into a steel beam.", { health: -20 }))
    ]),
    JE("jf_build_name", ["builder"], [18, 65], "刻在墙里的名字|A Name in the Wall", "🧱", "大楼快封顶了。工友们偷偷在一块砖上刻下了每个人的名字。|The building is nearly topped out. The crew secretly carve all their names into one brick.", [
      O("刻上自己和家人的名字|Carve your name and your family’s", R("多年后，你带着孩子路过这栋楼，指着说：“这是爸爸盖的。”|Years later you walked past with your child and said: “I built that.”", { happy: 8 })),
      O("只刻一个日期|Just carve the date", R("那块砖至今还在。|The brick is still there.", { happy: 3 }))
    ]),

    /* ---------------- farmer ---------------- */
    JE("jf_farm_drought", ["farmer"], [18, 80], "干旱|Drought", "🌾", "两个月没下雨，地里的庄稼开始发黄。|Two months without rain; the crops are turning yellow.", [
      O("借钱打一口深井|Borrow to dig a deep well", RC(.7, "井出水了，你的地成了全村唯一的绿色。|The well struck water — yours was the only green field in the village.", { money: 1500, happy: 8, smarts: 2 }, "打了三十米还是没水。|Thirty metres down, still dry.", { money: -1500, stress: 12 })),
      O("和乡亲们一起修水渠|Build a channel with the neighbours", R("水渠修好了，全村都受益。村长在大会上表扬了你。|The channel was finished and the whole village benefited. The chief praised you publicly.", { karma: 6, eq: 3, fame: 1 })),
      O("等老天下雨|Wait for rain", RC(.4, "第三天下了一场透雨。|It poured on the third day.", { happy: 6 }, "收成少了一大半。|You lost most of the harvest.", { money: -800, happy: -8 }))
    ]),
    JE("jf_farm_live", ["farmer"], [18, 70], "直播卖瓜|Selling Melons Online", "🍉", "村里的年轻人教你开直播卖自家种的西瓜。|Young people in the village teach you to livestream-sell your melons.", [
      O("试试看|Give it a go", RC(.35, "你一口方言加憨厚的笑容火了，一个晚上卖了两万斤。|Your dialect and honest grin went viral; you sold ten tonnes in one night.", { money: 3000, fame: 5, happy: 10 }, "直播间只有三个人，其中一个是你女儿。|Three viewers — one was your daughter.", { happy: 2 })),
      O("还是卖给收购商|Stick with the wholesaler", R("价格低一些，但省心。|Lower price, less hassle.", {}))
    ]),
    JE("jf_farm_seed", ["farmer"], [20, 75], "新品种|A New Variety", "🌱", "农技站推广一种新的水稻品种，产量高但没人种过。|The farm bureau is pushing a new high-yield rice nobody has tried.", [
      O("全部改种|Plant it everywhere", RC(.6, "亩产翻了一倍，你成了全县的种粮大户。|Yields doubled and you became the county’s top grower.", { money: 2500, fame: 2 }, "新品种不适应本地气候，减产三成。|It didn’t suit the local climate; yields fell by a third.", { money: -1000 })),
      O("先种一亩试试|Try one plot first", R("试验田长得不错，明年你打算多种一些。|The test plot did well; you plan to plant more next year.", { smarts: 2 }))
    ]),

    /* ---------------- hairdresser ---------------- */
    JE("jf_hair_bride", ["hair"], [18, 65], "新娘的头发|The Bride’s Hair", "💇", "婚礼当天早上，新娘哭着跑进店里：昨晚自己染的头发变成了绿色。|Wedding morning, a bride runs in crying: her home dye job turned her hair green.", [
      O("两小时内救回来|Save it in two hours", RC(.65, "她顶着一头完美的栗色长发走上了红毯，婚礼上专门感谢了你。|She walked down the aisle with perfect chestnut hair and thanked you in her speech.", { perf: 10, fame: 2, happy: 6 }, "颜色还是有点泛绿，好在她戴了头纱。|A hint of green remained; luckily she wore a veil.", { perf: 2 })),
      O("建议她干脆做个造型盖住|Suggest a style that hides it", R("一个精致的盘发加上珍珠发饰，没人看出来。|An elegant updo with pearl pins — no one could tell.", { perf: 6, smarts: 2 }))
    ]),
    JE("jf_hair_secret", ["hair"], [18, 65], "理发椅上的秘密|Secrets in the Chair", "✂️", "一位常客每次来都对你倾诉婚姻里的烦恼。今天她说：“我打算离婚了。”|A regular always pours out her marriage troubles. Today she says: “I’m getting divorced.”", [
      O("认真听她说完|Hear her out", R("她走的时候说：“比看心理医生管用多了。”她把全家人都介绍来了。|Leaving, she said: “Better than therapy.” She sent her whole family to you.", { eq: 4, perf: 6 })),
      O("给她换一个全新的发型|Give her a brand-new look", R("她看着镜子里的自己，第一次笑了。|She looked in the mirror and smiled for the first time.", { happy: 4, perf: 4 }))
    ]),
    JE("jf_hair_own", ["hair"], [22, 60], "自己开店|Opening Your Own Salon", "💈", "你的熟客越来越多，有人劝你自己开一家店。|Your clientele keeps growing; people tell you to open your own salon.", [
      O("开！|Do it!", RC(.55, "开业第一天，老客户们排着队来捧场。|On opening day your regulars queued round the block.", { money: -8000, happy: 10, perf: 10, flag: "ownSalon" }, "租金太贵，撑了八个月就关了。|The rent was too high; it closed after eight months.", { money: -8000, happy: -8 })),
      O("继续在店里干|Stay where you are", R("店长给你提了提成比例，怕你走。|The owner raised your commission so you wouldn’t leave.", { money: 200 }))
    ]),

    /* ---------------- mechanic ---------------- */
    JE("jf_mech_brakes", ["mechanic"], [18, 65], "刹车片|The Brake Pads", "🔧", "一位客人只想换机油，但你发现他的刹车片已经磨到底了。|A customer only wants an oil change, but his brake pads are worn to nothing.", [
      O("坚持告诉他，免费帮他检查|Insist on telling him and check it for free", R("他换了刹车片。一个月后他专门来告诉你，那次在高速上急刹救了他一家。|He replaced them. A month later he came back: an emergency stop on the motorway had saved his family.", { karma: 10, perf: 6 })),
      O("顺便多收他一笔钱|Charge him extra for it", R("他付了钱，但再也没来过。|He paid — and never came back.", { money: 80, karma: -4 }))
    ]),
    JE("jf_mech_classic", ["mechanic"], [20, 70], "谷仓里的老爷车|A Classic in a Barn", "🚘", "一位老人请你去他家谷仓修一辆四十年没发动过的老爷车。|An old man asks you to restore a car that hasn’t run in forty years.", [
      O("花三个月修好它|Spend three months on it", RC(.6, "发动机响起的那一刻，老人哭了。车上了汽车杂志，你的店也出了名。|When the engine roared to life the old man wept. The car made a magazine, and so did your shop.", { fame: 4, money: 2000, happy: 10 }, "缺的零件全世界都找不到了。|The missing parts no longer exist anywhere.", { happy: -3 })),
      O("报价太高，他放弃了|Quote too high; he gives up", R("他把车卖给了收藏家。|He sold it to a collector.", {}))
    ]),

    /* ---------------- street vendor ---------------- */
    JE("jf_vendor_chengguan", ["vendor"], [18, 70], "城管来了|Here Come the Inspectors", "🚨", "有人喊：“城管来了！”整条街的摊贩开始收摊。|Someone shouts “Inspectors!” and the whole street starts packing up.", [
      O("推着车跑|Run with the cart", RC(.6, "你拐进小巷，躲过了一劫。|You ducked into an alley and got away.", { health: -1 }, "车翻了，一锅汤全洒了。|The cart tipped and the whole pot spilled.", { money: -50, happy: -4 })),
      O("站着不动，好好说|Stay and talk it through", RC(.5, "城管看你干净整洁，给你指了一个可以合法摆摊的地方。|Your stall was spotless; the inspector pointed you to a legal pitch.", { eq: 3 }, "你的摊车被没收了。|Your cart was confiscated.", { money: -200, happy: -8 }))
    ]),
    JE("jf_vendor_viral", ["vendor"], [18, 70], "被拍成网红|Going Viral", "📱", "一个美食博主拍了你的小摊，视频播放量破了千万。|A food blogger filmed your stall and the video hit ten million views.", [
      O("趁热涨价|Raise prices while it’s hot", R("赚了一阵快钱，但老顾客都骂你。|Quick money — and your regulars cursed you.", { money: 600, karma: -3 })),
      O("价格不变，做得更认真|Same prices, even more care", R("排队的人越来越多，你还收了两个徒弟。|The queues grew and you took on two apprentices.", { money: 400, fame: 3, karma: 3 }))
    ]),

    /* ---------------- sales ---------------- */
    JE("jf_sales_target", ["sales"], [20, 60], "月底冲业绩|Month-End Quota", "📈", "离月底还有三天，你的业绩还差三成。|Three days to month-end, and you’re thirty percent short.", [
      O("连夜打一百个电话|Make a hundred calls tonight", RC(.5, "第九十七个电话签下了一个大单。|Call ninety-seven landed a big deal.", { perf: 12, money: 500, stress: 8 }, "全部被挂断。|Every one of them hung up.", { stress: 10, perf: -2 })),
      O("找老客户帮忙|Ask old clients for a favour", RC(.65, "老客户给你介绍了两个新客户。|An old client introduced two new ones.", { perf: 8, eq: 2 }, "老客户说“下个月吧”。|“Next month,” they said.", {})),
      O("给客户过度承诺|Overpromise to a client", RC(.6, "单子签了。|The deal closed.", { perf: 10, karma: -4 }, "客户发现承诺做不到，投诉了你。|The client found out and complained.", { perf: -10 }))
    ]),
    JE("jf_sales_dinner", ["sales"], [20, 60], "酒桌上的单子|The Deal at Dinner", "🍷", "客户在饭桌上说：“喝完这一瓶，合同就签。”|Over dinner the client says: “Finish this bottle and the contract’s yours.”", [
      O("喝！|Drink!", RC(.6, "你喝完了，合同也签了。第二天你头疼了一整天。|You drank it and got the deal — and a day-long headache.", { perf: 12, health: -5, drink: 8 }, "你喝吐了，客户哈哈大笑，还是没签。|You threw up; the client laughed and didn’t sign.", { health: -6, happy: -6 })),
      O("以茶代酒，用诚意打动他|Toast with tea and win him with sincerity", RC(.4, "他敬重你的坦诚，签了。|He respected your honesty and signed.", { perf: 10, karma: 3 }, "他说你“不够意思”。|He said you weren’t “one of us”.", { perf: -4 }))
    ]),

    /* ---------------- real-estate agent ---------------- */
    JE("jf_agent_haunted", ["agent"], [20, 65], "凶宅|A House with a Past", "🏚️", "你手上有一套房子价格很低，但几年前发生过命案。客户问：“这房子有什么问题吗？”|You have a cheap listing where someone died years ago. The client asks: “Anything wrong with this place?”", [
      O("如实告知|Tell the truth", R("客户想了想，以更低的价格买下了，还感谢你的坦诚。|The client thought it over, bought at a lower price, and thanked you for your honesty.", { karma: 6, perf: 4 })),
      O("什么也不说|Say nothing", RC(.6, "成交了，提成不少。|Sold — a nice commission.", { money: 800, karma: -6 }, "邻居告诉了买家，买家把你告上了法庭。|A neighbour told the buyer, who sued you.", { money: -1500, perf: -15 }))
    ]),
    JE("jf_agent_couple", ["agent"], [20, 65], "看了三十套房的夫妻|The Couple Who Saw Thirty Homes", "🔑", "一对年轻夫妻已经看了三十套房，每次都差一点点。|A young couple has viewed thirty homes and always falls just short.", [
      O("帮他们找一套带学区的小房子|Find them a small place in a good school district", RC(.6, "他们签约那天抱着你哭了，后来生了孩子还请你吃满月酒。|They cried hugging you at signing — and later invited you to their baby’s first-month party.", { perf: 8, happy: 6, money: 400 }, "最后他们决定继续租房。|In the end they kept renting.", {})),
      O("推给别的同事|Pass them to a colleague", R("同事两周后成交了。|Your colleague closed in two weeks.", { perf: -2 }))
    ]),

    /* ---------------- personal trainer ---------------- */
    JE("jf_trainer_client", ["trainer"], [18, 55], "一百五十斤的决心|A Hundred-Pound Promise", "🏋️", "一位体重严重超标的客户对你说：“我想在女儿婚礼前瘦下来。”|A severely overweight client tells you: “I want to lose weight before my daughter’s wedding.”", [
      O("为他定制计划，每天陪练|Make a custom plan and train him daily", RC(.6, "八个月后他减了四十斤，牵着女儿走过了红毯。他把你的照片挂在了家里。|Eight months and forty pounds later, he walked his daughter down the aisle — and hung your photo at home.", { perf: 12, happy: 10, karma: 4, fame: 2 }, "他坚持了两个月就放弃了。|He gave up after two months.", { happy: -3 })),
      O("推销私教套餐|Sell him the premium package", R("他买了，但只来了三次。|He bought it and came three times.", { money: 300, karma: -2 }))
    ]),
    JE("jf_trainer_star", ["trainer"], [20, 55], "明星的私教|Trainer to a Star", "💪", "一位明星为了新电影要练出腹肌，指名要你做私教。|A star needs abs for a new film and asks for you by name.", [
      O("接下来，严格训练|Take it — strict training", RC(.65, "电影海报一出，所有人都在问“他的教练是谁”。|When the poster dropped, everyone asked who the trainer was.", { fame: 6, money: 3000, perf: 10 }, "明星吃不了苦，中途换了教练。|The star couldn’t take it and switched trainers.", { happy: -4 })),
      O("推荐给同事|Recommend a colleague", R("同事后来自己开了健身房。|Your colleague went on to open his own gym.", {}))
    ]),

    /* ---------------- flight attendant ---------------- */
    JE("jf_attend_doctor", ["attendant"], [20, 55], "机上有医生吗|Is There a Doctor on Board?", "✈️", "飞行途中，一位乘客突然晕倒，呼吸急促。|Mid-flight, a passenger collapses, struggling to breathe.", [
      O("广播找医生，同时急救|Page for a doctor and start first aid", R("一位医生乘客赶来协助，病人在落地前恢复了意识。航空公司给你发了嘉奖。|A doctor on board helped; the patient came round before landing. The airline commended you.", { karma: 8, perf: 10, fame: 1 })),
      O("申请备降|Request a diversion", R("飞机备降在最近的机场，病人被及时送医。|The plane diverted and the patient got to hospital in time.", { karma: 6, perf: 4 }))
    ]),
    JE("jf_attend_rude", ["attendant"], [20, 55], "头等舱的客人|The First-Class Passenger", "🥂", "头等舱一位客人对你大呼小叫，还把饮料泼在了你身上。|A first-class passenger screams at you and throws a drink over you.", [
      O("保持微笑，按规程处理|Keep smiling and follow procedure", R("机长出面警告了他，落地后警察把他带走了。同事们为你鼓掌。|The captain warned him; police met him at the gate. Your colleagues applauded you.", { eq: 4, perf: 6 })),
      O("冷冷地回敬一句|Answer him coldly", RC(.5, "全舱乘客都为你叫好。|The whole cabin cheered.", { happy: 6, fame: 1 }, "他投诉了你，你被停飞一周。|He complained and you were grounded for a week.", { perf: -8 }))
    ]),
    JE("jf_attend_layover", ["attendant"], [20, 45], "巴黎过夜|A Night in Paris", "🗼", "航班在巴黎过夜。机组的副驾驶邀请你去塞纳河边散步。|An overnight layover in Paris. The first officer invites you for a walk along the Seine.", [
      O("去|Go", function (c) { var p = c.p, g = p.orient === "gay" ? p.g : (p.g === "m" ? "f" : "m"); var n = N.mkRomantic({ love: 40, aff: 35 }); n.g = g; n.job = "飞行员|Pilot"; n.rel = "crush"; n.pin = 1; H.fx(c, { happy: 8 }); return G.L("你们在桥上看着埃菲尔铁塔整点闪烁。{n}说：“下次过夜，还一起吗？”|On a bridge you watched the Eiffel Tower sparkle on the hour. {n} said: “Next layover — together again?”", { n: n.name }); }),
      O("回酒店睡觉|Go back to the hotel and sleep", R("你倒好了时差，第二天精神很好。|You beat the jet lag and felt great the next day.", { health: 2 }))
    ]),

    /* ---------------- firefighter ---------------- */
    JE("jf_fire_child", ["fire"], [18, 60], "火场里的哭声|A Cry in the Fire", "🧑‍🚒", "大火已经烧到三楼，你听见里面有孩子在哭。队长说：“太危险，等支援！”|The fire has reached the third floor and you hear a child crying inside. The captain says: “Too dangerous — wait for backup!”", [
      O("冲进去|Go in", RC(.6, "你抱着孩子从浓烟里冲了出来。照片登上了全国报纸的头版。|You burst out of the smoke with the child in your arms. The photo made every front page.", { fame: 12, karma: 15, perf: 15, health: -8 }, "你救出了孩子，自己却被掉落的横梁砸伤。|You got the child out but a falling beam injured you.", { karma: 15, health: -30, fame: 6 })),
      O("服从命令，架云梯|Follow orders and raise the ladder", R("支援车两分钟后赶到，孩子从窗口被救了出来。|Backup arrived two minutes later and the child was rescued from the window.", { perf: 6, eq: 2 }))
    ], 1.2),
    JE("jf_fire_cat", ["fire"], [18, 60], "树上的猫|A Cat up a Tree", "🐈", "一位老奶奶打电话来：她的猫在树上下不来了。|An old lady calls: her cat is stuck up a tree.", [
      O("出动云梯|Send the ladder", R("猫被救下来后，老奶奶给全队包了饺子。|After the rescue, she made dumplings for the whole station.", { happy: 6, karma: 3 })),
      O("教她用猫粮引它下来|Tell her to lure it down with food", R("十分钟后猫自己下来了。|The cat came down by itself ten minutes later.", { smarts: 1 }))
    ])
  ]);
})();
