'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Clock, CheckCircle, Play } from 'lucide-react'
import Link from 'next/link'

interface Lesson {
  id: string
  unit: number
  title: string
  explanation: string
  examples: string[]
  exercises: any[]
  completed?: boolean
  score?: number
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLessons()
  }, [])

  const fetchLessons = async () => {
    try {
      const response = await fetch('/api/lessons')
      const data = await response.json()
      
      // Fetch user progress to mark completed lessons
      const progressResponse = await fetch('/api/user-progress?userId=demo-user')
      const progressData = await progressResponse.json()

      const lessonsWithProgress = data.map((lesson: Lesson) => {
        const progress = progressData.find((p: any) => p.lesson_id === lesson.id)
        return {
          ...lesson,
          completed: progress?.completed || false,
          score: progress?.score
        }
      })

      setLessons(lessonsWithProgress)
    } catch (error) {
      console.error('Error fetching lessons:', error)
    } finally {
      setLoading(false)
    }
  }

  const completedCount = lessons.filter(l => l.completed).length
  const completionPercentage = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">English Grammar Lessons</h1>
        <p className="text-gray-600">Master English grammar with lessons from New Round-Up Starter</p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Your Progress
          </CardTitle>
          <CardDescription>
            Track your completion of all grammar units
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Completed Lessons</span>
            <span className="text-sm text-gray-600">{completedCount}/{lessons.length}</span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
          <p className="text-xs text-gray-500 mt-2">
            {completionPercentage === 100 ? 'Congratulations! You completed all lessons!' : 
             `Keep going! ${Math.round(completionPercentage)}% complete`}
          </p>
        </CardContent>
      </Card>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="hover:shadow-lg transition-shadow border-gray-200">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded border border-blue-200">
                      Unit {lesson.unit}
                    </span>
                    {lesson.completed && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2 text-gray-700">
                    {lesson.title}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Lesson Preview */}
              <div>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {lesson.explanation.substring(0, 100)}...
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{lesson.exercises.length} exercises</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>15-20 min</span>
                </div>
              </div>

              {/* Score Display */}
              {lesson.completed && lesson.score && (
                <div className="bg-green-50 border border-green-200 rounded p-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-green-800">Completed</span>
                    <span className="text-sm font-bold text-green-600">{lesson.score}%</span>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button asChild className="w-full">
                <Link href={`/lessons/${lesson.id}`}>
                  {lesson.completed ? (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Review Lesson
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Lesson
                    </>
                  )}
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {lessons.length === 0 && (
        <Card className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No Lessons Available
          </h3>
          <p className="text-gray-500 mb-6">
            Lessons haven't been uploaded yet. Please contact your administrator.
          </p>
          <Button asChild>
            <Link href="/admin/upload">
              Upload Grammar Book
            </Link>
          </Button>
        </Card>
      )}
    </div>
  )
}
