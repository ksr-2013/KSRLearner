import type { NextRequest } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { readTokenFromRequest, verifySession } from '../../../../lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = readTokenFromRequest(req)
    if (!token) return new Response(JSON.stringify({ user: null }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    const session = verifySession(token)
    if (!session) return new Response(JSON.stringify({ user: null }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    const user = await prisma.user.findUnique({ where: { id: session.uid }, select: { id: true, email: true, name: true, avatarUrl: true, createdAt: true } })
    return new Response(JSON.stringify({ user }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    console.error('Me error:', e)
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: e?.message || 'unknown' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
