# Add missing sections to index.html
$filePath = "index.html"
$content = Get-Content $filePath -Raw

# Add sections before </body>
$sections = @'
<!-- ADDED BY SCRIPT - Missing sections for nav links -->
<section id="picks" style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#080810;"><div><h1 style="font-family:'Bebas Neue',sans-serif;font-size:4rem;color:#A855F7;margin:0;">🔒 PREMIUM PICKS</h1><p style="color:#fff;font-size:1.2rem;">Daily UFC picks with 67% accuracy</p></div></section>
<section id="api" style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0D0D1A;"><div><h1 style="font-family:'Bebas Neue',sans-serif;font-size:4rem;color:#C026D3;margin:0;">🤖 API ACCESS</h1><p style="color:#fff;font-size:1.2rem;">Get real-time fight predictions</p></div></section>
<section id="about" style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#080810;"><div><h1 style="font-family:'Bebas Neue',sans-serif;font-size:4rem;color:#A855F7;margin:0;">👤 ABOUT RUBAN</h1><p style="color:#fff;font-size:1.2rem;">AI-powered UFC predictions built by fighters, for fighters</p></div></section>
<section id="methodology" style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0D0D1A;"><div><h1 style="font-family:'Bebas Neue',sans-serif;font-size:4rem;color:#C026D3;margin:0;">📊 METHODOLOGY</h1><p style="color:#fff;font-size:1.2rem;">67% accuracy using ELO + sharp money + ML</p></div></section>
<section id="results" style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#080810;"><div><h1 style="font-family:'Bebas Neue',sans-serif;font-size:4rem;color:#A855F7;margin:0;">🏆 TRACK RECORD</h1><p style="color:#fff;font-size:1.2rem;">Live results - 67% over 200+ fights</p></div></section>
<section id="contact" style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0D0D1A;"><div><h1 style="font-family:'Bebas Neue',sans-serif;font-size:4rem;color:#C026D3;margin:0;">📬 CONTACT</h1><p style="color:#fff;font-size:1.2rem;">DM @yinzercoin on Telegram</p></div></section>
<section id="terms" style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#080810;"><div><h1 style="font-family:'Bebas Neue',sans-serif;font-size:4rem;color:#A855F7;margin:0;">📜 TERMS</h1><p style="color:#fff;font-size:1.2rem;">No refunds. For entertainment only.</p></div></section>
<section id="privacy" style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0D0D1A;"><div><h1 style="font-family:'Bebas Neue',sans-serif;font-size:4rem;color:#C026D3;margin:0;">🔒 PRIVACY</h1><p style="color:#fff;font-size:1.2rem;">We don't sell your data. Ever.</p></div></section>
<section id="responsible" style="min-height:100vh;display:flex;align-items:center;justify-content:center;background:#080810;"><div><h1 style="font-family:'Bebas Neue',sans-serif;font-size:4rem;color:#A855F7;margin:0;">⚠️ RESPONSIBLE BETTING</h1><p style="color:#fff;font-size:1.2rem;">Never bet money you can't afford to lose.</p></div></section>
</body>
'@

$content = $content -replace '</body>', $sections
Set-Content $filePath $content -NoNewline
Write-Host "✅ Sections added to $filePath"
