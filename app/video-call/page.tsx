'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import ZoomIntegration from '../../components/ZoomIntegration'

export default function VideoCall() {
  const [roomId] = useState('demo-room-' + Math.random().toString(36).substr(2, 9))

  const handleCallEnd = () => {
    // Handle call end logic here
    console.log('Call ended')
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Video Call Session
            </h1>
            <p className="text-xl text-slate-300">
              Connect with students and provide real-time learning support
            </p>
          </div>

          {/* Zoom Integration */}
          <ZoomIntegration 
            roomName={roomId}
            displayName="KSR Learner Teacher"
            isHost={true}
            onCallEnd={handleCallEnd}
          />

          {/* Additional Info */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📹</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">High Quality</h3>
              <p className="text-slate-300 text-sm">Crystal clear video and audio powered by Zoom</p>
            </div>
            
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
              <div className="w-16 h-16 bg-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
              <p className="text-slate-300 text-sm">Built-in chat, screen sharing, and recording features</p>
            </div>
            
            <div className="bg-slate-800 rounded-xl p-6 border border-slate-700 text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Secure</h3>
              <p className="text-slate-300 text-sm">End-to-end encrypted video calls with unique room IDs</p>
            </div>
          </div>

          {/* Student Join Section */}
          <div className="mt-8 bg-gradient-to-r from-blue-900 to-blue-800 rounded-xl p-8 border border-blue-700">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Students Can Join Here
              </h3>
              <p className="text-blue-200 mb-6">
                Share this link with your students so they can easily join your video calls
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/video-call/join" 
                  className="bg-white text-blue-900 hover:bg-slate-100 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Student Join Page
                </Link>
                <button 
                  onClick={() => navigator.clipboard.writeText(`${window.location.origin}/video-call/join`)}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
                >
                  Copy Join Link
                </button>
              </div>
            </div>
          </div>

          {/* Test Section */}
          <div className="mt-8 bg-gradient-to-r from-green-900 to-green-800 rounded-xl p-8 border border-green-700">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">
                Test Your Video Call Setup
              </h3>
              <p className="text-green-200 mb-6">
                Use our test page to verify that Zoom is working correctly before hosting real sessions
              </p>
              <Link 
                href="/video-call/test" 
                className="bg-white text-green-900 hover:bg-slate-100 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                Test Video Call
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
