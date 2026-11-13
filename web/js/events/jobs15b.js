/* Version 1.6 stories, part 2: office, professional and specialist careers — each with its own dilemmas,
   breakthroughs and temptations. */
(function () {
  "use strict";
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function J(ids) { return function (S, p) { return !!(p.job && ids.indexOf(p.job.id) >= 0 && !p.jail); }; }
  function JE(id, ids, a, title, icon, t, o, w) { return E(id, a, title, icon, t, o, { if: J(ids), w: w || 2.2 }); }
  function sm(c, k) { return function (cc) { return G.clamp(.25 + cc.p.st[k] / 160, .1, .9); }; }

  G.evs([
    /* ---------------- programmer / AI / games / product ---------------- */
    JE("jw_code_prod", ["coder", "ai", "game"], [20, 60], "凌晨两点的线上事故|Production Is Down at 2 a.m.", "💥", "凌晨两点，监控报警：核心服务全部宕机，每分钟损失几十万。|2 a.m. Alerts everywhere: the core service is down and losing money by the minute.", [
      O("冷静回滚上一个版本|Calmly roll back the last release", RC(sm(0, "smarts"), "十二分钟后服务恢复了。老板在群里发了一个大红包。|Service was back in twelve minutes. The boss posted a big red packet in the group chat.", { perf: 12, stress: 6 }, "回滚也失败了，你们折腾到天亮。|The rollback failed too; you fought it until dawn.", { stress: 15, health: -3, perf: 2 })),
      O("先在群里@所有人|Ping everyone in the group chat first", R("十个人一起上线，吵成了一锅粥，三小时后才修好。|Ten people logged on and argued; it took three hours to fix.", { stress: 10 })),
      O("假装没看见手机|Pretend you didn’t see the phone", R("第二天的复盘会上，你的名字被点了三次。|At the next day’s post-mortem your name came up three times.", { perf: -12 }))
    ]),
    JE("jw_code_open", ["coder", "ai"], [18, 60], "开源项目|An Open-Source Project", "🐙", "你业余写的一个小工具在开源网站上突然火了，收到了几千颗星。|A little tool you wrote on weekends suddenly takes off online — thousands of stars.", [
      O("继续维护，回复每个问题|Keep maintaining it, answer every issue", R("一家大公司的技术总监在邮件里说：“我们想挖你。”|A big company’s CTO emailed: “We’d like to hire you.”", { fame: 4, smarts: 3, perf: 8, stress: 5 })),
      O("接受赞助，做成产品|Take sponsorship and turn it into a product", RC(.35, "它变成了一家公司，你成了创始人。|It became a company — and you its founder.", { money: 30000, fame: 6, happy: 10 }, "赞助断了，项目也慢慢没人维护了。|The sponsorship dried up and the project faded.", { happy: -3 }))
    ]),
    JE("jw_code_996", ["coder", "game", "pm"], [20, 50], "连续三个月加班|Three Months of Overtime", "🌙", "项目上线前，你已经连续三个月每天工作到半夜。今天早上你在地铁上突然心慌。|Three months of working past midnight before launch. This morning on the subway, your heart starts racing.", [
      O("去医院检查，请几天假|See a doctor and take a few days off", R("医生说再这样下去就危险了。你第一次认真想了想工作的意义。|The doctor said you were close to the edge. For the first time you really thought about what the work was for.", { health: 6, stress: -15, perf: -4 })),
      O("喝杯咖啡继续|Have a coffee and keep going", RC(.7, "项目顺利上线，你拿到了一笔大奖金。|The launch went smoothly; you got a big bonus.", { money: 3000, health: -6, perf: 10 }, "你在工位上晕倒了，被同事送进了急诊。|You collapsed at your desk; coworkers took you to A&E.", { health: -20, stress: 10 }))
    ]),
    JE("jw_ai_model", ["ai"], [22, 60], "训练出来的怪东西|Something Strange in the Model", "🤖", "你训练的模型在测试中给出了一个谁都没教过它的答案——而且是对的。|In testing, your model gives an answer nobody ever taught it — and it’s right.", [
      O("写成论文发表|Publish it", RC(.45, "论文被顶级会议收录，同行纷纷引用。|It was accepted at a top conference and widely cited.", { fame: 6, smarts: 4, perf: 12 }, "审稿人说“结果无法复现”。|Reviewers said the result couldn’t be reproduced.", { happy: -4 })),
      O("先向安全团队报告|Report it to the safety team first", R("安全团队花了一个月研究这个现象。你被邀请进了公司的核心项目组。|The safety team studied it for a month and you were invited onto the core project.", { perf: 10, karma: 4, smarts: 2 }))
    ]),
    JE("jw_ai_poach", ["ai"], [22, 55], "天价挖角|An Astronomical Offer", "💰", "一家竞争对手开出了你现在三倍的年薪，外加大量股票。|A rival offers triple your salary plus a mountain of stock.", [
      O("跳槽|Jump ship", function (c) { var j = c.p.job; j.sal = Math.round(j.sal * G.rf(2.2, 3)); j.co = G.career.coName ? G.career.coName("tech") : j.co; j.perf = 55; H.fx(c, { happy: 10, stress: 6 }); return "你签了合同。原公司的老板沉默了很久，说“祝你好运”。|You signed. Your old boss was silent a long time, then said: “Good luck.”"; }),
      O("拿着offer去谈加薪|Use the offer to negotiate a raise", RC(.6, "公司给你加了五成薪水，还升了职。|Your company raised you fifty percent and promoted you.", { perf: 10, money: 2000 }, "老板说：“那你去吧。”|The boss said: “Then go.”", { perf: -10 })),
      O("留下，这里有我在乎的项目|Stay — the project matters to you", R("团队知道后，给你订了一个蛋糕。|When the team heard, they got you a cake.", { happy: 5, eq: 2 }))
    ]),
    JE("jw_game_launch", ["game"], [22, 55], "游戏上线日|Launch Day", "🎮", "你设计了三年的游戏今天上线。评论区一开始全是差评：服务器炸了。|The game you designed for three years launches today. The first reviews are all negative: the servers crashed.", [
      O("连夜写公开道歉信，送玩家补偿|Write an open apology overnight and compensate players", RC(.6, "玩家被你的诚意打动，评分从两星涨到了四星半。|Players were won over; the rating climbed from two stars to four and a half.", { fame: 5, perf: 12, eq: 3 }, "差评太多，游戏三个月后停服。|Too many bad reviews; the game shut down in three months.", { happy: -12 })),
      O("等服务器修好再说|Wait for the servers to be fixed", R("评分停在了三星。|The rating settled at three stars.", { perf: 2 }))
    ]),
    JE("jw_pm_feature", ["pm"], [22, 60], "老板的新需求|The Boss’s New Idea", "📝", "上线前一天，老板突然要求加一个全新的功能。|The day before launch, the boss suddenly wants a brand-new feature.", [
      O("用数据说服他推迟|Persuade him with data to wait", RC(sm(0, "eq"), "他同意了。新功能在下个版本上线，反响很好。|He agreed. The feature shipped next version to great feedback.", { perf: 10, eq: 2 }, "他说“我不要听理由”。|“I don’t want excuses,” he said.", { stress: 8 })),
      O("带着团队通宵赶出来|Pull an all-nighter with the team", RC(.5, "上线顺利，老板在全员大会上表扬了你。|The launch went fine; the boss praised you at the all-hands.", { perf: 12, health: -4 }, "新功能有严重bug，被用户骂上了热搜。|It shipped with a serious bug and trended for all the wrong reasons.", { perf: -10, stress: 10 }))
    ]),

    /* ---------------- accountant / banker / quant / consultant ---------------- */
    JE("jw_acct_cook", ["acct"], [22, 65], "做账|Cooking the Books", "🧾", "财务总监让你把一笔亏损“挪到下个季度”。|The finance director tells you to “move” a loss into next quarter.", [
      O("拒绝，按准则做|Refuse and follow the standards", RC(.6, "审计来的时候，公司因为你的账干净而顺利过关。总监被换掉了，你升了职。|When the auditors came, your clean books saved the company. The director was replaced; you were promoted.", { perf: 15, karma: 6 }, "你被调去管档案室。|You were moved to the archive room.", { perf: -15, karma: 6 })),
      O("照做，但留下记录|Do it, but keep records", R("三年后公司出事，你的记录让你成了证人而不是被告。|Three years later the company collapsed; your records made you a witness, not a defendant.", { smarts: 3, karma: -2 })),
      O("照做|Just do it", RC(.6, "没人发现。总监给你加了薪。|No one noticed. The director gave you a raise.", { money: 1000, karma: -6 }, "审计查出问题，你被列为共犯。|The auditors found it and named you as an accomplice.", { karma: -6, perf: -30, stress: 20 }))
    ]),
    JE("jw_acct_tax", ["acct"], [22, 65], "报税季|Tax Season", "📊", "报税季，你一周要处理两百份申报。|Tax season: two hundred returns this week.", [
      O("开发一个自动化表格|Build an automated spreadsheet", R("效率提高了三倍，同事们抢着用你的模板。|Productivity tripled; everyone wanted your template.", { smarts: 3, perf: 10 })),
      O("熬夜硬扛|Grind through the nights", R("你按时交完了，然后病了一周。|You finished on time — then were ill for a week.", { perf: 4, health: -6 }))
    ]),
    JE("jw_bank_ipo", ["banker"], [23, 60], "上市项目|The IPO Deal", "🔔", "你负责的上市项目到了最后一周，客户的财务数据有一处说不清楚的地方。|Final week of your IPO deal, and there’s an unexplained hole in the client’s numbers.", [
      O("要求客户解释清楚|Make the client explain it", RC(.55, "客户补充了材料，项目顺利上市，你拿到了七位数的奖金。|The client provided the documents; the IPO went through and your bonus had seven figures.", { money: 120000, perf: 15, stress: 8 }, "客户撤回了项目，你的团队白忙了一年。|The client pulled the deal; a year’s work wasted.", { perf: -8, stress: 10 })),
      O("赶时间，先放过去|No time — let it slide", RC(.6, "上市成功，奖金到手。|The IPO succeeded and the bonus landed.", { money: 120000, karma: -4 }, "上市半年后爆雷，监管找上了你。|Six months after listing it imploded, and regulators came for you.", { perf: -40, karma: -6, stress: 25 }))
    ]),
    JE("jw_bank_hours", ["banker", "consult"], [22, 45], "一百小时的一周|A Hundred-Hour Week", "⏰", "这已经是你本月第三个一百小时的工作周了。今天是你父亲的生日。|Your third hundred-hour week this month. Today is your father’s birthday.", [
      O("请两小时假回家吃饭|Take two hours off for dinner", R("老爸很高兴，你回去后加班到凌晨四点。|Dad was delighted; you worked till 4 a.m. after.", { par: 6, happy: 5, health: -2 })),
      O("视频通话说生日快乐|Video-call happy birthday", R("老爸说：“没事，工作要紧。”你挂了电话愣了很久。|Dad said: “It’s fine, work comes first.” You sat staring after the call.", { par: 1, stress: 4 }))
    ]),
    JE("jw_quant_bug", ["quant"], [23, 60], "策略里的bug|A Bug in the Strategy", "📉", "你发现自己写的交易策略有一个bug，过去三个月它一直在赚钱——但完全是因为运气。|You find a bug in your trading strategy. It’s been making money for three months — purely by luck.", [
      O("马上报告并停掉|Report it and shut it down", R("基金经理很欣赏你的诚实，把一个更大的策略交给了你。|The PM valued your honesty and gave you a bigger book.", { perf: 12, karma: 6 })),
      O("悄悄修好，不提|Quietly fix it and say nothing", RC(.7, "没人发现，策略继续赚钱。|No one noticed; the strategy kept making money.", { money: 2000 }, "风控发现了，你被调离了交易组。|Risk found it; you were moved off the desk.", { perf: -20 }))
    ]),
    JE("jw_quant_crash", ["quant", "banker"], [23, 65], "闪崩|Flash Crash", "⚡", "市场在三分钟内暴跌了百分之十。所有人都在看着你。|The market drops ten percent in three minutes. Everyone is looking at you.", [
      O("冷静，坚持模型|Stay calm and trust the model", RC(.5, "市场二十分钟后反弹，你的组当天赚了一大笔。|The market rebounded in twenty minutes; your desk made a fortune that day.", { perf: 15, money: 10000, fame: 1 }, "市场没有反弹，你的组亏损惨重。|It didn’t bounce; your desk lost heavily.", { perf: -15, stress: 20 })),
      O("立刻全部平仓|Close every position now", R("你止住了损失，但错过了反弹。|You stopped the bleeding but missed the rebound.", { perf: 2 }))
    ]),
    JE("jw_consult_deck", ["consult"], [22, 55], "CEO的提问|The CEO’s Question", "📽️", "汇报会上，客户CEO打断你：“这些建议，你们去年也给过别的公司吧？”|Mid-presentation, the client’s CEO interrupts: “Didn’t you give another company these same recommendations last year?”", [
      O("坦诚回答并给出针对性分析|Answer honestly and give a tailored analysis", RC(sm(0, "smarts"), "CEO点点头：“这才是我要的。”续约了三年。|The CEO nodded: “That’s what I wanted.” He renewed for three years.", { perf: 15, eq: 3 }, "CEO不太满意，项目缩减了一半。|He wasn’t satisfied; the project was cut in half.", { perf: -6 })),
      O("巧妙转移话题|Deftly change the subject", R("会议继续了，但你感觉他不再信任你们了。|The meeting went on, but you sensed he no longer trusted you.", { perf: -2 }))
    ]),

    /* ---------------- marketing / HR / PR ---------------- */
    JE("jw_mkt_viral", ["mkt"], [21, 60], "一个大胆的创意|A Bold Idea", "💡", "你提出了一个很大胆的营销创意：让公司CEO亲自在街头卖产品。|You pitch a bold campaign: the CEO selling the product on the street himself.", [
      O("坚持推动|Push it through", RC(.45, "视频刷屏了，产品一周卖断货。|The video swept the internet; the product sold out in a week.", { perf: 15, fame: 3, money: 1500 }, "CEO觉得丢面子，项目被毙了。|The CEO felt humiliated and killed it.", { perf: -5 })),
      O("改成更保守的方案|Tone it down", R("效果中规中矩。|Results were respectable.", { perf: 3 }))
    ]),
    JE("jw_hr_layoff", ["hr"], [22, 60], "裁员名单|The Layoff List", "📋", "公司要裁员两成，名单要你来拟。名单上有一个刚生完孩子的同事。|The company is cutting a fifth of staff, and you must draw up the list. A colleague just back from maternity leave is on it.", [
      O("据理力争保住她|Fight to keep her", RC(.5, "她留下了。后来她成了部门里最拼的人。|She stayed — and became the hardest worker in the department.", { karma: 8, eq: 3 }, "上面坚持，你只能为她争取到最好的补偿。|Management insisted; you got her the best severance you could.", { karma: 5 })),
      O("按规定执行|Follow the rules", R("你告诉她的时候，她没有哭，只是问能不能把孩子的照片带走。|When you told her she didn’t cry — just asked if she could take her baby’s photo with her.", { karma: -3, stress: 8 }))
    ]),
    JE("jw_hr_hire", ["hr"], [22, 60], "不一样的简历|An Unusual CV", "📄", "一份简历学历很普通，但附了一个惊艳的作品集。|A CV with a modest degree — and a stunning portfolio attached.", [
      O("坚持给面试机会|Insist on an interview", R("这个人后来成了公司最年轻的总监，逢人就说是你发现了他。|They became the company’s youngest director and told everyone you discovered them.", { perf: 10, karma: 3 })),
      O("按学历筛掉|Screen it out by degree", R("你后来在新闻里看到了这个人的名字：他在竞争对手那里大放异彩。|You later saw the name in the news — shining at a competitor.", { perf: -3 }))
    ]),
    JE("jw_pr_crisis", ["pr"], [22, 60], "热搜第一|Number One Trending", "🔥", "公司高管的不当言论上了热搜第一。你只有一个小时。|An executive’s offensive remark is the top trending topic. You have one hour.", [
      O("真诚道歉，承认错误|A sincere apology, owning it", RC(.65, "舆论在两天后平息，甚至有人夸公司“有担当”。|It died down in two days; some even praised the company for owning up.", { perf: 12, eq: 3 }, "道歉被认为不够诚恳，越闹越大。|The apology seemed insincere and it got worse.", { perf: -8, stress: 12 })),
      O("找人删帖压热搜|Get posts deleted and bury it", RC(.4, "热搜下去了。|It dropped off the charts.", { perf: 4, karma: -5 }, "删帖被曝光，事件升级为全网声讨。|The deletions were exposed and it became a nationwide pile-on.", { perf: -15, karma: -5, stress: 15 }))
    ]),

    /* ---------------- medicine ---------------- */
    JE("jw_doc_misdiag", ["doctor", "surgeon"], [26, 70], "被推翻的诊断|An Overturned Diagnosis", "🩺", "你发现自己上个月的一个诊断可能是错的，病人还在按你开的药吃。|You realise a diagnosis you made last month may be wrong — and the patient is still taking your prescription.", [
      O("立刻打电话叫病人回来|Call the patient back at once", R("病人及时调整了治疗。他说：“谢谢你没有瞒着我。”|The patient’s treatment was corrected in time. He said: “Thank you for not hiding it.”", { karma: 10, perf: 4 })),
      O("等复诊时再悄悄调整|Quietly adjust at the next visit", RC(.7, "没有出什么问题。|Nothing came of it.", { karma: -3 }, "病情恶化，家属告了医院。|The patient worsened; the family sued.", { perf: -20, karma: -6, stress: 20 }))
    ]),
    JE("jw_doc_vip", ["doctor", "surgeon"], [28, 70], "插队的大人物|A VIP Jumps the Queue", "🏥", "院长打来电话：一位大人物要插队做手术，排在一个等了三个月的农民前面。|The hospital director calls: a powerful man wants to jump ahead of a farmer who has waited three months for surgery.", [
      O("坚持按顺序|Stick to the order", RC(.5, "大人物最后被说服了。农民出院时给你送来一袋自家种的米。|The VIP was talked round. The farmer left you a sack of his own rice.", { karma: 10 }, "你被调去了门诊。|You were moved to outpatients.", { karma: 10, perf: -10 })),
      O("加班两台都做|Work late and do both", R("你连续站了十四个小时，两台手术都很成功。|Fourteen hours on your feet — both operations went perfectly.", { perf: 10, health: -5 }))
    ]),
    JE("jw_surgeon_hard", ["surgeon"], [30, 70], "没人敢做的手术|The Operation No One Will Do", "🔪", "一个罕见病例，全国只有你可能做得了这台手术，成功率三成。|A rare case: you may be the only surgeon in the country who can attempt it. Thirty percent odds.", [
      O("做|Operate", RC(.45, "手术持续了十九个小时。病人醒来的那一刻，整个手术室都在鼓掌。你的病例写进了教科书。|Nineteen hours. When the patient woke, the whole theatre applauded. The case went into the textbooks.", { fame: 10, perf: 20, happy: 12, smarts: 3 }, "病人没能挺过来。家属握着你的手说：“谢谢你试过。”|The patient didn’t make it. The family held your hand: “Thank you for trying.”", { happy: -12, stress: 15 })),
      O("推荐去国外|Refer them abroad", R("病人在国外做了手术，结果不错。|The operation abroad went well.", { eq: 2 }))
    ], 1.5),
    JE("jw_nurse_night", ["nurse"], [20, 65], "夜班的病人|The Night-Shift Patient", "🌙", "夜班时，一位临终的老人拉着你的手说：“陪我一会儿，我儿子在国外赶不回来。”|On night shift a dying old man takes your hand: “Stay with me a little. My son is abroad and can’t make it.”", [
      O("坐下来陪他|Sit with him", R("你握着他的手，直到天亮。他的儿子后来专门写信谢谢你。|You held his hand until dawn. His son later wrote to thank you.", { karma: 10, eq: 4, happy: -3 })),
      O("还有很多病人要照顾|There are other patients to see", R("你每隔十分钟就回来看看他。|You came back every ten minutes.", { karma: 4 }))
    ]),
    JE("jw_nurse_epidemic", ["nurse", "doctor"], [22, 60], "隔离病房|The Isolation Ward", "😷", "传染病房缺人，护士长问谁愿意去。|The isolation ward is short-staffed. The head nurse asks for volunteers.", [
      O("举手|Raise your hand", RC(.85, "你在隔离病房工作了两个月，平安归来。医院给你记了一等功。|Two months on the ward, and you came home safe. The hospital awarded you first-class merit.", { karma: 12, fame: 4, perf: 15 }, "你被感染了，在病床上躺了一个月。|You caught it and spent a month in bed.", { health: -25, karma: 12, fame: 4 })),
      O("家里有孩子，不去|You have kids at home — no", R("护士长理解地点点头。|The head nurse nodded understandingly.", {}))
    ]),
    JE("jw_pharm_fake", ["pharm"], [22, 65], "可疑的处方|A Suspicious Prescription", "💊", "一个年轻人拿着一张处方来买大量止痛药，处方上的签名看起来不太对。|A young man brings a prescription for a large amount of painkillers. The signature looks off.", [
      O("打电话核实|Call to verify", R("处方是伪造的。你报了警，也帮他联系了戒断机构。|It was forged. You called the police — and helped him find a recovery programme.", { karma: 8, perf: 6 })),
      O("照方配药|Fill it", R("一个月后，警察来调查一起药物过量的案子。|A month later police came about an overdose.", { karma: -8, stress: 10 }))
    ]),
    JE("jw_vet_dog", ["vet"], [22, 70], "付不起的手术费|A Fee They Can’t Pay", "🐶", "一个小女孩抱着被车撞伤的狗跑进诊所，她只有零花钱。|A little girl runs in carrying her dog, hit by a car. She has only her pocket money.", [
      O("先救，钱以后再说|Save it first; money later", R("狗活下来了。小女孩每个月都来，把零花钱一点点还给你。|The dog lived. Every month she came to pay you back from her allowance.", { karma: 10, happy: 8 })),
      O("按规定先交押金|Deposit first, as the rules say", R("她跑回家找大人。你心里一直惦记着。|She ran home for an adult. You couldn’t stop thinking about it.", { stress: 4 }))
    ]),
    JE("jw_psych_secret", ["psych"], [24, 70], "保密的边界|The Limits of Confidentiality", "🛋️", "一位来访者说出了伤害他人的具体计划。|A client describes a specific plan to hurt someone.", [
      O("依法打破保密，通知相关方|Break confidentiality as the law requires", R("悲剧被阻止了。来访者后来接受了治疗，写信感谢你。|A tragedy was prevented. The client went into treatment and later wrote to thank you.", { karma: 10, perf: 6 })),
      O("继续咨询，试图化解|Keep working with them to defuse it", RC(.5, "你成功地让他放弃了计划。|You talked him out of it.", { eq: 4 }, "你没能阻止他。你从此再也没睡过一个好觉。|You couldn’t stop him. You never slept well again.", { happy: -20, stress: 25 }))
    ]),

    /* ---------------- law ---------------- */
    JE("jw_law_innocent", ["lawyer"], [24, 70], "无罪的当事人|An Innocent Client", "⚖️", "你接了一个法律援助案件。所有证据都对当事人不利，但你相信他是无辜的。|A legal-aid case. All the evidence is against your client, but you believe he’s innocent.", [
      O("自费调查|Investigate at your own expense", RC(sm(0, "smarts"), "你找到了一段被忽略的监控，他被当庭释放。媒体称你为“良心律师”。|You found overlooked CCTV and he walked free in court. The press called you “the conscience of the bar”.", { fame: 8, karma: 12, perf: 15, money: -1000 }, "你尽了全力，但他还是被判了刑。你在上诉。|You did everything, but he was convicted. You’re appealing.", { happy: -8, money: -1000 })),
      O("劝他认罪换取减刑|Advise a plea for a lighter sentence", R("他认了罪，判了三年。你不知道自己做的对不对。|He pleaded and got three years. You’re not sure you did right.", { stress: 8 }))
    ]),
    JE("jw_law_bigclient", ["lawyer"], [26, 70], "大客户|The Big Client", "🏢", "一家大公司想请你代理一起环境污染案——作为被告方。报酬是你三年的收入。|A big company wants you to defend it in a pollution case. The fee equals three years’ income.", [
      O("接|Take it", RC(.6, "你打赢了。钱很多，但你回家路过那条河时，总要别过头去。|You won. The money was huge, but you always looked away when you passed that river.", { money: 60000, karma: -8, perf: 10 }, "你输了，客户拒付尾款。|You lost, and the client refused the final payment.", { money: 15000, karma: -8 })),
      O("拒绝，转而代理受害村民|Decline — represent the villagers instead", RC(.4, "你打赢了这场以小搏大的官司。全国的媒体都来采访你。|You won the David-and-Goliath case; national media wanted interviews.", { fame: 10, karma: 15, money: 5000 }, "官司拖了五年，还没有结果。|The case has dragged on for five years.", { karma: 10, stress: 10 }))
    ]),
    JE("jw_judge_bribe", ["judge"], [30, 75], "一个信封|An Envelope", "✉️", "开庭前一晚，一个信封被塞进了你家的门缝。|The night before a hearing, an envelope is slipped under your door.", [
      O("原封不动交给纪委|Hand it unopened to the disciplinary office", R("行贿者被立案调查。你在法官圈子里有了“铁面”的名声。|The briber was investigated. Among judges you earned the name “Iron Face”.", { karma: 12, fame: 3, perf: 10 })),
      O("收下|Keep it", RC(.5, "判决按对方的意思下了。|You ruled as they wanted.", { money: 20000, karma: -15 }, "这是一次钓鱼执法。|It was a sting.", { karma: -15, perf: -50, stress: 30 }))
    ]),
    JE("jw_judge_hard", ["judge"], [30, 75], "情与法|Law and Mercy", "🔨", "被告是一个为了给母亲治病而偷药的年轻人。法律条文很清楚。|The defendant stole medicine to treat his mother. The law is clear.", [
      O("依法判决，但给出最低刑期并缓刑|Rule by the law, but the minimum and suspended", R("判决书里你写了一段话，被很多人转发：“法律不外乎人情。”|A paragraph you wrote in the ruling went viral: “The law is not above humanity.”", { fame: 4, karma: 8 })),
      O("严格按条文判|Apply the full letter of the law", R("判决无可挑剔。那个年轻人在法庭上哭了。|The ruling was flawless. The young man wept in court.", { perf: 4, karma: -2 }))
    ]),

    /* ---------------- teaching / academia ---------------- */
    JE("jw_teach_bully", ["teacher"], [22, 65], "被欺负的学生|A Bullied Student", "🏫", "你发现班上一个安静的学生总是被几个同学欺负。|You notice a quiet student in your class is always being picked on.", [
      O("找所有人谈话，严肃处理|Talk to everyone and deal with it firmly", R("欺负停止了。十年后，那个学生成了一名老师，他说是因为你。|The bullying stopped. Ten years later the student became a teacher — because of you, he said.", { karma: 10, eq: 3 })),
      O("私下多关照那个学生|Quietly look after the student", R("他开始愿意在课上发言了。|He began to speak up in class.", { karma: 5 }))
    ]),
    JE("jw_teach_gift", ["teacher"], [22, 65], "家长的礼物|A Parent’s Gift", "🎁", "教师节，一位家长送来一个包装精致的礼盒，里面是一张购物卡。|On Teachers’ Day a parent brings an elegant box — with a shopping card inside.", [
      O("婉拒，只收下孩子画的贺卡|Decline, keep only the child’s card", R("那张贺卡你一直贴在办公桌上。|You kept the card pinned on your desk for years.", { karma: 6, happy: 3 })),
      O("收下|Accept it", RC(.7, "没人说什么。|No one said anything.", { money: 200, karma: -3 }, "别的家长举报了你，你挨了处分。|Another parent reported you and you were disciplined.", { karma: -3, perf: -10 }))
    ]),
    JE("jw_teach_exam", ["teacher"], [22, 65], "毕业班|The Graduating Class", "🎓", "你带的毕业班基础很差，校长说“升学率就看你了”。|Your graduating class is weak, and the principal says the school’s results are on you.", [
      O("每晚义务辅导|Tutor them free every evening", RC(.6, "那一年，你的班创造了学校的历史最好成绩。|That year your class set the school’s best-ever results.", { perf: 15, fame: 2, health: -4, happy: 8 }, "成绩提高了一些，但没达到校长的期望。|Results improved, but not enough for the principal.", { perf: 2, health: -4 })),
      O("只抓尖子生|Focus only on the top students", R("升学率上去了，但有几个学生再也没跟你说过话。|Results rose, but a few students never spoke to you again.", { perf: 8, karma: -4 }))
    ]),
    JE("jw_prof_student", ["prof", "lecturer"], [28, 75], "天才学生|A Brilliant Student", "🧑‍🎓", "你的一个学生提出了一个超越你研究的想法。|One of your students proposes an idea that goes beyond your own research.", [
      O("全力支持，让她当第一作者|Back her fully — she’s first author", R("论文发表在顶级期刊上。多年后她成了院士，在获奖感言里第一个感谢的是你。|It appeared in a top journal. Years later, as an academician, she thanked you first in her speech.", { karma: 10, fame: 5, perf: 10 })),
      O("把自己列为第一作者|List yourself as first author", RC(.6, "论文为你赢得了大奖。|It won you a major award.", { fame: 6, perf: 12, karma: -8 }, "学生公开了邮件记录，你名誉扫地。|The student published the emails; your reputation was ruined.", { fame: -10, perf: -20, karma: -8 }))
    ]),
    JE("jw_prof_grant", ["prof", "sci", "rnd"], [28, 75], "基金申请|The Grant Application", "🧪", "国家重点项目的申请截止前一周，你的数据还差一组关键实验。|A week before the big national grant deadline, you’re missing one key experiment.", [
      O("通宵做实验|Run it all night", RC(.55, "数据很漂亮，项目批下来了，经费五百万。|The data was beautiful; you won a multimillion grant.", { perf: 15, money: 5000, health: -4 }, "实验失败了，申请错过了截止日。|The experiment failed and you missed the deadline.", { stress: 12 })),
      O("“美化”一下数据|“Polish” the data", RC(.5, "项目批了。|You got the grant.", { perf: 10, karma: -10 }, "评审专家发现了问题，你被禁止申请五年。|A reviewer spotted it; you were banned from applying for five years.", { perf: -30, karma: -10, fame: -5 }))
    ]),
    JE("jw_sci_discovery", ["sci", "rnd"], [24, 75], "意外的发现|An Accidental Discovery", "🔬", "实验做错了一步，却得到了一个完全意想不到的结果。|You botched a step and got a completely unexpected result.", [
      O("顺着这个错误深挖|Dig into the mistake", RC(.35, "你发现了一种全新的材料。三年后，它被用在了每一部手机里。|You found an entirely new material. Three years later it was in every phone.", { fame: 12, smarts: 5, perf: 20, money: 20000 }, "挖了半年，只是一个污染。|Six months later: just contamination.", { stress: 6 })),
      O("重做，按计划来|Redo it and stick to the plan", R("项目按时完成了。|The project finished on time.", { perf: 4 }))
    ]),
    JE("jw_sci_conference", ["sci", "prof", "rnd", "econ", "think"], [26, 75], "国际会议|An International Conference", "🌐", "你被邀请在一个国际会议上做主题报告。|You’re invited to give a keynote at an international conference.", [
      O("精心准备|Prepare meticulously", RC(sm(0, "eq"), "报告结束时全场起立鼓掌，三所名校向你发出了邀请。|A standing ovation; three top universities sent you invitations.", { fame: 6, perf: 12, happy: 8 }, "你紧张得忘了词，但问答环节表现不错。|Nerves made you lose your place, but the Q&A went well.", { perf: 3 })),
      O("派学生去讲|Send a student instead", R("学生讲得很好，你在台下比自己讲还紧张。|Your student did brilliantly; you were more nervous than if you’d spoken.", { karma: 3 }))
    ]),

    /* ---------------- engineering / architecture / design ---------------- */
    JE("jw_engr_crack", ["engr", "archi"], [24, 70], "图纸上的裂缝|A Crack on the Drawings", "🌉", "你在复核一座桥的设计时，发现了一个可能导致结构问题的计算错误。项目明天开工。|Checking a bridge design, you find a calculation error that could cause structural failure. Construction starts tomorrow.", [
      O("坚持叫停|Insist on stopping work", R("开工推迟了一个月。二十年后那座桥依然稳稳地立着。|Work was delayed a month. Twenty years later the bridge still stands firm.", { karma: 12, perf: 10 })),
      O("改一下数据，先开工|Tweak the numbers and start", RC(.6, "什么都没发生。|Nothing happened.", { karma: -6 }, "桥在通车第三年出现了裂缝，你被追责。|Cracks appeared in year three; you were held responsible.", { karma: -10, perf: -40, stress: 25 }))
    ]),
    JE("jw_archi_competition", ["archi"], [25, 70], "设计竞赛|The Design Competition", "🏛️", "一座城市的新地标在国际招标，你的事务所只是一个小团队。|A city’s new landmark is open to international bids. Your firm is tiny.", [
      O("全力参赛|Go all in", RC(.25, "你的方案击败了所有大牌事务所。开幕那天，市长亲自为你剪彩。|Your design beat every famous firm. On opening day the mayor cut the ribbon beside you.", { fame: 15, money: 30000, perf: 20, happy: 15 }, "你进了前五，但最后输给了一家国际大所。|You made the top five but lost to a global firm.", { fame: 2, perf: 5 })),
      O("量力而行，不参加|Know your limits; skip it", R("你接了几个小住宅项目。|You took some small houses instead.", {}))
    ]),
    JE("jw_design_steal", ["design"], [22, 60], "被抄袭的设计|A Stolen Design", "🎨", "你发现一个大品牌的新广告用的正是你去年的作品。|A major brand’s new ad uses your work from last year.", [
      O("公开发声|Call them out publicly", RC(.55, "网友站在你这边，品牌公开道歉并支付了赔偿。|The internet backed you; the brand apologised and paid up.", { fame: 6, money: 3000, happy: 6 }, "品牌说是“巧合”，网友吵了两天就散了。|They called it a coincidence; the outrage faded in two days.", { happy: -5 })),
      O("发律师函|Send a lawyer’s letter", R("对方私下和解，赔偿不少，但要求你保密。|They settled privately for a good sum — on condition of silence.", { money: 2000 }))
    ]),

    /* ---------------- media / photography / translation ---------------- */
    JE("jw_journo_scoop", ["journo"], [22, 65], "独家线索|An Exclusive Tip", "📰", "一位匿名者给你寄来一份文件，显示一家大企业在偷排污水。|An anonymous source sends documents showing a big company secretly dumping waste.", [
      O("深入调查后发表|Investigate thoroughly, then publish", RC(sm(0, "smarts"), "报道引起全国轰动，企业被重罚。你拿到了新闻奖。|The story caused a national sensation; the company was fined heavily. You won a journalism prize.", { fame: 10, karma: 10, perf: 15 }, "企业起诉你诽谤，报社撤回了报道。|The company sued for libel; your paper retracted the story.", { perf: -10, stress: 15 })),
      O("拿着文件找企业“谈谈”|Take the documents to the company for a “talk”", RC(.6, "企业给了你一大笔“封口费”。|They paid you a lot to stay quiet.", { money: 15000, karma: -15 }, "企业录了音，你因敲诈被捕。|They recorded you; you were arrested for extortion.", { karma: -15, perf: -50, stress: 30 }))
    ]),
    JE("jw_journo_war", ["journo", "photo"], [24, 55], "战地|The Front Line", "🎖️", "一个国家爆发了冲突，报社问谁愿意去前线报道。|Conflict breaks out abroad. The paper asks who will go to the front line.", [
      O("我去|I’ll go", RC(.75, "你的报道让全世界看到了平民的苦难。你平安回来了，但很久都睡不好。|Your reports showed the world what civilians suffered. You came home safe but couldn’t sleep for months.", { fame: 12, karma: 8, stress: 20, perf: 15 }, "你在一次炮击中受了重伤。|You were badly wounded in a bombardment.", { health: -35, fame: 8 })),
      O("家里需要我|My family needs me", R("一个年轻同事去了。你每天都在看他的报道。|A young colleague went. You read his dispatches every day.", {}))
    ], 1.2),
    JE("jw_photo_moment", ["photo"], [20, 70], "决定性瞬间|The Decisive Moment", "📷", "你在街头拍到了一张很特别的照片：一个老人在废墟前喂一只猫。|On the street you capture something special: an old man feeding a cat in front of ruins.", [
      O("投稿国际摄影大赛|Enter it in an international competition", RC(.3, "照片获得了年度大奖，被全世界的媒体转载。|It won Photo of the Year and was reprinted worldwide.", { fame: 12, money: 5000, happy: 12 }, "照片入围了，但没有获奖。|It was shortlisted but didn’t win.", { fame: 2 })),
      O("找到老人，送他一张冲洗好的照片|Find the old man and give him a print", R("他把照片装进相框，挂在了临时住所里。|He framed it and hung it in his temporary home.", { karma: 6, happy: 5 }))
    ]),
    JE("jw_photo_celeb", ["photo"], [20, 60], "拍到了明星|Catching a Star", "🤳", "你偶然拍到了一位已婚明星和别人亲密的照片。狗仔队开价二十万。|You accidentally photograph a married star getting intimate with someone else. A tabloid offers a fortune.", [
      O("卖给狗仔|Sell it", R("照片上了头条，那位明星的婚姻破裂了。|It made headlines and the star’s marriage ended.", { money: 25000, karma: -8 })),
      O("删掉|Delete it", R("你觉得，那不是你该拍的东西。|It wasn’t yours to take, you felt.", { karma: 5 })),
      O("联系明星本人|Contact the star directly", RC(.5, "明星非常感激，后来请你做了他的私人摄影师。|Grateful, the star later hired you as personal photographer.", { money: 8000, fame: 3 }, "明星的经纪人以为你在勒索，报了警。|The agent thought it was blackmail and called the police.", { stress: 15 }))
    ]),
    JE("jw_transl_summit", ["transl", "diplomat"], [22, 70], "峰会同传|Interpreting at a Summit", "🎧", "两国领导人会谈时，一方说了一个只有本国人才懂的俚语。你只有一秒钟。|At a leaders’ summit, one side uses a slang phrase only locals would understand. You have one second.", [
      O("意译，传达真正的意思|Translate the meaning, not the words", RC(sm(0, "eq"), "对方领导人会心一笑，会谈气氛轻松了很多。|The other leader smiled knowingly; the room relaxed.", { perf: 15, fame: 3 }, "意思传达得有点偏差，引起了小小的误会。|The nuance slipped and caused a small misunderstanding.", { perf: -6, stress: 10 })),
      O("直译|Translate literally", R("对方一脸困惑。你看见自己的上司在摇头。|The other side looked baffled. Your boss shook his head.", { perf: -4 }))
    ]),

    /* ---------------- pilot / diplomat ---------------- */
    JE("jw_pilot_engine", ["pilot"], [25, 65], "单发失效|Engine Failure", "🛫", "起飞两分钟后，一侧发动机起火。机上有两百三十名乘客。|Two minutes after take-off an engine catches fire. 230 passengers on board.", [
      O("按程序处置，返航迫降|Follow procedure and return to land", RC(.85, "飞机平安落地，乘客们在舱内鼓掌。你上了新闻。|The plane landed safely and the cabin applauded. You made the news.", { fame: 8, perf: 20, karma: 8, stress: 15 }, "迫降时起落架断裂，所幸无人死亡。|The landing gear collapsed on touchdown, but no one died.", { stress: 30, perf: 5, fame: 4 })),
      O("就近河面迫降|Ditch in the river", RC(.6, "你成功在河面迫降，所有人都活了下来。他们称之为“河上奇迹”。|You landed on the river and everyone survived. They called it the Miracle on the River.", { fame: 20, karma: 12, perf: 25 }, "迫降时机身断裂，有人受了重伤。|The fuselage broke apart; some were badly hurt.", { stress: 40, happy: -20 }))
    ], 1.2),
    JE("jw_dip_hostage", ["diplomat"], [26, 70], "人质危机|A Hostage Crisis", "🕊️", "你所在国家有三名本国公民被武装分子扣押。你被指派去谈判。|Three of your citizens are held by armed men abroad. You’re sent to negotiate.", [
      O("亲自深入谈判|Negotiate in person", RC(sm(0, "eq"), "七十二小时后，三名人质全部获释。总统亲自给你打了电话。|Seventy-two hours later all three were freed. The head of state called you personally.", { fame: 12, perf: 25, karma: 10 }, "谈判破裂，人质被转移到了别处。|Talks collapsed and the hostages were moved.", { stress: 25, perf: -5 })),
      O("通过第三国斡旋|Work through a third country", RC(.5, "第三国的斡旋起了作用，人质获释。|The mediation worked; the hostages were released.", { perf: 12, smarts: 3 }, "斡旋拖了半年。|Mediation dragged on for six months.", { stress: 10 }))
    ]),
    JE("jw_dip_party", ["diplomat"], [26, 70], "使馆酒会|The Embassy Reception", "🍸", "酒会上，一位外国官员借着酒意透露了一个重要情报。|At a reception, a tipsy foreign official lets slip important information.", [
      O("如实上报|Report it", R("情报被证实很有价值。你的仕途更顺了。|The intelligence proved valuable; your career gained momentum.", { perf: 12 })),
      O("假装没听见，保护他|Pretend you didn’t hear, to protect him", R("他第二天专门来道谢。你们成了朋友，这份友谊后来在一次危机中起了大作用。|He came to thank you the next day. The friendship later proved vital in a crisis.", { eq: 4, karma: 3 }))
    ]),

    /* ---------------- economists / think tanks ---------------- */
    JE("jw_econ_forecast", ["econ", "think", "quant"], [26, 75], "逆势预测|A Contrarian Forecast", "📉", "所有人都看好经济，只有你的模型显示：一年内会有一场衰退。|Everyone is bullish — only your model says recession within a year.", [
      O("公开发表|Publish it", RC(.4, "一年后衰退真的来了。你被称为“唯一看对的人”，邀请多得接不过来。|A year later the recession came. They called you the only one who saw it, and invitations poured in.", { fame: 12, perf: 20, money: 5000 }, "经济继续增长，你成了笑柄。|The economy kept growing and you became a joke.", { fame: -3, happy: -8 })),
      O("压着不发，等等再看|Hold it back and wait", R("你错过了被证明正确的机会，也躲过了被嘲笑的风险。|You missed the chance to be proven right — and the risk of ridicule.", {}))
    ]),
    JE("jw_think_policy", ["think", "econ"], [28, 75], "政策建议|A Policy Proposal", "🏛️", "你起草的一份政策建议被领导人看到了，他批示“请研究”。|A policy proposal you drafted reaches a leader, who writes “please study this”.", [
      O("连夜补充数据，完善方案|Strengthen it with data overnight", RC(.5, "政策正式出台，影响了几千万人。你在内部被记了大功。|The policy was adopted, affecting tens of millions. You were formally commended.", { perf: 20, fame: 5, karma: 6 }, "方案被反复修改，最后面目全非。|It was revised beyond recognition.", { perf: 5 })),
      O("等上级安排|Wait for instructions", R("报告在抽屉里放了两年。|The report sat in a drawer for two years.", {}))
    ])
  ]);
})();
