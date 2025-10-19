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
        
        // Check for URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const error = urlParams.get('error')
        const errorDescription = urlParams.get('error_description')
        
        if (error) {
          throw new Error(`OAuth error: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`)
        }
        
        // Extract authorization code from URL parameters
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        const state = urlParams.get('state')
        
        console.log('Authorization code:', code)
        console.log('State parameter:', state)
        
        if (!code) {
          throw new Error('No authorization code received from Google')
        }
        
        // For now, let's create a mock user profile and test the OAuth bridge
        // This bypasses Supabase OAuth and goes directly to our custom bridge
        console.log('Creating mock profile for testing...')
        
        const profile = {
          email: 'test@example.com', // We'll get this from Google later
          name: 'Test User',
          avatarUrl: null,
          provider: 'google',
          providerId: 'test-id'
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


