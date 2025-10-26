# Ai-Code-Nextjs-Starter

Ai-Code-Nextjs-Starter is a full-stack build template based on Next.js + Prisma + PostgreSQL. Through systematic optimization of architecture and data flow, it accelerates development while intelligently reducing Token/request/context consumption, saving you both time and money.

## Project Mission

- **Maximize AI Budget**: Significantly reduce prompt and inference costs while maintaining engineering quality
- **Quick to Use**: Authentication, articles, personal center, and console ready out of the box
- **Simple and Scalable**: Keep the core lightweight, add features as needed

## Core Features

- **Cost-Oriented**: Systematically reduce Token/request count/context length from architecture to data flow
- **Clear Four-Layer Division**: app / features / shared / lib → Clear task boundaries, smaller AI-assisted change scope
- **Server-First with Built-in Cache**: SSR/static generation + revalidate + React Query cache, reduce duplicate generation
- **Response Body Slimming**: Prisma select/include returns only necessary fields, compressing context and network costs
- **Contract-Driven Service**: Unified API/Service design, AI output more reusable, changes more controllable
- **AI-Friendly Standards**: Unified path aliases and naming/export rules, more precise retrieval and completion
- **Deploy Ready**: Docker/Vercel one-click to cloud, environment variable templates and migration processes simplify "deployment dialogue" costs

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + React 19 + TypeScript
- **Data**: Prisma ORM + PostgreSQL
- **Authentication**: NextAuth v5 (JWT)
- **State & Forms**: React Query + react-hook-form + zod
- **UI**: Tailwind CSS + Radix UI
- **Deployment**: Docker + Nginx / Vercel

## 🚀 Quick Start

### Requirements

- Node.js >= 18
- pnpm >= 8
- PostgreSQL >= 14

### Local Development

```bash
# Install dependencies
pnpm install

# Environment variables (refer to .env.example)
cp .env.example .env.local

# Generate Prisma Client
pnpm prisma generate

# Development database migration + seed data
pnpm prisma migrate dev
pnpm prisma db seed

# Local development
pnpm dev
# Visit http://localhost:3000
```

### Environment Variables (Required)

```bash
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
JWT_SECRET="$(openssl rand -base64 32)"
```

## Directory Structure (AI-Friendly)

```bash
src/
├─ app/        # Pages/routes (SSR/SSG, API)
├─ features/   # Business modules (components/hooks/services/types)
├─ shared/     # Common UI/layout/utilities
├─ lib/        # Core libraries (database/auth/logging/errors)
prisma/        # Data models and migrations
docs/          # Architecture/organization/deployment docs
```

## Deployment Overview

### Docker (Recommended)

```bash
# Start (includes Postgres)
docker-compose up -d

# Generate Client / Migrate / Seed
docker-compose exec app pnpm prisma generate
docker-compose exec app pnpm prisma migrate deploy
docker-compose exec app pnpm prisma db seed

# View logs / Restart
docker-compose logs -f app
docker-compose restart app
```

### Vercel (Cloud Deployment)

```bash
# Push code to trigger automatic deployment
git push origin main

# Configure environment variables in Vercel console
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=...
JWT_SECRET=...
```

## Documentation

- **Architecture**: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)
- **Project Structure**: [docs/PROJECT_STRUCTURE.md](./docs/PROJECT_STRUCTURE.md)
- **Deployment Guide**: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

## License

Apache License 2.0

---

**Version**: 1.0.0  
**Updated**: 2025-10-01
