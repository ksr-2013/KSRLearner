'use client'

import { useEffect, useRef, useState } from 'react'
import { Keyboard, Trophy, Target, CheckCircle2, XCircle, Play, RotateCcw, Info, Power } from 'lucide-react'

// v86 types
declare global {
  interface Window {
    V86Starter: any
  }
}

interface ShortcutProgress {
  shortcutId: string
  attempts: number
  successes: number
  lastAttempt: number
}

const SHORTCUTS = [
  { id: 'super', keys: ['Meta'], description: 'Show Activities Overview (Super)' },
  { id: 'ctrl-alt-t', keys: ['Control', 'Alt', 't'], description: 'Open Terminal (Ctrl+Alt+T)' },
  { id: 'super-l', keys: ['Meta', 'l'], description: 'Lock Screen (Super+L)' },
  { id: 'super-a', keys: ['Meta', 'a'], description: 'Show App Launcher (Super+A)' },
  { id: 'alt-tab', keys: ['Alt', 'Tab'], description: 'Switch Windows (Alt+Tab)' },
  { id: 'ctrl-alt-f1', keys: ['Control', 'Alt', 'F1'], description: 'Switch to TTY1 (Ctrl+Alt+F1)' },
  { id: 'ctrl-alt-f7', keys: ['Control', 'Alt', 'F7'], description: 'Switch to GUI (Ctrl+Alt+F7)' },
]

