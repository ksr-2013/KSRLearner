import type { NextRequest } from 'next/server'
import { clearSessionCookie } from '../../../../lib/auth'

export async function POST(_req: NextRequest) {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Set-Cookie': clearSessionCookie() }
  })
}


