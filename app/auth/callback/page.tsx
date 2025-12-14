
'use client'

import { useEffect, useState } from 'react'
import { supabaseClient } from '../../../lib/supabaseClient'

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>('')

  useEffect(() => {
    (async () => {
      try {
        const currentUrl = window.location.href
        console.log('Auth callback page loaded:', currentUrl)
        // If detectSessionInUrl=true, supabase-js may have already exchanged the code.
        let session = null
        const { data: sessionResult } = await supabaseClient.auth.getSession()
        if (sessionResult?.session) {
          session = sessionResult.session
        } else {
          // Fallback: try exchange explicitly if session not present
          const { data, error } = await supabaseClient.auth.exchangeCodeForSession(currentUrl)
          if (error) throw error
          if (data?.session) {
            session = data.session
          }
        }

        if (!session) {
          throw new Error('Authentication failed: no session returned')
        }

        // Sync user to local database
        if (session.user) {
          try {
            await fetch('/api/auth/sync-user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.name || null
              })
            })
          } catch (syncError) {
            console.error('Error syncing user:', syncError)
            // Continue even if sync fails
          }
        }

        window.location.replace('/dashboard')
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


