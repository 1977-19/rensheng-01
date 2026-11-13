/* Version 1.7: six new families — internet influencers, fishermen, a racing dynasty, a winery, ranchers and
   stage magicians — each with its own arc. And six mysteries that unfold over many years: a map in an attic,
   letters from a stranger, a twin you never knew, a house that keeps a secret, a debt from the past, and a
   time capsule that was never meant for you. */
(function () {
  "use strict";
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function later(id, years) { var p = P(); p.flags.chain = p.flags.chain || {}; p.flags.chain[id] = S().year + years; }

  [
    { id: "influencer", n: "网红家庭|Influencer Family", d: "你还没出生，就已经有三十万粉丝在等你了。|Before you were born, three hundred thousand followers were already waiting for you.", vip: 0, w: [300000, 3000000], inc: [80000, 400000], job: ["百万粉丝博主|Influencer with Millions of Followers", "网红经纪人|Influencer Manager"], st: { looks: 4, eq: 3 }, sib: [0, 2], fl: ["kidStarOk"] },
    { id: "fisher", n: "渔民之家|Fishing Family", d: "你家的小渔船叫“平安号”，爷爷说每一代人都要在船上过一个夏天。|The family boat is called Safe Return; Grandpa says every generation must spend a summer aboard.", vip: 0, w: [8000, 60000], inc: [16000, 40000], job: ["渔民|Fisherman", "船老大|Skipper"], st: { health: 8 }, sib: [1, 3] },
    { id: "racing", n: "赛车世家|Racing Dynasty", d: "你家的车库里停着三代人的赛车，奖杯多得放不下。|Three generations of race cars fill the garage; there’s no room left for the trophies.", vip: 0, w: [5000000, 60000000], inc: [800000, 5000000], job: ["退役世界冠军|Retired World Champion", "车队老板|Team Owner"], st: { health: 6, smarts: 2 }, sib: [0, 2], fl: ["rich"] },
    { id: "winery", n: "酒庄世家|Winemaking Family", d: "你在葡萄园里学会了走路，第一句话是“好年份”。|You learned to walk among the vines. Your first words were “good vintage”.", vip: 0, w: [2000000, 30000000], inc: [200000, 1500000], job: ["酒庄庄主|Vineyard Owner", "首席酿酒师|Head Winemaker"], st: { looks: 2, eq: 4 }, sib: [1, 3], fl: ["rich"] },
    { id: "ranch", n: "牧场主家庭|Ranching Family", d: "你家的牧场一眼望不到边，三千头牛，两匹最好的马。|The family ranch runs past the horizon: three thousand cattle and two of the finest horses.", vip: 0, w: [800000, 8000000], inc: [90000, 500000], job: ["牧场主|Rancher", "马术教练|Riding Instructor"], st: { health: 10 }, sib: [1, 4] },
    { id: "magic", n: "魔术世家|Family of Magicians", d: "你家的每一扇门后都可能藏着一只鸽子。爸爸说，魔术的秘密只传给家里人。|A dove might be behind any door in the house. Dad says the secrets of magic pass only to family.", vip: 0, w: [200000, 2000000], inc: [60000, 600000], job: ["舞台魔术大师|Master Illusionist", "魔术道具设计师|Illusion Designer"], st: { eq: 6, smarts: 3 }, sib: [0, 2] }
  ].forEach(function (o) { if (!G.ORIGIN[o.id]) { G.ORIGINS.push(o); G.ORIGIN[o.id] = o; } });
  var fc = G.famClass;
  if (fc) G.famClass = function () { var c = fc.apply(this, arguments), p = S() && S().p; if (p && (p.origin === "racing" || p.origin === "winery")) c = Math.max(c, 3); if (p && p.origin === "ranch") c = Math.max(c, 2); return c; };
  function OX(id, org, a, title, icon, t, o, w) { return E(id, a, title, icon, t, o, { w: w || 2.6, if: function (S2, p) { return p.origin === org && !p.jail && (a[0] >= 18 || !p.flags.heir); } }); }

  G.evs([
    /* influencer */
    OX("o7_inf_baby", "influencer", [3, 10], "镜头里的童年|A Childhood on Camera", "📱", "妈妈每天都要拍你的视频。今天你摔了一跤，第一反应是看镜头。|Mum films you every day. Today you fall over — and your first instinct is to look at the camera.", [
      O("说“我不想拍了”|Say “I don’t want to be filmed any more”", R("妈妈愣了很久，放下了手机。那天你们去公园玩了一整天，没有拍一张照片。|Mum stared a long time, then put the phone down. You spent the whole day in the park and took no photos.", { happy: 8, par: 5 })),
      O("对着镜头做鬼脸|Pull a face for the camera", R("那条视频有五百万播放。|That clip got five million views.", { fame: 4, happy: 2 }))
    ]),
    OX("o7_inf_school", "influencer", [10, 16], "被认出来|Recognised", "🙈", "新学校里，同学们都认出了你：“你就是那个视频里的小孩！”|At your new school, everyone recognises you: “You’re the kid from the videos!”", [
      O("大大方方地承认|Own it", R("你成了全校最受欢迎的人，但你分不清谁是真心和你做朋友。|You became the most popular kid in school — but couldn’t tell who your real friends were.", { fame: 2, eq: 3 })),
      O("求爸妈删掉所有视频|Beg your parents to delete everything", RC(.5, "爸妈删了。他们说：“对不起，我们没想过你的感受。”|They did. “We’re sorry. We never thought about how you felt.”", { par: 8, happy: 6 }, "爸妈说：“那是我们的饭碗。”|“That’s how we earn a living,” they said.", { par: -6, happy: -6 }))
    ]),
    OX("o7_inf_own", "influencer", [18, 40], "自己的账号|An Account of Your Own", "🎥", "你决定开一个自己的账号，但不想沾父母的光。|You decide to start your own channel — without trading on your parents’ name.", [
      O("用化名从零开始|Start from zero under another name", RC(.4, "一年后你的粉丝超过了父母。他们在评论区留言：“为你骄傲。”|A year later you had more followers than your parents. They commented: “So proud of you.”", { fame: 10, happy: 12, money: 8000 }, "粉丝涨得很慢，但每一个都是真的。|Growth was slow — but every follower was real.", { happy: 4 })),
      O("和父母合拍|Make videos with your parents", R("“家庭频道”火了，但你常常觉得自己还是那个镜头里的小孩。|The family channel took off, but you often still felt like the kid on camera.", { fame: 6, money: 5000 }))
    ]),
    /* fisher */
    OX("o7_fish_summer", "fisher", [10, 16], "船上的夏天|A Summer at Sea", "⛵", "按家里的规矩，你跟着爷爷出海一个夏天。第一天你就吐了。|By family rule you spend a summer at sea with Grandpa. On day one you’re seasick.", [
      O("咬牙坚持|Stick it out", R("夏天结束时，你能自己收网了。爷爷把他的旧罗盘送给了你。|By summer’s end you could haul the nets alone. Grandpa gave you his old compass.", { health: 6, eq: 3, par: 4 })),
      O("哭着要回家|Cry to go home", R("爷爷笑着把你送上了岸：“海不是谁都喜欢的。”|Grandpa laughed and put you ashore: “Not everyone loves the sea.”", { happy: 2 }))
    ]),
    OX("o7_fish_typhoon", "fisher", [12, 30], "台风夜|The Typhoon Night", "🌀", "台风来了，爸爸的船还没回港，电台里已经联系不上了。|A typhoon is coming. Dad’s boat isn’t back, and the radio has gone silent.", [
      O("和妈妈一起守在码头|Wait on the pier with Mum", RC(.75, "凌晨四点，平安号的灯在雨里亮了起来。|At 4 a.m. Safe Return’s lights appeared through the rain.", { par: 10, happy: 10 }, "第二天，救援队在礁石边找到了爸爸，他断了一条腿，但活了下来。|The next day rescuers found Dad by the rocks — a broken leg, but alive.", { par: 10, stress: 15 })),
      O("去求邻居的大船出海找|Beg the neighbour’s big boat to search", R("你们在风浪里找到了爸爸的船。邻居后来说：“这孩子有种。”|You found Dad’s boat in the swell. The neighbour said later: “That kid has guts.”", { par: 12, eq: 4, fame: 1 }))
    ], 2),
    OX("o7_fish_boat", "fisher", [25, 60], "平安号|Safe Return", "🚤", "爸爸老了，平安号也老了。你要决定它的去留。|Dad is old, and so is Safe Return. You must decide what becomes of her.", [
      O("修好它，开一家渔家乐|Restore her and start a fishing-tour business", RC(.55, "游客们排队上平安号出海。爸爸每天坐在船头给他们讲故事。|Tourists queued to sail on Safe Return. Dad sat at the bow telling stories every day.", { money: 6000, happy: 10, par: 8 }, "生意一般，但爸爸很开心。|Business was so-so, but Dad was happy.", { par: 6 })),
      O("把它停在港口，当作纪念|Moor her in the harbour as a memorial", R("每次回家，你都会去船上坐一会儿。|Every time you visit home, you sit aboard for a while.", { eq: 3 }))
    ]),
    /* racing */
    OX("o7_race_kart", "racing", [7, 14], "第一辆卡丁车|Your First Kart", "🏁", "七岁生日，爷爷送了你一辆卡丁车：“我们家的人，都是从这里开始的。”|For your seventh birthday Grandpa gives you a kart: “Everyone in this family started here.”", [
      O("每天放学都去练|Practise every day after school", R("你在少年卡丁车赛上拿了第一个冠军，爷爷把奖杯摆在了他的奖杯旁边。|You won your first junior title; Grandpa put the trophy beside his own.", { health: 4, happy: 8, flag: "kartChamp" })),
      O("说你更喜欢画画|Say you’d rather draw", R("爷爷沉默了一会儿，第二天送来了一套最好的画笔。|Grandpa was quiet, then the next day sent the finest set of brushes.", { happy: 6, par: 4 }))
    ]),
    OX("o7_race_crash", "racing", [14, 40], "父亲的事故|Your Father’s Crash", "🚑", "你在电视直播里看到父亲的赛车在弯道上翻滚起火。|On live TV you watch your father’s car flip and burn in a corner.", [
      O("冲去医院|Rush to the hospital", R("他活下来了，但再也不能比赛。他握着你的手说：“这条路，你自己选。”|He survived but would never race again. Holding your hand he said: “This road is yours to choose.”", { par: 12, stress: 15 })),
      O("发誓永远不碰赛车|Swear never to race", R("你把卡丁车锁进了车库。|You locked the kart in the garage.", { flag: "noRace", stress: 8 }))
    ], 2),
    OX("o7_race_seat", "racing", [17, 30], "车队的位置|A Seat on the Team", "🏎️", "家族车队给你留了一个正式车手的位置。网上很多人说你“靠关系”。|The family team offers you a race seat. Online, people say you got it through connections.", [
      O("接受，用成绩说话|Take it and let results talk", function (c) { if (G.ch(.5)) { H.fx(c, { fame: 10, happy: 12 }); return "你在第三场比赛就站上了领奖台。闲话消失了。|You were on the podium by your third race. The talk stopped."; } H.fx(c, { fame: 3, happy: -4 }); return "你一整个赛季都在中游徘徊。|You spent the whole season mid-pack."; }),
      O("去别的车队从测试车手做起|Start as a test driver for another team", R("三年后，你凭自己拿到了正式席位。爷爷在看台上哭了。|Three years later you earned a seat on your own. Grandpa wept in the stands.", { eq: 4, fame: 6, par: 6 }))
    ]),
    /* winery */
    OX("o7_wine_harvest", "winery", [6, 14], "采收季|Harvest Time", "🍇", "采收季，全家人和工人一起在葡萄园里摘葡萄。今年你可以第一次踩葡萄了。|Harvest: family and workers pick together. This year you get to tread the grapes for the first time.", [
      O("跳进木桶|Jump into the vat", R("你踩得满腿都是紫色，笑得停不下来。那一年的酒，爷爷叫它“孙子的年份”。|Purple to the knees and laughing; Grandpa called that year’s wine “the grandchild’s vintage”.", { happy: 10, par: 5 })),
      O("跟着酿酒师学看葡萄|Learn from the winemaker how to judge grapes", R("你学会了用舌头分辨葡萄的成熟度。|You learned to taste ripeness on your tongue.", { smarts: 3, flag: "winePalate" }))
    ]),
    OX("o7_wine_frost", "winery", [18, 60], "春霜|A Spring Frost", "❄️", "天气预报说今夜有一场罕见的霜冻，新芽可能全部冻死。|The forecast says a rare frost tonight could kill every new bud.", [
      O("通宵在葡萄园里点篝火|Light fires among the vines all night", RC(.65, "全家和工人守了一整夜。天亮时，大部分葡萄藤保住了。|Family and workers kept watch all night. At dawn, most of the vines were saved.", { money: 20000, eq: 4, health: -3 }, "霜太重了，一半的葡萄藤还是没了。|The frost was too hard; half the vines were lost.", { money: -40000, happy: -8 })),
      O("买保险，听天由命|Rely on the insurance", R("保险赔了一部分，但那一年的酒少了一半。|The insurance paid some, but there was half as much wine that year.", { money: -15000 }))
    ]),
    OX("o7_wine_award", "winery", [25, 70], "世界葡萄酒大赛|The World Wine Awards", "🥇", "你亲手酿的第一款酒被送去参加世界葡萄酒大赛。|The first wine you made yourself is entered in the World Wine Awards.", [
      O("等待结果|Wait for the result", RC(function (c) { return .3 + (c.p.flags.winePalate ? .25 : 0); }, "金奖！订单一夜之间多了十倍。|Gold! Orders multiplied tenfold overnight.", { fame: 8, money: 50000, happy: 15 }, "铜奖。爸爸拍拍你的肩：“我第一次连奖都没有。”|Bronze. Dad patted your shoulder: “My first one won nothing.”", { happy: 4, par: 4 }))
    ]),
    /* ranch */
    OX("o7_ranch_foal", "ranch", [6, 14], "小马驹|The Foal", "🐴", "半夜，牧场里最好的母马要生了，爸爸叫醒了你。|In the night, the ranch’s best mare is foaling, and Dad wakes you.", [
      O("帮爸爸接生|Help Dad deliver it", R("小马驹站起来的那一刻，爸爸说：“它是你的了。给它起个名字吧。”|As the foal stood, Dad said: “She’s yours. Give her a name.”", { happy: 12, eq: 3, flag: "ownHorse" })),
      O("在旁边举着手电筒|Hold the torch", R("你一整夜都没合眼。|You didn’t close your eyes all night.", { happy: 6 }))
    ]),
    OX("o7_ranch_rodeo", "ranch", [14, 30], "牛仔竞技|The Rodeo", "🤠", "镇上的牛仔竞技比赛，大家都在等牧场主家的孩子出场。|At the town rodeo, everyone is waiting for the rancher’s kid.", [
      O("骑上那头最野的公牛|Ride the wildest bull", RC(.4, "你坚持了八秒，全场沸腾。|You held on for eight seconds; the crowd went wild.", { fame: 4, happy: 12, health: -2 }, "你被甩出去三米远，摔断了锁骨。|You were thrown three metres and broke your collarbone.", { health: -15 })),
      O("参加绕桶赛|Enter barrel racing", R("你和你的马配合得天衣无缝，拿了第一。|You and your horse moved as one and took first place.", { happy: 8, fame: 2 }))
    ]),
    OX("o7_ranch_drought", "ranch", [22, 65], "干旱之年|The Dry Year", "🏜️", "连续一年没下雨，牧草枯死，牛开始掉膘。|A year without rain: the pasture is dead and the cattle are losing weight.", [
      O("卖掉一半的牛|Sell half the herd", R("你保住了牧场，但卖牛那天，你一个人在马厩里坐了很久。|You kept the ranch, but on sale day you sat alone in the stable a long time.", { money: 30000, happy: -6 })),
      O("借钱买饲料，硬撑|Borrow for feed and hold on", RC(.55, "秋天终于下雨了，牛群一头都没少。|Rain came in autumn; you lost not a single head.", { happy: 12, money: -20000 }, "雨一直没来，你欠了一大笔债。|The rain never came, and you were deep in debt.", { money: -60000, stress: 15 }))
    ]),
    /* magic */
    OX("o7_mag_secret", "magic", [8, 14], "第一个秘密|The First Secret", "🃏", "爸爸把你叫进书房，锁上门：“今天教你第一个魔术。记住，永远不能告诉别人。”|Dad calls you into the study and locks the door: “Today you learn your first trick. Never tell anyone.”", [
      O("发誓保密|Swear secrecy", R("你在学校表演了那个魔术，全班都惊呆了。你一个字也没透露。|You performed it at school and stunned the class. You never revealed a thing.", { eq: 4, happy: 8, flag: "magicSecret" })),
      O("偷偷告诉最好的朋友|Secretly tell your best friend", R("朋友说：“原来这么简单！”你突然觉得，魔术不那么神奇了。|Your friend said: “That’s all?” Suddenly magic felt less magical.", { happy: -3 }))
    ]),
    OX("o7_mag_debut", "magic", [15, 30], "首演|Your Debut", "🎩", "你第一次登上家族剧院的舞台，压轴的是一个你练了三年的大魔术。|Your first time on the family theatre’s stage — closing with a grand illusion you’ve rehearsed for three years.", [
      O("照常表演|Perform as rehearsed", RC(.7, "全场起立鼓掌。爸爸在侧幕里冲你竖起了大拇指。|A standing ovation. From the wings, Dad gave you a thumbs-up.", { fame: 6, happy: 12 }, "道具卡住了，你临场编了一个笑话，观众笑成一片。|A prop jammed; you improvised a joke and the audience roared.", { fame: 3, eq: 4 })),
      O("临时加一个自己设计的魔术|Add an illusion of your own design", RC(.45, "这个魔术后来成了你的招牌。|It became your signature trick.", { fame: 10, happy: 15 }, "失败了，但爸爸说：“敢冒险，才是魔术师。”|It failed, but Dad said: “Daring is what makes a magician.”", { happy: -2, par: 4 }))
    ]),
    OX("o7_mag_expose", "magic", [20, 60], "揭秘节目|The Exposé Show", "📺", "一档电视节目开出高价，请你揭秘家族的招牌魔术。|A TV show offers a fortune for you to reveal the family’s signature illusion.", [
      O("拒绝|Refuse", R("爸爸知道后，第一次夸你：“你是真正的魔术师。”|When Dad heard, he praised you for the first time: “You’re a real magician.”", { par: 10, karma: 4 })),
      O("答应|Agree", R("节目收视很高。但从那天起，家族的老观众再也没来过。|The ratings were huge. But the family’s old audience never came back.", { money: 30000, par: -15, fame: 3 }))
    ])
  ]);

  /* =========================== mysteries over many years =========================== */
  function due(id) { var c = P().flags.chain; return c && c[id] && S().year >= c[id]; }
  var STARTERS = { mx_map1: 1, mx_letter1: 1, mx_twin1: 1, mx_house1: 1, mx_debt1: 1, mx_cap1: 1 };
  function CH(id, a, title, icon, t, o, gate) { return E(id, a, title, icon, t, o, { w: STARTERS[id] ? .45 : 4, if: function (S2, p) { return !p.jail && gate(p); } }); }
  function fl(p) { return p.flags.chain = p.flags.chain || {}; }
  G.evs([
    /* the attic map */
    CH("mx_map1", [10, 60], "阁楼里的地图|A Map in the Attic", "🗺️", "你在老房子的阁楼里找到一个铁盒，里面是一张手绘地图，上面用红笔圈着一个小岛。|In an old attic you find a tin box holding a hand-drawn map, a small island circled in red.", [
      O("收好，以后一定要去看看|Keep it — you’ll go one day", function (c) { fl(c.p).map = 1; later("map2", G.ri(3, 8)); return "你把地图夹进了日记本里。|You tucked the map into your diary."; }),
      O("当成小孩的涂鸦扔掉|Throw it out as a child’s doodle", function (c) { fl(c.p).map = 9; return "那天晚上你梦见了那个小岛。|That night you dreamed of the island."; })
    ], function (p) { return !fl(p).map; }),
    CH("mx_map2", [16, 70], "地图上的岛|The Island on the Map", "🏝️", "你查到了：地图上的小岛真实存在，离海岸二十公里，现在无人居住。|You find out the island on the map is real — twenty kilometres offshore, uninhabited.", [
      O("租一条船去看看|Hire a boat and go", function (c) { if (!c.pay(c.$(800))) return "你付不起船钱，只好再等等。|You couldn’t afford the boat, so it would have to wait."; fl(c.p).map = 2; later("map3", G.ri(1, 3)); H.fx(c, { happy: 6 }); return "你在红圈的位置挖到了一块刻着字的石头：“往东一百步，第二棵老树下。”|At the circled spot you dug up a carved stone: “A hundred paces east, under the second old tree.”"; }),
      O("太远了，算了|Too far — forget it", function (c) { fl(c.p).map = 9; return "地图一直躺在你的日记本里。|The map stayed in your diary."; })
    ], function (p) { return fl(p).map === 1 && due("map2"); }),
    CH("mx_map3", [16, 80], "第二棵老树|The Second Old Tree", "🌳", "你带着铲子回到了岛上，在第二棵老树下，铲子碰到了一个木箱。|You return to the island with a spade. Under the second old tree, it strikes a wooden chest.", [
      O("打开它|Open it", function (c) { fl(c.p).map = 3; var r = G.R(); if (r < .45) { H.fx(c, { money: 80000, happy: 20, fame: 3 }); G.major("在小岛上挖到了宝藏|Found buried treasure on an island"); return "箱子里是一袋民国时期的金币，还有一封信：“给找到它的有缘人。”|Inside: a bag of old gold coins, and a letter: “For whoever was meant to find this.”"; } if (r < .85) { H.fx(c, { happy: 12, eq: 5 }); return "箱子里是一个老人一生的情书，写给一个他没能娶到的女孩。你后来找到了她的孙女，把信交给了她。|Inside: a lifetime of love letters from an old man to a girl he never married. You later found her granddaughter and gave them to her."; } H.fx(c, { happy: 8 }); return "箱子里是另一张地图。你笑了。|Inside was another map. You laughed."; })
    ], function (p) { return fl(p).map === 2 && due("map3"); }),
    /* letters from a stranger */
    CH("mx_letter1", [12, 50], "没有署名的信|An Unsigned Letter", "✉️", "你收到一封没有署名的信：“你不认识我，但我一直在看着你长大。生日快乐。”|An unsigned letter: “You don’t know me, but I’ve watched you grow up. Happy birthday.”", [
      O("留着这封信|Keep it", function (c) { fl(c.p).letter = 1; later("letter2", G.ri(2, 5)); return "你把信放在了枕头下面。|You put it under your pillow."; }),
      O("交给爸妈|Give it to your parents", function (c) { fl(c.p).letter = 1; later("letter2", G.ri(2, 5)); H.fx(c, { par: 2 }); return "妈妈看完信，脸色变了，什么也没说。|Mum read it, changed colour, and said nothing."; })
    ], function (p) { return !fl(p).letter; }),
    CH("mx_letter2", [14, 60], "第二封信|The Second Letter", "💌", "又一封没有署名的信，里面夹着一张你小时候在公园里的照片——拍照的人站在很远的地方。|Another unsigned letter, with a photo of you as a child in a park — taken from far away.", [
      O("顺着邮戳去找|Trace the postmark", function (c) { fl(c.p).letter = 2; later("letter3", G.ri(1, 4)); return "邮戳来自一个你从没去过的小镇。你在那里的养老院打听到，有一位老人每年都会寄一封信。|The postmark was from a small town you’d never visited. At its care home you learned an old man posts one letter every year."; }),
      O("不想知道|You don’t want to know", function (c) { fl(c.p).letter = 9; return "那之后，信再也没来过。|The letters stopped after that."; })
    ], function (p) { return fl(p).letter === 1 && due("letter2"); }),
    CH("mx_letter3", [16, 80], "养老院里的老人|The Old Man at the Care Home", "👴", "你见到了那位老人。他看着你，眼泪一下子流了下来。|You meet the old man. He looks at you, and tears come at once.", [
      O("坐下来听他说|Sit and listen", function (c) { fl(c.p).letter = 3; var r = G.R(); if (r < .5) { H.fx(c, { eq: 6, happy: 6 }); return "他是当年在火灾中救下你的消防员。你那时还在襁褓里，他一直想知道你过得好不好。|He was the firefighter who saved you from a fire as a baby. He’d always wanted to know you were all right."; } H.fx(c, { eq: 6, happy: 4, stress: 6 }); var n = N.make({ rel: "kin", g: "m", age: G.ri(70, 88), aff: 60 }); n.kin = "elder"; n.pin = 1; n.job = "你的亲祖父|Your Biological Grandfather"; return "他是你的亲祖父。很多年前，因为一场家族纷争，他不能和你相认。|He was your biological grandfather. A family feud long ago had kept him from claiming you."; })
    ], function (p) { return fl(p).letter === 2 && due("letter3"); }),
    /* the twin */
    CH("mx_twin1", [18, 50], "被认错的人|Mistaken Identity", "🪞", "一个陌生人在街上拉住你：“小雨？你怎么回来了？”你根本不叫这个名字。|A stranger grabs your arm in the street: “Xiaoyu? You’re back?” That isn’t your name.", [
      O("问他“小雨”是谁|Ask who Xiaoyu is", function (c) { fl(c.p).twin = 1; later("twin2", G.ri(1, 3)); return "他说小雨在另一个城市生活，和你长得一模一样，连说话的语气都像。|He said Xiaoyu lives in another city, looks exactly like you, even sounds like you."; }),
      O("说他认错人了|Say he has the wrong person", function (c) { fl(c.p).twin = 9; return "他道了歉，但走的时候一直回头看你。|He apologised but kept looking back as he went."; })
    ], function (p) { return !fl(p).twin && !p.flags.adoptedTwinDone; }),
    CH("mx_twin2", [19, 60], "另一个城市|The Other City", "🧬", "你找到了小雨的社交账号。照片里的人和你一模一样。|You find Xiaoyu’s social account. The person in the photos is you.", [
      O("发一条私信|Send a message", function (c) { fl(c.p).twin = 2; var n = N.make({ rel: "sibling", g: c.p.g, age: c.p.age, aff: 40 }); n.twin = 1; n.pin = 1; n.by = c.p.birthYear; n.looks = c.p.st.looks; c.prm.t = n.name; H.fx(c, { happy: 15, eq: 4 }); G.major("找到了失散的双胞胎|Found a long-lost twin"); return "你们约在一家咖啡馆见面。坐下的那一刻，你们同时笑了，连笑的样子都一样。DNA检测证实：你们是出生时被分开的双胞胎。|You met in a café. As you sat down you both laughed — the very same laugh. A DNA test confirmed it: twins separated at birth."; }),
      O("问爸妈|Ask your parents", function (c) { fl(c.p).twin = 3; H.fx(c, { par: -5, stress: 10 }); return "妈妈哭了很久，才说出当年医院的那场混乱。|Mum cried a long time before telling you about the chaos at the hospital back then."; })
    ], function (p) { return fl(p).twin === 1 && due("twin2"); }),
    /* the house */
    CH("mx_house1", [25, 70], "墙里的声音|A Sound in the Wall", "🏚️", "你搬进了一栋老房子。每天半夜，书房的墙里都会传来轻轻的敲击声。|You move into an old house. Every night a soft tapping comes from inside the study wall.", [
      O("拆开那面墙|Open up the wall", function (c) { fl(c.p).house = 1; var r = G.R(); if (r < .4) { H.fx(c, { money: 40000, happy: 12 }); return "墙里是一个暗格，藏着前任房主的一箱古董。律师说，按照合同，它们都归你。|Behind it, a hidden compartment with a chest of the previous owner’s antiques. Your lawyer said they’re yours under the contract."; } if (r < .8) { H.fx(c, { happy: 6 }); return "是一窝松鼠。它们在墙里住了好几年。你给它们在院子里做了一个新家。|A family of squirrels, living in the wall for years. You built them a new home in the garden."; } H.fx(c, { stress: 10 }); return "什么都没有。敲击声还在继续。|Nothing. The tapping went on."; }),
      O("请人来看看|Get someone to look", function (c) { fl(c.p).house = 1; return "工人说是水管热胀冷缩。你半信半疑。|The plumber said it was pipes expanding. You were only half convinced."; })
    ], function (p) { return !fl(p).house && S().assets.houses.length > 0; }),
    /* the old debt */
    CH("mx_debt1", [30, 80], "四十年前的借条|A Forty-Year-Old IOU", "📃", "一位陌生的老人找到你，拿出一张发黄的借条：四十年前，你的祖父借给他的父亲一笔钱，救了他们全家。|An old stranger finds you with a yellowed IOU: forty years ago your grandfather lent his father money that saved their family.", [
      O("“都过去了，不用还了。”|“That’s long past. No need.”", function (c) { fl(c.p).debt = 1; H.fx(c, { karma: 10 }); if (G.ch(.5)) { H.fx(c, { money: 20000 }); return "他坚持按当年的金价还了你一笔钱，还说：“我父亲临终前，让我一定要找到你们。”|He insisted on repaying at the old gold price: “On his deathbed my father made me promise to find you.”"; } return "他握着你的手说：“你和你祖父一模一样。”|He held your hand: “You’re just like your grandfather.”"; }),
      O("收下他的心意|Accept his gesture", function (c) { fl(c.p).debt = 1; H.fx(c, { happy: 6, karma: 3 }); return "他带来了一整箱自家种的茶，说以后每年都送。|He brought a whole chest of home-grown tea and promised more every year."; })
    ], function (p) { return !fl(p).debt; }),
    /* the time capsule */
    CH("mx_cap1", [30, 80], "不属于你的时间胶囊|A Time Capsule Not Meant for You", "⏳", "社区挖出了一个五十年前埋下的时间胶囊。里面有一封信，收信人的名字和你一模一样。|The neighbourhood digs up a fifty-year-old time capsule. Inside is a letter addressed to someone with your exact name.", [
      O("打开它|Open it", function (c) { fl(c.p).cap = 1; H.fx(c, { happy: 8, eq: 4 }); return "信上写着：“五十年后的你，还记得我们约好的事吗？”你想了一夜，决定去找另一个同名的人。|It read: “You, fifty years from now — do you remember our promise?” You thought all night and decided to find the other person with your name."; }),
      O("交给社区，帮他们找到收信人|Give it to the committee to find the addressee", function (c) { fl(c.p).cap = 1; H.fx(c, { karma: 6 }); return "收信人找到了，是一位九十岁的老奶奶。她读完信，笑着哭了。|They found her — a ninety-year-old woman. She read it, laughing and crying."; })
    ], function (p) { return !fl(p).cap; })
  ]);
})();
