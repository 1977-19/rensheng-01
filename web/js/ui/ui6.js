/* Version 1.6 interface: the intelligence instinct test (always played, no skipping), confessions waiting on the
   main page, health first in the activities list, and the new illustrated portraits as the default. */
(function () {
  'use strict';
  var h = G.h, UI = G.UI, T = UI.T, tap = UI.tap, N = G.N;
  function S() { return G.S; }

  /* ---------------- the instinct test ---------------- */
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  UI.spyGame = function (o) {
    return new Promise(function (res) {
      var cases = o.cases || [], tal = o.talent || .3, idx = 0, total = 0;
      var gb = h('div', { class: 'gb', style: { overflowY: 'auto', padding: '14px 16px 24px' } });
      var host = h('div', { class: 'ghost' }, h('div', { class: 'gh' }, h('h3', null, T(o.name || '情报任务|Field Case')), h('span', { class: 'chip' }, T('直觉判断|Instinct'))), gb);
      document.body.appendChild(host);
      function show() {
        gb.innerHTML = '';
        var c = cases[idx];
        gb.appendChild(h('div', { style: { fontSize: '12.5px', color: 'var(--ink2)', marginBottom: '6px' } }, T('第{i}/{n}关 · 没有标准答案，只有直觉|Test {i} of {n} · no textbook answer, only instinct', { i: idx + 1, n: cases.length })));
        gb.appendChild(h('h4', { style: { margin: '4px 0 8px', fontFamily: 'var(--serif)', fontSize: '18px' } }, T(c.t)));
        gb.appendChild(h('div', { class: 'clue', style: { fontSize: '15px', lineHeight: '1.6', marginBottom: '12px' } }, T(c.s)));
        var opts = shuffle(c.o), wrong = opts.filter(function (x) { return x[1] === 0; }), hint = {};
        if (wrong.length && Math.random() < tal * .65) hint[wrong[0][0]] = 1;
        if (wrong.length > 1 && tal > .75 && Math.random() < tal * .5) hint[wrong[1][0]] = 1;
        var box = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } }), done = false;
        opts.forEach(function (x) {
          var b = h('button', { class: 'opt', style: hint[x[0]] ? { opacity: '.62' } : null, onclick: tap(function () {
            if (done) return; done = true; total += x[1];
            b.classList.add(x[1] >= 1 ? 'good' : x[1] > 0 ? 'good' : 'bad');
            if (x[1] < 1) Array.prototype.forEach.call(box.children, function (el, i) { if (opts[i][1] >= 1) el.classList.add('good'); });
            if (G.audio) G.audio.sfx(x[1] >= 1 ? 'win' : x[1] > 0 ? 'pop' : 'lose');
            gb.appendChild(h('div', { class: 'card', style: { marginTop: '12px' } }, h('b', null, T(x[1] >= 1 ? '直觉正确。|Your instinct was right.' : x[1] > 0 ? '不算错，但不是最好的。|Not wrong — but not the best.' : '直觉错了。|Your instinct failed you.')), h('p', { style: { margin: '6px 0 0', color: 'var(--ink2)' } }, T(c.w))));
            gb.appendChild(h('button', { class: 'big solid', style: { marginTop: '12px' }, onclick: tap(function () { idx++; if (idx < cases.length) show(); else { host.remove(); res({ score: total / cases.length }); } }) }, T(idx + 1 < cases.length ? '下一关|Next' : '完成|Done')));
            gb.scrollTop = gb.scrollHeight;
          }) }, T(x[0]), hint[x[0]] ? h('small', null, T('🔮 你的直觉：这个不对劲|🔮 Your gut: something\'s off here')) : null);
          box.appendChild(b);
        });
        gb.appendChild(box);
      }
      show();
    });
  };
  G.UI.spyGame = UI.spyGame;

  /* ---------------- confessions wait on the main page ---------------- */
  var run6 = G.runEvent;
  G.runEvent = async function (id, prm, nid) {
    var s = S();
    if (id === 'sys_admirer' && s && !UI._inbox && document.querySelector('.desk')) {
      s.inbox = (s.inbox || []).filter(function (x) { return x.nid !== nid; }); s.inbox.push({ nid: nid, y: s.year });
      var n = s.npcs[nid]; if (n) G.log('💌 {n}向你表白了。|💌 {n} confessed their feelings to you.', { n: n.name });
      return;
    }
    return run6.apply(this, arguments);
  };
  var main6 = UI.main;
  UI.main = function () {
    var r = main6.apply(this, arguments), s = S(); if (!s || !s.p) return r;
    s.inbox = (s.inbox || []).filter(function (x) { var n = s.npcs[x.nid]; if (!n || !n.alive) return false; if (s.year - x.y > 1) { if (n.rel === 'admirer') { n.rel = 'contact'; n.pin = 0; } return false; } return true; });
    var desk = document.querySelector('.desk'), diary = desk && desk.querySelector('.diary');
    var old = desk && desk.querySelector('.inbox6'); if (old) old.remove();
    if (desk && diary && s.inbox.length) {
      var box = h('div', { class: 'inbox6', style: { display: 'flex', flexDirection: 'column', gap: '6px', margin: '6px 12px' } });
      s.inbox.forEach(function (x) {
        var n = s.npcs[x.nid];
        box.appendChild(h('button', { class: 'row', style: { background: 'var(--paper2)', borderRadius: '12px' }, onclick: tap(async function () {
          if (UI.busy || G.busy) return;
          s.inbox = s.inbox.filter(function (y) { return y !== x; });
          UI._inbox = 1; try { await G.runEvent('sys_admirer', null, x.nid); } finally { UI._inbox = 0; }
          G.save('auto'); G.emit('change'); UI.main();
        }) }, h('div', { class: 'avs', html: G.avatarOf(n) }), h('div', { class: 'tx' }, h('div', { class: 't' }, '💌 ' + T('{n}向你表白了|{n} confessed to you', { n: n.name })), h('div', { class: 's' }, T('点开看看|Tap to see')))));
      });
      diary.parentNode.insertBefore(box, diary);
    }
    return r;
  };

  /* ---------------- activities: health first ---------------- */
  var AREAS = [
    ['健康|Health', ['health']],
    ['工作与事业|Work & Career', ['hustle', 'kidstar', 'service', 'spy', 'mega', 'honor', 'reign']],
    ['家庭与感情|Family & Love', ['family', 'social', 'elite']],
    ['生活|Everyday Life', ['life', 'fun', 'learn', 'travel', 'space']],
    ['灰色地带|The Gray Zone', ['gray', 'crime', 'gamble']],
    ['钱与家|Money & Home', ['money', 'shop', 'move']]
  ];
  function visibleItem(a) { var p = S().p; if (a.a && (p.age < a.a[0] || p.age > a.a[1])) return false; if (a.era && G.eraOk && !G.eraOk(a.era)) return false; if (G.statusBlocks && G.statusBlocks(a)) return false; if (a.if && !a.if()) return false; return true; }
  UI.tabActivities = function () {
    UI.sheet('活动|Activities', function (b) {
      var used = {}, wu = G.workUsed ? G.workUsed() : 0;
      b.appendChild(h('div', { class: 'wcap' }, h('span', null, T('今年工作体力|Work energy this year')), h('div', { class: 'bar' }, h('i', { class: 'c-gold', style: { width: Math.min(100, wu / G.WORK_CAP * 100) + '%' } })), h('b', null, wu + '/' + G.WORK_CAP)));
      function row(c) {
        used[c.id] = 1;
        var lock = c.lock ? c.lock() : null, n = c.items.filter(visibleItem).length;
        if (!n && !lock) return null;
        return h('button', { class: 'row' + (lock ? ' lock dis' : ''), onclick: tap(function () { if (lock) { UI.toast(lock); return; } UI.catPage(c); }) },
          h('div', { class: 'ic' }, c.i), h('div', { class: 'tx' }, h('div', { class: 't' }, T(c.n)), lock ? h('div', { class: 's wrap' }, T(lock)) : null), h('div', { class: 'rt' }, h('span', { class: 'chip' }, String(n))));
      }
      AREAS.forEach(function (ar) {
        var rows = ar[1].map(function (id) { var c = G.ACT_CATS.filter(function (x) { return x.id === id; })[0]; return c ? row(c) : null; }).filter(Boolean);
        if (!rows.length) return;
        b.appendChild(h('div', { class: 'grp' }, T(ar[0])));
        rows.forEach(function (r) { b.appendChild(r); });
      });
      var rest = G.ACT_CATS.filter(function (c) { return !used[c.id]; }).map(row).filter(Boolean);
      if (rest.length) { b.appendChild(h('div', { class: 'grp' }, T('其他|More'))); rest.forEach(function (r) { b.appendChild(r); }); }
    });
  };

  /* ---------------- the new portraits become the default once ---------------- */
  try { var st = G.settings; if (st && !st.avMig16) { if (st.avStyle !== 'classic') st.avStyle = 'art'; st.avMig16 = 1; G.saveSettings && G.saveSettings(); } } catch (e) { }
})();
