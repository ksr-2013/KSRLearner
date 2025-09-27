'use client'

import { useState } from 'react'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import SaveScore from '../../../../components/SaveScore'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Trophy, Zap } from 'lucide-react'

export default function LegendQuiz1() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])

  const questions = [
    {
      question: "What is the time complexity of a binary search algorithm?",
      options: [
        "O(1)",
        "O(log n)",
        "O(n)",
        "O(n²)"
      ],
      correct: 1,
      explanation: "Binary search has a time complexity of O(log n) because it divides the search space in half with each iteration."
    },
    {
      question: "Which design pattern is used to ensure only one instance of a class exists?",
      options: [
        "Factory Pattern",
        "Observer Pattern",
        "Singleton Pattern",
        "Strategy Pattern"
      ],
      correct: 2,
      explanation: "The Singleton pattern ensures that a class has only one instance and provides a global point of access to it."
    },
    {
      question: "What is the purpose of a load balancer in system architecture?",
      options: [
        "To increase storage capacity",
        "To distribute incoming network traffic across multiple servers",
        "To encrypt data transmission",
        "To backup data automatically"
      ],
      correct: 1,
      explanation: "A load balancer distributes incoming network traffic across multiple servers to ensure no single server becomes overwhelmed."
    },
    {
      question: "Which encryption algorithm is considered quantum-resistant?",
      options: [
        "RSA",
        "AES",
        "Lattice-based cryptography",
        "MD5"
      ],
      correct: 2,
      explanation: "Lattice-based cryptography is considered quantum-resistant because it's based on mathematical problems that quantum computers cannot easily solve."
    },
    {
      question: "What is the difference between microservices and monolithic architecture?",
      options: [
        "Microservices are always faster",
        "Microservices break applications into smaller, independent services",
        "Monolithic architecture is always better",
        "There is no difference"
      ],
      correct: 1,
      explanation: "Microservices architecture breaks applications into smaller, independent services that can be developed, deployed, and scaled independently."
    },
    {
      question: "What is the CAP theorem in distributed systems?",
      options: [
        "A theorem about computer architecture",
        "A theorem stating that a distributed system can only guarantee two out of three: Consistency, Availability, and Partition tolerance",
        "A theorem about network protocols",
        "A theorem about database design"
      ],
      correct: 1,
      explanation: "The CAP theorem states that a distributed system can only guarantee two out of three properties: Consistency, Availability, and Partition tolerance."
    },
    {
      question: "Which sorting algorithm has the best average-case time complexity?",
      options: [
        "Bubble Sort",
        "Quick Sort",
        "Insertion Sort",
        "Selection Sort"
      ],
      correct: 1,
      explanation: "Quick Sort has an average-case time complexity of O(n log n), which is optimal for comparison-based sorting algorithms."
    },
    {
      question: "What is the purpose of a circuit breaker pattern in software design?",
      options: [
        "To prevent electrical damage",
        "To handle failures gracefully and prevent cascading failures",
        "To improve performance",
        "To reduce memory usage"
      ],
      correct: 1,
      explanation: "The circuit breaker pattern handles failures gracefully by temporarily stopping operations when a failure threshold is reached, preventing cascading failures."
    },
    {
      question: "Which database transaction isolation level provides the highest consistency?",
      options: [
        "Read Uncommitted",
        "Read Committed",
        "Repeatable Read",
        "Serializable"
      ],
      correct: 3,
      explanation: "Serializable provides the highest level of consistency by ensuring that transactions are completely isolated from each other."
    },
    {
      question: "What is the purpose of a reverse proxy?",
      options: [
        "To hide the identity of clients",
        "To act as an intermediary for requests from clients seeking resources from servers",
        "To encrypt all traffic",
        "To block malicious requests"
      ],
      correct: 1,
      explanation: "A reverse proxy acts as an intermediary for requests from clients seeking resources from servers, providing load balancing, caching, and security benefits."
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
    if (percentage >= 80) return 'Legendary! You have exceptional advanced knowledge!'
    if (percentage >= 60) return 'Impressive! You\'re well on your way to becoming a legend!'
    return 'Keep studying! These advanced concepts require deep understanding!'
  }

  if (showResults) {
    return (
      <div className="min-h-screen">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
                title="Legendary Computer Mastery Quiz 1"
                score={Math.round((score / questions.length) * 100)}
                level="Legend"
                completed={true}
                details={{
                  correctAnswers: score,
                  totalQuestions: questions.length,
                  quizType: 'legend'
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button onClick={handleRestart} className="btn-primary">
                Try Again
              </button>
              <Link href="/quizzes/legend" className="btn-secondary">
                Back to Legend Quizzes
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
          <Link href="/quizzes/legend" className="flex items-center text-primary-400 hover:text-primary-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Legend Quizzes
          </Link>
          <div className="text-right">
            <div className="text-sm text-dark-400">Question {currentQuestion + 1} of {questions.length}</div>
            <div className="text-lg font-semibold text-white">Score: {score}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-dark-700 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="card mb-8">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-dark-400">Legend Level - Quiz 1</span>
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
                    : 'border-dark-600 hover:border-purple-500/50 hover:bg-dark-700/50 text-dark-300 hover:text-white'
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
              <h4 className="text-sm font-semibold text-purple-400 mb-2">Explanation:</h4>
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
