Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " TECHFORGE PDF + CERTIFICATE QA" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
$lessons=@(); foreach($c in @("android","iphone","laptop","diagnostics","electronics")){$lessons+=Get-ChildItem ".\lesson-$c-*.html" -File -ErrorAction SilentlyContinue}
$pdfLinks=0;$broken=0
foreach($f in $lessons){$m=[regex]::Matches((Get-Content $f.FullName -Raw),'href=["'']([^"'']+\.pdf)["'']');foreach($x in $m){$pdfLinks++;if(!(Test-Path $x.Groups[1].Value)){$broken++;Write-Host "BROKEN: $($f.Name) -> $($x.Groups[1].Value)" -ForegroundColor Red}}}
$pdfCount=(Get-ChildItem .\downloads\lesson-pdfs\smartphone-repair-lesson-*.pdf -File -ErrorAction SilentlyContinue).Count+(Get-ChildItem .\downloads\iphone\iphone-module-*.pdf -File -ErrorAction SilentlyContinue).Count+(Get-ChildItem .\downloads\laptops\laptop-module-*.pdf -File -ErrorAction SilentlyContinue).Count+(Get-ChildItem .\downloads\diagnostics\diagnostics-module-*.pdf -File -ErrorAction SilentlyContinue).Count+(Get-ChildItem .\downloads\electronics\electronics-module-*.pdf -File -ErrorAction SilentlyContinue).Count
Write-Host "PUBLIC MODULES: $($lessons.Count)";Write-Host "PUBLIC PDFs: $pdfCount";Write-Host "PDF DOWNLOAD LINKS: $pdfLinks";Write-Host "BROKEN PDF LINKS: $broken"
Write-Host "CERTIFICATE BRAND: $((Select-String -Path .\certificate.html,.\certificate-preview.html -Pattern 'TechForge Academy' -SimpleMatch -ErrorAction SilentlyContinue).Count)"
