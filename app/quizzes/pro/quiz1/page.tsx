'use client'

import { useState } from 'react'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Trophy, Zap } from 'lucide-react'

export default function ProQuiz1() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])

  const questions = [
    {
      question: "What is the difference between RAM and ROM?",
      options: [
        "RAM is faster than ROM",
        "RAM is volatile (loses data when powered off), ROM is non-volatile",
        "ROM is used for graphics, RAM for text",
        "There is no difference"
      ],
      correct: 1,
      explanation: "RAM (Random Access Memory) is volatile and loses data when power is off, while ROM (Read Only Memory) retains data permanently."
    },
    {
      question: "Which protocol is used for secure web browsing?",
      options: [
        "HTTP",
        "FTP",
        "HTTPS",
        "SMTP"
      ],
      correct: 2,
      explanation: "HTTPS (HTTP Secure) uses SSL/TLS encryption to provide secure communication over the web."
    },
    {
      question: "What is the purpose of a DNS server?",
      options: [
        "To store website files",
        "To convert domain names to IP addresses",
        "To provide email services",
        "To block malicious websites"
      ],
      correct: 1,
      explanation: "DNS (Domain Name System) servers translate human-readable domain names into IP addresses that computers can understand."
    },
    {
      question: "Which of these is NOT a type of computer network?",
      options: [
        "LAN",
        "WAN",
        "MAN",
        "PAN"
      ],
      correct: 3,
      explanation: "LAN (Local Area Network), WAN (Wide Area Network), and MAN (Metropolitan Area Network) are real network types. PAN stands for Personal Area Network, which is also a valid network type."
    },
    {
      question: "What is virtualization in computing?",
      options: [
        "Creating fake websites",
        "Running multiple operating systems on one physical machine",
        "Making computers faster",
        "Connecting to the internet"
      ],
      correct: 1,
      explanation: "Virtualization allows multiple operating systems to run simultaneously on a single physical computer, each in its own virtual environment."
    },
    {
      question: "Which file system is commonly used in modern Windows?",
      options: [
        "FAT32",
        "NTFS",
        "EXT4",
        "HFS+"
      ],
      correct: 1,
      explanation: "NTFS (New Technology File System) is the primary file system used in modern Windows operating systems."
    },
    {
      question: "What is the purpose of a cache in a computer system?",
      options: [
        "To store permanent data",
        "To speed up data access by storing frequently used information",
        "To connect to the internet",
        "To display graphics"
      ],
      correct: 1,
      explanation: "Cache stores frequently accessed data to speed up system performance by reducing the time needed to access data from slower storage."
    },
    {
      question: "Which of these is a type of malware?",
      options: [
        "Firewall",
        "Antivirus",
        "Trojan Horse",
        "Router"
      ],
      correct: 2,
      explanation: "A Trojan Horse is a type of malware that disguises itself as legitimate software to gain access to a system."
    },
    {
      question: "What does RAID stand for in storage systems?",
      options: [
        "Random Access Integrated Drive",
        "Redundant Array of Independent Disks",
        "Remote Access Internet Drive",
        "Read Access Integrated Data"
      ],
      correct: 1,
      explanation: "RAID (Redundant Array of Independent Disks) is a storage technology that combines multiple disk drives for performance and/or redundancy."
    },
    {
      question: "Which programming paradigm focuses on objects and classes?",
      options: [
        "Procedural programming",
        "Object-oriented programming",
        "Functional programming",
        "Assembly programming"
      ],
      correct: 1,
      explanation: "Object-oriented programming (OOP) organizes code into objects and classes, focusing on data and behavior encapsulation."
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
    if (percentage >= 80) return 'Excellent! You have strong intermediate knowledge!'
    if (percentage >= 60) return 'Good job! You\'re on the right track!'
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
              <span className="text-sm text-dark-400">Pro Level - Quiz 1</span>
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
