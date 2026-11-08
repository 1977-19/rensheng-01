// Headless simulator: runs many random lives through the engine with a stub UI.
// usage: node tools/sim.js [lives=200] [seed]
const fs = require('fs'), path = require('path'), vm = require('vm');
const FILES = require('./files.js');
const ROOT = path.join(__dirname, '..', 'web');
const N = +process.argv[2] || 200;
const VERBOSE = process.argv.includes('-v');
const SANE = process.argv.includes('-s');
const CHECK = process.argv.includes('-c');
const BAD = /^(cr_|joingang|bribe|drink|smoke|scroll|loan|affair|bj|dice|mj|vegas|cheat|skip|slack|fish|tantrum|brawl|dropout|udrop|quit|fquit|pquit|gquit|gleave|launder|discharge|escape|jfight|block|confront|divorce|breakup|argue|lottery|surgery|lux|tr_space)/;
let rs = (+process.argv[3] || 12345) >>> 0;
function rnd() { rs = (rs * 1664525 + 1013904223) >>> 0; return rs / 4294967296; }

const store = {};
const sandbox = { console, setTimeout, clearTimeout, Math: Object.create(Math), JSON, Date, Promise, Object, Array, String, Number, RegExp, Error, isFinite, parseInt, parseFloat };
sandbox.Math.random = rnd;
sandbox.window = sandbox; sandbox.global = sandbox;
sandbox.localStorage = { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = String(v); }, removeItem: k => { delete store[k]; } };
sandbox.navigator = { language: 'zh-CN' };
vm.createContext(sandbox);
for (const f of FILES.engine) {
  const p = path.join(ROOT, f);
  if (!fs.existsSync(p)) { if (VERBOSE) console.log('skip', f); continue; }
  vm.runInContext(fs.readFileSync(p, 'utf8'), sandbox, { filename: f });
}
const G = sandbox.G;
const stats = { npcBad: {}, lives: 0, ages: [], events: {}, errors: [], titles: {}, scores: [], acts: {}, grades: {}, deaths: {}, nw: [], games: {} };
let curEvent = null;
function pickEnabled(n, dis) { const ok = []; for (let i = 0; i < n; i++) if (!dis || !dis(i)) ok.push(i); return ok.length ? ok[Math.floor(rnd() * ok.length)] : -1; }
G.UI = {
  event: async o => { stats.events[o.title] = (stats.events[o.title] || 0) + 1; if (SANE && rnd() < .5 && !o.opts[0].dis) return 0; const i = pickEnabled(o.opts.length, i => o.opts[i].dis); return i < 0 ? 0 : i; },
  result: async () => {},
  game: async (id, o) => { stats.games[id] = (stats.games[id] || 0) + 1; const s = rnd(); return { score: s, win: s > .5, mult: s > .5 ? 2 : 0 }; },
  input: async o => o.def,
  pick: async o => { if (!o.items.length) return -1; if (!o.noCancel && rnd() < .1) return -1; const i = pickEnabled(o.items.length, i => o.items[i].dis); return i < 0 && o.noCancel ? 0 : i; },
  toast: () => {}, profile: async () => {}, chat: async () => {}, investPage: async () => {}, ending: async () => {}
};
const origRun = G.runEvent;
G.runEvent = async function (id, prm, nid) { curEvent = id; return origRun.call(this, id, prm, nid); };

