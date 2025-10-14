'use client'

import { useEffect, useState } from 'react'
import { supabaseClient } from '../../../lib/supabaseClient'

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        // Ensure the session is established on this page load (handles both hash and code exchanges)
        try {
          await supabaseClient.auth.exchangeCodeForSession(window.location.href)
        } catch {}

        const { data } = await supabaseClient.auth.getUser()
        const user = data?.user
        const email = (user as any)?.email || (user as any)?.user_metadata?.email || (user as any)?.identities?.[0]?.identity_data?.email
        if (!email) { setError('Missing email from provider'); return }

        const profile = {
          email,
          name: user?.user_metadata?.full_name || user?.user_metadata?.name || null,
          avatarUrl: user?.user_metadata?.avatar_url || null,
          provider: 'google',
          providerId: user?.id
        }

        const res = await fetch('/api/auth/oauth-bridge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile)
        })
        if (!res.ok) throw new Error('Bridge failed')
        window.location.replace('/profile')
      } catch (e: any) {
        setError(e?.message || 'Authentication failed')
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center">
      {error ? <div>{error}</div> : <div>Signing you in…</div>}
    </div>
  )
}


