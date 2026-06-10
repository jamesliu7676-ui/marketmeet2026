const fs = require('fs');

let html = fs.readFileSync('output/\u5168\u53f0\u9810\u62cc\u6df7\u51dd\u571f\u5ee0\u5730\u5716.html', 'utf8');

const start = html.indexOf('taipei:');
const objStart = html.indexOf('{', start);
let depth = 1, end = objStart;
while (depth > 0 && end < html.length - 1) {
  end++;
  if (html[end] === '{') depth++;
  else if (html[end] === '}') depth--;
}
end++; // include the closing brace

const oldBlock = html.substring(start, end);
console.log('oldBlock length:', oldBlock.length);

const newBlock = 
`  taipei: {
    label:'\u5317\u5340\uff08\u53f0\u5317\u00b7\u65b0\u5317\u00b7\u57fa\u9686\uff09', center:[25.07,121.56], zoom:10,
    markers:[
      { name:'\u570b\u7522\u5efa\u6750\u5be6\u696d\uff08\u53f0\u5317\u6e2f\u5ee0\uff09', addr:'\u516b\u91cc\u5340\u5546\u6e2f\u8def128\u865f', lat:25.1499958, lng:121.3930364, group:'5star',
        detail:'\u570b\u7522\u5efa\u67502504\uff5c\u5168\u53f0\u6700\u5927\u9810\u62cc\u96c6\u5718\uff5c\u667a\u6167\u5ee0', relations:null },
      { name:'\u570b\u7522\u5efa\u6750\u5be6\u696d\uff08\u6c50\u6b62\u5ee0\uff09', addr:'\u6c50\u6b62\u5340\u798f\u5fb7\u4e8c\u8def360\u865f', lat:25.0661912, lng:121.6338472, group:'5star',
        detail:'\u570b\u7522\u5efa\u6750\uff5c\u6c50\u6b62\u4e8c\u5ee02024\u52d5\u5de5\uff5c\u5e74\u752230\u842cm\u00b3', relations:null },
      { name:'\u570b\u7522\u5efa\u6750\u5be6\u696d\uff08\u571f\u57ce\u5ee0\uff09', addr:'\u571f\u57ce\u5340\u4e2d\u83ef\u8def\u4e8c\u6bb5202\u865f', lat:24.9695713, lng:121.4372831, group:'5star',
        detail:'\u570b\u7522\u5efa\u6750\uff5c\u571f\u57ce\u5ee0\uff5c\u5ee0\u9577\u9673\u4e01\u90ce', relations:null },
      { name:'\u570b\u7522\u5efa\u6750\u5be6\u696d\uff08\u516b\u91cc\u5ee0\uff09', addr:'\u516b\u91cc\u5340\u9f8d\u7c73\u8def\u4e8c\u6bb5221\u865f', lat:25.1585809, lng:121.4304577, group:'5star',
        detail:'\u570b\u7522\u5efa\u6750\uff5c\u516b\u91cc\u5ee0', relations:null },
      { name:'\u570b\u7522\u5efa\u6750\u5be6\u696d\uff08\u57fa\u9686\u5ee0\uff09', addr:'\u57fa\u9686\u5e02', lat:25.1283, lng:121.7415, group:'5star',
        detail:'\u570b\u7522\u5efa\u6750\uff5c\u57fa\u9686\u5ee0', relations:null },
      { name:'\u4e9e\u6771\u9810\u62cc\u6df7\u51dd\u571f\uff08\u6c50\u6b62\u5ee0\uff09', addr:'\u6c50\u6b62\u5340\u5927\u540c\u8def\u4e00\u6bb5138\u865f', lat:25.0558581, lng:121.6314672, group:'5star',
        detail:'\u9060\u6771\u96c6\u5718/\u4e9e\u6ce5100%\u6301\u80a1\uff5c\u8cc7\u672c\u984d20\u5104\uff5c\u5168\u53f026\u5ee0\uff5c\u8ca0\u8cac\u4eba\u674e\u5764\u708e', relations:null },
      { name:'\u4e9e\u6771\u9810\u62cc\u6df7\u51dd\u571f\uff08\u571f\u57ce\u5ee0\uff09', addr:'\u571f\u57ce\u5340\u4e2d\u83ef\u8def\u4e8c\u6bb5208\u865f', lat:24.9691936, lng:121.4373806, group:'5star',
        detail:'\u9060\u6771\u96c6\u5718/\u4e9e\u6ce5\uff5c\u5ee0\u9577\u6731\u6587\u58fd', relations:null },
      { name:'\u53f0\u7063\u6c34\u6ce5\u53f0\u5317\u6c34\u6ce5\u88fd\u54c1\u5ee0', addr:'\u6c50\u6b62\u5340\u5927\u540c\u8def\u4e00\u6bb5310\u865f', lat:25.0580012, lng:121.6371891, group:'5star',
        detail:'\u53f0\u6ce5\u96c6\u57181101\uff5c\u8cc7\u672c\u984d1,000\u5104\uff5c\u5ee0\u9577\u9673\u7af9\u6751\uff5c1\u5957\u62cc\u548c\u8a2d\u5099', relations:null },
      { name:'\u529b\u6cf0\u5efa\u8a2d\u4f01\u696d\uff08\u58eb\u6797\u5ee0\uff09', addr:'\u58eb\u6797\u5340\u5ef6\u5e73\u5317\u8def\u4e03\u6bb57\u865f', lat:25.1007798, lng:121.4902192, group:'4star',
        detail:'\u4e0a\u67dc5520\uff5c\u8cc7\u672c\u984d7.38\u5104\uff5c\u8ca0\u8cac\u4eba\u5433\u826f\u6750\uff5c\u5317\u90e8\u6700\u5927\u7368\u7acb\u696d\u8005', relations:null },
      { name:'\u529b\u6cf0\u5efa\u8a2d\u4f01\u696d\uff08\u6c50\u6b62\u5ee0\uff09', addr:'\u6c50\u6b62\u5340\u6a1f\u6811\u4e8c\u8def43\u865f', lat:25.0621481, lng:121.6396738, group:'4star',
        detail:'\u529b\u6cf0\u5efa\u8a2d\u6c50\u6b62\u5ee0', relations:null },
      { name:'\u5e78\u5b5a\u9810\u62cc\u6df7\u51dd\u571f\uff08\u571f\u57ce\u5ee0\uff09', addr:'\u571f\u57ce\u5340\u4e2d\u83ef\u8def\u4e00\u6bb5162\u865f', lat:24.9835398, lng:121.4415041, group:'4star',
        detail:'\u5e78\u798f\u6c34\u6ce5\u95dc\u4fc2\uff5c\u8cc7\u672c\u984d8.8\u5104\uff5c\u8ca0\u8cac\u4eba\u9673\u97fb\u5982\uff5c\u6a39\u6797+\u4e94\u80a1+\u6c50\u6b62+\u57fa\u9686\u51715\u5ee0', relations:null },
      { name:'\u5e78\u5b5a\u9810\u62cc\u6df7\u51dd\u571f\uff08\u57fa\u9686\u5ee0\uff09', addr:'\u57fa\u9686\u5e02\u4e03\u5835\u5340\u516b\u5fb7\u8def2-10\u865f', lat:25.1128261, lng:121.7276096, group:'4star',
        detail:'\u5e78\u798f\u6c34\u6ce5\u95dc\u4fc2\uff5c\u57fa\u9686\u4e03\u5835', relations:null },
      { name:'\u4fe1\u4e00\u9810\u62cc\u6df7\u51dd\u571f', addr:'\u4e2d\u6b63\u5340\u5bf6\u6176\u8def37\u865f8\u6a13', lat:25.041485, lng:121.5103107, group:'3star',
        detail:'\u8cc7\u672c\u984d1.1\u5104\uff5c1990\u5e74\uff5c\u8ca0\u8cac\u4eba\u694a\u667a\u96c4\uff5c\u4fe1\u5927\u6c34\u6ce5\u95dc\u4fc2', relations:null },
      { name:'\u5408\u8208\u9810\u62cc\u6df7\u51dd\u571f\uff08\u4e09\u5cef\u5ee0\uff09', addr:'\u4e09\u5cef\u5340\u4e2d\u6b63\u8def\u4e09\u6bb5196\u865f', lat:24.9040392, lng:121.3503511, group:'3star',
        detail:'\u8cc7\u672c\u984d4,500\u842c\uff5c1992\u5e74\uff5c\u8ca0\u8cac\u4eba\u9127\u6842\u82f1\uff5cGRMC\u8a8d\u8b49', relations:null },
      { name:'\u5927\u8c61\u5be6\u696d', addr:'\u6c50\u6b62\u5340\u74b0\u6cb3\u8857126\u865f', lat:25.0593311, lng:121.6293336, group:'3star',
        detail:'\u8cc7\u672c\u984d4,189\u842c\uff5c1995\u5e74\uff5c\u8ca0\u8cac\u4eba\u8b1d\u82f1\u7f8e\uff5cGRMC\u8a8d\u8b49', relations:null },
      { name:'\u53f0\u7522\u5be6\u696d', addr:'\u6c50\u6b62\u5340\u4fdd\u65b0\u8857133-1\u865f', lat:25.0723776, lng:121.6859409, group:'3star',
        detail:'\u8cc7\u672c\u984d2.2\u5104\uff5c1994\u5e74\uff5c\u8ca0\u8cac\u4eba\u8521\u5efa\u5ead', relations:null },
      { name:'\u967d\u660e\u6df7\u51dd\u571f', addr:'\u91d1\u5c71\u5340\u5357\u52e2\u6e5641\u865f', lat:25.216642, lng:121.615173, group:'3star',
        detail:'\u8cc7\u672c\u984d2,000\u842c\uff5c1994\u5e74\uff5c\u8ca0\u8cac\u4eba\u90ed\u6dd1\u5982\uff5c\u5317\u6d77\u5cb8', relations:null },
      { name:'\u5927\u6f22\u9810\u62cc\u5ee0', addr:'\u6cf0\u5c71\u5340\u4e2d\u6e2f\u5357\u8def310\u865f1\u6a13', lat:25.0566066, lng:121.4380565, group:'2star',
        detail:'\u8cc7\u672c\u984d2,000\u842c\uff5c1987\u5e74\uff5c\u8ca0\u8cac\u4eba\u8521\u9326\u9054', relations:null },
      { name:'\u5b85\u8fb0\u8208\u696d', addr:'\u9d09\u6b4c\u5340\u4e2d\u6b63\u4e09\u8def156\u5df726\u5c422\u6a13', lat:24.9411175, lng:121.3384942, group:'3star',
        detail:'\u8cc7\u672c\u984d4\u5104\uff5c2016\u5e74\uff5c\u8ca0\u8cac\u4eba\u85cd\u968a\u5bec', relations:null },
      { name:'\u806f\u8208\u5efa\u6750\u5de5\u696d', addr:'\u65b0\u5e97\u5340\u5b89\u548c\u8def\u4e8c\u6bb5146\u5df730\u865f', lat:24.9719822, lng:121.5194806, group:'2star',
        detail:'\u7368\u7acb\uff5c\u65b0\u5e97', relations:null },
      { name:'\u5bcc\u54c1\u6df7\u51dd\u571f\u5de5\u696d', addr:'\u8ca2\u5bee\u5340\u5ef6\u5e73\u8857177\u865f', lat:25.0569387, lng:121.9246477, group:'2star',
        detail:'\u7368\u7acb\uff5c\u6771\u5317\u89d2', relations:null }
    ]
  }`;

html = html.replace(oldBlock, newBlock);
fs.writeFileSync('output/\u5168\u53f0\u9810\u62cc\u6df7\u51dd\u571f\u5ee0\u5730\u5716.html', html, 'utf8');
console.log('Replacements:', html.split(oldBlock).length - 1);
console.log('Done: file length now', html.length);

const v = fs.readFileSync('output/\u5168\u53f0\u9810\u62cc\u6df7\u51dd\u571f\u5ee0\u5730\u5716.html', 'utf8');
const count = (v.match(/group:'\dst'/g) || []).length;
console.log('Total marker groups:', count);
