'use client'

import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'

interface Score {
  id: string
  kind: string
  value: number
  createdAt: string
  meta?: any
}

export default function ScoresPage() {
  const [typingScores, setTypingScores] = useState<Score[] | null>(null)
  const [quizScores, setQuizScores] = useState<Score[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' })
        const me = await res.json()
        if (!me?.user) {
          window.location.assign('/auth')
          return
        }
        const listTyping = await fetch('/api/scores?kind=typing', { cache: 'no-store' })
        const listQuiz = await fetch('/api/scores?kind=quiz', { cache: 'no-store' })
        const a = (await listTyping.json()).scores || []
        const b = (await listQuiz.json()).scores || []
        setTypingScores(a)
        setQuizScores(b)
      } catch (e: any) {
        setError(e?.message || 'Failed to load scores')
      }
    })()
  }, [])

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">My Scores</h1>
          <Link href="/" className="btn-outline">Home</Link>
        </div>

        {error && <div className="text-red-400 mb-4">{error}</div>}

        {!typingScores && !quizScores && !error && (
          <div className="text-slate-300">Loading…</div>
        )}

        {typingScores && quizScores && typingScores.length === 0 && quizScores.length === 0 && (
          <div className="text-slate-300">No scores yet. Try a typing test or quiz!</div>
        )}

        {(quizScores && quizScores.length > 0) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-3">Quiz Scores</h2>
            <div className="space-y-3">
              {quizScores.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <div>
                    <div className="text-white font-semibold">Quiz</div>
                    <div className="text-slate-400 text-sm">{new Date(s.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-400 font-bold text-lg">{s.value}</div>
                    {s.meta?.explanation && (
                      <div className="text-slate-400 text-xs">Has explanations</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(typingScores && typingScores.length > 0) && (
          <div>
            <h2 className="text-xl font-semibold text-white mb-3">Typing Scores</h2>
            <div className="space-y-3">
              {typingScores.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <div>
                    <div className="text-white font-semibold">Typing</div>
                    <div className="text-slate-400 text-sm">{new Date(s.createdAt).toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-blue-400 font-bold text-lg">{s.value} WPM</div>
                    {s.meta?.accuracy != null && (
                      <div className="text-slate-400 text-xs">{s.meta.accuracy}% accuracy</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}


