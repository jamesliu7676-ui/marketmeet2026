import https from 'https';

const addr = encodeURIComponent(process.argv[2]);
const url = `https://nominatim.openstreetmap.org/search?format=json&limit=3&q=${addr}`;

https.get(url, { headers: { 'User-Agent': 'marketmeet2026/1.0' } }, res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const results = JSON.parse(data);
    if (results.length === 0) {
      console.log('NOT FOUND');
    } else {
      results.forEach(r => console.log(r.lat, r.lon, r.display_name));
    }
  });
});
