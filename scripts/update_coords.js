const fs = require('fs');
const path = require('path');

const files = [
  'output/全台預拌混凝土廠地圖.html',
  'output/花蓮預拌混凝土廠地圖.html',
  'output/宜蘭預拌混凝土廠地圖.html',
  'output/花蓮競爭力簡報.html',
  'output/宜蘭競爭力簡報.html'
];

const coordUpdates = {
  // 花蓮 — exact old string → new lat,lng
  'lat:23.9932, lng:121.6170': 'lat:24.0164108, lng:121.6320073',
  'lat:23.9945, lng:121.6225': 'lat:24.0138314, lng:121.6289907',
  'lat:23.9920, lng:121.6175': 'lat:24.0134506, lng:121.6340555',
  'lat:24.0370, lng:121.6015': 'lat:24.1294355, lng:121.6428992',
  'lat:23.9485, lng:121.5770': 'lat:23.9249937, lng:121.5825473',
  'lat:24.3090, lng:121.7495': 'lat:24.2940384, lng:121.6023807',
  'lat:23.9470, lng:121.5760': 'lat:23.9354502, lng:121.5903549',
  'lat:23.7450, lng:121.4490': 'lat:23.7698653, lng:121.4910701',
  'lat:23.9745, lng:121.5980': 'lat:23.9520915, lng:121.5931644',
  'lat:23.9930, lng:121.5950': 'lat:23.9968395, lng:121.5977027',
  'lat:23.9670, lng:121.6035': 'lat:23.9452078, lng:121.5928811',
  'lat:23.6620, lng:121.4230': 'lat:23.6707166, lng:121.4242939',
  'lat:23.4960, lng:121.3760': 'lat:23.5324636, lng:121.3763246',
  'lat:23.5300, lng:121.3880': 'lat:23.5593331, lng:121.3958327',
  'lat:23.1820, lng:121.2500': 'lat:23.1827030, lng:121.2516392',
  'lat:23.3700, lng:121.3190': 'lat:23.3795730, lng:121.3253466',
  // 宜蘭
  'lat:24.739, lng:121.721': 'lat:24.7241679, lng:121.7104327',
  'lat:24.640, lng:121.760': 'lat:24.6223238, lng:121.7802177',
  'lat:24.6570, lng:121.7891': 'lat:24.6310386, lng:121.8224140',
  'lat:24.6580, lng:121.7920': 'lat:24.6278383, lng:121.8129374',
  'lat:24.6590, lng:121.7920': 'lat:24.6278383, lng:121.8129374',
  'lat:24.6580, lng:121.7890': 'lat:24.6247967, lng:121.8211877',
  'lat:24.6680, lng:121.7950': 'lat:24.6360639, lng:121.7948693',
  'lat:24.7540, lng:121.7410': 'lat:24.7805177, lng:121.7354767',
  // 北區
  'lat:25.1498, lng:121.3507': 'lat:25.1499958, lng:121.3930364',
  'lat:25.0680, lng:121.6481': 'lat:25.0661912, lng:121.6338472',
  'lat:24.9779, lng:121.4195': 'lat:24.9695713, lng:121.4372831',
  'lat:25.1426, lng:121.4208': 'lat:25.1585809, lng:121.4304577',
  'lat:25.0678, lng:121.6474': 'lat:25.0558581, lng:121.6314672',
  'lat:24.9781, lng:121.4189': 'lat:24.9691936, lng:121.4373806',
  'lat:25.0689, lng:121.6501': 'lat:25.0580012, lng:121.6371891',
  'lat:25.0932, lng:121.4991': 'lat:25.1007798, lng:121.4902192',
  'lat:25.0671, lng:121.6483': 'lat:25.0621481, lng:121.6396738',
  'lat:24.9785, lng:121.4187': 'lat:24.9835398, lng:121.4415041',
  'lat:25.0881, lng:121.7124': 'lat:25.1128261, lng:121.7276096',
  'lat:25.0410, lng:121.4209': 'lat:25.0414850, lng:121.5103107',
  'lat:24.9256, lng:121.3602': 'lat:24.9040392, lng:121.3503511',
  'lat:25.0654, lng:121.6498': 'lat:25.0593311, lng:121.6293336',
  'lat:25.0700, lng:121.6590': 'lat:25.0723776, lng:121.6859409',
  'lat:25.222, lng:121.635': 'lat:25.2166420, lng:121.6151730',
  'lat:24.9520, lng:121.3342': 'lat:24.9411175, lng:121.3384942',
  'lat:24.9810, lng:121.5321': 'lat:24.9719822, lng:121.5194806',
  'lat:25.0301, lng:121.9508': 'lat:25.0569387, lng:121.9246477',
  'lat:25.0499, lng:121.4332': 'lat:25.0566066, lng:121.4380565',
  'lat:25.1283, lng:121.7415': 'lat:25.1283, lng:121.7415',
};

for (const f of files) {
  const filePath = path.join('D:\\James-opencode\\marketmeet2026', f);
  let html = fs.readFileSync(filePath, 'utf8');
  let count = 0;

  for (const [oldStr, newStr] of Object.entries(coordUpdates)) {
    // Try no-space and space variants
    const variants = [
      oldStr,
      oldStr.replace('lat:', 'lat: ').replace(' lng:', ' lng: ')
    ];
    for (const variant of variants) {
      if (html.includes(variant)) {
        const replacement = newStr.replace('lat:', 'lat: ').replace(' lng:', ' lng: ');
        html = html.replaceAll(variant, replacement);
        count++;
        break;
      }
    }
  }

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`${f}: ${count} coordinates updated`);

  // Verify title isn't garbled
  const start = html.indexOf('<title>') + 7;
  const end = html.indexOf('</title>');
  console.log(`  Title: ${html.substring(start, end)}`);
}
