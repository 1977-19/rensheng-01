/* Houses, cars, luxury goods, gifts, pets, diseases, procedures, travel */
(function () {
  'use strict';
  G.HOUSES = [
    { id: 'self', n: '自建房|Self-built House', a: 150, m: .55, tiers: [4, 5], i: '🏡' },
    { id: 'old', n: '老破小|Old Small Flat', a: 40, m: .75, i: '🏚️' },
    { id: 'studio', n: '单身公寓|Studio Apartment', a: 35, m: 1, i: '🏢' },
    { id: 'two', n: '两居室|Two-bedroom Apartment', a: 80, m: 1, i: '🏢' },
    { id: 'three', n: '三居室|Three-bedroom Apartment', a: 120, m: 1.05, i: '🏬' },
    { id: 'school', n: '学区房|School-district Apartment', a: 70, m: 1.8, i: '🏫', school: 1 },
    { id: 'town', n: '联排别墅|Townhouse', a: 180, m: 1.1, i: '🏘️' },
    { id: 'villa', n: '独栋别墅|Villa', a: 350, m: 1.3, i: '🏠' },
    { id: 'mansion', n: '顶级豪宅|Luxury Mansion', a: 1000, m: 2, i: '🏰' },
    { id: 'estate', n: '私人庄园|Private Estate', a: 5000, m: 1.4, i: '🏯' }
  ];
  G.CARS = [
    { id: 'bike', n: '电动自行车|E-bike', p: 600, i: '🛵', f: 1 },
    { id: 'moto', n: '摩托车|Motorcycle', p: 8000, i: '🏍️', f: 2 },
    { id: 'used', n: '二手车|Used Car', p: 6000, i: '🚗', f: 2 },
    { id: 'econ', n: '经济型轿车|Economy Sedan', p: 18000, i: '🚗', f: 3 },
    { id: 'mid', n: '中级轿车|Midsize Sedan', p: 30000, i: '🚙', f: 4 },
    { id: 'ev', n: '电动汽车|Electric Car', p: 38000, i: '🔋', f: 5, y0: 2010 },
    { id: 'suv', n: 'SUV|SUV', p: 42000, i: '🚙', f: 5 },
    { id: 'lux', n: '豪华轿车|Luxury Sedan', p: 90000, i: '🚘', f: 8 },
    { id: 'sport', n: '跑车|Sports Car', p: 190000, i: '🏎️', f: 12 },
    { id: 'limo', n: '加长豪车|Limousine', p: 320000, i: '🚐', f: 12 },
    { id: 'super', n: '超级跑车|Supercar', p: 480000, i: '🏎️', f: 16 }
  ];
  G.LUX = [
    { id: 'phone', n: '最新款手机|Latest Smartphone', p: 1200, i: '📱', y0: 2008, h: 3 },
    { id: 'console', n: '游戏机|Game Console', p: 500, i: '🎮', y0: 1985, h: 4 },
    { id: 'guitar', n: '吉他|Guitar', p: 600, i: '🎸', h: 3 },
    { id: 'piano', n: '钢琴|Piano', p: 9000, i: '🎹', h: 4 },
    { id: 'bag', n: '名牌包|Designer Handbag', p: 4500, i: '👜', h: 6 },
    { id: 'watch', n: '名表|Luxury Watch', p: 16000, i: '⌚', h: 6 },
    { id: 'ring', n: '钻戒|Diamond Ring', p: 12000, i: '💍', h: 5 },
    { id: 'jewel', n: '珠宝首饰|Fine Jewelry', p: 30000, i: '💎', h: 7 },
    { id: 'art', n: '名画|Masterpiece Painting', p: 2500000, i: '🖼️', h: 10, inv: 1 },
    { id: 'yacht', n: '游艇|Yacht', p: 3500000, i: '🛥️', h: 14 },
    { id: 'jet', n: '私人飞机|Private Jet', p: 45000000, i: '🛩️', h: 18 },
    { id: 'island', n: '私人岛屿|Private Island', p: 120000000, i: '🏝️', h: 22 }
  ];
  // gifts. v = base value USD-2024. like = personalities that love it
  G.GIFTS = [
    { id: 'flower', n: '鲜花|Flowers', v: 50, i: '💐', like: ['romantic', 'gentle', 'artsy'] },
    { id: 'choco', n: '巧克力|Chocolates', v: 30, i: '🍫', like: ['cheer', 'clingy'] },
    { id: 'book', n: '一本好书|A Good Book', v: 25, i: '📚', like: ['nerd', 'artsy', 'honest'] },
    { id: 'toy', n: '玩具|Toy', v: 40, i: '🧸', kid: 1 },
    { id: 'tea', n: '高档茶叶|Premium Tea', v: 150, i: '🍵', like: ['prag', 'honest'], old: 1 },
    { id: 'wine', n: '红酒|Fine Wine', v: 220, i: '🍷', like: ['boss', 'cold'] },
    { id: 'perfume', n: '香水|Perfume', v: 160, i: '🌸', like: ['romantic', 'cold', 'gold'] },
    { id: 'lipstick', n: '口红|Lipstick', v: 45, i: '💄', like: ['cheer', 'tsun'] },
    { id: 'game', n: '游戏机|Game Console', v: 500, i: '🎮', like: ['rebel', 'chill', 'nerd'] },
    { id: 'phone', n: '新手机|New Phone', v: 1200, i: '📱', like: ['gold', 'cheer'], y0: 2008 },
    { id: 'bag', n: '名牌包|Designer Bag', v: 4500, i: '👜', like: ['gold', 'cold'] },
    { id: 'watch', n: '名表|Luxury Watch', v: 16000, i: '⌚', like: ['boss', 'gold', 'prag'] },
    { id: 'jewel', n: '珠宝|Jewelry', v: 30000, i: '💎', like: ['gold', 'romantic'] },
    { id: 'car', n: '一辆豪车|A Luxury Car', v: 90000, i: '🚘', like: ['gold', 'boss'] },
    { id: 'house', n: '一套房子|An Apartment', v: 500000, i: '🏠', like: ['gold', 'prag', 'scheme'] }
  ];
  G.PETS = [
    { id: 'dog', n: '狗|Dog', i: '🐶', life: 13, p: 800, up: 1200 },
    { id: 'cat', n: '猫|Cat', i: '🐱', life: 15, p: 500, up: 900 },
    { id: 'hamster', n: '仓鼠|Hamster', i: '🐹', life: 3, p: 30, up: 100 },
    { id: 'rabbit', n: '兔子|Rabbit', i: '🐰', life: 9, p: 80, up: 300 },
    { id: 'fish', n: '金鱼|Goldfish', i: '🐠', life: 6, p: 10, up: 50 },
    { id: 'parrot', n: '鹦鹉|Parrot', i: '🦜', life: 40, p: 600, up: 300 },
    { id: 'turtle', n: '乌龟|Tortoise', i: '🐢', life: 80, p: 150, up: 80 },
    { id: 'hedgehog', n: '刺猬|Hedgehog', i: '🦔', life: 5, p: 250, up: 200 },
    { id: 'pig', n: '小香猪|Mini Pig', i: '🐷', life: 15, p: 700, up: 600 },
    { id: 'snake', n: '蟒蛇|Python', i: '🐍', life: 25, p: 400, up: 500, ex: 1 },
    { id: 'lizard', n: '鬃狮蜥|Bearded Dragon', i: '🦎', life: 12, p: 300, up: 300, ex: 1 },
    { id: 'owl', n: '猫头鹰|Owl', i: '🦉', life: 20, p: 1500, up: 1000, ex: 1 },
    { id: 'fox', n: '狐狸|Fox', i: '🦊', life: 12, p: 2000, up: 1500, ex: 1 },
    { id: 'alpaca', n: '羊驼|Alpaca', i: '🦙', life: 20, p: 4000, up: 2500, ex: 1 },
    { id: 'monkey', n: '小猴子|Monkey', i: '🐒', life: 25, p: 6000, up: 3000, ex: 1 },
    { id: 'horse', n: '骏马|Horse', i: '🐎', life: 28, p: 15000, up: 8000, ex: 1 },
    { id: 'tiger', n: '老虎|Tiger', i: '🐯', life: 20, p: 80000, up: 30000, ex: 1, illegal: 1 }
  ];
  G.PET_NAMES = '旺财|Lucky,豆豆|Bean,咪咪|Mimi,球球|Bubbles,小白|Snowy,大黄|Goldie,可乐|Cola,布丁|Pudding,年糕|Mochi,雪球|Snowball,黑炭|Coal,花花|Blossom,元宝|Nugget,团子|Dumpling,奶茶|Boba,小七|Seven,阿福|Fortune,点点|Dot,饭团|Riceball,妞妞|Niu Niu'.split(',');

  // illnesses. sev 1-5, dmg health/yr, cost USD treatment, cure probability, a: min age
  G.ILL = {
    cold: { n: '感冒|Common Cold', sev: 1, dmg: 2, cost: 30, cure: .95, a: 0 },
    flu: { n: '流感|Influenza', sev: 1, dmg: 5, cost: 80, cure: .9, a: 0 },
    myopia: { n: '近视|Myopia', sev: 1, dmg: 0, cost: 2000, cure: .9, a: 6, chronic: 1, lk: -2 },
    gastritis: { n: '胃炎|Gastritis', sev: 2, dmg: 4, cost: 300, cure: .7, a: 15 },
    pneumonia: { n: '肺炎|Pneumonia', sev: 3, dmg: 12, cost: 1500, cure: .8, a: 0, lethal: .03 },
    spine: { n: '颈椎病|Cervical Spondylosis', sev: 2, dmg: 3, cost: 800, cure: .5, a: 22, chronic: 1 },
    depression: { n: '抑郁症|Depression', sev: 3, dmg: 3, cost: 2500, cure: .45, a: 12, hp: -15 },
    anxiety: { n: '焦虑症|Anxiety Disorder', sev: 2, dmg: 3, cost: 1500, cure: .55, a: 12, hp: -10 },
    burnout: { n: '过劳|Burnout', sev: 2, dmg: 8, cost: 500, cure: .7, a: 20, hp: -10 },
    hyper: { n: '高血压|Hypertension', sev: 2, dmg: 4, cost: 600, cure: .3, a: 35, chronic: 1 },
    diabetes: { n: '糖尿病|Diabetes', sev: 3, dmg: 6, cost: 2000, cure: .1, a: 30, chronic: 1 },
    gout: { n: '痛风|Gout', sev: 2, dmg: 4, cost: 500, cure: .3, a: 30, chronic: 1 },
    heart: { n: '心脏病|Heart Disease', sev: 4, dmg: 14, cost: 30000, cure: .45, a: 40, lethal: .12 },
    stroke: { n: '中风|Stroke', sev: 5, dmg: 25, cost: 40000, cure: .35, a: 50, lethal: .2 },
    lungc: { n: '肺癌|Lung Cancer', sev: 5, dmg: 20, cost: 80000, cure: .3, a: 40, lethal: .3, hab: 'smoke' },
    liver: { n: '肝硬化|Cirrhosis', sev: 4, dmg: 15, cost: 50000, cure: .25, a: 35, lethal: .15, hab: 'drink' },
    stomachc: { n: '胃癌|Stomach Cancer', sev: 5, dmg: 18, cost: 70000, cure: .35, a: 40, lethal: .25 },
    breastc: { n: '乳腺癌|Breast Cancer', sev: 4, dmg: 15, cost: 60000, cure: .6, a: 35, lethal: .15, g: 'f' },
    prostate: { n: '前列腺癌|Prostate Cancer', sev: 4, dmg: 12, cost: 50000, cure: .65, a: 50, lethal: .1, g: 'm' },
    leukemia: { n: '白血病|Leukemia', sev: 5, dmg: 22, cost: 100000, cure: .4, a: 0, lethal: .25, rare: 1 },
    alz: { n: '阿尔茨海默症|Alzheimer\'s', sev: 4, dmg: 8, cost: 20000, cure: .02, a: 65, chronic: 1, sm: -8 },
    fracture: { n: '骨折|Bone Fracture', sev: 2, dmg: 8, cost: 2000, cure: .97, a: 0 },
    insomnia: { n: '失眠症|Insomnia', sev: 1, dmg: 3, cost: 300, cure: .6, a: 16, hp: -5 },
    allergy: { n: '过敏性鼻炎|Allergic Rhinitis', sev: 1, dmg: 1, cost: 200, cure: .5, a: 3, chronic: 1 }
  };
  G.SURG = [
    { id: 'skin', n: '美容护肤|Skin Treatment', p: 500, lk: 2, f: 0 },
    { id: 'botox', n: '瘦脸针|Botox', p: 900, lk: 3, f: .03 },
    { id: 'eyelid', n: '割双眼皮|Double Eyelid Surgery', p: 3000, lk: 6, f: .08 },
    { id: 'teeth', n: '牙齿矫正|Orthodontics', p: 5000, lk: 5, f: .02 },
    { id: 'nose', n: '隆鼻|Rhinoplasty', p: 7000, lk: 8, f: .1 },
    { id: 'lipo', n: '抽脂塑形|Liposuction', p: 6000, lk: 6, f: .08 },
    { id: 'hair', n: '植发|Hair Transplant', p: 9000, lk: 6, f: .05 },
    { id: 'jaw', n: '削骨瘦脸|Jaw Contouring', p: 15000, lk: 10, f: .14 },
    { id: 'full', n: '全脸整容|Full Facial Reconstruction', p: 45000, lk: 22, f: .2 }
  ];
  G.TRAVEL = [
    { id: 'home', n: '国内游|Domestic Trip', p: 600, h: 8 },
    { id: 'beach', n: '海岛度假|Beach Holiday', p: 2500, h: 12 },
    { id: 'tokyo', n: '日本东京|Tokyo, Japan', p: 3000, h: 14, c: 'jp' },
    { id: 'bkk', n: '泰国曼谷|Bangkok, Thailand', p: 1800, h: 12, c: 'th' },
    { id: 'paris', n: '法国巴黎|Paris, France', p: 5000, h: 16, c: 'fr' },
    { id: 'nyc', n: '美国纽约|New York, USA', p: 5000, h: 15, c: 'us' },
    { id: 'london', n: '英国伦敦|London, UK', p: 4500, h: 14, c: 'gb' },
    { id: 'rome', n: '意大利罗马|Rome, Italy', p: 4200, h: 15, c: 'it' },
    { id: 'maldives', n: '马尔代夫|The Maldives', p: 9000, h: 20 },
    { id: 'iceland', n: '冰岛极光|Iceland Aurora', p: 7000, h: 19 },
    { id: 'egypt', n: '埃及金字塔|Pyramids of Egypt', p: 3500, h: 15 },
    { id: 'safari', n: '非洲草原|African Safari', p: 8000, h: 18, c: 'za' },
    { id: 'antarctica', n: '南极探险|Antarctic Expedition', p: 25000, h: 25 },
    { id: 'space', n: '太空旅行|Space Tourism', p: 450000, h: 40, y0: 2025 }
  ];
  G.WEDDING = [
    { id: 'reg', n: '只领证不办酒|Just Sign the Papers', p: 50, h: 2 },
    { id: 'simple', n: '简单的小婚礼|Small Wedding', p: 8000, h: 8 },
    { id: 'normal', n: '体面的婚礼|Proper Wedding', p: 30000, h: 14 },
    { id: 'lux', n: '豪华婚礼|Lavish Wedding', p: 150000, h: 20, fame: 3 },
    { id: 'royal', n: '世纪婚礼|Wedding of the Century', p: 3000000, h: 28, fame: 15 }
  ];
  G.INV = {
    idx: { n: '指数基金|Index Fund', mu: .07, sd: .16, i: '📈' },
    blue: { n: '蓝筹股|Blue-chip Stocks', mu: .075, sd: .2, i: '🏦' },
    tech: { n: '科技股|Tech Stocks', mu: .11, sd: .35, i: '💻' },
    bond: { n: '国债|Government Bonds', mu: .035, sd: .04, i: '📜' },
    gold: { n: '黄金|Gold', mu: .05, sd: .15, i: '🥇' },
    crypto: { n: '加密货币|Crypto', mu: .25, sd: 1.1, i: '🪙', y0: 2011 }
  };
  G.INV_KEYS = ['idx', 'blue', 'tech', 'bond', 'gold', 'crypto'];
})();
