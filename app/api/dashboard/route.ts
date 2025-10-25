import { NextRequest, NextResponse } from 'next/server'
import { readTokenFromRequest, verifySession } from '../../../lib/auth'
import { db } from '../../../lib/db'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

interface User {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
}

interface DashboardData {
  user: User
  stats: {
    totalQuizzes: number
    completedQuizzes: number
    averageScore: number
    totalTypingTests: number
    averageWPM: number
    puzzlesSolved: number
    streak: number
    level: string
  }
  recentActivities: Array<{
    id: string
    type: 'quiz' | 'typing' | 'puzzle'
    title: string
    score?: number
    wpm?: number
    completed: boolean
    timestamp: string
  }>
  progress: Array<{
    date: string
    quizzes: number
    typing: number
    puzzles: number
  }>
}

export async function GET(request: NextRequest) {
  try {
    let userId = null
    let userEmail = null
    
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
          userEmail = user.email
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

    // Fetch user from database
    const userResult = await db.query('SELECT id, email, name, "avatarUrl" FROM users WHERE id = $1', [userId])
    if (userResult.rows.length === 0) return NextResponse.json({ error: 'User not found' }, { status: 404 })
    const user = userResult.rows[0]

    // Fetch scores
    const scoresResult = await db.query(`
      SELECT * FROM scores 
      WHERE "userId" = $1 
      ORDER BY "createdAt" DESC
    `, [user.id])
    const scores = scoresResult.rows

    // Compute stats
    const quizScores = scores.filter(s => s.kind === 'quiz')
    const typingScores = scores.filter(s => s.kind === 'typing')
    const puzzleScores = scores.filter(s => s.kind === 'puzzle')

    const totalQuizzes = quizScores.length
    const completedQuizzes = quizScores.length // treat each saved quiz as completed
    const averageScore = quizScores.length > 0 ? quizScores.reduce((a, s) => a + (s.value || 0), 0) / quizScores.length : 0
    const totalTypingTests = typingScores.length
    const averageWPM = typingScores.length > 0 ? Math.round(typingScores.reduce((a, s) => a + (s.value || 0), 0) / typingScores.length) : 0
    const puzzlesSolved = puzzleScores.length

    // Simple streak: count consecutive days with any activity until a gap
    const byDate = new Map<string, number>()
    for (const s of scores) {
      const key = s.createdAt.toISOString().split('T')[0]
      byDate.set(key, (byDate.get(key) || 0) + 1)
    }
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = d.toISOString().split('T')[0]
      if (byDate.has(key)) streak += 1
      else break
    }

    // Level heuristic based on average score and total quizzes completed
    // More conservative approach - requires both good scores AND sufficient activity
    let level = 'Beginner'
    
    if (totalQuizzes >= 10 && averageScore >= 85) {
      level = 'Ultra Legend'
    } else if (totalQuizzes >= 5 && averageScore >= 70) {
      level = 'Legend'
    } else if (totalQuizzes >= 3 && averageScore >= 50) {
      level = 'Pro'
    } else {
      level = 'Beginner'
    }

    // Recent activities
    const recentActivities = scores.slice(0, 10).map(s => ({
      id: s.id,
      type: (s.kind as 'quiz' | 'typing' | 'puzzle'),
      title: (typeof s.meta === 'object' && (s.meta as any)?.title) || `${s.kind.toUpperCase()} Activity`,
      score: s.kind === 'quiz' ? s.value : undefined,
      wpm: s.kind === 'typing' ? s.value : undefined,
      completed: true,
      timestamp: s.createdAt.toISOString()
    }))

    // Progress last 14 days
    const progressMap: Record<string, { quizzes: number; typing: number; puzzles: number }> = {}
    for (const s of scores) {
      const key = s.createdAt.toISOString().split('T')[0]
      if (!progressMap[key]) progressMap[key] = { quizzes: 0, typing: 0, puzzles: 0 }
      if (s.kind === 'quiz') progressMap[key].quizzes += 1
      if (s.kind === 'typing') progressMap[key].typing += 1
      if (s.kind === 'puzzle') progressMap[key].puzzles += 1
    }
    const progress: Array<{ date: string; quizzes: number; typing: number; puzzles: number }> = []
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = d.toISOString().split('T')[0]
      const bucket = progressMap[key] || { quizzes: 0, typing: 0, puzzles: 0 }
      progress.push({ date: key, ...bucket })
    }

    const payload = {
      user,
      stats: {
        totalQuizzes,
        completedQuizzes,
        averageScore: Math.round(averageScore),
        totalTypingTests,
        averageWPM,
        puzzlesSolved,
        streak,
        level
      },
      recentActivities,
      progress
    }

    return NextResponse.json(payload)
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
 
