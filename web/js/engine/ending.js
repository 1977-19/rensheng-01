/* Ending: score, title, epitaph, funeral, records; achievements */
(function () {
  'use strict';
  var EN = G.ending = {};
  EN.compute = function () {
    var S = G.S, p = S.p, c = S.cnt, nw = G.netWorth(), base = G.$(10000);
    var hapAvg = c.hapN ? c.hapSum / c.hapN : p.st.happy;
    var kids = G.N.all(function (n) { return n.rel === 'child'; }).length;
    var gk = c.grandkids || 0;
    var friends = G.N.all(function (n) { return n.alive && n.rel === 'friend' && n.aff > 40; }).length;
    var s = 0, parts = [];
    function add(k, v) { v = Math.round(v); if (v) { s += v; parts.push({ k: k, v: v }); } }
    add('财富|Wealth', nw > 0 ? Math.log10(nw / base + 1) * 14 : -10);
    add('名气|Fame', p.st.fame * .35);
    add('幸福|Happiness', (hapAvg - 40) * .8);
    add('寿命|Longevity', Math.min(p.age, 100) * .45);
    add('家庭|Family', kids * 3 + gk + (G.N.spouse() || G.N.all(function (n) { return n.widow; }).length ? 6 : 0) + Math.min(friends, 10));
    add('学历|Education', p.edu.deg * 2.5);
    var peak = 0;
    if (c.leader) peak = Math.max(peak, 45); if (c.general) peak = Math.max(peak, 25); if (c.topcop) peak = Math.max(peak, 22);
    if (c.godfather) peak = Math.max(peak, 18); if (c.ipo) peak = Math.max(peak, 25); if (c.famerank >= 3) peak = Math.max(peak, 15 + c.famerank * 3);
    if (c.promos) peak = Math.max(peak, Math.min(20, c.promos * 3));
    add('事业|Career', peak);
    add('品德|Virtue', p.h.karma * .15);
    add('成就|Achievements', (S.ach || []).length);
    if (c.jailYrs) add('牢狱|Prison', -c.jailYrs * 1.5);
    var grade = s >= 240 ? 'S' : s >= 185 ? 'A' : s >= 130 ? 'B' : s >= 80 ? 'C' : 'D';
    var t = EN.title(nw, hapAvg, kids);
    var at = G.N.all(function (n) { return n.alive && (G.N.isFamily(n) || (n.rel === 'friend' && n.aff > 30) || n.rel === 'lover' || n.rel === 'ex' && n.aff > 30 || n.rel === 'mentor' || n.rel === 'colleague' && n.aff > 40); });
    at.sort(function (a, b) { return (G.N.isFamily(b) ? 100 : 0) + b.aff - (G.N.isFamily(a) ? 100 : 0) - a.aff; });
    var fans = p.st.fame > 30 ? Math.round(Math.pow(p.st.fame, 2.6) * 6) : 0;
    return {
      name: p.name, g: p.g, by: p.birthYear, dy: S.year, age: p.age, cause: S.death ? S.death.c : '', country: p.country,
      score: Math.round(s), grade: grade, parts: parts, title: t.t, td: t.d, epitaph: EN.epitaph(t.k),
      nw: nw, hap: Math.round(hapAvg), funeral: at.slice(0, 8).map(function (n) { return { name: n.name, rel: G.N.relName(n) }; }), funeralN: at.length + G.ri(2, 12) + Math.round(p.st.fame * 3), fans: fans,
      timeline: S.major.slice(), heirs: G.life.heirs().map(function (k) { return { id: k.id, name: k.name, age: G.N.age(k), g: k.g }; }), gen: S.gen
    };
  };
  EN.title = function (nw, hap, kids) {
    var S = G.S, p = S.p, c = S.cnt, b = G.$(1);
    var R = [
      [c.leader, 'leader', '一国之主|Head of State', '你站上了权力的巅峰，名字写进了历史书。|You reached the summit of power; your name is in the history books.'],
      [nw > b * 1e9, 'rich', '富可敌国|Richer Than Nations', '你的财富多到可以买下一个小国家。|Your fortune could buy a small country.'],
      [c.godfather, 'boss', '地下教父|The Godfather', '在黑暗的世界里，你是说一不二的王。|In the shadows, your word was law.'],
      [c.general, 'general', '将军|The General', '将星闪耀，你戎马一生。|Stars on your shoulders; a life in uniform.'],
      [c.topcop, 'cop', '警界传奇|Legend of the Force', '你守护了一方平安，坏人听到你的名字就发抖。|You kept the peace; criminals trembled at your name.'],
      [p.fc && p.fc.rank >= G.FAME[p.fc.id].r.length - 1 || c.famerank >= 4, 'star', '一代巨星|A True Star', '聚光灯下的你，被无数人深爱着。|Under the spotlight, you were loved by millions.'],
      [c.ipo, 'founder', '商业帝国缔造者|Empire Builder', '你从零开始，建立了自己的商业帝国。|You built a business empire from scratch.'],
      [nw > b * 1e7, 'rich', '亿万富翁|Tycoon', '你这辈子没为钱发过愁。|Money was never a worry in your life.'],
      [p.edu.deg >= 6 && p.job && p.job.id === 'prof' && p.job.rank >= 3, 'scholar', '学术泰斗|Distinguished Scholar', '你的论文影响了一代又一代人。|Your work shaped generations.'],
      [(c.jailYrs || 0) >= 15, 'prison', '铁窗人生|Life Behind Bars', '你人生最长的时光，是在高墙里度过的。|You spent the longest stretch of your life behind high walls.'],
      [c.heist, 'thief', '世纪大盗|Heist Legend', '那一票让你成了传说。|That one big job made you a legend.'],
      [(c.marriages || 0) >= 3, 'lover', '情场浪子|Serial Romantic', '你爱过很多人，也被很多人爱过。|You loved many, and many loved you.'],
      [kids >= 5, 'family', '儿孙满堂|Big Happy Family', '你的家，永远热热闹闹。|Your home was always full of noise and love.'],
      [p.age < 30, 'young', '英年早逝|Gone Too Soon', '你的故事，才刚刚开始。|Your story had only just begun.'],
      [p.age >= 100, 'old', '百岁人瑞|Centenarian', '你见证了一个世纪的变迁。|You witnessed a whole century of change.'],
      [(c.medal || 0) + (c.trophies || 0) >= 3, 'champ', '冠军人生|A Champion\'s Life', '领奖台上的那一刻，你一辈子都记得。|You never forgot the feeling of standing on that podium.'],
      [c.mil && c.wounded && p.age >= 45, 'vet', '老兵|The Veteran', '你曾为国出征，身上的伤疤是你的勋章。|You served your country; your scars were your medals.'],
      [(c.hero || 0) >= 2, 'hero', '平民英雄|Everyday Hero', '你一次次挺身而出，很多人因你得救。|Time and again you stepped up, and people are alive because of you.'],
      [p.h.karma >= 80, 'saint', '大善人|A Kind Soul', '你帮过的人，比你认识的人还多。|You helped more people than you ever knew.'],
      [nw > b * 2e6 && hap < 50, 'richsad', '富有却孤独|Rich but Lonely', '你拥有一切，除了快乐。|You had everything except happiness.'],
      [(c.divorces || 0) >= 2, 'heartbreak', '情路坎坷|Unlucky in Love', '你一次次相信爱情，又一次次受伤。|You kept believing in love, and it kept hurting you.'],
      [(c.gambles || 0) >= 30, 'gambler', '赌徒人生|The Gambler', '你一辈子都在下注，最后也说不清是输是赢。|You bet your whole life away and never knew if you won.'],
      [(c.emigrate || 0) >= 1 && p.age >= 50, 'abroad', '他乡即故乡|Home Away from Home', '你在异国他乡扎下了根。|You put down roots far from where you began.'],
      [(c.travel || 0) >= 12, 'traveler', '行万里路|World Traveler', '你的护照盖满了印章，心里装满了风景。|Your passport was full of stamps, your heart full of views.'],
      [p.edu.deg >= 6 && hap >= 45, 'phd', '博学之士|A Learned Mind', '你读过的书，堆起来比你还高。|The books you read would stack taller than you.'],
      [(c.jobs || 0) >= 10, 'drifter', '漂泊不定|Restless Soul', '你换了一份又一份工作，一直在寻找属于自己的位置。|Job after job, you kept searching for where you belonged.'],
      [(c.pets || 0) >= 4 && hap >= 50, 'pets', '毛孩子的家长|Friend to Animals', '你的一生，被很多毛茸茸的小家伙爱过。|Many furry friends loved you through the years.'],
      [!c.marriages && !kids && p.age >= 60, hap >= 55 ? 'free' : 'alone', hap >= 55 ? '自由自在|Footloose and Free' : '孤独终老|Alone at the End', hap >= 55 ? '你没被任何人绑住，活成了自己想要的样子。|Tied to no one, you lived exactly as you pleased.' : '热闹是别人的，你习惯了一个人。|The noise belonged to others; you got used to being alone.'],
      [hap >= 70, 'happy', '平凡而幸福|Ordinary but Happy', '没有轰轰烈烈，但你每天都过得很开心。|Nothing dramatic — but you were happy every day.'],
      [nw < 0 || hap < 35, 'hard', '潦倒一生|A Hard Life', '生活从来没有善待过你，但你一直坚持着。|Life was never kind to you, but you kept going.'],
      [true, 'plain', '普通人|An Ordinary Life', '你像大多数人一样，平平淡淡地走完了一生。|Like most people, you lived a quiet, ordinary life.']
    ];
    for (var i = 0; i < R.length; i++) if (R[i][0]) return { k: R[i][1], t: R[i][2], d: R[i][3] };
  };
  var EPI = {
    leader: ['我为这片土地操劳了一生。|I gave my life to this land.', '历史会评判我。|History will judge me.'],
    rich: ['钱带不走，但我花得很开心。|You can\'t take it with you, but I enjoyed spending it.', '此处长眠着一位不差钱的人。|Here lies someone who never lacked for money.'],
    boss: ['江湖事，江湖了。|What happens in the underworld stays there.', '欠我的，下辈子再还。|Pay me back in the next life.'],
    general: ['老兵不死，只是凋零。|Old soldiers never die; they just fade away.'],
    cop: ['正义也许会迟到，但从不缺席。|Justice may be late, but it always arrives.'],
    star: ['谢谢你们的掌声。|Thank you for the applause.', '我曾在聚光灯下，闪耀过。|Once, I shone in the spotlight.'],
    founder: ['生意场如战场，我赢了。|Business is war, and I won.'],
    scholar: ['真理是我一生的追求。|Truth was my lifelong pursuit.'],
    prison: ['我付出了代价。|I paid my price.'],
    thief: ['钱藏在……算了，不告诉你。|The money is hidden in... never mind.'],
    lover: ['我爱过，这就够了。|I loved, and that was enough.'],
    family: ['我最大的财富，是我的家人。|My family was my greatest fortune.'],
    young: ['来不及说再见。|No time for goodbyes.', '如果能再活一次就好了。|If only I could live once more.'],
    old: ['活够了，走了。|I lived enough. Goodbye.', '这一百年，值了。|A hundred years — worth every one.'],
    happy: ['我这辈子，过得很开心。|I had a happy life.', '平平淡淡才是真。|Simple and ordinary is what\'s real.'],
    hard: ['终于可以休息了。|Finally, I can rest.'],
    champ: ['我赢过。|I won.', '更高、更快、更强。|Faster, higher, stronger.'],
    vet: ['我守护过这片土地。|I stood guard over this land.'],
    hero: ['换作是你，你也会这么做。|You would have done the same.'],
    saint: ['予人玫瑰，手有余香。|The hand that gives roses keeps their scent.'],
    richsad: ['钱买不到的，我都没有。|Everything money couldn\'t buy, I never had.'],
    heartbreak: ['下辈子，希望能遇到对的人。|Next time, I hope I meet the right one.'],
    gambler: ['最后一把，我全押了。|For the last hand, I went all in.'],
    abroad: ['此心安处是吾乡。|Home is wherever the heart is at peace.'],
    traveler: ['世界那么大，我看过了。|The world is big, and I saw it.'],
    phd: ['学无止境。|There is no end to learning.'],
    drifter: ['我一直在路上。|I was always on the road.'],
    pets: ['彩虹桥那头，有很多小家伙在等我。|Across the Rainbow Bridge, many little friends are waiting.'],
    free: ['我这一生，只为自己活。|I lived this life for me.'],
    alone: ['一个人来，一个人走。|I came alone, and I leave alone.'],
    plain: ['来过，爱过，活过。|I came, I loved, I lived.', '一个普通人，走完了不普通的一生。|An ordinary person who lived an extraordinary life.']
  };
  EN.epitaph = function (k) { return G.pick(EPI[k] || EPI.plain); };

  EN.run = async function () {
    var S = G.S;
    G.ach.check(true);
    var d = EN.compute();
    S.ending = d;
    G.loadMeta();
    G.meta.lives.push({ name: d.name, c: d.country, by: d.by, dy: d.dy, age: d.age, title: d.title, score: d.score, grade: d.grade, at: Date.now(), gen: S.gen, g: d.g });
    G.meta.lives.sort(function (a, b) { return b.score - a.score; });
    G.meta.lives = G.meta.lives.slice(0, 60);
    G.meta.stats.lives = (G.meta.stats.lives || 0) + 1;
    G.saveMeta();
    G.save('auto');
    if (G.UI.ending) await G.UI.ending(d);
  };

  /* ===================== ACHIEVEMENTS ===================== */
  function A(id, i, n, d, f) { return { id: id, i: i, n: n, d: d, f: f }; }
  var b = function (x) { return G.$(x); };
  G.ACH = [
    A('born', '👶', '呱呱坠地|Hello, World', '开始第一段人生|Start your first life', function () { return true; }),
    A('age80', '🎂', '耄耋之年|Golden Years', '活到80岁|Live to 80', function (S, p) { return p.age >= 80; }),
    A('age100', '💯', '百岁人瑞|Centenarian', '活到100岁|Live to 100', function (S, p) { return p.age >= 100; }),
    A('young', '🥀', '英年早逝|Gone Too Soon', '30岁前离世|Die before 30', function (S, p, end) { return end && p.age < 30; }),
    A('mil1', '💰', '百万富翁|Millionaire', '净资产达到100万美元等值|Net worth of $1M (equivalent)', function () { return G.netWorth() >= b(1e6); }),
    A('mil100', '🤑', '亿万富翁|Hundred-Millionaire', '净资产达到1亿美元等值|Net worth of $100M (equivalent)', function () { return G.netWorth() >= b(1e8); }),
    A('bil', '👑', '富可敌国|Richer Than Nations', '净资产达到10亿美元等值|Net worth of $1B (equivalent)', function () { return G.netWorth() >= b(1e9); }),
    A('broke', '📉', '负债累累|Drowning in Debt', '欠债超过10万美元等值|Owe over $100K (equivalent)', function (S) { return G.sum(S.assets.debt, function (d) { return d.amt; }) >= b(1e5); }),
    A('jackpot', '🎰', '天选之人|Jackpot!', '中彩票头奖|Win the lottery jackpot', function (S, p, e, c) { return c.jackpot; }),
    A('topuni', '🎓', '名校之光|Top of the Class', '考入顶尖名校|Get into a top-tier university', function (S, p, e, c) { return c.topuni; }),
    A('phd', '📜', '博士|Doctor', '获得博士学位|Earn a PhD', function (S, p) { return p.edu.deg >= 6; }),
    A('retake', '🔁', '复读之王|King of Retakes', '复读两次以上|Repeat the final year twice or more', function (S, p, e, c) { return (c.retake || 0) >= 2; }),
    A('married', '💒', '喜结良缘|Tied the Knot', '结婚|Get married', function (S, p, e, c) { return c.marriages; }),
    A('married3', '💍', '情场浪子|Serial Spouse', '结婚3次|Marry three times', function (S, p, e, c) { return (c.marriages || 0) >= 3; }),
    A('divorce', '💔', '一别两宽|Uncoupled', '离婚|Get divorced', function (S, p, e, c) { return c.divorces; }),
    A('lovers10', '😍', '万人迷|Heartbreaker', '谈过10段恋爱|Date 10 different people', function (S, p, e, c) { return (c.lovers || 0) >= 10; }),
    A('suitors', '💌', '追求者排长队|Line of Suitors', '收到10次表白|Receive 10 confessions', function (S) { return (S.done.sys_admirer || 0) >= 10; }),
    A('pride', '🏳️‍🌈', '爱无界限|Love Is Love', '与同性伴侣结婚|Marry a same-sex partner', function (S, p) { var s = G.N.spouse(); return s && s.g === p.g; }),
    A('kids5', '👨‍👩‍👧‍👦', '儿孙满堂|Full House', '拥有5个孩子|Have 5 children', function (S, p, e, c) { return (c.kids || 0) >= 5; }),
    A('grandkid', '👴', '含饴弄孙|Grandparent', '有了孙辈|Have a grandchild', function (S, p, e, c) { return c.grandkids; }),
    A('kidtop', '🏅', '望子成龙|Proud Parent', '孩子考上顶尖名校|A child gets into a top university', function (S, p, e, c) { return c.kidTop; }),
    A('pet', '🐾', '铲屎官|Pet Parent', '养一只宠物|Adopt a pet', function (S) { return S.assets.pets.length; }),
    A('zoo', '🦁', '动物园园长|Zookeeper', '同时养5只宠物|Own 5 pets at once', function (S) { return S.assets.pets.length >= 5; }),
    A('tiger', '🐯', '虎王|Tiger King', '养一只老虎|Own a tiger', function (S) { return S.assets.pets.some(function (x) { return x.kind === 'tiger'; }); }),
    A('travel', '🧳', '环游世界|Globetrotter', '去过8个旅行地|Visit 8 destinations', function (S, p, e, c) { return (c.travel || 0) >= 8; }),
    A('space', '🚀', '太空旅客|Space Tourist', '去太空旅行|Travel to space', function (S, p) { return p.flags.space; }),
    A('emig', '✈️', '远走他乡|New Horizons', '移民到其他国家|Emigrate', function (S, p, e, c) { return c.emigrate; }),
    A('world', '🌍', '世界公民|Citizen of the World', '在4个国家生活过|Live in 4 countries', function (S, p) { return p.imm.length >= 4; }),
    A('jail', '⛓️', '铁窗泪|Behind Bars', '入狱|Go to prison', function (S, p, e, c) { return c.jail; }),
    A('jail15', '🧱', '牢底坐穿|The Long Haul', '累计坐牢15年|Serve 15 years total', function (S, p, e, c) { return (c.jailYrs || 0) >= 15; }),
    A('escape', '🕳️', '肖申克的救赎|The Great Escape', '越狱成功|Break out of prison', function (S, p, e, c) { return c.escape; }),
    A('heist', '🏦', '世纪大盗|Heist of the Century', '抢银行得手|Pull off a bank heist', function (S, p, e, c) { return c.heist; }),
    A('godfather', '🕴️', '地下教父|The Godfather', '成为帮派老大|Become a gang boss', function (S, p, e, c) { return c.godfather; }),
    A('soldier', '🪖', '军旅生涯|Served', '参军或服兵役|Serve in the military', function (S, p, e, c) { return c.mil; }),
    A('medal', '🎖️', '战斗英雄|War Hero', '荣立战功|Be decorated for bravery', function (S, p, e, c) { return c.medal; }),
    A('general', '⭐', '将军|General', '晋升将官|Become a general', function (S, p, e, c) { return c.general; }),
    A('cop', '👮', '人民警察|Officer', '成为警察|Become a police officer', function (S, p, e, c) { return c.police; }),
    A('detective', '🔍', '神探|Master Detective', '侦破10起案件|Solve 10 cases', function (S, p, e, c) { return (c.cases || 0) >= 10; }),
    A('topcop', '🚔', '警界传奇|Top Cop', '成为警察局长|Become police commissioner', function (S, p, e, c) { return c.topcop; }),
    A('civil', '🏛️', '铁饭碗|Iron Rice Bowl', '考上公务员|Join the civil service', function (S, p, e, c) { return c.gov; }),
    A('elected', '🗳️', '民选官员|Elected Official', '赢得一次选举|Win an election', function (S, p, e, c) { return c.elections; }),
    A('leader', '🌐', '一国之主|Head of State', '成为国家最高领导人|Lead the nation', function (S, p, e, c) { return c.leader; }),
    A('founder', '🚀', '创业者|Founder', '创办公司|Start a company', function (S, p, e, c) { return c.founded; }),
    A('ipo', '🔔', '上市敲钟|Ring the Bell', '公司上市|Take a company public', function (S, p, e, c) { return c.ipo; }),
    A('bankrupt', '💥', '破产|Bankrupt', '公司破产|Have a company go bankrupt', function (S, p, e, c) { return c.bankrupt; }),
    A('star', '🌟', '巨星|Superstar', '在演艺/体育/电竞等行业登顶|Reach the top of a fame career', function (S, p, e, c) { return p.fc && p.fc.rank >= G.FAME[p.fc.id].r.length - 1; }),
    A('famous', '📣', '家喻户晓|Household Name', '名声达到90|Reach 90 fame', function (S, p) { return p.st.fame >= 90; }),
    A('promos', '📈', '步步高升|Climbing the Ladder', '晋升5次|Get promoted 5 times', function (S, p, e, c) { return (c.promos || 0) >= 5; }),
    A('fired', '📦', '被炒鱿鱼|Pink Slip', '被裁员|Get laid off', function (S, p, e, c) { return c.fired; }),
    A('surgery', '💉', '整容狂魔|Surgery Addict', '整容5次|Have 5 cosmetic procedures', function (S, p) { return p.surg >= 5; }),
    A('gym', '🏋️', '健身达人|Fitness Freak', '体能达到90|Reach 90 fitness', function (S, p) { return p.h.fit >= 90; }),
    A('genius', '🧠', '绝顶聪明|Genius', '智力达到98|Reach 98 smarts', function (S, p) { return p.st.smarts >= 98; }),
    A('beauty', '💎', '倾国倾城|Breathtaking', '颜值达到98|Reach 98 looks', function (S, p) { return p.st.looks >= 98; }),
    A('smoker', '🚬', '老烟枪|Chain Smoker', '烟瘾达到80|Reach 80 smoking addiction', function (S, p) { return p.hab.smoke >= 80; }),
    A('orphan', '🌱', '孤儿逆袭|Against All Odds', '孤儿出身成为百万富翁|Go from orphan to millionaire', function (S, p) { return p.origin === 'orphan' && G.netWorth() >= b(1e6); }),
    A('rags', '🏔️', '寒门贵子|Rags to Riches', '农村出身考入名校或成为百万富翁|From a rural family to a top university or millions', function (S, p, e, c) { return (p.origin === 'rural' || p.origin === 'leftbehind') && (c.topuni || G.netWorth() >= b(1e6)); }),
    A('zhiqing', '🌾', '知青岁月|Sent-down Youth', '经历上山下乡|Be sent to the countryside', function (S, p) { return p.flags.zhiqing; }),
    A('inherit', '📜', '继承遗产|Inheritance', '继承一笔遗产|Inherit money', function (S, p, e, c) { return c.inherit; }),
    A('gen3', '🌳', '家族传承|Dynasty', '传承到第3代|Reach the 3rd generation', function (S) { return S.gen >= 3; }),
    A('gen5', '🏯', '百年世家|Century Dynasty', '传承到第5代|Reach the 5th generation', function (S) { return S.gen >= 5; }),
    A('chat', '💬', '话痨|Chatterbox', '发送100条聊天消息|Send 100 chat messages', function (S, p, e, c) { return (c.chats || 0) >= 100; }),
    A('ai', '🤖', '赛博知己|Cyber Confidant', '和AI驱动的角色聊10次|Chat 10 times with AI-powered characters', function (S, p, e, c) { return (c.aiChats || 0) >= 10; }),
    A('vip', '💠', '尊贵会员|VIP', '激活VIP|Activate VIP', function () { return G.vip.tier() >= 1; }),
    A('lives10', '♾️', '轮回十世|Ten Lives', '完成10段人生|Finish 10 lives', function () { return (G.meta.stats.lives || 0) >= 10; })
  ];
  G.ach = {
    check: function (end) {
      var S = G.S; if (!S) return [];
      var got = [], M = G.meta.ach;
      S.ach = S.ach || [];
      G.ACH.forEach(function (a) {
        if (S.ach.indexOf(a.id) >= 0) return;
        var ok = false; try { ok = !!a.f(S, S.p, end, S.cnt); } catch (e) { ok = false; }
        if (ok) { S.ach.push(a.id); got.push(a); if (!M[a.id]) M[a.id] = Date.now(); }
      });
      if (got.length) { G.saveMeta(); got.forEach(function (a) { G.UI.toast && G.UI.toast(G.L('🏆 解锁成就：{n}|🏆 Achievement: {n}', { n: a.n })); }); }
      return got;
    }
  };
})();
