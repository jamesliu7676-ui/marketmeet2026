const fs = require('fs');

const html = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');

const NEW_MARKERS = {
  taipei: [
    { name:'世芳預拌混凝土有限公司', addr:'新北市樹林區中正路205號', lat:24.9907, lng:121.4205, group:'2star',
      detail:'資本額待查｜樹林區預拌廠 | TRMC會員', relations:null },
  ],
  hsinchu: [
    { name:'頭份混凝土有限公司', addr:'苗栗縣苗栗市文聖里文山231之2號', lat:24.5615, lng:120.8192, group:'2star',
      detail:'資本額待查｜苗栗市預拌廠 | TRMC會員', relations:null },
  ],
  taichung: [
    { name:'民峰實業股份有限公司梧棲預拌混凝土廠', addr:'台中市梧棲區臨港路二段210號', lat:24.2549, lng:120.5316, group:'3star',
      detail:'民峰集團｜梧棲預拌廠 | TRMC會員', relations:null },
    { name:'野馬預拌混凝土有限公司', addr:'台中市龍井區臨港路一段880巷18號', lat:24.1927, lng:120.5458, group:'2star',
      detail:'資本額待查｜龍井區預拌廠 | TRMC會員', relations:null },
    { name:'埔塩預拌混凝土股份有限公司埔鹽廠', addr:'彰化縣埔鹽鄉埔港路63-4號', lat:24.0001, lng:120.4636, group:'2star',
      detail:'資本額待查｜埔鹽鄉預拌廠 | TRMC會員', relations:null },
    { name:'有駿預拌混凝土股份有限公司', addr:'彰化縣埤頭鄉彰水路四段468巷10號', lat:23.8914, lng:120.4622, group:'2star',
      detail:'資本額待查｜埤頭鄉預拌廠 | TRMC會員', relations:null },
  ],
  yunlin: [
    { name:'盛記預拌混凝土有限公司', addr:'雲林縣斗六市石寮路2之12號', lat:23.7051, lng:120.5373, group:'2star',
      detail:'資本額待查｜斗六市預拌廠 | TRMC會員', relations:null },
  ],
  tainan: [
    { name:'丁丁有限公司預拌混凝土廠', addr:'台南市玉井區工業街266號', lat:23.1222, lng:120.4574, group:'2star',
      detail:'資本額待查｜玉井區預拌廠 | TRMC會員', relations:null },
    { name:'安筑混凝土有限公司', addr:'台南市新營區嘉芳里八德路三號', lat:23.3087, lng:120.3170, group:'2star',
      detail:'資本額待查｜新營區預拌廠 | TRMC會員', relations:null },
    { name:'玉楠混凝土企業股份有限公司楠西廠', addr:'台南市楠西區鹿田里鹿陶洋1號', lat:23.1738, lng:120.4876, group:'2star',
      detail:'資本額待查｜楠西區預拌廠 | TRMC會員', relations:null },
  ],
  kaohsiung: [
    { name:'高屏預拌混凝土有限公司', addr:'高雄市美濃區自強街一段630號', lat:22.8979, lng:120.5415, group:'2star',
      detail:'資本額待查｜美濃區預拌廠 | TRMC會員', relations:null },
  ],
  pingtung: [
    { name:'城夆預拌混凝土有限公司九如廠', addr:'屏東縣九如鄉九如路二段1巷2號', lat:22.7398, lng:120.4901, group:'2star',
      detail:'資本額待查｜九如鄉預拌廠 | TRMC會員', relations:null },
    { name:'超群混凝土工業股份有限公司內埔廠', addr:'屏東縣內埔鄉豐田村建富路7號', lat:22.6120, lng:120.5669, group:'2star',
      detail:'資本額待查｜內埔鄉預拌廠 | TRMC會員', relations:null },
  ],
  yilan: [
    { name:'禹盛混凝土有限公司', addr:'宜蘭縣三星鄉月眉村星中路157號', lat:24.6660, lng:121.6532, group:'2star',
      detail:'資本額待查｜三星鄉預拌廠 | TRMC會員', relations:null },
    { name:'梅洲混凝土工業股份有限公司', addr:'宜蘭縣宜蘭市梅洲二路57號', lat:24.7520, lng:121.7533, group:'2star',
      detail:'資本額待查｜宜蘭市梅洲工業區｜宜興集團林贊壽擔任董事長', relations:null },
  ],
};

// Strategy: find each region's markers:[ ... ], and insert before the closing ],
const lines = html.split('\n');
const resultLines = [];
let insertCount = 0;

// Scan markers array for each region
let currentRegion = null;
let inMarkers = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Detect region start: '  regionName: {' pattern (2 or 4 spaces)
  const regionMatch = line.match(/^(\s{2,4})(\w+):\s*\{/);
  if (regionMatch) {
    currentRegion = regionMatch[2];
  }
  
  // Detect markers array start
  if (currentRegion && line.trim() === 'markers:[') {
    inMarkers = true;
  }
  
  // Detect markers array end: line is '    ]' (4 spaces, no comma)
  if (inMarkers && line.trim() === ']') {
    inMarkers = false;
    
    // Insert new markers for this region before the closing
    if (NEW_MARKERS[currentRegion]) {
      for (const m of NEW_MARKERS[currentRegion]) {
        resultLines.push(`      { name:'${m.name}', addr:'${m.addr}', lat:${m.lat}, lng:${m.lng}, group:'${m.group}',`);
        resultLines.push(`        detail:'${m.detail}', relations:null },`);
        insertCount++;
      }
    }
    currentRegion = null;
  }
  
  resultLines.push(line);
}

const result = resultLines.join('\n');
console.log(`Inserted ${insertCount} new markers`);
fs.writeFileSync('output/全台預拌混凝土廠地圖.html', result, 'utf8');
console.log('File written successfully');

// Verify - count markers
const finalHtml = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');
const markerCount = (finalHtml.match(/\{ name:'/g) || []).length;
console.log(`Total markers in file: ${markerCount}`);
