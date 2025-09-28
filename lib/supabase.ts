// Supabase configuration and utilities
// This file provides Supabase client setup and helper functions

export interface SupabaseConfig {
  url: string
  anonKey: string
  serviceRoleKey?: string
}

export const supabaseConfig: SupabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
}

// Validate Supabase configuration
export function validateSupabaseConfig(): boolean {
  if (!supabaseConfig.url) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
    return false
  }
  
  if (!supabaseConfig.anonKey) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
    return false
  }
  
  return true
}

// Database connection helper
export function getDatabaseUrl(): string {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
  }
  return dbUrl
}

// Supabase-specific database utilities
export const supabaseUtils = {
  // Check if we're using Supabase
  isSupabase: (): boolean => {
    return supabaseConfig.url.includes('supabase.co')
  },
  
  // Get connection info for debugging
  getConnectionInfo: () => {
    if (supabaseUtils.isSupabase()) {
      const url = new URL(supabaseConfig.url)
      return {
        provider: 'Supabase',
        project: url.hostname.split('.')[0],
        region: url.hostname.includes('supabase.co') ? 'Supabase Cloud' : 'Unknown'
      }
    }
    return {
      provider: 'PostgreSQL',
      url: process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'Unknown'
    }
  }
}
