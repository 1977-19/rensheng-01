/* UI additions: prison screens, school choice dialogs */
(function () {
  'use strict';
  var h = G.h, UI = G.UI, T = UI.T, tap = UI.tap;
  function cageCard() {
    var j = G.S.p.jail;
    return h('div', { class: 'cagecard' }, h('div', { class: 'bars' }), h('div', { class: 'tx' },
      h('b', null, '⛓️ ' + T(j.pn || '监狱|Prison')),
      h('div', null, T('编号{no} · 罪名：{w}|No. {no} · Charge: {w}', { no: j.no || '—', w: j.why })),
      h('div', null, T('刑期{t}年，已服刑{y}年，还剩{l}年 · 改造表现{b}|{t}-year sentence · {y} served · {l} left · Conduct {b}', { t: j.tot, y: j.yrs, l: j.left, b: Math.round(j.beh) })),
      j.seized && j.seized.length ? h('div', { class: 'sz' }, T('被没收：|Seized: ') + j.seized.map(function (x) { return T(x); }).join(T('、|, '))) : null,
      h('div', { class: 'q' }, T('高墙之内，你失去了自由：不能工作、不能购物、不能旅行、不能约会，也见不到想见的人。你能做的，只有熬过每一天。|Behind these walls you have no freedom: no work, no shopping, no travel, no dates, no seeing the people you love. All you can do is get through each day.'))));
  }
  UI.cageCard = cageCard;
  var act0 = UI.tabActivities;
  UI.tabActivities = function () {
    if (!(G.S && G.S.p.jail)) return act0.apply(this, arguments);
    UI.sheet('高墙之内|Behind the Walls', function (b, rec) {
      b.appendChild(cageCard());
      b.appendChild(h('div', { class: 'grp' }, T('狱中能做的事|What you can do inside')));
      G.lifeActs().forEach(function (a) { b.appendChild(UI.actRow(a, function () { rec.refresh(); })); });
    });
  };
  var life0 = UI.tabLife;
  UI.tabLife = function () {
    if (!(G.S && G.S.p.jail)) return life0.apply(this, arguments);
    UI.sheet('人生|Life', function (b, rec) {
      b.appendChild(cageCard());
      G.lifeActs().forEach(function (a) { b.appendChild(UI.actRow(a, function () { rec.refresh(); })); });
    });
  };
  var chat0 = UI.chatList;
  UI.chatList = function () { if (G.S && G.S.p.jail) { UI.toast('监狱里没有手机，只能写信。|No phones in prison — only letters.'); return; } return chat0.apply(this, arguments); };
  var as0 = UI.tabAssets;
  UI.tabAssets = function () {
    if (G.S && !G.S.p.jail && G.famHome && (G.S.p.age < 18 || G.dependent()) && !G.S.assets.houses.some(function (x) { return x.live; })) {
      var r = as0.apply(this, arguments), shs = document.querySelectorAll('.sheet'), sb = shs.length ? shs[shs.length - 1].querySelector('.sb') : null;
      if (sb) {
        var fw = G.famWealth(), ps = G.N.rel('father', 'mother').filter(function (n) { return n.alive; });
        sb.insertBefore(h('div', { class: 'card homecard' }, h('h5', null, '🏡 ' + T('你的家|Your Home')),
          h('div', { class: 'hn' }, T(G.famHome())),
          h('p', { class: 'muted' }, T('你还没有独立，吃穿住行和看病的钱都由家里出。|You\'re not on your own yet — food, housing and doctor\'s bills are paid by your family.')),
          h('dl', { class: 'kv' }, h('dt', null, T('家庭资产|Family wealth')), h('dd', null, G.fm(fw)), h('dt', null, T('一家之主|Head of household')), h('dd', null, ps.length ? T(ps[0].name) : '—'),
            G.S.p.flags.trust ? h('dt', null, T('信托年金|Trust payout')) : null, G.S.p.flags.trust ? h('dd', null, G.fm(G.S.p.flags.trust.y) + T(' / 年| / yr')) : null)), sb.firstChild);
      }
      return r;
    }
    if (!(G.S && G.S.p.jail)) return as0.apply(this, arguments);
    UI.sheet('资产|Assets', function (b) {
      var S = G.S, p = S.p, A = S.assets;
      b.appendChild(cageCard());
      var rows = [['现金|Cash', G.fm(p.money)], ['净资产|Net worth', G.fm(G.netWorth())]];
      A.houses.forEach(function (x) { rows.push(['🏠 ' + T(x.n), G.fm(x.val) + (x.mort ? T('（房贷{m}）| (mortgage {m})', { m: G.fm(x.mort) }) : '')]); });
      if (A.company) rows.push(['🏢 ' + T(A.company.name), G.fm(A.company.val)]);
      A.debt.forEach(function (d) { rows.push(['📉 ' + T(d.n), '−' + G.fm(d.amt)]); });
      var dl = h('dl', { class: 'kv' }); rows.forEach(function (r) { dl.appendChild(h('dt', null, T(r[0]))); dl.appendChild(h('dd', null, r[1])); });
      b.appendChild(h('div', { class: 'card' }, h('h5', null, '🔒 ' + T('资产已冻结|Assets Frozen')), h('p', { class: 'muted' }, T('服刑期间，你无法买卖或处置任何财产。房贷还在照常扣款，还不上银行就会收房。|While in prison you can\'t buy, sell or touch anything. Mortgage payments keep coming — miss them and the bank takes the house.')), dl));
    });
  };

  /* ---------- home page: a little illustrated life road ---------- */
  function hero() {
    var seed = G.ri(1, 1e9), g = G.ch(.5) ? 'm' : 'f', skin = G.ri(0, 4), cul = G.pick(G.CLIST);
    var st = [[0, '👶', '出生|Born', 6, 64], [9, '🎒', '上学|School', 30, 40], [27, '💍', '成家|Love', 55, 52], [70, '🌅', '老去|Old age', 80, 26]];
    var svg = '<svg viewBox="0 0 360 190" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
      '<circle class="sun" cx="300" cy="44" r="22" fill="#ffd36b"/>' +
      '<g class="rays" stroke="#ffd36b" stroke-width="4" stroke-linecap="round">' + [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { var r = a * Math.PI / 180; return '<line x1="' + (300 + Math.cos(r) * 30) + '" y1="' + (44 + Math.sin(r) * 30) + '" x2="' + (300 + Math.cos(r) * 38) + '" y2="' + (44 + Math.sin(r) * 38) + '"/>'; }).join('') + '</g>' +
      '<g class="cloud c1" fill="#fff"><ellipse cx="60" cy="34" rx="26" ry="11"/><ellipse cx="78" cy="28" rx="16" ry="11"/><ellipse cx="46" cy="30" rx="12" ry="9"/></g>' +
      '<g class="cloud c2" fill="#fff" opacity=".85"><ellipse cx="190" cy="22" rx="20" ry="8"/><ellipse cx="203" cy="17" rx="12" ry="8"/></g>' +
      '<path d="M0 130 C60 100 120 120 180 110 C240 100 300 80 360 96 L360 190 L0 190Z" fill="#b9d98c"/>' +
      '<path d="M0 158 C70 140 140 156 210 146 C270 138 320 128 360 136 L360 190 L0 190Z" fill="#8fc36c"/>' +
      '<path d="M18 176 C80 150 110 132 150 128 C200 122 230 112 262 100 C292 90 318 80 342 64" fill="none" stroke="#fff8ea" stroke-width="5" stroke-dasharray="2 10" stroke-linecap="round"/>' +
      '<g transform="translate(150 96)"><rect x="0" y="12" width="26" height="20" fill="#f6e3c3" stroke="#6b4a2b" stroke-width="2"/><path d="M-3 13 L13 0 L29 13Z" fill="#e2725b" stroke="#6b4a2b" stroke-width="2"/><rect x="10" y="20" width="7" height="12" fill="#6b4a2b"/></g>' +
      '<g transform="translate(240 82)" fill="#5c9e4a" stroke="#3f6e33" stroke-width="2"><circle cx="0" cy="0" r="11"/><rect x="-2" y="9" width="4" height="12" fill="#6b4a2b" stroke="none"/></g>' +
      '<text x="96" y="118" font-size="14">🌼</text><text x="320" y="150" font-size="14">🌷</text><text x="30" y="128" font-size="12">🌱</text>' +
      '</svg>';
    var wrap = h('div', { class: 'hero', 'aria-hidden': 'true', html: svg });
    st.forEach(function (x, i) {
      wrap.appendChild(h('div', { class: 'hb', style: { left: x[3] + '%', top: x[4] + '%', animationDelay: (i * .45) + 's' } },
        h('div', { class: 'hav', html: G.avatar({ seed: seed + (x[0] >= 27 ? 3 : 0), age: x[0], g: g, skin: skin, cul: cul, happy: 85 }) }),
        h('span', null, x[1] + ' ' + T(x[2]))));
    });
    return wrap;
  }
  var start0 = UI.start;
  UI.start = function () {
    var r = start0.apply(this, arguments);
    var t = document.querySelector('.start .title');
    if (t && !document.querySelector('.start .hero')) t.parentNode.insertBefore(hero(), t.nextSibling);
    return r;
  };

  /* ---------- job board: every job in one place, requirements as cards ---------- */
  function reqChips(list) { return h('div', { class: 'reqs' }, list.map(function (r) { return h('span', { class: 'rq ' + (r.ok ? 'ok' : 'no') }, r.t); })); }
  function jobReqs(j) {
    var p = G.S.p, e = p.edu, out = [];
    if (j.deg) out.push({ t: '🎓 ' + T(G.DEG[j.deg]), ok: e.deg >= j.deg });
    if (j.maj) out.push({ t: '📚 ' + j.maj.map(function (m) { return T(G.MAJORS[m] ? G.MAJORS[m].n : m); }).slice(0, 2).join('/'), ok: j.maj.indexOf(e.major) >= 0 });
    if (j.req) for (var k in j.req) out.push({ t: T(G.STATS[k].n) + ' ' + j.req[k], ok: p.st[k] >= j.req[k] });
    if (j.age) out.push({ t: T('{a}岁+|Age {a}+', { a: j.age }), ok: p.age >= j.age });
    if (!out.length) out.push({ t: T('无门槛|No requirements'), ok: true });
    return out;
  }
  async function applyJob(j, rec) {
    var p = G.S.p, CR = G.career;
    if (p.energy < 15) { UI.toast('体力不够了，过完这一年再来吧。|Out of energy — finish the year to recharge.'); return; }
    var tiers = j.pt ? [0] : [0, 1, 2];
    var items = tiers.map(function (t) { var q = CR.qualifyAt(j, t), T0 = G.CO_TIER[t]; return { t: T(T0.n), icon: ['🏠', '🏢', '🏙️'][t], sub: T('{s}/年 · 录取希望{c} · |{s}/yr · chance {c} · ', { s: G.M(Math.round(CR.salary(j, 0) * T0.mult)), c: G.T(G.school && G.school.chLabel ? G.school.chLabel(q.ch) : Math.round(q.ch * 100) + '%') }) + (q.ok ? T('符合要求|Qualified') : q.miss.map(T).join(' / ')) }; });
    var i = await G.UI.pick({ title: T(j.r[0]), text: T('投给哪种公司？名校毕业生更容易进大公司。|Which kind of employer? Graduates of better universities get into bigger companies.'), items: items });
    if (i < 0) return;
    var t = tiers[i], q = CR.qualifyAt(j, t);
    p.energy -= 15;
    var r = j.pt ? { score: .6 } : await G.UI.game('quiz', { name: G.L('{j}面试|{j} Interview', { j: j.r[0] }), n: 4 });
    var ch = q.ch + (r.score - .5) * .4;
    if (G.ch(ch)) { if (p.job) CR.leave(); CR.hireAt(j, t); await G.result('录用通知|Job Offer', '{c}录用了你，职位是{j}，年薪{s}。|{c} hired you as a {j}. Salary: {s}/yr.', { c: p.job.co ? p.job.co.n : '', j: j.r[0], s: G.M(p.job.sal) }, [], '💼'); }
    else { G.addStat('happy', -3); await G.result('面试结果|Interview Result', '很遗憾，{j}的面试没有通过。|Unfortunately, you didn\'t get the {j} job.', { j: j.r[0] }, [], '📭'); }
    G.ach.check(); G.save('auto'); G.emit('change'); if (rec) rec.refresh();
  }
  UI.jobBoard = function () {
    UI.sheet('求职|Find Work', function (b, rec) {
      var p = G.S.p, e = p.edu, student = G.school.isStudent() || p.age < 18;
      var me = [{ t: '🎓 ' + T(G.DEG[e.deg] || '—'), ok: true }];
      if (e.school && e.deg >= 4) me.push({ t: '🏛️ ' + T(e.school) + ' ' + '★★★★★'.slice(0, e.tier || 1), ok: true });
      if (e.major && G.MAJORS[e.major]) me.push({ t: '📚 ' + T(G.MAJORS[e.major].n), ok: true });
      ['smarts', 'looks', 'health', 'eq'].forEach(function (k) { me.push({ t: T(G.STATS[k].n) + ' ' + Math.round(p.st[k]), ok: true }); });
      b.appendChild(h('div', { class: 'card resume' }, h('h5', null, '📄 ' + T('你的简历|Your Résumé')), reqChips(me), p.job ? h('p', { class: 'muted' }, T('现在的工作：|Current job: ') + T(G.title()) + (p.job.co ? ' · ' + T(p.job.co.n) : '')) : null));
      function fold(key, title, rows) {
        if (!rows.length) return;
        var open = !!UI.openGrp[key];
        b.appendChild(h('button', { class: 'row fold' + (open ? ' open' : ''), onclick: tap(function () { UI.openGrp[key] = !open; rec.refresh(); }) }, h('div', { class: 'tx' }, h('div', { class: 't' }, T(title))), h('div', { class: 'rt' }, h('span', { class: 'chip' }, String(rows.length)), h('span', { class: 'car' }, open ? '▴' : '▾'))));
        if (open) { var box = h('div', { class: 'foldbox' }); rows.forEach(function (x) { box.appendChild(x); }); b.appendChild(box); }
      }
      var jobs = G.JOBS.filter(function (j) { return G.jobOk(j) && (student ? j.pt && p.age >= (j.age || 16) : (!j.pt || p.age < 25)); });
      function jobRow(j) {
        var rq = jobReqs(j), ok = rq.every(function (x) { return x.ok; });
        return h('button', { class: 'row jobrow' + (ok ? '' : ' warn'), onclick: tap(function () { applyJob(j, rec); }) },
          h('div', { class: 'tx' }, h('div', { class: 't' }, T(j.r[0])), h('div', { class: 's' }, T('{a}–{b}/年|{a}–{b}/yr', { a: G.M(G.career.salary(j, 0)), b: G.M(Math.round(G.career.salary(j, 0) * 1.75)) })), reqChips(rq)),
          h('div', { class: 'rt' }, h('span', { class: 'chip e' }, '⚡15')));
      }
      if (student) fold('job:pt', '🧋 兼职|🧋 Part-time', jobs.map(jobRow));
      else G.JOBCAT.forEach(function (c) { fold('job:' + c[0], c[1], jobs.filter(function (j) { return j.cat === c[0]; }).map(jobRow)); });
      // showbiz, sport & creative careers — with their own requirement cards
      var hust = (G.ACT_CATS.filter(function (c) { return c.id === 'hustle'; })[0] || { items: [] }).items;
      var fame = hust.filter(function (a) { return a.req && visibleAct(a); }).map(function (a) {
        var rq = []; for (var k in a.req) rq.push({ t: T(G.STATS[k].n) + ' ' + a.req[k], ok: p.st[k] >= a.req[k] });
        return h('button', { class: 'row jobrow' + (rq.every(function (x) { return x.ok; }) ? '' : ' warn'), onclick: tap(function () { UI.doAction(a).then(function () { rec.refresh(); }); }) }, h('div', { class: 'ic' }, a.i), h('div', { class: 'tx' }, h('div', { class: 't' }, T(a.n)), reqChips(rq)), h('div', { class: 'rt' }, a.e ? h('span', { class: 'chip e' }, '⚡' + a.e) : null));
      });
      fold('job:fame', '🌟 演艺·体育·创作|🌟 Showbiz, Sport & Creative', fame);
      var other = hust.filter(function (a) { return ['stall', 'eshop', 'startup'].indexOf(a.id) >= 0 && visibleAct(a); });
      var svc = (G.ACT_CATS.filter(function (c) { return c.id === 'service'; })[0] || { items: [] }).items.filter(visibleAct);
      fold('job:svc2', '🎖️ 参军·从警·从政|🎖️ Military, Police & Politics', svc.map(function (a) { return UI.actRow(a, function () { rec.refresh(); }); }));
      fold('job:own', '🚀 自己干|🚀 Be Your Own Boss', other.map(function (a) { return UI.actRow(a, function () { rec.refresh(); }); }));
    });
  };
  function visibleAct(a) { var p = G.S.p; if (a.a && (p.age < a.a[0] || p.age > a.a[1])) return false; if (a.era && !G.eraOk(a.era)) return false; if (a.if && !a.if()) return false; return true; }
  // "Look for a job" opens the board (energy is spent per application instead)
  G.career.search = function () { UI.jobBoard(); };
  [(G.ACT_CATS.filter(function (c) { return c.id === 'hustle'; })[0] || {}).items, G.ACT_IDLE, G.ACT_RETIRED, G.ACT_UNI, G.ACT_JOB].forEach(function (L) { (L || []).forEach(function (a) { if (a.id === 'jobsearch') a.e = 0; }); });

  /* ---------- one page for everything about raising a child ---------- */
  UI.parentPlan = function (k) {
    UI.sheet('育儿方案|Parenting Plan', function (b, rec) {
      if (!k.alive) { b.appendChild(h('div', { class: 'empty' }, T('……|...'))); return; }
      var a = G.N.age(k), info = G.npcInfo(k);
      var dl = h('dl', { class: 'kv' });
      [['年龄|Age', T('{a}岁|{a}', { a: a })], ['职业|Occupation', T(k.job || '—')]].concat(info).forEach(function (r) { if (!r) return; dl.appendChild(h('dt', null, T(r[0]))); dl.appendChild(h('dd', null, typeof r[1] === 'string' ? T(r[1]) : r[1])); });
      var bars = h('div', { class: 'bars2' });
      [['smarts', k.smarts], ['looks', k.looks], ['health', k.health], ['eq', k.eq]].forEach(function (x) { if (x[1] == null) return; bars.appendChild(h('div', { class: 'st' }, h('span', null, T(G.STATS[x[0]].n)), h('b', null, String(Math.round(x[1]))))); });
      b.appendChild(h('div', { class: 'card' }, h('div', { class: 'prof' }, h('div', { class: 'avs', html: G.avatarOf(k) }), h('div', null, h('div', { class: 'nm' }, T(k.name)), h('div', { class: 'rl' }, T(G.N.relName(k))))), bars, dl));
      G._planAll = true; var acts; try { acts = G.npcActs(k); } finally { G._planAll = false; }
      var keep = ['kraise', 'kschool', 'kallow', 'knanny', 'kidclass', 'classes', 'homework', 'strict', 'givemoney', 'support', 'abroad', 'kvisa', 'kplace', 'kjob', 'buyhome', 'match', 'setup'];
      acts = acts.filter(function (x) { return keep.indexOf(x.id) >= 0 && (!x.if || x.if()) && (!x.a || (G.S.p.age >= x.a[0] && G.S.p.age <= x.a[1])); });
      if (acts.some(function (x) { return x.id === 'kidclass'; })) acts = acts.filter(function (x) { return x.id !== 'classes'; });
      var groups = [['成长|Growing Up', ['kraise', 'knanny', 'homework', 'strict', 'kidclass', 'classes']], ['钱|Money', ['kallow', 'givemoney', 'support', 'buyhome']], ['读书与出国|School & Abroad', ['kschool', 'abroad', 'kvisa']], ['前途|Future', ['kplace', 'kjob', 'match', 'setup']]];
      groups.forEach(function (g) {
        var list = acts.filter(function (x) { return g[1].indexOf(x.id) >= 0; }); if (!list.length) return;
        b.appendChild(h('div', { class: 'grp' }, T(g[0])));
        list.forEach(function (x) {
          var lock = x.lock ? x.lock() : null;
          b.appendChild(h('button', { class: 'row' + (lock ? ' lock dis' : ''), onclick: tap(async function () { if (lock) { UI.toast(lock); return; } await UI.doAction(x, k); rec.refresh(); }) },
            h('div', { class: 'ic' }, x.i), h('div', { class: 'tx' }, h('div', { class: 't' }, T(G.L(x.n, Object.assign({ n: k.name }, G.pr(k.g))))), lock ? h('div', { class: 's wrap' }, T(lock)) : null), h('div', { class: 'rt' }, x.e ? h('span', { class: 'chip e' }, '⚡' + x.e) : null)));
        });
      });
    });
  };
})();
