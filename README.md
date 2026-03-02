# SPREAD VERSE V4

A private partner platform for banking CRM — multi-user lead management system with AI-powered recommendations, call tracking, EMI calculations, task and campaign management, analytics, and advanced data import.

## Tech Stack

| Layer      | Technology                                        |
|------------|---------------------------------------------------|
| Frontend   | React 18, TypeScript, Tailwind CSS, Shadcn/UI     |
| Backend    | Express.js, Node.js, TypeScript                   |
| Database   | PostgreSQL via Drizzle ORM                        |
| Auth       | Session-based (express-session + bcrypt)          |
| AI         | Google Gemini API                                 |

## Monorepo Structure

```
spreadverse-temp-live/
├── client/               # React frontend (Vite)
│   ├── index.html
│   └── src/
│       ├── components/   # Shared UI components (Shadcn/UI)
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # Utilities & query client
│       └── pages/        # Route pages
├── server/               # Express.js backend
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database access layer
│   └── db.ts             # Drizzle ORM connection
├── shared/               # Shared types & schema (used by both)
│   ├── schema.ts         # Drizzle ORM table definitions + Zod schemas
│   └── types.ts          # Shared TypeScript types
├── docs/                 # Project documentation
│   ├── replit.md         # Architecture & user preferences
│   └── design_guidelines.md
├── script/               # Utility scripts
│   └── seed.ts           # Database seeder
└── [config files]        # vite.config.ts, tsconfig.json, drizzle.config.ts, etc.
```

## Quick Start

```bash
# Install dependencies
npm install

# Push database schema
npm run db:push

# Seed default admin user
npx tsx script/seed.ts

# Start development server
npm run dev
```

Default credentials after seeding: `admin` / `admin123`

## Environment Variables

| Variable          | Description                          |
|-------------------|--------------------------------------|
| `DATABASE_URL`    | PostgreSQL connection string         |
| `SESSION_SECRET`  | Secret for express-session           |
| `GEMINI_API_KEY`  | Google Gemini AI API key (optional)  |