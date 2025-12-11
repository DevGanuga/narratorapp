# Quick Setup - 5 Demo Projects

## Step 1: Update Database Schema (if needed)

Go to your Supabase Dashboard → SQL Editor and run this:

```sql
-- Add branding fields if they don't exist
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
```

## Step 2: Create the 5 Projects

In Supabase SQL Editor, run this:

```sql
DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get your user ID
  SELECT id INTO v_user_id FROM auth.users ORDER BY created_at LIMIT 1;

  -- FLO CU Demo
  INSERT INTO projects (name, description, partner, persona_id, replica_id, custom_greeting, conversational_context, brand_name, brand_primary_color, brand_background_color, welcome_title, welcome_message, instructions, cta_text, cta_url, session_duration_hours, show_narrator_branding, status, user_id)
  VALUES ('FLO CU Demo', 'Interactive demo with FLO CU AI replica', 'Narrator Studio', 'pcb2101fd24e', 'rc1dc6bbd651', 'Hi! I''m here to chat with you about our experience.', 'You are a friendly and engaging AI replica demonstrating conversational capabilities.', 'Narrator', '#ffffff', '#0a0a0a', 'Experience FLO CU AI', 'Interactive conversation with FLO CU', 'Click "Start Demo" to begin. Enable your camera and microphone.', 'Learn More', 'https://narrator.studio', 24, true, 'active', v_user_id)
  ON CONFLICT DO NOTHING;

  -- CRESSI Demo
  INSERT INTO projects (name, description, partner, persona_id, replica_id, custom_greeting, conversational_context, brand_name, brand_primary_color, brand_background_color, welcome_title, welcome_message, instructions, cta_text, cta_url, session_duration_hours, show_narrator_branding, status, user_id)
  VALUES ('CRESSI Demo', 'Interactive demo with CRESSI AI replica', 'Narrator Studio', 'p77b36071c50', 'r54a3ebbdd83', 'Welcome! Let''s explore what we can do together.', 'You are a knowledgeable and helpful AI replica.', 'Narrator', '#ffffff', '#0a0a0a', 'Experience CRESSI AI', 'Interactive conversation with CRESSI', 'Click "Start Demo" to begin. Enable your camera and microphone.', 'Learn More', 'https://narrator.studio', 24, true, 'active', v_user_id)
  ON CONFLICT DO NOTHING;

  -- BB LIVE Demo
  INSERT INTO projects (name, description, partner, persona_id, replica_id, custom_greeting, conversational_context, brand_name, brand_primary_color, brand_background_color, welcome_title, welcome_message, instructions, cta_text, cta_url, session_duration_hours, show_narrator_branding, status, user_id)
  VALUES ('BB LIVE Demo', 'Interactive live performance demo', 'Narrator Studio', 'p8b1357538d2', 'r8b79330a2fd', 'Hey there! Ready to talk about the blues?', 'You are BB, a blues legend, performing live.', 'Narrator', '#ffffff', '#0a0a0a', 'Experience BB LIVE', 'Interactive live performance with BB', 'Click "Start Demo" to begin. Enable your camera and microphone.', 'Learn More', 'https://narrator.studio', 24, true, 'active', v_user_id)
  ON CONFLICT DO NOTHING;

  -- BB SEATED Demo
  INSERT INTO projects (name, description, partner, persona_id, replica_id, custom_greeting, conversational_context, brand_name, brand_primary_color, brand_background_color, welcome_title, welcome_message, instructions, cta_text, cta_url, session_duration_hours, show_narrator_branding, status, user_id)
  VALUES ('BB SEATED Demo', 'Interactive seated conversation demo', 'Narrator Studio', 'p8b1357538d2', 'r618a19d9521', 'Welcome! Let me tell you about the blues.', 'You are BB, a blues legend, in an intimate setting.', 'Narrator', '#ffffff', '#0a0a0a', 'Experience BB SEATED', 'Intimate conversation with BB', 'Click "Start Demo" to begin. Enable your camera and microphone.', 'Learn More', 'https://narrator.studio', 24, true, 'active', v_user_id)
  ON CONFLICT DO NOTHING;

  -- OSWALD Demo
  INSERT INTO projects (name, description, partner, persona_id, replica_id, custom_greeting, conversational_context, brand_name, brand_primary_color, brand_background_color, welcome_title, welcome_message, instructions, cta_text, cta_url, session_duration_hours, show_narrator_branding, status, user_id)
  VALUES ('OSWALD Demo', 'Interactive demo with OSWALD AI replica', 'Narrator Studio', 'p8c8d94dab90', 'r8f68469a43b', 'Hello! I''m here to demonstrate our capabilities.', 'You are OSWALD, a professional AI replica.', 'Narrator', '#ffffff', '#0a0a0a', 'Experience OSWALD AI', 'Interactive conversation with OSWALD', 'Click "Start Demo" to begin. Enable your camera and microphone.', 'Learn More', 'https://narrator.studio', 24, true, 'active', v_user_id)
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Created 5 demo projects!';
END $$;

-- Verify
SELECT name, status, persona_id, replica_id FROM projects WHERE name LIKE '%Demo' ORDER BY name;
```

## Step 3: Generate Demo Links

1. Go to your admin dashboard: `/team/dashboard`
2. You'll see all 5 projects listed
3. For each project, click the 🔗 link icon
4. Demo link is copied to clipboard automatically!

## Step 4: Test & Share

Test each link in an incognito window:
- ✅ Page loads with correct branding
- ✅ "Start Conversation" button works
- ✅ Tavus video conversation starts
- ✅ Persona responds correctly

Then share the links with prospects!

---

**That's it!** All 5 demo projects are now set up and ready to use.
