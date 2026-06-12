// Batch geocode missing national company plants
const fs = require('fs');
const https = require('https');

const plants = [
  // 國產建材 (5star) - 6 missing
  { name:'國產建材實業（中壢廠）', addr:'桃園市平鎮區中豐路南勢一段1號', region:'taoyuan', star:5 },
  { name:'國產建材實業（仁德廠）', addr:'台南市仁德區義林路138號', region:'tainan', star:5 },
  { name:'國產建材實業（新市廠）', addr:'台南市善化區小新里小新營461號', region:'tainan', star:5 },
  { name:'國產建材實業（小港廠）', addr:'高雄市小港區永春街11號', region:'kaohsiung', star:5 },
  { name:'國產建材實業（高雄廠）', addr:'高雄市左營區民族一路930-1號', region:'kaohsiung', star:5 },
  { name:'國產建材實業（岡山廠）', addr:'高雄市岡山區本洲路180號', region:'kaohsiung', star:5 },

  // 台灣水泥 (5star) - 7 missing
  { name:'台灣水泥（大肚分廠）', addr:'台中市大肚區沙田路二段303號', region:'taichung', star:5 },
  { name:'台灣水泥（嘉義分廠）', addr:'嘉義縣民雄鄉北斗村新生街8號', region:'yunlin', star:5 },
  { name:'台灣水泥（台南分廠）', addr:'台南市仁德區太乙七街36號', region:'tainan', star:5 },
  { name:'台灣水泥（安平分廠）', addr:'台南市南區新樂路84-2號', region:'tainan', star:5 },
  { name:'台灣水泥（小港分廠）', addr:'高雄市小港區中林路12號', region:'kaohsiung', star:5 },
  { name:'台灣水泥（仁武分廠）', addr:'高雄市仁武區工業一路16號', region:'kaohsiung', star:5 },
  { name:'台灣水泥（路竹分廠）', addr:'高雄市路竹區大仁路809號', region:'kaohsiung', star:5 },

  // 鳳勝實業 (4star) - 6 missing
  { name:'鳳勝實業（西螺廠）', addr:'雲林縣二崙鄉油車村山子門41號', region:'yunlin', star:4 },
  { name:'鳳勝實業（嘉泰廠）', addr:'嘉義縣太保市北港路二段105巷45號', region:'yunlin', star:4 },
  { name:'鳳勝實業（朴子廠）', addr:'嘉義縣朴子市朴子工業區一街16號', region:'yunlin', star:4 },
  { name:'鳳勝實業（仁德廠）', addr:'台南市仁德區勝利路227號', region:'tainan', star:4 },
  { name:'鳳勝實業（新營廠）', addr:'台南市新營區東山路158號', region:'tainan', star:4 },
  { name:'鳳勝實業（壽豐廠）', addr:'花蓮縣壽豐鄉月眉路3段72號', region:'hualien', star:4 },

  // 環球水泥 (4star) - 6 missing
  { name:'環球水泥（永康預拌廠）', addr:'台南市永康區興工路20號', region:'tainan', star:4 },
  { name:'環球水泥（麻豆預拌廠）', addr:'台南市麻豆區麻工一路377號', region:'tainan', star:4 },
  { name:'環球水泥（小港預拌廠）', addr:'高雄市小港區沿海三路20號', region:'kaohsiung', star:4 },
  { name:'環球水泥（大湖預拌廠）', addr:'高雄市路竹區環球路461之1號', region:'kaohsiung', star:4 },
  { name:'環球水泥（楠梓預拌廠）', addr:'高雄市燕巢區鳳龍巷58號', region:'kaohsiung', star:4 },
  { name:'環球水泥（潮州預拌廠）', addr:'屏東縣潮州鎮光復路一段53號', region:'pingtung', star:4 },

  // 和昌國際 (4star) - 2 missing
  { name:'和昌國際工業（楊梅廠）', addr:'桃園市楊梅區梅獅路一段157號', region:'taoyuan', star:4 },
  { name:'和昌國際工業（觀音廠）', addr:'桃園市觀音區快速路9段2276巷11號', region:'taoyuan', star:4 },

  // 宜興預拌 (4star) - 1 missing
  { name:'宜興預拌混凝土（楊梅廠）', addr:'桃園市楊梅區永平里梅獅路一段270號', region:'taoyuan', star:4 },

  // 幸孚 (4star) - 1 additional (keep existing 土城廠)
  { name:'幸孚預拌混凝土（埔心廠）', addr:'桃園市楊梅區梅獅路1段191號', region:'taoyuan', star:4 },

  // 毅和實業 (3star) - 1 missing
  { name:'毅和實業（大厝廠）', addr:'苗栗縣竹南鎮真和路253巷26號', region:'hsinchu', star:3 },

  // 興威股份 (4star) - 1 missing (台中廠 already on map)
  { name:'興威股份有限公司（太平廠）', addr:'台中市太平區光興路327號', region:'taichung', star:4 },

  // 竑榮實業 (3star) - 3 missing (官田廠 already on map)
  { name:'竑榮實業（安定廠）', addr:'台南市安定區許中營24之11號', region:'tainan', star:3 },
  { name:'竑榮實業（高雄廠）', addr:'高雄市大社區旗楠路80巷210號', region:'kaohsiung', star:3 },
  { name:'竑榮實業（仁武廠）', addr:'高雄市仁武區工業二路11號', region:'kaohsiung', star:3 },
];

