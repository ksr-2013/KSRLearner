'use client'

import { useState } from 'react'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import SaveScore from '../../../../components/SaveScore'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Trophy, Crown } from 'lucide-react'

export default function UltraLegendQuiz3() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])

  const questions = [
    {
      question: "What is the primary challenge in implementing a quantum computer with error correction?",
      options: [
        "Cost of materials",
        "Maintaining quantum coherence while performing error correction operations",
        "Software complexity",
        "Network connectivity"
      ],
      correct: 1,
      explanation: "The primary challenge is maintaining quantum coherence while performing error correction operations, as error correction itself can introduce additional decoherence."
    },
    {
      question: "What is the purpose of a zero-knowledge proof in cryptography?",
      options: [
        "To prove knowledge without revealing the knowledge itself",
        "To encrypt data",
        "To compress data",
        "To authenticate users"
      ],
      correct: 0,
      explanation: "Zero-knowledge proofs allow one party to prove they know something without revealing what they know, enabling privacy-preserving authentication and verification."
    },
    {
      question: "What is the primary advantage of using a blockchain for supply chain management?",
      options: [
        "It's always faster than traditional databases",
        "Immutable audit trail and transparency across all participants",
        "It uses less storage",
        "It's easier to implement"
      ],
      correct: 1,
      explanation: "Blockchain provides an immutable audit trail and transparency across all participants, enabling trust and verification in supply chain operations."
    },
    {
      question: "What is the purpose of a neural network with attention mechanisms?",
      options: [
        "To improve focus",
        "To allow the model to focus on relevant parts of the input when making predictions",
        "To reduce memory usage",
        "To speed up training"
      ],
      correct: 1,
      explanation: "Attention mechanisms allow neural networks to focus on relevant parts of the input when making predictions, improving performance on tasks like machine translation and text generation."
    },
    {
      question: "What is the primary challenge in implementing a distributed consensus algorithm?",
      options: [
        "Network speed",
        "Handling Byzantine failures while maintaining consistency",
        "Memory usage",
        "CPU performance"
      ],
      correct: 1,
      explanation: "The primary challenge is handling Byzantine failures (arbitrary failures) while maintaining consistency, requiring sophisticated algorithms like PBFT or Raft."
    },
    {
      question: "What is the purpose of a homomorphic encryption scheme?",
      options: [
        "To encrypt data",
        "To allow computation on encrypted data without decryption",
        "To compress data",
        "To authenticate users"
      ],
      correct: 1,
      explanation: "Homomorphic encryption allows computations to be performed on encrypted data without needing to decrypt it first, enabling privacy-preserving cloud computing."
    },
    {
      question: "What is the primary challenge in implementing a real-time recommendation system?",
      options: [
        "Data storage",
        "Balancing accuracy with real-time responsiveness",
        "User interface design",
        "Network bandwidth"
      ],
      correct: 1,
      explanation: "The primary challenge is balancing accuracy with real-time responsiveness, requiring sophisticated algorithms that can provide good recommendations quickly."
    },
    {
      question: "What is the purpose of a federated learning system?",
      options: [
        "To improve learning speed",
        "To train machine learning models across decentralized data sources without sharing raw data",
        "To reduce memory usage",
        "To improve accuracy"
      ],
      correct: 1,
      explanation: "Federated learning enables training machine learning models across decentralized data sources without sharing raw data, preserving privacy while enabling collaborative learning."
    },
    {
      question: "What is the primary challenge in implementing a quantum-resistant cryptographic system?",
      options: [
        "Cost",
        "Ensuring security against both classical and quantum attacks",
        "Performance",
        "Compatibility"
      ],
      correct: 1,
      explanation: "The primary challenge is ensuring security against both classical and quantum attacks, requiring new mathematical foundations that resist quantum algorithms like Shor's algorithm."
    },
    {
      question: "What is the purpose of a differential privacy mechanism?",
      options: [
        "To improve privacy",
        "To provide privacy guarantees while enabling useful data analysis",
        "To encrypt data",
        "To authenticate users"
      ],
      correct: 1,
      explanation: "Differential privacy provides mathematical privacy guarantees while enabling useful data analysis, allowing organizations to share insights without compromising individual privacy."
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
    if (percentage >= 80) return 'Ultra Legendary! You have mastered the most advanced computing concepts!'
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
                title="Ultra-Legendary Computer Mastery Quiz 3"
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
              <span className="text-sm text-dark-400">Ultra Legend Level - Quiz 3</span>
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
