// Generates VIP redeem codes. Plaintext goes to ../private (never committed); hashes go to web/js/data/codes.js
const crypto = require('crypto'), fs = require('fs'), path = require('path');
const SALT = 'mylife-2026|', AL = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const N = +process.argv[2] || 10;
const out = { 1: [], 2: [], 3: [] }, plain = [];
function part() { let s = ''; for (let i = 0; i < 4; i++) s += AL[crypto.randomInt(AL.length)]; return s; }
const NAMES = { 1: '白银VIP / Silver', 2: '黄金VIP / Gold', 3: '钻石VIP / Diamond' };
for (const t of [1, 2, 3]) {
  plain.push('', `== ${NAMES[t]} ==`);
  for (let i = 0; i < N; i++) {
    const code = `ML${t}-${part()}-${part()}-${part()}`;
    const norm = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
    out[t].push(crypto.createHash('sha256').update(SALT + norm).digest('hex'));
    plain.push(code);
  }
}
fs.writeFileSync(path.join(__dirname, '..', 'web/js/data/codes.js'), '/* VIP code hashes (SHA-256). Plain codes are not stored in the app. */\nG.VIP_HASH = ' + JSON.stringify(out) + ';\n');
fs.writeFileSync(process.argv[3] || path.join(__dirname, '..', '..', 'private', 'vip_codes.txt'), '《我的一生》VIP 兑换码 / My Life VIP codes\n每个码只能在一台手机上用一次；高等级包含低等级全部特权。\nEach code works once per phone; higher tiers include all lower-tier perks.\n' + plain.join('\n') + '\n');
console.log('codes generated', N * 3);
