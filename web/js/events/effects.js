/* Version 3.3 — every outcome changes something.
   An audit (tools/effect_audit.js) found that about one option in five ended with a story ("you got a bonus",
   "you fell out with your friends", "your parents were proud") while nothing on your sheet moved: no money, no
   affection, no stat — or only a hidden stat like stress or karma that you never see.
   This layer reads what the outcome actually says and makes the sheet agree with it:
     · money words with no money change    → money moves (scaled to your age and income)
     · parents / partner / children / friends with no affection change → their affection moves
     · nothing visible at all              → your mood (or smarts/EQ) moves with the tone of the story
   It never touches an outcome that already changed what it talks about. */
(function () {
  'use strict';
  var N = G.N;
  var HIDDEN = { stress: 1, karma: 1, fit: 1, luck: 1, heat: 1, rep: 1, note: 1 };
  var NEG = /哭|难过|后悔|害怕|失败|骂|丢了|输了|输光|生气|冷战|孤独|委屈|尴尬|失望|伤心|心疼|被罚|罚站|被开除|被抓|吵|嫌弃|嘲笑|没人|拒绝了你|不理你|分手|疏远|拉黑|受伤|摔|疼|病|亏|被骗|白跑|倒霉|糟糕|晚了|错过|空手|惨|崩溃|绝望|丢脸|笑话你|不说话|再也没|散了/;
  var POS = /开心|高兴|笑|感动|骄傲|满足|幸福|喜欢|成功|赢|夸|佩服|欢呼|鼓掌|感谢|谢谢|温暖|甜|惊喜|兴奋|自豪|好评|升职|加薪|朋友|拥抱|成了|学会|顺利|满分|第一|冠军|奖|值了|好吃|痛快|轻松|解脱|自在/;
  var M_POS = /奖金|红包|赚了|赚到|收入|涨薪|加薪|赢了.{0,6}(钱|块|元|万)|中了|报酬|稿费|分红|卖出|卖了|赔偿给你|补贴|压岁钱|零花钱|工资|小费|赏|捡到.{0,4}钱|发了一笔|一笔钱/;
  var M_NEG = /赔了|赔偿|罚款|罚了|花了|亏了|亏掉|损失|被骗|交了|欠了|欠下|买了|医药费|学费|请客|付了|破费|血本无归|打水漂|被偷|被抢|送礼|随礼|份子钱|掏钱|掏腰包/;
  var R_PAR = /爸|妈|父母|爹|娘|家里人/;
  var R_PART = /伴侣|老公|老婆|丈夫|妻子|恋人|对象|男朋友|女朋友|爱人|另一半/;
  var R_KID = /孩子|儿子|女儿|宝宝/;
  var R_FR = /朋友|同学|同事|兄弟|闺蜜|哥们|室友|邻居/;
  function zh(x) { x = String(x || ''); var i = x.indexOf('|'); return i >= 0 ? x.slice(0, i) : x; }
  function tone(t) { var n = NEG.test(t), p = POS.test(t); return p && !n ? 1 : n && !p ? -1 : n && p ? 0 : 0; }
  function visible(list, keys) {
    return (list || []).some(function (x) { return x && x.n && !HIDDEN[x.k] && (!keys || keys.indexOf(x.k) >= 0); });
  }
  function snap(p) { return [p.job ? p.job.id : '', p.edu ? p.edu.stage + '/' + p.edu.school : '', p.country, p.partner, Object.keys(G.S.npcs).length, p.jail ? 1 : 0, p.dead ? 1 : 0, (p.assets || []).length].join('~'); }
  function sizeMoney(p, big) {
    var a = p.age, base = a < 12 ? G.ri(5, 40) : a < 18 ? G.ri(30, 200) : a < 23 ? G.ri(100, 600) : G.ri(300, 2500);
    if (p.job && p.job.sal) base = Math.max(base, Math.round(p.job.sal / (G.$ ? G.$(1) : 1) * G.rf(.01, .05)));
    return big ? base * 3 : base;
  }
  function affAll(list, v) { var n = 0; list.forEach(function (x) { if (x && x.alive) { G.dPush('aff', N.addAff(x, v)); N.touch && N.touch(x); n++; } }); return n; }
  function fill(c, text, d) {
    var p = c.p, t = zh(text), list = G.D.list, sgn = tone(t), done = false;
    // money said, money moved
    if (!visible(list, ['money'])) {
      var mp = M_POS.test(t), mn = M_NEG.test(t);
      if (mp && !mn) { c.money(c.$(sizeMoney(p, /一大笔|很多|巨款|一万|万块|万元/.test(t)))); done = true; }
      else if (mn && !mp) { c.money(-c.$(sizeMoney(p, /一大笔|很多|巨款|血本无归|一万|万块|万元/.test(t)))); done = true; }
    }
    // people said, people moved
    var v = sgn >= 0 ? G.ri(3, 6) : -G.ri(3, 7);
    if (!visible(list, ['aff', 'love'])) {
      if (R_PART.test(t)) { var pt = N.partner(); if (pt && pt.alive) { G.dPush('love', N.addLove(pt, v)); done = true; } }
      if (!done && R_KID.test(t)) { if (affAll(N.rel('child'), v)) done = true; }
      if (!done && R_PAR.test(t)) { if (affAll(N.rel('father', 'mother'), v)) done = true; }
      if (!done && R_FR.test(t)) { var fr = N.all(function (n) { return n.alive && (n.rel === 'friend' || n.rel === 'bff' || n.rel === 'classmate' || n.rel === 'colleague'); }); if (fr.length) { affAll(G.sample(fr, Math.min(2, fr.length)), v); done = true; } }
    }
    // nothing visible at all: the experience leaves its mark on you
    if (!visible(G.D.list)) {
      if (sgn > 0) c.add('happy', G.ri(2, 5));
      else if (sgn < 0) c.add('happy', -G.ri(2, 5));
      else if (/学|读|书|考|研究|练|想明白|明白|懂了|看清/.test(t)) c.add('smarts', G.ri(1, 3));
      else if (/人情|世故|学会了|道理|长大/.test(t)) c.add('eq', G.ri(1, 3));
      else c.add('happy', G.ri(1, 3));
    }
  }
  function wrap(d, o) {
    var r0 = o.run;
    if (o._fx3) return; o._fx3 = 1;
    o.run = async function (c) {
      var before = snap(c.p), res = r0 ? await r0.apply(this, arguments) : null;
      try {
        if (G.D.on && snap(c.p) === before && !c.p.dead && !G.S.dead) fill(c, (typeof res === 'string' ? res : '') + ' ' + zh(typeof o.t === 'string' ? o.t : ''), d);
      } catch (e) { console.error(e); }
      return res;
    };
  }
  G.fxFillAll = function () {
    Object.keys(G.EV).forEach(function (id) {
      var d = G.EV[id]; if (!d || d.noFill) return;
      if (d.o) d.o.forEach(function (o) { wrap(d, o); });
    });
  };
  G.fxFillAll();
  // events registered later (none today, but keep the guarantee)
  var ev0 = G.ev; G.ev = function (d) { var r = ev0.apply(this, arguments); try { if (d && d.o) d.o.forEach(function (o) { wrap(d, o); }); } catch (e) { } return r; };
})();
