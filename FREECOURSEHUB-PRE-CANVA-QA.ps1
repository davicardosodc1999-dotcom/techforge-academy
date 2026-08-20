Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " FREECOURSEHUB PRE-CANVA QA" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$lessons=@()
foreach($c in @("android","iphone","laptop","diagnostics","electronics")){
  $lessons += Get-ChildItem ".\lesson-$c-*.html" -File -ErrorAction SilentlyContinue
}

$domainHits=(Select-String -Path (Get-ChildItem . -Recurse -File | Where-Object {$_.Extension -in ".html",".xml",".txt",".json",".js"}).FullName -Pattern "YOUR-DOMAIN.com" -SimpleMatch -ErrorAction SilentlyContinue).Count
$imageSlots=(Select-String -Path $lessons.FullName -Pattern "instructional-step-image" -SimpleMatch -ErrorAction SilentlyContinue).Count
$adSlots=(Select-String -Path $lessons.FullName -Pattern "adsense-ready-slot" -SimpleMatch -ErrorAction SilentlyContinue).Count
$oldStats=(Select-String -Path .\index.html -Pattern "5 MODULES|6 MODULES|7 MODULES|15 LESSONS|18 LESSONS|20 LESSONS|22 LESSONS|24 LESSONS" -ErrorAction SilentlyContinue).Count

Write-Host "PUBLIC LESSONS: $($lessons.Count)"
Write-Host "DOMAIN PLACEHOLDERS: $domainHits"
Write-Host "IMAGE SLOTS: $imageSlots"
Write-Host "LESSON AD SLOTS: $adSlots"
Write-Host "OLD HOME STATS: $oldStats"
Write-Host "SITEMAP: https://freecoursehub.com/sitemap.xml"
Write-Host "`nCANVA COURSE: PENDING (FINAL COURSE)" -ForegroundColor Yellow
Write-Host "========================================"
