/* Prison, for real: harsher trials, longer terms, seized assets and a broken life behind bars.
   While inside, almost nothing of your old life is reachable — only prison actions, letters and visits. */
(function () {
  'use strict';
  var N = G.N, CM = G.crime, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  var ECON = /诈骗|黑客|受贿|贪污|走私|洗钱|放贷|赌场|造假|黄牛|盗墓|黑社会|掮客|水军|行贿|非法|诈|Fraud|Scam|Brib|Smuggl|Hack|Launder|Loan|Casino|Counterfeit|Scalp|Tomb|Organized|Fixer/i;
  var PRISONS = ['城北监狱|Northside Penitentiary', '第三监狱|State Prison No. 3', '青山监狱|Green Hill Prison', '河西监狱|Riverside Correctional', '高墙监狱|Highwall Prison', '东郊监狱|Eastfield Penitentiary'];

  /* ---------------- trial ---------------- */
  function clout(p) { return p.origin === 'red' || p.flags.redfam || (p.gov && p.gov.rank >= 4) || G.netWorth() > G.$(5e7); }
  CM.arrest = async function (c, why, base) {
    var p = G.S.p;
    if (p.age < 14) { G.addStat('happy', -5); N.rel('father', 'mother').forEach(function (n) { N.addAff(n, -10); }); return '你被抓住了，但因为年纪太小，警察把你交给了父母，挨了一顿狠揍。|You were caught, but you were too young to charge. The police handed you to your parents — you got a hiding.'; }
    var priors = G.S.cnt.jail || 0, fee = G.$(12000 * Math.max(1, base / 2));
    var opts = [
      { t: G.L('请律师辩护（{m}）|Hire a lawyer ({m})', { m: G.M(fee) }) },
      { t: G.L('认罪认罚，争取从轻|Plead guilty for leniency') },
      { t: G.L('当庭抗辩|Fight it in court') },
      { t: G.L('偷偷贿赂法官|Secretly bribe the judge') }
    ];
    if (clout(p)) opts.push({ t: G.L('托关系“打招呼”|Have someone "put in a word"') });
    var i = await G.UI.event({ title: G.L('法庭审判|Trial'), icon: '⚖️', opts: opts,
      text: G.L('你因涉嫌{w}被捕，即将受审。{x}|You were arrested for {w} and now face trial.{x}', { w: why, x: priors ? G.L('你有{n}次前科，法官不会手软。| You have {n} prior convictions; the judge won\'t go easy.', { n: priors }) : '' }) });
    var yrs = base, msg = '';
    if (i === 0) { if (G.pay(fee)) { yrs = G.ch(.12 - priors * .03) ? 0 : Math.round(base * G.rf(.55, .85)); } else msg = G.L('你请不起律师，只能用法律援助。|You couldn\'t afford a lawyer and got a public defender.'); }
    else if (i === 1) yrs = Math.round(base * .8);
    else if (i === 2) yrs = G.ch(.1 + p.st.smarts / 700 - priors * .03) ? 0 : Math.round(base * 1.4);
    else if (i === 3) { var b = G.$(25000 * base); if (G.pay(b) && G.ch(.3)) yrs = 0; else { yrs = Math.round(base * 1.6) + 2; msg = G.L('行贿被识破，罪加一等！|The bribe was exposed — extra charges!'); why = why + '、行贿|, bribery'; } }
    else { var cost = G.$(60000 * base); if (G.pay(cost) && G.ch(.45)) yrs = Math.max(0, Math.round(base * .3)); else { yrs = Math.round(base * 1.3); msg = G.L('风声太紧，没人敢帮你。|The heat was on; nobody dared help.'); } }
    yrs = Math.max(0, Math.round(yrs));
    if (!yrs) { p.crime.rec++; p.h.heat = Math.max(0, p.h.heat - 30); p.flags.probation = G.S.year; return G.L('{m}你被判缓刑，当庭释放。但你的档案上多了一笔。|{m}You got probation and walked free — but it\'s on your record now.', { m: msg ? msg + ' ' : '' }); }
    var y = CM.jail(yrs, why);
    G.addStat('happy', -20);
    var j = p.jail, extra = j && j.seized && j.seized.length ? G.join(['法院没收了：|The court seized: ', G.join(j.seized, '、', ', '), '。|.'], '', '') : '';
    return G.join([msg, G.L('你被判处{y}年有期徒刑。|You were sentenced to {y} years in prison.', { y: y }), extra], ' ', ' ');
  };

  /* ---------------- sentencing & seizure ---------------- */
  var jail0 = CM.jail;
  CM.jail = function (yrs, why, o) {
    o = o || {};
    var Sx = S(), p = Sx.p, juv = p.age < 18, priors = Sx.cnt.jail || 0;
    var y = o.fixed ? yrs : Math.round(yrs * G.rf(1.25, 1.6) + priors * 1.2);
    y = juv ? G.clamp(y, 1, 3) : G.clamp(y, 1, 25);
    jail0.call(this, y, why);
    var j = p.jail; if (!j) return y;
    j.pn = G.pick(PRISONS); j.no = String(G.ri(100000, 999999)); j.juv = juv; j.since = Sx.year; j.seized = []; j.visits = 0;
    if (juv) j.pn = '少年管教所|Juvenile Detention Center';
    seize(p, j, String(why), y);
    // the people around you react
    N.rel('father', 'mother').forEach(function (n) { N.addAff(n, -12); });
    N.rel('child').forEach(function (k) { N.addAff(k, N.age(k) < 18 ? -15 : -10); });
    N.all(function (n) { return n.alive && (n.rel === 'lover' || n.rel === 'affair'); }).forEach(function (n) {
      if (n.love < 75 || G.ch(.5)) { n.rel = 'ex'; n.love = 0; n.kept = 0; if (p.partner === n.id) p.partner = null; G.log('{n}离开了你。|{n} left you.', { n: n.name }); }
    });
    if (p.st.fame >= 40) { G.addStat('fame', -Math.round(p.st.fame * .35), true); G.log('你入狱的消息上了新闻头条，代言和合作全部取消。|Your conviction made headlines; every sponsor and partner dropped you.'); }
    if (p.fc) { p.fc = null; }
    if (p.gray) { try { G.gray.leave(); } catch (e) { p.gray = null; } }
    return y;
  };
  function seize(p, j, why, y) {
    var Sx = S(), A = Sx.assets, econ = ECON.test(why) || !!p.gray || (A.company && /受贿|Brib/.test(why));
    var cash = Math.max(0, p.money);
    // fines and confiscation
    var fine = econ ? Math.round(cash * G.rf(.7, .95)) + G.$(8000) * y : G.$(2500) * y;
    var paid = Math.min(cash, fine); p.money -= paid; G.inc('fines', paid);
    if (fine > paid) A.debt.push({ k: 'fine', n: '罚金及赔偿|Court Fines & Restitution', amt: fine - paid, r: 0 });
    j.seized.push(G.L('{m}罚金|{m} in fines', { m: G.M(fine) }));
    if (econ) {
      if (A.cars && A.cars.length) { j.seized.push(G.L('{n}辆车|{n} car(s)', { n: A.cars.length })); A.cars = []; }
      if (A.items && A.items.length) { j.seized.push('奢侈品|Luxury goods'); A.items = []; }
      var invT = 0; for (var k in A.inv) { invT += A.inv[k]; A.inv[k] = Math.round(A.inv[k] * .3); } if (invT > 0) j.seized.push('大部分投资|Most investments');
      var keep = N.spouse() ? A.houses.filter(function (h) { return h.live; })[0] : null;
      var gone = A.houses.filter(function (h) { return h !== keep && G.ch(.75); });
      if (gone.length) { A.houses = A.houses.filter(function (h) { return gone.indexOf(h) < 0; }); j.seized.push(G.L('{n}套房产|{n} property/properties', { n: gone.length })); }
    }
    if (A.company) {
      if (econ || y >= 3) { j.seized.push(G.L('公司“{c}”|Company "{c}"', { c: A.company.name })); G.log('你的公司{c}{x}。|Your company {c} {x}.', { c: A.company.name, x: econ ? '被查封了|was shut down by the authorities' : '群龙无首，很快就倒闭了|collapsed without you' }); A.company = null; }
      else A.company.val = Math.round(A.company.val * .5);
    }
    // nobody pays the rent while you're inside
    A.houses.forEach(function (h) { h.rent = false; });
  }

  /* ---------------- life inside ---------------- */
  var tick0 = CM.tick;
  CM.tick = function (Q) {
    var Sx = S(), p = Sx.p, j = p.jail;
    if (j) {
      var age = p.age;
      G.addStat('health', -(1 + (age > 55 ? 3 : age > 40 ? 1 : 0) + (j.beh < 35 ? 2 : 0)), true);
      G.addStat('happy', -3, true); p.h.stress = G.clamp((p.h.stress || 0) + 4, 0, 100);
      // mortgages you can't pay
      var A = Sx.assets;
      A.houses.slice().forEach(function (h) { if (h.mort > 0 && p.money < (h.pay || 0)) { A.houses.splice(A.houses.indexOf(h), 1); var left = Math.round(h.val * .7 - h.mort); if (left > 0) p.money += left; G.log('你还不上房贷，银行收走了{n}。|You couldn\'t keep up the mortgage; the bank repossessed {n}.', { n: h.n }); } });
      // a spouse waiting outside
      var sp = N.spouse();
      if (sp && sp.alive) { sp.love = G.clamp(sp.love - G.ri(3, 9), 0, 100); if (sp.love < 30 && !j.divQ && G.ch(.5)) { j.divQ = 1; Q.push({ id: 'pr_divorce', nid: sp.id }); } }
      if (j.beh < 25 && G.ch(.35)) Q.push({ id: 'pr_solitary' });
      if (j.yrs >= Math.ceil(j.tot / 2) && j.beh >= 60 && !j.board && j.left > 1) { j.board = 1; Q.push({ id: 'pr_board' }); }
    }
    return tick0.apply(this, arguments);
  };

  /* release: freedom with strings attached */
  ['sys_release', 'sys_parole'].forEach(function (id) {
    var d = G.EV[id]; if (!d) return; var run = d.run;
    d.run = function (c) {
      var j = c.p.jail ? Object.assign({}, c.p.jail) : null;
      var r = run.apply(this, arguments);
      if (j) {
        c.p.flags.excon = { y: c.S.year, yrs: j.yrs + 1, parole: id === 'sys_parole' ? c.S.year + Math.max(1, j.left) : 0 };
        if (j.yrs >= 8) ES_later('ex_shock');
        ES_later('ex_home'); if (!c.p.job) ES_later('ex_job');
      }
      return r;
    };
  });
  function ES_later(id, nid) { (G.S.pendQ = G.S.pendQ || []).push(nid ? { id: id, nid: nid } : { id: id }); }

  /* a record follows you */
  var qual = G.career.qualify;
  G.career.qualify = function (j) {
    var r = qual.apply(this, arguments), p = G.S.p, x = p.flags.excon;
    if (x && !j.pt) {
      var since = G.S.year - x.y;
      if (['gov', 'law', 'edu', 'med', 'fin'].indexOf(j.cat) >= 0 || ['pilot', 'diplomat', 'judge', 'banker', 'quant', 'teacher'].indexOf(j.id) >= 0) { r.ok = false; r.miss.push(G.L('有服刑记录|Prison record')); r.ch = .02; }
      else r.ch = G.clamp(r.ch * (since < 3 ? .45 : since < 8 ? .65 : .8), .02, .95);
    }
    return r;
  };

  /* prison skills pay off */
  var inc0 = G.money.income;
  G.money.income = function () { var o = inc0.apply(this, arguments), p = G.S.p; if (p.jail) { o.work = Math.round(G.$w(300) * (1 + (p.flags.prisonTrade ? .5 : 0))); o.black = 0; } return o; };

  /* ---------------- prison actions ---------------- */
  var J = G.ACT_JAIL, q = G.quick;
  function beh(n) { var j = G.S.p.jail; j.beh = G.clamp(j.beh + n, 0, 100); }
  J.push(
    { id: 'jtrade', n: '学一门手艺|Learn a Trade', i: '🔧', e: 20, run: function (a) { var p = G.S.p; beh(3); var t = G.pick([['厨艺|Cooking', 'cook'], ['电工|Electrical Work', 'elec'], ['理发|Barbering', 'hair'], ['缝纫|Tailoring', 'sew'], ['汽修|Auto Repair', 'mech']]); p.flags.prisonTrade = t[1]; p.sk = p.sk || {}; p.sk[t[1]] = Math.min(100, (p.sk[t[1]] || 0) + 12); return q(a, '你在监狱的职业培训班学了{t}，师傅说你上手很快。|You took the prison vocational course in {t}; the instructor says you\'re a natural.', { smarts: 1, happy: -1 }, { t: t[0] }); } },
    { id: 'jletter', n: '给家人写信|Write Home', i: '✉️', e: 5, run: function (a) { var fam = N.all(function (n) { return n.alive && (N.isFamily(n) || n.rel === 'spouse'); }); var n = G.pick(fam); if (!n) return q(a, '你写了一封信，却不知道该寄给谁。|You wrote a letter but had no one to send it to.', { happy: -4, eq: 1 }); N.addAff(n, G.ri(3, 7)); if (n.rel === 'spouse') N.addLove(n, 4); var back = n.aff > 30 && G.ch(.6); return q(a, back ? '你给{n}写了一封长信，一个月后收到了回信，你读了一遍又一遍。|You wrote {n} a long letter. A month later a reply came, and you read it over and over.' : '你给{n}写了信，但一直没有收到回音。|You wrote to {n}, but no reply ever came.', back ? { happy: 4, eq: 1 } : { happy: -3, eq: 1 }, { n: n.name }); } },
    { id: 'jstudy', n: '参加狱内自学考试|Study for a Degree Inside', i: '🎓', e: 25, run: function (a) { var p = G.S.p; beh(4); p.flags.jstudy = (p.flags.jstudy || 0) + 1; if (p.flags.jstudy >= 3 && p.edu.deg < 4 && G.ch(.35 + p.st.smarts / 300)) { p.edu.deg = Math.max(p.edu.deg, 4); p.edu.stage = 'done'; G.major('在狱中拿到了自考本科学历|Earned a degree while in prison'); return q(a, '你在狱中通过了全部自考科目，拿到了本科文凭！|You passed every exam inside and earned a bachelor\'s degree!', { smarts: 4, happy: 8 }); } return q(a, '你在昏暗的灯光下啃了一夜教材。|You studied textbooks all night under a dim light.', { smarts: 2, health: -1 }); } },
    { id: 'jcounsel', n: '找心理咨询师|See the Counselor', i: '🧠', e: 10, run: function (a) { beh(2); G.S.p.h.stress = Math.max(0, (G.S.p.h.stress || 0) - 15); return q(a, G.pick(['你第一次对别人说起了那件事。|For the first time, you talked about what happened.', '咨询师说：“你不只是你犯过的错。”|The counselor said, "You are more than your worst mistake."']), { happy: 4, eq: 2, karma: 2 }); } },
    { id: 'jsmuggle', n: '倒卖违禁品|Run Contraband', i: '🚬', e: 15, run: function (a) { var p = G.S.p, j = p.jail; if (G.ch(.6)) { beh(-6); return q(a, '你从探监的人那里弄来香烟，在号子里换了一大堆好处。|You got cigarettes from a visitor and traded them for favors all over the block.', { money: 300, happy: 3, rep: 3 }); } beh(-25); j.left += 1; return q(a, '你被狱警当场抓获，关了禁闭，刑期加了一年。|A guard caught you red-handed. Solitary, plus a year on your sentence.', { happy: -10 }); } },
    { id: 'jappeal', n: '提出上诉|File an Appeal', i: '📜', e: 15, run: async function (a) { var p = G.S.p, j = p.jail; if (j.appealed) return q(a, '你的上诉已经被驳回过了，没有新证据不能再上诉。|Your appeal was already denied; without new evidence you can\'t try again.', { happy: -2 }); j.appealed = 1; var fee = G.$(15000 + j.tot * 3000); if (!(await G.UI.confirm(G.L(a.n), G.L('请律师上诉需要{m}，成功率不高。|An appeal lawyer costs {m}, and the odds are slim.', { m: G.M(fee) })))) return 'cancel'; if (!G.pay(fee)) return q(a, '你拿不出律师费。|You couldn\'t pay the lawyer.', { happy: -3 }); if (G.ch(.18 + p.st.smarts / 800)) { var cut = Math.max(1, Math.round(j.left * G.rf(.3, .6))); j.left = Math.max(0, j.left - cut); return q(a, '二审改判，你的刑期减少了{y}年！|The appeals court reduced your sentence by {y} years!', { happy: 15 }, { y: cut }); } return q(a, '二审维持原判。|The verdict was upheld.', { happy: -8 }); } }
  );
  // prison labor pays almost nothing; reading/exercise matter more for parole
  J.forEach(function (a) { if (a.id === 'jwork') { var r = a.run; a.run = function (x) { beh(1); return r.apply(this, arguments); }; } });

  // nothing else of your old life is reachable from inside
  G.ACT_CATS.forEach(function (c) { var l = c.lock; c.lock = function () { if (G.S && G.S.p.jail) return '服刑期间，你什么都做不了。|You can\'t do this while serving time.'; return l ? l.apply(this, arguments) : null; }; });
  var acts0 = G.npcActs;
  G.npcActs = function (n) {
    var p = G.S.p; if (!p.jail) return acts0.apply(this, arguments);
    if (!n.alive) return [];
    var out = [];
    if (n.rel === 'inmate') return acts0.apply(this, arguments).filter(function (a) { return ['chat', 'time', 'insult', 'fight', 'argue'].indexOf(a.id) >= 0; });
    out.push({ id: 'jw', n: '写信|Write a Letter', i: '✉️', e: 5, run: async function (n, a) { G.dStart(); var d = N.addAff(n, G.ri(2, 6)); if (n.rel === 'spouse') N.addLove(n, 3); var dl = G.dEnd(); dl.push({ k: 'aff', n: d }); return G.result(a.n, n.aff > 20 ? '{n}回了信，信纸上有泪痕。|{n} wrote back; the paper was stained with tears.' : '信寄出去了，没有回音。|The letter went out. No reply.', { n: n.name }, dl, '✉️'); } });
    out.push({ id: 'jv', n: '请求探视|Ask Them to Visit', i: '🪟', e: 10, run: async function (n, a) {
      var j = p.jail, come = n.aff > 35 || (n.rel === 'spouse' && n.love > 40) || ((n.rel === 'father' || n.rel === 'mother') && n.aff > 5);
      G.dStart(); if (come) { G.addStat('happy', 8); N.addAff(n, 3); j.visits++; } else G.addStat('happy', -5); var dl = G.dEnd();
      var t = !come ? '探视日那天，你等了一整天，{n}没有来。|On visiting day you waited all day. {n} never came.'
        : (n.rel === 'father' || n.rel === 'mother') ? '{n}隔着玻璃看着你，头发又白了许多。“在里面好好改造，家里有我们。”|{n} looked at you through the glass, hair much greyer. "Behave in there. We\'ll hold things together."'
        : n.rel === 'child' && N.age(n) < 10 ? '{n}趴在玻璃上问：“你什么时候回家？”你说不出话来。|{n} pressed against the glass: "When are you coming home?" You couldn\'t answer.'
        : '{n}来看你了，你们隔着玻璃说了二十分钟话。|{n} came to see you. You talked through the glass for twenty minutes.';
      return G.result(a.n, t, { n: n.name }, dl, '🪟');
    } });
    if (n.rel === 'spouse' || n.rel === 'lover') out.push({ id: 'jfree', n: '让{n}别等了|Tell {n} Not to Wait', i: '💔', e: 5, run: async function (n, a) { if (!(await G.UI.confirm(G.L(a.n), G.L('你要放{n}走吗？|Let {n} go?', { n: n.name })))) return 'cancel'; var stay = n.love > 80 && G.ch(.5); if (!stay) { n.rel = 'ex'; n.love = 20; p.partner = null; G.major('和{n}在狱中离婚|Divorced {n} while in prison', { n: n.name }); } return G.result(a.n, stay ? '{n}哭着说：“我等你，多少年都等。”|{n} wept: "I\'ll wait, however many years it takes."' : '{n}沉默了很久，最后点了点头。|{n} was silent a long time, then nodded.', { n: n.name }, [], '💔'); } });
    return out;
  };

  /* ---------------- events behind bars ---------------- */
  var JX = { jail: 1 };
  function jx(o) { var d = Object.assign({}, JX, o || {}), pr = d.prep; d.prep = function (c) { if (!c.p.jail) return false; return pr ? pr.apply(this, arguments) : undefined; }; return d; }
  function inmate(o) { return N.make(Object.assign({ rel: 'inmate', g: G.S.p.g, age: G.ri(20, 60), job: '囚犯|Inmate', inc: 0 }, o || {})); }
  G.evs([
    E('pr_cellmate', [14, 99], '新狱友|A New Cellmate', '🛏️', function (c) { return c.prm.k === 0 ? '一个刚进来的年轻人被分到你的号子，吓得整晚发抖。|A terrified young first-timer is assigned to your cell. He shakes all night.' : c.prm.k === 1 ? '新来的狱友是个沉默的中年人，据说以前是大学教授。|Your new cellmate is a quiet middle-aged man — a former professor, they say.' : '新来的狱友浑身纹身，一进门就盯着你的铺位。|Your new cellmate is covered in tattoos and eyes your bunk the moment he walks in.'; }, [
      O('照顾他/和他交朋友|Look out for them / make friends', function (c) { var n = inmate({ aff: 35, pers: c.prm.k === 1 ? 'nerd' : c.prm.k === 0 ? 'shy' : 'hot' }); c.npc = n; c.prm.n = n.name; H.fx(c, { eq: 2, karma: 3, happy: 2 }); if (c.prm.k === 1) { H.fx(c, { smarts: 2 }); return '{n}开始教你读书，你们成了忘年交。|{n} started teaching you to read seriously; you became unlikely friends.'; } return '你们成了互相照应的朋友。|You became friends who look out for each other.'; }),
      O('井水不犯河水|Keep to yourself', R('你们各过各的，相安无事。|You each kept to yourselves. No trouble.', { happy: -1 })),
      O('先给他个下马威|Show them who\'s boss', function (c) { var j = c.p.jail; if (G.ch(.5 + c.p.h.fit / 300)) { j.beh = Math.max(0, j.beh - 6); H.fx(c, { rep: 6, karma: -4 }); return '他乖乖让出了下铺。|He meekly gave up the lower bunk.'; } j.beh = Math.max(0, j.beh - 10); H.fx(c, { health: -8 }); return '你被他按在地上打了一顿。|He pinned you down and beat you.'; })
    ], jx({ prep: function (c) { c.prm.k = G.ri(0, 2); }, cd: 2 })),
    E('pr_riot', [16, 99], '监狱骚乱|Prison Riot', '🔥', '饭堂里突然打了起来，很快整栋监区都乱了，有人点着了床单。|A fight breaks out in the canteen and the whole block erupts. Someone sets the sheets on fire.', [
      O('趁乱报复仇人|Settle scores in the chaos', function (c) { var j = c.p.jail; j.beh = Math.max(0, j.beh - 30); if (G.ch(.5)) { j.left += 2; H.fx(c, { rep: 8, karma: -10 }); return '事后调查，你被认定为骚乱参与者，加刑两年。|The inquiry named you as a rioter: two more years.'; } H.fx(c, { rep: 8, health: -10 }); return '你没被查出来，但身上多了几道伤疤。|You weren\'t identified, but you have new scars.'; }),
      O('保护被围攻的狱警|Protect a cornered guard', function (c) { var j = c.p.jail; j.beh = Math.min(100, j.beh + 25); if (G.ch(.5)) { j.left = Math.max(1, j.left - 1); H.fx(c, { karma: 10, health: -6 }); return '你因为立功表现获得减刑一年！|For your bravery, your sentence was cut by a year!'; } H.fx(c, { karma: 10, health: -12, rep: -10 }); return '你护住了狱警，但其他犯人都记恨上了你。|You saved the guard — and every inmate now hates you.'; }),
      O('躲在号子里不出来|Hide in your cell', R('你抱着头躲在床底下，直到防暴队冲进来。|You hid under your bunk until the riot squad stormed in.', { happy: -5 }))
    ], jx({ bad: 1, cd: 6 })),
    E('pr_gang', [16, 99], '狱中帮派|Prison Gang', '🐍', '号子里最大的帮派找上了你：“跟着我们，没人敢动你。不跟……那就难说了。”|The biggest gang inside approaches you: "Run with us and nobody touches you. Don\'t… and who knows."', [
      O('加入他们|Join them', function (c) { var j = c.p.jail; j.beh = Math.max(0, j.beh - 15); c.p.flags.pgang = 1; inmate({ aff: 40, pers: 'boss' }); H.fx(c, { rep: 10, karma: -6, happy: 3 }); return '你有了靠山，但狱警开始盯上你了。|You have protection now — and the guards have their eye on you.'; }),
      O('拒绝|Refuse', RC(.5, '他们没再找你麻烦。|They left you alone after that.', { eq: 2 }, '第二天你在洗澡房被人围住打了一顿。|The next day they cornered you in the showers.', { health: -12, happy: -6 })),
      O('报告狱警|Tell the guards', function (c) { var j = c.p.jail; j.beh = Math.min(100, j.beh + 12); if (G.ch(.4)) { H.fx(c, { health: -15, rep: -15 }); return '“告密者”三个字从此跟着你。你被打进了医务室。|"Snitch" follows you everywhere now. You ended up in the infirmary.'; } H.fx(c, { karma: 3 }); return '狱警把你调到了别的监区。|The guards moved you to another block.'; })
    ], jx({ bad: 1, cd: 8, if: function (S, p) { return !!p.jail && !p.flags.pgang && !p.jail.juv; } })),
    E('pr_sick', [16, 99], '狱中生病|Sick Inside', '🤒', '你高烧不退，咳得整夜睡不着。监狱医务室的药只有几种。|Your fever won\'t break and you cough all night. The infirmary has only a few kinds of medicine.', [
      O('硬扛过去|Tough it out', RC(.6, '一个星期后，你熬过来了。|After a week, you pulled through.', { health: -4 }, '拖成了肺炎，你瘦了一大圈。|It turned into pneumonia; you lost a lot of weight.', { health: -14 })),
      O('申请保外就医|Apply for medical parole', function (c) { var p = c.p, j = p.jail; var real = p.st.health < 35 || p.ill.some(function (x) { return x.known; }); if (real && G.ch(.35)) { j.left = 0; p.jail = null; p.flags.excon = { y: c.S.year, yrs: j.yrs }; G.major('保外就医|Released on medical parole'); return '你的申请被批准了，你被保外就医！|Your application was approved — you were released on medical parole!'; } H.fx(c, { health: -3 }); return '申请被驳回了：“病得还不够重。”|Denied: "Not sick enough."'; }),
      O('拿香烟换好药|Trade cigarettes for real medicine', RC(.65, '你弄到了好药，很快就好了。|You got the good stuff and recovered fast.', { health: 2 }, '被发现了，药没拿到还挨了处分。|You were caught — no medicine, and a black mark.', { health: -6 }))
    ], jx({ bad: 1, cd: 4 })),
    E('pr_mentor', [16, 99], '老江湖|The Old Timer', '👴', '一个在里面关了二十多年的老犯人对你说：“小子，想听听我是怎么进来的吗？”|An old con who\'s been inside over twenty years says: "Kid, wanna hear how I ended up here?"', [
      O('听他讲完|Hear him out', R('他讲了一整夜。最后他说：“别像我一样，出去以后好好活。”|He talked all night. At the end he said: "Don\'t end up like me. Live right when you get out."', { eq: 3, karma: 5, smarts: 1 })),
      O('向他学“本事”|Learn his "skills"', function (c) { c.p.flags.oldtimer = 1; H.fx(c, { smarts: 2, karma: -6 }); return '他教了你开锁、做假账和怎么看人。|He taught you to pick locks, cook books and read people.'; }),
      O('向他学法律|Ask him about the law', function (c) { c.p.flags.jlaw = 1; H.fx(c, { smarts: 3 }); var j = c.p.jail; if (!j.appealed) j.appealHelp = 1; return '他是个“牢房律师”，帮你找到了判决书里的漏洞。|He\'s a jailhouse lawyer — he found holes in your verdict.'; })
    ], jx({ cd: 10 })),
    E('pr_birthday', [14, 99], '高墙里的生日|Birthday Behind Walls', '🎂', '今天是你的生日。没有蛋糕，号子里的人用馒头插了一根火柴。|It\'s your birthday. No cake — your cellmates stuck a match in a steamed bun.', [
      O('许个愿|Make a wish', R('你闭上眼睛，许愿早点回家。|You closed your eyes and wished to go home soon.', { happy: 4, eq: 1 })),
      O('躲在被子里哭|Cry under the blanket', R('你想起了家里的饭菜，哭得说不出话。|You thought of home cooking and cried until you couldn\'t speak.', { happy: -4, eq: 2 }))
    ], jx({ cd: 4 })),
    E('pr_outside', [14, 99], '外面的世界|The World Outside', '📰', '你在阅览室翻到一份报纸，才发现外面的世界已经变了很多。|You find a newspaper in the reading room and realize how much the world outside has changed.', [
      O('把新闻一条条记下来|Note down every headline', R('你决心出去以后不要和社会脱节。|You\'re determined not to fall behind when you get out.', { smarts: 2, happy: -2 })),
      O('不看了，越看越难受|Stop reading — it hurts', R('你把报纸折好放回了原处。|You folded the paper and put it back.', { happy: -3, health: 1 }))
    ], jx({ cd: 5, if: function (S, p) { return !!p.jail && p.jail.yrs >= 3; } })),
    E('pr_kidvisit', [20, 99], '孩子来了|Your Child Visits', '🧒', '{n}第一次来监狱看你。{n}隔着玻璃看了你很久，才小声叫了一声。|{n} visits for the first time. {n} stares at you through the glass for a long while before whispering your name.', [
      O('“爸爸/妈妈在外地工作。”|"I\'m away working."', R('你撒了个谎。{n}信了，又好像没信。|You lied. {n} believed it — or pretended to.', { happy: -3, npc: 3 })),
      O('说出真相，向孩子道歉|Tell the truth and apologize', function (c) { var ok = G.ch(.55 + c.npc.aff / 300); H.fx(c, { eq: 3, karma: 4, npc: ok ? 10 : -8 }); return ok ? '{n}哭了，说会等你回家。|{n} cried and promised to wait for you.' : '{n}转身跑了出去。|{n} turned and ran out.'; })
    ], jx({ cd: 6, if: function () { return N.rel('child').some(function (k) { return k.alive && N.age(k) >= 4 && N.age(k) < 18; }); }, prep: function (c) { var k = G.pick(N.rel('child').filter(function (k) { return k.alive && N.age(k) >= 4 && N.age(k) < 18; })); if (!k) return false; c.npc = k; c.prm.n = k.name; } })),
    E('pr_guard', [16, 99], '狱警的提议|A Guard\'s Offer', '🗝️', '一个狱警悄悄对你说：“给我这个数，我让你过得舒服点。”|A guard whispers: "Pay me this much and I\'ll make life easier for you."', [
      O('给钱|Pay him', function (c) { var m = c.$(3000); if (!c.pay(m)) return '你拿不出钱，他冷笑着走了。|You couldn\'t pay; he walked off sneering.'; c.p.jail.beh = Math.min(100, c.p.jail.beh + 8); H.fx(c, { happy: 6, health: 2 }); return '从此你的伙食好了，活也轻了。|After that, better food and lighter work.'; }),
      O('拒绝|Refuse', R('他记住了你。|He remembered you.', { happy: -2, karma: 2 })),
      O('举报他|Report him', RC(.4, '他被调走了，你被记了一功。|He was transferred, and you earned a commendation.', { karma: 6 }, '举报信石沉大海，他开始处处针对你。|Your complaint vanished, and he made your life hell.', { happy: -8, health: -4 }))
    ], jx({ cd: 6 }))
  ]);
  G.evs([
    { id: 'pr_divorce', sys: 1, jail: 1, title: '玻璃另一边的离婚协议|Divorce Papers Through the Glass', icon: '📄', bad: 1,
      t: '{n}来探视，却递来了一份离婚协议。“我等不起了，孩子也需要正常的生活。”|{n} visits — and slides divorce papers across. "I can\'t wait anymore. The kids need a normal life."',
      prep: function (c) { if (!c.npc || !c.p.jail) return false; c.prm.n = c.npc.name; },
      o: [
        { t: '签字，放TA走|Sign and let them go', run: function (c) { var n = c.npc; n.rel = 'ex'; n.love = 25; c.p.partner = null; c.add('happy', -12); c.add('eq', 2); G.major('在狱中离婚|Divorced while in prison'); return '你颤抖着签了字。{n}走的时候没有回头。|Your hand shook as you signed. {n} didn\'t look back.'; } },
        { t: '求TA再等等|Beg them to wait', run: function (c) { var n = c.npc; if (G.ch(.3)) { N.addLove(n, 15); c.add('happy', 4); return '{n}把协议收了回去：“最后一次。”|{n} took the papers back: "One last chance."'; } n.rel = 'ex'; n.love = 10; c.p.partner = null; c.add('happy', -15); G.major('在狱中离婚|Divorced while in prison'); return '{n}还是走了。法院判了离婚，孩子跟了{n}。|{n} left anyway. The court granted the divorce; the kids went with {n}.'; } },
        { t: '拒绝签字|Refuse to sign', run: function (c) { var n = c.npc; N.addLove(n, -20); if (G.ch(.6)) { n.rel = 'ex'; n.love = 0; c.p.partner = null; G.major('在狱中离婚|Divorced while in prison'); return '{n}起诉离婚，法院照样判了。|{n} sued, and the court granted it anyway.'; } return '僵持还在继续。|The standoff drags on.'; } }
      ] },
    { id: 'pr_solitary', sys: 1, jail: 1, title: '关禁闭|Solitary Confinement', icon: '⬛', bad: 1,
      prep: function (c) { if (!c.p.jail) return false; },
      t: '因为屡次违纪，你被关进了禁闭室。没有窗户，没有人说话，连时间都感觉不到。|After repeated violations you were thrown into solitary. No window, no voices, no sense of time.',
      o: [
        { t: '数墙上的砖|Count the bricks', run: function (c) { c.add('happy', -10); c.add('smarts', -1); c.p.jail.beh = Math.min(100, c.p.jail.beh + 10); return '你数到了第三千块砖，然后从头再数。|You counted to brick three thousand, then started over.'; } },
        { t: '在脑子里背书|Recite books in your head', run: function (c) { c.add('happy', -6); c.add('smarts', 1); c.p.jail.beh = Math.min(100, c.p.jail.beh + 10); return '你在脑子里把读过的书背了一遍又一遍，靠这个撑了过来。|You recited every book you\'d ever read, again and again. It kept you sane.'; } }
      ] },
    { id: 'pr_board', sys: 1, jail: 1, title: '减刑听证会|Sentence Review Hearing', icon: '🪑', good: 1,
      prep: function (c) { if (!c.p.jail) return false; },
      t: '你的刑期已经过半，表现也不错。今天，你要在减刑委员会面前陈述。|You\'re past the halfway mark with a good record. Today you face the review board.',
      o: [
        { t: '真诚忏悔|Show genuine remorse', run: function (c) { var j = c.p.jail, ok = G.ch(.35 + c.p.st.eq / 250 + (c.p.h.karma > 0 ? .1 : 0)); if (ok) { var cut = Math.max(1, Math.round(j.left * .35)); j.left = Math.max(1, j.left - cut); c.add('happy', 10); return G.L('委员会被你打动了，刑期减少{y}年。|The board was moved. {y} years off your sentence.', { y: cut }); } c.add('happy', -5); return '委员会说“再观察一段时间”。|The board said, "We\'ll keep watching."'; } },
        { t: '说自己是被冤枉的|Insist you were wronged', run: function (c) { c.add('happy', -6); return '委员会认为你“认罪态度不好”，驳回了申请。|The board found you "unrepentant" and denied it.'; } },
        { t: '只谈出去以后的打算|Talk only about your plans for after', run: function (c) { var j = c.p.jail; if (G.ch(.3 + (c.p.flags.prisonTrade ? .2 : 0) + (c.p.flags.jstudy ? .1 : 0))) { j.left = Math.max(1, j.left - 1); c.add('happy', 6); return '你学的手艺让委员会印象深刻，减刑一年。|The trade you learned impressed the board — a year off.'; } return '委员会听完点了点头，没有表态。|The board nodded, but made no promise.'; } }
      ] }
  ]);

  /* ---------------- after release ---------------- */
  G.evs([
    E('ex_home', [14, 99], '回家|Coming Home', '🚪', function (c) { return c.prm.wel ? '你回到家，{n}已经做好了一桌菜，什么也没问，只说了一句“回来就好”。|You come home to find {n} has cooked a feast. No questions — just "You\'re home. That\'s what matters."' : '你回到原来的住处，门锁已经换了。邻居们远远地看着你，窃窃私语。|You return to your old place; the locks have been changed. The neighbors stare and whisper.'; }, [
      O('抱住家人|Hug your family', R('你哭得像个孩子。|You cried like a child.', { happy: 8, par: 6 }), { if: function (c) { return c.prm.wel; } }),
      O('找个便宜的地方先住下|Find somewhere cheap to stay', R('你在城中村租了一个没有窗户的小单间，一切从头开始。|You rented a windowless room in an urban village and started from zero.', { happy: -4, eq: 2, money: -300 })),
      O('去找以前的朋友|Look up old friends', RC(.4, '还是有朋友愿意拉你一把。|Some friends still had your back.', { happy: 5 }, '以前的朋友都躲着你。|Your old friends all avoided you.', { happy: -6 }))
    ], { sys: 1, prep: function (c) { var f = N.rel('father', 'mother').concat(N.spouse() ? [N.spouse()] : []).filter(function (n) { return n.alive && n.aff > 10; }); c.prm.wel = f.length > 0; if (f.length) c.prm.n = f[0].name; } }),
    E('ex_job', [16, 70], '处处碰壁|Doors Closing', '📋', '你投了几十份简历，面试官一看到档案上的记录，就说“回去等通知”。|You sent out dozens of applications. Every interviewer sees your record and says, "We\'ll be in touch."', [
      O('隐瞒前科|Hide your record', RC(.45, '你找到了一份工作，但每天都怕被发现。|You landed a job, but live in fear of being found out.', { happy: 2, stress: 10 }, '入职背调查出了记录，你当天就被辞退了。|The background check flagged you; you were let go the same day.', { happy: -8 })),
      O('如实相告，找愿意给机会的人|Be honest and find someone who\'ll give you a chance', function (c) { var ok = G.ch(.35 + (c.p.flags.prisonTrade ? .25 : 0)); if (ok) { var J2 = G.JOBS.filter(function (j) { return !j.pt && j.deg <= c.p.edu.deg && ['blue', 'svc'].indexOf(j.cat) >= 0; }); var jb = G.pick(J2); if (jb) G.career.hire(jb); H.fx(c, { happy: 8, karma: 4 }); return '一位老板说：“我也犯过错，我给你一次机会。”|One boss said, "I\'ve made mistakes too. I\'ll give you a chance."'; } H.fx(c, { happy: -5 }); return '没有人愿意冒这个险。|Nobody was willing to take the risk.'; }),
      O('回到老路上去|Go back to the old life', function (c) { c.p.h.heat = (c.p.h.heat || 0) + 10; H.fx(c, { karma: -6, money: 2000 }); return '老朋友们张开双臂欢迎你回来。|Your old crew welcomed you back with open arms.'; })
    ], { sys: 1 }),
    E('ex_shock', [20, 99], '恍如隔世|Another World', '📱', '你在里面待了太久。街上的人都在低头看手机，买东西要扫码，你连地铁票都不会买。|You were inside too long. Everyone stares at their phones, payment is by QR code, and you can\'t even buy a subway ticket.', [
      O('从头学起|Learn it all from scratch', R('一个年轻人耐心地教你用手机。你学得很慢，但没有放弃。|A young stranger patiently taught you to use a phone. You learned slowly, but you didn\'t give up.', { smarts: 2, happy: -2, eq: 2 })),
      O('躲回家里不出门|Hide at home', R('外面的世界让你害怕。|The world outside frightens you.', { happy: -8, health: -2 }))
    ], { sys: 1 }),
    E('ex_crew', [18, 80], '狱友找上门|An Old Cellmate Calls', '📞', '以前的狱友{n}打来电话：“有个来钱快的活，干不干？”|Your old cellmate {n} calls: "Got a job that pays fast. You in?"', [
      O('干！|I\'m in', function (c) { c.p.h.heat = (c.p.h.heat || 0) + 25; H.fx(c, { money: 15000, karma: -10 }); if (c.p.flags.excon && c.p.flags.excon.parole > c.S.year) { (c.S.pendQ = c.S.pendQ || []).push({ id: 'sys_caught' }); return '钱是到手了，可你还在假释期……|You got the money — but you\'re still on parole...'; } return '你又一次越过了那条线。|You crossed the line again.'; }),
      O('拒绝，挂电话|Refuse and hang up', R('你删掉了他的号码。|You deleted his number.', { karma: 5, eq: 1 })),
      O('劝他也收手|Tell him to get out too', RC(.3, '他沉默了很久：“……你说得对。”|He was silent a long time: "...You\'re right."', { karma: 8 }, '他骂你“装什么好人”。|He called you a hypocrite.', { karma: 3 }))
    ], { rep: 1, cd: 4, if: function (S, p) { return !!p.flags.excon && S.year - p.flags.excon.y < 8 && N.rel('inmate', 'friend').some(function (n) { return n.job === '囚犯|Inmate' || n.wasInmate; }); }, prep: function (c) { var n = G.pick(N.all(function (n) { return n.alive && (n.rel === 'inmate' || n.wasInmate); })); if (!n) return false; c.npc = n; c.prm.n = n.name; } }),
    E('ex_redeem', [25, 90], '现身说法|Telling Your Story', '🎤', '一所中学请你去给学生们讲讲你的经历，让他们别走弯路。|A high school invites you to tell students your story, so they won\'t make your mistakes.', [
      O('去讲|Go and speak', R('台下鸦雀无声。散场后，一个男孩跑来对你说：“谢谢你。”|The hall was silent. Afterward a boy ran up and said, "Thank you."', { karma: 10, fame: 3, happy: 6 })),
      O('不想再提起过去|You\'d rather not relive it', R('你婉拒了。|You politely declined.', { happy: -1 }))
    ], { cd: 10, if: function (S, p) { return !!p.flags.excon && S.year - p.flags.excon.y >= 3 && p.h.karma > 0; } })
  ]);
  // ex-inmates stay recognizable after release
  var rel0 = G.EV.sys_release && G.EV.sys_release.run;
  if (rel0) { var r1 = G.EV.sys_release.run; G.EV.sys_release.run = function (c) { N.rel('inmate').forEach(function (n) { n.wasInmate = 1; }); return r1.apply(this, arguments); }; }

  /* title */
  var title0 = G.title;
  G.title = function () { var p = G.S.p; if (p.jail) return p.jail.juv ? '少管所学员|Juvenile Detainee' : '服刑人员|Inmate'; if (p.flags.excon && G.S.year - p.flags.excon.y < 2 && !p.job && !p.fc && !p.biz) return '刑满释放人员|Ex-convict'; return title0.apply(this, arguments); };

  /* ---------------- going broke is not a fresh start ---------------- */
  (function () {
    var d = G.EV.sys_personal_bankrupt; if (!d || !d.o) return;
    var run0 = d.o[0].run;
    d.o[0].run = function (c) {
      var A = c.S.assets, keep = A.debt.filter(function (x) { return x.k === 'fine' || x.k === 'stu' || x.k === 'shark'; });
      var co = A.company;
      var r = run0.apply(this, arguments);
      A.debt = keep; if (co) { A.company = null; G.log('你的公司{c}被清算抵债。|Your company {c} was liquidated to pay creditors.', { c: co.name }); }
      c.p.flags.blacklist = c.S.year + 6;
      var sp = N.spouse(); if (sp) { N.addLove(sp, -20); if (sp.love < 25 && G.ch(.4)) (c.S.pendQ = c.S.pendQ || []).push({ id: 'pr_bk_divorce', nid: sp.id }); }
      N.rel('child').forEach(function (k) { if (k.allow) { k.allow = 0; N.addAff(k, -5); } if (k.sch && k.sch !== 'pub') { k.sch = 'pub'; G.log('{n}从{s}转回了公立学校。|{n} moved from private school back to public school.', { n: k.name, s: '私立学校|private school' }); } });
      return G.join([r, G.L('你被列入了失信名单：六年内不能坐飞机、买房买车、出国、高消费。罚款、助学贷款和高利贷不能免除。|You were put on the debtor blacklist: for six years, no flights, no buying homes or cars, no going abroad, no luxury spending. Fines, student loans and loan-shark debts are not wiped out.')], ' ', ' ');
    };
    G.ev({ id: 'pr_bk_divorce', sys: 1, title: '患难见真情？|For Richer or Poorer?', icon: '💔', bad: 1,
      prep: function (c) { if (!c.npc || !c.npc.alive || c.npc.rel !== 'spouse') return false; c.prm.n = c.npc.name; },
      t: '{n}看着空荡荡的家，说：“我们……分开一段时间吧。”|{n} looks around the emptied home: "Let\'s... take some time apart."',
      o: [
        { t: '求TA留下|Beg them to stay', run: function (c) { if (G.ch(.4)) { N.addLove(c.npc, 15); return '{n}抱住了你：“我们一起扛。”|{n} held you: "We\'ll get through this together."'; } c.npc.rel = 'ex'; c.p.partner = null; G.major('破产后离婚|Divorced after going bankrupt'); return '{n}还是走了。|{n} left anyway.'; } },
        { t: '放TA走|Let them go', run: function (c) { c.npc.rel = 'ex'; c.npc.love = 30; c.p.partner = null; c.add('eq', 2); G.major('破产后离婚|Divorced after going bankrupt'); return '你没有挽留。|You didn\'t try to stop them.'; } }
      ] });
    function bl() { var p = G.S && G.S.p; return p && p.flags.blacklist && G.S.year < p.flags.blacklist ? G.L('你在失信名单上，{y}年前不能这样做。|You\'re on the debtor blacklist until {y}.', { y: G.numEn(p.flags.blacklist) }) : null; }
    G.ACT_CATS.forEach(function (c) {
      if (['travel', 'shop', 'money', 'move', 'gamble'].indexOf(c.id) < 0) return;
      var l = c.lock; c.lock = function () { return (l && l.apply(this, arguments)) || bl(); };
    });
    G.ACT_CATS.forEach(function (c) { if (c.id !== 'hustle') return; c.items.forEach(function (a) { if (a.id !== 'startup') return; var l = a.lock; a.lock = function () { return (l && l.apply(this, arguments)) || bl(); }; }); });
    var buy = G.money.buyHouse; G.money.buyHouse = function () { if (bl()) return false; return buy.apply(this, arguments); };
  })();
})();
