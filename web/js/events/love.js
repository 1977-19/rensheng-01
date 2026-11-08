/* Romance, marriage, and parenting events */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function withPartner(c) { var pt = N.partner(); if (!pt) return false; c.npc = pt; c.prm.n = pt.name; var pr = G.pr(pt.g); for (var k in pr) c.prm[k] = pr[k]; }
  function withKid(c, a, b) { var ks = N.rel('child').filter(function (k) { var x = N.age(k); return x >= a && x <= b; }); if (!ks.length) return false; var k = G.pick(ks); c.npc = k; c.prm.n = k.name; var pr = G.pr(k.g); for (var key in pr) c.prm[key] = pr[key]; }
  function hasPt() { return !!N.partner(); }
  G.evs([
    E('l_valentine', [16, 70], '情人节|Valentine\'s Day', '🌹', '今天是情人节，{n}好像在期待什么。|It\'s Valentine\'s Day, and {n} seems to be expecting something.', [
      O('精心准备惊喜|Plan an elaborate surprise', function (c) { if (!c.pay(c.$(300))) return '你没钱准备惊喜……|You can\'t afford a surprise...'; H.fx(c, { love: 12, happy: 6 }); return '烛光晚餐加一大束玫瑰，{n}感动得哭了。|A candlelit dinner and a huge bouquet — {n} was moved to tears.'; }),
      O('送一束花|Bring flowers', R('{n}很开心。|{n} was happy.', { love: 5, money: -50 })),
      O('忘了……|Forgot...', R('{n}一整天都没理你。|{n} gave you the silent treatment all day.', { love: -10, happy: -4 }))
    ], { rep: 1, cd: 3, prep: withPartner }),
    E('l_anniv', [18, 90], '纪念日|Anniversary', '💝', '今天是你们的纪念日。|Today is your anniversary.', [
      O('一起回到初遇的地方|Return to where you first met', R('你们手牵手走过当年的路，仿佛回到了从前。|Hand in hand you retraced old steps, as if no time had passed.', { love: 10, happy: 6 })),
      O('送贵重礼物|Give an expensive gift', function (c) { if (!c.pay(c.$(1500))) return '钱不够……|Not enough money...'; H.fx(c, { love: 8 }); return '{n}收到礼物，开心地亲了你一口。|{n} loved the gift and kissed you.'; }),
      O('加班忘了|Forgot while working late', R('{n}一个人在餐厅等到打烊。|{n} waited alone at the restaurant until closing.', { love: -15 }))
    ], { rep: 1, cd: 4, prep: withPartner }),
    E('l_meetparents', [18, 50], '见家长|Meeting the Parents', '🏠', '{n}要带你回家见父母。|{n} is taking you home to meet the parents.', [
      O('精心打扮，带上厚礼|Dress up and bring generous gifts', function (c) { if (!c.pay(c.$(400))) return '你拿不出像样的礼物，有点尴尬。|You couldn\'t afford proper gifts; things were awkward.'; H.fx(c, { love: 8, eq: 1 }); return '对方父母对你非常满意。|Their parents adored you.'; }),
      O('做你自己|Just be yourself', RC(function (c) { return .4 + c.p.st.eq / 200; }, '对方父母觉得你很真诚。|Their parents found you genuine.', { love: 5 }, '对方父母嫌你家境一般，脸色不太好看。|Their parents frowned at your background.', { love: -3, happy: -5 }))
    ], { prep: function (c) { var pt = N.partner(); if (!pt || pt.rel !== 'lover' || G.S.p.age < 18) return false; return withPartner(c); } }),
    E('l_inlaw', [22, 70], '婆媳矛盾|In-law Conflict', '🥢', '你的家人和{n}因为家务和带孩子的事吵了起来。|Your family and {n} are fighting over chores and childcare.', [
      O('站在伴侣这边|Side with your spouse', R('{n}很感动，但你的父母很伤心。|{n} was touched, but your parents were hurt.', { love: 10, par: -8 })),
      O('站在父母这边|Side with your parents', R('{n}觉得你是个“妈宝”。|{n} thinks you\'re a mama\'s boy/girl.', { love: -12, par: 6 })),
      O('两边都哄|Smooth things over on both sides', RC(function (c) { return c.p.st.eq / 100; }, '你左右逢源，家里恢复了和平。|Your diplomacy restored peace at home.', { eq: 2 }, '两边都不满意，你成了夹心饼干。|Neither side was satisfied; you\'re stuck in the middle.', { happy: -6 }))
    ], { prep: function (c) { if (!N.spouse() || !H.hasPar()) return false; return withPartner(c); }, w: function (S, p) { return H.east(S, p) ? 1.2 : .5; } }),
    E('l_cold', [18, 90], '冷战|Cold War', '🧊', '你和{n}已经三天没说话了。|You and {n} haven\'t spoken in three days.', [
      O('先低头|Apologize first', R('你先道了歉，{n}也软了下来。|You apologized first, and {n} softened.', { love: 6, eq: 1 })),
      O('死扛到底|Hold out', RC(.5, '最后{n}先找你说话了。|In the end, {n} came to you first.', { love: -3 }, '冷战持续了一个月，感情出现了裂痕。|The silence dragged on for a month; cracks appeared.', { love: -15, happy: -6 }))
    ], { rep: 1, cd: 3, prep: withPartner, bad: 1 }),
    E('l_itch', [26, 60], '七年之痒|The Seven-Year Itch', '🥱', '婚姻进入了平淡期，你们每天除了孩子和账单，没什么话可聊。|The marriage feels flat. Beyond kids and bills, you have nothing to talk about.', [
      O('一起去旅行|Take a trip together', R('旅途中，你们找回了当初的感觉。|On the road, you found that old spark again.', { love: 12, money: -1500, happy: 6 })),
      O('报个双人舞蹈班|Take a couples dance class', R('你们笑着踩了对方好多脚。|You laughed while stepping on each other\'s toes.', { love: 8, sk: { dance: 5 } })),
      O('各过各的|Live separate lives', R('你们像室友一样生活。|You live like roommates.', { love: -10, happy: -4 }))
    ], { prep: function (c) { var s = N.spouse(); if (!s || G.S.year - (s.wedY || G.S.year) < 6) return false; return withPartner(c); } }),
    E('l_pt_sick', [20, 90], '伴侣生病|Your Partner Is Sick', '🏥', '{n}病倒了，需要人照顾。|{n} has fallen ill and needs care.', [
      O('请假悉心照顾|Take leave to care for them', R('{n}握着你的手说：“有你真好。”|{n} held your hand and said, "I\'m so lucky to have you."', { love: 15, perf: -4 })),
      O('请个护工|Hire a caregiver', R('护工照顾得很周到，但{n}有点失落。|The caregiver was attentive, but {n} felt a bit let down.', { money: -800, love: -2 }))
    ], { prep: withPartner, bad: 1 }),
    E('l_pt_jobloss', [22, 65], '伴侣失业|Partner Lost Their Job', '📉', '{n}失业了，整天闷闷不乐。|{n} lost their job and is moping around.', [
      O('鼓励{him}|Encourage {him}', R('在你的鼓励下，{n}很快找到了新工作。|With your support, {n} quickly found a new job.', { love: 8 })),
      O('埋怨{him}|Blame {him}', R('{n}更加消沉，你们大吵了一架。|{n} sank lower, and you had a huge fight.', { love: -15 }))
    ], { prep: function (c) { var r = withPartner(c); if (r === false || !c.npc.inc) return false; c.npc.inc = Math.round(c.npc.inc * .3); } }),
    E('l_pt_promo', [22, 65], '伴侣升职|Partner\'s Promotion', '🎉', '{n}升职加薪了！|{n} got a promotion and a raise!', [
      O('为{him}庆祝|Celebrate with {him}', function (c) { c.npc.inc = Math.round((c.npc.inc || G.$w(40000)) * 1.3); H.fx(c, { love: 6, happy: 4 }); return '你们开了一瓶香槟庆祝。|You popped a bottle of champagne.'; }),
      O('有点嫉妒|Feel a little jealous', function (c) { c.npc.inc = Math.round((c.npc.inc || G.$w(40000)) * 1.3); H.fx(c, { happy: -3 }); return '你心里酸溜溜的。|You feel a pang of envy.'; })
    ], { good: 1, prep: withPartner }),
    E('l_suspect', [20, 70], '可疑的消息|Suspicious Messages', '📱', '{n}最近总是抱着手机偷笑，还设了密码。|{n} keeps smiling at their phone lately and added a passcode.', [
      O('偷看手机|Snoop on the phone', function (c) { var n = c.npc; if (n.cheat) { G.EV.sys_partner_cheat && c.ev('sys_partner_cheat', {}, n.id); return '你的预感是对的……|Your gut was right...'; } N.addLove(n, -10); return '原来{he}在给你准备生日惊喜，你被发现偷看后很尴尬。|Turns out {he} was planning your birthday surprise. Getting caught snooping was mortifying.'; }),
      O('直接问|Ask directly', function (c) { var n = c.npc; if (n.cheat && G.ch(.5)) { c.ev('sys_partner_cheat', {}, n.id); return '{n}支支吾吾，最后承认了。|{n} stammered, then confessed.'; } return '{n}说是工作群，你选择相信。|{n} says it\'s a work chat. You choose to believe it.'; }),
      O('不去想|Don\'t think about it', R('你选择了信任。|You choose trust.', {}))
    ], { prep: withPartner }),
    E('l_rich_rival', [20, 50], '情敌|A Rival Appears', '😾', '一个有钱又帅气的人在疯狂追求{n}。|Someone rich and attractive is aggressively pursuing {n}.', [
      O('加倍对{him}好|Double down on being good to {him}', R('{n}说：“我只喜欢你。”|{n} said, "You\'re the only one for me."', { love: 8, money: -500 })),
      O('找情敌谈判|Confront the rival', async function (c) { var r = await c.game('fight', { name: '情敌|Rival' }); if (r.win) { H.fx(c, { love: 5, rep: 3 }); return '情敌知难而退。|The rival backed off.'; } H.fx(c, { love: -5, health: -5 }); return '你被情敌羞辱了。|The rival humiliated you.'; }),
      O('相信{him}|Trust {him}', RC(function (c) { return c.npc.loyal / 100; }, '{n}果断拒绝了对方。|{n} turned them down flat.', { love: 4 }, '{n}好像有点动摇了……|{n} seems tempted...', { love: -10 }))
    ], { prep: function (c) { var pt = N.partner(); if (!pt || pt.looks < 55) return false; return withPartner(c); } }),
    E('l_longdist', [18, 40], '异地恋|Long-Distance', '✈️', '{n}要去另一个城市工作，你们要异地了。|{n} is moving to another city for work. You\'ll be long-distance.', [
      O('坚持异地|Make it work', RC(.6, '每晚视频，你们熬过了异地。|Nightly video calls got you through.', { love: 6 }, '距离消磨了感情，你们分手了。|Distance wore you down, and you broke up.', { happy: -8 })),
      O('跟{him}一起走|Move with {him}', function (c) { if (c.p.job && !G.JOB[c.p.job.id].pt) G.career.leave(); c.p.city = G.pick(G.C[c.p.country].cities[G.ri(1, 2)]); H.fx(c, { love: 15 }); return '你辞职跟着{n}去了新城市。|You quit your job and moved with {n}.'; })
    ], { prep: function (c) { var pt = N.partner(); if (!pt || pt.rel !== 'lover') return false; return withPartner(c); }, w: .5 }),
    E('l_flash', [20, 40], '闪婚|Whirlwind Marriage', '⚡', '你和{n}才认识一个月，{he}就提议结婚。|You\'ve known {n} only a month, and {he} suggests getting married.', [
      O('结！|Let\'s do it!', async function (c) { c.npc.engaged = 1; var ok = await G.love.marry(c.npc); return ok ? '你们闪婚了！|You got married in a flash!' : '婚礼没办成。|The wedding fell through.'; }),
      O('太快了|Too fast', R('你说想再了解一下。|You want more time.', { love: -3 }))
    ], { prep: function (c) { var pt = N.partner(); if (!pt || pt.rel !== 'lover' || (pt.yrs || 0) > 1 || G.S.p.age < 20) return false; return withPartner(c); }, w: .4 }),
    E('l_rich_pt_gift', [20, 70], '豪礼|Lavish Gift', '🎁', '{n}送了你一份大礼。|{n} gives you an extravagant gift.', [
      O('开心收下|Accept happily', function (c) { var v = Math.round(Math.min(c.npc.wealth * .03, c.$(500000))); c.npc.wealth -= v; c.money(v); return G.L('价值{m}！|Worth {m}!', { m: G.M(v) }); }),
      O('婉拒|Decline', R('你说你在乎的是{him}这个人。|You said you care about {him}, not things.', { love: 8, karma: 2 }))
    ], { good: 1, prep: function (c) { var pt = N.partner(); if (!pt || pt.wealth < G.$(1e6)) return false; return withPartner(c); } }),
    E('l_gold_digger', [22, 80], '真心还是钱？|Love or Money?', '💰', '你无意中听到{n}在电话里说：“等拿到TA的钱就……”|You overhear {n} on the phone: "Once I get their money..."', [
      O('当面质问|Confront them', function (c) { if (c.npc.rel === 'spouse') { c.npc.prenup = 1; G.love.divorce(c.npc, true); } else G.love.breakup(c.npc); return '{n}的真面目暴露了，你结束了这段关系。|{n}\'s true face was revealed, and you ended it.'; }),
      O('装作不知道|Pretend you didn\'t hear', R('你心里埋下了一根刺。|A thorn lodges in your heart.', { happy: -8 }))
    ], { prep: function (c) { var pt = N.partner(); if (!pt || pt.sincere > 35 || N.netWorthScore() < .5) return false; return withPartner(c); }, w: 1.5 }),
    // ---------- parenting ----------
    E('k_night', [18, 60], '新手父母|New Parent', '🍼', '宝宝每晚都哭个不停，你已经很久没睡好觉了。|The baby cries every night; you haven\'t slept properly in ages.', [
      O('亲力亲为|Do it all yourself', R('你熬成了熊猫眼，但和宝宝格外亲。|You have panda eyes, but you\'re closer than ever with the baby.', { health: -3, kids: 8, happy: -2 })),
      O('请个保姆|Hire a nanny', R('保姆很专业，你终于能睡个好觉了。|The nanny is a pro; you finally sleep.', { money: -2000, health: 2 })),
      O('交给爷爷奶奶|Leave it to the grandparents', R('老人家很乐意帮忙。|The grandparents are happy to help.', { par: 3 }))
    ], { prep: function (c) { return withKid(c, 0, 1); } }),
    E('k_first', [18, 70], '第一次|A First', '👣', '{n}今天第一次{x}！|Today {n} {y} for the first time!', [
      O('拍下来|Capture it on video', R('这段视频你看了一百遍。|You watched the video a hundred times.', { happy: 8, kids: 3 }))
    ], { prep: function (c) { var r = withKid(c, 1, 2); if (r === false) return false; var i = G.ri(0, 2); c.prm.x = ['叫了爸爸妈妈|', '走路|', '自己吃饭|'][i]; c.prm.y = ['|said "mama"', '|walked', '|fed themselves'][i]; } }),
    E('k_top', [18, 80], '考了第一|Top of the Class', '🏆', '{n}考了全班第一！|{n} came first in class!', [
      O('大力奖励|Reward generously', R('你带{him}去游乐园玩了一天。|You took {him} to an amusement park for the day.', { kids: 6, money: -150, happy: 6 })),
      O('提醒{him}不要骄傲|Remind {him} to stay humble', R('{n}有点失落。|{n} looks a bit deflated.', { kids: -2 }))
    ], { good: 1, prep: function (c) { var r = withKid(c, 7, 17); if (r === false || c.npc.smarts < 60) return false; } }),
    E('k_rebel', [30, 70], '孩子叛逆|Teenage Rebellion', '😤', '{n}进入了叛逆期，天天和你对着干。|{n} hit their rebellious phase and defies you at every turn.', [
      O('严加管教|Lay down the law', RC(.5, '{n}收敛了不少。|{n} toned it down.', { kids: 2 }, '{n}摔门而去，好几天没回家。|{n} slammed the door and didn\'t come home for days.', { kids: -10, happy: -6 })),
      O('耐心沟通|Talk it through patiently', R('你们聊了一整晚，{n}哭着抱住了你。|You talked all night, and {n} hugged you in tears.', { kids: 8, eq: 2 })),
      O('随{him}去吧|Let {him} be', R('你选择放手。|You let go.', { kids: -2 }))
    ], { prep: function (c) { return withKid(c, 13, 17); } }),
    E('k_bullied', [25, 70], '孩子被欺负|Your Child Is Bullied', '😢', '{n}哭着回家，说在学校被欺负了。|{n} comes home crying — bullied at school.', [
      O('去学校讨说法|Go to the school', R('学校处理了霸凌者。|The school disciplined the bullies.', { kids: 6 })),
      O('教{him}反击|Teach {him} to fight back', function (c) { c.npc.eq = G.clamp(c.npc.eq + 3, 0, 100); H.fx(c, { kids: 4 }); return '{n}学会了保护自己。|{n} learned to stand up for themselves.'; }),
      O('让{him}忍忍|Tell {him} to tough it out', R('{n}变得越来越沉默。|{n} grew quieter and quieter.', { kids: -8 }))
    ], { bad: 1, prep: function (c) { return withKid(c, 6, 15); } }),
    E('k_console', [25, 70], '想要游戏机|Wants a Game Console', '🎮', '{n}缠着你要买最新款游戏机。|{n} keeps begging you for the newest game console.', [
      O('买！|Buy it!', function (c) { if (!c.pay(c.$(500))) return '你买不起……|You can\'t afford it...'; H.fx(c, { kids: 10 }); c.npc.smarts = G.clamp(c.npc.smarts - 1, 0, 100); return '{n}高兴得跳了起来。|{n} jumped for joy.'; }),
      O('考到前十名就买|Only if you rank top ten', R('{n}憋着一股劲学习。|{n} buckled down to earn it.', { kids: -2 })),
      O('不行|No', R('{n}噘着嘴回了房间。|{n} sulked off to their room.', { kids: -6 }))
    ], { prep: function (c) { if (G.S.year < 1985) return false; return withKid(c, 7, 16); } }),
    E('k_puppy', [25, 70], '孩子的早恋|Child\'s First Crush', '💕', '你发现{n}在偷偷给同学写情书。|You discover {n} secretly writing love letters to a classmate.', [
      O('支持{him}|Be supportive', R('{n}红着脸跟你分享了心事。|{n} blushed and shared their feelings with you.', { kids: 8 })),
      O('严厉禁止|Forbid it', R('{n}觉得你不懂{him}。|{n} feels you don\'t understand them.', { kids: -8 }))
    ], { prep: function (c) { return withKid(c, 13, 17); } }),
    E('k_comeout', [30, 80], '孩子出柜|Your Child Comes Out', '🏳️‍🌈', '{n}鼓起勇气告诉你，{he}喜欢同性。|{n} gathers the courage to tell you they\'re gay.', [
      O('拥抱{him}|Hug {him}', R('“你永远是我的孩子。”{n}哭了。|"You\'ll always be my child." {n} burst into tears.', { kids: 15, karma: 4 })),
      O('一时接受不了|Struggle to accept it', R('{n}失望地搬了出去。|{n} moved out, disappointed.', { kids: -20 }))
    ], { prep: function (c) { var ks = N.rel('child').filter(function (k) { return k.orient !== 'het' && N.age(k) >= 15 && !k.outed; }); if (!ks.length) return false; var k = G.pick(ks); k.outed = 1; c.npc = k; c.prm.n = k.name; var pr = G.pr(k.g); for (var key in pr) c.prm[key] = pr[key]; } }),
    E('k_wedding', [42, 85], '孩子要结婚|Your Child Is Getting Married', '💒', '{n}要结婚了，想请你帮忙出首付/彩礼。|{n} is getting married and asks for help with the down payment or wedding costs.', [
      O('倾囊相助|Give generously', function (c) { var m = Math.round(Math.min(c.p.money * .4, c.$(60000))); c.money(-m); c.npc.wealth += m; H.fx(c, { kids: 12 }); c.prm.m = G.M(m); return '你给了{m}，{n}紧紧抱住了你。|You gave {m}, and {n} held you tight.'; }),
      O('意思一下|Give a token amount', function (c) { var m = c.$(2000); c.money(-m); c.npc.wealth += m; H.fx(c, { kids: 2 }); return '{n}笑着说谢谢。|{n} smiled and said thanks.'; }),
      O('自己的事自己解决|Tell {him} to handle it', R('{n}有些心寒。|{n} feels let down.', { kids: -10 }))
    ], { prep: function (c) { var ks = N.rel('child').filter(function (k) { return N.age(k) >= 23 && !k.spouseId && !k.wedAsk; }); if (!ks.length) return false; var k = G.pick(ks); k.wedAsk = 1; c.npc = k; c.prm.n = k.name; var pr = G.pr(k.g); for (var key in pr) c.prm[key] = pr[key]; } }),
    E('k_moocher', [45, 90], '啃老|Freeloading Child', '🛋️', '{n}已经二十多岁了，还天天在家躺着，伸手要钱。|{n} is in their twenties and still lies around at home asking for money.', [
      O('断供，逼{him}独立|Cut {him} off', R('{n}气得搬了出去，但很快找到了工作。|{n} stormed out — and soon found a job.', { kids: -8 })),
      O('继续养着|Keep supporting {him}', R('你的养老钱一点点被掏空。|Your retirement savings slowly drain away.', { money: -3000, kids: 4 }))
    ], { prep: function (c) { var ks = N.rel('child').filter(function (k) { return N.age(k) >= 22 && N.age(k) <= 35 && !k.jobT; }); if (!ks.length) return false; var k = G.pick(ks); c.npc = k; c.prm.n = k.name; var pr = G.pr(k.g); for (var key in pr) c.prm[key] = pr[key]; } }),
    E('k_filial', [55, 100], '孝顺的孩子|A Devoted Child', '🎁', '{n}给你寄来一大笔钱，还说要接你去享福。|{n} sends you a large sum and offers to have you live with them.', [
      O('欣慰地收下|Accept with gratitude', function (c) { var m = Math.round(Math.max(c.$(1000), (c.npc.wealth || 0) * .05)); c.npc.wealth -= m; c.money(m); H.fx(c, { happy: 10 }); c.prm.m = G.M(m); return '{n}寄来{m}，你逢人就夸孩子孝顺。|{n} sent {m}, and you brag about your child to everyone.'; })
    ], { good: 1, prep: function (c) { var ks = N.rel('child').filter(function (k) { return N.age(k) >= 25 && k.aff > 50; }); if (!ks.length) return false; var k = G.pick(ks); c.npc = k; c.prm.n = k.name; } }),
    E('k_ungrateful', [60, 100], '不孝|Neglected', '😞', '你已经好几年没见过{n}了，打电话也总说忙。|You haven\'t seen {n} in years; every call ends with "I\'m busy."', [
      O('主动去看{him}|Visit {him} yourself', R('{n}愣了一下，眼眶红了。|{n} froze, then teared up.', { kids: 10, happy: 4 })),
      O('默默难过|Grieve quietly', R('你一个人看着老照片发呆。|You sit alone, staring at old photos.', { happy: -8 }))
    ], { bad: 1, prep: function (c) { var ks = N.rel('child').filter(function (k) { return N.age(k) >= 25 && k.aff < 30; }); if (!ks.length) return false; var k = G.pick(ks); c.npc = k; c.prm.n = k.name; var pr = G.pr(k.g); for (var key in pr) c.prm[key] = pr[key]; } })
  ]);
})();
