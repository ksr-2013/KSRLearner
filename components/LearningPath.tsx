'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Lock, Star, Trophy, Crown, Zap } from 'lucide-react'

interface LearningPathProps {
  level: string
  userStats?: {
    totalQuizzes: number
    averageScore: number
    streak: number
  }
}

interface LearningStep {
  id: string
  title: string
  description: string
  icon: string
  color: string
  completed: boolean
  current: boolean
  locked: boolean
  href: string
  requiredScore?: number
  requiredQuizzes?: number
  progress?: number
}

export default function LearningPath({ level, userStats }: LearningPathProps) {
  const [learningSteps, setLearningSteps] = useState<LearningStep[]>([])
  const [userProgress, setUserProgress] = useState({
    beginner: 0,
    pro: 0,
    legend: 0,
    ultraLegend: 0
  })

  useEffect(() => {
    // Fetch learning progress from API
    const fetchLearningProgress = async () => {
      try {
        const response = await fetch('/api/learning-progress', {
          headers: {
            'authorization': `Bearer ${localStorage.getItem('supabase.auth.token') || ''}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setUserProgress({
            beginner: data.progress.beginner,
            pro: data.progress.pro,
            legend: data.progress.legend,
            ultraLegend: data.progress.ultraLegend
          })
        } else {
          // Fallback to basic calculation
          const progress = {
            beginner: 0,
            pro: 0,
            legend: 0,
            ultraLegend: 0
          }

          if (level === 'Beginner' || level === 'Pro' || level === 'Legend' || level === 'Ultra Legend') {
            progress.beginner = 100
          }
          if (level === 'Pro' || level === 'Legend' || level === 'Ultra Legend') {
            progress.pro = 100
          }
          if (level === 'Legend' || level === 'Ultra Legend') {
            progress.legend = 100
          }
          if (level === 'Ultra Legend') {
            progress.ultraLegend = 100
          }

          setUserProgress(progress)
        }
      } catch (error) {
        console.error('Failed to fetch learning progress:', error)
        // Fallback to basic calculation
        const progress = {
          beginner: level === 'Beginner' || level === 'Pro' || level === 'Legend' || level === 'Ultra Legend' ? 100 : 0,
          pro: level === 'Pro' || level === 'Legend' || level === 'Ultra Legend' ? 100 : 0,
          legend: level === 'Legend' || level === 'Ultra Legend' ? 100 : 0,
          ultraLegend: level === 'Ultra Legend' ? 100 : 0
        }
        setUserProgress(progress)
      }
    }

    fetchLearningProgress()
  }, [level, userStats])

  useEffect(() => {
    const steps: LearningStep[] = [
      {
        id: 'beginner',
        title: 'Beginner',
        description: 'Learn the basics of computer science',
        icon: '🌱',
        color: 'green',
        completed: level === 'Beginner' || level === 'Pro' || level === 'Legend' || level === 'Ultra Legend',
        current: level === 'Beginner',
        locked: false,
        href: '/quizzes/beginner',
        requiredScore: 0,
        requiredQuizzes: 0,
        progress: userProgress.beginner
      },
      {
        id: 'pro',
        title: 'Pro',
        description: 'Intermediate concepts and applications',
        icon: '🚀',
        color: 'blue',
        completed: level === 'Pro' || level === 'Legend' || level === 'Ultra Legend',
        current: level === 'Pro',
        locked: !(level === 'Pro' || level === 'Legend' || level === 'Ultra Legend') && (userStats?.averageScore || 0) < 60,
        href: '/quizzes/pro',
        requiredScore: 60,
        requiredQuizzes: 3,
        progress: userProgress.pro
      },
      {
        id: 'legend',
        title: 'Legend',
        description: 'Advanced topics and problem solving',
        icon: '⭐',
        color: 'purple',
        completed: level === 'Legend' || level === 'Ultra Legend',
        current: level === 'Legend',
        locked: !(level === 'Legend' || level === 'Ultra Legend') && ((userStats?.averageScore || 0) < 70 || (userStats?.totalQuizzes || 0) < 5),
        href: '/quizzes/legend',
        requiredScore: 70,
        requiredQuizzes: 5,
        progress: userProgress.legend
      },
      {
        id: 'ultra-legend',
        title: 'Ultra Legend',
        description: 'Master level expertise and innovation',
        icon: '👑',
        color: 'yellow',
        completed: level === 'Ultra Legend',
        current: level === 'Ultra Legend',
        locked: level !== 'Ultra Legend' && ((userStats?.averageScore || 0) < 85 || (userStats?.totalQuizzes || 0) < 10),
        href: '/quizzes/ultra-legend',
        requiredScore: 85,
        requiredQuizzes: 10,
        progress: userProgress.ultraLegend
      }
    ]

    setLearningSteps(steps)
  }, [level, userStats, userProgress])

  const getStepColor = (color: string, completed: boolean, current: boolean, locked: boolean) => {
    if (completed) return 'text-green-400'
    if (current) return 'text-blue-400'
    if (locked) return 'text-slate-500'
    return 'text-slate-400'
  }

  const getStepBgColor = (color: string, completed: boolean, current: boolean, locked: boolean) => {
    if (completed) return 'bg-green-500/20 border-green-500/30'
    if (current) return 'bg-blue-500/20 border-blue-500/30'
    if (locked) return 'bg-slate-800/50 border-slate-700'
    return 'bg-slate-700/50 border-slate-600'
  }

  const getStepIcon = (step: LearningStep) => {
    if (step.completed) return <CheckCircle className="w-5 h-5 text-green-400" />
    if (step.locked) return <Lock className="w-5 h-5 text-slate-500" />
    if (step.current) return <Star className="w-5 h-5 text-blue-400" />
    return <div className="w-5 h-5 rounded-full bg-slate-600" />
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
        {learningSteps.map((step, index) => {
          const StepComponent = step.locked ? 'div' : Link
          const stepProps = step.locked ? {} : { href: step.href }
          
          return (
            <StepComponent
              key={step.id}
              {...stepProps}
              className={`block p-4 rounded-lg border transition-all duration-200 ${
                step.locked 
                  ? 'cursor-not-allowed opacity-60' 
                  : 'hover:scale-[1.02] cursor-pointer'
              } ${
                step.completed 
                  ? 'hover:border-green-400/50' 
                  : step.current 
                    ? 'hover:border-blue-400/50'
                    : 'hover:border-slate-500'
              } ${getStepBgColor(step.color, step.completed, step.current, step.locked)}`}
            >
              <div className="flex items-center space-x-4">
                {/* Step Number */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step.completed 
                    ? 'bg-green-500 text-white' 
                    : step.current 
                      ? 'bg-blue-500 text-white'
                      : step.locked
                        ? 'bg-slate-700 text-slate-500'
                        : 'bg-slate-600 text-slate-300'
                }`}>
                  {step.completed ? '✓' : index + 1}
                </div>

                {/* Step Icon */}
                <div className="text-2xl">{step.icon}</div>

                {/* Step Content */}
                <div className="flex-1">
                  <div className={`font-semibold ${getStepColor(step.color, step.completed, step.current, step.locked)}`}>
                    {step.title}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {step.description}
                  </div>
                  
                  {/* Requirements */}
                  {step.locked && (
                    <div className="mt-2 text-xs text-slate-500">
                      {step.requiredScore && `Requires ${step.requiredScore}% average score`}
                      {step.requiredQuizzes && ` • ${step.requiredQuizzes} quizzes completed`}
                    </div>
                  )}
                  
                  {/* Progress Bar for Current Level */}
                  {step.current && !step.completed && step.progress !== undefined && (
                    <div className="mt-2">
                      <div className="w-full bg-slate-700 rounded-full h-1.5">
                        <div 
                          className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300"
                          style={{ width: `${step.progress}%` }}
                        />
                      </div>
                      <div className="text-xs text-slate-400 mt-1">
                        {step.progress}% Complete
                      </div>
                    </div>
                  )}
                </div>

                {/* Status Indicator */}
                <div className="flex items-center space-x-2">
                  {step.completed && (
                    <div className="text-green-400 text-sm font-medium flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Completed
                    </div>
                  )}
                  {step.current && !step.completed && (
                    <div className="text-blue-400 text-sm font-medium flex items-center">
                      <Star className="w-4 h-4 mr-1" />
                      Current
                    </div>
                  )}
                  {step.locked && (
                    <div className="text-slate-500 text-sm flex items-center">
                      <Lock className="w-4 h-4 mr-1" />
                      Locked
                    </div>
                  )}
                  {!step.locked && (
                    <div className="text-slate-400">→</div>
                  )}
                </div>
              </div>
            </StepComponent>
          )
        })}
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
