# Narrator Research - Setup Guide

## Environment Variables

Add these to your `.env.local` file:

```bash
# Tavus API (you already have this)
TAVUS_API_KEY=your_tavus_api_key

# Supabase - Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Base URL for demo links (defaults to request origin)
# NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

## Supabase Setup

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be provisioned

### 2. Get Your Credentials
1. Go to **Settings** → **API**
2. Copy the **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy the **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 3. Set Up the Database
1. Go to **SQL Editor** in your Supabase dashboard
2. Copy the contents of `supabase/schema.sql`
3. Paste and run the SQL

### 4. Create Team Users
1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create New User**
3. Enter email and password for each team member
4. Users can now log in at `/team/login`

## Application Routes

| Route | Description |
|-------|-------------|
| `/` | Public landing page |
| `/team/login` | Team authentication |
| `/team/dashboard` | Admin panel for managing demo projects |
| `/demo/preview/[projectId]` | Preview a project (team only) |
| `/demo/[sessionId]` | Public demo viewer (shareable links) |

## Features

### Admin Dashboard
- Create and manage demo projects
- Configure persona + replica combinations
- Set custom greetings and context
- Activate/deactivate projects
- Generate shareable demo links
- Preview demos before sharing

### Demo Links
- 24-hour expiration
- One-time use tracking
- Clean, professional viewer interface
- No authentication required for demo viewers

## Development

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run lint   # Run linter
```
