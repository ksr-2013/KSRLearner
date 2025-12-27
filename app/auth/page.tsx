'use client'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { supabaseClient } from '../../lib/supabaseClient'

// Helper function to get user-friendly error messages
function getErrorMessage(error: any): string {
  if (!error) return 'An unexpected error occurred'
  
  const errorMessage = error.message || error.toString()
  
  // Map common Supabase error codes to user-friendly messages
  if (errorMessage.includes('Invalid login credentials') || errorMessage.includes('Invalid credentials')) {
    return 'Invalid email or password. Please check your credentials and try again.'
  }
  if (errorMessage.includes('Email already registered') || errorMessage.includes('already exists') || errorMessage.includes('already registered')) {
    return 'This email is already registered. Please sign in instead or use a different email.'
  }
  if (errorMessage.includes('Password')) {
    if (errorMessage.includes('too short')) {
      return 'Password must be at least 6 characters long.'
    }
    if (errorMessage.includes('weak')) {
      return 'Password is too weak. Please use a stronger password.'
    }
    return 'Password does not meet requirements. Please use at least 6 characters.'
  }
  if (errorMessage.includes('Email')) {
    if (errorMessage.includes('invalid') || errorMessage.includes('format')) {
      return 'Please enter a valid email address.'
    }
  }
  if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
    return 'Too many attempts. Please wait a moment and try again.'
  }
  if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
    return 'Network error. Please check your connection and try again.'
  }
  
  // Return the original message if no mapping found
  return errorMessage
}

// Email validation
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Password validation
function isValidPassword(password: string): boolean {
  return password.length >= 6
}

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)
  const [resendingEmail, setResendingEmail] = useState(false)

  useEffect(() => {
    // If already logged in with Supabase, redirect to dashboard
    ;(async () => {
      try {
        const { data } = await supabaseClient.auth.getSession()
        if (data?.session) window.location.assign('/dashboard')
      } catch {}
    })()
  }, [])

  // Clear form and errors when switching modes
  const handleModeSwitch = () => {
    setMode(mode === 'login' ? 'signup' : 'login')
    setError(null)
    setSuccessMessage(null)
    setPendingEmail(null)
    setEmail('')
    setPassword('')
    setName('')
  }

  // Resend confirmation email
  const handleResendConfirmation = async () => {
    if (!pendingEmail) return
    
    setError(null)
    setResendingEmail(true)
    
    try {
      const { error } = await supabaseClient.auth.resend({
        type: 'signup',
        email: pendingEmail
      })
      
      if (error) throw error
      
      setSuccessMessage(`Confirmation email resent to ${pendingEmail}. Please check your inbox and spam folder.`)
    } catch (err: any) {
      console.error('Resend confirmation error:', err)
      setError(getErrorMessage(err) || 'Failed to resend confirmation email. Please try again later.')
    } finally {
      setResendingEmail(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)
    setLoading(true)

    // Client-side validation
    if (!email.trim()) {
      setError('Please enter your email address.')
      setLoading(false)
      return
    }

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      setLoading(false)
      return
    }

    if (!password.trim()) {
      setError('Please enter your password.')
      setLoading(false)
      return
    }

    if (mode === 'signup') {
      if (!isValidPassword(password)) {
        setError('Password must be at least 6 characters long.')
        setLoading(false)
        return
      }
    }

    try {
      if (mode === 'signup') {
        // Sign up with Supabase
        const { data, error } = await supabaseClient.auth.signUp({
          email: email.trim(),
          password: password.trim(),
          options: {
            data: {
              name: name.trim() || null
            }
          }
        })

        if (error) {
          throw error
        }

        if (!data.user) {
          throw new Error('Failed to create user account')
        }

        // Sync user to local database via API
        try {
          await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: data.user.id,
              email: data.user.email,
              name: name.trim() || null
            })
          })
        } catch (syncError) {
          console.error('Error syncing user:', syncError)
          // Continue even if sync fails
        }

        // Check if email confirmation is required
        if (data.session) {
          // User is automatically signed in (email confirmation disabled)
          window.location.assign('/dashboard')
        } else {
          // Email confirmation required
          setPendingEmail(email.trim())
          setSuccessMessage(
            `Account created! A confirmation email has been sent to ${email.trim()}. ` +
            `Please check your inbox (and spam folder) and click the confirmation link to activate your account.`
          )
          setEmail('')
          setPassword('')
          setName('')
        }
      } else {
        // Sign in with Supabase
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim()
        })

        if (error) {
          throw error
        }

        if (!data.session) {
          throw new Error('Failed to sign in. Please try again.')
        }

        // Sync user to local database via API
        try {
          await fetch('/api/auth/sync-user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: data.user.id,
              email: data.user.email,
              name: data.user.user_metadata?.name || null
            })
          })
        } catch (syncError) {
          console.error('Error syncing user:', syncError)
          // Continue even if sync fails
        }

        // Redirect to dashboard
        window.location.assign('/dashboard')
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">{mode === 'login' ? 'Log in' : 'Sign up'}</h1>
          <p className="text-slate-300">Secure access powered by custom JWT auth</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-sm text-slate-300 mb-1">Full name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Your name" />
              </div>
            )}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="••••••••" 
                required 
                minLength={mode === 'signup' ? 6 : undefined}
              />
              {mode === 'signup' && (
                <p className="text-xs text-slate-400 mt-1">Password must be at least 6 characters</p>
              )}
            </div>
            {error && (
              <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm space-y-2">
                <p>{successMessage}</p>
                {pendingEmail && (
                  <div className="mt-3 pt-3 border-t border-green-500/30">
                    <p className="text-xs text-green-300 mb-2">
                      Didn't receive the email? Check your spam folder or resend it.
                    </p>
                    <button
                      type="button"
                      onClick={handleResendConfirmation}
                      disabled={resendingEmail}
                      className="w-full py-2 px-4 rounded-lg bg-green-600/20 hover:bg-green-600/30 border border-green-500/50 text-green-300 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {resendingEmail ? (
                        <span className="inline-flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Resend Confirmation Email'
                      )}
                    </button>
                    <p className="text-xs text-green-400/70 mt-2">
                      Note: If emails still don't arrive, email confirmation may need to be configured in your Supabase project settings.
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button 
                type="submit" 
                disabled={loading} 
                className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Please wait…
                  </span>
                ) : (
                  mode === 'login' ? 'Log in' : 'Create account'
                )}
              </button>
              <button 
                type="button" 
                onClick={handleModeSwitch} 
                disabled={loading}
                className="flex-1 py-3 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {mode === 'login' ? 'Need an account?' : 'Have an account?'}
              </button>
            </div>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">Or continue with</span>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={async () => {
                  setError(null)
                  setSuccessMessage(null)
                  setLoading(true)
                  try {
                    const redirectTo = `${window.location.origin}/auth/callback`
                    const { error } = await supabaseClient.auth.signInWithOAuth({
                      provider: 'google',
                      options: { redirectTo }
                    })
                    if (error) throw error
                    // If successful, the OAuth flow will redirect the user
                  } catch (e: any) {
                    setError(getErrorMessage(e) || 'Failed to start Google sign-in. Please try again.')
                    setLoading(false)
                  }
                }}
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <img src="/google.svg" alt="Google" className="w-5 h-5" />
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-400 text-center">Theme matches site colors</div>
        </div>
      </div>
      <Footer />
    </div>
  )
}


