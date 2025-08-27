'use client'

import Link from 'next/link';
import { BookOpen, Target, Trophy, Brain } from 'lucide-react';

export default function ProQuizzes() {
  const quizzes = [
    {
      id: 1,
      title: "Pro Quiz 1",
      description: "Test your intermediate knowledge of computer systems and networking",
      icon: BookOpen,
      questions: 10,
      difficulty: "Pro"
    },
    {
      id: 2,
      title: "Pro Quiz 2", 
      description: "Challenge yourself with advanced software and programming concepts",
      icon: Target,
      questions: 10,
      difficulty: "Pro"
    },
    {
      id: 3,
      title: "Pro Quiz 3",
      description: "Master professional-level computer security and optimization",
      icon: Brain,
      questions: 10,
      difficulty: "Pro"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Pro Level Quizzes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Take your skills to the next level with these intermediate quizzes designed for Pro learners. 
            Each quiz contains 10 challenging questions to help you advance your technology knowledge.
          </p>
        </div>

        {/* Quiz Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 mx-auto">
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
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {quiz.difficulty}
                  </span>
                </div>
                <Link 
                  href={`/quizzes/pro/quiz${quiz.id}`}
                  target="_blank"
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 block text-center"
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
            💡 Tips for Pro Level Success
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Think Analytically</h4>
                <p className="text-gray-600 text-sm">Pro level questions require deeper thinking and understanding of concepts.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Connect Concepts</h4>
                <p className="text-gray-600 text-sm">Look for relationships between different topics and technologies.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Practice Problem Solving</h4>
                <p className="text-gray-600 text-sm">Use these quizzes to develop critical thinking and troubleshooting skills.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-green-600 font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Review Explanations</h4>
                <p className="text-gray-600 text-sm">Learn from each explanation to build a comprehensive understanding.</p>
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
