'use client'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { supabaseClient } from '../../lib/supabaseClient'

interface MeUser {
  id?: string
  email?: string
  name?: string | null
  avatarUrl?: string | null
}

// Built-in avatar options
const BUILT_IN_AVATARS = [
  '/avatars/av1.svg',
  '/avatars/av2.svg',
  '/avatars/av3.svg',
  '/avatars/av4.svg'
]

// Dicebear avatar styles
const DICEBEAR_STYLES = [
  'adventurer',
  'avataaars',
  'big-smile',
  'bottts',
  'croodles',
  'fun-emoji',
  'icons',
  'identicon',
  'lorelei',
  'micah',
  'miniavs',
  'open-peeps',
  'personas',
  'pixel-art',
  'rings',
  'shapes',
  'thumbs'
]

export default function AvatarsPage() {
  const [user, setUser] = useState<MeUser | null>(null)
  const [current, setCurrent] = useState<string>('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string>('')
  const [custom, setCustom] = useState<string[]>([])
  const [googlePhoto, setGooglePhoto] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'custom'>('custom')
  const [aiPrompt, setAiPrompt] = useState<string>('')
  const [aiStyle, setAiStyle] = useState<string>('realistic')
  const [aiGenerating, setAiGenerating] = useState<boolean>(false)
  const [aiGenerated, setAiGenerated] = useState<string[]>([])
  const [lightxImageUrl, setLightxImageUrl] = useState<string>('')
  const [lightxTextPrompt, setLightxTextPrompt] = useState<string>('')
  const [lightxStyleImageUrl, setLightxStyleImageUrl] = useState<string>('')
  const [lightxGenerating, setLightxGenerating] = useState<boolean>(false)
  const [lightxGenerated, setLightxGenerated] = useState<string[]>([])

  useEffect(() => {
    ;(async () => {
      // Check authentication - try both Supabase and JWT systems
      let userData = null
      
      // First try Supabase auth
      try {
        const { data: { user }, error } = await supabaseClient.auth.getUser()
        if (user) {
          userData = {
            id: user.id,
            email: user.email || undefined,
            name: user.user_metadata?.full_name || user.user_metadata?.name || null,
            avatarUrl: user.user_metadata?.avatar_url || null
          }
          // Set Google photo if available
          if (user.user_metadata?.avatar_url) {
            setGooglePhoto(user.user_metadata.avatar_url)
          }
        }
      } catch (supabaseError) {
        console.log('Supabase auth check failed, trying JWT...')
      }
      
      // If Supabase auth failed, try JWT auth
      if (!userData) {
        try {
          const res = await fetch('/api/auth/me', { cache: 'no-store' })
          const data = await res.json()
          if (data?.user) {
            userData = data.user
          }
        } catch (jwtError) {
          console.log('JWT auth check failed')
        }
      }
      
      if (!userData) {
        window.location.assign('/auth')
        return
      }
      
      setUser(userData)
      setCurrent(userData.avatarUrl || '')
      
      // Load custom avatars
      try {
        const list = await fetch('/api/avatars/list', { cache: 'no-store' })
        const payload = await list.json()
        if (Array.isArray(payload?.avatars)) setCustom(payload.avatars)
      } catch {}
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

  // Removed generators for non-custom avatars

  // Removed AI generation handlers

  // Removed LightX generation handlers

  const renderAvatarGrid = () => {
    switch (activeTab) {
      case 'custom':
        return custom.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {custom.map((src) => (
              <button
                key={`custom-${src}`}
                type="button"
                disabled={saving}
                onClick={() => save(src)}
                className={`rounded-2xl overflow-hidden ring-2 transition bg-slate-800 hover:ring-blue-400 ${current === src ? 'ring-blue-500' : 'ring-slate-700'}`}
                title="Select custom avatar"
                aria-label="Select custom avatar"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="Custom avatar" className="w-full aspect-square object-cover" />
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center text-slate-400 py-8">
            <p>No custom avatars available</p>
            <p className="text-sm mt-2">Upload custom avatars to see them here</p>
          </div>
        )
      
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Choose an Avatar</h1>
        </div>

        {!user && <div className="text-slate-300">Loading…</div>}

        {user && (
          <>
            {message && <div className="mb-4 text-slate-300">{message}</div>}
            
            {/* Only Custom Tab */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveTab('custom')}
                  className={`px-4 py-2 rounded-lg transition ${
                    activeTab === 'custom' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  Custom
                </button>
              </div>
            </div>

            {/* Avatar Grid */}
            {renderAvatarGrid()}
          </>
        )}
      </div>
      <Footer />
    </div>
  )
}


