# AI Resume Builder

A modern AI-powered resume builder built with **Next.js**, **TypeScript**, **Tailwind CSS**, and the **OpenAI API**.

## Features

- 📝 **Form-based editor** — Structured sections for personal info, professional summary, work experience, education, and skills
- ✨ **AI enhancement** — Use the "AI Enhance" button on any section to improve your content with GPT-4o mini
- 👁️ **Live preview** — Real-time A4-format resume preview as you type
- 📄 **PDF export** — Download your finished resume as a professionally formatted PDF
- 📱 **Responsive** — Works on desktop and mobile

## Getting Started

### Prerequisites

- Node.js 18+
- An [OpenAI API key](https://platform.openai.com/api-keys) (optional — required for AI enhancement)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
cp .env.example .env.local
# Edit .env.local and add your OPENAI_API_KEY

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

> **Note:** The resume builder works fully without an API key — only the "AI Enhance" buttons require one.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| AI | [OpenAI API](https://platform.openai.com/) — GPT-4o mini |
| PDF | [jsPDF 4](https://github.com/parallax/jsPDF) |
| Icons | [Heroicons](https://heroicons.com/) |

## Project Structure

```
src/
├── app/
│   ├── api/enhance/route.ts   # AI enhancement API route
│   ├── layout.tsx
│   └── page.tsx               # Main app page
├── components/
│   ├── ResumeForm.tsx          # Tabbed form container
│   ├── ResumePreview.tsx       # Live preview component
│   └── sections/
│       ├── PersonalInfoSection.tsx
│       ├── SummarySection.tsx
│       ├── WorkExperienceSection.tsx
│       ├── EducationSection.tsx
│       └── SkillsSection.tsx
├── lib/
│   └── pdf.ts                  # PDF export utility
└── types/
    └── resume.ts               # TypeScript types
```
