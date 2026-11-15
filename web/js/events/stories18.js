/* Version 1.8 stories: six new families (airline pilots, a Michelin kitchen, archaeologists, firefighters, a century-old
   tea estate, zookeepers), cadet and general's-life stories, grandparents' stories now that they are part of the family,
   pets growing old, royal courtships, the veteran who can't go home, and the Evergreen clinic. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function npc(id) { return id && S().npcs[id]; }
  function aff(c, k, v) { var n = npc(c.prm[k]); if (n) G.dPush('aff', N.addAff(n, v)); }

  /* ======================= six new families ======================= */
  [
    { id: 'pilot', n: '机长世家|Family of Airline Pilots', d: '爸爸是机长，爷爷也是。你家的冰箱上贴着全世界机场的磁铁。|Dad is a captain, and so was Grandpa. The fridge is covered in magnets from airports all over the world.', vip: 0, w: [400000, 3000000], inc: [150000, 450000], job: ['航空公司机长|Airline Captain', '飞行教员|Flight Instructor'], st: { smarts: 4, health: 3 }, sib: [0, 2] },
    { id: 'chef', n: '米其林厨房|A Michelin Kitchen', d: '你家楼下就是一家米其林二星餐厅。你闻着黄油和高汤的味道长大。|Downstairs is a two-star Michelin restaurant. You grew up on the smell of butter and stock.', vip: 0, w: [800000, 6000000], inc: [120000, 600000], job: ['米其林主厨|Michelin Chef', '餐厅主理人|Restaurateur'], st: { looks: 2, eq: 3 }, sib: [0, 3] },
    { id: 'archaeo', n: '考古世家|Family of Archaeologists', d: '你的摇篮放在一座发掘现场的帐篷里。妈妈说，你第一次笑，是看到一片陶片。|Your cradle sat in a tent at a dig. Mum says your first smile was at a shard of pottery.', vip: 0, w: [60000, 400000], inc: [40000, 120000], job: ['考古队长|Head of Excavations', '博物馆研究员|Museum Curator'], st: { smarts: 6 }, sib: [0, 2] },
    { id: 'firefighter', n: '消防员之家|A Firefighter\'s Family', d: '爸爸的消防头盔挂在门口。每次警报响起，妈妈都会站在窗边，一直等到他回来。|Dad\'s helmet hangs by the door. Every time the alarm sounds, Mum stands at the window until he comes home.', vip: 0, w: [30000, 200000], inc: [35000, 80000], job: ['消防站站长|Fire Station Chief', '消防员|Firefighter'], st: { health: 8, eq: 2 }, sib: [1, 3] },
    { id: 'teahouse', n: '百年茶庄|A Century-Old Tea Estate', d: '你家的茶山传了五代。清明前的第一锅茶，总是由家里最年长的人来炒。|The tea hills have passed down five generations. The first batch before Qingming is always fired by the eldest.', vip: 0, w: [500000, 5000000], inc: [80000, 400000], job: ['茶庄庄主|Tea Estate Owner', '制茶大师|Master Tea Maker'], st: { eq: 4, health: 3 }, sib: [1, 3] },
    { id: 'zoo', n: '动物园之家|The Zookeepers\' Family', d: '你家住在动物园后面的小楼里。每天早上叫醒你的是长臂猿。|You live in the little house behind the zoo. The gibbons wake you every morning.', vip: 0, w: [40000, 300000], inc: [35000, 90000], job: ['动物园园长|Zoo Director', '兽医|Veterinarian'], st: { eq: 4, health: 2 }, sib: [0, 2] }
  ].forEach(function (o) { if (!G.ORIGIN[o.id]) { G.ORIGINS.push(o); G.ORIGIN[o.id] = o; } });
  function OX(id, org, a, title, icon, t, o, w) { return E(id, a, title, icon, t, o, { w: w || 2.6, if: function (S2, p) { return p.origin === org && !p.jail && (a[0] >= 18 || !p.flags.heir); } }); }

  G.evs([
    /* pilot */
    OX('o8_pilot_cockpit', 'pilot', [5, 11], '驾驶舱|The Cockpit', '✈️', '登机前，爸爸偷偷带你进了驾驶舱。满墙的按钮在闪。|Before boarding, Dad sneaks you into the cockpit. A whole wall of switches glows.', [
      O('问每一个按钮是干什么的|Ask what every switch does', R('爸爸讲了二十分钟，乘务长来敲门才停。你记住了一半。|Dad explained for twenty minutes until the purser knocked. You remembered half of it.', { smarts: 4, par: 4 })),
      O('戴上爸爸的机长帽|Put on Dad\'s captain\'s hat', R('帽子遮住了你半张脸。照片挂在了家里的走廊上。|The hat covered half your face. The photo still hangs in the hall.', { happy: 6 }))
    ]),
    OX('o8_pilot_storm', 'pilot', [12, 17], '雷暴|The Thunderstorm', '⛈️', '新闻说一架航班在雷暴中备降。那是爸爸飞的航班。你等了四个小时，电话才响。|The news says a flight diverted through a thunderstorm. It\'s Dad\'s. Four hours pass before the phone rings.', [
      O('接起电话就哭了|Burst into tears when you pick up', R('爸爸在电话那头笑：“傻孩子，这就是我的工作。”|Dad laughed on the line: "Silly — this is my job."', { eq: 3, par: 6 })),
      O('问他当时怕不怕|Ask whether he was scared', R('“怕。但怕的时候，手更要稳。”你一辈子都记得这句话。|"Yes. But when you\'re scared, your hands must be steadier." You remembered it all your life.', { smarts: 2, eq: 4 }))
    ]),
    OX('o8_pilot_choice', 'pilot', [18, 24], '飞行学院|Flight School', '🛫', '航空公司的飞行学员招募开始了。家里人都在看你。|The airline\'s cadet-pilot intake opens. The whole family is looking at you.', [
      O('报名，成为第三代机长|Apply — be the third generation of captains', RC(function (c) { return .45 + c.p.st.health / 300 + c.p.st.smarts / 400; }, '你通过了体检和面试。爷爷把他的第一枚飞行徽章别在了你胸前。|You passed the medical and the interview. Grandpa pinned his first wings on your chest.', { happy: 12, fame: 2, flag: 'pilotCadet' }, '体检时你的视力没过关。你在操场上坐了一下午。|Your eyesight failed the medical. You sat on the sports field all afternoon.', { happy: -10 })),
      O('选择别的路|Choose another path', R('爸爸沉默了一会儿，说：“天空不会跑。想清楚了随时回来。”|Dad was quiet a moment. "The sky isn\'t going anywhere. Come back whenever you\'re sure."', { par: -2, eq: 2 }))
    ]),
    /* chef */
    OX('o8_chef_stock', 'chef', [6, 12], '第一锅高汤|Your First Stock', '🍲', '主厨让你守着一锅熬了八个小时的高汤。“千万别让它滚。”|The head chef leaves you minding a stock that\'s been going eight hours. "Whatever you do, don\'t let it boil."', [
      O('一直盯着它|Watch it the whole time', R('汤清得能看见锅底。主厨尝了一口，什么都没说，只是摸了摸你的头。|The stock was so clear you could see the bottom. The chef tasted it, said nothing, and ruffled your hair.', { eq: 3, sk: { cook: 6 } })),
      O('溜出去玩了一会儿|Slip out to play for a bit', R('回来时汤已经浑了。那天晚上的招牌菜换了。|By the time you got back it had clouded. That night the signature dish was changed.', { par: -4, eq: 2 }))
    ]),
    OX('o8_chef_critic', 'chef', [14, 20], '神秘食客|The Mystery Diner', '🕵️', '有人说米其林的评审今晚会来。厨房里一片死寂。|Word is the Michelin inspector is coming tonight. The kitchen is dead silent.', [
      O('主动帮忙摆盘|Volunteer to plate', RC(.6, '第二年，餐厅拿到了第三颗星。主厨说有一盘是你摆的。|The next year the restaurant won its third star. The chef said one of the plates was yours.', { fame: 3, happy: 10, sk: { cook: 4 } }, '你的手一抖，酱汁洒了。主厨重新做了一盘，一句话没说。|Your hand shook and the sauce spilled. The chef silently remade the plate.', { stress: 6 })),
      O('躲在后面洗碗|Hide at the sink', R('这一晚过去了。你洗了三百个盘子。|The night passed. You washed three hundred plates.', { health: -1, eq: 1 }))
    ]),
    OX('o8_chef_own', 'chef', [24, 45], '自己的招牌|A Place of Your Own', '🍽️', '你攒够了钱，可以开一家自己的小馆子了。|You\'ve saved enough to open a small place of your own.', [
      O('开一家只有八张桌子的小馆|Open an eight-table bistro', RC(.55, '小馆子三个月后就要提前两周订位了。|Within three months you were booked two weeks ahead.', { money: 30000, fame: 4, happy: 10 }, '开业半年，你亏光了积蓄。|Six months in, you\'d lost your savings.', { money: -20000, stress: 10 })),
      O('留在家里的厨房接班|Stay and take over the family kitchen', R('你成了主厨。菜单上第一次出现了你的名字。|You became head chef. Your name appeared on the menu for the first time.', { fame: 3, par: 6 }))
    ]),
    /* archaeologist */
    OX('o8_arch_shard', 'archaeo', [6, 12], '探方|The Trench', '🏺', '你在探方边上玩土，挖出来一块带花纹的东西。|Playing in the dirt beside the trench, you dig up something with a pattern on it.', [
      O('举起来大喊|Hold it up and shout', R('那是一块唐代的瓷片。它被收进了博物馆，标签上写着“发现者：一名儿童”。|It was a Tang dynasty shard. It went into the museum, labelled "Found by a child".', { smarts: 4, fame: 1, happy: 8 })),
      O('偷偷藏进口袋|Slip it into your pocket', R('妈妈发现后，带你把它交给了队长，然后给你上了一堂“文物属于谁”的课。|When Mum found out she took you to hand it in — then gave you a lecture on who artefacts belong to.', { karma: 2, smarts: 2 }))
    ]),
    OX('o8_arch_tomb', 'archaeo', [16, 30], '墓门|The Tomb Door', '🔦', '发掘队找到了一扇封闭了两千年的墓门。队长让你第一个往里看。|The team finds a tomb door sealed for two thousand years. The director lets you look in first.', [
      O('举着手电往里照|Shine your torch inside', R('手电的光扫过一排排陶俑，它们好像在看着你。你一辈子都忘不了那个画面。|Your torch swept over rows of clay figures that seemed to look back. You never forgot it.', { smarts: 5, happy: 10, fame: 2 })),
      O('把机会让给老队员|Give the honour to a veteran', R('老队员看了一眼，就哭了。他等了四十年。|The old excavator looked in and wept. He had waited forty years.', { eq: 5, karma: 3 }))
    ]),
    /* firefighter */
    OX('o8_fire_station', 'firefighter', [5, 11], '消防站的开放日|Open Day at the Station', '🚒', '爸爸让你坐在消防车的驾驶座上，拉响了警笛。|Dad lets you sit in the fire engine\'s driving seat and sound the siren.', [
      O('拉个不停|Keep pulling it', R('全站的人都笑了。那天你说长大要当消防员。|The whole station laughed. That day you announced you\'d be a firefighter.', { happy: 8 })),
      O('问爸爸怕不怕火|Ask Dad if he\'s afraid of fire', R('“怕。所以我们练得比谁都多。”|"Yes. That\'s why we train harder than anyone."', { eq: 3, par: 4 }))
    ]),
    OX('o8_fire_night', 'firefighter', [12, 18], '那一夜|That Night', '🔥', '凌晨三点，警报响了。爸爸出门前在你房门口停了一下。早上，他没有回来。直到中午，门开了。|At 3 a.m. the alarm sounds. Dad pauses at your door before he goes. Morning comes and he isn\'t back. At noon the door opens.', [
      O('冲过去抱住他|Run and hug him', R('他身上全是烟味。他救出来一个和你一样大的孩子。|He reeked of smoke. He had carried out a child your age.', { eq: 5, par: 8, happy: 6 })),
      O('假装若无其事|Act as if nothing happened', R('你转身回了房间，哭了很久。爸爸都知道。|You went back to your room and cried for a long time. Dad knew.', { eq: 3, stress: 4 }))
    ]),
    OX('o8_fire_join', 'firefighter', [18, 26], '入职考试|The Entrance Test', '🧯', '消防队招人了。体能测试要背着二十公斤爬六层楼。|The fire service is recruiting. The fitness test: six flights of stairs carrying twenty kilos.', [
      O('去考|Take it', RC(function (c) { return .4 + c.p.st.health / 250; }, '你第一个冲到了顶楼。爸爸把他的旧头盔送给了你。|You reached the top first. Dad gave you his old helmet.', { health: 4, happy: 10, karma: 3 }, '你在第五层停了下来。明年再来。|You stopped at the fifth floor. Next year, then.', { happy: -6, health: 2 })),
      O('不考了|Don\'t', R('妈妈松了一口气。|Mum breathed a sigh of relief.', { par: 3 }))
    ]),
    /* tea */
    OX('o8_tea_first', 'teahouse', [8, 14], '第一锅明前茶|The First Spring Batch', '🍵', '奶奶第一次让你站在炒茶的铁锅前。锅里两百多度。|For the first time Grandma lets you stand at the tea-firing wok. It\'s over two hundred degrees.', [
      O('用手翻茶|Turn the leaves by hand', R('你的手指烫起了泡，但那锅茶的香气，你记了一辈子。|Your fingers blistered — but you remembered the smell of that batch all your life.', { eq: 4, health: -1, sk: { cook: 3 } })),
      O('站在旁边看奶奶炒|Watch Grandma do it', R('奶奶的手在锅里翻飞，像在跳舞。|Grandma\'s hands flew through the leaves like a dance.', { eq: 2, smarts: 2 }))
    ]),
    OX('o8_tea_buyer', 'teahouse', [22, 50], '收购|The Buyout', '🏭', '一家大集团想收购你家的茶山，开价很高。|A conglomerate wants to buy the family tea hills, at a very good price.', [
      O('卖掉|Sell', R('钱很多。但第二年春天，你再也闻不到那股茶香了。|It was a lot of money. But the next spring, the smell of tea was gone from your life.', { money: 400000, happy: -8 })),
      O('不卖，做自己的品牌|Refuse, and build your own brand', RC(.55, '你家的茶上了国宴。|Your family\'s tea was served at a state banquet.', { fame: 6, money: 80000, happy: 10 }, '品牌做得很辛苦，但茶山还在。|Building the brand was hard — but the hills are still yours.', { stress: 6, eq: 3 }))
    ]),
    /* zoo */
    OX('o8_zoo_panda', 'zoo', [4, 10], '幼崽|The Cub', '🐼', '动物园里出生了一只小熊猫，妈妈让你帮它起名字。|A red panda cub is born at the zoo. Mum lets you name it.', [
      O('叫它“团子”|Call it Dumpling', R('“团子”成了动物园最受欢迎的明星。|Dumpling became the zoo\'s biggest star.', { happy: 8 })),
      O('用你的名字给它命名|Name it after yourself', R('全城的报纸上都写着你的名字——虽然是在说一只熊猫。|Your name was in every paper in town — though they were talking about a panda.', { happy: 6, fame: 1 }))
    ]),
    OX('o8_zoo_escape', 'zoo', [10, 16], '逃跑的猴子|The Escaped Monkey', '🐒', '一只猕猴溜出了笼子，钻进了游客区。你是唯一一个它认识的人。|A macaque slips its cage and gets into the visitor area. You\'re the only person it knows.', [
      O('拿香蕉慢慢靠近|Approach slowly with a banana', RC(.75, '它跳上了你的肩膀。饲养员说你比他们还厉害。|It hopped onto your shoulder. The keepers said you were better at this than they were.', { eq: 4, fame: 2, happy: 6 }, '它抢走香蕉，又跑了。|It snatched the banana and ran off again.', { happy: -2 })),
      O('去叫大人|Go and get an adult', R('他们用了两个小时才把它抓回来。|It took them two hours to catch it.', { smarts: 1 }))
    ]),
    OX('o8_zoo_vet', 'zoo', [18, 30], '老虎生病了|The Tiger Is Ill', '🐯', '园里的老东北虎不吃东西了。兽医说它老了。|The zoo\'s old Siberian tiger has stopped eating. The vet says it\'s old age.', [
      O('每天去陪它|Sit with it every day', R('它走的那天，你在笼子外面坐了一夜。后来你考了兽医。|The day it died you sat outside the enclosure all night. Later you trained as a vet.', { eq: 6, karma: 3, flag: 'zooVet' })),
      O('不忍心去看|Stay away — you can\'t bear it', R('妈妈说，每个在动物园长大的孩子都要学会告别。|Mum said every child raised in a zoo has to learn to say goodbye.', { eq: 3, happy: -4 }))
    ])
  ]);

  /* ======================= cadets, officers, generals ======================= */
  function cadet(S2, p) { return G.isCadet && G.isCadet(); }
  function officer(S2, p) { return p.mil && p.mil.off && !p.jail; }
  function general(S2, p) { return p.mil && p.mil.off && p.mil.rank >= 6 && !p.jail; }
  G.evs([
    E('c8_haircut', [17, 20], '剃头|The Haircut', '💈', '入学第一天，理发师三十秒就推完了你的头发。镜子里的人你有点不认识。|Day one at the academy: the barber clips you in thirty seconds. You barely recognise the face in the mirror.', [
      O('摸着光头笑了|Rub your scalp and laugh', R('你给家里发了一张照片：“新的我。”|You sent home a photo: "The new me."', { happy: 4, eq: 2 })),
      O('偷偷有点难过|Feel a little sad, privately', R('那天晚上，宿舍里有人哭了。不止一个。|That night someone in the dorm cried. More than one.', { eq: 3, stress: 3 }))
    ], { if: cadet, w: 4 }),
    E('c8_weekend', [18, 22], '周末请假|Weekend Pass', '🎫', '这个周末你终于拿到了外出证。只有八个小时。|You finally get a weekend pass. Eight hours.', [
      O('去吃一顿火锅|Go for hotpot', R('你一个人吃了三盘肥牛。|You ate three plates of beef by yourself.', { happy: 8 })),
      O('给家里打一个长长的电话|Make a long call home', function (c) { N.rel('father', 'mother').forEach(function (n) { if (n.alive) G.dPush('aff', N.addAff(n, 6)); }); H.fx(c, { happy: 5, eq: 2 }); return '妈妈说你的声音变了，变得像个大人了。|Mum said your voice had changed — you sounded grown up.'; }),
      O('留在学校加练|Stay and train', function (c) { if (c.p.cadet) { c.p.cadet.merit += 3; G.dPush('merit', 3); } H.fx(c, { health: 2 }); return '空荡荡的操场上，只有你和教官。他记住了你的名字。|On the empty parade ground it was just you and the instructor. He remembered your name.'; })
    ], { if: cadet, w: 3 }),
    E('c8_rivalry', [18, 22], '第一名|Top of the Class', '🥇', '期末考核，你和一个同学的成绩只差零点五分。|In the end-of-term assessment, you and a classmate are half a point apart.', [
      O('找他一起复盘|Review it together with him', function (c) { var n = N.make({ rel: 'friend', age: c.p.age, aff: 55, c: c.p.country }); n.alum = c.p.cadet ? c.p.cadet.acad : null; n.pin = 1; c.prm.n = n.name; H.fx(c, { eq: 4 }); return '你们从对手变成了最好的朋友。二十年后，{n}成了你的副手。|Rivals became best friends. Twenty years on, {n} was your second-in-command.'; }),
      O('下学期一定要超过他|Vow to beat him next term', function (c) { if (c.p.cadet) { c.p.cadet.merit += 4; G.dPush('merit', 4); } H.fx(c, { smarts: 3, stress: 4 }); return '下学期你拿了第一。他来向你道贺。|Next term you came top. He came over to congratulate you.'; })
    ], { if: cadet, w: 3 }),
    E('m8_parade', [25, 60], '阅兵|The Parade', '🎖️', '你被选中参加国庆阅兵。要在烈日下练半年正步。|You\'re picked for the national-day parade: six months of goose-step drill under the summer sun.', [
      O('全力以赴|Give it everything', function (c) { c.p.mil.merit += 8; G.dPush('merit', 8); H.fx(c, { fame: 4, health: 2, happy: 10 }); return '你走过天安门的那一刻，全家人在电视前站了起来。|As you marched past, your whole family stood up in front of the TV.'; }),
      O('推荐年轻人去|Recommend a younger officer', function (c) { c.p.mil.merit += 2; G.dPush('merit', 2); H.fx(c, { eq: 4, karma: 2 }); return '那个年轻人后来说，是你改变了他的一生。|That young officer later said you changed his life.'; })
    ], { if: function (S2, p) { return officer(S2, p) && p.country === 'cn'; }, w: 1.2 }),
    E('m8_frontier', [23, 50], '边防哨所|The Border Post', '🏔️', '你被派到海拔五千米的边防哨所。这里一年有八个月下雪。|You\'re posted to a border outpost at 5,000 metres. Snow eight months a year.', [
      O('坚守两年|Hold the post for two years', function (c) { c.p.mil.merit += 12; G.dPush('merit', 12); H.fx(c, { health: -6, eq: 5, karma: 4 }); return '你离开时，哨所的界碑上多了一道你刻的线。|When you left, a line you had carved was on the boundary stone.'; }),
      O('申请调回|Apply for a transfer back', function (c) { c.p.mil.merit = Math.max(0, c.p.mil.merit - 3); G.dPush('merit', -3); H.fx(c, { happy: 3 }); return '申请批了。但你常常梦见那里的星空。|It was approved. But you often dreamed of the stars up there.'; })
    ], { if: officer, w: 1.2 }),
    E('m8_rescue', [22, 55], '地震|The Earthquake', '🏚️', '凌晨发生了大地震。你的部队第一批进入灾区。|A major earthquake strikes before dawn. Your unit is first into the disaster zone.', [
      O('带人徒手挖|Lead your men digging by hand', function (c) { c.p.mil.merit += 10; G.dPush('merit', 10); H.fx(c, { fame: 5, karma: 6, health: -3 }); return '你们从废墟里救出了十一个人。最后一个是个三岁的孩子。|You pulled eleven people from the rubble. The last was a three-year-old.'; }),
      O('坐镇指挥|Command from the post', function (c) { c.p.mil.merit += 6; G.dPush('merit', 6); H.fx(c, { smarts: 2, stress: 6 }); return '你七十二小时没合眼，把每一支队伍都派到了最需要的地方。|You didn\'t sleep for seventy-two hours, sending every team where it was most needed.'; })
    ], { if: officer, w: 1 }),
    E('g8_checkup', [45, 80], '将军的体检|A General\'s Check-up', '🩺', '每年一次的高干体检。医生拿着你的片子看了很久。|The annual senior officers\' medical. The doctor studies your scan for a long time.', [
      O('问到底怎么了|Ask what\'s wrong', RC(.75, '“没什么大问题，就是该少熬夜了。”|"Nothing serious. You just need to stop working through the night."', { health: 4 }, '早期发现了一个小问题，及时处理了。|An early problem was caught and treated in time.', { health: -2, happy: -3 })),
      O('不在乎，工作要紧|Shrug it off — work comes first', R('秘书把下一年的体检提前了半年。|Your aide moved next year\'s check-up forward six months.', { stress: 3 }))
    ], { if: general, w: 2 }),
    E('g8_director', [45, 75], '演习总导演|Director of Exercises', '🗺️', '你被任命为一场跨战区联合演习的总导演。|You\'re appointed director of a cross-theatre joint exercise.', [
      O('让红蓝双方真刀真枪地打|Let red and blue fight for real', function (c) { c.p.mil.merit += 10; G.dPush('merit', 10); H.fx(c, { smarts: 3, stress: 8 }); return '演习暴露了很多问题，上级说这才是真正的演习。|The exercise exposed many weaknesses. Your superiors said that\'s what an exercise is for.'; }),
      O('按剧本稳妥推进|Follow the script, play it safe', function (c) { c.p.mil.merit += 3; G.dPush('merit', 3); H.fx(c, { stress: -2 }); return '一切顺利，掌声很响。|All went smoothly; the applause was loud.'; })
    ], { if: general, w: 2 }),
    E('g8_visitor', [45, 80], '外宾|Foreign Visitors', '🤝', '一个外国军事代表团来访，由你负责接待。|A foreign military delegation visits; you are their host.', [
      O('带他们看最好的部队|Show them your best unit', R('对方的将军在留言簿上写了很长一段话。|Their general wrote a long entry in the visitors\' book.', { fame: 3, eq: 2 })),
      O('只谈礼节，不多说话|Keep to protocol, say little', R('他们走后，上级说你分寸把握得很好。|After they left, your superiors praised your discretion.', { smarts: 2 }))
    ], { if: general, w: 1.5 }),
    E('g8_oldcomrade', [50, 90], '老战友|An Old Comrade', '🫡', '一个当年一起当兵的老战友找到你，他下岗了，日子过得很难。|A comrade from your early days finds you. He has lost his job and is struggling.', [
      O('自掏腰包帮他|Help him from your own pocket', R('他握着你的手，半天说不出话。|He held your hand and couldn\'t speak for a long while.', { money: -20000, karma: 6, happy: 4 })),
      O('帮他介绍一份工作|Find him a job', R('他在一家保安公司当了队长，干得很好。|He became a team leader at a security firm and did well.', { karma: 4, eq: 2 }))
    ], { if: function (S2, p) { return (p.mil && p.mil.rank >= 5) || p.flags.wasGeneral; }, w: 1.5 })
  ]);

  /* ======================= grandparents ======================= */
  function gp(c) { var L = N.rel('grand').filter(function (n) { return n.alive; }); if (!L.length) return false; var g = G.pick(L); c.prm.gid = g.id; c.prm.g = g.name; c.prm.gr = N.relName(g); }
  G.evs([
    E('gp8_story', [5, 12], '老照片|Old Photographs', '📷', '{gr}{g}翻出了一本发黄的相册，指着一个穿军装的年轻人说：“这是我。”|Your {gr}, {g}, brings out a yellowed album and points to a young person in uniform: "That\'s me."', [
      O('缠着听故事|Beg for the story', function (c) { aff(c, 'gid', 8); H.fx(c, { smarts: 2, eq: 3, happy: 4 }); return '那天下午，{g}讲了一个你在课本上从没读到过的故事。|That afternoon {g} told you a story you\'d never read in any textbook.'; }),
      O('拍下来发给同学|Snap a photo for your friends', function (c) { aff(c, 'gid', 2); H.fx(c, { happy: 2 }); return '同学们都说你家{gr}年轻时好帅。|Your friends all said your {gr} was so good-looking back then.'; })
    ], { prep: gp, w: 2 }),
    E('gp8_secret', [6, 12], '藏起来的零花钱|Secret Pocket Money', '🧧', '{gr}{g}趁爸妈不注意，往你口袋里塞了一张钱：“别告诉你爸妈。”|When your parents aren\'t looking, your {gr} {g} slips money into your pocket: "Don\'t tell your parents."', [
      O('收下，偷偷买零食|Take it and buy sweets', function (c) { aff(c, 'gid', 5); H.fx(c, { happy: 6, money: 20 }); return '那是你吃过最好吃的辣条。|They were the best snacks you ever had.'; }),
      O('存起来|Save it', function (c) { aff(c, 'gid', 5); H.fx(c, { smarts: 1, money: 20 }); return '你把钱放进了存钱罐，罐子上写着“{g}给的”。|You put it in your piggy bank, labelled "from {g}".'; })
    ], { prep: gp, w: 2 }),
    E('gp8_cook', [8, 16], '外婆的菜|Grandma\'s Cooking', '🥟', '{gr}{g}说要教你做她的拿手菜，“等我不在了，你还能吃到这个味道。”|Your {gr}, {g}, wants to teach you her signature dish: "So you\'ll still have this taste when I\'m gone."', [
      O('认认真真地学|Learn it properly', function (c) { aff(c, 'gid', 8); H.fx(c, { eq: 3, sk: { cook: 6 } }); return '很多年以后，你在异乡做出了那个味道，一边吃一边哭。|Years later, far from home, you made that dish and cried as you ate.'; }),
      O('撒娇说“你要一直做给我吃”|Insist she\'ll just have to keep cooking for you', function (c) { aff(c, 'gid', 6); H.fx(c, { happy: 4 }); return '{g}笑得合不拢嘴。|{g} couldn\'t stop smiling.'; })
    ], { prep: gp, w: 1.5 }),
    E('gp8_hospital', [12, 40], '病房|The Hospital Room', '🏥', '{gr}{g}住院了。护士说老人一直在问你什么时候来。|Your {gr} {g} is in hospital. The nurse says they keep asking when you\'ll come.', [
      O('请假去陪护|Take time off to stay with them', function (c) { aff(c, 'gid', 12); var n = npc(c.prm.gid); if (n) n.health = Math.min(100, (n.health || 50) + 6); H.fx(c, { eq: 4, happy: -2, karma: 3 }); return '你在病床边读报纸给{g}听。{g}握着你的手睡着了。|You read the paper aloud at the bedside. {g} fell asleep holding your hand.'; }),
      O('打个视频电话|Make a video call', function (c) { aff(c, 'gid', 3); H.fx(c, { happy: 1 }); return '{g}在屏幕那头一直说“忙你的，别担心”。|On screen, {g} kept saying "You\'re busy, don\'t worry about me."'; })
    ], { prep: function (c) { var L = N.rel('grand').filter(function (n) { return n.alive && N.age(n) >= 70; }); if (!L.length) return false; var g = G.pick(L); c.prm.gid = g.id; c.prm.g = g.name; c.prm.gr = N.relName(g); }, w: 1.5 }),
    E('gp8_dance', [16, 30], '旧情书|The Old Love Letter', '💌', '整理旧物时，你翻到了{gr}{g}年轻时写的一封没寄出去的情书。收信人是一个你从没听过的名字。|Clearing out old things, you find a love letter your {gr} {g} wrote long ago and never sent — to a name you have never heard.', [
      O('悄悄放回去|Quietly put it back', function (c) { H.fx(c, { eq: 3 }); return '有些故事，就让它留在抽屉里吧。|Some stories should stay in the drawer.'; }),
      O('拿去问{g}|Ask {g} about it', function (c) { aff(c, 'gid', 6); H.fx(c, { eq: 4, happy: 3 }); return '{g}看着那封信，笑了很久：“那时候我才十七岁。”然后讲了一个下午。|{g} looked at the letter and smiled a long time. "I was seventeen." Then the story took all afternoon.'; })
    ], { prep: gp, w: 1 })
  ]);

  /* ======================= pets ======================= */
  function pet(c) { var L = S().assets.pets; if (!L.length) return false; var x = G.pick(L); c.prm.pid = x.id; c.prm.pn = x.name; }
  function petObj(c) { return S().assets.pets.filter(function (x) { return x.id === c.prm.pid; })[0]; }
  G.evs([
    E('pt8_door', [8, 90], '门口的等待|Waiting by the Door', '🐾', '邻居告诉你，你不在家的时候，{pn}每天下午五点都会准时蹲在门口等你。|The neighbour tells you that while you\'re out, {pn} sits by the door at five o\'clock sharp every afternoon, waiting for you.', [
      O('以后早点回家|Start coming home earlier', function (c) { var x = petObj(c); if (x) x.aff = Math.min(100, (x.aff || 60) + 10); H.fx(c, { happy: 6, stress: -4 }); return '第二天五点，你推开门，{pn}扑了上来。|At five the next day you opened the door and {pn} leapt at you.'; }),
      O('给它装一个宠物摄像头|Install a pet camera', function (c) { H.fx(c, { happy: 3, money: -150 }); return '你在公司偷偷看{pn}在家打盹，看了一下午。|At work you watched {pn} napping at home all afternoon.'; })
    ], { prep: pet, w: 1.6 }),
    E('pt8_old', [10, 95], '它老了|Getting Old', '🦮', '{pn}走路慢了，跳不上沙发了，嘴边的毛也白了。|{pn} walks slowly now, can\'t jump onto the sofa, and the fur round the muzzle has gone white.', [
      O('给它做一个小台阶|Build it a little ramp', function (c) { var x = petObj(c); if (x) { x.aff = Math.min(100, (x.aff || 60) + 8); x.health = Math.min(100, (x.health || 70) + 4); } H.fx(c, { eq: 3, happy: 3 }); return '{pn}第一次自己走上沙发的时候，回头看了你一眼。|The first time {pn} walked up onto the sofa alone, it turned to look at you.'; }),
      O('多拍一些照片|Take more photos', function (c) { H.fx(c, { happy: 2, eq: 2 }); return '你的相册里，有一千多张{pn}的照片。|Your album holds over a thousand photos of {pn}.'; })
    ], { prep: function (c) { var L = S().assets.pets.filter(function (x) { var d = G.petDef(x); return S().year - x.by >= d.life * .7; }); if (!L.length) return false; var x = G.pick(L); c.prm.pid = x.id; c.prm.pn = x.name; }, w: 2 }),
    E('pt8_sitter', [18, 95], '宠物保姆的消息|A Message from the Sitter', '📱', '宠物保姆发来一段视频：{pn}学会了一个新把戏。|The pet sitter sends a video: {pn} has learned a new trick.', [
      O('给保姆发个红包|Send the sitter a tip', function (c) { H.fx(c, { happy: 4, money: -100, karma: 1 }); return '保姆回了一长串感谢。{pn}看起来很开心。|The sitter replied with a long thank-you. {pn} looked very happy.'; }),
      O('有点吃醋|Feel a little jealous', function (c) { var x = petObj(c); if (x) x.aff = Math.min(100, (x.aff || 60) + 4); H.fx(c, { happy: 2 }); return '那天你推掉了应酬，早早回家陪{pn}。|That evening you skipped the dinner engagement and went home early to {pn}.'; })
    ], { prep: function (c) { var L = S().assets.pets.filter(function (x) { return x.sitter; }); if (!L.length) return false; var x = G.pick(L); c.prm.pid = x.id; c.prm.pn = x.name; }, w: 2 })
  ]);

  /* ======================= royals, the Evergreen clinic, the veteran abroad ======================= */
  function royalNear(S2, p) { return N.all(function (n) { return n.alive && (n.tags || [])[0] === 'royal' && n.rel !== 'kin'; }).length > 0; }
  G.evs([
    E('r8_invite', [18, 70], '宫里的请柬|An Invitation from the Palace', '✉️', '一封盖着王室徽章的请柬寄到了你家：王室邀请你参加夏宫的私人晚宴。|An envelope with a royal crest arrives: you are invited to a private dinner at the summer palace.', [
      O('盛装出席|Go in your finest', function (c) { var mons = G.CLIST.filter(function (x) { return G.C[x].mon && x !== c.p.country; }); var cc = mons.length ? G.pick(mons) : 'gb'; var g = c.p.orient === 'gay' ? c.p.g : c.p.g === 'm' ? 'f' : 'm'; var n = N.mkRomantic({ rel: 'admirer', tags: ['royal'], g: g, c: cc, love: G.ri(35, 60), aff: 30, age: c.p.age + G.ri(-5, 5) }); n.tags = ['royal']; n.c = cc; n.job = G.L(g === 'm' ? '{c}王子|Prince of {c}' : '{c}公主|Princess of {c}', { c: G.C[cc].n }); n.pin = 1; c.prm.n = n.name; H.fx(c, { fame: 3, happy: 8 }); return '晚宴上，{n}一直在看你。散场时，{n}的侍从塞给你一张写着私人电话的卡片。|All through dinner, {n} kept looking at you. As you left, an aide slipped you a card with a private number.'; }),
      O('婉拒|Decline politely', R('你回了一封措辞得体的信。|You sent a gracious reply.', { eq: 2 }))
    ], { if: function (S2, p) { return G.status && G.status() >= 2 && !p.jail && !N.spouse(); }, w: .8 }),
    E('r8_paparazzi', [18, 70], '狗仔|The Paparazzi', '📸', '你和王室成员约会的照片登上了欧洲所有小报的头版。|Photos of you on a date with a royal are on the front of every European tabloid.', [
      O('大方回应|Respond with grace', R('一家大报写道：“这也许是近年来最般配的一对。”|A broadsheet wrote: "Perhaps the best-matched couple in years."', { fame: 8, eq: 2 })),
      O('躲起来|Lie low', R('你在家里待了三个星期。|You stayed indoors for three weeks.', { fame: 4, stress: 8 }))
    ], { if: function (S2, p) { var pt = N.partner && N.partner(); return !!(pt && (pt.tags || [])[0] === 'royal'); }, w: 2 }),
    E('ev8_clinic', [55, 110], '长青诊所的来信|A Letter from the Evergreen Clinic', '🧬', '瑞士的长青诊所给你寄来一份年度报告：你的生理年龄比实际年龄年轻。|The Evergreen clinic in Switzerland sends your annual report: your biological age is below your real age.', [
      O('给诊所捐一笔研究经费|Fund their research', R('诊所用你的名字命名了一间实验室。|The clinic named a laboratory after you.', { money: -500000, fame: 4, karma: 4 })),
      O('把报告裱起来|Frame the report', R('你把它挂在了书房里，每天都看一眼。|You hung it in your study and glanced at it every day.', { happy: 6 }))
    ], { if: function (S2, p) { return (p.flags.lifeExt || 0) > 0 && !p.jail; }, w: 2 }),
    E('vt8_homesick', [30, 95], '回不去的故乡|A Home You Can\'t Go Back To', '🌙', '中秋节，你在异国的公寓里看着家乡的直播。你知道，自己这辈子都回不去了。|Mid-Autumn. In your apartment abroad you watch a livestream from home. You know you can never go back.', [
      O('包一顿家乡的饺子|Make dumplings the way they do at home', R('面粉落了一桌。你一个人吃完了一整盘。|Flour everywhere. You ate the whole plate alone.', { happy: 3, eq: 3 })),
      O('给老家的亲人打电话|Call family back home', function (c) { N.rel('father', 'mother', 'sibling').forEach(function (n) { if (n.alive) G.dPush('aff', N.addAff(n, 5)); }); H.fx(c, { happy: 4, stress: -3 }); return '电话那头，大家抢着和你说话。没有人问你什么时候回来。|Everyone fought to talk to you. Nobody asked when you\'d be home.'; })
    ], { if: function (S2, p) { return p.flags.noReturnCN && p.country !== 'cn'; }, w: 2.5 }),
    E('vt8_contact', [30, 90], '陌生的电话|A Call from a Stranger', '☎️', '一个自称“老乡”的人打来电话，说想请你吃饭，聊聊你当年在部队的事。|A man calling himself "a friend from home" phones, wanting dinner and a chat about your old army days.', [
      O('直接挂断|Hang up', R('你换了电话号码。|You changed your number.', { stress: 3, karma: 2 })),
      O('报告当地警方|Report it to the local police', R('警察记录了下来。他们说这种事不是第一次。|The police took notes. They said it wasn\'t the first time.', { stress: 2, karma: 3 }))
    ], { if: function (S2, p) { return p.flags.noReturnCN && p.country !== 'cn' && !p.spy; }, w: 1.2 })
  ]);

  /* ======================= achievements ======================= */
  [
    { id: 'cadet_top', i: '🎓', n: '优秀学员|Distinguished Cadet', d: '以优秀学员身份从军校毕业|Graduate from a military academy with distinction', f: function (S2, p) { return !!(p.mil && p.mil.acadTop); } },
    { id: 'alum_net', i: '🎖️', n: '校友网|The Old Boys\' Network', d: '结识3位军校校友|Know three alumni of your academy', f: function (S2, p) { return N.all(function (n) { return n.alive && n.alum; }).length >= 3 && !!(p.mil && p.mil.acad); } },
    { id: 'evergreen', i: '🧬', n: '长青|Evergreen', d: '通过长青计划延长寿命|Extend your life with the Evergreen Programme', f: function (S2, p) { return (p.flags.lifeExt || 0) > 0; } },
    { id: 'royal_date', i: '👑', n: '王室恋曲|A Royal Romance', d: '和王子或公主恋爱|Date a prince or princess', f: function (S2, p) { var pt = N.partner && N.partner(); return !!(pt && (pt.tags || [])[0] === 'royal'); } },
    { id: 'pet_sitter', i: '🧑‍🍼', n: '毛孩子的保姆|A Nanny for the Pets', d: '为宠物请一位保姆|Hire a pet sitter', f: function (S2) { return S2.assets.pets.some(function (x) { return x.sitter; }); } },
    { id: 'four_grand', i: '👴', n: '四世同堂|Four Generations', d: '十岁时四位祖辈都健在|Have all four grandparents alive at ten', f: function (S2, p) { return p.age >= 10 && p.age <= 12 && N.rel('grand').filter(function (n) { return n.alive; }).length >= 4; } },
    { id: 'no_return', i: '🌙', n: '天涯|Far from Home', d: '作为退役军人移民海外|Emigrate abroad as a veteran', f: function (S2, p) { return !!p.flags.noReturnCN; } }
  ].forEach(function (a) { if (!G.ACH.some(function (x) { return x.id === a.id; })) G.ACH.push(a); });
})();
