'use client'

import { useEffect } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

export default function AuthPage() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const id = (window as any).netlifyIdentity
    if (!id) return
    id.on('login', () => {
      window.location.assign('/profile')
    })
    id.on('logout', () => {
      window.location.assign('/')
    })
  }, [])

  const open = (mode: 'login' | 'signup') => {
    const id = (window as any).netlifyIdentity
    // Prefer custom modal look instead of widget UI theme; still use widget flow
    id?.open(mode)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
          <p className="text-slate-300">Create your account or log in to continue.</p>
        </div>
        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="block text-sm text-slate-300 mb-1">Email</label>
              <input type="email" className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm text-slate-300 mb-1">Password</label>
              <input type="password" className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="••••••••" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => open('login')} className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition">Log in</button>
              <button onClick={() => open('signup')} className="flex-1 py-3 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-700 transition">Sign up</button>
            </div>
          </form>
          <div className="mt-4 text-xs text-slate-400 text-center">Powered by Netlify Identity</div>
        </div>
      </div>
      <Footer />
    </div>
  )
}


