/* Version 3.3 — the end-of-life page has more to say.
   Collected here at the moment of death (the UI draws it in ui11.js):
   - a photo album: you at 1, 8, 18, 30, 50 and at the end
   - highlights: the firsts and the big moments of this particular life
   - what the people in your life said about you, in their own voice and according to how they really felt
   - your life in a curve (wealth and happiness by age), records ("richest at 52", "saddest at 34")
   - life in numbers, three keywords, and what you might do differently
   Generic verdicts like "your greatest achievement was your children" now name the children and what became of them. */
(function () {
  'use strict';
  var N = G.N;
  function S() { return G.S; }
  function zh(x) { return String(x || '').split('|')[0]; }
  function nm(n) { return n ? n.name : ''; }

  /* ---------- a yearly snapshot, for curves and records ---------- */
  var mt = G.money.tick;
  G.money.tick = function () {
    var r = mt.apply(this, arguments), s = S(), p = s && s.p;
    try {
      if (p && !s.dead) {
        var yh = s.yh = s.yh || [];
        var last = yh[yh.length - 1];
        if (!last || last.a !== p.age) yh.push({ a: p.age, y: s.year, nw: Math.round(G.netWorth()), hp: Math.round(p.st.happy), hl: Math.round(p.st.health), fm: Math.round(p.st.fame || 0) });
        if (yh.length > 130) yh.shift();
      }
    } catch (e) { }
    return r;
  };

  /* ---------- highlights from the timeline ---------- */
  var HL = [
    ['💘', '初恋|First love', /在一起|成了恋人|确定了关系|became a couple|started dating/],
    ['💍', '结婚|Wedding', /结婚|婚礼|married|wedding/],
    ['👶', '第一个孩子|First child', /出生了|was born|领养了|adopted/],
    ['🎓', '毕业|Graduation', /毕业|graduat|录取|admitted/],
    ['💼', '第一份工作|First job', /入职|成为了|加入了|got a job|hired|became a/],
    ['🏠', '第一套房|First home', /买下|买了.*房|bought a (house|home|flat)/],
    ['🏢', '创业|Founding a company', /创立|创办|成立了.*公司|founded/],
    ['✈️', '远走他乡|Moving abroad', /移民|搬到了|emigrat|moved to/],
    ['⛓️', '入狱|Prison', /入狱|判处|判了|sentenced|prison/],
    ['🏆', '高光|A triumph', /冠军|获奖|拿了.*奖|当选|晋升|升任|won|elected|promoted/],
    ['💔', '失去|A loss', /去世|离世|passed away|died/],
    ['🌅', '退休|Retirement', /退休|retire/]
  ];
  function highlights(d) {
    var out = [], used = {};
    (d.timeline || []).forEach(function (x) {
      var t = String(x.t || '');
      for (var i = 0; i < HL.length; i++) { if (!used[i] && HL[i][2].test(t)) { used[i] = 1; out.push({ i: HL[i][0], k: HL[i][1], a: x.a, t: x.t }); break; } }
    });
    return out.sort(function (a, b) { return a.a - b.a; }).slice(0, 8);
  }

  /* ---------- what people said ---------- */
  var SAY = {
    spouse: [[80, ['和你在一起的每一年，我都觉得自己很幸运。|Every year with you, I felt lucky.', '你走了以后，家里的灯我还是会给你留一盏。|Since you\'ve gone I still leave a light on for you.']], [50, ['你不是完美的伴侣，但你一直都在。|You weren\'t a perfect partner, but you were always there.', '吵了一辈子，也爱了一辈子。|We argued all our lives, and loved all our lives.']], [0, ['我们能走到最后，靠的是习惯。|We made it to the end out of habit.', '有些话，我到最后也没跟你说。|Some things I never told you, even at the end.']]],
    child: [[80, ['我想成为像你一样的人。|I want to be someone like you.', '小时候你牵着我，后来我牵着你。我都记得。|You held my hand when I was small; later I held yours. I remember it all.']], [50, ['你很少说爱我，但我都知道。|You rarely said you loved me, but I knew.', '你给我的，比我小时候以为的多。|You gave me more than I understood as a child.']], [0, ['我花了很多年，才学会原谅你。|It took me years to learn to forgive you.', '我们之间，有太多没说出口的话。|Too much went unsaid between us.']]],
    friend: [[75, ['认识你，是我这辈子最好的运气之一。|Meeting you was one of the luckiest things in my life.', '你欠我的那顿饭，下辈子记得还。|You still owe me dinner. Pay up next life.']], [0, ['我们后来联系少了，但我一直记得你。|We lost touch later, but I never forgot you.']]],
    parent: [[70, ['我的孩子，你做得比我们好。|My child, you did better than we did.']], [0, ['你从小就倔，长大了更倔。|You were stubborn as a child and worse as an adult.']]],
    rival: [[0, ['说实话，你的葬礼我也来了。|Honestly? I came to your funeral too.', '我这辈子最大的对手走了，突然有点无聊。|My greatest rival is gone. Life feels a bit dull.']]]
  };
  function say(kind, aff, seed) { var L = SAY[kind]; for (var i = 0; i < L.length; i++) if (aff >= L[i][0]) return L[i][1][seed % L[i][1].length]; return ''; }
  function voices(p) {
    var out = [], seed = G.hash ? G.hash(p.name) : 7;
    var sp = N.all(function (n) { return n.rel === 'spouse' || n.id === p.partner; })[0];
    if (sp) out.push({ who: sp, r: '伴侣|Partner', t: say('spouse', Math.max(sp.aff || 0, sp.love || 0), seed) });
    var kids = N.all(function (n) { return n.rel === 'child' && n.alive; }).sort(function (a, b) { return (b.aff || 0) - (a.aff || 0); });
    if (kids.length) out.push({ who: kids[0], r: '子女|Child', t: say('child', kids[0].aff || 0, seed + 1) });
    if (kids.length > 1) out.push({ who: kids[kids.length - 1], r: '子女|Child', t: say('child', kids[kids.length - 1].aff || 0, seed + 2) });
    var fr = N.all(function (n) { return (n.rel === 'friend' || n.rel === 'bff') && n.alive; }).sort(function (a, b) { return (b.aff || 0) - (a.aff || 0); })[0];
    if (fr) out.push({ who: fr, r: '朋友|Friend', t: say('friend', fr.aff || 0, seed + 3) });
    var par = N.all(function (n) { return (n.rel === 'father' || n.rel === 'mother') && n.alive; })[0];
    if (par) out.push({ who: par, r: '父母|Parent', t: say('parent', par.aff || 0, seed + 4) });
    var en = N.all(function (n) { return n.alive && n.rel !== 'child' && (n.aff || 50) < 12 && n.met; })[0];
    if (en) out.push({ who: en, r: '对头|Rival', t: say('rival', 0, seed + 5) });
    return out.slice(0, 5).map(function (v) { return { name: v.who.name, r: v.r, t: v.t, av: v.who.av, g: v.who.g, age: N.age(v.who), looks: v.who.looks, skin: v.who.skin, c: v.who.c }; });
  }

  /* ---------- records, numbers, keywords, regrets ---------- */
  function records(s) {
    var yh = s.yh || []; if (yh.length < 3) return [];
    function best(k, dir) { return yh.reduce(function (a, b) { return (dir > 0 ? b[k] > a[k] : b[k] < a[k]) ? b : a; }); }
    var rich = best('nw', 1), poor = best('nw', -1), happy = best('hp', 1), sad = best('hp', -1), famous = best('fm', 1);
    var out = [
      { i: '💰', t: G.L('{a}岁那年最富有|Richest at {a}', { a: rich.a }), s: G.fm(rich.nw) },
      { i: '🪙', t: G.L('{a}岁那年最拮据|Poorest at {a}', { a: poor.a }), s: G.fm(poor.nw) },
      { i: '😄', t: G.L('{a}岁那年最快乐|Happiest at {a}', { a: happy.a }), s: happy.hp + '%' },
      { i: '🌧️', t: G.L('{a}岁那年最难熬|Hardest year: {a}', { a: sad.a }), s: sad.hp + '%' }
    ];
    if (famous.fm >= 30) out.push({ i: '🌟', t: G.L('{a}岁时最出名|Most famous at {a}', { a: famous.a }), s: famous.fm + '%' });
    return out;
  }
  function numbers(s, p) {
    var c = s.cnt || {}, L = [];
    function add(i, v, t) { if (v) L.push({ i: i, v: v, t: t }); }
    add('💞', c.lovers, '段恋爱|romances');
    add('💼', c.jobs, '份工作|jobs');
    add('👶', N.all(function (n) { return n.rel === 'child'; }).length, '个孩子|children');
    add('👫', N.all(function (n) { return n.rel === 'friend' || n.rel === 'bff'; }).length, '个朋友|friends');
    add('✈️', c.travel, '次旅行|trips');
    add('🐾', c.pets, '只宠物|pets');
    add('🏠', c.houses, '套房子|homes');
    add('🚗', c.cars, '辆车|cars');
    add('🏢', c.founded, '家公司|companies');
    add('⛓️', c.jailYrs, '年铁窗|years inside');
    add('📖', Object.keys(s.done || {}).length, '段经历|experiences');
    return L.slice(0, 9);
  }
  function keywords(p, s, d) {
    var st = p.st, h = p.h || {}, c = s.cnt || {}, K = [];
    if (st.happy >= 75) K.push('乐天|Cheerful'); if (st.smarts >= 80) K.push('聪明|Brilliant'); if (st.looks >= 80) K.push('好看|Good-looking');
    if (st.eq >= 80) K.push('会做人|Socially gifted'); if ((h.karma || 0) >= 40) K.push('善良|Kind'); if ((h.karma || 0) <= -30) K.push('狠|Ruthless');
    if (G.netWorth() >= G.$(1e7)) K.push('有钱|Wealthy'); if ((c.lovers || 0) >= 6) K.push('多情|Romantic'); if ((c.travel || 0) >= 6) K.push('爱远行|Wanderer');
    if (N.all(function (n) { return n.rel === 'child'; }).length >= 3) K.push('顾家|Family-minded'); if ((c.jail || 0) >= 1) K.push('坐过牢|Ex-con');
    if (p.flags && p.flags.spyH) K.push('有秘密|Secretive'); if ((st.fame || 0) >= 60) K.push('有名|Famous'); if (p.age >= 90) K.push('长寿|Long-lived');
    if ((c.founded || 0) >= 1) K.push('敢闯|Bold'); if (st.health < 30) K.push('多病|Frail');
    if (!K.length) K.push('平凡|Ordinary', '踏实|Steady');
    var seed = G.hash ? G.hash(p.name) : 3; while (K.length > 3) K.splice(seed++ % K.length, 1);
    return K;
  }
  function regrets(p, s) {
    var c = s.cnt || {}, R = [];
    if (!(c.travel || 0) && !(c.emigrate || 0)) R.push('多出去走走。你这一辈子，几乎没离开过家门口。|See more of the world. You barely left your doorstep.');
    if (!N.all(function (n) { return n.rel === 'spouse' || n.rel === 'lover'; }).length && !(c.lovers || 0)) R.push('勇敢一点去爱一个人。|Be brave enough to love someone.');
    var kids = N.all(function (n) { return n.rel === 'child'; });
    if (kids.length && kids.reduce(function (a, k) { return a + (k.aff || 0); }, 0) / kids.length < 40) R.push('多陪陪孩子。他们长大得比你想的快。|Spend more time with the children. They grow up faster than you think.');
    if ((p.hab && p.hab.smoke > 40) || (p.hab && p.hab.drink > 40)) R.push('早点戒烟戒酒。|Quit smoking and drinking sooner.');
    if (G.netWorth() < 0) R.push('别借那么多钱。|Don\'t borrow so much.');
    if (p.age < 50) R.push('慢一点，好好照顾自己。|Slow down and look after yourself.');
    if ((c.jobs || 0) <= 1 && p.age > 50) R.push('换个工作试试，世界很大。|Try another job. The world is big.');
    if (!R.length) R.push('没什么要改的。这一生，值了。|Nothing to change. It was worth it.');
    return R.slice(0, 3);
  }
  function album(p) {
    var ages = [1, 8, 18, 30, 50, 70].filter(function (a) { return a < p.age - 2; });
    ages.push(p.age);
    return ages.map(function (a) { return { a: a, svg: G.avatar ? G.avatar({ seed: p.avSeed != null ? p.avSeed : (G.hash ? G.hash(p.name + p.birthYear) : 7), age: a, g: p.g, looks: p.st.looks, skin: p.skin, happy: 60, cul: p.cul || p.country }) : '' }; });
  }
  function kidsLine() {
    var K = N.all(function (n) { return n.rel === 'child'; });
    if (!K.length) return '';
    return G.join(K.slice(0, 5).map(function (k) { var j = k.job ? (typeof k.job === 'string' ? k.job : (k.job.n || '')) : ''; return G.L('{n}{j}|{n}{j}', { n: k.name, j: j ? G.L('（{j}）| ({j})', { j: j }) : '' }); }), '、', ', ');
  }

  var cmp = G.ending.compute;
  G.ending.compute = function () {
    var d = cmp.apply(this, arguments), s = S(), p = s.p;
    try {
      // the vague "children were your greatest achievement" names the children
      if (/最大的成就|greatest achievement/.test(String(d.td || '')) || zh(d.title) === '教子有方') {
        var kl = kidsLine(); if (kl) d.td = G.L('你的孩子们：{k}。他们是你留给这个世界最好的东西。|Your children: {k}. The best thing you left the world.', { k: kl });
      }
      d.v3 = { album: album(p), hl: highlights(d), voices: voices(p), rec: records(s), num: numbers(s, p), kw: keywords(p, s, d), reg: regrets(p, s), yh: (s.yh || []).slice() };
    } catch (e) { console.error(e); }
    return d;
  };
})();
