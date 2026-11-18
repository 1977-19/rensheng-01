/* Version 3.0 identity stories, part 2: generals, officials, stars, nannies, soldiers, police, students, elders,
   children and ordinary people — plus fresh New Year scenes for every identity. One-time events only. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function Y(id, who, a, title, icon, t, opts, ex) {
    return E(id, a, title, icon, t, opts.map(function (o) { return O(o[0], typeof o[1] === 'function' ? o[1] : R(o[2], o[1] || {}), o[3]); }), Object.assign({ who: who, rep: 0, w: 3 }, ex || {}));
  }
  function after(id, yrs, f) { return function (S2, p) { return S2.done[id] && p.age - (S2.cool[id] || 0) >= (yrs || 1) && (!f || f(S2, p)); }; }
  function kids() { return N.rel('child').filter(function (k) { return k.alive; }); }
  function grandkids() { return N.all(function (n) { return n.alive && n.rel === 'grandchild'; }); }
  function nm(c, o) { var p = c.p; var n = N.make({ rel: o.rel || 'contact', g: o.g || (G.ch(.5) ? 'm' : 'f'), age: p.age + G.ri(o.d0 == null ? -5 : o.d0, o.d1 == null ? 6 : o.d1), aff: o.aff || G.ri(25, 45), c: o.c || p.country }); n.pin = 1; if (o.job) n.job = o.job; c.prm.n = n.name; c.prm.nid = n.id; return n; }
  function fx(c, e) { H.fx(c, e); }
  function merit(c, k, v) { var o = c.p[k]; if (o) o.merit = (o.merit || 0) + v; }

  /* ======================= 将军 · GENERALS ======================= */
  G.evs([
    Y('gn2_drill', 'general', [40, 70], '红蓝对抗|Red versus Blue', '🗺️', '年度对抗演习，你指挥蓝军。对面的红军指挥官是你军校时的上铺。|The annual exercise: you command Blue Force. Red Force is led by your old bunkmate from the academy.', [
      ['夜间奇袭他的指挥所|Raid his command post at night', RC(.55, '凌晨三点，你的侦察兵摸进了他的指挥所，把他的茶杯带了回来。导演部判你方获胜。|At 3 a.m. your scouts slipped into his HQ and brought back his tea mug. The umpires ruled for Blue.', { fame: 4, happy: 8 }, '他早就料到了，你的突击队全被“俘虏”了。复盘会上，他把你的茶杯还给了你。|He saw it coming; your raiders were all "captured". At the debrief he handed you back your own mug.', { happy: -4, eq: 3 })],
      ['稳扎稳打，正面推进|Steady frontal advance', { smarts: 3, fame: 2 }, '你们打成了平局。晚上两个人在帐篷里喝了一瓶酒，聊到天亮。|It ended a draw. That night the two of you shared a bottle in a tent and talked till dawn.']
    ]),
    Y('gn2_letter', 'general', [45, 80], '一封老兵的来信|A Letter from an Old Soldier', '✉️', '你收到一封手写信，是二十年前你带过的一个兵。他说他现在在老家开了一家修车铺，女儿考上了军校。|A handwritten letter from a soldier you commanded twenty years ago. He runs a garage back home now; his daughter has just got into a military academy.', [
      ['亲自回信|Write back yourself', { eq: 4, happy: 6 }, '你写了三页纸。一个月后，你收到了一张照片：修车铺墙上，裱着你的信。|You wrote three pages. A month later, a photo arrived: your letter, framed, on the garage wall.'],
      ['去他的修车铺看看|Visit his garage', { happy: 8, karma: 3 }, '他看到你的那一刻，扔下扳手，立正，敬了一个歪歪扭扭的礼。你们俩都笑了。|When he saw you he dropped his wrench, snapped to attention and gave a wonky salute. You both laughed.']
    ]),
    Y('gn2_retire', 'general', [55, 75], '最后一次检阅|The Final Review', '🎺', '这是你退役前的最后一次检阅。军乐队奏起了你最喜欢的那首进行曲。|Your last review before retirement. The band strikes up your favourite march.', [
      ['走下检阅台，和士兵们一一握手|Step down and shake every soldier\'s hand', { eq: 5, fame: 3, happy: 6 }, '你握了八百只手。最后一个是个新兵，手心全是汗。你对他说：“好好干。”他后来也成了将军。|You shook eight hundred hands. The last was a new recruit\'s, damp with nerves. "Do well," you told him. He became a general too.'],
      ['敬礼，转身，不回头|Salute, turn, don\'t look back', { stress: -6, happy: 3 }, '你一直走到车边才哭。司机把头扭向了窗外。|You made it to the car before you cried. The driver turned to look out of the window.']
    ])
  ]);

  /* ======================= 官员 · OFFICIALS ======================= */
  G.evs([
    Y('of2_incognito', 'official', [30, 70], '暗访|Unannounced Visit', '🕶️', '你换上便装，没带秘书，一个人去了政务大厅办事，想看看老百姓办一件事有多难。|In plain clothes, without your secretary, you go to the public service hall to see how hard it really is to get something done.', [
      ['排完全程|Wait it out like anyone else', function (c) { if (c.p.gov) { c.p.gov.appr = G.clamp((c.p.gov.appr || 50) + 5, 0, 100); c.p.gov.perf = G.clamp((c.p.gov.perf || 50) + 4, 0, 100); } fx(c, { karma: 3, stress: 4 }); return '你跑了四个窗口，排了五个小时，被告知“少了一张复印件”。第二周，全市推行了“一窗通办”。|Four windows, five hours, and "you\'re missing a photocopy". The following week the city launched one-stop service.'; }],
      ['当场亮明身份|Reveal who you are on the spot', { fame: 2 }, '大厅里的工作人员一下子变得特别热情。你突然明白了问题出在哪里。|The staff suddenly became extremely helpful. You realised exactly where the problem lay.']
    ]),
    Y('of2_flood', 'official', [28, 70], '汛期|Flood Season', '🌊', '连续七天的暴雨，河堤告急。指挥部里所有人都在等你决定：要不要开闸泄洪？|Seven days of rain and the levee is failing. Everyone in the command post waits for you: open the floodgates?', [
      ['开闸，提前转移下游群众|Open them; evacuate downstream first', function (c) { if (c.p.gov) c.p.gov.appr = G.clamp((c.p.gov.appr || 50) + 6, 0, 100); fx(c, { karma: 6, stress: 10, health: -2 }); return '你在堤上守了三天三夜。下游淹了八个村子，但没有一个人伤亡。|You stood on the levee three days and nights. Eight villages flooded downstream — not one life lost.'; }],
      ['再等等，相信河堤|Wait; trust the levee', RC(.45, '雨在第八天停了。河堤撑住了。你瘫坐在椅子上，一句话也说不出来。|The rain stopped on day eight. The levee held. You slumped in your chair, speechless.', { stress: 8, fame: 2 }, '凌晨，河堤决口了。|Before dawn, the levee broke.', { stress: 25, karma: -6, fame: -10, happy: -15 })]
    ]),
    Y('of2_banquet', 'official', [28, 65], '饭局|The Banquet', '🍾', '一位企业老板请你吃饭，包间里摆着一瓶三十年的茅台。他说：“就是认识一下，不谈工作。”|A businessman invites you to dinner; a thirty-year-old bottle of Moutai waits in the private room. "Just getting acquainted," he says. "No business."', [
      ['以茶代酒，吃完就走|Drink tea, eat, leave', { karma: 4, eq: 2 }, '老板有点尴尬。三年后他的公司出了事，名单上没有你的名字。|The businessman was awkward. Three years later his company collapsed; your name wasn\'t on any list.'],
      ['喝了那瓶酒|Drink the Moutai', RC(.6, '酒是好酒，事也真的没谈。你松了一口气。|Fine wine, and truly no business. You relaxed.', { happy: 4 }, '酒桌上的照片，两年后出现在了纪委的桌上。|A photo from that table landed on the discipline commission\'s desk two years later.', { stress: 18, fame: -8, karma: -5 })]
    ]),
    Y('of2_petition', 'official', [28, 70], '信访的老人|The Old Petitioner', '📄', '一位老人在政府门口站了整整一个月，手里举着一张发黄的纸。门卫说他“每年都来”。|An old man has stood outside government offices for a whole month, holding a yellowed sheet of paper. The guard says he "comes every year".', [
      ['请他进来，亲自看材料|Invite him in and read his papers yourself', RC(.5, '你花了三个晚上看完了二十年的材料。他是对的。你签了字，老人跪下了，你赶紧把他扶起来。|Three evenings reading twenty years of documents. He was right. You signed; the old man knelt, and you rushed to lift him up.', { karma: 10, eq: 4, fame: 2 }, '材料看完了，事情很复杂，你只能帮他解决一半。老人说：“一半也够了。”|Complicated; you could only fix half of it. "Half is enough," the old man said.', { karma: 5, eq: 3 })],
      ['让信访办处理|Pass it to the petitions office', { stress: 2 }, '第二年，他还是来了。|The next year he came back.']
    ])
  ]);

  /* ======================= 明星 · STARS ======================= */
  G.evs([
    Y('st2_variety', 'star', [18, 60], '真人秀|The Reality Show', '📺', '一档户外真人秀邀请你参加：去荒岛上生活七天，全程直播。|An outdoor reality show invites you: seven days on a desert island, all livestreamed.', [
      ['去，做真实的自己|Go, and be yourself', RC(.6, '你在岛上捉到了一条鱼，又让它跑了，坐在沙滩上骂了五分钟。这段骂人视频让你圈粉三百万。|You caught a fish, lost it, and swore at the sea for five minutes. That clip won you three million new fans.', { fame: 8, happy: 6 }, '第三天你就哭着要回家。弹幕刷满了“娇气”。|Day three you were crying to go home. The comments were a wall of "spoilt".', { fame: -4, stress: 6 })],
      ['去，按剧本演|Go, and follow the script', { fame: 3, stress: 2 }, '节目效果很好。只是你后来再看回放，觉得那个人不太像你。|Great television. But rewatching it later, the person on screen didn\'t feel like you.']
    ]),
    Y('st2_dating_leak', 'star', [20, 50], '恋情曝光|Romance Exposed', '📸', '凌晨两点，狗仔发布了你和恋人在便利店买关东煮的照片。经纪人打来十二个未接电话。|2 a.m.: the paparazzi publish photos of you and your partner buying oden at a convenience store. Your manager has called twelve times.', [
      ['大方承认：“是的，我们在一起。”|Own it: "Yes, we\'re together."', { fame: 4, happy: 6, part: 8 }, '微博服务器崩了。第二天，那家便利店的关东煮卖光了。|The servers crashed. Next day, the store sold out of oden.'],
      ['经纪人发声明：“只是好朋友。”|Manager\'s statement: "Just good friends."', { fame: 1, part: -8, stress: 4 }, '恋人看完声明，一晚上没回你的消息。|Your partner read the statement and didn\'t reply to you all night.']
    ], { if: function () { return !!N.partner(); } }),
    Y('st2_stunt', 'star', [18, 55], '要不要用替身|To Use a Stunt Double?', '🎬', '剧本里有一场从三楼跳下来的戏。武术指导说，替身已经准备好了。|The script has a jump from the third floor. The stunt coordinator says a double is ready.', [
      ['自己来|Do it yourself', RC(.75, '一条过。花絮视频里你落地以后在垫子上打了个滚，比了个“耶”。|One take. In the behind-the-scenes clip you rolled off the mat and flashed a peace sign.', { fame: 6, happy: 6, health: -2 }, '你落地时扭伤了脚踝，剧组停工两周。|You twisted your ankle on landing; the shoot stopped for two weeks.', { health: -10, fame: 2, stress: 6 })],
      ['用替身，但在片尾写上他的名字|Use the double — and credit him by name', { karma: 6, eq: 3 }, '电影上映后，替身演员的妈妈在影院里看到了儿子的名字，拍照发了朋友圈。|When the film came out, the double\'s mother saw her son\'s name on screen and posted a photo of it.']
    ]),
    Y('st2_fall', 'star', [35, 70], '过气|Out of Fashion', '🍂', '新剧的海报上，你的名字排在了第五位。上一次排第五，还是你刚出道的时候。|On the new drama\'s poster your name is fifth. The last time you were fifth was when you started out.', [
      ['认真演好这个配角|Make the supporting role sing', { eq: 4, karma: 2, fame: 3 }, '剧播出后，观众说“这个配角比主角好看多了”。导演请你演下一部的主角。|After it aired, viewers said "the supporting role steals the show". The director cast you as the lead in the next one.'],
      ['转去做导演|Move behind the camera', { smarts: 4, fame: 2, stress: 4 }, '你导的第一部小成本电影拿了一个新人导演奖。领奖时你说：“我终于知道当年的导演有多辛苦了。”|Your first low-budget film won a debut director award. On stage you said: "Now I know how hard my old directors had it."'],
      ['发一条神秘的朋友圈|Post something cryptic', { fame: 1 }, '“有些光，会在别处亮起。”配图是一张夕阳。三个粉丝点了赞。|"Some lights shine elsewhere." Sunset photo. Three fans liked it.']
    ]),
    Y('st2_endorse', 'star', [20, 60], '代言翻车|Endorsement Gone Wrong', '🧴', '你代言的一款面霜被查出成分有问题。热搜第一：“XX代言产品致过敏”。|A face cream you endorse has been found to contain dodgy ingredients. Number one trending: "XX-Endorsed Product Causes Allergies".', [
      ['解约，并自掏腰包赔偿消费者|Terminate and compensate customers yourself', { money: -80000, karma: 8, fame: 3 }, '你赔了每一个受害者。网友说：“这才是有担当。”品牌方后来倒闭了，你的口碑反而涨了。|You compensated every victim. The internet said: "That\'s responsibility." The brand went bust; your reputation went up.'],
      ['让工作室发个模糊的声明|Let the studio issue a vague statement', { fame: -6, stress: 6 }, '“我们高度重视……”这句话被网友做成了一百张表情包。|"We take this extremely seriously…" became a hundred memes.']
    ]),
    Y('st2_fan_gift', 'star', [16, 50], '粉丝的应援|Fan Support', '🎁', '粉丝后援会为你准备了生日应援：包下一整面城市地标的大屏，还要送你一辆车。|Your fan club has your birthday covered: a whole landmark billboard — and they want to buy you a car.', [
      ['婉拒礼物，请他们把钱捐给山区学校|Decline; ask them to donate to rural schools', { karma: 8, fame: 4, eq: 3 }, '粉丝们建了两所希望小学，用你的名字命名。你去剪彩那天，孩子们给你唱了你的歌——跑调了。|The fans built two schools in your name. At the opening the children sang your song — out of tune.'],
      ['收下，开直播感谢|Accept and thank them live', { fame: 3, happy: 6, karma: -2 }, '直播间里一片欢呼。不过第二天有媒体算了算：那辆车，是两千个学生凑的生活费。|The stream went wild. Next day a journalist worked out the car was two thousand students\' living money.']
    ]),
    Y('st2_comeback', 'star', [40, 80], '复出|The Comeback', '🎤', '你已经五年没有公开露面了。一档老歌综艺请你回来唱一首你当年的成名曲。|You haven\'t been seen in public for five years. A nostalgia show asks you back to sing the song that made you.', [
      ['原调，不降key|Original key, no transposing', RC(.5, '最后一个高音，你上去了。全场起立。那一晚，你的老歌重回榜首。|You hit the last high note. The whole audience stood. That night the song topped the charts again.', { fame: 10, happy: 12 }, '高音破了。你笑着对观众说：“老了。”掌声比任何一次都响。|Your voice cracked on the high note. You smiled: "I\'m old." The applause was the loudest you ever got.', { fame: 6, happy: 8 })],
      ['改成慢版，讲讲这些年|Slow it down, and tell them about the years', { eq: 5, fame: 5, happy: 6 }, '你唱到一半停下来，讲了你这五年在哪里。那段话被剪成了一个短视频，播放量过亿。|Halfway through you stopped and told them where you\'d been. That clip passed a hundred million views.']
    ], { if: after('st2_fall', 3) })
  ]);

  /* ======================= 保姆 · NANNY ======================= */
  G.evs([
    Y('nn2_kid_secret', 'nanny', [18, 65], '孩子的秘密|The Child\'s Secret', '🤫', '你带的小孩悄悄告诉你：他在学校被人欺负，但不许你告诉他爸妈，“他们会觉得我没用”。|The child you look after whispers that he\'s being bullied at school — and you mustn\'t tell his parents: "They\'ll think I\'m useless."', [
      ['教他几招，再陪他去找老师|Teach him a few tricks, then go with him to the teacher', { eq: 5, karma: 4 }, '一个月后，欺负他的孩子成了他最好的朋友。他说：“阿姨比我爸妈厉害。”|A month later the bully was his best friend. "You\'re better than my parents," he said.'],
      ['告诉主人家|Tell the parents', { karma: 2, stress: 3 }, '主人家处理得很果断。可那孩子一个星期没跟你说话。|The parents handled it swiftly. But the boy didn\'t speak to you for a week.']
    ]),
    Y('nn2_vacation', 'nanny', [18, 65], '跟着主人家去度假|The Family Holiday', '🏖️', '主人家去海岛度假，带上了你。你住在别墅最小的房间，可窗外就是海。|The family takes you along to an island holiday. You get the smallest room in the villa — but the window faces the sea.', [
      ['趁孩子午睡，自己去海里游一圈|While the child naps, swim in the sea', { happy: 10, health: 2 }, '那是你这辈子第一次在海里游泳。你游了很远，回头看那栋别墅，突然觉得它也没那么大。|Your first ever swim in the sea. You swam out far; looking back, the villa didn\'t seem so big.'],
      ['寸步不离地看着孩子|Never leave the child\'s side', { eq: 2, karma: 2 }, '回来以后，女主人多给了你一个月工资：“这一趟辛苦你了。”|Back home the mistress paid you an extra month: "That trip must have been hard work."']
    ]),
    Y('nn2_own_kid', 'nanny', [22, 60], '视频里的自己的孩子|Your Own Child on Video Call', '📱', '你在给主人家的孩子讲睡前故事。手机震了一下，是你老家的孩子发来的视频：“妈妈/爸爸，你什么时候回来？”|You\'re telling the employer\'s child a bedtime story when your phone buzzes: a video from your own child back home. "When are you coming back?"', [
      ['讲完故事再回电话|Finish the story, then call back', { eq: 3, stress: 5 }, '你回电话的时候，自己的孩子已经睡着了。你对着屏幕看了很久。|When you called back, your own child had fallen asleep. You watched the screen a long time.'],
      ['向主人家请假回家|Ask for leave to go home', { happy: 10, kids: 8, money: -1000 }, '你回家待了一周。孩子拉着你的衣角睡觉，生怕你又走了。|You went home for a week. Your child slept holding a corner of your shirt, afraid you\'d leave again.']
    ], { noGate: 1, if: function () { return kids().some(function (k) { var a = N.age(k); return a >= 3 && a <= 15; }); } })
  ]);

  /* ======================= 军人 · SOLDIERS ======================= */
  G.evs([
    Y('so2_boot', 'soldier', [17, 30], '新兵连的第一个晚上|First Night in Boot Camp', '🛏️', '熄灯号吹过，班长让所有人把被子叠成“豆腐块”。你的被子看起来像一个包子。|Lights-out has sounded. The squad leader wants every blanket folded into a perfect "tofu block". Yours looks like a dumpling.', [
      ['偷偷用书本压一晚上|Press it under books all night', { smarts: 2, happy: 3 }, '第二天，你的豆腐块拿了全连第一。班长看了很久，说：“书拿出来。”|Next morning your block was best in the company. The squad leader looked a long time, then said: "Take the books out."'],
      ['请教隔壁床的老兵|Ask the veteran in the next bunk', { eq: 4 }, '老兵教了你一夜，最后说：“叠被子不是目的，是让你学会把一件小事做到最好。”|He taught you all night. At the end: "It\'s not about blankets. It\'s about doing one small thing perfectly."']
    ]),
    Y('so2_cook', 'soldier', [18, 35], '炊事班|The Cookhouse', '🍲', '你被临时调去炊事班帮厨。全连一百二十个人的晚饭，交给你了。|You\'re temporarily posted to the cookhouse. Dinner for all one hundred and twenty is on you.', [
      ['做你家乡的拿手菜|Cook your hometown speciality', RC(.65, '那天晚上，连长吃了三碗饭。从此以后，每个周五都是“你的家乡菜日”。|The company commander had three bowls. From then on, every Friday was your hometown dish night.', { happy: 8, eq: 3 }, '你把盐当成了糖。全连吃了一顿甜的红烧肉。|You used sugar instead of salt. The whole company ate sweet braised pork.', { happy: 2 })],
      ['老老实实按食谱做|Follow the recipe to the letter', { health: 2 }, '中规中矩，没人夸也没人骂。炊事班长说：“你适合当指挥员，不适合当厨子。”|Fine. No praise, no complaints. The mess sergeant said: "You\'re officer material, not a cook."']
    ]),
    Y('so2_rescue', 'soldier', [18, 45], '抗洪抢险|Flood Rescue', '🚤', '洪水围困了一个村子。你们连接到命令：两个小时内赶到。|Floodwaters have cut off a village. Your company is ordered there within two hours.', [
      ['冲在最前面|Go in first', function (c) { merit(c, 'mil', 10); fx(c, { health: -4, karma: 8, fame: 3 }); var n = nm(c, { rel: 'friend', d0: -40, d1: -30, aff: 70, job: '学生|Student' }); return '你从屋顶上背下来一个孩子。十五年后，{n}穿着军装来找你：“叔叔/阿姨，我当兵了。”|You carried a child down from a roof. Fifteen years later {n} turned up in uniform: "I joined the army too."'; }],
      ['负责后方物资|Run supplies at the rear', { eq: 3, karma: 3 }, '你三天没合眼，保证了前方每一个人都有干粮和水。|Three days without sleep; every soldier up front had food and water.']
    ]),
    Y('so2_leave', 'soldier', [18, 40], '探亲假|Home on Leave', '🎒', '三年来第一次探亲假。你穿着军装走进村口的那一刻，整个村子都出来了。|Your first home leave in three years. The moment you walk into the village in uniform, everyone comes out.', [
      ['先去看爸妈|Go to your parents first', { par: 10, happy: 10 }, '妈妈摸着你的脸说：“黑了，瘦了，结实了。”爸爸什么也没说，去杀了家里唯一的一只鸡。|Mum touched your face: "Darker, thinner, stronger." Dad said nothing — and went to kill the family\'s only chicken.'],
      ['去看看小学的老师|Visit your old primary school teacher', { eq: 3, happy: 6 }, '老师已经退休了，她从抽屉里拿出你一年级写的作文：《我的理想是当解放军》。|She\'d retired. From a drawer she took your first-grade essay: "When I grow up I want to be a soldier."']
    ]),
    Y('so2_discharge', 'soldier', [20, 45], '退伍那天|Discharge Day', '🎖️', '退伍的前一天晚上，全班的人坐在操场上，谁也不说话。|The night before discharge, your whole squad sits on the parade ground. Nobody speaks.', [
      ['唱一首《驼铃》|Sing "Camel Bells"', { eq: 4, happy: 4 }, '第一句还没唱完，所有人都哭了。连长从远处走过来，坐下，也跟着唱。|Before the first line ended everyone was crying. The company commander walked over, sat down, and sang along.'],
      ['在营房墙上偷偷刻下名字|Secretly carve your name on the barracks wall', { happy: 5 }, '十年后，一个新兵在墙上发现了你的名字，拍照发到了网上。你在评论区里回了一句：“是我。”|Ten years later a recruit found your name on the wall and posted it. You replied in the comments: "That was me."']
    ], { if: function (S2, p) { return p.mil && (p.mil.cons ? p.mil.yrs >= (p.mil.term || 2) - 1 : p.mil.yrs >= 4) && !p.mil.off; } })
  ]);

  /* ======================= 警察 · POLICE ======================= */
  G.evs([
    Y('po2_first', 'police', [20, 35], '第一次出警|Your First Callout', '🚨', '你的第一个警情：一位大妈报警说，她家的鹦鹉被邻居“偷”走了。|Your first callout: a lady reports that her neighbour has "stolen" her parrot.', [
      ['认真调查|Investigate properly', { smarts: 3, eq: 3, happy: 4 }, '你花了一下午，发现鹦鹉是自己飞到邻居家的。鹦鹉会说的唯一一句话是：“你是坏人！”两家人笑成一团。|A whole afternoon, and it turned out the parrot had flown next door by itself. Its only phrase was "You\'re a bad person!" Both families fell about laughing.'],
      ['调解，让两家人握手言和|Mediate a handshake', { eq: 5 }, '两家人握了手。临走时，鹦鹉对你喊了一句“你是好人”。你决定把这当作职业生涯的好兆头。|They shook hands. As you left, the parrot shrieked "You\'re a good person!" You chose to take it as a good omen.']
    ]),
    Y('po2_lost_elder', 'police', [20, 60], '走失的老人|The Lost Grandpa', '👴', '凌晨一点，一位患阿尔茨海默症的老人走失了。家属说，他总说要“回家”，可他早就在家里了。|1 a.m.: an old man with Alzheimer\'s has wandered off. His family says he keeps saying he wants to "go home" — though he is home.', [
      ['去他年轻时住的老街找|Search the street where he lived as a young man', function (c) { merit(c, 'pol', 6); fx(c, { karma: 6, eq: 4, happy: 6 }); return '你在一片拆迁工地前找到了他。他指着一堆砖头说：“我家就在这儿。”你陪他坐了一会儿，然后说：“我送您回家。”|You found him in front of a demolition site. Pointing at a pile of bricks: "My house is here." You sat with him a while, then said: "Let me take you home."'; }],
      ['调监控|Check the CCTV', { smarts: 3, karma: 3 }, '你在一个公交站找到了他。他手里攥着一张四十年前的车票。|You found him at a bus stop, clutching a ticket from forty years ago.']
    ], { noGate: 1 }),
    Y('po2_undercover', 'police', [24, 45], '卧底|Undercover', '🎭', '队里需要一个生面孔，混进一个电信诈骗团伙。队长看着你。|The squad needs a fresh face to infiltrate a phone-scam gang. The captain is looking at you.', [
      ['接下任务|Take it', RC(.6, '三个月后，你带出了整个团伙的名单和账本。一百多名受害者拿回了钱。|Three months later you walked out with the gang\'s whole roster and ledgers. Over a hundred victims got their money back.', { fame: 4, karma: 8, stress: 10 }, '第二个月你就暴露了，翻窗跑出来的时候摔断了胳膊。|You were blown in the second month and broke your arm going out of a window.', { health: -10, stress: 15 })],
      ['推荐一个更合适的同事|Recommend a better-suited colleague', { eq: 2 }, '同事干得很漂亮，立了一等功。庆功宴上他对你说：“谢了。”你心里有点不是滋味。|Your colleague did brilliantly and won a first-class commendation. At the party he said: "Thanks." It stung a little.']
    ]),
    Y('po2_neighbor', 'police', [22, 60], '楼上楼下|Upstairs, Downstairs', '🏢', '同一栋楼的两户人家，因为楼上孩子跳绳的声音，已经报警十七次了。今天是第十八次。|Two households in the same building have called the police seventeen times over the upstairs child\'s skipping rope. Today is number eighteen.', [
      ['给楼上买一张瑜伽垫|Buy the upstairs family a yoga mat', { money: -50, eq: 5, karma: 3, happy: 4 }, '问题解决了。楼下的老太太后来每周给你所在的派出所送一锅饺子。|Problem solved. The old lady downstairs now delivers a pot of dumplings to your station every week.'],
      ['把两家人请到一起吃顿饭|Get both families round one table', RC(.6, '饭吃到一半，两家人发现是老乡。现在他们一起跳广场舞。|Halfway through dinner they discovered they came from the same town. Now they square-dance together.', { eq: 6, happy: 6 }, '饭桌上吵起来了，还掀了桌子。你成了第十九次报警的当事人。|It turned into a fight; a table was flipped. You became a party to call number nineteen.', { stress: 6 })]
    ])
  ]);

  /* ======================= 学生 · STUDENTS ======================= */
  G.evs([
    Y('su2_dorm', 'student', [15, 24], '宿舍卧谈会|Midnight Dorm Talk', '🌙', '熄灯以后，宿舍里有人问：“如果明天是世界末日，你们今晚最想干什么？”|After lights-out someone asks: "If the world ended tomorrow, what would you do tonight?"', [
      ['说出暗恋的人的名字|Name your secret crush', { happy: 6, eq: 3 }, '宿舍安静了三秒，然后爆发出尖叫。第二天，全年级都知道了。你的暗恋对象在走廊里对你笑了一下。|Three seconds of silence, then shrieks. By morning the whole year knew. Your crush smiled at you in the corridor.'],
      ['“背完明天要考的单词。”|"Finish memorising tomorrow\'s vocab."', { smarts: 3 }, '全宿舍朝你扔枕头。第二天的单词测验，你是唯一的满分。|Every pillow flew your way. Next day you got the only perfect score on the vocab test.']
    ]),
    Y('su2_club', 'student', [12, 24], '社团招新|Club Recruitment Day', '🎪', '社团招新的摊位排满了整条路：街舞社、天文社、辩论社，还有一个叫“发呆研究会”的。|Club stalls line the whole street: street dance, astronomy, debate — and something called the "Society for Zoning Out".', [
      ['加入天文社|Join the astronomy club', { smarts: 4, happy: 4 }, '你们在山顶熬了一夜，等到了流星雨。那天晚上你许了一个愿，后来真的实现了。|You stayed up all night on a hilltop and caught the meteor shower. You made a wish that night. It came true.'],
      ['加入“发呆研究会”|Join the Society for Zoning Out', { happy: 8, stress: -6 }, '每周三下午，十几个人坐在草坪上发呆，谁先说话谁请喝奶茶。这是你学生时代最快乐的时光。|Wednesday afternoons, a dozen people zoning out on the lawn — first to speak buys the bubble tea. The happiest hours of your schooldays.'],
      ['加入辩论社|Join the debate club', { eq: 4, smarts: 2 }, '第一次比赛你紧张得说不出话。第三年，你拿了全市最佳辩手。|You froze at your first contest. By year three you were the city\'s best speaker.']
    ]),
    Y('su2_caught', 'student', [13, 18], '早恋被抓|Caught Holding Hands', '💘', '晚自习后，你和喜欢的人在操场上牵手，被教导主任的手电筒照了个正着。|After evening study you\'re holding hands with your crush on the sports field — straight into the beam of the dean\'s torch.', [
      ['“我们在讨论数学题！”|"We\'re discussing maths!"', RC(.4, '主任：“那你说，这道题怎么解？”你流利地解了一道函数题。他关掉手电筒走了。|The dean: "Go on then, solve this one." You fluently solved a function problem. He switched off the torch and left.', { smarts: 2, happy: 6 }, '主任：“讨论数学要牵手？”第二天，你们的名字出现在了广播里。|"You need to hold hands for maths?" Next day your names were on the school PA.', { stress: 6, par: -3 })],
      ['坦然承认|Admit it', { eq: 4, stress: 3 }, '主任沉默了一会儿：“成绩不许掉。掉了我就告诉你们家长。”说完，他把手电筒关了。|The dean was quiet a moment. "Grades don\'t slip. If they do, your parents hear about it." Then he turned off the torch.']
    ]),
    Y('su2_photo', 'student', [17, 24], '毕业照|The Graduation Photo', '📷', '拍毕业照的那天，摄影师喊“一二三”，有人在后排比了个兔耳朵——比在了你头上。|Graduation photo day. On "three", someone in the back row gives you bunny ears.', [
      ['回头比一个更大的|Turn round and do it back, bigger', { happy: 8, eq: 2 }, '最后洗出来的照片上，后两排全在比兔耳朵。这张照片在同学群里置顶了二十年。|In the final print, the back two rows are all bunny ears. It stayed pinned in the class chat for twenty years.'],
      ['保持微笑|Keep smiling', { happy: 3 }, '你在照片里笑得很标准。二十年后你翻出这张照片，才看到自己头上的兔耳朵，一个人笑出了声。|You smiled perfectly. Twenty years later you dug it out, finally noticed the bunny ears, and laughed out loud alone.']
    ])
  ]);

  /* ======================= 老年 · ELDERS ======================= */
  G.evs([
    Y('el2_dance', 'elder', [60, 90], '广场舞领舞|Leading the Square Dance', '💃', '广场舞队的领舞摔伤了腿，大家一致推选你来当新的领舞。|The square-dance leader has hurt her leg, and the troupe votes unanimously for you to take over.', [
      ['接下，还要编一支新舞|Accept — and choreograph something new', { happy: 10, health: 3, fame: 1 }, '你把年轻时候的迪斯科编了进去。三个月后，你们队拿了全区比赛第一名。|You worked in your old disco moves. Three months later the troupe won the district championship.'],
      ['推荐给隔壁的老李|Nominate old Li next door', { eq: 3 }, '老李跳得很卖力，就是总踩错拍。你在最后一排偷偷笑了一整年。|Old Li gave it everything — always half a beat off. You chuckled in the back row for a year.']
    ]),
    Y('el2_univ', 'elder', [60, 90], '老年大学|University of the Third Age', '🎓', '老年大学开学了。课程表上有：书法、摄影、智能手机使用、还有“如何识别网络诈骗”。|The seniors\' university term begins. Courses: calligraphy, photography, using your smartphone — and "spotting online scams".', [
      ['报智能手机班|Sign up for smartphones', { smarts: 4, happy: 4 }, '学会了以后，你在家族群里发了人生第一个表情包。全家人都惊了。|Once you\'d learned, you sent your first ever meme to the family chat. Everyone was stunned.'],
      ['报摄影班|Sign up for photography', { happy: 6, eq: 2 }, '你拍的一张晨练老人的照片，被市里的报纸选中，登在了头版。|Your photo of old folk doing morning exercises was picked up by the city paper — front page.'],
      ['报书法班|Sign up for calligraphy', { smarts: 2, stress: -6 }, '你写的第一副春联，被孙辈贴在了自己的房门上。|Your first New Year couplet ended up on your grandchild\'s bedroom door.']
    ]),
    Y('el2_scam', 'elder', [60, 95], '“我是你孙子”|"It\'s Me, Your Grandson"', '☎️', '电话里一个年轻人哭着说：“爷爷/奶奶，我出车祸了，你快打五万块钱过来，别告诉我爸妈！”|A young voice on the phone, sobbing: "It\'s me — I\'ve been in a crash, send fifty thousand now, don\'t tell Mum and Dad!"', [
      ['“你叫什么名字？”|"What\'s your name?"', { smarts: 4, happy: 6 }, '对方愣了两秒，挂了电话。你在家族群里把这件事讲了一遍，孙辈们给你点了一百个赞。|Two seconds of silence; the line went dead. You told the family chat; the grandkids sent a hundred thumbs-up.'],
      ['马上去银行|Rush to the bank', RC(.6, '银行柜员拦住了你：“阿姨/叔叔，这是诈骗。”你拉着她的手说了十声谢谢。|The bank teller stopped you: "This is a scam." You held her hand and thanked her ten times.', { stress: 6, eq: 2 }, '钱打出去了。你一个人坐在银行门口很久，不知道该怎么跟孩子们说。|The money was gone. You sat outside the bank a long time, unsure how to tell your children.', { money: -7000, happy: -10, stress: 10 })]
    ], { noGate: 1 }),
    Y('el2_memoir', 'elder', [65, 100], '写一本自传|Writing a Memoir', '📔', '孙辈送你一本空白的笔记本：“把你的故事写下来吧，我们想看。”|Your grandchildren give you a blank notebook: "Write your story down. We want to read it."', [
      ['从头写，一个字也不漏|From the beginning, leaving nothing out', { smarts: 3, happy: 6, eq: 3 }, '你写了两年，写满了五个本子。最后一页写着：“这一辈子，值了。”|Two years, five notebooks. The last page says: "This life was worth it."'],
      ['只写最开心的十件事|Write only the ten happiest things', { happy: 10 }, '你写到第七件就停不下来了，最后写了七十件。|By number seven you couldn\'t stop. You ended at seventy.']
    ], { if: function () { return grandkids().length > 0 || kids().length > 0; } }),
    Y('el2_hometown', 'elder', [62, 95], '回老家看看|Back to Where You Were Born', '🏡', '你回到了出生的地方。小时候的河填平了，变成了一条马路；你家的老房子变成了一家奶茶店。|You go back to where you were born. The childhood river is filled in — a road now. Your family\'s old house is a bubble-tea shop.', [
      ['进去点一杯奶茶|Go in and order a bubble tea', { happy: 6, eq: 2 }, '你坐在当年自己睡觉的位置上，喝完了一杯全糖奶茶。店员小姑娘问你：“爷爷/奶奶，好喝吗？”你说：“好喝。”|You sat where your bed used to be and drank a full-sugar bubble tea. The girl behind the counter asked if it was good. You said yes.'],
      ['找到了当年的玩伴|Track down a childhood playmate', function (c) { var n = nm(c, { rel: 'friend', d0: -2, d1: 2, aff: 60 }); fx(c, { happy: 10, eq: 3 }); return '{n}已经头发全白了，可一开口还是叫你的小名。你们坐在村口的石头上，一直聊到天黑。|{n} was white-haired now, but still called you by your childhood nickname. You sat on the rock at the village entrance and talked until dark.'; }]
    ])
  ]);

  /* ======================= 孩子 · CHILDREN ======================= */
  G.evs([
    Y('ch2_tooth', 'child', [5, 8], '第一颗乳牙掉了|Your First Tooth Falls Out', '🦷', '你咬了一口苹果，一颗牙掉在了苹果上。|You bite into an apple and a tooth comes out in it.', [
      ['按老规矩扔到房顶上|Throw it on the roof, the old way', { happy: 6 }, '你扔了三次才扔上去。奶奶说，这样新牙会长得又快又齐。|It took three throws. They say that makes the new tooth come in fast and straight.'],
      ['藏在枕头底下等牙仙|Put it under your pillow for the tooth fairy', { happy: 8 }, '第二天早上，枕头底下多了一枚硬币，和一张字迹很像爸爸的纸条。|In the morning there was a coin under the pillow — and a note in handwriting that looked a lot like Dad\'s.']
    ], { noGate: 1, w: 5 }),
    Y('ch2_hide', 'child', [4, 10], '捉迷藏冠军|Hide-and-Seek Champion', '🙈', '小区里的孩子们在玩捉迷藏，你想找一个没人能找到的地方。|The kids on the estate are playing hide-and-seek. You want a spot nobody will ever find.', [
      ['钻进洗衣机|Climb into the washing machine', RC(.7, '整整一个小时都没人找到你。最后你在里面睡着了，是妈妈晾衣服的时候发现的。|Nobody found you for a whole hour. You fell asleep in there; Mum found you when she came to do the laundry.', { happy: 8 }, '门从外面关上了。你在里面哭了五分钟，邻居来把你救了出来。|The door clicked shut. Five minutes of crying before a neighbour got you out.', { happy: -2, stress: 3 })],
      ['爬到树上|Climb a tree', { happy: 6, health: 1 }, '你在树上看着大家找了你一下午。天黑了，你才发现自己下不来了。|You watched them search all afternoon from the branches. At dusk you realised you couldn\'t get down.']
    ], { w: 5 }),
    Y('ch2_candy', 'child', [4, 9], '藏起来的糖|The Hidden Sweets', '🍬', '你发现了大人藏在衣柜最顶上的一盒糖。|You\'ve found the box of sweets the grown-ups hid on top of the wardrobe.', [
      ['每天只吃一颗|Just one a day', { smarts: 2, happy: 4 }, '你吃了一个月都没被发现。最后一颗你留给了妈妈。|A month without being caught. You saved the last one for Mum.'],
      ['一口气吃完|Eat the lot', { happy: 8, health: -2 }, '晚上你牙疼得睡不着。第二天，那盒糖被放到了一个你永远找不到的地方。|Toothache all night. The next day the box moved somewhere you never found.']
    ], { w: 5 }),
    Y('ch2_cartoon', 'child', [4, 10], '动画片和作业|Cartoons Versus Homework', '📺', '动画片的大结局，和作业的截止时间，在同一个晚上。|The cartoon\'s grand finale and your homework deadline fall on the same night.', [
      ['边看边写|Do both at once', { happy: 6, perf: -3 }, '大结局很感人。你的作业本上有一滴眼泪，和三道错题。|The finale was moving. Your homework had a teardrop and three wrong answers.'],
      ['先写作业，录下来明天看|Homework first; record it for tomorrow', { smarts: 2, perf: 3 }, '第二天课间，全班都在讨论大结局，你捂着耳朵跑出了教室。|At break the whole class discussed the ending; you fled with your hands over your ears.']
    ], { w: 5 })
  ]);

  /* ======================= 普通人 · ORDINARY LIVES ======================= */
  G.evs([
    Y('cm2_flatmate', 'common', [20, 32], '奇怪的合租室友|The Strange Flatmate', '🏠', '新室友搬进来的第一天，带来了一只乌龟、一台缝纫机和一把电吉他。|On day one, your new flatmate moves in with a tortoise, a sewing machine and an electric guitar.', [
      ['主动去认识一下|Go and say hello', function (c) { var n = nm(c, { rel: 'friend', d0: -3, d1: 3, aff: 50 }); fx(c, { happy: 6, eq: 3 }); return '{n}是个服装设计师，晚上弹吉他，白天给乌龟做衣服。你们成了最好的朋友。|{n} turned out to be a fashion designer: guitar by night, tiny clothes for the tortoise by day. You became best friends.'; }],
      ['买一副降噪耳机|Buy noise-cancelling headphones', { money: -200, stress: -2 }, '你戴着耳机过了一年。搬走那天，乌龟穿着一件小毛衣来门口送你。|A year in headphones. On moving day the tortoise saw you off at the door, wearing a little jumper.']
    ], { w: 4 }),
    Y('cm2_courier', 'common', [18, 70], '下雨天的外卖|Delivery in the Rain', '🛵', '暴雨天，你点的外卖晚了四十分钟。外卖小哥浑身湿透，一直在道歉，说这一单超时要扣钱。|In a downpour your takeaway arrives forty minutes late. The rider, soaked through, keeps apologising — he\'ll be fined for the delay.', [
      ['给五星好评，再塞给他一瓶热饮|Five stars, and press a hot drink into his hands', { karma: 5, happy: 4 }, '他愣了一下，对你鞠了一躬。后来每次你点那家店，他都抢着接单。|He froze, then bowed to you. Ever after, whenever you ordered from that shop, he grabbed the job.'],
      ['点“超时”投诉|Hit "late" and complain', { karma: -4 }, '你省了三块钱的补偿。那天晚上你吃着凉掉的面，总觉得哪里不太对。|You got three dollars back. Eating your cold noodles, something felt off.']
    ], { w: 4 }),
    Y('cm2_blind', 'common', [24, 40], '相亲角|The Matchmaking Corner', '📋', '你妈妈背着你，把你的简历挂在了公园的相亲角。上面写着你“年薪百万，一米八”。|Behind your back, Mum has pinned your CV in the park\'s matchmaking corner. It says you earn a million a year and are six foot.', [
      ['去公园把简历撕下来|Go and tear it down', { happy: 3, par: -2 }, '你到的时候，一位大爷正举着你的简历在跟人讨价还价。|When you arrived, an old man was haggling over your CV.'],
      ['去见一个，看看是谁会信|Meet one — who believes this stuff?', function (c) { var n = nm(c, { rel: 'contact', d0: -3, d1: 4, aff: 40 }); n.love = 25; fx(c, { happy: 5 }); return '对方叫{n}。见面第一句话：“你也是被你妈挂上去的吧？”你们笑了一个下午。|They were called {n}. Their first words: "Your mum pinned you up too, huh?" You laughed all afternoon.'; }]
    ], { if: function () { return !N.partner(); } }),
    Y('cm2_bonus', 'common', [22, 60], '年终奖|The Year-End Bonus', '🧧', '年终奖发下来了：一箱苹果、一桶油、和一张“优秀员工”的奖状。|The year-end bonus is in: a box of apples, a tub of cooking oil and an "Outstanding Employee" certificate.', [
      ['把奖状贴在出租屋的墙上|Stick the certificate on your bedsit wall', { happy: 5 }, '那张奖状在墙上挂了五年，搬了三次家都带着。|It hung on your wall five years and moved house with you three times.'],
      ['在年会上举手提问|Ask a question at the company party', RC(.4, '你问：“明年能不能把苹果换成钱？”全场安静，然后老板笑着说：“可以。”第二年真的发了奖金。|You asked: "Could next year\'s apples be cash?" Silence — then the boss laughed: "Fine." And next year there was a cash bonus.', { money: 3000, fame: 1, happy: 6 }, '第二年你的奖状没有了，只剩下苹果。|Next year: no certificate. Just apples.', { happy: -2 })]
    ], { if: function (S2, p) { return !!p.job; } }),
    Y('cm2_lottery', 'common', [20, 80], '中了五块钱|You Won Five Dollars', '🎟️', '你买的彩票中了五块钱。|Your lottery ticket won five dollars.', [
      ['兑了钱再买一张|Cash it and buy another', RC(.03, '那一张中了二等奖。你在彩票店里尖叫了整整一分钟。|That one won second prize. You screamed in the shop for a full minute.', { money: 60000, happy: 20 }, '没中。你觉得这五块钱花得很值，至少开心了两天。|Nothing. Still, five dollars for two days of hope seemed a fair price.', { happy: 2 })],
      ['兑了钱买一根烤肠|Cash it and buy a grilled sausage', { happy: 5 }, '那是你这辈子吃过最香的一根烤肠，因为它是“免费”的。|The best sausage of your life — because it was "free".']
    ], { w: 4 }),
    Y('cm2_subway', 'common', [18, 65], '地铁上睡着了|Asleep on the Metro', '🚇', '下班的地铁上，你靠着一个陌生人的肩膀睡着了。醒来的时候，已经坐到了终点站。|On the evening metro you fall asleep on a stranger\'s shoulder. You wake up at the end of the line.', [
      ['跟陌生人道谢|Thank the stranger', function (c) { var n = nm(c, { rel: 'contact', d0: -6, d1: 8, aff: 30 }); fx(c, { happy: 5 }); return '对方说：“没事，我也坐过站了——你睡得太香，我没好意思动。”你们一起坐了回程的车。他/她叫{n}。|"No problem — I missed my stop too. You looked so peaceful I didn\'t want to move." You rode back together. Their name was {n}.'; }],
      ['假装是故意坐到终点的|Pretend you meant to come to the end', { happy: 3 }, '你在终点站附近溜达了一圈，发现了一家超好吃的面馆。|You wandered round the terminus and found an amazing noodle shop.']
    ], { w: 4 })
  ]);

  /* ======================= New Year — fresh scenes ======================= */
  function ny(id, who, title, icon, t, opts, when) {
    return { id: id, noGate: 1, title: title, icon: icon, t: t, when: when, o: opts.map(function (o) { return { t: o[0], run: typeof o[1] === 'function' ? o[1] : function (c) { H.fx(c, o[1] || {}); return o[2]; } }; }) };
  }
  if (G.nyx) {
    G.nyx('red', [
      ny('nyx_red_0', 'red', '没有爷爷的第一个年|The First New Year Without Grandpa', '🕯️', '今年的团拜，客厅里那把藤椅空着。没有人坐，也没有人说要把它搬走。|At this year\'s gathering the wicker chair in the sitting room is empty. Nobody sits in it; nobody suggests moving it.', [
        ['给藤椅前也摆一副碗筷|Set a bowl and chopsticks before the chair', { eq: 4, karma: 2 }, '奶奶看见了，什么也没说，往那只碗里夹了一个饺子。|Grandma saw, said nothing, and put a dumpling in the bowl.'],
        ['讲一个爷爷的笑话|Tell one of Grandpa\'s jokes', { happy: 6 }, '你讲得一点也不好笑，可全家人都笑了，笑着笑着就哭了。|It wasn\'t funny at all, but everyone laughed — and then they cried.']
      ], function (s, p) { return !!p.flags.r2Farewell && p.age < 60; }),
      ny('nyx_red_1', 'red', '你成了团拜上最老的人|The Eldest at the Gathering', '🧓', '不知道从哪一年开始，团拜时坐在藤椅上的人，变成了你。|At some point — you couldn\'t say which year — the person in the wicker chair at the gathering became you.', [
        ['讲一讲你爷爷|Tell them about your grandfather', { eq: 4, kids: 4 }, '孩子们听得很认真。最小的那个问：“太爷爷也会玩手机吗？”|The children listened carefully. The youngest asked: "Did great-great-grandpa have a phone?"'],
        ['给每个孩子发一个红包|A red envelope for every child', { happy: 8, money: -2000 }, '红包里除了钱，还有一张小纸条：“不许炫耀。”|Inside each one, besides the money, a note: "No showing off."']
      ], function (s, p) { return p.age >= 60; }),
      ny('nyx_red_2', 'red', '大院的老邻居们|The Old Compound Neighbours', '🏘️', '大年初三，大院的老邻居们在一家饭馆聚会。当年的孩子们现在有的是部长，有的在开出租车。|Third day of New Year: the old compound neighbours meet at a restaurant. The children of those days are ministers now — and taxi drivers.', [
        ['和开出租的那个坐一桌|Sit with the taxi driver', { eq: 5, karma: 3 }, '他说他是你们之中唯一一个“没让家里人操心”的。你们干了一杯。|He said he was the only one of you who "never gave the family any worry". You drank to that.'],
        ['挨桌敬酒|Toast every table', { fame: 2, eq: 3 }, '你喝多了，在回家的出租车上睡着了。司机是那个老邻居。他没收你的钱。|You drank too much and fell asleep in the taxi home. The driver was the old neighbour. He wouldn\'t take your money.']
      ], function (s, p) { return p.age >= 30; })
    ]);
    G.nyx('common', [
      ny('nyx_common_0', 'common', '抢票|The Train-Ticket Scramble', '🎫', '春运抢票开始了。你定了七个闹钟，开了三个抢票软件。|The Spring Festival ticket rush begins. Seven alarms set, three ticket apps running.', [
        ['坚持抢到最后|Keep trying to the bitter end', RC(.6, '凌晨一点，你抢到了一张站票。你在被窝里握拳庆祝。|At 1 a.m. you landed a standing ticket. You punched the air under the duvet.', { happy: 8 }, '没抢到。你决定今年视频拜年。|Nothing. Video call this year, then.', { happy: -4 })],
        ['开车回家|Drive home instead', { happy: 4, stress: 4 }, '你在高速上堵了十四个小时，到家的时候年夜饭刚好上桌。|Fourteen hours in a motorway jam; you walked in just as dinner reached the table.']
      ], function (s, p) { return p.age >= 18 && p.age <= 55; }),
      ny('nyx_common_1', 'common', '亲戚的灵魂三问|The Relatives\' Three Questions', '❓', '年夜饭上，三姑六婆的灵魂三问来了：“工资多少？对象呢？什么时候要孩子？”|At New Year dinner the aunties fire the three questions: "How much do you earn? Partner? When are the kids coming?"', [
        ['反问：“三姑，您退休金多少？”|Counter: "Auntie, how much is your pension?"', { happy: 6, eq: -1 }, '全桌安静了。你妈在桌子底下踢了你一脚，可你看到她在偷笑。|The table went silent. Mum kicked you under the table — but you saw her smirk.'],
        ['“快了快了。”|"Soon, soon."', { eq: 2 }, '一句“快了快了”，你又说了一年。|"Soon, soon" — good for another year.']
      ], function (s, p) { return p.age >= 22 && p.age <= 40; }),
      ny('nyx_common_2', 'common', '给爸妈发红包|A Red Envelope for Your Parents', '🧧', '今年，你第一次给爸妈包红包。|This year, for the first time, you give your parents a red envelope.', [
        ['包一个大的|Make it a big one', { par: 10, money: -1500, happy: 6 }, '妈妈推了三次才收下。第二天你发现，她把红包原封不动塞回了你的行李箱。|Mum pushed it back three times before taking it. Next day you found it, unopened, in your suitcase.'],
        ['包一个小的，附一封信|A small one, with a letter', { par: 12, eq: 3 }, '爸爸看完信，躲进了厨房，说是要“看看火”。|Dad read the letter and retreated to the kitchen to "check the stove".']
      ], function (s, p) { return p.age >= 22 && G.anyPar(); })
    ]);
    G.nyx('elder', [
      ny('nyx_elder_0', 'elder', '视频拜年|New Year by Video Call', '📱', '孩子们在外地回不来，给你开了一个十几个人的视频会议。屏幕上全是脑袋。|The children can\'t make it home, so they set up a video call with a dozen people. The screen is all heads.', [
        ['一个一个点名|Call the register, one by one', { happy: 8, kids: 4 }, '点到最小的重孙的时候，他对着镜头喊了一声你的称呼。你截了一百张图。|When you got to the littlest great-grandchild, he shouted your name at the camera. You took a hundred screenshots.'],
        ['假装网卡，偷偷去厨房包饺子|Fake a bad connection; sneak off to make dumplings', { happy: 5 }, '回来的时候，屏幕上十几个人在齐声喊你。|When you came back, a dozen faces were shouting for you in chorus.']
      ], function (s, p) { return N.rel('child').some(function (k) { return k.alive; }); })
    ]);
    G.nyx('student', [
      ny('nyx_student_0', 'student', '成绩单和红包|Report Card Versus Red Envelopes', '📑', '成绩单寄到家的那天，正好是除夕。|The report card arrives on New Year\'s Eve itself.', [
        ['先给全家磕头拜年，再交成绩单|Pay your respects to everyone first, then hand it over', { eq: 3, happy: 4 }, '大家红包都给了，才看到成绩单。爸爸叹了一口气：“大过年的，算了。”|Everyone had already given you their envelopes when they saw the grades. Dad sighed: "It\'s New Year. Never mind."'],
        ['老实先交|Hand it over honestly first', { par: 3, perf: 2 }, '妈妈看完，往你碗里夹了一个大鸡腿：“比上学期强。”|Mum read it and put a big drumstick in your bowl: "Better than last term."']
      ], function () { return G.anyPar(); })
    ]);
    G.nyx('star', [
      ny('nyx_star_0', 'star', '春晚彩排|Gala Rehearsal', '🎭', '你接到了春晚的邀请。彩排了六次，你的节目被砍到了一分半钟。|You\'re invited to the New Year gala. Six rehearsals later, your act has been cut to ninety seconds.', [
        ['一分半钟也要唱好|Make every second count', { fame: 6, happy: 5 }, '那一分半钟，成了当晚收视率最高的一段。|Those ninety seconds were the night\'s highest-rated segment.'],
        ['退出，回家陪家人过年|Pull out; go home for New Year', { happy: 8, part: 5, fame: -1 }, '那是你成名以后第一次在家吃年夜饭。妈妈一直在给你夹菜。|Your first New Year dinner at home since getting famous. Mum kept heaping your bowl.']
      ])
    ]);
  }
})();
