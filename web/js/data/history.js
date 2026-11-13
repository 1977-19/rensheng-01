/* Real historical events by year/country + procedural future world events.
   mk: stock market shock, hp: housing shock, job: chance to lose job, h: health, hap: happiness */
(function () {
  'use strict';
  function H(y, c, t, o) { o = o || {}; o.y = y; o.c = c; o.t = t; return o; }
  G.HISTORY = [
    // ---------- world ----------
    H(1957, 'all', '苏联发射了人类第一颗人造卫星，太空时代开启。|The USSR launches the first artificial satellite. The Space Age begins.'),
    H(1962, 'all', '古巴导弹危机爆发，全世界都在担心核战争。|The Cuban Missile Crisis — the whole world fears nuclear war.', { hap: -3 }),
    H(1969, 'all', '人类首次登上月球，全世界都在电视前欢呼。|Humans walk on the Moon. The whole world cheers in front of the TV.', { hap: 4 }),
    H(1973, 'all', '第一次石油危机爆发，油价暴涨，经济萧条。|The first oil crisis: oil prices soar and economies slump.', { mk: -.22, job: .03 }),
    H(1979, 'all', '第二次石油危机，物价飞涨。|The second oil crisis sends prices soaring.', { mk: -.1 }),
    H(1987, 'all', '“黑色星期一”，全球股市单日暴跌。|"Black Monday": stock markets crash worldwide in a single day.', { mk: -.25 }),
    H(1991, 'all', '万维网诞生，互联网时代来临。|The World Wide Web is born. The internet age arrives.'),
    H(1997, 'all', '亚洲金融危机爆发，多国货币暴跌。|The Asian Financial Crisis hits; currencies collapse.', { mk: -.12 }),
    H(2000, 'all', '互联网泡沫破裂，科技股暴跌。|The dot-com bubble bursts. Tech stocks crash.', { mk: -.2, tech: -.5 }),
    H(2007, 'all', '智能手机问世，人们的生活从此改变。|The smartphone arrives and changes everyday life.'),
    H(2008, 'all', '全球金融危机爆发，股市崩盘，大量公司裁员。|The Global Financial Crisis: markets crash and layoffs sweep the world.', { mk: -.38, hp: -.12, job: .06, hap: -3 }),
    H(2009, 'all', '一种叫“比特币”的东西诞生了，几乎没人在意。|Something called "Bitcoin" is created. Almost nobody notices.'),
    H(2020, 'all', '新冠疫情全球大流行，各地封城，经济停摆。|The COVID-19 pandemic sweeps the globe. Lockdowns halt the economy.', { mk: -.08, job: .05, h: -4, hap: -6, pandemic: 1 }),
    H(2021, 'all', '疫苗普及，世界慢慢恢复正常。|Vaccines roll out; the world slowly returns to normal.', { mk: .2 }),
    H(2022, 'all', '全球通胀飙升，物价让人头疼。|Global inflation surges. Prices are a headache.', { mk: -.18, tech: -.3 }),
    H(2023, 'all', '生成式人工智能爆发，聊天机器人火遍全球。|Generative AI explodes; chatbots go viral worldwide.', { tech: .4 }),
    // ---------- China ----------
    H(1976, 'cn', '唐山发生大地震，举国悲痛。|A massive earthquake strikes Tangshan. The nation mourns.', { hap: -4 }),
    H(1977, 'cn', '高考恢复了！无数人重新拿起课本。|The Gaokao is restored! Countless people pick up their textbooks again.', { hap: 5 }),
    H(1978, 'cn', '改革开放开始，国家迎来巨大变化。|Reform and Opening Up begins. The country starts to transform.', { hap: 4 }),
    H(1980, 'cn', '独生子女政策全面推行。|The one-child policy is fully implemented.'),
    H(1992, 'cn', '南方谈话之后，“下海”经商成为潮流。|After the Southern Tour, "jumping into the sea" of business becomes the trend.', { biz: 1 }),
    H(1997, 'cn', '香港回归。|Hong Kong returns to China.', { hap: 3 }),
    H(1998, 'cn', '国企改革，大批工人下岗；长江发生特大洪水。|State-enterprise reform brings mass layoffs; the Yangtze floods.', { job: .12, hap: -3 }),
    H(2001, 'cn', '中国加入世界贸易组织，经济腾飞。|China joins the WTO; the economy takes off.', { mk: .15 }),
    H(2003, 'cn', '“非典”疫情暴发，人人戴上口罩。|SARS breaks out; everyone wears masks.', { h: -2, hap: -3 }),
    H(2008, 'cn', '汶川大地震令人心碎；北京奥运会盛大开幕。|The Wenchuan earthquake breaks hearts; the Beijing Olympics open in splendor.', { hap: 2 }),
    H(2009, 'cn', '“四万亿”刺激计划推出，房价开始飞涨。|A massive stimulus package launches; home prices begin to soar.', { hp: .25 }),
    H(2015, 'cn', 'A股剧烈震荡，“股灾”让很多人血本无归。|A-shares swing violently; the crash wipes out many investors.', { mk: -.3 }),
    H(2016, 'cn', '全面二孩政策实施；一线城市房价暴涨。|The two-child policy takes effect; big-city home prices explode.', { hp: .3 }),
    H(2021, 'cn', '“双减”政策出台，教培行业一夜变天。|The "Double Reduction" policy reshapes the tutoring industry overnight.', { job: .02 }),
    H(2022, 'cn', '房地产市场进入下行周期。|The property market enters a downturn.', { hp: -.12 }),
    // ---------- USA ----------
    H(1955, 'us', '民权运动风起云涌。|The Civil Rights Movement gathers momentum.'),
    H(1963, 'us', '肯尼迪总统遇刺，全国震惊。|President Kennedy is assassinated; the nation is in shock.', { hap: -4 }),
    H(1965, 'us', '越南战争升级，政府开始大规模征兵。|The Vietnam War escalates; the draft expands.'),
    H(1981, 'us', '个人电脑开始进入千家万户。|Personal computers start entering homes.'),
    H(2001, 'us', '9·11恐怖袭击震惊世界。|The September 11 attacks shock the world.', { mk: -.12, hap: -6 }),
    H(2005, 'us', '卡特里娜飓风重创新奥尔良。|Hurricane Katrina devastates New Orleans.'),
    // ---------- Japan ----------
    H(1964, 'jp', '东京奥运会开幕，新干线通车。|The Tokyo Olympics open and the Shinkansen begins service.', { hap: 4 }),
    H(1986, 'jp', '泡沫经济开始，地价和股价疯涨。|The bubble economy begins; land and stock prices go wild.', { mk: .3, hp: .35 }),
    H(1991, 'jp', '泡沫经济破裂，“失去的十年”开始。|The bubble bursts. The "Lost Decade" begins.', { mk: -.35, hp: -.3, job: .04 }),
    H(1995, 'jp', '阪神大地震发生。|The Great Hanshin Earthquake strikes.', { hap: -3 }),
    H(2011, 'jp', '东日本大地震和海啸造成巨大灾难。|The Great East Japan Earthquake and tsunami bring disaster.', { mk: -.1, hap: -6 }),
    // ---------- Korea ----------
    H(1950, 'kr', '朝鲜战争爆发，战火蔓延。|The Korean War breaks out.', { h: -8, hap: -12 }),
    H(1953, 'kr', '朝鲜战争停战。|An armistice ends the fighting in Korea.', { hap: 6 }),
    H(1988, 'kr', '汉城奥运会举办，全国沸腾。|Seoul hosts the Olympics; the nation celebrates.', { hap: 4 }),
    H(1997, 'kr', 'IMF危机爆发，大批企业倒闭。|The IMF crisis hits; companies collapse.', { mk: -.3, job: .08 }),
    H(2002, 'kr', '韩日世界杯，韩国队杀入四强！|Korea reaches the World Cup semifinals on home soil!', { hap: 5 }),
    H(2012, 'kr', '韩流席卷全球。|The Korean Wave sweeps the world.'),
    // ---------- UK ----------
    H(1966, 'gb', '英格兰夺得世界杯冠军！|England wins the World Cup!', { hap: 5 }),
    H(1979, 'gb', '新政府上台，开始大规模私有化改革。|A new government launches sweeping privatization.'),
    H(2012, 'gb', '伦敦奥运会精彩举办。|London hosts a spectacular Olympics.', { hap: 3 }),
    H(2016, 'gb', '英国举行脱欧公投，结果震惊世界。|Britain votes in the Brexit referendum, stunning the world.', { mk: -.08 }),
    // ---------- France ----------
    H(1968, 'fr', '“五月风暴”爆发，学生和工人走上街头。|May 1968: students and workers take to the streets.'),
    H(1998, 'fr', '法国夺得世界杯冠军！|France wins the World Cup!', { hap: 5 }),
    H(2002, 'fr', '欧元正式流通。|Euro notes and coins enter circulation.'),
    H(2015, 'fr', '巴黎发生恐怖袭击，举国哀悼。|Terror attacks strike Paris; the nation mourns.', { hap: -5 }),
    H(2018, 'fr', '法国再次夺得世界杯冠军！|France wins the World Cup again!', { hap: 5 }),
    // ---------- Germany ----------
    H(1954, 'de', '“伯尔尼奇迹”，西德夺得世界杯。|The "Miracle of Bern": West Germany wins the World Cup.', { hap: 5 }),
    H(1961, 'de', '柏林墙建起，城市被一分为二。|The Berlin Wall goes up, splitting the city.', { hap: -5 }),
    H(1989, 'de', '柏林墙倒塌，人们拥抱欢呼。|The Berlin Wall falls; people embrace and cheer.', { hap: 8 }),
    H(1990, 'de', '两德统一。|Germany is reunified.', { hap: 5 }),
    H(2014, 'de', '德国夺得世界杯冠军！|Germany wins the World Cup!', { hap: 5 }),
    // ---------- Russia ----------
    H(1961, 'ru', '加加林成为第一个进入太空的人。|Gagarin becomes the first human in space.', { hap: 6 }),
    H(1986, 'ru', '切尔诺贝利核事故发生。|The Chernobyl nuclear disaster occurs.', { h: -3, hap: -4 }),
    H(1991, 'ru', '苏联解体，一切都变了。|The Soviet Union dissolves. Everything changes.', { job: .1, hap: -5 }),
    H(1992, 'ru', '恶性通胀，存款一夜蒸发。|Hyperinflation wipes out savings overnight.', { cash: -.8 }),
    H(1998, 'ru', '卢布危机，银行倒闭。|The ruble crisis: banks collapse.', { mk: -.5, cash: -.3, job: .06 }),
    H(2014, 'ru', '索契冬奥会举办。|Sochi hosts the Winter Olympics.'),
    // ---------- India ----------
    H(1983, 'in', '印度夺得板球世界杯冠军！|India wins the Cricket World Cup!', { hap: 6 }),
    H(1991, 'in', '经济自由化改革启动。|Economic liberalization begins.', { mk: .2 }),
    H(2001, 'in', 'IT外包热潮来临，班加罗尔成为科技之城。|The IT outsourcing boom turns Bengaluru into a tech city.'),
    H(2011, 'in', '印度再次夺得板球世界杯！|India wins the Cricket World Cup again!', { hap: 6 }),
    H(2016, 'in', '“废钞令”出台，大额纸币一夜作废。|Demonetization: large banknotes are voided overnight.', { cash: -.05 }),
    H(2023, 'in', '月船三号成功登陆月球南极。|Chandrayaan-3 lands near the Moon\'s south pole.', { hap: 5 }),
    // ---------- Brazil ----------
    H(1958, 'br', '巴西首次夺得世界杯冠军！|Brazil wins its first World Cup!', { hap: 6 }),
    H(1970, 'br', '巴西第三次夺得世界杯！|Brazil wins its third World Cup!', { hap: 6 }),
    H(1985, 'br', '军政府结束，民主回归。|Military rule ends; democracy returns.', { hap: 4 }),
    H(1994, 'br', '“雷亚尔计划”终结恶性通胀；巴西夺得世界杯！|The Real Plan ends hyperinflation, and Brazil wins the World Cup!', { hap: 6 }),
    H(2002, 'br', '巴西第五次夺得世界杯！|Brazil wins its fifth World Cup!', { hap: 6 }),
    H(2016, 'br', '里约奥运会举办。|Rio hosts the Olympics.'),
    // ---------- Australia / Canada ----------
    H(1956, 'au', '墨尔本奥运会举办。|Melbourne hosts the Olympics.'),
    H(2000, 'au', '悉尼奥运会精彩举办。|Sydney hosts a brilliant Olympics.', { hap: 3 }),
    H(2019, 'au', '“黑色夏天”山火肆虐。|The Black Summer bushfires rage.', { hap: -4 }),
    H(1967, 'ca', '加拿大庆祝建国百年。|Canada celebrates its centennial.', { hap: 3 }),
    H(1976, 'ca', '蒙特利尔奥运会举办。|Montreal hosts the Olympics.'),
    H(2010, 'ca', '温哥华冬奥会举办。|Vancouver hosts the Winter Olympics.', { hap: 3 }),
    // ---------- Singapore ----------
    H(1965, 'sg', '新加坡独立建国。|Singapore becomes an independent nation.', { hap: 4 }),
    H(1987, 'sg', '地铁正式通车。|The MRT subway opens.'),
    H(2010, 'sg', '综合度假村赌场开业。|The integrated-resort casinos open.'),
    // ---------- Italy / Spain ----------
    H(1960, 'it', '罗马奥运会举办。|Rome hosts the Olympics.'),
    H(1982, 'it', '意大利夺得世界杯冠军！|Italy wins the World Cup!', { hap: 5 }),
    H(2006, 'it', '意大利再次夺得世界杯！|Italy wins the World Cup again!', { hap: 5 }),
    H(1975, 'es', '西班牙开始民主转型。|Spain begins its transition to democracy.', { hap: 4 }),
    H(1992, 'es', '巴塞罗那奥运会举办。|Barcelona hosts the Olympics.', { hap: 3 }),
    H(2008, 'es', '房地产泡沫破裂，失业率飙升。|The housing bubble bursts; unemployment skyrockets.', { hp: -.25, job: .08 }),
    H(2010, 'es', '西班牙夺得世界杯冠军！|Spain wins the World Cup!', { hap: 5 }),
    // ---------- Mexico / Thailand / South Africa ----------
    H(1968, 'mx', '墨西哥城奥运会举办。|Mexico City hosts the Olympics.'),
    H(1985, 'mx', '墨西哥城发生大地震。|A massive earthquake strikes Mexico City.', { hap: -5 }),
    H(1994, 'mx', '比索危机爆发。|The peso crisis erupts.', { mk: -.3, cash: -.2 }),
    H(1997, 'th', '泰铢危机引爆亚洲金融风暴。|The baht crisis triggers the Asian Financial Crisis.', { mk: -.4, job: .08 }),
    H(2004, 'th', '印度洋海啸袭击泰国南部海岸。|The Indian Ocean tsunami hits Thailand\'s southern coast.', { hap: -5 }),
    H(2011, 'th', '曼谷发生特大洪水。|Massive floods engulf Bangkok.'),
    H(1990, 'za', '曼德拉获释出狱。|Nelson Mandela walks free.', { hap: 6 }),
    H(1994, 'za', '南非举行首次民主大选，种族隔离制度终结。|South Africa holds its first democratic elections; apartheid ends.', { hap: 8 }),
    H(1995, 'za', '南非夺得橄榄球世界杯！|South Africa wins the Rugby World Cup!', { hap: 5 }),
    H(2010, 'za', '南非世界杯举办，呜呜祖拉响彻全球。|South Africa hosts the World Cup; vuvuzelas echo worldwide.', { hap: 4 })
  ];

  // procedural world events for years without real history (post-2025)
  G.FUTURE = [
    { w: 8, t: '全球经济衰退，股市大跌，失业潮来袭。|A global recession: markets plunge and layoffs spread.', mk: -.3, job: .05, hap: -3 },
    { w: 10, t: '牛市来了，股市一路高歌。|A bull market arrives; stocks rally.', mk: .25 },
    { w: 5, t: '新一轮科技革命爆发，科技股飞涨。|A new tech revolution: tech stocks soar.', tech: .45 },
    { w: 1, once: 1, t: '人工智能取代了大量工作岗位。|AI replaces vast numbers of jobs.', job: .06, tech: .2, y0: 2028 },
    { w: 2, t: '一场新的全球疫情暴发。|A new global pandemic breaks out.', mk: -.15, h: -5, hap: -5, job: .04 },
    { w: 4, t: '能源危机，油价暴涨。|An energy crisis sends oil prices skyrocketing.', mk: -.12 },
    { w: 5, t: '极端气候灾害频发。|Extreme weather disasters strike again and again.', hap: -2 },
    { w: 3, t: '人类在火星建立了第一个基地。|Humanity establishes the first base on Mars.', hap: 4, y0: 2035 },
    { w: 4, t: '房地产泡沫破裂，房价暴跌。|The property bubble bursts; home prices crash.', hp: -.25 },
    { w: 4, t: '房地产市场火热，房价飞涨。|The property market is red-hot; prices soar.', hp: .2 },
    { w: 3, t: '加密货币暴涨，一夜造富无数。|Crypto skyrockets, minting overnight millionaires.', crypto: 2 },
    { w: 3, t: '加密货币崩盘，无数人血本无归。|Crypto crashes; countless fortunes vanish.', crypto: -.75 },
    { w: 3, t: '地区冲突升级，全球局势紧张。|A regional conflict escalates; global tensions rise.', mk: -.1, hap: -2 },
    { w: 2, t: '抗衰老药物问世，人类寿命显著延长。|Anti-aging drugs arrive; human lifespans grow.', life: 1, y0: 2040 },
    { w: 3, t: '世界杯举行，全球球迷狂欢。|The World Cup kicks off; fans worldwide celebrate.', hap: 2 }
  ];
})();
