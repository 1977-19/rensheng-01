/* Version 3.0 interface layer.
   - Story cards know whose story they are: identity storylines carry a coloured ribbon and an "exclusive" tag,
     New Year scenes are festive, news is a newspaper clipping, sad news is in black.
   - Options are lettered A/B/C; the event icon sits in a medallion.
   - The journal shows who you are right now as a chip under your name, and news lines look like clippings.
   - The start screen has a 3.0 badge and a "What's new" page; origins with their own storylines are marked. */
(function () {
  'use strict';
  var h = G.h, UI = G.UI, T = UI.T, tap = UI.tap;
  if (!h || !UI) return;
  // spies no longer sit an instinct quiz: their tests are settled by stats and gear (events/spy22.js)
  UI.spyGame = null; G.UI.spyGame = null;

  /* ---------------- who is this story about ---------------- */
  var IDN = {
    red: ['🎖️', '红二代|Political Dynasty', 'red'], spyfam: ['🕵️', '特工家庭|Spy Family', 'ink'], spy: ['🕶️', '特工|Agent', 'ink'],
    royal: ['👑', '王室|Royal', 'gold'], monarch: ['👑', '君主|Monarch', 'gold'], prison: ['⛓️', '狱中|Behind Bars', 'grey'],
    tycoon: ['💎', '富豪|Tycoon', 'gold'], general: ['⭐', '将军|General', 'green'], official: ['🏛️', '官员|Official', 'red'],
    star: ['🌟', '明星|Star', 'pink'], nanny: ['🧺', '保姆|Nanny', 'green'], soldier: ['🪖', '军人|Soldier', 'green'],
    police: ['🚓', '警察|Police', 'blue'], student: ['🎒', '学生|Student', 'blue'], elder: ['🍵', '晚年|Golden Years', 'brown'],
    child: ['🧸', '童年|Childhood', 'pink'], common: ['🏙️', '普通人|Everyday Life', 'brown']
  };
  G.IDN = IDN;
  var stack = [];
  var run0 = G.runEvent;
  G.runEvent = async function (id) {
    stack.push(id);
    try { return await run0.apply(this, arguments); } finally { stack.pop(); }
  };
  function curDef() { var id = stack[stack.length - 1]; return id ? G.EV[id] : null; }
  function cls(el, c) { if (el && c) c.split(' ').forEach(function (x) { if (x) el.classList.add(x); }); }

  var ev0 = UI.event;
  UI.event = function (o) {
    var d = curDef(), pr = ev0.apply(this, arguments);
    try {
      var all = document.querySelectorAll('.veil .modal'), m = all[all.length - 1];
      if (m && d) {
        var mh = m.querySelector('.mh'), tag = null;
        if (/^nyx?_/.test(d.id)) { cls(m, 'v3 ny'); tag = '🧧 ' + T('新年|New Year'); }
        else if (d.odb) { var og = G.ORIGIN[d.odb]; cls(m, 'v3 who tone-' + ({ fam: 'red', kid: 'pink', sch: 'blue', soc: 'green', adu: 'brown', turn: 'ink', late: 'gold' }[d.ocat] || 'brown')); tag = '🏠 ' + (og ? T(og.n) : '') + ' · ' + T((G.ODB_CAT || {})[d.ocat] || ''); }
        else if (d.who) {
          var id = G.idNow ? G.idNow() : null, w = [].concat(d.who), k = w.indexOf(id) >= 0 ? id : w[0], meta = IDN[k];
          if (meta) { cls(m, 'v3 who tone-' + meta[2]); tag = meta[0] + ' ' + T(meta[1]) + T('专属|'); }
        } else if (d.kind === 'news') cls(m, 'v3 newsp');
        else if (d.kind === 'sad') cls(m, 'v3 sadp');
        else cls(m, 'v3');
        var h3 = mh && mh.querySelector('h3'); if (tag && h3) h3.appendChild(h('span', { class: 'idtag' }, tag));
      } else if (m) cls(m, 'v3');
    } catch (e) { }
    return pr;
  };
  var res0 = UI.result;
  UI.result = function (o) {
    var pr = res0.apply(this, arguments);
    try { var all = document.querySelectorAll('.veil .modal'), m = all[all.length - 1]; if (m) cls(m, 'v3 res'); } catch (e) { }
    return pr;
  };

  /* ---------------- the journal ---------------- */
  function decorate() {
    try {
      if (!G.S || !G.S.p) return;
      // (no identity chip on the journal: it was redrawn on every refresh and flickered)
      var ps = document.querySelectorAll('.desk .diary p:not(.v3d)');
      for (var i = 0; i < ps.length; i++) {
        var p = ps[i], t = p.textContent || ''; p.classList.add('v3d');
        if (t.indexOf('📰') === 0) p.classList.add('newsln');
        else if (/^(新年|跨年|New Year)/.test(t) || /^[^：:]{0,14}(年夜饭|团拜|拜年|跨年|压岁钱)/.test(t)) p.classList.add('nyln');
      }
    } catch (e) { }
  }
  G.on('change', decorate);
  // the journal re-renders itself from many places; catch every redraw
  var pend = false;
  try { new MutationObserver(function () { if (pend) return; pend = true; requestAnimationFrame(function () { pend = false; if (document.querySelector('.desk')) decorate(); }); }).observe(document.getElementById('app') || document.body, { childList: true, subtree: true }); } catch (e) { }
  G.on('log', function () { setTimeout(decorate, 0); });
  var main0 = UI.main;
  UI.main = function () { var r = main0.apply(this, arguments); decorate(); return r; };

  /* ---------------- the ending: a verdict from your own origin ---------------- */
  var endU = UI.ending;
  UI.ending = function (d) {
    var r = endU.apply(this, arguments);
    try {
      var ov = d && d.ov, rep = document.querySelector('.report');
      if (d && d.endN && rep && !document.querySelector('.galcard')) rep.parentNode.insertBefore(h('div', { class: 'card galcard' }, h('span', null, '🏆 ' + T('结局图鉴 {n}/{m}|Endings collected {n}/{m}', { n: d.endN, m: d.endTot })), d.endNew ? h('b', { class: 'newend' }, T('新结局！|New ending!')) : null), rep);
      if (ov && rep && !document.querySelector('.ovcard')) {
        var org = G.ORIGIN[ov.org];
        rep.parentNode.insertBefore(h('div', { class: 'card ovcard' },
          h('h5', null, T('出身评价 · {o}|Your Origin · {o}', { o: org ? org.n : '' })),
          h('div', { class: 'ovt' }, T(ov.t)), h('p', { class: 'ovd' }, T(ov.d)),
          h('small', { class: 'ovn' }, T('经历了{n}/{m}段出身专属剧情|Lived {n} of {m} origin chapters', { n: ov.n, m: ov.tot }))), rep.nextSibling);
      }
    } catch (e) { }
    return r;
  };

  /* ---------------- what's new ---------------- */
  var NEWS = [
    ['🎓', '私生子女和婚生子女的留学风波|Secret and legitimate children abroad', '给孩子选留学国家时，如果另一边的孩子也在那里，会提示“可能会撞见”。私生子女的妈妈也会自己安排出国，偏偏选中婚生子女所在的国家。同在一国时，会发生留学生聚会上长得太像、成了“特别投缘的朋友”、配偶刷到合照起疑等事件；配偶质问时，如果两个孩子不在同一个国家，可以拿出学籍证明自证。|When choosing where a child studies, you\'re warned if a half-sibling from the other side is already there. A secret child\'s mother may pick the very country your legitimate child is in. In the same country: a look-alike at a student party, a "friend I really click with", your spouse spotting a photo — and if the two study in different countries, enrolment papers can clear you.'],
    ['🪖', '参军的孩子变少了|Fewer children in uniform', '每个孩子一生只在19岁左右判定一次是否参军/进国安（普通家庭约3%，军警家庭约8%）。服役的孩子会在资料页显示军衔或职级，并随年头晋升。|Each child is considered once, around 19 (about 3%, or 8% in military and police families). Children who serve show their rank on their page, and it rises over the years.'],
    ['📋', '孩子的资料页更完整|Fuller child profiles', '孩子页面新增国籍、身世（婚生子女/私生子女）、服役、留学地、天选继承人和“人生经历”，发生在孩子身上的被动事件都会记下来。|Child pages now show nationality, birth (in or outside marriage), service, where they study, chosen-heir status and a life-events record of what happened to them.'],
    ['🎲', '13个新的被动趣味事件|13 new surprises', '你在厨房跳舞的视频火了、DNA检测查出陌生近亲、寻亲节目、时间胶囊、孩子的新班主任是你的初恋、孩子其实在送外卖、隔壁城市的另一个你、医院说可能抱错了、比你还大的“女婿/儿媳”、那张中奖彩票、AI模仿孩子声音的诈骗、送错的鹦鹉、误入孩子们的群聊——每个都有3到4个选择。|Your kitchen dance goes viral, a DNA test finds a stranger relative, a TV reunion show, a time capsule, your first love as your child\'s teacher, the child secretly delivering food, your double in the next city, a hospital mix-up scare, a partner older than you, a winning ticket, an AI voice scam, a misdelivered parrot, the kids\' group chat — each with 3–4 choices.'],
    ['🪜', '出身按好坏排序|Origins in order', '选出身时从最难的开局（孤儿、负债）排到最顶级的世家（隐世家族），并分成困境、普通、小康、富裕、豪门、顶级六档。|Origins now run from the hardest start (orphan, debt) to the very top (hidden dynasty), grouped into six bands.'],
    ['🎖️', '孩子为不同国家效力|Children serving rival countries', '成年的孩子可能参军或进入本国的国家安全部门。如果两个孩子（或你和孩子）为不同国家效力，事情会自己找上门：沉默的年夜饭、单位要求断绝联系的背景审查、互相套话、新闻里的边境对峙、公开断绝关系……多年以后，也许还有和解。|Grown children may join the army or security service of their own country. If two children — or you and a child — serve rival countries, it comes to you on its own: silent dinners, vetting that orders them to cut contact, pumping each other for information, a stand-off on the news, a public break… and perhaps, years later, a reconciliation.'],
    ['🌏', '孩子只有一个国籍|One nationality per child', '父母国籍不同时，孩子出生后由你选择入哪国国籍，不再是“双国籍混血”。混血孩子有自己专门的头像：蜜棕或栗色的卷发、浅色眼睛、雀斑。关系页的国旗挪到了名字旁边，不再挡住头像。|When parents hold different nationalities you choose which one the baby takes. Mixed-heritage children get their own avatars — honey or auburn curls, light eyes, freckles. Flags in the people list moved next to the name, off the face.'],
    ['👁️', '身家够买什么|What your money can buy', '点主页的资产，会告诉你这笔钱够买多少杯奶茶、多少套房、多少艘超级游艇、多少家世界五百强。旁边的眼睛按钮可以把资产藏起来。|Tap your money on the main page to see what it could buy — from cups of bubble tea to superyachts and Fortune 500 companies. The eye button next to it hides the number.'],
    ['⚖️', '断绝关系要上法庭|Cutting ties takes a court', '未满18岁的孩子不能被断绝关系（未成年的你也不能和父母断绝）。和成年亲人断绝关系需要请律师、起诉、出庭，法院不一定支持。|A child under 18 can\'t be disowned (and a minor can\'t cut off their parents). With an adult relative it means a lawyer, a lawsuit and a hearing — and the court may say no.'],
    ['💞', '试管婴儿只和伴侣|IVF with your partner only', '试管婴儿只能和伴侣一起，或者你一个人（使用捐赠者），不能和兄弟姐妹、父母。领养仍然可以和亲人一起抚养。|IVF is with your partner, or alone with a donor — never a sibling or parent. Adoption can still be shared with a relative.'],
    ['💰', '有钱人不再“缺钱”|No more broke billionaires', '家里有几万亿，就不会再出现“没钱修屋顶、卖画”“凑钱交学费”这类剧情；城堡和庄园的故事改成了富人真正会吵的事（开放参观、出租给酒店）。当了特工会显示“特工”，退出后恢复原来的身份，不再变成“特工家庭”。|With trillions in the family, stories about scraping money together (selling a painting to fix the roof, raising school fees) no longer happen; the castle and estate chapters are now the fights rich families really have. A spy is shown as a spy, and after quitting you go back to who you were — not a "spy family".'],
    ['👑', '天选继承人更多、更有戏|More chosen heirs, more story', '天选继承人更常出现了，还有了自己的一生：惊人的智商测试、差点被绑架、少年天才大赛、杂志封面“天选之子”、“我不想接班”、第一个大决定。|Chosen heirs are more common and have a story of their own: the IQ test, a near-kidnapping, the young-genius contest, the "Chosen One" cover, "I don\'t want to inherit", and their first big call.'],
    ['🏝️', '顶级富豪的乐子|Fun for the ultra-rich', '生日礼物是一座岛、管家集体罢工、拍卖会抢恐龙化石、隐姓埋名在自家门店打工、富二代群聊斗富、约会对象以为你很穷……|An island for your birthday, the butlers on strike, a bidding war for a dinosaur, a month incognito in your own shop, the rich-kids group chat, a date who thinks you\'re broke…'],
    ['✍️', '起名：姓什么都可以|Naming: any surname', '生孩子、领养、代孕和试管都不再先选“跟谁姓”：起名卡上姓和名都能直接写，姓什么都可以，常用的几个姓（你的、孩子另一位家长的、你配偶的）点一下就填上。|No more "whose surname?" step for births, adoptions, surrogacy or IVF: write any surname and name on the naming card; common surnames are one tap away.'],
    ['⚔️', '孩子会争宠、会打架|Siblings compete and fight', '孩子们会争着让你夸、为游戏机打架、互相告状、被拿来比较，长大后还会在饭桌上争家产；你怎么处理会累积成兄弟姐妹之间的心结，影响他们对你的感情和遗产纠纷，也可能在病床前和解。|Children vie for praise, fight, tell tales, get compared and later argue over the estate; how you handle it builds a rivalry that shapes their love for you and the fight over your will — or a reconciliation at your bedside.'],
    ['👑', '天选继承人|The chosen heir', '偶尔会出生一个天赋异禀的孩子（家世越显赫越常见），从小就不一般，会被标为“天选继承人”，选继承人时排在第一位，也会引起其他孩子的嫉妒。|Now and then a child is born gifted in every way (more often in great families), marked as the chosen heir, listed first when you pick who carries on — and envied by the others.'],
    ['✅', '每个结果都会真的改变什么|Every outcome changes something', '检查了全部3998个事件选项：原来约两成的结果只写了文字，属性、金钱、关系都没变。现在说给了钱就真的给钱，说朋友疏远了就真的降好感，至少也会影响心情。|All 3,998 event options were checked: about one in five changed nothing. Now money, affection or mood always moves the way the story says.'],
    ['👶', '孩子跟谁姓、和谁领养|Surnames, adoption and IVF', '孩子可以随你的姓、亲生父亲或母亲（包括情人）的姓、或者你配偶的姓。领养和试管婴儿可以指定和谁一起抚养：配偶、父母、兄弟姐妹、祖辈，或者自己一个人。|A child can take your surname, the birth father\'s or mother\'s (a lover\'s too), or your spouse\'s. Adoption and IVF let you choose who raises the child with you.'],
    ['💌', '谁都可以约会表白|Ask anyone out', '除了自己家的亲人（父母、兄弟姐妹、子女、祖辈等），任何成年人都可以约会和表白，对方答不答应看ta自己。|Anyone who isn\'t your own family can be asked out or confessed to; whether they say yes is up to them.'],
    ['💎', '四个顶级世家|Four top dynasties', '新增顶奢世家、港岛豪门、政商世家、隐世家族：和红二代同级的顶级人脉，18岁起每年家族信托分红，出事有家族律师团，生病有顶级医疗，家族集团留着位子，还有各自的专属剧情和结局。|Top Luxury Dynasty, Harbour City Tycoon Clan, Political-Business Dynasty and The Hidden Clan: top connections, a yearly trust payout, family lawyers, the best doctors, a seat in the family group, and their own storylines.'],
    ['📸', '全新结算页|A new end-of-life page', '人生相册（你从小到老的照片）、一生三个词、高光与转折、别人眼中的你、人生曲线和“最富/最穷/最快乐/最难熬的一年”、这一生的数字、如果重来一次。|A photo album, three words, big moments, what people said about you, your life charted with its best and worst years, life in numbers, and what you\'d do differently.'],
    ['📚', '新一批剧情|New stories', '童年、青春、成年、为人父母和晚年的新剧情：金鱼葬礼、追星、考驾照、裸辞、催婚、AI抢工作、同学会、中年学跳舞、立遗嘱、养老院乐队……|New stories for every stage of life.'],
    ['🕵️', '特工不再答题|Spies: no more quizzes', '特工的直觉答题全部取消，改为真正的任务：东方快车、大使馆舞会、雪山缆车、赌场、桥上交换……每次任务有不同的做法（硬闯、智取、社交、用装备），结果看你的能力和运气。新增自选代号、掩护身份、装备科（口红麻醉枪、滑翔伞雨伞、改装跑车等），装备会解锁新的任务方案。|The instinct quizzes are gone. Spies now run real missions — a night train, an embassy ball, a ski lift, a casino, a bridge exchange — each with several approaches (force, wits, charm, gadgets) settled by your abilities and luck. Pick your own codename and cover job; the gadget lab hands out kit that unlocks new options.'],
    ['🏆', '结局大扩充|Many more endings', '新增几十种结局（无名英雄、双面人生、桥上归来的人、百岁人瑞、东山再起、一个人的一生、连续创业者、环球旅行家……），平淡的人生会以你出身的专属评价作为结局；还有结局图鉴，记录你解锁过的所有结局。|Dozens of new endings, an origin verdict for quieter lives, and an ending gallery that records every ending you reach.'],
    ['🏠', '60种出身，60种人生|60 origins, 60 different lives', '每一种出身都有自己独立的事件库：专属的家庭矛盾、童年、求学、人情、立业、人生转折和晚年，前面的选择会改变后面的剧情；死后还有专属的“出身评价”。军人家庭的矛盾是驻地分离，富豪家是遗产信托，工薪家是下岗和房贷，孤儿有院长妈妈和开放日。这些事件只属于对应的出身，不会出现在别人的人生里。|Every origin has its own event library: its own family conflict, childhood, school, people, career, turning point and old age; earlier choices change later chapters, and an origin verdict closes the life. These events never appear in anyone else\'s life.'],
    ['🔁', '剧情不再重播|No more reruns', '身份剧情一生只发生一次；同一个标题十年内不会再出现；新年场景几年才有一次、每个只看一次；表白、约会、任务、考核这类弹窗都拉开了间隔。|Identity stories happen once in a life; the same headline won\'t return within ten years; New Year scenes come every few years and never repeat; admirers, dates, missions and exams are spaced out.'],
    ['👴', '家族不再穿帮|A consistent family', '有爷爷奶奶、爸爸妈妈出场的剧情，只在他们还活着的时候发生。红二代的爷爷只会去世一次，之后有告别、遗物和后续故事。|Stories with grandparents or parents only happen while they\'re alive. A political dynasty\'s grandfather dies once — followed by a farewell, his keepsakes and what comes after.'],
    ['👶', '孩子起名|Naming babies', '起名时能看到孩子的爸爸妈妈是谁；非婚生子女可以自由选择随父姓或随母姓，不会再出现两个姓叠在一起。|The naming card shows who the father and mother are; a child born outside marriage can take either parent\'s surname — never two stacked together.'],
    ['🏯', '中国没有王室|No royals in China', '王子、公主只来自真正有君主的国家。在中国遇到的“王室”追求者，现在都来自海外王室。|Princes and princesses come only from real monarchies; a royal suitor you meet in China is now a foreign royal.'],
    ['👥', '私生兄弟姐妹变少|Fewer surprise half-siblings', '豪门家庭不再几乎每局都有一个私生的兄弟姐妹。|Wealthy families no longer come with a secret half-sibling nearly every time.'],
    ['🎭', '一百多段身份专属剧情|100+ new identity stories', '红二代、特工家庭、特工、王室、君主、监狱、富豪、将军、官员、明星、保姆、军人、警察、学生、老人、孩子、普通人，每个身份都有自己的新故事，很多是连续剧。|Political dynasties, spy families, agents, royals, monarchs, prisoners, tycoons, generals, officials, stars, nannies, soldiers, police, students, elders, children and ordinary people — each has new stories, many of them serials.'],
    ['📰', '新闻不再打断你|News stops interrupting', '和你无关的时代新闻直接写进日记，以剪报的样式出现。|World news that doesn\'t affect you goes straight into the diary as a clipping.'],
    ['🎨', '全新界面与图标|New look and icon', '新的App图标；事件卡片带身份色带和专属标签，选项有A/B/C编号，新年和讣告有专门的样式；日记里显示你当前的身份。|A new app icon; story cards carry an identity ribbon and tag, options are lettered, New Year and farewells have their own look; the journal shows who you are now.']
  ];
  UI.whatsNew = function () {
    var body = h('div', { class: 'wnew' }, NEWS.map(function (n) { return h('div', { class: 'wn' }, h('div', { class: 'wi' }, n[0]), h('div', null, h('b', null, T(n[1])), h('p', null, T(n[2])))); }));
    var md = UI.modal({ title: T('3.6 大更新|Version 3.6'), icon: '🎉', kind: 'v3 wnm', body: body, foot: [h('button', { class: 'opt solid', onclick: tap(function () { md.close(); }) }, T('开始新的人生吧|Let\'s live'))], close: true });
    try { G.meta.seen3 = 1; G.meta.seenV = G.VERSION; G.saveMeta(); } catch (e) { }
  };

  /* ---------------- start screen ---------------- */
  var start0 = UI.start;
  UI.start = function () {
    var r = start0.apply(this, arguments);
    try {
      var t = document.querySelector('.start .title');
      if (t && !t.querySelector('.v3badge')) t.appendChild(h('button', { class: 'v3badge', onclick: tap(function () { UI.whatsNew(); }) }, T('3.0 大更新|3.0 UPDATE')));
      var btns = document.querySelector('.start .btns');
      if (btns && !btns.querySelector('.wnbtn')) btns.appendChild(h('button', { class: 'big wnbtn', onclick: tap(function () { UI.whatsNew(); }) }, '🎉 ' + T('这次更新了什么|What\'s new in 3.0')));
      var st = document.querySelector('.start'); if (st) st.classList.add('v3start');
      if (!(G.meta && G.meta.seenV === G.VERSION) && (G.meta.stats.lives || 0) > 0) setTimeout(function () { if (document.querySelector('.start') && !document.querySelector('.veil')) UI.whatsNew(); }, 600);
    } catch (e) { }
    return r;
  };

  /* ---------------- origins with their own storylines ---------------- */
  var STORY = { red: 1, royal: 1, spyfam: 1, richest: 1, tycoon: 1, noble: 1, celebrity: 1, military: 1, police: 1, mafia: 1 };
  var wiz0 = UI.wizard;
  UI.wizard = function () {
    var r = wiz0.apply(this, arguments);
    var mark = function () {
      try {
        var cards = document.querySelectorAll('.wf .tal');
        var shown = (G.ORIGINS || []).filter(function (o) { return document.body.textContent.indexOf(T(o.n)) >= 0; });
        for (var i = 0; i < cards.length; i++) {
          var c = cards[i], b = c.querySelector('b'); if (!b || c.querySelector('.stag')) continue;
          var o = shown.filter(function (x) { return T(x.n) === b.textContent; })[0];
          if (o && STORY[o.id]) b.appendChild(h('span', { class: 'stag' }, T('★ 专属剧情|★ Own storyline')));
        }
      } catch (e) { }
    };
    try { var obs = new MutationObserver(function () { mark(); }); var root = document.getElementById('app') || document.body; obs.observe(root, { childList: true, subtree: true }); setTimeout(function () { mark(); }, 50); UI._wizObs && UI._wizObs.disconnect(); UI._wizObs = obs; } catch (e) { }
    return r;
  };
  var main1 = UI.main;
  UI.main = function () { if (UI._wizObs) { UI._wizObs.disconnect(); UI._wizObs = null; } return main1.apply(this, arguments); };
})();
