-- COMPLETE SETUP - Run this ONE script in Supabase SQL Editor
-- Creates all 5 demo projects ready to use

-- ============================================================================
-- FIRST: Check if you have a user account
-- ============================================================================
-- Run this to see your user ID:
-- SELECT id, email FROM auth.users;
--
-- If NO RESULTS, go to Supabase Dashboard > Authentication > Users
-- and create a user with email/password first!
-- ============================================================================

-- Step 1: Add columns if missing
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

-- Step 2: Create all 5 projects
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get first user ID
  SELECT id INTO v_user_id FROM auth.users ORDER BY created_at LIMIT 1;

  -- Check if user exists
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found! Go to Supabase Dashboard > Authentication > Users and create a user first.';
  END IF;

  INSERT INTO projects (name, description, partner, persona_id, replica_id, custom_greeting, conversational_context, brand_name, brand_primary_color, brand_background_color, welcome_title, welcome_message, instructions, cta_text, cta_url, session_duration_hours, show_narrator_branding, status, user_id)
  VALUES
    ('FLO CU Demo', 'Interactive demo with FLO CU AI replica', 'Narrator Studio', 'pcb2101fd24e', 'rc1dc6bbd651', 'Hi! I''m here to chat with you about our experience.', 'You are a friendly and engaging AI replica demonstrating conversational capabilities.', 'Narrator', '#ffffff', '#0a0a0a', 'Experience FLO CU AI', 'Interactive conversation with FLO CU', 'Click "Start Demo" to begin. Enable your camera and microphone.', 'Learn More', 'https://narrator.studio', 24, true, 'active', v_user_id),
    ('CRESSI Demo', 'Interactive demo with CRESSI AI replica', 'Narrator Studio', 'p77b36071c50', 'r54a3ebbdd83', 'Welcome! Let''s explore what we can do together.', 'You are a knowledgeable and helpful AI replica.', 'Narrator', '#ffffff', '#0a0a0a', 'Experience CRESSI AI', 'Interactive conversation with CRESSI', 'Click "Start Demo" to begin. Enable your camera and microphone.', 'Learn More', 'https://narrator.studio', 24, true, 'active', v_user_id),
    ('BB LIVE Demo', 'Interactive live performance demo', 'Narrator Studio', 'p8b1357538d2', 'r8b79330a2fd', 'Hey there! Ready to talk about the blues?', 'You are BB, a blues legend, performing live.', 'Narrator', '#ffffff', '#0a0a0a', 'Experience BB LIVE', 'Interactive live performance with BB', 'Click "Start Demo" to begin. Enable your camera and microphone.', 'Learn More', 'https://narrator.studio', 24, true, 'active', v_user_id),
    ('BB SEATED Demo', 'Interactive seated conversation demo', 'Narrator Studio', 'p8b1357538d2', 'r618a19d9521', 'Welcome! Let me tell you about the blues.', 'You are BB, a blues legend, in an intimate setting.', 'Narrator', '#ffffff', '#0a0a0a', 'Experience BB SEATED', 'Intimate conversation with BB', 'Click "Start Demo" to begin. Enable your camera and microphone.', 'Learn More', 'https://narrator.studio', 24, true, 'active', v_user_id),
    ('OSWALD Demo', 'Interactive demo with OSWALD AI replica', 'Narrator Studio', 'p8c8d94dab90', 'r8f68469a43b', 'Hello! I''m here to demonstrate our capabilities.', 'You are OSWALD, a professional AI replica.', 'Narrator', '#ffffff', '#0a0a0a', 'Experience OSWALD AI', 'Interactive conversation with OSWALD', 'Click "Start Demo" to begin. Enable your camera and microphone.', 'Learn More', 'https://narrator.studio', 24, true, 'active', v_user_id)
  ON CONFLICT DO NOTHING;

  RAISE NOTICE '✅ Created 5 demo projects!';
END $$;

-- Step 3: Verify
SELECT name, status, persona_id, replica_id FROM projects WHERE name LIKE '%Demo' ORDER BY name;
