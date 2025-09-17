import { NextRequest } from 'next/server'

// Gemini Realtime WebRTC Offer/Answer proxy
// Client sends an SDP offer; this route forwards it to Gemini and returns the SDP answer.
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
    if (contentType.includes('application/json')) {
      const { sdp, model } = await request.json()
      if (!sdp) {
        return new Response(JSON.stringify({ error: 'Missing SDP offer' }), { status: 400 })
      }
      const targetModel = model || cfg.model
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(targetModel)}:connect?alt=sdp&key=${cfg.apiKey}`
      const upstream = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/sdp',
        },
        body: sdp,
      })
      if (!upstream.ok) {
        const errText = await upstream.text()
        return new Response(
          JSON.stringify({ error: 'GEMINI_RTC_ERROR', details: errText }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      }
      const answerSdp = await upstream.text()
      return new Response(answerSdp, { headers: { 'Content-Type': 'application/sdp' } })
    } else {
      // Allow raw SDP body as well
      const sdp = await request.text()
      if (!sdp) {
        return new Response(JSON.stringify({ error: 'Missing SDP offer' }), { status: 400 })
      }
      const cfg2 = getConfig()
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cfg2!.model)}:connect?alt=sdp&key=${cfg2!.apiKey}`
      const upstream = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/sdp' },
        body: sdp,
      })
      if (!upstream.ok) {
        const errText = await upstream.text()
        return new Response(
          JSON.stringify({ error: 'GEMINI_RTC_ERROR', details: errText }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        )
      }
      const answerSdp = await upstream.text()
      return new Response(answerSdp, { headers: { 'Content-Type': 'application/sdp' } })
    }
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: 'RTC_SERVER_ERROR', details: e?.message || 'unknown' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}


