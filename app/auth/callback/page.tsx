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
        
        // For Supabase OAuth, we need to handle the session differently
        console.log('Getting current session from Supabase...')
        console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log('Supabase Anon Key exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
        
        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession()
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          throw new Error(`Session error: ${sessionError.message}`)
        }
        
        if (!session) {
          // Try to exchange the code for a session
          console.log('No existing session, trying to exchange code...')
          console.log('Full URL for exchange:', window.location.href)
          
          try {
            const { data: sessionData, error: exchangeError } = await supabaseClient.auth.exchangeCodeForSession(window.location.href)
            
            if (exchangeError) {
              console.error('Exchange error:', exchangeError)
              throw new Error(`Session exchange failed: ${exchangeError.message}`)
            }
            
            if (!sessionData?.session) {
              throw new Error('No session data received from Supabase')
            }
            
            console.log('Session exchange successful:', sessionData)
            
            const user = sessionData.session.user
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
          } catch (fetchError: any) {
            console.error('Fetch error during exchange:', fetchError)
            throw new Error(`Session exchange failed: ${fetchError?.message || 'Network error'}`)
          }
        } else {
          // Session already exists, redirect to profile
          console.log('Session already exists, redirecting to profile...')
          window.location.replace('/profile')
        }
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


