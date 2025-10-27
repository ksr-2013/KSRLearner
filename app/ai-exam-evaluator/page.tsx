'use client'

import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Brain, FileText, CheckCircle, AlertCircle, Loader2, Star, TrendingUp, Award, Plus, BookOpen, Lightbulb } from 'lucide-react'

interface EvaluationResult {
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
  suggestions: string[]
  overallGrade: string
}

interface GeneratedQuestion {
  id: string
  question: string
  type: string
  options?: string[]
  correctAnswer?: string
  explanation?: string
  difficulty: string
}

export default function AIExamEvaluatorPage() {
  const [activeTab, setActiveTab] = useState<'evaluate' | 'generate'>('evaluate')
  
  // Evaluation states
  const [examText, setExamText] = useState('')
  const [examType, setExamType] = useState('essay')
  const [subject, setSubject] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const [error, setError] = useState('')
  
  // Question generation states
  const [topic, setTopic] = useState('')
  const [questionType, setQuestionType] = useState('multiple-choice')
  const [difficulty, setDifficulty] = useState('medium')
  const [numberOfQuestions, setNumberOfQuestions] = useState(5)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [generationError, setGenerationError] = useState('')

  const handleGenerateQuestions = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!topic.trim()) {
      setGenerationError('Please enter a topic to generate questions')
      return
    }

    setIsGenerating(true)
    setGenerationError('')
    setGeneratedQuestions([])

    try {
      const response = await fetch('/api/ai-question-generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          questionType,
          difficulty,
          numberOfQuestions,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate questions')
      }

      const data = await response.json()
      setGeneratedQuestions(data.questions)
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'An error occurred during question generation')
    } finally {
      setIsGenerating(false)
    }
  }

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
          <h1 className="text-4xl font-bold text-white mb-4">AI Exam Tools</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Evaluate your exams with AI-powered analysis or generate custom questions for any topic. 
            Get instant feedback, scores, and improvement suggestions.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800 rounded-lg p-1 border border-slate-700">
            <button
              onClick={() => setActiveTab('evaluate')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'evaluate'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              Evaluate Exam
            </button>
            <button
              onClick={() => setActiveTab('generate')}
              className={`px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'generate'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Lightbulb className="w-5 h-5 inline mr-2" />
              Generate Questions
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'evaluate' ? (
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
        ) : (
          /* Question Generation Tab */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Question Generation Form */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <Lightbulb className="w-6 h-6 mr-3 text-yellow-400" />
                Generate Questions
              </h2>
              
              <form onSubmit={handleGenerateQuestions} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Topic/Subject
                  </label>
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Mathematics, World History, Computer Science"
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Question Type
                  </label>
                  <select
                    value={questionType}
                    onChange={(e) => setQuestionType(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="multiple-choice">Multiple Choice</option>
                    <option value="essay">Essay</option>
                    <option value="short-answer">Short Answer</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Number of Questions
                  </label>
                  <select
                    value={numberOfQuestions}
                    onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={3}>3 Questions</option>
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                  </select>
                </div>

                {generationError && (
                  <div className="flex items-center p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                    <span className="text-red-400">{generationError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isGenerating}
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-3" />
                      Generate Questions
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Generated Questions Display */}
            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-green-400" />
                Generated Questions
              </h2>

              {!generatedQuestions.length && !isGenerating && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-400">Enter a topic to generate custom questions</p>
                </div>
              )}

              {isGenerating && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  </div>
                  <p className="text-slate-400">AI is generating questions...</p>
                  <p className="text-sm text-slate-500 mt-2">This may take a few moments</p>
                </div>
              )}

              {generatedQuestions.length > 0 && (
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {generatedQuestions.map((question, index) => (
                    <div key={question.id} className="bg-slate-700 rounded-lg p-6 border border-slate-600">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-lg font-semibold text-white">
                          Question {index + 1}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          question.difficulty === 'easy' ? 'bg-green-900/30 text-green-400' :
                          question.difficulty === 'medium' ? 'bg-yellow-900/30 text-yellow-400' :
                          'bg-red-900/30 text-red-400'
                        }`}>
                          {question.difficulty}
                        </span>
                      </div>
                      
                      <p className="text-slate-300 mb-4">{question.question}</p>
                      
                      {question.options && question.options.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center">
                              <span className="text-slate-400 mr-3">
                                {String.fromCharCode(65 + optIndex)})
                              </span>
                              <span className={`${
                                option === question.correctAnswer ? 'text-green-400 font-medium' : 'text-slate-300'
                              }`}>
                                {option}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {question.explanation && (
                        <div className="bg-slate-600 rounded-lg p-3">
                          <p className="text-sm text-slate-300">
                            <strong className="text-blue-400">Explanation:</strong> {question.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Why Use Our AI Exam Tools?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Instant Evaluation</h3>
              <p className="text-slate-400">
                Get immediate, detailed feedback on your exam performance without waiting for manual grading.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Auto Question Generation</h3>
              <p className="text-slate-400">
                Generate custom questions for any topic with different difficulty levels and question types.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Analysis</h3>
              <p className="text-slate-400">
                Advanced AI technology provides comprehensive analysis and intelligent question generation.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
