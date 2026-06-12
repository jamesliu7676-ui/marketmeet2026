const fs = require('fs');
const https = require('https');

const addresses = [
  { id:'gcm_lk', name:'國產建材實業（林口廠）', addr:'桃園市龜山區樂善里文明路17號' },
  { id:'gcm_lz2', name:'國產建材實業（蘆竹二廠）', addr:'桃園市蘆竹區內厝里長興路三段277巷10號' },
  { id:'yat_ty', name:'亞東預拌混凝土（桃園廠）', addr:'桃園市蘆竹區興隆街42號' },
  { id:'yat_bd', name:'亞東預拌混凝土（八德廠）', addr:'桃園市八德區興豐路2350巷369號' },
  { id:'yat_xw', name:'亞東預拌混凝土（新屋廠）', addr:'桃園市新屋區鼎鐘路210號' },
  { id:'yat_lk', name:'亞東預拌混凝土（林口廠）', addr:'桃園市龜山區大崗里頂湖28號' },
  { id:'tcc_gs', name:'台灣水泥（龜山分廠）', addr:'桃園市龜山區龍壽里東萬壽路688號' },
  { id:'tcc_ty2', name:'台灣水泥（桃園二廠）', addr:'桃園市蘆竹區六福路59號' },
  { id:'tcc_ty', name:'台灣水泥（桃園分廠）', addr:'桃園市蘆竹區南山路二段220號' },
  { id:'sunsan', name:'新三亞預拌混凝土廠', addr:'桃園市龍潭區龍源路81號' },
  { id:'cinglng', name:'慶龍預拌混凝土', addr:'桃園市蘆竹區內溪路自強巷2號' },
  { id:'gopu', name:'國普混凝土工業', addr:'桃園市蘆竹區興隆街42號' },
  { id:'kuoshun_lh', name:'國順預拌混凝土（龍華廠）', addr:'桃園市龜山區龍壽里龍校街32巷40號' },
  { id:'dayuan', name:'大園預拌混凝土', addr:'桃園市大園區圳頭里後館一路427號' },
  { id:'cinglng2', name:'慶隆預拌混凝土', addr:'桃園市中壢區普忠路331號' },
  { id:'wuxiong', name:'武雄實業（觀音廠）', addr:'桃園市觀音區草漯里忠孝路645號' },
  { id:'cinghwang', name:'慶皇水泥', addr:'桃園市觀音區廣興里保興路一段228號' },
];

function geocode(addr) {
  return new Promise((resolve, reject) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addr + ' 台灣')}&limit=1`;
    https.get(url, { headers: { 'User-Agent': 'MarketMeet2026/1.0' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const r = JSON.parse(data);
          if (r && r.length > 0) {
            resolve({ lat: parseFloat(r[0].lat), lng: parseFloat(r[0].lon) });
          } else {
            resolve(null);
          }
        } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

(async () => {
  const results = {};
  for (const item of addresses) {
    console.log(`Geocoding: ${item.name}...`);
    const coord = await geocode(item.addr);
    if (coord) {
      results[item.id] = { name: item.name, addr: item.addr, lat: coord.lat, lng: coord.lng };
      console.log(`  OK: ${coord.lat}, ${coord.lng}`);
    } else {
      results[item.id] = { name: item.name, addr: item.addr, lat: null, lng: null };
      console.log(`  FAILED`);
    }
    await new Promise(r => setTimeout(r, 1100));
  }
  fs.writeFileSync('taoyuan_coords.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('Done!');
})();
