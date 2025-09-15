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
    // Convert current messages into provider-agnostic history excluding the latest user turn
    // Roles: 'user' | 'assistant'. The Gemini API maps non-'user' to 'model'.
    const history = messages
      .filter((m) => {
        // Drop the very last message if it matches the latest user message to avoid duplication
        // This assumes handleSendMessage added it just before calling getBotResponse
        return !(m.isUser && m.text === latestUserMessage)
      })
      .map((m) => ({
        role: m.isUser ? 'user' : 'assistant',
        content: m.text,
      }))
    return history
  }

  const getBotResponse = async (userMessage: string): Promise<void> => {
    setIsTyping(true)
    setErrorText(null)
    
    try {
      const conversationHistory = buildConversationHistory(userMessage)

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory,
        }),
      })

      if (response.ok) {
        // Gemini returns JSON { response: string }, OpenAI SSE route streams; but also returns fallback JSON on error
        // Try JSON first; if not JSON, fall back to text
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

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-96 h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-200 z-[2147483646] flex flex-col overflow-hidden"
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
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inline status / error */}
            {errorText && (
              <div className="px-4 py-2 bg-yellow-50 text-yellow-800 text-xs border-b border-yellow-200">
                {errorText}
              </div>
            )}

            {/* Quick prompts */}
            <div className="px-4 pt-3 pb-2 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {quickPrompts.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSendMessage(q)}
                    disabled={isTyping}
                    className="text-xs px-2.5 py-1.5 rounded-full border border-gray-300 hover:border-blue-500 hover:text-blue-700 disabled:opacity-50"
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
                        ? 'bg-blue-800 text-white'
                        : 'bg-gray-100 text-black'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {!message.isUser && <Bot className="w-4 h-4 mt-1 flex-shrink-0" />}
                      {message.isUser && <User className="w-4 h-4 mt-1 flex-shrink-0" />}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap text-black">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1 text-black">
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
                  <div className="bg-gray-100 text-black p-3 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Type your message... (${provider === 'openai' ? 'OpenAI' : provider === 'groq' ? 'Groq' : 'Gemini'})`}
                  className="flex-1 px-3 py-2 border border-blue-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-700 bg-white text-black placeholder:text-slate-500"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="w-4 h-4" />
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
