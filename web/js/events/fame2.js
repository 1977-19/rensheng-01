/* Fame careers: each has its own world, its own stories, its own way a "performance" goes */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function fc(ids) { return function (S, p) { return !!(p.fc && [].concat(ids).indexOf(p.fc.id) >= 0); }; }
  function fans(c, k) { var f = c.p.fc; if (!f) return 0; var d = Math.round(f.fans * k); f.fans = Math.max(10, f.fans + d); G.dPush('fans', d); return d; }
  function rankUp(c) { var f = c.p.fc, F = G.FAME[f.id]; if (f.rank < F.r.length - 1) c.ev('sys_fame_up'); }

  /* how a performance reads, per career */
  var PERF = {
    actor: [['你的哭戏一条过，导演当场鼓掌。|Your crying scene was done in one take; the director applauded.', '新片上映，你的角色成了全网讨论的焦点。|The film opened and your character became the talk of the internet.'], ['你演得中规中矩，没什么记忆点。|Solid, but forgettable.'], ['影评人说你“面瘫式演技”。|Critics called your acting "a blank face."', '你忘词了七次，片场气氛很僵。|You forgot your lines seven times; the set went cold.']],
    singer: [['新歌发布即登顶榜首！|Your new single hit number one on release!', '演唱会全场大合唱，你在台上哭了。|The whole arena sang along; you cried on stage.'], ['新歌反响平平。|The new song got a lukewarm reception.'], ['你在直播中破音了，被做成了鬼畜视频。|You cracked a note live and got remixed into a meme.']],
    idol: [['打歌舞台的直拍火了，播放量破千万！|Your stage fancam went viral — ten million views!', '你拿下了音乐节目的一位！|You won first place on the music show!'], ['你在团里的存在感一般。|You were a bit lost in the group.'], ['你跳错了队形，被粉丝截图吐槽。|You missed a formation and fans posted the screenshots.']],
    streamer: [['你一场直播涨粉十万，礼物刷屏！|One stream brought a hundred thousand followers and a flood of gifts!', '你的一句口头禅成了全网热梗。|Your catchphrase became an internet meme.'], ['直播间人气不温不火。|Viewership was so-so.'], ['你在直播中说错话，被平台封了三天。|You said the wrong thing on stream and got a three-day ban.']],
    esports: [['你一波五杀逆转了比赛，解说喊破了嗓子！|You pulled off a pentakill comeback; the casters screamed!', '你们战队拿下了联赛冠军！|Your team won the league title!'], ['你发挥稳定，但没有高光。|Steady, but no highlights.'], ['你关键团战失误，被网友骂上了热搜。|You threw the key teamfight and trended for all the wrong reasons.']],
    athlete: [['你打破了全国纪录！|You broke the national record!', '你在决赛中绝杀对手！|You won the final at the buzzer!'], ['你发挥正常，止步半决赛。|You performed fine but lost in the semifinals.'], ['你在比赛中受伤，被担架抬下了场。|You were injured and stretchered off.']],
    writer: [['新书一上市就加印了五次！|Your new book went through five printings in its first month!', '你的小说被买下了影视版权。|Your novel\'s film rights sold.'], ['新书卖得一般。|The book sold modestly.'], ['书评人说你“江郎才尽”。|A critic said you\'ve "run dry."']],
    painter: [['你的新作在画廊被抢购一空！|Your new works sold out at the gallery!', '一位大藏家收藏了你的作品。|A major collector acquired your piece.'], ['展览来的人不多。|The exhibition was sparsely attended.'], ['评论家说你的画“缺乏灵魂”。|A critic said your painting "lacks soul."']],
    model: [['你登上了顶级时尚杂志的封面！|You landed the cover of a top fashion magazine!', '你在时装周上压轴走秀。|You closed the show at Fashion Week.'], ['你拍了几组普通的商业照片。|You shot a few ordinary commercial sets.'], ['你在T台上摔了一跤。|You tripped on the runway.']]
  };
  var perform = G.fame.perform;
  G.fame.perform = async function () {
    var p = G.S.p, f = p.fc; if (!f || !PERF[f.id]) return perform();
    var F = G.FAME[f.id], gid = F.game === 'sport' ? G.pick(['penalty', 'basketball', 'sprint']) : F.game;
    var r = await G.UI.game(gid, { name: F.n });
    var d = Math.round((r.score - .45) * 40);
    f.perf = G.clamp(f.perf + d, 0, 100);
    var fg = Math.round(f.fans * Math.max(-.2, (r.score - .4) * .5) + r.score * 800 * (f.rank + 1));
    f.fans = Math.max(10, f.fans + fg);
    G.dStart(); G.addStat('happy', r.score > .5 ? 4 : -2); if (r.score > .7) G.addStat('fame', 2); var dl = G.dEnd();
    dl.push({ k: 'fans', n: fg });
    var L = PERF[f.id][r.score > .6 ? 0 : r.score > .35 ? 1 : 2];
    await G.result(F.n, G.pick(L), {}, dl, r.score > .6 ? '🌟' : r.score > .35 ? '🎭' : '😓');
  };

  G.evs([
    /* actor */
    E('f_actor_role', [16, 60], '命运的角色|The Role of a Lifetime', '🎬', '一位名导演找你演一个需要增重三十斤、剃光头的角色。|A celebrated director wants you for a role requiring you to gain 15 kg and shave your head.', [
      O('豁出去了|Go all in', function (c) { H.fx(c, { looks: -6, health: -3 }); if (G.ch(.45 + c.p.fc.perf / 250)) { fans(c, .6); H.fx(c, { fame: 10 }); rankUp(c); return '电影大获成功，你凭这个角色拿下了最佳男/女主角！|The film was a triumph, and you won Best Actor for it!'; } fans(c, .05); return '电影叫好不叫座，但你的演技被认可了。|Critics loved it, audiences didn\'t — but your acting earned respect.'; }),
      O('爱惜形象，拒绝|Protect your image and decline', R('你接了一部偶像剧，片酬很高。|You took a teen drama instead — great pay.', { money: 8000 }))
    ], { if: fc('actor') }),
    E('f_actor_rule', [16, 40], '潜规则|The Casting Couch', '🚪', '一位制片人暗示：陪他吃顿“私人晚餐”，女/男主角就是你的。|A producer hints: join him for a "private dinner" and the lead role is yours.', [
      O('当场拒绝|Refuse on the spot', R('你被换掉了，但你挺直了腰杆。|You lost the role, but kept your dignity.', { karma: 6, happy: -3 })),
      O('偷偷录音，公开曝光|Secretly record and go public', RC(.5, '你的曝光引发了行业地震，你成了勇敢的代表。|Your exposé shook the industry; you became a symbol of courage.', { fame: 8, karma: 10 }, '你被全行业封杀了。|You were blacklisted across the industry.', { fame: -10, happy: -10 }), { era: { g: 1990, cn: 2005 } })
    ], { bad: 1, if: fc(['actor', 'model', 'idol']) }),
    E('f_actor_cp', [18, 40], '荧幕情侣|On-Screen Couple', '💞', '你和剧中搭档{n}的“CP”火了，粉丝天天喊你们在一起。|Fans are obsessed with you and co-star {n} as a couple.', [
      O('假戏真做|Make it real', function (c) { var n = c.npc; n.rel = 'admirer'; G.dPush('love', N.addLove(n, 25)); fans(c, .15); return '你们开始在片场之外约会。|You started dating off set.'; }),
      O('配合炒作|Play along for publicity', function (c) { fans(c, .2); return '热度居高不下，你们各取所需。|The buzz never stopped. Mutually beneficial.'; }),
      O('保持距离|Keep it professional', R('“我们只是好朋友。”|"We\'re just good friends."', {}))
    ], { if: function (S, p) { return fc('actor')(S, p) && p.age >= 18; }, prep: function (c) { var n = N.mkRomantic({ tags: ['celeb'], love: G.ri(25, 50), aff: 30, minGap: -5, maxGap: 6 }); n.rel = 'colleague'; n.job = '演员|Actor'; c.npc = n; c.prm.n = n.name; } }),

    /* singer */
    E('f_singer_cover', [16, 60], '翻唱风波|The Cover Controversy', '🎵', '你翻唱的一首老歌爆火了，原唱却发声明说你侵权。|Your cover of an old song blew up — and the original artist says you infringed.', [
      O('道歉并分成|Apologize and share royalties', R('原唱接受了道歉，还邀请你合唱。|The original artist accepted and invited you to duet.', { fame: 3, money: -2000 })),
      O('硬刚|Fight it', RC(.4, '官司打赢了。|You won in court.', { fame: 2 }, '你输了官司，赔了一大笔。|You lost and paid a fortune.', { money: -15000, fame: -3 }))
    ], { if: fc(['singer', 'idol']) }),
    E('f_singer_muse', [18, 70], '创作瓶颈|Writer\'s Block', '📝', '你已经一年写不出一首满意的歌了。|You haven\'t written a song you liked in a year.', [
      O('去远方采风|Travel somewhere far', R('你在一个边陲小镇住了三个月，写出了你最好的专辑。|Three months in a frontier town gave you your best album.', { money: -3000, sk: { music: 8 }, happy: 6 })),
      O('买别人的歌|Buy songs from others', R('歌很好听，但你知道那不是你的。|The songs were good, but you knew they weren\'t yours.', { money: -5000, happy: -3 })),
      O('借酒浇愁|Drown it in drink', R('灵感没来，酒量倒是见长。|No inspiration — just a higher tolerance.', { drink: 10, health: -3 }))
    ], { if: fc(['singer', 'writer', 'painter']) }),
    E('f_singer_show', [16, 45], '选秀节目|The Talent Show', '🎤', '一档大型歌唱选秀节目邀请你参赛。|A major singing competition invites you to compete.', [
      O('参加|Compete', async function (c) { var r = await c.game('rhythm', { name: '选秀决赛|The Final' }); if (r.win) { fans(c, 1.2); H.fx(c, { fame: 10 }); rankUp(c); return '你一路过关斩将，拿下了总冠军！|You fought through every round and won the whole thing!'; } fans(c, .2); return '你止步十强，但收获了一批死忠粉。|You went out in the top ten — with a loyal fanbase.'; })
    ], { if: function (S, p) { return fc(['singer', 'idol'])(S, p) && p.fc.rank <= 2; }, era: { g: 1990, cn: 2004 } }),

    /* idol */
    E('f_idol_dating', [17, 32], '恋爱禁令|The Dating Ban', '🚫', '公司规定偶像不能谈恋爱。可你喜欢上了一个人。|Your agency forbids idols from dating. But you\'ve fallen for someone.', [
      O('偷偷地谈|Date in secret', RC(.55, '你们小心翼翼地相爱着，没被发现。|You loved carefully and were never caught.', { happy: 8 }, '恋情曝光，粉丝脱粉回踩，公司让你公开道歉。|It leaked; fans turned on you, and the agency made you apologize.', { fame: -6, happy: -10 })),
      O('为了事业放手|Let go for your career', R('你在宿舍哭了一夜，第二天照常上台微笑。|You cried all night in the dorm, then smiled on stage the next day.', { happy: -8 }))
    ], { bad: 1, if: fc('idol') }),
    E('f_idol_contract', [16, 30], '奴隶合约|The Slave Contract', '📜', '你发现合约里写着：收入九成归公司，违约金一千万。|You discover your contract gives the agency 90% of income — with a ten-million penalty for breaking it.', [
      O('起诉公司解约|Sue to break the contract', RC(.4, '你赢了官司，成立了个人工作室！|You won and started your own studio!', { money: 10000, fame: 5, happy: 10 }, '官司拖了三年，你被雪藏了。|The suit dragged on for three years while you were shelved.', { fame: -10, happy: -12 })),
      O('忍到合约结束|Endure until it ends', R('你咬着牙，等着自由的那一天。|You gritted your teeth and waited for freedom.', { happy: -4 }))
    ], { bad: 1, if: fc('idol') }),
    E('f_idol_center', [16, 28], 'C位之争|Fight for Center', '⭐', '新歌的C位只有一个，你和队友{n}都想要。|There\'s one center spot for the new single, and you and bandmate {n} both want it.', [
      O('加练争取|Out-practice everyone', async function (c) { var r = await c.game('rhythm', { name: '练习室|Practice Room' }); if (r.win) { fans(c, .3); return '你拿下了C位，{n}也真心为你高兴。|You won center, and {n} was genuinely happy for you.'; } return '{n}拿到了C位，你在镜子前练到半夜。|{n} got it; you practiced in the mirror till midnight.'; }),
      O('让给{n}|Give it to {n}', function (c) { G.dPush('aff', N.addAff(c.npc, 25)); return '{n}抱着你哭了，你们成了最好的朋友。|{n} hugged you in tears; you became best friends.'; })
    ], { if: fc('idol'), prep: function (c) { var n = N.make({ rel: 'colleague', age: c.p.age + G.ri(-2, 2), job: '偶像|Idol', looks: G.ri(70, 95), aff: 20 }); c.npc = n; c.prm.n = n.name; } }),

    /* streamer */
    E('f_stream_pk', [16, 50], '直播PK|The Stream Battle', '⚔️', '一位头部主播向你发起了连麦PK，输的人要接受惩罚。|A top streamer challenges you to a live battle; the loser takes a penalty.', [
      O('应战|Accept', async function (c) { var r = await c.game('quiz', { name: '直播PK|Stream Battle', n: 3 }); if (r.win) { fans(c, .4); return '你赢了！对方的粉丝都涌进了你的直播间。|You won! The other streamer\'s fans flooded your channel.'; } fans(c, .05); return '你输了，被罚学了三声猫叫。意外地很可爱，涨了点粉。|You lost and had to meow three times. Weirdly adorable — you gained a few fans.'; }),
      O('婉拒|Decline', R('“下次一定。”|"Next time, for sure."', {}))
    ], { if: fc('streamer') }),
    E('f_stream_sponsor', [16, 50], '神秘大哥|The Mysterious Big Spender', '💎', '一个叫“大哥”的账号每天给你刷几万块的礼物，还要你加他私人联系方式。|An account called "Big Bro" sends tens of thousands in gifts daily and wants your private contact.', [
      O('加了|Add him', RC(.4, '“大哥”只是个孤独的有钱人，你们成了朋友。|"Big Bro" turned out to be just a lonely rich guy; you became friends.', { money: 8000 }, '“大哥”开始骚扰你，还威胁你。|"Big Bro" started harassing and threatening you.', { happy: -12, money: 5000 })),
      O('只感谢，不私联|Thank him publicly, nothing private', R('“大哥”消失了一阵子，又回来了。|"Big Bro" vanished for a while, then returned.', { money: 3000 }))
    ], { if: fc('streamer') }),
    E('f_stream_burnout', [18, 50], '停播|Burnout', '🔋', '每天直播十二个小时，你已经很久没见过太阳了。|Twelve hours of streaming a day — you haven\'t seen the sun in ages.', [
      O('停播休息一个月|Take a month off', function (c) { fans(c, -.15); H.fx(c, { health: 6, happy: 8, stress: -20 }); return '你去海边住了一个月。回来时掉了些粉，但你又爱上了直播。|You spent a month by the sea. You lost some followers, but fell back in love with streaming.'; }),
      O('硬撑|Push through', R('你在直播中晕倒了，被送去了医院。|You collapsed on stream and were taken to the hospital.', { health: -15, fame: 3 }))
    ], { bad: 1, if: fc(['streamer', 'esports']) }),

    /* esports */
    E('f_esp_world', [16, 30], '世界赛|Worlds', '🏆', '你们战队打进了世界赛决赛，全世界的目光都在你身上。|Your team made the world championship final. The whole world is watching.', [
      O('打出最好的自己|Play your best', async function (c) { var r = await c.game('rhythm', { name: '世界赛决赛|World Final' }); if (r.win) { fans(c, 1); H.fx(c, { fame: 15, happy: 15, money: 30000 }); rankUp(c); G.inc('trophies'); return '你们捧起了冠军奖杯！你的名字将永远刻在奖杯上。|You lifted the trophy! Your name is engraved on it forever.'; } H.fx(c, { happy: -10 }); return '你们以2:3惜败。你在台上哭了，全场为你们鼓掌。|You lost 2–3. You cried on stage as the crowd applauded.'; })
    ], { if: function (S, p) { return fc('esports')(S, p) && p.fc.rank >= 2; } }),
    E('f_esp_fix', [16, 30], '假赛邀请|A Match-Fixing Offer', '💰', '有人私下找到你：输掉下一场比赛，给你一大笔钱。|Someone approaches you privately: throw the next match for a fortune.', [
      O('拒绝并举报|Refuse and report it', R('联盟彻查了此事，表扬了你的职业操守。|The league investigated and praised your integrity.', { karma: 10, fame: 3 })),
      O('收钱打假赛|Take the money', function (c) { c.money(c.$(40000)); if (G.ch(.4)) { c.p.fc = null; H.fx(c, { fame: -20, happy: -20 }); return '事情败露，你被联盟终身禁赛。|It came out. You were banned for life.'; } H.fx(c, { karma: -15 }); return '没人发现。可每次看到那场比赛的录像，你都很难受。|No one found out. But watching the replay always makes you sick.'; })
    ], { bad: 1, if: fc(['esports', 'athlete']) }),
    E('f_esp_hands', [20, 30], '手速下降|Slowing Down', '🖐️', '你发现自己的反应速度不如新人了，教练开始让新人首发。|Your reactions are slower than the rookies\'. The coach starts benching you.', [
      O('转型做教练|Become a coach', function (c) { var f = c.p.fc; c.p.fc = null; G.career.hire(G.JOB.trainer); H.fx(c, { happy: 4 }); return '你退役当了教练，带出了下一代冠军。|You retired to coach and raised the next generation of champions.'; }),
      O('转型做主播|Become a streamer', function (c) { var fs = c.p.fc.fans; c.p.fc = null; G.fame.start('streamer', { fans: Math.round(fs * .6) }); return '你开始直播，老粉丝都跟了过来。|You started streaming, and your old fans followed.'; }),
      O('不服，继续练|Refuse to quit — train harder', R('你每天练十四个小时，但时间不站在你这边。|Fourteen hours of practice a day — but time isn\'t on your side.', { health: -5, stress: 10 }))
    ], { bad: 1, if: fc('esports') }),

    /* athlete */
    E('f_ath_olympics', [17, 34], '奥运会|The Olympics', '🥇', '你入选了奥运代表团！这是你一生的梦想。|You made the Olympic team! It\'s the dream of a lifetime.', [
      O('为国争光|Go for gold', async function (c) { var r = await c.game('sprint', { name: '奥运决赛|Olympic Final' }); if (r.score > .75) { fans(c, 2); H.fx(c, { fame: 25, happy: 20, money: 50000 }); G.inc('medal'); rankUp(c); return '你站上了最高领奖台，国歌响起时你泪流满面！|You stood atop the podium and wept as the anthem played!'; } if (r.win) { fans(c, .6); H.fx(c, { fame: 10, happy: 10 }); G.inc('medal'); return '你拿到了一枚铜牌！|You won a bronze medal!'; } H.fx(c, { happy: -12 }); return '你止步预赛。你在场边坐了很久。|You were knocked out in the heats and sat by the track a long time.'; })
    ], { if: function (S, p) { return fc('athlete')(S, p) && p.fc.rank >= 2; } }),
    E('f_ath_retire', [28, 40], '退役之后|After the Final Whistle', '🏟️', '退役后，你突然不知道每天该干什么了。|After retirement, you suddenly don\'t know what to do with your days.', [
      O('当教练|Coach', function (c) { G.career.hire(G.JOB.trainer); H.fx(c, { happy: 4 }); return '你成了一名体育教练。|You became a coach.'; }),
      O('做解说|Become a commentator', R('你的解说专业又风趣，成了观众最喜欢的声音。|Your commentary was sharp and funny — the fans\' favorite voice.', { fame: 3, money: 6000 })),
      O('开健身馆|Open a gym', function (c) { if (c.S.assets.company) return '你已经有公司了。|You already run a company.'; G.biz.start('food', 50000); c.S.assets.company.name = G.L('{n}健身|{n} Fitness', { n: c.p.name }); return '你开了一家以自己名字命名的健身馆。|You opened a gym bearing your name.'; })
    ], { if: function (S, p) { return !p.fc && p.flags.wasAthlete && !p.job; } }),

    /* writer */
    E('f_writer_ghost', [20, 60], '代笔|Ghostwriting', '👻', '一位过气明星出高价请你代写自传。|A fading celebrity offers big money for you to ghostwrite their memoir.', [
      O('接|Take it', R('书大卖，封面上只有明星的名字。|It sold huge; only their name was on the cover.', { money: 12000, happy: -2 })),
      O('不接|Pass', R('你继续写自己的东西。|You keep writing your own work.', { sk: { art: 2 } }))
    ], { if: fc('writer') }),
    E('f_writer_adapt', [22, 70], '影视改编|The Adaptation', '🎞️', '你的小说要被拍成电视剧了，可编剧把故事改得面目全非。|Your novel is being adapted for TV — and the screenwriter has gutted the story.', [
      O('公开抗议|Protest publicly', RC(.4, '剧组妥协了，按原著拍。|The production gave in and stayed faithful.', { fame: 4, happy: 6 }, '你被剧组踢出了项目。|You were kicked off the project.', { happy: -6 })),
      O('拿钱闭嘴|Take the check and stay quiet', R('剧播出后口碑崩了，书却卖火了。|The show bombed with critics, but book sales soared.', { money: 15000, fame: 3 }))
    ], { if: fc('writer') }),

    /* painter */
    E('f_paint_forgery', [22, 70], '赝品|Forgeries', '🖼️', '市场上出现了大量你的赝品。|Forgeries of your work are flooding the market.', [
      O('打假|Fight the forgers', R('你的作品身价反而更高了。|Your genuine works only grew more valuable.', { fame: 3, money: 3000 })),
      O('一笑置之：说明我出名了|Shrug: it means I\'ve made it', R('“被人模仿是一种荣誉。”|"Imitation is a kind of honor."', { happy: 4 }))
    ], { if: fc('painter') }),
    E('f_paint_patron', [20, 60], '神秘的买家|The Mysterious Buyer', '🧐', '一位神秘买家买下了你所有的作品，只有一个要求：此后十年你只能为他作画。|A mysterious buyer purchases all your work, on one condition: for ten years you paint only for him.', [
      O('答应|Accept', R('你衣食无忧，但再也没开过画展。|You never wanted for anything again — but never had another show.', { money: 60000, fame: -5 })),
      O('拒绝|Refuse', R('艺术不能被买断。|Art can\'t be bought outright.', { karma: 3, happy: 3 }))
    ], { if: fc('painter') }),

    /* model */
    E('f_model_diet', [16, 35], '体重秤|The Scale', '⚖️', '经纪人说你胖了，下周走秀前必须瘦五斤。|Your agent says you\'ve gained weight and must lose 2.5 kg before next week\'s show.', [
      O('健康地调整|Adjust healthily', R('你按营养师的建议吃饭训练，状态反而更好了。|Following a nutritionist, you ended up in better shape than ever.', { health: 3, fit: 4 })),
      O('拒绝：“我的身体我做主”|Refuse: "My body, my rules"', RC(.5, '品牌欣赏你的态度，改用了你做“真实之美”代言人。|The brand loved your stance and made you its face for "real beauty."', { fame: 6, happy: 6 }, '你被换掉了。|You were replaced.', { happy: -4 }))
    ], { if: fc('model') }),
    E('f_model_brand', [18, 40], '奢侈品代言|The Luxury Contract', '👜', '一个顶级奢侈品牌想签你做全球代言人。|A top luxury house wants you as its global ambassador.', [
      O('签！|Sign!', function (c) { var m = c.$(G.ri(5, 30) * 10000); c.money(m); fans(c, .4); c.prm.m = G.M(m); rankUp(c); return '代言费{m}，你的照片挂满了全球机场。|A {m} contract, and your face in airports worldwide.'; })
    ], { good: 1, if: function (S, p) { return fc(['model', 'actor', 'idol', 'singer'])(S, p) && p.fc.rank >= 2; } })
  ]);
  // remember athletes after they retire so later stories know
  var ft = G.fame.tick;
  G.fame.tick = function (Q) { var p = G.S.p; if (p.fc && p.fc.id === 'athlete') p.flags.wasAthlete = 1; return ft(Q); };
})();
