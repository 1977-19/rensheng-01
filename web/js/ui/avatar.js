/* Procedural sticker-style avatars (outlined, rounded, cute) that age with the character */
(function () {
  'use strict';
  var INK = '#4b3427';
  var SKIN = ['#ffe6d5', '#f9d3b6', '#ecb991', '#d29a6c', '#a9733f', '#77492b'];
  var SKIN_SH = ['#f6cdb6', '#eebc98', '#dca178', '#bd8556', '#935f31', '#613a22'];
  var BG = ['#fbf3e3', '#f3f0e6', '#fdf0e8', '#eef4ea', '#f1eef8', '#fcf1f1', '#edf4f6'];
  var CLOTH = ['#7fb3e0', '#ef9a8c', '#8cc79a', '#f3c768', '#b39ddb', '#f4a26b', '#7ec8c4', '#e88fb0', '#9aa7b5'];
  var HAIR_DARK = ['#2f221c', '#3a2a21', '#24191a', '#4a3226'];
  var HAIR_LIGHT = ['#e3b960', '#c98b47', '#8a5a33', '#5b3a26', '#b4542e', '#2f221c', '#d7a75a'];
  function rng(seed) { var s = (seed >>> 0) || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function pick(r, a) { return a[Math.floor(r() * a.length)]; }
  function f1(n) { return Math.round(n * 10) / 10; }
  function P(d, fill, sw, extra) { return '<path d="' + d + '" fill="' + (fill || 'none') + '" stroke="' + INK + '" stroke-width="' + (sw == null ? 2.2 : sw) + '" stroke-linejoin="round" stroke-linecap="round"' + (extra || '') + '/>'; }
  function C(x, y, r, fill, sw) { return '<circle cx="' + f1(x) + '" cy="' + f1(y) + '" r="' + f1(r) + '" fill="' + fill + '"' + (sw ? ' stroke="' + INK + '" stroke-width="' + sw + '"' : '') + '/>'; }
  function E(x, y, rx, ry, fill, extra) { return '<ellipse cx="' + f1(x) + '" cy="' + f1(y) + '" rx="' + f1(rx) + '" ry="' + f1(ry) + '" fill="' + fill + '"' + (extra || '') + '/>'; }
  function hairColor(r, skin, age, cul) {
    var east = ['cn', 'jp', 'kr', 'sg', 'th', 'in'].indexOf(cul) >= 0;
    var c = (east || skin >= 3) ? pick(r, HAIR_DARK) : pick(r, HAIR_LIGHT);
    if (age > 74) return '#eeebe5';
    if (age > 60) return '#bdb7af';
    if (age > 50 && r() < .5) return '#857c74';
    return c;
  }
  function face(cx, cy, w, h) {
    return 'M' + f1(cx - w) + ' ' + f1(cy - h * .15) + ' C' + f1(cx - w) + ' ' + f1(cy - h * 1.08) + ' ' + f1(cx + w) + ' ' + f1(cy - h * 1.08) + ' ' + f1(cx + w) + ' ' + f1(cy - h * .15) +
      ' C' + f1(cx + w) + ' ' + f1(cy + h * .62) + ' ' + f1(cx + w * .42) + ' ' + f1(cy + h) + ' ' + f1(cx) + ' ' + f1(cy + h) +
      ' C' + f1(cx - w * .42) + ' ' + f1(cy + h) + ' ' + f1(cx - w) + ' ' + f1(cy + h * .62) + ' ' + f1(cx - w) + ' ' + f1(cy - h * .15) + 'Z';
  }
  /* front hair (on top of the face) */
  var MALE = {
    side: function (cx, cy, w, h) { return 'M' + (cx - w - 1.5) + ' ' + (cy - h * .05) + ' C' + (cx - w - 3) + ' ' + (cy - h * 1.3) + ' ' + (cx + w + 3) + ' ' + (cy - h * 1.32) + ' ' + (cx + w + 1.5) + ' ' + (cy - h * .05) + ' C' + (cx + w * .9) + ' ' + (cy - h * .55) + ' ' + (cx + w * .35) + ' ' + (cy - h * .62) + ' ' + (cx - w * .15) + ' ' + (cy - h * .5) + ' C' + (cx - w * .45) + ' ' + (cy - h * .68) + ' ' + (cx - w * .85) + ' ' + (cy - h * .55) + ' ' + (cx - w - 1.5) + ' ' + (cy - h * .05) + 'Z'; },
    spiky: function (cx, cy, w, h) { var t = cy - h * 1.05, s = 'M' + (cx - w - 1) + ' ' + (cy - h * .1); var n = 7; for (var i = 0; i <= n; i++) { var x = cx - w + (2 * w) * i / n; s += ' L' + f1(x - w / n * .5) + ' ' + f1(t - (i % 2 ? 6 : 1) + Math.abs(i - n / 2) * 1.6); } s += ' L' + (cx + w + 1) + ' ' + (cy - h * .1) + ' C' + (cx + w * .5) + ' ' + (cy - h * .55) + ' ' + (cx - w * .5) + ' ' + (cy - h * .55) + ' ' + (cx - w - 1) + ' ' + (cy - h * .1) + 'Z'; return s; },
    buzz: function (cx, cy, w, h) { return 'M' + (cx - w - .5) + ' ' + (cy - h * .2) + ' C' + (cx - w - 1) + ' ' + (cy - h * 1.18) + ' ' + (cx + w + 1) + ' ' + (cy - h * 1.18) + ' ' + (cx + w + .5) + ' ' + (cy - h * .2) + ' C' + (cx + w * .6) + ' ' + (cy - h * .72) + ' ' + (cx - w * .6) + ' ' + (cy - h * .72) + ' ' + (cx - w - .5) + ' ' + (cy - h * .2) + 'Z'; },
    curly: null,
    slick: function (cx, cy, w, h) { return 'M' + (cx - w - 1) + ' ' + (cy - h * .1) + ' C' + (cx - w - 2) + ' ' + (cy - h * 1.4) + ' ' + (cx + w + 2) + ' ' + (cy - h * 1.42) + ' ' + (cx + w + 1) + ' ' + (cy - h * .1) + ' C' + (cx + w * .7) + ' ' + (cy - h * .75) + ' ' + (cx - w * .7) + ' ' + (cy - h * .8) + ' ' + (cx - w - 1) + ' ' + (cy - h * .1) + 'Z'; },
    bowl: function (cx, cy, w, h) { return 'M' + (cx - w - 2) + ' ' + (cy - h * .05) + ' C' + (cx - w - 3) + ' ' + (cy - h * 1.3) + ' ' + (cx + w + 3) + ' ' + (cy - h * 1.3) + ' ' + (cx + w + 2) + ' ' + (cy - h * .05) + ' L' + (cx + w * .8) + ' ' + (cy - h * .3) + ' L' + (cx - w * .8) + ' ' + (cy - h * .3) + 'Z'; }
  };
  var FEMALE = {
    bob: { back: function (cx, cy, w, h) { return 'M' + (cx - w - 5) + ' ' + (cy + h * .55) + ' C' + (cx - w - 9) + ' ' + (cy - h * 1.35) + ' ' + (cx + w + 9) + ' ' + (cy - h * 1.35) + ' ' + (cx + w + 5) + ' ' + (cy + h * .55) + ' Z'; },
      front: function (cx, cy, w, h) { return 'M' + (cx - w - 2) + ' ' + (cy) + ' C' + (cx - w - 3) + ' ' + (cy - h * 1.3) + ' ' + (cx + w + 3) + ' ' + (cy - h * 1.3) + ' ' + (cx + w + 2) + ' ' + cy + ' L' + (cx + w * .75) + ' ' + (cy - h * .35) + ' L' + (cx - w * .75) + ' ' + (cy - h * .35) + 'Z'; } },
    long: { back: function (cx, cy, w, h) { return 'M' + (cx - w - 4) + ' ' + (cy + h * 1.55) + ' C' + (cx - w - 10) + ' ' + (cy - h * 1.4) + ' ' + (cx + w + 10) + ' ' + (cy - h * 1.4) + ' ' + (cx + w + 4) + ' ' + (cy + h * 1.55) + ' Q' + cx + ' ' + (cy + h * 1.35) + ' ' + (cx - w - 4) + ' ' + (cy + h * 1.55) + 'Z'; },
      front: function (cx, cy, w, h) { return 'M' + (cx - w - 1.5) + ' ' + (cy + h * .2) + ' C' + (cx - w - 3) + ' ' + (cy - h * 1.3) + ' ' + (cx + w + 3) + ' ' + (cy - h * 1.3) + ' ' + (cx + w + 1.5) + ' ' + (cy + h * .2) + ' C' + (cx + w * .7) + ' ' + (cy - h * .45) + ' ' + (cx + w * .2) + ' ' + (cy - h * .62) + ' ' + cx + ' ' + (cy - h * .78) + ' C' + (cx - w * .2) + ' ' + (cy - h * .62) + ' ' + (cx - w * .7) + ' ' + (cy - h * .45) + ' ' + (cx - w - 1.5) + ' ' + (cy + h * .2) + 'Z'; } },
    wavy: { back: function (cx, cy, w, h) { var b = cy + h * 1.4; return 'M' + (cx - w - 5) + ' ' + b + ' C' + (cx - w - 12) + ' ' + (cy - h * 1.4) + ' ' + (cx + w + 12) + ' ' + (cy - h * 1.4) + ' ' + (cx + w + 5) + ' ' + b + ' q-4 5 -8 0 q-4 5 -8 0 q-4 5 -8 0 q-4 5 -8 0 q-4 5 -8 0 q-4 5 -8 0 q-4 5 -8 0 Z'; },
      front: function (cx, cy, w, h) { return 'M' + (cx - w - 1.5) + ' ' + (cy + h * .1) + ' C' + (cx - w - 3) + ' ' + (cy - h * 1.3) + ' ' + (cx + w + 3) + ' ' + (cy - h * 1.3) + ' ' + (cx + w + 1.5) + ' ' + (cy + h * .1) + ' C' + (cx + w * .5) + ' ' + (cy - h * .3) + ' ' + (cx - w * .1) + ' ' + (cy - h * .75) + ' ' + (cx - w * .45) + ' ' + (cy - h * .55) + ' C' + (cx - w * .75) + ' ' + (cy - h * .45) + ' ' + (cx - w) + ' ' + (cy - h * .2) + ' ' + (cx - w - 1.5) + ' ' + (cy + h * .1) + 'Z'; } },
    pony: { tail: true, front: function (cx, cy, w, h) { return 'M' + (cx - w - 1) + ' ' + (cy - h * .05) + ' C' + (cx - w - 2) + ' ' + (cy - h * 1.3) + ' ' + (cx + w + 2) + ' ' + (cy - h * 1.3) + ' ' + (cx + w + 1) + ' ' + (cy - h * .05) + ' C' + (cx + w * .6) + ' ' + (cy - h * .5) + ' ' + (cx - w * .3) + ' ' + (cy - h * .7) + ' ' + (cx - w - 1) + ' ' + (cy - h * .05) + 'Z'; } },
    bun: { bun: true, front: function (cx, cy, w, h) { return 'M' + (cx - w - 1) + ' ' + (cy - h * .1) + ' C' + (cx - w - 2) + ' ' + (cy - h * 1.3) + ' ' + (cx + w + 2) + ' ' + (cy - h * 1.3) + ' ' + (cx + w + 1) + ' ' + (cy - h * .1) + ' C' + (cx + w * .6) + ' ' + (cy - h * .7) + ' ' + (cx - w * .6) + ' ' + (cy - h * .7) + ' ' + (cx - w - 1) + ' ' + (cy - h * .1) + 'Z'; } },
    twin: { twin: true, front: function (cx, cy, w, h) { return 'M' + (cx - w - 1.5) + ' ' + cy + ' C' + (cx - w - 3) + ' ' + (cy - h * 1.3) + ' ' + (cx + w + 3) + ' ' + (cy - h * 1.3) + ' ' + (cx + w + 1.5) + ' ' + cy + ' L' + (cx + w * .7) + ' ' + (cy - h * .38) + ' L' + (cx - w * .7) + ' ' + (cy - h * .38) + 'Z'; } }
  };
  G.avatar = function (o) {
    o = o || {};
    var r = rng(o.seed || 7), age = o.age || 0, g = o.g || 'm', si = o.skin != null ? Math.max(0, Math.min(5, o.skin)) : 1;
    var skin = SKIN[si], shade = SKIN_SH[si], looks = o.looks == null ? 50 : o.looks, mood = o.happy == null ? 60 : o.happy;
    var hc = hairColor(r, si, age, o.cul), bg = pick(r, BG), cloth = pick(r, CLOTH);
    var baby = age < 3, kid = age < 12, teen = age >= 12 && age < 18, old = age >= 60;
    var cx = 50, cy = baby ? 53 : kid ? 51 : 49, w = baby ? 25 : kid ? 23.5 : 21.5, h = baby ? 24 : kid ? 24 : 25;
    var mStyles = kid ? ['bowl', 'side', 'spiky', 'curly', 'buzz'] : ['side', 'spiky', 'buzz', 'curly', 'slick'];
    var fStyles = kid ? ['twin', 'bob', 'pony', 'long'] : old ? ['bun', 'bob', 'bob', 'wavy'] : ['long', 'bob', 'pony', 'wavy', 'bun', 'long'];
    var ms = pick(r, mStyles), fs = pick(r, fStyles);
    var glasses = (o.glasses || r() < .12) && age >= 6, bald = g === 'm' && age > 50 && r() < .35, beard = g === 'm' && age >= 25 && r() < .18, earring = g === 'f' && age >= 16 && r() < .4;
    var s = '<svg viewBox="5 5 90 90" xmlns="http://www.w3.org/2000/svg">';
    s += '<rect width="100" height="100" fill="' + bg + '"/>';
    // body
    var by = cy + h + (baby ? 2 : 5);
    s += P('M' + (cx - 34) + ' 104 C' + (cx - 33) + ' ' + (by + 6) + ' ' + (cx - 20) + ' ' + by + ' ' + cx + ' ' + by + ' C' + (cx + 20) + ' ' + by + ' ' + (cx + 33) + ' ' + (by + 6) + ' ' + (cx + 34) + ' 104Z', cloth);
    // collar
    if (!baby && age >= 22 && r() < .45) s += P('M' + (cx - 9) + ' ' + (by + .5) + ' L' + cx + ' ' + (by + 9) + ' L' + (cx + 9) + ' ' + (by + .5), '#ffffff', 1.8);
    else s += P('M' + (cx - 8) + ' ' + (by + 1) + ' Q' + cx + ' ' + (by + 7) + ' ' + (cx + 8) + ' ' + (by + 1), 'none', 1.8);
    // neck
    if (!baby) s += P('M' + (cx - 6) + ' ' + (cy + h - 4) + ' L' + (cx - 6) + ' ' + (by + 1) + ' Q' + cx + ' ' + (by + 5) + ' ' + (cx + 6) + ' ' + (by + 1) + ' L' + (cx + 6) + ' ' + (cy + h - 4), skin, 2);
    // back hair
    if (!baby && g === 'f' && FEMALE[fs].back) s += P(FEMALE[fs].back(cx, cy, w, h), hc);
    if (!baby && g === 'f' && FEMALE[fs].tail) s += P('M' + (cx + w - 2) + ' ' + (cy - h * .7) + ' C' + (cx + w + 16) + ' ' + (cy - h * .7) + ' ' + (cx + w + 12) + ' ' + (cy + h * .9) + ' ' + (cx + w + 3) + ' ' + (cy + h * 1.1) + ' C' + (cx + w + 7) + ' ' + (cy + h * .3) + ' ' + (cx + w + 2) + ' ' + (cy - h * .2) + ' ' + (cx + w - 2) + ' ' + (cy - h * .3) + 'Z', hc);
    if (!baby && g === 'f' && FEMALE[fs].twin) { s += P('M' + (cx - w - 1) + ' ' + (cy - h * .4) + ' c-12 2 -14 22 -6 28 c2 -8 4 -14 8 -16Z', hc); s += P('M' + (cx + w + 1) + ' ' + (cy - h * .4) + ' c12 2 14 22 6 28 c-2 -8 -4 -14 -8 -16Z', hc); }
    if (!baby && g === 'f' && FEMALE[fs].bun) s += C(cx, cy - h * 1.12, 7.5, hc, 2.2);
    // ears
    s += E(cx - w + .5, cy + 1, 4.2, 5.6, skin, ' stroke="' + INK + '" stroke-width="2"') + E(cx + w - .5, cy + 1, 4.2, 5.6, skin, ' stroke="' + INK + '" stroke-width="2"');
    if (earring) s += C(cx - w + .5, cy + 8, 1.6, '#f2c94c', 1) + C(cx + w - .5, cy + 8, 1.6, '#f2c94c', 1);
    // face
    s += P(face(cx, cy, w, h), skin);
    // front hair
    if (baby) s += P('M' + (cx - 2) + ' ' + (cy - h + 1) + ' c-1 -7 7 -9 7 -3 c0 3 -4 3 -4 0', 'none', 2);
    else if (g === 'm') {
      if (bald) s += P('M' + (cx - w - 1) + ' ' + (cy - h * .05) + ' C' + (cx - w - 2) + ' ' + (cy - h * .6) + ' ' + (cx - w * .6) + ' ' + (cy - h * .75) + ' ' + (cx - w * .5) + ' ' + (cy - h * .5) + ' Z', hc, 1.8) + P('M' + (cx + w + 1) + ' ' + (cy - h * .05) + ' C' + (cx + w + 2) + ' ' + (cy - h * .6) + ' ' + (cx + w * .6) + ' ' + (cy - h * .75) + ' ' + (cx + w * .5) + ' ' + (cy - h * .5) + ' Z', hc, 1.8);
      else if (ms === 'curly') { for (var i = 0; i < 8; i++) { var a = Math.PI * (1.05 + i * .9 / 7); s += C(cx + Math.cos(a) * (w - 1), cy - h * .25 + Math.sin(a) * (h - 1), 6.2, hc, 2); } s += E(cx, cy - h * .82, w * .82, h * .32, hc); }
      else s += P(MALE[ms](cx, cy, w, h), hc);
    } else s += P(FEMALE[fs].front(cx, cy, w, h), hc);
    if (g === 'f' && kid && !baby && r() < .5) s += P('M' + (cx + w * .45) + ' ' + (cy - h * .78) + ' l5 -3 l1 6 l-6 -1Z', '#f27c8f', 1.5);
    // eyebrows
    var ey = cy + (baby ? 4 : kid ? 3 : 2), ex = baby ? 9.5 : kid ? 9 : 8.5;
    var browC = age > 62 ? '#9e968e' : INK, sad = mood < 30, joy = mood >= 78;
    if (!baby) { var bt = sad ? 2 : 0; s += P('M' + (cx - ex - 4) + ' ' + (ey - 7 + bt) + ' q4 ' + (sad ? -1 : -2.5) + ' 7 ' + (sad ? -2.5 : 0), 'none', 1.8).replace(INK, browC) + P('M' + (cx + ex - 3) + ' ' + (ey - 7 - (sad ? 2.5 : 0) + bt) + ' q3 ' + (sad ? 1 : -2.5) + ' 7 ' + (sad ? 2.5 : 0), 'none', 1.8).replace(INK, browC); }
    // eyes
    if (joy && !baby) s += P('M' + (cx - ex - 3) + ' ' + (ey + 1) + ' q3 -4 6 0', 'none', 2.2) + P('M' + (cx + ex - 3) + ' ' + (ey + 1) + ' q3 -4 6 0', 'none', 2.2);
    else if (old && r() < .5) s += P('M' + (cx - ex - 2.5) + ' ' + ey + ' q2.5 2 5 0', 'none', 2.2) + P('M' + (cx + ex - 2.5) + ' ' + ey + ' q2.5 2 5 0', 'none', 2.2);
    else {
      var rx = baby || kid ? 3.2 : 2.5, ry = baby || kid ? 3.8 : 3.1;
      if (looks > 70) { rx += .3; ry += .4; }
      s += E(cx - ex, ey, rx, ry, INK) + E(cx + ex, ey, rx, ry, INK);
      s += C(cx - ex + 1, ey - 1.2, rx * .42, '#fff') + C(cx + ex + 1, ey - 1.2, rx * .42, '#fff');
      if (g === 'f' && !kid) s += P('M' + (cx - ex - 3.5) + ' ' + (ey - 2) + ' l-1.5 -1.2 M' + (cx + ex + 3.5) + ' ' + (ey - 2) + ' l1.5 -1.2', 'none', 1.4);
    }
    // glasses
    if (glasses) s += '<g fill="rgba(255,255,255,.18)" stroke="' + INK + '" stroke-width="1.8"><rect x="' + (cx - ex - 6) + '" y="' + (ey - 5) + '" width="12" height="10" rx="4"/><rect x="' + (cx + ex - 6) + '" y="' + (ey - 5) + '" width="12" height="10" rx="4"/></g>' + P('M' + (cx - ex + 6) + ' ' + ey + ' L' + (cx + ex - 6) + ' ' + ey, 'none', 1.6);
    // blush
    if (kid || g === 'f' || joy || baby) s += E(cx - ex - 4, ey + 7, 4.2, 2.4, '#f2928f', ' opacity=".45"') + E(cx + ex + 4, ey + 7, 4.2, 2.4, '#f2928f', ' opacity=".45"');
    // nose
    s += P('M' + (cx - .5) + ' ' + (ey + 5) + ' q1.6 1.8 -.2 3', 'none', 1.6).replace(INK, '#a0684a');
    // mouth
    var my = ey + (baby ? 11 : 12.5);
    if (joy) s += P('M' + (cx - 5) + ' ' + my + ' Q' + cx + ' ' + (my + 7) + ' ' + (cx + 5) + ' ' + my + ' Z', '#b9433f', 1.8) + E(cx, my + 3.4, 2.6, 1.4, '#f08a8a');
    else if (sad) s += P('M' + (cx - 4) + ' ' + (my + 2.5) + ' Q' + cx + ' ' + (my - 1.5) + ' ' + (cx + 4) + ' ' + (my + 2.5), 'none', 2);
    else if (g === 'f' && age >= 16 && age < 75) s += P('M' + (cx - 3.6) + ' ' + my + ' Q' + cx + ' ' + (my + 3.6) + ' ' + (cx + 3.6) + ' ' + my + ' Q' + cx + ' ' + (my - .8) + ' ' + (cx - 3.6) + ' ' + my + 'Z', '#d2544c', 1.4);
    else s += P('M' + (cx - 3.6) + ' ' + my + ' Q' + cx + ' ' + (my + 3.2) + ' ' + (cx + 3.6) + ' ' + my, 'none', 2);
    if (baby && r() < .4) s += C(cx, my + 2, 3.2, '#8fc7e8', 1.6) + C(cx, my + 2, 1.2, '#fff');
    // age lines & beard
    if (age > 55) s += P('M' + (cx - ex - 7) + ' ' + (ey + 1) + ' l-2.5 1.5 M' + (cx + ex + 7) + ' ' + (ey + 1) + ' l2.5 1.5 M' + (cx - 7) + ' ' + (cy - h * .52) + ' q7 -1.5 14 0', 'none', 1.2).replace(INK, '#b0806a');
    if (age > 68) s += P('M' + (cx - 9) + ' ' + (my - 3) + ' q-1 3 1 5 M' + (cx + 9) + ' ' + (my - 3) + ' q1 3 -1 5', 'none', 1.2).replace(INK, '#b0806a');
    if (beard) s += P('M' + (cx - w + 4) + ' ' + (cy + h * .35) + ' Q' + (cx - w + 6) + ' ' + (cy + h + 4) + ' ' + cx + ' ' + (cy + h + 3) + ' Q' + (cx + w - 6) + ' ' + (cy + h + 4) + ' ' + (cx + w - 4) + ' ' + (cy + h * .35) + ' Q' + cx + ' ' + (my + 6) + ' ' + (cx - w + 4) + ' ' + (cy + h * .35) + 'Z', hc, 1.8) + P('M' + (cx - 3.6) + ' ' + my + ' Q' + cx + ' ' + (my + 3.2) + ' ' + (cx + 3.6) + ' ' + my, 'none', 2);
    if (o.dead) s += '<rect width="100" height="100" fill="#8a8580" opacity=".5"/>';
    s += '</svg>';
    return s;
  };
  G.avatarOf = function (x) {
    var S = G.S;
    if (!x || x === S.p) { var p = S.p; return G.avatar({ seed: G.hash(p.name + p.birthYear), age: p.age, g: p.g, looks: p.st.looks, skin: p.skin != null ? p.skin : (p.skin = G.N.skinFor(p.country)), happy: p.st.happy, cul: p.cul || p.country, glasses: p.ill.some(function (i) { return i.id === 'myopia'; }), dead: S.dead }); }
    return G.avatar({ seed: x.av, age: G.N.age(x), g: x.g, looks: x.looks, skin: x.skin, happy: 50 + x.aff / 2, cul: x.c, dead: !x.alive });
  };
})();
