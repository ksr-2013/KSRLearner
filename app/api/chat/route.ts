import { NextRequest } from 'next/server'
import OpenAI from 'openai'

function getClient() {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null
  return new OpenAI({ apiKey })
}

export async function POST(request: NextRequest) {
  try {
    const client = getClient()
    if (!client) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { message, conversationHistory } = await request.json()

    const systemPrompt = `You are KSR Learner's AI assistant. Be concise, helpful, and guide users through technology learning content (quizzes, typing, puzzles).`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...((conversationHistory || []).map((m: any) => ({ role: m.role, content: m.content }))),
      { role: 'user', content: message }
    ] as OpenAI.Chat.ChatCompletionMessageParam[]

    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'

    const completion = await client.chat.completions.create({
      model,
      messages,
      temperature: Number(process.env.TEMPERATURE ?? 0.7),
      max_tokens: Number(process.env.MAX_TOKENS ?? 1000),
    })

    const text = completion.choices?.[0]?.message?.content || ''
    return new Response(
      JSON.stringify({ response: text, model }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: 'OPENAI_CHAT_ERROR', details: e?.message || 'unknown' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}


