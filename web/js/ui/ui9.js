/* Version 2.0 interface: graves you can keep visiting, move to a finer cemetery, and the small stories that happen there. */
(function () {
  'use strict';
  var h = G.h, UI = G.UI, T = UI.T, tap = UI.tap, N = G.N;
  var GRAVE_TALES = [
    '你到的时候，碑前已经放着一束新鲜的白菊。不知道是谁来过。|When you arrived there were already fresh white chrysanthemums at the stone. Someone had been before you.',
    '隔壁墓前的老人和你聊了起来。原来，他认识{n}——几十年前，他们是邻居。|The old man at the next grave started talking. He had known {n} — they were neighbours decades ago.',
    '下起了小雨。你没有带伞，就在碑前站着，任雨把头发打湿。|A light rain began. You had no umbrella and simply stood at the stone, letting your hair get wet.',
    '你在碑前摆上了{n}生前最爱吃的东西，坐下来，像从前一样陪ta吃了一顿饭。|You laid out {n}\'s favourite food, sat down, and shared a meal with them as you used to.',
    '守墓的大爷说，每年这个时候都有一个陌生人来这里坐一会儿，什么也不说。|The caretaker says every year at this time a stranger comes, sits here a while, and says nothing.',
    '你用手指描着碑上的字。那是你第一次发现，名字刻得那么深。|You traced the letters with your finger, and noticed for the first time how deeply the name was carved.'
  ];
  var gv9 = UI.grave;
  UI.grave = function (n, done) {
    var r = gv9.apply(this, arguments);
    try {
      var sheets = document.querySelectorAll('.sheet'), sh = sheets[sheets.length - 1], box = sh && sh.querySelector('.gacts'), stone = sh && sh.querySelector('.stone');
      var plot = G.PLOTS[n.plot || 0];
      if (stone) stone.appendChild(h('div', { class: 'plot' }, plot.i + ' ' + T(plot.n)));
      if (box) {
        box.appendChild(h('button', { class: 'gact', onclick: tap(async function () {
          var s = G.S;
          if (n.visitY === s.year && n.visits >= 3) { UI.toast(G.L('今年已经来过好几次了。|You\'ve already been several times this year.')); return; }
          n.visits = n.visitY === s.year ? (n.visits || 0) + 1 : 1; n.visitY = s.year;
          G.dStart(); G.addStat('happy', 2); G.addStat('eq', 1, true); G.addStat('stress', -4); var dl = G.dEnd();
          await G.result(G.L('扫墓|At the Grave'), G.L(G.pick(GRAVE_TALES), { n: n.name }), null, dl, '🕯️');
        }) }, T('🕯️ 祭扫|🕯️ Pay your respects')));
        if ((n.plot || 0) < G.PLOTS.length - 1) box.appendChild(h('button', { class: 'gact', onclick: tap(async function () {
          var items = G.PLOTS.map(function (pl, i) { return { t: pl.n, icon: pl.i, sub: i <= (n.plot || 0) ? G.L('现在的位置|Where they rest now') : G.M(G.$(pl.usd)), dis: i <= (n.plot || 0) || !G.canPay(G.$(pl.usd)) }; });
          var i = await UI.pick({ title: G.L('迁到更好的陵园|Move to a Finer Resting Place'), text: G.L('让{n}睡在一个更安静、更好看的地方。|Let {n} rest somewhere quieter and more beautiful.', { n: n.name }), items: items });
          if (i < 0 || i <= (n.plot || 0)) return;
          if (!G.pay(G.$(G.PLOTS[i].usd))) return;
          n.plot = i; G.addStat('happy', 4); G.addStat('karma', 2, true);
          G.log('你把{n}迁到了{p}。|You moved {n} to {p}.', { n: n.name, p: G.PLOTS[i].n });
          UI.toast(G.L('迁葬完成。|The move is done.'));
          var pd = stone && stone.querySelector('.plot'); if (pd) pd.textContent = G.PLOTS[i].i + ' ' + T(G.PLOTS[i].n);
        }) }, T('🏛️ 迁到更好的陵园|🏛️ Move to a finer cemetery')));
      }
    } catch (e) { console.error(e); }
    return r;
  };
})();
