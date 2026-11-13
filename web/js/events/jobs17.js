/* Version 1.7: fourteen new careers, each with its own stories — bartender, sommelier, pastry chef, dive
   instructor, funeral director, auctioneer, tattoo artist, pet groomer, drone pilot, racing driver, magician,
   archaeologist, astronomer and ship’s captain. */
(function () {
  "use strict";
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function R2(s) { return s.split(","); }
  [
    { id: "bartender", n: "调酒师|Bartender", r: R2("吧员|Barback,调酒师|Bartender,首席调酒师|Head Bartender,酒吧合伙人|Bar Partner"), pay: [24000, 38000, 60000, 110000], deg: 0, age: 18, st: 3, cat: "svc", req: { eq: 45 } },
    { id: "sommelier", n: "侍酒师|Sommelier", r: R2("见习侍酒师|Commis Sommelier,侍酒师|Sommelier,首席侍酒师|Head Sommelier,侍酒大师|Master Sommelier"), pay: [32000, 52000, 85000, 180000], deg: 2, age: 20, st: 4, cat: "svc", req: { smarts: 55 } },
    { id: "pastry", n: "甜品师|Pastry Chef", r: R2("甜品学徒|Pastry Apprentice,甜品师|Pastry Chef,甜品主厨|Executive Pastry Chef,甜品店主|Patisserie Owner"), pay: [24000, 38000, 62000, 120000], deg: 0, st: 3, cat: "svc" },
    { id: "diver", n: "潜水教练|Dive Instructor", r: R2("潜水长|Divemaster,潜水教练|Dive Instructor,潜水总教练|Course Director,潜水中心老板|Dive Centre Owner"), pay: [22000, 36000, 55000, 100000], deg: 0, age: 18, st: 3, cat: "svc", req: { health: 70 } },
    { id: "funeral", n: "殡葬师|Funeral Director", r: R2("殡仪助理|Funeral Assistant,入殓师|Mortician,殡葬师|Funeral Director,殡仪馆馆长|Funeral Home Director"), pay: [30000, 42000, 62000, 98000], deg: 2, age: 18, st: 3, cat: "svc" },
    { id: "auction", n: "拍卖师|Auctioneer", r: R2("拍卖助理|Auction Assistant,拍卖师|Auctioneer,首席拍卖师|Chief Auctioneer,拍卖行董事|Auction House Director"), pay: [40000, 75000, 150000, 320000], deg: 4, maj: ["art", "hist", "biz"], st: 4, cat: "art", req: { eq: 55 } },
    { id: "tattoo", n: "纹身师|Tattoo Artist", r: R2("纹身学徒|Tattoo Apprentice,纹身师|Tattoo Artist,知名纹身师|Renowned Tattoo Artist,纹身工作室主理人|Studio Owner"), pay: [18000, 40000, 85000, 140000], deg: 0, age: 18, st: 3, cat: "art" },
    { id: "groomer", n: "宠物美容师|Pet Groomer", r: R2("宠物美容助理|Grooming Assistant,宠物美容师|Pet Groomer,高级宠物美容师|Senior Groomer,宠物店老板|Pet Salon Owner"), pay: [20000, 32000, 46000, 80000], deg: 0, st: 2, cat: "svc" },
    { id: "drone", n: "无人机飞手|Drone Pilot", r: R2("无人机飞手|Drone Operator,航拍摄影师|Aerial Cinematographer,无人机团队负责人|Drone Team Lead"), pay: [36000, 70000, 120000], deg: 2, st: 3, cat: "tech", y0: 2014 },
    { id: "racer", n: "赛车手|Racing Driver", r: R2("卡丁车手|Karting Driver,职业车手|Pro Driver,车队主力|Lead Driver,世界冠军|World Champion"), pay: [20000, 120000, 800000, 15000000], deg: 0, age: 16, st: 5, cat: "art", req: { health: 70, smarts: 50 } },
    { id: "magician", n: "魔术师|Magician", r: R2("街头魔术师|Street Magician,舞台魔术师|Stage Magician,魔术大师|Master Illusionist"), pay: [15000, 60000, 400000], deg: 0, st: 4, cat: "art", req: { eq: 50 } },
    { id: "archaeo", n: "考古学家|Archaeologist", r: R2("考古助理|Field Assistant,考古学家|Archaeologist,考古领队|Excavation Director,考古研究所所长|Institute Director"), pay: [36000, 56000, 82000, 130000], deg: 5, maj: ["hist"], st: 4, cat: "edu", req: { smarts: 60 } },
    { id: "astronomer", n: "天文学家|Astronomer", r: R2("博士后|Postdoc,天文学家|Astronomer,天文台台长|Observatory Director"), pay: [55000, 90000, 160000], deg: 6, maj: ["eng", "cs"], st: 4, cat: "edu", req: { smarts: 75 } },
    { id: "captain", n: "远洋船长|Sea Captain", r: R2("水手|Deckhand,三副|Third Officer,大副|Chief Officer,船长|Captain"), pay: [30000, 52000, 90000, 160000], deg: 2, age: 18, st: 4, cat: "blue", req: { health: 60 } }
  ].forEach(function (j) { if (!G.JOB[j.id]) { G.JOBS.push(j); G.JOB[j.id] = j; } });

  function J(ids) { return function (S, p) { return !!(p.job && ids.indexOf(p.job.id) >= 0 && !p.jail); }; }
  function JE(id, ids, a, title, icon, t, o, w) { return E(id, a, title, icon, t, o, { if: J(ids), w: w || 2.6 }); }

  G.evs([
    /* bartender */
    JE("j7_bar_regular", ["bartender"], [18, 70], "吧台尽头的客人|The Man at the End of the Bar", "🍸", "一个穿西装的男人每周三都坐在吧台尽头，只点一杯威士忌，一口不喝。今天他开口了：“你想听一个故事吗？”|A man in a suit sits at the end of the bar every Wednesday, orders one whisky and never drinks it. Today he speaks: “Want to hear a story?”", [
      O("擦着杯子听他讲|Polish glasses and listen", R("他讲了他已故的妻子，她最爱这款威士忌。从那以后，你每周三都给他留着那个位子。|He told you about his late wife; this was her whisky. Ever since, you’ve kept that seat for him on Wednesdays.", { eq: 4, karma: 4 })),
      O("给他调一杯新酒|Mix him something new", RC(.6, "他喝了一口，笑了：“这是我十年来喝的第一口酒。”|He took a sip and smiled: “My first drink in ten years.”", { eq: 3, perf: 4 }, "他把酒推了回来，起身走了。|He pushed it back and left.", {}))
    ]),
    JE("j7_bar_contest", ["bartender"], [20, 60], "调酒大赛|The Cocktail Championship", "🏆", "全国调酒大赛要求现场创作一款代表家乡的鸡尾酒。|The national cocktail championship asks for an original drink that captures your hometown.", [
      O("用家乡的茶和果子做基酒|Build it on your hometown’s tea and fruit", RC(.45, "评委喝完沉默了很久，给了满分。这款酒以你的名字命名，进了全国的酒单。|The judges went quiet, then gave full marks. The drink, named after you, appeared on menus nationwide.", { fame: 6, perf: 15, happy: 10 }, "你进了前三，但冠军是一款加了金箔的酒。|You made the top three; the winner had gold leaf in it.", { fame: 2, perf: 5 })),
      O("做一杯经典款，稳扎稳打|Play it safe with a classic", R("评委说“技术完美，但缺少灵魂”。|“Technically perfect, but lacking soul,” said the judges.", { perf: 3 }))
    ]),
    JE("j7_bar_drunk", ["bartender"], [18, 70], "喝醉的女孩|The Drunk Girl", "🥃", "一个喝醉的女孩被两个陌生男人扶着往门口走，她看了你一眼，眼神很慌张。|Two strange men are steering a drunk girl to the door. She glances at you, panicked.", [
      O("拦住他们，问她认不认识他们|Stop them and ask if she knows them", R("她摇头。你叫了保安，帮她联系了家人。第二天她的父母来店里道谢。|She shook her head. You called security and her family. The next day her parents came to thank you.", { karma: 12, eq: 2 })),
      O("悄悄报警|Quietly call the police", R("警察在门口拦下了他们。|Police intercepted them at the door.", { karma: 8 }))
    ], 1.4),
    /* sommelier */
    JE("j7_som_blind", ["sommelier"], [22, 70], "盲品考试|The Blind Tasting", "🍷", "侍酒大师考试的最后一关：盲品六款酒，说出产区、品种和年份。|The final round of the master sommelier exam: six wines blind — region, grape and vintage.", [
      O("相信第一感觉|Trust your first impression", RC(function (c) { return .25 + c.p.st.smarts / 250 + (G.has("foodie") ? .2 : 0); }, "六款全对。考官说你是他二十年来见过最好的品酒师。|All six right. The examiner said you were the best palate he’d seen in twenty years.", { fame: 6, perf: 20, happy: 12 }, "你把一款意大利酒说成了法国酒，明年再考。|You called an Italian wine French. Next year.", { happy: -6 })),
      O("反复品尝，慢慢推理|Taste again and again, reason it out", RC(.5, "你答对了五款，以高分通过。|Five right — a comfortable pass.", { perf: 15, happy: 8 }, "时间到了，你还剩两款没写。|Time ran out with two still blank.", { happy: -5 }))
    ]),
    JE("j7_som_fake", ["sommelier"], [22, 70], "假酒|A Counterfeit Bottle", "🍾", "一位富豪拿出一瓶据说价值百万的老年份红酒请你开。你一闻就知道是假的。|A tycoon produces a vintage said to be worth a million and asks you to open it. One sniff tells you it’s fake.", [
      O("私下告诉他|Tell him privately", R("他脸色铁青，第二天他的律师把卖酒的人告上了法庭。他成了你最大的客户。|He went pale; the next day his lawyer sued the seller. He became your biggest client.", { perf: 10, eq: 3 })),
      O("当众说出来|Say it in front of everyone", R("宾客哗然，富豪颜面尽失，再也没来过。|Gasps all round; humiliated, he never returned.", { perf: -6 })),
      O("什么也不说，照常侍酒|Say nothing and serve it", R("大家都夸“这酒真好”。你心里有点不是滋味。|Everyone praised it. You felt uneasy.", { karma: -2 }))
    ]),
    /* pastry */
    JE("j7_pastry_cake", ["pastry"], [18, 70], "最后一个生日蛋糕|A Last Birthday Cake", "🎂", "一位母亲来订蛋糕：她的女儿得了重病，这可能是她最后一个生日。|A mother orders a cake: her daughter is gravely ill — this may be her last birthday.", [
      O("通宵做一个城堡蛋糕|Spend the night making a castle cake", R("女孩看到蛋糕时尖叫了起来。后来她挺了过来，每年生日都来你的店。|The girl screamed with joy. She pulled through, and comes to your shop every birthday.", { karma: 12, happy: 10, perf: 4 })),
      O("免单|Make it free", R("母亲哭着抱住了你。|The mother hugged you in tears.", { karma: 8, money: -50 }))
    ]),
    JE("j7_pastry_paris", ["pastry"], [20, 50], "巴黎的邀请|An Invitation from Paris", "🥐", "一家巴黎的老牌甜品店邀请你去当一年交换甜品师。|A historic Paris patisserie invites you for a year as an exchange pastry chef.", [
      O("去|Go", RC(.7, "你学会了老师傅的千层秘诀，回来后你的店成了网红店。|You learned the master’s secrets of mille-feuille; back home your shop became a sensation.", { perf: 15, fame: 4, sk: { cook: 10 } }, "语言不通，你一直很孤独，半年后就回来了。|With no French you were lonely, and came home after six months.", { happy: -6 })),
      O("舍不得家人|Can’t leave your family", R("你在店里挂了一张巴黎的照片。|You hung a photo of Paris in the shop.", {}))
    ]),
    /* diver */
    JE("j7_dive_shark", ["diver"], [18, 60], "鲨鱼|A Shark", "🦈", "你带着一群游客潜水，一条两米多长的鲨鱼从珊瑚后面游了出来。游客们开始慌乱。|Leading tourists on a dive, a two-metre shark glides out from the coral. The group starts to panic.", [
      O("打手势让大家靠拢、保持冷静|Signal everyone to bunch up and stay calm", R("鲨鱼绕了两圈，游走了。上岸后，一个游客说：“这是我这辈子最难忘的一次潜水。”|The shark circled twice and left. Ashore, one diver said it was the best dive of their life.", { perf: 10, eq: 3, stress: 6 })),
      O("立刻带大家上浮|Lead everyone up at once", RC(.7, "大家安全上了船。|Everyone got back aboard safely.", { perf: 4 }, "有个游客上浮太快，得了减压病。|One diver ascended too fast and got the bends.", { perf: -10, stress: 10 }))
    ]),
    JE("j7_dive_wreck", ["diver"], [20, 60], "海底沉船|A Wreck on the Seabed", "⚓", "你在一次深潜中发现了一艘从没被记录过的古代沉船。|On a deep dive you discover an ancient wreck nobody has recorded.", [
      O("报告给文物部门|Report it to the heritage authority", R("那是一艘几百年前的商船，被列为重大发现。纪录片里有你的名字。|A merchant ship centuries old — a major find. Your name is in the documentary.", { fame: 8, karma: 6 })),
      O("偷偷捞几件瓷器|Quietly bring up some porcelain", RC(.5, "黑市上卖了一大笔。|It fetched a fortune on the black market.", { money: 20000, karma: -10 }, "海警在码头等着你。|The coast guard was waiting at the dock.", { heat: 50, karma: -10 }))
    ]),
    /* funeral */
    JE("j7_fun_makeup", ["funeral"], [18, 70], "最后的妆容|One Last Make-Up", "🕯️", "一位因车祸去世的年轻女孩，父母希望她“走得漂漂亮亮的”。|A young woman killed in a car crash — her parents want her “to go looking beautiful”.", [
      O("花一整夜为她修复容颜|Spend all night restoring her", R("告别仪式上，母亲摸着女儿的脸说：“她只是睡着了。”她握着你的手很久。|At the farewell her mother touched her face: “She’s only sleeping.” She held your hand a long time.", { karma: 10, eq: 5, happy: -3 })),
      O("按标准流程处理|Follow standard procedure", R("仪式很顺利。|The ceremony went smoothly.", { perf: 2 }))
    ]),
    JE("j7_fun_prejudice", ["funeral"], [20, 60], "相亲时的沉默|Silence on a Blind Date", "💐", "相亲时，对方听说你是殡葬师，脸色一下子变了。|On a blind date, your match hears what you do and goes pale.", [
      O("讲讲这份工作的意义|Explain what the work means", RC(.4, "对方听完沉默了很久：“你比很多人都勇敢。”你们开始了第二次约会。|They were quiet, then: “You’re braver than most people.” There was a second date.", { eq: 4, happy: 6 }, "对方找借口提前走了。|They made an excuse and left.", { happy: -5 })),
      O("一笑而过|Laugh it off", R("你已经习惯了。|You’re used to it.", {}))
    ]),
    JE("j7_fun_parent", ["funeral"], [30, 75], "为父亲送行|Saying Goodbye to Your Father", "🌾", "你为无数人送过行。今天，躺在那里的是你的父亲。|You’ve said goodbye for countless families. Today it’s your father lying there.", [
      O("亲手为他整理遗容|Prepare him yourself", R("你的手第一次在工作时发抖。同事们默默地站在门外。|For the first time at work your hands shook. Your colleagues waited silently outside.", { eq: 6, happy: -10 }))
    ], 1.8),
    /* auctioneer */
    JE("j7_auc_record", ["auction"], [24, 75], "破纪录的一槌|The Record-Breaking Hammer", "🔨", "一幅名画的竞价进入白热化，两个买家你来我往，已经超过了估价的三倍。|Bidding on a masterpiece is white-hot — two buyers trading blows, three times the estimate.", [
      O("用节奏逼出最高价|Use your rhythm to push it higher", RC(.6, "落槌！创下了拍卖纪录。全场起立鼓掌，你的照片上了财经头条。|Hammer down — a world record. The room rose; your photo made the business pages.", { fame: 8, perf: 20, money: 20000 }, "其中一个买家突然放弃，价格停在了原地。|One bidder suddenly dropped out and the price stalled.", { perf: 5 })),
      O("见好就收，及时落槌|Bring the hammer down while it’s good", R("成交价依然很高，客户很满意。|Still a great price; the consignor was delighted.", { perf: 8 }))
    ]),
    JE("j7_auc_stolen", ["auction"], [24, 75], "来路不明的文物|An Artefact with No Paper Trail", "🏺", "一件准备上拍的文物，你查到它可能是从某个国家博物馆被盗的。|An artefact in the next sale may have been stolen from a national museum.", [
      O("撤拍并报警|Withdraw it and call the police", R("文物被归还给了原来的国家。那个国家的大使亲自来致谢。|It was returned to its country; the ambassador came to thank you.", { karma: 12, fame: 4 })),
      O("照常拍卖|Sell it anyway", RC(.5, "成交，佣金很丰厚。|Sold — a hefty commission.", { money: 15000, karma: -12 }, "国际刑警找上了门。|Interpol came knocking.", { heat: 40, perf: -20 }))
    ]),
    /* tattoo */
    JE("j7_tat_cover", ["tattoo"], [18, 70], "遮盖伤疤|Covering a Scar", "🖋️", "一位女士想在胸口的手术伤疤上纹一朵花。她刚刚战胜了乳腺癌。|A woman wants a flower tattooed over the scar on her chest. She has just beaten breast cancer.", [
      O("设计一朵独一无二的花|Design a one-of-a-kind flower", R("她看着镜子哭了：“我又是我了。”她把照片发到网上，很多和她一样的人来找你。|She cried at the mirror: “I’m me again.” Her photo went online, and many like her came to you.", { karma: 10, fame: 4, perf: 10 })),
      O("免费为她纹|Do it for free", R("她坚持付了钱，又塞给你一张卡片：“谢谢你让我重新爱上自己。”|She insisted on paying, and left a card: “Thank you for making me love myself again.”", { karma: 8 }))
    ]),
    JE("j7_tat_name", ["tattoo"], [18, 60], "前任的名字|An Ex’s Name", "💔", "一个年轻人喝醉了，坚持要把刚认识一周的女朋友的名字纹在脖子上。|A drunk young man insists on tattooing his girlfriend of one week’s name on his neck.", [
      O("拒绝，让他清醒了再来|Refuse — come back sober", R("一个月后他来道谢：他们已经分手了。|A month later he came to thank you: they’d already split.", { karma: 4, eq: 2 })),
      O("钱照收，活照干|Take the money and do it", R("半年后他来找你遮盖那个名字。你又赚了一笔。|Six months later he came back to cover it up. You got paid twice.", { money: 400 }))
    ]),
    /* groomer */
    JE("j7_groom_old", ["groomer"], [18, 70], "老狗|The Old Dog", "🐕", "一位老人带着一条十六岁的老狗来洗澡，说：“它可能撑不过这个冬天了，我想让它干干净净的。”|An old man brings in his sixteen-year-old dog: “He may not see out the winter. I want him clean.”", [
      O("用最温柔的方式，慢慢洗|Wash him slowly and gently", R("老狗在吹风机下睡着了，打着小呼噜。老人站在门口看了很久。|The old dog fell asleep under the dryer, snoring softly. The man watched from the doorway a long time.", { karma: 6, happy: 4 })),
      O("免费，再送一条小围巾|Free, with a little scarf as a gift", R("那个冬天，老狗一直戴着那条围巾。|All winter, the dog wore the scarf.", { karma: 8, money: -15 }))
    ]),
    JE("j7_groom_show", ["groomer"], [20, 60], "宠物选美|The Pet Show", "🏅", "一位客户请你为她的贵宾犬准备全国宠物选美比赛。|A client wants you to prepare her poodle for the national pet show.", [
      O("设计一个惊艳的造型|Create a stunning cut", RC(.5, "它拿了冠军，你的名字出现在了宠物杂志上。|It won best in show; your name made the pet magazines.", { fame: 3, perf: 12, money: 800 }, "它在台上打了个喷嚏，把造型毁了。|It sneezed on stage and ruined the look.", { happy: 2 }))
    ]),
    /* drone */
    JE("j7_drone_rescue", ["drone"], [18, 60], "山中搜救|Mountain Search and Rescue", "🚁", "一个登山者在山里失踪了，救援队请你用热成像无人机帮忙搜索。|A hiker is missing in the mountains; rescuers ask you to search with a thermal drone.", [
      O("通宵飞行搜索|Fly through the night", RC(.65, "凌晨三点，屏幕上出现了一个微弱的热点。救援队找到了他，他还活着。|At 3 a.m. a faint heat signature appeared. The team found him alive.", { karma: 12, fame: 4 }, "电池耗尽了，最后是搜救犬找到了他。|The batteries died; the dogs found him in the end.", { karma: 5 }))
    ]),
    JE("j7_drone_film", ["drone"], [20, 60], "大片航拍|Shooting for a Blockbuster", "🎥", "一部好莱坞电影请你拍一段飞越峡谷的追车镜头。|A Hollywood film hires you for a car chase through a canyon.", [
      O("贴着岩壁飞|Fly right along the cliff face", RC(.55, "那个镜头成了预告片的高潮，导演在片尾字幕里特别感谢了你。|The shot became the trailer’s climax; the director thanked you in the credits.", { fame: 5, perf: 15, money: 5000 }, "无人机撞上了岩壁，价值十万的设备粉身碎骨。|The drone hit the rock — a fortune in gear destroyed.", { money: -8000, stress: 8 })),
      O("稳妥地拍|Play it safe", R("画面很漂亮，但不算惊艳。|Beautiful, not breathtaking.", { perf: 5 }))
    ]),
    /* racer */
    JE("j7_race_rain", ["racer"], [16, 45], "雨战|Racing in the Rain", "🏎️", "比赛最后十圈突然下起暴雨，大部分车手都进站换胎了。|Ten laps from the end a storm hits; most drivers pit for wet tyres.", [
      O("不进站，赌一把|Stay out and gamble", RC(.4, "你在湿滑的赛道上一路超车，拿下了冠军。赛后你跪在雨里哭了。|You overtook car after car on the soaked track and won. Afterwards you knelt in the rain and wept.", { fame: 12, perf: 25, happy: 15, money: 30000 }, "你在第三弯冲出了赛道，撞上了护栏。|You spun off at turn three into the barrier.", { health: -15, perf: -10 }))
      , O("进站换胎|Pit for wets", R("你稳稳地拿到了第四名。|A steady fourth place.", { perf: 6 }))
    ]),
    JE("j7_race_crash", ["racer"], [18, 45], "惨烈的事故|A Terrible Crash", "💥", "前方的车手发生了严重事故，赛车起火。你是离他最近的人。|The car ahead crashes and catches fire. You’re the closest driver.", [
      O("停车去救他|Stop and pull him out", RC(.7, "你把他从火里拖了出来。全世界都在播放这个画面。|You dragged him from the flames. The clip played around the world.", { karma: 15, fame: 10, health: -5 }, "你烧伤了手臂，但他活了下来。|Your arm was burned — but he survived.", { karma: 15, fame: 8, health: -18 })),
      O("按规定继续比赛|Keep racing as the rules say", R("救援车很快赶到，他活了下来。你一整晚都没睡着。|Marshals arrived fast; he survived. You didn’t sleep that night.", { stress: 10 }))
    ], 1.4),
    /* magician */
    JE("j7_magic_child", ["magician"], [16, 80], "儿童病房|The Children’s Ward", "🎩", "医院请你去儿童病房表演。一个孩子很久没笑过了。|A hospital invites you to perform on the children’s ward. One child hasn’t smiled in a long time.", [
      O("从他耳朵后面变出一只兔子|Pull a rabbit from behind his ear", R("他笑了，笑得咳嗽起来。护士在门口偷偷擦眼泪。|He laughed until he coughed. A nurse wiped her eyes in the doorway.", { karma: 10, happy: 10 })),
      O("教他变一个小魔术|Teach him a little trick", R("他学会以后，变给每一个来查房的医生看。|He showed it to every doctor on their rounds.", { karma: 8, eq: 3 }))
    ]),
    JE("j7_magic_escape", ["magician"], [20, 65], "水下逃脱|The Underwater Escape", "🔗", "你计划在直播中表演水下逃脱：锁链、铁箱、三分钟。|You plan a live underwater escape: chains, a steel box, three minutes.", [
      O("按计划表演|Perform as planned", RC(.7, "两分五十八秒，你破水而出。直播观看人数破了纪录。|Two minutes fifty-eight seconds — you burst from the water. Record viewing figures.", { fame: 15, perf: 20, money: 20000 }, "一把锁卡住了，助手把你救了上来。你在医院醒来。|A lock jammed; your assistant pulled you out. You woke up in hospital.", { health: -20, fame: 4 })),
      O("换一个更安全的魔术|Switch to a safer trick", R("观众依然很喜欢。|The audience still loved it.", { perf: 5 }))
    ]),
    /* archaeologist */
    JE("j7_arch_tomb", ["archaeo"], [24, 75], "未被盗过的墓|An Untouched Tomb", "⚱️", "你的团队发现了一座从未被盗过的古墓。打开主墓室前，所有人都看着你。|Your team finds a tomb never touched by robbers. Before opening the main chamber, everyone looks at you.", [
      O("按程序慢慢清理|Clear it slowly, by the book", R("三个月后，墓中的文物全部完好出土，震惊了学术界。|Three months later every artefact was out intact. The field was stunned.", { fame: 10, perf: 20, smarts: 3 })),
      O("先打开主棺看看|Open the main coffin first", RC(.5, "里面是一顶完整的金冠，你上了新闻。|Inside: an intact gold crown. You made the news.", { fame: 8, perf: 10 }, "棺木遇到空气迅速腐坏，一件丝织品毁了。同行严厉批评了你。|The air rotted the wood fast and a silk garment was lost. Colleagues censured you.", { perf: -10, fame: -2 }))
    ]),
    JE("j7_arch_bones", ["archaeo"], [24, 75], "一封三千年前的信|A Letter from Three Thousand Years Ago", "📜", "你破译了一块竹简，上面是一个士兵写给家中妻子的信：“等我回家。”|You decipher a bamboo slip: a soldier’s letter to his wife — “Wait for me to come home.”", [
      O("写成论文|Write it up", R("论文发表后，这封信被翻译成二十种语言，感动了全世界。|Published, the letter was translated into twenty languages and moved the world.", { fame: 6, perf: 12 })),
      O("在发布会上念出来|Read it aloud at the press conference", R("念到最后一句时，你的声音哽咽了。全场一片安静。|Your voice broke on the last line. The room fell silent.", { fame: 4, eq: 4 }))
    ]),
    /* astronomer */
    JE("j7_astro_comet", ["astronomer"], [26, 80], "一颗新彗星|A New Comet", "☄️", "凌晨四点，你在数据里发现了一个移动的光点——一颗从没被记录过的彗星。|4 a.m. A moving point of light in your data — a comet nobody has recorded.", [
      O("马上提交国际天文联合会|Report it to the International Astronomical Union", R("它以你的名字命名了。你给爸妈打电话：“天上有一颗星星叫我的名字了。”|It was named after you. You called your parents: “There’s a star with my name now.”", { fame: 10, happy: 15, perf: 15, flag: "comet" })),
      O("再观测三天确认|Observe three more nights to be sure", RC(.6, "确认无误，以你的名字命名。|Confirmed, and named after you.", { fame: 10, happy: 12, perf: 12, flag: "comet" }, "另一个天文台抢先一天提交了。|Another observatory reported it a day earlier.", { happy: -8 }))
    ]),
    JE("j7_astro_signal", ["astronomer"], [26, 80], "奇怪的信号|A Strange Signal", "📡", "射电望远镜收到了一个有规律的信号，持续了七十二秒，然后消失了。|The radio telescope picks up a regular signal for seventy-two seconds — then it vanishes.", [
      O("连续一个月监听同一片天区|Listen to that patch of sky for a month", RC(.15, "信号又出现了。全世界的天文学家都在看你的数据。|It came back. Every astronomer on Earth was looking at your data.", { fame: 20, smarts: 5, happy: 15 }, "再也没有出现。你把它写进了日记：“也许有人在敲门。”|It never returned. You wrote in your diary: “Maybe someone knocked.”", { smarts: 2 })),
      O("排查设备故障|Check for equipment faults", R("是一颗卫星的干扰。你有点失望，又有点松了口气。|Satellite interference. A little disappointed, a little relieved.", { smarts: 2 }))
    ]),
    /* sea captain */
    JE("j7_cap_pirates", ["captain"], [20, 70], "海盗|Pirates", "🏴‍☠️", "货轮在亚丁湾附近，雷达上出现了两艘快艇，正高速接近。|In the Gulf of Aden, two speedboats appear on radar, closing fast.", [
      O("全速蛇形航行，向护航舰队求救|Full speed, zig-zag, call the naval escort", RC(.75, "护航舰的直升机赶到，快艇掉头跑了。船员们抱在一起欢呼。|The escort’s helicopter arrived and the boats turned tail. The crew hugged and cheered.", { perf: 15, fame: 3, stress: 10 }, "海盗爬上了甲板。你们躲进安全舱，等了十八个小时才获救。|Pirates boarded. You hid in the citadel for eighteen hours until rescue.", { stress: 30, health: -5 })),
      O("释放高压水枪|Fire the water cannons", RC(.6, "快艇被冲得东倒西歪，放弃了。|The boats were knocked about and gave up.", { perf: 10 }, "他们开了枪，一个船员受了伤。|They opened fire; a crewman was wounded.", { stress: 20 }))
    ], 1.4),
    JE("j7_cap_storm", ["captain"], [20, 70], "风暴中的求救|A Mayday in the Storm", "🌊", "风暴中，你收到附近一艘渔船的求救信号。救援意味着偏离航线、延误交货。|In a storm, you pick up a mayday from a nearby fishing boat. Rescue means leaving your route and delaying delivery.", [
      O("掉头去救|Turn back to help", R("你们救起了七个渔民。公司罚了你的延误费，但国际海事组织给你颁了勇敢奖。|You pulled seven fishermen from the sea. The company fined you for the delay; the International Maritime Organization gave you a bravery award.", { karma: 15, fame: 5, money: -2000 })),
      O("通报海岸警卫队，继续航行|Alert the coast guard and sail on", R("海岸警卫队救起了他们。你一直守在电台旁边，直到听到“全员获救”。|The coast guard got them. You stayed by the radio until you heard “all saved”.", { karma: 3 }))
    ])
  ]);
})();
