# 🔧 Quick Fix for Voice Agent Error

## The Problem
You have an **Assistant ID** (`0d4355fc-21b1-40c0-939b-b1b5a3709b36`) but need an **API Key**.

## The Solution

### Step 1: Get Your Vapi API Key
1. Go to [Vapi.ai Dashboard](https://dashboard.vapi.ai/)
2. Sign in to your account
3. Look for **"API Keys"** or **"Settings"** section
4. Create a new API key (it will start with `vapi_`)
5. Copy the API key

### Step 2: Update Your Environment File
Open your `.env.local` file and replace these lines:

**Current (incorrect):**
```
NEXT_PUBLIC_VAPI_API_KEY=0d4355fc-21b1-40c0-939b-b1b5a3709b36
VAPI_API_KEY=0d4355fc-21b1-40c0-939b-b1b5a3709b36
```

**Replace with (correct):**
```
NEXT_PUBLIC_VAPI_API_KEY=vapi_your_actual_api_key_here
VAPI_API_KEY=vapi_your_actual_api_key_here
```

### Step 3: Restart Your Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Test the Voice Agent
1. Go to `http://localhost:3000/voice-agent`
2. Click the microphone button
3. The voice agent should work without errors

## Alternative: Use Assistant ID in Code
If you can't get an API key, I can modify the code to use your Assistant ID directly. Let me know if you need this option.

## What's the Difference?
- **API Key** (`vapi_...`): Authenticates your application with Vapi
- **Assistant ID** (`0d4355fc...`): Identifies a specific voice assistant
- You need both, but the API key is required for authentication
