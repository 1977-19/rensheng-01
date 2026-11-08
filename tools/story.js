// Prints one simulated life's diary: node tools/story.js [seed] [lang]
const fs = require('fs'), path = require('path'), vm = require('vm');
const FILES = require('./files.js'); const ROOT = path.join(__dirname, '..', 'web');
let rs = (+process.argv[2] || 7) >>> 0; function rnd() { rs = (rs * 1664525 + 1013904223) >>> 0; return rs / 4294967296; }
const sb = { console, setTimeout, Math: Object.create(Math), JSON, Date, Promise, Object, Array, String, Number, RegExp, Error, isFinite, parseInt, parseFloat };
sb.Math.random = rnd; sb.window = sb; sb.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} }; sb.navigator = { language: 'zh' };
vm.createContext(sb); FILES.engine.forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), sb, { filename: f }));
const G = sb.G; G.setLang(process.argv[3] || 'zh');
G.UI = { event: async o => { const ok = o.opts.map((x, i) => i).filter(i => !o.opts[i].dis); return ok[Math.floor(rnd() * ok.length)] || 0; }, result: async () => {}, game: async () => ({ score: .4 + rnd() * .5, win: rnd() > .4, mult: 2 }), input: async o => o.def, pick: async o => { const ok = o.items.map((x, i) => i).filter(i => !o.items[i].dis); return ok.length ? ok[Math.floor(rnd() * ok.length)] : -1; }, toast: () => {}, ending: async () => {} };
(async () => {
  G.life.create({ g: rnd() < .5 ? 'm' : 'f', country: process.argv[4] || 'cn', tier: 3, by: 1975 + Math.floor(rnd() * 20), origin: 'worker', talents: ['smart', 'social'] });
  while (!G.S.dead && G.S.p.age < 110) {
    const acts = G.lifeActs().filter(a => (!a.a || (G.S.p.age >= a.a[0] && G.S.p.age <= a.a[1])) && (!a.if || a.if()) && !/quit|drop|cheat|skip/.test(a.id));
    for (let k = 0; k < 2 && acts.length; k++) { const a = acts[Math.floor(rnd() * acts.length)]; if (G.S.p.energy >= (a.e || 0)) { G.S.p.energy -= a.e || 0; await a.run(a); } }
    await G.ageUp();
  }
  G.S.log.forEach(e => { console.log(G.T('{a}岁|Age {a}', { a: e.a }) + ' (' + e.y + ')'); e.t.forEach(l => console.log('   ' + G.T(l))); });
  const d = G.ending.compute(); console.log('\n==', G.T(d.title), d.grade, d.score, G.T(d.cause));
})();
