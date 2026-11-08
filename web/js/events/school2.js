/* School life that depends on which school you're in: top schools and weak schools feel different */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function q() { var e = G.S.p.edu; return e.q || 3; }
  function stage() { return G.S.p.edu.stage; }
  function patch(list, id, fn) { var a = (G[list] || []).filter(function (x) { return x.id === id; })[0]; if (a) a.run = fn(a.run); }

  var STUDY = {
    primary: ['你把乘法口诀背得滚瓜烂熟。|You can recite your times tables in your sleep.', '你得了一朵小红花，贴在了作业本上。|You earned a gold star for your notebook.', '你认真写完了日记作业。|You finished your diary homework neatly.'],
    middle: ['你把错题本整理得整整齐齐。|You organized your mistake notebook perfectly.', '你攻克了一道困扰全班的几何题。|You cracked a geometry problem that stumped the whole class.', '你背完了一整本英语单词书。|You memorized an entire English vocabulary book.'],
    high: ['你刷完了一整套模拟卷。|You finished a full set of mock exams.', '你熬夜复习到凌晨，台灯下全是草稿纸。|You studied till dawn, scratch paper everywhere.', '你在晚自习上做完了三张卷子。|You finished three practice papers in evening study hall.'],
    voc: ['你在实训车间练了一下午手艺。|You practiced your trade all afternoon in the workshop.', '你考下了一个职业资格证。|You earned a professional certificate.']
  };
  var STUDY_TOP = ['重点学校的节奏快得让人喘不过气，但你跟上了。|The top school\'s pace is breathless, but you kept up.', '你在竞赛班里和全市最聪明的人一起刷题。|You drilled problems in the competition class with the city\'s brightest.', '老师讲的是大学的内容，你听得津津有味。|The teacher covered university material, and you loved it.'];
  var STUDY_WEAK = ['教室里一半人在睡觉，你一个人认真听讲。|Half the class was asleep; you alone paid attention.', '老师自己都在看手机，你只能自学。|The teacher was on their phone, so you taught yourself.', '你在吵闹的教室里戴着耳塞做题。|You worked problems with earplugs in a noisy classroom.'];
  patch('ACT_SCHOOL', 'study', function () {
    return function (a) {
      var p = G.S.p, Q = q(); p.edu.study++;
      var pool = (STUDY[stage()] || STUDY.middle).slice();
      if (Q >= 4) pool = pool.concat(STUDY_TOP); else if (Q <= 2) pool = pool.concat(STUDY_WEAK);
      return G.quick(a, G.pick(pool), { smarts: Q >= 4 ? 3 : Q <= 2 ? 1 : 2, happy: -2, stress: Q >= 4 ? 7 : 4 });
    };
  });
  patch('ACT_SCHOOL', 'monitor', function (orig) {
    return function (a) {
      var p = G.S.p;
      if (!p.flags.monitor) return orig(a);
      var r = G.ri(0, 3);
      return G.quick(a, ['你组织全班布置教室，拿了“优秀班集体”。|You organized the class to decorate the room and won "Model Class."', '你记了好朋友的名字，他三天没理你。|You reported your best friend for talking; he didn\'t speak to you for three days.', '你帮老师收作业、管纪律，忙得团团转。|Collecting homework and keeping order kept you running.', '你在班会上发言，大家都在认真听。|You spoke at the class meeting, and everyone listened.'][r],
        [{ eq: 2, happy: 4 }, { eq: 1, happy: -3 }, { eq: 2, stress: 3 }, { eq: 3 }][r]);
    };
  });
  var USTUDY = {
    cs: ['你写完了操作系统的大作业，跑起来一个Bug都没有。|Your operating-systems project ran without a single bug.', '你在算法竞赛里拿了奖。|You placed in an algorithms contest.'],
    med: ['你背了一整天解剖学，梦里都是骨头。|A full day of anatomy — you dreamed of bones.', '你第一次上解剖课，差点晕倒。|Your first dissection lab nearly made you faint.'],
    law: ['你在模拟法庭上辩倒了对手。|You won the moot court debate.', '你背完了一整部民法典。|You memorized the entire civil code.'],
    fin: ['你的投资模拟大赛排了全校第一。|You placed first in the campus trading competition.', '你啃完了一本厚厚的经济学原著。|You worked through a dense economics classic.'],
    art: ['你在画室里画了一整夜。|You painted in the studio all night.', '你的毕业设计入围了全国展。|Your thesis project made the national exhibition.']
  };
  patch('ACT_UNI', 'ustudy', function () {
    return function (a) {
      var p = G.S.p, e = p.edu; e.study++;
      var key = e.major && /cs|ai|soft|comp/.test(e.major) ? 'cs' : e.major && /med|nurs|clin/.test(e.major) ? 'med' : e.major && /law/.test(e.major) ? 'law' : e.major && /fin|econ|biz|acc/.test(e.major) ? 'fin' : e.major && /art|act|music|design/.test(e.major) ? 'art' : null;
      var pool = ['你在图书馆从早坐到晚。|You sat in the library from dawn to dusk.', '你的论文得了A。|Your paper got an A.', '你去旁听了一位大教授的讲座。|You sat in on a famous professor\'s lecture.'].concat(key ? USTUDY[key] : []);
      if ((e.tier || 3) >= 4) pool.push('你和来自全国的学霸们组队做项目，眼界大开。|Teaming up with top students from across the country opened your eyes.');
      return G.quick(a, G.pick(pool), { smarts: (e.tier || 3) >= 4 ? 3 : 2, happy: -1 });
    };
  });
  patch('ACT_UNI', 'intern', function () {
    return function (a) {
      var p = G.S.p, t = p.edu.tier || 2; p.flags.intern = (p.flags.intern || 0) + 1;
      if (t >= 4 && G.ch(.5 + (t - 4) * .25)) { p.flags.topIntern = 1; return G.quick(a, '凭着名校的牌子，你拿到了顶级公司的实习，导师说毕业可以直接回来。|Your school\'s name got you an internship at a top firm; your mentor said you could come back after graduation.', { smarts: 2, eq: 2, money: 800 }); }
      if (t <= 2 && G.ch(.4)) return G.quick(a, '投了五十份简历，只有一家小公司要你，每天端茶倒水。|Fifty applications, one small company — fetching coffee every day.', { eq: 1, happy: -2 });
      return G.quick(a, '你在一家公司实习，积累了不少经验。|You interned at a company and gained real experience.', { smarts: 1, eq: 1 });
    };
  });
  // a top-firm internship opens doors
  var qualify = G.career.qualify;
  G.career.qualify = function (j) { var r = qualify(j); if (G.S.p.flags.topIntern && !j.pt) { r.ch = Math.min(.97, r.ch + .12); } if (G.S.p.flags.intern && !j.pt) r.ch = Math.min(.97, r.ch + Math.min(.08, G.S.p.flags.intern * .03)); return r; };

  G.evs([
    E('s_top_pressure', [12, 18], '重点学校的节奏|Life at a Top School', '⏰', '重点学校里，早上六点早读，晚上十点下晚自习。周围每个人都比你更拼。|At the top school, reading starts at 6 a.m. and study hall ends at 10 p.m. Everyone around you works harder.', [
      O('卷起来|Compete harder', R('你挤进了年级前五十。|You fought your way into the top fifty in your grade.', { perf: 8, smarts: 2, stress: 15, health: -3 })),
      O('找到自己的节奏|Find your own pace', R('你不跟别人比，只跟昨天的自己比。|You stopped comparing yourself to others — only to yesterday\'s you.', { eq: 3, stress: -5 })),
      O('撑不住了|You can\'t keep up', R('你在月考后躲在厕所里哭。|After the monthly exam, you cried in the bathroom.', { happy: -10, stress: 10 }))
    ], { rep: 1, cd: 3, if: function (S, p) { return ['middle', 'high'].indexOf(p.edu.stage) >= 0 && (p.edu.q || 3) >= 4; } }),
    E('s_top_olympiad', [12, 18], '竞赛班|The Olympiad Squad', '🧮', '学校的竞赛教练看中了你，邀请你进竞赛班冲击全国金牌。|The school\'s olympiad coach picks you for the squad aiming at national gold.', [
      O('加入|Join', async function (c) { var r = await c.game('math', { name: '数学竞赛|Math Olympiad' }); if (r.score > .7) { c.p.flags.guaranteed = 1; H.fx(c, { smarts: 4, fame: 3, happy: 10 }); return '你拿到了全国金牌，被名校提前录取！|You won national gold and got early admission to a top university!'; } H.fx(c, { smarts: 2 }); return '你拿了省级二等奖，学到了很多。|You won a provincial second prize and learned a lot.'; }),
      O('专心高考|Focus on the regular exams', R('你按部就班地复习。|You stuck to the standard track.', { perf: 3 }))
    ], { if: function (S, p) { return ['middle', 'high'].indexOf(p.edu.stage) >= 0 && (p.edu.q || 3) >= 4 && p.st.smarts >= 70; } }),
    E('s_weak_chaos', [11, 18], '混乱的学校|A Rough School', '🥊', '你的学校里打架、抽烟、早恋是家常便饭，好好学习反而会被嘲笑。|At your school, fights, smoking and dating are routine — studying hard gets you mocked.', [
      O('出淤泥而不染|Rise above it', R('你成了全校唯一考上好大学的希望。老师们都把精力放在你身上。|You became the school\'s only hope for a good university; teachers poured their energy into you.', { perf: 6, eq: 2, stress: 6 })),
      O('融入他们|Fit in', R('你学会了抽烟，成绩一落千丈。|You learned to smoke, and your grades collapsed.', { perf: -10, smoke: 10, happy: 4 })),
      O('求爸妈转学|Beg your parents to transfer you', function (c) { var P = N.rel('father', 'mother').filter(function (n) { return n.alive; }); var m = c.$(3000); var payer = P.filter(function (n) { return n.wealth >= m; })[0]; if (!payer && !c.pay(m)) return '家里拿不出择校费。|The family can\'t afford the transfer fee.'; if (payer) payer.wealth -= m; c.p.edu.q = Math.min(5, (c.p.edu.q || 2) + 1); H.fx(c, { par: -2, happy: 4 }); return '爸妈托关系交了择校费，你转到了一所更好的学校。|Your parents paid the fee and pulled strings; you transferred to a better school.'; })
    ], { bad: 1, rep: 1, cd: 4, if: function (S, p) { return ['middle', 'high', 'voc'].indexOf(p.edu.stage) >= 0 && (p.edu.q || 3) <= 2; } }),
    E('s_uni_alumni', [19, 60], '校友会|The Alumni Network', '🤝', '名校校友会上，一位做投资的学长对你很感兴趣。|At your elite university\'s alumni gathering, an alumnus in finance takes an interest in you.', [
      O('主动交换联系方式|Exchange contacts', function (c) { var m = N.make({ rel: 'mentor', age: c.p.age + G.ri(8, 20), job: '投资人|Investor', inc: G.$w(500000), aff: 35, tags: ['rich'] }); m.pin = 1; c.prm.m = m.name; H.fx(c, { eq: 2 }); return '{m}说以后有机会会想着你。|{m} said they\'d keep you in mind.'; }),
      O('只是礼貌寒暄|Just make polite small talk', R('你吃了很多自助餐。|You ate a lot from the buffet.', { happy: 2 }))
    ], { if: function (S, p) { return (p.edu.tier || 0) >= 4 && p.edu.deg >= 4; } }),
    E('s_campus_recruit', [21, 30], '校园招聘|Campus Recruiting', '📢', '顶级公司都来你们学校抢人了，有三家同时给你发了录用通知。|Top companies are recruiting on campus, and three have made you offers at once.', [
      O('选薪水最高的|Take the highest salary', async function (c) { var pool = G.JOBS.filter(function (j) { return !j.pt && G.jobOk(j) && ['biz', 'tech', 'law'].indexOf(j.cat) >= 0 && j.deg <= c.p.edu.deg; }); if (!pool.length) return '这次没有合适的岗位。|No fitting roles this time.'; var j = pool.sort(function (a, b) { return b.pay[0] - a.pay[0]; })[G.ri(0, Math.min(2, pool.length - 1))]; G.career.hire(j); c.p.job.sal = Math.round(c.p.job.sal * 1.15); c.prm.j = j.r[0]; c.prm.s = G.M(c.p.job.sal); return '你成为了{j}，起薪{s}，同学们都很羡慕。|You became a {j} with a starting salary of {s}. Your classmates were envious.'; }),
      O('选最有前途的|Take the one with the best prospects', function (c) { var j = G.pick([G.JOB.coder, G.JOB.consult, G.JOB.engr, G.JOB.pm].filter(function (x) { return x && G.jobOk(x); })); if (!j) return '这次没有合适的岗位。|No fitting roles this time.'; G.career.hire(j); c.p.job.perf = 65; c.prm.j = j.r[0]; return '你选择了{j}，老板说你会在两年内升职。|You chose {j}; the boss expects you to be promoted within two years.'; }),
      O('都不去，继续深造|Turn them all down for grad school', R('你决定继续读书。|You decided to keep studying.', { smarts: 1 }))
    ], { good: 1, w: 6, if: function (S, p) { return (p.edu.tier || 0) >= 4 && p.edu.deg >= 4 && !p.job && !p.gov && !p.mil && !p.fc && !G.school.inSchool() && p.age <= 30; } }),
    E('s_degree_snob', [22, 45], '学历歧视|Credential Snobbery', '📄', '面试官看了一眼你的简历：“你这个学校……我们一般不考虑。”|The interviewer glances at your résumé: "Your school... we don\'t usually consider it."', [
      O('据理力争，展示能力|Argue your case and show your skills', async function (c) { var r = await c.game('quiz', { name: '加试|Extra Test', n: 3 }); if (r.win) { H.fx(c, { eq: 3, happy: 6 }); return '面试官改变了主意：“你被录用了。”|The interviewer changed their mind: "You\'re hired."'; } H.fx(c, { happy: -6 }); return '你还是被拒了。|You were turned down anyway.'; }),
      O('转身离开|Walk out', R('“那是你们的损失。”|"Your loss."', { happy: -2 })),
      O('下定决心考研|Resolve to get a better degree', R('你买了一摞考研资料。|You bought a stack of grad-school prep books.', { flag: 'gradGoal', smarts: 1 }))
    ], { bad: 1, if: function (S, p) { return p.edu.deg >= 4 && (p.edu.tier || 3) <= 2 && !p.job; } })
  ]);
})();
