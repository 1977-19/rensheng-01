/* NPC chat: offline personality engine + optional real AI (OpenAI-compatible APIs) */
(function () {
  'use strict';
  var CH = G.chat = {};
  var N = G.N;
  CH.PROVIDERS = {
    deepseek: { n: 'DeepSeek', url: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat' },
    openai: { n: 'OpenAI', url: 'https://api.openai.com/v1/chat/completions', model: 'gpt-4o-mini' },
    qwen: { n: '通义千问|Qwen', url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions', model: 'qwen-plus' },
    kimi: { n: 'Kimi', url: 'https://api.moonshot.cn/v1/chat/completions', model: 'moonshot-v1-8k' },
    glm: { n: '智谱GLM|Zhipu GLM', url: 'https://open.bigmodel.cn/api/paas/v4/chat/completions', model: 'glm-4-flash' },
    custom: { n: '自定义|Custom', url: '', model: '' }
  };
  CH.INTENTS = [
    ['insult', /滚|傻|笨蛋|蠢|讨厌你|闭嘴|去死|废物|垃圾|idiot|stupid|hate you|shut up|loser|dumb/i],
    ['love', /我爱你|做我.*(朋友|对象)|在一起吧|嫁给我|娶我|love you|be my (girl|boy)friend|marry me/i],
    ['sorry', /对不起|抱歉|我错了|sorry|apolog|my bad/i],
    ['money', /借.*钱|给我.*钱|零花钱|转账|红包|lend|loan|money|cash|borrow/i],
    ['date', /约会|吃饭|看电影|出去玩|逛街|喝一杯|date|dinner|movie|hang out|grab a drink/i],
    ['flirt', /想你|喜欢你|亲爱的|宝贝|么么|好想|miss you|cute|babe|darling|sweetheart|kiss/i],
    ['compliment', /好看|漂亮|帅|聪明|厉害|优秀|棒|可爱|beautiful|handsome|smart|awesome|amazing|great job|pretty/i],
    ['thanks', /谢谢|感谢|多谢|thank/i],
    ['care', /最近.*(怎么样|好吗)|身体|累不累|还好吗|吃了吗|how are you|how\'?s it going|you ok|doing ok|feeling/i],
    ['joke', /笑话|哈哈|段子|逗|joke|lol|haha|funny/i],
    ['work', /工作|上班|学习|考试|老板|加班|作业|work|job|school|exam|boss|study/i],
    ['family', /爸|妈|家里|孩子|老婆|老公|family|kids|mom|dad|parents/i],
    ['advice', /怎么办|建议|该不该|帮我|advice|should i|help me|what do i do/i],
    ['gossip', /八卦|听说|你知道吗|gossip|rumor|did you hear/i],
    ['bye', /拜拜|再见|晚安|回头聊|bye|good ?night|see you|ttyl/i],
    ['greet', /你好|嗨|在吗|早|哈喽|hi\b|hello|hey|morning|yo\b/i]
  ];
  CH.detect = function (t) { for (var i = 0; i < CH.INTENTS.length; i++) if (CH.INTENTS[i][1].test(t)) return CH.INTENTS[i][0]; return 'chat'; };
  CH.QUICK = [
    { k: 'greet', t: '👋 打招呼|👋 Say hi', s: '在吗？最近好吗？|Hey! How have you been?' },
    { k: 'care', t: '🤗 关心|🤗 Check in', s: '最近累不累？要照顾好自己呀。|Have you been tired lately? Take care of yourself.' },
    { k: 'compliment', t: '✨ 夸夸|✨ Compliment', s: '说真的，你真的很优秀。|Honestly, you\'re amazing.' },
    { k: 'joke', t: '😂 讲笑话|😂 Tell a joke', s: '给你讲个笑话：程序员最怕什么？怕bug变成feature。|Here\'s a joke: why did the scarecrow win an award? He was outstanding in his field.' },
    { k: 'work', t: '💼 聊近况|💼 Catch up', s: '你最近工作/学习忙吗？|Busy with work or school lately?' },
    { k: 'gossip', t: '🗣️ 八卦|🗣️ Gossip', s: '你听说了吗？我有个大八卦！|Did you hear? I\'ve got big gossip!' },
    { k: 'date', t: '🍽️ 约饭|🍽️ Invite out', s: '周末一起吃个饭？|Want to grab dinner this weekend?' },
    { k: 'flirt', t: '😘 撩一下|😘 Flirt', s: '突然好想你。|I suddenly miss you.', rom: 1 },
    { k: 'money', t: '💸 借钱|💸 Ask for money', s: '能借我点钱吗？最近手头有点紧。|Could you lend me some money? Things are tight.' },
    { k: 'sorry', t: '🙏 道歉|🙏 Apologize', s: '之前是我不对，对不起。|I was wrong before. I\'m sorry.' },
    { k: 'insult', t: '😤 吵架|😤 Pick a fight', s: '你真的很让人讨厌！|You are so annoying!' }
  ];

  function tone(n) {
    if (n.aff < -20) return 'hos';
    if ((n.rel === 'lover' || n.rel === 'spouse' || n.rel === 'affair') && n.love > 30) return 'rom';
    if (N.family[n.rel]) return 'fam';
    if (n.aff > 65) return 'close';
    if (n.aff > 15) return 'warm';
    return 'cool';
  }
  // reply bank: intent -> tone -> lines
  var R = {
    greet: { hos: ['有事？|What do you want?', '……|...'], cool: ['嗯，你好。|Oh, hi.', '在的，什么事？|Here. What\'s up?'], warm: ['嗨！好久没聊了！|Hey! Long time no talk!', '在呢在呢～最近还行吧？|I\'m here~ How have you been?'], close: ['终于想起我啦！|Finally remembered me, huh!', '哈喽！正想找你呢！|Hey! I was just about to text you!'], fam: ['孩子，最近怎么样？|Hey kiddo, how are you doing?', '吃饭了没？|Have you eaten yet?'], rom: ['宝，在想你呢～|Babe, I was just thinking about you~', '你终于来消息了！|You finally texted!'] },
    care: { hos: ['用不着你假惺惺。|Spare me the fake concern.'], cool: ['还行吧，谢谢。|I\'m fine, thanks.'], warm: ['挺好的，谢谢关心！你呢？|Pretty good, thanks for asking! You?', '最近有点累，不过还撑得住。|A bit tired lately, but hanging in there.'], close: ['还是你最懂我，最近确实压力好大。|You always get me. Things have been stressful.', '有你关心真好～|It\'s so nice having you care~'], fam: ['我们都挺好，你照顾好自己就行。|We\'re fine — just take care of yourself.', '老毛病了，不碍事，别担心。|Same old aches, nothing serious. Don\'t worry.'], rom: ['有你在，我什么都好。|With you around, I\'m always good.', '累了，想抱抱。|Tired. Need a hug.'] },
    compliment: { hos: ['少来这套。|Don\'t try that on me.'], cool: ['呃……谢谢？|Uh... thanks?'], warm: ['哈哈，你嘴真甜！|Haha, you\'re sweet!', '真的吗？谢谢你！|Really? Thank you!'], close: ['你也超棒的好吗！|You\'re amazing too, you know!'], fam: ['哈哈，跟谁学的这么会说话。|Ha, where did you learn to talk like that?'], rom: ['你这么说我会脸红的……|You\'ll make me blush...', '那当然，不然怎么配得上你～|Of course — how else would I deserve you~'] },
    joke: { hos: ['一点都不好笑。|Not funny.'], cool: ['……哈。|...ha.'], warm: ['哈哈哈哈，笑死我了！|Hahaha, I\'m dying!', '冷，太冷了。|That was so cold.'], close: ['你怎么这么好笑啊哈哈哈！|How are you so funny, hahaha!'], fam: ['你这孩子，就会贫嘴。|You and your jokes.'], rom: ['只有你能把我逗笑。|Only you can make me laugh like this.'] },
    work: { hos: ['关你什么事。|None of your business.'], cool: ['还行，老样子。|Fine. Same as always.'], warm: ['忙死了，天天加班！|Swamped — overtime every day!', '还不错，最近有个项目挺顺利。|Not bad, a project\'s going well.'], close: ['别提了，老板又给我画大饼。|Don\'t get me started; my boss keeps promising the moon.'], fam: ['工作别太拼，身体要紧。|Don\'t work too hard; your health comes first.', '好好干，家里以你为荣。|Do your best — we\'re proud of you.'], rom: ['再忙也要陪你。|No matter how busy, I\'ll make time for you.'] },
    family: { hos: ['别提我家。|Leave my family out of it.'], cool: ['家里都好。|Family\'s fine.'], warm: ['家里都挺好的，谢谢！|Everyone at home is well, thanks!'], close: ['我妈又催我结婚了，烦死了！|My mom is nagging me about marriage again — ugh!'], fam: ['家里一切都好，有空常回来看看。|All good at home. Come visit when you can.'], rom: ['什么时候见见我家人？|When will you meet my family?'] },
    money: { hos: ['做梦。|In your dreams.'], cool: ['我也没什么钱……|I don\'t really have money either...'], warm: ['要多少？我看看能不能帮你。|How much? Let me see if I can help.'], close: ['跟我还客气什么！|Don\'t be shy with me!'], fam: ['又没钱了？我给你转点。|Out of money again? I\'ll send you some.'], rom: ['我的就是你的。|What\'s mine is yours.'] },
    date: { hos: ['不去。|No.'], cool: ['最近有点忙，改天吧。|I\'m busy lately. Some other time.'], warm: ['好啊！去哪？|Sure! Where to?', '可以呀，我请你！|Sure, my treat!'], close: ['走起！老地方见！|Let\'s go! Usual place!'], fam: ['好啊，回家吃饭吧，给你做好吃的。|Sure — come home and I\'ll cook for you.'], rom: ['想你了，快来见我！|I miss you — come see me!'] },
    flirt: { hos: ['恶心。|Gross.'], cool: ['……你没事吧？|...are you okay?', '我们不是很熟吧。|We\'re not that close.'], warm: ['你……说什么呢！|W-what are you saying!', '哈哈，你今天怎么了？|Haha, what\'s gotten into you today?'], close: ['你再这样我要当真了。|Keep that up and I\'ll take it seriously.'], fam: ['这孩子，说什么呢。|Silly child, what are you saying.'], rom: ['我也想你，好想好想。|I miss you too, so, so much.', '笨蛋，我早就是你的人了。|Dummy, I\'m already yours.'] },
    love: { hos: ['你疯了吧。|Are you crazy?'], cool: ['抱歉，我只当你是朋友。|Sorry, I only see you as a friend.'], warm: ['让我想想……|Let me think about it...'], close: ['其实……我也喜欢你。|Actually... I like you too.'], fam: ['我们也爱你，傻孩子。|We love you too, silly.'], rom: ['我也爱你，永远。|I love you too. Forever.'] },
    sorry: { hos: ['现在才道歉？晚了。|Apologizing now? Too late.', '……好吧，我考虑原谅你。|...Fine. I\'ll think about forgiving you.'], cool: ['没事，都过去了。|It\'s fine, it\'s in the past.'], warm: ['没关系，我没往心里去。|No worries, I didn\'t take it to heart.'], close: ['傻瓜，我怎么会怪你。|Silly, how could I blame you.'], fam: ['一家人，说什么对不起。|We\'re family. No need for sorry.'], rom: ['抱抱就原谅你。|A hug and you\'re forgiven.'] },
    insult: { hos: ['你才是！|Look who\'s talking!', '我们走着瞧。|We\'ll see about that.'], cool: ['你有病吧？|What\'s your problem?'], warm: ['你……你怎么能这么说我！|How could you say that to me!'], close: ['你今天吃错药了？|Did you take the wrong pills today?'], fam: ['你这孩子怎么说话的！|Is that any way to talk to me!'], rom: ['你这样说，我很伤心。|It really hurts when you talk like that.'] },
    thanks: { hos: ['哼。|Hmph.'], cool: ['不客气。|You\'re welcome.'], warm: ['小事一桩！|No big deal!'], close: ['跟我还客气！|No need to thank me!'], fam: ['应该的。|Of course.'], rom: ['那今晚请我吃饭～|Then dinner\'s on you tonight~'] },
    advice: { hos: ['自己想办法。|Figure it out yourself.'], cool: ['这个……我也不知道。|Hmm... I don\'t know.'], warm: ['我觉得你应该相信自己的直觉。|I think you should trust your gut.', '别想太多，先睡一觉再说。|Don\'t overthink it — sleep on it.'], close: ['不管你怎么选，我都支持你！|Whatever you choose, I\'ve got your back!'], fam: ['听我的，稳一点总没错。|Take my advice: play it safe.'], rom: ['有我在，别怕。|I\'m here. Don\'t be scared.'] },
    gossip: { hos: ['没兴趣。|Not interested.'], cool: ['哦。|Oh.'], warm: ['真的假的？快说快说！|For real? Tell me everything!'], close: ['天哪！我就知道！|OMG! I knew it!'], fam: ['少管别人家的闲事。|Don\'t meddle in other people\'s business.'], rom: ['你知道的真多，哈哈。|You know everything, haha.'] },
    bye: { hos: ['赶紧走。|Just go.'], cool: ['嗯，拜拜。|Okay, bye.'], warm: ['拜拜～下次聊！|Bye~ talk later!'], close: ['好梦！明天见！|Sweet dreams! See you tomorrow!'], fam: ['早点休息，别熬夜。|Get some rest, don\'t stay up late.'], rom: ['晚安，梦里见～|Good night, see you in my dreams~'] },
    chat: { hos: ['……|...', '你到底想说什么？|What are you trying to say?'], cool: ['嗯嗯。|Mm-hm.', '是吗。|Is that so.'], warm: ['哈哈，有意思！|Haha, interesting!', '然后呢然后呢？|And then?'], close: ['懂你！|Totally get you!', '我也是这么想的！|I was thinking the same!'], fam: ['嗯，知道了。|Okay, got it.'], rom: ['你说什么我都爱听。|I love hearing anything you say.'] }
  };
  var FLAVOR = {
    tsun: ['哼，|Hmph, ', '', '……才不是为了你呢！|...not that I did it for you!'], sharp: ['啧，|Tsk, ', '', ''], cheer: ['哈哈哈，|Hahaha, ', '', '！|!'],
    gentle: ['嗯嗯，|Mm, ', '', '～|~'], cold: ['', '', ''], boss: ['听着，|Listen, ', '', ''], gold: ['', '', '对了，最近看上一个包……|By the way, I\'ve got my eye on a new bag...'],
    nerd: ['从概率上说，|Statistically speaking, ', '', ''], chill: ['', '', '随缘吧。|Whatever happens, happens.'], clingy: ['你终于理我了！|You finally answered! ', '', ''],
    rebel: ['切，|Pfft, ', '', ''], romantic: ['', '', '今晚的月亮很美。|The moon is lovely tonight.'], scheme: ['呵呵，|Heh, ', '', ''], honest: ['嘿嘿，|Hehe, ', '', ''], artsy: ['', '', '最近在读一本很好的书。|I\'ve been reading a lovely book lately.'],
    prag: ['', '', ''], playboy: ['', '', '😉|😉']
  };
  CH.FLAVOR = FLAVOR;
  var GAIN = { greet: 1, care: 2, compliment: 2, joke: 1.5, work: 1, family: 1.5, money: -2, date: 1, flirt: 0, love: 0, sorry: 1, insult: -8, thanks: 1, advice: 1, gossip: 1, bye: .5, chat: .5 };

  CH.offline = function (n, intent) {
    var tn = tone(n), bank = R[intent] || R.chat, lines = bank[tn] || bank.warm || bank.cool;
    if (intent === 'love' && tn !== 'fam' && tn !== 'rom') lines = N.attract(n) > .55 || n.love > 55 ? R.love.close : (n.aff > 20 ? R.love.warm : R.love.cool);
    if (intent === 'flirt' && tn !== 'fam' && tn !== 'rom') { var a = N.canRomance(n) ? N.attract(n) : 0; lines = a > .55 ? R.flirt.close : a > .35 ? R.flirt.warm : R.flirt.cool; }
    if (intent === 'sorry' && n.aff >= -20 && tn === 'hos') lines = R.sorry.hos.slice(1);
    var line = G.pick(lines), fl = FLAVOR[n.pers] || ['', '', ''];
    var pre = G.ch(.5) ? fl[0] : '', suf = G.ch(.3) ? fl[2] : '';
    if (tn === 'hos' || tn === 'fam') { pre = ''; suf = ''; }
    return G.join([pre || '|', line, suf || '|'], '', '');
  };
  CH.effects = function (n, intent) {
    var S = G.S, out = { aff: 0, love: 0, note: null };
    if (n.chatY !== S.year) { n.chatY = S.year; n.chatGain = 0; }
    var g = GAIN[intent] || 0, pe = n.pers;
    if (intent === 'compliment' && (pe === 'cold' || pe === 'sharp')) g = 1;
    if (intent === 'joke' && pe === 'cheer') g = 3; if (intent === 'joke' && pe === 'cold') g = 0;
    if (intent === 'sorry' && n.aff < 0) g = 6;
    if (intent === 'money' && (N.family[n.rel] || n.aff > 60)) g = -.5;
    if (g > 0) { g = Math.min(g, Math.max(0, 8 - (n.chatGain || 0))); n.chatGain = (n.chatGain || 0) + g; }
    if (g) out.aff = N.addAff(n, g);
    if (intent === 'flirt' && N.canRomance(n)) { var a = N.attract(n); out.love = N.addLove(n, a > .4 ? Math.min(4, a * 6) : -2); if (a < .35) out.aff += N.addAff(n, -2); }
    if (intent === 'insult') out.love = N.addLove(n, -5);
    if (intent === 'money') {
      var giveP = (n.aff + 20) / 160 + (N.family[n.rel] ? .3 : 0) + (n.rel === 'spouse' || n.rel === 'lover' ? .25 : 0) - (n.lastLend === S.year ? .7 : 0);
      if (n.wealth > G.$(200) && G.ch(G.clamp(giveP, 0, .9))) {
        var amt = Math.round(Math.min(n.wealth * .05, G.$(N.family[n.rel] ? 3000 : 800) * (1 + (n.tags.length ? 20 : 0))));
        amt = Math.max(amt, Math.round(G.$(20))); n.wealth -= amt; G.addMoney(amt); n.lastLend = S.year;
        out.note = G.L('{n}转给你{m}|{n} sent you {m}', { n: n.name, m: G.M(amt) });
      }
    }
    if (intent === 'love' && n.confY !== S.year && N.canRomance(n) && n.rel !== 'lover' && n.rel !== 'spouse') {
      n.confY = S.year;
      var ok = G.love.confess(n);
      out.note = ok ? G.L('你和{n}在一起了！|You and {n} are now a couple!', { n: n.name }) : G.L('{n}拒绝了你。|{n} turned you down.', { n: n.name });
    }
    return out;
  };

  /* AI */
  CH.aiReady = function () { var a = G.settings.ai || {}; return !!(a.on && a.key && (a.url || CH.PROVIDERS[a.provider || 'deepseek'].url)); };
  CH.persona = function (n) {
    var p = G.S.p, lang = G.lang === 'en' ? 'English' : G.lang === 'tw' ? '繁體中文' : '简体中文';
    var na = N.age(n), minor = na < 18 || p.age < 18;
    var T = function (s) { return G.T(s); };
    var lines = [
      '你正在一款名为《我的一生模拟器》的人生模拟游戏中扮演一个角色，正在用手机和玩家聊天。',
      '【你的角色】姓名：' + T(n.name) + '；' + na + '岁；' + (n.g === 'm' ? '男' : '女') + '；职业：' + T(n.job) + '；性格：' + (G.persona ? (function () { var x = G.persona(n); return G.persName(n) + '（' + T(x.d) + '）；爱好：' + x.hob.map(T).join('、') + '；小习惯：' + T(x.quirk) + (x.cp ? '；口头禅：“' + T(x.cp) + '”' : ''); })() : T(G.PERS[n.pers].n)) + '；国家：' + T(G.C[n.c].n) + '；经济状况：' + T(N.wealthLabel(n)) + '。',
      '【你和玩家的关系】' + T(N.relName(n)) + '；你对玩家的好感度：' + n.aff + '（-100到100）' + (n.rel === 'lover' || n.rel === 'spouse' ? '；爱意：' + n.love + '/100' : '') + '。',
      '【玩家】' + T(p.name) + '，' + p.age + '岁，' + (p.g === 'm' ? '男' : '女') + '，' + T(G.title()) + '，颜值' + p.st.looks + '/100。',
      '【现在】' + G.S.year + '年。',
      '要求：完全以角色身份、用口语化的聊天短信风格回复，1到3句，不超过60个字，贴合性格和关系与好感度；不要说自己是AI或在玩游戏；不写动作描写；不输出任何露骨或成人内容。' + (minor ? '对话中有未成年人，保持纯真友好，不涉及任何恋爱暧昧内容。' : ''),
      '在回复的最后另起一行附上标记，表示这条消息让你对玩家的好感变化，格式：[好感:+1]，范围-5到+5。',
      '请使用' + lang + '回复。'
    ];
    return lines.join('\n');
  };
  CH.ai = async function (n, text) {
    var a = G.settings.ai, pv = CH.PROVIDERS[a.provider || 'deepseek'] || CH.PROVIDERS.custom;
    var url = a.url || pv.url, model = a.model || pv.model;
    var msgs = [{ role: 'system', content: CH.persona(n) }];
    (n.chat || []).slice(-12).forEach(function (m) { msgs.push({ role: m.f === 'me' ? 'user' : 'assistant', content: G.T(m.t) }); });
    msgs.push({ role: 'user', content: text });
    var raw = await G.native.http({ url: url, headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + a.key }, body: JSON.stringify({ model: model, messages: msgs, temperature: .9, max_tokens: 220 }) });
    var j = JSON.parse(raw), out = (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content) || '';
    var m = out.match(/[\[【](?:好感|affection|aff)\s*[:：]\s*([+-]?\d+)[\]】]/i);
    var d = m ? G.clamp(parseInt(m[1], 10), -5, 5) : 0;
    out = out.replace(/[\[【](?:好感|affection|aff)\s*[:：]\s*[+-]?\d+[\]】]/ig, '').trim();
    return { text: out || '……', d: d };
  };

  /* main send */
  CH.send = async function (n, text, intentHint) {
    var S = G.S; if (!n || !n.alive) return null;
    text = String(text || '').replace(/\|/g, '/').slice(0, 300);
    if (!text) return null;
    n.chat = n.chat || []; n.unread = 0;
    n.chat.push({ f: 'me', t: text + '|' + text, y: S.year });
    N.touch(n); G.inc('chats');
    var intent = intentHint || CH.detect(text), reply, eff;
    if (CH.aiReady()) {
      try {
        var r = await CH.ai(n, text);
        reply = r.text + '|' + r.text;
        eff = CH.effects(n, intent === 'insult' || intent === 'money' || intent === 'love' ? intent : 'chat');
        if (r.d) { var g = r.d > 0 ? Math.min(r.d, Math.max(0, 8 - (n.chatGain || 0))) : r.d; n.chatGain = (n.chatGain || 0) + Math.max(0, g); eff.aff += N.addAff(n, g); }
        G.inc('aiChats');
      } catch (e) {
        reply = G.L('（AI 连接失败：{e}，已切换为离线回复）|(AI connection failed: {e}. Using offline reply.)', { e: String(e.message || e).slice(0, 80) });
        n.chat.push({ f: 's', t: reply, y: S.year });
        reply = CH.offline(n, intent); eff = CH.effects(n, intent);
      }
    } else { reply = CH.offline(n, intent); eff = CH.effects(n, intent); }
    n.chat.push({ f: 'n', t: reply, y: S.year });
    if (eff.note) n.chat.push({ f: 's', t: eff.note, y: S.year });
    if (n.chat.length > 80) n.chat = n.chat.slice(-80);
    G.emit('change');
    return { reply: reply, eff: eff };
  };
  CH.unread = function () { return G.S ? G.sum(N.all(function (n) { return n.alive; }), function (n) { return n.unread || 0; }) : 0; };
  CH.list = function () {
    return N.all(function (n) { return n.alive && ((n.chat && n.chat.length) || N.family[n.rel] || n.rel === 'spouse' || n.rel === 'lover' || n.rel === 'friend'); })
      .sort(function (a, b) { return (b.unread || 0) - (a.unread || 0) || ((b.chat || []).length ? (b.chat[b.chat.length - 1].y) : 0) - ((a.chat || []).length ? (a.chat[a.chat.length - 1].y) : 0) || b.aff - a.aff; });
  };
})();
