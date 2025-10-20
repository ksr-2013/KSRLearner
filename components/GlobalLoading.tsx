'use client'

import { useEffect, useState } from 'react'

export default function GlobalLoading() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show loading for a minimum time to see the animation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    // Also hide loading when page is fully loaded
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false)
      }, 500) // Small delay to ensure smooth transition
    }

    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
    }

    return () => {
      clearTimeout(timer)
      window.removeEventListener('load', handleLoad)
    }
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50">
      <div className="flex flex-col items-center">
        {/* Logo with spinning animation */}
        <div className="relative mb-8">
          <div className="w-20 h-20 animate-spin">
            <img 
              src="/logo.png" 
              alt="KSRLearner Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          {/* Loading bar */}
          <div className="absolute -bottom-2 left-0 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-900 to-blue-700 animate-pulse rounded-full"></div>
          </div>
        </div>
        
        {/* Loading text with dots animation */}
        <div className="text-slate-300 text-xl font-medium">
          <span className="animate-pulse">Loading</span>
          <span className="inline-block animate-bounce ml-1" style={{ animationDelay: '0.1s' }}>.</span>
          <span className="inline-block animate-bounce ml-1" style={{ animationDelay: '0.2s' }}>.</span>
          <span className="inline-block animate-bounce ml-1" style={{ animationDelay: '0.3s' }}>.</span>
        </div>
        
        {/* Progress bar */}
        <div className="w-80 h-3 bg-slate-800 rounded-full mt-6 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 rounded-full animate-pulse"></div>
        </div>
        
        {/* Welcome text */}
        <div className="text-slate-400 text-sm mt-4 animate-pulse">
          Welcome to KSRLearner
        </div>
      </div>
    </div>
  )
}
