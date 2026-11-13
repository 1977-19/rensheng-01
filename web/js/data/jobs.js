/* Jobs, careers, rank ladders. Pay in USD-2024 baseline per year (converted by G.$w) */
(function () {
  'use strict';
  function R(s) { return s.split(','); }
  // deg: min degree level (see G.DEG). maj: qualifying majors. req: min stats. y0: earliest year available.
  G.JOBS = [
    // ---------- part-time (students / teens) ----------
    { id: 'pt_fast', pt: 1, n: '快餐店兼职|Fast Food Crew', r: R('快餐店兼职|Fast Food Crew'), pay: [9000], age: 15, deg: 0, st: 1 },
    { id: 'pt_shop', pt: 1, n: '便利店兼职|Convenience Store Clerk', r: R('便利店店员|Store Clerk'), pay: [8500], age: 15, deg: 0, st: 1 },
    { id: 'pt_flyer', pt: 1, n: '发传单|Flyer Distributor', r: R('传单派发员|Flyer Distributor'), pay: [4000], age: 13, deg: 0, st: 1 },
    { id: 'pt_coffee', pt: 1, n: '咖啡店兼职|Part-time Barista', r: R('咖啡师|Barista'), pay: [10000], age: 16, deg: 0, st: 1, y0: 1980 },
    { id: 'pt_tutor', pt: 1, n: '家教|Private Tutor', r: R('家教|Tutor'), pay: [14000], age: 17, deg: 3, req: { smarts: 60 }, st: 1 },
    { id: 'pt_model', pt: 1, n: '平面模特|Part-time Model', r: R('平面模特|Print Model'), pay: [18000], age: 16, deg: 0, req: { looks: 75 }, st: 1 },
    { id: 'pt_deliver', pt: 1, n: '兼职外卖|Part-time Delivery', r: R('外卖员|Delivery Rider'), pay: [12000], age: 18, deg: 0, st: 2, y0: 2014 },
    // ---------- entry level ----------
    { id: 'waiter', n: '服务员|Waiter', r: R('服务员|Waiter,领班|Head Waiter,餐厅经理|Restaurant Manager'), pay: [26000, 34000, 52000], deg: 0, st: 2, cat: 'svc' },
    { id: 'courier', n: '快递员|Courier', r: R('快递员|Courier,站点组长|Team Lead,站点经理|Station Manager'), pay: [32000, 40000, 50000], deg: 0, st: 3, cat: 'svc' },
    { id: 'rider', n: '外卖骑手|Delivery Rider', r: R('外卖骑手|Delivery Rider,金牌骑手|Gold Rider,配送站长|Hub Manager'), pay: [34000, 42000, 52000], deg: 0, st: 4, cat: 'svc', y0: 2014 },
    { id: 'factory', n: '工厂工人|Factory Worker', r: R('普工|Line Worker,技术工|Skilled Worker,车间主任|Workshop Supervisor,厂长|Plant Manager'), pay: [30000, 40000, 56000, 95000], deg: 0, st: 3, cat: 'blue' },
    { id: 'guard', n: '保安|Security Guard', r: R('保安|Security Guard,保安队长|Security Captain,安保主管|Security Manager'), pay: [27000, 34000, 48000], deg: 0, st: 1, cat: 'svc' },
    { id: 'cleaner', n: '保洁员|Cleaner', r: R('保洁员|Cleaner,保洁主管|Cleaning Supervisor'), pay: [23000, 30000], deg: 0, st: 2, cat: 'svc' },
    { id: 'cashier', n: '超市店员|Retail Clerk', r: R('收银员|Cashier,店长|Store Manager,区域经理|Area Manager'), pay: [26000, 46000, 78000], deg: 0, st: 2, cat: 'svc' },
    { id: 'driver', n: '司机|Driver', r: R('司机|Driver,车队长|Fleet Lead,运输公司经理|Transport Manager'), pay: [38000, 52000, 75000], deg: 0, st: 2, cat: 'blue', req: { health: 40 } },
    { id: 'chef', n: '厨师|Chef', r: R('学徒|Kitchen Apprentice,厨师|Cook,主厨|Head Chef,行政总厨|Executive Chef'), pay: [24000, 38000, 62000, 98000], deg: 0, st: 3, cat: 'svc' },
    { id: 'builder', n: '建筑工人|Construction Worker', r: R('小工|Laborer,技工|Tradesman,包工头|Foreman,建筑承包商|Contractor'), pay: [33000, 50000, 85000, 150000], deg: 0, st: 4, cat: 'blue', req: { health: 50 } },
    { id: 'farmer', n: '农民|Farmer', r: R('农民|Farmer,种植大户|Large-scale Grower,农场主|Farm Owner'), pay: [14000, 40000, 95000], deg: 0, st: 2, cat: 'blue' },
    { id: 'hair', n: '理发师|Hairdresser', r: R('洗头小工|Shampoo Assistant,发型师|Stylist,造型总监|Creative Director'), pay: [22000, 42000, 75000], deg: 0, st: 2, cat: 'svc' },
    { id: 'mechanic', n: '汽修工|Mechanic', r: R('学徒|Apprentice,修理工|Mechanic,技术主管|Master Mechanic'), pay: [28000, 48000, 72000], deg: 2, st: 2, cat: 'blue' },
    { id: 'vendor', n: '摆摊小贩|Street Vendor', r: R('摆摊小贩|Street Vendor,夜市摊王|Night Market King'), pay: [18000, 45000], deg: 0, st: 2, cat: 'self' },
    { id: 'sales', n: '销售|Salesperson', r: R('销售专员|Sales Rep,销售主管|Sales Supervisor,销售经理|Sales Manager,销售总监|Sales Director,销售副总裁|VP of Sales'), pay: [36000, 56000, 88000, 145000, 260000], deg: 3, st: 4, cat: 'biz', req: { eq: 40 } },
    { id: 'agent', n: '房产中介|Real Estate Agent', r: R('置业顾问|Agent,金牌经纪人|Top Agent,门店经理|Branch Manager'), pay: [32000, 75000, 120000], deg: 3, st: 4, cat: 'biz', req: { eq: 45 } },
    { id: 'trainer', n: '健身教练|Personal Trainer', r: R('健身教练|Trainer,高级教练|Senior Trainer,健身房店长|Gym Manager'), pay: [34000, 56000, 85000], deg: 3, st: 2, cat: 'svc', req: { health: 65 } },
    { id: 'attendant', n: '空乘|Flight Attendant', r: R('乘务员|Flight Attendant,乘务长|Purser,客舱经理|Cabin Manager'), pay: [40000, 58000, 75000], deg: 3, st: 3, cat: 'svc', req: { looks: 60, health: 55 } },
    { id: 'fire', n: '消防员|Firefighter', r: R('消防员|Firefighter,班长|Squad Leader,中队长|Captain,支队长|Battalion Chief'), pay: [46000, 60000, 76000, 96000], deg: 3, st: 4, cat: 'gov', req: { health: 65 } },
    // ---------- professional ----------
    { id: 'coder', n: '程序员|Software Engineer', r: R('初级工程师|Junior Engineer,工程师|Engineer,高级工程师|Senior Engineer,技术专家|Staff Engineer,技术总监|Director of Engineering,首席技术官|CTO'), pay: [72000, 100000, 140000, 190000, 260000, 420000], deg: 4, maj: ['cs', 'eng'], st: 4, cat: 'tech', y0: 1975, req: { smarts: 55 } },
    { id: 'ai', n: 'AI工程师|AI Engineer', r: R('算法工程师|ML Engineer,高级算法工程师|Senior ML Engineer,AI科学家|AI Scientist,首席AI科学家|Chief AI Scientist'), pay: [140000, 210000, 330000, 600000], deg: 5, maj: ['cs'], st: 4, cat: 'tech', y0: 2014, req: { smarts: 75 } },
    { id: 'game', n: '游戏策划|Game Designer', r: R('游戏策划|Game Designer,主策划|Lead Designer,制作人|Producer,工作室负责人|Studio Head'), pay: [56000, 88000, 135000, 220000], deg: 4, maj: ['cs', 'art'], st: 3, cat: 'tech', y0: 1985 },
    { id: 'pm', n: '产品经理|Product Manager', r: R('产品助理|Associate PM,产品经理|Product Manager,高级产品经理|Senior PM,产品总监|Director of Product,产品副总裁|VP of Product'), pay: [66000, 100000, 150000, 210000, 320000], deg: 4, st: 4, cat: 'tech', y0: 1990, req: { eq: 50, smarts: 55 } },
    { id: 'acct', n: '会计|Accountant', r: R('助理会计|Junior Accountant,会计|Accountant,高级会计|Senior Accountant,财务经理|Finance Manager,财务总监|CFO'), pay: [45000, 60000, 80000, 120000, 230000], deg: 4, maj: ['fin', 'econ', 'biz'], st: 3, cat: 'biz' },
    { id: 'banker', n: '投行|Investment Banker', r: R('分析师|Analyst,经理|Associate,副总裁|Vice President,董事|Director,董事总经理|Managing Director,合伙人|Partner'), pay: [115000, 175000, 260000, 390000, 650000, 1300000], deg: 4, maj: ['fin', 'econ', 'biz'], st: 5, cat: 'biz', req: { smarts: 70 } },
    { id: 'quant', n: '量化研究员|Quant Researcher', r: R('量化研究员|Quant Researcher,资深研究员|Senior Quant,投资组合经理|Portfolio Manager,基金合伙人|Fund Partner'), pay: [190000, 320000, 550000, 1500000], deg: 5, maj: ['cs', 'fin', 'econ'], st: 5, cat: 'biz', y0: 1990, req: { smarts: 85 } },
    { id: 'consult', n: '管理咨询|Management Consultant', r: R('分析师|Business Analyst,咨询顾问|Consultant,项目经理|Engagement Manager,合伙人|Partner'), pay: [95000, 145000, 225000, 480000], deg: 4, st: 5, cat: 'biz', req: { smarts: 70, eq: 55 } },
    { id: 'mkt', n: '市场营销|Marketing', r: R('市场专员|Marketing Specialist,市场经理|Marketing Manager,市场总监|Marketing Director,首席营销官|CMO'), pay: [50000, 85000, 140000, 260000], deg: 4, maj: ['biz', 'media', 'art', 'econ'], st: 3, cat: 'biz' },
    { id: 'hr', n: '人力资源|Human Resources', r: R('HR专员|HR Specialist,HR经理|HR Manager,HR总监|HR Director,首席人力官|CHRO'), pay: [45000, 75000, 130000, 210000], deg: 4, st: 2, cat: 'biz', req: { eq: 50 } },
    { id: 'pr', n: '公关|PR Specialist', r: R('公关专员|PR Specialist,公关经理|PR Manager,公关总监|PR Director'), pay: [50000, 80000, 140000], deg: 4, maj: ['media', 'biz', 'lang'], st: 4, cat: 'biz', req: { eq: 55 } },
    { id: 'doctor', n: '医生|Doctor', r: R('住院医师|Resident,主治医师|Attending Physician,副主任医师|Associate Chief Physician,主任医师|Chief Physician,院长|Hospital Director'), pay: [62000, 160000, 230000, 320000, 420000], deg: 4, maj: ['med'], st: 5, cat: 'med', req: { smarts: 65 } },
    { id: 'nurse', n: '护士|Nurse', r: R('护士|Nurse,护师|Senior Nurse,主管护师|Charge Nurse,护士长|Head Nurse'), pay: [52000, 66000, 82000, 100000], deg: 4, maj: ['nurse', 'med'], st: 4, cat: 'med' },
    { id: 'pharm', n: '药剂师|Pharmacist', r: R('药剂师|Pharmacist,主任药师|Chief Pharmacist'), pay: [85000, 125000], deg: 4, maj: ['bio', 'med'], st: 2, cat: 'med' },
    { id: 'vet', n: '兽医|Veterinarian', r: R('兽医助理|Vet Assistant,兽医|Veterinarian,宠物医院院长|Clinic Owner'), pay: [40000, 90000, 150000], deg: 4, maj: ['bio', 'agri', 'med'], st: 3, cat: 'med' },
    { id: 'psych', n: '心理咨询师|Psychologist', r: R('心理咨询师|Counselor,心理治疗师|Therapist,知名心理专家|Renowned Psychologist'), pay: [50000, 78000, 130000], deg: 4, maj: ['psy', 'med'], st: 3, cat: 'med' },
    { id: 'lawyer', n: '律师|Lawyer', r: R('律师助理|Paralegal,律师|Associate,资深律师|Senior Associate,合伙人|Partner,律所主任|Managing Partner'), pay: [55000, 110000, 175000, 320000, 650000], deg: 4, maj: ['law'], st: 5, cat: 'law', req: { smarts: 60 } },
    { id: 'judge', n: '法官|Judge', r: R('法官助理|Judicial Assistant,法官|Judge,审判长|Presiding Judge,法院院长|Court President,最高法院大法官|Supreme Court Justice'), pay: [62000, 110000, 150000, 200000, 260000], deg: 4, maj: ['law'], st: 3, cat: 'law', req: { smarts: 70 }, assess: 1 },
    { id: 'teacher', n: '教师|Teacher', r: R('实习教师|Student Teacher,教师|Teacher,骨干教师|Senior Teacher,教导主任|Academic Dean,校长|Principal'), pay: [40000, 55000, 68000, 82000, 105000], deg: 4, st: 3, cat: 'edu' },
    { id: 'prof', n: '大学教授|Professor', r: R('讲师|Lecturer,副教授|Associate Professor,教授|Professor,院长|Dean,院士|Academician'), pay: [68000, 98000, 145000, 195000, 270000], deg: 6, st: 3, cat: 'edu', req: { smarts: 70 }, fame: 1 },
    { id: 'sci', n: '科研人员|Research Scientist', r: R('助理研究员|Research Assistant,研究员|Researcher,高级研究员|Senior Researcher,首席科学家|Chief Scientist'), pay: [62000, 98000, 150000, 260000], deg: 5, maj: ['bio', 'cs', 'eng', 'med', 'agri'], st: 3, cat: 'edu', req: { smarts: 70 } },
    { id: 'engr', n: '工程师|Engineer', r: R('助理工程师|Assistant Engineer,工程师|Engineer,高级工程师|Senior Engineer,总工程师|Chief Engineer'), pay: [60000, 85000, 120000, 185000], deg: 4, maj: ['eng', 'arch', 'cs'], st: 3, cat: 'tech' },
    { id: 'archi', n: '建筑师|Architect', r: R('助理建筑师|Junior Architect,建筑师|Architect,主创建筑师|Lead Architect,首席建筑师|Principal Architect'), pay: [56000, 86000, 135000, 230000], deg: 4, maj: ['arch'], st: 4, cat: 'tech' },
    { id: 'design', n: '设计师|Designer', r: R('初级设计师|Junior Designer,设计师|Designer,资深设计师|Senior Designer,设计总监|Creative Director'), pay: [45000, 65000, 92000, 155000], deg: 4, maj: ['art', 'arch', 'media'], st: 3, cat: 'art' },
    { id: 'journo', n: '记者|Journalist', r: R('实习记者|Intern Reporter,记者|Reporter,资深记者|Senior Correspondent,主编|Editor-in-Chief'), pay: [38000, 55000, 82000, 150000], deg: 4, maj: ['media', 'lang', 'hist', 'pol'], st: 4, cat: 'art', fame: 1 },
    { id: 'photo', n: '摄影师|Photographer', r: R('摄影助理|Photo Assistant,摄影师|Photographer,知名摄影师|Renowned Photographer'), pay: [30000, 58000, 110000], deg: 3, st: 2, cat: 'art', fame: 1 },
    { id: 'transl', n: '翻译|Translator', r: R('翻译|Translator,高级翻译|Senior Translator,同声传译|Simultaneous Interpreter'), pay: [40000, 60000, 110000], deg: 4, maj: ['lang'], st: 3, cat: 'art' },
    { id: 'pilot', n: '飞行员|Airline Pilot', r: R('副驾驶|First Officer,机长|Captain,资深机长|Senior Captain,飞行总监|Chief Pilot'), pay: [95000, 200000, 285000, 340000], deg: 4, st: 4, cat: 'svc', req: { health: 70, smarts: 60 }, y0: 1950 },
    { id: 'diplomat', n: '外交官|Diplomat', r: R('随员|Attaché,三等秘书|Third Secretary,一等秘书|First Secretary,参赞|Counselor,大使|Ambassador'), pay: [60000, 75000, 100000, 140000, 220000], deg: 4, maj: ['lang', 'pol', 'law', 'econ'], st: 3, cat: 'gov', req: { eq: 60, smarts: 60 }, assess: 1 }
  ];
  G.JOB = {}; G.JOBS.forEach(function (j) { G.JOB[j.id] = j; });
  // earliest years: global (y0) and in China (cn0 — private-sector jobs only appear after reform and opening)
  var Y0 = { pt_fast: 1955, pt_shop: 1960, courier: 1975, agent: 1950, trainer: 1965, psych: 1950, consult: 1955, pm: 1990 };
  var CN0 = { pt_fast: 1987, pt_shop: 1993, pt_flyer: 1985, pt_coffee: 1998, pt_tutor: 1985, pt_model: 1990, courier: 1995, guard: 1985, cashier: 1990,
    vendor: 1979, sales: 1985, agent: 1995, trainer: 1995, coder: 1985, game: 1995, pm: 1998, banker: 1995, quant: 2005, consult: 1995, mkt: 1985,
    hr: 1992, pr: 1992, psych: 2000, lawyer: 1980, design: 1985, photo: 1980, transl: 1978, mechanic: 1980, attendant: 1980 };
  Object.keys(Y0).forEach(function (k) { if (G.JOB[k] && !G.JOB[k].y0) G.JOB[k].y0 = Y0[k]; });
  Object.keys(CN0).forEach(function (k) { if (G.JOB[k]) G.JOB[k].cn0 = CN0[k]; });

  /* Fame careers: progress driven by fame + performance (mini-games) */
  G.FAME = {
    actor: { n: '演员|Actor', r: R('群众演员|Extra,龙套演员|Bit Player,配角|Supporting Actor,主演|Lead Actor,一线明星|A-list Star,影帝影后|Award-winning Star'), pay: [12000, 35000, 110000, 450000, 2800000, 9000000], game: 'quiz', st: 'looks' },
    singer: { n: '歌手|Singer', r: R('驻唱歌手|Bar Singer,签约歌手|Signed Artist,新人歌手|Rising Star,当红歌手|Hit Singer,天王天后|Superstar'), pay: [18000, 45000, 140000, 800000, 6000000], game: 'rhythm', st: 'eq' },
    idol: { n: '偶像|Idol', r: R('练习生|Trainee,出道偶像|Debuted Idol,人气偶像|Popular Idol,顶流偶像|Top Idol'), pay: [3000, 60000, 400000, 3000000], game: 'rhythm', st: 'looks' },
    streamer: { n: '网红主播|Streamer', r: R('小主播|Small Streamer,腰部主播|Mid-tier Streamer,头部主播|Top Streamer,顶流网红|Mega Influencer'), pay: [5000, 60000, 500000, 4000000], game: 'quiz', st: 'eq', y0: 2008 },
    esports: { n: '电竞选手|Esports Player', r: R('青训生|Academy Player,替补|Substitute,首发选手|Starter,明星选手|Star Player,世界冠军|World Champion'), pay: [9000, 35000, 120000, 450000, 1500000], game: 'rhythm', st: 'smarts', y0: 2000 },
    athlete: { n: '运动员|Athlete', r: R('业余选手|Amateur,职业运动员|Professional,国家队队员|National Team,明星运动员|Star Athlete,世界冠军|World Champion'), pay: [12000, 60000, 200000, 1200000, 5000000], game: 'sport', st: 'health' },
    writer: { n: '作家|Writer', r: R('写手|Aspiring Writer,签约作家|Published Author,畅销书作家|Bestselling Author,文学巨匠|Literary Giant'), pay: [6000, 38000, 320000, 1500000], game: 'quiz', st: 'smarts' },
    painter: { n: '画家|Artist', r: R('街头画家|Street Artist,签约画家|Gallery Artist,知名画家|Renowned Artist,艺术大师|Master Artist'), pay: [8000, 40000, 220000, 1200000], game: 'memory', st: 'looks' },
    model: { n: '模特|Model', r: R('平面模特|Print Model,签约模特|Signed Model,名模|Top Model,超模|Supermodel'), pay: [22000, 75000, 350000, 1800000], game: 'rhythm', st: 'looks' }
  };
  G.SPORTS = ['足球|Football', '篮球|Basketball', '田径|Track & Field', '游泳|Swimming', '乒乓球|Table Tennis', '网球|Tennis', '羽毛球|Badminton', '拳击|Boxing'];

  /* ---------- rank ladders ---------- */
  G.MIL = {
    enl: R('列兵|Private,上等兵|Private First Class,下士|Corporal,中士|Sergeant,上士|Staff Sergeant,军士长|Sergeant Major'),
    enlPay: [24000, 29000, 35000, 43000, 52000, 62000],
    off: R('少尉|Second Lieutenant,中尉|First Lieutenant,上尉|Captain,少校|Major,中校|Lieutenant Colonel,上校|Colonel,少将|Major General,中将|Lieutenant General,上将|General,一级上将|Senior General,五星上将|Five-Star General,三军总司令|Commander-in-Chief'),
    offPay: [46000, 54000, 66000, 80000, 96000, 115000, 150000, 190000, 240000, 300000, 380000, 480000],
    br: { army: '陆军|Army', navy: '海军|Navy', air: '空军|Air Force', sf: '特种部队|Special Forces' }
  };
  G.POLICE = { r: R('警员|Police Officer,警长|Senior Officer,警司|Sergeant,督察|Inspector,高级督察|Chief Inspector,警司长|Superintendent,总警司|Chief Superintendent,副局长|Deputy Commissioner,警察局长|Police Commissioner'),
    pay: [46000, 54000, 64000, 78000, 94000, 115000, 140000, 175000, 225000] };
  G.CIVIL = {
    cn: R('科员|Clerk,副科长|Deputy Section Chief,科长|Section Chief,副处长|Deputy Division Director,处长|Division Director,副局长|Deputy Bureau Director,局长|Bureau Director'),
    gen: R('办事员|Clerk,专员|Officer,高级专员|Senior Officer,科长|Section Manager,处长|Director,司长|Director-General,常务次长|Permanent Secretary'),
    pay: [48000, 56000, 66000, 80000, 96000, 118000, 140000, 170000, 200000]
  };
  G.POLI = {
    cn: { r: R('乡镇长|Township Head,县长|County Magistrate,县委书记|County Party Secretary,市长|Mayor,市委书记|City Party Secretary,省长|Provincial Governor,省委书记|Provincial Party Secretary,副总理|Vice Premier,总理|Premier,国家最高领导人|Paramount Leader'), elect: false },
    us: { r: R('市议员|City Council Member,市长|Mayor,州长|Governor,联邦参议员|U.S. Senator,国务卿|Secretary of State,总统|President'), elect: [1, 1, 1, 1, 0, 1] },
    gen: { r: R('市议员|City Councillor,市长|Mayor,国会议员|Member of Parliament,部长|Cabinet Minister'), elect: [1, 1, 1, 0, 1] },
    pay: [50000, 80000, 120000, 160000, 200000, 240000, 280000, 320000, 360000, 400000]
  };
  G.poliLadder = function (cid) {
    if (cid === 'cn') return G.POLI.cn;
    if (cid === 'us') return G.POLI.us;
    var g = G.POLI.gen; return { r: g.r.concat([G.C[cid].top]), elect: g.elect };
  };
  G.GANG = { r: R('马仔|Runner,打手|Enforcer,小头目|Crew Leader,堂主|Lieutenant,副帮主|Underboss,老大|Boss'),
    pay: [9000, 26000, 65000, 210000, 650000, 2200000],
    names: R('青龙会|Azure Dragon Society,黑虎帮|Black Tiger Gang,赤蝎堂|Red Scorpion Hall,铁狼帮|Iron Wolf Gang,金蛇会|Golden Serpent Society,夜鸦帮|Night Raven Crew,血莲社|Blood Lotus Syndicate,北街兄弟会|North Street Brotherhood,东港帮|East Harbor Gang,银狐堂|Silver Fox Hall') };
  G.PRISON_R = R('囚犯|Inmate');

  /* companies */
  G.INDUSTRY = {
    food: { n: '餐饮|Restaurants', m: .08, v: .25, y0: 1950 },
    retail: { n: '零售|Retail', m: .06, v: .2, y0: 1950 },
    ecom: { n: '电商|E-commerce', m: .1, v: .45, y0: 1998 },
    tech: { n: '互联网科技|Internet Tech', m: .12, v: .6, y0: 1995 },
    game: { n: '游戏|Video Games', m: .15, v: .6, y0: 1985 },
    mfg: { n: '制造业|Manufacturing', m: .07, v: .2, y0: 1950 },
    re: { n: '房地产|Real Estate', m: .14, v: .4, y0: 1980 },
    edu: { n: '教育培训|Education', m: .12, v: .35, y0: 1980 },
    media: { n: '娱乐传媒|Entertainment', m: .1, v: .5, y0: 1960 },
    ev: { n: '新能源汽车|Electric Vehicles', m: .05, v: .7, y0: 2008 },
    ai: { n: '人工智能|Artificial Intelligence', m: .04, v: .9, y0: 2015 },
    bio: { n: '生物医药|Biotech', m: .06, v: .8, y0: 1985 },
    trade: { n: '外贸|Import/Export', m: .07, v: .3, y0: 1950 },
    logi: { n: '物流|Logistics', m: .06, v: .25, y0: 1970 }
  };
})();
