/* Regular jobs, fame careers, companies */
(function () {
  'use strict';
  var CR = G.career = {};
  var STEM = '星辰|Stellar,华腾|Huateng,远航|Voyager,蓝鲸|Blue Whale,金石|Goldstone,未来|Future,鼎盛|Pinnacle,极光|Aurora,云图|Cloudmap,启明|Dawnstar,天元|Tianyuan,恒信|Everfaith,新锐|Nova,长风|Longwind,博远|Broadview,锦程|Brightpath'.split(',');
  var SUF = { tech: '科技|Technologies', biz: '集团|Group', med: '医院|Hospital', edu: '学校|Academy', law: '律师事务所|Law LLP', svc: '服务公司|Services', blue: '制造厂|Manufacturing', art: '传媒|Media', gov: '局|Bureau', self: '工作室|Studio' };
  CR.coName = function (cat) {
    var s = G.pick(STEM), f = SUF[cat] || '有限公司|Co., Ltd.';
    return G.L('{a}{b}|{a} {b}', { a: s, b: f });
  };
  CR.jobName = function () { var p = G.S.p; if (!p.job) return ''; var j = G.JOB[p.job.id]; return j.r[Math.min(p.job.rank, j.r.length - 1)]; };
  CR.salary = function (j, rank) { return G.$w(j.pay[Math.min(rank, j.pay.length - 1)]); };

  /* qualification & chance */
  CR.qualify = function (j) {
    var p = G.S.p, e = p.edu, miss = [], ch = j.pt ? .8 : .68 - (j.pay && j.pay[0] > 60000 ? .08 : 0);
    if (e.deg < j.deg) { miss.push(G.L('需要{d}学历|Needs {d}', { d: G.DEG[j.deg] })); ch -= .45; }
    if (j.maj && j.maj.indexOf(e.major) < 0 && !(e.deg >= 5 && j.deg <= 4 && G.ch(0))) { miss.push(G.L('专业不对口|Wrong major')); ch -= .35; }
    if (j.req) for (var k in j.req) { if (p.st[k] < j.req[k]) { miss.push(G.L('{s}不足{v}|{s} below {v}', { s: G.STATS[k].n, v: j.req[k] })); ch -= .15 + (j.req[k] - p.st[k]) / 100; } }
    if (j.age && p.age < j.age) { miss.push(G.L('年龄不够|Too young')); ch = 0; }
    if (p.crime.rec && (j.cat === 'gov' || j.cat === 'law' || j.cat === 'edu' || j.cat === 'med')) { miss.push(G.L('有犯罪记录|Criminal record')); ch -= .5; }
    // university prestige: elite graduates get callbacks everywhere, especially in finance, tech, law and consulting
    if (e.tier && e.deg >= 4) { ch += (e.tier - 2.5) * .09; if (e.tier >= 4 && ['biz', 'tech', 'law', 'gov', 'med'].indexOf(j.cat) >= 0) ch += .08; }
    ch += (p.st.eq - 50) / 400 + (p.st.looks - 50) / 800;
    if (p.age > 45 && !j.pt) ch -= (p.age - 45) * .015;
    if (G.has('hacker') && (j.id === 'coder' || j.id === 'ai')) ch += .15;
    return { ok: !miss.length, miss: miss, ch: G.clamp(ch, .02, .95) };
  };
  CR.listings = function (n) {
    var S = G.S, p = S.p, student = G.school.isStudent() || p.age < 18;
    var pool = G.JOBS.filter(function (j) {
      if (!G.jobOk(j)) return false;
      if (student) return !!j.pt && p.age >= (j.age || 16);
      if (j.pt) return p.age < 25;
      return true;
    });
    pool = G.shuffle(pool);
    // prefer jobs that match major/degree
    pool.sort(function (a, b) { return (CR.qualify(b).ok ? 1 : 0) - (CR.qualify(a).ok ? 1 : 0) + G.rf(-.6, .6); });
    return pool.slice(0, n || 9);
  };
  CR.hire = function (j) {
    var p = G.S.p;
    if (p.job) CR.leave(true);
    var e = p.edu, prest = (!j.pt && e.tier && e.deg >= 4) ? 1 + (e.tier - 3) * .09 + (e.deg >= 5 ? .08 : 0) : 1;
    var sal = Math.round(CR.salary(j, 0) * G.rf(.9, 1.1) * prest);
    p.job = { id: j.id, rank: 0, perf: 50, yrs: 0, yr: 0, sal: sal, co: CR.coName(j.cat), eff: 0 };
    if (!j.pt) {
      var boss = G.N.make({ rel: 'boss', age: G.ri(35, 55), job: G.L('{c}主管|Manager at {c}', { c: p.job.co }), inc: sal * 2.5 });
      p.job.boss = boss.id;
      for (var i = 0; i < G.ri(1, 3); i++) G.N.make({ rel: 'colleague', age: G.clamp(p.age + G.ri(-8, 12), 18, 64), job: j.n, inc: sal });
      G.major('入职{c}，成为{j}|Joined {c} as a {j}', { c: p.job.co, j: j.r[0] });
    }
    G.inc('jobs');
  };
  CR.leave = function (silent) {
    var p = G.S.p; if (!p.job) return;
    G.N.rel('colleague', 'boss').forEach(function (n) { if (n.aff < 50) delete G.S.npcs[n.id]; else n.rel = 'friend'; });
    p.job = null;
  };
  /* interactive job search */
  CR.search = async function (c) {
    var list = CR.listings(9);
    if (!list.length) { G.UI.toast(G.L('现在没有合适的岗位。|No suitable openings right now.')); return; }
    var items = list.map(function (j) {
      var q = CR.qualify(j);
      return { t: j.r[0], sub: G.L('{s}/年 · {q}|{s}/yr · {q}', { s: G.M(CR.salary(j, 0)), q: q.ok ? G.L('符合要求|Qualified') : q.miss.join(' / ') }), icon: q.ok ? '✅' : '⚠️' };
    });
    var i = await G.UI.pick({ title: G.L('求职|Job Search'), text: G.L('选择一个岗位投递简历。|Pick a position to apply for.'), items: items });
    if (i < 0) return;
    var j = list[i], q = CR.qualify(j);
    var r = j.pt ? { score: .6 } : await G.UI.game('quiz', { name: G.L('{j}面试|{j} Interview', { j: j.r[0] }), n: 4 });
    var ch = q.ch + (r.score - .5) * .4;
    if (G.ch(ch)) {
      CR.hire(j);
      await G.result('录用通知|Job Offer', '你被录用为{j}，年薪{s}。|You were hired as a {j}. Salary: {s}/yr.', { j: j.r[0], s: G.M(G.S.p.job.sal) }, [], '💼');
    } else {
      G.addStat('happy', -3);
      await G.result('面试结果|Interview Result', '很遗憾，{j}的面试没有通过。|Unfortunately, you didn\'t get the {j} job.', { j: j.r[0] }, [], '📭');
    }
  };

  CR.tick = function (Q) {
    var S = G.S, p = S.p, j = p.job;
    if (!j) return;
    var J = G.JOB[j.id];
    if (!J) { p.job = null; return; }
    j.yrs++; j.yr++;
    var tgt = p.st.smarts * .23 + p.st.eq * .18 + j.eff * 8 + p.st.happy * .1 + G.ri(-12, 10) - (p.st.health < 40 ? 10 : 0) - (p.h.stress > 80 ? 6 : 0) - j.rank * 2;
    j.perf = G.clamp(Math.round(j.perf * .6 + tgt * .4), 0, 100);
    j.eff = 0;
    // inflation & seniority raise
    var g = G.eraIdx(p.country, S.year) / G.eraIdx(p.country, S.year - 1);
    j.sal = Math.round(j.sal * g * (1 + (j.perf > 60 ? .02 : 0)));
    G.addStat('stress', (J.st || 2) * 2 - 3, true);
    if (J.fame && j.rank >= 2) G.addStat('fame', 1, true);
    if (J.pt) { if (p.age >= 24 && !G.school.isStudent()) { CR.leave(); G.log('你辞掉了兼职。|You quit your part-time job.'); } return; }
    // retirement
    var ret = G.C[p.country].retire || 60;
    if (p.age >= ret && !p.flags.noRetire) { Q.push({ id: 'sys_retire' }); return; }
    // layoff
    var wj = S.world.jobShock || 0;
    var lay = .01 + (j.perf < 35 ? .1 : 0) + wj * .6;
    if (G.ch(lay)) { Q.push({ id: 'sys_fired' }); return; }
    // promotion
    if (j.rank < J.r.length - 1 && j.yr >= 2 && j.perf >= 55 + j.rank * 6) {
      var ch = .36 + (j.perf - 60) / 100 + (G.has('leader') ? .12 : 0) + (p.st.eq - 50) / 300 + (p.edu.tier && p.edu.deg >= 4 ? (p.edu.tier - 3) * .04 : 0);
      if (G.ch(ch)) Q.push({ id: J.assess ? 'sys_assess' : 'sys_promo', prm: { k: 'job' } });
    }
  };
  CR.promote = function () {
    var p = G.S.p, j = p.job, J = G.JOB[j.id];
    j.rank++; j.yr = 0;
    var ns = CR.salary(J, j.rank);
    j.sal = Math.max(Math.round(j.sal * 1.15), ns);
    G.major('升职为{r}|Promoted to {r}', { r: J.r[j.rank] });
    G.inc('promos');
    return J.r[j.rank];
  };

  G.evs([
    { id: 'sys_promo', sys: 1, title: '升职|Promotion', icon: '📈',
      t: function (c) { return G.L('老板很欣赏你，决定提拔你为{r}。|Your boss is impressed and wants to promote you to {r}.', { r: G.JOB[c.p.job.id].r[c.p.job.rank + 1] }); },
      o: [
        { t: '欣然接受|Accept gladly', run: function (c) { var r = CR.promote(); c.add('happy', 8); return G.L('你升职为{r}，薪水涨到{s}！|You are now {r}, earning {s}!', { r: r, s: G.M(c.p.job.sal) }); } },
        { t: '谦虚推辞，留在原岗位|Decline politely', run: function (c) { c.add('happy', 2); c.add('stress', -5); return '你婉拒了晋升，日子轻松一些。|You turned it down and kept life easy.'; } }
      ] },
    { id: 'sys_fired', sys: 1, title: '被裁员了|Laid Off', icon: '📦', bad: 1,
      t: function (c) { return G.L('公司裁员，你的名字出现在名单上。你失去了{j}的工作。|The company is downsizing, and your name is on the list. You lost your job as a {j}.', { j: CR.jobName() }); },
      run: function (c) { var comp = Math.round(c.p.job.sal * G.rf(.1, .5)); CR.leave(); c.money(comp); c.add('happy', -12); G.inc('fired'); return G.L('拿到{m}补偿金。|You received {m} in severance.', { m: G.M(comp) }); } },
    { id: 'sys_retire', sys: 1, title: '退休|Retirement', icon: '🌅',
      t: '你到了退休年龄。|You have reached retirement age.',
      o: [
        { t: '光荣退休|Retire with honor', run: function (c) { CR.retire(); return G.L('你正式退休了，每年领取{m}养老金。|You officially retired with a pension of {m}/yr.', { m: G.M(c.p.pension) }); } },
        { t: '返聘继续干|Keep working', run: function (c) { c.p.flags.noRetire = 1; c.add('stress', 5); return '公司返聘了你，你还想再干几年。|The company rehires you. You want to keep going a few more years.'; } }
      ] }
  ]);
  CR.retire = function () {
    var p = G.S.p, base = 0;
    if (p.job) base = p.job.sal; else if (p.gov) base = G.$w(G.CIVIL.pay[p.gov.rank]); else if (p.mil) base = G.$w(p.mil.off ? G.MIL.offPay[p.mil.rank] : G.MIL.enlPay[p.mil.rank]); else if (p.pol) base = G.$w(G.POLICE.pay[p.pol.rank]);
    p.pension = Math.max(Math.round(base * .5), G.$w(5000));
    CR.leave(); p.mil = null; p.pol = null; p.gov = null; p.retired = true;
    G.major('退休|Retired');
  };

  /* ===================== FAME CAREERS ===================== */
  var FM = G.fame = {};
  FM.TH = [0, 60000, 900000, 7000000, 45000000, 130000000];
  FM.start = function (id, extra) {
    var p = G.S.p;
    if (p.job && !G.JOB[p.job.id].pt) CR.leave();
    p.fc = { id: id, rank: 0, fans: G.ri(20, 300), perf: 45, yrs: 0, yr: 0 };
    if (extra) for (var k in extra) p.fc[k] = extra[k];
    G.major('踏入{f}行业|Started a career as {f}', { f: G.FAME[id].n });
  };
  FM.title = function () { var f = G.S.p.fc; return f ? G.FAME[f.id].r[f.rank] : ''; };
  FM.income = function () { var f = G.S.p.fc; if (!f) return 0; var F = G.FAME[f.id]; return Math.round(G.$w(F.pay[f.rank]) * .55 * (.2 + f.perf / 140) * (1 + Math.log10(f.fans + 10) / 20)); };
  FM.tick = function (Q) {
    var S = G.S, p = S.p, f = p.fc; if (!f) return;
    var F = G.FAME[f.id];
    f.yrs++; f.yr++;
    var stat = p.st[F.st] || 50;
    var tal = (f.id === 'singer' || f.id === 'idol') && G.has('music') || f.id === 'actor' && G.has('actor') || f.id === 'esports' && G.has('gamer') || f.id === 'athlete' && G.has('athletic') || f.id === 'painter' && G.has('art') || f.id === 'writer' && G.has('genius');
    var gr = (f.perf - 50) / 170 + (stat - 50) / 700 + p.st.fame / 900 + (tal ? .08 : 0) + G.nrm(-.07, .22) - f.rank * .045 - (f.wk ? 0 : .12);
    f.wk = 0;
    f.fans = Math.max(10, Math.round(f.fans * (1 + gr) + G.ri(0, 120) * (1 + f.rank * .5)));
    G.addStat('fame', Math.round(Math.log10(f.fans + 1) - 2 + f.rank * .7), true);
    f.perf = G.clamp(Math.round(f.perf * .7 + 15 + G.ri(-8, 8)), 0, 100);
    // athletes age out
    if ((f.id === 'athlete' || f.id === 'esports') && p.age > (f.id === 'esports' ? 28 : 34) && G.ch(.35)) { Q.push({ id: 'sys_fame_retire' }); return; }
    if (f.id === 'idol' && p.age > 32 && G.ch(.25)) { Q.push({ id: 'sys_fame_retire' }); return; }
    // rank up
    if (f.rank < F.r.length - 1 && f.fans >= FM.TH[f.rank + 1] && f.yr >= 3 && G.ch(.18 + f.perf / 400)) Q.push({ id: 'sys_fame_up' });
    // scandal
    if (f.rank >= 1 && G.ch(.05 + f.rank * .02 + (p.h.karma < -20 ? .08 : 0))) Q.push({ id: 'sys_scandal' });
  };
  FM.perform = async function () { // action: deliver a work / performance
    var p = G.S.p, f = p.fc, F = G.FAME[f.id];
    var gid = F.game === 'sport' ? G.pick(['penalty', 'basketball', 'sprint']) : F.game;
    var r = await G.UI.game(gid, { name: F.n });
    var d = Math.round((r.score - .45) * 40);
    f.perf = G.clamp(f.perf + d, 0, 100);
    var fg = Math.round(f.fans * Math.max(-.15, (r.score - .5) * .3) + r.score * 300 * (f.rank + 1));
    f.wk = (f.wk || 0) + 1; if (f.wk > 2 && fg > 0) fg = Math.round(fg * .35);
    f.fans = Math.max(10, f.fans + fg);
    G.dStart(); G.addStat('happy', r.score > .5 ? 4 : -2); if (r.score > .7) G.addStat('fame', 2); var dl = G.dEnd();
    dl.push({ k: 'fans', n: fg });
    await G.result('作品发布|New Work', r.score > .6 ? '表现精彩，反响热烈！粉丝增加了{f}。|A brilliant showing! You gained {f} fans.' : r.score > .35 ? '表现中规中矩。|A decent showing.' : '表现不佳，被网友吐槽了。|A poor showing — people mocked you online.', { f: Math.max(0, fg) }, dl, '🎬');
  };
  G.evs([
    { id: 'sys_fame_up', sys: 1, title: '事业突破|Breakthrough', icon: '🌟', good: 1,
      t: function (c) { var f = c.p.fc, F = G.FAME[f.id]; return G.L('你的人气越来越高，现在你是{r}了！|Your popularity is soaring — you are now a {r}!', { r: F.r[f.rank + 1] }); },
      run: function (c) { var f = c.p.fc; f.rank++; f.yr = 0; c.add('fame', 5 + f.rank * 2); c.add('happy', 8); G.major('成为{r}|Became a {r}', { r: G.FAME[f.id].r[f.rank] }); G.inc('famerank'); } },
    { id: 'sys_scandal', sys: 1, title: '负面新闻|Scandal', icon: '📰', bad: 1,
      t: function (c) { return G.pick(['有人爆料你耍大牌、欺负工作人员。|Someone claims you threw tantrums and bullied staff.', '你多年前的一条不当言论被翻了出来。|An inappropriate post you made years ago resurfaced.', '网上传出你偷税漏税的消息。|Rumors spread online that you evaded taxes.']); },
      o: [
        { t: '发长文道歉|Post a long apology', run: function (c) { var f = c.p.fc; f.fans = Math.round(f.fans * .85); c.add('fame', -3); c.add('happy', -5); return '你诚恳道歉，风波渐渐平息。|You apologized sincerely, and the storm slowly passed.'; } },
        { t: '花钱公关压热搜|Pay PR to bury it', run: function (c) { var cost = c.$(50000) * (c.p.fc.rank); if (c.pay(cost)) { c.add('fame', -1); return G.L('你花了{m}公关，事情被压了下去。|You spent {m} on PR and the story was buried.', { m: G.M(cost) }); } var f = c.p.fc; f.fans = Math.round(f.fans * .6); c.add('fame', -8); return '钱不够公关，事情越闹越大。|You couldn\'t afford PR, and it blew up.'; } },
        { t: '强硬否认|Deny everything', run: function (c) { var f = c.p.fc; if (G.ch(.5)) { f.fans = Math.round(f.fans * 1.05); return '粉丝选择相信你，事情不了了之。|Fans believed you and it fizzled out.'; } f.fans = Math.round(f.fans * .5); c.add('fame', -10); c.add('karma', -5); return '证据确凿，你被骂上热搜，掉粉无数。|The evidence was clear. You trended for the wrong reasons and lost tons of fans.'; } }
      ] },
    { id: 'sys_fame_retire', sys: 1, title: '告别舞台|Farewell', icon: '🎤',
      t: '年龄渐长，你的状态大不如前。|With age, you are no longer at your peak.',
      o: [
        { t: '宣布退役/退圈|Announce retirement', run: function (c) { G.major('告别{f}生涯|Retired as a {f}', { f: G.FAME[c.p.fc.id].n }); c.p.fc = null; c.add('happy', -3); return '你告别了这个圈子，开始新的人生。|You leave that world behind and start a new chapter.'; } },
        { t: '再坚持一下|Hang in there', run: function (c) { c.p.fc.perf -= 15; return '你咬牙坚持，但越来越吃力。|You grit your teeth and carry on, but it gets harder.'; } }
      ] }
  ]);

  /* ===================== COMPANY ===================== */
  var BZ = G.biz = {};
  BZ.start = function (ind, capUsd) {
    var S = G.S, cap = G.$(capUsd);
    var nm = G.L('{a}{b}|{a} {b}', { a: G.pick(STEM), b: G.INDUSTRY[ind].n });
    S.assets.company = { name: nm, ind: ind, val: cap, base: cap, own: 1, yrs: 0, emp: Math.max(2, Math.round(capUsd / 20000)), eff: 0, div: .3, ipo: false, last: 0 };
    G.major('创办了{n}|Founded {n}', { n: nm });
    G.inc('founded');
  };
  BZ.tick = function (Q) {
    var S = G.S, co = S.assets.company; if (!co) return;
    var I = G.INDUSTRY[co.ind], p = S.p;
    co.yrs++;
    var skill = (p.st.smarts + p.st.eq) / 200 * .1 + (G.has('biz') ? .06 : 0) + Math.min(co.eff, 3) * .025 + (G.stat('luck') / 600) - (p.jail ? .2 : 0);
    var big = Math.max(0, Math.log10(Math.max(1, co.val / G.$(1e6)))) * .035;
    var r = G.nrm(I.m * .45 + skill - .13 - big * 1.2, I.v * .5) + (S.world.mkRet || 0) * .4;
    if (co.ind === 'ai' && S.year > 2023) r += .05;
    co.last = r;
    co.val = Math.max(0, Math.round(co.val * (1 + r)));
    co.eff = 0;
    co.emp = Math.max(1, Math.round(co.emp * (1 + r * .6)));
    var profit = Math.round(co.val * I.m * G.rf(.4, 1.2) * (r > 0 ? 1 : .2));
    if (profit > 0) { var dv = Math.round(profit * co.div * co.own); G.S.p.money += dv; G.S.cnt.earned = (G.S.cnt.earned || 0) + dv; co.lastDiv = dv; }
    if (co.val < co.base * .12 || co.val <= 0) { Q.push({ id: 'sys_bankrupt' }); return; }
    if (!co.ipo && co.val > G.$(80000000)) Q.push({ id: 'sys_ipo' });
    if (G.ch(.22)) Q.push({ id: 'sys_biz_crisis' });
  };
  G.evs([
    { id: 'sys_bankrupt', sys: 1, title: '公司破产|Bankruptcy', icon: '💥', bad: 1,
      t: function (c) { return G.L('{n}资金链断裂，宣告破产。|{n} ran out of cash and went bankrupt.', { n: c.S.assets.company.name }); },
      run: function (c) { G.major('{n}破产|{n} went bankrupt', { n: c.S.assets.company.name }); c.S.assets.company = null; c.add('happy', -20); c.add('stress', 20); G.inc('bankrupt'); } },
    { id: 'sys_ipo', sys: 1, title: '上市敲钟|IPO', icon: '🔔', good: 1,
      t: function (c) { return G.L('{n}估值突破{v}，投行建议你上市！|{n} is valued at {v}. Bankers say it\'s time to go public!', { n: c.S.assets.company.name, v: G.M(c.S.assets.company.val) }); },
      o: [
        { t: '上市！|Go public!', run: function (c) { var co = c.S.assets.company; co.ipo = true; co.val = Math.round(co.val * G.rf(1.3, 2.5)); var cash = Math.round(co.val * co.own * .15); co.own *= .8; c.money(cash); c.add('fame', 15); c.add('happy', 15); G.major('{n}上市|{n} went public', { n: co.name }); G.inc('ipo'); return G.L('敲钟那一刻，你套现了{m}，成了媒体焦点。|As the bell rang, you cashed out {m} and became the talk of the town.', { m: G.M(cash) }); } },
        { t: '保持私有|Stay private', run: function (c) { return '你决定继续保持公司私有。|You keep the company private.'; } }
      ] },
    { id: 'sys_biz_crisis', sys: 1, title: '经营决策|Business Decision', icon: '🏢',
      t: function (c) {
        c.prm.k = c.prm.k || G.ri(0, 4);
        return ['一家大公司开出高价想收购你的公司。|A big corporation offers a high price to acquire your company.',
          '竞争对手推出了低价产品，抢走了你的客户。|A rival launched a cheaper product and is stealing your customers.',
          '核心员工集体要求加薪，否则就跳槽。|Your key staff demand raises or they\'ll quit.',
          '一个风险很高但回报巨大的项目摆在你面前。|A risky project with a huge payoff lands on your desk.',
          '监管部门开始调查你们行业的违规行为。|Regulators begin investigating misconduct in your industry.'][c.prm.k];
      },
      o: [
        { t: '接受收购|Accept the offer', if: function (c) { return c.prm.k === 0; }, run: function (c) { var co = c.S.assets.company, cash = Math.round(co.val * co.own * G.rf(1.2, 2)); c.money(cash); c.S.assets.company = null; c.add('happy', 12); G.major('以{m}卖掉了{n}|Sold {n} for {m}', { m: G.M(cash), n: co.name }); G.inc('exit'); return G.L('你以{m}的价格卖掉了公司，财务自由了！|You sold the company for {m}. Financial freedom!', { m: G.M(cash) }); } },
        { t: '拒绝，自己干|Refuse and keep building', if: function (c) { return c.prm.k === 0; }, run: function (c) { var co = c.S.assets.company; co.val = Math.round(co.val * G.rf(.8, 1.4)); return '你拒绝了收购，决心把公司做得更大。|You turned it down, determined to grow bigger.'; } },
        { t: '打价格战|Start a price war', if: function (c) { return c.prm.k === 1; }, run: function (c) { var co = c.S.assets.company; var w = G.ch(.4 + (G.has('biz') ? .2 : 0)); co.val = Math.round(co.val * (w ? 1.25 : .7)); return w ? '价格战打赢了，对手被挤出市场。|You won the price war and pushed the rival out.' : '价格战两败俱伤，你元气大伤。|The price war hurt everyone, you most of all.'; } },
        { t: '提升品质，走高端|Go upmarket with quality', if: function (c) { return c.prm.k === 1; }, run: function (c) { var co = c.S.assets.company; var w = G.ch(.5 + c.p.st.smarts / 400); co.val = Math.round(co.val * (w ? 1.3 : .85)); return w ? '高端路线大获成功！|Going upmarket paid off big!' : '高端路线没打开市场。|The premium strategy didn\'t catch on.'; } },
        { t: '给员工加薪|Give them raises', if: function (c) { return c.prm.k === 2; }, run: function (c) { var co = c.S.assets.company; co.val = Math.round(co.val * .93); co.eff += 2; return '员工士气大振，公司更有凝聚力了。|Morale soared and the team grew closer.'; } },
        { t: '强硬拒绝|Refuse firmly', if: function (c) { return c.prm.k === 2; }, run: function (c) { var co = c.S.assets.company; co.val = Math.round(co.val * (G.ch(.5) ? .75 : 1.02)); return '有人走了，有人留下，公司经历了一次动荡。|Some left, some stayed; the company went through turmoil.'; } },
        { t: '赌一把！|Bet on it!', if: function (c) { return c.prm.k === 3; }, run: function (c) { var co = c.S.assets.company; var w = G.ch(.35 + (G.has('biz') ? .15 : 0) + c.luck()); co.val = Math.round(co.val * (w ? G.rf(1.8, 3) : .45)); return w ? '项目大获成功，公司估值飙升！|The project was a smash hit; valuation skyrocketed!' : '项目失败，公司损失惨重。|The project failed; the company took a huge hit.'; } },
        { t: '稳健为上，放弃|Play it safe and pass', if: function (c) { return c.prm.k === 3; }, run: function () { return '你放弃了这个项目，稳扎稳打。|You passed on it and kept steady.'; } },
        { t: '全面整改，配合调查|Clean up and cooperate', if: function (c) { return c.prm.k === 4; }, run: function (c) { var co = c.S.assets.company; co.val = Math.round(co.val * .88); c.add('karma', 3); return '整改花了不少钱，但公司安全过关。|Compliance was costly, but the company came through safely.'; } },
        { t: '找关系摆平|Pull strings to make it go away', if: function (c) { return c.prm.k === 4; }, run: function (c) { var co = c.S.assets.company; if (G.ch(.55)) { co.val = Math.round(co.val * 1.05); c.add('karma', -4); c.add('heat', 8); return '事情被摆平了，但你欠下了人情。|It went away — but now you owe someone a favor.'; } co.val = Math.round(co.val * .5); c.add('heat', 20); return '行贿被发现，公司被重罚！|The bribe was discovered; the company was fined heavily!'; } }
      ] }
  ]);
})();
