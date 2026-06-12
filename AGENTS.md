## Goal
- 建立全省預拌混凝土同業競爭力調查專案，涵蓋廠址地圖標示與市場競爭態勢分析

## Constraints & Preferences
- 同一公司於區域內若有二個以上廠亦分別標示
- 違規事項、死亡/受傷事件、抗爭事件皆不揭露展示
- 全台佈點及全國性大廠不用展現董監事關係圖譜
- 懸浮顯示廠名（滑鼠移到點上才浮現名稱），不用永久標籤
- 董監事節點用黃色，關係企業用灰色
- 圖框需容納所有關係企業，無捲動
- 道路精確度：改用國土測繪圖資服務雲 (NLSC) 為預設圖磚，保留 OpenStreetMap 為切換選項

## Progress
### Done
- 專案初始化：AGENTS.md、Git repo、GitHub、Obsidian 工作筆記
- 花蓮全縣（北區 12 家 + 中南區 6 家營業中 + 3 家已停業）業者資料整理與地圖標示（`output/花蓮預拌混凝土廠地圖.html`）
- 花蓮競爭力簡報 9 頁（`output/花蓮競爭力簡報.html`）— 含地圖、比較表、Chart.js 圖表、力導向可拖曳董監事圖譜
- 花蓮 CSV 與綜合報告（`data/花蓮北區業者.csv`、`data/花蓮中南區業者.csv`、`data/花蓮地區業者一覽.md`）
- 宜蘭地區 8 家業者（宜興 4 廠、台泥、久屋、立泰、享正、得福、福得、潤泰）資料調查 + 地圖 + 簡報 + CSV
- 北區（台北/新北/基隆）32 家業者資料調查，21 處標點上線（`output/全台預拌混凝土廠地圖.html` 北區頁籤）
- 全台地圖 11 區域下拉選單切換（`output/全台預拌混凝土廠地圖.html`）
- GitHub Pages 啟用，repo 設為公開
- 44 處廠址經緯度重新定位（Nominatim geocoding via Node.js，避免 PowerShell 編碼損毀）
- 全台/花蓮/宜蘭地圖與簡報共 5 個 HTML 檔案因 PowerShell 編碼損毀，已從 git 原件還原並用 Node.js 重新套用座標更新
- NLSC 圖磚切換套用至全部 5 檔（使用 Node.js replace script）
- 「全台概覽」選項修復（動態合併所有非 1-star 標點）
- 北區 21 處標點資料重新套用至全台地圖
- 修復 `{ name:'` 重複前綴 bug（全台地圖 JS parse error），補回幸孚土城廠
- 新增龍形企業（八里廠）— 資本額8,000萬｜1991年｜施阿祥｜ISO-9001｜捷運局合格｜3star
- **桃園地區 17 處標點上線**：國產建材2廠、亞東4廠、台泥3廠、新三亞、慶龍、國普、國順龍華廠、大園、慶隆、武雄觀音廠、慶皇水泥，含國順董監事圖譜

### In Progress
- (none)

### Blocked
- (none)

## Key Decisions
- 董監事關係圖譜只顯示三星（含）以下業者，五星（亞東、台泥）及四星（鳳勝）不顯示
- 改用 force-directed 可拖曳圖譜取代靜態 SVG 樹狀圖
- 圖譜配色：公司藍色、董監事黃色、關係企業灰色，字號加大（15/14/13）
- 圖框尺寸 800×480 無捲動，popup 820×600
- 比較表字體放大至 16px（內文）/ 14px（標題）
- 鳯勝銷售表現在比較表以「70,000 + 44,728（自售 + 台泥代工）」呈現
- 移除星等綜合評比頁（簡報由 10 頁縮為 9 頁）
- 花蓮以壽豐溪分南北區，北區月銷量 45K–50K m³（集團主導），中南區 ~20K m³（在地小廠）
- 改用 NLSC 國土測繪圖資服務雲為預設圖磚（臺灣道路精確度最高），保留 OpenStreetMap 為備選
- 地圖經緯度更新需用 Node.js (`fs.readFileSync/writeFileSync` with 'utf8')，禁用 PowerShell `[System.IO.File]::WriteAllText` 以避免 UTF-8 編碼損毀

