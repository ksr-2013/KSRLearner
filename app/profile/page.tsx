'use client'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

interface MeUser {
  id?: string
  email?: string
  name?: string | null
  avatarUrl?: string | null
}

const BUILT_IN_AVATARS = [
  '/avatars/av1.svg',
  '/avatars/av2.svg',
  '/avatars/av3.svg',
  '/avatars/av4.svg'
]

export default function ProfilePage() {
  const [user, setUser] = useState<MeUser | null>(null)
  const [name, setName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string>('')

  useEffect(() => {
    ;(async () => {
      const res = await fetch('/api/auth/me', { cache: 'no-store' })
      const data = await res.json()
      if (!data?.user) {
        window.location.assign('/auth')
        return
      }
      const u: MeUser = data.user
      setUser(u)
      setName(u.name || '')
      setAvatarUrl(u.avatarUrl || '')
    })()
  }, [])

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    window.location.assign('/')
  }

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || null, avatarUrl: avatarUrl || null }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || data?.details || 'Failed to update profile')
      setUser(data.user)
      setMessage('Profile updated')
    } catch (err: any) {
      setMessage(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">Profile</h1>
        <div className="card">
          {user ? (
            <>
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-blue-400/40 mb-3 bg-slate-800 flex items-center justify-center">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-2xl font-semibold text-white bg-blue-600 w-full h-full flex items-center justify-center">
                      {(user.name || user.email || 'U').trim().charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="text-slate-300 text-sm">{user.email || '—'}</div>
              </div>

              <form onSubmit={onSave} className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm mb-1">Name</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your name"
                    maxLength={100}
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm mb-2">Choose an avatar</label>
                  <div className="grid grid-cols-3 gap-3">
                    {BUILT_IN_AVATARS.map((src) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => setAvatarUrl(src)}
                        className={`rounded-xl overflow-hidden ring-2 transition ${avatarUrl === src ? 'ring-blue-500' : 'ring-transparent hover:ring-slate-600'}`}
                        title="Select avatar"
                        aria-label="Select avatar"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={src} alt="Avatar option" className="w-full h-20 object-cover" />
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-slate-400 mt-2">Your selection is saved to your profile.</div>
                </div>

                {message && <div className="text-sm text-slate-300">{message}</div>}
                <button type="submit" disabled={saving} className="btn-primary w-full">
                  {saving ? 'Saving…' : 'Save changes'}
                </button>
                <button type="button" onClick={logout} className="btn-outline w-full">Log out</button>
              </form>
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


