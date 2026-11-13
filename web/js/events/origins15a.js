/* Version 1.6 stories: every family background gets its own arc, from childhood to old age.
   Part 1: ordinary, working, struggling and professional families. */
(function () {
  "use strict";
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function OX(id, orgs, a, title, icon, t, o, w) {
    if (typeof orgs === "string") orgs = [orgs];
    return E(id, a, title, icon, t, o, { w: w || 2.2, if: function (S, p) { return orgs.indexOf(p.origin) >= 0 && !p.jail && (a[0] >= 18 || !p.flags.heir); } });
  }
  function par() { return N.rel("father", "mother").filter(function (n) { return n.alive; }); }

  G.evs([
    /* ============ worker: city working-class family ============ */
    OX("ow_worker_shift", "worker", [6, 12], "爸爸的夜班|Dad’s Night Shift", "🌃", "爸爸上夜班，每天早上你起床时他刚回来，身上带着机油味。他说：“今天给你带了个好东西。”|Dad works nights. Every morning as you wake he comes home smelling of machine oil. “Brought you something today.”", [
      O("跑过去抱他|Run and hug him", R("是一个用废零件做的小机器人。你把它摆在床头，一直摆到了上大学。|A little robot made from scrap parts. It stayed on your bedside table until university.", { happy: 6, par: 5 })),
      O("让他快去睡觉|Tell him to go to sleep", R("他笑着揉了揉你的头。你偷偷给他盖了被子。|He ruffled your hair. You sneaked in and tucked him in.", { eq: 3, par: 4 }))
    ]),
    OX("ow_worker_layoff", "worker", [10, 17], "下岗|Laid Off", "📉", "厂子倒闭了，爸妈同时下岗。饭桌上安静得只听得见筷子声。|The factory closed and both parents lost their jobs. At dinner, only chopsticks make a sound.", [
      O("把零花钱存罐交给妈妈|Give Mum your piggy bank", R("妈妈抱着存钱罐哭了，第二天她开始在菜市场摆摊。|Mum cried holding it; the next day she set up a stall at the market.", { eq: 5, par: 6, karma: 4 })),
      O("发誓要考上好大学|Vow to get into a great university", R("那年你的成绩突飞猛进。|Your grades shot up that year.", { perf: 12, smarts: 3, stress: 6 })),
      O("装作什么都不知道|Act like nothing’s wrong", R("你听见爸爸在阳台上一根接一根地抽烟。|You heard Dad chain-smoking on the balcony.", { stress: 5 }))
    ]),
    OX("ow_worker_pride", "worker", [24, 45], "第一次给爸妈买东西|Your First Gift to Your Parents", "🎁", "领到第一份正式工资，你站在商场里，不知道该给爸妈买什么。|With your first real pay cheque, you stand in a mall wondering what to buy your parents.", [
      O("给爸爸买一件好外套|A good coat for Dad", R("他穿着去厂里的老同事家串门，逢人就说“儿女买的”。|He wore it to visit old workmates and told everyone his child bought it.", { par: 10, happy: 6, money: -200 })),
      O("带他们去吃一顿好的|Take them out for a fancy meal", R("妈妈一直在算这顿饭多少钱，但笑得合不拢嘴。|Mum kept adding up the bill — but couldn’t stop smiling.", { par: 8, happy: 5, money: -150 }))
    ]),
    OX("ow_worker_oldhouse", "worker", [45, 80], "老厂区拆迁|The Old Factory Estate", "🏚️", "你从小长大的工厂宿舍要拆了。爸妈的老邻居们组织了最后一次聚会。|The factory housing you grew up in is being demolished. The old neighbours hold one last gathering.", [
      O("带着孩子一起去|Bring your children", R("老邻居们抢着给孩子讲你小时候的糗事。|The neighbours competed to tell your kids embarrassing stories about you.", { happy: 8, kids: 4 })),
      O("一个人在楼下站了很久|Stand outside alone for a long time", R("你在墙上找到了小时候刻的身高线。|You found the height marks you carved as a child.", { eq: 3, happy: 2 }))
    ]),

    /* ============ middle-class family ============ */
    OX("om_middle_tutor", "middle", [7, 14], "排满的周末|A Fully Booked Weekend", "📅", "妈妈给你报了钢琴、奥数、英语、游泳四个班。周末比上学还累。|Mum signed you up for piano, maths olympiad, English and swimming. Weekends are harder than school.", [
      O("求妈妈砍掉两个|Beg Mum to drop two", RC(.6, "妈妈犹豫了很久，留下了你最喜欢的游泳和钢琴。|After long hesitation she kept swimming and piano — your favourites.", { happy: 8, par: 2 }, "妈妈说：“别人家孩子都在学。”|“Everyone else’s kids are doing it,” she said.", { stress: 8 })),
      O("咬牙坚持|Grit your teeth", R("你成了“别人家的孩子”，但很少笑。|You became the kid other parents envy — but rarely smiled.", { smarts: 4, perf: 6, happy: -6 }))
    ]),
    OX("om_middle_mortgage", "middle", [12, 18], "房贷|The Mortgage", "🏠", "你无意中看到了爸妈的账本：为了换学区房，他们背了三十年房贷。|You stumble on your parents’ ledger: they took a thirty-year mortgage for a better school district.", [
      O("更加努力学习|Study even harder", R("你把账本上的数字记在了心里。|You carried those numbers in your head.", { perf: 10, stress: 6 })),
      O("跟爸妈说别为我这么拼|Tell them not to sacrifice so much for you", R("爸爸说：“这是我们愿意的。”那晚全家第一次聊到了很晚。|Dad said: “We wanted to.” That night the family talked late for the first time.", { par: 8, eq: 4 }))
    ]),
    OX("om_middle_caught", "middle", [30, 50], "夹心层|The Sandwich Years", "🥪", "孩子要上学，父母开始生病，房贷还没还完。你在车里坐了半小时才上楼。|Kids’ school fees, parents falling ill, the mortgage still running. You sat in the car for half an hour before going up.", [
      O("和伴侣一起列一张清单|Make a list with your partner", R("你们把每一笔开销都算清楚，发现日子还能过。|You costed everything out and found you could manage.", { stress: -10, part: 6, smarts: 2 })),
      O("一个人扛着|Carry it alone", R("你什么也没说，第二天照常上班。|You said nothing and went to work as usual.", { stress: 10, health: -2 }))
    ]),

    /* ============ rural family ============ */
    OX("or_rural_river", "rural", [6, 12], "村口的小河|The Village Stream", "🏞️", "夏天，村里的孩子们都去河里摸鱼。妈妈不许你去，说去年淹死过人。|In summer the village kids catch fish in the stream. Mum forbids it — someone drowned last year.", [
      O("偷偷去|Sneak off", RC(.75, "你摸到了一条大鲫鱼，回家被打了一顿，但鱼汤很香。|You caught a big carp, got a hiding at home — and the fish soup was delicious.", { happy: 6, health: 2 }, "你脚下一滑掉进深水区，被大孩子救了上来。|You slipped into deep water and an older kid pulled you out.", { health: -6, stress: 10 })),
      O("在岸边看|Watch from the bank", R("你帮大家看管鞋子，大家分了你两条小鱼。|You minded the shoes; they gave you two small fish.", { eq: 2 }))
    ]),
    OX("or_rural_firstcity", "rural", [12, 18], "第一次进城|Your First Trip to the City", "🚌", "你第一次跟着爸爸进城卖菜。你看见了高楼、地铁和穿着校服的城里孩子。|First time going to the city with Dad to sell vegetables. You see towers, the metro, city kids in smart uniforms.", [
      O("发誓要考到这里来|Vow to study your way here", R("回村的路上你一句话也没说，只是一直看着窗外。|On the way home you said nothing, just stared out the window.", { perf: 12, smarts: 3 })),
      O("觉得还是村里好|Decide home is better", R("你想念院子里的那棵枣树。|You missed the jujube tree in the yard.", { happy: 4 }))
    ]),
    OX("or_rural_admit", "rural", [17, 19], "全村的骄傲|The Pride of the Village", "🎉", "你的录取通知书到了村里。村长敲锣打鼓，全村人都来了。|Your university acceptance letter arrives. The village chief beats a gong; the whole village turns out.", [
      O("给乡亲们鞠躬|Bow to the villagers", R("乡亲们凑了一个红包，有人塞给你一篮鸡蛋，有人塞给你五十块钱。|They pooled a red envelope — a basket of eggs from one, fifty yuan from another.", { money: 800, happy: 10, karma: 4 })),
      O("躲在屋里不好意思出来|Hide inside, embarrassed", R("妈妈把你拉出来，脸上全是笑。|Mum dragged you out, beaming.", { happy: 6, par: 5 }))
    ], 3),
    OX("or_rural_return", "rural", [30, 60], "回乡|Going Home", "🌾", "村里在搞乡村振兴，村长打电话问你能不能回来帮帮忙。|The village is being revitalised; the chief calls to ask if you’ll come back and help.", [
      O("回去办合作社|Go back and start a co-op", RC(.55, "你带着乡亲们种有机蔬菜，三年后全村人均收入翻了一番。|You led the village into organic farming; three years later incomes had doubled.", { fame: 5, karma: 12, happy: 10, money: 5000 }, "合作社亏了钱，乡亲们开始有怨言。|The co-op lost money and grumbling began.", { money: -5000, stress: 10 })),
      O("捐一笔钱修路|Donate money for a road", R("新路通车那天，路口立了一块碑，上面有你的名字。|When the road opened, a stone at the junction bore your name.", { money: -5000, karma: 10, fame: 2 })),
      O("城里走不开|You can’t leave the city", R("你常常想起村口那棵大槐树。|You often think of the old tree at the village gate.", {}))
    ]),

    /* ============ medical family ============ */
    OX("omed_white", "medical", [5, 11], "医院里长大|Growing Up in the Hospital", "🩺", "爸妈总在值班，你放学后就在医院的护士站写作业。|Your parents are always on call; after school you do homework at the nurses’ station.", [
      O("偷偷看医生查房|Tag along on ward rounds", R("一位老医生让你听了听病人的心跳。你第一次觉得生命是一种声音。|An old doctor let you listen to a patient’s heartbeat. Life, you realised, had a sound.", { smarts: 4, eq: 2 })),
      O("和住院的小朋友玩|Play with the children on the ward", R("你和一个白血病女孩成了好朋友。她出院那天送了你一幅画。|You became best friends with a girl with leukaemia. The day she went home she gave you a drawing.", { eq: 5, karma: 4 }))
    ]),
    OX("omed_choice", "medical", [16, 19], "学医还是不学|Medicine or Not", "🩻", "爸爸说：“学医太苦了，我们不逼你。”但你知道他们心里希望你接班。|Dad says: “Medicine is brutal. We won’t push you.” But you know they hope you’ll follow.", [
      O("决定学医|Choose medicine", R("妈妈把她用了二十年的听诊器送给了你。|Mum gave you the stethoscope she’d used for twenty years.", { par: 10, smarts: 2, flag: "medDream" })),
      O("选择自己喜欢的方向|Choose your own path", R("爸爸沉默了一会儿：“你开心就好。”|Dad was quiet a moment: “As long as you’re happy.”", { happy: 6, par: -2 }))
    ]),
    OX("omed_parent_sick", "medical", [35, 70], "医生也会生病|Doctors Get Sick Too", "💔", "当了一辈子医生的父亲，被查出了晚期癌症。他说：“我比谁都清楚该怎么做。”|Your father, a doctor all his life, is diagnosed with late-stage cancer. “I know better than anyone what to do,” he says.", [
      O("尊重他的选择，陪他走完|Respect his choice and stay with him", R("他放弃了激进治疗，在家里度过了最后半年。走之前他给每个病人写了信。|He declined aggressive treatment and spent his last six months at home, writing letters to every patient.", { eq: 6, happy: -10, par: 10 })),
      O("坚持让他治疗|Insist on treatment", R("他为了你又做了三次化疗。|He went through three more rounds of chemo for you.", { par: 4, stress: 10 }))
    ]),

    /* ============ civil-servant family ============ */
    OX("oc_civil_rules", "civil", [6, 12], "规矩|The Rules", "📏", "爸爸是公务员。家里的规矩是：别人送的东西一律不能收。今天邻居送来一箱水果。|Dad is a civil servant. House rule: never accept gifts. Today a neighbour brings a box of fruit.", [
      O("按规矩退回去|Return it as the rule says", R("邻居愣了一下，笑着说：“你们家真是……”爸爸摸了摸你的头。|The neighbour blinked, then laughed: “Your family really is…” Dad patted your head.", { karma: 4, par: 4 })),
      O("偷偷吃了一个|Sneak one", R("爸爸发现后没骂你，第二天买了一箱同样的水果还给了邻居。|Dad didn’t scold you — he bought an identical box and gave it to the neighbour.", { eq: 3 }))
    ]),
    OX("oc_civil_exam", "civil", [20, 30], "考公|The Exam", "📚", "爸妈希望你考公务员。“铁饭碗最稳当。”|Your parents want you to sit the civil service exam. “An iron rice bowl is safest.”", [
      O("听爸妈的去考|Do as they say", function (c) { c.p.flags.civilPush = 1; H.fx(c, { par: 6 }); return "爸爸把他当年的复习笔记翻了出来，上面全是红笔圈注。|Dad dug out his old revision notes, covered in red circles."; }),
      O("我想去闯一闯|I want to try my own way", R("爸爸叹了口气：“年轻人，去吧。”|Dad sighed: “Go on, then. You’re young.”", { happy: 4, par: -3 }))
    ]),
    OX("oc_civil_retire", "civil", [35, 70], "父亲退休|Dad Retires", "🏛️", "当了一辈子科员的父亲退休了。欢送会上，他的领导比他年轻二十岁。|Your father retires after a lifetime as a clerk. At his send-off, his boss is twenty years younger than him.", [
      O("回家陪他喝一杯|Go home and have a drink with him", R("他喝多了，说：“我这辈子没贪过一分钱，问心无愧。”|He drank too much and said: “I never took a penny in my life. My conscience is clean.”", { par: 8, eq: 3 })),
      O("带他出去旅游|Take him travelling", R("他第一次坐了飞机，像个孩子一样一直看着窗外。|First time on a plane — he stared out the window like a child.", { par: 10, money: -800, happy: 5 }))
    ]),

    /* ============ artist family ============ */
    OX("oa_art_wall", "artist", [4, 9], "画满墙的家|Walls Covered in Paint", "🖌️", "别人家的孩子在墙上画画会挨打，你家的墙本来就是画布。|Other kids get punished for drawing on walls. In your house, the walls are the canvas.", [
      O("画一整面墙的大海|Paint a whole wall as the sea", R("爸爸在你的大海里加了一艘小船，船上写着你的名字。|Dad added a little boat to your sea, with your name on it.", { happy: 8, par: 5, sk: { art: 6 } })),
      O("画全家福|Paint a family portrait", R("妈妈说这是她见过最好看的画，至今还挂在客厅里。|Mum said it was the best painting she’d ever seen. It still hangs in the living room.", { eq: 3, par: 6, sk: { art: 4 } }))
    ]),
    OX("oa_art_poor", "artist", [10, 17], "卖不出去的画|Paintings That Won’t Sell", "🖼️", "爸爸的画展只卖出去一幅。那天晚上，家里吃的是白粥。|Dad’s exhibition sold one painting. Dinner that night was plain rice porridge.", [
      O("说：“我最喜欢你的画了。”|Say: “I love your paintings most of all.”", R("爸爸红了眼圈，第二天把那幅画送给了你。|Dad’s eyes reddened. The next day he gave you the painting.", { par: 8, eq: 4 })),
      O("问爸爸为什么不画点好卖的|Ask why he doesn’t paint things that sell", R("他想了很久：“因为那就不是我了。”|He thought a long while: “Because then it wouldn’t be me.”", { smarts: 3 }))
    ]),
    OX("oa_art_legacy", "artist", [30, 70], "父亲的画涨价了|Dad’s Paintings Go Up", "📈", "父亲去世几年后，他的画在拍卖会上突然被炒到了天价。|Years after his death, your father’s paintings suddenly fetch astronomical prices at auction.", [
      O("卖掉几幅|Sell a few", R("你卖了三幅，用这笔钱设立了一个青年画家奖学金，以他的名字命名。|You sold three and set up a young-artist scholarship in his name.", { money: 80000, karma: 8, fame: 4 })),
      O("一幅也不卖|Sell none", R("你说：“这些画是给家里人看的。”|You said: “These are for the family.”", { happy: 4 })),
      O("全卖了|Sell them all", R("你一夜暴富，但家里的墙空了。|You were rich overnight, and the walls were bare.", { money: 300000, happy: -4 }))
    ]),

    /* ============ debt-ridden family ============ */
    OX("od_debt_door", "debt", [6, 14], "敲门声|The Knocking", "🚪", "又有人在敲门。妈妈捂着你的嘴，示意你别出声。|Someone’s knocking again. Mum covers your mouth, signalling silence.", [
      O("一动不动地等|Stay perfectly still", R("敲门声持续了十分钟。那以后你很怕听见敲门声。|The knocking went on ten minutes. Ever since, you’ve dreaded the sound.", { stress: 10, eq: 2 })),
      O("等他们走了，抱住妈妈|When they leave, hug Mum", R("妈妈抱着你说：“妈妈一定会还清的。”|Mum held you: “I will pay it all back. I promise.”", { par: 8, karma: 2 }))
    ]),
    OX("od_debt_paid", "debt", [18, 40], "最后一笔|The Last Payment", "✅", "你工作的第三年，帮爸妈还清了最后一笔债。|In your third year of work, you pay off your parents’ last debt.", [
      O("全家去吃顿好的庆祝|Celebrate with a family feast", R("爸爸喝了一点酒，说：“我们家终于可以抬头走路了。”|Dad had a little to drink: “Our family can finally walk with our heads up.”", { happy: 15, par: 12, money: -300 })),
      O("什么也没说，把收据放在他们桌上|Say nothing; leave the receipt on their table", R("那天晚上，你听见爸妈在房间里哭。|That night you heard your parents crying in their room.", { par: 10, eq: 4 }))
    ], 3),
    OX("od_debt_never", "debt", [30, 70], "绝不欠钱|Never in Debt", "💳", "一位朋友劝你贷款买大房子。你想起了小时候的敲门声。|A friend urges you to borrow for a bigger house. You remember the knocking.", [
      O("坚决不借|Absolutely not", R("你买了一套小一点的房子，全款。每天睡得很踏实。|You bought a smaller place outright, and sleep soundly every night.", { stress: -8, smarts: 2 })),
      O("这次不一样，借|This time is different — borrow", R("你签合同的时候，手一直在抖。|Your hand shook as you signed.", { stress: 10 }))
    ]),

    /* ============ academic dynasty ============ */
    OX("oac_dinner", "academic", [6, 14], "饭桌上的学术讨论|Dinner-Table Debates", "🧮", "你家的晚饭总是变成学术讨论会。今天爷爷问你：“为什么天是蓝的？”|Dinner in your house always turns into a seminar. Tonight Grandpa asks: “Why is the sky blue?”", [
      O("认真想了一个答案|Think hard and give an answer", R("你的答案是错的，但爷爷高兴地说：“思路对了！”他送了你一本物理书。|Your answer was wrong, but Grandpa said: “Right way of thinking!” and gave you a physics book.", { smarts: 5, par: 3 })),
      O("反问爷爷|Ask him back", R("爷爷愣了一下，哈哈大笑：“好！会提问比会回答更重要。”|Grandpa blinked, then roared: “Good! Asking matters more than answering.”", { smarts: 3, eq: 3 }))
    ]),
    OX("oac_pressure", "academic", [14, 19], "院士的孙子|An Academician’s Grandchild", "🎓", "老师在全班面前说：“你爷爷是院士，你怎么才考这么点？”|In front of the class, the teacher says: “Your grandfather is an academician. Is this the best you can do?”", [
      O("下决心证明自己|Resolve to prove yourself", R("期末你考了年级第一，然后再也没提过爷爷的名字。|You came top at the end of term — and never mentioned your grandfather again.", { perf: 12, smarts: 3, stress: 6 })),
      O("回家告诉爷爷|Tell Grandpa", R("爷爷说：“我当年也没考好过。你是你，我是我。”|Grandpa said: “I failed plenty of exams too. You are you; I am me.”", { happy: 6, par: 5 }))
    ]),
    OX("oac_library", "academic", [40, 80], "捐赠藏书|Donating the Library", "📚", "爷爷留下了三万册藏书。家里没地方放了。|Grandpa left thirty thousand books. There’s nowhere left to put them.", [
      O("捐给大学，设一个以他命名的阅览室|Donate them to a university as a reading room in his name", R("揭牌那天，很多白发苍苍的学者来了，他们都是爷爷的学生。|At the dedication, many white-haired scholars came — all his former students.", { karma: 8, fame: 3, happy: 5 })),
      O("自己留一部分|Keep some", R("你留下了一百本他做满批注的书。|You kept a hundred books full of his notes.", { smarts: 3 }))
    ]),

    /* ============ sporting champions ============ */
    OX("och_dawn", "champion", [5, 12], "凌晨五点的训练|5 a.m. Training", "🥇", "妈妈是奥运冠军。你五岁起每天五点就被叫起来跑步。|Mum is an Olympic champion. Since you were five you’ve been woken at 5 a.m. to run.", [
      O("咬牙坚持|Push through", R("你在全市少年组拿了第一。妈妈第一次在你面前哭了。|You won the city junior title. Mum cried in front of you for the first time.", { health: 6, sk: { athletic: 8 }, par: 4 })),
      O("说你不喜欢跑步|Say you don’t like running", R("妈妈沉默了很久，说：“那你喜欢什么？”那是你们第一次认真聊天。|Mum was quiet a long time: “Then what do you like?” It was your first real conversation.", { happy: 6, eq: 4 }))
    ]),
    OX("och_shadow", "champion", [14, 20], "冠军的影子|In the Champion’s Shadow", "🏅", "你在比赛中拿了第二。记者问的却是：“你妈妈当年可是冠军，你有压力吗？”|You come second. The reporter only asks: “Your mother was a champion — do you feel the pressure?”", [
      O("“我想成为我自己。”|“I want to be myself.”", R("这句话上了体育新闻的标题。|The line made the sports headlines.", { fame: 3, eq: 4 })),
      O("一言不发离开|Walk off without a word", R("妈妈追上来，什么也没说，只是陪你走了一段。|Mum caught up and said nothing — just walked beside you.", { par: 5 }))
    ]),
    OX("och_medal", "champion", [40, 80], "金牌|The Gold Medal", "🏆", "妈妈把她的奥运金牌交给你：“现在它是你的了。”|Mum hands you her Olympic gold medal. “It’s yours now.”", [
      O("把它挂在孩子的房间里|Hang it in your child’s room", R("你的孩子每天早上都要摸一下它再出门。|Your child touches it every morning before leaving.", { happy: 6, kids: 3 })),
      O("捐给体育博物馆|Give it to the sports museum", R("展柜旁边的说明里，写着妈妈和你的名字。|The caption beside the case names her — and you.", { fame: 3, karma: 4 }))
    ]),

    /* ============ police family ============ */
    OX("op_police_wait", "police", [6, 13], "等不回来的晚饭|The Dinner That Went Cold", "🚔", "今天是你的生日，爸爸说一定回来。蛋糕上的蜡烛已经烧完了。|It’s your birthday; Dad promised he’d be home. The candles have burned down.", [
      O("给他留一块蛋糕|Save him a slice", R("半夜他回来了，坐在黑暗的厨房里吃那块蛋糕，吃着吃着笑了。|At midnight he came home and ate it in the dark kitchen, smiling.", { par: 8, eq: 3 })),
      O("生气地把蛋糕扔了|Throw the cake away in anger", R("第二天你在新闻里看到，他昨晚救了一个被绑架的孩子。|The next day the news said he’d rescued a kidnapped child that night.", { eq: 5, stress: 3 }))
    ]),
    OX("op_police_hurt", "police", [10, 20], "医院的电话|A Call from the Hospital", "🏥", "医院打来电话：爸爸在抓捕嫌犯时受了伤。|The hospital calls: Dad was hurt making an arrest.", [
      O("冲去医院|Rush to the hospital", R("他躺在床上，第一句话是：“抓到了。”你哭着骂他，他笑了。|From the bed his first words were: “Got him.” You cried and scolded him; he laughed.", { par: 10, stress: 8 })),
      O("回家帮妈妈|Go home to help Mum", R("妈妈一夜没睡。你给她煮了一碗面。|Mum didn’t sleep. You cooked her noodles.", { eq: 5, par: 6 }))
    ]),
    OX("op_police_badge", "police", [22, 60], "爸爸的警号|Dad’s Badge Number", "👮", "爸爸退休了。按惯例，他的警号会封存，或者传给子女。|Dad retires. By tradition his badge number is retired — or passed to a child.", [
      O("如果我当警察，我要用这个警号|If I join, I want that number", R("爸爸把警号牌放在你手心里，握了很久。|He placed the number plate in your palm and held your hand a long time.", { par: 12, flag: "polLegacy", karma: 3 })),
      O("让它封存吧|Let it be retired", R("退休仪式上，全局为他敬礼。|At his retirement the whole station saluted him.", { par: 5 }))
    ]),

    /* ============ left-behind child ============ */
    OX("olb_phone", "leftbehind", [5, 12], "每周一次的电话|The Weekly Phone Call", "📞", "爸妈在外地打工，每周日晚上打一次电话。奶奶说每次只能说十分钟，电话费贵。|Your parents work in a distant city and call every Sunday night. Grandma says ten minutes only — calls are expensive.", [
      O("把一周的事都讲给他们听|Tell them everything from the week", R("妈妈说：“你又长大了。”挂了电话，你把要说的话写在本子上，等下周再说。|Mum said: “You’ve grown again.” After, you wrote down what you didn’t get to say, for next week.", { eq: 4, par: 4 })),
      O("问他们什么时候回来|Ask when they’re coming home", R("“过年就回来。”你在日历上把过年那天圈了起来。|“For New Year.” You circled it on the calendar.", { par: 3, happy: -2 }))
    ]),
    OX("olb_newyear", "leftbehind", [6, 14], "过年|New Year", "🧧", "爸妈过年回来了，带了新衣服和一大包零食。可是住了五天，他们又要走了。|Your parents come home for New Year with new clothes and snacks. After five days, they’re leaving again.", [
      O("追着车跑|Run after the bus", R("车开远了，你站在路口哭了很久。奶奶把你背回了家。|The bus disappeared. You cried at the crossroads until Grandma carried you home.", { happy: -8, par: 6 })),
      O("说：“我会好好学习的。”|Say: “I’ll study hard.”", R("妈妈在车上哭了一路。|Mum cried the whole way.", { perf: 6, par: 8, eq: 3 })),
      O("求他们带你一起走|Beg them to take you", RC(.3, "他们咬咬牙，把你带进了城。|They gritted their teeth and took you to the city.", { happy: 10, par: 10, flag: "lbCity" }, "城里的学校进不去。|City schools wouldn’t take you.", { happy: -6 }))
    ]),
    OX("olb_grandma", "leftbehind", [16, 40], "奶奶|Grandma", "👵", "从小把你带大的奶奶病了。她在电话里说：“别回来，耽误学习/工作。”|The grandmother who raised you falls ill. On the phone she says: “Don’t come back — you’ll miss work.”", [
      O("连夜赶回去|Go back that night", R("奶奶看见你，一下子就有了精神。她握着你的手说：“我就知道你会回来。”|She brightened the moment she saw you: “I knew you’d come.”", { eq: 6, happy: 4, karma: 5 })),
      O("每天视频|Video-call her every day", R("你教会了她用视频通话。她每次都把镜头对着鸡窝给你看。|You taught her to video-call. She always pointed the camera at the hens.", { eq: 3 }))
    ], 2.6),

    /* ============ single-parent family ============ */
    OX("os_single_meeting", "single", [6, 14], "家长会|Parents’ Evening", "👩‍👧", "家长会上，别人都是爸妈一起来，只有妈妈一个人来，还迟到了——她刚下班。|At parents’ evening everyone else has two parents. Mum comes alone, late, straight from work.", [
      O("跑过去牵她的手|Run and take her hand", R("老师表扬你的时候，她挺直了腰。|When the teacher praised you, she sat up straight.", { par: 8, eq: 3 })),
      O("假装不认识她|Pretend not to know her", R("回家路上她什么也没说。你后悔了很多年。|She said nothing on the way home. You regretted it for years.", { par: -6, karma: -3 }))
    ]),
    OX("os_single_dad", "single", [12, 30], "那个离开的人|The One Who Left", "🚪", "多年没见的父亲突然联系你，说想见一面。|The father you haven’t seen in years gets in touch, asking to meet.", [
      O("去见他|Meet him", RC(.5, "他老了很多。他说了对不起。你们没有和好，但你心里放下了一些东西。|He’d aged a lot. He apologised. You didn’t reconcile, but something in you let go.", { eq: 6, happy: 3 }, "他其实是来借钱的。|He’d come to borrow money.", { happy: -8 })),
      O("不见|Refuse", R("妈妈知道后说：“你自己决定就好。”|Mum said: “It’s your decision.”", {}))
    ]),
    OX("os_single_mumremarry", "single", [18, 50], "妈妈的春天|Mum’s Second Spring", "💐", "妈妈有些不好意思地告诉你：她认识了一个人，想再婚。|Mum tells you, a little shyly, that she’s met someone and wants to remarry.", [
      O("真心为她高兴|Be truly happy for her", R("婚礼上，你牵着妈妈的手把她交给了那个人。她哭得妆都花了。|At the wedding you walked her down the aisle. Her make-up was ruined by tears.", { par: 12, happy: 8 })),
      O("不太能接受|Find it hard to accept", R("妈妈推迟了婚期，说等你想通了再说。|Mum postponed, saying she’d wait until you were ready.", { par: -3, stress: 6 }))
    ]),

    /* ============ orphan ============ */
    OX("oo_orphan_toy", "orphan", [4, 10], "孤儿院的玩具|Toys at the Orphanage", "🧸", "孤儿院收到了一批捐赠的玩具，只够每人挑一个。|The orphanage receives donated toys — one each.", [
      O("把好的让给更小的孩子|Let a younger child have the best one", R("那个小女孩后来每天跟在你后面，叫你“哥哥/姐姐”。|The little girl followed you everywhere after that, calling you big brother/sister.", { karma: 6, eq: 4 })),
      O("抢了一个最大的熊|Grab the biggest bear", R("你抱着它睡了好几年。|You slept hugging it for years.", { happy: 5 }))
    ]),
    OX("oo_orphan_origin", "orphan", [16, 40], "寻亲|Searching for Family", "🧬", "一个寻亲网站可以免费做DNA比对。你犹豫要不要登记。|A family-search site offers free DNA matching. You hesitate.", [
      O("登记|Register", RC(.35, "一年后，你接到了一个电话。电话那头是你的亲生母亲，她找了你二十年。|A year later the phone rang. Your birth mother — she had searched for you for twenty years.", { happy: 15, eq: 5, flag: "foundMother" }, "一直没有匹配结果。|No match ever came.", { happy: -3 })),
      O("算了，我有自己的家|No — I have my own family", R("你给孤儿院的院长打了个电话，说“谢谢”。|You called the orphanage director to say thank you.", { eq: 4, karma: 3 }))
    ]),
    OX("oo_orphan_giveback", "orphan", [30, 80], "回到孤儿院|Back to the Orphanage", "🏠", "你回到了长大的孤儿院。院子里的滑梯还在，只是小了很多。|You visit the orphanage where you grew up. The slide is still there — so much smaller.", [
      O("捐钱修缮|Donate for repairs", R("新宿舍以你的名字命名。孩子们给你唱了一首歌。|The new dormitory bears your name. The children sang you a song.", { money: -8000, karma: 12, happy: 8 })),
      O("资助一个孩子上学|Sponsor a child’s education", R("那个孩子后来考上了大学，第一封信就是写给你的。|The child later got into university — and their first letter was to you.", { money: -3000, karma: 10, happy: 6 }))
    ]),

    /* ============ immigrant family ============ */
    OX("oi_immig_translate", "immigrant", [7, 14], "家里的翻译|The Family Interpreter", "🗣️", "爸妈不太会说当地的语言，每次去银行、医院都要你翻译。|Your parents don’t speak the local language well; you interpret at every bank and doctor’s visit.", [
      O("耐心地翻译|Translate patiently", R("医生对你说：“你比很多大人都能干。”|The doctor said: “You’re more capable than most adults.”", { eq: 5, smarts: 3, par: 4 })),
      O("觉得丢脸|Feel embarrassed", R("你看见妈妈低下了头。|You saw Mum lower her eyes.", { par: -3, stress: 4 }))
    ]),
    OX("oi_immig_food", "immigrant", [7, 14], "饭盒|The Lunchbox", "🍱", "同学们笑你的午饭“闻起来很奇怪”。|Classmates laugh that your lunch “smells weird.”", [
      O("请他们尝一口|Offer them a taste", RC(.6, "一周后，好几个同学求你妈妈多做一份。|A week later several classmates begged your mum to make extra.", { happy: 8, eq: 4 }, "他们还是笑。你坚持吃完了。|They still laughed. You finished it anyway.", { eq: 3 })),
      O("让妈妈以后给你做三明治|Ask Mum for sandwiches from now on", R("妈妈愣了一下，说“好”。那以后她再也没做过家乡菜。|Mum paused, then said “okay”. She never cooked food from home again.", { par: -4, happy: -2 }))
    ]),
    OX("oi_immig_citizen", "immigrant", [18, 60], "入籍仪式|The Citizenship Ceremony", "🪪", "爸妈终于通过了入籍考试。仪式上，爸爸用不太标准的口音念完了誓词。|Your parents finally pass the citizenship test. At the ceremony Dad recites the oath in his heavy accent.", [
      O("在台下大声鼓掌|Applaud as loud as you can", R("爸爸下台后说：“三十年了。”|Coming off stage Dad said: “Thirty years.”", { par: 10, happy: 8 })),
      O("录下来发给老家的亲戚|Film it for relatives back home", R("老家的奶奶看了视频，说：“他还是我儿子。”|Grandma back home watched and said: “He’s still my son.”", { par: 6, eq: 3 }))
    ]),

    /* ============ small business family ============ */
    OX("osb_shop_help", "smallbiz", [6, 13], "看店|Minding the Shop", "🏪", "爸妈去进货，让你一个人看店。一位客人想赊账。|Your parents go to restock and leave you minding the shop. A customer wants credit.", [
      O("记在本子上|Write it in the ledger", R("那位客人第二天就来还了，还多给了你一块糖。|They paid the next day — and gave you a sweet.", { eq: 3, karma: 2 })),
      O("说不行，等爸妈回来|Say no — wait for your parents", R("爸爸回来后表扬你“有原则”。|Dad praised your principles.", { smarts: 2, par: 3 }))
    ]),
    OX("osb_shop_rival", "smallbiz", [12, 20], "对面开了超市|A Supermarket Opens Opposite", "🏬", "家门口开了一家大超市，爸妈的小店客人越来越少。|A big supermarket opens across the road; your parents’ shop is emptying.", [
      O("教爸妈开网店|Teach them to sell online", RC(.55, "网店的生意比实体店还好。|The online shop did better than the real one.", { money: 1000, smarts: 3, par: 8 }, "爸妈学不会，你只好帮他们打理。|They couldn’t get the hang of it, so you ran it for them.", { stress: 6, par: 4 })),
      O("劝他们关店|Tell them to close", R("爸爸摸着柜台，说再坚持一年。|Dad ran his hand along the counter and said one more year.", { par: -2 }))
    ]),
    OX("osb_shop_inherit", "smallbiz", [25, 55], "老店交给你|The Shop Is Yours", "🔑", "爸妈老了，想把小店交给你。|Your parents are getting old and want to hand you the shop.", [
      O("接手，好好经营|Take it on", RC(.5, "你把小店改成了街坊们最爱的社区店。|You turned it into the neighbourhood’s favourite corner shop.", { money: 3000, happy: 8, par: 10 }, "你还是没撑过大超市。|You couldn’t hold out against the chain.", { money: -2000, happy: -6 })),
      O("卖掉，让爸妈养老|Sell it so they can retire", R("爸妈拿着钱去南方住了一个冬天。|Your parents spent a winter in the warm south with the money.", { par: 8 }))
    ]),

    /* ============ scholarly family ============ */
    OX("osc_books", "scholar", [5, 12], "一屋子的书|A House Full of Books", "📖", "家里最多的就是书。今天你在书柜最高层发现了一本爸爸年轻时写的诗集。|Books everywhere. Today you find a collection of poems Dad wrote when he was young, on the top shelf.", [
      O("偷偷读完|Read it in secret", R("诗里写的是妈妈。你从来不知道爸爸这么浪漫。|The poems were all about Mum. You never knew Dad was so romantic.", { eq: 4, smarts: 2 })),
      O("拿着去问爸爸|Ask Dad about it", R("爸爸的脸红了，然后给你念了一首。|Dad blushed — then read you one.", { par: 6, happy: 4 }))
    ]),
    OX("osc_debate", "scholar", [14, 20], "家里的辩论|The Family Debate", "🗯️", "饭桌上，你第一次和爸爸争论一个观点，而且你觉得自己是对的。|At dinner, for the first time, you argue a point with Dad — and you think you’re right.", [
      O("据理力争|Hold your ground", R("吵到最后，爸爸放下筷子说：“你说服我了。”他看起来很骄傲。|In the end Dad set down his chopsticks: “You’ve convinced me.” He looked proud.", { smarts: 4, eq: 2, par: 4 })),
      O("算了，让着他|Let it go", R("爸爸后来查了资料，偷偷承认你是对的。|Dad looked it up later and quietly admitted you were right.", { eq: 3 }))
    ]),
    OX("osc_letters", "scholar", [40, 80], "父母的信|Your Parents’ Letters", "✉️", "整理父母遗物时，你发现了他们年轻时的几百封往来书信。|Clearing your parents’ things, you find hundreds of letters they wrote each other when young.", [
      O("整理出版|Edit and publish them", R("书出版后，很多读者说这是他们读过最美的爱情。|Readers called it the most beautiful love story they’d ever read.", { fame: 4, eq: 4, money: 2000 })),
      O("留给自己的孩子|Keep them for your children", R("你的孩子一封一封地读，读到一半哭了。|Your child read them one by one and cried halfway through.", { kids: 4, happy: 4 }))
    ]),

    /* ============ mixed-heritage family ============ */
    OX("omx_where", "mixed", [6, 14], "“你是哪里人？”|“Where Are You From?”", "🌍", "又有人问你：“你到底是哪里人？”|Someone asks again: “But where are you really from?”", [
      O("“两边都是。”|“Both.”", R("你说得很自信。那个人愣了一下，笑了。|You said it with confidence. They paused — then smiled.", { eq: 5, happy: 3 })),
      O("回家问妈妈|Ask Mum at home", R("妈妈拿出一张世界地图，在两个国家之间画了一条线：“你就在这条线上。”|Mum took out a world map and drew a line between two countries: “You live on this line.”", { eq: 4, par: 5 }))
    ]),
    OX("omx_grandparents", "mixed", [8, 20], "两边的外公外婆|Two Sets of Grandparents", "👴", "两边的祖父母第一次见面，语言不通，气氛有点尴尬。|Your two sets of grandparents meet for the first time. No shared language; it’s awkward.", [
      O("给他们当翻译|Interpret for them", R("到最后他们一起包饺子，笑得前仰后合。|By the end they were making dumplings together, laughing helplessly.", { eq: 6, happy: 8, smarts: 2 })),
      O("拿出相册让他们看|Show them the photo albums", R("他们不需要语言，指着你的照片一直笑。|They didn’t need words — they pointed at your photos and laughed.", { happy: 6 }))
    ]),
    OX("omx_identity", "mixed", [20, 50], "选择一个国籍|Choosing a Citizenship", "🛂", "其中一个国家不承认双重国籍。你必须做出选择。|One of your countries won’t allow dual citizenship. You must choose.", [
      O("选择现在生活的国家|Keep the one you live in", R("你把另一本护照放进了抽屉。它像是你童年的一部分。|You put the other passport in a drawer, like a piece of your childhood.", { stress: 4 })),
      O("选择另一个国家|Keep the other one", R("你开始认真学习那里的语言和历史。|You started properly learning its language and history.", { smarts: 3, happy: 2 }))
    ]),

    /* ============ military family ============ */
    OX("omil_salute", "military", [5, 12], "爸爸的军礼|Dad’s Salute", "🎖️", "爸爸探亲回来，你学着他的样子敬了一个军礼。|Dad is home on leave. You copy his salute.", [
      O("问他能不能带你去军营|Ask if you can visit the base", R("你在军营里吃了一顿饭，战士们都叫你“小首长”。|You ate in the mess hall; the soldiers called you “little commander”.", { happy: 8, health: 2, par: 6 })),
      O("问他为什么总不在家|Ask why he’s never home", R("他蹲下来：“因为要保护很多像你一样的孩子。”|He crouched: “Because I protect a lot of children like you.”", { eq: 4, par: 4 }))
    ]),
    OX("omil_move", "military", [8, 17], "又要转学|Another New School", "🧳", "爸爸调动，全家又要搬家。这是你的第五所学校。|Dad has a new posting; the family moves again. Your fifth school.", [
      O("主动交朋友|Make friends fast", R("你练出了一个本事：第一天就能记住全班同学的名字。|You developed a skill: learning the whole class’s names on day one.", { eq: 6 })),
      O("不想再交朋友了|Stop making friends", R("你开始一个人看书。|You started reading alone.", { smarts: 3, happy: -4 }))
    ]),
    OX("omil_flag", "military", [30, 80], "授旗|The Folded Flag", "🎖️", "父亲去世了。按照他的遗愿，葬礼上有一面旗帜覆盖在他身上。|Your father dies. As he wished, a flag drapes his coffin.", [
      O("接过叠好的旗帜|Accept the folded flag", R("战友们排成两列，向他敬了最后一个军礼。|His comrades formed two lines and gave him a last salute.", { eq: 5, happy: -6, fame: 1 }))
    ]),

    /* ============ expat / diplomat-posting family ============ */
    OX("odip_school", "diplomat", [6, 14], "国际学校|The International School", "🏫", "你在国际学校里有来自二十个国家的同学。今天要选一种语言作为第二外语。|Your international school has kids from twenty countries. Today you pick a second foreign language.", [
      O("选最难的那门|Choose the hardest one", R("两年后你能用它和同学吵架了。|Two years later you could argue in it.", { smarts: 4, flag: "lang3" })),
      O("选最好朋友在学的|Choose what your best friend is taking", R("你们一起在课上传小纸条。|You passed notes together in class.", { happy: 5, eq: 2 }))
    ]),
    OX("odip_goodbye", "diplomat", [10, 17], "告别|Goodbyes", "👋", "爸妈又调任了，每隔三年就要和所有朋友告别一次。|Another posting. Every three years you say goodbye to everyone.", [
      O("办一个告别派对|Throw a farewell party", R("你们约好每年视频一次。很多年后，有些人真的还在联系。|You promised a video call every year. Years later, some still did.", { eq: 5, happy: 4 })),
      O("悄悄地走|Leave quietly", R("你在飞机上哭了一路。|You cried the whole flight.", { happy: -6 }))
    ]),
    OX("odip_thirdculture", "diplomat", [20, 45], "哪里是家|Where Is Home?", "🏡", "有人问你“家在哪里”。你想了很久，答不上来。|Someone asks where home is. You think a long time and can’t answer.", [
      O("“有我爱的人的地方。”|“Wherever the people I love are.”", R("你给爸妈打了个电话。|You called your parents.", { eq: 6, par: 5 })),
      O("决定定居下来|Decide to settle down", R("你在一座城市买了一套房子，第一次有了自己的门牌号。|You bought a home in one city and, for the first time, had an address of your own.", { happy: 8 }))
    ])
  ]);
})();
