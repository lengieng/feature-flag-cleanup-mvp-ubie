# Feature Flag Cleanup MVP

A demonstration of proactive feature flag cleanup automation using GitHub Copilot integration.

## 🎯 What This Demonstrates

This MVP showcases the **core differentiating feature** from the product vision:

- **Proactive cleanup detection** - Automated daily scans identify expired flags
- **End-to-end automation** - Creates GitHub issues assigned to Copilot for automatic code removal
- **Safety through transparency** - Detailed impact analysis in every cleanup task

## 🏗️ Architecture

- **Frontend:** Next.js 16 with TypeScript
- **Database:** PostgreSQL (Docker)
- **ORM:** Prisma
- **GitHub Integration:** Octokit
- **UI:** Tailwind CSS v4

## System Architecture

```
┌─────────────────────────┐
│      Daily Cron Job     │ (Cloudflare Workers - scheduled trigger)
│  Triggers at 2am daily  │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────────────┐
│  Cleanup Orchestrator           │ (Node.js/TypeScript Service)
│  ─────────────────────────────  │
│  1. Query flag database         │ (or Flag MCP server)
│  2. Apply expiration rules      │
│     • 100% rollout check        │
│     • 30+ days no evaluation    │
│  3. Generate impact analysis    │
│  4. Create GitHub issues        │
└───────────┬─────────────────────┘
            │
     ┌──────┴──────┐
     │             │
     ▼             ▼
┌──────────┐  ┌──────────────────────────┐
│ Flag DB  │  │  GitHub Issues API       │
│(Postgres)│  │  ─────────────────       │
│          │  │  • Create issue          │
│ Stores:  │  │  • Assign @copilot       │
│ • Flags  │  │    and owner (optional)  │
│ • Jobs   │  │  • Add labels            │
│          │  │  • Add metadata          │
└──────────┘  └──────────┬───────────────┘
                         │
                         ▼
              ┌────────────────────┐
              │ GitHub Copilot     │
              │ Coding Agent       │
              │ ────────────────── │
              │ • Reads issue      │
              │ • Analyzes code    │
              │ • Removes flags    │
              │ • Opens PR         │
              └──────────┬─────────┘
                         │
                         ▼
              ┌────────────────────┐
              │  Pull Request      │
              │  ────────────────  │
              │ • Impact analysis  │
              │ • Code changes     │
              │ • Awaits review    │
              └──────────┬─────────┘
                         │
                         ▼
              ┌────────────────────┐
              │  Human Review      │
              │  • Approve/reject  │
              │  • Request changes │
              └────────────────────┘
```

## Technology Stack

```
┌────────────────────────────────────────────────────────────────┐
│                         FRONTEND                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐     │
│  │   Next.js   │  │ TypeScript  │  │  Tailwind CSS v4    │     │
│  │     16      │  │      5      │  │                     │     │
│  └─────────────┘  └─────────────┘  └─────────────────────┘     │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                         BACKEND                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐     │
│  │  Next.js    │  │   Prisma    │  │      Octokit        │     │
│  │ API Routes  │  │     ORM     │  │  (GitHub API SDK)   │     │
│  └─────────────┘  └─────────────┘  └─────────────────────┘     │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                        DATABASE                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │             PostgreSQL 18 (Alpine)                      │   │
│  │          Running in Docker Container                    │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                GitHub API + Copilot                     │   │
│  │            (Issue creation & assignment)                │   │
│  └─────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT                                │
│  ┌─────────────┐  ┌────────────────┐  ┌─────────────────────┐  │
│  │   Docker    │  │ Docker Compose │  │    Local Dev        │  │
│  │  (Postgres) │  │  (Orchestrate) │  │  (localhost:3000)   │  │
│  └─────────────┘  └────────────────┘  └─────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

## 📋 Prerequisites

- Node.js 18+
- Docker & Docker Compose
- GitHub personal access token with `repo` scope (read/write to `Issues` permission) ([create one here](https://github.com/settings/personal-access-tokens))

## 🚀 Quick Start

### 1. Clone the repository

```bash
git clone <repo-url>
cd flag-cleanup-mvp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` and add your GitHub token:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/flag_cleanup"
GITHUB_TOKEN="ghp_your_token_here"  # ← Add your token
GITHUB_REPO_OWNER="your-username"   # ← Your GitHub username
GITHUB_REPO_NAME="test-repo"        # ← A test repo you own
```

