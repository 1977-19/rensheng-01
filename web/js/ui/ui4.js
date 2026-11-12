/* The graveyard (dark), the family tree, premium options in gold, scrollable pickers,
   one school choice for children of the same age, simpler naming, more confirmations. */
(function () {
  'use strict';
  var h = G.h, UI = G.UI, T = UI.T, tap = UI.tap, N = G.N;

  /* ---------------- premium choices shine gold ---------------- */
  var PREM = /国际|私立|贵族|顶级|顶尖|最好的|保姆|富养|私人医院|特需|名校|捐资|留学|寄宿|VIP|International|Private|Elite|Top|best|nanny|Lavish|Boarding|Donat|abroad|Abroad/;
  UI.isPrem = function (t) { return PREM.test(String(t || '')); };
  var obs = new MutationObserver(function (ms) {
    ms.forEach(function (m) { m.addedNodes.forEach(function (n) {
      if (!n.querySelectorAll) return;
      n.querySelectorAll('.veil .opt:not(.solid), .veil .row').forEach(function (b) { if (!b._pm && UI.isPrem(b.textContent)) { b._pm = 1; b.classList.add('prem'); } });
    }); });
  });
  try { obs.observe(document.body, { childList: true, subtree: true }); } catch (e) { }

  /* ---------------- more big decisions ask twice ---------------- */
  Object.assign(UI.BIG, {
    quit: '辞职以后这份工作就没了。确定吗？|Quit and this job is gone. Are you sure?',
    retire: '退休以后就不能回到这个岗位了。确定吗？|Once retired, you can\'t return to this post. Are you sure?',
    kdisown: '确定要和{n}断绝关系吗？|Are you sure you want to disown {n}?',
    propose: '确定要向{n}求婚吗？|Are you sure you want to propose to {n}?',
    adopt: '领养一个孩子是一辈子的责任。确定吗？|Adopting a child is a lifelong commitment. Are you sure?'
  });

  /* ---------------- naming: a few simple families of names ---------------- */
  var GEN = ['嘉|Jia', '子|Zi', '思|Si', '若|Ruo', '一|Yi', '星|Xing', '安|An', '明|Ming', '知|Zhi', '景|Jing', '承|Cheng', '予|Yu'];
  var M2 = ['航|hang', '宇|yu', '川|chuan', '辰|chen', '然|ran', '杰|jie', '远|yuan', '泽|ze', '言|yan', '屹|yi', '涛|tao', '朗|lang'];
  var F2 = ['宁|ning', '悦|yue', '彤|tong', '瑶|yao', '溪|xi', '禾|he', '桐|tong', '语|yu', '欣|xin', '玥|yue', '晴|qing', '楠|nan'];
  function zh(x) { return x.split('|')[0]; } function en(x) { return x.split('|')[1]; }
  G.nameGroups = function (cul, sur, g, by, sibs) {
    if (cul !== 'cn') { var L = G.nameSeries ? G.nameSeries(cul, sur, g, by, sibs) : []; return [{ label: G.L('推荐|Suggestions'), names: L.slice(0, 6) }]; }
    var second = g === 'f' ? F2 : M2, gens = [];
    (sibs || []).forEach(function (n) { var z = String(n.giv || n.name || '').split('|')[0]; if (z.length >= 2) { var ch = z.length === 3 ? z[1] : z[0]; GEN.forEach(function (x) { if (zh(x) === ch && gens.indexOf(x) < 0) gens.push(x); }); } });
    G.shuffle(GEN.slice()).forEach(function (x) { if (gens.length < 3 && gens.indexOf(x) < 0) gens.push(x); });
    var surZ = String(sur).split('|')[0], out = [];
    gens.slice(0, 3).forEach(function (a) {
      var picks = G.shuffle(second.slice()).slice(0, 3);
      out.push({ label: G.L('“{s}{a}”字辈|The "{a}" series', { s: surZ, a: zh(a) }), names: picks.map(function (b) { return G.mkName(cul, sur, zh(a) + zh(b) + '|' + en(a) + en(b), g); }) });
    });
    out.push({ label: G.L('单字名|Single-character names'), names: G.shuffle(second.slice()).slice(0, 4).map(function (b) { return G.mkName(cul, sur, zh(b) + '|' + en(b).charAt(0).toUpperCase() + en(b).slice(1), g); }) });
    return out;
  };
  var input0 = UI.input;
  UI.input = function (o) {
    if (!o.groups && !(o.sug && o.require)) return input0.apply(this, arguments);
    var groups = o.groups || [{ label: '', names: o.sug }];
    return new Promise(function (res) {
      var chosen = null, inp = h('input', { class: 'inp', value: T(o.def || ''), maxlength: 24, placeholder: T('写一个名字，或点下面的推荐|Type a name, or tap a suggestion') });
      var body = h('div', null, o.text ? h('div', { class: 'txt', style: { marginBottom: '10px' } }, T(o.text)) : null, inp,
        groups.map(function (gp) { return h('div', { class: 'ngrp' }, gp.label ? h('div', { class: 'nlab' }, T(gp.label)) : null, h('div', { class: 'sugs' }, gp.names.map(function (s) { return h('button', { class: 'sug', onclick: tap(function () { chosen = s; inp.value = T(s); }) }, T(s)); }))); }));
      var md = UI.modal({ title: o.title, body: body, foot: [h('button', { class: 'opt solid', onclick: tap(function () {
        var v = inp.value.replace(/\|/g, '').trim();
        if (!v && o.require) { UI.toast(T(o.require)); inp.focus(); return; }
        md.close(); res(!v ? null : chosen && T(chosen) === v ? chosen : v + '|' + v);
      }) }, T('确定|Confirm'))] });
    });
  };

  /* ---------------- one decision for all children of the same age ---------------- */
  ['k_pick_school', 'k_pick_uni'].forEach(function (id) {
    var d = G.EV[id]; if (!d || !d.o) return;
    var p0 = d.prep;
    d.prep = function (c) { if (c.npc && c.npc['_dec' + G.S.year]) return false; return p0 ? p0.apply(this, arguments) : true; };
    d.o.forEach(function (o) {
      var r0 = o.run; if (!r0) return;
      o.run = async function (c) {
        var k = c.npc, out = await r0.apply(this, arguments);
        if (!k) return out;
        k['_dec' + G.S.year] = 1;
        var age = N.age(k), mates = N.rel('child').filter(function (x) { return x !== k && x.alive && N.age(x) === age && !x['_dec' + G.S.year] && (id !== 'k_pick_school' || x['pk' + age]); });
        if (mates.length && !G.settings.autoGame && await UI.confirm(G.L('同岁的孩子|Children of the Same Age'), G.L('{l}和{n}同岁。也给他们做一样的安排吗？|{l} are the same age as {n}. Make the same arrangement for them?', { l: mates.map(function (x) { return T(x.name); }).join('、'), n: k.name }))) {
          for (var i = 0; i < mates.length; i++) { var m = mates[i]; m['_dec' + G.S.year] = 1; try { var c2 = G.ctx(Object.assign({}, c.prm), m.id); if (d.prep) { m['_dec' + G.S.year] = 0; if (p0 && p0(c2) === false) { m['_dec' + G.S.year] = 1; continue; } m['_dec' + G.S.year] = 1; } await r0.call(o, c2); } catch (e) { } }
          out = (out ? G.L(out, c.prm) + '\n' : '') + G.L('{l}也做了一样的安排。|{l} got the same arrangement.', { l: mates.map(function (x) { return T(x.name); }).join('、') });
        }
        return out;
      };
    });
  });

  /* ---------------- the graveyard ---------------- */
  UI.graves = function () {
    if (!G.S) return;
    UI.sheet('墓园|The Cemetery', function (b, rec) {
      var sh = b.closest('.sheet'); if (sh) sh.classList.add('mourn');
      var L = G.graves ? G.graves() : [];
      if (!L.length) { b.appendChild(h('div', { class: 'empty' }, T('这里还很安静。愿你在乎的人都长命百岁。|It is quiet here. May everyone you love live long.'))); return; }
      b.appendChild(h('p', { class: 'hint' }, T('点一块墓碑，去看看。|Tap a headstone to visit.')));
      var grid = h('div', { class: 'tombs' });
      L.forEach(function (n) {
        grid.appendChild(h('button', { class: 'tomb', onclick: tap(function () { UI.grave(n, function () { rec.refresh(); }); }) },
          h('div', { class: 'tav', html: G.avatarOf(n) }), h('b', null, T(n.name)), h('span', null, T(N.relName(n))), h('small', null, (n.by || '?') + ' – ' + (n.died || '?'))));
      });
      b.appendChild(grid);
    });
  };
  UI.grave = function (n, done) {
    UI.sheet(T(n.name), function (b, rec) {
      var sh = b.closest('.sheet'); if (sh) sh.classList.add('mourn');
      var age = (n.died || G.S.year) - (n.by || G.S.year);
      b.appendChild(h('div', { class: 'stone' },
        h('div', { class: 'sav', html: G.avatarOf(n) }),
        h('b', null, T(n.name)),
        h('div', { class: 'sy' }, (n.by || '?') + ' – ' + (n.died || '?') + ' · ' + T('享年{a}岁|Aged {a}', { a: Math.max(0, age) })),
        h('div', { class: 'sr' }, T(N.relName(n))),
        h('div', { class: 'sc' }, T('死因：|Cause of death: ') + T(n.cause || '不详|Unknown')),
        n.flowers ? h('div', { class: 'sf' }, '💐 × ' + n.flowers) : null));
      function act(t, fn) { return h('button', { class: 'gact', onclick: tap(fn) }, T(t)); }
      b.appendChild(h('div', { class: 'gacts' },
        act('💐 献上一束花|💐 Lay flowers', function () { n.flowers = (n.flowers || 0) + 1; G.addStat('happy', 2); G.addStat('karma', 1, true); UI.toast(G.L('你把花放在了碑前。|You laid the flowers by the stone.')); rec.refresh(); }),
        act('🗣️ 说说这些年的事|🗣️ Tell them about these years', async function () {
          var i = await UI.pick({ title: G.L('想对{n}说些什么？|What will you tell {n}?', { n: n.name }), items: [
            { t: G.L('家里一切都好|Everyone at home is well') }, { t: G.L('我很想你|I miss you so much') }, { t: G.L('对不起，那时候没能陪着你|I\'m sorry I wasn\'t there') }, { t: G.L('我过得很好，你放心|I\'m doing well — don\'t worry') }] });
          if (i < 0) return;
          G.addStat('happy', i === 1 || i === 2 ? -1 : 2); G.addStat('eq', 1, true);
          await G.result(G.L('墓前|At the Grave'), G.pick(['风吹过墓园，像是有人轻轻应了一声。|A breeze passed through the cemetery, like a soft reply.', '你说完了，心里轻了一些。|When you finished, your heart felt a little lighter.', '一只鸟落在碑上，看了你一会儿，飞走了。|A bird landed on the stone, looked at you a while, and flew off.']), null, null, '🕯️');
        }),
        act('🧹 清扫墓碑|🧹 Clean the headstone', function () { G.addStat('karma', 1, true); G.addStat('happy', 1); UI.toast(G.L('你擦净了碑上的字。|You wiped the lettering clean.')); })));
      if (n.story && n.story.length) b.appendChild(h('div', { class: 'card gstory' }, h('h5', null, T('生平|Their life')), h('ul', { class: 'tl' }, n.story.map(function (x) { return h('li', null, h('b', null, String(x[0])), h('span', null, T(x[1]))); }))));
    }, { onClose: done });
  };

  /* ---------------- the family tree ---------------- */
  UI.familyTree = function () {
    if (!G.S) return;
    UI.sheet('家族谱系|Family Tree', function (b) {
      var S = G.S, L = (S.lineage || []).slice(), p = S.p;
      var done = G.megaDone ? G.megaDone() : 0;
      b.appendChild(h('div', { class: 'card fam' }, h('h5', null, T('家族功业|Family Achievements')),
        h('div', null, T('传承{g}代 · 建成百亿项目{m}项|{g} generations · {m} mega projects completed', { g: S.gen || 1, m: done })),
        done ? h('div', { class: 'megal' }, Object.keys(S.legacy.mega).map(function (id) { var m = (G.MEGA || []).filter(function (x) { return x.id === id; })[0]; return m ? h('span', { class: 'chip tag' }, m.i + ' ' + T(m.n)) : null; })) : null));
      L.forEach(function (r, i) {
        var gen = r.gen || (i + 1);
        b.appendChild(h('button', { class: 'row anc', onclick: tap(function () { if (UI.lifeStory) UI.lifeStory(Object.assign({ c: p.country, gen: gen, age: (r.dy || 0) - (r.by || 0), grade: r.grade || '', score: r.score || 0 }, r)); }) },
          h('div', { class: 'ic gen' }, T('第{g}代|Gen {g}', { g: gen })),
          h('div', { class: 'tx' }, h('div', { class: 't' }, T(r.name), r.title ? h('span', { class: 'chip tag' }, T(r.title)) : null),
            h('div', { class: 's' }, (r.by || '?') + '–' + (r.dy || '?') + (r.cause ? ' · ' + T(r.cause) : '') + (r.nw != null ? ' · ' + T('遗产|Estate ') + (r.cur || '') + Math.round(r.nw).toLocaleString() : '')),
            r.ep ? h('div', { class: 's', style: { fontStyle: 'italic' } }, '“' + T(r.ep) + '”') : null)));
      });
      b.appendChild(h('div', { class: 'row anc me' }, h('div', { class: 'ic gen' }, T('第{g}代|Gen {g}', { g: S.gen || 1 })), h('div', { class: 'tx' }, h('div', { class: 't' }, T(p.name), h('span', { class: 'chip tag' }, T('你|You'))), h('div', { class: 's' }, p.birthYear + '– · ' + T(G.title())))));
    });
  };
})();
