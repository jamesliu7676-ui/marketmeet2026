const fs = require('fs');
let html = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');

// Fix { name:'{ name:' double prefixes
const fixed = html.replace(/\{ name:'\{ name:'/g, "{ name:'");
const doubleCount = (fixed.match(/\{ name:'\{ name:'/g) || []).length;
console.log('Fixed double prefixes. Remaining:', doubleCount);

html = fixed;

// Check 力泰士林
const lt1 = html.indexOf("力泰建設企業（士林廠）', addr:'士林區延平北路七段7號");
if (lt1 >= 0) {
  const endNull = html.indexOf('relations:null}', lt1);
  if (endNull >= 0 && endNull - lt1 < 300) {
    // Find the full entry
    const entryStart = html.lastIndexOf('{', lt1);
    const entryEnd = endNull + 15;
    const oldEntry = html.substring(entryStart, entryEnd);
    const newEntry = "{ name:'力泰建設企業（士林廠）', addr:'士林區延平北路七段7號', lat:25.1007798, lng:121.4902192, group:'4star',\n        detail:'上柜5520｜資本額7.38億｜負責人吳良材｜北部最大獨立業者',\n        relations:{me:'力泰建設企業', members:[\n          {name:'吳良材', role:'董事長兼總經理', companies:['力泰建設企業']},\n          {name:'吳劉冠伶', role:'董事', companies:['力泰建設企業','富源投資']},\n          {name:'李義雄', role:'董事', companies:['力泰建設企業','上甘利投資']},\n          {name:'朱風鳴', role:'獨立董事', companies:['力泰建設企業']},\n          {name:'高富銓', role:'獨立董事', companies:['力泰建設企業']}\n        ]} }";
    html = html.replace(oldEntry, newEntry);
    console.log('力泰士林: fixed');
  } else {
    console.log('力泰士林: already has relations (or not found)');
  }
}

fs.writeFileSync('output/全台預拌混凝土廠地圖.html', html, 'utf8');

// Verify
const v = fs.readFileSync('output/全台預拌混凝土廠地圖.html', 'utf8');
console.log('Double {name: count:', (v.match(/\{ name:'\{ name:'/g) || []).length);
console.log('力泰士林 has relations:', v.includes("relations:{me:'力泰建設企業'"));
