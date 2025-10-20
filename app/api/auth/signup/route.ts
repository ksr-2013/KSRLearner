import { NextRequest } from 'next/server'
import { signSession, makeSessionCookie } from '../../../../lib/auth'
import { db } from '../../../../lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password) return new Response(JSON.stringify({ error: 'Missing email or password' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    
    // Check if email already exists using direct database connection
    const existingResult = await db.query('SELECT id FROM users WHERE email = $1', [email])
    
    if (existingResult.rows.length > 0) {
      return new Response(JSON.stringify({ error: 'Email already in use' }), { status: 409, headers: { 'Content-Type': 'application/json' } })
    }
    
    const rounds = Number(process.env.BCRYPT_ROUNDS || 10)
    const hash = await bcrypt.hash(password, rounds)
    
    // Create user using direct database connection
    const newUserResult = await db.query(
      'INSERT INTO users (id, email, "passwordHash", name, "createdAt", "updatedAt", "isActive") VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW(), true) RETURNING id, email, name',
      [email, hash, name || null]
    )
    
    if (newUserResult.rows.length === 0) {
      throw new Error('Failed to create user')
    }
    
    const user = newUserResult.rows[0]
    const token = signSession({ uid: user.id, email: user.email })
    return new Response(JSON.stringify({ id: user.id, email: user.email, name: user.name }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Set-Cookie': makeSessionCookie(token) }
    })
  } catch (e: any) {
    console.error('Signup error:', e)
    const message = e?.code === 'P2002' ? 'Email already in use' : (e?.message || 'unknown')
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: message }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}


