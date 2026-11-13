/* Version 1.6 stories: every family background gets its own arc.
   Part 2: wealthy, famous, powerful and unusual families. */
(function () {
  "use strict";
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function OX(id, orgs, a, title, icon, t, o, w) {
    if (typeof orgs === "string") orgs = [orgs];
    return E(id, a, title, icon, t, o, { w: w || 2.2, if: function (S, p) { return orgs.indexOf(p.origin) >= 0 && !p.jail && (a[0] >= 18 || !p.flags.heir); } });
  }

  G.evs([
    /* ============ merchant family ============ */
    OX("ome_merch_table", "merchant", [8, 15], "生意场上的饭局|A Business Dinner", "🥢", "爸爸带你去谈生意的饭局，让你给客户敬茶。|Dad brings you to a business dinner and has you pour tea for the clients.", [
      O("落落大方地敬茶|Pour with poise", R("客户夸你“有大将之风”。回家路上爸爸给你讲了一晚上的生意经。|A client said you had “the bearing of a general”. On the way home Dad taught you business all night.", { eq: 5, par: 4 })),
      O("紧张得把茶洒了|Spill it from nerves", R("客户哈哈大笑，气氛反而轻松了。那单生意谈成了。|The client roared with laughter; the mood relaxed. The deal closed.", { happy: 3 }))
    ]),
    OX("ome_merch_crisis", "merchant", [16, 30], "资金链|The Cash Crunch", "💸", "爸爸的公司遇到资金危机。他第一次问你：“你怎么看？”|Dad’s company hits a cash crisis. For the first time he asks: “What do you think?”", [
      O("建议卖掉一部分业务保住主业|Sell a division to save the core", RC(.6, "公司活了下来。爸爸在董事会上说：“这是我孩子的主意。”|The company survived. Dad told the board: “That was my child’s idea.”", { smarts: 3, par: 10, fame: 1 }, "危机还是没挺过去，好在家底还在。|It didn’t survive the crisis, but the family fortune held.", { stress: 8 })),
      O("说你不懂|Say you don’t understand business", R("爸爸叹了口气，自己去找银行了。|Dad sighed and went to the banks alone.", {}))
    ]),
    OX("ome_merch_succession", "merchant", [25, 50], "接班|Taking Over", "🏢", "爸爸想退休，让你接手家族生意。公司里的几个老臣并不服气。|Dad wants to retire and hand you the business. The old guard isn’t convinced.", [
      O("先从基层做起|Start from the bottom", R("你在仓库干了一年，老员工们开始叫你的名字，而不是“少东家”。|A year in the warehouse, and the old staff started using your name instead of “the boss’s kid”.", { eq: 6, perf: 10, money: 20000 })),
      O("直接上任，大刀阔斧|Take the top job and shake things up", RC(.5, "改革成功，利润翻了一倍。|Your reforms worked; profits doubled.", { money: 60000, fame: 3 }, "两位元老带着客户出走了。|Two veterans walked out with their clients.", { money: -20000, stress: 12 }))
    ]),

    /* ============ celebrity family ============ */
    OX("oce_celeb_paparazzi", "celebrity", [5, 12], "镜头|The Lenses", "📸", "放学时，校门口蹲着一群狗仔。他们想拍明星的孩子。|After school, paparazzi crowd the gate hoping to snap the star’s kid.", [
      O("躲进保姆怀里|Hide in the nanny’s arms", R("妈妈第二天发了一条声明：请放过孩子。全网都在支持她。|The next day Mum posted: leave my child alone. The internet rallied behind her.", { par: 6 })),
      O("对着镜头做鬼脸|Pull a face at the cameras", R("你的鬼脸成了全网最火的表情包。|Your face became the internet’s favourite meme.", { fame: 6, happy: 4 }))
    ]),
    OX("oce_celeb_debut", "celebrity", [14, 20], "星二代出道|The Star Kid’s Debut", "🎤", "经纪公司想让你出道，所有人都说“稳红”。也有人在网上骂你“靠爹妈”。|An agency wants you to debut — “guaranteed stardom”. Online, people sneer that you’re riding on your parents.", [
      O("出道，用作品说话|Debut and let the work speak", RC(function (c) { return .35 + c.p.st.looks / 250; }, "你的第一部作品口碑很好，骂声渐渐少了。|Your first project was well received; the jeers faded.", { fame: 12, money: 8000, happy: 8 }, "作品扑了，“星二代”的标签贴得更牢了。|It flopped, and the label stuck even harder.", { fame: 4, happy: -8 })),
      O("隐姓埋名去读书|Study under a different name", R("大学四年，没有一个同学知道你是谁。那是你最自由的四年。|Four years at university and no one knew who you were. The freest years of your life.", { happy: 8, smarts: 3 }))
    ]),
    OX("oce_celeb_scandal", "celebrity", [16, 45], "父母的丑闻|Your Parent’s Scandal", "📰", "爸爸被曝出轨，全网都在骂。记者堵在你家门口。|Dad’s affair is exposed and the whole internet is furious. Reporters block your door.", [
      O("发声支持妈妈|Speak up for Mum", R("妈妈抱着你说：“妈妈没事。”|Mum held you: “I’m all right.”", { par: 6, fame: 2 })),
      O("什么也不说|Say nothing", R("一个月后热度散了。你家的饭桌上却再也没有人说话。|In a month the furore died. Your family dinner table stayed silent.", { stress: 10 }))
    ]),

    /* ============ red / political family ============ */
    OX("ored_courtyard", "red", [6, 13], "大院|The Compound", "🏯", "你在一个有警卫站岗的大院里长大。院里的孩子们分成了两派，在打雪仗。|You grow up in a guarded compound. The children have split into two sides for a snowball fight.", [
      O("当一派的头头|Lead one side", R("你们赢了。多年后，当年跟着你的孩子很多都成了重要人物。|You won. Years later many of those kids became important people.", { eq: 5, flag: "compoundGang" })),
      O("两派都不加入，堆雪人|Join neither — build a snowman", R("一个老人站在窗边看了你很久。后来你知道，那是一位老将军。|An old man watched from a window. Later you learned he was a famous general.", { happy: 5 }))
    ]),
    OX("ored_grandpa", "red", [10, 18], "爷爷的故事|Grandpa’s Stories", "📜", "爷爷给你讲他年轻时打仗的故事，讲到一半停下来，说起了一个牺牲的战友。|Grandpa tells war stories, stops halfway, and speaks of a comrade who died.", [
      O("认真听完|Listen to the end", R("爷爷说：“我们这条命是捡来的，要对得起他们。”你记了一辈子。|Grandpa said: “Our lives were borrowed. Live up to them.” You remembered it forever.", { eq: 5, karma: 5 })),
      O("问爷爷那个战友的家人在哪|Ask where the comrade’s family is", R("爷爷带你去看了那位战友的女儿，她已经很老了。|Grandpa took you to visit the comrade’s daughter, by then very old.", { karma: 6, eq: 3 }))
    ]),
    OX("ored_temptation", "red", [22, 55], "递过来的名片|A Card Slipped Across", "🃏", "一个商人通过朋友找到你，说只要你“打个招呼”，就送你一套别墅。|A businessman reaches you through a friend: put in “a word” and a villa is yours.", [
      O("当场拒绝|Refuse on the spot", R("爷爷知道后，拍了拍你的肩膀。|When Grandpa heard, he patted your shoulder.", { karma: 10, par: 4 })),
      O("收下|Accept", RC(.5, "别墅过户到了你的名下。|The villa was put in your name.", { money: 500000, karma: -15 }, "那个商人后来出了事，把你也供了出来。|The businessman was later caught — and gave up your name.", { karma: -15, fame: -10, stress: 30 }))
    ]),

    /* ============ tycoon / richest ============ */
    OX("oty_birthday", ["tycoon", "richest"], [6, 12], "生日派对|The Birthday Party", "🎂", "你的十岁生日派对请了一支乐队、一个马戏团和全班同学。可你最好的朋友没来——她家里穷，买不起礼物。|Your tenth birthday has a band, a circus and the whole class. But your best friend didn’t come — she couldn’t afford a present.", [
      O("去她家找她|Go to her house", R("你们在她家的小阳台上分吃了一块蛋糕。那是你最快乐的一个生日。|You shared a slice of cake on her tiny balcony. It was your happiest birthday.", { happy: 10, eq: 5, karma: 4 })),
      O("继续派对|Carry on with the party", R("派对很热闹，你却总想着那个空位子。|The party was loud, but you kept thinking of the empty seat.", { happy: 2 }))
    ]),
    OX("oty_kidnap_scare", ["tycoon", "richest"], [8, 16], "陌生的车|An Unfamiliar Car", "🚙", "放学时，一辆陌生的车停在你身边：“你爸爸让我们来接你。”|After school a strange car pulls up: “Your father sent us to pick you up.”", [
      O("说出家里的暗号考验他们|Ask for the family code word", R("他们答不上来，开车跑了。你的保镖赶到后脸都白了。|They couldn’t answer and sped off. Your bodyguard went white when he arrived.", { smarts: 4, stress: 8 })),
      O("转身跑回学校|Run back into school", R("警察第二天抓到了一个绑架团伙。|Police caught a kidnapping ring the next day.", { stress: 6 }))
    ]),
    OX("oty_prenup", ["tycoon", "richest", "oil", "shipping", "casino", "luxury"], [24, 45], "婚前协议|The Prenup", "📑", "家族律师递给你一份婚前协议，让你的未婚伴侣签字。|The family lawyer hands you a prenup for your fiancé(e) to sign.", [
      O("坚持要签|Insist on it", RC(.6, "伴侣签了，说：“我爱的又不是你的钱。”|Your partner signed: “It was never your money I loved.”", { part: 4, smarts: 2 }, "伴侣哭着说你不信任ta，婚礼推迟了。|Your partner cried that you didn’t trust them; the wedding was postponed.", { part: -15, stress: 10 })),
      O("撕掉，我相信ta|Tear it up — you trust them", R("家族长辈们很不高兴，但伴侣那天看你的眼神，你记了很久。|The elders were furious, but the way your partner looked at you that day stayed with you.", { part: 15, par: -6 }))
    ]),
    OX("oty_philanthropy", ["tycoon", "richest"], [35, 80], "裸捐|Giving It All Away", "🤲", "你开始思考：要把多少财富留给孩子？|You start to wonder: how much wealth should you leave your children?", [
      O("捐出一半成立基金会|Put half into a foundation", R("基金会资助了一万个孩子上学。你的孩子说：“我为你骄傲。”|The foundation put ten thousand children through school. Your child said: “I’m proud of you.”", { karma: 20, fame: 10, kids: 4 })),
      O("全部留给孩子|Leave it all to the kids", R("你给每个孩子都设立了信托。|You set up a trust for each child.", { kids: 2 }))
    ]),

    /* ============ noble / royal ============ */
    OX("ono_ball", ["noble", "royal"], [16, 22], "成年舞会|The Debutante Ball", "💃", "家族为你举办了成年舞会，全欧洲的名门子弟都来了。|The family throws your coming-out ball; scions of great houses from all over attend.", [
      O("和最英俊/美丽的那位跳第一支舞|Dance the first with the most striking guest", function (c) { var n = N.mkRomantic({ tags: ["noble"], love: 40, aff: 30 }); n.rel = "crush"; n.pin = 1; n.looks = Math.max(n.looks, 88); c.prm.n = n.name; H.fx(c, { happy: 10, fame: 2 }); return G.L("{n}在你耳边说：“我等这支舞等了一整晚。”|{n} whispered: “I waited all night for this dance.”", { n: n.name }); }),
      O("溜出去和侍者聊天|Slip out to chat with the waiters", R("你在厨房里度过了舞会最开心的一小时。|You spent the happiest hour of the ball in the kitchen.", { happy: 6, eq: 3 }))
    ]),
    OX("ono_estate", ["noble"], [30, 70], "庄园的屋顶|The Manor Roof", "🏰", "家族庄园的屋顶漏水了，修缮要花一大笔钱。有人建议开放给游客参观。|The family manor’s roof is leaking and repairs cost a fortune. Someone suggests opening it to tourists.", [
      O("开放参观|Open to visitors", RC(.7, "游客络绎不绝，你还在大厅里办起了婚礼生意。|Visitors flocked in, and you started hosting weddings in the great hall.", { money: 30000, fame: 3 }, "游客寥寥无几。|Hardly anyone came.", { money: -5000 })),
      O("卖掉一幅祖传名画|Sell an ancestral painting", R("屋顶修好了。你常常看着墙上那块颜色更深的空白。|The roof was fixed. You often stare at the darker patch on the wall.", { money: 20000, happy: -3 }))
    ]),

    /* ============ mafia ============ */
    OX("oma_mafia_dinner", "mafia", [8, 15], "家族晚宴|The Family Dinner", "🍝", "叔叔们在晚宴上谈论“生意”。一个叔叔突然被叫出去，再也没回来。|At dinner your uncles talk “business”. One is called outside and never comes back.", [
      O("问爸爸叔叔去哪了|Ask Dad where Uncle went", R("爸爸说：“他去了很远的地方。”从那天起，你不再问问题了。|Dad said: “Somewhere far away.” From that day on, you stopped asking questions.", { eq: 4, stress: 10 })),
      O("假装什么都没看见|Pretend you saw nothing", R("那天晚上，你第一次失眠。|That night you couldn’t sleep for the first time.", { stress: 8 }))
    ]),
    OX("oma_mafia_out", "mafia", [18, 30], "离开的机会|A Way Out", "🚪", "你考上了一所远方的大学。爸爸说：“去吧，别回来。这里的事，不该是你的。”|You get into a faraway university. Dad says: “Go. Don’t come back. This life isn’t meant for you.”", [
      O("离开|Leave", R("你换了一个姓氏，开始了干净的生活。每年生日，你都会收到一张没有署名的卡片。|You changed your surname and started a clean life. Every birthday, an unsigned card arrived.", { happy: 6, karma: 6, flag: "mafiaOut" })),
      O("留下，帮爸爸|Stay and help Dad", R("爸爸看了你很久，把一串钥匙交给了你。|Dad looked at you a long time, then handed you a ring of keys.", { par: 8, karma: -6, flag: "mafiaIn" }))
    ]),
    OX("oma_mafia_vendetta", "mafia", [25, 60], "仇家|The Old Enemy", "🌹", "家族的老仇家找上门来，提出“了结恩怨”的条件。|The family’s old enemy comes calling, offering terms to end the feud.", [
      O("和谈|Make peace", RC(.55, "两家握手言和。那年冬天，两个家族的孩子一起滑了雪。|The families shook hands. That winter, both families’ children went skiing together.", { karma: 8, stress: -10 }, "和谈是个陷阱。你侥幸逃过一劫。|The talks were a trap. You barely escaped.", { health: -15, stress: 20 })),
      O("拒绝|Refuse", R("你加强了保镖。日子照常，但你再也没在窗边坐过。|You doubled your guards. Life went on, but you never sat by a window again.", { stress: 12 }))
    ]),

    /* ============ oil / luxury / shipping (more) ============ */
    OX("ooil_spill", "oil", [25, 65], "漏油事故|The Spill", "🛢️", "家族的一座海上钻井平台发生了漏油，海鸟浑身是油的照片传遍了全世界。|One of the family’s offshore rigs leaks; photos of oil-soaked seabirds circle the world.", [
      O("亲自去现场，承担全部责任|Go there and take full responsibility", R("你蹲在海滩上帮志愿者清理海鸟的照片，改变了很多人对家族的看法。|A photo of you on the beach cleaning birds beside volunteers changed many minds.", { karma: 10, fame: 4, money: -100000 })),
      O("交给公关公司|Leave it to the PR firm", R("风波平息了，但家族的名声从此和那张照片连在了一起。|It blew over, but the family name was tied to that photo for ever.", { karma: -6, fame: -3 }))
    ]),
    OX("olux_atelier", "luxury", [8, 14], "工坊里的老匠人|The Old Craftsman", "🧵", "你在家族的手工工坊里，看一位老匠人缝了一整天的一个包。|In the family workshop you watch an old craftsman spend a whole day stitching one bag.", [
      O("求他教你|Beg him to teach you", R("他教了你三年。你缝的第一个钱包，奶奶一直用到去世。|He taught you for three years. Grandma used the first wallet you stitched until she died.", { sk: { art: 10 }, eq: 3, flag: "craftsman" })),
      O("问他为什么不用机器|Ask why he doesn’t use a machine", R("他说：“机器做出来的，没有心。”|He said: “A machine’s work has no heart.”", { smarts: 2 }))
    ]),
    OX("oship_grandpa", "shipping", [6, 12], "爷爷的第一条船|Grandpa’s First Boat", "⛵", "爷爷带你去看他年轻时开的那条小木船，它被保存在家族博物馆里。|Grandpa shows you the little wooden boat he sailed as a young man, preserved in the family museum.", [
      O("问他第一次出海的故事|Ask about his first voyage", R("他说那次差点沉船，是一个渔民救了他。家族至今每年都给那个渔村捐钱。|He nearly sank; a fisherman saved him. The family still gives to that village every year.", { eq: 4, karma: 3 })),
      O("说你也想当船长|Say you want to be a captain", R("爷爷大笑，把他的旧船长帽戴在了你头上。|Grandpa laughed and put his old captain’s cap on your head.", { happy: 6 }))
    ]),

    /* ============ old brand / space / tech / banking / hotels ============ */
    OX("oob_recipe", "oldbrand", [10, 18], "秘方|The Secret Recipe", "🫙", "家族百年老字号的秘方只传一个人。爷爷说：“等你十八岁，我告诉你。”|The century-old family recipe passes to one person only. Grandpa says: “When you’re eighteen, I’ll tell you.”", [
      O("每天去后厨帮忙|Help in the kitchen every day", R("十八岁生日那天，爷爷把你叫进了小黑屋。秘方简单得让你笑了出来。|On your eighteenth birthday Grandpa called you into the back room. The secret was so simple you laughed.", { flag: "recipe", par: 6, happy: 6 })),
      O("觉得老字号太土了|Think the old brand is too old-fashioned", R("爷爷没说什么，只是叹了口气。|Grandpa said nothing — just sighed.", { par: -3 }))
    ]),
    OX("oob_buyout", "oldbrand", [25, 60], "外资收购|A Foreign Buyout", "🏷️", "一家跨国集团出高价想收购你家的老字号。|A multinational offers a fortune for the family’s old brand.", [
      O("卖|Sell", R("钱很多。三年后，那个牌子的味道变了，老顾客都说“不是那个味儿了”。|A lot of money. Three years later the taste had changed; old customers said it wasn’t the same.", { money: 300000, happy: -6 })),
      O("不卖，自己做大|Refuse — grow it yourselves", RC(.5, "你把老字号开到了全国，还上了国潮榜单。|You took the brand nationwide; it topped the “heritage cool” charts.", { money: 80000, fame: 6, happy: 10 }, "扩张太快，资金链断了一次，好在挺了过来。|You expanded too fast and nearly ran out of cash, but survived.", { stress: 12 }))
    ]),
    OX("osp_launch", "space", [6, 14], "发射场|The Launch Site", "🚀", "妈妈是航天工程师。你第一次被允许在发射场看火箭升空。|Mum is an aerospace engineer. For the first time you’re allowed to watch a launch on site.", [
      O("捂住耳朵大喊|Cover your ears and scream", R("火箭消失在云层里。妈妈的眼睛是湿的，她说：“那上面有我的螺丝。”|The rocket vanished into cloud. Mum’s eyes were wet: “Some of my bolts are up there.”", { happy: 10, smarts: 3, par: 6 })),
      O("一直盯着控制室|Watch the control room instead", R("你看见一屋子大人在火箭入轨时同时站起来欢呼。你决定将来也要坐在那里。|You saw a room of adults leap up cheering at orbit. You decided you’d sit there one day.", { smarts: 5, flag: "spaceDream" }))
    ]),
    OX("osp_astronaut", "space", [22, 45], "航天员选拔|Astronaut Selection", "👨‍🚀", "国家开始招募新一批航天员，你符合所有条件。|A new astronaut intake is announced, and you meet every requirement.", [
      O("报名|Apply", RC(function (c) { return .1 + c.p.st.health / 300 + c.p.st.smarts / 400; }, "你通过了所有考核。三年后，你在太空里给妈妈打了一个电话。|You passed everything. Three years later you called Mum from space.", { fame: 20, happy: 20, flag: "astronaut" }, "你在最后一轮被刷了下来。妈妈说：“能走到这一步，已经很了不起。”|You were cut in the final round. Mum said: “Getting this far is remarkable.”", { happy: -6 })),
      O("算了|Not for me", R("你在地面上为别人造火箭。|You built rockets for others from the ground.", {}))
    ]),
    OX("otech_ipo", "techfam", [8, 16], "敲钟的那天|The Day of the Bell", "🔔", "爸爸的公司上市了。你在交易所里看着他敲钟，屏幕上的数字一直在跳。|Dad’s company goes public. You watch him ring the bell as the numbers jump on the screens.", [
      O("问爸爸“我们是不是很有钱了”|Ask if you’re rich now", R("爸爸蹲下来：“钱是工具。你想用它做什么？”|Dad crouched: “Money is a tool. What would you do with it?”", { eq: 4, smarts: 2 })),
      O("问爸爸能不能也写个程序|Ask if you can write a program too", R("那天晚上，爸爸教你写了第一行代码。|That night Dad taught you your first line of code.", { smarts: 5, sk: { code: 8 }, par: 5 }))
    ]),
    OX("otech_disrupt", "techfam", [25, 55], "被颠覆|Disrupted", "📱", "一个大学生做的小产品，正在抢走爸爸公司的用户。|An app built by a college student is stealing users from Dad’s company.", [
      O("建议收购那个学生的公司|Suggest buying the student’s company", RC(.6, "收购完成。那个学生后来成了你最好的合伙人。|The deal closed; the student became your best business partner.", { money: 50000, smarts: 3 }, "学生拒绝了，三年后他的公司比你们还大。|The student refused; three years later his company was bigger than yours.", { stress: 10 })),
      O("内部孵化一个竞品|Build a rival in-house", R("新产品做得中规中矩。|The rival product was respectable.", {}))
    ]),
    OX("obank_crash", "banker", [10, 20], "金融危机|The Financial Crisis", "🏦", "一场金融危机来了。爸爸三天没回家，回来时头发白了一半。|A financial crisis hits. Dad doesn’t come home for three days; when he does, half his hair is grey.", [
      O("给他泡一杯茶|Make him tea", R("他捧着茶说：“记住，永远不要借你还不起的钱。”|Holding the cup he said: “Never borrow what you can’t repay.”", { smarts: 3, par: 6 })),
      O("问他会不会破产|Ask if you’ll go bankrupt", R("他笑了：“你爸爸是做风险管理的。”|He laughed: “Your dad manages risk for a living.”", { stress: -3 }))
    ]),
    OX("ohotel_guest", "hotelier", [8, 16], "总统套房的客人|The Presidential Suite", "🏨", "你在自家酒店的走廊里撞见了一位世界知名的歌手，她正躲着粉丝。|In the corridor of your family’s hotel you run into a world-famous singer hiding from fans.", [
      O("带她从员工通道离开|Lead her out through the staff passage", R("她给你签了一张专辑，还写了一句：“谢谢我的小救星。”|She signed an album: “To my little rescuer.”", { happy: 10, eq: 3 })),
      O("找她要签名|Ask for an autograph", R("她笑着签了，然后被粉丝发现了。|She signed, smiling — and then the fans found her.", { happy: 5 }))
    ]),
    OX("ohotel_strike", "hotelier", [25, 55], "员工罢工|The Staff Walkout", "🧹", "旗舰酒店的清洁工罢工了，要求涨工资。一个国际会议明天开幕。|Cleaners at the flagship hotel strike for better pay — the day before a major international summit.", [
      O("亲自和她们谈，答应涨薪|Negotiate in person and agree to a raise", R("会议顺利召开。清洁工们后来成了酒店最忠诚的员工。|The summit went smoothly; the cleaners became the hotel’s most loyal staff.", { karma: 8, money: -10000, eq: 3 })),
      O("临时从劳务公司调人|Bring in agency staff", R("会议勉强办完，客人投诉不断。|The summit limped through amid complaints.", { stress: 8 }))
    ]),

    /* ============ spy family / casino / circus / lottery / detective (more) ============ */
    OX("osf_parents_trip", "spyfam", [10, 16], "爸妈的“出差”|Mum and Dad’s “Business Trip”", "✈️", "爸妈说去出差一周，但电视新闻里，你在一个遥远国家的抗议人群中看到了妈妈。|Your parents say it’s a week’s business trip — but on TV you spot Mum in a protest crowd in a distant country.", [
      O("什么也不说|Say nothing", R("妈妈回来时带了一盒当地的巧克力。她看着你的眼睛，你也看着她。谁都没说话。|Mum came back with chocolates from there. She looked into your eyes; you looked back. Neither spoke.", { eq: 5, smarts: 3 })),
      O("录下来给妈妈看|Record it to show her", R("妈妈看完，把录像删了，抱了你很久。|She watched, deleted it, and held you a long time.", { par: 6, stress: 4 }))
    ]),
    OX("ocas_cheat", "casino", [18, 40], "老千|The Card Sharp", "🎲", "监控发现一个赌客赢得太离谱了。经理问你怎么处理。|Surveillance flags a gambler who is winning impossibly. The manager asks you what to do.", [
      O("请他喝一杯，客客气气地送走|Buy him a drink and politely see him out", R("他后来成了你的顾问，帮你抓了很多老千。|He later became your consultant and caught many cheats for you.", { smarts: 3, eq: 3 })),
      O("报警|Call the police", R("警方破获了一个职业老千团伙。|Police broke up a professional cheating ring.", { karma: 3 }))
    ]),
    OX("ocir_lion", "circus", [10, 18], "老狮子|The Old Lion", "🦁", "马戏团的老狮子太老了，不能再表演了。团长说要把它卖掉。|The circus lion is too old to perform. The ringmaster wants to sell it.", [
      O("求团长把它送到动物保护区|Beg him to send it to a sanctuary", R("你们凑钱把它送去了保护区。你每年都去看它，直到它去世。|You all chipped in to send it to a sanctuary. You visited every year until it died.", { karma: 8, happy: 4 })),
      O("偷偷每天多喂它一块肉|Secretly feed it extra every day", R("它最后的日子里，总是把头靠在你的手上。|In its last days it always rested its head on your hand.", { eq: 4 }))
    ]),
    OX("olot_again", "lottery", [25, 60], "又买了一张|Another Ticket", "🎟️", "爸爸又开始每周买彩票了，说“运气还会再来”。|Dad has started buying lottery tickets every week again. “Luck strikes twice,” he says.", [
      O("劝他别买了|Persuade him to stop", R("他嘴上答应，口袋里还是揣着一张。|He agreed — and still kept a ticket in his pocket.", { par: 2 })),
      O("陪他一起买一张|Buy one with him", RC(.05, "又中了！虽然只是三等奖，你们笑得像个傻子。|Won again! Only third prize, but you laughed like idiots.", { money: 5000, happy: 12 }, "没中。你们去吃了一碗面。|Nothing. You went for noodles together.", { par: 4 }))
    ]),
    OX("odet_case", "detective", [18, 35], "第一个委托|Your First Client", "🕵️", "爸爸让你独立处理一个委托：一位妻子怀疑丈夫出轨。|Dad lets you handle a case alone: a wife suspects her husband is cheating.", [
      O("认真跟踪调查|Investigate properly", RC(.6, "真相是：丈夫在偷偷学跳舞，想在结婚纪念日给她一个惊喜。|The truth: he was secretly taking dance lessons for their anniversary.", { happy: 8, smarts: 3, money: 500 }, "他真的出轨了。你把照片交给她的时候，手在抖。|He really was. Your hand shook as you handed her the photos.", { eq: 4, money: 500 })),
      O("觉得这种活没意思|Find it beneath you", R("爸爸说：“侦探的工作，就是替人看清真相。”|Dad said: “A detective’s job is to help people see the truth.”", {}))
    ]),
    OX("odet_cold", "detective", [30, 70], "二十年前的悬案|A Twenty-Year-Old Case", "🗂️", "整理爸爸的遗物时，你发现了一个他到死都没破的案子。|Going through Dad’s things, you find a case he never solved.", [
      O("接着查下去|Pick up where he left off", RC(.4, "你用新的技术找到了真凶。你在爸爸的墓前读了结案报告。|With new technology you found the culprit. You read the closing report at Dad’s grave.", { fame: 6, happy: 10, smarts: 3 }, "线索还是断了。你把卷宗留给了你的孩子。|The trail went cold again. You left the file for your child.", { stress: 4 })),
      O("交给警方|Hand it to the police", R("警方重启了调查。|The police reopened the case.", { karma: 3 }))
    ])
  ]);
})();
