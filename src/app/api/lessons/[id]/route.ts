import { NextRequest, NextResponse } from 'next/server'
import { getLessonById } from '@/lib/lessons-data'
import { Lesson } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lesson = getLessonById(id)
    
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    return NextResponse.json(lesson)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const updates = await request.json()
    
    // Get the original lesson
    const lesson = getLessonById(id)
    
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // For now, we'll just return the updated lesson data
    // In a real app, you might want to save the updates
    const updatedLesson: Lesson = {
      ...lesson,
      ...updates,
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(updatedLesson)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lesson = getLessonById(id)
    
    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    // For pre-built lessons, we won't actually delete them
    // In a real app, you might want to allow deletion of custom lessons
    return NextResponse.json({ 
      success: true,
      message: 'Lesson would be deleted (pre-built lessons are protected)'
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
