const fs = require('fs');
const https = require('https');

const ADDRESSES = [
  { id:'shifang', name:'世芳預拌混凝土有限公司', addr:'新北市樹林區中正路205號', region:'taipei' },
  { id:'toufen', name:'頭份混凝土有限公司', addr:'苗栗縣苗栗市文聖里文山231之2號', region:'hsinchu' },
  { id:'minfeng', name:'民峰實業梧棲預拌混凝土廠', addr:'台中市梧棲區臨港路二段210號', region:'taichung' },
  { id:'yema', name:'野馬預拌混凝土有限公司', addr:'台中市龍井區臨港路一段880巷18號', region:'taichung' },
  { id:'puyan', name:'埔塩預拌混凝土埔鹽廠', addr:'彰化縣埔鹽鄉埔港路63-4號', region:'taichung' },
  { id:'youjun', name:'有駿預拌混凝土股份有限公司', addr:'彰化縣埤頭鄉彰水路四段468巷10號', region:'taichung' },
  { id:'shengji', name:'盛記預拌混凝土有限公司', addr:'雲林縣斗六市石寮路2之12號', region:'yunlin' },
  { id:'dingding', name:'丁丁有限公司預拌混凝土廠', addr:'台南市玉井區工業街266號', region:'tainan' },
  { id:'anzhu', name:'安筑混凝土有限公司', addr:'台南市新營區嘉芳里八德路三號', region:'tainan' },
  { id:'yunana', name:'玉楠混凝土楠西廠', addr:'台南市楠西區鹿田里鹿陶洋1號', region:'tainan' },
  { id:'gaoping', name:'高屏預拌混凝土有限公司', addr:'高雄市美濃區自強街一段630號', region:'kaohsiung' },
  { id:'chengfeng', name:'城夆預拌混凝土九如廠', addr:'屏東縣九如鄉九如路二段1巷2號', region:'pingtung' },
  { id:'chaoqun', name:'超群混凝土內埔廠', addr:'屏東縣內埔鄉豐田村建富路7號', region:'pingtung' },
  { id:'yusheng', name:'禹盛混凝土有限公司', addr:'宜蘭縣三星鄉月眉村星中路157號', region:'yilan' },
  { id:'meizhou', name:'梅洲混凝土工業股份有限公司', addr:'宜蘭縣宜蘭市梅洲二路57號', region:'yilan' },
];

function geocode(addr) {
  return new Promise((resolve, reject) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr)}&limit=1`;
    https.get(url, { headers: { 'User-Agent': 'MarketMeet2026/1.0' } }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const results = JSON.parse(data);
          if (results.length > 0) {
            resolve({ lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) });
          } else {
            resolve(null);
          }
        } catch(e) {
          resolve(null);
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  for (const a of ADDRESSES) {
    console.log(`Geocoding: ${a.name} (${a.addr})...`);
    const coord = await geocode(a.addr);
    if (coord) {
      console.log(`  → ${coord.lat}, ${coord.lng}`);
      a.lat = coord.lat;
      a.lng = coord.lng;
    } else {
      console.log(`  → NOT FOUND`);
      a.lat = null;
      a.lng = null;
    }
    await new Promise(r => setTimeout(r, 1100));
  }
  fs.writeFileSync('data/new_coords.json', JSON.stringify(ADDRESSES, null, 2), 'utf8');
  console.log('\nDone!');
}

main().catch(console.error);
