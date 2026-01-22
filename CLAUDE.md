# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**ConvoAI Studio** - A proprietary conversational AI platform by NR8R (Narrator Studio) for creating real-time, human-like multimodal video conversations with AI replicas using the Tavus API.

**Tech Stack**: Next.js 16 (App Router), React 19, TypeScript, Supabase (Auth + Database), Tavus API, Tailwind CSS 4

**Core Purpose**: Admin dashboard for managing demo projects that combine Tavus personas and replicas, with shareable 24-hour demo links for clients.

## Development Commands

### Essential Commands
```bash
npm run dev    # Start development server on localhost:3000
npm run build  # Production build (runs Next.js build)
npm run start  # Start production server
npm run lint   # Run ESLint
```

### Environment Setup
Required environment variables in `.env.local`:
- `TAVUS_API_KEY` - Tavus API key for video conversations
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key

See `SETUP.md` for complete Supabase setup instructions including schema creation.

## Architecture Overview

### Application Structure

**Three-Tier Architecture**:
1. **Public Layer** (`app/page.tsx`, `app/demo/[sessionId]`) - Landing page and public demo viewer
2. **Team Layer** (`app/team/*`) - Protected admin dashboard with Supabase auth
3. **API Layer** (`app/api/*`) - Next.js API routes for server-side operations

### Key Architectural Patterns

**Authentication Flow**:
- Middleware (`middleware.ts`) handles session management via `@/lib/supabase/middleware`
- Cookie-based auth for team members accessing `/team/*` routes
- Public demo links (`/demo/[sessionId]`) are unauthenticated with 24-hour expiration
- Auth helpers in `lib/auth.ts` and `lib/auth-helpers.ts`

**Tavus API Integration**:
- **Client-side**: `lib/tavus-client.ts` - Full TypeScript wrapper for all Tavus endpoints
- **Server-side**: `lib/tavus-server.ts` - Server actions for API routes and RSCs
- **Types**: `types/tavus.ts` - Complete TypeScript definitions for Tavus API v2
- All Tavus operations (conversations, personas, replicas, objectives, guardrails, documents, videos) are abstracted through these clients

**Database Layer**:
- Supabase PostgreSQL with schema in `supabase/schema.sql`
- Type-safe database types in `types/database.ts`
- Three main tables: `projects`, `demo_sessions`, `team_members`
- Supabase helpers: `lib/supabase/{client,server,middleware}.ts`

**Project → Demo Session Flow**:
1. Admin creates `project` with persona_id + replica_id + custom config
2. Admin generates shareable `demo_session` link (24hr expiry)
3. Client visits `/demo/[sessionId]`, triggers Tavus conversation creation
4. Session tracked in database (status: pending → active → completed/expired)

### Route Organization

**Protected Routes** (`/team/*`):
- `/team/login` - Supabase email/password authentication
- `/team/dashboard` - Main admin interface (uses `enhanced-dashboard-client.tsx`)
- `/demo/preview/[projectId]` - Preview project before sharing

**Public Routes**:
- `/` - Landing page
- `/demo/[sessionId]` - Public demo viewer (branded experience)
- `/legal/*` - Terms, privacy, etc.

**API Routes** (`/app/api/*`):
- `/api/auth/*` - Authentication endpoints
- `/api/conversations/*` - Tavus conversation management
- `/api/personas/*` - Persona CRUD operations
- `/api/replicas/*` - Replica management
- `/api/projects/*` - Project CRUD with Supabase
- `/api/demo/*` - Demo session generation and validation

### Component Architecture

**Server Components by Default**: Next.js 16 App Router uses RSCs
- Use `'use client'` directive only when needed (state, effects, event handlers)
- Server actions in `lib/tavus-server.ts` marked with `'use server'`

**Path Alias**: `@/*` maps to project root (configured in `tsconfig.json`)

**Styling**: Tailwind CSS 4 with custom configuration in `app/globals.css`

