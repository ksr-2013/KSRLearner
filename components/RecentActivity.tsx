'use client'

interface Activity {
  id: string
  type: 'quiz' | 'typing' | 'puzzle'
  title: string
  score?: number
  wpm?: number
  completed: boolean
  timestamp: string
}

interface RecentActivityProps {
  activities: Activity[]
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz': return '📚'
      case 'typing': return '⚡'
      case 'puzzle': return '🧩'
      default: return '📝'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'quiz': return 'text-blue-400'
      case 'typing': return 'text-purple-400'
      case 'puzzle': return 'text-orange-400'
      default: return 'text-gray-400'
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const activityTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - activityTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-slate-400'
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="mr-2">📈</span>
        Recent Activity
      </h2>
      
      {activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🎯</div>
          <div className="text-slate-400 mb-2">No recent activity</div>
          <div className="text-slate-500 text-sm">Start learning to see your progress here!</div>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.slice(0, 5).map((activity) => (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-colors">
              <div className="text-2xl">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="text-white font-medium truncate">{activity.title}</div>
                  <div className="text-slate-400 text-sm">{formatTimeAgo(activity.timestamp)}</div>
                </div>
                <div className="flex items-center space-x-4 mt-1">
                  <div className={`text-sm ${getActivityColor(activity.type)}`}>
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </div>
                  {activity.score !== undefined && (
                    <div className={`text-sm font-medium ${getScoreColor(activity.score)}`}>
                      {activity.score}%
                    </div>
                  )}
                  {activity.wpm !== undefined && (
                    <div className="text-sm text-purple-400 font-medium">
                      {activity.wpm} WPM
                    </div>
                  )}
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    activity.completed 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {activity.completed ? 'Completed' : 'In Progress'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {activities.length > 5 && (
        <div className="mt-4 text-center">
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            View all activities →
          </button>
        </div>
      )}
    </div>
  )
}
