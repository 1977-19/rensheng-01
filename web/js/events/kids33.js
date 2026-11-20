/* Version 3.3 — children who compete, and the one born to inherit.
   - Siblings vie for your attention, fight, tell on each other, get compared, and as adults argue over the family
     money. How you handle it builds or eases a rivalry that is remembered: it changes who loves you, how the
     estate is fought over, and whether they make peace at your bedside.
   - Now and then a child is born "the chosen heir": gifted in looks, mind and heart from the start, marked as such,
     put first when you choose who carries on, and the cause of some jealousy among the others. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function nm(n) { return n ? n.name : ''; }
  function kidsIn(a0, a1) { return N.rel('child').filter(function (k) { var a = N.age(k); return k.alive && a >= a0 && a <= a1; }); }
  function pair(a0, a1) { var L = kidsIn(a0, a1); if (L.length < 2) return null; L = G.sample(L, 2); return L; }
  function riv(n) { var f = P().flags; f.sibRiv = G.clamp((f.sibRiv || 0) + n, 0, 20); }
  function aff(k, v) { if (k) G.dPush('aff', N.addAff(k, v)); }

  /* ---------- the chosen heir ---------- */
  var baby = G.love.baby;
  G.love.baby = async function (other, adopted) {
    var k = await baby.apply(this, arguments);
    try {
      if (k && !adopted) {
        var elite = (G.famClass && G.famClass() >= 2) || (G.DYN33 || []).indexOf(P().origin) >= 0 || P().origin === 'red' || P().origin === 'royal';
        if (G.ch(elite ? .12 : .05) && !N.rel('child').some(function (x) { return x.chosen; })) {
          k.chosen = 1; k.smarts = Math.max(k.smarts || 0, G.ri(88, 100)); k.looks = Math.max(k.looks || 0, G.ri(80, 98)); k.eq = Math.max(k.eq || 0, G.ri(82, 98)); k.health = Math.max(k.health || 0, 90);
          var good = (G.TALENTS || []).filter(function (t) { return !t.neg; }); if (good.length) k.talents = G.sample(good, 2).map(function (t) { return t.id; });
          G.major('{n}出生时，接生的医生说：“这个孩子不一般。”|When {n} was born, the doctor said: "This one is special."', { n: k.name });
        }
      }
    } catch (e) { }
    return k;
  };
  var rn = N.relName;
  N.relName = function (n) { var r = rn.apply(this, arguments); return n && n.chosen && n.rel === 'child' ? G.join([r, '（天选继承人）|(the chosen heir)'], '', ' ') : r; };
  var hs = G.life.heirs;
  if (hs) G.life.heirs = function () { var L = hs.apply(this, arguments) || []; return L.slice().sort(function (a, b) { return (b.chosen ? 1 : 0) - (a.chosen ? 1 : 0); }); };
  var cont = G.life.continueAs;
  G.life.continueAs = function (kid) {
    var was = kid && kid.chosen, r = cont.apply(this, arguments);
    try { if (was) { var p = P(); p.flags.chosenHeir = 1; ['smarts', 'looks', 'eq'].forEach(function (k) { p.st[k] = Math.max(p.st[k] || 0, 85); }); G.major('作为天选继承人接过了家族|Took up the family as the chosen heir'); } } catch (e) { }
    return r;
  };
  // the estate fight is likelier when the children grew up rivals
  if (G.estate && G.estate.risk) { var rk = G.estate.risk; G.estate.risk = function () { var r = rk.apply(this, arguments), f = (P() || {}).flags || {}; return G.clamp(r + (f.sibRiv || 0) * .025 - (f.sibPeace ? .2 : 0), 0, .95); }; }

  function ev(id, a, title, icon, t, opts, ex) { return E(id, a, title, icon, t, opts, Object.assign({ w: 4, noGate: 1 }, ex || {})); }
  G.evs([
    /* ---------- the chosen heir grows up ---------- */
    ev('k33_chosen_early', [32, 70], '这个孩子不一般|This Child Is Different', '✨', function () { var k = N.rel('child').filter(function (x) { return x.chosen; })[0]; return G.L('{n}四岁就会下象棋，六岁能背出整本唐诗，幼儿园老师专门打电话来说：“我教了三十年书，没见过这样的孩子。”|{n} played chess at four and recited a whole poetry anthology at six. The kindergarten teacher phoned: "Thirty years teaching and I\'ve never seen a child like this."', { n: k ? k.name : '' }); }, [
      O('全力培养|Give it everything', function (c) { var k = N.rel('child').filter(function (x) { return x.chosen; })[0]; aff(k, 6); c.money(-c.$(G.ri(3000, 12000))); k.smarts = Math.min(100, (k.smarts || 0) + 4); riv(2); return G.L('你请了最好的老师。其他孩子开始抱怨：“为什么什么都是{n}的？”|You hired the best tutors. The other children began to grumble: "Why does {n} get everything?"', { n: k.name }); }),
      O('让ta像普通孩子一样长大|Let them grow up like any child', function (c) { var k = N.rel('child').filter(function (x) { return x.chosen; })[0]; aff(k, 4); kidsIn(0, 30).forEach(function (x) { if (x !== k) aff(x, 3); }); c.add('happy', 4); return G.L('{n}照样在泥地里打滚、和兄弟姐妹抢遥控器。天赋没有消失，只是多了一点人味。|{n} still rolled in the mud and fought the others for the remote. The gift didn\'t fade — it just came with a heart.', { n: k.name }); })
    ], { if: function () { return N.rel('child').some(function (x) { var a = N.age(x); return x.chosen && a >= 4 && a <= 9; }); } }),
    ev('k33_chosen_named', [40, 85], '天选继承人|The Chosen Heir', '👑', function (c) { var k = N.rel('child').filter(function (x) { return x.chosen; })[0]; if (k) c.prm.n = k.name; return G.L('家族里的长辈、公司的老臣，甚至来家里做客的朋友，都开始说同一句话：“以后这个家，要交给{n}。”|Elders, old hands at the company, even visiting friends all began to say the same thing: "One day this family belongs to {n}."', { n: k ? k.name : '' }); }, [
      O('当众宣布：{n}是继承人|Announce it: {n} is the heir', function (c) { var k = N.rel('child').filter(function (x) { return x.chosen; })[0]; k.heirNamed = 1; aff(k, 10); kidsIn(0, 80).forEach(function (x) { if (x !== k) aff(x, -8); }); riv(4); c.p.flags.heirNamed = k.id; return G.L('{n}站在你身边，接受了所有人的祝贺。另外几个孩子，那天提前离开了。|{n} stood at your side and took everyone\'s congratulations. The others left early that day.', { n: k.name }); }),
      O('“谁接班，看本事，不看天分。”|"Whoever earns it, not whoever was born gifted."', function (c) { kidsIn(0, 80).forEach(function (x) { aff(x, 3); }); riv(-3); return G.L('孩子们都松了一口气，包括那个被叫作“天选”的孩子。|The children all breathed out — the "chosen" one included.'); })
    ], { if: function () { return N.rel('child').some(function (x) { return x.chosen && N.age(x) >= 16; }) && N.rel('child').length >= 2; } }),

    /* ---------- rivalry ---------- */
    ev('k33_attention', [28, 60], '争宠|Competing for You', '🎨', function (c) { var L = pair(4, 13); c.prm.aid = L[0].id; c.prm.bid = L[1].id; c.prm.a = L[0].name; c.prm.b = L[1].name; return G.L('你刚进门，{a}就举着一张画冲过来：“看我画的！”{b}也跑过来，把一张一百分的卷子塞到你手里：“看我的！”两个人都在等你先夸谁。|The moment you walk in, {a} rushes up with a drawing: "Look what I made!" {b} shoves a perfect test paper at you: "Look at mine!" Both wait to see whom you praise first.', { a: L[0].name, b: L[1].name }); }, [
      O('先夸画|Praise the drawing first', function (c) { var a = S().npcs[c.prm.aid], b = S().npcs[c.prm.bid]; aff(a, 6); aff(b, -5); riv(2); return G.L('{b}把卷子揉成一团，跑回了房间。|{b} crumpled the test and ran to their room.', { b: b.name }); }),
      O('先夸卷子|Praise the test first', function (c) { var a = S().npcs[c.prm.aid], b = S().npcs[c.prm.bid]; aff(b, 6); aff(a, -5); riv(2); return G.L('{a}默默把画放在了桌上，再也没提。|{a} quietly put the drawing down and never mentioned it again.', { a: a.name }); }),
      O('一手一个，一起抱起来|Scoop them both up at once', function (c) { var a = S().npcs[c.prm.aid], b = S().npcs[c.prm.bid]; aff(a, 4); aff(b, 4); riv(-1); c.add('health', -1); return G.L('你的腰差点闪了，但两个孩子都笑得很开心。那张画和那张卷子，被你一起贴在了冰箱上。|You nearly put your back out, but both were laughing. The drawing and the test went up on the fridge side by side.'); })
    ], { if: function () { return !!pair(4, 13); } }),
    ev('k33_fight', [28, 60], '打起来了|They\'re Fighting', '🥊', function (c) { var L = pair(6, 16); c.prm.aid = L[0].id; c.prm.bid = L[1].id; c.prm.a = L[0].name; c.prm.b = L[1].name; return G.L('客厅里传来一声巨响。{a}和{b}为了一个游戏机扭打在一起，一个流鼻血，一个哭得喘不过气。|A crash from the living room. {a} and {b} are wrestling over a game console — one has a bloody nose, the other is sobbing.', { a: L[0].name, b: L[1].name }); }, [
      O('两个都罚|Punish both', function (c) { var a = S().npcs[c.prm.aid], b = S().npcs[c.prm.bid]; aff(a, -3); aff(b, -3); riv(-1); return G.L('游戏机被没收了一个月。两个孩子第一次站在了同一边——一起生你的气。|The console was confiscated for a month. For once they were on the same side: both mad at you.'); }),
      O('让他们自己谈出一个规则|Make them work out rules themselves', function (c) { var a = S().npcs[c.prm.aid], b = S().npcs[c.prm.bid]; aff(a, 3); aff(b, 3); riv(-3); c.add('eq', 2); return G.L('他们谈了一个小时，写了一张《游戏机使用公约》，贴在电视旁边。后来，这张纸在家里贴了十年。|An hour of negotiation produced a "Console Treaty" taped by the TV. It stayed up for ten years.'); }),
      O('护着小的那个|Side with the younger one', function (c) { var a = S().npcs[c.prm.aid], b = S().npcs[c.prm.bid], y = N.age(a) < N.age(b) ? a : b, o = y === a ? b : a; aff(y, 5); aff(o, -8); riv(4); return G.L('{o}瞪着你说：“你永远偏心！”那句话，你记了很多年。|{o} glared: "You always take their side!" You remembered it for years.', { o: o.name }); })
    ], { if: function () { return !!pair(6, 16); } }),
    ev('k33_telltale', [28, 60], '告状|Telling Tales', '🗣️', function (c) { var L = pair(6, 14); c.prm.aid = L[0].id; c.prm.bid = L[1].id; c.prm.a = L[0].name; c.prm.b = L[1].name; return G.L('{a}跑来告状：“{b}偷偷玩手机到半夜！”{b}在门口喊：“{a}上次考试作弊！”|{a} runs to you: "{b} was on the phone till midnight!" {b} shouts from the door: "{a} cheated on the last test!"', { a: L[0].name, b: L[1].name }); }, [
      O('两件事都查清楚|Look into both', function (c) { var a = S().npcs[c.prm.aid], b = S().npcs[c.prm.bid]; aff(a, -2); aff(b, -2); riv(-1); c.add('smarts', 1); return G.L('两件事都是真的。你各罚了一样，也各奖了一样：谁先主动认错，周末就去游乐园。|Both were true. One penalty each, and one reward: whoever owned up first got the amusement park on Saturday.'); }),
      O('“告状的人，罚得更重。”|"Tattletales get the bigger punishment."', function (c) { var a = S().npcs[c.prm.aid], b = S().npcs[c.prm.bid]; aff(a, -5); aff(b, -5); riv(-2); return G.L('从此家里再也没人告状——可也没人跟你说实话了。|No one ever told tales again — or told you much of anything.'); })
    ], { if: function () { return !!pair(6, 14); } }),
    ev('k33_compare', [35, 65], '“你看看人家”|"Why Can\'t You Be Like Them?"', '📊', function (c) { var L = pair(12, 18).sort(function (x, y) { return (y.edu && y.edu.perf || 50) - (x.edu && x.edu.perf || 50); }); c.prm.aid = L[0].id; c.prm.bid = L[1].id; c.prm.a = L[0].name; c.prm.b = L[1].name; return G.L('期末成绩出来了，{a}全年级第三，{b}倒数第十。亲戚们在饭桌上已经开始比了。|Final grades: {a} third in the year, {b} tenth from the bottom. The relatives are already comparing at the dinner table.', { a: L[0].name, b: L[1].name }); }, [
      O('当着亲戚的面夸{b}别的长处|In front of everyone, praise what {b} is good at', function (c) { var a = S().npcs[c.prm.aid], b = S().npcs[c.prm.bid]; aff(b, 8); aff(a, 2); riv(-2); return G.L('你说{b}修好了全家的电脑、做饭比你还好吃。{b}低着头，耳朵红了。|You said {b} fixed every computer in the house and cooks better than you. {b} looked down, ears pink.', { b: b.name }); }),
      O('让{a}给{b}补课|Have {a} tutor {b}', function (c) { var a = S().npcs[c.prm.aid], b = S().npcs[c.prm.bid]; if (G.ch(.55)) { aff(a, 3); aff(b, 3); riv(-3); return G.L('补了一个学期，{b}进步了两百名。两个人从此成了最好的搭档。|One term later {b} had climbed two hundred places. The two became a team.', { b: b.name }); } aff(a, -4); aff(b, -4); riv(3); return G.L('第一次补课就吵翻了。{b}说：“我不需要你可怜我！”|The first session ended in a row. {b}: "I don\'t need your pity!"', { b: b.name }); }),
      O('“{b}，你看看你哥哥/姐姐！”|"{b}, look at your sibling!"', function (c) { var a = S().npcs[c.prm.aid], b = S().npcs[c.prm.bid]; aff(b, -10); aff(a, -2); riv(5); return G.L('{b}放下筷子，回了房间。那一晚，{a}也没睡好。|{b} put down the chopsticks and went to their room. {a} didn\'t sleep well either.', { a: a.name, b: b.name }); })
    ], { if: function () { return !!pair(12, 18); } }),
    ev('k33_jealous_heir', [38, 80], '“凭什么是ta？”|"Why Them?"', '😤', function (c) { var k = N.rel('child').filter(function (x) { return x.chosen; })[0], o = N.rel('child').filter(function (x) { return x !== k && N.age(x) >= 14; })[0]; c.prm.aid = k.id; c.prm.bid = o.id; c.prm.a = k.name; c.prm.b = o.name; return G.L('{b}终于爆发了：“从小到大，所有人眼里只有{a}。我做什么都不够好，对吗？”|{b} finally explodes: "All my life everyone only sees {a}. Nothing I do is ever enough, is it?"', { a: k.name, b: o.name }); }, [
      O('单独带{b}去旅行一周|Take {b} away for a week, just the two of you', function (c) { var b = S().npcs[c.prm.bid]; aff(b, 12); riv(-4); c.money(-c.$(2000)); return G.L('一周里你只听{b}说话。回来的路上，{b}说：“其实我一直挺佩服{a}的，就是想让你也看看我。”|For a week you only listened to {b}. On the way home: "I do admire {a}. I just wanted you to see me too."', { b: b.name, a: S().npcs[c.prm.aid].name }); }),
      O('“{a}就是比你优秀。”|"{a} simply is better than you."', function (c) { var b = S().npcs[c.prm.bid]; aff(b, -15); riv(6); return G.L('{b}收拾东西搬了出去，很多年没有回家过年。|{b} packed up and moved out, and didn\'t come home for New Year for many years.', { b: b.name }); })
    ], { if: function () { var k = N.rel('child').filter(function (x) { return x.chosen; })[0]; return !!k && N.rel('child').some(function (x) { return x !== k && N.age(x) >= 14; }); } }),
    ev('k33_money_fight', [50, 90], '饭桌上的家产|The Estate at the Dinner Table', '💼', function (c) { var L = pair(25, 70); c.prm.aid = L[0].id; c.prm.bid = L[1].id; c.prm.a = L[0].name; c.prm.b = L[1].name; return G.L('你的生日宴上，{a}和{b}为了谁来管家里的生意/房子吵了起来，越吵越大声，宾客们都放下了筷子。|At your birthday dinner, {a} and {b} start arguing over who will run the family business / get the house. It gets louder until the guests put down their chopsticks.', { a: L[0].name, b: L[1].name }); }, [
      O('当场立下规矩：平分|Lay down the rule then and there: equal shares', function (c) { var a = S().npcs[c.prm.aid], b = S().npcs[c.prm.bid]; aff(a, -2); aff(b, -2); riv(-3); return G.L('你说：“谁再提这件事，一分钱都拿不到。”两个人都闭嘴了。|You said: "Whoever raises this again gets nothing." Both fell silent.'); }),
      O('趁现在写好遗嘱，请律师公证|Have a will drawn up and notarised now', function (c) { c.money(-c.$(800)); riv(-5); c.p.flags.sibPeace = 1; return G.L('律师当着全家人的面宣读了遗嘱。没有人满意，但也没有人再吵。|The lawyer read the will to the whole family. Nobody was pleased, and nobody argued again.'); }),
      O('站在{a}那边|Take {a}\'s side', function (c) { var a = S().npcs[c.prm.aid], b = S().npcs[c.prm.bid]; aff(a, 8); aff(b, -12); riv(6); return G.L('{b}摔了杯子走了。那天以后，兄弟姐妹之间只剩下律师函。|{b} smashed a glass and left. After that, the siblings spoke only through lawyers.', { a: a.name, b: b.name }); })
    ], { if: function () { return !!pair(25, 70) && G.netWorth() > G.$(200000); } }),
    ev('k33_peace', [60, 100], '病床前的和解|Peace at the Bedside', '🕊️', function (c) { var L = pair(25, 80); c.prm.aid = L[0].id; c.prm.bid = L[1].id; c.prm.a = L[0].name; c.prm.b = L[1].name; return G.L('你生病住院了。多年不说话的{a}和{b}，在病房门口撞见了。|You\'re in hospital. {a} and {b}, who haven\'t spoken in years, run into each other at your door.', { a: L[0].name, b: L[1].name }); }, [
      O('拉着他们的手放在一起|Put their hands together', function (c) { var a = S().npcs[c.prm.aid], b = S().npcs[c.prm.bid]; aff(a, 8); aff(b, 8); c.p.flags.sibRiv = 0; c.p.flags.sibPeace = 1; c.add('happy', 10); return G.L('两个人都哭了。那天晚上，他们一起在走廊里守了你一夜。|Both of them cried. That night they kept watch in the corridor together.'); }),
      O('什么都不说，看着他们|Say nothing; just watch them', function (c) { var a = S().npcs[c.prm.aid], b = S().npcs[c.prm.bid]; if (G.ch(.5)) { c.p.flags.sibPeace = 1; aff(a, 4); aff(b, 4); return G.L('{a}先开了口：“爸/妈想喝粥，你去买还是我去？”就这一句，冰化了。|{a} spoke first: "Mum/Dad wants congee — you or me?" With that, the ice broke.', { a: a.name }); } aff(a, 2); aff(b, 2); return G.L('他们一个坐在左边，一个坐在右边，一句话也没说。|One sat on the left, one on the right. Not a word.'); })
    ], { if: function (S2, p) { return (p.flags.sibRiv || 0) >= 6 && !!pair(25, 80) && p.st.health < 60; } })
  ]);
})();
