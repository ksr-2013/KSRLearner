import { NextRequest, NextResponse } from 'next/server'
import { readTokenFromRequest, verifySession } from '../../../lib/auth'
import { db } from '../../../lib/db'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

interface LearningProgress {
  level: string
  progress: {
    beginner: number
    pro: number
    legend: number
    ultraLegend: number
  }
  requirements: {
    pro: { score: number; quizzes: number }
    legend: { score: number; quizzes: number }
    ultraLegend: { score: number; quizzes: number }
  }
  nextLevel?: string
  unlockedLevels: string[]
}

export async function GET(request: NextRequest) {
  try {
    let userId = null
    
    // Try Supabase authentication first
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        const { data: { user }, error } = await supabase.auth.getUser(token)
        if (user && !error) {
          userId = user.id
        }
      }
    } catch (supabaseError) {
      console.log('Supabase auth failed, trying JWT...')
    }
    
    // If Supabase auth failed, try JWT auth
    if (!userId) {
      const token = readTokenFromRequest(request)
      if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      const session = verifySession(token)
      if (!session) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      userId = session.uid
    }

    // Fetch user scores
    const scoresResult = await db.query(`
      SELECT * FROM scores 
      WHERE "userId" = $1 
      ORDER BY "createdAt" DESC
    `, [userId])
    const scores = scoresResult.rows

    // Calculate stats
    const quizScores = scores.filter(s => s.kind === 'quiz')
    const averageScore = quizScores.length > 0 ? quizScores.reduce((a, s) => a + (s.value || 0), 0) / quizScores.length : 0
    const totalQuizzes = quizScores.length

    // Determine current level
    const level = averageScore >= 85 || totalQuizzes >= 10 ? 'Ultra Legend' : 
                  averageScore >= 70 || totalQuizzes >= 5 ? 'Legend' : 
                  averageScore >= 50 || totalQuizzes >= 3 ? 'Pro' : 'Beginner'

    // Calculate progress for each level
    const progress = {
      beginner: level === 'Beginner' || level === 'Pro' || level === 'Legend' || level === 'Ultra Legend' ? 100 : 0,
      pro: level === 'Pro' || level === 'Legend' || level === 'Ultra Legend' ? 100 : 
           averageScore >= 30 ? Math.min(100, (averageScore / 60) * 100) : 0,
      legend: level === 'Legend' || level === 'Ultra Legend' ? 100 : 
              averageScore >= 50 ? Math.min(100, (averageScore / 70) * 100) : 0,
      ultraLegend: level === 'Ultra Legend' ? 100 : 
                   averageScore >= 70 ? Math.min(100, (averageScore / 85) * 100) : 0
    }

    // Requirements for each level
    const requirements = {
      pro: { score: 60, quizzes: 3 },
      legend: { score: 70, quizzes: 5 },
      ultraLegend: { score: 85, quizzes: 10 }
    }

    // Determine unlocked levels
    const unlockedLevels = ['beginner']
    if (averageScore >= 60 || totalQuizzes >= 3) unlockedLevels.push('pro')
    if (averageScore >= 70 || totalQuizzes >= 5) unlockedLevels.push('legend')
    if (averageScore >= 85 || totalQuizzes >= 10) unlockedLevels.push('ultra-legend')

    // Determine next level to unlock
    let nextLevel = null
    if (!unlockedLevels.includes('pro')) nextLevel = 'Pro'
    else if (!unlockedLevels.includes('legend')) nextLevel = 'Legend'
    else if (!unlockedLevels.includes('ultra-legend')) nextLevel = 'Ultra Legend'

    const learningProgress: LearningProgress = {
      level,
      progress,
      requirements,
      nextLevel,
      unlockedLevels
    }

    return NextResponse.json(learningProgress)
  } catch (error) {
    console.error('Learning progress API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    let userId = null
    
    // Try Supabase authentication first
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      const authHeader = request.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        const { data: { user }, error } = await supabase.auth.getUser(token)
        if (user && !error) {
          userId = user.id
        }
      }
    } catch (supabaseError) {
      console.log('Supabase auth failed, trying JWT...')
    }
    
    // If Supabase auth failed, try JWT auth
    if (!userId) {
      const token = readTokenFromRequest(request)
      if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      const session = verifySession(token)
      if (!session) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      userId = session.uid
    }

    const body = await request.json()
    const { level, quizId, score } = body

    // Record quiz completion for learning progress tracking
    const id = 'c' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
    
    await db.query(`
      INSERT INTO learning_progress (id, "userId", level, "quizId", score, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET
        score = EXCLUDED.score,
        "updatedAt" = NOW()
    `, [id, userId, level, quizId, score])

    return NextResponse.json({ success: true, message: 'Learning progress updated' })
  } catch (error) {
    console.error('Learning progress update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
