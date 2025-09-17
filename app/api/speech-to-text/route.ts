import { NextRequest } from 'next/server'

// Server-side Speech-to-Text using Hugging Face Inference API (Whisper)
// Requires env: HUGGING_FACE_TOKEN, optional: HF_STT_MODEL (default: openai/whisper-large-v3)

export const runtime = 'nodejs'

function getConfig() {
  const token = process.env.HUGGING_FACE_TOKEN
  const model = process.env.HF_STT_MODEL || 'openai/whisper-large-v3'
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

    // Support raw audio body or multipart/form-data with field 'file'
    let audioBuffer: ArrayBuffer | null = null
    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      if (!file) {
        return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 })
      }
      audioBuffer = await file.arrayBuffer()
    } else {
      audioBuffer = await request.arrayBuffer()
    }

    if (!audioBuffer || (audioBuffer as ArrayBuffer).byteLength === 0) {
      return new Response(JSON.stringify({ error: 'Empty audio payload' }), { status: 400 })
    }

    const hfRes = await fetch(`https://api-inference.huggingface.co/models/${cfg.model}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        // Let HF detect content-type; many accept audio/webm or audio/mpeg
        'Content-Type': 'application/octet-stream',
      },
      body: Buffer.from(audioBuffer),
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
        JSON.stringify({ error: 'HF_STT_ERROR', details }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const data = await hfRes.json()
    // HF Whisper outputs can be array or object; try common shapes
    let text = ''
    if (Array.isArray(data) && data.length && data[0].text) {
      text = data[0].text
    } else if (data?.text) {
      text = data.text
    } else if (typeof data === 'string') {
      text = data
    }

    return new Response(JSON.stringify({ text }), { headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: 'STT_SERVER_ERROR', details: e?.message || 'unknown' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}


