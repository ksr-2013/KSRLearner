'use client'

import { useState, useEffect } from 'react'
import { Activity, Users, BookOpen, Target, Zap, TrendingUp, Clock, Globe } from 'lucide-react'

interface RealTimeData {
  activeUsers: number
  currentLessons: number
  completedToday: number
  averageScore: number
  topCourse: string
  peakHour: string
  globalRank: number
  lastUpdate: string
}

interface LiveEvent {
  id: string
  type: 'enrollment' | 'completion' | 'achievement' | 'milestone'
  user: string
  action: string
  timestamp: string
  score?: number
}

export default function RealTimeAnalytics() {
  const [data, setData] = useState<RealTimeData | null>(null)
  const [events, setEvents] = useState<LiveEvent[]>([])
  const [isLive, setIsLive] = useState(true)

  useEffect(() => {
    // Initialize with sample data
    setData({
      activeUsers: 247,
      currentLessons: 89,
      completedToday: 156,
      averageScore: 87.3,
      topCourse: 'Advanced Python Programming',
      peakHour: '2:00 PM - 4:00 PM',
      globalRank: 12,
      lastUpdate: new Date().toLocaleTimeString()
    })

    // Simulate real-time events
    const eventInterval = setInterval(() => {
      const newEvent: LiveEvent = {
        id: Date.now().toString(),
        type: ['enrollment', 'completion', 'achievement', 'milestone'][Math.floor(Math.random() * 4)] as any,
        user: ['Sarah Johnson', 'Mike Chen', 'Emma Wilson', 'Alex Rodriguez', 'Lisa Park'][Math.floor(Math.random() * 5)],
        action: [
          'enrolled in Advanced Python',
          'completed JavaScript Fundamentals',
          'earned Data Science Certificate',
          'reached 30-day learning streak',
          'started Machine Learning course'
        ][Math.floor(Math.random() * 5)],
        timestamp: 'just now',
        score: Math.floor(Math.random() * 20) + 80
      }

      setEvents(prev => [newEvent, ...prev.slice(0, 9)])
    }, 3000)

    // Simulate data updates
    const dataInterval = setInterval(() => {
      setData(prev => prev ? {
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10) - 5,
        currentLessons: prev.currentLessons + Math.floor(Math.random() * 6) - 3,
        completedToday: prev.completedToday + Math.floor(Math.random() * 4),
        averageScore: Math.max(80, Math.min(95, prev.averageScore + (Math.random() - 0.5) * 2)),
        lastUpdate: new Date().toLocaleTimeString()
      } : null)
    }, 5000)

    return () => {
      clearInterval(eventInterval)
      clearInterval(dataInterval)
    }
  }, [])

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'enrollment': return <Users className="w-4 h-4 text-blue-400" />
      case 'completion': return <BookOpen className="w-4 h-4 text-green-400" />
      case 'achievement': return <Target className="w-4 h-4 text-yellow-400" />
      case 'milestone': return <Zap className="w-4 h-4 text-purple-400" />
      default: return <Activity className="w-4 h-4 text-slate-400" />
    }
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'enrollment': return 'border-blue-500/20 bg-blue-900/20'
      case 'completion': return 'border-green-500/20 bg-green-900/20'
      case 'achievement': return 'border-yellow-500/20 bg-yellow-900/20'
      case 'milestone': return 'border-purple-500/20 bg-purple-900/20'
      default: return 'border-slate-500/20 bg-slate-900/20'
    }
  }

  if (!data) {
    return (
      <div className="bg-slate-700/50 rounded-lg p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading real-time data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Live Status */}
      <div className="bg-slate-700/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-white font-medium flex items-center">
            <Activity className="w-5 h-5 mr-2 text-green-400" />
            Live Analytics
          </h4>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
            <span className="text-slate-400 text-sm">{isLive ? 'Live' : 'Offline'}</span>
            <span className="text-slate-500 text-xs">Updated: {data.lastUpdate}</span>
          </div>
        </div>

        {/* Real-time Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-slate-400 text-sm">Active Users</span>
            </div>
            <div className="text-2xl font-bold text-white">{data.activeUsers}</div>
            <div className="text-green-400 text-xs flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +12% from yesterday
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-5 h-5 text-green-400" />
              <span className="text-slate-400 text-sm">Current Lessons</span>
            </div>
            <div className="text-2xl font-bold text-white">{data.currentLessons}</div>
            <div className="text-blue-400 text-xs flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              In progress
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-5 h-5 text-purple-400" />
              <span className="text-slate-400 text-sm">Completed Today</span>
            </div>
            <div className="text-2xl font-bold text-white">{data.completedToday}</div>
            <div className="text-purple-400 text-xs flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              +8% from yesterday
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Globe className="w-5 h-5 text-yellow-400" />
              <span className="text-slate-400 text-sm">Global Rank</span>
            </div>
            <div className="text-2xl font-bold text-white">#{data.globalRank}</div>
            <div className="text-yellow-400 text-xs flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" />
              +3 positions
            </div>
          </div>
        </div>
      </div>

      {/* Live Events Feed */}
      <div className="bg-slate-700/50 rounded-lg p-6">
        <h4 className="text-white font-medium mb-4 flex items-center">
          <Activity className="w-5 h-5 mr-2 text-blue-400" />
          Live Activity Feed
        </h4>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {events.map((event) => (
            <div key={event.id} className={`p-3 rounded-lg border ${getEventColor(event.type)} animate-fadeIn`}>
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  {getEventIcon(event.type)}
                </div>
                <div className="flex-1">
                  <div className="text-white text-sm">
                    <span className="font-medium">{event.user}</span> {event.action}
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-slate-400 text-xs">{event.timestamp}</span>
                    {event.score && (
                      <span className="text-green-400 text-xs font-medium">{event.score}%</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-slate-700/50 rounded-lg p-6">
        <h4 className="text-white font-medium mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
          Performance Insights
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-2">Top Performing Course</div>
            <div className="text-white font-medium mb-1">{data.topCourse}</div>
            <div className="text-green-400 text-sm">Average Score: {data.averageScore}%</div>
          </div>
          
          <div className="bg-slate-800/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-2">Peak Learning Hours</div>
            <div className="text-white font-medium mb-1">{data.peakHour}</div>
            <div className="text-blue-400 text-sm">Highest activity period</div>
          </div>
        </div>
      </div>
    </div>
  )
}
