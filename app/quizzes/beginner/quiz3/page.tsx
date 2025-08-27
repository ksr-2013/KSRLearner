'use client'

import { useState } from 'react'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Trophy, Star } from 'lucide-react'

export default function BeginnerQuiz3() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])

  const questions = [
    {
      question: "What is the purpose of an antivirus program?",
      options: [
        "To make the computer faster",
        "To protect against harmful software and viruses",
        "To connect to the internet",
        "To store files"
      ],
      correct: 1,
      explanation: "An antivirus program is designed to detect, prevent, and remove malicious software and viruses from your computer."
    },
    {
      question: "What does 'backup' mean in computing?",
      options: [
        "Making a copy of important data",
        "Deleting old files",
        "Updating software",
        "Installing new programs"
      ],
      correct: 0,
      explanation: "A backup is a copy of important data stored in a safe location to protect against data loss."
    },
    {
      question: "Which of these is a good password practice?",
      options: [
        "Using your name as password",
        "Using the same password for all accounts",
        "Using a mix of letters, numbers, and symbols",
        "Sharing your password with friends"
      ],
      correct: 2,
      explanation: "A strong password should include a mix of uppercase and lowercase letters, numbers, and special symbols."
    },
    {
      question: "What is 'phishing'?",
      options: [
        "A type of computer game",
        "A fishing simulation program",
        "A cyber attack that tricks people into revealing personal information",
        "A way to catch computer viruses"
      ],
      correct: 2,
      explanation: "Phishing is a cyber attack where attackers pretend to be trustworthy sources to steal personal information."
    },
    {
      question: "What is the function of a webcam?",
      options: [
        "To play sound",
        "To capture video and images",
        "To connect to WiFi",
        "To store files"
      ],
      correct: 1,
      explanation: "A webcam is a camera that captures video and images, often used for video calls and online meetings."
    },
    {
      question: "What does 'download' mean?",
      options: [
        "To send files to another computer",
        "To copy files from the internet to your computer",
        "To delete files from your computer",
        "To move files between folders"
      ],
      correct: 1,
      explanation: "Downloading means transferring files from the internet or another computer to your local device."
    },
    {
      question: "Which of these is a social media platform?",
      options: [
        "Microsoft Excel",
        "Facebook",
        "Adobe Photoshop",
        "Windows Media Player"
      ],
      correct: 1,
      explanation: "Facebook is a social media platform that allows people to connect and share content online."
    },
    {
      question: "What is 'streaming'?",
      options: [
        "Playing music from a CD",
        "Watching videos or listening to audio in real-time over the internet",
        "Downloading files to watch later",
        "Sending emails"
      ],
      correct: 1,
      explanation: "Streaming allows you to watch videos or listen to audio content in real-time without downloading the entire file first."
    },
    {
      question: "What is the purpose of a search engine?",
      options: [
        "To create websites",
        "To find information on the internet",
        "To send emails",
        "To play games"
      ],
      correct: 1,
      explanation: "A search engine helps you find information on the internet by searching through web pages and content."
    },
    {
      question: "What does 'URL' stand for?",
      options: [
        "Uniform Resource Locator",
        "Universal Resource Link",
        "United Resource Location",
        "Uniform Resource Link"
      ],
      correct: 0,
      explanation: "URL stands for Uniform Resource Locator, which is the address of a specific webpage or resource on the internet."
    }
  ]

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswers[currentQuestion] !== undefined) return // Prevent multiple selections
    
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
    if (percentage >= 80) return 'Excellent! You have mastered core computing principles and digital literacy!'
    if (percentage >= 60) return 'Good job! Keep learning to improve your knowledge!'
    return 'Keep practicing! Review the basics and try again!'
  }

  if (showResults) {
    return (
      <div className="min-h-screen">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
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
              <Link href="/quizzes/beginner" className="btn-secondary">
                Back to Beginner Quizzes
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
          <Link href="/quizzes/beginner" className="flex items-center text-primary-400 hover:text-primary-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Beginner Quizzes
          </Link>
          <div className="text-right">
            <div className="text-sm text-dark-400">Question {currentQuestion + 1} of {questions.length}</div>
            <div className="text-lg font-semibold text-white">Score: {score}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-dark-700 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="card mb-8">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-dark-400">Beginner Level - Quiz 3</span>
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
                    : 'border-dark-600 hover:border-primary-500/50 hover:bg-dark-700/50 text-dark-300 hover:text-white'
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
              <h4 className="text-sm font-semibold text-primary-400 mb-2">Explanation:</h4>
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
