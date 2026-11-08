/* Tab pages: assets, relationships, life, activities; NPC profile; chat; investments */
(function () {
  'use strict';
  var h = G.h, UI = G.UI, T = UI.T, tap = UI.tap, N = G.N;
  function visible(a) { var p = G.S.p; if (a.a && (p.age < a.a[0] || p.age > a.a[1])) return false; if (a.era && !G.eraOk(a.era)) return false; if (a.if && !a.if()) return false; return true; }
  function actRow(a, after, npc) {
    var lock = a.lock ? a.lock() : null, price = a.$ ? G.$(a.$) : 0;
    var chips = h('div', { class: 'rt' });
    if (a.e) chips.appendChild(h('span', { class: 'chip e' }, '⚡' + a.e));
    if (price) chips.appendChild(h('span', { class: 'chip m' }, G.fm(price)));
    return h('button', { class: 'row' + (lock ? ' lock dis' : ''), onclick: tap(async function () {
      if (lock) { UI.toast(lock); return; }
      await UI.doAction(a, npc);
      if (after) after();
    }) }, h('div', { class: 'ic' }, a.i || '•'), h('div', { class: 'tx' }, h('div', { class: 't' }, T(a.n)), lock ? h('div', { class: 's wrap' }, T(lock)) : a.d ? h('div', { class: 's' }, T(a.d)) : null), chips);
  }
  UI.actRow = actRow;
  function kv(rows) { var dl = h('dl', { class: 'kv' }); rows.forEach(function (r) { if (!r) return; dl.appendChild(h('dt', null, T(r[0]))); dl.appendChild(h('dd', null, typeof r[1] === 'string' ? T(r[1]) : r[1])); }); return dl; }
  function pbar(v, color) { return h('div', { class: 'pbar' }, h('i', { style: { width: G.clamp(v, 0, 100) + '%', background: color || null } })); }

  /* ===================== LIFE ===================== */
  UI.statusCards = function () {
    var S = G.S, p = S.p, out = [], e = p.edu;
    if (p.jail) out.push(h('div', { class: 'card' }, h('h5', null, '⛓️ ' + T('服刑中|Serving Time')), kv([['罪名|Charge', p.jail.why], ['剩余刑期|Time left', T('{n}年|{n} yr', { n: p.jail.left })], ['表现|Behavior', String(p.jail.beh)]]), pbar(p.jail.beh)));
    if (G.school.isStudent() || e.stage === 'kinder') out.push(h('div', { class: 'card' }, h('h5', null, '🎒 ' + T(e.school || G.STAGES[e.stage].n)), kv([
      ['阶段|Stage', G.STAGES[e.stage].n], e.q ? ['学校水平|School quality', '★★★★★'.slice(0, e.q) + '☆☆☆☆☆'.slice(0, 5 - e.q) + ' ' + T(G.school.Q_NAME[e.q])] : null, ['年级|Year', T('{g}年级|Year {g}', { g: e.grade + 1 })], e.major ? ['专业|Major', G.MAJORS[e.major].n] : null, ['成绩|Grades', String(e.perf)]]), pbar(e.perf)));
    if (p.job) { var J = G.JOB[p.job.id]; out.push(h('div', { class: 'card' }, h('h5', null, '💼 ' + T(J.r[Math.min(p.job.rank, J.r.length - 1)])), kv([['单位|Employer', p.job.co], ['年薪|Salary', G.fm(p.job.sal)], ['工龄|Years', String(p.job.yrs)], ['绩效|Performance', String(p.job.perf)]]), pbar(p.job.perf))); }
    if (p.fc) { var F = G.FAME[p.fc.id]; out.push(h('div', { class: 'card' }, h('h5', null, '🌟 ' + T(F.r[p.fc.rank])), kv([['粉丝|Fans', p.fc.fans.toLocaleString()], ['状态|Form', String(p.fc.perf)], ['预计年收入|Est. income', G.fm(G.fame.income())], p.fc.sport != null ? ['项目|Sport', G.SPORTS[p.fc.sport]] : null]), pbar(p.fc.perf))); }
    if (p.mil) out.push(h('div', { class: 'card' }, h('h5', null, '🎖️ ' + T(G.mil.rankName())), kv([['军种|Branch', G.MIL.br[p.mil.br]], ['军功|Merit', String(p.mil.merit)], ['军龄|Service', T('{n}年|{n} yr', { n: p.mil.yrs })], p.mil.cons ? ['义务兵役|Conscription', T('还剩{n}年|{n} yr left', { n: Math.max(0, p.mil.term - p.mil.yrs) })] : null])));
    if (p.pol) out.push(h('div', { class: 'card' }, h('h5', null, '👮 ' + T(G.POLICE.r[p.pol.rank])), kv([['功绩|Merit', String(p.pol.merit)], ['破案数|Cases solved', String(p.pol.cases)], ['警龄|Service', T('{n}年|{n} yr', { n: p.pol.yrs })]])));
    if (p.gov) out.push(h('div', { class: 'card' }, h('h5', null, '🏛️ ' + T(G.gov.title())), kv([['考评|Rating', String(p.gov.perf)], p.gov.track === 'poli' ? ['支持率|Approval', p.gov.appr + '%'] : null, p.gov.term ? ['任期剩余|Term left', T('{n}年|{n} yr', { n: p.gov.term })] : null, ['任职|In office', T('{n}年|{n} yr', { n: p.gov.yr })]]), p.gov.track === 'poli' ? pbar(p.gov.appr, 'var(--red)') : pbar(p.gov.perf)));
    if (p.gang) out.push(h('div', { class: 'card' }, h('h5', null, '🐉 ' + T(p.gang.name)), kv([['地位|Rank', G.GANG.r[p.gang.rank]], ['江湖声望|Rep', String(p.gang.rep)], ['警方关注|Police heat', String(Math.round(p.h.heat))]]), pbar(p.h.heat, 'var(--red)')));
    var co = S.assets.company;
    if (co) out.push(h('div', { class: 'card' }, h('h5', null, '🏢 ' + T(co.name)), kv([['行业|Industry', G.INDUSTRY[co.ind].n], ['估值|Valuation', G.fm(co.val)], ['持股|Your stake', Math.round(co.own * 100) + '%'], ['员工|Staff', String(co.emp)], ['去年增长|Last year', (co.last >= 0 ? '+' : '') + Math.round((co.last || 0) * 100) + '%'], co.ipo ? ['上市|Public', '✓'] : null])));
    if (p.retired) out.push(h('div', { class: 'card' }, h('h5', null, '🌅 ' + T('退休|Retired')), kv([['养老金|Pension', G.fm(p.pension) + T('/年|/yr')]])));
    out.push(h('div', { class: 'card' }, kv([
      ['学历|Education', G.DEG[p.edu.deg]], p.edu.tier && p.edu.deg >= 4 && !G.school.inSchool() ? ['母校|Alma mater', T(p.edu.school || '') + ' ' + '★★★★★'.slice(0, p.edu.tier)] : null, ['语言|Languages', p.langs.map(function (l) { return T(G.LANGS[l]); }).join('、')],
      ['国籍|Country', T(G.C[p.country].n) + ' ' + G.C[p.country].flag], ['城市|City', p.city],
      p.crime.rec ? ['犯罪记录|Criminal record', T('{n}次|{n}', { n: p.crime.rec })] : null,
      p.h.heat > 5 && !p.gang ? ['警方关注|Police heat', String(Math.round(p.h.heat))] : null,
      p.flags.fugitive ? ['身份|Status', '逃犯|Fugitive'] : null,
      p.talents.length ? ['天赋|Talents', p.talents.map(function (t) { return T(G.TALENT[t].n); }).join(' ')] : null])));
    return out;
  };
  UI.tabLife = function () {
    UI.sheet('人生|Life', function (b, rec) {
      UI.statusCards().forEach(function (c) { b.appendChild(c); });
      var acts = G.lifeActs().filter(visible);
      if (acts.length) b.appendChild(h('div', { class: 'grp' }, T('能做的事|What you can do')));
      acts.forEach(function (a) { b.appendChild(actRow(a, function () { rec.refresh(); })); });
    });
  };

  /* ===================== ACTIVITIES ===================== */
  UI.tabActivities = function () {
    UI.sheet('活动|Activities', function (b) {
      G.ACT_CATS.forEach(function (c) {
        var lock = c.lock ? c.lock() : null, n = c.items.filter(visible).length;
        if (!n && !lock) return;
        b.appendChild(h('button', { class: 'row' + (lock ? ' lock dis' : ''), onclick: tap(function () { if (lock) { UI.toast(lock); return; } UI.catPage(c); }) },
          h('div', { class: 'ic' }, c.i), h('div', { class: 'tx' }, h('div', { class: 't' }, T(c.n)), lock ? h('div', { class: 's wrap' }, T(lock)) : null), h('div', { class: 'rt' }, h('span', { class: 'chip' }, String(n)))));
      });
    });
  };
  UI.catPage = function (c) {
    UI.sheet(c.n, function (b, rec) {
      var items = c.items.filter(visible);
      if (!items.length) b.appendChild(h('div', { class: 'empty' }, T('现在没什么可做的。|Nothing available right now.')));
      items.forEach(function (a) { b.appendChild(actRow(a, function () { rec.refresh(); })); });
    });
  };

  /* ===================== ASSETS ===================== */
  UI.tabAssets = function () {
    UI.sheet('资产|Assets', function (b, rec) {
      var S = G.S, p = S.p, A = S.assets, inc = G.money.income(), liv = G.money.living();
      b.appendChild(h('div', { class: 'card' }, kv([['净资产|Net worth', h('span', { class: 'money' + (G.netWorth() < 0 ? ' neg' : '') }, G.fm(G.netWorth()))], ['现金|Cash', G.fm(p.money)],
        inc.work ? ['年收入|Annual income', G.fm(inc.work)] : null, inc.black ? ['灰色收入|Off-the-books', G.fm(inc.black)] : null, liv ? ['年开销（估）|Living costs (est.)', G.fm(liv)] : null,
        G.dependent() && p.age < 26 ? ['家庭资产|Family wealth', G.fm(G.famWealth())] : null])));
      var quick = h('div', { class: 'actgrid' });
      [['house', '🏠', '买房|Home'], ['car', '🚗', '买车|Car'], ['lux', '💎', '奢侈品|Luxury'], ['pet', '🐾', '宠物|Pet'], ['invest', '📊', '投资|Invest'], ['lottery', '🎟️', '彩票|Lottery']].forEach(function (x) {
        var a = null; G.ACT_CATS.forEach(function (c) { c.items.forEach(function (it) { if (it.id === x[0]) a = it; }); });
        if (!a || !visible(a)) return;
        quick.appendChild(h('button', { class: 'ab', onclick: tap(async function () { await UI.doAction(a); rec.refresh(); }) }, h('span', null, x[1]), T(x[2])));
      });
      if (quick.childNodes.length) b.appendChild(quick);
      function sec(title, list, row) { if (!list.length) return; b.appendChild(h('div', { class: 'grp' }, T(title))); list.forEach(function (x) { b.appendChild(row(x)); }); }
      sec('房产|Property', A.houses, function (x) {
        var btns = h('div', { style: { display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap' } });
        btns.appendChild(h('button', { class: 'chip m', style: { padding: '5px 9px' }, onclick: tap(async function () { if (await UI.confirm('卖房|Sell Home', G.L('以{m}卖掉{n}？|Sell {n} for {m}?', { m: G.M(x.val), n: x.n }))) { var net = G.money.sellHouse(x); UI.toast(G.L('到手{m}|You received {m}', { m: G.M(net) })); rec.refresh(); } }) }, T('卖出|Sell')));
        if (!x.live) btns.appendChild(h('button', { class: 'chip e', style: { padding: '5px 9px' }, onclick: tap(function () { A.houses.forEach(function (o) { o.live = false; }); x.live = true; x.rent = false; p.home = x.id; rec.refresh(); }) }, T('入住|Move in')));
        if (!x.live) btns.appendChild(h('button', { class: 'chip', style: { padding: '5px 9px' }, onclick: tap(function () { x.rent = !x.rent; rec.refresh(); }) }, x.rent ? T('停止出租|Stop renting') : T('出租|Rent out')));
        return h('div', { class: 'row', style: { alignItems: 'flex-start' } }, h('div', { class: 'ic' }, '🏠'), h('div', { class: 'tx' }, h('div', { class: 't' }, T(x.n), x.live ? h('span', { class: 'chip e' }, T('自住|Home')) : x.rent ? h('span', { class: 'chip m' }, T('出租中|Rented')) : null),
          h('div', { class: 's' }, T(x.city) + ' · ' + T('价值|Value') + ' ' + G.fm(x.val) + (x.mort ? ' · ' + T('房贷|Mortgage') + ' ' + G.fm(x.mort) : '')), btns));
      });
      function sellRow(listName, x, ic) { return h('div', { class: 'row' }, h('div', { class: 'ic' }, x.i || ic), h('div', { class: 'tx' }, h('div', { class: 't' }, T(x.n)), h('div', { class: 's' }, G.fm(x.val))), h('button', { class: 'chip m', style: { padding: '6px 10px' }, onclick: tap(function () { G.money.sellAsset(listName, x, listName === 'cars' ? 1 : .8); UI.toast('已卖出|Sold'); rec.refresh(); }) }, T('卖出|Sell'))); }
      sec('车辆|Vehicles', A.cars, function (x) { return sellRow('cars', x, '🚗'); });
      sec('物品|Belongings', A.items, function (x) { return sellRow('items', x, '💎'); });
      sec('宠物|Pets', A.pets, function (x) {
        var d = G.PETS.filter(function (y) { return y.id === x.kind; })[0] || { i: '🐾', n: '' };
        return h('div', { class: 'row' }, h('div', { class: 'ic' }, d.i), h('div', { class: 'tx' }, h('div', { class: 't' }, T(x.name)), h('div', { class: 's' }, T(d.n) + ' · ' + T('{a}岁|{a} yr', { a: S.year - x.by }))),
          h('button', { class: 'chip e', style: { padding: '6px 10px' }, onclick: tap(async function () { await UI.doAction({ n: '陪宠物玩|Play with Pet', i: d.i, e: 5, run: function (a) { return G.quick(a, G.pick(['{n}开心得直打滚。|{n} rolled around happily.', '你和{n}玩了一下午。|You played with {n} all afternoon.']), { happy: 4, stress: -4 }, { n: x.name }); } }); rec.refresh(); }) }, T('陪玩|Play')),
          h('button', { class: 'chip', style: { padding: '6px 10px' }, onclick: tap(async function () { if (await UI.confirm('送养|Rehome', G.L('把{n}送给别人养？|Give {n} to a new home?', { n: x.name }))) { A.pets = A.pets.filter(function (y) { return y !== x; }); G.addStat('happy', -6); rec.refresh(); } }) }, T('送养|Rehome')));
      });
      var invT = G.sum(Object.keys(A.inv), function (k) { return A.inv[k] || 0; });
      if (invT > 0) { b.appendChild(h('div', { class: 'grp' }, T('投资|Investments'))); b.appendChild(h('button', { class: 'row', onclick: tap(function () { UI.investPage(); }) }, h('div', { class: 'ic' }, '📊'), h('div', { class: 'tx' }, h('div', { class: 't' }, T('投资组合|Portfolio')), h('div', { class: 's' }, G.fm(invT))))); }
      if (A.company) { b.appendChild(h('div', { class: 'grp' }, T('公司|Company'))); b.appendChild(h('button', { class: 'row', onclick: tap(function () { UI.tabLife(); }) }, h('div', { class: 'ic' }, '🏢'), h('div', { class: 'tx' }, h('div', { class: 't' }, T(A.company.name)), h('div', { class: 's' }, T('估值|Valuation') + ' ' + G.fm(A.company.val) + ' · ' + Math.round(A.company.own * 100) + '%')))); }
      sec('债务|Debts', A.debt, function (x) { return h('div', { class: 'row' }, h('div', { class: 'ic' }, '🧾'), h('div', { class: 'tx' }, h('div', { class: 't' }, T(x.n)), h('div', { class: 's' }, G.fm(x.amt) + ' · ' + T('年利率|APR') + ' ' + Math.round(x.r * 100) + '%')), h('button', { class: 'chip m', style: { padding: '6px 10px' }, onclick: tap(function () { var paid = G.money.repay(x, p.money); UI.toast(paid ? G.L('还了{m}|Repaid {m}', { m: G.M(paid) }) : '没钱还|No cash to repay'); rec.refresh(); }) }, T('还款|Repay'))); });
      if (!A.houses.length && !A.cars.length && !A.items.length && !A.pets.length && !invT && !A.debt.length && !A.company) b.appendChild(h('div', { class: 'empty' }, T('你还没有任何资产。|You don\'t own anything yet.')));
    });
  };
  UI.investPage = function () {
    return new Promise(function (res) {
      UI.sheet('投资理财|Investments', function (b, rec) {
        var S = G.S, A = S.assets, p = S.p, mk = S.world.mk || {};
        b.appendChild(h('div', { class: 'card' }, kv([['可用现金|Available cash', G.fm(p.money)], ['持仓总额|Portfolio', G.fm(G.sum(Object.keys(A.inv), function (k) { return A.inv[k] || 0; }))]])));
        b.appendChild(h('p', { style: { fontSize: '13px', color: 'var(--ink2)', margin: '0 2px 8px' } }, T('每过一年结算一次涨跌，会受到真实历史和世界大事影响。|Gains and losses settle each year and react to real history and world events.')));
        G.INV_KEYS.forEach(function (k) {
          var I = G.INV[k]; if (I.y0 && S.year < I.y0) return;
          var held = A.inv[k] || 0, last = mk[k];
          var bb = h('div', { style: { display: 'flex', gap: '5px', flexWrap: 'wrap', marginTop: '6px' } });
          [.1, .25, .5, 1].forEach(function (f) { bb.appendChild(h('button', { class: 'chip e', style: { padding: '5px 8px' }, onclick: tap(function () { var amt = Math.round(p.money * f); if (amt <= 0) { UI.toast('没有现金|No cash'); return; } G.money.invest(k, amt); G.audio && G.audio.sfx('coin'); rec.refresh(); }) }, T('买入|Buy ') + Math.round(f * 100) + '%')); });
          if (held > 0) [.5, 1].forEach(function (f) { bb.appendChild(h('button', { class: 'chip m', style: { padding: '5px 8px' }, onclick: tap(function () { G.money.divest(k, Math.round(held * f)); G.audio && G.audio.sfx('coin'); rec.refresh(); }) }, f === 1 ? T('全部卖出|Sell all') : T('卖出一半|Sell half'))); });
          b.appendChild(h('div', { class: 'row', style: { alignItems: 'flex-start' } }, h('div', { class: 'ic' }, I.i), h('div', { class: 'tx' }, h('div', { class: 't' }, T(I.n)), h('div', { class: 's' }, T('持有|Held') + ' ' + G.fm(held) + (last != null ? ' · ' + T('去年|Last yr') + ' ' + (last >= 0 ? '+' : '') + Math.round(last * 100) + '%' : '')), bb)));
        });
      }, { onClose: function () { res(); } });
    });
  };

  /* ===================== RELATIONSHIPS ===================== */
  var GROUPS = [
    ['伴侣|Partner', ['spouse', 'lover', 'affair']],
    ['家人|Family', ['father', 'mother', 'stepparent', 'grand', 'sibling', 'kin']],
    ['子女|Children', ['child', 'grandchild']],
    ['追求者与心动|Admirers & Crushes', ['admirer', 'crush']],
    ['对象的家人|Partner\'s Family', ['inlaw']],
    ['朋友|Friends', ['friend', 'mentor']],
    ['老师|Teachers', ['teacher', 'tutor', 'kidteacher', 'kidtutor']],
    ['同学同事|Classmates & Coworkers', ['classmate', 'colleague', 'boss']],
    ['其他|Others', ['contact', 'ex', 'enemy', 'rival', 'inmate', 'gang']]
  ];
  function npcRow(n, onTap) {
    var rom = n.rel === 'spouse' || n.rel === 'lover' || n.rel === 'affair' || n.rel === 'admirer' || n.rel === 'crush';
    var v = rom ? n.love : n.aff;
    return h('button', { class: 'row', onclick: tap(onTap) }, h('div', { class: 'avs', html: G.avatarOf(n) }),
      h('div', { class: 'tx' }, h('div', { class: 't' }, T(n.name), n.tags.length ? h('span', { class: 'chip tag' }, T({ rich: '富豪|Rich', celeb: '明星|Star', red: '权贵|Elite', royal: '王室|Royal' }[n.tags[0]])) : null, n.unread ? h('span', { class: 'badge', style: { position: 'static' } }, String(n.unread)) : null),
        h('div', { class: 's' }, T(N.relName(n)) + ' · ' + (n.alive ? T('{a}岁|{a}', { a: N.age(n) }) : T('已故|Deceased')) + ' · ' + T(n.job || ''))),
      h('div', { class: 'rt' }, h('span', null, rom ? '❤️' : '🙂'), h('div', { class: 'mini' }, h('i', { class: v < 0 ? 'neg' : '', style: { width: Math.abs(v) + '%' } }))));
  }
  UI.tabRelations = function () {
    UI.sheet('关系|Relationships', function (b, rec) {
      var all = N.all(function (n) { return n.alive; }), any = false;
      GROUPS.forEach(function (g) {
        var list = all.filter(function (n) { return g[1].indexOf(n.rel) >= 0; });
        if (!list.length) return; any = true;
        b.appendChild(h('div', { class: 'grp' }, T(g[0]) + ' ' + list.length));
        list.sort(function (a, c) { return g[1].indexOf(a.rel) - g[1].indexOf(c.rel) || c.aff - a.aff; }).forEach(function (n) { b.appendChild(npcRow(n, async function () { await UI.profile(n); rec.refresh(); })); });
      });
      var pets = G.S.assets.pets;
      if (pets.length) { b.appendChild(h('div', { class: 'grp' }, T('宠物|Pets'))); pets.forEach(function (x) { var d = G.PETS.filter(function (y) { return y.id === x.kind; })[0] || {}; b.appendChild(h('div', { class: 'row' }, h('div', { class: 'ic' }, d.i || '🐾'), h('div', { class: 'tx' }, h('div', { class: 't' }, T(x.name)), h('div', { class: 's' }, T(d.n || ''))))); }); }
      if (!any) b.appendChild(h('div', { class: 'empty' }, T('你还不认识任何人。|You don\'t know anyone yet.')));
    });
  };
  UI.profile = function (n) {
    return new Promise(function (res) {
      var md;
      function body() {
        var p = G.S.p, rom = N.canRomance(n) || n.rel === 'spouse' || n.rel === 'lover';
        var bars = h('div', { class: 'bars2' });
        [['颜值|Looks', n.looks, 'c-violet'], ['智力|Smarts', n.smarts, 'c-sky'], ['情商|EQ', n.eq, 'c-teal'], ['健康|Health', n.health, 'c-leaf'], ['好感|Affection', n.aff, 'c-gold'], rom ? ['爱意|Love', n.love, 'c-rose'] : null].forEach(function (x) {
          if (!x) return; bars.appendChild(h('div', { class: 'st' }, h('span', { class: 'l' }, T(x[0])), h('div', { class: 'bar' }, h('i', { class: x[2], style: { width: Math.abs(x[1]) + '%' } }), h('b', { class: 'num' }, String(Math.round(x[1]))))));
        });
        var hid = null;
        if (G.vip.seeSincere()) {
          var rows = [T('真心|Sincerity') + '：' + n.sincere];
          if (G.vip.seeAll()) { rows.push(T('忠诚|Loyalty') + '：' + n.loyal); if (N.canRomance(n)) rows.push(T('对你心动的概率|Attraction to you') + '：' + Math.round(N.attract(n) * 100) + '%'); }
          hid = h('div', { class: 'hidden-stats' }, '👁️ ' + rows.join('   '));
        }
        var acts = h('div', { class: 'actgrid' }, G.npcActs(n).filter(function (a) { return !a.if || a.if(); }).filter(function (a) { return !a.a || (p.age >= a.a[0] && p.age <= a.a[1]); }).map(function (a) {
          return h('button', { class: 'ab', onclick: tap(async function () {
            if (a.id === 'chat') { md.close(); res(); UI.chat(n); return; }
            await UI.doAction(a, n);
            if (!G.S.npcs[n.id] || G.S.dead) { md.close(); res(); return; }
            refresh();
          }) }, h('span', null, a.i), T(a.n), a.e ? h('div', { class: 'c' }, '⚡' + a.e) : null);
        }));
        return h('div', null,
          h('div', { class: 'prof' }, h('div', { class: 'avs', html: G.avatarOf(n) }), h('div', null, h('div', { class: 'nm' }, T(n.name)), h('div', { class: 'rl' }, T(N.relName(n))), h('div', { style: { fontSize: '13px', color: 'var(--ink2)' } }, (n.g === 'm' ? '♂ ' : '♀ ') + T('{a}岁|age {a}', { a: N.age(n) }) + '  ' + (G.C[n.c] ? G.C[n.c].flag : '')))),
          kv([['职业|Occupation', n.job || '—'], n.inc ? ['年收入|Income', G.fm(n.inc, n.c)] : null, ['身家|Wealth', T(N.wealthLabel(n)) + (G.vip.tier() >= 1 || n.rel === 'spouse' || N.family[n.rel] ? '（' + G.fm(n.wealth, n.c) + '）' : '')], ['长相|Appearance', N.looksLabel(n.looks)], ['性格|Personality', G.PERS[n.pers].n], n.married ? ['婚姻|Marital status', '已婚|Married'] : null, n.tags.length ? ['身份|Status', { rich: '富豪|Wealthy elite', celeb: '明星|Celebrity', red: '权贵子弟|Political scion', royal: '王室贵族|Royalty' }[n.tags[0]]] : null]),
          bars, hid, n.alive ? acts : h('div', { class: 'empty' }, T('{n}已经离开了人世。|{n} has passed away.', { n: n.name })));
      }
      function refresh() { var mb = md.m.querySelector('.mb'); mb.innerHTML = ''; mb.appendChild(body()); }
      md = UI.modal({ title: N.relName(n), body: body(), close: true, onClose: function () { res(); } });
    });
  };

  /* ===================== CHAT ===================== */
  UI.chatList = function () {
    UI.sheet('消息|Messages', function (b, rec) {
      var L = G.chat.list();
      if (G.chat.aiReady()) b.appendChild(h('p', { style: { fontSize: '12.5px', color: 'var(--green)', margin: '0 2px 8px' } }, T('🤖 AI 聊天已开启|🤖 AI chat is on')));
      if (!L.length) b.appendChild(h('div', { class: 'empty' }, T('还没有聊天记录。|No conversations yet.')));
      L.forEach(function (n) {
        var last = (n.chat || [])[n.chat.length - 1];
        b.appendChild(h('button', { class: 'row', onclick: tap(async function () { await UI.chat(n); rec.refresh(); }) }, h('div', { class: 'avs', html: G.avatarOf(n) }),
          h('div', { class: 'tx' }, h('div', { class: 't' }, T(n.name), h('span', { class: 'chip' }, T(N.relName(n)))), h('div', { class: 's' }, last ? T(last.t) : T('打个招呼吧|Say hello'))),
          n.unread ? h('div', { class: 'rt' }, h('span', { class: 'badge', style: { position: 'static' } }, String(n.unread))) : null));
      });
    }).noAuto = true;
  };
  UI.chat = function (n) {
    return new Promise(function (res) {
      var rec = UI.sheet(n.name, function (b) {
        b.style.padding = '0'; b.style.display = 'flex'; b.style.flexDirection = 'column'; b.style.overflow = 'hidden';
        n.unread = 0;
        var convo = h('div', { class: 'convo' });
        function draw(typing) {
          convo.innerHTML = '';
          if (!(n.chat || []).length) convo.appendChild(h('div', { class: 'bub s' }, T('和{n}说点什么吧。|Say something to {n}.', { n: n.name })));
          var lastY = null; (n.chat || []).forEach(function (m) { if (m.y != null && m.y !== lastY) { lastY = m.y; var ag = m.y - G.S.p.birthYear; convo.appendChild(h('div', { class: 'bub s when' }, G.T(ag >= 0 ? G.L('{a}岁 · {y}年|Age {a} · {y}', { a: ag, y: G.numEn(m.y) }) : G.L('{y}年|{y}', { y: G.numEn(m.y) }))));  } convo.appendChild(h('div', { class: 'bub ' + (m.f === 'me' ? 'me' : m.f === 's' ? 's' : 'n') }, T(m.t))); });
          if (typing) convo.appendChild(h('div', { class: 'typing' }, T('{n}正在输入…|{n} is typing…', { n: n.name })));
          convo.scrollTop = convo.scrollHeight;
        }
        var busy = false;
        async function send(text, intent) {
          if (busy || !text) return; busy = true;
          n.chat = n.chat || []; draw(false);
          convo.appendChild(h('div', { class: 'bub me' }, text)); convo.appendChild(h('div', { class: 'typing' }, T('{n}正在输入…|{n} is typing…', { n: n.name }))); convo.scrollTop = convo.scrollHeight;
          var wait = G.chat.aiReady() ? 0 : 500 + Math.random() * 700;
          await new Promise(function (r) { setTimeout(r, wait); });
          try { await G.chat.send(n, text, intent); } catch (e) { console.error(e); }
          busy = false; draw(false); G.audio && G.audio.sfx('msg'); G.ach.check(); G.save('auto');
        }
        var inp = h('input', { placeholder: T('输入消息…|Type a message…'), maxlength: 200, enterkeyhint: 'send' });
        inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { var t = inp.value.trim(); inp.value = ''; send(t); } });
        var qk = h('div', { class: 'qk' }, G.chat.QUICK.filter(function (q) { return !q.rom || N.canRomance(n) || n.rel === 'spouse' || n.rel === 'lover'; }).filter(function (q) { return !(q.k === 'flirt' && N.family[n.rel]); }).map(function (q) { return h('button', { onclick: tap(function () { send(T(q.s), q.k); }) }, T(q.t)); }));
        b.appendChild(convo); b.appendChild(qk);
        b.appendChild(h('div', { class: 'compose' }, inp, h('button', { onclick: tap(function () { var t = inp.value.trim(); inp.value = ''; send(t); }) }, T('发送|Send'))));
        draw(false);
      }, { onClose: function () { res(); }, right: h('button', { class: 'hbtn', 'aria-label': T('资料|Profile'), onclick: tap(function () { UI.profile(n); }) }, 'ℹ️') });
      rec.noAuto = true;
    });
  };
})();
