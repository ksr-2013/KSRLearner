import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    // Use environment variable for main domain, fallback to request origin
    const reqUrl = new URL(req.url)
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || reqUrl.origin
    
    console.log('Google auth route called')
    console.log('Request origin:', siteUrl)
    
    // Redirect to Supabase's built-in Google OAuth
    // Supabase will handle provider redirect and callback
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) {
      console.error('NEXT_PUBLIC_SUPABASE_URL not configured')
      return new Response('Supabase not configured', { status: 500 })
    }
    const redirectTo = encodeURIComponent(`${siteUrl}/auth/callback`)
    const url = `${supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`
    console.log('Redirecting to Supabase authorize:', url)
    return Response.redirect(url, 302)
  } catch (e: any) {
    console.error('Google auth error:', e)
    return new Response('Failed to start Google sign-in', { status: 500 })
  }
}


