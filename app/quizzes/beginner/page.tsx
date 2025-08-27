'use client'

import Link from 'next/link';
import { BookOpen, Target, Trophy, Brain } from 'lucide-react';

export default function BeginnerQuizzes() {
  const quizzes = [
    {
      id: 1,
      title: "Beginner Quiz 1",
      description: "Start your learning journey with fundamental computer concepts",
      icon: BookOpen,
      questions: 10,
      difficulty: "Beginner"
    },
    {
      id: 2,
      title: "Beginner Quiz 2", 
      description: "Build on basics with essential hardware and software knowledge",
      icon: Target,
      questions: 10,
      difficulty: "Beginner"
    },
    {
      id: 3,
      title: "Beginner Quiz 3",
      description: "Master core computing principles and digital literacy",
      icon: Brain,
      questions: 10,
      difficulty: "Beginner"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Beginner Level Quizzes
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Start your learning journey with these foundational quizzes designed for beginners. 
            Each quiz contains 10 carefully crafted questions to help you build a strong foundation in technology.
          </p>
        </div>

        {/* Quiz Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="p-6">
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full mb-4 mx-auto">
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
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {quiz.difficulty}
                  </span>
                </div>
                <Link 
                  href={`/quizzes/beginner/quiz${quiz.id}`}
                  target="_blank"
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 block text-center"
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
            💡 Tips for Beginner Success
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Take Your Time</h4>
                <p className="text-gray-600 text-sm">Read each question carefully and don't rush through the answers.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Review Explanations</h4>
                <p className="text-gray-600 text-sm">After each question, read the explanation to understand the concept better.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Practice Regularly</h4>
                <p className="text-gray-600 text-sm">Complete all three quizzes to reinforce your learning and track your progress.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Don't Worry About Mistakes</h4>
                <p className="text-gray-600 text-sm">Learning happens through mistakes. Use them as opportunities to grow.</p>
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
