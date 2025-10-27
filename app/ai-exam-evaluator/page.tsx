'use client'

import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Brain, FileText, CheckCircle, AlertCircle, Loader2, Star, TrendingUp, Award, BookOpen } from 'lucide-react'

interface EvaluationResult {
  score: number
  marksObtained: number
  totalMarks: number
  percentage: number
  feedback: string
  strengths: string[]
  improvements: string[]
  suggestions: string[]
  overallGrade: string
  gradeDescription: string
  performanceLevel: string
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

export default function AIExamConductorPage() {
  // Subject selection
  const [selectedSubject, setSelectedSubject] = useState('')
  const [customSubject, setCustomSubject] = useState('')
  
  // Question generation states
  const [generatedQuestions, setGeneratedQuestions] = useState<GeneratedQuestion[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState('')
  
  // Exam answering states
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Evaluation states
  const [result, setResult] = useState<EvaluationResult | null>(null)
  const [error, setError] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const subjects = [
    'Mathematics',
    'Science',
    'English',
    'History',
    'Geography',
    'Computer Science',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Psychology',
    'Literature'
  ]

  const handleGenerateQuestions = async () => {
    const subjectToUse = selectedSubject || customSubject
    
    if (!subjectToUse.trim()) {
      setGenerationError('Please select or enter a subject')
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
          topic: subjectToUse,
          questionType: 'multiple-choice',
          difficulty: 'medium',
          numberOfQuestions: 5,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate questions')
      }

      const data = await response.json()
      setGeneratedQuestions(data.questions)
      setCurrentQuestionIndex(0)
      setUserAnswers({})
      setShowResults(false)
    } catch (err) {
      setGenerationError(err instanceof Error ? err.message : 'An error occurred during question generation')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveScore = async () => {
    if (!result) {
      setError('No exam results to save')
      return
    }

    setIsSaving(true)
    setError('')

    try {
      const response = await fetch('/api/scores', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'ai-exam',
          subject: selectedSubject || customSubject,
          score: result.score,
          level: result.overallGrade,
          details: {
            marksObtained: result.marksObtained,
            totalMarks: result.totalMarks,
            percentage: result.percentage,
            performanceLevel: result.performanceLevel
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save score')
      }

      const data = await response.json()
      
      // Show success message (you can use a toast or alert here)
      alert('Score saved successfully to your dashboard!')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save score')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmitExam = async () => {
    if (generatedQuestions.length === 0) {
      setError('No questions available')
      return
    }

    setIsSubmitting(true)
    setError('')
    setResult(null)

    try {
      // Collect user's answers
      const answersText = generatedQuestions.map((q, index) => {
        const userAnswer = userAnswers[q.id] || 'Not answered'
        return `Question ${index + 1}: ${q.question}\nYour Answer: ${userAnswer}\n`
      }).join('\n')

      const response = await fetch('/api/ai-exam-evaluator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          examText: answersText,
          examType: 'multiple-choice',
          subject: selectedSubject || customSubject,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to evaluate exam')
      }

      const data = await response.json()
      setResult(data)
      setShowResults(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during evaluation')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400'
    if (score >= 60) return 'text-blue-400'
    return 'text-yellow-400'
  }

  const getGradeColor = (grade: string) => {
    if (grade === 'A' || grade === 'A+') return 'text-green-400'
    if (grade === 'B' || grade === 'B+') return 'text-blue-400'
    if (grade === 'C' || grade === 'C+') return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getPerformanceColor = (level: string) => {
    if (level === 'Excellent') return 'text-green-400'
    if (level === 'Good') return 'text-blue-400'
    if (level === 'Satisfactory') return 'text-yellow-400'
    if (level === 'Needs Improvement') return 'text-orange-400'
    return 'text-red-400'
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-900 rounded-xl flex items-center justify-center shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">AI Exam Conductor</h1>
          <p className="text-xl text-slate-400 max-w-3xl mx-auto">
            Select a subject, answer AI-generated questions, and receive comprehensive evaluation with marks, grades, and detailed feedback.
          </p>
        </div>

        {!generatedQuestions.length ? (
          /* Subject Selection and Question Generation */
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-blue-400" />
              Select Subject
            </h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-3">
                  Choose a Subject
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => {
                        setSelectedSubject(subject)
                        setCustomSubject('')
                      }}
                      className={`px-4 py-3 rounded-lg border transition-all duration-200 ${
                        selectedSubject === subject
                          ? 'bg-blue-700 border-blue-600 text-white shadow-lg'
                          : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500 hover:text-white'
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>

              <div className="text-center text-slate-400">OR</div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Enter Custom Subject
                </label>
                <input
                  type="text"
                  value={customSubject}
                  onChange={(e) => {
                    setCustomSubject(e.target.value)
                    setSelectedSubject('')
                  }}
                  placeholder="e.g., Quantum Physics, Ancient History"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {generationError && (
                <div className="flex items-center p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                  <span className="text-red-400">{generationError}</span>
                </div>
              )}

              <button
                onClick={handleGenerateQuestions}
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-800 hover:to-blue-950 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Generating Questions...
                  </>
                ) : (
                  <>
                    <Brain className="w-5 h-5 mr-3" />
                    Generate Questions
                  </>
                )}
              </button>
            </div>
          </div>
        ) : showResults && result ? (
          /* Results Display */
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-700/20 to-blue-900/20 border border-blue-600/30 rounded-xl p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-2">Exam Conduction Complete</h2>
              <p className="text-blue-400 text-lg">{selectedSubject || customSubject}</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
                <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                  {result.score}%
                </div>
                <div className="text-slate-400 text-sm">Percentage</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
                <div className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                  {result.marksObtained}/{result.totalMarks}
                </div>
                <div className="text-slate-400 text-sm">Marks</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
                <div className={`text-3xl font-bold ${getGradeColor(result.overallGrade)}`}>
                  {result.overallGrade}
                </div>
                <div className="text-slate-400 text-sm">Grade</div>
              </div>
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 text-center">
                <div className={`text-lg font-bold ${getPerformanceColor(result.performanceLevel)}`}>
                  {result.performanceLevel}
                </div>
                <div className="text-slate-400 text-sm">Performance</div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-700/20 to-blue-900/20 border border-blue-600/30 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-400 mb-3 flex items-center">
                <Award className="w-5 h-5 mr-2" />
                Grade Description
              </h3>
              <p className="text-slate-300">{result.gradeDescription}</p>
            </div>

            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                Overall Feedback
              </h3>
              <p className="text-slate-300 leading-relaxed">{result.feedback}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-400 mb-3 flex items-center">
                  <Star className="w-5 h-5 mr-2" />
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

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
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
            </div>

            {error && (
              <div className="flex items-center p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <span className="text-red-400">{error}</span>
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleSaveScore}
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Award className="w-5 h-5 mr-3" />
                    Save Score to Dashboard
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setGeneratedQuestions([])
                  setResult(null)
                  setShowResults(false)
                  setUserAnswers({})
                  setSelectedSubject('')
                  setCustomSubject('')
                }}
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-3" />
                Take Another Exam
              </button>
            </div>
          </div>
        ) : (
          /* Question Display and Answering */
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-700/20 to-blue-900/20 border border-blue-600/30 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedSubject || customSubject}</h2>
                  <p className="text-blue-400">Question {currentQuestionIndex + 1} of {generatedQuestions.length}</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-400">Progress</div>
                  <div className="text-lg font-bold text-white">
                    {Math.round(((currentQuestionIndex + 1) / generatedQuestions.length) * 100)}%
                  </div>
                </div>
              </div>
              <div className="mt-4 w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / generatedQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-2xl font-semibold text-white">
                  {generatedQuestions[currentQuestionIndex].question}
                </h3>
                <span className="px-3 py-1 bg-blue-700 text-white rounded-full text-sm font-medium">
                  {generatedQuestions[currentQuestionIndex].difficulty}
                </span>
              </div>

              {generatedQuestions[currentQuestionIndex].options && (
                <div className="space-y-3">
                  {generatedQuestions[currentQuestionIndex].options.map((option, optIndex) => (
                    <button
                      key={optIndex}
                      onClick={() => {
                        setUserAnswers({
                          ...userAnswers,
                          [generatedQuestions[currentQuestionIndex].id]: option
                        })
                      }}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                        userAnswers[generatedQuestions[currentQuestionIndex].id] === option
                          ? 'bg-blue-700 border-blue-600 text-white'
                          : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-blue-500 hover:text-white'
                      }`}
                    >
                      <span className="font-medium mr-3">{String.fromCharCode(65 + optIndex)})</span>
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex(currentQuestionIndex - 1)
                  }
                }}
                disabled={currentQuestionIndex === 0}
                className="flex-1 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Previous
              </button>
              
              {currentQuestionIndex < generatedQuestions.length - 1 ? (
                <button
                  onClick={() => {
                    if (currentQuestionIndex < generatedQuestions.length - 1) {
                      setCurrentQuestionIndex(currentQuestionIndex + 1)
                    }
                  }}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmitExam}
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-3" />
                      Submit Exam
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}