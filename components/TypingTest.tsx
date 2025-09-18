'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Keyboard, Play, RotateCcw, Target, Clock } from 'lucide-react'

interface TypingTestProps {
  text: string
  timeLimit?: number
  showResults?: boolean
  onComplete?: (result: { wpm: number; accuracy: number; errors: number; time: number }) => void
  className?: string
}

export default function TypingTest({ 
  text, 
  timeLimit = 60, 
  showResults = true, 
  onComplete,
  className = '' 
}: TypingTestProps) {
  const [userInput, setUserInput] = useState('')
  const [isStarted, setIsStarted] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [timeRemaining, setTimeRemaining] = useState(timeLimit)
  
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const completeTest = useCallback(() => {
    setIsComplete(true)
    setIsStarted(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    const result = {
      wpm,
      accuracy,
      errors,
      time: timeLimit - timeRemaining
    }
    if (onComplete) {
      onComplete(result)
    }
    // Fire-and-forget save to scores API (requires logged-in user)
    ;(async () => {
      try {
        await fetch('/api/scores', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kind: 'typing',
            value: wpm,
            meta: { wpm, accuracy, errors, time: result.time }
          })
        })
      } catch {}
    })()
  }, [wpm, accuracy, errors, timeLimit, timeRemaining, onComplete])

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
            completeTest()
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
  }, [isStarted, isComplete, startTime, userInput, completeTest])

  const startTest = () => {
    setIsStarted(true)
    setIsComplete(false)
    setStartTime(Date.now())
    setUserInput('')
    setErrors(0)
    setWpm(0)
    setAccuracy(100)
    setTimeRemaining(timeLimit)
    
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const resetTest = () => {
    setIsStarted(false)
    setIsComplete(false)
    setStartTime(null)
    setUserInput('')
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    setTimeRemaining(timeLimit)
    
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
      startTest()
    }

    if (isStarted && !isComplete) {
      // Calculate accuracy
      let errorCount = 0
      for (let i = 0; i < Math.min(value.length, text.length); i++) {
        if (value[i] !== text[i]) {
          errorCount++
        }
      }
      setErrors(errorCount)
      
      const currentAccuracy = Math.max(0, Math.round(((text.length - errorCount) / text.length) * 100))
      setAccuracy(currentAccuracy)

      // Check if typing is complete
      if (value === text) {
        completeTest()
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getProgressPercentage = () => {
    return Math.min((userInput.length / text.length) * 100, 100)
  }

  return (
    <div className={`bg-slate-800 rounded-xl p-6 border border-slate-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Typing Test</h3>
        <div className="flex items-center space-x-2">
          {!isStarted ? (
            <button onClick={startTest} className="btn-primary flex items-center text-sm">
              <Play className="w-4 h-4 mr-2" />
              Start
            </button>
          ) : (
            <button onClick={resetTest} className="btn-outline flex items-center text-sm">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      {isStarted && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-xl font-bold text-red-400">
              {formatTime(timeRemaining)}
            </div>
            <div className="text-slate-400 text-xs">Time Left</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-blue-400">{wpm}</div>
            <div className="text-slate-400 text-xs">WPM</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-400">{accuracy}%</div>
            <div className="text-slate-400 text-xs">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-red-400">{errors}</div>
            <div className="text-slate-400 text-xs">Errors</div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {isStarted && (
        <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
      )}

      {/* Text to Type */}
      <div className="bg-slate-900 rounded-lg p-4 border border-slate-600 mb-4">
        <div className="text-white text-sm leading-relaxed">
          {text.split('').map((char, index) => {
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
        className="w-full h-24 bg-slate-900 border border-slate-600 rounded-lg p-3 text-white text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={!isStarted || isComplete}
      />

      {/* Results */}
      {isComplete && showResults && (
        <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-600">
          <h4 className="text-white font-semibold mb-3 text-center">Test Complete!</h4>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-400">{wpm}</div>
              <div className="text-slate-400 text-xs">WPM</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-400">{accuracy}%</div>
              <div className="text-slate-400 text-xs">Accuracy</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-400">{errors}</div>
              <div className="text-slate-400 text-xs">Errors</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
