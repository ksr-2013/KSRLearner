'use client'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'

interface VideoItem {
  title: string
  url: string
}

function extractYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    // youtu.be/<id>
    if (u.hostname === 'youtu.be') {
      return u.pathname.slice(1) || null
    }
    // www.youtube.com/watch?v=<id>
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return v
    }
    return null
  } catch {
    return null
  }
}

export default function AnimationsPage() {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/animations/links.json', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load videos')
        const data = await res.json()
        if (mounted) setVideos(Array.isArray(data) ? data : [])
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load videos')
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-white mb-6">Explainer Videos</h1>

        {loading && <div className="text-slate-300">Loading videos…</div>}
        {error && <div className="text-red-400">{error}</div>}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((v, idx) => {
              const id = extractYouTubeId(v.url)
              const embedSrc = id ? `https://www.youtube.com/embed/${id}` : ''
              return (
                <div key={idx} className="bg-slate-800 rounded-lg overflow-hidden border border-slate-700 shadow">
                  {id ? (
                    <div className="aspect-video">
                      <iframe
                        className="w-full h-full"
                        src={embedSrc}
                        title={v.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    <div className="p-4 text-slate-300 text-sm">Invalid YouTube URL</div>
                  )}
                  <div className="p-4">
                    <h2 className="text-white font-semibold text-sm line-clamp-2">{v.title}</h2>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}


