/* Action & table games: penalty, basketball, reaction dash, shooting, fight, driving, rhythm, blackjack, dice, mahjong */
(function () {
  'use strict';
  var h = function () { return G.h.apply(null, arguments); }, T = function (s, p) { return G.T(s, p); };
  var GM = G.GAMES = G.GAMES || {};
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function sfx(k) { if (G.audio) G.audio.sfx(k); }
  function stat() { var p = G.S ? G.S.p : null; return p ? { fit: p.h.fit, health: p.st.health, smarts: p.st.smarts, fight: G.skill('fight'), music: G.skill('music') } : { fit: 40, health: 70, smarts: 50, fight: 0, music: 0 }; }
  function canvas(el) {
    var c = h('canvas'); el.appendChild(c);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    function fit() { var r = c.getBoundingClientRect(); c.width = Math.max(1, r.width * dpr); c.height = Math.max(1, r.height * dpr); }
    fit();
    var ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
    return { c: c, ctx: ctx, w: function () { return c.width / dpr; }, hh: function () { return c.height / dpr; } };
  }
  function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim() || '#333'; }
  function msg(el, text) { var m = h('div', { style: { textAlign: 'center', fontWeight: 700, fontSize: '18px', minHeight: '28px', padding: '6px' } }, T(text || '')); el.appendChild(m); return function (t) { m.textContent = T(t); }; }

  /* ---------- penalty kicks ---------- */
  GM.penalty = { n: '点球|Penalty Kicks', i: '⚽', how: '箭头会左右移动，看准时机点击射门。越靠近门柱越难扑，但也可能打偏。|The arrow sweeps side to side. Tap to shoot. Corners are hard to save — but you might miss.',
    play: function (el, o, done) {
      var shots = 0, goals = 0, x = 0, dir = 1, busy = false, speed = o.hard ? 2.4 : 1.7;
      var hud = h('div', { class: 'ghud' }, h('span', null, T('第1球|Shot 1')), h('span', null, '⚽ 0'));
      var goal = h('div', { style: { position: 'relative', margin: '20px 14px', height: '170px', border: '6px solid var(--ink)', borderBottom: '0', borderRadius: '6px 6px 0 0', background: 'repeating-linear-gradient(90deg, transparent 0 18px, var(--grid2) 18px 19px), repeating-linear-gradient(0deg, transparent 0 18px, var(--grid2) 18px 19px)' } });
      var keeper = h('div', { style: { position: 'absolute', bottom: '0', left: '50%', fontSize: '54px', transform: 'translateX(-50%)', transition: 'left .25s' } }, '🧤');
      var ball = h('div', { style: { position: 'absolute', bottom: '-70px', left: '50%', fontSize: '34px', transform: 'translateX(-50%)', transition: 'all .3s' } }, '⚽');
      var arrow = h('div', { style: { position: 'absolute', top: '-34px', fontSize: '26px', transform: 'translateX(-50%)' } }, '⬇️');
      goal.appendChild(keeper); goal.appendChild(ball); goal.appendChild(arrow);
      var say = null;
      el.appendChild(hud); el.appendChild(goal); el.appendChild(h('div', { style: { height: '70px' } })); say = msg(el, '');
      var btn = h('button', { class: 'go' }, T('射门！|Shoot!'));
      el.appendChild(h('div', { class: 'gctl' }, btn));
      var raf;
      function loop() { if (!busy) { x += dir * speed; if (x > 100) { x = 100; dir = -1; } if (x < 0) { x = 0; dir = 1; } arrow.style.left = x + '%'; } raf = requestAnimationFrame(loop); }
      loop();
      btn.onclick = function () {
        if (busy) return; busy = true; sfx('pop');
        var zone = x < 12 ? 0 : x < 38 ? 1 : x < 62 ? 2 : x < 88 ? 3 : 4, kz = rnd(1, 3);
        if (Math.random() < .25 + stat().fit / 400) kz = Math.random() < .5 ? kz : rnd(1, 3);
        var kx = [10, 25, 50, 75, 90][kz === 1 ? 1 : kz === 2 ? 2 : 3];
        keeper.style.left = kx + '%'; ball.style.left = x + '%'; ball.style.bottom = '90px';
        var res;
        if ((zone === 0 || zone === 4) && Math.random() < .35) res = 'miss';
        else if ((zone <= 1 && kz === 1) || (zone === 2 && kz === 2) || (zone >= 3 && kz === 3)) res = Math.random() < (zone === 2 ? .9 : .65) ? 'save' : 'goal';
        else res = 'goal';
        shots++; if (res === 'goal') { goals++; sfx('ok'); } else sfx('bad');
        say(res === 'goal' ? '球进了！|GOAL!' : res === 'save' ? '被扑出去了！|Saved!' : '打偏了！|Wide!');
        hud.firstChild.textContent = T('第{n}球|Shot {n}', { n: Math.min(5, shots + 1) }); hud.lastChild.textContent = '⚽ ' + goals;
        setTimeout(function () {
          if (shots >= 5) { cancelAnimationFrame(raf); done({ score: goals / 5 }); return; }
          keeper.style.left = '50%'; ball.style.left = '50%'; ball.style.bottom = '-70px'; say(''); busy = false;
        }, 900);
      };
    } };

  /* ---------- basketball ---------- */
  GM.basketball = { n: '投篮|Free Throws', i: '🏀', how: '力度条会来回摆动，在绿色区域点击投篮。每投一球，绿区都会变窄。|The power bar swings back and forth. Tap in the green zone. It narrows with every shot.',
    play: function (el, o, done) {
      var shots = 0, made = 0, v = 0, dir = 1, busy = false, zone = 26;
      var hud = h('div', { class: 'ghud' }, h('span', null, '🏀 0/5'), h('span', null, ''));
      var meter = h('div', { style: { position: 'relative', margin: '40px 40px 20px', height: '34px', borderRadius: '17px', background: 'var(--grid)', overflow: 'hidden' } });
      var green = h('div', { style: { position: 'absolute', top: 0, bottom: 0, background: 'rgba(78, 165, 106, .55)' } });
      var needle = h('div', { style: { position: 'absolute', top: 0, bottom: 0, width: '4px', background: 'var(--red)' } });
      meter.appendChild(green); meter.appendChild(needle);
      var hoop = h('div', { style: { textAlign: 'center', fontSize: '80px', marginTop: '20px' } }, '🏀');
      el.appendChild(hud); el.appendChild(hoop); el.appendChild(meter); var say = msg(el, '');
      var btn = h('button', { class: 'go' }, T('投篮！|Shoot!')); el.appendChild(h('div', { class: 'gctl' }, btn));
      var center = rnd(35, 65);
      function place() { green.style.left = (center - zone / 2) + '%'; green.style.width = zone + '%'; }
      place();
      var raf, sp = o.hard ? 2.2 : 1.6;
      function loop() { if (!busy) { v += dir * sp; if (v > 100) { v = 100; dir = -1; } if (v < 0) { v = 0; dir = 1; } needle.style.left = v + '%'; } raf = requestAnimationFrame(loop); }
      loop();
      btn.onclick = function () {
        if (busy) return; busy = true;
        var ok = Math.abs(v - center) <= zone / 2 + stat().fit / 60;
        shots++; if (ok) { made++; sfx('ok'); say('唰！空心入网！|Swish!'); hoop.textContent = '🏀🗑️'; } else { sfx('bad'); say('打铁了……|Clank...'); hoop.textContent = '💨'; }
        hud.firstChild.textContent = '🏀 ' + made + '/' + shots;
        setTimeout(function () { if (shots >= 5) { cancelAnimationFrame(raf); done({ score: made / 5 }); return; } zone = Math.max(8, zone - 4); center = rnd(30, 70); place(); hoop.textContent = '🏀'; say(''); busy = false; }, 800);
      };
    } };

  /* ---------- reaction dash (replaces the old tap-race, which was unreliable on phones) ---------- */
  GM.sprint = { n: '反应冲刺|Reaction Dash', i: '🚦', how: '等信号灯变绿再点！抢跑算犯规。共三轮，反应越快越好。|Wait for the light to turn green, then tap! Jumping early is a false start. Three rounds — the faster the better.',
    play: function (el, o, done) {
      var round = 0, scores = [], state = 'idle', t0 = 0, timer = null, st = stat(), finished = false;
      var hud = h('div', { class: 'ghud' }, h('span', null, T('第1轮|Round 1')), h('span', null, ''));
      var light = h('div', { style: { width: '150px', height: '150px', borderRadius: '50%', margin: '34px auto 16px', background: '#7a6a60', border: '8px solid var(--brown)', boxShadow: 'inset 0 -8px 0 rgba(0,0,0,.2)', transition: 'background .08s' } });
      el.appendChild(hud); el.appendChild(light); var say = msg(el, '准备……|Get ready...');
      var btn = h('button', { class: 'go', style: { minHeight: '84px', fontSize: '22px' } }, T('冲！|GO!'));
      el.appendChild(h('div', { class: 'gctl' }, btn));
      function finish() { if (finished) return; finished = true; clearTimeout(timer); var sum = scores.reduce(function (a, b) { return a + b; }, 0); done({ score: sum / 3 }); }
      function next() {
        if (round >= 3) { setTimeout(finish, 700); return; }
        state = 'wait'; light.style.background = '#d0453a'; say('盯住信号灯……|Watch the light...');
        hud.firstChild.textContent = T('第{n}轮|Round {n}', { n: round + 1 });
        timer = setTimeout(function () { state = 'go'; t0 = Date.now(); light.style.background = '#4fbf5a'; sfx('pop'); timer = setTimeout(function () { if (state === 'go') record(1200); }, 1200); }, 900 + Math.random() * 1800);
      }
      function record(ms) {
        clearTimeout(timer); state = 'idle'; round++;
        var bonus = st.fit / 900, sc = ms <= 0 ? 0 : Math.max(0, Math.min(1, (700 - ms) / 480 + bonus + (o.hard ? -.08 : 0)));
        scores.push(sc); hud.lastChild.textContent = scores.map(function (x) { return x >= .6 ? '🟢' : x >= .3 ? '🟡' : '🔴'; }).join(' ');
        light.style.background = '#7a6a60';
        say(ms <= 0 ? '抢跑犯规！|False start!' : T('{t} 毫秒|{t} ms', { t: ms }));
        sfx(sc >= .5 ? 'ok' : 'bad'); setTimeout(next, 900);
      }
      btn.onclick = function () {
        if (finished) return;
        if (state === 'wait') record(0);
        else if (state === 'go') record(Date.now() - t0);
      };
      setTimeout(next, 600);
    } };

  /* ---------- shooting range ---------- */
  GM.shooting = { n: '射击|Shooting Range', i: '🎯', how: '靶子会随机出现，在它消失前点中它。|Targets pop up at random. Tap them before they vanish.',
    play: function (el, o, done) {
      var hits = 0, spawned = 0, total = 14, life = o.hard ? 900 : 1150 - stat().fit * 2;
      var hud = h('div', { class: 'ghud' }, h('span', null, '🎯 0/' + total), h('span', null, ''));
      var field = h('div', { style: { position: 'relative', flex: 1, margin: '6px 14px 14px', border: '2px dashed var(--grid2)', borderRadius: '14px', overflow: 'hidden' } });
      el.appendChild(hud); el.appendChild(field);
      function spawn() {
        if (spawned >= total) { setTimeout(function () { done({ score: hits / total }); }, 500); return; }
        spawned++;
        var t = h('button', { style: { position: 'absolute', left: rnd(5, 80) + '%', top: rnd(5, 80) + '%', fontSize: '42px', lineHeight: 1 } }, '🎯');
        var gone = false;
        t.addEventListener('pointerdown', function (e) { e.preventDefault(); if (gone) return; gone = true; hits++; sfx('pop'); G.native.haptic('light'); t.textContent = '💥'; setTimeout(function () { t.remove(); }, 150); hud.firstChild.textContent = '🎯 ' + hits + '/' + total; });
        field.appendChild(t);
        setTimeout(function () { if (!gone) { gone = true; t.remove(); } }, life);
        setTimeout(spawn, life * .75 + rnd(0, 250));
      }
      setTimeout(spawn, 500);
    } };

  /* ---------- fight ---------- */
  GM.fight = { n: '格斗|Fight', i: '👊', how: '观察对手的动作：防御能挡攻击，重击能破防，闪避看运气。把对手打倒！|Read your opponent: guard blocks attacks, heavy blows break guard, dodging is a gamble. Knock them out!',
    play: function (el, o, done) {
      var st = stat(), me = 100, foe = o.hard ? 125 : 100, foeMax = foe, turn = 0, busy = false;
      var pw = 1 + st.fit / 150 + st.fight / 120 + (G.has && G.has('fighter') ? .25 : 0) + (G.has && G.has('ruthless') ? .1 : 0);
      var hud = h('div', { class: 'ghud' }, h('span', null, '❤️ ' + me), h('span', null, '👹 ' + foe));
      var arena = h('div', { style: { textAlign: 'center', fontSize: '64px', margin: '20px 0 6px' } }, '🧍  ⚔️  🧟');
      el.appendChild(hud); el.appendChild(arena); var say = msg(el, '');
      var intentEl = h('div', { style: { textAlign: 'center', color: 'var(--ink2)', minHeight: '24px' } }); el.appendChild(intentEl);
      var intent;
      var TELL = { atk: '对手握紧了拳头……|Your opponent clenches a fist...', heavy: '对手在蓄力！|Your opponent is winding up!', guard: '对手护住了要害。|Your opponent covers up.' };
      function pick() { var r = Math.random(); intent = r < .45 ? 'atk' : r < .7 ? 'heavy' : 'guard'; var shown = Math.random() < .7 ? intent : ['atk', 'heavy', 'guard'][rnd(0, 2)]; intentEl.textContent = T(TELL[shown]); }
      pick();
      function act(a) {
        if (busy) return; busy = true; turn++;
        var dm = 0, dt = 0, eAtk = intent === 'atk' ? rnd(8, 14) : intent === 'heavy' ? rnd(16, 24) : 0;
        if (o.hard) eAtk = Math.round(eAtk * 1.25);
        if (a === 'punch') { dm = intent === 'guard' ? rnd(2, 5) : rnd(9, 14); dt = eAtk; }
        else if (a === 'heavy') { dm = intent === 'guard' ? rnd(18, 26) : intent === 'atk' ? rnd(10, 16) : rnd(20, 28); dt = intent === 'heavy' ? eAtk : Math.round(eAtk * 1.2); }
        else if (a === 'guard') { dm = 0; dt = intent === 'heavy' ? Math.round(eAtk * .6) : Math.round(eAtk * .2); }
        else { var ok = Math.random() < .45 + st.fit / 250; dt = ok ? 0 : Math.round(eAtk * 1.3); dm = ok && intent !== 'guard' ? rnd(6, 10) : 0; }
        dm = Math.round(dm * pw); foe = Math.max(0, foe - dm); me = Math.max(0, me - dt);
        sfx(dm > dt ? 'ok' : 'bad'); G.native.haptic(dt > 10 ? 'heavy' : 'light');
        say(T('你造成{a}伤害，受到{b}伤害|You dealt {a}, took {b}', { a: dm, b: dt }));
        arena.textContent = dm > dt ? '🧍  💥  🤕' : dt > dm ? '🤕  💥  🧟' : '🧍  ⚔️  🧟';
        hud.firstChild.textContent = '❤️ ' + me; hud.lastChild.textContent = '👹 ' + foe;
        setTimeout(function () {
          if (foe <= 0 || me <= 0 || turn >= 10) {
            var sc = G.clamp(.5 + (me / 100 - foe / foeMax) / 2, 0, 1); if (foe <= 0) sc = Math.max(sc, .75); if (me <= 0) sc = Math.min(sc, .25);
            done({ score: sc, win: foe <= 0 || (me > 0 && me / 100 > foe / foeMax) }); return;
          }
          pick(); busy = false;
        }, 700);
      }
      var c1 = h('div', { class: 'gctl' }, h('button', { onclick: function () { act('punch'); } }, T('👊 出拳|👊 Punch')), h('button', { onclick: function () { act('heavy'); } }, T('💪 重击|💪 Heavy')));
      var c2 = h('div', { class: 'gctl', style: { paddingTop: 0 } }, h('button', { onclick: function () { act('guard'); } }, T('🛡️ 防御|🛡️ Guard')), h('button', { onclick: function () { act('dodge'); } }, T('💨 闪避|💨 Dodge')));
      el.appendChild(h('div', { style: { flex: 1 } })); el.appendChild(c1); el.appendChild(c2);
    } };

  /* ---------- driving ---------- */
  GM.driving = { n: '飙车|Driving', i: '🚗', how: '点击左右按钮换车道，躲开迎面而来的车，坚持20秒。|Tap left/right to change lanes and dodge traffic for 20 seconds.',
    play: function (el, o, done) {
      var c = canvas(el), ctx = c.ctx, lane = 1, cars = [], t = 0, hits = 0, inv = 0, over = false, spawnT = 0, dur = 20;
      var L = h('button', null, '⬅️'), R = h('button', null, '➡️');
      el.appendChild(h('div', { class: 'gctl' }, L, R));
      function mv(d) { lane = G.clamp(lane + d, 0, 2); G.native.haptic('light'); }
      L.addEventListener('pointerdown', function (e) { e.preventDefault(); mv(-1); }); R.addEventListener('pointerdown', function (e) { e.preventDefault(); mv(1); });
      var prev = performance.now(), raf;
      function loop(now) {
        var dt = Math.min(.05, (now - prev) / 1000); prev = now; t += dt; spawnT -= dt; inv -= dt;
        var w = c.w(), H = c.hh(), lw = Math.min(110, (w - 40) / 3), x0 = (w - lw * 3) / 2, speed = 260 + t * 14 + (o.hard ? 80 : 0);
        if (spawnT <= 0) { cars.push({ l: rnd(0, 2), y: -60 }); if (Math.random() < .3) cars.push({ l: rnd(0, 2), y: -160 }); spawnT = Math.max(.35, .9 - t / 40); }
        cars.forEach(function (k) { k.y += speed * dt; });
        cars = cars.filter(function (k) { return k.y < H + 60; });
        var py = H - 80;
        cars.forEach(function (k) { if (!k.hit && k.l === lane && Math.abs(k.y - py) < 46 && inv <= 0) { k.hit = 1; hits++; inv = 1; sfx('bad'); G.native.haptic('heavy'); } });
        ctx.clearRect(0, 0, w, H); ctx.fillStyle = '#555c58'; ctx.fillRect(x0, 0, lw * 3, H);
        ctx.strokeStyle = '#e8e3c8'; ctx.setLineDash([22, 18]); ctx.lineDashOffset = -t * speed; ctx.lineWidth = 3;
        for (var i = 1; i < 3; i++) { ctx.beginPath(); ctx.moveTo(x0 + lw * i, 0); ctx.lineTo(x0 + lw * i, H); ctx.stroke(); }
        ctx.setLineDash([]); ctx.font = '40px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        cars.forEach(function (k) { ctx.fillText('🚙', x0 + lw * k.l + lw / 2, k.y); });
        if (inv <= 0 || Math.floor(inv * 10) % 2) ctx.fillText('🏎️', x0 + lw * lane + lw / 2, py);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 15px sans-serif'; ctx.fillText(Math.max(0, dur - t).toFixed(1) + 's   💥' + hits + '/3', w / 2, 18);
        if (!over && (hits >= 3 || t >= dur)) { over = true; setTimeout(function () { done({ score: G.clamp((t / dur) * (1 - hits * .25), 0, 1), win: hits < 3 }); }, 300); }
        if (!over) raf = requestAnimationFrame(loop);
      }
      raf = requestAnimationFrame(loop);
    } };

  /* ---------- rhythm ---------- */
  GM.rhythm = { n: '节奏|Rhythm', i: '🎵', how: '音符落到线上时，点击对应的按钮。|Tap the matching button when a note reaches the line.',
    play: function (el, o, done) {
      var c = canvas(el), ctx = c.ctx, notes = [], t = 0, hit = 0, miss = 0, total = 0, dur = 20, over = false, flash = [0, 0, 0, 0];
      var bpm = 110 + (o.hard ? 30 : 0), beat = 60 / bpm, next = 1;
      var btns = [0, 1, 2, 3].map(function (i) { var b = h('button', { style: { padding: '18px 0' } }, ['🔴', '🟡', '🟢', '🔵'][i]); b.addEventListener('pointerdown', function (e) { e.preventDefault(); press(i); }); return b; });
      el.appendChild(h('div', { class: 'gctl' }, btns));
      var SCALE = [523, 587, 659, 784];
      function press(i) {
        flash[i] = .15;
        var H = c.hh(), line = H - 40, best = null;
        notes.forEach(function (n) { if (n.l === i && !n.done) { var d = Math.abs(n.y - line); if (d < 46 && (!best || d < Math.abs(best.y - line))) best = n; } });
        if (best) { best.done = 1; hit++; if (G.audio) G.audio.sfx('pop'); G.native.haptic('light'); }
        else { miss++; }
      }
      var prev = performance.now(), raf;
      function loop(now) {
        var dt = Math.min(.05, (now - prev) / 1000); prev = now; t += dt;
        var w = c.w(), H = c.hh(), lw = (w - 28) / 4, line = H - 40, speed = H / 1.6;
        if (t >= next && t < dur - 1.5) { var l = rnd(0, 3); notes.push({ l: l, y: -20 }); total++; if (Math.random() < .2) { notes.push({ l: (l + 2) % 4, y: -20 }); total++; } next += beat * (Math.random() < .3 ? .5 : 1); }
        notes.forEach(function (n) { n.y += speed * dt; if (!n.done && n.y > line + 50) { n.done = 2; } });
        notes = notes.filter(function (n) { return n.y < H + 30 && n.done !== 1; });
        ctx.clearRect(0, 0, w, H);
        for (var i = 0; i < 4; i++) { ctx.fillStyle = flash[i] > 0 ? css('--blue-soft') : (i % 2 ? css('--grid') : css('--paper2')); ctx.fillRect(14 + lw * i, 0, lw - 2, H); flash[i] -= dt; }
        ctx.fillStyle = css('--red'); ctx.fillRect(14, line - 2, lw * 4, 4);
        var cols = ['#e5534b', '#e3b341', '#4ea56a', '#4c8fd6'];
        notes.forEach(function (n) { if (n.done) return; ctx.fillStyle = cols[n.l]; ctx.beginPath(); ctx.arc(14 + lw * n.l + lw / 2, n.y, Math.min(20, lw / 3), 0, 7); ctx.fill(); });
        ctx.fillStyle = css('--ink'); ctx.font = 'bold 15px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('♪ ' + hit + '/' + total + '   ' + Math.max(0, dur - t).toFixed(0) + 's', w / 2, 18);
        if (!over && t >= dur) { over = true; var sc = total ? G.clamp(hit / total - miss * .02, 0, 1) : 0; sc = G.clamp(sc + stat().music / 400, 0, 1); done({ score: sc }); }
        if (!over) raf = requestAnimationFrame(loop);
      }
      raf = requestAnimationFrame(loop);
    } };

  /* ---------- blackjack ---------- */
  var SUITS = ['♠', '♥', '♦', '♣'];
  function deck() { var d = []; SUITS.forEach(function (s) { for (var r = 1; r <= 13; r++) d.push({ r: r, s: s }); }); for (var i = d.length - 1; i > 0; i--) { var j = rnd(0, i); var t = d[i]; d[i] = d[j]; d[j] = t; } return d; }
  function cardEl(c, hidden) { if (hidden) return h('div', { class: 'pcard back' }); var lab = { 1: 'A', 11: 'J', 12: 'Q', 13: 'K' }[c.r] || String(c.r); return h('div', { class: 'pcard' + (c.s === '♥' || c.s === '♦' ? ' r' : '') }, lab + c.s); }
  function total(hand) { var t = 0, a = 0; hand.forEach(function (c) { var v = c.r > 10 ? 10 : c.r; if (c.r === 1) { a++; v = 11; } t += v; }); while (t > 21 && a) { t -= 10; a--; } return t; }
  GM.blackjack = { n: '二十一点|Blackjack', i: '🃏', how: '点数尽量接近21但不能超过。庄家17点以下必须要牌。|Get as close to 21 as you can without going over. The dealer hits below 17.',
    play: function (el, o, done) {
      var d = deck(), me = [d.pop(), d.pop()], dl = [d.pop(), d.pop()], over = false;
      var dlEl = h('div', { class: 'hand' }), meEl = h('div', { class: 'hand' }), say;
      el.appendChild(h('div', { style: { padding: '12px 14px 4px', fontWeight: 700 } }, T('庄家|Dealer'))); el.appendChild(dlEl);
      el.appendChild(h('div', { style: { padding: '12px 14px 4px', fontWeight: 700 } }, T('你|You'))); el.appendChild(meEl);
      say = msg(el, '');
      function draw(reveal) { dlEl.innerHTML = ''; meEl.innerHTML = ''; dl.forEach(function (c, i) { dlEl.appendChild(cardEl(c, !reveal && i === 1)); }); me.forEach(function (c) { meEl.appendChild(cardEl(c)); }); if (!over) say(T('你的点数：{n}|Your total: {n}', { n: total(me) })); }
      function finish(res, mult) { over = true; draw(true); say(res); setTimeout(function () { done({ score: mult >= 2 ? 1 : mult === 1 ? .5 : 0, win: mult >= 2, mult: mult }); }, 1200); }
      function dealer() { while (total(dl) < 17) dl.push(d.pop()); var a = total(me), b = total(dl); if (b > 21 || a > b) finish(T('你赢了！（{a} vs {b}）|You win! ({a} vs {b})', { a: a, b: b }), 2); else if (a === b) finish(T('平局（{a}）|Push ({a})', { a: a }), 1); else finish(T('庄家赢了（{a} vs {b}）|Dealer wins ({a} vs {b})', { a: a, b: b }), 0); }
      var hit = h('button', { onclick: function () { if (over) return; sfx('pop'); me.push(d.pop()); draw(false); if (total(me) > 21) finish(T('爆牌了！（{a}）|Bust! ({a})', { a: total(me) }), 0); } }, T('要牌|Hit'));
      var stand = h('button', { class: 'go', onclick: function () { if (over) return; dealer(); } }, T('停牌|Stand'));
      el.appendChild(h('div', { style: { flex: 1 } })); el.appendChild(h('div', { class: 'gctl' }, hit, stand));
      draw(false);
      if (total(me) === 21) finish(T('黑杰克！|Blackjack!'), 2.5);
    } };

  /* ---------- sic bo ---------- */
  GM.dice = { n: '骰宝|Sic Bo', i: '🎲', how: '押大（11-17）或小（4-10），三颗骰子点数相同为“豹子”，通杀大小。押豹子赔25倍。|Bet Big (11-17) or Small (4-10). Triples beat both. Betting on a triple pays 25×.',
    play: function (el, o, done) {
      var box = h('div', { class: 'dice' }, [0, 1, 2].map(function () { return h('div', { class: 'die' }, '?'); }));
      el.appendChild(h('div', { style: { height: '40px' } })); el.appendChild(box); var say = msg(el, '下注吧！|Place your bet!');
      var F = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'], rolled = false;
      function roll(bet) {
        if (rolled) return; rolled = true;
        var n = 0, iv = setInterval(function () { Array.prototype.forEach.call(box.children, function (d) { d.textContent = F[rnd(0, 5)]; }); sfx('pop'); if (++n > 12) { clearInterval(iv); fin(); } }, 80);
        function fin() {
          var r = [rnd(1, 6), rnd(1, 6), rnd(1, 6)];
          if (G.has && G.has('gambler') && Math.random() < .15) { var s0 = r[0] + r[1] + r[2]; if (bet === 'big' && s0 < 11) r = [6, 5, rnd(1, 4)]; if (bet === 'small' && s0 > 10) r = [1, 2, rnd(1, 4)]; }
          Array.prototype.forEach.call(box.children, function (d, i) { d.textContent = F[r[i] - 1]; });
          var s = r[0] + r[1] + r[2], tri = r[0] === r[1] && r[1] === r[2], mult = 0;
          if (bet === 'tri') mult = tri ? 26 : 0; else if (!tri && ((bet === 'big' && s >= 11) || (bet === 'small' && s <= 10))) mult = 2;
          say(T('{s}点{t} — {r}|{s}{t} — {r}', { s: s, t: tri ? T('（豹子）| (triple)') : '', r: mult ? T('你赢了！|You win!') : T('你输了|You lose') }));
          setTimeout(function () { done({ score: mult ? 1 : 0, win: !!mult, mult: mult }); }, 1300);
        }
      }
      el.appendChild(h('div', { style: { flex: 1 } }));
      el.appendChild(h('div', { class: 'gctl' }, h('button', { onclick: function () { roll('small'); } }, T('小|Small')), h('button', { onclick: function () { roll('tri'); } }, T('豹子|Triple')), h('button', { class: 'go', onclick: function () { roll('big'); } }, T('大|Big'))));
    } };

  /* ---------- mahjong (simplified solo) ---------- */
  var SUITN = ['m', 'p', 's'], SUITZ = { m: '万|Char', p: '筒|Dot', s: '条|Bam' };
  function canWin(cnt) {
    for (var i = 0; i < 27; i++) if (cnt[i] >= 2) { cnt[i] -= 2; var ok = melds(cnt); cnt[i] += 2; if (ok) return true; }
    return false;
  }
  function melds(cnt) {
    var i = 0; while (i < 27 && !cnt[i]) i++;
    if (i >= 27) return true;
    if (cnt[i] >= 3) { cnt[i] -= 3; var ok = melds(cnt); cnt[i] += 3; if (ok) return true; }
    if (i % 9 <= 6 && cnt[i + 1] && cnt[i + 2]) { cnt[i]--; cnt[i + 1]--; cnt[i + 2]--; var ok2 = melds(cnt); cnt[i]++; cnt[i + 1]++; cnt[i + 2]++; if (ok2) return true; }
    return false;
  }
  function countMelds(cnt) { var c = cnt.slice(), m = 0; for (var i = 0; i < 27; i++) { while (c[i] >= 3) { c[i] -= 3; m++; } if (i % 9 <= 6) while (c[i] && c[i + 1] && c[i + 2]) { c[i]--; c[i + 1]--; c[i + 2]--; m++; } } return m; }
  GM.mahjong = { n: '麻将|Mahjong', i: '🀄', how: '简化麻将：每轮摸一张、打一张。凑成4组顺子或刻子加1对将牌就胡了！其他人也在抢着胡，动作要快。|Simplified mahjong: draw one, discard one each turn. Make 4 sets (runs or triplets) plus a pair to win — before the others do!',
    play: function (el, o, done) {
      var wall = []; for (var t = 0; t < 27; t++) for (var k = 0; k < 4; k++) wall.push(t);
      for (var i = wall.length - 1; i > 0; i--) { var j = rnd(0, i); var x = wall[i]; wall[i] = wall[j]; wall[j] = x; }
      var hand = wall.splice(0, 13), turn = 0, over = false, maxT = 14;
      var hud = h('div', { class: 'ghud' }, h('span', null, ''), h('span', null, '')); el.appendChild(hud);
      var say = msg(el, '');
      var handEl = h('div', { class: 'hand', style: { padding: '10px 8px' } }); el.appendChild(handEl);
      function lab(t) { var s = SUITN[Math.floor(t / 9)]; return { n: (t % 9) + 1, s: s }; }
      function sortH() { hand.sort(function (a, b) { return a - b; }); }
      function cnt() { var c = []; for (var i = 0; i < 27; i++) c[i] = 0; hand.forEach(function (t) { c[t]++; }); return c; }
      function render() {
        handEl.innerHTML = '';
        hand.forEach(function (t, idx) { var L = lab(t); var b = h('button', { class: 'tile ' + L.s, onclick: function () { discard(idx); } }, h('div', null, String(L.n), h('br'), T(SUITZ[L.s]).slice(0, G.lang === 'en' ? 4 : 1))); handEl.appendChild(b); });
        hud.firstChild.textContent = T('第{t}/{m}巡|Turn {t}/{m}', { t: Math.min(turn, maxT), m: maxT }); hud.lastChild.textContent = T('已成{n}组|{n} sets', { n: countMelds(cnt()) });
      }
      function drawTile() {
        turn++;
        if (turn > maxT || !wall.length) { end(false, '流局了。|The wall ran out — no winner.'); return; }
        if (Math.random() < .015 * turn) { end(false, G.pick(['下家胡了！|The player on your right won!', '对家自摸了！|The player across drew the winning tile!', '上家胡了！|The player on your left won!'])); return; }
        var t = wall.pop(); hand.push(t); sortH();
        if (canWin(cnt())) { render(); end(true, '胡了！！|Mahjong!!'); return; }
        say(T('摸到了{n}，请打出一张|You drew {n} — discard one', { n: lab(t).n + T(SUITZ[lab(t).s]) }));
        render();
      }
      function discard(idx) { if (over || hand.length < 14) return; sfx('pop'); hand.splice(idx, 1); render(); setTimeout(drawTile, 280); }
      function end(win, text) { over = true; say(text); var sc = win ? 1 : countMelds(cnt()) / 4 * .45; setTimeout(function () { done({ score: sc, win: win, mult: win ? 3 : 0 }); }, 1300); }
      sortH(); render(); setTimeout(drawTile, 400);
    } };

  /* ---------- sport alias ---------- */
  GM.sport = GM.basketball;
})();
