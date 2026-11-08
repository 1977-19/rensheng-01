/* Engine base: stats, deltas, logging, event registry & runner, context */
(function () {
  'use strict';
  var HID = { stress: 1, karma: 1, fit: 1, luck: 1, heat: 1, rep: 1 };
  G.HIDDEN_RANGE = { karma: [-100, 100], luck: [-50, 50] };

  /* ---------- delta collector (for result chips) ---------- */
  G.D = { on: 0, list: [] };
  function pushD(k, n, extra) {
    if (!G.D.on || !n) return;
    for (var i = 0; i < G.D.list.length; i++) { if (G.D.list[i].k === k && !extra) { G.D.list[i].n += n; return; } }
    G.D.list.push({ k: k, n: n, x: extra });
  }
  G.dStart = function () { G.D.on++; if (G.D.on === 1) G.D.list = []; };
  G.dEnd = function () { G.D.on = Math.max(0, G.D.on - 1); var l = G.D.list.filter(function (x) { return Math.abs(x.n) >= 0.5 || x.x; }); if (!G.D.on) G.D.list = []; return l; };
  G.dNote = function (txt) { pushD('note', 1, txt); };
  G.dPush = function (k, n) { pushD(k, n); };

  /* ---------- stats ---------- */
  G.has = function (t) { var p = G.S && G.S.p; return !!(p && p.talents && p.talents.indexOf(t) >= 0); };
  G.addStat = function (k, n, silent) {
    var p = G.S.p; if (!n) return 0;
    if (k === 'money') return G.addMoney(n);
    if (k === 'happy') {
      if (n < 0 && G.has('sensitive')) n *= 1.5;
      if (n > 0 && G.has('sensitive')) n *= 1.2;
      if (n < 0 && G.has('optimist')) n *= .6;
    }
    if (k === 'fame' && n > 0 && G.has('photogenic')) n *= 1.3;
    var tgt = HID[k] ? p.h : p.st;
    var old = tgt[k] || 0, rng = G.HIDDEN_RANGE[k] || [0, 100];
    var nv = G.clamp(old + n, rng[0], rng[1]);
    if (k === 'happy' && G.has('optimist')) nv = Math.max(nv, 25);
    tgt[k] = nv;
    var dd = nv - old;
    if (!silent && !HID[k]) pushD(k, dd);
    return dd;
  };
  G.stat = function (k) { var p = G.S.p; return HID[k] ? (p.h[k] || 0) : (p.st[k] || 0); };
  G.addMoney = function (n) {
    var p = G.S.p; n = Math.round(n);
    p.money += n; pushD('money', n);
    if (n > 0) G.S.cnt.earned = (G.S.cnt.earned || 0) + n;
    return n;
  };
  /* pay: uses cash; if kid, parents may pay (handled by caller). returns true if paid */
  G.canPay = function (n) { return G.S.p.money >= n; };
  G.pay = function (n) { if (G.S.p.money < n) return false; G.addMoney(-n); return true; };

  /* ---------- log ---------- */
  G.yearEntry = function () {
    var S = G.S, L = S.log, last = L[L.length - 1];
    if (!last || last.a !== S.p.age) { last = { a: S.p.age, y: S.year, t: [] }; L.push(last); }
    return last;
  };
  G.log = function (s, prm) { if (!s) return; var line = G.L(s, prm); G.yearEntry().t.push(line); G.emit('log', line); return line; };
  G.logRaw = function (neutral) { if (!neutral) return; G.yearEntry().t.push(neutral); G.emit('log', neutral); };
  G.major = function (s, prm) { var line = G.L(s, prm); G.S.major.push({ a: G.S.p.age, y: G.S.year, t: line }); return line; };
  G.inc = function (k, n) { var c = G.S.cnt; c[k] = (c[k] || 0) + (n == null ? 1 : n); return c[k]; };

  /* ---------- era gates: spec is a year or { g: year, cn: year, ... } (per-country earliest year) ---------- */
  G.eraOk = function (spec) {
    var S = G.S; if (!S || spec == null) return true;
    var y = typeof spec === 'number' ? spec : (spec[S.p.country] != null ? spec[S.p.country] : spec.g || 0);
    return S.year >= y;
  };
  /* is a job open in this country/year? cn0 = earliest year in China (planned economy before reform) */
  G.jobOk = function (j) {
    var S = G.S; if (!S) return true;
    if (j.y0 && S.year < j.y0) return false;
    if (S.p.country === 'cn' && j.cn0 && S.year < j.cn0) return false;
    return true;
  };

  /* ---------- event registry ---------- */
  G.EV = {}; G.EVL = [];
  G.ev = function (d) {
    if (G.EV[d.id]) console.warn('dup event', d.id);
    G.EV[d.id] = d;
    if (!d.sys) G.EVL.push(d);
  };
  G.evs = function (arr) { arr.forEach(G.ev); };

  /* ---------- context ---------- */
  G.ctx = function (prm, npcId) {
    var S = G.S;
    var c = {
      S: S, p: S.p, prm: prm || {}, q: [],
      npc: npcId != null ? S.npcs[npcId] : null,
      add: function (k, n) { return G.addStat(k, n); },
      money: function (n) { return G.addMoney(n); },
      pay: function (n) { return G.pay(n); },
      $: function (usd) { return G.$(usd); },
      $w: function (usd) { return G.$w(usd); },
      M: function (n) { return G.M(n); },
      ch: function (x) { return G.ch(x); },
      ri: G.ri, pick: G.pick, has: G.has,
      log: function (s, p2) { return G.log(s, p2 || c.prm); },
      major: function (s, p2) { return G.major(s, p2 || c.prm); },
      note: function (s, p2) { G.dNote(G.L(s, p2 || c.prm)); },
      game: function (id, o) { return G.UI.game(id, o || {}); },
      ev: function (id, p2, nid) { c.q.push({ id: id, prm: p2, nid: nid }); },
      luck: function () { return (G.stat('luck') || 0) / 100; },
      age: S.p.age
    };
    if (c.npc) { c.prm.n = c.npc.name; var pr = G.pr(c.npc.g); for (var k in pr) if (c.prm[k] === undefined) c.prm[k] = pr[k]; }
    return c;
  };
  function txt(x, c) { return typeof x === 'function' ? x(c) : x; }

  /* run an event by id. returns after all follow-ups resolved */
  G.runEvent = async function (id, prm, npcId) {
    var d = G.EV[id]; if (!d) { console.warn('no event', id); return; }
    var S = G.S; if (!S || S.dead) return;
    var c = G.ctx(prm, npcId);
    if (d.if && !d.if(S, S.p)) return;
    if (d.prep && d.prep(c) === false) return;
    S.done[id] = (S.done[id] || 0) + 1; S.cool[id] = S.p.age;
    var title = G.L(txt(d.title, c) || '人生事件|Life Event', c.prm);
    var text = G.L(txt(d.t, c), c.prm);
    var icon = txt(d.icon, c);
    if (d.o) {
      var opts = d.o.filter(function (o) { return (!o.if || o.if(c)) && (!o.era || G.eraOk(o.era)); });
      if (!opts.length) return;
      var shown = opts.map(function (o) {
        return { t: G.L(txt(o.t, c), c.prm), sub: o.sub ? G.L(txt(o.sub, c), c.prm) : '', dis: o.dis ? !!o.dis(c) : false };
      });
      var idx = await G.UI.event({ title: title, text: text, opts: shown, npc: c.npc, icon: icon, kind: d.kind });
      var o = opts[idx] || opts[0];
      G.dStart();
      var res = o.run ? await o.run(c) : null;
      var dl = G.dEnd();
      var rt = res ? G.L(res, c.prm) : null;
      if (d.log !== false) G.logRaw(rt ? G.join([title, rt], '：', ': ') : G.join([text, G.L('（{x}）|({x})', { x: shown[opts.indexOf(o)].t })], '', ' '));
      if (rt || dl.length) await G.UI.result({ title: title, text: rt, d: dl, icon: icon });
    } else {
      G.dStart();
      var r2 = d.run ? await d.run(c) : null;
      var dl2 = G.dEnd();
      var rt2 = r2 ? G.L(r2, c.prm) : null;
      var full = rt2 ? G.join([text, rt2], '', ' ') : text;
      if (d.log !== false) G.logRaw(full);
      if (!d.silent) await G.UI.event({ title: title, text: full, opts: [{ t: G.L(txt(d.ok, c) || '知道了|OK') }], npc: c.npc, icon: icon, d: dl2, kind: d.kind });
    }
    for (var i = 0; i < c.q.length; i++) { if (S.dead) break; await G.runEvent(c.q[i].id, c.q[i].prm, c.q[i].nid); }
    G.emit('change');
  };

  /* simple ad-hoc popup event (not registered) */
  G.popup = async function (title, text, prm, opts) {
    var shown = (opts || ['知道了|OK']).map(function (t) { return { t: G.L(t, prm) }; });
    return G.UI.event({ title: G.L(title, prm), text: G.L(text, prm), opts: shown });
  };
  /* show result card for an action */
  G.result = async function (title, text, prm, dl, icon) {
    var t = text ? G.L(text, prm) : null;
    if (t) G.logRaw(t);
    return G.UI.result({ title: G.L(title, prm), text: t, d: dl || [], icon: icon });
  };

  /* pick random eligible events for this year */
  G.eligible = function (d, S) {
    var p = S.p, a = d.a;
    if (a && (p.age < a[0] || p.age > a[1])) return false;
    var n = S.done[d.id] || 0;
    if (n && !d.rep) return false;
    if (n && d.rep && S.cool[d.id] != null && p.age - S.cool[d.id] < (d.cd || 4)) return false;
    if (d.y && (S.year < d.y[0] || S.year > d.y[1])) return false;
    if (d.era && !G.eraOk(d.era)) return false;
    if (d.if && !d.if(S, p)) return false;
    if (p.jail && !d.jail) return false;
    if (!p.jail && d.jail) return false;
    return true;
  };
  G.weight = function (d, S) {
    var w = typeof d.w === 'function' ? d.w(S, S.p) : (d.w == null ? 1 : d.w);
    if (d.good && G.has('lucky')) w *= 1.5;
    if (d.bad && G.has('lucky')) w *= .6;
    if (d.bad && G.has('unlucky')) w *= 1.7;
    if (d.good && G.has('unlucky')) w *= .6;
    return w;
  };
})();
