const fs = require('fs');
let html = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');

// Helper: find and replace by substring
function replaceBetween(marker, prefixLen, newText) {
  const start = html.indexOf(marker);
  if (start < 0) { console.log('ERROR: ' + marker + ' not found'); process.exit(1); }
  const afterMarker = start + marker.length;
  const objStart = html.indexOf('{', afterMarker);
  let depth = 1, end = objStart;
  while (depth > 0) { end++; if (html[end] === '{') depth++; else if (html[end] === '}') depth--; }
  const oldText = html.substring(start, end + 1);
  html = html.replace(oldText, newText);
  return true;
}

// 1. 松達建材
const newSong = "{ name:'松達建材', addr:'汐止區南陽街120巷35號1樓', lat:25.0598359, lng:121.6230571, group:'2star',\n        detail:'資本額7,000萬｜白珮妤｜1988年｜預拌混凝土製造',\n        relations:{me:'松達建材', members:[\n          {name:'白珮妤', role:'董事長', companies:['松達建材','世永']},\n          {name:'白添順', role:'監察人', companies:['松達建材']},\n          {name:'黃建榮', role:'董事', companies:['松達建材']},\n          {name:'黃淑玲', role:'董事', companies:['松達建材']},\n          {name:'郭宏正', role:'董事', companies:['松達建材']}\n        ]} }";
replaceBetween("松達建材', addr:'汐止區南陽街120巷35號1樓", 0, newSong);
console.log('1. 松達: OK');

// 2. 力泰士林
const newLt1 = "{ name:'力泰建設企業（士林廠）', addr:'士林區延平北路七段7號', lat:25.1007798, lng:121.4902192, group:'4star',\n        detail:'上柜5520｜資本額7.38億｜負責人吳良材｜北部最大獨立業者',\n        relations:{me:'力泰建設企業', members:[\n          {name:'吳良材', role:'董事長兼總經理', companies:['力泰建設企業']},\n          {name:'吳劉冠伶', role:'董事', companies:['力泰建設企業','富源投資']},\n          {name:'李義雄', role:'董事', companies:['力泰建設企業','上甘利投資']},\n          {name:'朱風鳴', role:'獨立董事', companies:['力泰建設企業']},\n          {name:'高富銓', role:'獨立董事', companies:['力泰建設企業']}\n        ]} }";
replaceBetween("力泰建設企業（士林廠）', addr:'士林區延平北路七段7號", 0, newLt1);
console.log('2. 力泰士林: OK');

// 3. 力泰汐止
const newLt2 = "{ name:'力泰建設企業（汐止廠）', addr:'汐止區樟树二路43號', lat:25.0621481, lng:121.6396738, group:'4star',\n        detail:'力泰建設汐止廠',\n        relations:{me:'力泰建設企業', members:[\n          {name:'吳良材', role:'董事長兼總經理', companies:['力泰建設企業']},\n          {name:'吳劉冠伶', role:'董事', companies:['力泰建設企業','富源投資']},\n          {name:'李義雄', role:'董事', companies:['力泰建設企業','上甘利投資']},\n          {name:'朱風鳴', role:'獨立董事', companies:['力泰建設企業']},\n          {name:'高富銓', role:'獨立董事', companies:['力泰建設企業']}\n        ]} }";
replaceBetween("力泰建設企業（汐止廠）', addr:'汐止區樟树二路43號", 0, newLt2);
console.log('3. 力泰汐止: OK');

fs.writeFileSync('output/全台預拌混凝土廠地圖.html', html, 'utf8');

const v = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');
console.log('relations:{me: count:', (v.match(/relations:{me:/g) || []).length);
console.log('Old-style relations:{ members: count:', (v.match(/relations:{ members:/g) || []).length);
