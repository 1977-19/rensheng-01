/* Version 1.6 stories: every talent you are born with now writes its own chapters. */
(function () {
  "use strict";
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function TE(id, tal, a, title, icon, t, o, w) { return E(id, a, title, icon, t, o, { w: w || 2.4, if: function (S, p) { return (p.talents || []).indexOf(tal) >= 0 && !p.jail; } }); }

  G.evs([
    /* 过目不忘 genius */
    TE("tl_genius_tv", "genius", [8, 16], "电视智力节目|A TV Quiz Show", "📺", "一档电视节目在找“最强大脑”。你看了一遍就能背出一整本电话簿。|A TV show is looking for “super brains”. You can recite a phone book after one read.", [
      O("报名参加|Sign up", RC(.6, "你在节目上记住了五百张陌生人的脸，全场起立。|On air you memorised five hundred strangers’ faces. The audience stood.", { fame: 8, happy: 10, money: 2000 }, "你在决赛记错了一张脸，屈居第二。|You missed one face in the final and came second.", { fame: 4, happy: 2 })),
      O("不想被当成怪物|Don’t want to be seen as a freak", R("你把能力藏了起来，只在考试时用。|You hid the gift and used it only in exams.", { perf: 6 }))
    ]),
    TE("tl_genius_witness", "genius", [18, 80], "唯一的证人|The Only Witness", "🔍", "你在街上瞥了一眼一辆肇事逃逸的车，警察问你记不记得车牌。|You glanced at a hit-and-run car. The police ask if you remember the plate.", [
      O("一字不差地说出来|Recite it exactly", R("肇事者两小时后被抓。警察说：“你比监控还好使。”|The driver was caught in two hours. “Better than CCTV,” said the officer.", { karma: 8, fame: 2 })),
      O("说不太确定|Say you’re not sure", R("你不想惹麻烦。但那串数字在你脑子里转了好几天。|You didn’t want trouble — but the numbers spun in your head for days.", { stress: 6 }))
    ]),
    /* 聪明伶俐 smart */
    TE("tl_smart_skip", "smart", [7, 14], "跳级|Skipping a Year", "⏩", "老师建议你跳一级，你比同班同学快太多了。|Your teacher suggests skipping a year — you’re far ahead of your class.", [
      O("跳！|Skip it!", R("新班级的同学都比你大，但你很快就成了第一名。|Everyone in the new class was older, but you soon came top.", { perf: 8, smarts: 3, eq: -2 })),
      O("留下来陪朋友|Stay with your friends", R("你成了班上最受欢迎的“小老师”。|You became the class’s favourite “little teacher”.", { eq: 4, happy: 4 }))
    ]),
    TE("tl_smart_bug", "smart", [20, 60], "别人看不出的问题|What Others Missed", "🧩", "会议上，大家都在为一个方案鼓掌，你却发现了一个致命的漏洞。|In a meeting everyone applauds a plan — but you spot a fatal flaw.", [
      O("当场指出|Point it out", RC(.6, "老板沉默了一会儿：“好，散会后你来我办公室。”你升职了。|The boss paused: “See me after.” You were promoted.", { perf: 15 }, "提方案的人恨上了你。|The plan’s author never forgave you.", { perf: 4, stress: 6 })),
      O("会后私下提醒|Tell them privately afterwards", R("对方感激地改了方案，从此成了你的盟友。|They fixed it gratefully and became your ally.", { eq: 3, perf: 6 }))
    ]),
    /* 天生丽质 beauty / 清秀可人 cute / 上镜脸 photogenic */
    TE("tl_beauty_scout", "beauty", [14, 30], "街头星探|A Street Scout", "📸", "你在地铁站被三家经纪公司的星探同时拦住。|Three talent scouts stop you at once in the subway.", [
      O("留下联系方式|Take their cards", RC(.5, "一家正规公司签下了你，你拍了第一支广告。|A reputable agency signed you; you shot your first ad.", { fame: 6, money: 3000 }, "其中一家要你先交“包装费”。你走了。|One wanted a “packaging fee” up front. You walked.", { smarts: 2 })),
      O("戴上口罩快走|Pull up your mask and hurry off", R("你已经习惯了。|You’re used to it.", {}))
    ]),
    TE("tl_beauty_judged", "beauty", [18, 50], "“靠脸吃饭”|“Just a Pretty Face”", "💄", "你凭实力拿到的晋升，被同事在背后说是“靠脸”。|Colleagues whisper that your promotion — earned on merit — was down to your looks.", [
      O("用业绩说话|Let results speak", R("年底你的业绩是全部门第一，闲话少了。|You topped the department by year-end; the gossip faded.", { perf: 10, eq: 3 })),
      O("当面对质|Confront them", RC(.5, "他们尴尬地道了歉。|They apologised, embarrassed.", { eq: 2 }, "吵得全公司都知道了。|The whole company heard about it.", { stress: 8 }))
    ]),
    TE("tl_cute_grandma", "cute", [3, 10], "奶奶们的最爱|Every Grandma’s Favourite", "🍬", "你一出门，小区里的奶奶们就围过来捏你的脸，往你口袋里塞糖。|Step outside and the neighbourhood grannies pinch your cheeks and fill your pockets with sweets.", [
      O("甜甜地说谢谢|Say thank you sweetly", R("你的零食从来没断过。|You never ran out of snacks.", { happy: 6, eq: 2 })),
      O("把糖分给其他小朋友|Share the sweets with other kids", R("你成了小区里的孩子王。|You became the neighbourhood’s little leader.", { eq: 4, karma: 2 }))
    ]),
    TE("tl_photo_viral", "photogenic", [14, 40], "路人照片|A Stranger’s Snapshot", "🤳", "一个路人随手拍下了你的照片发到网上，第二天你成了“全网最上镜的路人”。|A passer-by posted a casual snap of you; the next day you were “the internet’s most photogenic stranger”.", [
      O("开个社交账号|Start a social account", RC(.6, "一个月涨了五十万粉丝，品牌开始找你合作。|Half a million followers in a month; brands came calling.", { fame: 8, money: 5000 }, "热度来得快去得也快。|The buzz faded as fast as it came.", { fame: 2 })),
      O("请对方删掉照片|Ask them to delete it", R("你更喜欢安静的生活。|You prefer a quiet life.", {}))
    ]),
    /* 运动天才 athletic / 钢铁之躯 iron / 格斗天赋 fighter */
    TE("tl_ath_coach", "athletic", [8, 15], "体校教练|The Sports-School Coach", "🏃", "体校教练在运动会上看到了你，第二天就来家里了。|A sports-school coach saw you at the school games and came to your house the next day.", [
      O("去体校|Go to sports school", R("你开始了每天六个小时的训练。|Six hours of training a day began.", { health: 8, sk: { athletic: 10 }, perf: -4 })),
      O("继续读书，运动当爱好|Keep studying; sport stays a hobby", R("你成了学校田径队的队长。|You became captain of the school athletics team.", { health: 4, happy: 4 }))
    ]),
    TE("tl_ath_marathon", "athletic", [20, 60], "第一次马拉松|Your First Marathon", "🏅", "你第一次跑全程马拉松，跑到三十公里的时候，前面只剩几个职业选手了。|Your first marathon: at thirty kilometres only a handful of pros are ahead of you.", [
      O("全力冲刺|Go all out", RC(.4, "你冲进了前十，成了那年最大的黑马。|You finished top ten — the year’s biggest dark horse.", { fame: 5, health: 3, happy: 12 }, "最后五公里你抽筋了，走着完了赛。|You cramped in the last five kilometres and walked home.", { health: -3, happy: 4 })),
      O("享受比赛|Enjoy the run", R("你在终点线前拉起了一个跑不动的老人，一起冲线。|At the finish you pulled along an old man who was struggling, and you crossed together.", { karma: 5, happy: 8 }))
    ]),
    TE("tl_iron_accident", "iron", [16, 80], "车祸|The Crash", "🚑", "一辆车闯红灯撞上了你。医生看着你的片子，直摇头：“这都没骨折？”|A car runs a red light and hits you. The doctor stares at your X-rays: “Not a single fracture?”", [
      O("当天出院|Go home the same day", R("司机吓坏了，提着水果来道歉。你反过来安慰他。|The driver, terrified, came to apologise with fruit. You comforted him.", { eq: 3, health: -3 })),
      O("住几天观察|Stay a few days for observation", R("护士们都来看这个“钢铁人”。|The nurses all came to see the “iron person”.", { happy: 3 }))
    ]),
    TE("tl_fighter_alley", "fighter", [16, 60], "小巷里的劫匪|Mugging in an Alley", "🥋", "两个人拿着刀在小巷里抢一个女孩的包。|Two men with knives are robbing a girl in an alley.", [
      O("出手|Step in", RC(.75, "你三下两下就把他们放倒了。女孩报了警，警察说你可以去当教练了。|Three moves and they were down. The police said you should be an instructor.", { karma: 10, fame: 3 }, "你打倒了一个，被另一个划伤了胳膊。|You dropped one; the other cut your arm.", { karma: 8, health: -10 })),
      O("报警，在远处喊|Call the police and shout from a distance", R("劫匪吓跑了。|They fled.", { karma: 4 }))
    ]),
    /* 体弱多病 frail / 长寿基因 longevity */
    TE("tl_frail_hospital", "frail", [5, 15], "病房里的童年|A Childhood in Hospital", "🏥", "你又住院了。隔壁床是一个和你差不多大的孩子。|In hospital again. The next bed holds a child about your age.", [
      O("和ta交朋友|Make friends", R("你们在病房里下了一百盘跳棋。出院后你们一直保持联系。|You played a hundred games of draughts. You stayed friends after leaving.", { eq: 5, happy: 6 })),
      O("一直看书|Read the whole time", R("你一个月读完了二十本书。|You read twenty books in a month.", { smarts: 4 }))
    ]),
    TE("tl_frail_strong", "frail", [16, 40], "和身体讲和|Making Peace with Your Body", "🧘", "医生说，规律的运动也许能让你强壮起来。|The doctor says regular exercise might make you stronger.", [
      O("从每天散步开始|Start with daily walks", R("一年后你第一次完整跑完了五公里。你在终点哭了。|A year later you ran a full five kilometres for the first time. You cried at the finish.", { health: 12, happy: 10 })),
      O("算了，顺其自然|No — let it be", R("你学会了照顾自己。|You learned to look after yourself.", { health: 2 }))
    ]),
    TE("tl_long_centenarian", "longevity", [85, 120], "百岁宴|A Hundredth Birthday", "🎂", "你的长寿成了全城的新闻。电视台想来采访你的长寿秘诀。|Your long life is citywide news. A TV crew wants your secret.", [
      O("“心宽，少操心。”|“Worry less.”", R("这句话被印在了社区的宣传栏上。|The line went up on the community noticeboard.", { fame: 4, happy: 8 })),
      O("“每天一杯酒，一碗粥。”|“A glass of wine and a bowl of porridge every day.”", R("第二天超市里的那款酒卖断了货。|The next day that wine sold out.", { fame: 3, happy: 8 }))
    ]),
    /* 社交达人 social / 万人迷 charm / 桃花运 peach */
    TE("tl_social_party", "social", [16, 50], "谁都认识你|Everyone Knows You", "🥂", "你在一个派对上，发现在场一半的人你都认识。主人请你帮忙介绍两个重要的客人认识。|At a party you know half the room. The host asks you to introduce two important guests.", [
      O("牵线搭桥|Make the connection", R("两个人后来合作了一个大项目，都欠你一个人情。|They later partnered on a major project — and both owe you.", { eq: 4, perf: 6 })),
      O("享受派对|Just enjoy the party", R("你跳了一整晚的舞。|You danced all night.", { happy: 8 }))
    ]),
    TE("tl_charm_admirers", "charm", [16, 45], "情人节的桌子|A Desk on Valentine’s Day", "🌹", "情人节早上，你的桌上堆满了花和巧克力，有一封信没有署名。|Valentine’s morning: your desk is buried in flowers and chocolate, and one letter is unsigned.", [
      O("找出写匿名信的人|Find the anonymous writer", function (c) { var n = N.mkRomantic({ love: 55, aff: 35 }); n.rel = "crush"; n.pin = 1; c.prm.m = n.name; H.fx(c, { happy: 8 }); return G.L("原来是{m}，一个平时从不和你说话的人。|It was {m}, who never usually spoke to you.", { m: n.name }); }),
      O("把巧克力分给大家|Share the chocolate with everyone", R("全办公室都很开心。|The whole office was happy.", { eq: 3 }))
    ]),
    TE("tl_peach_triangle", "peach", [18, 40], "两个人同时表白|Two Confessions at Once", "💘", "同一天，两个人分别向你表白了，而他们是最好的朋友。|On the same day two people confess to you — and they’re best friends.", [
      O("选择其中一个|Choose one", function (c) { var n = N.mkRomantic({ love: 60, aff: 40 }); n.rel = "lover"; n.pin = 1; if (!c.p.partner) c.p.partner = n.id; c.prm.m = n.name; H.fx(c, { happy: 8 }); return G.L("你和{m}在一起了。另一个人很久都没再出现。|You got together with {m}. The other one disappeared for a long time.", { m: n.name }); }),
      O("谁都不选|Choose neither", R("他们俩后来都谢谢你没有拆散他们的友谊。|They both later thanked you for not breaking up their friendship.", { eq: 4, karma: 3 }))
    ]),
    /* 商业嗅觉 biz / 铁公鸡 thrifty / 败家子 spender */
    TE("tl_biz_trend", "biz", [16, 60], "嗅到了机会|You Smell an Opportunity", "📈", "你注意到一种新产品在年轻人里突然流行起来，而市场上几乎没有人卖。|A new product is suddenly hot among young people — and almost nobody sells it.", [
      O("马上进货|Stock up right away", RC(.65, "你赚了一大笔，比别人早了整整半年。|You made a fortune — six months ahead of everyone.", { money: 15000, smarts: 2 }, "风口过得太快，你压了一仓库的货。|The fad passed fast and left you a warehouse of stock.", { money: -5000 })),
      O("写成商业计划，找人投资|Write a business plan and find investors", R("有人愿意投你，还说“你天生就是做生意的料”。|An investor backed you: “You’re a born dealmaker.”", { money: 5000, eq: 2 }))
    ]),
    TE("tl_thrifty_coupon", "thrifty", [12, 90], "省钱大师|The Master of Saving", "🧾", "你把所有的优惠叠加在一起，买一台电视只花了标价的三成。|You stacked every discount and bought a TV for thirty percent of the price.", [
      O("在网上分享攻略|Share the guide online", R("你的攻略被转发了十万次，有人叫你“省钱教父”。|Your guide was shared a hundred thousand times; people called you “the godfather of savings”.", { fame: 3, happy: 6 })),
      O("悄悄享受胜利|Quietly enjoy the win", R("你又多存了一笔钱。|Another sum went into savings.", { money: 300 }))
    ]),
    TE("tl_spender_card", "spender", [18, 60], "刷爆的信用卡|A Maxed-Out Card", "💳", "月底收到账单，你发现自己又刷爆了三张信用卡。|At month’s end you’ve maxed out three credit cards again.", [
      O("剪掉信用卡，记账|Cut up the cards and start budgeting", R("你坚持了三个月，第一次存下了钱。|You lasted three months and saved money for the first time.", { money: 1000, smarts: 2 })),
      O("再办一张|Apply for another", R("快乐是暂时的，账单是永远的。|Happiness is temporary; bills are forever.", { happy: 6, money: -2000, stress: 8 }))
    ]),
    /* 幸运儿 lucky / 倒霉蛋 unlucky / 天选之子 chosen */
    TE("tl_lucky_plane", "lucky", [18, 80], "错过的航班|The Missed Flight", "✈️", "你因为堵车错过了一趟航班。|Traffic makes you miss a flight.", [
      O("改签下一班|Rebook on the next one", R("你后来才知道，那趟航班遇到了严重的颠簸，好多人受了伤。|You later learned that flight hit severe turbulence; many were hurt.", { happy: 4, luck: 3 })),
      O("干脆不去了|Don’t go at all", R("你在机场的咖啡馆里遇到了一位老同学，聊出了一个好机会。|At the airport café you met an old classmate — and a great opportunity.", { perf: 6, happy: 4 }))
    ]),
    TE("tl_lucky_found", "lucky", [10, 80], "捡到的东西|A Lucky Find", "🍀", "你在公园的长椅缝里捡到了一张刮刮乐。|You find a scratch card in the gap of a park bench.", [
      O("刮开|Scratch it", RC(.4, "中了！不多，但够请朋友们吃一顿好的。|A winner! Not much, but enough for a feast with friends.", { money: 500, happy: 8 }, "没中。但那天阳光特别好。|Nothing. But the sunshine was lovely.", { happy: 2 })),
      O("交给公园管理处|Hand it to the park office", R("管理员笑着说：“你真是个好人。”|The keeper smiled: “You’re a good person.”", { karma: 3 }))
    ]),
    TE("tl_unlucky_day", "unlucky", [10, 80], "倒霉的一天|A Truly Unlucky Day", "☔", "今天你被鸟屎砸中、踩进了水坑、手机掉进了马桶。|Today a bird got you, you stepped in a puddle, and your phone fell in the toilet.", [
      O("哈哈大笑|Burst out laughing", R("你把这一天写成了段子，朋友们笑疯了。|You turned it into a comic story; your friends howled.", { happy: 6, eq: 3 })),
      O("回家躺着，什么都不做|Go home and do nothing", R("躺着的时候，床塌了。|While you lay there, the bed collapsed.", { happy: -4 }))
    ]),
    TE("tl_chosen_dream", "chosen", [15, 70], "奇怪的梦|A Strange Dream", "✨", "你连续三晚梦到同一串数字。|Three nights running you dream of the same string of numbers.", [
      O("用这串数字买彩票|Play them in the lottery", RC(.15, "头奖！你成了当地新闻的主角。|Jackpot! You made the local news.", { money: 100000, happy: 20, fame: 3 }, "差一个号码。|One number off.", { happy: -2 })),
      O("把数字写下来就好|Just write them down", R("几年后你发现，那是你孩子出生那天医院的门牌号。|Years later you realised it was the hospital’s address on the day your child was born.", { eq: 3 }))
    ]),
    /* 音乐天赋 music / 演技派 actor / 艺术细胞 art */
    TE("tl_music_busk", "music", [14, 50], "街头演出|Busking", "🎻", "你在地铁站弹琴，一个西装笔挺的人停下来听了很久。|You play in a subway station; a man in a suit stops and listens for a long time.", [
      O("继续演奏|Keep playing", RC(.4, "他递给你一张名片：唱片公司制作人。|He handed you a card: record producer.", { fame: 5, sk: { music: 6 }, happy: 10 }, "他往琴盒里放了一百块，走了。|He dropped a big note in your case and left.", { money: 100, happy: 5 })),
      O("收琴回家|Pack up and go home", R("你一路哼着刚才的曲子。|You hummed the tune all the way home.", {}))
    ]),
    TE("tl_music_compose", "music", [16, 80], "一首歌|A Song", "🎼", "半夜你被一段旋律惊醒，赶紧爬起来记了下来。|A melody wakes you at midnight; you scramble to write it down.", [
      O("写完它，发到网上|Finish it and post it online", RC(.4, "这首歌在网上火了，被几百万人翻唱。|The song went viral and was covered by millions.", { fame: 8, money: 3000, happy: 12 }, "听的人不多，但有一个人留言说“谢谢你，这首歌救了我”。|Few listened, but one comment said: “Thank you, this song saved me.”", { happy: 8 })),
      O("留给自己|Keep it for yourself", R("你在孩子的摇篮边，第一次唱了它。|You sang it for the first time beside your child’s cradle.", { happy: 6 }))
    ]),
    TE("tl_actor_lie", "actor", [10, 60], "完美的谎言|A Perfect Performance", "🎭", "你需要请一天假，你的演技完美地骗过了所有人。|You need a day off, and your acting fools everyone.", [
      O("享受这一天|Enjoy the day", R("你去看了一场电影，主角演得还没你好。|You saw a film; the lead was worse than you.", { happy: 6 })),
      O("心里有点愧疚|Feel a bit guilty", R("你暗下决心，以后要把演技用在舞台上。|You resolved to save the acting for the stage.", { karma: 2, flag: "stageDream" }))
    ]),
    TE("tl_actor_audition", "actor", [16, 45], "意外的试镜|An Accidental Audition", "🎬", "你陪朋友去试镜，导演却把你叫住了：“你来读一段。”|You go along to a friend’s audition; the director calls you over: “You — read a scene.”", [
      O("读|Read", RC(.6, "你拿到了角色。朋友沉默了很久，最后说“恭喜”。|You got the part. Your friend was quiet a long time, then said “congratulations”.", { fame: 6, money: 4000, happy: 8 }, "导演说“不错”，然后选了你的朋友。|The director said “not bad” — and cast your friend.", { happy: 3 })),
      O("推辞，今天是朋友的日子|Decline — today is your friend’s day", R("朋友拿到了角色，请你吃了一顿大餐。|Your friend got the part and treated you to a feast.", { eq: 4, karma: 3 }))
    ]),
    TE("tl_art_mural", "art", [12, 60], "一面空墙|A Blank Wall", "🎨", "社区里有一面破旧的墙，居委会问有没有人愿意画点什么。|There’s a shabby wall in the neighbourhood; the residents’ committee asks if anyone will paint it.", [
      O("画一幅巨大的壁画|Paint a giant mural", R("你画了社区里每一位老人的笑脸。它成了网红打卡地。|You painted every elderly resident’s smile. It became an Instagram hotspot.", { fame: 5, karma: 5, sk: { art: 8 }, happy: 10 })),
      O("和孩子们一起画|Paint it with the kids", R("墙上全是歪歪扭扭的太阳和小狗，每个人都很喜欢。|Wobbly suns and puppies everywhere — everyone loved it.", { eq: 4, happy: 8 }))
    ]),
    /* 电竞天赋 gamer / 黑客天赋 hacker */
    TE("tl_gamer_rank", "gamer", [12, 30], "全服第一|Server Number One", "🎮", "你的游戏排名冲到了全服第一，一支职业战队私信了你。|You hit number one on the server, and a pro team messages you.", [
      O("去试训|Go to tryouts", RC(.5, "你通过了试训，成了战队最年轻的选手。|You passed and became the team’s youngest player.", { fame: 5, sk: { gamer: 10 }, happy: 10 }, "试训强度太大，你撑不住了。|The tryout pace broke you.", { happy: -4 })),
      O("继续当普通玩家|Stay an ordinary player", R("你开了一个直播间，教新手怎么玩。|You started streaming lessons for beginners.", { fame: 2 }))
    ]),
    TE("tl_hacker_bug", "hacker", [14, 50], "银行的漏洞|A Hole in the Bank", "🧑‍💻", "你无意中发现了一家大银行网站的严重漏洞，可以看到所有人的账户。|You stumble on a serious hole in a big bank’s website — you can see every account.", [
      O("匿名通知银行|Tip off the bank anonymously", R("银行修复了漏洞，还发了一笔“白帽奖金”，悬赏找你。|The bank fixed it and posted a white-hat bounty to find you.", { karma: 10, money: 2000 })),
      O("什么也不做|Do nothing", R("你关掉电脑，假装什么都没发生。|You shut the laptop and pretended nothing happened.", {})),
      O("看看自己能做什么|See what you could do", RC(.3, "你转走了一小笔钱，没人发现。|You moved a small sum. No one noticed.", { money: 5000, karma: -10 }, "银行的安全团队顺着痕迹找到了你。|The bank’s security team traced you.", { heat: 50, karma: -10 }))
    ]),
    /* 语言天才 polyglot / 领袖气质 leader */
    TE("tl_poly_tourist", "polyglot", [10, 80], "迷路的外国游客|Lost Tourists", "🗺️", "一群外国游客在街上迷路了，谁也听不懂他们说什么。|A group of foreign tourists is lost and no one understands them.", [
      O("用他们的语言帮忙|Help them in their own language", R("他们惊喜地拉着你合影，还请你去他们的国家做客。|Delighted, they took photos with you and invited you to visit.", { eq: 4, happy: 6, karma: 3 }))
    ]),
    TE("tl_poly_interpreter", "polyglot", [20, 65], "临时翻译|An Emergency Interpreter", "🌐", "一场国际谈判的翻译突然病倒了，对方老板问在场有没有人能救场。|The interpreter at an international negotiation falls ill; the boss asks if anyone can step in.", [
      O("举手|Raise your hand", RC(.7, "谈判非常成功。对方老板当场问你愿不愿意跳槽。|The talks went brilliantly. The other side’s boss asked if you’d join them.", { perf: 12, fame: 2 }, "一个专业术语你翻错了，好在对方听懂了。|You fumbled one technical term, but they got it.", { perf: 4 }))
    ]),
    TE("tl_leader_class", "leader", [10, 18], "班长|Class Monitor", "🎖️", "老师让全班投票选班长，大家都写了你的名字。|The class votes for monitor — every ballot has your name.", [
      O("认真当|Take it seriously", R("你把一个吵吵闹闹的班带成了全年级纪律最好的班。|You turned a rowdy class into the best-behaved in the year.", { eq: 5, perf: 4 })),
      O("让给更需要的同学|Hand it to a classmate who needs it", R("那个内向的同学当了班长，慢慢变得自信了。|The shy classmate took it and slowly grew confident.", { karma: 5, eq: 3 }))
    ]),
    TE("tl_leader_crisis", "leader", [22, 70], "群龙无首|A Leaderless Moment", "🧭", "一次突发事件里，所有人都慌了，下意识地看向你。|In a sudden crisis everyone panics — and instinctively looks to you.", [
      O("站出来指挥|Take charge", R("你冷静地安排好了一切。事后，大家默认你是这里的主心骨。|You calmly organised everything. Afterwards everyone treated you as the anchor.", { eq: 4, fame: 2, perf: 8 })),
      O("等专业的人来|Wait for the professionals", R("有人站了出来，但做得很乱。你有点后悔。|Someone stepped up, badly. You felt a little regret.", {}))
    ]),
    /* 赌神 gambler / 狠人 ruthless / 正义感 justice */
    TE("tl_gambler_cruise", "gambler", [18, 70], "邮轮上的赌桌|A Table on a Cruise Ship", "🎲", "邮轮上的赌场里，一位富豪向你发起挑战：一局定输赢。|In a cruise ship casino, a tycoon challenges you to a single hand.", [
      O("应战|Accept", RC(.6, "你赢了一辆跑车。|You won a sports car.", { money: 40000, fame: 2, happy: 12, gamble: 6 }, "你输掉了这趟旅行的全部预算。|You lost the trip’s whole budget.", { money: -8000, gamble: 6, happy: -6 })),
      O("见好就收|Walk away while ahead", R("你知道，赌神之所以是赌神，是因为知道什么时候不赌。|You know a master gambler is the one who knows when not to play.", { smarts: 3 }))
    ]),
    TE("tl_ruthless_choice", "ruthless", [22, 70], "一个人或一千个人|One Person or a Thousand", "🗡️", "公司要关闭一个工厂。你可以保住它，代价是把一个忠心的老部下当替罪羊。|The company will close a factory. You can save it by scapegoating a loyal old subordinate.", [
      O("牺牲他|Sacrifice him", R("工厂保住了，一千个家庭有了饭碗。他离开时没有看你一眼。|The factory stayed open; a thousand families kept their jobs. He never looked at you as he left.", { perf: 10, karma: -6 })),
      O("另想办法|Find another way", RC(.4, "你找到了一个两全的办法，所有人都保住了。|You found a way that saved everyone.", { perf: 8, karma: 6 }, "工厂还是关了。|The factory closed anyway.", { stress: 10 }))
    ]),
    TE("tl_justice_bus", "justice", [12, 80], "公交车上的咸猪手|A Groper on the Bus", "🚌", "你看见一个男人在拥挤的公交车上骚扰一个女孩。|On a crowded bus, you see a man harassing a girl.", [
      O("大声喝止|Call him out loudly", R("全车人都看向他，他在下一站被乘客们扭送给了警察。|Everyone turned; at the next stop passengers handed him to the police.", { karma: 10, fame: 1 })),
      O("站到女孩身边挡住他|Stand between them", R("女孩感激地看了你一眼。|The girl looked at you gratefully.", { karma: 6 }))
    ]),
    /* 大器晚成 late / 少年天才 prodigy / 学渣体质 slow */
    TE("tl_late_bloom", "late", [45, 75], "迟来的花期|A Late Bloom", "🌺", "五十岁这年，你突然觉得脑子比年轻时还好使。|At fifty you suddenly feel sharper than you ever did young.", [
      O("开始一件年轻时不敢做的事|Start something you never dared when young", RC(.6, "你写的第一本书成了畅销书，媒体称你为“五十岁的新人”。|Your first book became a bestseller; the press called you “the fifty-year-old debutant”.", { fame: 8, happy: 15, money: 8000 }, "没做成，但你玩得很开心。|It didn’t work out, but you had a blast.", { happy: 8 })),
      O("去读一个学位|Go back for a degree", R("你成了班上年纪最大、成绩最好的学生。|You were the oldest — and best — student in the class.", { smarts: 5, happy: 8 }))
    ]),
    TE("tl_prodigy_uni", "prodigy", [11, 15], "少年班|The Youth Gifted Class", "🎓", "一所顶尖大学的少年班向你发出邀请——你才十三岁。|A top university’s gifted youth programme invites you — at thirteen.", [
      O("去|Go", R("你成了大学里最小的学生。你常常觉得孤单，但学到了别人十年才能学到的东西。|The youngest on campus — often lonely, but you learned in two years what takes others ten.", { smarts: 8, happy: -4, flag: "youthClass" })),
      O("按部就班读完中学|Finish school the normal way", R("你有了一个正常的青春，和一群一起疯的朋友。|You had a normal youth, and friends to be wild with.", { happy: 8, eq: 4 }))
    ]),
    TE("tl_slow_teacher", "slow", [8, 17], "相信你的老师|The Teacher Who Believed", "📒", "又考砸了。新来的老师把你留下来：“我觉得你不笨，只是还没找到方法。”|Failed again. The new teacher keeps you behind: “You’re not stupid. You just haven’t found your way yet.”", [
      O("跟着老师的方法试试|Try the teacher’s methods", R("你第一次及格了。你把那张试卷贴在了床头。|You passed for the first time and pinned the test above your bed.", { perf: 15, happy: 10, smarts: 3 })),
      O("觉得自己就是不行|Believe you just can’t", R("老师叹了口气，但每周都来问你一次。|The teacher sighed — but checked in every week.", { happy: -3 }))
    ]),
    /* 乐天派 optimist / 玻璃心 sensitive */
    TE("tl_opt_layoff", "optimist", [22, 65], "被裁员的那天|The Day You Were Let Go", "🌈", "你被裁员了。走出公司大楼时，阳光很好。|You’ve been laid off. Walking out of the building, the sun is shining.", [
      O("去吃一顿大餐庆祝“新生”|Celebrate your “new life” with a feast", R("你在餐厅里认识了一个创业者，他正好缺一个合伙人。|In the restaurant you met a founder who needed a partner.", { happy: 8, perf: 6 })),
      O("回家好好睡一觉|Go home and sleep", R("第二天醒来，你已经想好了下一步。|You woke the next day with a plan.", { happy: 4 }))
    ]),
    TE("tl_sensitive_comment", "sensitive", [14, 70], "一句无心的话|A Careless Remark", "🥀", "同事随口说了一句：“你今天看起来很累。”你难过了一整天。|A colleague says offhandedly: “You look tired today.” It ruins your whole day.", [
      O("写下来，然后放下|Write it down, then let it go", R("你在本子上写满了一页，写完之后发现其实没那么严重。|You filled a page and realised it wasn’t that bad.", { eq: 4, happy: 2 })),
      O("找朋友倾诉|Talk to a friend", R("朋友说：“你太在意别人了。”你们聊到半夜。|Your friend said: “You care too much what people think.” You talked till midnight.", { happy: 6 }))
    ]),
    /* 吃货 foodie / 读心术 mind / 多子多福 fertile */
    TE("tl_foodie_hidden", "foodie", [14, 80], "藏在巷子里的老店|A Hidden Old Restaurant", "🍜", "你闻着香味找到了一家没有招牌的小店，老板说再过一个月就要关门了。|Following a smell, you find a nameless little restaurant. The owner says it closes next month.", [
      O("写一篇美食推荐|Write a food review", RC(.6, "文章火了，小店门口排起了长队，老板决定不关门了。|The post went viral, queues formed, and the owner decided to stay open.", { fame: 3, karma: 6, happy: 8 }, "文章没什么人看，但你每周都去吃。|Few read it, but you ate there every week.", { happy: 4 })),
      O("每天来吃，吃到关门|Eat there every day until it closes", R("最后一天，老板把秘方写在纸上送给了你。|On the last day the owner wrote down the secret recipe for you.", { happy: 8, sk: { cook: 6 } }))
    ]),
    TE("tl_mind_poker", "mind", [16, 70], "读懂一张脸|Reading a Face", "🧠", "谈判桌上，对方的眼睛只眨了一下，你就知道他在虚张声势。|At the negotiating table his eyes flicker once, and you know he’s bluffing.", [
      O("坚持你的条件|Hold firm on your terms", RC(.8, "他让步了。你的老板看你像看一个怪物。|He folded. Your boss looked at you like you were a wizard.", { perf: 12, money: 1000 }, "这次你读错了。|This time you misread him.", { perf: -4 })),
      O("给他留个台阶|Leave him a way out", R("他接受了，以后每次谈判都点名要找你。|He accepted, and asked for you in every negotiation after.", { eq: 4, perf: 6 }))
    ]),
    TE("tl_fertile_big", "fertile", [25, 50], "热闹的大家庭|A Big, Noisy Family", "👨‍👩‍👧‍👦", "家里的孩子多得能组一支篮球队。今天大家同时生病了。|You have enough children for a basketball team — and today they’re all sick at once.", [
      O("一个人照顾所有人|Look after them all yourself", R("你熬了一锅粥，讲了七个睡前故事。第二天你也病倒了，孩子们轮流给你端水。|One pot of porridge, seven bedtime stories. Next day you fell ill — and the kids took turns bringing you water.", { kids: 8, health: -4, happy: 6 })),
      O("请爷爷奶奶来帮忙|Call in the grandparents", R("家里热闹得像过年。|The house was as lively as New Year.", { par: 4, happy: 5 }))
    ], 1.4)
  ]);
})();
