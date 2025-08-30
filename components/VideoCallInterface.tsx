'use client'

import { useState, useRef, useEffect } from 'react'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  MessageCircle, 
  Users, 
  Settings, 
  Share, 
  MoreVertical, 
  Send,
  Maximize,
  Minimize,
  ScreenShare,
  Square
} from 'lucide-react'

interface VideoCallInterfaceProps {
  isHost?: boolean
  roomId?: string
  onCallEnd?: () => void
}

export default function VideoCallInterface({ 
  isHost = true, 
  roomId = 'demo-room-123',
  onCallEnd 
}: VideoCallInterfaceProps) {
  const [isVideoOn, setIsVideoOn] = useState(true)
  const [isAudioOn, setIsAudioOn] = useState(true)
  const [isInCall, setIsInCall] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showParticipants, setShowParticipants] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'You', message: 'Hello! How can I help you today?', time: '10:30 AM', isOwn: true },
    { id: 2, user: 'Student', message: 'I have a question about the computer basics quiz.', time: '10:31 AM', isOwn: false },
    { id: 3, user: 'You', message: 'Of course! What would you like to know?', time: '10:31 AM', isOwn: true }
  ])
  const [participants] = useState([
    { id: 1, name: 'You', role: 'Host', isOnline: true, isSpeaking: false },
    { id: 2, name: 'John Doe', role: 'Student', isOnline: true, isSpeaking: true },
    { id: 3, name: 'Jane Smith', role: 'Student', isOnline: false, isSpeaking: false }
  ])

  const videoRef = useRef<HTMLVideoElement>(null)
  const localVideoRef = useRef<HTMLVideoElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simulate video stream for demo purposes
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = new MediaStream()
    }
  }, [])

  useEffect(() => {
    // Auto-scroll chat to bottom
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [chatMessages])

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn)
  }

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn)
  }

  const toggleCall = () => {
    if (isInCall && onCallEnd) {
      onCallEnd()
    }
    setIsInCall(!isInCall)
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const newMessage = {
        id: chatMessages.length + 1,
        user: 'You',
        message: chatMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true
      }
      setChatMessages([...chatMessages, newMessage])
      setChatMessage('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId)
    // You could add a toast notification here
  }

  return (
    <div className={`bg-slate-800 rounded-xl border border-slate-700 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-300">
            Room: <span className="font-mono text-blue-400">{roomId}</span>
            <button 
              onClick={copyRoomId}
              className="ml-2 text-blue-400 hover:text-blue-300"
              title="Copy room ID"
            >
              📋
            </button>
          </div>
          
          <button
            onClick={toggleFullscreen}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-0">
        {/* Main Video Area */}
        <div className="lg:col-span-3 p-6">
          {/* Main Video Display */}
          <div className="relative bg-slate-900 rounded-lg overflow-hidden mb-6" style={{ height: '400px' }}>
            {isInCall ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-white text-lg">Student video will appear here</p>
                  <p className="text-slate-400 text-sm">Waiting for student to join...</p>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="w-12 h-12 text-slate-400" />
                  </div>
                  <p className="text-white text-lg">Start a call to begin</p>
                  <p className="text-slate-400 text-sm">Click the call button below</p>
                </div>
              </div>
            )}
            
            {/* Recording indicator */}
            {isRecording && (
              <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                REC
              </div>
            )}
          </div>

          {/* Local Video Preview */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <video
                ref={localVideoRef}
                className={`w-32 h-24 bg-slate-700 rounded-lg ${!isVideoOn ? 'opacity-50' : ''}`}
                autoPlay
                muted
                playsInline
              />
              {!isVideoOn && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <VideoOff className="w-8 h-8 text-slate-400" />
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 bg-slate-800 rounded-full p-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Call Controls */}
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={toggleAudio}
              className={`p-4 rounded-full transition-all duration-200 ${
                isAudioOn 
                  ? 'bg-green-600 hover:bg-green-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title={isAudioOn ? 'Mute microphone' : 'Unmute microphone'}
            >
              {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            <button
              onClick={toggleCall}
              className={`p-6 rounded-full transition-all duration-200 ${
                isInCall 
                  ? 'bg-red-600 hover:bg-red-700 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
              title={isInCall ? 'End call' : 'Start call'}
            >
              {isInCall ? <PhoneOff className="w-8 h-8" /> : <Phone className="w-8 h-8" />}
            </button>

            <button
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all duration-200 ${
                isVideoOn 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
              title={isVideoOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>
          </div>

          {/* Additional Controls */}
          <div className="flex justify-center items-center space-x-4 mt-4">
            <button 
              onClick={toggleScreenShare}
              className={`p-3 rounded-full transition-colors ${
                isScreenSharing 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
              title={isScreenSharing ? 'Stop sharing' : 'Share screen'}
            >
              <ScreenShare className="w-5 h-5" />
            </button>
            
            <button 
              onClick={toggleRecording}
              className={`p-3 rounded-full transition-colors ${
                isRecording 
                  ? 'bg-red-600 text-white' 
                  : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
              }`}
              title={isRecording ? 'Stop recording' : 'Start recording'}
            >
                              <Square className="w-5 h-5" />
            </button>
            
            <button className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            
            <button className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
              <Share className="w-5 h-5" />
            </button>
            
            <button className="p-3 rounded-full bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 border-l border-slate-700 p-6 space-y-6">
          {/* Participants */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Participants</h3>
              <button
                onClick={() => setShowParticipants(!showParticipants)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <Users className="w-5 h-5" />
              </button>
            </div>
            
            {showParticipants && (
              <div className="space-y-3">
                {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center space-x-3">
                    <div className="relative">
                      <div className={`w-3 h-3 rounded-full ${participant.isOnline ? 'bg-green-500' : 'bg-slate-500'}`}></div>
                      {participant.isSpeaking && (
                        <div className="absolute -inset-1 bg-green-500 rounded-full animate-ping opacity-75"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{participant.name}</p>
                      <p className="text-slate-400 text-xs">{participant.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chat */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Chat</h3>
              <button
                onClick={() => setShowChat(!showChat)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
            
            {showChat && (
              <>
                <div 
                  ref={chatContainerRef}
                  className="space-y-3 mb-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800"
                >
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`text-sm ${msg.isOwn ? 'text-right' : 'text-left'}`}>
                      <div className={`flex items-center space-x-2 mb-1 ${msg.isOwn ? 'justify-end' : 'justify-start'}`}>
                        <span className={`font-medium ${msg.isOwn ? 'text-blue-400' : 'text-green-400'}`}>
                          {msg.user}
                        </span>
                        <span className="text-slate-500 text-xs">{msg.time}</span>
                      </div>
                      <div className={`inline-block max-w-xs px-3 py-2 rounded-lg ${
                        msg.isOwn 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-slate-700 text-slate-300'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Call Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Call Info</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className={`font-medium ${isInCall ? 'text-green-400' : 'text-slate-400'}`}>
                  {isInCall ? 'Connected' : 'Disconnected'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Duration:</span>
                <span className="text-white">00:00:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Participants:</span>
                <span className="text-white">{participants.filter(p => p.isOnline).length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Recording:</span>
                <span className={`font-medium ${isRecording ? 'text-red-400' : 'text-slate-400'}`}>
                  {isRecording ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
