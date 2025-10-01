'use client'

import { useState } from 'react'
import { Bot, Sparkles, Loader2, Wand2 } from 'lucide-react'
import SaveScore from './SaveScore'

interface GeneratedPuzzle {
  id?: string
  title: string
  description: string
  type: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  solution?: string
  explanation?: string
  hint?: string
}

export default function AIPuzzleGenerator() {
  const [topic, setTopic] = useState('Computer Fundamentals')
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy')
  const [count, setCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [puzzles, setPuzzles] = useState<GeneratedPuzzle[]>([])
  const [opened, setOpened] = useState<Record<string, boolean>>({})

  const promptForPuzzles = () => {
    return `You are an educational content generator.
Generate ${count} JSON puzzles for the topic "${topic}" with difficulty "${difficulty}".
Each puzzle must be an object with keys: title, description, type, difficulty, solution, explanation, hint.
Return ONLY a JSON array. Do not include code fences or extra text.`
  }

  const generate = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/groq-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: promptForPuzzles(), context: 'puzzle-generator' })
      })
      const data = await res.json()
      const text = data?.response || ''
      let parsed: any
      try {
        parsed = JSON.parse(text)
      } catch {
        // attempt to extract JSON array from any surrounding text
        const match = text.match(/\[([\s\S]*?)\]/)
        if (!match) throw new Error('AI did not return valid JSON')
        parsed = JSON.parse(match[0])
      }
      if (!Array.isArray(parsed)) throw new Error('Expected a JSON array')
      // basic normalization
      const normalized: GeneratedPuzzle[] = parsed.map((p: any, idx: number) => ({
        id: p.id || String(Date.now()) + '-' + idx,
        title: String(p.title || `Puzzle ${idx + 1}`),
        description: String(p.description || ''),
        type: String(p.type || topic),
        difficulty: (p.difficulty || difficulty) as 'Easy' | 'Medium' | 'Hard',
        solution: p.solution ? String(p.solution) : undefined,
        explanation: p.explanation ? String(p.explanation) : undefined,
        hint: p.hint ? String(p.hint) : undefined
      }))
      setPuzzles(normalized)
    } catch (e: any) {
      setError(e?.message || 'Failed to generate puzzles')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <Wand2 className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-semibold text-white">AI Puzzle Generator</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-slate-300 text-sm mb-1">Topic</label>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white"
              placeholder="e.g., Binary, Logic Gates, Hardware"
              maxLength={100}
            />
          </div>
          <div>
            <label className="block text-slate-300 text-sm mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-300 text-sm mb-1">How many</label>
            <input
              type="number"
              min={1}
              max={5}
              value={count}
              onChange={(e) => setCount(Math.min(5, Math.max(1, Number(e.target.value) || 1)))}
              className="w-full bg-slate-900 border border-slate-700 rounded-md px-3 py-2 text-white"
            />
          </div>
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={generate} disabled={loading} className="btn-primary inline-flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate
          </button>
        </div>
        {error && <div className="mt-3 text-red-400 text-sm">{error}</div>}
      </div>

      {puzzles.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-6">
          {puzzles.map((p) => (
            <div key={p.id} className="bg-slate-800 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-2">
                <Bot className="w-5 h-5 text-blue-400" />
                <h3 className="text-white font-semibold">{p.title}</h3>
                <span className="ml-auto text-xs text-slate-400">{p.type} • {p.difficulty}</span>
              </div>
              <p className="text-slate-300 mb-3">{p.description}</p>
              {p.hint && <p className="text-slate-400 text-sm mb-2"><span className="font-medium text-slate-300">Hint:</span> {p.hint}</p>}
              {p.solution && (
                <details
                  className="mt-2"
                  onToggle={(e) => {
                    const isOpen = (e.currentTarget as HTMLDetailsElement).open
                    if (p.id) setOpened(prev => ({ ...prev, [p.id as string]: isOpen }))
                  }}
                >
                  <summary className="cursor-pointer text-slate-300">Show solution</summary>
                  <div className="mt-2 text-slate-200"><span className="font-medium">Answer:</span> {p.solution}</div>
                  {p.explanation && <div className="text-slate-300 text-sm mt-1">{p.explanation}</div>}
                </details>
              )}

              {/* Save Score appears only after solution is revealed */}
              {p.id && opened[p.id] && (
                <div className="mt-4">
                  <SaveScore
                    type="puzzle"
                    title={p.title}
                    level={p.difficulty}
                    completed={true}
                    details={{
                      generated: true,
                      topic,
                      puzzleType: p.type,
                      difficulty: p.difficulty,
                      hasSolution: Boolean(p.solution)
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


