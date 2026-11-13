/* Version 1.6 stories: the holidays of every country, and the people who matter — brothers and sisters,
   best friends, grandparents, first loves, old teachers, the ex you run into twenty years later. */
(function () {
  "use strict";
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function CE(id, cs, a, title, icon, t, o, w) { if (typeof cs === "string") cs = [cs]; return E(id, a, title, icon, t, o, { w: w || 1.6, if: function (S, p) { return cs.indexOf(p.country) >= 0 && !p.jail; } }); }
  function pickRel(rels, f) { var L = N.rel.apply(N, rels).filter(function (n) { return n.alive && (!f || f(n)); }); return L.length ? G.pick(L) : null; }
  function NE(id, rels, a, title, icon, t, o, f, w) {
    return E(id, a, title, icon, t, o, { w: w || 1.8, if: function () { return !!pickRel(rels, f); }, prep: function (c) { var n = pickRel(rels, f); if (!n) return false; c.npc = n; c.prm.n = n.name; } });
  }

  G.evs([
    /* ======================= holidays ======================= */
    CE("hol_cn_spring", "cn", [3, 100], "春节|Spring Festival", "🧧", "除夕夜，全家围坐在一起包饺子。今年谁能吃到包着硬币的那个？|New Year’s Eve: the family gathers to make dumplings. Who will bite the one with the coin this year?", [
      O("偷偷做个记号|Secretly mark the coin dumpling", R("你吃到了硬币，奶奶笑着说“明年发大财”。全家都知道你作弊了，谁也没拆穿。|You got the coin; Grandma said “riches next year”. Everyone knew you’d cheated; nobody said.", { happy: 8, par: 3 })),
      O("认真包，听天由命|Fold carefully and leave it to fate", RC(.3, "硬币硌了你的牙，全家欢呼。|The coin hit your tooth and the whole family cheered.", { happy: 10, money: 20 }, "爷爷吃到了硬币，开心得像个孩子。|Grandpa got it and was as happy as a child.", { happy: 5, par: 3 })),
      O("给长辈拜年，收红包|Bow to the elders and collect red envelopes", R("你收了一叠红包，妈妈说“替你存着”。你知道那是什么意思。|A stack of red envelopes — “I’ll keep them safe for you,” said Mum. You knew what that meant.", { money: 60, happy: 4 }))
    ]),
    CE("hol_cn_midautumn", "cn", [4, 100], "中秋|Mid-Autumn Festival", "🥮", "中秋夜，月亮又大又圆。家里只剩你一个人在外地。|Mid-Autumn night, the moon huge and full — and you’re far from home.", [
      O("给爸妈打视频电话|Video-call your parents", R("妈妈把手机举向窗外：“你看，我们看的是同一个月亮。”|Mum held the phone to the window: “Look — it’s the same moon.”", { par: 6, happy: 4 })),
      O("请同样回不了家的同事一起赏月|Invite colleagues who also can’t go home", R("你们在楼顶分吃了一盒月饼，聊到很晚。|You shared a box of mooncakes on the roof and talked late.", { eq: 3, happy: 5 }))
    ], 1.2),
    CE("hol_cn_dragon", "cn", [6, 70], "端午龙舟|Dragon Boat Day", "🐉", "村里的龙舟队少一个桨手，队长看中了你。|The village dragon-boat team is one paddler short, and the captain picks you.", [
      O("上船！|Get in!", RC(.5, "你们赢了！全队跳进河里庆祝。|You won! The whole crew jumped in the river to celebrate.", { health: 4, happy: 10, fame: 1 }, "你们得了第三，你的胳膊疼了一周。|Third place; your arms ached for a week.", { health: 2, happy: 4 })),
      O("在岸边敲鼓加油|Drum from the bank", R("你的鼓点被村里人夸了好多年。|People praised your drumming for years.", { happy: 5 }))
    ]),
    CE("hol_us_thanks", "us", [4, 100], "感恩节|Thanksgiving", "🦃", "感恩节晚餐上，舅舅又开始谈论政治，饭桌上的气氛越来越紧张。|At Thanksgiving dinner your uncle starts on politics again; the table grows tense.", [
      O("提议大家轮流说一件感恩的事|Suggest everyone share something they’re thankful for", R("轮到奶奶时，她说：“感谢你们都还愿意坐在一张桌子上。”大家都笑了。|When it was Grandma’s turn she said: “I’m thankful you all still sit at one table.” Everyone laughed.", { eq: 5, happy: 6 })),
      O("和舅舅辩论|Debate your uncle", RC(.3, "你说得舅舅哑口无言，表弟偷偷给你比了个大拇指。|You left him speechless; your cousin flashed a thumbs-up.", { smarts: 2, happy: 3 }, "吵到最后，火鸡都凉了。|By the end, the turkey was cold.", { stress: 6 }))
    ]),
    CE("hol_us_july4", "us", [4, 90], "独立日|The Fourth of July", "🎆", "社区在湖边放烟花，邻居们支起了烧烤架。|Fireworks over the lake; neighbours fire up their grills.", [
      O("帮邻居烤汉堡|Help flip burgers", R("你认识了一半的邻居，还被拉进了社区垒球队。|You met half the street and got roped into the softball team.", { eq: 3, happy: 6 })),
      O("和家人躺在草地上看烟花|Lie on the grass with family", R("最大的那朵烟花炸开时，你的孩子抓紧了你的手。|When the biggest firework burst, your child squeezed your hand.", { happy: 8, kids: 3 }))
    ]),
    CE("hol_jp_hanami", "jp", [4, 100], "花见|Cherry Blossom Viewing", "🌸", "公司的赏樱会，新人要一早去公园占位置。今年轮到你。|The office cherry-blossom party: the newest hire must stake out a spot at dawn. This year that’s you.", [
      O("五点就去铺好垫子|Lay the mat out at 5 a.m.", R("你占到了最好的位置，部长在酒会上点名表扬了你。|You got the best spot; the department head praised you by name.", { perf: 4, eq: 2, happy: 3 })),
      O("一个人在樱花树下吃便当|Eat a bento alone under the blossoms", R("花瓣落在饭盒里。那一刻你觉得很安静。|Petals fell into your lunch. For a moment, everything was still.", { happy: 6, stress: -6 }))
    ]),
    CE("hol_jp_obon", "jp", [5, 100], "盂兰盆节|Obon", "🏮", "盂兰盆节，全家回到乡下扫墓，晚上跳盆舞。|Obon: the family returns to the countryside to tend graves, then dances the bon-odori at night.", [
      O("跟着大家一起跳|Join the dance", R("你跳错了好几个动作，旁边的老奶奶笑着手把手教你。|You missed half the steps; an old lady laughed and taught you hand over hand.", { happy: 6, eq: 2 })),
      O("在河边放灯笼|Float a lantern on the river", R("你在灯笼上写了一个已故亲人的名字，看着它漂远。|You wrote a lost relative’s name on it and watched it drift away.", { eq: 4 }))
    ]),
    CE("hol_kr_chuseok", "kr", [4, 100], "中秋节|Chuseok", "🌕", "秋夕，全家回到大伯家准备祭祀，厨房里堆满了要煎的饼。|Chuseok: the family gathers at your uncle’s to prepare the ancestral rites, and the kitchen is piled with pancakes to fry.", [
      O("主动帮忙煎饼|Help fry the jeon", R("姑姑们夸你懂事，偷偷多给了你零用钱。|Your aunts praised you and slipped you extra money.", { money: 50, eq: 3 })),
      O("被亲戚追问工作和婚事|Get grilled about job and marriage", R("你逃到院子里，和堂兄弟一起吐槽。|You escaped to the yard to vent with your cousins.", { stress: 6, happy: 2 }))
    ]),
    CE("hol_gb_bonfire", "gb", [5, 90], "篝火之夜|Bonfire Night", "🔥", "十一月五日，镇上的人围着大篝火看烟花，空气里都是烤土豆的味道。|5 November: the town gathers round a huge bonfire, the air smelling of baked potatoes.", [
      O("用仙女棒在空中写名字|Write your name in the air with a sparkler", R("你写了喜欢的人的名字，被朋友们起哄了一整晚。|You wrote your crush’s name and your friends teased you all night.", { happy: 7 })),
      O("帮志愿者维持秩序|Help the volunteers keep order", R("你捡到了一个走丢的小孩，帮他找到了妈妈。|You found a lost child and reunited him with his mum.", { karma: 5, happy: 3 }))
    ]),
    CE("hol_xmas", ["gb", "us", "de", "fr", "au", "ca", "it", "es", "ie", "nz", "at", "ch", "pt", "ar", "br", "mx", "za"], [3, 100], "圣诞节|Christmas", "🎄", "圣诞前夜，全家围着圣诞树拆礼物。|Christmas Eve, unwrapping presents round the tree.", [
      O("送出你亲手做的礼物|Give a present you made yourself", R("妈妈把你做的东西放在了壁炉最显眼的位置。|Mum put your gift in the most prominent place on the mantel.", { par: 6, happy: 6 })),
      O("扮成圣诞老人|Dress up as Santa", R("孩子们尖叫着扑向你，胡子被扯掉了一半。|The children shrieked and tackled you; half your beard came off.", { happy: 8, kids: 4 })),
      O("去教堂/养老院做义工|Volunteer at a shelter or care home", R("一位老人拉着你的手说：“今年终于有人陪我过圣诞了。”|An old man held your hand: “Finally someone to spend Christmas with.”", { karma: 6, eq: 3 }))
    ], 1.3),
    CE("hol_au_beach", "au", [4, 90], "海滩上的圣诞|Christmas on the Beach", "🏖️", "南半球的圣诞节是夏天。全家在海滩上烤虾，穿着泳衣戴圣诞帽。|Christmas down under is summer: the family grills prawns on the beach in swimsuits and Santa hats.", [
      O("冲浪|Go surfing", RC(.6, "你站在浪尖上的照片成了家里的新年贺卡。|A photo of you riding a wave became the family Christmas card.", { happy: 8, health: 3 }, "你被浪拍了个跟头，喝了一肚子海水。|A wave flipped you and you swallowed half the ocean.", { happy: 2 })),
      O("堆一个沙子雪人|Build a sand snowman", R("路过的游客纷纷和它合影。|Passing tourists queued for photos with it.", { happy: 5 }))
    ]),
    CE("hol_de_oktober", "de", [18, 90], "啤酒节|Oktoberfest", "🍺", "慕尼黑啤酒节，帐篷里人声鼎沸。旁边桌的人邀请你一起唱歌。|Oktoberfest in Munich; the tents are roaring. The next table invites you to sing.", [
      O("站上长凳一起唱|Climb on the bench and sing", R("一整个帐篷都跟着你唱。你们交换了联系方式，约好明年再来。|The whole tent joined in. You swapped numbers and promised to come back next year.", { happy: 10, eq: 3, drink: 4 })),
      O("只喝一杯就走|One stein and leave", R("你在街上吃了一个巨大的椒盐卷饼。|You ate an enormous pretzel on the street.", { happy: 4 }))
    ]),
    CE("hol_de_market", ["de", "at", "ch"], [4, 100], "圣诞市集|The Christmas Market", "🎪", "广场上的圣诞市集亮起了灯，热红酒的香味飘了整条街。|The Christmas market lights up the square; mulled wine scents the whole street.", [
      O("给家人买手工木雕|Buy hand-carved ornaments for the family", R("那个小木雕每年都会被挂上圣诞树。|The little carving goes on the tree every year since.", { happy: 5, money: -30 })),
      O("和朋友喝热红酒|Drink mulled wine with friends", R("你们在寒风里聊到了半夜。|You talked in the cold wind until midnight.", { happy: 6, eq: 2 }))
    ]),
    CE("hol_fr_bastille", "fr", [5, 90], "国庆节|Bastille Day", "🇫🇷", "七月十四日，埃菲尔铁塔下的烟花照亮了巴黎。|14 July: fireworks over the Eiffel Tower light up Paris.", [
      O("去消防站舞会|Go to the firemen’s ball", R("你和一个消防员跳了一整晚。|You danced all night with a firefighter.", { happy: 8 })),
      O("在塞纳河边野餐|Picnic by the Seine", R("一瓶红酒，一根法棍，整个城市都在你眼前发光。|A bottle of wine, a baguette, and the whole city glowing.", { happy: 7, stress: -5 }))
    ]),
    CE("hol_ru_ny", "ru", [4, 100], "新年|New Year", "🎆", "新年钟声敲响前，全家围在电视前。按习俗，要把愿望写在纸上，烧掉，把灰放进香槟里喝下去。|Before the chimes, the family gathers by the TV. Tradition: write a wish, burn it, drop the ash in champagne and drink it before the last stroke.", [
      O("在钟声结束前喝完|Drink it before the chimes end", RC(.6, "你做到了！整整一年你都觉得好运在身边。|You made it! All year you felt lucky.", { happy: 8, luck: 3 }, "你呛到了，全家笑成一团。|You choked, and the family collapsed laughing.", { happy: 6 })),
      O("给每个人一个拥抱|Hug everyone", R("连平时最严肃的爷爷都笑了。|Even stern Grandpa smiled.", { par: 5, happy: 5 }))
    ]),
    CE("hol_in_diwali", "in", [4, 100], "排灯节|Diwali", "🪔", "排灯节，家家户户点亮了油灯，街上全是烟花和甜点。|Diwali: every house glows with oil lamps; the streets are full of fireworks and sweets.", [
      O("和妈妈一起画兰戈利|Draw rangoli with Mum", R("你们在门口画了一朵巨大的莲花，邻居们都来拍照。|You drew a giant lotus by the door; the neighbours came to take photos.", { happy: 7, par: 5 })),
      O("给邻居送甜点|Take sweets to the neighbours", R("你送出去一盒，收回来五盒。|You gave one box and got five back.", { happy: 6, eq: 2 }))
    ]),
    CE("hol_in_holi", "in", [5, 70], "洒红节|Holi", "🎨", "洒红节，所有人都在街上互相泼彩色粉末。|Holi: everyone in the streets throws coloured powder at each other.", [
      O("冲进人群|Charge into the crowd", R("你变成了一道彩虹，三天才洗干净。|You became a rainbow and it took three days to wash off.", { happy: 10 })),
      O("穿着白衣服出门|Go out in white clothes", R("白衣服不到一分钟就变成了一幅画。|Your white clothes became a painting in under a minute.", { happy: 7 }))
    ]),
    CE("hol_br_carnival", "br", [10, 80], "狂欢节|Carnival", "🎭", "里约狂欢节，桑巴学校邀请你加入他们的游行队伍。|Rio Carnival: a samba school invites you to join their parade.", [
      O("穿上羽毛服装去跳|Put on the feathers and dance", RC(.6, "你们学校拿了冠军，你的照片上了报纸。|Your school won and your photo made the papers.", { happy: 12, fame: 2, health: 2 }, "你跳了四个小时，第二天腿都抬不起来。|You danced four hours and couldn’t lift your legs the next day.", { happy: 8 })),
      O("在看台上看|Watch from the stands", R("鼓声让你的心一直在跳。|The drums kept your heart pounding.", { happy: 6 }))
    ]),
    CE("hol_mx_muertos", "mx", [4, 100], "亡灵节|Day of the Dead", "💀", "亡灵节，家里摆起了祭坛，放着已故亲人的照片和他们生前爱吃的东西。|Day of the Dead: the family altar holds photos of the departed and the foods they loved.", [
      O("为曾祖母做她爱吃的菜|Cook great-grandma’s favourite dish", R("妈妈尝了一口，说：“就是这个味道。”她哭了，又笑了。|Mum tasted it: “That’s exactly it.” She cried, then laughed.", { par: 6, eq: 4 })),
      O("画一个骷髅妆去游行|Paint a skull face and join the parade", R("你在游行里遇到了一群和你一样快乐的人。|You found a crowd of people just as joyful as you.", { happy: 8 }))
    ]),
    CE("hol_th_songkran", "th", [4, 80], "泼水节|Songkran", "💦", "泼水节，整座城市变成了水枪大战的战场。|Songkran: the whole city becomes a water-gun battlefield.", [
      O("装备最大的水枪|Arm yourself with the biggest water gun", R("你横扫了整条街，然后被一辆洒水车浇了个透。|You conquered the street — then a water truck drenched you.", { happy: 10 })),
      O("去寺庙为长辈浴佛|Go to the temple to pour water for elders", R("长辈们为你祝福，说你今年一定平安。|The elders blessed you for a peaceful year.", { karma: 4, happy: 4 }))
    ]),
    CE("hol_th_loy", "th", [8, 100], "水灯节|Loy Krathong", "🪷", "水灯节的晚上，河面上漂满了蜡烛和花朵做的水灯。|Loy Krathong night: the river is covered with floating candles and flowers.", [
      O("和喜欢的人一起放水灯|Float a krathong with someone you love", R("传说一起放水灯的人会永远在一起。你们的灯漂得很远很远。|Legend says couples who float one together stay together. Yours drifted very far.", { happy: 8, part: 6 })),
      O("一个人许个愿|Make a wish alone", R("你许了一个谁都不能告诉的愿望。|You made a wish you can tell no one.", { happy: 4 }))
    ]),
    CE("hol_ie_patrick", "ie", [5, 90], "圣帕特里克节|St Patrick’s Day", "☘️", "整个都柏林都变成了绿色。你被朋友拉去参加游行。|All of Dublin turns green, and friends drag you to the parade.", [
      O("穿一身绿去游行|Go dressed head to toe in green", R("你在酒吧里学会了三首爱尔兰民歌。|You learned three Irish folk songs in the pub.", { happy: 9, drink: 3 })),
      O("回家陪奶奶看电视转播|Watch it on TV with Grandma", R("奶奶给你讲了她年轻时参加游行的故事。|Grandma told you about marching when she was young.", { par: 4, happy: 4 }))
    ]),
    CE("hol_es_tomatina", "es", [12, 70], "番茄节|La Tomatina", "🍅", "布尼奥尔的番茄节，一卡车一卡车的番茄倒在街上。|La Tomatina in Buñol: truckload after truckload of tomatoes dumped in the streets.", [
      O("冲进番茄雨|Dive into the tomato rain", R("一个小时后，你从头到脚都是番茄酱的味道。|An hour later you smelled of ketchup from head to toe.", { happy: 10 })),
      O("站在阳台上看|Watch from a balcony", R("你拍到了一张绝妙的照片。|You took a brilliant photo.", { happy: 5 }))
    ]),
    CE("hol_it_ferragosto", "it", [5, 90], "八月节|Ferragosto", "🍉", "八月十五日，整个意大利都去海边了。你家的海滩伞旁边是三代人的大家庭。|15 August: all of Italy goes to the sea. Your beach umbrella sits beside three generations of family.", [
      O("听奶奶讲年轻时的恋爱|Listen to Nonna’s love stories", R("你这才知道，爷爷当年追了她整整三个夏天。|You learned Grandpa chased her for three whole summers.", { par: 4, happy: 5 })),
      O("和表兄弟去游泳比赛|Race your cousins in the sea", R("你赢了，赢得一个西瓜。|You won — and the prize was a watermelon.", { happy: 6, health: 2 }))
    ]),
    CE("hol_sg_lunar", "sg", [4, 100], "农历新年|Lunar New Year", "🍊", "新年拜年，你要带两个橘子去每个亲戚家，说吉祥话。|New Year visits: you bring two mandarins to every relative and say lucky phrases.", [
      O("学会所有的吉祥话|Learn every lucky phrase", R("长辈们乐开了花，你收到的红包比去年多了一倍。|The elders beamed and your red envelopes doubled.", { money: 80, eq: 2 })),
      O("和亲戚们一起捞鱼生|Toss yusheng with the relatives", R("你们把鱼生捞得满桌都是，越高越吉利。|You tossed it all over the table — higher means luckier.", { happy: 7 }))
    ]),
    CE("hol_za_braai", "za", [6, 90], "烧烤日|Braai Day", "🔥", "九月二十四日，全国都在烧烤。邻居家的大叔自称是“烧烤之王”。|24 September: the whole nation braais. The neighbour claims to be “the braai king”.", [
      O("向他发起挑战|Challenge him", RC(.4, "你的香肠赢得了全街的认可。大叔不服气，约你明年再战。|Your boerewors won the street over. He demanded a rematch next year.", { happy: 8, eq: 2 }, "你把肉烤焦了，被嘲笑了一整年。|You burned the meat and were teased all year.", { happy: 3 }))
    ]),
    CE("hol_nz_matariki", "nz", [6, 100], "玛塔里基|Matariki", "✨", "毛利新年，冬夜里人们早起看昴星团升起，纪念逝去的人。|Matariki, the Māori New Year: people rise on a winter morning to watch the Pleiades and remember the dead.", [
      O("早起去山顶看星|Climb a hill before dawn to watch", R("星团升起时，旁边的老人唱起了歌。你也跟着哼了。|As the stars rose an elder began to sing. You hummed along.", { eq: 4, happy: 6 }))
    ]),
    CE("hol_ca_winter", "ca", [5, 90], "冬季嘉年华|Winter Carnival", "⛸️", "冰雕节，结冰的湖面上全是滑冰的人。|Winter carnival: the frozen lake is full of skaters.", [
      O("参加冰上曲棍球友谊赛|Join a pond-hockey game", RC(.5, "你打进了一球，被队友抛了起来。|You scored and your teammates threw you in the air.", { happy: 9, health: 3 }, "你摔了个四脚朝天，大家笑着把你拉起来。|You fell flat; everyone laughed and pulled you up.", { happy: 5 })),
      O("喝一杯枫糖热饮|Have a maple hot drink", R("甜到心里。|Sweet to the bone.", { happy: 5 }))
    ]),
    CE("hol_pt_antonio", "pt", [6, 90], "圣安东尼节|Santo António", "🐟", "里斯本的老城区挂满彩灯，满街都是烤沙丁鱼的味道。|Lisbon’s old quarter is strung with lights; the streets smell of grilled sardines.", [
      O("送喜欢的人一盆罗勒|Give your crush a pot of basil", R("按照习俗，盆里插着一首小诗。对方红着脸收下了。|By tradition a little poem sat in the pot. They blushed and accepted.", { happy: 8 })),
      O("和陌生人一起跳舞|Dance with strangers", R("你和一位老奶奶跳了一支舞，她说你跳得比她丈夫好。|You danced with an old lady who said you danced better than her husband.", { happy: 7 }))
    ]),
    CE("hol_ar_asado", "ar", [6, 90], "周日烤肉|Sunday Asado", "🥩", "每个周日，全家都要聚在一起吃烤肉。今天外公让你来烤。|Every Sunday the family has asado. Today Grandpa hands you the grill.", [
      O("认真学，慢慢烤|Learn and take it slow", R("外公尝了一口，点点头：“可以把烤架交给你了。”|Grandpa tasted it and nodded: “The grill is yours now.”", { par: 6, happy: 6 })),
      O("和表哥们看足球，把肉烤焦了|Watch football with cousins and burn the meat", R("外公叹了口气，又把烤架接了回去。|Grandpa sighed and took the grill back.", { happy: 4 }))
    ]),
    CE("hol_ch_national", "ch", [5, 100], "国庆节|Swiss National Day", "🎇", "八月一日，山顶上燃起篝火，村子里放起了烟花。|1 August: bonfires on the peaks, fireworks in the village.", [
      O("参加山顶的篝火晚会|Join the mountaintop bonfire", R("从山顶望下去，每个山谷都有一团火光。|From the peak, every valley had a glowing fire.", { happy: 7 })),
      O("和邻居一起吃早午餐|Join the farmers’ brunch", R("农场主的奶酪好吃得让你想搬过来住。|The farmer’s cheese made you want to move in.", { happy: 5 }))
    ]),

    /* ======================= people who matter ======================= */
    NE("ppl_sib_secret", ["sibling"], [8, 20], "兄弟姐妹的秘密|A Sibling’s Secret", "🤫", "{n}偷偷告诉你一个秘密，让你千万别告诉爸妈。|{n} tells you a secret and begs you not to tell your parents.", [
      O("守口如瓶|Keep it", R("从那以后，{n}有什么事都第一个告诉你。|From then on {n} told you everything first.", { npc: 10, eq: 2 })),
      O("觉得事情太严重，告诉爸妈|It’s too serious — tell your parents", RC(.5, "爸妈及时帮了{n}。后来{n}说：“谢谢你出卖我。”|Your parents helped {n} in time. Later {n} said: “Thanks for ratting me out.”", { npc: 4, karma: 3 }, "{n}很久都不理你。|{n} wouldn’t speak to you for a long time.", { npc: -15 }))
    ]),
    NE("ppl_sib_fight", ["sibling"], [6, 16], "抢遥控器|The Remote Control War", "📺", "你和{n}为了看哪个频道打了起来，台灯被撞倒摔碎了。|You and {n} fight over the TV; the lamp crashes to the floor.", [
      O("一起把碎片藏起来|Hide the pieces together", R("你们统一口径说是猫干的。家里根本没有猫。|You both blamed the cat. You don’t have a cat.", { npc: 6, happy: 4 })),
      O("说是{n}弄的|Blame {n}", R("{n}被罚了一周不许看电视，看你的眼神像要吃人。|{n} was banned from TV for a week and glared murder at you.", { npc: -10, karma: -2 }))
    ]),
    NE("ppl_sib_wedding", ["sibling"], [22, 50], "兄弟姐妹的婚礼|A Sibling’s Wedding", "💒", "{n}要结婚了，请你致辞。|{n} is getting married and asks you to give a speech.", [
      O("讲小时候的糗事|Tell embarrassing childhood stories", R("全场笑到流泪，{n}一边笑一边捶你。|The room laughed till it cried; {n} laughed and punched your arm.", { npc: 8, happy: 6 })),
      O("讲着讲着哭了|Cry halfway through", R("{n}冲上来抱住你，新人的妆都花了。|{n} rushed up and hugged you, make-up ruined.", { npc: 12, eq: 3 }))
    ], function (n) { return N.age(n) >= 22 && !n.married; }),
    NE("ppl_sib_care", ["sibling"], [40, 85], "照顾老人|Caring for Our Parents", "🫂", "父母老了，需要人照顾。你和{n}要商量谁来出力。|Your parents need care now. You and {n} must work out who does what.", [
      O("你多出力，{n}多出钱|You give time, {n} gives money", R("分工清楚，兄弟姐妹之间反而更亲了。|With a clear split, you grew even closer.", { npc: 6, par: 6, eq: 3 })),
      O("把父母接到自己家|Take your parents in yourself", R("很累，但父母晚年的每一天你都在身边。|Exhausting — but you were there for every day of their final years.", { par: 12, stress: 10, karma: 6 })),
      O("吵了起来|End up fighting", R("你们吵翻了，过年都不在一起吃饭。|You fell out and stopped sharing New Year dinner.", { npc: -15, stress: 8 }))
    ], function () { return N.rel("father", "mother").some(function (x) { return x.alive && N.age(x) >= 70; }); }),
    NE("ppl_friend_move", ["friend"], [10, 40], "最好的朋友要搬走了|Your Best Friend Is Moving", "📦", "{n}要搬去另一个城市了。|{n} is moving to another city.", [
      O("送一份特别的告别礼物|Give a special goodbye gift", R("你们约定每年见一次。很多年后你们还在遵守这个约定。|You promised to meet once a year — and kept it for decades.", { npc: 12, happy: 3 })),
      O("假装不在乎|Pretend not to care", R("车开走后，你一个人在路边站了很久。|After the car left you stood by the road a long time.", { npc: -3, happy: -4 }))
    ], function (n) { return n.aff >= 50; }),
    NE("ppl_friend_loan", ["friend"], [22, 70], "朋友借钱创业|A Friend Wants to Start a Business", "💼", "{n}想辞职创业，问你能不能借给ta一笔钱。|{n} wants to quit and start a business, and asks to borrow money.", [
      O("借|Lend it", RC(.45, "{n}的公司做起来了，还给你的时候多给了三成，说“你是我第一个投资人”。|{n}’s company took off; they repaid you with thirty percent extra — “my first investor”.", { money: 1500, npc: 15 }, "公司倒闭了，钱没还上，但友情还在。|The company folded. The money was gone, but the friendship wasn’t.", { money: -5000, npc: 5 })),
      O("委婉拒绝|Politely decline", R("{n}说“理解”，但你们之间好像隔了一层什么。|{n} said they understood — but something had shifted.", { npc: -6 }))
    ], function (n) { return n.aff >= 40; }),
    NE("ppl_friend_wedding_late", ["friend"], [30, 80], "多年后的重逢|Reunion After Many Years", "🍻", "你和{n}很多年没见了，今天在一家小酒馆偶遇。|You haven’t seen {n} in years and run into each other in a little bar.", [
      O("坐下来喝到天亮|Sit down and drink till dawn", R("你们聊了初恋、工作、孩子和那些没实现的梦想。|You talked first loves, jobs, kids and the dreams you never chased.", { npc: 12, happy: 8, drink: 2 })),
      O("寒暄几句就走|Exchange pleasantries and leave", R("你们加了联系方式，但谁也没主动发过消息。|You swapped numbers; neither ever messaged first.", {}))
    ]),
    NE("ppl_grand_last", ["grand"], [6, 50], "爷爷奶奶的小院|Grandparents’ Little Yard", "🏡", "你去看{n}。{n}在院子里给你剥了一碗毛豆，一直说你瘦了。|You visit {n}, who shells a bowl of beans for you in the yard and keeps saying you’ve got thin.", [
      O("吃完一整碗|Eat the whole bowl", R("{n}笑得眼睛都眯成了一条缝。|{n} smiled until their eyes disappeared.", { npc: 10, happy: 5 })),
      O("陪{n}聊年轻时的事|Ask {n} about their youth", R("你第一次知道，{n}年轻时差点当了演员。|You learned {n} nearly became an actor when young.", { npc: 8, eq: 3 }))
    ], function (n) { return N.age(n) >= 60; }),
    NE("ppl_grand_recipe", ["grand"], [12, 50], "家传菜谱|The Family Recipe", "📒", "{n}说：“趁我还记得，把这几道菜教给你。”|{n} says: “While I still remember, let me teach you these dishes.”", [
      O("一道一道学|Learn them one by one", R("后来，每次你做这几道菜，孩子们都说“和太奶奶做的一样”。|Later, whenever you cooked them, your children said: “Just like Great-Grandma’s.”", { npc: 10, sk: { cook: 10 }, happy: 5 })),
      O("用手机录下来|Film it on your phone", R("那段视频你一直舍不得删。|You could never bring yourself to delete that video.", { npc: 6 }))
    ], function (n) { return N.age(n) >= 65; }),
    NE("ppl_ex_meet", ["ex"], [25, 80], "前任|The Ex", "🔙", "你在超市里遇见了{n}，ta推着购物车，车上坐着一个孩子。|In the supermarket you run into {n}, pushing a trolley with a child in the seat.", [
      O("微笑着打个招呼|Smile and say hello", R("你们聊了几句，ta说：“你看起来过得很好。”你说：“你也是。”你们都是真心的。|A few words. “You look well,” they said. “So do you.” Both of you meant it.", { eq: 4, happy: 3 })),
      O("躲到另一条货架后面|Duck behind another aisle", R("你在冷冻柜前站了五分钟，冻得发抖。|You stood five minutes by the freezers, shivering.", { stress: 4 }))
    ]),
    NE("ppl_firstlove", ["ex", "friend", "classmate"], [45, 85], "初恋的消息|News of Your First Love", "💌", "同学群里有人说，{n}离婚了，一个人住在老家。|In the old class chat someone says {n} is divorced and living alone back home.", [
      O("打一个电话|Make a phone call", RC(.4, "电话那头沉默了很久，然后说：“我一直在想，你什么时候会打来。”|A long silence, then: “I always wondered when you’d call.”", { npc: 20, love: 25, happy: 10 }, "你们客客气气地聊了十分钟。有些东西，过去就过去了。|Ten polite minutes. Some things are simply over.", { eq: 3 })),
      O("不打扰|Leave it be", R("你在日记里写下了ta的名字。|You wrote their name in your diary.", { eq: 2 }))
    ], function (n) { return Math.abs(N.age(n) - G.S.p.age) <= 4; }),
    NE("ppl_teacher", ["teacher", "contact"], [25, 70], "老师|Your Old Teacher", "🍎", "你在街上遇见了{n}——当年最严厉的那位老师。ta老了很多。|On the street you run into {n} — your strictest teacher back then. They’ve aged a lot.", [
      O("鞠一躬，说谢谢|Bow and say thank you", R("{n}愣了一下，眼圈红了：“我还以为你们都恨我。”|{n} blinked and teared up: “I thought you all hated me.”", { npc: 15, eq: 4 })),
      O("请{n}吃顿饭|Take {n} to dinner", R("饭桌上，{n}把你当年的作文背了出来。|Over dinner {n} recited an essay you wrote back then — from memory.", { npc: 12, happy: 6 }))
    ], function (n) { return /老师|教师|Teacher/.test(G.T(n.job || "")) && N.age(n) >= 50; })
  ]);
})();
