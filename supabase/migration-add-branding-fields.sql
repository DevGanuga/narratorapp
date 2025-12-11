-- Migration: Add branding and session configuration fields to projects table
-- Run this in Supabase SQL Editor if these columns don't exist yet

-- Add branding fields
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS welcome_title text,
ADD COLUMN IF NOT EXISTS welcome_message text,
ADD COLUMN IF NOT EXISTS instructions text,
ADD COLUMN IF NOT EXISTS brand_logo_url text,
ADD COLUMN IF NOT EXISTS brand_name text,
ADD COLUMN IF NOT EXISTS brand_primary_color text DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS brand_background_color text DEFAULT '#0a0a0a',
ADD COLUMN IF NOT EXISTS cta_text text,
ADD COLUMN IF NOT EXISTS cta_url text,
ADD COLUMN IF NOT EXISTS custom_fields jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS session_duration_hours integer DEFAULT 24,
ADD COLUMN IF NOT EXISTS show_narrator_branding boolean DEFAULT true;

-- Add comment
COMMENT ON TABLE projects IS 'Demo projects with full branding and configuration support';
