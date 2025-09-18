import { NextRequest } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { signSession, makeSessionCookie } from '../../../../lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password) return new Response(JSON.stringify({ error: 'Missing email or password' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return new Response(JSON.stringify({ error: 'Email already in use' }), { status: 409, headers: { 'Content-Type': 'application/json' } })
    const rounds = Number(process.env.BCRYPT_ROUNDS || 10)
    const hash = await bcrypt.hash(password, rounds)
    const user = await prisma.user.create({ data: { email, passwordHash: hash, name } })
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


