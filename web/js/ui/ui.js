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
  // guard against double taps: a second tap right after the first (or right after a dialog pops up) is ignored,
  // so a quick double tap on "Resign" can't also hit "Confirm" in the dialog that appears under your finger
  var lastOpen = 0;
  UI.guard = function () { lastOpen = Date.now(); };
  function tap(fn) { var mine = 0; return function (e) { var now = Date.now(); var gd = (G.settings && G.settings.tapDelay) || 700; if (now - lastOpen < gd || now - mine < Math.min(450, gd)) return; mine = now; if (G.audio) G.audio.sfx('tap'); G.native.haptic('light'); fn(e); }; }
  UI.tap = tap;
  // shrink text until it fits its box (long names), then allow it to wrap as a last resort
  UI.fitText = function (el, max, min) {
    if (!el || !el.parentNode) return;
    var box = el.parentNode, w = box.clientWidth - (box.children.length > 1 ? box.lastChild.offsetWidth + 8 : 0);
    el.style.fontSize = max + 'px'; el.style.whiteSpace = 'nowrap';
    for (var f = max; f > min && el.scrollWidth > w; f--) el.style.fontSize = (f - 1) + 'px';
    if (el.scrollWidth > w) { el.style.whiteSpace = 'normal'; el.style.lineHeight = '1.15'; }
  };

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
    m.style.setProperty('--tapd', (((G.settings && G.settings.tapDelay) || 700) / 1000) + 's'); veil.appendChild(m); document.body.appendChild(veil); lastOpen = Date.now();
    requestAnimationFrame(function () { veil.classList.add('on'); });
    function close() { veil.classList.remove('on'); setTimeout(function () { veil.remove(); }, 180); }
    return { el: veil, m: m, close: close };
  };
  function deltas(dl) {
    if (!dl || !dl.length) return null;
    var names = { perf: '成绩|Grades', money: '钱|Money', aff: '好感|Affection', love: '爱意|Love', fans: '粉丝|Fans', appr: '支持率|Approval', fit: '体能|Fitness', stress: '压力|Stress', karma: '品德|Karma', heat: '警方关注|Police heat', rep: '江湖地位|Street rep' };
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
        foot: [h('button', { class: 'opt solid', onclick: tap(function () { var v = inp.value.replace(/\|/g, '').trim(); if (!v && o.require) { UI.toast(T(o.require)); inp.focus(); return; } md.close(); res(v ? v + '|' + v : null); }) }, T('确定|Confirm'))] });
    });
  };
  /* money amount picker: free input + quick presets; resolves to a number (local currency) or null */
  UI.amount = function (o) {
    return new Promise(function (res) {
      var max = Math.max(0, Math.floor(o.max || 0)), done = false;
      var inp = h('input', { class: 'inp', type: 'number', inputmode: 'numeric', min: '0', placeholder: T('输入金额|Enter an amount'), value: o.def ? String(Math.round(o.def)) : '' });
      var presets = (o.presets || [.01, .05, .1, .25, .5, 1]).map(function (f) { var v = Math.floor(max * f); return h('button', { class: 'sug', onclick: tap(function () { inp.value = String(v); }) }, (f >= 1 ? T('全部|All') : Math.round(f * 100) + '%') + ' · ' + G.fm(v)); });
      var md = UI.modal({ title: o.title, close: true, onClose: function () { if (!done) res(null); }, body: h('div', null,
        o.text ? h('div', { class: 'txt', style: { marginBottom: '8px' } }, T(o.text)) : null,
        h('div', { style: { fontSize: '13px', color: 'var(--ink2)', marginBottom: '6px' } }, T('可用：|Available: ') + G.fm(max)),
        inp, h('div', { class: 'sugs' }, presets)),
        foot: [h('button', { class: 'opt solid', onclick: tap(function () { var v = Math.floor(+inp.value || 0); if (v <= 0 && !(o.zero && inp.value !== '')) { UI.toast('请输入金额|Enter an amount'); return; } if (v > max) { UI.toast('钱不够|Not enough money'); return; } done = true; md.close(); res(v); }) }, T('确定|Confirm'))] });
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
  // decisions that change a life: always ask first
  UI.BIG = {
    gquit: '辞去公职后，多年的资历就清零了。确定吗？|Resigning from public office wipes out years of seniority. Are you sure?',
    pquit: '辞去警职后就再也回不去了。确定吗？|Once you leave the force there\'s no going back. Are you sure?',
    discharge: '退役后军衔和待遇都会失去。确定吗？|You\'ll lose your rank and benefits. Are you sure?',
    fquit: '退圈后粉丝会散去，名气也会慢慢消失。确定吗？|Your fans will drift away and your fame will fade. Are you sure?',
    dropout: '退学以后就只有现在的学历了。确定吗？|Drop out and this is the highest schooling you\'ll have. Are you sure?',
    udrop: '退学以后拿不到学位。确定吗？|Drop out and you won\'t get your degree. Are you sure?',
    sell: '公司卖掉就不再属于你了。确定吗？|Once sold, the company is no longer yours. Are you sure?',
    emigrate: '移民会离开熟悉的一切，工作也会丢掉。确定吗？|Emigrating means leaving everything familiar — including your job. Are you sure?',
    escape: '越狱一旦失败，刑期会大大增加。确定吗？|A failed escape adds years to your sentence. Are you sure?',
    breakup: '确定要和{n}分手吗？|Are you sure you want to break up with {n}?',
    divorce: '确定要和{n}离婚吗？财产可能要分走一半。|Are you sure you want to divorce {n}? You may lose half of everything.',
    block: '确定要和{n}断绝来往吗？|Are you sure you want to cut ties with {n}?',
    payoff: '确定要用钱打发{n}吗？|Are you sure you want to pay {n} to leave?',
    unkeep: '确定不再养着{n}了吗？|Are you sure you want to stop supporting {n}?',
    ack: '公开承认{n}，你的配偶和所有人都会知道。确定吗？|Acknowledging {n} means your spouse — and everyone — will know. Are you sure?',
    cut: '确定要把{n}从遗嘱里除名吗？|Are you sure you want to cut {n} out of your will?',
    gy_quit: '金盆洗手后，这条路就断了。确定吗？|Walk away and that road closes for good. Are you sure?',
    dismiss: true
  };
  UI.doAction = async function (a, npc) {
    if (UI.busy || G.busy || !G.S || G.S.dead) return;
    var p = G.S.p, e = a.e || 0, price = (!npc && a.$) ? G.$(a.$) : 0;
    if (a.lock && a.lock()) { UI.toast(a.lock()); return; }
    if (p.energy < e) { UI.toast('体力不够了，过完这一年再来吧。|Out of energy — finish the year to recharge.'); G.audio && G.audio.sfx('bad'); return; }
    if (price && !(G.canPay ? G.canPay(price) : p.money >= price)) { UI.toast(G.L('钱不够，需要{m}。|Not enough money — you need {m}.', { m: G.M(price) })); G.audio && G.audio.sfx('bad'); return; }
    var big = a.confirm || UI.BIG[a.id];
    if (big && !G.settings.autoGame) {
      var nm = typeof a.n === 'function' ? a.n(npc) : a.n;
      var txt = typeof big === 'string' ? G.L(big, { n: npc ? npc.name : '' }) : G.L('确定要「{a}」吗？这个决定很难挽回。|Are you sure you want to "{a}"? This is hard to undo.', { a: nm });
      if (!(await UI.confirm(nm, txt))) return;
      if (UI.busy || G.busy || !G.S || G.S.dead) return;
    }
    UI.busy = true;
    p.energy -= e; var by = null; if (price) { by = G.charge ? G.charge(price) : (G.addMoney(-price), 'self'); if (by === 'par') UI.toast(G.L('爸妈帮你付了{m}|Your parents paid {m}', { m: G.M(price) })); }
    try {
      var r = npc ? await a.run(npc, a) : await a.run(a);
      if (r === 'cancel') { p.energy += e; if (price) { if (G.refund) G.refund(price, by); else G.addMoney(price); } }
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
