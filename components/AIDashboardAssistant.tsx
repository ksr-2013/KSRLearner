'use client'

import { useState } from 'react'
import { Bot, TrendingUp, Target, BookOpen, X, Loader2, BarChart3 } from 'lucide-react'

interface AIDashboardAssistantProps {
  userStats: {
    totalQuizzes: number
    totalTypingTests: number
    totalPuzzles: number
    averageScore: number
    totalTimeSpent: number
  }
  recentActivities: any[]
  learningStreak: number
}

export default function AIDashboardAssistant({
  userStats,
  recentActivities,
  learningStreak
}: AIDashboardAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [assistanceType, setAssistanceType] = useState<'insights' | 'recommendations' | 'goals'>('insights')

  const getAIPrompt = () => {
    const basePrompt = `You are an AI learning coach analyzing a student's progress dashboard.

Current Statistics:
- Total Quizzes Completed: ${userStats.totalQuizzes}
- Total Typing Tests: ${userStats.totalTypingTests}
- Total Puzzles Solved: ${userStats.totalPuzzles}
- Average Score: ${userStats.averageScore}%
- Total Time Spent: ${userStats.totalTimeSpent} minutes
- Learning Streak: ${learningStreak} days

Recent Activities: ${recentActivities.slice(0, 5).map(activity => 
  `${activity.type}: ${activity.title} - ${activity.score || activity.wpm || 'completed'}`
).join(', ')}

Please provide ${assistanceType === 'insights' ? 'detailed insights about learning patterns, strengths, and areas for improvement' : assistanceType === 'recommendations' ? 'personalized learning recommendations and next steps' : 'suggested learning goals and milestones based on current progress'}.

Keep your response encouraging, actionable, and specific to their learning journey.`

    return basePrompt
  }

  const handleAIRequest = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/groq-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: getAIPrompt(),
          context: 'dashboard-assistant'
        })
      })

      const data = await response.json()
      setAiResponse(data.response || 'Sorry, I could not provide assistance at this time.')
    } catch (error) {
      setAiResponse('Sorry, there was an error getting AI assistance.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          title="Get AI Learning Coach"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>

      {/* AI Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-3xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">AI Learning Coach</h3>
                  <p className="text-slate-400 text-sm">Personalized Learning Insights</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-blue-400">{userStats.totalQuizzes}</div>
                  <div className="text-slate-400 text-xs">Quizzes</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-400">{userStats.totalTypingTests}</div>
                  <div className="text-slate-400 text-xs">Typing Tests</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-purple-400">{userStats.totalPuzzles}</div>
                  <div className="text-slate-400 text-xs">Puzzles</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-yellow-400">{learningStreak}</div>
                  <div className="text-slate-400 text-xs">Day Streak</div>
                </div>
              </div>

              {/* Assistance Type Selector */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setAssistanceType('insights')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    assistanceType === 'insights'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Insights
                </button>
                <button
                  onClick={() => setAssistanceType('recommendations')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    assistanceType === 'recommendations'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Target className="w-4 h-4 inline mr-2" />
                  Recommendations
                </button>
                <button
                  onClick={() => setAssistanceType('goals')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    assistanceType === 'goals'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Goals
                </button>
              </div>

              {/* AI Response */}
              <div className="bg-slate-700/30 rounded-lg p-4 min-h-[250px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                    <span className="ml-3 text-slate-300">AI Coach is analyzing your progress...</span>
                  </div>
                ) : aiResponse ? (
                  <div className="text-slate-300 whitespace-pre-wrap">{aiResponse}</div>
                ) : (
                  <div className="text-center text-slate-400">
                    <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Click "Get AI Insights" to receive personalized coaching</p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <button
                  onClick={() => setAiResponse('')}
                  className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
                <button
                  onClick={handleAIRequest}
                  disabled={isLoading}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all"
                >
                  {isLoading ? 'Analyzing...' : 'Get AI Insights'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
