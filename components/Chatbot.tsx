'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, User, BookOpen, Target, Trophy, Brain, HelpCircle, Home, ChevronRight, Copy, ThumbsUp, ThumbsDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  type?: 'text' | 'quick_reply' | 'suggestion'
  suggestions?: string[]
  isStreaming?: boolean
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm KSR Learner's AI assistant. I can help you with learning questions, guide you through our platform, or answer any questions about technology topics. How can I assist you today?",
      isUser: false,
      timestamp: new Date(),
      suggestions: [
        "What can I learn here?",
        "How do I start a quiz?",
        "Tell me about typing practice",
        "What are the different difficulty levels?"
      ]
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [showNotification, setShowNotification] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const quickReplies = [
    { icon: BookOpen, text: "Learning Topics", action: "What topics can I learn about?" },
    { icon: Target, text: "Start Quiz", action: "How do I start a quiz?" },
    { icon: Trophy, text: "Achievements", action: "Tell me about achievements" },
    { icon: Brain, text: "Puzzles", action: "What puzzles are available?" },
    { icon: HelpCircle, text: "Help", action: "I need help with the platform" }
  ]

  const getIntelligentFallbackResponse = (message: string): string => {
    const msg = message.toLowerCase()
    
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return "Hello! Welcome to KSR Learner! I'm excited to help you on your learning journey. What would you like to explore today?"
    }
    
    if (msg.includes('learn') || msg.includes('topic') || msg.includes('subject')) {
      return "Great question! KSR Learner offers comprehensive learning in computer basics, programming, networking, digital security, cloud computing, and AI. You can start with our beginner quizzes and progress to expert level. Would you like me to guide you to a specific topic?"
    }
    
    if (msg.includes('quiz') || msg.includes('test') || msg.includes('start')) {
      return "Perfect! You can choose from Beginner, Pro, Legend, or Ultra Legend levels. Each level has multiple quizzes to help you learn and track your progress. Which level interests you most?"
    }
    
    if (msg.includes('typing') || msg.includes('keyboard') || msg.includes('practice')) {
      return "Excellent choice! Our typing practice includes Practice Mode for learning at your own pace, Speed Tests for challenges, and Progress Tracking for monitoring improvement. Would you like me to show you the typing section?"
    }
    
    if (msg.includes('help') || msg.includes('support') || msg.includes('stuck')) {
      return "I'm here to help! I can assist with learning guidance, platform navigation, technical support, study tips, and progress tracking. What specific help do you need?"
    }
    
    if (msg.includes('programming') || msg.includes('coding') || msg.includes('code')) {
      return "Programming is a great skill to learn! KSR Learner offers programming basics, coding challenges, and interactive exercises. Start with our beginner level to learn fundamental concepts, then progress to more advanced topics."
    }
    
    if (msg.includes('network') || msg.includes('internet') || msg.includes('web')) {
      return "Networking is essential in today's digital world! Learn about how the internet works, network protocols, security, and more. Our networking section covers everything from basics to advanced concepts."
    }
    
    if (msg.includes('security') || msg.includes('cyber') || msg.includes('safe')) {
      return "Digital security is crucial! Learn about online safety, cybersecurity basics, password security, and how to protect yourself online. Our security section will help you stay safe in the digital world."
    }
    
    return "That's an interesting question! While I'm designed to help with learning topics, platform navigation, and general support, I might not have all the answers. Feel free to ask me about learning topics, quizzes, or platform navigation!"
  }

  const getBotResponse = async (userMessage: string): Promise<void> => {
    try {
      // Prepare conversation history for context
      const conversationHistory = messages
        .filter(msg => msg.id !== '1') // Exclude the initial welcome message
        .slice(-10) // Keep last 10 messages for context
        .map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        }))

      // Try Gemini first (free), fallback to OpenAI if needed
      let response = await fetch('/api/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory
        }),
      })

      // If Gemini fails, try OpenAI as fallback
      if (!response.ok) {
        response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: userMessage,
            conversationHistory: conversationHistory
          }),
        })
      }

      if (!response.ok) {
        throw new Error('API request failed')
      }

      // Check if it's a streaming response (OpenAI) or regular response (Gemini)
      const contentType = response.headers.get('content-type')
      
      if (contentType?.includes('text/event-stream')) {
        // Handle OpenAI streaming response
        const botMessageId = (Date.now() + 1).toString()
        const botMessage: Message = {
          id: botMessageId,
          text: '',
          isUser: false,
          timestamp: new Date(),
          isStreaming: true
        }

        setMessages(prev => [...prev, botMessage])

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()

        if (reader) {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break

            const chunk = decoder.decode(value)
            const lines = chunk.split('\n')

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6)
                if (data === '[DONE]') {
                  setMessages(prev => 
                    prev.map(msg => 
                      msg.id === botMessageId 
                        ? { ...msg, isStreaming: false }
                        : msg
                    )
                  )
                  setIsTyping(false)
                  return
                }

                try {
                  const parsed = JSON.parse(data)
                  if (parsed.content) {
                    setMessages(prev => 
                      prev.map(msg => 
                        msg.id === botMessageId 
                          ? { ...msg, text: msg.text + parsed.content }
                          : msg
                      )
                    )
                  }
                } catch (e) {
                  // Ignore parsing errors
                }
              }
            }
          }
        }
      } else {
        // Handle Gemini regular response
        const data = await response.json()
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response || "Sorry, I couldn't process your request right now. Please try again!",
          isUser: false,
          timestamp: new Date()
        }
        
        setMessages(prev => [...prev, botMessage])
        setIsTyping(false)
      }

    } catch (error) {
      console.error('Chat API error:', error)
      
      // Enhanced fallback system with comprehensive responses
      const message = userMessage.toLowerCase()
      let fallbackResponse = getIntelligentFallbackResponse(message)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: fallbackResponse,
        isUser: false,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
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
    setIsTyping(true)

    await getBotResponse(text)
  }

  const handleQuickReply = (action: string) => {
    handleSendMessage(action)
  }

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Chatbot Anchor */}
      <div id="chatbot" className="fixed bottom-0 right-0 w-0 h-0"></div>
      
      {/* Notification Bubble */}
      {showNotification && !isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          className="fixed bottom-24 right-6 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-[9999] max-w-xs"
        >
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4" />
            <span className="text-sm font-medium">Need help? Chat with me!</span>
            <button
              onClick={() => setShowNotification(false)}
              className="text-blue-200 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Chat Button */}
      <motion.button
        onClick={() => {
          setIsOpen(true)
          setShowNotification(false)
        }}
        className="fixed bottom-6 right-6 w-20 h-20 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-200 flex items-center justify-center z-[99999] border-4 border-white/30 animate-pulse"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1 }}
        title="Chat with KSR Learner Assistant - Click to open!"
      >
        <MessageCircle className="w-8 h-8" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-bounce">
          AI
        </div>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-slate-800 rounded-2xl shadow-2xl border border-slate-700 z-[9998] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold">KSR Learner Assistant</h3>
                    <p className="text-sm text-blue-100">Online now</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.isUser 
                        ? 'bg-blue-600' 
                        : 'bg-slate-600'
                    }`}>
                      {message.isUser ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <Bot className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className={`rounded-2xl px-4 py-3 ${
                      message.isUser
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-100'
                    }`}>
                      <p className="text-sm whitespace-pre-line">
                        {message.text}
                        {message.isStreaming && (
                          <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse"></span>
                        )}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className={`text-xs ${
                          message.isUser ? 'text-blue-100' : 'text-slate-400'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                        {!message.isUser && !message.isStreaming && (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => copyToClipboard(message.text)}
                              className="p-1 hover:bg-slate-600 rounded transition-colors"
                              title="Copy"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              className="p-1 hover:bg-slate-600 rounded transition-colors"
                              title="Like"
                            >
                              <ThumbsUp className="w-3 h-3" />
                            </button>
                            <button
                              className="p-1 hover:bg-slate-600 rounded transition-colors"
                              title="Dislike"
                            >
                              <ThumbsDown className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {/* Suggestions */}
              {messages[messages.length - 1]?.suggestions && (
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">Quick suggestions:</p>
                  <div className="flex flex-wrap gap-2">
                    {messages[messages.length - 1].suggestions?.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-full transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-start space-x-2"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-700 rounded-2xl px-4 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            <div className="p-4 border-t border-slate-700">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {quickReplies.map((reply, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickReply(reply.action)}
                    className="flex items-center space-x-2 p-2 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm rounded-lg transition-colors"
                  >
                    <reply.icon className="w-4 h-4" />
                    <span className="truncate">{reply.text}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-700">
              <div className="flex space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputValue)}
                  placeholder="Ask me anything about learning..."
                  className="flex-1 bg-slate-700 text-slate-100 placeholder-slate-400 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isTyping}
                />
                <button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  className="p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
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

export default Chatbot