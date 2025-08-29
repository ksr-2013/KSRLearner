import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { Keyboard, Target, Clock, Trophy, Star, Zap, Crown, ArrowRight } from 'lucide-react'

export default function TypingPage() {
  const practiceModes = [
    {
      name: 'Beginner',
      description: 'Start with basic typing fundamentals',
      icon: Star,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-500/10 to-emerald-600/10',
      borderColor: 'border-green-500/30',
      difficulty: 'Easy',
      topics: ['Home Row Keys', 'Basic Words', 'Simple Sentences']
    },
    {
      name: 'Intermediate',
      description: 'Improve speed and accuracy',
      icon: Target,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-500/10 to-cyan-600/10',
      borderColor: 'border-blue-500/30',
      difficulty: 'Medium',
      topics: ['Common Words', 'Short Paragraphs', 'Punctuation']
    },
    {
      name: 'Advanced',
      description: 'Master complex typing challenges',
      icon: Zap,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-500/10 to-pink-600/10',
      borderColor: 'border-purple-500/30',
      difficulty: 'Hard',
      topics: ['Long Texts', 'Technical Terms', 'Speed Tests']
    },
    {
      name: 'Expert',
      description: 'Ultimate typing mastery',
      icon: Crown,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-500/10 to-orange-600/10',
      borderColor: 'border-yellow-500/30',
      difficulty: 'Expert',
      topics: ['Advanced Texts', 'Competition Mode', 'Custom Content']
    }
  ]

  const features = [
    {
      icon: Keyboard,
      title: "Real-time Feedback",
      description: "Get instant feedback on accuracy and speed as you type."
    },
    {
      icon: Clock,
      title: "Speed Tracking",
      description: "Monitor your WPM (Words Per Minute) and track improvements."
    },
    {
      icon: Target,
      title: "Accuracy Metrics",
      description: "Detailed analysis of your typing accuracy and error patterns."
    },
    {
      icon: Trophy,
      title: "Progress Tracking",
      description: "Save your results and track your typing journey over time."
    }
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-blue-900/30 text-blue-300 text-sm font-medium rounded-full mb-6 border border-blue-700/50">
                <Keyboard className="w-4 h-4 mr-2" />
                MASTER THE KEYBOARD
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Improve Your
                <span className="gradient-text block">Typing Skills</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                Enhance your typing speed and accuracy with our comprehensive typing practice platform. 
                From beginner basics to expert-level challenges, practice with real-time feedback and 
                track your progress over time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/typing/practice" className="btn-primary">
                  Start Practicing
                </Link>
                <Link href="/typing/quiz" className="btn-outline">
                  Take Typing Quiz
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
                  <div className="bg-slate-900 rounded-lg p-6 border border-slate-600">
                    <div className="text-slate-400 text-sm mb-2">Type this text:</div>
                    <div className="text-white text-lg mb-4">The quick brown fox jumps over the lazy dog.</div>
                    <div className="bg-slate-800 rounded p-3 border border-slate-600">
                      <div className="text-slate-300 text-sm">Your typing will appear here...</div>
                    </div>
                    <div className="flex justify-between mt-4 text-sm text-slate-400">
                      <span>WPM: 0</span>
                      <span>Accuracy: 0%</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full opacity-20"></div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Why Choose Our Typing Platform?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our typing practice system provides comprehensive tools to improve your keyboard skills 
              with real-time feedback and detailed progress tracking.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-slate-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practice Modes Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Choose Your Practice Mode
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Select the difficulty level that matches your current typing skills and start improving today.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {practiceModes.map((mode, index) => (
              <div 
                key={index} 
                className={`card group hover:scale-105 transition-all duration-300 ${mode.borderColor} hover:border-opacity-60`}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${mode.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <mode.icon className="w-10 h-10 text-white" />
                </div>
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{mode.name}</h3>
                  <p className="text-slate-300 mb-4">{mode.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm font-medium">
                      {mode.difficulty}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {mode.topics.map((topic, topicIndex) => (
                      <div key={topicIndex} className="flex items-center text-slate-400">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {topic}
                      </div>
                    ))}
                  </div>
                </div>
                
                <Link 
                  href={`/typing/practice?level=${mode.name.toLowerCase()}`}
                  className="btn-primary w-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300"
                >
                  Start {mode.name} Practice
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Improve Your Typing?
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-3xl mx-auto">
            Start practicing today and see your typing speed and accuracy improve with every session.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/typing/practice" className="btn-primary">
              Start Free Practice
            </Link>
            <Link href="/typing/quiz" className="btn-outline">
              Take Speed Test
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
