'use client'

import { useEffect, useState } from 'react'
import { supabaseClient } from '../../../lib/supabaseClient'

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<string>('')

  useEffect(() => {
    (async () => {
      try {
        console.log('Auth callback page loaded')
        console.log('Current URL:', window.location.href)
        
        // Check for URL parameters (errors from server-side callback)
        const urlParams = new URLSearchParams(window.location.search)
        const error = urlParams.get('error')
        const message = urlParams.get('message')
        
        if (error === 'oauth_error' && message) {
          throw new Error(message)
        }
        
        // If we reach here, the OAuth flow should have completed successfully
        // and we should have been redirected to /profile
        // If we're still on this page, something went wrong
        console.log('OAuth callback completed, redirecting to profile...')
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


