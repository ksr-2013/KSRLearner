import { NextRequest, NextResponse } from 'next/server'

interface EvaluationRequest {
  examText: string
  examType: string
  subject: string
}

interface NLPCloudResponse {
  score: number
  feedback: string
  strengths: string[]
  improvements: string[]
  suggestions: string[]
  overallGrade: string
}

export async function POST(request: NextRequest) {
  try {
    const { examText, examType, subject }: EvaluationRequest = await request.json()

    if (!examText || !examText.trim()) {
      return NextResponse.json(
        { error: 'Exam text is required' },
        { status: 400 }
      )
    }

    // Get NLPCloud API key from environment variables
    const apiKey = process.env.NLPCLOUD_API_KEY

    if (!apiKey) {
      console.error('NLPCloud API key not found')
      return NextResponse.json(
        { error: 'AI evaluation service not configured' },
        { status: 500 }
      )
    }

    // Create evaluation prompt based on exam type and subject
    const evaluationPrompt = createEvaluationPrompt(examText, examType, subject)

    // Call NLPCloud API for text generation
    const nlpCloudResponse = await fetch('https://api.nlpcloud.io/v1/gpu/fast-gpt-j/text-generation', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: evaluationPrompt,
        max_length: 1000,
        temperature: 0.7,
        top_p: 0.9,
      }),
    })

    if (!nlpCloudResponse.ok) {
      const errorText = await nlpCloudResponse.text()
      console.error('NLPCloud API error:', errorText)
      return NextResponse.json(
        { error: 'Failed to evaluate exam' },
        { status: 500 }
      )
    }

    const nlpCloudData = await nlpCloudResponse.json()
    const generatedText = nlpCloudData.generated_text

    // Parse the AI response into structured evaluation
    const evaluation = parseEvaluationResponse(generatedText, examText, examType, subject)

    return NextResponse.json(evaluation)

  } catch (error) {
    console.error('Error in exam evaluation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function createEvaluationPrompt(examText: string, examType: string, subject: string): string {
  const basePrompt = `You are an expert academic evaluator. Please evaluate the following ${examType} exam${subject ? ` in ${subject}` : ''} and provide a comprehensive assessment.

Exam Content:
"${examText}"

Please provide your evaluation in the following JSON format:
{
  "score": [number between 0-100],
  "feedback": "[detailed overall feedback about the exam performance]",
  "strengths": ["strength1", "strength2", "strength3"],
  "improvements": ["improvement1", "improvement2", "improvement3"],
  "suggestions": ["suggestion1", "suggestion2", "suggestion3"],
  "overallGrade": "[A+, A, B+, B, C+, C, D, F]"
}

Evaluation Criteria:
- Content accuracy and relevance
- Structure and organization
- Clarity of expression
- Depth of analysis
- Use of evidence/examples
- Grammar and mechanics
- Originality and creativity

Please be constructive and specific in your feedback. Focus on helping the student improve.`

  return basePrompt
}

function parseEvaluationResponse(generatedText: string, examText: string, examType: string, subject: string): NLPCloudResponse {
  try {
    // Try to extract JSON from the response
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
    
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      
      // Validate and sanitize the response
      return {
        score: Math.max(0, Math.min(100, parsed.score || 0)),
        feedback: parsed.feedback || 'No specific feedback available.',
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 5) : ['Good effort shown'],
        improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 5) : ['Continue practicing'],
        suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions.slice(0, 5) : ['Keep up the good work'],
        overallGrade: parsed.overallGrade || 'C'
      }
    }
  } catch (error) {
    console.error('Error parsing AI response:', error)
  }

  // Fallback evaluation if JSON parsing fails
  return createFallbackEvaluation(examText, examType, subject)
}

function createFallbackEvaluation(examText: string, examType: string, subject: string): NLPCloudResponse {
  // Simple heuristic-based evaluation as fallback
  const wordCount = examText.split(/\s+/).length
  const sentenceCount = examText.split(/[.!?]+/).length
  const avgWordsPerSentence = wordCount / Math.max(sentenceCount, 1)
  
  // Basic scoring based on length and structure
  let score = 50 // Base score
  
  if (wordCount > 100) score += 10
  if (wordCount > 200) score += 10
  if (avgWordsPerSentence > 10 && avgWordsPerSentence < 25) score += 10
  if (examText.includes('.')) score += 5
  if (examText.includes('!') || examText.includes('?')) score += 5
  
  score = Math.min(95, Math.max(20, score))
  
  const grade = getGradeFromScore(score)
  
  return {
    score: Math.round(score),
    feedback: `This ${examType}${subject ? ` in ${subject}` : ''} shows ${wordCount > 100 ? 'good' : 'basic'} effort. The content demonstrates understanding of the topic with room for further development.`,
    strengths: [
      'Shows understanding of the topic',
      'Attempts to address the question',
      'Demonstrates effort in completion'
    ],
    improvements: [
      'Expand on key points with more detail',
      'Provide specific examples or evidence',
      'Improve structure and organization'
    ],
    suggestions: [
      'Review the material before writing',
      'Plan your response before starting',
      'Proofread for clarity and accuracy'
    ],
    overallGrade: grade
  }
}

function getGradeFromScore(score: number): string {
  if (score >= 95) return 'A+'
  if (score >= 90) return 'A'
  if (score >= 85) return 'B+'
  if (score >= 80) return 'B'
  if (score >= 75) return 'C+'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}
