/* More ways a life can be summed up — crowns won and lost, silver spoons wasted, long roads home. */
(function () {
  'use strict';
  var EN = G.ending, N = G.N;
  // remember every country you led
  var inc0 = G.inc;
  G.inc = function (k) { var r = inc0.apply(this, arguments); if (k === 'leader' && G.S && G.S.p) { var f = G.S.p.flags; f.ledC = f.ledC || []; if (f.ledC.indexOf(G.S.p.country) < 0) f.ledC.push(G.S.p.country); } return r; };
  var RICH = ['royal', 'noble', 'richest', 'tycoon', 'merchant', 'red', 'celebrity'];
  var POOR = ['rural', 'worker', 'orphan', 'debt', 'leftbehind', 'single', 'immigrant'];
  function achieved(S, p) { var c = S.cnt; return !!(c.leader || c.general || c.ipo || c.topcop || p.flags.monarch || p.flags.abdicated || p.st.fame >= 50 || (p.job && p.job.rank >= 3) || p.edu.deg >= 6 || (c.medal || 0) + (c.trophies || 0) >= 2 || S.assets.company); }
  var NEW_TOP = function (S, p, c, nw, hap, kids, b) {
    var led = (p.flags.ledC || []).length, crowns = p.flags.heads || 0;
    return [
      [(p.flags.monarch || p.flags.abdicated) && c.leader, 'crownvote', '王冠与选票|The Crown and the Ballot', '你戴过王冠，也赢过选举。历史上没几个人能同时做到。|You wore a crown and won an election. Few in history ever did both.'],
      [led >= 2 || (led >= 1 && crowns >= 1 && p.flags.ledC.indexOf(p.country) < 0), 'manylands', '多国元首|Leader of Many Nations', '不止一个国家，把命运交到了你手里。|More than one nation placed its fate in your hands.'],
      [p.flags.monarch && hap >= 55, 'king', p.g === 'm' ? '一代明君|A Beloved King' : '一代明君|A Beloved Queen', '你在位的年代，被后人称为黄金时代。|Your reign would be remembered as a golden age.'],
      [p.flags.monarch, 'king', p.g === 'm' ? '孤独的王|The Lonely King' : '孤独的女王|The Lonely Queen', '王冠很重，王座很冷。|The crown was heavy, and the throne was cold.'],
      [p.flags.abdicated, 'abdicate', '退位的君王|The Monarch Who Stepped Down', '你主动摘下了王冠，把余生留给了自己。|You set the crown down yourself and kept the rest of your life for you.'],
      [p.mil && p.mil.off && p.mil.rank >= 11, 'cinc', '三军统帅|Commander of All Forces', '千军万马，听你一声号令。|Whole armies moved at your word.'],
      [p.mil && p.mil.off && p.mil.rank >= 10, 'fivestar', '五星上将|Five-Star General', '你的肩上，是一个国家最高的军衔。|On your shoulders sat the highest rank your nation can give.'],
      [c.leader && POOR.indexOf(p.origin) >= 0, 'fromnothing', '寒门贵子|From Nothing to the Top', '你从最底层出发，一路走到了权力的顶点。|You started at the very bottom and climbed all the way to the top.']
    ];
  };
  var NEW_MID = function (S, p, c, nw, hap, kids, b) {
    var ach = achieved(S, p), rich = RICH.indexOf(p.origin) >= 0 && !p.flags.trafficked;
    return [
      [p.flags.exiled, 'lostcrown', '失落的王冠|The Crown That Got Away', '你离王座只差一步，却用了一生去忘记那一步。|You came one step from the throne and spent your life forgetting it.'],
      [p.flags.exRoyal && p.origin === 'royal', 'forlove', '不爱江山爱美人|Love Over the Crown', '你放弃了王位，换来了一个普通人的爱情。|You gave up a throne for an ordinary love.'],
      [p.origin === 'royal' && p.flags.crownHeir && !p.flags.monarch, 'heir', '永远的储君|Forever the Heir', '你等了一辈子，王冠始终没有落到你头上。|You waited your whole life; the crown never came to you.'],
      [p.origin === 'royal' && !p.flags.monarch && !ach, 'spare', '王室备胎|The Royal Spare', '你生在王宫，却一直站在别人的影子里。|Born in a palace, you lived in someone else\'s shadow.'],
      [rich && nw < G.$(100000) && p.age >= 40, 'prodigal', '败家子|The Prodigal Heir', '祖辈打下的江山，在你手里一点点散尽了。|What your forebears built, you let slip away piece by piece.'],
      [rich && !ach && hap >= 55, 'silverspoon', '含着金汤匙的闲人|A Life of Leisure', '你出生在终点线上，然后在那里舒舒服服地坐了一辈子。|You were born at the finish line — and sat there comfortably for the rest of your life.'],
      [rich && !ach, 'silverspoon2', '金汤匙里的空虚|The Gilded Cage', '你什么都不缺，却一直不知道自己想要什么。|You lacked nothing, and never found out what you wanted.'],
      [POOR.indexOf(p.origin) >= 0 && nw > G.$(1e7), 'ragsriches', '白手起家|Rags to Riches', '你从一无所有，到富甲一方。|From nothing at all to a fortune of your own.'],
      [p.flags.trafficked && p.flags.trafficked.found, 'homeagain', '归途|The Long Way Home', '你被偷走了童年，但终于找回了回家的路。|Your childhood was stolen — but you found your way home.'],
      [p.flags.trafficked && !p.flags.trafficked.found, 'search', '寻亲一生|A Lifelong Search', '你一直在找那个家，直到最后。|You searched for that home until the very end.'],
      [p.flags.excon && (p.h.karma || 0) >= 20, 'redeem', '浪子回头|Redemption', '你摔得很重，但你站了起来。|You fell hard — and you got back up.'],
      [(c.donated || 0) > G.$(5e6), 'philanthropist', '慈善家|Philanthropist', '你把财富还给了这个世界。|You gave your fortune back to the world.'],
      [p.origin === 'celebrity' && p.st.fame < 20 && hap >= 50, 'starkid', '星二代的平凡人生|The Star\'s Ordinary Child', '你没有活成聚光灯下的样子，却活成了自己。|You never lived in the spotlight — you lived as yourself.'],
      [p.gray && p.gray.rank >= 3, 'graylegend', '灰色传奇|A Legend in the Gray', '你游走在规则边缘，赚到了别人想不到的钱。|You walked the edge of the rules and made money others never dreamed of.'],
      [(c.promos || 0) >= 8, 'workaholic', '工作狂|Workaholic', '你这辈子最长的关系，是和你的工作。|Your longest relationship was with your job.'],
      [nw < G.$(20000) && hap >= 72, 'poorhappy', '穷开心|Poor but Happy', '钱不多，笑声不少。|Little money, plenty of laughter.'],
      [p.flags.blacklist, 'blacklist', '失信人|On the Blacklist', '你欠下的债，比你留下的东西多。|You left behind more debts than belongings.']
    ];
  };
  var title0 = EN.title;
  EN.title = function (nw, hap, kids) {
    var S = G.S, p = S.p, c = S.cnt, b = G.$(1);
    var top = NEW_TOP(S, p, c, nw, hap, kids, b);
    for (var i = 0; i < top.length; i++) if (top[i][0]) return { k: top[i][1], t: top[i][2], d: top[i][3] };
    var base = title0.apply(this, arguments);
    // the old list's generic outcomes give way to more specific ones
    if (['happy', 'hard', 'plain', 'alone', 'free', 'drifter', 'richsad', 'young'].indexOf(base.k) >= 0) {
      var mid = NEW_MID(S, p, c, nw, hap, kids, b);
      for (var j = 0; j < mid.length; j++) if (mid[j][0] && !(base.k === 'young' && ['silverspoon', 'silverspoon2', 'spare', 'prodigal'].indexOf(mid[j][1]) >= 0)) return { k: mid[j][1], t: mid[j][2], d: mid[j][3] };
    }
    return base;
  };
  var EPI2 = {
    crownvote: ['我戴过王冠，也拿过选票。|I wore a crown and won a vote.'], manylands: ['我的祖国，不止一个。|I had more than one homeland.'],
    king: ['王冠留给后人，我只带走回忆。|The crown stays; I take only memories.', '愿王国长存。|Long may the kingdom endure.'], abdicate: ['我选择了做回自己。|I chose to be myself again.'],
    cinc: ['士兵们，稍息。|At ease, soldiers.'], fivestar: ['最后一次敬礼。|One last salute.'], fromnothing: ['别忘了你从哪里来。|Never forget where you came from.'],
    lostcrown: ['差一点，就是一辈子。|One step short, for a lifetime.'], forlove: ['我不后悔。|No regrets.'], heir: ['还在等。|Still waiting.'], spare: ['我也曾是王子。|I was a prince too, once.'],
    prodigal: ['对不起，祖宗。|Sorry, ancestors.'], silverspoon: ['这辈子，挺舒服的。|It was a comfortable life.'], silverspoon2: ['我到底想要什么？|What did I ever want?'],
    ragsriches: ['我穷过，所以我知道。|I was poor once; that\'s how I knew.'], homeagain: ['妈，我回来了。|Mom, I\'m home.'], search: ['如果你看到这块碑，请告诉我的家人。|If you read this, tell my family.'],
    redeem: ['错了，就改。|When you\'re wrong, make it right.'], philanthropist: ['钱是用来温暖别人的。|Money is for keeping others warm.'], starkid: ['我就是我。|I was just me.'],
    graylegend: ['规则是给守规矩的人定的。|Rules are for those who follow them.'], workaholic: ['明天的会，帮我请个假。|Tell them I\'ll miss tomorrow\'s meeting.'], poorhappy: ['笑着来，笑着走。|Came laughing, left laughing.'], blacklist: ['欠的，下辈子还。|I\'ll pay it back next life.']
  };
  var epi0 = EN.epitaph;
  EN.epitaph = function (k) { return EPI2[k] ? G.pick(EPI2[k]) : epi0.apply(this, arguments); };
})();
