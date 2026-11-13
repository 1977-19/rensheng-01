/* VIP: offline redeem codes (SHA-256 hashed), tiers & perks */
(function () {
  'use strict';
  /* compact SHA-256 */
  function sha256(ascii) {
    function rr(v, a) { return (v >>> a) | (v << (32 - a)); }
    var mp = Math.pow, mw = mp(2, 32), res = '', words = [], blen = ascii.length * 8, i, j;
    var hash = sha256.h = sha256.h || [], k = sha256.k = sha256.k || [], pl = k.length, ic = {};
    for (var c = 2; pl < 64; c++) { if (!ic[c]) { for (i = 0; i < 313; i += c) ic[i] = c; hash[pl] = (mp(c, .5) * mw) | 0; k[pl++] = (mp(c, 1 / 3) * mw) | 0; } }
    hash = hash.slice(0, 8);
    ascii += '\x80'; while (ascii.length % 64 - 56) ascii += '\x00';
    for (i = 0; i < ascii.length; i++) { j = ascii.charCodeAt(i); if (j >> 8) return; words[i >> 2] |= j << ((3 - i) % 4) * 8; }
    words[words.length] = ((blen / mw) | 0); words[words.length] = (blen);
    for (j = 0; j < words.length;) {
      var w = words.slice(j, j += 16), oh = hash; hash = hash.slice(0, 8);
      for (i = 0; i < 64; i++) {
        var w15 = w[i - 15], w2 = w[i - 2], a = hash[0], e = hash[4];
        var t1 = hash[7] + (rr(e, 6) ^ rr(e, 11) ^ rr(e, 25)) + ((e & hash[5]) ^ ((~e) & hash[6])) + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + (rr(w15, 7) ^ rr(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rr(w2, 17) ^ rr(w2, 19) ^ (w2 >>> 10))) | 0);
        var t2 = (rr(a, 2) ^ rr(a, 13) ^ rr(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
        hash = [(t1 + t2) | 0].concat(hash); hash[4] = (hash[4] + t1) | 0;
      }
      for (i = 0; i < 8; i++) hash[i] = (hash[i] + oh[i]) | 0;
    }
    for (i = 0; i < 8; i++) for (j = 3; j + 1; j--) { var b = (hash[i] >> (j * 8)) & 255; res += ((b < 16) ? 0 : '') + b.toString(16); }
    return res;
  }
  G.sha256 = sha256;
  var SALT = 'mylife-2026|';
  var V = G.vip = {};
  V.state = function () { return G.store.get('vip') || { t: 0, used: [] }; };
  // memberships are gone: everyone gets everything
  V.tier = function () { return 3; };
  V.norm = function (code) { return String(code || '').toUpperCase().replace(/[^A-Z0-9]/g, ''); };
  V.redeem = function (code) {
    var n = V.norm(code); if (n.length < 8) return { ok: false, msg: '兑换码格式不对|Invalid code format' };
    var h = sha256(SALT + n), st = V.state(), H = G.VIP_HASH || {};
    if (st.used.indexOf(h) >= 0) return { ok: false, msg: '这个兑换码已经用过了|This code has already been used' };
    var t = 0; for (var k = 1; k <= 3; k++) if ((H[k] || []).indexOf(h) >= 0) t = k;
    if (!t) return { ok: false, msg: '兑换码无效|Invalid code' };
    st.used.push(h); st.t = Math.max(st.t || 0, t); G.store.set('vip', st);
    if (G.S) G.S.p.vip = st.t;
    return { ok: true, t: st.t, got: t };
  };
  V.NAMES = [null, '白银VIP|Silver VIP', '黄金VIP|Gold VIP', '钻石VIP|Diamond VIP'];
  V.PERKS = [
    { t: 1, n: '解锁隐藏出身：富豪之家、院士世家|Hidden origins: Tycoon Family, Family of Academicians' },
    { t: 1, n: '体力上限 +30%|Max energy +30%' },
    { t: 1, n: '时光倒流：每局 1 次（含死后复活）|Time rewind: once per life (even after death)' },
    { t: 1, n: '天赋重抽 3 次|Reroll talents 3 times' },
    { t: 1, n: '富豪追求者、高端俱乐部|Wealthy admirers & the elite club' },
    { t: 2, n: '解锁隐藏出身：明星世家、冠军世家、黑道世家|Hidden origins: Celebrity, Champions, Crime Family' },
    { t: 2, n: '体力上限 +60%|Max energy +60%' },
    { t: 2, n: '时光倒流：每局 3 次|Time rewind: 3 times per life' },
    { t: 2, n: '天赋：从 8 个里自选 3 个|Talents: pick 3 out of 8' },
    { t: 2, n: '明星伴侣池|Celebrity dating pool' },
    { t: 2, n: '属性透视：看到他人的真心|Insight: see others\' sincerity' },
    { t: 3, n: '解锁隐藏出身：王室/名门、首富之家|Hidden origins: Royalty/Aristocracy, Richest Family' },
    { t: 3, n: '体力上限翻倍|Max energy doubled' },
    { t: 3, n: '时光倒流：无限次|Unlimited time rewinds' },
    { t: 3, n: '天赋：全部任选 3 个|Talents: choose any 3' },
    { t: 3, n: '开局额外 30 点属性自由分配|30 bonus stat points at birth' },
    { t: 3, n: '王室伴侣池|Royal dating pool' },
    { t: 3, n: '全透视：真心、忠诚、心动概率|Full insight: sincerity, loyalty, attraction odds' },
    { t: 3, n: '志愿录取概率精确显示|Exact university admission odds' },
    { t: 3, n: '存档位 3 → 6|Save slots 3 → 6' }
  ];
  V.seeSincere = function () { return V.tier() >= 2 || G.has('mind'); };
  V.seeAll = function () { return V.tier() >= 3 || G.has('mind'); };
})();
