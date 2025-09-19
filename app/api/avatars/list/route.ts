import { promises as fs } from 'fs'
import path from 'path'

const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp'])

async function listFilesRecursive(dir: string, baseUrlPrefix: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const out: string[] = []
  for (const e of entries) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      const nested = await listFilesRecursive(p, baseUrlPrefix + '/' + encodeURIComponent(e.name))
      out.push(...nested)
    } else {
      const ext = path.extname(e.name).toLowerCase()
      if (IMAGE_EXTS.has(ext)) {
        out.push(baseUrlPrefix + '/' + encodeURIComponent(e.name))
      }
    }
  }
  return out
}

export async function GET() {
  try {
    const avatarsDir = path.join(process.cwd(), 'public', 'avatars')
    let urls: string[] = []
    try {
      await fs.access(avatarsDir)
      urls = await listFilesRecursive(avatarsDir, '/avatars')
    } catch {
      urls = []
    }
    // Deduplicate and sort for stable display
    const unique = Array.from(new Set(urls)).sort()
    return new Response(JSON.stringify({ avatars: unique }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'SERVER_ERROR', details: e?.message || 'unknown' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}


