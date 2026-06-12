const fs = require('fs');
const https = require('https');

const places = [
  { q: '樹林區 新北市', key: 'shulin' },
  { q: '苗栗市 苗栗縣', key: 'miaolicity' },
  { q: '梧棲區 台中市', key: 'wuqi' },
  { q: '龍井區 台中市', key: 'longjing' },
  { q: '埔鹽鄉 彰化縣', key: 'puyan' },
  { q: '埤頭鄉 彰化縣', key: 'pitou' },
  { q: '斗六市 雲林縣', key: 'douliu' },
  { q: '玉井區 台南市', key: 'yujing' },
  { q: '新營區 台南市', key: 'xinying' },
  { q: '楠西區 台南市', key: 'nanxi' },
  { q: '美濃區 高雄市', key: 'meinong' },
  { q: '九如鄉 屏東縣', key: 'jiuru' },
  { q: '內埔鄉 屏東縣', key: 'neipu' },
  { q: '三星鄉 宜蘭縣', key: 'sanxing' },
  { q: '宜蘭市 宜蘭縣', key: 'yilan' },
];

function geocode(q) {
  return new Promise((resolve) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`;
    https.get(url, { headers: { 'User-Agent': 'MarketMeet2026/1.0' }, timeout: 10000 }, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const r = JSON.parse(d);
          if (r.length > 0) resolve({ lat: parseFloat(r[0].lat), lng: parseFloat(r[0].lon) });
          else resolve(null);
        } catch(e) { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  for (const p of places) {
    const c = await geocode(p.q);
    console.log(`${p.key}: ${c ? c.lat + ',' + c.lng : 'NOT FOUND'}`);
    p.coord = c;
    await new Promise(r => setTimeout(r, 1100));
  }
  fs.writeFileSync('data/district_coords.json', JSON.stringify(places, null, 2), 'utf8');
}

main().catch(console.error);
