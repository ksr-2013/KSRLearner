'use client'

import { useState } from 'react'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Trophy, Crown } from 'lucide-react'

export default function UltraLegendQuiz1() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])

  const questions = [
    {
      question: "What is the time complexity of the fastest known algorithm for matrix multiplication?",
      options: [
        "O(n²)",
        "O(n².807)",
        "O(n³)",
        "O(n log n)"
      ],
      correct: 1,
      explanation: "The Coppersmith–Winograd algorithm achieves O(n².807) complexity, which is currently the fastest known algorithm for matrix multiplication."
    },
    {
      question: "Which consensus algorithm is used in blockchain networks to achieve Byzantine fault tolerance?",
      options: [
        "Proof of Work",
        "Proof of Stake",
        "Practical Byzantine Fault Tolerance (PBFT)",
        "All of the above"
      ],
      correct: 3,
      explanation: "All three are consensus algorithms used in blockchain networks. PBFT is specifically designed for Byzantine fault tolerance, while PoW and PoS are alternative consensus mechanisms."
    },
    {
      question: "What is the primary challenge in implementing quantum error correction?",
      options: [
        "Quantum computers are too expensive",
        "Quantum bits are fragile and decohere quickly",
        "Quantum algorithms are too complex",
        "Quantum software is not available"
      ],
      correct: 1,
      explanation: "Quantum bits (qubits) are extremely fragile and decohere quickly due to environmental interactions, making quantum error correction essential but challenging to implement."
    },
    {
      question: "In distributed systems, what is the 'FLP impossibility' result?",
      options: [
        "A theorem about network latency",
        "A proof that consensus is impossible in asynchronous systems with even one faulty process",
        "A result about fault tolerance",
        "A theorem about distributed databases"
      ],
      correct: 1,
      explanation: "The FLP impossibility result proves that in asynchronous distributed systems, it's impossible to achieve consensus when even one process can fail, making perfect fault tolerance unattainable."
    },
    {
      question: "What is the primary advantage of homomorphic encryption?",
      options: [
        "It's faster than traditional encryption",
        "It allows computation on encrypted data without decryption",
        "It uses less memory",
        "It's more secure than AES"
      ],
      correct: 1,
      explanation: "Homomorphic encryption allows computations to be performed on encrypted data without needing to decrypt it first, enabling privacy-preserving cloud computing."
    },
    {
      question: "Which machine learning technique is most effective for handling vanishing gradients in deep neural networks?",
      options: [
        "Batch normalization",
        "Residual connections (skip connections)",
        "Dropout",
        "Learning rate scheduling"
      ],
      correct: 1,
      explanation: "Residual connections (skip connections) help mitigate the vanishing gradient problem by providing direct paths for gradients to flow through the network, enabling training of very deep networks."
    },
    {
      question: "What is the primary challenge in implementing zero-knowledge proofs at scale?",
      options: [
        "They require too much computational power",
        "They are too complex to understand",
        "They generate proofs that are too large for practical use",
        "They are not secure enough"
      ],
      correct: 2,
      explanation: "Zero-knowledge proofs can generate very large proof sizes, making them impractical for many real-world applications. Recent advances like zk-SNARKs and zk-STARKs aim to address this."
    },
    {
      question: "In computer architecture, what is the primary benefit of speculative execution?",
      options: [
        "It reduces power consumption",
        "It improves instruction-level parallelism by executing instructions that may not be needed",
        "It increases memory bandwidth",
        "It reduces cache misses"
      ],
      correct: 1,
      explanation: "Speculative execution improves instruction-level parallelism by executing instructions that may not be needed, allowing the CPU to continue working while waiting for branch resolution."
    },
    {
      question: "What is the primary challenge in implementing fully homomorphic encryption?",
      options: [
        "It's too slow for practical use",
        "It requires quantum computers",
        "It's not secure enough",
        "It's too complex to implement"
      ],
      correct: 0,
      explanation: "Fully homomorphic encryption is currently too slow for most practical applications, with operations taking orders of magnitude longer than on unencrypted data."
    },
    {
      question: "Which distributed algorithm is most effective for achieving consensus in partially synchronous networks?",
      options: [
        "Paxos",
        "Raft",
        "Viewstamped Replication",
        "All are equally effective"
      ],
      correct: 3,
      explanation: "All three algorithms (Paxos, Raft, and Viewstamped Replication) are equally effective for achieving consensus in partially synchronous networks, with different trade-offs in complexity and performance."
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
    if (percentage >= 80) return 'Ultra Legendary! You are among the elite of tech experts!'
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
              <span className="text-sm text-dark-400">Ultra Legend Level - Quiz 1</span>
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
