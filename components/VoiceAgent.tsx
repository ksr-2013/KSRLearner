'use client'

import { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Phone, PhoneOff, Volume2, VolumeX } from 'lucide-react'

interface VoiceAgentProps {
  onMessage?: (message: string) => void
  onTranscript?: (transcript: string) => void
}

const VoiceAgent = ({ onMessage, onTranscript }: VoiceAgentProps) => {
  const [isConnected, setIsConnected] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [assistant, setAssistant] = useState<any>(null)
  
  const vapiRef = useRef<any>(null)

  useEffect(() => {
    // Initialize Vapi when component mounts
    const initVapi = async () => {
      try {
        // Dynamic import to avoid SSR issues
        const Vapi = (await import('@vapi-ai/web')).default
        
        const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY || '')
        vapiRef.current = vapi

        // Set up event listeners
        vapi.on('call-start', () => {
          console.log('Call started')
          setIsConnected(true)
          setError(null)
        })

        vapi.on('call-end', () => {
          console.log('Call ended')
          setIsConnected(false)
          setIsListening(false)
        })

        vapi.on('speech-start', () => {
          console.log('Speech started')
          setIsListening(true)
        })

        vapi.on('speech-end', () => {
          console.log('Speech ended')
          setIsListening(false)
        })

        vapi.on('message', (message: any) => {
          console.log('Message received:', message)
          if (onMessage) {
            onMessage(message.content || message.message || '')
          }
        })

        vapi.on('error', (error: any) => {
          console.error('Vapi error:', error)
          setError(error.message || 'Voice agent error')
        })

        // Load assistant configuration
        const response = await fetch('/api/vapi', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'get-assistant' })
        })
        
        if (response.ok) {
          const data = await response.json()
          setAssistant(data.assistant)
        }

      } catch (err) {
        console.error('Failed to initialize Vapi:', err)
        setError('Failed to initialize voice agent')
      }
    }

    initVapi()

    // Cleanup on unmount
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop()
      }
    }
  }, [onMessage, onTranscript])

  const startCall = async () => {
    try {
      if (!vapiRef.current || !assistant) {
        setError('Voice agent not ready')
        return
      }

      setError(null)
      await vapiRef.current.start(assistant)
    } catch (err: any) {
      console.error('Failed to start call:', err)
      setError(err.message || 'Failed to start voice call')
    }
  }

  const endCall = async () => {
    try {
      if (vapiRef.current) {
        await vapiRef.current.stop()
      }
    } catch (err: any) {
      console.error('Failed to end call:', err)
      setError(err.message || 'Failed to end voice call')
    }
  }

  const toggleMute = () => {
    if (vapiRef.current) {
      if (isMuted) {
        vapiRef.current.unmute()
      } else {
        vapiRef.current.mute()
      }
      setIsMuted(!isMuted)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 p-2">
        {!isConnected ? (
          <button
            onClick={startCall}
            disabled={!assistant}
            className="flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-full transition-colors"
            title="Start Voice Chat"
          >
            <Phone className="w-6 h-6" />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                isMuted 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            
            <button
              onClick={endCall}
              className="flex items-center justify-center w-10 h-10 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
              title="End Call"
            >
              <PhoneOff className="w-5 h-5" />
            </button>
          </div>
        )}
        
        {isListening && (
          <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
        )}
      </div>
      
      {error && (
        <div className="absolute bottom-full right-0 mb-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-3 py-2 rounded-lg text-sm max-w-xs">
          {error}
        </div>
      )}
    </div>
  )
}

export default VoiceAgent