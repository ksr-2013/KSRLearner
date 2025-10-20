import type { NextRequest } from 'next/server'
import { readTokenFromRequest, verifySession } from '../../../../lib/auth'
import { db } from '../../../../lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const token = readTokenFromRequest(req)
    if (!token) return new Response(JSON.stringify({ user: null }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    const session = verifySession(token)
    if (!session) return new Response(JSON.stringify({ user: null }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    
    // Use direct database connection to avoid prepared statement conflicts
    const result = await db.query(
      'SELECT id, email, name, "avatarUrl", "createdAt" FROM users WHERE id = $1 AND "isActive" = true',
      [session.uid]
    )
    
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ user: null }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }
    
    const user = result.rows[0]
    return new Response(JSON.stringify({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt
      }
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    console.error('Me error:', e)
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: e?.message || 'unknown' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
