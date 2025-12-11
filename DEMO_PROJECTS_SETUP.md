# Demo Projects Setup Guide

This guide explains how to set up and manage the 5 pre-configured demo projects.

## Pre-Configured Replicas

| Project Name | Replica ID | Persona ID | Persona Name | Created Date |
|--------------|------------|------------|--------------|--------------|
| FLO CU | `rc1dc6bbd651` | `pcb2101fd24e` | FloDan7 | April 29, 2025 |
| CRESSI | `r54a3ebbdd83` | `p77b36071c50` | Cressi 1 | November 17, 2025 |
| BB LIVE | `r8b79330a2fd` | `p8b1357538d2` | DemoBB | October 7, 2025 |
| BB SEATED | `r618a19d9521` | `p8b1357538d2` | DemoBB | June 3, 2025 |
| OSWALD | `r8f68469a43b` | `p8c8d94dab90` | LeeDN1 | June 9, 2025 |

## Setup Methods

### Method 1: Via Admin Dashboard (Recommended)

1. **Login to Admin Panel**
   ```
   Navigate to: http://localhost:3000/team/login
   Or production: https://your-domain.com/team/login
   ```

2. **Create Each Project**
   - Click "New Project"
   - Fill in the details from the table above
   - Configure branding and messages
   - Set status to "Active"
   - Save project

3. **Generate Demo Links**
   - From the projects list, click the link icon for each project
   - Copy the shareable demo URL
   - Test the link in an incognito window

### Method 2: Via SQL (Direct Database)

1. **Run Schema Migration** (if needed)
   ```sql
   -- In Supabase SQL Editor, run:
   -- File: supabase/migration-add-branding-fields.sql
   ```

2. **Get Your User ID**
   ```sql
   SELECT id, email FROM auth.users;
   ```

3. **Run Seed Script**
   ```sql
   -- In Supabase SQL Editor, run:
   -- File: supabase/seed-demo-projects.sql
   -- (Script will auto-detect your user_id)
   ```

4. **Verify Projects Created**
   ```sql
   SELECT id, name, status, persona_id, replica_id
   FROM projects
   WHERE name LIKE '%Demo'
   ORDER BY name;
   ```

### Method 3: Via API Script

1. **Install Dependencies**
   ```bash
   npm install -D tsx
   ```

2. **Run Setup Script**
   ```bash
   npx tsx scripts/setup-demo-projects.ts
   ```

3. **Activate Projects**
   - Login to admin dashboard
   - Set each project status to "Active"

## Generating Demo Links

### Via Admin Dashboard

1. Navigate to `/team/dashboard`
2. Find the project in the list
3. Ensure project status is "Active"
4. Click the link icon (🔗) button
5. Demo link is automatically copied to clipboard
6. Paste and share with prospects!

### Demo Link Format

```
https://your-domain.com/demo/[sessionId]
```

Example:
```
https://narrator.studio/demo/demo_1234567890abcdef
```

### Demo Link Properties

- **Expiration**: 24 hours by default (configurable per project)
- **One-time tracking**: First view tracked, but link works until expiration
- **No authentication**: Public links, shareable with anyone
- **Branded experience**: Uses project's custom branding

## Testing Demo Links

### Quick Test Checklist

1. ✅ Link opens without errors
2. ✅ Branding displays correctly (logo, colors)
3. ✅ Welcome message shows properly
4. ✅ "Start Conversation" button works
5. ✅ Tavus conversation loads
6. ✅ Video/audio works
7. ✅ Persona responds correctly
8. ✅ CTA button displays (if configured)

### Test in Multiple Scenarios

```bash
# Test locally
http://localhost:3000/demo/[sessionId]

# Test in incognito/private window
# Test on mobile device
# Test with different browsers (Chrome, Safari, Firefox)
```

## Customizing Projects

Each project can be customized in the admin dashboard:

### Basic Info
- Project name
- Description
- Partner/client name
- Persona selection
- Replica selection

### Branding
- Brand name
- Logo URL
- Primary color (text)
- Background color
- "Powered by Narrator" toggle

### Content
- Welcome title
- Welcome message
- Instructions
- Custom greeting (AI's first words)
- Conversational context (additional AI instructions)
- Call-to-action button text and URL

### Advanced
- Session duration (1-168 hours)
- Custom fields (JSON)
- Test mode

## Verifying Tavus Resources

### Check Personas Exist

```bash
# Via API
curl -H "Authorization: Bearer YOUR_TAVUS_API_KEY" \
  https://tavusapi.com/v2/personas

# Should return your personas with IDs matching the table above
```

### Check Replicas Exist

```bash
# Via API
curl -H "Authorization: Bearer YOUR_TAVUS_API_KEY" \
  https://tavusapi.com/v2/replicas

# Should return your replicas with IDs matching the table above
```

### In Admin Dashboard

When creating a project, the persona and replica dropdowns will show:
- "Your Personas" section - Your user-created personas
- "Tavus System Personas" section - Tavus default personas
- Count display showing how many of each type

## Troubleshooting

### Projects Not Showing in Dashboard

1. Check you're logged in with correct user
2. Verify projects exist in database:
   ```sql
   SELECT * FROM projects WHERE user_id = 'your-user-id';
   ```
3. Check RLS policies allow viewing

### Personas/Replicas Not Appearing

1. Verify Tavus API key is set in `.env.local`
2. Check API endpoints:
   - `GET /api/personas` - Should return both user and system personas
   - `GET /api/replicas` - Should return both user and system replicas
3. Check browser console for errors

### Demo Links Not Working

1. **Link expired**: Check `expires_at` in database
2. **Project inactive**: Set project status to "active"
3. **Tavus API error**: Check conversation creation in API logs
4. **Session not found**: Link may have been deleted

### Conversation Not Starting

1. Check Tavus API key is valid
2. Verify persona and replica IDs are correct
3. Check Tavus quota/limits
4. Review browser console for errors
5. Test with Tavus API directly:
   ```bash
   curl -X POST https://tavusapi.com/v2/conversations \
     -H "Authorization: Bearer YOUR_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "persona_id": "pcb2101fd24e",
       "replica_id": "rc1dc6bbd651"
     }'
   ```

## Production Deployment

### Before Deploying

1. ✅ All 5 projects created and active
2. ✅ Demo links tested and working
3. ✅ Branding configured correctly
4. ✅ Environment variables set in Vercel
5. ✅ Supabase RLS policies enabled
6. ✅ Database migration run

### Environment Variables (Vercel)

Required:
```
TAVUS_API_KEY=your_tavus_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Optional:
```
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

### Post-Deployment Checklist

1. ✅ Login to production admin panel
2. ✅ Verify all 5 projects exist
3. ✅ Generate fresh demo links
4. ✅ Test each demo link
5. ✅ Share links with team
6. ✅ Monitor demo usage in dashboard

## Quick Reference

### Admin Dashboard
```
Production: https://your-domain.com/team/dashboard
Local: http://localhost:3000/team/dashboard
```

### API Endpoints
```
POST /api/projects - Create project
GET /api/projects - List projects
PATCH /api/projects/[id] - Update project
DELETE /api/projects/[id] - Delete project
POST /api/projects/[id]/demo-link - Generate demo link
```

### Files
```
supabase/migration-add-branding-fields.sql - Schema migration
supabase/seed-demo-projects.sql - Seed data
scripts/setup-demo-projects.ts - API setup script
```

## Support

For issues or questions:
1. Check this guide first
2. Review SETUP.md and DEMO_WORKFLOW.md
3. Check application logs
4. Contact Narrator development team
