/* New stories for version 1.3: small moments across a whole life. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function setN(c, n) { c.npc = n; c.prm.n = n.name; var pr = G.pr ? G.pr(n.g) : {}; for (var k in pr) c.prm[k] = pr[k]; }
  function parAlive() { return N.rel('father', 'mother').length > 0; }

  G.evs([
    /* ---------- childhood ---------- */
    E('c_first_snow', [3, 8], '第一场雪|The First Snow', '❄️', '早上拉开窗帘，外面全白了。|You open the curtains and the whole world is white.', [
      O('冲出去堆雪人|Run out and build a snowman', R('雪人戴着爸爸的帽子，鼻子是一根胡萝卜。|The snowman wore Dad\'s hat and a carrot nose.', { happy: 7, health: 1 })),
      O('趴在窗台上看|Watch from the windowsill', R('你在玻璃上哈了一口气，画了一颗星星。|You breathed on the glass and drew a star.', { happy: 3, eq: 1 }))
    ]),
    E('c_lost_tooth', [5, 8], '掉牙了|A Wobbly Tooth', '🦷', '你的门牙晃了好几天，今天吃苹果时掉了下来。|Your front tooth had wobbled for days; today it came out in an apple.', [
      O('把牙扔上屋顶|Throw it onto the roof', R('奶奶说这样新牙会长得又快又齐。|Grandma said that way the new one grows in straight and fast.', { happy: 3 })),
      O('放在枕头底下|Put it under your pillow', R('第二天早上，枕头下多了一枚硬币。|In the morning there was a coin under your pillow.', { happy: 4, money: 1 }))
    ]),
    E('c_pet_fish', [5, 11], '小金鱼|The Goldfish', '🐟', '庙会上你捞到了一条小金鱼，捧着塑料袋一路跑回家。|At the fair you won a goldfish and ran all the way home holding the bag.', [
      O('每天认真喂它|Feed it carefully every day', R('它活了整整三年，你给它起名叫“胖胖”。|It lived three whole years. You named it Chubby.', { happy: 5, eq: 2 })),
      O('一次喂好多|Give it lots of food at once', R('第二天它翻了肚皮。你哭着把它埋在了花盆里。|The next day it floated belly-up. You cried and buried it in a flowerpot.', { happy: -4, eq: 3 }))
    ]),
    E('c_school_play', [6, 11], '班级话剧|The Class Play', '🎭', '老师选你在话剧里演一棵树。|The teacher casts you as a tree in the class play.', [
      O('演一棵最好的树|Be the best tree ever', R('你一动不动站了二十分钟，谢幕时掌声最响。|You stood perfectly still for twenty minutes and got the loudest applause.', { happy: 5, eq: 2 })),
      O('偷偷给树加台词|Secretly give the tree some lines', R('全场笑翻了。老师哭笑不得，明年让你演主角。|The whole hall roared. The teacher didn\'t know whether to laugh — and gave you the lead next year.', { happy: 6, fame: 1 }))
    ]),
    E('c_grandpa_bike', [6, 12], '学骑自行车|Learning to Ride', '🚲', '爷爷扶着车后座，说：“别怕，我抓着呢。”|Grandpa holds the back of the seat: "Don\'t worry, I\'ve got you."', [
      O('使劲往前蹬|Pedal as hard as you can', R('骑出老远你才发现，爷爷早就松手了，正在后面笑。|Far down the road you realised Grandpa had let go long ago and was laughing behind you.', { happy: 6, health: 2 })),
      O('一直回头看|Keep looking back', R('摔了好几跤，膝盖贴满了创可贴，但你学会了。|You fell a few times and your knees were covered in plasters — but you learned.', { happy: 3, health: 1 }))
    ], { if: function () { return N.rel('grand').length > 0; } }),
    /* ---------- teenage years ---------- */
    E('t_exam_night', [13, 18], '考试前一晚|The Night Before the Exam', '📖', '明天就要期末考了，你还有半本书没看。|The final is tomorrow and you\'re only halfway through the book.', [
      O('熬夜看完|Stay up and finish it', RC(.55, '第二天你考得出奇地好。|The next day you did surprisingly well.', { smarts: 3, health: -2 }, '考到一半你睡着了。|You fell asleep halfway through the exam.', { health: -2, happy: -3 })),
      O('早点睡，相信自己|Sleep early and trust yourself', R('精神很好，会的题都做对了。|You were sharp and got every question you knew.', { health: 2, smarts: 1 }))
    ]),
    E('t_volunteer', [14, 18], '社区志愿者|Volunteering', '🙋', '学校要求每人做二十小时志愿服务。|The school requires twenty hours of volunteering.', [
      O('去养老院陪老人|Keep elderly people company', R('一位奶奶每次都把藏好的糖塞给你。|One old lady always slipped you sweets she\'d saved.', { karma: 5, eq: 3 })),
      O('去流浪动物救助站|Help at an animal shelter', R('你给一只三条腿的小狗找到了新家。|You found a home for a three-legged puppy.', { karma: 5, happy: 4 }))
    ]),
    E('t_band', [14, 18], '组乐队|Starting a Band', '🎸', '几个同学想组乐队，就差一个人。|A few classmates want to start a band and need one more member.', [
      O('当主唱|Be the singer', RC(.5, '你们在毕业晚会上唱了自己写的歌，全场都在跟着打拍子。|At the graduation party you played your own song and the whole hall clapped along.', { happy: 7, fame: 2 }, '第一次排练你就破音了。大家笑成一团。|Your voice cracked at the first rehearsal. Everyone fell about laughing.', { happy: 2 })),
      O('当鼓手|Play the drums', R('邻居投诉了三次，但你的节奏越来越稳。|The neighbours complained three times, but your rhythm got steadier and steadier.', { happy: 5 })),
      O('不参加，好好学习|Pass — focus on school', R('你在台下给他们鼓掌。|You cheered for them from the audience.', { smarts: 2 }))
    ]),
    E('t_letter_parents', [15, 18], '写给爸妈的信|A Letter to Your Parents', '💌', '语文课的作业是给爸妈写一封信。|The writing assignment: a letter to your parents.', [
      O('认真写，写了三页|Write it properly — three pages', R('妈妈读完偷偷抹眼泪，把信收进了抽屉最里面。|Mom read it, wiped her eyes, and tucked it in the very back of a drawer.', { par: 8, eq: 3 })),
      O('随便写几句交差|Dash off a few lines', R('爸爸看了一眼：“字写得不错。”|Dad glanced at it: "Nice handwriting."', { par: 1 }))
    ], { if: parAlive }),
    E('t_mentor', [15, 19], '改变你的老师|A Teacher Who Changed Things', '👩‍🏫', '一位老师留你下课，说：“你很有天赋，只是自己还不知道。”|A teacher keeps you after class: "You have a gift. You just don\'t know it yet."', [
      O('问她该怎么做|Ask what you should do', R('她每周给你开一份书单。那一年，你像变了个人。|She gave you a reading list every week. That year you became someone new.', { smarts: 6, eq: 2 })),
      O('不好意思地笑笑|Smile awkwardly', R('很多年后你才明白，那句话有多重要。|Only years later did you understand how much that sentence mattered.', { eq: 2 }))
    ]),
    /* ---------- young adulthood ---------- */
    E('a_first_salary', [18, 28], '第一份工资|Your First Paycheck', '💵', '第一笔工资到账了。|Your first salary has arrived.', [
      O('给爸妈买礼物|Buy your parents a gift', R('爸爸嘴上说乱花钱，第二天就戴着新手表出门了。|Dad grumbled about wasting money — and wore the new watch out the next day.', { par: 6, happy: 4, money: -300 })),
      O('全部存起来|Save every penny', R('你看着存款数字，第一次觉得自己是个大人了。|Looking at the balance, you felt like an adult for the first time.', { eq: 2, money: 0 })),
      O('请朋友吃顿好的|Treat your friends to a feast', R('那顿饭吃了很久，大家都说要一辈子做朋友。|The dinner went on for hours; everyone swore to be friends for life.', { happy: 6, money: -200 }))
    ], { if: function (S, p) { return !!p.job; } }),
    E('a_roommate', [18, 30], '奇葩室友|The Roommate', '🛏️', '新室友每天凌晨三点准时开始弹吉他。|Your new roommate starts playing guitar at exactly 3 a.m. every night.', [
      O('好好谈一次|Have a proper talk', R('原来他失眠。你们约好了，他白天弹，你给他介绍了个助眠音乐。|Turns out he can\'t sleep. You agreed he\'d play by day, and you sent him some sleep music.', { eq: 4, happy: 2 })),
      O('跟着一起唱|Sing along', R('后来你们成了最好的朋友，还在小酒馆驻唱过一个夏天。|You became best friends and played a little bar together one whole summer.', { happy: 6 }))
    ]),
    E('a_mentor_job', [22, 35], '职场贵人|A Mentor at Work', '🤝', '一位老前辈看你顺眼，愿意把多年的经验教给你。|A veteran at work takes a liking to you and offers to pass on years of experience.', [
      O('虚心请教|Learn humbly', function (c) { if (c.p.job) c.p.job.perf = G.clamp(c.p.job.perf + 12, 0, 100); H.fx(c, { smarts: 3, eq: 3 }); return '一年后，你做事的样子越来越像他。|A year later, you worked more and more like them.'; }),
      O('客气地保持距离|Keep a polite distance', R('你还是习惯自己摸索。|You still prefer to figure things out yourself.', { eq: 1 }))
    ], { if: function (S, p) { return !!p.job; } }),
    E('a_wedding_guest', [22, 40], '朋友的婚礼|A Friend\'s Wedding', '💒', '大学室友结婚，请你当伴郎/伴娘。|Your old roommate is getting married and asks you to stand beside them.', [
      O('精心准备致辞|Prepare a heartfelt speech', R('你讲到你们一起熬夜的那些年，新人哭了，你也哭了。|You talked about all those late nights together. The couple cried, and so did you.', { happy: 6, eq: 3 })),
      O('包个大红包|Give a generous gift', R('朋友偷偷发消息：“够意思！”|Your friend texted: "You\'re the best!"', { happy: 3, money: -500 }))
    ]),
    E('a_marathon', [20, 50], '第一次马拉松|Your First Marathon', '🏃', '你报名了城市马拉松，训练了整整三个月。|You signed up for the city marathon and trained for three months.', [
      O('跑完全程|Run the whole distance', RC(.65, '最后一公里你几乎是挪过去的，但你冲过了终点线。|You barely shuffled through the last kilometre — but you crossed the line.', { health: 6, happy: 8 }, '三十公里时抽筋了，你被扶上了收容车。|Cramp at thirty kilometres. You were helped onto the sweeper bus.', { health: 2, happy: -2 })),
      O('跑半程就好|Just do the half', R('你在终点拿到了一块小小的奖牌。|At the finish you got a small medal.', { health: 4, happy: 4 }))
    ], { if: function (S, p) { return p.st.health >= 45; } }),
    E('a_bad_landlord', [20, 40], '房东要涨租|The Rent Goes Up', '🏠', '房东通知你：下个月起房租涨三成。|The landlord says your rent goes up 30% next month.', [
      O('据理力争|Negotiate firmly', RC(.5, '你列出了周边房价，房东让了一步，只涨一成。|You laid out nearby prices; the landlord settled for 10%.', { money: 500, eq: 2 }, '房东一点不让。|The landlord wouldn\'t budge.', { happy: -3, money: -800 })),
      O('搬家|Move out', R('新家小了一点，但阳光很好。|The new place is smaller, but full of sunlight.', { happy: 1, money: -600 }))
    ], { if: function (S, p) { return p.home === 'rent'; } }),
    /* ---------- the middle years ---------- */
    E('m_class_reunion_kid', [35, 55], '家长会|Parents\' Evening', '🏫', '你去参加孩子的家长会，班主任竟然是你的高中同学。|At your child\'s parents\' evening, the homeroom teacher turns out to be your old classmate.', [
      O('叙旧|Catch up', R('你们聊到天黑，还约了下次一起吃饭。|You talked until dark and agreed to have dinner soon.', { happy: 5 })),
      O('认真听孩子的情况|Focus on how your child is doing', function (c) { var k = N.rel('child').filter(function (x) { return N.age(x) >= 7 && N.age(x) <= 17; })[0]; if (k) { N.addAff(k, 5); k.nur = (k.nur || 0) + 3; } H.fx(c, { eq: 2 }); return '你记下了老师的每一条建议。|You noted every piece of advice.'; })
    ], { if: function () { return N.rel('child').some(function (x) { return N.age(x) >= 7 && N.age(x) <= 17; }); } }),
    E('m_health_check', [40, 65], '体检报告|Your Checkup Results', '📋', '体检报告上多了几个向上的箭头。|A few up-arrows have appeared on your checkup report.', [
      O('从今天开始锻炼|Start exercising today', R('半年后复查，箭头都不见了。|At the follow-up six months later, the arrows were gone.', { health: 6 })),
      O('“没事，大家都这样”|"It\'s fine, everyone has those"', R('你把报告塞进了抽屉。|You stuffed the report in a drawer.', { health: -3 }))
    ]),
    E('m_old_friend_call', [35, 70], '多年未见的电话|A Call After Many Years', '📞', '一个陌生号码打来，是二十年没联系的老同学。|An unknown number calls — an old classmate you haven\'t heard from in twenty years.', [
      O('聊了两个小时|Talk for two hours', R('挂电话前你们约好：明年一定见一面。|Before hanging up, you promised to meet next year, for sure.', { happy: 6 })),
      O('客气几句挂了|Exchange pleasantries and hang up', R('后来你一直想，当时该多聊一会儿的。|Afterwards you kept thinking you should have talked longer.', { happy: -1 }))
    ]),
    E('m_learn_new', [35, 70], '学一门新手艺|Learning Something New', '🎨', '你突然很想学点从来没碰过的东西。|You suddenly want to learn something you\'ve never tried.', [
      O('学钢琴|Piano', R('一年后，你能完整弹一首曲子了。|A year later you could play a whole piece.', { happy: 5, smarts: 2 })),
      O('学画画|Painting', R('你的第一幅画挂在了客厅，家里人都说好看。|Your first painting hangs in the living room; the family says it\'s lovely.', { happy: 5, eq: 2 })),
      O('学一门外语|A foreign language', R('你能看懂一部不带字幕的电影了。|You can watch a film without subtitles now.', { smarts: 4 }))
    ]),
    /* ---------- later life ---------- */
    E('o_retire_party', [58, 70], '退休欢送会|The Retirement Party', '🎉', '同事们给你办了一场欢送会。|Your colleagues throw you a farewell party.', [
      O('发表感言|Make a speech', R('你说到第一天上班时的样子，大家都笑了。|You described your very first day, and everyone laughed.', { happy: 6, eq: 2 })),
      O('默默吃蛋糕|Quietly eat cake', R('最年轻的同事悄悄说：“谢谢您当年帮我。”|The youngest colleague whispered: "Thank you for helping me back then."', { happy: 4 }))
    ], { if: function (S, p) { return !!p.retired; } }),
    E('o_grandkid_story', [60, 100], '讲故事|Story Time', '📚', '孙辈缠着你：“讲讲你小时候的事吧！”|Your grandchildren beg: "Tell us about when you were little!"', [
      O('讲最调皮的那次|Tell about your naughtiest moment', R('孩子们笑得在地上打滚。|The children rolled on the floor laughing.', { happy: 8 })),
      O('讲最难的那段日子|Tell about the hardest time', R('最大的那个孩子听完，安静地抱了抱你。|When you finished, the eldest hugged you quietly.', { happy: 4, eq: 3 }))
    ], { if: function () { return N.rel('grandchild').some(function (g) { return N.age(g) >= 4; }); } }),
    E('o_garden', [60, 100], '小菜园|A Little Garden', '🥬', '你在阳台上开了一块小菜园。|You start a little vegetable garden on the balcony.', [
      O('每天浇水|Water it every day', R('第一批小番茄熟了，你一个个数着分给了邻居。|The first cherry tomatoes ripened; you counted them out to the neighbours.', { happy: 6, health: 2 })),
      O('种花更好看|Flowers are prettier', R('整栋楼都知道，那个开满花的阳台是你家。|The whole building knows the balcony full of flowers is yours.', { happy: 5 }))
    ]),
    E('o_dance_class', [60, 95], '老年大学|The Senior College', '🎓', '社区的老年大学开班了：书法、摄影、合唱……|The community senior college is enrolling: calligraphy, photography, choir…', [
      O('报书法班|Calligraphy', R('你写的“福”字被贴在了社区门口。|Your "good fortune" character was posted at the community gate.', { happy: 5, eq: 2 })),
      O('报合唱团|Choir', R('你们在市里的比赛拿了二等奖。|Your choir took second prize in the city contest.', { happy: 6, health: 1 })),
      O('报摄影班|Photography', R('你拍的晚霞登上了报纸。|Your sunset photo was printed in the newspaper.', { happy: 5, fame: 1 }))
    ]),
    E('o_last_letter', [75, 110], '写给未来的信|A Letter to the Future', '✉️', '你想给还没出生的后代留一封信。|You want to leave a letter for descendants not yet born.', [
      O('写下一生的道理|Write down what life taught you', function (c) { c.p.flags.letterFuture = 1; H.fx(c, { happy: 5, eq: 3 }); return '你写了很久，最后一句是：“对身边的人好一点。”|You wrote a long time. The last line: "Be kind to the people beside you."'; }),
      O('只写一句“要快乐”|Just write "Be happy"', R('简单，但你觉得这就够了。|Simple — but you felt it was enough.', { happy: 3 }))
    ])
  ]);
})();
