/* 出身事件库 (Origin event database), version 3.1.
   Every family origin owns its own life: a family conflict with its own cause, a childhood, school years,
   friendships, an adult career path, a turning point that answers the choices made earlier, old age, and an
   ending verdict. Events here are exclusive: they only fire for their own origin (or for the few origins listed
   on purpose), each happens once, and later chapters read the flags left by earlier ones.

   Data format, per origin:
     G.ODB(id, events, endings)
     event: [cat, key, [ageMin, ageMax], title, icon, text, options, extra]
       cat     fam | kid | sch | soc | adu | turn | late
       options [label, result, effects, flag]   flag is stored in p.flags.os[flag] = 1
       extra   { need: 'flag' | ['flag', ...] | fn(p, f), not: 'flag', after: 'key', gap: years, w: weight, orgs: [...] }
     endings: [[test(p, f), title, verdict], ...] — the first that matches is this life's origin verdict. */
(function () {
  'use strict';
  var N = G.N, H = G.EH;
  function S() { return G.S; }
  G.ODBX = { byOrg: {}, ends: {}, ids: [], cat: {} };
  var CAT = { fam: '家庭|Family', kid: '童年|Childhood', sch: '求学|School', soc: '人情|People', adu: '立业|Career', turn: '转折|Turning Point', late: '晚年|Later Years' };
  G.ODB_CAT = CAT;
  function flags(p) { p.flags.os = p.flags.os || {}; return p.flags.os; }
  function has(f, k) { return !!f[k]; }
  function needOk(n, p, f) {
    if (!n) return true;
    if (typeof n === 'function') return !!n(p, f);
    if (Array.isArray(n)) return n.some(function (k) { return has(f, k); });
    return has(f, n);
  }
  G.ODB = function (org, list, ends) {
    var ids = [];
    list.forEach(function (e) {
      var cat = e[0], key = e[1], id = 'od_' + org + '_' + key, x = e[7] || {}, orgs = x.orgs || [org];
      var d = {
        id: id, a: e[2], title: e[3], icon: e[4], t: e[5], odb: org, ocat: cat, rep: 0, w: x.w || 4,
        if: function (S2, p) {
          if (orgs.indexOf(p.origin) < 0 || p.flags.trafficked) return false;
          var f = flags(p);
          if (x.after) { var aid = CAT[x.after] ? (G.ODBX.cat[org] || {})[x.after] : 'od_' + org + '_' + x.after; if (!S2.done[aid] || p.age - (S2.cool[aid] || 0) < (x.gap || 2)) return false; }
          if (!needOk(x.need, p, f)) return false;
          if (x.not && has(f, x.not)) return false;
          if (x.jobless && p.job) return false;
          if (x.cond && !x.cond(p, f)) return false;
          return true;
        },
        o: e[6].map(function (o) {
          return { t: o[0], if: o[4] ? function (c) { return !!o[4](c.p, flags(c.p)); } : null, run: function (c) {
            var f = flags(c.p); if (o[3]) [].concat(o[3]).forEach(function (k) { f[k] = 1; });
            if (o[3] && [].concat(o[3]).indexOf('crack') >= 0) c.p.flags.osCrack = 1;
            H.fx(c, o[2] || {});
            return typeof o[1] === 'function' ? o[1](c, f) : o[1];
          } };
        })
      };
      if (x.noGate) d.noGate = 1;
      G.ev(d); ids.push(id); G.ODBX.ids.push(id);
      var cm = G.ODBX.cat[org] = G.ODBX.cat[org] || {}; if (!cm[cat]) cm[cat] = id;
    });
    G.ODBX.byOrg[org] = (G.ODBX.byOrg[org] || []).concat(ids);
    if (ends) G.ODBX.ends[org] = ends;
  };

  /* ---------- the year belongs to your origin: one chapter a year when one is due ---------- */
  var pick0 = G.pickRandomEvents;
  G.pickRandomEvents = function (n) {
    var out = pick0.apply(this, arguments) || [], s = S(), p = s && s.p;
    if (!p || p.jail) return out;
    var ids = G.ODBX.byOrg[p.origin]; if (!ids) return out;
    if (out.some(function (d) { return d && d.odb; })) return out;
    var pool = ids.map(function (id) { return G.EV[id]; }).filter(function (d) { return d && G.eligible(d, s); });
    if (!pool.length) return out;
    // a due chapter shows up more often the closer its window is to closing
    var urgent = pool.some(function (d) { return d.a && d.a[1] - p.age <= 1; });
    if (!urgent && !G.ch(p.age < 25 ? .62 : .5)) return out;
    pool.sort(function (a, b) { return (a.a ? a.a[0] : 0) - (b.a ? b.a[0] : 0); });
    var d = urgent ? pool.filter(function (x) { return x.a && x.a[1] - p.age <= 1; })[0] : G.wpick(pool.slice(0, 3), function (x) { return x.w || 4; });
    if (!d) return out;
    var res = out.slice(); if (res.length >= 2) res.pop();
    res.unshift(d);
    return res;
  };

  /* ---------- no generic "parents fighting": each origin has its own conflict ---------- */
  function gate(id, f) { var d = G.EV[id]; if (!d) return; var f0 = d.if; d.if = function (S2, p) { return f(S2, p) && (!f0 || f0(S2, p)); }; }
  gate('c_fight_par', function (S2, p) { return !G.ODBX.byOrg[p.origin]; });
  // a divorce follows from the family's own crack, not from nowhere
  gate('c_divorce', function (S2, p) { return !G.ODBX.byOrg[p.origin] || !!p.flags.osCrack; });

  /* ---------- the origin verdict at the end ---------- */
  G.originVerdict = function () {
    var s = S(), p = s && s.p; if (!p) return null;
    var L = G.ODBX.ends[p.origin]; if (!L) return null;
    var f = flags(p), seen = (G.ODBX.byOrg[p.origin] || []).filter(function (id) { return s.done[id]; }).length;
    for (var i = 0; i < L.length; i++) { try { if (L[i][0](p, f, s)) return { t: L[i][1], d: L[i][2], n: seen, tot: (G.ODBX.byOrg[p.origin] || []).length, org: p.origin }; } catch (e) { } }
    return null;
  };
  var cmp = G.ending.compute;
  G.ending.compute = function () { var d = cmp.apply(this, arguments); try { d.ov = G.originVerdict(); } catch (e) { } return d; };
})();
