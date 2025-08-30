'use client'

import { useEffect, useRef, useState } from 'react'
import { Video, Users, Settings, Share, Copy, ExternalLink, AlertCircle, Volume2, VolumeX, Headphones, Mic, MicOff, Calendar, Clock } from 'lucide-react'

interface GoogleMeetIntegrationProps {
  roomName: string
  displayName?: string
  isHost?: boolean
  onCallEnd?: () => void
}

export default function GoogleMeetIntegration({ 
  roomName, 
  displayName = 'KSR Learner',
  isHost = true,
  onCallEnd 
}: GoogleMeetIntegrationProps) {
  const [isInCall, setIsInCall] = useState(false)
  const [participantCount, setParticipantCount] = useState(0)
  const [soundsEnabled, setSoundsEnabled] = useState(true)
  const [showAudioSettings, setShowAudioSettings] = useState(false)
  const [meetingLink, setMeetingLink] = useState('')
  const [isLoadingMeeting, setIsLoadingMeeting] = useState(false)

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

    // Generate Google Meet link
    const meetLink = `https://meet.google.com/${roomName}`
    setMeetingLink(meetLink)
  }, [roomName])

  const playSound = (soundRef: React.RefObject<HTMLAudioElement | null>) => {
    if (soundsEnabled && soundRef.current) {
      soundRef.current.currentTime = 0
      soundRef.current.play().catch(() => {
        // Ignore audio play errors (common in some browsers)
      })
    }
  }

  const joinMeeting = () => {
    setIsLoadingMeeting(true)
    setIsInCall(true)
    setParticipantCount(1)
    playSound(joinSoundRef)
    // Don't open in new tab - stay in current website
  }

  const copyMeetingLink = () => {
    navigator.clipboard.writeText(meetingLink)
    playSound(notificationSoundRef)
  }

  const scheduleMeeting = () => {
    const calendarLink = `https://calendar.google.com/calendar/u/0/r/eventedit?text=KSR%20Learner%20Video%20Call&details=Video%20call%20session%20with%20${encodeURIComponent(displayName)}&location=${encodeURIComponent(meetingLink)}`
    window.open(calendarLink, '_blank')
    playSound(notificationSoundRef)
  }

  const handleCallEnd = () => {
    setIsInCall(false)
    setParticipantCount(0)
    setIsLoadingMeeting(false)
    playSound(leaveSoundRef)
    if (onCallEnd) onCallEnd()
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
            onClick={copyMeetingLink}
            className="p-2 text-slate-400 hover:text-blue-400 transition-colors"
            title="Copy meeting link"
          >
            <Copy className="w-4 h-4" />
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
                  <h4 className="text-blue-400 font-medium mb-2">Google Meet Features</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Echo Cancellation:</span>
                      <span className="text-green-400">Built-in</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Noise Suppression:</span>
                      <span className="text-green-400">Automatic</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Audio Quality:</span>
                      <span className="text-green-400">HD Audio</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-4">
                  <h4 className="text-yellow-400 font-medium mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={joinMeeting}
                      className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded transition-colors"
                    >
                      Join Meeting
                    </button>
                    <button
                      onClick={scheduleMeeting}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded transition-colors"
                    >
                      Schedule Meeting
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
                  <h4 className="text-purple-400 font-medium mb-2">🔧 Google Meet Advantages</h4>
                  <ul className="text-sm text-slate-300 space-y-2">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Superior echo cancellation technology</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Automatic noise suppression</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>HD audio quality</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Reliable connection</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-8">
        <div className="text-center mb-8">
          {/* Google Meet Logo */}
          <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Video className="w-12 h-12 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Google Meet Video Call
          </h2>
          
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Experience superior audio quality with Google Meet's advanced echo cancellation and noise suppression technology.
          </p>

          {/* Meeting Info */}
          <div className="bg-slate-700 rounded-xl p-6 border border-slate-600 mb-8 max-w-md mx-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Meeting ID:</span>
                <span className="font-mono text-blue-400">{roomName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Host:</span>
                <span className="text-white">{displayName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Platform:</span>
                <span className="text-green-400">Google Meet</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                      <button
            onClick={joinMeeting}
            className={`font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center ${
              isInCall 
                ? 'bg-yellow-600 hover:bg-yellow-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Video className="w-5 h-4 mr-2" />
            {isInCall ? 'Meeting Active' : 'Create Meeting'}
          </button>
            
            <button
              onClick={scheduleMeeting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
            >
              <Calendar className="w-5 h-5 mr-2" />
              Schedule Meeting
            </button>
          </div>
        </div>

        {/* Meeting Interface */}
        {isInCall && (
          <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
            <div className="p-4 border-b border-slate-700 bg-slate-800">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Live Meeting</h3>
                <button
                  onClick={handleCallEnd}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  End Meeting
                </button>
              </div>
            </div>
            
            {/* Meeting Content */}
            <div className="p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Video className="w-12 h-12 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                Meeting is Active!
              </h3>
              
              <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
                Your Google Meet session is ready. Click the button below to join the meeting in a new tab, 
                or copy the meeting link to share with others.
              </p>
              
              {/* Meeting Actions */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <button
                  onClick={() => window.open(meetingLink, '_blank')}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  <Video className="w-5 h-5 mr-2" />
                  Join Meeting Now
                </button>
                
                <button
                  onClick={copyMeetingLink}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copy Meeting Link
                </button>
              </div>
              
              {/* Meeting Info Card */}
              <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-md mx-auto">
                <h4 className="text-lg font-semibold text-white mb-4">Meeting Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Meeting ID:</span>
                    <span className="font-mono text-blue-400">{roomName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Direct Link:</span>
                    <span className="text-green-400 break-all">{meetingLink}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Status:</span>
                    <span className="text-green-400">Active</span>
                  </div>
                </div>
              </div>
              
              {/* Instructions */}
              <div className="mt-8 bg-slate-800 rounded-xl p-6 border border-slate-700 max-w-2xl mx-auto">
                <h4 className="text-lg font-semibold text-white mb-4">How to Join:</h4>
                <ol className="text-slate-300 text-left space-y-2">
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">1.</span>
                    <span>Click "Join Meeting Now" to open Google Meet in a new tab</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">2.</span>
                    <span>Allow camera and microphone access when prompted</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">3.</span>
                    <span>Share the meeting link with students so they can join</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-400 mr-2">4.</span>
                    <span>Use Google Meet's built-in features for the best experience</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Features Grid - Only show when not in call */}
        {!isInCall && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Echo Cancellation</h3>
              <p className="text-slate-300 text-sm">
                Advanced technology prevents audio feedback and echo during calls
              </p>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Noise Suppression</h3>
              <p className="text-slate-300 text-sm">
                Automatically filters background noise for crystal clear audio
              </p>
            </div>
            
            <div className="bg-slate-700 rounded-lg p-6 border border-slate-600">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Reliable Connection</h3>
              <p className="text-slate-300 text-sm">
                Stable video calls with excellent audio quality
              </p>
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
              {isInCall ? 'In Meeting' : 'Ready to Join'}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400">Participants:</span>
            <span className="text-white font-medium">{participantCount}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-slate-400">Platform:</span>
            <span className="text-green-400 font-medium">Google Meet</span>
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
            Powered by <a href="https://meet.google.com/" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">Google Meet</a> - Professional video conferencing with superior audio quality
          </p>
        </div>
      </div>
    </div>
  )
}
