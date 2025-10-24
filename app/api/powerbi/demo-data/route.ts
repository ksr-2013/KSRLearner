import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Sample Power BI demo data
    const demoData = {
      learningProgress: [
        { month: 'Jan', quizzes: 12, typingTests: 8, puzzles: 15 },
        { month: 'Feb', quizzes: 18, typingTests: 12, puzzles: 22 },
        { month: 'Mar', quizzes: 25, typingTests: 15, puzzles: 28 },
        { month: 'Apr', quizzes: 32, typingTests: 20, puzzles: 35 },
        { month: 'May', quizzes: 28, typingTests: 18, puzzles: 30 },
        { month: 'Jun', quizzes: 35, typingTests: 25, puzzles: 40 }
      ],
      performanceMetrics: {
        averageScore: 87.5,
        averageWPM: 65.2,
        completionRate: 92.3,
        streakDays: 15,
        totalHours: 142.5,
        improvementRate: 12.8
      },
      categoryBreakdown: [
        { category: 'Programming', score: 89, attempts: 45, timeSpent: 32.5 },
        { category: 'Mathematics', score: 85, attempts: 38, timeSpent: 28.2 },
        { category: 'Science', score: 91, attempts: 42, timeSpent: 35.1 },
        { category: 'Language', score: 88, attempts: 40, timeSpent: 30.8 },
        { category: 'History', score: 83, attempts: 35, timeSpent: 25.4 }
      ],
      weeklyActivity: [
        { day: 'Mon', hours: 2.5, quizzes: 4, score: 85 },
        { day: 'Tue', hours: 3.2, quizzes: 6, score: 88 },
        { day: 'Wed', hours: 2.8, quizzes: 5, score: 87 },
        { day: 'Thu', hours: 4.1, quizzes: 7, score: 92 },
        { day: 'Fri', hours: 3.5, quizzes: 6, score: 89 },
        { day: 'Sat', hours: 5.2, quizzes: 9, score: 94 },
        { day: 'Sun', hours: 4.8, quizzes: 8, score: 91 }
      ],
      achievements: [
        { name: 'Quiz Master', description: 'Completed 100 quizzes', earned: true, date: '2024-01-15' },
        { name: 'Speed Demon', description: 'Achieved 80+ WPM', earned: true, date: '2024-02-03' },
        { name: 'Puzzle Solver', description: 'Solved 50 puzzles', earned: true, date: '2024-02-20' },
        { name: 'Streak Master', description: '30-day learning streak', earned: false, date: null },
        { name: 'Perfect Score', description: '100% on 10 quizzes', earned: false, date: null }
      ],
      recommendations: [
        {
          type: 'improvement',
          title: 'Focus on Mathematics',
          description: 'Your math scores are 6% below average. Try more practice problems.',
          priority: 'high'
        },
        {
          type: 'achievement',
          title: 'Complete Your Streak',
          description: 'You\'re 15 days away from a 30-day streak achievement!',
          priority: 'medium'
        },
        {
          type: 'exploration',
          title: 'Try Advanced Programming',
          description: 'Your programming skills are excellent. Try advanced topics.',
          priority: 'low'
        }
      ],
      insights: [
        {
          title: 'Peak Performance Time',
          description: 'You perform best on weekends with 94% average score',
          value: '94%',
          trend: 'up'
        },
        {
          title: 'Learning Velocity',
          description: 'Your learning speed has increased by 12.8% this month',
          value: '+12.8%',
          trend: 'up'
        },
        {
          title: 'Consistency Score',
          description: 'You maintain 92.3% completion rate across all activities',
          value: '92.3%',
          trend: 'stable'
        }
      ]
    }

    return NextResponse.json({
      success: true,
      data: demoData,
      metadata: {
        lastUpdated: new Date().toISOString(),
        dataSource: 'KSRLearner Analytics',
        version: '1.0.0'
      }
    })
  } catch (error) {
    console.error('Power BI demo data error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to load demo data',
        message: 'Unable to generate Power BI demo data'
      },
      { status: 500 }
    )
  }
}
