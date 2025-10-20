import type { NextRequest } from 'next/server'
import { readTokenFromRequest, verifySession } from '../../../../lib/auth'
import { db } from '../../../../lib/db'

export async function POST(req: NextRequest) {
  try {
    const token = readTokenFromRequest(req)
    if (!token) return new Response(JSON.stringify({ error: 'UNAUTHENTICATED' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
    const session = verifySession(token)
    if (!session) return new Response(JSON.stringify({ error: 'UNAUTHENTICATED' }), { status: 401, headers: { 'Content-Type': 'application/json' } })

    const body = await req.json().catch(() => ({}))
    let { name, avatarUrl } = body as { name?: string; avatarUrl?: string }

    if (typeof name !== 'undefined') {
      if (name === null) name = undefined
      if (typeof name === 'string') name = name.trim()
      if (name !== undefined && name.length > 100) {
        return new Response(JSON.stringify({ error: 'INVALID_NAME' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }
    }

    if (typeof avatarUrl !== 'undefined') {
      if (avatarUrl === null) avatarUrl = undefined
      if (typeof avatarUrl === 'string') avatarUrl = avatarUrl.trim()
      if (avatarUrl && avatarUrl.length > 2048) {
        return new Response(JSON.stringify({ error: 'INVALID_AVATAR_URL' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
      }
    }

    // Build dynamic update query based on provided fields
    const updateFields = []
    const updateValues = []
    let paramIndex = 1

    if (typeof name !== 'undefined') {
      updateFields.push(`name = $${paramIndex}`)
      updateValues.push(name)
      paramIndex++
    }

    if (typeof avatarUrl !== 'undefined') {
      updateFields.push(`"avatarUrl" = $${paramIndex}`)
      updateValues.push(avatarUrl)
      paramIndex++
    }

    if (updateFields.length === 0) {
      return new Response(JSON.stringify({ error: 'NO_UPDATES' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    // Add updatedAt and user ID
    updateFields.push(`"updatedAt" = NOW()`)
    updateValues.push(session.uid)

    const updateQuery = `
      UPDATE users 
      SET ${updateFields.join(', ')} 
      WHERE id = $${paramIndex} AND "isActive" = true
      RETURNING id, email, name, "avatarUrl", "createdAt"
    `

    const result = await db.query(updateQuery, updateValues)

    if (result.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'USER_NOT_FOUND' }), { status: 404, headers: { 'Content-Type': 'application/json' } })
    }

    const updated = result.rows[0]
    return new Response(JSON.stringify({ user: updated }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    console.error('Profile update error:', e)
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: e?.message || 'unknown' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}


