import type { NextRequest } from 'next/server'

// Proxies Dicebear SVGs so avatars are served from our domain and cacheable
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const style = (searchParams.get('style') || 'thumbs').trim()
    const seed = (searchParams.get('seed') || 'ksr-user').trim()
    const background = searchParams.get('background') || ''

    const qs = new URLSearchParams()
    qs.set('seed', seed)
    if (background) qs.set('backgroundColor', background)
    // Add some defaults for consistency
    qs.set('radius', '50')

    const diceUrl = `https://api.dicebear.com/7.x/${encodeURIComponent(style)}/svg?${qs.toString()}`
    const upstream = await fetch(diceUrl, { cache: 'no-store' })
    const svg = await upstream.text()
    const status = upstream.status

    return new Response(svg, {
      status,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=86400',
        'CDN-Cache-Control': 'public, max-age=86400',
        'Vercel-CDN-Cache-Control': 'public, max-age=86400'
      }
    })
  } catch (e: any) {
    return new Response('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><rect width="10" height="10" fill="red"/></svg>', {
      status: 500,
      headers: { 'Content-Type': 'image/svg+xml' }
    })
  }
}


