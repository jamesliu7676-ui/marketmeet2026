const fs = require('fs');
const https = require('https');

// Try with simpler queries for the failed ones
const items = [
  { id: 'gcm_lz2', name: '國產蘆竹二廠', search: 'Changxing Rd Sec 3 Luzhu Taoyuan' },
  { id: 'yat_ty', name: '亞東桃園廠', search: 'Xinglong St Luzhu Taoyuan' },
  { id: 'yat_bd', name: '亞東八德廠', search: 'Xingfeng Rd Bade Taoyuan' },
  { id: 'yat_xw', name: '亞東新屋廠', search: 'Xinwu Taoyuan Dingzhong Rd' },
  { id: 'tcc_ty', name: '台泥桃園分廠', search: 'Nanshan Rd Sec 2 Luzhu Taoyuan' },
  { id: 'cinglng', name: '慶龍預拌', search: 'Neixi Rd Luzhu Taoyuan' },
  { id: 'gopu', name: '國普混凝土', search: 'Xinglong St Luzhu Taoyuan' },
  { id: 'kuoshun_lh', name: '國順龍華廠', search: 'Longxiao St Guishan Taoyuan' },
  { id: 'dayuan', name: '大園預拌', search: 'Dayuan Taoyuan Houguan Rd' },
  { id: 'wuxiong', name: '武雄觀音廠', search: 'Guanyin Taoyuan Zhongxiao Rd' },
  { id: 'cinghwang', name: '慶皇水泥', search: 'Guanyin Taoyuan Baoxing Rd' },
];

function geocode(query) {
  return new Promise((resolve, reject) => {
    const url = 'https://nominatim.openstreetmap.org/search?format=json&limit=1&q=' + encodeURIComponent(query);
    https.get(url, { headers: { 'User-Agent': 'MarketMeet/1.0' } }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const r = JSON.parse(d);
          if (r && r.length > 0) {
            resolve({ lat: parseFloat(r[0].lat), lng: parseFloat(r[0].lon) });
          } else resolve(null);
        } catch(e) { reject(e); }
      });
    }).on('error', reject);
  });
}

(async () => {
  const results = {};
  for (const item of items) {
    process.stdout.write(`${item.id}: ${item.name}... `);
    const coord = await geocode(item.search);
    if (coord) {
      results[item.id] = { lat: coord.lat, lng: coord.lng };
      console.log(`${coord.lat}, ${coord.lng}`);
    } else {
      results[item.id] = { lat: null, lng: null };
      console.log('FAILED');
    }
    await new Promise(r => setTimeout(r, 1100));
  }
  // also try searching by business name directly
  console.log('\n--- Trying business name search ---');
  const bizItems = [
    { id: 'kuoshun_lh2', name: '國順龍華廠', search: '國順預拌混凝土龍華廠 桃園' },
    { id: 'gcm_lz2b', name: '國產蘆竹二廠', search: '國產建材蘆竹二廠 桃園' },
    { id: 'dayuan2', name: '大園預拌', search: '大園預拌混凝土 桃園' },
  ];
  for (const item of bizItems) {
    process.stdout.write(`${item.id}: ${item.name}... `);
    const coord = await geocode(item.search);
    if (coord) {
      results[item.id] = { lat: coord.lat, lng: coord.lng };
      console.log(`${coord.lat}, ${coord.lng}`);
    } else {
      results[item.id] = { lat: null, lng: null };
      console.log('FAILED');
    }
    await new Promise(r => setTimeout(r, 1100));
  }
  fs.writeFileSync('taoyuan_coords_v3.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\nDone!');
})();
