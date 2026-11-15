/* Life details (version 1.6): partners who forgive because they need you, partners who are simply devoted,
   spouses with secrets of their own, parents who object to a poor match, a family trust you can keep paying into,
   the outdoors done properly (real mountains with Sherpas, your own fish pond), concerts that can end in a
   romance with the star, hobbies that turn professional, names that never repeat, and richer everyday life. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC, LO = G.love;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function q(id, nid, prm) { var s = S(); (s.pendQ = s.pendQ || []).push({ id: id, nid: nid, prm: prm }); }
  function item(id) { var f = null; G.ACT_CATS.forEach(function (c) { c.items.forEach(function (x) { if (x.id === id) f = x; }); }); return f; }
  function cat(id) { return G.ACT_CATS.filter(function (c) { return c.id === id; })[0]; }
  function rich() { return (G.famClass && G.famClass() >= 2) || G.netWorth() > G.$(5e6); }
  function tag(t, fn) { if (G.fin) G.fin.tag = G.L(t); try { fn(); } finally { if (G.fin) G.fin.tag = null; } }

  /* ---------- names never repeat inside one family's world ---------- */
  var gn = G.genName;
  G.genName = function () {
    var r = gn.apply(this, arguments), s = S(); if (!s || !s.npcs) return r;
    var used = {}; N.all().forEach(function (n) { used[String(n.name).split('|')[0]] = 1; }); if (s.p) used[String(s.p.name).split('|')[0]] = 1;
    for (var i = 0; i < 8 && used[String(r.name).split('|')[0]]; i++) r = gn.apply(this, arguments);
    return r;
  };

  /* ---------- a poorer spouse forgives; some even live with it ---------- */
  var ac = G.EV.sys_affair_caught;
  if (ac) ac.o.unshift({ t: '什么也不用做|Do nothing', if: function () { var sp = N.spouse(); return sp && Math.max(0, sp.wealth || 0) < Math.max(0, G.netWorth()) * .5; }, run: function (c) {
    var sp = N.spouse(); N.addLove(sp, -8);
    if (G.ch(.35)) { c.npc.coexist = 1; return '{s}沉默了几天，然后若无其事地给{n}也盛了一碗汤。从此家里多了一副碗筷。|{s} was silent for a few days — then calmly ladled a bowl of soup for {n} too. There\'s an extra place at the table now.'; }
    return '{s}哭了一晚，第二天照常给你做早饭，一个字也没提离婚。|{s} cried all night, made your breakfast the next morning as usual, and never said a word about divorce.';
  } });

  /* ---------- devoted partners: you only find out once you date them ---------- */
  var mr = N.mkRomantic;
  if (mr) N.mkRomantic = function () { var n = mr.apply(this, arguments); if (n && G.ch(.09)) n.pure = 1; return n; };
  var na = G.npcActs;
  G.npcActs = function (n) {
    var out = na.apply(this, arguments) || [];
    out.forEach(function (a) { if (a.id === 'date' && !a._pure) { a._pure = 1; var r0 = a.run; a.run = async function (nn) { var r = await r0.apply(this, arguments); if (nn.pure && !nn.pureKnown) { nn.pureKnown = 1; await G.result(G.L('一颗真心|A True Heart'), G.L('约会结束时，{n}红着脸说：“我这辈子只想对一个人好。”你知道，ta是认真的。|As the date ended, {n} blushed: "I only ever want to be good to one person." You knew they meant it.', { n: nn.name }), null, [], '💗'); } return r; }; } });
    // the family trust adviser
    if (n.trustee && n.alive) out.unshift({ id: 'trust_dep', n: '往信托里存钱|Pay into the Trust', i: '🏦', e: 0, run: function () { return trustDeposit(); } });
    // a lover's acknowledgement of a child decides inheritance
    if (n.rel === 'child' && n.illegit && !n.ack && n.alive) out.push({ id: 'k_disown', n: '不认这个孩子|Refuse to Recognise', i: '🚫', e: 5, run: async function (k, a) { k.disowned = 1; k.rel = 'kin'; k.kin = 'nibling'; N.addAff(k, -40); return G.result(a.n, '你在文件上签了字。{n}从此和你没有关系了。|You signed the papers. {n} is no longer yours.', { n: k.name }, [], a.i); } });
    return out;
  };
  var relName = N.relName;
  N.relName = function (n) { var r = relName.apply(this, arguments); if (n && n.trying && n.alive && (n.rel === 'spouse' || n.rel === 'lover' || n.rel === 'affair')) r = G.T(r) + G.T(' · 备孕中| · trying for a baby'); if (n && n.pureKnown) r = G.T(r) + ' 💗'; return r; };

  /* ---------- every year in the family ---------- */
  var mt = G.money.tick;
  G.money.tick = function () {
    var r = mt.apply(this, arguments), s = S(), p = s.p;
    if (s.dead) return r;
    var sp = N.partner();
    // the devoted one keeps loving you more
    N.all(function (n) { return n.pure && n.alive && ['spouse', 'lover'].indexOf(n.rel) >= 0; }).forEach(function (n) {
      N.addLove(n, 6); N.addAff(n, 4); n.loyal = 100; n.cheat = 0;
      if (n.rel === 'lover' && !n.engaged && G.ch(.3)) q('sys_npc_propose', n.id);
      else if (G.ch(.5)) q('pure_date', n.id);
    });
    // a spouse who has nothing of their own may stray too
    var spo = N.spouse();
    if (spo && spo.alive && !spo.pure && Math.max(0, spo.wealth || 0) < G.$(20000) && !spo.secret && G.ch(.03)) {
      var lv = N.make({ rel: 'contact', g: spo.g === 'm' ? 'f' : 'm', age: N.age(spo) + G.ri(-8, 4), looks: G.ri(60, 90), aff: -10 });
      lv.pin = 1; lv.spLover = spo.id; lv.job = lv.job || '—'; spo.secret = lv.id; spo.cheat = 1;
      if (G.ch(.3)) { var kid = N.make({ rel: 'kin', g: G.ch(.5) ? 'm' : 'f', age: G.ri(0, 3), aff: 0 }); kid.kin = 'nibling'; kid.spIllegit = spo.id; kid.pin = 1; lv.kidId = kid.id; }
    }
    if (spo && spo.secret && !spo.secretFound && G.ch(.25)) { spo.secretFound = 1; q('sp_secret', spo.id); }
    // a richer spouse gives more each year for each child you have together
    if (spo && spo.alive && spo.wealth > Math.max(G.$(1e5), G.netWorth())) {
      var kids = N.rel('child').filter(function (k) { return k.alive && (k.par2 === spo.id || k.other === spo.id); }).length, w0 = spo.wealth, rate = w0 < G.$(1e7) ? .02 : w0 < G.$(1e9) ? .01 : .004, gift = Math.round(Math.min(G.$(5e6), Math.max(Math.min(w0 * .02, G.$(20000) * (1 + kids)), w0 * rate * (1 + kids * .25))) * (spo.aff >= 60 ? 1.2 : spo.aff < 20 ? .5 : 1));
      if (gift > 0) { spo.wealth -= gift; G.giftIn(gift, G.L('{n}给的家用|Housekeeping from {n}', { n: spo.name })); }
    }
    // parents object to a very poor match
    if (sp && sp.rel === 'lover' && !sp.parObj && G.netWorth() > G.$(2e6) && Math.max(0, sp.wealth || 0) < G.netWorth() * .02 && N.rel('father', 'mother').some(function (x) { return x.alive; })) { sp.parObj = 1; q('par_object', sp.id); }
    // the trust: every five years the adviser asks
    var tr = s.assets.trust;
    if (tr && tr.amt > 0) { tr.rate = Math.max(tr.rate || 0, .065); if (!p.flags.trustY || s.year - p.flags.trustY >= 5) { p.flags.trustY = s.year; q('trust_review'); } }
    // hobbies that turn professional
    var pro = p.flags.pro; if (pro && PRO[pro] && !p.job && p.age >= 18 && p.age < 75) { var inc = G.$(G.ri(PRO[pro].pay[0], PRO[pro].pay[1])); tag(PRO[pro].n, function () { G.addMoney(inc); }); G.addStat('fame', 1, true); }
    return r;
  };

  G.evs([
    { id: 'pure_date', sys: 1, title: '又一次约会|Another Date', icon: '💗',
      prep: function (c) { if (!c.npc || !c.npc.alive) return false; },
      t: function () { return G.pick(['{n}又约你出去：“今天天气好，我们去走走吧。”|{n} asks you out again: "Lovely day — let\'s go for a walk."', '{n}给你做了便当，上面用番茄酱画了一颗心。|{n} made you a lunchbox, with a ketchup heart on top.', '{n}说：“我想和你生一个孩子，像你一样的。”|{n} says: "I\'d love to have a child with you — one just like you."']); },
      o: [{ t: '好呀|Yes', run: function (c) { N.addLove(c.npc, 6); c.add('happy', 6); if (c.npc.rel === 'spouse' || c.npc.rel === 'lover') c.npc.trying = c.npc.trying || (G.ch(.3) ? S().year : 0); return '你们手牵手走了很久。|You walked hand in hand for a long time.'; } },
        { t: '今天有点累|I\'m tired today', run: function (c) { return 'ta笑着说：“那我陪你在家。”|They smiled: "Then I\'ll stay home with you."'; } }] },
    { id: 'sp_secret', sys: 1, title: '另一部手机|The Other Phone', icon: '📱', bad: 1,
      prep: function (c) { var sp = c.npc, lv = sp && S().npcs[sp.secret]; if (!lv) return false; c.prm.l = lv.name; lv.rel = 'contact'; lv.job = G.L('{n}的情人|{n}\'s lover', { n: sp.name }); var k = lv.kidId && S().npcs[lv.kidId]; c.prm.k = k ? G.L('，还有一个{a}岁的孩子|, and a child of {a}', { a: N.age(k) }) : ''; if (k) k.job = G.L('{n}的私生子|{n}\'s secret child', { n: sp.name }); },
      t: '你在{n}的外套口袋里发现了另一部手机。里面是{l}的照片{k}。|In {n}\'s coat pocket you find a second phone, full of photos of {l}{k}.',
      o: [{ t: '原谅|Forgive', run: function (c) { var sp = c.npc; sp.secret = null; sp.cheat = 0; sp.loyal = Math.min(100, (sp.loyal || 50) + 20); c.add('happy', -10); return '{n}跪在地上哭着保证，再也不会了。|{n} knelt and wept, swearing it would never happen again.'; } },
        { t: '离婚|Divorce', run: function (c) { LO.divorce(c.npc, false); c.add('happy', -8); return '你把离婚协议放在了桌上。|You put the divorce papers on the table.'; } },
        { t: '假装不知道|Pretend you never saw it', run: function (c) { c.add('stress', 10); return '你把手机放回了原处。|You put the phone back where it was.'; } }] },
    { id: 'par_object', sys: 1, title: '父母的反对|Your Parents Object', icon: '🙅',
      prep: function (c) { if (!c.npc || !c.npc.alive || c.npc.rel !== 'lover') return false; c.prm.w = G.M(Math.max(0, c.npc.wealth || 0)); },
      t: '爸妈知道了{n}的家底（{w}），脸色很难看：“门不当户不对。你要是执意要结，家里一分钱都不会给。”|Your parents learned what {n} is worth ({w}) and their faces fell: "This match is beneath you. Marry them and you won\'t see a penny from us."',
      o: [{ t: '坚持在一起|Stay together anyway', run: function (c) { N.addLove(c.npc, 15); N.rel('father', 'mother').forEach(function (n) { N.addAff(n, -15); n.cutOff = 1; }); return '{n}抱着你哭了很久。|{n} held you and cried for a long time.'; } },
        { t: '听爸妈的，分手|Listen to them and break up', run: function (c) { LO.breakup(c.npc); N.rel('father', 'mother').forEach(function (n) { N.addAff(n, 8); }); return '你删掉了和{n}的所有照片。|You deleted every photo of {n}.'; } },
        { t: '每月偷偷接济ta|Quietly support them every month', run: function (c) { var m = G.$(G.ri(3, 10) * 1000); if (G.pay(m)) c.npc.wealth += m; N.addLove(c.npc, 8); return '你每个月偷偷给{n}转一笔钱。|Every month you quietly send {n} money.'; } }] },
    { id: 'trust_review', sys: 1, title: '信托顾问来了|The Trust Adviser Calls', icon: '🏦',
      prep: function (c) { var tr = S().assets.trust; if (!tr) return false; trustee(); c.prm.t = G.M(tr.amt); c.prm.m = G.M(Math.max(0, c.p.money)); c.prm.r = Math.round((tr.rate || .065) * 1000) / 10; },
      t: '五年一次的家族信托会议。信托里现在有{t}，年收益{r}%。你手头还有{m}。要往里再存吗？|The five-yearly trust meeting. The trust holds {t}, earning {r}% a year. You have {m} in hand. Pay more in?',
      o: [{ t: '保留10%~20%现金，其余存入|Keep 10–20% in cash, put the rest in', run: function (c) { var keep = .1 + Math.random() * .1; return trustPut(Math.round(Math.max(0, c.p.money) * (1 - keep))); } },
        { t: '存一半|Put in half', run: function (c) { return trustPut(Math.round(Math.max(0, c.p.money) / 2)); } },
        { t: '这次不存|Not this time', run: function () { return '顾问合上了文件夹：“五年后见。”|The adviser closed the folder: "See you in five years."'; } }] }
  ]);

  /* ---------- the family trust ---------- */
  function trustee() { var s = S(), tr = s.assets.trust; if (!tr) return null; var n = tr.nid && s.npcs[tr.nid]; if (n && n.alive) return n; n = N.make({ rel: 'contact', age: G.ri(38, 55), job: '家族信托私人顾问|Family Trust Adviser', aff: 70 }); n.pin = 1; n.trustee = 1; tr.nid = n.id; return n; }
  function trustPut(m) { var tr = S().assets.trust; m = Math.min(m, Math.max(0, P().money)); if (!tr || m <= 0) return G.L('没有可存的钱。|There\'s nothing to pay in.'); G.addMoney(-m); tr.amt += m; return G.L('你往信托里存了{m}。信托现在有{t}。|You paid {m} into the trust. It now holds {t}.', { m: G.M(m), t: G.M(tr.amt) }); }
  async function trustDeposit() { var i = await G.UI.pick({ title: G.L('往信托里存钱|Pay into the Trust'), items: [{ t: G.L('保留15%现金，其余存入|Keep 15% in cash, put in the rest'), sub: G.M(Math.round(Math.max(0, P().money) * .85)) }, { t: G.L('一半现金|Half the cash'), sub: G.M(Math.round(Math.max(0, P().money) / 2)) }] }); if (i < 0) return 'cancel'; return G.result(G.L('家族信托|Family Trust'), trustPut(i === 0 ? Math.round(Math.max(0, P().money) * .85) : Math.round(P().money / 2)), null, [], '🏦'); }
  var money = cat('money');
  if (money) money.items.push({ id: 'trust_open', n: '家族信托|Family Trust', i: '🏦', e: 0, a: [18, 120], if: function () { return G.netWorth() > G.$(1e6); }, run: async function (a) {
    var s = S(); if (!s.assets.trust) { s.assets.trust = { amt: 0, rate: .065 }; G.major('设立了家族信托|Set up a family trust'); }
    trustee(); return trustDeposit();
  } });

  /* ---------- the rich don't use dating apps ---------- */
  ['app', 'blind'].forEach(function (id) { var a = item(id); if (a) { var f = a.if; a.if = function () { return !rich() && (!f || f.apply(this, arguments)); }; } });
  var soc = cat('social');
  if (soc) soc.items.unshift({ id: 'elite_match', n: '私人红娘|A Private Matchmaker', i: '💎', e: 10, a: [20, 70], if: rich, run: async function (a) {
    var p = P(), L = [];
    for (var i = 0; i < 5; i++) { var x = N.mkRomantic({ tags: G.ch(.6) && LO.eliteTags && LO.eliteTags().length ? [G.pick(LO.eliteTags())] : [], love: G.ri(20, 45), aff: G.ri(10, 30) }); x.looks = G.clamp(Math.max(x.looks, G.ri(70, 95)), 5, 100); x.smarts = G.clamp(Math.max(x.smarts, G.ri(65, 92)), 5, 100); L.push(x); }
    var j = await G.UI.pick({ title: G.L(a.n), text: G.L('红娘只介绍和你门当户对的人。|The matchmaker only introduces people of your standing.'), items: L.map(function (x) { return { t: x.name, sub: G.T(x.job || '') + ' · ' + G.L('{a}岁|age {a}', { a: N.age(x) }) + ' · ' + G.T(N.looksLabel(x.looks)), npc: x }; }) });
    L.forEach(function (x, k) { if (k !== j) delete S().npcs[x.id]; });
    if (j < 0) return 'cancel'; var n = L[j]; n.rel = 'crush'; N.addLove(n, 15); n.pin = 1;
    return G.result(a.n, '你和{n}在一家私人会所见了面，聊得很投机。|You met {n} at a private club and hit it off.', { n: n.name }, [], a.i);
  } });
  // affairs: the people you are tempted by are striking or impressive
  var aff = item('affair');
  if (aff) { var af0 = aff.run; aff.run = async function () { var mk = N.mkRomantic; N.mkRomantic = function () { var x = mk.apply(this, arguments); if (G.ch(.6)) x.looks = Math.max(x.looks, G.ri(78, 96)); else { x.smarts = Math.max(x.smarts, G.ri(75, 95)); x.wealth = Math.max(x.wealth || 0, G.$(G.ri(5, 50) * 1e5)); } return x; }; try { return await af0.apply(this, arguments); } finally { N.mkRomantic = mk; } }; }

  /* ---------- adoption: you choose ---------- */
  var ad = item('adopt');
  if (ad) ad.run = async function (a) {
    var i = await G.UI.pick({ title: G.L(a.n), items: [{ t: G.L('男孩|A boy'), icon: '👦' }, { t: G.L('女孩|A girl'), icon: '👧' }, { t: G.L('都可以|Either', null), icon: '🧒' }] }); if (i < 0) return 'cancel';
    var k = await LO.baby(null, true); if (!k) return 'cancel';
    var g = i === 0 ? 'm' : i === 1 ? 'f' : k.g;
    if (g !== k.g) { k.g = g; var nm = G.genName(k.cul || G.C[P().country].names, g, k.by, k.sur || P().sur); k.giv = nm.giv; k.name = G.mkName(k.cul || G.C[P().country].names, k.sur || nm.sur, nm.giv, g); }
    k.adopted = 1; k.aff = Math.max(k.aff || 0, 88);
    return G.result(a.n, '你领养了{n}。|You adopted {n}.', { n: k.name }, [], a.i);
  };
  var ask = G.EV.adopt_ask; if (ask) ask.o[0].run = async function (c) { var a = item('adopt'); if (!a) return ''; var r = await a.run(a); c.add('happy', r === 'cancel' ? 0 : 12); return r === 'cancel' ? '你最后还是没有去。|In the end you didn\'t go.' : '家里终于有了孩子的笑声。|At last the house rang with a child\'s laughter.'; };

  /* ---------- the outdoors, properly ---------- */
  var PRO = {
    angler: { n: '职业钓手|Professional Angler', pay: [20000, 90000] }, climber: { n: '职业登山家|Professional Mountaineer', pay: [40000, 200000] },
    hiker: { n: '户外向导|Outdoor Guide', pay: [25000, 70000] }, gamer: { n: '职业玩家|Pro Gamer', pay: [30000, 300000] }, reader: { n: '书评人|Book Critic', pay: [20000, 80000] }, foodie: { n: '美食博主|Food Blogger', pay: [20000, 250000] }
  };
  G.PRO_HOBBY = PRO;
  function hob(k, n) { var p = P(); p.hob = p.hob || {}; p.hob[k] = (p.hob[k] || 0) + (n || 1) * (p.flags.gift === k ? 2 : 1); if (p.hob[k] >= 10 && !p.flags.pro && p.age >= 16) { p.flags.pro = k; G.major('成为{x}|Became a {x}', { x: PRO[k].n }); G.addStat('fame', 5); return G.L('\n你已经玩成了专业的——现在你是{x}，每年都有收入。|\nYou\'ve gone pro — you\'re now a {x}, with an income every year.', { x: PRO[k].n }); } return ''; }
  G.hobby = hob;
  var G_TAL = G.title;
  G.title = function () { var p = P(); var t = G_TAL.apply(this, arguments); if (p && p.flags.pro && PRO[p.flags.pro] && !p.job && !p.spy && /无业|Unemployed|自由职业|Freelance/.test(G.T(t))) return PRO[p.flags.pro].n; return t; };
  var MOUNT = [
    ['泰山|Mount Tai', 1545, 0, 30, .0], ['富士山|Mount Fuji', 3776, 800, 45, .002], ['乞力马扎罗山|Kilimanjaro', 5895, 6000, 60, .006], ['勃朗峰|Mont Blanc', 4808, 3000, 60, .01],
    ['阿空加瓜山|Aconcagua', 6961, 9000, 70, .02], ['德纳里峰|Denali', 6190, 12000, 75, .03], ['珠穆朗玛峰|Mount Everest', 8849, 70000, 82, .05], ['K2乔戈里峰|K2', 8611, 90000, 88, .12]
  ];
  var fun = cat('fun');
  if (fun) {
    var hk = fun.items.filter(function (x) { return x.id === 'hike'; })[0]; if (hk) { hk.n = '徒步|Hiking'; hk.run = function (a) { var t = hob('hiker'); return G.quick(a, G.L(G.pick(['你走完了一条二十公里的山路。|You walked a twenty-kilometre trail.', '林子里很安静，只有你的脚步声。|The woods were silent but for your footsteps.']) + t), { health: G.ri(5, 8), happy: 5, stress: -6 }); }; }
    fun.items.push({ id: 'climb', n: '登山|Mountaineering', i: '🏔️', e: 25, a: [14, 75], run: async function (a) {
      var p = P(), i = await G.UI.pick({ title: G.L('爬哪座山？|Which mountain?'), text: G.L('越高越危险。八千米以上必须请夏尔巴向导。|The higher, the deadlier. Above 8,000 m you need a Sherpa guide.'), items: MOUNT.map(function (m) { return { t: m[0], sub: G.L('{h}米 · 费用{c} · 需要健康{p}%|{h} m · cost {c} · health {p}%+', { h: m[1], c: G.M(G.$(m[2])), p: m[3] }), icon: '🏔️', dis: p.st.health < m[3] }; }) });
      if (i < 0) return 'cancel'; var m = MOUNT[i], cost = G.$(m[2]);
      if (p.st.health < m[3]) return G.result(a.n, '你的身体条件不够。|You\'re not fit enough.', null, [], a.i);
      if (cost && !G.pay(cost)) return G.result(a.n, '费用要{m}，你付不起。|It costs {m}. You can\'t afford it.', { m: G.M(cost) }, [], a.i);
      var exp = (p.hob && p.hob.climber) || 0, risk = m[4] * Math.max(.3, 1 - exp * .08) * (p.st.health > 90 ? .7 : 1);
      if (m[1] >= 8000) { var sh = N.make({ rel: 'friend', g: 'm', age: G.ri(28, 50), c: 'in', name: G.pick(['丹增|Tenzing', '明玛|Mingma', '普巴|Phurba', '尼玛|Nima', '帕桑|Pasang']), sur: '夏尔巴|Sherpa', job: '夏尔巴向导|Sherpa Guide', aff: 50 }); sh.pin = 1; G.log('你的夏尔巴向导是{n}。|Your Sherpa guide is {n}.', { n: sh.name }); }
      if (G.ch(risk)) { if (G.ch(.5)) { G.die(G.L('攀登{m}时遇难|Died climbing {m}', { m: m[0] })); return; } G.addStat('health', -25); return G.result(a.n, '暴风雪中你失去了两根脚趾，被直升机救了下来。|You lost two toes in a blizzard and were airlifted off the mountain.', null, [], a.i); }
      if (G.ch(m[1] > 8000 ? .35 : m[1] > 6000 ? .2 : .05)) { var t0 = hob('climber'); return G.result(a.n, G.L('离顶峰只剩三百米，天气变了。你转身下撤——活着最重要。|Three hundred metres from the summit the weather turned. You turned back — staying alive comes first.') + t0, null, [], a.i); }
      var t = hob('climber', m[1] >= 8000 ? 4 : m[1] >= 5000 ? 2 : 1); G.dStart(); G.addStat('happy', 10 + Math.round(m[1] / 600)); if (m[1] >= 8000) { p.flags.summit8k = 1; G.addStat('fame', 8); G.major('登顶{m}|Summited {m}', { m: m[0] }); } var dl = G.dEnd();
      return G.result(a.n, G.L('你站在了{m}的顶峰（{h}米）。世界在脚下。|You stood on the summit of {m} ({h} m). The world lay at your feet.', { m: m[0], h: m[1] }) + t, null, dl, a.i);
    } });
    var fs = fun.items.filter(function (x) { return x.id === 'fish'; })[0];
    if (fs) fs.run = async function (a) {
      var p = P(), own = p.flags.pond, i = await G.UI.pick({ title: G.L(a.n), items: [{ t: G.L('去野河边钓|Fish a wild river'), sub: G.L('免费|Free'), icon: '🏞️' }, { t: G.L('去别人的鱼塘钓|Pay at someone\'s pond'), sub: G.M(G.$(40)), icon: '🐟' }, own ? { t: G.L('去自己的鱼塘|Go to your own pond'), icon: '🏡' } : { t: G.L('承包一个鱼塘|Lease a fish pond'), sub: G.M(G.$(25000)), icon: '🏡' }] });
      if (i < 0) return 'cancel';
      if (i === 1 && !G.pay(G.$(40))) return 'cancel';
      if (i === 2 && !own) { if (!G.pay(G.$(25000))) return G.result(a.n, '承包鱼塘要{m}。|Leasing a pond costs {m}.', { m: G.M(G.$(25000)) }, [], a.i); p.flags.pond = 1; S().assets.items.push({ id: G.uid(), k: 'pond', n: '承包的鱼塘|Your Fish Pond', val: G.$(25000), i: '🏡' }); }
      var big = G.ch(i === 0 ? .2 : .45), t = hob('angler');
      if (i === 2 && G.ch(.3)) { var sell = G.$(G.ri(1, 5) * 1000); G.addMoney(sell); t = G.L('\n鱼塘里的鱼卖了{m}。|\nThe pond\'s fish sold for {m}.', { m: G.M(sell) }) + t; }
      return G.quick(a, G.L(big ? '你钓到了一条大鱼！|You landed a big one!' : '坐了一下午，心静了。|An afternoon by the water calmed you down.') + t, { happy: big ? 8 : 5, stress: -6 });
    };
    // late-night phone scrolling: it is fun, that's why people do it
    var sc = fun.items.filter(function (x) { return x.id === 'scroll'; })[0];
    if (sc) sc.run = function (a) { P().hab.night += 5; return G.quick(a, G.pick(['你刷到凌晨两点，笑得停不下来。|You scrolled until 2 a.m., laughing nonstop.', '你看了一百个猫咪视频，心情好极了。|A hundred cat videos later, you felt wonderful.']), { happy: 12, stress: -6, health: -1 }); };
    var vo = fun.items.filter(function (x) { return x.id === 'volunteer'; })[0];
    if (vo) { var v0 = vo.run; vo.run = function () { G.addStat('fame', 3); G.addStat('karma', 3); return v0.apply(this, arguments); }; }
    // concerts: choose your seat; enough of them and you might meet the star
    var cc = fun.items.filter(function (x) { return x.id === 'concert'; })[0];
    if (cc) cc.run = async function (a) {
      var p = P(), T = [['看台票|Stand seat', 150, 0], ['内场票|Floor seat', 600, 1], ['VIP前排+见面会|VIP front row + meet-and-greet', 5000, 3]];
      var i = await G.UI.pick({ title: G.L(a.n), items: T.map(function (x) { return { t: x[0], sub: G.M(G.$(x[1])), icon: '🎤' }; }) }); if (i < 0) return 'cancel';
      if (!G.pay(G.$(T[i][1]))) return G.result(a.n, '票钱不够。|You can\'t afford the ticket.', null, [], a.i);
      p.flags.idolPts = (p.flags.idolPts || 0) + T[i][2] + (p.st.looks > 75 ? 1 : 0);
      if (p.flags.idolPts >= 9 && !p.flags.idolMet && p.age >= 18 && G.ch(.5)) {
        p.flags.idolMet = 1; var g = p.orient === 'gay' ? p.g : (p.g === 'm' ? 'f' : 'm');
        var idol = N.mkRomantic({ tags: ['celeb'], love: 45, aff: 40 }); idol.g = g; idol.looks = G.ri(85, 99); idol.job = g === 'f' ? '当红女歌手|Pop Star' : '当红男歌手|Pop Star'; idol.wealth = G.$(G.ri(10, 80) * 1e6); idol.fame = 90; idol.rel = 'crush'; idol.pin = 1;
        return G.result(a.n, '见面会上，{n}多看了你一眼，然后在你的票根背面写下了一串号码。|At the meet-and-greet, {n} looked at you a moment longer — then wrote a number on the back of your ticket.', { n: idol.name }, [], '💫');
      }
      return G.quick(a, i === 2 ? '你和偶像握了手，三天没舍得洗。|You shook hands with your idol and didn\'t wash it for three days.' : '全场大合唱，你热泪盈眶。|The whole crowd sang along; your eyes filled with tears.', { happy: 8 + i * 4 });
    };
    var pt = (cat('social') || { items: [] }).items.filter(function (x) { return x.id === 'party'; })[0];
    if (pt) { var p0 = pt.run; pt.run = function () { if (G.ch(.06)) { var p = P(), cand = G.TALENTS.filter(function (t) { return !t.neg && p.talents.indexOf(t.id) < 0 && ['social', 'charm', 'leader', 'music'].indexOf(t.id) >= 0; }); if (cand.length) { var t = G.pick(cand); p.talents.push(t.id); G.log('派对上你发现了自己的新天赋：{t}！|At the party you discovered a new talent: {t}!', { t: t.n }); } } return p0.apply(this, arguments); }; }
  }
  var rd = item('read'); if (rd) { var rd0 = rd.run; rd.run = function () { var r = rd0.apply(this, arguments); hob('reader'); return r; }; }
  var gm = item('game'); if (gm) { var gm0 = gm.run; gm.run = function () { var r = gm0.apply(this, arguments); hob('gamer'); return r; }; }
  var fd = item('feast'); if (fd) { var fd0 = fd.run; fd.run = function () { var r = fd0.apply(this, arguments); hob('foodie'); return r; }; }

  /* ---------- everyday life gives more ---------- */
  var lifeC = cat('life');
  if (lifeC) lifeC.items.forEach(function (a) {
    if (a.id === 'walk') a.run = async function (x) { return G.quick(x, G.L(G.pick(['你发现了一家开了三十年的老面馆。|You found a noodle shop that\'s been open thirty years.', '你在河边看了一场日落。|You watched a sunset by the river.'])), { health: G.ri(8, 10), happy: 4 }); };
    if (a.id === 'diary') a.run = async function (x) { var low = P().st.happy < 40; return G.quick(x, G.L(low ? '你把心里的委屈都写了下来，写完好像轻了很多。|You poured every hurt onto the page, and felt much lighter.' : '你把今年的事写了下来。|You wrote down the year.'), { eq: low ? 4 : 2, happy: low ? 10 : 4, stress: -8 }); };
    if (a.id === 'makeover') a.run = async function (x) { var m = G.$(300); if (!G.pay(m)) return 'cancel'; var p = P(); p.avSeed = G.ri(1, 999999); return G.quick(x, G.L('你剪了新发型，换了一身衣服。镜子里的自己，像换了一个人。|New haircut, new clothes. The person in the mirror looks like someone new.'), { looks: 3, happy: 6 }); };
    if (a.id === 'museum') { a.run = async function (x) { return G.quick(x, G.L('你在一幅画前站了很久。|You stood before one painting for a long time.'), { smarts: 4, happy: 4 }); }; }
    if (a.id === 'garden') { a.run = async function (x) { return G.quick(x, G.L('阳台上的小番茄红了。|The balcony tomatoes turned red.'), { happy: 6, health: 3 }); }; }
    if (a.id === 'stars') { a.run = async function (x) { return G.quick(x, G.L('银河横过头顶，你第一次觉得自己很小，也很幸运。|The Milky Way stretched overhead; you felt small, and lucky.'), { happy: 10, stress: -8 }); }; }
  });
  if (lifeC) lifeC.items.push({ id: 'volunteer2', n: '主动做义工攒名声|Volunteer to Build a Name', i: '🙋', e: 10, a: [14, 100], run: async function (a) { return G.quick(a, G.L('你在社区服务中心帮了一整天。负责人说会给你写一封推荐信。|You spent the day at the community centre. The coordinator promised you a reference.'), { fame: 4, karma: 5, happy: 3 }); } });

  /* ---------- the blood drive: not for the heir, and honest about the cost ---------- */
  ['a_blood_drive', 'a_bloodd'].forEach(function (id) {
    var d = G.EV[id]; if (!d) return;
    var f = d.if; d.if = function (S2, p) { if (p && (p.flags.heir || p.flags.rich || (G.famClass && G.famClass() >= 2))) return false; return f ? f.apply(this, arguments) : true; };
    (d.o || []).forEach(function (o, i) { if (i === 0) { o.t = String(o.t).replace(/\|/, '（健康低于50%会再掉30）|') + (String(o.t).indexOf('(') < 0 ? ' (health below 50% costs 30 more)' : ''); var r0 = o.run; o.run = function (c) { if (c.p.st.health < 50) c.add('health', -30); return typeof r0 === 'function' ? r0.apply(this, arguments) : r0; }; } });
  });

  /* ---------- the art show says what it takes ---------- */
  var ex = item('exhibit'); if (ex) ex.n = '办画展（艺术细胞天赋大幅加成）|Hold an Art Show (the Artistic talent helps a lot)';

  /* ---------- a child who wants a games console ---------- */
  function kids715() { return N.rel('child').filter(function (k) { var a = N.age(k); return k.alive && a >= 7 && a <= 15; }); }
  G.evs([
    E('k_console14', [24, 80], '想要游戏机|The Games Console', '🎮', '{n}眼巴巴地看着你：“我们班同学都有游戏机……”|{n} looks up at you: "Everyone in my class has a games console…"', [
      O('买！|Buy it!', function (c) { var k = c.npc; G.addMoney(-G.$(400)); var good = G.ch(.6); N.addAff(k, good ? 15 : 8); if (good) { k.perf = Math.min(100, (k.perf || 50) + 5); c.add('happy', 8); return '你本以为会荒废学业，没想到{n}自己定了规矩：作业写完才玩，成绩反而更好了。你们俩的关系也更亲了。|You feared it would wreck their studies — but {n} set their own rule: homework first. Their grades actually went up, and the two of you grew closer.'; } c.add('happy', 3); return '{n}抱着游戏机睡着了。|{n} fell asleep hugging the console.'; }),
      O('等考好了再说|After good grades', R('{n}嘟着嘴回房间了。期末，{n}考得比以前都好。|{n} sulked off — then got the best grades ever at the end of term.', { happy: 2 })),
      O('不行|No', function (c) { N.addAff(c.npc, -8); return '{n}哭了一晚上。|{n} cried all night.'; })
    ], { if: function () { return kids715().length > 0; }, prep: function (c) { c.npc = G.pick(kids715()); c.prm.n = c.npc.name; }, w: 1.5 })
  ]);
})();
