'use client'

import { useState } from 'react'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import SaveScore from '../../../../components/SaveScore'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Trophy, Zap } from 'lucide-react'

export default function ProQuiz2() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])

  const questions = [
    {
      question: "What is the purpose of version control systems like Git?",
      options: [
        "To make code run faster",
        "To track changes in code and collaborate with others",
        "To compile code into executable files",
        "To debug code automatically"
      ],
      correct: 1,
      explanation: "Version control systems track changes in code over time, allowing developers to collaborate, revert changes, and maintain code history."
    },
    {
      question: "What is an API in software development?",
      options: [
        "A type of programming language",
        "A set of rules for building software applications",
        "An interface that allows different software systems to communicate",
        "A database management system"
      ],
      correct: 2,
      explanation: "An API (Application Programming Interface) defines how different software components should interact and communicate with each other."
    },
    {
      question: "What is the difference between a compiler and an interpreter?",
      options: [
        "There is no difference",
        "A compiler translates code once, an interpreter translates code each time it runs",
        "A compiler is faster than an interpreter",
        "An interpreter only works with Python"
      ],
      correct: 1,
      explanation: "A compiler translates the entire program to machine code once, while an interpreter translates and executes code line by line each time."
    },
    {
      question: "What is object-oriented programming (OOP)?",
      options: [
        "Programming with only objects",
        "A programming paradigm that organizes code into objects and classes",
        "A type of database",
        "A way to make programs run faster"
      ],
      correct: 1,
      explanation: "OOP organizes code into objects that contain data and code, promoting reusability and maintainability."
    },
    {
      question: "What is a database index?",
      options: [
        "A list of all databases",
        "A data structure that improves database query performance",
        "A backup of the database",
        "A type of database table"
      ],
      correct: 1,
      explanation: "A database index is a data structure that improves the speed of data retrieval operations by creating a lookup table."
    },
    {
      question: "What is the purpose of unit testing?",
      options: [
        "To test the entire application",
        "To test individual components or functions in isolation",
        "To test the user interface",
        "To test database connections"
      ],
      correct: 1,
      explanation: "Unit testing verifies that individual components or functions work correctly in isolation, making debugging easier."
    },
    {
      question: "What is a software framework?",
      options: [
        "A type of computer hardware",
        "A pre-built structure that provides common functionality for applications",
        "A programming language",
        "A database system"
      ],
      correct: 1,
      explanation: "A framework provides a foundation and common functionality that developers can build upon, reducing development time."
    },
    {
      question: "What is the difference between synchronous and asynchronous programming?",
      options: [
        "There is no difference",
        "Synchronous executes code in order, asynchronous can execute code out of order",
        "Asynchronous is always faster",
        "Synchronous only works with databases"
      ],
      correct: 1,
      explanation: "Synchronous code executes in sequence, while asynchronous code can execute out of order, often used for non-blocking operations."
    },
    {
      question: "What is a software design pattern?",
      options: [
        "A way to make code look pretty",
        "A reusable solution to common software design problems",
        "A type of programming language",
        "A way to organize files"
      ],
      correct: 1,
      explanation: "Design patterns are proven solutions to common software design problems that promote code reusability and maintainability."
    },
    {
      question: "What is the purpose of dependency injection?",
      options: [
        "To make programs run faster",
        "To reduce coupling between components by providing dependencies externally",
        "To inject viruses into code",
        "To connect to databases"
      ],
      correct: 1,
      explanation: "Dependency injection reduces coupling between components by providing dependencies from outside, making code more testable and maintainable."
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
    if (percentage >= 80) return 'Excellent! You have strong software and programming knowledge!'
    if (percentage >= 60) return 'Good job! You\'re making great progress!'
    return 'Keep studying! Review the concepts and try again!'
  }

  if (showResults) {
    return (
      <div className="min-h-screen">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
                title="Advanced Computer Systems Quiz 2"
                score={Math.round((score / questions.length) * 100)}
                level="Pro"
                completed={true}
                details={{
                  correctAnswers: score,
                  totalQuestions: questions.length,
                  quizType: 'pro'
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button onClick={handleRestart} className="btn-primary">
                Try Again
              </button>
              <Link href="/quizzes/pro" className="btn-secondary">
                Back to Pro Quizzes
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
          <Link href="/quizzes/pro" className="flex items-center text-primary-400 hover:text-primary-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pro Quizzes
          </Link>
          <div className="text-right">
            <div className="text-sm text-dark-400">Question {currentQuestion + 1} of {questions.length}</div>
            <div className="text-lg font-semibold text-white">Score: {score}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-dark-700 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="card mb-8">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-green-400" />
              <span className="text-sm text-dark-400">Pro Level - Quiz 2</span>
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
                    : 'border-dark-600 hover:border-green-500/50 hover:bg-dark-700/50 text-dark-300 hover:text-white'
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
              <h4 className="text-sm font-semibold text-green-400 mb-2">Explanation:</h4>
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
