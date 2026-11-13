/* Batch 14 (version 1.6): real police ranks for every country, the undercover officer and the crime boss,
   and the long list of fixes from playtesting — inheritance, birthplaces, parents' careers over time, allowances,
   housing, driving licences, hot majors, grad school, energy rules, loans, adoption, a business you can really run,
   a dedicated space programme, child stars, and more. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function q(id, nid, prm) { var s = S(); (s.pendQ = s.pendQ || []).push({ id: id, nid: nid, prm: prm }); }
  function R2(s) { return s.split(','); }
  function cat(id) { return G.ACT_CATS.filter(function (c) { return c.id === id; })[0]; }
  function item(id) { var f = null; G.ACT_CATS.forEach(function (c) { c.items.forEach(function (x) { if (x.id === id) f = x; }); }); return f; }
  function inList(L, id) { return (L || []).filter(function (x) { return x.id === id; })[0]; }

  /* =============================================================
     1. Police ranks, country by country, up to each country's real top post
     ============================================================= */
  var LAD = {
    us: '警员|Police Officer,警探|Detective,警佐|Sergeant,警督|Lieutenant,警监|Captain,副局长|Deputy Chief,警察局长|Chief of Police,州警察总监|State Police Superintendent,联邦调查局局长|Director of the FBI',
    gb: '警员|Police Constable,警长|Sergeant,督察|Inspector,总督察|Chief Inspector,警司|Superintendent,总警司|Chief Superintendent,助理警察局长|Assistant Chief Constable,副警察局长|Deputy Chief Constable,警察局长|Chief Constable,伦敦警察厅总监|Commissioner of the Metropolitan Police',
    jp: '巡查|Police Officer (Junsa),巡查部长|Sergeant (Junsa-buchō),警部补|Assistant Inspector (Keibu-ho),警部|Inspector (Keibu),警视|Superintendent (Keishi),警视正|Senior Superintendent (Keishi-sei),警视长|Chief Superintendent (Keishi-chō),警视监|Superintendent Supervisor (Keishi-kan),警视总监|Superintendent General of the Tokyo MPD,警察厅长官|Commissioner General of the National Police Agency',
    kr: '巡警|Police Officer (Sungyeong),警长|Senior Officer (Gyeongjang),警士|Sergeant (Gyeongsa),警卫|Lieutenant (Gyeongwi),警监|Captain (Gyeonggam),警正|Superintendent (Gyeongjeong),总警|Senior Superintendent (Chonggyeong),警务官|Commissioner (Gyeongmugwan),治安监|Senior Commissioner (Chian-gam),治安正监|Superintendent General (Chian-jeonggam),警察厅长（治安总监）|Commissioner General of the Korean National Police',
    fr: '治安警员|Gardien de la Paix,警队长|Brigadier,高级警队长|Brigadier-Chef,警务少校|Major de Police,警务中尉|Lieutenant de Police,警务上尉|Capitaine de Police,警务指挥官|Commandant de Police,警察总长|Commissaire,分区警察总长|Commissaire Divisionnaire,总监察长|Inspecteur Général,国家警察总局局长|Director General of the National Police',
    de: '警员|Polizeimeister,高级警员|Polizeiobermeister,首席警员|Polizeihauptmeister,警长|Polizeikommissar,高级警长|Polizeioberkommissar,首席警长|Polizeihauptkommissar,警务参事|Polizeirat,高级警务参事|Polizeioberrat,警务主任|Polizeidirektor,首席警务主任|Leitender Polizeidirektor,警察局长|Polizeipräsident,联邦刑事警察局局长|President of the Federal Criminal Police Office (BKA)',
    ru: '警士|Sergeant of Police,警察准尉|Praporshchik of Police,警察少尉|Lieutenant of Police,警察大尉|Captain of Police,警察少校|Major of Police,警察中校|Lieutenant Colonel of Police,警察上校|Colonel of Police,警察少将|Major General of Police,警察中将|Lieutenant General of Police,警察上将|Colonel General of Police,俄罗斯联邦警察大将|General of Police of the Russian Federation',
    in: '警员|Constable,警长|Head Constable,助理副督察|Assistant Sub-Inspector,副督察|Sub-Inspector,督察|Inspector,副警司|Deputy Superintendent of Police,警司|Superintendent of Police,副总监察长|Deputy Inspector General,总监察长|Inspector General,邦副警察总监|Additional Director General of Police,邦警察总监|Director General of Police,情报局局长|Director of the Intelligence Bureau',
    br: '宪兵|Soldado PM,下士|Cabo,中士|Sargento,准尉|Subtenente,中尉|Tenente,上尉|Capitão,少校|Major,中校|Tenente-Coronel,上校|Coronel,州宪兵司令|Commander-General of the Military Police,联邦警察局局长|Director-General of the Federal Police',
    au: '警员|Constable,高级警员|Senior Constable,警长|Sergeant,高级警长|Senior Sergeant,督察|Inspector,警司|Superintendent,指挥官|Commander,助理警察总监|Assistant Commissioner,副警察总监|Deputy Commissioner,澳大利亚联邦警察总监|Commissioner of the Australian Federal Police',
    ca: '警员|Constable,下士|Corporal,警长|Sergeant,高级警长|Staff Sergeant,督察|Inspector,警司|Superintendent,总警司|Chief Superintendent,助理总监|Assistant Commissioner,副总监|Deputy Commissioner,皇家骑警总监|Commissioner of the RCMP',
    sg: '警员|Constable,下士|Corporal,警长|Sergeant,高级警长|Staff Sergeant,督察|Inspector,助理警监|Assistant Superintendent,副警监|Deputy Superintendent,警监|Superintendent,高级助理警察总监|Senior Assistant Commissioner,副警察总监|Deputy Commissioner,警察总监|Commissioner of Police',
    it: '警员|Agente,助理|Assistente,督导|Sovrintendente,督察|Ispettore,警长|Commissario,副局长|Vice Questore,警察局长|Questore,总监|Dirigente Generale,国家警察总长|Chief of Police (Capo della Polizia)',
    es: '警员|Policía,警官|Oficial de Policía,副督察|Subinspector,督察|Inspector,首席督察|Inspector Jefe,警司|Comisario,首席警司|Comisario Principal,副总局长|Deputy Operational Director,国家警察总局局长|Director General of the National Police',
    mx: '警员|Policía,二级警员|Policía Segundo,一级警员|Policía Primero,副警官|Suboficial,警官|Oficial,副督察|Subinspector,督察|Inspector,总督察|Inspector General,警司|Comisario,总警司|Comisario General,国民警卫队司令|Commander of the National Guard',
    th: '警员|Police Lance Corporal,警士|Police Sergeant,警士长|Police Sergeant Major,警察少尉|Police Sub-Lieutenant,警察中尉|Police Lieutenant,警察上尉|Police Captain,警察少校|Police Major,警察中校|Police Lieutenant Colonel,警察上校|Police Colonel,警察少将|Police Major General,警察中将|Police Lieutenant General,警察上将|Police General,皇家警察总监|Commissioner-General of the Royal Thai Police',
    za: '警员|Constable,警长|Sergeant,准尉|Warrant Officer,中尉|Lieutenant,上尉|Captain,中校|Lieutenant Colonel,上校|Colonel,准将|Brigadier,少将|Major General,中将|Lieutenant General,国家警察总长|National Commissioner of Police',
    nz: '警员|Constable,警长|Sergeant,高级警长|Senior Sergeant,督察|Inspector,警司|Superintendent,助理警察总监|Assistant Commissioner,副警察总监|Deputy Commissioner,警察总监|Commissioner of Police',
    ie: '警员|Garda,警长|Sergeant,督察|Inspector,警司|Superintendent,总警司|Chief Superintendent,助理总监|Assistant Commissioner,副总监|Deputy Commissioner,国家警察总监|Garda Commissioner',
    ch: '警员|Polizist,下士|Korporal,警长|Wachtmeister,高级警长|Feldweibel,准尉|Adjutant,中尉|Leutnant,上尉|Hauptmann,少校|Major,中校|Oberstleutnant,上校|Oberst,州警察司令|Cantonal Police Commander,联邦警察局局长|Director of Fedpol',
    at: '督察员|Inspektor,小组督察|Gruppeninspektor,科督察|Abteilungsinspektor,首席督察|Chefinspektor,中尉|Oberleutnant,上尉|Hauptmann,少校|Major,上校|Oberst,准将|Brigadier,将军|General,公共安全总局局长|Director General for Public Security',
    pt: '警员|Agente,首席警员|Agente Principal,警长|Chefe,警司|Comissário,副警监|Subintendente,警监|Intendente,高级警监|Superintendente,首席高级警监|Superintendente-Chefe,公安警察局全国局长|National Director of the Public Security Police',
    ar: '警员|Agente,下士|Cabo,中士|Sargento,副督察|Subinspector,督察|Inspector,副警司|Subcomisario,警司|Comisario,督察警司|Comisario Inspector,高级警司|Comisario Mayor,总警司|Comisario General,联邦警察总长|Chief of the Federal Police'
  };
  var LADDER = {}, PAYS = {};
  function payFor(n) { var a = []; for (var i = 0; i < n; i++) a.push(Math.round(36000 * Math.pow(300000 / 36000, i / Math.max(1, n - 1)) / 500) * 500); return a; }
  Object.keys(LAD).forEach(function (c) { LADDER[c] = R2(LAD[c]); PAYS[c] = payFor(LADDER[c].length); });
  function polC() { var s = S(); return s && s.p ? s.p.country : 'cn'; }
  Object.defineProperty(G.POLICE, 'r', { configurable: true, get: function () { var c = polC(); return c === 'cn' ? G.POL_CN : (LADDER[c] || LADDER.us); } });
  Object.defineProperty(G.POLICE, 'pay', { configurable: true, get: function () { var c = polC(); return c === 'cn' ? G.PAY_CN : (PAYS[c] || PAYS.us); } });
  G.POLICE_LADDERS = LADDER;
  var ptick = G.police.tick;
  G.police.tick = function (Q) { var o = P().pol; if (o) o.rank = Math.min(o.rank, G.POLICE.r.length - 1); return ptick.apply(this, arguments); };

  /* =============================================================
     2. Undercover, and the crime boss who falls for you
     ============================================================= */
  var uc = inList(G.ACT_POL, 'undercover');
  if (uc) {
    var ucRun = uc.run;
    uc.run = async function (act) {
      var r = await ucRun.apply(this, arguments), p = P();
      if (!S().dead && p.pol && !p.flags.ucBoss && p.age >= 20 && p.age <= 48 && G.ch(.4)) await G.runEvent('uc_boss1');
      return r;
    };
  }
  function boss() { var f = P().flags.ucBoss; return f && S().npcs[f.id]; }
  G.evs([
    { id: 'uc_boss1', sys: 1, title: '他的目光|The Way He Looks at You', icon: '🥀',
      prep: function (c) {
        var p = c.p, f = p.g === 'f';
        var n = N.make({ rel: 'contact', g: f ? 'm' : 'f', age: p.age + (f ? G.ri(2, 12) : G.ri(-6, 2)), job: f ? '黑帮老大|Crime Boss' : '黑帮老大的女儿|The Crime Boss\'s Daughter', wealth: G.$(G.ri(5, 60) * 1e6), looks: G.ri(72, 94), aff: 40, love: 35, pers: f ? 'boss' : 'romantic' });
        n.pin = 1; n.ucBoss = 1; p.flags.ucBoss = { id: n.id, st: 1, real: 0, y: S().year }; c.prm.n = n.name; c.prm.who = f ? '这个帮派的老大|the head of the gang' : '黑帮老大的独生女|the boss\'s only daughter';
      },
      t: '你卧底的第三个月。{who}{n}在一次聚会后单独留下你，给你倒了一杯酒：“我看人很准。你和他们不一样。”ta看你的眼神，不像是在审问。|Three months undercover. After a party, {who}, {n}, keeps you back alone and pours you a drink: "I read people well. You\'re not like the others." The look in their eyes isn\'t an interrogation.',
      o: [{ t: '假意逢迎，借机接近核心|Play along to get closer to the core', run: function (c) { var n = boss(); N.addLove(n, 25); c.p.pol.merit += 30; return '你成了{n}身边最信任的人。账本、仓库、上线……你一点点都看到了。功绩+30。|You became {n}\'s most trusted companion. Ledgers, warehouses, suppliers — little by little you saw it all. Merit +30.'; } },
        { t: '你发现自己动了真心|You realise you\'ve fallen for real', run: function (c) { var n = boss(); n.rel = 'lover'; n.love = 80; N.addAff(n, 30); c.p.partner = c.p.partner || n.id; c.p.flags.ucBoss.real = 1; c.add('happy', 12); c.add('stress', 15); return '那天晚上，你在任务日志里什么也没写。|That night, you wrote nothing in the mission log.'; } },
        { t: '保持距离|Keep your distance', run: function (c) { var n = boss(); N.addLove(n, -10); c.p.flags.ucBoss.st = 9; return '你礼貌地推开了酒杯。ta笑了笑，没再说什么。|You politely pushed the glass away. They smiled, and said nothing more.'; } }] },
    { id: 'uc_boss2', sys: 1, title: '收网之夜|The Night of the Raid', icon: '🚔',
      prep: function (c) { var n = boss(); if (!n || !n.alive || !c.p.pol) return false; c.prm.n = n.name; c.prm.real = c.p.flags.ucBoss.real; },
      t: '行动定在明晚。{n}什么都不知道——今晚ta把保险柜的密码告诉了你，还说：“等这批货出完，我们就金盆洗手，去一个没人认识的地方。”|The raid is set for tomorrow night. {n} knows nothing — tonight they told you the safe combination and said: "After this last shipment, we quit. We go somewhere nobody knows us."',
      o: [{ t: '亲手给ta戴上手铐（直觉小游戏）|Put the cuffs on them yourself (instinct test)', run: async function (c) {
          var r = await G.spyGame({ name: '收网|The Raid', rounds: 2 }), n = boss();
          if (!r.ok && G.ch(.35)) { G.die('卧底身份暴露，壮烈牺牲|Killed in the line of duty while undercover'); return ''; }
          n.rel = 'ex'; n.love = 0; N.addAff(n, -80); n.jail = { y: S().year, yrs: G.ri(15, 25) }; n.job = '服刑人员|Prisoner';
          c.p.pol.merit += r.ok ? 140 : 70; c.add('fame', 10); c.add('karma', 8); c.add('happy', c.prm.real ? -25 : 5); c.p.flags.ucBoss.st = 9; G.major('端掉了整个黑帮|Brought down an entire crime syndicate'); G.inc('cases', 20);
          return c.prm.real ? '手铐扣上的那一刻，ta只问了一句：“哪些是真的？”你没有回答。功绩大幅提升。|As the cuffs clicked, they asked only: "Which parts were real?" You didn\'t answer. Your merit soared.' : '整个帮派一夜之间被连根拔起。你被授予一等功。|The whole gang was torn out by the roots overnight. You were decorated with first-class merit.';
        } },
        { t: '劝ta自首|Persuade them to turn themselves in', if: function (c) { return c.prm.real; }, run: function (c) {
          var n = boss();
          if (G.ch(.35 + n.love / 250)) { n.jail = { y: S().year, yrs: G.ri(3, 6) }; n.job = '服刑人员|Prisoner'; c.p.pol.merit += 60; c.add('karma', 10); c.p.flags.ucBoss.st = 2; c.p.flags.ucBoss.wait = S().year + n.jail.yrs; return 'ta沉默了很久，然后把枪放在了桌上：“我等你。”ta因为自首被从轻判决。|They were silent a long time, then laid the gun on the table: "I\'ll wait for you." The court was lenient because they surrendered.'; }
          n.rel = 'ex'; N.addLove(n, -60); c.p.flags.ucBoss.st = 9; c.add('happy', -15); c.p.pol.merit += 20; return 'ta拒绝了，当晚就消失了。你再也没见过ta。|They refused, and vanished that night. You never saw them again.';
        } },
        { t: '为ta放弃警徽，一起远走高飞|Give up the badge and run away together', if: function (c) { return c.prm.real; }, run: function (c) {
          var n = boss(), m = Math.round(n.wealth * .3); n.wealth -= m; G.addMoney(m); c.p.pol = null; c.p.h.heat = (c.p.h.heat || 0) + 40; c.add('karma', -15); c.add('happy', 15); c.p.flags.ucBoss.st = 3; c.p.flags.runaway = 1;
          var to = G.pick(['th', 'br', 'mx', 'ar', 'za'].filter(function (x) { return x !== c.p.country; })); G.moveTo(to); N.rel('lover').forEach(function (x) { if (x === n) x.c = to; });
          G.major('为爱放弃警徽，远走{c}|Gave up the badge for love and fled to {c}', { c: G.C[to].n });
          return '你们连夜上了一艘货轮。天亮时，你把警徽扔进了海里。|You boarded a cargo ship that night. At dawn you threw your badge into the sea.';
        } }] },
    { id: 'uc_boss3', sys: 1, title: '出狱那天|The Day of Release', icon: '🌅',
      prep: function (c) { var n = boss(); if (!n || !n.alive) return false; c.prm.n = n.name; },
      t: '{n}出狱了。监狱门口，ta看见你站在那里，愣了很久。|{n} is released. At the prison gate they see you waiting, and stand frozen for a long time.',
      o: [{ t: '走过去抱住ta|Walk over and hold them', run: async function (c) { var n = boss(); n.jail = null; n.job = '餐馆老板|Restaurant Owner'; n.rel = 'lover'; n.love = 90; c.p.partner = c.p.partner || n.id; c.p.flags.ucBoss.st = 9; c.add('happy', 15); return '你们后来开了一家小餐馆。常客里，有好几个是你当年的同事。|You opened a little restaurant together. Several regulars are your old colleagues.'; } },
        { t: '远远看一眼就走|Watch from afar, then leave', run: function (c) { c.p.flags.ucBoss.st = 9; c.add('happy', -5); return '你转身的时候，听见ta喊了你的名字。你没有回头。|As you turned away you heard them call your name. You didn\'t look back.'; } }] }
  ]);

  /* =============================================================
     3. Inheritance from your parents: always all of it
     ============================================================= */
  var inh = G.family.inherit;
  G.family.inherit = function (dead) {
    if (!dead || dead.wasYou && dead.legacy || (dead.rel !== 'father' && dead.rel !== 'mother')) return inh.apply(this, arguments);
    var p = P(), other = N.rel('father', 'mother').filter(function (n) { return n !== dead && n.alive; })[0];
    if (other) { other.wealth += Math.max(0, dead.wealth); dead.wealth = 0; return 0; }
    var total = Math.max(0, dead.wealth || 0); dead.wealth = 0;
    if (total > 0) { G.addMoney(total); G.inc('inherit', total); G.log('{n}的全部遗产{m}都留给了你（100%）。|{n}\'s entire estate, {m}, came to you (100%).', { n: dead.name, m: G.M(total) }); }
    if (!p.flags.gotFamHome && total > G.$(15000) && p.age >= 18) {
      p.flags.gotFamHome = 1;
      var H0 = G.HOUSES.filter(function (x) { return x.id === (p.tier >= 4 ? 'self' : 'old'); })[0] || G.HOUSES[1];
      S().assets.houses.push({ id: G.uid(), k: H0.id, n: '父母的老房子|Your Parents\' Old Home', val: G.money.housePrice(H0, p.tier), cost: 0, mort: 0, y: S().year, city: p.city, c: p.country, school: false, live: !S().assets.houses.some(function (x) { return x.live; }) });
      G.log('爸妈的老房子也留给了你。|Your parents\' old home passed to you as well.');
    }
    return total;
  };
  var ni = G.npcInfo;
  G.npcInfo = function (n) {
    var r = (ni.apply(this, arguments) || []).filter(function (x) { return x && x[0] !== '遗产会给谁|Who gets this estate'; });
    if ((n.rel === 'father' || n.rel === 'mother') && n.alive) r.push(['遗产会给谁|Who gets this estate', N.rel('father', 'mother').filter(function (x) { return x !== n && x.alive; }).length ? '先给配偶，最终100%归你|First to their spouse, then 100% to you' : '你（100%）|You (100%)']);
    if (n.jobTL && n.jobTL.length > 1) r.push(['职业经历|Career', n.jobTL.filter(function (x) { return x[0] <= S().year; }).map(function (x) { return x[0] + ' ' + G.T(x[1]); }).join('\n')]);
    return r;
  };

  /* =============================================================
     4. Your career history, so the next generation sees it change
     ============================================================= */
  function snap() {
    var p = P(), s = S(), h = p.hist = p.hist || {};
    var t = G.title ? G.title() : ''; if (typeof t !== 'string') t = String(t);
    h[s.year] = { t: t, nw: Math.round(Math.max(0, G.netWorth()) / Math.max(1e-9, G.$(1))), f: Math.round(p.st.fame), gov: p.gov ? 1 : 0, mil: p.mil ? 1 : 0, pol: p.pol ? 1 : 0, deg: p.edu.deg };
  }
  function histAt(hist, y) { if (!hist) return null; var best = null; Object.keys(hist).forEach(function (k) { if (+k <= y && (!best || +k > best)) best = +k; }); return best != null ? hist[best] : null; }
  function originAt(old, h) {
    var o = old.origin, fl = old.flags;
    if (!h || fl.monarch || ['royal', 'noble', 'red', 'mafia'].indexOf(o) >= 0) return null;
    if (h.nw > 1e9) return 'richest'; if (h.nw > 2e7) return 'tycoon';
    if (h.f >= 75) return 'celebrity'; if (h.nw > 1e6) return 'merchant';
    if (h.gov) return 'civil'; if (h.mil) return 'military'; if (h.pol) return 'police';
    if (h.deg >= 6) return 'scholar'; if (h.nw > 150000) return 'middle';
    return old.tier >= 5 ? 'rural' : 'worker';
  }
  function timeline(hist) {
    var out = [], last = null;
    Object.keys(hist || {}).map(Number).sort(function (a, b) { return a - b; }).forEach(function (y) { var t = hist[y].t; if (t && t !== last) { out.push([y, t]); last = t; } });
    return out;
  }
  function fixCity(p) {
    var C = G.C[p.country]; if (!C || !C.cities) return;
    var all = []; Object.keys(C.cities).forEach(function (k) { all = all.concat(C.cities[k]); });
    if (all.indexOf(p.city) >= 0) return;
    var t = Math.min(4, Math.max(1, p.tier || 2)), L = C.cities[t] || C.cities[2] || all;
    p.city = G.pick(L);
  }
  var reb = G.life.rebirthAs;
  if (reb) G.life.rebirthAs = function (kid) {
    var s0 = S(), old = s0.p, hist = old.hist, home = old.flags.ances || old.flags.hometown || { c: old.country, city: old.city };
    var h = histAt(hist, kid.by), org = originAt(old, h), cr = G.life.create;
    G.life.create = function (o) { if (org && G.ORIGIN[org]) o.origin = org; if (o.country !== old.country) { o.city = null; } return cr.apply(this, arguments); };
    var s;
    try { s = reb.apply(this, arguments); } finally { G.life.create = cr; }
    var p = s.p; if (!p.city) p.city = old.city; fixCity(p);
    p.flags.ances = home;
    var me = N.all(function (n) { return n.wasYou; })[0];
    if (me && hist) { me.jobTL = timeline(hist); var cur = histAt(hist, s.year); if (cur) me.job = cur.t; }
    return s;
  };
  var cont = G.life.continueAs;
  G.life.continueAs = function (kid) {
    var old = P(), home = old.flags.ances || old.flags.hometown || { c: old.country, city: old.city };
    var r = cont.apply(this, arguments), p = P(); fixCity(p); p.flags.ances = home; return r;
  };
  // a parent's job moves along their own timeline
  var nt = N.tick;
  N.tick = function () {
    var out = nt.apply(this, arguments), s = S();
    N.all(function (n) { return n.jobTL && n.alive; }).forEach(function (n) { var t = null; n.jobTL.forEach(function (x) { if (x[0] <= s.year) t = x[1]; }); if (t) n.job = t; });
    // the household staff of a famous family love the child they raise
    N.all(function (n) { return n.rel === 'staff' && n.alive; }).forEach(function (n) { if (!n.staffInit) { n.staffInit = 1; n.aff = Math.max(n.aff, G.ri(78, 90)); } n.aff = Math.max(n.aff, 65); });
    // adopted children hold on to you
    N.all(function (n) { return n.rel === 'child' && n.adopted && n.alive; }).forEach(function (n) { n.aff = Math.max(n.aff, 60); });
    // a partner who married for a passport keeps their side of the bargain
    N.all(function (n) { return n.citSeeker && n.alive && (n.rel === 'spouse' || n.rel === 'lover'); }).forEach(function (n) { n.love = Math.max(n.love, 80); n.loyal = Math.max(n.loyal || 0, 85); });
    return out;
  };
  // ancestral home on the profile
  var bt = G.bornText;
  if (bt) G.bornText = function (p) { var r = bt.apply(this, arguments), a = p && p.flags && p.flags.ances; if (a && a.c && (a.c !== G.birthC(p) || a.city !== p.city) && G.C[a.c]) r += '  ·  ' + G.T('祖籍|Ancestral home') + ' ' + G.C[a.c].flag + G.T(G.C[a.c].n) + G.T(a.city || ''); return r; };

  /* =============================================================
     5. Money at home: proper pocket money, housing, cars and licences, loans
     ============================================================= */
  var mt = G.money.tick;
  G.money.tick = function () {
    var r = mt.apply(this, arguments), s = S(), p = s.p;
    if (s.dead) return r;
    snap();
    // pocket money scales with what your parents earn
    if (G.dependent() && !p.jail && p.age >= 3 && p.age < 22) {
      var tot = 0, by = [];
      N.rel('father', 'mother').filter(function (n) { return n.alive && !n.away; }).forEach(function (n) {
        var af = G.clamp(.5 + (n.aff || 0) / 100, .2, 1.5), inc = Math.max(0, n.inc || 0);
        var a = Math.round(inc * (.012 + p.age * .0035) * af + Math.max(0, n.wealth || 0) * .002 * af);
        a = Math.min(a, Math.round(inc * .15 + Math.max(0, n.wealth) * .02)); if (a < 1) return;
        n.wealth = Math.max(0, n.wealth - Math.round(a * .3)); tot += a; by.push(n);
      });
      if (tot > 0) G.giftIn(tot, G.L('父母给的零花钱|Pocket money from your parents'));
    }
    // a roof of your own matters: renting is tolerable, having none is not
    if (p.age >= 22 && !G.dependent() && !p.jail && !G.school.isStudent()) {
      var own = s.assets.houses.some(function (h) { return h.live; });
      if (!own && p.home === 'rent' && p.rent) G.addStat('health', 1, true);
      else if (!own && p.home !== 'parents' && !p.rent) { G.addStat('health', -3, true); G.addStat('happy', -2, true); }
    }
    // a passport marriage brings money in every month
    N.all(function (n) { return n.citSeeker && n.alive && n.rel === 'spouse'; }).forEach(function (n) { var m = G.$(n.citGift || 60000); G.giftIn(m, G.L('{n}给的家用|Housekeeping from {n}', { n: n.name })); });
    // a car from your parents on your 18th
    if (p.age === 18 && !p.flags.carGift && (G.famClass && G.famClass() >= 2 || N.rel('father', 'mother').some(function (n) { return n.wealth > G.$(400000); }))) { p.flags.carGift = 1; q('car_gift'); }
    // turning 40 without children
    if (p.age === 40 && !p.flags.adoptAsk && !N.rel('child').length && !p.jail) { p.flags.adoptAsk = 1; q('adopt_ask'); }
    // a foreign partner who wants your passport
    if (!p.flags.citSuitor && p.age >= 23 && p.age <= 45 && !N.partner() && !p.jail && ['ch', 'us', 'gb', 'de', 'fr', 'au', 'ca', 'nz', 'ie', 'at', 'sg', 'jp'].indexOf(p.country) >= 0 && G.ch(.07)) { p.flags.citSuitor = 1; q('cit_suitor'); }
    // a child star in a famous family earns from film sets
    if (p.flags.kidStar && p.age < 18) { var fee = G.$(G.ri(20, 120) * 1000 * (1 + p.st.looks / 100) * (p.st.fame > 50 ? 2 : 1)); if (G.fin) G.fin.tag = G.L('片酬|Acting fees'); G.addMoney(fee); if (G.fin) G.fin.tag = null; G.addStat('fame', 2, true); }
    return r;
  };

  G.evs([
    { id: 'car_gift', sys: 1, title: '十八岁的礼物|An 18th Birthday Present', icon: '🚗',
      t: '生日那天，爸妈把你带到楼下，一辆系着红丝带的新车停在那里。|On your birthday your parents lead you downstairs. A new car with a red ribbon is waiting.',
      o: [{ t: '尖叫着冲过去|Run to it screaming', run: function (c) {
        var pool = G.CARS.filter(function (x) { return x.id !== 'bike' && x.id !== 'moto' && (!x.y0 || S().year >= x.y0); }).sort(function (a, b) { return a.p - b.p; });
        var rich = G.famClass && G.famClass() >= 3, car = pool[Math.min(pool.length - 1, rich ? pool.length - 1 - G.ri(0, 2) : Math.floor(pool.length / 2))] || pool[0];
        S().assets.cars.push({ id: G.uid(), k: car.id, n: car.n, val: G.$(car.p), i: car.i, gift: 1 }); c.add('happy', 12);
        c.prm.c = car.n;
        return c.p.flags.license ? '是一辆{c}。你当场就开着它去兜风了。|It\'s a {c}. You took it for a spin right away.' : '是一辆{c}。不过你还没有驾照，只能先坐在驾驶座上拍照。|It\'s a {c}. You don\'t have a licence yet, so for now you just sit in the driver\'s seat for photos.';
      } }] },
    { id: 'adopt_ask', sys: 1, title: '四十岁的夜晚|A Night at Forty', icon: '🏡',
      t: '四十岁生日那晚，家里很安静。你想起了福利院门口那些孩子的眼睛。要不要领养一个孩子？被领养的孩子，往往比谁都更爱这个家。|On the night of your fortieth birthday, the house is very quiet. You think of the children\'s eyes at the orphanage gate. Will you adopt? Adopted children often love their family more than anyone.',
      o: [{ t: '领养一个孩子|Adopt a child', run: async function (c) { var k = await G.love.baby(null, true); if (!k) return '手续没办下来。|The paperwork fell through.'; k.adopted = 1; k.aff = Math.max(k.aff || 0, 88); c.add('happy', 15); c.prm.k = k.name; return '你把{k}领回了家。第一晚，ta攥着你的手指才睡着。|You brought {k} home. The first night, they only fell asleep holding your finger.'; } },
        { t: '再想想|Not now', run: function () { return '你把那张福利院的宣传单夹进了书里。|You tucked the orphanage leaflet into a book.'; } }] },
    { id: 'cit_suitor', sys: 1, title: '一个直接的提议|A Very Direct Proposal', icon: '💍',
      prep: function (c) {
        var p = c.p, g = p.orient === 'gay' ? p.g : (p.g === 'm' ? 'f' : 'm'), from = G.pick(['cn', 'ru', 'cn', 'ru', 'br', 'in']);
        var n = N.make({ rel: 'contact', g: g, age: G.clamp(p.age + G.ri(-5, 3), 22, 60), c: from, looks: G.ri(82, 97), smarts: G.ri(75, 95), wealth: G.$(G.ri(3, 30) * 1e6), aff: 70, love: 60, job: G.pick(['投资人|Investor', '企业家|Entrepreneur', '外科医生|Surgeon', '律师|Lawyer']), pers: 'gentle' });
        n.pin = 1; n.citSeeker = 1; n.citGift = G.ri(60, 180) * 1000; c.npc = n; c.prm.n = n.name; c.prm.c = G.C[from].n; c.prm.me = G.C[p.country].n; c.prm.m = G.M(G.$(n.citGift));
      },
      t: '{n}来自{c}，长得好看，又聪明又有钱。第三次约会时，ta很坦白：“我想要{me}的身份。嫁给我/娶我，我会对你很好，家用每年给你{m}，什么都不用你操心。”|{n} from {c} is beautiful, brilliant and rich. On the third date they\'re frank: "I want {me} citizenship. Marry me and I\'ll treat you well — {m} a year for the household, and you\'ll never have to worry about a thing."',
      o: [{ t: '答应|Say yes', run: async function (c) { var n = c.npc; n.rel = 'lover'; n.love = 92; c.p.partner = n.id; var ok = await G.love.marry(n); if (ok) { n.cits = (n.cits || [n.c]).concat([c.p.country]); n.c = c.p.country; c.add('happy', 10); return '婚礼很体面。{n}说到做到：从不过问你的事，只是每个月按时把钱打过来，偶尔还会给你做一顿饭。|The wedding was elegant. {n} kept every promise: never pried, paid on time each month, and sometimes even cooked you dinner.'; } return '你们先在一起了。|You got together for now.'; } },
        { t: '先交往看看|Date for a while first', run: function (c) { var n = c.npc; n.rel = 'lover'; n.love = 85; c.p.partner = n.id; return '{n}很有耐心：“我不急。”|{n} is patient: "I\'m in no hurry."'; } },
        { t: '拒绝|Decline', run: function (c) { c.npc.rel = 'contact'; c.npc.pin = 0; return 'ta一点也不生气，礼貌地结了账。|They weren\'t offended at all, and politely paid the bill.'; } }] }
  ]);

  // buying a home: every option answers, nothing freezes
  var house = item('house');
  if (house) house.run = async function (a) {
    var p = P(), hs = G.HOUSES.filter(function (h) { return !h.tiers || h.tiers.indexOf(p.tier) >= 0; });
    var inc = 0; try { inc = G.money.income().work || 0; } catch (e) { }
    var i = await G.UI.pick({ title: G.L('买房 · {c}|Buy a Home · {c}', { c: p.city }), text: G.L('现金：{m}|Cash: {m}', { m: G.M(p.money) }),
      items: hs.map(function (h) { var pr = G.money.housePrice(h); return { t: h.n, sub: G.L('{a}㎡ · {m}{x}|{a} m² · {m}{x}', { a: h.a, m: G.M(pr), x: p.money < pr * .3 ? G.L(' · 首付不够|· can\'t afford the deposit') : '' }), icon: h.i }; }) });
    if (i < 0) return 'cancel';
    var h = hs[i], pr = G.money.housePrice(h), down = Math.round(pr * .3);
    if (p.money < down) return G.result(a.n, '钱不够。这套房总价{m}，光首付就要{d}，你现在只有{c}。|Not enough money. This home costs {m}; the deposit alone is {d}, and you have {c}.', { m: G.M(pr), d: G.M(down), c: G.M(p.money) }, [], a.i);
    var opts = [{ t: G.L('全款 {m}|Pay in full {m}', { m: G.M(pr) }) }, { t: G.L('贷款（首付30% {m}）|Mortgage (30% down: {m})', { m: G.M(down) }) }, { t: G.L('算了|Cancel') }];
    var j = await G.UI.event({ title: G.L(h.n), text: G.L('总价{m}，怎么付？|Total price {m}. How will you pay?', { m: G.M(pr) }), opts: opts });
    if (j === 2 || j < 0) return 'cancel';
    if (j === 0 && p.money < pr) return G.result(a.n, '钱不够全款。你可以选择贷款。|You can\'t pay in full. Try a mortgage.', null, [], a.i);
    if (j === 1 && inc <= 0 && !G.ch(.3)) return G.result(a.n, '银行查了你的收入，拒绝了贷款。|The bank checked your income and refused the mortgage.', null, [], a.i);
    var rec = G.money.buyHouse(h, j === 1);
    if (!rec) return G.result(a.n, '钱不够。|Not enough money.', null, [], a.i);
    G.dStart(); G.addStat('happy', 12); var dl = G.dEnd();
    if (p.rent) p.rent = null; p.home = rec.id || p.home;
    return G.result(a.n, '你买下了{n}！|You bought a {n}!', { n: h.n }, dl, h.i);
  };
  var gh = G.EV.grad_home;
  if (gh) gh.o.forEach(function (o) { if (/^买房/.test(o.t)) o.run = async function () { var a = item('house'); try { await a.run(a); } catch (e) { } return S().assets.houses.some(function (h) { return h.live; }) ? '你有了自己的房子。|You have a home of your own.' : (await G.chooseRent()) ? '你还是先租了一套房子。|You decided to rent for now.' : '你暂时在朋友家借住。|You crashed at a friend\'s place for now.'; }; });

  // driving: you need a licence for a car, and a licence needs a sound mind and body
  var lic = item('license');
  if (lic) {
    lic.a = [17, 80];
    var lr = lic.run;
    lic.lock = function () { var p = P(); if (p.flags.license) return null; if (p.st.smarts <= 40 || p.st.health <= 60) return G.L('考驾照需要智力40%以上、健康60%以上|A licence needs smarts above 40% and health above 60%'); return null; };
    lic.run = async function (a) { var p = P(); if (p.st.smarts <= 40 || p.st.health <= 60) return G.result(a.n, '体检或理论考试没通过：需要智力40%以上、健康60%以上。|You failed the medical or theory test: you need smarts above 40% and health above 60%.', null, [], a.i); return lr.apply(this, arguments); };
  }
  var car = item('car');
  if (car) car.run = async function (a) {
    var p = P(), cs = G.CARS.filter(function (c) { return !c.y0 || S().year >= c.y0; });
    var i = await G.UI.pick({ title: G.L(a.n), text: p.flags.license ? null : G.L('你还没有驾照，只能买电动自行车。|You have no licence yet — you can only buy an e-bike.'),
      items: cs.map(function (c) { var need = c.id !== 'bike' && !p.flags.license; return { t: c.n, sub: G.M(G.$(c.p)) + (need ? G.L(' · 需要驾照| · licence required') : ''), icon: c.i, dis: need }; }) });
    if (i < 0) return 'cancel'; var c = cs[i];
    if (c.id !== 'bike' && !p.flags.license) return G.result(a.n, '你还没有驾照。先去考一个吧。|You don\'t have a licence. Go and get one first.', null, [], a.i);
    if (!G.money.buyCar(c)) return G.result(a.n, '钱不够。这辆车要{m}。|Not enough money. This one costs {m}.', { m: G.M(G.$(c.p)) }, [], a.i);
    G.dStart(); G.addStat('happy', 4 + c.f); if (c.f >= 12) G.addStat('fame', 1); var dl = G.dEnd();
    return G.result(a.n, '你提了一辆{n}！|You drove home a new {n}!', { n: c.n }, dl, c.i);
  };

  // loans and asking family: bigger, and more often yes
  G.money.LOANS.forEach(function (l) {
    if (l.k === 'bank') l.max = function () { var i = 0; try { i = G.money.income().work; } catch (e) { } return i > 0 && !P().crime.rec ? i * 6 + Math.max(0, G.netWorth()) * .3 : 0; };
    if (l.k === 'online') l.max = function () { return P().age >= 18 ? G.$(30000) : 0; };
    if (l.k === 'shark') l.max = function () { return P().age >= 18 ? G.$(250000) : 0; };
  });

  /* =============================================================
     6. People: propose once a year, breakups are free, borrowing works, in-laws are there
     ============================================================= */
  var na = G.npcActs;
  G.npcActs = function (n) {
    var out = (na.apply(this, arguments) || []).filter(function (a) { return !(a.id === 'propose' && n.propY === S().year); });
    out.forEach(function (a) {
      if (a.id === 'breakup') a.e = 0;
      if (a.id === 'propose' && !a._y) { a._y = 1; var pr = a.run; a.run = function (nn) { nn.propY = S().year; return pr.apply(this, arguments); }; }
      if (a.id === 'askmoney') a.run = async function (nn, act) {
        var fam = N.family && N.family[nn.rel], rom = nn.rel === 'spouse' || nn.rel === 'lover';
        var ch = (nn.aff + 40) / 140 + (fam ? .35 : 0) + (rom ? .3 : 0) - (nn.lastLend === S().year ? .5 : 0);
        N.touch && N.touch(nn);
        if (nn.wealth > G.$(100) && G.ch(G.clamp(ch, .05, .95))) {
          var amt = Math.round(Math.min(nn.wealth * .2, G.$(fam ? 50000 : rom ? 30000 : 8000) * (nn.tags && nn.tags.length ? 10 : 1)));
          amt = Math.max(amt, Math.round(G.$(50))); nn.wealth -= amt; nn.lastLend = S().year; G.dStart(); G.addMoney(amt); G.dPush('aff', N.addAff(nn, fam ? 0 : -2)); var dl = G.dEnd();
          return G.result(act.n, '{n}转给你{m}。|{n} sent you {m}.', { n: nn.name, m: G.M(amt) }, dl, '💸');
        }
        G.dStart(); G.dPush('aff', N.addAff(nn, -2)); var dl2 = G.dEnd();
        return G.result(act.n, '{n}说最近也手头紧。|{n} says money\'s tight for them too right now.', { n: nn.name }, dl2, '💸');
      };
    });
    return out;
  };

  /* =============================================================
     7. Work: what counts, what costs energy, what was removed
     ============================================================= */
  G.ACT_UNI = (G.ACT_UNI || []).filter(function (a) { return a.id !== 'intern'; });
  G.ACT_JOB = (G.ACT_JOB || []).filter(function (a) { return a.id !== 'raise'; });
  if (G.ACT_JOBX) for (var xi = G.ACT_JOBX.length - 1; xi >= 0; xi--) if (G.ACT_JOBX[xi].id === 'jx_livesell' || G.ACT_JOBX[xi].id === 'jx_moonlight') G.ACT_JOBX.splice(xi, 1);
  var flat = inList(G.ACT_JOB, 'flatter');
  if (flat) flat.run = function (a) { var j = P().job; if (G.ch(.6 + P().st.eq / 300)) { j.perf = Math.min(100, j.perf + 8); return G.quick(a, '老板被你哄得眉开眼笑。（绩效+8）|Your boss beams at your flattery. (Performance +8)', { karma: -1 }); } j.perf = Math.min(100, j.perf + 2); return G.quick(a, '马屁拍到了马腿上，不过老板好歹记住了你。（绩效+2）|The flattery fell flat, but at least the boss remembers you now. (Performance +2)', { happy: -2 }); };
  var col = inList(G.ACT_JOB, 'colleague');
  if (col) { var cr0 = col.run; col.run = function (a) { var r = cr0.apply(this, arguments); G.addStat('happy', 5); G.addStat('stress', -4); return r; }; }
  var ust = inList(G.ACT_UNI, 'ustudy');
  if (ust) { var us0 = ust.run; ust.run = function (a) { G.addStat('perf', 4); return us0.apply(this, arguments); }; }
  var uclub = inList(G.ACT_UNI, 'club');
  if (uclub) { var uc0 = uclub.run; uclub.run = function (a) { G.addStat('perf', 2); return uc0.apply(this, arguments); }; }
  var exch = inList(G.ACT_UNI, 'exchange');
  if (exch) { exch.e = 30; exch.$ = 900000; var ex0 = exch.run; exch.run = function (a) { P().flags.exch = 1; return ex0.apply(this, arguments); }; }
  ['dropout', 'udrop'].forEach(function (id) { var a = item(id) || inList(G.ACT_UNI, id); if (a) a.e = 0; });
  ['enlist', 'police', 'civil'].forEach(function (id) { var a = item(id); if (a) a.e = 0; });
  [G.ACT_POL, G.ACT_MIL, G.ACT_GOV].forEach(function (L) { (L || []).forEach(function (a) { a.e = 0; }); });
  // life's duplicates
  var lifeC = cat('life');
  if (lifeC) lifeC.items = lifeC.items.filter(function (a) { return ['cook', 'concert', 'karaoke', 'volunteer', 'adopt_pet'].indexOf(a.id) < 0; });
  // other paid work counts toward the yearly limit too
  var iw = G.isWorkAct;
  G.isWorkAct = function (a) { if (!a || !a.e) return false; if (['write', 'exhibit', 'stall', 'eshop', 'stream', 'talent', 'audition', 'esports', 'sports', 'casting', 'startup', 'jobsearch', 'kid_film', 'kid_ad'].indexOf(a.id) >= 0) return true; return iw.apply(this, arguments); };

  /* =============================================================
     8. School: hot majors, foreign exams, grades that open doors, the pay of a top degree
     ============================================================= */
  var SC = G.school;
  var ERA = { cs: 1995, fin: 1990, econ: 1985, med: 0, law: 1985, eng: 0, arch: 1990, art: 0, media: 2000, lang: 1980, psy: 2000, bio: 2000, agri: 0, biz: 1995, pol: 0, nurse: 0, hist: 0, edu: 0 };
  function hotMajors() {
    var y = S().year, p = P(), seed = G.hash ? G.hash(p.name + y) : y * 7, L = G.MAJOR_LIST.filter(function (m) { return y >= (ERA[m] || 0); });
    var r = function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    var w = L.map(function (m) { var b = { cs: 3, fin: 2.5, med: 2, law: 1.6, eng: 1.8, econ: 1.6, biz: 1.4, bio: 1.2 }[m] || .7; if (m === 'pol' && p.country === 'cn') b = 1.5; if (m === 'cs' && y < 2005) b = 1.5; return { m: m, s: b * (.5 + r()) }; });
    return w.sort(function (a, b) { return b.s - a.s; }).slice(0, 4).map(function (x) { return x.m; });
  }
  function majorJobs(m) { return G.JOBS.filter(function (j) { return j.maj && j.maj.indexOf(m) >= 0 && (!j.y0 || S().year >= j.y0); }); }
  function payTxt(m) {
    var js = majorJobs(m); if (m === 'pol' && P().country === 'cn') return G.L('考公务员、选调生、外交部|Civil service, fast-track officials, foreign ministry');
    if (m === 'edu') return G.L('教师、校长、教育公司|Teacher, principal, education companies');
    if (!js.length) return '';
    var top = js.sort(function (a, b) { return b.pay[0] - a.pay[0]; })[0];
    return G.L('起薪约{m} · {j}|Starting ~{m} · {j}', { m: G.M(G.$w ? G.$w(top.pay[0]) : G.$(top.pay[0])), j: js.slice(0, 3).map(function (j) { return G.T(j.n); }).join('/') });
  }
  var pm = SC.pickMajor;
  SC.pickMajor = async function (c, spec) {
    if (spec) return pm.apply(this, arguments);
    var hot = hotMajors(), list = hot.concat(G.MAJOR_LIST.filter(function (m) { return hot.indexOf(m) < 0; }));
    var i = await G.UI.pick({ title: G.L('选择专业|Choose a Major'), text: G.L('🔥 是今年最热门、毕业薪水最高的专业。|🔥 marks this year\'s hottest, best-paid majors.'),
      items: list.map(function (m) { return { t: (hot.indexOf(m) >= 0 ? '🔥 ' : '') + G.T(G.MAJORS[m].n), sub: payTxt(m), icon: '📘' }; }) });
    var m = list[i < 0 ? 0 : i]; if (hot.indexOf(m) >= 0) P().flags.hotMajor = m; return m;
  };
  // the civil service exam favours politics and law graduates in China
  var civ = item('civil');
  if (civ) { var cv0 = civ.run; civ.run = async function (a) { var p = P(), m = p.edu.major, bonus = p.country === 'cn' && (m === 'pol' || m === 'law') ? .12 : 0; if (bonus) p.st.smarts += 30; try { return await cv0.apply(this, arguments); } finally { if (bonus) p.st.smarts -= 30; } }; }
  // a top degree pays like one
  var hire = G.career.hire;
  G.career.hire = function (j) {
    var r = hire.apply(this, arguments), p = P(), e = p.edu, job = p.job;
    if (job && !j.pt) {
      var old = (e.tier && e.deg >= 4) ? 1 + (e.tier - 3) * .09 + (e.deg >= 5 ? .08 : 0) : 1;
      var nw = (e.tier && e.deg >= 4) ? 1 + (e.tier - 3) * .2 + (e.deg >= 5 ? .15 : 0) + (e.deg >= 6 ? .3 : 0) : 1;
      var f = nw / old;
      if (p.flags.hotMajor && j.maj && j.maj.indexOf(p.flags.hotMajor) >= 0) f *= 1.15;
      if (p.flags.exch && ['biz', 'tech', 'law', 'fin'].indexOf(j.cat) >= 0) { f *= 1.1; G.log('外企很看重你的交换经历。|Multinationals valued your exchange semester.'); }
      job.sal = Math.round(job.sal * f);
    }
    return r;
  };
  // sit another country's university exam
  var ue = G.EV.sys_uni_exam;
  if (ue) ue.o.splice(2, 0, { t: '参加其他国家的升学考试|Sit another country\'s entrance exam', run: async function (c) {
    var cs = G.CLIST.filter(function (x) { return x !== c.p.country; });
    var ci = await G.UI.pick({ title: G.L('考哪个国家的？|Which country\'s exam?'), items: cs.map(function (x) { return { t: G.C[x].n, sub: G.eduSys(x).ue, icon: G.C[x].flag }; }), noCancel: 1 });
    var to = cs[ci < 0 ? 0 : ci], ex = G.eduSys(to).ue;
    var r = await c.game('exam', { name: ex }), sc = Math.max(0, SC.examScore(r.score) - (c.p.langs.indexOf(G.C[to].lang) >= 0 ? 0 : 8));
    G.log('你的{ex}成绩：{s}分。|Your {ex} score: {s}.', { ex: ex, s: sc });
    var ab = SC.uniChoices(sc, to);
    var ui = await G.UI.pick({ title: G.L('选择大学|Choose a University'), items: ab.map(function (u) { return { t: u.n, sub: G.L('{t}星 · {c}|{t}★ · {c}', { t: u.t, c: SC.chLabel(u.ch) }), icon: '🏛️' }; }), noCancel: 1 });
    var u2 = ab[ui < 0 ? 0 : ui];
    if (!G.ch(u2.ch)) { c.p.edu.stage = 'done'; c.add('happy', -8); return G.L('{n}没有录取你。|{n} turned you down.', { n: u2.n }); }
    var mj = await SC.pickMajor(c); SC.admit(u2, mj); SC.payTuition(SC.tuition(to, true)); c.add('happy', 10);
    return G.L('你考上了{n}！|You got into {n}!', { n: u2.n });
  } });
  // good grades: recommended for grad school, and you can change universities
  var gr = G.EV.sys_graduate;
  if (gr) gr.o.splice(1, 0, { t: '成绩优异：保送/申请名校研究生|Top grades: fast-track to a top grad school', if: function (c) { return c.p.edu.deg === 4 && c.p.edu.perf >= 75; }, run: async function (c) {
    var e = c.p.edu, maxT = Math.min(5, (e.tier || 3) + (e.perf >= 90 ? 2 : 1)), pool = [];
    [c.p.country].concat(['us', 'gb', 'ch', 'sg', 'de', 'fr', 'jp', 'ca', 'au'].filter(function (x) { return x !== c.p.country; })).forEach(function (cid) { G.eduSys(cid).u.filter(function (u) { return u.t <= maxT && u.t >= 3; }).forEach(function (u) { pool.push({ n: u.n, t: u.t, cid: cid }); }); });
    pool.sort(function (a, b) { return b.t - a.t; }); pool = pool.slice(0, 16);
    var i = await G.UI.pick({ title: G.L('选择研究生院|Choose a Graduate School'), text: G.L('你的成绩{p}分，可以申请这些学校。|With grades of {p}, you can apply to these.', { p: Math.round(e.perf) }), items: pool.map(function (u) { return { t: u.n, sub: G.C[u.cid].flag + ' ' + '★★★★★'.slice(0, u.t), icon: '🎓' }; }) });
    if (i < 0) return '你决定先不读了。|You decided not to go on for now.';
    var u = pool[i], ch = G.clamp(.45 + (e.perf - 75) / 40 + ((e.tier || 3) - u.t) * .12, .2, .97);
    if (!G.ch(ch)) return G.L('{n}没有录取你，你只好先去找工作。|{n} didn\'t take you, so you went job-hunting.', { n: u.n });
    e.stage = 'master'; e.grade = 0; e.school = u.n; e.tier = u.t; e.q = u.t; e.abroad = u.cid !== c.p.country ? u.cid : null; if (e.abroad) c.p.flags.abroad = u.cid;
    SC.payTuition(SC.tuition(u.cid, !!e.abroad)); c.add('happy', 10); G.major('考入{s}读研|Began a master\'s at {s}', { s: u.n });
    return G.L('你被{n}录取，开始读研究生！|{n} admitted you for a master\'s!', { n: u.n });
  } });

  /* =============================================================
     9. Your company, run properly
     ============================================================= */
  function co() { return S().assets.company; }
  function cq(a, t, fx, prm) { return G.quick(a, G.L(t, prm), fx || {}); }
  (G.ACT_BIZ || []).push(
    { id: 'co_rnd', n: '研发新产品|Develop a New Product', i: '🧪', e: 20, run: function (a) { var c = co(), w = G.ch(.45 + P().st.smarts / 400 + (G.has('biz') ? .1 : 0)); c.val = Math.round(c.val * (w ? G.rf(1.15, 1.5) : .92)); return cq(a, w ? '新产品一上市就卖断了货！公司估值{v}。|The new product sold out on launch! Valuation: {v}.' : '新产品反响平平，研发费打了水漂。|The new product flopped; the R&D money is gone.', w ? { happy: 6 } : { stress: 6 }, { v: G.M(c.val) }); } },
    { id: 'co_intl', n: '开拓海外市场|Expand Overseas', i: '🌍', e: 25, if: function () { return !co().intl; }, run: function (a) { var c = co(), w = G.ch(.5 + P().st.eq / 400 + (P().langs.length > 1 ? .1 : 0)); if (w) { c.intl = 1; c.val = Math.round(c.val * 1.4); } else c.val = Math.round(c.val * .88); return cq(a, w ? '你们在海外站稳了脚跟，公司成了跨国企业。|You gained a foothold abroad. The company is now multinational.' : '水土不服，海外业务亏了一大笔。|It didn\'t translate; the overseas venture lost heavily.', w ? { fame: 3 } : { stress: 8 }); } },
    { id: 'co_buy', n: '收购竞争对手|Acquire a Rival', i: '🦈', e: 20, run: function (a) { var c = co(), cost = Math.round(c.val * .2); if (P().money < cost) return cq(a, '收购需要现金{m}，你的钱不够。|An acquisition needs {m} in cash. You don\'t have it.', null, { m: G.M(cost) }); G.addMoney(-cost); var w = G.ch(.62); c.val = Math.round(c.val * (w ? 1.4 : 1.05) + cost); c.emp = Math.round(c.emp * 1.3); return cq(a, w ? '整合顺利，你们成了行业老大。|The merger went smoothly — you\'re now the industry leader.' : '收购后两家公司的人一直在内斗。|After the merger, the two teams never stopped fighting.', w ? { fame: 4 } : { stress: 6 }); } },
    { id: 'co_ceo', n: '聘请职业经理人|Hire a Professional CEO', i: '👔', e: 5, if: function () { return !co().ceo; }, run: function (a) { co().ceo = 1; return cq(a, '你请来了一位业内有名的CEO。从此公司不用你天天盯着了。|You hired a well-known CEO. You no longer have to watch the company every day.', { stress: -10 }); } },
    { id: 'co_ceo_off', n: '解聘职业经理人|Let the CEO Go', i: '🚪', e: 5, if: function () { return !!co().ceo; }, run: function (a) { co().ceo = 0; return cq(a, '你重新亲自掌舵。|You took the helm again yourself.', {}); } },
    { id: 'co_back', n: '回购股份|Buy Back Shares', i: '📈', e: 10, if: function () { return co().own < .99; }, run: function (a) { var c = co(), step = Math.min(.1, 1 - c.own), cost = Math.round(c.val * step * 1.1); if (P().money < cost) return cq(a, '回购10%股份需要{m}。|Buying back 10% costs {m}.', null, { m: G.M(cost) }); G.addMoney(-cost); c.own = Math.min(1, c.own + step); return cq(a, '你回购了股份，现在持股{o}%。|You bought back shares; you now own {o}%.', {}, { o: Math.round(c.own * 100) }); } },
    { id: 'co_ipo', n: '申请上市|Apply for an IPO', i: '🔔', e: 15, if: function () { return !co().ipo && co().val > G.$(3e7); }, run: function (a) { var c = co(); if (!G.ch(.55 + (c.val > G.$(8e7) ? .25 : 0))) return cq(a, '交易所没有通过你们的上市申请。|The exchange rejected your listing.', { stress: 8 }); c.ipo = true; c.val = Math.round(c.val * G.rf(1.3, 2.2)); var cash = Math.round(c.val * c.own * .15); c.own *= .8; G.addMoney(cash); G.major('{n}上市|{n} went public', { n: c.name }); return cq(a, '敲钟那一刻，你的身家翻了几倍。|When the bell rang, your fortune multiplied.', { fame: 12, happy: 15 }); } },
    { id: 'co_give', n: '公司做公益|Corporate Philanthropy', i: '🤲', e: 10, run: function (a) { var c = co(), cost = Math.round(c.val * .01); if (P().money < cost) return cq(a, '需要现金{m}。|You need {m} in cash.', null, { m: G.M(cost) }); G.addMoney(-cost); return cq(a, '你们捐建了十所乡村学校。|You funded ten rural schools.', { karma: 8, fame: 3, happy: 4 }); } },
    { id: 'co_cut', n: '裁员降本|Cut Costs with Layoffs', i: '✂️', e: 10, run: function (a) { var c = co(); c.val = Math.round(c.val * 1.06); c.emp = Math.max(1, Math.round(c.emp * .8)); return cq(a, '利润上去了，但网上骂声一片。|Profits rose, and the internet hated you for it.', { karma: -6, fame: -2 }); } }
  );
  var bt2 = G.biz.tick;
  G.biz.tick = function (Q) { var c = co(); if (c && c.ceo) { c.eff = (c.eff || 0) + 2; var fee = Math.round(Math.max(0, c.val) * .01); if (G.fin) G.fin.tag = G.L('职业经理人薪酬|CEO pay'); G.addMoney(-Math.min(fee, Math.max(0, P().money))); if (G.fin) G.fin.tag = null; } if (c && c.intl) c.val = Math.round(c.val * 1.03); return bt2.apply(this, arguments); };

  /* =============================================================
     10. A space programme of your own, and child stars
     ============================================================= */
  function space(id, n, i, y0, cost, hp, run) { return { id: id, n: n, i: i, e: 25, a: [18, 85], era: null, if: function () { return S().year >= y0; }, run: async function (a) { var p = P(), m = G.$(cost); if (p.st.health < hp) return G.result(a.n, '体检没通过：需要健康{h}%以上。|You failed the medical: health above {h}% required.', { h: hp }, [], a.i); if (!G.pay(m)) return G.result(a.n, '这趟旅程要{m}，你付不起。|This trip costs {m}. You can\'t afford it.', { m: G.M(m) }, [], a.i); G.inc('space'); return run(a); } }; }
  G.ACT_CATS.push({ id: 'space', n: '太空旅行|Space Travel', i: '🚀', items: [
    space('sp_zerog', '失重飞机体验|Zero-G Flight', '🪂', 2004, 8000, 40, function (a) { return G.quick(a, '飞机俯冲的那二十秒，你像宇航员一样飘了起来。|For twenty seconds of each dive, you floated like an astronaut.', { happy: 12 }); }),
    space('sp_sub', '亚轨道太空飞行|Suborbital Spaceflight', '🛸', 2021, 450000, 55, function (a) { return G.quick(a, '你越过了卡门线，看见了地球弯曲的边缘。|You crossed the Kármán line and saw the curve of the Earth.', { happy: 25, fame: 6 }); }),
    space('sp_iss', '空间站十日游|Ten Days on the Space Station', '🛰️', 2001, 55000000, 65, function (a) { G.major('登上国际空间站|Flew to the space station'); return G.quick(a, '你在空间站上看了十六次日出。回来以后，你很久都不习惯走路。|You watched sixteen sunrises a day from the station. Back home, walking felt strange for weeks.', { happy: 35, fame: 15, smarts: 3 }); }),
    space('sp_moon', '绕月飞行|A Voyage Around the Moon', '🌕', 2030, 200000000, 70, function (a) { G.major('绕月飞行|Flew around the Moon'); return G.quick(a, '月球背面从舷窗外缓缓转过。全人类只有几十个人见过这一幕。|The far side of the Moon slid past the window — a sight only a few dozen humans have ever seen.', { happy: 45, fame: 25 }); }),
    space('sp_mars', '火星殖民船船票|A Ticket on the Mars Colony Ship', '🔴', 2045, 500000000, 75, function (a) { G.major('启程前往火星|Left for Mars'); return G.quick(a, '你成了第一批火星居民。地球在舷窗里变成了一颗蓝色的星星。|You became one of the first Martians. Earth shrank to a blue star in the window.', { happy: 50, fame: 40 }); })
  ] });
  var tsp = item('tr_space'); if (tsp) { var tc = cat('travel'); tc.items = tc.items.filter(function (x) { return x.id !== 'tr_space'; }); }
  function starFam() { var p = P(); return p.origin === 'celebrity' || p.flags.starfam || N.rel('father', 'mother').some(function (n) { return /明星|演员|影帝|影后|歌手|Star|Actor|Actress|Singer/.test(G.T(n.job || '')); }); }
  G.ACT_CATS.push({ id: 'kidstar', n: '童星|Child Star', i: '🎬', items: [
    { id: 'kid_film', n: '拍电影|Act in a Film', i: '🎬', e: 20, a: [4, 17], if: starFam, run: async function (a) { var p = P(), fee = G.$(G.ri(30, 300) * 1000 * (1 + p.st.looks / 120) * (G.has('actor') ? 1.6 : 1)); var hit = G.ch(.2 + p.st.looks / 400 + (G.has('actor') ? .2 : 0)); G.dStart(); if (G.fin) G.fin.tag = G.L('片酬|Acting fees'); G.addMoney(fee); if (G.fin) G.fin.tag = null; G.addStat('fame', hit ? 10 : 3); G.addStat('happy', 4); p.flags.kidStar = 1; var dl = G.dEnd(); return G.result(a.n, hit ? '电影大卖，你成了全国最有名的童星！|The film was a smash and you became the country\'s most famous child star!' : '你演了一个小角色，片场的叔叔阿姨都很喜欢你。|You played a small part; everyone on set adored you.', null, dl, a.i); } },
    { id: 'kid_ad', n: '拍广告|Shoot a Commercial', i: '📺', e: 10, a: [2, 17], if: starFam, run: async function (a) { var p = P(), fee = G.$(G.ri(5, 60) * 1000 * (1 + p.st.looks / 100)); G.dStart(); if (G.fin) G.fin.tag = G.L('广告费|Commercial fees'); G.addMoney(fee); if (G.fin) G.fin.tag = null; G.addStat('fame', 2); var dl = G.dEnd(); return G.result(a.n, '你在镜头前笑得特别甜。|You smiled sweetly for the camera.', null, dl, a.i); } }
  ] });
  // conscription only where it exists (you may have moved country since it was queued)
  var cs = G.EV.sys_conscript; if (cs) { var cp = cs.prep; cs.prep = function (c) { if (!G.C[c.p.country].consc) return false; return cp ? cp.apply(this, arguments) : undefined; }; }
})();
