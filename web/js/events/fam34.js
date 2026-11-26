/* Version 3.5 — family fixes and family drama.
   - Children who serve different countries: a grown child may join the army or the security service of their own
     nationality. When two children (or you and a child) serve rival countries, it comes up on its own: silent
     dinners, security vetting that orders them to cut contact, a stand-off on the news, suspicion of spying, a
     public break — and sometimes, years later, a reconciliation.
   - Cutting ties: a child under 18 can't be disowned (and a minor can't cut off their parents); with an adult
     relative it now takes a court case.
   - IVF is with your partner or on your own (with a donor) — not with a sibling or parent. Adoption still lets
     you choose a relative as co-parent.
   - A very rich family is never short of money in its own stories: events about scraping money together don't
     happen to the children of the ultra-rich, and the "sell a painting to fix the roof" chapters are rewritten.
   - Becoming a spy (cadet or agent) shows you as a spy, not as a "spy family"; continuing as a spy's child no
     longer rewrites the family's origin.
   - The chosen heir is more common and has more of a story; and the ultra-rich get some fun of their own. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function kids() { return N.rel('child').filter(function (k) { return k.alive; }); }
  function age(n) { return N.age(n); }
  function cn(c) { return G.C[c] ? G.C[c].n : c; }
  function aff(k, v) { if (k) G.dPush('aff', N.addAff(k, v)); }
  function q(id, prm) { (S().pendQ = S().pendQ || []).push({ id: id, prm: prm }); }

  /* ================= wealth: who is "very rich" ================= */
  function famW() { try { return G.famWealth ? G.famWealth() : 0; } catch (e) { return 0; } }
  G.ultraRich = function () { var p = P(); return famW() >= G.$(1e9) || G.netWorth() >= G.$(1e9); };
  G.veryRich = function () { var p = P(); return (p.age < 25 ? famW() : Math.max(G.netWorth(), famW() * .3)) >= G.$(5e6); };
  // stories about scraping money together don't happen in a very rich family
  var POOR = /家里没钱|家里穷|交不起|付不起|买不起|凑不齐|凑钱|缺钱|没钱交|借钱|还不起|欠了.{0,4}债|打两份工|省吃俭用|卖掉.{0,6}(画|房子|车|首饰|祖)|维护费|修不起|供不起|穷得/;
  var POORX = { od_debt_collectors: 1, od_debt_fees: 1, od_lottery_broke: 1 };
  function zh(x) { return typeof x === 'string' ? x.split('|')[0] : ''; }
  var el = G.eligible;
  G.eligible = function (d) {
    if (!el.apply(this, arguments)) return false;
    if (d && !d.richOk && (POORX[d.id] || POOR.test(zh(d.title) + zh(d.t))) && G.veryRich()) return false;
    return true;
  };
  // the two "sell a painting to fix the roof" chapters become conflicts a rich family really has
  var oc = G.EV.od_oldmoney_castle;
  if (oc) {
    oc.title = '城堡开放日'; oc.t = '城堡被列为国家保护建筑，政府要求每年开放参观三十天。爸爸觉得这是家族的荣誉，妈妈说她不想让陌生人在自己卧室门口拍照。两个人在长廊里吵了一整个下午，祖先的肖像都在看着。';
    oc.o[0].t = '提议只开放东翼，西翼留给家人'; oc.o[1].t = '站在妈妈这边：一个游客都不放进来';
    var r0 = oc.o[0].run, r1 = oc.o[1].run;
    oc.o[0].run = function (c) { r0.apply(this, arguments); return '游客们排队参观东翼的长廊和花园，西翼的门上挂着一块牌子：“私人住宅，请勿打扰”。爸妈都满意了，你还在游客里交到了一个朋友。'; };
    oc.o[1].run = function (c) { r1.apply(this, arguments); return '家族律师和政府谈了半年，最后交了一笔不小的罚款，城堡继续关着门。那一年冬天，长廊里只有你们一家人的脚步声。'; };
  }
  var ns = G.EV.od_noble_estate_sale;
  if (ns) {
    ns.title = '庄园里的酒店'; ns.t = '一家国际酒店集团想租下庄园的东翼改成精品酒店，出价高得离谱。爸爸觉得这能让庄园“活起来”，妈妈说那是祖宗的地方，不能让外人住进来。';
    ns.o[0].t = '提议把庄园向公众开放参观，而不是开酒店'; ns.o[1].t = '说：“租吧，反正我们也住不了那么多房间”';
    var n1 = ns.o[1].run; ns.o[1].run = function (c) { n1.apply(this, arguments); return '东翼变成了酒店。妈妈从此不再去东边的花园散步，家里的冷战持续了一整年。'; };
  }

  /* ================= identity: a spy is a spy, the family stays the family ================= */
  var idf = G.identity;
  G.identity = function () {
    var p = P(), id = idf.apply(this, arguments);
    if (id === 'spyfam') {
      if (p.spy) return 'spy';
      if (p.origin !== 'spyfam') { var sf = p.flags.spyfam; p.flags.spyfam = 0; try { id = idf.apply(this, arguments); } finally { p.flags.spyfam = sf; } }
    }
    return id;
  };
  var rb = G.life.rebirthAs;
  if (rb) G.life.rebirthAs = function (kid) {
    var old = P(), org = old.origin, r = rb.apply(this, arguments), p = P();
    if (p.origin === 'spyfam' && org && org !== 'spyfam') p.origin = org;
    return r;
  };

  /* ================= cutting ties: never a minor, adults through the courts ================= */
  var acts = G.npcActs;
  G.npcActs = function (n) {
    var out = acts.apply(this, arguments) || [], p = P();
    var minor = n && ((n.rel === 'child' && age(n) < 18) || ((n.rel === 'father' || n.rel === 'mother') && p.age < 18));
    out = out.filter(function (a) { return !(minor && (a.id === 'cutfam' || a.id === 'k_disown' || a.id === 'block')); });
    out.forEach(function (a) {
      if (a.id !== 'cutfam' || a._court) return; a._court = 1;
      a.n = '起诉断绝关系|Sue to Cut Ties';
      a.run = async function (n2, a2) {
        var fee = G.$(G.ri(3, 12) * 1000);
        var i = await G.UI.event({ title: G.L(a2.n), text: G.L('法律上，亲属关系不能单方面说断就断。你需要向法院起诉，请律师、出庭，费用大约{m}，而且结果不一定如你所愿。|By law you can\'t simply declare a family tie ended. You must sue: a lawyer, a hearing, about {m} — and the court may not agree.', { m: G.M(fee) }), opts: [{ t: G.L('起诉|File the suit') }, { t: G.L('算了|Never mind') }] });
        if (i !== 0) return 'cancel';
        if (!G.pay(fee)) { G.UI.toast(G.L('钱不够|Not enough money')); return 'cancel'; }
        G.dStart(); G.addStat('stress', 10);
        var won = G.ch(.6 + (n.aff < 20 ? .15 : 0) - (n.rel === 'father' || n.rel === 'mother' ? .1 : 0));
        if (won) { n.cut = S().year; n.aff = -100; n.pin = 0; G.addStat('happy', -4); G.major('法院判决与{n}解除往来|Court ended ties with {n}', { n: n.name }); }
        else { G.dPush('aff', N.addAff(n, -20)); }
        var dl = G.dEnd();
        return G.result(a2.n, won ? '开了三次庭，法官最后支持了你的请求：从此你和{n}在法律上互不往来，对方不得再来找你。|Three hearings later the judge granted it: you and {n} are legally estranged; they may not contact you.' : '法官驳回了起诉，建议你们先去调解。走出法院时，{n}看了你一眼，什么也没说。|The judge dismissed the suit and ordered mediation. Leaving court, {n} looked at you and said nothing.', { n: n.name }, dl, '⚖️');
      };
    });
    return out;
  };

  /* ================= IVF: your partner or a donor, never a relative ================= */
  var pick0 = G.pickCoParent;
  if (pick0) G.pickCoParent = async function (title, solo, partnerOnly) {
    if (!partnerOnly) return pick0.apply(this, arguments);
    var pt = N.partner(), items = [{ t: G.L(solo || '我一个人|Just me'), icon: '🙋', v: null }];
    if (pt && pt.alive) items.push({ t: G.L('和{n}一起（伴侣）|With {n} (partner)', { n: pt.name }), icon: '💞', v: pt });
    var i = await G.UI.pick({ title: G.L(title), text: G.L('试管婴儿只能和伴侣一起，或者你一个人（使用捐赠者）。|IVF is with your partner, or on your own with a donor.'), items: items });
    return i < 0 ? 'cancel' : items[i].v;
  };
  G.ACT_CATS.forEach(function (c) { c.items.forEach(function (a) {
    if (a.id !== 'ivf' || a._p) return; a._p = 1; var r = a.run;
    a.run = async function () { var pk = G.pickCoParent; G.pickCoParent = function (t, s) { return pk(t, s, true); }; try { return await r.apply(this, arguments); } finally { G.pickCoParent = pk; } };
  }); });

  /* ================= children in uniform, for different countries ================= */
  var mt = G.money.tick;
  G.money.tick = function () {
    var r = mt.apply(this, arguments), s = S(), p = s.p;
    try {
      if (!s.dead && !p.jail) {
        var mil = !!(p.mil || p.spy || p.pol || p.flags.spyH || ['military', 'red', 'spyfam', 'police'].indexOf(p.origin) >= 0);
        kids().forEach(function (k) {
          var a = age(k);
          if (!k.svc && !k.cut && a >= 18 && a <= 32 && G.ch(mil ? .07 : .03)) {
            var t = G.ch(.6) ? 'army' : 'intel', c = k.c || p.country;
            k.svc = { t: t, c: c, y: s.year };
            k.job = t === 'army' ? G.L('{c}军官|Officer, {c} armed forces', { c: cn(c) }) : G.L('{c}国家安全部门（工作保密）|{c} security service (classified)', { c: cn(c) });
            q('k34_enlist', { kid: k.id });
          }
        });
        // rival service: two children, or you and a child, serving different countries
        var serv = kids().filter(function (k) { return k.svc && !k.cut; });
        var me = p.mil ? p.country : p.spy ? p.spy.ag : (p.gov && p.gov.rank >= 2) ? p.country : null;
        var pairs = [];
        for (var i = 0; i < serv.length; i++) for (var j = i + 1; j < serv.length; j++) if (serv[i].svc.c !== serv[j].svc.c) pairs.push([serv[i], serv[j]]);
        var vsMe = me ? serv.filter(function (k) { return k.svc.c !== me; }) : [];
        var fl = p.flags.k34 = p.flags.k34 || { y: 0, n: 0 };
        if ((pairs.length || vsMe.length) && s.year - fl.y >= 2 && G.ch(.6)) {
          fl.y = s.year; fl.n++;
          if (pairs.length && (!vsMe.length || G.ch(.6))) {
            var pr = G.pick(pairs), stage = pr[0].rivalN = Math.max(pr[0].rivalN || 0, pr[1].rivalN || 0) + 1; pr[1].rivalN = stage;
            var ids = ['k34_dinner', 'k34_vetting', 'k34_suspect', 'k34_standoff', 'k34_sever', 'k34_peace'];
            var id = pr[0].sev === pr[1].id ? (s.year - (pr[0].sevY || 0) >= 6 ? 'k34_peace' : null) : ids[Math.min(stage - 1, 4)];
            if (id) q(id, { a: pr[0].id, b: pr[1].id });
          } else if (vsMe.length) {
            var k = G.pick(vsMe); k.vsMeN = (k.vsMeN || 0) + 1;
            q(k.vsMeN >= 3 && !k.estranged ? 'k34_cut_me' : 'k34_vs_me', { kid: k.id });
          }
        }
      }
    } catch (e) { console.error(e); }
    return r;
  };
  var rn = N.relName;
  N.relName = function (n) { var t = rn.apply(this, arguments); if (n && n.estranged && n.rel === 'child') t = G.join([t, '（已断绝往来）|(estranged)'], '', ' '); return t; };

  function sys(id, title, icon, t, o, ex) { return Object.assign({ id: id, sys: 1, noGate: 1, title: title, icon: icon, t: t, o: o }, ex || {}); }
  function K(c, k) { return S().npcs[c.prm[k]]; }
  function prep2(c) { var a = K(c, 'a'), b = K(c, 'b'); if (!a || !b || !a.alive || !b.alive) return false; c.prm.an = a.name; c.prm.bn = b.name; c.prm.ac = cn(a.svc.c); c.prm.bc = cn(b.svc.c); }
  function prep1(c) { var k = K(c, 'kid'); if (!k || !k.alive) return false; c.prm.kn = k.name; c.prm.kc = cn(k.svc ? k.svc.c : k.c); c.prm.kt = k.svc && k.svc.t === 'intel' ? G.L('国家安全部门|security service') : G.L('军队|armed forces'); }
  G.evs([
    sys('k34_enlist', '{kn}穿上了制服|{kn} in Uniform', '🎖️', '{kn}告诉你：ta加入了{kc}的{kt}。“以后有些事，我不能跟家里说了。”|{kn} tells you they have joined the {kc} {kt}. "From now on there are things I can\'t tell the family."', [
      { t: '为ta骄傲|Be proud of them', run: function (c) { aff(K(c, 'kid'), 6); H.fx(c, { happy: 4 }); return '你把ta穿制服的照片设成了手机屏保。|You made their photo in uniform your phone wallpaper.'; } },
      { t: '担心：“一定要注意安全。”|Worry: "Please be careful."', run: function (c) { aff(K(c, 'kid'), 3); H.fx(c, { stress: 4, happy: -1 }); return 'ta抱了抱你：“放心，我会的。”|They hugged you: "Don\'t worry. I will."'; } }
    ], { prep: prep1 }),
    sys('k34_dinner', '沉默的年夜饭|The Silent Dinner', '🥟', '过年了，{an}和{bn}都回了家。一个在{ac}服役，一个在{bc}服役。饭桌上谁都不敢问对方最近在忙什么，电视里正好在播两国的新闻。|New Year: {an} and {bn} are both home. One serves {ac}, the other {bc}. Nobody dares ask the other what they\'ve been doing, and the TV happens to be on the news about both countries.', [
      { t: '把电视关了：“今天只谈家里的事。”|Turn the TV off: "Tonight we only talk family."', run: function (c) { aff(K(c, 'a'), 4); aff(K(c, 'b'), 4); H.fx(c, { happy: 4 }); return '你们聊了小时候的糗事，笑到后半夜。谁都没有提工作。|You talked about embarrassing childhood stories and laughed till late. Nobody mentioned work.'; } },
      { t: '让他们各自说说自己的国家|Let each talk about their country', run: function (c) { aff(K(c, 'a'), -3); aff(K(c, 'b'), -3); H.fx(c, { stress: 6 }); return '说着说着就吵了起来，一个摔了筷子，一个提前回了部队。|It turned into a row. One slammed down the chopsticks, the other went back to base early.'; } }
    ], { prep: prep2 }),
    sys('k34_vetting', '背景审查|Security Vetting', '🗂️', '{an}的单位做背景审查，发现ta的亲兄弟姐妹{bn}在{bc}的军队/安全部门服役。单位给了ta两个选择：断绝和{bn}的一切联系，或者调离核心岗位。|{an}\'s unit runs a vetting check and finds their sibling {bn} serves {bc}. Two options: cut all contact with {bn}, or be moved off the core post.', [
      { t: '劝{an}：“家人比岗位重要。”|Tell {an}: "Family matters more than the post."', run: function (c) { var a = K(c, 'a'); aff(a, -2); a.job = G.L('{c}后勤部门|Logistics, {c} service', { c: c.prm.ac }); return '{an}被调去了后勤。ta说：“我不后悔，但别让我再说一遍。”|{an} was moved to logistics. "I don\'t regret it. Don\'t make me say it twice."'; } },
      { t: '“这是ta自己的决定。”|"It\'s their decision."', run: function (c) { var a = K(c, 'a'), b = K(c, 'b'); a.sev = b.id; a.sevY = S().year; aff(b, -4); H.fx(c, { stress: 6 }); return '{an}签了那份承诺书，删掉了{bn}的所有联系方式。{bn}知道以后，给你打了一个很长的电话，一直在哭。|{an} signed the pledge and deleted every way of reaching {bn}. When {bn} found out, they called you and cried for a long time.'; } }
    ], { prep: prep2 }),
    sys('k34_suspect', '谁在套谁的话|Who\'s Pumping Whom?', '🕵️', '{bn}私下问你：“{an}最近在哪儿？做什么？”第二天，{an}也来问你同样的问题。你突然意识到，他们可能都在执行任务。|{bn} quietly asks you: "Where is {an} these days? What are they doing?" The next day {an} asks you the same about {bn}. It dawns on you that they may both be on assignment.', [
      { t: '两边都说“不知道”|Tell both "I don\'t know"', run: function (c) { H.fx(c, { eq: 3, stress: 4 }); return '你成了家里最会保守秘密的人。|You became the best secret-keeper in the family.'; } },
      { t: '当着两个人的面把话挑明|Call it out with both of them in the room', run: function (c) { aff(K(c, 'a'), 2); aff(K(c, 'b'), 2); H.fx(c, { happy: 3 }); return '两个人都愣住了，然后同时笑了：“妈/爸，你比我们单位的人还厉害。”|They froze, then laughed at the same time: "You\'re sharper than anyone at work."'; } },
      { t: '把{an}的行踪告诉{bn}|Tell {bn} where {an} is', run: function (c) { aff(K(c, 'a'), -15); aff(K(c, 'b'), 5); H.fx(c, { karma: -8, stress: 8 }); return '三个月后，{an}的一次任务失败了。ta再也没有回过家。|Three months later one of {an}\'s missions failed. They never came home again.'; } }
    ], { prep: prep2 }),
    sys('k34_standoff', '新闻里的对峙|A Stand-off on the News', '📺', '电视新闻：{ac}和{bc}在边境发生对峙。画面一闪而过，你好像在两边的队伍里，各看到了一张熟悉的脸。|On the news: a stand-off between {ac} and {bc} at the border. The footage flashes by, and you think you see a familiar face on each side.', [
      { t: '给两个孩子各打一个电话|Call both children', run: function (c) { aff(K(c, 'a'), 3); aff(K(c, 'b'), 3); H.fx(c, { stress: 8 }); return '两个电话都没人接。一个星期后，两个人都发来一条一模一样的消息：“我没事。”|Neither answered. A week later both sent the exact same message: "I\'m fine."'; } },
      { t: '一夜没睡，守着电视|Stay up all night by the TV', run: function (c) { H.fx(c, { stress: 10, health: -2 }); return '天亮的时候，新闻说双方已经各自后撤。你在沙发上睡着了。|At dawn the news said both sides had pulled back. You fell asleep on the sofa.'; } }
    ], { prep: prep2 }),
    sys('k34_sever', '公开断绝|A Public Break', '✂️', '{an}在社交媒体上发了一条声明：“因立场不同，本人与{bn}断绝一切关系。”评论区里，有人叫好，有人骂ta冷血。|{an} posts a statement: "Because of our different allegiances, I sever all ties with {bn}." Some cheer, others call them heartless.', [
      { t: '给{an}打电话，让ta删掉|Phone {an} and tell them to take it down', run: function (c) { var a = K(c, 'a'); if (G.ch(.4)) { aff(a, 2); return '{an}沉默了很久，删掉了。可那条声明已经被截图转发了几万次。|{an} was silent a long time, then deleted it. It had already been screenshotted tens of thousands of times.'; } aff(a, -8); a.sev = K(c, 'b').id; a.sevY = S().year; return '{an}说：“这是我的工作。”挂了电话。|{an}: "This is my job." Then hung up.'; } },
      { t: '去安慰{bn}|Go and comfort {bn}', run: function (c) { var a = K(c, 'a'); aff(K(c, 'b'), 8); a.sev = K(c, 'b').id; a.sevY = S().year; H.fx(c, { happy: -4 }); return '{bn}说：“我不怪ta。如果我是ta，可能也会这样做。”你听完更难过了。|{bn} said: "I don\'t blame them. In their place I might do the same." That made it worse.'; } }
    ], { prep: prep2 }),
    sys('k34_peace', '退役以后|After They Retired', '🕊️', '很多年过去了。{an}和{bn}都脱下了制服。今年，他们第一次同时出现在你的生日宴上。|Years have passed. {an} and {bn} have both left the service. This year, for the first time, both turn up at your birthday.', [
      { t: '让他们坐在一起|Seat them together', run: function (c) { var a = K(c, 'a'), b = K(c, 'b'); a.sev = null; b.sev = null; aff(a, 8); aff(b, 8); H.fx(c, { happy: 12 }); return '一开始谁都不说话。后来{bn}给{an}倒了一杯酒：“那年边境上，是你吧？”{an}笑了：“你也在？”|At first nobody spoke. Then {bn} poured {an} a drink: "That year at the border — was that you?" {an} smiled: "You were there too?"'; } }
    ], { prep: function (c) { var r = prep2(c); if (r === false) return false; var a = K(c, 'a'); if (!a.sev) return false; } }),
    sys('k34_vs_me', '饭桌两边|Opposite Sides of the Table', '⚔️', '你为{mc}效力，{kn}却在{kc}的{kt}服役。ta回家时，你们都下意识地把手机扣在了桌上。|You serve {mc}; {kn} serves the {kc} {kt}. When they come home, you both instinctively put your phones face down.', [
      { t: '“在家里，我们只是一家人。”|"At home we\'re just family."', run: function (c) { aff(K(c, 'kid'), 5); H.fx(c, { happy: 3 }); return 'ta笑了，把手机翻了过来：“那就不聊工作。”|They smiled and turned the phone face up: "Then no work talk."'; } },
      { t: '试探ta的工作|Probe about their work', run: function (c) { aff(K(c, 'kid'), -8); H.fx(c, { stress: 4 }); return 'ta看了你很久：“你这是在审问我吗？”第二天一早就走了。|They looked at you a long while: "Are you interrogating me?" They left first thing next morning.'; } }
    ], { prep: function (c) { if (prep1(c) === false) return false; var p = c.p; c.prm.mc = cn(p.spy ? p.spy.ag : p.country); } }),
    sys('k34_cut_me', '{kn}和你断绝了往来|{kn} Cuts You Off', '📵', '{kn}的单位要求ta断绝和“境外敌对人员”的联系，名单上有你的名字。ta给你发了最后一条消息：“对不起。保重。”然后换了号码。|{kn}\'s service orders them to cut contact with "hostile foreign persons". Your name is on the list. They send you one last message: "I\'m sorry. Take care." Then the number changes.', [
      { t: '回一句“我等你”|Reply "I\'ll wait for you"', run: function (c) { var k = K(c, 'kid'); k.estranged = S().year; k.aff = Math.max(-50, (k.aff || 0) - 30); H.fx(c, { happy: -10, stress: 8 }); return '消息显示“未送达”。你还是每年在ta生日那天发一条。|"Not delivered". You still send one every year on their birthday.'; } },
      { t: '辞去现在的职位，换ta回来|Resign your post, so they can come back', run: function (c) { var k = K(c, 'kid'); aff(k, 15); H.fx(c, { happy: 4, fame: -2 }); if (c.p.mil) c.p.mil = null; if (c.p.spy) { c.p.spy = null; c.p.flags.exSpy = 1; } return '你递交了辞呈。三个月后，一个陌生号码打来电话，那头只说了一个字：“妈/爸。”|You resigned. Three months later an unknown number called. One word: "Mum… Dad."'; } }
    ], { prep: function (c) { if (prep1(c) === false) return false; } })
  ]);

  /* ================= the chosen heir: likelier, and with more story ================= */
  var bb = G.love.baby;
  G.love.baby = async function (other, adopted) {
    var k = await bb.apply(this, arguments);
    try {
      if (k && !adopted && !k.chosen && !kids().some(function (x) { return x.chosen; })) {
        var elite = (G.famClass && G.famClass() >= 2) || G.veryRich() || ['red', 'royal'].concat(G.DYN33 || []).indexOf(P().origin) >= 0;
        if (G.ch(elite ? .18 : .1)) { k.chosen = 1; k.smarts = Math.max(k.smarts || 0, G.ri(88, 100)); k.looks = Math.max(k.looks || 0, G.ri(80, 98)); k.eq = Math.max(k.eq || 0, G.ri(82, 98)); G.major('{n}出生时，接生的医生说：“这个孩子不一般。”|When {n} was born, the doctor said: "This one is special."', { n: k.name }); }
      }
    } catch (e) { }
    return k;
  };
  function ch() { return kids().filter(function (x) { return x.chosen; })[0]; }
  function chAge(a0, a1) { var k = ch(); return !!k && age(k) >= a0 && age(k) <= a1; }
  function CE(id, a0, a1, title, icon, t, opts) {
    return E(id, [20, 95], title, icon, function (c) { var k = ch(); c.prm.k = k ? k.name : ''; return G.L(t, c.prm); }, opts.map(function (o) { return O(o[0], function (c) { var k = ch(); var r = o[1](c, k); return r; }); }), { w: 6, noGate: 1, if: function () { return chAge(a0, a1); } });
  }
  G.evs([
    CE('k34_ch_test', 7, 11, '智商测试|The IQ Test', '🧠', '学校给{k}做了一次智力测试，结果出来以后，校长亲自打来电话：“这个分数，我们学校从来没出现过。”|The school gave {k} an IQ test. The headteacher phoned personally: "We have never seen a score like this."', [
      ['让ta跳级|Let them skip grades', function (c, k) { k.smarts = Math.min(100, k.smarts + 3); aff(k, 2); H.fx(c, { happy: 4 }); return G.L('{k}跳了两级，成了班上最小的学生，也是第一个交卷的那个。|{k} skipped two years — the youngest in class and always first to hand in.', c.prm); }],
      ['保密，不让任何人知道|Keep it quiet', function (c, k) { aff(k, 4); H.fx(c, { eq: 2 }); return G.L('{k}照样在原来的班里，和朋友们一起疯跑。你只把那张成绩单锁进了抽屉。|{k} stayed in their class, running wild with friends. You locked the result in a drawer.', c.prm); }]
    ]),
    CE('k34_ch_kidnap', 6, 16, '差点被绑架|The Near-Kidnapping', '🚐', '放学路上，一辆面包车在{k}身边停下。ta没有上车，而是记下了车牌，跑进了旁边的派出所。|On the way home a van pulled up next to {k}. Instead of getting in, they memorised the plate and ran into the police station next door.', [
      ['给{k}请保镖|Hire {k} a bodyguard', function (c, k) { c.money(-c.$(G.ri(20, 60) * 1000)); aff(k, -2); return G.L('从此{k}上学身后总跟着一个高个子。同学们都叫他“{k}的影子”。|From then on a tall man followed {k} to school. Classmates called him "{k}\'s shadow".', c.prm); }],
      ['教ta更多保护自己的方法|Teach them more ways to stay safe', function (c, k) { aff(k, 5); k.smarts = Math.min(100, k.smarts + 1); return G.L('{k}学会了格斗、追踪和反追踪。十五岁时，ta已经比请来的教练还厉害。|{k} learned to fight, to track and to lose a tail. By fifteen they outclassed the instructor.', c.prm); }]
    ]),
    CE('k34_ch_contest', 13, 18, '少年天才大赛|The Young Genius Contest', '🏆', '{k}进了全国少年天才大赛的决赛，最后一题要现场直播。|{k} reached the final of the national young-genius contest. The last round is live on TV.', [
      ['到现场给ta加油|Cheer them on in the studio', function (c, k) { aff(k, 6); var w = G.ch(.6); if (w) { k.fame = (k.fame || 0) + 20; H.fx(c, { happy: 10 }); return G.L('{k}拿了冠军。领奖时ta说：“谢谢坐在第一排的那个人。”|{k} won. Accepting the trophy: "Thank you to the person in the front row."', c.prm); } H.fx(c, { happy: 3 }); return G.L('{k}拿了亚军，回家路上一直在琢磨那道题错在哪儿。|{k} came second and spent the drive home working out where it went wrong.', c.prm); }],
      ['让ta退赛：“你不需要证明给谁看。”|Pull them out: "You don\'t need to prove anything."', function (c, k) { aff(k, -3); return G.L('{k}很不高兴，三天没理你。后来ta说：“你说得对，可我想自己决定。”|{k} sulked for three days. Then: "You were right — but I wanted to decide myself."', c.prm); }]
    ]),
    CE('k34_ch_media', 15, 26, '“天选之子”|"The Chosen One"', '📰', '一家杂志用整整十页报道了{k}，封面标题是《天选之子》。从那天起，{k}走到哪里都有人认出来。|A magazine ran ten pages on {k}, with the cover line "The Chosen One". Since then {k} is recognised everywhere.', [
      ['帮ta把媒体都挡掉|Keep the press away from them', function (c, k) { aff(k, 6); c.money(-c.$(5000)); return G.L('你请了公关团队。一年后，{k}终于又能一个人去吃路边摊了。|You hired a PR team. A year later {k} could again eat at a street stall alone.', c.prm); }],
      ['让ta学会和镜头相处|Teach them to live with the cameras', function (c, k) { k.fame = (k.fame || 0) + 15; aff(k, 2); return G.L('{k}在一次采访里说：“我不是天选的，我只是起得比别人早。”这句话成了那一年的流行语。|In an interview {k} said: "I wasn\'t chosen. I just get up earlier." It became the saying of the year.', c.prm); }]
    ]),
    CE('k34_ch_refuse', 18, 32, '“我不想接班”|"I Don\'t Want to Inherit"', '🎨', '{k}坐在你对面，第一次很认真地说：“所有人都说这个家以后是我的。可是我想去做音乐/当医生/去非洲种树。”|{k} sits across from you and, for the first time, says it seriously: "Everyone says this family will be mine. But I want to make music / be a doctor / plant trees in Africa."', [
      ['“去吧，家里的事我来想办法。”|"Go. I\'ll sort out the family side."', function (c, k) { aff(k, 15); k.chosenFree = 1; H.fx(c, { happy: 4 }); return G.L('{k}走的那天，回头冲你挥了挥手。五年后，ta做到了自己想做的事，然后主动回来问你：“家里需要我吗？”|The day {k} left, they turned and waved. Five years later they had done it — then came back on their own: "Does the family need me?"', c.prm); }],
      ['“你生来就是做这个的。”|"You were born for this."', function (c, k) { aff(k, -12); return G.L('{k}留了下来，做得很好，好到所有人都满意——除了ta自己。|{k} stayed and did brilliantly, well enough to satisfy everyone — except themselves.', c.prm); }]
    ]),
    CE('k34_ch_first_deal', 22, 35, '第一个大决定|The First Big Call', '📈', '你把家族生意里的一个项目交给{k}独立负责。ta提出了一个所有元老都反对的方案。|You hand {k} a family project to run alone. They propose a plan every old hand opposes.', [
      ['全力支持ta|Back them fully', function (c, k) { if (G.ch(.7)) { c.money(c.$(G.ri(50, 300) * 1000)); aff(k, 8); return G.L('项目大获成功，元老们第一次在会上为{k}鼓掌。|It was a huge success. For the first time the old hands applauded {k}.', c.prm); } c.money(-c.$(G.ri(30, 120) * 1000)); aff(k, 6); return G.L('项目亏了。{k}来找你道歉，你说：“我第一次亏得比这多。”|It lost money. {k} came to apologise. You said: "My first loss was bigger."', c.prm); }],
      ['让ta听元老们的|Make them listen to the old hands', function (c, k) { aff(k, -6); c.money(c.$(G.ri(10, 40) * 1000)); return G.L('项目稳稳当当地赚了一点钱。{k}说：“下次，我想按自己的方式来。”|It earned a modest, safe profit. {k}: "Next time I want to do it my way."', c.prm); }]
    ])
  ]);

  /* ================= the ultra-rich have their own fun ================= */
  function UR(id, a, title, icon, t, opts) { return E(id, a, title, icon, t, opts.map(function (o) { return O(o[0], R(o[1], o[2] || {})); }), { w: 5, rep: 0, richOk: 1, if: function () { return G.ultraRich(); } }); }
  G.evs([
    UR('k34_ur_island', [8, 20], '生日礼物是一座岛|An Island for Your Birthday', '🏝️', '你的生日礼物是一座小岛。爷爷/外公说：“给它起个名字吧。”|Your birthday present is a small island. Grandpa says: "Give it a name."', [
      ['以你的宠物命名|Name it after your pet', '地图上从此多了一座“汪汪岛”。|From then on the map has a "Woof Island".', { happy: 10 }],
      ['把它改成海龟保护区|Make it a turtle sanctuary', '十年后，岛上的海龟多了三倍。|Ten years later the island had three times the turtles.', { karma: 8, happy: 6 }]
    ]),
    UR('k34_ur_butler', [10, 70], '管家们罢工了|The Butlers Go on Strike', '🧹', '家里的十二个管家和佣人集体罢工，要求加薪和每周两天假。今天的早餐没人做了。|All twelve butlers and staff walk out, demanding a raise and two days off a week. Nobody made breakfast.', [
      ['答应所有要求|Agree to everything', '他们回来了，还给你做了一顿特别丰盛的早餐。|They came back and made you an extra-lavish breakfast.', { money: -20000, karma: 4, happy: 3 }],
      ['自己下厨|Cook for yourself', '你把厨房弄得一团糟，煮糊了三个鸡蛋。可你第一次吃到了自己做的早饭。|You wrecked the kitchen and burned three eggs — and ate your first self-made breakfast.', { happy: 6, smarts: 1 }]
    ]),
    UR('k34_ur_auction', [20, 85], '拍卖会上的较劲|A Bidding War', '🔨', '拍卖会上，你看中的一具恐龙化石被另一位富豪盯上了。价格已经喊到了五千万。|At auction, another billionaire wants the dinosaur fossil you\'re after. The price is at fifty million.', [
      ['继续加价|Keep bidding', '你赢了。化石现在立在你家客厅，客人进门第一句话都是：“它叫什么名字？”|You won. It now stands in your living room; every guest asks, "What\'s its name?"', { money: -8000000, happy: 8, fame: 3 }],
      ['让给对方，然后捐一具给博物馆|Let them have it, then donate another to a museum', '你买了另一具小一点的化石捐给了自然博物馆，孩子们在展柜前排起了长队。|You bought a smaller one for the natural history museum; children queue at the case.', { money: -2000000, karma: 8, fame: 4 }]
    ]),
    UR('k34_ur_undercover', [20, 60], '隐姓埋名打工一个月|A Month Incognito', '🧢', '你想知道普通人的生活，决定用假名在自家公司的一家门店打一个月工。|You want to know ordinary life, so you work a month under a false name in one of your own shops.', [
      ['去，从收银员做起|Go — start on the till', '你被店长骂了三次，学会了扫码、拖地和对付难缠的顾客。月底你亮明身份，给所有店员涨了工资。|The manager told you off three times; you learned the scanner, the mop and difficult customers. At month\'s end you revealed yourself and gave everyone a raise.', { eq: 6, karma: 6, money: -50000, happy: 6 }],
      ['算了，太累|Too tiring', '你在游艇上看了一部关于这件事的纪录片。|You watched a documentary about it on your yacht.', { happy: 2 }]
    ]),
    UR('k34_ur_chat', [14, 30], '富二代群聊|The Rich-Kids Group Chat', '💬', '富二代群里在比谁的生日派对最夸张：有人包下了一座游乐园，有人请了世界巡演的歌手。大家都@你。|The rich-kids chat is competing over birthday parties: one hired a theme park, another a world-tour pop star. Everyone @s you.', [
      ['发一张你在路边摊吃烤串的照片|Post a photo of you eating street skewers', '群里安静了三秒，然后所有人都问：“这家在哪儿？”第二周，十几个富二代把那条街吃空了。|Three seconds of silence, then everyone: "Where is that?" Next week a dozen heirs ate the street clean.', { happy: 8, eq: 3 }],
      ['包下一座城市的所有屏幕|Rent every screen in a city', '你的生日祝福在全城的屏幕上播放了一整晚。你赢了，但也上了热搜被骂。|Your birthday played on every screen in a city all night. You won — and got roasted online.', { money: -500000, fame: 4, happy: 4 }]
    ]),
    UR('k34_ur_date', [20, 40], '以为你很穷的约会对象|A Date Who Thinks You\'re Broke', '🍜', '你穿着旧T恤去约会，对方以为你很穷，抢着付了账，还偷偷往你包里塞了一张购物卡。|You turned up in an old T-shirt; your date assumed you were broke, insisted on paying, and slipped a gift card into your bag.', [
      ['继续隐瞒，看看ta是什么样的人|Keep it hidden — see who they really are', '半年后你才坦白。ta愣了很久，说：“那你还欠我四十七顿饭。”|Six months later you confessed. After a long pause: "Then you owe me forty-seven dinners."', { happy: 8, eq: 3 }],
      ['当场坦白|Confess on the spot', 'ta笑得前仰后合，把购物卡要了回去。|They laughed till they cried and took the gift card back.', { happy: 5 }]
    ])
  ]);
})();
