/* Content standards for the store release: no flags, no crime careers, no gambling, no affairs,
   no smoking/drinking choices for teens, no superstition, no domestic politics. Loaded after every event file. */
(function () {
  'use strict';
  var N = G.N;

  /* ---------- events that are removed outright ---------- */
  var DEL = [
    // gangs, gray trades, loan sharks, crime bosses
    'sys_raid', 'sys_gang_test', 'sys_gang_boss', 'sys_gang_war', 'sys_gang_raid', 'sys_shark',
    'u_debt', 'u_betray', 'u_godson', 'g_revenge', 'g_rival', 'g_snitch', 'g_bigdeal', 'g_cop', 'g_loanshark', 'g_casino', 'g_tomb',
    'g_hacker', 'g_fighter', 'g_troll', 'g_scalper', 'g_smuggle', 'g_fake', 'g_club', 'g_collect', 'g_fixer', 'j_lawyer_offer',
    'mf_dinner', 'or_mf_guards', 'or_mf_rival', 'or_mf_heir', 'or_mf_informant',
    // kidnapping, child trafficking, guns
    'c_kidnap', 'c_lure', 'or_ty_kidnap', 'st_kidnapthreat', 'st_assassin',
    'tf_memory', 'tf_home', 'tf_escape', 'tf_poster', 'tf_dna', 'tf_found', 'tf_choice', 'tf_trauma',
    // gambling
    'a_bigbet', 'x_gambler', 'or_db_gamble',
    // affairs, mistresses, children born outside marriage, two-timing, casting couch
    'pr_gang', 'sys_partner_cheat', 'sys_affair_caught', 'n_affair_preg', 'n_affair_ultimatum', 'n_affair_more', 'n_illegit_visit', 'n_illegit_found',
    'k_halfsib', 'su_half_born', 'su_illegit_suit', 'lv_two_time', 'f_actor_rule',
    // teen romance, drinking, smoking, tattoos
    't_crush', 't_confessed', 't_caught_love', 't_firstdrink', 't_cig', 't_rebel_tattoo',
    // fortune telling
    'c_fortune', 'x_fortune2',
    // bribes, corruption, domestic politics, protests
    'sys_bribe', 'sys_gov_bribe', 'sys_investigation', 'sys_poli_offer', 'j_med_redenv', 'g_petition', 'st_protest',
    'or_rd_compound', 'or_rd_temptation', 'or_rd_downfall', 'x_red_flatter', 'rd_guard', 'rd_dinner', 'rd_secret', 'rd_academy', 'rd_favor'
  ];
  DEL.forEach(function (id) { delete G.EV[id]; });
  G.EVL = G.EVL.filter(function (d) { return G.EV[d.id] === d; });
  // a queued follow-up to a removed event simply does nothing
  var run0 = G.runEvent;
  G.runEvent = function (id) { if (!G.EV[id]) return Promise.resolve(); return run0.apply(this, arguments); };

  // the stranger with candy never ends in a stolen childhood
  var st = G.EV.c_stranger, so = st && st.o && st.o[2];
  if (so) so.run = function (c) { c.add('happy', -6); c.add('smarts', 1); return '幸好一位警察叔叔认出了你，把你送回了家。爸妈后怕得一晚上没睡。|Luckily a police officer recognized you and brought you home. Your parents didn\'t sleep that night.'; };

  /* ---------- choices removed from events that stay ---------- */
  var DROP = {
    c_steal_home: ['偷偷拿一张'], or_s_counter: ['偷偷从抽屉里拿零钱'], j_judge_bribe: ['给个面子'],
    t_heartbreak: ['借酒消愁'], f_singer_muse: ['借酒浇愁'], pr_sick: ['拿香烟换好药'], o_interview: ['“每天一杯酒！”']
  };
  Object.keys(DROP).forEach(function (id) {
    var d = G.EV[id]; if (!d || !d.o) return;
    d.o = d.o.filter(function (o) { var t = typeof o.t === 'string' ? o.t.split('|')[0] : ''; return DROP[id].indexOf(t) < 0; });
  });

  /* ---------- actions ---------- */
  var DROP_CAT = ['gamble', 'gray', 'crime'];
  var DROP_ACT = ['drink', 'smoke', 'tip', 'temple', 'bar', 'affair'];
  G.ACT_CATS = G.ACT_CATS.filter(function (c) { return DROP_CAT.indexOf(c.id) < 0; });
  G.ACT_CATS.forEach(function (c) {
    c.items = c.items.filter(function (a) { return DROP_ACT.indexOf(a.id) < 0; });
    c.items.forEach(function (a) { if (a.id === 'ivf') a.n = '试管婴儿|IVF'; });
  });
  if (G.ACT_JAIL) G.ACT_JAIL = G.ACT_JAIL.filter(function (a) { return a.id !== 'escape' && a.id !== 'jfight'; });

  /* ---------- origins: no crime family, no political dynasty ---------- */
  G.ORIGINS = G.ORIGINS.filter(function (o) { return o.id !== 'mafia' && o.id !== 'red'; });

  /* ---------- achievements that celebrate crime ---------- */
  if (G.ACH) G.ACH = G.ACH.filter(function (a) { return ['jail', 'jail15', 'escape', 'heist', 'godfather', 'gambler'].indexOf(a.id) < 0; });

  /* ---------- romance: adults only, one partner at a time ---------- */
  var canR = N.canRomance;
  N.canRomance = function (n) {
    if (!canR.apply(this, arguments)) return false;
    if (G.S.p.age < 18 || N.age(n) < 18) return false;
    var taken = (G.S.npcs ? Object.keys(G.S.npcs).map(function (k) { return G.S.npcs[k]; }) : []).some(function (m) {
      return m !== n && m.alive && (m.rel === 'spouse' || m.rel === 'lover' || m.rel === 'fiance');
    });
    return !taken;
  };
  var adm = G.EV.sys_admirer; if (adm) { var if0 = adm.if; adm.if = function (S, p) { return p.age >= 18 && (!if0 || if0(S, p)); }; }
  function taken(n) { return N.all(function (m) { return m !== n && m.alive && ['spouse', 'lover', 'affair'].indexOf(m.rel) >= 0; }).length > 0; }
  var LO = G.love, bl = LO.becomeLovers;
  LO.becomeLovers = function (n) { if (taken(n)) return; return bl.apply(this, arguments); };
  var mar = LO.marry;
  LO.marry = async function (n) {
    var r = await mar.apply(this, arguments);
    N.all(function (m) { return m !== n && m.alive && (m.rel === 'lover' || m.rel === 'affair'); }).forEach(function (m) { m.rel = 'ex'; });
    return r;
  };
  if (adm && adm.o && adm.o[0]) { var yes = adm.o[0].run; adm.o[0].run = function (c) { if (taken(c.npc)) { c.npc.rel = 'friend'; return '你笑着告诉{him}，自己已经有伴了。|You smiled and told {him} you were already taken.'; } return yes.apply(this, arguments); }; }

  /* ---------- no civil-service promotion or political careers ---------- */
  ['sys_policy', 'sys_reelect', 'j_gov_audit', 'st_summit', 'st_statedinner', 'st_leak', 'cn_kid_passport'].forEach(function (id) { delete G.EV[id]; });
  G.EVL = G.EVL.filter(function (d) { return G.EV[d.id] === d; });
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
  // an older save with a government post becomes an ordinary office job
  var mt0 = G.money && G.money.tick;
  if (mt0) G.money.tick = function () { var p = G.S && G.S.p; if (p && p.gov) { p.gov = null; var j = G.JOB.office || G.JOBS.filter(function (x) { return !x.pt && x.deg <= 4; })[0]; if (j && !p.job) G.career.hire(j); } return mt0.apply(this, arguments); };

  /* ---------- no national flags anywhere: each country gets a landmark instead ---------- */
  var MARK = { cn: '🏮', us: '🗽', jp: '🗻', kr: '🥢', gb: '💂', fr: '🗼', de: '🥨', ru: '🪆', in: '🐘', br: '⚽', au: '🦘', ca: '🍁', sg: '🦁', it: '🍕',
    es: '💃', mx: '🌮', th: '🛺', za: '🦓', nz: '🥝', ie: '☘️', ch: '🧀', at: '🎻', pt: '🐓', ar: '🥩' };
  Object.keys(G.C).forEach(function (k) { G.C[k].flag = MARK[k] || '📍'; });
})();
