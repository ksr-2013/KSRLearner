import Header from '../../components/Header'
import Footer from '../../components/Footer'
import { Users, Target, Award, Globe, Heart, Zap } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: Heart,
      title: 'Passion for Learning',
      description: 'We believe that learning should be exciting and engaging, not boring or intimidating.'
    },
    {
      icon: Target,
      title: 'Clear Goals',
      description: 'Every lesson and quiz is designed with specific learning objectives in mind.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'We foster a supportive environment where learners can grow together.'
    },
    {
      icon: Award,
      title: 'Quality Content',
      description: 'All our materials are carefully crafted by experts in technology education.'
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'We make technology education available to everyone, regardless of background.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously improve our platform with the latest educational technologies.'
    }
  ]

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'Chief Learning Officer',
      bio: 'Former computer science professor with 15+ years of experience in educational technology.',
      expertise: ['Computer Science', 'Educational Psychology', 'Curriculum Design']
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Head of Technology',
      bio: 'Full-stack developer and tech enthusiast passionate about making complex concepts simple.',
      expertise: ['Software Development', 'System Architecture', 'User Experience']
    },
    {
      name: 'Emily Watson',
      role: 'Content Director',
      bio: 'Educational content creator with expertise in making technical topics engaging for all ages.',
      expertise: ['Content Creation', 'Instructional Design', 'Digital Media']
    },
    {
      name: 'David Kim',
      role: 'Learning Experience Designer',
      bio: 'Specialist in creating interactive learning experiences that maximize engagement and retention.',
      expertise: ['UX Design', 'Gamification', 'Learning Analytics']
    }
  ]

  const milestones = [
    {
      year: '2020',
      title: 'Foundation',
      description: 'KSR Learner was founded with a mission to democratize technology education.'
    },
    {
      year: '2021',
      title: 'First 1000 Users',
      description: 'Reached our first milestone of 1000 active learners on the platform.'
    },
    {
      year: '2022',
      title: 'Mobile App Launch',
      description: 'Launched our mobile application to reach learners on all devices.'
    },
    {
      year: '2023',
      title: 'AI-Powered Learning',
      description: 'Integrated artificial intelligence to provide personalized learning experiences.'
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Expanded to serve learners in over 50 countries worldwide.'
    },
    {
      year: '2025',
      title: 'Future Vision',
      description: 'Continuing to innovate and expand our learning ecosystem.'
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
                <div className="w-24 h-24 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 opacity-30 blur-2xl"></div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              About <span className="gradient-text">KSR Learner</span>
            </h1>
            
            <p className="text-xl text-dark-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to make technology education accessible, engaging, and effective for everyone. 
              Our platform combines cutting-edge technology with proven learning methodologies to create an 
              experience that truly helps learners grow.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Our <span className="gradient-text">Mission</span>
              </h2>
              <p className="text-lg text-dark-300 mb-6 leading-relaxed">
                At KSR Learner, we believe that everyone deserves access to quality technology education. 
                Whether you're a complete beginner or an experienced professional, our platform is designed 
                to meet you where you are and help you reach your goals.
              </p>
              <p className="text-lg text-dark-300 mb-6 leading-relaxed">
                We combine interactive learning tools, expert-curated content, and adaptive technology to 
                create a personalized learning experience that adapts to your pace and style. Our goal is 
                to make complex technical concepts simple and engaging.
              </p>
              <p className="text-lg text-dark-300 leading-relaxed">
                Through our quizzes, puzzles, and comprehensive learning materials, we're building a 
                community of lifelong learners who are excited about technology and empowered to use it 
                to solve real-world problems.
              </p>
            </div>
            
            <div className="relative">
              <div className="card p-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">What We Believe</h3>
                  <ul className="text-left space-y-3">
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-dark-300">Learning should be fun and engaging</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-dark-300">Everyone can learn technology</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-dark-300">Practice makes perfect</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-dark-300">Community support accelerates learning</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-dark-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our <span className="gradient-text">Values</span>
            </h2>
            <p className="text-xl text-dark-300 max-w-2xl mx-auto">
              These core values guide everything we do and shape the learning experience we provide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="card group hover:border-primary-500/50">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-dark-300 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meet Our <span className="gradient-text">Team</span>
            </h2>
            <p className="text-xl text-dark-300 max-w-2xl mx-auto">
              Our diverse team of experts is passionate about education and technology, working together 
              to create the best learning experience possible.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <div key={index} className="card group hover:border-primary-500/50">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                    <p className="text-primary-400 font-medium mb-3">{member.role}</p>
                    <p className="text-dark-300 mb-4 leading-relaxed">{member.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className="px-3 py-1 bg-dark-700 rounded-full text-xs text-dark-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="py-20 bg-dark-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Our <span className="gradient-text">Journey</span>
            </h2>
            <p className="text-xl text-dark-300 max-w-2xl mx-auto">
              From humble beginnings to serving learners worldwide, here are the key milestones in our story.
            </p>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gradient-to-b from-primary-500 to-accent-500"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Timeline Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full border-4 border-dark-800"></div>
                  
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="card">
                      <div className="text-2xl font-bold text-primary-400 mb-2">{milestone.year}</div>
                      <h3 className="text-xl font-semibold text-white mb-2">{milestone.title}</h3>
                      <p className="text-dark-300">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join Our <span className="gradient-text">Learning Community</span>
          </h2>
          <p className="text-xl text-dark-300 mb-8">
            Ready to start your technology learning journey? Join thousands of learners who are already 
            building their skills with KSR Learner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/quizzes" className="btn-primary">
              Start Learning
            </a>
            <a href="/contact" className="btn-secondary">
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
