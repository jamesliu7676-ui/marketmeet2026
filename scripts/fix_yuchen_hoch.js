const fs = require('fs');

let html = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');

// 1. Fix 宅辰興業 -> 宥辰興業 with relations
const oldZhai = "{ name:'宅辰興業', addr:'鴉歌區中正三路156巷26层2樓', lat:24.9411175, lng:121.3384942, group:'3star',\n        detail:'資本額4億｜2016年｜負責人藍隊寬', relations:null },\n      { name:'聯興建材工業', addr:'新店區安和路二段146巷30號'";

const newZhai = "{ name:'宥辰興業', addr:'鶯歌區中正三路156巷26號2樓', lat:24.9411175, lng:121.3384942, group:'3star',\n        detail:'資本額4億｜2016年｜負責人藍隆寬｜預拌混凝土製造',\n        relations:{ members:[\n          { name:'宥辰興業', color:'#4A90D9', size:15 },\n          { name:'藍隆寬(董事長)', color:'#F5D742', size:14 },\n          { name:'賴聰銘(監察人)', color:'#F5D742', size:14 },\n          { name:'宥合實業', color:'#888', size:13 }\n        ] } },\n      { name:'聯興建材工業', addr:'新店區安和路二段146巷30號'";

if (!html.includes(oldZhai)) {
  console.log('ERROR: 宅辰 pattern not found');
  console.log('Looking for:', JSON.stringify(JSON.stringify(oldZhai.substring(0,80))));
  const idx = html.indexOf('宅辰');
  if (idx >= 0) console.log('Found at', idx, ':', JSON.stringify(html.substring(idx, idx+200)));
  process.exit(1);
}
html = html.replace(oldZhai, newZhai);
console.log('1. 宥辰興業: OK');

// 2. Add relations to 和昌國際工業（汐止廠）
const oldHe1 = "{ name:'和昌國際工業（汐止廠）', addr:'汐止區保新街133-1號', lat:25.0723776, lng:121.6859409, group:'4star',\n        detail:'原台產實業｜和昌國際工業購入｜資本額4.85億｜負責人江程金', relations:null }";

const newHe1 = "{ name:'和昌國際工業（汐止廠）', addr:'汐止區保新街133-1號', lat:25.0723776, lng:121.6859409, group:'4star',\n        detail:'原台產實業｜和昌國際工業購入｜資本額4.85億｜負責人江程金',\n        relations:{ members:[\n          { name:'和昌國際工業（汐止廠）', color:'#4A90D9', size:15 },\n          { name:'江程金(董事長)', color:'#F5D742', size:14 },\n          { name:'江家明(董事)', color:'#F5D742', size:14 },\n          { name:'姚漢卿(監察人)', color:'#F5D742', size:14 },\n          { name:'皇昌營造', color:'#888', size:13 }\n        ] } }";

if (!html.includes(oldHe1)) {
  console.log('ERROR: 和昌汐止 pattern not found');
  process.exit(1);
}
html = html.replace(oldHe1, newHe1);
console.log('2. 和昌汐止 relations: OK');

// 3. Add relations to 和昌國際工業（內湖廠）
const oldHe2 = "{ name:'和昌國際工業（內湖廠）', addr:'內湖區安康路111號', lat:25.062775, lng:121.598431, group:'4star',\n        detail:'和昌國際工業｜資本額4.85億｜負責人江程金｜GRMC認證', relations:null }";

const newHe2 = "{ name:'和昌國際工業（內湖廠）', addr:'內湖區安康路111號', lat:25.062775, lng:121.598431, group:'4star',\n        detail:'和昌國際工業｜資本額4.85億｜負責人江程金｜GRMC認證｜汐止廠+觀音廠+楊梅廠',\n        relations:{ members:[\n          { name:'和昌國際工業（內湖廠）', color:'#4A90D9', size:15 },\n          { name:'江程金(董事長)', color:'#F5D742', size:14 },\n          { name:'蔡萬興(監察人)', color:'#F5D742', size:14 },\n          { name:'鄭詩品(監察人)', color:'#F5D742', size:14 },\n          { name:'劉秋霞(董事)', color:'#F5D742', size:14 },\n          { name:'李彥德(董事)', color:'#F5D742', size:14 },\n          { name:'皇昌營造', color:'#888', size:13 }\n        ] } }";

if (!html.includes(oldHe2)) {
  console.log('ERROR: 和昌內湖 pattern not found');
  process.exit(1);
}
html = html.replace(oldHe2, newHe2);
console.log('3. 和昌內湖 relations: OK');

fs.writeFileSync('output/全台預拌混凝土廠地圖.html', html, 'utf8');

// Verify
const v = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');
console.log('宥辰 count:', (v.match(/宥辰/g) || []).length);
console.log('宅辰 count:', (v.match(/宅辰/g) || []).length);
console.log('和昌 relations count:', (v.match(/relations:{ members:/g) || []).length);
