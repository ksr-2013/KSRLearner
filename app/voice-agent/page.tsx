'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX, Settings, MessageCircle } from 'lucide-react'

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any
    SpeechRecognition: any
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: any) => any) | null
  onerror: ((this: SpeechRecognition, ev: any) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onnomatch: ((this: SpeechRecognition, ev: any) => any) | null
}

export default function VoiceAgentPage() {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [useElevenLabs, setUseElevenLabs] = useState(true)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)


  const handleAIResponse = useCallback(async (text: string) => {
    setIsLoading(true)
    setError('')
    
    try {
      // Try Gemini first, then fallback to Groq
      let response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: text,
          conversationHistory: [],
          userName: 'Voice User'
        }),
      })

      // If Gemini fails, try Groq
      if (!response.ok) {
        console.log('Gemini failed, trying Groq...')
        response = await fetch('/api/groq-chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: text,
            conversationHistory: [],
            userName: 'Voice User'
          }),
        })
      }

      if (!response.ok) {
        // If both APIs fail, provide a fallback response
        const fallbackResponse = "Hello! I'm KSR Learner's AI assistant. I can help you learn about technology, programming, and computer science. However, I'm having trouble connecting to my AI services right now. Please check your API key configuration or try again later. You can explore our interactive quizzes, typing practice, and puzzles while we fix this!"
        setAiResponse(fallbackResponse)
        await textToSpeech(fallbackResponse)
        return
      }

      const data = await response.json()
      const aiText = data.response || data.message || 'Sorry, I could not process that request.'
      setAiResponse(aiText)

      // Convert to speech
      await textToSpeech(aiText)
      
    } catch (err) {
      console.error('AI response error:', err)
      setError('Failed to get AI response. Please check your API keys configuration.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    // Initialize speech recognition with better error handling
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
      
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognitionRef.current = recognition
        
        recognition.continuous = false // Changed to false for better reliability
        recognition.interimResults = true
        recognition.lang = 'en-US'
        recognition.maxAlternatives = 1
        
        // Add timeout to prevent hanging
        recognition.onstart = () => {
          console.log('Speech recognition started')
          setError('')
          // Set a timeout to stop if no speech is detected
          setTimeout(() => {
            if (recognitionRef.current && isListening) {
              console.log('Speech recognition timeout - stopping')
              recognitionRef.current.stop()
            }
          }, 10000) // 10 second timeout
        }

        recognition.onresult = (event: any) => {
          console.log('Speech recognition result received')
          let finalTranscript = ''
          let interimTranscript = ''
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += transcript
            } else {
              interimTranscript += transcript
            }
          }
          
          // Show interim results for debugging
          if (interimTranscript) {
            console.log('Interim transcript:', interimTranscript)
            setTranscript(interimTranscript) // Show interim results
          }
          
          if (finalTranscript) {
            console.log('Final transcript:', finalTranscript)
            setTranscript(finalTranscript)
            handleAIResponse(finalTranscript)
          }
        }

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          
          // Handle specific error types with more helpful messages
          if (event.error === 'no-speech') {
            setError('No speech detected. Try speaking louder, closer to microphone, or check if microphone is working.')
          } else if (event.error === 'not-allowed') {
            setError('Microphone access denied. Please allow microphone permissions in your browser.')
          } else if (event.error === 'network') {
            setError('Network error. Please check your internet connection.')
          } else if (event.error === 'audio-capture') {
            setError('No microphone found. Please connect a microphone.')
          } else if (event.error === 'service-not-allowed') {
            setError('Speech recognition service not allowed. Try using HTTPS or localhost.')
          } else {
            setError(`Speech recognition error: ${event.error}. Try refreshing the page or using Chrome browser.`)
          }
          
          setIsListening(false)
        }

        recognition.onend = () => {
          console.log('Speech recognition ended')
          setIsListening(false)
        }

        recognition.onnomatch = () => {
          console.log('No speech was recognized')
          setError('Speech not recognized. Try speaking more clearly.')
          setIsListening(false)
        }
      } else {
        console.error('Speech recognition not supported in this browser')
        setError('Speech recognition not supported. Please use Chrome browser.')
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [handleAIResponse, isListening])

  const textToSpeech = async (text: string) => {
    try {
      setIsSpeaking(true)
      
      if (useElevenLabs) {
        // Use ElevenLabs
        const response = await fetch('/api/elevenlabs-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        })

        if (response.ok) {
          const audioBlob = await response.blob()
          const audioUrl = URL.createObjectURL(audioBlob)
          
          if (audioRef.current) {
            audioRef.current.src = audioUrl
            audioRef.current.play()
            
            audioRef.current.onended = () => {
              setIsSpeaking(false)
              URL.revokeObjectURL(audioUrl)
            }
          }
        } else {
          // Check if it's a permissions error
          const errorData = await response.text()
          if (errorData.includes('missing_permissions')) {
            console.log('ElevenLabs permissions error - switching to browser TTS')
            setError('ElevenLabs API key missing text-to-speech permissions. Using browser TTS instead.')
            setUseElevenLabs(false)
          }
          // Fallback to browser TTS
          fallbackTTS(text)
        }
      } else {
        // Use browser TTS
        fallbackTTS(text)
      }
    } catch (err) {
      console.error('TTS error:', err)
      fallbackTTS(text)
    }
  }

  const fallbackTTS = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 1
      
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      speechSynthesis.speak(utterance)
    } else {
      setIsSpeaking(false)
    }
  }

  const startListening = () => {
    const recognition = recognitionRef.current
    if (recognition) {
      setError('')
      setTranscript('')
      setAiResponse('')
      
      // Check if microphone is available
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then(() => {
            console.log('Microphone access granted')
            recognition.start()
            setIsListening(true)
            setIsConnected(true)
          })
          .catch((err) => {
            console.error('Microphone access denied:', err)
            setError('Microphone access denied. Please allow microphone permissions and try again.')
          })
      } else {
        console.log('Starting speech recognition without microphone check')
        recognition.start()
        setIsListening(true)
        setIsConnected(true)
      }
    }
  }

  const stopListening = () => {
    const recognition = recognitionRef.current
    if (recognition) {
      recognition.stop()
      setIsListening(false)
      setIsConnected(false)
    }
  }

  const stopSpeaking = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel()
    }
    setIsSpeaking(false)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient py-20 lg:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            AI Voice
            <span className="gradient-text block">Assistant</span>
          </h1>
          
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Talk naturally with our AI assistant powered by ElevenLabs high-quality voice synthesis. 
            Ask questions about technology, get learning guidance, or just have a conversation!
          </p>
        </div>
      </section>

      {/* Voice Agent Interface */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card text-center">
            {/* Status Indicators */}
            <div className="flex justify-center space-x-4 mb-8">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                isConnected ? 'bg-green-500/20 text-green-400' : 'bg-slate-700 text-slate-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isConnected ? 'bg-green-400' : 'bg-slate-500'
                }`}></div>
                <span className="text-sm font-medium">
                  {isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                useElevenLabs ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-700 text-slate-400'
              }`}>
                <Volume2 className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {useElevenLabs ? 'ElevenLabs TTS' : 'Browser TTS'}
                </span>
              </div>
            </div>

            {/* Main Control Button */}
            <div className="mb-8">
              {!isConnected ? (
                <button
                  onClick={startListening}
                  className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <Phone className="w-8 h-8 text-white" />
                </button>
              ) : (
                <button
                  onClick={stopListening}
                  className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  <PhoneOff className="w-8 h-8 text-white" />
                </button>
              )}
            </div>

            {/* Status Text */}
            <div className="mb-8">
              {isLoading && (
                <p className="text-blue-400 text-lg">🤖 AI is thinking...</p>
              )}
              {isSpeaking && (
                <p className="text-green-400 text-lg">🔊 AI is speaking...</p>
              )}
              {isListening && !isLoading && !isSpeaking && (
                <p className="text-yellow-400 text-lg">🎤 Listening... Speak now!</p>
              )}
              {!isConnected && !isLoading && !isSpeaking && (
                <p className="text-slate-400 text-lg">Click the phone to start talking, or type below</p>
              )}
            </div>

            {/* Manual Text Input Fallback */}
            <div className="mb-8">
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-3">Type Your Message (Fallback)</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your question here..."
                    className="flex-1 px-4 py-2 bg-slate-700 text-white rounded-lg border border-slate-600 focus:border-blue-500 focus:outline-none"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const input = e.target as HTMLInputElement
                        if (input.value.trim()) {
                          handleAIResponse(input.value.trim())
                          input.value = ''
                        }
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement
                      if (input.value.trim()) {
                        handleAIResponse(input.value.trim())
                        input.value = ''
                      }
                    }}
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-all duration-200"
                  >
                    Send
                  </button>
                </div>
                <p className="text-slate-400 text-sm mt-2">
                  If voice recognition isn't working, you can type your questions here
                </p>
              </div>
            </div>

            {/* Settings */}
            <div className="mb-8">
              <button
                onClick={() => setUseElevenLabs(!useElevenLabs)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  useElevenLabs 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Toggle ElevenLabs TTS</span>
              </button>
            </div>

            {/* Transcript Display */}
            {transcript && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">You said:</h3>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <p className="text-slate-300">{transcript}</p>
                </div>
              </div>
            )}

            {/* AI Response Display */}
            {aiResponse && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">AI Response:</h3>
                <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700/50">
                  <p className="text-blue-200">{aiResponse}</p>
                </div>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mb-6">
                <div className="bg-red-900/30 rounded-lg p-4 border border-red-700/50">
                  <p className="text-red-200">{error}</p>
                </div>
              </div>
            )}

            {/* Test Buttons */}
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => handleAIResponse("Hello, can you help me learn about technology?")}
                disabled={isLoading}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-lg transition-all duration-200"
              >
                {isLoading ? 'Testing...' : 'Test AI Response'}
              </button>
              
              <button
                onClick={async () => {
                  try {
                    setError('')
                    setTranscript('')
                    
                    // Request microphone permission first
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                    console.log('Microphone permission granted')
                    
                    // Stop the stream immediately
                    stream.getTracks().forEach(track => track.stop())
                    
                    // Now test speech recognition
                    if (recognitionRef.current) {
                      recognitionRef.current.start()
                      setIsListening(true)
                      setTimeout(() => {
                        if (recognitionRef.current) {
                          recognitionRef.current.stop()
                          setIsListening(false)
                        }
                      }, 5000)
                    }
                  } catch (err) {
                    console.error('Microphone permission denied:', err)
                    setError('Microphone permission denied. Please allow microphone access and try again.')
                  }
                }}
                disabled={isListening}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white rounded-lg transition-all duration-200"
              >
                {isListening ? 'Testing Mic...' : 'Test Microphone'}
              </button>
              
              <button
                onClick={() => {
                  // Check browser compatibility
                  const isSupported = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window
                  const hasMediaDevices = 'mediaDevices' in navigator
                  
                  alert(`Browser Support Check:
Speech Recognition: ${isSupported ? '✅ Supported' : '❌ Not Supported'}
Media Devices: ${hasMediaDevices ? '✅ Supported' : '❌ Not Supported'}
Browser: ${navigator.userAgent.split(' ')[0]}

${!isSupported ? 'Try using Chrome browser for best speech recognition support.' : ''}`)
                }}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all duration-200"
              >
                Check Browser
              </button>
            </div>

            {/* Instructions */}
            <div className="text-slate-400 text-sm">
              <p>💡 <strong>Tips:</strong></p>
              <p>• Click "Test AI Response" to verify the AI is working</p>
              <p>• Click "Test Microphone" to check if speech recognition works</p>
              <p>• Allow microphone permissions when prompted</p>
              <p>• Speak clearly and wait for the "Listening..." indicator</p>
              <p>• If you get "no-speech" error, try speaking louder or closer to microphone</p>
              <p>• Check your browser's microphone settings if issues persist</p>
              <p>• Ask questions about technology, learning, or KSR Learner features</p>
              <p>• ElevenLabs provides higher quality voice synthesis</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hidden audio element for ElevenLabs playback */}
      <audio ref={audioRef} />
      
      <Footer />
    </div>
  )
}

