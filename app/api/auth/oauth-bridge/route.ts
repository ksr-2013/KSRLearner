// Deprecated: Custom OAuth bridge removed in favor of Supabase sessions
export const dynamic = 'force-dynamic'

export async function POST() {
  return new Response(JSON.stringify({ error: 'DEPRECATED', details: 'Use Supabase OAuth flow' }), {
    status: 410,
    headers: { 'Content-Type': 'application/json' }
  })
}


