'use client'

import { useState } from 'react'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import SaveScore from '../../../../components/SaveScore'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Trophy, Crown } from 'lucide-react'

export default function UltraLegendQuiz2() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])

  const questions = [
    {
      question: "What is the primary challenge in implementing a distributed database with strong consistency?",
      options: [
        "Network latency",
        "Achieving consensus across all nodes while maintaining availability",
        "Storage costs",
        "Backup complexity"
      ],
      correct: 1,
      explanation: "The primary challenge is achieving consensus across all nodes while maintaining availability, as guaranteed by the CAP theorem which states you can only have two out of three: Consistency, Availability, and Partition tolerance."
    },
    {
      question: "What is the purpose of a side-channel attack in cryptography?",
      options: [
        "To attack from the side of a building",
        "To extract secret information through unintended channels like power consumption or timing",
        "To attack network side channels",
        "To bypass firewalls"
      ],
      correct: 1,
      explanation: "Side-channel attacks extract secret information through unintended channels like power consumption, electromagnetic emissions, timing, or sound, rather than through direct cryptographic weaknesses."
    },
    {
      question: "What is the primary advantage of using a microservices architecture?",
      options: [
        "It's always faster than monolithic",
        "Independent deployment and scaling of services",
        "It uses less memory",
        "It's easier to debug"
      ],
      correct: 1,
      explanation: "Microservices allow independent deployment and scaling of services, enabling teams to work independently and deploy updates without affecting the entire system."
    },
    {
      question: "What is the purpose of a circuit breaker in distributed systems?",
      options: [
        "To prevent electrical damage",
        "To handle failures gracefully and prevent cascading failures",
        "To improve performance",
        "To reduce memory usage"
      ],
      correct: 1,
      explanation: "A circuit breaker handles failures gracefully by temporarily stopping operations when a failure threshold is reached, preventing cascading failures and allowing the system to recover."
    },
    {
      question: "What is the primary challenge in implementing real-time collaborative editing?",
      options: [
        "Network speed",
        "Achieving eventual consistency while maintaining real-time responsiveness",
        "User interface design",
        "File storage"
      ],
      correct: 1,
      explanation: "The primary challenge is achieving eventual consistency while maintaining real-time responsiveness, requiring sophisticated conflict resolution algorithms like Operational Transformation or Conflict-free Replicated Data Types (CRDTs)."
    },
    {
      question: "What is the purpose of a bloom filter in distributed systems?",
      options: [
        "To filter out spam",
        "To efficiently test set membership with possible false positives",
        "To compress data",
        "To encrypt communications"
      ],
      correct: 1,
      explanation: "Bloom filters efficiently test whether an element is a member of a set, with possible false positives but no false negatives, making them useful for reducing network queries in distributed systems."
    },
    {
      question: "What is the primary challenge in implementing a distributed lock?",
      options: [
        "Network latency",
        "Ensuring mutual exclusion across all nodes while handling failures",
        "Clock synchronization",
        "Memory management"
      ],
      correct: 1,
      explanation: "The primary challenge is ensuring mutual exclusion across all nodes while handling failures, requiring sophisticated algorithms like the Redlock algorithm or consensus-based approaches."
    },
    {
      question: "What is the purpose of a leader election algorithm in distributed systems?",
      options: [
        "To choose the best leader",
        "To ensure only one node acts as coordinator at a time",
        "To improve performance",
        "To reduce network traffic"
      ],
      correct: 1,
      explanation: "Leader election ensures only one node acts as coordinator at a time, preventing conflicts and enabling centralized decision-making in distributed systems."
    },
    {
      question: "What is the primary challenge in implementing a distributed cache?",
      options: [
        "Memory usage",
        "Maintaining cache consistency across all nodes",
        "Network bandwidth",
        "CPU usage"
      ],
      correct: 1,
      explanation: "The primary challenge is maintaining cache consistency across all nodes, requiring sophisticated invalidation strategies and consistency protocols."
    },
    {
      question: "What is the purpose of a gossip protocol in distributed systems?",
      options: [
        "To spread rumors",
        "To disseminate information across nodes in a decentralized manner",
        "To improve security",
        "To reduce latency"
      ],
      correct: 1,
      explanation: "Gossip protocols disseminate information across nodes in a decentralized manner, providing eventual consistency and fault tolerance without requiring centralized coordination."
    }
  ]

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswers[currentQuestion] !== undefined) return
    
    const newSelectedAnswers = [...selectedAnswers]
    newSelectedAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newSelectedAnswers)

    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResults(false)
    setSelectedAnswers([])
  }

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 80) return 'text-emerald-400'
    if (percentage >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 80) return 'Ultra Legendary! You have mastered system architecture and design!'
    if (percentage >= 60) return 'Exceptional! You have truly legendary knowledge!'
    return 'Keep pushing! These are the most challenging concepts in technology!'
  }

  if (showResults) {
    return (
      <div className="min-h-screen">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h1>
              <p className="text-xl text-dark-300">Here are your results:</p>
            </div>

            <div className="card max-w-md mx-auto mb-8">
              <div className={`text-6xl font-bold mb-4 ${getScoreColor()}`}>
                {score}/{questions.length}
              </div>
              <div className="text-2xl font-semibold text-white mb-2">
                {Math.round((score / questions.length) * 100)}%
              </div>
              <p className="text-dark-300">{getScoreMessage()}</p>
            </div>

            <div className="max-w-md mx-auto mb-8">
              <SaveScore
                type="quiz"
                title="Ultra-Legendary Computer Mastery Quiz 2"
                score={Math.round((score / questions.length) * 100)}
                level="Ultra-Legend"
                completed={true}
                details={{
                  correctAnswers: score,
                  totalQuestions: questions.length,
                  quizType: 'ultra-legend'
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button onClick={handleRestart} className="btn-primary">
                Try Again
              </button>
              <Link href="/quizzes/ultra-legend" className="btn-secondary">
                Back to Ultra Legend Quizzes
              </Link>
            </div>

            <div className="text-left max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-white mb-4">Question Review:</h3>
              {questions.map((q, index) => (
                <div key={index} className="mb-4 p-4 bg-dark-800/50 rounded-lg border border-dark-600">
                  <div className="flex items-start space-x-3">
                    {selectedAnswers[index] === q.correct ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2">{q.question}</p>
                      <p className="text-sm text-dark-300 mb-2">
                        Your answer: {q.options[selectedAnswers[index]]}
                      </p>
                      {selectedAnswers[index] !== q.correct && (
                        <p className="text-sm text-emerald-400">
                          Correct answer: {q.options[q.correct]}
                        </p>
                      )}
                      <p className="text-xs text-dark-400 mt-2">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const isAnswered = selectedAnswers[currentQuestion] !== undefined

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/quizzes/ultra-legend" className="flex items-center text-primary-400 hover:text-primary-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Ultra Legend Quizzes
          </Link>
          <div className="text-right">
            <div className="text-sm text-dark-400">Question {currentQuestion + 1} of {questions.length}</div>
            <div className="text-lg font-semibold text-white">Score: {score}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-dark-700 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="card mb-8">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Crown className="w-5 h-5 text-red-400" />
              <span className="text-sm text-dark-400">Ultra Legend Level - Quiz 2</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">{currentQ.question}</h2>
          </div>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                  selectedAnswers[currentQuestion] === index
                    ? index === currentQ.correct
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-red-500 bg-red-500/10 text-red-400'
                    : selectedAnswers[currentQuestion] !== undefined && index === currentQ.correct
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-dark-600 hover:border-red-500/50 hover:bg-dark-700/50 text-dark-300 hover:text-white'
                } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === index
                      ? index === currentQ.correct
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-red-500 bg-red-500'
                      : 'border-dark-400'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      index === currentQ.correct ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <XCircle className="w-4 h-4 text-white" />
                      )
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className="mt-6 p-4 bg-dark-700/50 rounded-lg border border-dark-600">
              <h4 className="text-sm font-semibold text-red-400 mb-2">Explanation:</h4>
              <p className="text-dark-300 text-sm">{currentQ.explanation}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