## Next Steps
- 確認 GitHub Pages 部署後無亂碼
- 逐步加入桃園、新竹苗栗等其他縣市區域資料

## Critical Context
- 地圖用 Leaflet.js，使用 NLSC（國土測繪圖資服務雲）為預設圖磚，OSM 為備選
- NLSC tiles URL: `https://wmts.nlsc.gov.tw/wmts/EMAP/default/GoogleMapsCompatible/{z}/{y}/{x}`
- 所有 PowerShell `[System.IO.File]::WriteAllText` 操作曾造成 UTF-8 中文損毀，已全面改用 Node.js fs 模組
- GitHub Pages 公開網址：https://jamesliu7676-ui.github.io/marketmeet2026/output/全台預拌混凝土廠地圖.html
- 友正集團關係圖：方來興→友誠、友砂、友正貨運、友華加油站；陳東堯→花建實業、友正預拌（監察人）；馮志緯→友正預拌（董事長）
- 宜興集團關係圖：李興和（董事長）→武雄實業、梅洲混凝土、藍園營造、蘇澳石礦；林贊壽（董事）→梅洲混凝土（董事長）、靖瑋營造、蘇澳石礦（負責人）
- 得福/福得連家網絡：連志峯（得福董事長/福得董事）、吳智翔（福得董事長/得福董事）、薛豐文（得福監察人/福得董事）
- 北區龍頭：國產建材（2504）7 廠、亞東預拌（遠東/亞泥）2 廠、台泥 1 廠、力泰建設（5520）2 廠、幸孚（幸福水泥）5 廠、和昌國際工業（4.85億）2 廠、龍形企業（8,000萬）八里廠

## Relevant Files
- `D:\James-opencode\marketmeet2026\output\花蓮競爭力簡報.html`: 9 頁互動簡報，GitHub Pages 公開
- `D:\James-opencode\marketmeet2026\output\花蓮預拌混凝土廠地圖.html`: 花蓮 18 廠 Leaflet 地圖
- `D:\James-opencode\marketmeet2026\output\宜蘭競爭力簡報.html`: 宜蘭 9 頁互動簡報
- `D:\James-opencode\marketmeet2026\output\宜蘭預拌混凝土廠地圖.html`: 宜蘭 12 處標點地圖
- `D:\James-opencode\marketmeet2026\output\全台預拌混凝土廠地圖.html`: 全台 11 區域選單地圖（含北區 23 處標點、NLSC 圖磚、董監事圖譜）
- `D:\James-opencode\marketmeet2026\data\花蓮北區業者.csv`: 花蓮北區 11 家
- `D:\James-opencode\marketmeet2026\data\花蓮中南區業者.csv`: 花蓮中南區 9 家（含 3 家停業）
- `D:\James-opencode\marketmeet2026\data\宜蘭地區業者.csv`: 宜蘭 8 家
- `D:\James-opencode\marketmeet2026\data\北區業者.csv`: 北區 33 家
- `D:\James-opencode\marketmeet2026\data\花蓮地區業者一覽.md`: 綜合報告（含花蓮、宜蘭、北區章節）
- `D:\James-opencode\marketmeet2026\scripts\update_coords.js`: Node.js 座標批次更新腳本
- `D:\James-opencode\marketmeet2026\scripts\apply_nlsc.js`: NLSC 圖磚切換腳本
- `D:\James-opencode\marketmeet2026\AGENTS.md`: 專案設定
- `D:\James-opencode\marketmeet2026\專案\marketmeet2026-工作筆記.md`: Obsidian 工作筆記
