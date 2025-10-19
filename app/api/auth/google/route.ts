import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    // Use environment variable for main domain, fallback to request origin
    const reqUrl = new URL(req.url)
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || reqUrl.origin
    
    console.log('Google auth route called')
    console.log('Request origin:', siteUrl)
    
    // Check if Google OAuth credentials are configured
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    
    if (!clientId || !clientSecret) {
      console.error('Google OAuth credentials not configured')
      return new Response('Google OAuth not configured', { status: 500 })
    }
    
    // Generate state parameter for security
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    // Build Google OAuth URL - redirect to server-side callback
    const redirectUri = encodeURIComponent(`${siteUrl}/api/auth/google/callback`)
    const scope = encodeURIComponent('openid email profile')
    const responseType = 'code'
    
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `scope=${scope}&` +
      `response_type=${responseType}&` +
      `state=${state}&` +
      `access_type=offline&` +
      `prompt=consent`
    
    console.log('Google OAuth URL:', googleAuthUrl)
    
    return Response.redirect(googleAuthUrl, 302)
  } catch (e: any) {
    console.error('Google auth error:', e)
    return new Response('Failed to start Google sign-in', { status: 500 })
  }
}


