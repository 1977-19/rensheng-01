/* Workplace, service, underworld & fame events */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function job(S, p) { return H.employed(S, p); }
  function coll(c) { var cs = N.rel('colleague'); var n = cs.length ? G.pick(cs) : N.make({ rel: 'colleague', age: G.clamp(c.p.age + G.ri(-8, 10), 20, 64), job: '同事|Coworker', inc: c.p.job ? c.p.job.sal : 0 }); c.npc = n; c.prm.n = n.name; var pr = G.pr(n.g); for (var k in pr) c.prm[k] = pr[k]; }
  G.evs([
    E('w_pie', [20, 64], '老板画饼|The Boss\'s Big Promises', '🥧', '老板拍着你的肩膀：“好好干，明年公司上市，你就是元老！”|Your boss pats your shoulder: "Work hard — when we IPO next year, you\'ll be a founding legend!"', [
      O('信了，拼命干|Believe it and grind', RC(.25, '公司真的上市了，你的期权值了一大笔钱！|The company actually went public, and your options are worth a fortune!', { money: 40000, happy: 15 }, '一年后公司没上市，老板又画了新的饼。|A year later, no IPO — just a new round of promises.', { stress: 10, perf: 5 })),
      O('左耳进右耳出|In one ear, out the other', R('你继续按部就班。|You keep doing your job as usual.', {}))
    ], { if: job }),
    E('w_teambuild', [20, 64], '团建|Team Building', '⛺', '公司组织周末团建，强制参加。|The company has a mandatory weekend team-building trip.', [
      O('积极参与|Dive in', R('你在团建中大放异彩，同事们对你刮目相看。|You shone at team building; coworkers see you in a new light.', { eq: 2, happy: 2, perf: 2 })),
      O('请病假|Call in sick', R('你在家睡了两天。|You slept at home for two days.', { happy: 3, perf: -2 }))
    ], { rep: 1, cd: 3, if: job }),
    E('w_annual', [20, 64], '年会抽奖|Year-End Raffle', '🎊', '公司年会抽奖环节，主持人念到了你的号码！|At the company year-end party, the host calls your raffle number!', [
      O('上台领奖|Go up and claim it', function (c) { var r = G.ri(0, 3); var prize = [['一台最新款手机|the latest smartphone', 1000], ['一个保温杯|a thermos', 20], ['现金大奖|the cash grand prize', 5000], ['一辆汽车|a car', 20000]][r]; c.money(c.$(prize[1])); H.fx(c, { happy: 4 + r * 3 }); c.prm.x = prize[0]; return '你抽中了{x}！|You won {x}!'; })
    ], { good: 1, rep: 1, cd: 3, if: job }),
    E('w_scapegoat', [20, 64], '背锅|Scapegoat', '🍳', '项目出了大问题，领导让你背锅。|A project went badly wrong, and your manager wants you to take the blame.', [
      O('据理力争|Fight back with facts', RC(function (c) { return .35 + c.p.st.eq / 200; }, '你拿出证据，真正的责任人浮出水面。|You produced evidence; the real culprit was exposed.', { perf: 6, rep: 3 }, '你得罪了领导，日子不好过了。|You offended your manager; life got harder.', { perf: -10, happy: -6 })),
      O('认了|Take it', R('你背下了锅，领导暗示会记着你的好。|You took the fall; your manager hinted they\'d remember.', { perf: -4, happy: -6 }))
    ], { bad: 1, if: job }),
    E('w_credit', [20, 64], '抢功劳|Credit Stolen', '🏷️', '{n}把你熬夜做的方案说成是{his}的。|{n} presented the plan you pulled all-nighters on as {his} own.', [
      O('当众揭穿|Call it out publicly', RC(.55, '大家都知道了真相，{n}很没面子。|Everyone learned the truth, and {n} lost face.', { perf: 6, npc: -20 }, '老板反而觉得你小题大做。|The boss thought you were making a fuss.', { perf: -4, npc: -20 })),
      O('私下找{him}谈|Talk to {him} privately', R('{n}支支吾吾地道了歉。|{n} mumbled an apology.', { npc: -5 })),
      O('忍了|Let it go', R('你默默记下了这一笔。|You quietly filed it away.', { happy: -5 }))
    ], { bad: 1, if: job, prep: coll }),
    E('w_overwork', [22, 60], '996|Grinding 996', '🥱', '公司开始实行“996”工作制，早九晚九，一周六天。|The company adopts a "996" schedule: 9 a.m. to 9 p.m., six days a week.', [
      O('咬牙坚持|Grit your teeth', R('你的身体被掏空了，但老板很满意。|You\'re running on empty, but the boss is pleased.', { health: -6, perf: 8, stress: 15, night: 20 })),
      O('到点就走|Leave on time', RC(.6, '你成了公司里唯一准时下班的人，居然也没事。|You became the only one leaving on time — and nothing happened.', { happy: 3 }, '你被约谈了，绩效被打了低分。|You got called in, and your review tanked.', { perf: -10 })),
      O('辞职|Quit', function (c) { G.career.leave(); H.fx(c, { happy: 6, stress: -20 }); return '你潇洒地离开了这家公司。|You walked out with your head held high.'; })
    ], { y: [2010, 2100], if: function (S, p) { return job(S, p) && ['coder', 'pm', 'game', 'ai', 'sales', 'mkt'].indexOf(p.job.id) >= 0; } }),
    E('w_bigclient', [22, 64], '大客户|The Big Client', '🤝', '一个大客户点名要你负责他们的项目。|A major client specifically requests you to lead their project.', [
      O('全力以赴|Give it everything', async function (c) { var r = await c.game('quiz', { name: '客户提案|Client Pitch' }); if (r.score > .5) { H.fx(c, { perf: 12, money: 3000, happy: 6 }); return '项目大获成功，你拿到了一笔奖金！|The project was a hit, and you earned a bonus!'; } H.fx(c, { perf: -6, stress: 8 }); return '客户不满意，项目黄了。|The client was unhappy, and the deal fell through.'; }),
      O('推给别人|Pass it to someone else', R('同事接了项目，你松了口气。|A coworker took it, and you breathe easier.', { perf: -2 }))
    ], { if: job }),
    E('w_mistake', [20, 64], '工作失误|A Costly Mistake', '😱', '你在工作中犯了一个大错，给公司造成了损失。|You made a serious mistake at work that cost the company money.', [
      O('主动承认并补救|Own it and fix it', R('你加班加点补救，领导反而欣赏你的担当。|You worked overtime to fix it, and leadership respected your accountability.', { perf: 2, stress: 10 })),
      O('掩盖过去|Cover it up', RC(.5, '没人发现。|Nobody noticed.', { karma: -4 }, '东窗事发，你被开除了。|It came out, and you were fired.', { happy: -12 }))
    ], { bad: 1, if: job }),
    E('w_office_romance', [20, 50], '办公室恋情|Office Romance', '💘', '同事{n}最近总是找借口和你一起吃午饭。|Your coworker {n} keeps finding excuses to have lunch with you.', [
      O('试着交往|Give it a shot', function (c) { if (N.attract(c.npc) > .35 || G.ch(.4)) { G.love.becomeLovers(c.npc); return '你们开始了秘密的办公室恋情。|You began a secret office romance.'; } N.addAff(c.npc, 5); return '你们聊得很愉快，但没擦出火花。|You got along, but no sparks.'; }),
      O('保持距离|Keep your distance', R('你不想把工作和感情混在一起。|You don\'t want to mix work and romance.', {}))
    ], { if: function (S, p) { return job(S, p) && H.single(S, p); }, prep: function (c) { var n = N.mkRomantic({ rel: 'colleague', love: G.ri(35, 60), aff: 25 }); c.npc = n; c.prm.n = n.name; } }),
    E('w_bossdaughter', [22, 40], '老板的千金/公子|The Boss\'s Kid', '👑', '老板的孩子{n}对你一见钟情，展开了猛烈追求。|The boss\'s kid, {n}, fell for you at first sight and is pursuing you hard.', [
      O('接受|Accept', function (c) { G.love.becomeLovers(c.npc); c.p.job.perf += 10; return '你和老板的孩子在一起了，公司里的人看你的眼神都变了。|You\'re now dating the boss\'s kid; everyone at work looks at you differently.'; }),
      O('拒绝|Turn them down', R('{n}很伤心，老板对你冷淡了不少。|{n} was hurt, and the boss cooled toward you.', { perf: -6 }))
    ], { w: function (S, p) { return p.st.looks > 65 ? 1 : .2; }, if: function (S, p) { return job(S, p) && H.single(S, p); }, prep: function (c) { var n = N.mkRomantic({ rel: 'contact', tags: ['rich'], love: 70, aff: 30 }); n.pin = 1; c.npc = n; c.prm.n = n.name; } }),
    E('w_politics', [25, 64], '站队|Office Politics', '♟️', '公司两位副总斗得厉害，都在拉拢你。|Two VPs are locked in a power struggle, and both want you on their side.', [
      O('跟A|Side with VP A', RC(.5, '你押对了宝，A上位后提拔了你。|You backed the winner, who promoted you.', { perf: 15 }, '你站错了队，被边缘化了。|You backed the loser and got sidelined.', { perf: -12 })),
      O('跟B|Side with VP B', RC(.5, '你押对了宝，B上位后提拔了你。|You backed the winner, who promoted you.', { perf: 15 }, '你站错了队，被边缘化了。|You backed the loser and got sidelined.', { perf: -12 })),
      O('保持中立|Stay neutral', R('你两边都不得罪，但也两边都不亲。|You offended no one — and gained no allies.', {}))
    ], { if: function (S, p) { return job(S, p) && p.job.rank >= 1; } }),
    E('w_manager', [25, 64], '带团队|Leading a Team', '👥', '你第一次带团队，有个老员工不服管。|You\'re leading a team for the first time, and a veteran won\'t take orders.', [
      O('以理服人|Win them over with reason', R('你用实力证明了自己。|You proved yourself through results.', { eq: 3, perf: 4 })),
      O('杀鸡儆猴|Make an example of them', R('团队服了，但气氛有点紧张。|The team fell in line, but tension lingers.', { perf: 6, eq: -1 }))
    ], { if: function (S, p) { return job(S, p) && p.job.rank === 2 && p.job.yr === 0; } }),
    E('w_bonus', [20, 64], '年终奖|Year-End Bonus', '🧧', '年终奖发下来了！|Year-end bonuses are out!', [
      O('打开看看|Open it', function (c) { var j = c.p.job, b = Math.round(j.sal * (j.perf > 70 ? G.rf(.2, .6) : j.perf > 45 ? G.rf(.05, .2) : 0)); c.money(b); c.prm.m = G.M(b); return b ? '你拿到了{m}年终奖！|You got a {m} bonus!' : '你的年终奖……是一箱橘子。|Your bonus... is a box of oranges.'; })
    ], { rep: 1, cd: 2, if: job }),
    E('w_startup_offer', [24, 45], '创业邀约|Co-founder Offer', '🚀', '一个朋友邀请你一起创业，做联合创始人。|A friend invites you to co-found a startup.', [
      O('辞职加入|Quit and join', function (c) { G.career.leave(); G.biz.start(G.pick(Object.keys(G.INDUSTRY).filter(function (k) { return G.S.year >= G.INDUSTRY[k].y0; })), 50000); G.S.assets.company.own = .4; return '你成了联合创始人，开始了创业之路！|You became a co-founder and started the entrepreneurial journey!'; }),
      O('婉拒|Decline', R('你更喜欢稳定的工作。|You prefer a stable job.', {}))
    ], { if: function (S, p) { return job(S, p) && !S.assets.company; }, w: .5 }),
    // ---------- military ----------
    E('m_letter', [17, 60], '家书|Letter from Home', '✉️', '你在军营里收到了一封家书。|In the barracks, you receive a letter from home.', [
      O('读了一遍又一遍|Read it again and again', R('你把信贴身收好，训练更有劲了。|You tuck it close to your heart and train harder.', { happy: 6, par: 4 }))
    ], { if: function (S, p) { return p.mil; } }),
    E('m_hazing', [17, 30], '新兵连|Boot Camp', '🪖', '老兵对新兵格外“照顾”，让你天天加练。|The veterans take "special care" of recruits, making you do extra drills.', [
      O('咬牙坚持|Endure it', R('你脱了一层皮，但变得更强了。|It nearly broke you, but you got stronger.', { fit: 8, health: 2, happy: -4 })),
      O('向上级反映|Report it', R('上级批评了老兵，但你成了“告状精”。|The veterans got reprimanded, but now you\'re the snitch.', { happy: -2 }))
    ], { if: function (S, p) { return p.mil && p.mil.yrs <= 1 && !p.mil.off; } }),
    E('m_comrade', [18, 60], '生死战友|Brothers in Arms', '🫡', '训练中，战友{n}替你挡下了一次意外。|During training, your comrade {n} shielded you from an accident.', [
      O('结为兄弟|Become sworn brothers', function (c) { c.npc.rel = 'friend'; N.addAff(c.npc, 40); c.npc.pin = 1; return '你们从此是过命的交情。|From then on, you\'d die for each other.'; })
    ], { if: function (S, p) { return p.mil; }, prep: function (c) { var n = N.make({ rel: 'colleague', g: c.p.g, age: G.clamp(c.p.age + G.ri(-3, 3), 18, 50), job: '战友|Comrade' }); c.npc = n; c.prm.n = n.name; } }),
    // ---------- police ----------
    E('p_dilemma', [20, 60], '执法两难|Law vs. Mercy', '⚖️', '你抓到一个偷奶粉的年轻妈妈，她跪着说孩子饿了两天。|You catch a young mother stealing baby formula. She kneels, saying her baby hasn\'t eaten in two days.', [
      O('依法办事|Follow the law', R('你按规定处理了。|You processed it by the book.', { karma: -2 })),
      O('自掏腰包帮她买|Pay for it yourself', R('你帮她付了钱，还联系了社区救助。|You paid and connected her with community aid.', { karma: 10, money: -40, fame: 1 }))
    ], { if: function (S, p) { return p.pol; } }),
    E('p_partner', [20, 60], '搭档|Your Partner', '🚓', '新来的搭档{n}是个热血新人。|Your new partner, {n}, is a hot-blooded rookie.', [
      O('好好带{him}|Mentor {him}', function (c) { N.addAff(c.npc, 25); c.npc.rel = 'friend'; return '你们配合默契，成了警队的黄金搭档。|You clicked and became the precinct\'s golden duo.'; })
    ], { if: function (S, p) { return p.pol; }, prep: function (c) { var n = N.make({ rel: 'colleague', age: G.clamp(c.p.age - G.ri(2, 8), 21, 40), job: '警察|Police Officer' }); c.npc = n; c.prm.n = n.name; var pr = G.pr(n.g); for (var k in pr) c.prm[k] = pr[k]; } }),
    // ---------- government ----------
    E('g_petition', [22, 70], '群众上访|Citizens\' Petition', '📢', '一群村民来上访，说开发商强拆了他们的房子。|Villagers arrive to petition: a developer demolished their homes.', [
      O('为民做主|Stand up for them', RC(.6, '你顶住压力，为村民讨回了公道。|You withstood pressure and got justice for the villagers.', { karma: 10, fame: 3 }, '开发商背景太硬，你被调离了岗位。|The developer was too well-connected; you were reassigned.', { karma: 10, happy: -8 })),
      O('和稀泥|Smooth it over', R('你两边安抚，事情不了了之。|You placated both sides and it fizzled out.', {})),
      O('帮开发商压下去|Help the developer bury it', R('开发商给你送来一份“厚礼”。|The developer sent you a generous "gift."', { money: 10000, karma: -12, heat: 10 }))
    ], { if: function (S, p) { return p.gov && p.gov.track === 'poli'; } }),
    E('g_scandal', [25, 80], '政治丑闻|Political Scandal', '📰', '对手翻出了你年轻时的一张照片，在媒体上大做文章。|Rivals dug up an old photo from your youth and splashed it across the media.', [
      O('坦诚道歉|Apologize candidly', R('你的坦诚赢得了一些支持。|Your honesty won some support.', { fame: 2 })),
      O('反击对手|Hit back at your rivals', RC(.5, '你抖出了对手更大的黑料，局势反转！|You exposed even bigger dirt on them — the tables turned!', { fame: 4 }, '越描越黑，支持率暴跌。|It backfired, and your approval plummeted.', { fame: -4 }))
    ], { if: function (S, p) { return p.gov && p.gov.track === 'poli' && G.C[p.country].dem; } }),
    // ---------- underworld ----------
    E('u_debt', [16, 60], '收债|Debt Collection', '💰', '老大让你去收一笔账，欠债的是个开小饭馆的老实人。|The boss sends you to collect a debt from an honest man who runs a small diner.', [
      O('狠狠逼债|Squeeze him hard', R('你收到了钱，饭馆老板关了门。|You got the money, and the diner closed.', { money: 2000, karma: -10, rep: 5 })),
      O('宽限几天|Give him a few more days', R('老板感激涕零，你在帮里被说心软。|He wept with gratitude; the gang calls you soft.', { karma: 6, rep: -3 })),
      O('自己垫钱|Cover it yourself', R('你自掏腰包交了差，没人知道。|You paid it out of pocket; nobody knew.', { money: -2000, karma: 10 }))
    ], { if: function (S, p) { return p.gang; } }),
    E('u_betray', [16, 70], '内鬼|The Mole', '🐀', '帮里出了内鬼，警察对你们的行动了如指掌。你怀疑是{n}。|There\'s a mole in the gang — the cops know every move. You suspect {n}.', [
      O('告诉老大|Tell the boss', function (c) { c.npc.alive = false; c.npc.died = G.S.year; H.fx(c, { karma: -10, rep: 10 }); return '{n}从此消失了。|{n} was never seen again.'; }),
      O('私下警告{him}跑路|Warn {him} to run', function (c) { c.npc.rel = 'friend'; H.fx(c, { karma: 6 }); return '{n}连夜离开了这座城市。|{n} left the city that night.'; }),
      O('装作不知道|Pretend not to know', R('你什么都没说。|You said nothing.', { heat: 8 }))
    ], { if: function (S, p) { return p.gang; }, prep: function (c) { var gs = N.rel('gang'); var n = gs.length ? G.pick(gs) : N.make({ rel: 'gang', age: G.ri(20, 40) }); c.npc = n; c.prm.n = n.name; var pr = G.pr(n.g); for (var k in pr) c.prm[k] = pr[k]; } }),
    E('u_godson', [16, 50], '扶持新人|A Young Recruit', '🧒', '一个十几岁的孩子想加入帮派，眼神里满是崇拜。|A teenager wants to join the gang, eyes full of admiration.', [
      O('收下{him}|Take {him} in', R('你多了一个小弟。|You gained a new follower.', { rep: 4, karma: -5 })),
      O('把{him}赶回家上学|Send {him} back to school', R('你骂了{him}一顿，让{him}好好读书。|You chewed {him} out and told {him} to study.', { karma: 8 }))
    ], { if: function (S, p) { return p.gang && p.gang.rank >= 2; }, prep: function (c) { var g = G.ch(.7) ? 'm' : 'f'; c.prm.him = g === 'm' ? '他|him' : '她|her'; } }),
    // ---------- fame ----------
    E('f_stalker', [16, 70], '私生饭|Obsessive Fan', '👀', '一个疯狂的粉丝一直跟踪你，还守在你家楼下。|An obsessive fan keeps following you and camps outside your home.', [
      O('报警|Call the police', R('警方出面处理了。|The police handled it.', { happy: -3 })),
      O('请保镖|Hire bodyguards', R('你请了两个保镖。|You hired two bodyguards.', { money: -5000 }))
    ], { bad: 1, if: function (S, p) { return p.fc && p.fc.rank >= 2 || p.st.fame > 60; } }),
    E('f_award', [16, 80], '颁奖典礼|Awards Night', '🏆', '你获得了一项重要奖项的提名！|You\'re nominated for a major award!', [
      O('盛装出席|Attend in style', function (c) { var win = G.ch(.25 + c.p.fc.perf / 300); if (win) { H.fx(c, { fame: 10, happy: 15 }); c.p.fc.fans = Math.round(c.p.fc.fans * 1.4); G.major('获得大奖|Won a major award'); return '念到你名字的那一刻，你热泪盈眶！|When they called your name, you wept with joy!'; } H.fx(c, { fame: 2, happy: -3 }); return '你陪跑了，但红毯造型上了热搜。|You lost, but your red-carpet look went viral.'; })
    ], { good: 1, if: function (S, p) { return p.fc && p.fc.rank >= 2; } }),
    E('f_collab', [16, 70], '合作邀约|Collaboration Offer', '🎬', '一位顶级导演/制作人邀请你合作。|A top director/producer invites you to collaborate.', [
      O('接下|Accept', async function (c) { var F = G.FAME[c.p.fc.id]; var r = await c.game(F.game === 'sport' ? 'sprint' : F.game, { name: '合作|Collaboration' }); c.p.fc.fans = Math.round(c.p.fc.fans * (1 + r.score * .6)); H.fx(c, { fame: Math.round(r.score * 8), money: 20000 * r.score }); return r.score > .5 ? '作品大爆，你的人气飙升！|The work blew up — your popularity soared!' : '作品反响平平。|The work got a lukewarm reception.'; }),
      O('档期冲突，婉拒|Decline due to scheduling', R('你错过了一个好机会。|You missed a great opportunity.', {}))
    ], { if: function (S, p) { return p.fc && p.fc.rank >= 1; } }),
    E('f_injury', [16, 40], '比赛受伤|Injury', '🤕', '你在比赛中受了重伤。|You were seriously injured in competition.', [
      O('手术后积极康复|Surgery and rehab', R('经过一年的康复，你重返赛场。|After a year of rehab, you returned to competition.', { health: -10, money: -5000 })),
      O('带伤坚持|Play through it', RC(.4, '你咬牙打完了赛季。|You gritted your teeth through the season.', { health: -15 }, '伤势恶化，你不得不提前退役。|The injury worsened; you had to retire early.', { health: -25 }))
    ], { bad: 1, if: function (S, p) { return p.fc && (p.fc.id === 'athlete' || p.fc.id === 'esports'); } }),
    E('f_doping', [16, 40], '诱惑|A Shortcut', '💉', '队医偷偷告诉你，有一种“营养剂”可以大幅提升成绩，查不出来。|The team doctor whispers that a "supplement" can massively boost performance — undetectable.', [
      O('拒绝|Refuse', R('你相信自己的努力。|You trust your own hard work.', { karma: 5 })),
      O('用了|Use it', RC(.6, '你的成绩突飞猛进！|Your performance skyrocketed!', { karma: -10, fame: 5 }, '药检呈阳性，你被禁赛两年，名誉扫地。|You tested positive, were banned for two years, and disgraced.', { karma: -10, fame: -20, happy: -15 }))
    ], { if: function (S, p) { return p.fc && p.fc.id === 'athlete' && p.fc.rank >= 1; } })
  ]);
})();
