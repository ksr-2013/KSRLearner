import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '../../../../../lib/prisma'
import { makeSessionCookie, signSession } from '../../../../../lib/auth'

export const dynamic = 'force-dynamic'

// This endpoint expects to be called by Supabase OAuth redirect with an access_token in the URL fragment.
// Since URL fragments are not sent to the server, we support passing tokens via query string by Netlify/Supabase redirect config.

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email')
    const name = searchParams.get('name')
    const avatarUrl = searchParams.get('avatar_url')
    const provider = 'google'
    const providerId = searchParams.get('sub') || searchParams.get('provider_id')

    if (!email) return new Response('Missing email', { status: 400 })

    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({
        data: { email, name: name || null, avatarUrl: avatarUrl || null, provider, providerId }
      })
    } else if (!user.providerId) {
      await prisma.user.update({ where: { id: user.id }, data: { provider, providerId, avatarUrl: avatarUrl || user.avatarUrl, name: name || user.name } })
    }

    const token = signSession({ uid: user.id, email: user.email })
    return new Response('<script>window.location.href="/profile"</script>', {
      status: 200,
      headers: { 'Set-Cookie': makeSessionCookie(token), 'Content-Type': 'text/html' }
    })
  } catch (e: any) {
    console.error('Google callback error:', e)
    return new Response('Authentication failed', { status: 500 })
  }
}


