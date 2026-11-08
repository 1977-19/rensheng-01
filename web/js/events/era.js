/* Era gates: keep events, options and activities from appearing before they could exist.
   spec = earliest year, or { g: global, cn: China, ... } */
(function () {
  'use strict';
  var LOTTO = { g: 1950, cn: 1987, us: 1964, gb: 1994, ca: 1970, au: 1960 };
  var EV = {
    t_job1: { g: 1955, cn: 1990 },          // fast-food summer job
    a_roommate: { g: 1985, cn: 1998 },      // roommate gaming all night
    a_tv: { g: 2005, cn: 2008 },            // clip goes viral online
    l_suspect: { g: 2000, cn: 2003 },       // partner glued to their phone
    k_console: { g: 1978, cn: 1990 },       // kid wants a game console
    w_annual: { g: 1985, cn: 1993 },        // year-end raffle with phones and cars
    f_award: { g: 2009, cn: 2011 },         // trending topics
    o_interview: { g: 1955, cn: 1980 },     // TV station interview
    x_unlucky: { g: 1998, cn: 2001 },       // phone dropped down a drain
    a_lottery2: LOTTO, x_lucky_money: LOTTO, x_dream: LOTTO
  };
  var OPT = [ // [event id, option text prefix (zh), spec]
    ['c_fight_par', '偷偷录', { g: 1975, cn: 1990 }],
    ['c_summer', '在家打游戏', { g: 1980, cn: 1992 }],
    ['a_witness', '拍视频', { g: 2005, cn: 2008 }],
    ['a_ufo', '拍下来', { g: 2005, cn: 2008 }]
  ];
  var ACT = {
    tv: { g: 1955, cn: 1982 },
    hype: { g: 2006, cn: 2010 },
    gym: { g: 1960, cn: 1993 },
    lottery: LOTTO
  };
  Object.keys(EV).forEach(function (id) { if (G.EV[id]) G.EV[id].era = EV[id]; else console.warn('era: no event', id); });
  OPT.forEach(function (x) {
    var d = G.EV[x[0]], o = d && d.o && d.o.filter(function (o) { return typeof o.t === 'string' && o.t.indexOf(x[1]) === 0; })[0];
    if (o) o.era = x[2]; else console.warn('era: no option', x[0], x[1]);
  });
  G.ERA_ACT = ACT;
  function tag(list) { (list || []).forEach(function (a) { if (a && a.id && ACT[a.id] && !a.era) a.era = ACT[a.id]; }); }
  ['ACT_BABY', 'ACT_KID', 'ACT_SCHOOL', 'ACT_UNI', 'ACT_JOB', 'ACT_FAME', 'ACT_MIL', 'ACT_POL', 'ACT_GOV', 'ACT_BIZ', 'ACT_RETIRED', 'ACT_IDLE', 'ACT_JAIL', 'ACT_GANG'].forEach(function (k) { tag(G[k]); });
  (G.ACT_CATS || []).forEach(function (c) { tag(c.items); });
})();
