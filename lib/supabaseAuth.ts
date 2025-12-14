import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { readTokenFromRequest, verifySession } from './auth'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/**
 * Get the authenticated user from either Supabase session or JWT token
 * Returns null if no valid authentication is found
 */
export async function getAuthenticatedUser(req: NextRequest): Promise<{ userId: string; email?: string } | null> {
  // Try Supabase authentication first
  if (supabaseUrl && supabaseServiceKey) {
    try {
      const authHeader = req.headers.get('authorization')
      if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.substring(7)
        const supabase = createClient(supabaseUrl, supabaseServiceKey, {
          auth: {
            autoRefreshToken: false,
            persistSession: false
          },
          global: {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        })
        
        const { data: { user }, error } = await supabase.auth.getUser(token)
        
        if (user && !error) {
          return {
            userId: user.id,
            email: user.email
          }
        }
      }
    } catch (supabaseError) {
      console.log('Supabase auth failed, trying JWT...', supabaseError)
    }
  }

  // Fallback to JWT auth
  try {
    const token = readTokenFromRequest(req)
    if (!token) return null
    
    const session = verifySession(token)
    if (!session?.uid) return null
    
    return {
      userId: session.uid,
      email: session.email
    }
  } catch (jwtError) {
    console.log('JWT auth failed')
    return null
  }
}

