import { NextRequest } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key not configured')
      return new Response(
        JSON.stringify({ error: 'Gemini API key not configured' }),
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

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Prepare the conversation history
    const chatHistory = conversationHistory.map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }))

    // Start a chat session
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: systemPrompt }]
        },
        {
          role: 'model',
          parts: [{ text: 'I understand! I\'m KSR Learner\'s AI assistant, ready to help with learning questions, platform navigation, and technology topics. How can I assist you today?' }]
        },
        ...chatHistory
      ]
    })

    // Send the message and get response
    const result = await chat.sendMessage(message)
    const response = await result.response
    const text = response.text()

    return new Response(
      JSON.stringify({ 
        response: text,
        model: 'gemini-1.5-flash'
      }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

  } catch (error: any) {
    console.error('Gemini API error:', error)
    
    let fallbackResponse = "I'm having trouble connecting right now. Please try again in a moment!"
    
    // Handle specific error types
    if (error.message?.includes('API key')) {
      fallbackResponse = "There's an issue with my API configuration. Please contact support for assistance."
    } else if (error.message?.includes('quota')) {
      fallbackResponse = "I'm temporarily unavailable due to API quota limits. Please try again later!"
    } else if (error.message?.includes('rate limit')) {
      fallbackResponse = "I'm getting too many requests right now. Please wait a moment and try again!"
    }
    
    return new Response(
      JSON.stringify({ 
        response: fallbackResponse,
        error: 'API_ERROR'
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
