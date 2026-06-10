const fs = require('fs');
let html = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');

// Fix 松達 by substring replacement
const marker = "松達建材', addr:'汐止區南陽街120巷35號1樓";
const start = html.indexOf(marker);
const objStart = html.indexOf('{', start);
let depth = 1, end = objStart;
while (depth > 0) { end++; if (html[end] === '{') depth++; else if (html[end] === '}') depth--; }
const oldText = html.substring(start, end + 1);

const newText = "{ name:'松達建材', addr:'汐止區南陽街120巷35號1樓', lat:25.0598359, lng:121.6230571, group:'2star',\n        detail:'資本額7,000萬｜白珮妤｜1988年｜預拌混凝土製造',\n        relations:{me:'松達建材', members:[\n          {name:'白珮妤', role:'董事長', companies:['松達建材','世永']},\n          {name:'白添順', role:'監察人', companies:['松達建材']},\n          {name:'黃建榮', role:'董事', companies:['松達建材']},\n          {name:'黃淑玲', role:'董事', companies:['松達建材']},\n          {name:'郭宏正', role:'董事', companies:['松達建材']}\n        ]} }";

html = html.replace(oldText, newText);
fs.writeFileSync('output/全台預拌混凝土廠地圖.html', html, 'utf8');
console.log('Done');

const v = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');
console.log('relations:{me: count:', (v.match(/relations:{me:/g) || []).length);
console.log('Old-style count:', (v.match(/relations:{ members:/g) || []).length);
