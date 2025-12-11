-- EMERGENCY FIX: Disable RLS to show projects
-- Run this in Supabase SQL Editor RIGHT NOW

-- Disable RLS temporarily (allows all queries to work)
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;

-- Verify it worked
SELECT COUNT(*) as project_count FROM projects;
