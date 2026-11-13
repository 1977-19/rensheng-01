/* Name generators per culture. Each entry "中文|English" */
(function () {
  'use strict';
  function sp(s) { return s.split(','); }
  var N = G.NAMES = {
    cn: { east: true,
      s: sp('王|Wang,李|Li,张|Zhang,刘|Liu,陈|Chen,杨|Yang,黄|Huang,赵|Zhao,吴|Wu,周|Zhou,徐|Xu,孙|Sun,马|Ma,朱|Zhu,胡|Hu,郭|Guo,何|He,林|Lin,罗|Luo,高|Gao,郑|Zheng,梁|Liang,谢|Xie,宋|Song,唐|Tang,许|Xu,韩|Han,冯|Feng,邓|Deng,曹|Cao,彭|Peng,曾|Zeng,肖|Xiao,田|Tian,董|Dong,潘|Pan,袁|Yuan,蒋|Jiang,蔡|Cai,余|Yu,杜|Du,叶|Ye,程|Cheng,苏|Su,魏|Wei,吕|Lyu,丁|Ding,沈|Shen,姜|Jiang,范|Fan,陆|Lu,白|Bai,秦|Qin,欧阳|Ouyang,上官|Shangguan,司马|Sima'),
      m: sp('伟|Wei,强|Qiang,磊|Lei,军|Jun,勇|Yong,杰|Jie,涛|Tao,明|Ming,超|Chao,浩|Hao,鹏|Peng,宇|Yu,晨|Chen,博|Bo,文|Wen,轩|Xuan,子|Zi,睿|Rui,泽|Ze,俊|Jun,豪|Hao,天|Tian,一|Yi,嘉|Jia,志|Zhi,建|Jian,华|Hua,斌|Bin,辉|Hui,毅|Yi,航|Hang,鑫|Xin,宁|Ning,哲|Zhe,晓|Xiao,昊|Hao,然|Ran,铭|Ming,凯|Kai,逸|Yi,霖|Lin,煜|Yu,骏|Jun,远|Yuan,川|Chuan,峰|Feng,琛|Chen,彬|Bin'),
      f: sp('芳|Fang,娜|Na,敏|Min,静|Jing,丽|Li,婷|Ting,雪|Xue,欣|Xin,怡|Yi,萱|Xuan,涵|Han,雨|Yu,梓|Zi,诗|Shi,琪|Qi,佳|Jia,悦|Yue,晴|Qing,妍|Yan,璐|Lu,娟|Juan,霞|Xia,兰|Lan,玲|Ling,慧|Hui,颖|Ying,瑶|Yao,思|Si,梦|Meng,可|Ke,欢|Huan,妮|Ni,月|Yue,桐|Tong,若|Ruo,楠|Nan,菲|Fei,薇|Wei,蕾|Lei,彤|Tong,露|Lu,琳|Lin,倩|Qian,洁|Jie,馨|Xin'),
      old_m: sp('建国|Jianguo,卫东|Weidong,国强|Guoqiang,志刚|Zhigang,建华|Jianhua,红兵|Hongbing,德福|Defu,长江|Changjiang,永红|Yonghong,援朝|Yuanchao,解放|Jiefang,富贵|Fugui,大海|Dahai,铁柱|Tiezhu'),
      old_f: sp('秀英|Xiuying,桂兰|Guilan,淑珍|Shuzhen,玉兰|Yulan,凤英|Fengying,秀兰|Xiulan,翠花|Cuihua,红梅|Hongmei,丽华|Lihua,桂芳|Guifang,美华|Meihua,春花|Chunhua,建英|Jianying')
    },
    jp: { east: true,
      s: sp('佐藤|Sato,铃木|Suzuki,高桥|Takahashi,田中|Tanaka,伊藤|Ito,渡边|Watanabe,山本|Yamamoto,中村|Nakamura,小林|Kobayashi,加藤|Kato,吉田|Yoshida,山田|Yamada,佐佐木|Sasaki,山口|Yamaguchi,松本|Matsumoto,井上|Inoue,木村|Kimura,林|Hayashi,清水|Shimizu,斋藤|Saito,森|Mori,池田|Ikeda,桥本|Hashimoto,石川|Ishikawa'),
      m: sp('翔太|Shota,大辉|Daiki,拓海|Takumi,莲|Ren,悠真|Yuma,健太|Kenta,浩二|Koji,隆|Takashi,和也|Kazuya,直树|Naoki,阳斗|Haruto,苍|Sou,诚|Makoto,亮|Ryo,健一|Kenichi,大和|Yamato,优斗|Yuto,圭|Kei,修|Osamu,龙之介|Ryunosuke'),
      f: sp('阳菜|Hina,结衣|Yui,美咲|Misaki,樱|Sakura,葵|Aoi,优子|Yuko,惠美|Emi,由美|Yumi,直美|Naomi,明日香|Asuka,七海|Nanami,凛|Rin,爱|Ai,真由美|Mayumi,千寻|Chihiro,彩|Aya,里奈|Rina,纱希|Saki,茜|Akane,遥|Haruka')
    },
    kr: { east: true, sep: ' ',
      s: sp('金|Kim,李|Lee,朴|Park,崔|Choi,郑|Jung,姜|Kang,赵|Cho,尹|Yoon,张|Jang,林|Lim,韩|Han,吴|Oh,申|Shin,徐|Seo,权|Kwon,黄|Hwang,安|Ahn,宋|Song,柳|Yoo,洪|Hong'),
      m: sp('民俊|Min-jun,书俊|Seo-jun,宰贤|Jae-hyun,志勋|Ji-hoon,贤宇|Hyun-woo,东贤|Dong-hyun,成民|Sung-min,俊浩|Jun-ho,泰贤|Tae-hyun,承宇|Seung-woo,在民|Jae-min,宇镇|Woo-jin,俊英|Joon-young,炳宪|Byung-hun,相旭|Sang-wook'),
      f: sp('智媛|Ji-won,秀彬|Su-bin,敏智|Min-ji,叙妍|Seo-yeon,惠珍|Hye-jin,允儿|Yoon-ah,智恩|Ji-eun,多贤|Da-hyun,恩惠|Eun-hye,夏恩|Ha-eun,秀智|Su-ji,娜妍|Na-yeon,彩英|Chae-young,素拉|So-ra,宝英|Bo-young')
    },
    sg: { east: true, sep: ' ',
      s: sp('陈|Tan,林|Lim,李|Lee,黄|Ng,王|Ong,张|Teo,刘|Lau,吴|Goh,郑|Tay,蔡|Chua,许|Koh,何|Ho,杨|Yeo,梁|Leong'),
      m: sp('伟明|Wei Ming,俊杰|Jun Jie,志强|Zhi Qiang,家豪|Jia Hao,建华|Kian Hwa,文杰|Wen Jie,国荣|Kok Weng,嘉俊|Jia Jun,振宇|Zhen Yu,子豪|Zi Hao'),
      f: sp('慧玲|Hui Ling,美玲|Mei Ling,丽华|Li Hua,雪儿|Xue Er,佩琪|Pei Qi,欣怡|Xin Yi,诗婷|Shi Ting,佳慧|Jia Hui,淑芬|Shu Fen,婉婷|Wan Ting'),
      full_m: sp('穆罕默德·哈菲兹|Muhammad Hafiz,阿卜杜拉·拉赫曼|Abdul Rahman,拉杰什·库马尔|Rajesh Kumar,维杰·奈尔|Vijay Nair'),
      full_f: sp('西蒂·艾莎|Siti Aisyah,努尔·阿伊尼|Nur Aini,普丽娅·拉曼|Priya Raman,卡维塔·皮莱|Kavita Pillay')
    },
    us: {
      m: sp('詹姆斯|James,约翰|John,迈克尔|Michael,大卫|David,威廉|William,罗伯特|Robert,丹尼尔|Daniel,马修|Matthew,伊森|Ethan,诺亚|Noah,利亚姆|Liam,泰勒|Tyler,布兰登|Brandon,凯文|Kevin,杰森|Jason,瑞恩|Ryan,克里斯|Chris,安德鲁|Andrew,约书亚|Joshua,雅各布|Jacob,本杰明|Benjamin,卢卡斯|Lucas,亚历克斯|Alex,内森|Nathan'),
      f: sp('玛丽|Mary,珍妮弗|Jennifer,艾米丽|Emily,莎拉|Sarah,杰西卡|Jessica,艾希莉|Ashley,艾玛|Emma,奥利维亚|Olivia,索菲亚|Sophia,艾娃|Ava,麦迪逊|Madison,汉娜|Hannah,格蕾丝|Grace,克洛伊|Chloe,莉莉|Lily,梅根|Megan,瑞秋|Rachel,阿曼达|Amanda,妮可|Nicole,劳伦|Lauren,伊莎贝拉|Isabella,米娅|Mia,佐伊|Zoe,哈珀|Harper'),
      s: sp('史密斯|Smith,约翰逊|Johnson,威廉姆斯|Williams,布朗|Brown,琼斯|Jones,加西亚|Garcia,米勒|Miller,戴维斯|Davis,罗德里格斯|Rodriguez,马丁内斯|Martinez,威尔逊|Wilson,安德森|Anderson,泰勒|Taylor,托马斯|Thomas,摩尔|Moore,杰克逊|Jackson,怀特|White,哈里斯|Harris,克拉克|Clark,刘易斯|Lewis,沃克|Walker,杨|Young,艾伦|Allen,金|King,赖特|Wright,斯科特|Scott,格林|Green,贝克|Baker,亚当斯|Adams,尼尔森|Nelson,陈|Chen,阮|Nguyen,帕特尔|Patel,金|Kim')
    },
    gb: {
      m: sp('奥利弗|Oliver,乔治|George,哈利|Harry,杰克|Jack,查理|Charlie,托马斯|Thomas,亚瑟|Arthur,亨利|Henry,爱德华|Edward,阿尔菲|Alfie,奥斯卡|Oscar,利奥|Leo,詹姆斯|James,威廉|William,阿奇|Archie,西奥|Theo'),
      f: sp('阿米莉亚|Amelia,艾拉|Isla,艾米丽|Emily,夏洛特|Charlotte,波比|Poppy,爱丽丝|Alice,弗洛伦斯|Florence,索菲|Sophie,露西|Lucy,埃莉诺|Eleanor,弗蕾亚|Freya,伊莫金|Imogen,杰西卡|Jessica,汉娜|Hannah,艾薇|Ivy,萝茜|Rosie'),
      s: sp('史密斯|Smith,琼斯|Jones,泰勒|Taylor,布朗|Brown,威廉姆斯|Williams,威尔逊|Wilson,埃文斯|Evans,托马斯|Thomas,罗伯茨|Roberts,沃克|Walker,赖特|Wright,罗宾逊|Robinson,休斯|Hughes,爱德华兹|Edwards,格林|Green,霍尔|Hall,伍德|Wood,克拉克|Clarke,哈里森|Harrison,库珀|Cooper,辛格|Singh,汗|Khan,麦克唐纳|MacDonald,奥布莱恩|O\'Brien')
    },
    fr: {
      m: sp('路易|Louis,加布里埃尔|Gabriel,朱尔|Jules,雨果|Hugo,卢卡斯|Lucas,亚瑟|Arthur,泰奥|Théo,皮埃尔|Pierre,安托万|Antoine,尼古拉|Nicolas,朱利安|Julien,马蒂厄|Mathieu,让|Jean,保罗|Paul'),
      f: sp('艾玛|Emma,路易丝|Louise,雅德|Jade,爱丽丝|Alice,克洛艾|Chloé,莱娅|Léa,玛农|Manon,卡米耶|Camille,朱丽叶|Juliette,伊内丝|Inès,索菲|Sophie,阿梅莉|Amélie,克莱尔|Claire,玛丽|Marie'),
      s: sp('马丁|Martin,贝尔纳|Bernard,杜波依斯|Dubois,托马|Thomas,罗贝尔|Robert,里夏尔|Richard,珀蒂|Petit,杜兰|Durand,勒鲁瓦|Leroy,莫罗|Moreau,西蒙|Simon,洛朗|Laurent,勒菲弗|Lefebvre,米歇尔|Michel,加尼耶|Garnier,卢梭|Rousseau,本阿里|Benali,迪亚洛|Diallo')
    },
    de: {
      m: sp('卢卡斯|Lukas,莱昂|Leon,费利克斯|Felix,保罗|Paul,约纳斯|Jonas,马克西米利安|Maximilian,埃利亚斯|Elias,芬恩|Finn,斯特凡|Stefan,托马斯|Thomas,克劳斯|Klaus,于尔根|Jürgen,马蒂亚斯|Matthias,蒂姆|Tim'),
      f: sp('米娅|Mia,汉娜|Hannah,艾玛|Emma,索菲娅|Sophia,莱娜|Lena,莱亚|Lea,安娜|Anna,劳拉|Laura,卡塔琳娜|Katharina,尤莉娅|Julia,扎比娜|Sabine,乌尔苏拉|Ursula,克拉拉|Clara,莉娜|Lina'),
      s: sp('穆勒|Müller,施密特|Schmidt,施奈德|Schneider,菲舍尔|Fischer,韦伯|Weber,迈尔|Meyer,瓦格纳|Wagner,贝克尔|Becker,舒尔茨|Schulz,霍夫曼|Hoffmann,科赫|Koch,里希特|Richter,克莱因|Klein,沃尔夫|Wolf,诺伊曼|Neumann,耶尔马兹|Yılmaz')
    },
    ru: { ruF: true,
      m: sp('亚历山大|Alexander,德米特里|Dmitry,马克西姆|Maxim,伊万|Ivan,谢尔盖|Sergei,米哈伊尔|Mikhail,安德烈|Andrei,尼古拉|Nikolai,阿列克谢|Alexei,弗拉基米尔|Vladimir,阿尔乔姆|Artyom,帕维尔|Pavel'),
      f: sp('阿纳斯塔西娅|Anastasia,玛丽亚|Maria,安娜|Anna,叶卡捷琳娜|Ekaterina,奥尔加|Olga,娜塔莉亚|Natalia,塔季扬娜|Tatiana,伊琳娜|Irina,斯韦特兰娜|Svetlana,达莉娅|Daria,索菲娅|Sofia,波琳娜|Polina'),
      s: sp('伊万诺夫|Ivanov,斯米尔诺夫|Smirnov,库兹涅佐夫|Kuznetsov,波波夫|Popov,沃尔科夫|Volkov,索科洛夫|Sokolov,彼得罗夫|Petrov,莫罗佐夫|Morozov,巴甫洛夫|Pavlov,科兹洛夫|Kozlov,列别捷夫|Lebedev,诺维科夫|Novikov')
    },
    in: {
      m: sp('阿拉夫|Aarav,阿琼|Arjun,拉胡尔|Rahul,罗汉|Rohan,维克拉姆|Vikram,阿米特|Amit,拉吉|Raj,桑杰|Sanjay,阿迪蒂亚|Aditya,卡比尔|Kabir,拉维|Ravi,阿尼尔|Anil,维哈安|Vihaan,伊尚|Ishaan'),
      f: sp('普丽娅|Priya,阿南雅|Ananya,迪娅|Diya,艾莎|Aisha,内哈|Neha,普贾|Pooja,卡维娅|Kavya,斯内哈|Sneha,莉娅|Riya,拉克希米|Lakshmi,米拉|Meera,伊莎|Isha,萨丽卡|Sarika,迪皮卡|Deepika'),
      s: sp('夏尔马|Sharma,帕特尔|Patel,辛格|Singh,库马尔|Kumar,古普塔|Gupta,雷迪|Reddy,艾耶尔|Iyer,奈尔|Nair,达斯|Das,梅塔|Mehta,乔希|Joshi,汗|Khan,乔普拉|Chopra,维尔马|Verma,班纳吉|Banerjee')
    },
    br: {
      m: sp('米格尔|Miguel,阿瑟|Arthur,加布里埃尔|Gabriel,佩德罗|Pedro,卢卡斯|Lucas,马修斯|Matheus,拉斐尔|Rafael,若昂|João,古斯塔沃|Gustavo,费利佩|Felipe,布鲁诺|Bruno,蒂亚戈|Thiago'),
      f: sp('玛丽亚|Maria,安娜|Ana,茱莉亚|Júlia,贝阿特丽丝|Beatriz,拉丽莎|Larissa,卡米拉|Camila,费尔南达|Fernanda,加布里埃拉|Gabriela,莱蒂西娅|Letícia,马里亚纳|Mariana,卢阿娜|Luana,伊莎贝拉|Isabela'),
      s: sp('席尔瓦|Silva,桑托斯|Santos,奥利维拉|Oliveira,索萨|Souza,罗德里格斯|Rodrigues,费雷拉|Ferreira,阿尔维斯|Alves,佩雷拉|Pereira,利马|Lima,戈麦斯|Gomes,科斯塔|Costa,里贝罗|Ribeiro,阿尔梅达|Almeida,卡瓦略|Carvalho')
    },
    it: {
      m: sp('莱昂纳多|Leonardo,弗朗切斯科|Francesco,亚历山德罗|Alessandro,洛伦佐|Lorenzo,马泰奥|Matteo,马可|Marco,朱塞佩|Giuseppe,卢卡|Luca,安德烈亚|Andrea,乔瓦尼|Giovanni,安东尼奥|Antonio,达维德|Davide'),
      f: sp('索菲亚|Sofia,朱莉娅|Giulia,奥罗拉|Aurora,爱丽丝|Alice,吉内芙拉|Ginevra,基娅拉|Chiara,弗朗切斯卡|Francesca,瓦伦蒂娜|Valentina,马丁娜|Martina,埃莱娜|Elena,比安卡|Bianca,乔治娅|Giorgia'),
      s: sp('罗西|Rossi,鲁索|Russo,法拉利|Ferrari,埃斯波西托|Esposito,比安奇|Bianchi,罗马诺|Romano,科隆博|Colombo,里奇|Ricci,马里诺|Marino,格雷科|Greco,布鲁诺|Bruno,加洛|Gallo,孔蒂|Conti,德卢卡|De Luca')
    },
    es: {
      m: sp('乌戈|Hugo,马丁|Martín,卢卡斯|Lucas,马特奥|Mateo,巴勃罗|Pablo,亚历杭德罗|Alejandro,丹尼尔|Daniel,哈维尔|Javier,卡洛斯|Carlos,迭戈|Diego,塞尔吉奥|Sergio,阿尔瓦罗|Álvaro'),
      f: sp('卢西亚|Lucía,索菲亚|Sofía,马丁娜|Martina,玛丽亚|María,保拉|Paula,胡利娅|Julia,卡门|Carmen,埃莱娜|Elena,劳拉|Laura,玛尔塔|Marta,萨拉|Sara,瓦莱里娅|Valeria'),
      s: sp('加西亚|García,费尔南德斯|Fernández,冈萨雷斯|González,罗德里格斯|Rodríguez,洛佩斯|López,马丁内斯|Martínez,桑切斯|Sánchez,佩雷斯|Pérez,戈麦斯|Gómez,马丁|Martín,希门尼斯|Jiménez,鲁伊斯|Ruiz,埃尔南德斯|Hernández,迪亚斯|Díaz')
    },
    mx: {
      m: sp('何塞|José,胡安|Juan,路易斯|Luis,米格尔|Miguel,赫苏斯|Jesús,圣地亚哥|Santiago,马特奥|Mateo,迭戈|Diego,卡洛斯|Carlos,亚历杭德罗|Alejandro,埃米利亚诺|Emiliano,费尔南多|Fernando'),
      f: sp('瓜达卢佩|Guadalupe,费尔南达|Fernanda,希梅娜|Ximena,瓦伦蒂娜|Valentina,伊采尔|Itzel,玛丽亚|María,索菲亚|Sofía,卡米拉|Camila,丹妮拉|Daniela,雷娜塔|Renata,露西亚|Lucía,安德烈娅|Andrea'),
      s: sp('埃尔南德斯|Hernández,加西亚|García,马丁内斯|Martínez,洛佩斯|López,冈萨雷斯|González,罗德里格斯|Rodríguez,佩雷斯|Pérez,桑切斯|Sánchez,拉米雷斯|Ramírez,弗洛雷斯|Flores,托雷斯|Torres,克鲁斯|Cruz,莫拉莱斯|Morales,雷耶斯|Reyes')
    },
    th: {
      m: sp('颂猜|Somchai,阿南|Anan,吉|Krit,尼兰|Niran,巴色|Prasert,塔纳功|Thanakorn,威猜|Wichai,阿提|Arthit,猜瓦|Chaiwat,纳塔蓬|Nattapong,披耶|Phaya,坤|Khun'),
      f: sp('诗丽蓬|Siriporn,玛丽|Malee,甘雅|Kanya,侬|Nong,萍|Pim,帕洛伊|Ploy,素达|Suda,玛莉|Mali,拉塔娜|Ratana,婉妮达|Wanida,娜塔|Natta,琵琶|Pipa'),
      s: sp('赛当|Saetang,西苏|Srisuk,猜雅蓬|Chaiyaporn,翁萨瓦|Wongsawat,拉塔纳功|Rattanakorn,素萨瓦|Suksawat,本米|Boonmee,通猜|Thongchai,乔玛尼|Kaewmanee,宅迪|Jaidee')
    },
    za: {
      m: sp('塔博|Thabo,西波|Sipho,约翰|Johan,彼得|Pieter,卢瓦齐|Lwazi,邦加尼|Bongani,迈克尔|Michael,大卫|David,腾巴|Themba,卡吉索|Kagiso,曼德拉|Mandla,里安|Riaan'),
      f: sp('莱拉托|Lerato,纳莱迪|Naledi,坦迪韦|Thandiwe,扎内勒|Zanele,安内莉|Annelie,莎拉|Sarah,诺姆萨|Nomsa,普蕾希丝|Precious,阿延达|Ayanda,雷菲尔韦|Refilwe,卡拉|Carla,米歇尔|Michelle'),
      s: sp('恩科西|Nkosi,德拉米尼|Dlamini,恩德洛武|Ndlovu,库马洛|Khumalo,博塔|Botha,范德默维|van der Merwe,奈杜|Naidoo,莫科纳|Mokoena,马兰古|Mahlangu,史密斯|Smith,比勒陀利乌斯|Pretorius,祖鲁|Zulu')
    }
  };

  function zh(s) { return s.split('|')[0]; }
  function en(s) { var i = s.indexOf('|'); return i < 0 ? s : s.slice(i + 1); }
  /* compose a full name. sur, giv are "zh|en" */
  G.mkName = function (cul, sur, giv, g) {
    var c = N[cul] || N.us;
    if (c.ruF && g === 'f' && sur) { sur = zh(sur).replace(/夫$/, '娃') + '|' + en(sur) + 'a'; }
    if (!sur) return giv;
    // a given name must never carry a surname inside it (no "William Ye Ye")
    var gz = zh(giv), ge = en(giv), sz = zh(sur), se = en(sur);
    if (gz.indexOf('·') >= 0) gz = gz.split('·')[0];
    if (gz.length > sz.length && gz.indexOf(sz) === 0) gz = gz.slice(sz.length);
    if (gz.length > sz.length && gz.slice(-sz.length) === sz) gz = gz.slice(0, -sz.length);
    ge = ge.replace(new RegExp('^' + se.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ' '), '').replace(new RegExp(' ' + se.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'), '');
    if (c.east) return sz + gz + '|' + se + ' ' + ge;
    return gz + '·' + sz + '|' + ge + ' ' + se;
  };
  G.genSur = function (cul) { return G.pick((N[cul] || N.us).s); };
  G.genGiven = function (cul, g, by) {
    var c = N[cul] || N.us;
    if (cul === 'cn') {
      if (by && by < 1975 && G.ch(.6)) return G.pick(g === 'f' ? c.old_f : c.old_m);
      var a = G.pick(g === 'f' ? c.f : c.m);
      if (G.ch(.75)) { var b = G.pick(g === 'f' ? c.f : c.m); if (b !== a) return zh(a) + zh(b) + '|' + en(a) + en(b).toLowerCase(); }
      return a;
    }
    return G.pick(g === 'f' ? c.f : c.m);
  };
  /* naming suggestions in families of names: one shared generation character, different second characters */
  G.nameSeries = function (cul, sur, g, by, sibs) {
    var out = [], c = N[cul] || N.us;
    if (cul === 'cn') {
      var pool = g === 'f' ? c.f : c.m, gens = [];
      // if the older siblings already share a generation character, offer that series first
      (sibs || []).forEach(function (n) { var z = String(n.giv || '').split('|')[0]; if (z.length === 2) { var ch = z[0]; c.m.concat(c.f).forEach(function (x) { if (zh(x) === ch && gens.indexOf(x) < 0) gens.unshift(x); }); } });
      while (gens.length < 3) { var a = G.pick(c.m.concat(c.f)); if (gens.indexOf(a) < 0) gens.push(a); }
      gens.slice(0, 3).forEach(function (a) {
        var used = {};
        for (var i = 0, k = 0; k < 4 && i < 40; i++) { var b = G.pick(pool); if (b === a || used[b]) continue; used[b] = 1; k++; out.push(G.mkName(cul, sur, zh(a) + zh(b) + '|' + en(a) + en(b).toLowerCase(), g)); }
      });
      return out;
    }
    var seen = {};
    for (var j = 0; j < 30 && out.length < 9; j++) { var x = G.genGiven(cul, g, by); if (seen[x]) continue; seen[x] = 1; out.push(G.mkName(cul, sur, x, g)); }
    return out;
  };
  /* returns {name, sur, giv} */
  G.genName = function (cul, g, by, sur) {
    var c = N[cul] || N.us;
    if (cul === 'sg' && !sur && G.ch(.2)) { var fn = G.pick(g === 'f' ? c.full_f : c.full_m); return { name: fn, sur: '', giv: fn }; }
    sur = sur || G.genSur(cul);
    var giv = G.genGiven(cul, g, by);
    return { name: G.mkName(cul, sur, giv, g), sur: sur, giv: giv };
  };
})();
