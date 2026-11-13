/* Batch 13 (version 1.5): the police ranks done properly (China: from Constable 2nd Class up to Commissioner
   General), undercover work that really pays, an intelligence service that recruits you when you are broke,
   getting a child out of prison through connections or money, three new dynasties, and many more things to do. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function R2(s) { return s.split(','); }

  /* ================= police ranks ================= */
  var POL_CN = R2('二级警员|Constable 2nd Class,一级警员|Constable 1st Class,三级警司|Sergeant 3rd Class,二级警司|Sergeant 2nd Class,一级警司|Sergeant 1st Class,三级警督|Inspector 3rd Class,二级警督|Inspector 2nd Class,一级警督|Inspector 1st Class,三级警监|Superintendent 3rd Class,二级警监|Superintendent 2nd Class,一级警监|Superintendent 1st Class,副总警监|Deputy Commissioner General,总警监|Commissioner General');
  var PAY_CN = [42000, 46000, 52000, 58000, 65000, 74000, 84000, 96000, 112000, 130000, 152000, 180000, 220000];
  var POL_GEN = G.POLICE.r.concat(['全国警察总监|National Police Commissioner']);
  var PAY_GEN = G.POLICE.pay.concat([280000]);
  function cnPol() { var s = S(); return !!(s && s.p && s.p.country === 'cn'); }
  Object.defineProperty(G.POLICE, 'r', { configurable: true, get: function () { return cnPol() ? POL_CN : POL_GEN; } });
  Object.defineProperty(G.POLICE, 'pay', { configurable: true, get: function () { return cnPol() ? PAY_CN : PAY_GEN; } });
  G.police.tick = function (Q) {
    var p = P(), o = p.pol; if (!o) return;
    o.yrs++; o.yr++;
    o.merit += G.ri(1, 6) + (G.has('justice') ? 2 : 0);
    if (G.ch(.55)) Q.push({ id: G.pick(['sys_case', 'sys_case', 'sys_raid', 'sys_bribe']) });
    var top = G.POLICE.r.length - 1, need = 1 + Math.floor(o.rank / 4), bar = 8 + o.rank * 6;
    if (o.rank >= top - 1) bar += 30; // the very top takes a career of distinction
    if (o.rank < top && o.yr >= need && o.merit >= bar) Q.push({ id: 'sys_assess', prm: { k: 'pol' } });
    var ret = G.C[p.country].retire || 60; if (p.age >= ret) Q.push({ id: 'sys_retire' });
  };
  // undercover work: one success is worth years of patrols
  G.ACT_POL && G.ACT_POL.forEach(function (a) {
    if (a.id !== 'undercover') return;
    a.run = async function (act) {
      var r = await G.UI.game('fight', { name: act.n });
      if (G.ch(.06)) { G.die('卧底身份暴露，壮烈牺牲|Killed in the line of duty while undercover'); return; }
      var o = P().pol;
      if (r.score > .45) {
        var gain = G.ri(45, 70); o.merit += gain; G.addStat('fame', 5); G.addMoney(G.$(G.ri(5, 15) * 1000));
        G.major('卧底行动立大功|Decorated for an undercover operation');
        return G.result(act.n, '你潜伏数月，一举端掉了整个犯罪团伙！功绩+{g}。|After months undercover you brought down the whole ring! Merit +{g}.', { g: gain }, [], act.i);
      }
      o.merit += 8;
      return G.result(act.n, '你差点暴露，只好提前撤出。但带回的情报仍有价值，功绩+8。|You nearly blew your cover and pulled out — but the intel still counts. Merit +8.', null, [], act.i);
    };
  });

  /* ================= the intelligence service ================= */
  var SPY = R2('外围线人|Informant,见习特工|Trainee Agent,特工|Field Agent,高级特工|Senior Agent,行动组长|Operations Lead,情报站站长|Station Chief,情报局副局长|Deputy Director of Intelligence,情报局局长|Director of Intelligence');
  var SPY_PAY = [12000, 30000, 48000, 70000, 95000, 130000, 180000, 250000];
  G.SPY = SPY;
  function spyPromote() { var s = P().spy; if (s.rank >= SPY.length - 1) return; s.rank++; s.merit = Math.round(s.merit * .35); G.major('晋升为{r}|Promoted to {r}', { r: SPY[s.rank] }); G.inc('promos'); }
  G.evs([
    { id: 'spy_recruit', sys: 1, title: '一个陌生人|A Stranger', icon: '🕵️',
      t: '你走投无路的时候，一个穿风衣的人在面馆坐到你对面：“我们观察你很久了。有一份工作，薪水不错，只是不能告诉任何人。”|At your lowest point, a man in a trench coat sits across from you in a noodle shop: "We\'ve been watching you. There\'s a job. The pay is good — but you can tell no one."',
      o: [{ t: '接受|Accept', run: function (c) { var p = c.p; p.spy = { rank: 0, merit: 0, yrs: 0, y: S().year }; G.addMoney(G.$(3000)); G.major('被情报组织招募|Recruited by an intelligence service'); return '他推过来一个信封，里面是一部手机和一叠现金。“等电话。”|He slid over an envelope: a phone and a stack of cash. "Wait for the call."'; } },
        { t: '拒绝|Decline', run: function () { return '他留下一张只有电话号码的名片，起身走了。|He left a card with only a phone number on it, and walked away.'; } }] },
    { id: 'spy_burned', sys: 1, title: '身份暴露|Cover Blown', icon: '🚨', bad: 1,
      t: '你的身份暴露了，对方的人已经在找你。|Your cover is blown, and the other side is looking for you.',
      o: [{ t: '连夜撤离|Get out tonight', run: function (c) { c.p.spy.merit = Math.max(0, c.p.spy.merit - 20); c.add('stress', 20); return '你换了三次车，终于回到了安全屋。|You changed cars three times and made it to the safe house.'; } },
        { t: '将计就计|Turn it to your advantage', run: function (c) { if (G.ch(.45 + c.p.st.smarts / 300)) { c.p.spy.merit += 40; return '你给对方喂了假情报，反而立了大功。|You fed them false intelligence and earned great credit.'; } G.crime.jail(G.ri(3, 8), '间谍罪|Espionage'); return '你被捕了。|You were arrested.'; } }] }
  ]);
  G.ACT_CATS.push({ id: 'spy', n: '情报工作|Intelligence Work', i: '🕵️', items: [
    { id: 'spy_intel', n: '收集情报|Gather Intelligence', i: '📂', e: 10, a: [18, 80], if: function () { return !!P().spy; },
      run: async function (a) { var s = P().spy, g = G.ri(6, 12); s.merit += g; return G.quick(a, G.L('你在咖啡馆坐了一下午，记下了每一个进出的人。功绩+{g}。|You spent an afternoon in a café, noting everyone who came and went. Merit +{g}.', { g: g }), { smarts: 1 }); } },
    { id: 'spy_turn', n: '策反目标|Recruit an Asset', i: '🤝', e: 20, a: [20, 80], if: function () { return !!P().spy && P().spy.rank >= 1; },
      run: async function (a) { var s = P().spy, p = P(); if (G.ch(.35 + p.st.eq / 200)) { var g = G.ri(25, 40); s.merit += g; return G.quick(a, G.L('对方终于点头了。你多了一条线人。功绩+{g}。|They finally agreed. You have a new source. Merit +{g}.', { g: g }), { eq: 2 }); } return G.quick(a, G.L('对方起了疑心，你只好断了联系。|They grew suspicious; you cut contact.'), { stress: 6 }); } },
    { id: 'spy_op', n: '执行潜伏任务|Deep-Cover Mission', i: '🎭', e: 30, a: [20, 70], if: function () { return !!P().spy && P().spy.rank >= 2; },
      run: async function (a) {
        var r = await G.UI.game('fight', { name: a.n }), s = P().spy;
        if (G.ch(.04)) { G.die('潜伏任务中牺牲|Killed on a deep-cover mission'); return; }
        if (G.ch(.07 * (1.3 - r.score))) { S().pendQ = S().pendQ || []; S().pendQ.push({ id: 'spy_burned' }); return G.quick(a, G.L('任务出了岔子……|Something went wrong on the mission…'), { stress: 10 }); }
        var g = G.ri(50, 80); s.merit += g; G.addMoney(G.$(G.ri(10, 40) * 1000));
        return G.quick(a, G.L('你在敌后潜伏了半年，带回了一份改变局势的情报。功绩+{g}。|You spent six months behind the lines and brought back intelligence that changed everything. Merit +{g}.', { g: g }), { fame: 0, smarts: 2 });
      } },
    { id: 'spy_quit', n: '退出情报组织|Leave the Service', i: '🚪', e: 0, a: [18, 120], if: function () { return !!P().spy; },
      run: async function (a) { if (!(await G.UI.confirm(G.L(a.n), G.L('退出后不能再回来。确定吗？|There\'s no coming back. Sure?')))) return 'cancel'; var r = SPY[P().spy.rank]; P().spy = null; P().flags.exSpy = 1; return G.quick(a, G.L('你交回了证件。从此，你只是一个普通人。（最后职务：{r}）|You handed back your credentials. From now on, you\'re just an ordinary person. (Last post: {r})', { r: r }), { stress: -10 }); } }
  ] });
  var title13 = G.title;
  G.title = function () { var p = P(); if (p.spy && !S().dead && !p.jail) return SPY[p.spy.rank]; return title13.apply(this, arguments); };

  /* ================= three new dynasties ================= */
  [
    { id: 'oil', n: '石油大亨家族|Oil Dynasty', d: '祖父在沙漠里打出了第一口油井，家族的财富从那天起就没停过。|Your grandfather struck oil in the desert, and the family fortune has flowed ever since.', vip: 0,
      w: [20000000, 200000000], inc: [2000000, 10000000], job: ['石油集团董事长|Oil Group Chairman', '能源集团总裁|Energy Group President'], st: { eq: 4 }, sib: [1, 3], fl: ['rich'] },
    { id: 'luxury', n: '奢侈品世家|Luxury House Family', d: '家族的品牌已经传了一百五十年，门店开在全世界最贵的街上。|The family brand is 150 years old, with boutiques on the world\'s most expensive streets.', vip: 0,
      w: [10000000, 120000000], inc: [1500000, 6000000], job: ['奢侈品集团掌门人|Head of a Luxury Group', '品牌创意总监|Creative Director'], st: { looks: 8, eq: 4 }, sib: [0, 2], fl: ['rich'] },
    { id: 'shipping', n: '航运世家|Shipping Dynasty', d: '家族的船队跑遍了全世界的港口，你从小在码头上看集装箱长大。|The family fleet sails to every port on earth; you grew up watching containers on the docks.', vip: 0,
      w: [15000000, 150000000], inc: [1500000, 8000000], job: ['航运集团主席|Shipping Group Chairman', '船队总经理|Fleet Managing Director'], st: { health: 3, eq: 5 }, sib: [0, 2], fl: ['rich'] }
  ].forEach(function (o) { if (!G.ORIGIN[o.id]) { G.ORIGINS.push(o); G.ORIGIN[o.id] = o; } });
  var fc13 = G.famClass;
  if (fc13) G.famClass = function () { var c = fc13.apply(this, arguments), p = S() && S().p; if (p && ['oil', 'luxury', 'shipping'].indexOf(p.origin) >= 0) c = Math.max(c, 3); return c; };
  function OE(id, org, a, title, icon, t, o, x) { x = x || {}; var f = x.if; x.if = function (S2, p) { return p.origin === org && !p.flags.heir && (!f || f(S2, p)); }; if (x.w == null) x.w = 2.6; return E(id, a, title, icon, t, o, x); }

  /* ================= getting a child out of prison ================= */
  G.influence = function () {
    var p = P(), why = [];
    if (p.pol && p.pol.rank >= (cnPol() ? 7 : 5)) why.push(G.T(G.POLICE.r[p.pol.rank]));
    if (p.mil && p.mil.off && p.mil.rank >= 5) why.push(G.T(G.MIL.off[p.mil.rank]));
    if (p.spy && p.spy.rank >= 4) why.push(G.T(SPY[p.spy.rank]));
    if (p.origin === 'red' || p.origin === 'mafia') why.push(G.T(G.ORIGIN[p.origin].n));
    if (p.st.fame >= 70) why.push(G.T('名声{f}|Fame {f}', { f: p.st.fame }));
    if (G.netWorth() >= G.$(2e7)) why.push(G.T('身家过亿|Great wealth'));
    if (p.flags.monarch) why.push(G.T('王室|Royalty'));
    return why;
  };
  var acts13 = G.npcActs;
  G.npcActs = function (n) {
    var out = acts13.apply(this, arguments) || [];
    if (n.rel === 'child' && n.alive && n.jail) {
      out.unshift({ id: 'kbail', n: '赎人|Get Them Out', i: '🔓', e: 10,
        run: async function (k, act) {
          var inf = G.influence(), bail = G.$(G.ri(5, 12) * 10000 * Math.max(1, k.jail.yrs)), lawyer = G.$(200000);
          var i = await G.UI.pick({ title: G.L('把{n}捞出来|Get {n} Out', { n: k.name }), text: G.L('{n}还要服刑{y}年。|{n} has {y} years left to serve.', { n: k.name, y: Math.max(1, k.jail.y + k.jail.yrs - S().year) }),
            items: [
              { t: G.L('托关系|Pull strings'), sub: inf.length ? G.L('你的分量：{w}|Your leverage: {w}', { w: inf.join('、') }) : G.L('需要：警衔一级警督以上 / 上校以上军衔 / 情报站站长以上 / 红色或黑道家族 / 名声70以上 / 身家2000万美元以上|Requires: senior police rank / Colonel or above / Station Chief or above / a red or underworld family / fame 70+ / $20M+'), icon: '🤝', dis: !inf.length },
              { t: G.L('交保释金和赔偿（{m}）|Pay bail and compensation ({m})', { m: G.M(bail) }), sub: G.L('有一半机会减刑一半|Half the time, the sentence is halved'), icon: '💰', dis: !G.canPay(bail) },
              { t: G.L('请顶级律师上诉（{m}）|Appeal with a top lawyer ({m})', { m: G.M(lawyer) }), sub: G.L('约四成机会改判释放|About a 40% chance of release'), icon: '⚖️', dis: !G.canPay(lawyer) }
            ] });
          if (i < 0) return 'cancel';
          function free(t) { k.jail = null; k.job = '待业|Between Jobs'; k.unemp = 1; G.dStart(); G.dPush('aff', N.addAff(k, 15)); var dl = G.dEnd(); G.npcStory && G.npcStory(k, '提前出狱。|Released early.'); return G.result(act.n, t, { n: k.name }, dl, act.i); }
          if (i === 0) { if (G.ch(.85)) { G.addStat('karma', -3); return free('打了几个电话之后，{n}第二天就出来了。|A few phone calls later, {n} walked out the next day.'); } return G.result(act.n, '这次对方不买账。|This time, nobody would budge.', null, [], act.i); }
          if (i === 1) { G.pay(bail); if (G.ch(.5)) { k.jail.yrs = Math.max(0, Math.ceil(k.jail.yrs / 2)); if (k.jail.y + k.jail.yrs <= S().year) return free('{n}获得减刑，提前出狱了。|{n}\'s sentence was cut; released early.'); return G.result(act.n, '{n}获得减刑一半。|{n}\'s sentence was halved.', { n: k.name }, [], act.i); } return G.result(act.n, '钱交了，但法院没有采纳。|You paid, but the court wasn\'t moved.', null, [], act.i); }
          G.pay(lawyer); if (G.ch(.4)) return free('上诉成功，{n}被改判释放！|The appeal succeeded — {n} is free!');
          return G.result(act.n, '上诉被驳回。|The appeal was rejected.', null, [], act.i);
        } });
    }
    return out;
  };

  /* ================= many more everyday things to do ================= */
  function life(id, n, i, e, a, run, x) { var o = { id: id, n: n, i: i, e: e, a: a, run: run }; if (x) Object.assign(o, x); return o; }
  G.ACT_CATS.push({ id: 'life', n: '生活百态|Life\'s Little Things', i: '🌼', items: [
    life('cook', '学做一道新菜|Learn a New Dish', '🍳', 8, [12, 110], async function (a) { return G.quick(a, G.L(G.pick(['你做的红烧肉第一次成功了，全家抢着吃。|Your braised pork finally worked; the family fought over it.', '蛋糕塌了，但味道还不错。|The cake collapsed, but it tasted fine.', '你学会了一道外国菜，朋友们都夸你。|You learned a foreign dish; friends were impressed.'])), { happy: 4, health: 1 }); }),
    life('adopt_pet', '领养一只宠物|Adopt a Pet', '🐶', 10, [8, 100], async function (a) {
      var i = await G.UI.pick({ title: G.L('领养什么？|Adopt what?'), items: [{ t: G.L('小狗|A puppy'), icon: '🐶' }, { t: G.L('小猫|A kitten'), icon: '🐱' }, { t: G.L('兔子|A rabbit'), icon: '🐰' }, { t: G.L('鹦鹉|A parrot'), icon: '🦜' }] });
      if (i < 0) return 'cancel'; var k = ['dog', 'cat', 'rabbit', 'parrot'][i]; P().pet = { k: k, y: S().year };
      return G.quick(a, G.L('你把它抱回了家。从此家里多了一个成员。|You brought it home. The family has a new member.'), { happy: 8 });
    }, { if: function () { return !P().pet; } }),
    life('pet_play', '陪宠物玩|Play with Your Pet', '🐾', 5, [8, 110], async function (a) { return G.quick(a, G.L('它蹭着你的手，把一天的烦恼都蹭没了。|It nuzzled your hand and rubbed the day\'s worries away.'), { happy: 5, stress: -5 }); }, { if: function () { return !!P().pet; } }),
    life('garden', '养花种菜|Grow Flowers and Vegetables', '🌱', 6, [10, 110], async function (a) { return G.quick(a, G.L('阳台上的小番茄红了。|The balcony tomatoes turned red.'), { happy: 4, health: 1 }); }),
    life('photo', '街头摄影|Street Photography', '📷', 8, [12, 100], async function (a) { var f = G.ch(.08); return G.quick(a, G.L(f ? '你拍的一张照片在网上火了！|One of your photos went viral!' : '你拍下了城市里一个安静的瞬间。|You caught a quiet moment in the city.'), f ? { happy: 6, fame: 4 } : { happy: 4 }); }),
    life('museum', '逛博物馆|Visit a Museum', '🏛️', 6, [6, 110], async function (a) { return G.quick(a, G.L('你在一幅画前站了很久。|You stood before one painting for a long time.'), { smarts: 2, happy: 2 }); }),
    life('concert', '看一场演唱会|Go to a Concert', '🎤', 8, [12, 90], async function (a) { var m = G.$(150); if (!G.pay(m)) return 'cancel'; return G.quick(a, G.L('全场大合唱的时候，你的眼眶湿了。|When the whole crowd sang along, your eyes welled up.'), { happy: 8 }); }),
    life('board', '和朋友玩桌游|Board Games with Friends', '🎲', 6, [8, 100], async function (a) { N.rel('friend').slice(0, 3).forEach(function (n) { N.addAff(n, 3); }); return G.quick(a, G.L('你们玩到半夜，笑得肚子疼。|You played past midnight and laughed until it hurt.'), { happy: 6, eq: 1 }); }),
    life('karaoke', '去唱K|Karaoke Night', '🎶', 6, [14, 90], async function (a) { return G.quick(a, G.L('你唱了一首老歌，全包厢都跟着唱。|You sang an old song, and the whole room joined in.'), { happy: 6, stress: -6 }); }),
    life('stars', '去郊外看星星|Stargazing', '🌌', 8, [8, 110], async function (a) { return G.quick(a, G.L('银河横过头顶，你第一次觉得自己很小，也很幸运。|The Milky Way stretched overhead; you felt small, and lucky.'), { happy: 6, health: 1 }); }),
    life('walk', '城市漫步|A Walk Through the City', '🚶', 4, [8, 110], async function (a) { return G.quick(a, G.L(G.pick(['你发现了一家开了三十年的老面馆。|You found a noodle shop that\'s been open thirty years.', '你在一条小巷里看到了一面很美的涂鸦墙。|You found a beautiful mural in a back alley.', '你在河边看了一场日落。|You watched a sunset by the river.'])), { happy: 3, health: 1 }); }),
    life('diary', '写日记|Write in Your Diary', '📔', 3, [8, 110], async function (a) { return G.quick(a, G.L('你把今年的事写了下来。有些事写着写着就想通了。|You wrote down the year. Some things made sense once written.'), { eq: 2, stress: -4 }); }),
    life('volunteer', '做义工|Volunteer', '🙋', 10, [12, 100], async function (a) { return G.quick(a, G.L('你在社区食堂帮了一整天忙。|You spent the whole day helping at the community kitchen.'), { karma: 5, happy: 3 }); }),
    life('makeover', '换个新造型|A New Look', '💇', 5, [14, 90], async function (a) { var m = G.$(80); if (!G.pay(m)) return 'cancel'; return G.quick(a, G.L('镜子里的自己，好像换了一个人。|The person in the mirror looked like someone new.'), { looks: 2, happy: 4 }); })
  ] });


  /* ================= skip a generation: continue as a grandchild ================= */
  function parentOf(gk) { return N.all(function (n) { return n.rel === 'child' && (n.kids || []).indexOf(gk.id) >= 0; })[0] || null; }
  G.life.continueAsGrand = function (gk) {
    var s = S(), old = s.p, par = parentOf(gk), sp = N.partner(), inlaw = par && par.spouseId ? s.npcs[par.spouseId] : null;
    var mine = N.all(function (n) { return n.rel === 'child'; }), sibs = N.all(function (n) { return n.rel === 'grandchild' && n !== gk && par && (par.kids || []).indexOf(n.id) >= 0; });
    gk.npcRel = gk.npcRel || {}; if (inlaw) gk.npcRel[inlaw.id] = 1;
    var oldName = old.name, oldBy = old.birthYear, elders = N.all(function (n) { return n.rel === 'father' || n.rel === 'mother' || n.rel === 'sibling' || n.rel === 'grand'; });
    G.life.continueAs(gk);
    elders.forEach(function (n) { if (!s.npcs[n.id]) return; if (!n.alive) { delete s.npcs[n.id]; return; } n.rel = 'kin'; n.kin = 'elder'; });
    N.all(function (n) { return (n.name === oldName && n.by === oldBy) || n === sp; }).forEach(function (n) { n.rel = 'grand'; });
    mine.forEach(function (n) { if (n === par) { n.rel = n.g === 'm' ? 'father' : 'mother'; n.kids = (n.kids || []).filter(function (id) { return id !== gk.id; }); } else { n.rel = 'kin'; n.kin = 'aunt'; } });
    if (inlaw) { inlaw.rel = inlaw.g === 'm' ? 'father' : 'mother'; inlaw.pin = 1; }
    sibs.forEach(function (n) { n.rel = 'sibling'; n.older = n.by < gk.by; });
    var p = s.p; p.partner = null;
    G.log('你跳过一代，以孙辈{n}的身份继续人生。|Skipping a generation, you continue life as your grandchild {n}.', { n: gk.name });
    return s;
  };
  var comp13 = G.ending.compute;
  G.ending.compute = function () {
    var d = comp13.apply(this, arguments), w = P().will, main = w && w.mode === 'one' && w.main && S().npcs[w.main];
    if (main && main.alive && main.rel === 'grandchild') { d.heirs = [{ id: main.id, name: main.name, age: N.age(main), g: main.g, grand: 1 }]; return d; }
    if (!d.heirOnly) N.rel('grandchild').forEach(function (g) { if (!d.heirs.some(function (x) { return x.id === g.id; })) d.heirs.push({ id: g.id, name: g.name, age: N.age(g), g: g.g, grand: 1 }); });
    return d;
  };

  /* ================= stories ================= */
  G.evs([
    OE('or_oil_desert', 'oil', [6, 14], '沙漠里的油井|The Oil Well in the Desert', '🛢️', '爷爷带你去看家族的第一口油井。|Grandpa takes you to see the family\'s first oil well.', [
      O('听爷爷讲当年的故事|Listen to Grandpa\'s stories', R('他说那年他差点渴死在沙漠里。|He said he nearly died of thirst in the desert that year.', { eq: 4, par: 2 })),
      O('爬上井架看风景|Climb the rig for the view', R('风很大，沙丘一直延伸到天边。|The wind howled; the dunes ran to the horizon.', { happy: 5 }))
    ]),
    OE('or_oil_price', 'oil', [25, 65], '油价暴跌|Oil Prices Crash', '📉', '国际油价一夜之间跌了一半。|Oil prices halve overnight.', [
      O('趁低价收购同行|Buy rivals cheaply', RC(.6, '两年后油价回升，家族的版图扩大了一倍。|Two years later prices recovered and the empire had doubled.', { money: 200000, fame: 4 }, '油价一直没回来，你们损失惨重。|Prices never came back; you lost heavily.', { money: -150000, happy: -5 })),
      O('转型新能源|Pivot to renewables', R('你成了家族里第一个造风电场的人。|You became the first in the family to build a wind farm.', { money: 50000, karma: 4 }))
    ]),
    OE('or_lux_show', 'luxury', [10, 18], '后台|Backstage', '👠', '时装周上，你在后台看着模特们换衣服。|At fashion week you watch the models change backstage.', [
      O('偷偷画设计稿|Secretly sketch designs', R('创意总监看了一眼你的画，说：“留着，以后用。”|The creative director glanced at your sketches: "Keep these. We\'ll use them one day."', { smarts: 3, looks: 2 })),
      O('帮模特整理衣服|Help the models dress', R('一个模特送了你一条丝巾。|A model gave you a silk scarf.', { eq: 3 }))
    ]),
    OE('or_lux_fake', 'luxury', [22, 60], '假货|Counterfeits', '🧳', '市面上出现了大量仿冒你家品牌的假货。|Counterfeits of the family brand flood the market.', [
      O('全球打假|Sue worldwide', RC(.6, '你们赢了一连串官司。|You won case after case.', { money: 60000, fame: 3 }, '假货太多，打不完。|There were too many to stop.', { money: -40000 })),
      O('推出平价副线|Launch an affordable line', R('年轻人买得起正品了，假货反而少了。|Young people could afford the real thing; fakes dwindled.', { money: 80000 }))
    ]),
    OE('or_ship_launch', 'shipping', [8, 16], '新船下水|A Ship Is Launched', '🚢', '家族新造的巨轮下水，你被请去砸香槟。|The family\'s new ship is launched, and you\'re asked to break the bottle.', [
      O('用力一砸|Swing hard', R('瓶子碎了，全场欢呼。船以你的名字命名。|The bottle shattered and everyone cheered. The ship bears your name.', { happy: 8, fame: 2 })),
      O('紧张得砸了三次|Need three tries', R('第三次终于碎了，大家笑得很开心。|It finally broke on the third try; everyone laughed.', { happy: 5 }))
    ]),
    OE('or_ship_storm', 'shipping', [25, 65], '风暴中的船队|A Fleet in the Storm', '🌊', '一场风暴困住了家族的三条船。|A storm traps three of the family\'s ships.', [
      O('亲自指挥救援|Direct the rescue yourself', RC(.7, '所有船员都平安回来了。|Every crew member came home safe.', { karma: 6, fame: 4 }, '一条船沉了，所幸没人伤亡。|One ship sank, but no one was hurt.', { money: -100000 })),
      O('交给保险公司|Leave it to the insurers', R('保险赔了钱，但船员们心里有点凉。|Insurance paid out, but the crews felt let down.', { karma: -2 }))
    ]),
    E('a_poor_offer', [20, 50], '走投无路|At the End of the Road', '🌧️', '账户里只剩几十块钱，房东在敲门。|Only a few dollars left, and the landlord is knocking.', [
      O('打电话给家里|Call home', function (c) { var pr = N.rel('father', 'mother').filter(function (n) { return n.wealth > c.$(2000); })[0]; if (pr) { pr.wealth -= c.$(1500); c.money(1500); return '电话那头只说了一句：“缺多少？”|On the line, only: "How much do you need?"'; } return '家里也没有钱了。你挂了电话，在楼道里坐了很久。|They had nothing either. You hung up and sat in the stairwell a long time.'; }),
      O('去打零工|Take odd jobs', R('你搬了一个月的货，熬过了这个冬天。|You hauled boxes for a month and made it through the winter.', { money: 1200, health: -3 }))
    ], { if: function (S2, p) { return p.money < G.$(500) && !p.spy && !p.jail; } }),
    E('m_old_classmate_rich', [35, 60], '发达的老同学|The Classmate Who Made It', '🏎️', '当年坐你后排的同学，现在开着跑车来参加同学会。|The kid who sat behind you now arrives at the reunion in a sports car.', [
      O('真心为他高兴|Be genuinely happy for him', R('他偷偷告诉你：“其中一半是贷款。”|He whispered: "Half of it is on loan."', { happy: 3, eq: 2 })),
      O('暗暗较劲|Quietly compete', R('回家后你失眠了。|You couldn\'t sleep that night.', { stress: 8, perf: 5 }))
    ]),
    E('a_blind_date_parent', [26, 40], '父母安排的相亲|A Date Your Parents Arranged', '☕', '爸妈背着你安排了一场相亲。|Your parents secretly set you up on a blind date.', [
      O('去见一面|Go and meet them', RC(.4, '你们聊得出乎意料地投机。|You got on surprisingly well.', { happy: 6, par: 4 }, '对方全程在看手机。|They looked at their phone the whole time.', { happy: -2, par: 2 })),
      O('拒绝|Refuse', R('妈妈叹了口气：“我们也是为你好。”|Mom sighed: "We only want what\'s best for you."', { par: -3 }))
    ], { if: function () { return !N.partner() && N.rel('father', 'mother').length > 0; } }),
    E('o_letter_from_kid', [60, 100], '孩子的信|A Letter from Your Child', '💌', '你收到了在外地的孩子寄来的一封手写信。|A handwritten letter arrives from one of your children far away.', [
      O('读了一遍又一遍|Read it again and again', R('信的最后写着：“谢谢你把我养大。”|At the end: "Thank you for raising me."', { happy: 8 })),
      O('马上回一封|Write back at once', R('你写了五页，比孩子写得还长。|You wrote five pages — longer than theirs.', { happy: 6, eq: 2 }))
    ], { if: function () { return N.rel('child').some(function (k) { return N.age(k) >= 22; }); } })
  ]);
  // when you are broke, someone notices
  var mt13 = G.money.tick;
  G.money.tick = function () {
    var r = mt13.apply(this, arguments), s = S(), p = s.p;
    if (s.dead) return r;
    if (p.spy) {
      var sp = p.spy; sp.yrs++; sp.merit += G.ri(2, 8);
      if (G.fin) G.fin.tag = G.L('情报工作津贴|Intelligence stipend'); G.addMoney(G.$(SPY_PAY[sp.rank])); if (G.fin) G.fin.tag = null;
      if (sp.merit >= 20 + sp.rank * 15 && sp.rank < SPY.length - 1) spyPromote();
      if (G.ch(.03)) (s.pendQ = s.pendQ || []).push({ id: 'spy_burned' });
    } else if (!p.flags.spyAsked && !p.flags.exSpy && p.age >= 20 && p.age <= 45 && p.money < G.$(800) && !p.pol && !p.mil && !p.jail && G.ch(.35)) {
      p.flags.spyAsked = 1; (s.pendQ = s.pendQ || []).push({ id: 'spy_recruit' });
    }
    return r;
  };
})();
