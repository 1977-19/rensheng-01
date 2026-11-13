/* Stories for version 1.6: five new families (spies, a casino dynasty, the circus, a lottery fortune, private
   investigators) and a set of surprising everyday events. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  [
    { id: 'spyfam', n: '特工家庭|A Family of Spies', d: '爸妈说他们在一家外贸公司上班，经常出差，回来时总带着不同国家的硬币。|Your parents say they work for a trading company. They travel constantly and always come home with coins from different countries.', vip: 0,
      w: [200000, 1500000], inc: [90000, 220000], job: ['外贸公司职员|Trading Company Employee', '外交部翻译|Foreign Ministry Interpreter'], st: { smarts: 8, eq: 8 }, sib: [0, 1], fl: ['spyfam'] },
    { id: 'casino', n: '赌王家族|Casino Dynasty', d: '家族在海边的那座城市开了六家赌场。你出生那天，所有赌桌都免费加送了一轮筹码。|The family runs six casinos in a city by the sea. On the day you were born, every table got a free round of chips.', vip: 0,
      w: [30000000, 300000000], inc: [3000000, 15000000], job: ['赌场大亨|Casino Magnate', '娱乐集团董事长|Entertainment Group Chairman'], st: { eq: 6, looks: 3 }, sib: [1, 4], fl: ['rich'] },
    { id: 'circus', n: '马戏团家庭|Circus Family', d: '你在马戏团的帐篷里出生，第一个玩伴是一头大象。|You were born in a circus tent; your first playmate was an elephant.', vip: 0,
      w: [5000, 40000], inc: [18000, 45000], job: ['空中飞人|Trapeze Artist', '驯兽师|Animal Trainer', '小丑|Clown'], st: { health: 10, looks: 3 }, sib: [1, 3] },
    { id: 'lottery', n: '彩票暴富家庭|Lottery Winners', d: '你出生前一年，爸爸用你妈妈的生日买的彩票中了头奖。|The year before you were born, your dad won the jackpot with a ticket using your mum\'s birthday.', vip: 0,
      w: [3000000, 20000000], inc: [20000, 60000], job: ['彩票中奖者|Lottery Winner', '待业|Between Jobs'], st: { happy: 5 }, sib: [0, 2], fl: ['rich'] },
    { id: 'detective', n: '私家侦探家庭|Private Investigators', d: '爸爸是私家侦探，妈妈是他最好的搭档。家里的冰箱上贴满了嫌疑人的照片。|Dad is a private investigator and Mum is his best partner. The fridge is covered in photos of suspects.', vip: 0,
      w: [100000, 500000], inc: [60000, 160000], job: ['私家侦探|Private Investigator'], st: { smarts: 6, eq: 4 }, sib: [0, 1] }
  ].forEach(function (o) { if (!G.ORIGIN[o.id]) { G.ORIGINS.push(o); G.ORIGIN[o.id] = o; } });
  var fc = G.famClass;
  if (fc) G.famClass = function () { var c = fc.apply(this, arguments), p = S() && S().p; if (p && p.origin === 'casino') c = Math.max(c, 3); if (p && p.origin === 'lottery') c = Math.max(c, 2); return c; };
  var cr = G.life.create;
  G.life.create = function (o) { var r = cr.apply(this, arguments), p = S().p; if (p.origin === 'spyfam') p.flags.spyfam = 1; return r; };
  function OE(id, org, a, title, icon, t, o, x) { x = x || {}; var f = x.if; x.if = function (S2, p) { return p.origin === org && !p.flags.heir && (!f || f(S2, p)); }; if (x.w == null) x.w = 2.6; return E(id, a, title, icon, t, o, x); }

  G.evs([
    OE('or_spy_drawer', 'spyfam', [8, 13], '抽屉里的东西|In the Drawer', '🔫', '你在爸妈卧室的抽屉夹层里，找到了三本护照——照片都是爸爸，名字全不一样。|In a hidden compartment of your parents\' drawer you find three passports — all with Dad\'s photo, all with different names.', [
      O('放回去，假装没看见|Put them back and say nothing', R('那天晚饭，爸爸看了你一眼，笑着给你夹了块肉。你总觉得他知道。|At dinner Dad glanced at you and smiled as he served you meat. You felt sure he knew.', { smarts: 3, eq: 3 })),
      O('拿着护照去问爸爸|Ask Dad about them', R('爸爸沉默了很久：“等你十八岁，我会告诉你一切。”|Dad was silent for a long time. "When you\'re eighteen, I\'ll tell you everything."', { par: 3 }))
    ]),
    OE('or_spy_truth', 'spyfam', [16, 19], '十八岁的真相|The Truth at Eighteen', '🕶️', '爸妈把你叫进书房，锁上门：“我们不是外贸公司的人。我们为国家工作，已经二十年了。”|Your parents call you into the study and lock the door: "We don\'t work for a trading company. We\'ve worked for our country for twenty years."', [
      O('我也想加入|I want to join too', function (c) { c.p.flags.spyYouth = 0; (S().pendQ = S().pendQ || []).push({ id: 'spy_youth', prm: { ag: c.p.country } }); return '妈妈叹了口气：“我就知道。”|Mum sighed: "I knew it."'; }),
      O('我只想过普通人的生活|I just want an ordinary life', R('爸爸拍拍你的肩：“这正是我们这些年拼命守护的东西。”|Dad patted your shoulder: "That\'s exactly what we\'ve been protecting all these years."', { happy: 4, par: 4 }))
    ]),
    OE('or_casino_table', 'casino', [10, 16], '赌桌旁的少年|At the Tables', '🎰', '爷爷带你走过赌场大厅，指着一个输红了眼的人说：“记住，庄家永远不赌。”|Grandpa walks you through the casino floor and points at a man losing everything: "Remember — the house never gambles."', [
      O('记在心里|Remember it', R('你这辈子都没有碰过赌桌。|You never touched a gaming table in your life.', { smarts: 3, karma: 2 })),
      O('偷偷玩一把|Sneak a round', RC(.5, '你赢了，爷爷没收了筹码：“现在你知道它为什么让人上瘾了。”|You won. Grandpa confiscated the chips: "Now you know why it\'s addictive."', { happy: 4 }, '你输光了零花钱，哭着跑回家。|You lost all your pocket money and ran home crying.', { happy: -4 }))
    ]),
    OE('or_casino_license', 'casino', [28, 60], '牌照续期|Licence Renewal', '📜', '政府突然宣布，赌场牌照要重新竞标。|The government suddenly announces the casino licences will be re-tendered.', [
      O('请最好的律师团|Hire the best legal team', RC(.65, '你们保住了全部六张牌照。|You kept all six licences.', { money: 300000, fame: 3 }, '丢了两张牌照，损失惨重。|You lost two licences — a heavy blow.', { money: -400000, happy: -6 })),
      O('转型做酒店和演出|Pivot to hotels and shows', R('五年后，家族的酒店和剧场比赌场还赚钱。|Five years on, the hotels and theatres earned more than the casinos.', { money: 150000, karma: 3 }))
    ]),
    OE('or_circus_trapeze', 'circus', [6, 14], '第一次上秋千|Your First Trapeze', '🎪', '妈妈把你抱上了高空秋千：“别往下看，看着我的手。”|Mum lifts you onto the high trapeze: "Don\'t look down. Look at my hands."', [
      O('松手，飞过去|Let go and fly', RC(.75, '你稳稳地被妈妈接住了。台下的观众站起来鼓掌。|Mum caught you cleanly. The audience rose to applaud.', { happy: 10, health: 3, fame: 1 }, '你掉进了安全网，还是笑得很开心。|You fell into the net, laughing anyway.', { happy: 4 })),
      O('哭着要下来|Cry to come down', R('爸爸把你抱下来，给了你一个棉花糖。|Dad lifted you down and gave you candyfloss.', { happy: 2 }))
    ]),
    OE('or_circus_last', 'circus', [18, 30], '最后一场演出|The Last Show', '🐘', '马戏团要解散了。最后一场演出，团长问你愿不愿意压轴。|The circus is closing. For the final show, the ringmaster asks you to close the night.', [
      O('压轴演出|Close the show', R('谢幕的时候，所有人都哭了，包括那头老象。|At the curtain call everyone cried — even the old elephant.', { happy: 10, fame: 3 })),
      O('去城里找份工作|Go find work in the city', R('你把演出服叠好放进箱子，坐上了进城的大巴。|You folded your costume into a trunk and caught the bus to the city.', { smarts: 2 }))
    ]),
    OE('or_lottery_relatives', 'lottery', [8, 20], '突然冒出来的亲戚|Relatives Out of Nowhere', '🤲', '中奖以后，家里突然多了很多你从没见过的“亲戚”。|Since the jackpot, the house fills with "relatives" you\'ve never met.', [
      O('帮爸妈一起拒绝|Help your parents say no', R('爸爸说：“你比我们还清醒。”|Dad said: "You\'re wiser than we are."', { eq: 4, par: 3 })),
      O('觉得应该分一点|Think they should share a little', R('钱分出去了，亲戚却越来越多。|The money went out, and more relatives came.', { karma: 3, happy: -2 }))
    ]),
    OE('or_lottery_end', 'lottery', [18, 40], '钱花完了吗|Is the Money Gone?', '📉', '你发现，爸妈的存款只剩下当年的十分之一。|You discover your parents have one tenth of the jackpot left.', [
      O('帮他们理财|Manage it for them', RC(.6, '你把剩下的钱做了稳健投资，总算保住了。|You invested the rest carefully and saved it.', { smarts: 3, par: 4 }, '投资也亏了一半。|The investments lost half as well.', { happy: -6 })),
      O('靠自己|Make your own way', R('你开始打工，第一次知道钱是怎么来的。|You took a job, and learned for the first time where money comes from.', { eq: 4, money: 2000 }))
    ]),
    OE('or_pi_case', 'detective', [10, 16], '爸爸的案子|Dad\'s Case', '🔎', '爸爸查的一桩失踪案卡住了。你看着冰箱上的照片，突然发现了一个细节。|Dad\'s missing-person case has stalled. Staring at the photos on the fridge, you suddenly notice something.', [
      O('告诉爸爸|Tell Dad', RC(.6, '案子破了！爸爸把报酬的一半给了你。|The case cracked! Dad gave you half the fee.', { smarts: 5, money: 500, par: 5 }, '爸爸摸摸你的头：“好眼力，可惜不对。”|Dad ruffled your hair: "Good eye — but not quite."', { smarts: 2 })),
      O('自己偷偷去查|Investigate on your own', RC(.4, '你一个人找到了失踪的人。报纸上登了你的照片。|You found the missing person yourself. Your photo made the paper.', { fame: 4, smarts: 4 }, '你被人发现，吓得跑回了家。|You were spotted and fled home in terror.', { stress: 10 }))
    ]),
    // surprises for anyone
    E('x_doppelganger', [16, 70], '另一个你|Your Double', '🪞', '你在地铁上看见一个人，长得和你一模一样，连发旋都一样。|On the subway you see someone identical to you — down to the swirl in your hair.', [
      O('上去打招呼|Say hello', RC(.4, '你们做了DNA检测——你们是出生时被分开的双胞胎。|A DNA test confirmed it: twins, separated at birth.', { happy: 12 }, '对方戴上耳机，下一站就下车了。|They put in earbuds and got off at the next stop.', { happy: 1 })),
      O('拍张照发朋友圈|Snap a photo for social media', R('照片火了，两万人在评论区找你们的“第三个分身”。|The photo went viral; twenty thousand people hunted for a "third copy" in the comments.', { fame: 2, happy: 4 }))
    ]),
    E('x_wrong_package', [18, 80], '寄错的包裹|The Wrong Parcel', '📦', '快递员送来一个沉甸甸的包裹，收件人不是你。里面是一摞摞现金。|A heavy parcel arrives addressed to someone else. Inside: bundles of cash.', [
      O('报警|Call the police', R('警察说这是一起诈骗案的赃款。你收到了一面锦旗。|Police said it was proceeds of a fraud ring. You received a commendation banner.', { karma: 8, fame: 1 })),
      O('原样退回|Return it unopened', R('几天后，一个戴墨镜的人在门口放了一箱水果。|A few days later, a man in sunglasses left a box of fruit at your door.', { karma: 3 })),
      O('留下|Keep it', function (c) { if (G.ch(.5)) { c.money(G.$(20000)); return '没有人来找。你心里一直不踏实。|No one ever came for it. You never felt at ease.'; } c.p.h.heat = (c.p.h.heat || 0) + 30; return '三天后，两个陌生人敲开了你的门。|Three days later, two strangers knocked on your door.'; })
    ]),
    E('x_elevator_ceo', [20, 45], '电梯故障|Stuck in a Lift', '🛗', '电梯卡在了十七楼和十八楼之间。和你一起被困的，是一家大公司的老板。|The lift sticks between floors 17 and 18. Trapped with you: the head of a major company.', [
      O('聊聊天缓解紧张|Chat to ease the tension', RC(.45, '出电梯时，他递给你一张名片：“下周一来公司找我。”|As the doors opened he handed you a card: "Come see me Monday."', { eq: 3, perf: 10, happy: 6 }, '他全程在打电话。|He spent the whole time on the phone.', {})),
      O('安静地等|Wait quietly', R('四十分钟后，消防员把你们救了出来。|Forty minutes later, firefighters got you out.', {}))
    ]),
    E('x_ancestor', [20, 80], '家谱里的名字|A Name in the Family Tree', '📜', '整理老房子时，你翻出一本发黄的家谱。上面写着，你的祖上出过一位大将军。|Clearing out the old house, you find a yellowed family register: one of your ancestors was a great general.', [
      O('去祖籍地寻根|Visit the ancestral village', R('村口的老人一看你的脸就说：“像，太像了。”|At the village gate an old man saw your face and said: "The likeness — it\'s uncanny."', { happy: 8, eq: 2 })),
      O('捐给博物馆|Donate it to a museum', R('博物馆专门为它办了一个小展览。|The museum built a small exhibit around it.', { fame: 3, karma: 3 }))
    ]),
    E('x_ufo', [12, 80], '夜空中的光|Lights in the Night Sky', '🛸', '深夜，你看见三个光点排成三角形，悄无声息地掠过城市上空。|Late at night, three lights in a triangle glide silently over the city.', [
      O('拍下来|Film it', RC(.3, '视频上了新闻，一位天文学家说他也解释不了。|The clip made the news; an astronomer admitted he couldn\'t explain it.', { fame: 3, happy: 5 }, '视频里只有一片模糊。|The footage was just a blur.', {})),
      O('什么也不说|Tell no one', R('从那以后，你常常抬头看天。|Ever since, you often look up at the sky.', { happy: 2 }))
    ]),
    E('x_old_ticket', [18, 85], '旧外套里的彩票|A Ticket in an Old Coat', '🎟️', '你在一件旧外套口袋里，翻出一张三个月前的彩票。|In an old coat pocket you find a lottery ticket from three months ago.', [
      O('对一下号码|Check the numbers', RC(.12, '中了二等奖！离兑奖截止还有两天。|Second prize! Two days before it expired.', { money: 50000, happy: 15 }, '一个号码都没中。|Not a single number.', { happy: -1 })),
      O('扔了|Throw it out', R('你永远不会知道它有没有中。|You\'ll never know if it won.', {}))
    ]),
    E('x_dna_sibling', [20, 75], 'DNA检测|A DNA Test', '🧬', '你做了一次基因检测。结果显示，你有一个从未见过的同父异母的兄弟姐妹。|A DNA kit reveals a half-sibling you\'ve never met.', [
      O('联系对方|Reach out', function (c) { var n = N.make({ rel: 'sibling', age: c.p.age + G.ri(-10, 10), aff: 30, sur: c.p.sur }); n.illegit = 1; n.half = 'father'; n.older = N.age(n) > c.p.age; n.pin = 1; c.add('happy', 6); return '你们约在咖啡馆见面。对方笑起来的样子，和你爸爸一模一样。|You met at a café. When they smiled, they looked just like your father.'; }),
      O('就当没看见|Pretend you never saw it', R('那封邮件一直躺在你的收件箱里。|The email stayed in your inbox.', { stress: 4 }))
    ])
  ]);
})();
