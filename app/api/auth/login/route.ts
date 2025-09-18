import { NextRequest } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { signSession, makeSessionCookie } from '../../../../lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) return new Response(JSON.stringify({ error: 'Missing email or password' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
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


