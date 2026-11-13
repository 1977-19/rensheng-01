/* The intelligence service (version 1.6). Very hard on purpose: every job is an instinct test — a short scene and
   a few possible moves. Nothing here can be learned from a book; a perceptive person simply feels which move is
   right. Your talent tilts the odds and sometimes whispers which choice feels wrong. The pay is enormous. While you
   are in the service, the ordinary events of life give way to the work. Agencies from any country can come for a
   gifted teenager, a broke adult, or a senior officer — and getting caught is catastrophic. */
(function () {
  'use strict';
  var N = G.N;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function q(id, nid, prm) { var s = S(); (s.pendQ = s.pendQ || []).push({ id: id, nid: nid, prm: prm }); }
  function R2(s) { return s.split(','); }

  var SPY = R2('外围线人|Informant,见习特工|Trainee Agent,特工|Field Agent,高级特工|Senior Agent,行动组长|Operations Lead,情报站站长|Station Chief,情报局副局长|Deputy Director,情报局局长|Director of Intelligence');
  var SPY_PAY = [30000, 90000, 160000, 260000, 420000, 650000, 1000000, 1600000];
  var CADET = '情报预备生|Intelligence Cadet';
  G.SPY = SPY; G.SPY_PAY = SPY_PAY;

  var AGN = {
    cn: '国家安全部|the Ministry of State Security', us: '中央情报局|the CIA', gb: '秘密情报局（军情六处）|the Secret Intelligence Service (MI6)', ru: '对外情报局|the SVR',
    fr: '对外安全总局|the DGSE', de: '联邦情报局|the BND', jp: '内阁情报调查室|the Cabinet Intelligence and Research Office', kr: '国家情报院|the National Intelligence Service',
    in: '研究分析局|the Research and Analysis Wing', au: '澳大利亚秘密情报局|ASIS', ca: '加拿大安全情报局|CSIS', it: '对外情报与安全局|AISE', es: '国家情报中心|the CNI', br: '巴西情报局|ABIN',
    sg: '安全与情报署|the Security and Intelligence Division', ch: '联邦情报局|the Federal Intelligence Service', mx: '国家情报中心|the National Intelligence Centre', za: '国家安全局|the State Security Agency',
    th: '国家情报局|the National Intelligence Agency', nz: '新西兰安全情报局|the NZSIS', ie: '国防军情报局|Military Intelligence (J2)', at: '国家安全与情报局|the DSN', pt: '安全情报局|the SIS', ar: '联邦情报局|the Federal Intelligence Agency'
  };
  G.agencyName = function (c) { return AGN[c] || G.L('{c}国家情报局|the {c} National Intelligence Service', { c: G.C[c] ? G.C[c].n : c }); };
  var BIG = ['us', 'ru', 'gb', 'cn', 'fr', 'de', 'jp', 'kr', 'in'];
  function pickAg(ownP) { var p = P(); if (G.ch(ownP)) return p.country; return G.pick(BIG.filter(function (c) { return c !== p.country; })); }
  function cits() { var p = P(); return (G.citsOf ? G.citsOf(p) : p.cits) || [p.country]; }
  G.spyMole = function () { var sp = P().spy; return !!sp && cits().indexOf(sp.ag) < 0; };
  G.spyOn = function () { var p = P(); return !!(p && p.spy && !p.jail); };

  /* ---------- talent: how sharp your instincts are ---------- */
  G.spyTalent = function () {
    var p = P(), st = p.st, t = (st.smarts * .35 + st.eq * .45 + 10) / 100 + (G.stat('luck') || 0) / 400;
    if (G.has('mind')) t += .18; if (G.has('genius') || G.has('prodigy')) t += .06; if (G.has('social') || G.has('charm')) t += .05; if (G.has('lucky') || G.has('chosen')) t += .04;
    if (p.flags.spyfam) t += .08; if (p.spy) t += Math.min(.12, (p.spy.ops || 0) * .01);
    return G.clamp(t, .05, .97);
  };

  /* ---------- the cases: [title, scene, [[choice, score], ...], why] — first choice is best ---------- */
  function C(t, s, o, w) { return { t: t, s: s, o: o, w: w }; }
  var CASES = [
    C('咖啡馆接头|The Café Meeting', '接头人比约定早到了十分钟。他平时总坐在能看见门的位置，今天却背对着门，咖啡一口没动，手机屏幕朝下扣在桌上。|Your contact arrived ten minutes early. He always sits facing the door — today his back is to it, his coffee untouched, his phone face-down.',
      [['不进去，绕到街对面观察五分钟|Don\'t go in. Watch from across the street for five minutes', 1], ['直接离开，取消这次接头|Leave and abort the meeting', .5], ['按原计划坐下接头|Sit down as planned', 0], ['打电话问他怎么了|Call him and ask what\'s wrong', 0]],
      '一个人突然改掉多年的习惯，往往不是他自己想改。|When someone suddenly breaks a lifelong habit, it\'s rarely their own idea.'),
    C('酒吧里的老乡|A Hometown Stranger', '一个很有魅力的陌生人在酒吧主动和你聊天，说你们是同一个小镇出来的。可ta说起家乡那条河时，叫错了名字。|A charming stranger at the bar says you grew up in the same small town — but gets the name of the town\'s river wrong.',
      [['礼貌聊几句，找个借口离开|Chat politely, then find an excuse to leave', 1], ['再请ta喝一杯，反过来套ta的话|Buy another round and pump them for information', .4], ['当面拆穿|Call them out', .3], ['跟ta回家|Go home with them', 0]],
      '真正的老乡不会叫错那条河。有人做过功课，只是做得不够。|A real local never gets the river wrong. Someone did their homework — not quite enough.'),
    C('门缝里的头发|The Hair in the Door', '你回到安全屋。门锁完好，可你出门前夹在门缝里的那根头发不见了。|Back at the safe house, the lock is intact — but the hair you left in the door frame is gone.',
      [['不进门，直接去备用地点并报告|Don\'t go in. Go to the backup site and report', 1], ['在附近守一晚，看谁出来|Stake it out overnight to see who leaves', .5], ['进去检查一下|Go in and check', 0], ['换把锁就好|Just change the lock', 0]],
      '锁没坏，说明进去的人有钥匙，或者是专业的。|An unbroken lock means whoever went in had a key — or was a professional.'),
    C('热心的新搭档|An Eager New Partner', '总部派来的新搭档很热情，第一天就问了你三次你线人的真名。|Your new partner from HQ is very friendly — and on day one asks three times for your source\'s real name.',
      [['不透露，并悄悄向上级核实他的权限|Say nothing and quietly verify his clearance', 1], ['给他一个假名字，看会不会走漏|Give him a fake name and see if it leaks', .7], ['当场质问他|Confront him', .3], ['告诉他，毕竟是自己人|Tell him — he\'s on your side', 0]],
      '真正的老手知道，不该问的永远不问。|Real professionals never ask what they don\'t need to know.'),
    C('线人涨价|The Source Raises His Price', '合作多年的线人突然要三倍报酬，说“这次的东西你一定感兴趣”。他说话时一直在看你身后。|A long-time source suddenly wants triple pay — "you\'ll want this one." He keeps looking past your shoulder as he speaks.',
      [['答应见面，但换一个他不知道的地点|Agree to meet — at a place he doesn\'t know', 1], ['拒绝并断绝联系|Refuse and cut contact', .4], ['马上答应|Agree at once', 0], ['带着钱去他说的地方|Bring the cash to his spot', 0]],
      '他在看的不是你，是你身后的人。|He wasn\'t looking at you. He was looking at whoever stood behind you.'),
    C('海关的微笑|The Smile at Passport Control', '过海关时，工作人员看了你的护照很久，然后笑着说：“欢迎再次来到我们国家。”这是你第一次用这本护照入境。|At passport control the officer studies your passport for a long time, then smiles: "Welcome back to our country." It\'s the first time this passport has ever been used here.',
      [['平静入境，当天就启动撤离方案|Enter calmly and trigger your exit plan the same day', 1], ['纠正他：这是第一次来|Correct him: it\'s your first visit', .2], ['若无其事按原计划行动|Carry on as planned', 0], ['掉头回候机厅|Turn back to the departure hall', 0]],
      '他在告诉你：我们认识你。|He was telling you: we know who you are.'),
    C('多出来的小票|An Extra Receipt', '约定的死信箱里，多了一张你不认识的超市小票，背面什么也没写。|There\'s a supermarket receipt in the dead drop that you\'ve never seen. Nothing is written on the back.',
      [['不碰任何东西，标记信箱已暴露|Touch nothing and mark the drop as burned', 1], ['把小票带回去研究|Take the receipt to study it', .3], ['照常放入情报|Leave your intel as usual', 0], ['在小票上留言回应|Write a reply on it', 0]],
      '小票不是给你的信，是有人来过的证据。|The receipt wasn\'t a message. It was proof someone had been there.'),
    C('审讯室里的水|A Glass of Water', '审讯员递给你一杯水：“你的同伴已经全说了。”可他说出的“细节”里，有一处和真实情况正好相反。|The interrogator hands you water: "Your partner told us everything." But one of the "details" he recites is the exact opposite of what happened.',
      [['什么也不说，继续沉默|Say nothing at all', 1], ['反问他同伴在哪里|Ask where your partner is', .4], ['顺着他的话纠正细节|Correct the detail', 0], ['崩溃承认|Break down and confess', 0]],
      '他说错了，说明他什么都不知道。纠正他，就是在帮他。|He got it wrong, so he knows nothing. Correcting him would be doing his job for him.'),
    C('生日蛋糕|A Birthday Cake', '邻居突然送来一个生日蛋糕。可你掩护身份的生日在下个月——今天，是你真实的生日。|A neighbour brings over a birthday cake. Your cover\'s birthday is next month. Today is your real one.',
      [['笑着道谢，说他记错了，然后马上上报|Thank them, say they\'ve got the wrong date, then report it', 1], ['把蛋糕扔了|Throw the cake away', .2], ['邀请他进屋一起吃|Invite them in to share it', .1], ['惊喜地问“你怎么知道”|Ask, delighted, how they knew', 0]],
      '没有人应该知道这一天。|No one should know that date.'),
    C('深夜的歌|A Song at Midnight', '深夜，你的私人手机响了。对面只放了一段你小时候最爱听的歌，然后挂断。|Late at night your personal phone rings. The caller plays the song you loved as a child — and hangs up.',
      [['不回拨，第二天按程序换手机并汇报|Don\'t call back; swap phones by protocol and report', 1], ['立刻连夜逃离|Flee the city tonight', .4], ['回拨过去|Call back', 0], ['当作恶作剧|Write it off as a prank', 0]],
      '这是在告诉你“我们知道你是谁”，想看你慌不慌。|It\'s a message — "we know who you are" — to see if you panic.'),
    C('目标的妻子|The Target\'s Wife', '你要接近的目标对你一直很冷淡，但他的妻子每次见面都会多看你一眼，问你孩子好不好。|The man you\'re cultivating is always cold to you, but his wife lingers each time and asks after your children.',
      [['从他妻子那里慢慢建立信任|Slowly build trust through his wife', 1], ['继续直接接近目标|Keep working on him directly', .3], ['送他贵重礼物|Send him an expensive gift', 0], ['放弃这个目标|Give up on him', .1]],
      '家里真正拿主意的人，往往不是说话最多的那个。|The one who really decides at home is rarely the one who talks the most.'),
    C('完美的文件|A Perfect Document', '一个自称要叛逃的对方军官给你看了一份绝密文件。文件太完美了：每一页都有签名，连页码都没有错。|An officer who says he wants to defect shows you a top-secret file. It\'s too perfect: every page signed, not one page number out of place.',
      [['收下，标记为“可能是诱饵”，让他再拿一份新的|Take it, flag it as possible bait, ask for something new', 1], ['当场拒绝他|Turn him away', .3], ['立即安排他撤离|Arrange his extraction at once', 0], ['拍照后把他交给对方|Photograph it and hand him back', 0]],
      '真正偷出来的东西，总是皱巴巴、缺页少角的。|Things that are really stolen are always creased and incomplete.'),
    C('话多的老同学|A Chatty Classmate', '多年没见的老同学在同学会上一直追问你的工作。可他上学时从来不爱说话。|At a reunion, an old classmate keeps asking about your job. At school he barely said a word.',
      [['讲一个无聊但完整的掩护故事，然后转移话题|Tell a dull but complete cover story and change the subject', 1], ['反过来打听他的工作|Ask about his job instead', .5], ['提前离场|Leave early', .3], ['说“保密”|Say "it\'s classified"', 0]],
      '最好的掩护，是让人觉得你无聊。|The best cover is to seem boring.'),
    C('撤离的车|The Extraction Car', '撤离的车来了，司机是个新面孔。他没有说出暗号的后半句，只说：“上车吧，来不及了。”|The extraction car arrives with a driver you\'ve never seen. He doesn\'t give the second half of the code — just: "Get in, there\'s no time."',
      [['不上车，步行去备用撤离点|Don\'t get in; walk to the backup point', 1], ['打电话给总部确认|Call HQ to confirm', .4], ['跟他争辩暗号|Argue about the code', .2], ['上车|Get in', 0]],
      '“来不及了”是催你不去想。|"There\'s no time" is how they stop you from thinking.'),
    C('不笑的眼睛|Eyes That Don\'t Smile', '你在会议室外等待时，对方的安全主管一直对你微笑，但他的眼睛从来没有笑过。|Waiting outside the meeting room, their head of security keeps smiling at you — but his eyes never smile.',
      [['保持低调，提前结束今天的行动|Keep a low profile and end today\'s job early', 1], ['也对他微笑|Smile back', .4], ['主动和他攀谈|Strike up a conversation', .2], ['继续按计划拷贝文件|Copy the files as planned', 0]],
      '嘴可以装，眼睛装不了。|A mouth can fake it. Eyes can\'t.'),
    C('第四个问题|The Fourth Question', '年度测谎时，测谎员问到第三个问题后停下来，喝了口水，随口问你：“你今天早上吃了什么？”|During your annual polygraph, after the third question the examiner pauses, sips water, and asks casually: "What did you have for breakfast?"',
      [['像平常一样随口回答|Answer as casually as you normally would', 1], ['说忘了|Say you forget', .4], ['认真想了想，精确地回答|Think hard and answer precisely', .3], ['问他为什么问这个|Ask why he wants to know', .1]],
      '那是在测你的“正常”是什么样子。|He was measuring what your "normal" looks like.'),
    C('孩子的画|A Child\'s Drawing', '你的孩子在学校画了一幅《爸爸妈妈的工作》，画里你手里拿着两部手机。|Your child\'s school drawing, "What My Parents Do", shows you holding two phones.',
      [['笑着说一部是工作的，并从此不在家里用第二部|Laugh — "one\'s for work" — and stop using the second one at home', 1], ['让孩子重画一幅|Ask them to draw another', .3], ['严厉地问孩子是谁教的|Sternly ask who told them that', 0], ['把画撕了|Tear it up', 0]],
      '孩子不会撒谎，只会照实画。|Children don\'t lie. They just draw what they see.'),
    C('桥上的交换|The Exchange on the Bridge', '交换在桥上进行。对方提前两分钟让人走上桥，而且比约定的多了一个人。|The exchange is on the bridge. Their side starts walking two minutes early — with one more person than agreed.',
      [['暂停，要求按约定人数重新开始|Halt and demand they restart with the agreed number', 1], ['立刻撤退|Pull back immediately', .4], ['继续交换|Proceed', 0], ['鸣枪示警|Fire a warning shot', 0]],
      '规矩被改了一点，就会被改很多。|Once the rules bend a little, they bend a lot.'),
    C('便宜的作战计划|A Bargain Battle Plan', '一个商人要卖给你一份“对方的作战计划”，价格低得惊人，他还急着要走。|A businessman offers you "the enemy\'s battle plan" for an astonishingly low price — and he\'s in a hurry.',
      [['不买，但跟着他，看他去见谁|Don\'t buy — follow him and see who he meets', 1], ['讲价|Haggle', .1], ['马上买下|Buy it on the spot', 0], ['举报给当地警察|Report him to the local police', 0]],
      '真东西不会贱卖，急着走的人是在完成任务。|Real secrets aren\'t cheap. A man in a hurry is finishing a job.'),
    C('枕边人|The Person Beside You', '你的恋人从来不问你的工作，有一天却准确说出了你上周去的城市。|Your partner never asks about your work — then one day names the exact city you were in last week.',
      [['不动声色，悄悄查ta最近联系的人|Show nothing; quietly check who they\'ve been talking to', 1], ['质问ta|Confront them', .3], ['立即分手|Break up immediately', .3], ['坦白自己的身份|Tell them who you really are', 0]],
      '一个从不问的人，为什么会知道？|Why would someone who never asks already know?'),
    C('洒在身上的酒|Spilled Wine', '使馆酒会上，一位外交官把酒洒在你身上，连声道歉，坚持要帮你把外套送去洗。|At an embassy reception, a diplomat spills wine on you, apologizes profusely, and insists on having your jacket cleaned.',
      [['婉拒，说回去自己处理|Politely decline — you\'ll deal with it', 1], ['答应，但先把口袋掏空|Agree, after emptying the pockets', .6], ['当众发火|Make a scene', .1], ['把外套交给他|Hand over the jacket', 0]],
      '他要的不是洗衣服，是你的外套。|He didn\'t want to clean it. He wanted the jacket.'),
    C('一个句号|One Full Stop', '加密频道传来求救：“我被困，速来。”用词和格式都对——可你的搭档从来不用句号。|An encrypted SOS arrives: "Trapped. Come now." The wording and format are right — but your partner never uses full stops.',
      [['不回应，按失联程序上报|Don\'t respond; report it under the lost-contact protocol', 1], ['用只有你们知道的问题测试|Test with a question only you two would know', .8], ['回复询问位置|Reply asking for a location', .2], ['立即前往救援|Rush to the rescue', 0]],
      '人改不了的，是小习惯。|Small habits are the one thing people can\'t change.'),
    C('调小的音量|The Volume Knob', '你连续三天打车，三个不同的司机都在同一首歌的同一个段落调小了音量。|Three days, three taxis, three different drivers — each turned the volume down at the same moment of the same song.',
      [['改用步行和公共交通，汇报可能被监控|Switch to walking and transit; report possible surveillance', 1], ['换一家打车软件|Use a different ride app', .4], ['问司机为什么调小音量|Ask the driver why', .2], ['继续打车，觉得是巧合|Keep taking taxis — coincidence', 0]],
      '一次是巧合，三次是安排。|Once is chance. Three times is a plan.'),
    C('绕开的命令|An Order Off the Books', '上级突然要求你今晚交出所有线人名单，理由是“系统升级”，而这条命令没有走正常渠道。|Your superior suddenly wants every source name tonight, for a "system upgrade" — and the order didn\'t come through normal channels.',
      [['拖延，并通过另一条渠道向更高层核实|Stall, and verify through another channel higher up', 1], ['交一份假名单|Hand over a fake list', .6], ['拒绝并质问|Refuse and demand answers', .4], ['照做|Comply', 0]],
      '紧急又绕开程序的命令，最该怀疑。|An urgent order that skips procedure is the one to doubt.'),
    C('太完美的简历|Too Perfect', '你伪装求职进入目标公司。面试官看着你的简历说：“太完美了。你有什么缺点？”|Undercover, you interview at the target company. The interviewer says: "Your CV is perfect. What are your weaknesses?"',
      [['说一个真实但无伤大雅的小缺点|Name a real but harmless flaw', 1], ['反问他希望听到什么|Ask what he\'d like to hear', .3], ['说“我太追求完美”|"I\'m too much of a perfectionist"', .2], ['说没有缺点|Say you have none', 0]],
      '人都有缺点。没有缺点的人，才可疑。|Everyone has flaws. Only a fake has none.'),
    C('下棋的老人|The Old Chess Player', '公园里一位老人每天和你下一盘棋。今天他输了以后说：“你走棋的习惯，跟你父亲一模一样。”|An old man plays chess with you in the park every day. Today, after losing, he says: "You play exactly like your father."',
      [['笑笑说父亲不会下棋，以后换个公园|Smile, say your father never played, and find another park', 1], ['悄悄跟踪他回家|Quietly follow him home', .4], ['问他认识你父亲吗|Ask if he knew your father', .2], ['继续每天来下棋|Keep coming every day', 0]],
      '他在试探你会不会接话。|He was testing whether you\'d take the bait.'),
    C('不叫的狗|The Dog That Didn\'t Bark', '你潜入目标家时，他的狗没有叫，只是摇着尾巴走过来。可他说过，这条狗见了生人一定会叫。|Inside the target\'s house, his dog doesn\'t bark — it trots up wagging. He\'d told you it always barks at strangers.',
      [['立刻撤离——有人提前来过，安抚过它|Get out now — someone came earlier and calmed it', 1], ['喂狗吃东西|Feed the dog', .2], ['抓紧时间拿文件|Grab the files fast', 0], ['在屋里躲起来|Hide inside', 0]],
      '狗不叫，说明它刚见过陌生人。|A silent dog has just met a stranger.'),
    C('晚宴的座次|The Seating Plan', '目标办家宴，把你安排在他妻子旁边，而不是他身边。整场宴会他一次也没看你。|At his dinner party the target seats you beside his wife, not himself, and never once looks your way.',
      [['他在刻意避嫌——找机会私下单独接触他|He\'s avoiding being seen with you — find a private moment', 1], ['多和他妻子聊天|Talk more with his wife', .5], ['认为他没兴趣，放弃|Assume he\'s not interested; give up', .2], ['当众向他敬酒|Toast him publicly', 0]],
      '刻意不看，比一直在看更有意思。|Pointedly not looking says more than staring.'),
    C('雨天的报贩|The Newspaper Seller in the Rain', '下雨天，街角那个总在卖报纸的人今天没打伞，可他的报纸一份也没湿。|It\'s raining. The man who always sells papers on the corner has no umbrella — yet not one paper is wet.',
      [['他刚到不久——换一条路线回去|He just got there — take another route home', 1], ['拍下他的照片|Photograph him', .4], ['买份报纸|Buy a paper', 0], ['不在意|Ignore it', 0]],
      '他不是一直在那里，他是在等你。|He hadn\'t been there all along. He was waiting for you.'),
    C('沉一点的表|A Slightly Heavy Watch', '对方送来一块名表作为谢礼。这块表，比同款手表稍微重了一点点。|As thanks, they send you a luxury watch. It\'s just slightly heavier than the same model should be.',
      [['道谢收下，交给技术部门，绝不戴|Accept it, hand it to the tech team, never wear it', 1], ['退回|Send it back', .4], ['当场拆开|Pry it open yourself', .2], ['戴上|Wear it', 0]],
      '多出来的重量，总得有个去处。|The extra weight has to be something.'),
    C('问了三遍的护士|The Nurse Who Asked Three Times', '你受伤住院。护士换药时动作很熟练，却三次问你：“伤口是怎么弄的？”|You\'re in hospital with a wound. The nurse changes the dressing expertly — and three times asks how you got it.',
      [['每次给同样的回答，并申请转院|Give the same answer each time and ask to be transferred', 1], ['不理她|Ignore her', .3], ['每次换个说法|Tell it differently each time', 0], ['告诉她真相|Tell her the truth', 0]],
      '问三遍，是在比对你的说法。|Asking three times is how they compare your stories.'),
    C('婚礼上的真名|Your Real Name at a Wedding', '你以伴郎/伴娘的身份做掩护。新郎的朋友端着酒杯走过来，叫出了你的真名。|You\'re undercover in a wedding party. One of the groom\'s friends walks up, glass in hand, and calls you by your real name.',
      [['笑着说“你认错人了”，找机会离场|Smile, "you\'ve got the wrong person", then slip away', 1], ['假装喝醉|Pretend to be drunk', .5], ['把他拉到一边解释|Pull him aside to explain', .2], ['答应|Answer to the name', 0]],
      '答应一次，掩护就没了。|Answer once, and the cover is gone.'),
    C('太安静的街|A Street Too Quiet', '你约在一条平时很热闹的步行街交接。今天街上的人不少，但没有一个人在打电话，也没有人在看手机。|The handoff is on a busy shopping street. Plenty of people today — but not one is on a phone or looking at one.',
      [['取消交接，混入人群离开|Abort the handoff and melt into the crowd', 1], ['加快速度完成交接|Hurry the handoff', 0], ['拿出手机假装打电话|Fake a phone call', .3], ['站着观察一下|Stand and observe', .2]],
      '一整条街的人都不看手机，他们在看别的东西。|When a whole street ignores its phones, they\'re watching something else.'),
    C('第二次见面|The Second Meeting', '你发展的线人第二次见面时，带来的情报比第一次多十倍，而且主动说：“下次我还能带更多。”|At your second meeting, a new source brings ten times more than last time, and volunteers: "Next time I can bring even more."',
      [['放慢节奏，先核实他上次给的东西|Slow down and verify last time\'s material first', 1], ['减少见面频率|Meet less often', .5], ['重金奖励他|Reward him generously', 0], ['催他下次多带|Push him to bring more', 0]],
      '太急着给的人，可能是别人派来喂你的。|Someone too eager to give may have been sent to feed you.'),
    C('顺手的帮忙|A Helpful Stranger', '你的车在偏僻路段爆胎，一个路过的人马上停下来帮忙，工具齐全，换胎比你还熟练。|Your tyre blows on a lonely road. A passer-by stops at once — with every tool — and changes it faster than you could.',
      [['道谢后检查车底，换条路走|Thank him, check under the car, take another road', 1], ['给他留个电话表示感谢|Leave him your number to say thanks', 0], ['请他吃饭|Offer to buy him dinner', .1], ['什么也不想，开走|Think nothing of it and drive on', .2]],
      '刚好在那里、刚好带着工具——太刚好了。|Right place, right tools — a little too right.')
  ];
  G.SPY_CASES = CASES;

  /* ---------- the instinct test: always played, never skipped ---------- */
  function pickCases(n) {
    var sp = P().spy || {}, seen = sp.seen || [], pool = [];
    for (var i = 0; i < CASES.length; i++) if (seen.indexOf(i) < 0) pool.push(i);
    if (pool.length < n) { seen = []; pool = CASES.map(function (_, i) { return i; }); }
    var out = [];
    while (out.length < n && pool.length) { var k = pool.splice(Math.floor(G.R() * pool.length), 1)[0]; out.push(k); }
    if (P().spy) P().spy.seen = seen.concat(out).slice(-24);
    return out;
  }
  G.spyGame = async function (o) {
    o = o || {};
    var ks = o.fixed || pickCases(o.rounds || 1), tal = G.spyTalent(), r;
    if (G.UI.spyGame) r = await G.UI.spyGame({ name: o.name, cases: ks.map(function (k) { return CASES[k]; }), talent: tal });
    else { // headless: the stats decide
      var tot = 0; ks.forEach(function (k) { var c = CASES[k]; tot += G.ch(tal) ? 1 : G.pick(c.o)[1]; }); r = { score: tot / ks.length };
    }
    var sc = r && r.score != null ? r.score : 0;
    var ok = G.ch(G.clamp(sc * .82 + tal * .22 - (o.diff || 0), .03, .97));
    if (P().spy) P().spy.ops = (P().spy.ops || 0) + 1;
    return { score: sc, ok: ok, great: ok && sc >= .99 };
  };

  /* ---------- joining, rising, leaving ---------- */
  function join(ag, rank, youth) {
    var p = P(); p.spy = { rank: rank || 0, merit: 0, yrs: 0, y: S().year, ag: ag, heat: 0, youth: youth ? 1 : 0, ops: 0, seen: [] };
    G.major('秘密加入了{a}|Secretly joined {a}', { a: G.agencyName(ag) }); G.inc('spy');
  }
  function promote() { var s = P().spy; if (s.rank >= SPY.length - 1) return; s.rank++; s.merit = Math.round(s.merit * .3); G.major('晋升为{r}|Promoted to {r}', { r: SPY[s.rank] }); G.inc('promos'); }
  function heat(n) { var s = P().spy; if (s) s.heat = G.clamp((s.heat || 0) + n, 0, 100); }
  function merit(n) { var s = P().spy; if (s) s.merit += n; }
  function pay(usd) { var m = G.$(usd); if (G.fin) G.fin.tag = G.L('情报工作|Intelligence work'); G.addMoney(m); if (G.fin) G.fin.tag = null; return m; }
  function high() { var p = P(); return (p.mil && p.mil.off && p.mil.rank >= 5) || (p.pol && p.pol.rank >= Math.ceil(G.POLICE.r.length * .55)) || (p.gov && p.gov.rank >= 4); }

  /* ---------- catastrophe ---------- */
  function strip() {
    var s = S(), A = s.assets, p = P(), was = Math.max(0, G.netWorth());
    p.money = 0; A.houses = []; A.cars = []; A.items = []; A.inv = {}; A.company = null; A.debt = [];
    return was;
  }
  function fallout(mole) {
    var p = P(), sp = N.partner();
    if (sp && G.ch(mole ? .65 : .3)) { try { if (sp.rel === 'spouse') G.love.divorce(sp, true); else G.love.breakup(sp); } catch (e) { } }
    N.rel('child').forEach(function (k) { N.addAff(k, mole ? -35 : -10); });
    N.rel('father', 'mother').forEach(function (n) { N.addAff(n, mole ? -30 : -5); });
    p.spy = null; p.flags.exSpy = 1; p.flags.spyCaught = 1;
    if (p.job) try { G.career.leave(true); } catch (e) { p.job = null; }
    p.pol = null; p.mil = null; p.gov = null;
  }
  function sentence(c, mole, soft) {
    var p = c.p, sp = p.spy, ag = sp.ag, cn = p.country === 'cn';
    var lost = mole ? strip() : 0;
    c.add('fame', mole ? 15 : 5); c.add('karma', mole ? -30 : 0); c.add('happy', -30); c.add('stress', 40);
    fallout(mole);
    G.major(mole ? '以间谍罪被捕|Arrested for espionage' : '在境外以间谍罪被捕|Arrested abroad for espionage');
    if (mole && cn && !soft && G.ch(.5)) { G.die('以间谍罪被判处死刑|Executed for espionage'); return G.L('法院以间谍罪判处你死刑，没收全部个人财产。|The court sentenced you to death for espionage and confiscated everything you owned.'); }
    var y = soft ? G.ri(8, 15) : mole ? (cn ? 99 : G.ri(20, 35)) : G.ri(8, 15);
    G.crime.jail(y, '间谍罪|Espionage');
    if (mole) return G.L('你被判处{y}，个人财产（约{m}）全部没收。家人在新闻里看到了你的名字。|You were sentenced to {y}, and everything you owned (about {m}) was confiscated. Your family saw your name on the news.', { y: y >= 99 ? G.L('无期徒刑|life imprisonment') : G.L('{y}年有期徒刑|{y} years', { y: y }), m: G.M(lost) });
    p.flags.swapTo = ag;
    return G.L('你在异国的监狱里被关押。{a}正在设法把你换回来。|You\'re held in a foreign prison. {a} is working to trade you home.', { a: G.agencyName(ag) });
  }

  G.evs([
    { id: 'spy_youth', sys: 1, title: '特别的关注|Special Attention', icon: '🕵️',
      prep: function (c) { if (c.p.spy || c.p.jail) return false; c.prm.ag = c.prm.ag || pickAg(.55); c.prm.a = G.agencyName(c.prm.ag); c.prm.own = c.prm.ag === c.p.country ? 1 : 0; },
      t: function (c) { return c.prm.own ? '少年宫的一位老师注意你很久了。今天，她带来一位穿便装的叔叔。他没说自己是谁，只问了你几道奇怪的题，最后说：“国家需要像你这样的孩子。”（{a}）|A teacher at your youth centre has watched you for a long time. Today she brings a man in plain clothes. He doesn\'t say who he is — just asks you a few strange questions, then: "Your country needs children like you." ({a})'
        : '国际夏令营里，一位和蔼的外国教授总是单独给你出难题。离营前，他递给你一张卡片：“我们资助天才少年。只要你偶尔帮我们一点小忙。”（{a}）|At an international summer camp, a kindly foreign professor keeps giving you special puzzles. As camp ends he hands you a card: "We sponsor gifted young people. All we ask is the occasional small favour." ({a})'; },
      o: [{ t: '答应他们|Say yes', run: function (c) { join(c.prm.ag, 0, true); c.add('stress', 6); return c.prm.own ? '你成了一名情报预备生。每周三下午，你说去补课。|You became an intelligence cadet. Every Wednesday afternoon, you tell everyone you have extra tutoring.' : '你收下了卡片。从此，你有了一个谁也不能说的秘密。|You kept the card. From now on you have a secret you can tell no one.'; } },
        { t: '告诉爸妈|Tell your parents', if: function (c) { return !c.prm.own; }, run: function (c) { c.add('karma', 6); c.p.flags.spyReported = 1; N.rel('father', 'mother').forEach(function (n) { N.addAff(n, 4); }); return '爸妈脸色大变，第二天带你去报了案。几年后，有人记住了你这份警觉。|Your parents went pale and took you to report it the next day. Years later, someone remembered how alert you were.'; } },
        { t: '拒绝|Say no', run: function () { return '他们没有再来。只是有时候，你觉得有人在看你。|They never came back. Only sometimes, you feel someone watching.'; } }] },
    { id: 'spy_recruit', sys: 1, title: '一个陌生人|A Stranger', icon: '🕵️',
      prep: function (c) { if (c.p.spy || c.p.jail) return false; c.prm.ag = c.prm.ag || pickAg(.6); c.prm.a = G.agencyName(c.prm.ag); },
      t: '你走投无路的时候，一个穿风衣的人在面馆坐到你对面：“我们观察你很久了。有一份工作，薪水很高，只是不能告诉任何人。”名片上只有一个电话号码。（{a}）|At your lowest point, a man in a trench coat sits across from you in a noodle shop: "We\'ve been watching you. There\'s a job. The pay is very good — but you can tell no one." The card holds only a phone number. ({a})',
      o: [{ t: '接受|Accept', run: function (c) { join(c.prm.ag, 0); pay(5000); return '他推过来一个信封，里面是一部手机和一叠现金。“等电话。”|He slid over an envelope: a phone and a stack of cash. "Wait for the call."'; } },
        { t: '拒绝|Decline', run: function () { return '他留下名片，起身走了。|He left the card and walked away.'; } }] },
    { id: 'spy_high', sys: 1, title: '高尔夫球场|On the Golf Course', icon: '⛳',
      prep: function (c) { if (c.p.spy || c.p.jail || !high()) return false; c.prm.ag = c.prm.ag || pickAg(.4); c.prm.a = G.agencyName(c.prm.ag); c.prm.own = c.prm.ag === c.p.country ? 1 : 0; },
      t: function (c) { return c.prm.own ? '国家安全部门的人找到你：他们希望借用你现在的职位，执行一项长期秘密任务。你的身份不变，只是从此多了一条看不见的线。（{a}）|Men from your country\'s security service come to you: they want to use your position for a long-term covert mission. Your post stays the same — you just carry an invisible line from now on. ({a})'
        : '一位外国使馆的参赞约你打高尔夫。第九洞，他轻声说：“你掌握的东西，我们愿意出你年薪十倍的价钱。没有人会知道。”（{a}）|A counsellor from a foreign embassy invites you to golf. On the ninth hole he says softly: "What you know is worth ten times your salary to us. No one would ever find out." ({a})'; },
      o: [{ t: '答应|Agree', run: function (c) { join(c.prm.ag, c.prm.own ? 3 : 2); if (!c.prm.own) { pay(200000); c.add('karma', -10); } return c.prm.own ? '你签了一份不会存在于任何档案里的文件。|You signed a document that exists in no archive.' : '一个瑞士银行账户在你名下开好了。第一笔钱已经到账。|A Swiss bank account was opened in your name. The first payment has already landed.'; } },
        { t: '当场拒绝，并向上级报告|Refuse, and report it', if: function (c) { return !c.prm.own; }, run: function (c) { var p = c.p; if (p.pol) p.pol.merit += 30; if (p.mil) p.mil.merit += 30; if (p.gov) p.gov.perf = Math.min(100, p.gov.perf + 10); c.add('karma', 10); c.add('fame', 2); return '反间谍部门顺着这条线挖出了一整个情报网。你的档案里多了一份嘉奖。|Counter-intelligence followed the thread and rolled up a whole network. Your file gained a commendation.'; } },
        { t: '婉拒|Politely decline', run: function () { return '“如果你改变主意……”他把球杆递还给你。|"If you ever change your mind…" He handed back your club.'; } }] },
    { id: 'spy_case', sys: 1, title: '情报任务|Field Case', icon: '🕵️',
      prep: function (c) { if (!G.spyOn()) return false; c.prm.k = pickCases(1)[0]; },
      t: function (c) { var x = CASES[c.prm.k], a = x.t.split('|'), b = x.s.split('|'); return '【' + a[0] + '】' + b[0] + '|[' + a[1] + '] ' + b[1]; },
      o: [{ t: '凭直觉做出判断|Trust your instincts', run: async function (c) {
        var r = await G.spyGame({ name: CASES[c.prm.k].t, fixed: [c.prm.k] }), sp = c.p.spy; if (!sp) return '';
        if (r.ok) { var g = G.ri(10, 20) + (r.great ? 10 : 0); merit(g); heat(-6); var m = pay(G.ri(10, 40) * 1000 * (G.spyMole() ? 1.6 : 1)); return G.L('你的判断是对的。功绩+{g}，奖金{m}。|Your instincts were right. Merit +{g}, bonus {m}.', { g: g, m: G.M(m) }); }
        heat(G.ri(12, 22)); c.add('stress', 8); return G.L('你看错了。对方注意到了你。（暴露风险{h}%）|You read it wrong. They noticed you. (Exposure risk {h}%)', { h: Math.round(sp.heat) });
      } }] },
    { id: 'spy_arrest', sys: 1, title: '凌晨的敲门声|A Knock Before Dawn', icon: '🚨', bad: 1,
      prep: function (c) { if (!c.p.spy || c.p.jail) return false; c.prm.mole = G.spyMole() ? 1 : 0; c.prm.a = G.agencyName(c.p.spy.ag); },
      t: function (c) { return c.prm.mole ? '凌晨四点，国家安全机关的人敲开了你的门。他们手里拿着你和{a}联络的全部记录。|At 4 a.m., state security knocks on your door. They hold every record of your contact with {a}.'
        : '你在境外执行任务时，被当地反间谍部门当场抓获。|On assignment abroad, you\'re caught red-handed by local counter-intelligence.'; },
      o: [{ t: '一言不发|Say nothing', run: function (c) { return sentence(c, c.prm.mole, false); } },
        { t: '坦白，交代上线（直觉小游戏）|Confess and give up your handler (instinct test)', if: function (c) { return c.prm.mole; }, run: async function (c) {
          var r = await G.spyGame({ name: '审讯|Interrogation', rounds: 1 });
          if (r.ok) return sentence(c, true, true) + G.L('因为你的配合，法院从轻判决。|Because you cooperated, the court showed some leniency.');
          return sentence(c, true, false);
        } },
        { t: '等待交换|Wait to be traded', if: function (c) { return !c.prm.mole || c.p.spy.rank >= 3; }, run: function (c) {
          var sp = c.p.spy, ag = sp.ag;
          if (G.ch(.3 + sp.rank * .06)) { var t = sentence(c, c.prm.mole, true); c.p.jail && (c.p.jail.left = Math.min(c.p.jail.left || 3, G.ri(2, 4))); c.p.flags.swapTo = ag; return t + G.L('几年后，你会在一座桥上被交换回去。|In a few years, you\'ll be traded on a bridge.'); }
          return sentence(c, c.prm.mole, false);
        } }] }
  ]);

  /* ---------- the work ---------- */
  function act(id, n, i, e, minRank, rounds, onOk, onBad, x) {
    var o = { id: id, n: n, i: i, e: e, a: [10, 85], if: function () { var sp = P().spy; return !!sp && !P().jail && (x && x.youth ? (sp.youth || P().age < 18) : !sp.youth) && sp.rank >= minRank && (!x || !x.if || x.if()); },
      run: async function (a) {
        var r = await G.spyGame({ name: a.n, rounds: rounds, diff: x && x.diff });
        G.dStart && G.dStart(); var t = r.ok ? onOk(r) : onBad(r); var dl = G.dEnd ? G.dEnd() : [];
        if (!P().spy && !G.S.dead) return G.result(a.n, t, null, dl, a.i);
        if (G.S.dead) return;
        return G.result(a.n, t + (P().spy ? G.L('\n（功绩{m} · 暴露风险{h}%）|\n(Merit {m} · exposure risk {h}%)', { m: P().spy.merit, h: Math.round(P().spy.heat) }) : ''), null, dl, a.i);
      } };
    return o;
  }
  var mole = function () { return G.spyMole() ? 1.6 : 1; };
  var ITEMS = [
    act('spy_train', '直觉训练|Instinct Training', '🧠', 8, 0, 1,
      function () { merit(5); G.addStat('smarts', 1); G.addStat('eq', 1); return G.L('教官点点头：“你看到了别人看不到的东西。”|Your instructor nods: "You saw what others miss."'); },
      function () { G.addStat('stress', 3); return G.L('教官摇摇头：“再来。”|Your instructor shakes his head: "Again."'); }, { youth: 1 }),
    act('spy_meet', '秘密接头|Clandestine Meeting', '☕', 10, 0, 1,
      function (r) { var g = G.ri(8, 14) + (r.great ? 6 : 0); merit(g); var m = pay(G.ri(5, 15) * 1000 * mole()); return G.L('接头顺利完成。功绩+{g}，经费{m}。|The meeting went off cleanly. Merit +{g}, funds {m}.', { g: g, m: G.M(m) }); },
      function () { heat(G.ri(10, 16)); return G.L('你察觉不对，提前撤了。但对方可能已经记住了你的脸。|You sensed trouble and pulled out — but they may have seen your face.'); }),
    act('spy_counter', '反跟踪|Counter-surveillance', '👣', 8, 0, 1,
      function () { heat(-25); return G.L('你绕了三个小时，确认身后干干净净。|You spent three hours doubling back until you were sure you were clean.'); },
      function () { heat(6); return G.L('你没能甩掉尾巴。|You couldn\'t shake the tail.'); }, { if: function () { return (P().spy.heat || 0) > 0; } }),
    act('spy_asset', '发展线人|Recruit a Source', '🤝', 20, 1, 1,
      function (r) { var g = G.ri(25, 40) + (r.great ? 15 : 0); merit(g); P().spy.assets = (P().spy.assets || 0) + 1; return G.L('对方终于点头了。你多了一条线人。功绩+{g}。|They finally agreed. You have a new source. Merit +{g}.', { g: g }); },
      function () { heat(G.ri(14, 20)); G.addStat('stress', 6); return G.L('对方起了疑心，你只好断了联系。|They grew suspicious; you cut contact.'); }),
    act('spy_op', '潜伏任务（三关）|Deep-Cover Mission (3 tests)', '🎭', 30, 2, 3,
      function (r) { var g = G.ri(60, 90) + (r.great ? 50 : 0); merit(g); var m = pay(G.ri(r.great ? 300 : 60, r.great ? 600 : 200) * 1000 * mole()); G.addStat('fame', 0); return G.L(r.great ? '你在对方心脏里潜伏了半年，带回了一份改变局势的情报。总部为你开了香槟。功绩+{g}，奖金{m}。|Six months in the heart of their operation, and you brought back intelligence that changed everything. HQ opened champagne. Merit +{g}, bonus {m}.' : '任务完成。功绩+{g}，奖金{m}。|Mission accomplished. Merit +{g}, bonus {m}.', { g: g, m: G.M(m) }); },
      function (r) { heat(G.ri(25, 35)); if (r.score < .2 && G.ch(.08)) { G.die('潜伏任务中牺牲|Killed on a deep-cover mission'); return ''; } return G.L('任务失败，你在最后一刻逃了出来。|The mission failed; you escaped at the last moment.'); }, { diff: .05 }),
    act('spy_interrog', '审讯对方特工（两关）|Interrogate an Enemy Agent (2 tests)', '🔦', 20, 3, 2,
      function () { var g = G.ri(40, 60); merit(g); return G.L('他终于开口了。功绩+{g}。|He finally talked. Merit +{g}.', { g: g }); },
      function () { heat(8); return G.L('他给你的全是假话，你过了一个月才发现。|Everything he told you was false — it took a month to find out.'); }),
    act('spy_mole', '揪出内鬼（两关）|Hunt the Mole (2 tests)', '🐀', 25, 4, 2,
      function () { var g = G.ri(70, 110); merit(g); heat(-10); return G.L('你揪出了潜伏在总部十年的内鬼。功绩+{g}。|You exposed a mole who\'d sat inside headquarters for ten years. Merit +{g}.', { g: g }); },
      function () { heat(15); return G.L('你怀疑错了人，还打草惊蛇。|You suspected the wrong person — and tipped off the real one.'); }, { diff: .05 }),
    { id: 'spy_quit', n: '退出情报组织|Leave the Service', i: '🚪', e: 0, a: [10, 120], if: function () { return !!P().spy && !P().jail; },
      run: async function (a) {
        if (!(await G.UI.confirm(G.L(a.n), G.L('退出后不能再回来。为外国机构工作的人，未必走得了。确定吗？|There\'s no coming back — and people who work for a foreign service aren\'t always allowed to leave. Sure?')))) return 'cancel';
        var sp = P().spy, r = SPY[sp.rank];
        if (G.spyMole() && sp.rank >= 2 && G.ch(.3)) { sp.heat = Math.min(100, (sp.heat || 0) + 45); return G.quick(a, G.L('他们没有回复。几天后，你发现有人在翻你家的垃圾。|They never replied. A few days later, you found someone going through your rubbish.'), { stress: 15 }); }
        P().spy = null; P().flags.exSpy = 1;
        return G.quick(a, G.L('你交回了证件。从此，你只是一个普通人。（最后职务：{r}）|You handed back your credentials. From now on you\'re an ordinary person. (Last post: {r})', { r: r }), { stress: -10 });
      } }
  ];
  var old = G.ACT_CATS.filter(function (c) { return c.id === 'spy'; })[0];
  if (old) old.items = ITEMS; else G.ACT_CATS.push({ id: 'spy', n: '情报工作|Intelligence Work', i: '🕵️', items: ITEMS });

  /* ---------- title ---------- */
  var tt = G.title;
  G.title = function () { var p = P(); if (p && p.spy && !S().dead && !p.jail) return p.spy.youth ? CADET : SPY[Math.min(p.spy.rank, SPY.length - 1)]; return tt.apply(this, arguments); };

  /* ---------- while you serve, life is the work ---------- */
  var pre = G.pickRandomEvents;
  G.pickRandomEvents = function (n) {
    if (G.spyOn()) { var out = [{ id: 'spy_case' }]; if (!P().spy.youth && n > 1 && G.ch(.6)) out.push({ id: 'spy_case' }); return out; }
    return pre.apply(this, arguments);
  };

  /* ---------- every year ---------- */
  var mt = G.money.tick;
  G.money.tick = function () {
    var r = mt.apply(this, arguments), s = S(), p = s.p;
    if (s.dead) return r;
    if (p.flags.swapTo && !p.jail) { var to = p.flags.swapTo; p.flags.swapTo = null; if (to !== p.country) { G.moveTo(to); p.cits = [to]; } G.major('在交换中获释|Freed in a prisoner exchange'); G.log('你在一座桥上被交换回来。{a}给了你一个新名字和一套房子。|You were traded on a bridge. {a} gave you a new name and a home.', { a: G.agencyName(to) }); pay(300000); }
    if (p.spy && !p.jail) {
      var sp = p.spy; sp.yrs++; sp.heat = sp.heat || 0;
      if (sp.youth && p.age >= 18) { sp.youth = 0; sp.rank = Math.max(sp.rank, 1); G.major('正式成为{a}的特工|Became a full agent of {a}', { a: G.agencyName(sp.ag) }); }
      if (sp.youth) pay(3000);
      else pay(SPY_PAY[sp.rank] * (G.spyMole() ? 1.6 : 1));
      sp.merit += G.ri(2, 6);
      sp.heat = G.clamp(sp.heat - 7 + (G.spyMole() ? 5 : 0) + ((p.pol || p.mil || p.gov) ? 2 : 0), 0, 100);
      if (!sp.youth && sp.merit >= 25 + sp.rank * 20 && sp.rank < SPY.length - 1) promote();
      if (!sp.youth && (sp.heat >= 100 || G.ch(Math.max(0, sp.heat - 25) / 240 * (G.spyMole() ? 1.5 : 1)))) q('spy_arrest');
    } else if (!p.jail && !p.spy && !p.flags.exSpy) {
      var cn = p.country === 'cn';
      if (!p.flags.spyYouth && p.age >= 11 && p.age <= 15 && p.st.smarts >= (cn ? 62 : 72) && G.ch(cn ? .16 : .07)) { p.flags.spyYouth = 1; q('spy_youth', null, { ag: pickAg(p.origin === 'spyfam' ? .9 : .55) }); }
      else if (!p.flags.spyAsked && p.age >= 20 && p.age <= 45 && p.money < G.$(800) && !p.pol && !p.mil && G.ch(.3)) { p.flags.spyAsked = 1; q('spy_recruit', null, { ag: pickAg(.6) }); }
      else if (!p.flags.spyHigh && high() && G.ch(.08)) { p.flags.spyHigh = 1; q('spy_high', null, { ag: pickAg(p.flags.spyReported ? .8 : .4) }); }
    }
    return r;
  };

  /* ---------- leverage for getting a child out ---------- */
  var inf = G.influence;
  if (inf) G.influence = function () { var w = inf.apply(this, arguments), p = P(); if (p.spy && p.spy.rank >= 4 && !p.spy.youth && w.indexOf(G.T(SPY[p.spy.rank])) < 0) w.push(G.T(SPY[p.spy.rank])); return w; };
})();
