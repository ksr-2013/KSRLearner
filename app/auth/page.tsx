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
    id?.open(mode)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome</h1>
          <p className="text-slate-300">Sign in to track progress and personalize your learning.</p>
        </div>
        <div className="card">
          <button onClick={() => open('login')} className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold mb-3 transition">Log in</button>
          <button onClick={() => open('signup')} className="w-full py-3 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-800 transition">Sign up</button>
          <div className="mt-4 text-xs text-slate-400 text-center">Powered by Netlify Identity</div>
        </div>
      </div>
      <Footer />
    </div>
  )
}


