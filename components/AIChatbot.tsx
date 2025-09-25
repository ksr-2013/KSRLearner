'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm KSR Learner's AI assistant. I can help you with learning questions, guide you through our platform, or answer any questions about technology topics. How can I assist you today?",
      isUser: false,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [errorText, setErrorText] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const provider = (process.env.NEXT_PUBLIC_AI_PROVIDER || 'groq').toLowerCase()
  const endpoint = provider === 'openai' ? '/api/chat' : provider === 'groq' ? '/api/groq-chat' : '/api/gemini-chat'

  const quickPrompts = [
    'Explain computer hardware vs software',
    'Recommend a beginner quiz to start with',
    'How do I improve typing speed?',
    'Suggest a learning path for networking',
  ]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const buildConversationHistory = (latestUserMessage: string) => {
    const history = messages
      .filter(m => !(m.isUser && m.text === latestUserMessage))
      .map(m => ({ role: m.isUser ? 'user' : 'assistant', content: m.text }))
    return history
  }

  const getBotResponse = async (userMessage: string): Promise<void> => {
    setIsTyping(true)
    setErrorText(null)
    
    try {
      const conversationHistory = buildConversationHistory(userMessage)
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage, conversationHistory }),
      })

      if (response.ok) {
        let botText = ''
        const contentType = response.headers.get('Content-Type') || ''
        if (contentType.includes('application/json')) {
        const data = await response.json()
          botText = data.response || data.content || ''
        } else {
          botText = await response.text()
        }

        const finalText = botText && typeof botText === 'string'
          ? botText
          : "Sorry, I couldn't process your request right now. Please try again!"
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: finalText,
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
      } else {
        let detail = ''
        try {
          const contentType = response.headers.get('Content-Type') || ''
          if (contentType.includes('application/json')) {
            const data = await response.json()
            detail = data.error || data.details || data.response || ''
          } else {
            detail = await response.text()
          }
        } catch {}
        const statusMsg = `Connection issue (status ${response.status}). ${detail ? `Details: ${detail}` : 'Using fallback.'}`
        setErrorText(statusMsg)
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "I'm having trouble connecting right now. Please try again in a moment!",
          isUser: false,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, botMessage])
      }
    } catch (error) {
      setErrorText('Network error. Please check your connection and try again.')
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again in a moment!",
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    await getBotResponse(text)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage(inputValue)
    }
  }


  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
      <motion.button
        onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-blue-800 hover:bg-blue-900 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-[2147483647]"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Chat with AI Assistant"
          aria-label="Chat with AI Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-3 left-3 sm:left-auto sm:right-6 w-[calc(100vw-24px)] sm:w-96 h-[560px] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 z-[2147483646] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-blue-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold">AI Assistant</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
                title="Close chat"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inline status / error */}
            {errorText && (
              <div className="px-4 py-2 bg-yellow-900/30 text-yellow-300 text-xs border-b border-yellow-800/50">
                {errorText}
              </div>
            )}

            {/* Quick prompts */}
            <div className="px-4 pt-3 pb-2 border-b border-slate-700 bg-slate-800">
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSendMessage(q)}
                    disabled={isTyping}
                    className="text-xs px-3 py-1.5 rounded-full border border-blue-500 text-blue-200 bg-blue-900/20 hover:bg-blue-900/40 hover:border-blue-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-slate-700 disabled:text-slate-400 disabled:border-slate-600"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.isUser
                        ? 'bg-blue-700 text-white'
                        : 'bg-slate-800 text-slate-100'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {!message.isUser && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                      {message.isUser && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-100 p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700 bg-slate-900">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Type your message... (${provider === 'openai' ? 'OpenAI' : provider === 'groq' ? 'Groq' : 'Gemini'})`}
                  className="flex-1 px-3 py-2 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-800 text-white placeholder:text-slate-400"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="w-12 h-12 rounded-full flex items-center justify-center shadow-sm transition bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                  title="Send message"
                  aria-label="Send"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </>
  )
}

export default AIChatbot


