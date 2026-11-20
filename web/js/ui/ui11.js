/* Version 3.3 interface: the end-of-life page, extended (data from events/ending33.js). */
(function () {
  'use strict';
  var h = G.h, UI = G.UI, T = UI.T;
  if (!h || !UI) return;
  function card(cls, title, kids) { return h('div', { class: 'card v3e ' + cls }, h('h5', null, T(title)), kids); }
  function curve(yh) {
    if (!yh || yh.length < 4) return null;
    var W = 320, Hh = 120, P = 8, a0 = yh[0].a, a1 = yh[yh.length - 1].a || a0 + 1;
    var nws = yh.map(function (x) { return x.nw; }), mn = Math.min.apply(null, nws), mx = Math.max.apply(null, nws); if (mx === mn) mx = mn + 1;
    function X(a) { return P + (a - a0) / Math.max(1, a1 - a0) * (W - 2 * P); }
    var pw = yh.map(function (x) { return X(x.a).toFixed(1) + ',' + (Hh - P - (x.nw - mn) / (mx - mn) * (Hh - 2 * P)).toFixed(1); }).join(' ');
    var ph = yh.map(function (x) { return X(x.a).toFixed(1) + ',' + (Hh - P - x.hp / 100 * (Hh - 2 * P)).toFixed(1); }).join(' ');
    var ticks = '', step = Math.max(10, Math.round((a1 - a0) / 5 / 10) * 10);
    for (var a = Math.ceil(a0 / step) * step; a <= a1; a += step) ticks += '<text x="' + X(a).toFixed(1) + '" y="' + (Hh + 12) + '" font-size="9" text-anchor="middle" fill="currentColor" opacity=".55">' + a + '</text>';
    var svg = '<svg viewBox="0 0 ' + W + ' ' + (Hh + 16) + '" width="100%" style="display:block"><rect x="0" y="0" width="' + W + '" height="' + Hh + '" rx="10" fill="rgba(0,0,0,.03)"/>' +
      '<polyline points="' + ph + '" fill="none" stroke="#e5644c" stroke-width="2" stroke-linejoin="round" opacity=".85"/>' +
      '<polyline points="' + pw + '" fill="none" stroke="#2f6fb0" stroke-width="2.4" stroke-linejoin="round"/>' + ticks + '</svg>';
    return h('div', null, h('div', { class: 'crv', html: svg }), h('div', { class: 'lgd' }, h('span', { class: 'k1' }, '— ' + T('身家|Wealth')), h('span', { class: 'k2' }, '— ' + T('快乐|Happiness')), h('span', null, T('横轴：年龄|x: age'))));
  }
  var end0 = UI.ending;
  UI.ending = function (d) {
    var r = end0.apply(this, arguments);
    try {
      var v = d && d.v3, rep = document.querySelector('.report');
      if (!v || !rep || document.querySelector('.v3end')) return r;
      var box = h('div', { class: 'v3end' });
      // the photo album
      if (v.album && v.album.length && v.album[0].svg) box.appendChild(card('alb', '人生相册|Photo Album', h('div', { class: 'album' }, v.album.map(function (x, i) {
        return h('div', { class: 'apol', style: { transform: 'rotate(' + ((i % 2 ? 1 : -1) * (2 + (i % 3))) + 'deg)' } }, h('div', { class: 'aph', html: x.svg }), h('div', { class: 'acap' }, T('{a}岁|Age {a}', { a: x.a })));
      }))));
      // keywords
      if (v.kw && v.kw.length) box.appendChild(card('kw', '一生三个词|Your Life in Three Words', h('div', { class: 'kws' }, v.kw.map(function (k) { return h('span', { class: 'kwd' }, T(k)); }))));
      // highlights
      if (v.hl && v.hl.length) box.appendChild(card('hl', '高光与转折|Big Moments', h('div', { class: 'hls' }, v.hl.map(function (x) {
        return h('div', { class: 'hlx' }, h('div', { class: 'hi' }, x.i), h('div', null, h('b', null, T(x.k) + ' · ' + T('{a}岁|age {a}', { a: x.a })), h('span', null, T(x.t))));
      }))));
      // voices
      if (v.voices && v.voices.length) box.appendChild(card('vo', '别人眼中的你|In Their Words', h('div', { class: 'vos' }, v.voices.map(function (x) {
        var av = G.avatar ? G.avatar({ seed: x.av, age: x.age, g: x.g, looks: x.looks, skin: x.skin, happy: 60, cul: x.c }) : '';
        return h('div', { class: 'vox' }, h('div', { class: 'va', html: av }), h('div', null, h('div', { class: 'vq' }, '“' + T(x.t) + '”'), h('small', null, '— ' + T(x.name) + ' · ' + T(x.r))));
      }))));
      // curve + records
      var cv = curve(v.yh);
      if (cv || (v.rec && v.rec.length)) box.appendChild(card('cur', '人生曲线|Your Life, Charted', h('div', null, cv, v.rec && v.rec.length ? h('div', { class: 'recs' }, v.rec.map(function (x) { return h('div', { class: 'rec' }, h('span', null, x.i + ' ' + T(x.t)), h('b', null, x.s)); })) : null)));
      // numbers
      if (v.num && v.num.length) box.appendChild(card('num', '这一生的数字|Life in Numbers', h('div', { class: 'nums' }, v.num.map(function (x) { return h('div', { class: 'nm' }, h('b', null, x.i + ' ' + x.v), h('span', null, T(x.t))); }))));
      // regrets
      if (v.reg && v.reg.length) box.appendChild(card('reg', '如果重来一次|If You Lived It Again', h('ul', { class: 'regs' }, v.reg.map(function (x) { return h('li', null, T(x)); }))));
      var ov = document.querySelector('.ovcard'), anchor = ov || rep;
      anchor.parentNode.insertBefore(box, anchor.nextSibling);
    } catch (e) { console.error(e); }
    return r;
  };
})();
