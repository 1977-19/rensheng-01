/* Activities tab: categories */
(function () {
  'use strict';
  var N = G.N, quick = function () { return G.quick.apply(null, arguments); };
  function adult() { return G.S.p.age >= 18; }
  function par() { return N.rel('father', 'mother', 'grand').filter(function (n) { return n.alive; }); }
  function sk(k, n) { var p = G.S.p; p.sk = p.sk || {}; p.sk[k] = G.clamp((p.sk[k] || 0) + n, 0, 100); return p.sk[k]; }
  async function pickPerson(title, text, list) {
    var items = list.map(function (n) {
      var tg = n.tags.length ? { rich: '💰富豪|💰Rich', celeb: '🌟明星|🌟Celebrity', red: '🏛️权贵|🏛️Political elite', royal: '👑王室|👑Royal' }[n.tags[0]] : '';
      return { t: n.name, sub: G.L('{a}岁 · {j} · {l}{t}|{a} · {j} · {l}{t}', { a: N.age(n), j: n.job, l: N.looksLabel(n.looks), t: tg ? ' · ' + G.T(tg) : '' }), npc: n };
    });
    var i = await G.UI.pick({ title: title, text: text, items: items });
    list.forEach(function (n, j) { if (j !== i && !n.pin && !(n.chat || []).length) delete G.S.npcs[n.id]; });
    if (i < 0) return null;
    var who = list[i]; N.touch(who);
    return who;
  }
  G.pickPerson = pickPerson;
  function cands(k, o) { var out = []; for (var i = 0; i < k; i++) out.push(N.mkRomantic(Object.assign({ rel: 'contact', love: G.ri(5, 30), aff: G.ri(0, 15) }, o || {}))); return out; }
  async function meet(a, list, intro) {
    var who = await pickPerson(G.L(a.n), G.L(intro || '你认识了这几个人，想进一步了解谁？|You met these people. Who do you want to know better?'), list);
    if (!who) return 'cancel';
    N.addAff(who, 8); N.addLove(who, Math.round(N.attract(who) * 15));
    G.UI.openAfter = who; // opened once this action has finished, so its buttons work
  }

  G.ACT_CATS = [
    { id: 'health', n: '医疗健康|Health & Body', i: '🏥', items: [
      { id: 'doctor', n: '去医院看病|See a Doctor', i: '🩺', e: 10, run: async function (a) {
        var p = G.S.p, known = p.ill.filter(function (x) { return x.known; });
        if (!known.length) { if (p.ill.length && G.ch(.5)) { p.ill.forEach(function (x) { x.known = 1; }); return G.result(a.n, '医生说你身体里有些小问题。|The doctor found a few issues.', null, [], a.i); } return G.result(a.n, '医生说你没什么大毛病。|The doctor says you\'re basically fine.', null, [], a.i); }
        var i = await G.UI.pick({ title: G.L(a.n), text: G.L('你想治疗哪个病？|What do you want treated?'), items: known.map(function (x) { return { t: G.ILL[x.id].n, icon: '🤒' }; }) });
        if (i < 0) return 'cancel';
        var ill = known[i], opts = G.health.options(ill);
        var j = await G.UI.pick({ title: G.L('选择医院|Choose Care'), items: opts.map(function (o) { return { t: o.n, sub: G.M(o.cost) + (G.parentsCover && G.parentsCover(o.cost) ? G.T('（爸妈付）| (parents pay)') : ''), icon: '🏥', dis: !G.canPay(o.cost) }; }) });
        if (j < 0) return 'cancel';
        G.dStart(); var ok = G.health.treat(ill, opts[j]); var dl = G.dEnd();
        return G.result(a.n, ok ? '治疗成功，{d}痊愈了！|Treatment worked — {d} is cured!' : ok === null ? '钱不够。|Not enough money.' : '治疗效果不理想。|Treatment didn\'t work this time.', { d: G.ILL[ill.id].n }, dl, a.i);
      } },
      { id: 'checkup', n: '全面体检|Full Checkup', i: '🔬', e: 10, $: 300, run: function (a) { var p = G.S.p, hid = p.ill.filter(function (x) { return !x.known; }); hid.forEach(function (x) { x.known = 1; }); return quick(a, hid.length ? G.L('体检发现了：{d}。|The checkup found: {d}.', { d: G.join(hid.map(function (x) { return G.ILL[x.id].n; }), '、', ', ') }) : '体检报告一切正常！|Everything came back normal!', {}); } },
      { id: 'surgery', n: '整容|Cosmetic Surgery', i: '💉', e: 20, a: [16, 80], run: async function (a) {
        var L = G.SURG; var i = await G.UI.pick({ title: G.L(a.n), items: L.map(function (s) { return { t: s.n, sub: G.L('{m} · 颜值+{l}|{m} · Looks +{l}', { m: G.M(G.$(s.p)), l: s.lk }), icon: '💉', dis: G.S.p.money < G.$(s.p) }; }) });
        if (i < 0) return 'cancel'; var s = L[i]; if (!G.pay(G.$(s.p))) return 'cancel';
        G.S.p.surg++; G.dStart();
        if (G.ch(s.f * (G.has('unlucky') ? 2 : 1))) { G.addStat('looks', -Math.ceil(s.lk / 2)); G.addStat('health', -6); G.addStat('happy', -12); var d1 = G.dEnd(); return G.result(a.n, '手术失败了……镜子里的你让人不忍直视。|The surgery went wrong... you can barely look in the mirror.', null, d1, a.i); }
        G.addStat('looks', s.lk); G.addStat('happy', 6); var d2 = G.dEnd();
        return G.result(a.n, '手术很成功，你变得更好看了！|The surgery was a success — you look better than ever!', null, d2, a.i);
      } },
      { id: 'therapy', n: '心理咨询|Therapy', i: '🛋️', e: 10, $: 150, a: [8, 120], run: function (a) { var p = G.S.p; p.ill = p.ill.filter(function (x) { return !((x.id === 'depression' || x.id === 'anxiety' || x.id === 'insomnia') && G.ch(.3)); }); return quick(a, '你把心里话都说了出来，轻松了很多。|You poured your heart out and felt much lighter.', { happy: 8, stress: -15 }); } },
      { id: 'gym', n: '去健身房|Hit the Gym', i: '🏋️', e: 15, $: 40, a: [12, 90], run: function (a) { return quick(a, ['你练得满身大汗。|You worked up a serious sweat.', '你挑战了新的重量！|You hit a new personal record!'], { fit: 6, health: 2, looks: 1, happy: 2 }); } },
      { id: 'run', n: '跑步|Go Running', i: '🏃', e: 10, a: [8, 85], run: function (a) { return quick(a, ['你沿着河边跑了五公里。|You ran 5K along the river.', '跑完步，整个人都神清气爽。|After the run, you feel refreshed.'], { fit: 4, health: 2, stress: -4 }); } },
      { id: 'yoga', n: '瑜伽冥想|Yoga & Meditation', i: '🧘', e: 10, a: [10, 120], run: function (a) { return quick(a, '你的内心平静了下来。|Your mind grows calm.', { stress: -12, happy: 4, health: 1 }); } },
      { id: 'diet', n: '节食减肥|Go on a Diet', i: '🥗', e: 10, a: [14, 90], run: function (a) { return quick(a, '你一个月瘦了五斤！|You lost a few pounds this month!', { looks: 2, happy: G.has('foodie') ? -7 : -3 }); } },
      { id: 'quitsmoke', n: '戒烟|Quit Smoking', i: '🚭', e: 10, if: function () { return G.S.p.hab.smoke > 0; }, run: function (a) { var h = G.S.p.hab; if (G.ch(.5)) { h.smoke = Math.max(0, h.smoke - 35); return quick(a, '你成功忍住了不抽烟。|You managed to resist the urge.', { happy: -4, health: 2 }); } return quick(a, '戒了三天又复吸了。|You lasted three days, then lit up again.', { happy: -2 }); } },
      { id: 'quitdrink', n: '戒酒|Quit Drinking', i: '🚱', e: 10, if: function () { return G.S.p.hab.drink > 0; }, run: function (a) { var h = G.S.p.hab; if (G.ch(.5)) { h.drink = Math.max(0, h.drink - 35); return quick(a, '你把家里的酒都倒掉了。|You poured out all the booze in the house.', { happy: -3, health: 2 }); } return quick(a, '朋友一叫，你又喝上了。|One call from a friend and you were drinking again.', {}); } },
      { id: 'tcm', n: '中医调理/养生|Traditional Medicine & Wellness', i: '🍵', e: 10, $: 200, a: [18, 120], run: function (a) { return quick(a, '你喝了一个月的中药/做了水疗，身体好了些。|A month of herbal remedies and spa days left you feeling better.', { health: 3, stress: -6 }); } },
      { id: 'lasik', n: '激光近视手术|LASIK Eye Surgery', i: '👁️', e: 15, $: 2500, a: [18, 60], if: function () { return G.S.p.ill.some(function (x) { return x.id === 'myopia'; }); }, run: function (a) { var p = G.S.p; p.ill = p.ill.filter(function (x) { return x.id !== 'myopia'; }); p.flags.myopiaFixed = 1; return quick(a, '你终于摘掉了眼镜！|You finally ditched the glasses!', { looks: 3, happy: 6 }); } }
    ] },
    { id: 'fun', n: '休闲娱乐|Leisure', i: '🎡', items: [
      { id: 'movie', n: '看电影|See a Movie', i: '🎬', e: 5, $: 15, a: [5, 120], run: function (a) { return quick(a, ['电影很精彩，你看得热泪盈眶。|The movie was great; you got teary-eyed.', '烂片一部，浪费钱。|A total flop — waste of money.'], { happy: G.ri(1, 6) }); } },
      { id: 'mall', n: '逛街|Go Shopping', i: '🛍️', e: 10, $: 60, a: [8, 120], run: function (a) { return quick(a, '你买了一堆不太需要的东西。|You bought a pile of things you didn\'t really need.', { happy: G.has('spender') ? 9 : 4 }); } },
      { id: 'feast', n: '吃顿大餐|Fine Dining', i: '🍱', e: 10, $: 120, a: [6, 120], run: function (a) { return quick(a, ['这家餐厅绝了，吃得太满足了！|That restaurant was incredible — so satisfying!', '你吃撑了，扶着墙出的门。|You ate so much you had to lean on the wall to leave.'], { happy: G.has('foodie') ? 12 : 6, health: -1 }); } },
      { id: 'game', n: '打电子游戏|Play Video Games', i: '🎮', e: 10, a: [6, 90], if: function () { return G.S.year >= 1980; }, run: function (a) { G.S.p.hab.night += 5; sk('game', 3); return quick(a, ['你通宵上分，终于上了王者。|You grinded all night and hit the top rank.', '你连输十把，气得想摔手机。|Ten losses in a row — you wanted to throw your phone.'], { happy: 5, stress: -5 }); } },
      { id: 'ktv', n: '唱K|Karaoke', i: '🎤', e: 10, $: 40, a: [10, 90], if: function () { return G.S.year >= 1990; }, run: function (a) { sk('music', 1); return quick(a, '你在KTV里嘶吼了一晚上，嗓子都哑了。|You belted songs all night at karaoke until your voice gave out.', { happy: 7, stress: -6 }); } },
      { id: 'concert', n: '看演唱会|Go to a Concert', i: '🎸', e: 15, $: 150, a: [10, 90], run: function (a) { return quick(a, '全场大合唱，你热泪盈眶。|The whole crowd sang along; you teared up.', { happy: 9 }); } },
      { id: 'park', n: '游乐园|Theme Park', i: '🎢', e: 15, $: 100, a: [4, 80], run: function (a) { return quick(a, '你坐了三遍过山车，尖叫到失声。|You rode the roller coaster three times and screamed yourself hoarse.', { happy: 8 }); } },
      { id: 'read', n: '读书|Read a Book', i: '📖', e: 10, a: [6, 120], run: function (a) { return quick(a, ['你读完了一本好书，受益匪浅。|You finished a great book and learned a lot.', '你在书里找到了共鸣。|You found yourself in the pages.'], { smarts: 2, happy: 2 }); } },
      { id: 'fish', n: '钓鱼|Go Fishing', i: '🎣', e: 10, a: [8, 120], run: function (a) { return quick(a, ['你钓到了一条大鱼！|You caught a big one!', '坐了一下午，一条都没钓到。|An entire afternoon and not a single bite.'], { happy: 4, stress: -8 }); } },
      { id: 'hike', n: '徒步爬山|Go Hiking', i: '⛰️', e: 15, a: [8, 80], run: function (a) { return quick(a, '山顶的风景美极了。|The view from the top was breathtaking.', { fit: 3, happy: 5, health: 1 }); } },
      { id: 'scroll', n: '熬夜刷手机|Doomscroll Late at Night', i: '📱', e: 5, a: [10, 90], if: function () { return G.S.year >= 2010; }, run: function (a) { G.S.p.hab.night += 20; return quick(a, '不知不觉就刷到了凌晨三点。|Before you knew it, it was 3 a.m.', { happy: 3, health: -1 }); } },
      { id: 'drink', n: '喝酒|Have a Drink', i: '🍺', e: 5, a: [16, 120], run: function (a) { G.S.p.hab.drink = G.clamp(G.S.p.hab.drink + 8, 0, 100); return quick(a, ['几杯下肚，烦恼都忘了。|A few drinks in, your worries fade.', '你喝断片了，醒来在朋友家沙发上。|You blacked out and woke up on a friend\'s couch.'], { happy: 5, health: -1, stress: -6 }); } },
      { id: 'smoke', n: '抽烟|Smoke', i: '🚬', e: 5, a: [14, 120], run: function (a) { G.S.p.hab.smoke = G.clamp(G.S.p.hab.smoke + 10, 0, 100); return quick(a, '你点了一根烟，吐出一个烟圈。|You light up and blow a smoke ring.', { happy: 3, health: -1, stress: -4 }); } },
      { id: 'tip', n: '看直播打赏|Tip a Streamer', i: '🎁', e: 5, $: 200, a: [16, 90], if: function () { return G.S.year >= 2014; }, run: function (a) { return quick(a, '主播念了你的名字，你开心得像个孩子。|The streamer read your name aloud, and you grinned like a kid.', { happy: 4 }); } },
      { id: 'temple', n: '去寺庙/教堂祈福|Visit a Temple or Church', i: '⛩️', e: 10, a: [5, 120], run: function (a) { return quick(a, '你虔诚地许了个愿。|You made a heartfelt wish.', { happy: 3, karma: 2, stress: -5 }); } },
      { id: 'volunteer', n: '做志愿者|Volunteer', i: '🙌', e: 15, a: [12, 100], run: function (a) { return quick(a, ['你去敬老院陪老人聊了一下午。|You spent the afternoon chatting with seniors at a care home.', '你参加了社区清洁活动。|You joined a community clean-up.'], { karma: 6, happy: 4, eq: 1 }); } }
    ] },
    { id: 'social', n: '社交恋爱|Social & Romance', i: '💞', items: [
      { id: 'app', n: '交友软件|Dating App', i: '📲', e: 10, a: [18, 80], run: function (a) { var y = G.S.year; return meet(a, cands(4), y >= 2010 ? '你在交友软件上滑到了这些人。|You swiped through these people on the dating app.' : '你在报纸征婚栏认识了这些人。|You met these people through newspaper personal ads.'); } },
      { id: 'blind', n: '相亲|Blind Date', i: '🫖', e: 15, $: 100, a: [20, 70], run: function (a) { return meet(a, cands(3, { minGap: -4, maxGap: 6 }), '媒人给你介绍了几位对象。|The matchmaker introduced you to a few candidates.'); } },
      { id: 'bar', n: '去酒吧夜店|Go to a Bar or Club', i: '🍸', e: 15, $: 80, a: [18, 60], run: async function (a) { G.S.p.hab.drink += 3; G.dStart(); G.addStat('happy', 5); var dl = G.dEnd(); if (G.ch(.55)) return meet(a, cands(G.ri(1, 2)), '有人在吧台边和你搭讪。|Someone at the bar strikes up a conversation.'); return G.result(a.n, '你蹦迪到天亮，没遇到感兴趣的人。|You danced until dawn but met no one interesting.', null, dl, a.i); } },
      { id: 'mixer', n: '联谊派对|Mixer Party', i: '🎉', e: 15, a: [18, 45], run: function (a) { return meet(a, cands(3), '派对上你认识了几个人。|You met a few people at the party.'); } },
      { id: 'friend', n: '结交新朋友|Make a New Friend', i: '🤝', e: 10, a: [6, 120], run: function (a) { var f = N.make({ rel: 'friend', age: G.clamp(G.S.p.age + G.ri(-5, 5), 5, 100), aff: G.ri(20, 40) }); return quick(a, '你认识了新朋友{n}。|You made a new friend: {n}.', { happy: 3, eq: 1 }, { n: f.name }); } },
      { id: 'party', n: '办派对|Throw a Party', i: '🥳', e: 20, $: 300, a: [14, 100], run: function (a) { N.rel('friend', 'classmate', 'colleague').forEach(function (n) { N.addAff(n, 5); N.touch(n); }); return quick(a, '派对办得很成功，朋友们都玩得很尽兴。|The party was a hit; everyone had a blast.', { happy: 8, fame: 1 }); } },
      { id: 'trybaby', n: '备孕|Try for a Baby', i: '🍼', e: 10, if: function () { var pt = N.partner(); return G.love.canConceive(pt) && !pt.trying && !pt.preg && !G.S.p.preg; }, run: function (a) { var pt = N.partner(); if (pt) pt.trying = G.S.year; return quick(a, '你们决定要个孩子，开始备孕了。怀上以后就不用再操心了。|You decide to try for a baby. Once it happens, there\'s nothing more to do.', { happy: 3 }); } },
      { id: 'ivf', n: '试管/代孕|IVF / Surrogacy', i: '🧬', e: 20, $: 60000, a: [25, 60], if: function () { var pt = N.partner(); return pt && (pt.g === G.S.p.g || G.S.p.age >= 40); }, run: async function (a) { var k = await G.love.baby(N.partner()); return G.result(a.n, '经过漫长的等待，{n}来到了你们身边。|After a long wait, {n} arrived.', { n: k.name }, [], a.i); } },
      { id: 'adopt', n: '领养孩子|Adopt a Child', i: '🏡', e: 20, $: 15000, a: [25, 65], run: async function (a) { var k = await G.love.baby(null, true); return G.result(a.n, '你领养了{n}。|You adopted {n}.', { n: k.name }, [], a.i); } },
      { id: 'affair', n: '寻找婚外情|Look for an Affair', i: '🕯️', e: 15, a: [20, 70], if: function () { return !!N.spouse(); }, run: async function (a) { G.addStat('karma', -5); var who = await pickPerson(G.L(a.n), G.L('你偷偷物色着……|You look around in secret...'), cands(3)); if (!who) return 'cancel'; if (G.ch(N.attract(who))) { who.rel = 'affair'; who.love = 55; who.pin = 1; G.inc('affairs'); return G.result(a.n, '你和{n}开始了秘密关系。|You began a secret relationship with {n}.', { n: who.name }, [], a.i); } return G.result(a.n, '{n}对你没兴趣。|{n} wasn\'t interested.', { n: who.name }, [], a.i); } }
    ] },
    { id: 'elite', n: '高端社交|Elite Circle', i: '🥂', lock: function () { var p = G.S.p; return G.vip.tier() >= 1 || p.flags.elite || G.netWorth() > G.$(2e6) || p.st.fame >= 60 ? null : G.L('需要VIP，或身家200万美元等值，或名声60以上|Requires VIP, $2M+ net worth, or 60+ fame'); }, items: [
      { id: 'club', n: '高端私人俱乐部|Private Members\' Club', i: '🍾', e: 20, $: 5000, a: [18, 80], run: function (a) { var tags = G.love.eliteTags(); if (!tags.length) tags = ['rich']; var list = []; for (var i = 0; i < 3; i++) list.push(N.mkRomantic({ rel: 'contact', tags: [G.pick(tags)], love: G.ri(10, 35), aff: 10 })); return meet(a, list, '俱乐部里都是有头有脸的人物。|The club is full of very important people.'); } },
      { id: 'gala', n: '慈善晚宴|Charity Gala', i: '🎗️', e: 20, $: 50000, a: [18, 100], run: function (a) { G.dStart(); G.addStat('fame', 5); G.addStat('karma', 8); var dl = G.dEnd(); var tags = G.love.eliteTags(); var n = N.make({ rel: 'friend', tags: [G.pick(tags.length ? tags : ['rich'])], age: G.ri(30, 65), aff: 30 }); return G.result(a.n, '你慷慨捐款，还结识了{n}（{j}）。|You donated generously and got to know {n} ({j}).', { n: n.name, j: n.job }, dl, a.i); } },
      { id: 'yachtp', n: '游艇派对|Yacht Party', i: '🛥️', e: 20, $: 20000, a: [18, 70], run: function (a) { var tags = G.love.eliteTags(); var list = []; for (var i = 0; i < 2; i++) list.push(N.mkRomantic({ rel: 'contact', tags: [G.pick(tags.length ? tags : ['rich'])], love: G.ri(15, 40), aff: 15 })); G.addStat('happy', 8); return meet(a, list, '地中海的阳光下，香槟和名流。|Champagne and celebrities under the Mediterranean sun.'); } }
    ] },
    { id: 'learn', n: '学习技能|Learn Skills', i: '📚', items: [
      { id: 'instrument', n: '学乐器|Learn an Instrument', i: '🎻', e: 15, $: 300, a: [5, 90], run: function (a) { var s = sk('music', G.has('music') ? 10 : 5); return quick(a, '你的乐器水平提高了（{s}/100）。|Your playing improved ({s}/100).', { happy: 2 }, { s: s }); } },
      { id: 'paint', n: '学画画|Learn to Paint', i: '🎨', e: 15, $: 200, a: [5, 100], run: function (a) { var s = sk('art', G.has('art') ? 10 : 5); return quick(a, '你的画技进步了（{s}/100）。|Your painting improved ({s}/100).', { happy: 2 }, { s: s }); } },
      { id: 'code', n: '学编程|Learn to Code', i: '💻', e: 15, $: 200, a: [8, 70], if: function () { return G.S.year >= 1980; }, run: function (a) { var s = sk('code', G.has('hacker') ? 10 : 5); return quick(a, '你学会了新的编程技巧（{s}/100）。|You picked up new coding skills ({s}/100).', { smarts: 1 }, { s: s }); } },
      { id: 'lang', n: '学外语|Learn a Language', i: '🗣️', e: 15, $: 300, a: [6, 90], run: async function (a) {
        var p = G.S.p, opts = Object.keys(G.LANGS).filter(function (l) { return p.langs.indexOf(l) < 0; });
        var i = await G.UI.pick({ title: G.L(a.n), items: opts.map(function (l) { return { t: G.LANGS[l], sub: G.L('进度 {x}/3|Progress {x}/3', { x: (p.flags['lang_' + l] || 0) }), icon: '🗣️' }; }) });
        if (i < 0) return 'cancel'; var l = opts[i]; p.flags['lang_' + l] = (p.flags['lang_' + l] || 0) + (G.has('polyglot') ? 3 : 1);
        if (p.flags['lang_' + l] >= 3) { p.langs.push(l); if (G.C[p.country].lang === l) p.flags.langBar = 0; return quick(a, '你已经能流利地说{l}了！|You can now speak {l} fluently!', { smarts: 2, happy: 4 }, { l: G.LANGS[l] }); }
        return quick(a, '你的{l}进步了一些。|Your {l} improved a bit.', { smarts: 1 }, { l: G.LANGS[l] });
      } },
      { id: 'license', n: '考驾照|Get a Driver\'s License', i: '🚦', e: 20, $: 500, a: [18, 80], if: function () { return !G.S.p.flags.license; }, run: async function (a) { var r = await G.UI.game('driving', { name: a.n }); if (r.score > .4) { G.S.p.flags.license = 1; return G.result(a.n, '你拿到了驾照！|You got your license!', null, [], a.i); } return G.result(a.n, '路考挂了，下次再来。|You failed the road test. Try again.', null, [], a.i); } },
      { id: 'martial', n: '学武术/拳击|Martial Arts / Boxing', i: '🥋', e: 15, $: 200, a: [6, 70], run: function (a) { var s = sk('fight', G.has('fighter') ? 10 : 5); return quick(a, '你的格斗技巧提升了（{s}/100）。|Your fighting skills improved ({s}/100).', { fit: 4, health: 1 }, { s: s }); } },
      { id: 'dance', n: '学跳舞|Dance Lessons', i: '🩰', e: 15, $: 150, a: [5, 80], run: function (a) { var s = sk('dance', 6); return quick(a, '你的舞姿越来越优美了（{s}/100）。|Your dancing grew more graceful ({s}/100).', { looks: 1, fit: 2 }, { s: s }); } },
      { id: 'cook', n: '学厨艺|Cooking Class', i: '🍳', e: 10, $: 100, a: [10, 100], run: function (a) { sk('cook', 6); N.rel('spouse', 'lover').forEach(function (n) { N.addLove(n, 3); }); return quick(a, '你学会了几道拿手菜。|You learned a few signature dishes.', { eq: 1, happy: 3 }); } },
      { id: 'adultedu', n: '读成人学历|Part-time Degree', i: '🎓', e: 25, $: 3000, a: [21, 60], if: function () { var e = G.S.p.edu; return (e.deg === 3 || e.deg === 4) && !G.school.isStudent(); }, run: function (a) { var p = G.S.p; p.flags.adult = (p.flags.adult || 0) + 1; if (p.flags.adult >= 3) { p.flags.adult = 0; p.edu.deg++; G.major('取得{d}学历|Earned a {d}', { d: G.DEG[p.edu.deg] }); return quick(a, '你终于拿到了{d}学位！|You finally earned your {d}!', { happy: 8, smarts: 2 }, { d: G.DEG[p.edu.deg] }); } return quick(a, '你利用业余时间上课（{x}/3）。|You took evening classes ({x}/3).', { smarts: 1, stress: 4 }, { x: p.flags.adult }); } },
      { id: 'cert', n: '考职业证书|Professional Certification', i: '📜', e: 20, $: 500, a: [18, 65], run: async function (a) { var r = await G.UI.game('quiz', { name: a.n }); if (r.score > .5) { if (G.S.p.job) G.S.p.job.perf += 6; G.S.p.flags.certs = (G.S.p.flags.certs || 0) + 1; return G.result(a.n, '你通过考试，拿到了证书！|You passed and got certified!', null, [], a.i); } return G.result(a.n, '没考过。|You didn\'t pass.', null, [], a.i); } }
    ] },
    { id: 'shop', n: '购物置业|Shopping & Property', i: '🛒', items: [
      { id: 'house', n: '买房|Buy a Home', i: '🏠', e: 10, a: [18, 120], run: async function (a) {
        var p = G.S.p, hs = G.HOUSES.filter(function (h) { return !h.tiers || h.tiers.indexOf(p.tier) >= 0; });
        var inc = G.money.income().work;
        var i = await G.UI.pick({ title: G.L('买房 · {c}|Buy a Home · {c}', { c: p.city }), text: G.L('现金：{m}|Cash: {m}', { m: G.M(p.money) }), items: hs.map(function (h) { var pr = G.money.housePrice(h); return { t: h.n, sub: G.L('{a}㎡ · {m}|{a} m² · {m}', { a: h.a, m: G.M(pr) }), icon: h.i, dis: p.money < pr * .3 }; }) });
        if (i < 0) return 'cancel'; var h = hs[i], pr = G.money.housePrice(h);
        var opts = [{ t: G.L('全款 {m}|Pay in full {m}', { m: G.M(pr) }), dis: p.money < pr }, { t: G.L('贷款（首付30% {m}）|Mortgage (30% down: {m})', { m: G.M(Math.round(pr * .3)) }), dis: p.money < pr * .3 || inc <= 0 }, { t: G.L('算了|Cancel') }];
        var j = await G.UI.event({ title: G.L(h.n), text: G.L('总价{m}，怎么付？|Total price {m}. How will you pay?', { m: G.M(pr) }), opts: opts });
        if (j === 2) return 'cancel';
        var rec = G.money.buyHouse(h, j === 1);
        if (!rec) return G.result(a.n, '钱不够。|Not enough money.', null, [], a.i);
        G.dStart(); G.addStat('happy', 12); var dl = G.dEnd();
        return G.result(a.n, '你买下了{n}！|You bought a {n}!', { n: h.n }, dl, h.i);
      } },
      { id: 'car', n: '买车|Buy a Vehicle', i: '🚗', e: 10, a: [16, 100], run: async function (a) {
        var cs = G.CARS.filter(function (c) { return !c.y0 || G.S.year >= c.y0; });
        var i = await G.UI.pick({ title: G.L(a.n), items: cs.map(function (c) { return { t: c.n, sub: G.M(G.$(c.p)), icon: c.i, dis: G.S.p.money < G.$(c.p) }; }) });
        if (i < 0) return 'cancel'; var c = cs[i];
        if (!G.money.buyCar(c)) return G.result(a.n, '钱不够。|Not enough money.', null, [], a.i);
        G.dStart(); G.addStat('happy', 4 + c.f); if (c.f >= 12) G.addStat('fame', 1); var dl = G.dEnd();
        if (!G.S.p.flags.license && c.id !== 'bike') G.log('（你还没有驾照……）|(You don\'t have a license yet...)');
        return G.result(a.n, '你提了一辆{n}！|You drove home a new {n}!', { n: c.n }, dl, c.i);
      } },
      { id: 'lux', n: '奢侈品|Luxury Goods', i: '💎', e: 5, a: [10, 120], run: async function (a) {
        var L = G.LUX.filter(function (x) { return !x.y0 || G.S.year >= x.y0; });
        var i = await G.UI.pick({ title: G.L(a.n), items: L.map(function (x) { return { t: x.n, sub: G.M(G.$(x.p)), icon: x.i, dis: G.S.p.money < G.$(x.p) }; }) });
        if (i < 0) return 'cancel'; var x = L[i]; G.dStart(); var ok = G.money.buyItem(x); var dl = G.dEnd();
        return G.result(a.n, ok ? '你买下了{n}。|You bought a {n}.' : '钱不够。|Not enough money.', { n: x.n }, dl, x.i);
      } },
      { id: 'pet', n: '养宠物|Get a Pet', i: '🐾', e: 10, a: [6, 110], run: async function (a) {
        var rich = G.netWorth() > G.$(300000);
        var L = G.PETS.filter(function (x) { return !x.ex || rich; });
        var i = await G.UI.pick({ title: G.L(a.n), items: L.map(function (x) { return { t: x.n, sub: G.L('{m}{w}|{m}{w}', { m: G.M(G.$(x.p)), w: x.illegal ? G.L(' · 违法|· Illegal') : '' }), icon: x.i, dis: G.S.p.money < G.$(x.p) }; }) });
        if (i < 0) return 'cancel'; var x = L[i]; if (!G.pay(G.$(x.p))) return 'cancel';
        var nm = await G.UI.input({ title: G.L('给它起个名字|Name Your Pet'), sug: G.sample(G.PET_NAMES, 3), def: G.pick(G.PET_NAMES) });
        G.S.assets.pets.push({ id: G.uid(), kind: x.id, name: nm || G.pick(G.PET_NAMES), by: G.S.year, aff: 60 });
        G.dStart(); G.addStat('happy', 8); if (x.illegal) G.addStat('heat', 25); var dl = G.dEnd(); G.inc('pets');
        return G.result(a.n, '{n}成了你的家庭成员！|{n} joined your family!', { n: nm || '' }, dl, x.i);
      } }
    ] },
    { id: 'travel', n: '旅行|Travel', i: '✈️', items: G.TRAVEL.map(function (t) {
      return { id: 'tr_' + t.id, n: t.n, i: t.id === 'space' ? '🚀' : '🧳', e: 25, $: t.p, a: [8, 95], if: function () { return !t.y0 || G.S.year >= t.y0; }, run: function (a) {
        var p = G.S.p; p.flags['tr_' + t.id] = 1; G.S.cnt.travel = Object.keys(p.flags).filter(function (k) { return k.indexOf('tr_') === 0; }).length;
        if (t.id === 'space') p.flags.space = 1;
        N.rel('spouse', 'lover').forEach(function (n) { N.addLove(n, 6); });
        var ex = G.ch(.12) ? G.pick(['，还在路上邂逅了一段浪漫|, and even had a romantic encounter', '，不过护照弄丢了，折腾了好几天|, though you lost your passport and it took days to sort out', '，还吃坏了肚子|, but got food poisoning']) : '|';
        return quick(a, '你去了{n}，玩得非常开心{x}。|You traveled to {n} and had a wonderful time{x}.', { happy: t.h, stress: -15 }, { n: t.n, x: ex });
      } };
    }) },
    { id: 'money', n: '投资理财|Money', i: '📈', items: [
      { id: 'invest', n: '投资理财|Investments', i: '📊', e: 0, a: [16, 120], run: async function () { await G.UI.investPage(); return 'cancel'; } },
      { id: 'loan', n: '借贷|Borrow Money', i: '🏦', e: 5, a: [18, 120], run: async function (a) {
        var L = G.money.LOANS.filter(function (l) { return !l.y0 || G.S.year >= l.y0; });
        var i = await G.UI.pick({ title: G.L(a.n), items: L.map(function (l) { var m = Math.round(l.max()); return { t: l.n, sub: G.L('最多{m} · 年利率{r}%|Up to {m} · {r}% APR', { m: G.M(m), r: Math.round(l.r * 100) }), icon: '💳', dis: m <= 0 }; }) });
        if (i < 0) return 'cancel'; var l = L[i], amt = Math.round(l.max()); G.money.borrow(l, amt); if (l.k === 'shark') G.S.p.flags.shark = 1;
        return G.result(a.n, '你借到了{m}。|You borrowed {m}.', { m: G.M(amt) }, [{ k: 'money', n: amt }], '💳');
      } },
      { id: 'repay', n: '还债|Repay Debt', i: '🧾', e: 5, if: function () { return G.S.assets.debt.length; }, run: async function (a) {
        var D = G.S.assets.debt;
        var i = await G.UI.pick({ title: G.L(a.n), items: D.map(function (d) { return { t: d.n, sub: G.M(d.amt), icon: '🧾' }; }) });
        if (i < 0) return 'cancel'; var paid = G.money.repay(D[i], G.S.p.money);
        return G.result(a.n, paid ? '你还了{m}。|You repaid {m}.' : '你没钱还。|You have no cash to repay with.', { m: G.M(paid) }, [{ k: 'money', n: -paid }], '🧾');
      } },
      { id: 'lottery', n: '买彩票|Buy Lottery Tickets', i: '🎟️', e: 5, a: [18, 120], run: async function (a) {
        var i = await G.UI.pick({ title: G.L(a.n), items: [1, 10, 100].map(function (n) { return { t: G.L('{n}张|{n} tickets', { n: n }), sub: G.M(G.$(2) * n), icon: '🎟️' }; }) });
        if (i < 0) return 'cancel'; var r = G.money.lottery([1, 10, 100][i]);
        if (!r) return G.result(a.n, '钱不够。|Not enough money.', null, [], a.i);
        return G.result(a.n, r.jack ? '🎉 你中了头奖！！！{m}！|🎉 JACKPOT!!! {m}!' : r.win ? '你中了{m}。|You won {m}.' : '一张都没中。|Not a single winner.', { m: G.M(r.win) }, [{ k: 'money', n: r.win - r.cost }], '🎟️');
      } }
    ] },
    { id: 'gamble', n: '赌博|Gambling', i: '🎲', items: [
      { id: 'bj', n: '二十一点|Blackjack', i: '🃏', e: 10, a: [18, 120], run: function (a) { return G.gambleFlow(a, 'blackjack'); } },
      { id: 'dice', n: '骰宝猜大小|Sic Bo (Big/Small)', i: '🎲', e: 10, a: [18, 120], run: function (a) { return G.gambleFlow(a, 'dice'); } },
      { id: 'mj', n: '打麻将|Mahjong', i: '🀄', e: 15, a: [14, 120], run: function (a) { return G.gambleFlow(a, 'mahjong'); } },
      { id: 'vegas', n: '去澳门/拉斯维加斯|Trip to Macau / Las Vegas', i: '🎰', e: 30, $: 2500, a: [18, 100], run: async function (a) { G.addStat('happy', 6); G.S.p.flags.vegas = G.S.year; return G.gambleFlow(a, G.pick(['blackjack', 'dice']), 5); } }
    ] },
    { id: 'hustle', n: '副业·演艺·创业|Hustles, Fame & Startups', i: '💡', items: [
      { id: 'jobsearch', n: '找工作|Look for a Job', i: '🔎', e: 15, a: [13, 75], run: async function () { await G.career.search(); } },
      { id: 'stall', n: '摆摊|Run a Street Stall', i: '🍢', e: 20, a: [14, 85], run: function (a) { var m = Math.round(G.$(G.ri(40, 450)) * (1 + G.skill('cook') / 60)); if (G.ch(.12)) return quick(a, '城管来了，你推着车就跑。|Inspectors showed up and you ran off with your cart.', { happy: -3 }); G.dStart(); G.addMoney(m); G.addStat('eq', 1); var dl = G.dEnd(); return G.result(a.n, '你的小摊生意不错，赚了{m}。|Your stall did well, earning {m}.', { m: G.M(m) }, dl, a.i); } },
      { id: 'eshop', n: '开网店|Open an Online Store', i: '🛒', e: 20, a: [16, 80], if: function () { return G.S.year >= 2003; }, run: function (a) { var m = Math.round(G.$(G.ri(-200, 2500)) * (1 + G.S.p.st.eq / 100)); G.dStart(); G.addMoney(m); var dl = G.dEnd(); return G.result(a.n, m > 0 ? '网店这一季赚了{m}。|Your shop earned {m} this season.' : '网店亏了{m}。|Your shop lost {m}.', { m: G.M(Math.abs(m)) }, dl, a.i); } },
      { id: 'stream', n: '开直播|Start Streaming', i: '📹', e: 15, a: [16, 80], if: function () { return G.S.year >= 2008 && !G.S.p.fc; }, run: function (a) { G.fame.start('streamer'); return quick(a, '你开通了直播间，迎来了第一批观众。|You opened your stream and welcomed your first viewers.', { happy: 4 }); } },
      { id: 'talent', n: '参加选秀|Enter a Talent Show', i: '🎙️', e: 25, a: [14, 30], if: function () { return !G.S.p.fc; }, run: async function (a) {
        var r = await G.UI.game('rhythm', { name: a.n }); var p = G.S.p, sc = r.score + (G.has('music') ? .15 : 0) + G.skill('music') / 400 + p.st.looks / 600;
        if (sc > .72) { var idol = ['kr', 'jp', 'cn', 'th'].indexOf(p.country) >= 0 && p.age <= 24 && p.st.looks > 55 && G.ch(.5); G.fame.start(idol ? 'idol' : 'singer'); G.dStart(); G.addStat('fame', 6); var dl = G.dEnd(); return G.result(a.n, idol ? '经纪公司看中了你，你成了练习生！|An agency signed you as a trainee!' : '你在选秀中一鸣惊人，签约了唱片公司！|You stunned the judges and landed a record deal!', null, dl, a.i); }
        return G.result(a.n, '你在海选就被淘汰了。|You were eliminated in the first round.', null, [], a.i);
      } },
      { id: 'audition', n: '影视试镜|Film Audition', i: '🎬', e: 25, a: [16, 60], if: function () { return !G.S.p.fc; }, run: async function (a) { var r = await G.UI.game('quiz', { name: a.n }); var p = G.S.p, sc = r.score * .5 + p.st.looks / 200 + (G.has('actor') ? .2 : 0); if (sc > .7) { G.fame.start('actor'); return G.result(a.n, '导演一眼相中了你，给了你一个角色！|The director picked you on the spot and cast you!', null, [], a.i); } return G.result(a.n, '试镜没有通过。|The audition didn\'t work out.', null, [], a.i); } },
      { id: 'esports', n: '电竞青训试训|Esports Academy Tryout', i: '🕹️', e: 25, a: [14, 22], if: function () { return G.S.year >= 2000 && !G.S.p.fc; }, run: async function (a) { var r = await G.UI.game('rhythm', { name: a.n }); var sc = r.score + (G.has('gamer') ? .2 : 0) + G.skill('game') / 300; if (sc > .72) { G.fame.start('esports'); return G.result(a.n, '你的操作惊艳了教练，进入了青训队！|Your mechanics amazed the coach — you made the academy team!', null, [], a.i); } return G.result(a.n, '你的手速还差一点。|Your reflexes weren\'t quite there.', null, [], a.i); } },
      { id: 'sports', n: '职业体育试训|Pro Sports Tryout', i: '🏅', e: 25, a: [14, 25], if: function () { return !G.S.p.fc; }, run: async function (a) { var si = await G.UI.pick({ title: G.L('选择运动项目|Choose a Sport'), items: G.SPORTS.map(function (s) { return { t: s, icon: '🏅' }; }) }); if (si < 0) return 'cancel'; var r = await G.UI.game(G.pick(['penalty', 'basketball', 'sprint']), { name: G.SPORTS[si] }); var sc = r.score * .6 + G.S.p.h.fit / 250 + (G.has('athletic') ? .2 : 0); if (sc > .68) { G.fame.start('athlete', { sport: si }); return G.result(a.n, '你被{s}职业队签下了！|A professional {s} team signed you!', { s: G.SPORTS[si] }, [], a.i); } return G.result(a.n, '试训没通过。|You didn\'t make the team.', null, [], a.i); } },
      { id: 'write', n: '投稿写作|Submit a Manuscript', i: '✒️', e: 25, a: [12, 100], if: function () { return !G.S.p.fc; }, run: async function (a) { var r = await G.UI.game('quiz', { name: a.n }); var sc = r.score * .5 + G.S.p.st.smarts / 200; if (sc > .72) { G.fame.start('writer'); return G.result(a.n, '出版社看中了你的稿子！|A publisher accepted your manuscript!', null, [], a.i); } return G.result(a.n, '稿子被退回了。|Your manuscript was rejected.', null, [], a.i); } },
      { id: 'exhibit', n: '办画展|Hold an Art Show', i: '🖼️', e: 25, a: [14, 100], if: function () { return !G.S.p.fc; }, run: async function (a) { var r = await G.UI.game('memory', { name: a.n }); var sc = r.score * .5 + G.skill('art') / 150 + (G.has('art') ? .2 : 0); if (sc > .7) { G.fame.start('painter'); return G.result(a.n, '画廊签下了你！|A gallery signed you!', null, [], a.i); } return G.result(a.n, '画展门可罗雀。|Nobody came to the show.', null, [], a.i); } },
      { id: 'casting', n: '模特面试|Model Casting', i: '📸', e: 20, a: [16, 30], if: function () { return !G.S.p.fc && G.S.p.st.looks >= 65; }, run: async function (a) { var r = await G.UI.game('rhythm', { name: a.n }); if (r.score * .4 + G.S.p.st.looks / 160 > .68) { G.fame.start('model'); return G.result(a.n, '模特经纪公司签下了你！|A modeling agency signed you!', null, [], a.i); } return G.result(a.n, '这次没被选上。|You weren\'t picked this time.', null, [], a.i); } },
      { id: 'startup', n: '创业开公司|Start a Company', i: '🚀', e: 30, a: [18, 80], if: function () { return !G.S.assets.company; }, run: async function (a) {
        var inds = Object.keys(G.INDUSTRY).filter(function (k) { return G.S.year >= G.INDUSTRY[k].y0; });
        var i = await G.UI.pick({ title: G.L('选择行业|Choose an Industry'), items: inds.map(function (k) { return { t: G.INDUSTRY[k].n, icon: '🏢' }; }) });
        if (i < 0) return 'cancel';
        var caps = [20000, 200000, 2000000];
        var j = await G.UI.pick({ title: G.L('启动资金|Starting Capital'), items: caps.map(function (c) { return { t: G.M(G.$(c)), icon: '💰', dis: G.S.p.money < G.$(c) }; }) });
        if (j < 0 || G.S.p.money < G.$(caps[j])) return 'cancel';
        G.addMoney(-G.$(caps[j])); G.biz.start(inds[i], caps[j]);
        return G.result(a.n, '你创办了{n}！|You founded {n}!', { n: G.S.assets.company.name }, [], '🚀');
      } }
    ] },
    { id: 'service', n: '参军·从警·从政|Military, Police & Politics', i: '🎖️', items: [
      { id: 'enlist', n: '参军入伍|Enlist in the Military', i: '🪖', e: 20, if: function () { return !G.S.p.mil; }, lock: function () { return G.mil.can() ? null : G.L('需17-26岁、健康≥50、无犯罪记录|Requires age 17-26, health ≥ 50, no record'); }, run: async function (a) {
        var bs = ['army', 'navy', 'air']; var i = await G.UI.pick({ title: G.L('选择军种|Choose a Branch'), items: bs.map(function (b) { return { t: G.MIL.br[b], icon: { army: '🪖', navy: '⚓', air: '✈️' }[b] }; }) });
        if (i < 0) return 'cancel';
        var r = await G.UI.game('sprint', { name: G.L('入伍体能考核|Enlistment Fitness Test') });
        if (r.score + G.S.p.h.fit / 300 > .45) { G.mil.enlist(bs[i]); return G.result(a.n, '你通过了体检和考核，正式入伍！|You passed the medical and fitness tests and enlisted!', null, [], a.i); }
        return G.result(a.n, '体能考核没通过。|You failed the fitness test.', null, [], a.i);
      } },
      { id: 'police', n: '报考警察|Police Recruitment Exam', i: '👮', e: 20, if: function () { return !G.S.p.pol; }, lock: function () { return G.police.can() ? null : G.L('需18-35岁、高中学历、健康≥55、无犯罪记录|Requires age 18-35, high school, health ≥ 55, no record'); }, run: async function (a) {
        var r1 = await G.UI.game('quiz', { name: G.L('招警笔试|Written Exam') }); var r2 = await G.UI.game('sprint', { name: G.L('体能测试|Fitness Test') });
        if ((r1.score + r2.score) / 2 > .48) { G.police.join(false); return G.result(a.n, '你通过了招警考试！|You passed the police exam!', null, [], a.i); }
        return G.result(a.n, '没考上。|You didn\'t pass.', null, [], a.i);
      } },
      { id: 'civil', n: '考公务员|Civil Service Exam', i: '🏛️', e: 25, if: function () { return !G.S.p.gov; }, lock: function () { return G.gov.can() ? null : G.L('需18-35岁、本科学历、无犯罪记录|Requires age 18-35, bachelor\'s, no record'); }, run: async function (a) {
        var r = await G.UI.game('exam', { name: a.n }); var sc = r.score * .6 + G.S.p.st.smarts / 250 + (G.S.p.flags.govfam ? .08 : 0) + (G.S.p.flags.redfam ? .3 : 0);
        if (sc > .62) { G.gov.join(); return G.result(a.n, '你在千军万马中杀出重围，考上了！|You beat out thousands of applicants and got in!', null, [], a.i); }
        return G.result(a.n, '竞争太激烈，你落榜了。|The competition was fierce; you didn\'t make it.', null, [], a.i);
      } },
      { id: 'run', n: '参加竞选|Run for Office', i: '🗳️', e: 30, if: function () { var p = G.S.p; return G.C[p.country].dem && p.age >= 21 && (!p.gov || p.gov.track === 'civil') && !(p.origin === 'royal' && !p.flags.exRoyal); }, run: async function (a) {
        var p = G.S.p, L = G.poliLadder(p.country);
        var opts = [0]; if (p.st.fame >= 55 || p.flags.elite || p.flags.redfam) opts.push(1);
        var i = await G.UI.pick({ title: G.L(a.n), items: opts.map(function (r) { return { t: L.r[r], icon: '🗳️' }; }) });
        if (i < 0) return 'cancel'; if (p.gov) p.gov = null;
        var t = await G.gov.election(G.ctx(), opts[i]);
        return G.result(a.n, t, null, [], a.i);
      } }
    ] },
    { id: 'crime', n: '犯罪|Crime', i: '🦹', items: G.crime.LIST.map(function (c) {
      return { id: 'cr_' + c.id, n: c.n, i: c.i, e: 15, a: [c.a, 90], if: function () { return (!c.y0 || G.S.year >= c.y0) && (!c.biz || G.S.assets.company || (G.S.p.job && G.S.p.job.sal > G.$w(80000))); }, run: function () { return G.crime.commit(c); } };
    }).concat([
      { id: 'joingang', n: '加入帮派|Join a Gang', i: '🐉', e: 20, if: function () { return !G.S.p.gang; }, lock: function () { return G.gang.can() ? null : G.L('需15岁以上，且不在军警政体系内|Requires age 15+, not in military/police/government'); }, run: async function (a) {
        var name = G.S.p.flags.mafiaName || G.pick(G.GANG.names);
        if (G.S.p.flags.mafiafam) { G.gang.join(name); return G.result(a.n, '你接手了家族的生意。|You took over the family business.', null, [], a.i); }
        var r = await G.UI.game('fight', { name: G.L('拜码头|Initiation') });
        if (r.score > .35 || G.S.p.h.rep > 20) { G.gang.join(name); return G.result(a.n, '你通过了考验，加入了{g}。|You passed the test and joined {g}.', { g: name }, [], a.i); }
        return G.result(a.n, '他们看不上你。|They didn\'t think you had what it takes.', null, [], a.i);
      } },
      { id: 'bribe', n: '贿赂官员消灾|Bribe an Official', i: '💵', e: 10, if: function () { return G.S.p.h.heat > 10; }, run: function (a) { var cost = G.$(5000) + Math.round(G.S.p.h.heat * G.$(300)); if (!G.pay(cost)) return quick(a, '钱不够。|Not enough money.', {}); if (G.ch(.7)) { G.S.p.h.heat = Math.max(0, G.S.p.h.heat - 40); return quick(a, '花了{m}，风声小多了。|{m} later, things have quieted down.', { karma: -4 }, { m: G.M(cost) }); } G.S.p.h.heat += 20; return quick(a, '行贿被举报了！|The bribe was reported!', { karma: -4 }); } }
    ]) },
    { id: 'move', n: '搬家·移民|Move & Emigrate', i: '🧳', items: [
      { id: 'movecity', n: '搬到其他城市|Move to Another City', i: '🏙️', e: 20, $: 1500, a: [18, 100], run: async function (a) {
        var p = G.S.p, cc = G.C[p.country], tiers = [1, 2, 3, 4, 5];
        var i = await G.UI.pick({ title: G.L(a.n), items: tiers.map(function (t) { return { t: G.tierName(p.country, t), sub: cc.cities[t].slice(0, 3).map(G.T).join(' · '), icon: '🏙️' }; }) });
        if (i < 0) return 'cancel'; var t = tiers[i], city = G.pick(cc.cities[t]);
        p.tier = t; p.city = city; G.S.assets.houses.forEach(function (h) { if (h.live) h.live = false; }); p.home = 'rent';
        if (p.job && !G.JOB[p.job.id].pt && G.ch(.6)) { G.career.leave(); G.log('搬家后你辞掉了原来的工作。|You quit your old job after the move.'); }
        G.major('搬到了{c}|Moved to {c}', { c: city });
        return quick(a, '你搬到了{c}。|You moved to {c}.', { happy: 4 }, { c: city });
      } },
      { id: 'emigrate', n: '移民|Emigrate', i: '🛂', e: 30, a: [18, 90], run: async function (a) {
        var p = G.S.p, cs = G.CLIST.filter(function (x) { return x !== p.country && !(G.sensitive && G.sensitive() && G.isRival(p.country, x)); });
        var i = await G.UI.pick({ title: G.L('目的地|Destination'), items: cs.map(function (c) { return { t: G.C[c].n, icon: G.C[c].flag, sub: p.langs.indexOf(G.C[c].lang) >= 0 ? G.L('会说当地语言|Speaks the language') : '' }; }) });
        if (i < 0) return 'cancel'; var to = cs[i];
        var sp = N.spouse(), mlist = [
          { t: G.L('工作签证（需本科、有一技之长）|Skilled-worker visa (degree required)'), ch: p.edu.deg >= 4 ? .25 + p.st.smarts / 300 + (G.has('polyglot') ? .15 : 0) + (p.langs.indexOf(G.C[to].lang) >= 0 ? .15 : 0) : 0 },
          { t: G.L('投资移民（{m}）|Investor visa ({m})', { m: G.M(G.$(1000000)) }), ch: G.netWorth() >= G.$(1000000) ? .85 : 0, cost: G.$(1000000) },
          { t: G.L('配偶移民|Spousal visa'), ch: sp && sp.c === to ? .9 : 0 },
          { t: G.L('偷渡（违法）|Smuggled in (illegal)'), ch: .45, ill: 1, cost: G.$(15000) }
        ];
        var j = await G.UI.pick({ title: G.L('移民方式|Method'), items: mlist.map(function (m) { return { t: m.t, sub: m.ch ? G.L('成功率约{x}%|~{x}% chance', { x: Math.round(m.ch * 100) }) : G.L('不符合条件|Not eligible'), dis: !m.ch || (m.cost && p.money < m.cost), icon: '🛂' }; }) });
        if (j < 0) return 'cancel'; var m = mlist[j];
        if (m.cost && !G.pay(m.cost)) return 'cancel';
        if (m.cost && j === 1) { G.S.assets.inv.bond = (G.S.assets.inv.bond || 0) + m.cost; }
        if (G.ch(m.ch)) {
          G.money.emigrate(to);
          if (m.ill) { G.S.p.flags.illegal = 1; G.addStat('heat', 20); }
          return G.result(a.n, '你移民到了{c}，开始新的生活！|You emigrated to {c} and began a new life!', { c: G.C[to].n }, [], G.C[to].flag);
        }
        if (m.ill && G.ch(.5)) { var t = await G.crime.arrest(G.ctx(), '偷渡|Illegal border crossing', 2); return G.result(a.n, t, null, [], '🚔'); }
        return G.result(a.n, '你的申请被拒绝了。|Your application was denied.', null, [], '🛂');
      } }
    ] }
  ];

  /* gambling flow with bet */
  G.gambleFlow = async function (a, game, mult) {
    var p = G.S.p, legal = G.C[p.country].gamble || p.flags.vegas === G.S.year || game === 'mahjong';
    var bets = [50, 500, 5000, 50000].map(function (b) { return Math.round(G.$(b) * (mult || 1)); });
    var i = await G.UI.pick({ title: G.L(a.n), text: G.L('现金：{m}{w}|Cash: {m}{w}', { m: G.M(p.money), w: legal ? '' : G.L('（地下赌场，违法）|(underground — illegal)') }), items: bets.map(function (b) { return { t: G.L('下注 {m}|Bet {m}', { m: G.M(b) }), icon: '🪙', dis: p.money < b }; }) });
    if (i < 0) return 'cancel';
    var bet = bets[i]; if (!G.pay(bet)) return 'cancel';
    var r = await G.UI.game(game, { name: a.n, bet: bet });
    var payout = Math.round(bet * (r.mult || (r.win ? 2 : 0)));
    G.addMoney(payout);
    G.S.p.hab.gamble = G.clamp(G.S.p.hab.gamble + 6, 0, 100);
    G.inc('gambles');
    G.dStart(); G.addStat('happy', payout > bet ? 6 : -4); if (!legal) G.addStat('heat', 5); var dl = G.dEnd();
    dl.unshift({ k: 'money', n: payout - bet });
    return G.result(a.n, payout > bet ? '你赢了{m}！|You won {m}!' : payout === bet ? '不输不赢。|You broke even.' : '你输了{m}。|You lost {m}.', { m: G.M(Math.abs(payout - bet)) }, dl, a.i);
  };
})();
