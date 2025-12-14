import { createClient } from '@supabase/supabase-js'

// Lazy initialization to avoid build-time errors if env vars are missing
function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }
  return url
}

function getSupabaseServiceKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }
  return key
}

function getSupabaseAnonKey(): string {
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!key) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }
  return key
}

// Server-side Supabase client for API routes
// Use service role key for admin operations, or anon key for user operations
// Lazy initialization to avoid build-time errors
let _supabaseServer: ReturnType<typeof createClient> | null = null

export function getSupabaseServer() {
  if (!_supabaseServer) {
    const url = getSupabaseUrl()
    const key = getSupabaseServiceKey()
    _supabaseServer = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  return _supabaseServer
}

// Export for backward compatibility (lazy getter)
export const supabaseServer = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop) {
    return getSupabaseServer()[prop as keyof ReturnType<typeof createClient>]
  }
})

// Create a client for user operations (uses anon key)
export function createSupabaseClient(accessToken?: string) {
  const url = getSupabaseUrl()
  const anonKey = getSupabaseAnonKey()

  const client = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: {
      headers: accessToken ? {
        Authorization: `Bearer ${accessToken}`
      } : {}
    }
  })

  return client
}

