import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, MessageSquare, Trophy, Upload, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">English Learning</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link href="/lessons">Lessons</Link>
              </Button>
              <Button asChild>
                <Link href="/chat">Practice</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Master English Grammar with
            <span className="text-blue-600"> New Round-Up Starter</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Interactive lessons, AI-powered exercises, and conversation practice 
            based on the trusted Pearson grammar textbook.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/lessons">
                Start Learning
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/dashboard">View Dashboard</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Learn English
          </h3>
          <p className="text-lg text-gray-600">
            Comprehensive learning tools designed for beginner English students
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>Interactive Lessons</CardTitle>
              <CardDescription>
                Step-by-step grammar lessons with explanations, examples, and practice exercises
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/lessons">Browse Lessons</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageSquare className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>AI Conversation Practice</CardTitle>
              <CardDescription>
                Chat with an AI tutor that corrects your grammar and suggests better expressions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/chat">Start Chatting</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Trophy className="h-12 w-12 text-yellow-600 mb-4" />
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Monitor your learning progress, scores, and identify areas that need improvement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/dashboard">View Progress</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Admin Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              For Administrators
            </h3>
            <p className="text-gray-600 mb-6">
              Upload the New Round-Up Starter PDF to automatically generate interactive lessons
            </p>
            <Button asChild>
              <Link href="/admin/upload">Upload Grammar Book</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">
            Based on "New Round-Up Starter" by Pearson • Interactive English Learning Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
