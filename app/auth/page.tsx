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
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Account</h1>
        <div className="card">
          <button onClick={() => open('login')} className="btn-primary w-full mb-3">Log in</button>
          <button onClick={() => open('signup')} className="btn-outline w-full">Sign up</button>
        </div>
      </div>
      <Footer />
    </div>
  )
}


