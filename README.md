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

Run these commands **in order** from the VS Code terminal (project root). Confirm the expected output for each step before moving to the next.

---

### Step 1 — Install all packages

```bash
npm install
```

**Expected success output:**

```
added <N> packages, and audited <N> packages in <Xs>
found 0 vulnerabilities
```

> No `npm ERR!` lines should appear. Minor warnings about optional peer deps are okay.

---

### Step 2 — Push schema to Supabase database

```bash
npm run db:push
```

**Expected success output:**

```
[✓] Changes applied
```

> Drizzle Kit will list the tables it created or updated (e.g. `workspaces`, `users`, `leads`, …) and end without any error. A line like `Everything's up to date 🚀` may also appear if the schema was already in sync.

---

### Step 3 — Run seed script

```bash
npm run db:seed
```

**Expected success output:**

```
Seeding database…
✅ Seeded: admin / admin123
```

> Both lines must appear. If you see a database connection error, verify that `DATABASE_URL` is set correctly in your `.env` file.

---

### Step 4 — Start dev server

```bash
npm run dev
```

**Expected success output:**

```
[server] SPREAD VERSE V4 running on port 5000
```

> The terminal should stay open (server keeps running). Open `http://localhost:5000` in your browser and log in with `admin` / `admin123`.

---

Default credentials after seeding: `admin` / `admin123`

## Environment Variables

| Variable          | Description                          |
|-------------------|--------------------------------------|
| `DATABASE_URL`    | PostgreSQL connection string         |
| `SESSION_SECRET`  | Secret for express-session           |
| `GEMINI_API_KEY`  | Google Gemini AI API key (optional)  |