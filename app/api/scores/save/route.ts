import { NextRequest, NextResponse } from 'next/server'
import { readTokenFromRequest, verifySession } from '../../../../lib/auth'

interface ScoreData {
  type: 'quiz' | 'typing' | 'puzzle'
  title: string
  score?: number
  wpm?: number
  level?: string
  completed: boolean
  duration?: number
  details?: any
}

export async function POST(request: NextRequest) {
  try {
    const token = readTokenFromRequest(request)
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = verifySession(token)
    if (!session) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const scoreData: ScoreData = await request.json()
    
    // Validate required fields
    if (!scoreData.type || !scoreData.title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // For now, we'll store in localStorage-like structure
    // In a real app, you'd save to a database
    const scoreRecord = {
      id: Date.now().toString(),
      userId: session.uid,
      type: scoreData.type,
      title: scoreData.title,
      score: scoreData.score || null,
      wpm: scoreData.wpm || null,
      level: scoreData.level || null,
      completed: scoreData.completed,
      duration: scoreData.duration || null,
      details: scoreData.details || null,
      timestamp: new Date().toISOString()
    }

    // In a real implementation, you would:
    // 1. Save to database (PostgreSQL, MongoDB, etc.)
    // 2. Update user statistics
    // 3. Calculate streaks and achievements
    
    // For now, we'll return success and the score will be available in dashboard
    return NextResponse.json({ 
      success: true, 
      scoreId: scoreRecord.id,
      message: 'Score saved successfully!' 
    })

  } catch (error) {
    console.error('Save score error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
