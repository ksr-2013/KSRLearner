'use client'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { supabaseClient } from '../../lib/supabaseClient'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // If already logged in (via our JWT cookie), redirect to profile
    ;(async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        if (res.ok) {
          const data = await res.json()
          if (data?.user) window.location.assign('/profile')
        }
      } catch {}
    })()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const url = mode === 'signup' ? '/api/auth/signup' : '/api/auth/login'
      const body: any = { email, password }
      if (mode === 'signup') body.name = name
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.details || data?.error || 'Authentication failed')
      window.location.assign('/profile')
    } catch (err: any) {
      setError(err?.message || 'Authentication failed')
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
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" required />
            </div>
            {error && <div className="text-red-400 text-sm">{error}</div>}
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading} className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50">{loading ? 'Please wait…' : (mode === 'login' ? 'Log in' : 'Create account')}</button>
              <button type="button" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')} className="flex-1 py-3 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-700 transition">
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
                  try {
                    const redirectTo = `${window.location.origin}/auth/callback`
                    const { error } = await supabaseClient.auth.signInWithOAuth({
                      provider: 'google',
                      options: { redirectTo }
                    })
                    if (error) throw error
                  } catch (e: any) {
                    setError(e?.message || 'Failed to start Google sign-in')
                  }
                }}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-700 transition"
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


