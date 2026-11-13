/* Version 1.6 stories: campus life, each line of the gray economy, every kind of fame, your children’s
   milestones, and the long afternoon of retirement. */
(function () {
  "use strict";
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function X(id, a, title, icon, t, o, f, w) { return E(id, a, title, icon, t, o, { w: w || 2, if: function (S, p) { return !p.jail && f(p, S); } }); }
  function uni(p) { return p.edu && (p.edu.stage === "uni" || p.edu.stage === "master" || p.edu.stage === "phd"); }
  function gray(ids) { return function (p) { return !!(p.gray && ids.indexOf(p.gray.id) >= 0); }; }
  function fame(ids) { return function (p) { return !!(p.fc && ids.indexOf(p.fc.id) >= 0); }; }
  function retired(p) { return p.age >= 60 && !p.job && !p.fc && !p.gov && !p.mil && !p.pol; }
  function GP(v) { return function (c) { if (c.p.gray) c.p.gray.perf = G.clamp((c.p.gray.perf || 50) + v, 0, 100); }; }
  function FP(v, fans) { return function (c) { var f = c.p.fc; if (!f) return; f.perf = G.clamp(f.perf + v, 0, 100); if (fans) f.fans = Math.max(0, Math.round(f.fans * (1 + fans))); }; }
  function R2(text, fx, more) { return function (c) { H.fx(c, fx); if (more) more(c); return text; }; }
  function RC2(pr, okT, okF, okM, noT, noF, noM) { return function (c) { var v = typeof pr === "function" ? pr(c) : pr; if (G.ch(v)) { H.fx(c, okF); if (okM) okM(c); return okT; } H.fx(c, noF); if (noM) noM(c); return noT; }; }
  function kidsAge(a, b) { return N.rel("child").filter(function (k) { var x = N.age(k); return k.alive && x >= a && x <= b; }); }
  function KE(id, a0, a1, title, icon, t, o, w) { return E(id, [18, 100], title, icon, t, o, { w: w || 1.8, if: function () { return kidsAge(a0, a1).length > 0; }, prep: function (c) { c.npc = G.pick(kidsAge(a0, a1)); c.prm.n = c.npc.name; } }); }

  G.evs([
    /* ======================= campus ======================= */
    X("cu_roommate_snore", [17, 30], "打呼噜的室友|The Snoring Roommate", "😴", "你的室友打呼噜像拖拉机。你已经一周没睡好了。|Your roommate snores like a tractor. You haven’t slept properly in a week.", [
      O("买一副好耳塞|Buy good earplugs", R("世界安静了。你们后来成了最好的朋友。|Peace at last. You later became best friends.", { health: 2, eq: 2 })),
      O("录下来放给他听|Record it and play it to him", R("他笑得在地上打滚，然后去医院查出了鼻炎，治好了。|He rolled on the floor laughing — then got his sinuses checked and cured.", { happy: 5, eq: 3 })),
      O("申请换宿舍|Ask to change rooms", R("新室友不打呼噜，但凌晨三点打游戏。|The new roommate doesn’t snore — he games at 3 a.m.", { stress: 4 }))
    ], uni),
    X("cu_exam_cram", [17, 30], "考前通宵|The All-Nighter", "📖", "明天就是期末考试，你一学期没去上那门课。|Final exam tomorrow, and you skipped that class all term.", [
      O("通宵复习|Pull an all-nighter", RC(.55, "你奇迹般地考了八十分。|Miraculously, you scored eighty.", { perf: 6, health: -3 }, "你在考场上睡着了。|You fell asleep in the exam.", { perf: -8 })),
      O("借学霸的笔记|Borrow the top student’s notes", RC(.7, "笔记写得太好了，你还顺便和学霸成了朋友。|The notes were brilliant — and you made a friend.", { perf: 8, eq: 2 }, "学霸的字你一个也看不懂。|You couldn’t read a word of the handwriting.", { perf: -3 })),
      O("坦然接受挂科|Accept the fail gracefully", R("补考的时候你学得特别认真。|You studied seriously for the resit.", { perf: -6, smarts: 2 }))
    ], uni),
    X("cu_club_band", [17, 28], "乐队招人|The Band Needs You", "🎸", "学校里一支乐队缺一个鼓手，他们说只要你敢上台就行。|A campus band needs a drummer — all you need is the nerve to get on stage.", [
      O("加入！|Join!", RC(.5, "毕业晚会上你们压轴演出，全场大合唱。|You closed the graduation show and the whole crowd sang along.", { happy: 10, fame: 2, sk: { music: 8 } }, "你在台上敲错了好几拍，但谁在乎呢。|You missed a few beats, but who cares.", { happy: 6, sk: { music: 5 } })),
      O("在台下当最忠实的观众|Be their most loyal fan", R("乐队主唱后来出了名，在采访里提到了你。|The singer later got famous and mentioned you in an interview.", { happy: 4 }))
    ], uni),
    X("cu_scholarship", [17, 30], "奖学金评选|The Scholarship", "🏅", "你和一个家境很困难的同学同时竞争一个奖学金名额。|You and a classmate from a very poor family are competing for one scholarship.", [
      O("全力争取|Go for it", RC(function (c) { return .3 + c.p.edu.perf / 200; }, "你拿到了奖学金。|You won it.", { money: 2000, perf: 4 }, "奖学金给了那位同学。|It went to your classmate.", {})),
      O("主动退出|Withdraw", R("那位同学后来在毕业典礼上找到你，说了一句“谢谢”。|At graduation they found you and simply said “thank you”.", { karma: 10, eq: 3 }))
    ], uni),
    X("cu_campus_love", [17, 30], "图书馆的座位|A Seat in the Library", "📚", "每天下午，图书馆你对面的座位总坐着同一个人。今天ta在你的书里夹了一张纸条。|Every afternoon the same person sits across from you in the library. Today they slip a note into your book.", [
      O("打开纸条|Read the note", function (c) { var n = N.mkRomantic({ love: 40, aff: 30 }); n.rel = "crush"; n.pin = 1; n.age = c.p.age; c.prm.m = n.name; H.fx(c, { happy: 8 }); return G.L("纸条上写着：“我叫{m}。你看书的样子很好看。”|The note read: “I’m {m}. You look lovely when you read.”", { m: n.name }); }),
      O("假装没看见|Pretend you didn’t notice", R("第二天，那个座位空了。|The next day the seat was empty.", { happy: -2 }))
    ], function (p) { return uni(p) && !G.N.partner(); }),
    X("cu_grad_trip", [20, 30], "毕业旅行|The Graduation Trip", "🎒", "毕业前，宿舍四个人约好去一次毕业旅行。|Before graduation, your four roommates plan one last trip together.", [
      O("穷游西部|Backpack the wild west of the country", R("你们在星空下喝着啤酒，聊到了天亮。那张合影后来被每个人都设成了头像。|Beer under the stars, talking till dawn. Everyone made that photo their profile picture.", { happy: 12, eq: 3, money: -300 })),
      O("去海边|Go to the seaside", R("有人在沙滩上向暗恋了四年的人表白了。|Someone confessed to a four-year crush on the beach.", { happy: 10, money: -400 }))
    ], function (p) { return uni(p) && p.edu.grade >= 3; }),
    X("cu_thesis", [21, 35], "导师的要求|Your Advisor’s Demands", "📝", "导师让你周末帮他家装修，说“这也是学习”。|Your advisor wants you to help renovate his house at weekends — “it’s also learning”.", [
      O("拒绝|Refuse", RC(.5, "导师尴尬地笑了笑，再也没提过。|He laughed awkwardly and never mentioned it again.", { eq: 3 }, "你的论文被他卡了一年。|He held up your thesis for a year.", { stress: 15, perf: -10 })),
      O("去帮忙|Go and help", R("你学会了刷墙和铺地板。论文顺利通过了。|You learned to paint walls and lay floors. Your thesis passed smoothly.", { stress: 6 }))
    ], function (p) { return p.edu && (p.edu.stage === "master" || p.edu.stage === "phd"); }),

    /* ======================= the gray economy ======================= */
    X("gy_loan_widow", [18, 70], "还不起的寡妇|A Widow Who Can’t Pay", "💸", "欠你钱的是一个刚死了丈夫的女人，她带着两个孩子跪在门口。|The debtor is a newly widowed woman, kneeling at the door with two children.", [
      O("免掉利息，只收本金|Waive the interest; take only the principal", R2("她给你磕了一个头。手下们看你的眼神有点不一样了。|She bowed to the ground. Your men looked at you differently.", { karma: 8 }, GP(-4))),
      O("照规矩办|Rules are rules", R2("你拿走了她家的电视机。那天晚上你喝了很多酒。|You took her television. That night you drank a lot.", { karma: -10, money: 300 }, GP(6)))
    ], gray(["loanshark", "collect"])),
    X("gy_casino_whale", [18, 70], "大鱼|The Whale", "🐋", "一个输红了眼的富豪要借三百万继续赌。|A rich man on a losing streak wants to borrow three million to keep playing.", [
      O("借给他|Lend it", RC(.6, "他越输越多，最后用一栋楼抵了债。|He lost even more and signed over a building.", { money: 50000, karma: -6 }, "他赢回去一大半，还举报了你的场子。|He won most of it back — and reported your place.", { money: -20000 }, null)),
      O("劝他回家|Tell him to go home", R2("他骂骂咧咧地走了。第二天他老婆送来一面锦旗。|He left cursing. The next day his wife brought you a banner of thanks.", { karma: 6 }, GP(-3)))
    ], gray(["casino"])),
    X("gy_smuggle_storm", [18, 65], "海上的风暴|Storm at Sea", "⛈️", "货船遇上了风暴，海警船也在附近。|Your smuggling boat runs into a storm — and a coast-guard cutter is nearby.", [
      O("把货扔进海里|Dump the cargo", R2("你们逃过了检查，但损失惨重。|You passed the inspection but lost a fortune.", { money: -8000 }, GP(-6))),
      O("冒险冲过去|Run for it through the storm", RC2(.5, "你们冲出了风暴圈，货一件没少。|You broke through the storm with every crate intact.", { money: 15000 }, GP(10), "船差点翻了，你被海警抓了个正着。|The boat nearly capsized and the coast guard caught you red-handed.", { health: -10, heat: 40 }, null))
    ], gray(["smuggle"])),
    X("gy_hacker_offer", [16, 60], "白帽子的邀请|An Offer to Go White-Hat", "🛡️", "一家安全公司知道了你的身份，提出给你一份正当工作：帮他们找漏洞。|A security firm knows who you are and offers you a legit job hunting vulnerabilities.", [
      O("洗白上岸|Go legit", function (c) { G.gray && G.gray.leave && G.gray.leave(); H.fx(c, { karma: 10, happy: 6 }); return "你第一次用真名签了劳动合同。|For the first time you signed a contract with your real name."; }),
      O("拒绝，自由更重要|Refuse — freedom matters more", R("你在暗网上的名气越来越大。|Your name grew on the dark web.", { fame: 2 }))
    ], gray(["hacker"])),
    X("gy_tomb_curse", [18, 70], "墓里的东西|What Lies in the Tomb", "⚱️", "你们打开了一座古墓，主墓室里有一具保存完好的女尸，手里握着一面铜镜。|You open an ancient tomb. In the main chamber lies a perfectly preserved woman, a bronze mirror in her hand.", [
      O("拿走铜镜|Take the mirror", RC(.5, "铜镜在黑市上卖出了天价。但你从此总做同一个噩梦。|The mirror sold for a fortune — but you’ve had the same nightmare ever since.", { money: 60000, stress: 15, karma: -10 }, "出墓的时候塌方了，你被埋了半个身子。|The tunnel collapsed on the way out and buried you to the waist.", { health: -30 }))
      , O("什么都不动，封好墓穴报警|Touch nothing, seal it and call the authorities", R("考古队来了，那是一次重大发现。新闻里说是“一位匿名市民”报的警。|Archaeologists came — a major discovery. The news credited “an anonymous citizen”.", { karma: 15 }))
    ], gray(["tomb"])),
    X("gy_fighter_throw", [18, 50], "打假拳|Throw the Fight", "🥊", "老板让你今晚第三回合倒下，赔率已经定好了。|The boss wants you down in the third round tonight. The odds are set.", [
      O("照做|Take the dive", R2("你拿到了一大笔钱，在镜子前站了很久。|A fat payout. You stood in front of the mirror a long time.", { money: 6000, karma: -4, happy: -5 }, GP(4))),
      O("打赢他|Win anyway", RC2(.5, "你一拳把对手打倒了，全场沸腾。老板的脸是绿的。|You knocked him out and the crowd went wild. The boss turned green.", { fame: 4, happy: 10 }, GP(-10), "你赢了比赛，第二天在巷子里被人打断了两根肋骨。|You won — and the next day someone broke two of your ribs in an alley.", { health: -25 }, null))
    ], gray(["fighter"])),
    X("gy_troll_order", [16, 60], "一个新订单|A New Order", "🤖", "有人出高价，让你的水军团队去网暴一个揭发了企业丑闻的小记者。|Someone pays well for your troll farm to pile on a young reporter who exposed a corporate scandal.", [
      O("接单|Take the job", R2("那个记者删掉了所有社交账号。你看着到账的数字，没有觉得开心。|The reporter deleted all her accounts. Looking at the payment, you didn’t feel happy.", { money: 8000, karma: -15 }, GP(6))),
      O("拒绝，反过来帮她澄清|Refuse — and help clear her name", R2("你的团队第一次做了一件好事。|For once, your team did something good.", { karma: 12 }, GP(-8)))
    ], gray(["troll"])),
    X("gy_fixer_minister", [25, 70], "大人物的电话|A Call from Someone Big", "📞", "一个大人物通过你牵线收了一笔钱，现在他被调查了。|A powerful man took money through you, and now he’s under investigation.", [
      O("连夜出国|Leave the country tonight", RC(.6, "你在国外安顿下来，再也没回去过。|You settled abroad and never went back.", { stress: 10 }, "你在机场被拦了下来。|You were stopped at the airport.", { heat: 60, stress: 20 })),
      O("主动去自首|Turn yourself in", R("你交代了一切，换来了从轻处理。|You told them everything and were treated leniently.", { heat: 20, karma: 6 }))
    ], gray(["fixer"])),
    X("gy_fake_bag", [18, 65], "老顾客的女儿|A Regular’s Daughter", "👜", "你卖的假包被一个女孩当成真货买走了——她攒了一年的工资，要送给妈妈当生日礼物。|A girl bought one of your fake bags thinking it was real — a year’s savings, as a birthday gift for her mother.", [
      O("追上去把钱退给她|Run after her and refund her", R2("她愣了半天，最后笑了：“谢谢你告诉我。”|She stood stunned, then laughed: “Thank you for telling me.”", { karma: 10, money: -400 }, GP(-4))),
      O("就这样吧|Let it go", R("你把那天的账本撕了一页。|You tore that day’s page out of the ledger.", { karma: -5, money: 200 }))
    ], gray(["fake"])),

    /* ======================= fame ======================= */
    X("fm_actor_role", [16, 70], "改变命运的剧本|A Life-Changing Script", "🎬", "一位大导演给你寄来剧本，角色需要你增重三十斤、剃光头。|A great director sends you a script — the part needs you to gain thirty pounds and shave your head.", [
      O("接！|Take it!", RC2(.5, "电影拿下了国际大奖，你的表演被称为“教科书级”。|The film won an international prize; your performance was called “textbook”.", { fame: 15, health: -6, happy: 12 }, FP(15, .5), "电影票房惨淡，你的身材却一时回不去了。|The film flopped, and the weight wouldn’t come off.", { health: -8, happy: -6 }, FP(-5))),
      O("推掉，接一部商业片|Pass; do a blockbuster instead", R2("片酬很高，但影评人说你“越来越没追求”。|Big pay, but critics said you’d lost your ambition.", { money: 30000 }, FP(-3, .1)))
    ], fame(["actor"])),
    X("fm_singer_lipsync", [16, 70], "假唱|Lip-Sync", "🎤", "晚会导演要求你假唱，说现场音响不稳定。|The gala director wants you to lip-sync — the live sound is unreliable.", [
      O("坚持真唱|Insist on singing live", RC2(.6, "你的真唱片段被疯传，网友说“这才是歌手”。|Your live performance went viral: “This is what a singer sounds like.”", { fame: 6, happy: 6 }, FP(10, .2), "音响真的出了问题，你破音了。|The sound did fail, and your voice cracked.", { happy: -8 }, FP(-6))),
      O("听导演的|Do as the director says", R2("一切顺利，没人发现。|All went smoothly; no one noticed.", {}, FP(1)))
    ], fame(["singer", "idol"])),
    X("fm_idol_dating", [16, 40], "恋爱禁令|The Dating Ban", "💔", "合同规定你不许谈恋爱，可你喜欢上了一个圈外人。|Your contract forbids dating — and you’ve fallen for someone outside the industry.", [
      O("偷偷交往|Date in secret", RC2(.5, "你们躲过了所有狗仔。|You dodged every paparazzo.", { happy: 10 }, null, "被拍到了。粉丝脱粉了一半。|You were caught on camera. Half your fans left.", { fame: -6, happy: -6 }, FP(-15, -.4))),
      O("公开恋情|Go public", RC2(.4, "大部分粉丝送上了祝福。你成了第一个公开恋爱还更红的偶像。|Most fans wished you well. You became the first idol to go public and get more popular.", { fame: 6, happy: 12 }, FP(5, .1), "公司和你解约了。|The agency terminated your contract.", { happy: -10 }, FP(-25, -.5))),
      O("放弃这段感情|Give it up", R("你在练习室里哭了一整晚。|You cried all night in the practice room.", { happy: -10 }))
    ], fame(["idol"])),
    X("fm_stream_drama", [16, 60], "直播事故|A Livestream Blunder", "📹", "直播时你忘了关摄像头，家人吵架的声音被几十万人听到了。|You forgot to switch off the camera, and a family argument was heard by hundreds of thousands.", [
      O("真诚道歉，讲出家里的难处|Apologise sincerely and share what your family is going through", RC2(.6, "粉丝们反而更心疼你了，打赏刷屏。|Fans felt for you; tips flooded in.", { money: 3000, eq: 3 }, FP(8, .15), "有人把录音剪成鬼畜视频。|Someone remixed the audio into a meme.", { stress: 10 }, FP(-4))),
      O("删掉回放，假装什么都没发生|Delete the replay and pretend nothing happened", R2("网上还是有录屏。|Screen recordings were already out there.", { stress: 6 }, FP(-3)))
    ], fame(["streamer"])),
    X("fm_athlete_doping", [16, 40], "一针|One Injection", "💉", "大赛前，队医悄悄说：“有一种查不出来的药，打了能提高百分之五。”|Before the big meet, the team doctor whispers: “There’s an undetectable drug. Five percent faster.”", [
      O("拒绝|Refuse", RC2(.4, "你凭真本事拿到了金牌。三年后，那几个用药的对手都被查出来了。|You won gold clean. Three years later, the rivals who doped were all caught.", { fame: 10, karma: 8, happy: 12 }, FP(15, .3), "你只拿了第四。|You came fourth.", { karma: 6, happy: -4 }, FP(-2))),
      O("打|Take it", RC2(.6, "你拿了金牌。|You won gold.", { fame: 10, karma: -10 }, FP(15, .3), "药检查出来了。你被禁赛四年，奖牌被收回。|You tested positive: banned for four years, medal stripped.", { fame: -15, karma: -10, happy: -20 }, FP(-40, -.6)))
    ], fame(["athlete", "esports"])),
    X("fm_writer_block", [18, 85], "写不下去|Writer’s Block", "✒️", "新书已经拖稿一年了，出版社天天催。|Your new book is a year late; the publisher calls daily.", [
      O("去一个陌生的小镇住三个月|Go live in a strange small town for three months", RC2(.55, "你在小镇的咖啡馆里写完了它。这本书成了你最好的作品。|You finished it in the town’s café. It became your best book.", { happy: 10, fame: 6 }, FP(15, .3), "你在小镇上钓了三个月的鱼。|You fished for three months.", { happy: 4 }, FP(-3))),
      O("找人代笔|Hire a ghostwriter", RC2(.6, "书卖得不错，没人发现。|It sold well; no one knew.", { karma: -6, money: 5000 }, FP(2), "代笔人把这件事卖给了媒体。|The ghostwriter sold the story to the press.", { fame: -10, karma: -6 }, FP(-20, -.3)))
    ], fame(["writer"])),
    X("fm_painter_auction", [18, 90], "拍卖会上的那幅画|The Painting at Auction", "🖼️", "你二十年前送给一个穷朋友的画，今天出现在了拍卖会上，起拍价是你一年的收入。|A painting you gave to a poor friend twenty years ago appears at auction, opening at a year of your income.", [
      O("去现场看看|Go and watch", R2("落槌价是起拍价的十倍。那个朋友在人群里对你笑，眼里有泪。|It sold for ten times the opening price. In the crowd, your friend smiled at you through tears.", { happy: 10, fame: 4 }, FP(10, .2))),
      O("当作不知道|Act as if you don’t know", R("朋友后来寄来一张支票，你没有兑现。|Your friend later mailed a cheque. You never cashed it.", { karma: 4 }))
    ], fame(["painter"])),

    /* ======================= your children ======================= */
    KE("kd_first_word", 0, 2, "第一个词|The First Word", "👶", "{n}今天说出了第一个词。|{n} said a first word today.", [
      O("是“妈妈”还是“爸爸”？|Was it Mama or Dada?", function (c) { var me = c.p.g === "f" ? "妈妈|Mama" : "爸爸|Dada"; c.prm.w = G.ch(.55) ? me : (c.p.g === "f" ? "爸爸|Dada" : "妈妈|Mama"); H.fx(c, { happy: 8, npc: 6 }); return G.L("是“{w}”！|It was “{w}”!", { w: c.prm.w }); }),
      O("录下来发给所有人|Record it and send it to everyone", R("家族群里刷了一百条语音。|The family chat filled with a hundred voice messages.", { happy: 6, npc: 4 }))
    ]),
    KE("kd_school_play", 5, 11, "学校演出|The School Play", "🎭", "{n}在学校的话剧里演一棵树，站在最后一排。|{n} is playing a tree in the school play, in the back row.", [
      O("推掉会议去看|Skip a meeting to go", R("{n}在台上一直找你，看见你以后，树笑得前仰后合。|{n} kept searching the crowd; when they spotted you, the tree burst out laughing.", { npc: 12, happy: 8, perf: -2 })),
      O("工作太忙，让家人录视频|Too busy — ask family to film it", R("{n}后来问你：“你看了吗？”|{n} later asked: “Did you watch it?”", { npc: -4 }))
    ]),
    KE("kd_bullied", 6, 15, "被欺负了|Bullied", "😢", "{n}回家时脸上有伤，什么都不肯说。|{n} comes home with a bruise and won’t say a word.", [
      O("耐心陪{n}聊|Sit with {n} and listen", R("{n}终于哭着说出来了。你去了学校，事情得到了解决。{n}说：“谢谢你相信我。”|Finally {n} told you through tears. You went to the school and it was dealt with. {n} said: “Thank you for believing me.”", { npc: 12, eq: 3 })),
      O("直接冲到学校|Storm into the school", RC(.6, "欺负人的孩子被处分了。|The bullies were disciplined.", { npc: 6 }, "你和对方家长吵了起来，{n}觉得更丢脸了。|You fought with the other parents; {n} felt even more humiliated.", { npc: -6, stress: 8 }))
    ]),
    KE("kd_teen_rebel", 13, 17, "叛逆期|The Rebellious Years", "🚪", "{n}摔门进了房间：“你根本不懂我！”|{n} slams the door: “You don’t understand me at all!”", [
      O("隔着门说：“我在这儿，你想说的时候我都在。”|Say through the door: “I’m here whenever you want to talk.”", R("半夜，{n}敲开了你的门。|At midnight, {n} knocked on your door.", { npc: 10, eq: 3 })),
      O("没收手机|Confiscate the phone", R("{n}整整一周没和你说话。|{n} didn’t speak to you for a week.", { npc: -10 })),
      O("给{n}写一封信|Write {n} a letter", R("多年后，你在{n}的抽屉里发现那封信还被好好收着。|Years later you found it still carefully kept in {n}’s drawer.", { npc: 12 }))
    ]),
    KE("kd_first_love", 14, 18, "孩子的初恋|Your Child’s First Love", "💌", "你发现{n}恋爱了。|You find out {n} has a first love.", [
      O("假装不知道，默默关心|Pretend not to know; care quietly", R("{n}后来主动把对方带回家吃饭。|{n} later brought them home for dinner.", { npc: 8 })),
      O("找{n}好好谈谈|Have a proper talk with {n}", RC(.6, "你们聊了很久，{n}说你是最开明的家长。|You talked a long time; {n} said you were the coolest parent.", { npc: 10 }, "{n}觉得你在干涉，很生气。|{n} felt you were interfering and got angry.", { npc: -8 })),
      O("坚决反对|Forbid it", R("他们转入了地下。|They went underground.", { npc: -12 }))
    ]),
    KE("kd_leave_home", 17, 20, "离家|Leaving Home", "🧳", "{n}要去外地上大学了。你在车站送ta。|{n} is off to university in another city. You see them off at the station.", [
      O("忍住眼泪，挥手告别|Hold back tears and wave", R("车开走后，你在站台上哭得像个孩子。|After the train left, you cried like a child on the platform.", { npc: 8, happy: -4 })),
      O("塞给{n}一个信封|Slip {n} an envelope", R("信封里是一点钱和一张纸条：“累了就回家。”|Inside: a little money and a note: “Come home when you’re tired.”", { npc: 12, money: -200 }))
    ]),
    KE("kd_child_wedding", 23, 40, "孩子的婚礼|Your Child’s Wedding", "💒", "{n}结婚了。婚礼上，主持人请你上台说几句话。|{n} is getting married. The host invites you up to speak.", [
      O("讲{n}小时候的故事|Tell stories from {n}’s childhood", R("全场又笑又哭。{n}冲上来抱住了你。|The room laughed and cried. {n} ran up and hugged you.", { npc: 12, happy: 12 })),
      O("只说一句：“好好过日子。”|Say only: “Take good care of each other.”", R("这句话被{n}记了一辈子。|{n} remembered it for life.", { npc: 8, happy: 8 }))
    ]),
    KE("kd_grandkid_call", 25, 50, "孩子的电话|A Call from Your Child", "📱", "{n}打来电话：“我当爸爸/妈妈了。现在我才知道你当年有多不容易。”|{n} calls: “I’m a parent now. Only now do I understand how hard it was for you.”", [
      O("哭了|Cry", R("你们在电话两头都哭了。|You both cried on the phone.", { npc: 15, happy: 10 })),
      O("说“比你想的还难”|Say: “Harder than you think”", R("你们笑了很久。|You laughed together for a long time.", { npc: 10, happy: 8 }))
    ]),

    /* ======================= retirement ======================= */
    X("rt_dance", [60, 90], "广场舞之争|The Square-Dance Turf War", "💃", "你们的广场舞队和另一支队伍为了一块空地吵了起来。|Your square-dance group is feuding with another over a patch of plaza.", [
      O("提议来一场斗舞|Propose a dance-off", RC(.5, "你们赢了！两支队伍后来合并了，成了全区最大的舞队。|You won! The groups merged into the biggest troupe in the district.", { happy: 10, health: 3, eq: 3 }, "你们输了，只好搬到了公园后面。|You lost and moved behind the park.", { happy: 2 })),
      O("约好时间错开跳|Agree to take turns", R("大家相安无事。|Peace reigned.", { eq: 3 }))
    ], retired),
    X("rt_grandkids", [55, 95], "带孙子|Minding the Grandkids", "🧸", "孩子们工作忙，想让你帮忙带孙辈。|Your children are busy and want you to look after the grandkids.", [
      O("全身心投入|Throw yourself into it", R("你每天接送、做饭、讲故事。累，但孙辈的笑声让你年轻了十岁。|School runs, cooking, bedtime stories. Exhausting — but the laughter made you ten years younger.", { happy: 10, health: -2, kids: 6 })),
      O("只在周末帮忙|Help at weekends only", R("你保留了自己的生活，孩子们也理解。|You kept your own life, and your children understood.", { happy: 5 }))
    ], function (p) { return p.age >= 55 && N.rel("grandchild").length > 0; }),
    X("rt_matchcorner", [55, 85], "公园相亲角|The Park Matchmaking Corner", "🪧", "公园里的相亲角挂满了写着子女条件的纸牌。旁边的大爷劝你也给孩子挂一个。|The park’s matchmaking corner is hung with signs listing grown children’s details. The old man next to you urges you to hang one too.", [
      O("写一张，挂上去|Write a sign and hang it", RC(.35, "一位阿姨看中了，两家孩子见了面，居然真成了。|A lady liked it; the children met and, amazingly, it worked out.", { happy: 10, kids: 4 }, "孩子知道后哭笑不得：“爸/妈，你别添乱了！”|Your child found out and groaned: “Please stop!”", { happy: 2, kids: -2 })),
      O("只是来看热闹|Just here to watch", R("你和几个老伙计聊了一下午，比看电视有意思多了。|You chatted all afternoon with the regulars — better than TV.", { happy: 5, eq: 2 }))
    ], function (p) { return p.age >= 55 && N.rel("child").some(function (k) { return k.alive && N.age(k) >= 26 && k.rel === "child" && !k.spouseId; }); }, 1.2),
    X("rt_university", [60, 90], "老年大学|University for the Elderly", "🎓", "社区开了一所老年大学，有书法、摄影、外语、钢琴。|The community opens a seniors’ university: calligraphy, photography, languages, piano.", [
      O("报名学钢琴|Learn piano", R("七十岁，你在结业汇报演出上弹完了一整首曲子。|At seventy you played a full piece at the end-of-term concert.", { happy: 10, smarts: 2, sk: { music: 10 } })),
      O("报名学摄影|Learn photography", R("你拍的夕阳登上了市里的摄影展。|Your sunset photo made the city exhibition.", { happy: 8, fame: 1 })),
      O("报名学外语|Learn a language", R("你终于可以和外国的孙辈用他们的语言聊天了。|At last you could chat with your grandchildren abroad in their language.", { smarts: 4, happy: 6 }))
    ], retired),
    X("rt_old_love", [65, 100], "老伴|Your Old Companion", "👫", "你和老伴坐在公园的长椅上晒太阳。ta突然问：“如果重来一次，你还会选我吗？”|You and your spouse sit in the sun on a park bench. Suddenly they ask: “If you could do it all again, would you still choose me?”", [
      O("“还选你。”|“I’d choose you again.”", R("ta握住了你的手，像几十年前一样。|They took your hand, just like decades ago.", { part: 15, happy: 10 })),
      O("“下辈子换你追我。”|“Next life, you chase me.”", R("ta哈哈大笑，笑出了眼泪。|They laughed till they cried.", { part: 10, happy: 8 }))
    ], function (p) { return p.age >= 65 && !!N.spouse(); }),
    X("rt_hometown", [60, 95], "回故乡|Back to Your Hometown", "🏘️", "你回到了出生的地方。小时候的街道已经认不出来了。|You return to where you were born. The streets of your childhood are unrecognisable.", [
      O("找儿时的玩伴|Look for childhood friends", RC(.5, "你找到了一个，你们一眼就认出了彼此。|You found one — you knew each other at a glance.", { happy: 12, eq: 3 }, "大家都搬走了，或者不在了。|They had all moved away or passed on.", { happy: -4 })),
      O("在老房子的位置站一会儿|Stand where your old house was", R("那里现在是一个超市。你在门口站了很久。|It’s a supermarket now. You stood at the door a long time.", { eq: 3 }))
    ], retired),
    X("rt_will_think", [70, 100], "回首|Looking Back", "🌅", "一个人的午后，你翻开了一本旧相册。|One quiet afternoon you open an old photo album.", [
      O("给每个孩子写一封信|Write a letter to each of your children", R("你写了整整一个月。|It took you a whole month.", { kids: 8, eq: 4, happy: 6 })),
      O("把相册带给孙辈看|Show the album to your grandchildren", R("孙辈们指着照片问：“这是你吗？你年轻时好好看！”|The grandkids pointed: “Is that you? You were so good-looking!”", { happy: 10 }))
    ], function (p) { return p.age >= 70; })
  ]);
})();
