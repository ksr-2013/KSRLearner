'use client'

import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Brain, FileText, CheckCircle, AlertCircle, Loader2, Star, TrendingUp, Award } from 'lucide-react'

interface EvaluationResult {
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
  suggestions: string[]
  overallGrade: string
}

export default function AIExamEvaluatorPage() {
  const [examText, setExamText] = useState('')
  const [examType, setExamType] = useState('essay')
  const [subject, setSubject] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!examText.trim()) {
      setError('Please enter exam content to evaluate')
      return
    }

    setIsEvaluating(true)
    setError('')
    setResult(null)

    try {
      const response = await fetch('/api/ai-exam-evaluator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examText,
          examType,
          subject,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to evaluate exam')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during evaluation')
    } finally {
      setIsEvaluating(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getGradeColor = (grade: string) => {
    if (grade === 'A' || grade === 'A+') return 'text-green-400'
    if (grade === 'B' || grade === 'B+') return 'text-blue-400'
    if (grade === 'C' || grade === 'C+') return 'text-yellow-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">AI Exam Evaluator</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Get instant, intelligent feedback on your exams using advanced AI analysis. 
            Upload your exam content and receive detailed evaluation with scores, feedback, and improvement suggestions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <FileText className="w-6 h-6 mr-3 text-blue-400" />
              Submit Your Exam
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Exam Type
                </label>
                <select
                  value={examType}
                  onChange={(e) => setExamType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="essay">Essay</option>
                  <option value="short-answer">Short Answer</option>
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="problem-solving">Problem Solving</option>
                  <option value="creative-writing">Creative Writing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Subject/Topic
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g., Mathematics, English Literature, Science"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Exam Content
                </label>
                <textarea
                  value={examText}
                  onChange={(e) => setExamText(e.target.value)}
                  placeholder="Paste your exam answers, essay, or problem solutions here..."
                  rows={12}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {error && (
                <div className="flex items-center p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                  <span className="text-red-400">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isEvaluating}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-3" />
                    Evaluate Exam
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Section */}
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <Award className="w-6 h-6 mr-3 text-yellow-400" />
              Evaluation Results
            </h2>

            {!result && !isEvaluating && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-slate-400">Submit your exam to see AI-powered evaluation results</p>
              </div>
            )}

            {isEvaluating && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                </div>
                <p className="text-slate-400">AI is analyzing your exam...</p>
                <p className="text-sm text-slate-500 mt-2">This may take a few moments</p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                {/* Score and Grade */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                      {result.score}%
                    </div>
                    <div className="text-slate-400 text-sm">Score</div>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4 text-center">
                    <div className={`text-3xl font-bold ${getGradeColor(result.overallGrade)}`}>
                      {result.overallGrade}
                    </div>
                    <div className="text-slate-400 text-sm">Grade</div>
                  </div>
                </div>

                {/* Overall Feedback */}
                <div className="bg-slate-700 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                    Overall Feedback
                  </h3>
                  <p className="text-slate-300 leading-relaxed">{result.feedback}</p>
                </div>

                {/* Strengths */}
                {result.strengths.length > 0 && (
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      Strengths
                    </h3>
                    <ul className="space-y-2">
                      {result.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start">
                          <Star className="w-4 h-4 text-green-400 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-slate-300">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Areas for Improvement */}
                {result.improvements.length > 0 && (
                  <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      Areas for Improvement
                    </h3>
                    <ul className="space-y-2">
                      {result.improvements.map((improvement, index) => (
                        <li key={index} className="flex items-start">
                          <AlertCircle className="w-4 h-4 text-yellow-400 mr-2 mt-1 flex-shrink-0" />
                          <span className="text-slate-300">{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggestions */}
                {result.suggestions.length > 0 && (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                      <Brain className="w-5 h-5 mr-2" />
                      Suggestions
                    </h3>
                    <ul className="space-y-2">
                      {result.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-2 h-2 bg-blue-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                          <span className="text-slate-300">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Use Our AI Exam Evaluator?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instant Feedback</h3>
              <p className="text-slate-400">
                Get immediate, detailed feedback on your exam performance without waiting for manual grading.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Analysis</h3>
              <p className="text-slate-400">
                Advanced NLP technology provides comprehensive analysis of content, structure, and quality.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Improvement Focused</h3>
              <p className="text-slate-400">
                Receive specific suggestions and actionable advice to enhance your academic performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
