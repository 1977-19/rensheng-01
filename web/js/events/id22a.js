/* Version 3.0 identity stories, part 1: red second generation, spy families, spies, royals & monarchs, prison, tycoons.
   Every event here happens at most once in a life, belongs to one identity only, and many are chapters of a
   longer storyline (a later chapter waits for the earlier one and for some years to pass). */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function P() { return G.S && G.S.p; }
  function Y(id, who, a, title, icon, t, opts, ex) {
    return E(id, a, title, icon, t, opts.map(function (o) { return O(o[0], typeof o[1] === 'function' ? o[1] : R(o[2], o[1] || {}), o[3]); }), Object.assign({ who: who, rep: 0, w: 3 }, ex || {}));
  }
  // a later chapter: needs the earlier one done, and some years since
  function after(id, yrs, f) { return function (S2, p) { return S2.done[id] && p.age - (S2.cool[id] || 0) >= (yrs || 1) && (!f || f(S2, p)); }; }
  function kids() { return N.rel('child').filter(function (k) { return k.alive; }); }
  function gpa() { return G.gpa('m'); }
  function nm(c, o) { var p = c.p; var n = N.make({ rel: o.rel || 'contact', g: o.g || (G.ch(.5) ? 'm' : 'f'), age: p.age + G.ri(o.d0 == null ? -5 : o.d0, o.d1 == null ? 6 : o.d1), aff: o.aff || G.ri(25, 45), c: o.c || p.country }); n.pin = 1; if (o.job) n.job = o.job; if (o.tags) n.tags = o.tags; c.prm.n = n.name; c.prm.nid = n.id; return n; }
  function fx(c, e) { H.fx(c, e); }

  /* ======================= 红二代 · RED SECOND GENERATION ======================= */
  G.evs([
    { id: 'r2_farewell', sys: 1, noGate: 1, title: '最后一次敬礼|The Last Salute', icon: '🎖️',
      prep: function (c) { var p = c.p; if (!(p.origin === 'red' || p.flags.redfam) || p.flags.r2Farewell) return false; p.flags.r2Farewell = S().year; },
      t: '爷爷走了。告别厅外排起了长队，有穿军装的老人拄着拐杖站了两个小时。新闻里只有短短一行字，可家里的电话响了一整夜。|Grandpa is gone. Outside the farewell hall the queue stretches on; old men in uniform lean on canes for two hours. The news gives it one line, but the phone at home rings all night.',
      o: [
        { t: '守灵到天亮|Keep vigil until dawn', run: function (c) { fx(c, { eq: 4, karma: 3, happy: -6 }); c.p.flags.gpaMedal = 1; return '天亮的时候，奶奶把一个旧木盒交到你手里：“他说，这个给你。”盒子里是他的勋章。|At dawn Grandma pressed an old wooden box into your hands: "He said this is for you." Inside were his medals.'; } },
        { t: '帮着接待来吊唁的人|Help receive the mourners', run: function (c) { fx(c, { eq: 6, fame: 2, happy: -4 }); var n = nm(c, { rel: 'contact', d0: 20, d1: 35, job: '退休老干部|Retired Veteran Cadre', aff: 55, g: 'm' }); return '一位白发老人握了你很久的手：“我是你爷爷的通信员。以后有事，找我。”他叫{n}。|A white-haired man held your hand a long time: "I was your grandfather\'s orderly. If you ever need anything, come to me." His name is {n}.'; } },
        { t: '一个人去他的书房坐一会儿|Sit alone in his study for a while', run: function (c) { fx(c, { smarts: 3, happy: -3 }); c.p.flags.gpaDiary = 1; return '书桌抽屉里压着一本日记。最后一页写着：“孙子（孙女）比我有出息。”|Under the desk drawer lay a diary. The last page read: "The grandchild will do better than I did."'; } }
      ] },
    Y('r2_canteen', 'red', [5, 11], '大院食堂的肉包子|Meat Buns at the Compound Canteen', '🥟', '大院食堂每周三有肉包子，限量。门口排队的孩子里，有将军的孙子，也有炊事员的女儿。|The compound canteen sells meat buns on Wednesdays — limited. In the queue: a general\'s grandson and the cook\'s daughter.', [
      ['老老实实排队|Wait your turn', { karma: 3, eq: 2 }, '轮到你的时候只剩最后一个。你掰了一半给炊事员的女儿。二十年后，她成了你最信任的朋友。|When your turn came there was one left. You gave half to the cook\'s daughter. Twenty years later she was the friend you trusted most.'],
      ['让警卫员叔叔帮你插个队|Get the guard to slip you in', { happy: 5, karma: -3 }, '你吃到了包子。晚上爷爷知道了，罚你去食堂洗了一星期碗。|You got your bun. That evening Grandpa found out and sent you to wash canteen dishes for a week.']
    ], { if: function () { return !!gpa(); } }),
    Y('r2_bike_crash', 'red', [8, 14], '撞上了红旗轿车|Crashing into the Limousine', '🚲', '你在大院里骑车太快，一头撞上了一辆黑色红旗轿车。车窗摇下来，是一位你只在电视里见过的伯伯。|Racing your bike round the compound, you slam into a black official limousine. The window rolls down: an "uncle" you\'ve only ever seen on TV.', [
      ['立正，敬礼，道歉|Stand to attention, salute, apologise', { eq: 4, fame: 1 }, '伯伯哈哈大笑：“这是老X家的孩子吧？有你爷爷的样子！”第二天他派人送来一辆新车。|The uncle roared with laughter: "Old X\'s grandkid, eh? Just like your grandfather!" Next day someone delivered a new bike.'],
      ['扶起车就跑|Grab the bike and run', { happy: 3, karma: -1 }, '你跑得飞快，可整个大院都知道是谁了。晚饭时，爸爸一句话也没说，只是给你夹了一块肉。|You ran like the wind, but the whole compound knew who it was. At dinner Dad said nothing — just put a piece of meat in your bowl.']
    ]),
    Y('r2_fake_kin', 'red', [24, 65], '冒牌亲戚|The Fake Relative', '🎭', '有人在外面自称是你家的“远房表舅”，靠着这个名头收了好几个老板的钱。今天，受害者找上门来了。|Someone out there claims to be your family\'s "distant uncle" and has taken money from several businessmen on the strength of it. Today the victims are at your door.', [
      ['报警，并公开澄清|Call the police and set the record straight', { karma: 5, fame: 2 }, '骗子被抓了。审讯时他说：“我就是觉得你们家的名字特别好用。”|The con man was caught. In questioning he said: "Your family\'s name just worked so well."'],
      ['自己掏钱把受害者的损失补上|Repay the victims yourself', { money: -40000, karma: 8, eq: 2 }, '你补上了每一分钱。那几个老板逢人便说：“这一家人，真讲究。”|You made good every cent. Those businessmen told everyone: "That family — real class."'],
      ['让人去“处理”一下|Have someone "deal with it"', RC(.6, '骗子消失了，再也没出现。你不想知道他去了哪里。|The man vanished and never reappeared. You didn\'t want to know where.', { karma: -8, stress: 4 }, '这件事被一个记者写成了报道：《权贵之家私了诈骗案》。|A journalist wrote it up: "Elite Family Settles Fraud Case Privately."', { fame: -6, karma: -6, stress: 10 })]
    ]),
    Y('r2_cousin_show', 'red', [20, 45], '表哥炫富上了热搜|Your Cousin Goes Viral', '📱', '表哥在网上晒了一张照片：限量跑车、名表、配文“家里给的”。照片底下已经有十万条评论在扒他的家世——也就是你的家世。|Your cousin posts a photo: limited-edition car, luxury watch, captioned "a gift from the family". A hundred thousand comments are already digging into his family — which is your family.', [
      ['连夜让他删帖道歉|Make him delete it and apologise tonight', { eq: 4, stress: 4 }, '道歉信是你写的。表哥说你“比纪委还狠”。风波一周后平息了。|You wrote the apology. Your cousin said you were "harsher than the discipline commission". It blew over in a week.'],
      ['和他划清界限|Cut ties with him publicly', { karma: 3, fame: -1 }, '奶奶在饭桌上说：“一家人，何必呢。”可从此以后，再也没人敢在网上乱说话。|Grandma said at dinner: "We\'re family — why go so far?" But nobody posted anything stupid again.'],
      ['装作不认识|Pretend you\'ve never heard of him', RC(.5, '风头过去了，没人扒到你。|It blew over; no one traced it to you.', { stress: 2 }, '有网友扒出了你们小时候的合照。|Someone dug up a childhood photo of the two of you.', { fame: -4, stress: 8 })]
    ]),
    Y('r2_documentary', 'red', [25, 60], '纪录片摄制组|The Documentary Crew', '🎬', '电视台要给爷爷那一代人拍一部纪录片，希望采访家属。导演说：“我们想要真实的东西。”|State TV is making a documentary about Grandpa\'s generation and wants to interview the family. The director says: "We want what\'s real."', [
      ['讲爷爷的趣事，不讲功劳|Tell funny stories, not his achievements', { eq: 4, fame: 3, happy: 4 }, '片子播出后，最火的片段是你讲爷爷偷偷藏辣条被奶奶发现。弹幕刷满了“好可爱的老革命”。|After it aired, the most-shared clip was you telling how Grandma caught Grandpa hiding spicy snacks. The comments were a flood of "what an adorable old revolutionary".'],
      ['拿出他的日记|Bring out his diary', { smarts: 3, fame: 5 }, '日记里的一页被拍成了特写。那一页上，他写了一个战友的名字，写了二十遍。|A page of the diary filled the screen. On it he had written one comrade\'s name, twenty times over.', { if: function (c) { return !!c.p.flags.gpaDiary; } }],
      ['婉拒，家里人不上镜|Decline — the family stays off camera', { karma: 2 }, '导演有点遗憾，但还是在片尾字幕里写了一行：感谢家属的理解。|The director was disappointed, but the credits still thanked the family "for their understanding".']
    ]),
    Y('r2_medal_box', 'red', [26, 75], '勋章盒|The Medal Box', '🏅', '博物馆的人找到你：爷爷的那几枚勋章，他们想借去展出——最好是捐赠。|The museum has found you: they would like to borrow Grandpa\'s medals for an exhibition — ideally, as a donation.', [
      ['捐给博物馆|Donate them', { karma: 8, fame: 3 }, '展柜旁边多了一行小字：“家属捐赠”。每年清明，你都会去那里站一会儿。|A small card appeared beside the case: "Donated by the family." Every Qingming you go and stand there a while.'],
      ['借出去，展完拿回来|Lend them, then take them back', { eq: 3 }, '展览结束后，勋章回到了你的书房。你的孩子总喜欢偷偷拿出来别在睡衣上。|After the exhibition the medals came home. Your children love to sneak them out and pin them on their pyjamas.'],
      ['留在家里|Keep them at home', { happy: 3 }, '你把它们锁在保险柜里。有时候夜深了，你会打开看一看。|You locked them in the safe. Some late nights you open it and look.']
    ], { if: function (S2, p) { return !!p.flags.gpaMedal; } }),
    Y('r2_compound_gone', 'red', [38, 75], '大院要拆了|They\'re Tearing Down the Compound', '🏚️', '城市改造，你长大的那个大院要拆了。原来的邻居们在群里约好，最后一次回去看看。|Urban renewal: the compound you grew up in is coming down. The old neighbours arrange, on a group chat, one last visit.', [
      ['回去，在老槐树下合影|Go back; take a photo under the old locust tree', { happy: 6, eq: 3 }, '一群五十岁的人在树下站成一排，像小时候排队领肉包子一样。有人哭了，有人笑骂他没出息。|A row of fifty-year-olds stood under the tree, just like the old bun queue. Someone cried; someone told him off for being soft.'],
      ['偷偷撬走一块门牌|Quietly prise off a house-number plate', { happy: 8, karma: -1 }, '那块生锈的门牌，现在挂在你书房的墙上。客人都以为是什么古董。|That rusty number plate now hangs on your study wall. Guests assume it\'s an antique.'],
      ['不回去了|Don\'t go', { stress: 2 }, '你在群里看完了所有照片。最后一张是空空的院子，配了一句：“散了。”|You scrolled every photo in the chat. The last was the empty courtyard, captioned: "All gone."']
    ]),
    Y('r2_third_gen', 'red', [32, 62], '红三代|The Third Generation', '🧒', '老师打来电话：你的孩子在学校里说“我太爷爷是开国功臣”，还因为这个当上了班长。|The teacher calls: your child told the class "my great-grandfather founded the nation" — and got made class monitor because of it.', [
      ['带孩子去老区住一星期|Take the child to the old base area for a week', { kids: 6, eq: 2 }, '回来以后，孩子主动辞了班长：“太爷爷那么厉害，我得自己挣。”|When you got back, the child resigned as monitor: "Great-grandpa was amazing. I have to earn it myself."'],
      ['讲一讲太爷爷吃过的苦|Tell them what great-grandpa went through', { kids: 4, smarts: 1 }, '孩子听完问：“那他后悔吗？”你想了很久，说：“他说不后悔。”|The child asked: "Did he regret it?" You thought a long time. "He said he didn\'t."'],
      ['“这有什么，本来就是。”|"So what? It\'s true."', { kids: 2, karma: -3 }, '孩子在学校越来越横。家长会上，你第一次被别的家长当面指着鼻子说。|The child grew more arrogant at school. At the next parents\' evening, another parent jabbed a finger in your face.']
    ], { if: function () { return kids().some(function (k) { var a = N.age(k); return a >= 6 && a <= 14; }); } }),
    Y('r2_patriarch', 'red', [60, 95], '家里的老爷子|Head of the Family', '🪑', '不知不觉，你成了家族里辈分最高的人。逢年过节，晚辈们排着队来汇报工作、请示人生大事——就像当年你给爷爷汇报一样。|Somehow you have become the most senior member of the family. At every holiday the younger ones queue to report on their work and ask your blessing on big decisions — just as you once did with Grandpa.', [
      ['定一条新家规|Lay down a new family rule', function (c) { fx(c, { eq: 4, karma: 3 }); return G.pick(['新家规：谁也不许用家里的名字办私事。违者，过年不许上桌。|New rule: nobody uses the family name for private business. Break it and you eat New Year dinner standing.', '新家规：每个孩子都要去基层干满两年。|New rule: every child does two years at the grassroots first.']); }],
      ['只说一句“你们自己拿主意”|Just say "decide for yourselves"', { happy: 5 }, '晚辈们面面相觑。后来你听说，这句话在家族群里被奉为“老爷子语录”第一条。|The younger ones looked at each other. Later you heard it had become Quote No. 1 in the family group chat.']
    ]),
    Y('r2_old_orderly', 'red', [30, 80], '爷爷的通信员|Grandpa\'s Orderly', '📻', '当年给爷爷当通信员的老人病重住院，指名要见你。|The old man who was Grandpa\'s orderly is gravely ill in hospital and has asked for you by name.', [
      ['马上去|Go straight away', { eq: 4, karma: 4 }, '他拉着你说了一个下午的往事，有一段是你从来没听说过的：爷爷当年为了救他，挨过一个处分。|He talked all afternoon. One story you\'d never heard: Grandpa once took a formal reprimand to save him.'],
      ['安排最好的医生|Arrange the best doctors', { money: -20000, karma: 5 }, '他多活了三年。每年中秋，他的孙子都会送来一盒他亲手包的月饼。|He lived three more years. Every Mid-Autumn his grandson brought a box of mooncakes he\'d made himself.']
    ], { if: function (S2, p) { return !!p.flags.r2Farewell; } }),
    Y('r2_wedding_low', 'red', [23, 42], '低调的婚礼|A Low-Key Wedding', '💍', '你要结婚了。妈妈拿出一张名单：“这些人，一个都不能请。”名单比请柬还长。|You\'re getting married. Mum produces a list: "Not one of these people gets invited." The list is longer than the guest list.', [
      ['就请家人，在家里吃顿饭|Family only, dinner at home', { happy: 6, karma: 3, part: 5 }, '那天的婚宴只有两桌。爸爸喝多了，唱了一首你从没听过的老歌。|Just two tables. Dad drank too much and sang an old song you\'d never heard.'],
      ['去国外旅行结婚|Elope abroad', { happy: 8, money: -15000, part: 6 }, '你们在冰岛的一座小教堂里交换了戒指。证婚人是一位不知道你们是谁的老牧师。|You exchanged rings in a tiny Icelandic church. The officiant was an old pastor with no idea who you were.']
    ], { if: function () { return !!N.partner() && !N.spouse(); } })
  ]);

  /* ======================= 特工家庭 · SPY FAMILY ======================= */
  G.evs([
    Y('sf2_meeting', 'spyfam', [7, 13], '家长会上的化名|A Pseudonym at Parents\' Evening', '📝', '家长会签到表上，爸爸写的名字你从没见过。老师叫“王先生”，他自然地应了一声。|On the sign-in sheet Dad writes a name you\'ve never seen. When the teacher calls "Mr Wang" he answers as if it were his.', [
      ['配合他演下去|Play along', { smarts: 3, eq: 2 }, '回家路上，爸爸塞给你一颗糖：“今天表现不错，王同学。”|On the way home Dad slipped you a sweet. "Nice work today, young Wang."'],
      ['当场问“谁是王先生？”|Ask out loud: "Who\'s Mr Wang?"', { happy: 4, stress: 2 }, '全班都笑了。爸爸面不改色：“孩子在练习幽默感。”那天晚上，家里开了一次很长的家庭会议。|The class laughed. Dad didn\'t blink: "The kid\'s practising comedy." That night there was a very long family meeting.']
    ]),
    Y('sf2_dog', 'spyfam', [6, 14], '只听外语的狗|The Dog That Only Speaks Foreign', '🐕', '家里新来的狗只听得懂一种你不会的语言。爸爸说是“从朋友那儿领养的”。|The new family dog only responds to commands in a language you don\'t speak. Dad says it was "adopted from a friend".', [
      ['偷偷学那门语言|Secretly learn the language', { smarts: 6 }, '半年后，你和狗聊得比和爸爸还多。爸爸听见你说的第一句完整的话，脸色变了一下：“谁教你的口音？”|Six months later you talked to the dog more than to Dad. Hearing your first full sentence, Dad\'s face flickered: "Who taught you that accent?"'],
      ['用中文重新训练它|Retrain it in your own language', { eq: 3, happy: 4 }, '狗学会了“坐下”和“握手”。可每次电话响起某个铃声，它都会冲到门口趴下不动。|The dog learned "sit" and "paw". But whenever the phone rang with one particular tone, it bolted to the door and lay flat.']
    ]),
    Y('sf2_pen', 'spyfam', [10, 16], '会录音的钢笔|The Pen That Records', '🖊️', '十二岁生日，妈妈送你一支钢笔。你发现按一下笔帽，它会亮起一个很小的红点。|For your twelfth birthday Mum gives you a fountain pen. Click the cap and a tiny red light comes on.', [
      ['用它录下班主任骂人的证据|Record your teacher\'s rants', RC(.6, '录音交上去，那位总骂人的老师被调走了。全班给你鼓掌。|You handed it in; the teacher who yelled at everyone was transferred. The class applauded you.', { happy: 8, eq: 2 }, '笔被没收了。妈妈去学校领回来时，脸色很不好看。|The pen was confiscated. When Mum came to collect it she did not look pleased.', { stress: 6, par: -3 })],
      ['还给妈妈，假装没发现|Give it back, pretend you didn\'t notice', { smarts: 2, par: 4 }, '妈妈接过笔，看了你一眼：“你比我想的还要聪明。”第二天，你收到了一支普通的钢笔。|Mum took it and looked at you. "You\'re cleverer than I thought." The next day you got an ordinary pen.']
    ]),
    Y('sf2_move', 'spyfam', [8, 17], '第五次转学|The Fifth New School', '📦', '“我们周末搬家。”这已经是第五次了。你连新同学的名字都还没记全。|"We\'re moving this weekend." The fifth time. You haven\'t even learned all your classmates\' names.', [
      ['这次不交朋友了|Don\'t make friends this time', { smarts: 3, happy: -4, stress: 3 }, '你一个人在新学校安安静静地待了两年，成绩前所未有地好。只是午饭总是一个人吃。|You spent two quiet years alone at the new school; your grades were better than ever. You just always ate lunch alone.'],
      ['给每个老朋友留一个暗号|Leave every old friend a secret code', { eq: 4, happy: 3 }, '十年后，一个陌生号码给你发来一条短信，只有一串数字。你一下就认出来了。|Ten years later, a text from an unknown number: just a string of digits. You knew at once who it was.']
    ]),
    Y('sf2_truth', 'spyfam', [15, 22], '真相|The Truth', '🗂️', '你在阁楼的旧箱子里找到了三本护照，照片都是爸爸，名字和国籍都不一样。|In an old trunk in the attic you find three passports. Dad\'s photo in all of them. Three different names, three different countries.', [
      ['当面问他|Confront him', { eq: 5, stress: 6 }, '爸爸沉默了很久，最后只说：“我做的事，是为了让很多人能睡个安稳觉。包括你。”|Dad was silent for a long time. In the end he said only: "What I do lets a lot of people sleep safely. You included."'],
      ['放回去，什么都不说|Put them back and say nothing', { smarts: 4, stress: 3 }, '从那天起，你学会了看人的眼睛，听话里的话。你没告诉任何人，连妈妈也没有。|From that day you learned to read eyes and hear what was left unsaid. You told no one — not even Mum.'],
      ['拍下来存在云盘里|Photograph them and back them up', RC(.4, '照片一直躺在你的云盘里，没有人发现。|The photos sat in your cloud drive. No one ever found out.', { smarts: 2 }, '第二天，你的云盘被清空了。门口多了一个修路的工人，修了一个月。|The next day your cloud drive was wiped. A "road worker" appeared outside and worked there for a month.', { stress: 10 })]
    ]),
    Y('sf2_recruit', 'spyfam', [19, 27], '父亲的老同事|Your Father\'s Old Colleague', '☕', '大学门口，一位风衣男人请你喝咖啡：“你父亲的老同事想见见你。我们觉得，你有天赋。”|Outside your university a man in a trench coat buys you a coffee. "Some of your father\'s old colleagues would like to meet you. We think you have a gift."', [
      ['“我想听听。”|"I\'m listening."', function (c) { c.p.flags.spyOffer = S().year; fx(c, { smarts: 2, stress: 3 }); return '他留下一张没有字的名片。名片背面，用指甲才能摸出一行凸起的电话号码。|He left a blank business card. On the back, a phone number you could only feel with a fingernail.'; }],
      ['“我不想活成他那样。”|"I don\'t want his life."', { happy: 4, eq: 2 }, '男人点点头，付了账：“你父亲当年也说过一模一样的话。”|The man nodded and paid. "Your father said exactly the same thing once."']
    ], { if: after('sf2_truth', 1) })
  ]);

  /* ======================= 特工 · WORKING SPIES ======================= */
  G.evs([
    Y('sp2_promo', 'spy', [22, 60], '掩护身份被升职了|Your Cover Got Promoted', '📈', '你的掩护身份是一家贸易公司的普通职员。可你干得太好了，老板要提拔你当部门经理——这意味着要天天加班。|Your cover is a junior clerk at a trading company. You\'re too good at it: the boss wants to make you a department manager — which means overtime every night.', [
      ['故意搞砸一个项目|Deliberately botch a project', { stress: 3, happy: 2 }, '你弄丢了一份报价单。老板痛心地说：“你本来前途无量。”你差点笑出声。|You "lost" a quote. The boss said sadly: "You had such a future." You nearly laughed.'],
      ['接受，正好接触更多客户|Accept — more clients, more access', function (c) { fx(c, { stress: 6, money: 8000 }); if (c.p.spy) c.p.spy.merit = (c.p.spy.merit || 0) + 6; return '你成了全公司最拼的经理，也是情报产出最高的特工。总部和老板同时给你发了奖金。|You became the hardest-working manager in the firm, and the most productive agent on the books. HQ and your boss both paid you a bonus.'; }]
    ]),
    Y('sp2_aunt', 'spy', [24, 55], '热心的邻居阿姨|The Matchmaking Neighbour', '👵', '楼下的阿姨太热心了，每周都要给你介绍对象，还总问你“到底做什么工作的”。|The auntie downstairs is far too helpful: a new blind date every week, and always asking what exactly you do for a living.', [
      ['去见一个，敷衍了事|Go on one date to keep her happy', function (c) { var n = nm(c, { rel: 'contact', d0: -4, d1: 4, aff: 35 }); n.love = 20; fx(c, { happy: 4 }); return '对方叫{n}，第一次见面就看穿了你的假名片：“你这公司地址是个公共厕所。”你们竟然聊得很开心。|Their name was {n}. On the first meeting they saw through your fake business card: "Your company address is a public toilet." You got on surprisingly well.'; }],
      ['向总部申请搬家|Ask HQ to move you', { stress: -2, happy: 2 }, '总部批了。新邻居是一位聋哑老爷爷，每天给你送一个苹果。|Approved. Your new neighbour is a deaf old man who leaves you an apple every day.']
    ]),
    Y('sp2_dream', 'spy', [22, 60], '梦话|Talking in Your Sleep', '😴', '伴侣早上问你：“你昨晚说了一整晚外语，还喊了一个人的名字。是谁？”|Your partner asks over breakfast: "You spoke a foreign language all night and called out someone\'s name. Who is it?"', [
      ['“是我喜欢的一个足球运动员。”|"A footballer I like."', RC(.6, '对方信了，还给你买了那个人的球衣。你根本不知道那是谁。|They believed it and bought you the man\'s shirt. You had no idea who he was.', { part: 2, happy: 3 }, '对方查了一下：“这个人去年就死了。”|They looked it up. "He died last year."', { part: -6, stress: 6 })],
      ['申请去做睡眠训练|Request sleep conditioning from HQ', { stress: 4, smarts: 2 }, '三周的训练后，你再也不说梦话了——也很少再做梦。|After three weeks of training you never talked in your sleep again — and rarely dreamed.']
    ], { if: function () { return !!N.partner(); } }),
    Y('sp2_gadget', 'spy', [22, 60], '机场安检|Airport Security', '🧳', '总部新发的装备是一支“口红”。它在机场安检的传送带上，发出了“滴”的一声。|HQ\'s latest gadget is a "lipstick". On the airport X-ray belt, it beeps.', [
      ['当场涂给安检员看|Apply it in front of the officer', RC(.7, '你涂了一层。颜色还挺好看。安检员说：“这色号叫什么？”|You put some on. Nice colour, actually. The officer asked: "What shade is that?"', { happy: 6, smarts: 1 }, '你按错了那一头。整个安检区的灯灭了三秒钟。|You twisted the wrong end. The whole security zone went dark for three seconds.', { stress: 12, fame: -1 })],
      ['扔进垃圾桶，换一班飞机|Bin it and take another flight', { stress: 3 }, '你的行程推迟了一天。后来听说，那个垃圾桶被总部的清洁工“回收”了。|Your trip slipped a day. You heard later that HQ\'s "cleaner" recovered the bin.']
    ]),
    Y('sp2_date', 'spy', [24, 50], '约会对象也是同行|Your Date Is Also a Spy', '🍷', '约会进行到一半，你注意到对方点菜时的手势，和你在训练营里学的一模一样。对方也停下了刀叉。|Halfway through the date you notice the way they ordered — the exact hand signal you learned at training camp. They\'ve stopped eating too.', [
      ['举杯：“敬我们各自的老板。”|Raise a glass: "To our respective employers."', function (c) { var n = nm(c, { rel: 'contact', d0: -4, d1: 5, aff: 40, job: '“外贸公司职员”|"Trade Company Clerk"' }); n.love = 35; fx(c, { happy: 8, stress: 4 }); return '{n}笑了。那是你们最坦诚的一顿饭——虽然谁也没说真名。|{n} laughed. It was the most honest dinner either of you ever had — though neither said a real name.'; }],
      ['借口上厕所，从后门撤离|Excuse yourself and leave by the back', { stress: 6 }, '你在后巷里撞见了对方——也在从后门撤离。你们愣了一秒，各自朝相反的方向跑了。|In the alley you ran straight into them — also leaving by the back. A second\'s pause; then you ran opposite ways.']
    ], { if: function () { return !N.spouse(); } }),
    Y('sp2_cat', 'spy', [22, 65], '安全屋里的猫|The Safe-House Cat', '🐈', '安全屋里出现了一只橘猫。它好像对这里的每一个暗格都很熟悉。|A ginger cat has appeared in the safe house. It seems to know every hidden compartment in the place.', [
      ['收养它|Adopt it', { happy: 8, stress: -4 }, '你给它起名“线人”。它每天早上叼来一张不知从哪儿来的纸片。大部分是外卖单。|You named it "Informant". Every morning it brought you a scrap of paper from somewhere. Mostly takeaway menus.'],
      ['检查它的项圈|Check its collar', RC(.3, '项圈里藏着一个微型定位器。你把它换成了猫铃铛，送回了它主人那边。|The collar hid a micro-tracker. You swapped it for a bell and sent the cat home to its owner.', { smarts: 4, fame: 1 }, '项圈里什么也没有。猫看你的眼神，像是在看一个神经病。|Nothing in the collar. The cat looked at you as if you were mad.', { happy: 3 })]
    ]),
    Y('sp2_farewell', 'spy', [45, 75], '没有真名的告别会|A Farewell Without Names', '🥂', '你的老搭档退休了。告别会上二十个人，没有一个人用真名，蛋糕上写着“祝老张退休快乐”——他不姓张。|Your old partner is retiring. Twenty people at the party, not one using a real name. The cake says "Happy retirement, Old Zhang" — he isn\'t called Zhang.', [
      ['讲一个你们一起执行任务的故事|Tell a story from one of your missions', { eq: 4, happy: 5 }, '你讲到一半，所有人都笑了——因为每个人都在故事里认出了自己。|Halfway through, everyone laughed — each of them recognised themselves in it.'],
      ['塞给他一张写着你真名的纸条|Slip him a note with your real name', { karma: 3, stress: 3 }, '他看完，把纸条吃了下去，拍拍你的肩：“我早就知道了。”|He read it, ate it, and patted your shoulder. "I\'ve always known."']
    ])
  ]);

  /* ======================= 王室与君主 · ROYALS & MONARCHS ======================= */
  G.evs([
    Y('ry2_noodles', ['royal', 'monarch'], [16, 60], '超市里的泡面|Instant Noodles at the Supermarket', '🍜', '小报头版：你戴着棒球帽，在超市里买了一箱泡面。标题是《王室成员的秘密晚餐》。|Front page of the tabloids: you, in a baseball cap, buying a box of instant noodles. Headline: "The Royal\'s Secret Supper".', [
      ['大方承认：“很好吃。”|Own it: "They\'re delicious."', { fame: 6, happy: 5 }, '那个牌子的泡面三天内卖断了货。厂家给王宫寄来了一千箱。|That brand sold out in three days. The maker sent the palace a thousand boxes.'],
      ['让新闻官发声明|Have the press office issue a statement', { stress: 2 }, '声明说那是“为慈善厨房采购物资”。没人信，但大家都觉得很体面。|The statement said you were "buying supplies for a charity kitchen". Nobody believed it; everyone thought it was very dignified.']
    ]),
    Y('ry2_corgi', ['royal', 'monarch'], [10, 80], '王室的狗咬了大使|The Royal Dog Bites the Ambassador', '🐕', '国宴开始前，你养的那只小短腿狗咬住了一位外国大使的裤腿，怎么也不松口。|Before the state banquet, your stubby-legged dog sinks its teeth into a foreign ambassador\'s trouser leg and will not let go.', [
      ['跪下来和狗谈判|Kneel down and negotiate with the dog', { happy: 6, eq: 3, fame: 2 }, '你许诺了三根香肠，狗松口了。大使哈哈大笑：“我会把这条裤子装裱起来。”|You promised three sausages; the dog let go. The ambassador laughed: "I\'ll have these trousers framed."'],
      ['让侍从把狗抱走，郑重道歉|Have a footman carry it off; apologise formally', { eq: 2 }, '大使礼貌地说没关系。可第二天，两国的报纸都用了同一张照片。|The ambassador politely said it was nothing. Next day both countries\' papers ran the same photo.']
    ]),
    Y('ry2_portrait', ['royal', 'monarch'], [20, 85], '官方肖像|The Official Portrait', '🖼️', '画了八个月的官方肖像揭幕了。画布上的人……比你老二十岁，还胖了一圈。全场安静了三秒。|After eight months, the official portrait is unveiled. The person on the canvas looks twenty years older and noticeably heavier. Three seconds of silence.', [
      ['带头鼓掌|Lead the applause', { eq: 5, karma: 2 }, '画家感动得哭了。这幅画后来成了全国最有名的表情包。|The painter wept with gratitude. It went on to become the most famous meme in the country.'],
      ['“我觉得鼻子可以再改改。”|"Perhaps the nose could be revisited."', { happy: 3, fame: 1 }, '画家又改了四个月。第二版好多了，可是网友更喜欢第一版。|The painter worked four more months. The second version was much better; the internet preferred the first.']
    ]),
    Y('ry2_incognito', ['royal', 'monarch'], [14, 70], '微服出宫|Out in Disguise', '🧢', '你换上旧衣服，从厨房后门溜了出去，在一个路边摊坐了下来。老板端上一盘炒饭：“你长得挺像电视上那谁。”|Old clothes on, you slip out through the kitchen door and sit down at a street stall. The cook brings fried rice: "You look a lot like that one off the telly."', [
      ['“经常有人这么说。”|"People say that a lot."', { happy: 10, eq: 2 }, '你吃完了那盘炒饭——这辈子最好吃的一盘。第二天，侍从长在你的床头放了一张路边摊的地图，什么也没说。|You finished the rice — the best you ever ate. Next morning the Master of the Household left a map of street stalls on your bedside table and said nothing.'],
      ['给他签个名|Sign an autograph for him', { fame: 4, happy: 6 }, '小摊现在叫“御用炒饭”，排队要两个小时。老板每年给王宫送一次饭。|The stall is now "By Royal Appointment Fried Rice", with a two-hour queue. Once a year the cook delivers lunch to the palace.']
    ]),
    Y('ry2_commoner', 'royal', [18, 40], '平民恋人|In Love with a Commoner', '💌', '你爱上了一个普通人：在社区图书馆上班，住在一间没有电梯的公寓里。记者已经守在了那栋楼下面。|You\'ve fallen for an ordinary person: works at a local library, lives in a walk-up flat. Reporters are already camped outside the building.', [
      ['公开恋情|Go public', function (c) { var n = nm(c, { rel: 'lover', d0: -3, d1: 4, job: '图书管理员|Librarian', aff: 60 }); n.love = 70; c.p.partner = n.id; fx(c, { fame: 8, happy: 8, stress: 6 }); return '你牵着{n}的手出现在镜头前。全国一半的人在骂你，另一半在嗑你们。|You appeared before the cameras holding {n}\'s hand. Half the country was outraged; the other half shipped you.'; }, { if: function () { return !N.partner(); } }],
      ['悄悄约会，不让任何人知道|Date in secret', { happy: 5, stress: 5 }, '你们在图书馆闭馆后的书架间约会了一整年。直到有一天，一本书里夹着的情书被借书的小学生发现了。|For a year you met among the shelves after closing. Until one day a schoolchild found a love letter tucked in a library book.']
    ], { if: function () { return !N.spouse(); } }),
    Y('mn2_bill', 'monarch', [25, 95], '你不喜欢的法案|A Bill You Dislike', '📜', '议会通过了一项法案，你很不喜欢。按照宪法，你必须签字。首相把笔递了过来。|Parliament has passed a bill you dislike. Under the constitution you must sign it. The Prime Minister hands you the pen.', [
      ['签字，但用了一支红笔|Sign it — in red ink', { eq: 3, fame: 2 }, '你一句话也没说。第二天，“国王用了红笔”成了全国讨论最多的话题。|You said nothing at all. The next day "the red ink" was the most discussed topic in the nation.'],
      ['签字，然后在国庆讲话里委婉地提一句|Sign, then hint at it in your national address', RC(.6, '讲话播出后，民意调查显示大多数人同意你的看法。议会悄悄修订了法案。|After the address, polls showed most people agreed with you. Parliament quietly amended the bill.', { fame: 5, karma: 2 }, '反对党批评你“干预政治”。头条吵了一个月。|The opposition accused you of meddling in politics. The front pages argued for a month.', { fame: -4, stress: 8 })]
    ]),
    Y('mn2_coin', 'monarch', [20, 95], '硬币上的你|You, on a Coin', '🪙', '造币厂送来了新硬币的样品，上面是你的侧脸。你发现他们把你画得有点……双下巴。|The Royal Mint sends samples of the new coin bearing your profile. You notice they\'ve given you a bit of a double chin.', [
      ['批准，这就是真实的我|Approve it — that\'s really me', { happy: 6, karma: 2 }, '国民很喜欢这枚“很真实的硬币”。收藏家们给它起了外号：“双下巴金币”。|The public loved the "honest coin". Collectors nicknamed it "the Double Chin".'],
      ['要求重新雕刻|Order a re-engraving', { fame: 1 }, '新版本瘦了一圈。造币厂把旧模具留了下来，五十年后，它成了拍卖会上的天价藏品。|The new version was slimmer. The Mint kept the old die; fifty years later it fetched a fortune at auction.']
    ]),
    Y('mn2_heir', 'monarch', [50, 100], '和继承人的谈话|A Talk with the Heir', '👑', '你的继承人来到书房：“我不确定自己想要这份工作。”|Your heir comes to your study: "I\'m not sure I want this job."', [
      ['“我当年也不想。”|"Neither did I."', { eq: 6, kids: 5 }, '你们聊到了半夜。临走时，继承人问：“那你后来为什么想了？”你说：“因为有人需要。”|You talked till midnight. Leaving, the heir asked: "So what changed your mind?" You said: "Someone needed me to."'],
      ['“这不是你能选的。”|"It\'s not yours to choose."', { kids: -4, stress: 3 }, '继承人沉默地点了点头。那天以后，你们很少再聊心事。|The heir nodded silently. After that, you rarely spoke about anything that mattered.']
    ], { if: function () { return kids().some(function (k) { return N.age(k) >= 16; }); } })
  ]);

  /* ======================= 监狱 · PRISON ======================= */
  G.evs([
    Y('pr2_library', 'prison', [16, 90], '监狱图书馆|The Prison Library', '📚', '监狱图书馆缺一个管理员。条件是：认识字，不偷书。|The prison library needs a librarian. Requirements: can read, won\'t steal the books.', [
      ['报名|Apply', { smarts: 5, happy: 4 }, '你按自己的方法重新给所有的书分了类，还开了一个读书会。来的人里，有一个刚学会写自己名字。|You re-shelved everything your own way and started a reading group. One member had only just learned to write his name.'],
      ['借一本最厚的书|Borrow the thickest book', { smarts: 3 }, '你借到了一本《战争与和平》。读完的时候，你发现刑期也过去了小半年。|You got War and Peace. By the time you finished, half a year of your sentence was gone.']
    ], { jail: 1 }),
    Y('pr2_kitchen', 'prison', [18, 80], '后厨的秘方|The Kitchen\'s Secret Recipe', '🍳', '你被分到了后厨。老厨子说，他有一个辣椒酱的秘方，在外面能卖钱，可他出不去了。|You\'re assigned to the kitchen. The old cook has a chilli-sauce recipe that could sell outside — but he\'s never getting out.', [
      ['跟他学|Learn it from him', function (c) { c.p.flags.chiliRecipe = 1; fx(c, { eq: 3, happy: 4 }); return '你学了整整一年。他最后说：“出去以后，瓶子上写我的名字。”|You learned for a whole year. At the end he said: "When you\'re out, put my name on the jar."'; }],
      ['专心干活，少说话|Keep your head down and work', { health: 2 }, '你削了一万个土豆。出狱的时候，你的刀工比外面很多厨师还好。|You peeled ten thousand potatoes. By release, your knife work was better than most chefs\'.']
    ], { jail: 1 }),
    Y('pr2_show', 'prison', [16, 80], '狱中文艺汇演|The Prison Variety Show', '🎤', '监狱要办新年文艺汇演，每个监区要出一个节目。大家都看着你。|The prison is holding a New Year variety show; every wing must put on an act. Everyone is looking at you.', [
      ['表演单口相声|Do stand-up', RC(function (c) { return .4 + c.p.st.eq / 200; }, '你讲了一段“如何在食堂里抢到第二个鸡腿”，监狱长笑得眼镜都掉了。|Your bit on "how to get a second drumstick in the canteen" made the warden laugh his glasses off.', { happy: 10, fame: 1 }, '冷场了。只有一个狱友在角落里笑——后来你发现他是在笑别的事。|Silence. One inmate laughed in the corner — at something else, it turned out.', { happy: -3 })],
      ['组织大合唱|Organise a choir', { eq: 5, happy: 6 }, '四十个大男人唱了一首《朋友》。唱到第二段的时候，台下有人哭了。|Forty grown men sang "Friends". By the second verse, someone in the audience was crying.']
    ], { jail: 1 }),
    Y('pr2_kid_letter', 'prison', [22, 80], '孩子的信|A Letter from Your Child', '✉️', '你收到了一封信，信纸上画着一个房子和三个小人。最下面歪歪扭扭写着：“爸爸/妈妈，我数到一千你就回来了吗？”|A letter arrives: a drawing of a house and three stick figures. At the bottom, in wobbly writing: "If I count to a thousand, will you be home?"', [
      ['认真地回一封长信|Write back, long and carefully', { kids: 8, eq: 4, happy: 3 }, '你写了七页。你告诉孩子：要数到一千零九十五——一天数一个。|You wrote seven pages. You told your child: count to one thousand and ninety-five — one number a day.'],
      ['把信贴在床头|Pin it above your bunk', { happy: 4, stress: -4 }, '从那天起，你再也没跟人打过架。|From that day you never got into another fight.']
    ], { jail: 1, noGate: 1, if: function () { return kids().some(function (k) { var a = N.age(k); return a >= 4 && a <= 14; }); } }),
    Y('pr2_old_timer', 'prison', [18, 80], '老狱友的故事|The Old-Timer\'s Story', '🧓', '同监室的老人已经在这里待了二十六年。熄灯后，他第一次讲起了自己进来的原因。|The old man in your cell has been here twenty-six years. After lights-out, for the first time, he tells you why he came in.', [
      ['安静地听完|Listen to the end', { eq: 5, karma: 3 }, '他讲完以后说：“你还年轻，出去别回来。”第二年他保外就医，走的那天把他的搪瓷杯留给了你。|When he finished he said: "You\'re young. Get out and stay out." The next year he was released on medical parole and left you his enamel mug.'],
      ['帮他写申诉材料|Help him write an appeal', RC(.25, '三年后，案子重审了。他是被冤枉的。出狱那天，他给你寄来一张照片：他站在海边。|Three years later the case was reopened. He\'d been innocent. On release he sent you a photo: him, standing by the sea.', { karma: 10, happy: 10, smarts: 3 }, '申诉被驳回了。他拍拍你的手：“谢谢你，没有人帮我写过。”|The appeal was rejected. He patted your hand. "Thank you. No one ever wrote for me before."', { karma: 5, eq: 3 })]
    ], { jail: 1 }),
    Y('pr2_out_sauce', 'common', [20, 90], '一瓶辣椒酱|A Jar of Chilli Sauce', '🌶️', '出狱以后，你按老厨子的秘方做了几瓶辣椒酱，送给朋友们。所有人都问你：哪里能买？|Out of prison, you make a few jars of the old cook\'s chilli sauce for friends. Everyone asks: where can I buy this?', [
      ['开一家小作坊|Start a little workshop', function (c) { fx(c, { money: 15000, happy: 10, karma: 3 }); return '瓶子上印着老厨子的名字。第一年卖了两万瓶。你把第一笔利润寄给了他的女儿。|The old cook\'s name is on every jar. Twenty thousand sold in year one. You sent the first profits to his daughter.'; }],
      ['只做给自己人吃|Only make it for friends', { happy: 6, eq: 3 }, '每年过年，你都会做一百瓶送人。大家管它叫“那个酱”。|Every New Year you make a hundred jars as gifts. Everyone just calls it "the sauce".']
    ], { who: null, if: function (S2, p) { return !!p.flags.chiliRecipe && !p.jail; } })
  ]);

  /* ======================= 富豪 · TYCOONS ======================= */
  G.evs([
    Y('ty2_bell', 'tycoon', [25, 75], '敲钟|Ringing the Bell', '🔔', '公司上市了。交易所邀请你去敲开市钟。你可以带三个人上台。|Your company is going public. The exchange invites you to ring the opening bell. You may bring three people on stage.', [
      ['带上第一批员工|Bring your first three employees', { eq: 5, karma: 4, fame: 4 }, '台上站着一个保洁阿姨、一个前台和一个程序员——公司最早的三个人。这张照片上了所有财经头条。|On stage: a cleaner, a receptionist and a programmer — the company\'s first three hires. The photo led every business page.'],
      ['带上父母和伴侣|Bring your parents and partner', { happy: 8, par: 6, part: 6 }, '妈妈一直在台上抹眼泪，爸爸偷偷拍了二十张自拍。|Mum wiped her eyes the whole time; Dad secretly took twenty selfies.', { if: function () { return G.anyPar(); } }],
      ['一个人敲|Ring it alone', { fame: 3, stress: 2 }, '钟声响起的那一刻，你突然想起了第一次创业失败的那个冬天。|As the bell rang you suddenly remembered the winter your first business failed.']
    ]),
    Y('ty2_relatives', 'tycoon', [28, 80], '老家来的亲戚|Relatives from Back Home', '🧳', '过年回老家，门口排起了队：借钱的、找工作的、让你投资养猪场的。一个你从没见过的“二舅姥爷”说他抱过你。|Back home for New Year, there\'s a queue at the door: loans, jobs, an investment in a pig farm. A "great-uncle" you\'ve never met claims he held you as a baby.', [
      ['设一个家族基金，按规矩来|Set up a family fund with rules', { money: -50000, karma: 5, eq: 4 }, '基金只资助读书和看病。第二年，村里出了三个大学生。|The fund only pays for school and medical bills. Next year the village sent three kids to university.'],
      ['每人发个红包，打发走|Hand everyone a red envelope and move on', { money: -20000, happy: 2 }, '大家拿了红包都很开心。可你听说，第二天村里就开始传你“小气”。|Everyone left happy. By the next day the village was calling you stingy.'],
      ['投资那个养猪场|Invest in the pig farm', RC(.35, '养猪场三年后成了全县最大的生态农场。二舅姥爷说：“我就说我抱过你！”|Three years later the pig farm was the biggest eco-farm in the county. Great-uncle: "Told you I held you!"', { money: 60000, happy: 8 }, '猪跑了。二舅姥爷也跑了。|The pigs escaped. So did great-uncle.', { money: -30000, happy: -3 })]
    ]),
    Y('ty2_kid_flex', 'tycoon', [40, 80], '孩子炫富上了热搜|Your Child Goes Viral for Showing Off', '💎', '你的孩子在社交平台上发了一张照片：在私人飞机上用香槟洗手。评论区已经炸了。|Your child posted a photo: washing their hands in champagne on the private jet. The comments have exploded.', [
      ['停掉信用卡，送去工厂实习一年|Cut the credit cards; one year interning on the factory floor', { kids: -2, karma: 5, fame: 2 }, '一年后，孩子在工厂的年会上讲了一段话，视频又上了热搜——这一次全是好评。|A year later the child gave a speech at the factory party. That video went viral too — all praise this time.'],
      ['发声明说是“摆拍道具”|Issue a statement: "It was a prop"', { stress: 4, fame: -2 }, '网友发现那瓶香槟的批号是真的。|The internet traced the champagne\'s batch number. It was real.']
    ], { if: function () { return kids().some(function (k) { var a = N.age(k); return a >= 14 && a <= 30; }); } }),
    Y('ty2_hostile', 'tycoon', [30, 80], '恶意收购|A Hostile Takeover', '🦈', '一家外国资本在二级市场悄悄吃进了你公司18%的股份。对方的CEO发来邮件：“我们谈谈。”|A foreign fund has quietly bought 18% of your company on the open market. Their CEO emails: "Let\'s talk."', [
      ['毒丸计划|Poison pill', RC(.65, '你连夜开董事会，启动了毒丸计划。对方的收购成本一夜翻了三倍，只好撤退。|An overnight board meeting, a poison pill. Their cost tripled overnight and they retreated.', { smarts: 3, stress: 8 }, '毒丸计划被股东大会否决了。你失去了董事长的位子。|Shareholders voted the pill down. You lost the chair.', { stress: 15, happy: -10, fame: -3 })],
      ['和对方喝杯咖啡|Meet them for coffee', { eq: 4, money: 200000 }, '喝完那杯咖啡，你们成了战略合作伙伴。他们的股份变成了你的合资公司。|After that coffee you were strategic partners. Their stake became your joint venture.'],
      ['卖掉公司，去钓鱼|Sell up and go fishing', { money: 500000, happy: 6, stress: -10 }, '你签完字的第二天，就坐在了湖边。浮漂一动不动。你笑了。|The day after signing you were sitting by a lake. The float didn\'t move. You smiled.']
    ]),
    Y('ty2_space', 'tycoon', [35, 75], '一张太空船票|A Ticket to Space', '🚀', '一家商业航天公司邀请你成为下一批乘客：十分钟的失重，价格是一套豪宅。|A commercial spaceflight company invites you onto its next flight: ten minutes of weightlessness for the price of a mansion.', [
      ['去！|Go!', { money: -450000, happy: 15, fame: 6, health: -2 }, '在失重的那十分钟里，你看着窗外的地球，突然想给每一个你亏欠过的人打个电话。|In those ten weightless minutes, looking down at the Earth, you suddenly wanted to call everyone you\'d ever let down.'],
      ['把票钱捐给一所山区学校|Give the ticket money to a mountain school', { money: -450000, karma: 12, fame: 3 }, '学校建了一座天文台，以你的名字命名。孩子们在那里看到了土星环。|The school built an observatory in your name. The children saw Saturn\'s rings there.'],
      ['“我恐高。”|"I\'m scared of heights."', { happy: 2 }, '你的竞争对手去了。他在太空里拍的自拍，成了你手机里最讨厌的一张图。|Your rival went instead. His selfie from orbit became the picture you hate most on your phone.']
    ], { if: function (S2) { return S2.year >= 2021; } }),
    Y('ty2_partner', 'tycoon', [30, 70], '合伙人反目|The Co-Founder Falls Out', '⚔️', '和你一起从出租屋里创业的合伙人，在董事会上提议罢免你。理由是：“你变了。”|The co-founder who started the company with you in a rented room has moved at the board meeting to remove you. The reason: "You\'ve changed."', [
      ['请他吃一碗当年的牛肉面|Take him for a bowl of the old beef noodles', RC(.55, '面吃到一半，你们俩都哭了。第二天，罢免提案撤回了。|Halfway through the bowl you were both crying. The next day the motion was withdrawn.', { eq: 6, happy: 6 }, '他把筷子一放：“你看，你连我们当年吃的是哪家都记错了。”|He put down his chopsticks. "See? You can\'t even remember which shop it was."', { happy: -6, stress: 8 })],
      ['在董事会上反击|Fight back in the boardroom', RC(.6, '你赢了投票。他带着股份离开了，再也没跟你说过话。|You won the vote. He left with his shares and never spoke to you again.', { stress: 10, karma: -2 }, '你输了。走出公司大楼的时候，保安还像往常一样跟你打了个招呼。|You lost. Walking out, the security guard greeted you just as always.', { stress: 14, happy: -12, fame: -4 })]
    ]),
    Y('ty2_livestream', 'tycoon', [28, 70], '老板亲自直播带货|The CEO Does a Livestream Sale', '📺', '销售部的人求你：“老板，您亲自上一次直播，销量至少翻十倍。”|Sales begs you: "Boss, do one livestream yourself and sales will go up tenfold."', [
      ['上！|Do it!', RC(function (c) { return .45 + c.p.st.eq / 200; }, '你在直播间里吃了自家产品，结果真的好吃。三小时卖出一个亿。|You ate your own product live — and it was genuinely good. A hundred million in sales in three hours.', { money: 80000, fame: 6, happy: 6 }, '你在直播里念错了价格，少写了一个零。一晚上亏了八百万。|You misread the price live and dropped a zero. You lost eight million in one night.', { money: -60000, fame: 4, stress: 10 })],
      ['“我不卖萌。”|"I don\'t do cute."', { fame: -1 }, '竞争对手的老板去了，还穿了一身恐龙服。销量是你们的五倍。|Your rival\'s CEO did it — in a dinosaur costume. Five times your sales.']
    ], { if: function (S2) { return S2.year >= 2017; } }),
    Y('ty2_audit', 'tycoon', [30, 85], '税务稽查|The Tax Audit', '🧾', '税务局的稽查组进驻了公司。财务总监脸色发白：“有几笔账……当年是按照您的意思做的。”|A tax audit team has moved into the office. Your CFO is pale: "A few of the entries... were done the way you wanted, back then."', [
      ['主动补缴，全部认了|Pay everything back voluntarily', { money: -300000, karma: 6, stress: 4 }, '你补缴了税款和滞纳金。稽查组长临走时说：“这么痛快的老板不多。”|You paid tax and penalties in full. The lead auditor said on leaving: "Not many bosses are this straightforward."'],
      ['让财务总监背锅|Let the CFO take the fall', RC(.5, '财务总监被判了缓刑。公司没事了，可公司里再也没人敢跟你说真话。|The CFO got a suspended sentence. The company was fine, but nobody ever told you the truth again.', { karma: -10, stress: 6 }, '财务总监把你们的聊天记录交了出去。|The CFO handed over your chat history.', { karma: -8, stress: 20, fame: -10, money: -500000 })]
    ])
  ]);
})();
