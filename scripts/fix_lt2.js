const fs = require('fs');
let html = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');

// Find 力泰汐止 dynamically
const marker = '力泰建設企業（汐止廠）';
const start = html.indexOf(marker);
const afterName = start + marker.length;
const objStart = html.indexOf('{', afterName);
let depth = 1, end = objStart;
while (depth > 0) { end++; if (html[end] === '{') depth++; else if (html[end] === '}') depth--; }
const oldText = html.substring(start, end + 1);
console.log('Found oldText length:', oldText.length);

const newText = "{ name:'力泰建設企業（汐止廠）', addr:'汐止區樟樹二路43號', lat:25.0621481, lng:121.6396738, group:'4star',\n        detail:'力泰建設汐止廠',\n        relations:{me:'力泰建設企業', members:[\n          {name:'吳良材', role:'董事長兼總經理', companies:['力泰建設企業']},\n          {name:'吳劉冠伶', role:'董事', companies:['力泰建設企業','富源投資']},\n          {name:'李義雄', role:'董事', companies:['力泰建設企業','上甘利投資']},\n          {name:'朱風鳴', role:'獨立董事', companies:['力泰建設企業']},\n          {name:'高富銓', role:'獨立董事', companies:['力泰建設企業']}\n        ]} }";

html = html.replace(oldText, newText);
fs.writeFileSync('output/全台預拌混凝土廠地圖.html', html, 'utf8');
console.log('Done');

const v = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');
console.log('relations:{me: count:', (v.match(/relations:{me:/g) || []).length);
