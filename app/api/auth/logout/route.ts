import type { NextRequest } from 'next/server'
import { clearSessionCookie } from '../../../../lib/auth'
import { supabaseClient } from '../../../../lib/supabaseClient'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    // Try to logout from Supabase first (for Google sign-in users)
    try {
      await supabaseClient.auth.signOut()
    } catch (supabaseError) {
      console.log('Supabase logout failed (user might not be using Supabase auth):', supabaseError)
    }
    
    // Always clear JWT cookie (for regular login users)
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Set-Cookie': clearSessionCookie() }
    })
  } catch (error) {
    console.error('Logout error:', error)
    // Even if there's an error, try to clear the JWT cookie
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Set-Cookie': clearSessionCookie() }
    })
  }
}