### 4. Start the database

```bash
npm run db:start
```

Wait a few seconds for PostgreSQL to start, then:

### 5. Initialize the database

```bash
npm run db:setup
```

This will:

- Create database tables
- Seed with 5 mock flags (3 expired, 2 active)

### 6. Run the application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎬 Demo Flow

### 1. View Dashboard

- See 5 mock feature flags with different states
- Notice the stats cards showing totals

### 2. Run Cleanup Scan

- Click "Run Cleanup Scan" button
- System identifies flags matching expiration rules:
  - 100% rollout
  - No evaluations in 30+ days
- Page updates showing "Expired" status

### 3. Create Cleanup Issue

- Click "Create Cleanup Issue" on an expired flag
- GitHub issue is created and assigned to @copilot (Make sure your GitHub account has Copilot Pro/Pro+ subscription)
- Issue contains:
  - Flag details and analysis
  - Cleanup instructions
  - Safety checklist

### 4. View GitHub Issue

- Click "View Issue" to see the created GitHub issue
- In production, Copilot would:
  - Analyze the codebase
  - Remove flag code
  - Open a PR for review

## 📊 Database Schema

```
Flag
  - id, key, name, description
  - createdAt, createdBy
  - rolloutPercent, lastEvaluatedAt
  - status (ACTIVE, EXPIRED, CLEANUP_PENDING, CLEANUP_IN_PROGRESS, CLEANED_UP)

CleanupJob
  - id, flagId
  - githubIssueUrl, githubIssueNumber, githubPrUrl
  - status, triggeredAt, completedAt, errorMessage
```

## 🛠️ Available Scripts

```bash
npm run dev          # Start Next.js dev server
npm run db:start     # Start PostgreSQL (Docker)
npm run db:stop      # Stop PostgreSQL
npm run db:setup     # Create tables & seed data
npm run db:reset     # Reset database & reseed
npm run db:studio    # Open Prisma Studio (database GUI)
npm run setup        # Full setup (install + db + seed)
```

## 🎨 What's Real vs. Mocked

### ✅ Real Implementation

- PostgreSQL database with full schema
- GitHub API integration (creates real issues)
- Cleanup detection logic
- Complete UI workflow
- Prisma ORM with type safety

### 🔧 Mocked for Demo

- Feature flag evaluation (just static data)
- Cron job (manual button trigger via "Run Cleanup Scan" button instead)
- Copilot PR creation (would happen automatically in production)

## 🔍 Key Files

- `lib/cleanup-rules.ts` - Expiration detection logic
- `lib/github.ts` - GitHub issue creation
- `app/api/scan/route.ts` - Scan endpoint
- `app/api/cleanup/route.ts` - Cleanup endpoint
- `prisma/schema.prisma` - Database schema
- `prisma/seed.ts` - Mock data

## 🧪 Testing

To test with a real repository:

1. Create a test repository on GitHub
2. Update `.env` with your repo details
3. Run the demo
4. Check your repo's Issues tab to see the created issue

## 🐛 Troubleshooting

**Database won't start:**

```bash
docker-compose down -v  # Remove old volumes
docker-compose up -d    # Start fresh
```

**"GITHUB_TOKEN is not set" error:**

- Make sure `.env` exists and has your token
- Restart the dev server after adding the token

**Can't create issues:**

- Verify your token has `repo` scope
- Check that the repository exists and you have write access

**Validation Failed: {"value":["copilot"],"resource":"Issue","field":"assignees","code":"invalid"}:**

- Make sure your GitHub account has Copilot Pro/Pro+
- If not, modify lib/github.ts and replace `assignees: ['copilot']` with `assignees: ['YOUR_USERNAME']` to bypass this error

## 📝 Notes

- This is a demo MVP, not production code
- The database resets when you run `npm run db:reset`
- GitHub issues created during demo should be manually closed after testing

---

Built by Lengieng Ing for Ubie Product Development Interview
