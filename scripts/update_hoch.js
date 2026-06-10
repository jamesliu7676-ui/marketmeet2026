const fs = require('fs');
let html = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');

const old1 = "{ name:'台產實業', addr:'汐止區保新街133-1號', lat:25.0723776, lng:121.6859409, group:'3star',\n        detail:'資本額2.2億｜1994年｜負責人蔡建庭', relations:null },\n      { name:'陽明混凝土', addr:'金山區南勢湖41號', lat:25.";

const new1 = "{ name:'和昌國際工業（汐止廠）', addr:'汐止區保新街133-1號', lat:25.0723776, lng:121.6859409, group:'4star',\n        detail:'原台產實業｜和昌國際工業購入｜資本額4.85億｜負責人江程金', relations:null },\n      { name:'和昌國際工業（內湖廠）', addr:'內湖區安康路111號', lat:25.062775, lng:121.598431, group:'4star',\n        detail:'和昌國際工業｜資本額4.85億｜負責人江程金｜GRMC認證', relations:null },\n      { name:'陽明混凝土', addr:'金山區南勢湖41號', lat:25.";

if (html.includes(old1)) {
  html = html.replace(old1, new1);
  console.log('台產 -> 和昌: OK');
} else {
  console.log('台產: pattern not found!');
  const idx = html.indexOf('台產實業');
  if (idx >= 0) console.log(JSON.stringify(html.substring(idx, idx+200)));
  process.exit(1);
}

fs.writeFileSync('output/全台預拌混凝土廠地圖.html', html, 'utf8');

const v = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');
console.log('和昌 count:', (v.match(/和昌/g) || []).length);
console.log('台產實業 count:', (v.match(/台產實業/g) || []).length);
