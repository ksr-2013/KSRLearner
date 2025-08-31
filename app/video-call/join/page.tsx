'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import ZoomIntegration from '../../../components/ZoomIntegration'
import { Video, Users, Copy, ExternalLink, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function JoinVideoCall() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [roomId, setRoomId] = useState(searchParams.get('room') || '')
  const [displayName, setDisplayName] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState('')

  const handleJoinCall = () => {
    if (!roomId.trim()) {
      setError('Please enter a room ID')
      return
    }
    if (!displayName.trim()) {
      setError('Please enter your name')
      return
    }
    
    setError('')
    setIsJoining(true)
  }

  const handleCallEnd = () => {
    setIsJoining(false)
    router.push('/video-call/join')
  }

  const copyRoomLink = () => {
    if (roomId) {
      const roomLink = `${window.location.origin}/video-call/join?room=${roomId}`
      navigator.clipboard.writeText(roomLink)
      // You could add a toast notification here
    }
  }

  if (isJoining) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        
        <div className="pt-16 pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <div className="mb-6">
              <button
                onClick={() => setIsJoining(false)}
                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Join</span>
              </button>
            </div>

            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Joining Video Call
              </h1>
              <p className="text-xl text-slate-300">
                Room: <span className="font-mono text-blue-400">{roomId}</span>
              </p>
            </div>

                          {/* Zoom Integration */}
                    <ZoomIntegration 
          roomName={roomId}
          displayName={displayName}
          isHost={false}
          onCallEnd={handleCallEnd}
        />
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="pt-16 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Join Video Call
            </h1>
            <p className="text-xl text-slate-300">
              Enter the room ID provided by your teacher to join the learning session
            </p>
          </div>

          {/* Join Form */}
          <div className="bg-slate-800 rounded-xl p-8 border border-slate-700">
            <div className="space-y-6">
              <div>
                <label htmlFor="roomId" className="block text-sm font-medium text-white mb-2">
                  Room ID
                </label>
                <input
                  type="text"
                  id="roomId"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  placeholder="Enter room ID (e.g., ksr-math-class-123)"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-white mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                />
              </div>

              {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                onClick={handleJoinCall}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Video className="w-5 h-5" />
                <span>Join Video Call</span>
              </button>
            </div>

            {/* Quick Actions */}
            {roomId && (
              <div className="mt-6 pt-6 border-t border-slate-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-slate-400">
                    Room: <span className="font-mono text-blue-400">{roomId}</span>
                  </div>
                  <button
                    onClick={copyRoomLink}
                    className="flex items-center space-x-2 text-slate-400 hover:text-blue-400 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure</h3>
              <p className="text-slate-300 text-sm">End-to-end encrypted video calls powered by Zoom</p>
            </div>
            
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💻</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Downloads</h3>
              <p className="text-slate-300 text-sm">Works directly in your browser - no software installation needed</p>
            </div>
            
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌐</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Cross-Platform</h3>
              <p className="text-slate-300 text-sm">Works on desktop, tablet, and mobile devices</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-12 bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">How to Join:</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
              <li>Get the room ID from your teacher</li>
              <li>Enter the room ID and your name above</li>
              <li>Click "Join Video Call"</li>
              <li>Allow camera and microphone access when prompted</li>
              <li>You'll be connected to the learning session</li>
            </ol>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