function rpick(a) { return a[Math.floor(rnd() * a.length)]; }
async function doActions() {
  const S = G.S, p = S.p;
  for (let k = 0; k < 4; k++) {
    if (S.dead) return;
    let list = [];
    try { list = G.lifeActs().slice(); } catch (e) { stats.errors.push(['lifeActs', e.stack]); }
    G.ACT_CATS.forEach(c => { if (!c.lock || !c.lock()) list = list.concat(c.items); });
    list = list.filter(a => (!a.a || (p.age >= a.a[0] && p.age <= a.a[1])) && (!a.era || G.eraOk(a.era)) && (!a.if || a.if()) && (!a.lock || !a.lock()) && (!SANE || !BAD.test(a.id)));
    if (SANE && p.ill.some(x => x.known) && rnd() < .7) { const d = G.ACT_CATS[0].items[0]; if (p.energy >= 10) { p.energy -= 10; curEvent = 'act:doctor'; await d.run(d); } }
    if (SANE) { const pref = list.filter(a => /^(study|ustudy|work|gym|run|jobsearch|intern|gwork|train|patrol|perform|manage|invest|house|time|gift|date|confess|propose|wed|trybaby|homework|extra|friend|app|blind|club|read)$/.test(a.id)); if (pref.length && rnd() < .7) list = pref; }
    if (rnd() < .35) {
      const ns = G.N.all(n => n.alive);
      if (ns.length) {
        const n = rpick(ns); const acts = G.npcActs(n).filter(a => a.id !== 'block' && a.id !== 'chat' && (!a.if || a.if()) && (!SANE || !BAD.test(a.id)));
        if (acts.length) { const a = rpick(acts); curEvent = 'npc:' + a.id; stats.acts['npc:' + a.id] = (stats.acts['npc:' + a.id] || 0) + 1; if (p.energy >= (a.e || 0)) { p.energy -= a.e || 0; await a.run(n, a); } }
        if (rnd() < .3) { curEvent = 'chat'; await G.chat.send(n, rpick(['你好', '借我点钱', '我爱你', '你真好看', '滚', '最近怎么样', 'hello']), null); }
      }
      continue;
    }
    if (!list.length) return;
    const a = rpick(list);
    if (a.e && p.energy < a.e) continue;
    if (a.$) { const pr = G.$(a.$); if (p.money < pr) continue; G.addMoney(-pr); }
    p.energy -= a.e || 0;
    curEvent = 'act:' + a.id; stats.acts[a.id] = (stats.acts[a.id] || 0) + 1;
    await a.run(a);
  }
}
(async function () {
  const t0 = Date.now();
  for (let L = 0; L < N; L++) {
    const cid = rpick(G.CLIST), org = rpick(G.ORIGINS.filter(o => !o.mon || (o.mon > 0) === !!G.C[cid].mon));
    const tal = G.sample(G.TALENTS.map(t => t.id), 3);
    try {
      G.life.create({ g: rnd() < .5 ? 'm' : 'f', orient: rpick(['het', 'het', 'het', 'gay', 'bi']), country: cid, tier: 1 + Math.floor(rnd() * 5), by: 1950 + Math.floor(rnd() * 76), origin: org.id, talents: tal });
    } catch (e) { stats.errors.push(['create', e.stack]); continue; }
    let guard = 0;
    while (!G.S.dead && guard++ < 130) {
      try { await doActions(); } catch (e) { stats.errors.push([curEvent, e.stack]); }
      G.lastError = null;
      await G.ageUp();
      if (CHECK && !G.S.dead) G.N.all(n => n.alive).forEach(n => { const a = G.N.age(n), j = String(n.job || ''); let bad = null;
        if (a >= 24 && /学龄前|婴儿|^学生|大学生/.test(j)) bad = 'adult-student'; else if (a < 5 && /学生/.test(j)) bad = 'baby-student';
        else if (a > (G.C[n.c] || G.C.cn).retire + 8 && !/退休/.test(j) && !n.tags.length && n.inc && n.rel !== 'spouse') bad = 'no-retire';
        if (bad) { const k = bad + ':' + n.rel; stats.npcBad[k] = (stats.npcBad[k] || 0) + 1; } });
      if (G.lastError) { stats.errors.push([curEvent, G.lastError.stack]); G.lastError = null; G.busy = false; }
    }
    if (!G.S.dead) { stats.errors.push(['nodeath', 'age ' + G.S.p.age]); continue; }
    stats.size = Math.max(stats.size || 0, JSON.stringify(G.S).length);
    const e = G.S.ending || G.ending.compute();
    stats.lives++; stats.ages.push(G.S.p.age); stats.scores.push(e.score); stats.nw.push(e.nw / G.$(1));
    stats.titles[G.T(e.title)] = (stats.titles[G.T(e.title)] || 0) + 1; stats.grades[e.grade] = (stats.grades[e.grade] || 0) + 1;
    const dc = G.T(G.S.death.c).replace(/死于|Died of /, '').slice(0, 12); stats.deaths[dc] = (stats.deaths[dc] || 0) + 1;
    // continue as heir sometimes
    if (rnd() < .25 && e.heirs.length) { try { G.life.continueAs(G.S.npcs[e.heirs[0].id]); let g2 = 0; while (!G.S.dead && g2++ < 120) { await doActions(); await G.ageUp(); if (G.lastError) { stats.errors.push(['heir:' + curEvent, G.lastError.stack]); G.lastError = null; G.busy = false; } } } catch (er) { stats.errors.push(['heir', er.stack]); } }
  }
  const avg = a => a.length ? (a.reduce((x, y) => x + y, 0) / a.length).toFixed(1) : 0;
  const med = a => { const s = a.slice().sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  console.log(`lives ${stats.lives} in ${((Date.now() - t0) / 1000).toFixed(1)}s | avg age ${avg(stats.ages)} | avg score ${avg(stats.scores)} | median nw(usd) ${Math.round(med(stats.nw))}`);
  console.log('grades', JSON.stringify(stats.grades));
  console.log('titles', JSON.stringify(stats.titles));
  console.log('deaths', JSON.stringify(stats.deaths));
  if (VERBOSE) { console.log('games', JSON.stringify(stats.games)); console.log('events', Object.keys(stats.events).length); }
  const EI = process.argv.indexOf('-e'); if (EI > 0) { const re = new RegExp(process.argv[EI + 1]); Object.keys(stats.events).filter(k => re.test(k)).sort((a, b) => stats.events[b] - stats.events[a]).forEach(k => console.log('  ev', stats.events[k], k)); }
  const uniq = {};
  stats.errors.forEach(([w, s]) => { const k = w + ' :: ' + String(s).split('\n').slice(0, 2).join(' | '); uniq[k] = (uniq[k] || 0) + 1; });
  const keys = Object.keys(uniq);
  console.log('max save bytes', stats.size);
  if (CHECK) console.log('npc consistency', JSON.stringify(stats.npcBad));
  console.log('errors', stats.errors.length, 'unique', keys.length);
  keys.slice(0, 25).forEach(k => console.log(' ', uniq[k], 'x', k.slice(0, 400)));
  process.exit(keys.length ? 1 : 0);
})();
