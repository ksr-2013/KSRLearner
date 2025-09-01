'use client'

import React, { useState, useRef, useEffect } from 'react'
import { 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  Phone, 
  PhoneOff, 
  Monitor, 
  MessageCircle, 
  Users, 
  Settings,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'

interface Participant {
  id: string
  name: string
  isHost: boolean
  isMuted: boolean
  isVideoOff: boolean
  isSpeaking: boolean
}

interface Meeting {
  roomId: string
  password: string
  hostName: string
  participants: Participant[]
}

const CustomVideoCall: React.FC = () => {
  const [isInCall, setIsInCall] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isSoundOn, setIsSoundOn] = useState(true)
  const [showParticipants, setShowParticipants] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [callDuration, setCallDuration] = useState(0)
  const [isConnecting, setIsConnecting] = useState(false)
  const [currentView, setCurrentView] = useState<'create' | 'join' | 'call'>('create')
  
  // Meeting creation state
  const [meetingData, setMeetingData] = useState({
    roomId: '',
    password: '',
    hostName: '',
    confirmPassword: ''
  })
  
  // Meeting join state
  const [joinData, setJoinData] = useState({
    roomId: '',
    password: '',
    participantName: ''
  })
  
  // Current meeting
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null)
  const [currentParticipant, setCurrentParticipant] = useState<Participant | null>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const screenRef = useRef<HTMLVideoElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Generate random room ID
  useEffect(() => {
    const randomId = Math.random().toString(36).substring(2, 8).toUpperCase()
    setMeetingData(prev => ({ ...prev, roomId: randomId }))
  }, [])

  // Call duration timer
  useEffect(() => {
    if (isInCall) {
      timerRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        setCallDuration(0)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isInCall])

  // Simulate video stream
  useEffect(() => {
    if (videoRef.current && isInCall && !isVideoOff) {
      // Create a canvas with animated content to simulate video
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (ctx) {
        canvas.width = 640
        canvas.height = 480
        
        let frame = 0
        const animate = () => {
          frame++
          
          // Create animated background
          ctx.fillStyle = `hsl(${frame % 360}, 70%, 80%)`
          ctx.fillRect(0, 0, canvas.width, canvas.height)
          
          // Add some animated elements
          ctx.fillStyle = `hsl(${(frame * 2) % 360}, 60%, 60%)`
          ctx.beginPath()
          ctx.arc(320 + Math.sin(frame * 0.1) * 50, 240 + Math.cos(frame * 0.1) * 30, 20, 0, Math.PI * 2)
          ctx.fill()
          
          // Add text
          ctx.fillStyle = '#333'
          ctx.font = '24px Arial'
          ctx.textAlign = 'center'
          ctx.fillText('Live Video', 320, 240)
          ctx.fillText(`Frame: ${frame}`, 320, 280)
          
          // Convert to video stream
          const stream = canvas.captureStream(30)
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
          
          requestAnimationFrame(animate)
        }
        animate()
      }
    }
  }, [isInCall, isVideoOff])

  const createMeeting = () => {
    if (!meetingData.hostName.trim()) {
      alert('Please enter your name')
      return
    }
    if (!meetingData.password.trim()) {
      alert('Please enter a password')
      return
    }
    if (meetingData.password !== meetingData.confirmPassword) {
      alert('Passwords do not match')
      return
    }
    if (meetingData.password.length < 4) {
      alert('Password must be at least 4 characters long')
      return
    }
    
    // Create meeting
    const newMeeting: Meeting = {
      roomId: meetingData.roomId,
      password: meetingData.password,
      hostName: meetingData.hostName,
      participants: [
        {
          id: '1',
          name: meetingData.hostName,
          isHost: true,
          isMuted: false,
          isVideoOff: false,
          isSpeaking: false
        },
        {
          id: '2',
          name: 'Student 1',
          isHost: false,
          isMuted: false,
          isVideoOff: false,
          isSpeaking: true
        },
        {
          id: '3',
          name: 'Student 2',
          isHost: false,
          isMuted: true,
          isVideoOff: true,
          isSpeaking: false
        }
      ]
    }
    
    setCurrentMeeting(newMeeting)
    setCurrentParticipant(newMeeting.participants[0])
    setIsConnecting(true)
    setTimeout(() => {
      setIsConnecting(false)
      setIsInCall(true)
      setCurrentView('call')
    }, 2000)
  }

  const joinMeeting = () => {
    if (!joinData.roomId.trim()) {
      alert('Please enter room ID')
      return
    }
    if (!joinData.password.trim()) {
      alert('Please enter password')
      return
    }
    if (!joinData.participantName.trim()) {
      alert('Please enter your name')
      return
    }
    
    // For demo purposes, we'll simulate joining the meeting
    // In a real app, you'd verify the room ID and password
    if (joinData.roomId === 'DEMO123' && joinData.password === 'password123') {
      const newParticipant: Participant = {
        id: Date.now().toString(),
        name: joinData.participantName,
        isHost: false,
        isMuted: false,
        isVideoOff: false,
        isSpeaking: false
      }
      
      setCurrentParticipant(newParticipant)
      setIsConnecting(true)
      setTimeout(() => {
        setIsConnecting(false)
        setIsInCall(true)
        setCurrentView('call')
      }, 2000)
    } else {
      alert('Invalid room ID or password')
    }
  }

  const endCall = () => {
    setIsInCall(false)
    setCallDuration(0)
    setCurrentView('create')
    setCurrentMeeting(null)
    setCurrentParticipant(null)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
    if (currentParticipant) {
      setCurrentParticipant(prev => prev ? { ...prev, isMuted: !isMuted } : null)
    }
  }

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff)
    if (currentParticipant) {
      setCurrentParticipant(prev => prev ? { ...prev, isVideoOff: !isVideoOff } : null)
    }
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const copyRoomId = () => {
    navigator.clipboard.writeText(meetingData.roomId)
    alert('Room ID copied to clipboard!')
  }

  const copyMeetingInfo = () => {
    const info = `Room ID: ${meetingData.roomId}\nPassword: ${meetingData.password}`
    navigator.clipboard.writeText(info)
    alert('Meeting info copied to clipboard!')
  }

  // Create Meeting View
  if (currentView === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-10 h-10 text-gray-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-700 mb-2">Secure Video Call</h1>
            <p className="text-gray-500">Create or join password-protected meetings</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setCurrentView('create')}
              className="px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
            >
              Create Meeting
            </button>
            <button
              onClick={() => setCurrentView('join')}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Join Meeting
            </button>
          </div>

          {/* Create Meeting Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Create New Meeting</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Room ID
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={meetingData.roomId}
                    readOnly
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-600"
                  />
                  <button
                    onClick={copyRoomId}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={meetingData.hostName}
                  onChange={(e) => setMeetingData(prev => ({ ...prev, hostName: e.target.value }))}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Meeting Password
                </label>
                <input
                  type="password"
                  value={meetingData.password}
                  onChange={(e) => setMeetingData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter meeting password (min 4 characters)"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={meetingData.confirmPassword}
                  onChange={(e) => setMeetingData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  placeholder="Confirm meeting password"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-700"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={createMeeting}
                  disabled={isConnecting}
                  className="w-full bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creating Meeting...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5" />
                      <span>Create Secure Meeting</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Demo Info */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-600 mb-3">Demo Meeting</h3>
            <p className="text-gray-500 mb-3">To test joining a meeting, use these credentials:</p>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600"><strong>Room ID:</strong> DEMO123</p>
              <p className="text-sm text-gray-600"><strong>Password:</strong> password123</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Join Meeting View
  if (currentView === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-10 h-10 text-gray-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-700 mb-2">Join Meeting</h1>
            <p className="text-gray-500">Enter meeting credentials to join</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setCurrentView('create')}
              className="px-6 py-3 bg-gray-400 text-white rounded-lg font-semibold hover:bg-gray-500 transition-colors"
            >
              Create Meeting
            </button>
            <button
              onClick={() => setCurrentView('join')}
              className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
            >
              Join Meeting
            </button>
          </div>

          {/* Join Meeting Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Join Existing Meeting</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Room ID
                </label>
                <input
                  type="text"
                  value={joinData.roomId}
                  onChange={(e) => setJoinData(prev => ({ ...prev, roomId: e.target.value }))}
                  placeholder="Enter room ID"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Meeting Password
                </label>
                <input
                  type="password"
                  value={joinData.password}
                  onChange={(e) => setJoinData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter meeting password"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={joinData.participantName}
                  onChange={(e) => setJoinData(prev => ({ ...prev, participantName: e.target.value }))}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-300 focus:border-transparent text-gray-700"
                />
              </div>

              <div className="pt-4">
                <button
                  onClick={joinMeeting}
                  disabled={isConnecting}
                  className="w-full bg-gray-400 hover:bg-gray-500 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  {isConnecting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Joining Meeting...</span>
                    </>
                  ) : (
                    <>
                      <Phone className="w-5 h-5" />
                      <span>Join Meeting</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Demo Info */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-600 mb-3">Demo Meeting</h3>
            <p className="text-gray-500 mb-3">To test joining a meeting, use these credentials:</p>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-600"><strong>Room ID:</strong> DEMO123</p>
              <p className="text-sm text-gray-600"><strong>Password:</strong> password123</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Video Call Interface
  if (!isInCall) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-10 h-10 text-gray-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-700 mb-2">Meeting Setup</h1>
            <p className="text-gray-500">Preparing your secure video call...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gray-100 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Video Grid */}
      <div className="relative h-full">
        {/* Main Video Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 h-full">
          {/* Your Video */}
          <div className="relative bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
            {!isVideoOff ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-gray-600 font-semibold">
                      {currentParticipant?.name.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">Camera Off</p>
                </div>
              </div>
            )}
            
            {/* Video Label */}
            <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-30 text-gray-800 px-2 py-1 rounded text-sm">
              {currentParticipant?.name || 'Unknown'} {currentParticipant?.isHost ? '(Host)' : '(You)'}
            </div>
            
            {/* Mute/Video Off Indicators */}
            {isMuted && (
              <div className="absolute top-2 left-2 bg-red-400 text-white p-1 rounded">
                <MicOff className="w-4 h-4" />
              </div>
            )}
            {isVideoOff && (
              <div className="absolute top-2 left-2 bg-red-400 text-white p-1 rounded">
                <VideoOff className="w-4 h-4" />
              </div>
            )}
          </div>

          {/* Other Participants */}
          {currentMeeting?.participants.slice(1).map((participant) => (
            <div key={participant.id} className="relative bg-gray-200 rounded-lg overflow-hidden border border-gray-300">
              {!participant.isVideoOff ? (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl text-gray-700 font-semibold">
                        {participant.name.charAt(0)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{participant.name}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-xl text-gray-600 font-semibold">
                        {participant.name.charAt(0)}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm">{participant.name}</p>
                  </div>
                </div>
              )}
              
              {/* Participant Label */}
              <div className="absolute bottom-2 left-2 bg-gray-800 bg-opacity-30 text-gray-800 px-2 py-1 rounded text-sm">
                {participant.name}
              </div>
              
              {/* Status Indicators */}
              {participant.isMuted && (
                <div className="absolute top-2 left-2 bg-red-400 text-white p-1 rounded">
                  <MicOff className="w-4 h-4" />
                </div>
              )}
              {participant.isSpeaking && (
                <div className="absolute top-2 right-2 bg-green-400 text-white p-1 rounded">
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Screen Share Overlay */}
        {isScreenSharing && (
          <div className="absolute inset-0 bg-gray-800 bg-opacity-80 z-10">
            <div className="h-full flex items-center justify-center">
              <div className="text-center text-gray-700">
                <Monitor className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                <h3 className="text-xl font-semibold mb-2">Screen Sharing Active</h3>
                <p className="text-gray-600">Your screen is being shared with participants</p>
              </div>
            </div>
          </div>
        )}

        {/* Top Bar */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-30 text-gray-700 px-4 py-2 rounded-full border border-gray-300">
          <div className="flex items-center space-x-4">
            <span className="text-sm">Room: {currentMeeting?.roomId}</span>
            <span className="text-sm">Duration: {formatTime(callDuration)}</span>
            <span className="text-sm">Participants: {currentMeeting?.participants.length || 0}</span>
            <span className="text-sm flex items-center">
              <Lock className="w-4 h-4 mr-1" />
              Secure
            </span>
          </div>
        </div>

        {/* Control Bar */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-4 bg-gray-800 bg-opacity-30 px-6 py-3 rounded-full border border-gray-300">
            {/* Mute Button */}
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full transition-colors ${
                isMuted ? 'bg-red-400 hover:bg-red-500' : 'bg-gray-400 hover:bg-gray-500'
              }`}
            >
              {isMuted ? <MicOff className="w-6 h-6 text-white" /> : <Mic className="w-6 h-6 text-white" />}
            </button>

            {/* Video Button */}
            <button
              onClick={toggleVideo}
              className={`p-3 rounded-full transition-colors ${
                isVideoOff ? 'bg-red-400 hover:bg-red-500' : 'bg-gray-400 hover:bg-gray-500'
              }`}
            >
              {isVideoOff ? <VideoOff className="w-6 h-6 text-white" /> : <Video className="w-6 h-6 text-white" />}
            </button>

            {/* Screen Share Button */}
            <button
              onClick={toggleScreenShare}
              className={`p-3 rounded-full transition-colors ${
                isScreenSharing ? 'bg-gray-500 hover:bg-gray-600' : 'bg-gray-400 hover:bg-gray-500'
              }`}
            >
              <Monitor className="w-6 h-6 text-white" />
            </button>

            {/* End Call Button */}
            <button
              onClick={endCall}
              className="p-3 bg-red-400 hover:bg-red-500 rounded-full transition-colors"
            >
              <PhoneOff className="w-6 h-6 text-white" />
            </button>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-3 bg-gray-400 hover:bg-gray-500 rounded-full transition-colors"
            >
              {isFullscreen ? <Minimize className="w-6 h-6 text-white" /> : <Maximize className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>

        {/* Side Panel Toggle Buttons */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 space-y-2">
          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className={`p-3 rounded-full transition-colors ${
              showParticipants ? 'bg-gray-500' : 'bg-gray-800 bg-opacity-30 hover:bg-opacity-50 border border-gray-300'
            }`}
          >
            <Users className="w-5 h-5 text-gray-700" />
          </button>
          
          <button
            onClick={() => setShowChat(!showChat)}
            className={`p-3 rounded-full transition-colors ${
              showChat ? 'bg-gray-500' : 'bg-gray-800 bg-opacity-30 hover:bg-opacity-50 border border-gray-300'
            }`}
          >
            <MessageCircle className="w-5 h-5 text-gray-700" />
          </button>
          
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 rounded-full transition-colors ${
              showSettings ? 'bg-gray-500' : 'bg-gray-800 bg-opacity-30 hover:bg-opacity-50 border border-gray-300'
            }`}
          >
            <Settings className="w-5 h-5 text-gray-700" />
          </button>
        </div>

        {/* Participants Panel */}
        {showParticipants && (
          <div className="absolute right-4 top-20 w-64 bg-gray-800 bg-opacity-30 text-gray-700 rounded-lg p-4 border border-gray-300">
            <h3 className="text-lg font-semibold mb-3">Participants ({currentMeeting?.participants.length || 0})</h3>
            <div className="space-y-2">
              {currentMeeting?.participants.map((participant) => (
                <div key={participant.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                    <span className="text-sm">{participant.name}</span>
                    {participant.isHost && <span className="text-xs bg-gray-500 px-2 py-1 rounded text-white">Host</span>}
                  </div>
                  <div className="flex space-x-1">
                    {participant.isMuted && <MicOff className="w-4 h-4 text-red-400" />}
                    {participant.isVideoOff && <VideoOff className="w-4 h-4 text-red-400" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat Panel */}
        {showChat && (
          <div className="absolute right-4 top-20 w-64 bg-gray-800 bg-opacity-30 text-gray-700 rounded-lg p-4 border border-gray-300">
            <h3 className="text-lg font-semibold mb-3">Chat</h3>
            <div className="h-48 overflow-y-auto mb-3 space-y-2">
              <div className="text-xs text-gray-500">Welcome to the secure meeting!</div>
              <div className="text-xs text-gray-500">Meeting is password protected</div>
              <div className="text-xs text-gray-500">Student 1 joined the meeting</div>
              <div className="text-xs text-gray-500">Student 2 joined the meeting</div>
            </div>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded text-sm border border-gray-300"
              />
              <button className="px-3 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded text-sm">
                Send
              </button>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettings && (
          <div className="absolute right-4 top-20 w-64 bg-gray-800 bg-opacity-30 text-gray-700 rounded-lg p-4 border border-gray-300">
            <h3 className="text-lg font-semibold mb-3">Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Sound</span>
                <button
                  onClick={() => setIsSoundOn(!isSoundOn)}
                  className={`p-2 rounded ${isSoundOn ? 'bg-green-400' : 'bg-gray-400'}`}
                >
                  {isSoundOn ? <Volume2 className="w-4 h-4 text-white" /> : <VolumeX className="w-4 h-4 text-white" />}
                </button>
              </div>
              <div className="text-xs text-gray-500">
                <p>• Echo cancellation: Enabled</p>
                <p>• Noise suppression: Enabled</p>
                <p>• Auto gain control: Enabled</p>
                <p>• Meeting is password protected</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CustomVideoCall
