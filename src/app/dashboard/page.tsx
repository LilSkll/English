'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { BookOpen, Trophy, Target, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface Lesson {
  id: string
  unit: number
  title: string
  completed: boolean
  score?: number
  started_at?: string
  completed_at?: string
}

interface UserStats {
  totalLessons: number
  completedLessons: number
  averageScore: number
  totalTime: number
  weakTopics: string[]
  recentActivity: Lesson[]
}

export default function Dashboard() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [stats, setStats] = useState<UserStats>({
    totalLessons: 0,
    completedLessons: 0,
    averageScore: 0,
    totalTime: 0,
    weakTopics: [],
    recentActivity: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch user progress
      const progressResponse = await fetch('/api/user-progress?userId=demo-user')
      const progressData = await progressResponse.json()

      // Fetch all lessons
      const lessonsResponse = await fetch('/api/lessons')
      const allLessons = await lessonsResponse.json()

      // Combine data
      const lessonsWithProgress = allLessons.map((lesson: any) => {
        const progress = progressData.find((p: any) => p.lesson_id === lesson.id)
        return {
          ...lesson,
          completed: progress?.completed || false,
          score: progress?.score,
          started_at: progress?.started_at,
          completed_at: progress?.completed_at
        }
      })

      setLessons(lessonsWithProgress)

      // Calculate stats
      const completed = lessonsWithProgress.filter((l: Lesson) => l.completed)
      const scores = completed.map((l: Lesson) => l.score).filter(Boolean) as number[]
      const averageScore = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0

      // Identify weak topics (lessons with low scores)
      const weakTopics = completed
        .filter((l: Lesson) => l.score && l.score < 70)
        .map((l: Lesson) => l.title)

      setStats({
        totalLessons: allLessons.length,
        completedLessons: completed.length,
        averageScore,
        totalTime: completed.length * 20, // Estimate 20 min per lesson
        weakTopics,
        recentActivity: progressData.slice(0, 5)
      })

    } catch (error) {
      console.error('Dashboard error:', error)
    } finally {
      setLoading(false)
    }
  }

  const completionPercentage = stats.totalLessons > 0 
    ? (stats.completedLessons / stats.totalLessons) * 100 
    : 0

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold">Your Learning Dashboard</h1>
        <p className="text-gray-600">Track your progress and continue your English learning journey</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedLessons}/{stats.totalLessons}</div>
            <Progress value={completionPercentage} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.averageScore)}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {stats.averageScore >= 80 ? 'Excellent!' : stats.averageScore >= 60 ? 'Good progress!' : 'Keep practicing!'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(stats.totalTime / 60)}h</div>
            <p className="text-xs text-gray-500 mt-1">Total learning time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3 days</div>
            <p className="text-xs text-gray-500 mt-1">Keep it up!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Lessons */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              All Lessons
            </CardTitle>
            <CardDescription>Your learning progress through the New Round-Up units</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      lesson.completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {lesson.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <span className="text-sm font-medium text-gray-500">{lesson.unit}</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{lesson.title}</p>
                      <p className="text-sm text-gray-500">Unit {lesson.unit}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {lesson.completed && lesson.score && (
                      <div className="text-right">
                        <p className="text-sm font-medium">{lesson.score}%</p>
                        <p className="text-xs text-gray-500">Score</p>
                      </div>
                    )}
                    <Button asChild variant={lesson.completed ? "secondary" : "default"}>
                      <Link href={`/lessons/${lesson.id}`}>
                        {lesson.completed ? 'Review' : 'Start'}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.weakTopics.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-2">Topics to Review</h4>
                <div className="space-y-2">
                  {stats.weakTopics.slice(0, 3).map((topic, index) => (
                    <div key={index} className="p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
                      {topic}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-2">Next Steps</h4>
              <div className="space-y-2">
                <Button asChild className="w-full justify-start">
                  <Link href="/lessons">
                    Continue Learning
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start">
                  <Link href="/chat">
                    Practice Conversation
                  </Link>
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium text-sm text-gray-700 mb-2">Study Tip</h4>
              <p className="text-sm text-gray-600">
                Practice speaking for 10 minutes daily to improve your fluency and confidence.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
