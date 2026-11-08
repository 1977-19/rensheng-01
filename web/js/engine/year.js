/* Year advance pipeline */
(function () {
  'use strict';
  G.busy = false;
  function nRandom(a) {
    if (a < 3) return G.ch(.5) ? 1 : 0;
    if (a < 6) return G.ri(0, 1) + (G.ch(.3) ? 1 : 0);
    if (a < 18) return G.ri(1, 2);
    if (a < 65) return G.ri(1, 3);
    return G.ri(1, 2);
  }
  G.pickRandomEvents = function (n) {
    var S = G.S, pool = G.EVL.filter(function (d) { return G.eligible(d, S); }), out = [];
    for (var i = 0; i < n && pool.length; i++) {
      var d = G.wpick(pool, function (x) { return G.weight(x, S); });
      if (!d) break;
      out.push(d);
      pool = pool.filter(function (x) { return x !== d && (!d.grp || x.grp !== d.grp); });
    }
    return out;
  };
  G.ageUp = async function () {
    var S = G.S; if (!S || S.dead || G.busy) return;
    G.busy = true;
    try {
      if (G.vip && G.vip.tier() > 0) G.snapshot();
      var p = S.p;
      S.year++; p.age++;
      G.yearEntry();
      p.emax = G.emax();
      var Q = [];
      G.health.age();
      var dead = G.N.tick();
      dead.forEach(function (n) { Q.push({ id: 'sys_npc_death', nid: n.id }); });
      G.world.tick(Q);
      G.school.tick(Q);
      G.career.tick(Q); G.fame.tick(Q); G.mil.tick(Q); G.police.tick(Q); G.gov.tick(Q); G.gang.tick(Q); G.crime.tick(Q);
      G.money.tick(Q);
      G.health.tick(Q);
      if (!S.dead) { G.love.tick(Q); G.family.tick(Q); }
      // birthdays / milestones
      if (p.age === 18) G.major('成年了|Came of age');
      // random events
      var rnd = G.pickRandomEvents(nRandom(p.age));
      rnd.forEach(function (d) { Q.push({ id: d.id }); });
      // process
      for (var i = 0; i < Q.length; i++) {
        if (S.dead) break;
        var q = Q[i];
        if (q.nid && !S.npcs[q.nid]) continue;
        await G.runEvent(q.id, q.prm, q.nid);
        G.emit('change');
      }
      if (!S.dead) G.health.deathCheck();
      G.inc('hapSum', p.st.happy); G.inc('hapN');
      p.energy = p.emax = G.emax();
      if (p.age >= 18 && !G.dependent()) p.flags.indep = 1;
      G.ach.check();
      if (S.dead) { await G.ending.run(); }
      else G.save('auto');
    } catch (e) { console.error(e); G.lastError = e; }
    finally { G.busy = false; G.emit('change'); }
  };

  /* ---------- energy-gated actions ---------- */
  G.useEnergy = function (n) {
    var p = G.S.p; if (p.energy < n) return false; p.energy -= n; return true;
  };

  /* ---------- save / load ---------- */
  G.SLOTS = function () { return G.vip && G.vip.tier() >= 3 ? 6 : 3; };
  G.save = function (slot) {
    if (!G.S) return;
    G.S.savedAt = Date.now();
    G.store.set('save_' + (slot || 'auto'), G.S);
    if (G.snap && (slot || 'auto') === 'auto') G.store.set('snap', G.snap);
  };
  G.load = function (slot) {
    var s = G.store.get('save_' + (slot || 'auto'));
    if (!s || !s.p) return false;
    G.S = s; G.snap = (slot || 'auto') === 'auto' ? G.store.get('snap') : null;
    G.migrate(s);
    return true;
  };
  G.migrate = function (s) {
    s.cnt = s.cnt || {}; s.flags = s.flags || {}; s.major = s.major || []; s.assets.inv = s.assets.inv || {};
    s.p.h = s.p.h || { stress: 0, karma: 0, fit: 30, luck: 0, heat: 0, rep: 0 };
  };
  G.slotInfo = function (slot) {
    var s = G.store.get('save_' + slot); if (!s || !s.p) return null;
    return { name: s.p.name, age: s.p.age, year: s.year, country: s.p.country, dead: s.dead, at: s.savedAt, gen: s.gen };
  };

  /* ---------- VIP rewind ---------- */
  G.snapshot = function () { try { G.snap = JSON.stringify(G.S); } catch (e) { G.snap = null; } };
  G.canRewind = function () {
    var v = G.vip ? G.vip.tier() : 0; if (!v || !G.snap) return false;
    var lim = [0, 1, 3, 999][v]; return (G.S.rewinds || 0) < lim;
  };
  G.rewind = function () {
    if (!G.canRewind()) return false;
    var used = (G.S.rewinds || 0) + 1;
    G.S = JSON.parse(G.snap); G.S.rewinds = used; G.snap = null;
    G.S.rs = (G.S.rs + 7919 * used) | 0;
    G.log('（时光倒流，你回到了这一年的开始。）|(Time rewinds. You are back at the start of this year.)');
    G.save('auto');
    return true;
  };
})();
