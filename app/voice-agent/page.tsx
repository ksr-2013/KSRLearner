'use client'

import { useState } from 'react'
import { ArrowLeft, Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react'
import Link from 'next/link'
import VoiceAgent from '../../components/VoiceAgent'

const VoiceAgentPage = () => {
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [messages, setMessages] = useState<Array<{id: string, text: string, isUser: boolean, timestamp: Date}>>([])
  const [error, setError] = useState<string | null>(null)

  const handleVoiceMessage = (message: string) => {
    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isUser: true,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
  }

  const handleVoiceTranscript = (transcript: string) => {
    console.log('Transcript received:', transcript)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/"
            className="flex items-center space-x-2 text-white hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold text-white">Voice Agent</h1>
          <div className="w-20"></div> {/* Spacer for centering */}
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Instructions */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">How to Use Voice Agent</h2>
            <div className="space-y-3 text-gray-200">
              <p>• Click the microphone button to start a voice conversation</p>
              <p>• Speak naturally - the AI will understand and respond</p>
              <p>• Use the mute button to temporarily silence your microphone</p>
              <p>• Click the phone button to end the conversation</p>
              <p>• The AI can help with learning questions, platform navigation, and technology topics</p>
            </div>
          </div>

          {/* Voice Controls */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <div className="flex flex-col items-center space-y-6">
              <h3 className="text-xl font-semibold text-white mb-4">Voice Controls</h3>
              
              {/* Status Indicators */}
              <div className="flex space-x-4 mb-6">
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                  isConnected ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    isConnected ? 'bg-green-500' : 'bg-gray-500'
                  }`} />
                  <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
                
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                  isListening ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    isListening ? 'bg-blue-500 animate-pulse' : 'bg-gray-500'
                  }`} />
                  <span>{isListening ? 'Listening' : 'Not Listening'}</span>
                </div>
              </div>

              {/* Voice Agent Component */}
              <div className="relative">
                <VoiceAgent 
                  onMessage={handleVoiceMessage}
                  onTranscript={handleVoiceTranscript}
                />
              </div>
            </div>
          </div>

          {/* Messages Display */}
          {messages.length > 0 && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-4">Conversation History</h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.isUser
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-100'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mt-4">
              <p className="text-red-300">{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default VoiceAgentPage
