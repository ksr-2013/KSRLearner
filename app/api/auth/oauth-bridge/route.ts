import { NextRequest } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { makeSessionCookie, signSession } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const { email, name, avatarUrl, provider, providerId } = await req.json()
    if (!email) return new Response(JSON.stringify({ error: 'MISSING_EMAIL' }), { status: 400 })

    let user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      user = await prisma.user.create({ data: { email, name, avatarUrl, provider, providerId } })
    } else {
      await prisma.user.update({ where: { id: user.id }, data: { name: name || user.name, avatarUrl: avatarUrl || user.avatarUrl, provider, providerId } })
    }

    const token = signSession({ uid: user.id, email: user.email })
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Set-Cookie': makeSessionCookie(token), 'Content-Type': 'application/json' } })
  } catch (e: any) {
    console.error('oauth-bridge error:', e)
    const message = typeof e?.message === 'string' ? e.message : 'SERVER_ERROR'
    return new Response(JSON.stringify({ error: message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}


