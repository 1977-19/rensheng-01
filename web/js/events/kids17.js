/* Version 1.7: every child is someone. Each personality a child can have brings its own story — the rebel’s
   night out, the nerd’s science fair, the schemer’s little con, the romantic’s first heartbreak. */
(function () {
  "use strict";
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function kidsOf(pers, a0, a1) { return N.rel("child").filter(function (k) { var a = N.age(k); return k.alive && k.pers === pers && a >= a0 && a <= a1; }); }
  function KP(id, pers, a0, a1, title, icon, t, o, w) {
    return E(id, [20, 100], title, icon, t, o, { w: w || 2.4, if: function (S, p) { return !p.jail && kidsOf(pers, a0, a1).length > 0; }, prep: function (c) { c.npc = G.pick(kidsOf(pers, a0, a1)); c.prm.n = c.npc.name; } });
  }

  G.evs([
    KP("kp_gentle", "gentle", 5, 16, "温柔的孩子|A Gentle Child", "🕊️", "{n}把午饭分给了班上一个总是饿肚子的同学，自己饿了一下午。|{n} gave their lunch to a classmate who’s always hungry, and went without all afternoon.", [
      O("夸{n}，明天多带一份|Praise {n} and pack two lunches tomorrow", R("从那以后，你每天都多做一份饭。那个同学后来成了{n}最好的朋友。|Ever since, you’ve packed an extra lunch. That classmate became {n}’s best friend.", { npc: 10, karma: 5 })),
      O("提醒{n}先照顾好自己|Remind {n} to look after themselves first", R("{n}点点头，但第二天还是把苹果分了出去。|{n} nodded — and shared the apple the next day anyway.", { npc: 3 }))
    ]),
    KP("kp_cheer", "cheer", 5, 16, "开心果|The Little Sunshine", "😄", "你工作上受了委屈，回家一句话也不想说。{n}突然在你面前表演了一段自编的滑稽舞。|You come home crushed from work and want to say nothing. {n} suddenly performs a ridiculous homemade dance.", [
      O("笑出了眼泪|Laugh till you cry", R("你一把抱住了{n}。那一刻，所有委屈都没了。|You swept {n} into a hug. Every hurt was gone.", { npc: 8, happy: 10, stress: -10 })),
      O("说“别闹了”|Say “stop it”", R("{n}的笑容僵住了，默默回了房间。你后悔了一整晚。|{n}’s smile froze; they went quietly to their room. You regretted it all night.", { npc: -8 }))
    ]),
    KP("kp_cold", "cold", 8, 17, "不说话的孩子|The Quiet One", "🧊", "{n}从来不说“我爱你”。可你生病那天，发现床头放着一杯温水和一盒药，旁边是一张字条：“按时吃。”|{n} never says “I love you”. But the day you’re ill, there’s warm water and medicine by your bed, and a note: “Take on time.”", [
      O("留着那张字条|Keep the note", R("你把它夹在了钱包里，一直带着。|You kept it in your wallet for years.", { npc: 8, happy: 8 })),
      O("对{n}说“谢谢”|Say thank you to {n}", R("{n}耳朵红了，嘴上说：“又不是给你的……药是给你的。”|{n}’s ears went red: “It wasn’t for you… well, the medicine was.”", { npc: 10, happy: 6 }))
    ]),
    KP("kp_sharp", "sharp", 8, 17, "毒舌少年|A Sharp Tongue", "🗯️", "家长会上，老师说{n}把一位同学怼哭了，因为那个同学嘲笑另一个孩子的口音。|At parents’ evening the teacher says {n} reduced a classmate to tears — for mocking another child’s accent.", [
      O("回家后问{n}发生了什么|Ask {n} what happened", R("{n}说：“我只是说了实话。”你说：“说实话的方式也很重要。”{n}想了很久，第二天去道了歉——只对那个嘲笑别人的同学说了一半。|“I only told the truth,” said {n}. “How you tell it matters too,” you said. Next day {n} apologised — half an apology.", { npc: 4, eq: 2 })),
      O("站在{n}这边|Take {n}’s side", R("{n}看你的眼神里有了一点崇拜。|{n} looked at you with a touch of hero worship.", { npc: 10 }))
    ]),
    KP("kp_tsun", "tsun", 8, 17, "嘴硬的孩子|Says One Thing, Means Another", "😤", "{n}说母亲节/父亲节“很无聊”，一点也不想过。那天晚上，你在枕头下面发现了一张皱巴巴的手工贺卡。|{n} says Mother’s/Father’s Day is “stupid”. That night, you find a crumpled handmade card under your pillow.", [
      O("第二天假装没发现|Pretend you never found it", R("{n}偷偷观察了你一整天，最后忍不住问：“你……有没有在枕头下面发现什么？”|{n} watched you all day and finally blurted: “Did you… find anything under your pillow?”", { npc: 12, happy: 10 })),
      O("当着{n}的面把贺卡贴在冰箱上|Pin it on the fridge in front of {n}", R("“快拿下来！”{n}的脸红透了，但再也没有人去碰那张贺卡。|“Take it down!” {n} turned crimson — but nobody ever touched that card again.", { npc: 10, happy: 10 }))
    ]),
    KP("kp_scheme", "scheme", 7, 17, "小小谋略家|A Little Schemer", "♟️", "你发现{n}用一套复杂的“积分系统”，让三个同学帮ta写作业，ta负责帮他们追女孩/男孩。|You discover {n} runs an elaborate points system: three classmates do {n}’s homework, and {n} helps them with their crushes.", [
      O("忍住笑，认真批评|Hold back a laugh and scold seriously", R("{n}乖乖认了错，然后问你：“那我能把这套系统用在班委选举上吗？”|{n} apologised meekly — then asked: “Can I use the system for the class election?”", { npc: 4, eq: 2 })),
      O("问{n}能不能教你|Ask {n} to teach you", R("{n}兴奋地给你画了一张流程图。你决定以后让{n}学管理。|{n} excitedly drew you a flowchart. You decided {n} should study management.", { npc: 10, happy: 6 }))
    ]),
    KP("kp_honest", "honest", 6, 17, "太诚实的孩子|Too Honest", "🙊", "亲戚来家里做客，{n}当着所有人的面说：“妈妈/爸爸说你送的礼物很难看。”|At a family gathering {n} announces to everyone: “Mum/Dad says your present was ugly.”", [
      O("尴尬地打圆场|Smooth it over, mortified", R("亲戚哈哈大笑：“这孩子真实在！”回家后你和{n}聊了聊“善意的谎言”。|The relative roared: “What an honest child!” At home you talked with {n} about white lies.", { npc: 3, eq: 2 })),
      O("承认，并真诚道歉|Admit it and apologise sincerely", R("亲戚愣了一下，也笑了：“其实我也觉得难看。”|The relative blinked, then laughed: “Honestly, I thought so too.”", { npc: 6, karma: 2 }))
    ]),
    KP("kp_artsy", "artsy", 6, 17, "小艺术家|A Little Artist", "🎨", "{n}把你最贵的那件白衬衫画满了颜料，说这是送你的“艺术品”。|{n} has painted all over your most expensive white shirt — “a work of art, for you”.", [
      O("穿着它去上班|Wear it to work", R("同事们都问在哪里买的。{n}听说后，开心了一个星期。|Colleagues all asked where you bought it. {n} was overjoyed for a week.", { npc: 12, happy: 8 })),
      O("给{n}买一块真正的画布|Buy {n} a real canvas", R("{n}的第一幅油画，后来挂在了学校的走廊里。|{n}’s first oil painting later hung in the school corridor.", { npc: 8 }))
    ]),
    KP("kp_prag", "prag", 8, 17, "小会计|The Little Accountant", "🧮", "{n}拿着一个本子来找你：“这是我从五岁到现在的零花钱账本。按通胀算，你欠我两百块。”|{n} brings a notebook: “My pocket-money ledger since I was five. Adjusted for inflation, you owe me two hundred.”", [
      O("认真核对，补给{n}|Check it properly and pay up", R("账算得一分不差。你决定给{n}开一个银行账户。|The sums were perfect. You opened {n} a bank account.", { npc: 8, money: -30 })),
      O("和{n}谈判|Negotiate", R("你们谈了一个小时，最后达成了“分期付款”协议。{n}很满意。|An hour of bargaining ended in an instalment plan. {n} was satisfied.", { npc: 6, eq: 2 }))
    ]),
    KP("kp_boss", "boss", 6, 17, "孩子王|The Ringleader", "👑", "{n}在小区里组织了一支“少年巡逻队”，每天放学检查有没有人乱扔垃圾。|{n} has formed a “youth patrol” on the estate, checking for litter every day after school.", [
      O("给巡逻队买统一的帽子|Buy the patrol matching caps", R("小区里的老人们都夸这些孩子。{n}的领导力让你惊讶。|The old folk praised the kids. {n}’s leadership amazed you.", { npc: 10, happy: 5 })),
      O("提醒{n}别太霸道|Remind {n} not to be bossy", R("{n}想了想，把“队长”改成了“轮值队长”。|{n} thought it over and made the captaincy a rota.", { npc: 4, eq: 2 }))
    ]),
    KP("kp_gold", "gold", 8, 17, "名牌控|Brand-Obsessed", "👟", "{n}哭着说，如果不买那双限量球鞋，在学校就会被看不起。|{n} sobs that without those limited-edition trainers, they’ll be looked down on at school.", [
      O("买|Buy them", R("{n}高兴了三天。第四天，又想要一块手表。|{n} was happy for three days. On the fourth, they wanted a watch.", { npc: 6, money: -300 })),
      O("和{n}一起打工赚钱买|Earn the money together", R("{n}在洗车店干了一个暑假。拿到鞋的那天，{n}说：“原来钱这么难赚。”|{n} worked a summer at a car wash. On the day the trainers came, {n} said: “Money is so hard to earn.”", { npc: 8, eq: 2 }))
    ]),
    KP("kp_rebel", "rebel", 12, 17, "离家出走|Running Away", "🎒", "{n}留下一张字条：“我要去追梦。别找我。”书包和存钱罐都不见了。|{n} leaves a note: “I’m chasing my dream. Don’t look for me.” Their backpack and savings are gone.", [
      O("立刻去火车站找|Rush to the station", RC(.7, "你在候车室找到了{n}，ta正一个人对着车票发呆。你什么也没骂，只是抱住了ta。|You found {n} in the waiting room, staring at a ticket. You didn’t shout — you just held them.", { npc: 12, stress: 8 }, "{n}两天后自己回来了，什么也不说。|{n} came back on their own two days later and said nothing.", { npc: -4, stress: 15 })),
      O("报警|Call the police", R("警察在高速服务区找到了{n}。回家的路上，{n}一直看着窗外。|Police found {n} at a motorway service station. On the drive home, {n} stared out of the window.", { npc: -6, stress: 10 }))
    ], 1.6),
    KP("kp_chill", "chill", 8, 17, "佛系少年|Totally Chill", "🍃", "期末考试前一天，{n}还在悠闲地钓鱼。“考得好不好，都是命。”|The day before finals, {n} is calmly fishing. “Whatever happens, happens.”", [
      O("陪{n}一起钓|Fish with {n}", R("{n}考了中等，但那天你们钓到了一条大鱼。{n}说那是这学期最开心的一天。|{n} scored average — but you caught a big fish together. {n} said it was the best day of term.", { npc: 10, happy: 6 })),
      O("把{n}拎回去复习|Drag {n} back to revise", R("{n}叹了口气：“好吧。”成绩提高了一点。|{n} sighed: “Fine.” Grades rose a little.", { npc: -2, perf: 0 }))
    ]),
    KP("kp_clingy", "clingy", 4, 12, "黏人的孩子|Never Lets Go", "🧸", "你要出差一周。{n}抱着你的腿哭：“你不要走！”|You’re away on business for a week. {n} clings to your leg: “Don’t go!”", [
      O("每晚视频讲故事|Video-call a bedtime story every night", R("一周后你回来，{n}已经能自己睡觉了，还骄傲地告诉你：“我很勇敢！”|When you came back {n} could sleep alone and proudly told you: “I was brave!”", { npc: 10 })),
      O("把出差推掉|Cancel the trip", R("老板不太高兴，但{n}的笑容让你觉得值得。|Your boss wasn’t pleased, but {n}’s smile made it worth it.", { npc: 12, perf: -4 }))
    ]),
    KP("kp_nerd", "nerd", 8, 17, "科学展|The Science Fair", "🔬", "{n}要参加全市科学展，实验需要在家里的厨房做一个“小火山”。|{n} is entering the city science fair — the experiment is a “volcano” in your kitchen.", [
      O("一起做，厨房爆了也没关系|Do it together — never mind the kitchen", RC(.6, "{n}拿了一等奖。厨房的天花板上至今还有一块红色的印子。|{n} won first prize. There’s still a red stain on the kitchen ceiling.", { npc: 12, happy: 8 }, "火山喷得太猛，你们一起擦了三个小时的墙，笑了三个小时。|The eruption was huge; you scrubbed walls for three hours and laughed for all three.", { npc: 10, happy: 6 })),
      O("让{n}去学校实验室做|Send {n} to the school lab", R("{n}得了二等奖。|{n} won second prize.", { npc: 3 }))
    ]),
    KP("kp_romantic", "romantic", 12, 17, "第一次心碎|First Heartbreak", "💔", "{n}失恋了，关在房间里放了一整晚的情歌。|{n}’s first love ended. They spent all night locked in their room playing love songs.", [
      O("敲门，带一碗面进去|Knock, and bring in a bowl of noodles", R("{n}一边吃面一边哭，然后问你：“你第一次失恋是什么时候？”你们聊到了半夜。|{n} cried into the noodles, then asked: “When was your first heartbreak?” You talked till midnight.", { npc: 12, eq: 3 })),
      O("给{n}一点空间|Give {n} space", R("第二天早上，{n}红着眼睛说：“谢谢你没问。”|The next morning, red-eyed, {n} said: “Thanks for not asking.”", { npc: 6 }))
    ]),
    KP("kp_playboy", "playboy", 14, 17, "情书太多|Too Many Love Letters", "💌", "你在{n}的书包里发现了十几封不同同学写的情书。|In {n}’s schoolbag you find love letters from a dozen different classmates.", [
      O("和{n}聊聊“尊重别人的心意”|Talk to {n} about respecting people’s feelings", R("{n}认真地给每个人写了回信。|{n} wrote a careful reply to every single one.", { npc: 6, eq: 2 })),
      O("暗暗觉得骄傲|Feel secretly proud", R("你想起了年轻时的自己。|You remembered yourself at that age.", { happy: 4 }))
    ])
  ]);
})();
