import type { NextRequest } from 'next/server'
import { db } from '../../../lib/db'
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
    let query = 'SELECT * FROM scores WHERE "userId" = $1'
    const params = [userId]
    
    if (kind) {
      query += ' AND kind = $2'
      params.push(kind)
    }
    
    query += ' ORDER BY "createdAt" DESC LIMIT 50'
    
    const result = await db.query(query, params)
    return new Response(JSON.stringify({ scores: result.rows }), { status: 200, headers: { 'Content-Type': 'application/json' } })
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
    console.log('📊 Scores POST - User ID:', userId)
    const body = await req.json()
    console.log('📊 Scores POST - Request body:', body)
    
    const kind = String(body?.kind || '')
    const value = Number(body?.value)
    const meta = body?.meta ?? null
    
    console.log('📊 Scores POST - Parsed data:', { kind, value, meta })
    
    if (!kind || !Number.isFinite(value)) {
      console.log('❌ Invalid input:', { kind, value })
      return new Response(JSON.stringify({ error: 'INVALID_INPUT' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }
    
    // Generate a unique ID using cuid-like format
    const id = 'c' + Date.now().toString(36) + Math.random().toString(36).substr(2, 9)
    console.log('🆔 Generated ID:', id)
    
    console.log('📊 Attempting database insert...')
    const result = await db.query(`
      INSERT INTO scores (id, "userId", kind, value, meta, "createdAt", "updatedAt")
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING *
    `, [id, String(userId), kind, value, JSON.stringify(meta)])
    
    console.log('✅ Score inserted successfully:', result.rows[0])
    return new Response(JSON.stringify({ score: result.rows[0] }), { status: 201, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    console.error('❌ Scores POST error:', e)
    console.error('❌ Error details:', e.message)
    console.error('❌ Error stack:', e.stack)
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: e?.message || 'unknown' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}


