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

// Export for backward compatibility (lazy getter with proper proxy)
export const supabaseServer = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop) {
    const server = getSupabaseServer()
    const value = server[prop as keyof typeof server]
    // If it's a function, bind it to the server instance
    if (typeof value === 'function') {
      return value.bind(server)
    }
    // If it's an object (like 'auth'), return a proxy for it too
    if (value && typeof value === 'object') {
      return new Proxy(value, {
        get(target, propKey) {
          const nestedValue = target[propKey as keyof typeof target] as unknown
          if (typeof nestedValue === 'function') {
            return (nestedValue as Function).bind(target)
          }
          return nestedValue
        }
      })
    }
    return value
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

