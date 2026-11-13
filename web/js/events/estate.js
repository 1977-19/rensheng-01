/* Family & estate: wills, inheritance fights, pregnancies with a chosen partner, affairs and secret children,
   and everything you can do for (or to) your kids */
(function () {
  'use strict';
  var N = G.N, LO = G.love, FA = G.family, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  var ES = G.estate = {};
  function S() { return G.S; }
  function kids(all) { return N.rel('child').filter(function (k) { return k.alive && (all || !k.illegit || k.ack); }); }
  function allKids() { return N.rel('child').filter(function (k) { return k.alive; }); }
  function pr(n) { var o = { n: n.name }, x = G.pr(n.g); for (var k in x) o[k] = x[k]; return o; }
  function greedy(n) { return ['gold', 'scheme', 'boss', 'sharp'].indexOf(n.pers) >= 0; }
  function res(a, t, prm, dl) { return G.result(a.n, t, prm, dl || [], a.i); }
  function hid(h) { if (!h.id) h.id = G.uid(); return h.id; }

  /* pending events that fire next year */
  var ft = FA.tick;
  FA.tick = function (Q) { ft(Q); var P = S().pendQ || []; S().pendQ = []; P.forEach(function (q) { Q.push(q); }); };
  ES.later = function (id, nid, prm) { (S().pendQ = S().pendQ || []).push({ id: id, nid: nid, prm: prm }); };

  /* ---------- relation names ---------- */
  var rn = N.relName;
  N.relName = function (n) {
    if (n.rel === 'child' && n.illegit) return n.g === 'm' ? (n.ack ? '儿子（非婚生）|Son (born outside marriage)' : '私生子|Secret Son') : (n.ack ? '女儿（非婚生）|Daughter (born outside marriage)' : '私生女|Secret Daughter');
    return rn(n);
  };

  /* ====================== PREGNANCY WITH A CHOSEN PARTNER ====================== */
  function fertileAge(p, n) { var wa = p.g === 'f' ? p.age : N.age(n); return wa < 30 ? .55 : wa < 35 ? .42 : wa < 40 ? .25 : wa < 45 ? .08 : 0; }
  LO.canConceive = function (pt) {
    var p = G.S.p; if (!pt || !pt.alive || pt.g === p.g) return false;
    if (['spouse', 'lover', 'affair'].indexOf(pt.rel) < 0) return false;
    if (pt.preg || (p.preg && p.preg.with)) return false;
    return p.age >= 18 && N.age(pt) >= 18 && (p.g === 'f' ? p.age : N.age(pt)) < 50;
  };
  ES.partners = function () { return N.all(function (n) { return n.alive && ['spouse', 'lover', 'affair'].indexOf(n.rel) >= 0; }); };
  // yearly: conception & due dates (replaces the old "same-year" birth)
  var lt = LO.tick;
  LO.tick = function (Q) {
    var p = G.S.p, y = G.S.year;
    // births due this year
    ES.partners().concat(N.all(function (n) { return n.alive && n.preg; })).forEach(function (n) { if (n.preg && n.preg.due <= y) { n.preg = null; Q.push({ id: 'sys_birth', nid: n.id }); } });
    if (p.preg && p.preg.due <= y) { var w = G.S.npcs[p.preg.with]; p.preg = null; if (w) Q.push({ id: 'sys_birth', nid: w.id }); }
    // stop the base tick from rolling its own pregnancy
    var keep = LO.canConceive; LO.canConceive = function () { return false; };
    try { lt(Q); } finally { LO.canConceive = keep; }
    // conception
    ES.partners().forEach(function (n) {
      if (!LO.canConceive(n)) return;
      var base = fertileAge(p, n); if (G.has('fertile')) base *= 1.4;
      var trying = !!n.trying; // trying stays on until a baby is on the way or you stop
      var ch = trying ? base : n.rel === 'spouse' ? base * .1 : n.rel === 'affair' ? base * .07 : base * .04;
      if (!G.ch(ch)) return;
      if (p.g === 'f') p.preg = { with: n.id, due: y + 1 }; else n.preg = { due: y + 1, by: 'p' };
      n.trying = 0;
      if (n.rel === 'affair') { G.log(p.g === 'f' ? '你怀上了情人{n}的孩子……|You\'re pregnant with your secret lover {n}\'s child...' : '情人{n}告诉你：{s}怀孕了。|Your secret lover {n} tells you {s}\'s pregnant.', { n: n.name, s: n.g === 'f' ? '她|she' : '他|he' }); Q.push({ id: 'n_affair_preg', nid: n.id }); }
      else G.log(p.g === 'f' ? '你怀孕了！孩子的{x}是{n}。|You\'re pregnant! {n} is the {y}.' : '{n}怀孕了！明年就要当{z}了。|{n} is pregnant! You\'ll be a {w} next year.', { n: n.name, x: '父亲|', y: '|father', z: '爸爸|', w: '|father' });
      G.major(p.g === 'f' ? '怀孕了|Became pregnant' : '{n}怀孕了|{n} became pregnant', { n: n.name });
    });
  };
  // baby born to an affair partner: a secret child
  var baby = LO.baby;
  LO.baby = async function (other, adopted) {
    var k = await baby(other, adopted);
    if (k && other && other.rel === 'affair') {
      k.illegit = 1; k.secret = N.spouse() ? 1 : 0; k.ack = 0; k.rel = 'child'; k.par2 = other.id; other.kidOf = (other.kidOf || 0) + 1;
      k.aff = G.ri(30, 60);
      if (S().p.g === 'm') { k.sur = other.sur; k.name = G.mkName(G.S.p.cul || G.C[G.S.p.country].names, other.sur, k.giv || (k.name || '').replace(/^\S/, ''), k.g); }
      G.major('有了一个私生{x}：{n}|Had a secret {x}: {n}', { x: k.g === 'm' ? '子|son' : '女|daughter', n: k.name });
    }
    return k;
  };

  /* ====================== THE WILL ====================== */
  ES.will = function () { var p = S().p; return p.will || null; };
  ES.beneficiaries = function () {
    var out = kids(true).slice(), sp = N.spouse(), w = ES.will();
    if (sp && sp.alive) out.unshift(sp);
    if (w && w.pct) Object.keys(w.pct).forEach(function (id) { var n = S().npcs[id]; if (n && n.alive && out.indexOf(n) < 0) out.push(n); });
    return out;
  };
  // share table {npcId: fraction}, charity fraction, and who gets which house / the company
  ES.plan = function () {
    var p = S().p, w = ES.will(), sp = N.spouse(), legit = kids(false), all = kids(true), share = {}, charity = 0, main = null;
    var spAlive = sp && sp.alive;
    if (!w) {
      // no will: the law decides — spouse half, legitimate (and acknowledged) children split the rest
      var heirs = legit.length ? legit : all.filter(function (k) { return k.ack; });
      if (spAlive) share[sp.id] = heirs.length ? .5 : 1;
      heirs.forEach(function (k) { share[k.id] = (spAlive ? .5 : 1) / heirs.length; });
      main = spAlive ? sp : heirs.slice().sort(function (a, b) { return a.by - b.by; })[0];
    } else {
      charity = w.charity || 0;
      var pool = all.filter(function (k) { return !(w.cut || {})[k.id] && (!k.illegit || k.ack || w.incl); });
      if (w.mode === 'spouse' && spAlive) share[sp.id] = 1;
      else if (w.mode === 'one' && S().npcs[w.main] && S().npcs[w.main].alive) {
        var m = S().npcs[w.main], rest = pool.filter(function (k) { return k !== m; });
        var mp = w.mainPct != null ? w.mainPct : .7; share[m.id] = rest.length ? mp : 1; if (mp < 1) rest.forEach(function (k) { share[k.id] = (1 - mp) / rest.length; });
      } else if (w.mode === 'custom' && w.pct) {
        var tot = 0; Object.keys(w.pct).forEach(function (id) { var n = S().npcs[id]; if (n && n.alive) tot += w.pct[id]; });
        Object.keys(w.pct).forEach(function (id) { var n = S().npcs[id]; if (n && n.alive && tot > 0) share[id] = w.pct[id] / tot; });
      } else {
        var ppl = pool.slice(); if (spAlive && w.spouseIn !== false) ppl.unshift(sp);
        ppl.forEach(function (n) { share[n.id] = 1 / Math.max(1, ppl.length); });
      }
      main = S().npcs[w.main] && S().npcs[w.main].alive ? S().npcs[w.main] : null;
      if (!main) { var best = null; Object.keys(share).forEach(function (id) { if (!best || share[id] > share[best]) best = id; }); main = best ? S().npcs[best] : null; }
    }
    var houses = {};
    S().assets.houses.forEach(function (h, i) {
      var to = w && w.houses && S().npcs[w.houses[hid(h)]] && S().npcs[w.houses[hid(h)]].alive ? w.houses[hid(h)] : null;
      if (!to) { var ids = Object.keys(share).filter(function (id) { return share[id] > 0; }).sort(function (a, b) { return share[b] - share[a]; }); to = h.live && main ? main.id : ids[i % Math.max(1, ids.length)] || (main && main.id); }
      houses[hid(h)] = to;
    });
    return { share: share, charity: charity, main: main ? main.id : null, houses: houses, company: (w && w.company && S().npcs[w.company]) ? w.company : (main ? main.id : null) };
  };
  ES.risk = function (plan) {
    plan = plan || ES.plan();
    var all = allKids(), w = ES.will(), nw = G.netWorth();
    if (all.length < 1 || nw < G.$(20000)) return 0;
    var vals = all.map(function (k) { return plan.share[k.id] || 0; }), mx = Math.max.apply(null, vals), mn = Math.min.apply(null, vals);
    var r = .06 + (all.length - 1) * .07 + (mx - mn) * .55;
    all.forEach(function (k) { if (k.illegit) r += k.ack ? .08 : .16; if (greedy(k)) r += .06; if (k.aff < 0) r += .05; });
    if (nw > G.$(1e6)) r += .08; if (nw > G.$(2e7)) r += .12;
    r += (S().p.flags.rivalry || 0) * .03;
    // close families don't fight over money: affection and family reunions keep the peace
    var avg = G.sum(all, function (k) { return k.aff; }) / all.length;
    r *= avg >= 70 ? .3 : avg >= 50 ? .55 : avg >= 30 ? .85 : 1.2;
    r -= (S().p.flags.unity || 0) * .04;
    if (w && w.notary) r -= .18; if (!w && all.length > 1) r += .08;
    return G.clamp(r, .02, .9);
  };
  // run at death: divide the estate, maybe fight over it
  ES.settle = function () {
    var p = S().p, plan = ES.plan(), est = Math.max(0, G.netWorth()), tax = G.C[p.country].itax || 0;
    var out = { total: est, tax: Math.round(est * tax), charity: Math.round(est * plan.charity), fees: 0, lines: [], dispute: null, plan: plan };
    var left = est - out.tax - out.charity;
    if (out.charity > 0) G.inc('donated', out.charity);
    if (allKids().length && G.ch(ES.risk(plan))) {
      var all = allKids();
      var loser = all.slice().sort(function (a, b) { return ((plan.share[a.id] || 0) - (greedy(a) ? .1 : 0) - (a.illegit ? .15 : 0)) - ((plan.share[b.id] || 0) - (greedy(b) ? .1 : 0) - (b.illegit ? .15 : 0)); })[0];
      var winnerId = Object.keys(plan.share).filter(function (id) { return id !== loser.id; }).sort(function (a, b) { return plan.share[b] - plan.share[a]; })[0];
      var winner = winnerId ? S().npcs[winnerId] : null;
      out.fees = Math.round(left * G.rf(.08, .25)); left -= out.fees;
      var won = G.ch(.4 + (loser.illegit ? -.1 : 0) - ((ES.will() || {}).notary ? .25 : 0));
      if (won) { var give = Math.min(.3, (plan.share[winnerId] || 0) * .4); plan.share[loser.id] = (plan.share[loser.id] || 0) + give; if (winnerId) plan.share[winnerId] -= give; }
      if (winner) { loser.feud = winner.id; winner.feud = loser.id; }
      out.dispute = { a: loser.id, b: winnerId, won: won, an: loser.name, bn: winner ? winner.name : '' };
    }
    Object.keys(plan.share).forEach(function (id) {
      var n = S().npcs[id]; if (!n) return;
      var hs = S().assets.houses.filter(function (h) { return plan.houses[hid(h)] === id; }).map(function (h) { return h.n; });
      out.lines.push({ id: id, name: n.name, rel: N.relName(n), amt: Math.round(left * plan.share[id]), pct: Math.round(plan.share[id] * 100), houses: hs, company: plan.company === id && !!S().assets.company });
    });
    return out;
  };
  var run = G.ending.run;
  G.ending.run = async function () {
    var est = ES.settle(), compute = G.ending.compute;
    G.ending.compute = function () { var d = compute(); d.estate = est; d.heirs = d.heirs.filter(function (h) { var n = S().npcs[h.id]; return n && (!n.illegit || n.ack || est.plan.share[h.id]); }); return d; };
    try { await run(); } finally { G.ending.compute = compute; }
  };
  // playing on: the chosen child receives their share, their houses and (maybe) the company
  var cont = G.life.continueAs;
  G.life.continueAs = function (kid) {
    var d = S().ending, est = d && d.estate, A = S().assets;
    if (!est) return cont.apply(this, arguments);
    var line = est.lines.filter(function (l) { return l.id === kid.id; })[0] || { amt: 0 };
    var keepH = A.houses.filter(function (h) { return est.plan.houses[hid(h)] === kid.id; }).map(function (h) { return JSON.parse(JSON.stringify(h)); });
    var keepC = est.plan.company === kid.id && A.company ? JSON.parse(JSON.stringify(A.company)) : null;
    // everyone else gets theirs as NPC wealth
    est.lines.forEach(function (l) { var n = S().npcs[l.id]; if (n && l.id !== kid.id) { n.wealth += l.amt; N.addAff(n, l.pct >= 30 ? 5 : -8); } });
    var feud = kid.feud, sp0 = N.partner();
    var r = cont.call(this, kid, 0);
    if (sp0 && sp0.alive) sp0.wealth = Math.max(0, sp0.wealth - Math.round(est.total * .5)); // the base routine already handed the spouse half; shares were paid above
    var np = S().p;
    np.money = line.amt - keepH.reduce(function (s, h) { return s + Math.max(0, h.val - (h.mort || 0)); }, 0) - (keepC ? Math.round((keepC.val || 0) * (keepC.own || 1)) : 0);
    if (np.money < 0) np.money = Math.max(0, Math.round(line.amt * .2));
    keepH.forEach(function (h, i) { h.live = i === 0; S().assets.houses.push(h); if (h.live) np.home = h.id; });
    if (keepC) S().assets.company = keepC;
    if (keepH.length) G.log('你继承了{h}。|You inherited {h}.', { h: G.join(keepH.map(function (h) { return h.n; }), '、', ', ') });
    if (keepC) G.log('你接手了家族公司。|You took over the family company.');
    if (feud && S().npcs[feud]) { var f = S().npcs[feud]; f.aff = Math.min(f.aff, -35); ES.later('n_estate_suit', f.id); }
    np.will = null;
    return r;
  };

  /* parents' estate: the family home passes down, and siblings may fight over it */
  var inherit = FA.inherit;
  FA.inherit = function (dead) {
    var p = S().p, other = N.rel('father', 'mother').filter(function (n) { return n !== dead && n.alive; })[0];
    if (other && (dead.rel === 'father' || dead.rel === 'mother')) return inherit(dead);
    var sibs = N.rel('sibling').filter(function (n) { return n.alive; });
    var w = Math.max(0, dead.wealth), share = inherit(dead);
    // the old family home
    if ((dead.rel === 'father' || dead.rel === 'mother') && !p.flags.gotFamHome && w > G.$(15000) && p.age >= 18) {
      p.flags.gotFamHome = 1;
      var H0 = G.HOUSES.filter(function (x) { return x.id === (p.tier >= 4 ? 'self' : 'old'); })[0] || G.HOUSES[1];
      var val = G.money.housePrice(H0, p.tier);
      if (!sibs.length || G.ch(.5)) {
        S().assets.houses.push({ id: G.uid(), k: H0.id, n: '父母的老房子|Your Parents\' Old Home', val: val, cost: 0, mort: 0, y: S().year, city: p.city, c: p.country, school: false, live: !S().assets.houses.some(function (x) { return x.live; }), rent: false, fam: 1 });
        G.log('爸妈的老房子留给了你。|Your parents\' old home passed to you.');
        if (sibs.length && G.ch(.55)) ES.later('n_sib_house', G.pick(sibs).id);
      } else { var s = G.pick(sibs); s.wealth += val; G.log('爸妈的老房子留给了{s}。|Your parents\' old home went to {s}.', { s: s.name }); if (G.ch(.4)) ES.later('n_sib_house_lost', s.id); }
    }
    if (sibs.length && w > G.$(200000) && G.ch(.35)) ES.later('n_sib_estate', G.pick(sibs).id, { m: G.M(Math.round(w * .2)) });
    return share;
  };

  /* ====================== PROFILE INFO ====================== */
  G.npcInfo = function (n) {
    var rows = [], p = S().p, y = S().year;
    if (n.rel === 'child' || n.rel === 'grandchild') {
      var e = n.edu;
      if (e && e.stage && e.stage !== 'none') rows.push(['学业|Education', e.stage === 'done' ? (G.DEG[e.deg] || '—') : G.STAGES[e.stage] ? G.STAGES[e.stage].n : '—']);
      if (e && e.school) rows.push([e.stage === 'uni' || e.deg >= 4 ? '大学|University' : '学校|School', G.T(e.school) + (e.tier ? ' ' + '★★★★★'.slice(0, e.tier) : '')]);
      if (e && e.abroad) rows.push(['留学|Abroad', G.C[e.abroad].flag + ' ' + G.T(G.C[e.abroad].n)]);
      if (n.c && n.c !== p.country) rows.push(['定居|Lives in', G.C[n.c].flag + ' ' + G.T(G.C[n.c].n)]);
      if (n.illegit) { var o = S().npcs[n.par2]; rows.push(['身世|Origins', G.T(n.ack ? '已相认|Acknowledged' : '秘密|Secret') + (o ? ' · ' + G.T(o.name) : '')]); }
      if (n.home) rows.push(['房子|Home', '你给买的房子|The home you bought them']);
      var pl = ES.plan(); if (p.will || pl.share[n.id]) rows.push(['遗产份额|Inheritance share', Math.round((pl.share[n.id] || 0) * 100) + '%']);
    }
    if (n.preg) rows.push(['状态|Status', G.L('怀孕中，预产期{y}年|Pregnant — due {y}', { y: G.numEn(n.preg.due) })]);
    else if (p.preg && p.preg.with === n.id) rows.push(['状态|Status', G.L('你怀着{h}的孩子，预产期{y}年|You\'re carrying {h} child — due {y}', { h: n.g === 'm' ? '他|his' : '她|her', y: G.numEn(p.preg.due) })]);
    else if (n.trying && LO.canConceive(n)) rows.push(['状态|Status', '备孕中|Trying for a baby']);
    if (n.rel === 'affair' && n.kept) rows.push(['包养|Allowance', G.fm(n.kept) + G.T(' / 年| / yr')]);
    if (n.feud && S().npcs[n.feud]) rows.push(['恩怨|Feud', G.L('和{n}反目|At odds with {n}', { n: S().npcs[n.feud].name })]);
    return rows;
  };

  /* ====================== ACTIONS ON PEOPLE ====================== */
  var npcActs = G.npcActs;
  G.npcActs = function (n) {
    var out = npcActs(n), p = S().p, add = [], a = N.age(n), y = S().year;
    if (!n.alive) return out;
    // baby plans live on the partner's page
    if (['spouse', 'lover', 'affair'].indexOf(n.rel) >= 0 && n.g !== p.g && p.age >= 18 && a >= 18) {
      if (LO.canConceive(n) && !n.trying) add.push({ id: 'trybaby', n: '和{n}备孕|Try for a Baby', i: '🍼', e: 10, run: async function (n, act) {
        if (n.rel === 'affair' && N.spouse() && !(await G.UI.confirm(G.L('确定吗？|Are you sure?'), G.L('和情人要孩子，纸可包不住火。|A baby with your secret lover — that\'s a secret that won\'t keep.')))) return 'cancel';
        n.trying = y; G.dStart(); G.dPush('love', N.addLove(n, n.rel === 'affair' ? 8 : 4)); var dl = G.dEnd();
        return res(act, '你和{n}开始备孕了。每年都会继续努力，直到怀上为止。|You and {n} are trying for a baby — and you\'ll keep trying every year until it happens.', pr(n), dl);
      } });
      if (n.trying && !n.preg) add.push({ id: 'stopbaby', n: '暂停备孕|Stop Trying', i: '⏸️', e: 0, run: async function (n, act) { n.trying = 0; return res(act, '你们决定再等等。|You decide to wait.', pr(n)); } });
    }
    // affairs
    if (n.rel === 'affair') {
      add.push({ id: 'keep', n: n.kept ? '调整包养费|Change Allowance' : '包养{n}|Give {n} an Allowance', i: '💳', e: 5, run: async function (n, act) {
        var v = await G.UI.amount({ title: G.L('每年给{n}多少？|How much a year for {n}?', pr(n)), max: Math.max(p.money, G.$(50000)), presets: [.02, .05, .1, .2] });
        if (v == null) return 'cancel';
        n.kept = v; G.dStart(); G.dPush('love', N.addLove(n, 10 + Math.min(20, v / G.$(5000)))); n.loyal = Math.min(100, n.loyal + 5); var dl = G.dEnd();
        return res(act, '从此每年给{n}{m}。{n}对你死心塌地。|From now on, {n} gets {m} a year — and is utterly devoted to you.', { n: n.name, m: G.M(v) }, dl);
      } });
      if (n.kept) add.push({ id: 'unkeep', n: '停掉包养费|Cut the Allowance', i: '✂️', e: 0, run: async function (n, act) { n.kept = 0; G.dStart(); G.dPush('love', N.addLove(n, -20)); var dl = G.dEnd(); return res(act, '{n}的脸色一下子变了。|{n}\'s face changed instantly.', pr(n), dl); } });
      add.push({ id: 'payoff', n: '给分手费|Pay Them to Walk Away', i: '💼', e: 10, run: async function (n, act) {
        var v = await G.UI.amount({ title: G.L('分手费|Severance'), text: G.L('给{n}一笔钱，好聚好散。|Give {n} money to end it quietly.', pr(n)), max: p.money, presets: [.05, .1, .25, .5] });
        if (v == null) return 'cancel'; G.addMoney(-v); n.wealth += v;
        var enough = v >= Math.max(G.$(20000), (n.kept || 0) * 2) * (n.kidOf ? 3 : 1);
        if (enough || G.ch(.3)) { n.rel = 'ex'; n.love = 0; n.kept = 0; n.pin = n.kidOf ? 1 : 0; return res(act, '{n}拿了钱，安静地离开了你的生活。|{n} took the money and quietly left your life.', pr(n)); }
        G.dStart(); G.dPush('love', N.addLove(n, -15)); var dl = G.dEnd(); ES.later('n_affair_ultimatum', n.id);
        return res(act, '{n}把钱摔在你脸上：“你以为钱能打发我？”|{n} threw the money in your face: "You think you can buy me off?"', pr(n), dl);
      } });
    }
    // children
    if (n.rel === 'child' || n.rel === 'grandchild') {
      add.push({ id: 'givemoney', n: '给钱|Give Money', i: '💰', e: 5, run: async function (k, act) {
        var v = await G.UI.amount({ title: G.L('给{n}多少钱？|How much for {n}?', pr(k)), max: p.money, presets: [.005, .01, .05, .1, .25, .5] });
        if (v == null) return 'cancel'; G.addMoney(-v); k.wealth += v;
        var scale = a < 18 ? G.$(300) : Math.max(G.$(2000), (k.inc || G.$w(30000)) * .1), g = G.clamp(3 + Math.log2(v / scale + 1) * 4, 2, 30);
        G.dStart(); G.dPush('aff', N.addAff(k, k.illegit && !k.ack ? g * 1.3 : g)); var dl = G.dEnd();
        if (a < 16 && v > G.$(2000)) { k.spoiled = (k.spoiled || 0) + 1; if (k.spoiled >= 3 && k.pers !== 'gold') { k.pers = G.ch(.5) ? 'gold' : 'rebel'; G.log('{n}被你宠坏了。|You\'ve spoiled {n}.', pr(k)); } }
        var t = a < 12 ? '{n}抱着钱蹦蹦跳跳地跑了。|{n} bounced away clutching the money.' : a < 18 ? '{n}说了声“谢谢”，转身就去买了新手机。|{n} said "thanks" and went straight to buy a new phone.' : g > 15 ? '{n}眼眶红了：“爸/妈，我会好好用这笔钱的。”|{n} teared up: "I\'ll use it well."' : '{n}收下了。|{n} accepted it.';
        return res(act, t, pr(k), dl);
      } });
      if (a >= 5 && a <= 16 && n.edu && n.edu.stage !== 'done') add.push({ id: 'kidclass', n: '报兴趣班|Sign Up for Classes', i: '🎨', e: 10, run: async function (k, act) {
        var opts = [['钢琴|Piano', 'music'], ['绘画|Painting', 'art'], ['奥数|Math Olympiad', 'smarts'], ['游泳|Swimming', 'health'], ['编程|Coding', 'smarts'], ['舞蹈|Dance', 'looks']];
        var i = await G.UI.pick({ title: G.L(act.n), items: opts.map(function (o) { return { t: o[0], sub: G.M(G.$(1200)) }; }) }); if (i < 0) return 'cancel';
        if (!G.pay(G.$(1200))) return 'cancel';
        var o = opts[i], likes = G.ch(.5 + (k.pers === 'nerd' && o[1] === 'smarts' ? .3 : 0) + (k.pers === 'artsy' && (o[1] === 'art' || o[1] === 'music') ? .3 : 0) - (k.pers === 'rebel' ? .25 : 0));
        k.inv = (k.inv || 0) + (likes ? 2 : 1); k.skills = k.skills || {}; k.skills[o[1]] = (k.skills[o[1]] || 0) + (likes ? 10 : 4);
        if (o[1] === 'smarts') k.smarts = G.clamp(k.smarts + (likes ? 3 : 1), 0, 100); if (o[1] === 'health') k.health = G.clamp(k.health + 3, 0, 100); if (o[1] === 'looks') k.looks = G.clamp(k.looks + 2, 0, 100);
        G.dStart(); G.dPush('aff', N.addAff(k, likes ? 4 : -5)); var dl = G.dEnd();
        return res(act, likes ? '{n}爱上了{c}，每次上课都特别积极。|{n} fell in love with {c} and can\'t wait for each lesson.' : '{n}哭着说不想去{c}，但还是被你送去了。|{n} cried about {c} but you sent them anyway.', { n: k.name, c: o[0] }, dl);
      } });
      if (a >= 6 && a <= 17) add.push({ id: 'strict', n: '严加管教|Be Strict', i: '📏', e: 10, run: async function (k, act) {
        k.inv = (k.inv || 0) + 1; if (k.edu) k.edu.perf = G.clamp((k.edu.perf || 50) + 5, 0, 100);
        G.dStart(); G.dPush('aff', N.addAff(k, k.pers === 'rebel' ? -12 : -5)); var dl = G.dEnd();
        if (k.pers === 'rebel' && G.ch(.3)) { k.runaway = 1; return res(act, '{n}受不了你的管教，离家出走了一晚。|{n} couldn\'t take it and ran away for a night.', pr(k), dl); }
        return res(act, '你没收了{n}的手机，规定每天学习三小时。{n}的成绩提高了，但和你的话少了。|You took {n}\'s phone and set three hours of study a day. Grades went up; conversation went down.', pr(k), dl);
      } });
      if (a >= 16 && a <= 21 && n.edu && !n.edu.abroad && ['high', 'uni', 'done', 'voc'].indexOf(n.edu.stage) >= 0 && !(n.edu.stage === 'done' && n.edu.deg >= 4)) {
        var cost = G.$(n.edu.stage === 'uni' ? 150000 : 220000);
        add.push({ id: 'abroad', n: '送出国读大学|Send Abroad to University', i: '✈️', e: 10, $: 0, run: async function (k, act) {
          var dest = G.CLIST.filter(function (c) { return ['us', 'gb', 'au', 'ca', 'jp', 'sg', 'de', 'fr'].indexOf(c) >= 0 && c !== p.country; });
          var i = await G.UI.pick({ title: G.L(act.n), text: G.L('四年学费加生活费约{m}。|Four years of tuition and living costs: about {m}.', { m: G.M(cost) }), items: dest.map(function (c) { return { t: G.C[c].n, icon: G.C[c].flag, dis: p.money < cost }; }) });
          if (i < 0) return 'cancel'; if (!G.pay(cost)) return 'cancel';
          var c = dest[i], tier = G.clamp(Math.round(2 + k.smarts / 28 + G.rf(-.6, .6)), 2, 5);
          var u = G.pick(G.eduSys(c).u.filter(function (x) { return x.t === tier; })) || G.pick(G.eduSys(c).u);
          var e = k.edu; e.abroad = c; e.abroadSchool = u.n; e.abroadTier = u.t;
          if (a >= 18) { e.stage = 'uni'; e.grade = 0; e.school = u.n; e.tier = u.t; e.major = e.major || G.pick(G.MAJOR_LIST); }
          else k.abroadPlan = 1;
          k.smarts = G.clamp(k.smarts + 3, 0, 100); G.dStart(); G.dPush('aff', N.addAff(k, 15)); var dl = G.dEnd();
          G.major('送{n}出国留学|Sent {n} to study abroad', pr(k));
          return res(act, a >= 18 ? '{n}被{u}录取了！机场送别时，{n}回头看了你好几次。|{n} was admitted to {u}! At the airport, {n} kept looking back at you.' : '你为{n}申请了{u}，高中毕业后就出发。|You applied to {u} for {n}; they\'ll leave after high school.', { n: k.name, u: u.n }, dl);
        } });
      }
      if (a >= 20 && !n.home) add.push({ id: 'buyhome', n: '给孩子买房|Buy Them a Home', i: '🏠', e: 10, run: async function (k, act) {
        var Hh = G.HOUSES.filter(function (x) { return x.id === 'two'; })[0], price = G.money.housePrice(Hh);
        if (!(await G.UI.confirm(G.L(act.n), G.L('一套两居室要{m}。|A two-bedroom costs {m}.', { m: G.M(price) })))) return 'cancel';
        if (!G.pay(price)) { G.UI.toast('钱不够|Not enough money'); return 'cancel'; }
        k.home = 1; k.wealth += price; G.dStart(); G.dPush('aff', N.addAff(k, 30)); var dl = G.dEnd();
        allKids().forEach(function (o) { if (o !== k && N.age(o) >= 18 && !o.home) { N.addAff(o, -8); S().p.flags.rivalry = (S().p.flags.rivalry || 0) + 1; } });
        return res(act, '{n}拿着钥匙抱住了你。其他孩子知道后，心里不是滋味。|{n} hugged you, keys in hand. Your other children weren\'t thrilled.', pr(k), dl);
      } });
      if (a >= 24 && !n.spouseId && !n.married) add.push({ id: 'match', n: '安排相亲|Arrange a Match', i: '💐', e: 10, $: 300, run: async function (k, act) {
        if (!G.pay(G.$(300))) return 'cancel';
        var ok = G.ch(.35 + (k.looks - 50) / 200);
        if (ok) { var sp = N.make({ rel: 'contact', g: k.g === 'm' ? 'f' : 'm', age: a + G.ri(-3, 3), c: k.c }); sp.pin = 1; sp.inlaw = k.id; k.spouseId = sp.id; G.dStart(); G.dPush('aff', N.addAff(k, 6)); var dl = G.dEnd(); return res(act, '{n}和相亲对象{s}一见钟情，半年后就结婚了！|{n} hit it off with {s} and married within six months!', { n: k.name, s: sp.name }, dl); }
        G.dStart(); G.dPush('aff', N.addAff(k, -6)); var dl2 = G.dEnd();
        return res(act, '{n}说：“我的事不用你管！”|{n} said, "Stay out of my love life!"', pr(k), dl2);
      } });
      if (n.illegit && !n.ack) add.push({ id: 'ack', n: '公开相认|Acknowledge Publicly', i: '📣', e: 15, run: async function (k, act) {
        if (!(await G.UI.confirm(G.L(act.n), G.L('所有人都会知道{n}是你的孩子。你的伴侣和其他孩子不会好受。|Everyone will know {n} is yours. Your partner and other children won\'t take it well.', pr(k))))) return 'cancel';
        k.ack = 1; k.secret = 0; G.dStart(); G.dPush('aff', N.addAff(k, 35)); var sp = N.spouse(); if (sp) G.dPush('love', N.addLove(sp, -35)); kids(false).forEach(function (o) { if (!o.illegit) N.addAff(o, -15); }); G.addStat('fame', 2); var dl = G.dEnd();
        S().p.flags.rivalry = (S().p.flags.rivalry || 0) + 2;
        return res(act, '{n}终于可以叫你一声“爸爸/妈妈”了。家里却炸开了锅。|{n} can finally call you Mom or Dad in public. At home, all hell broke loose.', pr(k), dl);
      } });
      var w = ES.will();
      if (p.age >= 18) add.push(w && (w.cut || {})[n.id] ? { id: 'uncut', n: '写回遗嘱|Restore to Will', i: '📜', e: 5, run: async function (k, act) { delete w.cut[k.id]; G.dStart(); G.dPush('aff', N.addAff(k, 10)); var dl = G.dEnd(); return res(act, '你把{n}重新写进了遗嘱。|You wrote {n} back into your will.', pr(k), dl); } }
        : { id: 'cut', n: '从遗嘱除名|Cut from Will', i: '✂️', e: 5, run: async function (k, act) { var wl = S().p.will || (S().p.will = { mode: 'equal', y: y }); wl.cut = wl.cut || {}; wl.cut[k.id] = 1; G.dStart(); G.dPush('aff', N.addAff(k, -30)); var dl = G.dEnd(); return res(act, '你告诉{n}：遗产一分钱都不会留给{h}。|You told {n}: not a penny of your estate will go to {h}.', { n: k.name, h: k.g === 'm' ? '他|him' : '她|her' }, dl); } });
    }
    var bi = out.map(function (x) { return x.id; }).indexOf('block'); if (bi < 0) bi = out.length;
    return out.slice(0, bi).concat(add, out.slice(bi));
  };

  /* yearly: allowances, child support, kids abroad, feuds */
  var gk = FA.growKid;
  FA.growKid = function (k, Q) {
    var a0 = N.age(k), e0 = k.edu ? k.edu.stage : null;
    if (k.abroadPlan && a0 === 18 && k.edu) { // goes abroad instead of the local exam
      var e = k.edu; k.abroadPlan = 0; e.stage = 'uni'; e.grade = 0; e.school = e.abroadSchool; e.tier = e.abroadTier; e.deg = 3; e.major = e.major || G.pick(G.MAJOR_LIST);
      G.log('{n}出发去{c}读大学了。|{n} left for university in {c}.', { n: k.name, c: G.C[e.abroad].n }); return;
    }
    var r = gk(k, Q), e2 = k.edu;
    if (e2 && e2.abroad && e0 === 'uni' && e2.stage === 'done' && !k.abroadDone) {
      k.abroadDone = 1; k.inc = Math.round((k.inc || G.$w(40000)) * 1.25);
      if (G.ch(.35)) { k.c = e2.abroad; G.log('{n}毕业后留在了{c}工作。|{n} stayed in {c} to work after graduating.', { n: k.name, c: G.C[e2.abroad].n }); }
      else G.log('{n}学成回国了。|{n} came home after graduating abroad.', pr(k));
    }
    if (k.illegit && !k.ack && a0 < 18 && G.S.p.age < 90) { var cs = G.$w(6000); if (G.pay(cs)) { var mom = S().npcs[k.par2]; if (mom) mom.wealth += cs; } }
    return r;
  };
  var mt = G.money.tick;
  G.money.tick = function (Q) {
    var p = S().p;
    N.rel('affair').forEach(function (n) { if (n.kept && n.alive) { if (p.money >= n.kept) { G.addMoney(-n.kept); n.wealth += n.kept; } else { n.kept = 0; N.addLove(n, -25); G.log('你付不起{n}的包养费了。|You can no longer afford {n}\'s allowance.', pr(n)); } } });
    return mt(Q);
  };

  /* ====================== ACTIVITIES: WILL & GIVING ====================== */
  async function writeWill(a) {
    var p = S().p, sp = N.spouse(), K = kids(true), y = S().year;
    if (!K.length && !(sp && sp.alive)) return G.result(a.n, '你还没有可以继承遗产的家人。|You have no family to inherit yet.', null, [], a.i);
    var modes = [['平分给所有子女|Split evenly among the children', 'equal'], ['留给一个孩子（可以是全部）|To one child (up to everything)', 'one'], ['全部留给配偶|Everything to your spouse', 'spouse'], ['我来逐个分配|I\'ll set each share', 'custom']];
    if (!(sp && sp.alive)) modes = modes.filter(function (m) { return m[1] !== 'spouse'; });
    if (!K.length) modes = modes.filter(function (m) { return m[1] === 'spouse'; });
    var mi = await G.UI.pick({ title: G.L('立遗嘱|Write a Will'), text: G.L('不立遗嘱的话，法律会按配偶一半、子女平分来分配。|Without a will, the law gives your spouse half and splits the rest among your children.'), items: modes.map(function (m) { return { t: m[0] }; }) });
    if (mi < 0) return 'cancel';
    var w = { mode: modes[mi][1], y: y, cut: (p.will && p.will.cut) || {}, houses: {}, incl: false, notary: 0, charity: 0 };
    if (K.some(function (k) { return k.illegit && !k.ack; })) w.incl = (await G.UI.pick({ title: G.L('私生子女|Secret children'), items: [{ t: G.L('也给他们一份|Include them too') }, { t: G.L('不给|Leave them out') }], noCancel: 1 })) === 0;
    if (w.mode === 'one') { var ci = await G.UI.pick({ title: G.L('留给谁？|To whom?'), items: K.map(function (k) { return { t: k.name, sub: N.relName(k) + ' · ' + G.T('{a}岁|age {a}', { a: N.age(k) }), npc: k }; }) }); if (ci < 0) return 'cancel'; w.main = K[ci].id; var pi = await G.UI.pick({ title: G.L('给{n}多少？|How much to {n}?', { n: K[ci].name }), items: [100, 90, 70, 50].map(function (v) { return { t: v + '%', sub: v === 100 ? G.T('全部留给TA，其他人一分没有|Everything — the others get nothing') : G.T('其余{r}%由其他子女平分|The other children split the remaining {r}%', { r: 100 - v }) }; }), noCancel: 1 }); w.mainPct = [1, .9, .7, .5][pi] || 1; }
    if (w.mode === 'custom') {
      w.pct = {}; var ppl = (sp && sp.alive ? [sp] : []).concat(K), steps = [0, 10, 20, 30, 40, 50, 70, 100];
      for (var j = 0; j < ppl.length; j++) { var si = await G.UI.pick({ title: G.L('给{n}几成？|Share for {n}?', { n: ppl[j].name }), items: steps.map(function (s) { return { t: s + '%' }; }), noCancel: 1 }); w.pct[ppl[j].id] = steps[si] || 0; }
      if (!Object.keys(w.pct).some(function (id) { return w.pct[id] > 0; })) { var first = ppl[0]; w.pct[first.id] = 100; }
    }
    var chi = await G.UI.pick({ title: G.L('捐给慈善？|Leave some to charity?'), items: [0, 10, 30, 50, 90].map(function (x) { return { t: x ? G.L('捐出{x}%|Donate {x}%', { x: x }) : G.L('不捐|No', {}) }; }), noCancel: 1 });
    w.charity = [0, .1, .3, .5, .9][chi] || 0;
    var heirsList = (sp && sp.alive ? [sp] : []).concat(K);
    for (var hI = 0; hI < S().assets.houses.length && hI < 6; hI++) {
      var hs = S().assets.houses[hI];
      var hi = await G.UI.pick({ title: G.L('{h}留给谁？|Who gets {h}?', { h: hs.n }), items: [{ t: G.L('按份额自动分配|Decide by shares') }].concat(heirsList.map(function (n) { return { t: n.name, sub: N.relName(n), npc: n }; })), noCancel: 1 });
      if (hi > 0) w.houses[hid(hs)] = heirsList[hi - 1].id;
    }
    if (await G.UI.confirm(G.L('公证|Notarize'), G.L('请律师公证遗嘱，费用{m}。公证过的遗嘱更难被推翻。|Have a lawyer notarize it for {m}. Notarized wills are much harder to contest.', { m: G.M(G.$(2500)) })) && G.pay(G.$(2500))) w.notary = 1;
    p.will = w;
    // the children notice
    var pl = ES.plan();
    K.forEach(function (k) { var s = pl.share[k.id] || 0, fair = 1 / Math.max(1, K.length); N.addAff(k, s >= fair ? 4 : -10 - (greedy(k) ? 8 : 0)); });
    if (K.length > 1 && G.ch(.5)) S().p.flags.rivalry = (S().p.flags.rivalry || 0) + 1;
    G.major('立下遗嘱|Wrote a will');
    return G.result(a.n, G.L(w.notary ? '遗嘱已经立好，律师也公证过了。|Your will is done and notarized.' : '遗嘱已经立好了。|Your will is done.'), null, [], a.i);
  }
  async function viewWill(a) {
    var pl = ES.plan(), w = ES.will(), rows = [];
    Object.keys(pl.share).forEach(function (id) { var n = S().npcs[id]; if (n) rows.push(G.T(n.name) + '（' + G.T(N.relName(n)) + '）' + Math.round(pl.share[id] * 100) + '%'); });
    if (pl.charity) rows.push(G.T('慈善|Charity') + ' ' + Math.round(pl.charity * 100) + '%');
    S().assets.houses.forEach(function (h) { var n = S().npcs[pl.houses[hid(h)]]; if (n) rows.push('🏠 ' + G.T(h.n) + ' → ' + G.T(n.name)); });
    var risk = Math.round(ES.risk(pl) * 100);
    var txt = (w ? G.L('你的遗嘱（{y}年）|Your will ({y})', { y: G.numEn(w.y) }) : G.L('你没有立遗嘱，将按法定继承。|No will — the law will decide.')) + '\n' + rows.join('\n') + '\n' + G.L('争产风险：约{r}%|Risk of an inheritance fight: about {r}%', { r: risk });
    return G.result(a.n, txt, null, [], a.i);
  }
  async function donate(a) {
    var p = S().p;
    var v = await G.UI.amount({ title: G.L(a.n), text: G.L('捐得越多，名声和口碑涨得越多。|The more you give, the more your fame and reputation grow.'), max: p.money, presets: [.01, .05, .1, .25, .5, 1] });
    if (v == null) return 'cancel';
    G.addMoney(-v); G.inc('donated', v);
    var usd = v / G.$(1), f = G.clamp(Math.log10(usd / 500 + 1) * 7.5, 0, 45), k = G.clamp(Math.log10(usd / 100 + 1) * 5, 1, 30);
    G.dStart(); G.addStat('fame', f); G.addStat('karma', k); G.addStat('happy', Math.min(10, f / 3)); G.addStat('rep', Math.min(15, f / 2)); var dl = G.dEnd();
    var big = usd >= 1e6;
    if (big) G.major('捐赠{m}|Donated {m}', { m: G.M(v) });
    return G.result(a.n, big ? '你捐出了{m}！消息上了新闻头条，人们称你为“大慈善家”。|You donated {m}! It made headlines; people call you a great philanthropist.' : usd >= 20000 ? '你捐出了{m}，受助方专门给你寄来了感谢信。|You donated {m}; the recipients sent a heartfelt thank-you.' : '你捐出了{m}。|You donated {m}.', { m: G.M(v) }, dl, a.i);
  }
  G.ACT_CATS.splice(3, 0, { id: 'family', n: '家族|Family', i: '👨‍👩‍👧', items: [
    { id: 'will', n: '立遗嘱|Write a Will', i: '📜', e: 10, a: [18, 120], run: writeWill },
    { id: 'viewwill', n: '查看遗产安排|Review Your Estate Plan', i: '🗂️', e: 0, a: [18, 120], run: viewWill },
    { id: 'reunion', n: '召集家庭聚会|Hold a Family Reunion', i: '🍲', e: 15, $: 600, a: [30, 120], if: function () { return allKids().filter(function (k) { return N.age(k) >= 10; }).length >= 1; }, run: function (a) {
      var K = allKids(); G.dStart(); K.forEach(function (k) { N.addAff(k, k.feud ? -2 : 6); N.touch(k); }); G.addStat('happy', 8);
      var avg = G.sum(K, function (k) { return k.aff; }) / Math.max(1, K.length), fl = S().p.flags;
      var fight = K.length >= 2 && G.ch(G.clamp(.12 + (fl.rivalry || 0) * .05 - (fl.unity || 0) * .03 - (avg - 50) / 400, .02, .5));
      if (fight) { G.addStat('happy', -10); fl.rivalry = (fl.rivalry || 0) + 1; }
      else { fl.unity = Math.min(8, (fl.unity || 0) + 1); fl.rivalry = Math.max(0, (fl.rivalry || 0) - 1); K.forEach(function (k) { if (k.feud && k.feud !== 'p' && S().npcs[k.feud] && G.ch(.35)) { var o = S().npcs[k.feud]; o.feud = null; k.feud = null; } }); }
      var dl = G.dEnd();
      return G.result(a.n, fight ? '饭吃到一半，孩子们为了谁出钱多、谁照顾你少吵了起来，不欢而散。|Halfway through dinner the kids started fighting over who pays more and who visits less. Everyone left angry.' : '一大家子人围坐在一起，你看着他们，觉得这辈子值了。|The whole family gathered around the table. Looking at them, you felt your life was worth it.', null, dl, a.i);
    } },
    { id: 'donate', n: '慈善捐款|Donate to Charity', i: '🎗️', e: 5, a: [16, 120], run: donate }
  ] });
  // the old "try for a baby" button now asks who with
  G.ACT_CATS.forEach(function (c) { (c.items || []).forEach(function (it) {
    if (it.id === 'trybaby') {
      it.if = function () { return ES.partners().some(function (n) { return LO.canConceive(n); }); };
      it.run = async function (a) {
        var L = ES.partners().filter(function (n) { return LO.canConceive(n); });
        var i = L.length === 1 ? 0 : await G.UI.pick({ title: G.L('想和谁要孩子？|Who do you want a baby with?'), items: L.map(function (n) { return { t: n.name, sub: N.relName(n), npc: n }; }) });
        if (i < 0) return 'cancel';
        L[i].trying = S().year; return G.quick(a, '你和{n}开始备孕了。|You and {n} started trying for a baby.', { happy: 2 }, { n: L[i].name });
      };
    }
  }); });

  /* ====================== STORIES ====================== */
  function sibOf(c) { var n = c.npc; if (!n) return false; c.prm.n = n.name; return true; }
  function twoKids(minA, maxA) { var K = allKids().filter(function (k) { var a = N.age(k); return a >= minA && a <= maxA; }); return K.length >= 2 ? G.sample(K, 2) : null; }
  G.evs([
    { id: 'n_estate_suit', sys: 1, title: '遗产官司|The Inheritance Lawsuit', icon: '⚖️', bad: 1,
      t: '{n}不服遗产分配，一纸诉状把你告上了法庭。|{n} disputes the will and has taken you to court.',
      prep: sibOf,
      o: [
        O('应诉到底|Fight it in court', async function (c) { var r = await c.game('quiz', { name: '法庭辩论|Courtroom', n: 3 }); var fee = c.$(8000); c.money(-Math.min(Math.max(0, c.p.money), fee)); if (r.win) { G.dPush('aff', N.addAff(c.npc, -20)); return '法院驳回了{n}的诉求。你赢了官司，却彻底失去了这个手足。|The court threw out {n}\'s claim. You won — and lost a sibling for good.'; } var m = Math.round(Math.max(0, c.p.money) * .3); c.money(-m); c.prm.m = G.M(m); return '你输了官司，赔给{n}{m}。|You lost and paid {n} {m}.'; }),
        O('私下和解，分一部分|Settle and share some', function (c) { var m = Math.round(Math.max(0, c.p.money) * .15); c.money(-m); c.npc.wealth += m; c.prm.m = G.M(m); G.dPush('aff', N.addAff(c.npc, 25)); c.npc.feud = null; return '你分给{n}{m}，你们握手言和。|You gave {n} {m}, and you made peace.'; }),
        O('把老房子让给{n}|Give {n} the family home', function (c) { var h = c.S.assets.houses.filter(function (x) { return !x.live; })[0] || c.S.assets.houses[0]; if (!h) return '你没有房子可以让。|You have no house to give.'; c.S.assets.houses.splice(c.S.assets.houses.indexOf(h), 1); c.npc.wealth += h.val; G.dPush('aff', N.addAff(c.npc, 35)); c.npc.feud = null; c.prm.h = h.n; return '你把{h}让给了{n}。血浓于水。|You gave {h} to {n}. Blood is thicker than water.'; })
      ] },
    { id: 'n_sib_estate', sys: 1, title: '兄弟姐妹争遗产|Siblings Fight Over the Estate', icon: '💢', bad: 1,
      t: '爸妈走后，{n}说自己照顾老人最多，应该多分{m}。|After your parents passed, {n} says they did the most caregiving and should get {m} more.',
      prep: sibOf,
      o: [
        O('同意|Agree', function (c) { var m = Math.min(Math.max(0, c.p.money), c.$(G.ri(5, 40) * 1000)); c.money(-m); c.npc.wealth += m; G.dPush('aff', N.addAff(c.npc, 15)); return '你让了一步，{n}的态度软了下来。|You gave ground, and {n} softened.'; }),
        O('寸步不让|Refuse outright', function (c) { G.dPush('aff', N.addAff(c.npc, -30)); c.npc.feud = 'p'; return '你们吵翻了，过年再也没有一起吃过饭。|You fell out; you never shared a holiday meal again.'; }),
        O('请家族长辈评理|Ask the elders to mediate', RC(.5, '长辈们主持公道，大家都服气。|The elders ruled fairly and everyone accepted it.', { eq: 2 }, '长辈们各执一词，事情更乱了。|The elders took sides and made it worse.', { happy: -5 }))
      ] },
    { id: 'n_sib_house', sys: 1, title: '老房子之争|Fight Over the Old House', icon: '🏚️', bad: 1,
      t: '{n}认为爸妈的老房子应该归{he}。|{n} thinks your parents\' old home should be theirs.',
      prep: function (c) { if (!c.npc) return false; c.prm.n = c.npc.name; var x = G.pr(c.npc.g); for (var k in x) c.prm[k] = x[k]; },
      o: [
        O('房子归你，折价补偿{n}|Keep it and pay {n} their half', function (c) { var h = c.S.assets.houses.filter(function (x) { return x.fam; })[0], m = h ? Math.round(h.val * .5) : c.$(20000); if (!c.pay(m)) { c.npc.feud = 'p'; G.dPush('aff', N.addAff(c.npc, -25)); return '你拿不出补偿款，{n}和你翻了脸。|You couldn\'t pay, and {n} turned on you.'; } c.npc.wealth += m; G.dPush('aff', N.addAff(c.npc, 10)); return '你补了钱，老房子保住了。|You paid up and kept the old house.'; }),
        O('卖掉平分|Sell it and split the money', function (c) { var h = c.S.assets.houses.filter(function (x) { return x.fam; })[0]; if (h) { c.S.assets.houses.splice(c.S.assets.houses.indexOf(h), 1); c.money(Math.round(h.val * .5)); c.npc.wealth += Math.round(h.val * .5); } G.dPush('aff', N.addAff(c.npc, 8)); return '老房子卖了，你们各分一半。卖房那天，你在门口站了很久。|The house was sold and split. On the last day, you lingered at the door.'; }),
        O('让给{n}|Let {n} have it', function (c) { var h = c.S.assets.houses.filter(function (x) { return x.fam; })[0]; if (h) { c.S.assets.houses.splice(c.S.assets.houses.indexOf(h), 1); c.npc.wealth += h.val; } G.dPush('aff', N.addAff(c.npc, 30)); c.add('karma', 4); return '你把房子让给了{n}。|You let {n} have the house.'; })
      ] },
    { id: 'n_sib_house_lost', sys: 1, title: '偏心的遗嘱|A Lopsided Will', icon: '😔',
      t: '爸妈把老房子留给了{n}。你心里很不是滋味。|Your parents left the old house to {n}. It stings.',
      prep: sibOf,
      o: [
        O('想开点|Let it go', R('“爸妈有他们的考虑。”|"They had their reasons."', { eq: 2, happy: -3 })),
        O('找{n}要个说法|Confront {n}', function (c) { if (G.ch(.4)) { var m = c.$(G.ri(5, 20) * 1000); c.money(m); c.npc.wealth -= m; c.prm.m = G.M(m); return '{n}主动补给你{m}。|{n} offered you {m} to make it right.'; } G.dPush('aff', N.addAff(c.npc, -20)); return '{n}说：“这是爸妈的决定。”|{n} said, "That was Mom and Dad\'s decision."'; })
      ] },
    { id: 'n_affair_preg', sys: 1, title: '意外的孩子|An Unplanned Baby', icon: '🤰', bad: 1,
      t: '{n}怀孕了，问你打算怎么办。|{n} is pregnant and asks what you\'re going to do.',
      prep: sibOf,
      o: [
        O('生下来，我负责|Keep it — I\'ll take responsibility', function (c) { G.dPush('love', N.addLove(c.npc, 20)); c.npc.kept = c.npc.kept || c.$(10000); return '{n}哭着抱住了你。从此你每年要多一份开销，也多一个秘密。|{n} hugged you in tears. A new yearly expense — and a new secret.'; }),
        O('给钱让{n}远走高飞|Pay {n} to disappear', function (c) { var m = c.$(G.ri(30, 120) * 1000); c.money(-Math.min(Math.max(0, c.p.money), m)); c.npc.wealth += m; if (G.ch(.5)) { c.npc.preg = null; c.npc.rel = 'ex'; c.npc.love = 0; return '{n}拿着钱离开了，再也没有消息。|{n} took the money and vanished.'; } c.npc.rel = 'ex'; c.npc.love = 5; return '{n}拿了钱离开了……但孩子还是会出生。|{n} took the money and left... but the baby will still be born.'; }),
        O('劝{n}别要|Ask {n} not to keep it', function (c) { if (G.ch(.5)) { c.npc.preg = null; G.dPush('love', N.addLove(c.npc, -25)); c.add('karma', -4); return '{n}答应了，但从此看你的眼神变了。|{n} agreed, but never looked at you the same way.'; } G.dPush('love', N.addLove(c.npc, -10)); return '{n}坚持要生下来。|{n} insists on having the baby.'; })
      ] },
    { id: 'n_affair_ultimatum', sys: 1, title: '情人逼宫|The Ultimatum', icon: '🔥', bad: 1,
      t: '{n}不想再躲躲藏藏了：“要么离婚娶/嫁我，要么我去找你的另一半。”|{n} is done hiding: "Divorce them for me — or I go to your spouse."',
      prep: function (c) { if (!c.npc || c.npc.rel !== 'affair' && c.npc.rel !== 'ex') return false; c.prm.n = c.npc.name; },
      o: [
        O('离婚，和{n}在一起|Divorce and be with {n}', function (c) { var sp = N.spouse(); if (sp) G.love.divorce(sp); c.npc.rel = 'lover'; c.npc.kept = 0; G.dPush('love', N.addLove(c.npc, 25)); return '你结束了婚姻，和{n}光明正大地在一起了。|You ended your marriage and went public with {n}.'; }),
        O('花钱摆平|Buy their silence', function (c) { var m = c.$(G.ri(50, 200) * 1000); if (!c.pay(m)) { var sp = N.spouse(); if (sp) { G.dPush('love', N.addLove(sp, -50)); } return '你拿不出钱。{n}直接找上了你的另一半……|You couldn\'t pay. {n} went straight to your spouse...'; } c.npc.rel = 'ex'; c.npc.love = 0; c.prm.m = G.M(m); return '{n}拿走了{m}，答应永远闭嘴。|{n} took {m} and swore eternal silence.'; }),
        O('向另一半坦白|Confess to your spouse', function (c) { var sp = N.spouse(); c.npc.rel = 'ex'; c.npc.love = 0; if (sp) { if (G.ch(.35 + sp.loyal / 300)) { G.dPush('love', N.addLove(sp, -25)); return '{s}哭了一整夜，最后选择原谅你。|{s} cried all night, then chose to forgive you.'.replace('{s}', sp.name); } G.love.divorce(sp); } return '另一半没有原谅你。|Your spouse didn\'t forgive you.'; })
      ] },
    E('n_illegit_visit', [30, 95], '私生子来访|Your Secret Child Comes Calling', '🎁', '{n}提着礼物来看你，嘴甜得像抹了蜜：“爸/妈，您身体还好吗？”|{n} turns up with gifts, sweet as honey: "How are you feeling these days?"', [
      O('高兴地收下|Accept warmly', function (c) { G.dPush('aff', N.addAff(c.npc, 12)); c.add('happy', 5); if (G.ch(.5)) { c.prm.m = G.M(c.$(G.ri(5, 30) * 1000)); return '临走时，{n}小声提起想要一笔钱{m}“周转一下”。|As they left, {n} quietly mentioned needing {m} "to tide things over."'; } return '{n}陪你聊了一下午，临走还帮你收拾了屋子。|{n} kept you company all afternoon and tidied up before leaving.'; }),
      O('提醒{n}别打遗产的主意|Warn {n} off your money', R('{n}的笑容僵在了脸上。|{n}\'s smile froze.', { npc: -15 })),
      O('让{n}以后常来|Ask {n} to visit more often', function (c) { G.dPush('aff', N.addAff(c.npc, 15)); c.p.flags.rivalry = (c.p.flags.rivalry || 0) + 1; return '{n}来得更勤了。你的婚生子女开始警惕起来。|{n} visits more often. Your other children are getting wary.'; })
    ], { rep: 1, cd: 2, if: function () { return allKids().some(function (k) { return k.illegit && N.age(k) >= 14; }); }, prep: function (c) { var L = allKids().filter(function (k) { return k.illegit && N.age(k) >= 14; }); if (!L.length) return false; c.npc = G.pick(L); c.prm.n = c.npc.name; } }),
    E('n_illegit_found', [28, 95], '私生子曝光|The Secret Comes Out', '📸', '你的另一半发现了{n}的存在。|Your spouse has found out about {n}.', [
      O('承认，求原谅|Admit it and beg forgiveness', function (c) { var sp = N.spouse(); c.npc.secret = 0; if (sp) G.dPush('love', N.addLove(sp, -35)); if (sp && sp.love < 15) { G.love.divorce(sp); return '你们离婚了，对方分走了一大半财产。|You divorced, and your spouse took the larger share of your assets.'; } return '家里冷了好几个月，但婚姻勉强保住了。|Home was ice-cold for months, but the marriage survived.'; }),
      O('死不承认|Deny everything', RC(.35, '对方半信半疑，暂时放过了你。|They half-believed you — for now.', { karma: -5 }, '对方拿出了亲子鉴定报告。你无话可说。|They produced a paternity test. You had nothing to say.', { happy: -15 }))
    ], { bad: 1, if: function () { return !!N.spouse() && allKids().some(function (k) { return k.illegit && k.secret; }); }, prep: function (c) { var L = allKids().filter(function (k) { return k.illegit && k.secret; }); if (!L.length) return false; c.npc = G.pick(L); c.prm.n = c.npc.name; } }),
    E('k_rival_toy', [25, 60], '孩子们抢东西|The Kids Are Fighting', '🧸', '{a}和{b}为了一样东西吵得不可开交，都哭着来找你。|{a} and {b} are fighting over the same thing, and both come to you in tears.', [
      O('给小的|Give it to the younger one', function (c) { var y = c.kA.by > c.kB.by ? c.kA : c.kB, o = y === c.kA ? c.kB : c.kA; N.addAff(y, 6); N.addAff(o, -8); c.p.flags.rivalry = (c.p.flags.rivalry || 0) + 1; return '大的那个噘着嘴说：“你就是偏心！”|The older one pouted: "You always take their side!"'; }),
      O('再买一个|Buy a second one', function (c) { if (!c.pay(c.$(200))) return '你没钱再买一个。|You couldn\'t afford another.'; N.addAff(c.kA, 4); N.addAff(c.kB, 4); return '两个孩子都破涕为笑。|Both kids smiled through their tears.'; }),
      O('让他们自己商量着轮流玩|Make them work out turns', function (c) { if (G.ch(.5)) { N.addAff(c.kA, 2); N.addAff(c.kB, 2); c.kA.eq = Math.min(100, (c.kA.eq || 50) + 2); c.kB.eq = Math.min(100, (c.kB.eq || 50) + 2); return '他们学会了分享。|They learned to share.'; } c.p.flags.rivalry = (c.p.flags.rivalry || 0) + 1; return '他们打了起来，还都怪你。|They came to blows and both blamed you.'; })
    ], { rep: 1, cd: 3, if: function () { return !!twoKids(4, 13); }, prep: function (c) { var t = twoKids(4, 13); if (!t) return false; c.kA = t[0]; c.kB = t[1]; c.prm.a = t[0].name; c.prm.b = t[1].name; } }),
    E('k_rival_house', [45, 85], '婚房之争|Who Gets Help with a Home?', '🏠', '{a}要结婚了，希望你出首付。{b}听说后不干了：“当年我结婚你可没出钱！”|{a} is getting married and wants help with the down payment. {b} protests: "You didn\'t help me when I got married!"', [
      O('都出|Help both', function (c) { var m = c.$(G.ri(20, 60) * 1000); if (!c.pay(m * 2)) return '你拿不出两份钱。|You can\'t afford two down payments.'; c.kA.wealth += m; c.kB.wealth += m; N.addAff(c.kA, 15); N.addAff(c.kB, 15); return '一碗水端平，两个孩子都很感激。|You treated them equally, and both were grateful.'; }),
      O('只帮{a}|Help only {a}', function (c) { var m = c.$(G.ri(20, 60) * 1000); if (!c.pay(m)) return '你拿不出这笔钱。|You don\'t have the money.'; c.kA.wealth += m; N.addAff(c.kA, 18); N.addAff(c.kB, -20); c.p.flags.rivalry = (c.p.flags.rivalry || 0) + 2; return '{b}从此和{a}有了心结。|{b} has resented {a} ever since.'; }),
      O('谁都不帮|Help neither', function (c) { N.addAff(c.kA, -12); N.addAff(c.kB, -2); return '“你们自己的路自己走。”|"You make your own way."'; })
    ], { bad: 1, rep: 1, cd: 6, if: function () { return !!twoKids(23, 45); }, prep: function (c) { var t = twoKids(23, 45); if (!t) return false; c.kA = t[0]; c.kB = t[1]; c.prm.a = t[0].name; c.prm.b = t[1].name; } }),
    E('k_rival_flatter', [55, 105], '争宠|Competing for Your Favor', '🎭', '自从你立了遗嘱，{a}和{b}来得特别勤，一个送补品，一个陪你散步。|Since you wrote your will, {a} and {b} visit constantly — one brings tonics, the other takes you on walks.', [
      O('享受这份热闹|Enjoy the attention', R('你知道他们图什么，但被人惦记的感觉还不错。|You know what they\'re after, but being doted on feels nice.', { happy: 6 })),
      O('说遗嘱早就定了|Say the will is final', function (c) { N.addAff(c.kA, -6); N.addAff(c.kB, -6); return '两个孩子来的次数明显少了。|Their visits dropped off noticeably.'; }),
      O('暗示会改遗嘱|Hint you might change it', function (c) { N.addAff(c.kA, 8); N.addAff(c.kB, 8); c.p.flags.rivalry = (c.p.flags.rivalry || 0) + 2; return '两个孩子争得更凶了。|The two competed even harder.'; })
    ], { rep: 1, cd: 4, if: function (S, p) { return !!p.will && !!twoKids(25, 80); }, prep: function (c) { var t = twoKids(25, 80); if (!t) return false; c.kA = t[0]; c.kB = t[1]; c.prm.a = t[0].name; c.prm.b = t[1].name; } }),
    E('k_rival_care', [70, 110], '谁来照顾你|Who Will Look After You?', '🧓', '你的身体越来越差，孩子们为谁来照顾你争执起来，谁都说自己忙。|Your health is failing, and the kids argue over who should care for you — everyone says they\'re too busy.', [
      O('谁照顾我，遗产就多给谁|Whoever cares for me gets more', function (c) { var k = G.pick(allKids()); N.addAff(k, 10); var w = c.p.will || (c.p.will = { mode: 'one', y: c.S.year, cut: {}, houses: {} }); w.mode = 'one'; w.main = k.id; c.prm.k = k.name; c.p.flags.rivalry = (c.p.flags.rivalry || 0) + 2; return '{k}搬来和你一起住了。其他孩子很不服气。|{k} moved in with you. The others are resentful.'; }),
      O('住养老院，谁也不麻烦|Move to a care home and burden no one', R('孩子们松了口气，又有点愧疚。|The kids were relieved — and a little guilty.', { money: -15000, health: 3 }))
    ], { bad: 1, rep: 1, cd: 5, if: function () { return !!twoKids(25, 90) && G.S.p.st.health < 60; }, prep: function (c) { if (!twoKids(25, 90)) return false; } }),
    E('k_halfsib', [35, 95], '同父异母/同母异父|The Half-Sibling', '👥', '你的孩子{a}得知自己有个私生的兄弟姐妹{b}。|Your child {a} has found out about their secret half-sibling, {b}.', [
      O('让他们见一面|Let them meet', RC(.45, '没想到两个孩子一见如故。|Unexpectedly, the two hit it off.', { happy: 6 }, '见面不欢而散，{a}说永远不会承认{b}。|It went badly; {a} swore never to accept {b}.', { happy: -6 })),
      O('让{a}别管大人的事|Tell {a} to stay out of it', function (c) { N.addAff(c.kA, -12); c.p.flags.rivalry = (c.p.flags.rivalry || 0) + 1; return '{a}摔门而去。|{a} stormed out.'; })
    ], { bad: 1, if: function () { return allKids().some(function (k) { return k.illegit; }) && allKids().some(function (k) { return !k.illegit && N.age(k) >= 12; }); }, prep: function (c) { var a = G.pick(allKids().filter(function (k) { return !k.illegit && N.age(k) >= 12; })), b = G.pick(allKids().filter(function (k) { return k.illegit; })); if (!a || !b) return false; c.kA = a; c.kB = b; c.prm.a = a.name; c.prm.b = b.name; } }),
    E('n_affair_more', [24, 70], '又一个心动的人|Another Temptation', '🕯️', '一位迷人的{x}对你频频示好，似乎并不介意你已经有家室。|A charming {x} keeps flirting with you, apparently unbothered that you\'re married.', [
      O('来者不拒|Go for it', function (c) { var n = c.npc; n.rel = 'affair'; n.love = G.ri(45, 70); n.pin = 1; G.inc('affairs'); c.add('karma', -5); c.add('happy', 5); return '你和{n}开始了一段秘密关系。|You began a secret relationship with {n}.'; }),
      O('保持距离|Keep your distance', R('你守住了底线。|You held the line.', { karma: 3 }))
    ], { rep: 1, cd: 3, w: function (S, p) { return (G.netWorth() > G.$(1e6) ? 1.2 : .4) + (p.st.looks > 70 ? .4 : 0) + (G.has('peach') ? .6 : 0); }, if: function () { return !!N.spouse(); }, prep: function (c) { var n = N.mkRomantic({ love: G.ri(40, 60), aff: 20 }); n.rel = 'contact'; c.npc = n; c.prm.n = n.name; c.prm.x = n.job ? G.T(n.job) : ''; } })
  ]);
})();
