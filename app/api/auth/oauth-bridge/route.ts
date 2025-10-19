import { NextRequest } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { makeSessionCookie, signSession } from '../../../../lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  // Create a fresh Prisma client for each request to avoid prepared statement conflicts
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

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
    
    // Use raw SQL to avoid prepared statement conflicts
    const sanitizedName = name ? name.replace(/\0/g, '') : null
    const sanitizedAvatarUrl = avatarUrl ? avatarUrl.replace(/\0/g, '') : null
    
    // First, try to find the user using raw SQL
    const existingUsers = await prisma.$queryRaw`
      SELECT id, email, name, "avatarUrl", provider, "providerId" 
      FROM "User" 
      WHERE email = ${email}
    ` as any[]
    
    let user = existingUsers[0] || null
    console.log('Found user:', user ? 'Yes' : 'No')
    
    if (!user) {
      console.log('Creating new user')
      // Insert new user using raw SQL
      const newUser = await prisma.$queryRaw`
        INSERT INTO "User" (email, name, "avatarUrl", provider, "providerId", "createdAt", "updatedAt")
        VALUES (${email}, ${sanitizedName}, ${sanitizedAvatarUrl}, ${provider}, ${providerId}, NOW(), NOW())
        RETURNING id, email, name, "avatarUrl", provider, "providerId"
      ` as any[]
      
      user = newUser[0]
      console.log('User created successfully')
    } else {
      console.log('Updating existing user')
      // Update existing user using raw SQL
      await prisma.$queryRaw`
        UPDATE "User" 
        SET name = ${sanitizedName || user.name}, 
            "avatarUrl" = ${sanitizedAvatarUrl || user.avatarUrl}, 
            provider = ${provider}, 
            "providerId" = ${providerId},
            "updatedAt" = NOW()
        WHERE id = ${user.id}
      `
      console.log('User updated successfully')
    }

    console.log('Creating session token')
    const token = signSession({ uid: user.id, email: user.email })
    console.log('Session token created')
    
    // Clean up Prisma client
    await prisma.$disconnect()
    
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
    
    // Clean up Prisma client on error
    await prisma.$disconnect()
    
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


