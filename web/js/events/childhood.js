/* Childhood money: until you're on your own, your parents pay — for the doctor, the pet, the classes.
   Rich and royal families give real allowances and set up trust funds; and you can see the home you grew up in. */
(function () {
  'use strict';
  var N = G.N;
  function S() { return G.S; }
  function payers() { return N.rel('father', 'mother', 'grand', 'stepparent').filter(function (n) { return n.alive && !n.away && (n.wealth || 0) > 0; }).sort(function (a, b) { return b.wealth - a.wealth; }); }
  function underCare() { var p = S().p; return !p.jail && !p.flags.indep && !p.flags.runaway && (p.age < 18 || (G.dependent() && p.age < 26)); }
  G.parentsCover = function (m) {
    if (!S() || !underCare() || m <= 0) return false;
    var ps = payers(), fw = G.sum(ps, function (n) { return n.wealth; }), p = S().p;
    if (p.age >= 18) return false; // from 18 on, you pay your own way
    var need = 3;
    // a farming or working family can't pay for big things the way a rich one can
    var cls = G.famClass ? G.famClass() : 1; if (cls === 0 && m > G.$(800)) need *= 2;
    if (!ps.length || fw < m * need) return false;
    var aff = G.sum(ps, function (n) { return n.aff; }) / ps.length;
    if (p.age >= 18 && aff < 20) return false;
    return true;
  };
  function parentsPay(m) {
    // father and mother both chip in, each in proportion to what they have
    var ps = payers(), fw = G.sum(ps, function (n) { return n.wealth; }), left = m, parts = [];
    ps.forEach(function (n, i) { if (left <= 0) return; var take = i === ps.length - 1 ? left : Math.min(n.wealth, Math.round(m * n.wealth / fw)); take = Math.min(take, n.wealth); n.wealth -= take; left -= take; if (take > 0) parts.push([n, take]); });
    if (left > 0) ps.forEach(function (n) { if (left <= 0) return; var t2 = Math.min(n.wealth, left); n.wealth -= t2; left -= t2; });
    parts.forEach(function (x) { if (G.fin) G.fin.add('par', G.fin.who(x[0]), x[1]); });
    if (G.D && G.D.on) G.dNote(parts.length > 1 ? G.L('{a}付了{x}，{b}付了{y}|{a} paid {x}, {b} paid {y}', { a: N.relName(parts[0][0]), x: G.M(parts[0][1]), b: N.relName(parts[1][0]), y: G.M(parts[1][1]) }) : G.L('爸妈付了{m}|Your parents paid {m}', { m: G.M(m) }));
  }
  var pay0 = G.pay;
  G.pay = function (n) {
    if (n > 0 && G.parentsCover(n)) { parentsPay(n); return true; }
    return pay0.apply(this, arguments);
  };
  G.canPay = function (n) { return !n || G.parentsCover(n) || S().p.money >= n; };
  G.charge = function (n) { if (!n) return null; if (G.parentsCover(n)) { parentsPay(n); return 'par'; } G.addMoney(-n); return 'self'; };
  G.refund = function (n, by) { if (!n) return; if (by === 'par') { var ps = payers(); if (ps[0]) ps[0].wealth += n; else G.addMoney(n); } else G.addMoney(n); };

  /* where you grow up */
  var HOME = {
    royal: '王宫|The Royal Palace', noble: '家族庄园|The Family Estate', richest: '半山豪宅|A Hilltop Mansion', tycoon: '独栋豪宅|A Private Mansion', red: '机关大院|A Guarded Government Compound',
    merchant: '别墅|A Villa', celebrity: '明星豪宅|A Celebrity Home', middle: '三居室公寓|A Three-bedroom Apartment', scholar: '学校分的教师公寓|University Faculty Housing', academic: '学校分的教师公寓|University Faculty Housing',
    medical: '医院家属楼|Hospital Staff Housing', civil: '单位宿舍楼|A Work-unit Apartment', military: '部队大院|A Military Compound', police: '公安家属院|Police Family Housing', artist: '老城区的阁楼|An Old-town Loft',
    worker: '工厂宿舍|Factory Housing', rural: '村里的自建房|A Self-built Village House', smallbiz: '店铺楼上的小房间|A Room Above the Family Shop', single: '老旧小区的一居室|A One-bedroom in an Old Block',
    leftbehind: '爷爷奶奶的老屋|Your Grandparents\' Old House', orphan: '福利院集体宿舍|The Orphanage Dormitory', immigrant: '合租的小公寓|A Crowded Shared Flat', debt: '租来的地下室|A Rented Basement', champion: '城郊的大房子|A Big House in the Suburbs'
  };
  G.famHome = function () {
    var p = S().p;
    if (p.flags.trafficked) return '养父母家的土坯房|Your Adoptive Family\'s Mud-brick House';
    var own = S().assets.houses.filter(function (h) { return h.live; })[0];
    if (own) return own.n;
    var h = HOME[p.origin];
    if (!h) { var fw = G.famWealth(); h = fw > G.$(5e6) ? '豪宅|A Mansion' : fw > G.$(5e5) ? '三居室公寓|A Three-bedroom Apartment' : '两居室|A Two-room Flat'; }
    return h;
  };

  /* allowance & family trusts */
  var TRUST = { royal: 150000, richest: 500000, tycoon: 250000, noble: 80000, merchant: 30000, celebrity: 20000 };
  var POCKET = G.POCKET = { royal: 20000, richest: 30000, tycoon: 15000, noble: 8000, merchant: 4000, celebrity: 3000, red: 6000, mafia: 5000 };
  var FA = G.family, tick0 = FA.tick;
  FA.tick = function (Q) {
    var p = S().p, Sx = S(), ps = payers(), r = tick0.apply(this, arguments);
    if (!S() || S().p !== p || S().dead) return r;
    // monthly pocket money from birth for children of wealthy families; each parent gives their own, by their own fondness
    if (p.age < 18 && POCKET[p.origin] && !p.jail && !p.flags.trafficked) {
      var royal = p.origin === 'royal', got = [], tot = 0;
      N.rel('father', 'mother').filter(function (n) { return n.alive && !n.away && (n.wealth || 0) > 0; }).forEach(function (n) {
        var a = Math.round(G.$(POCKET[p.origin]) / 2 * ((p.age + 2) / 16) * G.clamp(.3 + (n.aff || 0) / 90, .1, 1.5) * (n.sep ? .6 : 1));
        if (n.wealth < a * 10) return;
        n.wealth -= a; tot += a; got.push([n, a]); if (G.fin) G.fin.add('in', G.fin.who(n, '零花钱|allowance'), a);
      });
      if (!got.length && ps.length && G.sum(ps, function (n) { return n.wealth; }) > G.$(POCKET[p.origin]) * 10) { var a2 = Math.round(G.$(POCKET[p.origin]) / 2 * ((p.age + 2) / 16)); ps[0].wealth -= a2; tot = a2; got.push([ps[0], a2]); }
      if (tot) {
        p.money += tot;
        var who = got.map(function (x) { var n = x[0], mo = G.M(Math.round(x[1] / 12)); return G.T(n.rel === 'father' ? (royal ? '父王' : '爸爸') + '每月{m}|' + (royal ? 'The King' : 'Dad') + ' {m} a month' : n.rel === 'mother' ? (royal ? '母后' : '妈妈') + '每月{m}|' + (royal ? 'The Queen' : 'Mom') + ' {m} a month' : '{r}每月{m}|{r} {m} a month', { m: mo, r: N.relName(n) }); });
        var first = p.age <= 1 && !p.flags.pocketLog; if (first) { p.flags.pocketLog = tot; G.log('【零花钱】你一出生，家里就给你开了账户，每月往里存零花钱：{w}。|[Allowance] The day you were born, an account was opened in your name with a monthly allowance: {w}.', { w: who.join('，') + '|' + who.join(', ') }); }
        else if (!p.flags.pocketLog || tot > p.flags.pocketLog * 1.6 || tot < p.flags.pocketLog * .6) { p.flags.pocketLog = tot; G.log('【零花钱】{w}，今年一共{m}。|[Allowance] {w} — {m} this year.', { w: who.join('，') + '|' + who.join(', '), m: G.M(tot) }); }
      }
    }
    // a trust fund matures when you come of age
    if (p.age === 18 && TRUST[p.origin] && !p.flags.trust && !p.flags.trafficked && ps.length) {
      var y = G.$(TRUST[p.origin]) * G.rf(.8, 1.3);
      var lump = y * G.ri(4, 10);
      p.flags.trust = { y: Math.round(y), since: Sx.year };
      p.money += Math.round(lump); ps[0].wealth = Math.max(0, ps[0].wealth - lump);
      G.major(p.origin === 'royal' ? '成年，获得王室年俸与信托基金|Came of age: royal stipend and trust fund' : '成年，家族信托基金开始发放|Came of age: the family trust starts paying', {});
      G.log(p.origin === 'royal' ? '你成年了。王室为你设立的信托基金一次性拨给你{l}，此后每年还有{m}的王室年俸。|You\'ve come of age. Your royal trust releases {l} at once, plus a royal stipend of {m} a year.' : '你成年了。家族信托先拨给你{l}，此后每年发放{m}。|You\'ve come of age. The family trust pays out {l} now and {m} every year after.', { l: G.M(Math.round(lump)), m: G.M(Math.round(y)) });
    } else if (p.age > 18 && p.flags.trust && !p.flags.trustCut) {
      var t = p.flags.trust; p.money += t.y;
      if (Sx.year % 5 === 0) G.log('【家族信托】今年到账{m}。|[Family trust] {m} paid out this year.', { m: G.M(t.y) });
    }
    return r;
  };
  // parents can cut you off if you disgrace the family
  var jail0 = G.crime.jail;
  G.crime.jail = function () { var r = jail0.apply(this, arguments), p = S().p; if (p.flags.trust && !p.flags.trustCut && G.ch(.6)) { p.flags.trustCut = 1; G.log('家族冻结了你的信托基金。|The family froze your trust fund.'); } return r; };
})();
