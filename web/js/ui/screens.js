/* Screens: start, new-life wizard, settings, saves, achievements, hall of fame, VIP, ending */
(function () {
  'use strict';
  var h = G.h, UI = G.UI, T = UI.T, tap = UI.tap;
  var app = function () { return document.getElementById('app'); };
  UI.screen = function (node) { var a = app(); a.innerHTML = ''; a.appendChild(node); };

  /* ===================== START ===================== */
  UI.start = function () {
    UI.closeAllSheets();
    G.S = null;
    var auto = G.slotInfo('auto');
    var btns = [];
    if (auto && !auto.dead) btns.push(h('button', { class: 'big solid', onclick: tap(function () { if (G.load('auto')) UI.main(); }) },
      T('继续人生|Continue'), h('div', { style: { fontSize: '12.5px', fontWeight: 500, opacity: .85 } }, T('{n}，{a}岁|{n}, age {a}', { n: auto.name, a: auto.age }))));
    btns.push(h('button', { class: 'big' + (auto && !auto.dead ? '' : ' solid'), onclick: tap(function () { if (auto && !auto.dead) { UI.confirm('开始新的人生|New Life', '当前的自动存档会被覆盖，确定吗？（可以先手动存档）|Your autosave will be overwritten. Continue? (You can save manually first.)').then(function (ok) { if (ok) UI.wizard(); }); } else UI.wizard(); }) }, T('开始新的人生|Start a New Life')));
    btns.push(h('div', { class: 'small-row' },
      h('button', { class: 'big', onclick: tap(function () { UI.saves(); }) }, T('存档|Saves')),
      h('button', { class: 'big', onclick: tap(function () { UI.achievements(); }) }, T('成就|Achievements'))));
    btns.push(h('div', { class: 'small-row' },
      h('button', { class: 'big', onclick: tap(function () { UI.records(); }) }, T('名人堂|Hall of Fame')),
      h('button', { class: 'big', onclick: tap(function () { UI.settingsPage(); }) }, T('设置|Settings'))));
    var v = G.vip.tier();
    btns.push(h('button', { class: 'big', onclick: tap(function () { UI.vipPage(); }) }, v ? T(G.vip.NAMES[v]) + ' ✓' : T('VIP 兑换码|Redeem VIP Code')));
    UI.screen(h('div', { class: 'start grid-paper' },
      h('div', { class: 'title' }, h('h1', { style: G.lang === 'en' ? { letterSpacing: '.08em', marginLeft: '.08em' } : null }, T('我的一生|My Life')), G.lang === 'en' ? null : h('div', { class: 'en' }, 'My Life'), h('div', { class: 'tline' })),
      h('div', { class: 'btns' }, btns),
      h('div', { class: 'foot-note' }, T('已度过 {n} 段人生|{n} lives lived', { n: (G.meta.stats.lives || 0) }) + '  ·  v' + G.VERSION)));
  };

  /* ===================== WIZARD ===================== */
  UI.wizard = function () {
    var v = G.vip.tier();
    var w = { step: 0, g: 'm', orient: 'het', country: 'cn', tier: 3, city: null, by: 2000, origin: 'worker', talents: [], rerolls: (v >= 1 ? 3 : 0) + 1, pool: [], bonus: { looks: 0, smarts: 0, health: 0, happy: 0, eq: 0 }, sur: null, giv: null, custom: null };
    var N_STEPS = 6;
    function drawTalents() {
      var all = G.TALENTS.map(function (t) { return t.id; });
      if (v >= 3) { w.pool = all; w.talents = []; return; }
      if (v >= 2) { w.pool = G.shuffle(all).slice(0, 8); w.talents = []; return; }
      var pick = []; while (pick.length < 3) { var t = G.wpick(G.TALENTS.filter(function (x) { return pick.indexOf(x.id) < 0 && !G.talentClash(pick, x.id); }), function (x) { return x.r === 3 ? 1 : x.r === 2 ? 3 : 6; }); pick.push(t.id); }
      w.pool = pick; w.talents = pick.slice();
    }
    function genName() { var cul = G.C[w.country].names; var nm = G.genName(cul, w.g, w.by); w.sur = nm.sur; w.giv = nm.giv; w.name = nm.name; }
    drawTalents(); genName();
    function originOk(o) { var mon = G.C[w.country].mon; if (o.mon === 1 && !mon) return false; if (o.mon === -1 && mon) return false; if (o.id === 'leftbehind' && w.by < 1985 && w.country === 'cn') return true; return true; }
    var lastStep = -1;
    function render() {
      // keep the list where it was when re-rendering the same step (tapping a talent/origin/city must not jump to the top)
      var oldBody = document.querySelector('.wiz .wb'), keep = oldBody && lastStep === w.step ? oldBody.scrollTop : 0;
      lastStep = w.step;
      var body = h('div', { class: 'wb' }), titles = ['你是谁|Who Are You', '出生地|Birthplace', '出生年份|Birth Year', '出身|Family Background', '天赋|Talents', '出生证明|Birth Certificate'];
      [step0, step1, step2, step3, step4, step5][w.step](body);
      var steps = h('div', { class: 'steps' }); for (var i = 0; i < N_STEPS; i++) steps.appendChild(h('i', { class: i <= w.step ? 'on' : '' }));
      var next = h('button', { class: 'big solid', style: { width: '100%' }, onclick: tap(function () {
        if (w.step === 4 && w.talents.length < Math.min(3, w.pool.length) && v >= 2) { UI.toast('请选择3个天赋|Pick 3 talents'); return; }
        if (w.step < N_STEPS - 1) { w.step++; if ((w.step === 2 || w.step === 3) && !w.custom) genName(); if (w.step === 4) w.justDrew = true; render(); } else born();
      }) }, w.step < N_STEPS - 1 ? T('下一步|Next') : T('出生！|Be Born!'));
      UI.screen(h('div', { class: 'wiz grid-paper' },
        h('div', { class: 'wh' }, h('button', { class: 'back', onclick: tap(function () { if (w.step) { w.step--; render(); } else UI.start(); }) }, '‹'), h('h3', null, T(titles[w.step])), h('div', { class: 'sp', style: { width: '38px' } })),
        steps, preview(), body, h('div', { class: 'wf' }, next)));
      if (keep) body.scrollTop = keep;
    }
    // a little "you" that grows up in front of you while you choose
    var BADGE = { royal: '👑', noble: '🎩', richest: '💎', tycoon: '💰', merchant: '💼', red: '⭐', celebrity: '🌟', military: '🎖️', police: '🚓', scholar: '📚', academic: '🎓', medical: '🩺', artist: '🎨', champion: '🏆', rural: '🌾', orphan: '🕯️', immigrant: '🧳', debt: '🧾' };
    w.seed = w.seed || G.ri(1, 1e9);
    var ageTimer = null;
    function preview() {
      var ages = [0, 6, 16, 28, 45, 72], lbl = ['出生|Born', '童年|Childhood', '青春|Youth', '成年|Adulthood', '中年|Middle age', '晚年|Old age'];
      var skin = G.N.skinFor(w.country), box = h('div', { class: 'wpv-av' }), cap = h('div', { class: 'wpv-cap' });
      var i = 0;
      function paint() { box.innerHTML = G.avatar({ seed: w.seed, age: ages[i], g: w.g, skin: skin, cul: w.country, happy: 80 }); box.classList.remove('pop'); void box.offsetWidth; box.classList.add('pop'); cap.textContent = T(lbl[i]) + ' · ' + (w.by + ages[i]); }
      paint();
      if (ageTimer) clearInterval(ageTimer);
      ageTimer = setInterval(function () { if (!document.body.contains(box)) { clearInterval(ageTimer); return; } i = (i + 1) % ages.length; paint(); }, 1500);
      var org = G.ORIGIN[w.origin], chips = [G.C[w.country].flag + ' ' + T(G.C[w.country].n), w.by + T('年|'), T(org ? org.n : '')];
      if (w.step >= 4 && w.talents.length) chips.push(w.talents.map(function (t) { return T(G.TALENT[t].n); }).join(' · '));
      return h('div', { class: 'wpv' },
        h('div', { class: 'wpv-l' }, box, w.step >= 3 && BADGE[w.origin] ? h('div', { class: 'wpv-b' }, BADGE[w.origin]) : null, cap),
        h('div', { class: 'wpv-r' }, h('b', null, w.custom || T(w.name)), h('div', { class: 'wpv-chips' }, chips.filter(Boolean).map(function (c) { return h('span', null, c); }))));
    }
    function seg(opts, cur, set) { return h('div', { class: 'seg' }, opts.map(function (o) { return h('button', { class: o[0] === cur ? 'on' : '', onclick: tap(function () { set(o[0]); render(); }) }, T(o[1])); })); }
    function step0(b) {
      b.appendChild(h('div', { class: 'label' }, T('这一世，你想成为……|This time, you\'ll be born...')));
      b.appendChild(h('div', { class: 'gcards' }, [['m', '男孩|A boy'], ['f', '女孩|A girl']].map(function (o) {
        return h('button', { class: 'gcard' + (w.g === o[0] ? ' on' : ''), onclick: tap(function () { if (w.g !== o[0]) { w.g = o[0]; genName(); } render(); }) },
          h('div', { class: 'gav', html: G.avatar({ seed: w.seed + (o[0] === 'm' ? 1 : 2), age: 7, g: o[0], skin: G.N.skinFor(w.country), cul: w.country, happy: 90 }) }), h('b', null, T(o[1])));
      })));
      b.appendChild(h('div', { class: 'label' }, T('长大后，你会喜欢……|When you grow up, you\'ll fall for...')));
      var om = w.g === 'm' ? ['👨‍❤️‍👩', '👨‍❤️‍👨', '💞'] : ['👩‍❤️‍👨', '👩‍❤️‍👩', '💞'];
      b.appendChild(h('div', { class: 'ocards' }, [['het', '异性|Opposite sex', om[0]], ['gay', '同性|Same sex', om[1]], ['bi', '都可以|Anyone', om[2]]].map(function (o) {
        return h('button', { class: 'ocard' + (w.orient === o[0] ? ' on' : ''), onclick: tap(function () { w.orient = o[0]; render(); }) }, h('span', { class: 'e' }, o[2]), T(o[1]));
      })));
      b.appendChild(h('p', { style: { color: 'var(--ink2)', fontSize: '13px', marginTop: '14px' } }, T('同性能否结婚，取决于你所在国家当年的法律。|Whether same-sex couples can marry depends on your country\'s laws that year.')));
    }
    function step1(b) {
      b.appendChild(h('div', { class: 'label' }, T('国家|Country')));
      b.appendChild(h('div', { class: 'pickgrid' }, G.CLIST.map(function (c) { return h('button', { class: 'pk' + (c === w.country ? ' on' : ''), onclick: tap(function () { w.country = c; w.city = null; render(); }) }, h('span', { class: 'e' }, G.C[c].flag), T(G.C[c].n)); })));
      b.appendChild(h('div', { class: 'label' }, T('地区|Region')));
      b.appendChild(h('div', { class: 'pickgrid' }, [1, 2, 3, 4, 5].map(function (t) { return h('button', { class: 'pk' + (t === w.tier ? ' on' : ''), onclick: tap(function () { w.tier = t; w.city = null; render(); }) }, T(G.tierName(w.country, t))); })));
      b.appendChild(h('div', { class: 'label' }, T('城市|City')));
      var cs = G.C[w.country].cities[w.tier];
      b.appendChild(h('div', { class: 'pickgrid' }, [h('button', { class: 'pk' + (!w.city ? ' on' : ''), onclick: tap(function () { w.city = null; render(); }) }, h('span', { class: 'e' }, '🎲'), T('随机|Random'))].concat(cs.map(function (c) { return h('button', { class: 'pk' + (c === w.city ? ' on' : ''), onclick: tap(function () { w.city = c; render(); }) }, T(c)); }))));
    }
    var DEC_NOTE = { cn: { 1950: '经历饥荒与动荡，也见证改革开放。|Famine and upheaval, then Reform and Opening Up.', 1960: '文革中长大，可能上山下乡，1977年恢复高考。|Grow up in the Cultural Revolution, maybe be sent down, then the 1977 Gaokao.', 1970: '赶上改革开放和下海潮。|Ride the reform era and the business boom.', 1980: '独生子女一代，赶上互联网和房价上涨。|One-child generation; internet and housing boom.', 1990: '互联网原住民，高考扩招。|Digital natives; university expansion.', 2000: '移动互联网时代，内卷开始。|The mobile internet era; competition intensifies.', 2010: '短视频和AI时代。|The age of short video and AI.', 2020: '未来由你书写。|The future is yours to write.' } };
    function step2(b) {
      b.appendChild(h('div', { class: 'label' }, T('年代|Decade')));
      var decs = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];
      b.appendChild(h('div', { class: 'pickgrid' }, decs.map(function (d) { var on = Math.floor(w.by / 10) * 10 === d; return h('button', { class: 'pk' + (on ? ' on' : ''), onclick: tap(function () { w.by = d + (d === 2020 ? G.ri(0, 5) : G.ri(0, 9)); render(); }) }, h('span', { class: 'e', style: { fontSize: '20px' } }, d + 's')); })));
      b.appendChild(h('div', { class: 'label' }, T('具体年份|Exact Year')));
      b.appendChild(h('div', { class: 'slider' }, h('button', { onclick: tap(function () { w.by = Math.max(1950, w.by - 1); render(); }) }, '−'), h('div', { style: { flex: 1, textAlign: 'center', fontSize: '28px', fontFamily: 'var(--serif)', fontWeight: 700 } }, String(w.by)), h('button', { onclick: tap(function () { w.by = Math.min(2025, w.by + 1); render(); }) }, '+')));
      var note = ((G.DEC_NOTE || DEC_NOTE)[w.country] || {})[Math.floor(w.by / 10) * 10];
      b.appendChild(h('p', { style: { color: 'var(--ink2)', fontSize: '13.5px' } }, note ? T(note) : T('你会经历这个国家真实的历史大事，2025年以后的世界由随机事件书写。|You\'ll live through real historical events; the world after 2025 is shaped by random events.')));
      var hs = G.HISTORY.filter(function (x) { return (x.c === w.country || x.c === 'all') && x.y >= w.by + 4 && x.y <= Math.min(w.by + 80, 2025); }).sort(function (a, c) { return a.y - c.y; });
      if (hs.length) {
        var shown = hs.filter(function (x) { return x.c === w.country; }).concat(hs.filter(function (x) { return x.c === 'all'; })).slice(0, 8).sort(function (a, c) { return a.y - c.y; });
        b.appendChild(h('div', { class: 'label' }, T('你会亲历的大事|History you\'ll live through')));
        b.appendChild(h('div', { class: 'tline2' }, shown.map(function (x) { var t = T(x.t), cut = t.split(/[，。,.;；]/)[0]; return h('div', { class: 'ti' }, h('b', null, x.y), h('span', null, T('{a}岁 · |Age {a} · ', { a: x.y - w.by }) + cut)); })));
      }
    }
    function step3(b) {
      G.ORIGINS.filter(originOk).forEach(function (o) {
        var locked = o.vip > v;
        b.appendChild(h('button', { class: 'tal' + (w.origin === o.id ? ' on' : '') + (locked ? ' dis' : ''), style: locked ? { opacity: .5 } : null, onclick: tap(function () { if (locked) { UI.toast(G.L('需要{v}|Requires {v}', { v: G.vip.NAMES[o.vip] })); return; } w.origin = o.id; render(); }) },
          h('div', { class: 'r ' + (o.vip ? 'r3' : 'r1') }), h('div', null, h('b', null, T(o.n) + (locked ? ' 🔒 ' + T(G.vip.NAMES[o.vip]) : o.vip ? ' 💎' : '')), h('span', null, T(o.d)))));
      });
    }
    function step4(b) {
      if (v >= 2) b.appendChild(h('p', { style: { color: 'var(--ink2)', fontSize: '13.5px', marginTop: 0 } }, T(v >= 3 ? '钻石VIP：从全部天赋中任选3个。|Diamond VIP: choose any 3 talents.' : '黄金VIP：从8个天赋中选3个。|Gold VIP: choose 3 of these 8.')));
      w.pool.forEach(function (id) {
        var t = G.TALENT[id], on = w.talents.indexOf(id) >= 0;
        b.appendChild(h('button', { class: 'tal' + (w.justDrew ? ' flip' : '') + (on ? ' on' : ''), style: { animationDelay: (w.pool.indexOf(id) * 70) + 'ms' }, onclick: v >= 2 ? tap(function () { if (on) w.talents = w.talents.filter(function (x) { return x !== id; }); else if (G.talentClash(w.talents, id)) UI.toast('这个天赋和已选的天赋互相矛盾|This talent conflicts with one you picked'); else if (w.talents.length < 3) w.talents.push(id); else UI.toast('最多选3个|Pick at most 3'); render(); }) : null },
          h('div', { class: 'r ' + (t.neg ? 'rneg' : 'r' + t.r) }), h('div', null, h('b', null, T(t.n)), h('span', null, T(t.d)))));
      });
      w.justDrew = false;
      if (v < 2) b.appendChild(h('button', { class: 'big', style: { width: '100%', marginTop: '6px' }, disabled: w.rerolls <= 0 || null, onclick: tap(function () { if (w.rerolls <= 0) return; w.rerolls--; drawTalents(); w.justDrew = true; render(); }) }, T('🎲 重抽（剩{n}次）|🎲 Reroll ({n} left)', { n: w.rerolls })));
      if (v >= 3) {
        var left = 30 - G.sum(Object.keys(w.bonus), function (k) { return w.bonus[k]; });
        b.appendChild(h('div', { class: 'label' }, T('额外属性点（剩余{n}）|Bonus stat points ({n} left)', { n: left })));
        ['looks', 'smarts', 'health', 'happy', 'eq'].forEach(function (k) {
          b.appendChild(h('div', { class: 'slider' }, h('div', { class: 'k' }, T(G.STATS[k].n)),
            h('button', { onclick: tap(function () { if (w.bonus[k] > 0) { w.bonus[k] -= 5; render(); } }) }, '−'),
            h('div', { class: 'bar' }, h('i', { style: { width: (w.bonus[k] / 30 * 100) + '%' } })), h('div', { class: 'v' }, '+' + w.bonus[k]),
            h('button', { onclick: tap(function () { if (left >= 5) { w.bonus[k] += 5; render(); } }) }, '+')));
        });
      }
    }
    function step5(b) {
      var cc = G.C[w.country], org = G.ORIGIN[w.origin];
      b.appendChild(h('div', { class: 'card', style: { textAlign: 'center' } },
        h('div', { style: { fontFamily: 'var(--serif)', fontSize: '30px', fontWeight: 700, margin: '6px 0' } }, w.custom || T(w.name)),
        h('button', { class: 'big', style: { width: '100%', marginTop: '6px' }, onclick: tap(function () { w.custom = null; genName(); render(); }) }, T('🎲 换一个名字|🎲 Another name')),
        h('button', { class: 'big', style: { width: '100%', marginTop: '8px' }, onclick: tap(function () { UI.input({ title: '自己起名|Choose Your Own Name', def: w.custom || T(w.name) }).then(function (s) { if (s) { w.custom = G.T(s); render(); } }); }) }, T('✏️ 自己起名|✏️ Type a name'))));
      var dl = h('dl', { class: 'kv' });
      [['出生|Born', w.by + ' · ' + T(cc.n) + ' ' + (w.city ? T(w.city) : T(G.tierName(w.country, org.tier || w.tier)))], ['出身|Background', T(org.n)], ['天赋|Talents', w.talents.map(function (t) { return T(G.TALENT[t].n); }).join(' ')]].forEach(function (r) { dl.appendChild(h('dt', null, T(r[0]))); dl.appendChild(h('dd', null, r[1])); });
      b.appendChild(h('div', { class: 'card' }, dl));
      if (org.tier && org.tier !== w.tier) b.appendChild(h('p', { style: { color: 'var(--ink2)', fontSize: '13px' } }, T('这个出身会让你出生在{t}。|This background places your birth in the {t}.', { t: G.tierName(w.country, org.tier) })));
    }
    function born() {
      if (G.audio) { G.audio.init(); G.audio.sfx('stamp'); }
      var o = { g: w.g, orient: w.orient, country: w.country, tier: w.tier, city: w.city, by: w.by, origin: w.origin, talents: w.talents.slice(0, 3) };
      if (w.custom) o.name = w.custom + '|' + w.custom; else { o.sur = w.sur; o.giv = w.giv; }
      G.life.create(o);
      if (v >= 3) for (var k in w.bonus) G.S.p.st[k] = G.clamp(G.S.p.st[k] + w.bonus[k], 1, 100);
      G.snap = null;
      G.ach.check();
      G.save('auto');
      UI.main();
    }
    render();
  };

  /* ===================== SETTINGS ===================== */
  UI.settingsPage = function () {
    UI.sheet('设置|Settings', function (b, rec) {
      var s = G.settings;
    function seg(opts, cur, set) { return h('div', { class: 'seg' }, opts.map(function (o) { return h('button', { class: o[0] === cur ? 'on' : '', onclick: tap(function () { set(o[0]); G.saveSettings(); UI.applyTheme(); rec.refresh(); if (G.S) G.emit('change'); }) }, o[1]); })); }
      function toggle(label, key, after) { return h('button', { class: 'row', onclick: tap(function () { s[key] = !s[key]; G.saveSettings(); if (after) after(); rec.refresh(); }) }, h('div', { class: 'tx' }, h('div', { class: 't' }, T(label))), h('div', { class: 'rt' }, h('span', { class: 'chip' + (s[key] ? ' e' : '') }, s[key] ? T('开|On') : T('关|Off')))); }
      b.appendChild(h('div', { class: 'grp' }, T('语言|Language')));
      b.appendChild(seg([['zh', '简体中文'], ['tw', '繁體中文'], ['en', 'English']], G.lang, function (x) { s.lang = x; G.setLang(x); }));
      b.appendChild(h('div', { class: 'grp' }, T('外观|Appearance')));
      b.appendChild(h('div', { class: 'themes' }, UI.THEMES.map(function (t) {
        var c = t[2], d = t[3];
        var sw = h('div', { class: 'sw', style: { background: d ? 'linear-gradient(90deg,' + c[0] + ' 50%,' + d[0] + ' 50%)' : c[0] } }, h('i', { style: { background: d ? 'linear-gradient(90deg,' + c[1] + ' 50%,' + d[1] + ' 50%)' : c[1] } }));
        return h('button', { class: 'thm' + ((s.theme || 'auto') === t[0] ? ' on' : ''), onclick: tap(function () { s.theme = t[0]; G.saveSettings(); UI.applyTheme(); rec.refresh(); }) }, sw, T(t[1]));
      })));
      b.appendChild(h('div', { class: 'grp' }, T('声音与反馈|Sound & Feedback')));
      b.appendChild(toggle('背景音乐|Background music', 'music', function () { G.audio.init(); G.audio.music(s.music); }));
      b.appendChild(toggle('音效|Sound effects', 'sfx'));
      b.appendChild(toggle('震动反馈|Haptics', 'haptic'));
      b.appendChild(h('div', { class: 'grp' }, T('玩法|Gameplay')));
      b.appendChild(toggle('小游戏自动结算（不玩小游戏）|Auto-resolve mini-games', 'autoGame'));
      // AI
      var ai = s.ai = s.ai || { on: false, provider: 'deepseek', url: '', key: '', model: '' };
      b.appendChild(h('div', { class: 'grp' }, T('AI 聊天|AI Chat')));
      b.appendChild(h('p', { style: { fontSize: '13px', color: 'var(--ink2)', margin: '0 2px 8px' } }, T('填入你自己的 API Key 后，所有角色都会由真正的 AI 扮演，按照自己的性格和你聊天。Key 只保存在这台手机上。不填则使用内置的离线聊天。|Add your own API key and every character will be played by a real AI, chatting in character. The key stays on this phone only. Without it, the built-in offline chat is used.')));
      b.appendChild(h('button', { class: 'row', onclick: tap(function () { ai.on = !ai.on; G.saveSettings(); rec.refresh(); }) }, h('div', { class: 'tx' }, h('div', { class: 't' }, T('启用 AI 聊天|Enable AI chat'))), h('div', { class: 'rt' }, h('span', { class: 'chip' + (ai.on ? ' e' : '') }, ai.on ? T('开|On') : T('关|Off')))));
      var pv = Object.keys(G.chat.PROVIDERS);
      b.appendChild(h('div', { class: 'label' }, T('服务商|Provider')));
      b.appendChild(h('div', { class: 'pickgrid' }, pv.map(function (k) { return h('button', { class: 'pk' + (ai.provider === k ? ' on' : ''), onclick: tap(function () { ai.provider = k; ai.url = ''; ai.model = ''; G.saveSettings(); rec.refresh(); }) }, T(G.chat.PROVIDERS[k].n)); })));
      function field(label, key, ph, type) { var inp = h('input', { class: 'inp', type: type || 'text', value: ai[key] || '', placeholder: ph || '', autocapitalize: 'off', autocorrect: 'off', spellcheck: 'false' }); inp.addEventListener('change', function () { ai[key] = inp.value.trim(); G.saveSettings(); }); return [h('div', { class: 'label' }, T(label)), inp]; }
      var P = G.chat.PROVIDERS[ai.provider] || G.chat.PROVIDERS.custom;
      b.appendChild(h('div', null, field('API Key|API Key', 'key', 'sk-...', 'password')));
      b.appendChild(h('div', null, field('模型（留空用默认）|Model (blank = default)', 'model', P.model || 'model-name')));
      b.appendChild(h('div', null, field('接口地址（留空用默认）|Endpoint URL (blank = default)', 'url', P.url || 'https://.../v1/chat/completions')));
      b.appendChild(h('button', { class: 'big', style: { width: '100%', marginTop: '10px' }, onclick: tap(async function () {
        if (!ai.key) { UI.toast('请先填写 API Key|Enter an API key first'); return; }
        UI.toast('正在测试…|Testing…');
        try { var r = await G.native.http({ url: ai.url || P.url, headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + ai.key }, body: JSON.stringify({ model: ai.model || P.model, messages: [{ role: 'user', content: '用一句话打个招呼' }], max_tokens: 40 }) }); var j = JSON.parse(r); UI.toast(G.L('连接成功：{x}|Connected: {x}', { x: ((j.choices || [{}])[0].message || {}).content || 'OK' })); }
        catch (e) { UI.toast(G.L('连接失败：{x}|Failed: {x}', { x: String(e.message || e).slice(0, 90) })); }
      }) }, T('测试连接|Test connection')));
      b.appendChild(h('div', { class: 'grp' }, T('数据|Data')));
      b.appendChild(h('button', { class: 'row', onclick: tap(function () { UI.confirm('清除所有数据|Erase Everything', '所有存档、成就和记录都会被删除，VIP 会保留。确定吗？|All saves, achievements and records will be deleted. VIP is kept. Continue?').then(function (ok) { if (!ok) return; ['auto', '1', '2', '3', '4', '5', '6'].forEach(function (k) { G.store.del('save_' + k); }); G.store.del('meta'); G.store.del('snap'); G.loadMeta(); G.meta = { ach: {}, lives: [], stats: {} }; G.saveMeta(); UI.toast('已清除|Erased'); UI.start(); }); }) }, h('div', { class: 'ic' }, '🗑️'), h('div', { class: 'tx' }, h('div', { class: 't', style: { color: 'var(--red)' } }, T('清除所有数据|Erase all data')))));
      b.appendChild(h('p', { class: 'empty' }, 'My Life v' + G.VERSION));
    });
  };
  UI.THEMES = [['auto', '跟随系统|System', ['#a9d3f5', '#ffffff'], ['#1f2547', '#242b4a']], ['sky', '晴空|Clear Sky', ['#a9d3f5', '#ffffff']], ['sakura', '樱花|Sakura', ['#f7bccb', '#fffafb']], ['mint', '薄荷|Mint', ['#a6e0c9', '#fcfffd']], ['night', '星夜|Starry Night', ['#1f2547', '#242b4a']], ['light', '木纹手账|Wood & Paper', ['#8d5d3b', '#fbf6ea']], ['dark', '黑板|Blackboard', ['#3a281d', '#2a2420']]];
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  UI.applyTheme = function () {
    if (!G.settings.themeV) { if (G.settings.theme === 'light') G.settings.theme = 'auto'; G.settings.themeV = 2; try { G.saveSettings(); } catch (e) { } }
    var t = G.settings.theme || 'auto';
    if (t === 'auto') t = mq && mq.matches ? 'night' : 'sky';
    document.documentElement.setAttribute('data-theme', t);
    var m = document.querySelector('meta[name="theme-color"]'); if (m) m.setAttribute('content', getComputedStyle(document.documentElement).getPropertyValue('--desk2').trim() || '#86bdee');
  };
  if (mq && mq.addEventListener) mq.addEventListener('change', function () { if ((G.settings.theme || 'auto') === 'auto') UI.applyTheme(); });

  /* ===================== SAVES ===================== */
  UI.saves = function () {
    UI.sheet('存档|Saves', function (b, rec) {
      var slots = ['auto'].concat(Array.apply(null, Array(G.SLOTS())).map(function (_, i) { return String(i + 1); }));
      slots.forEach(function (k) {
        var inf = G.slotInfo(k);
        var name = k === 'auto' ? T('自动存档|Autosave') : T('存档 {n}|Slot {n}', { n: k });
        var sub = inf ? T('{n}，{a}岁，{y}年{d}|{n}, age {a}, {y}{d}', { n: inf.name, a: inf.age, y: inf.year, d: inf.dead ? T('（已故）| (deceased)') : '' }) : T('空|Empty');
        var acts = h('div', { style: { display: 'flex', gap: '6px' } });
        if (inf) acts.appendChild(h('button', { class: 'chip e', style: { padding: '6px 10px', fontSize: '13px' }, onclick: tap(function () { if (G.load(k)) { UI.closeAllSheets(); if (G.S.dead) G.ending.run(); else UI.main(); } }) }, T('读取|Load')));
        if (G.S && !G.S.dead && k !== 'auto') acts.appendChild(h('button', { class: 'chip m', style: { padding: '6px 10px', fontSize: '13px' }, onclick: tap(function () { G.save(k); UI.toast('已保存|Saved'); rec.refresh(); }) }, T('保存|Save')));
        b.appendChild(h('div', { class: 'row' }, h('div', { class: 'ic' }, k === 'auto' ? '⏱️' : '💾'), h('div', { class: 'tx' }, h('div', { class: 't' }, name), h('div', { class: 's' }, sub)), acts));
      });
      if (G.vip.tier() < 3) b.appendChild(h('p', { class: 'empty' }, T('钻石VIP可解锁6个存档位。|Diamond VIP unlocks 6 save slots.')));
    });
  };

  /* ===================== ACHIEVEMENTS ===================== */
  UI.achievements = function () {
    UI.sheet('成就|Achievements', function (b) {
      var M = G.meta.ach, got = G.ACH.filter(function (a) { return M[a.id]; }).length;
      b.appendChild(h('div', { class: 'card', style: { textAlign: 'center' } }, h('div', { style: { fontFamily: 'var(--serif)', fontSize: '28px', fontWeight: 700 } }, got + ' / ' + G.ACH.length), h('div', { class: 'pbar' }, h('i', { style: { width: (got / G.ACH.length * 100) + '%' } }))));
      G.ACH.forEach(function (a) {
        var on = !!M[a.id];
        b.appendChild(h('div', { class: 'row' + (on ? '' : ' dis') }, h('div', { class: 'ic' }, on ? a.i : '❔'), h('div', { class: 'tx' }, h('div', { class: 't' }, T(a.n)), h('div', { class: 's wrap' }, T(a.d)))));
      });
    });
  };

  /* ===================== HALL OF FAME ===================== */
  UI.records = function () {
    UI.sheet('名人堂|Hall of Fame', function (b) {
      var L = G.meta.lives || [];
      if (!L.length) { b.appendChild(h('div', { class: 'empty' }, T('还没有完成的人生。去活一次吧。|No finished lives yet. Go live one.'))); return; }
      L.forEach(function (r, i) {
        b.appendChild(h('div', { class: 'row' }, h('div', { class: 'ic', style: { fontFamily: 'var(--serif)', fontWeight: 700, color: i < 3 ? 'var(--red)' : 'var(--ink3)' } }, String(i + 1)),
          h('div', { class: 'tx' }, h('div', { class: 't' }, T(r.name), h('span', { class: 'chip tag' }, T(r.title))), h('div', { class: 's' }, (G.C[r.c] ? G.C[r.c].flag + ' ' : '') + r.by + '–' + r.dy + ' · ' + T('{a}岁|age {a}', { a: r.age }) + (r.gen > 1 ? T(' · 第{g}代| · gen {g}', { g: r.gen }) : ''))),
          h('div', { class: 'rt' }, h('b', { class: 'redpen', style: { fontSize: '22px' } }, r.grade), h('span', null, r.score))));
      });
    });
  };

  /* ===================== VIP ===================== */
  UI.vipPage = function () {
    UI.sheet('VIP|VIP', function (b, rec) {
      var v = G.vip.tier();
      b.appendChild(h('div', { class: 'card', style: { textAlign: 'center' } }, h('div', { style: { fontSize: '40px' } }, ['🎫', '🥈', '🥇', '💎'][v]), h('div', { style: { fontFamily: 'var(--serif)', fontSize: '22px', fontWeight: 700 } }, v ? T(G.vip.NAMES[v]) : T('普通玩家|Standard Player'))));
      var inp = h('input', { class: 'inp', placeholder: 'ML-XXXX-XXXX-XXXX', autocapitalize: 'characters', autocorrect: 'off', spellcheck: 'false' });
      b.appendChild(h('div', { class: 'label' }, T('输入兑换码|Enter a code')));
      b.appendChild(inp);
      b.appendChild(h('button', { class: 'big solid', style: { width: '100%', marginTop: '10px' }, onclick: tap(function () {
        var r = G.vip.redeem(inp.value);
        if (r.ok) { G.audio && G.audio.sfx('win'); G.native.haptic('success'); UI.toast(G.L('兑换成功！你现在是{v}。|Redeemed! You are now {v}.', { v: G.vip.NAMES[r.t] })); if (G.S) { G.S.p.emax = G.emax(); G.ach.check(); } rec.refresh(); }
        else { G.audio && G.audio.sfx('bad'); UI.toast(r.msg); }
      }) }, T('兑换|Redeem')));
      [1, 2, 3].forEach(function (t) {
        b.appendChild(h('div', { class: 'grp' }, T(G.vip.NAMES[t]) + (v >= t ? ' ✓' : '')));
        G.vip.PERKS.filter(function (x) { return x.t === t; }).forEach(function (x) { b.appendChild(h('div', { class: 'row' + (v >= t ? '' : ' dis') }, h('div', { class: 'ic' }, v >= t ? '✅' : '🔒'), h('div', { class: 'tx' }, h('div', { class: 's wrap', style: { color: 'var(--ink)', fontSize: '14px' } }, T(x.n))))); });
      });
      b.appendChild(h('p', { class: 'empty' }, T('每一级包含前面所有等级的特权。|Each tier includes all perks of the tiers below.')));
    });
  };

  /* ===================== ENDING (report card) ===================== */
  UI.ending = function (d) {
    UI.closeAllSheets();
    if (G.audio) G.audio.sfx('bell');
    var b = h('div', { class: 'sb', style: { flex: 1, overflowY: 'auto', padding: 'calc(var(--safe-t) + 16px) 14px calc(var(--safe-b) + 24px)' } });
    var rep = h('div', { class: 'report' },
      h('h2', null, T('人生成绩单|Life Report Card')),
      h('div', { class: 'sub' }, T(d.name) + '\n' + d.by + '–' + d.dy + '  ' + T('享年{a}岁|aged {a}', { a: d.age })),
      h('div', { class: 'gstamp' }, d.grade),
      h('div', { class: 'title2' }, T(d.title)),
      h('div', { style: { textAlign: 'center', fontSize: '14px', color: 'var(--ink2)' } }, T(d.td)),
      h('div', { style: { textAlign: 'center', fontSize: '13px', color: 'var(--red)', marginTop: '6px' } }, T(d.cause)),
      h('div', { class: 'epi' }, '“' + T(d.epitaph) + '”'),
      h('table', { class: 'scoretbl' }, d.parts.map(function (x) { return h('tr', null, h('td', null, T(x.k)), h('td', null, (x.v > 0 ? '+' : '') + x.v)); }).concat([h('tr', null, h('td', null, h('b', null, T('总分|Total'))), h('td', { class: 'redpen', style: { fontSize: '18px' } }, String(d.score)))])));
    b.appendChild(rep);
    var fn = d.funeral.map(function (f) { return T(f.rel) + ' ' + T(f.name); }).join('、');
    b.appendChild(h('div', { class: 'card' }, h('h5', null, T('葬礼|Funeral')), h('div', { style: { fontSize: '14px' } },
      T('共有{n}人前来送别。|{n} people came to say goodbye.', { n: d.funeralN }) + (fn ? ' ' + T('其中有：|Among them: ') + fn + '。' : '') + (d.fans ? ' ' + T('另有约{f}名粉丝在网上悼念。|About {f} fans mourned online.', { f: d.fans.toLocaleString() }) : ''))));
    var es = d.estate, esRows = [];
    if (es && es.total > 0) {
      if (es.tax) esRows.push(h('div', { class: 'esl' }, h('span', null, T('遗产税|Inheritance tax')), h('b', null, '−' + G.fm(es.tax))));
      if (es.charity) esRows.push(h('div', { class: 'esl' }, h('span', null, T('捐给慈善|To charity')), h('b', null, G.fm(es.charity))));
      es.lines.forEach(function (l) {
        var extra = (l.houses && l.houses.length ? ' 🏠' + l.houses.map(function (x) { return T(x); }).join('、') : '') + (l.company ? ' 🏢' + T('公司|Company') : '');
        esRows.push(h('div', { class: 'esl' }, h('span', null, T(l.rel) + ' ' + T(l.name) + ' · ' + l.pct + '%' + extra), h('b', null, G.fm(l.amt))));
      });
      if (es.dispute) esRows.push(h('div', { class: 'esd' }, '⚖️ ' + T(es.dispute.won ? '{a}不服遗嘱，把{b}告上了法庭，最后赢回了一部分遗产。兄弟姐妹从此反目。|{a} contested the will, sued {b}, and won back part of the estate. The family never reconciled.' : '{a}不服遗嘱，把{b}告上了法庭，却输了官司。一家人从此形同陌路。|{a} contested the will and sued {b} — and lost. The family drifted apart for good.', { a: es.dispute.an, b: es.dispute.bn })));
      else if (es.lines.length > 1) esRows.push(h('div', { class: 'esd ok' }, '🕊️ ' + T('遗产分配顺利，没有人起争执。|The estate was divided peacefully.')));
    }
    b.appendChild(h('div', { class: 'card' }, h('h5', null, T('遗产|Estate')), h('div', { class: 'money ' + (d.nw < 0 ? 'neg' : ''), style: { fontSize: '18px', display: 'inline-block' } }, G.fm(d.nw)), esRows.length ? h('div', { class: 'estl' }, esRows) : null));
    if (d.timeline.length) b.appendChild(h('div', { class: 'card' }, h('h5', null, T('大事年表|Timeline')), h('ul', { class: 'tl' }, d.timeline.slice(-40).map(function (x) { return h('li', null, h('b', null, T('{a}岁|{a}', { a: x.a })), h('span', null, T(x.t))); }))));
    var btns = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '6px' } });
    if (d.heirs.length) btns.appendChild(h('button', { class: 'big solid', onclick: tap(async function () {
      var i = d.heirs.length === 1 ? 0 : await UI.pick({ title: '选择继承人|Choose an Heir', items: d.heirs.map(function (k) { return { t: k.name, sub: T('{a}岁|age {a}', { a: k.age }), npc: G.S.npcs[k.id] }; }) });
      if (i < 0) return;
      var kid = G.S.npcs[d.heirs[i].id]; if (!kid) return;
      G.life.continueAs(kid); G.snap = null; G.save('auto'); UI.main();
    }) }, T('以子女身份继续人生|Continue as Your Child')));
    if (G.canRewind()) btns.appendChild(h('button', { class: 'big', onclick: tap(function () { if (G.rewind()) { UI.toast('时光倒流！|Time rewinds!'); UI.main(); } }) }, T('⏳ 时光倒流（VIP）|⏳ Rewind Time (VIP)')));
    btns.appendChild(h('button', { class: 'big', onclick: tap(function () { UI.wizard(); }) }, T('开始新的人生|Start a New Life')));
    btns.appendChild(h('button', { class: 'big', onclick: tap(function () { UI.start(); }) }, T('回到首页|Home')));
    b.appendChild(btns);
    UI.screen(h('div', { class: 'grid-paper', style: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' } }, b));
    var st = rep.querySelector('.gstamp'); st.animate && st.animate([{ transform: 'rotate(14deg) scale(2.2)', opacity: 0 }, { transform: 'rotate(14deg) scale(1)', opacity: .9 }], { duration: 420, easing: 'cubic-bezier(.2,.8,.2,1)', delay: 300, fill: 'backwards' });
    return Promise.resolve();
  };
})();
