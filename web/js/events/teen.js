/* Teen events (13-19) */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  G.evs([
    E('t_acne', [12, 17], '青春痘|Breakouts', '😖', '你的脸上冒出了好多青春痘。|Your face is covered in pimples.', [
      O('用手挤|Pop them', R('留下了几个痘印。|It left a few scars.', { looks: -2, happy: -2 })),
      O('去看皮肤科|See a dermatologist', R('涂了一个月药膏，皮肤好多了。|A month of cream cleared things up.', { looks: 1, money: -40 })),
      O('顺其自然|Let it be', R('过了一阵子，痘痘自己消了。|After a while they cleared on their own.', {}))
    ]),
    E('t_crush', [13, 17], '心动|Butterflies', '💓', '你发现自己总是忍不住偷看{n}。|You keep catching yourself stealing glances at {n}.', [
      O('鼓起勇气搭话|Work up the nerve to say hi', function (c) { var n = c.npc; N.addAff(n, 10); N.addLove(n, 8); c.add('happy', 4); n.rel = 'crush'; n.pin = 1; return '你们聊了几句，{n}对你笑了笑。|You chatted a bit, and {n} smiled at you.'; }),
      O('写一封匿名情书|Write an anonymous letter', RC(.5, '{n}到处问是谁写的，脸都红了。|{n} asked everyone who wrote it, blushing.', { happy: 4 }, '情书被同学抢去当众念了出来……|A classmate grabbed it and read it aloud to everyone...', { happy: -10 })),
      O('藏在心里|Keep it to yourself', R('这份喜欢，你谁也没告诉。|You told no one about your feelings.', { happy: -1 }))
    ], { prep: function (c) { var n = N.mkRomantic({ rel: 'classmate', love: G.ri(5, 40), aff: 15 }); c.npc = n; c.prm.n = n.name; } }),
    E('t_confessed', [13, 17], '纸条告白|A Confession Note', '💌', '同班的{n}红着脸塞给你一张纸条：“我喜欢你。”|{n} from your class blushes and hands you a note: "I like you."', [
      O('答应|Say yes', function (c) { G.love.becomeLovers(c.npc); c.add('happy', 8); return '你们开始了青涩的早恋。|A sweet, innocent first romance begins.'; }),
      O('婉拒|Gently decline', function (c) { c.npc.rel = 'classmate'; N.addAff(c.npc, -5); return '你说想先专心学习。|You said you want to focus on school for now.'; })
    ], { prep: function (c) { if (N.partner()) return false; var n = N.mkRomantic({ rel: 'admirer', love: G.ri(55, 80), aff: 30 }); c.npc = n; c.prm.n = n.name; }, w: function (S, p) { return .4 + p.st.looks / 100; } }),
    E('t_caught_love', [13, 17], '早恋被抓|Busted', '🚨', '老师发现你在谈恋爱，叫来了家长。|A teacher discovered your relationship and called your parents.', [
      O('坚持在一起|Refuse to break up', R('你和爸妈大吵一架，冷战了一个月。|You fought with your parents and gave them the silent treatment for a month.', { par: -8, happy: -4, part: 8 })),
      O('答应先分开|Agree to split for now', function (c) { var pt = N.partner(); if (pt) G.love.breakup(pt); H.fx(c, { par: 3 }); return '你们约好考上大学后再说。|You agreed to revisit things after the exams.'; })
    ], { if: function (S, p) { return N.partner() && H.hasPar() && H.student(); } }),
    E('t_rebel', [13, 17], '叛逆期|Rebellious Phase', '🤘', '你觉得爸妈什么都不懂，处处跟他们对着干。|You feel your parents understand nothing and defy them at every turn.', [
      O('染头发打耳洞|Dye your hair and get piercings', R('你顶着一头绿毛回家，爸爸差点心脏病发。|You came home with green hair; Dad nearly had a heart attack.', { happy: 6, par: -6, looks: G.ri(-2, 3) })),
      O('离家出走|Run away from home', RC(.6, '你在朋友家住了两晚，最后还是回家了。|You crashed at a friend\'s for two nights before coming home.', { par: -10, happy: 2 }, '你在外面流浪了几天，被警察送回了家。|You wandered for days before police brought you home.', { par: -10, happy: -8, health: -3 })),
      O('和爸妈好好谈谈|Have a real talk with your parents', R('那晚你们聊到很晚，彼此理解了很多。|You talked late into the night and understood each other better.', { par: 8, eq: 3 }))
    ], { if: H.hasPar }),
    E('t_netcafe', [12, 18], '通宵|All-Nighter', '🖥️', '朋友约你去网吧通宵打游戏。|Friends invite you to an all-night gaming session at the internet café.', [
      O('去！|I\'m in!', RC(.7, '你们打到天亮，开心极了。|You played until sunrise. Pure joy.', { happy: 7, night: 20, sk: { game: 4 } }, '爸妈半夜杀到网吧，把你揪了回去。|Your parents stormed the café at midnight and dragged you home.', { par: -6, happy: -5 })),
      O('算了|Pass', R('你在家早早睡了。|You went to bed early.', { health: 1 }))
    ], { if: function (S) { return S.year >= 1995; } }),
    E('t_firstdrink', [14, 18], '第一次喝酒|First Drink', '🍺', '聚会上，朋友递给你一罐啤酒。|At a party, a friend hands you a beer.', [
      O('喝了|Drink it', RC(.7, '有点苦，但你觉得自己像个大人了。|Bitter, but you felt grown-up.', { happy: 3, drink: 8 }, '你喝多了，吐了朋友一身。|You drank too much and threw up on your friend.', { happy: -5, drink: 5 })),
      O('拒绝|Say no', R('你喝了一瓶可乐。|You had a soda instead.', {}))
    ]),
    E('t_cig', [13, 18], '一支烟|A Cigarette', '🚬', '学校后面，几个同学在抽烟，递给你一根。|Behind the school, some classmates are smoking and offer you one.', [
      O('试一试|Try it', R('你被呛得眼泪直流，但还是又抽了第二根。|You coughed till you cried — then took a second one.', { smoke: 12, happy: 2 })),
      O('拒绝|Refuse', R('他们笑你胆小，你没理他们。|They called you a chicken; you ignored them.', { eq: 1 }))
    ]),
    E('t_pills', [15, 25], '来路不明的药丸|Mystery Pills', '💊', '派对上，有人塞给你几颗来路不明的药丸，说“很嗨”。|At a party, someone presses some unknown pills into your hand, saying they\'re "a great time."', [
      O('坚决拒绝|Firmly refuse', R('你把药丸扔进了垃圾桶，离开了派对。|You threw them in the trash and left the party.', { karma: 2 })),
      O('吃了|Take them', RC(.6, '你玩得很疯，但第二天头痛欲裂，心里后怕。|You partied wildly but woke with a splitting headache and a sense of dread.', { happy: 4, health: -8, heat: 5 }, '你突然昏倒，被送进了急诊室。|You collapsed and were rushed to the ER.', { health: -25, happy: -10, heat: 10 }))
    ], { bad: 1 }),
    E('t_idol', [12, 22], '追星|Fangirling / Fanboying', '🌟', '你疯狂迷上了一个明星。|You\'re obsessed with a celebrity.', [
      O('花光零花钱买周边|Blow your money on merch', R('你的房间贴满了海报。|Your room is plastered with posters.', { happy: 7, money: -80 })),
      O('排队去看演唱会|Camp out for concert tickets', R('你在演唱会现场哭成了泪人。|You cried your eyes out at the concert.', { happy: 10, money: -150 })),
      O('理智追星|Be a sensible fan', R('偶像的努力激励着你。|Your idol\'s hard work inspires you.', { perf: 2, happy: 3 }))
    ]),
    E('t_shoes', [13, 19], '名牌球鞋|Designer Sneakers', '👟', '同学们都穿名牌球鞋，你也想要一双。|All your classmates wear designer sneakers. You want a pair too.', [
      O('缠着爸妈买|Beg your parents', function (c) { var ps = H.par().filter(function (n) { return n.wealth > c.$(1000); }); if (ps.length && G.ch(.6)) { ps[0].wealth -= c.$(200); H.fx(c, { happy: 6, looks: 1 }); return '爸妈咬咬牙给你买了。|Your parents gritted their teeth and bought them.'; } H.fx(c, { happy: -4, par: -2 }); return '爸妈说太贵了。|Your parents said they\'re too expensive.'; }),
      O('自己打工攒钱|Work and save up', R('你打了一个暑假的工，买到了鞋。|You worked all summer and bought them yourself.', { eq: 2, happy: 5 })),
      O('买双高仿|Buy knockoffs', RC(.5, '没人看出来。|Nobody could tell.', { happy: 3 }, '被同学一眼认出是假货，被嘲笑了一学期。|A classmate spotted the fakes; you were mocked all semester.', { happy: -8 }))
    ]),
    E('t_viral', [13, 30], '视频火了|Gone Viral', '📱', '你随手发的一条视频突然在网上火了！|A video you posted on a whim suddenly goes viral!', [
      O('趁热打铁，继续拍|Strike while it\'s hot', function (c) { H.fx(c, { fame: 8, happy: 8 }); if (!c.p.fc && G.S.year >= 2008 && G.ch(.5)) { G.fame.start('streamer', { fans: G.ri(20000, 200000) }); return '你开始做网红，涨了好多粉！|You became an influencer and gained tons of followers!'; } return '你小火了一把。|You had your fifteen minutes of fame.'; }),
      O('删掉，太尴尬了|Delete it — too embarrassing', R('你删了视频，但截图已经满天飞了。|You deleted it, but screenshots were everywhere.', { fame: 2, happy: -3 }))
    ], { good: 1, if: function (S) { return S.year >= 2008; } }),
    E('t_scout', [13, 24], '星探|Talent Scout', '📸', '一个星探在街上拦住了你：“你有没有兴趣当艺人？”|A talent scout stops you on the street: "Ever thought about entertainment?"', [
      O('签约！|Sign!', function (c) { var p = c.p, idol = ['kr', 'jp', 'cn', 'th'].indexOf(p.country) >= 0 && p.age <= 22; G.fame.start(idol ? 'idol' : G.pick(['actor', 'model', 'singer'])); H.fx(c, { happy: 10, fame: 3 }); return '你踏入了娱乐圈！|You stepped into show business!'; }),
      O('可能是骗子|Probably a scam', R('你没理他。|You walked away.', {}))
    ], { good: 1, w: function (S, p) { return p.st.looks > 70 ? 2 : .1; }, if: function (S, p) { return !p.fc && p.st.looks > 60; } }),
    E('t_olympiad', [13, 18], '竞赛保送|Competition Fast-Track', '🥇', '你在学科竞赛中获得了一等奖，名校向你抛出了保送的橄榄枝！|You won first prize in an academic olympiad, and a top university offers direct admission!', [
      O('接受保送|Accept', function (c) { c.p.flags.guaranteed = 1; H.fx(c, { happy: 12, fame: 3 }); return '你提前锁定了名校名额，高考可以放轻松了。|You secured a top-university spot early — the big exam will be easy.'; }),
      O('冲刺更好的学校|Aim even higher', R('你决定参加高考，冲击最顶尖的学校。|You decide to take the exam and aim for the very best.', { perf: 5, stress: 8 }))
    ], { good: 1, w: function (S, p) { return p.st.smarts > 80 ? 1.5 : 0; }, if: function (S, p) { return H.student() && p.edu.stage === 'high'; } }),
    E('t_mock', [16, 18], '模拟考|Mock Exam', '📝', '模拟考成绩出来了。|The mock exam results are in.', [
      O('看看排名|Check your rank', function (c) { var pf = c.p.edu.perf; if (pf > 75) { H.fx(c, { happy: 6 }); return '你名列年级前茅！|You\'re near the top of your year!'; } if (pf > 45) { H.fx(c, { stress: 5 }); return '成绩中等，还需努力。|Middle of the pack. More work needed.'; } H.fx(c, { happy: -6, stress: 10 }); return '你排在倒数，爸妈脸色很难看。|You\'re near the bottom; your parents look grim.'; })
    ], { if: function (S, p) { return p.edu.stage === 'high'; } }),
    E('t_anxiety', [16, 18], '考前焦虑|Exam Anxiety', '😰', '离大考只剩几个月了，你每天晚上都失眠。|The big exam is months away, and you can\'t sleep at night.', [
      O('跑步减压|Run it off', R('你每天跑五公里，状态好多了。|You ran 5K daily and felt much better.', { stress: -15, fit: 3 })),
      O('找心理老师聊聊|Talk to the school counselor', R('老师的话让你平静了下来。|The counselor\'s words calmed you down.', { stress: -12, eq: 2 })),
      O('硬扛|Push through', R('你顶着黑眼圈继续刷题。|You kept grinding through practice tests with dark circles.', { stress: 10, perf: 3, health: -2 }))
    ], { if: function (S, p) { return p.edu.stage === 'high' && p.edu.grade >= 2; } }),
    E('t_prom', [16, 18], '毕业舞会|Prom Night', '🕺', '毕业舞会就要到了，你还没有舞伴。|Prom is coming, and you don\'t have a date yet.', [
      O('邀请喜欢的人|Ask your crush', function (c) { var n = N.mkRomantic({ rel: 'classmate', love: G.ri(10, 50), aff: 20 }); c.prm.n = n.name; if (G.ch(N.attract(n) + .1)) { N.addLove(n, 15); H.fx(c, { happy: 10 }); return '{n}答应了！那晚你们跳了一整夜的舞。|{n} said yes! You danced all night.'; } H.fx(c, { happy: -6 }); return '{n}已经有舞伴了。|{n} already had a date.'; }),
      O('和朋友们一起去|Go with friends', R('你们玩得很疯。|You had a wild time together.', { happy: 7 })),
      O('不去了|Skip it', R('你在家看了一晚上电影。|You watched movies at home.', {}))
    ], { if: function (S, p) { return H.west(S, p) && p.edu.stage === 'high'; } }),
    E('t_job1', [14, 18], '第一份兼职|First Part-time Job', '🧑‍🍳', '你在快餐店找到了一份暑期工。|You landed a summer job at a fast-food place.', [
      O('认真干|Work hard', R('店长很喜欢你，月底还给了奖金。|The manager liked you and gave you a bonus.', { money: 600, eq: 2 })),
      O('偷懒|Slack off', RC(.5, '你混过了一个暑假，拿到了工资。|You coasted through the summer and got paid.', { money: 400 }, '你被炒了鱿鱼。|You got fired.', { happy: -4, money: 100 }))
    ]),
    E('t_blamed', [13, 18], '被诬陷作弊|Falsely Accused of Cheating', '😠', '考了高分的你，被老师怀疑作弊。|After acing a test, the teacher accuses you of cheating.', [
      O('当场重考证明自己|Retake it on the spot', async function (c) { var r = await c.game('math', { name: '重考|Retake' }); if (r.score > .45) { H.fx(c, { perf: 4, rep: 4, happy: 4 }); return '你又考了高分，老师向你道歉了。|You aced it again, and the teacher apologized.'; } H.fx(c, { perf: -5, happy: -6 }); return '这次发挥失常，老师更怀疑你了。|You choked this time, and the teacher grew more suspicious.'; }),
      O('忍气吞声|Swallow it', R('你委屈地背了这个锅。|You bitterly took the blame.', { happy: -8 }))
    ], { if: function (S, p) { return H.student() && p.edu.perf > 70; } }),
    E('t_choose', [14, 16], '文理分科|Choosing a Track', '🧪', '学校要分科了，你选文科还是理科？|Time to choose a track: humanities or sciences?', [
      O('理科|Sciences', R('你选了理科，每天和公式打交道。|You chose sciences and live among formulas.', { smarts: 2, flag: 'sci' })),
      O('文科|Humanities', R('你选了文科，背书背到头秃。|You chose humanities and memorize until your hair falls out.', { eq: 2, flag: 'art' }))
    ], { if: function (S, p) { return H.east(S, p) && H.student(); } }),
    E('t_comeout', [14, 22], '出柜|Coming Out', '🏳️‍🌈', '你越来越清楚自己的性取向，要不要告诉家人？|You\'re increasingly sure of your orientation. Will you tell your family?', [
      O('告诉爸妈|Tell your parents', function (c) { var ok = G.ch(G.canGayMarry(c.p.country, G.S.year) ? .65 : .35); if (ok) { H.fx(c, { happy: 10, par: 5 }); return '爸妈抱住了你：“你永远是我们的孩子。”|Your parents hugged you: "You\'ll always be our child."'; } H.fx(c, { happy: -12, par: -15 }); return '爸妈接受不了，家里的气氛降到了冰点。|Your parents couldn\'t accept it, and home turned ice-cold.'; }),
      O('先告诉最好的朋友|Tell your best friend first', R('朋友说：“我早就猜到了，没关系的。”|Your friend said, "I kind of guessed. It\'s totally fine."', { happy: 6 })),
      O('暂时不说|Keep it private for now', R('你把这个秘密藏在心里。|You keep it to yourself for now.', { stress: 5 }))
    ], { if: function (S, p) { return p.orient !== 'het' && H.hasPar(); } }),
    E('t_cyberbully', [13, 25], '网暴|Cyberbullying', '💬', '有人在网上造你的谣，评论区全是骂你的话。|Someone is spreading rumors online, and the comments are full of insults.', [
      O('澄清回应|Post a clarification', RC(.55, '真相大白，造谣的人道歉了。|The truth came out, and the rumormonger apologized.', { eq: 2 }, '越描越黑，骂你的人更多了。|It made things worse; even more people piled on.', { happy: -8 })),
      O('报警|Report it to the police', R('警方找到了造谣者，你松了一口气。|Police tracked down the rumormonger. You breathe easier.', { happy: 2 })),
      O('关掉手机|Turn off your phone', R('你一个星期没上网，心情慢慢平复了。|You stayed offline for a week and slowly calmed down.', { happy: -3, stress: -5 }))
    ], { bad: 1, if: function (S) { return S.year >= 2008; } }),
    E('t_bully_witness', [11, 17], '目睹霸凌|Witnessing Bullying', '🫣', '你看到几个人把一个瘦小的同学堵在厕所里。|You see a group cornering a small classmate in the bathroom.', [
      O('冲上去制止|Step in', async function (c) { var r = await c.game('fight', { name: '制止霸凌|Stop the Bullies' }); var v = N.make({ rel: 'friend', age: c.p.age, aff: 60 }); c.prm.v = v.name; if (r.score > .4) { H.fx(c, { karma: 8, rep: 6 }); return '你赶跑了他们，{v}从此成了你最铁的朋友。|You drove them off, and {v} became your most loyal friend.'; } H.fx(c, { karma: 8, health: -5 }); return '你也挨了揍，但{v}永远记得你。|You took some hits too, but {v} will never forget it.'; }),
      O('去叫老师|Go get a teacher', R('老师及时赶到，那几个人被处分了。|The teacher arrived in time, and the bullies were disciplined.', { karma: 5 })),
      O('加入他们|Join in', R('你也踢了一脚。心里有个声音在说这不对。|You kicked too. A voice inside said this was wrong.', { karma: -12, rep: 3 })),
      O('假装没看见|Look away', R('那个同学看你的眼神，你很久都忘不掉。|The look in that kid\'s eyes stayed with you for a long time.', { karma: -3, happy: -3 }))
    ], { if: H.student }),
    E('t_trip', [15, 19], '毕业旅行|Graduation Trip', '🏖️', '毕业了，好朋友们约着一起去旅行。|After graduation, your friends plan a trip together.', [
      O('一起去海边|Go to the beach together', R('那是你们青春里最快乐的一个夏天。|It was the happiest summer of your youth.', { happy: 12, money: -300 })),
      O('在家休息|Rest at home', R('你在家躺了一整个夏天。|You lazed at home all summer.', { happy: 2 }))
    ], { if: function (S, p) { return p.edu.deg >= 3 && p.age >= 17 && p.age <= 19; } }),
    E('t_gym', [14, 30], '健身|Getting Fit', '💪', '你看着镜子里的自己，决定开始健身。|Looking in the mirror, you decide to get in shape.', [
      O('坚持每天锻炼|Train every day', R('三个月后，你练出了一身好身材。|Three months later, you\'re in great shape.', { fit: 12, looks: 3, health: 3 })),
      O('三天打鱼两天晒网|Go on and off', R('你办了张健身卡，去了三次。|You bought a gym membership and went three times.', { money: -50, fit: 2 }))
    ]),
    E('t_esports', [13, 20], '战队邀请|Esports Team Offer', '🎮', '你的游戏天梯排名太高，一支职业战队想签下你！|Your ranked ladder score is so high that a pro esports team wants to sign you!', [
      O('加入战队|Join the team', function (c) { G.fame.start('esports'); if (G.school.inSchool()) { c.p.edu.stage = 'done'; } H.fx(c, { happy: 10, par: -6 }); return '你退学成了职业选手，爸妈气得不行。|You quit school to go pro; your parents are furious.'; }),
      O('先完成学业|Finish school first', R('你拒绝了邀请。|You turned down the offer.', { par: 3 }))
    ], { good: 1, w: function (S, p) { return (G.has('gamer') ? 2 : 0) + G.skill('game') / 60; }, if: function (S, p) { return S.year >= 2000 && !p.fc; } }),
    E('t_sportsschool', [11, 16], '体校选拔|Sports School Selection', '🏅', '体校教练看中了你的身体素质。|A sports-school coach is impressed by your physique.', [
      O('去体校|Go to sports school', function (c) { G.fame.start('athlete', { sport: G.ri(0, G.SPORTS.length - 1) }); H.fx(c, { fit: 10, perf: -10 }); return '你开始了专业训练。|You begin professional training.'; }),
      O('继续读书|Stay in regular school', R('你选择了普通的求学之路。|You chose the ordinary academic path.', {}))
    ], { good: 1, w: function (S, p) { return (G.has('athletic') ? 2 : 0) + (p.flags.sportfam ? 2 : 0) + (p.h.fit > 60 ? .5 : 0); }, if: function (S, p) { return !p.fc; } }),
    E('t_prodigy', [10, 15], '少年班|Gifted Program', '🧠', '一所顶尖大学的少年班向你发来了邀请！|A top university\'s gifted youth program invites you to enroll!', [
      O('去少年班|Join the program', function (c) { var u = G.eduSys(c.p.country).u[0]; G.school.admit({ n: u.n, t: 5 }, G.pick(['cs', 'eng', 'bio', 'econ'])); c.p.edu.deg = 3; H.fx(c, { fame: 6, happy: 6, stress: 10 }); return G.L('你以{a}岁的年纪进入了{u}！|At {a}, you entered {u}!', { a: c.p.age, u: u.n }); }),
      O('按部就班长大|Grow up normally', R('你想过一个普通的童年。|You want an ordinary childhood.', { happy: 3 }))
    ], { good: 1, w: function (S, p) { return (G.has('prodigy') || G.has('genius')) && p.st.smarts > 85 ? 3 : 0; }, if: H.student }),
    E('t_talentmusic', [10, 16], '音乐学院附中|Conservatory Prep School', '🎼', '音乐学院附中的老师听了你的演奏，希望你去他们学校。|A conservatory prep-school teacher heard you play and wants you to enroll.', [
      O('去学音乐|Study music', R('你开始了专业的音乐训练。|You begin serious musical training.', { sk: { music: 20 }, happy: 4, perf: -4 })),
      O('婉拒|Decline', R('音乐只是你的爱好。|Music stays a hobby.', {}))
    ], { good: 1, w: function (S, p) { return G.has('music') ? 2 : G.skill('music') > 30 ? 1 : 0; } }),
    E('t_hacker', [14, 22], '神秘的邀请|A Mysterious Invitation', '🕶️', '你入侵学校系统的事被发现了——但来找你的不是校长，而是一个自称网络安全部门的人。|Your hack of the school system was discovered — but it\'s not the principal who shows up. It\'s someone from a cybersecurity agency.', [
      O('接受招募|Accept the recruitment', function (c) { H.fx(c, { sk: { code: 20 }, smarts: 3 }); c.p.flags.cyber = 1; return '你成了一名“白帽子”，为国家网络安全工作。|You became a "white hat," working on national cybersecurity.'; }),
      O('拒绝|Decline', R('你继续做你的独行侠。|You stay a lone wolf.', { heat: 5 }))
    ], { w: function (S, p) { return G.has('hacker') ? 1.5 : 0; }, if: function (S) { return S.year >= 1995; } }),
    E('t_gaokao_bonus', [17, 18], '加分政策|Bonus Points', '➕', '你在体育/艺术特长上获得了高考加分资格。|Your sports/arts achievements qualify you for bonus exam points.', [
      O('太好了|Great', R('你的高考成绩会多加几分。|You\'ll get extra points on the big exam.', { perf: 8, happy: 4 }))
    ], { good: 1, if: function (S, p) { return H.cn(S, p) && p.edu.stage === 'high' && (G.skill('music') > 30 || G.skill('art') > 30 || p.h.fit > 70); } }),
    E('t_school_dance', [13, 17], '运动会|Sports Day', '🏃', '学校运动会，班主任让你报名接力赛。|At the school sports day, your teacher signs you up for the relay.', [
      O('全力冲刺|Sprint your heart out', async function (c) { var r = await c.game('sprint', { name: '接力赛|Relay Race' }); if (r.score > .6) { H.fx(c, { happy: 8, rep: 3, fit: 2 }); return '你最后一棒逆转，全班把你抛上了天！|You anchored a comeback win; the class tossed you in the air!'; } H.fx(c, { happy: -3 }); return '你掉了棒，全班叹气。|You dropped the baton; the class groaned.'; }),
      O('当啦啦队|Be a cheerleader', R('你喊得嗓子都哑了。|You cheered yourself hoarse.', { happy: 4, eq: 1 }))
    ], { rep: 1, cd: 3, if: H.student }),
    E('t_friend_move', [12, 18], '好朋友转学|Best Friend Moving Away', '👋', '你最好的朋友要转学去外地了。|Your best friend is transferring to a school far away.', [
      O('送一份珍贵的礼物|Give a precious keepsake', R('你们约定保持联系。|You promised to stay in touch.', { happy: -4, eq: 2 })),
      O('假装不在乎|Pretend not to care', R('等TA走了，你才哭出来。|You only cried after they were gone.', { happy: -7 }))
    ]),
    E('t_scholar_money', [13, 22], '奖学金|Scholarship', '🏆', '你成绩优异，获得了一笔奖学金。|Your excellent grades earned you a scholarship.', [
      O('存起来|Save it', R('你把奖学金存进了银行。|You put the scholarship in the bank.', { money: 1000 })),
      O('请全宿舍吃饭|Treat your whole dorm', R('你请大家吃了顿大餐，人缘爆棚。|You treated everyone to a feast and became wildly popular.', { money: 600, eq: 3, happy: 4 }))
    ], { good: 1, if: function (S, p) { return H.student() && p.edu.perf > 78; } }),
    E('t_internet_scam', [13, 25], '网恋|Online Romance', '💻', '你在网上认识了一个很聊得来的人，TA说想见面，但先要你寄点钱。|You met someone online who really gets you. They want to meet — but first, they ask you to send money.', [
      O('寄钱|Send money', R('钱寄出去后，那个人就消失了。|Once the money was sent, they vanished.', { money: -300, happy: -10 })),
      O('要求视频通话|Ask for a video call', R('对方一直找借口，你识破了骗局。|They kept making excuses, and you saw through the scam.', { smarts: 2 })),
      O('拉黑|Block them', R('你果断拉黑了对方。|You blocked them without hesitation.', {}))
    ], { bad: 1, if: function (S) { return S.year >= 2000; } }),
    E('t_heartbreak', [14, 25], '失恋|Heartbreak', '💔', '你和{n}分手了，整个世界好像都灰了。|You and {n} broke up, and the whole world feels gray.', [
      O('大哭一场|Have a good cry', R('哭完之后，你觉得好受多了。|After crying it out, you felt better.', { happy: 3, eq: 2 })),
      O('疯狂学习/工作转移注意力|Bury yourself in work', R('你化悲痛为力量。|You turned the pain into fuel.', { perf: 6, happy: -2 })),
      O('借酒消愁|Drown your sorrows', R('醉了好几天，醒来还是很难过。|Days of drinking, and it still hurts when you wake.', { drink: 10, health: -2 }))
    ], { prep: function (c) { var ex = N.rel('ex').filter(function (n) { return G.S.year - (n.lt || 0) <= 1; })[0]; if (!ex) return false; c.prm.n = ex.name; } })
  ]);
})();
