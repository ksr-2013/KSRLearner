'use client'

import { useState } from 'react'
import Header from '../../../../components/Header'
import Footer from '../../../../components/Footer'
import SaveScore from '../../../../components/SaveScore'
import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Trophy, Zap } from 'lucide-react'

export default function LegendQuiz2() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])

  const questions = [
    {
      question: "What is the purpose of BGP (Border Gateway Protocol)?",
      options: [
        "To route traffic within a local network",
        "To exchange routing information between autonomous systems on the internet",
        "To encrypt network traffic",
        "To manage IP addresses"
      ],
      correct: 1,
      explanation: "BGP is the protocol used to exchange routing information between autonomous systems, making it the backbone of internet routing."
    },
    {
      question: "What is a VLAN (Virtual Local Area Network)?",
      options: [
        "A type of wireless network",
        "A logical grouping of network devices that behave as if they are on the same physical network",
        "A virtual private network",
        "A type of router"
      ],
      correct: 1,
      explanation: "VLANs allow network administrators to logically segment a network into separate broadcast domains, improving security and performance."
    },
    {
      question: "What is the purpose of STP (Spanning Tree Protocol)?",
      options: [
        "To create network loops",
        "To prevent network loops by creating a loop-free topology",
        "To speed up network traffic",
        "To encrypt network data"
      ],
      correct: 1,
      explanation: "STP prevents network loops by creating a loop-free topology, ensuring network stability and preventing broadcast storms."
    },
    {
      question: "What is QoS (Quality of Service) in networking?",
      options: [
        "A type of network cable",
        "A mechanism to prioritize certain types of network traffic over others",
        "A network security protocol",
        "A type of network switch"
      ],
      correct: 1,
      explanation: "QoS allows network administrators to prioritize certain types of traffic, ensuring critical applications receive the bandwidth they need."
    },
    {
      question: "What is the purpose of a subnet mask?",
      options: [
        "To hide network addresses",
        "To determine which portion of an IP address belongs to the network and which belongs to the host",
        "To encrypt network traffic",
        "To connect to the internet"
      ],
      correct: 1,
      explanation: "A subnet mask is used to divide an IP address into network and host portions, enabling proper routing and network segmentation."
    },
    {
      question: "What is MPLS (Multiprotocol Label Switching)?",
      options: [
        "A type of network cable",
        "A routing technique that directs data from one node to the next based on short path labels",
        "A network security protocol",
        "A type of wireless technology"
      ],
      correct: 1,
      explanation: "MPLS uses labels to make forwarding decisions, enabling faster packet forwarding and traffic engineering capabilities."
    },
    {
      question: "What is the purpose of OSPF (Open Shortest Path First)?",
      options: [
        "To create network loops",
        "To find the shortest path between network nodes using link-state routing",
        "To encrypt network traffic",
        "To manage IP addresses"
      ],
      correct: 1,
      explanation: "OSPF is a link-state routing protocol that finds the shortest path between network nodes by building a complete network topology."
    },
    {
      question: "What is a DMZ (Demilitarized Zone) in network security?",
      options: [
        "A type of firewall",
        "A network segment that contains and exposes external-facing services to the internet",
        "A type of router",
        "A network cable"
      ],
      correct: 1,
      explanation: "A DMZ is a network segment that contains external-facing services, providing an additional layer of security between the internet and internal networks."
    },
    {
      question: "What is the purpose of NAT (Network Address Translation)?",
      options: [
        "To create new IP addresses",
        "To translate private IP addresses to public IP addresses for internet communication",
        "To encrypt network traffic",
        "To route network traffic"
      ],
      correct: 1,
      explanation: "NAT allows multiple devices with private IP addresses to share a single public IP address, enabling internet connectivity while conserving public IP addresses."
    },
    {
      question: "What is a proxy server?",
      options: [
        "A type of network cable",
        "An intermediary server that acts on behalf of clients when making requests to other servers",
        "A type of router",
        "A network security device"
      ],
      correct: 1,
      explanation: "A proxy server acts as an intermediary, forwarding client requests to other servers and returning responses, providing caching, security, and anonymity benefits."
    }
  ]

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswers[currentQuestion] !== undefined) return
    
    const newSelectedAnswers = [...selectedAnswers]
    newSelectedAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newSelectedAnswers)

    if (answerIndex === questions[currentQuestion].correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowResults(true)
    }
  }

  const handleRestart = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResults(false)
    setSelectedAnswers([])
  }

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 80) return 'text-emerald-400'
    if (percentage >= 60) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100
    if (percentage >= 80) return 'Legendary! You have exceptional networking knowledge!'
    if (percentage >= 60) return 'Impressive! You\'re well on your way to becoming a legend!'
    return 'Keep studying! These advanced concepts require deep understanding!'
  }

  if (showResults) {
    return (
      <div className="min-h-screen">
        <Header />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-4">Quiz Complete!</h1>
              <p className="text-xl text-dark-300">Here are your results:</p>
            </div>

            <div className="card max-w-md mx-auto mb-8">
              <div className={`text-6xl font-bold mb-4 ${getScoreColor()}`}>
                {score}/{questions.length}
              </div>
              <div className="text-2xl font-semibold text-white mb-2">
                {Math.round((score / questions.length) * 100)}%
              </div>
              <p className="text-dark-300">{getScoreMessage()}</p>
            </div>

            <div className="max-w-md mx-auto mb-8">
              <SaveScore
                type="quiz"
                title="Legendary Computer Mastery Quiz 2"
                score={Math.round((score / questions.length) * 100)}
                level="Legend"
                completed={true}
                details={{
                  correctAnswers: score,
                  totalQuestions: questions.length,
                  quizType: 'legend'
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button onClick={handleRestart} className="btn-primary">
                Try Again
              </button>
              <Link href="/quizzes/legend" className="btn-secondary">
                Back to Legend Quizzes
              </Link>
            </div>

            <div className="text-left max-w-2xl mx-auto">
              <h3 className="text-xl font-semibold text-white mb-4">Question Review:</h3>
              {questions.map((q, index) => (
                <div key={index} className="mb-4 p-4 bg-dark-800/50 rounded-lg border border-dark-600">
                  <div className="flex items-start space-x-3">
                    {selectedAnswers[index] === q.correct ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-medium mb-2">{q.question}</p>
                      <p className="text-sm text-dark-300 mb-2">
                        Your answer: {q.options[selectedAnswers[index]]}
                      </p>
                      {selectedAnswers[index] !== q.correct && (
                        <p className="text-sm text-emerald-400">
                          Correct answer: {q.options[q.correct]}
                        </p>
                      )}
                      <p className="text-xs text-dark-400 mt-2">{q.explanation}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const isAnswered = selectedAnswers[currentQuestion] !== undefined

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Progress Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/quizzes/legend" className="flex items-center text-primary-400 hover:text-primary-300 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Legend Quizzes
          </Link>
          <div className="text-right">
            <div className="text-sm text-dark-400">Question {currentQuestion + 1} of {questions.length}</div>
            <div className="text-lg font-semibold text-white">Score: {score}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-dark-700 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Question Card */}
        <div className="card mb-8">
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Zap className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-dark-400">Legend Level - Quiz 2</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">{currentQ.question}</h2>
          </div>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
                className={`w-full p-4 text-left rounded-lg border transition-all duration-200 ${
                  selectedAnswers[currentQuestion] === index
                    ? index === currentQ.correct
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-red-500 bg-red-500/10 text-red-400'
                    : selectedAnswers[currentQuestion] !== undefined && index === currentQ.correct
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-dark-600 hover:border-purple-500/50 hover:bg-dark-700/50 text-dark-300 hover:text-white'
                } ${isAnswered ? 'cursor-default' : 'cursor-pointer'}`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    selectedAnswers[currentQuestion] === index
                      ? index === currentQ.correct
                        ? 'border-emerald-500 bg-emerald-500'
                        : 'border-red-500 bg-red-500'
                      : 'border-dark-400'
                  }`}>
                    {selectedAnswers[currentQuestion] === index && (
                      index === currentQ.correct ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <XCircle className="w-4 h-4 text-white" />
                      )
                    )}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {isAnswered && (
            <div className="mt-6 p-4 bg-dark-700/50 rounded-lg border border-dark-600">
              <h4 className="text-sm font-semibold text-purple-400 mb-2">Explanation:</h4>
              <p className="text-dark-300 text-sm">{currentQ.explanation}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <button
            onClick={handleNext}
            disabled={!isAnswered}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
