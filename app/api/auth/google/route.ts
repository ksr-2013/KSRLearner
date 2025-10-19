import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    let base = process.env.NEXT_PUBLIC_SUPABASE_URL
    
    // Fix common Supabase URL issues
    if (base && base.includes('supabase.c')) {
      base = base.replace('supabase.c', 'supabase.co')
      console.log('Fixed Supabase URL from .c to .co')
    }
    
    // Use environment variable for main domain, fallback to request origin
    const reqUrl = new URL(req.url)
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || reqUrl.origin
    
    console.log('Google auth route called')
    console.log('Supabase URL:', base)
    console.log('Request origin:', siteUrl)
    
    if (!base) {
      console.error('Supabase URL missing')
      return new Response('Supabase URL missing', { status: 500 })
    }
    
    const redirectTo = encodeURIComponent(`${siteUrl}/auth/callback`)
    const url = `${base}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`
    
    console.log('Redirect URL:', url)
    
    return Response.redirect(url, 302)
  } catch (e: any) {
    console.error('Google auth error:', e)
    return new Response('Failed to start Google sign-in', { status: 500 })
  }
}


