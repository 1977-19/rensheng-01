/* Social status: who you are decides what can happen to you and who you meet.
   0 ordinary · 1 well-off · 2 elite (tycoons, stars, ministers, generals, royals) · 3 head of state / reigning royal */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  var cache = { k: null, v: 0 };
  G.status = function () {
    var S = G.S; if (!S || !S.p) return 0; var p = S.p;
    var key = S.year + '|' + p.age + '|' + (p.gov ? p.gov.track + p.gov.rank : '') + '|' + (p.fc ? p.fc.rank : '') + '|' + Math.round(p.st.fame / 5) + '|' + Math.round(Math.log10(Math.max(10, p.money)));
    if (cache.k === key && cache.s === S) return cache.v;
    cache.k = key; cache.s = S; cache.v = calc(S, p); return cache.v;
  };
  function calc(S, p) {
    if ((p.gov && G.gov.isTop && G.gov.isTop()) || (p.origin === 'royal' && !p.flags.exRoyal && p.age >= 16)) return 3;
    var nw = G.netWorth(), f = p.st.fame;
    if (nw > G.$(3e7) || f >= 80 || (p.gov && p.gov.track === 'poli' && p.gov.rank >= 3) || (p.mil && p.mil.rank >= 8) || (p.gang && p.gang.rank >= 5) || (p.fc && p.fc.rank >= 3) ||
      ['tycoon', 'richest', 'royal', 'noble', 'red'].indexOf(p.origin) >= 0 && p.age >= 16) return 2;
    if (nw > G.$(2e6) || f >= 55 || (p.gov && p.gov.rank >= 2) || p.origin === 'merchant' || p.origin === 'celebrity') return 1;
    return 0;
  }
  G.STATUS_N = ['普通人|Ordinary', '小有身份|Well-off', '上流社会|Elite', '国家元首|Head of State'];

  /* events that only make sense for people without bodyguards, assistants and drivers */
  var MAX = {};
  ['t_pills', 't_internet_scam', 'a_campusloan', 'a_mlm', 'a_scamcall', 'a_lend', 'a_lottery2', 'a_inheritance', 'a_blind_corner', 'a_relatives', 'a_neighbor', 'a_fake', 'a_celeb_meet', 'a_tv',
    'a_bigbro', 'a_robbed', 'a_jury', 'a_xiahai', 'a_house_boom', 'a_witness', 'a_hero', 'a_roommate', 'n_friend_biz', 'x_lucky_money', 'x_unlucky', 'x_bikeshare', 'x_blindbox', 'x_livestream',
    'x_dream', 'x_car_crash', 'o_scamcall', 'o_tour', 'o_dance', 'o_tech', 'x_fortune2', 'a_bloodd', 'o_blues', 'n_sibling_money'].forEach(function (id) { MAX[id] = 1; });
  ['a_cuihun', 'x_tenant', 'x_demolish', 'a_volunteer_teach', 'x_volunteer_abroad', 'a_marathon', 'a_skydive', 'a_bigbet', 'n_backstab', 'n_revenge', 'a_reunion', 'n_friend_call', 'a_ex_wedding',
    'w_pie', 'w_teambuild', 'w_annual', 'w_scapegoat', 'w_credit', 'w_mistake', 'w_office_romance', 'w_bossdaughter', 'x_tiger', 'x_pet_hero', 'a_midlife', 'o_wander'].forEach(function (id) { MAX[id] = 2; });
  G.STATUS_MAX = MAX;
  var eligible = G.eligible;
  G.eligible = function (d) {
    if (d.id in MAX && G.status() > MAX[d.id]) return false;
    if (d.minSt && G.status() < d.minSt) return false;
    return eligible.apply(this, arguments);
  };

  /* who you meet: the powerful move in rarefied circles */
  var PRO = [['外科医生|Surgeon', 260000], ['律师合伙人|Law Partner', 320000], ['投行董事|Investment Banking Director', 600000], ['外交官|Diplomat', 150000], ['大学教授|Professor', 160000],
    ['建筑设计师|Architect', 180000], ['科技公司高管|Tech Executive', 450000], ['画廊主|Gallery Owner', 220000], ['飞行员|Airline Captain', 230000], ['芭蕾舞首席|Principal Ballet Dancer', 120000],
    ['知名作家|Bestselling Author', 260000], ['基金经理|Fund Manager', 520000], ['主持人|TV Host', 300000], ['奥运冠军|Olympic Champion', 400000], ['米其林主厨|Michelin Chef', 200000]];
  var mk = N.mkRomantic;
  N.mkRomantic = function (o) {
    o = o || {}; var p = G.S.p, st = G.status();
    if (st >= 2 && p.age >= 18 && (!o.tags || !o.tags.length) && !o.job && !o.keepPool) {
      if (G.ch(st === 3 ? .75 : .55)) { var et = G.love.eliteTags(); if (!et.length) et = ['rich']; o.tags = [G.pick(et)]; }
      else { var j = G.pick(PRO); o.job = j[0]; o.inc = G.$w(j[1] * G.rf(.7, 1.3)); o.wealth = o.inc * G.rf(3, 12); o.looks = o.looks || G.clamp(Math.round(G.nrm(72, 12)), 40, 100); }
    }
    // a royal can't court their own family: royal partners come from other crowns
    if (o.tags && o.tags.indexOf('royal') >= 0 && p.origin === 'royal') {
      var others = G.CLIST.filter(function (c) { return G.C[c].mon && c !== p.country; });
      o.c = others.length ? G.pick(others) : o.c;
    }
    var n = mk(o);
    if (o.job && n && !(n.tags || []).length && N.age(n) < ((G.C[n.c] || {}).retire || 60)) { n.job = o.job; n.inc = o.inc; if (o.wealth) n.wealth = Math.round(o.wealth); }
    return n;
  };
  // ordinary venues are closed to the very top: a head of state doesn't swipe dating apps
  G.statusBlocks = function (a) {
    var st = G.status(); if (st < 2) return false;
    if (a.id === 'lottery') return st >= 3;
    return ['app', 'blind', 'bar'].indexOf(a.id) >= 0;
  };

  /* life at the top */
  function top(S, p) { return G.status() === 3; }
  function elite(S, p) { return G.status() >= 2; }
  G.evs([
    E('st_assassin', [25, 95], '刺杀未遂|Assassination Attempt', '🎯', '一次公开活动中，人群里突然响起了枪声！|At a public event, shots ring out from the crowd!', [
      O('（保镖扑了过来）|(Your bodyguards dive toward you)', function (c) { if (G.ch(.1)) { H.fx(c, { health: -35, fame: 10 }); return '子弹擦伤了你的肩膀。你在医院躺了一个月，支持率却飙升。|A bullet grazed your shoulder. A month in hospital — and your approval soared.'; } H.fx(c, { stress: 20, fame: 6 }); if (c.p.gov) c.p.gov.appr = Math.min(100, c.p.gov.appr + 8); return '刺客被当场制服。你镇定地完成了演讲，全国都记住了这一幕。|The assassin was tackled on the spot. You calmly finished your speech; the nation will never forget it.'; })
    ], { bad: 1, minSt: 3, w: .6 }),
    E('st_summit', [25, 95], '国际峰会|International Summit', '🌐', '你要出席一场大国峰会，各国领导人都在。|You\'re attending a summit of world leaders.', [
      O('强硬表态|Take a hard line', async function (c) { var r = await c.game('policy', { name: '峰会谈判|Summit Talks' }); if (r.win) { H.fx(c, { fame: 6 }); if (c.p.gov) c.p.gov.appr += 6; return '你在谈判中寸土不让，国内一片叫好。|You gave no ground, and the home crowd roared approval.'; } if (c.p.gov) c.p.gov.appr -= 5; return '谈判破裂，外媒说你“不懂外交”。|Talks collapsed; foreign press called you "undiplomatic."'; }),
      O('寻求合作|Seek cooperation', R('你们签下了一份贸易协定，经济学家们很满意。|You signed a trade deal; economists approved.', { eq: 2, rep: 4 }))
    ], { minSt: 3, rep: 1, cd: 2 }),
    E('st_statedinner', [25, 95], '国宴|State Banquet', '🥂', '你设国宴招待来访的外国元首。|You host a state banquet for a visiting head of state.', [
      O('亲自敬酒致辞|Give the toast yourself', R('你的致辞风趣得体，第二天登上了各国报纸。|Your witty toast made papers around the world.', { fame: 3, eq: 2 })),
      O('结识对方的子女|Get to know their family', function (c) { var n = N.mkRomantic({ tags: ['royal'], love: G.ri(25, 50), aff: 30 }); if (!N.partner()) { n.rel = 'admirer'; c.prm.m = n.name; return '你和对方的孩子{m}聊得很投机。|You hit it off with their child, {m}.'; } n.rel = 'contact'; return '你结识了几位有趣的外国贵宾。|You met several fascinating foreign guests.'; })
    ], { minSt: 3, rep: 1, cd: 3 }),
    E('st_leak', [25, 95], '机密泄露|The Leak', '🗂️', '一份涉及你的内部文件被泄露给了媒体。|An internal document involving you has leaked to the press.', [
      O('彻查泄密者|Hunt down the leaker', RC(.5, '泄密者被揪了出来，事态平息。|The leaker was found; it blew over.', { stress: 10 }, '追查本身成了新丑闻。|The hunt itself became a new scandal.', { fame: -4, rep: -5 })),
      O('公开回应，坦然认错|Address it openly', R('你的坦诚赢得了一些尊重。|Your candor earned some respect.', { karma: 4, rep: 2 })),
      O('甩锅给下属|Blame a subordinate', R('风波暂时过去了，但身边的人开始提防你。|It passed, but those around you grew wary.', { karma: -8 }))
    ], { bad: 1, minSt: 2, rep: 1, cd: 4 }),
    E('st_protest', [25, 95], '街头抗议|Protests in the Streets', '📢', '数万人上街抗议你的一项政策。|Tens of thousands march against one of your policies.', [
      O('派代表对话|Open a dialogue', RC(.55, '对话缓和了局势。|Talks eased tensions.', { rep: 4 }, '对话破裂，抗议升级了。|Talks broke down and the protests grew.', { stress: 15 })),
      O('撤回政策|Withdraw the policy', function (c) { if (c.p.gov) c.p.gov.appr += 4; H.fx(c, { rep: -3 }); return '抗议平息了，但反对派说你软弱。|Protests ended, but the opposition calls you weak.'; }),
      O('强硬到底|Hold firm', function (c) { if (c.p.gov) c.p.gov.appr -= 8; H.fx(c, { karma: -4 }); return '局势僵持了很久。|A long standoff followed.'; })
    ], { bad: 1, minSt: 3, if: function (S, p) { return !!p.gov; } }),
    E('st_gala', [20, 95], '慈善晚宴|Charity Gala', '💎', '你受邀出席一场顶级慈善晚宴，名流云集。|You\'re invited to an exclusive charity gala full of the rich and famous.', [
      O('拍下压轴拍品|Win the headline auction lot', function (c) { var m = c.$(G.ri(20, 200) * 1000); if (!c.pay(m)) return '你出价不够高。|You were outbid.'; c.prm.m = G.M(m); H.fx(c, { fame: 5, karma: 6 }); return '你以{m}拍下了压轴拍品，善款全部捐出。|You won the top lot for {m}; every cent went to charity.'; }),
      O('在角落里社交|Network quietly', function (c) { var n = N.mkRomantic({ love: G.ri(20, 45), aff: 25 }); if (!N.partner()) { n.rel = 'admirer'; c.prm.m = n.name; return '一位叫{m}的来宾一直在找你说话。|A guest named {m} kept finding reasons to talk to you.'; } n.rel = 'contact'; return '你结识了几位有用的朋友。|You made some useful friends.'; })
    ], { minSt: 2, rep: 1, cd: 2 }),
    E('st_island', [25, 85], '私人岛屿|A Private Island', '🏝️', '中介向你推荐了一座出售的私人小岛。|A broker pitches you a private island for sale.', [
      O('买下|Buy it', function (c) { var m = c.$(G.ri(5, 30) * 1e6); if (!c.pay(m)) return '这次你的现金不够。|Not enough cash this time.'; c.S.assets.items.push({ id: 'island', n: '私人岛屿|Private Island', val: Math.round(m * .9), inv: 1 }); H.fx(c, { happy: 10, fame: 3 }); return '你成了一座岛的主人。|You now own an island.'; }),
      O('没兴趣|Pass', R('“我已经有够多房子了。”|"I have enough houses."', {}))
    ], { minSt: 2, if: function () { return G.netWorth() > G.$(2e7); } }),
    E('st_kidnapthreat', [20, 90], '勒索信|An Extortion Letter', '✉️', '你收到一封匿名信：不交钱，就对你的家人下手。|An anonymous letter: pay up, or your family gets hurt.', [
      O('加强安保，报警|Boost security and call the police', R('警方顺藤摸瓜，抓到了寄信人。|Police traced and arrested the sender.', { stress: 8, money: -20000 })),
      O('私下付钱了事|Pay quietly', R('你付了钱。可你知道，他们还会再来。|You paid. You know they\'ll be back.', { money: -50000, stress: 12 }))
    ], { bad: 1, minSt: 2 }),
    E('st_flatter', [25, 90], '攀附的人|Hangers-On', '🎩', '想见你的人排着长队，送礼的、求办事的、攀亲戚的……|People line up to see you — bearing gifts, asking favors, claiming to be relatives...', [
      O('一概不见|See no one', R('你清静了，也落了个“架子大”的名声。|Peace and quiet — and a reputation for being aloof.', { stress: -5, rep: -2 })),
      O('择优接见|See a select few', function (c) { var n = N.make({ rel: 'contact', age: c.p.age + G.ri(-10, 10), tags: ['rich'], aff: 30 }); c.prm.m = n.name; H.fx(c, { eq: 2 }); return '你结识了富商{m}，对方表示愿意“全力支持”。|You met tycoon {m}, who pledged "full support."'; }),
      O('照单全收|Accept everything', function (c) { H.fx(c, { money: 30000, karma: -10, heat: 15 }); return '礼物堆满了一间屋子。|Gifts filled an entire room.'; })
    ], { minSt: 2, rep: 1, cd: 3 })
  ]);
})();
