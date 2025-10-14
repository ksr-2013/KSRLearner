import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL
    const reqUrl = new URL(req.url)
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || `${reqUrl.origin}`
    if (!base) return new Response('Supabase URL missing', { status: 500 })
    const redirectTo = encodeURIComponent(`${siteUrl}/api/auth/google/callback`)
    const url = `${base}/auth/v1/authorize?provider=google&redirect_to=${redirectTo}`
    return Response.redirect(url, 302)
  } catch (e: any) {
    return new Response('Failed to start Google sign-in', { status: 500 })
  }
}


