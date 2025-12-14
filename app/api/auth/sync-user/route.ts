import { NextRequest } from 'next/server'
import { db } from '../../../../lib/db'

export async function POST(req: NextRequest) {
  try {
    const { userId, email, name } = await req.json()
    
    if (!userId || !email) {
      return new Response(JSON.stringify({ error: 'Missing userId or email' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }

    // Check if user exists in local DB
    const existingResult = await db.query('SELECT id FROM users WHERE id = $1', [userId])
    
    if (existingResult.rows.length === 0) {
      // Create user in local database
      await db.query(
        'INSERT INTO users (id, email, name, "createdAt", "updatedAt", "isActive", "lastLoginAt", provider, "providerId") VALUES ($1, $2, $3, NOW(), NOW(), true, NOW(), $4, $5)',
        [userId, email, name || null, 'supabase', userId]
      )
    } else {
      // Update last login time and user info
      await db.query(
        'UPDATE users SET "lastLoginAt" = NOW(), "updatedAt" = NOW(), email = $1, name = COALESCE($2, name) WHERE id = $3',
        [email, name, userId]
      )
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e: any) {
    console.error('Sync user error:', e)
    return new Response(JSON.stringify({ error: 'SYNC_ERROR', details: e?.message || 'unknown' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
}

