/* Health: aging, illness, habits, mortality */
(function () {
  'use strict';
  var HE = G.health = {};
  G.die = function (cause) {
    var S = G.S; if (S.dead) return;
    S.dead = true; S.death = { c: cause, a: S.p.age, y: S.year };
    G.major('{c}，享年{a}岁|{c}, aged {a}', { c: cause, a: S.p.age });
  };
  HE.age = function () {
    var S = G.S, p = S.p, a = p.age, st = p.st, h = p.h;
    // looks
    if (a >= 13 && a <= 20) G.addStat('looks', G.ri(-1, 2), true);
    if (a > 32) G.addStat('looks', -(a > 55 ? 1.2 : a > 42 ? .7 : .3) * (p.flags.antiAge ? .4 : 1), true);
    // smarts
    if (a <= 20) G.addStat('smarts', G.ri(0, 2), true);
    if (a > 68) G.addStat('smarts', -G.ri(0, 2), true);
    // health: regresses toward an age-dependent cap
    var cap = 100 - Math.max(0, a - 28) * .95 + (h.fit - 30) / 6;
    if (G.has('iron')) cap += 8; if (G.has('frail')) cap -= 10; if (G.has('longevity')) cap += 6; if (p.flags.antiAge) cap += 8;
    cap = G.clamp(cap, 15, 100);
    G.addStat('health', (cap - st.health) * (st.health < cap ? .25 : .3), true);
    // habits
    var hb = p.hab;
    if (hb.smoke > 0) { G.addStat('health', -hb.smoke / 18, true); G.addStat('looks', -hb.smoke / 60, true); }
    if (hb.drink > 0) { G.addStat('health', -hb.drink / 22, true); }
    if (hb.night > 0) { G.addStat('health', -hb.night / 25, true); G.addStat('looks', -hb.night / 50, true); hb.night = Math.max(0, hb.night - 10); }
    if (hb.gamble > 50) G.addStat('happy', -3, true);
    // mood regression
    var base = 60 + (G.has('optimist') ? 10 : 0) - (p.jail ? 20 : 0) - (p.flags.langBar ? 6 : 0) - (h.stress > 60 ? 10 : 0);
    G.addStat('happy', (base - st.happy) * .18, true);
    G.addStat('stress', -6, true);
    h.fit = G.clamp(h.fit - 2, 0, 100);
    // fame decay
    if (!p.fc && !(p.gov && p.gov.track === 'poli') && st.fame > 0) G.addStat('fame', -Math.max(1, st.fame * .06), true);
    if (p.flags.langBar && G.ch(.35)) { p.flags.langBar = 0; p.langs.push(G.C[p.country].lang); G.log('你终于能流利地说当地语言了。|You can finally speak the local language fluently.'); }
    // late bloomer
    if (G.has('late') && a >= 35 && a <= 60) { G.addStat('smarts', 1, true); G.addStat('eq', 1, true); G.addStat('looks', .8, true); }
    if (a === 18 && G.has('prodigy')) G.addStat('smarts', 3, true);
  };

  HE.tick = function (Q) {
    var S = G.S, p = S.p, a = p.age;
    // progress existing illnesses
    var keep = [];
    p.ill.forEach(function (x) {
      var d = G.ILL[x.id]; if (!d) return;
      x.yrs++;
      G.addStat('health', -d.dmg * (x.known ? .7 : 1), true);
      if (d.hp) G.addStat('happy', d.hp / 2, true);
      if (d.sm) G.addStat('smarts', d.sm / 2, true);
      if (d.lethal && G.ch(d.lethal * (1 + x.yrs * .25) * (x.known ? .7 : 1))) { G.die(G.L('死于{d}|Died of {d}', { d: d.n })); return; }
      if (d.sev === 1 && G.ch(.75)) return; // natural recovery
      if (!d.chronic && G.ch(d.sev <= 3 ? .35 : .1)) return;
      if (!x.known && (d.sev >= 3 && G.ch(.5) || G.ch(.25))) { x.known = 1; Q.push({ id: 'sys_ill', prm: { i: x.id } }); }
      keep.push(x);
    });
    if (G.S.dead) return;
    p.ill = keep;
    // new illness
    var ch = .14 + (a > 50 ? (a - 50) * .006 : 0) + (100 - p.st.health) / 400 + (p.hab.smoke + p.hab.drink) / 600;
    if (G.has('iron')) ch *= .5; if (G.has('frail')) ch *= 1.6;
    if (S.world.pandemicY === S.year) ch += .2;
    if (G.ch(ch)) {
      var have = {}; p.ill.forEach(function (x) { have[x.id] = 1; });
      var pool = Object.keys(G.ILL).filter(function (k) { var d = G.ILL[k]; return !have[k] && a >= d.a && (!d.g || d.g === p.g) && !(k === 'myopia' && p.flags.myopiaFixed); });
      var id = G.wpick(pool, function (k) {
        var d = G.ILL[k], w = [0, 6, 3, 1.4, .6, .25][d.sev];
        if (d.sev >= 4 && a > 45) w *= 2.5; if (d.sev >= 4 && a > 65) w *= 2;
        if (d.hab) w *= p.hab[d.hab] > 20 ? 1 + p.hab[d.hab] / 25 : .25;
        if (k === 'depression' || k === 'anxiety') w *= p.st.happy < 30 ? 6 : p.h.stress > 60 ? 3 : .5;
        if (k === 'burnout') w *= p.h.stress > 65 ? 6 : .2;
        if (k === 'myopia') w *= a < 20 ? 4 : .2;
        if (k === 'spine') w *= p.job && (p.job.id === 'coder' || p.job.id === 'acct') ? 4 : 1;
        if (d.rare) w *= .3;
        return w;
      });
      if (id) {
        var d = G.ILL[id], x = { id: id, yrs: 0, known: d.sev >= 2 || G.ch(.5) ? 1 : 0 };
        p.ill.push(x);
        if (d.lk) G.addStat('looks', d.lk, true);
        if (x.known) { if (d.sev >= 2) Q.push({ id: 'sys_ill', prm: { i: id } }); else G.log('你得了{d}。|You caught {d}.', { d: d.n }); }
        G.inc('ills');
      }
    }
    // accidents
    var acc = .0015 + (S.assets.cars.length ? .002 : 0) + (p.hab.drink > 50 ? .003 : 0);
    if (G.ch(acc * (G.has('unlucky') ? 2 : G.has('lucky') ? .5 : 1))) Q.push({ id: 'sys_accident' });
  };

  HE.deathCheck = function () {
    var S = G.S, p = S.p, a = p.age; if (S.dead) return;
    if (p.st.health <= 0) { var big = p.ill.filter(function (x) { return G.ILL[x.id].sev >= 3 && !G.ILL[x.id].hp; })[0]; G.die(big ? G.L('死于{d}|Died of {d}', { d: G.ILL[big.id].n }) : (a >= 75 ? '寿终正寝|Died peacefully of old age' : '病逝|Died of illness')); return; }
    var life = G.C[p.country].life || 78;
    if (a < 40) return;
    var ae = a - (life - 78);
    var q = .055 * Math.exp(.095 * (ae - 80)) * (1.8 - 1.4 * p.st.health / 100);
    if (G.has('longevity')) q *= .6; if (p.flags.antiAge) q *= .6; if (G.has('frail')) q *= 1.3; if (G.has('iron')) q *= .85;
    if (a > 112) q = 1;
    if (G.ch(Math.min(q, .9))) G.die(a >= 72 ? '寿终正寝|Died peacefully of old age' : '突发疾病|Died of a sudden illness');
  };

  HE.options = function (ill) {
    var d = G.ILL[ill.id], base = G.$(d.cost);
    return [
      { n: '社区诊所|Community Clinic', cost: Math.round(base * .4), m: .6 },
      { n: '公立医院|Public Hospital', cost: base, m: 1 },
      { n: '顶级私立医院|Top Private Hospital', cost: Math.round(base * 4), m: 1.35 },
      { n: '偏方/民间疗法|Folk Remedy', cost: Math.round(base * .1), m: .25 }
    ];
  };
  HE.treat = function (ill, opt) {
    var p = G.S.p, d = G.ILL[ill.id];
    if (!G.pay(opt.cost)) return null;
    var ok = G.ch(Math.min(.98, d.cure * opt.m));
    if (ok) { p.ill = p.ill.filter(function (x) { return x !== ill; }); G.addStat('health', Math.min(15, d.dmg)); G.addStat('happy', 5); if (ill.id === 'myopia') p.flags.myopiaFixed = 1; }
    else G.addStat('health', 2);
    return ok;
  };

  G.evs([
    { id: 'sys_ill', sys: 1, title: '生病了|Illness', icon: '🏥', bad: 1,
      prep: function (c) { c.prm.d = G.ILL[c.prm.i].n; c.ill = c.p.ill.filter(function (x) { return x.id === c.prm.i; })[0]; if (!c.ill) return false; },
      t: function (c) { return G.ILL[c.prm.i].sev >= 4 ? '体检报告出来了，医生面色凝重：你患上了{d}。|The test results are back and the doctor looks grim: you have {d}.' : '你最近身体不舒服，去医院一查，是{d}。|You haven\'t felt well lately. The hospital says it\'s {d}.'; },
      o: function () { return null; } },
    { id: 'sys_accident', sys: 1, title: '意外|Accident', icon: '🚑', bad: 1,
      t: function (c) { c.prm.k = G.S.assets.cars.length && G.ch(.6) ? 0 : G.ri(1, 3); return ['你开车时出了车祸。|You were in a car crash.', '你下楼时一脚踩空，摔得不轻。|You missed a step and took a bad fall.', '你在路上被一辆电动车撞倒了。|An e-bike knocked you down on the street.', '你在健身时受了伤。|You got hurt working out.'][c.prm.k]; },
      run: function (c) { if (G.ch(.06)) { G.die('死于意外事故|Died in an accident'); return '伤势过重，抢救无效……|The injuries were too severe...'; } c.add('health', -G.ri(8, 25)); c.p.ill.push({ id: 'fracture', yrs: 0, known: 1 }); if (c.prm.k === 0) { var car = G.S.assets.cars[0]; if (car) car.val = Math.round(car.val * .4); } return '你骨折了，需要休养。|You broke a bone and need to recover.'; } }
  ]);
  // sys_ill options are built dynamically
  G.EV.sys_ill.o = [
    { t: '马上治疗|Get treatment now', run: async function (c) {
      var opts = HE.options(c.ill);
      var i = await G.UI.pick({ title: G.L('选择医院|Choose Care'), items: opts.map(function (o) { return { t: o.n, sub: G.M(o.cost), icon: '🏥', dis: G.S.p.money < o.cost }; }) });
      if (i < 0) return '你还是没去治疗。|In the end, you skipped treatment.';
      var ok = HE.treat(c.ill, opts[i]);
      if (ok === null) return '钱不够，没能治疗。|You couldn\'t afford it.';
      return ok ? G.L('治疗很成功，{d}痊愈了！|Treatment worked — your {d} is cured!', c.prm) : G.L('治疗效果一般，{d}还没好。|Treatment didn\'t fully work; your {d} lingers.', c.prm);
    } },
    { t: '先扛着|Tough it out', run: function (c) { return '你决定先不管它。|You decide to ignore it for now.'; } }
  ];
})();
