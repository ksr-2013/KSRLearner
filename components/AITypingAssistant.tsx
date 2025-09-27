'use client'

import { useState } from 'react'
import { Bot, Target, TrendingUp, BookOpen, X, Loader2 } from 'lucide-react'

interface AITypingAssistantProps {
  wpm: number
  accuracy: number
  errors: number
  currentText: string
  category: string
  difficulty: string
}

export default function AITypingAssistant({
  wpm,
  accuracy,
  errors,
  currentText,
  category,
  difficulty
}: AITypingAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [assistanceType, setAssistanceType] = useState<'tips' | 'analysis' | 'practice'>('tips')

  const getAIPrompt = () => {
    const basePrompt = `You are an AI typing coach helping with ${difficulty} level typing practice.

Current Performance:
- WPM: ${wpm}
- Accuracy: ${accuracy}%
- Errors: ${errors}
- Category: ${category}
- Text: "${currentText}"

Please provide ${assistanceType === 'tips' ? 'practical typing improvement tips' : assistanceType === 'analysis' ? 'detailed analysis of current performance and areas for improvement' : 'suggested practice exercises and techniques'}.

Keep your response concise, actionable, and encouraging.`

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
          context: 'typing-assistant'
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

  const getPerformanceColor = () => {
    if (wpm >= 60) return 'text-green-400'
    if (wpm >= 40) return 'text-blue-400'
    if (wpm >= 20) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getAccuracyColor = () => {
    if (accuracy >= 95) return 'text-green-400'
    if (accuracy >= 90) return 'text-blue-400'
    if (accuracy >= 80) return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <>
      {/* AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          title="Get AI Typing Coach"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>

      {/* AI Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">AI Typing Coach</h3>
                  <p className="text-slate-400 text-sm">{difficulty} Level - {category}</p>
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
              {/* Performance Overview */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className={`text-2xl font-bold ${getPerformanceColor()}`}>{wpm}</div>
                  <div className="text-slate-400 text-sm">WPM</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className={`text-2xl font-bold ${getAccuracyColor()}`}>{accuracy}%</div>
                  <div className="text-slate-400 text-sm">Accuracy</div>
                </div>
                <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-400">{errors}</div>
                  <div className="text-slate-400 text-sm">Errors</div>
                </div>
              </div>

              {/* Assistance Type Selector */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setAssistanceType('tips')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    assistanceType === 'tips'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Target className="w-4 h-4 inline mr-2" />
                  Tips
                </button>
                <button
                  onClick={() => setAssistanceType('analysis')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    assistanceType === 'analysis'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <TrendingUp className="w-4 h-4 inline mr-2" />
                  Analysis
                </button>
                <button
                  onClick={() => setAssistanceType('practice')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    assistanceType === 'practice'
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Practice
                </button>
              </div>

              {/* AI Response */}
              <div className="bg-slate-700/30 rounded-lg p-4 min-h-[200px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-8 h-8 animate-spin text-green-400" />
                    <span className="ml-3 text-slate-300">AI Coach is analyzing...</span>
                  </div>
                ) : aiResponse ? (
                  <div className="text-slate-300 whitespace-pre-wrap">{aiResponse}</div>
                ) : (
                  <div className="text-center text-slate-400">
                    <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Click "Get AI Help" to receive personalized coaching</p>
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
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all"
                >
                  {isLoading ? 'Analyzing...' : 'Get AI Help'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
