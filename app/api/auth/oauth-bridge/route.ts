import { NextRequest } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import { makeSessionCookie, signSession } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    console.log('OAuth bridge called')
    const body = await req.json()
    console.log('Request body:', body)
    
    const { email, name, avatarUrl, provider, providerId } = body
    if (!email) {
      console.error('Missing email in request')
      return new Response(JSON.stringify({ error: 'MISSING_EMAIL', details: 'Email is required' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      })
    }

    console.log('Looking up user with email:', email)
    let user = await prisma.user.findUnique({ where: { email } })
    console.log('Found user:', user ? 'Yes' : 'No')
    
    if (!user) {
      console.log('Creating new user')
      user = await prisma.user.create({ 
        data: { 
          email, 
          name, 
          avatarUrl, 
          provider, 
          providerId 
        } 
      })
      console.log('User created successfully')
    } else {
      console.log('Updating existing user')
      await prisma.user.update({ 
        where: { id: user.id }, 
        data: { 
          name: name || user.name, 
          avatarUrl: avatarUrl || user.avatarUrl, 
          provider, 
          providerId 
        } 
      })
      console.log('User updated successfully')
    }

    console.log('Creating session token')
    const token = signSession({ uid: user.id, email: user.email })
    console.log('Session token created')
    
    return new Response(JSON.stringify({ ok: true }), { 
      status: 200, 
      headers: { 
        'Set-Cookie': makeSessionCookie(token), 
        'Content-Type': 'application/json' 
      } 
    })
  } catch (e: any) {
    console.error('oauth-bridge error:', e)
    console.error('Error stack:', e?.stack)
    const message = typeof e?.message === 'string' ? e.message : 'SERVER_ERROR'
    const details = e?.stack || 'No additional details available'
    return new Response(JSON.stringify({ 
      error: message, 
      details: details,
      type: e?.name || 'UnknownError'
    }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    })
  }
}


