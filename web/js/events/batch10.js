/* Batch 10: the game is renamed 我的一生模拟器 / My Life Simulator — and, as with every update, new stories. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function setN(c, n) { c.npc = n; c.prm.n = n.name; var pr = G.pr ? G.pr(n.g) : {}; for (var k in pr) c.prm[k] = pr[k]; }

  G.evs([
    E('c_diary_found', [9, 14], '日记本被翻了|Someone Read Your Diary', '📔', '你发现抽屉里的日记本被人动过，书签换了位置。|Someone has been in your drawer: the bookmark in your diary has moved.', [
      O('当面质问爸妈|Confront your parents', RC(.55, '妈妈红着脸道了歉，还给你买了一把带锁的日记本。|Mom apologized, red-faced, and bought you a diary with a lock.', { happy: 3, par: 2, eq: 2 }, '爸爸反问你：“你有什么事不能跟家里说？”你们吵了一晚上。|Dad shot back: "What can\'t you tell your own family?" You argued all night.', { happy: -4, par: -4 })),
      O('换个地方藏|Find a better hiding place', R('你把日记本藏进了床板下面的夹层里，从此只写给自己看。|You hid it in a gap under the bed slats, and from then on wrote only for yourself.', { smarts: 1, eq: 1 })),
      O('故意写一页给他们看|Write a page meant for them', R('你写下“谢谢你们一直在偷偷关心我”。第二天，桌上多了一杯热牛奶。|You wrote "Thank you for secretly caring about me." Next morning a glass of warm milk was on your desk.', { happy: 4, par: 5 }))
    ], { if: function () { return H.par().length > 0; } }),
    E('t_time_capsule', [12, 16], '时间胶囊|A Time Capsule', '⏳', '班主任让每个人给二十年后的自己写一封信，埋在操场的老槐树下。|Your homeroom teacher has everyone write a letter to themselves twenty years from now, to be buried under the old tree.', [
      O('认真写下梦想|Write down your dreams', function (c) { c.p.flags.capsule = c.p.age + 20; H.fx(c, { happy: 2, eq: 2 }); return '你写了满满三页，最后一句是：“希望你没有忘记我。”|You filled three pages. The last line: "I hope you haven\'t forgotten me."'; }),
      O('随便写两句|Scribble a couple of lines', R('“祝你有钱。”你写完就跑去打球了。|"Hope you\'re rich." Then you ran off to play ball.', { happy: 1 }))
    ]),
    E('a_capsule_open', [32, 36], '挖出时间胶囊|Digging Up the Capsule', '📬', '老同学在群里说，学校要拆了，当年埋的时间胶囊该挖出来了。|An old classmate posts that the school is being torn down: time to dig up the time capsule.', [
      O('回去打开那封信|Go back and open your letter', function (c) { var rich = G.netWorth() > G.$(500000); H.fx(c, rich ? { happy: 6, eq: 3 } : { happy: 3, eq: 5 }); return rich ? '信里的你说想成为了不起的人。你笑了笑：好像做到了一点点。|The kid in the letter wanted to be someone great. You smiled: maybe you managed a little.' : '信里的你说想成为了不起的人。你读了好几遍，把信折好放进了钱包。|The kid in the letter wanted to be someone great. You read it again and again, then folded it into your wallet.'; }),
      O('不去了，怕失望|Don\'t go — you\'re afraid to be disappointed', R('同学把信拍照发给了你。你一直没敢点开。|A classmate sent you a photo of the letter. You never dared open it.', { happy: -2 }))
    ], { if: function (S2, p) { return p.flags.capsule && p.age >= p.flags.capsule - 1; } }),
    E('a_old_photo', [40, 80], '旧相册|The Old Album', '📷', '搬家时，你翻出一本落满灰的旧相册，第一页是你满月时的照片。|While moving, you find a dusty old album. The first page is a photo of you at one month old.', [
      O('一页一页翻完|Go through every page', R('从满月到毕业，从婚礼到孩子出生……你在地板上坐了一下午。|From your first month to graduation, from the wedding to your children\'s births — you sat on the floor all afternoon.', { happy: 5, eq: 2 })),
      O('拍下来发到家庭群|Photograph it for the family chat', function (c) { var ks = N.rel('child').filter(function (k) { return k.alive; }); ks.forEach(function (k) { k.aff = Math.min(100, (k.aff || 50) + 4); }); H.fx(c, { happy: 4 }); return ks.length ? (c.p.g === 'f' ? '孩子们一张张回复：“妈年轻时好好看！”' : '孩子们一张张回复：“爸年轻时好帅！”') + '|One by one the children replied: "You looked amazing back then!"' : '老朋友们在下面回复了一长串回忆。|Old friends replied with a long string of memories.'; })
    ]),
    E('a_stranger_letter', [25, 70], '一封陌生来信|A Letter From a Stranger', '✉️', '你收到一封手写信。寄信人说，很多年前你帮过他一次，他一直记得。|A handwritten letter arrives. The sender says you helped him once, years ago, and he never forgot.', [
      O('回信|Write back', R('你们成了笔友。每年过年，你都会收到他寄来的家乡特产。|You became pen pals. Every New Year a box of his hometown specialties arrives.', { happy: 5, karma: 2 })),
      O('把信夹进日记本|Tuck it into your diary', R('你想不起来是哪件事了，但那天心情一直很好。|You can\'t remember what you did, but the whole day felt good.', { happy: 3 }))
    ], { if: function (S2, p) { return (p.st.karma || 0) >= 55; } }),
    E('o_life_review', [70, 110], '一生的回放|Your Life in Review', '🎞️', '孙辈帮你把一生的照片做成了一部短片，在你生日那天播放。|Your grandchildren made a short film from photos of your whole life and played it on your birthday.', [
      O('看着看着就哭了|Cry as you watch', R('片尾写着：“谢谢你，让我们来到这个世界。”|The closing card read: "Thank you for bringing us into this world."', { happy: 10 })),
      O('让他们把错事也剪进去|Ask them to include the mistakes too', R('“人这一辈子，哪有不走错的路。”大家都笑了。|"Nobody gets through life without a wrong turn." Everyone laughed.', { happy: 6, eq: 3 }))
    ], { if: function () { return N.rel('grandchild').some(function (g) { return g.alive && N.age(g) >= 10; }); } }),
    E('t_lost_wallet', [10, 17], '捡到钱包|A Lost Wallet', '👛', '放学路上，你在公交站捡到一个鼓鼓的钱包，里面有一张老人的身份证。|On the way home you find a fat wallet at the bus stop, with an elderly man\'s ID inside.', [
      O('交给警察叔叔|Hand it in to the police', R('第二天，那位爷爷带着一封感谢信来到了学校。全班都给你鼓掌。|The next day the old man came to school with a thank-you letter. The whole class applauded.', { karma: 6, happy: 5, fame: 1 })),
      O('按身份证上的地址送回去|Return it to the address on the ID', R('爷爷说钱包里是他下个月的药钱，硬是留你吃了一碗饺子。|He said it held next month\'s medicine money and insisted you stay for dumplings.', { karma: 7, happy: 6, eq: 2 }))
    ]),
    E('a_blood_drive', [18, 55], '无偿献血|A Blood Drive', '🩸', '献血车停在了街口，广播里说血库告急。|A blood-donation bus is parked at the corner; the radio says supplies are running low.', [
      O('撸起袖子|Roll up your sleeve', R('护士给了你一个小红本。几个月后，你收到一条短信：你的血已经用于救治病人。|The nurse handed you a little red booklet. Months later a text arrived: your blood had been used to save a patient.', { karma: 5, happy: 4, health: -1 })),
      O('怕针，下次吧|Scared of needles — next time', R('你在献血车旁站了一会儿，给排队的人买了几瓶水。|You lingered by the bus and bought water for the people in line.', { karma: 1 }))
    ], { if: function (S2, p) { return p.st.health >= 50; } }),
    E('a_rural_teach', [20, 40], '山区支教|Teaching in the Mountains', '🏫', '一个公益组织在招募支教老师，去山区小学教一个学期。|A charity is recruiting volunteers to teach for a term at a mountain village school.', [
      O('报名去|Sign up', R('孩子们第一次知道了地球是圆的。走的那天，他们追着车跑了很远。|For the first time the children learned the Earth is round. On your last day they chased the bus a long way.', { karma: 8, happy: 6, eq: 4, money: -2000 })),
      O('捐一箱书|Donate a box of books', R('几周后，你收到一张照片：孩子们捧着你的书笑得很灿烂。|Weeks later a photo arrived: the children beaming over your books.', { karma: 3, happy: 3, money: -300 }))
    ]),
    E('a_parents_checkup', [28, 60], '带爸妈去体检|Taking Your Parents for a Checkup', '🩺', '你发现爸妈最近总说“没事”，可脸色越来越差。|Your parents keep saying "we\'re fine", but they look worse each time you visit.', [
      O('请假带他们去全面体检|Take time off and get them a full checkup', function (c) { N.rel('father', 'mother').filter(function (n) { return n.alive; }).forEach(function (n) { N.addAff(n, 8); n.health = Math.min(100, (n.health || 60) + 10); }); H.fx(c, { happy: 4, money: -800 }); return '医生发现了一个早期的小问题，及时治好了。妈妈念叨了一路：“浪费钱。”嘴角却一直在笑。|The doctor caught a small problem early. Mom grumbled "waste of money" all the way home — smiling the whole time.'; }),
      O('打电话叮嘱几句|Call and remind them to look after themselves', R('“知道了知道了，你忙你的。”电话那头的声音有点哑。|"Yes, yes, you get back to work." The voice on the line sounded a little hoarse.', { happy: -1 }))
    ], { if: function () { return N.rel('father', 'mother').some(function (n) { return n.alive && N.age(n) >= 55; }); } })
  ]);
})();
