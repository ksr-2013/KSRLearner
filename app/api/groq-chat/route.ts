import { NextRequest } from 'next/server'

// Groq API: https://console.groq.com/docs/text
// Model examples: llama-3.1-70b-versatile, llama-3.1-8b-instant

function getGroqConfig() {
  const apiKey = process.env.GROQ_API_KEY
  const model = process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
  if (!apiKey) return null
  return { apiKey, model }
}

export async function POST(request: NextRequest) {
  try {
    const cfg = getGroqConfig()
    if (!cfg) {
      return new Response(
        JSON.stringify({ error: 'GROQ_API_KEY not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { message, conversationHistory } = await request.json()

    const systemPrompt = `You are KSR Learner's AI assistant, a helpful and knowledgeable guide for a technology learning platform. Keep responses concise, supportive, and focused on learning.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(Array.isArray(conversationHistory) ? conversationHistory : []).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message }
    ]

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cfg.apiKey}`,
      },
      body: JSON.stringify({
        model: cfg.model,
        messages,
        temperature: Number(process.env.TEMPERATURE ?? 0.7),
        max_tokens: Number(process.env.MAX_TOKENS ?? 1000),
        stream: false,
      }),
    })

    if (!groqRes.ok) {
      let details = ''
      try {
        const asJson = await groqRes.json()
        details = asJson?.error?.message || asJson?.message || JSON.stringify(asJson)
      } catch {
        details = await groqRes.text()
      }
      return new Response(
        JSON.stringify({ error: 'Groq API error', details }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const data = await groqRes.json()
    const content = data.choices?.[0]?.message?.content || "I'm having trouble connecting right now. Please try again in a moment!"

    return new Response(
      JSON.stringify({ response: content, model: cfg.model }),
      { headers: { 'Content-Type': 'application/json' } }
    )

  } catch (error: any) {
    return new Response(
      JSON.stringify({ response: "I'm having trouble connecting right now. Please try again in a moment!", error: 'API_ERROR' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}


