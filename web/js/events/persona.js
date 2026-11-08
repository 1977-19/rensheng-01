/* Personalities: 45+ types with long descriptions, plus per-person hobbies, quirks, values and catchphrases.
   Everything per-person is derived from the stored avatar seed (n.av), so old saves get full profiles too. */
(function () {
  'use strict';
  var N = G.N, P = G.PERS;
  function add(id, n, lo, mo, lk, tp, d, cp, kid) { P[id] = { n: n, lo: lo, mo: mo, lk: lk, tp: tp, d: d, cp: cp || [], kid: kid }; }
  function desc(id, d, cp) { if (P[id]) { P[id].d = d; P[id].cp = cp || []; } }

  desc('gentle', '说话轻声细语，很少跟人红脸。别人难过时，TA总是第一个递纸巾的人。只是太怕伤害别人，有时会委屈自己。|Soft-spoken and slow to anger, always the first to hand you a tissue. So afraid of hurting anyone that they sometimes shortchange themselves.', ['没关系的，慢慢来。|It\'s okay, take your time.', '你吃饭了吗？|Have you eaten yet?']);
  desc('cheer', '走到哪里笑声就跟到哪里，天生的开心果。再糟糕的事，TA都能找到好笑的一面。但不开心的时候，TA也习惯藏起来不说。|Laughter follows them everywhere. They can find the funny side of anything — and they\'re just as good at hiding it when they\'re hurting.', ['走走走，出去玩！|Come on, let\'s go out!', '哈哈哈笑死我了|I\'m dying, hahaha']);
  desc('cold', '表情不多，话更少，看起来拒人于千里之外。熟了以后才知道，TA只是不习惯表达，记得你说过的每一件小事。|Few expressions, fewer words — seems unapproachable. Get close and you find they simply don\'t show it, yet remember every little thing you\'ve said.', ['嗯。|Mm.', '随你。|Suit yourself.']);
  desc('sharp', '嘴上不饶人，一针见血，常常让人下不来台。可TA说的话往往是真的，愿意对你说难听真话的人，其实不多。|Never lets anything slide and cuts right to the bone. But what they say is usually true — and few people will tell you hard truths.', ['你是认真的吗？|Are you serious right now?', '我说话直，你别介意。|I\'m blunt, don\'t take it personally.']);
  desc('tsun', '嘴上说“才不要”，身体却很诚实。关心你的方式总是拐着弯，被戳穿时会脸红着否认。|Says "no way" while doing it anyway. Shows care in roundabout ways and blushes furiously when called out.', ['哼，我才没有担心你！|Hmph, I wasn\'t worried about you!', '别、别误会啊！|D-don\'t get the wrong idea!']);
  desc('scheme', '笑眯眯的，看起来人畜无害，心里却早已把每一步算好了。跟TA做朋友很安全，做对手就很危险。|All smiles and seemingly harmless, with every move already planned. A safe friend — a dangerous rival.', ['这件事，我自有安排。|Leave it to me — I have a plan.', '你猜？|Guess.']);
  desc('honest', '说一是一，答应的事从不食言。不太会说漂亮话，也不懂拐弯抹角，吃过不少亏，但从不后悔。|Their word is their bond. No talent for flattery or hints; they\'ve been burned for it, and never regret it.', ['我答应你的，一定做到。|If I promised, I\'ll do it.', '我不会说谎。|I can\'t lie.']);
  desc('artsy', '喜欢下雨天、旧书店和没人听的老歌。总觉得生活应该有点诗意，对柴米油盐却常常一窍不通。|Loves rainy days, used bookstores and old songs no one else knows. Believes life needs poetry — and is hopeless at grocery runs.', ['今天的晚霞好美。|The sunset is gorgeous today.', '你听过这首歌吗？|Have you heard this song?']);
  desc('prag', '凡事先算账：值不值、划不划算、有没有用。不浪漫，但靠得住，是那种能帮你把日子过好的人。|Runs the numbers on everything: worth it, cost-effective, useful? Not romantic, but reliable — the kind who keeps life running.', ['先说说，这事图什么？|First tell me — what\'s in it for us?', '别想那么多，干就完了。|Stop overthinking and do it.']);
  desc('boss', '习惯掌控一切，说话带着命令的口吻。TA会替你挡掉所有麻烦，但前提是你得听TA的。|Used to running everything, speaks in commands. They\'ll shield you from every trouble — as long as you do as told.', ['听我的，没错。|Listen to me — I\'m right.', '这事我说了算。|I make the call here.']);
  desc('gold', '对名牌、豪车和高档餐厅如数家珍。TA相信钱能解决大部分问题，至于剩下的问题——那是因为钱还不够多。|Knows every luxury brand, car and fine restaurant by heart. Believes money solves most problems; the rest just need more money.', ['那家新开的餐厅人均三千，去不去？|That new place is three grand a head — shall we?', '感情又不能当饭吃。|Love doesn\'t pay the rent.']);
  desc('rebel', '讨厌规矩，越是不让做的事越想试试。年轻时让大人头疼，长大后也许会成为改变规矩的人。|Hates rules; anything forbidden is irresistible. A headache as a kid — maybe the one who rewrites the rules as an adult.', ['凭什么？|Says who?', '我偏不。|I won\'t.']);
  desc('chill', '天塌下来也能先睡一觉。不争不抢，也不焦虑，旁人眼里的“没出息”，TA却过得很快乐。|Could nap through the end of the world. Doesn\'t compete, doesn\'t worry — "unambitious" to others, but genuinely happy.', ['随缘吧。|Whatever happens, happens.', '急什么，饭要一口一口吃。|What\'s the rush? One bite at a time.']);
  desc('clingy', '一天不联系就会胡思乱想，消息秒回，也希望你秒回。爱得很满，也很需要安全感。|A day without hearing from you sends their mind racing. Replies instantly and hopes you will too. Loves fully, and needs reassurance.', ['你在干嘛？想你了。|What are you doing? I miss you.', '你是不是不理我了？|Are you ignoring me?']);
  desc('nerd', '能为一道难题兴奋一整天，书包里永远装着书。聊起专业滔滔不绝，聊起八卦一脸茫然。|Can be thrilled all day by one hard problem, always has a book on hand. Talks endlessly about their field, looks blank at gossip.', ['从原理上来说……|In principle...', '这个问题很有意思！|Now that\'s an interesting problem!']);
  desc('romantic', '记得每一个纪念日，会为了一束花跑遍半个城。相信命中注定，也容易为爱受伤。|Remembers every anniversary and will cross town for the right bouquet. Believes in fate — and gets hurt by love easily.', ['你相信一见钟情吗？|Do you believe in love at first sight?', '今晚月色真美。|The moon is lovely tonight.']);
  desc('playboy', '天生会撩，跟谁都能聊得火热。身边从不缺人，真心却很难说清给了谁。|A born charmer who clicks with everyone. Never short of company — but where their heart lies is anyone\'s guess.', ['你今天真好看。|You look amazing today.', '别那么认真嘛。|Don\'t take it so seriously.'], 'social');

  add('kind', '热心肠|Warm-hearted', 80, 25, 30, 20, '邻居家水管坏了、同事搬家缺人手，TA总是第一个到。帮了别人从不记账，只是偶尔会被人当成“老好人”使唤。|First to show up when a neighbor\'s pipe bursts or a coworker needs moving help. Never keeps score — though some take advantage of the "nice guy."', ['需要帮忙尽管说！|Just say if you need a hand!', '小事一桩。|No trouble at all.']);
  add('shy', '内向腼腆|Shy', 75, 30, 40, 15, '人多的场合会悄悄躲到角落，说话前要在心里排练好几遍。和熟悉的人在一起时，却意外地健谈又有趣。|Slips into a corner at parties and rehearses every sentence first. With people they trust, they\'re surprisingly chatty and funny.', ['那、那个……|Um, well...', '我可以不发言吗？|Can I skip speaking?']);
  add('stubborn', '倔强|Stubborn', 70, 40, 40, 65, '认准的事九头牛都拉不回来，撞了南墙也要把墙撞穿。这份倔强让TA吃过亏，也让TA做成过别人做不成的事。|Once set on something, no force on earth can move them; hit a wall and they\'ll go through it. It\'s cost them — and it\'s won them what others couldn\'t.', ['我就不信做不到。|I refuse to believe it can\'t be done.', '你说的我都懂，但我不改。|I hear you. I\'m not changing.']);
  add('ambit', '野心勃勃|Ambitious', 55, 70, 50, 55, '人生规划精确到五年以后，永远在想下一步往哪爬。TA不甘平凡，也很难停下来享受当下。|Has a five-year plan and is always eyeing the next rung. Refuses to be ordinary — and struggles to enjoy the moment.', ['我要做就做最好的。|If I do it, I do it best.', '机会是给有准备的人的。|Luck favors the prepared.']);
  add('lazy', '懒散|Easygoing to a Fault', 60, 40, 35, 10, '能躺着绝不坐着，能明天做绝不今天做。不过TA总能找到最省力的办法，偶尔还挺聪明。|Never sits when they can lie down, never does today what can wait. Yet they always find the least-effort route — sometimes brilliantly.', ['明天再说吧。|Let\'s deal with it tomorrow.', '能点外卖吗？|Can we just order in?']);
  add('perfect', '完美主义|Perfectionist', 70, 45, 60, 55, '桌上的笔要按颜色排好，报告要改到第十稿。对自己要求极高，对别人也一样，常常把自己逼得很累。|Pens sorted by color, reports rewritten ten times. Demands the best from themselves and everyone else — and wears themselves out.', ['再改一版。|One more revision.', '差一点也是差。|Almost right is still wrong.']);
  add('funny', '搞笑担当|Class Clown', 65, 30, 40, 25, '永远是聚会的气氛组，模仿谁都惟妙惟肖。有人说TA不正经，可最难熬的日子里，大家最想见的就是TA。|The life of every party, with a spot-on impression of anyone. Some call them unserious — but on the darkest days, they\'re who everyone wants around.', ['我给你讲个笑话。|Wanna hear a joke?', '别哭了，看我！|Stop crying — look at me!']);
  add('anxious', '焦虑敏感|Anxious', 75, 40, 45, 40, '出门前要检查三遍门锁，别人一句无心的话能想一整晚。TA对风险的直觉很准，只是常常替还没发生的事担心。|Checks the lock three times and replays a careless remark all night. Their nose for risk is sharp — they just worry about things that haven\'t happened yet.', ['万一……怎么办？|But what if...?', '你是不是生我气了？|Are you mad at me?']);
  add('brave', '胆大冒险|Daring', 55, 40, 55, 50, '蹦极、潜水、说走就走的旅行，TA都试过。相信人生就该轰轰烈烈，只是让家人操碎了心。|Bungee jumps, deep dives, trips booked on a whim. Thinks life should be lived loud — while family frets endlessly.', ['怕什么，试试看！|What\'s to fear? Let\'s try it!', '人生就一次。|You only live once.']);
  add('thrift', '节俭|Frugal', 80, 55, 25, 25, '塑料袋攒一抽屉，打折券用得出神入化。对自己抠门，对家人和朋友却从不小气。|A drawer full of saved plastic bags and a wizard with coupons. Stingy with themselves, never with family or friends.', ['这个太贵了，不值。|Too pricey — not worth it.', '能修就别买新的。|If it can be fixed, don\'t buy new.']);
  add('spend', '大手大脚|Big Spender', 50, 75, 60, 35, '工资到账三天就花得差不多，看到喜欢的东西从不看价签。请客最大方，月底也最拮据。|Paycheck gone in three days; never checks a price tag. The most generous host — and the brokest by month\'s end.', ['今天我请！|It\'s on me today!', '钱就是拿来花的。|Money is for spending.']);
  add('loyal', '重情义|Loyal to a Fault', 92, 25, 30, 35, '朋友有难，TA可以两肋插刀；你对TA好一分，TA还你十分。只是一旦被背叛，也很难再原谅。|Will take a bullet for a friend and repays kindness tenfold. Betray them once, though, and forgiveness is hard.', ['兄弟的事就是我的事。|Your problem is my problem.', '我记着你的好。|I won\'t forget what you did for me.']);
  add('jealous', '爱吃醋|Jealous', 70, 40, 55, 55, '你多看别人一眼，TA能难受一整天。占有欲强，嘴上不说，心里的小本本却记得清清楚楚。|One glance at someone else ruins their day. Possessive, says nothing — but keeps careful notes.', ['那个人是谁？|Who was that?', '你都没这样对我笑过。|You never smile at me like that.']);
  add('proud', '骄傲|Proud', 60, 50, 60, 55, '自尊心极强，宁可吃亏也不低头。做事有一股傲气，也有傲的本钱，就是很难说出“对不起”。|Fiercely proud and would sooner lose than bow. They have the talent to back the attitude — but "sorry" barely leaves their lips.', ['我不需要别人可怜。|I don\'t need anyone\'s pity.', '这点小事难不倒我。|Child\'s play.']);
  add('humble', '谦逊|Humble', 80, 30, 25, 15, '明明很厉害，却总说自己运气好。从不抢功，愿意把机会让给别人，身边的人都很信任TA。|Highly capable, always credits luck. Never takes credit, gives chances away — everyone trusts them.', ['我还差得远呢。|I still have a long way to go.', '都是大家的功劳。|It was a team effort.']);
  add('gossip', '八卦|Gossipy', 50, 45, 55, 35, '全小区的消息都逃不过TA的耳朵，谁家吵架、谁在恋爱，TA比当事人还清楚。跟TA说秘密之前，最好想清楚。|Nothing in the neighborhood escapes them; they know who fought and who\'s dating before the people involved. Think twice before sharing a secret.', ['你听说了吗？|Did you hear?', '我就跟你一个人说啊……|I\'m only telling you...']);
  add('dreamer', '天马行空|Dreamer', 65, 25, 45, 30, '脑子里装着一百个计划和一千个故事，常常望着窗外发呆。也许一事无成，也许某天会创造出了不起的东西。|Head full of a hundred plans and a thousand stories, forever staring out the window. Might never finish anything — or might make something amazing.', ['如果有一天……|What if one day...', '我有个绝妙的主意！|I\'ve got a brilliant idea!']);
  add('calm', '沉稳|Steady', 82, 45, 35, 15, '泰山崩于前而色不变，越是混乱的时候越冷静。不爱张扬，却是所有人遇事时第一个想找的人。|Unshakable when the sky falls, calmer the worse it gets. Never flashy — but the first person everyone calls in a crisis.', ['别慌，先想想办法。|Don\'t panic. Let\'s think.', '会过去的。|This will pass.']);
  add('hot', '暴脾气|Hot-tempered', 60, 40, 45, 90, '一点就着，嗓门大，拍桌子是常事。来得快去得也快，吵完架第二天又像没事人一样。|Short fuse, loud voice, table-pounding. Flares fast and cools faster — acts like nothing happened the next day.', ['你再说一遍？|Say that again?', '气死我了！|I\'m so mad!']);
  add('sweet', '嘴甜|Sweet-talker', 60, 50, 55, 25, '见了长辈喊得亲，见了同事夸得巧，走到哪都讨人喜欢。有人说TA圆滑，也有人说这是一种本事。|Charms elders and flatters coworkers; welcome everywhere. Some call it slick — others call it a gift.', ['您今天气色真好！|You look wonderful today!', '还是您有眼光。|You always have the best taste.']);
  add('loner', '独行侠|Lone Wolf', 65, 40, 40, 30, '喜欢一个人吃饭、一个人旅行、一个人看电影。不是孤僻，只是觉得独处最自在，朋友不多但都很铁。|Eats, travels and goes to movies alone. Not antisocial — solitude is just comfortable. Few friends, but rock-solid ones.', ['我一个人挺好的。|I\'m fine on my own.', '人多的地方我就不去了。|I\'ll skip the crowd.']);
  add('worrier', '操心命|Born Worrier', 85, 40, 30, 35, '天冷提醒你加衣服，下雨提醒你带伞，比你妈还像你妈。操不完的心，也是TA表达爱的方式。|Reminds you to wear a coat, to bring an umbrella — more of a mom than your mom. Endless fussing is how they say "I love you."', ['多穿点，别着凉。|Bundle up, don\'t catch cold.', '到家了给我发个消息。|Text me when you get home.']);
  add('geek', '技术宅|Tech Geek', 70, 45, 25, 25, '房间里堆满了电脑零件，能为了一个bug熬到天亮。不太会聊天，但谁的电脑坏了都来找TA。|A room full of computer parts; will stay up all night chasing a bug. Bad at small talk — yet everyone\'s go-to when their laptop dies.', ['重启试试。|Have you tried restarting it?', '这个我能修。|I can fix that.']);
  add('foodie', '吃货|Foodie', 70, 45, 40, 20, '手机里存满了餐厅收藏，旅行路线按美食规划。心情好要吃，心情不好更要吃。|Phone full of saved restaurants; trips planned around food. Happy? Eat. Sad? Eat more.', ['先吃饭，天大的事吃完再说。|Food first — everything else can wait.', '那家店我种草好久了！|I\'ve been dying to try that place!']);
  add('sporty', '运动狂|Sporty', 70, 40, 60, 40, '天不亮就去跑步，周末不是在球场就是在健身房。精力旺盛，最受不了的就是一整天坐着不动。|Out running before dawn, weekends on the court or in the gym. Boundless energy; sitting still all day is torture.', ['走，打球去！|Come on, let\'s play ball!', '出身汗就好了。|A good sweat will fix it.']);
  add('pious', '虔诚|Devout', 85, 25, 25, 20, '有自己坚定的信仰，每天都会抽时间祈祷或冥想。相信善有善报，对别人宽容，对自己却很严格。|Holds a firm faith and prays or meditates daily. Believes good begets good — forgiving of others, strict with themselves.', ['一切都有安排。|Everything happens for a reason.', '我为你祈祷。|I\'ll pray for you.']);
  add('cynic', '愤世嫉俗|Cynic', 55, 50, 40, 60, '看透了太多套路，对什么都抱着三分怀疑。说话冷嘲热讽，内心深处却比谁都希望世界变好。|Has seen through too many scams to trust anything. Speaks in sarcasm — and deep down wants the world to be better more than anyone.', ['呵，又是这一套。|Ha. Same old story.', '天下哪有免费的午餐。|There\'s no such thing as a free lunch.']);
  add('social', '社交达人|Social Butterfly', 55, 50, 60, 30, '通讯录有几千个人，饭局一个接一个，三天就能和陌生人称兄道弟。人脉广，真正交心的却没几个。|Thousands of contacts and back-to-back dinners; best friends with strangers in three days. A huge network — few true confidants.', ['我认识一个人，可以帮你。|I know a guy who can help.', '今晚有个局，一起？|Got a dinner thing tonight — come?']);
  add('trad', '传统保守|Traditional', 85, 45, 35, 35, '相信老规矩自有道理，逢年过节一样都不能少。对新潮事物总要先摇摇头，但对家的责任感无人能比。|Trusts that old customs exist for a reason and never skips a holiday ritual. Shakes their head at anything trendy — and no one is more devoted to family.', ['老祖宗的规矩不能丢。|Some traditions must be kept.', '成家立业才是正经事。|Settle down and build a family — that\'s what matters.']);
  add('free', '自由奔放|Free Spirit', 45, 30, 55, 35, '不想被房子、工作和婚姻绑住，背包一背就能去任何地方。活得潇洒，也常被说“不靠谱”。|Refuses to be tied down by a house, a job or a marriage; could leave anywhere with one backpack. Lives large — and is often called "unreliable."', ['世界那么大，我想去看看。|The world is big — I want to see it.', '计划？什么计划？|Plans? What plans?']);
  add('mature', '早熟懂事|Old Soul', 85, 40, 30, 15, '小小年纪就会照顾别人，说话做事像个小大人。大人们都夸TA懂事，却很少有人问TA累不累。|Looks after others from a young age and acts like a little adult. Everyone praises how sensible they are; few ask if they\'re tired.', ['我自己可以的。|I can do it myself.', '你别担心我。|Don\'t worry about me.']);
  add('curious', '好奇宝宝|Endlessly Curious', 70, 30, 35, 25, '什么都想拆开看看，什么都要问个为什么。好奇心让TA学得飞快，也让TA闯过不少祸。|Wants to take everything apart and ask why about all of it. Curiosity makes them learn fast — and land in plenty of trouble.', ['为什么呀？|But why?', '让我看看里面是什么！|Let me see what\'s inside!']);
  add('competitive', '好胜心强|Competitive', 60, 50, 50, 60, '下棋要赢，考试要赢，连吃饭都要比谁快。输了会偷偷哭，然后加倍练习。|Must win at chess, tests, even who eats fastest. Cries in secret after losing — then trains twice as hard.', ['再来一局！|Again!', '我才不会输给你。|I won\'t lose to you.']);
  add('greedy', '精明算计|Calculating', 40, 85, 45, 45, '谁请了几次客、谁欠了几块钱，TA都算得一清二楚。不吃亏是TA的人生信条，有时也因此错过了真心。|Knows exactly who treated whom and who owes what. "Never lose out" is their creed — sometimes at the cost of real friendship.', ['亲兄弟明算账。|Even brothers keep accounts.', '这对我有什么好处？|What\'s in it for me?'], 'competitive');

  // personalities that make no sense for small children: shown as their kid-friendly counterpart until 14
  P.gold.kid = 'competitive'; P.scheme.kid = 'curious'; P.greedy.kid = 'competitive';
  G.PERS_LIST = Object.keys(P);
  var KIDSAFE = G.PERS_LIST.filter(function (k) { return !P[k].kid && ['romantic', 'jealous', 'pious', 'cynic', 'trad', 'social'].indexOf(k) < 0; });
  G.PERS_KID = KIDSAFE;

  /* new people: kids get kid-friendly personalities, everyone gets a stable secondary trait */
  var make = N.make;
  N.make = function (o) {
    o = o || {};
    var age = o.age != null ? o.age : (o.by != null ? G.S.year - o.by : null);
    if (!o.pers && age != null && age < 14) o = Object.assign({}, o, { pers: G.pick(KIDSAFE) });
    return make.call(this, o);
  };

  /* chat flavor for the new personalities */
  if (G.chat && G.chat.FLAVOR) Object.assign(G.chat.FLAVOR, {
    kind: ['', '', '有事随时找我！|Call me anytime!'], shy: ['那个……|Um... ', '', ''], stubborn: ['', '', '反正我不改。|And I\'m not changing my mind.'],
    hot: ['', '', '！！|!!'], funny: ['哈哈，|Haha, ', '', '（狗头）|(lol)'], foodie: ['', '', '对了，吃了吗？|Anyway — eaten yet?'],
    worrier: ['', '', '记得多喝热水。|Remember to drink warm water.'], sweet: ['亲爱的，|Darling, ', '', ''], cynic: ['呵，|Heh, ', '', ''],
    free: ['', '', '走，看世界去！|Let\'s go see the world!'], social: ['', '', '改天一起吃饭！|Let\'s grab dinner sometime!'], geek: ['', '', '（发来一个表情包）|(sends a meme)']
  });

  /* ---------- per-person flavor: hobby, quirk, values ---------- */
  var HOB = {
    kid: ['搭积木|Building blocks', '收集贴纸|Collecting stickers', '捉虫子|Catching bugs', '看动画片|Cartoons', '画画|Drawing', '玩泥巴|Playing in the mud', '过家家|Playing house', '跳房子|Hopscotch', '听故事|Listening to stories', '养小金鱼|Keeping goldfish', '踢球|Kicking a ball', '玩拼图|Jigsaw puzzles', '唱儿歌|Singing nursery rhymes', '恐龙|Dinosaurs', '奥特曼和怪兽|Superheroes and monsters', '玩水|Splashing in water'],
    teen: ['打游戏|Video games', '追星|Fangirling over idols', '打篮球|Basketball', '看漫画|Reading manga', '写小说|Writing stories', '弹吉他|Playing guitar', '跳街舞|Street dance', '拍照|Photography', '刷短视频|Scrolling short videos', '做手账|Journaling', '玩滑板|Skateboarding', '编程|Coding', '看推理小说|Mystery novels', '唱K|Karaoke', '养猫|Cats', '下象棋|Chess'],
    adult: ['钓鱼|Fishing', '健身|Working out', '做饭|Cooking', '旅行|Traveling', '摄影|Photography', '跑马拉松|Marathons', '品酒|Wine tasting', '养花|Gardening', '看球赛|Watching football', '读书|Reading', '打麻将|Mahjong', '露营|Camping', '追剧|Binge-watching dramas', '炒股|Trading stocks', '收藏手办|Collecting figurines', '弹钢琴|Piano', '玩桌游|Board games', '爬山|Hiking', '骑行|Cycling', '烘焙|Baking', '撸猫|Cuddling cats', '打高尔夫|Golf', '写书法|Calligraphy', '学外语|Learning languages'],
    old: ['下象棋|Chinese chess', '广场舞|Square dancing', '打太极|Tai chi', '养鸟|Keeping birds', '种菜|Growing vegetables', '遛弯|Long walks', '听戏|Listening to opera', '带孙子|Minding grandkids', '看新闻|Watching the news', '钓鱼|Fishing', '写回忆录|Writing memoirs', '打牌|Card games', '收藏老物件|Collecting antiques', '泡茶|Brewing tea']
  };
  var QUIRK = {
    kid: ['睡觉一定要抱着小熊|Can\'t sleep without a teddy bear', '吃饭总把青菜挑出来|Picks out every vegetable', '怕黑，要开着小夜灯|Afraid of the dark — needs a night light', '一紧张就咬指甲|Bites nails when nervous', '喜欢把玩具排成一排|Lines toys up in rows', '对什么都要问“为什么”|Asks "why" about everything', '最爱穿同一件衣服|Insists on the same outfit every day', '哭的时候会躲进衣柜|Hides in the closet to cry', '总想跟着大孩子玩|Always tags along with the big kids', '把零食藏在枕头底下|Stashes snacks under the pillow'],
    adult: ['手机电量低于50%就焦虑|Panics when the phone dips below 50%', '每天必喝一杯咖啡|Can\'t function without coffee', '说话喜欢夹英文单词|Sprinkles foreign words into every sentence', '出门前要照三次镜子|Checks the mirror three times before leaving', '吃火锅只吃清汤|Only eats the mild hotpot broth', '记性特别好，能记住每个人的生日|Remembers everyone\'s birthday', '一生气就去打扫卫生|Cleans the house when angry', '买东西必须货比三家|Compares three shops before buying anything', '总是迟到五分钟|Always five minutes late', '睡前一定要刷半小时手机|Scrolls for half an hour before bed', '走路特别快|Walks absurdly fast', '紧张时会不停地抖腿|Bounces a leg when nervous', '对香菜深恶痛绝|Despises cilantro', '喜欢给人起外号|Gives everyone nicknames', '永远随身带着充电宝|Always carries a power bank', '吵架吵不过就哭|Cries when losing an argument', '会对着植物说话|Talks to houseplants', '收藏了几百个购物袋|Hoards shopping bags', '唱歌严重跑调却很爱唱|Sings with gusto, horribly off-key', '每年都立“要减肥”的flag|Vows to diet every New Year']
  };
  var VAL = ['家庭|Family', '金钱|Money', '自由|Freedom', '面子|Reputation', '爱情|Love', '事业|Career', '健康|Health', '朋友|Friendship', '知识|Knowledge', '快乐|Having fun', '安稳|Security', '正义|Justice', '信仰|Faith', '美|Beauty', '权力|Power', '名气|Fame'];
  function seed(n, k) { var x = (n.av || 1) * 2654435761 + k * 40503; x = (x ^ (x >>> 13)) >>> 0; return x; }
  function band(a) { return a < 12 ? 'kid' : a < 18 ? 'teen' : a < 62 ? 'adult' : 'old'; }
  G.persOf = function (n) {
    var id = n.pers, pe = P[id] || P.cheer;
    if (pe.kid && N.age(n) < 14) { id = pe.kid; pe = P[id] || pe; }
    return { id: id, p: pe };
  };
  G.persona = function (n) {
    var a = N.age(n), b = band(a), main = G.persOf(n);
    var L2 = G.PERS_LIST, sec = L2[seed(n, 1) % L2.length];
    if (sec === main.id || (a < 14 && P[sec].kid)) sec = L2[(seed(n, 1) + 7) % L2.length];
    if (sec === main.id) sec = null;
    var hl = HOB[b], ql = QUIRK[b === 'kid' ? 'kid' : 'adult'];
    var vi = seed(n, 4) % VAL.length;
    // personality nudges values
    var vmap = { gold: 1, greedy: 1, spend: 1, free: 2, rebel: 2, trad: 0, worrier: 0, kind: 7, loyal: 7, nerd: 8, geek: 8, funny: 9, chill: 9, anxious: 10, pious: 12, ambit: 5, boss: 14, social: 15, romantic: 4, clingy: 4, sporty: 6 };
    if (vmap[main.id] != null && seed(n, 5) % 3 !== 0) vi = vmap[main.id];
    var out = {
      name: main.p.n, sec: sec ? P[sec].n : null, d: main.p.d || '', cp: (main.p.cp || [])[seed(n, 6) % Math.max(1, (main.p.cp || []).length)] || null,
      hob: [hl[seed(n, 2) % hl.length], hl[(seed(n, 2) >>> 4) % hl.length]].filter(function (x, i, arr) { return arr.indexOf(x) === i; }),
      quirk: ql[seed(n, 3) % ql.length], val: a >= 10 ? VAL[vi] : null
    };
    return out;
  };
  G.persName = function (n) { var x = G.persona(n); return x.sec ? G.T(x.name) + ' · ' + G.T(x.sec) : G.T(x.name); };

  /* teenagers can grow into someone new */
  var FA = G.family, grow = FA.growKid;
  FA.growKid = function (k, Q) {
    var r = grow.apply(this, arguments);
    var a = N.age(k);
    if (k.alive && a === 15 && !k.persShift && G.ch(.3)) {
      k.persShift = 1; var old = G.persOf(k).id, nu = G.pick(G.PERS_LIST.filter(function (x) { return x !== old && !P[x].kid; }));
      k.pers = nu;
      G.log('青春期的{n}像变了一个人，从{a}变得{b}了。|Adolescence changed {n}: once {a}, now {b}.', { n: k.name, a: P[old].n, b: P[nu].n });
    }
    return r;
  };
})();
