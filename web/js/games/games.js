/* Mind games: quiz, exam, math, memory, detective, policy */
(function () {
  'use strict';
  var h = function () { return G.h.apply(null, arguments); }, T = function (s, p) { return G.T(s, p); }, tap = function (f) { return function (e) { if (G.audio) G.audio.sfx('tap'); f(e); }; };
  var GM = G.GAMES = G.GAMES || {};
  function Q(q, o) { return { q: q, o: o }; } // first option is correct
  G.QUIZ = [
    Q('太阳系中最大的行星是？|The largest planet in the solar system?', ['木星|Jupiter', '土星|Saturn', '地球|Earth', '海王星|Neptune']),
    Q('水的化学式是？|The chemical formula for water?', ['H₂O', 'CO₂', 'O₂', 'NaCl']),
    Q('光速大约是每秒多少公里？|The speed of light is about how many km per second?', ['30万|300,000', '3万|30,000', '300万|3,000,000', '3000|3,000']),
    Q('《蒙娜丽莎》的作者是？|Who painted the Mona Lisa?', ['达·芬奇|Leonardo da Vinci', '梵高|Van Gogh', '毕加索|Picasso', '米开朗基罗|Michelangelo']),
    Q('世界上面积最大的国家是？|The largest country by area?', ['俄罗斯|Russia', '加拿大|Canada', '中国|China', '美国|United States']),
    Q('人体最大的器官是？|The largest organ of the human body?', ['皮肤|Skin', '肝脏|Liver', '大脑|Brain', '肺|Lungs']),
    Q('地球上最高的山峰是？|The highest mountain on Earth?', ['珠穆朗玛峰|Mount Everest', '乞力马扎罗山|Kilimanjaro', '富士山|Mount Fuji', '勃朗峰|Mont Blanc']),
    Q('1+2+3+…+10 = ?|1+2+3+…+10 = ?', ['55', '50', '45', '65']),
    Q('圆周率π约等于？|Pi is approximately?', ['3.14', '2.71', '1.62', '3.41']),
    Q('第一个登上月球的人是？|The first person to walk on the Moon?', ['阿姆斯特朗|Neil Armstrong', '加加林|Yuri Gagarin', '奥尔德林|Buzz Aldrin', '杨利伟|Yang Liwei']),
    Q('哪个器官负责泵血？|Which organ pumps blood?', ['心脏|Heart', '肺|Lungs', '肾|Kidneys', '胃|Stomach']),
    Q('莎士比亚是哪国人？|Shakespeare was from?', ['英国|England', '法国|France', '意大利|Italy', '美国|USA']),
    Q('流经埃及的著名大河是？|The great river flowing through Egypt?', ['尼罗河|The Nile', '亚马孙河|The Amazon', '长江|The Yangtze', '多瑙河|The Danube']),
    Q('电脑里的CPU是指？|In a computer, "CPU" means?', ['中央处理器|Central Processing Unit', '中央存储器|Central Program Utility', '显卡|Graphics Card', '电源|Power Unit']),
    Q('夏季奥运会每几年举办一次？|The Summer Olympics are held every how many years?', ['4', '2', '3', '5']),
    Q('哪种动物被称为“沙漠之舟”？|Which animal is the "ship of the desert"?', ['骆驼|Camel', '马|Horse', '大象|Elephant', '驴|Donkey']),
    Q('一打是多少个？|How many is a dozen?', ['12', '10', '6', '20']),
    Q('日本的首都是？|The capital of Japan?', ['东京|Tokyo', '大阪|Osaka', '京都|Kyoto', '横滨|Yokohama']),
    Q('澳大利亚的首都是？|The capital of Australia?', ['堪培拉|Canberra', '悉尼|Sydney', '墨尔本|Melbourne', '珀斯|Perth']),
    Q('加拿大的首都是？|The capital of Canada?', ['渥太华|Ottawa', '多伦多|Toronto', '温哥华|Vancouver', '蒙特利尔|Montreal']),
    Q('巴西的官方语言是？|Brazil\'s official language?', ['葡萄牙语|Portuguese', '西班牙语|Spanish', '英语|English', '法语|French']),
    Q('哪个国家的形状像一只靴子？|Which country is shaped like a boot?', ['意大利|Italy', '西班牙|Spain', '希腊|Greece', '葡萄牙|Portugal']),
    Q('人体正常体温约为？|Normal human body temperature is about?', ['37°C', '35°C', '39°C', '40°C']),
    Q('熊猫主要吃什么？|What do pandas mainly eat?', ['竹子|Bamboo', '鱼|Fish', '肉|Meat', '水果|Fruit']),
    Q('相对论是谁提出的？|Who proposed the theory of relativity?', ['爱因斯坦|Einstein', '牛顿|Newton', '霍金|Hawking', '伽利略|Galileo']),
    Q('世界上最大的海洋是？|The largest ocean?', ['太平洋|Pacific', '大西洋|Atlantic', '印度洋|Indian', '北冰洋|Arctic']),
    Q('三角形内角和是多少度？|The interior angles of a triangle sum to?', ['180°', '360°', '90°', '270°']),
    Q('二进制的“10”等于十进制的？|Binary "10" in decimal is?', ['2', '10', '1', '3']),
    Q('哪个是哺乳动物？|Which of these is a mammal?', ['鲸鱼|Whale', '鲨鱼|Shark', '鳄鱼|Crocodile', '企鹅|Penguin']),
    Q('一小时有多少秒？|How many seconds in an hour?', ['3600', '600', '6000', '360']),
    Q('人口最多的大洲是？|The most populous continent?', ['亚洲|Asia', '非洲|Africa', '欧洲|Europe', '美洲|The Americas']),
    Q('标准钢琴有多少个键？|How many keys on a standard piano?', ['88', '76', '66', '100']),
    Q('植物光合作用会释放哪种气体？|Which gas do plants release in photosynthesis?', ['氧气|Oxygen', '二氧化碳|Carbon dioxide', '氮气|Nitrogen', '氢气|Hydrogen']),
    Q('足球比赛每队上场几人？|How many players per side in soccer?', ['11', '10', '9', '12']),
    Q('篮球比赛每队上场几人？|How many players per side in basketball?', ['5', '6', '7', '4']),
    Q('晚年失聪仍坚持作曲的著名音乐家是？|Which famous composer kept composing after going deaf?', ['贝多芬|Beethoven', '莫扎特|Mozart', '巴赫|Bach', '肖邦|Chopin']),
    Q('《西游记》的主角是？|The hero of Journey to the West?', ['孙悟空|Sun Wukong', '诸葛亮|Zhuge Liang', '宋江|Song Jiang', '贾宝玉|Jia Baoyu']),
    Q('DNA的结构是？|The structure of DNA is?', ['双螺旋|Double helix', '正方形|Square', '单条直线|A single straight strand', '圆环|A ring']),
    Q('声音在哪种介质中传播最快？|Sound travels fastest through?', ['固体|Solids', '液体|Liquids', '气体|Gases', '真空|A vacuum']),
    Q('最大的非极地沙漠是？|The largest non-polar desert?', ['撒哈拉沙漠|Sahara', '戈壁沙漠|Gobi', '阿拉伯沙漠|Arabian', '卡拉哈里沙漠|Kalahari']),
    Q('第一次世界大战爆发于哪一年？|World War I began in?', ['1914', '1939', '1918', '1900']),
    Q('第二次世界大战结束于哪一年？|World War II ended in?', ['1945', '1939', '1950', '1918']),
    Q('哪种是可再生能源？|Which is a renewable energy source?', ['太阳能|Solar', '煤炭|Coal', '石油|Oil', '天然气|Natural gas']),
    Q('莫扎特是哪国人？|Mozart was from?', ['奥地利|Austria', '德国|Germany', '意大利|Italy', '法国|France']),
    Q('闰年的二月有多少天？|How many days in February in a leap year?', ['29', '28', '30', '31']),
    Q('哪颗行星被称为“红色星球”？|Which planet is called the Red Planet?', ['火星|Mars', '金星|Venus', '木星|Jupiter', '水星|Mercury']),
    Q('世界上最小的鸟是？|The world\'s smallest bird?', ['蜂鸟|Hummingbird', '麻雀|Sparrow', '鹦鹉|Parrot', '燕子|Swallow']),
    Q('造纸术是哪个国家发明的？|Which country invented papermaking?', ['中国|China', '埃及|Egypt', '印度|India', '希腊|Greece']),
    Q('英国的货币是？|The UK\'s currency?', ['英镑|Pound sterling', '欧元|Euro', '美元|Dollar', '法郎|Franc']),
    Q('冰在多少摄氏度融化？|Ice melts at?', ['0°C', '10°C', '-10°C', '100°C']),
    Q('彩虹传统上有几种颜色？|How many colors in a rainbow, traditionally?', ['7', '5', '6', '8']),
    Q('地球绕太阳一圈大约要？|Earth orbits the Sun in about?', ['一年|One year', '一个月|One month', '一天|One day', '十年|Ten years']),
    Q('通货膨胀是指？|Inflation means?', ['物价普遍上涨|A general rise in prices', '物价普遍下跌|A general fall in prices', '股市上涨|Stocks going up', '汇率固定|A fixed exchange rate']),
    Q('GDP指的是？|GDP stands for?', ['国内生产总值|Gross Domestic Product', '政府债务|Government Debt Payments', '人均收入|Per-capita income', '外汇储备|Foreign reserves']),
    Q('央行加息通常会？|Raising interest rates usually?', ['抑制通胀|Curbs inflation', '刺激借贷|Boosts borrowing', '推高房价|Pushes home prices up', '增加货币供应|Expands the money supply']),
    Q('分散投资的主要目的是？|The main purpose of diversification?', ['降低风险|Reduce risk', '保证收益|Guarantee returns', '避税|Avoid taxes', '增加手续费|Pay more fees']),
    Q('哪一项不属于“三权分立”？|Which is NOT one of the three branches of government?', ['媒体|The press', '立法|Legislative', '行政|Executive', '司法|Judicial']),
    Q('面试时最好怎么做？|Best practice for a job interview?', ['提前了解公司|Research the company', '晚到一会儿|Arrive a little late', '一直谈薪水|Talk mostly about pay', '批评前雇主|Criticize past employers']),
    Q('签合同前最重要的是？|Before signing a contract, the most important thing is?', ['仔细阅读条款|Read the terms carefully', '尽快签字|Sign quickly', '只看金额|Only check the amount', '让朋友代签|Let a friend sign']),
    Q('复利的威力来自？|The power of compound interest comes from?', ['利息再产生利息|Interest earning interest', '一次性高利息|A one-time high rate', '政府补贴|Government subsidies', '通货膨胀|Inflation']),
    Q('100的平方根是？|The square root of 100?', ['10', '50', '20', '1000']),
    Q('一周有几天？|How many days in a week?', ['7', '5', '6', '8']),
    Q('彩票中头奖的概率通常？|The odds of winning a lottery jackpot are usually?', ['极低|Extremely low', '一半一半|About 50/50', '很高|Very high', '十分之一|One in ten']),
    Q('长颈鹿最显著的特征是？|The most distinctive feature of a giraffe?', ['长脖子|Long neck', '长鼻子|Long trunk', '黑白条纹|Black-and-white stripes', '会飞|It can fly'])
  ];
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function timerBar(el) { var bar = h('div', { class: 'timer' }, h('i', { style: { width: '100%' } })); el.appendChild(bar); return function (f) { bar.firstChild.style.width = Math.max(0, f * 100) + '%'; }; }

  /* ---------- quiz ---------- */
  function quizRun(el, qs, secs, done, hud) {
    var i = 0, ok = 0, tm = null, left = secs, card = h('div', { class: 'qcard' });
    var setBar = timerBar(el); el.appendChild(card);
    function next() {
      if (i >= qs.length) { clearInterval(tm); done({ score: ok / qs.length }); return; }
      var q = qs[i], opts = shuffle(q.o.map(function (o, k) { return { t: o, c: k === 0 }; }));
      card.innerHTML = '';
      card.appendChild(h('div', { class: 'ghud', style: { padding: '0 0 8px' } }, h('span', null, (i + 1) + ' / ' + qs.length), h('span', null, '✔ ' + ok)));
      card.appendChild(h('div', { class: 'q' }, T(q.q)));
      left = secs; setBar(1);
      var answered = false;
      opts.forEach(function (o) {
        var b = h('button', { class: 'opt', onclick: tap(function () { if (answered) return; answered = true; if (o.c) { ok++; b.classList.add('good'); } else { b.classList.add('bad'); Array.prototype.forEach.call(card.querySelectorAll('.opt'), function (x, k) { if (opts[k].c) x.classList.add('good'); }); } setTimeout(function () { i++; next(); }, 550); }) }, T(o.t));
        card.appendChild(b);
      });
      clearInterval(tm);
      tm = setInterval(function () { left -= .1; setBar(left / secs); if (left <= 0 && !answered) { answered = true; i++; next(); } }, 100);
    }
    next();
  }
  GM.quiz = { n: '答题|Quiz', i: '❓', how: '在限定时间内答对尽可能多的题。|Answer as many questions as you can before time runs out.',
    play: function (el, o, done) { quizRun(el, shuffle(G.QUIZ).slice(0, o.n || 5), o.debate ? 8 : 10, done); } };

  /* ---------- math ---------- */
  function mkMath(diff) {
    var ops = diff > 1 ? ['+', '-', '×', '÷'] : ['+', '-', '×'], op = ops[Math.floor(Math.random() * ops.length)], a, b, ans;
    if (op === '+') { a = rnd(5, 60 + diff * 40); b = rnd(5, 60 + diff * 40); ans = a + b; }
    else if (op === '-') { a = rnd(20, 90 + diff * 40); b = rnd(1, a); ans = a - b; }
    else if (op === '×') { a = rnd(2, 9 + diff * 3); b = rnd(2, 12); ans = a * b; }
    else { b = rnd(2, 12); ans = rnd(2, 12); a = b * ans; }
    var wrong = {}; wrong[ans] = 1; var opts = [ans];
    while (opts.length < 4) { var w = ans + rnd(-10, 10); if (w >= 0 && !wrong[w]) { wrong[w] = 1; opts.push(w); } }
    return { q: a + ' ' + op + ' ' + b + ' = ?', o: opts.map(String) };
  }
  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  GM.math = { n: '速算|Mental Math', i: '🧮', how: '尽快算出答案，答错不扣分。|Solve as fast as you can. Wrong answers cost nothing.',
    play: function (el, o, done) { var qs = []; for (var i = 0; i < 8; i++) qs.push(mkMath(1 + (o.diff || 0) / 3)); quizRun(el, qs, 6, done); } };
  GM.exam = { n: '考试|Exam', i: '📝', how: '数学和常识混合题，限时作答。|A timed mix of math and general knowledge.',
    play: function (el, o, done) { var qs = shuffle(G.QUIZ).slice(0, 4); for (var i = 0; i < 4; i++) qs.splice(rnd(0, qs.length), 0, mkMath(2)); quizRun(el, qs, 8, done); } };

  /* ---------- memory ---------- */
  GM.memory = { n: '记忆翻牌|Memory Match', i: '🃏', how: '翻开两张相同的牌就能消掉，用最少的步数配对全部。|Flip two matching cards to clear them. Match all pairs in as few moves as possible.',
    play: function (el, o, done) {
      var icons = shuffle(['🍎', '🚗', '🎸', '🐱', '🌙', '⚽', '🎈', '💎']), deck = shuffle(icons.concat(icons)), open = [], moves = 0, pairs = 0;
      var hud = h('div', { class: 'ghud' }, h('span', null, T('步数|Moves') + ' 0'), h('span', null, T('配对|Pairs') + ' 0/8'));
      var grid = h('div', { class: 'cards4' });
      el.appendChild(hud); el.appendChild(grid);
      deck.forEach(function (ic, i) {
        var c = h('button', { class: 'mcard', onclick: function () {
          if (c.classList.contains('up') || c.classList.contains('done') || open.length >= 2) return;
          G.audio && G.audio.sfx('pop'); c.classList.add('up'); c.textContent = ic; open.push(c);
          if (open.length === 2) {
            moves++;
            if (open[0].textContent === open[1].textContent) { open.forEach(function (x) { x.classList.add('done'); }); open = []; pairs++; if (pairs === 8) setTimeout(function () { done({ score: G.clamp(1 - (moves - 8) / 18, 0, 1) }); }, 400); }
            else setTimeout(function () { open.forEach(function (x) { x.classList.remove('up'); x.textContent = ''; }); open = []; }, 650);
            hud.firstChild.textContent = T('步数|Moves') + ' ' + moves; hud.lastChild.textContent = T('配对|Pairs') + ' ' + pairs + '/8';
          }
        } });
        grid.appendChild(c);
      });
    } };

  /* ---------- detective ---------- */
  var ATTR = {
    h: ['高个子|tall', '矮个子|short'],
    c: ['戴眼镜|wears glasses', '不戴眼镜|no glasses'],
    s: ['左撇子|left-handed', '右撇子|right-handed'],
    w: ['穿红衣服|red jacket', '穿黑衣服|black jacket', '穿白衬衫|white shirt']
  };
  var CLUE = {
    h: ['监控拍到嫌犯是个{v}。|CCTV shows the culprit is {v}.'],
    c: ['目击者说嫌犯{v}。|A witness says the culprit {v}.'],
    s: ['法医判断，凶手是{v}。|Forensics say the culprit is {v}.'],
    w: ['现场留下了{v}的纤维。|Fibers from a {v} were found at the scene.']
  };
  GM.detective = { n: '破案推理|Detective', i: '🔍', how: '根据线索，从嫌疑人中找出真凶。|Use the clues to pick the real culprit.',
    play: function (el, o, done) {
      var names = shuffle(['老王|Old Wang', '阿强|Ah Qiang', '丽丽|Lili', '小陈|Little Chen', '杰克|Jack', '玛丽|Mary', '大刘|Big Liu', '安娜|Anna']).slice(0, 4);
      var sus = names.map(function (n) { var a = {}; for (var k in ATTR) a[k] = rnd(0, ATTR[k].length - 1); return { n: n, a: a }; });
      var culp = rnd(0, 3), cand = sus.slice(), clues = [], keys = shuffle(Object.keys(ATTR));
      // ensure culprit unique enough
      keys.forEach(function (k) {
        if (cand.length <= 1) return;
        var v = sus[culp].a[k];
        if (cand.some(function (s) { return s.a[k] !== v; })) { clues.push(G.L(CLUE[k][0], { v: ATTR[k][v] })); cand = cand.filter(function (s) { return s.a[k] === v; }); }
      });
      if (cand.length > 1) { cand.forEach(function (s, i) { if (s !== sus[culp] && clues.length < 6) { clues.push(G.L('{n}有确凿的不在场证明。|{n} has a solid alibi.', { n: s.n })); } }); }
      var left = 40, tm;
      var setBar = timerBar(el);
      el.appendChild(h('div', { class: 'ghud' }, h('span', null, T('线索|Clues')), h('span', null, '')));
      clues.forEach(function (c) { el.appendChild(h('div', { class: 'clue' }, T(c))); });
      var grid = h('div', { class: 'suspects' });
      sus.forEach(function (s, i) {
        var desc = Object.keys(ATTR).map(function (k) { return T(ATTR[k][s.a[k]]); }).join('，');
        grid.appendChild(h('button', { class: 'opt', style: { textAlign: 'center' }, onclick: tap(function (ev) { if (left <= 0 || grid.dataset.done) return; grid.dataset.done = 1; clearInterval(tm); var win = i === culp; ev.currentTarget.classList.add(win ? 'good' : 'bad'); setTimeout(function () { done({ score: win ? .6 + left / 100 : .1, win: win }); }, 500); }) }, h('b', null, T(s.n)), h('small', null, desc)));
      });
      el.appendChild(h('div', { style: { padding: '8px 14px 4px', fontWeight: 700 } }, T('谁是凶手？|Who did it?')));
      el.appendChild(grid);
      tm = setInterval(function () { left -= .1; setBar(left / 40); if (left <= 0) { clearInterval(tm); done({ score: 0, win: false }); } }, 100);
    } };

  /* ---------- policy (economic & geopolitical strategy) ---------- */
  var IND = [['e', '经济|Economy', 'var(--leaf)'], ['j', '就业|Jobs', 'var(--sky)'], ['pr', '物价稳定|Price stability', 'var(--gold)'], ['s', '民心|Public support', 'var(--rose)'], ['d', '外交|Diplomacy', 'var(--violet)'], ['b', '财政|Budget', 'var(--coral)']];
  function S(t, o) { return { t: t, o: o }; }
  function P(t, fx, dl, risk) { return { t: t, fx: fx, dl: dl, risk: risk }; }
  G.POLICY = [
    S('经济陷入衰退，企业纷纷裁员。|The economy slides into recession; companies are laying off workers.', [P('大规模财政刺激|Massive fiscal stimulus', { e: 12, j: 10, pr: -12, b: -16 }), P('全面减税|Broad tax cuts', { e: 6, s: 5, b: -10 }), P('紧缩财政，控制赤字|Austerity to rein in deficits', { b: 12, j: -10, s: -12, e: -5 })]),
    S('通胀飙升，菜价一个月涨了三成。|Inflation spikes; grocery prices jump 30% in a month.', [P('大幅加息|Hike interest rates sharply', { pr: 15, e: -8, j: -6 }), P('实施价格管制|Impose price controls', { pr: 6, e: -6, s: 6 }, { pr: -8 }), P('给民众发放补贴|Hand out cash subsidies', { s: 10, b: -12, pr: -5 })]),
    S('一个大国对你国商品加征高额关税。|A major power slaps steep tariffs on your exports.', [P('对等反制|Retaliate in kind', { d: -12, e: -6, s: 6 }), P('谈判让步|Negotiate concessions', { d: 10, s: -6, e: 3 }), P('开拓新市场|Pivot to new markets', { e: 2, d: 4, b: -4 }, { e: 6 })]),
    S('邻国在边境集结军队，局势紧张。|A neighbor masses troops on the border.', [P('增兵威慑|Deploy troops as deterrence', { s: 8, d: -10, b: -8 }), P('派特使外交斡旋|Send an envoy for talks', { d: 10, s: -4 }), P('寻求国际调停|Seek international mediation', { d: 6, s: 2, b: -2 }, null, { p: .35, fx: { d: -8, s: -6 }, t: '调停失败，对方得寸进尺。|Mediation failed and they pushed further.' })]),
    S('全球能源危机，电价暴涨。|A global energy crisis sends electricity prices soaring.', [P('补贴能源价格|Subsidize energy prices', { s: 8, b: -14, pr: 4 }), P('加速发展新能源|Fast-track renewables', { b: -8, e: -4 }, { e: 8, s: 4 }), P('重启煤电厂|Restart coal plants', { e: 6, d: -6, s: -3 })]),
    S('房价一年翻倍，年轻人买不起房。|Home prices doubled in a year; young people are priced out.', [P('严格限购|Strict purchase limits', { pr: 8, e: -8, s: -4 }), P('任由市场发展|Let the market run', { e: 8, s: -10 }, { e: -15, b: -6 }), P('大建保障房|Build public housing at scale', { s: 10, b: -10, j: 4 })]),
    S('全国性大罢工，交通瘫痪。|A nationwide strike paralyzes transport.', [P('满足工人要求|Meet the workers\' demands', { s: 10, b: -10, e: -4 }), P('强硬处理|Take a hard line', { s: -15, e: 4, d: -5 }), P('居中调解劳资双方|Broker talks between unions and employers', { s: 4, e: -2 }, null, { p: .3, fx: { s: -8, e: -6 }, t: '谈判破裂，罢工升级。|Talks collapsed and the strike escalated.' })]),
    S('一种新型传染病开始扩散。|A new infectious disease begins to spread.', [P('全面封锁|Full lockdown', { e: -14, j: -10, s: 2 }, { s: 6 }), P('精准防控|Targeted containment', { e: -4, s: 4 }, null, { p: .4, fx: { s: -12, e: -8 }, t: '防控出现漏洞，疫情失控。|Gaps appeared and the outbreak spiraled.' }), P('放开不管|Let it run its course', { e: 4, s: -14, d: -6 })]),
    S('他国对你国实施高科技出口禁令。|Foreign powers impose a high-tech export ban on your country.', [P('举国自主研发|National push for self-reliance', { b: -12, e: -2 }, { e: 10, s: 4 }), P('外交斡旋|Diplomatic resolution', { d: 8, e: -3 }), P('对等反制|Counter-sanctions', { d: -10, s: 6, e: -3 })]),
    S('一场特大地震/洪灾袭击了数个省份。|A massive earthquake / flood hits several regions.', [P('倾全国之力救灾|All-out national relief', { s: 12, b: -12 }), P('请求国际援助|Request international aid', { d: 6, s: -2, b: -3 }), P('交给地方政府|Leave it to local governments', { s: -12, b: 2 })]),
    S('国债规模失控，评级机构下调了信用评级。|Public debt spirals; ratings agencies downgrade your credit.', [P('借新还旧|Roll over with new debt', { b: 6 }, { b: -14 }), P('加税|Raise taxes', { b: 14, s: -10, e: -5 }), P('削减公共开支|Cut public spending', { b: 10, j: -8, s: -6 })]),
    S('本国货币遭遇投机攻击，汇率暴跌。|Speculators attack your currency, and it plunges.', [P('动用外汇储备护盘|Defend with reserves', { b: -10, pr: 6 }), P('顺势贬值刺激出口|Let it fall to boost exports', { e: 8, pr: -8 }), P('实施资本管制|Impose capital controls', { pr: 4, d: -6, e: -4 })]),
    S('邻国内战，大批难民涌向边境。|Civil war next door sends refugees streaming to your border.', [P('开放接收|Open the doors', { d: 10, s: -6, b: -8 }), P('关闭边境|Close the border', { s: 6, d: -12 }), P('有限度、有条件接收|Accept limited numbers with conditions', { d: 4, b: -4 })]),
    S('关键基础设施遭到大规模网络攻击。|Critical infrastructure is hit by a massive cyberattack.', [P('公开点名指责对手|Publicly blame a rival state', { d: -8, s: 6 }), P('低调加强防御|Quietly harden defenses', { b: -6, s: 2 }), P('秘密反击|Covert counterattack', { s: 2 }, null, { p: .4, fx: { d: -14 }, t: '反击行动被曝光，国际舆论哗然。|The counterattack was exposed, sparking global outrage.' })]),
    S('人口老龄化加剧，养老金快发不出来了。|An aging population is draining the pension fund.', [P('延迟退休年龄|Raise the retirement age', { b: 10, s: -12 }), P('发放生育补贴|Offer childbirth subsidies', { b: -10, s: 6 }, { j: 4, e: 3 }), P('吸引外国移民|Attract immigrants', { e: 6, s: -6, d: 4 })]),
    S('传统制造业衰落，工厂大量倒闭。|Traditional manufacturing is collapsing; factories are closing.', [P('扶持新兴产业|Back emerging industries', { b: -8, e: 2 }, { e: 8, j: 6 }), P('补贴保护传统行业|Subsidize the old industries', { j: 6, e: -4, b: -6, s: 4 }), P('交给市场|Let the market decide', { e: 6, j: -8, s: -4 })]),
    S('政府高层爆出腐败丑闻。|A corruption scandal erupts at the top of government.', [P('一查到底|Investigate all the way', { s: 10, e: -4 }), P('低调处理|Handle it quietly', { s: -8 }), P('推出替罪羊|Offer up a scapegoat', { s: 2 }, null, { p: .45, fx: { s: -16 }, t: '真相被媒体挖出，舆论炸锅。|The press uncovered the truth, and the public erupted.' })]),
    S('股市一周暴跌三成，投资者恐慌。|The stock market crashes 30% in a week; investors panic.', [P('国家注资救市|State bailout of the market', { e: 6, b: -12 }), P('不干预|Don\'t intervene', { e: -10, s: -6 }), P('加强金融监管|Tighten financial regulation', { e: -3, s: 4 }, { e: 4 })])
  ];
  GM.policy = { n: '施政决策|Governing', i: '🏛️', how: '每一轮都会遇到一场危机，你的选择会影响六项国家指标，有些后果要等到下一轮才显现。没有完美的选项，量力而行。|Each round brings a crisis. Your choices move six national indicators, and some effects only appear next round. There are no perfect options.',
    play: function (el, o, done) {
      var st = {}; IND.forEach(function (x) { st[x[0]] = rnd(38, 62); });
      var rounds = o.top ? 4 : 3, r = 0, pend = null, deck = shuffle(G.POLICY);
      var p = G.S ? G.S.p : { st: { smarts: 50, eq: 50 } };
      function apply(fx, mul) {
        var out = {};
        for (var k in fx) {
          var v = fx[k] * (mul || 1) * (0.75 + Math.random() * .5);
          if (v > 0 && (k === 'e' || k === 'j') && st.b < 25) v *= .6;
          if (v < 0 && k === 'pr' && st.pr < 30) v *= 1.5;
          if (v > 0 && st.s < 25) v *= .8;
          if (v > 0) v *= 1 + (p.st.smarts - 50) / 250;
          v = Math.round(v);
          st[k] = G.clamp(st[k] + v, 0, 100); out[k] = v;
        }
        return out;
      }
      function bars(changes) {
        return h('div', { class: 'ind' }, IND.map(function (x) {
          var c = changes && changes[x[0]];
          return h('div', null, h('div', { style: { display: 'flex', justifyContent: 'space-between' } }, h('span', null, T(x[1])), h('b', { style: { color: c > 0 ? 'var(--green)' : c < 0 ? 'var(--red)' : null } }, st[x[0]] + (c ? ' (' + (c > 0 ? '+' : '') + c + ')' : ''))), h('div', { class: 'bar' }, h('i', { style: { width: st[x[0]] + '%', background: x[2] } })));
        }));
      }
      function round(changes, note) {
        el.innerHTML = '';
        if (r >= rounds) {
          var sc = (st.s * .3 + st.e * .2 + st.j * .15 + st.pr * .15 + st.d * .1 + st.b * .1) / 100;
          var fin = h('div', { class: 'qcard' }, h('div', { class: 'q' }, T('任期结算|Final Tally')), bars(changes), note ? h('p', { style: { color: 'var(--ink2)', fontSize: '14px' } }, T(note)) : null, h('div', { style: { fontSize: '22px', fontFamily: 'var(--serif)', textAlign: 'center', margin: '10px 0' } }, T('施政得分|Score') + ' ' + Math.round(sc * 100)),
            h('button', { class: 'opt solid', onclick: tap(function () { done({ score: G.clamp((sc - .3) / .45, 0, 1) }); }) }, T('完成|Done')));
          el.appendChild(fin); return;
        }
        var sc0 = deck[r % deck.length];
        el.appendChild(h('div', { class: 'ghud' }, h('span', null, T('第{r}/{n}轮|Round {r}/{n}', { r: r + 1, n: rounds })), h('span', null, '')));
        el.appendChild(bars(changes));
        var card = h('div', { class: 'qcard' }, note ? h('p', { style: { color: 'var(--ink2)', fontSize: '13.5px', marginTop: 0 } }, T(note)) : null, h('div', { class: 'q' }, T(sc0.t)));
        sc0.o.forEach(function (op) {
          card.appendChild(h('button', { class: 'opt', onclick: tap(function () {
            var ch = {}, msg = null;
            if (pend) { var pc = apply(pend); for (var k in pc) ch[k] = (ch[k] || 0) + pc[k]; pend = null; msg = '上一轮决策的后续影响显现了。|The delayed effects of last round\'s decision arrive.'; }
            var c1 = apply(op.fx); for (var k2 in c1) ch[k2] = (ch[k2] || 0) + c1[k2];
            if (op.risk && Math.random() < op.risk.p * (1.2 - p.st.eq / 150)) { var c2 = apply(op.risk.fx); for (var k3 in c2) ch[k3] = (ch[k3] || 0) + c2[k3]; msg = op.risk.t; }
            if (op.dl) pend = op.dl;
            r++; round(ch, msg);
          }) }, T(op.t)));
        });
        el.appendChild(card);
      }
      round(null, null);
    } };
})();
