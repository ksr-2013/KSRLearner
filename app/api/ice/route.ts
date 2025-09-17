import { NextRequest } from 'next/server'

// Server-side ICE fetcher for Xirsys to avoid exposing credentials client-side
// Env required: XIRSYS_USERNAME, XIRSYS_SECRET, XIRSYS_CHANNEL

export const runtime = 'nodejs'

function getConfig() {
  const username = process.env.XIRSYS_USERNAME
  const secret = process.env.XIRSYS_SECRET
  const channel = process.env.XIRSYS_CHANNEL
  if (!username || !secret || !channel) return null
  return { username, secret, channel }
}

export async function GET(_req: NextRequest) {
  try {
    const cfg = getConfig()
    if (!cfg) {
      return new Response(
        JSON.stringify({ error: 'XIRSYS env not configured' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const body = JSON.stringify({ format: 'urls' })
    const res = await fetch(`https://global.xirsys.net/_turn/${encodeURIComponent(cfg.channel)}`, {
      method: 'PUT',
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${cfg.username}:${cfg.secret}`).toString('base64'),
        'Content-Type': 'application/json',
        'Content-Length': String(Buffer.byteLength(body))
      },
      body
    })

    if (!res.ok) {
      const txt = await res.text()
      return new Response(
        JSON.stringify({ error: 'XIRSYS_REQUEST_FAILED', details: txt }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const data = await res.json() as any
    // Xirsys responds with { v: { iceServers: [ { urls, username, credential }, ... ] } }
    const iceServers = data?.v?.iceServers || data?.iceServers || []
    return new Response(JSON.stringify({ iceServers }), {
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
    })
  } catch (e: any) {
    return new Response(
      JSON.stringify({ error: 'ICE_SERVER_ERROR', details: e?.message || 'unknown' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}


