import { NextRequest } from 'next/server'
import { signSession, makeSessionCookie } from '../../../../lib/auth'
import { db } from '../../../../lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || typeof password !== 'string' || password.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing email or password' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    
    // Use direct database connection to avoid prepared statement conflicts
    const result = await db.query(
      'SELECT id, email, name, "passwordHash", "avatarUrl" FROM users WHERE email = $1 AND "isActive" = true',
      [email]
    )
    
    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }
    
    const user = result.rows[0]
    if (!user.passwordHash || typeof user.passwordHash !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    }
    
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    
    const token = signSession({ uid: user.id, email: user.email })
    return new Response(JSON.stringify({ id: user.id, email: user.email, name: user.name }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Set-Cookie': makeSessionCookie(token) }
    })
  } catch (e: any) {
    console.error('Login error:', e)
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: e?.message || 'unknown' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}


