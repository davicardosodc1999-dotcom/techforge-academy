$ErrorActionPreference = "Continue"
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " FINAL WEBSITE QA - VERSION 1.0" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$root = Get-Location
$html = Get-ChildItem . -File -Filter *.html
$all = Get-ChildItem . -Recurse -File

function Count-Matches($pattern) {
    return @(Select-String -Path ($all | Where-Object {$_.Extension -in '.html','.js','.txt','.xml'}).FullName -Pattern $pattern -CaseSensitive:$false -ErrorAction SilentlyContinue).Count
}

Write-Host "HTML PAGES: $($html.Count)"
Write-Host "PDF FILES: $((Get-ChildItem .\downloads -Recurse -File -Filter *.pdf -ErrorAction SilentlyContinue).Count)"
Write-Host "SITEMAP: $((Test-Path .\sitemap.xml))"
Write-Host "ROBOTS: $((Test-Path .\robots.txt))"
Write-Host "WEBMANIFEST: $((Test-Path .\site.webmanifest))"
Write-Host "CLIENT EMAIL: $(Count-Matches 'juarezimoveispronto@gmail.com') occurrence(s)"
Write-Host ""

$portuguese = 'você|voce|consertei|manutenção|módulos|aulas|ferramentas|diagnóstico|eletrônica|trilha|certificado|graduação|conteúdo|conclusão|nível|privacidade|termos|ajuda|explorar|cursos gratuitos|entenda|execute procedimentos|confirme funcionamento'
$pt = Select-String -Path ($all | Where-Object {$_.Extension -in '.html','.js'}).FullName -Pattern $portuguese -CaseSensitive:$false -ErrorAction SilentlyContinue
Write-Host "PORTUGUESE SUSPECTS: $($pt.Count)" -ForegroundColor $(if($pt.Count -eq 0){'Green'}else{'Yellow'})

$placeholders = Select-String -Path ($all | Where-Object {$_.Extension -in '.html','.js','.json','.xml','.txt'}).FullName -Pattern 'PLATFORM NAME|YOUR-DOMAIN\.com' -CaseSensitive:$false -ErrorAction SilentlyContinue
Write-Host "FINAL BRAND/DOMAIN PLACEHOLDERS: $($placeholders.Count)" -ForegroundColor $(if($placeholders.Count -eq 0){'Green'}else{'Yellow'})

$dead = Select-String -Path $html.FullName -Pattern 'href\s*=\s*["'']#["'']' -CaseSensitive:$false -ErrorAction SilentlyContinue
Write-Host "DEAD href=# LINKS: $($dead.Count)" -ForegroundColor $(if($dead.Count -eq 0){'Green'}else{'Yellow'})

$broken = @()
foreach($file in $html){
    $content = Get-Content $file.FullName -Raw
    $matches = [regex]::Matches($content,'href=["'']([^"'']+)["'']')
    foreach($m in $matches){
        $href = $m.Groups[1].Value
        if($href -match '^(https?://|mailto:|tel:|#|javascript:)'){ continue }
        $clean = ($href -split '[?#]')[0]
        if([string]::IsNullOrWhiteSpace($clean)){ continue }
        $target = Join-Path $file.DirectoryName $clean
        if(!(Test-Path $target)){
            $broken += "$($file.Name) -> $href"
        }
    }
}
Write-Host "BROKEN INTERNAL HREFS: $($broken.Count)" -ForegroundColor $(if($broken.Count -eq 0){'Green'}else{'Red'})

$missingSrc = @()
foreach($file in $html){
    $content = Get-Content $file.FullName -Raw
    $matches = [regex]::Matches($content,'src=["'']([^"'']+)["'']')
    foreach($m in $matches){
        $src = $m.Groups[1].Value
        if($src -match '^(https?://|data:)'){ continue }
        $clean = ($src -split '[?#]')[0]
        if([string]::IsNullOrWhiteSpace($clean)){ continue }
        $target = Join-Path $file.DirectoryName $clean
        if(!(Test-Path $target)){
            $missingSrc += "$($file.Name) -> $src"
        }
    }
}
Write-Host "MISSING LOCAL SRC FILES: $($missingSrc.Count)" -ForegroundColor $(if($missingSrc.Count -eq 0){'Green'}else{'Red'})

Write-Host "`n--- DETAILS ---" -ForegroundColor Cyan
if($pt.Count -gt 0){ Write-Host "`nPortuguese suspects:" -ForegroundColor Yellow; $pt | Select-Object Path,LineNumber,Line | Format-Table -Wrap }
if($placeholders.Count -gt 0){ Write-Host "`nBrand/domain placeholders (expected until client/domain are defined):" -ForegroundColor Yellow; $placeholders | Select-Object Path,LineNumber,Line | Format-Table -Wrap }
if($dead.Count -gt 0){ Write-Host "`nDead # links:" -ForegroundColor Yellow; $dead | Select-Object Path,LineNumber,Line | Format-Table -Wrap }
if($broken.Count -gt 0){ Write-Host "`nBroken hrefs:" -ForegroundColor Red; $broken | ForEach-Object {Write-Host $_} }
if($missingSrc.Count -gt 0){ Write-Host "`nMissing src files:" -ForegroundColor Red; $missingSrc | ForEach-Object {Write-Host $_} }

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " QA FINISHED" -ForegroundColor Green
Write-Host "========================================"
