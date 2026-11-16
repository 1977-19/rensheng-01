/* Version 1.7: the weather of each country, pets you can really spend time with, and achievements for
   everything added in 1.6 and 1.7. */
(function () {
  "use strict";
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function CE(id, cs, a, title, icon, t, o, w) { return E(id, a, title, icon, t, o, { w: w || 1.1, bad: 1, if: function (S2, p) { return cs.indexOf(p.country) >= 0 && !p.jail; } }); }

  G.evs([
    CE("dz_typhoon", ["cn", "jp", "kr", "th", "sg"], [5, 100], "台风过境|Typhoon", "🌀", "超强台风正面登陆，窗外的树被吹得几乎贴到了地上。|A super typhoon makes landfall; outside, the trees are bent almost flat.", [
      O("提前囤好物资，关紧门窗|Stock up and seal the windows", R("你们家安然度过了台风。第二天你帮邻居清理了倒下的树。|You rode it out safely, then helped neighbours clear fallen trees.", { eq: 2, karma: 3 })),
      O("出门拍台风视频|Go out and film it", RC(.6, "视频上了新闻，但你被妈妈骂了一顿。|Your video made the news — and Mum gave you an earful.", { fame: 2, happy: 3 }, "一块招牌被吹下来，砸中了你的肩膀。|A sign blew off and hit your shoulder.", { health: -12 }))
    ]),
    CE("dz_quake", ["jp", "cn", "mx", "it", "nz", "ar"], [5, 100], "地震|Earthquake", "🫨", "凌晨，整栋楼剧烈摇晃起来，书架倒在了地上。|Before dawn the whole building shakes violently; the bookshelf crashes down.", [
      O("躲到坚固的桌子下面|Get under a sturdy table", R("摇晃停止后，你护着家人迅速撤到了空地。|When it stopped, you got your family out to open ground.", { eq: 3, stress: 8 })),
      O("冲出去救楼上的老人|Run to help the elderly neighbour upstairs", RC(.75, "你背着她下了楼。她后来逢人就说你是她的救命恩人。|You carried her down. She called you her saviour to everyone after.", { karma: 12, health: -2 }, "余震中，你被掉下的灯砸伤了。|An aftershock brought a light down on you.", { karma: 10, health: -15 }))
    ]),
    CE("dz_hurricane", ["us", "mx"], [5, 100], "飓风|Hurricane", "🌪️", "政府发布了强制疏散令：一场五级飓风正在逼近。|A mandatory evacuation order: a Category 5 hurricane is coming.", [
      O("立刻撤离|Evacuate at once", R("你们在内陆的亲戚家住了一周。回来时，房子少了半个屋顶。|A week with relatives inland. When you returned, half the roof was gone.", { money: -2000, stress: 8 })),
      O("留下来守着房子|Stay and protect the house", RC(.5, "你守住了房子，但那一夜你以为自己会死。|The house held, but that night you thought you’d die.", { stress: 20 }, "洪水灌进了一楼，你在屋顶上等了十个小时才被救走。|Floodwater filled the ground floor; you waited ten hours on the roof for rescue.", { health: -15, money: -5000, stress: 25 }))
    ]),
    CE("dz_fire", ["au", "us", "ca", "pt", "es"], [5, 100], "山火|Wildfire", "🔥", "天空变成了橙红色，山火离你家只有十公里了。|The sky has turned orange; the wildfire is ten kilometres away.", [
      O("带上宠物和重要文件撤离|Evacuate with the pets and documents", R("你们安全了。电视里，一片片森林变成了灰烬。|You were safe. On TV, forest after forest turned to ash.", { stress: 10 })),
      O("加入志愿消防队|Join the volunteer fire brigade", RC(.7, "你们守住了小镇。镇长在大会上念了每一个志愿者的名字。|You saved the town. The mayor read out every volunteer’s name.", { karma: 12, fame: 2, health: -4 }, "你吸入了太多浓烟，住了一周院。|Too much smoke — a week in hospital.", { health: -18, karma: 10 }))
    ]),
    CE("dz_flood", ["cn", "de", "gb", "in", "th", "br"], [5, 100], "洪水|Flood", "🌊", "连续一周的暴雨，河水漫过了堤坝，街上可以划船了。|A week of downpours; the river breaches its banks and you could row down the street.", [
      O("把一楼的东西搬到楼上|Move everything upstairs", R("大部分东西保住了。|You saved most of your things.", { money: -500, stress: 6 })),
      O("划着充气船去救被困的人|Paddle an inflatable boat to rescue people", RC(.75, "你救出了一家五口，包括一只狗。|You rescued a family of five — and their dog.", { karma: 12, fame: 2 }, "船被水冲翻了，你自己也需要被救。|The boat capsized; you needed rescuing yourself.", { health: -10 }))
    ]),
    CE("dz_heat", ["fr", "es", "it", "in", "au", "us"], [5, 100], "热浪|Heatwave", "🥵", "连续十天四十度以上的高温。新闻说，很多独居老人中暑去世了。|Ten days above forty degrees. The news says many elderly people living alone have died of heatstroke.", [
      O("挨家挨户去看望独居老人|Check on old people living alone", R("你给五位老人送去了冰水和风扇，其中一位已经快不行了，你及时叫了救护车。|You brought water and fans to five elderly neighbours — and called an ambulance for one just in time.", { karma: 12, health: -2 })),
      O("躲在空调房里|Hide in the air conditioning", R("电费账单让你倒吸一口冷气。|The electricity bill gave you a chill.", { money: -150 }))
    ]),
    CE("dz_blizzard", ["ca", "ru", "us", "jp", "ch", "at"], [5, 100], "暴风雪|Blizzard", "🌨️", "一场暴风雪封住了所有道路，停电了。|A blizzard closes every road. The power is out.", [
      O("点起蜡烛，全家围在一起讲故事|Light candles and tell stories together", R("那是你们家最温暖的一个晚上。|It was the warmest night your family ever had.", { happy: 6, par: 4, kids: 4 })),
      O("出去帮邻居铲雪|Go out and dig the neighbours out", R("你铲了一整天的雪，邻居们给你送来了热汤。|You shovelled all day; the neighbours brought you hot soup.", { health: 2, karma: 4 }))
    ]),
    CE("dz_avalanche", ["ch", "at"], [14, 70], "雪崩|Avalanche", "🏔️", "滑雪时，你听见身后传来一声闷响——山坡上的雪开始滑动了。|Skiing, you hear a dull boom behind you — the slope begins to slide.", [
      O("向侧面全速滑出雪崩路径|Ski hard sideways out of its path", RC(.7, "你冲出了雪崩的范围。回头看时，你刚才站的地方已经被埋了。|You escaped. Looking back, the spot where you’d stood was buried.", { stress: 15 }, "你被雪埋到了胸口，同伴用了二十分钟才把你挖出来。|Buried to the chest; your friend dug for twenty minutes to free you.", { health: -20, stress: 20 }))
    ]),
    CE("dz_tsunami", ["jp", "th"], [5, 100], "海啸警报|Tsunami Warning", "🌊", "海边的警报响了，海水突然退得很远，露出了海底的礁石。|The beach siren wails. The sea suddenly pulls far back, exposing the reef.", [
      O("拉着身边所有人往高处跑|Grab everyone near you and run uphill", R("你们刚跑上山坡，海浪就冲上了海滩。你救了七个人。|You’d barely reached the hill when the wave hit the beach. You saved seven people.", { karma: 15, fame: 4, stress: 15 })),
      O("站着看发生了什么|Stand and watch", RC(.3, "你及时反应过来，爬上了屋顶。|You realised just in time and climbed onto a roof.", { stress: 20 }, "海浪把你卷走了，你抱着一根木头漂了一个小时。|The wave swept you away; you clung to a log for an hour.", { health: -30, stress: 30 }))
    ], .7),
    CE("dz_haze", ["sg", "cn", "in", "th"], [5, 100], "雾霾|Smog", "😷", "空气污染指数爆表，窗外什么都看不清。|The air-quality index is off the charts; you can’t see out of the window.", [
      O("买一台好的空气净化器|Buy a good air purifier", R("家里的空气好多了。|The air at home improved a lot.", { money: -300, health: 2 })),
      O("照常出门跑步|Go for your run as usual", R("你咳了一个星期。|You coughed for a week.", { health: -5 }))
    ]),
    CE("dz_drought", ["za", "au", "in", "mx"], [5, 100], "限水令|Water Restrictions", "🚱", "大旱之年，城市实行限水令：每人每天只有五十升水。|A drought year: the city limits everyone to fifty litres of water a day.", [
      O("全家一起想办法省水|Find ways to save water together", R("你们用洗菜水冲厕所，用一桶水洗完全家的澡。孩子们觉得这像一场游戏。|Vegetable water flushed the toilet; one bucket washed everyone. The kids treated it as a game.", { eq: 3, kids: 3 })),
      O("偷偷买桶装水囤着|Secretly hoard bottled water", R("邻居看到了，从此不太理你。|A neighbour saw, and stopped speaking to you.", { karma: -3, money: -200 }))
    ])
  ]);

  /* ---------- pets: spend time with them ---------- */
  var PETN = { dog: "狗狗|dog", cat: "猫咪|cat", rabbit: "兔子|rabbit", parrot: "鹦鹉|parrot" };
  function pet() { var L = S().assets.pets; if (!L.length) return null; var x = L.slice().sort(function (a, b) { return (b.aff || 0) - (a.aff || 0); })[0]; x.playY = S().year; return x; }
  var petCat = { id: "petcare", n: "我的宠物|My Pet", i: "🐾", items: [
    { id: "pet_walk", n: "带它出去玩|Take It Out to Play", i: "🦮", e: 5, if: function () { return !!pet(); }, run: function (a) { var pt = pet(); pt.bond = Math.min(100, (pt.bond || 50) + 6); pt.aff = Math.min(100, (pt.aff || 60) + 6); return G.quick(a, G.pick(["它在草地上疯跑，跑累了就躺在你脚边。|It tore across the grass, then flopped at your feet.", "你们在公园里交了一个新朋友——另一只同样调皮的小家伙。|You made a friend in the park — another little rascal just like yours."]), { happy: 6, health: 2, stress: -6 }); } },
    { id: "pet_train", n: "训练它|Train It", i: "🎾", e: 10, if: function () { return !!pet(); }, run: function (a) { var pt = pet(); pt.tricks = (pt.tricks || 0) + (G.ch(.6) ? 1 : 0); pt.bond = Math.min(100, (pt.bond || 50) + 4); pt.aff = Math.min(100, (pt.aff || 60) + 4); return G.quick(a, G.L("它现在会{n}个小把戏了。|It knows {n} tricks now.", { n: pt.tricks }), { happy: 4, eq: 1 }); } },
    { id: "pet_show", n: "参加宠物比赛|Enter a Pet Show", i: "🏅", e: 15, if: function () { return !!pet() && (pet().tricks || 0) >= 3; }, run: function (a) { var pt = pet(), win = G.ch(.2 + (pt.tricks || 0) * .06 + (pt.bond || 50) / 400); if (win) { G.inc("petwin"); G.addMoney(G.$(G.ri(200, 2000))); } return G.quick(a, win ? "它拿了冠军！你抱着奖杯和它拍了一张合影。|It won! You took a photo together with the trophy." : "它在台上走了一半，跑去追一只蝴蝶了。全场大笑。|Halfway across the stage it ran off after a butterfly. Everyone laughed.", { happy: win ? 12 : 6, fame: win ? 2 : 0 }); } },
    { id: "pet_vet", n: "带它体检|Take It for a Check-up", i: "🩺", e: 5, $: 100, if: function () { return !!pet(); }, run: function (a) { if (!G.pay(G.$(100))) return "cancel"; var pt = pet(); pt.health = Math.min(100, (pt.health == null ? 80 : pt.health) + G.ri(6, 12)); return G.quick(a, "医生说它很健康，还能陪你很多年。|The vet says it’s healthy and has many years ahead.", { happy: 3 }); } },
    { id: "pet_photo", n: "给它拍照发到网上|Post Its Photo Online", i: "📸", e: 5, if: function () { return !!pet(); }, run: function (a) { var viral = G.ch(.12); if (viral) G.inc("petviral"); return G.quick(a, viral ? "照片火了！它有了自己的粉丝账号。|The photo went viral! It has its own fan account now." : "朋友们都点了赞。|All your friends liked it.", { happy: viral ? 10 : 3, fame: viral ? 3 : 0 }); } }
  ] };
  G.ACT_CATS.push(petCat);

  /* ---------- achievements ---------- */
  function A(id, i, n, d, f) { return { id: id, i: i, n: n, d: d, f: f }; }
  var flags = function (p) { return p.flags || {}; };
  [
    A("spy_dir", "🕵️", "幕后之人|The Man Behind the Curtain", "成为情报局局长|Become Director of Intelligence", function (S2, p) { return !!p.spy && p.spy.rank >= 7; }),
    A("spy_caught", "⛓️", "身份暴露|Blown", "以间谍罪被捕|Be arrested for espionage", function (S2, p) { return !!flags(p).spyCaught; }),
    A("spy_cadet", "🧒", "少年特工|Teen Agent", "16岁前被情报机构招募|Be recruited by an intelligence agency before 16", function (S2, p) { return !!p.spy && p.spy.youth; }),
    A("uc_love", "🥀", "无间|Infernal Affairs", "卧底时和黑帮老大相爱|Fall for the crime boss while undercover", function (S2, p) { return !!flags(p).ucBoss && flags(p).ucBoss.real; }),
    A("topcop", "👮", "警界之巅|Top Cop", "升到本国最高警职|Reach your country’s top police post", function (S2, p) { return !!p.pol && p.pol.rank >= G.POLICE.r.length - 1; }),
    A("summit8k", "🏔️", "八千米之上|Above Eight Thousand", "登顶一座八千米高峰|Summit an 8,000 m peak", function (S2, p) { return !!flags(p).summit8k; }),
    A("bucket3", "📝", "此生无憾|No Regrets", "十八岁写下的三个愿望全部实现|Fulfil all three dreams from your eighteenth birthday", function (S2, p) { return !!flags(p).bucketAll; }),
    A("collector", "🏺", "收藏家|Collector", "同时拥有5件收藏品|Own five collectibles at once", function (S2) { return S2.assets.items.filter(function (x) { return x.coll; }).length >= 5; }),
    A("forgery", "🎭", "打眼|Fooled", "买到一件赝品|Buy a forgery", function (S2) { return S2.assets.items.some(function (x) { return x.coll && x.fake; }) || false; }),
    A("pro_hobby", "🎯", "玩成了专业|Hobby Turned Pro", "把一项爱好变成职业|Turn a hobby into a career", function (S2, p) { return !!flags(p).pro; }),
    A("gift_pro", "🌟", "天生如此|Born For It", "把天生的爱好变成职业|Turn your natural hobby into a career", function (S2, p) { return !!flags(p).pro && flags(p).pro === flags(p).gift; }),
    A("space_moon", "🌕", "月之背面|Far Side of the Moon", "完成绕月飞行|Fly around the Moon", function (S2, p) { return !!flags(p).moon; }),
    A("pet_champ", "🐾", "冠军宠物|Champion Pet", "宠物拿下一次比赛冠军|Win a pet show", function (S2, p, e, c) { return (c.petwin || 0) > 0; }),
    A("pet_star", "📸", "网红宠物|Famous Pet", "宠物的照片在网上爆红|Your pet goes viral", function (S2, p, e, c) { return (c.petviral || 0) > 0; }),
    A("twin", "🪞", "另一个我|My Other Half", "找到失散多年的双胞胎|Find a long-lost twin", function (S2, p) { return (flags(p).chain || {}).twin === 2; }),
    A("treasure", "🗺️", "藏宝图|X Marks the Spot", "跟着地图找到那个木箱|Follow the map to the chest", function (S2, p) { return (flags(p).chain || {}).map === 3; }),
    A("idol", "💫", "追星成功|Dream Come True", "在演唱会上被偶像看中|Catch your idol’s eye at a concert", function (S2, p) { return !!flags(p).idolMet; }),
    A("adopt", "🏡", "另一种缘分|Family by Choice", "领养一个孩子|Adopt a child", function () { return N.rel("child").some(function (k) { return k.adopted; }); }),
    A("pure", "💗", "一颗真心|A True Heart", "遇见一个纯情的伴侣|Find a devoted, true-hearted partner", function () { return N.all(function (n) { return n.pureKnown; }).length > 0; }),
    A("passport", "💍", "各取所需|A Marriage of Convenience", "和一个想要你国籍的人结婚|Marry someone who wants your passport", function () { return N.all(function (n) { return n.citSeeker && n.rel === "spouse"; }).length > 0; }),
    A("grand_heir", "👶", "隔代继承|Skipping a Generation", "以孙辈的身份继续人生|Continue life as a grandchild", function (S2, p) { return !!flags(p).fromGrand; }),
    A("foreign_kid", "🛂", "落地生根|Putting Down Roots Abroad", "孩子在国外入籍|A child becomes a citizen abroad", function () { return N.rel("child").some(function (k) { return k.visa && k.visa.st === "cit"; }); }),
    A("new_jobs", "🧰", "百业人生|A Life of Many Trades", "在3种不同的职业工作过|Work in three different occupations", function (S2, p) { var h = p.hist || {}, set = {}; Object.keys(h).forEach(function (y) { set[h[y].t] = 1; }); return Object.keys(set).length >= 4; }),
    A("racer_champ", "🏎️", "世界冠军|World Champion", "成为赛车世界冠军|Become a racing world champion", function (S2, p) { return !!p.job && p.job.id === "racer" && p.job.rank >= 3; }),
    A("comet", "☄️", "以你命名|Named After You", "一颗彗星以你的名字命名|Have a comet named after you", function (S2, p) { return !!flags(p).comet; })
  ].forEach(function (a) { if (!G.ACH.some(function (x) { return x.id === a.id; })) G.ACH.push(a); });
  // flags the achievements rely on
  var cag = G.life.continueAsGrand;
  if (cag) G.life.continueAsGrand = function () { var r = cag.apply(this, arguments); if (S() && S().p) S().p.flags.fromGrand = 1; return r; };
  G.ACT_CATS.forEach(function (c) { c.items.forEach(function (x) { if (x.id === "sp_moon" && !x._f) { x._f = 1; var r0 = x.run; x.run = async function () { var before = (S().cnt || {}).space || 0, r = await r0.apply(this, arguments); if (((S().cnt || {}).space || 0) > before) P().flags.moon = 1; return r; }; } }); });
})();
