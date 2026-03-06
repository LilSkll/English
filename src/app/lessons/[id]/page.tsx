'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ArrowLeft, ArrowRight, CheckCircle, BookOpen, Lightbulb, Volume2 } from 'lucide-react'
import Link from 'next/link'
import { toast } from '@/components/ui/use-toast'

interface Exercise {
  type: 'fill_blank' | 'multiple_choice' | 'sentence_correction' | 'rewrite' | 'match'
  question: string
  answer?: string
  options?: string[]
  correct?: string
  explanation?: string
}

interface Lesson {
  id: string
  unit: number
  title: string
  explanation: string
  examples: string[]
  exercises: Exercise[]
}

export default function LessonPage() {
  const params = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [extraExamples, setExtraExamples] = useState<string[]>([])
  const [grammarExplanation, setGrammarExplanation] = useState<string>('')
  const [showHint, setShowHint] = useState(false)

  const steps = ['explanation', 'examples', 'exercises', 'results']

  useEffect(() => {
    fetchLesson()
  }, [params.id])

  const fetchLesson = async () => {
    try {
      const response = await fetch(`/api/lessons/${params.id}`)
      const data = await response.json()
      setLesson(data)
    } catch (error) {
      console.error('Error fetching lesson:', error)
      toast({
        title: 'Error',
        description: 'Failed to load lesson',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (exerciseIndex: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [exerciseIndex]: answer
    }))
  }

  const calculateScore = () => {
    if (!lesson) return 0
    
    let correct = 0
    lesson.exercises.forEach((exercise, index) => {
      const userAnswer = userAnswers[index]
      
      if (exercise.type === 'multiple_choice') {
        if (userAnswer === exercise.correct) correct++
      } else if (exercise.type === 'fill_blank' || exercise.type === 'sentence_correction') {
        if (userAnswer?.toLowerCase().trim() === exercise.answer?.toLowerCase().trim()) correct++
      }
    })
    
    return Math.round((correct / lesson.exercises.length) * 100)
  }

  const submitAnswers = async () => {
    if (!lesson) return
    
    setSubmitting(true)
    const finalScore = calculateScore()
    setScore(finalScore)
    setShowResults(true)
    setCurrentStep(3)

    try {
        // Save progress to database
        await fetch('/api/user-progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: 'demo-user',
            lesson_id: lesson.id,
            completed: true,
            score: finalScore,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString()
          })
        })

      toast({
        title: 'Lesson Completed!',
        description: `You scored ${finalScore}% on this lesson.`
      })

    } catch (error) {
      console.error('Error saving progress:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const getGrammarHelp = async (exercise: Exercise, userAnswer: string) => {
    if (!lesson || !userAnswer) return
    
    const correctAnswer = exercise.answer || exercise.correct || ''
    const { explainGrammarMistake } = await import('@/lib/openai')
    const explanation = await explainGrammarMistake(userAnswer, correctAnswer, lesson.title)
    setGrammarExplanation(explanation)
    setShowHint(true)
  }

  const loadExtraExamples = async () => {
    if (!lesson) return
    
    const { generateExtraExamples } = await import('@/lib/openai')
    const examples = await generateExtraExamples(lesson.title, 3)
    setExtraExamples(examples)
  }

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Lesson not found</h2>
          <Button asChild>
            <Link href="/lessons">Back to Lessons</Link>
          </Button>
        </div>
      </div>
    )
  }

  const renderExplanation = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Grammar Explanation
        </CardTitle>
        <CardDescription>
          Unit {lesson.unit}: {lesson.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose max-w-none">
          <p className="text-gray-700 leading-relaxed">{lesson.explanation}</p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={loadExtraExamples} variant="outline">
            <Lightbulb className="h-4 w-4 mr-2" />
            Get More Examples
          </Button>
        </div>

        {extraExamples.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Extra Examples:</h4>
            <ul className="space-y-1">
              {extraExamples.map((example, index) => (
                <li key={index} className="text-blue-800 flex items-center gap-2">
                  <span>{example}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => speakText(example)}
                  >
                    <Volume2 className="h-3 w-3" />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderExamples = () => (
    <Card>
      <CardHeader>
        <CardTitle>Example Sentences</CardTitle>
        <CardDescription>
          See how the grammar rule is used in context
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {lesson.examples.map((example, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded">
                {index + 1}
              </span>
              <p className="flex-1">{example}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => speakText(example)}
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  const renderExercises = () => (
    <Card>
      <CardHeader>
        <CardTitle>Practice Exercises</CardTitle>
        <CardDescription>
          Test your understanding of the grammar rule
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {lesson.exercises.map((exercise, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium">Exercise {index + 1}</span>
              <span className="text-sm text-gray-500 capitalize">
                {exercise.type.replace('_', ' ')}
              </span>
            </div>
            
            <p className="text-gray-700">{exercise.question}</p>

            {exercise.type === 'multiple_choice' && exercise.options && (
              <Select onValueChange={(value) => handleAnswerChange(index, value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose the correct answer" />
                </SelectTrigger>
                <SelectContent>
                  {exercise.options.map((option, optionIndex) => (
                    <SelectItem key={optionIndex} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {(exercise.type === 'fill_blank' || exercise.type === 'sentence_correction') && (
              <div className="space-y-2">
                <Input
                  placeholder="Type your answer..."
                  value={userAnswers[index] || ''}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => getGrammarHelp(exercise, userAnswers[index] || '')}
                >
                  Get Help
                </Button>
              </div>
            )}

            {showHint && grammarExplanation && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded">
                <p className="text-sm text-yellow-800">{grammarExplanation}</p>
              </div>
            )}
          </div>
        ))}

        <Button onClick={submitAnswers} disabled={submitting} className="w-full">
          {submitting ? 'Submitting...' : 'Submit Answers'}
        </Button>
      </CardContent>
    </Card>
  )

  const renderResults = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          Lesson Complete!
        </CardTitle>
        <CardDescription>
          Here's how you did on {lesson.title}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">{score}%</div>
          <p className="text-gray-600">
            {score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good job!' : 'Keep practicing!'}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold">Review Your Answers:</h4>
          {lesson.exercises.map((exercise, index) => {
            const userAnswer = userAnswers[index]
            const correctAnswer = exercise.answer || exercise.correct || ''
            const isCorrect = exercise.type === 'multiple_choice' 
              ? userAnswer === correctAnswer
              : userAnswer?.toLowerCase().trim() === correctAnswer.toLowerCase().trim()

            return (
              <div key={index} className={`p-3 rounded-lg border ${
                isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Exercise {index + 1}</span>
                  <span className={`text-sm font-medium ${
                    isCorrect ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {isCorrect ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
                <p className="text-sm text-gray-700 mb-1">{exercise.question}</p>
                <div className="text-sm">
                  <p>Your answer: <span className="font-medium">{userAnswer || 'Not answered'}</span></p>
                  {!isCorrect && (
                    <p>Correct answer: <span className="font-medium text-green-600">{correctAnswer}</span></p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        <div className="flex gap-3">
          <Button asChild variant="outline" className="flex-1">
            <Link href="/lessons">Back to Lessons</Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href="/dashboard">View Dashboard</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/lessons">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Lessons
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Unit {lesson.unit}: {lesson.title}</h1>
          <p className="text-gray-600">Master the grammar step by step</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4">
        <Progress value={(currentStep / (steps.length - 1)) * 100} className="flex-1" />
        <span className="text-sm text-gray-600">
          {currentStep + 1} of {steps.length}
        </span>
      </div>

      {/* Step Content */}
      {currentStep === 0 && renderExplanation()}
      {currentStep === 1 && renderExamples()}
      {currentStep === 2 && renderExercises()}
      {currentStep === 3 && renderResults()}

      {/* Navigation */}
      {!showResults && currentStep < steps.length - 1 && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          {currentStep < steps.length - 2 ? (
            <Button onClick={() => setCurrentStep(currentStep + 1)}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : null}
        </div>
      )}
    </div>
  )
}
