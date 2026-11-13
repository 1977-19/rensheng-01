/* Batch 9: family legacy (lineage, mega projects with returns), graves and causes of death, children's crimes
   and prison visits, inheriting as the crowned child, no estate tax, emigrant cities, calmer scandals, new stories. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC, FA = G.family, LO = G.love;
  function S() { return G.S; }
  function setN(c, n) { c.npc = n; c.prm.n = n.name; var pr = G.pr ? G.pr(n.g) : {}; for (var k in pr) c.prm[k] = pr[k]; }

  /* ================= no estate tax anywhere ================= */
  G.CLIST.forEach(function (c) { if (G.C[c]) G.C[c].itax = 0; });

  /* ================= moving a person's life to another country ================= */
  G.moveTo = function (c) {
    var p = S().p, from = p.country; if (!G.C[c] || c === from) return;
    var r = G.$(1, c) / Math.max(1e-9, G.$(1, from));
    p.money = Math.round(p.money * r);
    p.flags.hometown = p.flags.hometown || { c: from, city: p.city };
    p.country = c; p.city = G.pick(G.C[c].cities[Math.min(3, Math.max(1, p.tier || 2))] || G.C[c].cities[2]);
    p.imm = p.imm || []; if (p.imm.indexOf(c) < 0) p.imm.push(c);
  };
  // emigrants live in a city of their new country, not in their old hometown
  var emi9 = G.money.emigrate;
  G.money.emigrate = function (to) {
    var p = S().p, oldCity = p.city, from = p.country;
    var r = emi9.apply(this, arguments);
    if (p.country === to && from !== to) { p.flags.hometown = p.flags.hometown || { c: from, city: oldCity }; var cs = G.C[to].cities; if (cs[1].concat(cs[2] || [], cs[3] || []).indexOf(p.city) < 0) p.city = G.pick(cs[2] || cs[1]); }
    return r;
  };

  /* ================= inheriting as the child you chose ================= */
  var cont9 = G.life.continueAs;
  G.life.continueAs = function (kid) {
    var s = S(), old = s.p, info = { crowned: kid.crowned, c: kid.c, cits: kid.cits, illegit: kid.illegit, crownY: kid.crownY, oldMon: !!old.flags.monarch, mega: old.mega };
    // the lineage remembers the one who just died, with the whole story
    var last = (G.meta.lives || [])[G.meta.lives.length - 1];
    var r = cont9.apply(this, arguments);
    var s2 = S(), p = s2.p;
    if (last && s2.lineage && s2.lineage.length) Object.assign(s2.lineage[s2.lineage.length - 1], { td: last.td, ep: last.ep, cause: last.cause, nw: last.nw, cur: last.cur, tl: last.tl, gen: (s2.gen || 2) - 1, org: last.org, c: last.c, g: last.g, age: last.age, grade: last.grade });
    if (info.c && info.c !== p.country) G.moveTo(info.c);
    if (info.cits && info.cits.length) p.cits = info.cits.slice();
    if (info.crowned) {
      p.origin = 'royal'; p.flags.monarch = 1; p.flags.crownHeir = 1; p.flags.exRoyal = 0; p.flags.npcJob = null; p.cits = [p.country];
      G.log('你是{c}在位的君主。|You are the reigning monarch of {c}.', { c: G.C[p.country].n });
    } else if (info.oldMon && info.illegit) { p.flags.monarch = 0; p.flags.noThrone = 1; G.log('你是私生子女，没有资格继承王位。|Born outside the marriage, you have no right to the throne.'); }
    if (info.mega) p.mega = info.mega;
    return r;
  };
  var reb9 = G.life.rebirthAs;
  if (reb9) G.life.rebirthAs = function (kid) {
    var s0 = S(), lin = (s0.lineage || []).slice(), leg = s0.legacy, last = (G.meta.lives || [])[G.meta.lives.length - 1], old = s0.p;
    var fate = kid.crowned ? { c: kid.c, y: kid.crownY || (kid.by + 35) } : null;
    if (last) lin.push({ name: old.name, by: old.birthYear, dy: s0.year, title: last.title, score: last.score, td: last.td, ep: last.ep, cause: last.cause, nw: last.nw, cur: last.cur, tl: last.tl, gen: s0.gen || 1, org: last.org, c: last.c, g: last.g, age: last.age, grade: last.grade });
    var s = reb9.apply(this, arguments);
    s.lineage = lin; if (leg) s.legacy = leg;
    if (fate) { s.p.flags.throneFate = fate; G.log('命运早已写好：有一天，你会继承{c}的王位。|Fate is already written: one day you will take the throne of {c}.', { c: G.C[fate.c] ? G.C[fate.c].n : '' }); }
    return s;
  };
  // a reborn life follows the old timeline: no surprise brothers and sisters
  ['c_sibling', 'su_half_born'].forEach(function (id) { var d = G.EV[id]; if (!d) return; var if0 = d.if; d.if = function (S2, p) { if (p && p.flags && p.flags.reborn) return false; return if0 ? if0.apply(this, arguments) : true; }; });
  G.evs([
    { id: 'my_throne', sys: 1, title: '加冕|Coronation', icon: '👑',
      prep: function (c) { var f = c.p.flags.throneFate; if (!f) return false; c.prm.c = G.C[f.c] ? G.C[f.c].n : ''; },
      t: '{c}王室的使者来了：王位后继无人，流着王室血脉的你，被选为继承人。|An envoy from the royal house of {c} arrives: there is no heir, and you, who carry royal blood, have been chosen.',
      o: [
        { t: '接受王冠|Accept the crown', run: function (c) { var f = c.p.flags.throneFate; c.p.flags.throneFate = null; G.moveTo(f.c); c.p.cits = [f.c]; c.p.origin = 'royal'; c.p.flags.monarch = 1; c.p.job = null; c.add('fame', 25); c.money(c.$(5e7)); G.major('登基为{c}君主|Crowned monarch of {c}', { c: c.prm.c }); return '加冕礼上，王冠比你想象的重得多。|At the coronation, the crown was far heavier than you\'d imagined.'; } },
        { t: '拒绝，过自己的日子|Refuse and keep your own life', run: function (c) { c.p.flags.throneFate = null; return '你把信折好，放进了抽屉。|You folded the letter and put it in a drawer.'; } }
      ] }
  ]);

  /* ================= calmer scandals ================= */
  (function () {
    var d = G.EV.sys_scandal; if (!d) return;
    var p0 = d.prep;
    d.prep = function (c) { var p = c.p; p.flags.scandals = p.flags.scandals || 0; if (p.flags.scandals >= 3 || (p.flags.scandalY && S().year - p.flags.scandalY < 6)) return false; if (G.ch(.55) && p.h.karma > -10) return false; p.flags.scandals++; p.flags.scandalY = S().year; return p0 ? p0.apply(this, arguments) : true; };
  })();

  /* ================= how people died ================= */
  function causeFor(n) {
    var a = N.age(n);
    if (a < 1) return G.pick(['先天疾病|A congenital illness', '早产并发症|Complications of premature birth']);
    if (a < 18) return G.pick(['白血病|Leukemia', '溺水|Drowning', '交通意外|A traffic accident', '急性肺炎|Acute pneumonia', '先天性心脏病|A heart defect']);
    if (a < 50) return G.pick(['车祸|A car crash', '突发心梗|A sudden heart attack', '癌症|Cancer', '意外事故|An accident', '过劳|Overwork']);
    if (a < 75) return G.pick(['癌症|Cancer', '心脏病|Heart disease', '中风|A stroke', '肺病|Lung disease', '糖尿病并发症|Complications of diabetes']);
    return G.pick(['寿终正寝|Old age, peacefully', '寿终正寝|Old age, peacefully', '心力衰竭|Heart failure', '肺炎|Pneumonia', '睡梦中安详离世|Passed peacefully in their sleep']);
  }
  var nt9 = N.tick;
  N.tick = function () {
    var r = nt9.apply(this, arguments);
    N.all(function (n) { return !n.alive && !n.cause; }).forEach(function (n) { n.cause = n.jail ? '狱中病逝|Illness in prison' : causeFor(n); });
    return r;
  };
  G.graves = function () { return N.all(function (n) { return !n.alive && (n.pin || ['father', 'mother', 'grand', 'spouse', 'child', 'sibling', 'grandchild', 'friend', 'lover', 'ex'].indexOf(n.rel) >= 0); }).sort(function (a, b) { return (b.died || 0) - (a.died || 0); }); };

  /* ================= children who break the law; visiting them ================= */
  var CRIMES = {
    tech: [['入侵银行系统|Hacking into a bank', 5], ['金融诈骗|Financial fraud', 6], ['倒卖用户数据|Selling user data', 4]],
    rich: [['醉驾撞人|Drunk-driving crash', 3], ['聚众斗殴|Brawling', 2], ['无证驾驶|Driving without a license', 1]],
    any: [['盗窃|Theft', 2], ['打架伤人|Assault', 2], ['诈骗|Fraud', 4]]
  };
  var ft9 = FA.tick;
  FA.tick = function (Q) {
    var r = ft9.apply(this, arguments), s = S(), p = s.p;
    N.rel('child').forEach(function (k) {
      if (!k.alive) return; var a = N.age(k);
      if (k.jail) { if (s.year >= k.jail.y + k.jail.yrs) { var was = k.jail; k.jail = null; k.job = '刑满释放|Released'; k.unemp = 1; Q.push({ id: 'k_release', nid: k.id }); if (G.npcStory) G.npcStory(k, '{n}服刑期满，出狱了。|{n} served the sentence and was released.', { n: k.name }); } else { k.job = '服刑中|In prison'; k.inc = 0; } return; }
      if (a < 16 || a > 60 || k.crowned) return;
      var pot = G.kidScore ? G.kidScore(k).v : 50, risk = .004 + (pot < 45 ? .008 : 0) + (k.aff < 20 ? .01 : 0) + (['rebel', 'lazy'].indexOf(k.pers) >= 0 ? .006 : 0) + (pot >= 85 ? .004 : 0) + ((k.wealth || 0) > G.$(5e5) && a < 30 ? .004 : 0);
      if (G.ch(risk)) Q.push({ id: 'k_crime', nid: k.id });
    });
    // the family's great works pay every year
    var L = s.legacy; if (L && L.mega) { var tot = 0; Object.keys(L.mega).forEach(function (id) { var m = MEGA_BY[id]; if (m) tot += Math.round(G.$(m.cost) * m.ret); }); if (tot) { p.money += tot; if (G.fin) G.fin.add('in', '百亿项目回报|Mega-project returns', tot); } }
    // a great work in progress
    var pr = p.mega; if (pr) megaYear(pr, Q);
    // a reborn heir's appointment with a throne
    var tf = p.flags.throneFate; if (tf && s.year >= tf.y && p.age >= 18 && !p.flags.monarch) Q.push({ id: 'my_throne' });
    return r;
  };
  var grow9 = FA.growKid;
  FA.growKid = function (k) { var r = grow9.apply(this, arguments); if (k && k.jail) { k.job = '服刑中|In prison'; k.inc = 0; k.jobBase = null; k.jobT = null; } return r; };
  G.evs([
    { id: 'k_crime', sys: 1, title: function (c) { return G.L('{n}被捕了|{n} Has Been Arrested', { n: c.npc.name }); }, icon: '🚔', bad: 1,
      prep: function (c) { var k = c.npc; if (!k || !k.alive || k.jail) return false; var pot = G.kidScore ? G.kidScore(k).v : 50; var L = pot >= 80 ? CRIMES.tech : (k.wealth || 0) > G.$(5e5) || (G.famClass && G.famClass() >= 2) ? CRIMES.rich : CRIMES.any; c.cr = G.pick(L); c.prm.x = c.cr[0]; c.law = G.$(G.ri(8, 30) * 10000); c.prm.m = G.M(c.law); },
      t: '电话那头是警察：{n}因为“{x}”被捕了。|It\'s the police on the phone: {n} has been arrested for "{x}".',
      o: [
        { t: '请最好的律师（{m}）|Hire the best lawyer ({m})', dis: function (c) { return !G.canPay(c.law); }, run: function (c) { G.pay(c.law); var k = c.npc; if (G.ch(.35)) { G.dPush('aff', N.addAff(k, 15)); if (G.npcStory) G.npcStory(k, '{n}被控{x}，律师帮{him}脱了罪。|{n} was charged with {x}; the lawyer got {him} off.', c.prm); return '律师找到了程序漏洞，{n}当庭释放。|The lawyer found a procedural flaw; {n} walked free from court.'; } k.jail = { y: S().year, yrs: Math.max(1, c.cr[1] - 2), crime: c.cr[0] }; k.job = '服刑中|In prison'; G.dPush('aff', N.addAff(k, 10)); return '刑期从轻，判了{y}年。{n}在法庭上回头看了你一眼。|A lighter sentence: {y} years. {n} looked back at you in the courtroom.'.replace(/\{y\}/g, k.jail.yrs); } },
        { t: '让法律来决定|Let the law decide', run: function (c) { var k = c.npc; k.jail = { y: S().year, yrs: c.cr[1], crime: c.cr[0] }; k.job = '服刑中|In prison'; G.dPush('aff', N.addAff(k, -6)); if (G.npcStory) G.npcStory(k, '{n}因{x}入狱。|{n} went to prison for {x}.', c.prm); return '{n}被判了{y}年。|{n} was sentenced to {y} years.'.replace(/\{y\}/g, k.jail.yrs); } },
        { t: '和{n}断绝关系|Cut {n} off', run: function (c) { var k = c.npc; k.jail = { y: S().year, yrs: c.cr[1], crime: c.cr[0] }; k.job = '服刑中|In prison'; G.dPush('aff', N.addAff(k, -40)); c.add('karma', -3); return '你对记者说：“我没有这个孩子。”|You told the reporters: "I have no such child."'; } }
      ] },
    { id: 'k_release', sys: 1, title: function (c) { return G.L('{n}出狱了|{n} Is Out', { n: c.npc.name }); }, icon: '🚪',
      prep: function (c) { if (!c.npc || !c.npc.alive) return false; },
      t: '监狱的大门打开，{n}拎着一个塑料袋走了出来，比你记忆中瘦了很多。|The prison gate opens and {n} walks out with a plastic bag, much thinner than you remember.',
      o: [
        { t: '在门口等{him}，带{him}回家|Be waiting at the gate and bring {him} home', run: function (c) { G.dPush('aff', N.addAff(c.npc, 20)); c.add('happy', 4); return '{n}在车上哭了，一句话都没说。|{n} cried in the car without a word.'; } },
        { t: '帮{him}找份工作，重新开始|Find {him} a job and a fresh start', run: async function (c) { G.dPush('aff', N.addAff(c.npc, 10)); var r = G.findKidJob ? await G.findKidJob(c.npc) : null; return r || '慢慢来，日子还长。|Take it slowly; there\'s time.'; } },
        { t: '不去接|Don\'t go', run: function (c) { G.dPush('aff', N.addAff(c.npc, -12)); return '{n}在门口站了很久，才一个人走了。|{n} stood at the gate a long time, then left alone.'; } }
      ] }
  ]);
  var acts9 = G.npcActs;
  G.npcActs = function (n) {
    var L = acts9.apply(this, arguments) || [];
    if (n.alive && n.jail && n.rel === 'child') {
      L = L.filter(function (a) { return ['kfindjob', 'kjob', 'kallow', 'abroad', 'kvisa', 'date', 'gift'].indexOf(a.id) < 0; });
      L.unshift({ id: 'kvisit', n: '去监狱探望|Visit in Prison', i: '🏢', e: 10, run: async function (k, a) {
        G.dStart(); G.dPush('aff', N.addAff(k, G.ri(8, 14))); G.addStat('happy', -2); var dl = G.dEnd();
        var t = G.pick(['隔着玻璃，{n}拿起电话，第一句话是：“家里还好吗？”|Through the glass, {n} picks up the phone. First words: "Is everyone at home all right?"', '{n}说里面的饭很难吃，但{he}在学做木工。|{n} says the food inside is awful, but {he}\'s learning carpentry.', '探视时间只有半小时。你们一直在笑，直到狱警说“时间到”。|Visiting time is half an hour. You laughed the whole time — until the guard said "Time\'s up."']);
        return G.result(a.n, G.L(t, Object.assign({ n: k.name }, G.pr(k.g))), null, dl, a.i);
      } });
      L.splice(1, 0, { id: 'kcommissary', n: '往狱中账户存钱|Put Money in Their Prison Account', i: '💳', e: 0, run: async function (k, a) { var m = G.$(500); if (!G.pay(m)) return 'cancel'; G.dStart(); G.dPush('aff', N.addAff(k, 5)); var dl = G.dEnd(); return G.result(a.n, G.L('{n}可以买点肥皂和饼干了。|{n} can buy some soap and biscuits now.', { n: k.name }), null, dl, a.i); } });
    }
    return L;
  };
  var info9 = G.npcInfo;
  G.npcInfo = function (n) { var r = info9.apply(this, arguments) || []; if (n.jail) r.push(['状态|Status', G.L('因“{x}”服刑中，{y}年出狱|Serving time for "{x}", out in {y}', { x: G.T(n.jail.crime || '—'), y: n.jail.y + n.jail.yrs })]); if (!n.alive && n.cause) r.push(['死因|Cause of death', n.cause]); return r; };

  /* ================= the family's great works ================= */
  var MEGA = G.MEGA = [
    { id: 'bridge', n: '跨海大桥|The Sea Bridge', i: '🌉', d: '一座连通两座城市的世纪大桥|A bridge of the century joining two cities', cost: 1.2e9, yrs: 5, fame: 40, smarts: 55, ret: .06 },
    { id: 'desert', n: '沙漠变绿洲|Greening the Desert', i: '🌵', d: '让寸草不生的荒漠长出森林|Turning barren desert into forest', cost: 1.6e9, yrs: 6, fame: 50, smarts: 60, ret: .05, karma: 20 },
    { id: 'ark', n: '文明方舟|The Ark of Civilization', i: '🏛️', d: '在极地冰层下保存人类所有的种子和知识|Preserving every seed and book of humankind beneath the polar ice', cost: 2e9, yrs: 5, fame: 65, smarts: 70, ret: .04, karma: 25 },
    { id: 'rail', n: '洲际高铁|The Intercontinental Railway', i: '🚄', d: '十二个小时，从大陆的一端到另一端|Twelve hours from one end of the continent to the other', cost: 3e9, yrs: 8, fame: 60, smarts: 62, ret: .07 },
    { id: 'cure', n: '攻克癌症|Curing Cancer', i: '🧬', d: '一种对所有癌症都有效的疗法|One therapy that works against every cancer', cost: 4e9, yrs: 8, fame: 65, smarts: 78, ret: .08, karma: 30, risk: .3 },
    { id: 'fusion', n: '人造太阳|An Artificial Sun', i: '☀️', d: '可控核聚变电站，无尽的清洁能源|A fusion power plant: endless clean energy', cost: 6e9, yrs: 10, fame: 72, smarts: 82, ret: .1, risk: .3 },
    { id: 'ocean', n: '深海之城|A City Under the Sea', i: '🐋', d: '在两千米深的海底，建一座能住十万人的城|A city for 100,000 people, two kilometers beneath the waves', cost: 8e9, yrs: 10, fame: 78, smarts: 78, ret: .08 },
    { id: 'moon', n: '月球基地|A Base on the Moon', i: '🌕', d: '人类第一座永久月球基地|Humanity\'s first permanent base on the Moon', cost: 1.5e10, yrs: 12, fame: 85, smarts: 85, ret: .09, risk: .25 },
    { id: 'elevator', n: '太空电梯|The Space Elevator', i: '🛰️', d: '一根直通太空的缆绳，坐电梯去轨道|A cable to orbit — ride an elevator into space', cost: 3e10, yrs: 15, fame: 95, smarts: 90, ret: .12, risk: .3 },
    { id: 'mars', n: '火星之城|A City on Mars', i: '🚀', d: '让人类成为跨星球的物种|Making humanity a multi-planet species', cost: 5e10, yrs: 20, fame: 100, smarts: 92, ret: .15, risk: .35 }
  ];
  var MEGA_BY = {}; MEGA.forEach(function (m) { MEGA_BY[m.id] = m; });
  G.megaDone = function () { var L = S() && S().legacy; return L && L.mega ? Object.keys(L.mega).length : 0; };
  function megaLock(m) {
    var s = S(), p = s.p, L = s.legacy || {};
    if (L.mega && L.mega[m.id]) return G.T('✓ 家族已建成（{y}年，第{g}代）· 每年回报{r}|✓ Built by the family ({y}, gen {g}) · returns {r} a year', { y: L.mega[m.id].y, g: L.mega[m.id].gen, r: G.M(Math.round(G.$(m.cost) * m.ret)) });
    if (p.mega) return p.mega.id === m.id ? G.T('建设中：第{a}/{b}年|Under construction: year {a} of {b}', { a: p.mega.done + 1, b: m.yrs }) : G.T('家族正在建设另一个百亿项目|The family is already building another mega project');
    var miss = [];
    if (p.st.fame < m.fame) miss.push(G.T('名声 ≥ {v}|Fame ≥ {v}', { v: m.fame }));
    if (p.money < G.$(m.cost)) miss.push(G.T('现金 ≥ {v}|Cash ≥ {v}', { v: G.M(G.$(m.cost)) }));
    if (p.st.smarts < m.smarts) miss.push(G.T('智力 ≥ {v}|Smarts ≥ {v}', { v: m.smarts }));
    return miss.length ? G.T('需要：|Needs: ') + miss.join(' · ') : null;
  }
  function megaYear(pr, Q) {
    var m = MEGA_BY[pr.id], s = S(), p = s.p; if (!m) { p.mega = null; return; }
    var due = Math.round(G.$(m.cost) * .7 / m.yrs);
    if (p.money < due) { pr.stall = (pr.stall || 0) + 1; G.log('【{x}】资金跟不上，工地停工了。|[{x}] The money ran short and the site went quiet.', { x: m.n }); if (pr.stall >= 3) Q.push({ id: 'mega_stall' }); return; }
    p.money -= due; if (G.fin) G.fin.add('out', G.L('百亿项目：{x}|Mega project: {x}', { x: m.n }), due); pr.done++;
    if (pr.done < m.yrs && G.ch(.45)) Q.push({ id: 'mega_turn' });
    if (pr.done >= m.yrs) Q.push({ id: 'mega_done' });
  }
  G.evs([
    { id: 'mega_turn', sys: 1, title: function (c) { return G.L('{x}：转折|{x}: A Turning Point', { x: MEGA_BY[c.p.mega.id].n }); }, icon: '🏗️',
      prep: function (c) { if (!c.p.mega) return false; c.m = MEGA_BY[c.p.mega.id]; c.k = G.pick(['tech', 'protest', 'boom', 'rival']); c.extra = Math.round(G.$(c.m.cost) * .1); c.prm.m = G.M(c.extra); c.prm.x = c.m.n; },
      t: function (c) { return { tech: '工程师们遇到了从没见过的技术难题，进度卡住了。追加{m}能请来全世界最好的团队。|The engineers hit a problem no one has seen before. Another {m} would bring in the best team in the world.', protest: '工地外聚集了抗议的人群，说工程会毁了他们的家园。|Protesters gather outside the site, saying the project will destroy their homes.', boom: '一个年轻工程师提出了大胆的新方案，可能让工期大大缩短。|A young engineer proposes a bold new design that could cut years off the schedule.', rival: '另一个国家宣布要做同样的项目，抢人、抢供应商。|Another country announces the same project and starts poaching people and suppliers.' }[c.k]; },
      o: [
        { t: '追加投资，全力推进|Invest more and push on', dis: function (c) { return c.p.money < c.extra; }, run: function (c) { c.money(-c.extra); if (c.k === 'protest') { c.add('karma', 3); return '你出钱给居民修了新家。抗议的人散了。|You paid to build the residents new homes. The protesters went home.'; } c.p.mega.done = Math.min(c.m.yrs - 1, c.p.mega.done + 1); return '进度一下子快了一年。|Progress jumped ahead a full year.'; } },
        { t: '稳一点，按原计划|Steady — stick to the plan', run: function (c) { if (c.k === 'boom' && G.ch(.5)) { c.p.mega.done = Math.min(c.m.yrs - 1, c.p.mega.done + 1); return '年轻人的方案还是被试了一部分，效果不错。|Part of the young engineer\'s idea got tried anyway — and it worked.'; } if (c.k === 'protest') { c.add('fame', -3); c.add('karma', -2); } return '工程一步一步往前走。|The work moves on, step by step.'; } },
        { t: '冒险押注|Take a gamble', run: function (c) { if (G.ch(.5 - (c.m.risk || 0) / 2)) { c.p.mega.done = Math.min(c.m.yrs - 1, c.p.mega.done + 2); c.add('fame', 4); return '赌对了！工期缩短了两年。|The gamble paid off — two years saved.'; } c.p.mega.done = Math.max(0, c.p.mega.done - 1); c.add('happy', -5); return '失败了，一部分工程要推倒重来。|It failed; part of the work has to be torn down and redone.'; } }
      ] },
    { id: 'mega_done', sys: 1, title: function (c) { return G.L('{x}竣工了|{x} Is Complete', { x: MEGA_BY[c.p.mega.id].n }); }, icon: '🎆', good: 1,
      prep: function (c) { if (!c.p.mega) return false; c.m = MEGA_BY[c.p.mega.id]; c.prm.x = c.m.n; c.prm.r = G.M(Math.round(G.$(c.m.cost) * c.m.ret)); },
      t: '剪彩那天，全世界的镜头都对着你。{x}建成了——从今以后，它每年为家族带来{r}的回报，一代一代传下去。|On opening day, every camera in the world points at you. {x} is complete — and from now on it returns {r} a year to the family, generation after generation.',
      o: [{ t: '把这一刻留给家族|Let this moment belong to the family', run: function (c) { var s = S(), m = c.m; s.legacy = s.legacy || {}; s.legacy.mega = s.legacy.mega || {}; s.legacy.mega[m.id] = { y: s.year, gen: s.gen || 1, by: c.p.name }; c.p.mega = null; c.add('fame', 15); c.add('happy', 15); if (m.karma) c.add('karma', m.karma); G.major('建成百亿项目：{x}|Completed the mega project: {x}', { x: m.n }); G.inc('mega'); return '家族史上又多了一行字。|One more line in the family history.'; } }] },
    { id: 'mega_stall', sys: 1, title: '工地停摆|The Site Stands Still', icon: '🚧', bad: 1,
      prep: function (c) { if (!c.p.mega) return false; c.m = MEGA_BY[c.p.mega.id]; c.prm.x = c.m.n; },
      t: '{x}已经停工三年了，生锈的塔吊立在那里。|{x} has stood idle for three years; the cranes are rusting.',
      o: [
        { t: '咬牙坚持，等钱回来|Hold on until the money comes back', run: function (c) { c.p.mega.stall = 0; c.add('happy', -4); return '你没有放弃。|You didn\'t give up.'; } },
        { t: '放弃项目|Abandon the project', run: function (c) { c.p.mega = null; c.add('fame', -10); c.add('happy', -12); return '投进去的钱打了水漂，但你终于能睡个好觉了。|Everything you put in was lost — but at least you could sleep again.'; } }
      ] }
  ]);
  G.ACT_CATS.push({ id: 'mega', n: '百亿项目|Mega Projects', i: '🚀', items: MEGA.map(function (m) {
    return { id: 'mega_' + m.id, n: m.n, i: m.i, d: m.d, e: 0, a: [20, 110], lock: function () { return megaLock(m); },
      run: async function (a) {
        var p = S().p, first = Math.round(G.$(m.cost) * .3);
        if (!(await G.UI.confirm(G.L(m.n), G.L('总投资{t}，先付{f}，剩下的在{y}年里分期投入。中途资金断了就会停工。确定开工吗？|Total cost {t}: {f} up front, the rest over {y} years. If the money runs out, work stops. Break ground?', { t: G.M(G.$(m.cost)), f: G.M(first), y: m.yrs })))) return 'cancel';
        G.addMoney(-first); p.mega = { id: m.id, done: 0, y: S().year };
        G.major('开工建设{x}|Broke ground on {x}', { x: m.n });
        return G.quick(a, G.L('奠基仪式上，你铲下了第一锹土。{x}开工了。|At the groundbreaking you turned the first spadeful of earth. {x} has begun.', { x: m.n }), { fame: 5, happy: 5 });
      } };
  }) });

  /* ================= new stories ================= */
  G.evs([
    E('a_grave_day', [8, 110], '忌日|An Anniversary', '🕯️', '今天是{n}离开的日子。|Today is the anniversary of {n}\'s passing.', [
      O('去墓地看看|Visit the grave', function (c) { H.fx(c, { happy: 2, karma: 1 }); c.prm.x = G.T(c.npc.cause || ''); return '你在墓前坐了很久，把这一年发生的事都说了一遍。|You sat by the grave a long while and told {him} everything that happened this year.'; }),
      O('在家里点一支蜡烛|Light a candle at home', R('烛光里，你好像又看见了{n}的笑。|In the candlelight you almost saw {n}\'s smile again.', { happy: 1 }))
    ], { rep: 1, cd: 5, prep: function (c) { var g = G.graves().filter(function (n) { return ['child', 'spouse', 'father', 'mother'].indexOf(n.rel) >= 0 || n.rel === 'grand'; })[0]; if (!g) return false; setN(c, g); } }),
    E('t_rebel_tattoo', [15, 18], '偷偷文身|A Secret Tattoo', '🖋️', '你看上了一个文身图案，可爸妈肯定不会同意。|You\'ve fallen for a tattoo design. Your parents would never agree.', [
      O('偷偷去文|Get it in secret', RC(.5, '藏了半年，最后还是被发现了。妈妈哭了，爸爸笑了。|You hid it for six months before they found out. Mom cried; Dad laughed.', { happy: 5, par: -4 }, '文身师手一抖，图案歪了。你后悔了一整年。|The artist\'s hand slipped and it came out crooked. You regretted it for a year.', { happy: -4, looks: -1 })),
      O('等成年再说|Wait until you\'re an adult', R('你把图案存进了手机相册。|You saved the design in your phone.', { eq: 2 }))
    ]),
    E('t_runaway', [13, 17], '离家出走|Running Away', '🎒', '和爸妈大吵一架后，你收拾了书包，摔门而出。|After a huge fight with your parents, you packed your bag and slammed the door.', [
      O('去好朋友家躲一晚|Hide at a friend\'s house for the night', R('第二天早上，你自己回家了。桌上摆着你最爱吃的菜。|Next morning you went home on your own. Your favorite dish was waiting on the table.', { happy: 3, par: 3, eq: 2 })),
      O('坐上去远方的火车|Get on a train going far away', RC(.6, '你在陌生的城市晃了两天，警察把你送回了家。爸妈一夜白头。|You wandered a strange city for two days until the police brought you home. Your parents had aged overnight.', { happy: -3, par: -6, eq: 3 }, '你在车站被骗光了钱，饿着肚子打电话回家。|At the station you were robbed of everything, and called home hungry.', { happy: -8, par: 2 }))
    ], { if: function (S2, p) { return H.par().length > 0; } }),
    E('a_spouse_midlife', [38, 55], '配偶的中年危机|Your Spouse\'s Midlife Crisis', '🏍️', '{n}突然买了一辆摩托车，还说想辞职去环游世界。|{n} suddenly bought a motorcycle and says they want to quit and travel the world.', [
      O('支持{him}去|Support {him}', function (c) { H.fx(c, { love: 10, happy: 2 }); if (G.npcStory) G.npcStory(c.npc, '{n}辞职去环游世界了半年。|{n} quit to travel the world for six months.', { n: c.npc.name }); return '半年后{n}晒黑了一圈回来，抱着你说：“还是家里好。”|Six months later {n} came home tanned and said, holding you: "Home is best."'; }),
      O('一起去|Go together', function (c) { var m = c.$(30000); c.money(-Math.min(Math.max(0, c.p.money), m)); H.fx(c, { love: 15, happy: 10 }); return '你们骑着摩托车穿过了三个国家。|The two of you rode that motorcycle through three countries.'; }),
      O('劝{him}冷静|Talk {him} down', R('{n}把摩托车卖了。之后好几个月都闷闷不乐。|{n} sold the motorcycle and moped for months.', { love: -6 }))
    ], { prep: function (c) { var sp = N.spouse(); if (!sp || !sp.alive || N.age(sp) < 38 || N.age(sp) > 56) return false; setN(c, sp); } }),
    E('o_city_move', [60, 90], '接你进城|Moving to the City', '🏙️', '{n}在城里买了大房子，非要接你过去一起住。|{n} has bought a big place in the city and insists you come live there.', [
      O('去|Go', R('电梯、地铁、外卖……你学了好几个月。孙辈教你用手机点菜。|Elevators, subways, food delivery — it took months to learn. The grandkids taught you to order on your phone.', { happy: 6, npc: 10 })),
      O('故土难离|You can\'t leave home', R('你说：“我在这儿住了一辈子，哪儿也不去。”{n}每个周末都开车回来看你。|"I\'ve lived here my whole life; I\'m not going anywhere." {n} drives back every weekend.', { happy: 3, npc: 4 }))
    ], { prep: function (c) { var k = N.rel('child').filter(function (x) { return x.alive && (x.wealth || 0) > G.$(150000); })[0]; if (!k) return false; setN(c, k); } }),
    E('a_family_history', [30, 90], '家族的故事|The Family Story', '📜', '一个出版社想为你的家族写一本书，从第一代讲起。|A publisher wants to write a book about your family, starting from the first generation.', [
      O('同意，把老故事都讲出来|Agree, and tell all the old stories', R('书出版后，你在扉页上看到了所有先人的名字。|When the book came out, you found every ancestor\'s name on the first page.', { fame: 5, happy: 6 })),
      O('家丑不可外扬|Some things stay in the family', R('你婉拒了。有些事，只属于这个家。|You declined. Some things belong only to the family.', { karma: 1 }))
    ], { if: function (S2) { return (S2.lineage || []).length >= 1 || (G.megaDone && G.megaDone() > 0); } })
  ]);
})();
