/* Content choices for this build. Affairs, crime, gray trades, gambling, the crime family and the political
   dynasty are all in the game. Still left out: kidnapping and child trafficking, teen smoking/drinking/tattoos
   and teen romance, fortune telling, protests and petitions, and civil-service/political careers. */
(function () {
  'use strict';
  var N = G.N;

  var DEL = [
    // kidnapping, child trafficking
    'c_kidnap', 'c_lure', 'or_ty_kidnap', 'st_kidnapthreat',
    'tf_memory', 'tf_home', 'tf_escape', 'tf_poster', 'tf_dna', 'tf_found', 'tf_choice', 'tf_trauma',
    // teen romance, drinking, smoking, tattoos
    't_crush', 't_confessed', 't_caught_love', 't_firstdrink', 't_cig', 't_rebel_tattoo',
    // fortune telling
    'c_fortune', 'x_fortune2',
    // protests, petitions, civil-service promotion and political careers
    'g_petition', 'st_protest', 'sys_gov_bribe', 'sys_investigation', 'sys_poli_offer',
    'sys_policy', 'sys_reelect', 'j_gov_audit', 'st_summit', 'st_statedinner', 'st_leak', 'cn_kid_passport'
  ];
  DEL.forEach(function (id) { delete G.EV[id]; });
  G.EVL = G.EVL.filter(function (d) { return G.EV[d.id] === d; });
  // a queued follow-up to a removed event simply does nothing
  var run0 = G.runEvent;
  G.runEvent = function (id) { if (!G.EV[id]) return Promise.resolve(); return run0.apply(this, arguments); };

  // the stranger with candy never ends in a stolen childhood
  var st = G.EV.c_stranger, so = st && st.o && st.o[2];
  if (so) so.run = function (c) { c.add('happy', -6); c.add('smarts', 1); return '幸好一位警察叔叔认出了你，把你送回了家。爸妈后怕得一晚上没睡。|Luckily a police officer recognized you and brought you home. Your parents didn\'t sleep that night.'; };

  /* actions left out: smoking, drinking, nightclubs, tipping streamers, temple visits */
  var DROP_ACT = ['drink', 'smoke', 'tip', 'temple', 'bar'];
  G.ACT_CATS.forEach(function (c) { c.items = c.items.filter(function (a) { return DROP_ACT.indexOf(a.id) < 0; }); });

  /* romance is for adults; more than one partner is possible again */
  var canR = N.canRomance;
  N.canRomance = function (n) { if (!canR.apply(this, arguments)) return false; return G.S.p.age >= 18 && N.age(n) >= 18; };
  var adm = G.EV.sys_admirer; if (adm) { var if0 = adm.if; adm.if = function (S, p) { return p.age >= 18 && (!if0 || if0(S, p)); }; }

  /* no civil-service promotion or political careers */
  G.ACT_CATS.forEach(function (c) {
    if (c.id === 'service') { c.items = c.items.filter(function (a) { return a.id !== 'civil' && a.id !== 'run'; }); c.n = '参军·从警|Military & Police'; }
  });
  G.ACT_GOV = [];
  G.ORIGINS = G.ORIGINS.filter(function (o) { return o.id !== 'civil'; });
  var jobOk0 = G.jobOk;
  G.jobOk = function (j) { if (j && (j.id === 'judge' || j.id === 'diplomat' || j.cat === 'gov')) return false; return jobOk0.apply(this, arguments); };
  [['a_jobless', '考公/考研|Study for exams', '考研|Study for graduate school'], ['or_m_path', null, null]].forEach(function (x) {
    var d = G.EV[x[0]]; if (!d || !d.o) return;
    if (x[1]) d.o.forEach(function (o) { if (o.t === x[1]) o.t = x[2]; });
    else d.o = d.o.filter(function (o) { return typeof o.t !== 'string' || o.t.indexOf('考公') < 0; });
  });
  if (G.EV.or_m_path) G.EV.or_m_path.title = '考研还是出国|Grad School or Abroad?';
  var mt0 = G.money && G.money.tick;
  if (mt0) G.money.tick = function () { var p = G.S && G.S.p; if (p && p.gov) { p.gov = null; var j = G.JOBS.filter(function (x) { return !x.pt && x.deg <= 4; })[0]; if (j && !p.job) G.career.hire(j); } return mt0.apply(this, arguments); };
})();
