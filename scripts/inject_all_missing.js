const fs = require('fs');
const h = fs.readFileSync('D:\\James-opencode\\marketmeet2026\\output\\全台預拌混凝土廠地圖.html', 'utf8');

const graphData = {
  // === 新竹苗栗 (7 markers, 6 companies) ===
  "永協企業": 'relations:{me:\'永協企業\', members:[{name:\'謝焸麒\',role:\'董事長\',companies:[\'永協企業\',\'友立科技\']},{name:\'羅立澂\',role:\'董事\',companies:[\'永協企業\']},{name:\'謝素玉\',role:\'董事\',companies:[\'永協企業\']},{name:\'羅明志\',role:\'監察人\',companies:[\'永協企業\',\'羅明志建築師事務所\']}]}',
  "毅和實業（寶山廠）": 'relations:{me:\'毅和實業\', members:[{name:\'黃珉伶\',role:\'董事長\',companies:[\'毅和實業\']},{name:\'林慶波\',role:\'監察人\',companies:[\'毅和實業\']}]}',
  "毅和實業（竹南港墘廠）": 'relations:{me:\'毅和實業\', members:[{name:\'黃珉伶\',role:\'董事長\',companies:[\'毅和實業\']},{name:\'林慶波\',role:\'監察人\',companies:[\'毅和實業\']}]}',
  "錦鋒混凝土": 'relations:{me:\'錦鋒混凝土\', members:[{name:\'林登倫\',role:\'董事長\',companies:[\'錦鋒混凝土\',\'中來工業\']},{name:\'邱弘鎮\',role:\'董事\',companies:[\'錦鋒混凝土\']},{name:\'陳國華\',role:\'董事\',companies:[\'錦鋒混凝土\']},{name:\'黃清江\',role:\'董事\',companies:[\'錦鋒混凝土\']},{name:\'江慶賜\',role:\'監察人\',companies:[\'錦鋒混凝土\']}]}',
  "協鑫混凝土": 'relations:{me:\'協鑫混凝土\', members:[{name:\'賴柊源\',role:\'董事長\',companies:[\'協鑫混凝土\']},{name:\'侯百能\',role:\'董事\',companies:[\'協鑫混凝土\']},{name:\'蔡清榮\',role:\'監察人\',companies:[\'協鑫混凝土\']}]}',
  "福宏實業": 'relations:{me:\'福宏實業\', members:[{name:\'張煥林\',role:\'董事長\',companies:[\'福宏實業\',\'竹進企業\']},{name:\'賴瑞星\',role:\'董事\',companies:[\'福宏實業\']},{name:\'張森鴻\',role:\'董事\',companies:[\'福宏實業\']},{name:\'張國鴻\',role:\'董事\',companies:[\'福宏實業\']},{name:\'張煥昇\',role:\'董事\',companies:[\'福宏實業\']},{name:\'賴耀星\',role:\'監察人\',companies:[\'福宏實業\']}]}',
  "頭份混凝土有限公司": 'relations:{me:\'頭份混凝土有限公司\', members:[{name:\'張順雄\',role:\'董事\',companies:[\'頭份混凝土有限公司\']}]}',
  // === 台中·彰化 (15 companies) ===
  "廣達混凝土股份有限公司": 'relations:{me:\'廣達混凝土\', members:[{name:\'羅國源\',role:\'董事長\',companies:[\'廣達混凝土\',\'中來工業\']},{name:\'羅正嘉\',role:\'董事\',companies:[\'廣達混凝土\']},{name:\'謝崇文\',role:\'董事\',companies:[\'廣達混凝土\']},{name:\'劉芳柳\',role:\'董事\',companies:[\'廣達混凝土\']},{name:\'陳重達\',role:\'董事\',companies:[\'廣達混凝土\']},{name:\'潘文昇\',role:\'監察人\',companies:[\'廣達混凝土\']}]}',
  "中來工業股份有限公司": 'relations:{me:\'中來工業\', members:[{name:\'林登倫\',role:\'董事長\',companies:[\'中來工業\',\'錦鋒混凝土\']},{name:\'王天惠\',role:\'董事\',companies:[\'中來工業\']},{name:\'張木鳳\',role:\'董事\',companies:[\'中來工業\']},{name:\'羅國源\',role:\'董事\',companies:[\'中來工業\',\'廣達混凝土\']},{name:\'童國龍\',role:\'董事\',companies:[\'中來工業\']},{name:\'魏渾成\',role:\'監察人\',companies:[\'中來工業\']}]}',
  "長生預拌混凝土（烏日廠）": 'relations:{me:\'長生預拌混凝土\', members:[{name:\'鍾雲城\',role:\'董事長\',companies:[\'長生預拌混凝土\',\'佳生砂石企業\']},{name:\'歐賢誠\',role:\'董事\',companies:[\'長生預拌混凝土\']},{name:\'鍾書胤\',role:\'董事\',companies:[\'長生預拌混凝土\',\'佳生砂石企業\']},{name:\'歐秋月\',role:\'監察人\',companies:[\'長生預拌混凝土\',\'佳生砂石企業\']}]}',
  "福鹿預拌混凝土": 'relations:{me:\'福鹿預拌混凝土\', members:[{name:\'黃周秀鶴\',role:\'董事長\',companies:[\'福鹿預拌混凝土\']},{name:\'施振生\',role:\'董事\',companies:[\'福鹿預拌混凝土\']},{name:\'施淵源\',role:\'董事\',companies:[\'福鹿預拌混凝土\']},{name:\'施怡安\',role:\'董事\',companies:[\'福鹿預拌混凝土\']},{name:\'施宏璋\',role:\'監察人\',companies:[\'福鹿預拌混凝土\']}]}',
  "久連預拌混凝土": 'relations:{me:\'久連預拌混凝土\', members:[{name:\'梁國斌\',role:\'董事\',companies:[\'久連預拌混凝土\']},{name:\'梁妤甄\',role:\'監察人\',companies:[\'久連預拌混凝土\']}]}',
  "裕山混凝土": 'relations:{me:\'裕山混凝土\', members:[{name:\'黃漢主\',role:\'董事\',companies:[\'裕山混凝土\']}]}',
  "全富混凝土工業": 'relations:{me:\'全富混凝土工業\', members:[{name:\'劉弟科\',role:\'董事長\',companies:[\'全富混凝土工業\']},{name:\'房松癸\',role:\'董事\',companies:[\'全富混凝土工業\']},{name:\'賴榮樹\',role:\'董事\',companies:[\'全富混凝土工業\']},{name:\'詹林淑芬\',role:\'監察人\',companies:[\'全富混凝土工業\']}]}',
  "佳生砂石企業": 'relations:{me:\'佳生砂石企業\', members:[{name:\'鍾雲城\',role:\'董事長\',companies:[\'佳生砂石企業\',\'長生預拌混凝土\']},{name:\'林炎鏢\',role:\'董事\',companies:[\'佳生砂石企業\']},{name:\'鍾書胤\',role:\'董事\',companies:[\'佳生砂石企業\',\'長生預拌混凝土\']},{name:\'歐秋月\',role:\'監察人\',companies:[\'佳生砂石企業\',\'長生預拌混凝土\']}]}',
  "伸太田工業": 'relations:{me:\'伸太田工業\', members:[{name:\'王詳欽\',role:\'董事長\',companies:[\'伸太田工業\']},{name:\'王利勝\',role:\'董事\',companies:[\'伸太田工業\']},{name:\'劉妍楣\',role:\'董事\',companies:[\'伸太田工業\']},{name:\'王允豐\',role:\'董事\',companies:[\'伸太田工業\']},{name:\'王玟翔\',role:\'董事\',companies:[\'伸太田工業\']},{name:\'王馮彩琴\',role:\'監察人\',companies:[\'伸太田工業\']}]}',
  "豐崗實業": 'relations:{me:\'豐崗實業\', members:[{name:\'張繼中\',role:\'董事\',companies:[\'豐崗實業\']}]}',
  "甲東洋土": 'relations:{me:\'甲東洋土\', members:[{name:\'李右祥\',role:\'董事長\',companies:[\'甲東洋土\']},{name:\'李村培\',role:\'董事\',companies:[\'甲東洋土\']},{name:\'曾素玲\',role:\'董事\',companies:[\'甲東洋土\']},{name:\'李育如\',role:\'監察人\',companies:[\'甲東洋土\']}]}',
  "民峰實業股份有限公司梧棲預拌混凝土廠": 'relations:{me:\'民峰實業\', members:[{name:\'李林菊梅\',role:\'董事長\',companies:[\'民峰實業\']},{name:\'林張淑芬\',role:\'董事\',companies:[\'民峰實業\']},{name:\'林郁盛\',role:\'董事\',companies:[\'民峰實業\']},{name:\'高鉦欽\',role:\'董事\',companies:[\'民峰實業\']},{name:\'林汩杰\',role:\'董事\',companies:[\'民峰實業\']},{name:\'林武雄\',role:\'監察人\',companies:[\'民峰實業\']}]}',
  "野馬預拌混凝土有限公司": 'relations:{me:\'野馬預拌混凝土\', members:[{name:\'林志銘\',role:\'董事\',companies:[\'野馬預拌混凝土\']}]}',
  "埔塩預拌混凝土股份有限公司埔鹽廠": 'relations:{me:\'埔塩預拌混凝土\', members:[{name:\'陳美娟\',role:\'董事長\',companies:[\'埔塩預拌混凝土\']},{name:\'梁宏任\',role:\'監察人\',companies:[\'埔塩預拌混凝土\']}]}',
  "有駿預拌混凝土股份有限公司": 'relations:{me:\'有駿預拌混凝土\', members:[{name:\'陳宥均\',role:\'董事長\',companies:[\'有駿預拌混凝土\']},{name:\'陳羽涵\',role:\'董事\',companies:[\'有駿預拌混凝土\']},{name:\'廖永隆\',role:\'董事\',companies:[\'有駿預拌混凝土\']},{name:\'廖俊哲\',role:\'監察人\',companies:[\'有駿預拌混凝土\']}]}',
  // === 雲嘉南投 (11 companies, 天源廢止/源順行號留null) ===
  "泉溢開發有限公司（朴子廠）": 'relations:{me:\'泉溢開發\', members:[{name:\'李明華\',role:\'董事長\',companies:[\'泉溢開發\',\'佳毅營造\']},{name:\'陳献章\',role:\'董事\',companies:[\'泉溢開發\']},{name:\'李珮瑜\',role:\'監察人\',companies:[\'泉溢開發\']}]}',
  "承慶企業（山慶瀝青）": 'relations:{me:\'承慶企業\', members:[{name:\'吳文瑞\',role:\'董事\',companies:[\'承慶企業\']}]}',
  "煜昌工業": 'relations:{me:\'煜昌工業\', members:[{name:\'吳泰局\',role:\'董事長\',companies:[\'煜昌工業\']},{name:\'吳陳碧珠\',role:\'監察人\',companies:[\'煜昌工業\']}]}',
  "德欣先進": 'relations:{me:\'德欣先進\', members:[{name:\'賴信義\',role:\'董事長\',companies:[\'德欣先進\',\'德欣投資\']},{name:\'賴建宏\',role:\'董事\',companies:[\'德欣先進\']},{name:\'陳信宏\',role:\'董事\',companies:[\'德欣先進\']},{name:\'賴建志\',role:\'監察人\',companies:[\'德欣先進\']}]}',
  "益昌砂石企業": 'relations:{me:\'益昌砂石企業\', members:[{name:\'王鴻霖\',role:\'董事長\',companies:[\'益昌砂石企業\']},{name:\'王秋滿\',role:\'董事\',companies:[\'益昌砂石企業\']},{name:\'王秋菊\',role:\'監察人\',companies:[\'益昌砂石企業\']}]}',
  "義展實業": 'relations:{me:\'義展實業\', members:[{name:\'沈威潔\',role:\'董事長\',companies:[\'義展實業\']},{name:\'林瑞麟\',role:\'董事\',companies:[\'義展實業\']},{name:\'簡素珍\',role:\'監察人\',companies:[\'義展實業\']}]}',
  "宏益達建材企業": 'relations:{me:\'宏益達建材企業\', members:[{name:\'游順興\',role:\'董事\',companies:[\'宏益達建材企業\']}]}',
  "宏進建材": 'relations:{me:\'宏進建材\', members:[{name:\'黃文賢\',role:\'董事\',companies:[\'宏進建材\']}]}',
  "任建企業": 'relations:{me:\'任建企業\', members:[{name:\'林宗宏\',role:\'董事長\',companies:[\'任建企業\']},{name:\'林李秋微\',role:\'監察人\',companies:[\'任建企業\']}]}',
  "聯成預拌混凝土": 'relations:{me:\'聯成預拌混凝土\', members:[{name:\'林在地\',role:\'董事\',companies:[\'聯成預拌混凝土\']}]}',
  "盛記預拌混凝土有限公司": 'relations:{me:\'盛記預拌混凝土\', members:[{name:\'郭麗玉\',role:\'董事\',companies:[\'盛記預拌混凝土\']}]}',
  // 天源 and 源順 kept as null (廢止/行號)
};

let result = h;
let count = 0;
let notFound = [];

Object.keys(graphData).forEach(name => {
  const relStr = graphData[name];
  const idx = result.indexOf("name:'" + name + "'");
  if (idx < 0) { notFound.push(name); return; }

  const searchEnd = result.indexOf("\n      { name:'", idx + 10);
  const searchEnd2 = result.indexOf("\n    ]", idx + 10);
  const actualEnd = (searchEnd > 0 && searchEnd < searchEnd2 + 5 && searchEnd !== idx) ? searchEnd : searchEnd2;

  const relNullIdx = result.indexOf("relations:null", idx);
  if (relNullIdx < 0 || relNullIdx > actualEnd) {
    notFound.push(name + ' (no relations:null near)');
    return;
  }

  result = result.substring(0, relNullIdx) + relStr + result.substring(relNullIdx + 'relations:null'.length);
  count++;
  console.log('OK: ' + name);
});

if (notFound.length > 0) {
  console.log('\nNOT FOUND:');
  notFound.forEach(n => console.log('  ' + n));
}

fs.writeFileSync('D:\\James-opencode\\marketmeet2026\\output\\全台預拌混凝土廠地圖.html', result, 'utf8');
console.log('\nTotal: ' + count + ' markers updated');
