# Vapi.ai Voice Agent Setup Guide

This guide will help you set up the Vapi.ai voice agent integration for your KSR Learner website.

## Prerequisites

1. A Vapi.ai account (sign up at https://vapi.ai/)
2. Your existing KSR Learner project with environment variables configured

## Step 1: Get Vapi API Key

1. Go to [Vapi.ai Dashboard](https://dashboard.vapi.ai/)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Create a new API key
5. Copy the API key (it will look like `vapi_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

## Step 2: Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Vapi.ai Configuration
NEXT_PUBLIC_VAPI_API_KEY=your_vapi_api_key_here
VAPI_API_KEY=your_vapi_api_key_here
```

Replace `your_vapi_api_key_here` with your actual Vapi API key.

## Step 3: Configure Netlify Environment Variables

For production deployment on Netlify:

1. Go to your Netlify dashboard
2. Navigate to Site settings > Environment variables
3. Add the following variables:
   - `NEXT_PUBLIC_VAPI_API_KEY` = your_vapi_api_key_here
   - `VAPI_API_KEY` = your_vapi_api_key_here

## Step 4: Voice Agent Features

The voice agent includes:

- **Real-time voice conversation** with AI
- **Speech-to-text** and **text-to-speech** capabilities
- **Microphone controls** (mute/unmute)
- **Call management** (start/end calls)
- **Integration with existing chatbot** functionality
- **Conversation history** tracking

## Step 5: Usage

### In the Chatbot
1. Open the chatbot by clicking the chat icon
2. Click the microphone button to enable voice mode
3. Click the phone icon to start a voice conversation
4. Speak naturally - the AI will respond with voice

### On the Voice Agent Page
1. Navigate to `/voice-agent` in your browser
2. Click the microphone button to start a voice conversation
3. Use the controls to manage your call
4. View conversation history in real-time

## Step 6: Customization

### Voice Settings
You can customize the voice in `app/api/vapi/route.ts`:

```typescript
voice: {
  provider: "11labs",
  voiceId: "21m00Tcm4TlvDq8ikWAM", // Change this to your preferred voice
  stability: 0.5,
  similarityBoost: 0.5
}
```

### AI Model Settings
The voice agent uses the same AI provider as your chatbot. You can configure this in your environment variables:

- For OpenAI: Set `NEXT_PUBLIC_AI_PROVIDER=openai`
- For Groq: Set `NEXT_PUBLIC_AI_PROVIDER=groq`
- For Gemini: Set `NEXT_PUBLIC_AI_PROVIDER=gemini`

## Step 7: Testing

1. Start your development server: `npm run dev`
2. Navigate to `http://localhost:3000/voice-agent`
3. Click the microphone button to test voice functionality
4. Ensure your microphone permissions are granted

## Troubleshooting

### Common Issues

1. **"Voice agent not ready" error**
   - Check that your VAPI_API_KEY is correctly set
   - Ensure the API key is valid and has proper permissions

2. **Microphone not working**
   - Check browser permissions for microphone access
   - Ensure you're using HTTPS in production (required for microphone access)

3. **No voice response**
   - Check that your AI provider (OpenAI/Groq/Gemini) is configured correctly
   - Verify the voice provider settings in the API route

4. **Build errors**
   - Ensure all dependencies are installed: `npm install`
   - Check that the Vapi SDK is properly imported

### Browser Compatibility

The voice agent works best in:
- Chrome (recommended)
- Firefox
- Safari (with some limitations)
- Edge

### Production Deployment

Make sure to:
1. Set all environment variables in Netlify
2. Use HTTPS (required for microphone access)
3. Test the voice functionality after deployment

## Support

For issues with:
- **Vapi.ai**: Check their documentation at https://docs.vapi.ai/
- **Voice Agent Integration**: Check the browser console for errors
- **Environment Setup**: Verify all API keys are correctly configured

## Next Steps

After setup, you can:
1. Customize the voice agent's personality and responses
2. Add more voice providers (ElevenLabs, Azure, etc.)
3. Implement call recording and analytics
4. Add multi-language support
5. Integrate with your user authentication system
