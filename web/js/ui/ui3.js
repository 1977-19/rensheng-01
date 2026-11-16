/* Your own page (tap your photo), the money ledger (tap your money), changing your name and look,
   the stories behind the Hall of Fame, and starting a child's life over from birth. */
(function () {
  'use strict';
  var h = G.h, UI = G.UI, T = UI.T, tap = UI.tap;
  function kv(rows) { var dl = h('dl', { class: 'kv' }); rows.forEach(function (r) { if (!r) return; dl.appendChild(h('dt', null, T(r[0]))); dl.appendChild(h('dd', null, typeof r[1] === 'string' ? T(r[1]) : r[1])); }); return dl; }

  /* the face you choose stays yours even if you change your name */
  var ao = G.avatarOf;
  G.avatarOf = function (x) {
    var S = G.S;
    if (S && S.p && (!x || x === S.p)) {
      var p = S.p; if (p.avSeed == null) p.avSeed = G.hash(p.name + p.birthYear);
      return G.avatar({ seed: p.avSeed, age: p.age, g: p.g, looks: p.st.looks, skin: p.skin != null ? p.skin : (p.skin = G.N.skinFor(p.country)), happy: p.st.happy, cul: p.cul || p.country, glasses: p.ill.some(function (i) { return i.id === 'myopia'; }), wreath: !!(p.flags && p.flags.wreath), dead: S.dead });
    }
    return ao.apply(this, arguments);
  };

  /* every coin an action moves is filed under that action's name */
  var da0 = UI.doAction;
  UI.doAction = async function (a, npc) {
    var prev = G.fin ? G.fin.tag : null;
    try { if (G.fin) { var nm = typeof a.n === 'function' ? a.n(npc) : a.n; G.fin.tag = npc ? G.L('{x}（{n}）|{x} ({n})', { x: nm, n: npc.name }) : nm; } return await da0.apply(this, arguments); }
    finally {
      if (G.fin) G.fin.tag = prev;
      // someone you met during this action opens now, when their buttons can actually be pressed
      if (UI.openAfter) { var w = UI.openAfter; UI.openAfter = null; setTimeout(function () { if (G.S && !G.S.dead && UI.profile) UI.profile(w); }, 120); }
    }
  };

  /* ---------------- me ---------------- */
  UI.mePage = function () {
    if (!G.S) return;
    UI.sheet('我的档案|About Me', function (b, rec) {
      var S = G.S, p = S.p;
      b.appendChild(h('div', { class: 'mehead' },
        h('div', { class: 'pol big' }, h('i', { class: 'tape' }), h('div', { class: 'av', html: G.avatarOf(p) }), h('i', { class: 'stk', html: G.skinSticker(G.skin()) })),
        h('div', { class: 'mewho' }, h('b', null, T(p.name)), h('span', null, T(G.title())), h('small', null, T('{a}岁 · {y}年|Age {a} · {y}', { a: p.age, y: S.year })),
          h('div', { class: 'mebtns' },
            h('button', { class: 'pk', onclick: tap(async function () { var t = await UI.input({ title: G.L('改名|Change Your Name'), text: G.L('新名字会出现在所有地方。|Your new name will show everywhere.'), def: p.name }); if (t && t.trim()) { p.avSeed = p.avSeed == null ? G.hash(p.name + p.birthYear) : p.avSeed; p.name = t.trim(); G.log('你改名为{n}。|You changed your name to {n}.', { n: p.name }); G.save('auto'); rec.refresh(); G.emit('change'); } }) }, T('✏️ 改名|✏️ Rename')),
            h('button', { class: 'pk', onclick: tap(function () { UI.lookPage(function () { rec.refresh(); }); }) }, T('🎨 换形象|🎨 Change Look')),
            h('button', { class: 'pk', onclick: tap(function () { UI.finance(); }) }, T('📒 财务明细|📒 Ledger')),
            h('button', { class: 'pk', onclick: tap(async function () { var o = ['het', 'gay', 'bi'], i = await UI.pick({ title: G.L('性取向|Orientation'), items: [{ t: G.L('异性恋|Straight') }, { t: G.L('同性恋|Gay') }, { t: G.L('双性恋|Bisexual') }] }); if (i >= 0 && o[i] !== p.orient) { p.orient = o[i]; G.log('你更了解自己了。|You understand yourself a little better now.'); rec.refresh(); } }) }, T('🌈 性取向|🌈 Orientation'))))));
      var cits = (p.cits && p.cits.length ? p.cits : [p.country]).map(function (c) { return G.C[c] ? G.C[c].flag + ' ' + G.T(G.C[c].n) : c; }).join('  ');
      b.appendChild(h('div', { class: 'card' }, h('h5', null, T('身份|Identity')), kv([
        ['出身|Born into', G.ORIGIN[p.origin] ? G.ORIGIN[p.origin].n : '—'],
        ['祖籍|Ancestral home', G.ancName ? G.ancName(p) : '—'],
        ['国籍|Citizenship', G.natText ? G.natText(p) : cits], ['出生地|Born in', G.bornText ? G.bornText(p) : ''],
        ['居住地|Lives in', G.residence && G.residence() !== p.country ? G.C[G.residence()].flag + ' ' + G.T(G.C[G.residence()].n) + G.T('（留学·学生签证）| (studying · student visa)') : G.T(G.C[p.country].n) + ' · ' + G.T(p.city)],
        ['性取向|Orientation', { het: '异性恋|Straight', gay: '同性恋|Gay', bi: '双性恋|Bisexual' }[p.orient] || '—'],
        S.assets.trust && S.assets.trust.amt ? ['家族信托|Family trust', G.fm(S.assets.trust.amt)] : null,
        ['手账风格|Journal', G.skinData(G.skin()).n]
      ].filter(function (r) { return r && r[1]; }))));
      (UI.statusCards ? UI.statusCards() : []).forEach(function (c) { b.appendChild(c); });
    });
  };
  UI.lookPage = function (done) {
    var p = G.S.p;
    UI.sheet('换形象|Change Look', function (b, rec) {
      if (p.avSeed == null) p.avSeed = G.hash(p.name + p.birthYear);
      b.appendChild(h('div', { class: 'grp' }, T('肤色|Skin tone')));
      b.appendChild(h('div', { class: 'skinrow' }, [0, 1, 2, 3, 4, 5].map(function (i) { return h('button', { class: 'skt s' + i + (p.skin === i ? ' on' : ''), 'aria-label': 'skin ' + i, onclick: tap(function () { p.skin = i; rec.refresh(); G.emit('change'); }) }); })));
      b.appendChild(h('div', { class: 'grp' }, T('长相（点一下就换）|Face (tap to choose)')));
      var seeds = [p.avSeed]; for (var i = 1; i < 12; i++) seeds.push(G.hash(String(p.avSeed) + '#' + i + '#' + (p.lookRoll || 0)));
      b.appendChild(h('div', { class: 'lookgrid' }, seeds.map(function (sd, i) {
        return h('button', { class: 'lk' + (i === 0 ? ' on' : ''), onclick: tap(function () { p.avSeed = sd; G.save('auto'); rec.refresh(); G.emit('change'); if (done) done(); }), html: G.avatar({ seed: sd, age: p.age, g: p.g, looks: p.st.looks, skin: p.skin, happy: 70, cul: p.cul || p.country }) });
      })));
      b.appendChild(h('button', { class: 'big', style: { width: '100%', marginTop: '10px' }, onclick: tap(function () { p.lookRoll = (p.lookRoll || 0) + 1; rec.refresh(); }) }, T('🔄 再换一批|🔄 Show more')));
    });
  };

  /* ---------------- the ledger ---------------- */
  UI.finance = function () {
    if (!G.S) return;
    UI.sheet('财务明细|Money Ledger', function (b) {
      var S = G.S, p = S.p, F = S.fin || {};
      b.appendChild(h('div', { class: 'card' }, kv([
        ['现金|Cash', G.fm(p.money)], ['总资产|Net worth', G.fm(G.netWorth())],
        G.dependent() && G.famWealth ? ['家里的钱|Family money', G.fm(G.famWealth())] : null
      ])));
      var ys = Object.keys(F).map(Number).sort(function (a, b2) { return b2 - a; });
      if (!ys.length) { b.appendChild(h('div', { class: 'empty' }, T('今年还没有收支记录。过完一年再来看看。|No records yet — check back after this year.'))); return; }
      ys.forEach(function (y) {
        var d = F[y], rows = [], tin = 0, tout = 0, tpar = 0;
        function list(obj, sign, cls) { Object.keys(obj || {}).map(function (k) { return [k, obj[k]]; }).sort(function (a, c) { return c[1] - a[1]; }).forEach(function (x) { rows.push(h('div', { class: 'fl ' + cls }, h('span', null, T(x[0])), h('b', { class: 'num' }, sign + G.fm(x[1])))); }); }
        Object.keys(d.in || {}).forEach(function (k) { tin += d.in[k]; }); Object.keys(d.out || {}).forEach(function (k) { tout += d.out[k]; }); Object.keys(d.par || {}).forEach(function (k) { tpar += d.par[k]; });
        list(d.in, '+', 'in'); list(d.out, '−', 'out');
        if (tpar) { rows.push(h('div', { class: 'fsub' }, T('家里替你付的|Paid for you by family'))); list(d.par, '', 'par'); }
        b.appendChild(h('div', { class: 'card fin' }, h('h5', null, T('{a}岁 · {y}年|Age {a} · {y}', { a: d.a, y: y }), h('span', { class: 'fnet num ' + (tin - tout >= 0 ? 'up' : 'dn') }, (tin - tout >= 0 ? '+' : '−') + G.fm(Math.abs(tin - tout)))), rows));
      });
    });
  };

  /* ---------------- main page hooks: tap your photo, tap your money ---------------- */
  var main0 = UI.main;
  UI.main = function () {
    var r = main0.apply(this, arguments);
    var hd = document.querySelector('.desk .hdr');
    if (hd && !hd._me) {
      hd._me = 1;
      hd.addEventListener('click', function (e) {
        if (UI.busy || G.busy) return;
        if (e.target.closest('.pol')) { UI.mePage(); return; }
        if (e.target.closest('.money')) { UI.finance(); }
      });
    }
    return r;
  };

  /* ---------------- hall of fame: tap a life to read it ---------------- */
  UI.lifeStory = function (r) {
    UI.sheet(T(r.name), function (b) {
      b.appendChild(h('div', { class: 'card' }, h('h5', null, T(r.title)), r.td ? h('p', { style: { margin: '0 0 8px', color: 'var(--ink2)' } }, T(r.td)) : null, kv([
        ['生卒|Lived', r.by + '–' + r.dy + ' · ' + T('{a}岁|age {a}', { a: r.age })],
        ['国家|Country', G.C[r.c] ? G.C[r.c].flag + ' ' + G.T(G.C[r.c].n) : '—'],
        r.org && G.ORIGIN[r.org] ? ['出身|Born into', G.ORIGIN[r.org].n] : null,
        r.gen > 1 ? ['世代|Generation', T('第{g}代|Gen {g}', { g: r.gen })] : null,
        r.cause ? ['死因|Cause of death', r.cause] : null,
        r.nw != null ? ['遗产|Estate', (r.cur || '') + Math.round(r.nw).toLocaleString()] : null,
        ['评分|Score', r.grade + ' · ' + r.score]
      ].filter(Boolean))));
      if (r.ep) b.appendChild(h('div', { class: 'card', style: { textAlign: 'center', fontFamily: 'var(--serif)', fontSize: '17px' } }, '“' + T(r.ep) + '”'));
      if (r.tl && r.tl.length) b.appendChild(h('div', { class: 'card' }, h('h5', null, T('一生大事|Life Story')), h('ul', { class: 'tl' }, r.tl.map(function (x) { return h('li', null, h('b', null, T('{a}岁|{a}', { a: x[0] })), h('span', null, T(x[2]))); }))));
      else b.appendChild(h('div', { class: 'empty' }, T('这段人生是在旧版本里完成的，没有留下详细记录。|This life was finished in an older version and has no detailed record.')));
    });
  };
  UI.records = function () {
    UI.sheet('名人堂|Hall of Fame', function (b) {
      var L = (G.meta.lives || []).slice().sort(function (a, b) { return b.score - a.score; });
      if (!L.length) { b.appendChild(h('div', { class: 'empty' }, T('还没有完成的人生。去活一次吧。|No finished lives yet. Go live one.'))); return; }
      b.appendChild(h('p', { class: 'hint' }, T('点一段人生，看看那一生的经历。|Tap a life to read its story.')));
      L.forEach(function (r, i) {
        b.appendChild(h('button', { class: 'row', onclick: tap(function () { UI.lifeStory(r); }) }, h('div', { class: 'ic', style: { fontFamily: 'var(--serif)', fontWeight: 700, color: i < 3 ? 'var(--red)' : 'var(--ink3)' } }, String(i + 1)),
          h('div', { class: 'tx' }, h('div', { class: 't' }, T(r.name), h('span', { class: 'chip tag' }, T(r.title))), h('div', { class: 's' }, (G.C[r.c] ? G.C[r.c].flag + ' ' : '') + r.by + '–' + r.dy + ' · ' + T('{a}岁|age {a}', { a: r.age }) + (r.gen > 1 ? ' · ' + T('第{g}代|Gen {g}', { g: r.gen }) : ''))),
          h('div', { class: 'rt' }, h('b', { class: 'redpen', style: { fontSize: '22px' } }, r.grade), h('span', null, r.score))));
      });
    });
  };

  /* ---------------- playing on as a child: now, or from the day they were born ---------------- */
  UI.chooseContinue = async function (kid) {
    var a = G.N.age(kid);
    var i = await UI.pick({ title: G.L('以{n}的身份继续|Continue as {n}', { n: kid.name }), items: [
      { t: G.L('从现在继续|Pick up from now'), sub: G.L('{n}现在{a}岁，接着过下去。|{n} is {a} now; carry on from here.', { n: kid.name, a: a }), icon: '⏩' },
      { t: G.L('从出生那天重新开始|Start over from birth'), sub: G.L('回到{y}年，{n}刚出生，你（上一世）还活着。|Back to {y}: {n} is a newborn and your previous self is still alive.', { y: kid.by, n: kid.name }), icon: '👶' }
    ] });
    if (i < 0) return false;
    if (i === 1) G.life.rebirthAs(kid); else G.life.continueAs(kid);
    return true;
  };
})();
