'use client'

import { useState } from 'react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import GoogleMeetIntegration from '../../../components/GoogleMeetIntegration'

export default function TestVideoCall() {
  const [roomId, setRoomId] = useState('ksr-test-room')
  const [displayName, setDisplayName] = useState('Test Teacher')

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Test Video Call
            </h1>
            <p className="text-xl text-slate-300">
              Testing Jitsi Meet integration
            </p>
          </div>

          {/* Test Controls */}
          <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Room ID
                </label>
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Jitsi Meet Integration */}
                           <GoogleMeetIntegration 
                   roomName={roomId}
                   displayName={displayName}
                   isHost={true}
                   onCallEnd={() => console.log('Call ended')}
                 />

          {/* Instructions */}
          <div className="mt-8 bg-slate-800 rounded-xl p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Test Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-300">
              <li>Enter a unique room ID above</li>
              <li>Set your display name</li>
              <li>Wait for Jitsi Meet to load</li>
              <li>Allow camera and microphone access</li>
              <li>Test video call functionality</li>
                                 <li>Open another browser tab and go to <code className="bg-slate-700 px-2 py-1 rounded">https://meet.google.com/{roomId}</code> to test joining</li>
            </ol>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
