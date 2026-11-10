/* Social class: who you meet and what can happen to you depends on the world you were born into.
   A tycoon's child doesn't worry about sneakers, goes to school with other rich kids, and has very different problems. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  var TOP = ['richest', 'royal', 'red', 'noble', 'tycoon'], RICH = ['merchant', 'celebrity'], COMF = ['middle', 'scholar', 'medical', 'civil', 'military', 'police', 'artist', 'academic', 'champion'];
  /* 0 ordinary · 1 comfortable · 2 rich · 3 top of society */
  G.famClass = function () {
    var S = G.S; if (!S || !S.p) return 0; var p = S.p, o = p.origin, c = 0;
    if (TOP.indexOf(o) >= 0) c = 3; else if (RICH.indexOf(o) >= 0) c = 2; else if (COMF.indexOf(o) >= 0) c = 1;
    if (p.flags.trafficked || p.flags.exRoyal) c = Math.min(c, 1);
    var w = (G.dependent && G.dependent() ? G.famWealth() : 0) + Math.max(0, G.netWorth());
    if (w > G.$(3e7)) c = Math.max(c, 3); else if (w > G.$(3e6)) c = Math.max(c, 2); else if (w > G.$(4e5)) c = Math.max(c, 1);
    if (G.status) c = Math.max(c, Math.min(3, G.status() + (G.status() >= 2 ? 1 : 0)));
    // a family that lost everything drops down
    if (p.age >= 18 && !G.dependent() && G.netWorth() < G.$(20000) && c >= 2 && !p.flags.redfam && p.origin !== 'royal') c = 1;
    return c;
  };
  var CLASS_N = ['普通家庭|Ordinary', '小康|Comfortable', '富裕|Wealthy', '顶层|Elite'];
  G.CLASS_N = CLASS_N;

  /* events that only happen to families who have to count every coin */
  var POOR_IDS = ['t_shoes', 't_job1', 'x_rural_city', 'c_poor_fee', 'a_lend'];
  var POOR_RX = /买不起|交不起|拿不出|凑钱|凑不齐|省吃俭用|咬咬牙|捡废品|下岗|助学贷款|学费还差|打暑假工|兼职/;
  function zh(t) { return typeof t === 'string' ? t.split('|')[0] : ''; }
  var elig = G.eligible;
  G.eligible = function (d) {
    if (!elig.apply(this, arguments)) return false;
    var c = G.famClass();
    if (c >= 2) {
      if (POOR_IDS.indexOf(d.id) >= 0 && !(d.id === 'a_lend' && G.S.p.age >= 25)) return false;
      if (!d.sys && !d.cls && (POOR_RX.test(zh(d.title)) || POOR_RX.test(zh(d.t)))) return false;
    }
    if (d.cls != null && c < d.cls) return false;
    return true;
  };

  /* who you meet: rich kids go to school with rich kids */
  var mk = N.mkRomantic;
  N.mkRomantic = function (o) {
    o = Object.assign({}, o || {});
    var p = G.S.p, c = G.famClass();
    if (p.age < 23 && c >= 2 && !(o.tags && o.tags.length) && G.ch(c >= 3 ? .85 : .65)) {
      var t = p.origin === 'red' ? G.pick(['red', 'rich']) : p.origin === 'royal' || p.origin === 'noble' ? G.pick(['rich', 'royal', 'rich']) : p.origin === 'celebrity' ? G.pick(['celeb', 'rich']) : 'rich';
      if (t === 'royal' && !(G.C[p.country].mon)) t = 'rich';
      o.tags = [t];
    }
    return mk.call(this, o);
  };
  var make = N.make;
  N.make = function (o) {
    o = o || {};
    var p = G.S && G.S.p;
    if (p && p.age < 23 && ['classmate', 'friend', 'bestie', 'rival', 'deskmate'].indexOf(o.rel) >= 0 && !(o.tags && o.tags.length)) {
      var c = G.famClass();
      if (c >= 2 && G.ch(c >= 3 ? .75 : .5)) { o = Object.assign({}, o, { tags: ['rich'] }); if (o.wealth == null) o.wealth = G.$(G.ri(2, 40) * 1e5); }
    }
    return make.call(this, o);
  };

  /* fewer confessions — and almost none once you're taken */
  var rate = G.love.admirerRate;
  G.love.admirerRate = function () {
    var p = G.S.p, r = rate.apply(this, arguments) * .62;
    if (p.age < 18) r *= .6;
    if (N.partner()) r *= .5;
    if (p.flags.rich || p.flags.elite) r *= .8; // the extra attention was already counted
    return r;
  };

  /* your partner's family belongs to your partner's world */
  var CI = G.circle;
  if (CI && CI.ensureInlaws) {
    var ens = CI.ensureInlaws;
    CI.ensureInlaws = function (pt) {
      var L = ens.apply(this, arguments) || [], c = G.famClass(), rich = pt && ((pt.tags && pt.tags.length) || (pt.wealth || 0) > G.$(2e6));
      L.forEach(function (n) {
        if (n.clsFix) return; n.clsFix = 1;
        if (rich || c >= 3) { if ((n.wealth || 0) < G.$(3e6)) n.wealth = G.$(G.ri(3, 60) * 1e6); n.inc = Math.max(n.inc || 0, G.$w(G.ri(200, 1500) * 1000)); if (!n.tags || !n.tags.length) n.tags = (pt.tags && pt.tags.length) ? pt.tags.slice() : ['rich']; }
        else if (c >= 1 || (pt.inc || 0) > G.$w(80000)) { if ((n.wealth || 0) < G.$(300000)) n.wealth = G.$(G.ri(3, 25) * 1e5); n.inc = Math.max(n.inc || 0, G.$w(G.ri(45, 160) * 1000)); }
      });
      return L;
    };
  }
  function inlawsRich() { var pt = N.partner(); return !!(pt && CI && CI.inlaws(pt).some(function (x) { return (x.wealth || 0) > G.$(1e6); })); }
  ['n_inlaw_ill'].forEach(function (id) { var d = G.EV[id]; if (!d) return; var f = d.if; d.if = function () { return !inlawsRich() && (!f || f.apply(this, arguments)); }; });
  ['n_inlaw_test'].forEach(function (id) { var d = G.EV[id]; if (!d) return; var f = d.if; d.if = function () { return G.famClass() < 2 && G.netWorth() < G.$(1.5e6) && (!f || f.apply(this, arguments)); }; });

  /* ---------------- growing up rich ---------------- */
  function isRed() { return G.S.p.origin === 'red' || G.S.p.flags.redfam; }
  G.evs([
    E('k_el_flatter', [9, 18], '围在身边的人|The Entourage', '🎁', '班上总有几个人围着你转，帮你拿书包、替你写作业，可你知道他们在等你请客。|A few classmates always hover around you — carrying your bag, doing your homework — and you know they\'re waiting for you to pay.', [
      O('照单全收|Enjoy it', R('你习惯了被捧着的感觉。|You got used to being fawned over.', { happy: 4, eq: -3, smarts: -1 })),
      O('试探谁是真朋友|Test who your real friends are', function (c) { var n = N.make({ rel: 'friend', age: c.p.age, aff: 55, pers: G.pick(['honest', 'loyal', 'kind']) }); c.prm.n = n.name; H.fx(c, { eq: 4, happy: -2 }); return '你故意说家里破产了。第二天，身边只剩下{n}。|You pretended your family went bankrupt. The next day, only {n} was still around.'; }),
      O('疏远他们|Keep your distance', R('你身边清静了，也孤单了。|It got quiet around you — and lonely.', { eq: 1, happy: -3, smarts: 2 }))
    ], { cls: 2, cd: 12 }),
    E('k_el_camp', [10, 17], '瑞士夏令营|Summer Camp in Switzerland', '🏔️', '爸妈给你报了一个瑞士的贵族夏令营：滑雪、马术、法语，同营的都是各国富豪的孩子。|Your parents sign you up for an elite camp in Switzerland: skiing, riding, French — all with the children of the world\'s richest families.', [
      O('认真学，交朋友|Learn and make friends', function (c) { var n = N.make({ rel: 'friend', age: c.p.age + G.ri(-1, 1), aff: 40, tags: ['rich'], c: G.pick(['us', 'gb', 'fr', 'de', 'jp']) }); c.prm.n = n.name; H.fx(c, { smarts: 3, eq: 3, happy: 3, health: -1 }); return '你和来自国外的{n}成了好朋友，约好以后常联系。|You became close with {n} from abroad and promised to keep in touch.'; }),
      O('偷偷溜出去玩|Sneak out to party', RC(.6, '你在阿尔卑斯山下度过了最疯狂的一个夏天。|You had the wildest summer of your life at the foot of the Alps.', { happy: 8, smarts: -2 }, '你被营地开除，提前送回了国。|You were expelled from camp and flown home early.', { happy: -5, par: -8 })),
      O('想家，天天哭|Homesick, crying every day', R('你给家里打了无数次电话。|You called home countless times.', { happy: -5, eq: 2, par: 4 }))
    ], { cls: 2, cd: 30 }),
    E('k_el_lowkey', [12, 25], '低调|Keep a Low Profile', '🤫', '长辈严肃地提醒你：在外面不要炫富、不要乱说话，家里的一举一动都有人盯着。|An elder warns you sternly: no flaunting, no loose talk — every move this family makes is watched.', [
      O('牢记在心|Take it to heart', R('你学会了在人前说话滴水不漏。|You learned to say nothing that could be used against you.', { eq: 4, happy: -2 })),
      O('偷偷发了张豪车照|Post a photo with a supercar anyway', RC(.4, '照片很快就删了，没人注意。|You deleted it fast; nobody noticed.', { happy: 3 }, '照片被网友扒了出来，全家都被卷进了舆论。|Netizens dug up the photo; your whole family got dragged into the scandal.', { happy: -8, par: -15, fame: 5 }))
    ], { cls: 3, cd: 20, if: function () { return isRed() || G.S.p.origin === 'royal'; } }),
    E('k_el_tutor', [6, 17], '名师一对一|Elite Private Tutors', '🎓', '家里给你请了退休的特级教师和名校博士一对一辅导，一节课的钱够普通人家一个月的生活费。|Your family hires a retired master teacher and an Ivy League PhD for one-on-one lessons. One hour costs what an ordinary family lives on for a month.', [
      O('认真学|Study hard', R('你的成绩突飞猛进，但再也没有周末了。|Your grades shot up — and your weekends vanished.', { smarts: 4, happy: -3, health: -1 })),
      O('把老师当聊天对象|Turn lessons into chats', R('老师给你讲了很多书本以外的故事。|The teacher told you stories you\'d never find in books.', { eq: 2, smarts: 1, happy: 2 })),
      O('故意气走老师|Drive the tutor away', R('你气走了第三位老师，爸妈拿你没办法。|You drove off your third tutor; your parents are at a loss.', { happy: 3, smarts: -2, par: -5 }))
    ], { cls: 2, cd: 6 })
  ]);
})();
