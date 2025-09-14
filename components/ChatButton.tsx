'use client'

import { MessageCircle } from 'lucide-react'

export default function ChatButton() {
  const handleChatClick = () => {
    // Scroll to bottom and trigger chatbot
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    setTimeout(() => {
      const chatButton = document.querySelector('[title*="Chat with KSR Learner Assistant"]') as HTMLButtonElement
      if (chatButton) chatButton.click()
    }, 1000)
  }

  return (
    <button 
      onClick={handleChatClick}
      className="bg-white text-blue-900 hover:bg-slate-100 font-semibold py-3 px-8 rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center"
    >
      <MessageCircle className="w-5 h-5 mr-2" />
      Chat with AI Assistant
    </button>
  )
}
