const fs = require('fs');

const nlscCode = `
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors', maxZoom: 18
});
const nlsc = L.tileLayer('https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/{z}/{y}/{x}', {
  attribution:'\u570b\u571f\u6e2c\u7e6a\u5716\u8cc7\u670d\u52d9\u96f2', maxZoom: 18
});
nlsc.addTo(map);
L.control.layers({ '\u570b\u571f\u6e2c\u7e6a\u5716\u8cc7\uff08\u7cbe\u78ba\uff09':nlsc, 'OpenStreetMap':osm }, null, { position:'topleft' }).addTo(map);
`.trimStart();

const files = [
  'output/全台預拌混凝土廠地圖.html',
  'output/花蓮預拌混凝土廠地圖.html',
  'output/宜蘭預拌混凝土廠地圖.html',
  'output/花蓮競爭力簡報.html',
  'output/宜蘭競爭力簡報.html'
];

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  
  // Find the L.tileLayer call and the following .addTo(map)
  const idx = html.indexOf('L.tileLayer(');
  if (idx < 0) { console.log(file + ': no L.tileLayer found'); continue; }
  
  const addToIdx = html.indexOf('.addTo(map);', idx);
  if (addToIdx < 0) { console.log(file + ': no .addTo(map) found'); continue; }
  
  const original = html.substring(idx, addToIdx + '.addTo(map);'.length);
  html = html.replace(original, nlscCode);
  fs.writeFileSync(file, html, 'utf8');
  
  // Verify
  const verify = fs.readFileSync(file, 'utf8');
  if (verify.includes('nlsc.addTo(map)')) {
    console.log(file + ': OK');
  } else {
    console.log(file + ': VERIFY FAILED');
  }
}
