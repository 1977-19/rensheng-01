/* UI framework: element builder, modals, sheets, toasts, action runner, game host */
(function () {
  'use strict';
  var T = function (s, p) { return G.T(s, p); };
  function h(tag, a) {
    var el = document.createElement(tag), i, k;
    if (a) for (k in a) {
      var v = a[k]; if (v == null || v === false) continue;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'style' && typeof v === 'object') { for (var s in v) el.style[s] = v[s]; }
      else if (k.slice(0, 2) === 'on') el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    }
    for (i = 2; i < arguments.length; i++) add(el, arguments[i]);
    return el;
  }
  function add(el, c) {
    if (c == null || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { add(el, x); }); return; }
    el.appendChild(c.nodeType ? c : document.createTextNode(String(c)));
  }
  G.h = h;
  var UI = G.UI = {};
  UI.T = T;
  function tap(fn) { return function (e) { if (G.audio) G.audio.sfx('tap'); G.native.haptic('light'); fn(e); }; }
  UI.tap = tap;

  /* ---------- toast ---------- */
  var toastBox;
  UI.toast = function (msg) {
    if (!toastBox) { toastBox = h('div', { class: 'toasts' }); document.body.appendChild(toastBox); }
    var t = h('div', { class: 'toast' }, T(msg)); toastBox.appendChild(t);
    setTimeout(function () { t.remove(); }, 2600);
  };

  /* ---------- modal ---------- */
  UI.modal = function (o) {
    // o: {title, icon, kind, body (node), foot (node), close: bool, onClose}
    var veil = h('div', { class: 'veil', role: 'dialog', 'aria-modal': 'true' });
    var m = h('div', { class: 'modal ' + (o.kind || '') });
    var head = h('div', { class: 'mh' }, o.icon ? h('div', { class: 'ic' }, o.icon) : null, h('h3', null, T(o.title || '')),
      o.close ? h('button', { class: 'x', 'aria-label': T('关闭|Close'), onclick: tap(function () { close(); o.onClose && o.onClose(); }) }, '✕') : null);
    m.appendChild(head);
    if (o.body) m.appendChild(h('div', { class: 'mb' }, o.body));
    if (o.foot) m.appendChild(h('div', { class: 'mf' }, o.foot));
    veil.appendChild(m); document.body.appendChild(veil);
    requestAnimationFrame(function () { veil.classList.add('on'); });
    function close() { veil.classList.remove('on'); setTimeout(function () { veil.remove(); }, 180); }
    return { el: veil, m: m, close: close };
  };
  function deltas(dl) {
    if (!dl || !dl.length) return null;
    var names = { money: '钱|Money', aff: '好感|Affection', love: '爱意|Love', fans: '粉丝|Fans', appr: '支持率|Approval', fit: '体能|Fitness', stress: '压力|Stress', karma: '品德|Karma', heat: '警方关注|Police heat', rep: '江湖地位|Street rep' };
    return h('div', { class: 'deltas' }, dl.map(function (d) {
      if (d.k === 'note') return h('span', { class: 'dl note' }, T(d.x));
      var nm = G.STATS[d.k] ? G.STATS[d.k].n : names[d.k] || d.k;
      var good = d.n > 0; if (d.k === 'stress' || d.k === 'heat') good = !good;
      var v = d.k === 'money' ? G.fm(Math.abs(d.n)) : d.k === 'fans' ? Math.abs(Math.round(d.n)).toLocaleString() : Math.abs(Math.round(d.n));
      if (v === 0 || v === '0') return null;
      return h('span', { class: 'dl ' + (good ? 'up' : 'dn') }, T(nm) + ' ' + (d.n > 0 ? '+' : '−') + v);
    }));
  }
  UI.deltas = deltas;
  function npcHead(n) { if (!n) return null; return h('div', { class: 'npchead' }, h('div', { class: 'avs', html: G.avatarOf(n) }), h('div', null, h('b', null, T(n.name)), h('div', { style: { fontSize: '12.5px', color: 'var(--ink2)' } }, T(G.N.relName(n)) + ' ' + T('{a}岁|age {a}', { a: G.N.age(n) })))); }
  UI.event = function (o) {
    return new Promise(function (res) {
      var btns = o.opts.map(function (op, i) {
        return h('button', { class: 'opt' + (o.opts.length === 1 ? ' solid' : ''), disabled: op.dis || null, onclick: tap(function () { md.close(); res(i); }) }, T(op.t), op.sub ? h('small', null, T(op.sub)) : null);
      });
      var md = UI.modal({ title: o.title, icon: o.icon, kind: o.kind, body: h('div', null, npcHead(o.npc), h('div', { class: 'txt' }, T(o.text)), deltas(o.d)), foot: btns });
      if (G.audio) G.audio.sfx(o.kind === 'sad' ? 'bell' : 'pop');
    });
  };
  UI.result = function (o) {
    if (!o.text && (!o.d || !o.d.length)) return Promise.resolve();
    return new Promise(function (res) {
      var good = (o.d || []).reduce(function (s, d) { return s + (d.k === 'note' ? 0 : (d.k === 'stress' || d.k === 'heat' ? -1 : 1) * Math.sign(d.n)); }, 0);
      if (G.audio) G.audio.sfx(good > 0 ? 'ok' : good < 0 ? 'bad' : 'pop');
      var md = UI.modal({ title: o.title, icon: o.icon, body: h('div', null, o.text ? h('div', { class: 'txt' }, T(o.text)) : null, deltas(o.d)), foot: [h('button', { class: 'opt solid', onclick: tap(function () { md.close(); res(); }) }, T('好的|OK'))] });
    });
  };
  UI.pick = function (o) {
    return new Promise(function (res) {
      var list = h('div', null, o.text ? h('div', { class: 'txt', style: { marginBottom: '10px', fontSize: '14px', color: 'var(--ink2)' } }, T(o.text)) : null,
        o.items.map(function (it, i) {
          return h('button', { class: 'row' + (it.dis ? ' dis' : ''), disabled: it.dis || null, onclick: tap(function () { md.close(); res(i); }) },
            it.npc ? h('div', { class: 'avs', html: G.avatarOf(it.npc) }) : it.icon ? h('div', { class: 'ic' }, it.icon) : null,
            h('div', { class: 'tx' }, h('div', { class: 't' }, T(it.t)), it.sub ? h('div', { class: 's wrap' }, T(it.sub)) : null));
        }));
      var md = UI.modal({ title: o.title, body: list, close: !o.noCancel, onClose: function () { res(-1); } });
    });
  };
  UI.input = function (o) {
    return new Promise(function (res) {
      var inp = h('input', { class: 'inp', value: T(o.def || ''), maxlength: 24 });
      var sugs = (o.sug || []).map(function (s) { return h('button', { class: 'sug', onclick: tap(function () { inp.value = T(s); }) }, T(s)); });
      var md = UI.modal({ title: o.title, body: h('div', null, o.text ? h('div', { class: 'txt', style: { marginBottom: '10px' } }, T(o.text)) : null, inp, h('div', { class: 'sugs' }, sugs)),
        foot: [h('button', { class: 'opt solid', onclick: tap(function () { var v = inp.value.replace(/\|/g, '').trim(); md.close(); res(v ? v + '|' + v : null); }) }, T('确定|Confirm'))] });
    });
  };
  UI.confirm = function (title, text) { return UI.event({ title: title, text: text, opts: [{ t: '确定|Yes' }, { t: '取消|Cancel' }] }).then(function (i) { return i === 0; }); };

  /* ---------- sheets (stacked full-screen pages) ---------- */
  var stack = [];
  UI.sheet = function (title, build, opts) {
    opts = opts || {};
    var body = h('div', { class: 'sb' });
    var sh = h('div', { class: 'sheet' },
      h('div', { class: 'sh' }, h('button', { class: 'back', 'aria-label': T('返回|Back'), onclick: tap(function () { pop(); }) }, '‹'), h('h3', null, T(title)), opts.right || h('div', { class: 'sp' })), body);
    var rec = { el: sh, body: body, build: build, onClose: opts.onClose, refresh: function () { var y = body.scrollTop; body.innerHTML = ''; build(body, rec); body.scrollTop = y; } };
    stack.push(rec);
    document.body.appendChild(sh);
    build(body, rec);
    requestAnimationFrame(function () { sh.classList.add('on'); });
    function pop() { UI.popSheet(rec); }
    return rec;
  };
  UI.popSheet = function (rec) {
    rec = rec || stack[stack.length - 1]; if (!rec) return;
    stack = stack.filter(function (x) { return x !== rec; });
    rec.el.classList.remove('on'); setTimeout(function () { rec.el.remove(); }, 260);
    if (rec.onClose) rec.onClose();
    G.emit('change');
  };
  UI.closeAllSheets = function () { stack.slice().forEach(function (r) { UI.popSheet(r); }); };
  UI.refreshSheets = function () { stack.forEach(function (r) { if (!r.noAuto) r.refresh(); }); };

  /* ---------- action runner ---------- */
  UI.busy = false;
  UI.doAction = async function (a, npc) {
    if (UI.busy || G.busy || !G.S || G.S.dead) return;
    var p = G.S.p, e = a.e || 0, price = (!npc && a.$) ? G.$(a.$) : 0;
    if (a.lock && a.lock()) { UI.toast(a.lock()); return; }
    if (p.energy < e) { UI.toast('体力不够了，过完这一年再来吧。|Out of energy — finish the year to recharge.'); G.audio && G.audio.sfx('bad'); return; }
    if (price && p.money < price) { UI.toast(G.L('钱不够，需要{m}。|Not enough money — you need {m}.', { m: G.M(price) })); G.audio && G.audio.sfx('bad'); return; }
    UI.busy = true;
    p.energy -= e; if (price) G.addMoney(-price);
    try {
      var r = npc ? await a.run(npc, a) : await a.run(a);
      if (r === 'cancel') { p.energy += e; if (price) G.addMoney(price); }
      G.ach.check();
      G.save('auto');
    } catch (err) { console.error(err); UI.toast('出错了：|Error: ' + (err && err.message)); }
    UI.busy = false;
    G.emit('change');
    if (G.S.dead) { UI.closeAllSheets(); await G.ending.run(); }
  };

  /* ---------- game host ---------- */
  G.GAMES = G.GAMES || {};
  UI.game = function (id, o) {
    o = o || {};
    var g = G.GAMES[id];
    var auto = function () { return G.simGame(id, o); };
    if (!g || G.settings.autoGame) return Promise.resolve(auto());
    return new Promise(function (res) {
      var gb = h('div', { class: 'gb' });
      var host = h('div', { class: 'ghost' }, h('div', { class: 'gh' }, h('h3', null, T(o.name || g.n)), h('span', { class: 'chip' }, T(g.n))), gb);
      document.body.appendChild(host);
      var done = function (r) { r = r || { score: 0 }; r.score = G.clamp(r.score || 0, 0, 1); if (r.win == null) r.win = r.score >= .5; if (G.audio) G.audio.sfx(r.win ? 'win' : 'lose'); G.native.haptic(r.win ? 'success' : 'error'); setTimeout(function () { host.remove(); res(r); }, 650); };
      var intro = h('div', { class: 'intro' }, h('div', { class: 'e' }, g.i), h('p', null, T(g.how)),
        h('button', { class: 'big solid', onclick: tap(function () { gb.innerHTML = ''; try { g.play(gb, o, done); } catch (e) { console.error(e); done(auto()); } }) }, T('开始|Start')),
        h('button', { class: 'big', onclick: tap(function () { host.remove(); res(auto()); }) }, T('跳过，按能力自动结算|Skip — auto-resolve by stats')));
      gb.appendChild(intro);
    });
  };
  /* auto-resolve a mini-game from stats */
  G.simGame = function (id, o) {
    var p = G.S ? G.S.p : { st: { smarts: 50, health: 50, eq: 50, looks: 50 }, h: { fit: 30 } }, st = p.st;
    var base = { quiz: st.smarts, exam: st.smarts, math: st.smarts, memory: st.smarts * .7 + st.eq * .3, detective: st.smarts * .6 + st.eq * .4,
      penalty: (st.health + p.h.fit) / 2, basketball: (st.health + p.h.fit) / 2, sprint: p.h.fit * .6 + st.health * .4, shooting: p.h.fit * .5 + st.smarts * .3 + 10,
      fight: p.h.fit * .5 + st.health * .3 + (G.skill ? G.skill('fight') * .3 : 0), driving: st.smarts * .4 + 25, rhythm: st.eq * .4 + (G.skill ? G.skill('music') * .4 : 0) + 15,
      policy: st.smarts * .5 + st.eq * .5, blackjack: 45, dice: 48, mahjong: st.smarts * .3 + 30 }[id] || 50;
    if (o && o.hard) base -= 12;
    var sc = G.clamp(G.nrm(base / 100, .15), 0, 1);
    var r = { score: sc, win: sc >= .5 };
    if (id === 'blackjack' || id === 'dice') { var w = G.ch(G.has('gambler') ? .55 : .46); r = { score: w ? 1 : 0, win: w, mult: w ? 2 : 0 }; }
    if (id === 'mahjong') { var w2 = G.ch(.25 + (G.has('gambler') ? .1 : 0)); r = { score: w2 ? 1 : .2, win: w2, mult: w2 ? 3 : 0 }; }
    return r;
  };
})();
