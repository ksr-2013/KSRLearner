# Fix Vapi API Key Script
Write-Host "🔧 Fixing Vapi API Key Configuration" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Current issue: You have an Assistant ID, but need an API Key" -ForegroundColor Yellow
Write-Host "Assistant ID: 0d4355fc-21b1-40c0-939b-b1b5a3709b36" -ForegroundColor Gray
Write-Host "API Key format: vapi_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" -ForegroundColor Green

Write-Host ""
Write-Host "Step 1: Get your Vapi API Key" -ForegroundColor Yellow
Write-Host "1. Go to: https://dashboard.vapi.ai/" -ForegroundColor White
Write-Host "2. Sign in to your account" -ForegroundColor White
Write-Host "3. Look for 'API Keys' or 'Settings' section" -ForegroundColor White
Write-Host "4. Create a new API key (starts with 'vapi_')" -ForegroundColor White
Write-Host "5. Copy the API key" -ForegroundColor White

Write-Host ""
$apiKey = Read-Host "Enter your Vapi API key (starts with 'vapi_')"

if ($apiKey -and $apiKey.StartsWith("vapi_")) {
    Write-Host ""
    Write-Host "✅ Valid API key format!" -ForegroundColor Green
    
    # Update the .env.local file
    $envPath = ".env.local"
    if (Test-Path $envPath) {
        $content = Get-Content $envPath -Raw
        
        # Replace the Vapi API keys
        $content = $content -replace "NEXT_PUBLIC_VAPI_API_KEY=.*", "NEXT_PUBLIC_VAPI_API_KEY=$apiKey"
        $content = $content -replace "VAPI_API_KEY=.*", "VAPI_API_KEY=$apiKey"
        
        $content | Out-File -FilePath $envPath -Encoding UTF8
        
        Write-Host "✅ Environment file updated!" -ForegroundColor Green
        Write-Host "✅ New API key configured: $($apiKey.Substring(0, 15))..." -ForegroundColor Green
        
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Restart your development server (Ctrl+C then npm run dev)" -ForegroundColor White
        Write-Host "2. Test the voice agent at: http://localhost:3000/voice-agent" -ForegroundColor White
        
    } else {
        Write-Host "❌ .env.local file not found!" -ForegroundColor Red
    }
    
} else {
    Write-Host ""
    Write-Host "❌ Invalid API key format!" -ForegroundColor Red
    Write-Host "Vapi API keys must start with 'vapi_'" -ForegroundColor Red
    Write-Host "Please get a valid API key from: https://dashboard.vapi.ai/" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
