import { NextRequest, NextResponse } from 'next/server'
import { getAllLessons } from '@/lib/lessons-data'
import { Lesson } from '@/lib/supabase'

export async function GET() {
  try {
    // Return pre-built lessons from the New Round-Up Starter book
    const lessons = getAllLessons()
    return NextResponse.json(lessons)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const lessonData = await request.json()
    
    // For now, we'll just return the lesson data since we're using pre-built content
    // In a real app, you might want to save custom lessons or user progress
    const newLesson: Lesson = {
      id: `custom-${Date.now()}`,
      unit: lessonData.unit || 0,
      title: lessonData.title || 'Custom Lesson',
      explanation: lessonData.explanation || '',
      examples: lessonData.examples || [],
      exercises: lessonData.exercises || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(newLesson)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
