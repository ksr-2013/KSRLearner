import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    // Use environment variable for main domain, fallback to request origin
    const reqUrl = new URL(req.url)
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || reqUrl.origin
    
    console.log('Google auth route called')
    console.log('Request origin:', siteUrl)
    
    // For now, let's redirect directly to the callback with a mock code
    // This will help us test the OAuth bridge without Google OAuth setup
    const mockCode = 'mock_authorization_code_' + Date.now()
    const redirectUrl = `${siteUrl}/auth/callback?code=${mockCode}&state=mock_state`
    
    console.log('Mock redirect URL:', redirectUrl)
    
    return Response.redirect(redirectUrl, 302)
  } catch (e: any) {
    console.error('Google auth error:', e)
    return new Response('Failed to start Google sign-in', { status: 500 })
  }
}


