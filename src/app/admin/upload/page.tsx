'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, BookOpen, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import Link from 'next/link'

export default function AdminUpload() {
  const [loading, setLoading] = useState(false)
  const [lessonsCount, setLessonsCount] = useState(0)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  useEffect(() => {
    // Load lessons count
    loadLessonsCount()
  }, [])

  const loadLessonsCount = async () => {
    try {
      const response = await fetch('/api/lessons')
      if (response.ok) {
        const lessons = await response.json()
        setLessonsCount(lessons.length)
      }
    } catch (error) {
      console.error('Failed to load lessons count:', error)
    }
  }

  const refreshLessons = async () => {
    setLoading(true)
    setStatus('loading')
    
    try {
      await loadLessonsCount()
      setStatus('success')
      toast({
        title: 'Success!',
        description: `Loaded ${lessonsCount} pre-built lessons from New Round-Up Starter`
      })
    } catch (error) {
      setStatus('error')
      toast({
        title: 'Error',
        description: 'Failed to load lessons',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-500" />
      default:
        return <BookOpen className="h-8 w-8 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'loading':
        return 'Loading lessons...'
      case 'success':
        return 'Lessons loaded successfully!'
      case 'error':
        return 'Failed to load lessons'
      default:
        return 'Ready to manage lessons'
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Lesson Management
            </CardTitle>
            <CardDescription>
              Manage pre-built lessons from the New Round-Up Starter English Grammar Book
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Current Status */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {getStatusIcon()}
              <p className="mt-2 text-sm text-gray-600">
                {getStatusText()}
              </p>
              
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {lessonsCount} Lessons Available
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Units 1-10 from New Round-Up Starter
                </p>
              </div>
              
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  onClick={refreshLessons}
                  disabled={loading}
                  className="mt-4"
                >
                  <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  {loading ? 'Loading...' : 'Refresh Lessons'}
                </Button>
                
                <Link href="/lessons">
                  <Button variant="outline" className="mt-4">
                    View All Lessons
                  </Button>
                </Link>
              </div>
            </div>

            {/* Available Units */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Available Units</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((unit) => (
                  <Link key={unit} href={`/lessons/unit-${unit}`}>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                      <span className="font-medium">Unit {unit}</span>
                      <span className="text-sm text-blue-600">View →</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Features:</h4>
              <ul className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>10 complete grammar units from New Round-Up Starter</li>
                <li>Interactive exercises with instant feedback</li>
                <li>Progress tracking for each unit</li>
                <li>Grammar explanations and examples</li>
                <li>AI-powered chat tutor for practice</li>
                <li>No PDF upload required - everything is pre-built!</li>
              </ul>
            </div>

            {/* Instructions */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">How to Use:</h4>
              <ol className="text-sm text-green-800 space-y-1 list-decimal list-inside">
                <li>Click "View All Lessons" to see all available units</li>
                <li>Select any unit to start learning</li>
                <li>Complete exercises and track your progress</li>
                <li>Use the chat tutor for additional practice</li>
                <li>Monitor your progress on the dashboard</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
