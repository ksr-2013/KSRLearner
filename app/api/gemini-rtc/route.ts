import { NextRequest } from 'next/server'

// Gemini Realtime WebRTC Offer/Answer proxy
// Env required: GEMINI_API_KEY; optional: GEMINI_REALTIME_MODEL (default: gemini-1.5-pro-exp-0827)

export const runtime = 'nodejs'

function getConfig() {
  const apiKey = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_REALTIME_MODEL || 'gemini-1.5-pro-exp-0827'
  if (!apiKey) return null
  return { apiKey, model }
}

export async function POST(request: NextRequest) {
  try {
    const cfg = getConfig()
    if (!cfg) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const contentType = request.headers.get('content-type') || ''
    let sdp = ''
    let model = cfg.model
    if (contentType.includes('application/json')) {
      const body = await request.json()
      if (!body?.sdp) return new Response(JSON.stringify({ error: 'Missing SDP offer' }), { status: 400 })
      sdp = body.sdp
      if (body?.model) model = body.model
    } else {
      sdp = await request.text()
      if (!sdp) return new Response(JSON.stringify({ error: 'Missing SDP offer' }), { status: 400 })
    }

    const upstream = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:connect?alt=sdp&key=${cfg.apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/sdp' },
      body: sdp,
    })

    if (!upstream.ok) {
      const txt = await upstream.text()
      return new Response(
        JSON.stringify({ error: 'GEMINI_RTC_ERROR', details: txt }),
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


