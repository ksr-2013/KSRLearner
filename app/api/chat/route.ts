import { NextRequest } from 'next/server'
import OpenAI from 'openai'

// Initialize OpenAI client lazily to avoid build-time issues
function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-your-actual-api-key-here') {
    return null
  }
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

export async function POST(request: NextRequest) {
  try {
    // Get OpenAI client (returns null if API key not configured)
    const openai = getOpenAIClient()
    
    if (!openai) {
      console.error('OpenAI API key not configured')
      return new Response(
        JSON.stringify({ error: 'API key not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const { message, conversationHistory } = await request.json()

    // System prompt to make the AI act as KSR Learner's assistant
    const systemPrompt = `You are KSR Learner's AI assistant, a helpful and knowledgeable guide for a technology learning platform. 

KSR Learner offers:
- Interactive quizzes (Beginner, Pro, Legend, Ultra Legend levels)
- Typing practice and speed tests
- Educational puzzles and problem-solving challenges
- Video lessons on computer basics, programming, networking, security, cloud computing, and AI
- Progress tracking and achievement system

Your role:
- Help users navigate the platform
- Explain learning topics and concepts
- Guide users to appropriate difficulty levels
- Provide study tips and best practices
- Answer questions about technology and computer science
- Be encouraging and supportive of learners
- Keep responses concise but helpful
- Always maintain a friendly, educational tone

If users ask about topics not related to learning or technology, politely redirect them to learning-related subjects or platform features.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ]

    const stream = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o',
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: true,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
          controller.close()
        } catch (error) {
          console.error('Streaming error:', error)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`))
          controller.close()
        }
      }
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error: any) {
    console.error('OpenAI API error:', error)
    
    let fallbackResponse = "I'm having trouble connecting right now. Please try again in a moment!"
    
    // Handle specific error types
    if (error.code === 'insufficient_quota') {
      fallbackResponse = "I'm temporarily unavailable due to API quota limits. Please try again later or contact support. In the meantime, I can still help with basic questions about KSR Learner!"
    } else if (error.status === 429) {
      fallbackResponse = "I'm getting too many requests right now. Please wait a moment and try again!"
    } else if (error.message?.includes('API key')) {
      fallbackResponse = "There's an issue with my API configuration. Please contact support for assistance."
    }
    
    const encoder = new TextEncoder()
    
    return new Response(
      encoder.encode(`data: ${JSON.stringify({ content: fallbackResponse })}\n\ndata: [DONE]\n\n`),
      {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      }
    )
  }
}
