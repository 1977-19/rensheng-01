/* Childhood with trade-offs: nothing a child does is purely good or purely bad.
   Every action and every childhood choice moves smarts, mood or health — sometimes up, sometimes down. */
(function () {
  'use strict';
  var N = G.N;
  function par() { return N.rel('father', 'mother').filter(function (n) { return n.alive; }); }
  // pick one of several outcomes; each is [text, effects, weight?]
  function mix(a, list, prm) {
    var tot = 0; list.forEach(function (o) { tot += o[2] == null ? 1 : (typeof o[2] === 'function' ? o[2]() : o[2]); });
    var r = G.R() * tot, pick = list[0];
    for (var i = 0; i < list.length; i++) { var w = list[i][2] == null ? 1 : (typeof list[i][2] === 'function' ? list[i][2]() : list[i][2]); if ((r -= w) <= 0) { pick = list[i]; break; } }
    var eff = Object.assign({}, pick[1]);
    // a good moment shouldn't come with a petty penalty attached: drop small minuses when something went well
    var good = ['smarts', 'happy', 'health', 'eq', 'looks'].some(function (k) { return eff[k] > 0; }) || eff.par > 0;
    if (good) ['smarts', 'happy', 'health', 'eq', 'looks'].forEach(function (k) { if (eff[k] < 0 && eff[k] >= -2) delete eff[k]; });
    if (eff.par) { var v = eff.par; delete eff.par; par().forEach(function (n) { N.addAff(n, v); }); }
    return G.quick(a, pick[0], eff, prm);
  }
  function sm() { return G.S.p.st.smarts; } function hp() { return G.S.p.st.happy; } function he() { return G.S.p.st.health; }
  var BABY = [
    { id: 'cry', n: '哇哇大哭|Cry Loudly', i: '😭', e: 5, run: function (a) { return mix(a, [
      ['你哭得惊天动地，妈妈立刻把你抱了起来。|You wail, and Mom scoops you up at once.', { happy: 3, eq: -1 }],
      ['你哭到打嗝，嗓子都哑了。|You cry until you hiccup and go hoarse.', { health: -2, happy: -1 }],
      ['你一哭就有奶喝，你学会了用哭解决问题。|Crying gets you milk — lesson learned.', { happy: 2, smarts: -1 }]]); } },
    { id: 'babble', n: '咿呀学语|Babble', i: '🍼', e: 5, run: function (a) { return mix(a, [
      ['你含糊地喊出了“妈妈”，妈妈激动得哭了。|You mumble "mama," and Mom tears up with joy.', { smarts: 2, happy: 2, par: 3 }],
      ['你咿咿呀呀说了半天，谁也听不懂，急得你直哭。|You babble on and on; no one understands, and you burst into tears.', { smarts: 1, happy: -2 }],
      ['你学大人说话，把“爸爸”喊成了“怕怕”。|You copy the grown-ups and turn "daddy" into "dada-doo."', { smarts: 1, eq: 1, health: -1 }]]); } },
    { id: 'walk', n: '学走路|Learn to Walk', i: '🚼', e: 5, run: function (a) { return mix(a, [
      ['你摇摇晃晃地迈出了人生第一步！|You wobble and take your very first step!', { health: 2, happy: 3 }],
      ['你摔了一跤，额头磕了个包。|You fall and bump your head.', { health: -3, smarts: 1 }],
      ['你扶着沙发走了一圈，累得直接睡着了。|You cruise around the sofa and fall asleep exhausted.', { health: 2, happy: -1 }]]); } },
    { id: 'cute', n: '卖萌|Be Adorable', i: '🥰', e: 5, run: function (a) { return mix(a, [
      ['你冲着大人咯咯笑，大家的心都化了。|You giggle at the grown-ups, and everyone melts.', { happy: 3, par: 3, smarts: -1 }],
      ['你卖萌换来了一块糖，结果吃坏了肚子。|Your charm wins you a candy — and a tummy ache.', { happy: 2, health: -2 }]]); } },
    { id: 'grab', n: '抓东西往嘴里塞|Put Things in Your Mouth', i: '🧦', e: 5, run: function (a) { return mix(a, [
      ['你尝遍了家里的每一样东西，对世界充满了好奇。|You taste everything in the house — the world is fascinating.', { smarts: 2, happy: 2 }, 3],
      ['你啃了一只袜子，被妈妈一把抢了下来，咯咯直笑。|You chew a sock until Mom snatches it away — and giggle.', { smarts: 1, happy: 1 }, 2],
      ['你啃着磨牙棒，口水流了一下巴。|You gnaw a teething ring, drooling happily.', { health: 1, happy: 2 }, 2],
      ['你把一颗纽扣塞进嘴里，妈妈眼疾手快抠了出来。|You put a button in your mouth — Mom fishes it out in a flash.', { health: -1, smarts: 1 }, .25]]); } },
    { id: 'sleep', n: '睡大觉|Sleep a Lot', i: '😴', e: 5, run: function (a) { return mix(a, [
      ['你睡得香甜，长得白白胖胖。|You sleep like an angel and grow round and rosy.', { health: 3, smarts: -1 }],
      ['你白天睡太多，晚上精神抖擞地闹了一夜。|Too much napping — you party all night instead.', { health: 1, happy: 1, par: -2 }]]); } }
  ];
  var KID = [
    { id: 'play', n: '和小朋友玩|Play with Other Kids', i: '🧸', e: 10, run: function (a) { var f = N.make({ rel: 'friend', age: G.S.p.age + G.ri(-1, 1), aff: 25 }); return mix(a, [
      ['你和{n}玩得很开心，成了好朋友。|You had a great time with {n} and became friends.', { happy: 4, eq: 2, smarts: -1 }],
      ['你和{n}为了一个玩具打了一架，最后又和好了。|You and {n} fought over a toy, then made up.', { eq: 2, happy: -2, health: -1 }],
      ['你们在泥坑里玩了一下午，回家被骂了一顿。|You played in the mud all afternoon and got scolded at home.', { happy: 3, health: -2, par: -2 }]], { n: f.name }); } },
    { id: 'draw', n: '画画|Draw Pictures', i: '🖍️', e: 10, run: function (a) { var p = G.S.p; p.sk = p.sk || {}; p.sk.art = Math.min(100, (p.sk.art || 0) + 3); return mix(a, [
      ['你画了一幅“全家福”，被爸妈贴在了墙上。|You drew a family portrait; your parents pinned it on the wall.', { happy: 3, smarts: 1, health: -1 }],
      ['你画得太投入，眼睛都快贴到纸上了。|You got so absorbed your nose was almost touching the paper.', { smarts: 2, health: -2 }],
      ['你在新沙发上画了一条龙。|You drew a dragon on the new sofa.', { happy: 4, par: -4 }]]); } },
    { id: 'tv', n: '看动画片|Watch Cartoons', i: '📺', e: 5, run: function (a) { return mix(a, [
      ['你看动画片看得入了迷，学会了好几首儿歌。|You were glued to cartoons and learned a few songs.', { happy: 4, smarts: 1, health: -2 }],
      ['你看了一整天，眼睛又红又干。|You watched all day; your eyes are red and dry.', { happy: 3, health: -3, smarts: -1 }],
      ['你学着动画片里的人从床上往下跳，摔了一跤。|You copied a cartoon hero, jumped off the bed, and fell.', { happy: 2, health: -4 }]]); } },
    { id: 'tantrum', n: '撒泼打滚|Throw a Tantrum', i: '😤', e: 5, run: function (a) { return mix(a, [
      ['你在商场里打滚要玩具，最后被拎回了家。|You rolled on the mall floor for a toy and got carried home.', { happy: -3, par: -3, eq: -1 }],
      ['你哭闹到最后，还是得到了一根棒棒糖。|After all that crying, you got a lollipop.', { happy: 4, eq: -2, health: -1, par: -2 }],
      ['爸爸没理你，你哭累了自己爬了起来，突然觉得有点丢人。|Dad ignored you. You cried yourself out and felt a little silly.', { eq: 2, happy: -2 }]]); } },
    { id: 'snack', n: '缠着爸妈要零食|Beg for Snacks', i: '🍭', e: 5, run: function (a) { return mix(a, [
      ['你吃了一大包薯片，晚饭一口没吃。|You ate a whole bag of chips and skipped dinner.', { happy: 4, health: -3 }],
      ['爸妈让你自己想办法挣零食：帮忙扫地换一颗糖。|Your parents made you earn it: one sweep, one candy.', { smarts: 1, eq: 1, happy: 1 }],
      ['你只会伸手要，爸妈叹气说你太依赖人了。|All you do is ask; your parents sigh that you rely on them for everything.', { happy: 2, smarts: -2 }]]); } },
    { id: 'blocks', n: '自己拼积木|Build with Blocks', i: '🧱', e: 10, run: function (a) { return mix(a, [
      ['你自己搭出了一座城堡，越想越有办法。|You built a whole castle by yourself, figuring it out as you went.', { smarts: 3, happy: 2, health: -1 }, function () { return .5 + sm() / 100; }],
      ['积木怎么也搭不起来，你气得把它们全推倒了。|The tower kept falling; you knocked it all over in frustration.', { happy: -3, smarts: 1 }],
      ['你踩到一块积木，疼得直跳脚。|You stepped on a block and hopped around in pain.', { health: -2, smarts: 1 }]]); } },
    { id: 'outside', n: '去外面疯跑|Run Around Outside', i: '🏃', e: 10, run: function (a) { return mix(a, [
      ['你在外面跑了一下午，晚上吃了两碗饭。|You ran around all afternoon and ate two bowls of rice at dinner.', { health: 4, happy: 3, smarts: -1 }],
      ['你爬树摔了下来，膝盖磕破了皮。|You fell out of a tree and skinned your knee.', { health: -4, happy: 1, eq: 1 }],
      ['你认识了一只流浪猫，每天都去喂它。|You befriended a stray cat and feed it every day.', { happy: 4, eq: 2, health: -1 }]]); } },
    { id: 'read', n: '看绘本|Read Picture Books', i: '📚', e: 10, run: function (a) { return mix(a, [
      ['你认识了好多字，还会给爸妈讲故事。|You learned lots of words and now tell your parents stories.', { smarts: 3, par: 2, health: -1 }],
      ['你躲在被窝里打着手电筒看书，第二天起不来床。|You read under the covers with a flashlight and couldn\'t get up the next day.', { smarts: 2, health: -2, happy: 1 }],
      ['书里的大灰狼让你做了一晚噩梦。|The big bad wolf gave you nightmares all night.', { smarts: 1, happy: -3 }]]); } },
    { id: 'chores', n: '帮爸妈做家务|Help with Chores', i: '🧹', e: 10, run: function (a) { return mix(a, [
      ['你学会了叠衣服，爸妈夸你懂事。|You learned to fold laundry; your parents say you\'re grown-up.', { eq: 2, par: 4, happy: -1 }],
      ['你洗碗时打碎了一个盘子。|You broke a plate washing up.', { happy: -3, health: -1, eq: 1 }],
      ['你“帮忙”把家里弄得更乱了。|Your "help" made the house messier.', { happy: 2, par: -2, smarts: 1 }]]); } },
    { id: 'why', n: '问“为什么”|Ask "Why?"', i: '❓', e: 5, run: function (a) { return mix(a, [
      ['你问倒了全家人，爸爸给你买了一套百科全书。|You stumped the whole family; Dad bought you an encyclopedia.', { smarts: 3, par: 1, happy: 1 }],
      ['你问得太多，妈妈不耐烦地说“长大就知道了”。|So many questions — Mom snapped, "You\'ll understand when you\'re older."', { smarts: 1, happy: -2 }]]); } },
    { id: 'tablet', n: '玩平板电脑|Play on a Tablet', i: '📱', e: 5, era: { g: 2010, cn: 2012 }, run: function (a) { return mix(a, [
      ['你玩了一下午游戏，开心极了。|You played games all afternoon — pure bliss.', { happy: 5, health: -3, smarts: -1 }],
      ['你用平板学会了二十个英文单词。|You learned twenty English words on the tablet.', { smarts: 3, health: -2 }],
      ['平板被没收了，你哭了一个小时。|The tablet was confiscated; you cried for an hour.', { happy: -4, eq: 1 }]]); } }
  ];
  G.ACT_BABY.length = 0; BABY.forEach(function (x) { G.ACT_BABY.push(x); });
  G.ACT_KID.length = 0; KID.forEach(function (x) { G.ACT_KID.push(x); });
  if (G.ERA_ACT) G.ACT_KID.forEach(function (a) { if (G.ERA_ACT[a.id] && !a.era) a.era = G.ERA_ACT[a.id]; });

  // school actions: no free lunch
  function patch(id, fn) { var a = (G.ACT_SCHOOL || []).filter(function (x) { return x.id === id; })[0]; if (a) a.run = fn(a.run); }
  patch('slack', function () { return function (a) { var p = G.S.p; p.edu.study -= .5; return mix(a, [
    ['你在课本上画了一节课的漫画，挺开心，但完全没听懂。|You doodled through class — fun, but you understood nothing.', { happy: 4, smarts: -2 }],
    ['你传纸条被老师抓到，罚站了一节课。|Caught passing notes — you stood at the back for the period.', { happy: -3, eq: 1 }],
    ['你趴在桌上睡了一觉，精神多了。|You napped on your desk and feel refreshed.', { health: 2, smarts: -1 }]]); }; });
  patch('skip', function (orig) { return function (a) { if (G.ch(.2)) return orig(a); var p = G.S.p; p.edu.study -= 1; return mix(a, [
    ['你逃课去了网吧，玩得很爽，回家却撒了个谎。|You skipped to play games — great fun, followed by a lie at home.', { happy: 5, smarts: -2, karma: -1 }],
    ['你逃课去河边钓鱼，想了很多事情。|You skipped to fish by the river and did a lot of thinking.', { happy: 3, eq: 1, smarts: -1 }],
    ['你逃课被教导主任当场抓住，叫了家长。|The dean caught you in the act and called your parents.', { happy: -5, par: -5 }]]); }; });
  patch('friend', function () { return function (a) { var f = N.make({ rel: 'classmate', age: G.S.p.age + G.ri(-1, 1), aff: G.ri(15, 35) }); return mix(a, [
    ['你和同学{n}聊得很投机，放学后一起疯玩，作业忘写了。|You hit it off with {n} and played after school — homework forgotten.', { happy: 3, eq: 1, smarts: -1 }],
    ['你和{n}成了学习搭子，一起刷题，就是有点累。|You and {n} became study buddies — productive, if tiring.', { smarts: 1, eq: 1, happy: -1 }],
    ['你请{n}喝饮料、吃零食，花光了零花钱才交到这个朋友。|You spent all your pocket money on snacks to win {n} over.', { eq: 2, happy: 1, health: -1 }]], { n: f.name }); }; });

  /* safety net: in childhood and the teen years every event choice must gain something and cost something.
     Wraps option runs so the balancing shows up in the result card. */
  var KEYS = ['smarts', 'happy', 'health'];
  function balance(before) {
    var p = G.S.p, up = [], down = [];
    ['smarts', 'happy', 'health', 'eq'].forEach(function (k) { var dv = p.st[k] - before[k]; if (dv > 0.4) up.push(k); else if (dv < -0.4) down.push(k); });
    if (up.length && !down.length) G.addStat(G.pick(KEYS.filter(function (k) { return up.indexOf(k) < 0; })) || 'happy', -G.ri(1, 3));
    else if (down.length && !up.length) G.addStat(G.pick(['smarts', 'eq'].filter(function (k) { return down.indexOf(k) < 0; })) || 'eq', G.ri(1, 2));
    else if (!up.length && !down.length) { var k = G.pick(KEYS); G.addStat(k, (G.ch(.5) ? 1 : -1) * G.ri(1, 2)); }
  }
  function wrapOpt(d, o) {
    if (o._kb) return; o._kb = 1;
    var run = o.run;
    o.run = async function (c) {
      var p = G.S && G.S.p;
      if (!p || p.age >= 18 || d.sys || d.noBal) return run ? run.apply(this, arguments) : null;
      var before = { smarts: p.st.smarts, happy: p.st.happy, health: p.st.health, eq: p.st.eq };
      var r = run ? await run.apply(this, arguments) : null;
      // (no forced cost any more: a kind choice like taking in a kitten is simply good)
      return r;
    };
  }
  function wrapEv(d) { if (d && d.o && d.o.length > 1) d.o.forEach(function (o) { wrapOpt(d, o); }); }
  Object.keys(G.EV).forEach(function (id) { wrapEv(G.EV[id]); });
  var ev = G.ev;
  G.ev = function (d) { var r = ev.apply(this, arguments); wrapEv(G.EV[d && d.id]); return r; };
})();
