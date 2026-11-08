/* Circumstance-driven events: origins, talents, wealth, pets, property, odd luck */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  G.evs([
    // ---------- privileged backgrounds ----------
    E('x_heir', [20, 40], '接班|Taking Over the Family Business', '🏢', '父亲年纪大了，想让你接手家族企业。|Your father is getting old and wants you to take over the family business.', [
      O('接班|Take over', function (c) { var f = N.rel('father', 'mother').filter(function (n) { return n.wealth > 0; })[0]; var val = f ? Math.round(f.wealth * .6) : c.$(5e6); if (f) f.wealth -= val; G.S.assets.company = { name: G.L('{s}家族集团|{s} Family Group', { s: c.p.sur || c.p.name }), ind: G.pick(['mfg', 're', 'trade', 'retail']), val: val, base: val * .5, own: 1, yrs: 0, emp: 500, eff: 0, div: .3, ipo: G.ch(.4), last: 0 }; if (c.p.job) G.career.leave(); G.major('接手家族企业|Took over the family business'); return '你成了家族企业的掌门人。|You became head of the family business.'; }),
      O('我想走自己的路|Forge your own path', R('父亲很失望，但尊重你的选择。|Your father was disappointed but respected your choice.', { par: -6, happy: 3 }))
    ], { if: function (S, p) { return (p.flags.rich || p.origin === 'merchant') && !S.assets.company && N.rel('father', 'mother').some(function (n) { return n.wealth > G.$(5e5); }); }, w: 2 }),
    E('x_arranged', [22, 35], '商业联姻|Arranged Marriage', '💍', '家里给你安排了一门“门当户对”的亲事，对方是{n}。|Your family arranged a "suitable" match for you: {n}.', [
      O('听从安排|Go along with it', async function (c) { c.npc.engaged = 1; c.npc.rel = 'lover'; G.S.p.partner = c.npc.id; var ok = await G.love.marry(c.npc); H.fx(c, { par: 10 }); return ok ? '你们举行了一场盛大的婚礼。|You held a grand wedding.' : '婚礼没办成。|The wedding fell through.'; }),
      O('先相处看看|Date first and see', function (c) { N.addLove(c.npc, 15); c.npc.pin = 1; return '你决定先和{n}相处一段时间。|You decide to spend some time with {n} first.'; }),
      O('坚决反对|Refuse outright', R('你和家里闹翻了。|You fell out with your family.', { par: -15, happy: 4 }))
    ], { if: function (S, p) { return (p.flags.rich || p.flags.elite) && !N.partner() && H.hasPar(); }, prep: function (c) { var tags = G.love.eliteTags(); var n = N.mkRomantic({ rel: 'contact', tags: [tags.length ? G.pick(tags) : 'rich'], love: 35, aff: 20, minGap: -3, maxGap: 4 }); c.npc = n; c.prm.n = G.L('{n}（{j}）|{n} ({j})', { n: n.name, j: n.job }); } }),
    E('x_paparazzi', [3, 40], '狗仔队|Paparazzi', '📸', '因为父母是明星，狗仔队连你上学都要偷拍。|Because your parents are stars, paparazzi even shoot you on the way to school.', [
      O('对镜头比个耶|Flash a peace sign', R('你的照片上了娱乐版头条，大家都说你可爱。|Your photo made the entertainment headlines; everyone says you\'re adorable.', { fame: 4, happy: 2 })),
      O('躲起来|Hide', R('你戴着口罩帽子出门，像个小间谍。|You go out in a mask and cap like a little spy.', { happy: -3 }))
    ], { rep: 1, cd: 3, if: function (S, p) { return p.flags.celebfam; } }),
    E('x_starkid_show', [5, 20], '星二代综艺|Star-Kid Reality Show', '📺', '一档亲子综艺邀请你和明星父母一起参加。|A family reality show invites you and your celebrity parent.', [
      O('参加|Join', R('你在节目里的童言童语圈粉无数。|Your innocent remarks won tons of fans.', { fame: 10, happy: 6, money: 3000 })),
      O('拒绝|Decline', R('你想过正常孩子的生活。|You want a normal childhood.', {}))
    ], { if: function (S, p) { return p.flags.celebfam; } }),
    E('x_royal_duty', [6, 90], '王室职责|Royal Duties', '👑', '你需要代表王室出席一场公共活动。|You must represent the royal family at a public event.', [
      O('优雅得体|Grace and poise', R('你的表现赢得了民众的赞誉。|Your conduct won public praise.', { fame: 4, eq: 2 })),
      O('偷偷溜走|Sneak away', R('小报头条：“王室成员失踪三小时！”|Tabloid headline: "Royal Missing for Three Hours!"', { fame: 3, happy: 5 }))
    ], { rep: 1, cd: 3, if: function (S, p) { return p.flags.royal; } }),
    E('x_royal_line', [18, 80], '继承顺位|Line of Succession', '🏰', '王室传来消息：几位长辈相继退位，你的继承顺位大幅提前。|Word from the palace: several elders have stepped back, and you\'ve moved way up the line of succession.', [
      O('做好准备|Prepare yourself', R('你开始接受严格的储君训练。|You begin rigorous heir training.', { fame: 15, eq: 3, stress: 10 })),
      O('宣布放弃王室身份|Renounce your royal status', function (c) { c.p.flags.royal = 0; H.fx(c, { fame: 10, happy: 8 }); return '你震惊了全国，选择做一个普通人。|You stunned the nation by choosing to live as a commoner.'; })
    ], { if: function (S, p) { return p.flags.royal; }, w: .3 }),
    E('x_red_flatter', [18, 70], '巴结|Flatterers', '🎩', '因为你的家庭背景，总有人想方设法巴结你。|Because of your family background, people constantly try to curry favor with you.', [
      O('来者不拒|Accept everything', R('礼物堆满了你的房间，但有人在暗中记账。|Gifts pile up — and someone is quietly keeping track.', { money: 20000, heat: 15, karma: -6 })),
      O('一律拒绝|Turn them all away', R('你给家族赢得了好名声。|You earned the family a good name.', { karma: 6, fame: 2 }))
    ], { rep: 1, cd: 5, if: function (S, p) { return p.flags.redfam; } }),
    E('x_mafia_family', [14, 40], '家族生意|The Family Business', '🕴️', '父亲把你叫到书房：“是时候让你了解家族生意了。”|Your father calls you into his study: "It\'s time you learned the family business."', [
      O('加入|Join', function (c) { G.gang.join(c.p.flags.mafiaName); return '你正式成为了家族的一员。|You officially joined the family.'; }),
      O('拒绝，我要清清白白|Refuse — you want a clean life', R('父亲沉默了很久，最后点了点头。|Your father was silent a long time, then nodded.', { karma: 8, par: -5 }))
    ], { if: function (S, p) { return p.flags.mafiafam && !p.gang && !p.pol && !p.mil && !p.gov; }, w: 3 }),
    E('x_vendetta', [10, 70], '仇家寻仇|Vendetta', '🔪', '父亲当年的仇家找上门来，扬言要报复。|An old enemy of your father\'s shows up, vowing revenge.', [
      O('正面硬刚|Face them head-on', async function (c) { var r = await c.game('fight', { name: '寻仇|Vendetta', hard: 1 }); if (r.win) { H.fx(c, { rep: 10 }); return '你赶走了仇家，名声大振。|You drove them off, and your reputation soared.'; } H.fx(c, { health: -25 }); return '你被打成重伤。|You were badly injured.'; }),
      O('报警|Call the police', R('警察介入，仇家暂时退去。|The police intervened, and the enemy backed off — for now.', { heat: 5 })),
      O('躲到外地|Lay low somewhere else', R('你在外地躲了一阵子。|You hid out of town for a while.', { happy: -6 }))
    ], { bad: 1, if: function (S, p) { return p.flags.mafiafam || (p.gang && p.gang.rank >= 3); } }),
    E('x_acad', [8, 25], '院士爷爷|The Academician', '🔬', '院士爷爷带你参观实验室，说你很有天赋。|Your academician grandparent tours you through their lab and says you have a gift.', [
      O('跟着做研究|Start doing research', R('你小小年纪就发表了第一篇论文！|You published your first paper at a young age!', { smarts: 6, fame: 3 })),
      O('觉得无聊|Find it boring', R('你更想出去玩。|You\'d rather go play.', { happy: 3 }))
    ], { if: function (S, p) { return p.flags.acafam; } }),
    E('x_champ', [6, 18], '冠军父母的训练|Training with Champion Parents', '🏋️', '冠军父母每天亲自给你加练。|Your champion parents personally drill you every day.', [
      O('坚持训练|Keep training', R('你的体能远超同龄人。|Your fitness far exceeds your peers\'.', { fit: 8, health: 3, happy: -3 })),
      O('罢训|Go on strike', R('你和父母大吵一架。|You had a huge fight with your parents.', { par: -6, happy: 4 }))
    ], { rep: 1, cd: 3, if: function (S, p) { return p.flags.sportfam && !p.fc; } }),
    E('x_rich_kids', [14, 30], '富二代派对|Rich-Kid Party', '🥂', '一群富二代邀请你去他们的游艇派对。|A group of rich kids invites you to their yacht party.', [
      O('去|Go', function (c) { var n = N.make({ rel: 'friend', tags: ['rich'], age: c.p.age + G.ri(-2, 3), aff: 30 }); c.prm.n = n.name; H.fx(c, { happy: 8, drink: 5 }); return '你在派对上结识了{n}。|You met {n} at the party.'; }),
      O('没兴趣|Not interested', R('你觉得这种场合太浮夸。|Too flashy for your taste.', {}))
    ], { if: function (S, p) { return p.flags.rich || G.netWorth() > G.$(2e6); } }),
    // ---------- difficult backgrounds ----------
    E('x_discrim', [6, 60], '歧视|Discrimination', '✋', '有人因为你的出身/口音对你冷嘲热讽。|Someone mocks you for your background or accent.', [
      O('据理力争|Push back', R('你的勇气让旁观者都为你鼓掌。|Your courage earned applause from onlookers.', { eq: 2, happy: 2 })),
      O('一笑了之|Brush it off', R('你没让这件事影响自己。|You didn\'t let it get to you.', { eq: 1 })),
      O('躲回家哭|Go home and cry', R('你难过了好几天。|You were upset for days.', { happy: -8 }))
    ], { bad: 1, if: function (S, p) { return p.origin === 'immigrant' || p.flags.langBar || (p.imm.length > 1); } }),
    E('x_bilingual', [8, 30], '双语优势|Bilingual Edge', '🗣️', '因为会说两种语言，你被选为学校/公司的翻译代表。|Being bilingual, you\'re chosen as the school or company\'s interpreter.', [
      O('接下任务|Take it on', R('你出色地完成了任务，大家都对你刮目相看。|You did brilliantly and impressed everyone.', { eq: 3, fame: 2, perf: 4 }))
    ], { good: 1, if: function (S, p) { return p.langs.length >= 2; } }),
    E('x_dad_run', [6, 25], '父亲跑路了|Dad Disappears', '🏃', '一天早上醒来，父亲留下一张纸条消失了，说出去躲债。|One morning, your father is gone — just a note saying he\'s hiding from creditors.', [
      O('帮妈妈撑起这个家|Help Mom hold the family together', function (c) { var f = N.rel('father')[0]; if (f) { f.away = 1; f.aff -= 20; } H.fx(c, { eq: 5, happy: -10, karma: 4 }); return '你早早学会了承担。|You learned to shoulder responsibility early.'; })
    ], { bad: 1, if: function (S, p) { return p.flags.debtfam && N.rel('father').length && !p.flags.dadRan; }, prep: function (c) { c.p.flags.dadRan = 1; } }),
    E('x_rural_city', [16, 30], '进城打工|Off to the City', '🚌', '村里的年轻人都去城里打工了，你也想去闯一闯。|All the young people from the village are heading to the city for work. You want to try too.', [
      O('去大城市|Go to a big city', function (c) { c.p.tier = G.ri(1, 2); c.p.city = G.pick(G.C[c.p.country].cities[c.p.tier]); if (!c.p.job && !H.student()) { G.career.hire(G.pick([G.JOB.factory, G.JOB.builder, G.JOB.waiter, G.JOB.courier])); } H.fx(c, { happy: 2, eq: 2 }); return G.L('你来到了{c}，开始了打工生活。|You arrived in {c} and started working.', { c: c.p.city }); }),
      O('留在家乡|Stay home', R('你留下来照顾家里。|You stay to look after the family.', { par: 5 }))
    ], { if: function (S, p) { return p.tier >= 4 && !H.student() && !p.job; }, w: 2 }),
    // ---------- talents ----------
    E('x_charm', [16, 50], '同时被三个人追|Three Suitors at Once', '😵', '你同时收到了三个人的告白，场面一度很混乱。|Three people confess to you at the same time. Chaos ensues.', [
      O('一个个了解|Get to know each one', async function (c) { var list = [0, 1, 2].map(function () { return N.mkRomantic({ rel: 'admirer', love: G.ri(55, 85), aff: 25 }); }); list.forEach(function (n) { n.pin = 1; }); return '三个人都在“关系”里等着你的答复。|All three await your answer under "Relationships".'; }),
      O('全部拒绝|Turn them all down', R('你说想一个人静一静。|You say you need some time alone.', { happy: 2 }))
    ], { if: function (S, p) { return G.has('charm') && !N.spouse(); } }),
    E('x_lucky_money', [8, 90], '天降横财|Windfall', '🍀', '你在路边捡到了一张中奖彩票/一沓现金，失主找不到。|You find a winning lottery ticket / a wad of cash on the street. No owner in sight.', [
      O('收下|Keep it', R('运气真好！|What luck!', { money: 3000, happy: 6 })),
      O('交给警察|Turn it in', R('警察说如果半年没人认领就归你，结果真的归你了。|The police said it\'d be yours if unclaimed in six months — and it was.', { money: 3000, karma: 6 }))
    ], { good: 1, w: function () { return G.has('lucky') ? 1.5 : .1; } }),
    E('x_unlucky', [8, 90], '倒霉的一天|A Truly Unlucky Day', '🌧️', '你出门踩到狗屎，摔进水坑，手机掉进下水道，还被鸟拉了一身。|You step in dog poop, fall in a puddle, drop your phone down a drain, and get hit by a bird.', [
      O('仰天长叹|Look to the heavens and sigh', R('这一天终于结束了。|The day finally ends.', { happy: -6, money: -300 }))
    ], { bad: 1, w: function () { return G.has('unlucky') ? 1.5 : .1; } }),
    E('x_lightning', [10, 90], '雷击|Struck by Lightning', '⚡', '你在雷雨天被闪电击中了！|You were struck by lightning in a thunderstorm!', [
      O('……|...', RC(.85, '你奇迹般地活了下来，头发全竖起来了。|Miraculously you survived — hair standing straight up.', { health: -20, fame: 3 }, '你被送进了ICU。|You were rushed to the ICU.', { health: -45 }))
    ], { bad: 1, w: function () { return G.has('unlucky') ? .4 : .02; } }),
    E('x_gambler', [18, 70], '赌神附体|Gambler\'s Luck', '🃏', '你在朋友家打牌，手气好得出奇。|At a friend\'s card game, your luck is uncanny.', [
      O('乘胜追击|Press your luck', R('你把朋友们赢了个精光。|You cleaned everyone out.', { money: 2000, happy: 6, gamble: 5 })),
      O('见好就收|Quit while ahead', R('你小赢一笔就收手了。|You took a small win and stopped.', { money: 500 }))
    ], { good: 1, w: function () { return G.has('gambler') ? 1.5 : 0; } }),
    E('x_late_bloom', [36, 50], '大器晚成|Late Bloomer', '🌳', '人到中年，你突然觉得脑子比年轻时更好使了。|In middle age, your mind suddenly feels sharper than ever.', [
      O('重新规划人生|Rethink your life', R('你找到了新的方向。|You found a new direction.', { smarts: 5, eq: 5, happy: 6 }))
    ], { good: 1, w: function () { return G.has('late') ? 2 : 0; } }),
    // ---------- pets & property ----------
    E('x_pet_sick', [5, 100], '宠物生病|Sick Pet', '🐾', '你的宠物{n}生病了，没精打采。|Your pet {n} is sick and listless.', [
      O('带去宠物医院|Take it to the vet', function (c) { if (!c.pay(c.$(800))) return '你付不起医药费……|You can\'t afford the vet bill...'; return '{n}很快康复了，又活蹦乱跳。|{n} recovered quickly and is bouncing around again.'; }),
      O('自己照顾|Care for it yourself', function (c) { if (G.ch(.5)) return '{n}慢慢好起来了。|{n} slowly got better.'; G.S.assets.pets = G.S.assets.pets.filter(function (x) { return x.id !== c.prm.pid; }); H.fx(c, { happy: -12 }); return '{n}没能挺过去……|{n} didn\'t make it...'; })
    ], { bad: 1, prep: function (c) { var pt = G.pick(G.S.assets.pets); if (!pt) return false; c.prm.n = pt.name; c.prm.pid = pt.id; } }),
    E('x_pet_old', [5, 120], '告别|Goodbye, Old Friend', '🌈', '陪伴你多年的{n}，安详地离开了。|{n}, your companion of many years, passed away peacefully.', [
      O('好好安葬它|Give it a proper burial', function (c) { G.S.assets.pets = G.S.assets.pets.filter(function (x) { return x.id !== c.prm.pid; }); H.fx(c, { happy: -10 }); return '你在树下埋葬了{n}，哭了很久。|You buried {n} beneath a tree and cried for a long time.'; })
    ], { prep: function (c) { var olds = G.S.assets.pets.filter(function (x) { var d = G.PETS.filter(function (y) { return y.id === x.kind; })[0]; return d && G.S.year - x.by >= d.life; }); var pt = G.pick(olds); if (!pt) return false; c.prm.n = pt.name; c.prm.pid = pt.id; }, w: 5, rep: 1, cd: 1 }),
    E('x_pet_hero', [5, 100], '忠犬|Loyal Companion', '🦮', '半夜家里进了小偷，{n}狂叫着把小偷吓跑了！|A burglar broke in at night, and {n} barked them right out the door!', [
      O('给它加个大鸡腿|Reward it with a big treat', R('{n}是家里的英雄。|{n} is the family hero.', { happy: 8 }))
    ], { good: 1, prep: function (c) { var pt = G.pick(G.S.assets.pets.filter(function (x) { return x.kind === 'dog'; })); if (!pt) return false; c.prm.n = pt.name; } }),
    E('x_tiger', [18, 100], '老虎出逃|Escaped Tiger', '🐯', '你养的老虎冲出了院子，整条街都在尖叫！|Your tiger broke out of the yard, and the whole street is screaming!', [
      O('亲自去抓|Catch it yourself', RC(.6, '你用一大块牛排把它引了回来。|You lured it back with a giant steak.', { fame: 5, heat: 15 }, '老虎抓伤了你。|The tiger mauled you.', { health: -30, heat: 20 })),
      O('报警|Call the authorities', function (c) { G.S.assets.pets = G.S.assets.pets.filter(function (x) { return x.kind !== 'tiger'; }); H.fx(c, { heat: 30, fame: 6 }); return '老虎被没收，你上了新闻，还被立案调查。|The tiger was confiscated; you made the news and are under investigation.'; })
    ], { bad: 1, if: function (S) { return S.assets.pets.some(function (x) { return x.kind === 'tiger'; }); }, w: 2 }),
    E('x_house_up', [20, 100], '房子涨价了|Your Home Appreciated', '📈', '你的房子比买的时候涨了好多。|Your home is worth far more than you paid.', [
      O('卖掉套现|Sell and cash out', function (c) { var h = G.S.assets.houses.filter(function (x) { return x.val > x.cost * 1.5; })[0]; if (!h) return '算了。|Never mind.'; var net = G.money.sellHouse(h); c.prm.m = G.M(net); H.fx(c, { happy: 8 }); return '你卖掉了房子，到手{m}！|You sold the home and pocketed {m}!'; }),
      O('继续持有|Hold on to it', R('你觉得还会涨。|You think it\'ll go higher.', { happy: 3 }))
    ], { good: 1, if: function (S) { return S.assets.houses.some(function (x) { return x.val > x.cost * 1.5; }); } }),
    E('x_tenant', [22, 100], '租客|Tenant Trouble', '🔑', '你出租的房子里，租客已经三个月没交房租了。|The tenant in your rental hasn\'t paid in three months.', [
      O('上门催租|Go demand the rent', RC(.5, '租客补齐了房租。|The tenant paid up.', { money: 1500 }, '租客连夜跑了，屋里一片狼藉。|The tenant fled overnight, leaving the place trashed.', { money: -1000 })),
      O('打官司|Take them to court', R('官司打赢了，但律师费也不少。|You won, but legal fees ate most of it.', { money: 300 }))
    ], { bad: 1, if: function (S) { return S.assets.houses.some(function (x) { return x.rent; }); } }),
    E('x_demolish', [18, 100], '拆迁|Demolition Windfall', '🏚️', '你家的老房子划入了拆迁范围！|Your old house falls within a redevelopment zone!', [
      O('拿钱|Take the cash', function (c) { var h = G.S.assets.houses.filter(function (x) { return x.k === 'old' || x.k === 'self'; })[0]; var m = h ? h.val * G.rf(3, 6) : c.$(300000); if (h) G.S.assets.houses = G.S.assets.houses.filter(function (x) { return x !== h; }); c.money(Math.round(m)); c.prm.m = G.M(Math.round(m)); G.major('拆迁暴富|Struck it rich from redevelopment'); return '你拿到了{m}拆迁款，一夜暴富！|You received {m} in compensation — rich overnight!'; }),
      O('当钉子户|Hold out for more', RC(.5, '你坚持到最后，拿到了更多补偿！|You held out to the end and got even more!', { money: 600000 }, '最后拿到的补偿反而更少了。|You ended up with less.', { money: 100000 }))
    ], { good: 1, w: 1.2, y: [1995, 2020], if: function (S, p) { return H.cn(S, p) && S.assets.houses.some(function (x) { return x.k === 'old' || x.k === 'self'; }); } }),
    E('x_car_crash', [18, 90], '剐蹭|Fender Bender', '🚗', '你的车被一辆豪车剐蹭了，对方下车就骂。|A luxury car scrapes yours, and the driver comes out yelling.', [
      O('据理力争|Stand your ground', RC(.6, '交警判定对方全责。|The traffic police ruled it entirely their fault.', { money: 500 }, '对方有关系，你吃了哑巴亏。|They had connections; you ate the loss.', { money: -800, happy: -5 })),
      O('私了|Settle privately', R('你赔了点钱了事。|You paid a bit and moved on.', { money: -300 }))
    ], { if: function (S) { return S.assets.cars.length; } }),
    // ---------- elite partners (VIP pools) ----------
    E('x_elite_meet', [18, 60], '命中注定的相遇|A Fateful Encounter', '✨', '在一次活动上，{n}（{j}）主动和你搭话，眼神里满是欣赏。|At an event, {n} ({j}) approaches you, eyes full of admiration.', [
      O('聊下去|Keep talking', function (c) { var n = c.npc; n.pin = 1; N.addLove(n, 25); N.addAff(n, 20); return '你们交换了联系方式。去“关系”里看看{n}吧。|You exchanged numbers. Check on {n} under "Relationships".'; }),
      O('礼貌告辞|Politely excuse yourself', function (c) { delete G.S.npcs[c.npc.id]; return '你礼貌地离开了。|You politely left.'; })
    ], { good: 1, w: function () { return G.vip.tier() * .8; }, if: function () { return !N.spouse(); }, prep: function (c) { var tags = G.love.eliteTags(); if (!tags.length) return false; var n = N.mkRomantic({ rel: 'contact', tags: [G.pick(tags)], love: G.ri(35, 60), aff: 20 }); c.npc = n; c.prm.n = n.name; c.prm.j = n.job; } }),
    // ---------- odd & fun ----------
    E('x_dream', [6, 100], '奇怪的梦|A Strange Dream', '💭', '你梦见自己活成了另一个人，醒来后久久不能平静。|You dreamed you lived as someone else and woke up shaken.', [
      O('写进日记|Write it in your journal', R('你记下了这个梦。|You wrote down the dream.', { smarts: 1, happy: 1 })),
      O('去买彩票|Go buy a lottery ticket', RC(.08, '梦里的数字中奖了！|The numbers from your dream won!', { money: 10000, happy: 10 }, '没中。|No luck.', { money: -2 }))
    ], { w: .5 }),
    E('x_blindbox', [10, 50], '盲盒|Blind Box', '🎁', '你迷上了抽盲盒，想集齐一整套。|You\'re hooked on blind boxes and want the full set.', [
      O('一次买十个|Buy ten at once', RC(.2, '你抽到了隐藏款！转手卖了好价钱。|You pulled the secret rare and resold it for a fortune!', { money: 800, happy: 8 }, '全是重复的……|All duplicates...', { money: -120, happy: -2 })),
      O('理性消费|Shop sensibly', R('你只买了一个，开心就好。|You bought just one — it\'s about the fun.', { money: -12, happy: 2 }))
    ], { if: function (S) { return S.year >= 2016; } }),
    E('x_bikeshare', [12, 70], '共享单车|Bike-Share Boom', '🚲', '满大街都是五颜六色的共享单车。|Colorful shared bikes are everywhere.', [
      O('骑车上班|Bike to work', R('你每天骑车，身体好了不少。|Daily rides improved your health.', { fit: 4, health: 2 })),
      O('投资共享单车公司|Invest in a bike-share company', RC(.15, '你赶上了风口！|You caught the wave!', { money: 8000 }, '公司倒闭了，押金都退不回来。|The company collapsed — not even the deposit came back.', { money: -3000 }))
    ], { y: [2016, 2018], w: 2, if: H.cn }),
    E('x_livestream', [18, 70], '直播带货|Livestream Shopping', '🛍️', '你看直播时，主播喊着“最后三秒！”，你的手停不下来。|Watching a livestream, the host shouts "Last three seconds!" and you can\'t stop clicking.', [
      O('买买买|Buy buy buy', R('快递堆满了门口。|Packages pile up at your door.', { money: -400, happy: 4 })),
      O('关掉直播|Close the stream', R('你忍住了。|You resisted.', {}))
    ], { if: function (S) { return S.year >= 2019; } }),
    E('x_fortune2', [18, 80], '庙会求签|Temple Fortune', '🏮', '你在庙会上抽了一支签。|At the temple fair, you draw a fortune stick.', [
      O('看看是什么签|Read it', function (c) { var r = G.ri(0, 2); H.fx(c, [{ happy: 6, luck: 3 }, { happy: 1 }, { happy: -4 }][r]); return ['上上签！万事如意！|Supreme luck! All will go well!', '中签，平平安安。|Middling — safe and sound.', '下下签……你心里有点不安。|Worst luck... you feel uneasy.'][r]; })
    ], { if: H.east }),
    E('x_volunteer_abroad', [20, 35], '海外志愿|Volunteering Abroad', '🌍', '你有机会去非洲参与一年的志愿项目。|You have a chance to volunteer in Africa for a year.', [
      O('去！|Go!', R('这一年改变了你看世界的方式。|That year changed how you see the world.', { karma: 12, eq: 4, happy: 8, money: -1500 })),
      O('下次吧|Maybe next time', R('你留在了原地。|You stayed put.', {}))
    ], { w: .3 }),
    E('x_documentary', [25, 90], '纪录片|Documentary', '🎥', '一个纪录片团队想拍你的人生故事。|A documentary crew wants to film your life story.', [
      O('同意拍摄|Agree', R('纪录片播出后，很多人被你的故事打动。|After it aired, many were moved by your story.', { fame: 10, happy: 6 })),
      O('拒绝|Decline', R('你更喜欢低调的生活。|You prefer a quiet life.', {}))
    ], { good: 1, w: function (S, p) { return p.st.fame > 40 || (S.cnt.jailYrs || 0) > 5 || G.netWorth() > G.$(5e7) ? .8 : 0; } })
  ]);

  /* system events require their subject to still exist when they run */
  var NEED = {
    job: ['sys_fired', 'sys_promo', 'w_bonus'],
    gang: ['sys_gang_raid', 'sys_gang_war', 'sys_gang_test', 'sys_gang_boss'],
    pol: ['sys_case', 'sys_raid', 'sys_bribe'],
    mil: ['sys_mission', 'sys_cons_end', 'sys_officer', 'sys_mil_retire'],
    gov: ['sys_policy', 'sys_reelect', 'sys_removed', 'sys_gov_bribe', 'sys_investigation', 'sys_poli_offer'],
    fc: ['sys_fame_up', 'sys_scandal', 'sys_fame_retire'],
    company: ['sys_bankrupt', 'sys_ipo', 'sys_biz_crisis'],
    jail: ['sys_release', 'sys_parole']
  };
  Object.keys(NEED).forEach(function (k) {
    NEED[k].forEach(function (id) {
      var d = G.EV[id]; if (!d) return; var f = d.if;
      d.if = function (S, p) { var ok = k === 'company' ? !!S.assets.company : !!p[k]; if (k === 'job' && ok && G.JOB[p.job.id].pt && id !== 'w_bonus') ok = id === 'sys_promo' ? false : true; return ok && (!f || f(S, p)); };
    });
  });
})();
