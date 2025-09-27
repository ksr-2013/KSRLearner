'use client'

import Link from 'next/link'

interface LearningPathProps {
  level: string
}

export default function LearningPath({ level }: LearningPathProps) {
  const learningSteps = [
    {
      id: 'beginner',
      title: 'Beginner',
      description: 'Learn the basics of computer science',
      icon: '🌱',
      color: 'green',
      completed: level === 'Beginner' || level === 'Pro' || level === 'Legend' || level === 'Ultra Legend',
      current: level === 'Beginner',
      href: '/quizzes/beginner'
    },
    {
      id: 'pro',
      title: 'Pro',
      description: 'Intermediate concepts and applications',
      icon: '🚀',
      color: 'blue',
      completed: level === 'Pro' || level === 'Legend' || level === 'Ultra Legend',
      current: level === 'Pro',
      href: '/quizzes/pro'
    },
    {
      id: 'legend',
      title: 'Legend',
      description: 'Advanced topics and problem solving',
      icon: '⭐',
      color: 'purple',
      completed: level === 'Legend' || level === 'Ultra Legend',
      current: level === 'Legend',
      href: '/quizzes/legend'
    },
    {
      id: 'ultra-legend',
      title: 'Ultra Legend',
      description: 'Master level expertise and innovation',
      icon: '👑',
      color: 'yellow',
      completed: level === 'Ultra Legend',
      current: level === 'Ultra Legend',
      href: '/quizzes/ultra-legend'
    }
  ]

  const getStepColor = (color: string, completed: boolean, current: boolean) => {
    if (completed) return 'text-green-400'
    if (current) return 'text-blue-400'
    return 'text-slate-400'
  }

  const getStepBgColor = (color: string, completed: boolean, current: boolean) => {
    if (completed) return 'bg-green-500/20 border-green-500/30'
    if (current) return 'bg-blue-500/20 border-blue-500/30'
    return 'bg-slate-700/50 border-slate-600'
  }

  const getProgressPercentage = () => {
    const completedSteps = learningSteps.filter(step => step.completed).length
    return (completedSteps / learningSteps.length) * 100
  }

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white flex items-center">
          <span className="mr-2">🎓</span>
          Learning Path
        </h2>
        <div className="text-sm text-slate-400">
          {Math.round(getProgressPercentage())}% Complete
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Learning Steps */}
      <div className="space-y-4">
        {learningSteps.map((step, index) => (
          <Link
            key={step.id}
            href={step.href}
            className={`block p-4 rounded-lg border transition-all duration-200 hover:scale-[1.02] ${
              step.completed 
                ? 'hover:border-green-400/50' 
                : step.current 
                  ? 'hover:border-blue-400/50'
                  : 'hover:border-slate-500'
            } ${getStepBgColor(step.color, step.completed, step.current)}`}
          >
            <div className="flex items-center space-x-4">
              {/* Step Number */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step.completed 
                  ? 'bg-green-500 text-white' 
                  : step.current 
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-600 text-slate-300'
              }`}>
                {step.completed ? '✓' : index + 1}
              </div>

              {/* Step Icon */}
              <div className="text-2xl">{step.icon}</div>

              {/* Step Content */}
              <div className="flex-1">
                <div className={`font-semibold ${getStepColor(step.color, step.completed, step.current)}`}>
                  {step.title}
                </div>
                <div className="text-slate-400 text-sm">
                  {step.description}
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center space-x-2">
                {step.completed && (
                  <div className="text-green-400 text-sm font-medium">
                    Completed
                  </div>
                )}
                {step.current && !step.completed && (
                  <div className="text-blue-400 text-sm font-medium">
                    Current
                  </div>
                )}
                {!step.completed && !step.current && (
                  <div className="text-slate-500 text-sm">
                    Locked
                  </div>
                )}
                <div className="text-slate-400">→</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Next Steps */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/20">
        <div className="text-white font-medium mb-2">🎯 Next Steps</div>
        <div className="text-slate-300 text-sm">
          {level === 'Beginner' && "Complete more beginner quizzes to unlock the Pro level!"}
          {level === 'Pro' && "Master pro-level concepts to advance to Legend status!"}
          {level === 'Legend' && "Solve complex problems to reach Ultra Legend level!"}
          {level === 'Ultra Legend' && "Congratulations! You've mastered all levels. Keep learning and teaching others!"}
        </div>
      </div>
    </div>
  )
}
