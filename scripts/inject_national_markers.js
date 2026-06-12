const fs = require('fs');
let html = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');

const newMarkers = {
  taoyuan: [
    { name:'國產建材實業（中壢廠）', addr:'桃園市平鎮區中豐路南勢一段1號', lat:24.946, lng:121.214, group:'5star' },
    { name:'和昌國際工業（楊梅廠）', addr:'桃園市楊梅區梅獅路一段157號', lat:24.908, lng:121.146, group:'4star' },
    { name:'和昌國際工業（觀音廠）', addr:'桃園市觀音區快速路9段2276巷11號', lat:25.033, lng:121.077, group:'4star' },
    { name:'宜興預拌混凝土（楊梅廠）', addr:'桃園市楊梅區永平里梅獅路一段270號', lat:24.908, lng:121.146, group:'4star' },
    { name:'幸孚預拌混凝土（埔心廠）', addr:'桃園市楊梅區梅獅路1段191號', lat:24.908, lng:121.146, group:'4star' },
  ],
  hsinchu: [
    { name:'毅和實業（大厝廠）', addr:'苗栗縣竹南鎮真和路253巷26號', lat:24.686, lng:120.872, group:'3star' },
  ],
  taichung: [
    { name:'台灣水泥（大肚分廠）', addr:'台中市大肚區沙田路二段303號', lat:24.153, lng:120.543, group:'5star' },
    { name:'興威股份有限公司（太平廠）', addr:'台中市太平區光興路327號', lat:24.129, lng:120.721, group:'4star' },
  ],
  yunlin: [
    { name:'台灣水泥（嘉義分廠）', addr:'嘉義縣民雄鄉北斗村新生街8號', lat:23.552, lng:120.432, group:'5star' },
    { name:'鳳勝實業（西螺廠）', addr:'雲林縣二崙鄉油車村山子門41號', lat:23.771, lng:120.415, group:'4star' },
    { name:'鳳勝實業（嘉泰廠）', addr:'嘉義縣太保市北港路二段105巷45號', lat:23.464, lng:120.332, group:'4star' },
    { name:'鳳勝實業（朴子廠）', addr:'嘉義縣朴子市朴子工業區一街16號', lat:23.464, lng:120.247, group:'4star' },
  ],
  tainan: [
    { name:'國產建材實業（仁德廠）', addr:'台南市仁德區義林路138號', lat:22.978, lng:120.251, group:'5star' },
    { name:'國產建材實業（新市廠）', addr:'台南市善化區小新里小新營461號', lat:23.132, lng:120.303, group:'5star' },
    { name:'台灣水泥（台南分廠）', addr:'台南市仁德區太乙七街36號', lat:22.978, lng:120.251, group:'5star' },
    { name:'台灣水泥（安平分廠）', addr:'台南市南區新樂路84-2號', lat:22.972, lng:120.193, group:'5star' },
    { name:'鳳勝實業（仁德廠）', addr:'台南市仁德區勝利路227號', lat:22.978, lng:120.251, group:'4star' },
    { name:'鳳勝實業（新營廠）', addr:'台南市新營區東山路158號', lat:23.31, lng:120.317, group:'4star' },
    { name:'環球水泥（永康預拌廠）', addr:'台南市永康區興工路20號', lat:23.027, lng:120.26, group:'4star' },
    { name:'環球水泥（麻豆預拌廠）', addr:'台南市麻豆區麻工一路377號', lat:23.186, lng:120.245, group:'4star' },
    { name:'竑榮實業（安定廠）', addr:'台南市安定區許中營24之11號', lat:23.104, lng:120.237, group:'3star' },
  ],
  kaohsiung: [
    { name:'國產建材實業（小港廠）', addr:'高雄市小港區永春街11號', lat:22.565, lng:120.35, group:'5star' },
    { name:'國產建材實業（高雄廠）', addr:'高雄市左營區民族一路930-1號', lat:22.682, lng:120.295, group:'5star' },
    { name:'國產建材實業（岡山廠）', addr:'高雄市岡山區本洲路180號', lat:22.796, lng:120.295, group:'5star' },
    { name:'台灣水泥（小港分廠）', addr:'高雄市小港區中林路12號', lat:22.565, lng:120.35, group:'5star' },
    { name:'台灣水泥（仁武分廠）', addr:'高雄市仁武區工業一路16號', lat:22.702, lng:120.35, group:'5star' },
    { name:'台灣水泥（路竹分廠）', addr:'高雄市路竹區大仁路809號', lat:22.857, lng:120.26, group:'5star' },
    { name:'環球水泥（小港預拌廠）', addr:'高雄市小港區沿海三路20號', lat:22.565, lng:120.35, group:'4star' },
    { name:'環球水泥（大湖預拌廠）', addr:'高雄市路竹區環球路461之1號', lat:22.857, lng:120.26, group:'4star' },
    { name:'環球水泥（楠梓預拌廠）', addr:'高雄市燕巢區鳳龍巷58號', lat:22.793, lng:120.361, group:'4star' },
    { name:'竑榮實業（高雄廠）', addr:'高雄市大社區旗楠路80巷210號', lat:22.737, lng:120.354, group:'3star' },
    { name:'竑榮實業（仁武廠）', addr:'高雄市仁武區工業二路11號', lat:22.702, lng:120.35, group:'3star' },
  ],
  pingtung: [
    { name:'環球水泥（潮州預拌廠）', addr:'屏東縣潮州鎮光復路一段53號', lat:22.551, lng:120.543, group:'4star' },
  ],
  hualien: [
    { name:'鳳勝實業（壽豐廠）', addr:'花蓮縣壽豐鄉月眉路3段72號', lat:23.87, lng:121.509, group:'4star' },
  ],
};

let totalAdded = 0;
for (const [regionKey, markers] of Object.entries(newMarkers)) {
  // Find pattern: regionKey: { ... markers:[ ... ] }
  // Look for regionKey: { then find markers:[ then find the matching ]
  const keyPos = html.indexOf(`${regionKey}: {`);
  if (keyPos < 0) { console.log(`  ${regionKey}: not found`); continue; }

  // Find markers:[ after keyPos
  const markersStart = html.indexOf('markers:[', keyPos);
  if (markersStart < 0) { console.log(`  ${regionKey}: markers not found`); continue; }

  // Find the matching closing bracket
  const startContent = markersStart + 'markers:['.length;
  let depth = 1;
  let endPos = startContent;
  while (depth > 0 && endPos < html.length) {
    if (html[endPos] === '[') depth++;
    else if (html[endPos] === ']') depth--;
    endPos++;
  }
  endPos--; // back to the ]

  // Build insertion string
  let insert = '';
  for (const m of markers) {
    insert += `\n      { name:'${m.name}', addr:'${m.addr}', lat:${m.lat}, lng:${m.lng}, group:'${m.group}' },`;
  }

  html = html.substring(0, endPos) + insert + '\n    ' + html.substring(endPos);
  totalAdded += markers.length;
  console.log(`  ${regionKey}: +${markers.length} markers`);
}

fs.writeFileSync('output/全台預拌混凝土廠地圖.html', html, 'utf8');
console.log(`\nDone! Added ${totalAdded} markers total`);
