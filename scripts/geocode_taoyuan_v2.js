const fs = require('fs');
const https = require('https');

// Try geocoding with just the most basic info - city + road name
const items = [
  { id: 'gcm_lk', name: '國產建材實業（林口廠）', search: 'No. 17, Wenming Rd, Guishan District, Taoyuan City, Taiwan' },
  { id: 'gcm_lz2', name: '國產建材實業（蘆竹二廠）', search: 'No. 277-10, Changxing Rd Sec 3, Luzhu District, Taoyuan City, Taiwan' },
  { id: 'yat_ty', name: '亞東預拌混凝土（桃園廠）', search: 'No. 42, Xinglong St, Luzhu District, Taoyuan City, Taiwan' },
  { id: 'yat_bd', name: '亞東預拌混凝土（八德廠）', search: 'No. 369, Lane 2350, Xingfeng Rd, Bade District, Taoyuan City, Taiwan' },
  { id: 'yat_xw', name: '亞東預拌混凝土（新屋廠）', search: 'No. 210, Dingzhong Rd, Xinwu District, Taoyuan City, Taiwan' },
  { id: 'yat_lk', name: '亞東預拌混凝土（林口廠）', search: 'No. 28, Dinghu, Guishan District, Taoyuan City, Taiwan' },
  { id: 'tcc_gs', name: '台灣水泥（龜山分廠）', search: 'No. 688, Dongwanshou Rd, Guishan District, Taoyuan City, Taiwan' },
  { id: 'tcc_ty2', name: '台灣水泥（桃園二廠）', search: 'No. 59, Liufu Rd, Luzhu District, Taoyuan City, Taiwan' },
  { id: 'tcc_ty', name: '台灣水泥（桃園分廠）', search: 'No. 220, Nanshan Rd Sec 2, Luzhu District, Taoyuan City, Taiwan' },
  { id: 'sunsan', name: '新三亞預拌混凝土廠', search: 'No. 81, Longyuan Rd, Longtan District, Taoyuan City, Taiwan' },
  { id: 'cinglng', name: '慶龍預拌混凝土', search: 'No. 2, Lane Ziqiang, Neixi Rd, Luzhu District, Taoyuan City, Taiwan' },
  { id: 'gopu', name: '國普混凝土工業', search: 'No. 42, Xinglong St, Luzhu District, Taoyuan City, Taiwan' },
  { id: 'kuoshun_lh', name: '國順預拌混凝土（龍華廠）', search: 'No. 40, Lane 32, Longxiao St, Guishan District, Taoyuan City, Taiwan' },
  { id: 'dayuan', name: '大園預拌混凝土', search: 'No. 427, Houguan 1st Rd, Dayuan District, Taoyuan City, Taiwan' },
  { id: 'cinglng2', name: '慶隆預拌混凝土', search: 'No. 331, Puzhong Rd, Zhongli District, Taoyuan City, Taiwan' },
  { id: 'wuxiong', name: '武雄實業（觀音廠）', search: 'No. 645, Zhongxiao Rd, Guanyin District, Taoyuan City, Taiwan' },
  { id: 'cinghwang', name: '慶皇水泥', search: 'No. 228, Baoxing Rd Sec 1, Guanyin District, Taoyuan City, Taiwan' },
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
    process.stdout.write(`Geocoding: ${item.name}... `);
    const coord = await geocode(item.search);
    if (coord) {
      results[item.id] = { name: item.name, addr: item.search, lat: coord.lat, lng: coord.lng };
      console.log(`OK: ${coord.lat}, ${coord.lng}`);
    } else {
      results[item.id] = { name: item.name, addr: item.search, lat: null, lng: null };
      console.log('FAILED');
    }
    await new Promise(r => setTimeout(r, 1100));
  }
  fs.writeFileSync('taoyuan_coords.json', JSON.stringify(results, null, 2), 'utf8');
  console.log('\nDone! Saved to taoyuan_coords.json');
})();
