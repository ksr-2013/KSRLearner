import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

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

    // For now, return mock data. In a real app, you'd fetch from your database
    const mockDashboardData: DashboardData = {
      user: {
        id: decoded.userId,
        email: decoded.email || 'user@example.com',
        name: decoded.name || null,
        avatarUrl: decoded.avatarUrl || null
      },
      stats: {
        totalQuizzes: 15,
        completedQuizzes: 12,
        averageScore: 78,
        totalTypingTests: 8,
        averageWPM: 45,
        puzzlesSolved: 6,
        streak: 5,
        level: 'Pro'
      },
      recentActivities: [
        {
          id: '1',
          type: 'quiz',
          title: 'Computer Fundamentals Quiz',
          score: 85,
          completed: true,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() // 2 hours ago
        },
        {
          id: '2',
          type: 'typing',
          title: 'Speed Test - Intermediate',
          wpm: 52,
          completed: true,
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() // 4 hours ago
        },
        {
          id: '3',
          type: 'puzzle',
          title: 'Binary Code Challenge',
          completed: true,
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() // 6 hours ago
        },
        {
          id: '4',
          type: 'quiz',
          title: 'Programming Concepts',
          score: 72,
          completed: true,
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // 1 day ago
        },
        {
          id: '5',
          type: 'typing',
          title: 'Advanced Typing Practice',
          wpm: 48,
          completed: false,
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
        }
      ],
      progress: generateProgressData()
    }

    return NextResponse.json(mockDashboardData)
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function generateProgressData() {
  const progress = []
  const today = new Date()
  
  // Generate last 7 days of data
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    progress.push({
      date: date.toISOString().split('T')[0],
      quizzes: Math.floor(Math.random() * 4),
      typing: Math.floor(Math.random() * 3),
      puzzles: Math.floor(Math.random() * 3)
    })
  }
  
  return progress
}