let done = 0;
let cached = {};

// Load cache if exists
try { cached = JSON.parse(fs.readFileSync('data/national_coords.json','utf8')); } catch(e) {}

function geocode(addr) {
  return new Promise((resolve) => {
    if (cached[addr]) { resolve(cached[addr]); return; }
    const url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(addr + ' 台灣') + '&limit=1';
    https.get(url, { headers:{'User-Agent':'MarketMeet2026/1.0'} }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.length > 0) {
            const result = { lat: parseFloat(json[0].lat), lng: parseFloat(json[0].lon) };
            cached[addr] = result;
            resolve(result);
          } else {
            console.log('  NOT FOUND: ' + addr);
            cached[addr] = null;
            resolve(null);
          }
        } catch(e) { console.log('  PARSE ERROR: ' + addr); resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  for (const p of plants) {
    let result = await geocode(p.addr);
    done++;
    if (result) {
      console.log(`[${done}/${plants.length}] ${p.name} → ${result.lat}, ${result.lng}`);
    } else {
      // Use approximate coords by city
      let approx = null;
      const cityMap = {
        '桃園市平鎮區': [24.946, 121.214],
        '台南市仁德區': [22.978, 120.251],
        '台南市善化區': [23.132, 120.303],
        '高雄市小港區': [22.565, 120.350],
        '高雄市左營區': [22.682, 120.295],
        '高雄市岡山區': [22.796, 120.295],
        '台中市大肚區': [24.153, 120.543],
        '嘉義縣民雄鄉': [23.552, 120.432],
        '台南市南區': [22.972, 120.193],
        '高雄市仁武區': [22.702, 120.350],
        '高雄市路竹區': [22.857, 120.260],
        '雲林縣二崙鄉': [23.771, 120.415],
        '嘉義縣太保市': [23.464, 120.332],
        '嘉義縣朴子市': [23.464, 120.247],
        '台南市新營區': [23.310, 120.317],
        '花蓮縣壽豐鄉': [23.870, 121.509],
        '台南市永康區': [23.027, 120.260],
        '台南市麻豆區': [23.186, 120.245],
        '屏東縣潮州鎮': [22.551, 120.543],
        '桃園市楊梅區': [24.908, 121.146],
        '桃園市觀音區': [25.033, 121.077],
        '苗栗縣竹南鎮': [24.686, 120.872],
        '台中市太平區': [24.129, 120.721],
        '台南市安定區': [23.104, 120.237],
        '高雄市大社區': [22.737, 120.354],
        '高雄市燕巢區': [22.793, 120.361],
      };
      for (const [k, v] of Object.entries(cityMap)) {
        if (p.addr.includes(k)) { approx = { lat: v[0], lng: v[1] }; break; }
      }
      if (!approx) {
        // Try partial match
        for (const [k, v] of Object.entries(cityMap)) {
          const parts = k.split('區');
          if (parts.length > 1 && p.addr.includes(parts[0])) { approx = { lat: v[0], lng: v[1] }; break; }
        }
      }
      if (approx) {
        console.log(`  approx: ${p.name} → ${approx.lat}, ${approx.lng}`);
        result = approx;
        cached[p.addr] = approx;
      } else {
        console.log(`  FAILED: ${p.name} (${p.addr})`);
      }
    }
    // Rate limiting
    await new Promise(r => setTimeout(r, 1100));
  }

  // Save cache
  fs.writeFileSync('data/national_coords.json', JSON.stringify(cached, null, 2), 'utf8');

  // Output ready-to-use marker data
  console.log('\n\n=== MARKER DATA TO INJECT ===');
  for (const p of plants) {
    const coord = cached[p.addr];
    if (coord) {
      console.log(`\n// ${p.name}`);
      console.log(`{ name:'${p.name}', addr:'${p.addr}', lat:${coord.lat}, lng:${coord.lng}, group:'${p.star}star' },`);
    }
  }
}

main().catch(console.error);
