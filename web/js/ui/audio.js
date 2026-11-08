/* Generated audio: soft pentatonic background music + UI sound effects */
(function () {
  'use strict';
  var A = G.audio = {}, ctx = null, master = null, musicGain = null, timer = null, step = 0;
  A.init = function () {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return; }
    master = ctx.createGain(); master.gain.value = .55; master.connect(ctx.destination);
    musicGain = ctx.createGain(); musicGain.gain.value = 0; musicGain.connect(master);
    if (G.settings.music) A.music(true);
  };
  function tone(f, t, dur, type, vol, dest) {
    if (!ctx) return;
    var o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol || .2, t + .015); g.gain.exponentialRampToValueAtTime(.0008, t + dur);
    o.connect(g); g.connect(dest || master); o.start(t); o.stop(t + dur + .05);
  }
  var SFX = {
    tap: [[660, 0, .06, 'triangle', .08]],
    ok: [[523, 0, .12, 'triangle', .14], [784, .07, .18, 'triangle', .12]],
    bad: [[220, 0, .22, 'sawtooth', .07], [180, .1, .3, 'sawtooth', .06]],
    coin: [[988, 0, .08, 'square', .06], [1319, .06, .25, 'square', .06]],
    stamp: [[110, 0, .18, 'sine', .4], [70, .02, .25, 'triangle', .25]],
    win: [[523, 0, .15, 'triangle', .14], [659, .1, .15, 'triangle', .14], [784, .2, .15, 'triangle', .14], [1047, .3, .4, 'triangle', .14]],
    lose: [[392, 0, .2, 'triangle', .12], [330, .15, .2, 'triangle', .12], [262, .3, .45, 'triangle', .12]],
    pop: [[880, 0, .05, 'sine', .12]],
    bell: [[1046, 0, 1.2, 'sine', .12], [1568, 0, .9, 'sine', .05]],
    msg: [[1175, 0, .08, 'sine', .1], [1568, .07, .14, 'sine', .08]]
  };
  A.sfx = function (k) {
    if (!G.settings.sfx || !ctx) return;
    var t = ctx.currentTime;
    (SFX[k] || SFX.tap).forEach(function (n) { tone(n[0], t + n[1], n[2], n[3], n[4]); });
  };
  // C major pentatonic across two octaves; chord roots cycle slowly
  var SCALE = [261.6, 293.7, 329.6, 392, 440, 523.3, 587.3, 659.3, 784, 880];
  var ROOTS = [130.8, 110, 98, 116.5];
  function tick() {
    if (!ctx || !G.settings.music) return;
    var t = ctx.currentTime + .05;
    if (step % 16 === 0) { var r = ROOTS[(step / 16) % ROOTS.length]; tone(r, t, 3.6, 'sine', .07, musicGain); tone(r * 1.5, t, 3.6, 'sine', .04, musicGain); }
    if (Math.random() < .55) { var f = SCALE[Math.floor(Math.random() * SCALE.length)]; tone(f, t, .9, 'triangle', .05 + Math.random() * .03, musicGain); }
    step++;
  }
  A.music = function (on) {
    if (!ctx) return;
    if (on) {
      musicGain.gain.cancelScheduledValues(ctx.currentTime); musicGain.gain.linearRampToValueAtTime(.5, ctx.currentTime + 1.5);
      if (!timer) timer = setInterval(tick, 240);
    } else {
      musicGain.gain.linearRampToValueAtTime(0, ctx.currentTime + .4);
      if (timer) { clearInterval(timer); timer = null; }
    }
  };
  document.addEventListener('visibilitychange', function () { if (!ctx) return; if (document.hidden) ctx.suspend(); else ctx.resume(); });
})();
