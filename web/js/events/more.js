/* Extra early-childhood and old-age stories */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function east(S, p) { return ['cn', 'jp', 'kr', 'sg', 'th'].indexOf(p.country) >= 0; }
  function grandkids() { return N.rel('grandchild').filter(function (n) { return n.alive; }); }
  function kids() { return N.rel('child').filter(function (n) { return n.alive; }); }
  G.evs([
    /* ---------- babies & toddlers ---------- */
    E('b_nightcry', [0, 1], '夜哭郎|The Night Crier', '🌙', '你每天半夜准时大哭，爸妈已经一个月没睡过整觉了。|You wail every night like clockwork. Your parents haven\'t slept through the night in a month.', [
      O('哭得更大声|Cry even louder', R('邻居来敲门了。爸妈顶着黑眼圈连连道歉。|The neighbors knocked. Your bleary-eyed parents apologized profusely.', { par: -3, happy: 2 })),
      O('看着爸爸笑|Look at Dad and giggle', R('爸爸瞬间忘了困，抱着你在客厅里转圈。|Dad forgot all about being tired and twirled you around the living room.', { par: 6, happy: 3 }))
    ]),
    E('b_teeth', [0, 2], '长牙了|Teething', '🦷', '你的小牙冒出来了，看见什么都想咬。|Your first teeth are coming in, and you want to bite everything.', [
      O('咬爸爸的手指|Chomp on Dad\'s finger', R('爸爸疼得龇牙咧嘴，却笑得最开心。|Dad winced in pain but laughed the hardest.', { par: 3 })),
      O('啃磨牙棒|Gnaw on a teething stick', R('你啃得口水直流，满足极了。|You drooled all over it, perfectly content.', { happy: 3 })),
      O('哭个不停|Cry nonstop', R('妈妈抱着你哄了一整夜。|Mom rocked you all night long.', { par: -1, health: -1 }))
    ]),
    E('b_crawl', [0, 1], '宝宝爬行赛|Baby Crawling Race', '🐛', '社区举办宝宝爬行比赛，爸妈给你报了名。|The neighborhood is holding a baby crawling race, and your parents signed you up.', [
      O('冲啊！|Go go go!', async function (c) { var r = await c.game('sprint', { name: '爬行赛|Crawl Race' }); if (r.win) { H.fx(c, { par: 6, happy: 5, fit: 4 }); return '你一路爬到终点，拿了第一名！爸妈把奖状裱了起来。|You crawled all the way to the finish and won! Your parents framed the certificate.'; } H.fx(c, { happy: 2 }); return '你爬到一半，坐下来玩起了自己的脚。|Halfway there, you sat down and started playing with your toes.'; }),
      O('原地不动|Refuse to budge', R('你坐在起点冲着观众笑，成了全场最受欢迎的宝宝。|You sat at the start line grinning at the crowd and became the audience favorite.', { eq: 2, looks: 1 }))
    ], { if: function (S, p) { return H.hasPar() && S.year >= 1975; } }),
    E('b_bath', [0, 3], '洗澡大战|Bath Time Battle', '🛁', '又到洗澡时间了，你看着澡盆跃跃欲试。|Bath time again. You eye the tub with mischief.', [
      O('疯狂拍水|Splash like crazy', R('浴室成了水帘洞，爸妈浑身湿透。|The bathroom became a waterpark; your parents got soaked.', { happy: 5, par: -1 })),
      O('乖乖洗完|Behave yourself', R('洗得香喷喷的你，被妈妈亲了好几口。|Squeaky clean, you got covered in kisses.', { par: 3, health: 1 }))
    ]),
    E('b_picky', [2, 6], '挑食|Picky Eater', '🥦', '餐桌上有一盘青菜，你把头扭到一边。|There\'s a plate of greens on the table. You turn your head away.', [
      O('坚决不吃|Absolutely not', R('你只吃肉，爸妈很头疼。|You only eat meat; your parents are at their wits\' end.', { health: -2, happy: 2, par: -2 })),
      O('捏着鼻子吃一口|Hold your nose and take a bite', R('“其实……还不错？”|"Actually... not bad?"', { health: 3, par: 2 })),
      O('偷偷喂给狗|Sneak it to the dog', RC(.5, '狗狗吃得很开心，没人发现。|The dog loved it, and nobody noticed.', { happy: 2 }, '被妈妈当场抓住了！|Mom caught you red-handed!', { par: -3 }), { if: function (c) { return c.S.assets.pets && c.S.assets.pets.some(function (x) { return x.kind === 'dog' && !x.dead; }); } })
    ]),
    E('b_nap', [2, 5], '不肯午睡|No Nap Today', '😴', '午睡时间到了，可你一点也不困。|It\'s nap time, but you\'re not sleepy at all.', [
      O('装睡然后偷偷玩|Fake sleep, then play', RC(.6, '你玩得很开心，没被发现。|You had a blast and nobody noticed.', { happy: 3 }, '被老师发现了，罚站十分钟。|The teacher caught you; ten minutes in the corner.', { happy: -3 })),
      O('乖乖睡觉|Go to sleep', R('你睡得很香，醒来精神百倍。|You slept like a log and woke up full of energy.', { health: 2 }))
    ]),
    E('b_grandma', [1, 6], '隔代亲|Spoiled by Grandparents', '👵', '{n}来家里帮忙带你，什么都依着你。|{n} comes to help look after you and gives you anything you want.', [
      O('要糖吃|Ask for candy', R('{n}偷偷塞给你一大把糖。爸妈回来后脸都黑了。|{n} slipped you a handful of candy. Your parents were not pleased.', { happy: 5, health: -1, npc: 6 })),
      O('听{n}讲故事|Listen to {n}\'s stories', R('你听了好多以前的故事，记住了一辈子。|You heard stories from long ago and remembered them forever.', { smarts: 2, npc: 8 }))
    ], { prep: function (c) { var g = N.rel('grand').filter(function (n) { return n.alive; }); if (!g.length) return false; c.npc = G.pick(g); c.prm.n = c.npc.name; }, if: function () { return N.rel('grand').some(function (n) { return n.alive; }); } }),
    E('b_photo', [1, 5], '萌宝大赛|Cutest Baby Contest', '📸', '商场举办萌宝摄影大赛，爸妈带你去参加。|The mall is holding a cutest-baby photo contest, and your parents enter you.', [
      O('对着镜头笑|Smile for the camera', function (c) { if (G.ch(.15 + c.p.st.looks / 200)) { H.fx(c, { fame: 3, happy: 6, money: 300, par: 5 }); return '你拿了冠军，还被选去拍了一支奶粉广告！|You won — and got picked for a baby formula commercial!'; } H.fx(c, { happy: 2 }); return '你拿了个参与奖，一盒饼干。|You got a participation prize: a box of cookies.'; }),
      O('哭着找妈妈|Cry for Mom', R('照片里的你哭得满脸通红，后来成了家里的经典表情包。|The photo of your red, crying face became a family classic.', { par: 2 }))
    ], { if: function (S) { return S.year >= 1985; } }),
    E('b_imaginary', [3, 6], '看不见的朋友|An Invisible Friend', '👻', '你说你有个好朋友叫“小飞”，可是谁都看不见他。|You say you have a best friend named "Flip" — but nobody else can see him.', [
      O('给小飞留一个座位|Save a seat for Flip', R('爸妈有点担心，但你的想象力天马行空。|Your parents worry a little, but your imagination runs wild.', { smarts: 2, sk: { art: 3 }, happy: 3 })),
      O('告诉爸妈小飞搬走了|Tell your parents Flip moved away', R('你长大了一点点。|You grew up just a little.', { eq: 2 }))
    ]),
    E('b_swallow', [1, 4], '误吞硬币|Swallowed a Coin', '🪙', '你把一枚硬币塞进了嘴里，咽了下去！|You popped a coin in your mouth — and swallowed it!', [
      O('（爸妈冲向医院）|(Your parents rush you to the hospital)', RC(.85, '有惊无险，两天后硬币自己出来了。|A close call — the coin came out on its own two days later.', { par: 2, money: -80 }, '医生做了个小手术取了出来，你在医院住了几天。|Doctors removed it with a minor procedure; you stayed a few days.', { health: -6, money: -600 }))
    ]),
    E('b_why', [3, 6], '十万个为什么|A Thousand Whys', '❓', '“为什么天是蓝的？为什么鱼不会淹死？为什么爸爸没有头发？”|"Why is the sky blue? Why don\'t fish drown? Why doesn\'t Daddy have hair?"', [
      O('一直问下去|Keep asking', R('爸妈被问得哑口无言，给你买了一套百科全书。|Stumped, your parents bought you an encyclopedia set.', { smarts: 3, par: 1 })),
      O('自己找答案|Figure it out yourself', R('你把家里的闹钟拆了，想看看时间藏在哪。|You took apart the alarm clock to see where time lives.', { smarts: 2, par: -2 }))
    ]),
    E('b_party', [2, 6], '生日派对|Birthday Party', '🎂', '今天是你的生日！|It\'s your birthday!', [
      O('许个愿|Make a wish', function (c) { if (H.rich(c.S, c.p)) { H.fx(c, { happy: 8 }); return '爸妈包下了整个儿童乐园，请了小丑和魔术师。|Your parents rented out an entire play center, with a clown and a magician.'; } if (H.poor(c.S, c.p)) { H.fx(c, { happy: 5, par: 3 }); return '妈妈煮了一碗长寿面，还卧了两个荷包蛋。你觉得这是世界上最好吃的面。|Mom made longevity noodles with two fried eggs on top. Best noodles in the world.'; } H.fx(c, { happy: 6 }); return '你吹灭了蜡烛，全家给你唱生日歌。|You blew out the candles while the whole family sang.'; })
    ], { if: function () { return H.hasPar(); } }),
    E('b_tooth', [5, 7], '掉牙了|Lost a Tooth', '🦷', '你的第一颗乳牙掉了！|Your first baby tooth fell out!', [
      O('放在枕头下面|Put it under your pillow', function (c) { if (!east(c.S, c.p)) { H.fx(c, { happy: 4, money: 2 }); return '第二天早上，牙齿变成了一枚硬币！“牙仙”来过了！|Next morning, the tooth had become a coin. The Tooth Fairy came!'; } H.fx(c, { happy: 2 }); return '什么都没发生。妈妈说牙齿应该扔到房顶上。|Nothing happened. Mom says teeth go on the roof.'; }),
      O('扔到房顶上|Toss it onto the roof', R('奶奶说这样新牙才会长得又直又快。|Grandma says that way your new tooth will grow straight and fast.', { happy: 2 }))
    ]),
    E('b_dark', [3, 7], '怕黑|Afraid of the Dark', '🔦', '晚上关了灯，你总觉得床底下有怪兽。|When the lights go out, you\'re sure there\'s a monster under the bed.', [
      O('钻进爸妈被窝|Crawl into your parents\' bed', R('你睡得很香，爸爸被挤到了床边。|You slept soundly; Dad got pushed to the edge.', { par: 2, happy: 2 })),
      O('拿手电筒检查|Check with a flashlight', R('床底下只有一只袜子。你勇敢多了。|Just a sock under there. You feel braver.', { eq: 2 }))
    ]),
    E('b_hide', [3, 7], '捉迷藏|Hide and Seek', '🙈', '你和小伙伴玩捉迷藏，躲进了衣柜里。|Playing hide-and-seek, you hide in the wardrobe.', [
      O('坚持不出来|Stay hidden no matter what', RC(.7, '你躲得太好，在衣柜里睡着了。全家找了你一下午，差点报警。|You hid so well you fell asleep. The whole family searched all afternoon and nearly called the police.', { par: -3, happy: 3 }, '你被闷得满头大汗，憋不住跑了出来。|You got so hot you burst out of hiding.', { happy: 1 })),
      O('偷偷换个地方|Sneak to a new spot', R('你成了小区里的捉迷藏冠军。|You became the hide-and-seek champion of the block.', { happy: 4, eq: 1 }))
    ]),
    E('b_wallart', [2, 5], '墙上的画|Masterpiece on the Wall', '🖍️', '你拿着蜡笔，看着家里雪白的墙。|Crayon in hand, you stare at the blank white wall.', [
      O('大展身手|Create your masterpiece', R('爸妈回家一看，又气又笑。那面墙后来一直没舍得刷。|Your parents didn\'t know whether to laugh or cry — and never painted over it.', { sk: { art: 4 }, par: -2, happy: 5 })),
      O('画在纸上|Draw on paper instead', R('你得到了一朵小红花。|You earned a gold star.', { par: 2 }))
    ]),

    /* ---------- old age ---------- */
    E('o_grandcare', [52, 82], '带孙辈|Raising the Grandkids', '🍼', '孩子们工作忙，想请你帮忙带{n}。|Your kids are busy with work and ask you to help look after {n}.', [
      O('全力帮忙|Help out full-time', R('你累得腰酸背痛，但孙辈一声声“{g}”让你心都化了。|Your back aches, but every time they call you "{g}" your heart melts.', { happy: 6, health: -3, kids: 8, npc: 15 })),
      O('偶尔帮忙|Help now and then', R('你保留了自己的生活，也享受了天伦之乐。|You kept your own life and still enjoyed being a grandparent.', { happy: 3, kids: 2, npc: 6 })),
      O('婉拒，享受退休生活|Decline and enjoy retirement', R('孩子们有些不满，但你去学了一门新乐器。|Your kids grumbled, but you took up a new instrument.', { happy: 4, kids: -6 }))
    ], { prep: function (c) { var g = grandkids().filter(function (n) { return N.age(n) < 8; }); if (!g.length) return false; c.npc = G.pick(g); c.prm.n = c.npc.name; c.prm.g = c.p.g === 'm' ? '爷爷|Grandpa' : '奶奶|Grandma'; }, if: function () { return grandkids().some(function (n) { return N.age(n) < 8; }); } }),
    E('o_dance', [52, 85], '广场舞|Dancing in the Square', '💃', function (c) { return H.cn(c.S, c.p) ? '楼下广场上，一群老人每晚都在跳广场舞。|Every evening, a group of seniors dances in the square downstairs.' : '社区中心开了一个老年交谊舞班。|The community center has started a ballroom dance class for seniors.'; }, [
      O('加入他们|Join in', function (c) { H.fx(c, { happy: 6, fit: 6, health: 2 }); if (!N.partner() && G.ch(.3)) { var n = N.mkRomantic({ rel: 'admirer', age: c.p.age + G.ri(-4, 4), love: G.ri(45, 70), aff: 30 }); c.prm.m = n.name; return '你跳得越来越好，舞伴{m}总是冲你笑。|You got better and better, and your dance partner {m} keeps smiling at you.'; } return '你认识了一群老伙伴，每天都很充实。|You made a crowd of new friends; every day feels full.'; }),
      O('嫌吵，投诉他们|Too loud — file a complaint', R('他们把音箱调小了一点点。|They turned the speaker down a tiny bit.', { happy: -1 }))
    ]),
    E('o_scamcall', [60, 95], '可疑的电话|A Suspicious Call', '☎️', '电话里有人哭着说：“我是你孙子，我出事了，快打钱救我！”|A sobbing voice on the phone: "It\'s your grandson! I\'m in trouble — wire money now!"', [
      O('赶紧转钱|Wire the money right away', function (c) { var l = Math.min(Math.max(0, c.p.money), c.$(G.ri(2000, 15000))); c.money(-l); c.prm.m = G.M(l); G.inc('scammed'); H.fx(c, { happy: -10 }); return '你转了{m}。后来才发现，孙子好好地在学校上课。|You sent {m}. Later you found out your grandson was safe in class the whole time.'; }),
      O('先打电话核实|Call the family to check', R('孙子好好的。你识破了骗局，还报了警。|Your grandson was fine. You saw through the scam and reported it.', { smarts: 1, karma: 2 })),
      O('骂回去|Give the scammer a piece of your mind', R('对方被你骂得挂了电话。|You chewed them out until they hung up.', { happy: 3 }))
    ], { bad: 1, era: { g: 1995, cn: 2005 } }),
    E('o_blues', [58, 75], '退休综合征|Retirement Blues', '🫥', '退休后，你突然不知道每天该干什么了。|Since retiring, you suddenly have no idea what to do with your days.', [
      O('去当志愿者|Volunteer', R('在社区帮忙，你重新找到了被需要的感觉。|Helping in the community, you feel needed again.', { happy: 6, karma: 4 })),
      O('培养一个爱好|Take up a hobby', R('你迷上了书法/钓鱼，每天都有盼头。|You got hooked on calligraphy and fishing; every day has something to look forward to.', { happy: 5, stress: -10 })),
      O('整天在家看电视|Watch TV all day', R('你越来越不爱出门了。|You leave the house less and less.', { happy: -5, health: -2 }))
    ], { if: function (S, p) { return p.retired; } }),
    E('o_checkup', [58, 100], '体检报告|Checkup Results', '📋', '体检报告上有几个指标标了红色的箭头。|Several numbers on your checkup report are flagged with red arrows.', [
      O('做进一步检查|Get follow-up tests', function (c) { if (!c.pay(c.$(800))) return '你付不起检查费，只好先放着。|You couldn\'t afford the tests and let it slide.'; var hid = c.p.ill.filter(function (x) { return !x.known; }); if (hid.length) { hid.forEach(function (x) { x.known = 1; }); c.prm.d = G.ILL[hid[0].id].n; return '查出了{d}，好在发现得早。|They found {d} — luckily, early.'; } H.fx(c, { happy: 4 }); return '虚惊一场，医生说注意饮食就好。|False alarm. The doctor just said watch your diet.'; }),
      O('不当回事|Shrug it off', R('“人老了，哪有没毛病的。”|"At my age, everyone has something."', { stress: -2 }))
    ]),
    E('o_friendgone', [62, 100], '老友离世|An Old Friend Passes', '🕯️', '你得知老朋友{n}去世了。|You learn that your old friend {n} has passed away.', [
      O('去参加葬礼|Attend the funeral', function (c) { c.npc.alive = false; c.npc.died = c.S.year; H.fx(c, { happy: -8 }); return '你在灵前站了很久，想起年轻时你们一起做过的傻事。|You stood by the casket a long time, remembering the foolish things you did together when young.'; }),
      O('一个人喝了一杯|Raise a glass alone', function (c) { c.npc.alive = false; c.npc.died = c.S.year; H.fx(c, { happy: -10, drink: 3 }); return '“老伙计，一路走好。”|"Rest easy, old friend."'; })
    ], { prep: function (c) { var f = N.rel('friend', 'mentor').filter(function (n) { return n.alive && N.age(n) >= 60; }); if (!f.length) return false; c.npc = G.pick(f); c.prm.n = c.npc.name; }, if: function () { return N.rel('friend', 'mentor').some(function (n) { return n.alive && N.age(n) >= 60; }); } }),
    E('o_carehome', [76, 110], '养老的选择|Where to Grow Old', '🏡', '你的腿脚越来越不方便，一个人生活有些吃力了。|Your legs aren\'t what they were, and living alone is getting hard.', [
      O('住进高档养老院|Move into a premium care home', function (c) { if (!c.pay(c.$(30000))) return '高档养老院太贵了，你住不起。|A premium home was out of reach.'; H.fx(c, { health: 6, happy: 4 }); c.p.flags.carehome = 1; return '有专业护理照顾，你的身体好了不少。|With professional care, your health improved.'; }),
      O('搬去和孩子一起住|Move in with your children', function (c) { if (!kids().length) return '你没有孩子可以投靠。|You have no children to move in with.'; H.fx(c, { happy: 6, kids: G.ch(.6) ? 6 : -6 }); return G.ch(.6) ? '每天都能看到孙辈，你很知足。|Seeing the grandkids every day, you feel content.' : '住在一起免不了磕磕碰碰，但总归是一家人。|Living together means friction, but family is family.'; }),
      O('请个保姆，留在家里|Hire a caregiver and stay home', function (c) { if (!c.pay(c.$(12000))) return '你请不起保姆，只能自己硬撑。|You can\'t afford help and have to manage alone.'; H.fx(c, { happy: 4, health: 3 }); return '你还住在熟悉的老房子里，这比什么都重要。|You still live in your familiar old home, and that matters most.'; })
    ]),
    E('o_hearing', [70, 110], '耳背了|Hard of Hearing', '🦻', '家人说话你总是听不清，大家只好扯着嗓子喊。|You keep mishearing your family; everyone has to shout.', [
      O('配个助听器|Get a hearing aid', R('世界又变得清晰起来了。|The world comes back into focus.', { happy: 4, money: -900 })),
      O('假装听得见|Pretend you can hear', R('你常常答非所问，闹了不少笑话。|Your off-target answers became family legends.', { happy: -2 }))
    ]),
    E('o_memoir', [65, 100], '写回忆录|Writing Your Memoirs', '📖', '你想把这一生的故事写下来。|You want to write down the story of your life.', [
      O('认真写完|Finish it properly', function (c) { H.fx(c, { happy: 6, smarts: 1 }); if (c.p.st.fame > 40) { H.fx(c, { money: 20000, fame: 4 }); return '回忆录出版后成了畅销书！|Your memoir became a bestseller!'; } return '你把书印了几十本，送给了家人和朋友。|You printed a few dozen copies for family and friends.'; }),
      O('写了几页就放弃了|Give up after a few pages', R('有些故事，还是留在心里吧。|Some stories are best kept in the heart.', {}))
    ]),
    E('o_golden', [68, 105], '金婚纪念|Golden Anniversary', '💛', '今年是你和{n}结婚五十周年。|This year marks fifty years of marriage with {n}.', [
      O('补办一场婚礼|Renew your vows', R('儿孙们为你们补办了婚礼，{n}穿上婚纱的那一刻，你红了眼眶。|Your family threw you a second wedding. When {n} walked in, your eyes filled with tears.', { happy: 12, part: 10, kids: 4, money: -1500 })),
      O('两个人安静地吃顿饭|A quiet dinner for two', R('你们像年轻时一样，牵着手散步回家。|You walked home hand in hand, just like when you were young.', { happy: 8, part: 8 }))
    ], { good: 1, w: 10, prep: function (c) { var s = N.spouse(); if (!s || !s.alive || !s.wedY || c.S.year - s.wedY < 50) return false; c.npc = s; c.prm.n = s.name; }, if: function (S) { var s = N.spouse(); return !!(s && s.alive && s.wedY && S.year - s.wedY >= 50); } }),
    E('o_estate', [68, 100], '子女争家产|Fighting Over the Inheritance', '⚖️', '孩子们为了你将来的遗产吵了起来。|Your children are arguing over your future estate.', [
      O('平均分配|Split it evenly', R('大家虽然不完全满意，但都接受了。|Not everyone is thrilled, but they accept it.', { kids: 2, happy: -2 })),
      O('多给照顾你的那个|Favor the one who cares for you', R('照顾你的孩子很感动，其他人很不服气。|The child who looks after you is moved; the others are resentful.', { kids: -4, happy: -3 })),
      O('全捐了！|Donate it all!', R('孩子们目瞪口呆。你说：“让你们自己去奋斗。”|Your children were stunned. "Go earn your own," you said.', { kids: -10, karma: 12, happy: 4, flag: 'donateAll' }))
    ], { bad: 1, if: function (S, p) { return kids().length >= 2 && G.netWorth() > G.$(300000); } }),
    E('o_chess', [60, 100], '公园棋局|Park Chess', '♟️', '公园里有个老头号称“十年未逢敌手”。|An old man in the park claims he hasn\'t lost a game in ten years.', [
      O('上去杀一盘|Challenge him', async function (c) { var r = await c.game('memory', { name: '棋局|Chess' }); if (r.win) { H.fx(c, { happy: 6, smarts: 1, rep: 3 }); return '你赢了！围观群众掌声雷动，你成了公园的新“棋王”。|You won! The crowd applauded; you\'re the new park champion.'; } H.fx(c, { happy: -1 }); return '你输了，约好明天再来。|You lost, and promised a rematch tomorrow.'; }),
      O('在旁边指点江山|Kibitz from the sidelines', R('你和别人为了一步棋吵了半小时。|You argued about one move for half an hour.', { happy: 3 }))
    ]),
    E('o_tour', [58, 85], '夕阳红旅行团|Senior Tour Group', '🚌', '小区里在组织一个老年旅行团，价格便宜得出奇。|A senior tour group in your neighborhood is offering a suspiciously cheap trip.', [
      O('报名参加|Sign up', function (c) { if (!c.pay(c.$(300))) return '你没钱报名。|You couldn\'t afford it.'; if (G.ch(.45)) { var l = Math.min(Math.max(0, c.p.money), c.$(G.ri(800, 3000))); c.money(-l); c.prm.m = G.M(l); H.fx(c, { happy: -2 }); return '一路上都在逛购物店，你被忽悠着买了{m}的“保健品”。|The whole trip was shopping stops; you got talked into {m} of "health supplements."'; } H.fx(c, { happy: 8 }); return '山清水秀，你拍了几百张照片。|Beautiful scenery — you took hundreds of photos.'; }),
      O('不去，便宜没好货|Pass — too good to be true', R('后来听说团里的人都被拉去购物了。|You later heard the group spent the whole trip in shops.', { smarts: 1 }))
    ], { era: { g: 1975, cn: 1995 } }),
    E('o_wander', [78, 110], '走失|Lost', '🧭', '你出门买菜，却怎么也想不起回家的路。|You went out for groceries and couldn\'t remember the way home.', [
      O('（你在街头徘徊……）|(You wander the streets...)', function (c) { if (G.ch(.85)) { H.fx(c, { happy: -6, kids: 3 }); return '天黑后，警察和家人找到了你。孩子们抱着你哭了。|After dark, the police and your family found you. Your children wept as they held you.'; } H.fx(c, { health: -10, happy: -8 }); return '你在外面过了一夜，受了风寒。|You spent the night outside and caught a bad chill.'; })
    ], { bad: 1, if: function (S, p) { return p.ill.some(function (x) { return x.id === 'alz'; }); } }),
    E('o_album', [65, 110], '老照片|Old Photographs', '🖼️', '整理旧物时，你翻出了一本泛黄的相册。|Tidying up, you find a yellowed photo album.', [
      O('慢慢翻看|Take your time with it', function (c) { var ex = N.rel('ex')[0], par = N.rel('father', 'mother')[0]; H.fx(c, { happy: 4 }); if (ex && G.ch(.5)) { c.prm.n = ex.name; return '你看到了和{n}的合影，愣了很久。|You found a photo with {n} and stared at it for a long time.'; } if (par) { c.prm.n = par.name; return '照片里年轻的{n}抱着小小的你，笑得那么灿烂。|In the photo, a young {n} is holding tiny you, smiling so brightly.'; } return '照片里的每一张脸，都是一段回忆。|Every face in those photos is a memory.'; }),
      O('拿给孙辈讲故事|Show it to the grandkids', R('孩子们听得入了迷，问你“那时候真的没有手机吗？”|The kids were spellbound: "You really didn\'t have phones back then?"', { happy: 6, kids: 3 }), { if: function () { return grandkids().length > 0; } })
    ]),
    E('o_lastwish', [85, 120], '最后的心愿|A Last Wish', '🌅', '你知道自己的时间不多了。还有什么想做的吗？|You know your time is short. Is there anything left you want to do?', [
      O('回一趟故乡|Visit your hometown', R('故乡的老树还在，你在树下坐了一下午。|The old tree in your hometown still stands. You sat beneath it all afternoon.', { happy: 10, money: -500 })),
      O('去看一次大海|See the ocean one more time', R('海风吹在脸上，你笑得像个孩子。|The sea breeze on your face made you laugh like a child.', { happy: 10, money: -800 })),
      O('把家人都叫到身边|Gather the whole family', R('满屋子的人，满屋子的笑声。|A house full of people, a house full of laughter.', { happy: 12, kids: 8 }), { if: function () { return kids().length > 0; } })
    ], { good: 1 }),
    E('o_volunteer', [60, 85], '银发志愿者|Silver-Haired Volunteer', '🧡', '社区在招募老年志愿者，帮忙照看放学的孩子。|The community is recruiting senior volunteers to watch kids after school.', [
      O('报名|Sign up', R('孩子们都叫你“{g}”，你每天都乐呵呵的。|The kids all call you "{g}," and you\'re cheerful every day.', { happy: 6, karma: 5, health: 1 })),
      O('没兴趣|Not interested', R('你继续过自己的日子。|You carry on with your own routine.', {}))
    ], { prep: function (c) { c.prm.g = c.p.g === 'm' ? '老爷爷|Grandpa' : '老奶奶|Grandma'; } }),
    E('o_80', [80, 80], '八十大寿|Your 80th Birthday', '🎉', '今天是你的八十大寿。|Today you turn eighty.', [
      O('（吹蜡烛）|(Blow out the candles)', function (c) { var k = kids().length, g = grandkids().length, sp = N.spouse(); H.fx(c, { happy: 8 }); if (k + g >= 4) { c.prm.k = k + g; return '{k}个儿孙围坐一桌，给你唱生日歌，你笑得合不拢嘴。|{k} children and grandchildren gathered around the table to sing to you. You couldn\'t stop smiling.'; } if (sp) return '老伴给你煮了一碗长寿面。这么多年，还是这个味道。|Your spouse made you longevity noodles. After all these years, they still taste the same.'; return '你给自己买了一块小蛋糕，对着窗外许了个愿。|You bought yourself a little cake and made a wish at the window.'; })
    ], { w: 12 }),
    E('o_tech', [60, 90], '孙辈教你上网|The Grandkids Teach You Tech', '💻', '{n}耐心地教你用电脑和手机。|{n} patiently teaches you to use the computer and phone.', [
      O('认真学|Study hard', R('你学会了视频通话，还在网上找到了失散多年的老同学！|You learned video calls — and found a long-lost classmate online!', { happy: 6, smarts: 1, npc: 8 })),
      O('“太难了，不学了”|"Too hard, forget it"', R('{n}有点失望，不过还是每周来看你。|{n} was a little disappointed but still visits every week.', { npc: -2 }))
    ], { era: { g: 2005, cn: 2008 }, prep: function (c) { var g = grandkids().filter(function (n) { return N.age(n) >= 10; }); if (!g.length) return false; c.npc = G.pick(g); c.prm.n = c.npc.name; }, if: function () { return grandkids().some(function (n) { return N.age(n) >= 10; }); } })
  ]);
})();
