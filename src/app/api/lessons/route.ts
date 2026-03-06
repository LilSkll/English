import { NextRequest, NextResponse } from 'next/server'
import { getLessons, saveLesson, Lesson } from '@/lib/supabase'

// In-memory storage for server-side (since localStorage doesn't work in API routes)
let serverLessons: Lesson[] = []

export async function GET(request: NextRequest) {
  try {
    // Return lessons from server storage
    return NextResponse.json(serverLessons.sort((a, b) => a.unit - b.unit))
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const lessonData = await request.json()
    
    // Save to server storage
    const newLesson = {
      ...lessonData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    
    // Check if lesson with same unit exists
    const existingIndex = serverLessons.findIndex(l => l.unit === lessonData.unit)
    if (existingIndex >= 0) {
      serverLessons[existingIndex] = newLesson
    } else {
      serverLessons.push(newLesson)
    }
    
    return NextResponse.json(newLesson, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
