'use client'

import { useState } from 'react'
import { Bot, Lightbulb, Brain, Target, X, Loader2 } from 'lucide-react'

interface AIPuzzleSolverProps {
  puzzleTitle: string
  puzzleType: string
  difficulty: string
  currentPuzzle: any
}

export default function AIPuzzleSolver({
  puzzleTitle,
  puzzleType,
  difficulty,
  currentPuzzle
}: AIPuzzleSolverProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState('')
  const [helpType, setHelpType] = useState<'hint' | 'approach' | 'solution'>('hint')

  const getAIPrompt = () => {
    const basePrompt = `You are an AI puzzle-solving assistant helping with a ${difficulty} level ${puzzleType} puzzle.

Puzzle: "${puzzleTitle}"
Type: ${puzzleType}
Difficulty: ${difficulty}

${currentPuzzle ? `Puzzle Details: ${JSON.stringify(currentPuzzle, null, 2)}` : ''}

Please provide ${helpType === 'hint' ? 'a subtle hint to guide the solver without giving away the answer' : helpType === 'approach' ? 'a strategic approach and methodology for solving this type of puzzle' : 'a step-by-step solution with explanations'}.

Keep your response educational and encourage critical thinking.`

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
          context: 'puzzle-solver'
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
      {/* AI Solver Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          title="Get AI Puzzle Help"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>

      {/* AI Solver Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white">AI Puzzle Solver</h3>
                  <p className="text-slate-400 text-sm">{difficulty} Level - {puzzleType}</p>
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
              {/* Puzzle Info */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2">Current Puzzle:</h4>
                <p className="text-slate-300 text-sm">{puzzleTitle}</p>
              </div>

              {/* Help Type Selector */}
              <div className="flex space-x-2">
                <button
                  onClick={() => setHelpType('hint')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    helpType === 'hint'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Lightbulb className="w-4 h-4 inline mr-2" />
                  Hint
                </button>
                <button
                  onClick={() => setHelpType('approach')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    helpType === 'approach'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Brain className="w-4 h-4 inline mr-2" />
                  Approach
                </button>
                <button
                  onClick={() => setHelpType('solution')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    helpType === 'solution'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  <Target className="w-4 h-4 inline mr-2" />
                  Solution
                </button>
              </div>

              {/* AI Response */}
              <div className="bg-slate-700/30 rounded-lg p-4 min-h-[200px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
                    <span className="ml-3 text-slate-300">AI is analyzing the puzzle...</span>
                  </div>
                ) : aiResponse ? (
                  <div className="text-slate-300 whitespace-pre-wrap">{aiResponse}</div>
                ) : (
                  <div className="text-center text-slate-400">
                    <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Click "Get AI Help" to receive puzzle assistance</p>
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
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 text-white px-6 py-2 rounded-lg font-medium transition-all"
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
