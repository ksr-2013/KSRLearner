import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { action, message } = await request.json()
    
    if (action === 'create-assistant') {
      // Create a Vapi assistant configuration
      const assistantConfig = {
        name: "KSR Learner Voice Assistant",
        model: {
          provider: "openai",
          model: "gpt-4o-mini",
          systemMessage: `You are KSR Learner's AI voice assistant. You help students learn technology topics through interactive conversations. 

KSR Learner offers:
- Interactive quizzes (Beginner, Pro, Legend, Ultra Legend levels)
- Typing practice and speed tests  
- Educational puzzles and problem-solving challenges
- Video lessons on computer basics, programming, networking, security, cloud computing, and AI
- Progress tracking and achievement system

Your role:
- Help users navigate the platform through voice
- Explain learning topics and concepts conversationally
- Guide users to appropriate difficulty levels
- Provide study tips and best practices
- Answer questions about technology and computer science
- Be encouraging and supportive of learners
- Keep responses conversational and engaging
- Always maintain a friendly, educational tone

Speak naturally and ask follow-up questions to keep the conversation engaging.`
        },
        voice: {
          provider: "11labs",
          voiceId: "21m00Tcm4TlvDq8ikWAM", // Default 11Labs voice
          stability: 0.5,
          similarityBoost: 0.5
        },
        firstMessage: "Hello! I'm KSR Learner's voice assistant. I can help you with learning questions, guide you through our platform, or answer any questions about technology topics. How can I assist you today?",
        endCallMessage: "Thank you for using KSR Learner! Keep learning and exploring technology. Goodbye!",
        endCallPhrases: ["goodbye", "bye", "end call", "hang up", "stop"],
        interruptionThreshold: 1000,
        language: "en-US"
      }
      
      return NextResponse.json({ 
        success: true, 
        assistant: assistantConfig 
      })
    }
    
    if (action === 'get-assistant') {
      // Return the assistant configuration
      const assistantConfig = {
        name: "KSR Learner Voice Assistant",
        model: {
          provider: "openai", 
          model: "gpt-4o-mini",
          systemMessage: `You are KSR Learner's AI voice assistant. You help students learn technology topics through interactive conversations. 

KSR Learner offers:
- Interactive quizzes (Beginner, Pro, Legend, Ultra Legend levels)
- Typing practice and speed tests  
- Educational puzzles and problem-solving challenges
- Video lessons on computer basics, programming, networking, security, cloud computing, and AI
- Progress tracking and achievement system

Your role:
- Help users navigate the platform through voice
- Explain learning topics and concepts conversationally
- Guide users to appropriate difficulty levels
- Provide study tips and best practices
- Answer questions about technology and computer science
- Be encouraging and supportive of learners
- Keep responses conversational and engaging
- Always maintain a friendly, educational tone

Speak naturally and ask follow-up questions to keep the conversation engaging.`
        },
        voice: {
          provider: "11labs",
          voiceId: "21m00Tcm4TlvDq8ikWAM",
          stability: 0.5,
          similarityBoost: 0.5
        },
        firstMessage: "Hello! I'm KSR Learner's voice assistant. I can help you with learning questions, guide you through our platform, or answer any questions about technology topics. How can I assist you today?",
        endCallMessage: "Thank you for using KSR Learner! Keep learning and exploring technology. Goodbye!",
        endCallPhrases: ["goodbye", "bye", "end call", "hang up", "stop"],
        interruptionThreshold: 1000,
        language: "en-US"
      }
      
      return NextResponse.json({ 
        success: true, 
        assistant: assistantConfig 
      })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action' 
    }, { status: 400 })
    
  } catch (error) {
    console.error('Vapi API error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
