const fs = require('fs');
let html = fs.readFileSync('D:\\James-opencode\\marketmeet2026\\output\\全台預拌混凝土廠地圖.html', 'utf8');

// 國順 common relations (multi-line, match 龍華廠 format)
const guoshunRel = `relations:{me:'國順預拌混凝土', members:[
          {name:'劉世翔',role:'董事長',companies:['國順預拌混凝土','昌久金屬科技','鑫沐國際']},
          {name:'王新仁',role:'監察人',companies:['國順預拌混凝土']},
          {name:'游月雲',role:'董事',companies:['國順預拌混凝土']},
          {name:'劉世為',role:'董事',companies:['國順預拌混凝土']},
          {name:'何正偉',role:'董事',companies:['國順預拌混凝土']},
          {name:'林鳳盈',role:'董事',companies:['國順預拌混凝土']}]}`;

// 竑榮 relations (single line)
const hongrongRel = `relations:{me:'竑榮實業', members:[{name:'楊芳銘',role:'董事長',companies:['竑榮實業','立竑預拌','漢鴻實業','森榮營造']},{name:'楊聰評',role:'董事',companies:['竑榮實業']},{name:'楊芳誌',role:'董事',companies:['竑榮實業']},{name:'楊淑妃',role:'監察人',companies:['竑榮實業']}]}`;

// 國順 replacements — find each marker name, then replace relations:null
const guoshunSubs = ['國順預拌混凝土（新竹廠）', '國順預拌混凝土（竹南廠）', '國順預拌混凝土（苗栗廠）'];
let count = 0;

guoshunSubs.forEach(name => {
  const idx = html.indexOf("name:'" + name + "'");
  if (idx < 0) { console.log('NOT FOUND: ' + name); return; }
  const relNull = html.indexOf("relations:null", idx);
  if (relNull < 0) { console.log('no null for: ' + name); return; }
  html = html.substring(0, relNull) + guoshunRel + html.substring(relNull + 'relations:null'.length);
  count++;
  console.log('OK: ' + name);
});

// 竑榮 sub-factories — they are single-line markers without detail/relations
// Need to convert: { name:'...', addr:'...', lat:..., lng:..., group:'3star' },
// To: { name:'...', addr:'...', lat:..., lng:..., group:'3star',
//        detail:'...', relations:{...} },

const hongrongSubs = {
  '竑榮實業（安定廠）': { addr:'台南市安定區許中營24之11號', lat:23.104, lng:120.237, detail:'竑榮實業關係企業｜安定廠' },
  '竑榮實業（高雄廠）': { addr:'高雄市大社區旗楠路80巷210號', lat:22.737, lng:120.354, detail:'竑榮實業關係企業｜高雄廠' },
  '竑榮實業（仁武廠）': { addr:'高雄市仁武區工業二路11號', lat:22.702, lng:120.35, detail:'竑榮實業關係企業｜仁武廠' }
};

Object.keys(hongrongSubs).forEach(name => {
  const sub = hongrongSubs[name];
  const oldStr = `      { name:'${name}', addr:'${sub.addr}', lat:${sub.lat}, lng:${sub.lng}, group:'3star' },`;
  const newStr = `      { name:'${name}', addr:'${sub.addr}', lat:${sub.lat}, lng:${sub.lng}, group:'3star',
        detail:'${sub.detail}', ${hongrongRel} },`;
  
  if (html.includes(oldStr)) {
    html = html.replace(oldStr, newStr);
    count++;
    console.log('OK: ' + name);
  } else {
    console.log('NOT FOUND: ' + name);
    console.log('  looking for: ' + oldStr.substring(0, 80));
  }
});

fs.writeFileSync('D:\\James-opencode\\marketmeet2026\\output\\全台預拌混凝土廠地圖.html', html, 'utf8');
console.log('\nTotal: ' + count + ' markers updated');
