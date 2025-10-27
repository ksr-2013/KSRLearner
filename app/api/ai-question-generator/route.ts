import { NextRequest, NextResponse } from 'next/server'

interface QuestionGenerationRequest {
  topic: string
  questionType: string
  difficulty: string
  numberOfQuestions: number
}

interface GeneratedQuestion {
  id: string
  question: string
  type: string
  options?: string[]
  correctAnswer?: string
  explanation?: string
  difficulty: string
}

export async function POST(request: NextRequest) {
  try {
    const { topic, questionType, difficulty, numberOfQuestions }: QuestionGenerationRequest = await request.json()

    if (!topic || !topic.trim()) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      )
    }

    // Get NLPCloud API key from environment variables
    const apiKey = process.env.NLPCLOUD_API_KEY

    // Try NLPCloud API if key is available, otherwise use fallback
    if (apiKey) {
      try {
        const questions = await generateQuestionsWithAI(topic, questionType, difficulty, numberOfQuestions, apiKey)
        return NextResponse.json({ questions })
      } catch (error) {
        console.warn('AI question generation failed, falling back to template-based generation:', error)
      }
    } else {
      console.log('NLPCloud API key not found, using template-based question generation')
    }

    // Fallback question generation (works without API key)
    const questions = generateQuestionsFromTemplates(topic, questionType, difficulty, numberOfQuestions)
    return NextResponse.json({ questions })

  } catch (error) {
    console.error('Error in question generation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function generateQuestionsWithAI(topic: string, questionType: string, difficulty: string, numberOfQuestions: number, apiKey: string): Promise<GeneratedQuestion[]> {
  const prompt = createQuestionGenerationPrompt(topic, questionType, difficulty, numberOfQuestions)

  const response = await fetch('https://api.nlpcloud.io/v1/gpu/fast-gpt-j/text-generation', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: prompt,
      max_length: 2000,
      temperature: 0.8,
      top_p: 0.9,
    }),
  })

  if (!response.ok) {
    throw new Error('AI API request failed')
  }

  const data = await response.json()
  const generatedText = data.generated_text

  // Try to parse AI response
  try {
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (parsed.questions && Array.isArray(parsed.questions)) {
        return parsed.questions.map((q: any, index: number) => ({
          id: `ai_${Date.now()}_${index}`,
          question: q.question || `Question ${index + 1}`,
          type: q.type || questionType,
          options: q.options || [],
          correctAnswer: q.correctAnswer || '',
          explanation: q.explanation || '',
          difficulty: q.difficulty || difficulty
        }))
      }
    }
  } catch (parseError) {
    console.warn('Failed to parse AI response:', parseError)
  }

  throw new Error('Failed to parse AI response')
}

function createQuestionGenerationPrompt(topic: string, questionType: string, difficulty: string, numberOfQuestions: number): string {
  return `Generate ${numberOfQuestions} ${difficulty} difficulty ${questionType} questions about "${topic}".

Please provide your response in the following JSON format:
{
  "questions": [
    {
      "question": "Your question here",
      "type": "${questionType}",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Correct answer",
      "explanation": "Why this answer is correct",
      "difficulty": "${difficulty}"
    }
  ]
}

Guidelines:
- Make questions relevant to the topic "${topic}"
- Ensure ${questionType} format is followed
- Difficulty should be ${difficulty}
- For multiple choice, provide 4 options
- Include clear explanations
- Make questions educational and thought-provoking`
}

function generateQuestionsFromTemplates(topic: string, questionType: string, difficulty: string, numberOfQuestions: number): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = []
  
  // Template-based question generation
  const templates = getQuestionTemplates(topic, questionType, difficulty)
  
  for (let i = 0; i < numberOfQuestions && i < templates.length; i++) {
    const template = templates[i]
    questions.push({
      id: `template_${Date.now()}_${i}`,
      question: template.question,
      type: questionType,
      options: template.options,
      correctAnswer: template.correctAnswer,
      explanation: template.explanation,
      difficulty: difficulty
    })
  }

  // If we need more questions than templates, generate additional ones
  while (questions.length < numberOfQuestions) {
    const additionalQuestion = generateAdditionalQuestion(topic, questionType, difficulty, questions.length + 1)
    questions.push(additionalQuestion)
  }

  return questions.slice(0, numberOfQuestions)
}

