# Replace fighter SVGs with modern CSS art
$filePath = "C:\Users\owedo\.openclaw\workspace\ruban-work\ufc-ruban\website\index.html"
$content = Get-Content $filePath -Raw

# New fighter visual (CSS-based, modern silhouette)
$newFighterVisual = @'
<div class="fighter-visual fighter-visual--topuria">
  <div class="fighter-silhouette"></div>
  <div class="fighter-glow"></div>
</div>
'@

# Find and replace Topuria's SVG (first <svg> block)
$pattern = '<svg class="fighter-svg fighter-svg--topuria".*?</svg>'
$content = $content -replace $pattern, $newFighterVisual, 1

Write-Host "Updated fighter visuals"
Write-Host "File: $filePath"