**UI Components**: Radix UI primitives with class-variance-authority for variants
- Located in `components/` directory
- Uses `lucide-react` for icons
- `lib/utils.ts` contains `cn()` utility for class merging

## Important Development Notes

### Tavus API Specifics
- Conversations require both `persona_id` AND `replica_id`
- Custom greetings and conversational context can be set per conversation
- Test mode available via `test_mode: true` parameter
- Webhook support via `callback_url` parameter
- Document retrieval strategies: `speed`, `quality`, `balanced`

### Supabase Patterns
- Row Level Security (RLS) enabled on all tables
- Use `createClient()` from appropriate context (client/server/middleware)
- Regenerate database types: `npx supabase gen types typescript`
- Auth session managed via middleware on every request

### Type Safety
- All Tavus API types are fully defined in `types/tavus.ts`
- Database types in `types/database.ts` match Supabase schema
- Use type imports (`import type`) where possible for better tree-shaking
- API responses wrapped in `{ success: boolean; data?: T; error?: string }` pattern

### Demo Session Logic
- Sessions expire after configurable hours (default from project)
- Status lifecycle: `pending` → `active` (on first view) → `completed` (on conversation end) → `expired` (after timeout)
- One-time use tracking via `viewed_at` timestamp
- Sessions belong to projects, inherit branding and configuration

### Admin Dashboard Features
- Project CRUD with persona + replica selection
- Custom branding per project (colors, logos, CTAs)
- Session duration configuration
- Demo link generation with shareable URLs
- Statistics tracking (demo count, last demo timestamp)
- Project status management (draft/active/archived)

## Common Patterns

### Creating a New API Route
```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  // ... implementation
  return NextResponse.json({ success: true, data: result });
}
```

### Using Tavus Server Actions
```typescript
import { createConversationAction } from '@/lib/tavus-server';

const result = await createConversationAction({
  replica_id: 'r_xxx',
  persona_id: 'p_xxx',
  custom_greeting: 'Hello!',
  conversational_context: 'You are...'
});

if (result.success) {
  // Use result.data
} else {
  // Handle result.error
}
```

### Database Queries
```typescript
const supabase = await createClient();
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('status', 'active')
  .order('created_at', { ascending: false });
```

## Documentation References

- **Tavus API**: `docs/tavus-api-reference.md` - Complete API documentation
- **Quick Start**: `QUICK_SETUP.md` - Fast environment setup guide
- **Setup Guide**: `SETUP.md` - Environment and Supabase setup
- **Demo Workflow**: `DEMO_WORKFLOW.md` - Complete demo creation workflow
- **Demo Projects**: `DEMO_PROJECTS_SETUP.md` - Project configuration for demos
- **Testing Checklist**: `TESTING_CHECKLIST.md` - Manual testing procedures
- **Admin Setup**: `ADMIN_SETUP.md` and `ADMIN_REFINEMENTS.md` - Dashboard configuration
- **Integration Guide**: `INTEGRATION_COMPLETE.md` - Supabase + Tavus integration details
- **Project Summary**: `PROJECT_SUMMARY.md` - High-level project overview
- **Deployment**: `DEPLOYMENT.md` - Production deployment guide

## Key Files to Understand

- `middleware.ts` - Session management for all routes
- `lib/tavus-client.ts` - Core Tavus API wrapper (520+ lines)
- `types/tavus.ts` - Complete API type definitions (350+ lines)
- `types/database.ts` - Supabase database types
- `app/team/dashboard/enhanced-dashboard-client.tsx` - Main admin UI
- `supabase/schema.sql` - Database schema with RLS policies

## Deployment Notes

- Platform: Vercel (Next.js native deployment)
- Environment variables must be set in Vercel dashboard
- Supabase connection strings configured via `NEXT_PUBLIC_*` vars
- See `DEPLOYMENT.md` for complete deployment guide
