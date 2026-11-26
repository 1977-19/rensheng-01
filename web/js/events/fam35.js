/* Version 3.6 — what happens to your children shows up on their page; legitimate and secret children abroad;
   passive surprises with more choices; origins ordered from hardest to most privileged. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function age(n) { return N.age(n); }
  function cn(c) { return G.C[c] ? G.T(G.C[c].n) : c; }
  function aff(k, v) { if (k) G.dPush('aff', N.addAff(k, v)); }
  function q(id, prm) { (S().pendQ = S().pendQ || []).push({ id: id, prm: prm }); }
  function kids() { return N.rel('child').filter(function (k) { return k.alive; }); }

  /* ================= a child's own record ================= */
  G.kidLog = function (k, t, prm) { if (!k) return; (k.tl = k.tl || []).push([S().year, G.L(t, prm || {})]); if (k.tl.length > 24) k.tl.shift(); };
  var ARMY = ['少尉|Second Lieutenant', '中尉|Lieutenant', '上尉|Captain', '少校|Major', '中校|Lieutenant Colonel', '上校|Colonel', '大校|Senior Colonel'];
  var INTEL = ['科员|Officer', '副科长|Deputy Section Chief', '科长|Section Chief', '副处长|Deputy Division Chief', '处长|Division Chief', '局长|Bureau Director'];
  function svcJob(k) {
    var v = k.svc, yrs = Math.max(0, S().year - v.y), r = Math.min(Math.floor(yrs / 4), (v.t === 'army' ? ARMY : INTEL).length - 1);
    var rk = (v.t === 'army' ? ARMY : INTEL)[r], cc = G.C[v.c] ? G.C[v.c].n : v.c;
    return v.t === 'army' ? G.L('{c}军队 · {r}|{c} armed forces · {r}', { c: cc, r: rk }) : G.L('{c}国家安全部门 · {r}（保密）|{c} security service · {r} (classified)', { c: cc, r: rk });
  }
  var gk = G.family && G.family.growKid;
  if (gk) G.family.growKid = function (k) {
    var r = gk.apply(this, arguments);
    try { if (k && k.svc) { if (age(k) >= 50) { G.kidLog(k, '从{c}退役|Retired from service ({c})', { c: cn(k.svc.c) }); k.svcPast = k.svc; k.svc = null; } else { k.job = svcJob(k); k.jobBase = k.jobT = k.job; k.jr = 0; k.unemp = 0; k.neet = 0; } } } catch (e) { }
    return r;
  };
  function where(k) { return (k.edu && k.edu.abroad) || k.studyIn || null; }
  function studying(k) { var a = age(k); return a >= 15 && a <= 27 && !!where(k); }
  var ni = G.npcInfo;
  G.npcInfo = function (n) {
    var r = ni.apply(this, arguments) || [];
    try {
      if (n.rel === 'child') {
        var c = n.c || P().country;
        var lab = function (x) { return String(x[0]).split('|')[0]; };
        var has = function (l) { return r.some(function (x) { return lab(x) === l; }); };
        if (!has('国籍')) r.unshift(['国籍|Nationality', (G.C[c] ? G.C[c].flag + ' ' : '') + cn(c)]);
        r = r.filter(function (x) { return lab(x) !== '身世' && lab(x) !== '留学'; });
        if (n.illegit) r.push(['身世|Birth', n.secret && N.spouse() ? '私生子女（配偶还不知道）|Born outside marriage (your spouse doesn\'t know)' : '私生子女|Born outside marriage']);
        else if (!n.adopted && kids().some(function (x) { return x.illegit; })) r.push(['身世|Birth', '婚生子女|Born in wedlock']);
        if (n.chosen) r.push(['天赋|Gift', '天选继承人|The chosen heir']);
        if (n.svc) r.push(['服役|Service', svcJob(n)]);
        else if (n.svcPast) r.push(['服役|Service', G.L('曾在{c}服役|Formerly served {c}', { c: cn(n.svcPast.c) })]);
        if (studying(n)) r.push(['留学|Studying abroad', (G.C[where(n)] ? G.C[where(n)].flag + ' ' : '') + cn(where(n)) + (n.edu && n.edu.school ? ' · ' + G.T(n.edu.school) : '')]);
        if (n.estranged) r.push(['关系|Ties', '已和你断绝往来|Has cut contact with you']);
        if (n.sev && S().npcs[n.sev]) r.push(['手足|Siblings', G.L('已与{s}断绝往来|Cut ties with {s}', { s: S().npcs[n.sev].name })]);
        if (n.tl && n.tl.length) {
          var mine = n.tl.map(function (x) { return x[0] + ' ' + G.T(x[1]); }), ex = r.filter(function (x) { return lab(x) === '人生经历'; })[0];
          if (ex) { var all = String(G.T(ex[1])).split('\n').concat(mine).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort(); ex[1] = all.join('\n'); }
          else r.push(['人生经历|Life events', mine.join('\n')]);
        }
      }
    } catch (e) { }
    return r;
  };
  // the stories that happen to a child go into their record too
  var rr = G.runEvent;
  var KLOG = { k34_dinner: '和{o}在年夜饭上无话可说|A silent New Year dinner with {o}', k34_vetting: '背景审查：被要求和{o}断绝联系|Vetting: told to cut contact with {o}', k34_standoff: '和{o}在边境对峙|Faced {o} at the border', k34_sever: '和{o}公开断绝关系|Publicly broke with {o}', k34_peace: '和{o}和解|Reconciled with {o}', k35_party: '在留学生聚会上遇见{o}|Met {o} at a student party', k35_close: '和{o}成了好朋友|Became close friends with {o}' };
  G.runEvent = async function (id, prm) {
    var r = await rr.apply(this, arguments);
    try {
      if (KLOG[id] && prm && prm.a != null && prm.b != null) { var a = S().npcs[prm.a], b = S().npcs[prm.b]; if (a && b) { G.kidLog(a, KLOG[id], { o: b.name }); G.kidLog(b, KLOG[id], { o: a.name }); } }
    } catch (e) { }
    return r;
  };

  /* ================= secret children and children born in wedlock, abroad ================= */
  function secretKid(x) { return x.illegit && x.secret && !!N.spouse(); }
  function legit(x) { return !x.illegit && !x.adopted; }
  function others(k) { return kids().filter(function (x) { return x !== k && (secretKid(k) ? legit(x) : legit(k) && secretKid(x)); }); }
  G.abroadWarn = function (k, c) {
    if (!k || !N.spouse()) return null;
    var o = others(k).filter(function (x) { return studying(x) && where(x) === c; })[0];
    if (!o) return null;
    return secretKid(k) ? G.L('⚠️ 你的婚生子女{n}在这里读书，可能会撞见|⚠️ {n}, your child born in wedlock, studies here — they may meet', { n: o.name }) : G.L('⚠️ 你的私生子女{n}在这里读书，可能会撞见|⚠️ {n}, your secret child, studies here — they may meet', { n: o.name });
  };
  var DEST = ['us', 'gb', 'au', 'ca', 'jp', 'sg', 'de', 'fr', 'nz', 'ie'];
  function sendAbroad(k, c) {
    var e = k.edu = k.edu || {}; var sys = G.eduSys(c), u = G.pick(sys.u.filter(function (x) { return x.t >= 2 && x.t <= 4; }).concat(sys.u).slice(0, 6));
    e.abroad = c; if (age(k) >= 18) { e.stage = 'uni'; e.grade = 0; e.school = u.n; e.tier = u.t; e.major = e.major || G.pick(G.MAJOR_LIST); } else e.abroadSchool = u.n;
    G.kidLog(k, '去{c}留学|Went to study in {c}', { c: cn(c) });
  }
  function safeDest(k) { var bad = others(k).filter(studying).map(where); var L = DEST.filter(function (c) { return c !== P().country && bad.indexOf(c) < 0 && G.C[c]; }); return G.pick(L.length ? L : DEST); }
  function reveal(c, x, soft) {
    var sp = N.spouse(); x.secret = 0; x.spAck = 1;
    if (sp) G.dPush('love', N.addLove(sp, soft ? -18 : -35));
    kids().filter(legit).forEach(function (y) { G.dPush('aff', N.addAff(y, soft ? -4 : -10)); });
    H.fx(c, { stress: soft ? 8 : 14, happy: soft ? -4 : -10 });
    G.major('配偶知道了{n}的存在|Your spouse learned about {n}', { n: x.name });
  }
  var mt = G.money.tick;
  G.money.tick = function () {
    var r = mt.apply(this, arguments), s = S(), p = s.p;
    try {
      if (!s.dead && !p.jail && N.spouse()) {
        var K = kids(), fl = p.flags.k35 = p.flags.k35 || { y: 0 };
        // the secret child's mother makes her own plans
        K.filter(function (x) { return secretKid(x) && !x.abrRoll && age(x) >= 17 && age(x) <= 22 && !where(x); }).forEach(function (x) {
          if (!G.ch(.25)) return; x.abrRoll = 1;
          var abroadSibs = others(x).filter(studying), c = abroadSibs.length && G.ch(.6) ? where(G.pick(abroadSibs)) : G.pick(DEST.filter(function (d) { return d !== p.country; }));
          var y = abroadSibs.filter(function (z) { return where(z) === c; })[0];
          if (y) q('k35_il_abroad', { x: x.id, y: y.id, c: c }); else sendAbroad(x, c);
        });
        // in the same country: sooner or later they meet
        if (s.year - fl.y >= 2) {
          var pairs = [];
          K.filter(function (x) { return secretKid(x) && studying(x); }).forEach(function (x) { others(x).forEach(function (y) { if (studying(y) && where(y) === where(x)) pairs.push([x, y]); }); });
          if (pairs.length && G.ch(.55)) {
            var pr = G.pick(pairs), x = pr[0], y = pr[1], st = x.meetN = (x.meetN || 0) + 1; fl.y = s.year;
            q(x.knows && y.knows ? 'k35_knew' : st === 1 ? 'k35_party' : st === 2 ? 'k35_close' : 'k35_spouse_asks', { x: x.id, y: y.id, a: x.id, b: y.id });
          } else if (G.ch(.07)) {
            var sx = K.filter(function (x) { return secretKid(x) && studying(x); });
            if (sx.length) { var z = G.pick(sx); fl.y = s.year; q('k35_spouse_asks', { x: z.id, y: (others(z)[0] || {}).id, a: z.id }); }
          }
        }
      }
    } catch (e) { console.error(e); }
    return r;
  };
  function X(c) { return S().npcs[c.prm.x]; }
  function Y(c) { return c.prm.y != null ? S().npcs[c.prm.y] : null; }
  function prepXY(c, needY) {
    var x = X(c), y = Y(c); if (!x || !x.alive || !x.secret || !N.spouse()) return false; if (needY && (!y || !y.alive)) return false;
    c.prm.xn = x.name; c.prm.yn = y ? y.name : ''; c.prm.c = cn(c.prm.c || where(x)); c.prm.sp = N.spouse().name;
    var m = x.par2 && S().npcs[x.par2]; c.prm.m = m ? m.name : G.L('ta的妈妈|their mother');
    c.prm.same = !!(y && where(y) && where(y) === where(x));
  }
  function sys(id, title, icon, t, o, ex) { return Object.assign({ id: id, sys: 1, noGate: 1, title: title, icon: icon, t: t, o: o }, ex || {}); }
  G.evs([
    sys('k35_il_abroad', '偏偏是那个国家|Of All the Countries', '✈️', '{m}决定送{xn}去{c}读书——你的婚生子女{yn}正好也在{c}。同一个华人圈子，迟早会碰上。|{m} has decided to send {xn} to study in {c} — exactly where {yn}, your child born in wedlock, is studying. Same expat circle; they\'ll meet sooner or later.', [
      { t: '出一笔钱，让{xn}改去别的国家|Pay for {xn} to go somewhere else', run: function (c) { var x = X(c), d = safeDest(x); if (!c.pay(c.$(60000))) { sendAbroad(x, where(Y(c)) || d); return '你拿不出这笔钱。{xn}还是去了{c}。|You couldn\'t find the money. {xn} went to {c} after all.'; } sendAbroad(x, d); aff(x, 3); c.prm.d = cn(d); return '{xn}改去了{d}。{m}收下钱的时候说：“你倒是很会安排。”|{xn} went to {d} instead. Taking the money, {m} said: "You do plan everything, don\'t you."'; } },
      { t: '随它去，世界这么大|Let it be — the world is big', run: function (c) { sendAbroad(X(c), where(Y(c))); H.fx(c, { stress: 4 }); return '{xn}出发了。你把两个孩子的朋友圈都设成了“特别关注”。|{xn} left. You set both children\'s feeds to "favourite".'; } },
      { t: '劝{m}让{xn}留在国内读|Persuade {m} to keep {xn} at home', run: function (c) { var x = X(c), m = x.par2 && S().npcs[x.par2]; if (m) aff(m, -6); aff(x, -6); x.abrRoll = 1; return '{xn}没能出国。ta在电话里说：“我知道为什么。”然后挂了。|{xn} didn\'t go abroad. On the phone: "I know why." Then the line went dead.'; } },
      { t: '干脆告诉{yn}换个国家读研|Tell {yn} to move country for their master\'s', run: function (c) { var y = Y(c), x = X(c); var d = safeDest(y); if (!c.pay(c.$(40000))) { sendAbroad(x, where(y)); return '钱不够，计划落空。|Not enough money; the plan fell through.'; } sendAbroad(x, where(y)); y.edu.abroad = d; G.kidLog(y, '转去{c}读书|Moved to study in {c}', { c: cn(d) }); aff(y, -3); return '{yn}莫名其妙地被你劝去了别的国家，一路上都在问你为什么。|{yn}, baffled, was talked into another country and kept asking why.'; } }
    ], { prep: function (c) { return prepXY(c, true); } }),
    sys('k35_party', '长得太像了|Too Much Alike', '📸', '{yn}发来一张{c}华人留学生聚会的合照：“爸/妈你看，这个人跟我长得好像！ta叫{xn}。”照片上两个人站在一起，像是一个模子刻出来的。|{yn} sends a photo from a student party in {c}: "Look — this person looks just like me! Their name is {xn}." Side by side, they could be twins.', [
      { t: '“天下长得像的人多了。”|"Plenty of people look alike."', run: function (c) { H.fx(c, { stress: 4 }); Y(c).suspect = (Y(c).suspect || 0) + 1; return '{yn}回了个“哈哈”。可你注意到，ta把那张照片设成了置顶。|{yn} replied "haha". But you noticed they pinned the photo.'; } },
      { t: '连夜给{m}打电话，让{xn}离远点|Phone {m} that night: keep {xn} away', run: function (c) { aff(X(c), -5); H.fx(c, { stress: 6 }); return '{m}说：“我管不了孩子交什么朋友。你自己的孩子你自己管。”|{m}: "I can\'t control who my child befriends. Manage your own."'; } },
      { t: '出钱让{xn}转学去别的国家|Pay for {xn} to transfer abroad elsewhere', run: function (c) { var x = X(c), d = safeDest(x); if (!c.pay(c.$(50000))) return '你拿不出这笔钱。|You couldn\'t afford it.'; x.edu.abroad = d; x.meetN = 0; G.kidLog(x, '转学去{c}|Transferred to {c}', { c: cn(d) }); aff(x, -8); c.prm.d = cn(d); return '{xn}被转去了{d}。ta给你发了一句：“你怕的到底是什么？”|{xn} was moved to {d}. They messaged: "What are you actually afraid of?"'; } },
      { t: '顺其自然|Let things take their course', run: function (c) { H.fx(c, { stress: 2 }); return '你回了一个笑脸，然后一晚上没睡着。|You sent back a smiley and didn\'t sleep all night.'; } }
    ], { prep: function (c) { return prepXY(c, true); } }),
    sys('k35_close', '“特别投缘的朋友”|"A Friend I Really Click With"', '🤝', '{yn}说在{c}交了一个特别投缘的朋友，就是{xn}。他们一起做饭、一起过节，还约好放假一起回国——坐同一班飞机。|{yn} says they have a friend in {c} they really click with — {xn}. They cook together, spend holidays together, and plan to fly home on the same plane.', [
      { t: '单独找{xn}说出真相，求ta保密|Tell {xn} the truth privately and ask for silence', run: function (c) { var x = X(c); x.knows = 1; if (G.ch(.6)) { aff(x, 4); return '{xn}沉默了很久：“我早就猜到了。我不会说的，为了{yn}。”|{xn} was silent a long time: "I guessed. I won\'t tell — for {yn}\'s sake."'; } aff(x, -10); return '{xn}说：“所以我连做朋友的资格都没有？”|{xn}: "So I\'m not even allowed to be their friend?"'; } },
      { t: '把真相告诉{yn}|Tell {yn} the truth', run: function (c) { var y = Y(c); y.knows = 1; aff(y, -10); H.fx(c, { stress: 6 }); if (G.ch(.3)) { reveal(c, X(c), true); return '{yn}哭着给{sp}打了电话。家里的天塌了一半。|{yn} called {sp} in tears. Half the sky fell in.'; } return '{yn}说：“我需要时间。但我不会告诉{sp}。”|{yn}: "I need time. But I won\'t tell {sp}."'; } },
      { t: '给{yn}买张提前回国的机票|Buy {yn} an earlier flight home', run: function (c) { c.money(-c.$(1500)); aff(Y(c), -2); return '你说家里有事。{yn}回来后发现什么事都没有，嘟囔了一个星期。|You said something came up at home. {yn} found nothing had, and grumbled for a week.'; } },
      { t: '什么都不做|Do nothing', run: function (c) { H.fx(c, { stress: 5 }); return '他们坐在同一排，一路聊回了国。你去机场接{yn}的时候，看见{xn}朝你点了点头。|They sat together and chatted all the way home. Collecting {yn} at the airport, you saw {xn} nod to you.'; } }
    ], { prep: function (c) { return prepXY(c, true); } }),
    sys('k35_spouse_asks', '“这个人是谁？”|"Who Is This?"', '🧐', '{sp}在别人的朋友圈里刷到一张照片，指着{xn}问你：“这个孩子怎么跟你长得这么像？ta在哪儿读书？”|{sp} found a photo in someone\'s feed and points at {xn}: "Why does this kid look so much like you? Where do they study?"', [
      { t: '拿出{xn}在{c}的学籍证明自证：和咱们家孩子不在一个地方|Show {xn}\'s enrolment in {c} — nowhere near our children', if: function (c) { return !c.prm.same; }, run: function (c) { var sp = N.spouse(); if (G.ch(.8)) { G.dPush('love', N.addLove(sp, 2)); return '“你看，ta在{c}，咱们孩子根本不在那儿，八竿子打不着。”{sp}看了看，没再追问。|"See, they\'re in {c}; ours aren\'t even there." {sp} looked and let it go.'; } G.dPush('love', N.addLove(sp, -6)); return '{sp}说：“你怎么会有一个陌生孩子的学籍证明？”|{sp}: "Why would you have a stranger\'s enrolment papers?"'; } },
      { t: '伪造一份学籍证明，证明ta在别的国家|Forge enrolment papers placing them elsewhere', if: function (c) { return c.prm.same; }, run: function (c) { if (!c.pay(c.$(8000))) return '你找不到人帮你办。|You couldn\'t find anyone to do it.'; H.fx(c, { karma: -6 }); if (G.ch(.6)) return '证明做得天衣无缝，{sp}信了。但你知道，{yn}的同学里迟早会有人说漏嘴。|The papers were flawless; {sp} believed you. But someone among {yn}\'s classmates will let it slip one day.'; reveal(c, X(c)); return '{sp}打电话到学校核实，学校说根本没有这个学生。|{sp} called the school to check. No such student.'; } },
      { t: '“远房亲戚家的孩子。”|"A distant relative\'s kid."', run: function (c) { var ok = G.ch(.35 + (c.p.st.eq || 50) / 200); if (ok) { H.fx(c, { stress: 6 }); return '{sp}“哦”了一声。可第二天，ta问你：“哪个亲戚？”|{sp} said "oh". The next day: "Which relative?"'; } reveal(c, X(c)); return '{sp}直接给{xn}发了私信。真相就这样出来了。|{sp} messaged {xn} directly. That was how it came out.'; } },
      { t: '坦白|Tell the truth', run: function (c) { reveal(c, X(c), true); H.fx(c, { karma: 6 }); return '你把一切都说了。{sp}一句话都没说，那天晚上睡在了客房。|You told everything. {sp} said nothing and slept in the guest room.'; } }
    ], { prep: function (c) { return prepXY(c, false); } }),
    sys('k35_knew', '他们早就知道了|They Knew All Along', '🫶', '{xn}和{yn}给你发来一张合照，背景是{c}的一家火锅店。配的字是：“爸/妈，我们早就知道了。放心，这是我们三个人的秘密。”|{xn} and {yn} send you a photo from a hotpot place in {c}: "We\'ve known for ages. Don\'t worry — it\'s a secret between the three of us."', [
      { t: '给两个人各发一个大红包|Send each a big red packet', run: function (c) { c.money(-c.$(2000)); aff(X(c), 8); aff(Y(c), 8); H.fx(c, { happy: 10 }); return '两个人同时回了一句：“谢谢老板！”|Both replied at once: "Thanks, boss!"'; } },
      { t: '视频通话，三个人好好聊一次|Video-call the three of you', run: function (c) { aff(X(c), 10); aff(Y(c), 10); H.fx(c, { happy: 8, stress: -6 }); return '聊到最后，{xn}说：“我一直想有个兄弟姐妹。”|By the end {xn} said: "I always wanted a sibling."'; } },
      { t: '决定不再瞒着{sp}|Decide to stop hiding it from {sp}', run: function (c) { reveal(c, X(c), true); aff(X(c), 6); aff(Y(c), 4); H.fx(c, { karma: 8 }); return '两个孩子站在你身后，陪你说完了这件事。|Both children stood behind you while you told it.'; } }
    ], { prep: function (c) { return prepXY(c, true); } })
  ]);

  /* ================= passive surprises — more choices ================= */
  function K1(a0, a1, extra) { return function (c) { var L = kids().filter(function (k) { var a = age(k); return a >= a0 && a <= a1 && (!extra || extra(k)); }); if (!L.length) return false; var k = G.pick(L); c.npc = k; c.prm.n = k.name; c.prm.j = k.job ? G.T(k.job) : ''; }; }
  function hasKid(a0, a1, extra) { return function () { return kids().some(function (k) { var a = age(k); return a >= a0 && a <= a1 && (!extra || extra(k)); }); }; }
  function V(id, a, title, icon, t, opts, ex) { return E(id, a, title, icon, t, opts.map(function (o) { return O(o[0], o[1]); }), Object.assign({ w: 5 }, ex || {})); }
  function fx(c, e) { H.fx(c, e); }
  G.evs([
    V('k35_viral', [30, 80], '你火了|You Went Viral', '📱', '{n}随手拍了一段你在厨房边炒菜边跳舞的视频，一夜之间播放量破了三千万。评论区都在问：“这位阿姨/叔叔还接商演吗？”|{n} filmed you dancing while cooking. Overnight it hit thirty million views. The comments: "Does this auntie/uncle do gigs?"', [
      ['和{n}一起开账号当网红|Start an account together with {n}', function (c) { aff(c.npc, 8); fx(c, { fame: 6, money: 3000, happy: 6 }); return '你们的账号三个月涨了五十万粉，接到了第一条锅具广告。|You gained half a million followers in three months and landed a cookware ad.'; }],
      ['让{n}立刻删掉|Make {n} delete it now', function (c) { aff(c.npc, -6); fx(c, { stress: -2 }); return '删了。可视频已经被搬运到了十几个平台。|Deleted. It was already on a dozen other platforms.'; }],
      ['亲自去评论区回复|Reply in the comments yourself', function (c) { fx(c, { happy: 8, fame: 2 }); return '你回了一句“下次跳广场舞版”，点赞比视频还多。|You wrote "square-dance version next time" — it got more likes than the video.'; }],
      ['假装没看见|Pretend you never saw it', function (c) { fx(c, { happy: 2 }); return '第二天去菜市场，卖菜的大姐冲你比了个舞蹈动作。|At the market next day, the vegetable seller did your dance move at you.'; }]
    ], { if: hasKid(12, 30), prep: K1(12, 30) }),
    V('k35_dna', [25, 90], '近亲匹配|A Close Match', '🧬', '孩子送你一盒DNA检测当生日礼物。结果出来，网站提示：发现一位“近亲匹配”——一个你从来没听说过的人。|Your child gave you a DNA kit for your birthday. The results flag a "close relative match" — someone you\'ve never heard of.', [
      ['发消息联系ta|Message them', function (c) { var r = G.ch(.5); fx(c, r ? { happy: 10 } : { happy: 4, smarts: 1 }); return r ? '对方是你爷爷当年失散的弟弟的孙女。第二年春节，你们家多了一桌亲戚。|They turned out to be the granddaughter of your grandfather\'s long-lost brother. Next New Year your family had a whole extra table of relatives.' : '原来是你某个表亲的孩子，网站把关系算错了一层。你们还是加了好友。|Just a cousin\'s kid — the site got the generation wrong. You added each other anyway.'; }],
      ['先去问问爸妈|Ask your parents first', function (c) { fx(c, { stress: 5 }); return '妈妈沉默了很久，说：“这件事，等你爸不在了我再告诉你。”|Your mother was quiet for a long time: "I\'ll tell you after your father\'s gone."'; }],
      ['把结果发到家族群|Post the result in the family chat', function (c) { fx(c, { happy: 5, stress: 4 }); return '群里炸了锅。三个姑姑开始互相猜到底是谁家的事。|The chat exploded. Three aunts started guessing whose secret it was.'; }],
      ['注销账号，就当没看见|Delete the account; forget it', function (c) { fx(c, { stress: -2 }); return '你注销了账号。可那个名字，你一直记得。|You deleted it. You never forgot the name.'; }]
    ], { if: hasKid(14, 60) }),
    V('k35_tvsearch', [30, 85], '寻亲节目|The Reunion Show', '📺', '电视寻亲节目上，一位老人举着一张发黄的照片：“我找了ta四十年。”照片上的孩子，和你小时候一模一样。|On a TV reunion show, an old woman holds up a yellowed photo: "I\'ve looked for them for forty years." The child in it looks exactly like you as a kid.', [
      ['联系节目组，上节目见面|Contact the show and meet her', function (c) { fx(c, { happy: 10, fame: 3 }); return '她是你小时候的保姆。当年你家搬走得太急，她一直以为把你弄丢了。全场观众都哭了。|She was your childhood nanny. Your family moved so suddenly she always thought she\'d lost you. The whole studio cried.'; }],
      ['先私下做个亲子鉴定|Do a DNA test privately first', function (c) { fx(c, { money: -500 }); var r = G.ch(.5); fx(c, r ? { happy: 6 } : { smarts: 2 }); return r ? '不是亲属，但她是你妈妈当年最好的朋友。你们约好每年喝一次茶。|Not a relative — but she was your mother\'s best friend back then. You agreed to have tea once a year.' : '结果不匹配。她只是认错了人，你给她留了电话，说找不到就来找你。|No match. She had the wrong person; you left your number in case she never found them.'; }],
      ['怀疑是骗局，报警|Suspect a scam and call the police', function (c) { fx(c, { smarts: 2, karma: -2 }); return '警察说这是真的寻亲节目。你有点不好意思，给节目组寄了一面锦旗。|The police said it was genuine. Embarrassed, you sent the show a thank-you banner.'; }],
      ['换台|Change the channel', function (c) { fx(c, { stress: 3 }); return '你换了台，可那张照片一整晚都在你眼前。|You changed the channel, but the photo stayed with you all night.'; }]
    ]),
    V('k35_capsule', [35, 80], '时间胶囊|The Time Capsule', '📦', '{n}在老房子的院子里挖出一个生锈的铁盒——是你小时候埋的时间胶囊。里面有一封信，信封上写着：“给三十年后的我”。|{n} dug up a rusty tin in the old garden — the time capsule you buried as a child. Inside, a letter: "To me, thirty years from now".', [
      ['当着{n}的面读出来|Read it aloud in front of {n}', function (c) { aff(c.npc, 6); fx(c, { happy: 8 }); return '信里写着：“希望你没有变成无聊的大人。”{n}笑得在地上打滚。|"I hope you didn\'t become a boring grown-up." {n} rolled on the floor laughing.'; }],
      ['一个人躲起来读|Read it alone', function (c) { fx(c, { happy: 5, stress: -5 }); return '你读了三遍，最后在信的背面写了一句回信。|You read it three times, then wrote a reply on the back.'; }],
      ['和{n}一起再埋一个|Bury a new one with {n}', function (c) { aff(c.npc, 8); fx(c, { happy: 6, karma: 2 }); return '你们各写了一封信。{n}在纸条上写：“三十年后，你要还在。”|You each wrote a letter. {n}\'s note said: "In thirty years, you have to still be here."'; }],
      ['拍照发到同学群|Post it in your old classmates\' chat', function (c) { fx(c, { happy: 6, eq: 2 }); return '老同学们纷纷翻出了自己的胶囊，群里热闹了一整个周末。|Old classmates dug out their own; the chat buzzed all weekend.'; }]
    ], { if: hasKid(6, 40), prep: K1(6, 40) }),
    V('k35_exteacher', [28, 58], '新班主任|The New Form Teacher', '🍎', '家长会上，你发现{n}的新班主任，是你的初恋。ta也认出了你，手里的粉笔断成了两截。|At the parents\' evening you realise {n}\'s new form teacher is your first love. They recognise you too — the chalk snaps in their hand.', [
      ['装作不认识|Act like strangers', function (c) { fx(c, { stress: 4 }); return '你们握了握手，客客气气地聊了十分钟{n}的数学成绩。|You shook hands and politely discussed {n}\'s maths for ten minutes.'; }],
      ['大方打招呼：“好久不见。”|Say warmly: "Long time no see."', function (c) { fx(c, { happy: 5, eq: 2 }); return 'ta笑了：“你一点都没变。”{n}在旁边一脸疑惑。|They smiled: "You haven\'t changed." {n} looked baffled.'; }],
      ['以后让配偶去开家长会|Send your spouse to parents\' evenings from now on', function (c) { var sp = N.spouse(); if (sp) G.dPush('love', N.addLove(sp, -2)); return '配偶去了一次，回来说：“那个老师问起你了。”|Your spouse went once and came back: "That teacher asked about you."'; }],
      ['私下拜托ta多照顾{n}|Quietly ask them to look out for {n}', function (c) { c.npc.smarts = Math.min(100, (c.npc.smarts || 50) + 3); aff(c.npc, 2); fx(c, { karma: -1 }); return '那一年，{n}的成绩突飞猛进。ta说：“老师总是对我特别好。”|That year {n}\'s grades shot up. "The teacher is always extra nice to me."'; }]
    ], { if: hasKid(6, 17), prep: K1(6, 17) }),
    V('k35_fakejob', [45, 85], '那件外卖服|The Delivery Jacket', '🛵', '你一直以为{n}在大公司做{j}。今天，你在小区门口看见ta穿着外卖服、骑着电动车给人送餐。|You thought {n} worked at a big company as {j}. Today you saw them outside your building in a delivery jacket, on an e-bike.', [
      ['当场叫住ta|Call out to them on the spot', function (c) { aff(c.npc, -4); fx(c, { stress: 4 }); return 'ta吓了一跳，餐差点洒了：“我被裁了半年了，不敢告诉你。”|They jumped and nearly spilled the order: "I was laid off six months ago. I didn\'t dare tell you."'; }],
      ['假装没看见，默默多点几单外卖|Pretend you didn\'t see, and order lots of takeaway', function (c) { aff(c.npc, 6); fx(c, { money: -300, happy: 3 }); return '那个月，你家的外卖都是ta送的。每一单你都给了五星和小费。|That month every delivery came from them. You gave five stars and a tip every time.'; }],
      ['回家后好好谈谈|Talk it through at home', function (c) { aff(c.npc, 5); fx(c, { eq: 2 }); return 'ta哭了：“我怕你失望。”你说：“我只怕你什么都一个人扛。”|They cried: "I was afraid you\'d be disappointed." You: "I\'m only afraid you carry it all alone."'; }],
      ['给ta一笔钱，让ta重新开始|Give them money for a fresh start', function (c) { var m = c.$(20000); if (!c.pay(m)) return '你自己也拿不出来。你们一起吃了一顿路边摊。|You couldn\'t spare it. You shared a street-food dinner instead.'; c.npc.wealth = (c.npc.wealth || 0) + m; aff(c.npc, 10); return 'ta用这笔钱开了一家小店，专门做外卖。|They opened a small shop — delivery only.'; }]
    ], { if: hasKid(22, 40, function (k) { return !!k.jobT && !k.svc; }), prep: K1(22, 40, function (k) { return !!k.jobT && !k.svc; }) }),
    V('k35_lookalike', [20, 70], '另一个你|Another You', '🪞', '朋友说，隔壁城市有个人跟你长得一模一样，连眉角那颗痣都在同一个位置。他还发来了照片——确实是你的脸。|A friend says someone in the next city looks exactly like you, down to the mole by your eyebrow. The photo: it\'s your face.', [
      ['去见ta|Go and meet them', function (c) { var r = G.ch(.15); fx(c, r ? { happy: 15 } : { happy: 6 }); return r ? '你们去做了鉴定：同卵双胞胎。当年医院抱错了一个。你们抱在一起哭了很久。|DNA says identical twins — one of you was handed to the wrong family. You held each other and cried.' : '纯属巧合。你们交换了电话，约好以后互相冒充去参加无聊的饭局。|Pure coincidence. You swapped numbers and agreed to stand in for each other at boring dinners.'; }],
      ['让ta替你去开一个无聊的会|Get them to sit through a boring meeting for you', function (c) { fx(c, { happy: 6, karma: -2 }); return '没人发现。ta还在会上提了一个好建议，你的老板第一次表扬了“你”。|Nobody noticed. They even made a good suggestion, and your boss praised "you" for the first time.'; }],
      ['不感兴趣|Not interested', function (c) { fx(c, { stress: 1 }); return '可从那以后，你总觉得在人群里看见了自己。|Ever since, you keep thinking you see yourself in crowds.'; }]
    ]),
    V('k35_swap', [24, 60], '医院的电话|A Call from the Hospital', '🏥', '{n}出生的那家医院打来电话：那一天出生的两个婴儿，档案可能弄混了，请你们配合做一次亲子鉴定。|The hospital where {n} was born calls: two babies born that day may have had their records mixed up. Would you take a DNA test?', [
      ['马上去做|Do it right away', function (c) { fx(c, { stress: 6, money: -300 }); aff(c.npc, 2); return '一个星期后结果出来：没有抱错。你把那张报告带回家，抱着{n}好久。|A week later: no mix-up. You brought the report home and held {n} for a long time.'; }],
      ['拒绝：“ta就是我的孩子。”|Refuse: "They\'re my child, full stop."', function (c) { aff(c.npc, 4); fx(c, { happy: 2 }); return '医院后来又打来一次，你直接挂了。|The hospital rang once more. You hung up.'; }],
      ['起诉医院管理混乱|Sue the hospital for negligence', function (c) { fx(c, { money: 6000, stress: 8 }); return '医院赔了一笔钱，道歉信写了整整两页。|The hospital paid damages and sent a two-page apology.'; }],
      ['瞒着{n}偷偷去做|Do it secretly without telling {n}', function (c) { fx(c, { stress: 4, money: -300 }); return '结果没问题。可那根偷偷拔下来的头发，让你心虚了好几天。|All fine. But the hair you plucked in secret left you guilty for days.'; }]
    ], { if: hasKid(0, 12, function (k) { return !k.adopted && !k.illegit; }), prep: K1(0, 12, function (k) { return !k.adopted && !k.illegit; }) }),
    V('k35_olderdate', [45, 80], '比你还大两岁|Two Years Older Than You', '💑', '{n}带回家一个对象，进门第一句：“叔叔/阿姨好。”——可对方比你还大两岁。|{n} brings someone home who greets you as "auntie/uncle" — and they\'re two years older than you.', [
      ['热情欢迎|Welcome them warmly', function (c) { aff(c.npc, 8); fx(c, { eq: 2 }); return '饭桌上你们聊起了同一年的高考，越聊越投机。{n}说：“你们别聊了，我插不上话。”|You compared notes on the same year\'s exams and got on famously. {n}: "Stop — I can\'t get a word in."'; }],
      ['冷着脸吃完一顿饭|Eat in stony silence', function (c) { aff(c.npc, -8); fx(c, { stress: 4 }); return '对方走后，{n}说：“你就不能给个笑脸吗？”|After they left, {n}: "Couldn\'t you have smiled once?"'; }],
      ['私下找对方谈|Talk to them privately', function (c) { aff(c.npc, -2); fx(c, { smarts: 1 }); return 'ta说：“我知道你担心什么。我会对ta好的，比你想的还好。”|"I know what worries you. I\'ll treat them well — better than you imagine."'; }],
      ['问对方：“打麻将吗？”|Ask them: "Play mahjong?"', function (c) { aff(c.npc, 5); fx(c, { happy: 6 }); return '你们打到半夜，对方赢了你三百块。你决定接受这个人了。|You played till midnight; they won three hundred off you. You decided to accept them.'; }]
    ], { if: hasKid(22, 45, function (k) { return !k.spouseId; }), prep: K1(22, 45, function (k) { return !k.spouseId; }) }),
    V('k35_ticket', [40, 90], '那张彩票|That Lottery Ticket', '🎟️', '你随手塞给{n}的那张彩票中了二等奖。{n}拿着彩票说：“这张是你买的，钱应该是你的。”|The ticket you casually gave {n} won second prize. {n} holds it out: "You bought it. The money\'s yours."', [
      ['让ta自己留着|Let them keep it', function (c) { c.npc.wealth = (c.npc.wealth || 0) + c.$(80000); aff(c.npc, 10); fx(c, { happy: 5 }); return 'ta用这笔钱付了房子的首付。|They used it for a house deposit.'; }],
      ['一人一半|Split it', function (c) { c.npc.wealth = (c.npc.wealth || 0) + c.$(40000); aff(c.npc, 5); fx(c, { money: 40000, happy: 4 }); return '你们去银行的路上一直在笑。|You laughed all the way to the bank.'; }],
      ['全部捐掉|Give it all away', function (c) { aff(c.npc, 2); fx(c, { karma: 12, happy: 4 }); return '捐给了山区学校。半年后，你们收到了一百多张孩子们画的画。|To a mountain school. Six months later a hundred children\'s drawings arrived.'; }],
      ['拿来全家出去旅行|Take the whole family on a trip', function (c) { kids().forEach(function (k) { G.dPush('aff', N.addAff(k, 5)); }); fx(c, { happy: 10 }); return '你们去了海边。这是很多年来全家人第一次聚得这么齐。|You went to the seaside — the first time in years everyone was together.'; }]
    ], { if: hasKid(18, 60), prep: K1(18, 60) }),
    V('k35_voice', [55, 95], '“妈/爸，我出事了”|"Mum, Dad — I\'m in Trouble"', '☎️', '电话里传来{n}的声音，一模一样：“我出车祸了，对方要二十万私了，你快转给我，别告诉别人！”|On the phone, {n}\'s voice, exactly: "I\'ve been in a crash; they want two hundred thousand to settle. Transfer it now and don\'t tell anyone!"', [
      ['马上转账|Transfer it at once', function (c) { fx(c, { money: -20000, happy: -8 }); return '钱转过去了。半小时后，真正的{n}打来电话问你晚饭吃了没。是AI合成的声音。|You sent it. Half an hour later the real {n} rang to ask if you\'d had dinner. It was an AI-cloned voice.'; }],
      ['问一个只有你们俩知道的问题|Ask something only the two of you would know', function (c) { fx(c, { smarts: 3, happy: 3 }); return '你问：“你小时候养的那只仓鼠叫什么？”对方挂了电话。|You asked: "What was your childhood hamster called?" They hung up.'; }],
      ['挂掉，直接打给{n}|Hang up and call {n} directly', function (c) { aff(c.npc, 4); fx(c, { stress: 3 }); return '{n}正在开会，接起来一脸懵：“我好好的啊。”|{n} was in a meeting, baffled: "I\'m fine!"'; }],
      ['陪骗子聊半小时，然后报警|Keep the scammer talking for half an hour, then call the police', function (c) { fx(c, { happy: 8, karma: 4 }); return '你假装耳背，让对方把银行卡号念了十一遍。警察说这是他们收到过最完整的线索。|You played deaf and had them read the account number eleven times. Police said it was the best lead they\'d ever had.'; }]
    ], { if: hasKid(18, 60), prep: K1(18, 60) }),
    V('k35_parrot', [18, 85], '送错的快递|The Misdelivered Parcel', '🦜', '快递送错了。你拆开箱子，里面是一只鹦鹉。它歪着头看了你一眼，清清楚楚地喊出了你的名字。|A parcel came to the wrong door. Inside: a parrot. It cocks its head and clearly says your name.', [
      ['想办法找到原主人|Track down its owner', function (c) { fx(c, { karma: 5, happy: 3 }); return '原主人是你的小学同桌。三十年了，ta一直在教鹦鹉喊你的名字——因为你欠ta一块橡皮。|The owner was your primary-school deskmate. For thirty years they\'d taught it your name — you owed them an eraser.'; }],
      ['留下来养|Keep it', function (c) { fx(c, { happy: 8 }); return '它现在每天早上七点准时喊你起床。|Now it wakes you at seven every morning, on the dot.'; }],
      ['教它说一句新的话|Teach it a new phrase', function (c) { fx(c, { happy: 6, smarts: 1 }); return '你教了它一个星期“恭喜发财”，它学会的是你的咳嗽声。|A week of teaching it "prosperity", and it learned your cough.'; }],
      ['送去动物园|Take it to the zoo', function (c) { fx(c, { karma: 2 }); return '饲养员说它会说十几种语言里的脏话。|The keeper said it swears in a dozen languages.'; }]
    ]),
    V('k35_kidsgroup', [50, 90], '你误入了孩子们的群|You Stumbled into the Kids\' Group Chat', '💬', '孩子们背着你建了一个群，群名叫“爸妈的晚年计划”。有人手滑把你也拉了进去。最新一条消息是：“谁去说服妈/爸别再买保健品？”|The children made a group chat behind your back called "Our Parents\' Retirement Plan". Someone accidentally added you. Latest message: "Who\'s going to stop Mum/Dad buying supplements?"', [
      ['默默潜水看完|Lurk and read it all', function (c) { fx(c, { happy: 6, smarts: 1 }); return '你发现他们排好了每个月轮流回家的表，还在偷偷攒钱给你换一个新的膝盖。|You found a rota for visiting you each month — and a secret fund for your new knee.'; }],
      ['发一个大红包|Drop a big red packet', function (c) { fx(c, { money: -500, happy: 8 }); kids().forEach(function (k) { G.dPush('aff', N.addAff(k, 3)); }); return '群里安静了五秒，然后所有人都开始刷“谢谢老板”。|Five seconds of silence, then everyone: "Thanks, boss!"'; }],
      ['发一句：“我都看见了。”|Post: "I can see all of this."', function (c) { fx(c, { happy: 5 }); return '三分钟内，群名改成了“相亲相爱一家人”。|Within three minutes, the chat was renamed "One Loving Family".'; }],
      ['悄悄退群|Quietly leave', function (c) { fx(c, { happy: 3 }); return '可从那以后，你再也没买过保健品。|But you never bought supplements again.'; }]
    ], { if: function () { return kids().filter(function (k) { return age(k) >= 18; }).length >= 2; } })
  ]);

  /* ================= origins, from the hardest start to the most privileged ================= */
  var RANK = {
    debt: 0, orphan: 0,
    leftbehind: 1, single: 1, rural: 1,
    fisher: 2, circus: 2, worker: 2, immigrant: 2,
    firefighter: 3, police: 3, smallbiz: 3, zoo: 3,
    middle: 4, civil: 4, scholar: 4, military: 4, mixed: 4, diplomat: 4, medical: 4, artist: 4, detective: 4, archaeo: 4, space: 4, spyfam: 4, magic: 4, pilot: 4,
    academic: 5, oldbrand: 5, influencer: 5, ranch: 5, chef: 5, teahouse: 5, champion: 5,
    merchant: 6, lottery: 6, techfam: 6, winery: 6, celebrity: 6, mafia: 6,
    tycoon: 7, banker: 7, hotelier: 7, oil: 7, luxury: 7, shipping: 7, racing: 7, casino: 7,
    diamond: 8, media: 8, pharma: 8, autodyn: 8, aero: 8, oldmoney: 8, gulf: 8, noble: 8, red: 8,
    chaebol: 9, royal: 9, richest: 9, polbiz: 9,
    luxtop: 10, hkclan: 10, hidden: 10
  };
  var BANDS = [[0, '😣 困境|😣 Hard start'], [2, '🏘️ 普通|🏘️ Ordinary'], [4, '🏡 小康|🏡 Comfortable'], [6, '💼 富裕|💼 Wealthy'], [8, '🏰 豪门|🏰 Elite'], [10, '👑 顶级|👑 The very top']];
  G.originRank = function (o) { var r = RANK[o.id]; if (r == null) r = o.vip >= 3 ? 9 : (o.fl || []).indexOf('rich') >= 0 ? 7 : 4; return r; };
  G.originBand = function (o) { var r = G.originRank(o), b = BANDS[0][1]; BANDS.forEach(function (x) { if (r >= x[0]) b = x[1]; }); return b; };
})();
