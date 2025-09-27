'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import DashboardStats from '../../components/DashboardStats'
import RecentActivity from '../../components/RecentActivity'
import QuickActions from '../../components/QuickActions'
import ProgressChart from '../../components/ProgressChart'
import LearningPath from '../../components/LearningPath'

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

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check authentication
        const authRes = await fetch('/api/auth/me', { cache: 'no-store' })
        const authData = await authRes.json()
        
        if (!authData?.user) {
          router.push('/auth')
          return
        }

        setUser(authData.user)

        // Fetch dashboard data
        const dashboardRes = await fetch('/api/dashboard', { cache: 'no-store' })
        const dashboard = await dashboardRes.json()
        
        if (dashboardRes.ok) {
          setDashboardData(dashboard)
        } else {
          // If no dashboard data, create default structure
          setDashboardData({
            user: authData.user,
            stats: {
              totalQuizzes: 0,
              completedQuizzes: 0,
              averageScore: 0,
              totalTypingTests: 0,
              averageWPM: 0,
              puzzlesSolved: 0,
              streak: 0,
              level: 'Beginner'
            },
            recentActivities: [],
            progress: []
          })
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    )
  }

  if (!user || !dashboardData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Unable to load dashboard</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {user.name || user.email.split('@')[0]}! 👋
          </h1>
          <p className="text-slate-300 text-lg">
            Continue your learning journey and track your progress
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-8">
          <DashboardStats stats={dashboardData.stats} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Progress and Learning Path */}
          <div className="lg:col-span-2 space-y-8">
            <ProgressChart progress={dashboardData.progress} />
            <LearningPath level={dashboardData.stats.level} />
          </div>

          {/* Right Column - Quick Actions and Recent Activity */}
          <div className="space-y-8">
            <QuickActions />
            <RecentActivity activities={dashboardData.recentActivities} />
          </div>
        </div>

        {/* Achievement Section */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/20">
          <h2 className="text-2xl font-bold text-white mb-4">🏆 Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-white font-semibold">Quiz Master</div>
              <div className="text-slate-300 text-sm">
                {dashboardData.stats.completedQuizzes} quizzes completed
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-white font-semibold">Speed Demon</div>
              <div className="text-slate-300 text-sm">
                {dashboardData.stats.averageWPM} WPM average
              </div>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-4 text-center">
              <div className="text-3xl mb-2">🧩</div>
              <div className="text-white font-semibold">Puzzle Solver</div>
              <div className="text-slate-300 text-sm">
                {dashboardData.stats.puzzlesSolved} puzzles solved
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
