# PowerShell script to create .env.local file
Write-Host "KSR Learner - Environment File Creator" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local already exists
if (Test-Path ".env.local") {
    Write-Host ".env.local already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
    if ($overwrite -ne "y" -and $overwrite -ne "Y") {
        Write-Host "Operation cancelled" -ForegroundColor Red
        exit 0
    }
}

# Copy template to .env.local
try {
    Copy-Item "env-template.txt" ".env.local"
    Write-Host ".env.local file created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "   1. Open .env.local in your editor" -ForegroundColor White
    Write-Host "   2. Replace placeholder values with your actual credentials" -ForegroundColor White
    Write-Host "   3. Get your Supabase credentials from:" -ForegroundColor White
    Write-Host "      https://supabase.com/dashboard" -ForegroundColor Blue
    Write-Host "   4. Run: npm run migrate:supabase" -ForegroundColor White
    Write-Host ""
    Write-Host "Required Supabase credentials:" -ForegroundColor Yellow
    Write-Host "   - Database password" -ForegroundColor White
    Write-Host "   - Project reference ID" -ForegroundColor White
    Write-Host "   - Anon public key" -ForegroundColor White
    Write-Host "   - Service role key" -ForegroundColor White
} catch {
    Write-Host "Failed to create .env.local file" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
