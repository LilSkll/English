'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'

export default function AdminUpload() {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'parsing' | 'saving' | 'success' | 'error'>('idle')
  const [parsedUnits, setParsedUnits] = useState<any[]>([])
  const [parserLoaded, setParserLoaded] = useState(false)

  useEffect(() => {
    // Dynamically import PDF parser only on client side
    import('@/lib/pdf-parser').then(() => {
      setParserLoaded(true)
    }).catch(() => {
      setParserLoaded(false)
    })
  }, [])

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

    // Add file size check (50MB limit to prevent crashes)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      toast({
        title: 'File too large',
        description: 'Please upload a PDF file smaller than 50MB',
        variant: 'destructive'
      })
      return
    }

    if (!parserLoaded) {
      toast({
        title: 'Error',
        description: 'PDF parser not loaded',
        variant: 'destructive'
      })
      return
    }

    setUploading(true)
    setStatus('uploading')
    setProgress(0)

    try {
      // Add memory management
      console.log('=== Starting Safe PDF Upload Process ===')
      console.log('File:', file.name, 'Size:', (file.size / 1024 / 1024).toFixed(2) + 'MB')
      
      // Clear any previous data to free memory
      setParsedUnits([])
      
      // Simulate upload progress with smaller steps
      for (let i = 0; i <= 30; i++) {
        await new Promise(resolve => setTimeout(resolve, 30)) // Reduced timeout
        setProgress(i)
        
        // Add memory check every 10 steps
        if (i % 10 === 0) {
          if (performance && (performance as any).memory) {
            const memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024
            console.log(`Memory usage: ${memoryUsage.toFixed(2)}MB`)
            
            // Warn if memory usage is high
            if (memoryUsage > 500) { // 500MB warning threshold
              console.warn('High memory usage detected, consider using smaller files')
            }
          }
        }
      }

      setStatus('parsing')
      setProgress(40)

      // Dynamically import and use PDF parser with error boundaries
      let lessons: any[] = []
      try {
        console.log('Importing PDFParser...')
        const { PDFParser } = await import('@/lib/pdf-parser')
        console.log('PDFParser imported successfully')
        
        // Add timeout to prevent infinite hanging
        const parsePromise = PDFParser.parsePDFWithAI(file)
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('PDF parsing timeout - file may be too large')), 60000) // 60 second timeout
        )
        
        lessons = await Promise.race([parsePromise, timeoutPromise]) as any[]
        console.log('=== PDF Parsing Completed ===')
        console.log('Lessons created:', lessons.length)
        
        if (!lessons || lessons.length === 0) {
          throw new Error('No lessons could be extracted from the PDF')
        }
        
        setParsedUnits(lessons)
      } catch (error) {
        console.error('=== PDF Parsing Failed ===')
        console.error('Error:', error)
        
        // Provide specific error messages
        if (error instanceof Error) {
          if (error.message.includes('timeout')) {
            throw new Error('PDF parsing took too long. Try a smaller PDF or check file format.')
          } else if (error.message.includes('memory')) {
            throw new Error('Not enough memory to process this PDF. Try a smaller file.')
          } else if (error.message.includes('Failed to parse')) {
            throw new Error('PDF file may be corrupted or not supported. Try a different PDF.')
          }
        }
        
        throw new Error(`PDF parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
      
      setProgress(70)
      setStatus('saving')

      // Save to database via API with error handling
      console.log('=== Starting Database Save ===')
      for (let i = 0; i < lessons.length; i++) {
        console.log(`Saving lesson ${i + 1}/${lessons.length}`)
        const lesson = lessons[i]
        
        try {
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
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.error || 'Failed to save lesson')
          }
        } catch (saveError) {
          console.error(`Failed to save lesson ${i + 1}:`, saveError)
          throw new Error(`Failed to save lesson ${i + 1}: ${saveError instanceof Error ? saveError.message : 'Unknown error'}`)
        }

        // Update progress for each lesson saved
        const progressValue = 70 + (30 * (i + 1) / lessons.length)
        setProgress(progressValue)
        
        // Add small delay to prevent overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      console.log('=== All Lessons Saved Successfully ===')

      setStatus('success')
      setProgress(100)

      toast({
        title: 'Success!',
        description: `Successfully uploaded and parsed ${lessons.length} lessons`
      })

    } catch (error) {
      console.error('=== Upload Process Failed ===')
      console.error('Error:', error)
      setStatus('error')
      
      // Show user-friendly error messages
      let errorMessage = 'An error occurred during upload'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast({
        title: 'Upload failed',
        description: errorMessage,
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
      // Force garbage collection if available
      if (window.gc) {
        window.gc()
      }
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
                disabled={uploading || !parserLoaded}
                className="hidden"
                id="pdf-upload"
              />
              
              <Button
                asChild
                disabled={uploading || !parserLoaded}
                className="mt-4"
              >
                <label htmlFor="pdf-upload" className="cursor-pointer">
                  {uploading ? 'Processing...' : parserLoaded ? 'Choose PDF File' : 'Loading...'}
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
