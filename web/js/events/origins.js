/* Family-background storylines: every origin lives through its own chapters */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function OE(id, org, a, title, icon, t, o, x) {
    x = x || {}; var f = x.if, orgs = [].concat(org);
    x.if = function (S, p) { return orgs.indexOf(p.origin) >= 0 && !p.flags.heir && (!f || f(S, p)); };
    if (x.w == null) x.w = 2.6;
    return E(id, a, title, icon, t, o, x);
  }
  function par() { return N.rel('father', 'mother').filter(function (n) { return n.alive; }); }
  function dad() { return N.rel('father').filter(function (n) { return n.alive; })[0]; }
  function mom() { return N.rel('mother').filter(function (n) { return n.alive; })[0]; }
  function sibs() { return N.rel('sibling').filter(function (n) { return n.alive; }); }
  function hasPar() { return par().length > 0; }
  function pp(c, n) { if (!n) return; c.npc = n; c.prm.n = n.name; var x = G.pr(n.g); for (var k in x) c.prm[k] = x[k]; }
  function famPay(c, usd) { var m = c.$(usd), P = par().filter(function (n) { return n.wealth >= m; })[0]; if (P) { P.wealth -= m; return true; } return c.pay(m); }

  G.evs([
    /* ================= RURAL ================= */
    OE('or_r_road', 'rural', [6, 11], '十里山路|The Long Road to School', '🥾', '学校在山的那一边，你每天天不亮就要出门，走两个小时山路。|School is over the mountain. Every day you leave before dawn and walk two hours.', [
      O('咬牙坚持|Grit your teeth and keep going', R('你的鞋磨破了好几双，但一天课都没落下。|You wore through several pairs of shoes but never missed a day.', { health: 3, fit: 6, smarts: 1, perf: 4 })),
      O('搭邻居的拖拉机|Hitch a ride on the neighbor\'s tractor', RC(.85, '突突突的拖拉机比走路快多了。|The putt-putting tractor beat walking by a mile.', { happy: 3 }, '拖拉机在山路上翻了沟，你摔破了头。|The tractor tipped into a ditch and you split your head.', { health: -10 })),
      O('干脆不去了，帮家里放牛|Skip it and herd the cattle', R('你在山坡上放了一天牛，课本被牛啃了一角。|You herded cattle all day; a cow chewed the corner of your textbook.', { perf: -8, health: 2, par: 2 }))
    ]),
    OE('or_r_market', 'rural', [7, 15], '赶集|Market Day', '🧺', '逢集的日子，你跟着爸妈挑着菜去镇上卖。|It\'s market day. You carry vegetables to town with your parents.', [
      O('学着吆喝|Learn to call out to buyers', R('你嗓门最大，菜卖得最快，大人们都夸你机灵。|You shouted loudest and sold fastest; the grown-ups said you were sharp.', { eq: 3, money: 5 })),
      O('偷偷看书摊的小人书|Sneak a look at the comic stall', R('你蹲在书摊前看了一上午，摊主也没赶你。|You crouched at the book stall all morning; the owner let you be.', { smarts: 2, happy: 3 })),
      O('用攒的钱买一支钢笔|Spend your savings on a fountain pen', R('那支钢笔你用了整整六年。|You used that pen for six whole years.', { happy: 5, perf: 2 }))
    ]),
    OE('or_r_city', 'rural', [11, 17], '第一次进城|Your First Trip to the City', '🏙️', '你第一次进城，高楼、霓虹灯、自动扶梯……一切都像做梦。|Your first trip to the city — skyscrapers, neon, escalators. It all feels like a dream.', [
      O('暗暗发誓要考出去|Swear you\'ll make it out', function (c) { c.p.flags.dream = 1; c.p.edu.study += 2; H.fx(c, { smarts: 2, happy: 4 }); return '回村的路上你一言不发。那天晚上，你在课本扉页写下：“我要去城里上大学。”|You were silent on the way home. That night you wrote in your notebook: "I will go to university in the city."'; }),
      O('被城里孩子笑话土|Get laughed at by city kids', R('他们笑你的布鞋和口音。你攥紧了拳头。|They laughed at your cloth shoes and accent. You clenched your fists.', { happy: -6, eq: 2 })),
      O('在商场里走丢了|Get lost in a shopping mall', R('广播里喊了你的名字三遍，爸妈才找到你。|They called your name over the PA three times before your parents found you.', { happy: -2 }))
    ]),
    OE('or_r_pride', 'rural', [17, 20], '全村的骄傲|Pride of the Village', '🧨', '你考上大学的消息传遍了全村。村口放起了鞭炮，乡亲们挨家挨户送来鸡蛋和皱巴巴的钞票。|News of your university admission spreads through the village. Firecrackers go off; neighbors bring eggs and crumpled bills door to door.', [
      O('收下乡亲们的心意|Accept their kindness', function (c) { c.money(c.$(300)); H.fx(c, { happy: 10, karma: 2 }); c.p.flags.villageDebt = 1; return '你把每一笔钱都记在了小本子上，发誓以后加倍报答。|You recorded every gift in a notebook and vowed to repay it many times over.'; }),
      O('婉拒，大家日子都不容易|Decline — everyone is struggling', R('爸爸红着眼眶说：“娃懂事了。”|Dad\'s eyes reddened: "The kid\'s grown up."', { par: 6, karma: 4 }))
    ], { good: 1, w: 8, if: function (S, p) { return p.edu.stage === 'uni' && p.edu.grade <= 1; } }),
    OE('or_r_road_build', 'rural', [30, 70], '修路|Paving the Village Road', '🛣️', '村里那条泥巴路下雨就走不了。村长找到你：“你是村里最有出息的，能不能牵个头？”|The village dirt road turns to mud whenever it rains. The village head asks you, "You\'re our most successful — could you lead the effort?"', [
      O('自掏腰包修路|Pay for it yourself', function (c) { var m = c.$(G.ri(20, 80) * 1000); if (!c.pay(m)) return '你的钱还不够，只能先捐一部分。|You can\'t afford it all yet; you donate what you can.'; c.prm.m = G.M(m); H.fx(c, { karma: 18, rep: 10, happy: 10 }); return '你捐了{m}。新路通车那天，村里人在路口立了块碑，刻着你的名字。|You gave {m}. When the road opened, the village erected a stone with your name on it.'; }),
      O('帮村里跑项目申请资金|Help the village apply for funding', RC(.55, '跑了半年，项目批下来了！|Six months of legwork, and the project was approved!', { karma: 10, rep: 6 }, '材料递上去就没了音讯。|The application vanished into the bureaucracy.', { happy: -4 })),
      O('推说太忙|Say you\'re too busy', R('乡亲们背后说你忘本了。|The villagers say you\'ve forgotten your roots.', { rep: -6, par: -5 }))
    ], { if: function (S, p) { return G.netWorth() > G.$(60000) || p.flags.villageDebt; } }),
    OE('or_r_parents_city', 'rural', [24, 50], '接爸妈进城|Bringing Your Parents to the City', '🏢', '你想把爸妈接到城里住，可他们住了半个月就闹着要回去。|You brought your parents to live in the city, but after two weeks they want to go home.', [
      O('在小区里给他们开一块菜地|Find them a garden plot in your complex', R('爸妈每天在菜地里忙活，脸上又有了笑容。|Your parents tend their plot every day and are smiling again.', { par: 10, happy: 4 })),
      O('送他们回老家，按月寄钱|Send them home and wire money monthly', R('电话里妈妈说：“家里什么都好，你别惦记。”|On the phone Mom says, "Everything\'s fine here, don\'t worry."', { par: 4, money: -1200 })),
      O('劝他们再适应适应|Ask them to give it more time', R('爸爸整天坐在阳台上发呆。|Dad sits on the balcony staring into space all day.', { par: -4 }))
    ], { if: function (S, p) { return hasPar() && p.tier <= 3; } }),

    /* ================= WORKING CLASS ================= */
    OE('or_w_layoff', 'worker', [8, 18], '爸妈下岗了|Your Parents Were Laid Off', '📦', '工厂倒闭了，爸妈一起下了岗。那天晚上，家里没人说话。|The factory closed and both your parents lost their jobs. Nobody spoke at dinner.', [
      O('主动不再要零花钱|Stop asking for pocket money', R('妈妈摸着你的头，转过身去擦眼泪。|Mom stroked your hair and turned away to wipe her eyes.', { par: 6, eq: 3, happy: -3 })),
      O('放学帮妈妈摆摊|Help Mom run a street stall after school', R('你们在夜市卖烤红薯，你的手冻得通红，但算账比谁都快。|You sold roasted sweet potatoes at the night market; your hands froze, but you counted change faster than anyone.', { par: 8, eq: 3, smarts: 1, perf: -3 })),
      O('假装什么都没发生|Pretend nothing happened', R('你把不安都藏在了心里。|You buried the anxiety deep inside.', { happy: -5 }))
    ], { bad: 1, if: function (S, p) { return hasPar() && (p.country !== 'cn' || (S.year >= 1994 && S.year <= 2004)); } }),
    OE('or_w_bike', 'worker', [8, 14], '爸爸的礼物|Dad\'s Present', '🚲', '爸爸偷偷攒了三个月的加班费，给你买了一辆崭新的自行车。|Dad secretly saved three months of overtime pay to buy you a brand-new bicycle.', [
      O('骑着它满大院跑|Ride it all over the neighborhood', R('那是你童年最骄傲的一天。|It was the proudest day of your childhood.', { happy: 10, par: 6 })),
      O('发现爸爸的手又粗糙了|Notice how rough Dad\'s hands have become', R('你第一次觉得，爸爸老了。|For the first time, you realized Dad was getting old.', { eq: 3, par: 8 }))
    ], { good: 1, if: hasPar }),
    OE('or_w_compound', 'worker', [5, 12], '厂区大院|The Factory Compound', '🏘️', '你住在工厂家属院，一个楼道的孩子从早玩到晚。|You live in the factory housing compound; the kids in your stairwell play from dawn to dusk.', [
      O('当孩子王|Become the leader of the pack', function (c) { var f = N.make({ rel: 'friend', age: c.p.age + G.ri(-1, 1), aff: 45 }); c.prm.f = f.name; H.fx(c, { eq: 3, happy: 5 }); return '你带着大家掏鸟窝、捉迷藏，{f}成了你的跟班兼死党。|You led raids on bird nests and games of hide-and-seek; {f} became your sidekick and best friend.'; }),
      O('跟着楼下的老师傅学修收音机|Learn radio repair from the old technician downstairs', R('你拆坏了三台收音机，修好了一台。|You broke three radios and fixed one.', { smarts: 3 }))
    ]),
    OE('or_w_downpay', 'worker', [24, 38], '首付|The Down Payment', '🏠', '爸妈把一张存折推到你面前：“这是我们攒了一辈子的钱，给你付首付。”|Your parents slide a passbook across the table: "This is everything we\'ve saved. It\'s for your down payment."', [
      O('收下|Accept', function (c) { var m = c.$(G.ri(20, 60) * 1000); c.money(m); par().forEach(function (n) { n.wealth = Math.max(0, n.wealth - m / 2); N.addAff(n, 5); }); c.prm.m = G.M(m); return '你接过了{m}。存折上的每一笔，都是他们省吃俭用攒下来的。|You took {m}. Every entry was a meal they skipped.'; }),
      O('推回去：“你们留着养老”|Push it back: "Keep it for your retirement"', R('爸爸没说话，只是又给你倒了杯酒。|Dad said nothing — just poured you another drink.', { par: 6, karma: 4 }))
    ], { if: function (S) { return hasPar() && !S.assets.houses.length; } }),
    OE('or_w_backpain', 'worker', [28, 55], '爸爸的腰|Dad\'s Back', '🩹', '干了一辈子体力活，爸爸的腰终于撑不住了，疼得下不了床。|After a lifetime of hard labor, Dad\'s back has given out. He can\'t get out of bed.', [
      O('带他去大医院做手术|Take him to a top hospital for surgery', function (c) { if (!c.pay(c.$(8000))) return '手术费太贵，你凑不出来。|You couldn\'t scrape together the surgery fee.'; var d = dad(); if (d) { d.health = Math.min(100, d.health + 15); N.addAff(d, 12); } H.fx(c, { karma: 4 }); return '手术很成功，爸爸又能下楼遛弯了。|The surgery worked; Dad can walk around the block again.'; }),
      O('请假回家照顾|Take leave to care for him', R('你给爸爸擦身、喂饭，就像他小时候照顾你一样。|You bathed and fed him, just as he once cared for you.', { par: 10, happy: -2 }))
    ], { bad: 1, if: function () { return !!dad(); } }),

    /* ================= MIDDLE CLASS ================= */
    OE('or_m_classes', 'middle', [5, 12], '兴趣班轰炸|Extracurricular Overload', '🎹', '钢琴、奥数、英语、跆拳道、编程……你的周末被排得满满当当。|Piano, math olympiad, English, taekwondo, coding... your weekends are booked solid.', [
      O('坚持全部学完|Stick with all of them', R('你成了“别人家的孩子”，也成了最累的孩子。|You became the kid other parents brag about — and the most exhausted one.', { smarts: 3, sk: { music: 4 }, stress: 15, happy: -6 })),
      O('哭着求爸妈砍掉两个|Beg in tears to drop two', R('爸妈叹着气同意了。你终于有时间看动画片了。|Your parents sighed and agreed. Finally, time for cartoons.', { happy: 6, par: -2 })),
      O('只留下自己真正喜欢的|Keep only the one you love', R('你把全部热情都放在了画画上，进步飞快。|You poured everything into painting and improved fast.', { sk: { art: 8 }, happy: 4 }))
    ]),
    OE('or_m_district', 'middle', [4, 7], '学区房|The School-District Apartment', '🏫', '为了让你上好学校，爸妈卖掉了宽敞的房子，换了一套又小又旧的学区房。|To get you into a good school, your parents sold their spacious home for a cramped old apartment in a top school district.', [
      O('（你还小，不太懂）|(You\'re too young to understand)', function (c) { c.p.flags.districtQ = 1; if (c.p.edu && c.p.edu.q) c.p.edu.q = Math.min(5, c.p.edu.q + 1); H.fx(c, { par: 4 }); return '后来你才知道，那套小房子花了他们半辈子的积蓄。你上的学校，也比原来的好得多。|Later you learned that tiny flat cost them half their savings — and your school was far better for it.'; })
    ], { if: hasPar, era: { g: 1990, cn: 2003 } }),
    OE('or_m_expect', 'middle', [15, 18], '“你必须考上名校”|"You Must Get Into a Top School"', '📈', '爸妈在你房门上贴了一张名校的照片：“这是你的目标。”|Your parents tape a photo of an elite university to your door: "This is your goal."', [
      O('拼了|Go all in', R('你每天学到凌晨一点，成绩一路往上走。|You studied until 1 a.m. every night, and your grades climbed.', { perf: 10, smarts: 2, stress: 18, health: -3 })),
      O('撕掉照片|Tear it down', R('你和爸妈大吵一架，摔门而出。|You had a huge fight with your parents and slammed the door.', { par: -10, happy: 3 })),
      O('平静地说出自己的梦想|Calmly tell them your own dream', RC(.5, '爸妈沉默了很久，最后说：“我们支持你。”|After a long silence, your parents said, "We support you."', { par: 6, happy: 8 }, '爸妈说：“梦想能当饭吃吗？”|Your parents said, "Can you eat dreams?"', { happy: -4 }))
    ], { if: function (S, p) { return hasPar() && p.edu.stage === 'high'; } }),
    OE('or_m_path', 'middle', [21, 26], '考公、考研还是出国|Civil Service, Grad School, or Abroad?', '🧭', '临近毕业，全家开了一场家庭会议讨论你的前途。|With graduation near, the family holds a meeting about your future.', [
      O('听爸妈的考公|Take the civil service exam as they wish', function (c) { if (G.gov.can() && G.ch(.35 + c.p.st.smarts / 250)) { G.gov.join(); H.fx(c, { par: 10 }); return '你考上了公务员，爸妈逢人就说。|You passed the civil service exam; your parents told everyone.'; } H.fx(c, { happy: -5 }); return '你笔试差了两分。|You missed the written exam by two points.'; }),
      O('出国留学|Go abroad', function (c) { if (!famPay(c, 40000)) return '家里拿不出这么多钱。|The family can\'t afford it.'; c.p.flags.abroadDream = 1; H.fx(c, { smarts: 2, happy: 6 }); return '爸妈拿出积蓄送你出了国。在机场，妈妈哭得像个孩子。|Your parents spent their savings to send you abroad. At the airport, Mom cried like a child.'; }),
      O('坚持自己的选择|Follow your own path', R('“我想自己闯一闯。”爸妈没再说什么。|"I want to try it my way." Your parents didn\'t argue.', { happy: 5, par: -2 }))
    ], { if: function (S, p) { return hasPar() && p.edu.deg >= 3; } }),

    /* ================= SMALL BUSINESS ================= */
    OE('or_s_counter', 'smallbiz', [6, 12], '柜台后的童年|Growing Up Behind the Counter', '🧾', '放学后你就趴在店里的柜台上写作业，顺便帮爸妈收钱。|After school you do homework on the shop counter and ring up customers.', [
      O('算账又快又准|Make change fast and accurate', R('街坊都叫你“小掌柜”。|The neighbors call you "the little shopkeeper."', { smarts: 2, eq: 3 })),
      O('偷偷从抽屉里拿零钱|Pinch coins from the register', RC(.6, '没人发现，你买了一堆零食。|Nobody noticed; you bought a pile of snacks.', { happy: 4, karma: -3 }, '爸爸对账时发现了，你挨了一顿揍。|Dad caught it at closing time. You got a spanking.', { par: -6, happy: -6 })),
      O('观察每一个客人|Study every customer', R('你学会了一眼看出谁是来买东西的，谁是来闲逛的。|You learned to tell at a glance who was buying and who was browsing.', { eq: 5 }))
    ]),
    OE('or_s_rent', 'smallbiz', [10, 28], '房租翻倍|The Rent Doubles', '📄', '房东通知下个月房租翻倍，家里的小店眼看要撑不下去了。|The landlord announces rent will double next month. The family shop may not survive.', [
      O('出主意：搬到小巷里|Suggest moving to a cheaper alley', RC(.6, '新店面小了，但老顾客都跟了过来。|The new spot is smaller, but the regulars followed.', { par: 6, eq: 2 }, '搬了以后生意一落千丈。|Business collapsed after the move.', { happy: -6 })),
      O('出主意：做线上生意|Suggest selling online', function (c) { if (G.S.year < 2008) return '爸妈听不懂“网上卖东西”是什么意思。|Your parents couldn\'t understand what "selling online" meant.'; if (G.ch(.5)) { par().forEach(function (n) { n.wealth += c.$(20000); }); H.fx(c, { par: 10, smarts: 2 }); return '你帮家里开了网店，订单比实体店还多！|You set up an online store — more orders than the physical shop!'; } return '网店没什么人看。|The online shop got little traffic.'; }),
      O('认了，关店|Accept it and close', function (c) { par().forEach(function (n) { n.wealth = Math.round(n.wealth * .7); }); H.fx(c, { happy: -6 }); return '卷帘门拉下来的那天，爸爸在门口站了很久。|The day the shutter came down, Dad stood in front of it for a long time.'; })
    ], { bad: 1, if: hasPar }),
    OE('or_s_rival', 'smallbiz', [12, 30], '对门开了家一样的店|A Rival Opens Across the Street', '🏪', '对面新开了一家一模一样的店，还搞开业大酬宾。|An identical shop opens across the street with a grand-opening sale.', [
      O('打价格战|Start a price war', RC(.45, '对方撑了三个月，关门了。|They lasted three months, then closed.', { par: 4, eq: 2 }, '两家都亏了钱。|Both shops lost money.', { happy: -4 })),
      O('拼服务和口碑|Compete on service and reputation', R('老顾客说：“还是你家实在。”|The regulars say, "Your place is still the honest one."', { eq: 3, rep: 3 })),
      O('去对面谈合作|Go over and propose a partnership', RC(.4, '两家分工合作，生意反而都好了。|You divided the market and both businesses grew.', { eq: 5, par: 4 }, '对方老板把你赶了出来。|The owner threw you out.', { happy: -3 }))
    ], { if: hasPar }),
    OE('or_s_takeover', 'smallbiz', [22, 40], '接手家里的店|Taking Over the Family Shop', '🔑', '爸妈老了，想把店交给你。|Your parents are getting old and want to hand the shop to you.', [
      O('接手，把它做大|Take over and grow it', function (c) { if (c.S.assets.company) return '你已经有自己的公司了，只好婉拒。|You already run a company and had to decline.'; G.biz.start(G.pick(['food', 'retail']), 30000); H.fx(c, { par: 10 }); return '你接过了钥匙，给小店换了新招牌。|You took the keys and hung a new sign.'; }),
      O('婉拒，你有自己的路|Decline — you have your own path', R('爸妈把店盘了出去。|Your parents sold the shop.', { par: -3, money: 2000 }))
    ], { if: function (S, p) { return hasPar() && !S.assets.company; } }),

    /* ================= MERCHANT (rich) ================= */
    OE('or_mc_driver', 'merchant', [6, 14], '专车接送|Chauffeured to School', '🚘', '每天放学，一辆黑色轿车停在校门口接你。同学们看你的眼神变了。|Every day a black sedan picks you up. Your classmates look at you differently.', [
      O('让司机停远一点|Ask the driver to park around the corner', R('你和同学们一起走出校门，慢慢交到了朋友。|You walked out with everyone else and slowly made real friends.', { eq: 4, happy: 3 })),
      O('请同学们坐车兜风|Offer classmates rides', R('你一下子成了班里最受欢迎的人。可他们是真心的吗？|You became the most popular kid overnight. But are they real friends?', { happy: 5, eq: -1 }))
    ]),
    OE('or_mc_party', 'merchant', [16, 24], '富二代派对|A Rich Kids\' Party', '🍾', '朋友邀请你去游艇派对，有人在甲板上点了一瓶三十万的香槟。|Friends invite you to a yacht party; someone orders a ¥300,000 bottle of champagne.', [
      O('尽情享受|Live it up', function (c) { c.p.hab.night = Math.min(100, c.p.hab.night + 15); H.fx(c, { happy: 8, money: -3000, drink: 6 }); var n = N.mkRomantic({ tags: ['rich'], love: G.ri(30, 60), aff: 25 }); c.prm.m = n.name; return '你玩到天亮，还认识了同样家境优渥的{m}。|You partied till dawn and met {m}, from a family as wealthy as yours.'; }),
      O('提前离开|Leave early', R('你觉得这种生活很空虚。|The whole scene felt empty to you.', { smarts: 1, karma: 2 }))
    ]),
    OE('or_mc_collapse', 'merchant', [12, 35], '家族生意崩盘|The Family Business Collapses', '📉', '父亲的生意资金链断裂，银行上门清算，家里一夜之间从云端跌落。|Dad\'s business ran out of cash. The banks moved in, and overnight the family fell from the clouds.', [
      O('陪父亲东山再起|Help Dad start over', function (c) { par().forEach(function (n) { n.wealth = Math.round(n.wealth * .1); N.addAff(n, 10); }); c.p.flags.rich = 0; c.p.flags.fallen = 1; H.fx(c, { eq: 5, happy: -8 }); return '你们搬进了出租屋。父亲说：“钱没了可以再挣，家还在就好。”|You moved into a rental. Dad said, "Money can be earned again. As long as we\'re together."'; }),
      O('冷眼旁观，自己另谋出路|Step back and fend for yourself', function (c) { par().forEach(function (n) { n.wealth = Math.round(n.wealth * .1); N.addAff(n, -10); }); c.p.flags.rich = 0; c.p.flags.fallen = 1; H.fx(c, { happy: -10 }); return '曾经围着你转的朋友，一夜之间都消失了。|The friends who once swarmed around you vanished overnight.'; })
    ], { bad: 1, w: .8, if: function (S, p) { return hasPar() && !p.flags.fallen; } }),
    OE('or_mc_match', 'merchant', [22, 35], '商业联姻|An Arranged Match', '💍', '父亲安排你和合作伙伴的孩子见面，“对两家的生意都好”。|Dad arranges for you to meet his business partner\'s child — "good for both families\' business."', [
      O('去见见|Go to the meeting', function (c) { var n = N.mkRomantic({ tags: ['rich'], love: G.ri(35, 65), aff: 30, minGap: -4, maxGap: 5 }); n.rel = 'admirer'; c.prm.m = n.name; H.fx(c, { par: 6 }); return '{m}比你想象的有趣得多。你们约好了下次再见。|{m} turned out to be far more interesting than you expected. You agreed to meet again.'; }),
      O('拒绝：“我的婚姻我做主”|Refuse: "I choose who I marry"', R('父亲拍了桌子，但最后没再提这件事。|Dad slammed the table, but never raised it again.', { par: -8, happy: 4 }))
    ], { if: function (S, p) { return hasPar() && !N.spouse(); } }),

    /* ================= SCHOLARLY ================= */
    OE('or_sc_study', 'scholar', [5, 10], '满墙的书|Walls of Books', '📚', '家里的书架顶到天花板。你踩着小板凳，抽出了一本比你还老的书。|The bookshelves reach the ceiling. Standing on a stool, you pull out a book older than you.', [
      O('读《十万个为什么》|Read "A Hundred Thousand Whys"', R('你成了班里的“百科全书”。|You became the class encyclopedia.', { smarts: 4 })),
      O('背唐诗宋词|Memorize classical poetry', R('你在家宴上背了一首长诗，满座皆惊。|You recited a long poem at a family dinner and stunned everyone.', { smarts: 2, eq: 2, par: 4 })),
      O('偷看爸爸藏起来的武侠小说|Sneak Dad\'s hidden martial-arts novels', R('原来爸爸也爱看这个！你们有了共同的秘密。|Turns out Dad loves them too! Now you share a secret.', { happy: 6, par: 4 }))
    ]),
    OE('or_sc_calligraphy', 'scholar', [8, 15], '每天一百个字|A Hundred Characters a Day', '🖌️', '爸爸要求你每天练一百个毛笔字，写不好就重来。|Dad makes you write a hundred brush characters a day; sloppy ones must be redone.', [
      O('静下心来练|Settle in and practice', R('几年后，你的字被选去参加全市书法比赛。|Years later, your calligraphy was chosen for the city competition.', { sk: { art: 6 }, eq: 2, stress: -4 })),
      O('偷偷让表哥代写|Get your cousin to write them', RC(.5, '爸爸没看出来。|Dad didn\'t notice.', { happy: 3 }, '爸爸一眼就认出来了：“这不是你的字。”|Dad spotted it instantly: "This isn\'t your hand."', { par: -6 }))
    ], { if: hasPar }),
    OE('or_sc_guest', 'scholar', [13, 20], '家里来了位大学者|A Great Scholar Comes to Dinner', '🎓', '爸爸的老师——一位白发苍苍的老教授来家里做客，问了你一个问题。|Dad\'s old professor, a white-haired scholar, visits and asks you a question.', [
      O('认真作答|Answer thoughtfully', async function (c) { var r = await c.game('quiz', { name: '老教授的考题|The Professor\'s Question', n: 3 }); if (r.win) { var m = N.make({ rel: 'mentor', age: G.ri(70, 82), job: '大学教授|Professor Emeritus', inc: G.$w(60000), smarts: 96, aff: 45, pers: 'nerd' }); m.pin = 1; c.prm.m = m.name; H.fx(c, { smarts: 2, happy: 6 }); return '老教授连连点头，说你是块做学问的料，以后有问题随时找他。{m}成了你的恩师。|The professor nodded: "A born scholar." {m} became your mentor.'; } return '你答得磕磕巴巴，老教授笑着拍了拍你的头。|You stumbled through it; the professor smiled and patted your head.'; }),
      O('害羞地躲进房间|Hide shyly in your room', R('爸爸有点失望。|Dad was a little disappointed.', { par: -2 }))
    ]),
    OE('or_sc_path', 'scholar', [18, 26], '书香与铜臭|Scholarship or Money?', '⚖️', '你想去做生意/当网红，爸妈却希望你读博做学问。|You want to go into business or entertainment; your parents want you to get a PhD.', [
      O('继承家学|Carry on the family tradition', R('爸爸欣慰地说：“我们家后继有人了。”|Dad said with relief, "The family has an heir."', { par: 10, smarts: 2, flag: 'scholarPath' })),
      O('坚持自己的选择|Follow your own choice', R('爸爸叹了口气：“人各有志。”|Dad sighed: "Everyone has their own calling."', { par: -5, happy: 6 }))
    ], { if: hasPar }),
    OE('or_sc_letters', 'scholar', [40, 75], '父亲的手稿|Father\'s Manuscripts', '📜', '整理父亲的书房时，你发现了一箱他年轻时写的诗稿和日记。|Clearing out Father\'s study, you find a box of poems and diaries from his youth.', [
      O('整理出版|Publish them', R('诗集出版了。你在序言里写：“谨以此书献给我的父亲。”|The collection was published. Your preface read: "For my father."', { happy: 8, fame: 2, money: -500 })),
      O('一个人慢慢读完|Read them slowly, alone', R('你第一次认识了年轻时的父亲：他也迷茫过、爱过、失落过。|For the first time you met your father as a young man — lost, in love, heartbroken.', { happy: 4, eq: 3 }))
    ], { if: function () { var d = N.rel('father')[0]; return !d || !d.alive || N.age(d) > 75; } }),

    /* ================= MEDICAL ================= */
    OE('or_md_ward', 'medical', [5, 12], '医院里长大|Growing Up in the Hospital', '🏥', '放学后你在医院的走廊里写作业，等爸妈下手术。|After school you do homework in the hospital corridor, waiting for your parents to finish surgery.', [
      O('和住院的小病友交朋友|Befriend a young patient', function (c) { var f = N.make({ rel: 'friend', age: c.p.age, aff: 40, health: 35 }); c.prm.f = f.name; H.fx(c, { eq: 4, karma: 3 }); return '你每天给{f}讲学校的事。{f}说你是最好的朋友。|You told {f} about school every day. {f} called you their best friend.'; }),
      O('偷看医学书上的图|Peek at the anatomy books', R('你吓得做了一晚上噩梦，但从此对人体着了迷。|It gave you nightmares — and a lifelong fascination with the human body.', { smarts: 3 }))
    ]),
    OE('or_md_birthday', 'medical', [6, 14], '又一个人的生日|Another Birthday Alone', '🎂', '生日那天，爸妈临时被叫去抢救病人，蛋糕还在冰箱里。|On your birthday your parents are called in for an emergency; the cake sits in the fridge.', [
      O('自己切蛋糕|Cut the cake yourself', R('你给爸妈各留了一块，在上面插了张纸条：“救人加油。”|You saved them each a slice with a note: "Go save lives."', { eq: 4, par: 6, happy: -3 })),
      O('生闷气|Sulk', R('爸妈半夜回来，看着你的睡脸，心里很愧疚。|They came home at midnight, looked at your sleeping face, and felt guilty.', { par: 2, happy: -5 }))
    ], { if: hasPar }),
    OE('or_md_checkup', 'medical', [28, 70], '家里的医生|A Doctor in the Family', '🩺', '妈妈看了看你的脸色，皱起了眉头：“明天跟我去医院做个检查。”|Mom studies your face and frowns: "Come to the hospital with me tomorrow for tests."', [
      O('乖乖去|Go as told', function (c) { var hid = c.p.ill.filter(function (x) { return !x.known; }); hid.forEach(function (x) { x.known = 1; }); if (hid.length) { c.prm.d = G.ILL[hid[0].id].n; return '果然查出了{d}，还好发现得早。|Sure enough, they found {d} — early, thankfully.'; } H.fx(c, { health: 2 }); return '检查结果一切正常，妈妈松了口气。|Everything was normal. Mom finally relaxed.'; }),
      O('“我好着呢！”|"I\'m fine!"', R('妈妈念叨了你一整晚。|Mom nagged you all evening.', { par: -2 }))
    ], { if: function () { return par().some(function (n) { return /医|Doctor|Surgeon|Nurse/.test(n.job || ''); }); } }),

    /* ================= MILITARY ================= */
    OE('or_ml_drill', 'military', [6, 12], '军事化管理|Boot Camp at Home', '🎖️', '爸爸要求你每天六点起床，被子叠成豆腐块，晨跑三公里。|Dad has you up at six every day — bed made with hospital corners, then a 3 km run.', [
      O('咬牙执行|Follow orders', R('你成了班里体育最好的孩子，做事也特别有条理。|You became the fittest kid in class and incredibly organized.', { fit: 10, health: 4, eq: 2 })),
      O('偷偷赖床|Sneak extra sleep', RC(.4, '爸爸出差了，你连睡了三天懒觉。|Dad was away; you slept in for three days straight.', { happy: 4 }, '你被罚多跑了五公里。|You got five extra kilometers as punishment.', { fit: 6, happy: -5 }))
    ], { if: function () { return !!dad(); } }),
    OE('or_ml_move', 'military', [7, 16], '又要搬家了|Moving Again', '🚚', '爸爸调防了，全家又要搬到一个陌生的城市。这是你第四次转学。|Dad has been reassigned; the family is moving again. Your fourth new school.', [
      O('很快融入新环境|Settle in fast', function (c) { N.rel('classmate', 'friend').forEach(function (n) { if (n.aff < 60) delete c.S.npcs[n.id]; }); H.fx(c, { eq: 5 }); return '你已经习惯了在第一天就记住全班同学的名字。|You\'ve learned to memorize every classmate\'s name on day one.'; }),
      O('舍不得老朋友|Miss your old friends', R('你和老朋友约好每周写信。|You and your old friends promised to write every week.', { happy: -6, eq: 2 }))
    ]),
    OE('or_ml_mission', 'military', [10, 20], '爸爸执行任务去了|Dad Is on a Mission', '📻', '爸爸接到任务走了，好几个月没有消息。妈妈每晚都守着电话。|Dad left on a mission and hasn\'t been heard from in months. Mom waits by the phone every night.', [
      O('（等待）|(Wait)', function (c) { var d = dad(); if (d && G.ch(.15)) { d.health = Math.max(20, d.health - 35); H.fx(c, { happy: -10 }); return '爸爸回来了，可他受了重伤，右腿再也走不利索了。|Dad came back — badly wounded. His right leg would never be the same.'; } H.fx(c, { happy: 8, par: 6 }); return '一个深夜，门开了，爸爸晒得黝黑，笑着说：“我回来了。”|Late one night the door opened. Dad, sunburned and smiling, said, "I\'m home."'; })
    ], { if: function () { return !!dad(); } }),
    OE('or_ml_enlist', 'military', [17, 21], '子承父业|Following in His Footsteps', '🪖', '爸爸把他的旧军装拿出来，问你：“想不想穿上它？”|Dad takes out his old uniform: "Want to wear this someday?"', [
      O('参军！|Enlist!', function (c) { if (!G.mil.can()) return '你的条件还不符合入伍要求。|You don\'t yet meet the enlistment requirements.'; G.mil.enlist('army'); H.fx(c, { par: 12 }); return '你穿上了军装。爸爸敬了一个标准的军礼，眼眶红了。|You put on the uniform. Dad gave a perfect salute, eyes red.'; }),
      O('我想走自己的路|I want my own path', R('爸爸沉默了一会儿，把军装放回了柜子。|Dad was quiet, then put the uniform back in the closet.', { par: -4 }))
    ], { if: function (S, p) { return !!dad() && !p.mil; } }),

    /* ================= POLICE ================= */
    OE('or_pl_alone', 'police', [6, 12], '一个人的晚饭|Dinner for One', '🍜', '爸妈又在加班办案。你踩着凳子，学会了自己煮面。|Your parents are working a case again. Standing on a stool, you learn to cook noodles yourself.', [
      O('研究菜谱|Study recipes', R('没过多久，你就能做三菜一汤了。爸妈吃得眼泪汪汪。|Soon you could cook a full dinner. Your parents teared up eating it.', { eq: 3, par: 6, sk: { cook: 6 } })),
      O('去邻居家蹭饭|Eat at the neighbors\'', R('邻居阿姨成了你的“第二个妈妈”。|The neighbor became your second mom.', { happy: 3, eq: 2 }))
    ], { if: hasPar }),
    OE('or_pl_revenge', 'police', [10, 22], '报复|Revenge', '⚠️', '一个被爸妈抓过的犯人刑满释放了，有人看到他在你家楼下转悠。|A criminal your parents once arrested has been released, and he\'s been seen loitering outside.', [
      O('告诉爸妈|Tell your parents', R('爸爸找他谈了一次。那人再也没出现过。|Dad had a word with him. He never showed up again.', { par: 4 })),
      O('自己小心|Just be careful', RC(.75, '有惊无险。|Nothing happened.', {}, '他在放学路上拦住了你，你拼命跑掉了。|He cornered you on the way home; you ran for your life.', { happy: -10, health: -4 }))
    ], { bad: 1, if: hasPar }),
    OE('or_pl_hurt', 'police', [8, 28], '爸爸受伤了|Dad Was Hurt', '🚑', '爸爸在抓捕歹徒时被刺伤，正在抢救。|Dad was stabbed while making an arrest. He\'s in surgery.', [
      O('守在手术室外|Wait outside the operating room', function (c) { var d = dad(); if (d) d.health = Math.max(25, d.health - 20); H.fx(c, { par: 10, happy: -8 }); return '手术做了六个小时。爸爸醒来第一句话是：“人抓住了吗？”|Six hours of surgery. Dad\'s first words: "Did we get him?"'; })
    ], { bad: 1, if: function () { return !!dad(); } }),
    OE('or_pl_join', 'police', [18, 24], '警徽的传承|Passing On the Badge', '👮', '爸爸问你愿不愿意报考警察。|Dad asks whether you\'d consider joining the police.', [
      O('报考！|Apply!', function (c) { if (!G.police.can()) return '你的条件还不符合要求。|You don\'t yet meet the requirements.'; G.police.join(false); H.fx(c, { par: 10 }); return '你穿上了警服，爸爸把自己的旧警号贴在了你的床头。|You put on the uniform; Dad hung his old badge number above your bed.'; }),
      O('不了，太危险|No — too dangerous', R('爸爸笑了笑：“也好。”|Dad smiled: "Maybe that\'s for the best."', {}))
    ], { if: function (S, p) { return !!dad() && !p.pol; } }),

    /* ================= CIVIL SERVANT ================= */
    OE('or_cv_table', 'civil', [8, 16], '饭桌上的规矩|Table Manners', '🥢', '家里来客人吃饭，爸爸教你：谁坐主位、先给谁敬酒、哪些话不能说。|Guests are coming. Dad teaches you who sits where, who to toast first, and what never to say.', [
      O('认真学|Learn it well', R('你从小就学会了察言观色。|You learned to read a room from a young age.', { eq: 6 })),
      O('觉得太虚伪|Find it all fake', R('你在饭桌上说了句大实话，场面很尴尬。|You said something honest at dinner. It was awkward.', { karma: 2, par: -3 }))
    ], { if: hasPar }),
    OE('or_cv_connection', 'civil', [21, 28], '“我给你安排了个工作”|"I\'ve Arranged a Job for You"', '📋', '爸爸托老同事给你在机关里安排了个位置，“稳定，体面”。|Dad pulled strings with old colleagues to get you a government post — "stable and respectable."', [
      O('接受|Accept', function (c) { if (c.p.gov) return '你已经在体制内了。|You\'re already in the system.'; if (c.p.edu.deg < 4) return '学历不够，关系也没用。|Without a degree, connections couldn\'t help.'; G.gov.join(); H.fx(c, { par: 10, karma: -3 }); return '你进了机关，端上了铁饭碗。|You joined the government — an iron rice bowl.'; }),
      O('拒绝，凭本事|Refuse — earn it yourself', R('爸爸嘴上骂你倔，心里却有点骄傲。|Dad grumbled about your stubbornness, but was secretly proud.', { par: 2, karma: 4, happy: 4 }))
    ], { if: function (S, p) { return hasPar() && !p.gov; } }),
    OE('or_cv_probe', 'civil', [15, 45], '爸爸被调查了|Dad Is Under Investigation', '🔎', '纪委的人带走了爸爸，说要“配合调查”。家里乱成一团。|Investigators took Dad away "to assist an inquiry." The family is in chaos.', [
      O('相信爸爸是清白的|Believe he\'s innocent', function (c) { var d = dad(); if (G.ch(.6)) { if (d) N.addAff(d, 10); H.fx(c, { happy: 6 }); return '一个月后，爸爸回来了：查清楚了，没事。|A month later Dad came home: cleared.'; } if (d) { d.job = '服刑中|In Prison'; d.inc = 0; d.wealth = Math.round(d.wealth * .2); } c.p.flags.govfam = 0; H.fx(c, { happy: -15, rep: -6 }); return '爸爸被判了刑。你这才知道家里的钱是怎么来的。|Dad was convicted. Only then did you learn where the family money came from.'; })
    ], { bad: 1, w: .7, if: function () { return !!dad(); } }),

    /* ================= ARTISTIC ================= */
    OE('or_at_feast', 'artist', [6, 16], '时富时穷|Feast or Famine', '🎨', function (c) { return c.prm.good ? '爸爸的画卖出去了！全家去吃了顿大餐。|Dad sold a painting! The whole family went out for a feast.' : '这个月一幅画都没卖出去，家里只剩下挂面。|Not a single painting sold this month. All that\'s left is plain noodles.'; }, [
      O('（继续生活）|(Life goes on)', function (c) { var good = c.prm.good; H.fx(c, good ? { happy: 6 } : { happy: -4, eq: 2 }); return good ? '爸爸说：“艺术总有一天会被看见的。”|Dad said, "Art always gets seen eventually."' : '妈妈弹着钢琴说：“穷日子也能过出诗意。”|Mom played the piano: "Even hard times can be poetry."'; })
    ], { rep: 1, cd: 4, prep: function (c) { c.prm.good = G.ch(.5); } }),
    OE('or_at_gift', 'artist', [4, 10], '艺术的种子|The Seed of Art', '🎻', '你随手画的一幅画/哼的一段旋律，让爸妈惊呆了。|A doodle you made (or a tune you hummed) stops your parents in their tracks.', [
      O('跟爸爸学画|Learn painting from Dad', R('你的画里有一种别人教不出来的东西。|Your paintings had something that can\'t be taught.', { sk: { art: 10 }, happy: 4 })),
      O('跟妈妈学琴|Learn piano from Mom', R('你的手指在琴键上跳起舞来。|Your fingers danced across the keys.', { sk: { music: 10 }, happy: 4 }))
    ], { if: hasPar }),
    OE('or_at_freedom', 'artist', [14, 18], '“想退学就退吧”|"Drop Out If You Want"', '🕊️', '你说不想读书了，想专心画画/做音乐。没想到爸妈说：“随你。”|You say you want to quit school for art or music. Your parents just say, "Up to you."', [
      O('真的退学|Actually drop out', function (c) { c.p.edu.stage = 'done'; H.fx(c, { happy: 8, sk: { art: 6, music: 6 } }); return '你背着画板去流浪了。|You set off wandering with your sketchbook.'; }),
      O('还是先读完书|Finish school first', R('你白天上课，晚上创作。|Classes by day, art by night.', { stress: 6, sk: { art: 3 } }))
    ], { if: function () { return hasPar() && G.school.inSchool(); } }),
    OE('or_at_auction', 'artist', [25, 70], '拍卖会上的天价|A Record at Auction', '🔨', '父亲年轻时的一幅画在拍卖会上拍出了天价，可他生前一直穷困潦倒。|One of Father\'s early paintings sells for a fortune at auction — though he lived his whole life in poverty.', [
      O('（沉默）|(Silence)', function (c) { var d = N.rel('father')[0]; var m = c.$(G.ri(20, 200) * 1000); if (d && d.alive) { d.wealth += m; H.fx(c, { happy: 8, par: 6 }); return '爸爸听到消息，笑着摇了摇头：“晚了二十年。”|Dad laughed and shook his head: "Twenty years too late."'; } c.money(m); c.prm.m = G.M(m); H.fx(c, { happy: 4 }); return '作为继承人，你得到了{m}。你在他的墓前坐了很久。|As his heir you received {m}. You sat at his grave a long time.'; })
    ], { good: 1, w: 1.2 }),

    /* ================= SINGLE PARENT ================= */
    OE('or_sg_weekend', 'single', [5, 14], '周末的探视|Weekend Visits', '🎡', '每隔一个周末，{n}会来接你出去玩。|Every other weekend, {n} picks you up for a day out.', [
      O('开心地出门|Go out happily', R('你们去了游乐园。回来时你在车上睡着了。|You went to the amusement park and fell asleep in the car on the way back.', { happy: 6, npc: 8 })),
      O('故意冷着脸|Give the cold shoulder', R('{n}一路都在找话题，你一句也没接。|{n} kept trying to make conversation; you said nothing.', { npc: -8, happy: -2 }))
    ], { rep: 1, cd: 3, prep: function (c) { var a = N.all(function (n) { return (n.rel === 'father' || n.rel === 'mother') && n.alive && n.sep; })[0]; if (!a) return false; pp(c, a); } }),
    OE('or_sg_meeting', 'single', [7, 15], '家长会|Parent-Teacher Night', '🏫', '家长会上，别人都是爸爸妈妈一起来，只有你家来了一个人。|At parent-teacher night, everyone else has two parents there. You have one.', [
      O('紧紧牵着{n}的手|Hold {n}\'s hand tight', R('{n}悄悄跟你说：“有我在。”|{n} whispered, "I\'m here."', { npc: 8, eq: 3 })),
      O('觉得很丢人|Feel embarrassed', R('回家的路上，你们谁都没说话。|Neither of you spoke on the way home.', { happy: -6 }))
    ], { prep: function (c) { var a = N.all(function (n) { return (n.rel === 'father' || n.rel === 'mother') && n.alive && !n.sep; })[0]; if (!a) return false; pp(c, a); } }),
    OE('or_sg_carer', 'single', [12, 18], '早当家|Growing Up Fast', '🧺', '{n}累病了，你一边上学一边照顾{him}，还要做饭洗衣。|{n} has worked into illness. You go to school, care for {him}, cook, and do the laundry.', [
      O('撑起这个家|Hold the family together', R('你瘦了一圈，但从没在{n}面前掉过一滴眼泪。|You grew thin, but never cried in front of {n}.', { eq: 6, npc: 12, perf: -4, health: -2 })),
      O('打电话向另一方求助|Call your other parent for help', RC(.5, '另一方赶来帮忙，你终于能喘口气了。|Your other parent came to help; you could finally breathe.', { happy: 4 }, '电话那头说：“我也很忙。”|The voice on the phone said, "I\'m busy too."', { happy: -6 }))
    ], { bad: 1, prep: function (c) { var a = N.all(function (n) { return (n.rel === 'father' || n.rel === 'mother') && n.alive && !n.sep; })[0]; if (!a) return false; pp(c, a); } }),
    OE('or_sg_reconcile', 'single', [22, 55], '迟到的道歉|A Belated Apology', '✉️', '多年未联系的{n}寄来一封长信，说当年对不起你。|{n}, estranged for years, sends a long letter apologizing for the past.', [
      O('原谅{him}|Forgive {him}', R('你们约在小时候常去的餐馆见面，{n}老了很多。|You met at the restaurant you used to go to; {n} had aged a lot.', { npc: 25, happy: 8, eq: 3 })),
      O('还没准备好|Not ready yet', R('你把信放进了抽屉最深处。|You put the letter at the back of a drawer.', { happy: -2 })),
      O('烧掉|Burn it', R('有些伤，不是一封信能抚平的。|Some wounds a letter can\'t heal.', { npc: -15 }))
    ], { prep: function (c) { var a = N.all(function (n) { return (n.rel === 'father' || n.rel === 'mother') && n.alive && n.sep; })[0]; if (!a) return false; pp(c, a); } }),

    /* ================= LEFT-BEHIND ================= */
    OE('or_lb_call', 'leftbehind', [5, 12], '每周一次的电话|The Weekly Phone Call', '☎️', '每周六晚上，爸妈会从城里打来电话。你攥着话筒，不知道说什么。|Every Saturday night your parents call from the city. You clutch the receiver, not knowing what to say.', [
      O('说“我想你们”|Say "I miss you"', R('电话那头沉默了好久，然后是妈妈压抑的哭声。|Long silence on the line — then Mom\'s muffled crying.', { par: 8, happy: -3 })),
      O('说“我很好，你们放心”|Say "I\'m fine, don\'t worry"', R('挂了电话，你一个人跑到后山哭了。|After hanging up, you ran to the hill behind the house and cried alone.', { eq: 3, happy: -4 }))
    ], { rep: 1, cd: 3, if: function () { return par().some(function (n) { return n.away; }); } }),
    OE('or_lb_grandma', 'leftbehind', [8, 15], '奶奶病了|Grandma Is Sick', '👵', '一直照顾你的奶奶病倒了。家里只有你们两个人。|Grandma, who raised you, has fallen ill. It\'s just the two of you at home.', [
      O('请假照顾奶奶|Stay home to care for her', function (c) { var g = N.rel('grand').filter(function (n) { return n.alive; })[0]; if (g) { N.addAff(g, 15); g.health = Math.min(100, g.health + 8); } H.fx(c, { eq: 4, perf: -5 }); return '你学会了熬药、做饭。奶奶说：“我孙子/孙女长大了。”|You learned to brew medicine and cook. Grandma said, "My grandchild has grown up."'; }),
      O('打电话叫爸妈回来|Call your parents home', RC(.5, '爸妈连夜坐火车赶了回来。|Your parents rode the overnight train home.', { par: 6 }, '爸妈说厂里请不了假，寄了钱回来。|They couldn\'t get leave; they sent money instead.', { happy: -6 }))
    ], { bad: 1, if: function () { return N.rel('grand').some(function (n) { return n.alive; }); } }),
    OE('or_lb_city', 'leftbehind', [9, 15], '去城里找爸妈|Summer in the City', '🏗️', '暑假，你坐了二十个小时火车去城里看爸妈。他们住在工地旁边的板房里。|In summer you ride twenty hours by train to see your parents. They live in a shack beside a construction site.', [
      O('看爸妈干活|Watch your parents work', R('烈日下，爸爸扛着水泥爬上脚手架。你突然明白了什么。|Under the blazing sun Dad carried cement up the scaffolding. Something clicked inside you.', { par: 10, eq: 4, perf: 3 })),
      O('吵着要去游乐园|Beg to go to the amusement park', R('爸妈花了半个月工资带你去了。你玩得很开心，他们很心疼钱。|They spent half a month\'s pay to take you. You had fun; they quietly winced.', { happy: 8, par: 2 }))
    ], { if: function () { return par().some(function (n) { return n.away; }); } }),
    OE('or_lb_return', 'leftbehind', [14, 25], '熟悉的陌生人|Familiar Strangers', '🚪', '爸妈终于回家定居了，可你发现自己不知道该怎么和他们相处。|Your parents finally move back home for good, but you don\'t know how to be around them.', [
      O('慢慢试着靠近|Slowly try to get close', R('你们一起做了顿饭，那是很多年来第一顿团圆饭。|You cooked dinner together — your first family meal in years.', { par: 12, happy: 4 })),
      O('保持距离|Keep your distance', R('你们之间像隔着一堵墙。|There\'s a wall between you.', { par: -6, happy: -3 }))
    ], { if: function () { return par().some(function (n) { return n.away; }); }, prep: function () { par().forEach(function (n) { n.away = 0; }); } }),

    /* ================= ORPHAN ================= */
    OE('or_or_birthday', 'orphan', [5, 12], '没人记得的生日|The Forgotten Birthday', '🕯️', '今天是你的生日，可福利院里没有人记得。|Today is your birthday, but no one at the orphanage remembers.', [
      O('自己对着星星许愿|Make a wish on the stars', R('你许愿有一天能有一个家。|You wished that one day you\'d have a family.', { happy: -3, eq: 2 })),
      O('告诉院长阿姨|Tell the director', function (c) { var d = N.rel('mentor')[0]; if (d) N.addAff(d, 8); H.fx(c, { happy: 6 }); return '院长阿姨连夜给你煮了碗长寿面，还卧了个鸡蛋。|The director made you longevity noodles with an egg that very night.'; })
    ]),
    OE('or_or_adopt', 'orphan', [3, 10], '有人想领养你|Someone Wants to Adopt You', '🏡', '一对夫妻来到福利院，在所有孩子里，他们一眼看中了你。|A couple visits the orphanage and, among all the children, chooses you.', [
      O('跟他们回家|Go home with them', function (c) { var p = c.p, m = N.make({ rel: 'mother', g: 'f', age: G.ri(32, 42), aff: 50, pers: 'gentle' }), f = N.make({ rel: 'father', g: 'm', age: G.ri(33, 44), aff: 45 }); m.pin = f.pin = 1; p.flags.adopted = 1; H.fx(c, { happy: 20 }); return '你有了爸爸妈妈。第一天晚上，妈妈给你讲故事讲到你睡着。|You had a mom and dad. That first night, Mom read to you until you fell asleep.'; }),
      O('舍不得福利院的伙伴|You can\'t leave your friends', R('你躲在了床底下。那对夫妻遗憾地走了。|You hid under the bed. The couple left, disappointed.', { happy: -4, eq: 2 }))
    ], { if: function (S, p) { return !N.rel('father', 'mother').length; } }),
    OE('or_or_leave', 'orphan', [16, 18], '离开福利院|Leaving the Orphanage', '🎒', '你成年了，要离开福利院独立生活。院长阿姨塞给你一个信封。|You\'re of age and must leave the orphanage. The director presses an envelope into your hand.', [
      O('打开信封|Open the envelope', function (c) { c.money(c.$(800)); H.fx(c, { happy: 4 }); return '里面有一笔钱，和一张字条：“这里永远是你的家。”|Inside was some money and a note: "This will always be your home."'; })
    ], { if: function (S, p) { return !p.flags.adopted; } }),
    OE('or_or_search', 'orphan', [18, 50], '寻亲|Searching for Your Birth Parents', '🧬', '你在网上看到一个寻亲DNA数据库，犹豫要不要去采血。|You find a DNA registry for families searching for lost children and wonder whether to submit a sample.', [
      O('去采血|Submit a sample', function (c) { if (G.ch(.35)) { var m = N.make({ rel: 'contact', g: G.ch(.5) ? 'm' : 'f', age: c.p.age + G.ri(20, 30), aff: 30 }); m.pin = 1; c.prm.m = m.name; H.fx(c, { happy: 10 }); return '三个月后，配对成功了。你的亲生父母之一——{m}，在电话里哭得说不出话。|Three months later — a match. Your birth parent, {m}, sobbed too hard to speak.'; } return '数据库里没有匹配的结果。你每年都会去看一看。|No match. You check back every year.'; }),
      O('不去了，现在的生活就很好|Don\'t — your life is good as it is', R('“他们当年放弃了我，我不需要知道为什么。”|"They gave me up. I don\'t need to know why."', { eq: 3 }))
    ], { era: { g: 2005, cn: 2009 } }),
    OE('or_or_giveback', 'orphan', [28, 75], '回到福利院|Back to the Orphanage', '💛', '你回到了长大的福利院。孩子们怯生生地看着你，就像当年的你。|You return to the orphanage where you grew up. The children watch you shyly — just like you once did.', [
      O('捐一笔钱|Make a donation', function (c) { var m = c.$(G.ri(5, 40) * 1000); if (!c.pay(m)) return '你现在还没有余钱，只能陪孩子们玩了一下午。|You don\'t have spare money yet, so you spent the afternoon playing with the kids.'; c.prm.m = G.M(m); H.fx(c, { karma: 15, happy: 10 }); return '你捐了{m}，给每个孩子买了新书包。|You donated {m} and bought every child a new backpack.'; }),
      O('资助一个孩子上学|Sponsor a child\'s education', function (c) { var k = N.make({ rel: 'friend', age: G.ri(8, 12), aff: 50 }); k.pin = 1; c.prm.k = k.name; H.fx(c, { karma: 12, happy: 8, money: -1500 }); return '你决定资助{k}一直读到大学。|You decided to fund {k}\'s education all the way through university.'; })
    ]),

    /* ================= IMMIGRANT ================= */
    OE('or_im_translate', 'immigrant', [7, 14], '小小翻译官|The Little Interpreter', '🗣️', '爸妈不太会说当地语言，去医院、银行、交水电费都要带着你当翻译。|Your parents don\'t speak the language well, so you translate for them at the hospital, the bank, and the utility office.', [
      O('认真翻译|Translate carefully', R('你比同龄人早熟很多，也比同龄人更早知道家里的难处。|You grew up faster than other kids — and learned the family\'s worries sooner.', { eq: 5, smarts: 2, par: 6 })),
      O('觉得丢人|Feel embarrassed', R('你在柜台前小声嘟囔，希望同学别看见。|You mumbled at the counter, hoping no classmates saw.', { happy: -4 }))
    ], { if: hasPar }),
    OE('or_im_identity', 'immigrant', [12, 18], '我是谁|Who Am I?', '🪞', '在家里你是“外国人”，在学校你还是“外国人”。你不知道自己属于哪里。|At home you\'re the foreigner; at school you\'re still the foreigner. You don\'t know where you belong.', [
      O('两种文化都拥抱|Embrace both cultures', R('你发现自己能在两个世界之间自由切换，这是别人没有的超能力。|You realized you could move between two worlds — a superpower others don\'t have.', { eq: 5, happy: 6 })),
      O('拼命融入当地|Try hard to blend in', R('你改了名字，扔掉了妈妈做的便当。妈妈什么都没说。|You changed your name and threw away Mom\'s lunches. She never said a word.', { par: -6, eq: 2 })),
      O('躲进自己的世界|Retreat into yourself', R('你开始写日记，写满了一本又一本。|You started keeping a diary and filled notebook after notebook.', { smarts: 2, happy: -4 }))
    ]),
    OE('or_im_restaurant', 'immigrant', [10, 18], '家里的餐馆|The Family Restaurant', '🥡', '周末你在家里的小餐馆帮忙端盘子、洗碗。|On weekends you wait tables and wash dishes at the family restaurant.', [
      O('偷学爸爸的拿手菜|Learn Dad\'s signature dish', R('多年后，这道菜成了你想家时唯一的安慰。|Years later, this dish became your only comfort when homesick.', { sk: { cook: 8 }, par: 5 })),
      O('遇到种族歧视的客人|Face a racist customer', RC(.5, '其他客人站出来替你说话。|Other customers stood up for you.', { happy: 2 }, '爸爸让你忍着，你气得发抖。|Dad told you to swallow it. You shook with anger.', { happy: -8 }))
    ], { if: hasPar }),
    OE('or_im_roots', 'immigrant', [22, 60], '寻根|Back to Your Roots', '🧳', '你第一次回到爸妈的故乡。亲戚们围着你，说你长得像爷爷。|You visit your parents\' homeland for the first time. Relatives crowd around, saying you look like your grandfather.', [
      O('住上一段时间|Stay a while', R('你学会了几句方言，找到了爷爷的老房子。|You picked up some dialect and found Grandpa\'s old house.', { happy: 10, eq: 3, money: -1500 })),
      O('匆匆来去|A quick visit', R('一切都很陌生，又莫名熟悉。|Everything felt foreign — and strangely familiar.', { happy: 4, money: -800 }))
    ]),

    /* ================= INDEBTED ================= */
    OE('or_db_night', 'debt', [6, 14], '连夜搬家|Moving in the Night', '🌑', '半夜，妈妈把你叫醒：“快，收拾东西，我们要走了。”|In the middle of the night, Mom wakes you: "Quick, pack your things. We\'re leaving."', [
      O('抱着你最爱的玩具|Grab your favorite toy', R('你们挤在一辆小货车里离开了。你没来得及和朋友告别。|You left crammed in a little van. You never said goodbye to your friends.', { happy: -8, eq: 3 }))
    ], { bad: 1, if: hasPar }),
    OE('or_db_gamble', 'debt', [10, 20], '爸爸又去赌了|Dad Is Gambling Again', '🎲', '你在麻将馆找到了爸爸，他面前堆着欠条。|You find Dad at the mahjong parlor, a pile of IOUs in front of him.', [
      O('当众把他拉走|Drag him out in front of everyone', RC(.4, '爸爸愣住了，那天之后他真的戒了。|Dad froze — and after that day, he actually quit.', { npc: 10, happy: 6 }, '爸爸恼羞成怒，打了你一巴掌。|Dad, humiliated and furious, slapped you.', { npc: -15, happy: -10 })),
      O('偷偷告诉妈妈|Quietly tell Mom', R('爸妈大吵一架。你躲在房间里捂住了耳朵。|Your parents had a huge fight. You covered your ears in your room.', { happy: -6 })),
      O('转身离开|Walk away', R('你发誓，自己这辈子绝不碰赌。|You swore you\'d never gamble as long as you lived.', { flag: 'noGamble', eq: 2 }))
    ], { bad: 1, prep: function (c) { var d = dad(); if (!d) return false; pp(c, d); } }),
    OE('or_db_payoff', 'debt', [20, 40], '父债子还|Paying Off the Family Debt', '💳', '催债的人找到了你的公司：“你爸欠的钱，你得还。”|Debt collectors show up at your workplace: "Your father\'s debts are yours now."', [
      O('咬牙还一部分|Pay off part of it', function (c) { var m = Math.min(Math.max(0, c.p.money), c.$(G.ri(8, 25) * 1000)); c.money(-m); c.prm.m = G.M(m); H.fx(c, { par: 6, happy: -6 }); c.p.flags.debtPaid = (c.p.flags.debtPaid || 0) + 1; return '你还了{m}。离还清还有很远，但你看到了尽头。|You paid {m}. There\'s still a long way to go, but you can see the end.'; }),
      O('报警，这是非法催收|Call the police — this is illegal collection', R('警察来了，催债的人骂骂咧咧地走了。|The police came; the collectors left cursing.', { happy: 2 })),
      O('和家里断绝关系|Cut ties with your family', R('你换了手机号，搬了家。|You changed your number and moved.', { par: -30, happy: -4 }))
    ], { bad: 1, rep: 1, cd: 4, if: function (S, p) { return (p.flags.debtPaid || 0) < 3; } }),
    OE('or_db_free', 'debt', [24, 55], '终于还清了|Finally Debt-Free', '🎉', '你把最后一笔钱打了过去。从你记事起压在家里的那座山，终于搬走了。|You wired the last payment. The mountain that had sat on your family since you could remember was finally gone.', [
      O('带爸妈吃顿好的|Take your parents out for a feast', R('爸爸喝多了，抱着你哭：“是我对不起你。”|Dad drank too much and held you, crying, "I\'m so sorry."', { par: 15, happy: 15 }))
    ], { good: 1, w: 10, if: function (S, p) { return (p.flags.debtPaid || 0) >= 3; } }),

    /* ================= TYCOON (VIP) ================= */
    OE('or_ty_kidnap', ['tycoon', 'richest'], [6, 14], '绑架未遂|An Attempted Kidnapping', '🕶️', '放学路上，一辆面包车突然停在你身边，车门拉开了——|On the way home, a van screeches up beside you and the door slides open—', [
      O('拼命跑|Run for your life', async function (c) { var r = await c.game('sprint', { name: '逃跑|Escape' }); if (r.win) return '你冲进了路边的便利店，保镖随后赶到。|You burst into a convenience store; your bodyguards arrived seconds later.'; H.fx(c, { happy: -15, health: -5 }); c.p.flags.trauma = 1; return '你被拖上了车。三天后，父亲付了巨额赎金，你才被放回来。|You were dragged into the van. Three days later, after your father paid a huge ransom, you were released.'; }),
      O('大喊救命|Scream for help', R('路人围了过来，面包车一溜烟开走了。|Passersby rushed over; the van sped away.', { happy: -6 }))
    ], { bad: 1 }),
    OE('or_ty_paparazzi', ['tycoon', 'richest'], [16, 30], '富三代上热搜|Trending: The Heir', '📸', '你在私人派对上的照片被拍到了，标题是《XX集团继承人的奢靡生活》。|Paparazzi snapped you at a private party. Headline: "The Heir\'s Lavish Life."', [
      O('无视|Ignore it', R('热度过几天就散了。|It blew over in a few days.', { fame: 3 })),
      O('发声明道歉|Issue an apology', R('集团股价稳住了，父亲松了口气。|The company\'s stock held steady; your father relaxed.', { par: 4, rep: 2 })),
      O('借势营销自己|Use the attention to build your brand', R('你开了社交账号，一夜涨粉百万。|You launched a social account and gained a million followers overnight.', { fame: 10 }), { era: { g: 2008, cn: 2012 } })
    ]),
    OE('or_ty_succession', ['tycoon', 'richest', 'merchant'], [25, 50], '继承权之争|The Succession Battle', '👑', '父亲年事已高，兄弟姐妹们为了集团的控制权暗中较劲。|Your father is aging, and your siblings are quietly fighting for control of the empire.', [
      O('拉拢董事会|Win over the board', async function (c) { var r = await c.game('policy', { name: '董事会博弈|Boardroom Battle' }); if (r.win) { c.money(c.$(G.ri(5, 20) * 1e6)); H.fx(c, { fame: 5, happy: 10 }); sibs().forEach(function (s) { N.addAff(s, -20); }); return '你赢得了董事会多数票，成为集团新的掌门人！|You won the board\'s majority and became the new head of the group!'; } sibs().forEach(function (s) { N.addAff(s, -8); }); H.fx(c, { happy: -10 }); return '你输了，被派去管一个边缘子公司。|You lost and were sent to run a minor subsidiary.'; }),
      O('退出争夺，拿钱走人|Bow out and take your share', function (c) { c.money(c.$(G.ri(1, 5) * 1e6)); sibs().forEach(function (s) { N.addAff(s, 10); }); return '你拿了一笔钱，过上了自由的生活。兄弟姐妹们反而和你亲近了。|You took a payout and a life of freedom. Your siblings grew closer to you for it.'; })
    ], { if: function () { return sibs().length > 0 && !!dad(); } }),
    OE('or_ty_foundation', ['tycoon', 'richest'], [30, 75], '家族基金会|The Family Foundation', '🏛️', '家族慈善基金会需要一位新的负责人。|The family\'s charitable foundation needs a new director.', [
      O('接手，认真做慈善|Take it on and do real good', R('你资助了一百所乡村学校。|You funded a hundred rural schools.', { karma: 20, fame: 5, happy: 8 })),
      O('用它来避税|Use it as a tax shelter', R('财务团队很满意。|The accountants were delighted.', { money: 30000, karma: -8 }))
    ]),
    OE('or_ty_jet', ['tycoon', 'richest'], [18, 35], '周末去巴黎|Paris for the Weekend', '🛩️', '朋友们说想去巴黎喝咖啡。你拿起电话：“备机。”|Your friends feel like coffee in Paris. You pick up the phone: "Prep the jet."', [
      O('出发！|Wheels up!', R('你在塞纳河边喝了一杯咖啡，晚上飞回来上课。|You had coffee by the Seine and flew back for class that evening.', { happy: 8, money: -5000 })),
      O('算了，没意思|Nah, boring', R('你突然觉得，什么都唾手可得的生活好像也挺无聊的。|You realize a life where everything is within reach can be pretty dull.', { eq: 2, happy: -2 }))
    ]),

    /* ================= ACADEMICIANS (VIP) ================= */
    OE('or_ac_nobel', 'academic', [10, 18], '餐桌上的诺奖得主|A Nobel Laureate at Dinner', '🏅', '今晚来家里吃饭的，是一位诺贝尔奖得主。|Tonight\'s dinner guest is a Nobel laureate.', [
      O('请教一个问题|Ask a question', function (c) { if (G.ch(.5 + c.p.st.smarts / 250)) { var m = N.make({ rel: 'mentor', age: G.ri(65, 85), job: '诺贝尔奖得主|Nobel Laureate', inc: G.$w(200000), smarts: 99, aff: 40, tags: [] }); m.pin = 1; c.prm.m = m.name; H.fx(c, { smarts: 3, happy: 8 }); return '{m}被你的问题吸引，留下了邮箱：“有空写信给我。”|{m} was intrigued and left an email address: "Write to me sometime."'; } return '你紧张得问了个很傻的问题，大家都笑了。|Nervous, you asked something silly. Everyone laughed.'; })
    ]),
    OE('or_ac_burden', 'academic', [15, 22], '光环的重量|The Weight of the Name', '🎓', '老师总说：“你爷爷是院士，你怎么才考这么点？”|Teachers keep saying, "Your grandfather is an academician — how can your scores be so low?"', [
      O('发誓超越他们|Vow to surpass them', R('你把压力变成了动力。|You turned the pressure into fuel.', { perf: 8, smarts: 2, stress: 15 })),
      O('去做完全不同的事|Do something completely different', R('你迷上了做饭/摇滚/摄影。家里人目瞪口呆。|You fell for cooking, rock music, or photography. The family was stunned.', { happy: 8, par: -5 }))
    ]),
    OE('or_ac_lab', 'academic', [18, 30], '爷爷的实验室|Grandfather\'s Lab', '🔬', '爷爷问你愿不愿意来他的国家重点实验室帮忙。|Grandfather asks if you\'d like to help in his national key laboratory.', [
      O('去！|Yes!', R('你参与了一个重大项目，论文上有你的名字。|You joined a major project — your name is on the paper.', { smarts: 4, fame: 3 })),
      O('避嫌，靠自己|Avoid nepotism — go it alone', R('你去了另一所大学，从零开始。|You went to another university and started from scratch.', { karma: 4 }))
    ]),

    /* ================= CELEBRITY (VIP) ================= */
    OE('or_ce_paparazzi', 'celebrity', [3, 12], '狗仔跟拍|Hounded by Paparazzi', '📷', '你在幼儿园门口被一群记者围住，闪光灯闪个不停。|Reporters mob you outside kindergarten, flashes popping.', [
      O('躲到妈妈身后|Hide behind Mom', R('第二天，你哭鼻子的照片上了娱乐头条。|The next day your teary photo topped the entertainment news.', { fame: 3, happy: -4 })),
      O('对着镜头比耶|Flash a peace sign', R('你成了网友口中的“星二代萌娃”。|The internet crowned you the cutest celebrity kid.', { fame: 6, happy: 3 }))
    ]),
    OE('or_ce_childstar', 'celebrity', [5, 12], '童星邀约|A Child Star Offer', '🎬', '一位大导演想请你出演新片里的一个角色。|A famous director wants you for a role in his new film.', [
      O('接戏！|Take it!', function (c) { if (!c.p.fc) G.fame.start('actor', { fans: G.ri(50000, 300000) }); H.fx(c, { fame: 8, happy: 6, perf: -5 }); return '你的表演惊艳了所有人，新闻说“又一位天才童星诞生了”。|Your performance stunned everyone: "A child prodigy is born."'; }),
      O('爸妈拒绝了，想让你有个正常童年|Your parents decline for a normal childhood', R('你在操场上玩泥巴，像普通孩子一样。|You played in the dirt like any other kid.', { happy: 4 }))
    ]),
    OE('or_ce_shadow', 'celebrity', [18, 35], '活在光环下|Living in Their Shadow', '🌗', '不管你做什么，标题永远是“XX的孩子”。|Whatever you do, headlines call you "So-and-so\'s kid."', [
      O('改名，从零开始|Change your name and start over', R('没人知道你是谁，你终于可以只做你自己。|No one knows who you are. Finally you can just be you.', { happy: 8, fame: -10 })),
      O('利用这份关注|Make the most of the attention', R('资源和机会源源不断地涌来。|Opportunities flood in.', { fame: 6, money: 5000 }))
    ]),

    /* ================= CHAMPIONS (VIP) ================= */
    OE('or_ch_train', 'champion', [5, 12], '魔鬼训练|Brutal Training', '🏋️', '别的孩子在玩，你在训练场上流汗。爸妈是你的教练。|Other kids play; you sweat on the training field. Your parents are your coaches.', [
      O('练到极限|Push to the limit', R('你的成绩在同龄人里遥遥领先。|You\'re far ahead of everyone your age.', { fit: 12, health: 4, sk: { sport: 10 }, happy: -4 })),
      O('偷偷溜去玩|Sneak off to play', R('那是你童年为数不多的快乐时光。|One of your few carefree childhood afternoons.', { happy: 8, par: -4 }))
    ]),
    OE('or_ch_select', 'champion', [12, 17], '国家队选拔|National Team Trials', '🥇', '国家队来选人了，所有人都盯着冠军的孩子。|The national team is scouting, and all eyes are on the champions\' kid.', [
      O('全力以赴|Give it everything', async function (c) { var r = await c.game('sprint', { name: '选拔赛|Trials' }); if (r.win) { if (!c.p.fc) G.fame.start('athlete', { fans: G.ri(5000, 50000) }); H.fx(c, { fame: 6, happy: 10 }); return '你入选了国家队！爸妈在看台上哭成了泪人。|You made the national team! Your parents wept in the stands.'; } H.fx(c, { happy: -10 }); return '你差了0.1秒。冠军的孩子，没有入选。|You missed by a tenth of a second. The champions\' kid didn\'t make it.'; })
    ]),
    OE('or_ch_injury', 'champion', [15, 25], '伤病|Injury', '🦵', '一次训练中，你的膝盖韧带撕裂了。医生说可能再也回不到巅峰。|In training you tear a knee ligament. The doctor says you may never return to peak form.', [
      O('坚持复健|Fight through rehab', RC(.5, '一年后，你重返赛场，比以前更强。|A year later you returned — stronger than ever.', { fit: 6, eq: 4 }, '复健失败，你不得不告别运动生涯。|Rehab failed. You had to leave the sport.', { happy: -12 })),
      O('借机放下|Take it as a sign to stop', R('你第一次问自己：我真的喜欢这项运动吗？|For the first time you asked yourself: do I even love this sport?', { happy: 4 }))
    ], { bad: 1 }),

    /* ================= CRIME FAMILY (VIP) ================= */
    OE('or_mf_guards', 'mafia', [6, 14], '保镖叔叔|The Bodyguards', '🕴️', '你上学时总有两个纹身的叔叔跟着。同学们都不敢跟你玩。|Two tattooed men follow you to school. Your classmates are too scared to play with you.', [
      O('求爸爸撤掉保镖|Beg Dad to call them off', RC(.5, '爸爸同意了，你终于交到了朋友。|Dad agreed, and you finally made friends.', { happy: 6, eq: 2 }, '爸爸说：“外面不安全。”|Dad said, "It\'s not safe out there."', { happy: -4 })),
      O('利用他们当靠山|Use them as backup', R('学校里没人敢惹你，也没人真心对你。|No one dared cross you — and no one truly liked you.', { rep: 6, karma: -3 }))
    ]),
    OE('or_mf_rival', 'mafia', [12, 22], '仇家|Your Father\'s Enemies', '🔪', '敌对帮派的人在你回家路上拦住了你：“给你爸带句话。”|Men from a rival gang block your way home: "Got a message for your father."', [
      O('冷静周旋|Stay calm and talk your way out', RC(.6, '他们放你走了。爸爸听说后，三天没回家。|They let you go. When Dad heard, he didn\'t come home for three days.', { eq: 4 }, '你被打了一顿。|They beat you up.', { health: -12 })),
      O('打出去|Fight your way out', async function (c) { var r = await c.game('fight', { name: '突围|Break Out' }); if (r.win) { H.fx(c, { rep: 10 }); return '你一个人放倒了两个，从此江湖上有了你的名号。|You dropped two of them alone; the underworld learned your name.'; } H.fx(c, { health: -15 }); return '你寡不敌众。|You were outnumbered.'; })
    ], { bad: 1 }),
    OE('or_mf_heir', 'mafia', [20, 40], '接班|The Heir to the Throne', '🐉', '父亲老了，把你叫到书房：“这摊家业，你接不接？”|Your aging father calls you into his study: "Will you take over the family business?"', [
      O('接|Take it', function (c) { if (c.p.pol || c.p.mil || c.p.gov) return '你身在公门，不能接。|You serve the state; you can\'t.'; if (!c.p.gang) G.gang.join(); c.p.gang.rank = Math.max(c.p.gang.rank, 4); H.fx(c, { rep: 15, karma: -10 }); return '你坐上了那把椅子。从今天起，你说了算。|You took the chair. From today, your word is law.'; }),
      O('拒绝，我要走正道|Refuse — you\'ll go straight', R('父亲沉默了很久：“也好。别像我。”|Father was quiet a long time. "Good. Don\'t be like me."', { karma: 12, par: 4 }))
    ], { if: function (S, p) { return !!dad() && !(p.gang && p.gang.rank >= 4); } }),
    OE('or_mf_informant', 'mafia', [18, 40], '警察找上你|The Police Want a Deal', '🕵️', '一位警察私下找到你：“做我们的线人，保你和家人平安。”|A detective approaches you privately: "Become our informant, and we\'ll keep you and your family safe."', [
      O('答应|Agree', RC(.6, '你提供的情报端掉了一个毒窝，没人知道是你。|Your tip took down a drug den. No one knew it was you.', { karma: 12 }, '你的身份暴露了，家里人看你的眼神变了。|Your cover was blown. Your family looks at you differently now.', { par: -30, happy: -15 })),
      O('拒绝|Refuse', R('“我不会出卖家人。”|"I won\'t betray my family."', { par: 4 }))
    ]),

    /* ================= POLITICAL DYNASTY (VIP) ================= */
    OE('or_rd_compound', 'red', [5, 12], '大院里的童年|Childhood in the Compound', '🏯', '你在戒备森严的大院里长大，门口站着哨兵，邻居都是大人物。|You grow up in a guarded compound; sentries at the gate, powerful figures next door.', [
      O('和大院子弟称兄道弟|Bond with the other compound kids', function (c) { var f = N.make({ rel: 'friend', age: c.p.age + G.ri(-1, 2), aff: 50, tags: ['red'] }); f.pin = 1; c.prm.f = f.name; H.fx(c, { eq: 3 }); return '{f}成了你的发小，他们家的人脉和你家一样深。|{f} became your childhood best friend — their family as connected as yours.'; }),
      O('听爷爷讲当年的故事|Listen to Grandpa\'s stories', R('爷爷讲战火、讲建国。你听得热血沸腾。|Grandpa told of war and nation-building. Your blood ran hot.', { smarts: 2, eq: 2 }))
    ]),
    OE('or_rd_temptation', 'red', [18, 28], '特权的诱惑|The Temptation of Privilege', '🚦', '你开车闯了红灯被交警拦下，你一个电话就能摆平。|Pulled over for running a red light, you could make it disappear with one call.', [
      O('打电话|Make the call', R('交警敬了个礼，放你走了。|The officer saluted and waved you on.', { karma: -6 })),
      O('老老实实认罚|Take the ticket like anyone else', R('爷爷知道后很欣慰：“这才是我们家的家风。”|Grandpa was pleased: "That\'s how our family does things."', { karma: 6, par: 4 }))
    ]),
    OE('or_rd_downfall', 'red', [28, 60], '家族失势|The Family Falls from Grace', '🍂', '政治风向变了，家族在高层的靠山倒台，一夜之间门可罗雀。|Political winds shift. The family\'s patron falls, and overnight no one comes calling.', [
      O('低调做人，韬光养晦|Lie low and bide your time', R('你学会了在风暴中保持沉默。|You learned to stay silent in the storm.', { eq: 5, rep: -5 })),
      O('与家族切割|Distance yourself from the family', R('你保住了自己的位置，却失去了家人的信任。|You kept your position but lost your family\'s trust.', { par: -20, karma: -4 }))
    ], { bad: 1, w: .8 }),

    /* ================= ROYAL / NOBLE / RICHEST (VIP) ================= */
    OE('or_ry_etiquette', ['royal', 'noble'], [5, 12], '礼仪课|Etiquette Lessons', '🫖', '每天下午，礼仪老师教你如何行礼、如何用刀叉、如何微笑而不露齿。|Every afternoon, a tutor teaches you to bow, use the right fork, and smile without showing teeth.', [
      O('一丝不苟|Master every detail', R('你优雅得体，老派贵族们都夸你。|Poised and proper — the old aristocrats approve.', { eq: 5, looks: 2 })),
      O('故意捣乱|Cause mischief', R('你把茶洒在了老师的裙子上。|You spilled tea on the tutor\'s dress.', { happy: 5, par: -4 }))
    ]),
    OE('or_ry_tabloid', ['royal', 'noble'], [16, 30], '小报头条|Tabloid Fodder', '🗞️', '你和一位平民约会的照片登上了小报头条。|Photos of you dating a commoner splash across the tabloids.', [
      O('公开恋情|Go public with the relationship', R('公众为你们的爱情故事着迷，王室却很不高兴。|The public adores your love story; the family does not.', { fame: 8, par: -8, happy: 6 })),
      O('发表声明否认|Issue a denial', R('你保住了体面，那个人却伤心地离开了。|You kept up appearances; that person left heartbroken.', { happy: -8, rep: 2 }))
    ]),
    OE('or_ry_duty', 'royal', [20, 45], '王室职责|Royal Duties', '🎗️', '你代表王室出访一个受灾地区。|You represent the royal family on a visit to a disaster zone.', [
      O('真心实意地帮忙|Roll up your sleeves and help', R('你蹲下来和灾民聊天，照片感动了全国。|You knelt to talk with survivors; the photos moved the nation.', { fame: 6, karma: 10 })),
      O('走个过场|Go through the motions', R('媒体批评你“像一个微笑的雕像”。|The press called you "a smiling statue."', { fame: -2 }))
    ], { if: function (S, p) { return !!G.C[p.country].mon; } }),
    OE('or_ry_abdicate', 'royal', [22, 50], '为爱放弃一切|Giving It All Up for Love', '💔', '王室要求你在爱人和王位继承权之间做出选择。|The palace demands you choose between the one you love and your place in the line of succession.', [
      O('选择爱情|Choose love', function (c) { c.p.flags.elite = 0; c.p.flags.exRoyal = 1; G.dPush('love', N.addLove(c.npc, 25)); H.fx(c, { happy: 15, fame: 8, par: -15 }); return '你放弃了头衔，和{n}一起搬到了海外。|You gave up your title and moved abroad with {n}.'; }),
      O('选择责任|Choose duty', function (c) { G.love.breakup(c.npc); H.fx(c, { happy: -15, rep: 6 }); return '你和{n}在宫殿后门告别。|You said goodbye to {n} at the palace\'s back gate.'; })
    ], { if: function (S, p) { var pt = N.partner(); return !!(pt && pt.rel === 'lover' && !(pt.tags || []).length && G.C[p.country].mon); }, prep: function (c) { pp(c, N.partner()); } }),
    OE('or_nb_decline', 'noble', [25, 60], '家道中落|Faded Glory', '🏚️', '祖传的庄园维护费太高，家族不得不考虑卖掉传家宝。|The ancestral estate costs a fortune to maintain; the family must consider selling heirlooms.', [
      O('卖掉一幅祖传名画|Sell an ancestral painting', function (c) { c.money(c.$(G.ri(3, 15) * 1e5)); H.fx(c, { par: -4, happy: -3 }); return '名画被拍卖，庄园保住了。|The painting sold at auction, and the estate was saved.'; }),
      O('把庄园改成酒店|Turn the estate into a hotel', RC(.55, '游客络绎不绝，庄园重焕生机！|Tourists poured in; the estate came back to life!', { money: 20000, happy: 6 }, '生意惨淡，亏了一大笔。|Business was dismal and you lost a fortune.', { money: -15000 }))
    ]),
    OE('or_rc_friends', 'richest', [10, 22], '谁是真朋友|Who Are Your Real Friends?', '🎭', '每个靠近你的人，好像都想从你身上得到点什么。|Everyone who gets close seems to want something from you.', [
      O('隐藏身份去交朋友|Hide who you are to make friends', function (c) { var f = N.make({ rel: 'friend', age: c.p.age, aff: 55, sincere: 95 }); f.pin = 1; c.prm.f = f.name; H.fx(c, { happy: 8, eq: 3 }); return '你用假名参加了夏令营，认识了真心待你的{f}。|You went to summer camp under a fake name and met {f}, who liked you for you.'; }),
      O('干脆不交朋友|Stop trying', R('你越来越孤独。|You grew lonelier and lonelier.', { happy: -8 }))
    ]),
    OE('or_rc_trust', 'richest', [18, 25], '信托基金到期|Your Trust Fund Unlocks', '🏦', '你十八岁了，名下的信托基金开始每年给你发钱。|You\'re eighteen, and your trust fund starts paying out every year.', [
      O('（签字）|(Sign)', function (c) { var m = c.$(G.ri(2, 8) * 1e6); c.money(m); c.prm.m = G.M(m); return '第一笔信托款到账：{m}。|First trust payment received: {m}.'; })
    ], { good: 1, w: 10 })
  ]);
  // heirs shouldn't replay their parent's childhood chapters
  var cont = G.life.continueAs;
  G.life.continueAs = function (k) { var r = cont.apply(this, arguments); if (G.S && G.S.p) G.S.p.flags.heir = 1; return r; };
})();
