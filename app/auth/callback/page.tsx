'use client'

import { useEffect, useState } from 'react'
import { supabaseClient } from '../../../lib/supabaseClient'

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>('')

  useEffect(() => {
    (async () => {
      try {
        console.log('Auth callback started')
        console.log('Current URL:', window.location.href)
        
        // Extract the authorization code from the URL
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const error = urlParams.get('error')
        
        if (error) {
          throw new Error(`OAuth error: ${error}`)
        }
        
        if (!code) {
          throw new Error('No authorization code received from Google')
        }
        
        console.log('Authorization code received:', code)
        
        // Exchange the code for a session using Supabase
        console.log('Exchanging code for session...')
        const { data: sessionData, error: sessionError } = await supabaseClient.auth.exchangeCodeForSession(window.location.href)
        
        if (sessionError) {
          throw new Error(`Session exchange failed: ${sessionError.message}`)
        }
        
        console.log('Session exchange successful:', sessionData)
        
        const user = sessionData?.user
        if (!user) {
          throw new Error('No user data received from Supabase')
        }
        
        const email = user.email || user.user_metadata?.email || user.identities?.[0]?.identity_data?.email
        console.log('Extracted email:', email)
        
        if (!email) { 
          setError('Missing email from provider'); 
          setDebugInfo(`User object: ${JSON.stringify(user, null, 2)}`)
          return 
        }

        const profile = {
          email,
          name: user.user_metadata?.full_name || user.user_metadata?.name || null,
          avatarUrl: user.user_metadata?.avatar_url || null,
          provider: 'google',
          providerId: user.id
        }

        console.log('Profile data:', profile)

        console.log('Calling OAuth bridge...')
        const res = await fetch('/api/auth/oauth-bridge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(profile)
        })

        console.log('Bridge response status:', res.status)

        if (!res.ok) {
          let detail = ''
          try {
            const text = await res.text()
            detail = text || ''
            console.error('Bridge error response:', text)
          } catch (textError) {
            console.error('Failed to read error response:', textError)
          }
          throw new Error(`Bridge failed (${res.status}): ${detail}`)
        }

        console.log('Bridge successful, redirecting to profile...')
        window.location.replace('/profile')
      } catch (e: any) {
        console.error('Auth callback error:', e)
        setError(e?.message || 'Authentication failed')
        setDebugInfo(`Error details: ${JSON.stringify(e, null, 2)}`)
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {error ? (
          <div className="bg-red-900 border border-red-500 rounded-lg p-6">
            <h2 className="text-red-400 text-xl font-bold mb-4">Authentication Error</h2>
            <div className="text-red-300 mb-4">{error}</div>
            {debugInfo && (
              <details className="mt-4">
                <summary className="text-red-400 cursor-pointer">Debug Information</summary>
                <pre className="mt-2 text-xs text-red-200 bg-red-950 p-2 rounded overflow-auto">
                  {debugInfo}
                </pre>
              </details>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="text-2xl mb-4">Signing you in…</div>
            <div className="text-sm text-slate-400">Please wait while we process your authentication.</div>
          </div>
        )}
      </div>
    </div>
  )
}


