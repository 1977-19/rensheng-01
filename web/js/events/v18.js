/* Version 1.8: fixes and reworks from player feedback.
   - Military academies: grades + fitness to get in, four years as a cadet (with your own training and merit), a commission on
     graduation, academy alumni who open doors, and a faster promotion track. Foreign academies (West Point, VMI, Sandhurst…).
   - Every kind of work (job, side jobs, military, police, government, intelligence, cadet drills) shares the 60-energy cap.
     Training and home leave cost energy again; training is varied and earns more merit; home leave costs a little merit.
     Quitting, resigning, retiring and leaving the service cost nothing.
   - Only generals can be approached by a foreign intelligence service while in uniform.
   - Former service members may emigrate after a talk meant to keep them; once in a Western country they can never go back to
     China without being arrested.
   - Heirs keep going to school at the right stage; you can continue as any child or grandchild whatever the will says;
     continuing as a grandchild always leaves you with two parents.
   - Pets live in the relationships page (with a pet sitter, and the ones who passed away); grandparents are part of the family;
     romance is closed to your children's partners and your partner's parents; rich spouses pay their share; royals at court;
     a longevity programme for the very rich; a fairer art show; the Late Bloomer awakens at 35; adoption into your sixties. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function cat(id) { return G.ACT_CATS.filter(function (c) { return c.id === id; })[0]; }
  function item(id) { var f = null; G.ACT_CATS.forEach(function (c) { c.items.forEach(function (a) { if (a.id === id && !f) f = a; }); }); return f; }
  function inList(L, id) { return (L || []).filter(function (a) { return a.id === id; })[0]; }
  function q(id, nid, prm) { var s = S(); (s.pendQ = s.pendQ || []).push({ id: id, nid: nid, prm: prm }); }
  function pickT(a) { return a[Math.floor(Math.random() * a.length)]; }

  /* ===================================================================================== */
  /* 1. military academies                                                                   */
  /* ===================================================================================== */
  var ACADS = {
    cn: [['国防科技大学|National University of Defense Technology', 62, null], ['陆军工程大学|Army Engineering University', 55, 'army'], ['海军工程大学|Naval University of Engineering', 55, 'navy'], ['空军航空大学|Aviation University of the Air Force', 56, 'air']],
    us: [['西点军校|West Point (U.S. Military Academy)', 64, 'army'], ['美国海军学院|U.S. Naval Academy (Annapolis)', 63, 'navy'], ['美国空军学院|U.S. Air Force Academy', 63, 'air'], ['弗吉尼亚军事学院|Virginia Military Institute', 54, 'army'], ['要塞军事学院|The Citadel', 52, 'army']],
    gb: [['桑赫斯特皇家军事学院|Royal Military Academy Sandhurst', 58, 'army'], ['达特茅斯皇家海军学院|Britannia Royal Naval College', 56, 'navy'], ['克伦威尔皇家空军学院|RAF College Cranwell', 56, 'air']],
    fr: [['圣西尔军校|Saint-Cyr Military Academy', 60, 'army'], ['法国海军学院|French Naval Academy', 57, 'navy'], ['法国空军学院|French Air Force Academy', 57, 'air']],
    ru: [['合成兵种军事学院|Combined Arms Academy', 55, 'army'], ['库兹涅佐夫海军学院|Kuznetsov Naval Academy', 55, 'navy'], ['加加林空军学院|Gagarin Air Force Academy', 56, 'air']],
    jp: [['防卫大学校|National Defense Academy of Japan', 58, null]],
    kr: [['陆军士官学校|Korea Military Academy', 58, 'army'], ['海军士官学校|Korea Naval Academy', 56, 'navy'], ['空军士官学校|Korea Air Force Academy', 57, 'air']],
    de: [['联邦国防军大学|Bundeswehr University', 56, null]],
    in: [['国防学院|National Defence Academy', 55, null], ['印度军事学院|Indian Military Academy', 54, 'army']],
    au: [['邓特伦皇家军事学院|Royal Military College Duntroon', 55, 'army'], ['澳大利亚国防军学院|Australian Defence Force Academy', 56, null]],
    ca: [['加拿大皇家军事学院|Royal Military College of Canada', 56, null]],
    il: [['以色列国防军军官学校|IDF Officers School', 55, null]],
    tr: [['土耳其陆军军官学校|Turkish Military Academy', 54, 'army']]
  };
  G.milAcademies = function (cid) {
    var L = ACADS[cid];
    if (!L) { var sys = G.eduSys(cid); return [{ n: sys.mil, need: 56, br: null }]; }
    return L.map(function (x) { return { n: x[0], need: x[1], br: x[2] }; });
  };
  function isCadet() { var p = P(); return p && p.edu && p.edu.stage === 'uni' && p.edu.spec === 'mil'; }
  G.isCadet = isCadet;
  var admit0 = G.school.admit;
  G.school.admit = function (u, major) {
    var r = admit0.apply(this, arguments), p = P();
    if (u && u.spec === 'mil') {
      p.cadet = { acad: u.n, merit: 0, br: u.br || null, y0: S().year, lead: 0 };
      G.major('考入{s}，成为一名军校学员|Entered {s} as a cadet', { s: u.n });
      for (var i = 0; i < 2; i++) { var c = N.make({ rel: 'classmate', age: p.age + G.ri(-1, 1), aff: G.ri(20, 45), c: p.country }); c.alum = u.n; c.job = G.L('{s}学员|Cadet, {s}', { s: u.n }); c.pin = 1; }
    }
    return r;
  };
  var title0 = G.title;
  G.title = function () {
    var p = P();
    if (p && isCadet() && !p.jail && !(p.spy && !p.spy.youth)) return G.L('{s}学员|Cadet, {s}', { s: p.edu.school });
    return title0.apply(this, arguments);
  };
  var comm0 = G.mil.commission;
  G.mil.commission = function () {
    var p = P(), cd = p.cadet;
    comm0.apply(this, arguments);
    var m = p.mil; if (!m) return;
    if (cd) {
      if (cd.br) m.br = cd.br;
      m.acad = cd.acad; m.merit = 10 + Math.round(cd.merit * .6) + (cd.lead ? 6 : 0);
      if (cd.merit >= 60) { m.acadTop = 1; G.major('以优秀学员身份毕业|Graduated with distinction'); m.merit += 6; }
      // the academy's alumni become your network
      N.all(function (n) { return n.alum === cd.acad && n.alive; }).forEach(function (n) { n.rel = 'friend'; n.pin = 1; n.job = G.L('{r}（{s}校友）|{r} ({s} alum)', { r: G.MIL.off[0], s: cd.acad }); });
      var sen = N.make({ rel: 'mentor', age: p.age + G.ri(18, 28), aff: G.ri(30, 50), c: p.country }); sen.alum = cd.acad; sen.alumRank = G.ri(5, 7); sen.pin = 1;
      sen.job = G.L('{r}（{s}校友）|{r} ({s} alum)', { r: G.MIL.off[sen.alumRank], s: cd.acad }); sen.inc = G.$w(G.MIL.offPay[sen.alumRank]);
      G.log('毕业典礼上，一位{r}学长拍了拍你的肩：“以后有事，来找我。”|At graduation a {r} — an alum — clapped your shoulder: "If you ever need anything, come and see me."', { r: G.MIL.off[sen.alumRank] });
      p.cadet = null;
    }
  };

  /* cadet life: drills, classes, exercises */
  var CAD_TR = [
    ['清晨五公里越野|A dawn 5K cross-country', '天还没亮，你们全副武装跑完了五公里。你的成绩进了队里前三。|Before dawn, in full kit, you ran 5K and finished in the top three.', { fit: 4, health: 1 }],
    ['队列会操|Drill and parade', '正步踢得整整齐齐，教官难得地点了点头。|Your goose-step was perfect; the drill sergeant actually nodded.', { fit: 2, eq: 1 }],
    ['战术理论课|Tactics class', '你在沙盘推演里把“蓝军”打得落花流水。|In the sand-table exercise you crushed the "blue force".', { smarts: 2 }],
    ['野外生存训练|Survival training', '你们在山里待了七天，吃过蛇，也喝过露水。|Seven days in the hills: you ate snake and drank dew.', { fit: 4, health: -1, stress: 3 }],
    ['实弹射击|Live-fire range', '五发子弹，四十八环。|Five rounds, forty-eight points.', { fit: 1, smarts: 1 }],
    ['军事地形学|Military topography', '你闭着眼都能在地图上找到那座无名高地。|You could find that nameless hill on the map with your eyes shut.', { smarts: 2 }],
    ['擒敌拳对练|Hand-to-hand drill', '你把对练的同学摔在垫子上，他躺着冲你竖了大拇指。|You threw your sparring partner to the mat; flat on his back, he gave you a thumbs-up.', { fit: 3 }],
    ['夜间紧急集合|Midnight muster', '哨声响起，三分钟内你背着打好的背包站进了队列。|At the whistle you were in line in under three minutes, pack tied and on your back.', { fit: 2, stress: 2 }]
  ];
  var cadetCat = { id: 'cadet', n: '军校生活|Cadet Life', i: '🎖️', items: [
    { id: 'cd_train', n: '训练与课程|Drills and Classes', i: '🏃', e: 12, run: function (a) {
      var p = P(), t = pickT(CAD_TR), m = G.ri(3, 6) + (p.h.fit > 60 ? 1 : 0); p.cadet.merit += m; G.dStart(); G.dPush('merit', m); var dl = G.dEnd();
      G.dStart(); H.fx(G.ctx(), t[2]); dl = dl.concat(G.dEnd());
      return G.result(a.n, G.join([G.L('【{x}】|[{x}] ', { x: t[0] }), t[1]], '', ''), null, dl, a.i);
    } },
    { id: 'cd_exercise', n: '参加联合演习|Join a Joint Exercise', i: '🪖', e: 18, a: [19, 30], run: async function (a) {
      var r = await G.UI.game('shooting', { name: a.n }), p = P(), m = r.win ? G.ri(7, 11) : G.ri(2, 4); p.cadet.merit += m;
      return G.result(a.n, r.win ? '演习中你带的小组端掉了“敌军”指挥所，导演部点名表扬。|Your squad took out the "enemy" command post; the exercise directors named you.' : '你们小组在演习第一天就“阵亡”了，但你学到了很多。|Your squad was "killed" on day one — but you learned a lot.', null, [{ k: 'merit', n: m }], a.i);
    } },
    { id: 'cd_friend', n: '结交同学|Make Friends at the Academy', i: '🤝', e: 6, run: function (a) {
      var p = P(), n = N.make({ rel: 'classmate', age: p.age + G.ri(-1, 2), aff: G.ri(30, 55), c: p.country }); n.alum = p.cadet.acad; n.pin = 1; n.job = G.L('{s}学员|Cadet, {s}', { s: p.cadet.acad });
      return G.quick(a, '你和{n}在熄灯后聊到了深夜。将来你们都会是军官。|You and {n} talked long after lights-out. One day you would both be officers.', { happy: 3, eq: 1 }, { n: n.name });
    } },
    { id: 'cd_lead', n: '竞选学员队长|Run for Cadet Captain', i: '⭐', e: 10, if: function () { var c = P().cadet; return isCadet() && c && !c.lead; }, run: function (a) {
      var p = P(), ch = .25 + p.st.eq / 250 + p.cadet.merit / 200 + (G.has('leader') ? .2 : 0);
      if (G.ch(ch)) { p.cadet.lead = 1; p.cadet.merit += 8; return G.result(a.n, '你当选了学员队长，肩上多了一道杠。|You were elected cadet captain — one more stripe on your shoulder.', null, [{ k: 'merit', n: 8 }], a.i); }
      return G.result(a.n, '你以几票之差落选了。|You lost by a handful of votes.', null, [], a.i);
    } }
  ] };
  cadetCat.items.forEach(function (a) { var f = a.if; a.if = function () { return isCadet() && !!P().cadet && (!f || f()); }; });
  G.ACT_CATS.push(cadetCat);

  /* serving officers: varied training worth real merit; home leave costs a little */
  var TRAIN = [
    ['战术演练|Tactical drills', '你带着全连在山地里反复演练穿插迂回，直到闭着眼都知道下一步。|You drilled the company through mountain flanking manoeuvres until everyone knew the next move blind.', 'fit'],
    ['实弹射击考核|Live-fire qualification', '靶场上，你的成绩全营第一。|On the range you posted the best score in the battalion.', 'fit'],
    ['夜间千里拉练|A long night march', '三天三夜，你们徒步一百二十公里，没有一个人掉队。|Three days and nights, 120 km on foot, and not one straggler.', 'fit'],
    ['跨区机动演习|Cross-theatre manoeuvres', '部队连夜机动到陌生地域，你指挥的分队第一个完成展开。|The unit redeployed overnight; your detachment was first to deploy.', 'smarts'],
    ['指挥所推演|Command-post wargame', '你在推演中识破了“蓝军”的佯动，导调组都愣住了。|In the wargame you saw through the "blue force" feint; the umpires were stunned.', 'smarts'],
    ['高原适应训练|High-altitude training', '在海拔四千米的地方，每走一步都像背着一袋水泥。|At 4,000 metres every step felt like carrying a sack of cement.', 'health'],
    ['跳伞训练|Parachute training', '舱门打开，风灌进来。你第一个跳了出去。|The door opened, the wind roared in, and you jumped first.', 'fit'],
    ['海上编队训练|Fleet formation exercises', '你们在风浪里保持着完美的编队。|You held a perfect formation through the swell.', 'smarts'],
    ['城市巷战演练|Urban combat drills', '在模拟街区里，你带的小组一路清剿到了最后一栋楼。|In the mock town your squad cleared every block to the last building.', 'fit'],
    ['新装备操作训练|Training on new equipment', '你第一个把新型装备的操作规程背得滚瓜烂熟。|You were the first to master the new system\'s procedures.', 'smarts'],
    ['抗洪抢险集训|Flood-rescue training', '你们在激流里练习架设浮桥和救人。|You practised pontoon bridges and swift-water rescues.', 'health'],
    ['政治理论学习|Political study sessions', '你的学习心得被印成了材料，发到了全旅。|Your study notes were printed and circulated to the whole brigade.', 'eq']
  ];
  function setupMil() {
    var tr = inList(G.ACT_MIL, 'train'), lv = inList(G.ACT_MIL, 'leave'), sf = inList(G.ACT_MIL, 'sf'), dc = inList(G.ACT_MIL, 'discharge');
    if (tr) { tr.e = 15; tr.run = function (a) {
      var p = P(), m = p.mil, t = pickT(TRAIN), gain = G.ri(4, 8) + (p.h.fit > 70 ? 2 : 0) + (G.has('leader') ? 1 : 0) + (m.acad ? 1 : 0);
      m.merit += gain; G.addStat('fit', 4, true);
      var fx = { health: 1 }; fx[t[2] === 'fit' ? 'health' : t[2]] = (fx[t[2]] || 0) + 2;
      G.dStart(); H.fx(G.ctx(), fx); var dl = G.dEnd(); dl.unshift({ k: 'merit', n: gain });
      return G.result(a.n, G.join([G.L('【{x}】|[{x}] ', { x: t[0] }), t[1]], '', ''), null, dl, a.i);
    }; }
    if (lv) { lv.n = '回家探亲|Home Leave'; lv.e = 10; lv.run = function (a) {
      var p = P(), fam = N.rel('father', 'mother', 'grand', 'spouse', 'child').filter(function (n) { return n.alive; });
      G.dStart(); fam.forEach(function (n) { N.addAff(n, G.ri(6, 10)); N.touch(n); }); G.addStat('happy', 8); G.addStat('stress', -8); var dl = G.dEnd();
      var lose = G.ri(1, 3); p.mil.merit = Math.max(0, p.mil.merit - lose); dl.push({ k: 'merit', n: -lose });
      var who = fam.slice(0, 3).map(function (n) { return n.name; });
      return G.result(a.n, who.length ? G.L('你请假回家，{w}围着你问长问短，饭桌上摆满了你爱吃的菜。归队后，你发现自己错过了一次评比。|You went home on leave; {w} fussed over you and the table was full of your favourite dishes. Back at the unit, you found you had missed an evaluation.', { w: G.join(who, '、', ', ') }) : '你回到空荡荡的家，一个人待了几天。|You went back to an empty home and spent a few days alone.', null, dl, a.i);
    }; }
    if (sf) sf.e = 25;
    if (dc) dc.e = 0;
    // police and government work costs energy again
    var E1 = { patrol: 15, investigate: 20, undercover: 25, gwork: 15, survey: 15, network: 10, speech: 15, runhigher: 20 };
    [G.ACT_POL, G.ACT_GOV].forEach(function (L) { (L || []).forEach(function (a) { if (E1[a.id] != null) a.e = E1[a.id]; }); });
  }
  setupMil();
  // anything that ends a job costs nothing
  var QUIT = /^(quit|pquit|gquit|discharge|spy_quit|gy_quit|honor_quit|rg_abdicate|udrop|dropout|retire|co_ceo_off|resign)$/;
  function zeroQuits() {
    [G.ACT_JOB, G.ACT_POL, G.ACT_MIL, G.ACT_GOV, G.ACT_BIZ, G.ACT_UNI, G.ACT_JOBX, G.ACT_RETIRED].forEach(function (L) { (L || []).forEach(function (a) { if (QUIT.test(a.id)) a.e = 0; }); });
    G.ACT_CATS.forEach(function (c) { c.items.forEach(function (a) { if (QUIT.test(a.id)) a.e = 0; }); });
  }
  zeroQuits();

  /* every kind of work shares one yearly cap */
  var iw18 = G.isWorkAct;
  G.isWorkAct = function (a) {
    if (!a || !a.e) return false;
    if ([G.ACT_POL, G.ACT_MIL, G.ACT_GOV, G.ACT_JOBX].some(function (L) { return (L || []).indexOf(a) >= 0; })) return true;
    var sc = cat('spy'), cc = cat('cadet');
    if ((sc && sc.items.indexOf(a) >= 0) || (cc && cc.items.indexOf(a) >= 0)) return true;
    return iw18.apply(this, arguments);
  };

  /* alumni: catching up with someone from your academy */
  var acts18 = G.npcActs;
  G.npcActs = function (n) {
    var out;
    try { out = acts18.apply(this, arguments) || []; } catch (e) { console.error(e); out = n && n.alive ? [{ id: 'chat', n: '聊天|Chat', i: '💬', e: 0, run: function () { return G.UI.chat(n); } }] : []; }
    var p = P();
    if (n && n.alive && n.alum && (p.mil || isCadet())) out.push({ id: 'alum', n: '校友叙旧|Catch Up (Alum)', i: '🎖️', e: 8, if: function () { return n.alumY !== S().year; }, run: async function (n2, a) {
      n.alumY = S().year; N.touch(n); var gain = G.ri(2, 4) + (n.alumRank ? Math.max(0, n.alumRank - (p.mil ? p.mil.rank : 0)) : 0); gain = Math.min(gain, 8);
      G.dStart(); N.addAff(n, G.ri(5, 9)); var dl = G.dEnd();
      if (p.mil) p.mil.merit += gain; else if (p.cadet) p.cadet.merit += gain; dl.push({ k: 'merit', n: gain });
      return G.result(a.n, G.pick(['你和{n}聊起了当年在学校熄灯后偷偷吃泡面的日子。临走时{n}说：“你的事，我记着呢。”|You and {n} laughed about sneaking instant noodles after lights-out. Leaving, {n} said: "I haven\'t forgotten you."',
        '{n}把你介绍给了几位老首长。|{n} introduced you to a few senior commanders.', '你们在食堂角落里喝了两杯。第二天，你的名字出现在了一份推荐名单上。|You shared a couple of drinks in a corner of the mess. The next day your name was on a recommendation list.']), { n: n.name }, dl, a.i);
    } });
    if (n && n.alive && taboo(n)) out = out.filter(function (a) { return ROM.indexOf(a.id) < 0; });
    if (n && n.alive && N.family[n.rel]) out.forEach(function (a) { if (a.id === 'time' && !a.v18) { a.v18 = 1; var r0 = a.run; a.run = async function (n2, a2) { var r = await r0.apply(this, arguments); var pp = P(); if (pp && n.alive) { N.addAff(n, G.ri(2, 5)); G.addStat('happy', 3); G.addStat('stress', -3); } return r; }; } });
    return out;
  };

  /* ===================================================================================== */
  /* 2. who you may not romance                                                              */
  /* ===================================================================================== */
  var ROM = ['date', 'confess', 'propose', 'wed', 'flirt', 'kiss', 'hookup', 'seduce', 'affair', 'trybaby'];
  function taboo(n) {
    var s = S(); if (!s || !n) return false;
    if (n.rel === 'inlaw') return true; // a partner's parents
    if (n.inlaw && s.npcs[n.inlaw] && (s.npcs[n.inlaw].rel === 'child' || s.npcs[n.inlaw].rel === 'grandchild')) return true;
    var bad = false;
    N.all(function (k) { return k.rel === 'child' || k.rel === 'grandchild' || k.rel === 'sibling'; }).forEach(function (k) { if (k.spouseId === n.id || k.lover === n.id || k.bf === n.id) bad = true; });
    if (n.kidPartner || n.rel === 'kidpartner') bad = true;
    if (n.spLover) bad = false;
    return bad;
  }
  G.taboo = taboo;
  var cr18 = N.canRomance;
  N.canRomance = function (n) { if (taboo(n)) return false; return cr18.apply(this, arguments); };
  var bl18 = G.love.becomeLovers;
  if (bl18) G.love.becomeLovers = function (n) { if (taboo(n)) return; return bl18.apply(this, arguments); };

  /* ===================================================================================== */
  /* 3. heirs: school, parents, free choice                                                  */
  /* ===================================================================================== */
  function fixEdu(p) {
    var e = p.edu = p.edu || { stage: 'none', grade: 0, perf: 50, deg: 0, study: 0, retake: 0 }, a = p.age;
    if (p.flags.noSchool) return;
    var want = a < 3 ? null : a < 6 ? ['kinder', a - 3] : a < 12 ? ['primary', a - 6] : a < 15 ? ['middle', a - 12] : a < 18 ? ['high', a - 15] : null;
    if (!want) { if (a >= 18 && (!e.stage || e.stage === 'none')) e.stage = 'done'; return; }
    var order = ['none', 'kinder', 'primary', 'middle', 'high'], cur = order.indexOf(e.stage || 'none');
    if (cur < 0) return; // already at uni/voc etc.
    if (cur === order.indexOf(want[0])) { if (Math.abs((e.grade || 0) - want[1]) > 1) e.grade = want[1]; }
    else {
      var grade = want[1];
      G.school.enter(want[0]); e.grade = grade; e.perf = G.clamp(Math.round((p.st.smarts || 50) * .7 + 15), 20, 95);
      if (want[0] !== 'kinder' && e.deg < (want[0] === 'middle' ? 1 : want[0] === 'high' ? 2 : 0)) e.deg = want[0] === 'middle' ? 1 : want[0] === 'high' ? 2 : e.deg;
    }
  }
  G.fixHeirEdu = function () { var p = P(); if (p) try { fixEdu(p); p.flags.eduFixed = 1; } catch (e) { console.error(e); } };
  var ca18 = G.life.continueAs;
  G.life.continueAs = function (kid) { var r = ca18.apply(this, arguments); G.fixHeirEdu(); return r; };
  var cg18 = G.life.continueAsGrand;
  if (cg18) G.life.continueAsGrand = function (gk) {
    var s = S(), par = N.all(function (n) { return n.rel === 'child' && (n.kids || []).indexOf(gk.id) >= 0; })[0];
    var r = cg18.apply(this, arguments);
    s = S();
    // two parents, always
    var dad = N.rel('father')[0], mom = N.rel('mother')[0], p = P();
    if (!dad || !mom) {
      var g = dad ? 'f' : 'm', other = N.make({ rel: g === 'm' ? 'father' : 'mother', g: g, age: N.age(gk) + G.ri(25, 34), c: p.country, aff: G.ri(40, 70) });
      other.pin = 1; if (g === 'm' && p.sur) { other.sur = p.sur; other.name = G.mkName(p.cul || G.C[p.country].names, p.sur, other.giv || String(other.name).split('|')[0].slice(1) || '明', 'm'); }
      if (par && par.sep) other.sep = 1;
      G.log('{n}一直在你身边。|{n} has always been there for you.', { n: other.name });
    }
    G.fixHeirEdu();
    // anyone still pointing at the old self stays valid
    N.all().forEach(function (n) { repair(n); });
    return r;
  };
  var reb18 = G.life.rebirthAs;
  if (reb18) G.life.rebirthAs = function () { var r = reb18.apply(this, arguments); G.fixHeirEdu(); return r; };

  // the will says who gets the estate, but you can live on as any child or grandchild
  var comp18 = G.ending.compute;
  G.ending.compute = function () {
    var d = comp18.apply(this, arguments), s = S(), w = P().will, main = w && w.mode === 'one' && w.main;
    var est = d.estate, list = [];
    N.all(function (n) { return n.alive && (n.rel === 'child' || n.rel === 'grandchild'); }).forEach(function (n) {
      if (n.rel === 'child' && n.illegit && !n.ack && !(est && est.plan && est.plan.share && est.plan.share[n.id])) return;
      list.push({ id: n.id, name: n.name, age: N.age(n), g: n.g, grand: n.rel === 'grandchild' ? 1 : 0, will: n.id === main ? 1 : 0 });
    });
    list.sort(function (a, b) { return (b.will - a.will) || (a.grand - b.grand) || (b.age - a.age); });
    d.heirs = list; d.heirOnly = 0;
    return d;
  };

  /* any NPC with broken data still opens */
  function repair(n) {
    if (!n) return n;
    if (!n.tags) n.tags = [];
    if (n.kids && !Array.isArray(n.kids)) n.kids = [];
    if (n.visa && !(n.visa.c && G.C[n.visa.c])) n.visa = null;
    if (n.c && !G.C[n.c]) n.c = P() ? P().country : 'cn';
    if (n.cits) { n.cits = n.cits.filter(function (c) { return G.C[c]; }); if (!n.cits.length) n.cits = null; }
    ['looks', 'smarts', 'eq', 'health', 'aff', 'love'].forEach(function (k) { if (typeof n[k] !== 'number' || isNaN(n[k])) n[k] = k === 'love' ? 0 : 50; });
    if (n.chat && !Array.isArray(n.chat)) n.chat = [];
    if (n.name == null) n.name = '—|—';
    return n;
  }
  G.npcRepair = repair;
  var ni18 = G.npcInfo;
  if (ni18) G.npcInfo = function (n) { repair(n); try { return ni18.apply(this, arguments) || []; } catch (e) { console.error(e); return []; } };

  /* ===================================================================================== */
  /* 4. family: grandparents, kids' partners stay put, pets that are family                   */
  /* ===================================================================================== */
  var create18 = G.life.create;
  G.life.create = function (o) {
    var s = create18.apply(this, arguments);
    try {
      var p = s.p, dad = N.rel('father')[0], mom = N.rel('mother')[0], have = N.rel('grand');
      [[dad, 'p'], [mom, 'm']].forEach(function (x) {
        var par = x[0]; if (!par) return;
        ['m', 'f'].forEach(function (g) {
          if (have.some(function (h) { return h.g === g && (h.side || 'p') === x[1]; })) return;
          var age = N.age(par) + G.ri(23, 34), alive = G.ch(age > 88 ? .15 : age > 80 ? .45 : age > 72 ? .75 : .92);
          var n = N.make({ rel: 'grand', g: g, age: age, c: par.c || p.country, cul: par.cul, aff: G.ri(55, 85), job: '退休|Retired', inc: G.$w(G.ri(4000, 12000)) });
          n.side = x[1]; n.pin = 1; n.wealth = Math.round(Math.max(0, par.wealth || 0) * G.rf(.05, .4));
          if (x[1] === 'p' && g === 'm' && par.sur) { n.sur = par.sur; }
          if (!alive) { n.alive = false; n.died = s.year - G.ri(1, 20); if (n.died < n.by + 50) n.died = n.by + 50; }
        });
      });
    } catch (e) { console.error(e); }
    return s;
  };
  var rn18 = N.relName;
  N.relName = function (n) {
    if (n && n.rel === 'grand' && n.side === 'm') return n.g === 'm' ? '外公|Maternal Grandfather' : '外婆|Maternal Grandmother';
    if (n && n.rel === 'grand' && n.side === 'p') return n.g === 'm' ? '爷爷|Paternal Grandfather' : '奶奶|Paternal Grandmother';
    return rn18.apply(this, arguments);
  };
  function keepKidPartners() {
    var s = S();
    N.all(function (k) { return (k.rel === 'child' || k.rel === 'grandchild') && k.spouseId; }).forEach(function (k) {
      var sp = s.npcs[k.spouseId]; if (!sp) return;
      if (['ex', 'lover', 'affair', 'admirer', 'crush', 'enemy'].indexOf(sp.rel) >= 0 || !sp.rel) { sp.rel = 'contact'; sp.love = 0; }
      sp.inlaw = k.id; sp.pin = 1;
    });
  }
  G.keepKidPartners = keepKidPartners;

  /* pets: affection, health, a sitter, and a place in memory */
  G.petDef = function (x) { return G.PETS.filter(function (y) { return y.id === x.kind; })[0] || { i: '🐾', n: '宠物|Pet', life: 12, up: 500 }; };
  function petTick() {
    var s = S(), A = s.assets, seen = s.petSeen = s.petSeen || {}, now = {};
    s.petGone = s.petGone || [];
    A.pets.forEach(function (x) {
      now[x.id] = 1; seen[x.id] = { id: x.id, kind: x.kind, name: x.name, by: x.by, aff: x.aff };
      if (x.health == null) x.health = 85;
      var d = G.petDef(x), age = s.year - x.by;
      if (x.sitter) { var fee = G.$(G.ri(2400, 4800)); if (G.canPay && G.canPay(fee)) { if (G.fin) G.fin.tag = G.L('宠物保姆|Pet sitter'); G.addMoney(-fee); if (G.fin) G.fin.tag = null; x.aff = Math.min(100, (x.aff || 60) + 3); x.health = Math.min(100, x.health + 3); } else { x.sitter = 0; G.log('钱不够，宠物保姆辞职了。|You couldn\'t pay, so the pet sitter left.'); } }
      else if (x.playY !== s.year) x.aff = Math.max(0, (x.aff || 60) - 6);
      if (age > d.life * .75) x.health = Math.max(0, x.health - G.ri(3, 9));
      if (age > d.life * 1.35 || x.health <= 0) { x.died = s.year; }
    });
    A.pets.filter(function (x) { return x.died; }).forEach(function (x) {
      s.petGone.push({ id: x.id, kind: x.kind, name: x.name, by: x.by, died: x.died, aff: x.aff }); delete seen[x.id];
      G.log('{n}在一个安静的早晨离开了。它陪了你{y}年。|{n} passed away one quiet morning. It had been with you {y} years.', { n: x.name, y: x.died - x.by });
      G.addStat('happy', -8);
    });
    A.pets = A.pets.filter(function (x) { return !x.died; });
    // pets removed by events (illness, old age) are remembered too — unless they went to a new home
    Object.keys(seen).forEach(function (id) {
      if (now[id]) return;
      var x = seen[id]; delete seen[id];
      if ((s.petRehomed || {})[id]) return;
      if (!s.petGone.some(function (y) { return y.id === x.id; })) s.petGone.push({ id: x.id, kind: x.kind, name: x.name, by: x.by, died: s.year, aff: x.aff });
    });
  }
  G.petTick = petTick;

  /* ===================================================================================== */
  /* 5. emigration for former service members                                               */
  /* ===================================================================================== */
  var WEST = ['us', 'gb', 'ca', 'au', 'nz', 'fr', 'de', 'it', 'es', 'ch', 'at', 'ie', 'pt', 'nl', 'se', 'no', 'dk', 'jp', 'kr', 'il'];
  G.WEST18 = WEST;
  var emi18 = G.money.emigrate;
  G.money.emigrate = function (to, quiet) {
    var p = P(), from = p.country, r = emi18.apply(this, arguments);
    if (r !== false && p.country === to) {
      if (from === 'cn' && (p.flags.wasMil || p.flags.wasMilCn) && WEST.indexOf(to) >= 0) { p.flags.noReturnCN = 1; G.major('作为退役军人移居{c}，从此再也不能回国|Moved to {c} as a veteran — there is no going back to China', { c: G.C[to].n }); }
      if (to === 'cn' && p.flags.noReturnCN && !p.jail && !p.flags.retArr) { p.flags.retArr = 1; q('v18_return_arrest'); }
    }
    return r;
  };
  function wireEmigrate() {
    var em = item('emigrate'); if (!em || em.v18) return; em.v18 = 1;
    var run0 = em.run;
    em.run = async function (a) {
      var p = P();
      if (p.country === 'cn' && p.mil && !p.mil.cons) { G.UI.toast(G.L('现役军人不能移民。先申请退役。|Serving officers cannot emigrate. Leave the military first.')); return 'cancel'; }
      if (p.country === 'cn' && p.flags.wasMil && !p.flags.persuaded) {
        var i = await G.UI.event({ title: G.L('组织上的挽留|They Ask You to Stay'), icon: '🎖️', text: G.L('听说你要移民，原部队的老首长专程来家里找你。他泡了一壶茶，说：“你脑子里装着的东西，比你想的更重要。国家培养了你，留下来吧。走了，就回不来了。”|Hearing you plan to emigrate, your old commander comes to your home. Over tea he says: "What\'s in your head matters more than you think. The country raised you — stay. If you leave, you can never come back."'),
          opts: [{ t: G.L('听首长的，留下来|Listen to him and stay') }, { t: G.L('我已经想好了|My mind is made up') }] });
        if (i === 0) { G.dStart(); G.addStat('karma', 4); G.addStat('happy', -2); var dl = G.dEnd(); return G.result(a.n, '你把移民材料锁进了抽屉。首长走的时候，握了很久你的手。|You locked the emigration papers in a drawer. Leaving, the commander held your hand a long time.', null, dl, '🎖️'); }
        p.flags.persuaded = 1;
        G.log('你没有听劝。你知道这意味着什么：只要踏出国门，就再也不能回来。|You did not listen. You knew what it meant: once you leave, you can never return.');
      }
      return run0.apply(this, arguments);
    };
  }
  wireEmigrate();

  /* ===================================================================================== */
  /* 6. high society: royals; longevity for the very rich; a fairer art show               */
  /* ===================================================================================== */
  var MON = function () { return G.CLIST.filter(function (c) { return G.C[c].mon && c !== P().country; }); };
  var elite = cat('elite');
  if (elite) {
    elite.items.push({ id: 'royal_ball', n: '王室舞会|A Royal Ball', i: '👑', e: 20, $: 80000, a: [18, 75], lock: function () {
      var p = P(); return G.netWorth() > G.$(2e7) || p.st.fame >= 70 || ['royal', 'noble', 'tycoon', 'richest'].indexOf(p.origin) >= 0 || p.flags.elite ? null : G.L('需要身家2000万美元等值、名声70以上，或出身显赫|Needs $20M+ net worth, 70+ fame, or a grand family');
    }, run: function (a) {
      var mons = MON(); if (!mons.length) mons = ['gb'];
      var list = [], p = P();
      for (var i = 0; i < 2; i++) {
        var c = G.pick(mons), g = p.orient === 'gay' ? p.g : p.orient === 'bi' ? (G.ch(.5) ? 'm' : 'f') : (p.g === 'm' ? 'f' : 'm');
        var n = N.mkRomantic({ rel: 'contact', tags: ['royal'], g: g, c: c, love: G.ri(10, 35), aff: G.ri(10, 30), age: p.age + G.ri(-6, 6) });
        n.tags = ['royal']; n.c = c; n.job = G.L(g === 'm' ? '{c}王子|Prince of {c}' : '{c}公主|Princess of {c}', { c: G.C[c].n }); n.wealth = Math.max(n.wealth || 0, G.$(G.ri(30, 300) * 1e6)); n.pin = 1;
        list.push(n);
      }
      G.addStat('fame', 3); G.addStat('happy', 6);
      return G.result(a.n, '水晶灯下，宫廷乐队奏起华尔兹。你被引见给了{a}和{b}。|Under the chandeliers a court orchestra played a waltz. You were introduced to {a} and {b}.', { a: list[0].name + '（' + G.T(list[0].job) + '）', b: list[1].name + '（' + G.T(list[1].job) + '）' }, [], a.i);
    } });
  }
  var LONG = [
    { id: 'lg_telo', n: '端粒修复疗程|Telomere Repair Course', usd: 3e6, ch: .7, y: [2, 4], risk: 0 },
    { id: 'lg_stem', n: '干细胞全身焕新|Whole-Body Stem-Cell Renewal', usd: 1.5e7, ch: .6, y: [4, 7], risk: .03 },
    { id: 'lg_rev', n: '实验性逆龄计划|Experimental Age-Reversal Programme', usd: 6e7, ch: .45, y: [6, 12], risk: .08 }
  ];
  var hc = cat('health');
  if (hc) hc.items.push({ id: 'evergreen', n: '长青计划（延寿疗法）|The Evergreen Programme', i: '🧬', e: 10, a: [40, 115], lock: function () { return G.netWorth() > G.$(3e6) ? null : G.L('需要身家300万美元等值以上|Needs $3M+ net worth'); }, run: async function (a) {
    var p = P(), f = p.flags;
    if (f.evgY && S().year - f.evgY < 5) { G.UI.toast(G.L('疗程之间至少隔五年（下次：{y}年）。|Courses must be five years apart (next: {y}).', { y: f.evgY + 5 })); return 'cancel'; }
    if ((f.lifeExt || 0) >= 20) { G.UI.toast(G.L('医生说，你的身体已经到了医学的极限。|The doctors say your body has reached the limits of medicine.')); return 'cancel'; }
    var i = await G.UI.pick({ title: G.L(a.n), text: G.L('瑞士阿尔卑斯山里的一家私人诊所。没有保证，只有概率。|A private clinic in the Swiss Alps. No guarantees — only odds.'), items: LONG.map(function (x) { return { t: x.n, icon: '🧬', sub: G.L('{m} · 成功率约{c}% · 可能延寿{a}~{b}年{r}|{m} · ~{c}% success · may add {a}–{b} years{r}', { m: G.M(G.$(x.usd)), c: Math.round(x.ch * 100), a: x.y[0], b: x.y[1], r: x.risk ? G.L('· 有风险|· risky') : '' }), dis: p.money < G.$(x.usd) }; }) });
    if (i < 0) return 'cancel'; var x = LONG[i];
    if (!G.pay(G.$(x.usd))) return 'cancel';
    f.evgY = S().year; G.inc('evergreen');
    G.dStart();
    var out;
    if (x.risk && G.ch(x.risk)) { G.addStat('health', -30); out = '疗程中出现了严重的排异反应，你在ICU里躺了一个月。|The treatment triggered a severe rejection; you spent a month in intensive care.'; }
    else if (G.ch(x.ch + (p.st.health - 50) / 400)) { var add = G.ri(x.y[0], x.y[1]); f.lifeExt = Math.min(20, (f.lifeExt || 0) + add); G.addStat('health', 12); G.addStat('looks', 4); out = G.L('疗程很成功。体检报告上，你的生理年龄比实际年龄年轻了{a}岁。|The course worked. Your check-up put your biological age {a} years below your real one.', { a: add }); }
    else { G.addStat('health', 3); out = '你在诊所住了三个月，花了一大笔钱。医生说效果“因人而异”。|Three months at the clinic and a fortune spent. The doctors said results "vary".'; }
    var dl = G.dEnd();
    return G.result(a.n, out, null, dl, a.i);
  } });

  var ex = item('exhibit');
  if (ex) {
    ex.n = '办画展|Hold an Art Show';
    ex.sub = '要求：绘画技能≥40或有“艺术细胞”天赋|Needs: painting skill ≥ 40 or the Artistic talent';
    ex.run = async function (a) {
      var r = await G.UI.game('memory', { name: a.n }), p = P(), skill = G.skill('art'), tal = G.has('art');
      var sc = .08 + skill / 140 + (tal ? .38 : 0) + r.score * .28 + p.st.fame / 400 + (p.st.looks > 75 ? .04 : 0);
      var why = G.L('（绘画技能{s}/100{t}，现场表现{g}%）|(painting skill {s}/100{t}, on the day {g}%)', { s: skill, t: tal ? G.L('，艺术细胞天赋加成|, Artistic talent bonus') : '', g: Math.round(r.score * 100) });
      G.dStart();
      if (sc >= .72) { G.fame.start('painter'); G.addStat('fame', 6); G.addStat('happy', 10); var d1 = G.dEnd(); return G.result(a.n, G.join(['画展大获成功，一家画廊当场签下了你！|The show was a hit — a gallery signed you on the spot!', why], ' ', ' '), null, d1, a.i); }
      if (sc >= .45) { var sold = G.$(G.ri(2, 12) * 1000); G.addMoney(sold); G.addStat('fame', 2); G.addStat('happy', 5); var s = P().sk || {}; s.art = Math.min(100, (s.art || 0) + 3); P().sk = s; var d2 = G.dEnd(); return G.result(a.n, G.join([G.L('来了不少人，卖出了几幅画（{m}）。|A decent crowd came and you sold a few pieces ({m}).', { m: G.M(sold) }), why], ' ', ' '), null, d2, a.i); }
      var s2 = P().sk || {}; s2.art = Math.min(100, (s2.art || 0) + 2); P().sk = s2; G.addStat('happy', -3); var d3 = G.dEnd();
      return G.result(a.n, G.join(['画展门可罗雀，不过你又画了一批新作。|Hardly anyone came, but you painted a new batch for next time.', why], ' ', ' '), null, d3, a.i);
    };
  }

  /* ===================================================================================== */
  /* 7. small fixes                                                                          */
  /* ===================================================================================== */
  ['o_college', 'rt_university', 'o_dance_class'].forEach(function (id) { delete G.EV[id]; });
  for (var ei = G.EVL.length - 1; ei >= 0; ei--) if (['o_college', 'rt_university', 'o_dance_class'].indexOf(G.EVL[ei].id) >= 0) G.EVL.splice(ei, 1);
  if (G.STATUS_MAX) ['o_dance', 'rt_dance', 'rt_matchcorner', 'o_tour'].forEach(function (id) { G.STATUS_MAX[id] = 0; });
  var elig18 = G.eligible;
  G.eligible = function (d) {
    var p = P();
    // generals, ministers and the like don't get the community-centre storylines
    if (p && d && /^(o_dance|rt_dance|rt_matchcorner|o_tour|o_scamcall)$/.test(d.id) && ((p.mil && p.mil.off && p.mil.rank >= 5) || (p.gov && p.gov.rank >= 4) || p.flags.wasGeneral)) return false;
    return elig18.apply(this, arguments);
  };
  var ad = item('adopt'); if (ad) ad.a = [22, 69];
  var lb = G.EV.tl_late_bloom; if (lb) { lb.a = [35, 60]; }
  var xl = G.EV.x_late_bloom; if (xl) xl.a = [35, 50];

  G.evs([
    { id: 'v18_late35', sys: 1, title: '开窍|Something Clicks', icon: '🌳',
      t: '三十五岁生日这天，你忽然觉得脑子像被擦亮了一样。过去想不通的事，一下子都想通了。|On your thirty-fifth birthday your mind suddenly feels polished. Things you could never work out fall into place at once.',
      o: [{ t: '重新规划人生|Rethink your whole life', run: function (c) { H.fx(c, { smarts: 6, eq: 5, happy: 8 }); return '你在本子上写下了接下来二十年要做的事。|You wrote down what you would do with the next twenty years.'; } },
        { t: '先从一件小事做起|Start with one small thing', run: function (c) { H.fx(c, { smarts: 4, eq: 3, health: 3, happy: 5 }); return '你报了一门一直想学的课。|You signed up for the course you had always wanted to take.'; } }] },
    { id: 'v18_return_arrest', sys: 1, title: '入境|At the Border', icon: '🛂', bad: 1,
      t: '你一下飞机，就被两名穿便衣的人带进了一间没有窗户的房间。“你服过役，又去了那边。你知道规定。”|The moment you step off the plane, two plain-clothes officers lead you into a windowless room. "You served, then you went over there. You know the rules."',
      o: [{ t: '配合调查|Cooperate', run: async function (c) { c.p.flags.noReturnCN = 0; var t = await G.crime.arrest(c, '叛逃嫌疑|Suspected defection', 8); return t; } }] },
    { id: 'v18_alum_meet', sys: 1, title: '校友|An Old Boy of the Academy', icon: '🎖️',
      prep: function (c) { var p = c.p; if (!p.mil || !p.mil.acad) return false; c.prm.s = p.mil.acad; c.prm.r = G.MIL.off[Math.min(G.MIL.off.length - 1, p.mil.rank + G.ri(2, 4))]; },
      t: '一次会议上，一位{r}看到你胸前的校徽，笑了：“{s}的？我是你师兄。”|At a meeting, a {r} spots your academy badge and smiles: "{s}? I\'m an old boy myself."',
      o: [{ t: '留个联系方式|Swap contact details', run: function (c) { var p = c.p, n = N.make({ rel: 'mentor', age: p.age + G.ri(10, 22), aff: G.ri(30, 50), c: p.country }); n.alum = p.mil.acad; n.alumRank = Math.min(G.MIL.off.length - 1, p.mil.rank + 3); n.pin = 1; n.job = G.L('{r}（{s}校友）|{r} ({s} alum)', { r: c.prm.r, s: c.prm.s }); p.mil.merit += 3; c.prm.n = n.name; G.dPush('merit', 3); return '你认识了{n}。后来，他在一次评选里替你说了话。|You got to know {n}. Later he put in a word for you at a selection board.'; } },
        { t: '客气两句就走|A polite word and move on', run: function () { return '你们握了握手。|You shook hands.'; } }] }
  ]);

  /* ===================================================================================== */
  /* 8. promotion requirements, shown wherever you work                                     */
  /* ===================================================================================== */
  G.promoReq = function () {
    var p = P(), out = [];
    function row(label, have, need, ok) { return { l: label, h: have, n: need, ok: ok == null ? have >= need : ok }; }
    if (p.mil) {
      var m = p.mil, L = m.off ? G.MIL.off : G.MIL.enl, nx = L[m.rank + 1];
      if (nx) {
        var need = m.off ? 2 + Math.floor(m.rank / 2) : 1 + Math.floor(m.rank / 2); if (m.acad) need = Math.max(1, need - 1);
        var mer = Math.round((10 + m.rank * 8) * (m.acad ? .85 : 1));
        var rows = [row('本级任职年限|Years in rank', m.yr, need), row('功绩|Merit', Math.round(m.merit), mer)];
        if (m.off && m.rank === 9) rows.push(row('功绩（或战时）|Merit (or wartime)', Math.round(m.merit), 95, m.merit >= 95 || S().world.war));
        if (m.off && m.rank === 10) rows.push(row('功绩（另需机遇）|Merit (plus luck)', Math.round(m.merit), 110));
        out.push({ t: G.L('晋升{r}|Promotion to {r}', { r: nx }), rows: rows, note: m.acad ? G.L('军校毕业：晋升更快|Academy graduate: faster promotion') : !m.off && m.rank >= 3 ? G.L('功绩40以上可能被提干|Merit 40+ may earn an officer\'s commission') : '' });
      }
    }
    if (isCadet()) out.push({ t: G.L('军校学员|Cadet'), rows: [row('学员功绩|Cadet merit', Math.round(P().cadet ? P().cadet.merit : 0), 60), row('在校年级|Year at academy', (p.edu.grade || 0) + 1, 4)], note: G.L('毕业即授少尉军衔；学员功绩≥60以优秀学员毕业|Commissioned on graduation; 60+ cadet merit earns a distinction') });
    if (p.pol && G.POLICE) {
      var o = p.pol, nr = G.POLICE.r[o.rank + 1];
      if (nr) out.push({ t: G.L('晋升{r}|Promotion to {r}', { r: nr }), rows: [row('本级年限|Years in rank', o.yr, 2 + Math.floor(o.rank / 3)), row('功绩|Merit', Math.round(o.merit), 10 + o.rank * 7)] });
    }
    if (p.gov && p.gov.track === 'civil') {
      var g = p.gov, R = G.gov.civilRanks(), ng = R[g.rank + 1];
      if (ng) out.push({ t: G.L('晋升{r}|Promotion to {r}', { r: ng }), rows: [row('本级年限|Years in rank', g.yr, 3), row('考核表现|Performance', Math.round(g.perf), 50 + g.rank * 3)] });
    }
    if (p.job && G.JOB[p.job.id]) {
      var j = p.job, J = G.JOB[j.id], nj = J.r[j.rank + 1];
      if (nj) out.push({ t: G.L('晋升{r}|Promotion to {r}', { r: nj }), rows: [row('本岗年限|Years in role', j.yr || 0, 2), row('工作表现|Performance', Math.round(j.perf), 55 + j.rank * 6)], note: G.L('满足条件后，每年有一定几率获得提拔|Once eligible, there is a yearly chance of promotion') });
    }
    if (p.spy && !p.spy.youth && G.SPY) {
      var sp = p.spy, ns = G.SPY[sp.rank + 1];
      if (ns) out.push({ t: G.L('晋升{r}|Promotion to {r}', { r: ns }), rows: [row('功绩|Merit', Math.round(sp.merit), 25 + sp.rank * 20)] });
    }
    return out;
  };

  /* ===================================================================================== */
  /* 9. yearly hooks                                                                          */
  /* ===================================================================================== */
  var mt18 = G.money.tick;
  G.money.tick = function () {
    var r = mt18.apply(this, arguments), s = S(), p = s.p;
    if (s.dead) return r;
    try {
      if (p.mil) p.flags.wasMil = 1;
      if (p.mil && p.mil.off && p.mil.rank >= 6) p.flags.wasGeneral = 1;
      if (p.age === 35 && G.has('late') && !p.flags.late35) { p.flags.late35 = 1; q('v18_late35'); }
      if (p.mil && p.mil.acad && !p.jail && G.ch(.08)) q('v18_alum_meet');
      keepKidPartners();
      petTick();
      if (p.flags.noReturnCN && p.country === 'cn' && !p.jail && !p.flags.retArr) { p.flags.retArr = 1; q('v18_return_arrest'); }
      if (!p.edu || (p.age >= 3 && p.age < 18 && (!p.edu.stage || p.edu.stage === 'none') && p.flags.heir && !p.flags.noSchool && !p.flags.dropped && !p.flags.eduFixed)) G.fixHeirEdu();
    } catch (e) { console.error(e); }
    return r;
  };
})();
