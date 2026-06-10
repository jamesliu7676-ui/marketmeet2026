# Read JSON manually
$json = Get-Content "output/nominatim-geocoding-results.json" -Raw -Encoding UTF8

# Parse using regex since ConvertFrom-Json has BOM issues
$html = Get-Content "output/全台預拌混凝土廠地圖.html" -Raw -Encoding UTF8

$count = 0
$json | Select-String '"lat": ([0-9.]+), "lng": ([0-9.]+)' | ForEach-Object {
  $count++
}
Write-Host "Found  coordinate pairs"
