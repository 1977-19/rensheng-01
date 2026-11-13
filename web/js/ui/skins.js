/* Identity skins: every station in life has its own journal — paper, pattern, scene, tape and colors.
   A royal of Britain, Japan, Spain or Thailand gets that house's own motifs; a farm child gets kraft paper and
   terraced fields; and the journal changes as the person's place in the world changes. */
(function () {
  'use strict';
  var UI = G.UI;
  function sv(w, h, body) { return '<svg xmlns="http://www.w3.org/2000/svg" width="' + w + '" height="' + h + '" viewBox="0 0 ' + w + ' ' + h + '">' + body + '</svg>'; }
  function uri(s) { return 'url("data:image/svg+xml,' + encodeURIComponent(s) + '")'; }
  function scene(body) { return '<svg viewBox="0 0 360 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true">' + body + '</svg>'; }
  function sky(id, a, b, c) { return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/>' + (c ? '<stop offset=".62" stop-color="' + b + '"/><stop offset="1" stop-color="' + c + '"/>' : '<stop offset="1" stop-color="' + b + '"/>') + '</linearGradient></defs><rect width="360" height="120" fill="url(#' + id + ')"/>'; }
  function rep(n, f) { var s = ''; for (var i = 0; i < n; i++) s += f(i); return s; }
  function stars(c, pts) { return pts.map(function (q) { return '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="' + (q[2] || .9) + '" fill="' + c + '"/>'; }).join(''); }
  function hex(c) { c = c.replace('#', ''); return [parseInt(c.slice(0, 2), 16), parseInt(c.slice(2, 4), 16), parseInt(c.slice(4, 6), 16)]; }
  function mix(a, b, t) { var x = hex(a), y = hex(b); return '#' + x.map(function (v, i) { return ('0' + Math.round(v + (y[i] - v) * t).toString(16)).slice(-2); }).join(''); }
  function rgba(c, a) { var x = hex(c); return 'rgba(' + x.join(',') + ',' + a + ')'; }

  /* ---------- stickers (polaroid corner) ---------- */
  var STK = {
    crown: sv(32, 32, '<path d="M5 24 L4 10 L11 16 L16 6 L21 16 L28 10 L27 24 Z" fill="#e3b94f" stroke="#7a5512" stroke-width="1.6" stroke-linejoin="round"/><rect x="5" y="23.5" width="22" height="4" rx="1.2" fill="#c99a33" stroke="#7a5512" stroke-width="1.4"/><circle cx="16" cy="18" r="2" fill="#b3263a"/><circle cx="10" cy="20" r="1.3" fill="#2f5fb3"/><circle cx="22" cy="20" r="1.3" fill="#2f5fb3"/>'),
    kiku: sv(32, 32, rep(16, function (i) { return '<ellipse cx="16" cy="7.5" rx="2.6" ry="7" fill="#e3b94f" stroke="#8a6416" stroke-width=".8" transform="rotate(' + (i * 22.5) + ' 16 16)"/>'; }) + '<circle cx="16" cy="16" r="4.2" fill="#d6a63a" stroke="#8a6416" stroke-width="1"/>'),
    castle: sv(32, 32, '<path d="M6 28 V12 H9 V9 H11 V12 H13 V9 H15 V14 H17 V9 H19 V12 H21 V9 H23 V12 H26 V28 Z" fill="#e3b94f" stroke="#7a1424" stroke-width="1.5" stroke-linejoin="round"/><path d="M13.5 28 V22 a2.5 2.5 0 0 1 5 0 V28" fill="#7a1424"/><rect x="9" y="16" width="2.4" height="3.4" fill="#7a1424"/><rect x="20.6" y="16" width="2.4" height="3.4" fill="#7a1424"/>'),
    chedi: sv(32, 32, '<path d="M16 2 V9" stroke="#8a6416" stroke-width="1.6" stroke-linecap="round"/><path d="M12.5 10 h7 M13.5 12.5 h5" stroke="#8a6416" stroke-width="1.4"/><path d="M9 27 C9 21 11 19 11 16 C11 13.5 14 13 16 13 C18 13 21 13.5 21 16 C21 19 23 21 23 27 Z" fill="#e3b94f" stroke="#8a6416" stroke-width="1.5"/><rect x="7" y="26.5" width="18" height="3.5" rx="1" fill="#c99a33" stroke="#8a6416" stroke-width="1.3"/>'),
    fleur: sv(32, 32, '<path d="M16 4 C12 9 12 14 16 18 C20 14 20 9 16 4 Z M16 18 C12 13 6 12 5 17 C4 21 9 22 11 19 M16 18 C20 13 26 12 27 17 C28 21 23 22 21 19 M10 20 H22 M16 20 V28 M13 28 H19" fill="#e3c06a" stroke="#6a1d2c" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"/>'),
    diamond: sv(32, 32, '<path d="M5 12 L10 5 H22 L27 12 L16 28 Z" fill="#cfeee8" stroke="#0f3a32" stroke-width="1.5" stroke-linejoin="round"/><path d="M5 12 H27 M10 5 L13 12 L16 28 L19 12 L22 5 M13 12 L16 5 L19 12" fill="none" stroke="#0f3a32" stroke-width="1.1"/>'),
    star: sv(32, 32, '<path d="M16 3 L19.6 11.4 L28.6 12.2 L21.8 18.2 L23.8 27 L16 22.4 L8.2 27 L10.2 18.2 L3.4 12.2 L12.4 11.4 Z" fill="#f2c14e" stroke="#8a3a6a" stroke-width="1.5" stroke-linejoin="round"/>'),
    rose: sv(32, 32, '<path d="M16 29 V16" stroke="#2f4c33" stroke-width="1.8" stroke-linecap="round"/><path d="M16 22 C12 22 10 20 9 17 C12 17 15 19 16 22" fill="#3d6b44"/><circle cx="16" cy="11" r="7.5" fill="#b3202c" stroke="#5c0d14" stroke-width="1.3"/><path d="M12 10 C14 6 19 7 19 11 C19 14 14 15 13 12 C13 10 16 9 16.5 11" fill="none" stroke="#5c0d14" stroke-width="1.2" stroke-linecap="round"/>'),
    plum: sv(32, 32, rep(5, function (i) { return '<circle cx="16" cy="8.5" r="6" fill="#f3a3ad" stroke="#a8261e" stroke-width="1.1" transform="rotate(' + (i * 72) + ' 16 16)"/>'; }) + '<circle cx="16" cy="16" r="3.2" fill="#e8c04a" stroke="#a8261e" stroke-width="1"/>'),
    seal: sv(32, 32, '<circle cx="16" cy="16" r="12.5" fill="#e3c06a" stroke="#1b2a4a" stroke-width="1.6"/><circle cx="16" cy="16" r="9" fill="none" stroke="#1b2a4a" stroke-width="1" stroke-dasharray="2 2"/><path d="M16 9.5 L17.8 14 L22.6 14.2 L18.8 17.2 L20.1 21.8 L16 19.2 L11.9 21.8 L13.2 17.2 L9.4 14.2 L14.2 14 Z" fill="#1b2a4a"/>'),
    wheat: sv(32, 32, '<path d="M16 30 V8" stroke="#8a6a2c" stroke-width="1.6" stroke-linecap="round"/>' + rep(4, function (i) { var y = 8 + i * 5; return '<ellipse cx="12.5" cy="' + y + '" rx="2.6" ry="4.2" fill="#e8bf5a" stroke="#8a6a2c" stroke-width="1" transform="rotate(-28 12.5 ' + y + ')"/><ellipse cx="19.5" cy="' + y + '" rx="2.6" ry="4.2" fill="#e8bf5a" stroke="#8a6a2c" stroke-width="1" transform="rotate(28 19.5 ' + y + ')"/>'; }) + '<ellipse cx="16" cy="5" rx="2.4" ry="4" fill="#e8bf5a" stroke="#8a6a2c" stroke-width="1"/>'),
    heart: sv(32, 32, '<path d="M16 27 C6 20 3.5 15 3.5 11 C3.5 7.5 6.3 5 9.5 5 C12.3 5 14.6 6.8 16 9.2 C17.4 6.8 19.7 5 22.5 5 C25.7 5 28.5 7.5 28.5 11 C28.5 15 26 20 16 27 Z" fill="#ff8f86" stroke="#b5423a" stroke-width="1.5" stroke-linejoin="round"/><path d="M8.5 10 C8.8 8.6 9.8 8 11 8" fill="none" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/>'),
    plane: sv(32, 32, '<path d="M3 15 L29 4 L21 28 L15.5 19.5 Z" fill="#fdfbf6" stroke="#4b5560" stroke-width="1.5" stroke-linejoin="round"/><path d="M29 4 L15.5 19.5 L14 26 L17.8 21.3" fill="#dfe6ee" stroke="#4b5560" stroke-width="1.3" stroke-linejoin="round"/>'),
    book: sv(32, 32, '<path d="M4 8 C9 6 13 7 16 9.5 C19 7 23 6 28 8 V26 C23 24.5 19 25 16 27 C13 25 9 24.5 4 26 Z" fill="#fbf3dc" stroke="#2f4858" stroke-width="1.5" stroke-linejoin="round"/><path d="M16 9.5 V27" stroke="#2f4858" stroke-width="1.3"/><path d="M20 4 V13 L22 11.5 L24 13 V4" fill="#c9443a"/>')
  };

  /* ---------- desk patterns (tiles) ---------- */
  var PAT = {
    gb: sv(56, 56, '<g fill="none" stroke="#d8b45a" stroke-width="1" opacity=".42"><path d="M0 28 L28 0 L56 28 L28 56 Z"/><path d="M28 14 C33 20 33 24 28 28 C23 24 23 20 28 14 Z M28 42 C33 36 33 32 28 28 C23 32 23 36 28 42 Z M14 28 C20 23 24 23 28 28 C24 33 20 33 14 28 Z M42 28 C36 23 32 23 28 28 C32 33 36 33 42 28 Z"/><circle cx="28" cy="28" r="2.4"/><circle cx="0" cy="0" r="3"/><circle cx="56" cy="0" r="3"/><circle cx="0" cy="56" r="3"/><circle cx="56" cy="56" r="3"/></g>'),
    jp: sv(64, 56, '<g fill="none" stroke="#d6b45e" stroke-width=".9" opacity=".4">' + [[16, 14], [48, 42]].map(function (c) { return '<circle cx="' + c[0] + '" cy="' + c[1] + '" r="9"/><circle cx="' + c[0] + '" cy="' + c[1] + '" r="2.8"/>' + rep(16, function (i) { var a = i * Math.PI / 8; return '<path d="M' + (c[0] + Math.cos(a) * 2.8).toFixed(1) + ' ' + (c[1] + Math.sin(a) * 2.8).toFixed(1) + ' L' + (c[0] + Math.cos(a) * 9).toFixed(1) + ' ' + (c[1] + Math.sin(a) * 9).toFixed(1) + '"/>'; }); }).join('') + '<path d="M0 42 C6 36 12 36 16 42 M48 14 C54 8 60 8 64 14" /></g>'),
    es: sv(56, 56, '<g fill="none" stroke="#e0b04a" stroke-width="1" opacity=".42" stroke-linejoin="round"><path d="M8 24 V12 H10 V10 H12 V12 H14 V9 H16 V12 H18 V10 H20 V12 H22 V24 Z M13.5 24 V20 a1.5 1.5 0 0 1 3 0 V24"/><circle cx="43" cy="42" r="6"/><path d="M43 36 V33 M40 34.5 L43 36 L46 34.5"/><path d="M0 0 L56 56 M56 0 L0 56" stroke-dasharray="2 5"/></g>'),
    th: sv(48, 48, '<g fill="none" stroke="#e4b84a" stroke-width="1" opacity=".45" stroke-linecap="round"><path d="M24 4 C30 12 36 16 44 24 C36 32 30 36 24 44 C18 36 12 32 4 24 C12 16 18 12 24 4 Z"/><path d="M24 12 C27 17 31 20 36 24 C31 28 27 31 24 36 C21 31 17 28 12 24 C17 20 21 17 24 12 Z"/><path d="M24 20 C26 22 27 23 28 24 C27 25 26 26 24 28 C22 26 21 25 20 24 C21 23 22 22 24 20 Z"/><path d="M24 4 C22 1 20 1 19 2 M24 44 C26 47 28 47 29 46 M4 24 C1 26 1 28 2 29 M44 24 C47 22 47 20 46 19"/></g>'),
    noble: sv(44, 44, '<g fill="none" stroke="#c9a65a" stroke-width="1" opacity=".38" stroke-linejoin="round" stroke-linecap="round"><path d="M22 8 C19.5 11 19.5 14 22 16.5 C24.5 14 24.5 11 22 8 Z M22 16.5 C19 13.5 15 13 14.5 16 C14 18.5 17 19 18.5 17.5 M22 16.5 C25 13.5 29 13 29.5 16 C30 18.5 27 19 25.5 17.5 M18 19 H26 M22 19 V24"/><circle cx="0" cy="0" r="1.6"/><circle cx="44" cy="0" r="1.6"/><circle cx="0" cy="44" r="1.6"/><circle cx="44" cy="44" r="1.6"/><path d="M0 34 H44" stroke-dasharray="1 4"/></g>'),
    tycoon: sv(48, 28, '<g fill="none" stroke="#c9a65a" stroke-width="1" opacity=".42"><path d="M0 28 A24 24 0 0 1 48 28 M8 28 A16 16 0 0 1 40 28 M16 28 A8 8 0 0 1 32 28 M24 4 V28 M24 28 L7 11 M24 28 L41 11"/></g>'),
    star: sv(60, 60, '<g fill="#f2c14e" opacity=".42"><path d="M14 6 L15.5 11 L20.5 12.5 L15.5 14 L14 19 L12.5 14 L7.5 12.5 L12.5 11 Z"/><path d="M44 34 L45 37 L48 38 L45 39 L44 42 L43 39 L40 38 L43 37 Z"/><circle cx="40" cy="12" r="1.2"/><circle cx="20" cy="46" r="1.4"/><circle cx="54" cy="54" r="1"/></g>'),
    mafia: sv(14, 14, '<path d="M7 0 V14" stroke="#9a9aa6" stroke-width=".7" opacity=".28"/>'),
    red: sv(64, 40, '<g fill="none" stroke="#e0b04a" stroke-width="1.1" opacity=".4" stroke-linecap="round"><path d="M6 26 C6 20 12 18 15 21 C15 14 25 13 27 19 C30 15 37 17 36 22 C40 22 42 26 38 28 H8 C5 28 5 26 6 26 Z"/><path d="M15 21 C17 23 18 24 18 26 M27 19 C27 22 26 24 24 25"/><path d="M38 10 C38 6 42 5 44 7 C45 3 52 3 53 7 C56 6 59 8 57 11 H40 C38 11 38 10 38 10 Z"/></g>'),
    state: sv(40, 40, '<g fill="#d8b45a" opacity=".36"><path d="M10 4 L11.5 8.5 L16 8.6 L12.4 11.3 L13.7 15.8 L10 13.1 L6.3 15.8 L7.6 11.3 L4 8.6 L8.5 8.5 Z"/><path d="M30 24 L31.5 28.5 L36 28.6 L32.4 31.3 L33.7 35.8 L30 33.1 L26.3 35.8 L27.6 31.3 L24 28.6 L28.5 28.5 Z"/></g>'),
    rural: sv(36, 36, '<g fill="none" stroke="#6b4a26" stroke-width="1.6" opacity=".22" stroke-linecap="round"><path d="M2 6 H16 M2 12 H16 M20 24 H34 M20 30 H34"/><path d="M24 2 V16 M30 2 V16 M6 20 V34 M12 20 V34"/></g>'),
    city: sv(22, 22, '<circle cx="11" cy="11" r="1.4" fill="#ffffff" opacity=".55"/>'),
    humble: sv(16, 16, '<path d="M0 16 L16 0" stroke="#ffffff" stroke-width=".8" opacity=".22"/>'),
    cover: sv(40, 40, '<g fill="none" stroke="#d8b45a" stroke-width=".8" opacity=".3"><path d="M0 20 H40 M20 0 V40"/><circle cx="20" cy="20" r="3"/></g>')
  };

  /* ---------- scenes (top of the journal page) ---------- */
  var SC = {};
  SC.gb = scene(sky('gbs', '#1b2850', '#5d4a7c', '#e0a07a') + stars('#fff7e0', [[40, 18], [86, 30, 1.1], [130, 12], [212, 22], [252, 10, 1.1], [330, 40], [20, 46]]) +
    '<circle cx="300" cy="30" r="11" fill="#f6e7c1"/><circle cx="306" cy="26" r="10" fill="#2c3360"/>' +
    '<path d="M0 104 C60 92 120 96 180 100 C240 104 300 90 360 98 V120 H0 Z" fill="#141c38"/>' +
    '<g fill="#0f1630"><path d="M56 104 V78 H62 V74 H68 V78 H74 V74 H80 V78 H86 V74 H92 V78 H98 V104 Z"/><path d="M112 104 V54 H116 V50 H120 V54 H124 V50 H128 V54 H132 V50 H136 V54 H140 V104 Z"/><path d="M140 104 V70 H146 V66 H152 V70 H158 V66 H164 V70 H170 V66 H176 V70 H182 V66 H188 V70 H194 V104 Z"/><rect x="194" y="58" width="18" height="46"/><path d="M192 60 H214 V55 H210 V58 H206 V55 H200 V58 H196 V55 H192 Z"/><path d="M212 104 V80 H220 V76 H226 V80 H232 V76 H238 V80 H246 V104 Z"/><rect x="250" y="68" width="12" height="36"/><path d="M248 70 L256 58 L264 70 Z"/></g>' +
    '<path d="M126 50 V38" stroke="#0f1630" stroke-width="1.6"/><circle cx="126" cy="37" r="2.2" fill="#f2c76b"/>' +
    '<g fill="#f2c76b">' + [[118, 62], [130, 62], [118, 76], [130, 76], [148, 80], [160, 80], [172, 80], [184, 80], [200, 68], [200, 82], [66, 86], [80, 86], [222, 88], [234, 88], [254, 80]].map(function (q) { return '<rect x="' + q[0] + '" y="' + q[1] + '" width="4" height="6" rx="2"/>'; }).join('') + '</g>' +
    '<rect y="108" width="360" height="12" fill="#0b1128"/><path d="M0 108 C90 104 270 112 360 106" stroke="#d8b45a" stroke-width=".8" fill="none" opacity=".5"/>');
  SC.jp = scene(sky('jps', '#f3e6d6', '#f7d6bf') + '<circle cx="292" cy="34" r="15" fill="#c8372d"/>' +
    '<path d="M0 88 C50 74 110 78 160 84 C220 92 290 72 360 80 V120 H0 Z" fill="#d9c9b4"/>' +
    '<g fill="#2f4a3a"><ellipse cx="22" cy="74" rx="22" ry="9"/><ellipse cx="34" cy="64" rx="16" ry="7"/><ellipse cx="300" cy="78" rx="26" ry="9"/><ellipse cx="320" cy="68" rx="18" ry="7"/><ellipse cx="146" cy="80" rx="14" ry="6"/></g><path d="M30 100 C28 90 30 82 26 74 M312 100 C312 90 316 82 314 70 M146 98 V80" stroke="#3b2e22" stroke-width="2.4" fill="none"/>' +
    '<path d="M44 104 L52 82 H120 L128 104 Z" fill="#8f8a80"/><path d="M48 98 H124 M51 90 H121" stroke="#77736a" stroke-width="1"/><rect x="62" y="62" width="48" height="20" fill="#f6f2e9"/><path d="M54 64 Q86 52 118 64 L110 60 H62 Z" fill="#394646"/><rect x="70" y="48" width="32" height="12" fill="#f6f2e9"/><path d="M64 50 Q86 40 108 50 L102 46 H70 Z" fill="#394646"/><rect x="76" y="66" width="5" height="7" fill="#394646"/><rect x="91" y="66" width="5" height="7" fill="#394646"/>' +
    '<rect y="100" width="360" height="20" fill="#8fb0b4"/><path d="M10 110 H60 M120 114 H200 M240 108 H330" stroke="#d5e4e4" stroke-width="1.2"/>' +
    '<path d="M150 98 H270 V104 H260 A16 11 0 0 0 228 104 H192 A16 11 0 0 0 160 104 H150 Z" fill="#cbc5b8"/><path d="M152 98 V92 M270 98 V92" stroke="#3b2e22" stroke-width="1.5"/><circle cx="152" cy="91" r="2" fill="#f2c76b"/><circle cx="270" cy="91" r="2" fill="#f2c76b"/><path d="M160 114 A16 8 0 0 1 192 114 M228 114 A16 8 0 0 1 260 114" stroke="#b5ad9e" fill="none"/>');
  SC.es = scene(sky('ess', '#9cc3e6', '#f4e3c0') + '<circle cx="60" cy="28" r="12" fill="#fff4d6"/>' +
    '<rect x="24" y="56" width="312" height="48" fill="#efe3c8" stroke="#b9a37a" stroke-width="1"/><rect x="24" y="92" width="312" height="12" fill="#d9c7a0"/><rect x="20" y="50" width="320" height="6" fill="#e2d2ad"/>' + rep(26, function (i) { return '<rect x="' + (28 + i * 12) + '" y="46" width="3" height="5" fill="#cdbb92"/>'; }) +
    '<rect x="20" y="44" width="40" height="60" fill="#e8dbbe" stroke="#b9a37a"/><rect x="300" y="44" width="40" height="60" fill="#e8dbbe" stroke="#b9a37a"/><path d="M150 50 L180 34 L210 50 Z" fill="#e8dbbe" stroke="#b9a37a"/><circle cx="180" cy="44" r="4" fill="#fff8e6" stroke="#b9a37a"/>' +
    '<g fill="#6b5a44">' + rep(13, function (i) { var x = 36 + i * 23; return '<path d="M' + x + ' 88 V76 a4 4 0 0 1 8 0 V88 Z"/><rect x="' + x + '" y="62" width="8" height="8"/>'; }) + '</g>' +
    '<path d="M180 34 V26" stroke="#6b5a44" stroke-width="1.4"/><circle cx="180" cy="25" r="2.4" fill="#d8b45a"/>' +
    '<rect y="104" width="360" height="16" fill="#e2c99a"/><path d="M0 110 H360" stroke="#d1b480" stroke-dasharray="6 6"/><path d="M100 104 V86 M260 104 V86" stroke="#3a3328" stroke-width="2"/><circle cx="100" cy="85" r="3" fill="#f2c76b"/><circle cx="260" cy="85" r="3" fill="#f2c76b"/>');
  SC.th = scene(sky('ths', '#f2c76a', '#fbeccb') + '<circle cx="64" cy="30" r="13" fill="#fff3cf"/>' +
    '<g fill="#3e6b3e"><path d="M18 104 C18 80 20 70 22 60" stroke="#5a4a2e" stroke-width="2" fill="none"/><path d="M22 60 C12 58 6 62 2 66 M22 60 C30 54 38 56 42 60 M22 60 C18 50 12 48 8 48 M22 60 C26 50 34 48 38 50" stroke="#3e6b3e" stroke-width="3.2" fill="none" stroke-linecap="round"/></g>' +
    '<path d="M244 104 C242 88 236 84 236 76 C236 68 248 62 254 56 C260 62 272 68 272 76 C272 84 266 88 264 104 Z" fill="#e0a92c" stroke="#9a6a14"/><path d="M254 56 V18" stroke="#c8901f" stroke-width="3"/><path d="M248 46 H260 M249 40 H259 M250 34 H258 M251 28 H257" stroke="#9a6a14" stroke-width="1.6"/>' +
    '<rect x="92" y="78" width="120" height="26" fill="#fbf6ea" stroke="#c9b48a"/>' +
    '<path d="M80 80 L100 62 H204 L224 80 Z" fill="#c8502e"/><path d="M80 80 H224" stroke="#2f7a55" stroke-width="2.4"/><path d="M92 64 L110 48 H194 L212 64 Z" fill="#d35a33"/><path d="M92 64 H212" stroke="#2f7a55" stroke-width="2"/><path d="M106 49 L124 36 H180 L198 49 Z" fill="#c8502e"/><path d="M106 49 H198" stroke="#2f7a55" stroke-width="1.8"/>' +
    '<path d="M80 80 C76 80 74 76 72 72 M224 80 C228 80 230 76 232 72 M92 64 C88 64 86 60 85 56 M212 64 C216 64 218 60 219 56 M106 49 C103 49 101 46 100 42 M198 49 C201 49 203 46 204 42" stroke="#e0a92c" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    '<path d="M146 36 L152 10 L158 36 Z" fill="#e0a92c" stroke="#9a6a14"/><path d="M128 36 L152 22 L176 36 Z" fill="#e0a92c" opacity=".9"/>' +
    '<g fill="#e0a92c">' + rep(5, function (i) { return '<rect x="' + (104 + i * 20) + '" y="84" width="8" height="14" rx="4"/>'; }) + '</g>' +
    '<rect y="100" width="360" height="20" fill="#fbf6ea"/>' + rep(30, function (i) { return '<path d="M' + (i * 12) + ' 100 L' + (i * 12 + 6) + ' 94 L' + (i * 12 + 12) + ' 100 Z" fill="#fbf6ea" stroke="#d9c79c" stroke-width=".8"/>'; }) + '<rect y="104" width="360" height="16" fill="#e7d6ae"/>');
  SC.noble = scene(sky('nbs', '#c9dce6', '#eef2e6') + '<g fill="#ffffff" opacity=".85"><ellipse cx="70" cy="26" rx="22" ry="7"/><ellipse cx="88" cy="22" rx="14" ry="7"/><ellipse cx="280" cy="34" rx="26" ry="7"/></g>' +
    '<path d="M0 92 C80 80 280 80 360 92 V120 H0 Z" fill="#86a86e"/>' +
    '<g fill="#5f8a52"><circle cx="40" cy="78" r="16"/><circle cx="58" cy="84" r="12"/><circle cx="312" cy="78" r="17"/><circle cx="294" cy="86" r="11"/></g><path d="M44 96 V86 M312 96 V86" stroke="#4a3a28" stroke-width="2.5"/>' +
    '<rect x="104" y="58" width="152" height="40" fill="#e8dfcf" stroke="#a89a80"/><path d="M98 60 L180 36 L262 60 Z" fill="#5a5560"/><rect x="122" y="36" width="8" height="16" fill="#6a6470"/><rect x="230" y="36" width="8" height="16" fill="#6a6470"/>' +
    '<path d="M160 60 L180 48 L200 60 Z" fill="#efe8da" stroke="#a89a80"/><g fill="#f6f1e6" stroke="#a89a80" stroke-width=".8"><rect x="162" y="60" width="4" height="38"/><rect x="172" y="60" width="4" height="38"/><rect x="184" y="60" width="4" height="38"/><rect x="194" y="60" width="4" height="38"/></g>' +
    '<g fill="#5b6470">' + [112, 126, 140, 214, 228, 242].map(function (x) { return '<rect x="' + x + '" y="64" width="8" height="11"/><rect x="' + x + '" y="81" width="8" height="11"/>'; }).join('') + '</g><path d="M176 98 V88 a4 4 0 0 1 8 0 V98" fill="#4a3a30"/>' +
    '<path d="M180 120 C176 110 178 104 180 98" stroke="#e6dcc4" stroke-width="14" fill="none"/><rect x="100" y="96" width="160" height="4" fill="#4f7a4a"/>');
  SC.tycoon = scene(sky('tys', '#0d2632', '#1a4a4e') + stars('#f6e7c1', [[30, 16], [74, 30], [120, 12], [210, 18], [262, 32], [330, 14], [350, 40]]) + '<circle cx="306" cy="26" r="9" fill="#f1dc9a" opacity=".9"/>' +
    '<g fill="#173e44">' + [[0, 60, 26], [28, 44, 22], [54, 70, 30], [92, 36, 24], [226, 50, 26], [258, 66, 30], [292, 40, 22], [318, 58, 42]].map(function (q) { return '<rect x="' + q[0] + '" y="' + q[1] + '" width="' + q[2] + '" height="' + (110 - q[1]) + '"/>'; }).join('') + '</g>' +
    '<g fill="#0a1d21">' + [[10, 76, 30], [44, 62, 26], [122, 52, 28], [196, 58, 30], [240, 78, 36], [282, 70, 26], [312, 84, 48]].map(function (q) { return '<rect x="' + q[0] + '" y="' + q[1] + '" width="' + q[2] + '" height="' + (110 - q[1]) + '"/>'; }).join('') +
    '<path d="M160 110 V30 L172 20 L184 30 V110 Z"/><path d="M172 20 V4" stroke="#0a1d21" stroke-width="2"/><path d="M160 30 L172 22 L184 30" fill="none" stroke="#e6c070" stroke-width="1.4"/><path d="M164 38 L172 32 L180 38 M164 46 L172 40 L180 46" fill="none" stroke="#e6c070" stroke-width="1"/></g>' +
    '<g fill="#e6c070">' + [[166, 56], [176, 56], [166, 66], [176, 74], [166, 84], [176, 92], [130, 62], [140, 76], [130, 90], [204, 68], [214, 82], [204, 96], [52, 72], [60, 88], [290, 80], [248, 88], [20, 86]].map(function (q) { return '<rect x="' + q[0] + '" y="' + q[1] + '" width="3" height="4"/>'; }).join('') + '</g>' +
    '<rect y="108" width="360" height="12" fill="#0a1f23"/><path d="M164 112 H180 M126 116 H150 M200 114 H222 M40 115 H70" stroke="#e6c070" stroke-width="1" opacity=".6"/>');
  SC.star = scene('<rect width="360" height="120" fill="#1b1030"/>' +
    '<path d="M60 0 L150 104 H190 L120 0 Z" fill="#fff3c4" opacity=".14"/><path d="M300 0 L210 104 H170 L240 0 Z" fill="#fff3c4" opacity=".14"/>' +
    '<path d="M0 0 H54 C50 30 56 70 44 104 H0 Z" fill="#8c1d3a"/><path d="M14 0 C12 40 16 70 10 104 M30 0 C28 40 32 70 26 104" stroke="#b02a4a" stroke-width="5" fill="none"/><path d="M360 0 H306 C310 30 304 70 316 104 H360 Z" fill="#8c1d3a"/><path d="M346 0 C348 40 344 70 350 104 M330 0 C332 40 328 70 334 104" stroke="#b02a4a" stroke-width="5" fill="none"/><path d="M0 0 H360 V10 C300 18 60 18 0 10 Z" fill="#a52646"/>' +
    '<rect x="40" y="92" width="280" height="14" fill="#3a2448"/><path d="M180 92 V66" stroke="#c9c2d6" stroke-width="2"/><ellipse cx="180" cy="64" rx="3.5" ry="5" fill="#d9d3e3"/><path d="M174 92 H186" stroke="#c9c2d6" stroke-width="2"/>' +
    '<g fill="#f2c14e">' + [[90, 40], [120, 24], [240, 30], [270, 50], [200, 18], [150, 50]].map(function (q, i) { return '<rect x="' + q[0] + '" y="' + q[1] + '" width="4" height="2" transform="rotate(' + (i * 37) + ' ' + q[0] + ' ' + q[1] + ')"/>'; }).join('') + '</g><g fill="#e0457b"><rect x="104" y="60" width="3" height="3"/><rect x="250" y="70" width="3" height="3"/><rect x="214" y="44" width="3" height="3"/></g>' +
    '<g fill="#0d0818">' + rep(19, function (i) { var x = 4 + i * 19.5, y = 108 + (i % 3) * 2; return '<circle cx="' + x + '" cy="' + y + '" r="7"/><rect x="' + (x - 9) + '" y="' + (y + 4) + '" width="18" height="14" rx="6"/>' + (i % 4 === 1 ? '<path d="M' + (x + 4) + ' ' + (y - 2) + ' L' + (x + 9) + ' ' + (y - 16) + '" stroke="#0d0818" stroke-width="3.5" stroke-linecap="round"/>' : ''); }) + '</g>');
  SC.mafia = scene(sky('mfs', '#16171c', '#2b2e37') + '<g fill="#101116">' + [[0, 34, 50], [54, 50, 40], [98, 26, 46], [240, 40, 44], [288, 22, 72]].map(function (q) { return '<rect x="' + q[0] + '" y="' + q[1] + '" width="' + q[2] + '" height="' + (110 - q[1]) + '"/>'; }).join('') + '</g>' +
    '<g fill="#d9a54a" opacity=".85">' + [[10, 46], [30, 62], [62, 60], [108, 40], [124, 70], [252, 52], [300, 36], [324, 58], [300, 80]].map(function (q) { return '<rect x="' + q[0] + '" y="' + q[1] + '" width="6" height="8"/>'; }).join('') + '</g>' +
    '<rect x="150" y="54" width="70" height="56" fill="#191a20"/><rect x="160" y="60" width="50" height="18" rx="3" fill="none" stroke="#e0457b" stroke-width="2"/><text x="185" y="74" fill="#ff8fb5" font-size="13" font-family="Georgia,serif" text-anchor="middle" font-weight="700">BAR</text><rect x="172" y="86" width="26" height="24" fill="#3a2a1a"/><rect x="174" y="88" width="22" height="20" fill="#d9a54a" opacity=".6"/>' +
    '<path d="M232 110 V60 M232 60 H242" stroke="#3a3c46" stroke-width="2.4" fill="none"/><path d="M242 60 L226 110 H262 Z" fill="#f2d48a" opacity=".12"/><circle cx="242" cy="62" r="3" fill="#f6e2a8"/>' +
    '<path d="M20 108 C24 98 34 96 46 96 L58 90 H92 L104 96 C114 96 120 100 120 108 Z" fill="#0b0b0e"/><circle cx="42" cy="108" r="6" fill="#1d1e24" stroke="#4a4c56"/><circle cx="100" cy="108" r="6" fill="#1d1e24" stroke="#4a4c56"/>' +
    '<rect y="110" width="360" height="10" fill="#1a1b21"/><path d="M180 112 V120 M240 112 V118" stroke="#e0457b" stroke-width="2" opacity=".35"/>' +
    '<g stroke="#9aa3b5" stroke-width=".9" opacity=".35">' + rep(36, function (i) { var x = (i * 37) % 360, y = (i * 23) % 100; return '<path d="M' + x + ' ' + y + ' l-3 9"/>'; }) + '</g>');
  SC.red = scene(sky('rds', '#e6ecf0', '#f7efe0') +
    '<g fill="#d9a63a"><circle cx="300" cy="44" r="20"/><circle cx="322" cy="56" r="15"/><circle cx="284" cy="60" r="14"/></g><path d="M302 104 C302 84 300 70 304 58" stroke="#5a4532" stroke-width="4" fill="none"/>' +
    '<rect x="0" y="64" width="360" height="40" fill="#8f8a86"/>' + rep(24, function (i) { return '<path d="M' + (i * 15) + ' 64 V104" stroke="#7d7874" stroke-width=".6"/>'; }) + '<path d="M0 60 Q180 54 360 60 V66 H0 Z" fill="#4f5155"/>' +
    '<path d="M126 104 V52 H234 V104 Z" fill="#9a948f"/><path d="M114 54 Q180 34 246 54 L238 48 H122 Z" fill="#45474b"/><path d="M118 54 H242" stroke="#2f3134" stroke-width="2"/>' +
    '<rect x="150" y="62" width="60" height="42" fill="#a8261e"/><path d="M180 62 V104" stroke="#7d1a14" stroke-width="2"/><g fill="#e8c04a">' + rep(3, function (r) { return rep(3, function (c) { return '<circle cx="' + (158 + c * 7) + '" cy="' + (72 + r * 8) + '" r="1.5"/><circle cx="' + (188 + c * 7) + '" cy="' + (72 + r * 8) + '" r="1.5"/>'; }); }) + '</g>' +
    '<path d="M142 58 V64 M218 58 V64" stroke="#3a2a1a"/><ellipse cx="142" cy="70" rx="6" ry="7" fill="#d23a2a"/><ellipse cx="218" cy="70" rx="6" ry="7" fill="#d23a2a"/><path d="M142 77 V81 M218 77 V81" stroke="#e8c04a" stroke-width="1.4"/>' +
    '<rect x="120" y="104" width="120" height="6" fill="#b9b3ad"/><rect y="110" width="360" height="10" fill="#cfc8bd"/><path d="M134 104 a6 6 0 0 1 12 0 M214 104 a6 6 0 0 1 12 0" fill="#a9a39c"/>');
  SC.state = scene(sky('sts', '#c8dcf0', '#eef4fa') + '<g fill="#fff" opacity=".9"><ellipse cx="60" cy="24" rx="24" ry="7"/><ellipse cx="300" cy="30" rx="20" ry="6"/></g>' +
    '<rect x="40" y="70" width="280" height="30" fill="#f1efe9" stroke="#b8b4aa"/><rect x="34" y="66" width="292" height="6" fill="#e6e2d8" stroke="#b8b4aa" stroke-width=".8"/>' +
    '<g fill="#e6e2d8" stroke="#b8b4aa" stroke-width=".7">' + rep(22, function (i) { var x = 46 + i * 12.4; return x > 150 && x < 210 ? '' : '<rect x="' + x + '" y="72" width="4" height="28"/>'; }) + '</g>' +
    '<rect x="148" y="52" width="64" height="48" fill="#f1efe9" stroke="#b8b4aa"/><path d="M144 54 L180 40 L216 54 Z" fill="#e6e2d8" stroke="#b8b4aa"/><rect x="156" y="30" width="48" height="12" fill="#ebe8e0" stroke="#b8b4aa"/><path d="M152 32 C152 10 208 10 208 32 Z" fill="#f4f2ec" stroke="#b8b4aa"/><path d="M180 12 V2" stroke="#7d7a72" stroke-width="1.6"/><circle cx="180" cy="12" r="2.4" fill="#d8b45a"/>' +
    '<g fill="#e6e2d8" stroke="#b8b4aa" stroke-width=".7">' + rep(5, function (i) { return '<rect x="' + (154 + i * 11.5) + '" y="56" width="4" height="44"/>'; }) + '</g>' +
    '<path d="M120 100 H240 L250 112 H110 Z" fill="#dcd8ce"/><path d="M114 106 H246" stroke="#c4c0b6"/><rect y="112" width="360" height="8" fill="#8fb07a"/>' +
    '' +
    '<g fill="#5f8a52"><circle cx="16" cy="100" r="10"/><circle cx="342" cy="98" r="12"/></g>');
  SC.rural = scene(sky('rus', '#f8d6a2', '#fdf1d8') + '<circle cx="250" cy="40" r="15" fill="#f2a33a" opacity=".9"/><path d="M118 30 q4 -3 8 0 q4 -3 8 0 M142 42 q3 -2.4 6 0 q3 -2.4 6 0" fill="none" stroke="#6b4a26" stroke-width="1.3" stroke-linecap="round"/>' +
    '<path d="M0 74 C40 54 80 50 120 62 C160 74 190 52 230 50 C270 48 310 66 360 58 V120 H0 Z" fill="#b6c78a"/>' +
    '<path d="M0 92 C40 76 90 72 140 84 C180 94 220 98 260 92 C300 86 330 80 360 84 V120 H0 Z" fill="#8ea85a"/>' +
    '<g fill="none" stroke="#c9d79c" stroke-width="1.4"><path d="M6 98 C50 86 96 84 140 92"/><path d="M2 106 C50 96 110 94 160 102"/><path d="M0 114 C60 106 130 106 200 112"/></g>' +
    '<path d="M226 120 C232 108 244 100 262 92" fill="none" stroke="#e9d8a8" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M196 94 C196 84 194 76 198 66" stroke="#5a4532" stroke-width="3" fill="none"/><g fill="#5f8233"><circle cx="190" cy="64" r="10"/><circle cx="202" cy="58" r="11"/><circle cx="200" cy="70" r="8"/></g>' +
    '<rect x="258" y="74" width="48" height="20" fill="#f3e2bf" stroke="#6b4a26" stroke-width="1.3"/><path d="M250 76 L264 60 H300 L314 76 Z" fill="#7a5a36"/><rect x="276" y="80" width="10" height="14" fill="#6b4a26"/><rect x="292" y="80" width="8" height="7" fill="#6b4a26" opacity=".6"/><rect x="264" y="80" width="7" height="7" fill="#6b4a26" opacity=".6"/>' +
    '<path d="M302 58 C298 48 308 42 302 32 C296 22 306 16 302 6" fill="none" stroke="#8a7a66" stroke-width="2" opacity=".4" stroke-linecap="round"/>' +
    '<path d="M320 96 C324 96 330 92 334 86 M326 96 V86" stroke="#6b4a26" stroke-width="1.2" fill="none"/><g fill="#e8bf5a">' + rep(6, function (i) { return '<path d="M' + (20 + i * 26) + ' 120 V108 M' + (16 + i * 26) + ' 110 l4 -6 M' + (24 + i * 26) + ' 110 l-4 -6" stroke="#c69a3a" stroke-width="1.4"/>'; }) + '</g>');
  SC.city = scene(sky('cts', '#bfe0f7', '#eaf6ff') + '<g fill="#fff"><ellipse cx="70" cy="26" rx="22" ry="8"/><ellipse cx="90" cy="22" rx="14" ry="8"/><ellipse cx="270" cy="20" rx="18" ry="7"/><ellipse cx="286" cy="16" rx="12" ry="7"/></g>' +
    [[8, 50, 40, '#f4c7a8'], [52, 36, 34, '#a9cdf0'], [90, 58, 46, '#f7e0a3'], [140, 30, 38, '#c9b8ee'], [182, 48, 44, '#a8dcc8'], [230, 40, 36, '#f4b7b2'], [270, 56, 44, '#b7d3f2'], [318, 44, 42, '#f7d39b']].map(function (q) {
      var s = '<rect x="' + q[0] + '" y="' + q[1] + '" width="' + q[2] + '" height="' + (104 - q[1]) + '" fill="' + q[3] + '" stroke="#6b85a8" stroke-width=".8"/>';
      for (var y = q[1] + 6; y < 96; y += 10) for (var x = q[0] + 5; x < q[0] + q[2] - 6; x += 9) s += '<rect x="' + x + '" y="' + y + '" width="5" height="5" fill="#ffffff" opacity=".75"/>';
      return s; }).join('') +
    '<g fill="#6fbf7a"><circle cx="46" cy="98" r="9"/><circle cx="176" cy="98" r="8"/><circle cx="312" cy="98" r="9"/></g><rect y="104" width="360" height="16" fill="#9aa7b8"/><path d="M0 112 H360" stroke="#f4f7fb" stroke-width="1.6" stroke-dasharray="10 8"/>' +
    '<rect x="196" y="94" width="58" height="16" rx="4" fill="#ffc94d" stroke="#8a6a1c"/><g fill="#dff1ff">' + rep(4, function (i) { return '<rect x="' + (200 + i * 12) + '" y="97" width="9" height="6" rx="1"/>'; }) + '</g><circle cx="208" cy="111" r="3.5" fill="#3a3f4a"/><circle cx="242" cy="111" r="3.5" fill="#3a3f4a"/>');
  SC.humble = scene(sky('hbs', '#d3d9df', '#eef0f2') +
    '<rect x="10" y="30" width="120" height="74" fill="#b3b6b8" stroke="#8d9093"/><rect x="200" y="20" width="150" height="84" fill="#a9adb1" stroke="#8d9093"/>' +
    '<g fill="#8f9396">' + rep(4, function (r) { return rep(5, function (c) { return '<rect x="' + (18 + c * 22) + '" y="' + (38 + r * 16) + '" width="12" height="9"/>'; }) + rep(6, function (c) { return '<rect x="' + (208 + c * 23) + '" y="' + (28 + r * 18) + '" width="13" height="10"/>'; }); }) + '</g>' +
    '<g fill="#d7d9db" stroke="#8d9093" stroke-width=".6">' + rep(3, function (r) { return '<rect x="' + (220 + r * 46) + '" y="' + (44 + r * 8) + '" width="12" height="7"/>'; }) + '</g>' +
    '<path d="M130 50 C150 58 180 58 200 48" stroke="#5a5d61" stroke-width="1" fill="none"/><g>' + [[142, 54, '#e0664a'], [156, 56, '#4b7aa8'], [170, 56, '#e0b44c'], [184, 54, '#6aa36a']].map(function (q) { return '<rect x="' + q[0] + '" y="' + q[1] + '" width="9" height="12" fill="' + q[2] + '"/>'; }).join('') + '</g>' +
    '<path d="M0 22 C80 30 200 12 360 26 M0 14 C100 22 220 6 360 18" stroke="#4a4d52" stroke-width=".8" fill="none"/>' +
    '<rect y="104" width="360" height="16" fill="#c4c0b6"/><path d="M0 106 H360" stroke="#a9a59b"/>' +
    '<g fill="none" stroke="#3a3d42" stroke-width="1.6"><circle cx="160" cy="108" r="7"/><circle cx="184" cy="108" r="7"/><path d="M160 108 L168 98 H180 L184 108 M168 98 L172 108 H160 M178 94 H184"/></g>');
  SC.cover = '';

  /* ---------- the skins ---------- */
  // d: desk colors · p: paper, paper2, line, grid, grid2 · k: ink, ink2, ink3 · e: frame/border · a: stamp/accent · b: link/button
  function S(id, o) { o.id = id; SKN[id] = o; }
  var SKN = G.SKINS = {};
  S('royal-gb', { n: '英国王室 · 狮与玫瑰|British Royal · Lion & Rose', d: ['#1b2850', '#0e1730', '#25356a'], p: ['#f6f0e1', '#fbf7ec', '#e8dcc0', '#efe6d0', '#d8c69c'], k: ['#1d2238', '#585a6e', '#9b97a3'], e: '#1d2a52', a: '#b3263a', b: '#24408e', g: '#3c6b4f', gold: '#c9a24a', t: ['#b3263a', '#24408e', '#c9a24a', '#3c6b4f'], pat: 'gb', sc: 'gb', stk: 'crown', rib: '#b3263a',
    tape: 'repeating-linear-gradient(90deg, #b3263a 0 6px, #f3e9d2 6px 12px)', dk: 1 });
  S('royal-jp', { n: '日本皇室 · 菊纹|Japanese Imperial · Chrysanthemum', d: ['#3b1f4f', '#2a1438', '#53306d'], p: ['#f8f4ec', '#fcfaf5', '#ebe0cc', '#f0e9da', '#d9cbb0'], k: ['#2a1d33', '#5e536a', '#a49cab'], e: '#4a2a5e', a: '#b8322d', b: '#5a3a7e', g: '#2f6b5a', gold: '#c8a24c', t: ['#b8322d', '#4a2a5e', '#c8a24c', '#2f6b5a'], pat: 'jp', sc: 'jp', stk: 'kiku', rib: '#6a3d8a',
    tape: 'repeating-linear-gradient(45deg, #c8a24c 0 4px, #efe2b8 4px 8px)', dk: 1 });
  S('royal-es', { n: '西班牙王室 · 城堡与雄狮|Spanish Royal · Castle & Lion', d: ['#7a1424', '#5a0e1a', '#952033'], p: ['#f7efdf', '#fcf7ec', '#eadcc0', '#f0e6d1', '#dcc79c'], k: ['#2b1a17', '#64504a', '#a8948c'], e: '#6a1220', a: '#a8172b', b: '#22427a', g: '#3d6b3a', gold: '#d4a93c', t: ['#a8172b', '#d4a93c', '#22427a', '#3d6b3a'], pat: 'es', sc: 'es', stk: 'castle', rib: '#d4a93c',
    tape: 'repeating-linear-gradient(90deg, #a8172b 0 8px, #ecc650 8px 16px)', dk: 1 });
  S('royal-th', { n: '泰国王室 · 金色火焰纹|Thai Royal · Golden Kranok', d: ['#1f2f6b', '#142257', '#2c3f88'], p: ['#fbf3df', '#fdf9ee', '#eedfb8', '#f3e8cc', '#dfc78e'], k: ['#2a2216', '#66573e', '#a8977a'], e: '#7a5a14', a: '#a3262a', b: '#1f2f6b', g: '#2f7a55', gold: '#d9a92c', t: ['#a3262a', '#d9a92c', '#1f2f6b', '#2f7a55'], pat: 'th', sc: 'th', stk: 'chedi', rib: '#d9a92c',
    tape: 'linear-gradient(90deg, #d9a92c, #f6dc85 50%, #d9a92c)', dk: 1 });
  S('noble', { n: '名门望族 · 鸢尾纹|Old Aristocracy · Fleur-de-lis', d: ['#4a1d2c', '#36131f', '#60283a'], p: ['#f5efe4', '#fbf8f1', '#e7dccb', '#eee6d8', '#d6c6ab'], k: ['#2c1d22', '#64545a', '#a3959a'], e: '#4a1d2c', a: '#8c2236', b: '#34456b', g: '#2f5a3a', gold: '#b9954e', t: ['#8c2236', '#2f5a3a', '#b9954e', '#34456b'], pat: 'noble', sc: 'noble', stk: 'fleur', rib: '#8c2236',
    tape: 'repeating-linear-gradient(135deg, #8c2236 0 5px, #efe2c8 5px 10px)', dk: 1 });
  S('tycoon', { n: '商界巨擘 · 装饰艺术|Tycoon · Art Deco', d: ['#0f3a32', '#0a2a24', '#16503f'], p: ['#f4f1ea', '#fbfaf6', '#e4ddcd', '#ece7dc', '#d2c7ae'], k: ['#14211e', '#4f5c58', '#959e9a'], e: '#0f3a32', a: '#a8822f', b: '#1f5a4c', g: '#1f6a52', gold: '#c6a052', t: ['#0f3a32', '#b8913f', '#2b4f8a', '#8a2e3b'], pat: 'tycoon', sc: 'tycoon', stk: 'diamond', rib: '#c6a052',
    tape: 'linear-gradient(100deg, #b8913f, #f1dc9a 45%, #b8913f)', dk: 1 });
  S('star', { n: '星光璀璨|Stardom', d: ['#2a1846', '#1c1033', '#3b2262'], p: ['#fbf6fb', '#fffbff', '#efe1ef', '#f4eaf4', '#dcc8de'], k: ['#2a1d33', '#64566e', '#a69bae'], e: '#3a2160', a: '#d63c74', b: '#6a4fd0', g: '#2f9a8a', gold: '#f2c14e', t: ['#d63c74', '#e8b03e', '#6a4fd0', '#2fa596'], pat: 'star', sc: 'star', stk: 'star', rib: '#d63c74',
    tape: 'repeating-linear-gradient(45deg, #e0457b 0 5px, #f7c6d8 5px 10px)', dk: 1 });
  S('mafia', { n: '黑道 · 细条纹|Underworld · Pinstripe', d: ['#1c1c21', '#121215', '#2a2a31'], p: ['#efebe4', '#f7f4ee', '#ddd6ca', '#e6e0d5', '#c9bfae'], k: ['#1d1b1b', '#58524c', '#9a928a'], e: '#26262c', a: '#9e1b24', b: '#3a3a42', g: '#2f4c46', gold: '#b59a5b', t: ['#9e1b24', '#3a3a42', '#b59a5b', '#2f4c46'], pat: 'mafia', sc: 'mafia', stk: 'rose', rib: '#9e1b24',
    tape: 'repeating-linear-gradient(90deg, #2a2a30 0 3px, #4a4a52 3px 6px)', dk: 1 });
  S('red', { n: '大院 · 祥云|The Compound · Auspicious Clouds', d: ['#6b1a17', '#4f1210', '#852520'], p: ['#f7f0e0', '#fcf8ee', '#e9dcc0', '#f0e7d2', '#dac69a'], k: ['#2a1c14', '#625040', '#a69480'], e: '#6b1a17', a: '#b22a20', b: '#2c4a6b', g: '#3a6b3f', gold: '#d1a34a', t: ['#b22a20', '#d1a34a', '#2c4a6b', '#3a6b3f'], pat: 'red', sc: 'red', stk: 'plum', rib: '#b22a20',
    tape: 'repeating-linear-gradient(90deg, #b22a20 0 7px, #e9c46a 7px 9px)', dk: 1 });
  S('state', { n: '国之重器|Seat of Power', d: ['#1b2a4a', '#121e38', '#26385f'], p: ['#f6f4ef', '#fcfbf8', '#e4e0d6', '#ece9e1', '#cfc9ba'], k: ['#1b2233', '#535b6b', '#979dab'], e: '#1b2a4a', a: '#a3262a', b: '#2b4a8a', g: '#3f6b55', gold: '#c9a24a', t: ['#1b2a4a', '#a3262a', '#c9a24a', '#3f6b55'], pat: 'state', sc: 'state', stk: 'seal', rib: '#c9a24a',
    tape: 'repeating-linear-gradient(90deg, #1b2a4a 0 6px, #f3efe4 6px 12px)', dk: 1 });
  S('rural', { n: '黄土与麦田|Loess & Wheat', d: ['#b98a52', '#9b6f3f', '#d0a56a'], p: ['#efe2c4', '#f7eed8', '#dfca9c', '#e8d8b2', '#cdb07a'], k: ['#3a2a17', '#6e5634', '#a08660'], e: '#6b4a26', a: '#b8452d', b: '#4b7aa8', g: '#5f8233', gold: '#e0b44c', t: ['#b8452d', '#5f8233', '#d9a63a', '#4b7aa8'], pat: 'rural', sc: 'rural', stk: 'wheat', rib: '#5f8233',
    tape: 'repeating-linear-gradient(0deg, rgba(184, 69, 45, .5) 0 5px, transparent 5px 10px), repeating-linear-gradient(90deg, rgba(184, 69, 45, .5) 0 5px, #f6e7c6 5px 10px)', dk: 0 });
  S('city', { n: '城市晴空|City Skies', d: ['#a9cbee', '#8bb4e2', '#d2e6fa'], p: ['#ffffff', '#f6faff', '#e6eef8', '#eef4fc', '#cfdff2'], k: ['#22324a', '#5a6b85', '#9aa8bd'], e: '#3e6fa8', a: '#ef6b5b', b: '#3a7bd5', g: '#3f9d6a', gold: '#ffc94d', t: ['#ef6b5b', '#3a7bd5', '#f2b33d', '#3f9d6a'], pat: 'city', sc: 'city', stk: 'heart', rib: '#ef6b5b',
    tape: 'repeating-linear-gradient(45deg, #7fb4ee 0 5px, #dcecff 5px 10px)', dk: 0 });
  S('humble', { n: '老街烟火|Old Street', d: ['#8e9ba8', '#748290', '#aab5c0'], p: ['#f3f1ec', '#faf9f6', '#e1ddd2', '#e9e6de', '#cdc7b9'], k: ['#2a2d33', '#5a5e66', '#9a9ea6'], e: '#4b5560', a: '#d0663f', b: '#4b7aa8', g: '#5f8a5a', gold: '#e0b44c', t: ['#d0663f', '#4b7aa8', '#d9a63a', '#5f8a5a'], pat: 'humble', sc: 'humble', stk: 'plane', rib: '#d0663f',
    tape: 'linear-gradient(#ebe4d2, #ddd4bf)', dk: 0 });
  S('cover', { n: '人生手账|Life Journal', d: ['#2f4858', '#223543', '#3d5a6c'], p: ['#faf6ec', '#fffdf7', '#ece2cc', '#f1eadb', '#d9cba8'], k: ['#2a2a26', '#5e5a50', '#a19a8a'], e: '#2f4858', a: '#c9443a', b: '#2f6a8a', g: '#4f8a4a', gold: '#d8b45a', t: ['#c9443a', '#2f6a8a', '#d8a83a', '#4f8a4a'], pat: 'cover', sc: 'cover', stk: 'book', rib: '#c9443a',
    tape: 'repeating-linear-gradient(90deg, #c9443a 0 6px, #f3e9d2 6px 12px)', dk: 1 });
  var ROYAL = { gb: 1, jp: 1, es: 1, th: 1 };

  /* which journal fits this person right now */
  G.skinFor = function (o) {
    var org = o.origin, c = o.country, age = o.age || 0, cls = o.cls || 0, fl = o.flags || {};
    if (o.monarch || org === 'royal' && !fl.exRoyal && !fl.trafficked) return 'royal-' + (ROYAL[c] ? c : 'gb');
    if (o.state) return 'state';
    if (o.boss || org === 'mafia' && age < 18 && !fl.trafficked) return 'mafia';
    if (o.fame >= 75 || org === 'celebrity' && !fl.trafficked && age < 22) return 'star';
    if (org === 'noble' && !fl.trafficked && cls >= 2) return 'noble';
    if (org === 'red' && !fl.trafficked && cls >= 2) return c === 'cn' ? 'red' : 'state';
    if (cls >= 2) return 'tycoon';
    if ((org === 'rural' || org === 'leftbehind' || fl.trafficked) && (age < 18 || o.tier >= 4) || o.tier >= 5 && cls === 0) return 'rural';
    if (cls === 0 && (['worker', 'debt', 'orphan', 'single', 'immigrant'].indexOf(org) >= 0 && age < 18 || age >= 18 && o.poor)) return 'humble';
    return 'city';
  };
  G.skin = function () {
    var S = G.S; if (!S || !S.p) return 'cover';
    var p = S.p, cls = 0, nw = 0;
    try { cls = G.famClass(); nw = G.netWorth(); } catch (e) { }
    var top = false; try { top = !!(p.gov && G.gov && G.gov.isTop && G.gov.isTop()); } catch (e) { }
    return G.skinFor({ origin: p.origin, country: p.country, age: p.age, cls: cls, flags: p.flags, tier: p.tier, fame: p.st.fame,
      monarch: !!p.flags.monarch, state: top || !!(p.gov && p.gov.track === 'poli' && p.gov.rank >= 3) || !!(p.mil && p.mil.rank >= 8),
      boss: !!(p.gang && p.gang.rank >= 3), poor: nw < G.$(25000) && !(G.dependent && G.dependent()) });
  };
  G.skinData = function (id) { return SKN[id] || SKN.city; };
  G.skinScene = function (id) { var k = G.skinData(id); return SC[k.sc] || ''; };
  G.skinSticker = function (id) { return STK[G.skinData(id).stk] || ''; };

  /* paint the skin: palette (only in the identity theme) and decorations (always) */
  var PAL = ['--desk', '--desk2', '--desk3', '--paper', '--paper2', '--line', '--grid', '--grid2', '--ink', '--ink2', '--ink3', '--brown', '--red', '--blue', '--green', '--blue-soft', '--yellow', '--yellow-soft', '--gold', '--track', '--shadow', '--veil', '--deskink', '--deskink2', '--pillbg', '--deskshadow'];
  var cur = null;
  UI.applySkin = function (id, force) {
    var root = document.documentElement, k = G.skinData(id), theme = root.getAttribute('data-theme');
    if (!force && cur === id + '|' + theme) return;
    cur = id + '|' + theme;
    root.setAttribute('data-skin', k.id);
    var st = root.style;
    st.setProperty('--pat', uri(PAT[k.pat] || PAT.cover));
    st.setProperty('--tape', k.tape); st.setProperty('--ribbon', k.rib);
    st.setProperty('--sk-t1', k.t[0]); st.setProperty('--sk-t2', k.t[1]); st.setProperty('--sk-t3', k.t[2]); st.setProperty('--sk-t4', k.t[3]);
    st.setProperty('--sk-stamp', k.a); st.setProperty('--sk-gold', k.gold); st.setProperty('--sk-frame', k.e);
    if (theme === 'identity') {
      var v = { '--desk': k.d[0], '--desk2': k.d[1], '--desk3': k.d[2], '--paper': k.p[0], '--paper2': k.p[1], '--line': k.p[2], '--grid': k.p[3], '--grid2': k.p[4],
        '--ink': k.k[0], '--ink2': k.k[1], '--ink3': k.k[2], '--brown': k.e, '--red': k.a, '--blue': k.b, '--green': k.g, '--gold': k.gold,
        '--blue-soft': mix(k.p[1], k.b, .12), '--yellow': k.gold, '--yellow-soft': mix(k.p[1], k.gold, .25), '--track': mix(k.p[3], k.k[0], .08),
        '--shadow': '0 2px 0 ' + rgba(k.e, .12) + ', 0 10px 24px ' + rgba(k.e, .2), '--veil': rgba(mix(k.d[1], '#000000', .4), .55),
        '--deskink': k.dk ? '#fbf6ea' : mix(k.e, '#000000', .25), '--deskink2': k.dk ? 'rgba(251, 246, 234, .72)' : rgba(k.e, .75), '--pillbg': k.dk ? 'rgba(0, 0, 0, .26)' : 'rgba(255, 255, 255, .62)', '--deskshadow': k.dk ? 'rgba(0, 0, 0, .3)' : 'rgba(255, 255, 255, .55)' };
      for (var key in v) st.setProperty(key, v[key]);
      var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', k.d[1]);
    } else PAL.forEach(function (key) { st.removeProperty(key); });
  };
  UI.skinRefresh = function () { cur = null; UI.applySkin(G.skin()); };
})();
