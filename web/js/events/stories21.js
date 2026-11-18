/* Version 2.0 stories: every identity lives its own year.
   - G.identity() names who you are right now (monarch, royal, spy, spy family, red second generation, prisoner, general,
     official, soldier, police, tycoon, star, nanny, student, elder, ordinary).
   - Each identity has its own pool of storylines; for the defining identities, the year's events come from that pool
     first, and only fall back to everyday events when it runs dry. Events tagged for one identity never reach another.
   - Every New Year opens with a scene that belongs to that identity alone.
   - The nanny storyline: go to work in a wealthy household, meet the master of the house, and decide who you'll be. */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  function S() { return G.S; }
  function P() { return G.S && G.S.p; }
  function q(id, nid, prm) { var s = S(); (s.pendQ = s.pendQ || []).push({ id: id, nid: nid, prm: prm }); }

  /* ===================== who you are ===================== */
  G.identity = function () {
    var p = P(), s = S(); if (!p) return 'common';
    if (p.jail) return 'prison';
    if (p.flags.monarch) return 'monarch';
    if (p.spy && !p.spy.youth) return 'spy';
    if (p.origin === 'royal' && !p.flags.exRoyal) return 'royal';
    if (p.mil && p.mil.off && p.mil.rank >= 6) return 'general';
    if (p.gov && p.gov.rank >= 4) return 'official';
    if (p.origin === 'red') return 'red';
    if ((p.spy && p.spy.youth) || p.flags.spyfam || p.origin === 'spyfam') return 'spyfam';
    if (p.flags.nanny && s.npcs[p.flags.nanny.nid]) return 'nanny';
    if (p.mil) return 'soldier';
    if (p.pol) return 'police';
    if (G.netWorth() > G.$(5e7)) return 'tycoon';
    if (p.st.fame >= 70) return 'star';
    if (p.age < 12) return 'child';
    if (G.school && G.school.isStudent && G.school.isStudent()) return 'student';
    if (p.age >= 65) return 'elder';
    return 'common';
  };
  var STRONG = { prison: 1, monarch: 1, spy: 1, royal: 1, general: 1, official: 1, red: 1, spyfam: 1, nanny: 1, tycoon: 1, star: 1 };
  function whoOk(d, id) { var w = d.who; if (!w) return true; return Array.isArray(w) ? w.indexOf(id) >= 0 : w === id; }
  var idc = { k: null, v: null };
  function idNow() { var s = S(), p = s && s.p; if (!p) return 'common'; var k = s.year + ':' + p.age + ':' + (p.jail ? 1 : 0) + ':' + (p.spy ? 1 : 0) + ':' + (p.flags.monarch ? 1 : 0); if (idc.k !== k) { idc.k = k; idc.v = G.identity(); } return idc.v; }
  G.idNow = idNow;
  var el = G.eligible;
  G.eligible = function (d, S2) { if (d && d.who && !whoOk(d, idNow())) return false; return el.apply(this, arguments); };
  var pick = G.pickRandomEvents;
  G.pickRandomEvents = function (n) {
    idc.k = null; var out = pick.apply(this, arguments) || [], s = S(), id = idNow();
    var SOFT = { student: .6, elder: .6, soldier: .6, police: .6, child: .35, common: .3 };
    if (!STRONG[id] && !SOFT[id]) return out;
    // the year belongs to who you are: identity storylines first, everyday ones only to fill gaps
    var pool = G.EVL.filter(function (d) { return d.who && whoOk(d, id) && G.eligible(d, s) && out.indexOf(d) < 0; });
    var res = [];
    for (var i = 0; i < Math.max(1, out.length); i++) {
      if (pool.length && (STRONG[id] || G.ch(SOFT[id] || .6))) { var d = G.wpick(pool, function (x) { return G.weight(x, s); }); res.push(d); pool = pool.filter(function (x) { return x !== d; }); }
      else if (out[i] && !/^(spy_case)$/.test(out[i].id) && (!STRONG[id] || !/^(dl_|a_|x_|t_)/.test(out[i].id))) res.push(out[i]);
    }
    // a scheduled spy field test is never dropped
    out.forEach(function (d) { if (d && d.id === 'spy_case' && res.indexOf(d) < 0) res.unshift(d); });
    return res.length ? res : out;
  };

  /* helpers */
  function X(id, who, a, title, icon, t, opts, ex) {
    return E(id, a, title, icon, t, opts.map(function (o) { return O(o[0], typeof o[1] === 'function' ? o[1] : R(o[2], o[1] || {})); }), Object.assign({ who: who, rep: 0, w: 3 }, ex || {}));
  }
  function mkNpc(c, o) { var p = c.p, g = o.g || (p.orient === 'gay' ? p.g : p.orient === 'bi' ? (G.ch(.5) ? 'm' : 'f') : (p.g === 'm' ? 'f' : 'm')); var n = N.make({ rel: o.rel || 'contact', g: g, age: p.age + G.ri(o.d0 == null ? -5 : o.d0, o.d1 == null ? 6 : o.d1), aff: o.aff || G.ri(25, 45), c: o.c || p.country }); n.pin = 1; if (o.job) n.job = o.job; if (o.love) n.love = o.love; c.prm.n = n.name; c.prm.nid = n.id; return n; }
  function nAff(c, v) { var n = S().npcs[c.prm.nid]; if (n) G.dPush('aff', N.addAff(n, v)); return n; }

  /* ===================== red second generation ===================== */
  G.evs([
    X('rd_compound', 'red', [5, 12], '大院里的孩子|Children of the Compound', '🏘️', '大院里，几个孩子在比谁的爷爷官大。一个男孩冲你喊：“你爷爷是什么级别的？”|In the compound, kids are comparing whose grandfather outranks whose. A boy shouts: "What rank is your grandpa?"', [
      ['“我爷爷说，不许比这个。”|"Grandpa says we don\'t compare that."', { eq: 4, karma: 3 }, '那个男孩愣住了。后来，他成了你最好的朋友。|The boy was stunned. Later he became your best friend.'],
      ['报出爷爷的职务|Name Grandpa\'s post', { fame: 1, karma: -2 }, '孩子们都不说话了。晚上，爷爷知道了，罚你在书房站了一个小时。|The others went quiet. That night Grandpa heard about it and made you stand in his study for an hour.']
    ]),
    X('rd_grandpa_war', 'red', [6, 14], '爷爷的伤疤|Grandpa\'s Scar', '🎖️', '夏天，爷爷挽起裤腿，你第一次看到他腿上那道很长的伤疤。|One summer Grandpa rolls up his trousers and you see the long scar on his leg for the first time.', [
      ['问它是怎么来的|Ask how it happened', { smarts: 2, eq: 3 }, '爷爷讲了一下午。最后说：“我们拼命，是为了让你们不用再拼命。”|Grandpa talked all afternoon, ending: "We fought so that you would never have to."'],
      ['给它贴一个创可贴|Put a plaster on it', { happy: 4 }, '爷爷笑得眼泪都出来了，把你抱上了膝盖。|Grandpa laughed till he cried and pulled you onto his knee.']
    ]),
    X('rd_parade_seat', 'red', [8, 20], '观礼台|The Reviewing Stand', '🎆', '国庆观礼，家里有一张观礼台的票。爸爸问你想不想去。|National Day: the family has one ticket for the reviewing stand. Dad asks if you want to go.', [
      ['去|Go', { happy: 10, fame: 1 }, '方阵走过的时候，坐在你旁边的老人一直在敬礼。后来你才知道，他是爷爷的老战友。|As the columns passed, the old man beside you saluted the whole time. Later you learned he was Grandpa\'s comrade.'],
      ['把票让给奶奶|Give the ticket to Grandma', { eq: 4, karma: 3 }, '奶奶回来后，说那是她这辈子最骄傲的一天。|Grandma came home saying it was the proudest day of her life.']
    ]),
    X('rd_low_profile', 'red', [15, 25], '家规|The House Rule', '📜', '爸爸把你叫进书房：“出门在外，不许提家里任何人的名字。谁问都不许。”|Dad calls you into the study: "Out in the world you never mention anyone in this family. No matter who asks."', [
      ['“我明白。”|"I understand."', { eq: 4, karma: 2 }, '大学四年，没有一个同学知道你的家世。|Through four years of university, not one classmate knew your background.'],
      ['“为什么？这又不丢人。”|"Why? It\'s nothing to be ashamed of."', { smarts: 2 }, '爸爸看了你很久：“越是有人看着，越要走得稳。”|Dad looked at you a long time. "The more eyes on you, the steadier you must walk."']
    ]),
    X('rd_backdoor', 'red', [18, 40], '一个电话的事|Just One Phone Call', '☎️', '你差一点没考上想去的单位。妈妈说：“我给你张叔叔打个电话就行。”|You narrowly missed the post you wanted. Mum says: "I\'ll just call Uncle Zhang."', [
      ['“不用，明年我再考。”|"No. I\'ll sit it again next year."', { karma: 5, smarts: 2 }, '第二年你考上了第一名。张叔叔后来听说这事，特意来家里吃了顿饭。|The next year you came first. Uncle Zhang heard and came round for dinner specially.'],
      ['默许|Say nothing', { money: 0, karma: -5 }, '一个星期后，你收到了录用通知。你总觉得同事们看你的眼神不太一样。|A week later the offer arrived. You always felt colleagues looked at you differently.']
    ]),
    X('rd_circle', 'red', [18, 35], '子弟圈|The Inner Circle', '🥂', '一个从小一起长大的发小约你去一个私人会所，说“大家都在”。|A childhood friend from the compound invites you to a private club: "Everyone will be there."', [
      ['去看看|Go along', function (c) { var n = mkNpc(c, { rel: 'friend', g: G.ch(.5) ? 'm' : 'f', job: '某部委干部|Ministry Official', aff: 50 }); H.fx(c, { eq: 2, happy: 4 }); return '你认识了{n}。在这里，几句闲聊就能定下一件大事。|You met {n}. Here, a few words over drinks could settle big things.'; }],
      ['婉拒|Decline', { karma: 2, smarts: 1 }, '发小有点失望：“你还是这么怪。”|Your friend was a little disappointed. "Still the odd one out."']
    ]),
    X('rd_match', 'red', [24, 38], '门当户对|A Suitable Match', '💐', '奶奶托人给你介绍了一位对象，也是大院出身，家里是“世交”。|Grandma has arranged an introduction: another child of the compound, from a family "close for three generations".', [
      ['去见一面|Meet them', function (c) { var n = mkNpc(c, { rel: 'crush', d0: -3, d1: 4, job: '外交部司局干部|Foreign Ministry Official', love: 35, aff: 40 }); n.tags = ['red']; return '{n}比你想的有趣得多。吃完饭，你们沿着护城河走了两圈。|{n} was far more interesting than you expected. After dinner you walked twice round the moat.'; }],
      ['“我想自己找。”|"I\'d rather find someone myself."', { happy: 2 }, '奶奶叹了口气：“你们这一代啊。”|Grandma sighed: "Your generation…"']
    ]),
    X('rd_career', 'red', [21, 30], '三条路|Three Roads', '🛤️', '家族晚饭上，大伯问你：从政、从军、还是下海？|At a family dinner your uncle asks: politics, the army, or business?', [
      ['从政|Politics', function (c) { c.p.flags.redPath = 'gov'; H.fx(c, { eq: 3 }); return '大伯点点头：“从基层干起。别让人说你是靠家里。”|Your uncle nodded. "Start at the bottom. Don\'t let anyone say you leaned on the family."'; }],
      ['从军|The army', function (c) { c.p.flags.redPath = 'mil'; H.fx(c, { health: 2 }); return '爷爷把他的旧军帽给了你。|Grandpa gave you his old army cap.'; }],
      ['下海经商|Business', function (c) { c.p.flags.redPath = 'biz'; H.fx(c, { smarts: 2 }); return '爸爸只说了一句：“守法。”|Dad said only: "Stay within the law."'; }]
    ]),
    X('rd_inspection', 'red', [30, 70], '谈话|A Conversation', '🔍', '纪委的人约你“谈一谈”，问的是你一个亲戚的事。|The discipline commission asks you in "for a chat" about a relative of yours.', [
      ['如实说|Tell the truth', { karma: 6, stress: 8 }, '亲戚被处理了，家里有人很久不和你说话。可你睡得很安稳。|The relative was disciplined; some of the family didn\'t speak to you for a long time. But you slept soundly.'],
      ['说不清楚|Claim not to know', RC(.6, '谈话结束了，什么也没发生。|The conversation ended; nothing happened.', { stress: 4 }, '他们拿出了一份你签过字的文件。|They produced a document bearing your signature.', { stress: 20, fame: -8 })]
    ]),
    X('rd_old_leader', 'red', [25, 80], '老首长的寿宴|An Old Leader\'s Birthday', '🍑', '爷爷的老首长九十大寿。来的人里，有一半你只在新闻里见过。|Grandpa\'s old commander turns ninety. Half the guests you have only seen on the news.', [
      ['替爷爷敬酒|Toast on Grandpa\'s behalf', function (c) { H.fx(c, { eq: 4, fame: 2 }); if (c.p.gov) c.p.gov.perf = Math.min(100, c.p.gov.perf + 8); return '老人拉着你的手：“像你爷爷年轻的时候。”第二天，好几个人给你打了电话。|The old man held your hand: "Just like your grandfather when he was young." The next day several people called you.'; }],
      ['安静地坐在角落|Sit quietly in a corner', { smarts: 2 }, '你听到了很多以后用得上的话。|You overheard a great deal that would prove useful.']
    ]),
    X('rd_village', 'red', [22, 50], '回老区|Back to the Old Base', '⛰️', '爷爷当年打仗的那个山村，至今还没通公路。|The mountain village where Grandpa fought all those years ago still has no road.', [
      ['自掏腰包修一条路|Pay for a road yourself', { money: -300000, karma: 8, fame: 3 }, '通车那天，全村人都来了。村口立了一块碑，写着你爷爷的名字。|On opening day the whole village came. A stone at the entrance bore your grandfather\'s name.'],
      ['去当一年驻村干部|Spend a year there as a village official', { health: -2, eq: 5, karma: 5 }, '你走的时候，村里的孩子追着车跑了两里地。|When you left, the village children chased the car for a kilometre.']
    ]),
    X('rd_memoir', 'red', [35, 80], '回忆录|The Memoir', '📖', '爷爷想出一本回忆录，让你帮忙整理。里面有些事，和课本上写的不一样。|Grandpa wants to publish a memoir and asks you to help. Some of it differs from the textbooks.', [
      ['原原本本地整理|Record it exactly as he tells it', { smarts: 3, eq: 3 }, '书最后没能出版。爷爷说：“没关系，你知道就行。”|The book was never published. Grandpa said: "No matter. As long as you know."'],
      ['劝他删掉敏感的部分|Persuade him to cut the sensitive parts', { fame: 2 }, '书出版了，很受欢迎。爷爷翻着样书，一句话也没说。|It was published and sold well. Grandpa leafed through the copy without a word.']
    ]),
    X('rd_abroad', 'red', [17, 30], '出国|Going Abroad', '✈️', '你拿到了国外名校的录取通知。家里有人说：“我们家的孩子，最好别出去。”|You\'ve been admitted to a top university abroad. Someone in the family says: "Children of this house are better off staying."', [
      ['去，学成回来|Go, and come back', { smarts: 5, eq: 2 }, '你去了，四年后回来了。机场来接你的是爷爷的司机。|You went, and came home four years later. Grandpa\'s driver met you at the airport.'],
      ['留下|Stay', { karma: 2 }, '你在国内读完了大学。大伯说你“懂事”。|You studied at home. Your uncle called you "sensible".']
    ]),
    X('rd_grandpa_end', 'red', [20, 60], '最后的嘱托|Last Wishes', '🕯️', '爷爷住进了特护病房。他把你叫到床边，只说了一句话。|Grandpa is in the special ward. He calls you to his bedside and says just one sentence.', [
      ['俯下身去听|Lean in to listen', { eq: 6, karma: 4 }, '“别丢了根。”你握着他的手，直到护士来叫。|"Don\'t lose your roots." You held his hand until the nurse came.']
    ], { rep: 0, w: 2 })
  ]);

  /* ===================== spy family (childhood and youth) ===================== */
  G.evs([
    X('sf_code', 'spyfam', [6, 12], '生日卡|The Birthday Card', '💌', '妈妈出差回不来，寄来一张生日卡。卡上的花纹，好像是一串点和线。|Mum is away on your birthday and sends a card. The pattern on it looks like dots and dashes.', [
      ['自己学着破译|Teach yourself to decode it', { smarts: 5 }, '你翻了一晚上的书，译出来是：“生日快乐，我的小特工。”|You spent the night with a library book. It read: "Happy birthday, my little agent."'],
      ['拿去问爸爸|Ask Dad', { par: 4 }, '爸爸看了一眼就笑了，然后教了你整整一个周末。|Dad glanced at it, smiled — and taught you all weekend.']
    ]),
    X('sf_drill', 'spyfam', [7, 14], '“安全演习”|The "Safety Drill"', '🚪', '半夜，爸爸把你摇醒：“三分钟，背包，后门。不许开灯。”|Midnight. Dad shakes you awake: "Three minutes. Backpack. Back door. No lights."', [
      ['照做|Do it', { smarts: 3, stress: 3 }, '两分四十秒，你站在了后院。爸爸摸摸你的头：“很好。希望永远用不上。”|Two minutes forty and you were in the back yard. Dad ruffled your hair: "Good. I hope you never need it."'],
      ['问为什么|Ask why', { eq: 2 }, '“因为爸爸的工作。”他没再多说一个字。|"Because of Dad\'s work." He said nothing more.']
    ]),
    X('sf_follow', 'spyfam', [9, 16], '放学路上|On the Way Home', '👣', '你发现，同一个戴帽子的男人，三天都跟在你后面。|For three days, the same man in a cap has walked behind you after school.', [
      ['用妈妈教的办法绕路|Lose him the way Mum taught you', { smarts: 4 }, '你穿过菜市场、换了两路公交。到家时，妈妈在窗口对你点了点头——那个人，是她安排的考试。|Through the market, two bus changes. At home Mum nodded from the window — the man had been her test.'],
      ['跑去警察局|Run to the police station', { stress: 3 }, '警察打了个电话，然后客气地把你送回了家。爸爸说：“下次，先打给我。”|The officer made one call, then politely drove you home. Dad said: "Next time, call me first."']
    ]),
    X('sf_dinner_guest', 'spyfam', [10, 18], '爸爸的同事|Dad\'s Colleague', '🍷', '爸爸的一位“同事”来家里吃饭。他说了五种语言，每一种都像母语。|One of Dad\'s "colleagues" comes for dinner. He speaks five languages, each like a native.', [
      ['缠着他教你一句外语|Badger him for a phrase', { smarts: 3, happy: 4 }, '他教了你一句俄语：“我什么都不知道。”大家都笑了。|He taught you a phrase in Russian: "I know nothing." Everyone laughed.'],
      ['注意他左手的戒指|Notice the ring on his left hand', { smarts: 4 }, '临走时，他对爸爸说：“这孩子的眼睛，跟你一样。”|Leaving, he told Dad: "The child has your eyes."']
    ]),
    X('sf_gone_week', 'spyfam', [8, 18], '空房子|The Empty House', '🏠', '爸妈同时“出差”了，留下一张字条和一张银行卡。一个星期没有任何消息。|Both parents are "on a business trip". They left a note and a bank card. A week with no word.', [
      ['照常上学|Go to school as usual', { eq: 4, stress: 4 }, '第八天晚上，门开了。妈妈的手上缠着绷带，什么也没解释。|On the eighth night the door opened. Mum\'s hand was bandaged. She explained nothing.'],
      ['打字条上的紧急电话|Ring the emergency number on the note', { stress: 2 }, '电话那头的声音说：“他们很好。三天后到家。”说完就挂了。|A voice said: "They\'re fine. Home in three days." Then the line went dead.']
    ]),
    X('sf_interpret', 'spyfam', [16, 25], '酒会上的翻译|Interpreting at the Reception', '🥂', '妈妈带你去一个外交酒会“帮忙翻译”。她让你特别留意一位穿灰西装的客人说的每一句话。|Mum takes you to a diplomatic reception "to help interpret". She asks you to note every word a guest in a grey suit says.', [
      ['一字不漏地记下来|Remember every word', function (c) { H.fx(c, { smarts: 4 }); if (c.p.spy) if (c.p.spy) c.p.spy.merit += 6; return '回家的车上，妈妈听完你复述，只说了一个字：“好。”|In the car home Mum listened to your account and said a single word: "Good."'; }],
      ['专心做好翻译|Just interpret well', { eq: 3 }, '那位客人夸你翻得好，给了你一张名片。妈妈把名片收走了。|The guest praised your interpreting and gave you his card. Mum confiscated it.']
    ]),
    X('sf_lie', 'spyfam', [10, 17], '识破谎言|Spotting a Lie', '🧐', '妈妈和你玩一个游戏：她说三句话，其中一句是假的。|Mum plays a game: she says three things, one of them false.', [
      ['盯着她的手|Watch her hands', { smarts: 3, eq: 3 }, '你赢了。妈妈说，你是她教过的人里最快的。|You won. Mum said you were the fastest she\'d ever taught.'],
      ['听她的语气|Listen to her tone', { eq: 4 }, '你错了。妈妈笑：“真正会骗人的，语气最真诚。”|You were wrong. Mum laughed: "The best liars sound the most sincere."']
    ]),
    X('sf_new_name', 'spyfam', [8, 16], '新名字|A New Name', '🪪', '一个深夜，爸妈说全家要搬到另一座城市，而且从明天起，你要用一个新名字。|Late one night your parents say the family is moving to another city — and from tomorrow, you have a new name.', [
      ['练习新名字的签名|Practise signing your new name', { smarts: 2, stress: 5 }, '你在新学校里交了新朋友。只是偶尔，有人叫你旧名字时，你会下意识回头。|You made new friends at a new school. Only sometimes, when someone said your old name, you turned without thinking.'],
      ['哭着不肯走|Refuse to go, in tears', { happy: -6 }, '你最后还是走了。最好的朋友，你再也没能联系上。|You went in the end. You never reached your best friend again.']
    ]),
    X('sf_hurt', 'spyfam', [12, 30], '受伤|The Wound', '🩹', '爸爸回来时，衬衫上有血。他说是“车祸”，可你看见了缝合的弹孔。|Dad comes home with blood on his shirt. "A car accident," he says — but you see the stitched bullet wound.', [
      ['什么都不问，给他换药|Ask nothing; change his dressing', { eq: 5, par: 6 }, '他睡着前说：“谢谢你，没问。”|Before he slept he said: "Thank you for not asking."'],
      ['要他答应不再去|Make him promise to stop', { par: 2 }, '他沉默了很久：“还有最后一件事要做完。”|He was silent a long time. "There\'s one last thing I have to finish."']
    ]),
    X('sf_retire', 'spyfam', [20, 60], '退休的特工|Retired Spies', '🎣', '爸妈退休了。他们在海边买了一套小房子，每天钓鱼、下棋——但房子装了三套监控。|Your parents have retired to a cottage by the sea: fishing, chess — and three separate camera systems.', [
      ['陪他们住一个月|Stay with them a month', { happy: 8, par: 6 }, '最后一晚，爸爸终于讲了一个他当年的故事。你一夜没睡。|On the last night Dad finally told you one of his stories. You didn\'t sleep at all.'],
      ['劝他们把监控拆了|Tell them to take the cameras down', { eq: 2 }, '妈妈笑了：“干我们这行的，退休了也睡不踏实。”|Mum laughed. "In our line, you never sleep easy, retired or not."']
    ])
  ]);

  /* ===================== working spies ===================== */
  G.evs([
    X('sp_cover_love', 'spy', [22, 55], '掩护身份|The Cover', '💍', '组织给你安排了一个新任务：和另一名特工假扮夫妻，在国外生活三年。|A new assignment: pose as a married couple with another agent and live abroad for three years.', [
      ['接受|Accept', function (c) { var n = mkNpc(c, { rel: 'crush', d0: -4, d1: 5, job: '情报特工|Intelligence Officer', love: 30, aff: 40 }); n.tags = n.tags || []; if (c.p.spy) c.p.spy.merit += 6; G.dPush('merit', 6); return '你的“配偶”是{n}。三年里，你们一起吃了一千顿饭。有时候你会忘了，这只是任务。|Your "spouse" was {n}. Over three years you ate a thousand meals together. Sometimes you forgot it was only a mission.'; }],
      ['申请换人|Ask for someone else', { stress: 2 }, '上级皱了皱眉：“这不是相亲。”|Your handler frowned. "This isn\'t a dating service."']
    ]),
    X('sp_handler', 'spy', [22, 55], '你的联络人|Your Handler', '📞', '每个月，你和联络人只在公园长椅上见十分钟。今天，ta多坐了一会儿。|Each month you and your handler meet for ten minutes on a park bench. Today they stay longer.', [
      ['问ta的真名|Ask their real name', function (c) { var n = mkNpc(c, { rel: 'crush', d0: -5, d1: 8, job: '情报联络人|Intelligence Handler', love: 40, aff: 45 }); return '{n}看了你很久，告诉了你。那是你们之间第一个违反规定的秘密。|{n} looked at you a long while, then told you. It was the first rule you broke together.'; }],
      ['按规矩离开|Leave as the rules say', { smarts: 2 }, '你起身离开，没有回头。|You stood and left without looking back.']
    ]),
    X('sp_honeytrap', 'spy', [20, 50], '美人计|The Honey Trap', '🌹', '酒店大堂里，一个过分完美的陌生人主动和你搭话。|In a hotel lobby, a stranger who is a little too perfect strikes up a conversation.', [
      ['将计就计|Play along — and turn it', RC(function (c) { return .4 + c.p.st.smarts / 250; }, '第三次见面，你把对方策反了。|By the third meeting you had turned them.', { smarts: 3, fame: 0 }, '你醒来时，公文包里的文件少了两页。|You woke to find two pages missing from your briefcase.', { stress: 15 })],
      ['礼貌地离开|Leave politely', { karma: 2 }, '你回房间写了一份报告。第二天，那个人从酒店消失了。|You wrote a report in your room. The next day the stranger had vanished from the hotel.']
    ]),
    X('sp_deaddrop', 'spy', [20, 60], '死信箱|The Dead Drop', '🪨', '公园第三张长椅下的那块松动的砖，今天是空的。已经第二周了。|The loose brick under the third park bench is empty again — the second week running.', [
      ['按程序报告|Report it by the book', { smarts: 2 }, '总部查了一个月：你的联络人被捕了。他什么都没有说。|HQ investigated for a month: your contact had been arrested. He said nothing.'],
      ['亲自去他家附近看看|Check near his home yourself', RC(.5, '你远远看见他在阳台上浇花，打了一个约定的手势：安全。|From afar you saw him watering plants and giving the agreed sign: safe.', { stress: 4 }, '他家楼下停着三辆车。你转身就走，换了身份离开了这座城市。|Three cars waited below his flat. You turned, changed identity and left the city.', { stress: 15 })]
    ]),
    X('sp_mole', 'spy', [28, 65], '内鬼|The Mole', '🐀', '总部认定站里有内鬼。名单上有五个人——包括你最好的朋友，也包括你。|HQ is certain there\'s a mole in the station. Five names on the list — your best friend\'s, and yours.', [
      ['主动接受测谎|Volunteer for the polygraph', RC(.75, '你通过了。三个月后，内鬼被找到了——是你最没想到的那个人。|You passed. Three months later the mole was found — the last person you\'d have guessed.', { stress: 8 }, '测谎仪的指针乱跳。你被停职调查了半年，最后才洗清嫌疑。|The needle jumped. You were suspended for six months before you were cleared.', { stress: 20, happy: -10 })],
      ['暗中自己查|Investigate quietly yourself', function (c) { if (c.p.spy) c.p.spy.merit += 10; G.dPush('merit', 10); H.fx(c, { stress: 10, smarts: 2 }); return '你在一份报销单上发现了破绽。内鬼落网那天，局长亲自给你打了电话。|You found the flaw in an expense claim. The day the mole was taken, the director phoned you himself.'; }]
    ]),
    X('sp_wedding', 'spy', [25, 60], '婚礼上的任务|A Job at the Wedding', '💒', '你最好的朋友结婚，可你同一天接到了任务：目标就在婚礼宾客里。|Your best friend\'s wedding — and the same day, an assignment: the target is among the guests.', [
      ['边当伴郎/伴娘边完成任务|Be in the wedding party and do the job', RC(.6, '交换戒指的时候，你拿到了你要的东西。没有人发现。|During the ring exchange you got what you came for. Nobody noticed.', { stress: 6 }, '你在关键时刻离席，朋友到现在还在怪你。|You slipped out at the crucial moment; your friend has never forgiven you.', { stress: 10, happy: -6 })],
      ['申请让别人来|Ask for someone else to do it', { happy: 6 }, '你在婚礼上哭得比新人还厉害。|You cried harder than the couple at the wedding.']
    ])
  ]);

  /* ===================== royals (not reigning) and monarchs ===================== */
  function royalOrMon(S2, p) { return (p.origin === 'royal' && !p.flags.exRoyal) || !!p.flags.monarch; }
  G.evs([
    X('ry_hunt', ['royal', 'monarch'], [14, 75], '秋季狩猎|The Autumn Hunt', '🦌', '王室的秋季狩猎开始了。猎场里，新来的猎场看守为你牵马。|The royal autumn hunt begins. A new gamekeeper leads your horse.', [
      ['和看守聊一路|Talk with the keeper all the way', function (c) { var n = mkNpc(c, { rel: 'crush', d0: -3, d1: 5, job: '王室猎场看守|Royal Gamekeeper', love: 30, aff: 40 }); n.commoner = 1; return '{n}比任何宫廷教师都懂这片森林。回城的路上，你一直在想ta的笑容。|{n} knew the forest better than any palace tutor. All the way back you kept thinking of their smile.'; }],
      ['专心打猎|Focus on the hunt', { health: 2, happy: 6 }, '你打到了一头雄鹿，鹿角挂进了狩猎厅。|You brought down a stag; its antlers went up in the hunting hall.'],
      ['放走瞄准的鹿|Let the deer go', { karma: 4, eq: 2 }, '第二天报纸写：“心软的王室成员”。民调里你的好感度涨了。|The next day\'s papers: "The soft-hearted royal." Your approval rose.']
    ]),
    X('ry_ranch', ['royal', 'monarch'], [10, 80], '高原牧场|The Highland Estate', '🐑', '夏天，你在王室的高原牧场住了一个月。|You spend a summer month at the royal highland estate.', [
      ['跟牧羊人一起放羊|Herd sheep with the shepherd', function (c) { var n = mkNpc(c, { rel: 'friend', d0: -4, d1: 6, job: '牧羊人|Shepherd', aff: 45 }); H.fx(c, { health: 3, happy: 6 }); return '{n}教你吹口哨唤羊。那是你一年里最自由的一个月。|{n} taught you to whistle up the flock. It was the freest month of your year.'; }],
      ['骑马跑遍整个庄园|Ride every corner of the estate', { health: 4, happy: 5 }, '你在山顶看到了整片庄园。有那么一刻，你忘了自己是谁。|From the hilltop you saw the whole estate, and for a moment forgot who you were.']
    ]),
    X('ry_maid', ['royal', 'monarch'], [16, 60], '新来的侍从|The New Attendant', '🫖', '宫里新来了一位侍从，每天早上为你送茶。ta总是在你看书的时候，多停留一秒。|A new attendant brings your morning tea, and always lingers a second when you\'re reading.', [
      ['请ta坐下聊聊|Ask them to sit and talk', function (c) { var n = mkNpc(c, { rel: 'crush', d0: -4, d1: 4, job: '宫廷侍从|Palace Attendant', love: 35, aff: 40 }); n.commoner = 1; return '{n}讲起了宫墙外的生活：地铁、夜市、廉价的电影票。你听得入了迷。|{n} talked about life outside the walls: the metro, night markets, cheap cinema tickets. You were spellbound.'; }],
      ['保持距离|Keep your distance', { eq: 2 }, '你说了声谢谢，把视线移回书上。|You said thank you and returned to your book.']
    ]),
    X('ry_commoner_love', ['royal', 'monarch'], [18, 60], '反对声|The Objections', '📰', '你和一位平民恋爱的消息传了出去。宫务大臣、议会、小报——几乎所有人都在反对。|Word of your romance with a commoner is out. The Lord Chamberlain, parliament, the tabloids — nearly everyone objects.', [
      ['公开站在ta身边|Stand by them in public', function (c) { var n = S().npcs[c.prm.nid]; if (n) { n.love = Math.min(100, (n.love || 0) + 20); N.addAff(n, 10); } H.fx(c, { fame: 6, stress: 12 }); return '你牵着{n}的手出现在慈善晚会上。第二天，民调里支持你的人比反对的多。|You arrived at a charity gala holding {n}\'s hand. The next day\'s poll showed more for you than against.'; }],
      ['暂时分开|Step apart for now', function (c) { var n = S().npcs[c.prm.nid]; if (n) { n.love = Math.max(0, (n.love || 0) - 20); n.rel = n.rel === 'lover' ? 'ex' : n.rel; } H.fx(c, { happy: -12 }); return '{n}说理解你。挂掉电话后，你在窗前坐到了天亮。|{n} said they understood. After the call you sat by the window until dawn.'; }]
    ], { prep: function (c) { var n = N.all(function (x) { return x.alive && x.commoner && ['crush', 'lover', 'admirer'].indexOf(x.rel) >= 0; })[0]; if (!n) return false; c.prm.nid = n.id; c.prm.n = n.name; }, w: 5 }),
    X('ry_butler', ['royal', 'monarch'], [8, 90], '老管家|The Old Butler', '🤵', '服侍了三代人的老管家要退休了。他想送你一样东西。|The butler who served three generations is retiring. He wants to give you something.', [
      ['收下|Accept it', { eq: 4, happy: 4 }, '那是一本笔记，记着你从小到大的每一个生日愿望。|It was a notebook recording every birthday wish you\'d ever made.'],
      ['请他留下来当顾问|Ask him to stay on as an adviser', { eq: 3, smarts: 2 }, '他留下了。宫里最难办的事，后来都是他悄悄帮你办好的。|He stayed. The palace\'s hardest problems, he quietly solved for you.']
    ]),
    X('ry_nanny', ['royal', 'monarch'], [4, 12], '保姆的秘密|Nanny\'s Secret', '🧸', '你的保姆偷偷带你溜出了宫门，去街角吃了一碗面。|Your nanny sneaks you out of the palace for a bowl of noodles on the corner.', [
      ['吃得一滴不剩|Eat every drop', { happy: 10 }, '那是你吃过最好吃的面。保姆被罚了一个月工资，可她说值。|The best noodles of your life. Nanny lost a month\'s pay — and said it was worth it.'],
      ['害怕被发现，要回去|Get scared and ask to go back', { eq: 2 }, '保姆笑着把你抱了回去。|Nanny laughed and carried you home.']
    ]),
    X('ry_foreign_heir', ['royal', 'monarch'], [16, 40], '他国王储|A Foreign Heir', '👑', '邻国的王储来访，宴会上被安排坐在你旁边。|The crown heir of a neighbouring kingdom visits and is seated beside you at the banquet.', [
      ['聊一整晚|Talk all evening', function (c) { var mons = G.CLIST.filter(function (x) { return G.C[x].mon && x !== c.p.country; }); var cc = mons.length ? G.pick(mons) : 'gb'; var n = mkNpc(c, { rel: 'crush', d0: -3, d1: 4, c: cc, love: 30, aff: 40 }); n.tags = ['royal']; n.job = G.L('{c}王储|Crown Heir of {c}', { c: G.C[cc].n }); return '你和{n}聊到宴会结束。两国的报纸都在猜。|You and {n} talked until the banquet ended. Both nations\' papers began to speculate.'; }],
      ['礼貌应付|Keep it polite', { eq: 2 }, '你们聊了天气和马。|You discussed the weather and horses.']
    ])
  ]);

  /* ===================== prison ===================== */
  function jx(id, a, title, icon, t, opts, ex) { return X(id, 'prison', a, title, icon, t, opts, Object.assign({ jail: 1, cd: 4, prep: function (c) { if (!c.p.jail) return false; } }, ex || {})); }
  G.evs([
    jx('pr_letter', [16, 99], '一封信|A Letter', '✉️', '狱警递给你一封信。信封上的字，你认得。|A guard hands you a letter. You know the handwriting.', [
      ['当晚就回信|Write back that night', { eq: 3, happy: 4 }, '你写了六页。熄灯前，你把它压在了枕头下面。|You wrote six pages and slept with them under your pillow.'],
      ['不敢拆开|Can\'t bring yourself to open it', { stress: 4 }, '信在你的枕头下压了一个月。|The letter stayed unopened under your pillow for a month.']
    ]),
    jx('pr_visit', [16, 99], '探监|Visiting Day', '🪟', '隔着玻璃，你看到了来探监的家人。他们老了很多。|Through the glass you see family come to visit. They\'ve aged so much.', [
      ['说“我会好好改造”|Say "I\'ll make the most of this"', function (c) { c.p.jail.beh = Math.min(100, (c.p.jail.beh || 50) + 6); H.fx(c, { eq: 3 }); return '妈妈用手掌贴着玻璃，一直到时间结束。|Mum pressed her palm to the glass until time was up.'; }],
      ['叫他们别再来了|Tell them not to come again', { happy: -6 }, '他们下个月还是来了。|They came again the next month anyway.']
    ]),
    jx('pr_class', [16, 70], '狱中课堂|Classes Inside', '📚', '监狱开了自考班。教室里坐着杀人犯、诈骗犯，还有一个八十岁的老贼。|The prison runs a degree course. In class: murderers, fraudsters, and an eighty-year-old thief.', [
      ['报名|Sign up', function (c) { c.p.jail.beh = Math.min(100, (c.p.jail.beh || 50) + 5); H.fx(c, { smarts: 4 }); return '你考过了第一门。老贼说：“我要是年轻时也这么读书就好了。”|You passed the first exam. The old thief said: "If only I\'d studied like that when I was young."'; }],
      ['不去|Skip it', { happy: 1 }, '你在床上躺着数天花板上的裂缝。|You lay counting cracks in the ceiling.']
    ]),
    jx('pr_bully', [16, 70], '狱霸|The Yard Boss', '👊', '狱霸要你每个月把家里送来的东西分他一半。|The yard boss wants half of everything your family sends each month.', [
      ['给他|Pay up', { stress: 4 }, '日子安稳了，但你知道这只是开始。|Things were quiet — but you knew it was only the start.'],
      ['报告狱警|Report it to a guard', function (c) { var g = N.all(function (n) { return n.guard && n.alive; })[0]; if (g) { N.addAff(g, 6); return G.L('{g}把狱霸调去了别的监区。从那以后，{g}看你的眼神不太一样了。|{g} had the boss moved to another wing — and looked at you differently after that.', { g: g.name }); } H.fx(c, { stress: 6 }); return '狱警处理了。你成了“告密的”。|The guards dealt with it. You became "the snitch".'; }],
      ['当着所有人的面拒绝|Refuse in front of everyone', RC(.5, '他盯着你看了很久，转身走了。从那以后没人敢惹你。|He stared a long time, then walked away. Nobody bothered you again.', { rep: 8 }, '你在医务室躺了两个星期。|You spent two weeks in the infirmary.', { health: -15 })]
    ]),
    jx('pr_sick', [16, 99], '狱中生病|Sick Inside', '🤒', '你发了三天高烧。监狱医务室只有退烧药。|A fever for three days. The prison infirmary has only paracetamol.', [
      ['申请去地区医院|Ask to go to the regional hospital', RC(.55, '狱警押着你去了地区医院。打完针，你戴着手铐在走廊里坐了一夜。|Guards escorted you to the regional hospital. After the injection you sat cuffed in the corridor all night.', { health: 6 }, '申请被驳回了。你硬扛了过去。|Refused. You toughed it out.', { health: -6 })],
      ['硬扛|Tough it out', { health: -4, eq: 2 }, '狱友们轮流给你打水。|Your cellmates took turns fetching water.']
    ]),
    jx('pr_choir', [16, 99], '狱中合唱团|The Prison Choir', '🎶', '监狱要排练新年晚会的合唱。|The prison is rehearsing a choir for the New Year show.', [
      ['报名领唱|Volunteer to lead', function (c) { c.p.jail.beh = Math.min(100, (c.p.jail.beh || 50) + 4); H.fx(c, { happy: 6 }); return '演出那天，台下有一个老狱友哭了。|At the show, an old lag in the audience wept.'; }],
      ['在后排张张嘴|Mime in the back row', { happy: 2 }, '没人发现你根本没出声。|Nobody noticed you never made a sound.']
    ]),
    jx('pr_guard_kind', [16, 70], '值夜班的狱警|The Night-Shift Guard', '🔦', '值夜班的狱警经过你的门口，停下来问你睡不着吗。|The night-shift guard stops at your door and asks if you can\'t sleep.', [
      ['和ta聊几句|Talk a little', function (c) { var g = N.all(function (n) { return n.guard && n.alive; })[0]; if (!g) { g = mkNpc(c, { rel: 'contact', job: '狱警|Prison Guard', aff: 25 }); g.guard = 1; } else { c.prm.n = g.name; c.prm.nid = g.id; } nAff(c, 6); g.love = Math.min(100, (g.love || 0) + 6); return '{n}说，ta每晚都会经过这里。你开始期待夜班。|{n} said they passed every night. You began to look forward to the night shift.'; }],
      ['翻身装睡|Roll over and pretend to sleep', { happy: 0 }, '手电筒的光在你脸上停了一下，移开了。|The torchlight rested on your face a moment, then moved on.']
    ]),
    jx('pr_hearing', [16, 99], '减刑听证|The Parole Hearing', '⚖️', '你的减刑听证会到了。坐在对面的，有一位你案子里的受害者家属。|Your parole hearing. Across the table sits a member of a victim\'s family.', [
      ['真诚地道歉|Apologise sincerely', function (c) { var j = c.p.jail; if (G.ch(.4 + (j.beh || 50) / 250)) { j.left = Math.max(0, j.left - G.ri(1, 2)); H.fx(c, { karma: 5, eq: 4 }); return '听完你的话，那位家属点了点头。你的刑期减了。|After you spoke, they nodded. Your sentence was reduced.'; } H.fx(c, { eq: 3 }); return '听证会没有通过。但出门时，那位家属对你说：“我听到了。”|The hearing failed. But on the way out they said: "I heard you."'; }],
      ['只谈自己的表现|Talk only about your conduct', RC(.3, '减刑批准了一年。|One year off was approved.', { happy: 6 }, '委员会认为你“缺乏悔意”。|The board found you "lacking remorse".', { happy: -5 })]
    ])
  ]);

  /* ===================== tycoons, generals, officials, stars ===================== */
  G.evs([
    X('ty_jet', 'tycoon', [25, 90], '私人飞机|The Private Jet', '🛩️', '你的私人飞机要换新了。销售把三本目录摆在你面前。|Time to replace the jet. The sales rep lays three catalogues before you.', [
      ['订一架最新款|Order the newest model', { money: -8000000, happy: 6 }, '新飞机交付那天，你在机库里待了一下午。|On delivery day you spent the afternoon in the hangar.'],
      ['旧的还能飞|The old one still flies', { smarts: 2 }, '你的财务总监长出了一口气。|Your CFO breathed a long sigh of relief.']
    ]),
    X('ty_forbes', 'tycoon', [25, 95], '富豪榜|The Rich List', '📊', '新一期富豪榜出来了，你的排名掉了三位。|The new rich list is out. You\'ve dropped three places.', [
      ['打电话给财务总监|Call the CFO', { stress: 6 }, '他说：“老板，钱没少，是别人赚得更多了。”|He said: "Boss, you didn\'t lose anything. Others just earned more."'],
      ['一笑了之|Laugh it off', { happy: 3, eq: 2 }, '你把那本杂志垫在了猫碗下面。|You used the magazine as a mat under the cat\'s bowl.']
    ]),
    X('ty_kid_bodyguard', 'tycoon', [30, 80], '保镖|The Bodyguards', '🕶️', '你的孩子抗议：“我不想每天被两个保镖跟着上学！”|Your child protests: "I don\'t want two bodyguards following me to school every day!"', [
      ['换成便衣，远远跟着|Plain clothes, at a distance', { eq: 3 }, '孩子以为保镖撤了，高兴了一整个学期。|The child thought the guards were gone and was happy all term.'],
      ['安全第一，不改|Safety first — no change', { stress: 2 }, '孩子一个星期没跟你说话。|The child didn\'t speak to you for a week.']
    ], { if: function () { return N.rel('child').some(function (k) { return k.alive && N.age(k) >= 8 && N.age(k) <= 17; }); } }),
    X('gn_review', 'general', [45, 80], '检阅|The Review', '🎖️', '你带着一个师接受检阅。站在你身后的副官，是二十年前你带过的新兵。|You lead a division past the reviewing stand. Your aide behind you was a recruit of yours twenty years ago.', [
      ['检阅后请他喝一杯|Share a drink with him after', { eq: 3, happy: 5 }, '他说，当年要不是你，他早就退伍回家了。|He said that without you, he\'d have quit and gone home long ago.'],
      ['只说“干得好”|Say only "Well done"', function (c) { c.p.mil.merit += 4; G.dPush('merit', 4); return '他敬了一个军礼，眼眶红了。|He saluted, eyes reddening.'; }]
    ]),
    X('gn_son', 'general', [45, 80], '将军的孩子|A General\'s Child', '👨‍✈️', '你的孩子说想当兵，但不想让任何人知道ta是你的孩子。|Your child wants to enlist — without anyone knowing they\'re yours.', [
      ['答应ta|Agree', { eq: 4, karma: 3 }, '三年后，ta凭自己当上了班长。你在一份表彰名单里看到了ta的名字。|Three years on they made squad leader on their own. You saw the name on a commendation list.'],
      ['托人照顾一下|Have someone keep an eye out', { karma: -2 }, '没过多久，ta就发现了，气得半年没回家。|They found out soon enough and stayed away for half a year.']
    ], { if: function () { return N.rel('child').some(function (k) { return k.alive && N.age(k) >= 17 && N.age(k) <= 25; }); } }),
    X('of_petition', 'official', [35, 75], '上访的老人|The Petitioner', '📝', '一位老人在你办公楼门口举着牌子站了三天。|An old man has stood outside your office building holding a sign for three days.', [
      ['亲自下楼见他|Go down and meet him yourself', function (c) { if (c.p.gov) c.p.gov.appr = G.clamp((c.p.gov.appr || 50) + 5, 0, 100); H.fx(c, { karma: 5, eq: 3 }); return '他的事拖了八年。你签了字，一个星期就办完了。|His case had dragged on eight years. You signed, and it was done in a week.'; }],
      ['让信访办处理|Leave it to the petitions office', { stress: 2 }, '第四天，老人不见了。没人知道他去了哪里。|On the fourth day he was gone. Nobody knew where.']
    ]),
    X('of_banquet', 'official', [35, 75], '饭局|The Dinner', '🍶', '一位老板请你吃饭，说“就是朋友聚聚”。菜单上没有价格。|A businessman invites you to dinner — "just friends". The menu has no prices.', [
      ['婉拒|Decline', { karma: 4 }, '他后来又请了三次，你都没去。|He asked three more times. You never went.'],
      ['去吃顿饭|Go to dinner', RC(.65, '那顿饭什么也没发生。|Nothing came of it.', { happy: 3 }, '饭后，他往你车里放了一个盒子。三年后，这个盒子出现在了纪委的案卷里。|After dinner he put a box in your car. Three years later it turned up in a discipline file.', { stress: 25, fame: -10 })]
    ]),
    X('st_stalker', 'star', [18, 70], '私生饭|The Obsessed Fan', '📸', '有一个粉丝，已经连续三个月出现在你家楼下。|One fan has turned up below your building every day for three months.', [
      ['报警|Call the police', { stress: 3 }, '警察来了，那个人被带走了。你换了住处。|The police took them away. You moved.'],
      ['下楼和ta谈谈|Go down and talk', RC(.6, '你请ta喝了杯咖啡，认真说了一番话。从那以后，ta再也没来过。|You bought them a coffee and spoke seriously. They never came again.', { eq: 4 }, 'ta情绪失控了。照片第二天上了热搜。|They lost control. The photos were trending the next day.', { stress: 10, fame: -3 })]
    ]),
    X('st_award', 'star', [20, 80], '颁奖礼|Awards Night', '🏆', '你第五次被提名，第四次坐在台下鼓掌。|Your fifth nomination; your fourth time applauding someone else.', [
      ['真心为赢家鼓掌|Applaud the winner sincerely', { eq: 4, karma: 2 }, '镜头拍到了你的笑容。第二天，“最有风度的输家”上了热搜。|The camera caught your smile. "Most gracious loser" trended the next day.'],
      ['提前离场|Leave early', { fame: -2, happy: -3 }, '小报写：“XX不满落选，提前离场”。|The tabloids: "Star storms out after loss."']
    ])
  ]);

  /* ===================== the nanny ===================== */
  var hu = G.ACT_CATS.filter(function (c) { return c.id === 'hustle'; })[0];
  if (hu) hu.items.push({ id: 'nanny_apply', n: '去富人家应聘保姆|Apply as a Nanny for a Wealthy Family', i: '🧹', e: 15, a: [18, 58], if: function () { var p = P(); return !p.flags.nanny && !p.flags.monarch && !p.job && (!G.status || G.status() < 2); }, run: function (a) {
    var p = P(), c = { p: p, prm: {} };
    var boss = mkNpc(c, { rel: 'contact', d0: 2, d1: 15, job: G.pick(['上市公司董事长|Listed Company Chairman', '投资人|Investor', '名医|Celebrated Surgeon', '地产商|Property Developer']), aff: 25 });
    boss.wealth = G.$(G.ri(20, 300) * 1e6); boss.tags = ['rich']; boss.married = G.ch(.6) ? 1 : 0;
    p.flags.nanny = { nid: boss.id, y: S().year, pay: G.$(G.ri(18, 36) * 1000) };
    G.major('到{n}家当保姆|Became a nanny in {n}\'s household', { n: boss.name });
    return G.quick(a, '面试只用了五分钟。{n}看了你一眼，说：“明天来上班。”{m}|The interview took five minutes. {n} looked at you once and said: "Start tomorrow." {m}', { happy: 4 }, { n: boss.name, m: boss.married ? G.L('（ta已婚，有一个八岁的孩子。）|(They\'re married, with an eight-year-old.)') : G.L('（ta独自带着一个八岁的孩子。）|(They\'re raising an eight-year-old alone.)') });
  } });
  function boss(c) { var p = c.p, b = p.flags.nanny && S().npcs[p.flags.nanny.nid]; if (!b || !b.alive) return false; c.prm.b = b.name; c.prm.bid = b.id; }
  function bAff(c, v, l) { var b = S().npcs[c.prm.bid]; if (!b) return null; G.dPush('aff', N.addAff(b, v)); if (l) b.love = Math.min(100, (b.love || 0) + l); return b; }
  G.evs([
    X('nn_kid', 'nanny', [18, 60], '黏人的孩子|The Clingy Child', '🧒', '主人家的孩子半夜做噩梦，哭着只要你，不要妈妈。|The family\'s child wakes from a nightmare crying for you — not their mother.', [
      ['抱着ta唱歌|Hold them and sing', function (c) { bAff(c, 6, 3); H.fx(c, { eq: 3 }); return '孩子睡着了。{b}站在门口看了很久。|The child fell asleep. {b} watched from the doorway a long time.'; }],
      ['去叫醒ta妈妈|Wake their parent', { eq: 1 }, '你守住了分寸。|You kept to your place.']
    ], { prep: boss }),
    X('nn_hostess', 'nanny', [18, 60], '女主人|The Lady of the House', '💅', '女主人当着客人的面挑剔你泡的茶太烫。|In front of guests, the lady of the house complains your tea is too hot.', [
      ['低头道歉|Apologise quietly', { stress: 4, eq: 2 }, '晚上，{b}悄悄对你说：“委屈你了。”|That evening {b} murmured: "Sorry you had to put up with that."'],
      ['不卑不亢地回一句|Reply with quiet dignity', RC(.5, '客人们都笑了，女主人也不好再说什么。|The guests laughed, and she let it go.', { eq: 3 }, '第二天，你的工资被扣了一半。|The next day half your wages were docked.', { money: -1000 })]
    ], { prep: function (c) { if (boss(c) === false) return false; var b = S().npcs[c.prm.bid]; if (!b.married) return false; } }),
    X('nn_talk', 'nanny', [18, 60], '深夜的厨房|The Kitchen at Midnight', '🌙', '{b}应酬回来，在厨房里遇见了还在收拾的你。ta说想喝碗粥。|{b} comes home from a dinner and finds you still tidying the kitchen. They ask for a bowl of congee.', [
      ['煮粥，陪ta聊一会儿|Make congee and keep them company', function (c) { bAff(c, 8, 8); return '{b}说起了小时候在农村的日子。那天晚上，ta第一次叫了你的名字。|{b} talked about growing up in the countryside — and for the first time that night, called you by your name.'; }],
      ['煮好就回房|Make it and go to your room', { eq: 1 }, '第二天早上，碗洗得干干净净地放在了灶台上。|In the morning the bowl was washed and left on the counter.']
    ], { prep: boss }),
    X('nn_line', 'nanny', [18, 60], '越界|Crossing the Line', '🚪', '{b}拉住了你的手：“我知道我不该这样。”|{b} catches your hand: "I know I shouldn\'t."', [
      ['不要躲|Don\'t pull away', function (c) { var b = bAff(c, 10, 25); if (b && N.canRomance(b)) { b.rel = b.married ? 'affair' : 'lover'; c.p.partner = b.married ? c.p.partner : b.id; } return b && b.married ? '从那天起，你成了这个家里的第二个秘密。|From that day you became the second secret in that house.' : '从那天起，你不再只是这个家的保姆。|From that day you were no longer just the nanny.'; }],
      ['抽回手：“我只是来工作的。”|Pull back: "I\'m only here to work."', { karma: 4, eq: 3 }, '{b}愣了一下，然后说：“对不起。”从那以后，ta更尊重你了。|{b} froze, then said "I\'m sorry." They respected you more after that.']
    ], { prep: function (c) { if (boss(c) === false) return false; var b = S().npcs[c.prm.bid]; if ((b.love || 0) < 25 || !N.canRomance(b) || b.rel === 'affair' || b.rel === 'lover') return false; }, w: 5 }),
    X('nn_found', 'nanny', [18, 60], '东窗事发|Found Out', '💥', '女主人在你的房间里发现了{b}的领带。|The lady of the house finds {b}\'s tie in your room.', [
      ['收拾东西走人|Pack and leave', function (c) { c.p.flags.nanny = null; H.fx(c, { stress: 10, happy: -8 }); return '你拖着箱子走出了那扇大门。{b}没有追出来。|You walked out of the gates with your suitcase. {b} didn\'t follow.'; }],
      ['等{b}做选择|Wait for {b} to choose', function (c) { var b = S().npcs[c.prm.bid]; if (b && (b.love >= 75 || b.devoted)) { b.married = 0; b.rel = 'lover'; c.p.partner = b.id; b.devoted = b.love >= 90 ? 1 : b.devoted; c.p.flags.nanny = null; H.fx(c, { fame: -2, happy: 6 }); return '{b}离婚了。半年后，ta在全家人的反对声中向你求婚。|{b} divorced. Six months later, against the whole family\'s objections, they proposed.'; } c.p.flags.nanny = null; H.fx(c, { happy: -15, stress: 10 }); return '{b}选择了家庭。第二天，你的银行卡里多了一笔钱，再没有一句话。|{b} chose the family. The next day money appeared in your account — and not another word.'; }]
    ], { prep: function (c) { if (boss(c) === false) return false; var b = S().npcs[c.prm.bid]; if (b.rel !== 'affair') return false; }, w: 4 }),
    X('nn_quit', 'nanny', [18, 60], '辞职|Moving On', '👜', '你在这个家干了好几年。孩子上了寄宿学校，你也该走了。|You\'ve worked here for years. The child is off to boarding school; it\'s time to go.', [
      ['体面地告别|Leave gracefully', function (c) { bAff(c, 6); c.p.flags.nanny = null; H.fx(c, { money: 5000, happy: 3 }); return '{b}多给了你三个月的工资，还写了一封推荐信。|{b} gave you three months\' extra pay and a reference.'; }],
      ['留下来当管家|Stay on as housekeeper', function (c) { bAff(c, 4); c.p.flags.nanny.pay = Math.round(c.p.flags.nanny.pay * 1.4); return '你成了这个家的管家，工资涨了四成。|You became the housekeeper, with a 40% raise.'; }]
    ], { prep: function (c) { if (boss(c) === false) return false; if (S().year - c.p.flags.nanny.y < 4) return false; } })
  ]);

  /* ===================== New Year, by who you are ===================== */
  var NY = {
    monarch: [['王宫里的新年|New Year at the Palace', '🏰', '零点钟声响起，你站在王宫阳台上，向广场上的十万人挥手。|At the stroke of midnight you stand on the palace balcony and wave to a hundred thousand in the square.', [['向人群鞠躬|Bow to the crowd', { fame: 3, happy: 6 }, '人群的欢呼声，一直传到了宫殿最深处。|The cheers reached the palace\'s innermost rooms.'], ['回去和家人守岁|Go back in to your family', { eq: 3, happy: 6 }, '你在壁炉前，和孩子们一起数完了最后十秒。|By the fire, you counted down the last ten seconds with your children.']]],
      ['新年特赦|The New Year Pardons', '📜', '按照传统，新年由你签署特赦令。名单上有两百个名字。|By tradition you sign the New Year pardons. Two hundred names are on the list.', [['逐个看完再签|Read every one before signing', { eq: 3, karma: 5 }, '你划掉了三个名字，又加上了一个。|You struck three names — and added one.'], ['直接签|Sign as presented', { karma: 2 }, '两百个家庭，在新年的第一天团聚了。|Two hundred families were reunited on the first day of the year.']]]],
    royal: [['王室新年招待会|The Royal New Year Reception', '🥂', '新年招待会上，你被安排站在王储旁边接受各国使节的祝贺。|At the New Year reception you stand beside the heir to receive the ambassadors.', [['用他们的母语一一回礼|Answer each in their own language', { smarts: 2, fame: 2 }, '法国大使惊讶地说你的法语比他的还好。|The French ambassador marvelled that your French was better than his.'], ['偷偷溜去厨房|Slip off to the kitchens', { happy: 6 }, '厨师们给你留了一块最大的蛋糕。|The cooks had saved you the biggest slice of cake.']]],
      ['平民的新年|A Commoner\'s New Year', '🎆', '你戴着帽子和口罩，混进了广场上倒数的人群。|In a cap and mask you slip into the countdown crowd in the square.', [['和陌生人一起倒数|Count down with strangers', { happy: 10 }, '旁边的女孩递给你一个烟花棒。没有人认出你。|A girl beside you handed you a sparkler. No one recognised you.'], ['被认出来前离开|Leave before you\'re recognised', { eq: 2 }, '回宫的车上，你看着窗外的烟花，觉得有点孤单。|In the car back you watched the fireworks feeling a little lonely.']]]],
    red: [['大院的团拜|New Year at the Compound', '🧧', '大年初一，爷爷家的客厅里坐满了穿中山装的老人，一个个都是你在课本里见过的名字。|First morning of the New Year: Grandpa\'s sitting room is full of old men in tunic suits — names from your textbooks.', [['挨个拜年|Greet each one', { eq: 4, fame: 1 }, '一位老人塞给你一个红包，里面是一枚旧军功章。|One old man pressed a red envelope on you. Inside was an old service medal.'], ['躲在书房里看书|Hide in the study with a book', { smarts: 3 }, '爷爷进来找你，看你在读他的旧日记，没说话，替你开了灯。|Grandpa came looking, saw you reading his old diary, and silently switched on the light.']]],
      ['年夜饭上的规矩|Rules at the New Year Dinner', '🥟', '年夜饭上，大伯定下规矩：今年谁也不许收别人送的东西。|At New Year dinner your uncle lays down the law: this year nobody accepts any gifts.', [['举杯响应|Raise your glass to it', { karma: 4 }, '那一年，家里退回了四十多份礼物。|That year the family returned over forty gifts.'], ['小声嘟囔|Grumble under your breath', { karma: -1 }, '大伯的目光扫过来，你立刻闭了嘴。|Your uncle\'s glance swept over; you shut up at once.']]],
      ['给老战友拜年|New Year Calls on Old Comrades', '🎖️', '初二，你陪爷爷去看他的老战友。很多人已经不在了。|On the second day you go with Grandpa to visit his comrades. Many are gone.', [['陪他走完每一家|Go with him to every house', { eq: 5, karma: 3 }, '最后一家，只剩一位老奶奶。爷爷对着遗像敬了一个军礼。|At the last house only a widow remained. Grandpa saluted the portrait.'], ['帮他记下每家的近况|Note down how each family is doing', { smarts: 2, karma: 2 }, '后来，你帮其中三家解决了孩子上学的事。|Later you helped three of them with their children\'s schooling.']]]],
    spyfam: [['少了一个人的年夜饭|A Place Set for No One', '🥢', '年夜饭桌上摆着四双筷子，可爸爸又“出差”了。|Four pairs of chopsticks at New Year dinner — but Dad is "travelling" again.', [['给他留一碗饺子|Save him a bowl of dumplings', { eq: 3 }, '凌晨两点，你听到开门声。第二天早上，那碗饺子空了。|At 2 a.m. you heard the door. In the morning, the bowl was empty.'], ['问妈妈爸爸在哪|Ask Mum where Dad is', { stress: 3 }, '妈妈看着窗外：“在一个看不见烟花的地方。”|Mum looked out of the window. "Somewhere you can\'t see fireworks."']]],
      ['新年的密码|A New Year Code', '🧩', '爸爸送你的新年礼物是一把锁着的盒子，密码要你自己猜。|Dad\'s New Year present is a locked box. You must work out the code.', [['熬夜破解|Stay up cracking it', { smarts: 5 }, '密码是你出生那天的星期数和体重。盒子里是一张全家福——拍于你出生前的另一个国家。|The code was your birth weekday and weight. Inside: a family photo — taken before you were born, in another country.'], ['直接问爸爸|Just ask Dad', { par: 3 }, '爸爸大笑：“这样可当不了特工。”|Dad roared with laughter. "That\'s no way to be a spy."']]]],
    spy: [['安全屋里的新年|New Year in the Safe House', '🕯️', '零点，你在一个异国的安全屋里，用一台旧收音机听着家乡的新年钟声。|Midnight, in a safe house abroad, listening to home\'s New Year bells on an old radio.', [['给家里发一条暗语|Send home a coded line', { eq: 2, stress: 2 }, '“天气很好，饺子是韭菜馅的。”——家人会明白的。|"Weather fine, dumplings with chives." They\'d understand.'], ['打开窗听当地的烟花|Open the window to the local fireworks', { happy: 3 }, '这座城市的烟花，和家乡的一样好看。|This city\'s fireworks were as lovely as home\'s.']]],
      ['新年任务|The New Year Job', '🎯', '目标也在过年。总部说，他最松懈的时候，就是今晚。|The target is celebrating too. HQ says tonight he\'ll be at his most careless.', [['出发|Go', function (c) { if (c.p.spy) { if (c.p.spy) c.p.spy.merit += 8; G.dPush('merit', 8); } H.fx(c, { stress: 6 }); return '烟花最响的那一刻，你拿到了他口袋里的硬盘。|At the loudest burst of fireworks, you lifted the drive from his pocket.'; }], ['申请换个日子|Ask for another night', { happy: 3 }, '总部同意了。你给自己煮了一碗面。|HQ agreed. You made yourself a bowl of noodles.']]]],
    prison: [['狱中的年夜饭|New Year Dinner Inside', '🥟', '除夕，监狱加了一个菜：每人八个饺子。|New Year\'s Eve: an extra dish — eight dumplings each.', [['把饺子分给新来的狱友|Give some to a new inmate', function (c) { c.p.jail.beh = Math.min(100, (c.p.jail.beh || 50) + 3); H.fx(c, { karma: 3, eq: 2 }); return '他边吃边哭：“这是我第一次在外面过年。”|He wept as he ate: "My first New Year away from home."'; }], ['一个一个慢慢吃|Eat them slowly, one by one', { happy: 3 }, '你吃出了一枚硬币。狱友们都说你明年要转运了。|One had a coin in it. Your cellmates said your luck would turn.']], 1],
      ['隔着电视的烟花|Fireworks on the Television', '📺', '监区的电视里在放春晚。窗外很远的地方，有人在放烟花。|The wing\'s TV shows the gala. Far beyond the window, someone sets off fireworks.', [['给家人写新年信|Write a New Year letter home', { eq: 3 }, '你写了一句：“明年，我想回家过年。”|You wrote one line: "Next year, I want to be home for New Year."'], ['跟着电视一起唱|Sing along with the TV', { happy: 4 }, '整个监区都在唱。狱警没有制止。|The whole wing sang. The guards let it be.']], 1]],
    general: [['哨所里的新年|New Year at an Outpost', '🏔️', '你带着慰问品去了最远的边防哨所，和战士们一起包饺子。|You take gifts to the most distant border post and make dumplings with the soldiers.', [['替哨兵站一班岗|Stand a watch for a sentry', { eq: 4, health: -1 }, '零下三十度，你站了两个小时。那个哨兵后来一直留在部队。|Two hours at minus thirty. That sentry never left the army.'], ['给每个人敬一杯|Toast every soldier', { happy: 6 }, '一个新兵喝多了，抱着你喊“首长”喊了一晚上。|A recruit had one too many and called you "sir" all night long.']]]],
    official: [['值班的除夕|On Duty for New Year', '🏢', '除夕夜，你在应急指挥中心值班。|New Year\'s Eve on duty at the emergency command centre.', [['给每个值班的人送饺子|Bring dumplings for everyone on shift', function (c) { if (c.p.gov) c.p.gov.perf = Math.min(100, (c.p.gov.perf || 50) + 3); H.fx(c, { eq: 3 }); return '凌晨，你和保安、司机坐在一起看了春晚的重播。|After midnight you watched the gala replay with the guards and drivers.'; }], ['盯着大屏幕不敢走开|Keep your eyes on the screens', { stress: 3 }, '一夜平安。早上，你在办公室沙发上睡着了。|A quiet night. In the morning you fell asleep on the office sofa.']]]],
    soldier: [['军营里的年|New Year in Barracks', '🎖️', '营房里贴满了春联，指导员让每个人给家里打五分钟电话。|Couplets on every wall; the instructor gives everyone five minutes to call home.', [['打给妈妈|Call Mum', { happy: 6, par: 4 }, '妈妈只问了一句：“冷不冷？”|Mum asked just one thing: "Are you cold?"'], ['把时间让给新兵|Give your minutes to a recruit', { eq: 3, karma: 2 }, '他打完电话，偷偷抹了一把眼泪。|He finished the call and quietly wiped his eyes.']]]],
    police: [['除夕出警|A Call on New Year\'s Eve', '🚓', '十一点五十，你接到报警：一个老人走丢了。|11:50 p.m.: an old man has gone missing.', [['冒着烟花去找|Search through the fireworks', function (c) { if (c.p.pol) c.p.pol.merit = (c.p.pol.merit || 0) + 3; H.fx(c, { karma: 4 }); return '零点零五分，你在桥洞下找到了他。他说，他想去看看老伴年轻时住的地方。|At 12:05 you found him under a bridge. He wanted to see where his late wife lived as a girl.'; }]]]],
    tycoon: [['年会|The Company Gala', '🎤', '公司年会上，全体员工等着你宣布年终奖。|At the company gala, every employee waits for your bonus announcement.', [['宣布多发三个月|Announce three extra months', { money: -2000000, fame: 3, happy: 6 }, '台下的欢呼声差点掀翻屋顶。|The cheers nearly lifted the roof.'], ['宣布按业绩发|Announce bonuses by performance', { smarts: 2 }, '掌声很礼貌。|The applause was polite.']]],
      ['私人岛屿上的新年|New Year on Your Island', '🏝️', '你带着家人在私人岛屿上跨年。|You see the New Year in with your family on your private island.', [['只留家人，遣散员工|Just family; send the staff home', { happy: 8, eq: 2 }, '你亲自烤了一次肉，烤焦了一半。孩子们笑得最开心。|You barbecued yourself and burnt half of it. The children laughed hardest of all.'], ['请来一支乐队|Fly in a band', { happy: 6, money: -300000 }, '乐队一直演到天亮。|The band played until dawn.']]]],
    star: [['跨年晚会|The Countdown Show', '🎤', '你要在零点的那一刻，在直播舞台上唱歌。|At the stroke of midnight you\'ll be singing live on stage.', [['唱一首新歌|Sing a new song', RC(.6, '这首歌当晚登上了热搜第一。|The song topped the trending list that night.', { fame: 4, happy: 8 }, '你破音了。第二天，你的破音被做成了一百个表情包。|Your voice cracked. The next day there were a hundred memes of it.', { fame: 1, stress: 6 })], ['唱一首老歌|Sing an old favourite', { fame: 2, happy: 4 }, '全场一起合唱。|The whole audience sang along.']]]],
    nanny: [['主人家的年|New Year in Their House', '🧧', '你在主人家过年。年夜饭你做了十二个菜，却一个人在厨房吃。|New Year in your employer\'s house. You cooked twelve dishes — and ate alone in the kitchen.', [['给自己家打个视频|Video-call your own family', { happy: 3 }, '屏幕那头，妈妈说你瘦了。|On the screen Mum said you\'d lost weight.'], ['主人叫你上桌|Your employer calls you to the table', function (c) { var b = c.p.flags.nanny && S().npcs[c.p.flags.nanny.nid]; if (b) { N.addAff(b, 6); b.love = Math.min(100, (b.love || 0) + 4); } H.fx(c, { happy: 6 }); return '孩子把最大的一个饺子夹给了你。|The child gave you the biggest dumpling.'; }]]]],
    student: [['寒假作业|Winter Homework', '📚', '除夕夜，你的寒假作业还剩一半。|New Year\'s Eve, and half your winter homework is still untouched.', [['先玩，初一再写|Celebrate now, write tomorrow', { happy: 6 }, '你初一写到了半夜。|You wrote until midnight on New Year\'s Day.'], ['边看春晚边写|Write during the gala', { smarts: 2 }, '你写完了，也没错过最好看的那个小品。|You finished — and still caught the best sketch.']]]],
    child: [['压岁钱|Lucky Money', '🧧', '你收到了好多红包，妈妈说要“帮你存起来”。|You\'ve received a pile of red envelopes. Mum says she\'ll "keep them safe for you".', [['交给妈妈|Hand them over', { par: 3 }, '你再也没见过那些钱。|You never saw that money again.'], ['偷偷藏一个|Hide one', { happy: 6 }, '你买了一大包零食，在被窝里吃完了。|You bought a big bag of snacks and ate them under the covers.']]],
      ['放鞭炮|Firecrackers', '🧨', '爸爸带你去楼下放鞭炮。|Dad takes you downstairs to set off firecrackers.', [['自己点|Light one yourself', { happy: 8 }, '“啪”的一声，你吓得跳进了爸爸怀里，然后笑个不停。|Bang! You leapt into Dad\'s arms — then couldn\'t stop laughing.'], ['捂着耳朵看|Watch with your ears covered', { happy: 5 }, '烟花在天上开花的时候，你忘了捂耳朵。|When the fireworks bloomed overhead, you forgot to cover your ears.']]]],
    elder: [['四世同堂|Four Generations', '👴', '大年三十，全家老小围着你，等你说新年第一句话。|New Year\'s Eve: the whole family gathers round, waiting for your first words of the year.', [['给每个孩子发红包|Hand every child a red envelope', { happy: 8, money: -2000 }, '最小的重孙抓着红包，叫了你一声“老祖宗”。|The youngest great-grandchild clutched the envelope and called you "Great-Great".'], ['讲一段当年的事|Tell a story from long ago', { eq: 3, happy: 5 }, '年轻人们第一次听得这么认真。|For once the young ones listened closely.']]]],
    common: [['回家过年|Home for New Year', '🚄', '你挤上了回家的火车。车厢里全是拎着大包小包的人。|You squeeze onto a train home, packed with people and luggage.', [['和邻座聊一路|Chat with your neighbour all the way', { happy: 5, eq: 2 }, '下车时，你们互相加了微信。|By the end you\'d swapped contacts.'], ['戴上耳机睡觉|Earphones in, sleep', { health: 1 }, '你醒来的时候，已经能看到家乡的山了。|When you woke, the hills of home were in sight.']]],
      ['年夜饭|New Year\'s Dinner', '🥢', '一家人围着桌子，电视里放着春晚。|The family round the table, the gala on TV.', [['给爸妈敬酒|Toast your parents', { par: 4, happy: 5 }, '爸爸喝多了，说了很多平时不会说的话。|Dad had a few and said things he never usually would.'], ['抢红包|Grab digital red envelopes', { happy: 5 }, '你抢到了八块八毛八。|You grabbed 8.88.']]]]
  };
  // the same night, the way it's kept outside the lunar-New-Year countries
  Object.assign(NY, {
    common_w: [['跨年夜|New Year\'s Eve', '🎆', '朋友们挤在你家的客厅里，电视上在倒数。|Friends crowd into your living room as the TV counts down.', [['许一个新年愿望|Make a resolution', { happy: 4, smarts: 1 }, '你的愿望撑到了一月十五号。|Your resolution lasted until the fifteenth of January.'], ['零点亲吻身边的人|Kiss someone at midnight', { happy: 6 }, '零点钟声响起，房间里一片欢呼。|At the stroke of twelve the room erupted in cheers.']]],
      ['广场倒数|The Countdown in the Square', '🎇', '你和几万人一起挤在城市广场上，等着零点的烟花。|You join tens of thousands in the city square waiting for the midnight fireworks.', [['爬上路灯杆看烟花|Climb a lamppost for the view', { happy: 7 }, '一个警察冲你摇了摇头，然后自己也笑了。|A police officer shook their head at you — then laughed too.'], ['给远方的家人打电话|Call family far away', { happy: 4, par: 3 }, '电话那头，烟花声和你这边的一样响。|On the line, their fireworks were as loud as yours.']]]],
    child_w: [['熬夜到零点|Staying Up Till Midnight', '🕛', '爸妈第一次答应让你熬到零点。|For the first time your parents let you stay up till midnight.', [['撑到最后一秒|Make it to the last second', { happy: 8 }, '零点一过，你就在沙发上睡着了。|A minute after twelve you were asleep on the sofa.'], ['偷偷吃掉一整盒巧克力|Secretly eat a whole box of chocolates', { happy: 6, health: -1 }, '第二天早上，你的嘴角还沾着巧克力。|In the morning there was still chocolate on your face.']]]],
    student_w: [['新年派对|A New Year Party', '🎉', '同学家开了一个跨年派对。|A classmate is throwing a New Year party.', [['去|Go', { happy: 6, eq: 2 }, '你们在后院放了烟花，邻居报了警。|You set off fireworks in the back garden; the neighbours called the police.'], ['在家复习|Stay home and revise', { smarts: 2 }, '你听着远处的烟花声，做完了一套题。|You finished a practice paper to the sound of distant fireworks.']]]],
    elder_w: [['老朋友的电话|Calls from Old Friends', '☎️', '新年第一天，电话一个接一个地响——是你这辈子的老朋友们。|On New Year\'s Day the phone rings again and again — friends from a lifetime.', [['一个一个聊|Chat with each one', { happy: 6, eq: 2 }, '有一个号码，今年没有打来。你知道为什么。|One number didn\'t ring this year. You knew why.'], ['邀请他们来家里|Invite them round', { happy: 8 }, '五个老人围着一桌菜，笑声比年轻人还大。|Five old friends round a table, laughing louder than the young.']]]],
    prison_w: [['铁窗里的跨年|New Year Behind Bars', '⛓️', '零点，整个监区的人都在敲铁门，像在放烟花。|At midnight the whole wing bangs on the bars like fireworks.', [['也跟着敲|Bang along', { happy: 4 }, '那是一年里你最像自由人的一分钟。|It was the freest minute of your year.'], ['躺着写新年计划|Lie down and write resolutions', { eq: 2 }, '第一条：出去以后，再也不回来。|Number one: once you\'re out, never come back.']], 1]],
    soldier_w: [['驻地跨年|New Year on Base', '🎖️', '你在驻地站岗，耳机里传来战友们在食堂倒数的声音。|On guard duty you hear your unit counting down in the mess over the radio.', [['在岗哨上默默说一句新年快乐|Whisper "Happy New Year" at your post', { eq: 3 }, '天上有一颗流星划过。|A shooting star crossed the sky.']]]],
    official_w: [['新年致辞|A New Year Message', '🏛️', '你要为辖区居民录一段新年致辞。|You\'re recording a New Year message to the people you serve.', [['即兴说几句真心话|Speak from the heart, unscripted', function (c) { if (c.p.gov) c.p.gov.appr = G.clamp((c.p.gov.appr || 50) + 3, 0, 100); H.fx(c, { eq: 2 }); return '视频播出后，评论区里大多是“说得好”。|After it aired, most comments said "well said".'; }]]]],
    general_w: [['前线的新年|New Year at the Front', '🎖️', '你在边境哨所和士兵们一起迎接新年。|You see in the New Year with soldiers at a border post.', [['给每个哨兵递一杯热咖啡|Hand every sentry a hot coffee', { eq: 4, happy: 4 }, '一个年轻的哨兵说，他会记住这个晚上一辈子。|A young sentry said he\'d remember the night for the rest of his life.']]]],
    spyfam_w: [['少一个人的跨年|One Short at Midnight', '🕛', '零点倒数时，爸爸的座位空着。他的手机关机了。|At the countdown Dad\'s chair is empty. His phone is off.', [['给他留一块蛋糕|Save him a slice of cake', { eq: 3 }, '凌晨三点，你听到开门声。早上，盘子空了。|At 3 a.m. you heard the door. In the morning the plate was empty.']]]],
    nanny_w: [['别人家的跨年|Someone Else\'s New Year', '🧧', '你在主人家准备跨年晚宴，自己却只能在厨房里听倒数。|You prepare your employer\'s New Year dinner, and hear the countdown from the kitchen.', [['和厨房里的人一起举杯|Raise a glass with the kitchen staff', { happy: 5 }, '你们用剩下的香槟碰了杯。|You toasted with the leftover champagne.']]]]
  });
  var EASTNY = { cn: 1, tw: 1, sg: 1, kr: 1, vn: 1, hk: 1, mo: 1 };
  var nyEvs = [];
  Object.keys(NY).forEach(function (k) {
    NY[k].forEach(function (v, i) {
      nyEvs.push({ id: 'ny_' + k + '_' + i, sys: 1, title: v[0], icon: v[1], t: v[2], jail: v[4] ? 1 : 0, prep: /^prison/.test(k) ? function (c) { if (!c.p.jail) return false; } : null, o: v[3].map(function (o) { return { t: o[0], run: typeof o[1] === 'function' ? o[1] : function (c) { var fx = o[1] || {}; if (fx.ok != null) { /* RC */ } H.fx(c, fx); return o[2]; } }; }) });
    });
  });
  // RC() helpers inside the table return option functions; normalise them
  nyEvs.forEach(function (d) { d.o.forEach(function (o, j) { var src = null; Object.keys(NY).some(function (k) { return NY[k].some(function (v, i) { if ('ny_' + k + '_' + i === d.id) { src = v[3][j]; return true; } }); }); if (src && typeof src[1] === 'function') o.run = src[1]; }); });
  G.evs(nyEvs);
  G.NY19 = NY;
  function newYear() {
    var s = S(), p = s.p; if (p.age < 4 || s.dead) return;
    var id = G.identity(); if (!EASTNY[p.country] && NY[id + '_w']) id = id + '_w'; else if (!EASTNY[p.country] && ['common', 'red', 'nanny'].indexOf(id) >= 0) id = 'common_w';
    if (!NY[id]) id = EASTNY[p.country] ? 'common' : 'common_w';
    var L = NY[id]; s.nySeen = s.nySeen || {};
    // New Year is a scene now and then, not a form to fill in every January: at most one every few years,
    // and each scene only once in a life. When an identity's scenes are used up, the holiday passes quietly.
    if (s.nyLast != null && s.year - s.nyLast < 3) return;
    if (!G.ch(s.nyLast == null ? .55 : .4)) return;
    var opts = L.map(function (v, i) { return 'ny_' + id + '_' + i; }).concat((G.NYX && G.NYX(id)) || []);
    var fresh = opts.filter(function (x) { var d = G.EV[x]; return !s.nySeen[x] && d && (!G.storyOk || G.storyOk(d)) && (!d.when || d.when(s, p)); });
    if (!fresh.length) return;
    var pick1 = G.pick(fresh);
    s.nySeen[pick1] = s.year; s.nyLast = s.year;
    (s.pendQ = s.pendQ || []).unshift({ id: pick1 });
  }
  G.newYear19 = newYear;
  var mt = G.money.tick;
  G.money.tick = function () {
    var r = mt.apply(this, arguments), s = S(), p = s.p;
    if (s.dead) return r;
    try {
      newYear();
      if (p.flags.nanny && !p.jail) { var b = s.npcs[p.flags.nanny.nid]; if (b && b.alive) { if (G.fin) G.fin.tag = G.L('保姆工资|Nanny wages'); G.addMoney(p.flags.nanny.pay || G.$(24000)); if (G.fin) G.fin.tag = null; } else p.flags.nanny = null; }
    } catch (e) { console.error(e); }
    return r;
  };
})();
