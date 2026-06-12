const fs = require('fs');
const https = require('https');

// Try with full address queries
const items = [
  { id: 'gcm_hc', name: '國產新竹廠', search: '新竹市中華路六段646號' },
  { id: 'gcm_dd', name: '國產東大廠', search: '新竹市東大路三段110巷30-1號' },
  { id: 'gcm_zb', name: '國產竹北廠', search: '302新竹縣竹北市東興路二段588巷90號' },
  { id: 'gcm_ml', name: '國產苗栗廠', search: '苗栗縣銅鑼鄉中平村忠興街2號' },
  { id: 'yas_hc', name: '亞興新竹廠', search: '新竹市東大路三段274號' },
  { id: 'yas_zb', name: '亞興竹北廠', search: '新竹縣竹北市泰和路184號' },
  { id: 'tcc_hc', name: '台泥新竹分廠', search: '新竹縣竹北市博愛街792號' },
  { id: 'yngju', name: '永炬企業', search: '新竹縣竹東鎮仁愛里北岸6號' },
  { id: 'hwanch', name: '環球新竹廠', search: '新竹縣竹東鎮員山路435巷18號' },
  { id: 'ks_hc', name: '國順新竹廠', search: '新竹市中華路一段1巷26-1號' },
  { id: 'ks_zn', name: '國順竹南廠', search: '苗栗縣竹南鎮仁愛路1633號' },
  { id: 'ks_ml', name: '國順苗栗廠', search: '苗栗縣銅鑼鄉中平村中興路18-1號' },
  { id: 'yongxie', name: '永協企業', search: '新竹縣湖口鄉成功路910號' },
  { id: 'yiho_bs', name: '毅和寶山廠', search: '新竹縣寶山鄉雙溪村三峰路二段385號' },
  { id: 'yiho_gc', name: '毅和港墘廠', search: '苗栗縣竹南鎮港仔墘29-12號' },
  { id: 'jinfeng', name: '錦鋒混凝土', search: '苗栗縣後龍鎮龍坑里十班坑171-7號' },
  { id: 'xiexin', name: '協鑫混凝土', search: '苗栗縣大湖鄉富興村八寮灣25-15號' },
  { id: 'nangong', name: '南工實業', search: '新竹市東大路三段274號' },
  { id: 'fuhong', name: '福宏實業', search: '苗栗縣銅鑼鄉中平村七十份101號' },
  { id: 'jiufeng', name: '玖豐後龍廠', search: '苗栗縣後龍鎮龍坑里十班坑176-22號' },
  { id: 'dahong', name: '大弘水泥', search: '苗栗縣銅鑼鄉中隆三路17號' },
  { id: 'dingxin', name: '鼎新行', search: '新竹縣湖口鄉和豐路65巷67號' },
  { id: 'taixin', name: '泰欣混凝土', search: '新竹市香山區大湖路167巷59-1號' },
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
      console.log(`OK ${coord.lat}, ${coord.lng}`);
    } else {
      results[item.id] = { lat: null, lng: null };
      console.log('FAILED');
    }
    await new Promise(r => setTimeout(r, 1100));
  }
  // Retry failed ones with English queries
  console.log('\n--- Retrying failed with English ---');
  const retryMap = {
    'gcm_dd': 'Dongda Rd Sec 3 Hsinchu Taiwan concrete',
    'yas_zb': 'Taihe Rd Zhubei Hsinchu Taiwan',
    'hwanch': 'Yuanshan Rd Zhudong Hsinchu Taiwan',
    'yiho_bs': 'Baoshan Hsinchu ready mix concrete',
    'yiho_gc': 'Zhunan Miaoli ready mix concrete',
    'jinfeng': 'Houlong Miaoli concrete',
    'xiexin': 'Dahu Miaoli concrete',
    'nangong': 'Dongda Rd Sec 3 Hsinchu Taiwan',
    'fuhong': 'Tongluo Miaoli concrete',
    'jiufeng': 'Houlong Miaoli ready mix concrete',
    'dahong': 'Tongluo Miaoli cement products',
    'dingxin': 'Hukou Hsinchu building materials',
    'taixin': 'Xiangshan Hsinchu concrete',
  };
  for (const [id, q] of Object.entries(retryMap)) {
    if (results[id] && results[id].lat === null) {
      process.stdout.write(`${id}: retry... `);
      const coord = await geocode(q);
      if (coord) {
        results[id] = { lat: coord.lat, lng: coord.lng };
        console.log(`OK ${coord.lat}, ${coord.lng}`);
      } else {
        console.log('STILL FAILED');
      }
      await new Promise(r => setTimeout(r, 1100));
    }
  }
  fs.writeFileSync('hsinchu_coords.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\nDone!');
})();
