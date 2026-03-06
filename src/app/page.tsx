'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, MessageCircle, Trophy, Upload, Sparkles, Users, Target } from 'lucide-react'
import { Toaster } from '@/components/ui/toaster'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Toaster />
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">English Learning App</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/lessons">
                <Button variant="ghost">Lessons</Button>
              </Link>
              <Link href="/chat">
                <Button variant="ghost">Practice</Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Master English with <span className="text-blue-600">New Round-Up Starter</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Interactive grammar lessons powered by AI. Upload your PDF and start learning with personalized exercises and instant feedback.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/lessons">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Start Learning
              </Button>
            </Link>
            <Link href="/admin/upload">
              <Button size="lg" variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload PDF
              </Button>
            </Link>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5 text-blue-600" />
                Interactive Lessons
              </CardTitle>
              <CardDescription>
                Step-by-step grammar explanations with examples and exercises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Clear grammar explanations</li>
                <li>• Interactive exercises</li>
                <li>• Progress tracking</li>
                <li>• Instant feedback</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
                AI-Powered Learning
              </CardTitle>
              <CardDescription>
                Personalized exercises and intelligent tutoring
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• AI-generated exercises</li>
                <li>• Grammar explanations</li>
                <li>• Extra examples</li>
                <li>• Adaptive difficulty</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="mr-2 h-5 w-5 text-green-600" />
                Conversation Practice
              </CardTitle>
              <CardDescription>
                Chat with AI tutor for real-time English practice
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Real-time chat</li>
                <li>• Grammar corrections</li>
                <li>• Conversation topics</li>
                <li>• Pronunciation help</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="text-center bg-white rounded-lg shadow-sm p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h3>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100 rounded-full p-3 mb-4">
                <Upload className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-semibold mb-2">1. Upload PDF</h4>
              <p className="text-sm text-gray-600">Upload your New Round-Up Starter PDF</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-purple-100 rounded-full p-3 mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">2. AI Processing</h4>
              <p className="text-sm text-gray-600">AI parses and structures the content</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-green-100 rounded-full p-3 mb-4">
                <Target className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-semibold mb-2">3. Learn & Practice</h4>
              <p className="text-sm text-gray-600">Complete interactive lessons</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-orange-100 rounded-full p-3 mb-4">
                <Trophy className="h-6 w-6 text-orange-600" />
              </div>
              <h4 className="font-semibold mb-2">4. Track Progress</h4>
              <p className="text-sm text-gray-600">Monitor your learning journey</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p> 2024 English Learning App. Built with for English learners worldwide.</p>
            <p className="text-sm mt-2">Based on "New Round-Up Starter" by Pearson</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
