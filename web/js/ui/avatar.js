/* Procedural SVG avatars that age with the character */
(function () {
  'use strict';
  var SKIN = ['#f7dfcc', '#f1c9a6', '#e1ae86', '#c78e62', '#9c6842', '#6b4429'];
  var BG = ['#dcefe2', '#e3ebfa', '#fbeacc', '#f6dde3', '#e9e3f7', '#dff1f3', '#f2f0d9'];
  function rng(seed) { var s = seed >>> 0 || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function hairColor(r, skin, age, cul) {
    var dark = ['#1f1a17', '#2b211b', '#3a2a20'];
    var light = ['#e6c66e', '#b9783d', '#8a5a33', '#4a3324', '#a8432a', '#1f1a17'];
    var east = ['cn', 'jp', 'kr', 'sg', 'th'].indexOf(cul) >= 0;
    var c = (east || skin >= 3) ? dark[Math.floor(r() * dark.length)] : light[Math.floor(r() * light.length)];
    if (age > 72) return '#e8e6e1';
    if (age > 58) return '#a9a6a0';
    if (age > 48 && r() < .5) return '#77706a';
    return c;
  }
  G.avatar = function (o) {
    o = o || {};
    var r = rng(o.seed || 7), age = o.age || 0, g = o.g || 'm', skin = SKIN[o.skin != null ? o.skin : 1], looks = o.looks == null ? 50 : o.looks;
    var hc = hairColor(r, o.skin || 0, age, o.cul), bg = BG[Math.floor(r() * BG.length)];
    var baby = age < 3, kid = age < 12, old = age > 55;
    var style = Math.floor(r() * 4), glasses = o.glasses || r() < .15, bald = g === 'm' && old && r() < .35;
    var fw = baby ? 30 : kid ? 27 : 25, fh = baby ? 28 : kid ? 30 : 32, cy = baby ? 56 : 54;
    var s = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">';
    s += '<rect width="100" height="100" fill="' + bg + '"/>';
    // body / shoulders
    var shirt = ['#4c8fd6', '#e0708a', '#4ea56a', '#e3a92b', '#8a6bd1', '#ee7d4f', '#55665e'][Math.floor(r() * 7)];
    s += '<path d="M14 104 Q16 ' + (baby ? 82 : 78) + ' 50 ' + (baby ? 80 : 76) + ' Q84 ' + (baby ? 82 : 78) + ' 86 104Z" fill="' + shirt + '"/>';
    s += '<rect x="44" y="' + (cy + fh - 8) + '" width="12" height="10" fill="' + skin + '"/>';
    // back hair (long styles)
    if (!bald && !baby && g === 'f' && style !== 1) s += '<path d="M' + (50 - fw - 3) + ' ' + (cy - 4) + ' Q50 ' + (cy - fh - 10) + ' ' + (50 + fw + 3) + ' ' + (cy - 4) + ' L' + (50 + fw + 2) + ' ' + (cy + (style === 0 ? 30 : 14)) + ' L' + (50 - fw - 2) + ' ' + (cy + (style === 0 ? 30 : 14)) + 'Z" fill="' + hc + '"/>';
    // ears + face
    s += '<ellipse cx="' + (50 - fw) + '" cy="' + (cy + 2) + '" rx="4" ry="6" fill="' + skin + '"/><ellipse cx="' + (50 + fw) + '" cy="' + (cy + 2) + '" rx="4" ry="6" fill="' + skin + '"/>';
    s += '<ellipse cx="50" cy="' + cy + '" rx="' + fw + '" ry="' + fh + '" fill="' + skin + '"/>';
    // front hair
    if (baby) s += '<path d="M47 ' + (cy - fh + 2) + ' q3 -8 6 0" stroke="' + hc + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>';
    else if (!bald) {
      var top = cy - fh;
      if (g === 'm') {
        if (style === 0) s += '<path d="M' + (50 - fw) + ' ' + (cy - 6) + ' Q' + (50 - fw) + ' ' + (top - 6) + ' 50 ' + (top - 4) + ' Q' + (50 + fw) + ' ' + (top - 6) + ' ' + (50 + fw) + ' ' + (cy - 6) + ' Q60 ' + (top + 8) + ' 40 ' + (top + 6) + 'Z" fill="' + hc + '"/>';
        else if (style === 1) s += '<path d="M' + (50 - fw) + ' ' + (cy - 2) + ' Q' + (50 - fw - 2) + ' ' + (top - 4) + ' 50 ' + (top - 3) + ' Q' + (50 + fw + 2) + ' ' + (top - 4) + ' ' + (50 + fw) + ' ' + (cy - 2) + ' L' + (50 + fw - 4) + ' ' + (top + 10) + ' L' + (50 - fw + 6) + ' ' + (top + 12) + 'Z" fill="' + hc + '"/>';
        else if (style === 2) { for (var i = 0; i < 7; i++) s += '<circle cx="' + (32 + i * 6) + '" cy="' + (top + 3 + (i % 2) * 2) + '" r="6" fill="' + hc + '"/>'; }
        else s += '<path d="M' + (50 - fw + 1) + ' ' + (cy - 8) + ' Q50 ' + (top - 5) + ' ' + (50 + fw - 1) + ' ' + (cy - 8) + ' Q50 ' + (top + 3) + ' ' + (50 - fw + 1) + ' ' + (cy - 8) + 'Z" fill="' + hc + '"/>';
      } else {
        if (style === 1) s += '<path d="M' + (50 - fw - 3) + ' ' + (cy + 8) + ' Q' + (50 - fw - 4) + ' ' + (top - 6) + ' 50 ' + (top - 5) + ' Q' + (50 + fw + 4) + ' ' + (top - 6) + ' ' + (50 + fw + 3) + ' ' + (cy + 8) + ' L' + (50 + fw - 3) + ' ' + (cy - 4) + ' Q50 ' + (top + 10) + ' ' + (50 - fw + 3) + ' ' + (cy - 4) + 'Z" fill="' + hc + '"/>';
        else s += '<path d="M' + (50 - fw) + ' ' + (cy - 2) + ' Q' + (50 - fw - 1) + ' ' + (top - 6) + ' 50 ' + (top - 5) + ' Q' + (50 + fw + 1) + ' ' + (top - 6) + ' ' + (50 + fw) + ' ' + (cy - 2) + ' Q' + (56) + ' ' + (top + 9) + ' ' + (50 - fw + 4) + ' ' + (top + 12) + 'Z" fill="' + hc + '"/>';
        if (style === 2) s += '<circle cx="50" cy="' + (top - 8) + '" r="8" fill="' + hc + '"/>';
        if (style === 3 && !kid) s += '<circle cx="' + (50 + fw + 1) + '" cy="' + (cy - 10) + '" r="6" fill="' + hc + '"/>';
      }
    }
    // eyes
    var ey = cy + (baby ? 2 : 0), ex = baby ? 10 : 9, er = (baby || kid ? 3.4 : 2.8) + looks / 100;
    s += '<ellipse cx="' + (50 - ex) + '" cy="' + ey + '" rx="' + (er * .85) + '" ry="' + er + '" fill="#2a211c"/><ellipse cx="' + (50 + ex) + '" cy="' + ey + '" rx="' + (er * .85) + '" ry="' + er + '" fill="#2a211c"/>';
    if (looks > 45 || kid) s += '<circle cx="' + (50 - ex + 1) + '" cy="' + (ey - 1) + '" r="1" fill="#fff"/><circle cx="' + (50 + ex + 1) + '" cy="' + (ey - 1) + '" r="1" fill="#fff"/>';
    if (!baby) s += '<path d="M' + (50 - ex - 4) + ' ' + (ey - 7) + ' q4 -2 8 0 M' + (50 + ex - 4) + ' ' + (ey - 7) + ' q4 -2 8 0" stroke="' + (age > 60 ? '#9b948d' : '#3a2a20') + '" stroke-width="1.6" fill="none" stroke-linecap="round"/>';
    if (glasses && age >= 6) s += '<g fill="none" stroke="#2a2a2a" stroke-width="1.6"><circle cx="' + (50 - ex) + '" cy="' + ey + '" r="6"/><circle cx="' + (50 + ex) + '" cy="' + ey + '" r="6"/><path d="M' + (50 - ex + 6) + ' ' + ey + ' h' + (2 * ex - 12) + '"/></g>';
    // cheeks
    if (kid || g === 'f') s += '<ellipse cx="' + (50 - ex - 4) + '" cy="' + (ey + 8) + '" rx="4" ry="2.4" fill="#f08a8a" opacity=".35"/><ellipse cx="' + (50 + ex + 4) + '" cy="' + (ey + 8) + '" rx="4" ry="2.4" fill="#f08a8a" opacity=".35"/>';
    // nose & mouth
    s += '<path d="M50 ' + (ey + 4) + ' q-2 5 1 6" stroke="rgba(0,0,0,.25)" stroke-width="1.4" fill="none" stroke-linecap="round"/>';
    var mood = o.happy == null ? 60 : o.happy, my = ey + (baby ? 12 : 14), curve = mood > 40 ? 4 : mood > 20 ? 0 : -3;
    s += '<path d="M44 ' + my + ' Q50 ' + (my + curve) + ' 56 ' + my + '" stroke="#8b3a3a" stroke-width="2" fill="none" stroke-linecap="round"/>';
    if (g === 'f' && !kid) s += '<path d="M45 ' + my + ' Q50 ' + (my + curve + 1) + ' 55 ' + my + '" stroke="#d65a6a" stroke-width="1.4" fill="none" opacity=".7"/>';
    // wrinkles & beard
    if (age > 50) s += '<path d="M' + (50 - ex - 7) + ' ' + (ey + 1) + ' l-3 1 M' + (50 + ex + 7) + ' ' + (ey + 1) + ' l3 1 M42 ' + (cy - fh + 12) + ' h16" stroke="rgba(0,0,0,.18)" stroke-width="1.2"/>';
    if (g === 'm' && age > 25 && r() < .2) s += '<path d="M40 ' + (my + 2) + ' Q50 ' + (my + 12) + ' 60 ' + (my + 2) + '" stroke="' + hc + '" stroke-width="3" fill="none" opacity=".75"/>';
    if (o.dead) s += '<rect width="100" height="100" fill="#888" opacity=".45"/>';
    s += '</svg>';
    return s;
  };
  G.avatarOf = function (x) {
    var S = G.S;
    if (!x || x === S.p) { var p = S.p; return G.avatar({ seed: G.hash(p.name + p.birthYear), age: p.age, g: p.g, looks: p.st.looks, skin: p.skin != null ? p.skin : (p.skin = G.N.skinFor(p.country)), happy: p.st.happy, cul: p.cul || p.country, glasses: p.ill.some(function (i) { return i.id === 'myopia'; }), dead: S.dead }); }
    return G.avatar({ seed: x.av, age: G.N.age(x), g: x.g, looks: x.looks, skin: x.skin, happy: 50 + x.aff / 2, cul: x.c, dead: !x.alive });
  };
})();
