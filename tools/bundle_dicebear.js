// Bundle the compiled DiceBear core (CommonJS output of tsc) + two style definitions into browser scripts.
// usage: node tools/bundle_dicebear.js <compiled-dir> <styles-src-dir>
const fs = require('fs'), path = require('path');
const [dir, sty] = process.argv.slice(2);
const files = [];
(function walk(d) { for (const f of fs.readdirSync(d)) { const p = path.join(d, f); if (fs.statSync(p).isDirectory()) walk(p); else if (f.endsWith('.js')) files.push(p); } })(dir);
let out = '/* DiceBear core (MIT, (c) Florian Koerner) bundled for the browser */\n(function () {\nvar M = {}, C = {};\n';
for (const f of files) {
  const id = path.relative(dir, f).replace(/\\/g, '/');
  out += 'M[' + JSON.stringify(id) + '] = function (module, exports, require) {\n' + fs.readFileSync(f, 'utf8').replace(/\/\/# sourceMappingURL=.*/g, '') + '\n};\n';
}
out += `function norm(base, rel) { var parts = base.split('/'); parts.pop(); rel.split('/').forEach(function (s) { if (s === '..') parts.pop(); else if (s !== '.') parts.push(s); }); return parts.join('/'); }
function req(from) { return function (r) { var id = norm(from, r); if (C[id]) return C[id].exports; var m = C[id] = { exports: {} }; M[id](m, m.exports, req(id)); return m.exports; }; }
window.DiceBear = req('index.js')('./lite.js');
})();\n`;
fs.writeFileSync(path.join(__dirname, '../web/js/lib/dicebear.js'), out);
const keep = {};
for (const s of ['avataaars', 'adventurer', 'lorelei']) keep[s] = JSON.parse(fs.readFileSync(path.join(sty, s + '.json'), 'utf8'));
fs.writeFileSync(path.join(__dirname, '../web/js/lib/avstyles.js'),
  '/* Avatar style definitions from DiceBear styles. avataaars: "Avataaars" by Pablo Stanley (free for personal and commercial use);\n   adventurer: "Adventurer" by Lisa Wischofsky, CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/). */\nwindow.AV_STYLES = ' + JSON.stringify(keep) + ';\n');
console.log('ok', files.length, 'modules');
