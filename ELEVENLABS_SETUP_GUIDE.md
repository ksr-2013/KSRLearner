# 🎤 ElevenLabs Voice Agent Setup Guide

This guide will help you set up ElevenLabs for high-quality voice synthesis in your KSR Learner website.

## ✅ What's Already Done
- ✅ ElevenLabs voice agent component created
- ✅ API route for text-to-speech created
- ✅ Fallback to browser TTS if ElevenLabs not configured
- ✅ Integration with existing Groq AI responses

## 🔑 Step 1: Get Your ElevenLabs API Key

1. **Go to [ElevenLabs.io](https://elevenlabs.io)**
2. **Sign up for a free account**
3. **Navigate to your profile/settings**
4. **Find "API Keys" section**
5. **Create a new API key**
6. **Copy the API key** (it will look like `sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

## 🔧 Step 2: Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# ElevenLabs Configuration
ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
NEXT_PUBLIC_ELEVENLABS_API_KEY=your_elevenlabs_api_key_here
```

Replace `your_elevenlabs_api_key_here` with your actual ElevenLabs API key.

## 🚀 Step 3: For Production (Netlify)

Add the same environment variables in your Netlify dashboard:

1. Go to your Netlify dashboard
2. Navigate to Site settings > Environment variables
3. Add:
   - `ELEVENLABS_API_KEY` = your_elevenlabs_api_key_here
   - `NEXT_PUBLIC_ELEVENLABS_API_KEY` = your_elevenlabs_api_key_here

## 🎯 Step 4: Test the Voice Agent

1. **Restart your development server**: `npm run dev`
2. **Go to**: `http://localhost:3001/voice-agent`
3. **Click the phone button** to start voice conversation
4. **Speak naturally** - you should hear high-quality AI voice responses

## 💰 ElevenLabs Pricing

### **Free Tier:**
- ✅ **10,000 characters per month**
- ✅ **High-quality voice synthesis**
- ✅ **Multiple voice options**
- ✅ **Perfect for testing and small projects**

### **Paid Plans:**
- **Starter**: $5/month for 30,000 characters
- **Creator**: $22/month for 100,000 characters
- **Pro**: $99/month for 500,000 characters

## 🎤 Voice Quality Features

- **Natural Speech**: Human-like voice synthesis
- **Multiple Voices**: Choose from various voice options
- **Voice Settings**: Adjust stability and similarity
- **Real-time**: Fast text-to-speech conversion
- **High Quality**: Professional-grade audio output

## 🔧 Customization Options

### **Change Voice:**
Edit `app/api/elevenlabs-speech/route.ts` and change the voice ID:
```typescript
const url = 'https://api.elevenlabs.io/v1/text-to-speech/YOUR_VOICE_ID'
```

### **Adjust Voice Settings:**
Modify the voice settings in the API route:
```typescript
voice_settings: {
  stability: 0.5,        // 0.0 to 1.0
  similarity_boost: 0.5  // 0.0 to 1.0
}
```

## 🛠️ How It Works

1. **Speech Recognition**: Browser captures your voice
2. **AI Processing**: Groq API generates intelligent responses
3. **ElevenLabs TTS**: Converts AI text to high-quality speech
4. **Audio Playback**: Plays the synthesized voice response

## 🔍 Troubleshooting

### **If you get "ElevenLabs API key not configured":**
- Check that `ELEVENLABS_API_KEY` is set in `.env.local`
- Restart your development server
- Verify the API key is correct

### **If voice quality is poor:**
- Check your internet connection
- Verify ElevenLabs API key is valid
- Try different voice settings

### **If it falls back to browser TTS:**
- ElevenLabs API key might be invalid
- Check browser console for errors
- Verify API key has sufficient credits

## 🎉 Benefits of ElevenLabs

- ✅ **High-quality voice synthesis**
- ✅ **Natural-sounding AI responses**
- ✅ **Easy integration**
- ✅ **Free tier available**
- ✅ **Professional voice options**
- ✅ **Fast and reliable**

## 📞 Support

- **ElevenLabs Documentation**: [docs.elevenlabs.io](https://docs.elevenlabs.io)
- **ElevenLabs Support**: [help.elevenlabs.io](https://help.elevenlabs.io)
- **Voice Agent Issues**: Check the debug panel in the voice agent

Your voice agent is now ready with ElevenLabs integration! 🎤✨
