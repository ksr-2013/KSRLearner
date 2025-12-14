import { NextRequest } from 'next/server'
import { supabaseServer } from '../../../../lib/supabaseServer'
import { db } from '../../../../lib/db'

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Missing email or password' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseServer.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || null
        }
      }
    })

    if (authError) {
      console.error('Supabase signup error:', authError)
      // Handle specific Supabase errors
      if (authError.message.includes('already registered') || authError.message.includes('already exists')) {
        return new Response(JSON.stringify({ error: 'Email already in use' }), { 
          status: 409, 
          headers: { 'Content-Type': 'application/json' } 
        })
      }
      return new Response(JSON.stringify({ error: authError.message || 'Signup failed' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }

    if (!authData.user) {
      return new Response(JSON.stringify({ error: 'Failed to create user' }), { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }

    // Sync user to local database
    try {
      const userId = authData.user.id
      const userEmail = authData.user.email || email
      const userName = authData.user.user_metadata?.name || name || null

      // Check if user already exists in local DB
      const existingResult = await db.query('SELECT id FROM users WHERE id = $1', [userId])
      
      if (existingResult.rows.length === 0) {
        // Create user in local database
        await db.query(
          'INSERT INTO users (id, email, name, "createdAt", "updatedAt", "isActive", provider, "providerId") VALUES ($1, $2, $3, NOW(), NOW(), true, $4, $5)',
          [userId, userEmail, userName, 'supabase', userId]
        )
      }
    } catch (dbError) {
      console.error('Error syncing user to database:', dbError)
      // Continue even if DB sync fails - Supabase auth user is created
    }

    return new Response(JSON.stringify({ 
      id: authData.user.id, 
      email: authData.user.email, 
      name: authData.user.user_metadata?.name || name 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (e: any) {
    console.error('Signup error:', e)
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: e?.message || 'unknown' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
}


