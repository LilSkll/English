'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { PDFParser } from '@/lib/pdf-parser'
import { toast } from '@/components/ui/use-toast'

export default function AdminUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'parsing' | 'saving' | 'success' | 'error'>('idle')
  const [parsedUnits, setParsedUnits] = useState<any[]>([])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || file.type !== 'application/pdf') {
      toast({
        title: 'Invalid file',
        description: 'Please upload a PDF file',
        variant: 'destructive'
      })
      return
    }

    setUploading(true)
    setStatus('uploading')
    setProgress(0)

    try {
      // Simulate upload progress
      for (let i = 0; i <= 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 50))
        setProgress(i)
      }

      setStatus('parsing')
      setProgress(40)

      // Parse the PDF
      const lessons = await PDFParser.parsePDFWithAI(file)
      setParsedUnits(lessons)
      
      setProgress(70)
      setStatus('saving')

      // Save to database via API
      for (let i = 0; i < lessons.length; i++) {
        const lesson = lessons[i]
        
        const response = await fetch('/api/lessons', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            unit: lesson.unit,
            title: lesson.title,
            explanation: lesson.explanation,
            examples: lesson.examples,
            exercises: lesson.exercises
          })
        })

        if (!response.ok) {
          throw new Error('Failed to save lesson')
        }

        // Update progress for each lesson saved
        const progressValue = 70 + (30 * (i + 1) / lessons.length)
        setProgress(progressValue)
      }

      setStatus('success')
      setProgress(100)

      toast({
        title: 'Success!',
        description: `Successfully uploaded and parsed ${lessons.length} lessons`
      })

    } catch (error) {
      console.error('Upload error:', error)
      setStatus('error')
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'uploading':
      case 'parsing':
      case 'saving':
        return <Upload className="h-8 w-8 animate-pulse text-blue-500" />
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />
      case 'error':
        return <AlertCircle className="h-8 w-8 text-red-500" />
      default:
        return <FileText className="h-8 w-8 text-gray-400" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'uploading':
        return 'Uploading PDF...'
      case 'parsing':
        return 'Parsing PDF content...'
      case 'saving':
        return 'Saving lessons to database...'
      case 'success':
        return 'Upload completed successfully!'
      case 'error':
        return 'Upload failed'
      default:
        return 'Ready to upload'
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Grammar Book PDF
            </CardTitle>
            <CardDescription>
              Upload the "New Round-Up Starter" PDF to automatically extract and create lessons.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              {getStatusIcon()}
              <p className="mt-2 text-sm text-gray-600">
                {getStatusText()}
              </p>
              
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="pdf-upload"
              />
              
              <Button
                asChild
                disabled={uploading}
                className="mt-4"
              >
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  {uploading ? 'Processing...' : 'Choose PDF File'}
                </label>
              </Button>
            </div>

            {/* Progress Bar */}
            {uploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Results */}
            {status === 'success' && parsedUnits.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Parsed Lessons</h3>
                <div className="grid gap-2">
                  {parsedUnits.map((unit) => (
                    <div key={unit.unit} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <span className="font-medium">Unit {unit.unit}</span>
                        <span className="ml-2 text-sm text-gray-600">{unit.title}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {unit.examples.length} examples, {unit.exercises.length} exercises
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Instructions:</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Make sure you have the "New Round-Up Starter" PDF file</li>
                <li>Click "Choose PDF File" and select your file</li>
                <li>The system will automatically parse units, grammar explanations, examples, and exercises</li>
                <li>Parsed lessons will be saved to the database</li>
                <li>Review the parsed lessons before making them available to students</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
