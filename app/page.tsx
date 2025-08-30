import Header from '../components/Header'
import Footer from '../components/Footer'
import Link from 'next/link'
import { BookOpen, Target, Trophy, Brain, Play, Users, Award, Clock, Star, ArrowRight, Keyboard, Video, MessageCircle } from 'lucide-react'

export default function Home() {
  const features = [
    {
      icon: BookOpen,
      title: "Interactive Learning",
      description: "Engage with hands-on quizzes and puzzles that make learning fun and memorable."
    },
    {
      icon: Target,
      title: "Progressive Difficulty",
      description: "Start from beginner basics and advance to expert-level concepts at your own pace."
    },
    {
      icon: Trophy,
      title: "Achievement System",
      description: "Track your progress and earn badges as you master different technology concepts."
    },
    {
      icon: Brain,
      title: "Problem Solving",
      description: "Develop critical thinking skills through challenging puzzles and real-world scenarios."
    }
  ]

  const stats = [
    { number: "1000+", label: "Active Learners" },
    { number: "50+", label: "Expert Videos" },
    { number: "100+", label: "Interactive Quizzes" },
    { number: "24/7", label: "Learning Access" }
  ]

  const videos = [
    {
      title: "Computer Basics for Beginners",
      url: "https://youtu.be/Qu9WhQ4byDw?si=Cq-FG1GCNYAE7s7",
      thumbnail: "https://img.youtube.com/vi/Qu9WhQ4byDw/maxresdefault.jpg"
    },
    {
      title: "Hardware Fundamentals",
      url: "https://youtu.be/fDQGhMdQP8M?si=ctwacfrsyjlAe7s7",
      thumbnail: "https://img.youtube.com/vi/fDQGhMdQP8M/maxresdefault.jpg"
    },
    {
      title: "Software Essentials",
      url: "https://youtu.be/9outczs4udg?si=HTiHBio_M6D9NVG7",
      thumbnail: "https://img.youtube.com/vi/9outczs4udg/maxresdefault.jpg"
    },
    {
      title: "Networking Basics",
      url: "https://youtu.be/9AU1PbO8Vsg?si=9sS9ye_zm41dobzN",
      thumbnail: "https://img.youtube.com/vi/9AU1PbO8Vsg/maxresdefault.jpg"
    },
    {
      title: "Programming Introduction",
      url: "https://youtu.be/auuP9LEIwSg?si=_799-NAldZiwd_Vq",
      thumbnail: "https://img.youtube.com/vi/auuP9LEIwSg/maxresdefault.jpg"
    },
    {
      title: "Digital Security",
      url: "https://youtu.be/5-SOqsi_i5o?si=YtBG4aiAKcgSJXiO",
      thumbnail: "https://img.youtube.com/vi/5-SOqsi_i5o/maxresdefault.jpg"
    },
    {
      title: "Cloud Computing",
      url: "https://youtu.be/EYXO3mKB_CE?si=r2z1UNejySHsXv34",
      thumbnail: "https://img.youtube.com/vi/EYXO3mKB_CE/maxresdefault.jpg"
    },
    {
      title: "AI & Machine Learning",
      url: "https://youtu.be/QqnnUZMoo0Q?si=vPDQITn_77HLz_Ve",
      thumbnail: "https://img.youtube.com/vi/QqnnUZMoo0Q/maxresdefault.jpg"
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
                <Star className="w-4 h-4 mr-2" />
                WE CONNECT YOU TO THE WORLD'S BEST
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Best Online Technology
                <span className="gradient-text block">Learning Platform</span>
              </h1>
              <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                KSR Learner is a modern learning hub designed to make technology simple and engaging for everyone. 
                From interactive puzzles and quizzes to in-depth lessons on computer fundamentals, our platform helps 
                learners build a strong foundation in areas like hardware, software, coding, and digital skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/quizzes" className="btn-primary">
                  Start Learning Now
                </Link>
                <Link href="/puzzles" className="btn-outline">
                  Explore Puzzles
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Student learning technology"
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                <div className="absolute -bottom-6 -left-6 bg-slate-800 rounded-xl shadow-lg p-4 border border-slate-700">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">Watch Demo</div>
                      <div className="text-xs text-slate-400">2 min video</div>
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
              Why Choose KSR Learner?
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Our platform combines cutting-edge technology with proven learning methodologies 
              to create an engaging and effective learning experience.
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

      {/* Stats Section */}
      <section className="bg-slate-800 py-20 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl lg:text-5xl font-bold text-blue-400 mb-2">{stat.number}</div>
                <div className="text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Typing Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Master Your Typing Skills
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Improve your typing speed and accuracy with our comprehensive practice platform. 
              From beginner basics to expert challenges, track your progress and see real improvements.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="card text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Keyboard className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Practice Mode</h3>
              <p className="text-slate-300 mb-4">Learn at your own pace with guided typing exercises</p>
              <Link href="/typing/practice" className="btn-primary w-full">
                Start Practicing
              </Link>
            </div>
            
            <div className="card text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Speed Tests</h3>
              <p className="text-slate-300 mb-4">Challenge yourself with timed typing assessments</p>
              <Link href="/typing/quiz" className="btn-primary w-full">
                Take Test
              </Link>
            </div>
            
            <div className="card text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Progress Tracking</h3>
              <p className="text-slate-300 mb-4">Monitor your improvement with detailed analytics</p>
              <Link href="/typing" className="btn-primary w-full">
                View Progress
              </Link>
            </div>
          </div>
          
          <div className="text-center">
            <Link href="/typing" className="btn-outline">
              Explore All Typing Features
            </Link>
          </div>
        </div>
      </section>

      {/* Video Call Section */}
      <section className="section-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Connect with Students Live
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Provide real-time learning support through our integrated video calling system. 
              Connect with students, answer questions, and guide them through complex topics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">High-Quality Video Calls</h3>
                    <p className="text-slate-300">Crystal clear video and audio for seamless communication with students.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Integrated Chat</h3>
                    <p className="text-slate-300">Text chat alongside video calls for sharing links, code snippets, and notes.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">Multi-Participant Support</h3>
                    <p className="text-slate-300">Host group sessions and one-on-one tutoring sessions with ease.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Link href="/video-call" className="btn-primary">
                  Start Video Call
                </Link>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                <div className="bg-slate-900 rounded-lg h-64 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-white font-medium">Video Call Interface</p>
                    <p className="text-slate-400 text-sm">Connect with students instantly</p>
                  </div>
                </div>
                <div className="flex justify-center space-x-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="section-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Learn from Expert Videos
            </h2>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Access our curated collection of educational videos designed specifically for beginners. 
              Learn at your own pace with clear explanations and practical examples.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map((video, index) => (
              <div key={index} className="card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="relative mb-4">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg flex items-center justify-center">
                    <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-slate-900 ml-1" />
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-white mb-2 line-clamp-2">{video.title}</h3>
                <a 
                  href={video.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
                >
                  Watch Video
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-800 py-20 border-y border-blue-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl text-blue-200 mb-8">
            Join thousands of learners who are already mastering technology with KSR Learner. 
            Start with our beginner quizzes and work your way up to expert level.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quizzes" className="bg-white text-blue-900 hover:bg-slate-100 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
              Start Learning
            </Link>
            <Link href="/about" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
