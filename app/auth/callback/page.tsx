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
        const code = urlParams.get('code')
        const state = urlParams.get('state')
        
        if (error) {
          throw new Error(`OAuth error: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`)
        }
        
        console.log('Authorization code:', code)
        console.log('State parameter:', state)
        
        if (!code) {
          throw new Error('No authorization code received from Google')
        }
        
        // Exchange authorization code for access token and user info
        console.log('Exchanging authorization code for access token...')
        
        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
            client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
            code: code,
            grant_type: 'authorization_code',
            redirect_uri: `${window.location.origin}/auth/callback`,
          }),
        })
        
        if (!tokenResponse.ok) {
          const errorText = await tokenResponse.text()
          throw new Error(`Token exchange failed: ${errorText}`)
        }
        
        const tokenData = await tokenResponse.json()
        console.log('Access token received')
        
        // Get user information from Google
        console.log('Fetching user information from Google...')
        const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenData.access_token}`,
          },
        })
        
        if (!userResponse.ok) {
          const errorText = await userResponse.text()
          throw new Error(`User info fetch failed: ${errorText}`)
        }
        
        const googleUser = await userResponse.json()
        console.log('Google user data:', googleUser)
        
        const profile = {
          email: googleUser.email,
          name: googleUser.name,
          avatarUrl: googleUser.picture,
          provider: 'google',
          providerId: googleUser.id
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


