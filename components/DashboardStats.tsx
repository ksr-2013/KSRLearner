'use client'

interface Stats {
  totalQuizzes: number
  completedQuizzes: number
  averageScore: number
  totalTypingTests: number
  averageWPM: number
  puzzlesSolved: number
  streak: number
  level: string
}

interface DashboardStatsProps {
  stats: Stats
}

export default function DashboardStats({ stats }: DashboardStatsProps) {
  const completionRate = stats.totalQuizzes > 0 ? (stats.completedQuizzes / stats.totalQuizzes) * 100 : 0

  const statCards = [
    {
      title: 'Quizzes Completed',
      value: stats.completedQuizzes,
      total: stats.totalQuizzes,
      icon: '📚',
      color: 'blue',
      progress: completionRate
    },
    {
      title: 'Average Score',
      value: `${Math.round(stats.averageScore)}%`,
      icon: '🎯',
      color: 'green',
      progress: stats.averageScore
    },
    {
      title: 'Typing Speed',
      value: `${stats.averageWPM} WPM`,
      icon: '⚡',
      color: 'purple',
      progress: Math.min((stats.averageWPM / 100) * 100, 100)
    },
    {
      title: 'Puzzles Solved',
      value: stats.puzzlesSolved,
      icon: '🧩',
      color: 'orange',
      progress: Math.min((stats.puzzlesSolved / 10) * 100, 100)
    },
    {
      title: 'Current Streak',
      value: `${stats.streak} days`,
      icon: '🔥',
      color: 'red',
      progress: Math.min((stats.streak / 30) * 100, 100)
    },
    {
      title: 'Learning Level',
      value: stats.level,
      icon: '⭐',
      color: 'yellow',
      progress: 100
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      purple: 'from-purple-500 to-purple-600',
      orange: 'from-orange-500 to-orange-600',
      red: 'from-red-500 to-red-600',
      yellow: 'from-yellow-500 to-yellow-600'
    }
    return colors[color as keyof typeof colors] || 'from-gray-500 to-gray-600'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((card, index) => (
        <div key={index} className="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl">{card.icon}</div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{card.value}</div>
              <div className="text-slate-400 text-sm">{card.title}</div>
            </div>
          </div>
          
          {card.progress !== undefined && card.progress !== 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-slate-400">
                <span>Progress</span>
                <span>{Math.round(card.progress)}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${getColorClasses(card.color)} transition-all duration-300`}
                  style={{ width: `${Math.min(card.progress, 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
