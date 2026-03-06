import { NextRequest, NextResponse } from 'next/server'
import { UserProgress } from '@/lib/supabase'

// In-memory storage for user progress
let serverProgress: UserProgress[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const userProgress = serverProgress.filter(p => p.user_id === userId)
    return NextResponse.json(userProgress)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const progressData = await request.json()
    
    const newProgress: UserProgress = {
      ...progressData,
      id: Date.now().toString(),
      started_at: progressData.started_at || new Date().toISOString()
    }
    
    // Check if progress already exists for this user and lesson
    const existingIndex = serverProgress.findIndex(
      p => p.user_id === progressData.user_id && p.lesson_id === progressData.lesson_id
    )
    
    if (existingIndex >= 0) {
      serverProgress[existingIndex] = newProgress
    } else {
      serverProgress.push(newProgress)
    }
    
    return NextResponse.json(newProgress, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const updates = await request.json()
    const { userId, lessonId, ...updateData } = updates
    
    const progressIndex = serverProgress.findIndex(
      p => p.user_id === userId && p.lesson_id === lessonId
    )
    
    if (progressIndex === -1) {
      return NextResponse.json({ error: 'Progress not found' }, { status: 404 })
    }
    
    serverProgress[progressIndex] = {
      ...serverProgress[progressIndex],
      ...updateData,
      completed_at: updateData.completed ? new Date().toISOString() : serverProgress[progressIndex].completed_at
    }
    
    return NextResponse.json(serverProgress[progressIndex])
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
