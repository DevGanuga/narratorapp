# Admin Panel Setup Guide

## Overview
ConvoAI Studio admin panel allows authorized team members to configure and manage demo experiences for prospects using Tavus conversational AI.

## Admin Users
The following emails are authorized to access the admin panel:
- `ari@narrator.studio`
- `devganuga@gmail.com`

## Initial Setup

### 1. Database Configuration
The database schema has been automatically created with the following tables:
- `team_members` - Admin user management
- `projects` - Demo project configurations
- `demo_sessions` - Individual demo session tracking

### 2. Create Admin Accounts
Each admin user needs to create their Supabase Auth account:

1. Go to `/team/login`
2. Use the Supabase Auth sign-up flow (or have an admin create accounts via Supabase dashboard)
3. Sign in with your authorized email

**Note**: Only emails in the allowlist can successfully authenticate.

### 3. Environment Variables
Ensure these are set in `.env.local`:

```bash
# Tavus API
TAVUS_API_KEY=your_tavus_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional defaults
NEXT_PUBLIC_DEFAULT_REPLICA_ID=your_default_replica
NEXT_PUBLIC_DEFAULT_PERSONA_ID=your_default_persona
```

## Using the Admin Panel

### Creating a Demo Project

1. Navigate to `/team/dashboard`
2. Click "New Project"
3. Fill in the project details:
   - **Project Name**: Internal identifier (e.g., "Acme Corp Demo")
   - **Partner/Client**: Optional partner name
   - **Description**: Internal notes about the demo
   - **Persona**: Select from your Tavus personas
   - **Replica**: Select from your completed Tavus replicas
   - **Custom Greeting**: Override default greeting message
   - **Conversational Context**: Additional context for this specific demo

4. Click "Create Project" (defaults to 'draft' status)

### Managing Projects

#### Activate a Project
- Projects must be in 'active' status to generate demo links
- Click the status toggle icon to activate/deactivate

#### Generate Demo Link
1. Ensure project is 'active'
2. Click the link icon to generate a unique demo session
3. Link is automatically copied to clipboard
4. Share link with prospect

#### Edit Project
- Click the edit icon to modify project configuration
- Changes apply to future demo sessions only

#### Preview Project
- Click the preview icon to test the experience before sharing

#### Delete Project
- Click the delete icon and confirm
- This permanently removes the project and all associated sessions

### Demo Sessions

When you generate a demo link:
- A unique session is created with 24-hour expiration
- Session includes unique `conversation_id` from Tavus
- Link format: `/demo/[sessionId]`
- Prospect can access the conversational AI experience
- Sessions track status: pending → active → completed/expired

### Managing Demo Sessions

Projects track:
- `demo_count`: Total number of demos generated
- `last_demo_at`: Timestamp of most recent demo
- Sessions automatically expire after 24 hours

## Tavus Integration

### Personas
Personas define the AI's behavior and personality:
- System prompt
- Context information
- Conversational layers (STT, LLM, TTS settings)
- Manage via Tavus dashboard or API

### Replicas
Replicas are the visual/audio representation:
- Must have 'completed' status to use
- Created via Tavus dashboard
- Requires training footage/audio

### Creating Conversations
When a demo link is accessed:
1. System creates Tavus conversation with selected persona + replica
2. Returns `conversation_url` for prospect to join
3. Tracks session status and duration

## Security

### Admin Access Control
- Only allowlisted emails can authenticate
- Authentication checked on every dashboard page load
- Sign-in attempts with non-allowlisted emails are rejected

### Row Level Security (RLS)
- Enabled on all tables
- Admins can view all projects
- Demo sessions publicly viewable (by session ID only)
- Team members can only edit their own projects

### Session Expiration
- Demo sessions expire after 24 hours
- Expired sessions show 404 page
- Status automatically updated to 'expired'

## Adding New Admin Users

To add a new admin user:

1. Update the allowlist in `/lib/auth.ts`:
```typescript
const ALLOWED_ADMIN_EMAILS = [
  'ari@narrator.studio',
  'devganuga@gmail.com',
  'new.admin@example.com', // Add here
];
```

2. Update the Supabase function in migration:
```sql
CREATE OR REPLACE FUNCTION public.is_allowed_admin(user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  allowed_emails TEXT[] := ARRAY[
    'ari@narrator.studio',
    'devganuga@gmail.com',
    'new.admin@example.com' -- Add here
  ];
BEGIN
  RETURN user_email = ANY(allowed_emails);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

3. Have the new admin create their Supabase Auth account

## Troubleshooting

### Cannot Sign In
- Verify email is in the allowlist
- Check Supabase Auth account exists
- Verify `.env.local` has correct Supabase credentials

### Personas/Replicas Not Loading
- Check `TAVUS_API_KEY` is set correctly
- Verify API key has correct permissions
- Check browser console for API errors

### Demo Link Not Working
- Ensure project status is 'active'
- Verify Tavus API is returning conversation URL
- Check session hasn't expired (24 hour limit)

### Database Connection Issues
- Verify Supabase project is active and healthy
- Check RLS policies allow authenticated access
- Ensure migrations have been applied

## API Routes

The admin panel uses these API endpoints:

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `PATCH /api/projects/[id]` - Update project
- `DELETE /api/projects/[id]` - Delete project
- `POST /api/projects/[id]/demo-link` - Generate demo link
- `GET /api/personas` - List Tavus personas
- `GET /api/replicas` - List Tavus replicas
- `POST /api/conversations` - Create Tavus conversation
- `POST /api/auth/login` - Admin authentication

## Support

For issues or questions:
- Check Tavus documentation: https://docs.tavus.io
- Review Supabase dashboard for database/auth issues
- Contact development team for access/configuration help
