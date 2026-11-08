/* Later-life events (55+) */
(function () {
  'use strict';
  var N = G.N, H = G.EH, E = H.E, O = H.O, R = H.R, RC = H.RC;
  G.evs([
    E('o_supplement', [58, 100], '保健品讲座|Health-Supplement Seminar', '💊', '小区里来了个“专家”，免费送鸡蛋，推销包治百病的保健品。|A self-styled "expert" in your neighborhood hands out free eggs and pitches a cure-all supplement.', [
      O('买一大堆|Buy a whole stack', R('吃了半年，除了钱包变瘦，什么都没变。|Six months later, only your wallet got thinner.', { money: -2000, happy: 2 })),
      O('拿了鸡蛋就走|Take the eggs and leave', R('免费的鸡蛋真香。|Free eggs taste great.', { happy: 2 })),
      O('举报骗子|Report the scammer', R('警察端掉了这个窝点。|Police shut it down.', { karma: 4 }))
    ]),
    E('o_smartphone', [60, 100], '学用智能手机|Learning the Smartphone', '📱', '孩子给你买了智能手机，可你什么都不会用。|Your kids bought you a smartphone, but you can\'t figure it out.', [
      O('让孙辈教你|Ask the grandkids', R('你学会了发语音和刷短视频，乐此不疲。|You learned voice messages and short videos — and can\'t stop.', { happy: 6, smarts: 1 })),
      O('还是用老人机|Stick with the old flip phone', R('你觉得老人机最好用。|The old phone suits you just fine.', {}))
    ], { if: function (S) { return S.year >= 2012; } }),
    E('o_college', [55, 90], '老年大学|Senior College', '🎓', '社区开了老年大学，有书法、合唱、摄影班。|A senior college opens nearby, offering calligraphy, choir, and photography.', [
      O('报名书法班|Calligraphy', R('你的字越写越好。|Your calligraphy keeps improving.', { smarts: 2, happy: 5, sk: { art: 5 } })),
      O('报名合唱团|Choir', R('你在合唱团认识了很多新朋友。|You made many new friends in the choir.', { happy: 6, eq: 2 })),
      O('不去|Skip it', R('你更喜欢在家看电视。|You prefer TV at home.', {}))
    ]),
    E('o_will', [60, 100], '立遗嘱|Making a Will', '📜', '你开始考虑身后事，要立一份遗嘱吗？|You start thinking about the end. Make a will?', [
      O('平分给所有孩子|Split it equally among the kids', R('孩子们都没意见。|The children are all fine with it.', { kids: 4 })),
      O('全部捐给慈善|Leave everything to charity', R('孩子们有点不高兴，但你觉得很踏实。|The kids grumble, but you feel at peace.', { karma: 15, kids: -8, fame: 2 })),
      O('先不急|No rush', R('你觉得自己还能活很久。|You figure you have plenty of time.', {}))
    ], { if: function () { return H.kidsN() > 0; } }),
    E('o_twilight', [58, 90], '黄昏恋|Love in the Twilight Years', '🌅', '晨练时，一位和蔼的{x}总是和你打招呼。|During morning exercise, a kind {x} always says hello.', [
      O('慢慢交往|Get to know them', function (c) { var n = N.mkRomantic({ rel: 'friend', love: 40, aff: 40, minGap: -5, maxGap: 5 }); n.pin = 1; c.prm.n = n.name; H.fx(c, { happy: 8 }); return '你和{n}成了无话不谈的伙伴。|You and {n} became inseparable companions.'; }),
      O('保持距离|Keep your distance', R('你只是礼貌地点头。|You just nod politely.', {}))
    ], { prep: function (c) { if (N.partner()) return false; c.prm.x = G.S.p.orient === 'gay' ? (G.S.p.g === 'm' ? '老先生|gentleman' : '老太太|lady') : (G.S.p.g === 'm' ? '老太太|lady' : '老先生|gentleman'); } }),
    E('o_interview', [90, 120], '长寿秘诀|Secret to Longevity', '🎙️', '电视台来采访你这位老寿星，问你长寿的秘诀。|A TV station interviews you as a centenarian-in-waiting and asks your secret.', [
      O('“心态好，少操心。”|"Stay positive, don\'t worry."', R('你的采访感动了很多人。|Your interview touched many hearts.', { fame: 5, happy: 6 })),
      O('“每天一杯酒！”|"A drink every day!"', R('观众们笑翻了。|Viewers roared with laughter.', { fame: 6, happy: 6 }))
    ], { good: 1 }),
    E('o_memory', [70, 120], '记忆衰退|Fading Memory', '🧩', '你发现自己越来越记不住事了，有时连家人的名字都会叫错。|You keep forgetting things — sometimes even family members\' names.', [
      O('每天做脑力练习|Do daily brain exercises', R('你每天下棋、读报，记忆力维持得不错。|Daily chess and newspapers keep your mind sharp.', { smarts: 2 })),
      O('去医院检查|Get checked at a hospital', function (c) { if (G.ch(.4)) { c.p.ill.push({ id: 'alz', yrs: 0, known: 1 }); return '医生诊断你患了阿尔茨海默症的早期症状。|The doctor diagnosed early-stage Alzheimer\'s.'; } return '医生说只是正常的老化。|The doctor says it\'s normal aging.'; })
    ], { bad: 1 }),
    E('o_garden', [55, 120], '种花养鸟|Garden and Birds', '🌻', '退休后，你在阳台上种满了花，还养了一只画眉。|In retirement, you fill your balcony with flowers and keep a songbird.', [
      O('精心照料|Tend them lovingly', R('每天听着鸟叫醒来，心情格外好。|Waking to birdsong every day lifts your spirits.', { happy: 8, health: 2, stress: -10 }))
    ], { if: function (S, p) { return p.retired; } }),
    E('o_countryside', [60, 90], '回乡养老|Retire to the Countryside', '🏞️', '你想搬回乡下老家，过安静的日子。|You want to move back to the countryside for a quiet life.', [
      O('搬回乡下|Move back', function (c) { c.p.tier = 5; c.p.city = G.pick(G.C[c.p.country].cities[5]); H.fx(c, { happy: 8, health: 3 }); return '你回到了小时候的地方，空气清新，日子悠闲。|You returned to where you grew up — fresh air, slow days.'; }),
      O('留在城里方便看病|Stay in the city near hospitals', R('你还是留在了城里。|You stayed in the city.', {}))
    ], { if: function (S, p) { return p.retired && p.tier <= 3; } }),
    E('o_reunion', [60, 95], '老战友/老同学|Old Friends', '👴', '几十年没见的老同学打来电话，要组织一次聚会。|An old classmate you haven\'t seen in decades calls to organize a reunion.', [
      O('一定参加|Definitely go', function (c) { var f = N.make({ rel: 'friend', age: c.p.age, aff: 50 }); c.prm.f = f.name; H.fx(c, { happy: 10 }); return '你们聊起年轻时的事，笑出了眼泪。少了几张熟悉的面孔，{f}握着你的手说要常联系。|You laughed till you cried over old times. A few familiar faces were missing, and {f} squeezed your hand, promising to keep in touch.'; })
    ]),
    E('o_fall', [65, 120], '摔倒|A Fall', '🦯', '你在浴室滑了一跤。|You slip in the bathroom.', [
      O('自己慢慢爬起来|Slowly get up on your own', RC(.6, '还好只是擦伤。|Luckily just a bruise.', { health: -3 }, '你摔断了髋骨，住院了好几个月。|You broke your hip and spent months in the hospital.', { health: -20, money: -3000 })),
      O('叫救护车|Call an ambulance', R('及时就医，没有大碍。|Prompt care meant no lasting harm.', { health: -5, money: -500 }))
    ], { bad: 1 }),
    E('o_great_grand', [80, 120], '四世同堂|Four Generations', '👨‍👩‍👧‍👦', '过年时，四代人围坐在一起吃团圆饭。|For the holidays, four generations gather around the table.', [
      O('举杯祝福|Raise a toast', R('看着满堂儿孙，你觉得这辈子值了。|Looking at your sprawling family, you feel your life was worth it.', { happy: 15, kids: 5 }))
    ], { good: 1, if: function () { return N.rel('grandchild').length >= 2; } }),
    E('o_body', [70, 120], '捐献遗体|Body Donation', '🫀', '你看到一则新闻，医学院急需遗体用于教学。|You see a news story: medical schools urgently need bodies for teaching.', [
      O('签署捐献协议|Sign up as a donor', R('你说：“死后也要为社会做点贡献。”|You said, "Even after death, I want to give something back."', { karma: 12 })),
      O('算了|Not for me', R('你还是想入土为安。|You\'d rather rest in the ground.', {}))
    ], { w: .4 })
  ]);
})();
