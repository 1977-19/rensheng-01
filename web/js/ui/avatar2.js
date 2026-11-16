/* Portrait avatars drawn with DiceBear styles: "动漫" (Adventurer, the default since 1.9 — girls often wear flower wreaths) and "写实" (Avataaars).
   The old sticker faces stay available as "经典". Same inputs as before: seed, age, gender, skin tone, culture, mood. */
(function () {
  'use strict';
  var classic = G.avatar, D = window.DiceBear, ST = window.AV_STYLES;
  if (!D || !ST) return;
  var styles = {}, cache = new Map();
  function style(n) { return styles[n] || (styles[n] = new D.Style(ST[n])); }
  function rng(seed) { var s = (seed >>> 0) || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
  function pick(r, a) { return a[Math.floor(r() * a.length)]; }
  var BG = ['fbf3e3', 'f3efe6', 'fdeee6', 'eef4ea', 'efedf7', 'fbefef', 'ecf3f6', 'f6f1e1'];
  // six skin tones, light to deep
  var SKIN_A = ['ffdbb4', 'f6cfa6', 'edb98a', 'd08b5b', 'ae5d29', '614335'];
  var SKIN_B = ['f8dcc2', 'f2d3b1', 'ecad80', 'c98b5e', '9e5622', '763900'];
  var DARK = ['2c1b18', '3b2a21', '24191a', '4a312c'], LIGHT = ['b58143', 'd6b370', 'a55728', '724133', 'c93305', 'cfa361'];
  function hairCol(r, si, age, cul) {
    if (age >= 75) return 'eceae6'; if (age >= 62) return 'b9b5b0'; if (age >= 52 && r() < .45) return '8d877f';
    var east = ['cn', 'jp', 'kr', 'sg', 'th', 'in'].indexOf(cul) >= 0;
    return east || si >= 3 ? pick(r, DARK) : pick(r, DARK.concat(LIGHT, LIGHT));
  }
  function svg(styleName, opts) {
    var key = styleName + JSON.stringify(opts), v = cache.get(key);
    if (v) return v;
    v = String(new D.Avatar(style(styleName), opts));
    if (cache.size > 600) cache.clear();
    cache.set(key, v); return v;
  }
  function realistic(o, r, age, g, si, mood) {
    var kid = age < 13, old = age >= 60, f = g === 'f';
    var tops = f ? (old ? ['bun', 'bob', 'curly', 'curvy'] : kid ? ['bob', 'straight01', 'straight02', 'curly', 'bun', 'longButNotTooLong'] : ['bigHair', 'bob', 'bun', 'curly', 'curvy', 'longButNotTooLong', 'miaWallace', 'straight01', 'straight02', 'straightAndStrand'])
      : (old ? ['sides', 'shortFlat', 'theCaesar', 'shortWaved'] : kid ? ['shortFlat', 'shortRound', 'shortWaved', 'shortCurly', 'theCaesar'] : ['shortFlat', 'shortRound', 'shortWaved', 'theCaesar', 'theCaesarAndSidePart', 'shortCurly', 'shaggy', 'shavedSides', 'sides']);
    if (si >= 4 && r() < .4) tops = f ? ['fro', 'froBand', 'curly', 'bigHair'] : ['fro', 'shortCurly', 'frizzle', 'dreads01'];
    var top = pick(r, tops);
    var clothes = kid ? pick(r, ['hoodie', 'graphicShirt', 'overall', 'shirtCrewNeck'])
      : (o.rich || r() < .25) && age >= 22 ? pick(r, ['blazerAndShirt', 'blazerAndSweater', 'collarAndSweater'])
      : pick(r, f ? ['shirtScoopNeck', 'shirtVNeck', 'collarAndSweater', 'hoodie', 'shirtCrewNeck'] : ['shirtCrewNeck', 'shirtVNeck', 'collarAndSweater', 'hoodie', 'graphicShirt']);
    var happy = mood >= 55, sad = mood < 30;
    var opts = {
      seed: 'p' + (o.seed || 7), idRandomization: true,
      skinColor: [SKIN_A[si]], hairColor: [hairCol(r, si, age, o.cul)], facialHairColor: [hairCol(r, si, age, o.cul)],
      topVariant: [top], topProbability: 100, hatColor: [pick(r, ['3c4f5c', '65c9ff', 'ff5c5c', 'ffafb9', 'b1e2ff'])],
      clothesVariant: [clothes], clothesColor: [pick(r, ['3c4f5c', '65c9ff', '262e33', '5199e4', '25557c', 'a7ffc4', 'ffafb9', 'ffdeb5', 'ff488e', 'e6e6e6', '929598'])],
      clothesGraphicVariant: [pick(r, ['bear', 'deer', 'diamond', 'pizza'])],
      eyesVariant: [o.dead ? 'closed' : happy ? pick(r, ['happy', 'default', 'default', 'wink', 'squint']) : sad ? pick(r, ['side', 'default']) : pick(r, ['default', 'default', 'side', 'squint'])],
      eyebrowsVariant: [sad ? pick(r, ['sadConcernedNatural', 'flatNatural']) : pick(r, ['default', 'defaultNatural', 'raisedExcitedNatural', 'flatNatural', 'upDownNatural'])],
      mouthVariant: [o.dead ? 'serious' : happy ? pick(r, ['smile', 'smile', 'twinkle', 'default']) : sad ? pick(r, ['concerned', 'sad', 'serious']) : pick(r, ['default', 'serious', 'smile'])],
      facialHairProbability: !f && age >= 25 && r() < (old ? .35 : .22) ? 100 : 0, facialHairVariant: [pick(r, ['beardLight', 'beardMedium', 'moustacheFancy'])],
      accessoriesProbability: (o.glasses || (age >= 8 && r() < .14) || (old && r() < .4)) ? 100 : 0, accessoriesVariant: [pick(r, ['prescription01', 'prescription02', 'round'])], accessoriesColor: ['262e33'],
      backgroundColor: [pick(r, BG)]
    };
    return svg('avataaars', opts);
  }
  // curated for a sweeter look: gentle eyes and brows, real smiles, and flower wreaths for many of the girls
  var EYES = [1, 2, 3, 12, 19, 24, 25, 26], SMILE = [1, 8, 23, 25, 27, 28, 30], SAD = [2, 4, 9, 29], BROWS = [6, 8, 9, 10, 11, 12, 13, 14, 15], FLOWER = [3, 8, 18];
  function anime(o, r, age, g, si, mood) {
    var f = g === 'f', n = function (k) { return (k < 10 ? '0' : '') + k; };
    var wreath = f && age >= 3 && age <= 45 && (o.wreath || r() < .38);
    var hair = f ? 'long' + n(wreath ? pick(r, FLOWER) : 1 + Math.floor(r() * 26)) : 'short' + n(1 + Math.floor(r() * 19));
    var happy = mood >= 45;
    var opts = {
      seed: 'a' + (o.seed || 7), idRandomization: true,
      skinColor: [SKIN_B[si]], hairColor: [hairCol(r, si, age, o.cul)], hairVariant: [hair], hairProbability: age < 2 ? 0 : 100,
      eyesVariant: ['variant' + n(pick(r, EYES))], eyebrowsVariant: ['variant' + n(pick(r, BROWS))],
      mouthVariant: ['variant' + n(happy ? pick(r, SMILE) : pick(r, SAD))],
      glassesProbability: (o.glasses || (age >= 8 && r() < .12) || (age >= 60 && r() < .4)) ? 100 : 0,
      earringsProbability: f && age >= 14 && r() < .45 ? 100 : 0,
      detailsProbability: age < 10 ? 100 : (!f && age >= 40 && r() < .25 ? 100 : (r() < .3 ? 100 : 0)),
      detailsVariant: [age < 10 ? 'blush' : !f && age >= 40 ? 'mustache' : pick(r, ['blush', 'freckles', 'birthmark'])],
      backgroundColor: [pick(r, BG)]
    };
    return svg('adventurer', opts);
  }
  G.avatarStyle = function () { var s = G.settings && G.settings.avStyle; return s === 'real' || s === 'classic' ? s : 'anime'; };
  G.avatar = function (o) {
    o = o || {};
    var st = o.style || G.avatarStyle();
    if (st === 'classic') return classic.apply(this, arguments);
    var age = o.age || 0, g = o.g || 'm', si = o.skin != null ? Math.max(0, Math.min(5, Math.round(o.skin))) : 1;
    var r = rng((o.seed || 7) * 7 + (g === 'f' ? 3 : 1)), mood = o.happy == null ? 60 : o.happy;
    var out;
    try { out = (st === 'anime' || age < 4) ? anime(o, r, age, g, si, mood) : realistic(o, r, age, g, si, mood); }
    catch (e) { return classic.apply(this, arguments); }
    if (o.dead) out = out.replace('<svg ', '<svg style="filter:grayscale(1);opacity:.75" ');
    return out;
  };
})();
