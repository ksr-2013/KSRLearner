# Vapi.ai Voice Agent Setup Script
# This script will help you configure the Vapi API key

Write-Host "🎤 Vapi.ai Voice Agent Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Step 1: Get your Vapi API Key" -ForegroundColor Yellow
Write-Host "1. Go to: https://dashboard.vapi.ai/" -ForegroundColor White
Write-Host "2. Sign up or log in to your account" -ForegroundColor White
Write-Host "3. Navigate to API Keys section" -ForegroundColor White
Write-Host "4. Create a new API key" -ForegroundColor White
Write-Host "5. Copy the API key (starts with 'vapi_')" -ForegroundColor White

Write-Host ""
$apiKey = Read-Host "Enter your Vapi API key"

if ($apiKey -and $apiKey.StartsWith("vapi_")) {
    Write-Host ""
    Write-Host "✅ Valid API key format detected!" -ForegroundColor Green
    
    # Create or update .env.local file
    $envContent = @"
# AI Provider Configuration
NEXT_PUBLIC_AI_PROVIDER=groq
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.1-8b-instant

# OpenAI Configuration (if using OpenAI)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4o-mini

# Gemini Configuration (if using Gemini)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash

# Vapi.ai Configuration
NEXT_PUBLIC_VAPI_API_KEY=$apiKey
VAPI_API_KEY=$apiKey

# Database Configuration
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DB?sslmode=require&channel_binding=require
JWT_SECRET=change-this-to-a-long-random-secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@

    $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
    
    Write-Host "✅ Environment variables updated!" -ForegroundColor Green
    Write-Host "✅ Vapi API key configured: $($apiKey.Substring(0, 10))..." -ForegroundColor Green
    
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Restart your development server:" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor Cyan
    Write-Host "2. Test the voice agent at: http://localhost:3000/voice-agent" -ForegroundColor White
    Write-Host "3. Or use the voice button in the chatbot" -ForegroundColor White
    
} else {
    Write-Host ""
    Write-Host "❌ Invalid API key format!" -ForegroundColor Red
    Write-Host "Vapi API keys should start with 'vapi_'" -ForegroundColor Red
    Write-Host "Please get a valid API key from: https://dashboard.vapi.ai/" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
