import { NextRequest } from 'next/server'

// Server-side Text-to-Speech using Hugging Face Inference API
// Requires env: HUGGING_FACE_TOKEN, optional: HF_TTS_MODEL (default: microsoft/speecht5_tts)

export const runtime = 'nodejs'

function getConfig() {
  const token = process.env.HUGGING_FACE_TOKEN
  const model = process.env.HF_TTS_MODEL || 'facebook/mms-tts-eng'
  if (!token) return null
  return { token, model }
}

export async function POST(request: NextRequest) {
  try {
    const cfg = getConfig()
    if (!cfg) {
      return new Response(
        JSON.stringify({ error: 'HUGGING_FACE_TOKEN not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { text } = await request.json()
    if (!text || typeof text !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing text' }), { status: 400 })
    }

    const hfRes = await fetch(`https://api-inference.huggingface.co/models/${cfg.model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs: text }),
    })

    if (!hfRes.ok) {
      let details = ''
      try {
        const j = await hfRes.json()
        details = j?.error || j?.message || JSON.stringify(j)
      } catch {
        details = await hfRes.text()
      }
      return new Response(
        JSON.stringify({ error: 'HF_TTS_ERROR', details }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Many HF TTS models return binary audio (e.g., WAV). Pass through as audio/wav
    const audioArrayBuffer = await hfRes.arrayBuffer()
    return new Response(Buffer.from(audioArrayBuffer), {
      headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'no-store',
      },
    })
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: 'TTS_SERVER_ERROR', details: e?.message || 'unknown' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}


