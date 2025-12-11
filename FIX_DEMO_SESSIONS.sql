-- COMPLETE FIX for Demo Links
-- Run this in Supabase SQL Editor RIGHT NOW

-- Step 1: Check if demo_sessions table exists
-- If it doesn't exist, create it
CREATE TABLE IF NOT EXISTS demo_sessions (
  id text PRIMARY KEY,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending',
  conversation_id text,
  expires_at timestamptz NOT NULL,
  first_viewed_at timestamptz,
  view_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Step 2: Disable RLS on demo_sessions (just like projects)
ALTER TABLE demo_sessions DISABLE ROW LEVEL SECURITY;

-- Step 3: Verify it worked
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('projects', 'demo_sessions');

-- Should show both tables with rowsecurity = false
