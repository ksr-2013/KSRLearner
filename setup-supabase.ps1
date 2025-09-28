# PowerShell script to set up Supabase migration
# Run this script after creating your Supabase project

Write-Host "🚀 KSR Learner - Supabase Setup Script" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "✅ .env.local file found" -ForegroundColor Green
} else {
    Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    Write-Host "📝 Please create .env.local with your Supabase configuration first." -ForegroundColor Yellow
    Write-Host "📖 See SUPABASE_MIGRATION_GUIDE.md for details." -ForegroundColor Yellow
    exit 1
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "📥 Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔄 Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🔄 Running Supabase migration..." -ForegroundColor Yellow
npm run migrate:supabase

Write-Host ""
Write-Host "🎉 Supabase setup completed!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Test your application: npm run dev" -ForegroundColor White
Write-Host "   2. Open Prisma Studio: npm run db:studio" -ForegroundColor White
Write-Host "   3. Check Supabase dashboard for your data" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Useful links:" -ForegroundColor Cyan
Write-Host "   - Supabase Dashboard: https://supabase.com/dashboard" -ForegroundColor White
Write-Host "   - Migration Guide: SUPABASE_MIGRATION_GUIDE.md" -ForegroundColor White
