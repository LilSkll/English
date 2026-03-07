import * as pdfjsLib from 'pdfjs-dist'
import { Exercise, Lesson } from './openai'

// Configure PDF.js worker for Next.js compatibility
if (typeof window !== 'undefined') {
  try {
    // Try unpkg CDN first
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`
  } catch (error) {
    console.warn('Failed to set PDF worker from CDN, using fallback')
    // Fallback to jsdelivr
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`
  }
}

export interface ParsedUnit {
  unit: number
  title: string
  explanation: string
  examples: string[]
  exercises: Exercise[]
  rawText: string
}

export class PDFParser {
  private static readonly UNIT_PATTERN = /Unit\s+(\d+)/gi
  private static readonly GRAMMAR_BOX_PATTERN = /Grammar\s*Box|Grammar\s*box/gi
  private static readonly EXAMPLE_PATTERN = /(?:For\s+example|Examples?|e\.g\.|For\s+instance)[:\.\n]/gi
  private static readonly EXERCISE_PATTERNS = {
    fill_blank: /_+|\(\s*\)|\[\s*\]/gi,
    multiple_choice: /\([a-d]\)|[A-D]\)/gi,
    rewrite: /Rewrite|Correct|Change/gi,
    match: /Match|Connect/gi,
    correction: /Correct\s+the\s+mistake|Find\s+the\s+error/gi
  }

  static async parsePDF(file: File): Promise<ParsedUnit[]> {
    try {
      console.log('Starting PDF text extraction...')
      const arrayBuffer = await file.arrayBuffer()
      console.log('PDF loaded, size:', arrayBuffer.byteLength)
      
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
      console.log('PDF document opened, pages:', pdf.numPages)
      
      const fullText = await this.extractFullText(pdf)
      console.log('Text extraction completed, length:', fullText.length)
      
      console.log('Starting unit parsing...')
      const units = this.parseUnitsFromText(fullText)
      console.log('Unit parsing completed, units found:', units.length)
      
      return units
    } catch (error) {
      console.error('Error parsing PDF:', error)
      throw new Error(`Failed to parse PDF file: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  private static async extractFullText(pdf: any): Promise<string> {
    let fullText = ''
    
    try {
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        if (pageNum % 5 === 1) {
          console.log(`Extracting text from page ${pageNum}/${pdf.numPages}`)
        }
        
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ')
        fullText += pageText + '\n'
      }
    } catch (error) {
      console.error('Error extracting text from PDF:', error)
      throw error
    }
    
    return fullText
  }

  private static parseUnitsFromText(fullText: string): ParsedUnit[] {
    const units: ParsedUnit[] = []
    const unitSections = this.splitIntoUnits(fullText)
    
    for (const section of unitSections) {
      const unit = this.parseUnitSection(section)
      if (unit) {
        units.push(unit)
      }
    }
    
    return units
  }

  private static splitIntoUnits(text: string): string[] {
    const sections: string[] = []
    let currentSection = ''
    let currentUnit = 0
    
    const lines = text.split('\n')
    
    for (const line of lines) {
      const unitMatch = line.match(this.UNIT_PATTERN)
      
      if (unitMatch) {
        if (currentSection.trim()) {
          sections.push(currentSection.trim())
        }
        currentSection = line
        currentUnit = parseInt(unitMatch[1])
      } else if (currentUnit > 0) {
        currentSection += '\n' + line
      }
    }
    
    if (currentSection.trim()) {
      sections.push(currentSection.trim())
    }
    
    return sections
  }

  private static parseUnitSection(sectionText: string): ParsedUnit | null {
    const unitMatch = sectionText.match(this.UNIT_PATTERN)
    if (!unitMatch) return null
    
    const unit = parseInt(unitMatch[1])
    const lines = sectionText.split('\n').filter(line => line.trim())
    
    // Extract title (usually after Unit X)
    let title = `Unit ${unit}`
    for (let i = 0; i < Math.min(3, lines.length); i++) {
      if (lines[i].includes('Unit') && lines[i + 1]) {
        title = lines[i + 1].trim()
        break
      }
    }
    
    // Extract explanation (Grammar Box content)
    const explanation = this.extractExplanation(sectionText)
    
    // Extract examples
    const examples = this.extractExamples(sectionText)
    
    // Extract exercises
    const exercises = this.extractExercises(sectionText)
    
    return {
      unit,
      title,
      explanation,
      examples,
      exercises,
      rawText: sectionText
    }
  }

  private static extractExplanation(text: string): string {
    const grammarBoxMatch = text.match(/Grammar\s*Box.*?(?=Examples?|Exercise|\n\n|$)/gi)
    if (grammarBoxMatch) {
      return grammarBoxMatch[0].replace(/Grammar\s*Box/gi, '').trim()
    }
    
    // Fallback: Look for content between Unit title and examples
    const lines = text.split('\n')
    let explanationStart = -1
    
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(this.UNIT_PATTERN) && i + 1 < lines.length) {
        explanationStart = i + 2 // Skip unit line and title
        break
      }
    }
    
    if (explanationStart >= 0) {
      let explanation = ''
      for (let i = explanationStart; i < lines.length; i++) {
        const line = lines[i].trim()
        if (line.match(this.EXAMPLE_PATTERN) || line.toLowerCase().includes('exercise')) {
          break
        }
        if (line) {
          explanation += line + ' '
        }
      }
      return explanation.trim()
    }
    
    return 'Grammar explanation will be added here.'
  }

  private static extractExamples(text: string): string[] {
    const examples: string[] = []
    const lines = text.split('\n')
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      
      if (line.match(this.EXAMPLE_PATTERN)) {
        // Look for example sentences after the marker
        for (let j = i + 1; j < Math.min(i + 6, lines.length); j++) {
          const exampleLine = lines[j].trim()
          if (exampleLine && !exampleLine.toLowerCase().includes('exercise') && 
              !exampleLine.match(this.UNIT_PATTERN) && 
              exampleLine.length > 5 && exampleLine.length < 100) {
            examples.push(exampleLine)
          }
        }
      }
    }
    
    // Fallback: Look for sentences that look like examples
    if (examples.length === 0) {
      for (const line of lines) {
        if (line.includes('.') && line.length > 10 && line.length < 80 && 
            !line.toLowerCase().includes('exercise') && 
            !line.match(this.UNIT_PATTERN)) {
          examples.push(line.trim())
        }
      }
    }
    
    return examples.slice(0, 5) // Limit to 5 examples
  }

  private static extractExercises(text: string): Exercise[] {
    const exercises: Exercise[] = []
    const lines = text.split('\n')
    
    for (const line of lines) {
      const trimmedLine = line.trim()
      
      // Fill in the blanks
      if (trimmedLine.match(this.EXERCISE_PATTERNS.fill_blank)) {
        exercises.push({
          type: 'fill_blank',
          question: trimmedLine,
          answer: '' // Will need manual/AI filling
        })
      }
      
      // Multiple choice (basic detection)
      if (trimmedLine.includes('(') && trimmedLine.includes(')') && 
          (trimmedLine.includes('a)') || trimmedLine.includes('b)'))) {
        exercises.push({
          type: 'multiple_choice',
          question: trimmedLine,
          options: [], // Will need parsing
          correct: ''
        })
      }
      
      // Sentence correction
      if (trimmedLine.match(this.EXERCISE_PATTERNS.correction)) {
        exercises.push({
          type: 'sentence_correction',
          question: trimmedLine,
          answer: ''
        })
      }
    }
    
    return exercises
  }

  static async parsePDFWithAI(file: File): Promise<Lesson[]> {
    try {
      console.log('Starting PDF parsing...')
      const parsedUnits = await this.parsePDF(file)
      console.log('PDF parsed, units found:', parsedUnits.length)
      
      const lessons: Lesson[] = []
      
      for (let i = 0; i < parsedUnits.length; i++) {
        const unit = parsedUnits[i]
        console.log(`Processing unit ${i + 1}/${parsedUnits.length}: ${unit.title}`)
        
        try {
          // Always use original exercises first, skip AI generation for reliability
          lessons.push({
            unit: unit.unit,
            title: unit.title,
            explanation: unit.explanation,
            examples: unit.examples,
            exercises: unit.exercises
          })
          
          // Optional: Try AI generation in background but don't fail if it doesn't work
          if (unit.exercises.length < 3) {
            try {
              console.log('Attempting to generate AI exercises for unit:', unit.title)
              
              // Add timeout for AI generation
              const aiPromise = import('./openai').then(({ generateExercises }) => 
                generateExercises(unit.title, unit.unit)
              )
              
              const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('AI generation timeout')), 10000) // Reduced timeout
              )
              
              const aiExercises = await Promise.race([aiPromise, timeoutPromise]) as Exercise[]
              
              // If AI generation succeeded, replace exercises
              if (aiExercises.length > 0) {
                lessons[lessons.length - 1].exercises = aiExercises
                console.log('AI exercises generated successfully')
              }
            } catch (aiError) {
              console.log('AI generation failed, using original exercises:', aiError)
              // Keep original exercises, don't fail the whole process
            }
          }
        } catch (error) {
          console.error(`Error processing unit ${unit.unit}:`, error)
          // Add unit anyway with original exercises
          lessons.push({
            unit: unit.unit,
            title: unit.title,
            explanation: unit.explanation,
            examples: unit.examples,
            exercises: unit.exercises
          })
        }
      }
      
      console.log('Completed processing all units')
      return lessons
    } catch (error) {
      console.error('PDF parsing failed:', error)
      throw new Error(`PDF parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }
}
