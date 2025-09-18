import type { NextRequest } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { readTokenFromRequest, verifySession } from '../../../lib/auth'

function unauthorized() {
  return new Response(JSON.stringify({ error: 'UNAUTHORIZED' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
}

export async function GET(req: NextRequest) {
  const token = readTokenFromRequest(req)
  const session = token ? verifySession(token) : null
  if (!session?.uid) return unauthorized()
  try {
    const kind = new URL(req.url).searchParams.get('kind') || undefined
    const scores = await prisma.score.findMany({
      where: { userId: String(session.uid), ...(kind ? { kind } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 50
    })
    return new Response(JSON.stringify({ scores }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    console.error('Scores GET error:', e)
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: e?.message || 'unknown' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}

export async function POST(req: NextRequest) {
  const token = readTokenFromRequest(req)
  const session = token ? verifySession(token) : null
  if (!session?.uid) return unauthorized()
  try {
    const body = await req.json()
    const kind = String(body?.kind || '')
    const value = Number(body?.value)
    const meta = body?.meta ?? null
    if (!kind || !Number.isFinite(value)) {
      return new Response(JSON.stringify({ error: 'INVALID_INPUT' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    const created = await prisma.score.create({ data: { userId: String(session.uid), kind, value, meta } })
    return new Response(JSON.stringify({ score: created }), { status: 201, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    console.error('Scores POST error:', e)
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: e?.message || 'unknown' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}


