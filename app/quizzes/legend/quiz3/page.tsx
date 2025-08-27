'use client'

import { useState } from 'react'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Trophy, Zap } from 'lucide-react'

export default function LegendQuiz3() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])

  const questions = [
    {
      question: "What is the time complexity of the A* pathfinding algorithm?",
      options: [
        "O(1)",
        "O(n)",
        "O(n log n)",
        "O(b^d) where b is branching factor and d is depth"
      ],
      correct: 3,
      explanation: "A* has a time complexity of O(b^d) where b is the branching factor and d is the depth of the solution, making it exponential in the worst case."
    },
    {
      question: "What is the purpose of a Bloom filter in computer science?",
      options: [
        "To filter out spam emails",
        "To test whether an element is a member of a set with possible false positives",
        "To sort data efficiently",
        "To encrypt data"
      ],
      correct: 1,
      explanation: "A Bloom filter is a space-efficient probabilistic data structure used to test whether an element is a member of a set, with possible false positives but no false negatives."
    },
    {
      question: "What is the difference between a stack and a queue?",
      options: [
        "There is no difference",
        "Stack is LIFO (Last In, First Out), Queue is FIFO (First In, First Out)",
        "Stack is FIFO, Queue is LIFO",
        "Stack is faster than Queue"
      ],
      correct: 1,
      explanation: "A stack follows LIFO principle (Last In, First Out) while a queue follows FIFO principle (First In, First Out)."
    },
    {
      question: "What is the purpose of garbage collection in programming?",
      options: [
        "To clean up temporary files",
        "To automatically reclaim memory that is no longer in use by the program",
        "To organize code files",
        "To improve program performance"
      ],
      correct: 1,
      explanation: "Garbage collection automatically reclaims memory that is no longer in use, preventing memory leaks and simplifying memory management for developers."
    },
    {
      question: "What is a race condition in concurrent programming?",
      options: [
        "A condition where programs race to finish first",
        "A situation where the behavior of a program depends on the relative timing of events",
        "A type of programming competition",
        "A condition where programs run too fast"
      ],
      correct: 1,
      explanation: "A race condition occurs when the behavior of a program depends on the relative timing of events, often leading to unpredictable and incorrect results."
    },
    {
      question: "What is the purpose of a hash table?",
      options: [
        "To store data in a sorted manner",
        "To provide average O(1) time complexity for insertions and lookups",
        "To encrypt data",
        "To compress data"
      ],
      correct: 1,
      explanation: "Hash tables provide average O(1) time complexity for insertions and lookups by using a hash function to map keys to array indices."
    },
    {
      question: "What is the difference between a binary tree and a binary search tree?",
      options: [
        "There is no difference",
        "Binary search tree has a specific ordering property where left child < parent < right child",
        "Binary tree is always balanced",
        "Binary search tree is always faster"
      ],
      correct: 1,
      explanation: "A binary search tree has the property that for any node, all values in the left subtree are less than the node's value, and all values in the right subtree are greater."
    },
    {
      question: "What is the purpose of a semaphore in concurrent programming?",
      options: [
        "To send signals between processes",
        "To control access to a common resource by multiple processes or threads",
        "To encrypt inter-process communication",
        "To measure program performance"
      ],
      correct: 1,
      explanation: "A semaphore is a synchronization primitive used to control access to a common resource by multiple processes or threads, preventing race conditions."
    },
    {
      question: "What is the time complexity of merge sort?",
      options: [
        "O(n)",
        "O(n log n)",
        "O(n²)",
        "O(log n)"
      ],
      correct: 1,
      explanation: "Merge sort has a time complexity of O(n log n) in all cases, making it a stable and predictable sorting algorithm."
    },
    {
      question: "What is the purpose of a deadlock in operating systems?",
      options: [
        "To prevent system crashes",
        "A situation where two or more processes are blocked waiting for each other to release resources",
        "To improve system performance",
        "To manage memory efficiently"
      ],
      correct: 1,
      explanation: "A deadlock occurs when two or more processes are blocked waiting for each other to release resources, causing the system to become unresponsive."
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
    if (percentage >= 80) return 'Legendary! You have mastered software engineering and algorithms!'
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
              <span className="text-sm text-dark-400">Legend Level - Quiz 3</span>
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
