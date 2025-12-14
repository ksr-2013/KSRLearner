'use client'

import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create client with fallback values to avoid build-time errors
// Actual validation happens at runtime when used
export const supabaseClient = createClient(url, anon, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Runtime validation helper (optional, for better error messages)
export function validateSupabaseConfig() {
  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is required')
  }
  if (!anon) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is required')
  }
}


