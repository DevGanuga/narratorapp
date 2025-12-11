-- Seed Demo Projects
-- Run this in Supabase SQL Editor to create the 5 pre-configured demo projects
-- NOTE: Replace 'YOUR_USER_ID_HERE' with your actual Supabase auth user ID

-- First, get your user_id by running: SELECT id, email FROM auth.users;
-- Then replace the user_id below with your actual UUID

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get the first admin user (or specify your email)
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;

  -- If no user found, you need to create one first in Supabase Auth
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'No user found. Please create a user in Supabase Authentication first.';
  END IF;

  -- Delete existing demo projects to avoid duplicates (optional - comment out if you want to keep existing)
  -- DELETE FROM projects WHERE name IN ('FLO CU Demo', 'CRESSI Demo', 'BB LIVE Demo', 'BB SEATED Demo', 'OSWALD Demo');

  -- 1. FLO CU - Ari Palitz April 29 2025
  INSERT INTO projects (
    name,
    description,
    partner,
    persona_id,
    persona_name,
    replica_id,
    replica_name,
    custom_greeting,
    conversational_context,
    brand_name,
    brand_logo_url,
    brand_primary_color,
    brand_background_color,
    welcome_title,
    welcome_message,
    instructions,
    cta_text,
    cta_url,
    session_duration_hours,
    show_narrator_branding,
    status,
    user_id
  ) VALUES (
    'FLO CU Demo',
    'Interactive demo with FLO CU AI replica',
    'Narrator Studio',
    'pcb2101fd24e', -- FloDan7
    'FloDan7',
    'rc1dc6bbd651', -- FLO CU
    'FLO CU',
    'Hi! I''m here to chat with you about our experience.',
    'You are a friendly and engaging AI replica demonstrating conversational capabilities.',
    'Narrator',
    '/White logo - no background.png',
    '#ffffff',
    '#0a0a0a',
    'Experience FLO CU AI',
    'Interactive conversation with FLO CU',
    'Click "Start Conversation" to begin your demo experience',
    'Learn More',
    'https://narrator.studio',
    24,
    true,
    'active',
    v_user_id
  )
  ON CONFLICT DO NOTHING;

  -- 2. CRESSI - Ari Palitz November 17 2025
  INSERT INTO projects (
    name,
    description,
    partner,
    persona_id,
    persona_name,
    replica_id,
    replica_name,
    custom_greeting,
    conversational_context,
    brand_name,
    brand_logo_url,
    brand_primary_color,
    brand_background_color,
    welcome_title,
    welcome_message,
    instructions,
    cta_text,
    cta_url,
    session_duration_hours,
    show_narrator_branding,
    status,
    user_id
  ) VALUES (
    'CRESSI Demo',
    'Interactive demo with CRESSI AI replica',
    'Narrator Studio',
    'p77b36071c50', -- Cressi 1
    'Cressi 1',
    'r54a3ebbdd83', -- CRESSI
    'CRESSI',
    'Welcome! Let''s explore what we can do together.',
    'You are a knowledgeable and helpful AI replica ready to demonstrate conversational AI capabilities.',
    'Narrator',
    '/White logo - no background.png',
    '#ffffff',
    '#0a0a0a',
    'Experience CRESSI AI',
    'Interactive conversation with CRESSI',
    'Click "Start Conversation" to begin your demo experience',
    'Learn More',
    'https://narrator.studio',
    24,
    true,
    'active',
    v_user_id
  )
  ON CONFLICT DO NOTHING;

  -- 3. BB LIVE - Ari Palitz October 07 2025
  INSERT INTO projects (
    name,
    description,
    partner,
    persona_id,
    persona_name,
    replica_id,
    replica_name,
    custom_greeting,
    conversational_context,
    brand_name,
    brand_logo_url,
    brand_primary_color,
    brand_background_color,
    welcome_title,
    welcome_message,
    instructions,
    cta_text,
    cta_url,
    session_duration_hours,
    show_narrator_branding,
    status,
    user_id
  ) VALUES (
    'BB LIVE Demo',
    'Interactive live performance demo with BB AI replica',
    'Narrator Studio',
    'p8b1357538d2', -- DemoBB
    'DemoBB',
    'r8b79330a2fd', -- BB LIVE
    'BB LIVE',
    'Hey there! Ready to talk about the blues and music?',
    'You are BB, a blues legend, performing live and engaging with your audience about music, guitar, and the blues.',
    'Narrator',
    '/White logo - no background.png',
    '#ffffff',
    '#0a0a0a',
    'Experience BB LIVE',
    'Interactive live performance with BB',
    'Click "Start Conversation" to begin your demo experience',
    'Learn More',
    'https://narrator.studio',
    24,
    true,
    'active',
    v_user_id
  )
  ON CONFLICT DO NOTHING;

  -- 4. BB SEATED - Ari Palitz June 03 2025
  INSERT INTO projects (
    name,
    description,
    partner,
    persona_id,
    persona_name,
    replica_id,
    replica_name,
    custom_greeting,
    conversational_context,
    brand_name,
    brand_logo_url,
    brand_primary_color,
    brand_background_color,
    welcome_title,
    welcome_message,
    instructions,
    cta_text,
    cta_url,
    session_duration_hours,
    show_narrator_branding,
    status,
    user_id
  ) VALUES (
    'BB SEATED Demo',
    'Interactive seated conversation demo with BB AI replica',
    'Narrator Studio',
    'p8b1357538d2', -- DemoBB (same persona as BB LIVE)
    'DemoBB',
    'r618a19d9521', -- BB SEATED
    'BB SEATED',
    'Welcome! Let me tell you about the blues and my journey.',
    'You are BB, a blues legend, in a more intimate seated conversation setting, sharing stories and wisdom about music.',
    'Narrator',
    '/White logo - no background.png',
    '#ffffff',
    '#0a0a0a',
    'Experience BB SEATED',
    'Intimate conversation with BB',
    'Click "Start Conversation" to begin your demo experience',
    'Learn More',
    'https://narrator.studio',
    24,
    true,
    'active',
    v_user_id
  )
  ON CONFLICT DO NOTHING;

  -- 5. OSWALD - Ari Palitz June 09 2025
  INSERT INTO projects (
    name,
    description,
    partner,
    persona_id,
    persona_name,
    replica_id,
    replica_name,
    custom_greeting,
    conversational_context,
    brand_name,
    brand_logo_url,
    brand_primary_color,
    brand_background_color,
    welcome_title,
    welcome_message,
    instructions,
    cta_text,
    cta_url,
    session_duration_hours,
    show_narrator_branding,
    status,
    user_id
  ) VALUES (
    'OSWALD Demo',
    'Interactive demo with OSWALD AI replica',
    'Narrator Studio',
    'p8c8d94dab90', -- LeeDN1
    'LeeDN1',
    'r8f68469a43b', -- OSWALD
    'OSWALD',
    'Hello! I''m here to demonstrate our conversational capabilities.',
    'You are OSWALD, a professional and engaging AI replica showcasing advanced conversational AI technology.',
    'Narrator',
    '/White logo - no background.png',
    '#ffffff',
    '#0a0a0a',
    'Experience OSWALD AI',
    'Interactive conversation with OSWALD',
    'Click "Start Conversation" to begin your demo experience',
    'Learn More',
    'https://narrator.studio',
    24,
    true,
    'active',
    v_user_id
  )
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Successfully created 5 demo projects!';
END $$;

-- Verify the projects were created
SELECT
  id,
  name,
  persona_name,
  replica_name,
  status,
  created_at
FROM projects
WHERE name IN ('FLO CU Demo', 'CRESSI Demo', 'BB LIVE Demo', 'BB SEATED Demo', 'OSWALD Demo')
ORDER BY name;
