import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface Exercise {
  type: 'fill_blank' | 'multiple_choice' | 'sentence_correction' | 'rewrite' | 'match'
  question: string
  answer?: string
  options?: string[]
  correct?: string
  explanation?: string
}

export interface Lesson {
  unit: number
  title: string
  explanation: string
  examples: string[]
  exercises: Exercise[]
}

export async function generateExercises(grammarTopic: string, unit: number): Promise<Exercise[]> {
  const prompt = `
Generate 13 exercises for English grammar topic: "${grammarTopic}" (Unit ${unit}) following the New Round-Up Starter style.

Create exactly:
- 5 fill-in-the-blank exercises
- 5 multiple choice questions  
- 3 sentence correction tasks

Format as JSON array with this structure:
[
  {
    "type": "fill_blank",
    "question": "I ___ a student.",
    "answer": "am"
  },
  {
    "type": "multiple_choice", 
    "question": "She ___ from Spain.",
    "options": ["am", "is", "are"],
    "correct": "is"
  },
  {
    "type": "sentence_correction",
    "question": "He are my friend.",
    "answer": "He is my friend."
  }
]

Make exercises appropriate for beginner English learners. Focus only on the grammar topic: ${grammarTopic}.
`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert English grammar teacher creating exercises for the New Round-Up Starter textbook series. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    const exercises = JSON.parse(content)
    return exercises
  } catch (error) {
    console.error('Error generating exercises:', error)
    return []
  }
}

export async function explainGrammarMistake(mistake: string, correctAnswer: string, grammarTopic: string): Promise<string> {
  const prompt = `
Explain this grammar mistake in simple terms for a beginner English learner:

Mistake: "${mistake}"
Correct: "${correctAnswer}"  
Grammar Topic: ${grammarTopic}

Provide a brief, clear explanation (2-3 sentences) that helps the student understand why the correct answer is right.
Use simple vocabulary and include one example sentence.
`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a patient English grammar tutor explaining mistakes to beginners. Use simple language and be encouraging."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300,
    })

    return response.choices[0]?.message?.content || "Let me help you understand this grammar rule better."
  } catch (error) {
    console.error('Error generating explanation:', error)
    return "Let me help you understand this grammar rule better."
  }
}

export async function generateExtraExamples(grammarTopic: string, count: number = 3): Promise<string[]> {
  const prompt = `
Generate ${count} simple example sentences demonstrating the grammar topic: "${grammarTopic}"

Create sentences that are:
- Easy for beginners to understand
- Clearly show the grammar rule
- 5-8 words each
- About everyday situations

Return as a JSON array of strings only.
`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are creating example sentences for English grammar beginners. Always respond with valid JSON array only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    })

    const content = response.choices[0]?.message?.content
    if (!content) return []

    return JSON.parse(content)
  } catch (error) {
    console.error('Error generating examples:', error)
    return []
  }
}

export async function chatTutor(message: string, userLevel: string = 'beginner'): Promise<string> {
  const prompt = `
You are an AI English tutor helping a ${userLevel} student practice conversation. 

Current message: "${message}"

Respond by:
1. Correcting any grammar mistakes naturally
2. Suggesting better expressions if needed  
3. Explaining brief grammar points
4. Asking a follow-up question to continue the conversation
5. Being encouraging and friendly

Keep responses conversational and focused on practical English usage.
`

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a friendly English conversation tutor for beginners. Correct mistakes gently and keep the conversation flowing naturally."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 400,
    })

    return response.choices[0]?.message?.content || "That's interesting! Tell me more about that."
  } catch (error) {
    console.error('Error in chat tutor:', error)
    return "That's interesting! Tell me more about that."
  }
}
