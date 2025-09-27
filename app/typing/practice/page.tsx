'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import SaveScore from '../../../components/SaveScore'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Keyboard, RotateCcw, Play, Pause, Target, Clock, Trophy, ArrowLeft, Zap } from 'lucide-react'

interface TypingText {
  id: string
  text: string
  category: string
  difficulty: string
}

export default function TypingPractice() {
  const searchParams = useSearchParams()
  const level = searchParams.get('level') || 'beginner'
  
  const [currentText, setCurrentText] = useState<TypingText | null>(null)
  const [userInput, setUserInput] = useState('')
  const [isStarted, setIsStarted] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [wpm, setWpm] = useState(0)
  const [accuracy, setAccuracy] = useState(100)
  const [errors, setErrors] = useState(0)
  const [totalCharacters, setTotalCharacters] = useState(0)
  const [completedTexts, setCompletedTexts] = useState<TypingText[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const getWpmRating = (wpm: number) => {
    if (wpm >= 80) return { rating: 'Expert', color: 'text-yellow-400', icon: Trophy }
    if (wpm >= 60) return { rating: 'Advanced', color: 'text-purple-400', icon: Zap }
    if (wpm >= 40) return { rating: 'Intermediate', color: 'text-blue-400', icon: Target }
    if (wpm >= 20) return { rating: 'Beginner', color: 'text-green-400', icon: Keyboard }
    return { rating: 'Novice', color: 'text-slate-400', icon: Keyboard }
  }

  // Typing texts for different difficulty levels
  const typingTexts: { [key: string]: TypingText[] } = useMemo(() => ({
    beginner: [
      { id: '1', text: 'The quick brown fox jumps over the lazy dog.', category: 'Basic', difficulty: 'Beginner' },
      { id: '2', text: 'Learning to type is fun and useful for everyone.', category: 'Basic', difficulty: 'Beginner' },
      { id: '3', text: 'Practice makes perfect when learning new skills.', category: 'Basic', difficulty: 'Beginner' },
      { id: '4', text: 'Computers help us work faster and more efficiently.', category: 'Basic', difficulty: 'Beginner' },
      { id: '5', text: 'Technology changes the way we live and work.', category: 'Basic', difficulty: 'Beginner' }
    ],
    intermediate: [
      { id: '1', text: 'Programming is the art of telling another human being what one wants the computer to do. This requires clear communication and logical thinking.', category: 'Programming', difficulty: 'Intermediate' },
      { id: '2', text: 'The internet has revolutionized how we access information, connect with others, and conduct business in the modern world.', category: 'Technology', difficulty: 'Intermediate' },
      { id: '3', text: 'Data science combines statistics, programming, and domain expertise to extract meaningful insights from complex datasets.', category: 'Data Science', difficulty: 'Intermediate' },
      { id: '4', text: 'Cybersecurity is essential in protecting digital assets and maintaining privacy in our increasingly connected world.', category: 'Security', difficulty: 'Intermediate' },
      { id: '5', text: 'Artificial intelligence and machine learning are transforming industries and creating new opportunities for innovation.', category: 'AI/ML', difficulty: 'Intermediate' }
    ],
    advanced: [
      { id: '1', text: 'The fundamental theorem of calculus establishes the relationship between differentiation and integration, providing a powerful tool for solving complex mathematical problems in physics, engineering, and economics.', category: 'Mathematics', difficulty: 'Advanced' },
      { id: '2', text: 'Distributed systems architecture enables applications to scale horizontally across multiple servers, providing fault tolerance and improved performance through load balancing and data replication strategies.', category: 'System Design', difficulty: 'Advanced' },
      { id: '3', text: 'Quantum computing leverages quantum mechanical phenomena such as superposition and entanglement to perform calculations that would be infeasible for classical computers, potentially revolutionizing cryptography and optimization.', category: 'Quantum Computing', difficulty: 'Advanced' },
      { id: '4', text: 'Blockchain technology creates immutable, decentralized ledgers that enable secure peer-to-peer transactions without intermediaries, with applications ranging from cryptocurrency to supply chain management.', category: 'Blockchain', difficulty: 'Advanced' },
      { id: '5', text: 'Natural language processing combines linguistics, computer science, and artificial intelligence to enable machines to understand, interpret, and generate human language for various applications.', category: 'NLP', difficulty: 'Advanced' }
    ],
    expert: [
      { id: '1', text: 'The Riemann hypothesis, one of the most important unsolved problems in mathematics, concerns the distribution of prime numbers and has profound implications for understanding the fundamental structure of mathematics. Its resolution would unlock new insights into number theory and potentially revolutionize cryptography.', category: 'Mathematics', difficulty: 'Expert' },
      { id: '2', text: 'Neuromorphic computing architectures mimic the human brain\'s neural structure to create energy-efficient processors capable of real-time learning and adaptation, potentially enabling edge computing applications in autonomous vehicles, robotics, and IoT devices with minimal power consumption.', category: 'Neuromorphic Computing', difficulty: 'Expert' },
      { id: '3', text: 'Federated learning enables machine learning models to be trained across decentralized data sources while preserving privacy, allowing organizations to collaborate on AI development without sharing sensitive information, revolutionizing healthcare, finance, and other privacy-sensitive domains.', category: 'Federated Learning', difficulty: 'Expert' },
      { id: '4', text: 'The development of practical quantum internet protocols requires overcoming significant challenges in quantum entanglement distribution, quantum memory implementation, and quantum error correction, but promises to enable unbreakable encryption and quantum teleportation applications.', category: 'Quantum Internet', difficulty: 'Expert' },
      { id: '5', text: 'Synthetic biology combines principles from engineering, computer science, and molecular biology to design and construct new biological systems, potentially enabling breakthroughs in medicine, agriculture, and environmental remediation through programmable cellular behavior.', category: 'Synthetic Biology', difficulty: 'Expert' }
    ]
  }), [])

  useEffect(() => {
    if (typingTexts[level] && typingTexts[level].length > 0) {
      setCurrentText(typingTexts[level][0])
      setTotalCharacters(typingTexts[level][0].text.length)
    }
  }, [level, typingTexts])

  useEffect(() => {
    if (isStarted && !isPaused && startTime) {
      intervalRef.current = setInterval(() => {
        const currentTime = Date.now()
        const timeElapsed = (currentTime - startTime) / 1000 / 60 // in minutes
        const wordsTyped = userInput.trim().split(/\s+/).length
        const currentWpm = timeElapsed > 0 ? Math.round(wordsTyped / timeElapsed) : 0
        setWpm(currentWpm)
      }, 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isStarted, isPaused, startTime, userInput])

  const startTyping = () => {
    setIsStarted(true)
    setIsPaused(false)
    setStartTime(Date.now())
    setUserInput('')
    setErrors(0)
    setWpm(0)
    setAccuracy(100)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const pauseTyping = () => {
    setIsPaused(true)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  const resumeTyping = () => {
    setIsPaused(false)
    setStartTime(Date.now() - (Date.now() - (startTime || 0)))
  }

  const resetTyping = () => {
    setIsStarted(false)
    setIsPaused(false)
    setStartTime(null)
    setEndTime(null)
    setUserInput('')
    setWpm(0)
    setAccuracy(100)
    setErrors(0)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setUserInput(value)

    if (!isStarted && value.length > 0) {
      startTyping()
    }

    if (isStarted && !isPaused) {
      // Calculate accuracy
      let errorCount = 0
      for (let i = 0; i < Math.min(value.length, currentText?.text.length || 0); i++) {
        if (value[i] !== currentText?.text[i]) {
          errorCount++
        }
      }
      setErrors(errorCount)
      
      const currentAccuracy = currentText ? Math.max(0, Math.round(((currentText.text.length - errorCount) / currentText.text.length) * 100)) : 100
      setAccuracy(currentAccuracy)

      // Check if typing is complete
      if (value === currentText?.text) {
        completeTyping()
      }
    }
  }

  const completeTyping = () => {
    setIsPaused(true)
    setEndTime(Date.now())
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    
    if (currentText) {
      setCompletedTexts(prev => [...prev, currentText])
    }
  }

  const nextText = () => {
    const texts = typingTexts[level]
    if (currentIndex < texts.length - 1) {
      const nextIndex = currentIndex + 1
      setCurrentIndex(nextIndex)
      setCurrentText(texts[nextIndex])
      setTotalCharacters(texts[nextIndex].text.length)
      resetTyping()
    }
  }

  const getLevelDisplayName = (level: string) => {
    return level.charAt(0).toUpperCase() + level.slice(1)
  }

  const getProgressPercentage = () => {
    if (!currentText) return 0
    return Math.min((userInput.length / currentText.text.length) * 100, 100)
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
            {getLevelDisplayName(level)} Typing Practice
          </h1>
          <p className="text-slate-400">
            Practice your typing skills with {typingTexts[level]?.length || 0} different texts
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <div className="text-2xl font-bold text-blue-400">{wpm}</div>
            <div className="text-slate-400 text-sm">WPM</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
            <div className="text-slate-400 text-sm">Accuracy</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-400">{errors}</div>
            <div className="text-slate-400 text-sm">Errors</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl font-bold text-purple-400">
              {currentIndex + 1}/{typingTexts[level]?.length || 0}
            </div>
            <div className="text-slate-400 text-sm">Progress</div>
          </div>
        </div>

        {/* Typing Area */}
        <div className="card mb-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Type this text:</h3>
              <div className="flex items-center space-x-2">
                {!isStarted ? (
                  <button onClick={startTyping} className="btn-primary flex items-center">
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </button>
                ) : isPaused ? (
                  <button onClick={resumeTyping} className="btn-primary flex items-center">
                    <Play className="w-4 h-4 mr-2" />
                    Resume
                  </button>
                ) : (
                  <button onClick={pauseTyping} className="btn-secondary flex items-center">
                    <Pause className="w-4 h-4 mr-2" />
                    Pause
                  </button>
                )}
                <button onClick={resetTyping} className="btn-outline flex items-center">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>

            {/* Text to Type */}
            {currentText && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-600 mb-4">
                <div className="text-white text-lg leading-relaxed">
                  {currentText.text.split('').map((char, index) => {
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
                <div className="mt-4 text-sm text-slate-400">
                  Category: {currentText.category} | Difficulty: {currentText.difficulty}
                </div>
              </div>
            )}

            {/* Input Area */}
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              placeholder="Start typing here..."
              className="w-full h-32 bg-slate-800 border border-slate-600 rounded-lg p-4 text-white text-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={!isStarted || isPaused}
            />
          </div>

          {/* Results */}
          {endTime && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-600">
              <h4 className="text-xl font-semibold text-white mb-4">Session Complete!</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{wpm}</div>
                  <div className="text-slate-400 text-sm">Final WPM</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{accuracy}%</div>
                  <div className="text-slate-400 text-sm">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{errors}</div>
                  <div className="text-slate-400 text-sm">Total Errors</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {Math.round((endTime - (startTime || 0)) / 1000)}s
                  </div>
                  <div className="text-slate-400 text-sm">Time</div>
                </div>
              </div>

              <div className="mb-6">
                <SaveScore
                  type="typing"
                  title={`Typing Practice - ${currentText?.category || 'General'}`}
                  wpm={wpm}
                  level={getWpmRating(wpm).rating}
                  completed={true}
                  duration={Math.round((endTime - (startTime || 0)) / 1000)}
                  details={{
                    accuracy: accuracy,
                    errors: errors,
                    category: currentText?.category || 'General',
                    level: level
                  }}
                />
              </div>
              
              {currentIndex < (typingTexts[level]?.length || 0) - 1 ? (
                <button onClick={nextText} className="btn-primary w-full">
                  Next Text
                </button>
              ) : (
                <div className="text-center">
                  <div className="text-green-400 text-lg font-semibold mb-4">
                    🎉 Congratulations! You've completed all texts in this level!
                  </div>
                  <Link href="/typing" className="btn-primary">
                    Back to Typing Hub
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">💡 Typing Tips</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-slate-300">
            <div>
              <strong>• Focus on Accuracy First:</strong> Speed will come naturally with practice
            </div>
            <div>
              <strong>• Use Proper Finger Placement:</strong> Keep your fingers on the home row keys
            </div>
            <div>
              <strong>• Don't Look at the Keyboard:</strong> Train your muscle memory
            </div>
            <div>
              <strong>• Take Regular Breaks:</strong> Prevent fatigue and maintain focus
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
