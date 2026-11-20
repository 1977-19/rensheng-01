// Finds event options whose result changes nothing the player can see (no stat, money or relationship change).
// usage: node tools/effect_audit.js [filterRegex] [-list]
const fs = require('fs'), path = require('path'), vm = require('vm');
const FILES = require('./files.js');
let rs = 77; function rnd() { rs = (rs * 1664525 + 1013904223) >>> 0; return rs / 4294967296; }
const sb = { console: { log() {}, warn() {}, error: (...a) => process.stderr.write(a.join(' ') + '\n') }, setTimeout, Math: Object.create(Math), JSON, Date, Promise, Object, Array, String, Number, RegExp, Error, isFinite, parseInt, parseFloat };
sb.Math.random = rnd; sb.window = sb; sb.global = sb; sb.localStorage = { getItem: () => null, setItem() {}, removeItem() {} }; sb.navigator = { language: 'zh' };
vm.createContext(sb);
for (const f of FILES.engine) vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'web', f), 'utf8'), sb, { filename: f });
const G = sb.G;
let want = 0, lastDl = null, lastRes = null;
G.UI = { event: async o => Math.min(want, o.opts.length - 1), result: async o => { lastRes = o; }, game: async () => ({ score: .6, win: 1, mult: 1 }), input: async o => o.def, amount: async () => null, confirm: async () => false, pick: async () => 0, toast() {}, profile: async () => {}, chat: async () => {}, investPage: async () => {}, ending: async () => {} };
const de = G.dEnd; G.dEnd = function () { const l = de.apply(this, arguments); if (!G.D.on) lastDl = l; return l; };
const re = process.argv[2] && !process.argv[2].startsWith('-') ? new RegExp(process.argv[2]) : null;
const ids = Object.keys(G.EV).filter(id => G.EV[id].o && (!re || re.test(id)));
const empty = [], byFile = {}; let total = 0, ran = 0;
(async () => {
  for (const id of ids) {
    const d = G.EV[id];
    for (let k = 0; k < d.o.length; k++) {
      total++;
      try {
        G.life.create({ g: 'm', orient: 'het', country: 'cn', tier: 2, by: 1970, origin: d.odb || 'middle', talents: [] });
        const a = d.a ? Math.round((d.a[0] + d.a[1]) / 2) : 30; G.S.year += a; G.S.p.age = a;
        const sp = G.N.make({ rel: 'spouse', g: 'f', age: a, aff: 60 }); sp.love = 70; G.S.p.partner = sp.id;
        G.N.make({ rel: 'child', g: 'm', age: Math.max(4, Math.min(a - 22, 12)), aff: 60 });
        const f0 = d.if, p0 = d.prep, oi = d.o.map(o => o.if); d.if = null; if (d.o) d.o.forEach(o => o.if = null);
        want = k; lastDl = null; lastRes = null; G.D.on = 0; G.busy = false;
        await G.runEvent(id);
        d.if = f0; d.o.forEach((o, i) => o.if = oi[i]);
        if (lastDl === null) continue; // the event didn't run (prep refused)
        ran++;
        const vis = lastDl.filter(x => x && x.k !== 'note' && x.n);
        if (!vis.length) empty.push([id, k, String(typeof d.o[k].t === 'string' ? d.o[k].t : '?').split('|')[0], lastRes ? String(lastRes.text || '').split('|')[0].slice(0, 60) : '']);
      } catch (e) { G.busy = false; if ((global.__ec = (global.__ec || 0) + 1) < 4) console.error(id, e.stack.split("\n").slice(0,3).join(" | ")); }
    }
  }
  console.log(`options ${total}, ran ${ran}, no visible effect ${empty.length} (${(empty.length / Math.max(1, ran) * 100).toFixed(1)}%)`);
  const pre = {}; empty.forEach(e => { const p = e[0].split('_')[0]; pre[p] = (pre[p] || 0) + 1; });
  console.log('by prefix', JSON.stringify(Object.entries(pre).sort((a, b) => b[1] - a[1]).slice(0, 30)));
  if (process.argv.includes('-list')) empty.slice(0, +(process.argv[process.argv.indexOf('-list') + 1]) || 60).forEach(e => console.log(' ', e.join(' | ')));
})();
