/* Version 1.8 interface: pets in the relationships page (with a sitter and a memorial), a clearer heir picker,
   promotion requirements on the activities page, and profiles that always open. */
(function () {
  'use strict';
  var h = G.h, UI = G.UI, T = UI.T, tap = UI.tap, N = G.N;
  function S() { return G.S; }

  /* ---------------- pets ---------------- */
  function bar(label, v, cls) { return h('div', { class: 'st' }, h('span', { class: 'l' }, T(label)), h('div', { class: 'bar' }, h('i', { class: cls, style: { width: Math.max(0, Math.min(100, v)) + '%' } }), h('b', { class: 'num' }, String(Math.round(v))))); }
  UI.petPage = function (x, onDone) {
    var s = S(), A = s.assets, d = G.petDef(x), md;
    if (x.health == null) x.health = 85; if (x.aff == null) x.aff = 60;
    function body() {
      var age = s.year - x.by;
      var acts = h('div', { class: 'actgrid' },
        btn('🎾', '陪{n}玩|Play with {n}', 5, async function () {
          await UI.doAction({ n: G.L('陪{n}玩|Play with {n}', { n: x.name }), i: d.i, e: 5, run: function (a) { x.aff = Math.min(100, x.aff + G.ri(6, 10)); x.playY = s.year; return G.quick(a, G.pick(['{n}叼着球跑回来，把球放在你脚边，尾巴摇个不停。|{n} came racing back with the ball, dropped it at your feet and wagged nonstop.', '你和{n}在草地上打滚，玩了整整一个下午。|You and {n} rolled around on the grass all afternoon.', '{n}蜷在你怀里打起了小呼噜。|{n} curled up in your lap and started to snore softly.']), { happy: 5, stress: -5 }, { n: x.name }); } });
        }),
        btn('🦴', '喂零食|Give a Treat', 0, async function () {
          var c = G.$(30); if (!G.canPay(c)) { UI.toast(G.L('钱不够|Not enough money')); return; } G.charge(c); x.aff = Math.min(100, x.aff + 3); x.playY = s.year; UI.toast(G.L('{n}吃得很开心。|{n} loved it.', { n: x.name }));
        }),
        btn('🩺', '带去看兽医|See the Vet', 5, async function () {
          await UI.doAction({ n: G.L('带{n}看兽医|Take {n} to the Vet', { n: x.name }), i: '🩺', e: 5, $: 300, run: function (a) { var g = G.ri(8, 18); x.health = Math.min(100, x.health + g); return G.quick(a, '兽医仔细检查了{n}，开了药。{n}的健康+{g}。|The vet examined {n} carefully and prescribed medicine. {n}\'s health +{g}.', { happy: 1 }, { n: x.name, g: g }); } });
        }),
        btn('🧑‍🍼', x.sitter ? '辞退宠物保姆|Let the Sitter Go' : '雇宠物保姆|Hire a Pet Sitter', 0, async function () {
          if (x.sitter) { x.sitter = 0; UI.toast(G.L('你辞退了宠物保姆。|You let the pet sitter go.')); return; }
          if (await UI.confirm('宠物保姆|Pet Sitter', G.L('每年约{a}~{b}。保姆会每天遛{n}、喂饭、陪玩，{n}的好感和健康每年都会慢慢上升。|About {a}–{b} a year. The sitter walks, feeds and plays with {n} every day; {n}\'s affection and health rise a little each year.', { a: G.M(G.$(2400)), b: G.M(G.$(4800)), n: x.name }))) { x.sitter = 1; UI.toast(G.L('宠物保姆明天开始上门。|The sitter starts tomorrow.')); }
        }),
        btn('🏡', '送养|Rehome', 0, async function () {
          if (!(await UI.confirm('送养|Rehome', G.L('把{n}送给别人养？|Give {n} to a new home?', { n: x.name })))) return;
          s.petRehomed = s.petRehomed || {}; s.petRehomed[x.id] = 1; A.pets = A.pets.filter(function (y) { return y !== x; }); G.addStat('happy', -6); G.log('你把{n}送给了新主人。|You gave {n} to a new owner.', { n: x.name });
          md.close(); if (onDone) onDone(); return 'closed';
        }));
      return h('div', null,
        h('div', { class: 'prof' }, h('div', { class: 'petav' }, d.i), h('div', null, h('div', { class: 'nm' }, T(x.name)), h('div', { class: 'rl' }, T(d.n)), h('div', { style: { fontSize: '13px', color: 'var(--ink2)' } }, T('{a}岁 · 来到你家{y}年|{a} yr · with you since {y}', { a: age, y: x.by })))),
        h('div', { class: 'bars2' }, bar('好感|Affection', x.aff, 'c-gold'), bar('健康|Health', x.health, 'c-leaf')),
        (function () { var dl = h('dl', { class: 'kv' }); [['照顾|Care', x.sitter ? '有宠物保姆|Pet sitter hired' : '你自己照顾|You look after it'], ['寿命|Lifespan', G.L('约{n}年|about {n} years', { n: d.life || 12 })]].forEach(function (r) { dl.appendChild(h('dt', null, T(r[0]))); dl.appendChild(h('dd', null, T(r[1]))); }); return dl; })(),
        acts);
    }
    function btn(ic, label, e, fn) {
      return h('button', { class: 'ab', onclick: tap(async function () { var r = await fn(); if (r === 'closed') return; refresh(); }) }, h('span', null, ic), T(G.L(label, { n: x.name })), e ? h('div', { class: 'c' }, '⚡' + e) : null);
    }
    function refresh() { var mb = md.m.querySelector('.mb'); if (mb) { mb.innerHTML = ''; mb.appendChild(body()); } }
    md = UI.modal({ title: x.name, body: body(), close: true, onClose: function () { if (onDone) onDone(); } });
  };
  UI.petGrave = function (x) {
    var d = G.petDef(x), s = S();
    var md = UI.modal({ title: x.name, body: h('div', { class: 'petstone' }, h('div', { class: 'petav gone' }, d.i), h('b', null, T(x.name)), h('div', null, T(d.n) + ' · ' + x.by + ' – ' + (x.died || '?')), h('div', { style: { color: 'var(--ink2)', fontSize: '13px' } }, T('它陪了你{y}年。|It was with you for {y} years.', { y: Math.max(1, (x.died || s.year) - x.by) })), x.flowers ? h('div', null, '🌼 × ' + x.flowers) : null),
      foot: [h('button', { class: 'opt solid', onclick: tap(function () { x.flowers = (x.flowers || 0) + 1; G.addStat('happy', 2); md.close(); UI.toast(G.L('你在{n}的小墓前放了一束小花。|You left a few flowers at {n}\'s little grave.', { n: x.name })); }) }, T('放一束花|Leave flowers')), h('button', { class: 'opt', onclick: tap(function () { md.close(); }) }, T('离开|Leave'))] });
  };
  UI.petSection = function (b, rec) {
    var s = S(), pets = s.assets.pets, gone = s.petGone || [], any = false;
    if (pets.length) {
      any = true; b.appendChild(h('div', { class: 'grp' }, T('宠物|Pets') + ' ' + pets.length));
      pets.forEach(function (x) {
        var d = G.petDef(x);
        b.appendChild(h('button', { class: 'row', onclick: tap(function () { UI.petPage(x, function () { rec.refresh(); }); }) },
          h('div', { class: 'avwrap' }, h('div', { class: 'petav sm' }, d.i)),
          h('div', { class: 'tx' }, h('div', { class: 't' }, T(x.name), x.sitter ? h('span', { class: 'chip tag' }, T('有保姆|Sitter')) : null), h('div', { class: 's' }, T(d.n) + ' · ' + T('{a}岁|{a} yr', { a: s.year - x.by }) + ' · ' + T('健康|Health') + ' ' + Math.round(x.health == null ? 85 : x.health))),
          h('div', { class: 'rt' }, h('span', null, '🐾'), h('div', { class: 'mini' }, h('i', { style: { width: Math.max(0, Math.min(100, x.aff == null ? 60 : x.aff)) + '%' } })))));
      });
    }
    if (gone.length) {
      any = true; b.appendChild(h('div', { class: 'grp' }, T('离开的宠物|Pets Remembered') + ' ' + gone.length));
      gone.slice().reverse().forEach(function (x) {
        var d = G.petDef(x);
        b.appendChild(h('button', { class: 'row gone', onclick: tap(function () { UI.petGrave(x); }) }, h('div', { class: 'avwrap' }, h('div', { class: 'petav sm gone' }, d.i)),
          h('div', { class: 'tx' }, h('div', { class: 't' }, T(x.name)), h('div', { class: 's' }, T(d.n) + ' · ' + x.by + '–' + (x.died || '?'))), h('div', { class: 'rt' }, h('span', { class: 'chip' }, T('看看它|Visit')))));
      });
    }
    return any;
  };

  /* ---------------- heir picker ---------------- */
  UI.pickHeir = async function (d) {
    var s = S(), L = d.heirs;
    if (!L.length) return -1;
    var items = L.map(function (k) {
      var n = s.npcs[k.id], bits = [T('{a}岁|age {a}', { a: k.age })];
      if (n) { if (n.job) bits.push(T(n.job)); bits.push(T('好感|Affection') + ' ' + Math.round(n.aff || 0)); if (n.wealth > 0) bits.push(G.fm(n.wealth, n.c)); }
      if (k.grand) bits.push(T('孙辈|Grandchild'));
      if (k.will) bits.push(T('📜 遗嘱指定|📜 Named in the will'));
      return { t: k.name, sub: bits.join(' · '), npc: n };
    });
    return UI.pick({ title: '选择继承人|Choose an Heir', text: G.L('遗嘱只决定财产归谁。你可以作为任何一个子女或孙辈继续人生——你选中的人会继承全部遗产。|The will only decides the estate. You can live on as any child or grandchild — whoever you choose inherits everything.'), items: items });
  };

  /* ---------------- promotion requirements on the activities page ---------------- */
  var ta7 = UI.tabActivities;
  UI.tabActivities = function () {
    var r = ta7.apply(this, arguments);
    try {
      var reqs = G.promoReq ? G.promoReq() : [];
      var sheets = document.querySelectorAll('.sheet'), sh = sheets[sheets.length - 1], body = sh && sh.querySelector('.sb'), cap = body && body.querySelector('.wcap');
      if (body && reqs.length) {
        var card = h('div', { class: 'card promo7' }, reqs.map(function (x) {
          return h('div', { class: 'pr' }, h('b', null, '🎯 ' + T(x.t)), h('ul', null, x.rows.map(function (rw) { return h('li', { class: rw.ok ? 'ok' : 'no' }, (rw.ok ? '✅ ' : '⬜ ') + T(rw.l) + '：' + rw.h + ' / ' + rw.n); })), x.note ? h('div', { class: 'nt' }, T(x.note)) : null);
        }));
        if (cap && cap.nextSibling) body.insertBefore(card, cap.nextSibling); else body.insertBefore(card, body.firstChild);
      }
    } catch (e) { console.error(e); }
    return r;
  };

  /* ---------------- profiles always open ---------------- */
  var pf7 = UI.profile;
  UI.profile = function (n) {
    if (G.npcRepair) try { G.npcRepair(n); } catch (e) { }
    var args = arguments, self = this;
    function fallback(e) {
      console.error(e);
      document.querySelectorAll('.veil').forEach(function (v) { if (!v.querySelector('.mb')) v.remove(); });
      return new Promise(function (res) {
        var md = UI.modal({ title: N.relName(n), close: true, onClose: function () { res(); }, body: h('div', null, h('div', { class: 'prof' }, h('div', { class: 'avs', html: G.avatarOf(n) }), h('div', null, h('div', { class: 'nm' }, T(n.name)), h('div', { class: 'rl' }, T(N.relName(n))))),
          h('div', { class: 'actgrid' }, h('button', { class: 'ab', onclick: tap(function () { md.close(); res(); UI.chat(n); }) }, h('span', null, '💬'), T('聊天|Chat')))) });
      });
    }
    var pr;
    try { pr = pf7.apply(self, args); } catch (e) { return fallback(e); }
    return pr && pr.catch ? pr.catch(fallback) : pr;
  };
})();
