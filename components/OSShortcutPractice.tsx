'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  Folder, 
  FileText, 
  Image, 
  Music, 
  Video, 
  Settings, 
  Search, 
  Maximize2, 
  Minimize2, 
  X, 
  Square,
  Keyboard,
  Trophy,
  Target,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  Info
} from 'lucide-react'

interface Window {
  id: string
  title: string
  icon: React.ReactNode
  content: string
  x: number
  y: number
  width: number
  height: number
  isMinimized: boolean
  isMaximized: boolean
  zIndex: number
}

interface Shortcut {
  id: string
  keys: string[]
  description: string
  action: () => void
  category: 'navigation' | 'window' | 'system' | 'application'
}

interface ShortcutProgress {
  shortcutId: string
  attempts: number
  successes: number
  lastAttempt: number
}

export default function OSShortcutPractice() {
  const [windows, setWindows] = useState<Window[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [nextZIndex, setNextZIndex] = useState(100)
  const [shortcutProgress, setShortcutProgress] = useState<Record<string, ShortcutProgress>>({})
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [practiceMode, setPracticeMode] = useState<'free' | 'guided'>('free')
  const [score, setScore] = useState(0)
  const [recentShortcut, setRecentShortcut] = useState<{ keys: string; success: boolean } | null>(null)
  
  const desktopRef = useRef<HTMLDivElement>(null)

  const createWindow = useCallback((title: string, icon: React.ReactNode, content: string) => {
    const newWindow: Window = {
      id: `window-${Date.now()}`,
      title,
      icon,
      content,
      x: 100 + windows.length * 30,
      y: 100 + windows.length * 30,
      width: 600,
      height: 400,
      isMinimized: false,
      isMaximized: false,
      zIndex: nextZIndex
    }
    setWindows(prev => [...prev, newWindow])
    setActiveWindowId(newWindow.id)
    setNextZIndex(prev => prev + 1)
  }, [windows.length, nextZIndex])

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id))
    if (activeWindowId === id) {
      const remaining = windows.filter(w => w.id !== id)
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null)
    }
  }, [activeWindowId, windows])

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMinimized: true } : w
    ))
  }, [])

  const maximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, isMaximized: !w.isMaximized, width: !w.isMaximized ? window.innerWidth - 20 : 600, height: !w.isMaximized ? window.innerHeight - 100 : 400 } : w
    ))
  }, [])

  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id)
    setWindows(prev => prev.map(w => 
      w.id === id ? { ...w, zIndex: nextZIndex } : w
    ))
    setNextZIndex(prev => prev + 1)
  }, [nextZIndex])

  const recordShortcutAttempt = useCallback((shortcutId: string, success: boolean) => {
    setShortcutProgress(prev => {
      const current = prev[shortcutId] || { shortcutId, attempts: 0, successes: 0, lastAttempt: 0 }
      return {
        ...prev,
        [shortcutId]: {
          ...current,
          attempts: current.attempts + 1,
          successes: success ? current.successes + 1 : current.successes,
          lastAttempt: Date.now()
        }
      }
    })
    
    if (success) {
      setScore(prev => prev + 10)
      setCurrentChallenge(null)
      setTimeout(() => setRecentShortcut(null), 2000)
    }
  }, [])

  const shortcuts: Shortcut[] = [
    {
      id: 'win-d',
      keys: ['Meta', 'd'],
      description: 'Show/Hide Desktop',
      category: 'system',
      action: () => {
        const allMinimized = windows.every(w => w.isMinimized)
        setWindows(prev => prev.map(w => ({ ...w, isMinimized: !allMinimized })))
        recordShortcutAttempt('win-d', true)
        setRecentShortcut({ keys: 'Win + D', success: true })
      }
    },
    {
      id: 'alt-tab',
      keys: ['Alt', 'Tab'],
      description: 'Switch between windows',
      category: 'navigation',
      action: () => {
        if (windows.length > 0) {
          const currentIndex = windows.findIndex(w => w.id === activeWindowId)
          const nextIndex = (currentIndex + 1) % windows.length
          focusWindow(windows[nextIndex].id)
          recordShortcutAttempt('alt-tab', true)
          setRecentShortcut({ keys: 'Alt + Tab', success: true })
        }
      }
    },
    {
      id: 'alt-f4',
      keys: ['Alt', 'F4'],
      description: 'Close active window',
      category: 'window',
      action: () => {
        if (activeWindowId) {
          closeWindow(activeWindowId)
          recordShortcutAttempt('alt-f4', true)
          setRecentShortcut({ keys: 'Alt + F4', success: true })
        }
      }
    },
    {
      id: 'win-m',
      keys: ['Meta', 'm'],
      description: 'Minimize all windows',
      category: 'window',
      action: () => {
        setWindows(prev => prev.map(w => ({ ...w, isMinimized: true })))
        recordShortcutAttempt('win-m', true)
        setRecentShortcut({ keys: 'Win + M', success: true })
      }
    },
    {
      id: 'ctrl-w',
      keys: ['Control', 'w'],
      description: 'Close tab/window',
      category: 'window',
      action: () => {
        if (activeWindowId) {
          closeWindow(activeWindowId)
          recordShortcutAttempt('ctrl-w', true)
          setRecentShortcut({ keys: 'Ctrl + W', success: true })
        }
      }
    },
    {
      id: 'win-e',
      keys: ['Meta', 'e'],
      description: 'Open File Explorer',
      category: 'application',
      action: () => {
        createWindow('File Explorer', <Folder className="w-5 h-5" />, 'File Explorer Content')
        recordShortcutAttempt('win-e', true)
        setRecentShortcut({ keys: 'Win + E', success: true })
      }
    },
    {
      id: 'win-r',
      keys: ['Meta', 'r'],
      description: 'Open Run dialog',
      category: 'system',
      action: () => {
        createWindow('Run', <Search className="w-5 h-5" />, 'Run Dialog - Type commands here')
        recordShortcutAttempt('win-r', true)
        setRecentShortcut({ keys: 'Win + R', success: true })
      }
    },
    {
      id: 'ctrl-shift-esc',
      keys: ['Control', 'Shift', 'Escape'],
      description: 'Open Task Manager',
      category: 'system',
      action: () => {
        createWindow('Task Manager', <Settings className="w-5 h-5" />, 'Task Manager - View running processes')
        recordShortcutAttempt('ctrl-shift-esc', true)
        setRecentShortcut({ keys: 'Ctrl + Shift + Esc', success: true })
      }
    },
    {
      id: 'win-l',
      keys: ['Meta', 'l'],
      description: 'Lock screen',
      category: 'system',
      action: () => {
        recordShortcutAttempt('win-l', true)
        setRecentShortcut({ keys: 'Win + L', success: true })
        alert('Screen locked! (Simulated)')
      }
    },
    {
      id: 'f11',
      keys: ['F11'],
      description: 'Toggle fullscreen',
      category: 'window',
      action: () => {
        if (activeWindowId) {
          maximizeWindow(activeWindowId)
          recordShortcutAttempt('f11', true)
          setRecentShortcut({ keys: 'F11', success: true })
        }
      }
    }
  ]

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const pressedKeys = new Set<string>()
      
      if (e.metaKey || e.ctrlKey) pressedKeys.add(e.metaKey ? 'Meta' : 'Control')
      if (e.altKey) pressedKeys.add('Alt')
      if (e.shiftKey) pressedKeys.add('Shift')
      if (e.key.length === 1) pressedKeys.add(e.key.toLowerCase())
      else if (e.key.startsWith('F')) pressedKeys.add(e.key)
      else if (e.key === 'Tab') pressedKeys.add('Tab')
      else if (e.key === 'Escape') pressedKeys.add('Escape')
      else if (e.key === 'Enter') pressedKeys.add('Enter')

      for (const shortcut of shortcuts) {
        const shortcutKeys = new Set(shortcut.keys.map(k => k.toLowerCase()))
        const pressedSet = new Set(Array.from(pressedKeys).map(k => k.toLowerCase()))
        
        if (shortcutKeys.size === pressedSet.size && 
            Array.from(shortcutKeys).every(k => pressedSet.has(k))) {
          e.preventDefault()
          shortcut.action()
          return
        }
      }

      // If in guided mode and no shortcut matched, show hint
      if (practiceMode === 'guided' && currentChallenge) {
        const challengeShortcut = shortcuts.find(s => s.id === currentChallenge)
        if (challengeShortcut) {
          recordShortcutAttempt(currentChallenge, false)
          setRecentShortcut({ keys: 'Try again!', success: false })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts, practiceMode, currentChallenge, recordShortcutAttempt])

  const startGuidedPractice = () => {
    setPracticeMode('guided')
    const unmastered = shortcuts.filter(s => {
      const progress = shortcutProgress[s.id]
      return !progress || progress.successes === 0 || progress.successes / progress.attempts < 0.7
    })
    if (unmastered.length > 0) {
      setCurrentChallenge(unmastered[0].id)
      setShowHint(true)
    }
  }

  const getShortcutDisplay = (keys: string[]) => {
    return keys.map(k => {
      if (k === 'Meta') return 'Win'
      if (k === 'Control') return 'Ctrl'
      return k
    }).join(' + ')
  }

  const getProgressPercentage = (shortcutId: string) => {
    const progress = shortcutProgress[shortcutId]
    if (!progress || progress.attempts === 0) return 0
    return Math.round((progress.successes / progress.attempts) * 100)
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Keyboard className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold">OS Shortcut Practice</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-700 px-4 py-2 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">Score: {score}</span>
            </div>
            <button
              onClick={() => setPracticeMode(practiceMode === 'free' ? 'guided' : 'free')}
              className="btn-primary"
            >
              {practiceMode === 'free' ? 'Guided Mode' : 'Free Mode'}
            </button>
            {practiceMode === 'guided' && !currentChallenge && (
              <button onClick={startGuidedPractice} className="btn-primary">
                <Play className="w-4 h-4 mr-2" />
                Start Practice
              </button>
            )}
            <button
              onClick={() => {
                setWindows([])
                setActiveWindowId(null)
                setScore(0)
                setShortcutProgress({})
                setCurrentChallenge(null)
              }}
              className="btn-secondary"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className="w-80 bg-slate-800 border-r border-slate-700 p-4 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Practice Mode
            </h2>
            {practiceMode === 'guided' && currentChallenge && (
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-300">Current Challenge</span>
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="text-xs text-blue-400 hover:text-blue-300"
                  >
                    {showHint ? 'Hide' : 'Show'} Hint
                  </button>
                </div>
                {(() => {
                  const challenge = shortcuts.find(s => s.id === currentChallenge)
                  return challenge ? (
                    <div>
                      <p className="text-white font-semibold mb-1">{challenge.description}</p>
                      {showHint && (
                        <p className="text-sm text-blue-200 mt-2">
                          Press: <kbd className="bg-slate-700 px-2 py-1 rounded">{getShortcutDisplay(challenge.keys)}</kbd>
                        </p>
                      )}
                    </div>
                  ) : null
                })()}
              </div>
            )}

            {recentShortcut && (
              <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
                recentShortcut.success 
                  ? 'bg-green-900/30 border border-green-700' 
                  : 'bg-red-900/30 border border-red-700'
              }`}>
                {recentShortcut.success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={recentShortcut.success ? 'text-green-300' : 'text-red-300'}>
                  {recentShortcut.keys}
                </span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button
                onClick={() => createWindow('Document', <FileText className="w-5 h-5" />, 'Document Content')}
                className="w-full text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Open Document
              </button>
              <button
                onClick={() => createWindow('Image Viewer', <Image className="w-5 h-5" />, 'Image Viewer')}
                className="w-full text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Image className="w-4 h-4" />
                Open Image
              </button>
              <button
                onClick={() => createWindow('Music Player', <Music className="w-5 h-5" />, 'Music Player')}
                className="w-full text-left px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Music className="w-4 h-4" />
                Open Music
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Shortcuts Progress</h3>
            <div className="space-y-3">
              {shortcuts.map(shortcut => {
                const progress = getProgressPercentage(shortcut.id)
                return (
                  <div key={shortcut.id} className="bg-slate-700 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{shortcut.description}</span>
                      <span className="text-xs text-slate-400">{progress}%</span>
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <kbd className="text-xs bg-slate-800 px-2 py-1 rounded">
                        {getShortcutDisplay(shortcut.keys)}
                      </kbd>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Desktop */}
        <div 
          ref={desktopRef}
          className="flex-1 relative bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 overflow-hidden"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)' }}
        >
          {/* Desktop Icons */}
          <div className="absolute top-8 left-8 space-y-6">
            <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 p-3 rounded-lg transition-colors">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Folder className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-white text-center">Documents</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 p-3 rounded-lg transition-colors">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <Image className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-white text-center">Pictures</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer hover:bg-white/10 p-3 rounded-lg transition-colors">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-white text-center">Music</span>
            </div>
          </div>

          {/* Windows */}
          {windows.map(window => (
            !window.isMinimized && (
              <div
                key={window.id}
                className="absolute bg-slate-800 border border-slate-700 rounded-lg shadow-2xl flex flex-col"
                style={{
                  left: window.isMaximized ? 0 : `${window.x}px`,
                  top: window.isMaximized ? 0 : `${window.y}px`,
                  width: window.isMaximized ? '100%' : `${window.width}px`,
                  height: window.isMaximized ? 'calc(100% - 60px)' : `${window.height}px`,
                  zIndex: window.zIndex,
                  cursor: 'default'
                }}
                onClick={() => focusWindow(window.id)}
              >
                {/* Title Bar */}
                <div className="bg-slate-700 px-4 py-2 flex items-center justify-between rounded-t-lg cursor-move">
                  <div className="flex items-center gap-3">
                    {window.icon}
                    <span className="text-sm font-medium">{window.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        minimizeWindow(window.id)
                      }}
                      className="w-8 h-8 flex items-center justify-center hover:bg-slate-600 rounded transition-colors"
                    >
                      <Minimize2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        maximizeWindow(window.id)
                      }}
                      className="w-8 h-8 flex items-center justify-center hover:bg-slate-600 rounded transition-colors"
                    >
                      {window.isMaximized ? <Square className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        closeWindow(window.id)
                      }}
                      className="w-8 h-8 flex items-center justify-center hover:bg-red-600 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {/* Window Content */}
                <div className="flex-1 p-6 overflow-auto">
                  <p className="text-slate-300">{window.content}</p>
                </div>
              </div>
            )
          ))}
        </div>
      </div>

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700 h-14 flex items-center px-4">
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center hover:bg-slate-700 rounded transition-colors">
            <Search className="w-5 h-5" />
          </button>
          {windows.map(window => (
            <button
              key={window.id}
              onClick={() => {
                if (window.isMinimized) {
                  setWindows(prev => prev.map(w => 
                    w.id === window.id ? { ...w, isMinimized: false } : w
                  ))
                }
                focusWindow(window.id)
              }}
              className={`px-4 py-2 flex items-center gap-2 rounded transition-colors ${
                activeWindowId === window.id 
                  ? 'bg-blue-600 text-white' 
                  : window.isMinimized 
                    ? 'bg-slate-700/50 text-slate-300' 
                    : 'bg-slate-700 text-white hover:bg-slate-600'
              }`}
            >
              {window.icon}
              <span className="text-sm">{window.title}</span>
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="text-xs text-slate-400">
            {new Date().toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}

