/* Origins, talents, personalities */
(function () {
  'use strict';
  // wealth: family net worth range (USD-2024 baseline). inc: each parent's income range. job: parent job titles.
  G.ORIGINS = [
    { id: 'rural', n: '农村家庭|Rural Family', d: '父母务农，家境清贫，但山野长大的你身体结实。|Your parents farm the land. Money is tight, but country life makes you tough.', vip: 0, tier: 5,
      w: [3000, 18000], inc: [7000, 15000], job: ['农民|Farmer', '农民|Farmer'], st: { health: 8, smarts: -3 }, sib: [0, 3] },
    { id: 'worker', n: '城市工薪家庭|Working-Class Family', d: '父母是普通工人，日子紧巴但安稳。|Your parents are ordinary workers. Life is modest but stable.', vip: 0,
      w: [15000, 60000], inc: [24000, 42000], job: ['工厂工人|Factory Worker', '超市店员|Retail Clerk', '司机|Driver', '保洁员|Cleaner'], st: {}, sib: [0, 2] },
    { id: 'middle', n: '中产家庭|Middle-Class Family', d: '父母是白领，有房有车，对你寄予厚望。|White-collar parents with a house and a car — and high hopes for you.', vip: 0,
      w: [90000, 320000], inc: [50000, 95000], job: ['公司职员|Office Worker', '工程师|Engineer', '教师|Teacher', '会计|Accountant'], st: { smarts: 3 }, sib: [0, 1] },
    { id: 'smallbiz', n: '个体户家庭|Small Business Family', d: '父母开着一家小店，你从小就在柜台后面长大。|Your parents run a little shop. You grow up behind the counter.', vip: 0,
      w: [50000, 260000], inc: [35000, 110000], job: ['小店老板|Shop Owner', '小餐馆老板|Diner Owner'], st: { eq: 6 }, sib: [0, 2] },
    { id: 'merchant', n: '富商之家|Wealthy Merchant Family', d: '家里做生意发了财，你是别人口中的富二代。|The family business struck gold — people call you a rich kid.', vip: 0,
      w: [1200000, 6000000], inc: [300000, 1100000], job: ['企业老板|Business Owner', '公司总经理|Company Director'], st: { looks: 4 }, sib: [0, 2], fl: ['rich'] },
    { id: 'scholar', n: '书香门第|Scholarly Family', d: '父母都是知识分子，家里最多的是书。|Both parents are intellectuals. Books fill every corner of the house.', vip: 0,
      w: [100000, 420000], inc: [70000, 150000], job: ['大学教授|Professor', '中学教师|Teacher', '研究员|Researcher'], st: { smarts: 14, eq: 3 }, sib: [0, 1] },
    { id: 'medical', n: '医生世家|Medical Family', d: '父母都穿白大褂，你从小耳濡目染。|Both parents wear white coats — medicine runs in your blood.', vip: 0,
      w: [200000, 700000], inc: [140000, 300000], job: ['医生|Doctor', '外科医生|Surgeon', '护士长|Head Nurse'], st: { smarts: 8, health: 5 }, sib: [0, 1] },
    { id: 'military', n: '军人家庭|Military Family', d: '父亲是军人，家里规矩严，你从小就站得笔直。|Your father serves in the army. Strict rules, straight backs.', vip: 0,
      w: [60000, 200000], inc: [55000, 120000], job: ['军官|Military Officer', '军医|Army Doctor'], st: { health: 10 }, sib: [0, 2], fl: ['milfam'] },
    { id: 'police', n: '警察家庭|Police Family', d: '父母是警察，家里常常只有你一个人吃晚饭。|Your parents are police officers; you often eat dinner alone.', vip: 0,
      w: [60000, 200000], inc: [50000, 110000], job: ['警察|Police Officer', '刑警|Detective'], st: { health: 5 }, sib: [0, 1], karma: 10, fl: ['polfam'] },
    { id: 'civil', n: '公务员家庭|Civil Servant Family', d: '父母端着铁饭碗，最大的愿望是你也考公。|Your parents hold secure government jobs and hope you will too.', vip: 0,
      w: [80000, 300000], inc: [50000, 100000], job: ['公务员|Civil Servant', '机关干部|Government Official'], st: { eq: 6 }, sib: [0, 1], fl: ['govfam'] },
    { id: 'artist', n: '艺术家庭|Artistic Family', d: '父母一个画画一个弹琴，日子时富时穷。|One parent paints, the other plays piano. Feast or famine.', vip: 0,
      w: [20000, 500000], inc: [20000, 220000], job: ['画家|Painter', '音乐家|Musician', '舞蹈老师|Dance Teacher'], st: { looks: 5, eq: 3 }, sib: [0, 1], fl: ['artfam'] },
    { id: 'single', n: '单亲家庭|Single-Parent Family', d: '父母离异，你跟着一方生活，早早学会了懂事。|Your parents split up. You learned to grow up fast.', vip: 0,
      w: [5000, 50000], inc: [22000, 60000], job: ['公司职员|Office Worker', '超市店员|Retail Clerk', '护士|Nurse'], st: { happy: -10, eq: 6 }, sib: [0, 1], single: 1 },
    { id: 'leftbehind', n: '留守儿童|Left-behind Child', d: '父母在外打工，你跟着爷爷奶奶长大。|Your parents work in a distant city; your grandparents raise you.', vip: 0, tier: 5,
      w: [3000, 25000], inc: [20000, 35000], job: ['外出打工|Migrant Worker'], st: { happy: -8, health: 5 }, sib: [0, 2], away: 1 },
    { id: 'orphan', n: '孤儿|Orphan', d: '你在福利院长大，没有父母，只有自己。|You grow up in an orphanage — no parents, only yourself.', vip: 0,
      w: [0, 0], inc: [0, 0], job: [], st: { happy: -14, eq: 4 }, sib: [0, 0], orphan: 1 },
    { id: 'immigrant', n: '移民家庭|Immigrant Family', d: '父母从异国来到这里打拼，你在两种文化之间长大。|Your parents moved here from abroad; you grow up between two cultures.', vip: 0,
      w: [10000, 120000], inc: [25000, 70000], job: ['餐馆老板|Restaurant Owner', '工厂工人|Factory Worker', '工程师|Engineer'], st: { smarts: 3, eq: 3 }, sib: [0, 2], imm: 1 },
    { id: 'debt', n: '负债家庭|Indebted Family', d: '父亲欠了一屁股债，催债电话从没停过。|Your father is drowning in debt. The collectors never stop calling.', vip: 0,
      w: [-60000, -5000], inc: [15000, 35000], job: ['无业|Unemployed', '打零工|Odd-job Worker'], st: { happy: -12 }, sib: [0, 2], fl: ['debtfam'] },
    // ---------- VIP ----------
    { id: 'tycoon', n: '富豪之家|Tycoon Family', d: '父亲是商界大亨，家里有私人飞机。|Your father is a business mogul. The family owns a private jet.', vip: 1,
      w: [25000000, 120000000], inc: [2000000, 6000000], job: ['集团董事长|Group Chairman', '投资人|Investor'], st: { looks: 6, eq: 4 }, sib: [0, 2], fl: ['rich', 'elite'] },
    { id: 'academic', n: '院士世家|Family of Academicians', d: '祖孙三代都是院士，家里的客人全是大科学家。|Three generations of academicians. Dinner guests are famous scientists.', vip: 1,
      w: [400000, 1500000], inc: [180000, 320000], job: ['院士|Academician', '首席科学家|Chief Scientist'], st: { smarts: 25, fame: 6 }, sib: [0, 1], fl: ['acafam'] },
    { id: 'celebrity', n: '明星世家|Celebrity Family', d: '父母都是家喻户晓的巨星，你一出生就上了热搜。|Both parents are household-name stars. Your birth trended online.', vip: 2,
      w: [8000000, 40000000], inc: [2000000, 10000000], job: ['影帝|Movie Star', '歌后|Pop Diva', '知名导演|Famous Director'], st: { looks: 20, fame: 30 }, sib: [0, 1], fl: ['rich', 'celebfam', 'elite'] },
    { id: 'champion', n: '冠军世家|Family of Champions', d: '父母都是奥运冠军，家里的奖牌多到放不下。|Both parents are Olympic champions. Medals overflow the shelves.', vip: 2,
      w: [1500000, 6000000], inc: [300000, 1200000], job: ['奥运冠军|Olympic Champion', '国家队教练|National Team Coach'], st: { health: 20, fame: 10 }, sib: [0, 2], fl: ['sportfam'] },
    { id: 'mafia', n: '黑道世家|Crime Family', d: '父亲是地下世界的老大，人人敬他三分。|Your father rules the underworld. Everyone fears him.', vip: 2,
      w: [3000000, 15000000], inc: [800000, 3000000], job: ['黑帮老大|Crime Boss', '夜总会老板|Nightclub Owner'], st: { health: 5, eq: 3 }, sib: [0, 3], karma: -10, fl: ['rich', 'mafiafam'] },
    { id: 'red', n: '红二代|Political Dynasty', d: '祖辈是开国元勋，父辈身居要职，你的人脉从出生就铺好了。|Your grandparents were founding figures; your parents hold high office. Connections come built in.', vip: 3,
      w: [6000000, 30000000], inc: [300000, 900000], job: ['高级官员|Senior Official', '国企董事长|State Enterprise Chairman'], st: { eq: 10, smarts: 5 }, sib: [0, 1], fl: ['rich', 'redfam', 'elite'] },
    { id: 'royal', n: '王室成员|Royal Family', d: '你生于王室，是王位继承人之一。|You are born royal — somewhere in the line of succession.', vip: 3, mon: 1,
      w: [150000000, 600000000], inc: [3000000, 9000000], job: ['国王|King', '王后|Queen', '亲王|Prince', '公主|Princess'], st: { looks: 10, fame: 45 }, sib: [0, 3], fl: ['rich', 'royal', 'elite'] },
    { id: 'noble', n: '名门望族|Old Aristocracy', d: '百年豪门，家族产业遍布全球。|A dynasty centuries old, with holdings around the globe.', vip: 3, mon: -1,
      w: [120000000, 500000000], inc: [2500000, 8000000], job: ['家族掌门人|Family Patriarch', '慈善基金会主席|Foundation Chair'], st: { looks: 8, fame: 25 }, sib: [0, 3], fl: ['rich', 'elite'] },
    { id: 'richest', n: '首富之家|Richest Family in the Nation', d: '你家是全国首富，财富多到数不清。|Your family is the richest in the nation. The fortune is uncountable.', vip: 3,
      w: [1500000000, 8000000000], inc: [10000000, 50000000], job: ['首富|Richest Tycoon', '集团创始人|Conglomerate Founder'], st: { looks: 6, fame: 25 }, sib: [0, 2], fl: ['rich', 'elite', 'richest'] }
  ];
  G.ORIGIN = {}; G.ORIGINS.forEach(function (o) { G.ORIGIN[o.id] = o; });

  // talents: r = rarity 1..3, neg = negative
  G.TALENTS = [
    { id: 'genius', n: '过目不忘|Photographic Memory', d: '智力+20，考试更容易|Smarts +20, exams are easier', r: 3, st: { smarts: 20 } },
    { id: 'smart', n: '聪明伶俐|Quick-witted', d: '智力+10|Smarts +10', r: 1, st: { smarts: 10 } },
    { id: 'beauty', n: '天生丽质|Natural Beauty', d: '颜值+20|Looks +20', r: 2, st: { looks: 20 } },
    { id: 'cute', n: '清秀可人|Good-looking', d: '颜值+10|Looks +10', r: 1, st: { looks: 10 } },
    { id: 'athletic', n: '运动天才|Athletic Prodigy', d: '健康+10，体育类小游戏更容易|Health +10, sports games are easier', r: 2, st: { health: 10 } },
    { id: 'iron', n: '钢铁之躯|Iron Body', d: '健康+15，很少生病|Health +15, rarely gets sick', r: 2, st: { health: 15 } },
    { id: 'frail', n: '体弱多病|Frail', d: '健康-15，容易生病|Health -15, gets sick often', r: 1, neg: 1, st: { health: -15 } },
    { id: 'social', n: '社交达人|Social Butterfly', d: '情商+15|EQ +15', r: 2, st: { eq: 15 } },
    { id: 'charm', n: '万人迷|Heartthrob', d: '追求者翻倍，好感度涨得更快|Twice the admirers, affection grows faster', r: 3, st: { looks: 5 } },
    { id: 'peach', n: '桃花运|Romantic Luck', d: '追求者更多|More admirers', r: 1 },
    { id: 'biz', n: '商业嗅觉|Business Instinct', d: '投资和创业更容易成功|Investments and startups go better', r: 2 },
    { id: 'lucky', n: '幸运儿|Lucky Star', d: '好事更容易发生|Good things happen more often', r: 2 },
    { id: 'unlucky', n: '倒霉蛋|Jinxed', d: '坏事更容易发生|Bad things happen more often', r: 1, neg: 1 },
    { id: 'longevity', n: '长寿基因|Longevity Genes', d: '更长寿|Lives longer', r: 2 },
    { id: 'music', n: '音乐天赋|Musical Gift', d: '音乐和节奏类更容易|Music and rhythm come naturally', r: 2 },
    { id: 'actor', n: '演技派|Born Actor', d: '演艺事业更顺利|Acting career goes smoother', r: 2 },
    { id: 'gamer', n: '电竞天赋|Gaming Talent', d: '电竞事业更顺利|Esports career goes smoother', r: 2 },
    { id: 'polyglot', n: '语言天才|Polyglot', d: '学外语极快，移民更容易|Learns languages fast, emigration is easier', r: 2 },
    { id: 'leader', n: '领袖气质|Natural Leader', d: '仕途和军旅晋升更容易|Promotions in politics and the military come easier', r: 3, st: { eq: 5 } },
    { id: 'hacker', n: '黑客天赋|Hacker Mind', d: '编程类职业更顺利|Coding careers go smoother', r: 2, st: { smarts: 5 } },
    { id: 'art', n: '艺术细胞|Artistic Soul', d: '艺术类事业更顺利|Art careers go smoother', r: 1 },
    { id: 'gambler', n: '赌神|Gambler\'s Luck', d: '赌场里运气爆棚|Incredible luck at the casino', r: 3 },
    { id: 'late', n: '大器晚成|Late Bloomer', d: '35岁后各项属性逐渐提升|Stats keep improving after 35', r: 2 },
    { id: 'prodigy', n: '少年天才|Child Prodigy', d: '智力+12，可能跳级|Smarts +12, may skip grades', r: 3, st: { smarts: 12 } },
    { id: 'slow', n: '学渣体质|Slow Learner', d: '智力-12|Smarts -12', r: 1, neg: 1, st: { smarts: -12 } },
    { id: 'optimist', n: '乐天派|Optimist', d: '心情不容易低落|Hard to stay unhappy', r: 1, st: { happy: 10 } },
    { id: 'sensitive', n: '玻璃心|Sensitive Soul', d: '心情容易大起大落|Mood swings hard', r: 1, neg: 1 },
    { id: 'thrifty', n: '铁公鸡|Penny Pincher', d: '生活开销-30%|Living costs -30%', r: 1 },
    { id: 'spender', n: '败家子|Big Spender', d: '开销+30%，但买东西更开心|Spends 30% more, but shopping brings more joy', r: 1, neg: 1 },
    { id: 'justice', n: '正义感|Sense of Justice', d: '当警察更顺利，干坏事会内疚|Policing comes naturally; crime weighs on you', r: 1 },
    { id: 'ruthless', n: '狠人|Ruthless', d: '打架和混社会更有优势|An edge in fights and the underworld', r: 2, st: { eq: -4 } },
    { id: 'fighter', n: '格斗天赋|Born Fighter', d: '打架小游戏更容易|Fight games are easier', r: 2, st: { health: 5 } },
    { id: 'foodie', n: '吃货|Foodie', d: '吃东西特别开心|Food makes you extra happy', r: 1 },
    { id: 'chosen', n: '天选之子|Chosen One', d: '全属性+8|All stats +8', r: 3, st: { looks: 8, smarts: 8, health: 8, happy: 8, eq: 8 } },
    { id: 'mind', n: '读心术|Mind Reader', d: '能看到他人的真心与忠诚度|See others\' sincerity and loyalty', r: 3 },
    { id: 'fertile', n: '多子多福|Fertile', d: '更容易怀孕生子|Pregnancy comes easier', r: 1 },
    { id: 'photogenic', n: '上镜脸|Photogenic', d: '名气涨得更快|Fame grows faster', r: 2, st: { looks: 4 } }
  ];
  G.TALENT = {}; G.TALENTS.forEach(function (t) { G.TALENT[t.id] = t; });
  G.TALENT_CONFLICT = [['lucky', 'unlucky'], ['smart', 'slow'], ['genius', 'slow'], ['prodigy', 'slow'], ['iron', 'frail'], ['athletic', 'frail'], ['optimist', 'sensitive'], ['thrifty', 'spender'], ['beauty', 'cute'], ['late', 'prodigy']];
  G.talentClash = function (list, id) { return G.TALENT_CONFLICT.some(function (c) { return (c[0] === id && list.indexOf(c[1]) >= 0) || (c[1] === id && list.indexOf(c[0]) >= 0); }); };

  // personalities. lo: loyalty base, mo: values money, lk: values looks, tp: temper
  G.PERS = {
    gentle: { n: '温柔|Gentle', lo: 75, mo: 30, lk: 40, tp: 10 },
    cheer: { n: '开朗|Cheerful', lo: 65, mo: 35, lk: 45, tp: 25 },
    cold: { n: '高冷|Aloof', lo: 60, mo: 40, lk: 65, tp: 40 },
    sharp: { n: '毒舌|Sharp-tongued', lo: 60, mo: 40, lk: 50, tp: 60 },
    tsun: { n: '傲娇|Tsundere', lo: 70, mo: 35, lk: 55, tp: 50 },
    scheme: { n: '腹黑|Scheming', lo: 35, mo: 65, lk: 50, tp: 40 },
    honest: { n: '老实|Honest', lo: 85, mo: 25, lk: 30, tp: 15 },
    artsy: { n: '文艺|Artsy', lo: 60, mo: 20, lk: 55, tp: 35 },
    prag: { n: '务实|Pragmatic', lo: 70, mo: 60, lk: 35, tp: 30 },
    boss: { n: '霸道|Domineering', lo: 55, mo: 45, lk: 55, tp: 70 },
    gold: { n: '拜金|Materialistic', lo: 30, mo: 95, lk: 50, tp: 40 },
    rebel: { n: '叛逆|Rebellious', lo: 45, mo: 30, lk: 60, tp: 75 },
    chill: { n: '佛系|Laid-back', lo: 70, mo: 15, lk: 30, tp: 5 },
    clingy: { n: '粘人|Clingy', lo: 80, mo: 35, lk: 45, tp: 45 },
    nerd: { n: '学霸|Nerdy', lo: 75, mo: 30, lk: 25, tp: 20 },
    romantic: { n: '浪漫|Romantic', lo: 65, mo: 30, lk: 60, tp: 30 },
    playboy: { n: '花心|Flirtatious', lo: 15, mo: 50, lk: 75, tp: 30 }
  };
  G.PERS_LIST = Object.keys(G.PERS);

  G.STATS = {
    looks: { n: '颜值|Looks', c: 'violet', i: '✨' },
    smarts: { n: '智力|Smarts', c: 'sky', i: '🧠' },
    health: { n: '健康|Health', c: 'leaf', i: '❤️' },
    happy: { n: '心情|Mood', c: 'gold', i: '😊' },
    fame: { n: '名声|Fame', c: 'rose', i: '⭐' },
    eq: { n: '情商|EQ', c: 'teal', i: '💬' }
  };
  G.STAT_KEYS = ['looks', 'smarts', 'health', 'happy', 'fame', 'eq'];
})();
