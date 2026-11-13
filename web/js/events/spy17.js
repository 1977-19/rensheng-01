/* Version 1.7: the intelligence service gets its own stories — a defector at the door, a partner who sells
   you out, an enemy agent you fall for, a secret medal no one may ever see. Every one of them still needs your
   instinct. */
(function () {
  "use strict";
  var N = G.N;
  function S() { return G.S; }
  function P() { return G.S.p; }
  function sp() { return P().spy; }
  function merit(n) { if (sp()) sp().merit += n; }
  function heat(n) { if (sp()) sp().heat = G.clamp((sp().heat || 0) + n, 0, 100); }
  function cash(usd) { var m = G.$(usd); if (G.fin) G.fin.tag = G.L("情报工作|Intelligence work"); G.addMoney(m); if (G.fin) G.fin.tag = null; return m; }
  async function test(name, rounds, diff) { return G.spyGame({ name: name, rounds: rounds || 1, diff: diff || 0 }); }

  var STORIES = [
    { id: "ss_defector", t: "敲门的叛逃者|A Defector at the Door", i: "🚪", min: 1,
      s: "深夜，一个浑身湿透的男人敲开你的安全屋：“我是对方情报局的，我要叛逃。我手里有他们在你们这边的内鬼名单。”|At midnight a soaked man knocks on your safe house: “I’m from their service. I want to defect. I have the list of their moles inside yours.”",
      o: [{ t: "接收他，但先验证（直觉小游戏）|Take him in — but verify first (instinct test)", run: async function () { var r = await test("验证叛逃者|Verify the Defector", 2); if (r.ok) { merit(80); cash(150000); G.major("接收了一名重要的叛逃者|Brought in a major defector"); return G.L("名单是真的。总部连夜抓了三个内鬼。你被记了特等功。|The list was real. HQ arrested three moles overnight. You were given the highest commendation."); } heat(30); return G.L("他是对方派来的诱饵。名单上全是你们最忠诚的人。|He was bait. Every name on the list was one of your most loyal people."); } },
        { t: "拒绝，送他离开|Turn him away", run: function () { heat(-5); return G.L("第二天，他的尸体在河里被发现。你永远不知道他是不是真的。|The next day his body was found in the river. You’ll never know if he was real."); } }] },
    { id: "ss_partner", t: "出卖你的搭档|The Partner Who Sold You", i: "🗡️", min: 2,
      s: "你发现，和你搭档了五年的人一直在把你的行动路线卖给对方。|You discover the partner you’ve worked with for five years has been selling your routes to the other side.",
      o: [{ t: "将计就计，喂假情报（直觉小游戏）|Play along and feed false intel (instinct test)", run: async function () { var r = await test("反向利用|Turn the Tables", 2, .05); if (r.ok) { merit(100); G.major("将计就计，粉碎了一个间谍网|Turned a traitor and broke a spy ring"); return G.L("对方根据你的假情报行动，整个网络被一锅端。你的搭档被捕时，看了你一眼，什么也没说。|They acted on your false intel and the whole network was rolled up. When your partner was arrested, they looked at you and said nothing."); } heat(35); return G.L("对方识破了，你的搭档也消失了。|They saw through it, and your partner vanished."); } },
        { t: "立刻上报|Report it at once", run: function () { merit(40); return G.L("搭档被带走了。你在空荡荡的办公室里坐了很久。|Your partner was taken away. You sat in the empty office a long time."); } }] },
    { id: "ss_enemy_love", t: "对方的特工|The Other Side’s Agent", i: "💘", min: 1,
      s: "你奉命接近对方的一名特工，套取情报。几个月后，你发现自己真的爱上了ta——而ta似乎也一样。|Ordered to get close to an enemy agent, months later you realise you’ve truly fallen for them — and they seem to feel the same.",
      o: [{ t: "继续任务，套取情报（直觉小游戏）|Stay on mission (instinct test)", run: async function () { var r = await test("情报与心|Intelligence or the Heart", 1); if (r.ok) { merit(70); cash(80000); return G.L("你拿到了情报。分别那天，ta说：“我早就知道你是谁。我只是想多和你待一会儿。”|You got the intel. On the day you parted they said: “I always knew who you were. I just wanted more time with you.”"); } heat(25); return G.L("你犹豫了一下，ta看出来了。从此你们都换了身份。|You hesitated; they noticed. You both changed identities after that."); } },
        { t: "向组织坦白，申请退出任务|Confess to HQ and ask off the case", run: function () { merit(-10); var p = P(), g = p.orient === "gay" ? p.g : (p.g === "m" ? "f" : "m"); var n = N.mkRomantic({ love: 70, aff: 50 }); n.g = g; n.rel = "lover"; n.pin = 1; n.enemyAgent = 1; n.job = "“外交官”|“Diplomat”"; if (!p.partner) p.partner = n.id; return G.L("组织撤回了任务。半年后，ta出现在你家楼下：“我也辞职了。”|HQ pulled you off. Six months later they appeared outside your building: “I quit too.”"); } }] },
    { id: "ss_medal", t: "看不见的勋章|A Medal No One Will See", i: "🎖️", min: 3,
      s: "局长在一间没有窗户的房间里，给你颁发了一枚勋章。“这枚勋章不会出现在任何档案里。你不能告诉任何人，包括家人。”|In a windowless room, the director pins a medal on you. “This will appear in no file. You may tell no one, not even family.”",
      o: [{ t: "敬礼|Salute", run: function () { merit(30); G.addStat("happy", 10); G.major("被秘密授勋|Received a secret decoration"); return G.L("回家后，孩子问你今天做了什么。你说：“开了一天会。”|At home your child asked what you did today. “Meetings all day,” you said."); } }] },
    { id: "ss_new_identity", t: "新的身份|A New Identity", i: "🪪", min: 2,
      s: "总部要派你去对方国家长期潜伏十年。你会有新的名字、新的过去，可能还会有一个“假”的家庭。|HQ wants you deep under cover in their country for ten years: a new name, a new past, perhaps even a “fake” family.",
      o: [{ t: "接受|Accept", run: async function () { var r = await test("融入|Blending In", 1); if (r.ok) { merit(120); cash(400000); return G.L("十年里你从没被怀疑过。回国那天，你差点忘了自己的真名。|Ten years without suspicion. The day you came home, you almost forgot your real name."); } heat(30); merit(40); return G.L("你在第三年被盯上，紧急撤回了。|You were spotted in year three and pulled out in a hurry."); } },
        { t: "拒绝，家里离不开|Refuse — your family needs you", run: function () { merit(-5); return G.L("局长点点头：“理解。”但你知道，这会影响你的晋升。|The director nodded: “Understood.” You knew it would cost you promotion."); } }] },
    { id: "ss_family_doubt", t: "家人的怀疑|Your Family Suspects", i: "🏠", min: 0,
      s: "你的伴侣把你的第二本护照摔在桌上：“这个名字是谁？你到底是做什么的？”|Your partner slams your second passport on the table: “Whose name is this? What do you really do?”",
      o: [{ t: "编一个完美的谎言（直觉小游戏）|Tell a perfect lie (instinct test)", run: async function () { var r = await test("家里的谎言|A Lie at Home", 1); var pt = N.partner(); if (r.ok) { if (pt) N.addLove(pt, -2); return G.L("ta相信了。你抱着ta的时候，心里很难受。|They believed you. Holding them, you felt sick inside."); } if (pt) N.addLove(pt, -20); return G.L("ta不信，摔门而去。|They didn’t believe you and stormed out."); } },
        { t: "说出一部分真相|Tell part of the truth", run: function () { heat(15); var pt = N.partner(); if (pt) N.addLove(pt, 8); return G.L("ta沉默了很久，然后握住你的手：“我不问了。你要平安回来。”|They were silent a long time, then took your hand: “I won’t ask. Just come home safe.”"); } }],
      need: function () { return !!N.partner(); } },
    { id: "ss_handler_gone", t: "上线失踪了|Your Handler Is Gone", i: "❓", min: 1,
      s: "你的上线已经一周没有联系你了，安全屋里的东西都被清空了。|Your handler hasn’t made contact for a week. The safe house has been emptied.",
      o: [{ t: "按应急程序静默，等待（直觉小游戏）|Go silent by protocol and wait (instinct test)", run: async function () { var r = await test("静默|Going Dark", 1); if (r.ok) { heat(-15); merit(20); return G.L("三个月后，一个新的联络人在菜市场找到了你，说出了正确的暗号。|Three months later a new contact found you at the market and gave the right code."); } heat(25); return G.L("你等不及去找他，结果被人跟踪了。|You couldn’t wait and went looking — and were followed."); } }] },
    { id: "ss_assassin", t: "同行的葬礼|A Colleague’s Funeral", i: "⚰️", min: 2,
      s: "一位退休的老特工被“意外”撞死了。葬礼上，你收到一张纸条：“下一个是你。”|A retired agent dies in an “accident”. At the funeral someone slips you a note: “You’re next.”",
      o: [{ t: "找出发纸条的人（直觉小游戏）|Find who sent it (instinct test)", run: async function () { var r = await test("找出刺客|Find the Assassin", 2, .05); if (r.ok) { merit(90); return G.L("你在他动手之前揪出了他。他是对方派来的清洁工。|You found him before he struck — a cleaner sent by the other side."); } if (G.ch(.25)) { G.die(G.L("在执行任务时被暗杀|Assassinated in the line of duty")); return ""; } G.addStat("health", -25); heat(20); return G.L("你在一次刹车失灵中捡回了一条命。|You survived a brake failure by a hair."); } },
        { t: "申请保护，暂时撤离|Request protection and withdraw", run: function () { heat(-20); merit(-10); return G.L("你在一个小岛上躲了半年。|You hid on a small island for six months."); } }] },
    { id: "ss_turn_offer", t: "反向策反|They Want to Turn You", i: "🔄", min: 2,
      s: "对方的情报官在一家餐厅找到你，推过来一张支票：“为我们工作，这是第一年的报酬。”数字后面有七个零。|Their officer finds you in a restaurant and slides over a cheque: “Work for us. Your first year.” The figure has seven zeros.",
      o: [{ t: "假装答应，成为双面间谍（直觉小游戏）|Pretend to agree and become a double agent (instinct test)", run: async function () { var r = await test("双面|Two Faces", 3, .08); if (r.ok) { merit(150); cash(300000); G.major("成为双面间谍，为本国套取了大量情报|Became a double agent and fed home a trove of secrets"); return G.L("三年里，你给两边都“提供”情报——只有一边拿到的是真的。|For three years you “served” both sides — only one got the truth."); } heat(50); return G.L("你的上级怀疑你真的叛变了。你接受了长达一个月的审查。|Your own side suspected you’d really turned. You endured a month of interrogation."); } },
        { t: "当场拒绝|Refuse on the spot", run: function () { merit(20); return G.L("他笑了笑，把支票收了回去：“我们还会再见的。”|He smiled and took the cheque back. “We’ll meet again.”"); } }] },
    { id: "ss_war", t: "改变战局的情报|Intelligence That Changes a War", i: "📡", min: 4,
      s: "你截获了一份情报：对方准备在三天后发动突袭。但情报的来源只有一个，你没有时间验证。|You intercept word of a surprise attack in three days. One source only — and no time to verify.",
      o: [{ t: "凭直觉判断真假（直觉小游戏）|Judge it on instinct (instinct test)", run: async function () { var r = await test("战略判断|A Strategic Call", 3, .1); if (r.ok) { merit(200); G.addStat("fame", 0); G.major("提前预警，阻止了一场战争|Gave the warning that stopped a war"); return G.L("你判断对了。突袭被提前化解，一场战争没有爆发。没有人知道你的名字。|You were right. The attack was defused and a war never began. No one will ever know your name."); } heat(30); merit(-30); return G.L("情报是假的，部队白白调动了一次。你被叫去写了一份很长的检讨。|It was false; troops were moved for nothing. You wrote a very long self-criticism."); } }] }
  ];
  G.SPY_STORIES = STORIES;
  function eligible() { var s = sp(); if (!s || s.youth) return []; return STORIES.filter(function (x) { return s.rank >= x.min && (s.done || []).indexOf(x.id) < 0 && (!x.need || x.need()); }); }
  G.evs([{ id: "spy_story", sys: 1, title: "绝密|Top Secret", icon: "🗝️",
    prep: function (c) { var L = eligible(); if (!L.length || !G.spyOn()) return false; var x = G.pick(L); c.prm.k = x.id; (sp().done = sp().done || []).push(x.id); },
    t: function (c) { var x = STORIES.filter(function (y) { return y.id === c.prm.k; })[0]; var a = x.t.split("|"), b = x.s.split("|"); return "【" + a[0] + "】" + b[0] + "|[" + a[1] + "] " + b[1]; },
    o: [0, 1].map(function (i) { return { t: function (c) { var x = STORIES.filter(function (y) { return y.id === c.prm.k; })[0]; return x && x.o[i] ? x.o[i].t : ""; }, if: function (c) { var x = STORIES.filter(function (y) { return y.id === c.prm.k; })[0]; return !!(x && x.o[i]); }, run: async function (c) { var x = STORIES.filter(function (y) { return y.id === c.prm.k; })[0]; return x.o[i].run(c); } }; }) }]);
  var pre = G.pickRandomEvents;
  G.pickRandomEvents = function (n) {
    var out = pre.apply(this, arguments);
    if (G.spyOn() && eligible().length && G.ch(.35)) out = [{ id: "spy_story" }].concat(out.slice(0, 1));
    return out;
  };
})();
