const fs = require('fs');
const https = require('https');

const items = [
  // 5star - National chains
  { id: 'gcm_hc', name: '國產新竹廠', search: 'Zhonghua Rd Sec 6 Hsinchu City Taiwan' },
  { id: 'gcm_dd', name: '國產東大廠', search: 'Dongda Rd Sec 3 Hsinchu City Taiwan' },
  { id: 'gcm_zhu bei', name: '國產竹北廠', search: 'Dongxing Rd Sec 2 Zhubei Hsinchu Taiwan' },
  { id: 'gcm_ml', name: '國產苗栗廠', search: 'Zhongxing St Tongluo Miaoli Taiwan' },
  { id: 'yas_hc', name: '亞興新竹廠', search: 'Dongda Rd Sec 3 Hsinchu City Taiwan' },
  { id: 'yas zb', name: '亞興竹北廠', search: 'Taihe Rd Zhubei Hsinchu Taiwan' },
  { id: 'tcc_hc', name: '台泥新竹分廠', search: 'Boai St Zhubei Hsinchu Taiwan' },
  // 4star
  { id: 'yngju', name: '永炬企業', search: 'Bei-an Zhudong Hsinchu Taiwan' },
  { id: 'hwanch', name: '環球混凝土新竹廠', search: 'Yuanshan Rd Zhudong Hsinchu Taiwan' },
  // 3star
  { id: 'ks_hc', name: '國順新竹廠', search: 'Zhonghua Rd Sec 1 Hsinchu City Taiwan' },
  { id: 'ks_zn', name: '國順竹南廠', search: 'Renai Rd Zhunan Miaoli Taiwan' },
  { id: 'ks_ml', name: '國順苗栗廠', search: 'Zhongxing Rd Tongluo Miaoli Taiwan' },
  { id: 'yongxie', name: '永協企業', search: 'Chenggong Rd Hukou Hsinchu Taiwan' },
  { id: 'yiho_bs', name: '毅和實業寶山廠', search: 'Sanfeng Rd Sec 2 Baoshan Hsinchu Taiwan' },
  { id: 'yiho_gc', name: '毅和實業港墘廠', search: 'Gangziqian Zhunan Miaoli Taiwan' },
  { id: 'jinfeng', name: '錦鋒混凝土', search: 'Shibanken Houlong Miaoli Taiwan' },
  { id: 'xiexin', name: '協鑫混凝土', search: 'Baliaowan Dahu Miaoli Taiwan' },
  // 2star
  { id: 'nangong', name: '南工實業', search: 'Dongda Rd Sec 3 Hsinchu City Taiwan' },
  { id: 'fuhong', name: '福宏實業', search: 'Qishifen Tongluo Miaoli Taiwan' },
  { id: 'jiufeng', name: '玖豐預拌後龍廠', search: 'Shibanken Houlong Miaoli Taiwan' },
  { id: 'dahong', name: '大弘水泥製品', search: 'Zhonglong 3rd Rd Tongluo Miaoli Taiwan' },
  { id: 'kunyu', name: '琨鈺企業', search: 'Hukou Hsinchu Taiwan' },
  // 1star
  { id: 'dingxin', name: '鼎新行', search: 'Hefeng Rd Hukou Hsinchu Taiwan' },
  { id: 'taixin', name: '泰欣混凝土', search: 'Dahu Rd Xiangshan Hsinchu Taiwan' },
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
      // Try with Chinese address
      results[item.id] = { lat: null, lng: null };
      console.log('FAILED');
    }
    await new Promise(r => setTimeout(r, 1100));
  }
  fs.writeFileSync('hsinchu_coords.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\nDone! Results saved to hsinchu_coords.json');
})();
