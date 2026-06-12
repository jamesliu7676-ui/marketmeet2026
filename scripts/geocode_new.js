const fs = require('fs');
const https = require('https');

// Missing concrete companies to add
const NEW_COMPANIES = {
  // Keep region keys matching the existing HTML
  taipei: [
    { name:'世芳預拌混凝土有限公司', addr:'新北市樹林區中正路205號' },
  ],
  hsinchu: [
    { name:'頭份混凝土有限公司', addr:'苗栗縣苗栗市文聖里文山231之2號' },
  ],
  taichung: [
    { name:'民峰實業股份有限公司梧棲預拌混凝土廠', addr:'台中市梧棲區臨港路二段210號' },
    { name:'野馬預拌混凝土有限公司', addr:'台中市龍井區臨港路一段880巷18號' },
    { name:'埔塩預拌混凝土股份有限公司埔鹽廠', addr:'彰化縣埔鹽鄉埔港路63-4號' },
    { name:'有駿預拌混凝土股份有限公司', addr:'彰化縣埤頭鄉彰水路四段468巷10號' },
  ],
  yunlin: [
    { name:'盛記預拌混凝土有限公司', addr:'雲林縣斗六市石寮路2之12號' },
  ],
  tainan: [
    { name:'丁丁有限公司預拌混凝土廠', addr:'台南市玉井區工業街266號' },
    { name:'安筑混凝土有限公司', addr:'台南市新營區嘉芳里八德路三號' },
    { name:'玉楠混凝土企業股份有限公司楠西廠', addr:'台南市楠西區鹿田里鹿陶洋1號' },
  ],
  kaohsiung: [
    { name:'高屏預拌混凝土有限公司', addr:'高雄市美濃區自強街一段630號' },
  ],
  pingtung: [
    { name:'城夆預拌混凝土有限公司九如廠', addr:'屏東縣九如鄉九如路二段1巷2號' },
    { name:'超群混凝土工業股份有限公司內埔廠', addr:'屏東縣內埔鄉豐田村建富路7號' },
  ],
  yilan: [
    { name:'禹盛混凝土有限公司', addr:'宜蘭縣三星鄉月眉村星中路157號' },
    { name:'梅洲混凝土工業股份有限公司', addr:'宜蘭縣宜蘭市梅洲二路57號' },
  ],
};

function geocode(addr) {
  return new Promise((resolve, reject) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr + ' 台灣')}&limit=1`;
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
  const results = {};
  for (const [region, companies] of Object.entries(NEW_COMPANIES)) {
    results[region] = [];
    for (const c of companies) {
      console.log(`Geocoding: ${c.name}...`);
      const coord = await geocode(c.addr);
      await new Promise(r => setTimeout(r, 1100)); // Nominatim rate limit
      if (coord) {
        results[region].push({ ...c, ...coord });
        console.log(`  → ${coord.lat}, ${coord.lng}`);
      } else {
        console.log(`  → NOT FOUND`);
        results[region].push({ ...c, lat: null, lng: null });
      }
    }
  }
  
  // Write results as JSON
  fs.writeFileSync('data/new_companies_coords.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\nResults saved to data/new_companies_coords.json');
}

main().catch(console.error);
