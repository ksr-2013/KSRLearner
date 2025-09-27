'use client'

import Link from 'next/link'

export default function QuickActions() {
  const actions = [
    {
      title: 'Take a Quiz',
      description: 'Test your knowledge',
      icon: '📚',
      href: '/quizzes',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Typing Practice',
      description: 'Improve your speed',
      icon: '⚡',
      href: '/typing',
      color: 'purple',
      gradient: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Solve Puzzles',
      description: 'Challenge your mind',
      icon: '🧩',
      href: '/puzzles',
      color: 'orange',
      gradient: 'from-orange-500 to-orange-600'
    },
    {
      title: 'Generate Quiz',
      description: 'Create custom quizzes',
      icon: '🎯',
      href: '/quizzes/generator',
      color: 'green',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'View Scores',
      description: 'Check your progress',
      icon: '📊',
      href: '/scores',
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'AI Chat',
      description: 'Get help from AI',
      icon: '🤖',
      href: '#',
      color: 'pink',
      gradient: 'from-pink-500 to-pink-600',
      onClick: () => {
        // Trigger AI chatbot by finding the chat button
        const chatButton = document.querySelector('button[title="Chat with AI Assistant"]') as HTMLElement
        if (chatButton) {
          chatButton.click()
        } else {
          // Fallback: scroll to bottom where the chat button should be
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
        }
      }
    }
  ]

  return (
    <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="mr-2">🚀</span>
        Quick Actions
      </h2>
      
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, index) => {
          if (action.onClick) {
            return (
              <button
                key={index}
                onClick={action.onClick}
                className="group flex items-center space-x-4 p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all duration-200 hover:scale-[1.02] w-full"
              >
                <div className={`text-2xl p-2 rounded-lg bg-gradient-to-r ${action.gradient} bg-opacity-20 group-hover:bg-opacity-30 transition-all`}>
                  {action.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white font-medium group-hover:text-blue-300 transition-colors">
                    {action.title}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {action.description}
                  </div>
                </div>
                <div className="text-slate-400 group-hover:text-white transition-colors">
                  →
                </div>
              </button>
            )
          } else {
            return (
              <Link
                key={index}
                href={action.href}
                className="group flex items-center space-x-4 p-4 rounded-lg bg-slate-700/50 hover:bg-slate-700 transition-all duration-200 hover:scale-[1.02] w-full"
              >
                <div className={`text-2xl p-2 rounded-lg bg-gradient-to-r ${action.gradient} bg-opacity-20 group-hover:bg-opacity-30 transition-all`}>
                  {action.icon}
                </div>
                <div className="flex-1 text-left">
                  <div className="text-white font-medium group-hover:text-blue-300 transition-colors">
                    {action.title}
                  </div>
                  <div className="text-slate-400 text-sm">
                    {action.description}
                  </div>
                </div>
                <div className="text-slate-400 group-hover:text-white transition-colors">
                  →
                </div>
              </Link>
            )
          }
        })}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg border border-blue-500/20">
        <div className="text-white font-medium mb-2">💡 Pro Tip</div>
        <div className="text-slate-300 text-sm">
          Complete daily activities to maintain your learning streak and unlock new achievements!
        </div>
      </div>
    </div>
  )
}
