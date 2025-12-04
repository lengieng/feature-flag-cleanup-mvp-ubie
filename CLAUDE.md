# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Feature Flag Cleanup MVP - A Next.js application that automates feature flag cleanup by detecting expired flags and creating GitHub issues assigned to Copilot for automatic code removal.

## Plan & Review

### Before starting work

- Always be in plan mode to make a plan
- After getting the plan, make sure you write the plan to the project root ./.claude/tasks/TASK_NAME.md. TASK_NAME should reflect the actual task.
- The plan should be a detailed implementation plan and the reasoning behind them, as well as tasks broken down.
- If the task requires external knowledge or a certain package, also research to get latest knowledge (Use Task tool for research)
- Don't over plan it, always think MVP.
- Once you write the plan, firstly ask me to review it. Do not continue until I approve the plan.

### While implementing

- You should update the plan as you work.
- After you complete tasks in the plan, you should update and append detailed descriptions of the changes you made, so following tasks can be easily handed over to other engineers.

## Common Commands

```bash
npm run dev          # Start Next.js dev server (http://localhost:3000)
npm run build        # Build for production
npm run lint         # Run ESLint

# Database
npm run db:start     # Start PostgreSQL via Docker Compose
npm run db:stop      # Stop PostgreSQL
npm run db:setup     # Generate Prisma client, push schema, seed data
npm run db:reset     # Force reset database and reseed
npm run db:studio    # Open Prisma Studio GUI

# Full setup
npm run setup        # Install deps, start DB, setup schema & seed
```

## Architecture

### Core Flow

1. **Scan** (`POST /api/scan`) - Checks all active flags against expiration rules, marks expired ones
2. **Cleanup** (`POST /api/cleanup`) - Creates GitHub issue for an expired flag, records cleanup job

### Key Modules

- `lib/cleanup-rules.ts` - Expiration detection logic with configurable rules (currently: 100% rollout + no evaluations for 30+ days)
- `lib/github.ts` - Octokit integration for creating cleanup issues with structured instructions
- `lib/db.ts` - Prisma client singleton with hot-reload support
- `lib/types.ts` - TypeScript interfaces for API responses and re-exports Prisma enums

### API Routes

- `app/api/flags/route.ts` - GET all flags with cleanup jobs
- `app/api/scan/route.ts` - POST triggers expiration scan, redirects to dashboard
- `app/api/cleanup/route.ts` - POST creates GitHub issue for a specific flag

### Data Models (Prisma)

- `Flag` - Feature flag with status lifecycle: ACTIVE → EXPIRED → CLEANUP_PENDING → CLEANUP_IN_PROGRESS → CLEANED_UP
- `CleanupJob` - Tracks cleanup progress: PENDING → ISSUE_CREATED → IN_PROGRESS → PR_OPENED → COMPLETED/FAILED

### Frontend Components

- `app/page.tsx` - Main dashboard, fetches flags client-side
- `components/flag-table.tsx` - Displays flags with cleanup actions
- `components/stats-cards.tsx` - Summary statistics
- `components/flag-status-badge.tsx` - Status badge component

## Environment Variables

Required in `.env`:

- `DATABASE_URL` - PostgreSQL connection string
- `GITHUB_TOKEN` - GitHub PAT with `repo` scope (Issues read/write)
- `GITHUB_REPO_OWNER` - Target repository owner
- `GITHUB_REPO_NAME` - Target repository name
- `ANTHROPIC_API_KEY` - Anthropic API key for AI chat functionality

## Tech Stack

- Next.js 16 with App Router
- TypeScript 5
- Prisma ORM with PostgreSQL
- Tailwind CSS v4
- Octokit for GitHub API
- LangChain + Anthropic SDK for AI chat
- Vercel AI SDK (`ai` package)
- react-markdown for rendering AI responses
- Zod for schema validation
