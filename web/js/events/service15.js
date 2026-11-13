/* Version 1.6 stories for those who serve: police, soldiers, officials — and twenty more instinct cases for
   the intelligence service. */
(function () {
  "use strict";
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function SE(id, k, a, title, icon, t, o, w, f) { return E(id, a, title, icon, t, o, { w: w || 2.4, if: function (S, p) { return !!p[k] && !p.jail && (!f || f(p)); } }); }
  function merit(c, k, v) { var o = c.p[k]; if (!o) return; if (k === "gov") o.perf = G.clamp((o.perf || 50) + v, 0, 100); else o.merit = (o.merit || 0) + v; }
  function M(k, v) { return function (c) { merit(c, k, v); }; }
  function RX(text, fx, k, v) { return function (c) { H.fx(c, fx); merit(c, k, v); return text; }; }
  function RCX(pr, okT, okF, kv, noT, noF, kv2) { return function (c) { var p0 = typeof pr === "function" ? pr(c) : pr; if (G.ch(p0)) { H.fx(c, okF); if (kv) merit(c, kv[0], kv[1]); return okT; } H.fx(c, noF); if (kv2) merit(c, kv2[0], kv2[1]); return noT; }; }

  G.evs([
    /* ======================= police ======================= */
    SE("sv_pol_kid", "pol", [20, 60], "走失的孩子|A Lost Child", "🧒", "一位母亲冲进派出所：她五岁的女儿在商场里不见了。|A mother runs into the station: her five-year-old vanished in a shopping mall.", [
      O("立刻调监控，封锁出口|Pull the CCTV and lock the exits", RCX(.75, "四十分钟后，你在地下车库找到了孩子——一个陌生女人正抱着她往车里走。|Forty minutes later you found her in the car park — a stranger was carrying her to a car.", { karma: 10, fame: 3 }, ["pol", 25], "孩子其实在玩具店睡着了。母亲抱着你哭。|She’d fallen asleep in the toy shop. The mother hugged you, sobbing.", { karma: 4 }, ["pol", 6])),
      O("先安抚母亲，问清细节|Calm the mother and get details first", RX("从她的描述里，你注意到一个细节，直接找到了孩子。|One detail in her account led you straight to the child.", { eq: 3, karma: 6 }, "pol", 15))
    ]),
    SE("sv_pol_old_thief", "pol", [20, 60], "偷馒头的老人|The Old Man Who Stole Bread", "🥖", "超市抓到一个偷馒头的老人。他说老伴病了，家里两天没吃饭。|The supermarket catches an old man stealing bread. His wife is sick; they haven’t eaten in two days.", [
      O("自掏腰包付钱，送他回家|Pay for it yourself and drive him home", RX("你还帮他联系了社区救助。那张你们的合影后来上了本地新闻。|You also connected him with community aid. A photo of the two of you made the local news.", { karma: 10, fame: 2, money: -5 }, "pol", 6)),
      O("按程序处理|Follow procedure", RX("你做完笔录，心里一直不舒服。|You finished the paperwork, unsettled.", { stress: 4 }, "pol", 2))
    ]),
    SE("sv_pol_partner", "pol", [22, 60], "搭档的秘密|Your Partner’s Secret", "🚓", "你发现搭档在偷偷收取一家夜总会的“保护费”。|You discover your partner is quietly taking “protection money” from a nightclub.", [
      O("向督察部门举报|Report it to internal affairs", RCX(.6, "搭档被开除了。很多同事从此躲着你，但局长记住了你。|Your partner was fired. Many colleagues avoided you after that — but the chief remembered you.", { karma: 10, stress: 8 }, ["pol", 20], "举报材料不知怎么泄露了，你被调去守仓库。|Somehow your report leaked, and you were posted to guard a warehouse.", { karma: 6, stress: 15 }, ["pol", -10])),
      O("私下劝他收手|Quietly urge him to stop", RCX(.5, "他沉默了很久，把钱退了回去。他欠你一个人情。|He was silent a long time, then returned the money. He owes you one.", { eq: 4 }, ["pol", 3], "他笑了：“你也想要一份？”|He laughed: “Want a cut too?”", { stress: 6 }, null)),
      O("装作不知道|Look away", RX("你开始失眠。|You began to lose sleep.", { karma: -5, stress: 6 }, "pol", 0))
    ]),
    SE("sv_pol_chase", "pol", [20, 50], "追捕|The Chase", "🏃", "一个抢包的嫌犯从你面前跑过，钻进了老城区的小巷。|A bag-snatcher sprints past you into the maze of the old town.", [
      O("追！|Chase him!", RCX(function (c) { return .35 + c.p.st.health / 200; }, "你在第七个路口把他扑倒了。路人鼓起了掌。|You tackled him at the seventh corner. Bystanders applauded.", { health: -2, fame: 1 }, ["pol", 15], "他翻过一堵墙，不见了。你扭伤了脚。|He vaulted a wall and vanished. You twisted your ankle.", { health: -6 }, null)),
      O("用对讲机通知前方的同事包抄|Radio colleagues ahead to cut him off", RX("他一头撞进了你同事的怀里。|He ran straight into your colleague’s arms.", { smarts: 2 }, "pol", 10))
    ]),
    SE("sv_pol_cold", "pol", [28, 65], "十年悬案|A Ten-Year Cold Case", "🗄️", "整理档案时，你翻到一个十年前没破的杀人案。新的DNA技术也许能派上用场。|Sorting files, you find a ten-year-old unsolved murder. New DNA technology might help.", [
      O("申请重启调查|Apply to reopen it", RCX(.45, "DNA比对出了结果。凶手在另一个城市过着平静的生活，直到你敲开了他的门。|The DNA matched. The killer had been living quietly in another city — until you knocked on his door.", { fame: 6, karma: 8 }, ["pol", 50], "证据保存得太差，没有结果。|The evidence was too degraded.", { stress: 4 }, ["pol", 5])),
      O("太忙了，放回去|Too busy — file it away", RX("那个受害者的照片，你记了很久。|You remembered the victim’s photo for a long time.", {}, "pol", 0))
    ]),
    SE("sv_pol_parade", "pol", [24, 60], "大型活动安保|Security for a Big Event", "🎡", "一场有十万人参加的跨年活动，你负责一个路口的安保。人群开始往前挤。|A New Year’s Eve crowd of a hundred thousand; you’re in charge of one intersection. The crowd starts to surge.", [
      O("当机立断封闭路口，疏导人流|Close the junction and redirect the flow", RX("挤压的人群慢慢散开了。第二天你才知道，另一个路口差点发生踩踏。|The crush eased. Next day you learned another junction nearly had a stampede.", { karma: 8, smarts: 2 }, "pol", 25)),
      O("等上级指示|Wait for orders", RCX(.6, "指示来得及时，一切顺利。|Orders came in time; all went well.", {}, ["pol", 4], "等了十分钟，有几个人被挤伤了。|Ten minutes later, several people were hurt in the crush.", { stress: 12 }, ["pol", -8]))
    ]),

    /* ======================= military ======================= */
    SE("sv_mil_flood", "mil", [18, 60], "抗洪|Flood Relief", "🌊", "大堤出现了管涌，你所在的连队被紧急派往一线。|The dyke is leaking; your company is rushed to the front line.", [
      O("扛沙袋堵管涌，三天三夜|Haul sandbags for three days and nights", RX("大堤保住了。村民们站在路边送你们，往你们手里塞煮鸡蛋。|The dyke held. Villagers lined the road as you left, pressing boiled eggs into your hands.", { karma: 10, health: -5, fame: 2 }, "mil", 30)),
      O("跳进水里用身体组成人墙|Jump in and form a human wall", RCX(.7, "人墙挡住了激流，你们的照片成了那年的标志性画面。|The human wall held back the torrent; your photo became the image of the year.", { karma: 15, fame: 6, health: -10 }, ["mil", 50], "你被激流卷走，战友把你拉了回来。|The current swept you away; comrades hauled you back.", { health: -25, karma: 10 }, ["mil", 30]))
    ], 2),
    SE("sv_mil_letter", "mil", [18, 50], "家书|A Letter from Home", "✉️", "你收到一封家书。妈妈说一切都好——可信纸上有泪痕。|A letter from home. Mum says everything is fine — but there are tear stains on the page.", [
      O("申请探亲|Request leave", RX("你回家才知道，爸爸做了一次大手术，他们怕你担心没告诉你。|At home you learned Dad had major surgery; they hadn’t told you so you wouldn’t worry.", { par: 10, eq: 3 }, "mil", 0)),
      O("打电话问清楚|Call to find out", RX("妈妈哭着说了实话。连长批了你三天假。|Mum told the truth through tears. Your commander granted three days’ leave.", { par: 8 }, "mil", 0))
    ]),
    SE("sv_mil_exercise", "mil", [20, 55], "实兵对抗演习|A Live Exercise", "🎯", "大规模对抗演习，你的部队扮演“蓝军”。对手是全军最强的王牌部队。|A major force-on-force exercise. Your unit plays the opposing force against the army’s elite.", [
      O("出奇兵，绕后偷袭指挥所|Send a flanking raid on their command post", RCX(function (c) { return .3 + c.p.st.smarts / 250; }, "你们“端掉”了王牌部队的指挥所。演习结束后，对方的指挥官专门来和你握手。|You “took out” the elite unit’s HQ. Afterwards their commander came to shake your hand.", { fame: 4, smarts: 3 }, ["mil", 45], "偷袭被识破，你们全军覆没。|The raid was spotted; your force was wiped out.", { stress: 6 }, ["mil", 5])),
      O("稳扎稳打|Play it safe", RX("你们输得很体面。|You lost respectably.", {}, "mil", 8))
    ]),
    SE("sv_mil_peace", "mil", [22, 55], "维和任务|A Peacekeeping Mission", "🕊️", "你被选派参加联合国维和任务，要去一个战乱国家一年。|You’re selected for a year-long UN peacekeeping mission in a war-torn country.", [
      O("去|Go", RCX(.85, "你护送了上千名难民，还在当地学校教孩子们踢足球。回国时，你胸前多了一枚和平勋章。|You escorted thousands of refugees and taught local kids football. You came home with a peace medal.", { karma: 15, fame: 4, eq: 4 }, ["mil", 40], "你在一次袭击中受了伤，提前回国。|You were wounded in an attack and sent home early.", { health: -25, karma: 10 }, ["mil", 30])),
      O("家里离不开|Your family needs you", RX("战友去了，每周都给你发当地孩子的照片。|A comrade went and sent you photos of the local kids every week.", {}, "mil", 0))
    ]),
    SE("sv_mil_recruit", "mil", [26, 60], "带新兵|Training Recruits", "🪖", "你负责带一批新兵。其中一个总是跑最后，大家都叫他“拖油瓶”。|You’re training recruits. One always comes last; they call him the dead weight.", [
      O("每天加练，陪他跑|Run extra with him every day", RX("三个月后，他在考核里跑了全连第三。多年后，他成了特种兵。|Three months on he came third in the company. Years later he joined the special forces.", { eq: 4, karma: 4 }, "mil", 15)),
      O("按标准淘汰|Wash him out by the standard", RX("他哭着离开了。你不知道自己做得对不对。|He left in tears. You weren’t sure you’d done right.", {}, "mil", 4))
    ]),
    SE("sv_mil_border", "mil", [20, 50], "边境巡逻|Border Patrol", "🏔️", "零下三十度，你们在海拔五千米的边境巡逻。一个战友出现了高原反应。|Minus thirty, on patrol at five thousand metres. A comrade develops altitude sickness.", [
      O("背着他下山|Carry him down", RX("你背着他走了六个小时。他活了下来，你的腿冻伤了。|Six hours with him on your back. He survived; your legs were frostbitten.", { health: -10, karma: 12 }, "mil", 35)),
      O("原地扎营，呼叫支援|Make camp and radio for help", RCX(.7, "直升机冒着风雪赶来了。|A helicopter braved the blizzard to reach you.", { smarts: 2 }, ["mil", 15], "支援迟迟不到，你们熬过了最艰难的一夜。|Help was slow; you survived the hardest night of your life.", { health: -6 }, ["mil", 10]))
    ]),

    /* ======================= officials ======================= */
    SE("sv_gov_petition", "gov", [24, 65], "上访的老人|The Old Petitioner", "📮", "一位老人在单位门口坐了三天，说他的土地补偿款被村干部截留了。|An old man has sat at your office gate for three days: village officials kept his land compensation.", [
      O("亲自下去调查|Investigate in person", RCX(.6, "你查清了真相，老人拿到了补偿款，村干部被处分。老人给你写了一封歪歪扭扭的感谢信。|You uncovered the truth; he got his money and the officials were disciplined. He wrote you a wobbly thank-you letter.", { karma: 12, eq: 3 }, ["gov", 10], "调查受阻，有人打电话“提醒”你别多管闲事。|Your inquiry was blocked; someone called to “remind” you to mind your business.", { stress: 10, karma: 6 }, null)),
      O("登记，转交给相关部门|Log it and pass it on", RX("材料转了三个部门，最后没了下文。|It passed through three departments and disappeared.", { karma: -2 }, "gov", 2))
    ]),
    SE("sv_gov_disaster", "gov", [26, 65], "地震|The Earthquake", "🏚️", "你负责的地区发生了强烈地震。所有人都在等你的命令。|A strong earthquake hits your district. Everyone is waiting for your orders.", [
      O("赶赴一线指挥救援|Go to the front line and lead", RX("你在废墟上待了七天七夜。灾后重建的第一所学校，孩子们给它起名叫“希望”。|Seven days and nights in the rubble. The first school rebuilt was named “Hope” by the children.", { karma: 15, fame: 5, health: -6 }, "gov", 20)),
      O("在指挥部统筹调度|Coordinate from headquarters", RX("你的调度很高效，物资第一时间到了灾区。|Your logistics were efficient; supplies arrived first.", { smarts: 3, karma: 6 }, "gov", 12))
    ], 1.5),
    SE("sv_gov_investor", "gov", [28, 65], "招商引资|Courting an Investor", "🏭", "一家大企业愿意来你的地区投资建厂，但他们的环评报告有问题。|A big company wants to build a factory in your district — but its environmental report has problems.", [
      O("要求整改后再落地|Demand fixes before approval", RCX(.5, "企业整改后落了地，成了当地的环保示范工厂。|The company fixed it and became a model green factory.", { karma: 8 }, ["gov", 12], "企业去了隔壁县，你的考核排名掉了。|The company went to the next county, and your ranking dropped.", { stress: 6 }, ["gov", -8])),
      O("先签约，问题以后再说|Sign now, fix later", RCX(.5, "工厂投产，地方GDP涨了一截。|The factory opened and local GDP jumped.", { karma: -4 }, ["gov", 12], "工厂排污被曝光，你被问责。|Pollution was exposed and you were held responsible.", { karma: -8, stress: 20 }, ["gov", -20]))
    ]),
    SE("sv_gov_speech", "gov", [24, 65], "临时讲话|An Impromptu Speech", "🎙️", "领导临时让你代他在一个重要会议上讲话，稿子还没写。|Your boss suddenly asks you to speak in his place at an important meeting — no script.", [
      O("脱稿讲|Speak off the cuff", RCX(function (c) { return .3 + c.p.st.eq / 180; }, "你讲得真诚又有条理，会后好几位领导记住了你的名字。|Sincere and well organised — several senior leaders remembered your name afterwards.", { eq: 3, fame: 1 }, ["gov", 15], "你讲到一半卡壳了。|You froze halfway through.", { stress: 8 }, ["gov", -4])),
      O("照着去年的稿子改|Rework last year’s speech", RX("中规中矩。|Unremarkable.", {}, "gov", 3))
    ]),
    SE("sv_gov_nephew", "gov", [30, 65], "亲戚的请托|A Relative’s Favour", "🧧", "一个远房亲戚提着礼物上门，想让你帮他儿子安排一个工作。|A distant relative arrives with gifts, asking you to find his son a job.", [
      O("拒绝，把礼物退回|Refuse and return the gifts", RX("亲戚骂你“六亲不认”，但你睡得很踏实。|He called you heartless — but you slept soundly.", { karma: 8 }, "gov", 2)),
      O("帮他打个招呼|Put in a word", RCX(.6, "事办成了，亲戚逢人就夸你。|It worked out; he praised you to everyone.", { karma: -6 }, null, "被人举报了。|Someone reported you.", { karma: -6, stress: 15 }, ["gov", -15]))
    ]),
    SE("sv_gov_poor", "gov", [24, 60], "驻村扶贫|Posted to a Poor Village", "🌄", "你被派到一个偏远的贫困村驻村两年。|You’re posted to a remote poor village for two years.", [
      O("带村民种特色水果，搞电商|Get villagers growing specialty fruit and selling online", RCX(.6, "两年后，全村脱了贫。离开那天，村民们把你送到了十里外。|Two years later the village was out of poverty. When you left, villagers walked with you for miles.", { karma: 15, fame: 3, eq: 4 }, ["gov", 25], "水果滞销了，你自己掏钱收了一半。|The fruit didn’t sell; you bought half of it yourself.", { money: -3000, karma: 8 }, ["gov", 5])),
      O("按部就班完成任务|Do what’s required", RX("两年过去，村子没什么变化。|Two years passed; the village changed little.", {}, "gov", 4))
    ]),

    /* ======================= fame careers ======================= */
    SE("sv_fame_fan", "fc", [16, 60], "疯狂的粉丝|An Obsessive Fan", "😱", "一个粉丝跟踪你到了酒店，在走廊里等了一整夜。|A fan followed you to your hotel and waited in the corridor all night.", [
      O("报警|Call the police", RX("警察把她带走了。你的团队加强了安保。|Police took her away; your team stepped up security.", { stress: 6 }, "x", 0)),
      O("隔着门跟她说几句话|Talk to her through the door", RCX(.6, "她哭着说只是想看你一眼。你给她签了名，劝她回家。|She cried that she only wanted to see you. You signed something and persuaded her to go home.", { eq: 4, karma: 3 }, null, "她开始砸门。|She started pounding on the door.", { stress: 12 }, null))
    ]),
    SE("sv_fame_award", "fc", [18, 70], "颁奖典礼|The Awards Night", "🏆", "你被提名了年度大奖。坐在台下，你的手心全是汗。|You’re nominated for the year’s biggest award. In the audience, your palms are wet.", [
      O("准备一段获奖感言|Prepare an acceptance speech", RCX(function (c) { return .25 + c.p.st.fame / 300; }, "主持人念出了你的名字。你感谢了妈妈，全场起立鼓掌。|They read your name. You thanked your mother and the room rose to its feet.", { fame: 10, happy: 15 }, null, "奖给了别人。你第一个站起来鼓掌，这个画面上了热搜。|It went to someone else. You were first to stand and applaud — and that clip went viral.", { fame: 3, eq: 3 }, null)),
      O("不抱期望，享受当晚|Expect nothing, enjoy the night", R("你在后台和偶像合了影。|Backstage you got a photo with your idol.", { happy: 6 }))
    ])
  ]);

  /* ======================= more instinct cases for the service ======================= */
  function C(t, s, o, w) { return { t: t, s: s, o: o, w: w }; }
  var MORE = [
    C("葬礼上的陌生人|A Stranger at the Funeral", "你线人的葬礼上，一个没人认识的男人站在最后一排，一直没有摘下手套。|At your source’s funeral, a man no one knows stands in the back row and never removes his gloves.",
      [["记住他的长相，散场后不跟踪|Memorise his face; don’t follow him afterwards", 1], ["上前和他握手|Go and shake his hand", .2], ["散场后跟踪他|Tail him afterwards", .3], ["当作吊唁的普通人|Assume he’s just a mourner", 0]], "他不摘手套，是不想留下指纹。跟踪他，正中他下怀。|He kept his gloves on to leave no prints. Following him is what he wants."),
    C("太熟练的保洁|A Cleaner Too Skilled", "大使馆新来的保洁员擦桌子的时候，总是先把文件对齐，再擦干净，最后放回原位——一毫米都不差。|The embassy’s new cleaner always squares the papers, wipes, and puts them back exactly — to the millimetre.",
      [["悄悄建议安全部门调查她的背景|Quietly suggest security check her background", 1], ["夸她做事认真|Praise her diligence", .1], ["直接解雇她|Have her fired", .3], ["不在意|Ignore it", 0]], "普通人不会记得文件原来的位置。|Ordinary people don’t remember where papers were."),
    C("同一辆车|The Same Car", "你在三个不同的城市，都看见了同一辆车牌被泥巴糊住的灰色轿车。|In three different cities you’ve seen the same grey saloon, its plates smeared with mud.",
      [["停止一切行动，静默一个月|Halt all activity and go dark for a month", 1], ["换车牌、换车|Swap cars", .4], ["记下车型，继续行动|Note the model and carry on", 0], ["去和司机对质|Confront the driver", 0]], "一辆车跟了你三座城，说明你已经被盯得很紧了。|A car that follows you through three cities means they’re very close."),
    C("突然的升职|A Sudden Promotion", "潜伏的公司突然要把你提拔到核心部门，理由是“你表现特别好”。可你什么都没做。|The company you’ve infiltrated suddenly wants to promote you to the core division for “outstanding performance”. You’ve done nothing special.",
      [["接受，但从此只传递无关紧要的情报|Accept — but pass only harmless information from now on", 1], ["以家庭原因婉拒|Decline, citing family", .5], ["欣然接受，加紧行动|Accept happily and step up your work", 0], ["马上撤离|Extract immediately", .3]], "天上掉下来的位置，往往是为了看你会做什么。|A gift like that is usually a test of what you’ll do with it."),
    C("错拨的电话|A Wrong Number", "凌晨，你的掩护手机接到一个“打错的电话”：对方用你母语说了一句“对不起，打错了”。|At dawn your cover phone gets a “wrong number”: an apology — in your native language.",
      [["当作信号：你的身份可能已经暴露，按程序上报|Treat it as a signal your identity may be blown; report it", 1], ["回拨问问是谁|Call back to ask who it was", 0], ["换掉手机就好|Just replace the phone", .4], ["当作巧合|Coincidence", 0]], "在这个国家，用你的母语打错电话的概率几乎是零。|In this country, the odds of a wrong number in your mother tongue are close to zero."),
    C("热情的房东|A Friendly Landlord", "新租的公寓房东特别热情，坚持要帮你装网络，还送了一个路由器。|Your new landlord is very friendly, insists on setting up your internet, and gives you a router.",
      [["道谢收下，但自己另外买一个用|Thank him, keep it in a drawer, buy your own", 1], ["拒绝他的好意|Refuse outright", .4], ["直接使用|Use it", 0], ["拆开研究|Take it apart", .3]], "最好的窃听器，是你亲手插上电的那个。|The best bug is the one you plug in yourself."),
    C("一样的咖啡|The Same Coffee", "对方的联络人第一次见面就点了你最爱的那种咖啡，还说“我猜你会喜欢”。|At your first meeting, the other side’s contact orders your favourite coffee — “I guessed you’d like it.”",
      [["微笑着点一杯别的|Smile and order something else", 1], ["夸他猜得准|Compliment his guess", 0], ["当场质问|Challenge him", .2], ["喝掉它|Drink it", .3]], "他在告诉你：我们研究过你。你得让他觉得他错了。|He’s telling you: we’ve studied you. Make him think he got it wrong."),
    C("医生的问题|The Doctor’s Question", "年度体检时，医生突然问你：“你小时候是在海边长大的吗？”你的掩护身份是内陆人。|At your annual check-up the doctor asks: “Did you grow up by the sea?” Your cover is from inland.",
      [["笑着说“经常去海边度假”|Laugh: “We holidayed at the coast a lot”", 1], ["反问他为什么这么问|Ask why he wants to know", .3], ["说“是的”|Say “yes”", 0], ["说“从来没去过海边”|Say you’ve never seen the sea", .2]], "一个合理又模糊的回答，比否认更安全。|A plausible, vague answer is safer than a denial."),
    C("孩子的同学|Your Child’s Classmate", "你孩子的新同学的父亲，总是在接孩子时找你聊天，每次都聊到你的工作。|The father of your child’s new classmate always chats at pick-up — and always steers to your work.",
      [["讲无聊的工作细节，直到他失去兴趣|Bore him with dull work details until he loses interest", 1], ["让孩子转学|Move your child to another school", .3], ["拒绝和他说话|Refuse to talk to him", .2], ["和他交朋友，反过来查他|Befriend him and investigate him back", .5]], "让对方觉得你无聊，是最安全的拒绝。|Being boring is the safest way to say no."),
    C("最后一条消息|The Last Message", "失联三个月的线人突然发来消息：“我很安全，老地方见。”|A source silent for three months suddenly messages: “I’m safe. Usual place.”",
      [["不去，让别人远远观察老地方|Don’t go; have someone watch the spot from afar", 1], ["去见他|Go to meet him", 0], ["回复问他这三个月去了哪|Reply asking where he’s been", .2], ["删除消息|Delete the message", .4]], "一个“安全”的人不会消失三个月。|Someone who’s “safe” doesn’t vanish for three months."),
    C("忘带的钥匙|Forgotten Keys", "你的同事“忘带钥匙”，想在你的公寓借住一晚。他从来没来过你家。|A colleague “forgot his keys” and wants to sleep at your flat. He has never been to your home.",
      [["帮他订一间酒店|Book him a hotel room", 1], ["让他住下|Let him stay", 0], ["说家里有人不方便|Say you have a guest", .6], ["开车送他去找锁匠|Drive him to a locksmith", .5]], "一个从没来过的人，突然想在你家过夜。|Someone who’s never visited suddenly wants a night in your home."),
    C("香水的味道|A Trace of Perfume", "你的上级回到办公室时，身上有一股你在对方使馆的酒会上闻到过的香水味。|Your superior returns to the office smelling of a perfume you noticed at the other side’s embassy reception.",
      [["记录下来，暗中观察一段时间|Note it and watch quietly for a while", 1], ["直接问他去了哪里|Ask him where he’s been", .1], ["立刻举报|Report him at once", .4], ["不在意|Ignore it", 0]], "怀疑要有耐心，证据比直觉更重要。|Suspicion needs patience — evidence matters more than a hunch."),
    C("门把手上的灰|Dust on the Doorknob", "你出差回来，发现门把手上一点灰都没有，而门框上积了厚厚一层。|Back from a trip, you find no dust on the doorknob — and a thick layer on the frame.",
      [["不进门，打电话叫人来检查|Don’t go in; call someone to sweep it", 1], ["进门检查有没有丢东西|Go in and check for missing things", .1], ["擦一擦门框|Dust the frame", 0], ["换一把锁|Change the lock", .2]], "有人碰过门把手，还擦掉了指纹。|Someone touched the knob and wiped their prints."),
    C("婚礼请柬|A Wedding Invitation", "一个你只见过两次的对方官员，给你寄来了他女儿的婚礼请柬。|An official from the other side you’ve met twice sends you an invitation to his daughter’s wedding.",
      [["请示上级后再决定|Ask your superiors before deciding", 1], ["直接去|Just go", .2], ["直接拒绝|Decline outright", .4], ["送一份贵重礼物|Send an expensive gift", 0]], "一张请柬可能是一扇门，也可能是一个陷阱。这种事不能一个人决定。|An invitation can be a door or a trap. It isn’t yours alone to decide."),
    C("出租车里的报纸|A Newspaper in the Taxi", "出租车后座上有一份报纸，被折在你常看的那一版，上面的填字游戏填了一半。|A newspaper on the taxi seat, folded to the page you always read, the crossword half done.",
      [["什么也不碰，下一个路口下车|Touch nothing; get out at the next junction", 1], ["看看填字游戏写了什么|Read the crossword answers", .3], ["把报纸带走|Take the paper", .2], ["问司机报纸是谁的|Ask the driver whose it is", 0]], "那是一个信号：我们知道你的习惯。别接。|It’s a signal: we know your habits. Don’t engage."),
    C("退休的老特工|The Retired Agent", "一位已经退休多年的老前辈约你钓鱼，聊着聊着问起了现在的行动代号。|A long-retired veteran invites you fishing and, chatting, asks about current operation code names.",
      [["笑着岔开话题，回去后报告|Laugh it off, then report it", 1], ["告诉他，他是自己人|Tell him — he’s one of us", 0], ["生气地离开|Leave angrily", .3], ["编一个假代号|Make up a fake one", .6]], "退休的人不需要知道现在的事。问了，就说明有人想知道。|Retirees don’t need current details. If he asks, someone wants to know."),
    C("密码锁|The Code Lock", "目标的保险柜是密码锁，按键上有四个键磨得特别亮。|The target’s safe has a keypad; four keys are worn shiny.",
      [["按目标生日组合尝试一次，不行就撤|Try one combination from his birthday; if it fails, leave", 1], ["把所有组合挨个试一遍|Try every combination", 0], ["撬开保险柜|Pry it open", 0], ["放弃保险柜，拍桌上的文件|Skip the safe; photograph the desk", .5]], "人们总用自己记得住的数字。试错太多会触发报警。|People use numbers they can remember. Too many tries trips the alarm."),
    C("凌晨的快递|A Parcel at Dawn", "凌晨五点，快递员敲门送来一个你没买过的包裹，寄件人是你掩护身份的“母亲”。|5 a.m. A courier delivers a parcel you never ordered — from your cover identity’s “mother”.",
      [["不拆，交给技术部门|Don’t open it; hand it to the tech team", 1], ["拆开看看|Open it", 0], ["拒收|Refuse delivery", .4], ["打电话给“母亲”|Call your “mother”", .1]], "你的掩护“母亲”不存在。会寄东西的，只能是别人。|Your cover mother doesn’t exist. Whoever sent it is someone else."),
    C("一张旧照片|An Old Photograph", "对方情报官在谈判桌上“不小心”掉出一张照片——照片上是你小时候和父亲在公园里。|Across the table, their officer “accidentally” drops a photo — you as a child, with your father, in a park.",
      [["面无表情地捡起来递还给他|Pick it up expressionlessly and hand it back", 1], ["问他从哪里弄来的|Ask where he got it", .2], ["当场起身离开|Get up and leave", .4], ["把照片收起来|Pocket the photo", .1]], "他想看你的反应。不给他任何反应，就是最好的回答。|He wants your reaction. Giving none is the best answer."),
    C("会议室的温度|The Temperature in the Room", "你注意到会议室的空调比平时冷了三度，对方首席坐在出风口正下方，却穿着短袖。|The meeting room is three degrees colder than usual; their lead sits right under the vent — in short sleeves.",
      [["推迟会议，要求换房间|Postpone and ask for another room", 1], ["多穿一件外套|Put on a jacket", .2], ["什么也不说|Say nothing", 0], ["调高空调温度|Turn up the heat", .4]], "他早就知道会冷——房间被动过手脚。|He knew it would be cold — the room has been prepared.")
  ];
  if (G.SPY_CASES) MORE.forEach(function (c) { G.SPY_CASES.push(c); });
})();
