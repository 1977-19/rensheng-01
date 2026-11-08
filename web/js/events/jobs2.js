/* Job identity: every line of work has its own daily texture, special activities and stories */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function J() { var p = G.S.p; return p.job ? G.JOB[p.job.id] : null; }
  function isJob(ids) { return function (S, p) { return !!(p.job && ids.indexOf(p.job.id) >= 0); }; }
  function isCat(cats) { return function (S, p) { var j = p.job && G.JOB[p.job.id]; return !!(j && !j.pt && cats.indexOf(j.cat) >= 0); }; }

  /* ---------- daily texture: work hard / overtime / slack off ---------- */
  var FL = {
    doctor: { w: ['你一天看了八十个病人，嗓子都哑了。|You saw eighty patients today and lost your voice.', '你确诊了一个罕见病例，主任当众表扬了你。|You diagnosed a rare case and the department head praised you in front of everyone.', '你连做了三台手术，下台时腿都在抖。|You did three surgeries back to back; your legs shook afterward.', '一位康复的病人给你送来了锦旗。|A recovered patient brought you a thank-you banner.'],
      o: ['你值了一个36小时的班，中间只睡了两个小时。|You worked a 36-hour shift with two hours of sleep.', '半夜来了个急诊，你从值班室冲了出去。|An emergency came in at midnight; you sprinted out of the on-call room.'],
      s: ['你躲进值班室眯了一会儿。|You snuck a nap in the on-call room.', '你在食堂多坐了半小时。|You lingered in the cafeteria an extra half hour.'] },
    nurse: { w: ['你给二十个病人扎了针，一针见血。|You started twenty IVs today, each on the first try.', '一位老奶奶拉着你的手，说你像她孙女。|An elderly patient held your hand and said you remind her of her granddaughter.', '你及时发现了病人的异常，救了一条命。|You caught a patient\'s warning signs in time and saved a life.'],
      o: ['你连上了两个夜班，走路都在飘。|Two night shifts in a row; you\'re walking on air.'], s: ['你在护士站偷偷吃了块蛋糕。|You sneaked a slice of cake at the nurses\' station.'] },
    teacher: { w: ['你批改了一百本作业，手腕都酸了。|You graded a hundred notebooks; your wrist aches.', '你上了一节公开课，校长频频点头。|You taught a demonstration lesson and the principal nodded along.', '一个后进生终于及格了，你比他还高兴。|A struggling student finally passed, and you were happier than he was.', '你去学生家里家访，了解到了很多情况。|You made a home visit and learned a lot about the student.'],
      o: ['你熬夜出了一套期末试卷。|You stayed up writing the final exam.'], s: ['你让学生上自习，自己坐在讲台上发呆。|You gave a study period and zoned out at the front desk.'] },
    prof: { w: ['你的论文被顶级期刊接收了！|Your paper was accepted by a top journal!', '你在学术会议上做了主题报告。|You gave a keynote at an academic conference.', '你申请的课题拿到了经费。|Your grant proposal got funded.'],
      o: ['你在实验室通宵改学生的论文。|You spent the night in the lab revising students\' papers.'], s: ['你把课交给了助教，自己去喝了杯咖啡。|You handed class to the TA and went for coffee.'] },
    sci: { w: ['实验终于成功了，数据完美！|The experiment finally worked — perfect data!', '你在显微镜前坐了一整天。|You sat at the microscope all day.', '你的发现可能改写教科书。|Your finding might rewrite the textbooks.'], o: ['你守着实验跑了一整夜。|You babysat an experiment all night.'], s: ['你假装在等数据，其实在看小说。|You pretended to wait for data while reading a novel.'] },
    coder: { w: ['你修复了一个困扰团队三个月的Bug。|You fixed a bug that had haunted the team for three months.', '你写的代码一次通过了测试。|Your code passed every test on the first run.', '你重构了一个老模块，性能提升了十倍。|You refactored an old module and made it ten times faster.', '你在代码评审中指出了一个严重漏洞。|You spotted a serious vulnerability in code review.'],
      o: ['凌晨三点线上出故障，你爬起来救火。|Production went down at 3 a.m. and you got up to fight the fire.', '你加班赶上线，头发又少了一撮。|You crunched for the release and lost another tuft of hair.'], s: ['你说在“编译”，其实在逛技术论坛。|You said you were "compiling" while browsing forums.', '你写了一下午注释，没写一行代码。|You wrote comments all afternoon and no code.'] },
    ai: { w: ['你训练的模型刷新了榜单纪录。|Your model set a new benchmark record.', '你调了一整天参数，效果终于上来了。|You tuned hyperparameters all day and finally got results.'], o: ['你盯着训练曲线守了一夜。|You watched the training curve all night.'], s: ['你说模型在训练，其实在打游戏。|You said the model was training while you played games.'] },
    game: { w: ['你设计的新关卡玩家好评如潮。|Players raved about the level you designed.', '你写了一份五十页的策划案。|You wrote a fifty-page design document.'], o: ['版本上线前你连续加班两周。|You crunched for two weeks before the release.'], s: ['你以“体验竞品”为名玩了一下午游戏。|You played games all afternoon "researching competitors."'] },
    pm: { w: ['你和开发吵了一架，但需求最终上线了。|You argued with the engineers, but the feature shipped.', '你画的原型被老板一眼看中。|The boss loved your prototype at first sight.'], o: ['你熬夜写需求文档。|You stayed up writing specs.'], s: ['你开了三个没有结论的会。|You held three meetings that decided nothing.'] },
    engr: { w: ['你解决了一个关键的技术难题。|You cracked a key technical problem.', '你去工地现场盯了一整天。|You spent the whole day on site.'], o: ['项目赶工期，你住在了工地。|To meet the deadline, you practically lived on site.'], s: ['你借口去现场，其实回家睡了个午觉。|You claimed a site visit and went home to nap.'] },
    archi: { w: ['你的设计方案中标了！|Your design won the bid!', '你画了一整天图纸。|You drafted all day.'], o: ['你通宵改方案，甲方说“还是第一版好”。|You revised all night; the client said "the first version was better."'], s: ['你盯着空白的图纸发呆。|You stared at a blank drawing board.'] },
    chef: { w: ['你研发的新菜成了店里的招牌。|Your new dish became the house specialty.', '午市爆单，你颠了三百次勺。|The lunch rush hit and you tossed the wok three hundred times.', '一位美食博主点名表扬了你的菜。|A food blogger singled out your cooking for praise.'], o: ['你在后厨站了十四个小时。|You stood in the kitchen for fourteen hours.'], s: ['你偷吃了好几块刚出锅的红烧肉。|You sneaked several pieces of fresh-braised pork.'] },
    waiter: { w: ['你记住了常客的口味，客人很感动。|You remembered a regular\'s order, and they were touched.', '你一晚上收到了好几份小费。|You got several tips tonight.'], o: ['店里办婚宴，你忙到凌晨。|The restaurant hosted a wedding; you worked till dawn.'], s: ['你躲在后门玩手机。|You hid by the back door on your phone.'] },
    driver: { w: ['你一天跑了五百公里，安全无事故。|You drove five hundred kilometers today without incident.', '一位乘客和你聊得很投机，多给了车费。|A passenger enjoyed chatting with you and paid extra.'], o: ['你跑了一趟夜间长途，喝了三罐咖啡。|You drove a long overnight haul on three cans of coffee.'], s: ['你把车停在路边睡了一觉。|You parked by the road and took a nap.'] },
    rider: { w: ['你一天送了六十单，全部准时。|You delivered sixty orders today, all on time.', '暴雨天你冲在路上，客人给了五星好评。|You rode through a downpour and got a five-star review.'], o: ['你跑到深夜冲单量。|You rode late into the night chasing your quota.'], s: ['你在商场门口歇了一个钟头。|You rested outside the mall for an hour.'] },
    courier: { w: ['双十一你一天送了三百个包裹。|On Singles\' Day you delivered three hundred packages.', '你背着冰箱爬了七楼。|You hauled a fridge up seven flights of stairs.'], o: ['你分拣快递到凌晨两点。|You sorted packages until 2 a.m.'], s: ['你在快递车里打了个盹。|You dozed off in the delivery van.'] },
    factory: { w: ['你这个月零次品，拿了全勤奖。|Zero defects and perfect attendance this month.', '你提的改进建议被车间采纳了。|The workshop adopted your improvement suggestion.', '流水线上你一天拧了三千颗螺丝。|You tightened three thousand screws on the line today.'], o: ['工厂赶订单，你连上了两个班。|The factory rushed an order; you pulled a double shift.'], s: ['你趁换班偷偷抽了根烟。|You snuck a cigarette at shift change.'] },
    builder: { w: ['你在三十层高的脚手架上干了一天。|You worked all day on scaffolding thirty stories up.', '你砌的墙又直又平，工头竖起了大拇指。|Your wall was dead straight; the foreman gave a thumbs-up.'], o: ['工期紧，你顶着烈日干到天黑。|With the deadline close, you worked under the blazing sun till dark.'], s: ['你躲在阴凉处喝了半天水。|You hid in the shade drinking water for half the day.'] },
    farmer: { w: ['今年风调雨顺，庄稼长得很好。|Good weather this year — the crops are thriving.', '你天不亮就下地，一直干到太阳落山。|You were in the fields before dawn and worked till sunset.', '你试种了一种新品种，长势喜人。|You tried a new crop variety and it\'s growing beautifully.'], o: ['抢收季节，你在田里熬了几个通宵。|At harvest time you worked through several nights.'], s: ['你在田埂上躺着晒太阳。|You lay on the field ridge sunbathing.'] },
    mechanic: { w: ['你一听声音就找到了故障。|You found the fault just by listening to the engine.', '你修好了一辆别人都说没救的老车。|You fixed an old car everyone said was hopeless.'], o: ['你在修车坑里干到半夜。|You worked in the repair pit until midnight.'], s: ['你借口试车出去兜了一圈风。|You took a "test drive" just for fun.'] },
    sales: { w: ['你签下了一个大单！|You closed a big deal!', '你一天打了两百个电话。|You made two hundred calls today.', '你陪客户喝到半夜，合同签了。|You drank with a client until midnight — contract signed.'], o: ['月底冲业绩，你连轴转了一周。|End-of-month quota push: you worked nonstop for a week.'], s: ['你说去拜访客户，其实去看了场电影。|You "visited a client" — actually a movie.'] },
    agent: { w: ['你一天带客户看了十套房，成交了一套。|You showed ten homes today and closed one.', '你在小区门口发了一天传单。|You handed out flyers at the complex gate all day.'], o: ['你陪客户看房看到晚上十点。|You showed homes until 10 p.m.'], s: ['你坐在门店里刷房源发呆。|You sat in the office scrolling listings.'] },
    banker: { w: ['你主导的并购案顺利完成。|The merger you led closed smoothly.', '你做的财务模型让客户刮目相看。|Your financial model wowed the client.'], o: ['你连续一周每天只睡四个小时。|You slept four hours a night for a week.'], s: ['你在路演间隙偷偷买了个包。|You slipped out between roadshow meetings to buy a bag.'] },
    quant: { w: ['你的策略今年跑赢了大盘。|Your strategy beat the market this year.', '你发现了一个市场异象。|You discovered a market anomaly.'], o: ['你盯盘到美股收盘。|You watched the markets until U.S. close.'], s: ['你让程序自己跑，自己去健身房了。|You let the algorithm run and went to the gym.'] },
    acct: { w: ['你查出了一笔对不上的账。|You tracked down an entry that didn\'t reconcile.', '年报按时交了，一分不差。|The annual report went in on time, accurate to the cent.'], o: ['年底结账，你加班到深夜。|Year-end closing kept you working late into the night.'], s: ['你对着表格发呆了一下午。|You stared blankly at spreadsheets all afternoon.'] },
    lawyer: { w: ['你在法庭上的辩护让对方律师哑口无言。|Your argument left opposing counsel speechless.', '你帮一位农民工讨回了工资。|You helped a migrant worker recover unpaid wages.', '你读完了三千页的卷宗。|You read through three thousand pages of case files.'], o: ['开庭前夜你通宵准备材料。|You prepared all night before trial.'], s: ['你以“研究案例”为名看了一下午剧。|You binge-watched a legal drama "for research."'] },
    judge: { w: ['你审结了一起疑难案件。|You resolved a difficult case.', '你的判决书被评为优秀文书。|Your written judgment was named exemplary.'], o: ['你加班写判决书。|You stayed late writing judgments.'], s: ['你在庭审间隙打了个盹。|You dozed during a recess.'] },
    journo: { w: ['你的深度报道上了头版。|Your investigative piece made the front page.', '你蹲守了三天，拿到了独家新闻。|You staked out for three days and got an exclusive.'], o: ['突发新闻，你连夜赶往现场。|Breaking news — you rushed to the scene overnight.'], s: ['你把通稿改了改就交了。|You lightly edited a press release and filed it.'] },
    pilot: { w: ['你在强侧风中完美落地，乘客鼓起了掌。|You nailed a crosswind landing and the passengers applauded.', '你飞了一趟跨洋航班。|You flew a transoceanic route.'], o: ['航班延误，你在机场等到凌晨。|Your flight was delayed and you waited until dawn.'], s: ['自动驾驶时你看了会儿云。|On autopilot, you watched the clouds for a while.'] },
    attendant: { w: ['你安抚了一位恐飞的乘客。|You calmed a passenger terrified of flying.', '你一天飞了四段航班。|You worked four flights today.'], o: ['红眼航班让你时差全乱了。|Red-eye flights scrambled your body clock.'], s: ['你在厨房区偷偷吃了份飞机餐。|You sneaked an in-flight meal in the galley.'] },
    fire: { w: ['你从火场里救出了一个孩子。|You carried a child out of a burning building.', '你们半夜出警救了一只卡在树上的猫。|You got called out at midnight to rescue a cat from a tree.', '你在训练中刷新了队里的纪录。|You set a new squad record in training.'], o: ['山火蔓延，你在一线奋战了三天三夜。|A wildfire spread; you fought on the front line for three days straight.'], s: ['你在消防站打了一下午乒乓球。|You played table tennis at the station all afternoon.'] },
    hair: { w: ['你给客人剪了一个新发型，她满意得拍了好多照片。|You gave a client a new look; she took tons of photos.'], o: ['过年前店里爆满，你剪到半夜。|Before New Year the shop was packed; you cut hair till midnight.'], s: ['你给自己染了个新颜色。|You dyed your own hair a new color.'] },
    trainer: { w: ['你的学员一个月减了十斤。|Your client lost ten pounds in a month.', '你卖出了好几节私教课。|You sold several personal training packages.'], o: ['你一天上了八节课。|You taught eight sessions today.'], s: ['你在器械区自拍了半小时。|You took selfies in the weights area for half an hour.'] },
    guard: { w: ['你抓到了一个偷电动车的小偷。|You caught someone stealing a scooter.', '你在门口站了一整天岗。|You stood guard at the gate all day.'], o: ['你值了一整夜的班。|You worked the overnight watch.'], s: ['你在岗亭里听了一晚上评书。|You listened to radio stories all night in the booth.'] },
    cleaner: { w: ['你把整层楼擦得一尘不染。|You left the whole floor spotless.', '你捡到了一个钱包，交给了失主。|You found a wallet and returned it to its owner.'], o: ['大扫除日你干到天黑。|On deep-clean day you worked until dark.'], s: ['你在楼梯间歇了好久。|You rested in the stairwell for a long time.'] },
    cashier: { w: ['你一天收了上千笔账，一分不差。|You rang up a thousand sales without a single error.'], o: ['店庆促销，你忙到打烊后两小时。|The anniversary sale kept you two hours past closing.'], s: ['你和隔壁收银员聊了一下午八卦。|You gossiped with the next cashier all afternoon.'] },
    vendor: { w: ['今天生意不错，你提前卖完了货。|Business was good — you sold out early.', '城管来了，你推着车一路狂奔。|The city inspectors came and you ran with your cart.'], o: ['你出摊到夜市散场。|You kept your stall open until the night market closed.'], s: ['今天下雨，你没出摊。|It rained, so you didn\'t set up.'] },
    design: { w: ['你的海报被甲方一稿通过！|The client approved your poster on the first draft!', '你的作品入选了设计年鉴。|Your work made the design annual.'], o: ['你改到第十八稿，甲方说用第一稿。|On revision eighteen, the client chose the first draft.'], s: ['你在找“灵感”，其实在逛购物网站。|You were "looking for inspiration" — actually shopping online.'] },
    photo: { w: ['你拍到了一张绝美的照片。|You captured a stunning shot.', '你给一场婚礼拍了两千张照片。|You shot two thousand photos at a wedding.'], o: ['你修图修到天亮。|You edited photos until dawn.'], s: ['你出去“采风”，其实是去旅游。|You went "scouting locations" — really a vacation.'] },
    transl: { w: ['你一天翻译了一万字。|You translated ten thousand words today.', '你在国际会议上做了同声传译。|You interpreted simultaneously at an international conference.'], o: ['客户加急，你通宵赶稿。|A rush order kept you translating all night.'], s: ['你让机器翻译了一段，自己润了润色。|You machine-translated a section and lightly polished it.'] },
    diplomat: { w: ['你在谈判桌上寸步不让。|You didn\'t give an inch at the negotiating table.', '你成功撤侨，护送同胞回国。|You evacuated your compatriots safely home.'], o: ['你为一份联合声明熬了一整夜。|You stayed up all night on a joint statement.'], s: ['你在酒会上多喝了两杯香槟。|You had an extra glass of champagne at the reception.'] },
    vet: { w: ['你给一只难产的母猫接生了五只小猫。|You delivered five kittens for a cat in a difficult labor.', '你治好了一只骨折的狗狗。|You healed a dog\'s broken leg.'], o: ['半夜有人抱来一只中毒的狗，你抢救到天亮。|Someone brought in a poisoned dog at midnight; you worked until dawn.'], s: ['你在诊所里撸了半天猫。|You petted the clinic cats for half the day.'] },
    pharm: { w: ['你发现了一张处方的配伍错误。|You caught a dangerous drug interaction on a prescription.'], o: ['流感季，药房排起了长队。|Flu season — the pharmacy line wrapped around.'], s: ['你在药柜后面偷偷喝了杯奶茶。|You sipped a milk tea behind the shelves.'] },
    psych: { w: ['一位来访者说你救了他。|A client said you saved his life.', '你帮一对夫妻重新学会了沟通。|You helped a couple relearn how to talk to each other.'], o: ['你接了一个深夜危机热线。|You took a late-night crisis call.'], s: ['你听完别人的烦恼，自己也需要倾诉了。|After everyone else\'s troubles, you needed someone to talk to.'] },
    hr: { w: ['你招到了一个大牛。|You recruited a star hire.', '你调解了两个部门的矛盾。|You mediated a fight between departments.'], o: ['校招季你面试了上百人。|You interviewed a hundred people during campus hiring.'], s: ['你在招聘网站上刷简历，顺便看了看自己的机会。|Browsing résumés, you checked your own options.'] },
    mkt: { w: ['你策划的活动刷屏了。|Your campaign went viral.', '你的文案被老板转发到了朋友圈。|The boss shared your copy on social media.'], o: ['大促前你熬了三个通宵。|You pulled three all-nighters before the big sale.'], s: ['你说在做竞品分析，其实在看八卦。|You were "analyzing competitors" — actually reading gossip.'] },
    pr: { w: ['你连夜平息了一场舆论危机。|You defused a PR crisis overnight.'], o: ['老板的发言上了热搜，你一夜没睡。|The boss\'s comments trended; you didn\'t sleep.'], s: ['你在发布会后台吃光了茶歇。|You ate the whole snack table backstage.'] },
    consult: { w: ['你的PPT让客户的CEO拍案叫绝。|Your deck made the client\'s CEO slap the table in delight.'], o: ['你一周飞了四个城市。|You flew to four cities in one week.'], s: ['你在酒店里点了客房服务，报销。|You ordered room service on the expense account.'] }
  };
  var CATF = {
    svc: { w: ['你笑脸迎客，忙了一整天。|You greeted customers with a smile all day.', '一位客人专门找到经理表扬了你。|A customer went to the manager to praise you.'], o: ['节假日客流爆满，你忙到脚不沾地。|Holiday crowds kept you running nonstop.'], s: ['你趁没客人的时候偷偷歇了会儿。|You rested while the shop was quiet.'] },
    blue: { w: ['你干了一天体力活，汗流浃背。|A full day of hard labor left you drenched in sweat.'], o: ['你连轴干了两个班。|You worked two shifts back to back.'], s: ['你蹲在墙角抽了根烟。|You squatted by the wall for a smoke.'] }
  };
  var DEFAULT = { w: ['你提前完成了任务，领导点了个赞。|You finished early, and your manager gave a thumbs-up.', '你主动承担了一个难啃的任务。|You volunteered for a tough assignment.', '你在部门会议上的发言很出彩。|You spoke well at the department meeting.'], o: ['你连续加班到深夜，眼睛都快睁不开了。|You worked late night after night; your eyes can barely stay open.'], s: [] };
  G.jobFlavor = function (kind) {
    var p = G.S.p, j = p.job, Jd = J(); if (!j || !Jd) return null;
    var f = FL[j.id] || CATF[Jd.cat] || DEFAULT, list = (f[kind] || []).slice();
    if (kind === 'w' && list.length < 4) list = list.concat(DEFAULT.w.slice(0, 1));
    return list.length ? G.pick(list) : null;
  };
  // patch the generic job actions to use the job's own texture
  function patch(id, fn) { var a = G.ACT_JOB.filter(function (x) { return x.id === id; })[0]; if (a) a.run = fn(a.run); }
  patch('work', function () { return function (a) { G.S.p.job.eff++; return G.quick(a, G.jobFlavor('w') || DEFAULT.w[0], { stress: 5, happy: -1 }); }; });
  patch('overtime', function () { return function (a) { var j = G.S.p.job; j.eff += 2; G.S.p.hab.night += 15; return G.quick(a, G.jobFlavor('o') || DEFAULT.o[0], { stress: 10, health: -2, money: 600 }); }; });
  patch('fish', function (orig) { return function (a) { var t = G.jobFlavor('s'); if (!t || G.ch(.35)) return orig(a); var j = G.S.p.job; j.eff -= .5; if (G.ch(.2)) { j.perf -= 8; return G.quick(a, '被领导抓了个正着！|Your manager caught you!', { happy: -5 }); } return G.quick(a, t, { happy: 4, stress: -4 }); }; });

  /* ---------- special activities by line of work ---------- */
  var X = [
    { id: 'jx_paper', n: '写论文/搞科研|Write a Paper', i: '📄', e: 20, cats: ['edu', 'med'], ids: ['prof', 'sci', 'doctor'], run: function (a) { var ok = G.ch(.3 + G.S.p.st.smarts / 200); G.S.p.job.eff += ok ? 2 : .5; return G.quick(a, ok ? '你的论文发表在了核心期刊上。|Your paper was published in a leading journal.' : '论文被拒稿了，审稿人意见写了三页。|Rejected — with three pages of reviewer comments.', ok ? { smarts: 2, fame: 1 } : { happy: -3 }); } },
    { id: 'jx_surgery', n: '主刀高难度手术|Lead a Hard Surgery', i: '🩺', e: 25, ids: ['doctor'], if: function () { return G.S.p.job.rank >= 1; }, run: async function (a) { var r = await G.UI.game('memory', { name: '手术|Surgery' }); var j = G.S.p.job; if (r.win) { j.eff += 3; return G.quick(a, '手术非常成功，病人家属跪下给你磕了个头。|The surgery was a triumph; the family wept with gratitude.', { fame: 2, happy: 6, karma: 3 }); } j.perf -= 6; return G.quick(a, '手术出现了并发症，你自责了很久。|Complications arose, and you blamed yourself for a long time.', { happy: -8, stress: 10 }); } },
    { id: 'jx_clinic', n: '下乡义诊|Free Rural Clinic', i: '🏥', e: 20, cats: ['med'], run: function (a) { return G.quick(a, '你在山村里给几百位村民看了病。|You treated hundreds of villagers in the mountains.', { karma: 8, happy: 4, rep: 3 }); } },
    { id: 'jx_homevisit', n: '家访|Home Visits', i: '🏘️', e: 15, ids: ['teacher'], run: function (a) { G.S.p.job.eff++; return G.quick(a, G.pick(['你走了十几里山路去学生家家访。|You walked miles of mountain road for a home visit.', '你劝回了一个想辍学的孩子。|You talked a student out of dropping out.']), { karma: 5, happy: 3 }); } },
    { id: 'jx_tutorside', n: '私下开补习班|Run Private Tutoring', i: '💵', e: 20, ids: ['teacher', 'prof'], run: function (a) { var caught = G.ch(.15); if (caught) { G.S.p.job.perf -= 15; return G.quick(a, '你私下补课被举报了，受了处分。|You got reported for private tutoring and disciplined.', { happy: -8, rep: -5 }); } return G.quick(a, '补习班的学费是你工资的好几倍。|The tutoring fees were several times your salary.', { money: 4000, stress: 6 }); } },
    { id: 'jx_opensource', n: '做开源项目|Build an Open-Source Project', i: '⭐', e: 20, ids: ['coder', 'ai', 'game'], run: function (a) { var hit = G.ch(.15 + G.skill('code') / 300); return G.quick(a, hit ? '你的项目在网上收获了上万颗星！猎头开始找你了。|Your project got tens of thousands of stars! Headhunters came calling.' : '你写了个小工具，有几十个人在用。|You built a little tool a few dozen people use.', hit ? { fame: 4, smarts: 2, sk: { code: 6 } } : { sk: { code: 3 } }); } },
    { id: 'jx_hackathon', n: '参加黑客马拉松|Join a Hackathon', i: '💻', e: 25, cats: ['tech'], run: async function (a) { var r = await G.UI.game('math', { name: '黑客马拉松|Hackathon' }); if (r.win) return G.quick(a, '你们队拿了冠军，奖金十万！|Your team won first place and a big cash prize!', { money: 8000, fame: 2, happy: 8 }); return G.quick(a, '熬了48小时，你们的作品没进前十。|After 48 hours, your project missed the top ten.', { health: -3, sk: { code: 3 } }); } },
    { id: 'jx_newdish', n: '研发新菜|Invent a New Dish', i: '🍲', e: 15, ids: ['chef'], run: async function (a) { var r = await G.UI.game('rhythm', { name: '颠勺|Wok Toss' }); return G.quick(a, r.win ? '新菜上市就卖爆了，老板给你涨了工资。|The new dish sold out; the owner gave you a raise.' : '新菜太咸了，被客人退了好几盘。|Too salty — several plates came back.', r.win ? { money: 1500, happy: 6, rep: 3 } : { happy: -3 }); } },
    { id: 'jx_longhaul', n: '跑长途|Take a Long-Haul Job', i: '🚛', e: 25, ids: ['driver', 'courier'], run: function (a) { if (G.ch(.06)) return G.quick(a, '你疲劳驾驶，差点出了车祸。|You drove exhausted and nearly crashed.', { health: -8, stress: 12 }); return G.quick(a, '你跑了一趟长途，挣了一笔辛苦钱。|You made hard-earned money on a long haul.', { money: 1800, health: -2 }); } },
    { id: 'jx_cashcrop', n: '种经济作物|Grow Cash Crops', i: '🌱', e: 20, ids: ['farmer'], run: function (a) { var y = G.ri(0, 2); return G.quick(a, ['大棚蔬菜卖了个好价钱！|Your greenhouse vegetables sold for a great price!', '今年果子丰收，但价格跌了。|A bumper fruit harvest — but prices fell.', '一场冰雹把庄稼全打坏了。|A hailstorm destroyed the crops.'][y], [{ money: 3000, happy: 6 }, { money: 400 }, { money: -800, happy: -8 }][y]); } },
    { id: 'jx_livesell', n: '直播卖农产品|Sell Produce on Livestream', i: '📱', e: 15, ids: ['farmer', 'vendor'], era: { g: 2016, cn: 2018 }, run: function (a) { var hit = G.ch(.2 + G.S.p.st.eq / 300); return G.quick(a, hit ? '你的直播间爆了，一晚上卖空了整个村的货！|Your stream blew up — you sold out the whole village\'s produce in one night!' : '直播间里只有十几个人，卖出去三箱。|A dozen viewers; you sold three boxes.', hit ? { money: 6000, fame: 3, happy: 8 } : { money: 200 }); } },
    { id: 'jx_bigdeal', n: '冲刺大单|Chase a Big Deal', i: '🤝', e: 20, ids: ['sales', 'agent', 'banker', 'consult'], run: async function (a) { var r = await G.UI.game('quiz', { name: '谈判|Negotiation', n: 3 }); var j = G.S.p.job; if (r.win) { j.eff += 3; return G.quick(a, '你拿下了今年最大的一单，提成丰厚！|You landed the biggest deal of the year — fat commission!', { money: 6000, happy: 8 }); } return G.quick(a, '客户被竞争对手抢走了。|A competitor stole the client.', { happy: -5, stress: 5 }); } },
    { id: 'jx_probono', n: '接公益案件|Take a Pro Bono Case', i: '⚖️', e: 20, ids: ['lawyer'], run: function (a) { var w = G.ch(.5 + G.S.p.st.smarts / 300); return G.quick(a, w ? '你为弱势群体打赢了官司，媒体争相报道。|You won justice for the vulnerable, and the press covered it widely.' : '官司输了，但当事人还是谢了你。|You lost, but your client still thanked you.', w ? { karma: 10, fame: 3, rep: 4 } : { karma: 5 }); } },
    { id: 'jx_expose', n: '调查黑幕|Investigate a Scandal', i: '🕵️', e: 25, ids: ['journo'], run: function (a) { var r = G.ri(0, 2); return G.quick(a, ['你的报道让一家黑心工厂关了门！|Your story shut down a toxic factory!', '报道被压下来了，你很不甘心。|Your story got spiked. You\'re furious.', '你收到了恐吓信。|You received a threatening letter.'][r], [{ fame: 5, karma: 8, rep: 4 }, { happy: -5 }, { stress: 15, happy: -6 }][r]); } },
    { id: 'jx_drill', n: '高强度训练|Intense Drills', i: '🧯', e: 20, ids: ['fire'], run: function (a) { G.S.p.job.eff++; return G.quick(a, '你负重爬了二十层楼，练得浑身是汗。|You climbed twenty floors in full gear.', { fit: 8, health: 2 }); } },
    { id: 'jx_exhibit', n: '办个人作品展|Hold an Exhibition', i: '🖼️', e: 25, ids: ['design', 'photo', 'archi'], $: 3000, run: function (a) { var hit = G.ch(.25 + G.skill('art') / 250); return G.quick(a, hit ? '展览大受好评，有藏家高价买走了你的作品！|Rave reviews — a collector bought your work at a high price!' : '来看展的人不多，但你很满足。|Few visitors, but you\'re content.', hit ? { money: 12000, fame: 4, happy: 8 } : { happy: 3, sk: { art: 3 } }); } },
    { id: 'jx_moonlight', n: '接私活|Take on Side Gigs', i: '🌙', e: 20, cats: ['tech', 'art', 'biz'], run: function (a) { if (G.ch(.12)) { G.S.p.job.perf -= 10; return G.quick(a, '接私活被公司发现了，被约谈。|The company found out about your side gig and called you in.', { happy: -5 }); } return G.quick(a, '你接了个私活，多赚了一笔。|You earned extra from a side gig.', { money: 2500, stress: 6 }); } },
    { id: 'jx_union', n: '组织工友维权|Organize Your Coworkers', i: '✊', e: 20, cats: ['blue', 'svc'], run: function (a) { var r = G.ri(0, 2); return G.quick(a, ['老板让步了，大家的工资都涨了！|The boss gave in — everyone got a raise!', '老板答应考虑，然后就没有然后了。|The boss promised to "consider it." Nothing happened.', '你被当成刺头，穿了小鞋。|You were branded a troublemaker and punished.'][r], [{ money: 1200, karma: 5, rep: 6 }, {}, { happy: -6, rep: 3 }][r]); } }
  ];
  G.ACT_JOBX = X;
  G.jobExtras = function () {
    var p = G.S.p, j = p.job, Jd = J(); if (!j || !Jd || Jd.pt) return [];
    return X.filter(function (x) { return (x.ids && x.ids.indexOf(j.id) >= 0) || (x.cats && x.cats.indexOf(Jd.cat) >= 0); });
  };
  var lifeActs = G.lifeActs;
  G.lifeActs = function () { var out = lifeActs(); if (G.S.p.job && !G.S.p.jail) out = out.concat(G.jobExtras()); return out; };

  /* ---------- stories that only happen in certain jobs ---------- */
  G.evs([
    E('j_med_dispute', [24, 65], '医闹|A Violent Patient Family', '🚨', '一位病人没救回来，家属冲进诊室要打人。|A patient didn\'t survive, and the family stormed in looking for a fight.', [
      O('冷静解释病情|Calmly explain what happened', RC(.6, '家属哭着离开了。你一夜没睡。|The family left in tears. You didn\'t sleep that night.', { stress: 10 }, '你被推倒在地，受了轻伤。|You were shoved to the floor and hurt.', { health: -10, stress: 15 })),
      O('叫保安|Call security', R('保安及时赶到。你心有余悸。|Security arrived in time. You\'re still shaken.', { stress: 8 })),
      O('从此心灰意冷|Lose heart in the profession', R('你开始认真考虑转行。|You start seriously thinking about leaving medicine.', { happy: -10 }))
    ], { bad: 1, if: isJob(['doctor', 'nurse']) }),
    E('j_med_redenv', [24, 65], '病人家属的红包|An Envelope from the Family', '🧧', '手术前，病人家属往你口袋里塞了个厚厚的红包。|Before surgery, the family stuffs a fat envelope into your pocket.', [
      O('坚决退回|Firmly refuse', R('家属很感动：“遇到好医生了。”|The family was moved: "We\'ve found a good doctor."', { karma: 8, rep: 4 })),
      O('收下|Keep it', function (c) { c.money(c.$(3000)); if (G.ch(.2)) { c.p.job.perf -= 20; H.fx(c, { rep: -10, happy: -10 }); return '你被举报收红包，挨了处分。|You were reported and disciplined.'; } H.fx(c, { karma: -6 }); return '你收下了红包。|You kept the money.'; }),
      O('术后交到医院账上|Deposit it to their hospital bill', R('你把钱充进了病人的住院账户。|You put the money toward their hospital bill.', { karma: 10 }))
    ], { if: isJob(['doctor']) }),
    E('j_med_epidemic', [24, 65], '支援一线|Called to the Front Line', '😷', '一场疫情暴发，医院组建支援队，需要志愿者。|An outbreak hits, and the hospital is forming a volunteer response team.', [
      O('第一个报名|Be the first to volunteer', function (c) { if (G.ch(.12)) { H.fx(c, { health: -20 }); return '你在一线感染了，好在挺了过来。你的照片上了新闻。|You were infected on the front line but pulled through. Your photo made the news.'; } H.fx(c, { karma: 12, fame: 6, rep: 8, health: -5 }); c.p.job.perf += 15; return '你在一线奋战了三个月，回来时被授予了荣誉称号。|You fought on the front line for three months and came home with an honor.'; }),
      O('家里需要我，不去了|Your family needs you; stay back', R('你留在了后方。|You stayed behind.', { happy: -3 }))
    ], { if: isCat(['med']) }),
    E('j_teacher_student', [24, 65], '问题学生|A Troubled Student', '🧒', '班上有个孩子总是打架、逃课，同事都劝你别管了。|A kid in your class keeps fighting and skipping; colleagues say give up on him.', [
      O('坚持不放弃|Refuse to give up', RC(.55, '多年后，他考上了大学，专门回来看你。|Years later he got into university and came back to thank you.', { karma: 10, happy: 10 }, '你付出了很多，但他还是辍学了。|You gave everything, but he dropped out anyway.', { happy: -6 })),
      O('请家长来|Call in the parents', R('家长来了，打了孩子一顿。你心里很不是滋味。|The parent came and hit the child. You felt awful.', { happy: -3 })),
      O('听同事的|Take your colleagues\' advice', R('你不再管他了。|You stopped trying.', { karma: -3 }))
    ], { if: isJob(['teacher']) }),
    E('j_teacher_parent', [24, 65], '家长送礼|A Parent\'s "Gift"', '🎁', '一位家长想让孩子坐第一排，送来了一张购物卡。|A parent wants their kid in the front row and sends over a gift card.', [
      O('退回去|Send it back', R('你按成绩排座位，问心无愧。|You seat students by merit. Clear conscience.', { karma: 6 })),
      O('收下并照办|Accept and oblige', R('其他家长开始议论纷纷。|Other parents started whispering.', { money: 500, karma: -5, rep: -3 }))
    ], { if: isJob(['teacher']) }),
    E('j_teacher_reunion', [45, 90], '桃李满天下|Your Students Return', '🍑', '二十年前教过的学生们组织了一场谢师宴，请你上座。|Students you taught twenty years ago throw a dinner in your honor.', [
      O('欣然赴宴|Gladly attend', R('他们有的当了医生，有的当了老板。一个学生说：“是您改变了我的一生。”你红了眼眶。|Some became doctors, some bosses. One said, "You changed my life." Your eyes welled up.', { happy: 14 }))
    ], { good: 1, if: function (S, p) { return (p.job && (p.job.id === 'teacher' || p.job.id === 'prof') && p.job.yrs >= 15) || p.flags.wasTeacher; } }),
    E('j_coder_35', [33, 45], '35岁危机|The Age-35 Cliff', '⏳', '公司裁员名单里，35岁以上的程序员占了一大半。|On the layoff list, most of the programmers are over 35.', [
      O('拼命学新技术|Learn new tech furiously', R('你学了AI、学了云原生，暂时保住了位置。|You learned AI and cloud-native and kept your seat — for now.', { smarts: 2, stress: 12 })),
      O('转管理岗|Move into management', function (c) { if (G.ch(.4 + c.p.st.eq / 200)) { c.p.job.rank = Math.min(c.p.job.rank + 1, G.JOB[c.p.job.id].r.length - 1); return '你成功转型做了技术管理。|You moved into engineering management.'; } return '管理岗没轮到你。|The management role went to someone else.'; }),
      O('提前准备退路|Start building an exit plan', R('你开始研究开奶茶店。|You started researching opening a bubble tea shop.', { happy: 2, flag: 'exitPlan' }))
    ], { bad: 1, if: isJob(['coder', 'pm', 'game', 'ai']), era: { g: 2012, cn: 2015 } }),
    E('j_coder_poach', [24, 45], '大厂挖人|Big Tech Comes Calling', '💼', '一家大厂的猎头开出了你现在工资两倍的价格。|A headhunter from a tech giant offers double your salary.', [
      O('跳！|Jump!', function (c) { c.p.job.sal = Math.round(c.p.job.sal * G.rf(1.6, 2.1)); c.p.job.co = G.career.coName('tech'); H.fx(c, { happy: 8, stress: 10 }); return '你跳槽成功，工资翻了倍，加班也翻了倍。|You jumped — double the pay, double the overtime.'; }),
      O('用offer谈加薪|Use it to negotiate a raise', RC(.55, '老板给你涨了30%。|Your boss gave you a 30% raise.', { money: 0, happy: 5 }, '老板说：“那你去吧。”|Your boss said, "Then go."', { happy: -6 })),
      O('婉拒|Decline', R('你喜欢现在的团队。|You like your current team.', {}))
    ], { if: function (S, p) { return isJob(['coder', 'ai', 'pm', 'game'])(S, p) && p.job.perf >= 60; } }),
    E('j_farmer_drought', [18, 75], '旱灾|Drought', '☀️', '连续几个月没下雨，地里的庄稼快枯死了。|Months without rain — the crops are dying.', [
      O('连夜挑水浇地|Haul water all night', R('你累得腰都直不起来，保住了一半收成。|You broke your back and saved half the harvest.', { health: -5, money: -200 })),
      O('去城里打工|Go to the city for work', function (c) { G.career.leave(); G.career.hire(G.JOB.builder); c.p.tier = Math.max(2, c.p.tier - 1); return '你放下锄头，进城当了建筑工人。|You put down the hoe and became a construction worker in the city.'; }),
      O('求雨|Pray for rain', RC(.3, '第二天真的下雨了！村里人都说你是神仙。|It rained the next day! The village called you a miracle-worker.', { happy: 8, rep: 5 }, '天还是那么晴。|The sky stayed clear.', { happy: -5 }))
    ], { bad: 1, if: isJob(['farmer']) }),
    E('j_farmer_land', [25, 80], '土地流转|A Land Deal', '🌾', '一家农业公司想承包你家的地，每年给租金。|An agribusiness wants to lease your family\'s land for yearly rent.', [
      O('租出去|Lease it', function (c) { c.p.flags.landRent = 1; H.fx(c, { money: 2000 }); return '你拿到了第一年的租金，以后每年都有。|You got the first year\'s rent, with more each year.'; }),
      O('自己种|Keep farming it yourself', R('这片地是祖辈留下的，你舍不得。|Your ancestors worked this land; you can\'t let it go.', { happy: 3 }))
    ], { if: isJob(['farmer']), era: { g: 1990, cn: 2008 } }),
    E('j_driver_crash', [20, 70], '交通事故|Road Accident', '🚗', '一辆电动车突然冲出来，你猛踩刹车……|A scooter darts out; you slam the brakes...', [
      O('（屏住呼吸）|(Hold your breath)', function (c) { if (G.ch(.7)) return '车停住了，离对方只有半米。你出了一身冷汗。|You stopped half a meter away. Cold sweat.'; H.fx(c, { money: -3000, happy: -8 }); return '你撞上了，对方受了轻伤，你赔了一大笔钱。|You hit them; minor injuries, but a big payout.'; })
    ], { bad: 1, if: isJob(['driver', 'rider', 'courier']) }),
    E('j_rider_rain', [16, 60], '暴雨送餐|Delivering Through the Storm', '🌧️', '暴雨天，订单翻了三倍，平台给了双倍补贴。|In the downpour, orders tripled and the app offered double pay.', [
      O('冲！|Go for it!', function (c) { if (G.ch(.15)) { H.fx(c, { health: -12 }); return '你在积水里摔了一跤，受了伤。|You wiped out in a flooded street and got hurt.'; } H.fx(c, { money: 800 }); return '你一晚上挣了平时三天的钱。|You earned three days\' pay in one night.'; }),
      O('安全第一，收工|Safety first — clock out', R('你回家煮了碗面。|You went home and cooked noodles.', { happy: 2 }))
    ], { if: isJob(['rider', 'courier']) }),
    E('j_rider_review', [16, 60], '一个差评|One Bad Review', '⭐', '一个客人因为汤洒了一点，给了你差评，扣了你一天的钱。|A customer left a bad review because a little soup spilled — that costs you a day\'s pay.', [
      O('打电话求客人删评|Call and beg them to remove it', RC(.4, '客人心软，删了差评。|They relented and deleted it.', {}, '客人直接挂了电话。|They hung up on you.', { happy: -5 })),
      O('认了|Let it go', R('你在电动车上坐了很久。|You sat on your scooter for a long time.', { happy: -4, money: -100 }))
    ], { bad: 1, if: isJob(['rider']) }),
    E('j_chef_critic', [20, 65], '美食评论家|The Food Critic', '🍽️', '一位著名美食评论家今晚要来店里。|A famous food critic is coming to the restaurant tonight.', [
      O('亲自掌勺|Cook it yourself', async function (c) { var r = await c.game('rhythm', { name: '掌勺|At the Stove' }); if (r.win) { H.fx(c, { fame: 6, happy: 10 }); c.p.job.perf += 15; return '评论家给了满分，店门口排起了长队！|Full marks from the critic — lines out the door!'; } H.fx(c, { happy: -8 }); c.p.job.perf -= 10; return '评论家说“平平无奇”。|The critic called it "unremarkable."'; })
    ], { if: isJob(['chef']) }),
    E('j_sales_client', [22, 60], '酒桌上的生意|Business Over Drinks', '🍶', '大客户说：“喝完这一杯，合同就签。”|The big client says, "Finish this glass and I\'ll sign."', [
      O('一饮而尽|Down it', function (c) { H.fx(c, { drink: 8, health: -3, money: 3000 }); c.p.job.perf += 10; return '合同签了，你在厕所吐了半小时。|Contract signed. You threw up in the bathroom for half an hour.'; }),
      O('以茶代酒|Toast with tea instead', RC(.4, '客人欣赏你的原则，照样签了。|They respected your principles and signed anyway.', { rep: 3 }, '客人脸一沉，合同黄了。|Their face darkened. Deal\'s off.', { happy: -5 }))
    ], { if: isJob(['sales', 'agent', 'banker', 'consult', 'mkt']) }),
    E('j_agent_crash', [24, 60], '楼市寒冬|Housing Market Freeze', '🥶', '房价下跌，三个月没卖出一套房。|Prices are falling and you haven\'t sold a home in three months.', [
      O('咬牙坚持|Grit your teeth', R('你靠底薪熬着。|You scrape by on base pay.', { happy: -5, money: -500 })),
      O('转行|Switch careers', async function (c) { G.career.leave(); await G.career.search(c); return '你离开了中介行业。|You left real estate.'; })
    ], { bad: 1, if: function (S, p) { return isJob(['agent'])(S, p) && (S.world.hpi || 1) < 1.05; } }),
    E('j_lawyer_offer', [26, 65], '一个危险的委托|A Dangerous Client', '💼', '一位有黑道背景的大老板，开出天价律师费请你辩护。|A businessman with mob ties offers a fortune for your defense.', [
      O('接下|Take the case', function (c) { H.fx(c, { money: 30000, karma: -6 }); if (G.ch(.25)) { H.fx(c, { rep: -8, heat: 10 }); return '官司赢了，但你被同行看不起，还上了警方的名单。|You won, but colleagues sneer and the police took note of you.'; } return '官司赢了，律师费到账。|You won, and the fee cleared.'; }),
      O('拒绝|Refuse', R('你有自己的底线。|You have your limits.', { karma: 5 }))
    ], { if: isJob(['lawyer']) }),
    E('j_judge_bribe', [30, 70], '说情的人|Someone Asks a Favor', '⚖️', '一位老领导打来电话，希望你在某个案子上“高抬贵手”。|A former superior calls asking you to "go easy" on a certain case.', [
      O('依法判决|Rule by the law', R('你得罪了人，但睡得很安稳。|You made an enemy, but you sleep soundly.', { karma: 10, rep: 5 })),
      O('给个面子|Do him the favor', function (c) { H.fx(c, { karma: -10, money: 5000 }); if (G.ch(.3)) { c.p.job = null; G.crime.jail(6, '受贿罪|Bribery'); return '事情败露，你因受贿锒铛入狱。|It came out. You were jailed for bribery.'; } return '这个人情，以后有用。|A favor banked for later.'; })
    ], { if: isJob(['judge']) }),
    E('j_journo_threat', [22, 65], '你被跟踪了|You\'re Being Followed', '👤', '你发现最近总有一辆黑车跟着你。你正在调查的事情可能惹到了大人物。|A black car keeps following you. Your investigation may have angered someone powerful.', [
      O('继续调查|Keep digging', RC(.5, '报道发出后引起轩然大波，你获得了新闻大奖！|The story caused an uproar and won you a journalism award!', { fame: 10, karma: 8 }, '你被人打了一顿，报道也被压了下来。|You were beaten up and the story was buried.', { health: -15, happy: -10 })),
      O('放弃这个选题|Drop the story', R('你安全了，但心里过不去。|You\'re safe, but it eats at you.', { happy: -5 }))
    ], { bad: 1, if: isJob(['journo']) }),
    E('j_pilot_emergency', [25, 65], '空中险情|Emergency at 30,000 Feet', '✈️', '飞机一侧引擎突然起火！|An engine suddenly catches fire!', [
      O('冷静备降|Calmly divert and land', async function (c) { var r = await c.game('driving', { name: '迫降|Emergency Landing' }); if (r.win) { H.fx(c, { fame: 12, happy: 10, rep: 10 }); c.p.job.perf += 20; return '你成功迫降，全机乘客安然无恙。你成了全国英雄！|You landed safely with everyone unharmed. You\'re a national hero!'; } H.fx(c, { health: -20, happy: -15 }); return '飞机重重落地，有人受伤，你接受了调查。|A hard landing — injuries, and an investigation.'; })
    ], { bad: 1, if: isJob(['pilot']) }),
    E('j_attendant_drunk', [20, 50], '闹事的乘客|An Unruly Passenger', '🍷', '一位喝醉的乘客在机舱里大吵大闹，还对你动手动脚。|A drunk passenger is causing a scene and gets handsy with you.', [
      O('专业地制止|Shut it down professionally', R('机长通报后，乘客落地就被警察带走了。|The captain reported it; police met him at the gate.', { rep: 3 })),
      O('忍了|Put up with it', R('你回到厨房，偷偷哭了一场。|You went to the galley and cried quietly.', { happy: -8 }))
    ], { bad: 1, if: isJob(['attendant']) }),
    E('j_fire_big', [20, 55], '特大火灾|The Big Fire', '🔥', '化工厂起火，随时可能爆炸，里面还有工人被困。|A chemical plant is on fire and could explode — workers are trapped inside.', [
      O('冲进去救人|Go in after them', function (c) { if (G.ch(.1)) { G.die('殉职于火场|Died in the line of duty'); return '你把最后一名工人推出了火场，自己却没能出来……|You pushed the last worker out of the fire, but didn\'t make it out yourself...'; } H.fx(c, { fame: 10, karma: 15, health: -10 }); G.inc('hero'); return '你救出了三名工人，被授予了“英雄消防员”称号。|You rescued three workers and were named a Hero Firefighter.'; }),
      O('服从指挥，等待时机|Follow orders and wait', R('最终大家都平安撤出。|In the end everyone got out safely.', { stress: 10 }))
    ], { if: isJob(['fire']) }),
    E('j_vendor_inspect', [18, 70], '城管来了|The Inspectors Are Here', '🚔', '城管突击检查，你的摊位没有执照。|Surprise inspection — your stall has no license.', [
      O('推车就跑|Grab the cart and run', async function (c) { var r = await c.game('sprint', { name: '跑城管|Run!' }); if (r.win) return '你一溜烟跑没了影。|You vanished in a cloud of dust.'; H.fx(c, { money: -800, happy: -5 }); return '你被追上了，车被没收了。|They caught you and confiscated the cart.'; }),
      O('老实认罚，去办证|Pay the fine and get licensed', R('你交了罚款，办了正规手续。|You paid up and got properly licensed.', { money: -500, rep: 2 }))
    ], { bad: 1, if: isJob(['vendor']) }),
    E('j_factory_injury', [18, 60], '工伤|Injured on the Job', '🦾', '机器突然卡住，你的手被夹了一下。|The machine jams, and your hand gets caught.', [
      O('找厂里要赔偿|Demand compensation', RC(.55, '厂里赔了你一笔钱。|The factory paid you compensation.', { money: 3000, health: -8 }, '厂里说是你操作不当，一分没赔。|They blamed you and paid nothing.', { health: -8, happy: -8 })),
      O('忍着继续干|Keep working through it', R('伤口好了，但留下了疤。|It healed — with a scar.', { health: -10 }))
    ], { bad: 1, if: isJob(['factory', 'builder', 'mechanic']) }),
    E('j_factory_auto', [25, 60], '机器换人|Robots Replace Workers', '🤖', '工厂引进了自动化生产线，一半的工人要被裁掉。|The factory is automating; half the workers will be laid off.', [
      O('去学操作机器人|Train to operate the robots', RC(.55, '你成了车间里少数懂设备的人，还涨了工资。|You became one of few who can run the machines — with a raise.', { smarts: 2, money: 1500 }, '培训没通过，你被裁了。|You failed the training and were laid off.', { happy: -8 })),
      O('拿补偿走人|Take the severance', function (c) { c.money(c.$(4000)); G.career.leave(); return '你拿着补偿金离开了干了多年的工厂。|You left the factory with a severance check.'; })
    ], { bad: 1, if: isJob(['factory']), era: { g: 1990, cn: 2012 } }),
    E('j_svc_rude', [16, 60], '刁难的顾客|A Nightmare Customer', '😤', '一位顾客对你大吼大叫，要你下跪道歉。|A customer is screaming at you, demanding you kneel and apologize.', [
      O('据理力争|Stand your ground', RC(.5, '经理站在了你这边，把顾客请了出去。|The manager backed you and showed them out.', { rep: 3 }, '你被经理骂了一顿，还扣了工资。|The manager chewed you out and docked your pay.', { happy: -6, money: -100 })),
      O('鞠躬道歉|Bow and apologize', R('顾客满意地走了，你在仓库里哭了。|The customer left satisfied; you cried in the stockroom.', { happy: -6 })),
      O('拍视频发网上|Film it and post online', R('视频火了，网友都在骂那位顾客。|The video went viral; everyone online sided with you.', { fame: 3, happy: 4 }), { era: { g: 2008, cn: 2012 } })
    ], { bad: 1, if: isCat(['svc']) }),
    E('j_biz_ipo', [25, 55], '公司要上市了|Your Company Is Going Public', '🔔', '你所在的公司要上市了，你手里有一些期权。|Your employer is going public, and you hold some stock options.', [
      O('全部行权|Exercise everything', function (c) { var m = c.$(G.ri(2, 40) * 10000); if (G.ch(.7)) { c.money(m); c.prm.m = G.M(m); H.fx(c, { happy: 12 }); return '股价大涨，你的期权值{m}！|The stock soared — your options are worth {m}!'; } H.fx(c, { happy: -6 }); return '上市首日破发，你的期权一文不值。|It broke issue on day one; your options are worthless.'; }),
      O('卖掉一半落袋为安|Sell half to lock in gains', function (c) { var m = c.$(G.ri(1, 12) * 10000); c.money(m); c.prm.m = G.M(m); return '你稳稳地拿到了{m}。|You safely pocketed {m}.'; })
    ], { good: 1, if: isCat(['tech', 'biz']), era: { g: 1985, cn: 2000 } }),
    E('j_gov_audit', [25, 60], '审计风暴|The Auditors Arrive', '📑', '上级审计组进驻，你们部门的账目要被翻个底朝天。|An audit team arrives to comb through your department\'s books.', [
      O('坦然配合|Cooperate openly', R('你的账目干干净净，审计组还表扬了你。|Your books were spotless; the auditors praised you.', { rep: 4 })),
      O('连夜“整理”材料|"Tidy up" the files overnight', RC(.6, '有惊无险。|A close call.', { stress: 10 }, '被发现了，你被记了大过。|Caught — a serious mark on your record.', { rep: -10, happy: -10 }))
    ], { if: isCat(['gov']) }),
    E('j_design_client', [22, 60], '甲方爸爸|The Client from Hell', '🎨', '甲方要求：“五彩斑斓的黑，Logo放大的同时再缩小一点。”|The client wants "a colorful black, and make the logo bigger but also smaller."', [
      O('耐心沟通|Patiently talk it through', R('改了二十稿，终于定稿了。|Twenty revisions later, it\'s final.', { stress: 10, money: 500 })),
      O('拒绝这单|Fire the client', R('你说：“这单我不做了。”爽！|"I\'m out." It felt amazing.', { happy: 8, money: -500 }))
    ], { if: isJob(['design', 'archi', 'photo', 'mkt']) })
  ]);
})();
