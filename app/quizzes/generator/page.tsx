'use client'

import { useState } from 'react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import { Send, Loader2, CheckCircle2, Circle } from 'lucide-react'
import SaveScore from '../../../components/SaveScore'

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
}

export default function QuizGeneratorPage() {
  const [topic, setTopic] = useState('Computer Basics')
  const [level, setLevel] = useState('Beginner')
  const [count, setCount] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const generate = async () => {
    setLoading(true)
    setError(null)
    setSubmitted(false)
    setAnswers({})
    try {
      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, level, count }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Generation failed')
      setQuestions(data.questions || [])
    } catch (e: any) {
      setError(e?.message || 'Failed to generate quiz')
    } finally {
      setLoading(false)
    }
  }

  const submit = () => setSubmitted(true)

  const correctCount = submitted
    ? questions.reduce((acc, q) => acc + (answers[q.id] === q.correctAnswer ? 1 : 0), 0)
    : 0

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">Smart Quiz Generator</h1>

        <div className="card mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="block text-slate-300 mb-2 text-sm">Topic</label>
              <input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Operating Systems"
                className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 mb-2 text-sm">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option>Beginner</option>
                <option>Pro</option>
                <option>Legend</option>
                <option>Ultra Legend</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 mb-2 text-sm">Questions</label>
              <input
                type="number"
                min={3}
                max={15}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-600 rounded-lg bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-end">
              <button onClick={generate} disabled={loading} className="btn-primary w-full flex items-center justify-center">
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                Generate
              </button>
            </div>
          </div>
          {error && <div className="mt-3 text-sm text-red-400">{error}</div>}
        </div>

        {questions.length > 0 && (
          <div className="card">
            {!submitted ? (
              <div className="space-y-6">
                {questions.map((q, qi) => (
                  <div key={q.id} className="border-b border-slate-700 pb-4 last:border-b-0">
                    <div className="text-white font-semibold mb-3">{qi + 1}. {q.question}</div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {q.options.map((opt, oi) => (
                        <button
                          key={oi}
                          onClick={() => setAnswers(prev => ({ ...prev, [q.id]: oi }))}
                          className={`text-left p-3 rounded-lg border ${answers[q.id] === oi ? 'border-blue-500 bg-blue-500/10 text-blue-300' : 'border-slate-700 bg-slate-800 text-slate-200'} hover:border-blue-400`}
                        >
                          <span className="inline-flex items-center">
                            <Circle className="w-4 h-4 mr-2" /> {opt}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <div className="pt-2">
                  <button onClick={submit} className="btn-primary">Submit Answers</button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-white font-semibold">Score: {correctCount} / {questions.length}</div>
                {questions.map((q, qi) => (
                  <div key={q.id} className="border-b border-slate-700 pb-4 last:border-b-0">
                    <div className="text-white font-semibold mb-2">{qi + 1}. {q.question}</div>
                    <div className="grid sm:grid-cols-2 gap-3 mb-2">
                      {q.options.map((opt, oi) => {
                        const chosen = answers[q.id]
                        const isCorrect = oi === q.correctAnswer
                        const isChosen = oi === chosen
                        const cls = isCorrect
                          ? 'border-green-500 bg-green-500/10 text-green-300'
                          : isChosen
                          ? 'border-red-500 bg-red-500/10 text-red-300'
                          : 'border-slate-700 bg-slate-800 text-slate-200'
                        return (
                          <div key={oi} className={`p-3 rounded-lg border ${cls}`}>
                            <span className="inline-flex items-center">
                              {isCorrect ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Circle className="w-4 h-4 mr-2" />}
                              {opt}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                    <div className="text-slate-300 text-sm">Explanation: {q.explanation}</div>
                  </div>
                ))}
                <div>
                  <div className="mb-4">
                    <SaveScore
                      type="quiz"
                      title={`Generated Quiz - ${topic}`}
                      score={Math.round((correctCount / Math.max(questions.length, 1)) * 100)}
                      level={level}
                      completed={true}
                      details={{
                        generated: true,
                        topic,
                        questionCount: questions.length
                      }}
                    />
                  </div>
                  <button onClick={() => setSubmitted(false)} className="btn-outline">Try Again</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}


