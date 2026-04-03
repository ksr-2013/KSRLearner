'use client'

import React, { useState, useEffect } from 'react'
import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { FLASHCARD_CATEGORIES, FlashcardCategory, Flashcard } from '../../../data/flashcards'
import { ArrowLeft, ChevronLeft, ChevronRight, RotateCw, Shuffle } from 'lucide-react'

export default function FlashcardStudyPage() {
  const params = useParams()
  const router = useRouter()
  const categoryId = params.category as string
  
  const [category, setCategory] = useState<FlashcardCategory | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [cards, setCards] = useState<Flashcard[]>([])

  useEffect(() => {
    const found = FLASHCARD_CATEGORIES.find(c => c.id === categoryId)
    if (found) {
      setCategory(found)
      setCards(found.cards)
    } else {
      router.push('/flashcards')
    }
  }, [categoryId, router])

  if (!category || cards.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p>Loading flashcards...</p>
        </div>
      </div>
    )
  }

  const handleNext = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === cards.length - 1 ? 0 : prev + 1))
    }, 150) // Small delay so it un-flips before changing text
  }

  const handlePrev = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1))
    }, 150)
  }

  const handleShuffle = () => {
    setIsFlipped(false)
    setTimeout(() => {
      const shuffled = [...cards].sort(() => Math.random() - 0.5)
      setCards(shuffled)
      setCurrentIndex(0)
    }, 150)
  }

  const handleRestart = () => {
    setIsFlipped(false)
    setTimeout(() => {
      setCards(category.cards) // reset to original order
      setCurrentIndex(0)
    }, 150)
  }

  const currentCard = cards[currentIndex]

  // CSS for 3D flip effect
  const cardStyle = {
    perspective: "1000px"
  }

  const innerStyle = {
    transition: "transform 0.6s",
    transformStyle: "preserve-3d" as const,
    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
    position: "relative" as const,
    width: "100%",
    height: "100%"
  }

  const faceStyle = {
    position: "absolute" as const,
    width: "100%",
    height: "100%",
    backfaceVisibility: "hidden" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    borderRadius: "1rem",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
  }

  const frontStyle = {
    ...faceStyle,
    backgroundColor: "#1e293b", // slate-800
    border: "2px solid #334155", // slate-700
  }

  const backStyle = {
    ...faceStyle,
    backgroundColor: "#0f172a", // slate-900
    border: "2px solid #3b82f6", // blue-500
    transform: "rotateY(180deg)"
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />

      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex flex-col">
        {/* Navigation & Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link 
            href="/flashcards" 
            className="inline-flex items-center text-slate-400 hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50 w-fit"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Categories
          </Link>
          <div className="text-center sm:text-right">
            <h1 className="text-2xl font-bold text-white">{category.title}</h1>
            <p className="text-blue-400 font-medium">Card {currentIndex + 1} of {cards.length}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-800 rounded-full mb-12 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          ></div>
        </div>

        {/* Flashcard Area */}
        <div className="flex-grow flex items-center justify-center flex-col w-full max-w-3xl mx-auto mb-12">
          
          {/* Card Container */}
          <div 
            className="w-full aspect-[4/3] md:aspect-[16/9] cursor-pointer" 
            style={cardStyle}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div style={innerStyle}>
              {/* Front side (Term) */}
              <div style={frontStyle} className="hover:border-blue-500/50 transition-colors">
                <span className="text-sm font-semibold text-blue-400 tracking-wider uppercase mb-6 drop-shadow-sm">Term</span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center drop-shadow-md">
                  {currentCard.term}
                </h2>
                <div className="absolute bottom-6 text-slate-500 text-sm flex items-center animate-pulse">
                  Click to flip <RotateCw className="w-3 h-3 ml-2" />
                </div>
              </div>

              {/* Back side (Definition) */}
              <div style={backStyle}>
                <span className="text-sm font-semibold text-emerald-400 tracking-wider uppercase mb-6 drop-shadow-sm flex items-center">
                  Definition
                </span>
                <p className="text-xl md:text-2xl text-slate-200 text-center leading-relaxed">
                  {currentCard.definition}
                </p>
                <div className="absolute bottom-6 text-slate-500 text-sm flex items-center">
                  Click to flip back <RotateCw className="w-3 h-3 ml-2" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Controls */}
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleRestart}
                className="p-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all border border-transparent hover:border-slate-600"
                title="Restart"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              <button 
                onClick={handleShuffle}
                className="p-3 text-slate-400 hover:text-white hover:bg-slate-700 rounded-xl transition-all border border-transparent hover:border-slate-600"
                title="Shuffle Cards"
              >
                <Shuffle className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={handlePrev}
                className="flex items-center px-6 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-700 transition-colors border border-slate-600 hover:border-slate-500 shadow-lg"
              >
                <ChevronLeft className="w-5 h-5 mr-1" /> Prev
              </button>
              <button 
                onClick={handleNext}
                className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/50 border border-blue-500"
              >
                Next <ChevronRight className="w-5 h-5 ml-1" />
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
