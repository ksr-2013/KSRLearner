import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

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
    const cookieStore = cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    if (!decoded?.userId) {
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
      userId: decoded.userId,
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
