'use client'

import { useState, useEffect } from 'react'
import { Save, Check, X } from 'lucide-react'

interface SaveScoreProps {
  type: 'quiz' | 'typing' | 'puzzle'
  title: string
  score?: number
  wpm?: number
  level?: string
  completed: boolean
  duration?: number
  details?: any
  onSave?: () => void
}

export default function SaveScore({
  type,
  title,
  score,
  wpm,
  level,
  completed,
  duration,
  details,
  onSave
}: SaveScoreProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' })
        const data = await response.json()
        setIsLoggedIn(!!data?.user)
      } catch (error) {
        setIsLoggedIn(false)
      }
    }
    checkAuth()
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveStatus('idle')
    setMessage('')

    try {
      const response = await fetch('/api/scores/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          title,
          score,
          wpm,
          level,
          completed,
          duration,
          details
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSaveStatus('success')
        setMessage('Score saved successfully! 🎉')
        onSave?.()
      } else if (response.status === 401) {
        setSaveStatus('error')
        setMessage('Please log in to save your score')
      } else {
        setSaveStatus('error')
        setMessage(data.error || 'Failed to save score')
      }
    } catch (error) {
      setSaveStatus('error')
      setMessage('Network error. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const getScoreDisplay = () => {
    if (type === 'quiz' && score !== undefined) {
      return `${score}%`
    } else if (type === 'typing' && wpm !== undefined) {
      return `${wpm} WPM`
    } else if (type === 'puzzle') {
      return completed ? 'Completed' : 'In Progress'
    }
    return ''
  }

  const getIcon = () => {
    switch (type) {
      case 'quiz': return '📚'
      case 'typing': return '⚡'
      case 'puzzle': return '🧩'
      default: return '📝'
    }
  }

  // Show loading state while checking authentication
  if (isLoggedIn === null) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mr-3" />
          <span className="text-slate-300">Loading...</span>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isLoggedIn) {
    return (
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{getIcon()}</div>
            <div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <div className="text-slate-400 text-sm">
                {type.charAt(0).toUpperCase() + type.slice(1)} • {level || 'General'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-400">{getScoreDisplay()}</div>
            <div className="text-slate-400 text-sm">
              {completed ? 'Completed' : 'In Progress'}
            </div>
          </div>
        </div>
        
        <div className="bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span className="text-sm font-medium">Login to save your progress</span>
          </div>
          <p className="text-sm text-blue-300 mt-1">
            Create an account or log in to track your scores and achievements in your dashboard.
          </p>
        </div>
        
        <div className="flex justify-center">
          <a 
            href="/auth" 
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Login to Save Score
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">{getIcon()}</div>
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <div className="text-slate-400 text-sm">
              {type.charAt(0).toUpperCase() + type.slice(1)} • {level || 'General'}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-400">{getScoreDisplay()}</div>
          <div className="text-slate-400 text-sm">
            {completed ? 'Completed' : 'In Progress'}
          </div>
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded-lg flex items-center space-x-2 ${
          saveStatus === 'success' 
            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
            : 'bg-red-500/20 text-red-400 border border-red-500/30'
        }`}>
          {saveStatus === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            <X className="w-4 h-4" />
          )}
          <span className="text-sm">{message}</span>
          {saveStatus === 'error' && message.includes('log in') && (
            <a 
              href="/auth" 
              className="ml-2 text-blue-400 hover:text-blue-300 underline text-sm"
            >
              Login here
            </a>
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-slate-400 text-sm">
          {duration && `Duration: ${Math.round(duration / 1000)}s`}
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || saveStatus === 'success'}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
            saveStatus === 'success'
              ? 'bg-green-600 text-white cursor-not-allowed'
              : saveStatus === 'error'
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          } ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : saveStatus === 'success' ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Score</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
