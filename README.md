# EduSlide

EduSlide turns documents (PDF, DOCX, TXT) into ready-to-edit slide decks. Upload a document, let AI generate a structured presentation from its content, then preview, edit, and export it as a PPTX file.

## Features

- Document upload and parsing for PDF, DOCX, and plain text
- AI-powered slide deck generation from extracted document text, with automatic fallback across multiple API keys and models
- Per-user generation cooldown to manage rate limits
- Automatic image suggestions sourced from Pexels and Unsplash
- Presentation preview, editing, and management dashboard
- PPTX export
- Supabase-based authentication (email/password and OAuth) with row-level data access
- Plan-based usage limits (free, pro, team) with Razorpay-powered billing and upgrades
- Admin panel for managing users, content, billing, analytics, reports, and logs

## Tech Stack

| Purpose | Technology |
| --- | --- |
| Framework | [Next.js](https://nextjs.org) (App Router), React 19, TypeScript |
| Backend & Auth | [Supabase](https://supabase.com) (Postgres, auth, storage, row-level security) |
| AI generation | [Gemini](https://ai.google.dev) via its OpenAI-compatible endpoint, using the [openai](https://www.npmjs.com/package/openai) SDK |
| Payments | [Razorpay](https://razorpay.com) |
| PPTX export | [pptxgenjs](https://github.com/gitbrent/PptxGenJS) |
| Document parsing | [pdf-parse](https://www.npmjs.com/package/pdf-parse), [mammoth](https://www.npmjs.com/package/mammoth) |
| Styling | Tailwind CSS |

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Supabase project
- A Gemini API key (one or more, for fallback rotation)
- A Razorpay account (for billing and plan upgrades)
- Pexels and Unsplash API keys (optional, used for slide images)

### Environment Variables

Create a `.env` file in the project root with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

GEMINI_API_KEY=
GEMINI_API_KEY_2=
GEMINI_MODEL=

RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NEXT_PUBLIC_RAZORPAY_KEY_ID=

PEXELS_API_KEY=
UNSPLASH_ACCESS_KEY=
UNSPLASH_SECRET_KEY=
```

`GEMINI_API_KEY_2` and `GEMINI_MODEL` are optional. `GEMINI_API_KEY_2` gives the generator a second key to fall back to once the first is rate-limited; `GEMINI_MODEL` overrides the default model fallback chain.

Never commit a populated `.env` file — it holds live secrets. Confirm `.env` is listed in `.gitignore` before pushing.

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
  admin/                Admin panel: users, content, billing, analytics, reports, logs, settings
  api/
    razorpay/             Razorpay payment verification and failure handling
  auth/                 Authentication callback handling
  components/           UI components for the dashboard, auth, and landing page
  dashboard/            Authenticated dashboard pages
    upload/               Document upload
    documents/            Uploaded document management
    presentations/        Generated deck preview, editing, and PPTX export
    billing/              Plan status, upgrades, and payment history
    analytics/            Usage analytics
    settings/             Account settings
  lib/
    dashboard/            Document parsing, deck generation, PPTX export, plan limits, Razorpay actions, Supabase queries
    supabase/             Supabase client setup (browser, server, admin)
  login/, signup/         Authentication pages
supabase/migrations/    Database schema migrations
```

## Available Scripts

- `npm run dev` - start the development server
- `npm run build` - build for production
- `npm run start` - run the production build
- `npm run lint` - run ESLint
