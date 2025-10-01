'use client'

import { useState } from 'react'

interface ProgressData {
  date: string
  quizzes: number
  typing: number
  puzzles: number
}

interface ProgressChartProps {
  progress: ProgressData[]
}

export default function ProgressChart({ progress }: ProgressChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('week')

  // Generate sample data if none provided
  const generateSampleData = (period: string) => {
    const data: ProgressData[] = []
    const days = period === 'week' ? 7 : period === 'month' ? 30 : 365
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      data.push({
        date: date.toISOString().split('T')[0],
        quizzes: Math.floor(Math.random() * 5),
        typing: Math.floor(Math.random() * 3),
        puzzles: Math.floor(Math.random() * 4)
      })
    }
    
    return data
  }

  const chartData = progress.length > 0 ? progress : generateSampleData(selectedPeriod)
  
  const maxValue = Math.max(
    ...chartData.flatMap(d => [d.quizzes, d.typing, d.puzzles])
  )
  const isAllZero = chartData.every(d => (d.quizzes + d.typing + d.puzzles) === 0)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    if (selectedPeriod === 'week') {
      return date.toLocaleDateString('en-US', { weekday: 'short' })
    } else if (selectedPeriod === 'month') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } else {
      return date.toLocaleDateString('en-US', { month: 'short' })
    }
  }

  const getBarHeight = (value: number) => {
    return maxValue > 0 ? (value / maxValue) * 100 : 0
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">📊</span>
          Learning Progress
        </h2>
        
        <div className="flex space-x-2">
          {(['week', 'month', 'year'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {period.charAt(0).toUpperCase() + period.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {chartData.length === 0 || isAllZero ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📈</div>
          <div className="text-slate-400 mb-2">No progress data yet</div>
          <div className="text-slate-500 text-sm">Save a quiz, typing test, or puzzle to see progress here.</div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Chart */}
          <div className="h-64 flex items-end space-x-2">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center space-y-1">
                <div className="w-full flex flex-col justify-end h-48 space-y-1">
                  <div
                    className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t"
                    style={{ height: `${getBarHeight(data.quizzes)}%` }}
                    title={`Quizzes: ${data.quizzes}`}
                  />
                  <div
                    className="bg-gradient-to-t from-purple-500 to-purple-400 rounded-t"
                    style={{ height: `${getBarHeight(data.typing)}%` }}
                    title={`Typing: ${data.typing}`}
                  />
                  <div
                    className="bg-gradient-to-t from-orange-500 to-orange-400 rounded-t"
                    style={{ height: `${getBarHeight(data.puzzles)}%` }}
                    title={`Puzzles: ${data.puzzles}`}
                  />
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {formatDate(data.date)}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center space-x-6 pt-4 border-t border-slate-700">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-sm text-slate-300">Quizzes</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded"></div>
              <span className="text-sm text-slate-300">Typing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span className="text-sm text-slate-300">Puzzles</span>
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {chartData.reduce((sum, d) => sum + d.quizzes, 0)}
              </div>
              <div className="text-slate-400 text-sm">Total Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {chartData.reduce((sum, d) => sum + d.typing, 0)}
              </div>
              <div className="text-slate-400 text-sm">Typing Sessions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {chartData.reduce((sum, d) => sum + d.puzzles, 0)}
              </div>
              <div className="text-slate-400 text-sm">Puzzles Solved</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
