import type { NextRequest } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { readTokenFromRequest, verifySession } from '../../../../lib/auth'

export async function POST(req: NextRequest) {
  try {
    const token = readTokenFromRequest(req)
    if (!token) return new Response(JSON.stringify({ error: 'UNAUTHENTICATED' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    const session = verifySession(token)
    if (!session) return new Response(JSON.stringify({ error: 'UNAUTHENTICATED' }), { status: 401, headers: { 'Content-Type': 'application/json' } })

    const body = await req.json().catch(() => ({}))
    let { name, avatarUrl } = body as { name?: string; avatarUrl?: string }

    if (typeof name !== 'undefined') {
      if (name === null) name = undefined
      if (typeof name === 'string') name = name.trim()
      if (name !== undefined && name.length > 100) {
        return new Response(JSON.stringify({ error: 'INVALID_NAME' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }
    }

    if (typeof avatarUrl !== 'undefined') {
      if (avatarUrl === null) avatarUrl = undefined
      if (typeof avatarUrl === 'string') avatarUrl = avatarUrl.trim()
      if (avatarUrl && avatarUrl.length > 2048) {
        return new Response(JSON.stringify({ error: 'INVALID_AVATAR_URL' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }
    }

    const updated = await prisma.user.update({
      where: { id: session.uid },
      data: {
        ...(typeof name !== 'undefined' ? { name } : {}),
        ...(typeof avatarUrl !== 'undefined' ? { avatarUrl } : {}),
      },
      select: { id: true, email: true, name: true, avatarUrl: true, createdAt: true },
    })

    return new Response(JSON.stringify({ user: updated }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    console.error('Profile update error:', e)
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: e?.message || 'unknown' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}


