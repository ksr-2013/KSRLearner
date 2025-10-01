'use client'

import { useState } from 'react'
import Header from '../../components/Header'
import Footer from '../../components/Footer'
import SaveScore from '../../components/SaveScore'
import AIPuzzleSolver from '../../components/AIPuzzleSolver'
import AIPuzzleGenerator from '../../components/AIPuzzleGenerator'
import { Puzzle, Lightbulb, Target, Brain, Sparkles, Trophy } from 'lucide-react'

export default function PuzzlesPage() {
  const [currentPuzzle, setCurrentPuzzle] = useState(0)
  const [showSolution, setShowSolution] = useState(false)
  const [completedPuzzles, setCompletedPuzzles] = useState<number[]>([])

  const puzzles = [
    {
      id: 1,
      title: "Tech Pattern Match",
      description: "Find the next item in the sequence: Computer → Laptop → Tablet → ?",
      type: "Pattern Recognition",
      difficulty: "Easy",
      solution: "Smartphone",
      explanation: "The pattern shows devices getting smaller and more portable. After tablet, the next logical step would be a smartphone.",
      hint: "Think about size and portability trends in technology."
    },
    {
      id: 2,
      title: "Binary Code Decoder",
      description: "Decode this binary number: 1010",
      type: "Binary Math",
      difficulty: "Medium",
      solution: "10",
      explanation: "In binary, 1010 = (1×2³) + (0×2²) + (1×2¹) + (0×2⁰) = 8 + 0 + 2 + 0 = 10",
      hint: "Each position represents a power of 2, starting from the right."
    },
    {
      id: 3,
      title: "Tech Word Scramble",
      description: "Unscramble: RACEPMOTU",
      type: "Word Puzzle",
      difficulty: "Easy",
      solution: "COMPUTER",
      explanation: "RACEPMOTU rearranged spells COMPUTER, which is the main device we use for computing.",
      hint: "This is the main device you're using right now!"
    },
    {
      id: 4,
      title: "Logic Gate Puzzle",
      description: "If A=1 and B=0, what is the output of A AND B?",
      type: "Logic",
      difficulty: "Medium",
      solution: "0",
      explanation: "In AND logic, the output is 1 only when both inputs are 1. Since B=0, the result is 0.",
      hint: "AND means both inputs must be true (1) for the output to be true (1)."
    },
    {
      id: 5,
      title: "Color Mixing",
      description: "What color do you get when you mix blue and red light?",
      type: "Color Theory",
      difficulty: "Easy",
      solution: "Magenta",
      explanation: "When blue and red light are mixed together, they create magenta light.",
      hint: "This is a bright pinkish-purple color."
    },
    {
      id: 6,
      title: "Network Path",
      description: "How many different paths can you take from A to C if you must go through B?",
      type: "Network Logic",
      difficulty: "Hard",
      solution: "1",
      explanation: "If you must go through B, there's only one path: A → B → C",
      hint: "You can't skip B, so count the required steps."
    },
    {
      id: 7,
      title: "Memory Sequence",
      description: "Remember this sequence: 2, 4, 8, 16, ?",
      type: "Memory & Math",
      difficulty: "Medium",
      solution: "32",
      explanation: "Each number is multiplied by 2: 2×2=4, 4×2=8, 8×2=16, 16×2=32",
      hint: "Look at how each number relates to the one before it."
    },
    {
      id: 8,
      title: "Tech Categories",
      description: "Which doesn't belong: Mouse, Keyboard, Monitor, Speaker, Printer?",
      type: "Classification",
      difficulty: "Easy",
      solution: "Speaker",
      explanation: "All others are visual output devices, while a speaker is an audio output device.",
      hint: "Think about what type of output each device provides."
    },
    {
      id: 9,
      title: "Code Translation",
      description: "If A=1, B=2, C=3, what does 'ABC' equal?",
      type: "Code Breaking",
      difficulty: "Medium",
      solution: "123",
      explanation: "A=1, B=2, C=3, so 'ABC' translates to 123",
      hint: "Replace each letter with its corresponding number."
    },
    {
      id: 10,
      title: "Tech Timeline",
      description: "Arrange these in order: Internet, Smartphone, Personal Computer, Email",
      type: "Chronology",
      difficulty: "Hard",
      solution: "Personal Computer → Email → Internet → Smartphone",
      explanation: "PCs came first (1970s), then email (1971), internet (1983), and smartphones (1990s)",
      hint: "Think about when each technology was invented."
    }
  ]

  const handleShowSolution = () => {
    setShowSolution(true)
    if (!completedPuzzles.includes(currentPuzzle)) {
      setCompletedPuzzles([...completedPuzzles, currentPuzzle])
    }
  }

  const handleNextPuzzle = () => {
    setShowSolution(false)
    setCurrentPuzzle((currentPuzzle + 1) % puzzles.length)
  }

  const handlePreviousPuzzle = () => {
    setShowSolution(false)
    setCurrentPuzzle(currentPuzzle === 0 ? puzzles.length - 1 : currentPuzzle - 1)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-400'
      case 'Medium': return 'text-yellow-400'
      case 'Hard': return 'text-red-400'
      default: return 'text-primary-400'
    }
  }

  const getDifficultyBg = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-emerald-500/10 border-emerald-500/30'
      case 'Medium': return 'bg-yellow-500/10 border-yellow-500/30'
      case 'Hard': return 'bg-red-500/10 border-red-500/30'
      default: return 'bg-primary-500/10 border-primary-500/30'
    }
  }

  const currentPuzzleData = puzzles[currentPuzzle]

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
                <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center">
                  <Puzzle className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 opacity-30 blur-2xl"></div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Brain <span className="gradient-text">Teasers</span> & Puzzles
            </h1>
            
            <p className="text-xl text-dark-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Challenge your mind with our collection of fun and educational puzzles! 
              From pattern recognition to logic problems, these brain teasers will help 
              you develop critical thinking skills while learning about technology.
            </p>
          </div>
        </div>
      </section>

      {/* Puzzle Navigation */}
      <section className="py-8 bg-dark-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-2">
            {puzzles.map((puzzle, index) => (
              <button
                key={puzzle.id}
                onClick={() => {
                  setCurrentPuzzle(index)
                  setShowSolution(false)
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  currentPuzzle === index
                    ? 'bg-primary-600 text-white'
                    : completedPuzzles.includes(index)
                    ? 'bg-emerald-600/20 border border-emerald-500/50 text-emerald-400'
                    : 'bg-dark-700 hover:bg-dark-600 text-dark-300 hover:text-white border border-dark-600'
                }`}
              >
                {completedPuzzles.includes(index) && <Trophy className="w-4 h-4 inline mr-1" />}
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Current Puzzle */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">
            {/* Puzzle Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentPuzzleData.title}</h2>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-dark-400">{currentPuzzleData.type}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBg(currentPuzzleData.difficulty)} ${getDifficultyColor(currentPuzzleData.difficulty)}`}>
                      {currentPuzzleData.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-dark-400">Puzzle</div>
                <div className="text-2xl font-bold text-primary-400">{currentPuzzle + 1}/{puzzles.length}</div>
              </div>
            </div>

            {/* Puzzle Content */}
            <div className="mb-8">
              <p className="text-lg text-white mb-6">{currentPuzzleData.description}</p>
              
              {!showSolution && (
                <div className="bg-dark-700/50 rounded-lg p-4 border border-dark-600">
                  <div className="flex items-center space-x-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                    <span className="text-sm font-medium text-yellow-400">Hint</span>
                  </div>
                  <p className="text-dark-300 text-sm">{currentPuzzleData.hint}</p>
                </div>
              )}

              {showSolution && (
                <>
                  <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/30 mb-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Target className="w-5 h-5 text-emerald-400" />
                      <span className="text-sm font-medium text-emerald-400">Solution</span>
                    </div>
                    <p className="text-white font-semibold mb-2">{currentPuzzleData.solution}</p>
                    <p className="text-dark-300 text-sm">{currentPuzzleData.explanation}</p>
                  </div>
                  
                  {/* Save Score Component */}
                  <div className="mb-4">
                    <SaveScore
                      type="puzzle"
                      title={currentPuzzleData.title}
                      level={currentPuzzleData.difficulty}
                      completed={true}
                      details={{
                        puzzleType: currentPuzzleData.type,
                        difficulty: currentPuzzleData.difficulty,
                        solution: currentPuzzleData.solution
                      }}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between">
              <button
                onClick={handlePreviousPuzzle}
                className="btn-secondary"
              >
                Previous Puzzle
              </button>

              {!showSolution ? (
                <button
                  onClick={handleShowSolution}
                  className="btn-primary"
                >
                  Show Solution
                </button>
              ) : (
                <button
                  onClick={handleNextPuzzle}
                  className="btn-primary"
                >
                  Next Puzzle
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-dark-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Your <span className="gradient-text">Progress</span>
            </h2>
            <p className="text-xl text-dark-300 max-w-2xl mx-auto">
              Track how many puzzles you've solved and challenge yourself to complete them all!
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-400 mb-2">{puzzles.length}</div>
              <div className="text-dark-300">Total Puzzles</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-400 mb-2">{completedPuzzles.length}</div>
              <div className="text-dark-300">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">{puzzles.length - completedPuzzles.length}</div>
              <div className="text-dark-300">Remaining</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="w-full bg-dark-700 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedPuzzles.length / puzzles.length) * 100}%` }}
              ></div>
            </div>
            <div className="text-center mt-2 text-sm text-dark-400">
              {Math.round((completedPuzzles.length / puzzles.length) * 100)}% Complete
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready for More <span className="gradient-text">Challenges</span>?
          </h2>
          <p className="text-xl text-dark-300 mb-8">
            Keep solving puzzles to improve your problem-solving skills and learn more about technology. 
            Each puzzle is designed to be both fun and educational!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setCurrentPuzzle(0)
                setShowSolution(false)
              }}
              className="btn-primary"
            >
              Start from Beginning
            </button>
            <button
              onClick={() => {
                const nextUncompleted = puzzles.findIndex((_, index) => !completedPuzzles.includes(index))
                if (nextUncompleted !== -1) {
                  setCurrentPuzzle(nextUncompleted)
                  setShowSolution(false)
                }
              }}
              className="btn-secondary"
              disabled={completedPuzzles.length === puzzles.length}
            >
              Next Unsolved Puzzle
            </button>
          </div>
        </div>
      </section>

      {/* AI Puzzle Solver */}
      <AIPuzzleSolver
        puzzleTitle={currentPuzzleData.title}
        puzzleType={currentPuzzleData.type}
        difficulty={currentPuzzleData.difficulty}
        currentPuzzle={currentPuzzleData}
      />

      {/* AI Puzzle Generator */}
      <AIPuzzleGenerator />

      <Footer />
    </div>
  )
}
