'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Link from 'next/link'
import { Keyboard, RotateCcw, Play, Target, Clock, Trophy, ArrowLeft, Timer, Zap } from 'lucide-react'

interface QuizResult {
  wpm: number
  accuracy: number
  errors: number
  time: number
  date: Date
}

export default function TypingQuiz() {
  const [currentText, setCurrentText] = useState<string>('')
  const [userInput, setUserInput] = useState('')
  const [isStarted, setIsStarted] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [timeLimit, setTimeLimit] = useState(60) // 1 minute default
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  const [quizHistory, setQuizHistory] = useState<QuizResult[]>([])
  const [selectedTimeLimit, setSelectedTimeLimit] = useState(60)
  
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Quiz texts for different time limits
  const quizTexts = [
    "The quick brown fox jumps over the lazy dog. This pangram contains every letter of the alphabet at least once, making it perfect for testing typing skills and keyboard layouts. Typing practice helps improve speed, accuracy, and muscle memory.",
    "Programming is the art of telling another human being what one wants the computer to do. This requires clear communication, logical thinking, and attention to detail. Good programmers write code that is readable, maintainable, and efficient.",
    "Technology has transformed the way we live, work, and communicate. From smartphones to artificial intelligence, innovations continue to shape our future. Learning about technology helps us understand the world around us and prepare for tomorrow's challenges.",
    "Data science combines statistics, programming, and domain expertise to extract meaningful insights from complex datasets. It involves collecting, cleaning, analyzing, and visualizing data to solve real-world problems and make informed decisions.",
    "Cybersecurity is essential in protecting digital assets and maintaining privacy in our increasingly connected world. It involves implementing security measures, monitoring threats, and responding to incidents to safeguard information and systems."
  ]

  const completeQuiz = () => {
    setIsComplete(true)
    setIsStarted(false)
    setEndTime(Date.now())
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    const result: QuizResult = {
      wpm,
      accuracy,
      errors,
      time: selectedTimeLimit - timeRemaining,
      date: new Date()
    }
    const newHistory = [result, ...quizHistory].slice(0, 10)
    setQuizHistory(newHistory)
    localStorage.setItem('typingQuizHistory', JSON.stringify(newHistory))
    // Save score to backend (requires user to be logged in)
    ;(async () => {
      try {
        await fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kind: 'quiz',
            value: wpm,
            meta: { wpm, accuracy, errors, time: result.time }
          })
        })
      } catch {}
    })()
  }

  useEffect(() => {
    // Load quiz history from localStorage
    const savedHistory = localStorage.getItem('typingQuizHistory')
    if (savedHistory) {
      try {
        setQuizHistory(JSON.parse(savedHistory))
      } catch (error) {
        console.error('Error loading quiz history:', error)
      }
    }
  }, [])

  useEffect(() => {
    if (isStarted && !isComplete && startTime) {
      // WPM calculation interval
      intervalRef.current = setInterval(() => {
        const currentTime = Date.now()
        const timeElapsed = (currentTime - startTime) / 1000 / 60 // in minutes
        const wordsTyped = userInput.trim().split(/\s+/).length
        const currentWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0
        setWpm(currentWpm)
      }, 1000)

      // Timer countdown
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            completeQuiz()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isStarted, isComplete, startTime, userInput, completeQuiz])

  const startQuiz = () => {
    // Select random text
    const randomIndex = Math.floor(Math.random() * quizTexts.length)
    setCurrentText(quizTexts[randomIndex])
    
    setIsStarted(true)
    setIsComplete(false)
    setStartTime(Date.now())
    setEndTime(null)
    setUserInput('')
    setErrors(0)
    setWpm(0)
    setAccuracy(100)
    setTimeRemaining(selectedTimeLimit)
    
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const resetQuiz = () => {
    setIsStarted(false)
    setIsComplete(false)
    setStartTime(null)
    setEndTime(null)
    setUserInput('')
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    setTimeRemaining(selectedTimeLimit)
    setCurrentText('')
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setUserInput(value)

    if (!isStarted && value.length > 0) {
      startQuiz()
    }

    if (isStarted && !isComplete) {
      // Calculate accuracy
      let errorCount = 0
      for (let i = 0; i < Math.min(value.length, currentText.length); i++) {
        if (value[i] !== currentText[i]) {
          errorCount++
        }
      }
      setErrors(errorCount)
      
      const currentAccuracy = Math.max(0, Math.round(((currentText.length - errorCount) / currentText.length) * 100))
      setAccuracy(currentAccuracy)

      // Check if typing is complete
      if (value === currentText) {
        completeQuiz()
      }
    }
  }

  const getTimeLimitOptions = () => [
    { value: 30, label: '30 seconds', description: 'Quick speed test' },
    { value: 60, label: '1 minute', description: 'Standard test' },
    { value: 120, label: '2 minutes', description: 'Extended test' },
    { value: 300, label: '5 minutes', description: 'Endurance test' }
  ]

  const getWpmRating = (wpm: number) => {
    if (wpm >= 80) return { rating: 'Expert', color: 'text-yellow-400', icon: Trophy }
    if (wpm >= 60) return { rating: 'Advanced', color: 'text-purple-400', icon: Zap }
    if (wpm >= 40) return { rating: 'Intermediate', color: 'text-blue-400', icon: Target }
    if (wpm >= 20) return { rating: 'Beginner', color: 'text-green-400', icon: Keyboard }
    return { rating: 'Novice', color: 'text-slate-400', icon: Keyboard }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/typing" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Typing
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Typing Speed Quiz
          </h1>
          <p className="text-slate-400">
            Test your typing speed and accuracy with timed challenges
          </p>
        </div>

        {/* Quiz Setup */}
        {!isStarted && !isComplete && (
          <div className="card mb-8">
            <h3 className="text-xl font-semibold text-white mb-6">Quiz Settings</h3>
            
            <div className="mb-6">
              <label className="block text-slate-300 mb-3">Select Time Limit:</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {getTimeLimitOptions().map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedTimeLimit(option.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedTimeLimit === option.value
                        ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                        : 'border-slate-600 hover:border-slate-500 text-slate-300'
                    }`}
                  >
                    <div className="font-semibold">{option.label}</div>
                    <div className="text-sm opacity-75">{option.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <button onClick={startQuiz} className="btn-primary w-full">
              Start Quiz
            </button>
          </div>
        )}

        {/* Quiz Interface */}
        {isStarted && !isComplete && (
          <div className="card mb-8">
            {/* Timer and Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-slate-400 text-sm">Time Left</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{wpm}</div>
                <div className="text-slate-400 text-sm">WPM</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{accuracy}%</div>
                <div className="text-slate-400 text-sm">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{errors}</div>
                <div className="text-slate-400 text-sm">Errors</div>
              </div>
            </div>

            {/* Text to Type */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-600 mb-6">
              <div className="text-white text-lg leading-relaxed">
                {currentText.split('').map((char, index) => {
                  let charClass = 'text-slate-400'
                  if (index < userInput.length) {
                    if (userInput[index] === char) {
                      charClass = 'text-green-400'
                    } else {
                      charClass = 'text-red-400 bg-red-900/20'
                    }
                  }
                  return (
                    <span key={index} className={charClass}>
                      {char}
                    </span>
                  )
                })}
              </div>
            </div>

            {/* Input Area */}
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              placeholder="Start typing here..."
              className="w-full h-32 bg-slate-800 border border-slate-600 rounded-lg p-4 text-white text-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />

            <div className="mt-4 flex justify-center">
              <button onClick={resetQuiz} className="btn-outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset Quiz
              </button>
            </div>
          </div>
        )}

        {/* Results */}
        {isComplete && (
          <div className="card mb-8">
            <h3 className="text-2xl font-semibold text-white mb-6 text-center">
              Quiz Complete! 🎉
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{wpm}</div>
                <div className="text-slate-400 text-sm">Final WPM</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{accuracy}%</div>
                <div className="text-slate-400 text-sm">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{errors}</div>
                <div className="text-slate-400 text-sm">Total Errors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">
                  {formatTime(selectedTimeLimit - timeRemaining)}
                </div>
                <div className="text-slate-400 text-sm">Time Used</div>
              </div>
            </div>

            {/* Rating */}
            <div className="text-center mb-6">
              {(() => {
                const rating = getWpmRating(wpm)
                const IconComponent = rating.icon
                return (
                  <div className={`inline-flex items-center text-2xl font-bold ${rating.color}`}>
                    <IconComponent className="w-8 h-8 mr-2" />
                    {rating.rating} Level
                  </div>
                )
              })()}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={resetQuiz} className="btn-primary">
                Try Again
              </button>
              <Link href="/typing" className="btn-outline">
                Back to Typing Hub
              </Link>
            </div>
          </div>
        )}

        {/* Quiz History */}
        {quizHistory.length > 0 && (
          <div className="card">
            <h3 className="text-xl font-semibold text-white mb-6">Recent Results</h3>
            <div className="space-y-3">
              {quizHistory.map((result, index) => {
                const rating = getWpmRating(result.wpm)
                const IconComponent = rating.icon
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-600">
                    <div className="flex items-center space-x-4">
                      <div className={`${rating.color}`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="text-white font-semibold">{result.wpm} WPM</div>
                        <div className="text-slate-400 text-sm">
                          {result.accuracy}% accuracy • {result.errors} errors
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-slate-400 text-sm">
                        {result.date.toLocaleDateString()}
                      </div>
                      <div className="text-slate-400 text-sm">
                        {formatTime(result.time)}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}
