'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-slate-900 shadow-lg border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 relative overflow-hidden rounded-lg ring-1 ring-slate-700">
                <Image
                  src="/Screenshot_2025-06-17_204517-removebg-preview%20(1).png"
                  alt="KSR Learner Logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <div className="text-xl font-bold text-blue-400">KSR LEARNER</div>
                <div className="text-xs text-slate-400">Online Learning</div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-slate-300 hover:text-blue-400 font-medium transition-colors">
              Home
            </Link>
            <Link href="/quizzes" className="text-slate-300 hover:text-blue-400 font-medium transition-colors">
              Quizzes
            </Link>
            <Link href="/puzzles" className="text-slate-300 hover:text-blue-400 font-medium transition-colors">
              Puzzles
            </Link>
            <Link href="/typing" className="text-slate-300 hover:text-blue-400 font-medium transition-colors">
              Typing
            </Link>
            <Link href="/about" className="text-slate-300 hover:text-blue-400 font-medium transition-colors">
              About
            </Link>
            <Link href="/contact" className="text-slate-300 hover:text-blue-400 font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Link href="/quizzes" className="btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-slate-300 hover:text-blue-400 hover:bg-slate-800 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-slate-800 border-t border-slate-700">
              <Link
                href="/"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/quizzes"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Quizzes
              </Link>
              <Link
                href="/puzzles"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Puzzles
              </Link>
              <Link
                href="/typing"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Typing
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-400 hover:bg-slate-700 rounded-md font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-slate-300 hover:text-blue-400 hover:bg-slate-700 rounded-md font-medium transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <div className="pt-4">
                <Link
                  href="/quizzes"
                  className="btn-primary w-full text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
