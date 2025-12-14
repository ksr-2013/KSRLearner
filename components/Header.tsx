'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { supabaseClient } from '../lib/supabaseClient'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const [userName, setUserName] = useState<string>('')
  const [avatarUrl, setAvatarUrl] = useState<string>('')
  const [profileOpen, setProfileOpen] = useState(false)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        // Check authentication - try both Supabase and JWT systems
        let userData = null
        
        // First try Supabase auth
        try {
          const { data: { session }, error } = await supabaseClient.auth.getSession()
          if (session?.user) {
            userData = {
              user: {
                id: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.user_metadata?.name,
                avatarUrl: session.user.user_metadata?.avatar_url
              }
            }
          }
        } catch (supabaseError) {
          console.log('Supabase auth check failed, trying JWT...')
        }
        
        // If Supabase auth failed, try JWT auth
        if (!userData) {
          try {
            const headers: HeadersInit = { 'cache': 'no-store' }
            // Try to get Supabase session token for the API call
            try {
              const { data: { session } } = await supabaseClient.auth.getSession()
              if (session?.access_token) {
                headers['authorization'] = `Bearer ${session.access_token}`
              }
            } catch {}
            const res = await fetch('/api/auth/me', { cache: 'no-store', headers })
            userData = await res.json()
          } catch (jwtError) {
            console.log('JWT auth check failed')
          }
        }
        
        if (mounted) {
          setLoggedIn(!!userData?.user)
          setUserName(userData?.user?.name || userData?.user?.email || '')
          setAvatarUrl(userData?.user?.avatarUrl || '')
        }
      } catch {
        if (mounted) setLoggedIn(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleLogout = async () => {
    try {
      // Call the logout API which handles both auth systems
      await fetch('/api/auth/logout', { method: 'POST' })
      
      // Also try direct Supabase logout as backup
      try {
        await supabaseClient.auth.signOut()
      } catch (supabaseError) {
        console.log('Direct Supabase logout failed:', supabaseError)
      }
    } catch (error) {
      console.error('Logout API failed:', error)
    }
    
    // Always redirect to home page
    window.location.assign('/')
  }

  return (
    <>
    <header className="bg-slate-900 shadow-lg border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center h-16">
          {/* Left: Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md text-slate-300 hover:text-blue-400 hover:bg-slate-800 transition-colors"
            aria-label="Open navigation menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Center: Logo + Name */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Link href="/" className="flex items-center space-x-3 group pointer-events-auto">
              <div className="relative">
                <div className="w-12 h-12 relative overflow-hidden rounded-full ring-2 ring-blue-400/30 group-hover:ring-blue-400/50 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <Image
                    src="/logo.png"
                    alt="KSR Learner Logo"
                    fill
                    sizes="48px"
                    className="object-contain p-1"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-blue-400 group-hover:text-blue-300 transition-colors duration-300">KSR LEARNER</div>
                <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-300">Explore, Learn & Grow</div>
              </div>
            </Link>
          </div>

          {/* Right spacer to keep center alignment */}
          <div className="ml-auto" />
          </div>

        {/* Left Drawer Navigation */}
        {isMenuOpen && (
          <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-[1px] z-50"
            onClick={() => setIsMenuOpen(false)}
            aria-hidden="true"
          />
          <div className="fixed left-0 top-0 h-screen w-72 max-w-[85vw] bg-slate-800 border-r border-slate-700 shadow-2xl p-3 z-[60] overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-200 font-semibold">Navigation</span>
          <button
                className="p-2 rounded-md text-slate-300 hover:text-blue-400 hover:bg-slate-700"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close navigation menu"
          >
                <X className="w-5 h-5" />
          </button>
        </div>
            <div className="space-y-1 pb-24">
              <Link href="/" className="block px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-lg font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link href="/quizzes" className="block px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-lg font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>Quizzes</Link>
              <Link href="/puzzles" className="block px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-lg font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>Puzzles</Link>
              <Link href="/typing" className="block px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-lg font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>Typing</Link>
              <Link href="/animations" className="block px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-lg font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>Explainer Videos</Link>
              <Link href="/ai-exam-evaluator" className="block px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-lg font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>AI Exam Conductor</Link>
              <Link href="/about" className="block px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-lg font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link href="/contact" className="block px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-lg font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              {loggedIn && (
                <>
                  <Link href="/dashboard" className="block px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-lg font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                  <Link href="/profile" className="block px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-lg font-medium transition-colors" onClick={() => setIsMenuOpen(false)}>Profile</Link>
                </>
              )}
              {!loggedIn && (
                <div className="pt-2">
                  <Link href="/auth" className="btn-primary w-full text-center" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                </div>
              )}
            </div>
            {/* Drawer footer: profile avatar and name */}
            {loggedIn && (
              <div className="absolute left-0 right-0 bottom-0 p-3 border-t border-slate-700 bg-slate-800/95">
                <Link href="/avatars" className="flex items-center gap-3 group" onClick={() => setIsMenuOpen(false)}>
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-600 text-white flex items-center justify-center font-semibold ring-2 ring-slate-700 group-hover:ring-blue-400 transition">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      (userName || 'U').trim().charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-slate-200 font-medium truncate">{userName || 'Profile'}</div>
                    <div className="text-slate-400 text-xs">Tap to change avatar</div>
                  </div>
                </Link>
              </div>
            )}
            </div>
          </>
        )}
      </div>
    </header>
    {/* Profile pill removed; actions available in left navigation drawer */}
    </>
  )
}
