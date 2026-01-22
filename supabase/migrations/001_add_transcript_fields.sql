-- Migration: Add transcript and analysis fields to demo_sessions
-- Run this in your Supabase SQL Editor to add transcript storage

-- Add transcript column (stores the full conversation transcript)
ALTER TABLE demo_sessions
ADD COLUMN IF NOT EXISTS transcript jsonb;

-- Add analysis_data column (stores perception analysis, shutdown reason, etc.)
ALTER TABLE demo_sessions
ADD COLUMN IF NOT EXISTS analysis_data jsonb;

-- Add prospect tracking fields (for intake report recipient info)
ALTER TABLE demo_sessions
ADD COLUMN IF NOT EXISTS prospect_name text;

ALTER TABLE demo_sessions
ADD COLUMN IF NOT EXISTS prospect_email text;

ALTER TABLE demo_sessions
ADD COLUMN IF NOT EXISTS prospect_company text;

-- Add referrer tracking
ALTER TABLE demo_sessions
ADD COLUMN IF NOT EXISTS referrer text;

-- Add metadata for custom fields
ALTER TABLE demo_sessions
ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}';

-- Add report tracking fields (for Flo intake reports)
ALTER TABLE demo_sessions
ADD COLUMN IF NOT EXISTS report_sent_at timestamptz;

ALTER TABLE demo_sessions
ADD COLUMN IF NOT EXISTS report_recipient text;

-- Create index on conversation_id for webhook lookups
CREATE INDEX IF NOT EXISTS demo_sessions_conversation_id_idx
ON demo_sessions(conversation_id);

-- Comment for documentation
COMMENT ON COLUMN demo_sessions.transcript IS 'Full conversation transcript from Tavus verbose API';
COMMENT ON COLUMN demo_sessions.analysis_data IS 'Perception analysis and shutdown info from Tavus';
COMMENT ON COLUMN demo_sessions.report_sent_at IS 'When the intake report was emailed (for Flo)';
COMMENT ON COLUMN demo_sessions.report_recipient IS 'Email address the intake report was sent to';
