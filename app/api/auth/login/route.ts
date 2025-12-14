import { NextRequest } from 'next/server'
import { supabaseServer } from '../../../../lib/supabaseServer'
import { db } from '../../../../lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || typeof password !== 'string' || password.length === 0) {
      return new Response(JSON.stringify({ error: 'Missing email or password' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }
    
    // Authenticate with Supabase
    const { data: authData, error: authError } = await supabaseServer.auth.signInWithPassword({
      email,
      password
    })

    if (authError) {
      console.error('Supabase login error:', authError)
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }

    if (!authData.user || !authData.session) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }

    // Sync user to local database if needed
    try {
      const userId = authData.user.id
      const userEmail = authData.user.email || email
      const userName = authData.user.user_metadata?.name || null

      // Check if user exists in local DB
      const existingResult = await db.query('SELECT id FROM users WHERE id = $1', [userId])
      
      if (existingResult.rows.length === 0) {
        // Create user in local database
        await db.query(
          'INSERT INTO users (id, email, name, "createdAt", "updatedAt", "isActive", "lastLoginAt", provider, "providerId") VALUES ($1, $2, $3, NOW(), NOW(), true, NOW(), $4, $5)',
          [userId, userEmail, userName, 'supabase', userId]
        )
      } else {
        // Update last login time
        await db.query(
          'UPDATE users SET "lastLoginAt" = NOW(), "updatedAt" = NOW() WHERE id = $1',
          [userId]
        )
      }
    } catch (dbError) {
      console.error('Error syncing user to database:', dbError)
      // Continue even if DB sync fails - user is authenticated
    }

    return new Response(JSON.stringify({ 
      id: authData.user.id, 
      email: authData.user.email, 
      name: authData.user.user_metadata?.name 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e: any) {
    console.error('Login error:', e)
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: e?.message || 'unknown' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
}


