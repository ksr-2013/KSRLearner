'use client'

import { useState } from 'react'
import { Bot, Lightbulb, X, Loader2 } from 'lucide-react'

interface AIQuizHelperProps {
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
  difficulty: string
  topic: string
}

export default function AIQuizHelper({
  question,
  options,
  correctAnswer,
  explanation,
  difficulty,
  topic
}: AIQuizHelperProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [hintType, setHintType] = useState<'hint' | 'explanation' | 'strategy'>('hint')

  const getAIPrompt = () => {
    const basePrompt = `You are an AI tutor helping with a ${difficulty} level ${topic} quiz question.

Question: "${question}"
Options: ${options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join(', ')}

Please provide a ${hintType === 'hint' ? 'subtle hint without giving away the answer' : hintType === 'explanation' ? 'detailed explanation of the concept' : 'learning strategy for this type of question'}.

Keep your response concise and educational. Don't reveal the correct answer directly.`

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
          context: 'quiz-helper'
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
      {/* AI Helper Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          title="Get AI Help"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>

      {/* AI Helper Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">AI Quiz Assistant</h3>
                  <p className="text-slate-400 text-sm">{difficulty} Level - {topic}</p>
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
              {/* Question Preview */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Current Question:</h4>
                <p className="text-slate-300 text-sm">{question}</p>
              </div>

              {/* Hint Type Selector */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setHintType('hint')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    hintType === 'hint'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Lightbulb className="w-4 h-4 inline mr-2" />
                  Hint
                </button>
                <button
                  onClick={() => setHintType('explanation')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    hintType === 'explanation'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Book
                </button>
                <button
                  onClick={() => setHintType('strategy')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    hintType === 'strategy'
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Strategy
                </button>
              </div>

              {/* AI Response */}
              <div className="bg-slate-700/30 rounded-lg p-4 min-h-[200px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
                    <span className="ml-3 text-slate-300">AI is thinking...</span>
                  </div>
                ) : aiResponse ? (
                  <div className="text-slate-300 whitespace-pre-wrap">{aiResponse}</div>
                ) : (
                  <div className="text-center text-slate-400">
                    <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Click "Get AI Help" to receive assistance</p>
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
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all"
                >
                  {isLoading ? 'Getting Help...' : 'Get AI Help'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
