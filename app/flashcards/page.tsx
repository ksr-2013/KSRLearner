'use client'

import React from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { Cpu, Monitor, Server, Code, ArrowRight } from 'lucide-react'
import { FLASHCARD_CATEGORIES } from '../../data/flashcards'

const IconMap: Record<string, React.ElementType> = {
  Cpu: Cpu,
  Monitor: Monitor,
  Server: Server,
  Code: Code,
}

export default function FlashcardsPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <section className="hero-gradient py-20 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Flashcards</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Master essential technology concepts and vocabulary. Choose a category below 
              to begin flipping through index cards and testing your knowledge.
            </p>
          </div>
        </section>

        <section className="py-20 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {FLASHCARD_CATEGORIES.map((category, index) => {
                const IconComponent = IconMap[category.iconName] || Monitor;
                return (
                  <Link 
                    key={category.id} 
                    href={`/flashcards/${category.id}`}
                    className="group"
                  >
                    <div className="bg-slate-800 rounded-2xl p-8 border border-slate-700 hover:border-blue-500/50 transition-all duration-300 h-full flex flex-col hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/20">
                      <div className="flex items-start justify-between mb-6">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center
                          ${index % 2 === 0 ? 'bg-gradient-to-br from-blue-600 to-cyan-500' : 'bg-gradient-to-br from-emerald-500 to-green-600'}
                        `}>
                          <IconComponent className="w-8 h-8 text-white" />
                        </div>
                        <div className="text-xs font-semibold px-3 py-1 bg-slate-700 text-slate-300 rounded-full">
                          {category.cards.length} Terms
                        </div>
                      </div>
                      
                      <h2 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-400 transition-colors">
                        {category.title}
                      </h2>
                      
                      <p className="text-slate-300 pr-4 flex-grow mb-6 leading-relaxed">
                        {category.description}
                      </p>
                      
                      <div className="inline-flex items-center text-blue-400 font-medium group-hover:text-cyan-400 transition-colors mt-auto">
                        Study Pack <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
