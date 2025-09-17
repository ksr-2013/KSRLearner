import { NextRequest } from 'next/server'

// OpenAI Realtime WebRTC Offer/Answer proxy
// Env: OPENAI_API_KEY (required), OPENAI_REALTIME_MODEL (default: gpt-4o-realtime-preview-2024-12-17)

export const runtime = 'nodejs'

function getConfig() {
  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_REALTIME_MODEL || 'gpt-4o-realtime-preview-2024-12-17'
  if (!apiKey) return null
  return { apiKey, model }
}

export async function POST(request: NextRequest) {
  try {
    const cfg = getConfig()
    if (!cfg) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const contentType = request.headers.get('content-type') || ''
    let sdpOffer = ''
    let model = cfg.model
    if (contentType.includes('application/json')) {
      const { sdp, model: bodyModel } = await request.json()
      if (!sdp) return new Response(JSON.stringify({ error: 'Missing SDP offer' }), { status: 400 })
      sdpOffer = sdp
      if (bodyModel) model = bodyModel
    } else {
      sdpOffer = await request.text()
      if (!sdpOffer) return new Response(JSON.stringify({ error: 'Missing SDP offer' }), { status: 400 })
    }

    const upstream = await fetch(`https://api.openai.com/v1/realtime?model=${encodeURIComponent(model)}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${cfg.apiKey}`,
        'OpenAI-Beta': 'realtime=v1',
        'Content-Type': 'application/sdp',
      },
      body: sdpOffer,
    })

    if (!upstream.ok) {
      const txt = await upstream.text()
      return new Response(
        JSON.stringify({ error: 'OPENAI_RTC_ERROR', details: txt }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const answerSdp = await upstream.text()
    return new Response(answerSdp, { headers: { 'Content-Type': 'application/sdp' } })
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: 'RTC_SERVER_ERROR', details: e?.message || 'unknown' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}


