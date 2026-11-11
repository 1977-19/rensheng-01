/* Actions available on an NPC's profile */
(function () {
  'use strict';
  var N = G.N;
  function res(title, text, prm, dl, icon) { return G.result(title, text, prm, dl || [], icon); }
  function wrap(fn) { return async function (n, a) { G.dStart(); var r = await fn(n, a); var dl = G.dEnd(); if (r && r.t) return res(a.n, r.t, Object.assign({ n: n.name }, r.p || {}), dl.concat(r.d || []), a.i); }; }
  function isRom(n) { return n.rel === 'lover' || n.rel === 'spouse' || n.rel === 'affair'; }
  G.npcActs = function (n) {
    var S = G.S, p = S.p, a = N.age(n), out = [];
    if (!n.alive) return [];
    var fam = N.family[n.rel];
    out.push({ id: 'chat', n: '聊天|Chat', i: '💬', e: 0, run: function () { return G.UI.chat(n); } });
    out.push({ id: 'time', n: isRom(n) ? '腻在一起|Spend Time Together' : '一起玩/陪伴|Spend Time', i: '🫂', e: 10, run: wrap(function (n) {
      N.touch(n); var d = N.addAff(n, G.ri(4, 9)); if (isRom(n)) N.addLove(n, G.ri(3, 7)); G.addStat('happy', 3);
      var t = fam ? G.pick(['你陪{n}聊了一整个下午。|You spent the whole afternoon talking with {n}.', '你和{n}一起做了顿饭。|You and {n} cooked a meal together.']) : isRom(n) ? G.pick(['你们窝在沙发上看了一晚上剧。|You curled up on the couch and binge-watched shows all night.', '你们手牵手在公园散步。|You strolled through the park hand in hand.']) : G.pick(['你和{n}出去玩了一天。|You and {n} hung out all day.', '你和{n}一起打了一下午游戏。|You played games with {n} all afternoon.']);
      return { t: t };
    }) });
    out.push({ id: 'gift', n: '送礼物|Give a Gift', i: '🎁', e: 0, run: async function (n, a) {
      var gs = G.GIFTS.filter(function (g) { return (!g.y0 || S.year >= g.y0) && (!g.kid || N.age(n) < 14) && !(N.age(n) < 14 && g.v > 600 && !g.kid); });
      var items = gs.map(function (g) { return { t: g.n, sub: G.M(G.$(g.v)), icon: g.i, dis: p.money < G.$(g.v) }; });
      items.push({ t: G.L('红包（现金）|Cash Gift'), sub: G.L('送{m}|Give {m}', { m: G.M(Math.round(Math.max(G.$(100), p.money * .1))) }), icon: '🧧', dis: p.money < G.$(100) });
      var i = await G.UI.pick({ title: G.L(a.n), items: items }); if (i < 0) return 'cancel';
      var val, g = gs[i], like = false;
      if (i === gs.length) { val = Math.round(Math.max(G.$(100), p.money * .1)); G.addMoney(-val); n.wealth += val; }
      else { val = G.$(g.v); if (p.money < val) { G.UI.toast(G.L('钱不够，需要{m}。|Not enough money — you need {m}.', { m: G.M(val) })); return 'cancel'; } G.addMoney(-val); like = g.like && g.like.indexOf(n.pers) >= 0; if (g.old && N.age(n) > 50) like = true; }
      var rel = val / Math.max(G.$(200), (n.wealth || 0) * .02 + G.$(50));
      var gain = G.clamp(3 + Math.log2(rel + 1) * 4, 2, 25) * (like ? 1.6 : 1) * (n.pers === 'gold' ? 1.4 : 1) * (n.pers === 'honest' && val > G.$(5000) ? .5 : 1);
      G.dStart(); N.touch(n); var da = N.addAff(n, gain); var dlv = isRom(n) || N.canRomance(n) ? N.addLove(n, gain * .6) : 0; G.inc('gifts'); var dl = G.dEnd();
      dl.push({ k: 'aff', n: da }); if (dlv) dl.push({ k: 'love', n: dlv });
      if (g && g.id === 'house') { n.wealth += val; }
      return res(a.n, like ? '{n}特别喜欢这份礼物！|{n} absolutely loves it!' : gain > 12 ? '{n}又惊又喜。|{n} is surprised and delighted.' : '{n}收下了礼物，说了声谢谢。|{n} accepted the gift and thanked you.', { n: n.name }, dl, '🎁');
    } });
    if ((fam || isRom(n) || n.aff > 40) && a >= 18 && n.wealth > 0) out.push({ id: 'askmoney', n: '要钱/借钱|Ask for Money', i: '💸', e: 5, run: async function (n, a) {
      var e = G.chat.effects(n, 'money'); N.touch(n);
      if (e.note) { var dl = [{ k: 'aff', n: e.aff }]; return res(a.n, e.note, null, dl, '💸'); }
      return res(a.n, '{n}没有给你钱。|{n} didn\'t give you any money.', { n: n.name }, [{ k: 'aff', n: e.aff }], '💸');
    } });
    if (N.canRomance(n) || isRom(n)) out.push({ id: 'date', n: '约会|Go on a Date', i: '🌹', e: 15, if: function () { return isRom(n) || n.love > 15 || n.rel === 'admirer' || n.rel === 'crush' || n.aff > 30; }, run: async function (n, a) {
      var ds = G.love.DATES.filter(function (d) { return p.age >= 18 || d.p < 200; });
      var i = await G.UI.pick({ title: G.L(a.n), items: ds.map(function (d) { return { t: d.n, sub: d.p ? G.M(G.$(d.p)) : G.L('免费|Free'), icon: '🌹', dis: p.money < G.$(d.p) }; }) });
      if (i < 0) return 'cancel';
      G.dStart(); var g = G.love.date(n, ds[i]); var dl = G.dEnd();
      if (g === null) return res(a.n, '钱不够。|Not enough money.', null, [], '🌹');
      dl.push({ k: 'love', n: Math.round(g) });
      var good = g > 7;
      return res(a.n, good ? G.pick(['约会非常甜蜜，{n}一直在笑。|The date was so sweet; {n} couldn\'t stop smiling.', '你们聊到深夜，舍不得分开。|You talked late into the night, reluctant to part.']) : G.pick(['约会有点尴尬，冷场了好几次。|The date was a bit awkward, with several silences.', '{n}好像心不在焉。|{n} seemed distracted.']), { n: n.name }, dl, '🌹');
    } });
    if (N.canRomance(n) && !isRom(n)) out.push({ id: 'confess', n: '表白|Confess Your Feelings', i: '💘', e: 10, run: async function (n, a) {
      var ok = G.love.confess(n);
      return res(a.n, ok ? '{n}红着脸答应了你！你们在一起了！|{n} blushed and said yes! You\'re together!' : '{n}说：“对不起，我们只适合做朋友。”|{n} said, "Sorry, I think we\'re better as friends."', { n: n.name }, [], '💘');
    } });
    if (n.rel === 'lover' && !n.engaged && p.age >= 18 && a >= 18) out.push({ id: 'propose', n: '求婚|Propose', i: '💍', e: 15, run: async function (n, a) {
      var ok = G.love.propose(n);
      if (!ok) return res(a.n, '{n}犹豫了很久，说还没准备好。|{n} hesitated for a long time and said they weren\'t ready.', { n: n.name }, [], '💍');
      var w = await G.love.marry(n);
      return res(a.n, w ? '{n}答应了！你们结婚了！|{n} said yes! You got married!' : '{n}答应了你的求婚。|{n} accepted your proposal.', { n: n.name }, [], '💍');
    } });
    if (n.rel === 'lover' && n.engaged) out.push({ id: 'wed', n: '举办婚礼|Hold the Wedding', i: '💒', e: 15, run: async function (n, a) { var w = await G.love.marry(n); return res(a.n, w ? '你们结婚了！|You got married!' : '婚礼没办成。|The wedding didn\'t happen.', null, [], '💒'); } });
    if (n.rel === 'spouse' && !n.prenup && N.netWorthScore() > .3) out.push({ id: 'prenup', n: '签婚后财产协议|Sign a Postnup', i: '📑', e: 10, run: wrap(function (n) { if (G.ch(.4 + n.love / 250)) { n.prenup = 1; return { t: '{n}同意签了协议。|{n} agreed to sign.' }; } N.addLove(n, -12); return { t: '{n}很受伤：“你不信任我？”|{n} is hurt: "You don\'t trust me?"' }; }) });
    if (n.rel === 'lover' || n.rel === 'affair') out.push({ id: 'breakup', n: '分手|Break Up', i: '💔', e: 5, run: wrap(function (n) { G.love.breakup(n); return { t: '你和{n}分手了。|You broke up with {n}.' }; }) });
    if (n.rel === 'spouse') out.push({ id: 'divorce', n: '离婚|Divorce', i: '📄', e: 10, run: wrap(function (n) { G.love.divorce(n, false); return { t: '你和{n}离婚了。|You divorced {n}.' }; }) });
    out.push({ id: 'argue', n: '吵架|Argue', i: '😠', e: 5, run: wrap(function (n) { N.touch(n); N.addAff(n, -G.ri(6, 15)); if (isRom(n)) N.addLove(n, -G.ri(4, 10)); G.addStat('happy', G.ri(-6, 2)); return { t: G.pick(['你们大吵一架，摔门而去。|You had a shouting match and stormed out.', '你们为了一点小事争得面红耳赤。|You argued red-faced over something trivial.']) }; }) });
    // children
    if (n.rel === 'child' || n.rel === 'grandchild') {
      if (a >= 6 && a < 18) out.push({ id: 'homework', n: '辅导功课|Help with Homework', i: '✏️', e: 15, run: wrap(function (n) { n.inv = (n.inv || 0) + 1; N.addAff(n, G.ch(.7) ? 3 : -3); N.touch(n); return { t: G.pick(['你耐心地给{n}讲了一晚上题。|You patiently tutored {n} all evening.', '辅导作业辅导到血压飙升。|Helping with homework sent your blood pressure through the roof.']) }; }) });
      if (a >= 4 && a < 18) out.push({ id: 'classes', n: '报兴趣班|Enroll in Classes', i: '🎹', e: 10, $: 1500, run: wrap(function (n) { if (!G.pay(G.$(1500))) return { t: '钱不够。|Not enough money.' }; n.inv = (n.inv || 0) + 2; n.smarts = G.clamp(n.smarts + 2, 0, 100); N.addAff(n, G.ch(.5) ? 2 : -4); return { t: '你给{n}报了钢琴、奥数和英语。|You signed {n} up for piano, math, and English classes.' }; }) });
      if (a >= 3) out.push({ id: 'allow', n: '给零花钱|Give Allowance', i: '🪙', e: 5, run: wrap(function (n) { var m = Math.round(G.$(a < 12 ? 50 : a < 18 ? 300 : 3000)); if (!G.pay(m)) return { t: '你自己都没钱。|You don\'t even have money yourself.' }; n.wealth += m; N.addAff(n, 6); return { t: '{n}拿到{m}，开心地抱住了你。|{n} got {m} and hugged you happily.', p: { m: G.M(m) } }; }) });
      if (a >= 15 && a <= 22 && n.edu && n.edu.stage !== 'uni') out.push({ id: 'abroad', n: '送出国留学|Send to Study Abroad', i: '✈️', e: 10, $: 80000, run: wrap(function (n) { if (!G.payKid(n, G.$(80000))) return { t: '钱不够。|Not enough money.' }; var c = G.pick(['us', 'gb', 'au', 'ca', 'jp']), u = G.pick(G.eduSys(c).u.filter(function (x) { return x.t >= 3; })); n.edu.stage = 'uni'; n.edu.school = u.n; n.edu.tier = u.t; n.edu.deg = 3; n.edu.major = G.pick(G.MAJOR_LIST); N.addAff(n, G.ri(8, 14)); n.visa = n.visa || {}; n.visa[c] = 'study'; n.studyIn = c; return { t: '{n}去{u}读书了。|{n} went off to study at {u}.', p: { u: u.n } }; }) });
      if (a >= 22 && !n.spouseId && n.rel === 'child') out.push({ id: 'setup', n: '给孩子介绍对象|Set Up Your Child', i: '💑', e: 10, run: wrap(function (n) { if (G.ch(.5)) { var sp = N.make({ rel: 'contact', g: n.g === 'm' ? 'f' : 'm', age: a + G.ri(-3, 3), c: n.c }); sp.pin = 1; n.spouseId = sp.id; N.addAff(n, 5); G.addStat('happy', 6); return { t: '{n}和{s}看对眼了，很快就结了婚！|{n} hit it off with {s} and soon got married!', p: { s: sp.name } }; } N.addAff(n, -6); return { t: '{n}嫌你多管闲事。|{n} says you\'re being nosy.' }; }) });
    }
    // parents
    if ((n.rel === 'father' || n.rel === 'mother' || n.rel === 'grand') && p.age >= 18 && a >= 50) out.push({ id: 'support', n: '给生活费|Support Financially', i: '🧧', e: 5, run: wrap(function (n) { var m = Math.round(G.$(2000)); if (!G.pay(m)) return { t: '你自己都没钱。|You don\'t even have money yourself.' }; n.wealth += m; N.addAff(n, 8); G.addStat('karma', 3); return { t: '{n}嘴上说不要，眼里却是笑意。|{n} protested, but their eyes were smiling.' }; }) });
    if (n.rel === 'enemy' || n.rel === 'rival' || n.aff < -30) out.push({ id: 'confront', n: '教训TA|Confront', i: '👊', e: 15, a: [12, 70], run: async function (n, a) { var r = await G.UI.game('fight', { name: a.n }); G.dStart(); G.addStat('heat', 6); G.addStat('karma', -4); if (r.win) { N.addAff(n, -10); G.addStat('rep', 5); } else G.addStat('health', -10); var dl = G.dEnd(); return res(a.n, r.win ? '你狠狠教训了{n}一顿。|You taught {n} a lesson.' : '你反被{n}揍了一顿。|{n} beat you up instead.', { n: n.name }, dl, '👊'); } });
    if (!fam && n.rel !== 'spouse') out.push({ id: 'block', n: '拉黑/断绝来往|Block / Cut Ties', i: '🚫', e: 0, run: async function (n, a) { var i = await G.UI.event({ title: G.L(a.n), text: G.L('确定和{n}断绝来往吗？|Cut ties with {n}?', { n: n.name }), opts: [{ t: G.L('确定|Yes') }, { t: G.L('算了|No') }] }); if (i) return 'cancel'; if (G.S.p.partner === n.id) G.S.p.partner = null; delete G.S.npcs[n.id]; return res(a.n, '你和{n}再也没有联系了。|You never contacted {n} again.', { n: n.name }, [], '🚫'); } });
    return out;
  };
})();
