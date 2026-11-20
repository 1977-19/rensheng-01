/* Version 3.3 — family choices and who you may love.
   - Adoption, IVF and surrogacy: you choose who you raise the child with — your spouse or partner, a relative
     (your mother, father, a brother or sister, a grandparent), or on your own. The co-parent's surname is offered.
   - A child's surname: yours, the other birth parent's (a lover's too), your spouse's, or the co-parent's.
   - Romance: anyone may be asked out or confessed to except your own family by blood or upbringing (parents,
     step-parents, siblings, children, grandparents, grandchildren, blood relatives). In-laws and the partners of
     relatives are no longer off-limits. Asking is always possible; whether they say yes depends on them. */
(function () {
  'use strict';
  var N = G.N;
  function S() { return G.S; }
  function P() { return G.S && G.S.p; }
  function item(id) { var f = null; G.ACT_CATS.forEach(function (c) { c.items.forEach(function (a) { if (a.id === id && !f) f = a; }); }); return f; }

  /* ---------- who you raise the child with ---------- */
  var REL = { spouse: '配偶|spouse', lover: '恋人|partner', father: '父亲|father', mother: '母亲|mother', sibling: '兄弟姐妹|sibling', grand: '祖辈|grandparent', stepparent: '继父母|step-parent', kin: '亲戚|relative', child: '成年子女|adult child' };
  G.pickCoParent = async function (title, solo) {
    var p = P(), L = [];
    var pt = N.partner(); if (pt && pt.alive) L.push(pt);
    N.all(function (n) { return n.alive && n !== pt && ['father', 'mother', 'sibling', 'grand', 'stepparent', 'kin'].indexOf(n.rel) >= 0 && N.age(n) >= 18; }).forEach(function (n) { L.push(n); });
    N.rel('child').filter(function (n) { return N.age(n) >= 18; }).forEach(function (n) { L.push(n); });
    var items = [{ t: G.L(solo || '我一个人|Just me'), icon: '🙋', v: null }].concat(L.map(function (n) {
      return { t: G.L('和{n}一起（{r}）|With {n} ({r})', { n: n.name, r: N.relName ? N.relName(n) : REL[n.rel] || '' }), icon: n.g === 'm' ? '👨' : '👩', v: n };
    }));
    var i = await G.UI.pick({ title: G.L(title), text: G.L('选一个和你一起抚养这个孩子的人。孩子可以随ta的姓。|Choose who will raise this child with you. The child may take their surname.'), items: items });
    if (i < 0) return 'cancel';
    return items[i].v;
  };

  var ad = item('adopt');
  if (ad) ad.run = async function (a) {
    var co = await G.pickCoParent('领养孩子：和谁一起？|Adopt: with whom?');
    if (co === 'cancel') return 'cancel';
    var i = await G.UI.pick({ title: G.L(a.n), items: [{ t: G.L('男孩|A boy'), icon: '👦' }, { t: G.L('女孩|A girl'), icon: '👧' }, { t: G.L('都可以|Either'), icon: '🧒' }] }); if (i < 0) return 'cancel';
    var k = await G.love.baby(co, true); if (!k) return 'cancel';
    var g = i === 0 ? 'm' : i === 1 ? 'f' : k.g;
    if (g !== k.g) { k.g = g; var cul = k.cul || G.C[P().country].names, nm = G.genName(cul, g, k.by, k.sur || P().sur); k.giv = nm.giv; k.name = G.mkName(cul, k.sur || nm.sur, nm.giv, g); }
    k.adopted = 1; k.aff = Math.max(k.aff || 0, 88); if (co) { k.coParent = co.id; G.N.addAff(co, 6); }
    return G.result(a.n, co ? '你和{c}一起领养了{n}。|You and {c} adopted {n}.' : '你领养了{n}。|You adopted {n}.', { n: k.name, c: co ? co.name : '' }, [], a.i);
  };

  var ivf = item('ivf');
  if (ivf) {
    ivf.if = function () { var p = P(); return p.age >= 22 && p.age <= 60; };
    ivf.run = async function (a) {
      var co = await G.pickCoParent('试管婴儿：和谁一起？|IVF: with whom?', '我一个人（使用捐赠者）|On my own (with a donor)');
      if (co === 'cancel') return 'cancel';
      var cost = G.$(G.ri(40, 90) * 1000);
      if (!(await G.UI.confirm(G.L(a.n), G.L('正规生殖中心的费用约{m}，成功率大约七成。|A reputable fertility clinic costs about {m}; about seven in ten succeed.', { m: G.M(cost) })))) return 'cancel';
      if (!G.pay(cost)) { G.UI.toast(G.L('钱不够|Not enough money')); return 'cancel'; }
      if (!G.ch(.7)) return G.result(a.n, '这一次没有成功。医生说，可以再试一次。|It didn\'t work this time. The doctor says you can try again.', null, [], a.i);
      var k = await G.love.baby(co, false); if (!k) return 'cancel';
      if (co && co !== N.partner()) { k.coParent = co.id; G.N.addAff(co, 8); }
      if (!co) k.donor = 1;
      return G.result(a.n, co ? '经过漫长的等待，{n}来到了你和{c}身边。|After a long wait, {n} arrived for you and {c}.' : '经过漫长的等待，{n}来到了你身边。|After a long wait, {n} arrived.', { n: k.name, c: co ? co.name : '' }, [], a.i);
    };
  }

  /* ---------- who you may love ---------- */
  var BLOOD = { father: 1, mother: 1, stepparent: 1, sibling: 1, child: 1, grand: 1, grandchild: 1, birthpar: 1, kin: 1 };
  function ageOk(n) {
    var pa = P().age, na = N.age(n);
    if (pa < 14 || na < 14) return false;
    if (pa < 18 || na < 18) return pa < 18 && na < 18 && Math.abs(pa - na) <= 2;
    return true;
  }
  function familyBan(n) { return !n || !n.alive || BLOOD[n.rel] || n.blood || n.halfSib || (n.rel === 'sibling') || n.coParentOf; }
  // romance is possible with anyone but family; attraction still needs both people's orientations to match
  N.canRomance = function (n) { if (familyBan(n) || !ageOk(n)) return false; return N.compatible(n); };
  N.canAsk = function (n) { return !familyBan(n) && ageOk(n); };
  var bl = G.love.becomeLovers;
  // asking is always allowed: the date / confess buttons appear for anyone you may ask; they may say no
  var acts = G.npcActs;
  G.npcActs = function (n) {
    if (!n || !N.canAsk(n) || N.canRomance(n)) return acts.apply(this, arguments);
    var cr = N.canRomance; N.canRomance = function (x) { return x === n ? true : cr(x); };
    try { return acts.apply(this, arguments); } finally { N.canRomance = cr; }
  };
  void bl;
})();
