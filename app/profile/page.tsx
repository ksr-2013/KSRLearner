'use client'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

interface IdentityUser {
  email?: string
  user_metadata?: { full_name?: string }
}

export default function ProfilePage() {
  const [user, setUser] = useState<IdentityUser | null>(null)

  useEffect(() => {
    const id = (window as any).netlifyIdentity
    const u = id?.currentUser()
    if (!u) {
      window.location.assign('/auth')
      return
    }
    setUser({ email: u.email, user_metadata: u.user_metadata })
  }, [])

  const logout = () => (window as any).netlifyIdentity?.logout()

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Profile</h1>
        <div className="card">
          {user ? (
            <>
              <div className="text-white mb-2">Name: {user.user_metadata?.full_name || '—'}</div>
              <div className="text-white mb-4">Email: {user.email || '—'}</div>
              <button onClick={logout} className="btn-outline w-full">Log out</button>
            </>
          ) : (
            <div className="text-slate-300">Loading…</div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}


