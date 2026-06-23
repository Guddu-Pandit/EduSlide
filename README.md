# EduSlide

EduSlide turns documents (PDF, DOCX, TXT) into ready-to-edit slide decks. Upload a document, let AI generate a structured presentation from its content, then preview, edit, and export it as a PPTX file.

## Features

- Document upload and parsing for PDF, DOCX, and plain text
- AI-powered slide deck generation from extracted document text
- Automatic image suggestions sourced from Pexels and Unsplash
- Presentation preview and management dashboard
- PPTX export
- Supabase-based authentication (email/password and OAuth) with row-level data access
- Plan-based usage limits (free, pro, team)

## Tech Stack

- [Next.js](https://nextjs.org) (App Router) with React 19 and TypeScript
- [Supabase](https://supabase.com) for auth, database, and storage
- [OpenAI](https://platform.openai.com) for slide content generation
- [pptxgenjs](https://github.com/gitbrent/PptxGenJS) for PPTX file generation
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) and [mammoth](https://www.npmjs.com/package/mammoth) for document text extraction
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Supabase project
- An OpenAI API key
- Pexels and Unsplash API keys (optional, used for slide images)

### Environment Variables

Create a `.env` file in the project root with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

OPENAI_API_KEY=
OPENAI_MODEL=

PEXELS_API_KEY=
UNSPLASH_ACCESS_KEY=
UNSPLASH_SECRET_KEY=
```

### Database Setup

Apply the SQL migrations in `supabase/migrations` to your Supabase project, in order, using the Supabase CLI or the SQL editor.

### Install and Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
app/
  dashboard/          Authenticated dashboard pages (upload, documents, presentations, settings, billing, analytics)
  components/          UI components for the dashboard, auth, and landing page
  lib/
    dashboard/         Document parsing, deck generation, PPTX export, plan limits, and Supabase queries
    supabase/           Supabase client setup (browser, server, admin)
  login/, signup/, auth/  Authentication pages and callback handling
supabase/migrations/   Database schema migrations
```

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - build for production
- `npm run start` - run the production build
- `npm run lint` - run ESLint
