'use client'

import Link from 'next/link';
import { BookOpen, Target, Trophy, Brain } from 'lucide-react';

export default function LegendQuizzes() {
  const quizzes = [
    {
      id: 1,
      title: "Legend Quiz 1",
      description: "Test your advanced knowledge of computer architecture and systems",
      icon: BookOpen,
      questions: 10,
      difficulty: "Legend"
    },
    {
      id: 2,
      title: "Legend Quiz 2", 
      description: "Challenge yourself with expert-level networking and protocols",
      icon: Target,
      questions: 10,
      difficulty: "Legend"
    },
    {
      id: 3,
      title: "Legend Quiz 3",
      description: "Master legendary-level software engineering and algorithms",
      icon: Brain,
      questions: 10,
      difficulty: "Legend"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Legend Level Quizzes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Prove your expertise with these advanced quizzes designed for Legend-level learners. 
            Each quiz contains 10 challenging questions that will test your deep understanding of technology.
          </p>
        </div>

        {/* Quiz Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-4 mx-auto">
                  <quiz.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">
                  {quiz.title}
                </h3>
                <p className="text-gray-600 text-center mb-4">
                  {quiz.description}
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-gray-500">
                    {quiz.questions} Questions
                  </span>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {quiz.difficulty}
                  </span>
                </div>
                <Link 
                  href={`/quizzes/legend/quiz${quiz.id}`}
                  target="_blank"
                  className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-indigo-700 transition-all duration-300 block text-center"
                >
                  Start Quiz {quiz.id}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Learning Tips */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            💡 Tips for Legend Level Success
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Deep Analysis</h4>
                <p className="text-gray-600 text-sm">Legend level requires analyzing complex scenarios and understanding underlying principles.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Connect Advanced Concepts</h4>
                <p className="text-gray-600 text-sm">Look for relationships between advanced technologies and theoretical concepts.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Think Like an Expert</h4>
                <p className="text-gray-600 text-sm">Approach problems from multiple angles and consider edge cases.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-purple-600 font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Learn from Mistakes</h4>
                <p className="text-gray-600 text-sm">Use incorrect answers as opportunities to deepen your understanding.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Quizzes */}
        <div className="text-center mt-8">
          <Link 
            href="/quizzes"
            className="inline-flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-300"
          >
            <span>← Back to All Quizzes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
