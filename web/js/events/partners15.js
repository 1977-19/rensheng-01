/* Version 1.6 stories: your partner is a person, not a slot. Each of the seventeen personalities brings
   moments only they would create — the tsundere’s secret gift, the schemer’s plan, the playboy’s phone. */
(function () {
  "use strict";
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function partnerOf(pers) { var pt = N.partner(); return pt && pt.alive && pt.pers === pers && (pt.rel === "spouse" || pt.rel === "lover") ? pt : null; }
  function PE(id, pers, title, icon, t, o, w) {
    return E(id, [16, 100], title, icon, t, o, { w: w || 2.2, if: function (S, p) { return !p.jail && !!partnerOf(pers); }, prep: function (c) { var n = partnerOf(pers); if (!n) return false; c.npc = n; c.prm.n = n.name; } });
  }

  G.evs([
    PE("pt_gentle_fever", "gentle", "发烧的夜里|A Night with a Fever", "🌡️", "你发高烧了。{n}整夜没睡，每隔一个小时给你换一次毛巾。|You run a high fever. {n} stays up all night, changing the cold cloth every hour.", [
      O("醒来时握住ta的手|Take their hand when you wake", R("ta趴在床边睡着了，手还搭在你的额头上。|They’d fallen asleep by the bed, hand still on your forehead.", { love: 10, happy: 8, health: 3 })),
      O("等病好了，给ta做一顿饭|Cook them a meal once you’re well", R("ta吃着吃着笑了：“你做的比我好吃。”其实很难吃。|Eating, they laughed: “Yours is better than mine.” It really wasn’t.", { love: 8, happy: 5 }))
    ]),
    PE("pt_gentle_fight", "gentle", "一次争吵|An Argument", "🍵", "你们第一次吵架。你说了很重的话，{n}没有回嘴，只是给你泡了一杯茶。|Your first real fight. You say something harsh; {n} doesn’t argue back — just makes you tea.", [
      O("道歉|Apologise", R("ta说：“我知道你只是累了。”|They said: “I know you’re just tired.”", { love: 10, eq: 3 })),
      O("继续生闷气|Keep sulking", R("那杯茶放凉了。ta的眼睛红了一晚上。|The tea went cold. Their eyes were red all night.", { love: -8 }))
    ]),
    PE("pt_cheer_surprise", "cheer", "惊喜派对|A Surprise Party", "🎉", "你加班到深夜回家，一开门——{n}把你所有的朋友都请来了，屋里挂满了气球。|Home late from work, you open the door — {n} has invited all your friends and filled the place with balloons.", [
      O("又哭又笑|Laugh and cry at once", R("那天不是你的生日。ta说：“我就是想让你开心一下。”|It wasn’t even your birthday. “I just wanted to cheer you up,” they said.", { love: 8, happy: 15 })),
      O("说你太累了|Say you’re exhausted", R("ta愣了一下，让大家早点散了，然后给你放好了洗澡水。|They paused, sent everyone home early, and ran you a bath.", { love: -2, health: 2 }))
    ]),
    PE("pt_cold_note", "cold", "冰箱上的便条|A Note on the Fridge", "🧊", "{n}很少说情话。今天你在冰箱上发现一张便条：“牛奶过期了。我买了新的。别熬夜。”|{n} rarely says sweet things. Today a note on the fridge: “Milk expired. Bought new. Don’t stay up late.”", [
      O("把便条收进抽屉|Keep the note in a drawer", R("后来你收集了整整一抽屉这样的便条。|Over the years you filled a whole drawer with notes like it.", { love: 8, happy: 6 })),
      O("在下面回一句“爱你”|Write “love you” underneath", R("第二天便条被撕掉了。你在ta的钱包里找到了它。|The next day it was gone. You found it in their wallet.", { love: 12, happy: 8 }))
    ]),
    PE("pt_sharp_cooking", "sharp", "毒舌的评价|A Sharp Review", "🔪", "你第一次做饭给{n}吃。ta尝了一口：“这是盐还是糖？你是想谋杀我吗？”|You cook for {n} for the first time. One bite: “Is this salt or sugar? Are you trying to kill me?”", [
      O("反击：“那你来做！”|Fire back: “Then you cook!”", R("ta真的去做了，做得特别好吃。从此家里的厨房归ta了。|They did — and it was delicious. The kitchen became theirs.", { love: 6, happy: 5 })),
      O("委屈地收拾碗筷|Clear the plates, hurt", R("半夜你发现ta一个人在厨房，把你做的菜全吃完了。|At midnight you found them in the kitchen, finishing every bite you’d made.", { love: 10, happy: 6 }))
    ]),
    PE("pt_tsun_gift", "tsun", "“才不是给你买的”|“It’s Not For You”", "🎁", "{n}把一个盒子扔给你：“商场打折顺手买的，不要就扔了。”盒子里是你上个月随口提过一次的东西。|{n} tosses you a box: “It was on sale, whatever. Throw it out if you don’t want it.” Inside is the thing you mentioned once, last month.", [
      O("“你记得我说过？”|“You remembered?”", R("ta的脸一下子红到了耳朵：“谁、谁记得啊！”|They went red to the ears: “W-who remembers that!”", { love: 12, happy: 10 })),
      O("什么都不说，抱住ta|Say nothing; hug them", R("ta僵了一秒，然后小声说：“……笨蛋。”|They froze for a second, then whispered: “…idiot.”", { love: 15, happy: 10 }))
    ]),
    PE("pt_tsun_jealous", "tsun", "吃醋|Jealousy", "😤", "你和一位异性同事吃了顿饭。{n}一整天都说“我才没生气”。|You had lunch with a colleague. All day {n} insists “I’m NOT upset.”", [
      O("哄ta|Win them round", R("你买了ta最爱的蛋糕。ta一边吃一边说：“下次……不许了。”|You bought their favourite cake. Eating it they said: “…don’t do it again.”", { love: 8, money: -20 })),
      O("故意逗ta|Tease them", RC(.5, "ta气得追着你打，最后你们笑成一团。|They chased you round the flat until you both collapsed laughing.", { love: 6, happy: 6 }, "这次ta是真生气了。|This time they really were upset.", { love: -10 }))
    ]),
    PE("pt_scheme_plan", "scheme", "ta的计划|Their Plan", "♟️", "你在工作上被人陷害了。{n}听完，微微一笑：“交给我。”|Someone at work sets you up. {n} listens, then smiles slightly: “Leave it to me.”", [
      O("让ta去做|Let them handle it", RC(.75, "一个月后，那个人自己辞职了，走之前还给你道了歉。你不敢问{n}做了什么。|A month later the person resigned — and apologised to you first. You didn’t dare ask what {n} did.", { love: 8, perf: 10 }, "计划被识破，事情闹得更大了。|The plan was discovered and things got worse.", { stress: 12 })),
      O("说“我自己来”|Say “I’ll handle it myself”", R("{n}挑了挑眉：“有骨气。”ta看你的眼神里多了点欣赏。|{n} raised an eyebrow: “Spine. I like it.”", { love: 4, eq: 3 }))
    ]),
    PE("pt_scheme_test", "scheme", "一个测试|A Test", "🕵️", "你发现{n}用一个陌生账号和你聊了一个月，在试探你会不会出轨。|You discover {n} has been chatting with you for a month from a fake account — testing whether you’d stray.", [
      O("哭笑不得，说“你赢了”|Laugh helplessly: “You win”", R("ta终于放下心来，那以后对你格外好。|At last they relaxed — and treated you especially well after.", { love: 10 })),
      O("觉得被冒犯，大吵一架|Feel insulted and have a huge fight", R("你们三天没说话。|You didn’t speak for three days.", { love: -15, stress: 8 }))
    ]),
    PE("pt_honest_ring", "honest", "攒了三年的戒指|A Ring Saved Up For Three Years", "💍", "{n}结结巴巴地拿出一个小盒子，说这是ta攒了三年的钱买的。戒指很小，但闪闪发光。|{n} stammers, pulling out a little box — bought with three years of savings. The ring is small, and it shines.", [
      O("戴上它|Put it on", R("你戴了一辈子。后来家里有钱了，ta想给你换一个大的，你没换。|You wore it all your life. When there was money later, they offered a bigger one. You refused.", { love: 15, happy: 12 })),
      O("说“你不用这样”|Say “you didn’t have to”", R("ta挠挠头：“我就是想给你最好的。”|They scratched their head: “I just wanted to give you the best.”", { love: 8, happy: 6 }))
    ], 1.4),
    PE("pt_artsy_poem", "artsy", "一首诗|A Poem", "📜", "{n}在你的枕头下放了一首诗，写的是你们第一次见面那天的天气。|{n} leaves a poem under your pillow about the weather on the day you met.", [
      O("写一首回给ta|Write one back", R("你写得很烂，但ta把它裱了起来挂在书房。|Yours was terrible, but they framed it in the study.", { love: 10, happy: 6 })),
      O("念给ta听|Read it aloud to them", R("ta捂着脸说：“好羞耻……”但一直在笑。|They covered their face — “so embarrassing…” — smiling the whole time.", { love: 8, happy: 6 }))
    ]),
    PE("pt_prag_budget", "prag", "一张表格|A Spreadsheet", "📊", "{n}做了一张表，列出了你们未来二十年的收入、支出和买房计划。|{n} has made a spreadsheet: twenty years of income, spending, and a plan for a home.", [
      O("认真和ta一起看|Go through it together", R("五年后，你们提前两年住进了自己的房子。|Five years later you moved into your own home — two years early.", { love: 8, money: 2000, stress: -6 })),
      O("说“我们能不能浪漫一点”|Ask “can we be a bit romantic?”", R("第二天，表格里多了一行：“每月浪漫预算：500元。”|The next day a new line appeared: “Monthly romance budget: 500.”", { love: 6, happy: 6 }))
    ]),
    PE("pt_boss_decide", "boss", "替你做主|Deciding for You", "👑", "{n}没有问你，就替你推掉了一个外地的工作机会：“你不许走那么远。”|Without asking, {n} turns down an out-of-town job offer for you: “You’re not going that far.”", [
      O("生气：“这是我的事！”|Get angry: “That’s my decision!”", RC(.5, "ta愣住了，第一次说了“对不起”。|They froze and, for the first time, said sorry.", { love: 6, eq: 3 }, "你们大吵一架。|You had a blazing row.", { love: -12, stress: 10 })),
      O("暗暗觉得被在乎|Secretly feel cared for", R("ta嘴上霸道，那天晚上却悄悄给你写了一份更好的工作推荐信。|Bossy in words — but that night they quietly wrote you a reference for a better job.", { love: 8, perf: 4 }))
    ]),
    PE("pt_gold_bag", "gold", "那个包|That Handbag", "👜", "{n}在橱窗前站了很久：“我闺蜜都有这个包了。”价格是你两个月的工资。|{n} lingers by a shop window: “All my friends have this bag.” It costs two months of your salary.", [
      O("咬牙买了|Grit your teeth and buy it", R("ta开心地亲了你一下，那个包ta只背过一次。|They kissed you happily — and carried the bag once.", { love: 10, money: -3000 })),
      O("说“等我升职”|Say “when I get promoted”", RC(.5, "ta撇撇嘴，但没再提。|They pouted, but let it go.", { love: -3 }, "ta三天没理你。|They ignored you for three days.", { love: -10 }))
    ]),
    PE("pt_rebel_trip", "rebel", "说走就走|Spur of the Moment", "🏍️", "半夜，{n}把你摇醒：“起来，我们现在就出发，去看海。”|At midnight {n} shakes you awake: “Get up. We’re going to see the sea. Right now.”", [
      O("跳上摩托车|Jump on the motorbike", R("你们在海边看了日出，翘了一天班。那是你这辈子最自由的一天。|You watched the sunrise on the beach and skipped work. The freest day of your life.", { love: 12, happy: 15, perf: -4 })),
      O("说明天还要上班|Say you have work tomorrow", R("ta一个人去了，回来带了一瓶装着海水的瓶子给你。|They went alone and brought back a bottle of seawater for you.", { love: -2 }))
    ]),
    PE("pt_chill_crisis", "chill", "天塌下来|When the Sky Falls", "🍃", "你因为一个大失误焦虑得睡不着。{n}说：“天塌下来有高个子顶着。先吃点东西。”|You can’t sleep over a big mistake at work. {n} says: “If the sky falls, tall people will hold it up. Eat something first.”", [
      O("吃了ta煮的面|Eat the noodles they made", R("吃完你就睡着了。第二天，问题其实没那么严重。|You fell asleep after. The next day the problem wasn’t so bad.", { love: 6, stress: -12 })),
      O("觉得ta不理解你|Feel they don’t get it", R("ta默默地陪你坐到天亮。|They sat with you quietly until dawn.", { love: 4 }))
    ]),
    PE("pt_clingy_messages", "clingy", "九十九条消息|Ninety-Nine Messages", "📱", "你开了一下午的会。出来一看，{n}发了九十九条消息，最后一条是：“你是不是不爱我了？”|An afternoon of meetings. Afterwards: ninety-nine messages from {n}, the last one: “Don’t you love me any more?”", [
      O("马上打电话哄ta|Call them right away", R("ta在电话那头哭着笑了。|They laughed through tears on the line.", { love: 10 })),
      O("和ta好好谈谈空间的问题|Have a real talk about space", RC(.6, "ta答应试着改。之后每次ta想发消息，就先写在本子上。|They promised to try — and started writing messages in a notebook first.", { love: 4, eq: 3 }, "ta觉得你嫌弃ta了。|They felt you were rejecting them.", { love: -8 }))
    ]),
    PE("pt_nerd_proposal", "nerd", "一行代码|A Line of Code", "💻", "{n}让你帮忙测试一个ta写的小程序。你点开后，屏幕上一行一行地打出了你们认识以来的每一个纪念日，最后一行是：“嫁给我/娶我好吗？”|{n} asks you to test a little program. It types out every anniversary since you met, line by line — and the last line: “Will you marry me?”", [
      O("“程序运行成功。”|“Program executed successfully.”", function (c) { var n = c.npc; N.addLove(n, 15); H.fx(c, { happy: 15 }); if (n.rel === "lover") n.engaged = 1; return "ta愣了三秒，然后跳了起来，把椅子都撞倒了。|They froze for three seconds — then leapt up and knocked the chair over."; }),
      O("“有bug，再改改。”|“There’s a bug. Try again.”", R("ta又熬了一个通宵，改出了一个更浪漫的版本。|They pulled another all-nighter and made an even more romantic version.", { love: 6, happy: 6 }))
    ], 1.6),
    PE("pt_romantic_letters", "romantic", "一百封信|A Hundred Letters", "💌", "{n}在你生日那天送了你一个盒子，里面是一百封信——“给未来一百年的你，每年拆一封。”|For your birthday {n} gives you a box of a hundred letters — “one for each of the next hundred years.”", [
      O("当场拆第一封|Open the first one now", R("第一封信上只写了一句：“谢谢你出生。”|The first said only: “Thank you for being born.”", { love: 12, happy: 12 })),
      O("把盒子放在床头|Keep the box by the bed", R("每年生日，你都会拆开一封。|Every birthday since, you open one.", { love: 10, happy: 8 }))
    ]),
    PE("pt_playboy_phone", "playboy", "ta的手机|Their Phone", "📲", "{n}的手机亮了一下，屏幕上是一条暧昧的消息，发件人备注是“健身教练”。|{n}’s phone lights up with a flirty message from a contact saved as “gym trainer”.", [
      O("直接问ta|Ask them straight out", RC(.5, "ta当着你的面删除拉黑，发誓再也不会了。|They deleted and blocked it in front of you, swearing never again.", { love: -4 }, "ta支支吾吾，你心里明白了。|They stammered — and you understood.", { love: -15, happy: -10 })),
      O("假装没看见，暗中观察|Pretend not to see; watch quietly", R("你开始注意ta每一个晚归的夜晚。|You started noticing every late night.", { stress: 10 })),
      O("一笑了之，你了解ta|Laugh it off; you know them", R("ta后来自己坦白了，说只是聊天。你选择了相信。|They confessed later that it was only chatting. You chose to believe them.", { love: 2, eq: 2 }))
    ])
  ]);
})();
