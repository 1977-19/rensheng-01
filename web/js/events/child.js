/* Event helpers + childhood events (0-12) */
(function () {
  'use strict';
  var N = G.N;
  /* ---------- helpers shared by all event files ---------- */
  var H = G.EH = {};
  H.par = function () { return N.rel('father', 'mother').filter(function (n) { return n.alive; }); };
  H.fx = function (c, eff) {
    if (!eff) return;
    for (var k in eff) {
      var v = typeof eff[k] === 'function' ? eff[k](c) : eff[k];
      if (k === 'money') c.money(c.$(v));
      else if (k === 'par') H.par().forEach(function (n) { G.dPush('aff', N.addAff(n, v)); N.touch(n); });
      else if (k === 'part') { var pt = N.partner(); if (pt) { G.dPush('love', N.addLove(pt, v)); N.touch(pt); } }
      else if (k === 'npc') { if (c.npc) G.dPush('aff', N.addAff(c.npc, v)); }
      else if (k === 'love') { if (c.npc) G.dPush('love', N.addLove(c.npc, v)); }
      else if (k === 'kids') N.rel('child').forEach(function (n) { N.addAff(n, v); });
      else if (k === 'perf') { if (c.p.job) c.p.job.perf += v; else c.p.edu.perf = G.clamp(c.p.edu.perf + v, 0, 100); }
      else if (k === 'flag') c.p.flags[v] = 1;
      else if (k === 'sk') { c.p.sk = c.p.sk || {}; for (var s in v) c.p.sk[s] = G.clamp((c.p.sk[s] || 0) + v[s], 0, 100); }
      else if (k === 'smoke' || k === 'drink' || k === 'gamble' || k === 'night') c.p.hab[k] = G.clamp(c.p.hab[k] + v, 0, 100);
      else c.add(k, v);
    }
  };
  /* simple result */
  H.R = function (text, eff) { return function (c) { H.fx(c, eff); return text; }; };
  /* chance result: p may be number or fn(c) */
  H.RC = function (p, okT, okE, noT, noE) {
    return function (c) { var pr = typeof p === 'function' ? p(c) : p; if (G.ch(pr)) { H.fx(c, okE); return okT; } H.fx(c, noE); return noT; };
  };
  H.O = function (t, run, x) { var o = { t: t, run: run }; if (x) for (var k in x) o[k] = x[k]; return o; };
  H.E = function (id, a, title, icon, t, o, x) { var d = { id: id, a: a, title: title, icon: icon, t: t }; if (Array.isArray(o)) d.o = o; else if (typeof o === 'function') d.run = o; if (x) for (var k in x) d[k] = x[k]; return d; };
  H.hasPar = function () { return H.par().length > 0; };
  H.rich = function (S, p) { return p.flags.rich || G.famWealth() + p.money > G.$(1e6); };
  H.poor = function (S, p) { return !p.flags.rich && G.famWealth() + p.money < G.$(30000); };
  H.cn = function (S, p) { return p.country === 'cn'; };
  H.east = function (S, p) { return ['cn', 'jp', 'kr', 'sg'].indexOf(p.country) >= 0; };
  H.west = function (S, p) { return ['us', 'gb', 'fr', 'de', 'au', 'ca', 'it', 'es'].indexOf(p.country) >= 0; };
  H.student = function () { return G.school.isStudent(); };
  H.employed = function (S, p) { return p.job && !G.JOB[p.job.id].pt; };
  H.single = function (S, p) { return !N.partner(); };
  H.married = function () { return !!N.spouse(); };
  H.kidsN = function () { return N.rel('child').length; };
  var E = H.E, O = H.O, R = H.R, RC = H.RC;

  G.evs([
    // ---------------- 0-2 ----------------
    E('c_zhuazhou', [1, 1], '抓周|First-Birthday Grab', '🎂', '一周岁生日，家人在你面前摆满了东西，看你会抓什么。|On your first birthday, the family lays out objects to see what you\'ll grab.', [
      O('📚 书本|📚 A book', R('你一把抓起了书，全家都说你以后是读书的料。|You grabbed the book. Everyone says you\'ll be a scholar.', { smarts: 3, par: 4 })),
      O('💰 算盘/钱币|💰 Coins', R('你死死攥着钱不放，大家笑着说你将来会发财。|You clutched the coins tight. Everyone laughs that you\'ll be rich.', { eq: 2, luck: 3, par: 4 })),
      O('🎤 麦克风|🎤 A microphone', R('你抓起麦克风咿咿呀呀，看来是个小明星。|You grabbed the mic and babbled — a little star in the making.', { fame: 1, sk: { music: 5 }, par: 4 })),
      O('🩺 听诊器|🩺 A stethoscope', R('你抓住了听诊器，奶奶说你以后当医生。|You grabbed the stethoscope; Grandma says you\'ll be a doctor.', { smarts: 2, par: 4 })),
      O('🍗 鸡腿|🍗 A drumstick', R('你抓起鸡腿就啃，全家哭笑不得。|You grabbed a drumstick and started gnawing. Everyone laughs.', { happy: 5, health: 2 }))
    ], { if: H.hasPar }),
    E('c_fever', [0, 3], '高烧|High Fever', '🌡️', '你半夜发起了高烧，烧到了40度。|You spiked a 40°C fever in the middle of the night.', [
      O('连夜去医院|Rush to the hospital', R('父母抱着你在急诊室守了一夜，烧终于退了。|Your parents held you all night in the ER until the fever broke.', { health: 2, par: 3 })),
      O('用土方子物理降温|Try home remedies', RC(.65, '物理降温起了作用，你退烧了。|The home remedies worked and the fever broke.', { health: -2 }, '拖得太久，烧成了肺炎。|Waiting too long turned it into pneumonia.', { health: -12 }))
    ], { bad: 1, if: H.hasPar }),
    E('c_firstword', [1, 2], '第一句话|First Words', '🗣️', '你说出了人生第一句话。|You said your very first word.', [
      O('“爸爸！”|"Dada!"', R('爸爸激动得给所有亲戚打了电话。|Dad was so thrilled he called every relative.', { par: 3 })),
      O('“妈妈！”|"Mama!"', R('妈妈感动得眼眶都红了。|Mom\'s eyes welled up with tears.', { par: 3 })),
      O('“不要！”|"No!"', R('看来是个有主见的孩子。|Clearly a child with opinions.', { eq: 1, happy: 2 }))
    ], { if: H.hasPar }),
    E('c_vaccine', [0, 2], '打疫苗|Vaccination Day', '💉', '今天要去打疫苗。|Today is vaccination day.', [
      O('哭得撕心裂肺|Scream your lungs out', R('你的哭声响彻整个医院。|Your wails echoed through the whole hospital.', { health: 3 })),
      O('一声不吭|Take it like a champ', R('护士都夸你勇敢。|The nurse praised how brave you were.', { health: 3, eq: 1 }))
    ]),
    E('c_dog', [2, 5], '大狗|The Big Dog', '🐕', '一只大狗突然朝你冲了过来。|A big dog suddenly charges at you.', [
      O('吓得大哭|Burst into tears', R('狗主人赶紧拉住了狗，你吓得好几天不敢出门。|The owner grabbed the dog, but you were scared to go out for days.', { happy: -4 })),
      O('伸手摸它|Reach out and pet it', RC(.75, '大狗舔了舔你的手，你们成了朋友。|The dog licked your hand. Friends!', { happy: 5 }, '狗咬了你一口，你去打了狂犬疫苗。|The dog bit you; you needed rabies shots.', { health: -6, happy: -6 }))
    ]),
    // ---------------- 3-5 ----------------
    E('c_kinder1', [3, 4], '幼儿园第一天|First Day of Kindergarten', '🎒', '今天是你上幼儿园的第一天。|It\'s your first day of kindergarten.', [
      O('抱着妈妈的腿大哭|Cling to Mom and cry', R('你哭了一整天，嗓子都哑了。|You cried all day until your voice gave out.', { happy: -3 })),
      O('主动和小朋友玩|Make friends right away', function (c) { var f = N.make({ rel: 'friend', age: c.p.age, aff: 30 }); c.prm.f = f.name; H.fx(c, { eq: 2, happy: 4 }); return '你和{f}成了好朋友。|You became best friends with {f}.'; }),
      O('一个人安静地玩积木|Play quietly with blocks', R('你搭了一座很高的塔，老师夸你专注。|You built a tall tower; the teacher praised your focus.', { smarts: 2 }))
    ], { if: function (S, p) { return p.edu.stage === 'kinder'; } }),
    E('c_toy', [3, 7], '抢玩具|Toy Tussle', '🧸', '另一个小朋友抢走了你最爱的玩具。|Another kid snatches your favorite toy.', [
      O('抢回来|Grab it back', RC(.6, '你抢回了玩具。|You got it back.', { happy: 3, rep: 2 }, '你们扭打成一团，都被老师批评了。|You tussled and both got scolded.', { happy: -3 })),
      O('告诉老师|Tell the teacher', R('老师主持了公道。|The teacher sorted it out fairly.', { eq: 1 })),
      O('让给他|Let them have it', R('你很大方，老师给了你一朵小红花。|You were generous, and the teacher gave you a gold star.', { karma: 3, eq: 2, happy: -1 }))
    ]),
    E('c_lost', [3, 8], '走丢了|Lost', '😰', '你在商场里和家人走散了。|You get separated from your family at the mall.', [
      O('站在原地等|Stay put and wait', R('爸妈很快就找到了你。|Your parents found you quickly.', { par: 2 })),
      O('找保安叔叔|Find a security guard', R('保安用广播帮你找到了家人。|The guard paged your family over the loudspeaker.', { eq: 2, smarts: 1 })),
      O('跟着一个说认识你爸妈的陌生人走|Follow a stranger who says he knows your parents', RC(.5, '幸好被路人发现不对劲，把你拦了下来。|Luckily a passerby sensed something wrong and stopped you.', { happy: -8 }, '那人带你走了很远……最后警察找到了你，全家都吓坏了。|He led you far away... the police eventually found you. Your family was terrified.', { happy: -15, health: -4 }))
    ], { bad: 1 }),
    E('c_candy', [3, 9], '偷吃糖果|Candy Thief', '🍬', '你发现了妈妈藏起来的一罐糖果。|You discover the candy jar Mom hid.', [
      O('全部吃光|Eat it all', R('你吃了个精光，结果长了好几颗蛀牙。|You ate every piece and got several cavities.', { happy: 5, health: -3, looks: -1 })),
      O('只吃一颗|Just one piece', R('你只偷吃了一颗，没被发现。|You sneaked just one; nobody noticed.', { happy: 2 })),
      O('告诉妈妈|Tell Mom', R('妈妈夸你诚实，奖励了你两颗。|Mom praised your honesty and gave you two.', { karma: 2, par: 3 }))
    ]),
    E('c_bike', [4, 9], '学骑自行车|Learning to Ride a Bike', '🚲', '爸爸扶着后座教你骑自行车。|Dad holds the back seat while teaching you to ride.', [
      O('勇敢地往前骑|Pedal bravely', RC(.65, '你骑出去老远才发现爸爸早就松手了！|You rode far before realizing Dad had let go long ago!', { happy: 6, fit: 3 }, '你摔了个狗啃泥，膝盖破了。|You crashed face-first and skinned your knees.', { health: -3, happy: -2 })),
      O('不敢骑|Too scared', R('你说什么也不肯骑。|You refused to ride no matter what.', { happy: -1 }))
    ], { if: H.hasPar }),
    E('c_sibling', [2, 9], '要有弟弟妹妹了|A New Sibling', '👶', '妈妈的肚子越来越大，你要当哥哥/姐姐了。|Mom\'s belly keeps growing — you\'re going to be a big sibling.', [
      O('太好了！|Yay!', function (c) { var f = N.rel('father')[0], m = N.rel('mother')[0], g = G.ch(.5) ? 'm' : 'f'; var s = N.make({ rel: 'sibling', g: g, age: 0, sur: c.p.sur, aff: 50, c: c.p.country, cul: c.p.cul }); s.pin = 1; c.prm.s = s.name; H.fx(c, { happy: 5 }); return '{s}出生了，你有了一个小跟屁虫。|{s} was born, and now you have a little shadow.'; }),
      O('我不要！|I don\'t want one!', function (c) { var g = G.ch(.5) ? 'm' : 'f'; var s = N.make({ rel: 'sibling', g: g, age: 0, sur: c.p.sur, aff: 20, c: c.p.country, cul: c.p.cul }); s.pin = 1; c.prm.s = s.name; H.fx(c, { happy: -5, par: -2 }); return '{s}还是出生了，你觉得爸妈的爱被抢走了。|{s} was born anyway, and you feel your parents\' love was stolen.'; })
    ], { if: function (S, p) { var m = N.rel('mother')[0], f = N.rel('father')[0]; return m && f && N.age(m) < 40 && !(p.country === 'cn' && S.year >= 1980 && S.year < 2016 && p.tier < 4); }, w: .7 }),
    E('c_fight_par', [4, 15], '父母吵架|Parents Fighting', '😢', '半夜，你听到爸妈在客厅里大吵。|In the middle of the night, you hear your parents yelling in the living room.', [
      O('冲出去劝架|Run out and try to stop them', R('看到你哭着跑出来，他们停了下来。|Seeing you run out in tears, they stopped.', { eq: 2, happy: -4 })),
      O('蒙在被子里|Hide under the covers', R('你一夜没睡好。|You barely slept that night.', { happy: -6 })),
      O('偷偷录下来|Secretly record it', R('你不知道该拿这段录音怎么办。|You don\'t know what to do with the recording.', { smarts: 1, happy: -4 }))
    ], { bad: 1, if: function () { return N.rel('father').length && N.rel('mother').length; } }),
    E('c_divorce', [5, 17], '父母离婚|Parents Divorce', '💔', '爸妈坐下来告诉你，他们要离婚了。你想跟谁？|Your parents sit you down: they\'re getting divorced. Who do you want to live with?', [
      O('跟爸爸|Live with Dad', function (c) { var m = N.rel('mother')[0]; if (m) { m.sep = 1; N.addAff(m, -10); } H.fx(c, { happy: -12 }); return '你跟着爸爸生活，妈妈搬走了。|You live with Dad; Mom moved out.'; }),
      O('跟妈妈|Live with Mom', function (c) { var f = N.rel('father')[0]; if (f) { f.sep = 1; N.addAff(f, -10); } H.fx(c, { happy: -12 }); return '你跟着妈妈生活，爸爸搬走了。|You live with Mom; Dad moved out.'; })
    ], { bad: 1, w: .35, if: function () { var f = N.rel('father')[0], m = N.rel('mother')[0]; return f && m && !f.sep && !m.sep && f.aff + m.aff < 140; } }),
    E('c_vase', [4, 10], '打碎花瓶|The Broken Vase', '🏺', '你在家里玩球，打碎了妈妈最爱的花瓶。|Playing ball indoors, you smash Mom\'s favorite vase.', [
      O('主动承认|Own up to it', R('妈妈虽然心疼，但夸你诚实。|Mom was upset but praised your honesty.', { karma: 4, par: 2 })),
      O('说是猫打碎的|Blame the cat', RC(.5, '妈妈信了，可怜的猫被关了一天。|Mom believed you; the poor cat was locked up all day.', { karma: -3 }, '谎言被拆穿，你被罚站了一晚上。|Your lie was exposed; you stood in the corner all night.', { karma: -3, par: -5, happy: -5 })),
      O('偷偷用胶水粘好|Secretly glue it back', RC(.3, '居然粘得天衣无缝！|It looks good as new!', { smarts: 1 }, '粘得歪歪扭扭，一眼就被看穿了。|It\'s crooked; Mom saw through it instantly.', { par: -3 }))
    ]),
    E('c_wallet', [6, 14], '捡到钱包|Found Wallet', '👛', '放学路上，你捡到一个鼓鼓的钱包。|On the way home from school, you find a fat wallet.', [
      O('交给警察|Turn it in to the police', R('失主找到你，送了你一面锦旗和一些零花钱。|The owner tracked you down and rewarded you with a thank-you banner and pocket money.', { karma: 8, money: 30, fame: 1 })),
      O('自己留着|Keep it', R('你偷偷花掉了里面的钱，心里有点不安。|You quietly spent the cash, feeling uneasy.', { karma: -8, money: 80, happy: 3 })),
      O('按照证件找到失主|Find the owner from the ID', R('失主是一位老爷爷，他感动地请你吃了顿饭。|It belonged to an old man who treated you to a meal in gratitude.', { karma: 6, eq: 2, happy: 4 }))
    ]),
    E('c_bully', [6, 13], '被欺负|Bullied', '😣', '班上几个大孩子总是抢你的东西，还嘲笑你。|Some bigger kids keep taking your stuff and mocking you.', [
      O('告诉老师和家长|Tell teachers and parents', R('大人们出面，他们收敛了。|The adults stepped in, and they backed off.', { eq: 1, happy: -2 })),
      O('打回去|Fight back', async function (c) { var r = await c.game('fight', { name: '反击|Fight Back' }); if (r.win) { H.fx(c, { rep: 8, happy: 6 }); return '你把带头的揍了一顿，从此没人敢欺负你。|You beat up the ringleader; nobody bullies you anymore.'; } H.fx(c, { health: -5, happy: -8 }); return '你被打得更惨了。|You got beaten worse.'; }),
      O('默默忍受|Endure it silently', R('你越来越不想去上学。|You dread going to school more and more.', { happy: -10, stress: 10 }))
    ], { bad: 1, w: function (S, p) { return p.st.looks < 40 || p.origin === 'immigrant' || p.origin === 'orphan' ? 2 : .8; }, if: H.student }),
    E('c_badgrade', [7, 15], '不及格|Failing Grade', '📉', '你的数学考了个不及格，试卷要家长签字。|You failed your math test, and it needs a parent\'s signature.', [
      O('老老实实给家长看|Show your parents honestly', RC(.5, '爸妈没骂你，还帮你分析错题。|Your parents didn\'t yell; they helped you review mistakes.', { par: 2, perf: 3 }, '你被狠狠骂了一顿，还没收了零花钱。|You got a harsh scolding and lost your allowance.', { happy: -6 })),
      O('模仿家长签名|Forge the signature', RC(.55, '老师没发现。|The teacher didn\'t notice.', { karma: -2 }, '老师打电话到家里，你被罚得很惨。|The teacher called home. Big trouble.', { par: -8, happy: -8, karma: -2 })),
      O('藏起来|Hide the test', R('你把试卷藏在床底下，提心吊胆了好几天。|You stuffed it under your bed and worried for days.', { stress: 8 }))
    ], { if: function (S, p) { return H.student() && p.edu.perf < 55 && H.hasPar(); } }),
    E('c_pocket', [6, 12], '零花钱|Allowance', '🪙', '爸妈第一次给了你零花钱。|Your parents give you an allowance for the first time.', [
      O('存进小猪存钱罐|Save it in a piggy bank', R('你的存钱罐越来越沉了。|Your piggy bank grows heavier.', { money: 20, smarts: 1 })),
      O('全买零食|Spend it all on snacks', R('你一口气吃了个痛快。|You stuffed yourself happily.', { happy: 5 })),
      O('买漫画书|Buy comic books', R('你沉迷在漫画的世界里。|You lose yourself in comics.', { happy: 4, smarts: 1 }))
    ], { if: H.hasPar }),
    E('c_steal_home', [7, 14], '偷拿家里的钱|Taking Money from Home', '💴', '你看中了一个玩具，但钱不够。爸妈的钱包就在桌上。|You want a toy but don\'t have enough money. Your parent\'s wallet is right there on the table.', [
      O('偷偷拿一张|Sneak a bill', RC(.55, '你买到了心心念念的玩具。|You got the toy you wanted so badly.', { happy: 5, karma: -4, money: 15 }, '被发现了，你挨了一顿打。|You got caught and spanked.', { happy: -8, par: -6, karma: -4 })),
      O('忍住，攒钱买|Resist and save up', R('你攒了两个月才买到，格外珍惜。|It took two months of saving, and you treasured it.', { karma: 2, eq: 1 }))
    ], { if: H.hasPar }),
    E('c_summer', [6, 12], '暑假|Summer Vacation', '☀️', '暑假到了，你想怎么过？|Summer break is here. How will you spend it?', [
      O('去乡下爷爷奶奶家|Visit grandparents in the countryside', R('你在田野里抓蜻蜓、下河摸鱼，晒成了小黑炭。|You caught dragonflies and fished in the river, tanned dark as charcoal.', { happy: 8, health: 3 })),
      O('上补习班|Summer classes', R('一个暑假都在补习，成绩进步了。|You spent the summer in classes, and your grades improved.', { smarts: 3, perf: 5, happy: -4 })),
      O('参加夏令营|Summer camp', R('你在夏令营交了好几个新朋友。|You made several new friends at camp.', { eq: 3, happy: 6, money: -60 })),
      O('在家打游戏看电视|Stay home with TV and games', R('你过了一个“葛优躺”的暑假。|A lazy couch-potato summer.', { happy: 6, health: -1 }))
    ], { rep: 1, cd: 3 }),
    E('c_pet_die', [5, 12], '小金鱼死了|The Goldfish Died', '🐠', '你养的小金鱼翻了肚皮。|Your pet goldfish is floating belly-up.', [
      O('给它办个葬礼|Hold a little funeral', R('你在花园里给它立了一块小墓碑。|You made it a tiny headstone in the garden.', { eq: 2, happy: -3 })),
      O('冲进马桶|Flush it', R('你冲了马桶，心里空落落的。|You flushed it and felt empty inside.', { happy: -2 }))
    ]),
    E('c_stranger', [5, 11], '陌生人的糖|A Stranger\'s Candy', '🍭', '一个陌生叔叔说要带你去买糖。|A strange man offers to take you to buy candy.', [
      O('拒绝并跑开|Refuse and run', R('你记得爸妈的话，转身就跑。|You remembered your parents\' warning and ran.', { smarts: 2 })),
      O('大声喊人|Shout for help', R('路人围了过来，那人灰溜溜地跑了。|Passersby came over and the man slunk away.', { eq: 2, karma: 2 })),
      O('跟他走|Go with him', R('幸好一位警察叔叔认出了你，把你送回了家。|Luckily a police officer recognized you and brought you home.', { happy: -10, par: -2 }))
    ], { bad: 1 }),
    E('c_newyear', [3, 15], function (c) { return c.p.country === 'jp' ? '新年压岁钱|New Year Otoshidama' : c.p.country === 'kr' ? '春节压岁钱|Seollal New Year Money' : '春节红包|Lunar New Year Red Envelopes'; }, '🧧', function (c) { return c.p.country === 'jp' ? '新年到了，亲戚们给了你好几个装着“御年玉”的小信封。|It\'s New Year, and relatives hand you little envelopes of otoshidama.' : c.p.country === 'kr' ? '春节给长辈磕头拜年，你收到了不少压岁钱。|You bow to your elders for Seollal and collect a pile of New Year money.' : '过年了，亲戚们给了你不少压岁钱。|It\'s Lunar New Year, and relatives give you lots of red envelopes.'; }, [
      O('自己留着|Keep it all', R('你偷偷把红包藏了起来。|You hid the money away.', { money: 60, happy: 5 })),
      O('交给妈妈“保管”|Let Mom "keep it safe"', R('这笔钱从此再也没见过。|You never saw that money again.', { par: 3, happy: -2 }))
    ], { rep: 1, cd: 4, if: function (S, p) { return H.east(S, p) && H.hasPar(); } }),
    E('c_xmas', [3, 12], '圣诞礼物|Christmas Morning', '🎄', '圣诞节早上，圣诞树下堆满了礼物。|Christmas morning — presents piled under the tree.', [
      O('先拆最大的|Open the biggest one', R('是你梦寐以求的礼物！|It\'s exactly what you wanted!', { happy: 8 })),
      O('问圣诞老人是不是真的|Ask if Santa is real', R('爸妈支支吾吾，你好像明白了什么。|Your parents stammer, and you sort of figure it out.', { smarts: 2, happy: 2 }))
    ], { rep: 1, cd: 4, if: function (S, p) { return H.west(S, p) && H.hasPar(); } }),
    E('c_misjudged', [7, 14], '被冤枉|Wrongly Accused', '😤', '班上有人丢了钱，同学们都怀疑是你。|Money went missing in class, and everyone suspects you.', [
      O('据理力争|Stand your ground', RC(.6, '你找到了证据，真正的小偷被揪了出来。|You found evidence, and the real thief was caught.', { eq: 3, rep: 3 }, '没人相信你，你委屈得哭了。|No one believed you, and you cried in frustration.', { happy: -8 })),
      O('请家长来学校|Bring your parents in', R('爸妈坚定地站在你这边。|Your parents stood firmly by you.', { par: 4, happy: 2 }))
    ], { bad: 1, if: H.student }),
    E('c_oldlady', [6, 16], '过马路|Crossing the Street', '👵', '一位老奶奶拎着很重的菜，站在路口不敢过马路。|An old woman with heavy groceries hesitates at a busy crossing.', [
      O('扶她过马路|Help her across', R('老奶奶夸你是个好孩子。|She said you\'re a good kid.', { karma: 5, happy: 3 })),
      O('装作没看见|Pretend not to see', R('你快步走开了。|You hurried away.', { karma: -1 }))
    ]),
    E('c_loveletter', [10, 12], '小纸条|A Little Note', '💌', '你在课桌里发现一张纸条：“我们可以做好朋友吗？”|You find a note in your desk: "Can we be best friends?"', [
      O('回一张纸条|Write back', function (c) { var f = N.make({ rel: 'friend', age: c.p.age, aff: 45 }); c.prm.f = f.name; H.fx(c, { happy: 5 }); return '原来是{f}写的，你们成了形影不离的好朋友。|It was from {f}; you became inseparable.'; }),
      O('交给老师|Hand it to the teacher', R('全班都知道了，有人被你弄哭了。|The whole class found out, and someone cried.', { karma: -2, eq: -1 }))
    ]),
    E('c_talent', [5, 12], '才艺表演|Talent Show', '🎭', '学校要办才艺表演，你想表演什么？|The school is holding a talent show. What will you perform?', [
      O('唱歌|Sing', async function (c) { var r = await c.game('rhythm', { name: '才艺表演|Talent Show' }); H.fx(c, { sk: { music: 5 }, happy: r.score > .5 ? 6 : -2, fame: r.score > .7 ? 2 : 0 }); return r.score > .5 ? '台下掌声雷动！|Thunderous applause!' : '你唱破音了。|Your voice cracked.'; }),
      O('讲故事|Tell a story', R('你绘声绘色地讲了个故事，大家听得入了迷。|Your vivid storytelling held everyone spellbound.', { eq: 3, happy: 4 })),
      O('不参加|Sit it out', R('你坐在台下看别人表演。|You watched from the audience.', {}))
    ], { if: H.student }),
    E('c_game_addict', [8, 16], '迷上游戏|Gaming Obsession', '🎮', '你迷上了一款游戏，每天都想玩。|You\'re hooked on a game and want to play every day.', [
      O('偷偷熬夜玩|Sneak late-night sessions', R('你的黑眼圈越来越重，成绩也下滑了。|Your dark circles deepen and your grades slip.', { happy: 5, perf: -6, night: 15, sk: { game: 6 } })),
      O('和爸妈约定时间|Agree on limits with your parents', R('你学会了自律。|You learned self-discipline.', { eq: 2, par: 3, sk: { game: 3 } })),
      O('删掉游戏|Delete the game', R('你忍痛删掉了它。|You painfully deleted it.', { perf: 3, happy: -3 }))
    ], { if: function (S) { return S.year >= 1985; } }),
    E('c_stray', [5, 14], '流浪猫|Stray Kitten', '🐈', '你在雨里发现一只瑟瑟发抖的小猫。|You find a kitten shivering in the rain.', [
      O('抱回家养|Take it home', function (c) { G.S.assets.pets.push({ id: G.uid(), kind: 'cat', name: G.pick(G.PET_NAMES), by: G.S.year, aff: 70 }); H.fx(c, { happy: 8, karma: 4 }); return '爸妈拗不过你，小猫成了家里的一员。|Your parents gave in, and the kitten joined the family.'; }),
      O('给它点吃的就走|Feed it and leave', R('你把面包留给了它。|You left it your bread.', { karma: 2 }))
    ]),
    E('c_drown', [5, 13], '游泳|Swimming Scare', '🏊', '你在河边玩水，脚一滑掉进了深水区。|Playing by the river, you slip into deep water.', [
      O('拼命扑腾|Thrash and kick', RC(.6, '你扑腾着抓住了岸边的树枝。|You flailed and grabbed a branch on the bank.', { health: -3, happy: -5 }, '你呛了好几口水，被路人救了上来。|You swallowed lots of water before a passerby pulled you out.', { health: -10, happy: -8 })),
      O('保持冷静，仰面漂浮|Stay calm and float', R('你想起游泳课学的，冷静地漂到了岸边。|You remembered swim class and calmly floated to shore.', { smarts: 2, fit: 2 }))
    ], { bad: 1 }),
    E('c_move', [5, 15], '搬家转学|Moving Away', '📦', '爸爸调动工作，全家要搬到另一个城市。|Dad got transferred; the family is moving to another city.', [
      O('和老朋友告别|Say goodbye to old friends', function (c) { var t = G.ri(1, 3), city = G.pick(G.C[c.p.country].cities[t]); c.p.tier = t; c.p.city = city; c.prm.c = city; H.fx(c, { happy: -6, eq: 2 }); return '你哭着和朋友们告别，搬到了{c}。|You tearfully said goodbye and moved to {c}.'; }),
      O('期待新生活|Look forward to a new life', function (c) { var t = G.ri(1, 3), city = G.pick(G.C[c.p.country].cities[t]); c.p.tier = t; c.p.city = city; c.prm.c = city; H.fx(c, { happy: 3 }); return '你搬到了{c}，对一切都很好奇。|You moved to {c}, curious about everything.'; })
    ], { w: .5, if: function (S, p) { return N.rel('father').length && p.tier >= 3 && !p.flags.orphan; } }),
    E('c_hospital', [3, 12], '住院|In the Hospital', '🏥', '你得了急性阑尾炎，要做手术。|You have acute appendicitis and need surgery.', [
      O('勇敢面对|Face it bravely', R('手术很顺利，你成了病房里最勇敢的孩子。|The surgery went fine; you were the bravest kid on the ward.', { health: -5, eq: 2, par: 3, money: -100 }))
    ], { bad: 1 }),
    E('c_adopted', [1, 12], '新的家|A New Home', '🏡', '一对夫妇来到福利院，想领养一个孩子，他们看中了你。|A couple visits the orphanage to adopt, and they choose you.', [
      O('跟他们走|Go with them', function (c) {
        var w = G.$(G.rf(50000, 500000)), sur = G.genSur(G.C[c.p.country].names);
        var f = N.make({ rel: 'father', g: 'm', age: G.ri(30, 45), sur: sur, job: G.pick(G.NPC_JOBS.slice(0, 15)).n, inc: G.$w(G.ri(40000, 120000)), wealth: w / 2, aff: 60, orient: 'het' });
        var m = N.make({ rel: 'mother', g: 'f', age: G.ri(28, 43), job: G.pick(G.NPC_JOBS.slice(0, 15)).n, inc: G.$w(G.ri(30000, 90000)), wealth: w / 2, aff: 65, orient: 'het' });
        f.pin = m.pin = 1; c.p.flags.orphan = 0; c.p.flags.adopted = 1;
        c.p.sur = sur; c.p.name = G.mkName(c.p.cul, sur, c.p.giv, c.p.g);
        H.fx(c, { happy: 20 }); G.major('被领养|Adopted'); c.prm.nm = c.p.name;
        return '你有了一个家，新名字叫{nm}。|You finally have a family. Your new name is {nm}.';
      }),
      O('舍不得福利院的小伙伴|Stay with your orphanage friends', R('你拒绝了，院长阿姨摸了摸你的头。|You refused, and the director patted your head.', { eq: 2, happy: -3 }))
    ], { good: 1, w: 3, if: function (S, p) { return p.flags.orphan; } }),
    E('c_scary', [7, 14], '恐怖片|Horror Movie', '👻', '表哥带你偷偷看了一部恐怖片。|Your cousin sneaks you into watching a horror movie.', [
      O('捂着眼睛看完|Watch through your fingers', R('你吓得一个月不敢一个人上厕所。|You were too scared to use the bathroom alone for a month.', { happy: -3, night: 10 })),
      O('看得津津有味|Love every minute', R('你觉得一点都不吓人，还想再看一部。|Not scary at all — you want another.', { happy: 4 }))
    ]),
    E('c_teacher_pet', [6, 14], '老师的宠儿|Teacher\'s Favorite', '🍎', '班主任特别喜欢你，经常让你回答问题。|Your homeroom teacher loves you and calls on you constantly.', [
      O('好好表现|Shine', R('你越来越自信了。|Your confidence grows.', { smarts: 2, eq: 2, perf: 4 })),
      O('低调一点|Keep a low profile', R('你不想被同学说成马屁精。|You don\'t want to be called a teacher\'s pet.', { eq: 1 }))
    ], { good: 1, if: function (S, p) { return H.student() && p.edu.perf > 65; } }),
    E('c_myopia', [7, 15], '看不清黑板|Can\'t See the Board', '👓', '你发现坐在后排看不清黑板了。|You realize you can\'t see the board from the back row.', [
      O('配眼镜|Get glasses', function (c) { c.p.ill.push({ id: 'myopia', yrs: 0, known: 1 }); H.fx(c, { looks: -2, money: -40 }); return '你戴上了眼镜，世界变清晰了。|You got glasses, and the world snapped into focus.'; }),
      O('眯着眼凑合|Squint and manage', function (c) { c.p.ill.push({ id: 'myopia', yrs: 0, known: 1 }); H.fx(c, { perf: -3 }); return '你的近视越来越严重了。|Your eyesight got worse.'; })
    ], { w: function (S, p) { return S.year > 1990 ? 1.5 : .5; } }),
    E('c_fortune', [6, 13], '算命先生|The Fortune Teller', '🔮', '路边一个算命先生拉住你：“小朋友，我看你骨骼惊奇……”|A street fortune teller grabs you: "Child, you have extraordinary bones..."', [
      O('听他说完|Hear him out', RC(.5, '他说你将来大富大贵，你开心了好几天。|He predicted great wealth for you, and you were giddy for days.', { happy: 5, luck: 2 }, '他说你命中有一劫，你心里有点发毛。|He said disaster lies ahead, and it creeped you out.', { happy: -4 })),
      O('拉着妈妈赶紧走|Drag Mom away', R('妈妈说那都是骗人的。|Mom says it\'s all a scam.', { smarts: 1 }))
    ]),
    E('c_kidnap', [4, 14], '绑架|Kidnapped!', '🚐', '放学路上，你被几个蒙面人塞进了面包车——他们知道你家很有钱。|On the way home, masked men shove you into a van — they know your family is rich.', [
      O('冷静记下路线|Stay calm and memorize the route', function (c) { var ps = H.par(), ransom = c.$(G.ri(50000, 300000)); if (ps[0]) ps[0].wealth = Math.max(0, ps[0].wealth - ransom); H.fx(c, { happy: -15, smarts: 3, fame: 3 }); return '家里付了赎金，你记下的线索帮警察抓到了绑匪。|Your family paid the ransom, and your clues helped police catch the kidnappers.'; }),
      O('找机会逃跑|Look for a chance to escape', async function (c) { var r = await c.game('sprint', { name: '逃跑|Escape' }); if (r.score > .5) { H.fx(c, { happy: -8, fame: 4, rep: 5 }); return '你趁绑匪不注意，自己跑了出来！|You slipped away while the kidnappers weren\'t looking!'; } H.fx(c, { happy: -18, health: -8 }); return '逃跑失败，你被打了一顿，家里付了赎金才救回你。|The escape failed; you were beaten, and your family paid ransom to get you back.'; })
    ], { bad: 1, w: 1.2, if: function (S, p) { return H.rich(S, p); } }),
    E('c_poor_fee', [6, 17], '交不起学费|Can\'t Afford Fees', '🧾', '学校要交一笔费用，你知道家里拿不出来。|School needs a fee paid, and you know your family can\'t afford it.', [
      O('自己去捡废品卖|Collect scrap to sell', R('你攒够了钱，爸妈心疼得掉了眼泪。|You saved enough, and your parents cried with pride.', { eq: 3, karma: 3, happy: -2 })),
      O('跟老师说明情况|Explain to the teacher', R('老师帮你申请了助学金。|The teacher helped you get a grant.', { eq: 2 })),
      O('跟家里要|Ask your parents', R('爸妈借了钱给你交上了，却瘦了一圈。|Your parents borrowed to pay it and grew thinner from worry.', { par: 2, happy: -4 }))
    ], { bad: 1, if: function (S, p) { return H.student() && H.poor(S, p); } }),
    E('c_farmwork', [7, 16], '农忙|Harvest Season', '🌾', '到了农忙时节，家里需要人手。|It\'s harvest season, and the family needs every hand.', [
      O('下地帮忙|Help in the fields', R('你晒得黝黑，但身体更结实了。|You got sunburned but stronger.', { health: 3, fit: 4, par: 4, perf: -2 })),
      O('躲在家写作业|Stay in and do homework', R('你的成绩保住了，但爸妈有点失望。|Your grades held up, but your parents were a little disappointed.', { perf: 3, par: -2 }))
    ], { rep: 1, cd: 3, if: function (S, p) { return p.tier >= 5 && H.hasPar(); } }),
    E('c_debt_door', [4, 16], '讨债的来了|The Debt Collectors', '🚪', '一群凶神恶煞的人砸开了家门，要找你爸爸还钱。|Thugs bang down your door, demanding your dad pay up.', [
      O('躲进柜子|Hide in the closet', R('你在黑暗里瑟瑟发抖，直到他们离开。|You trembled in the dark until they left.', { happy: -12, stress: 15 })),
      O('挡在妈妈前面|Stand in front of Mom', R('一个小孩挡在门口，他们骂骂咧咧地走了。|Faced with a child blocking the door, they cursed and left.', { eq: 4, karma: 5, happy: -6 }))
    ], { bad: 1, if: function (S, p) { return p.flags.debtfam && H.hasPar(); } }),
    E('c_leftbehind', [5, 14], '过年回家|Home for the Holidays', '🚂', '一年没见的爸妈终于回家过年了。|Your parents, gone a whole year, finally come home for the holidays.', [
      O('扑进他们怀里|Run into their arms', R('你抱着他们哭了很久，舍不得他们走。|You cried in their arms for a long time, not wanting them to leave.', { happy: 10, par: 8 })),
      O('躲在奶奶身后|Hide behind Grandma', R('你和他们有点陌生了，爸妈很难过。|You feel like strangers now, and your parents are heartbroken.', { happy: -3, par: -2 }))
    ], { rep: 1, cd: 2, if: function (S, p) { return N.rel('father', 'mother').some(function (n) { return n.away; }); } }),
    E('c_stepparent', [3, 15], '新家人|A New Stepparent', '👪', '爸爸/妈妈带回来一个人，说要和TA结婚。|Your parent brings someone home and announces they\'re getting married.', [
      O('接受TA|Welcome them', function (c) { var p0 = H.par()[0], g = p0 && p0.g === 'm' ? 'f' : 'm'; var s = N.make({ rel: 'stepparent', g: g, age: p0 ? N.age(p0) + G.ri(-5, 5) : 35, aff: 35, wealth: c.$(G.ri(10000, 200000)), orient: 'het' }); s.pin = 1; H.fx(c, { happy: 3, eq: 2 }); c.prm.s = s.name; return '{s}对你很好，家里又完整了。|{s} treats you well, and the family feels whole again.'; }),
      O('坚决反对|Refuse to accept them', function (c) { var p0 = H.par()[0], g = p0 && p0.g === 'm' ? 'f' : 'm'; var s = N.make({ rel: 'stepparent', g: g, age: 38, aff: -20, orient: 'het' }); s.pin = 1; H.fx(c, { happy: -8, par: -6 }); return '他们还是结婚了，你和继父/继母关系很僵。|They married anyway, and things are frosty between you and your stepparent.'; })
    ], { if: function (S, p) { return p.origin === 'single' && !N.rel('stepparent').length; }, w: .6 })
  ]);
})();
