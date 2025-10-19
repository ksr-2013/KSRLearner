import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// This route now only relays the callback to the client page.
// Supabase will handle exchanging the code for a session on the client.
export async function GET(req: NextRequest) {
  const origin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin
  const redirect = new URL('/auth/callback', origin)
  // Preserve query params from Google (code, state, error, etc.)
  req.nextUrl.searchParams.forEach((value, key) => {
    redirect.searchParams.set(key, value)
  })
  return NextResponse.redirect(redirect)
}