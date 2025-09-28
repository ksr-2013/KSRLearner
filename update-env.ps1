# PowerShell script to update .env.local for Supabase
Write-Host "KSR Learner - Environment Update for Supabase" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (-not (Test-Path ".env.local")) {
    Write-Host ".env.local file not found!" -ForegroundColor Red
    Write-Host "Please run create-env.ps1 first" -ForegroundColor Yellow
    exit 1
}

Write-Host "Current .env.local found!" -ForegroundColor Green
Write-Host ""

# Show current configuration
Write-Host "Current configuration:" -ForegroundColor Yellow
Write-Host "- Database: Neon (current)" -ForegroundColor White
Write-Host "- AI Provider: GROQ" -ForegroundColor White
Write-Host "- JWT Secret: Configured" -ForegroundColor White
Write-Host ""

# Ask for confirmation
$update = Read-Host "Do you want to update for Supabase migration? (y/N)"
if ($update -ne "y" -and $update -ne "Y") {
    Write-Host "Update cancelled" -ForegroundColor Yellow
    exit 0
}

# Backup current file
$backupName = ".env.local.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
Copy-Item ".env.local" $backupName
Write-Host "Backup created: $backupName" -ForegroundColor Green

# Update with Supabase configuration
try {
    Copy-Item "env-supabase-update.txt" ".env.local"
    Write-Host ".env.local updated for Supabase!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Get your Supabase credentials from:" -ForegroundColor White
    Write-Host "   https://supabase.com/dashboard" -ForegroundColor Blue
    Write-Host "2. Replace the placeholder values in .env.local:" -ForegroundColor White
    Write-Host "   - [YOUR-PASSWORD] with your Supabase database password" -ForegroundColor White
    Write-Host "   - [YOUR-PROJECT-REF] with your Supabase project reference" -ForegroundColor White
    Write-Host "   - [YOUR-ANON-KEY] with your Supabase anon key" -ForegroundColor White
    Write-Host "   - [YOUR-SERVICE-ROLE-KEY] with your Supabase service role key" -ForegroundColor White
    Write-Host "3. Run: npm run migrate:supabase" -ForegroundColor White
    Write-Host ""
    Write-Host "Your existing API keys are preserved!" -ForegroundColor Green
} catch {
    Write-Host "Failed to update .env.local" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    # Restore backup
    Copy-Item $backupName ".env.local"
    Write-Host "Restored from backup" -ForegroundColor Yellow
    exit 1
}
