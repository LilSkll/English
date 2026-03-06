import { NextRequest, NextResponse } from 'next/server'
import { chatTutor } from '@/lib/openai'
import { ChatSession } from '@/lib/supabase'

// In-memory storage for chat sessions
let serverChatSessions: ChatSession[] = []

export async function POST(request: NextRequest) {
  try {
    const { message, userId, sessionId } = await request.json()

    if (!message || !userId) {
      return NextResponse.json(
        { error: 'Message and user ID are required' },
        { status: 400 }
      )
    }

    // Get AI response
    const aiResponse = await chatTutor(message)

    // Create or update chat session
    const chatMessage = {
      role: 'user' as const,
      content: message,
      timestamp: new Date().toISOString()
    }

    const aiMessage = {
      role: 'assistant' as const,
      content: aiResponse,
      timestamp: new Date().toISOString()
    }

    let session: ChatSession

    if (sessionId) {
      // Update existing session
      const sessionIndex = serverChatSessions.findIndex(s => s.id === sessionId)
      if (sessionIndex >= 0) {
        serverChatSessions[sessionIndex].messages.push(chatMessage, aiMessage)
        serverChatSessions[sessionIndex].updated_at = new Date().toISOString()
        session = serverChatSessions[sessionIndex]
      } else {
        // Create new session if not found
        session = {
          id: Date.now().toString(),
          user_id: userId,
          messages: [chatMessage, aiMessage],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        serverChatSessions.push(session)
      }
    } else {
      // Create new session
      session = {
        id: Date.now().toString(),
        user_id: userId,
        messages: [chatMessage, aiMessage],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      serverChatSessions.push(session)
    }

    return NextResponse.json({
      message: aiResponse,
      timestamp: new Date().toISOString(),
      sessionId: session.id
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const userSessions = serverChatSessions
      .filter(s => s.user_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)

    return NextResponse.json(userSessions)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
