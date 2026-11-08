/* Crime, trials, prison, gangs */
(function () {
  'use strict';
  var CM = G.crime = {};
  /* strip status on conviction */
  CM.jail = function (yrs, why) {
    var p = G.S.p;
    if (p.job) G.career.leave(); p.fc = null;
    if (p.gov) { p.gov = null; } if (p.pol) p.pol = null; if (p.mil) p.mil = null;
    if (G.school.inSchool()) p.edu.stage = 'none';
    p.jail = { left: yrs, tot: yrs, why: why, beh: 50, yrs: 0 };
    p.crime.rec++; p.h.heat = 0;
    G.major('因{w}入狱{y}年|Sentenced to {y} years for {w}', { w: why, y: yrs });
    G.inc('jail'); G.inc('jailYrs', yrs);
    for (var i = 0; i < 2; i++) G.N.make({ rel: 'inmate', g: p.g, age: G.ri(20, 55), job: '囚犯|Inmate', inc: 0, pers: G.pick(['boss', 'rebel', 'sharp', 'scheme', 'honest']) });
  };
  /* arrest + trial. returns result string */
  CM.arrest = async function (c, why, base) {
    var p = G.S.p;
    if (p.age < 14) { G.addStat('happy', -5); G.N.rel('father', 'mother').forEach(function (n) { G.N.addAff(n, -10); }); return '你被抓住了，但因为年纪太小，警察把你交给了父母，挨了一顿狠揍。|You were caught, but you were too young to charge. The police handed you to your parents — you got a hiding.'; }
    var juv = p.age < 18;
    var opts = [
      { t: G.L('请律师辩护（{m}）|Hire a lawyer ({m})', { m: G.M(G.$(8000 * Math.max(1, base / 2))) }) },
      { t: G.L('认罪认罚|Plead guilty') },
      { t: G.L('当庭抗辩|Fight it in court') },
      { t: G.L('偷偷贿赂法官|Secretly bribe the judge') }
    ];
    var i = await G.UI.event({ title: G.L('法庭审判|Trial'), text: G.L('你因涉嫌{w}被捕，即将受审。|You were arrested for {w} and now face trial.', { w: why }), opts: opts, icon: '⚖️' });
    var yrs = base, msg = '';
    if (i === 0) { var fee = G.$(8000 * Math.max(1, base / 2)); if (G.pay(fee)) { yrs = G.ch(.25) ? 0 : Math.round(base * G.rf(.3, .7)); } else msg = G.L('你请不起律师。|You couldn\'t afford a lawyer.'); }
    else if (i === 1) yrs = Math.round(base * .65);
    else if (i === 2) yrs = G.ch(.2 + p.st.smarts / 500) ? 0 : Math.round(base * 1.3);
    else { var b = G.$(20000 * base); if (G.pay(b) && G.ch(.45)) yrs = 0; else { yrs = Math.round(base * 1.5) + 2; msg = G.L('行贿被识破，罪加一等！|The bribe was exposed — extra charges!'); } }
    if (juv) yrs = Math.min(yrs, 3);
    yrs = Math.max(0, Math.round(yrs));
    if (!yrs) { p.crime.rec++; p.h.heat = Math.max(0, p.h.heat - 30); return G.L('{m}你被判无罪/缓刑，当庭释放！|{m}You were acquitted / given probation and walked free!', { m: msg ? msg + ' ' : '' }); }
    CM.jail(yrs, why);
    G.addStat('happy', -20);
    return G.L('{m}你被判处{y}年有期徒刑。|{m}You were sentenced to {y} years in prison.', { m: msg ? msg + ' ' : '', y: yrs });
  };
  CM.tick = function (Q) {
    var S = G.S, p = S.p;
    if (p.jail) {
      var j = p.jail; j.left--; j.yrs++;
      if (j.left <= 0) { Q.push({ id: 'sys_release' }); return; }
      if (j.beh >= 75 && j.yrs >= j.tot / 2 && G.ch(.35)) Q.push({ id: 'sys_parole' });
      return;
    }
    if (p.h.heat > 0) p.h.heat = Math.max(0, p.h.heat - (p.gang ? 4 : 10));
    if (p.h.heat > 35 && G.ch(p.h.heat / 260)) Q.push({ id: p.gang && p.gang.rank >= 2 ? 'sys_gang_raid' : 'sys_caught' });
  };

  /* petty crimes, used by actions */
  CM.LIST = [
    { id: 'shoplift', n: '顺手牵羊|Shoplift', a: 8, ok: .75, gain: 60, heat: 5, yrs: 1, i: '🛒' },
    { id: 'pick', n: '扒窃|Pickpocket', a: 12, ok: .6, gain: 250, heat: 8, yrs: 1, i: '👛' },
    { id: 'fight', n: '打架斗殴|Street Fight', a: 12, ok: .55, gain: 0, heat: 6, yrs: 1, i: '👊', game: 'fight' },
    { id: 'burgle', n: '入室盗窃|Burglary', a: 15, ok: .5, gain: 3000, heat: 15, yrs: 3, i: '🏚️' },
    { id: 'scam', n: '电信诈骗|Phone Scam', a: 16, ok: .55, gain: 12000, heat: 20, yrs: 5, i: '📞', req: { eq: 50 }, y0: 1995 },
    { id: 'hack', n: '黑客入侵|Hacking', a: 15, ok: .5, gain: 60000, heat: 22, yrs: 6, i: '💻', req: { smarts: 70 }, y0: 1995 },
    { id: 'rob', n: '持械抢劫|Armed Robbery', a: 16, ok: .5, gain: 9000, heat: 28, yrs: 7, i: '🔫', game: 'fight' },
    { id: 'car', n: '偷车|Steal a Car', a: 16, ok: .45, gain: 15000, heat: 20, yrs: 4, i: '🚗', game: 'driving' },
    { id: 'tax', n: '偷税漏税|Tax Evasion', a: 18, ok: .6, gain: 0, heat: 18, yrs: 3, i: '🧾', biz: 1 },
    { id: 'heist', n: '抢劫银行|Bank Heist', a: 18, ok: .25, gain: 600000, heat: 60, yrs: 15, i: '🏦', game: 'driving' }
  ];
  CM.commit = async function (cr) {
    var S = G.S, p = S.p, ok = cr.ok;
    if (cr.req) for (var k in cr.req) if (p.st[k] < cr.req[k]) ok -= .25;
    if (G.has('ruthless')) ok += .08;
    if (cr.id === 'hack' && G.has('hacker')) ok += .25;
    ok += G.stat('luck') / 200;
    var r = null;
    if (cr.game) { r = await G.UI.game(cr.game, { name: cr.n }); ok = ok * .5 + r.score * .6; }
    G.dStart();
    G.inc('crimes');
    if (G.has('justice')) G.addStat('happy', -6);
    G.addStat('karma', -Math.max(2, Math.round(cr.heat / 4)));
    var text;
    if (G.ch(ok)) {
      var gain = cr.gain ? Math.round(G.$(cr.gain) * G.rf(.5, 1.5)) : 0;
      if (cr.id === 'tax') gain = Math.round(Math.max(G.netWorth() * .05, G.$(5000)));
      if (gain) G.addMoney(gain);
      G.addStat('heat', cr.heat);
      if (cr.id === 'fight') { G.addStat('rep', 5); G.addStat('health', -3); }
      G.addStat('happy', 3);
      text = gain ? G.L('得手了！你弄到了{m}。|Success! You got {m}.', { m: G.M(gain) }) : G.L('你赢了这一架。|You won the fight.');
      var dl = G.dEnd();
      if (cr.id === 'heist') G.inc('heist');
      return G.result(cr.n, text, null, dl, cr.i);
    }
    G.dEnd();
    if (G.ch(.7)) {
      var t = await CM.arrest(G.ctx(), cr.n, cr.yrs);
      return G.result(cr.n, G.join([G.L('失手被抓了！|You got caught!'), t], ' ', ' '), null, [], cr.i);
    }
    G.addStat('heat', Math.round(cr.heat / 2));
    return G.result(cr.n, '失手了，但你成功逃脱。|It went wrong, but you got away.', null, [], cr.i);
  };

  /* ---------- gangs ---------- */
  var GA = G.gang = {};
  GA.can = function () { var p = G.S.p; return p.age >= 15 && !p.pol && !p.mil && !p.gov && !p.jail && !p.gang; };
  GA.join = function (name) {
    var p = G.S.p;
    p.gang = { name: name || p.flags.mafiaName || G.pick(G.GANG.names), rank: p.flags.mafiafam ? 2 : 0, rep: p.flags.mafiafam ? 30 : 0, yrs: 0, yr: 0 };
    G.addStat('heat', 5); G.addStat('karma', -5);
    for (var i = 0; i < 2; i++) G.N.make({ rel: 'gang', g: G.ch(.85) ? 'm' : 'f', age: G.clamp(p.age + G.ri(-3, 10), 16, 50), job: G.L('{g}成员|{g} member', { g: p.gang.name }), inc: G.$w(15000), pers: G.pick(['boss', 'rebel', 'sharp', 'scheme', 'honest', 'cheer']) });
    G.major('加入了{g}|Joined {g}', { g: p.gang.name });
    G.inc('gang');
  };
  GA.income = function () { var g = G.S.p.gang; return g ? Math.round(G.$w(G.GANG.pay[g.rank]) * G.rf(.6, 1.4)) : 0; };
  GA.tick = function (Q) {
    var p = G.S.p, g = p.gang; if (!g || p.jail) return;
    g.yrs++; g.yr++;
    g.rep += G.ri(2, 8) + (G.has('ruthless') ? 3 : 0);
    G.addStat('heat', 3 + g.rank * 3, true);
    if (g.rank < 4 && g.yr >= 1 && g.rep >= 15 + g.rank * 22) Q.push({ id: 'sys_gang_test' });
    else if (g.rank === 4 && g.rep >= 120 && g.yr >= 2) Q.push({ id: 'sys_gang_boss' });
    if (G.ch(.18 + g.rank * .04)) Q.push({ id: 'sys_gang_war' });
  };
  GA.promote = function (n) { var g = G.S.p.gang; g.rank = Math.min(5, g.rank + (n || 1)); g.yr = 0; var r = G.GANG.r[g.rank]; G.major('成为{g}{r}|Became {r} of {g}', { g: g.name, r: r }); if (g.rank === 5) { G.inc('godfather'); G.addStat('fame', 10); } return r; };
  GA.leave = function () { var p = G.S.p; G.major('退出{g}|Left {g}', { g: p.gang.name }); p.gang = null; G.N.rel('gang').forEach(function (n) { n.rel = n.aff > 50 ? 'friend' : 'enemy'; }); };

  G.evs([
    { id: 'sys_caught', sys: 1, title: '东窗事发|The Law Catches Up', icon: '🚓', bad: 1,
      t: '警察敲响了你的门——你之前干的事被查到了。|The police knock on your door — your past deeds have caught up with you.',
      o: [
        { t: '跟他们走|Go quietly', run: function (c) { return CM.arrest(c, '前科累累|Multiple offenses', Math.max(1, Math.round(c.p.h.heat / 15))); } },
        { t: '翻窗逃跑|Climb out the window', run: async function (c) { var r = await c.game('sprint', { name: '逃跑|Escape' }); if (r.score > .55) { c.add('heat', -10); return '你成功逃脱了！但警察还在找你。|You escaped! But the police are still looking.'; } return CM.arrest(c, '拒捕|Resisting arrest', Math.max(2, Math.round(c.p.h.heat / 12))); } }
      ] },
    { id: 'sys_release', sys: 1, title: '刑满释放|Released', icon: '🚪',
      t: '刑满释放，你终于走出了监狱大门，外面的阳光有点刺眼。|Your sentence is over. You walk out the prison gates, squinting at the sunlight.',
      run: function (c) { c.p.jail = null; c.add('happy', 15); if (c.p.gang && c.p.gang.pend) { GA.promote(c.p.gang.pend); c.p.gang.pend = 0; } G.N.rel('inmate').forEach(function (n) { if (n.aff > 40) n.rel = 'friend'; }); G.major('出狱|Released from prison'); } },
    { id: 'sys_parole', sys: 1, title: '假释|Parole', icon: '📄',
      t: '你在狱中表现良好，获得了提前假释的机会。|Thanks to good behavior, you are offered early parole.',
      run: function (c) { c.p.jail = null; c.add('happy', 18); G.major('假释出狱|Paroled'); return '你提前重获自由！|You are free early!'; } },
    { id: 'sys_gang_test', sys: 1, title: '江湖考验|Test of Loyalty', icon: '🗡️',
      prep: function (c) { if (!c.p.gang) return false; c.prm.k = G.ri(0, 4); c.prm.g = c.p.gang.name; c.prm.r = G.GANG.r[c.p.gang.rank + 1]; },
      t: function (c) { return ['老大找到你：“有个案子需要人顶罪，你进去蹲三年，出来我让你直接当{r}。”|The boss pulls you aside: "Someone needs to take the fall. Do three years, and when you get out, you\'re {r}."',
        '一个欠了帮派巨款的赌鬼跪在你面前，说家里还有生病的孩子。老大让你“好好教训他”。|A gambler who owes the gang a fortune kneels before you, saying his child is sick at home. The boss wants him "taught a lesson."',
        '对头帮派的头目放话，约你在码头单挑。赢了，整条街都是你的。|A rival boss challenges you to a one-on-one at the docks. Win, and the whole street is yours.',
        '你发现最好的兄弟偷偷私吞了帮派的钱。|You discover your closest brother has been skimming the gang\'s money.',
        '一个便衣警察找上你，希望你做线人，条件是把你的案底一笔勾销。|An undercover cop approaches you: become an informant, and your record will be wiped clean.'][c.prm.k]; },
      o: [
        { t: '为老大顶罪|Take the fall', if: function (c) { return c.prm.k === 0; }, run: function (c) { CM.jail(3, '顶罪|Taking the fall'); c.p.gang.rep += 40; c.p.gang.pend = 2; return '你进了监狱。兄弟们都说你够义气。|You went to prison. The brothers say you\'re the real deal.'; } },
        { t: '拒绝|Refuse', if: function (c) { return c.prm.k === 0; }, run: function (c) { c.p.gang.rep -= 15; return '老大的脸色沉了下来。|The boss\'s face darkens.'; } },
        { t: '狠狠教训他|Teach him a lesson', if: function (c) { return c.prm.k === 1; }, run: async function (c) { var r = await c.game('fight', { name: '教训|Lesson' }); c.add('karma', -12); c.add('heat', 10); if (r.score > .4) { var nr = GA.promote(); return G.L('你下手狠辣，老大很满意，提拔你为{r}。|You were brutal. The boss was pleased and made you {r}.', { r: nr }); } return '他拼命反抗跑掉了，你丢了面子。|He fought back and got away. You lost face.'; } },
        { t: '偷偷放他走|Secretly let him go', if: function (c) { return c.prm.k === 1; }, run: function (c) { c.add('karma', 10); if (G.ch(.5)) { c.p.gang.rep -= 20; return '事情败露，你被兄弟们看不起。|Word got out; the brothers look down on you now.'; } return '没人发现，你救了一个家庭。|No one found out. You saved a family.'; } },
        { t: '赴约单挑|Accept the duel', if: function (c) { return c.prm.k === 2; }, run: async function (c) { var r = await c.game('fight', { name: '单挑|Duel', hard: 1 }); if (r.win) { var nr = GA.promote(); c.add('fame', 3); return G.L('你赢了！一战成名，晋升为{r}。|You won! Your name spreads and you rise to {r}.', { r: nr }); } c.add('health', -25); c.p.gang.rep -= 10; return '你被打得住进了医院。|You ended up in the hospital.'; } },
        { t: '设埋伏|Set an ambush', if: function (c) { return c.prm.k === 2 && G.has('ruthless'); }, run: function (c) { c.add('karma', -15); c.add('heat', 15); var nr = GA.promote(); return G.L('你不讲武德地赢了，晋升为{r}。|You won dirty and rose to {r}.', { r: nr }); } },
        { t: '谈判解决|Negotiate', if: function (c) { return c.prm.k === 2; }, run: function (c) { if (c.p.st.eq > 55 && G.ch(.6)) { var nr = GA.promote(); return G.L('你三言两语化干戈为玉帛，老大赏识你，升你做{r}。|With a few words you made peace. The boss promoted you to {r}.', { r: nr }); } c.p.gang.rep -= 8; return '谈判破裂，大家觉得你怂。|Talks failed; everyone thinks you\'re soft.'; } },
        { t: '向老大告发|Report him to the boss', if: function (c) { return c.prm.k === 3; }, run: function (c) { c.add('karma', -6); var nr = GA.promote(); return G.L('兄弟被废了，你踩着他升为{r}。|Your brother was dealt with. You climbed over him to {r}.', { r: nr }); } },
        { t: '替他瞒着|Cover for him', if: function (c) { return c.prm.k === 3; }, run: function (c) { c.add('karma', 4); if (G.ch(.4)) { c.p.gang.rep -= 25; return '事情败露，老大连你一起罚。|It came out; the boss punished you too.'; } return '兄弟欠你一条命。|Your brother owes you his life.'; } },
        { t: '敲诈他分钱|Blackmail him for a cut', if: function (c) { return c.prm.k === 3; }, run: function (c) { var m = c.$(G.ri(5000, 30000)); c.money(m); c.add('karma', -8); return G.L('他乖乖分了你{m}。|He meekly paid you {m}.', { m: G.M(m) }); } },
        { t: '答应做线人|Become an informant', if: function (c) { return c.prm.k === 4; }, run: function (c) { c.p.crime.rec = 0; c.p.h.heat = 0; c.p.flags.informant = 1; if (G.ch(.25)) { c.add('health', -30); GA.leave(); return '身份暴露，你被兄弟们打成重伤，只能退出帮派。|You were exposed, beaten half to death, and forced out.'; } return '你成了警方线人，案底清零了。|You are now a police informant. Your record is clean.'; } },
        { t: '拒绝条子|Refuse the cop', if: function (c) { return c.prm.k === 4; }, run: function (c) { c.p.gang.rep += 10; return '你啐了一口，转身离开。|You spit and walk away.'; } }
      ] },
    { id: 'sys_gang_boss', sys: 1, title: '王座之争|Fight for the Throne', icon: '👑',
      prep: function (c) { if (!c.p.gang) return false; c.prm.g = c.p.gang.name; },
      t: '{g}的老大年事已高，几个副帮主都盯着老大的位子。|The boss of {g} is aging, and the underbosses all eye the throne.',
      o: [
        { t: '武力夺权|Seize power by force', run: async function (c) { var r = await c.game('fight', { name: '夺权|Coup', hard: 1 }); if (r.win) { GA.promote(); c.add('fame', 8); return G.L('你踩着血路登上王座，成为{g}的老大！|You fought your way to the top — you are now Boss of {g}!', { g: c.p.gang.name }); } c.add('health', -35); c.p.gang.rank = 2; return '政变失败，你被打成重伤，降为小头目。|The coup failed; you were badly hurt and demoted.'; } },
        { t: '拉拢兄弟，等老大退位|Win hearts and wait', run: function (c) { if (c.p.st.eq > 60 && G.ch(.55)) { GA.promote(); return G.L('老大退位时，兄弟们一致推举你为{g}的新老大。|When the boss stepped down, everyone chose you to lead {g}.', { g: c.p.gang.name }); } c.p.gang.rep -= 30; return '别人抢先一步上了位。|Someone else got there first.'; } },
        { t: '急流勇退，金盆洗手|Walk away from it all', run: function (c) { GA.leave(); c.add('karma', 10); c.add('happy', 5); return '你选择金盆洗手，离开了江湖。|You wash your hands of it all and leave the underworld.'; } }
      ] },
    { id: 'sys_gang_war', sys: 1, title: '帮派火拼|Gang War', icon: '💥',
      prep: function (c) { if (!c.p.gang) return false; c.prm.g = c.p.gang.name; c.prm.e = G.pick(G.GANG.names.filter(function (x) { return x !== c.p.gang.name; })); },
      t: '{e}的人踩过界了，{g}决定跟他们开战。|{e} crossed the line, and {g} is going to war.',
      o: [
        { t: '冲锋陷阵|Charge in', run: async function (c) { var r = await c.game('fight', { name: '火拼|Brawl' }); c.add('heat', 12); if (G.ch(.04 * (1.4 - r.score))) { G.die('死于帮派火拼|Killed in a gang war'); return '一把刀刺中了你的要害……|A blade finds your heart...'; } if (r.score > .45) { c.p.gang.rep += 15; var m = c.$(G.ri(5000, 40000)); c.money(m); return G.L('你们打赢了，抢下了地盘，分到{m}。|You won, took the turf, and got a {m} cut.', { m: G.M(m) }); } c.add('health', -18); return '你们输了，你挂了彩。|You lost and got hurt.'; } },
        { t: '在后方指挥|Command from the back', if: function (c) { return c.p.gang.rank >= 3; }, run: function (c) { c.add('heat', 6); if (G.ch(.55 + c.p.st.smarts / 400)) { c.p.gang.rep += 10; return '你运筹帷幄，大获全胜。|Your strategy carried the day.'; } c.p.gang.rep -= 5; return '指挥失误，损兵折将。|A bad call cost many men.'; } },
        { t: '找借口躲开|Find an excuse to hide', run: function (c) { c.p.gang.rep -= 12; return '兄弟们看你的眼神变了。|The brothers look at you differently now.'; } }
      ] },
    { id: 'sys_gang_raid', sys: 1, title: '警方突袭|Police Raid', icon: '🚨', bad: 1,
      t: '警方对你们的据点发动突袭！|The police raid your hideout!',
      o: [
        { t: '夺路而逃|Run for it', run: async function (c) { var r = await c.game('driving', { name: '追车|Car Chase' }); if (r.score > .5) { c.add('heat', -15); return '你甩掉了警车，逃出生天。|You lost the cops and escaped.'; } return CM.arrest(c, '组织黑社会|Organized crime', 4 + c.p.gang.rank * 2); } },
        { t: '让小弟顶罪|Make an underling take the fall', if: function (c) { return c.p.gang.rank >= 2; }, run: function (c) { c.add('karma', -10); c.p.gang.rep -= 10; c.p.h.heat = Math.round(c.p.h.heat / 2); return '小弟替你进去了，你暂时安全。|An underling went down in your place. You are safe — for now.'; } },
        { t: '束手就擒|Surrender', run: function (c) { var g = c.p.gang; GA.leave(); return CM.arrest(c, '组织黑社会|Organized crime', 3 + g.rank * 2); } }
      ] }
  ]);
})();
