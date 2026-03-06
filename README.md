# English Learning App - New Round-Up Starter

A full-stack English learning application based on the "New Round-Up Starter" grammar book by Pearson. This app converts the textbook content into interactive lessons with AI tutor features and exercises.

## Features

- **PDF Upload & Parsing**: Upload the New Round-Up Starter PDF to automatically extract and structure lessons
- **Interactive Lessons**: Step-by-step grammar explanations with examples and exercises
- **AI-Powered Exercises**: Generate additional exercises using OpenAI API when parsing is incomplete
- **AI Tutor**: Get grammar explanations, hints, and extra examples
- **Conversation Practice**: Chat with AI tutor for real-time English practice
- **Progress Tracking**: Monitor learning progress, scores, and identify weak areas
- **Modern UI**: Responsive design with TailwindCSS and shadcn/ui components

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS
- **Backend**: Next.js API routes
- **Storage**: Local storage (no database required)
- **AI**: OpenAI API
- **PDF Processing**: pdf-parse, pdfjs-dist
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key

### 1. Clone and Install

```bash
git clone https://github.com/LilSkll/English.git
cd English
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# OpenAI (only required)
OPENAI_API_KEY=your_openai_api_key
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### For Students

1. **Browse Lessons**: Visit `/lessons` to see all available grammar units
2. **Start Learning**: Click on any lesson to begin with grammar explanations
3. **Practice Exercises**: Complete interactive exercises to test understanding
4. **Chat Practice**: Use `/chat` to practice English conversation with AI tutor
5. **Track Progress**: Visit `/dashboard` to monitor learning progress

### For Administrators

1. **Upload PDF**: Use `/admin/upload` to upload and parse the grammar book
2. **Manage Lessons**: Review and edit parsed lessons if needed
3. **Monitor Usage**: Track student progress and engagement

## Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── admin/             # Admin pages
│   ├── api/               # API routes
│   ├── chat/              # Chat practice page
│   ├── dashboard/         # User dashboard
│   ├── lessons/           # Lesson pages
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   └── ui/                # Reusable UI components
├── lib/
│   ├── openai.ts          # OpenAI API functions
│   ├── pdf-parser.ts      # PDF parsing logic
│   ├── supabase.ts        # Local storage utilities
│   └── utils.ts           # Utility functions
└── types/                 # TypeScript type definitions
```

## Key Features Explained

### PDF Parsing System

The app automatically detects and parses:
- Unit numbers and titles
- Grammar box explanations
- Example sentences
- Exercise patterns (fill-in-blanks, multiple choice, sentence correction)

If automatic parsing is incomplete, the AI generates additional exercises matching the grammar topic.

### AI Tutor Features

- **Grammar Explanations**: Simple explanations for mistakes
- **Extra Examples**: Generates additional example sentences
- **Exercise Generation**: Creates practice exercises when needed
- **Conversation Practice**: Real-time chat with grammar corrections

### Data Storage

This version uses **local storage** instead of a database:
- Lessons are stored in server memory during runtime
- User progress is tracked in memory
- Chat sessions are stored temporarily
- No database setup required

## Deployment on Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `LilSkll/English`
4. Add environment variable:
   - `OPENAI_API_KEY`: Your OpenAI API key
5. Click "Deploy"

### 3. Upload the Grammar Book

1. Obtain the "New Round-Up Starter" PDF file
2. Navigate to `https://your-app.vercel.app/admin/upload`
3. Upload the PDF file
4. The system will automatically parse and create lessons

## API Endpoints

- `GET /api/lessons` - Fetch all lessons
- `POST /api/lessons` - Create new lesson
- `GET /api/lessons/[id]` - Fetch specific lesson
- `GET /api/user-progress` - Get user progress
- `POST /api/user-progress` - Update user progress
- `POST /api/chat` - Send chat message

## Environment Variables for Production

Add this in your Vercel dashboard:

```
OPENAI_API_KEY=your_openai_api_key
```

## Important Notes

- **No Database**: This version uses in-memory storage, which resets on redeployment
- **PDF File**: You need to provide your own "New Round-Up Starter" PDF file
- **OpenAI API**: Required for AI features like exercise generation and chat tutor
- **Local Development**: Data persists during development but resets on server restart

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is for educational purposes. The "New Round-Up Starter" content is copyrighted by Pearson.

## Support

For issues and questions:
1. Check the existing issues
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

---

Built with ❤️ for English learners worldwide.
