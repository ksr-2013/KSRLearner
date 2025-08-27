import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'KSR Learner – Explore, Learn & Grow with Technology',
  description: 'KSR Learner is a modern learning hub designed to make technology simple and engaging for everyone. From interactive puzzles and quizzes to in-depth lessons on computer fundamentals.',
  keywords: 'technology learning, computer education, interactive quizzes, puzzles for kids, online learning platform',
  authors: [{ name: 'KSR Learner Team' }],
  creator: 'KSR Learner',
  publisher: 'KSR Learner',
  robots: 'index, follow',
  openGraph: {
    title: 'KSR Learner – Explore, Learn & Grow with Technology',
    description: 'Modern learning hub for technology education with interactive quizzes and puzzles.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KSR Learner – Technology Learning Platform',
    description: 'Learn technology through interactive quizzes and puzzles.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
