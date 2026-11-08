/* Adult life events (18-64) */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function friendOrNew(c) { var fs = N.rel('friend', 'classmate', 'colleague'); var f = fs.length && G.ch(.7) ? G.pick(fs) : N.make({ rel: 'friend', age: G.clamp(c.p.age + G.ri(-4, 4), 18, 90), aff: 30 }); c.npc = f; c.prm.n = f.name; var pr = G.pr(f.g); for (var k in pr) c.prm[k] = pr[k]; return f; }
  G.evs([
    // ---------- university ----------
    E('a_roommate', [18, 22], '室友|Roommate Trouble', '🛏️', '你的室友每天打游戏到凌晨三点，还不洗袜子。|Your roommate games until 3 a.m. every night and never washes their socks.', [
      O('当面沟通|Talk it out', RC(.6, '室友答应改，你们成了朋友。|They promised to change, and you became friends.', { eq: 2 }, '室友翻脸了，宿舍气氛很尴尬。|They got defensive, and the dorm turned awkward.', { happy: -4 })),
      O('申请换宿舍|Request a room change', R('你搬去了新宿舍，清净多了。|You moved to a new room; much quieter.', { happy: 3 })),
      O('一起打游戏|Join the gaming', R('你也开始熬夜了。|Now you stay up late too.', { happy: 4, night: 15, perf: -3 }))
    ], { if: function (S, p) { return p.edu.stage === 'uni'; } }),
    E('a_fail', [18, 23], '挂科|Failed a Course', '📕', '你的高数挂科了，要重修。|You failed calculus and have to retake it.', [
      O('认真重修|Retake it seriously', R('你重修拿了高分。|You aced the retake.', { perf: 4, smarts: 1 })),
      O('找学长借笔记|Borrow notes from a senior', R('你勉强过了。|You squeaked by.', { perf: 1 }))
    ], { bad: 1, if: function (S, p) { return p.edu.stage === 'uni' && p.edu.perf < 50; } }),
    E('a_campusloan', [18, 23], '校园贷|Campus Loan', '💳', '一个App说只要动动手指，就能借到钱买最新款手机。|An app promises a new phone loan in just a few taps.', [
      O('借|Borrow', function (c) { var amt = c.$(1200); c.money(amt); G.S.assets.debt.push({ k: 'online', n: '校园贷|Campus Loan', amt: amt, r: .6 }); H.fx(c, { happy: 4 }); return '你买了新手机，但利息高得吓人。|You got the phone, but the interest is terrifying.'; }),
      O('不借|Don\'t', R('你明智地拒绝了。|You wisely said no.', { smarts: 1 }))
    ], { if: function (S, p) { return p.edu.stage === 'uni' && S.year >= 2012; } }),
    E('a_mlm', [18, 50], '“创业”机会|"Business Opportunity"', '🔺', '老同学神秘兮兮地邀请你加入一个“月入十万”的项目，只需要先交一笔入会费。|An old classmate mysteriously invites you to a "make 100K a month" scheme — just pay a membership fee first.', [
      O('交钱加入|Pay and join', RC(.15, '你居然真的赚到了钱（运气好跑得早）。|You actually made money — you got out early.', { money: 3000 }, '这是传销！你血本无归，还被拉黑了不少朋友。|It was a pyramid scheme! You lost everything and alienated friends.', { money: -3000, happy: -10, eq: -2 })),
      O('拒绝并劝同学|Refuse and warn your friend', R('你劝了半天，同学还是执迷不悟。|You tried hard, but your friend wouldn\'t listen.', { karma: 2, smarts: 1 })),
      O('举报|Report it', R('警方端掉了这个窝点。|Police shut the operation down.', { karma: 4 }))
    ], { bad: 1 }),
    E('a_jobless', [21, 25], '毕业即失业|Unemployed Graduate', '📄', '你投了一百份简历，一个回复都没有。|You\'ve sent a hundred résumés and heard nothing back.', [
      O('降低要求，先就业|Lower your standards and take anything', function (c) { var j = G.pick(G.JOBS.filter(function (x) { return !x.pt && x.deg <= 3 && G.jobOk(x); })); G.career.hire(j); return G.L('你先当了{j}，骑驴找马。|You took a job as a {j} for now and kept looking.', { j: j.r[0] }); }),
      O('回家啃老|Move back home', R('你回家躺平了一段时间。|You moved home and lay low for a while.', { happy: -4, par: -3 })),
      O('考公/考研|Study for exams', R('你开始了漫长的备考。|You started a long stretch of exam prep.', { smarts: 2, stress: 8 }))
    ], { bad: 1, if: function (S, p) { return p.edu.deg >= 4 && !p.job && !p.gov && !p.mil && !p.pol && !p.fc && !H.student(); } }),
    // ---------- money & society ----------
    E('a_scamcall', [18, 90], '诈骗电话|Scam Call', '📞', '一个自称“公安局”的人打来电话，说你涉嫌洗钱，要你把钱转到“安全账户”。|A caller claiming to be the police says you\'re suspected of money laundering and must move your money to a "safe account."', [
      O('照做|Do as told', function (c) { var l = Math.round(c.p.money * .6); c.money(-l); c.add('happy', -15); G.inc('scammed'); return G.L('你转了{m}，然后对方就消失了。|You transferred {m}, and then they vanished.', { m: G.M(l) }); }),
      O('挂断并报警|Hang up and call the real police', R('警方告诉你这是典型的诈骗。|The police confirmed it was a classic scam.', { smarts: 2 }))
    ], { bad: 1, w: function (S, p) { return p.age > 60 ? 2 : .7; }, if: function (S, p) { return S.year >= 2005 && p.money > G.$(2000); } }),
    E('a_lend', [18, 80], '朋友借钱|A Friend Needs Money', '🤲', '{n}找你借钱，说家里出了急事。|{n} asks to borrow money, saying there\'s a family emergency.', [
      O('借给{him}|Lend it', function (c) { var amt = Math.round(Math.min(c.p.money * .3, c.$(G.ri(500, 8000)))); c.money(-amt); c.npc.owes = amt; c.prm.m = G.M(amt); if (G.ch(c.npc.sincere / 100)) { G.N.addAff(c.npc, 15); c.money(amt); return '{n}很快就还了钱，还请你吃了饭。|{n} paid you back quickly and treated you to dinner.'; } G.N.addAff(c.npc, 5); return '借出去{m}，{n}后来再也没提过还钱的事。|You lent {m}, and {n} never mentioned it again.'; }),
      O('婉拒|Politely decline', function (c) { G.N.addAff(c.npc, -10); return '{n}有些失望。|{n} looks disappointed.'; })
    ], { prep: function (c) { friendOrNew(c); if (c.p.money < c.$(500)) return false; } }),
    E('a_reunion', [25, 60], '同学聚会|Class Reunion', '🍾', '多年不见的同学聚在一起，大家都在暗暗较劲。|Old classmates gather after years apart — everyone quietly sizing each other up.', [
      O('开豪车去|Arrive in a fancy car', function (c) { if (G.S.assets.cars.some(function (x) { return x.val > c.$(60000); }) || G.netWorth() > c.$(500000)) { H.fx(c, { happy: 8, fame: 1 }); return '同学们都围着你转，你出尽了风头。|Everyone crowded around you — you stole the show.'; } H.fx(c, { happy: -6, money: -150 }); return '你租了辆豪车，结果被认出是租的……|You rented a fancy car, and someone noticed the rental sticker...'; }),
      O('低调参加|Keep it low-key', function (c) { var f = N.make({ rel: 'friend', age: c.p.age, aff: 30 }); c.prm.f = f.name; H.fx(c, { happy: 4 }); return '你和{f}重新联系上了。|You reconnected with {f}.'; }),
      O('不去|Skip it', R('你不想参加这种攀比大会。|You don\'t want to join the bragging contest.', {}))
    ]),
    E('a_bitcoin', [16, 70], '比特币|Bitcoin', '🪙', '一个程序员朋友劝你买点比特币，说现在一个才几美元。|A programmer friend urges you to buy Bitcoin — it\'s just a few dollars each right now.', [
      O('买一点试试|Buy a little', function (c) { var amt = c.$(500); if (!c.pay(amt)) return '你没钱买。|You don\'t have the cash.'; G.S.assets.inv.crypto = (G.S.assets.inv.crypto || 0) + amt; return '你买了一些比特币，然后差点忘了这回事。|You bought some Bitcoin and almost forgot about it.'; }),
      O('梭哈！|Go all in!', function (c) { var amt = Math.round(c.p.money * .8); c.money(-amt); G.S.assets.inv.crypto = (G.S.assets.inv.crypto || 0) + amt; return '你把大部分积蓄都换成了比特币。|You converted most of your savings into Bitcoin.'; }),
      O('这是骗局吧|Sounds like a scam', R('你一笑置之。|You laughed it off.', {}))
    ], { y: [2010, 2013], w: 3 }),
    E('a_house_boom', [22, 60], '买房机会|A Chance to Buy', '🏢', '朋友说房价马上要涨了，劝你赶紧买房。|A friend says prices are about to soar and urges you to buy now.', [
      O('借钱也要买|Buy even if you have to borrow', function (c) { var h = G.HOUSES[3]; var pr = G.money.housePrice(h); var need = Math.round(pr * .3); if (c.p.money < need) { var gap = need - c.p.money; c.money(gap); G.S.assets.debt.push({ k: 'fam', n: '亲戚借款|Family Loan', amt: gap, r: .02 }); } G.money.buyHouse(h, true); H.fx(c, { stress: 10 }); return '你咬牙买下了一套房，背上了房贷。|You gritted your teeth and bought a place, mortgage and all.'; }),
      O('再观望观望|Wait and see', R('你决定再等等。|You decide to wait.', {}))
    ], { y: [1998, 2016], w: 2, if: function (S, p) { return H.cn(S, p) && !S.assets.houses.length && H.employed(S, p); } }),
    E('a_xiahai', [20, 45], '下海|Into the Sea of Business', '🌊', '身边的人纷纷辞职“下海”经商，你心动了。|Everyone around you is quitting to "jump into the sea" of business. You\'re tempted.', [
      O('辞职下海！|Quit and go for it!', function (c) { G.career.leave(); G.biz.start(G.pick(['trade', 'retail', 'food', 'mfg']), 20000); H.fx(c, { stress: 10 }); return '你砸掉了铁饭碗，开了自己的公司！|You smashed your iron rice bowl and started your own company!'; }),
      O('守着铁饭碗|Keep your secure job', R('你选择了稳定。|You chose stability.', {}))
    ], { y: [1984, 2000], w: 2.5, if: function (S, p) { return H.cn(S, p) && H.employed(S, p) && !S.assets.company; } }),
    E('a_layoff98', [25, 55], '下岗|Laid Off', '🏭', '国企改革，你所在的工厂裁员，你下岗了。|State-enterprise reform hits your factory, and you\'re laid off.', [
      O('去南方打工|Go south for work', function (c) { G.career.leave(); c.p.tier = 2; c.p.city = G.pick(G.C.cn.cities[1]); H.fx(c, { happy: -6 }); return '你背着行李去了南方。|You packed a bag and headed south.'; }),
      O('摆摊做小生意|Start a street stall', function (c) { G.career.leave(); G.career.hire(G.JOB.vendor); H.fx(c, { happy: -4 }); return '你在街口摆起了小摊。|You set up a stall on the street corner.'; })
    ], { y: [1995, 2002], w: 3, if: function (S, p) { return H.cn(S, p) && p.job && (p.job.id === 'factory' || p.job.id === 'guard'); } }),
    E('a_lottery2', [18, 90], '中奖了|You Won!', '🎫', '你随手买的一张彩票中了二等奖！|A lottery ticket you bought on a whim won second prize!', [
      O('兑奖|Cash it in', R('你领到了一大笔奖金！|You collected a big prize!', { money: 25000, happy: 15 }))
    ], { good: 1, w: .25 }),
    E('a_inheritance', [25, 80], '神秘遗产|Mysterious Inheritance', '📜', '一位你几乎不认识的远房亲戚去世了，竟然把遗产留给了你。|A distant relative you barely knew died and left you their estate.', [
      O('接受遗产|Accept', function (c) { var m = c.$(G.ri(10000, 300000)); c.money(m); G.inc('inherit', m); return G.L('你继承了{m}！|You inherited {m}!', { m: G.M(m) }); }),
      O('捐给慈善机构|Donate it to charity', R('你把遗产全部捐了出去。|You donated it all.', { karma: 15, fame: 3 }))
    ], { good: 1, w: .2 }),
    E('a_hero', [16, 70], '见义勇为|Stop a Thief', '🦸', '一个小偷抢了路人的包，正从你身边跑过。|A thief snatches someone\'s bag and runs right past you.', [
      O('追上去|Chase him', async function (c) { var r = await c.game('sprint', { name: '追小偷|Chase' }); if (r.score > .5) { H.fx(c, { karma: 8, fame: 3, happy: 6 }); G.inc('hero'); return '你追上并制服了小偷，上了本地新闻！|You caught and subdued the thief — you made the local news!'; } H.fx(c, { karma: 3, health: -4 }); return '小偷跑掉了，你还摔了一跤。|The thief got away, and you took a tumble.'; }),
      O('报警|Call the police', R('你报了警，提供了线索。|You called the police and gave a description.', { karma: 3 })),
      O('事不关己|Not your problem', R('你继续往前走。|You kept walking.', {}))
    ]),
    E('a_witness', [18, 80], '车祸现场|Car Accident', '🚑', '你目睹了一场车祸，一位老人倒在路边。|You witness a car accident; an elderly person lies by the road.', [
      O('上前救助|Help them', RC(.85, '你帮忙叫了救护车，老人的家人万分感激。|You called an ambulance; the family was deeply grateful.', { karma: 8, happy: 4 }, '老人醒来后反咬一口说是你撞的，你百口莫辩……|When they woke up, they accused you of causing it. You couldn\'t prove otherwise...', { karma: 4, money: -2000, happy: -10 })),
      O('拍视频|Film it', R('你拍下了全过程。|You recorded everything.', { karma: -2 })),
      O('离开|Walk away', R('你匆匆离开了。|You hurried away.', { karma: -3 }))
    ]),
    E('a_fire', [18, 90], '火灾|House Fire', '🔥', '半夜，你家着火了！|In the middle of the night, your home catches fire!', [
      O('先救家人|Save your family first', R('你把家人都救了出来，但房子损失惨重。|You got your family out, but the home was badly damaged.', { karma: 6, health: -5, money: -3000 })),
      O('抢救贵重物品|Grab the valuables', R('你抢出了一些值钱的东西，但被烟呛伤了。|You saved some valuables but suffered smoke inhalation.', { health: -10, money: -1000 }))
    ], { bad: 1, w: .3 }),
    E('a_quake', [5, 95], '地震|Earthquake', '🌋', '大地突然剧烈摇晃起来——地震了！|The ground suddenly shakes violently — earthquake!', [
      O('躲到桌子下面|Duck under a table', RC(.85, '你毫发无伤。|You were unharmed.', { happy: -4 }, '天花板塌了下来，你受了伤。|The ceiling came down and you were injured.', { health: -15, happy: -8 })),
      O('往外跑|Run outside', RC(.7, '你跑到了空地上，安全了。|You made it to open ground. Safe.', { happy: -3 }, '你在楼梯上摔倒了。|You fell on the stairs.', { health: -10 }))
    ], { bad: 1, w: function (S, p) { return ['jp', 'cn', 'mx', 'it'].indexOf(p.country) >= 0 ? .4 : .1; } }),
    E('a_bloodd', [18, 60], '献血|Blood Drive', '🩸', '街头有献血车，你要去献血吗？|There\'s a blood drive on the street. Donate?', [
      O('去献血|Donate', R('你的血可能救了一个人的命。|Your blood might save a life.', { karma: 5, health: -1, happy: 3 })),
      O('怕疼，算了|Too scared of needles', R('你绕道走了。|You took the long way around.', {}))
    ], { rep: 1, cd: 6 }),
    E('a_marrow', [18, 55], '骨髓配型|Bone Marrow Match', '🧬', '中华骨髓库打来电话：你和一位白血病患者配型成功了。|The marrow registry calls: you\'re a match for a leukemia patient.', [
      O('捐献|Donate', R('手术很顺利，你救了一条生命。|The procedure went smoothly. You saved a life.', { karma: 20, health: -3, fame: 2, happy: 10 })),
      O('犹豫后拒绝|Hesitate and decline', R('你心里一直有些不安。|It weighs on your mind.', { karma: -3, happy: -3 }))
    ], { w: .2 }),
    E('a_hunter', [26, 55], '猎头来电|Headhunter Call', '📞', '猎头说一家大公司想挖你，薪水翻倍。|A headhunter says a big company wants you — at double the salary.', [
      O('跳槽|Take the leap', function (c) { var j = c.p.job; j.sal = Math.round(j.sal * G.rf(1.4, 2)); j.co = G.career.coName(G.JOB[j.id].cat); j.yr = 0; j.perf = 50; H.fx(c, { happy: 8, stress: 4 }); return G.L('你跳槽到了{c}，年薪涨到{m}！|You moved to {c} with a raise to {m}!', { c: j.co, m: G.M(j.sal) }); }),
      O('留在老东家|Stay loyal', function (c) { c.p.job.perf += 5; return '老板知道后给你加了点薪。|Your boss found out and gave you a small raise.'; })
    ], { good: 1, if: function (S, p) { return H.employed(S, p) && p.job.perf > 65; } }),
    E('a_midlife', [38, 52], '中年危机|Midlife Crisis', '🌀', '你突然觉得人生没有意义，每天都在重复。|You suddenly feel life is meaningless — the same thing every day.', [
      O('买辆跑车|Buy a sports car', function (c) { if (G.money.buyCar(G.CARS.filter(function (x) { return x.id === 'sport'; })[0])) { H.fx(c, { happy: 10 }); return '油门一踩，你觉得自己又年轻了。|One press of the gas pedal and you feel young again.'; } H.fx(c, { happy: -4 }); return '你看了看存款，默默关掉了4S店的网页。|You checked your savings and quietly closed the dealership\'s website.'; }),
      O('辞职去旅行|Quit and travel', function (c) { G.career.leave(); H.fx(c, { happy: 15, money: -3000, stress: -25 }); return '你背起背包，走遍了很多地方。|You put on a backpack and roamed far and wide.'; }),
      O('学一门新技能|Learn something new', R('你报了油画班，找到了新的乐趣。|You signed up for oil painting and found a new joy.', { happy: 6, sk: { art: 10 } })),
      O('熬过去|Ride it out', R('日子还要继续。|Life goes on.', { happy: -5 }))
    ]),
    E('a_hairline', [30, 55], '发际线|Receding Hairline', '🧑‍🦲', '你发现发际线一天比一天高了。|Your hairline is creeping higher every day.', [
      O('去植发|Get a transplant', R('你的头发又茂密了。|Your hair is thick again.', { looks: 4, money: -5000 })),
      O('剃个光头|Shave it all off', R('光头意外地很适合你！|The bald look actually suits you!', { looks: G.ri(-2, 3), happy: 3 })),
      O('认命|Accept it', R('程序员的勋章。|A badge of honor.', { happy: -2 }))
    ], { if: function (S, p) { return p.g === 'm'; } }),
    E('a_blind_corner', [26, 45], '相亲角|The Marriage Market', '🏞️', '妈妈偷偷把你的资料挂在了公园相亲角。|Mom secretly posted your profile at the park\'s marriage market.', [
      O('去见见|Go meet some matches', async function (c) { var list = [0, 1, 2].map(function () { return N.mkRomantic({ rel: 'contact', love: G.ri(10, 35), aff: 10, minGap: -4, maxGap: 5 }); }); var who = await G.pickPerson(G.L('相亲对象|Matches'), G.L('妈妈给你筛选了三位。|Mom shortlisted three people.'), list); if (!who) return '你一个都没看上。|None of them interested you.'; N.addLove(who, 10); N.addAff(who, 10); who.pin = 1; return G.L('你和{n}加了联系方式。|You exchanged contacts with {n}.', { n: who.name }); }),
      O('和妈妈吵一架|Argue with Mom', R('你们吵得不欢而散。|The argument ended badly.', { par: -6, happy: -3 }))
    ], { if: function (S, p) { return H.cn(S, p) && H.single(S, p) && H.hasPar(); } }),
    E('a_cuihun', [26, 45], '催婚|"When Are You Getting Married?"', '👵', '过年回家，七大姑八大姨轮番问你：“什么时候结婚？”|Home for the holidays, every aunt and uncle asks: "When are you getting married?"', [
      O('租个对象回家|Rent a fake partner', RC(.6, '演技过关，亲戚们放过了你。|The act worked; relatives finally left you alone.', { money: -500, happy: 2 }, '穿帮了，全家都知道了。|You got busted, and the whole family found out.', { money: -500, par: -5, happy: -5 })),
      O('说自己在忙事业|Say you\'re focused on your career', R('亲戚们摇了摇头。|The relatives shook their heads.', { happy: -3 })),
      O('今年不回家了|Don\'t go home this year', R('你一个人过了个年。|You spent the holiday alone.', { happy: -5, par: -4 }))
    ], { rep: 1, cd: 2, if: function (S, p) { return H.east(S, p) && H.single(S, p) && H.hasPar(); } }),
    E('a_relatives', [22, 60], '亲戚攀比|Relative Comparison', '🗣️', '亲戚当着大家的面说：“我家孩子年薪百万，你呢？”|A relative announces to everyone: "My kid earns a fortune. What about you?"', [
      O('不卑不亢|Stay composed', R('你笑笑说各有各的活法。|You smiled and said everyone has their own path.', { eq: 2 })),
      O('怼回去|Clap back', RC(.6, '你一句话怼得对方哑口无言，全场暗爽。|One line and they were speechless. Everyone secretly loved it.', { happy: 5, rep: 2 }, '场面一度很尴尬。|Things got awkward fast.', { happy: -3 })),
      O('默默吃菜|Silently eat', R('你把委屈和饭一起咽了下去。|You swallowed your pride along with dinner.', { happy: -4 }))
    ], { rep: 1, cd: 4, if: H.east }),
    E('a_neighbor', [18, 90], '邻居|Noisy Neighbors', '🔊', '楼上的邻居每天半夜蹦迪。|The upstairs neighbors throw dance parties every midnight.', [
      O('上去理论|Go up and complain', RC(.5, '邻居道歉了，从此安静了。|They apologized and kept it down.', { eq: 1 }, '邻居反而骂了你一顿，矛盾升级。|They cursed you out, and the feud escalated.', { happy: -5 })),
      O('用震楼器报复|Retaliate with a ceiling vibrator', R('你们开始了漫长的拉锯战。|A long war of attrition began.', { happy: 2, karma: -2, stress: 5 })),
      O('戴耳塞|Wear earplugs', R('你学会了忍耐。|You learned patience.', { stress: 5 }))
    ]),
    E('a_fake', [18, 80], '买到假货|Counterfeit Goods', '📦', '你网购的名牌包是假的。|The designer bag you ordered online is a fake.', [
      O('维权|Fight for a refund', RC(.6, '平台给你退了款。|The platform refunded you.', {}, '商家早就跑路了。|The seller had already vanished.', { money: -200, happy: -3 })),
      O('凑合用|Use it anyway', R('反正别人也看不出来。|Nobody can tell anyway.', { money: -200 }))
    ], { if: function (S) { return S.year >= 2005; } }),
    E('a_celeb_meet', [15, 70], '偶遇明星|Celebrity Encounter', '🤩', '你在咖啡店偶遇了一位大明星！|You run into a huge celebrity at a café!', [
      O('要合影|Ask for a selfie', R('明星很友善，你的朋友圈炸了。|They were lovely, and your social feed exploded.', { happy: 8 })),
      O('假装淡定，搭讪聊天|Play it cool and chat', function (c) { var n = N.make({ rel: 'contact', tags: ['celeb'], age: G.clamp(c.p.age + G.ri(-8, 8), 20, 70), aff: 20 }); n.pin = 1; c.prm.n = n.name; H.fx(c, { happy: 6 }); return '你们相谈甚欢，{n}还加了你的联系方式！|You hit it off, and {n} even gave you their number!'; })
    ], { good: 1, w: .4 }),
    E('a_tv', [18, 70], '上电视|On TV', '📺', '你被街头采访的记者拦住了。|A street reporter stops you for an interview.', [
      O('侃侃而谈|Speak eloquently', R('你的采访片段在网上火了。|Your clip went viral online.', { fame: 4, happy: 4 })),
      O('紧张得说不出话|Freeze up', R('你的窘态成了网络表情包。|Your awkward face became a meme.', { fame: 3, happy: -4 }))
    ], { w: .5 }),
    E('a_whistle', [24, 60], '公司黑幕|Company Wrongdoing', '🕵️', '你发现公司在偷偷排放污水/做假账。|You discover your company is secretly dumping waste / cooking the books.', [
      O('匿名举报|Report it anonymously', RC(.7, '公司被查处，你深藏功与名。|The company was penalized, and no one knew it was you.', { karma: 12 }, '你的身份暴露了，被公司开除。|You were exposed and fired.', { karma: 12, happy: -10 })),
      O('拿封口费|Take hush money', R('老板塞给你一个红包，你闭嘴了。|Your boss slipped you an envelope, and you kept quiet.', { money: 5000, karma: -10 })),
      O('当没看见|Pretend you didn\'t see', R('你选择沉默。|You chose silence.', { karma: -3 }))
    ], { if: H.employed }),
    E('a_expat', [24, 50], '外派机会|Overseas Assignment', '🌏', '公司想派你去海外分公司工作几年。|The company wants to send you to an overseas branch for a few years.', [
      O('去！|Go!', function (c) { var to = G.pick(G.CLIST.filter(function (x) { return x !== c.p.country; })); G.money.emigrate(to, true); c.p.job.sal = Math.round(c.p.job.sal * 1.3); return G.L('你被派往{c}工作。|You were posted to {c}.', { c: G.C[to].n }); }),
      O('舍不得家人|Stay with family', R('你留了下来。|You stayed home.', {}))
    ], { if: function (S, p) { return H.employed(S, p) && p.job.rank >= 1; }, w: .5 }),
    E('a_ufo', [8, 90], '不明飞行物|UFO Sighting', '🛸', '深夜，你看到天空中有一个发光的物体在悬停。|Late at night, you see a glowing object hovering in the sky.', [
      O('拍下来发网上|Film it and post online', R('你的视频引发了热议，但大家都说是P的。|Your video sparked debate, but everyone says it\'s fake.', { fame: 2 })),
      O('走近看看|Get closer', RC(.5, '它突然消失了，你一夜没睡。|It vanished suddenly; you couldn\'t sleep all night.', { happy: 3 }, '你醒来时躺在田野里，完全不记得发生了什么……|You woke up in a field with no memory of what happened...', { smarts: 3, happy: -5 })),
      O('一定是眼花了|Must be seeing things', R('你揉揉眼睛回去睡了。|You rubbed your eyes and went back to bed.', {}))
    ], { w: .15 }),
    E('a_y2k', [12, 70], '千年虫|Y2K Bug', '💾', '新闻说千禧年到来时电脑会全部崩溃！|The news says all computers will crash when the millennium hits!', [
      O('囤积罐头和水|Stockpile food and water', R('什么都没发生，你吃了一年罐头。|Nothing happened; you ate canned food for a year.', { money: -200, happy: -2 })),
      O('一笑置之|Laugh it off', R('零点的钟声响起，一切正常。|Midnight came and went. All fine.', { happy: 3 }))
    ], { y: [1999, 1999], w: 5 }),
    E('a_2012', [10, 80], '世界末日|The End of the World', '🌍', '传言说2012年12月21日是世界末日。|Rumor has it the world ends on December 21, 2012.', [
      O('及时行乐，花光积蓄|Live it up and spend everything', R('末日没来，你的钱包空了。|The apocalypse didn\'t come, but your wallet is empty.', { money: -2000, happy: 8 })),
      O('该干嘛干嘛|Carry on as usual', R('12月22日，太阳照常升起。|On December 22, the sun rose as usual.', {}))
    ], { y: [2012, 2012], w: 5 }),
    E('a_pokemon', [10, 50], '满街抓宠物|Catching Monsters', '📱', '一款AR游戏火了，满大街都是低头抓精灵的人。|An AR game is a craze — streets are full of people catching creatures.', [
      O('加入他们|Join in', R('你走了几十公里，抓到了稀有精灵！|You walked dozens of kilometers and caught a rare one!', { happy: 6, fit: 4 })),
      O('不感兴趣|Not interested', R('你觉得他们都疯了。|You think they\'ve all lost it.', {}))
    ], { y: [2016, 2017], w: 3 }),
    E('a_bigbro', [16, 60], '大哥大|The Brick Phone', '📞', '你看到有人拿着“大哥大”打电话，羡慕极了。|Someone is making a call on a giant brick mobile phone. You\'re so jealous.', [
      O('咬牙买一个|Splurge on one', R('你拿着大哥大走在街上，回头率百分百。|Walking down the street with a brick phone, every head turned.', { money: -3000, fame: 2, happy: 6 })),
      O('买个BP机就够了|A pager is enough', R('“有事呼我！”|"Page me!"', { money: -150, happy: 3 }))
    ], { y: [1988, 1998], w: 2, if: function (S, p) { return H.east(S, p) || p.country === 'us'; } }),
    E('a_volunteer_disaster', [18, 65], '抗灾志愿者|Disaster Volunteer', '⛑️', '附近发生了洪灾，急需志愿者。|Floods hit a nearby area, and volunteers are urgently needed.', [
      O('报名参加|Sign up', R('你连续奋战了一周，帮助了很多人。|You worked a week straight and helped many people.', { karma: 10, health: -3, eq: 2 })),
      O('捐款|Donate money', R('你捐了一些钱。|You donated some money.', { karma: 4, money: -300 }))
    ]),
    E('a_inspire', [18, 80], '一本改变人生的书|A Life-Changing Book', '📗', '你读到了一本书，觉得醍醐灌顶。|You read a book that opens your eyes.', [
      O('按书里说的生活|Live by its lessons', R('你的生活习惯变得更好了。|Your habits improved.', { happy: 5, stress: -8, smarts: 2 }))
    ], { good: 1 }),
    E('a_robbed', [16, 85], '遭遇抢劫|Mugged', '🔪', '深夜回家的小巷里，一个持刀的人拦住了你。|In a dark alley on the way home, someone with a knife blocks your path.', [
      O('乖乖交出钱包|Hand over your wallet', R('你损失了一些钱，但人没事。|You lost some cash but were unhurt.', { money: -150, happy: -6 })),
      O('反抗|Fight back', async function (c) { var r = await c.game('fight', { name: '反抗|Fight Back' }); if (r.win) { H.fx(c, { rep: 5, happy: 3 }); return '你夺下了刀，把劫匪扭送派出所！|You disarmed them and dragged them to the police!'; } H.fx(c, { health: -18, money: -150 }); return '你被划伤了，钱也被抢走了。|You were cut, and your money was taken.'; }),
      O('转身就跑|Run', async function (c) { var r = await c.game('sprint', { name: '逃跑|Run' }); return r.score > .4 ? '你一口气跑回了家。|You ran all the way home.' : (H.fx(c, { money: -150, health: -5 }), '你被追上了，钱被抢了。|They caught you and took your money.'); })
    ], { bad: 1, w: .6 }),
    E('a_ex_wedding', [24, 50], '前任的婚礼|Your Ex\'s Wedding', '💒', '你的前任{n}发来婚礼请柬。|Your ex, {n}, sent you a wedding invitation.', [
      O('大方出席|Attend graciously', R('你送上祝福，心里五味杂陈。|You offered your blessings with mixed feelings.', { eq: 3, money: -200 })),
      O('不去|Decline', R('你默默删掉了请柬。|You quietly deleted the invitation.', { happy: -2 })),
      O('去抢婚|Crash the wedding', RC(.15, '{n}居然跟你跑了！|{n} actually ran off with you!', { happy: 12, fame: 3 }, '你被保安架了出去，成了笑话。|Security dragged you out; you became a laughingstock.', { happy: -12, fame: 2 }))
    ], { prep: function (c) { var ex = G.pick(N.rel('ex')); if (!ex) return false; c.npc = ex; c.prm.n = ex.name; } }),
    E('a_ex_back', [20, 60], '前任回头|Your Ex Wants You Back', '🔁', '前任{n}突然发来消息：“我还是忘不了你。”|Your ex, {n}, suddenly texts: "I still can\'t forget you."', [
      O('复合|Get back together', function (c) { G.love.becomeLovers(c.npc); return '你们复合了。|You got back together.'; }),
      O('好马不吃回头草|Never go back', function (c) { N.addAff(c.npc, -5); return '你礼貌地拒绝了。|You politely declined.'; })
    ], { prep: function (c) { if (N.spouse()) return false; var ex = G.pick(N.rel('ex').filter(function (n) { return N.canRomance(n) && n.aff > -20; })); if (!ex) return false; c.npc = ex; c.prm.n = ex.name; G.N.pushChat(ex, '我还是忘不了你。|I still can\'t forget you.'); } }),
    E('a_firstlove', [30, 70], '偶遇初恋|Running into Your First Love', '🌸', '你在街头偶遇了初恋，对方还是那么好看。|You bump into your first love on the street — still as beautiful as ever.', [
      O('一起喝杯咖啡|Grab a coffee together', function (c) { var n = N.mkRomantic({ rel: 'friend', love: 30, aff: 40, minGap: -2, maxGap: 2 }); n.pin = 1; c.prm.n = n.name; H.fx(c, { happy: 6 }); return '你们聊起了从前，{n}说当年也喜欢过你。|You reminisced, and {n} confessed they had liked you back then too.'; }),
      O('点头微笑走开|Smile, nod, and walk on', R('有些人，只适合怀念。|Some people are best kept as memories.', { happy: 2 }))
    ], { w: .6 }),
    E('a_jury', [18, 75], '陪审员|Jury Duty', '⚖️', '你被选为陪审员，审理一桩案件。|You\'ve been selected for jury duty.', [
      O('认真审理|Take it seriously', R('你仔细听取了每一份证词。|You weighed every testimony carefully.', { smarts: 1, karma: 3 })),
      O('想早点结束|Just want it over', R('你随大流投了票。|You voted with the majority.', { happy: 1 }))
    ], { if: function (S, p) { return ['us', 'gb', 'ca', 'au'].indexOf(p.country) >= 0; } }),
    E('a_ai_job', [22, 60], 'AI来了|The AI Wave', '🤖', '公司引入了AI系统，你的工作有一大半可以被它完成。|Your company rolled out an AI system that can do most of your job.', [
      O('学习用AI提升效率|Learn to use AI to level up', R('你成了部门里最会用AI的人。|You became the department\'s AI whiz.', { perf: 10, smarts: 2 })),
      O('抵制它|Resist it', RC(.4, '公司发现AI也会出错，你保住了饭碗。|The company found the AI makes mistakes too; your job was safe.', {}, '你被AI取代，下岗了。|You were replaced by AI and laid off.', { happy: -10 }))
    ], { y: [2023, 2100], if: function (S, p) { return H.employed(S, p) && ['coder', 'acct', 'transl', 'design', 'journo', 'cashier', 'hr', 'mkt'].indexOf(p.job.id) >= 0; } }),
    E('a_marathon', [20, 65], '马拉松|Marathon', '🏃‍♂️', '城市马拉松开始报名了。|Registration opens for the city marathon.', [
      O('报名全马|Sign up for the full marathon', async function (c) { var r = await c.game('sprint', { name: '马拉松|Marathon' }); if (r.score + c.p.h.fit / 200 > .6) { H.fx(c, { happy: 10, fit: 5, fame: 1 }); return '你冲过了终点线，激动得热泪盈眶！|You crossed the finish line in tears of joy!'; } H.fx(c, { health: -4, happy: -2 }); return '跑到30公里你就撑不住了。|You hit the wall at 30K.'; }),
      O('跑个半马|Do the half', R('你顺利完赛，拿到了奖牌。|You finished and got a medal.', { fit: 4, happy: 5 })),
      O('看看就好|Just watch', R('你在路边给选手们加油。|You cheered from the sidelines.', {}))
    ]),
    E('a_skydive', [18, 70], '极限运动|Extreme Sports', '🪂', '朋友约你去玩跳伞/蹦极。|Friends invite you to go skydiving / bungee jumping.', [
      O('来吧！|Let\'s do it!', RC(.97, '你在空中尖叫，落地后觉得自己无所不能！|You screamed in midair and landed feeling invincible!', { happy: 12, stress: -15, money: -300 }, '出了意外，你摔断了腿。|There was an accident; you broke your leg.', { health: -20, money: -300 })),
      O('我恐高|I\'m afraid of heights', R('你在地面上给他们拍照。|You took photos from the ground.', {}))
    ], { w: .5 }),
    E('a_tax_audit', [25, 75], '税务稽查|Tax Audit', '🧾', '税务局找上门来，要查你的账。|The tax office shows up to audit your finances.', [
      O('配合调查|Cooperate', function (c) { if (G.S.cnt.crimes && G.ch(.5)) { var f = Math.round(c.p.money * .3); c.money(-f); return G.L('你补缴了{m}税款和罚款。|You paid {m} in back taxes and fines.', { m: G.M(f) }); } return '账目清清白白，没问题。|Your books were clean.'; }),
      O('找关系|Pull strings', RC(.5, '事情被压下去了。|It went away.', { karma: -5, money: -2000 }, '找错了人，反而被举报了！|You approached the wrong person and got reported!', { heat: 25, money: -2000 }))
    ], { w: function (S, p) { return G.netWorth() > G.$(1e6) ? .8 : .1; } }),
    E('a_bigbet', [22, 60], '赌一把|A Big Bet', '🎰', '朋友拉你去地下赌场，说今晚手气一定好。|A friend drags you to an underground casino, swearing tonight\'s your lucky night.', [
      O('跟着去|Go along', function (c) { return G.gambleFlow({ n: '地下赌场|Underground Casino', i: '🎰' }, G.pick(['dice', 'blackjack'])).then(function () { c.add('heat', 4); return '你从赌场走了出来。|You walked out of the casino.'; }); }),
      O('不去|Pass', R('你拒绝了。|You declined.', {}))
    ], { w: function (S, p) { return p.hab.gamble > 30 ? 2 : .4; } }),
    E('a_volunteer_teach', [20, 40], '支教|Volunteer Teaching', '🏫', '一个公益组织在招募去偏远山区支教的老师。|A charity is recruiting volunteer teachers for remote mountain villages.', [
      O('去支教一年|Teach there for a year', function (c) { if (c.p.job) G.career.leave(); H.fx(c, { karma: 15, happy: 8, eq: 4, money: -1000 }); return '孩子们清澈的眼睛让你终生难忘。|You\'ll never forget the bright eyes of those children.'; }),
      O('捐些书本|Donate books', R('你寄去了一箱书。|You sent a box of books.', { karma: 4, money: -100 }))
    ], { w: .4 })
  ]);
})();
