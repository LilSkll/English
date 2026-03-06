import { NextRequest, NextResponse } from 'next/server'
import { Lesson } from '@/lib/supabase'

// In-memory storage (same as in the main lessons route)
let serverLessons: Lesson[] = []

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const lesson = serverLessons.find(l => l.id === id)
    
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
    const lessonIndex = serverLessons.findIndex(l => l.id === id)
    
    if (lessonIndex === -1) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    serverLessons[lessonIndex] = {
      ...serverLessons[lessonIndex],
      ...updates,
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(serverLessons[lessonIndex])
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
    const lessonIndex = serverLessons.findIndex(l => l.id === id)
    
    if (lessonIndex === -1) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    serverLessons.splice(lessonIndex, 1)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
