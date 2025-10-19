import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const error = searchParams.get('error')
    const errorDescription = searchParams.get('error_description')

    console.log('Google OAuth callback received')
    console.log('Code:', code ? 'present' : 'missing')
    console.log('State:', state)
    console.log('Error:', error)

    if (error) {
      throw new Error(`OAuth error: ${error}${errorDescription ? ` - ${errorDescription}` : ''}`)
    }

    if (!code) {
      throw new Error('No authorization code received from Google')
    }

    // Check if Google OAuth credentials are configured
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if (!clientId || !clientSecret) {
      console.error('Google OAuth credentials not configured')
      throw new Error('Google OAuth not configured')
    }

    // Exchange authorization code for access token
    console.log('Exchanging authorization code for access token...')
    
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin}/auth/callback`,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      console.error('Token exchange failed:', errorText)
      throw new Error(`Token exchange failed: ${errorText}`)
    }

    const tokenData = await tokenResponse.json()
    console.log('Access token received')

    // Get user information from Google
    console.log('Fetching user information from Google...')
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    })

    if (!userResponse.ok) {
      const errorText = await userResponse.text()
      console.error('User info fetch failed:', errorText)
      throw new Error(`User info fetch failed: ${errorText}`)
    }

    const googleUser = await userResponse.json()
    console.log('Google user data:', googleUser)

    const profile = {
      email: googleUser.email,
      name: googleUser.name,
      avatarUrl: googleUser.picture,
      provider: 'google',
      providerId: googleUser.id
    }

    console.log('Profile data:', profile)

    // Call OAuth bridge to create/update user
    console.log('Calling OAuth bridge...')
    const bridgeResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin}/api/auth/oauth-bridge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile)
    })

    console.log('Bridge response status:', bridgeResponse.status)

    if (!bridgeResponse.ok) {
      const errorText = await bridgeResponse.text()
      console.error('Bridge error response:', errorText)
      throw new Error(`Bridge failed (${bridgeResponse.status}): ${errorText}`)
    }

    console.log('Bridge successful, redirecting to profile...')
    
    // Redirect to profile page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin}/profile`)
    
  } catch (e: any) {
    console.error('Google OAuth callback error:', e)
    
    // Redirect to error page with error details
    const errorUrl = new URL('/auth/callback', process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin)
    errorUrl.searchParams.set('error', 'oauth_error')
    errorUrl.searchParams.set('message', e.message)
    
    return NextResponse.redirect(errorUrl)
  }
}