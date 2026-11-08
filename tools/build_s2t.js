// Builds web/js/s2t.js from OpenCC tables, keeping only characters/phrases used by the game's text
const fs = require('fs'), path = require('path');
const FILES = require('./files.js');
const ROOT = path.join(__dirname, '..', 'web');
const OC = process.argv[2];
let text = '';
FILES.engine.concat(FILES.ui).forEach(f => { if (f.includes('s2t')) return; const p = path.join(ROOT, f); if (fs.existsSync(p)) text += fs.readFileSync(p, 'utf8'); });
const chars = {}, P = {};
fs.readFileSync(path.join(OC, 'STCharacters.txt'), 'utf8').split('\n').forEach(l => { const [a, b] = l.split('\t'); if (a && b && text.includes(a)) { const t = b.split(' ')[0]; if (t !== a) chars[a] = t; } });
let max = 2;
fs.readFileSync(path.join(OC, 'STPhrases.txt'), 'utf8').split('\n').forEach(l => { const [a, b] = l.split('\t'); if (a && b && a.length >= 2 && text.includes(a)) { P[a] = b.split(' ')[0]; max = Math.max(max, a.length); } });
// Taiwan-standard glyph variants (OpenCC TWVariants: 着→著, 裏→裡, 爲→為 …) applied on top of s2t
const TW = {};
fs.readFileSync(path.join(OC, 'TWVariants.txt'), 'utf8').split('\n').forEach(l => { const [a, b] = l.split('\t'); if (a && b) TW[a] = b.split(' ')[0]; });
const tw = str => Array.from(str).map(ch => TW[ch] || ch).join('');
for (const a in chars) chars[a] = tw(chars[a]);
for (const k in TW) if (text.includes(k) && !chars[k]) chars[k] = TW[k];
for (const a in P) P[a] = tw(P[a]);
for (const a in chars) if (chars[a] === a) delete chars[a];
// build char map as string pairs for compactness
let cs = ''; for (const k in chars) cs += k + chars[k];
const js = '/* Simplified→Traditional tables derived from OpenCC (Apache-2.0), filtered to the game\'s text */\n(function(){var s=' + JSON.stringify(cs) + ',c={};for(var i=0;i<s.length;i+=2)c[s[i]]=s[i+1];G.S2T={c:c,p:' + JSON.stringify(P) + ',max:' + max + '};})();\n';
fs.writeFileSync(path.join(ROOT, 'js/s2t.js'), js);
console.log('s2t chars', Object.keys(chars).length, 'phrases', Object.keys(P).length, 'max', max, 'bytes', js.length);
