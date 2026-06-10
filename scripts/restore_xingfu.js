const fs = require('fs');
let html = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');

// Add back 幸孚土城 between 力泰汐止 and 幸孚基隆
const old = "relations:{me:'力泰建設企業', members:[\n          {name:'吳良材', role:'董事長兼總經理', companies:['力泰建設企業']},\n          {name:'吳劉冠伶', role:'董事', companies:['力泰建設企業','富源投資']},\n          {name:'李義雄', role:'董事', companies:['力泰建設企業','上甘利投資']},\n          {name:'朱風鳴', role:'獨立董事', companies:['力泰建設企業']},\n          {name:'高富銓', role:'獨立董事', companies:['力泰建設企業']}\n        ]} },\n      { name:'幸孚預拌混凝土（基隆廠）'";

// Replace with same thing but insert 幸孚土城
if (!html.includes(old)) {
  console.log('Pattern not found!');
  process.exit(1);
}

const idx = html.indexOf(old);
const newBlock = "relations:{me:'力泰建設企業', members:[\n          {name:'吳良材', role:'董事長兼總經理', companies:['力泰建設企業']},\n          {name:'吳劉冠伶', role:'董事', companies:['力泰建設企業','富源投資']},\n          {name:'李義雄', role:'董事', companies:['力泰建設企業','上甘利投資']},\n          {name:'朱風鳴', role:'獨立董事', companies:['力泰建設企業']},\n          {name:'高富銓', role:'獨立董事', companies:['力泰建設企業']}\n        ]} },\n      { name:'幸孚預拌混凝土（土城廠）', addr:'土城區中華路一段162號', lat:24.9835398, lng:121.4415041, group:'4star',\n        detail:'幸福水泥關係｜資本額8.8億｜負責人陳韻如｜樹林+五股+汐止+基隆共5廠', relations:null },\n      { name:'幸孚預拌混凝土（基隆廠）'";

html = html.replace(old, newBlock);
fs.writeFileSync('output/全台預拌混凝土廠地圖.html', html, 'utf8');
console.log('OK');

const v = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');
console.log('幸孚土城 present:', v.includes('幸孚預拌混凝土（土城廠）') ? 'YES' : 'NO');
console.log('Break test:', (v.match(/\{ name:'\{/g) || []).length);
