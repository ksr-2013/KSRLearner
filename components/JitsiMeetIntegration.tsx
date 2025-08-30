'use client'

import { useEffect, useRef, useState } from 'react'
import { Video, Users, Settings, Share, Copy, ExternalLink, AlertCircle, Volume2, VolumeX, Headphones, Mic, MicOff } from 'lucide-react'

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
  const [soundsEnabled, setSoundsEnabled] = useState(true)
  const [showAudioSettings, setShowAudioSettings] = useState(false)

  // Audio elements for sound effects
  const joinSoundRef = useRef<HTMLAudioElement | null>(null)
  const leaveSoundRef = useRef<HTMLAudioElement | null>(null)
  const notificationSoundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio elements for sound effects
    joinSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
    leaveSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')
    notificationSoundRef.current = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT')

    // Set volume for sound effects
    if (joinSoundRef.current) joinSoundRef.current.volume = 0.3
    if (leaveSoundRef.current) leaveSoundRef.current.volume = 0.3
    if (notificationSoundRef.current) notificationSoundRef.current.volume = 0.2

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

  const playSound = (soundRef: React.RefObject<HTMLAudioElement | null>) => {
    if (soundsEnabled && soundRef.current) {
      soundRef.current.currentTime = 0
      soundRef.current.play().catch(() => {
        // Ignore audio play errors (common in some browsers)
      })
    }
  }

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
          // Enable sounds for better user experience
          enableSounds: true,
          enableAudioLevels: true,
          // Audio optimization to prevent echo
          enableEchoCancellation: true,
          enableNoiseSuppression: true,
          enableAutomaticGainControl: true,
          // Additional audio settings
          enableHighQualityAudio: true,
          enableOpusDtx: true,
          enableOpusFec: true,
          // Sound settings
          sounds: {
            join: true,
            leave: true,
            notification: true
          },
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
          HIDE_PROMOTIONAL_SPOTLIGHT: true,
          // Enable audio notifications
          ENABLE_AUDIO_LEVELS: true,
          ENABLE_SOUNDS: true,
          // Audio quality settings
          AUDIO_QUALITY: 'high',
          // Prevent audio feedback
          DISABLE_AUDIO_LEVELS: false,
          ENABLE_ECHO_CANCELLATION: true
        }
      }

      const api = new window.JitsiMeetExternalAPI(domain, options)
      setJitsiApi(api)
      setIsLoading(false)

      // Event listeners with sound effects
      api.addEventListeners({
        readyToClose: handleCallEnd,
        participantLeft: handleParticipantLeft,
        participantJoined: handleParticipantJoined,
        videoConferenceJoined: handleVideoConferenceJoined,
        videoConferenceLeft: handleVideoConferenceLeft,
        // Additional events for better sound feedback
        audioLevelChanged: handleAudioLevelChanged,
        dominantSpeakerChanged: handleDominantSpeakerChanged,
        raiseHandUpdated: handleRaiseHandUpdated
      })
    } catch (err) {
      setError('Failed to create Jitsi Meet session')
      setIsLoading(false)
    }
  }

  const handleCallEnd = () => {
    setIsInCall(false)
    playSound(leaveSoundRef)
    if (onCallEnd) onCallEnd()
  }

  const handleParticipantLeft = (event: any) => {
    setParticipantCount(prev => Math.max(0, prev - 1))
    playSound(leaveSoundRef)
  }

  const handleParticipantJoined = (event: any) => {
    setParticipantCount(prev => prev + 1)
    playSound(joinSoundRef)
  }

  const handleVideoConferenceJoined = (event: any) => {
    setIsInCall(true)
    setParticipantCount(1) // Including yourself
    playSound(joinSoundRef)
  }

  const handleVideoConferenceLeft = (event: any) => {
    setIsInCall(false)
    setParticipantCount(0)
    playSound(leaveSoundRef)
  }

  const handleAudioLevelChanged = (event: any) => {
    // Play notification sound when someone speaks (optional)
    if (event.audioLevel > 0.1 && event.audioLevel < 0.3) {
      // Only play for moderate audio levels to avoid spam
      // playSound(notificationSoundRef)
    }
  }

  const handleDominantSpeakerChanged = (event: any) => {
    // Play sound when dominant speaker changes
    if (event.id && event.id !== 'local') {
      playSound(notificationSoundRef)
    }
  }

  const handleRaiseHandUpdated = (event: any) => {
    // Play sound when someone raises their hand
    if (event.handRaised) {
      playSound(notificationSoundRef)
    }
  }

  const copyRoomLink = () => {
    const roomLink = `https://meet.jit.si/${roomName}`
    navigator.clipboard.writeText(roomLink)
    // Play notification sound when copying link
    playSound(notificationSoundRef)
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

          <button
            onClick={() => setSoundsEnabled(!soundsEnabled)}
            className={`p-2 transition-colors ${
              soundsEnabled 
                ? 'text-green-400 hover:text-green-300' 
                : 'text-slate-400 hover:text-slate-300'
            }`}
            title={soundsEnabled ? 'Disable sounds' : 'Enable sounds'}
          >
            {soundsEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowAudioSettings(!showAudioSettings)}
            className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
            title="Audio settings"
          >
            <Headphones className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Echo Prevention Warning */}
      {!showAudioSettings && isInCall && (
        <div className="bg-yellow-900/30 border-b border-yellow-700 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center text-yellow-200">
              <Headphones className="w-4 h-4 mr-2" />
              <span className="text-sm">Experiencing echo? Click the headphones icon for audio settings</span>
            </div>
            <button
              onClick={() => setShowAudioSettings(true)}
              className="text-yellow-300 hover:text-yellow-100 text-sm underline"
            >
              Open Settings
            </button>
          </div>
        </div>
      )}

      {/* Audio Settings Panel */}
      {showAudioSettings && (
        <div className="bg-slate-700 border-b border-slate-600 p-4">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-white font-semibold mb-3 flex items-center">
              <Headphones className="w-5 h-5 mr-2" />
              Audio Settings & Echo Prevention
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Settings */}
              <div className="space-y-4">
                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-2">Current Settings</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Echo Cancellation:</span>
                      <span className="text-green-400">Enabled</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Noise Suppression:</span>
                      <span className="text-green-400">Enabled</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Auto Gain Control:</span>
                      <span className="text-green-400">Enabled</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-medium mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        if (jitsiApi) {
                          jitsiApi.executeCommand('toggleAudio');
                        }
                      }}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded transition-colors"
                    >
                      Toggle Microphone
                    </button>
                    <button
                      onClick={() => {
                        if (jitsiApi) {
                          jitsiApi.executeCommand('toggleVideo');
                        }
                      }}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded transition-colors"
                    >
                      Toggle Camera
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Tips */}
              <div className="space-y-4">
                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="text-green-400 font-medium mb-2">💡 Echo Prevention Tips</h4>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Use headphones or earbuds to prevent audio feedback</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Keep speakers at low volume or mute them</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Position microphone away from speakers</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-400 mr-2">•</span>
                      <span>Use a quiet environment when possible</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="text-purple-400 font-medium mb-2">🔧 Technical Solutions</h4>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Echo cancellation is automatically enabled</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Noise suppression filters background sounds</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Auto gain control adjusts microphone sensitivity</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
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
          
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Sounds:</span>
            <span className={`font-medium ${soundsEnabled ? 'text-green-400' : 'text-slate-400'}`}>
              {soundsEnabled ? 'Enabled' : 'Disabled'}
            </span>
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
