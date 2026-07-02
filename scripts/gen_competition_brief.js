const fs = require('fs');
const regions = require('./_regions_module.js');

// ====== HELPER: extract capital from detail string ======
function getCapital(detail) {
  if (!detail) return 0;
  const yi = detail.match(/資本額([\d,]+)億/);
  const wan = detail.match(/資本額([\d,]+)萬/);
  const raw = detail.match(/資本額([\d,]+)/);
  if (yi) return parseFloat(yi[1].replace(/,/g,'')) * 10000;
  if (wan) return parseFloat(wan[1].replace(/,/g,''));
  if (raw && !raw[1].includes('億') && !raw[1].includes('萬')) return 0;
  return 0;
}

function getYear(detail) {
  if (!detail) return 0;
  const m = detail.match(/(\d{4})年/);
  return m ? parseInt(m[1]) : 0;
}

function getOwner(detail) {
  if (!detail) return '';
  const m = detail.match(/負責人(\S+)/);
  return m ? m[1] : '';
}

function getCerts(detail) {
  if (!detail) return [];
  const certs = [];
  if (detail.includes('GRMC')) certs.push('GRMC');
  if (detail.includes('ISO')) certs.push('ISO');
  if (detail.includes('碳足跡')) certs.push('碳足跡');
  if (detail.includes('綠色工廠')) certs.push('綠色工廠');
  return certs;
}

function getCapacity(specs) {
  if (!specs) return 0;
  const m = specs.match(/(\d+)\s*m[³3]\/hr/);
  return m ? parseInt(m[1]) : 0;
}

// ====== REGION NAMES (display order) ======
const regionOrder = ['hualien','yilan','taipei','taoyuan','hsinchu','taichung','yunlin','tainan','kaohsiung','pingtung','taitung'];

// ====== BUILD COMPARISON TABLE ROWS ======
function buildComparisonTable(markers) {
  // Filter out 5star (national brands) for fair local comparison
  // Actually include all for a complete picture
  const rows = [];
  markers.forEach(m => {
    const cap = getCapital(m.detail);
    const yr = getYear(m.detail);
    const owner = getOwner(m.detail);
    const certs = getCerts(m.detail);
    const capa = getCapacity(m.specs);
    rows.push({
      name: m.name,
      group: m.group,
      capital: cap,
      year: yr,
      owner: owner,
      certs: certs.join('/'),
      capacity: capa,
      hasGraph: m.relations && m.relations.members && m.relations.members.length > 0
    });
  });
  rows.sort((a,b) => b.capital - a.capital);
  return rows;
}

// ====== GENERATE INSIGHTS ======
function generateInsights(regionLabel, markers, rows) {
  const insights = [];
  const total = markers.length;
  const starCounts = {};
  markers.forEach(m => { starCounts[m.group] = (starCounts[m.group] || 0) + 1; });
  const fiveStar = starCounts['5star'] || 0;
  const fourStar = starCounts['4star'] || 0;
  const threeStar = starCounts['3star'] || 0;
  
  // Total count insight
  insights.push({ badge: '市場規模', title: `${total} 家業者`, desc: `${fiveStar} 家全國性大廠、${fourStar} 家在地龍頭、${threeStar} 家區域中型廠` });
  
  // Top capital insight
  if (rows.length > 0 && rows[0].capital > 0) {
    const capVal = rows[0].capital >= 10000 ? (rows[0].capital/10000).toFixed(1) + '億' : rows[0].capital + '萬';
    insights.push({ badge: '最大資本', title: rows[0].name.replace(/（.*?）/, ''), desc: `資本額 ${capVal}${rows[0].year ? '，設立於 ' + rows[0].year : ''}` });
  }
  
  // Graph data insight
  const withGraph = markers.filter(m => m.relations && m.relations.members);
  if (withGraph.length > 0) {
    insights.push({ badge: '董監事網絡', title: `${withGraph.length} 家可查`, desc: '點擊地圖廠標可查看董監事關係圖譜' });
  }
  
  // Cert insight
  const withGRMC = markers.filter(m => m.detail && m.detail.includes('GRMC'));
  if (withGRMC.length > 0) {
    insights.push({ badge: 'GRMC認證', title: `${withGRMC.length} 家通過`, desc: '預拌混凝土公會 GRMC 認證廠商' });
  }
  
  // Capacity insight
  const withCapa = rows.filter(r => r.capacity > 0);
  if (withCapa.length > 0) {
    const maxCap = withCapa.reduce((a,b) => a.capacity > b.capacity ? a : b);
    insights.push({ badge: '最高產能', title: maxCap.name, desc: `${maxCap.capacity} m³/hr` });
  }
  
  return insights.slice(0, 6); // max 6 cards
}

