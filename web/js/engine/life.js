/* Life creation, family generation, net worth, energy, heir continuation */
(function () {
  'use strict';
  G.life = {};
  function st0(mean, sd, lo, hi) { return G.clamp(Math.round(G.nrm(mean, sd)), lo || 1, hi || 100); }

  G.newState = function (seed, year) {
    return {
      ver: 1, rs: seed | 0, id: G.uid(), gen: 1, lineage: [], year: year,
      p: null, npcs: {}, nid: 1,
      assets: { houses: [], cars: [], items: [], pets: [], inv: {}, debt: [], company: null },
      world: { hpi: {}, mk: {}, ev: [] },
      log: [], major: [], done: {}, cool: {}, cnt: {}, ach: [], flags: {}, rewinds: 0
    };
  };

  /* o: {g, orient, country, tier, city, by, origin, talents, giv, sur, name} */
  G.life.create = function (o) {
    var seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) | 0;
    var S = G.newState(seed, o.by);
    G.S = S;
    var cc = G.C[o.country], org = G.ORIGIN[o.origin] || G.ORIGIN.worker;
    var tier = org.tier || o.tier || 3;
    var p = S.p = {
      g: o.g, orient: o.orient || 'het', birthYear: o.by, age: 0, country: o.country, tier: tier,
      city: o.city || G.pick(cc.cities[tier]), origin: org.id, talents: (o.talents || []).slice(),
      st: { looks: st0(50, 15, 5, 95), smarts: st0(50, 15, 5, 95), health: st0(82, 8, 40, 100), happy: st0(75, 10, 30, 100), fame: 0, eq: st0(45, 12, 5, 90) },
      h: { stress: 5, karma: org.karma || 0, fit: 25, luck: 0, heat: 0, rep: 0 },
      energy: 0, emax: 0, money: 0, langs: [cc.lang],
      edu: { stage: 'none', grade: 0, perf: 50, deg: 0, study: 0, retake: 0 },
      job: null, fc: null, mil: null, pol: null, gov: null, gang: null, jail: null, biz: null,
      crime: { rec: 0 }, hab: { smoke: 0, drink: 0, gamble: 0, night: 0 }, ill: [], surg: 0, pension: 0,
      partner: null, flags: {}, home: 'parents', imm: [o.country], vip: G.vip ? G.vip.tier() : 0
    };
    (org.fl || []).forEach(function (f) { p.flags[f] = 1; });
    // stat mods
    var mods = [org.st || {}].concat(p.talents.map(function (t) { return (G.TALENT[t] || {}).st || {}; }));
    mods.forEach(function (m) { for (var k in m) p.st[k] = G.clamp(p.st[k] + m[k], 1, 100); });
    if (G.has('lucky')) p.h.luck = 20;
    if (G.has('unlucky')) p.h.luck = -20;
    p.h.fit = G.clamp(Math.round(p.st.health / 3), 10, 50);
    // family
    var fam = G.life.family(S, org, o);
    // name
    var cul = p.cul = fam.cul;
    var sur = o.sur || fam.sur || G.genSur(cul);
    var giv = o.giv || G.genGiven(cul, p.g, o.by);
    if (o.name) { p.name = o.name; p.sur = ''; p.giv = o.name; }
    else { p.name = G.mkName(cul, sur, giv, p.g); p.sur = sur; p.giv = giv; }
    p.emax = G.emax(); p.energy = p.emax;
    // birth log
    var pr = { city: p.city, org: org.n, tier: G.tierName(p.country, tier), cty: cc.n };
    G.yearEntry();
    G.log('{y}年，你出生在{cty}{city}的一个{org}。|In {y}, you were born into a {org} in {city}, {cty}.', { y: o.by, cty: cc.n, city: p.city, org: org.n });
    if (fam.text) G.logRaw(fam.text);
    if (p.talents.length) G.log('你的天赋：{t}|Your talents: {t}', { t: G.join(p.talents.map(function (t) { return G.TALENT[t].n; }), '、', ', ') });
    G.major('出生|Born');
    S.world.hpi[p.country] = 1;
    G.inc('lives');
    return S;
  };

  G.life.family = function (S, org, o) {
    var p = S.p, cc = G.C[p.country], cul = cc.names, out = { cul: cul };
    var by = o.by;
    var parentCul = cul, parentC = p.country;
    if (org.imm) { // immigrant parents from elsewhere
      var others = G.CLIST.filter(function (x) { return x !== p.country; });
      parentC = G.pick(others); parentCul = G.C[parentC].names;
      p.langs.push(G.C[parentC].lang);
      out.cul = parentCul; p.flags.immFrom = parentC;
    }
    if (org.orphan) {
      out.text = G.L('你被遗弃在福利院门口，院长阿姨收留了你。|You were left at the gates of an orphanage, and the director took you in.');
      var dir = G.N.make({ rel: 'mentor', g: 'f', age: G.ri(40, 55), job: '福利院院长|Orphanage Director', inc: G.$w(30000), pers: 'gentle', aff: 40 });
      dir.pin = 1;
      p.flags.orphan = 1;
      return out;
    }
    var famW = G.$(G.rf(org.w[0], org.w[1]));
    var fage = G.ri(23, 36), mage = G.clamp(fage + G.ri(-5, 2), 20, 40);
    if (by < 1975) { fage = G.ri(20, 32); mage = G.clamp(fage + G.ri(-4, 1), 18, 36); }
    var sur = o.sur && !org.imm ? o.sur : G.genSur(parentCul);
    var lo = G.clamp(p.st.looks + G.ri(-15, 15), 5, 100);
    var jobs = org.job.slice();
    function mkParent(g, age, i) {
      var title = jobs.length ? (jobs[i % jobs.length]) : '无业|Unemployed';
      if (org.id === 'royal') title = g === 'm' ? '国王|King' : '王后|Queen';
      var n = G.N.make({ rel: g === 'm' ? 'father' : 'mother', g: g, age: age, c: parentC, cul: parentCul, sur: g === 'm' ? sur : null,
        job: title, inc: G.$w(G.rf(org.inc[0], org.inc[1]), p.country), wealth: Math.round(famW / 2), aff: G.ri(55, 85), looks: G.clamp(lo + G.ri(-10, 10), 5, 100), orient: 'het' });
      if (org.away) n.away = 1;
      n.pin = 1;
      return n;
    }
    var f, m;
    if (org.single) {
      if (G.ch(.7)) { m = mkParent('f', mage, 0); m.wealth = famW; out.sur = G.ch(.5) ? sur : m.sur || sur; }
      else { f = mkParent('m', fage, 0); f.wealth = famW; out.sur = sur; }
      out.text = G.L('父母在你很小的时候就离婚了。|Your parents divorced when you were very young.');
    } else {
      f = mkParent('m', fage, 0); m = mkParent('f', mage, 1);
      out.sur = sur;
    }
    if (m && !m.sur) { m.sur = ''; }
    if (org.away) {
      var gp = G.N.make({ rel: 'grand', g: 'f', age: G.ri(55, 68), job: '退休|Retired', inc: G.$w(6000), pers: 'gentle', aff: 80, c: parentC, cul: parentCul });
      gp.pin = 1;
      out.text = G.L('父母去城里打工了，你跟着奶奶生活。|Your parents left to work in the city; you live with Grandma.');
    }
    // siblings
    var maxSib = org.sib[1];
    if (p.country === 'cn' && by >= 1980 && by <= 2015) maxSib = p.tier >= 4 ? Math.min(maxSib, 1) : 0;
    if (by < 1970) maxSib += 2;
    var ns = G.ri(org.sib[0], Math.max(org.sib[0], maxSib));
    if (ns > 0 && G.ch(.35)) ns = Math.max(0, ns - 1);
    for (var i = 0; i < ns; i++) {
      var sg = G.ch(.5) ? 'm' : 'f';
      var sby = by - G.ri(1, 8);
      var sib = G.N.make({ rel: 'sibling', g: sg, by: sby, c: parentC, cul: parentCul, sur: out.sur, aff: G.ri(30, 70), looks: G.clamp(lo + G.ri(-15, 15), 5, 100) });
      sib.pin = 1;
      if (sib.name.indexOf('|') < 0) sib.name = sib.name;
    }
    if (org.fl && org.fl.indexOf('mafiafam') >= 0) p.flags.mafiaName = G.pick(G.GANG.names);
    return out;
  };

  /* ---------- energy ---------- */
  G.emax = function () {
    var p = G.S.p, a = p.age, e;
    if (a < 3) e = 20; else if (a < 6) e = 40; else if (a < 12) e = 70; else if (a < 70) e = 100; else if (a < 85) e = 80; else e = 60;
    var v = G.vip ? G.vip.tier() : 0;
    e *= [1, 1.3, 1.6, 2][v] || 1;
    if (p.st.health < 30) e *= .8;
    if (p.jail) e *= .7;
    return Math.round(e);
  };

  /* ---------- wealth ---------- */
  G.houseVal = function (h) { return h.val || 0; };
  G.netWorth = function () {
    var S = G.S, p = S.p, A = S.assets, n = p.money;
    A.houses.forEach(function (h) { n += (h.val || 0) - (h.mort || 0); });
    A.cars.forEach(function (c) { n += c.val || 0; });
    A.items.forEach(function (c) { n += c.val || 0; });
    for (var k in A.inv) n += A.inv[k] || 0;
    if (A.company) n += (A.company.val || 0) * (A.company.own || 1);
    A.debt.forEach(function (d) { n -= d.amt || 0; });
    return Math.round(n);
  };
  /* family wealth (for kids): parents' combined */
  G.famWealth = function () {
    return G.sum(G.N.rel('father', 'mother', 'grand', 'stepparent'), function (n) { return n.wealth || 0; });
  };
  G.isKid = function () { var p = G.S.p; return p.age < 18 && !p.flags.indep; };
  G.dependent = function () { var p = G.S.p; return p.age < 18 || (p.edu.stage === 'uni' || p.edu.stage === 'master' || p.edu.stage === 'phd') && !p.job && !p.flags.indep && p.age < 26; };

  /* main title of player (job / status) */
  G.title = function () {
    var p = G.S.p;
    if (G.S.dead) return '已故|Deceased';
    if (p.jail) return '服刑中|In Prison';
    if (p.gov && p.gov.track === 'poli') return G.poliLadder(p.country).r[p.gov.rank];
    if (p.gov) return (p.country === 'cn' ? G.CIVIL.cn : G.CIVIL.gen)[p.gov.rank];
    if (p.mil) return G.L('{b}{r}|{b} {r}', { b: G.MIL.br[p.mil.br], r: p.mil.off ? G.MIL.off[p.mil.rank] : G.MIL.enl[p.mil.rank] });
    if (p.pol) return G.POLICE.r[p.pol.rank];
    if (p.gang && p.gang.rank >= 3) return G.L('{g}{r}|{r} of {g}', { g: p.gang.name, r: G.GANG.r[p.gang.rank] });
    if (p.fc) return G.FAME[p.fc.id].r[p.fc.rank];
    if (p.job) { var j = G.JOB[p.job.id]; return j ? j.r[Math.min(p.job.rank, j.r.length - 1)] : ''; }
    if (G.S.assets.company) return G.L('{c}创始人|Founder of {c}', { c: G.S.assets.company.name });
    if (p.gang) return G.L('{g}{r}|{r} of {g}', { g: p.gang.name, r: G.GANG.r[p.gang.rank] });
    var e = p.edu;
    if (e.stage && e.stage !== 'none' && e.stage !== 'done') {
      var sn = e.school || G.STAGES[e.stage].n;
      if (e.stage === 'uni' || e.stage === 'master' || e.stage === 'phd') return G.L('{s}·{m}|{s} · {m}', { s: sn, m: e.major ? G.MAJORS[e.major].n : G.STAGES[e.stage].n });
      return G.L('{s}{g}年级|{s}, Year {g}', { s: sn, g: e.grade + 1 });
    }
    if (p.retired) return '退休|Retired';
    if (p.age < 3) return '婴儿|Baby';
    if (p.age < 6) return '幼儿|Toddler';
    if (p.age >= 18) return '无业|Unemployed';
    return '辍学|Not in School';
  };

  /* ---------- continue as heir ---------- */
  G.life.heirs = function () { return G.N.rel('child').filter(function (n) { return n.alive; }); };
  G.life.continueAs = function (kid, estateShare) {
    var S = G.S, old = S.p;
    var ka = G.N.age(kid);
    var oldNpc = G.N.make({ rel: old.g === 'm' ? 'father' : 'mother', g: old.g, by: old.birthYear, name: old.name, sur: old.sur, giv: old.giv,
      looks: old.st.looks, smarts: old.st.smarts, eq: old.st.eq, job: G.title(), inc: 0, wealth: 0, aff: kid.aff, c: old.country });
    oldNpc.alive = false; oldNpc.died = S.year; oldNpc.pin = 1;
    S.lineage.push({ name: old.name, by: old.birthYear, dy: S.year, title: S.ending ? S.ending.title : '', score: S.ending ? S.ending.score : 0 });
    var spouse = G.N.partner();
    // relabel relations
    G.N.all().forEach(function (n) {
      if (n === kid || n === oldNpc) return;
      if (n.rel === 'father' || n.rel === 'mother') n.rel = 'grand';
      else if (n.rel === 'grand') { if (!n.alive) delete S.npcs[n.id]; else n.rel = 'contact'; }
      else if (n.rel === 'sibling') n.rel = 'contact';
      else if (n.rel === 'child') { n.rel = 'sibling'; n.older = n.by < kid.by; }
      else if (n.rel === 'grandchild') n.rel = 'contact';
      else if (n === spouse) n.rel = n.g === 'm' ? 'father' : 'mother';
      else if (!kid.npcRel || !kid.npcRel[n.id]) { if (n.rel !== 'friend') delete S.npcs[n.id]; }
    });
    // restore kid's own relationships
    (kid.kids || []).forEach(function (id) { var n = S.npcs[id]; if (n) n.rel = 'child'; });
    if (kid.spouseId && S.npcs[kid.spouseId]) S.npcs[kid.spouseId].rel = 'spouse';
    var A = S.assets, money = old.money;
    var np = {
      g: kid.g, orient: kid.orient === 'het' ? 'het' : kid.orient, birthYear: kid.by, age: ka, country: old.country, tier: old.tier, city: old.city, origin: old.origin,
      talents: kid.talents || [], name: kid.name, sur: kid.sur, giv: kid.giv, cul: old.cul,
      st: { looks: kid.looks, smarts: kid.smarts, health: kid.health, happy: G.clamp(kid.aff, 30, 80), fame: Math.round(old.st.fame * .4), eq: kid.eq },
      h: { stress: 10, karma: 0, fit: 30, luck: 0, heat: 0, rep: 0 }, energy: 0, emax: 0, money: 0, langs: old.langs.slice(0, 2),
      edu: kid.edu || { stage: 'none', grade: 0, perf: 50, deg: 0, study: 0, retake: 0 },
      job: null, fc: null, mil: null, pol: null, gov: null, gang: null, jail: null, biz: null, crime: { rec: 0 }, hab: { smoke: 0, drink: 0, gamble: 0, night: 0 },
      ill: [], surg: 0, pension: 0, partner: kid.spouseId || null, flags: { heir: 1 }, home: ka >= 18 ? 'rent' : 'parents', imm: [old.country], vip: old.vip
    };
    if (kid.jobT && ka >= 18) np.flags.npcJob = kid.jobT;
    if (old.flags.rich) np.flags.rich = 1; if (old.flags.elite) np.flags.elite = 1;
    S.p = np; S.gen++; S.dead = false; S.death = null; S.ending = null;
    // inheritance: share of estate
    var est = Math.max(0, G.netWorthOf(old, A));
    var share = estateShare == null ? 1 : estateShare;
    var tax = (G.C[old.country].itax || 0);
    var inh, keep = share >= 1 && !(spouse && spouse.alive);
    if (keep) { // sole heir keeps everything, pays estate tax from cash
      inh = Math.round(est * (1 - tax));
      np.money = Math.round(money - est * tax);
    } else {
      inh = Math.round(est * share * (1 - tax) * (spouse && spouse.alive ? .5 : 1));
      if (spouse && spouse.alive) spouse.wealth += Math.round(est * .5);
      A.houses = []; A.cars = []; A.items = []; A.inv = {}; A.company = null; A.debt = [];
      np.money = inh;
    }
    delete S.npcs[kid.id];
    S.log = S.log.slice(-1);
    S.major = [];
    np.emax = G.emax(); np.energy = np.emax;
    G.yearEntry();
    G.log('第{g}代人生开始了。你继承了家业：{m}。|Generation {g} begins. You inherit the family estate: {m}.', { g: S.gen, m: G.M(inh) });
    G.major('继承家业|Inherited the family estate');
    return S;
  };
  G.netWorthOf = function (p, A) {
    var n = p.money;
    A.houses.forEach(function (h) { n += (h.val || 0) - (h.mort || 0); });
    A.cars.forEach(function (c) { n += c.val || 0; });
    A.items.forEach(function (c) { n += c.val || 0; });
    for (var k in A.inv) n += A.inv[k] || 0;
    if (A.company) n += (A.company.val || 0) * (A.company.own || 1);
    A.debt.forEach(function (d) { n -= d.amt || 0; });
    return n;
  };
})();
