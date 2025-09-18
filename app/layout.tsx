import type { Metadata } from 'next'
import './globals.css'
import AIChatbot from '../components/AIChatbot'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'KSR Learner – Explore, Learn & Grow with Technology',
  description: 'KSR Learner is a modern learning hub designed to make technology simple and engaging for everyone. From interactive puzzles and quizzes to in-depth lessons on computer fundamentals.',
  keywords: 'technology learning, computer education, interactive quizzes, puzzles for kids, online learning platform',
  authors: [{ name: 'KSR Learner Team' }],
  creator: 'KSR Learner',
  publisher: 'KSR Learner',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'KSR Learner – Explore, Learn & Grow with Technology',
    description: 'Modern learning hub for technology education with interactive quizzes and puzzles.',
    type: 'website',
    locale: 'en_US',
    images: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KSR Learner – Technology Learning Platform',
    description: 'Learn technology through interactive quizzes and puzzles.',
    images: ['/logo.png'],
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <script defer src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/gotrue-js@2/dist/gotrue.min.js"></script>
      </head>
      <body>
        {children}
        <AIChatbot />
      </body>
    </html>
  )
}