// ====== GENERATE THE FULL HTML ======
function generateHTML() {
  // Build per-region data
  const regionData = {};
  regionOrder.forEach(key => {
    const r = regions[key];
    const rows = buildComparisonTable(r.markers);
    regionData[key] = {
      label: r.label,
      center: r.center,
      zoom: r.zoom,
      markers: r.markers,
      rows: rows,
      insights: generateInsights(r.label, r.markers, rows)
    };
  });

  let slidesHtml = '';
  let jsData = '';
  
  regionOrder.forEach(key => {
    const rd = regionData[key];
    const slidePrefix = key;
    
    // Cover slide
    slidesHtml += `
<section class="slide" data-slide="${key}-cover" data-region="${key}">
  <div class="slide-inner cover">
    <div class="tag">MARKET MEET 2026</div>
    <h1>${rd.label}<br>預拌混凝土廠<br>競爭力比較</h1>
    <p class="sub">${rd.markers.length} 家營業中業者 · ${Object.entries(rd.markers.reduce((a,m)=>{a[m.group]=(a[m.group]||0)+1;return a;},{})).sort().map(([k,v])=>`${k} ${v}家`).join(' · ')}</p>
    <p class="meta">資料整合：工商登記 / 競爭力調查 / 廠商資料收集 ｜ 2025 年度數據</p>
  </div>
</section>`;

    // Overview / question slide
    slidesHtml += `
<section class="slide" data-slide="${key}-overview" data-region="${key}">
  <div class="slide-inner" style="text-align:center;max-width:800px">
    <span class="kicker">${rd.label}</span>
    <div class="t1" style="margin-bottom:20px">${rd.label}預拌混凝土市場，<br>競爭格局一次看清</div>
    <p class="t3" style="color:var(--ink-3)">${rd.markers.length} 家營業中業者，${Object.entries(rd.markers.reduce((a,m)=>{a[m.group]=(a[m.group]||0)+1;return a;},{})).sort().map(([k,v])=>`${v}家${k.replace('star','星')}`).join('、')}，完整呈現市場生態。</p>
  </div>
</section>`;

    // Map slide
    slidesHtml += `
<section class="slide map-slide" data-slide="${key}-map" data-region="${key}">
  <div id="map-${key}" class="region-map"></div>
</section>`;

    // Comparison table slide
    slidesHtml += `
<section class="slide" data-slide="${key}-table" data-region="${key}">
  <div class="slide-inner">
    <span class="kicker">${rd.label}</span>
    <div class="t2">${rd.label}業者總體比較</div>
    <p class="t4" style="color:var(--ink-3);margin-bottom:6px">點擊欄位標題排序 · 左右捲動看全部</p>
    <div class="comp-wrap">
      <table class="comp-table" id="table-${key}">
        <thead><tr>
          <th onclick="sortTable('${key}',0)">公司名稱</th>
          <th onclick="sortTable('${key}',1)">星等</th>
          <th onclick="sortTable('${key}',2)">資本額</th>
          <th onclick="sortTable('${key}',3)">設立年</th>
          <th onclick="sortTable('${key}',4)">負責人</th>
          <th onclick="sortTable('${key}',5)">認證</th>
          <th onclick="sortTable('${key}',6)">產能</th>
        </tr></thead>
        <tbody>${rd.rows.map(r => `<tr><td>${r.name}</td><td>${r.group.replace('star','★')}</td><td>${r.capital > 0 ? (r.capital >= 10000 ? (r.capital/10000).toFixed(1)+'億' : r.capital+'萬') : '—'}</td><td>${r.year || '—'}</td><td>${r.owner || '—'}</td><td>${r.certs || '—'}</td><td>${r.capacity > 0 ? r.capacity + ' m³/hr' : '—'}</td></tr>`).join('')}</tbody>
      </table>
    </div>
  </div>
</section>`;

    // Insights slide
    slidesHtml += `
<section class="slide" data-slide="${key}-insights" data-region="${key}">
  <div class="slide-inner">
    <span class="kicker">關鍵發現</span>
    <div class="t2">${rd.label} — 競爭力亮點</div>
    <div class="three-col" style="margin-top:20px">${rd.insights.map(ins => `
      <div class="type-card">
        <span class="badge">${ins.badge}</span>
        <h3>${ins.title}</h3>
        <p>${ins.desc.replace(/\n/g, '<br>')}</p>
      </div>`).join('')}
    </div>
  </div>
</section>`;

    // Map JavaScript data for this region
    jsData += `
  // ${rd.label}
  maps['${key}'] = null;
  function initMap_${key}() {
    if (maps['${key}']) return;
    const m = L.map('map-${key}', { zoomControl: true }).setView([${rd.center}], ${rd.zoom});
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OSM', maxZoom: 18 });
    const nlsc = L.tileLayer('https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/{z}/{y}/{x}', { attribution: 'NLSC', maxZoom: 18 });
    nlsc.addTo(m);
    L.control.layers({ 'NLSC':nlsc, 'OSM':osm }, null, { position:'topleft' }).addTo(m);
    const colors = { '5star':'#e74c3c','4star':'#e67e22','3star':'#f1c40f','2star':'#3498db','1star':'#95a5a6' };
    const scaleLabels = {'5star':'全國性大廠','4star':'在地龍頭','3star':'中型廠','2star':'小型廠','1star':'微型'};
    const markers = ${JSON.stringify(rd.markers.map(m => ({
      name: m.name, addr: m.addr, lat: m.lat, lng: m.lng,
      group: m.group, detail: m.detail || '', specs: m.specs || '',
      hasRel: !!(m.relations && m.relations.members && m.relations.members.length)
    })))};
    markers.forEach(d => {
      const color = colors[d.group] || '#95a5a6';
      const icon = L.divIcon({
        className: '', html: '<div style="width:16px;height:16px;background:'+color+';border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,0.4)"></div>',
        iconSize: [16,16], iconAnchor: [8,8]
      });
      const marker = L.marker([d.lat, d.lng], {icon}).addTo(m);
      const detailHtml = '<div class="popup-content"><div class="p-name">'+d.name+'</div>' +
        (d.detail ? '<div class="p-detail">'+d.detail+'</div>' : '') +
        (d.specs ? '<div class="p-specs">'+d.specs+'</div>' : '') +
        (d.hasRel ? '<div class="p-rel-title">📊 有董監事關係圖譜</div>' : '') +
        '</div>';
      marker.bindPopup(detailHtml);
    });
    maps['${key}'] = m;
  }`;
  });

  // Closing slide (shared)
  slidesHtml += `
<section class="slide" data-slide="closing" data-region="all">
  <div class="slide-inner closing">
    <div class="big">全台預拌<br>市場競爭格局</div>
    <p class="cta">全台 11 區域 · ${Object.values(regions).reduce((s,r)=>s+r.markers.length,0)} 家業者 · 完整競爭力分析</p>
    <button class="btn" onclick="goto('all','cover')">重新觀看</button>
  </div>
</section>`;

  const totalMarkers = Object.values(regions).reduce((s,r) => s + r.markers.length, 0);

  return `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>全台 — 預拌混凝土廠競爭力比較</title>
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;600;700;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
:root { --bg:#0a0e27; --bg-2:#11163a; --bg-3:#1a2050; --ink:#eef3ff; --ink-2:#b8c5e0; --ink-3:#7a8bb8; --accent:#00d4ff; --accent-2:#ff006e; --accent-3:#7b61ff; --t1:50px; --t2:32px; --t3:20px; --t4:14px; --s1:72px; --s2:42px; --s3:22px; --s4:11px; }
* { margin:0; padding:0; box-sizing:border-box; }
body { font-family:'Noto Sans TC',sans-serif; background:var(--bg); color:var(--ink); overflow:hidden; height:100vh; }
#progress { position:fixed; top:0; left:0; height:3px; background:linear-gradient(90deg,var(--accent),var(--accent-2)); width:0%; z-index:100; transition:width .45s ease; }
#section-tag { position:fixed; top:14px; right:24px; font-size:11px; color:var(--ink-3); letter-spacing:2px; z-index:100; }
#pageInfo { position:fixed; bottom:24px; right:28px; font-family:'JetBrains Mono',monospace; font-size:13px; color:var(--ink-3); z-index:100; }
#hint { position:fixed; bottom:24px; left:28px; font-size:12px; color:var(--ink-3); opacity:0.6; z-index:100; }
#regionSelector { position:fixed; top:12px; left:24px; z-index:100; }
#regionSelector select { background:var(--bg-2); color:var(--ink); border:1px solid rgba(255,255,255,0.1); border-radius:6px; padding:6px 12px; font-family:'Noto Sans TC',sans-serif; font-size:13px; cursor:pointer; outline:none; }
#regionSelector select:hover { border-color:var(--accent); }
#deck { position:fixed; inset:0; }
.slide { position:absolute; inset:0; display:flex; align-items:center; justify-content:center; padding:60px 80px; opacity:0; pointer-events:none; transform:translateY(20px); transition:opacity .5s ease,transform .5s ease; overflow-y:auto; }
.slide.active { opacity:1; pointer-events:auto; transform:translateY(0); }
.slide.map-slide { padding:0; }
.region-map { width:100%; height:100%; }
.cover { text-align:center; }
.cover .tag { font-size:13px; color:var(--accent); letter-spacing:4px; margin-bottom:20px; }
.cover h1 { font-size:var(--s1); font-weight:900; line-height:1.2; margin-bottom:14px; background:linear-gradient(135deg,var(--ink),var(--accent)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
.cover .sub { font-size:var(--t3); color:var(--ink-2); margin-bottom:8px; }
.cover .meta { font-size:var(--t4); color:var(--ink-3); margin-top:30px; }
.kicker { font-size:12px; color:var(--accent-2); letter-spacing:3px; text-transform:uppercase; margin-bottom:8px; display:block; }
.t1 { font-size:var(--t1); font-weight:700; line-height:1.25; margin-bottom:12px; }
.t2 { font-size:var(--t2); font-weight:600; margin-bottom:10px; }
.t3 { font-size:var(--t3); line-height:1.6; color:var(--ink-2); }
.t4 { font-size:var(--t4); color:var(--ink-3); }
.three-col { display:grid; grid-template-columns:repeat(3,1fr); gap:20px; margin-top:20px; }
.type-card { background:var(--bg-2); border-radius:14px; padding:28px 24px; border:1px solid rgba(255,255,255,0.06); cursor:default; transition:border-color .3s,transform .3s,background .3s; }
.type-card:hover { border-color:var(--accent); transform:translateY(-4px); background:var(--bg-3); }
.type-card h3 { font-size:var(--t3); font-weight:700; margin-bottom:6px; }
.type-card .badge { font-size:10px; color:var(--accent); letter-spacing:2px; display:block; margin-bottom:6px; }
.type-card p { font-size:var(--t4); color:var(--ink-2); line-height:1.5; }
.comp-table { width:100%; border-collapse:collapse; font-size:15px; margin-top:14px; }
.comp-table th { text-align:left; padding:10px 8px; border-bottom:1px solid rgba(255,255,255,0.12); color:var(--ink-3); font-weight:600; font-size:13px; letter-spacing:1px; cursor:pointer; user-select:none; white-space:nowrap; }
.comp-table th:hover { color:var(--accent); }
.comp-table th::after { content:' ⇅'; font-size:11px; color:var(--ink-3); }
.comp-table td { padding:8px; border-bottom:1px solid rgba(255,255,255,0.05); color:var(--ink-2); white-space:nowrap; font-size:14px; }
.comp-table tr:hover td { background:rgba(0,212,255,0.04); }
.comp-table td:first-child { font-weight:600; color:var(--ink); position:sticky; left:0; background:var(--bg); }
.comp-table th:first-child { position:sticky; left:0; background:var(--bg); }
.comp-table th:nth-child(n+2),.comp-table td:nth-child(n+2) { text-align:center; }
.comp-wrap { overflow-x:auto; border-radius:10px; border:1px solid rgba(255,255,255,0.06); }
.leaflet-container { background:#0a0e27 !important; }
.leaflet-popup-content-wrapper { border-radius:8px; }
.leaflet-control-zoom a { background:var(--bg-2) !important; color:var(--ink) !important; border-color:rgba(255,255,255,0.1) !important; }
.popup-content { font-size:12px; line-height:1.5; max-height:360px; overflow-y:auto; }
.popup-content .p-name { font-weight:700; font-size:14px; color:#1a3a5c; }
.popup-content .p-detail { color:#555; margin-top:1px; }
.popup-content .p-specs { margin-top:4px; font-size:12px; color:#1565c0; font-weight:600; background:#e3f2fd; padding:4px 8px; border-radius:4px; }
.popup-content .p-rel-title { font-weight:700; font-size:12px; color:#1a3a5c; margin-top:6px; padding-top:4px; border-top:1px solid #ddd; }
.closing { text-align:center; }
.closing .big { font-size:var(--s1); font-weight:900; line-height:1.3; background:linear-gradient(135deg,var(--accent),var(--accent-2)); -webkit-background-clip:text; -webkit-text-fill-color:transparent; margin-bottom:16px; }
.closing .cta { font-size:var(--t3); color:var(--ink-2); margin-bottom:30px; }
.closing .btn { display:inline-block; padding:14px 40px; border-radius:8px; background:linear-gradient(135deg,var(--accent),var(--accent-2)); color:#fff; font-size:var(--t4); font-weight:700; text-decoration:none; transition:transform .3s; cursor:pointer; border:none; }
.closing .btn:hover { transform:scale(1.05); }
@media (max-width:900px) {
  .slide { padding:40px 30px; }
  .three-col { grid-template-columns:1fr; gap:14px; }
  :root { --s1:48px; --s2:34px; --t1:32px; --t2:24px; --t3:17px; }
}
</style>
</head>
<body>

<div id="progress"></div>
<div id="section-tag">全台概覽</div>
<div id="pageInfo">1 / 6</div>
<div id="hint">← 方向鍵 / 點擊兩側 →</div>
<div id="regionSelector">
  <select id="regionSelect" onchange="switchRegion(this.value)">
    <option value="hualien">花蓮</option>
    <option value="yilan">宜蘭</option>
    <option value="taipei">北區（台北·新北·基隆）</option>
    <option value="taoyuan">桃園</option>
    <option value="hsinchu">新竹·苗栗</option>
    <option value="taichung">台中·彰化</option>
    <option value="yunlin">雲林·嘉義·南投</option>
    <option value="tainan">台南</option>
    <option value="kaohsiung">高雄</option>
    <option value="pingtung">屏東</option>
    <option value="taitung">台東</option>
  </select>
</div>

<main id="deck">
${slidesHtml}
</main>

<script>
// ====== NAVIGATION STATE ======
let currentRegion = 'taipei';
const slideTypes = ['cover','overview','map','table','insights'];
const slideNames = ['封面','概覽','地圖','比較','亮點'];
let currentSlideIdx = 0;
const maps = {};

function regionSlideId(region, type) {
  if (type === 'closing') return 'closing';
  return region + '-' + type;
}

function goto(region, type) {
  if (type === 'closing') {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
    document.querySelector('[data-slide="closing"]').classList.add('active');
    document.getElementById('pageInfo').textContent = '完成';
    document.getElementById('section-tag').textContent = '全台總覽';
    document.getElementById('progress').style.width = '100%';
    return;
  }
  
  const sid = regionSlideId(region, type);
  const slide = document.querySelector('[data-slide="' + sid + '"]');
  if (!slide) return;
  
  document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
  slide.classList.add('active');
  
  currentRegion = region;
  currentSlideIdx = slideTypes.indexOf(type);
  if (currentSlideIdx < 0) currentSlideIdx = 0;
  
  // Update info
  document.getElementById('pageInfo').textContent = slideNames[currentSlideIdx] + ' / ' + slideTypes.length;
  document.getElementById('section-tag').textContent = document.getElementById('regionSelect').options[document.getElementById('regionSelect').selectedIndex].text;
  document.getElementById('progress').style.width = ((currentSlideIdx + 1) / (slideTypes.length + 1) * 100) + '%';
  
  // Init map if needed
  if (type === 'map') {
    setTimeout(() => { initMap_region(region); }, 50);
  }
}

function initMap_region(region) {
  if (maps[region]) {
    maps[region].invalidateSize();
    return;
  }
  // Call the pre-generated init function
  try { self['initMap_' + region](); } catch(e) { /* map already init */ }
}

function next() {
  if (currentSlideIdx < slideTypes.length - 1) {
    goto(currentRegion, slideTypes[currentSlideIdx + 1]);
  } else if (currentSlideIdx === slideTypes.length - 1) {
    goto(currentRegion, 'closing');
    // Actually just go to closing
  } else {
    // On closing, go to next region
    const sel = document.getElementById('regionSelect');
    let idx = sel.selectedIndex + 1;
    if (idx >= sel.options.length) idx = 0;
    sel.selectedIndex = idx;
    switchRegion(sel.value);
  }
}

function prev() {
  const sel = document.getElementById('regionSelect');
  const region = sel.value;
  const curEl = document.querySelector('.slide.active');
  const ds = curEl ? curEl.dataset.slide : '';
  
  if (ds === 'closing') {
    goto(region, slideTypes[slideTypes.length - 1]);
    return;
  }
  
  if (currentSlideIdx > 0) {
    goto(region, slideTypes[currentSlideIdx - 1]);
  }
}

function switchRegion(region) {
  document.getElementById('regionSelect').value = region;
  currentRegion = region;
  currentSlideIdx = 0;
  goto(region, 'cover');
}

// Keyboard / click nav
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); next(); }
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prev(); }
  if (e.key === 'f' || e.key === 'F') { e.preventDefault(); document.documentElement.requestFullscreen().catch(()=>{}); }
});

document.getElementById('deck').addEventListener('click', e => {
  if (e.target.closest('.btn') || e.target.closest('.type-card') || e.target.closest('.comp-table') || e.target.closest('.leaflet-container') || e.target.closest('#regionSelector')) return;
  const w = window.innerWidth;
  if (e.clientX > w * 0.7) next();
  else if (e.clientX < w * 0.3) prev();
});

// Table sorting
let sortDirs = {};
function sortTable(region, col) {
  const tbody = document.querySelector('#table-' + region + ' tbody');
  if (!tbody) return;
  const rows = Array.from(tbody.querySelectorAll('tr'));
  const key = region + '-' + col;
  sortDirs[key] = !(sortDirs[key]) || undefined;
  const dir = sortDirs[key] ? 1 : -1;
  rows.sort((a, b) => {
    const va = a.cells[col] ? a.cells[col].textContent.trim() : '';
    const vb = b.cells[col] ? b.cells[col].textContent.trim() : '';
    const na = parseFloat(va.replace(/[^0-9.]/g, ''));
    const nb = parseFloat(vb.replace(/[^0-9.]/g, ''));
    if (!isNaN(na) && !isNaN(nb)) return (na - nb) * dir;
    return va.localeCompare(vb) * dir;
  });
  rows.forEach(r => tbody.appendChild(r));
}

// ====== PER-REGION MAP INIT FUNCTIONS ======
${jsData}

// Initial load
switchRegion('taipei');
</script>
</body>
</html>`;
}

const output = generateHTML();
fs.writeFileSync('D:\\James-opencode\\marketmeet2026\\output\\全台競爭力簡報.html', output, 'utf8');
console.log('Generated: 全台競爭力簡報.html (' + (output.length / 1024).toFixed(0) + ' KB)');
