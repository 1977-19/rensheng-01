// Story audit: runs lives headlessly and reports repeated popups and story contradictions.
// usage: node tools/audit.js [lives=40] [origin|all] [seed]
//   flags: -top N (rows), -ages (popups per age band), -who (identity mix), -x (print contradiction samples)
const fs = require('fs'), path = require('path'), vm = require('vm');
const FILES = require('./files.js');
const ROOT = path.join(__dirname, '..', 'web');
const N = +process.argv[2] || 40;
const ORG = process.argv[3] && !process.argv[3].startsWith('-') ? process.argv[3] : 'all';
let rs = (+process.argv[4] || 4242) >>> 0;
const TOP = (() => { const i = process.argv.indexOf('-top'); return i > 0 ? +process.argv[i + 1] : 30; })();
function rnd() { rs = (rs * 1664525 + 1013904223) >>> 0; return rs / 4294967296; }
const store = {};
const sb = { console: { log() {}, warn() {}, error: console.error }, setTimeout, clearTimeout, Math: Object.create(Math), JSON, Date, Promise, Object, Array, String, Number, RegExp, Error, isFinite, parseInt, parseFloat };
sb.Math.random = rnd; sb.window = sb; sb.global = sb;
sb.localStorage = { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
sb.navigator = { language: 'zh-CN' };
vm.createContext(sb);
for (const f of FILES.engine) { const p = path.join(ROOT, f); if (fs.existsSync(p)) vm.runInContext(fs.readFileSync(p, 'utf8'), sb, { filename: f }); }
const G = sb.G;
const zh = s => String(s || '').split('|')[0];
let life = null, cur = [];
const rep = {}, seenIn = {}, contra = {}, contraEx = {}, ages = {}, who = {}, errs = {};
function alive(rel, g, side) { return G.N.all(n => n.alive && n.rel === rel && (!g || n.g === g) && (!side || (n.side || 'p') === side)).length > 0; }
function check(title, text) {
  const s = zh(title) + ' ' + zh(text), p = G.S.p, out = [];
  if (/爷爷|外公|姥爷/.test(s) && !/去世|遗|墓|忌日|生前|葬|走了|不在了|想起|回忆|照片|当年/.test(s) && !alive('grand', 'm')) out.push('grandpa-dead');
  if (/奶奶|外婆|姥姥/.test(s) && !/去世|遗|墓|忌日|生前|葬|走了|不在了|想起|回忆|照片|当年/.test(s) && !alive('grand', 'f')) out.push('grandma-dead');
  if (/(?<![当做准新好])(爸爸|妈妈|爸妈)(?!了)/.test(s) && !/去世|遗|墓|忌日|生前|葬|走了|不在了|想起|回忆|照片|当年/.test(s) && !alive('father') && !alive('mother') && p.age >= 18) out.push('parents-dead');
  if (/中国|China/.test(s) && /王室|王子|公主|国王|女王/.test(zh(text)) && p.country === 'cn' && !/英国|泰国|日本|西班牙|外国|异国|欧洲/.test(s)) out.push('cn-royal');
  return out;
}
G.UI = {
  event: async o => {
    const t = zh(o.title), a = G.S.p.age; cur.push(t);
    ages[Math.floor(a / 10) * 10] = (ages[Math.floor(a / 10) * 10] || 0) + 1;
    check(o.title, o.text).forEach(k => { contra[k] = (contra[k] || 0) + 1; (contraEx[k] = contraEx[k] || {})[t] = (contraEx[k][t] || 0) + 1; });
    const ok = o.opts.map((x, i) => i).filter(i => !o.opts[i].dis); return ok.length ? ok[Math.floor(rnd() * ok.length)] : 0;
  },
  result: async () => {}, game: async () => ({ score: rnd(), win: rnd() > .5, mult: 1 }), input: async o => o.def,
  amount: async () => null, confirm: async () => rnd() < .5,
  pick: async o => { if (!o.items.length) return -1; const ok = o.items.map((x, i) => i).filter(i => !o.items[i].dis); return ok.length ? ok[Math.floor(rnd() * ok.length)] : 0; },
  toast: () => {}, profile: async () => {}, chat: async () => {}, investPage: async () => {}, ending: async () => {}
};
let yearsTotal = 0;
(async () => {
  const origins = G.ORIGINS.map(o => o.id);
  for (let L = 0; L < N; L++) {
    const org = ORG === 'all' ? origins[L % origins.length] : ORG;
    const o = G.ORIGIN[org]; let cid = ORG === 'all' ? G.CLIST[Math.floor(rnd() * G.CLIST.length)] : 'cn';
    if (o && o.mon === 1 && !G.C[cid].mon) cid = 'gb'; if (o && o.mon === -1 && G.C[cid].mon) cid = 'cn';
    if (org === 'red') cid = 'cn';
    try { G.life.create({ g: rnd() < .5 ? 'm' : 'f', orient: 'het', country: cid, tier: 1 + Math.floor(rnd() * 3), by: 1960 + Math.floor(rnd() * 50), origin: org, talents: G.sample(G.TALENTS.map(t => t.id), 3) }); }
    catch (e) { errs['create:' + String(e).slice(0, 80)] = 1; continue; }
    cur = []; let g = 0;
    while (!G.S.dead && g++ < 120) {
      try { await G.ageUp(); } catch (e) { errs[String(e).slice(0, 120)] = (errs[String(e).slice(0, 120)] || 0) + 1; G.busy = false; }
      if (G.lastError) { const k = String(G.lastError.stack || G.lastError).split('\n').slice(0, 2).join(' | ').slice(0, 200); errs[k] = (errs[k] || 0) + 1; G.lastError = null; G.busy = false; }
      yearsTotal++;
      try { const id = G.idNow ? G.idNow() : 'n/a'; who[id] = (who[id] || 0) + 1; } catch (e) { }
    }
    const cnt = {}; cur.forEach(t => { cnt[t] = (cnt[t] || 0) + 1; });
    Object.keys(cnt).forEach(t => { const r = rep[t] = rep[t] || { max: 0, tot: 0, lives: 0 }; r.max = Math.max(r.max, cnt[t]); r.tot += cnt[t]; r.lives++; });
  }
  const rows = Object.keys(rep).map(t => ({ t, ...rep[t], avg: rep[t].tot / rep[t].lives })).filter(r => r.max >= 3).sort((a, b) => b.avg - a.avg);
  console.log(`lives ${N} origin=${ORG} years ${yearsTotal} popups ${Object.values(ages).reduce((a, b) => a + b, 0)} (${(Object.values(ages).reduce((a, b) => a + b, 0) / yearsTotal).toFixed(2)}/yr)`);
  console.log('most repeated (avg per life where seen, max):');
  rows.slice(0, TOP).forEach(r => console.log(`  ${r.avg.toFixed(1)}  max ${r.max}  in ${r.lives} lives  ${r.t}`));
  if (process.argv.includes('-ages')) console.log('popups by age band', JSON.stringify(ages));
  if (process.argv.includes('-who')) console.log('identity-years', JSON.stringify(who));
  console.log('contradictions', JSON.stringify(contra));
  if (process.argv.includes('-x')) Object.keys(contraEx).forEach(k => { console.log(' ', k); Object.entries(contraEx[k]).sort((a, b) => b[1] - a[1]).slice(0, 25).forEach(([t, n]) => console.log('     ', n, t)); });
  const ek = Object.keys(errs); console.log('errors', ek.length); ek.slice(0, 15).forEach(k => console.log('  ', errs[k], k));
})();
