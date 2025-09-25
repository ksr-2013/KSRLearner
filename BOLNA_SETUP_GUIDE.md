# Bolna Voice Agent Setup

Enable the built-in Bolna voice agent page at `/voice-agent` and optional header link by configuring environment variables.

## 1) Env vars (client-side)

Add these to `.env.local` (Next.js client-readable variables must start with NEXT_PUBLIC_):

```
NEXT_PUBLIC_BOLNA_ENABLED=1
NEXT_PUBLIC_BOLNA_API_KEY=your_bolna_public_api_key
# Optional. If you have a specific agent you created in Bolna dashboard
NEXT_PUBLIC_BOLNA_AGENT_ID=your_agent_id
```

Restart dev server after changes.

## 2) Usage
- Navigate to `/voice-agent`
- Click Start, grant microphone permission
- Click Stop to end the session

If the header link is not visible, ensure `NEXT_PUBLIC_BOLNA_ENABLED=1` is set.

## 3) Notes
- The component lazy-loads the SDK from `https://cdn.bolna.ai/sdk/bolna.min.js`.
- If the SDK exposes different event names, update `components/BolnaVoiceAgent.tsx` `.on(...)` bindings accordingly.
- For production, consider server-side token proxying if Bolna requires non-public secrets.
