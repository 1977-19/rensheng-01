/* NPC-initiated stories & proactive chat messages */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function pickNpc(c, rels, f) {
    var list = N.rel.apply(null, rels).filter(function (n) { return n.alive && (!f || f(n)); });
    if (!list.length) return false;
    var n = G.pick(list); c.npc = n; c.prm.n = n.name; c.prm.r = N.relName(n);
    var pr = G.pr(n.g); for (var k in pr) c.prm[k] = pr[k];
    return n;
  }
  var L = [
    E('n_friend_wedding', [20, 60], '婚礼邀请|Wedding Invitation', '💒', '{n}要结婚了，想请你当{x}。|{n} is getting married and wants you as {y}.', [
      O('欣然答应|Happily accept', function (c) { G.dPush('aff', N.addAff(c.npc, 15)); c.npc.married = true; H.fx(c, { happy: 6, money: -300 }); return '婚礼上你讲了一段感人的致辞，全场都哭了。|Your toast at the wedding moved everyone to tears.'; }),
      O('只随份子|Just send a gift', function (c) { G.dPush('aff', N.addAff(c.npc, 3)); c.npc.married = true; H.fx(c, { money: -200 }); return '你包了个红包。|You sent a generous gift.'; }),
      O('找借口不去|Make an excuse', function (c) { G.dPush('aff', N.addAff(c.npc, -12)); c.npc.married = true; return '{n}嘴上说没事，但明显不高兴。|{n} says it\'s fine, but is clearly hurt.'; })
    ], { prep: function (c) { if (!pickNpc(c, ['friend', 'classmate', 'colleague'], function (n) { return !n.married && N.age(n) >= 22 && n.aff > 20; })) return false; c.prm.x = G.S.p.g === 'm' ? '伴郎|' : '伴娘|'; c.prm.y = G.S.p.g === 'm' ? '|best man' : '|maid of honor'; } }),
    E('n_friend_call', [14, 90], '深夜来电|Late-Night Call', '📞', '凌晨两点，{n}打来电话，声音哽咽：“我能和你说说话吗？”|At 2 a.m., {n} calls, voice breaking: "Can I talk to you?"', [
      O('陪{him}聊到天亮|Talk until dawn', function (c) { G.dPush('aff', N.addAff(c.npc, 20)); H.fx(c, { eq: 2, health: -1, karma: 3 }); return '你静静地听{him}说完，{he}说幸好有你。|You listened quietly; {he} said thank goodness for you.'; }),
      O('敷衍几句就挂了|Say a few words and hang up', function (c) { G.dPush('aff', N.addAff(c.npc, -10)); return '{n}挂电话前沉默了很久。|{n} was silent a long time before hanging up.'; })
    ], { prep: function (c) { if (!pickNpc(c, ['friend', 'sibling'], function (n) { return n.aff > 25 && N.age(n) >= 14; })) return false; } }),
    E('n_friend_biz', [22, 60], '合伙生意|A Partnership Offer', '🤝', '{n}想开一家店，拉你一起入股{m}。|{n} wants to open a shop and asks you to invest {m}.', [
      O('入股|Invest', function (c) { var amt = c.prm.amt; if (!c.pay(amt)) return '你拿不出这么多钱。|You don\'t have that much.'; if (G.ch(.35 + (c.npc.smarts - 50) / 200 + (G.has('biz') ? .15 : 0))) { var back = Math.round(amt * G.rf(1.5, 4)); c.money(back); G.dPush('aff', N.addAff(c.npc, 15)); return G.L('店铺生意火爆，你分到了{m}！|The shop was a hit — your share came to {m}!', { m: G.M(back) }); } N.addAff(c.npc, G.ch(.5) ? 5 : -15); return '店铺没撑过一年就关门了，钱打了水漂。|The shop closed within a year; your money was gone.'; }),
      O('婉拒|Decline', function (c) { G.dPush('aff', N.addAff(c.npc, -4)); return '你说再考虑考虑。|You said you\'d think about it.'; })
    ], { prep: function (c) { if (!pickNpc(c, ['friend', 'sibling', 'colleague'], function (n) { return n.aff > 15 && N.age(n) >= 22; })) return false; c.prm.amt = c.$(G.ri(5, 30) * 1000); c.prm.m = G.M(c.prm.amt); if (c.p.money < c.prm.amt * .5) return false; } }),
    E('n_sibling_money', [18, 80], '手足借钱|A Sibling Needs Help', '🫂', '{n}说生意周转不开，想找你借{m}。|{n} says business is tight and asks to borrow {m}.', [
      O('借|Lend it', function (c) { if (!c.pay(c.prm.amt)) return '你拿不出来。|You can\'t.'; G.dPush('aff', N.addAff(c.npc, 12)); if (G.ch(.55)) { c.money(c.prm.amt); return '{n}过了一年把钱还了，还多给了一份利息。|{n} paid you back a year later — with interest.'; } return '{n}后来再也没提这笔钱。|{n} never mentioned the money again.'; }),
      O('拒绝|Refuse', function (c) { G.dPush('aff', N.addAff(c.npc, -15)); H.fx(c, { par: -3 }); return '爸妈知道后说你没有手足之情。|Your parents said you have no family loyalty.'; })
    ], { prep: function (c) { if (!pickNpc(c, ['sibling'], function (n) { return N.age(n) >= 20; })) return false; c.prm.amt = c.$(G.ri(2, 20) * 1000); c.prm.m = G.M(c.prm.amt); if (c.p.money < c.prm.amt) return false; } }),
    E('n_backstab', [12, 70], '背后说坏话|Talking Behind Your Back', '🐍', '你听说{n}在背后到处说你的坏话。|You hear {n} has been badmouthing you behind your back.', [
      O('当面对质|Confront {him}', RC(.5, '{n}支支吾吾地道了歉。|{n} mumbled an apology.', { npc: -5, rep: 2 }, '你们大吵一架，彻底撕破了脸。|You had a blowout and became enemies.', { npc: -40 })),
      O('一笑置之|Laugh it off', R('清者自清。|The truth will out.', { eq: 2 })),
      O('以牙还牙|Return the favor', function (c) { c.npc.rel = 'rival'; G.dPush('aff', N.addAff(c.npc, -30)); H.fx(c, { karma: -4 }); return '你也开始散布{n}的八卦，你们成了对头。|You started spreading gossip about {n} too. Now you\'re rivals.'; })
    ], { bad: 1, prep: function (c) { if (!pickNpc(c, ['classmate', 'colleague', 'friend', 'contact'], function (n) { return N.age(n) >= 10 && n.aff < 35 && !n.bff; })) return false; } }),
    E('n_revenge', [14, 80], '冤家路窄|Old Grudges', '😠', '你的{r}{n}找上门来，扬言要让你好看。|Your {r}, {n}, shows up threatening to make you pay.', [
      O('打一架|Fight', async function (c) { var r = await c.game('fight', { name: '冤家|Grudge' }); if (r.win) { G.dPush('aff', N.addAff(c.npc, -10)); H.fx(c, { rep: 5 }); return '你把{n}打跑了。|You sent {n} running.'; } H.fx(c, { health: -12 }); return '你被{n}揍了一顿。|{n} beat you up.'; }),
      O('主动求和|Make peace', function (c) { if (G.ch(.4 + c.p.st.eq / 250)) { c.npc.rel = 'contact'; c.npc.aff = 0; return '你们握手言和了。|You shook hands and made peace.'; } return '{n}根本不领情。|{n} wanted none of it.'; }),
      O('报警|Call the police', R('警察警告了{n}。|The police warned {n}.', {}))
    ], { bad: 1, prep: function (c) { if (!pickNpc(c, ['enemy', 'rival'])) return false; } }),
    E('n_admirer_gift', [15, 70], '神秘礼物|A Mysterious Gift', '🎁', '你收到了{n}送来的一份礼物，附着一张字条：“只想让你开心。”|A gift arrives from {n}, with a note: "Just want to see you smile."', [
      O('收下并道谢|Accept and say thanks', function (c) { var v = Math.round(Math.min(c.npc.wealth * .02, c.$(c.npc.tags.length ? 20000 : 300)) + c.$(30)); c.money(v); G.dPush('love', N.addLove(c.npc, 6)); c.prm.m = G.M(v); return '礼物价值{m}，{n}开心得像个孩子。|The gift was worth {m}. {n} was thrilled you liked it.'; }),
      O('退回去|Send it back', function (c) { G.dPush('love', N.addLove(c.npc, -10)); return '你把礼物退了回去，划清了界限。|You returned it and drew a clear line.'; })
    ], { prep: function (c) { if (!pickNpc(c, ['admirer', 'crush', 'contact'], function (n) { return n.love > 40 && N.canRomance(n); })) return false; } }),
    E('n_lover_surprise', [16, 90], '惊喜|A Surprise', '🎉', '你一推开门，{n}给你准备了一屋子的气球和蛋糕。|You open the door to find {n} has filled the room with balloons and cake.', [
      O('紧紧抱住{him}|Hug {him} tight', R('那是你这一年最开心的一天。|It was the happiest day of your year.', { happy: 10, love: 6 }))
    ], { good: 1, prep: function (c) { if (!pickNpc(c, ['lover', 'spouse'], function (n) { return n.love > 60; })) return false; } }),
    E('n_friend_rich', [22, 80], '朋友发达了|A Friend Strikes It Rich', '💸', '{n}的公司上市了，一夜之间身家暴涨。|{n}\'s company went public, and {his} fortune exploded overnight.', [
      O('真心祝贺|Congratulate {him} sincerely', function (c) { c.npc.wealth += c.$(G.ri(2, 20) * 1e6); c.npc.tags = ['rich']; G.dPush('aff', N.addAff(c.npc, 10)); return '{n}请你吃了顿大餐，说以后有好事带上你。|{n} treated you to a feast and promised to cut you in on future deals.'; }),
      O('心里酸溜溜的|Feel jealous', function (c) { c.npc.wealth += c.$(G.ri(2, 20) * 1e6); c.npc.tags = ['rich']; H.fx(c, { happy: -6 }); return '你一晚上没睡着。|You couldn\'t sleep all night.'; })
    ], { prep: function (c) { if (!pickNpc(c, ['friend', 'classmate'], function (n) { return N.age(n) >= 25 && !n.tags.length; })) return false; }, w: .5 }),
    E('n_parent_anniv', [18, 70], '父母的纪念日|Your Parents\' Anniversary', '💐', '今年是爸妈结婚三十周年。|This year is your parents\' 30th wedding anniversary.', [
      O('张罗一场纪念宴|Throw them a celebration', function (c) { if (!c.pay(c.$(800))) return '你没钱张罗。|You couldn\'t afford it.'; H.fx(c, { par: 15, happy: 6 }); return '爸妈在宴会上又跳了一支舞，像年轻时一样。|Your parents danced at the party, just like when they were young.'; }),
      O('打个电话祝福|Call to congratulate', R('爸妈很高兴你记得。|Your parents were glad you remembered.', { par: 4 })),
      O('忘了|Forgot', R('妈妈在电话里说：“没事，你忙。”|Mom said on the phone, "It\'s okay, you\'re busy."', { par: -6 }))
    ], { noDry: 1, if: function (S, p) { var f = N.rel('father')[0], m = N.rel('mother')[0]; return !!(f && m && f.alive && m.alive && !f.sep && !m.sep && !p.flags.anniv); }, prep: function (c) { c.p.flags.anniv = 1; } }),
    E('n_mentor', [16, 40], '贵人相助|A Helping Hand', '🧭', '一位前辈{n}很欣赏你，愿意带你入行。|A senior figure, {n}, admires you and offers to show you the ropes.', [
      O('拜师学艺|Become {his} protégé', function (c) { c.npc.rel = 'mentor'; c.npc.pin = 1; G.dPush('aff', N.addAff(c.npc, 30)); H.fx(c, { smarts: 2, eq: 2, perf: 8 }); return '在{n}的指点下，你进步飞快。|Under {n}\'s guidance, you improved rapidly.'; }),
      O('谢绝|Politely decline', R('你想靠自己闯。|You want to make it on your own.', {}))
    ], { good: 1, noDry: 1, if: function (S, p) { return !p.jail && !p.gang; }, prep: function (c) { var n = N.make({ rel: 'contact', age: Math.min(c.p.age + G.ri(18, 35), G.ri(55, 63)), job: c.p.job ? G.JOB[c.p.job.id].r[G.JOB[c.p.job.id].r.length - 1] : '企业家|Entrepreneur', inc: G.$w(200000), aff: 25 }); c.npc = n; c.prm.n = n.name; var pr = G.pr(n.g); for (var k in pr) c.prm[k] = pr[k]; } }),
    E('n_kid_call', [40, 100], '孩子的好消息|Good News from Your Child', '📱', '{n}打来电话：“我升职了！”|{n} calls: "I got promoted!"', [
      O('为{him}骄傲|Tell {him} you\'re proud', R('挂了电话，你笑了很久。|After hanging up, you smiled for a long time.', { happy: 8, kids: 3 }))
    ], { good: 1, prep: function (c) { if (!pickNpc(c, ['child'], function (n) { return N.age(n) >= 24 && n.inc > 0; })) return false; } })
  ];
  /* gate each NPC story on a dry run of its prep (side-effect free) so the yearly picker never wastes a slot */
  var REP = {n_friend_wedding: 3, n_friend_call: 5, n_backstab: 6, n_admirer_gift: 3, n_lover_surprise: 5, n_kid_call: 5, n_sibling_money: 8};
  L.forEach(function (d) {
    if (REP[d.id]) { d.rep = 1; d.cd = REP[d.id]; }
    if (d.prep && !d.noDry) { var pp = d.prep, old = d.if; d.if = function (S, p) { return (!old || old(S, p)) && pp(G.ctx({})) !== false; }; }
    if (d.id === 'n_kid_call') { var o0 = d.o[0], r0 = o0.run; o0.run = function (c) { c.npc.inc = Math.round((c.npc.inc || 0) * 1.3); return r0(c); }; }
  });
  G.evs(L);

  /* proactive chat messages each year — context-aware, rate-limited, never repeats recent lines */
  var MSG = {
    parKid: ['作业写完了吗？写完再玩。|Finished your homework? Homework first, then play.', '放学早点回家，别在外面瞎逛。|Come straight home after school.', '今晚做你最爱吃的菜。|Making your favorite dish tonight.', '这次考试考得怎么样？|How did the exam go?', '天冷了，明天多穿件外套。|It\'s cold — wear a jacket tomorrow.', '少玩点手机，眼睛要坏了。|Less screen time, you\'ll ruin your eyes.', '周末带你去公园玩。|We\'ll take you to the park this weekend.'],
    parTeen: ['别早恋啊，以学习为重。|No dating yet — focus on school.', '学习累不累？妈给你炖了汤。|Tired from studying? I made you soup.', '想考哪所大学，跟我们说说。|Which university are you aiming for? Tell us.', '零花钱够不够用？|Is your allowance enough?', '晚上别熬夜。|Don\'t stay up too late.'],
    parAdult: ['最近怎么样？有空回家吃饭。|How are you? Come home for dinner sometime.', '天冷了，多穿点衣服。|It\'s getting cold — dress warmly.', '家里一切都好，别挂念。|All is well at home, don\'t worry about us.', '你上次说的事办得怎么样了？|How did that thing you mentioned go?', '工作别太拼，身体要紧。|Don\'t overwork yourself — health comes first.', '钱够不够花？不够跟家里说。|Do you have enough money? Let us know if not.', '你小时候的照片翻出来了，真可爱。|Found your childhood photos. So cute.', '楼下王阿姨的孩子都升职了……|The neighbor\'s kid just got promoted...'],
    parSingle: ['你什么时候带个对象回来看看？|When are you going to bring someone home for us to meet?', '我同事有个孩子条件不错，要不要见见？|My coworker\'s kid is a great catch — want to meet?', '你年纪不小了，该考虑终身大事了。|You\'re not getting younger — time to think about settling down.'],
    parMarried: ['什么时候要孩子啊？|When are you two having kids?', '让你家那位周末一起回来吃饭。|Bring your spouse for dinner this weekend.'],
    parGrandkids: ['孙子孙女最近乖不乖？|How are the grandkids?', '过年把孩子们都带回来啊。|Bring the kids home for the holidays.'],
    parOld: ['我这身子骨大不如前了。|My body isn\'t what it used to be.', '最近老是想起你小时候。|I keep thinking about when you were little.', '有空多回来看看，我们老了。|Visit more often — we\'re getting old.'],
    rom: ['今晚想吃什么？|What do you want for dinner tonight?', '想你了。|Missing you.', '周末我们去哪儿玩？|Where should we go this weekend?', '今天好累，想抱抱。|Rough day. I need a hug.', '刚看到一家很好看的店，下次一起去～|Just saw a cute café — let\'s go together next time~', '今天路过我们第一次约会的地方了。|Passed the place of our first date today.', '下班来接我好不好？|Pick me up after work?', '我做了个梦，梦里都是你。|I had a dream and you were in all of it.'],
    spouse: ['今晚想吃什么？|What do you want for dinner tonight?', '家里的水电费交了吗？|Did you pay the utility bills?', '记得买点菜回来。|Remember to pick up groceries.', '今天辛苦了，早点休息。|Long day — get some rest.', '下个月我们出去旅游吧？|Shall we take a trip next month?', '爸妈那边周末要不要去一趟？|Should we visit the parents this weekend?'],
    cold: ['今晚不回来吃了。|Won\'t be home for dinner.', '你到底什么时候回来？|When exactly are you coming home?', '我们需要谈谈。|We need to talk.'],
    friend: ['出来喝一杯？|Want to grab a drink?', '我最近遇到件烦心事……|Something\'s been bothering me lately...', '看到这个想起你了哈哈|Saw this and thought of you haha', '好久不见！最近忙啥呢？|Long time no see! What have you been up to?', '周末出来玩吗？|Up for something this weekend?', '我换工作了！请你吃饭。|I switched jobs! Dinner\'s on me.', '你看新闻了吗？太离谱了。|Did you see the news? Unbelievable.', '同学聚会你来不来？|Coming to the reunion?'],
    kidFriend: ['明天一起玩吗？|Want to play tomorrow?', '我新买了游戏机！来我家玩！|I got a new game console! Come over!', '老师布置的作业你写完了吗？借我看看。|Finished the homework? Let me see yours.'],
    admirer: ['早安～今天也要开心哦。|Good morning~ Have a great day.', '今天有空吗？|Are you free today?', '我路过你家楼下，给你带了早餐。|I passed by your place and brought you breakfast.', '晚安，做个好梦。|Good night, sweet dreams.', '周末有个展览，一起去看吗？|There\'s an exhibition this weekend — want to go?', '你今天穿的那件衣服真好看。|That outfit looked great on you today.'],
    richAdmirer: ['我订了米其林，今晚七点来接你？|I booked a Michelin place — pick you up at seven?', '下周去马尔代夫，机票我已经买好了，一起吗？|Maldives next week? I already bought the tickets.', '看到一个包很适合你，已经让人送过去了。|Saw a bag that suits you — already had it sent over.'],
    kid: ['我想要新玩具！|I want a new toy!', '今天考试考了100分！|I got 100 on my test today!', '什么时候带我去游乐园？|When are you taking me to the amusement park?', '今天在学校交到新朋友了！|I made a new friend at school today!', '能不能养只小狗？|Can we get a puppy?'],
    teenKid: ['零花钱能不能多给点……|Could I get a bit more allowance...', '我不想上补习班了。|I don\'t want to go to cram school anymore.', '今晚去同学家，晚点回。|Going to a friend\'s tonight, back late.', '你能别管我了吗？|Can you stop micromanaging me?'],
    adultkid: ['周末带孩子回来看你。|We\'ll bring the kids over this weekend.', '最近身体还好吗？记得按时吃药。|How\'s your health? Remember your medicine.', '工作有点累，不过一切都好。|Work\'s tiring, but all is well.', '给你买了个按摩椅，快递明天到。|Got you a massage chair — arrives tomorrow.', '我升职了，下次请你吃饭。|I got promoted — dinner\'s on me next time.'],
    sibling: ['爸妈最近身体不太好，你多打打电话。|Mom and Dad haven\'t been well — call them more.', '过年回来吗？|Coming home for the holidays?', '你还记得小时候我们偷吃糖的事吗？哈哈|Remember when we stole candy as kids? Haha', '帮我个忙呗……|Can you do me a favor...', '我家孩子说想你了。|My kid says they miss you.'],
    kidSib: ['你又偷吃我的零食！|You ate my snacks again!', '我告诉妈妈去！|I\'m telling Mom!', '陪我玩一会儿嘛。|Play with me for a bit.'],
    boss: ['明天早上来我办公室一趟。|Come to my office tomorrow morning.', '这个项目做得不错。|Nice work on that project.', '周末加个班，辛苦了。|Need you in this weekend, thanks.', '下个月的报告抓紧。|Get on that report for next month.'],
    inlaw: ['周末来家里吃饭吧，给你做了拿手菜。|Come over for dinner this weekend — I\'m making my specialty.', '你们俩最近还好吧？别吵架。|Are you two doing okay? Don\'t fight.', '天冷了，让{p}多穿点。|It\'s cold — make sure {p} dresses warmly.', '什么时候把事情定下来？|When are you two going to make it official?', '家里的电脑坏了，你有空来看看吗？|The computer at home broke — could you take a look sometime?'],
    inlawCold: ['听说你换工作了？工资多少？|Heard you changed jobs? What\'s the pay?', '我们家{p}从小没吃过苦。|Our {p} never had to struggle growing up.'],
    teacher: ['最近作业完成得不错，继续保持。|Your homework has been good lately — keep it up.', '下周家长会，记得通知家长。|Parent-teacher meeting next week — remind your parents.', '期中考试的错题要好好订正。|Go over your midterm mistakes carefully.', '你最近上课有点走神，有什么心事吗？|You\'ve seemed distracted in class. Is something on your mind?'],
    tutor: ['这周的练习题做完了吗？|Finished this week\'s practice set?', '下次课我们讲函数，提前预习一下。|Next session we\'ll cover functions — read ahead.', '你进步很快，继续加油！|You\'re improving fast — keep going!'],
    kidteacher: ['{k}最近表现不错，作业很认真。|{k} has been doing well and working hard on homework.', '{k}上课有点爱说话，家长多提醒一下。|{k} talks a lot in class — please remind them at home.', '下周家长会，请准时参加。|Parent-teacher meeting next week — please be on time.'],
    kidtutor: ['{k}这周的练习完成得很好。|{k} did great on this week\'s practice.', '{k}数学有点薄弱，我会重点讲。|{k} is weak in math — I\'ll focus on that.'],
    ex: ['你最近过得好吗？|How have you been?', '那家我们常去的店关门了。|That place we used to go to closed down.', '听说你过得不错，挺好的。|Heard you\'re doing well. Good for you.']
  };
  function poolFor(n, p) {
    var a = N.age(n), pt = N.partner();
    switch (n.rel) {
      case 'father': case 'mother': case 'stepparent':
        if (p.age < 12) return MSG.parKid;
        if (p.age < 18) return G.ch(.6) ? MSG.parTeen : MSG.parKid;
        if (a >= 72 && G.ch(.4)) return MSG.parOld;
        if (N.rel('child').length && G.ch(.5)) return MSG.parGrandkids;
        if (N.spouse() && !N.rel('child').length && p.age < 40 && G.ch(.5)) return MSG.parMarried;
        if (p.age >= 25 && !pt && G.ch(.45)) return MSG.parSingle;
        return MSG.parAdult;
      case 'grand': return p.age < 18 ? MSG.parKid : (G.ch(.5) ? MSG.parOld : MSG.parAdult);
      case 'spouse': return n.love < 30 ? MSG.cold : (G.ch(.5) ? MSG.spouse : MSG.rom);
      case 'lover': case 'affair': return n.love < 30 ? MSG.cold : MSG.rom;
      case 'admirer': return n.tags.length && p.age >= 18 && G.ch(.5) ? MSG.richAdmirer : MSG.admirer;
      case 'crush': return n.love > 55 ? MSG.admirer : null;
      case 'child': return a < 12 ? MSG.kid : a < 18 ? MSG.teenKid : MSG.adultkid;
      case 'sibling': return p.age < 16 || a < 16 ? MSG.kidSib : MSG.sibling;
      case 'boss': return MSG.boss;
      case 'ex': return n.aff > 10 && G.ch(.5) ? MSG.ex : null;
      case 'friend': case 'mentor': return p.age < 15 ? MSG.kidFriend : MSG.friend;
      case 'inlaw': return n.aff < 0 ? MSG.inlawCold : MSG.inlaw;
      case 'teacher': return MSG.teacher;
      case 'tutor': return MSG.tutor;
      case 'kidteacher': return MSG.kidteacher;
      case 'kidtutor': return MSG.kidtutor;
      default: return null;
    }
  }
  G.love.proactive = function () {
    var S = G.S, p = S.p; if (p.age < 7 || p.jail) return;
    var cand = N.all(function (n) { return n.alive && N.age(n) >= 6 && (n.unread || 0) < 2 && n.aff > -30 && n.rel !== 'enemy' && n.rel !== 'rival'; });
    var budget = G.ch(.55) ? 1 : 0; // a message now and then, not an inbox that never empties
    G.shuffle(cand).forEach(function (n) {
      if (budget <= 0) return;
      var close = N.isFamily(n) || n.rel === 'spouse' || n.rel === 'lover' || n.rel === 'admirer' || n.rel === 'inlaw' || n.rel === 'teacher';
      if (!G.ch((close ? .3 : .15) * (n.rel === 'child' || n.rel === 'grandchild' ? .5 : 1))) return;
      var b = poolFor(n, p); if (!b) return;
      var prm = {}, of = n.of && S.npcs[n.of], kid = n.kid && S.npcs[n.kid];
      if (of) prm.p = of.giv || of.name; if (kid) prm.k = kid.giv || kid.name;
      var recent = (n.chat || []).slice(-8).map(function (m) { return m.t; });
      var fresh = b.filter(function (t) { return recent.indexOf(G.L(t, prm)) < 0; });
      if (!fresh.length) return;
      N.pushChat(n, G.pick(fresh), prm); budget--;
    });
  };
})();
