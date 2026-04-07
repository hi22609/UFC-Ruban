# RUBAN Server - Deploy to Railway
# This script pushes your Stripe-ready server to Railway

$repoUrl = "https://github.com/hi22609/UFC-Ruban.git"
$serverPath = "C:\Users\owedo\.openclaw\workspace\ruban-server"

Write-Host "🚀 Deploying RUBAN Server to Railway..." -ForegroundColor Cyan

# Step 1: Ensure all files are committed
cd $serverPath
git add .
git commit -m "deploy: Stripe webhook server ready for production"
git push origin main

# Step 2: Install Railway CLI if not present
if (!(Get-Command railway -ErrorAction SilentlyContinue)) {
    Write-Host "Installing Railway CLI..." -ForegroundColor Yellow
    npm install -g @railway/cli
}

# Step 3: Login to Railway
Write-Host "`n🔑 Login to Railway (browser will open)..." -ForegroundColor Yellow
railway login

# Step 4: Link or create project
Write-Host "`n🔗 Linking to Railway project..." -ForegroundColor Yellow
# Note: You'll need to select/create project in browser

# Step 5: Deploy
Write-Host "`n📦 Deploying..." -ForegroundColor Green
railway up

Write-Host "`n✅ Deploy complete!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Copy your Railway URL from the output above"
Write-Host "2. Go to Stripe Dashboard → Destinations → Edit your destination"
Write-Host "3. Update Endpoint URL to: https://YOUR-RAILWAY-URL.up.railway.app/api/stripe/webhook"
Write-Host "4. Test with a real payment!"
