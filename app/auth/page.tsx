'use client'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const client = (window as any).GoTrue ? new (window as any).GoTrue({
      APIUrl: `${window.location.origin}/.netlify/identity`,
      setCookie: true
    }) : null
    // If already logged in, redirect
    ;(async () => {
      try {
        const current = (window as any).netlifyIdentity?.currentUser?.()
        if (current) window.location.assign('/profile')
      } catch {}
    })()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const GoTrue = (window as any).GoTrue
      if (!GoTrue) throw new Error('Identity client not loaded')
      const client = new GoTrue({ APIUrl: `${window.location.origin}/.netlify/identity`, setCookie: true })
      if (mode === 'signup') {
        const user = await client.signup(email.trim(), password, { full_name: name.trim() })
        if (user) window.location.assign('/profile')
      } else {
        const token = await client.login(email.trim(), password, true)
        if (token) window.location.assign('/profile')
      }
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
          <p className="text-slate-300">Secure access powered by Netlify Identity</p>
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
          <div className="mt-4 text-xs text-slate-400 text-center">Theme matches site colors</div>
        </div>
      </div>
      <Footer />
    </div>
  )
}


