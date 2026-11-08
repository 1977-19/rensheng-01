/* Countries, cities, economy anchors */
(function () {
  'use strict';
  // skin tones: 0 very light .. 5 dark
  function C(o) { return o; }
  G.TIERS = [null, '一线城市|Megacity', '大城市|Major City', '普通城市|City', '小镇|Small Town', '乡村|Countryside'];
  G.TIERS_CN = [null, '一线城市|Tier-1 City', '新一线城市|New Tier-1 City', '二三线城市|Tier-2/3 City', '县城|County Town', '农村|Village'];
  G.HOUSE_TIER = [1, 4.5, 2, 1, 0.55, 0.3];

  G.C = {
    cn: C({ id: 'cn', n: '中国|China', flag: '🇨🇳', cur: { sym: '¥', code: 'CNY', n: '元|yuan' }, fx: 7.2, pl: 0.45, wg: 0.22,
      idx: [[1950, .003], [1960, .0045], [1970, .005], [1980, .008], [1990, .025], [2000, .09], [2010, .32], [2020, .82], [2024, 1]], g: .04,
      life: 78, tax: .12, itax: 0, retire: 60, gay: 0, gamble: false, consc: null, mon: false, dem: false, lang: 'zh',
      top: '国家最高领导人|Paramount Leader', hsq: 1300, skin: [0, 4, 6, 1, 0, 0], names: 'cn', edu: 'cn', imm: 3,
      cities: {
        1: ['北京|Beijing', '上海|Shanghai', '广州|Guangzhou', '深圳|Shenzhen'],
        2: ['成都|Chengdu', '杭州|Hangzhou', '重庆|Chongqing', '武汉|Wuhan', '西安|Xi\'an', '苏州|Suzhou', '南京|Nanjing', '长沙|Changsha', '天津|Tianjin', '郑州|Zhengzhou', '青岛|Qingdao', '东莞|Dongguan'],
        3: ['合肥|Hefei', '昆明|Kunming', '福州|Fuzhou', '济南|Jinan', '哈尔滨|Harbin', '南宁|Nanning', '贵阳|Guiyang', '兰州|Lanzhou', '洛阳|Luoyang', '桂林|Guilin', '大连|Dalian', '厦门|Xiamen', '太原|Taiyuan', '南昌|Nanchang', '石家庄|Shijiazhuang', '温州|Wenzhou', '珠海|Zhuhai', '呼和浩特|Hohhot'],
        4: ['曹县|Cao County', '安溪县|Anxi County', '婺源县|Wuyuan County', '平遥县|Pingyao County', '寿光|Shouguang', '凤凰县|Fenghuang County', '阳朔县|Yangshuo County', '建水县|Jianshui County', '丰都县|Fengdu County', '沭阳县|Shuyang County'],
        5: ['王家村|Wangjia Village', '桃花村|Taohua Village', '石门村|Shimen Village', '柳树屯|Liushu Hamlet', '杨家坪|Yangjiaping', '大槐树村|Dahuaishu Village', '清水湾|Qingshui Bay', '高家庄|Gaojiazhuang']
      } }),
    us: C({ id: 'us', n: '美国|United States', flag: '🇺🇸', cur: { sym: '$', code: 'USD', n: '美元|dollars' }, fx: 1, pl: 1, wg: 1,
      idx: [[1950, .025], [1960, .036], [1970, .062], [1980, .15], [1990, .28], [2000, .42], [2010, .57], [2020, .76], [2024, 1]], g: .025,
      life: 77, tax: .22, itax: .15, retire: 67, gay: 2015, gamble: true, consc: null, mon: false, dem: true, lang: 'en',
      top: '总统|President', hsq: 2000, skin: [3, 4, 2, 2, 1, 2], names: 'us', edu: 'us', imm: 3,
      cities: {
        1: ['纽约|New York', '洛杉矶|Los Angeles', '旧金山|San Francisco', '芝加哥|Chicago'],
        2: ['西雅图|Seattle', '波士顿|Boston', '休斯顿|Houston', '迈阿密|Miami', '亚特兰大|Atlanta', '达拉斯|Dallas', '华盛顿|Washington, D.C.'],
        3: ['丹佛|Denver', '凤凰城|Phoenix', '哥伦布|Columbus', '波特兰|Portland', '纳什维尔|Nashville', '底特律|Detroit', '盐湖城|Salt Lake City', '匹兹堡|Pittsburgh'],
        4: ['斯普林菲尔德|Springfield', '格林维尔|Greenville', '富兰克林|Franklin', '克林顿|Clinton', '麦迪逊|Madison'],
        5: ['爱荷华农场|a farm in Iowa', '德州牧场|a ranch in Texas', '蒙大拿乡村|rural Montana', '肯塔基山区|the Kentucky hills']
      } }),
    jp: C({ id: 'jp', n: '日本|Japan', flag: '🇯🇵', cur: { sym: '¥', code: 'JPY', n: '日元|yen' }, fx: 150, pl: .62, wg: .5,
      idx: [[1950, .02], [1960, .05], [1970, .18], [1980, .5], [1990, .85], [2000, .95], [2010, .92], [2020, .97], [2024, 1]], g: .012,
      life: 84, tax: .2, itax: .3, retire: 65, gay: 0, gamble: false, consc: null, mon: true, dem: true, lang: 'ja',
      top: '首相|Prime Minister', hsq: 1800, skin: [1, 6, 3, 0, 0, 0], names: 'jp', edu: 'jp', imm: 4,
      cities: {
        1: ['东京|Tokyo', '大阪|Osaka'], 2: ['横滨|Yokohama', '名古屋|Nagoya', '京都|Kyoto', '福冈|Fukuoka', '神户|Kobe', '札幌|Sapporo'],
        3: ['仙台|Sendai', '广岛|Hiroshima', '金泽|Kanazawa', '冈山|Okayama', '熊本|Kumamoto', '那霸|Naha'],
        4: ['轻井泽|Karuizawa', '高山|Takayama', '函馆|Hakodate', '镰仓|Kamakura'], 5: ['北海道农村|rural Hokkaido', '四国山村|a mountain village in Shikoku', '秋田乡下|rural Akita']
      } }),
    kr: C({ id: 'kr', n: '韩国|South Korea', flag: '🇰🇷', cur: { sym: '₩', code: 'KRW', n: '韩元|won' }, fx: 1350, pl: .62, wg: .6,
      idx: [[1950, .002], [1960, .004], [1970, .012], [1980, .07], [1990, .22], [2000, .45], [2010, .66], [2020, .9], [2024, 1]], g: .025,
      life: 83, tax: .18, itax: .3, retire: 60, gay: 0, gamble: true, consc: { g: 'm', age: 19, yrs: 2 }, mon: false, dem: true, lang: 'ko',
      top: '总统|President', hsq: 2600, skin: [1, 6, 3, 0, 0, 0], names: 'kr', edu: 'kr', imm: 4,
      cities: { 1: ['首尔|Seoul'], 2: ['釜山|Busan', '仁川|Incheon', '大邱|Daegu', '大田|Daejeon'], 3: ['光州|Gwangju', '水原|Suwon', '蔚山|Ulsan', '全州|Jeonju', '济州|Jeju'],
        4: ['安东|Andong', '庆州|Gyeongju', '春川|Chuncheon'], 5: ['江原道山村|a village in Gangwon', '全罗道农村|rural Jeolla'] } }),
    gb: C({ id: 'gb', n: '英国|United Kingdom', flag: '🇬🇧', cur: { sym: '£', code: 'GBP', n: '英镑|pounds' }, fx: .79, pl: .95, wg: .8,
      idx: [[1950, .02], [1960, .035], [1970, .06], [1980, .2], [1990, .36], [2000, .5], [2010, .65], [2020, .8], [2024, 1]], g: .025,
      life: 81, tax: .25, itax: .2, retire: 66, gay: 2014, gamble: true, consc: null, mon: true, dem: true, lang: 'en',
      top: '首相|Prime Minister', hsq: 3500, skin: [5, 4, 1, 1, 1, 1], names: 'gb', edu: 'gb', imm: 3,
      cities: { 1: ['伦敦|London'], 2: ['曼彻斯特|Manchester', '伯明翰|Birmingham', '爱丁堡|Edinburgh', '利物浦|Liverpool', '格拉斯哥|Glasgow'],
        3: ['布里斯托|Bristol', '利兹|Leeds', '剑桥|Cambridge', '牛津|Oxford', '加的夫|Cardiff', '约克|York'],
        4: ['巴斯|Bath', '温莎|Windsor', '斯特拉特福|Stratford-upon-Avon'], 5: ['科茨沃尔德乡村|the Cotswolds', '苏格兰高地|the Scottish Highlands', '约克郡农场|a Yorkshire farm'] } }),
    fr: C({ id: 'fr', n: '法国|France', flag: '🇫🇷', cur: { sym: '€', code: 'EUR', n: '欧元|euros' }, fx: .92, pl: .85, wg: .72,
      idx: [[1950, .01], [1960, .03], [1970, .06], [1980, .18], [1990, .36], [2000, .5], [2010, .7], [2020, .84], [2024, 1]], g: .02,
      life: 82, tax: .3, itax: .2, retire: 64, gay: 2013, gamble: true, consc: null, mon: false, dem: true, lang: 'fr',
      top: '总统|President', hsq: 3000, skin: [5, 4, 1, 1, 1, 1], names: 'fr', edu: 'fr', imm: 3,
      cities: { 1: ['巴黎|Paris'], 2: ['里昂|Lyon', '马赛|Marseille', '尼斯|Nice', '图卢兹|Toulouse'], 3: ['波尔多|Bordeaux', '南特|Nantes', '斯特拉斯堡|Strasbourg', '里尔|Lille', '蒙彼利埃|Montpellier'],
        4: ['阿维尼翁|Avignon', '戛纳|Cannes', '安纳西|Annecy'], 5: ['普罗旺斯乡村|rural Provence', '诺曼底农场|a Normandy farm', '勃艮第葡萄园|a Burgundy vineyard'] } }),
    de: C({ id: 'de', n: '德国|Germany', flag: '🇩🇪', cur: { sym: '€', code: 'EUR', n: '欧元|euros' }, fx: .92, pl: .88, wg: .85,
      idx: [[1950, .03], [1960, .06], [1970, .12], [1980, .25], [1990, .4], [2000, .55], [2010, .7], [2020, .85], [2024, 1]], g: .02,
      life: 81, tax: .32, itax: .15, retire: 67, gay: 2017, gamble: true, consc: null, mon: false, dem: true, lang: 'de',
      top: '总理|Chancellor', hsq: 3200, skin: [5, 4, 1, 1, 1, 0], names: 'de', edu: 'de', imm: 3,
      cities: { 1: ['柏林|Berlin', '慕尼黑|Munich'], 2: ['汉堡|Hamburg', '法兰克福|Frankfurt', '科隆|Cologne', '斯图加特|Stuttgart'], 3: ['杜塞尔多夫|Düsseldorf', '莱比锡|Leipzig', '德累斯顿|Dresden', '纽伦堡|Nuremberg', '汉诺威|Hanover'],
        4: ['海德堡|Heidelberg', '罗滕堡|Rothenburg', '弗莱堡|Freiburg'], 5: ['巴伐利亚乡村|rural Bavaria', '黑森林村庄|a Black Forest village'] } }),
    ru: C({ id: 'ru', n: '俄罗斯|Russia', flag: '🇷🇺', cur: { sym: '₽', code: 'RUB', n: '卢布|rubles' }, fx: 90, pl: .35, wg: .18,
      idx: [[1950, .0004], [1960, .0006], [1970, .0008], [1980, .001], [1990, .0015], [2000, .03], [2010, .3], [2020, .6], [2024, 1]], g: .05,
      life: 72, tax: .13, itax: 0, retire: 63, gay: 0, gamble: true, consc: { g: 'm', age: 18, yrs: 1 }, mon: false, dem: true, lang: 'ru',
      top: '总统|President', hsq: 1200, skin: [5, 5, 1, 0, 0, 0], names: 'ru', edu: 'ru', imm: 3,
      cities: { 1: ['莫斯科|Moscow', '圣彼得堡|Saint Petersburg'], 2: ['新西伯利亚|Novosibirsk', '叶卡捷琳堡|Yekaterinburg', '喀山|Kazan'], 3: ['索契|Sochi', '符拉迪沃斯托克|Vladivostok', '萨马拉|Samara', '下诺夫哥罗德|Nizhny Novgorod'],
        4: ['苏兹达尔|Suzdal', '摩尔曼斯克|Murmansk'], 5: ['西伯利亚村庄|a Siberian village', '伏尔加河畔农庄|a farm on the Volga'] } }),
    in: C({ id: 'in', n: '印度|India', flag: '🇮🇳', cur: { sym: '₹', code: 'INR', n: '卢比|rupees' }, fx: 83, pl: .25, wg: .06,
      idx: [[1950, .002], [1960, .003], [1970, .006], [1980, .015], [1990, .04], [2000, .1], [2010, .3], [2020, .7], [2024, 1]], g: .07,
      life: 70, tax: .12, itax: 0, retire: 60, gay: 0, gamble: false, consc: null, mon: false, dem: true, lang: 'hi',
      top: '总理|Prime Minister', hsq: 600, skin: [0, 0, 1, 4, 4, 2], names: 'in', edu: 'in', imm: 2,
      cities: { 1: ['孟买|Mumbai', '新德里|New Delhi', '班加罗尔|Bengaluru'], 2: ['海得拉巴|Hyderabad', '金奈|Chennai', '加尔各答|Kolkata', '浦那|Pune'], 3: ['斋浦尔|Jaipur', '勒克瑙|Lucknow', '艾哈迈达巴德|Ahmedabad', '果阿|Goa'],
        4: ['瓦拉纳西|Varanasi', '乌代浦|Udaipur', '本地治里|Puducherry'], 5: ['北方邦农村|rural Uttar Pradesh', '喀拉拉村庄|a Kerala village', '拉贾斯坦沙漠村|a Rajasthan desert village'] } }),
    br: C({ id: 'br', n: '巴西|Brazil', flag: '🇧🇷', cur: { sym: 'R$', code: 'BRL', n: '雷亚尔|reais' }, fx: 5.2, pl: .45, wg: .15,
      idx: [[1950, .005], [1970, .01], [1990, .03], [2000, .12], [2010, .4], [2020, .75], [2024, 1]], g: .05,
      life: 75, tax: .2, itax: .05, retire: 65, gay: 2013, gamble: false, consc: null, mon: false, dem: true, lang: 'pt',
      top: '总统|President', hsq: 900, skin: [2, 3, 3, 3, 2, 2], names: 'br', edu: 'br', imm: 2,
      cities: { 1: ['圣保罗|São Paulo', '里约热内卢|Rio de Janeiro'], 2: ['巴西利亚|Brasília', '萨尔瓦多|Salvador', '贝洛奥里藏特|Belo Horizonte'], 3: ['阿雷格里港|Porto Alegre', '累西腓|Recife', '库里蒂巴|Curitiba', '福塔雷萨|Fortaleza', '马瑙斯|Manaus'],
        4: ['帕拉蒂|Paraty', '欧鲁普雷图|Ouro Preto'], 5: ['亚马孙雨林村落|an Amazon village', '东北腹地农场|a farm in the sertão'] } }),
    au: C({ id: 'au', n: '澳大利亚|Australia', flag: '🇦🇺', cur: { sym: 'A$', code: 'AUD', n: '澳元|Australian dollars' }, fx: 1.5, pl: 1, wg: .95,
      idx: [[1950, .02], [1960, .04], [1970, .06], [1980, .15], [1990, .3], [2000, .42], [2010, .65], [2020, .82], [2024, 1]], g: .03,
      life: 83, tax: .25, itax: 0, retire: 67, gay: 2017, gamble: true, consc: null, mon: false, dem: true, lang: 'en',
      top: '总理|Prime Minister', hsq: 4000, skin: [5, 4, 2, 1, 1, 1], names: 'gb', edu: 'au', imm: 3,
      cities: { 1: ['悉尼|Sydney', '墨尔本|Melbourne'], 2: ['布里斯班|Brisbane', '珀斯|Perth'], 3: ['阿德莱德|Adelaide', '堪培拉|Canberra', '黄金海岸|Gold Coast', '霍巴特|Hobart'],
        4: ['凯恩斯|Cairns', '达尔文|Darwin', '拜伦湾|Byron Bay'], 5: ['内陆牧场|an outback station', '塔斯马尼亚农场|a Tasmanian farm'] } }),
    ca: C({ id: 'ca', n: '加拿大|Canada', flag: '🇨🇦', cur: { sym: 'C$', code: 'CAD', n: '加元|Canadian dollars' }, fx: 1.36, pl: .9, wg: .85,
      idx: [[1950, .02], [1960, .035], [1970, .06], [1980, .16], [1990, .32], [2000, .45], [2010, .65], [2020, .82], [2024, 1]], g: .025,
      life: 82, tax: .25, itax: 0, retire: 65, gay: 2005, gamble: true, consc: null, mon: false, dem: true, lang: 'en',
      top: '总理|Prime Minister', hsq: 3800, skin: [4, 4, 2, 1, 1, 1], names: 'us', edu: 'ca', imm: 2,
      cities: { 1: ['多伦多|Toronto', '温哥华|Vancouver'], 2: ['蒙特利尔|Montreal', '卡尔加里|Calgary', '渥太华|Ottawa'], 3: ['埃德蒙顿|Edmonton', '温尼伯|Winnipeg', '魁北克城|Quebec City', '哈利法克斯|Halifax', '维多利亚|Victoria'],
        4: ['班夫|Banff', '尼亚加拉|Niagara Falls'], 5: ['萨斯喀彻温农场|a Saskatchewan farm', '育空小镇|a Yukon settlement'] } }),
    sg: C({ id: 'sg', n: '新加坡|Singapore', flag: '🇸🇬', cur: { sym: 'S$', code: 'SGD', n: '新元|Singapore dollars' }, fx: 1.34, pl: .85, wg: .9,
      idx: [[1950, .02], [1960, .03], [1970, .05], [1980, .12], [1990, .25], [2000, .4], [2010, .6], [2020, .78], [2024, 1]], g: .03,
      life: 83, tax: .1, itax: 0, retire: 63, gay: 0, gamble: true, consc: { g: 'm', age: 18, yrs: 2 }, mon: false, dem: true, lang: 'en',
      top: '总理|Prime Minister', hsq: 9000, skin: [1, 5, 3, 1, 1, 0], names: 'sg', edu: 'sg', imm: 3,
      cities: { 1: ['滨海湾|Marina Bay', '乌节路|Orchard'], 2: ['裕廊|Jurong', '淡滨尼|Tampines', '女皇镇|Queenstown'], 3: ['义顺|Yishun', '兀兰|Woodlands', '盛港|Sengkang', '后港|Hougang'], 4: ['乌敏岛|Pulau Ubin'], 5: ['林厝港|Lim Chu Kang'] } }),
    it: C({ id: 'it', n: '意大利|Italy', flag: '🇮🇹', cur: { sym: '€', code: 'EUR', n: '欧元|euros' }, fx: .92, pl: .75, wg: .6,
      idx: [[1950, .01], [1960, .025], [1970, .05], [1980, .17], [1990, .45], [2000, .6], [2010, .75], [2020, .82], [2024, 1]], g: .02,
      life: 83, tax: .3, itax: .05, retire: 67, gay: 0, gamble: true, consc: null, mon: false, dem: true, lang: 'it',
      top: '总理|Prime Minister', hsq: 2200, skin: [3, 5, 2, 0, 0, 0], names: 'it', edu: 'it', imm: 3,
      cities: { 1: ['罗马|Rome', '米兰|Milan'], 2: ['那不勒斯|Naples', '都灵|Turin', '佛罗伦萨|Florence'], 3: ['博洛尼亚|Bologna', '威尼斯|Venice', '热那亚|Genoa', '巴勒莫|Palermo', '维罗纳|Verona'],
        4: ['锡耶纳|Siena', '阿马尔菲|Amalfi', '五渔村|Cinque Terre'], 5: ['托斯卡纳乡间|the Tuscan countryside', '西西里农庄|a Sicilian farmhouse'] } }),
    es: C({ id: 'es', n: '西班牙|Spain', flag: '🇪🇸', cur: { sym: '€', code: 'EUR', n: '欧元|euros' }, fx: .92, pl: .68, wg: .5,
      idx: [[1950, .005], [1960, .012], [1970, .03], [1980, .12], [1990, .35], [2000, .5], [2010, .72], [2020, .8], [2024, 1]], g: .02,
      life: 83, tax: .25, itax: .1, retire: 66, gay: 2005, gamble: true, consc: null, mon: true, dem: true, lang: 'es',
      top: '首相|Prime Minister', hsq: 2000, skin: [3, 5, 2, 0, 0, 0], names: 'es', edu: 'es', imm: 2,
      cities: { 1: ['马德里|Madrid', '巴塞罗那|Barcelona'], 2: ['瓦伦西亚|Valencia', '塞维利亚|Seville', '毕尔巴鄂|Bilbao'], 3: ['马拉加|Málaga', '萨拉戈萨|Zaragoza', '格拉纳达|Granada', '帕尔马|Palma'],
        4: ['龙达|Ronda', '托莱多|Toledo'], 5: ['安达卢西亚农庄|an Andalusian farm', '加利西亚村庄|a Galician village'] } }),
    mx: C({ id: 'mx', n: '墨西哥|Mexico', flag: '🇲🇽', cur: { sym: 'MX$', code: 'MXN', n: '比索|pesos' }, fx: 17.5, pl: .45, wg: .14,
      idx: [[1950, .0005], [1970, .001], [1980, .003], [1990, .05], [2000, .25], [2010, .5], [2020, .75], [2024, 1]], g: .05,
      life: 75, tax: .18, itax: 0, retire: 65, gay: 2022, gamble: true, consc: null, mon: false, dem: true, lang: 'es',
      top: '总统|President', hsq: 900, skin: [1, 2, 4, 4, 1, 0], names: 'mx', edu: 'mx', imm: 2,
      cities: { 1: ['墨西哥城|Mexico City'], 2: ['瓜达拉哈拉|Guadalajara', '蒙特雷|Monterrey', '坎昆|Cancún'], 3: ['普埃布拉|Puebla', '蒂华纳|Tijuana', '梅里达|Mérida', '克雷塔罗|Querétaro'],
        4: ['瓦哈卡|Oaxaca', '圣米格尔|San Miguel de Allende'], 5: ['恰帕斯山村|a Chiapas mountain village', '哈利斯科龙舌兰农场|an agave farm in Jalisco'] } }),
    th: C({ id: 'th', n: '泰国|Thailand', flag: '🇹🇭', cur: { sym: '฿', code: 'THB', n: '泰铢|baht' }, fx: 35, pl: .33, wg: .1,
      idx: [[1950, .01], [1970, .03], [1980, .08], [1990, .2], [2000, .35], [2010, .6], [2020, .85], [2024, 1]], g: .03,
      life: 78, tax: .1, itax: .05, retire: 60, gay: 2025, gamble: false, consc: { g: 'm', age: 21, yrs: 2, lottery: .4 }, mon: true, dem: true, lang: 'th',
      top: '总理|Prime Minister', hsq: 1200, skin: [0, 1, 4, 4, 1, 0], names: 'th', edu: 'th', imm: 2,
      cities: { 1: ['曼谷|Bangkok'], 2: ['清迈|Chiang Mai', '普吉|Phuket', '芭提雅|Pattaya'], 3: ['孔敬|Khon Kaen', '合艾|Hat Yai', '呵叻|Nakhon Ratchasima', '华欣|Hua Hin'],
        4: ['拜县|Pai', '素可泰|Sukhothai'], 5: ['依善稻田村|a rice village in Isan', '南部橡胶园|a rubber plantation in the south'] } }),
    za: C({ id: 'za', n: '南非|South Africa', flag: '🇿🇦', cur: { sym: 'R', code: 'ZAR', n: '兰特|rand' }, fx: 18.5, pl: .4, wg: .15,
      idx: [[1950, .003], [1970, .008], [1980, .02], [1990, .07], [2000, .18], [2010, .45], [2020, .75], [2024, 1]], g: .05,
      life: 64, tax: .22, itax: .2, retire: 60, gay: 2006, gamble: true, consc: null, mon: false, dem: true, lang: 'en',
      top: '总统|President', hsq: 700, skin: [1, 1, 1, 2, 3, 6], names: 'za', edu: 'za', imm: 2,
      cities: { 1: ['约翰内斯堡|Johannesburg', '开普敦|Cape Town'], 2: ['德班|Durban', '比勒陀利亚|Pretoria'], 3: ['伊丽莎白港|Gqeberha', '布隆方丹|Bloemfontein', '东伦敦|East London'],
        4: ['斯泰伦博斯|Stellenbosch', '奈斯纳|Knysna'], 5: ['东开普村落|a village in the Eastern Cape', '卡鲁农场|a Karoo farm'] } })
  };
  G.CLIST = ['cn', 'us', 'jp', 'kr', 'gb', 'fr', 'de', 'ru', 'in', 'br', 'au', 'ca', 'sg', 'it', 'es', 'mx', 'th', 'za'];
  G.LANGS = { zh: '中文|Chinese', en: '英语|English', ja: '日语|Japanese', ko: '韩语|Korean', fr: '法语|French', de: '德语|German', ru: '俄语|Russian', hi: '印地语|Hindi', pt: '葡萄牙语|Portuguese', es: '西班牙语|Spanish', it: '意大利语|Italian', th: '泰语|Thai' };
  G.tierName = function (cid, t) { return (cid === 'cn' ? G.TIERS_CN : G.TIERS)[t]; };
  G.canGayMarry = function (cid, y) { var c = G.C[cid]; return !!c.gay && y >= c.gay; };
  /* house price per sqm in local currency */
  G.sqm = function (cid, y, tier) {
    var c = G.C[cid]; var hp = (G.S && G.S.world && G.S.world.hpi && G.S.world.hpi[cid]) || 1;
    return c.hsq * c.fx * G.eraIdx(cid, y) * G.HOUSE_TIER[tier || 3] * hp;
  };
})();
