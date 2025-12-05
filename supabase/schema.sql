-- Narrator Research - Demo Management Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

create type project_status as enum ('draft', 'active', 'archived');
create type session_status as enum ('pending', 'active', 'completed', 'expired');
create type team_role as enum ('admin', 'member');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Projects table
create table projects (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Basic info
  name text not null,
  description text,
  partner text,
  
  -- Tavus configuration
  persona_id text not null,
  persona_name text,
  replica_id text not null,
  replica_name text,
  
  -- Custom overrides
  custom_greeting text,
  conversational_context text,
  
  -- Branding (stored as JSONB)
  branding jsonb,
  
  -- Status
  status project_status default 'draft' not null,
  
  -- Stats
  demo_count integer default 0,
  last_demo_at timestamptz,
  
  -- Owner
  user_id uuid references auth.users(id) on delete cascade not null
);

-- Demo sessions table
create table demo_sessions (
  id text primary key, -- Using custom demo token format
  created_at timestamptz default now() not null,
  
  -- Link to project
  project_id uuid references projects(id) on delete cascade not null,
  
  -- Conversation details (populated when started)
  conversation_id text,
  conversation_url text,
  
  -- Status tracking
  status session_status default 'pending' not null,
  expires_at timestamptz not null,
  completed_at timestamptz,
  duration_seconds integer
);

-- Team members table (optional - for tracking who has access)
create table team_members (
  id uuid primary key default uuid_generate_v4(),
  created_at timestamptz default now() not null,
  
  user_id uuid references auth.users(id) on delete cascade not null unique,
  email text not null,
  name text,
  role team_role default 'member' not null
);

-- ============================================================================
-- INDEXES
-- ============================================================================

create index projects_user_id_idx on projects(user_id);
create index projects_status_idx on projects(status);
create index projects_updated_at_idx on projects(updated_at desc);

create index demo_sessions_project_id_idx on demo_sessions(project_id);
create index demo_sessions_status_idx on demo_sessions(status);
create index demo_sessions_expires_at_idx on demo_sessions(expires_at);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table projects enable row level security;
alter table demo_sessions enable row level security;
alter table team_members enable row level security;

-- Projects policies
-- Users can only see their own projects
create policy "Users can view own projects"
  on projects for select
  using (auth.uid() = user_id);

create policy "Users can insert own projects"
  on projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update own projects"
  on projects for update
  using (auth.uid() = user_id);

create policy "Users can delete own projects"
  on projects for delete
  using (auth.uid() = user_id);

-- Demo sessions policies
-- Sessions linked to user's projects are viewable
create policy "Users can view sessions for own projects"
  on demo_sessions for select
  using (
    project_id in (
      select id from projects where user_id = auth.uid()
    )
  );

create policy "Users can create sessions for own projects"
  on demo_sessions for insert
  with check (
    project_id in (
      select id from projects where user_id = auth.uid()
    )
  );

create policy "Users can update sessions for own projects"
  on demo_sessions for update
  using (
    project_id in (
      select id from projects where user_id = auth.uid()
    )
  );

-- Public access to demo sessions (for demo viewers)
create policy "Anyone can view pending/active sessions"
  on demo_sessions for select
  using (status in ('pending', 'active'));

create policy "Anyone can update session to active"
  on demo_sessions for update
  using (status = 'pending');

-- Team members policies
create policy "Users can view own team membership"
  on team_members for select
  using (auth.uid() = user_id);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to increment demo count
create or replace function increment_demo_count(project_id uuid)
returns void as $$
begin
  update projects
  set 
    demo_count = demo_count + 1,
    last_demo_at = now()
  where id = project_id;
end;
$$ language plpgsql security definer;

-- Function to auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Trigger for projects updated_at
create trigger projects_updated_at
  before update on projects
  for each row
  execute function update_updated_at();

-- ============================================================================
-- INITIAL SETUP NOTES
-- ============================================================================
-- 
-- After running this schema:
-- 
-- 1. Go to Authentication > Users in Supabase Dashboard
-- 2. Create your team user accounts with email/password
-- 
-- 3. (Optional) Add team members to the team_members table:
--    INSERT INTO team_members (user_id, email, name, role)
--    VALUES ('user-uuid-here', 'email@company.com', 'Name', 'admin');
--
-- 4. Configure your environment variables:
--    NEXT_PUBLIC_SUPABASE_URL=your-project-url
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key