function getQuestionTemplates(topic: string, questionType: string, difficulty: string) {
  const baseTemplates = {
    'multiple-choice': [
      {
        question: `What is the primary purpose of ${topic}?`,
        options: [
          'To provide basic functionality',
          'To enhance user experience',
          'To solve specific problems',
          'To improve system performance'
        ],
        correctAnswer: 'To solve specific problems',
        explanation: `${topic} is primarily designed to address specific challenges and provide targeted solutions.`
      },
      {
        question: `Which of the following best describes ${topic}?`,
        options: [
          'A simple concept',
          'A complex system',
          'A fundamental principle',
          'An advanced technique'
        ],
        correctAnswer: 'A fundamental principle',
        explanation: `${topic} represents a core concept that forms the foundation of understanding in this field.`
      },
      {
        question: `What are the key characteristics of ${topic}?`,
        options: [
          'Speed and efficiency',
          'Accuracy and precision',
          'Flexibility and adaptability',
          'All of the above'
        ],
        correctAnswer: 'All of the above',
        explanation: `${topic} encompasses multiple important characteristics including speed, accuracy, and flexibility.`
      }
    ],
    'essay': [
      {
        question: `Explain the importance of ${topic} and its impact on modern applications.`,
        options: [],
        correctAnswer: '',
        explanation: 'This essay question requires students to demonstrate understanding of the topic and its broader implications.'
      },
      {
        question: `Compare and contrast ${topic} with related concepts, highlighting key differences and similarities.`,
        options: [],
        correctAnswer: '',
        explanation: 'Students should analyze relationships between concepts and provide detailed comparisons.'
      },
      {
        question: `Describe the evolution of ${topic} and predict its future development.`,
        options: [],
        correctAnswer: '',
        explanation: 'This question tests historical understanding and forward-thinking analysis.'
      }
    ],
    'short-answer': [
      {
        question: `Define ${topic} in your own words.`,
        options: [],
        correctAnswer: '',
        explanation: 'Students should provide a clear, concise definition demonstrating their understanding.'
      },
      {
        question: `List three main benefits of ${topic}.`,
        options: [],
        correctAnswer: '',
        explanation: 'Students should identify key advantages and explain their significance.'
      },
      {
        question: `What are the main challenges associated with ${topic}?`,
        options: [],
        correctAnswer: '',
        explanation: 'Students should identify potential difficulties and limitations.'
      }
    ]
  }

  return baseTemplates[questionType as keyof typeof baseTemplates] || baseTemplates['multiple-choice']
}

function generateAdditionalQuestion(topic: string, questionType: string, difficulty: string, questionNumber: number): GeneratedQuestion {
  const questionTypes = {
    'multiple-choice': {
      question: `Question ${questionNumber}: Which statement best describes ${topic}?`,
      options: [
        'It is a basic concept',
        'It is an advanced technique',
        'It is a fundamental principle',
        'It is a specialized tool'
      ],
      correctAnswer: 'It is a fundamental principle',
      explanation: `${topic} represents a core concept that students should understand thoroughly.`
    },
    'essay': {
      question: `Question ${questionNumber}: Analyze the role of ${topic} in contemporary applications and discuss its significance.`,
      options: [],
      correctAnswer: '',
      explanation: 'Students should provide comprehensive analysis with supporting evidence.'
    },
    'short-answer': {
      question: `Question ${questionNumber}: Explain the significance of ${topic}.`,
      options: [],
      correctAnswer: '',
      explanation: 'Students should provide a clear, concise explanation of the topic\'s importance.'
    }
  }

  const template = questionTypes[questionType as keyof typeof questionTypes] || questionTypes['multiple-choice']

  return {
    id: `additional_${Date.now()}_${questionNumber}`,
    question: template.question,
    type: questionType,
    options: template.options,
    correctAnswer: template.correctAnswer,
    explanation: template.explanation,
    difficulty: difficulty
  }
}
