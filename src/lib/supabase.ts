// Local storage utilities for lessons and user progress
export interface Lesson {
  id: string
  unit: number
  title: string
  explanation: string
  examples: string[]
  exercises: Exercise[]
  created_at: string
  updated_at: string
}

export interface Exercise {
  type: 'fill_blank' | 'multiple_choice' | 'sentence_correction' | 'rewrite' | 'match'
  question: string
  answer?: string
  options?: string[]
  correct?: string
  explanation?: string
}

export interface UserProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  score: number
  started_at: string
  completed_at?: string
}

export interface ChatSession {
  id: string
  user_id: string
  messages: Array<{
    role: 'user' | 'assistant'
    content: string
    timestamp: string
  }>
  created_at: string
  updated_at: string
}

// Local storage keys
const LESSONS_KEY = 'english_lessons'
const USER_PROGRESS_KEY = 'user_progress'
const CHAT_SESSIONS_KEY = 'chat_sessions'

// Lessons functions
export const getLessons = (): Lesson[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(LESSONS_KEY)
  return data ? JSON.parse(data) : []
}

export const saveLesson = (lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at'>): Lesson => {
  const lessons = getLessons()
  const newLesson: Lesson = {
    ...lesson,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  const existingIndex = lessons.findIndex(l => l.unit === lesson.unit)
  if (existingIndex >= 0) {
    lessons[existingIndex] = newLesson
  } else {
    lessons.push(newLesson)
  }
  
  localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons))
  return newLesson
}

export const getLessonById = (id: string): Lesson | null => {
  const lessons = getLessons()
  return lessons.find(l => l.id === id) || null
}

// User progress functions
export const getUserProgress = (userId: string): UserProgress[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(USER_PROGRESS_KEY)
  const allProgress: UserProgress[] = data ? JSON.parse(data) : []
  return allProgress.filter(p => p.user_id === userId)
}

export const updateUserProgress = (progress: Omit<UserProgress, 'id' | 'started_at'>): UserProgress => {
  const allProgress = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || '[]')
  const existingIndex = allProgress.findIndex((p: UserProgress) => 
    p.user_id === progress.user_id && p.lesson_id === progress.lesson_id
  )
  
  const updatedProgress: UserProgress = {
    ...progress,
    id: existingIndex >= 0 ? allProgress[existingIndex].id : Date.now().toString(),
    started_at: existingIndex >= 0 ? allProgress[existingIndex].started_at : new Date().toISOString()
  }
  
  if (existingIndex >= 0) {
    allProgress[existingIndex] = updatedProgress
  } else {
    allProgress.push(updatedProgress)
  }
  
  localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(allProgress))
  return updatedProgress
}

// Chat sessions functions
export const getChatSessions = (userId: string): ChatSession[] => {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(CHAT_SESSIONS_KEY)
  const allSessions: ChatSession[] = data ? JSON.parse(data) : []
  return allSessions.filter(s => s.user_id === userId)
}

export const saveChatSession = (session: Omit<ChatSession, 'id' | 'created_at' | 'updated_at'>): ChatSession => {
  const allSessions = JSON.parse(localStorage.getItem(CHAT_SESSIONS_KEY) || '[]')
  const newSession: ChatSession = {
    ...session,
    id: Date.now().toString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
  
  allSessions.push(newSession)
  localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(allSessions))
  return newSession
}

export const updateChatSession = (sessionId: string, messages: ChatSession['messages']): void => {
  const allSessions = JSON.parse(localStorage.getItem(CHAT_SESSIONS_KEY) || '[]')
  const sessionIndex = allSessions.findIndex((s: ChatSession) => s.id === sessionId)
  
  if (sessionIndex >= 0) {
    allSessions[sessionIndex].messages = messages
    allSessions[sessionIndex].updated_at = new Date().toISOString()
    localStorage.setItem(CHAT_SESSIONS_KEY, JSON.stringify(allSessions))
  }
}
