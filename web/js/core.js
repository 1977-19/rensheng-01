/* My Life — core: namespace, RNG, i18n, money, storage, native bridge */
var G = (typeof window !== 'undefined' ? (window.G = window.G || {}) : (global.G = global.G || {}));
(function () {
  'use strict';
  G.VERSION = '2.0.0';
  G.S = null;           // current life state

  /* ---------------- RNG (seeded per life, stored in state) ---------------- */
  G.R = function () {
    var S = G.S;
    if (!S) return Math.random();
    var t = (S.rs = (S.rs + 0x6D2B79F5) | 0);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  G.ri = function (a, b) { return a + Math.floor(G.R() * (b - a + 1)); };
  G.rf = function (a, b) { return a + G.R() * (b - a); };
  G.ch = function (p) { return G.R() < p; };
  G.pick = function (a) { return a && a.length ? a[Math.floor(G.R() * a.length)] : undefined; };
  G.wpick = function (a, wf) {
    var tot = 0, ws = [], i;
    for (i = 0; i < a.length; i++) { var w = Math.max(0, wf ? wf(a[i]) : (a[i].w || 1)) || 0; ws.push(w); tot += w; }
    if (tot <= 0) return undefined;
    var r = G.R() * tot;
    for (i = 0; i < a.length; i++) { r -= ws[i]; if (r < 0) return a[i]; }
    return a[a.length - 1];
  };
  G.shuffle = function (a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(G.R() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  G.sample = function (a, n) { return G.shuffle(a).slice(0, n); };
  G.clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  G.gauss = function () { var u = 1 - G.R(), v = G.R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  G.nrm = function (m, sd) { return m + G.gauss() * sd; };
  G.uid = function () { return (Date.now().toString(36) + Math.floor(Math.random() * 1e9).toString(36)).slice(-10); };
  G.poisson = function (l) { var L = Math.exp(-l), k = 0, p = 1; do { k++; p *= G.R(); } while (p > L && k < 50); return k - 1; };
  G.sum = function (a, f) { var s = 0; for (var i = 0; i < a.length; i++) s += f ? f(a[i]) : a[i]; return s; };
  G.hash = function (str) { var h = 2166136261; for (var i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  G.deep = function (o) { return JSON.parse(JSON.stringify(o)); };

  /* ---------------- i18n ----------------
     Text format: "中文|English". Traditional Chinese derived from 中文 via OpenCC tables. */
  G.lang = 'zh';
  function part(s, li) {
    var i = s.indexOf('|');
    if (i < 0) return s;
    return li ? s.slice(i + 1) : s.slice(0, i);
  }
  function fmtVal(v, li) {
    if (v == null) return '';
    if (typeof v === 'number') return li ? G.numEn(v) : G.numZh(v);
    if (typeof v === 'string') return part(v, li);
    if (typeof v === 'object' && 'm' in v) return G.fmL(v.m, v.c, li);
    if (typeof v === 'function') return fmtVal(v(), li);
    return String(v);
  }
  function sub(str, prm, li) {
    var out = str.replace(/\{(\w+)\}/g, function (m, k) { return prm[k] === undefined ? m : fmtVal(prm[k], li); });
    // English article agreement for substituted nouns: "a Agent" -> "an Agent"
    return li === 1 && out !== str ? out.replace(/(^|\s)a (?=(?:[AEIaei]|[Oo](?!ne)|[Uu](?!ni|s[aeu]|ro|k))\w)/g, '$1an ') : out;
  }
  G.numZh = function (n) { return Math.abs(n) >= 1e4 && Math.round(n) === n ? G.bigZh(n) : String(Math.round(n * 100) / 100); };
  G.numEn = function (n) { return Math.round(n) === n ? (Math.abs(n) >= 10000 ? n.toLocaleString('en-US') : String(n)) : String(Math.round(n * 100) / 100); };
  G.bigZh = function (n) {
    var a = Math.abs(n), s = n < 0 ? '-' : '';
    if (a >= 1e12) return s + trim(a / 1e12, 2) + '万亿';
    if (a >= 1e8) return s + trim(a / 1e8, 2) + '亿';
    if (a >= 1e4) return s + trim(a / 1e4, a >= 1e6 ? 0 : 1) + '万';
    return s + Math.round(a);
  };
  function trim(x, d) { return x.toFixed(d).replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1'); }
  /* render for current language */
  G.T = function (s, prm) {
    if (s == null) return '';
    if (typeof s === 'function') s = s(prm);
    if (s == null) return '';
    if (typeof s === 'number') s = String(s);
    var li = G.lang === 'en' ? 1 : 0;
    var out = part(String(s), li);
    if (prm) out = sub(out, prm, li);
    if (G.lang === 'tw') out = G.toTW(out);
    return out;
  };
  /* render into a language-neutral "zh|en" string (for logs / storage) */
  G.L = function (s, prm) {
    if (s == null) return '';
    if (typeof s === 'function') s = s(prm);
    s = String(s);
    var zh = part(s, 0), en = part(s, 1);
    if (prm) { zh = sub(zh, prm, 0); en = sub(en, prm, 1); }
    // planned-economy China had no "bosses", only work-unit leaders
    if (G.S && G.S.p && G.S.p.country === 'cn' && G.S.year < 1980 && zh.indexOf('老板') >= 0) zh = zh.replace(/老板/g, '领导');
    return zh + '|' + en;
  };
  G.join = function (arr, sepZh, sepEn) { // join neutral strings
    var z = [], e = [];
    arr.forEach(function (s) { z.push(part(s, 0)); e.push(part(s, 1)); });
    return z.join(sepZh == null ? '，' : sepZh) + '|' + e.join(sepEn == null ? ', ' : sepEn);
  };
  // pronouns
  G.pr = function (g) {
    return g === 'f' ? { he: '她|she', He: '她|She', him: '她|her', his: '她的|her', His: '她的|Her', ta: '她|she' }
      : { he: '他|he', He: '他|He', him: '他|him', his: '他的|his', His: '他的|His', ta: '他|he' };
  };

  /* Traditional conversion (tables injected by s2t.js) */
  var twCache = {};
  G.toTW = function (str) {
    if (!str || !G.S2T) return str;
    if (twCache[str]) return twCache[str];
    var P = G.S2T.p, C = G.S2T.c, max = G.S2T.max || 4, out = '', i = 0, n = str.length;
    while (i < n) {
      var hit = false;
      for (var L = Math.min(max, n - i); L >= 2; L--) {
        var seg = str.substr(i, L);
        if (P[seg]) { out += P[seg]; i += L; hit = true; break; }
      }
      if (!hit) { var ch = str[i]; out += C[ch] || ch; i++; }
    }
    out = out.replace(/“/g, '「').replace(/”/g, '」').replace(/‘/g, '『').replace(/’/g, '』');
    if (str.length < 200) twCache[str] = out;
    return out;
  };
  G.setLang = function (l) { G.lang = l; twCache = {}; if (typeof document !== 'undefined' && document.documentElement) document.documentElement.setAttribute('lang', l === 'en' ? 'en' : l === 'tw' ? 'zh-Hant' : 'zh-Hans'); };
  G.detectLang = function () {
    var n = (typeof navigator !== 'undefined' && (navigator.language || '')) || '';
    n = n.toLowerCase();
    if (n.indexOf('zh') === 0) return /tw|hk|mo|hant/.test(n) ? 'tw' : 'zh';
    return n ? 'en' : 'zh';
  };

  /* ---------------- money ---------------- */
  G.cty = function (cid) { return G.C[cid || (G.S && G.S.p.country) || 'cn']; };
  G.eraIdx = function (cid, y) {
    var c = G.C[cid], a = c.idx, g = c.g || 0.025;
    if (y >= a[a.length - 1][0]) { var last = a[a.length - 1]; return last[1] * Math.pow(1 + g, y - last[0]); }
    if (y <= a[0][0]) return a[0][1] * Math.pow(1.04, y - a[0][0]);
    for (var i = 0; i < a.length - 1; i++) {
      if (y >= a[i][0] && y <= a[i + 1][0]) {
        var t = (y - a[i][0]) / (a[i + 1][0] - a[i][0]);
        return Math.exp(Math.log(a[i][1]) * (1 - t) + Math.log(a[i + 1][1]) * t);
      }
    }
    return 1;
  };
  var TIER_P = [1, 1.6, 1.25, 1, 0.78, 0.6], TIER_W = [1, 1.45, 1.18, 1, 0.82, 0.62];
  G.tierP = function (t) { return TIER_P[t || 3]; };
  G.tierW = function (t) { return TIER_W[t || 3]; };
  /* price in local currency for something costing `usd` in USA 2024 */
  G.$ = function (usd, cid, y, tier) {
    var S = G.S; cid = cid || (S ? S.p.country : 'us'); y = y || (S ? S.year : 2024);
    var c = G.C[cid]; tier = tier || (S && S.p.country === cid ? S.p.tier : 3);
    return nice(usd * c.fx * c.pl * G.eraIdx(cid, y) * TIER_P[tier]);
  };
  /* wage in local currency for a job paying `usd` in USA 2024 */
  G.$w = function (usd, cid, y, tier) {
    var S = G.S; cid = cid || (S ? S.p.country : 'us'); y = y || (S ? S.year : 2024);
    var c = G.C[cid]; tier = tier || (S && S.p.country === cid ? S.p.tier : 3);
    return nice(usd * c.fx * c.wg * G.eraIdx(cid, y) * TIER_W[tier]);
  };
  /* raw (non-rounded) conversion factor local per USD-2024 */
  G.$f = function (cid, y) { var c = G.C[cid]; return c.fx * c.pl * G.eraIdx(cid, y); };
  function nice(x) {
    if (!isFinite(x)) return 0;
    var a = Math.abs(x); if (a < 10) return Math.round(x * 10) / 10;
    var p = Math.pow(10, Math.floor(Math.log10(a)) - 2);
    return Math.round(x / p) * p;
  }
  G.nice = nice;
  G.M = function (n, cid) { return { m: n, c: cid || (G.S ? G.S.p.country : 'cn') }; };
  G.fmL = function (n, cid, li) {
    var c = G.C[cid || (G.S ? G.S.p.country : 'cn')] || G.C.cn;
    n = Math.round(n);
    if (li) {
      var a = Math.abs(n), s = n < 0 ? '-' : '', v;
      if (a >= 1e12) v = trim(a / 1e12, 2) + 'T';
      else if (a >= 1e9) v = trim(a / 1e9, 2) + 'B';
      else if (a >= 1e6) v = trim(a / 1e6, 2) + 'M';
      else if (a >= 1e4) v = trim(a / 1e3, 1) + 'K';
      else v = a.toLocaleString('en-US');
      return s + c.cur.sym + v;
    }
    if (c.id === 'cn') return (n < 0 ? '-¥' : '¥') + G.bigZh(Math.abs(n));
    return G.bigZh(n) + part(c.cur.n, 0);
  };
  G.fm = function (n, cid) { var s = G.fmL(n, cid, G.lang === 'en' ? 1 : 0); return G.lang === 'tw' ? G.toTW(s) : s; };

  /* ---------------- tiny event bus ---------------- */
  var bus = {};
  G.on = function (k, f) { (bus[k] = bus[k] || []).push(f); };
  G.emit = function (k, a) { (bus[k] || []).forEach(function (f) { try { f(a); } catch (e) { console.error(e); } }); };

  /* ---------------- native bridge ---------------- */
  var mh = function (n) { try { return window.webkit.messageHandlers[n]; } catch (e) { return null; } };
  var aiCalls = {}, aiSeq = 0;
  G.native = {
    has: function () { return typeof window !== 'undefined' && !!mh('store'); },
    post: function (n, msg) { var h = mh(n); if (h) { try { h.postMessage(msg); return true; } catch (e) { } } return false; },
    haptic: function (k) {
      if (G.settings && G.settings.haptic === false) return;
      if (!G.native.post('haptic', k || 'light')) { try { navigator.vibrate && navigator.vibrate(k === 'heavy' ? 40 : 15); } catch (e) { } }
    },
    /* req: {url, key, body}  -> Promise<string json> ; native avoids CORS */
    http: function (req) {
      return new Promise(function (res, rej) {
        if (mh('http')) {
          var id = ++aiSeq; aiCalls[id] = { res: res, rej: rej };
          G.native.post('http', { id: id, url: req.url, headers: req.headers || {}, body: req.body });
          setTimeout(function () { if (aiCalls[id]) { aiCalls[id].rej(new Error('timeout')); delete aiCalls[id]; } }, 60000);
        } else {
          fetch(req.url, { method: 'POST', headers: req.headers || {}, body: req.body }).then(function (r) { return r.text().then(function (t) { if (!r.ok) throw new Error('HTTP ' + r.status + ' ' + t.slice(0, 200)); return t; }); }).then(res, rej);
        }
      });
    },
    httpCallback: function (id, ok, text) {
      var c = aiCalls[id]; if (!c) return; delete aiCalls[id];
      ok ? c.res(text) : c.rej(new Error(text || 'error'));
    }
  };

  /* ---------------- storage (localStorage + native mirror) ---------------- */
  var NS = 'mylife.';
  G.store = {
    get: function (k) {
      var v = null;
      try { v = localStorage.getItem(NS + k); } catch (e) { }
      if (v == null && typeof window !== 'undefined' && window.__NATIVE_STORE && window.__NATIVE_STORE[k] != null) v = window.__NATIVE_STORE[k];
      if (v == null) return null;
      try { return JSON.parse(v); } catch (e) { return null; }
    },
    set: function (k, val) {
      var s = JSON.stringify(val);
      try { localStorage.setItem(NS + k, s); } catch (e) { }
      if (typeof window !== 'undefined') { window.__NATIVE_STORE = window.__NATIVE_STORE || {}; window.__NATIVE_STORE[k] = s; }
      G.native.post('store', { k: k, v: s });
    },
    del: function (k) {
      try { localStorage.removeItem(NS + k); } catch (e) { }
      if (typeof window !== 'undefined' && window.__NATIVE_STORE) delete window.__NATIVE_STORE[k];
      G.native.post('store', { k: k, v: null });
    }
  };

  /* ---------------- settings & meta ---------------- */
  G.settings = { lang: null, theme: 'auto', music: true, sfx: true, haptic: true, autoGame: false, speed: 1,
    ai: { on: false, provider: 'deepseek', url: '', key: '', model: '' } };
  G.loadSettings = function () {
    var s = G.store.get('settings'); if (s) { for (var k in s) G.settings[k] = s[k]; }
    G._setLoaded = 1;
    G.setLang(G.settings.lang || G.detectLang());
  };
  // never write settings before they were read back, or a script that runs at load would wipe the player's choices
  G.saveSettings = function () { if (!G._setLoaded) return; G.store.set('settings', G.settings); };
  G.meta = { ach: {}, lives: [], stats: {} };
  G.loadMeta = function () { var m = G.store.get('meta'); if (m) G.meta = m; G.meta.ach = G.meta.ach || {}; G.meta.lives = G.meta.lives || []; G.meta.stats = G.meta.stats || {}; };
  G.saveMeta = function () { G.store.set('meta', G.meta); };
})();
