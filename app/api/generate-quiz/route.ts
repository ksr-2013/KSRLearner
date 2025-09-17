import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

type Provider = 'groq' | 'openai'

function getProvider(): Provider {
  const p = (process.env.NEXT_PUBLIC_AI_PROVIDER || 'groq').toLowerCase()
  return p === 'openai' ? 'openai' : 'groq'
}

function getKeys() {
  return {
    groq: process.env.GROQ_API_KEY,
    openai: process.env.OPENAI_API_KEY,
    openaiModel: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  }
}

function buildPrompt(topic: string, level: string, count: number) {
  return `You are an expert teacher. Create ${count} multiple-choice questions about "${topic}" for level: ${level}.
Return STRICT JSON with this TypeScript type:
{
  "questions": Array<{
    "id": string,
    "question": string,
    "options": string[],
    "correctAnswer": number, // index of options
    "explanation": string
  }>
}
Rules:
- No markdown, no code fences
- Each question must have exactly 4 options
- Keep explanations concise (<= 2 sentences)
`;
}

export async function POST(req: NextRequest) {
  try {
    const { topic, level, count } = await req.json()
    if (!topic || !level) {
      return new Response(JSON.stringify({ error: 'Missing topic or level' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    const num = Math.min(Math.max(Number(count) || 5, 3), 15)

    const provider = getProvider()
    const keys = getKeys()
    const prompt = buildPrompt(topic, level, num)

    let jsonText = ''

    if (provider === 'groq') {
      if (!keys.groq) {
        return new Response(JSON.stringify({ error: 'GROQ_API_KEY not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
      }
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keys.groq}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: 'You output strict JSON only.' },
            { role: 'user', content: prompt },
          ],
          temperature: Number(process.env.TEMPERATURE ?? 0.7),
          max_tokens: Number(process.env.MAX_TOKENS ?? 1200),
        }),
      })
      if (!res.ok) {
        const txt = await res.text()
        return new Response(JSON.stringify({ error: 'GROQ_ERROR', details: txt }), { status: 500, headers: { 'Content-Type': 'application/json' } })
      }
      const data = await res.json()
      jsonText = data.choices?.[0]?.message?.content || ''
    } else {
      if (!keys.openai) {
        return new Response(JSON.stringify({ error: 'OPENAI_API_KEY not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
      }
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keys.openai}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: keys.openaiModel,
          messages: [
            { role: 'system', content: 'You output strict JSON only.' },
            { role: 'user', content: prompt },
          ],
          temperature: Number(process.env.TEMPERATURE ?? 0.7),
          max_tokens: Number(process.env.MAX_TOKENS ?? 1200),
        }),
      })
      if (!res.ok) {
        const txt = await res.text()
        return new Response(JSON.stringify({ error: 'OPENAI_ERROR', details: txt }), { status: 500, headers: { 'Content-Type': 'application/json' } })
      }
      const data = await res.json()
      jsonText = data.choices?.[0]?.message?.content || ''
    }

    // Parse JSON safely
    let payload: any = null
    try {
      payload = JSON.parse(jsonText)
    } catch {
      // try to extract JSON substring
      const match = jsonText.match(/\{[\s\S]*\}\s*$/)
      if (match) {
        try { payload = JSON.parse(match[0]) } catch {}
      }
    }

    if (!payload || !Array.isArray(payload.questions)) {
      return new Response(JSON.stringify({ error: 'BAD_FORMAT', raw: jsonText }), { status: 500, headers: { 'Content-Type': 'application/json' } })
    }

    // Basic sanitization
    payload.questions = payload.questions.slice(0, num).map((q: any, idx: number) => ({
      id: String(q.id ?? idx + 1),
      question: String(q.question ?? ''),
      options: Array.isArray(q.options) ? q.options.slice(0, 4).map((o: any) => String(o)) : [],
      correctAnswer: Number.isInteger(q.correctAnswer) ? q.correctAnswer : 0,
      explanation: String(q.explanation ?? ''),
    }))

    return new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: e?.message || 'unknown' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}


