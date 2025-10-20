import type { NextRequest } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { readTokenFromRequest, verifySession } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const token = readTokenFromRequest(req)
    if (!token) return new Response(JSON.stringify({ user: null }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    const session = verifySession(token)
    if (!session) return new Response(JSON.stringify({ user: null }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    
    // Use raw SQL to avoid prepared statement conflicts
    const users = await prisma.$queryRaw`
      SELECT id, email, name, avatar_url, created_at
      FROM users 
      WHERE id = ${session.uid} AND is_active = true
    ` as Array<{
      id: string
      email: string
      name: string | null
      avatar_url: string | null
      created_at: Date
    }>
    
    if (users.length === 0) {
      return new Response(JSON.stringify({ user: null }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }
    
    const user = users[0]
    return new Response(JSON.stringify({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatar_url,
        createdAt: user.created_at
      }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    console.error('Me error:', e)
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: e?.message || 'unknown' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
