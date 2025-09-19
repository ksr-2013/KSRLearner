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

function dicebearUrl(seed: string, style: string = 'thumbs', background: string = 'b6e3f4') {
  const qs = new URLSearchParams({ seed, style, background })
  return `/api/avatars/dicebear?${qs.toString()}`
}

export default function AvatarsPage() {
  const [user, setUser] = useState<MeUser | null>(null)
  const [current, setCurrent] = useState<string>('')
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
      setCurrent(u.avatarUrl || '')
    })()
  }, [])

  const save = async (src: string) => {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: user?.name || null, avatarUrl: src })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || data?.details || 'Failed to update avatar')
      setCurrent(src)
      setMessage('Avatar updated')
    } catch (e: any) {
      setMessage(e?.message || 'Failed to update avatar')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Choose an Avatar</h1>
        </div>

        {!user && <div className="text-slate-300">Loading…</div>}

        {user && (
          <>
            {message && <div className="mb-4 text-slate-300">{message}</div>}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {BUILT_IN_AVATARS.map((src) => (
                <button
                  key={src}
                  type="button"
                  disabled={saving}
                  onClick={() => save(src)}
                  className={`rounded-2xl overflow-hidden ring-2 transition bg-slate-800 hover:ring-blue-400 ${current === src ? 'ring-blue-500' : 'ring-slate-700'}`}
                  title="Select avatar"
                  aria-label="Select avatar"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="Avatar option" className="w-full aspect-square object-cover" />
                </button>
              ))}
              {[0,1,2,3,4,5].map((i) => {
                const src = dicebearUrl(`user-${i}`, 'thumbs', i % 2 === 0 ? 'b6e3f4' : 'c0aede')
                return (
                  <button
                    key={`dice-${i}`}
                    type="button"
                    disabled={saving}
                    onClick={() => save(src)}
                    className={`rounded-2xl overflow-hidden ring-2 transition bg-slate-800 hover:ring-blue-400 ${current === src ? 'ring-blue-500' : 'ring-slate-700'}`}
                    title="Select generated avatar"
                    aria-label="Select generated avatar"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="Generated avatar" className="w-full aspect-square object-cover" />
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}


