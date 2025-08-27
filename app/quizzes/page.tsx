import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Link from 'next/link'
import { Trophy, Star, Zap, Crown, ArrowRight } from 'lucide-react'

export default function QuizzesPage() {
  const levels = [
    {
      name: 'Beginner',
      description: 'Perfect for those just starting their tech journey',
      icon: Star,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'from-green-500/10 to-emerald-600/10',
      borderColor: 'border-green-500/30',
      quizzes: 10,
      difficulty: 'Easy',
      topics: ['Computer Basics', 'Hardware Introduction', 'Simple Software']
    },
    {
      name: 'Pro',
      description: 'For learners with some technical background',
      icon: Trophy,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'from-blue-500/10 to-cyan-600/10',
      borderColor: 'border-blue-500/30',
      quizzes: 10,
      difficulty: 'Medium',
      topics: ['Advanced Hardware', 'Operating Systems', 'Networking Basics']
    },
    {
      name: 'Legend',
      description: 'Challenging content for experienced tech enthusiasts',
      icon: Zap,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-500/10 to-pink-600/10',
      borderColor: 'border-purple-500/30',
      quizzes: 10,
      difficulty: 'Hard',
      topics: ['Advanced Programming', 'System Architecture', 'Security Concepts']
    },
    {
      name: 'Ultra Legend',
      description: 'Expert-level challenges for tech professionals',
      icon: Crown,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'from-yellow-500/10 to-orange-600/10',
      borderColor: 'border-yellow-500/30',
      quizzes: 10,
      difficulty: 'Expert',
      topics: ['Advanced Algorithms', 'System Design', 'Emerging Technologies']
    }
  ]

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-dark-900 to-accent-900/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 opacity-30 blur-2xl"></div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Test Your <span className="gradient-text">Knowledge</span>
            </h1>
            
            <p className="text-xl text-dark-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Choose your difficulty level and challenge yourself with our comprehensive quizzes. 
              Each level contains 10 carefully crafted questions designed to test and enhance your 
              understanding of technology concepts.
            </p>
          </div>
        </div>
      </section>

      {/* Levels Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {levels.map((level, index) => (
              <div 
                key={index} 
                className={`card group hover:scale-105 transition-all duration-300 ${level.borderColor} hover:border-opacity-60`}
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${level.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <level.icon className="w-10 h-10 text-white" />
                </div>
                
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{level.name}</h3>
                  <p className="text-dark-300 mb-4">{level.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-dark-400">Difficulty:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${level.bgColor} ${level.borderColor} border`}>
                      {level.difficulty}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-dark-400">Quizzes:</span>
                    <span className="text-primary-400 font-semibold">{level.quizzes} Questions</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-medium text-dark-300 mb-2">Topics Covered:</h4>
                  <div className="flex flex-wrap gap-2">
                    {level.topics.map((topic, topicIndex) => (
                      <span 
                        key={topicIndex}
                        className="px-2 py-1 bg-dark-700 rounded text-xs text-dark-300"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <Link 
                  href={`/quizzes/${level.name.toLowerCase().replace(' ', '-')}`}
                  className={`inline-flex items-center justify-center w-full py-3 px-6 rounded-lg font-semibold text-white bg-gradient-to-r ${level.color} hover:opacity-90 transition-all duration-200 group-hover:translate-x-1`}
                >
                  Start {level.name} Level
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-dark-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Learning <span className="gradient-text">Statistics</span>
            </h2>
            <p className="text-xl text-dark-300 max-w-2xl mx-auto">
              Track your progress and see how you're improving across different difficulty levels.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400 mb-2">40</div>
              <div className="text-dark-300">Total Quizzes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">4</div>
              <div className="text-dark-300">Difficulty Levels</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">100+</div>
              <div className="text-dark-300">Questions Available</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">∞</div>
              <div className="text-dark-300">Learning Potential</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to <span className="gradient-text">Challenge Yourself</span>?
          </h2>
          <p className="text-xl text-dark-300 mb-8">
            Start with the Beginner level and work your way up. Each quiz is designed to be both 
            educational and engaging, helping you build a solid foundation in technology.
          </p>
          <Link href="/quizzes/beginner" className="btn-primary">
            Start with Beginner Level
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
