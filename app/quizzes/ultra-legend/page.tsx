'use client'

import Link from 'next/link';
import { BookOpen, Target, Trophy, Brain } from 'lucide-react';

export default function UltraLegendQuizzes() {
  const quizzes = [
    {
      id: 1,
      title: "Ultra Legend Quiz 1",
      description: "Test your mastery of cutting-edge technology and advanced concepts",
      icon: BookOpen,
      questions: 10,
      difficulty: "Ultra Legend"
    },
    {
      id: 2,
      title: "Ultra Legend Quiz 2", 
      description: "Challenge yourself with expert-level system architecture and design",
      icon: Target,
      questions: 10,
      difficulty: "Ultra Legend"
    },
    {
      id: 3,
      title: "Ultra Legend Quiz 3",
      description: "Prove your expertise in the most advanced computing concepts",
      icon: Brain,
      questions: 10,
      difficulty: "Ultra Legend"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Ultra Legend Level Quizzes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Prove your mastery with these ultimate-level quizzes designed for Ultra Legend learners. 
            Each quiz contains 10 extremely challenging questions that will test your deepest understanding of technology.
          </p>
        </div>

        {/* Quiz Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-full mb-4 mx-auto">
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
                  <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                    {quiz.difficulty}
                  </span>
                </div>
                <Link 
                  href={`/quizzes/ultra-legend/quiz${quiz.id}`}
                  target="_blank"
                  className="w-full bg-gradient-to-r from-red-500 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-600 hover:to-orange-700 transition-all duration-300 block text-center"
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
            💡 Tips for Ultra Legend Level Success
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Master-Level Thinking</h4>
                <p className="text-gray-600 text-sm">Ultra Legend level requires thinking like a technology master with deep theoretical knowledge.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Connect Advanced Theories</h4>
                <p className="text-gray-600 text-sm">Look for relationships between cutting-edge technologies and fundamental principles.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Think Beyond Current Knowledge</h4>
                <p className="text-gray-600 text-sm">These questions may require applying concepts in new and innovative ways.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-red-600 font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Learn from Every Challenge</h4>
                <p className="text-gray-600 text-sm">Use these ultra-challenging questions to push your knowledge to new heights.</p>
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
