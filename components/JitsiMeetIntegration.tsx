'use client'

import { useEffect, useRef, useState } from 'react'
import { Video, Users, Settings, Share, Copy, ExternalLink, AlertCircle } from 'lucide-react'

interface JitsiMeetIntegrationProps {
  roomName: string
  displayName?: string
  isHost?: boolean
  onCallEnd?: () => void
}

declare global {
  interface Window {
    JitsiMeetExternalAPI: any
  }
}

export default function JitsiMeetIntegration({ 
  roomName, 
  displayName = 'KSR Learner',
  isHost = true,
  onCallEnd 
}: JitsiMeetIntegrationProps) {
  const jitsiContainerRef = useRef<HTMLDivElement>(null)
  const [jitsiApi, setJitsiApi] = useState<any>(null)
  const [isInCall, setIsInCall] = useState(false)
  const [participantCount, setParticipantCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load Jitsi Meet external API script
    const script = document.createElement('script')
    script.src = 'https://meet.jit.si/external_api.js'
    script.async = true
    script.onload = initializeJitsi
    script.onerror = () => setError('Failed to load Jitsi Meet')
    document.head.appendChild(script)

    return () => {
      if (jitsiApi) {
        jitsiApi.dispose()
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }
    }
  }, [])

  const initializeJitsi = () => {
    if (!jitsiContainerRef.current || !window.JitsiMeetExternalAPI) {
      setError('Jitsi Meet failed to initialize')
      setIsLoading(false)
      return
    }

    try {
      const domain = 'meet.jit.si'
      const options = {
        roomName: roomName,
        width: '100%',
        height: '100%',
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: displayName,
          email: 'teacher@ksrlearner.com'
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
          prejoinPageEnabled: false,
          disableModeratorIndicator: false,
          enableClosePage: false,
          toolbarButtons: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
            'tileview', 'select-background', 'download', 'help', 'mute-everyone', 'security'
          ]
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: [
            'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
            'fodeviceselection', 'hangup', 'chat', 'recording',
            'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
            'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
            'tileview', 'select-background', 'download', 'help', 'mute-everyone', 'security'
          ],
          SHOW_JITSI_WATERMARK: false,
          SHOW_WATERMARK_FOR_GUESTS: false,
          SHOW_POWERED_BY: false,
          SHOW_BRAND_WATERMARK: false,
          SHOW_PROMOTIONAL_SPOTLIGHT: false,
          AUTHENTICATION_ENABLE: false,
          TOOLBAR_ALWAYS_VISIBLE: true,
          HIDE_JITSI_WATERMARK: true,
          HIDE_WATERMARK_FOR_GUESTS: true,
          HIDE_POWERED_BY: true,
          HIDE_BRAND_WATERMARK: true,
          HIDE_PROMOTIONAL_SPOTLIGHT: true
        }
      }

      const api = new window.JitsiMeetExternalAPI(domain, options)
      setJitsiApi(api)
      setIsLoading(false)

      // Event listeners
      api.addEventListeners({
        readyToClose: handleCallEnd,
        participantLeft: handleParticipantLeft,
        participantJoined: handleParticipantJoined,
        videoConferenceJoined: handleVideoConferenceJoined,
        videoConferenceLeft: handleVideoConferenceLeft
      })
    } catch (err) {
      setError('Failed to create Jitsi Meet session')
      setIsLoading(false)
    }
  }

  const handleCallEnd = () => {
    setIsInCall(false)
    if (onCallEnd) onCallEnd()
  }

  const handleParticipantLeft = (event: any) => {
    setParticipantCount(prev => Math.max(0, prev - 1))
  }

  const handleParticipantJoined = (event: any) => {
    setParticipantCount(prev => prev + 1)
  }

  const handleVideoConferenceJoined = (event: any) => {
    setIsInCall(true)
    setParticipantCount(1) // Including yourself
  }

  const handleVideoConferenceLeft = (event: any) => {
    setIsInCall(false)
    setParticipantCount(0)
  }

  const copyRoomLink = () => {
    const roomLink = `https://meet.jit.si/${roomName}`
    navigator.clipboard.writeText(roomLink)
    // You could add a toast notification here
  }

  const openInNewTab = () => {
    const roomLink = `https://meet.jit.si/${roomName}`
    window.open(roomLink, '_blank')
  }

  const retryConnection = () => {
    setError(null)
    setIsLoading(true)
    if (jitsiApi) {
      jitsiApi.dispose()
      setJitsiApi(null)
    }
    // Re-initialize after a short delay
    setTimeout(initializeJitsi, 1000)
  }

  if (error) {
    return (
      <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Connection Error</h3>
          <p className="text-slate-300 mb-4">{error}</p>
          <button
            onClick={retryConnection}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-300">
            Room: <span className="font-mono text-blue-400">{roomName}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-slate-400">
            <Users className="w-4 h-4" />
            <span className="text-sm">{participantCount}</span>
          </div>
          
          <button
            onClick={copyRoomLink}
            className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
            title="Copy room link"
          >
            <Copy className="w-4 h-4" />
          </button>
          
          <button
            onClick={openInNewTab}
            className="p-2 text-slate-400 hover:text-green-400 transition-colors"
            title="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Jitsi Meet Container */}
      <div className="relative" style={{ height: '600px' }}>
        <div 
          ref={jitsiContainerRef} 
          className="w-full h-full"
        />
        
        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Video className="w-8 h-8 text-white" />
              </div>
              <p className="text-white text-lg">Loading Jitsi Meet...</p>
              <p className="text-slate-400 text-sm">Please wait while we connect you</p>
            </div>
          </div>
        )}
      </div>

      {/* Info Panel */}
      <div className="p-4 bg-slate-900 border-t border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${isInCall ? 'bg-green-500' : 'bg-slate-500'}`}></div>
            <span className="text-slate-400">Status:</span>
            <span className={`font-medium ${isInCall ? 'text-green-400' : 'text-slate-400'}`}>
              {isInCall ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">Participants:</span>
            <span className="text-white font-medium">{participantCount}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Platform:</span>
            <span className="text-blue-400 font-medium">Jitsi Meet</span>
          </div>
        </div>
        
        <div className="mt-3 pt-3 border-t border-slate-700">
          <p className="text-xs text-slate-500">
            Powered by <a href="https://meet.jit.si/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Jitsi Meet</a> - Secure, open-source video conferencing
          </p>
        </div>
      </div>
    </div>
  )
}
