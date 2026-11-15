/* Military, police, civil service & politics — with promotion assessments */
(function () {
  'use strict';
  /* ====================== MILITARY ====================== */
  var ML = G.mil = {};
  ML.can = function () { var p = G.S.p; return p.age >= 17 && p.age <= 26 && p.st.health >= 50 && !p.crime.rec && !p.jail && !p.mil; };
  ML.rankName = function () { var m = G.S.p.mil; return m ? (m.off ? G.MIL.off[m.rank] : G.MIL.enl[m.rank]) : ''; };
  ML.pay = function () { var m = G.S.p.mil; return G.$w(m.off ? G.MIL.offPay[m.rank] : G.MIL.enlPay[m.rank]); };
  ML.enlist = function (br, cons) {
    var p = G.S.p;
    if (p.job) G.career.leave(); if (p.fc) p.fc = null;
    p.mil = { br: br || 'army', off: false, rank: 0, yrs: 0, yr: 0, merit: 0, cons: !!cons, term: cons ? (G.C[p.country].consc || { yrs: 2 }).yrs : 0 };
    for (var i = 0; i < 2; i++) G.N.make({ rel: 'colleague', g: G.ch(.8) ? 'm' : 'f', age: G.clamp(p.age + G.ri(-2, 3), 18, 30), job: '士兵|Soldier', inc: ML.pay() });
    G.major(cons ? '应征入伍|Conscripted into the {b}' : '参军入伍|Enlisted in the {b}', { b: G.MIL.br[p.mil.br] });
    G.inc('mil');
  };
  ML.commission = function () {
    var p = G.S.p;
    p.mil = { br: G.pick(['army', 'navy', 'air']), off: true, rank: 0, yrs: 0, yr: 0, merit: 10, cons: false };
    G.major('军校毕业，授衔{r}|Commissioned as a {r}', { r: G.MIL.off[0] });
    G.log('你从军校毕业，被授予{r}军衔，分配到{b}。|You graduated from the military academy and were commissioned as a {r} in the {b}.', { r: G.MIL.off[0], b: G.MIL.br[p.mil.br] });
    G.inc('mil');
  };
  ML.tick = function (Q) {
    var S = G.S, p = S.p, m = p.mil;
    // conscription triggers
    if (!m) {
      var cs = G.C[p.country].consc;
      if (cs && p.g === cs.g && p.age >= cs.age && p.age <= cs.age + 9 && !p.flags.consDone && !p.jail && !(p.flags.consDefer && G.school.isStudent()) ) { Q.push({ id: 'sys_conscript' }); }
      if (p.country === 'us' && p.g === 'm' && S.year >= 1965 && S.year <= 1972 && p.age >= 19 && p.age <= 25 && !p.flags.drafted && G.ch(.15)) Q.push({ id: 'sys_draft' });
      return;
    }
    m.yrs++; m.yr++;
    m.merit += G.ri(0, 6) + Math.round(p.h.fit / 25) + (G.has('leader') ? 2 : 0);
    G.addStat('fit', 3, true); G.addStat('health', 1, true);
    if (m.cons) { if (m.yrs >= m.term) Q.push({ id: 'sys_cons_end' }); else if (G.ch(.5)) Q.push({ id: 'sys_mission' }); return; }
    if (G.ch(S.world.war ? .7 : .35)) Q.push({ id: 'sys_mission' });
    var max = m.off ? G.MIL.off.length - 1 : G.MIL.enl.length - 1;
    var need = m.off ? 2 + Math.floor(m.rank / 2) : 1 + Math.floor(m.rank / 2);
    if (m.acad) need = Math.max(1, need - 1); // academy graduates are on the fast track
    var topOk = !m.off || m.rank < 9 || (m.rank === 9 && (m.merit >= 95 || S.world.war)) || (m.rank === 10 && m.merit >= 110 && G.ch(.35));
    if (m.rank < max && m.yr >= need && m.merit >= Math.round((10 + m.rank * 8) * (m.acad ? .85 : 1)) && topOk) Q.push({ id: 'sys_assess', prm: { k: 'mil' } });
    else if (!m.off && m.rank >= 3 && m.merit >= 40 && !m.offTry && G.ch(.3)) Q.push({ id: 'sys_officer' });
    // generals made young stay on: a general's career doesn't end at 55
    if (m.off && m.rank >= 6 && !m.genAge) m.genAge = p.age;
    var lifer = m.off && m.genAge && m.genAge <= 52;
    if (lifer ? (p.age >= (m.rank >= 9 ? 78 : 72) && !m.stayOn) : (p.age >= (m.off && m.rank >= 6 ? 62 : 55) || m.yrs >= 35)) Q.push({ id: 'sys_mil_retire' });
  };
  ML.promote = function () {
    var m = G.S.p.mil; m.rank++; m.yr = 0; m.merit = Math.round(m.merit * .4);
    var r = ML.rankName(); G.major('晋升为{r}|Promoted to {r}', { r: r }); G.inc('promos');
    if (m.off && m.rank >= 6) G.inc('general');
    return r;
  };

  /* ====================== POLICE ====================== */
  var PO = G.police = {};
  PO.can = function () { var p = G.S.p; return p.age >= 18 && p.age <= 35 && p.edu.deg >= 3 && p.st.health >= 55 && !p.crime.rec && !p.jail && !p.pol && !p.gang; };
  PO.join = function (academy) {
    var p = G.S.p;
    if (p.job) G.career.leave(); if (p.fc) p.fc = null;
    p.pol = { rank: academy ? 1 : 0, yrs: 0, yr: 0, merit: academy ? 10 : 0, cases: 0 };
    G.N.make({ rel: 'colleague', age: G.clamp(p.age + G.ri(-3, 15), 20, 55), job: '警察|Police Officer', inc: G.$w(G.POLICE.pay[1]) });
    G.major('成为一名警察|Became a police officer');
    G.log('你穿上了警服，成为{r}。|You put on the uniform as a {r}.', { r: G.POLICE.r[p.pol.rank] });
    G.inc('police');
  };
  PO.tick = function (Q) {
    var p = G.S.p, o = p.pol; if (!o) return;
    o.yrs++; o.yr++;
    o.merit += G.ri(0, 5) + (G.has('justice') ? 2 : 0);
    if (G.ch(.55)) Q.push({ id: G.pick(['sys_case', 'sys_case', 'sys_raid', 'sys_bribe']) });
    if (o.rank < G.POLICE.r.length - 1 && o.yr >= 2 + Math.floor(o.rank / 3) && o.merit >= 10 + o.rank * 7) Q.push({ id: 'sys_assess', prm: { k: 'pol' } });
    var ret = G.C[p.country].retire || 60; if (p.age >= ret) Q.push({ id: 'sys_retire' });
  };
  PO.promote = function () { var o = G.S.p.pol; o.rank++; o.yr = 0; o.merit = Math.round(o.merit * .4); var r = G.POLICE.r[o.rank]; G.major('晋升为{r}|Promoted to {r}', { r: r }); G.inc('promos'); if (o.rank === G.POLICE.r.length - 1) G.inc('topcop'); return r; };

  /* ====================== GOVERNMENT ====================== */
  var GV = G.gov = {};
  GV.civilRanks = function () { return G.S.p.country === 'cn' ? G.CIVIL.cn : G.CIVIL.gen; };
  GV.can = function () { var p = G.S.p; return !(p.origin === 'royal' && !p.flags.exRoyal) && p.age >= 18 && p.age <= 35 && p.edu.deg >= 4 && !p.crime.rec && !p.jail && !p.gov; };
  GV.join = function () {
    var p = G.S.p;
    if (p.job) G.career.leave(); if (p.fc) p.fc = null;
    p.gov = { track: 'civil', rank: 0, yrs: 0, yr: 0, perf: 50, appr: 50 };
    if (p.flags.redfam) { p.gov.rank = 2; p.gov.perf = 70; }
    G.major('考上公务员|Joined the civil service');
    G.inc('gov');
  };
  GV.title = function () { var g = G.S.p.gov; if (!g) return ''; return g.track === 'poli' ? G.poliLadder(G.S.p.country).r[g.rank] : GV.civilRanks()[g.rank]; };
  GV.pay = function () { var g = G.S.p.gov; var i = g.track === 'poli' ? Math.min(g.rank + 3, 9) : g.rank; return G.$w(G.CIVIL.pay[Math.min(i, G.CIVIL.pay.length - 1)] * (g.track === 'poli' ? 1.2 : 1)); };
  GV.isTop = function () { var g = G.S.p.gov; return g && g.track === 'poli' && g.rank === G.poliLadder(G.S.p.country).r.length - 1; };
  GV.elected = function (r) { var L = G.poliLadder(G.S.p.country); return L.elect && L.elect[r]; };
  GV.tick = function (Q) {
    var S = G.S, p = S.p, g = p.gov; if (!g) return;
    g.yrs++; g.yr++;
    var tgt = p.st.eq * .35 + p.st.smarts * .25 + (g.eff || 0) * 8 + G.ri(-10, 10) + (p.flags.redfam ? 10 : 0);
    g.perf = G.clamp(Math.round(g.perf * .6 + tgt * .4), 0, 100); g.eff = 0;
    if (p.h.heat > 30 && G.ch(p.h.heat / 200)) { Q.push({ id: 'sys_investigation' }); return; }
    if (G.ch(.25)) Q.push({ id: 'sys_gov_bribe' });
    if (g.track === 'civil') {
      var R = GV.civilRanks();
      if (g.rank < R.length - 1 && g.yr >= 3 && g.perf >= 50 + g.rank * 3) Q.push({ id: 'sys_assess', prm: { k: 'gov' } });
      if (p.country === 'cn' && g.rank >= 2 && g.rank <= 5 && G.ch(.2)) Q.push({ id: 'sys_poli_offer' });
      var ret = G.C[p.country].retire || 60; if (p.age >= ret) Q.push({ id: 'sys_retire' });
      return;
    }
    // politics track
    g.appr = G.clamp(Math.round(g.appr + G.ri(-6, 4) + (g.perf - 50) / 10), 0, 100);
    if (g.rank >= 1 || GV.isTop()) Q.push({ id: 'sys_policy' });
    if (GV.elected(g.rank)) {
      g.term--;
      if (g.term <= 0) Q.push({ id: 'sys_reelect' });
    } else if (p.country === 'cn') {
      var nextTop = g.rank + 1 === G.poliLadder('cn').r.length - 1;
      if (g.rank < G.poliLadder('cn').r.length - 1 && g.yr >= 3 + Math.floor(g.rank / 3) && g.appr >= 55 + g.rank * 2 && (!nextTop || (p.age >= 55 && g.appr >= 75 && G.ch(.35)))) Q.push({ id: 'sys_assess', prm: { k: 'gov' } });
      if (g.appr < 20 && G.ch(.5)) Q.push({ id: 'sys_removed' });
      if (p.age >= 68 && !GV.isTop()) Q.push({ id: 'sys_retire' });
      if (GV.isTop() && p.age >= 75) Q.push({ id: 'sys_retire' });
    } else {
      // appointed minister: may be reshuffled
      if (g.appr < 30 && G.ch(.4)) Q.push({ id: 'sys_removed' });
    }
  };
  GV.promote = function () {
    var g = G.S.p.gov, R = g.track === 'poli' ? G.poliLadder(G.S.p.country).r : GV.civilRanks();
    g.rank = Math.min(g.rank + 1, R.length - 1); g.yr = 0;
    var r = R[g.rank]; G.major('晋升为{r}|Promoted to {r}', { r: r }); G.inc('promos');
    if (GV.isTop()) { G.inc('leader'); G.addStat('fame', 40); G.major('成为{r}|Became {r}', { r: r }); }
    else G.addStat('fame', g.track === 'poli' ? 4 : 1);
    return r;
  };
  /* democratic election flow */
  GV.election = async function (c, targetRank) {
    var p = c.p, L = G.poliLadder(p.country), name = L.r[targetRank];
    var budget = await G.UI.pick({ title: G.L('竞选：{r}|Campaign: {r}', { r: name }), text: G.L('投入多少竞选资金？|How much will you spend on the campaign?'),
      items: [{ t: G.L('草根竞选（几乎不花钱）|Grassroots (almost free)'), v: 0 }, { t: G.L('常规投入 {m}|Standard {m}', { m: G.M(G.$(20000 * Math.pow(3, targetRank))) }), v: 1 }, { t: G.L('砸重金 {m}|All in {m}', { m: G.M(G.$(100000 * Math.pow(3, targetRank))) }), v: 2 }].map(function (x) { return { t: x.t }; }), noCancel: 1 });
    var spend = [0, G.$(20000 * Math.pow(3, targetRank)), G.$(100000 * Math.pow(3, targetRank))][budget] || 0;
    if (spend > p.money) { spend = Math.max(0, p.money); }
    G.addMoney(-spend);
    var r = await c.game('quiz', { name: G.L('电视辩论|Televised Debate'), n: 5, debate: 1 });
    var g = p.gov || { appr: 45 };
    var isTop = targetRank === L.r.length - 1;
    // the higher the office, the brutally harder the race — party machines, donors, name recognition
    var lv = targetRank / Math.max(1, L.r.length - 1), held = p.gov && p.gov.track === 'poli' ? p.gov.rank : -1;
    var ch = .3 + g.appr / 320 + p.st.fame / 450 + p.st.eq / 700 + (budget * .06) + (r.score - .5) * .3 - lv * .5 + (G.has('leader') ? .08 : 0) + (p.flags.redfam || p.flags.elite ? .08 : 0) - (p.crime.rec ? .35 : 0);
    if (isTop) {
      ch -= .15;
      if (p.st.fame < 65) ch -= .25;
      if (p.age < 40) ch -= .2;
      if (held < targetRank - 2) ch -= .35;                 // nobody jumps from nowhere to the top
      if (G.netWorth() < G.$(1e6) && !p.flags.redfam && !p.flags.elite) ch -= .12; // no donor network
    } else if (held < targetRank - 2) ch -= .2;
    var win = G.ch(G.clamp(ch, .02, isTop ? .5 : .85));
    if (win) {
      if (!p.gov) { p.gov = { track: 'poli', rank: targetRank, yrs: 0, yr: 0, perf: 55, appr: 55, term: 4 }; if (p.job) G.career.leave(); if (p.fc) p.fc = null; G.inc('gov'); }
      else { p.gov.track = 'poli'; p.gov.rank = targetRank; p.gov.yr = 0; p.gov.term = 4; p.gov.appr = Math.max(p.gov.appr, 55); }
      G.major('当选{r}|Elected {r}', { r: name }); G.inc('elections');
      c.add('fame', 5 + targetRank * 5); c.add('happy', 15);
      if (GV.isTop()) { G.inc('leader'); c.add('fame', 30); }
      return G.L('你赢得了选举，当选为{r}！|You won the election and became {r}!', { r: name });
    }
    c.add('happy', -10);
    return G.L('你在{r}选举中落败了。|You lost the race for {r}.', { r: name });
  };

  /* ====================== ASSESSMENT (考核) ====================== */
  var ASSESS = {
    mil: { games: ['shooting', 'sprint', 'quiz'], n: '军事晋升考核|Military Promotion Assessment', parts: '射击、体能、军事理论|shooting, fitness and military theory' },
    pol: { games: ['shooting', 'detective', 'quiz'], n: '警衔晋升考核|Police Promotion Assessment', parts: '射击、案件推理、法律知识|shooting, case deduction and law' },
    gov: { games: ['quiz', 'policy'], n: '干部考核|Official Performance Review', parts: '笔试、政策决策|written exam and policy decisions' },
    job: { games: ['quiz', 'exam'], n: '晋升考核|Promotion Assessment', parts: '专业笔试、业务考核|professional exam and case review' }
  };
  function nextRankName(k) {
    var p = G.S.p;
    if (k === 'mil') return (p.mil.off ? G.MIL.off : G.MIL.enl)[p.mil.rank + 1];
    if (k === 'pol') return G.POLICE.r[p.pol.rank + 1];
    if (k === 'gov') return (p.gov.track === 'poli' ? G.poliLadder(p.country).r : GV.civilRanks())[p.gov.rank + 1];
    var J = G.JOB[p.job.id]; return J.r[p.job.rank + 1];
  }
  function curRank(k) { var p = G.S.p; return k === 'mil' ? p.mil.rank : k === 'pol' ? p.pol.rank : k === 'gov' ? p.gov.rank : p.job.rank; }
  function doPromote(k) { return k === 'mil' ? ML.promote() : k === 'pol' ? PO.promote() : k === 'gov' ? GV.promote() : G.career.promote(); }
  function stillValid(c) { var p = c.p, k = c.prm.k; return k === 'mil' ? !!p.mil : k === 'pol' ? !!p.pol : k === 'gov' ? !!p.gov : !!p.job; }
  G.evs([
    { id: 'sys_assess', sys: 1, icon: '🎖️', title: function (c) { return ASSESS[c.prm.k].n; },
      prep: function (c) { if (!stillValid(c)) return false; c.prm.r = nextRankName(c.prm.k); c.prm.parts = ASSESS[c.prm.k].parts; },
      t: '你获得了晋升{r}的考核资格！考核内容：{parts}。|You qualified for promotion to {r}! The assessment covers {parts}.',
      o: [
        { t: '参加考核|Take the assessment', run: async function (c) {
          var A = ASSESS[c.prm.k], tot = 0, rank = curRank(c.prm.k);
          var games = A.games.slice();
          if (c.prm.k === 'gov' && rank < 3) games = ['quiz', 'exam'];
          for (var i = 0; i < games.length; i++) { var r = await c.game(games[i], { name: A.n, assess: 1, diff: rank }); tot += r.score; }
          var avg = tot / games.length;
          var bonus = (G.has('leader') ? .06 : 0) + (c.p.flags.redfam && c.prm.k === 'gov' ? .12 : 0) + (c.p.flags.milfam && c.prm.k === 'mil' ? .05 : 0) + (c.p.flags.polfam && c.prm.k === 'pol' ? .05 : 0);
          var need = .42 + rank * .04;
          if (avg + bonus >= need) { var nr = doPromote(c.prm.k); c.add('happy', 10); return G.L('考核成绩{s}分，顺利通过！你晋升为{r}。|You scored {s} and passed! You are now {r}.', { s: Math.round(avg * 100), r: nr }); }
          c.add('happy', -6);
          return G.L('考核成绩{s}分，差一点没通过，只能明年再来。|You scored {s} — just short. Try again next year.', { s: Math.round(avg * 100) });
        } },
        { t: '托关系走后门|Pull some strings', if: function (c) { return c.p.st.eq >= 55 || c.p.flags.redfam || c.p.flags.elite; }, sub: '可能被查|Could get you investigated', run: function (c) {
          var cost = G.$(15000 * Math.pow(curRank(c.prm.k) + 1, 2));
          if (!c.pay(cost)) return '你拿不出打点的钱。|You can\'t afford the "gifts".';
          c.add('heat', 12); c.add('karma', -6);
          if (G.ch(.6 - curRank(c.prm.k) * .07 + (c.p.flags.redfam ? .25 : 0))) { var nr = doPromote(c.prm.k); return G.L('花了{m}打点，你如愿晋升为{r}。|After {m} in "gifts", you were promoted to {r}.', { m: G.M(cost), r: nr }); }
          return G.L('钱花了{m}，事却没办成。|You spent {m} and got nothing.', { m: G.M(cost) });
        } },
        { t: '放弃这次机会|Pass this time', run: function () { return '你放弃了这次晋升机会。|You let this chance go.'; } }
      ] },
    { id: 'sys_conscript', sys: 1, title: '服兵役|Military Service', icon: '🪖',
      t: function (c) { var cs = G.C[c.p.country].consc; return cs.lottery ? '你到了服兵役的年龄，今天要参加征兵抽签。|You are of age and must attend the conscription lottery today.' : G.L('按照法律，你必须服{y}年兵役。|By law, you must serve {y} years of military service.', { y: cs.yrs }); },
      o: [
        { t: '入伍服役|Report for duty', run: function (c) { c.p.flags.consDone = 1; var cs = G.C[c.p.country].consc; if (cs.lottery && G.ch(1 - cs.lottery)) return '你抽到了黑签，不用当兵！|You drew a black card — exempt!'; ML.enlist('army', true); if (G.school.inSchool()) { c.p.edu.paused = c.p.edu.stage; } return '你剃了寸头，踏入了军营。|You got a buzz cut and walked into the barracks.'; } },
        { t: '申请缓役（继续读书）|Defer for school', if: function (c) { return G.school.isStudent(); }, run: function (c) { c.p.flags.consDefer = 1; return '你申请缓役，先完成学业。|You deferred service to finish your studies.'; } },
        { t: '想办法逃避兵役|Dodge the draft', sub: '违法|Illegal', if: function () { return false; }, run: function (c) { c.p.flags.consDone = 1; if (G.ch(.4)) { c.add('karma', -10); return '你用了些手段躲过了兵役，但心里有些不安。|You found a way out, but it nags at you.'; } return G.crime.arrest(c, '逃避兵役|Draft evasion', 2); } }
      ] },
    { id: 'sys_draft', sys: 1, title: '征兵通知|Draft Notice', icon: '✉️', y: [1965, 1972],
      t: '你收到了征兵通知，可能会被派往越南战场。|You received a draft notice. You may be sent to Vietnam.',
      o: [
        { t: '服从征召|Answer the call', run: function (c) { c.p.flags.drafted = 1; ML.enlist('army', true); c.p.mil.term = 2; c.S.world.war = 1; return '你登上了前往东南亚的运输机。|You board a transport plane bound for Southeast Asia.'; } },
        { t: '以上学为由申请缓征|Request a student deferment', if: function () { return G.school.isStudent(); }, run: function (c) { c.p.flags.drafted = 1; return '你获得了学生缓征。|You were granted a student deferment.'; } },
        { t: '逃往加拿大|Flee to Canada', run: function (c) { c.p.flags.drafted = 1; G.money.emigrate('ca'); c.add('karma', -3); return '你连夜越过边境，去了加拿大。|You crossed the border into Canada overnight.'; } }
      ] },
    { id: 'sys_cons_end', sys: 1, title: '退伍|Discharge', icon: '🎒',
      t: '兵役期满了。|Your service term is over.',
      o: [
        { t: '光荣退伍|Discharge with honor', run: function (c) { c.p.mil = null; c.add('happy', 8); if (c.p.edu.paused) { c.p.edu.stage = c.p.edu.paused; c.p.edu.paused = null; } return '你退伍了，回到普通生活。|You were discharged and returned to civilian life.'; } },
        { t: '留队成为职业军人|Re-enlist as a career soldier', run: function (c) { c.p.mil.cons = false; c.p.edu.paused = null; return '你决定把军营当成家，继续服役。|You decide the army is home and sign on.'; } }
      ] },
    { id: 'sys_officer', sys: 1, title: '提干机会|Officer Selection', icon: '⭐',
      t: '表现优异的你，获得了提干考试的机会！|Thanks to your service record, you can sit the officer selection exam!',
      o: [
        { t: '参加考试|Take the exam', run: async function (c) { c.p.mil.offTry = 1; var r = await c.game('quiz', { name: '提干考试|Officer Exam' }); if (r.score + c.p.st.smarts / 300 > .55) { var m = c.p.mil; m.off = true; m.rank = 0; m.yr = 0; G.major('提干成为{r}|Commissioned as {r}', { r: G.MIL.off[0] }); return G.L('你通过考试，成为了{r}！|You passed and became a {r}!', { r: G.MIL.off[0] }); } return '没考过，继续当兵。|You failed and remain enlisted.'; } },
        { t: '算了|Skip it', run: function (c) { c.p.mil.offTry = 1; return '你还是喜欢当兵的简单。|You prefer the simplicity of enlisted life.'; } }
      ] },
    { id: 'sys_mil_retire', sys: 1, title: '退役|Leaving the Military', icon: '🎖️',
      t: '你在部队服役了{y}年，是时候离开了。|After {y} years of service, it is time to leave.',
      prep: function (c) { c.prm.y = c.p.mil.yrs; },
      o: [
        { t: '退役领取养老金|Retire on a pension', run: function (c) { G.career.retire(); return G.L('你光荣退役，每年领取{m}。|You retired honorably with {m}/yr.', { m: G.M(c.p.pension) }); } },
        { t: '留任，继续执掌军队|Stay on and keep command', if: function (c) { return c.p.mil.off && c.p.mil.rank >= 8 && c.p.age < 82 && c.p.st.health >= 45; }, run: function (c) { c.p.mil.stayOn = 1; c.add('fame', 2); return '你选择留任。军队需要你。|You chose to stay on. The armed forces need you.'; } },
        { t: '转业到地方政府|Transfer to civil government', if: function (c) { return c.p.mil.off && c.p.age < 58; }, run: function (c) { var r = Math.min(Math.floor(c.p.mil.rank * .8), 6); c.p.mil = null; c.p.gov = { track: 'civil', rank: r, yrs: 0, yr: 0, perf: 55, appr: 50 }; return G.L('你转业到地方，担任{r}。|You transferred to the civil service as {r}.', { r: GV.civilRanks()[r] }); } }
      ] },
    { id: 'sys_mission', sys: 1, title: '军事任务|Military Mission', icon: '🪖',
      t: function (c) {
        c.prm.k = c.prm.k != null ? c.prm.k : (c.S.world.war ? 3 : G.ri(0, 3));
        return ['部队组织大规模军事演习。|Your unit joins a large-scale exercise.', '洪水来袭，部队奉命抗洪抢险。|Floods strike; your unit is ordered to the rescue.', '你被派去参加海外维和任务。|You are deployed on an overseas peacekeeping mission.', '你所在的部队被派往冲突地区执行作战任务。|Your unit is deployed to a conflict zone for combat operations.'][c.prm.k];
      },
      o: [
        { t: '冲在最前面|Lead from the front', run: async function (c) {
          var r = await c.game(c.prm.k === 1 ? 'sprint' : 'shooting', { name: '任务|Mission' });
          var m = c.p.mil, risk = [.01, .04, .05, .12][c.prm.k];
          if (G.ch(risk * (1.3 - r.score))) { c.add('health', -G.ri(15, 40)); c.p.ill.push({ id: 'fracture', yrs: 0, known: 1 }); m.merit += 10; G.inc('wounded'); return '你在任务中负了重伤，但获得了军功。|You were badly wounded but earned honors.'; }
          m.merit += Math.round(8 + r.score * 15); c.add('fame', c.prm.k >= 2 ? 3 : 1);
          if (r.score > .75) { G.major('荣立战功|Decorated for bravery'); G.inc('medal'); return '你表现英勇，荣立战功！|You showed great courage and were decorated!'; }
          return '你圆满完成了任务。|You completed the mission.';
        } },
        { t: '稳妥行事|Play it safe', run: function (c) { c.p.mil.merit += 4; return '你稳稳当当地完成了任务。|You completed the mission without fuss.'; } }
      ] },
    // ---------- police ----------
    { id: 'sys_case', sys: 1, title: '案件|Case', icon: '🔍',
      t: '辖区发生了一起案子，上级指派你负责侦破。|A crime occurred in your district, and you are assigned to crack it.',
      o: [
        { t: '亲自侦破（推理小游戏）|Investigate (deduction game)', run: async function (c) { var r = await c.game('detective', {}); var o = c.p.pol; if (r.win) { o.merit += 8; o.cases++; G.inc('cases'); c.add('fame', 1); return '你抓到了真凶，破案了！|You caught the real culprit — case closed!'; } o.merit -= 3; return '你抓错了人，案子成了悬案。|You got the wrong person; the case went cold.'; } },
        { t: '交给同事|Hand it to a colleague', run: function (c) { c.p.pol.merit += 1; return '同事破了案，功劳也归了他。|Your colleague solved it and took the credit.'; } }
      ] },
    { id: 'sys_raid', sys: 1, title: '扫黑行动|Anti-Gang Raid', icon: '🚨',
      t: '警方决定对一个黑帮窝点发起突袭。|The police plan a raid on a gang hideout.',
      o: [
        { t: '打头阵|Go in first', run: async function (c) { var r = await c.game('shooting', { name: '突袭|Raid' }); var o = c.p.pol; if (G.ch(.08 * (1.3 - r.score))) { c.add('health', -G.ri(15, 35)); o.merit += 8; G.inc('wounded'); return '交火中你中弹负伤，但行动成功了。|You were shot in the firefight, but the raid succeeded.'; } o.merit += Math.round(6 + r.score * 12); G.inc('raids'); return '行动大获成功，你抓获了多名嫌疑人。|The raid was a big success; you arrested several suspects.'; } },
        { t: '在外围接应|Hold the perimeter', run: function (c) { c.p.pol.merit += 3; return '你守在外围，行动顺利结束。|You held the perimeter; the operation went smoothly.'; } }
      ] },
    { id: 'sys_bribe', sys: 1, title: '诱惑|Temptation', icon: '💰',
      t: '一个商人塞给你一个厚厚的信封，请你对他的生意“行个方便”。|A businessman slips you a thick envelope, asking you to "look the other way."',
      o: [
        { t: '收下|Take it', run: function (c) { var m = c.$(G.ri(5000, 30000)); c.money(m); c.add('karma', -8); c.add('heat', 15); G.inc('bribes'); return G.L('你收下了{m}。|You pocketed {m}.', { m: G.M(m) }); } },
        { t: '严词拒绝并举报|Refuse and report it', run: function (c) { c.p.pol.merit += 6; c.add('karma', 6); return '你举报了行贿者，受到表彰。|You reported the briber and were commended.'; } }
      ] },
    // ---------- government ----------
    { id: 'sys_gov_bribe', sys: 1, title: '有人送礼|A Gift', icon: '🎁',
      t: '一位老板请你吃饭，临走时留下了一个“小礼物”。|A business owner treats you to dinner and leaves behind a "small gift."',
      o: [
        { t: '收下|Accept', run: function (c) { var rank = c.p.gov.rank + 1, m = c.$(G.ri(5000, 20000) * rank * rank); c.money(m); c.add('karma', -8); c.add('heat', 8 + rank * 2); G.inc('bribes'); return G.L('“小礼物”价值{m}。|The "small gift" was worth {m}.', { m: G.M(m) }); } },
        { t: '原封不动退回|Return it untouched', run: function (c) { c.add('karma', 5); c.p.gov.perf += 3; return '你退回了礼物，两袖清风。|You returned it. Clean hands.'; } }
      ] },
    { id: 'sys_investigation', sys: 1, title: '纪委调查|Corruption Probe', icon: '⚖️', bad: 1,
      t: '调查人员找上门来，你过去收的钱可能要暴露了。|Investigators come knocking. Your past "gifts" may come to light.',
      o: [
        { t: '主动交代|Confess', run: function (c) { var take = Math.round(c.p.money * .6); c.money(-take); c.p.gov = null; c.add('fame', -10); c.p.h.heat = 0; G.major('被免职|Removed from office'); return G.L('你退赃{m}，被免去一切职务，但免于牢狱。|You returned {m}, lost all posts, but avoided prison.', { m: G.M(take) }); } },
        { t: '咬死不认|Deny everything', run: function (c) { if (G.ch(.35 + c.p.st.eq / 400)) { c.p.h.heat = Math.round(c.p.h.heat / 2); return '查无实据，你逃过一劫。|No hard evidence. You slipped through.'; } c.p.gov = null; return G.crime.arrest(c, '受贿罪|Bribery', G.ri(3, 12)); } }
      ] },
    { id: 'sys_poli_offer', sys: 1, title: '组织提拔|Leadership Track', icon: '🏛️',
      t: '组织上看中了你，想把你派到基层担任主官。|The leadership wants to send you to run a locality.',
      o: [
        { t: '服从安排|Accept the post', run: function (c) { var g = c.p.gov; g.track = 'poli'; g.rank = 0; g.yr = 0; g.appr = 55; G.major('出任{r}|Appointed {r}', { r: G.poliLadder('cn').r[0] }); return G.L('你被任命为{r}。|You were appointed {r}.', { r: G.poliLadder('cn').r[0] }); } },
        { t: '留在机关|Stay in the ministry', run: function () { return '你选择继续在机关工作。|You stay in the ministry.'; } }
      ] },
    { id: 'sys_policy', sys: 1, title: '施政挑战|Governing Challenge', icon: '🗳️',
      t: function (c) { return GV.isTop() ? '作为国家元首，你必须应对今年的重大危机。|As head of state, you must handle this year\'s major crises.' : G.L('作为{r}，你需要拍板今年的几项重大决策。|As {r}, you must make several big calls this year.', { r: GV.title() }); },
      o: [
        { t: '亲自决策（策略小游戏）|Decide yourself (strategy game)', run: async function (c) { var r = await c.game('policy', { top: GV.isTop(), rank: c.p.gov.rank }); var d = Math.round((r.score - .5) * 50); c.p.gov.appr = G.clamp(c.p.gov.appr + d, 0, 100); c.p.gov.perf = G.clamp(c.p.gov.perf + d / 2, 0, 100); if (r.score > .7) c.add('fame', 3); return G.L('施政得分{s}，支持率{a}%。|Governing score {s}. Approval: {a}%.', { s: Math.round(r.score * 100), a: c.p.gov.appr }); } },
        { t: '交给幕僚（自动）|Let advisors handle it (auto)', run: function (c) { var d = Math.round(G.nrm((c.p.st.smarts + c.p.st.eq) / 200 - .5, .2) * 30); c.p.gov.appr = G.clamp(c.p.gov.appr + d, 0, 100); return G.L('幕僚们替你处理了，支持率{a}%。|Your advisors handled it. Approval: {a}%.', { a: c.p.gov.appr }); } }
      ] },
    { id: 'sys_reelect', sys: 1, title: '任期届满|Term Ending', icon: '🗳️',
      t: function (c) { return G.L('你作为{r}的任期即将结束。|Your term as {r} is ending.', { r: GV.title() }); },
      o: [
        { t: '竞选连任|Run for re-election', run: async function (c) { var g = c.p.gov, L = G.poliLadder(c.p.country); g.reruns = (g.reruns || 0) + 1; if (GV.isTop() && g.reruns > 2) { G.career.retire(); return '你已达到任期上限，光荣卸任。|You have hit the term limit and step down with honor.'; } var r = await GV.election(c, g.rank); if (!c.p.gov || c.p.gov.term !== 4) { c.p.gov = null; } return r; } },
        { t: '竞选更高职位|Run for higher office', if: function (c) { var g = c.p.gov; return g.rank < G.poliLadder(c.p.country).r.length - 1; }, run: async function (c) { var g = c.p.gov, L = G.poliLadder(c.p.country), t = g.rank + 1; if (!L.elect[t]) t = Math.min(t + 1, L.r.length - 1); var old = g.rank; var r = await GV.election(c, t); if (c.p.gov && c.p.gov.rank === old) c.p.gov = null; return r; } },
        { t: '急流勇退|Step down', run: function (c) { c.p.gov = null; G.major('卸任|Left office'); return '你选择离开政坛。|You leave politics.'; } }
      ] },
    { id: 'sys_removed', sys: 1, title: '被免职|Dismissed', icon: '📉', bad: 1,
      t: function (c) { return G.L('支持率太低，你被免去了{r}的职务。|With approval so low, you were removed as {r}.', { r: GV.title() }); },
      run: function (c) { c.p.gov = null; c.add('happy', -15); c.add('fame', -5); G.major('被免职|Dismissed from office'); } }
  ]);
})();
