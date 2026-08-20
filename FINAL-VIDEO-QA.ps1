Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " FREECOURSEHUB FINAL VIDEO QA" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$files=@()
foreach($c in @("android","iphone","laptop","diagnostics","electronics","canva")){
  $files += Get-ChildItem ".\lesson-$c-*.html" -File -ErrorAction SilentlyContinue
}

$ids=@()
$fallback=@()
foreach($f in $files){
  $t=Get-Content $f.FullName -Raw
  if($t -match "Find a tutorial for"){ $fallback += $f.Name }
  $m=[regex]::Matches($t,'youtube\.com/embed/([A-Za-z0-9_-]{11})')
  foreach($x in $m){ $ids += $x.Groups[1].Value }
}

Write-Host "LESSONS: $($files.Count)"
Write-Host "YOUTUBE EMBEDS: $($ids.Count)"
Write-Host "UNIQUE VIDEO IDS: $(($ids | Sort-Object -Unique).Count)"
Write-Host "TEMPORARY SEARCH BUTTONS: $($fallback.Count)"

if($fallback.Count -gt 0){
  Write-Host "`nStill missing:" -ForegroundColor Yellow
  $fallback | ForEach-Object { Write-Host $_ -ForegroundColor Yellow }
}

Write-Host "`n========================================"
