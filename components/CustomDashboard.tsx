'use client'

import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Users, BookOpen, Target, Award, Calendar, Activity, Brain, Zap, RefreshCw, Maximize2, Minimize2, ExternalLink } from 'lucide-react'

interface DashboardData {
  overview: {
    totalStudents: number
    activeCourses: number
    completedLessons: number
    averageScore: number
    totalHours: number
    streak: number
  }
  performance: {
    weekly: Array<{ day: string; score: number; lessons: number; hours: number }>
    monthly: Array<{ month: string; students: number; courses: number; completion: number }>
    categories: Array<{ name: string; score: number; students: number; trend: number }>
  }
  insights: Array<{
    id: string
    type: 'success' | 'warning' | 'info' | 'achievement'
    title: string
    description: string
    value?: string
    trend?: number
  }>
  recentActivity: Array<{
    id: string
    type: 'enrollment' | 'completion' | 'achievement' | 'milestone'
    user: string
    action: string
    timestamp: string
    score?: number
  }>
  topPerformers: Array<{
    id: string
    name: string
    score: number
    courses: number
    streak: number
    avatar?: string
  }>
}

export default function CustomDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    loadDashboardData()
  }, [refreshKey])

  const loadDashboardData = async () => {
    setIsLoading(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generate comprehensive dashboard data
    const dashboardData: DashboardData = {
      overview: {
        totalStudents: 1247,
        activeCourses: 23,
        completedLessons: 8942,
        averageScore: 87.3,
        totalHours: 12456,
        streak: 15
      },
      performance: {
        weekly: [
          { day: 'Mon', score: 85, lessons: 45, hours: 8.2 },
          { day: 'Tue', score: 88, lessons: 52, hours: 9.1 },
          { day: 'Wed', score: 92, lessons: 48, hours: 8.7 },
          { day: 'Thu', score: 89, lessons: 56, hours: 9.5 },
          { day: 'Fri', score: 94, lessons: 61, hours: 10.2 },
          { day: 'Sat', score: 91, lessons: 38, hours: 7.8 },
          { day: 'Sun', score: 87, lessons: 42, hours: 8.1 }
        ],
        monthly: [
          { month: 'Jan', students: 1200, courses: 18, completion: 78 },
          { month: 'Feb', students: 1250, courses: 20, completion: 82 },
          { month: 'Mar', students: 1300, courses: 22, completion: 85 },
          { month: 'Apr', students: 1350, courses: 25, completion: 88 },
          { month: 'May', students: 1400, courses: 28, completion: 91 },
          { month: 'Jun', students: 1450, courses: 30, completion: 94 }
        ],
        categories: [
          { name: 'Programming', score: 92, students: 450, trend: 12 },
          { name: 'Mathematics', score: 88, students: 380, trend: 8 },
          { name: 'Science', score: 90, students: 320, trend: 15 },
          { name: 'Language', score: 85, students: 280, trend: 6 },
          { name: 'History', score: 87, students: 250, trend: 9 }
        ]
      },
      insights: [
        {
          id: '1',
          type: 'success',
          title: 'Performance Surge',
          description: 'Student performance increased by 15% this week',
          value: '+15%',
          trend: 15
        },
        {
          id: '2',
          type: 'achievement',
          title: 'Milestone Reached',
          description: '1000+ students completed their first course',
          value: '1,000+',
          trend: 25
        },
        {
          id: '3',
          type: 'warning',
          title: 'Attention Needed',
          description: 'Mathematics course completion rate dropped by 5%',
          value: '-5%',
          trend: -5
        },
        {
          id: '4',
          type: 'info',
          title: 'New Feature',
          description: 'AI-powered learning paths are now available',
          value: 'NEW',
          trend: 0
        }
      ],
      recentActivity: [
        {
          id: '1',
          type: 'enrollment',
          user: 'Sarah Johnson',
          action: 'enrolled in Advanced Python',
          timestamp: '2 minutes ago',
          score: 95
        },
        {
          id: '2',
          type: 'completion',
          user: 'Mike Chen',
          action: 'completed JavaScript Fundamentals',
          timestamp: '15 minutes ago',
          score: 88
        },
        {
          id: '3',
          type: 'achievement',
          user: 'Emma Wilson',
          action: 'earned Data Science Certificate',
          timestamp: '1 hour ago',
          score: 92
        },
        {
          id: '4',
          type: 'milestone',
          user: 'Alex Rodriguez',
          action: 'reached 30-day learning streak',
          timestamp: '2 hours ago',
          score: 90
        }
      ],
      topPerformers: [
        {
          id: '1',
          name: 'Sarah Johnson',
          score: 98,
          courses: 12,
          streak: 45
        },
        {
          id: '2',
          name: 'Mike Chen',
          score: 95,
          courses: 10,
          streak: 38
        },
        {
          id: '3',
          name: 'Emma Wilson',
          score: 93,
          courses: 8,
          streak: 42
        },
        {
          id: '4',
          name: 'Alex Rodriguez',
          score: 91,
          courses: 9,
          streak: 30
        }
      ]
    }
    
    setData(dashboardData)
    setIsLoading(false)
  }

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <TrendingUp className="w-5 h-5 text-green-400" />
      case 'achievement': return <Award className="w-5 h-5 text-yellow-400" />
      case 'warning': return <Activity className="w-5 h-5 text-orange-400" />
      case 'info': return <Brain className="w-5 h-5 text-blue-400" />
      default: return <BarChart3 className="w-5 h-5 text-slate-400" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-500/20 bg-green-900/20'
      case 'achievement': return 'border-yellow-500/20 bg-yellow-900/20'
      case 'warning': return 'border-orange-500/20 bg-orange-900/20'
      case 'info': return 'border-blue-500/20 bg-blue-900/20'
      default: return 'border-slate-500/20 bg-slate-900/20'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <Users className="w-4 h-4 text-blue-400" />
      case 'completion': return <BookOpen className="w-4 h-4 text-green-400" />
      case 'achievement': return <Award className="w-4 h-4 text-yellow-400" />
      case 'milestone': return <Target className="w-4 h-4 text-purple-400" />
      default: return <Activity className="w-4 h-4 text-slate-400" />
    }
  }

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-slate-400">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Loading Dashboard...</span>
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
        <div className="text-center">
          <BarChart3 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Dashboard Unavailable</h3>
          <p className="text-slate-400">Unable to load dashboard data</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-700 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">KSRLearner Analytics</h3>
            <p className="text-sm text-slate-400">Custom Learning Dashboard</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
            className="bg-slate-700 text-white px-3 py-1 rounded-lg text-sm border border-slate-600"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          
          <button
            onClick={handleRefresh}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title="Refresh Dashboard"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleFullscreen}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="p-6 space-y-6">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-400" />
              <div>
                <div className="text-2xl font-bold text-white">{data.overview.totalStudents.toLocaleString()}</div>
                <div className="text-slate-400 text-sm">Total Students</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="w-8 h-8 text-green-400" />
              <div>
                <div className="text-2xl font-bold text-white">{data.overview.activeCourses}</div>
                <div className="text-slate-400 text-sm">Active Courses</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-purple-400" />
              <div>
                <div className="text-2xl font-bold text-white">{data.overview.completedLessons.toLocaleString()}</div>
                <div className="text-slate-400 text-sm">Lessons Completed</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Award className="w-8 h-8 text-yellow-400" />
              <div>
                <div className="text-2xl font-bold text-white">{data.overview.averageScore}%</div>
                <div className="text-slate-400 text-sm">Average Score</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="w-8 h-8 text-orange-400" />
              <div>
                <div className="text-2xl font-bold text-white">{data.overview.totalHours.toLocaleString()}</div>
                <div className="text-slate-400 text-sm">Total Hours</div>
              </div>
            </div>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-red-400" />
              <div>
                <div className="text-2xl font-bold text-white">{data.overview.streak}</div>
                <div className="text-slate-400 text-sm">Day Streak</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Chart */}
          <div className="bg-slate-700/50 rounded-lg p-6">
            <h4 className="text-white font-medium mb-4">Weekly Performance</h4>
            <div className="space-y-3">
              {data.performance.weekly.map((day, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 text-slate-300 text-sm">{day.day}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Score: {day.score}%</span>
                      <span>Lessons: {day.lessons}</span>
                      <span>Hours: {day.hours}</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${day.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-slate-700/50 rounded-lg p-6">
            <h4 className="text-white font-medium mb-4">Category Performance</h4>
            <div className="space-y-3">
              {data.performance.categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                    <span className="text-slate-300 text-sm">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-white text-sm">{category.score}%</div>
                    <div className="text-slate-400 text-xs">{category.students} students</div>
                    <div className={`text-xs ${category.trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {category.trend > 0 ? '+' : ''}{category.trend}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* AI Insights */}
          <div className="bg-slate-700/50 rounded-lg p-6">
            <h4 className="text-white font-medium mb-4 flex items-center">
              <Brain className="w-5 h-5 mr-2 text-purple-400" />
              AI Insights
            </h4>
            <div className="space-y-3">
              {data.insights.map((insight) => (
                <div key={insight.id} className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}>
                  <div className="flex items-center space-x-2 mb-1">
                    {getInsightIcon(insight.type)}
                    <span className="text-white font-medium text-sm">{insight.title}</span>
                    {insight.value && (
                      <span className="text-xs px-2 py-1 bg-slate-600 rounded-full text-slate-300">
                        {insight.value}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-300 text-sm">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-700/50 rounded-lg p-6">
            <h4 className="text-white font-medium mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-400" />
              Recent Activity
            </h4>
            <div className="space-y-3">
              {data.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="mt-1">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm">
                      <span className="font-medium">{activity.user}</span> {activity.action}
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-slate-400 text-xs">{activity.timestamp}</span>
                      {activity.score && (
                        <span className="text-green-400 text-xs font-medium">{activity.score}%</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Performers */}
        <div className="bg-slate-700/50 rounded-lg p-6">
          <h4 className="text-white font-medium mb-4 flex items-center">
            <Award className="w-5 h-5 mr-2 text-yellow-400" />
            Top Performers
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.topPerformers.map((performer, index) => (
              <div key={performer.id} className="bg-slate-800/50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-white font-medium">{performer.name}</div>
                    <div className="text-slate-400 text-sm">Score: {performer.score}%</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-slate-300">
                    <span className="text-slate-400">Courses:</span> {performer.courses}
                  </div>
                  <div className="text-slate-300">
                    <span className="text-slate-400">Streak:</span> {performer.streak}d
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
