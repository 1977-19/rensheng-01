/* Jobs, laid out like a real job board: every field in one place, requirements shown as cards,
   and employers in three tiers — the better your university, the better the company that will take you. */
(function () {
  'use strict';
  var CR = G.career;
  G.JOBCAT = [
    ['svc', '🛎️ 服务业|🛎️ Service'], ['blue', '🔧 技术工人|🔧 Skilled Trades'], ['biz', '💼 商业金融|💼 Business & Finance'], ['tech', '💻 科技互联网|💻 Tech'],
    ['med', '🩺 医疗|🩺 Healthcare'], ['edu', '📚 教育|📚 Education'], ['law', '⚖️ 法律|⚖️ Law'], ['gov', '🏛️ 公共部门|🏛️ Public Sector'], ['art', '🎨 艺术设计|🎨 Arts & Design'], ['self', '🧭 自由职业|🧭 Freelance']
  ];
  G.CO_TIER = [
    { n: '小公司|Small Firm', mult: 1, ch: .1 },
    { n: '知名企业|Well-known Company', mult: 1.3, ch: -.06, uni: 3 },
    { n: '顶级名企|Top-tier Employer', mult: 1.75, ch: -.2, uni: 4, smarts: 65 }
  ];
  var CO = {
    svc: [['街角餐馆|Corner Diner', '城市快递|City Express'], ['悦来连锁|Yuelai Chain', '速达物流|Swift Logistics'], ['五星酒店集团|Five-Star Hotel Group', '寰宇航空|Global Air']],
    blue: [['小作坊|Local Workshop', '社区工程队|Community Builders'], ['长城制造|Great Wall Manufacturing', '远航汽车|Voyager Motors'], ['巨擘重工|Titan Heavy Industries', '天际电子|Skyline Electronics']],
    biz: [['小贸易公司|Small Trading Co.', '本地会计所|Local Accounting Office'], ['东方证券|Eastern Securities', '恒信咨询|Hengxin Consulting'], ['巅峰投行|Summit Investment Bank', '寰宇资本|Global Peak Capital']],
    tech: [['初创工作室|Startup Studio', '外包公司|Outsourcing Shop'], ['星河软件|Galaxy Software', '云帆科技|Cloudsail Tech'], ['极光科技|Aurora Tech', '深思AI|DeepThought AI']],
    med: [['社区诊所|Community Clinic', '县医院|County Hospital'], ['市第一医院|City General Hospital', '仁心医疗|Renxin Medical'], ['国家医学中心|National Medical Center', '顶级教学医院|Top Teaching Hospital']],
    edu: [['培训班|Cram School', '乡镇中学|Town Secondary School'], ['市重点中学|City Top School', '大型培训机构|Big Tutoring Chain'], ['国际学校|International School', '名牌大学|Elite University']],
    law: [['街道律所|Neighborhood Law Office', '法律援助中心|Legal Aid Center'], ['金诚律所|Jincheng Law Firm', '正义律所|Justice Partners'], ['红圈所|Magic Circle Firm', '国际律师事务所|International Law Firm']],
    gov: [['街道办|District Office', '乡镇政府|Township Government'], ['市政府|City Government', '省直机关|Provincial Agency'], ['中央部委|Central Ministry', '国家机关|National Agency']],
    art: [['小设计工作室|Small Design Studio', '婚庆公司|Wedding Studio'], ['广告公司|Ad Agency', '游戏公司|Game Studio'], ['国际设计所|International Design House', '顶级4A公司|Top-tier Agency']],
    self: [['自己干|Your Own Gig', '自己干|Your Own Gig'], ['平台签约|Platform Contract', '平台签约|Platform Contract'], ['头部机构签约|Top Agency Contract', '头部机构签约|Top Agency Contract']]
  };
  G.coName = function (cat, t) { var L = (CO[cat] || CO.biz)[t] || CO.biz[t]; return G.pick(L); };
  CR.qualifyAt = function (j, t) {
    var q = CR.qualify(j), T = G.CO_TIER[t], p = G.S.p, e = p.edu, miss = q.miss.slice(), ch = q.ch + T.ch;
    if (T.uni && !j.pt) { var ut = e.deg >= 4 ? (e.tier || 2) : 1; if (ut < T.uni) { miss.push(G.L('要求{n}星以上大学|Needs a {n}★+ university', { n: T.uni })); ch -= .25 + (T.uni - ut) * .12; } else ch += (ut - T.uni) * .06; }
    if (T.smarts && p.st.smarts < T.smarts) { miss.push(G.L('智力不足{v}|Smarts below {v}', { v: T.smarts })); ch -= .15; }
    if (p.flags.excon) ch *= .6;
    return { ok: !miss.length, miss: miss, ch: G.clamp(ch, .02, .95) };
  };
  CR.hireAt = function (j, t) {
    CR.hire(j);
    var p = G.S.p; if (!p.job) return;
    var T = G.CO_TIER[t]; p.job.sal = Math.round(p.job.sal * T.mult); p.job.co = { n: G.coName(j.cat, t), t: t };
    G.log('你加入了{c}。|You joined {c}.', { c: p.job.co.n });
  };
  // requirement cards for showbiz and sport
  G.FAME_REQ = { talent: { looks: 60, eq: 50 }, audition: { looks: 65 }, casting: { looks: 72, health: 55 }, esports: { smarts: 55, health: 50 }, sports: { health: 72 }, write: { smarts: 60 }, exhibit: { smarts: 45 }, stream: { looks: 45, eq: 45 } };
  G.ACT_CATS.forEach(function (c) {
    if (c.id !== 'hustle') return;
    c.items.forEach(function (a) {
      var rq = G.FAME_REQ[a.id]; if (!rq) return; a.req = rq;
      var l = a.lock;
      a.lock = function () {
        var m = l && l.apply(this, arguments); if (m) return m;
        var p = G.S.p; for (var k in rq) if (p.st[k] < rq[k]) return G.L('{s}要达到{v}才有机会（现在{c}）。|You need {s} of {v} for a shot (you have {c}).', { s: G.STATS[k].n, v: rq[k], c: Math.round(p.st[k]) });
        return null;
      };
    });
  });
})();