export default function WebAssemblyOS() {
  const canvasRef = useRef<HTMLDivElement>(null)
  const emulatorRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [shortcutProgress, setShortcutProgress] = useState<Record<string, ShortcutProgress>>({})
  const [currentChallenge, setCurrentChallenge] = useState<string | null>(null)
  const [showHint, setShowHint] = useState(false)
  const [practiceMode, setPracticeMode] = useState<'free' | 'guided'>('free')
  const [score, setScore] = useState(0)
  const [recentShortcut, setRecentShortcut] = useState<{ keys: string; success: boolean } | null>(null)

  const recordAttempt = (shortcutId: string, success: boolean) => {
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

  const startGuidedPractice = () => {
    setPracticeMode('guided')
    const unmastered = SHORTCUTS.filter(s => {
      const progress = shortcutProgress[s.id]
      return !progress || progress.successes === 0 || progress.successes / progress.attempts < 0.7
    })
    if (unmastered.length > 0) {
      setCurrentChallenge(unmastered[0].id)
      setShowHint(true)
    }
  }

  // Initialize v86 emulator
  useEffect(() => {
    const initEmulator = async () => {
      try {
        setIsLoading(true)
        setError(null)

        if (!canvasRef.current) {
          throw new Error('Container element not found')
        }

        // Load v86 library - use the working CDN from copy.sh
        if (!window.V86Starter) {
          const script = document.createElement('script')
          // Use the official v86 CDN that's known to work
          script.src = 'https://copy.sh/v86/build/libv86.js'
          script.async = false // Load synchronously
          
          await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Timeout loading v86 library'))
            }, 30000)
            
            script.onload = () => {
              // v86 needs a moment to initialize
              setTimeout(() => {
                clearTimeout(timeout)
                // Check for V86Starter in various possible locations
                if (window.V86Starter) {
                  resolve(undefined)
                } else if ((window as any).V86Starter) {
                  window.V86Starter = (window as any).V86Starter
                  resolve(undefined)
                } else if ((window as any).V86) {
                  window.V86Starter = (window as any).V86
                  resolve(undefined)
                } else {
                  // Try one more time after a longer delay
                  setTimeout(() => {
                    if (window.V86Starter || (window as any).V86Starter) {
                      if (!window.V86Starter) {
                        window.V86Starter = (window as any).V86Starter
                      }
                      resolve(undefined)
                    } else {
                      reject(new Error('V86Starter class not found after script loaded'))
                    }
                  }, 2000)
                }
              }, 500)
            }
            
            script.onerror = () => {
              clearTimeout(timeout)
              // Fallback to local file
              const fallbackScript = document.createElement('script')
              fallbackScript.src = '/libv86.js'
              fallbackScript.async = false
              fallbackScript.onload = () => {
                setTimeout(() => {
                  if (window.V86Starter || (window as any).V86Starter) {
                    if (!window.V86Starter) {
                      window.V86Starter = (window as any).V86Starter
                    }
                    resolve(undefined)
                  } else {
                    reject(new Error('V86Starter not found in local file either'))
                  }
                }, 1000)
              }
              fallbackScript.onerror = () => reject(new Error('Failed to load v86 from both CDN and local file'))
              document.head.appendChild(fallbackScript)
            }
            
            document.head.appendChild(script)
          })
        }

        if (!window.V86Starter) {
          throw new Error('v86 library loaded but V86Starter class not available. Please check browser console for details.')
        }

        // Create container for v86 screen
        const container = canvasRef.current.parentElement
        if (!container) {
          throw new Error('Container element not found')
        }

        // Verify all required files are accessible
        console.log('Verifying required files...')
        
        // Check WASM file
        try {
          const wasmResponse = await fetch('/build/v86.wasm', { method: 'HEAD' })
          if (!wasmResponse.ok) {
            throw new Error(`WASM file not accessible: ${wasmResponse.status}. Please ensure v86.wasm is in public/build/`)
          }
          console.log('✓ WASM file accessible')
        } catch (wasmError) {
          console.error('WASM file check failed:', wasmError)
          throw new Error('WASM file not found. Please ensure v86.wasm is in public/build/')
        }

        // Check ISO file
        try {
          const isoResponse = await fetch('/os-images/linux.iso', { method: 'HEAD' })
          if (!isoResponse.ok) {
            throw new Error(`ISO file not accessible: ${isoResponse.status} ${isoResponse.statusText}. Please ensure linux.iso is in public/os-images/`)
          }
          const contentLength = isoResponse.headers.get('content-length')
          const sizeMB = contentLength ? (parseInt(contentLength) / 1024 / 1024).toFixed(2) : 'unknown'
          console.log(`✓ ISO file accessible, size: ${sizeMB} MB`)
          
          if (contentLength && parseInt(contentLength) < 1024 * 1024) {
            throw new Error('ISO file appears too small. Please ensure you downloaded a valid Tiny Core Linux ISO (~23MB)')
          }
        } catch (fetchError) {
          console.error('ISO file check failed:', fetchError)
          throw fetchError
        }

        // Use local Linux ISO image from public folder
        // The ISO file should be placed in: public/os-images/linux.iso
        // v86 requires BIOS files - these are loaded from the v86 CDN automatically
        console.log('Initializing v86 emulator with ISO: /os-images/linux.iso')
        
        // v86 configuration - simplified for better compatibility
        const emulatorConfig: any = {
          wasm_path: '/build/v86.wasm',
          screen_container: container,
          memory_size: 128 * 1024 * 1024, // 128MB
          vga_memory_size: 8 * 1024 * 1024,
          cdrom: {
            url: '/os-images/linux.iso',
            async: true,
          },
          autostart: true,
          disable_keyboard: false,
          disable_mouse: false,
        }

        // Try to add BIOS files if available (v86 may load them automatically)
        // If BIOS URLs fail, v86 will use defaults
        try {
          const biosCheck = await fetch('/build/seabios.bin', { method: 'HEAD' })
          if (biosCheck.ok) {
            emulatorConfig.bios = { url: '/build/seabios.bin', async: true }
            emulatorConfig.vga_bios = { url: '/build/vgabios.bin', async: true }
            console.log('Using local BIOS files')
          } else {
            // Use CDN BIOS files as fallback
            emulatorConfig.bios = { url: 'https://copy.sh/v86/build/seabios.bin', async: true }
            emulatorConfig.vga_bios = { url: 'https://copy.sh/v86/build/vgabios.bin', async: true }
            console.log('Using CDN BIOS files')
          }
        } catch {
          // v86 will use default BIOS if not specified
          console.log('Using v86 default BIOS')
        }

        const emulator = new window.V86Starter(emulatorConfig)

        console.log('Emulator created, waiting for boot...')

        emulatorRef.current = emulator

        // Track boot progress
        let bootStarted = false
        let screenUpdates = 0
        let lastUpdateTime = Date.now()

        emulator.add_listener('emulator-ready', () => {
          console.log('✓ Emulator ready!')
          setIsRunning(true)
          setIsLoading(false)
          setError(null)
        })

        emulator.add_listener('screen-update', () => {
          screenUpdates++
          lastUpdateTime = Date.now()
          if (!bootStarted) {
            bootStarted = true
            console.log('✓ OS boot started - screen is updating')
            console.log('Boot progress: Screen updates detected')
          }
          // Log every 100 screen updates
          if (screenUpdates % 100 === 0) {
            console.log(`Boot in progress: ${screenUpdates} screen updates`)
          }
        })

        emulator.add_listener('emulator-error', (error: any) => {
          console.error('✗ Emulator error:', error)
          setError('Emulator error: ' + (error.message || 'Unknown error') + '\n\nCheck browser console (F12) for details.')
          setIsLoading(false)
        })

        // Progress updates
        emulator.add_listener('download-progress', (progress: any) => {
          console.log('Download progress:', progress)
        })

        // Monitor for stuck boot (no screen updates for 30 seconds)
        const stuckCheck = setInterval(() => {
          const timeSinceUpdate = Date.now() - lastUpdateTime
          if (bootStarted && timeSinceUpdate > 30000 && !isRunning) {
            console.warn('Boot appears stuck - no screen updates for 30 seconds')
            // Don't error yet, just log
          }
        }, 5000)

        // Extended timeout for first boot (can take 60-90 seconds)
        let bootTimeout: NodeJS.Timeout | null = setTimeout(() => {
          if (!isRunning && !bootStarted) {
            setIsLoading(false)
            setError('OS boot is taking longer than expected. Troubleshooting:\n\n• Verify ISO file: Open http://localhost:3000/os-images/linux.iso in browser\n• Check ISO is valid Tiny Core Linux (not corrupted)\n• Try a smaller ISO (TinyCore ~23MB recommended)\n• Check browser console (F12) for specific errors\n• Ensure BIOS files loaded successfully')
          } else if (bootStarted && !isRunning) {
            // Boot started but not ready yet - give it more time
            console.log('Boot in progress, waiting longer...')
            // Extend timeout if boot has started
            setTimeout(() => {
              if (!isRunning) {
                setIsLoading(false)
                setError('OS is booting but taking very long. This may be normal for first boot. Please wait or check console for progress.')
              }
            }, 60000) // Additional 60 seconds if boot started
          }
        }, 120000) // 120 seconds (2 minutes) timeout

        // Cleanup on success
        emulator.add_listener('emulator-ready', () => {
          if (bootTimeout) clearTimeout(bootTimeout)
          clearInterval(stuckCheck)
        })

      } catch (err) {
        console.error('Failed to initialize emulator:', err)
        setError(err instanceof Error ? err.message : 'Failed to load WebAssembly OS emulator')
        setIsLoading(false)
      }
    }

    initEmulator()

    return () => {
      if (emulatorRef.current) {
        try {
          emulatorRef.current.stop()
        } catch (e) {
          console.warn('Error stopping emulator:', e)
        }
        emulatorRef.current = null
      }
    }
  }, [])

  // Handle keyboard shortcuts
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

      for (const shortcut of SHORTCUTS) {
        const shortcutKeys = new Set(shortcut.keys.map(k => k.toLowerCase()))
        const pressedSet = new Set(Array.from(pressedKeys).map(k => k.toLowerCase()))

        if (shortcutKeys.size === pressedSet.size &&
            Array.from(shortcutKeys).every(k => pressedSet.has(k))) {
          e.preventDefault()
          recordAttempt(shortcut.id, true)
          setRecentShortcut({ keys: getShortcutDisplay(shortcut.keys), success: true })

          // Send keys to emulator if running
          if (emulatorRef.current && isRunning) {
            try {
              // v86 keyboard input
              shortcut.keys.forEach(key => {
                const keyCode = getKeyCode(key)
                if (keyCode) {
                  emulatorRef.current.keyboard_send_scancode(keyCode, true)
                  emulatorRef.current.keyboard_send_scancode(keyCode, false)
                }
              })
            } catch (err) {
              console.warn('Failed to send keys to emulator:', err)
            }
          }

          return
        }
      }

      if (practiceMode === 'guided' && currentChallenge) {
        const challengeShortcut = SHORTCUTS.find(s => s.id === currentChallenge)
        if (challengeShortcut) {
          recordAttempt(currentChallenge, false)
          setRecentShortcut({ keys: 'Try again!', success: false })
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [practiceMode, currentChallenge, isRunning])

  const getKeyCode = (key: string): number | null => {
    const keyMap: Record<string, number> = {
      'Meta': 0x5B, // Left Windows key
      'Control': 0x1D,
      'Alt': 0x38,
      'Tab': 0x0F,
      'F1': 0x3B,
      'F7': 0x41,
      't': 0x14,
      'l': 0x26,
      'a': 0x1E,
    }
    return keyMap[key] || null
  }

  const resetPractice = () => {
    setScore(0)
    setShortcutProgress({})
    setCurrentChallenge(null)
    setRecentShortcut(null)
  }

  if (error && !isRunning) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-red-400 mb-4">
            <Info className="w-16 h-16 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">WebAssembly OS Not Available</h2>
          </div>
          <p className="text-slate-300 mb-6">{error}</p>
          <div className="text-sm text-slate-400 space-y-2">
            <p>• Ensure you have a stable internet connection</p>
            <p>• WebAssembly requires a modern browser</p>
            <p>• The OS image may take time to download on first load</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Keyboard className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold">WebAssembly OS - Real Linux</h1>
            {isLoading && <span className="text-sm text-blue-400">Loading OS...</span>}
            {isRunning && <span className="text-sm text-green-400">● Running</span>}
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
              onClick={resetPractice}
              className="btn-secondary"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Practice Sidebar */}
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
                  const challenge = SHORTCUTS.find(s => s.id === currentChallenge)
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

          <div>
            <h3 className="text-sm font-semibold text-slate-400 mb-3">Shortcuts Progress</h3>
            <div className="space-y-3">
              {SHORTCUTS.map(shortcut => {
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

        {/* WebAssembly OS Display */}
        <div className="flex-1 relative bg-black flex items-center justify-center">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
              <div className="text-center max-w-md px-4">
                <div className="animate-spin w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold mb-2">Booting Linux OS...</h3>
                <p className="text-slate-400 mb-4">Initializing WebAssembly emulator</p>
                <div className="mt-4 text-sm text-slate-500 space-y-2">
                  <p>✓ ISO file found at: /os-images/linux.iso</p>
                  <p>⏳ Loading emulator and booting OS...</p>
                  <p className="text-slate-400 mt-4">
                    <strong>Note:</strong> First boot can take 60-90 seconds
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    The OS is loading from your local ISO file. Please wait...
                  </p>
                </div>
                <div className="mt-6">
                  <div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden mx-auto">
                    <div className="h-full bg-blue-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div 
            ref={canvasRef}
            className="w-full h-full flex items-center justify-center bg-black overflow-auto"
            style={{
              display: isLoading ? 'none' : 'flex'
            }}
          >
            {/* v86 will inject its screen element here */}
          </div>

          {!isLoading && !isRunning && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90">
              <div className="text-center">
                <Power className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold mb-2">OS Ready</h3>
                <p className="text-slate-400">Linux is running in your browser</p>
                <p className="text-sm text-slate-500 mt-2">Use keyboard shortcuts to interact with the OS</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

