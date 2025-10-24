import type { NextRequest } from 'next/server'
import { prisma } from '../../../lib/prisma'
import { readTokenFromRequest, verifySession } from '../../../lib/auth'
import { createClient } from '@supabase/supabase-js'

function unauthorized() {
  return new Response(JSON.stringify({ error: 'UNAUTHORIZED' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
}

export async function GET(req: NextRequest) {
  let userId = null
  
  // Try Supabase authentication first
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (user && !error) {
        userId = user.id
      }
    }
  } catch (supabaseError) {
    console.log('Supabase auth failed, trying JWT...')
  }
  
  // If Supabase auth failed, try JWT auth
  if (!userId) {
    const token = readTokenFromRequest(req)
    const session = token ? verifySession(token) : null
    if (!session?.uid) return unauthorized()
    userId = session.uid
  }
  
  try {
    const kind = new URL(req.url).searchParams.get('kind') || undefined
    const scores = await prisma.score.findMany({
      where: { userId: String(userId), ...(kind ? { kind } : {}) },
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
  let userId = null
  
  // Try Supabase authentication first
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    
    const authHeader = req.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      const { data: { user }, error } = await supabase.auth.getUser(token)
      if (user && !error) {
        userId = user.id
      }
    }
  } catch (supabaseError) {
    console.log('Supabase auth failed, trying JWT...')
  }
  
  // If Supabase auth failed, try JWT auth
  if (!userId) {
    const token = readTokenFromRequest(req)
    const session = token ? verifySession(token) : null
    if (!session?.uid) return unauthorized()
    userId = session.uid
  }
  
  try {
    const body = await req.json()
    const kind = String(body?.kind || '')
    const value = Number(body?.value)
    const meta = body?.meta ?? null
    if (!kind || !Number.isFinite(value)) {
      return new Response(JSON.stringify({ error: 'INVALID_INPUT' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    const created = await prisma.score.create({ data: { userId: String(userId), kind, value, meta } })
    return new Response(JSON.stringify({ score: created }), { status: 201, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    console.error('Scores POST error:', e)
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: e?.message || 'unknown' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}


