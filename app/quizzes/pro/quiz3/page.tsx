'use client'

import { useState } from 'react'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Trophy, Zap } from 'lucide-react'

export default function ProQuiz3() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])

  const questions = [
    {
      question: "What is a zero-day vulnerability?",
      options: [
        "A bug that only appears at midnight",
        "A security flaw that is unknown to the software vendor",
        "A virus that spreads in zero seconds",
        "A password that expires in zero days"
      ],
      correct: 1,
      explanation: "A zero-day vulnerability is a security flaw that is unknown to the software vendor and has no patch available, making it highly dangerous."
    },
    {
      question: "What is the purpose of a VPN?",
      options: [
        "To make internet faster",
        "To create a secure, encrypted connection over a public network",
        "To block all internet traffic",
        "To store files online"
      ],
      correct: 1,
      explanation: "A VPN (Virtual Private Network) creates a secure, encrypted tunnel for internet traffic, protecting privacy and data security."
    },
    {
      question: "What is two-factor authentication (2FA)?",
      options: [
        "Using two passwords",
        "A security method requiring two different types of verification",
        "Having two email accounts",
        "Using two antivirus programs"
      ],
      correct: 1,
      explanation: "2FA requires two different types of verification (like a password and a code sent to your phone) for enhanced security."
    },
    {
      question: "What is the purpose of disk defragmentation?",
      options: [
        "To clean viruses",
        "To organize file fragments and improve disk performance",
        "To delete old files",
        "To backup data"
      ],
      correct: 1,
      explanation: "Disk defragmentation reorganizes fragmented files to improve disk performance and access speed."
    },
    {
      question: "What is a firewall in network security?",
      options: [
        "A physical wall around computers",
        "A security system that monitors and controls network traffic",
        "A type of antivirus software",
        "A backup system"
      ],
      correct: 1,
      explanation: "A firewall monitors and controls incoming and outgoing network traffic based on security rules."
    },
    {
      question: "What is the purpose of system optimization?",
      options: [
        "To make the computer look better",
        "To improve system performance and efficiency",
        "To install new software",
        "To change the desktop background"
      ],
      correct: 1,
      explanation: "System optimization improves performance by cleaning unnecessary files, optimizing settings, and improving resource usage."
    },
    {
      question: "What is encryption in cybersecurity?",
      options: [
        "Making files smaller",
        "Converting data into a code to prevent unauthorized access",
        "Deleting files permanently",
        "Moving files to different folders"
      ],
      correct: 1,
      explanation: "Encryption converts data into a coded format that can only be read by authorized parties with the correct decryption key."
    },
    {
      question: "What is the purpose of a system restore point?",
      options: [
        "To backup all files",
        "To return the system to a previous working state",
        "To install updates",
        "To change system settings"
      ],
      correct: 1,
      explanation: "A system restore point allows you to return your computer to a previous state if something goes wrong."
    },
    {
      question: "What is malware?",
      options: [
        "Software that helps computers",
        "Malicious software designed to harm computers or steal data",
        "A type of hardware",
        "A programming language"
      ],
      correct: 1,
      explanation: "Malware is malicious software designed to damage, disrupt, or gain unauthorized access to computer systems."
    },
    {
      question: "What is the purpose of regular software updates?",
      options: [
        "To change the software interface",
        "To fix security vulnerabilities and improve performance",
        "To make software slower",
        "To remove features"
      ],
      correct: 1,
      explanation: "Software updates fix security vulnerabilities, bugs, and add new features to improve security and performance."
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
    if (percentage >= 80) return 'Excellent! You have mastered computer security and optimization!'
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
              <span className="text-sm text-dark-400">Pro Level - Quiz 3</span>
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
