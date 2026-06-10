const fs = require('fs');

const tileOpenStreetMap = "L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n  attribution: '&copy; OpenStreetMap contributors',\n  maxZoom: 18\n}).addTo(map);";

const tileCompact = "L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution:'&copy; OpenStreetMap contributors', maxZoom:18 }).addTo(map);";

const tileNew = "const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {\n  attribution: '&copy; OpenStreetMap contributors', maxZoom: 18\n});\nconst nlsc = L.tileLayer('https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/{z}/{y}/{x}', {\n  attribution:'\\u570b\\u571f\\u6e2c\\u7e6a\\u5716\\u8cc7\\u670d\\u52d9\\u96f2', maxZoom: 18\n});\nnlsc.addTo(map);\nL.control.layers({ '\\u570b\\u571f\\u6e2c\\u7e6a\\u5716\\u8cc7\\uff08\\u7cbe\\u78ba\\uff09':nlsc, 'OpenStreetMap':osm }, null, { position:'topleft' }).addTo(map);";

const updates = [
  { file: 'output/全台預拌混凝土廠地圖.html', old: tileOpenStreetMap, new: tileNew },
  { file: 'output/花蓮預拌混凝土廠地圖.html', old: tileOpenStreetMap, new: tileNew },
  { file: 'output/宜蘭預拌混凝土廠地圖.html', old: tileOpenStreetMap, new: tileNew },
  { file: 'output/花蓮競爭力簡報.html', old: tileCompact, new: tileNew },
  { file: 'output/宜蘭競爭力簡報.html', old: tileCompact, new: tileNew },
];

for (const u of updates) {
  let html = fs.readFileSync(u.file, 'utf8');
  if (html.includes(u.old)) {
    html = html.replace(u.old, u.new);
    fs.writeFileSync(u.file, html, 'utf8');
    console.log(u.file + ': OK');
  } else {
    console.log(u.file + ': pattern not found');
    // Debug: show what's around the L.tileLayer call
    const idx = html.indexOf('L.tileLayer');
    if (idx >= 0) console.log('  Found at', idx, ':', JSON.stringify(html.substring(idx, idx+120)));
  }
}
