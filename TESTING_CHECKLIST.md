# Testing Checklist - Admin Panel Setup

## Prerequisites

### 1. Environment Variables
Check `.env.local` has:
```bash
✓ TAVUS_API_KEY=c040de66954c495d9f767859925877e4
✓ NEXT_PUBLIC_SUPABASE_URL=https://cjvmzfggybtjtwklqekj.supabase.co
✓ NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 2. Database Migrations
✅ Applied migrations:
- `initial_schema_setup` - Core tables (projects, demo_sessions, team_members)
- `setup_admin_allowlist` - Admin email validation functions
- `add_branding_and_customization` - Branding fields

### 3. Admin User Setup
Create Supabase Auth accounts for:
- ✓ ari@narrator.studio
- ✓ devganuga@gmail.com

**How to create:**
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" → "Create new user"
3. Enter email + password
4. User will auto-join `team_members` table on first login

## Testing Flow

### Step 1: Authentication
1. Start dev server: `npm run dev`
2. Navigate to: `http://localhost:3000/team/login`
3. **Test login with admin email:**
   - ✓ Should login successfully
   - ✓ Redirect to `/team/dashboard`
4. **Test login with non-admin email:**
   - ✓ Should show "Access denied" error
   - ✓ Should NOT authenticate

**Expected Behavior:**
- Only allowlisted emails can login
- Non-allowlisted emails rejected at API level

---

### Step 2: Dashboard Loading
On `/team/dashboard`:
1. ✓ Dashboard loads without errors
2. ✓ Shows "No projects yet" if empty
3. ✓ "New Project" button visible

**Check Browser Console:**
- ✓ No JavaScript errors
- ✓ No failed API calls (except expected 401s before auth)

---

### Step 3: Load Tavus Data
1. Dashboard should make API calls to:
   - `/api/personas` → List your Tavus personas
   - `/api/replicas` → List your Tavus replicas

**Expected:**
- ✓ Personas dropdown populated
- ✓ Replicas dropdown shows only "completed" replicas
- ✓ Check console for any Tavus API errors

**If Empty:**
- Verify `TAVUS_API_KEY` is correct
- Check Tavus dashboard has personas/replicas created
- Review API response in Network tab

---

### Step 4: Create Test Project

Click "New Project" and fill in:

**Basic Info:**
- Name: "Test Demo"
- Partner: "Test Client"
- Description: "Testing the admin panel"
- Persona: (select any)
- Replica: (select any)

**Optional - Test Branding:**
- Brand Name: "Test Corp"
- Brand Logo URL: (use a test image URL or skip)
- Primary Color: #0066CC
- Background Color: #FFFFFF

**Optional - Test Content:**
- Welcome Title: "Welcome to Test"
- Welcome Message: "This is a test demo."
- CTA Text: "Contact Us"
- CTA URL: "https://example.com"

Click **"Create Project"**

**Expected:**
- ✓ Saves successfully
- ✓ Returns to projects list
- ✓ New project appears with "draft" status
- ✓ Check Supabase → projects table for new row

---

### Step 5: Activate Project
1. Hover over project card
2. Click **status toggle icon** (radio waves)
3. Status changes: "draft" → "active"

**Expected:**
- ✓ Badge changes color (amber → green)
- ✓ Badge text shows "active"
- ✓ Database updates confirmed

---

### Step 6: Generate Demo Link
1. With project "active", click **link icon**
2. Wait for generation
3. Check clipboard

**Expected:**
- ✓ Shows loading spinner
- ✓ Alert: "Demo link copied to clipboard!"
- ✓ Link format: `http://localhost:3000/demo/[uuid]`
- ✓ Check `demo_sessions` table for new session

**If Fails:**
- Check `/api/projects/[id]/demo-link` route
- Verify project is actually "active"
- Check browser console for errors

---

### Step 7: Preview Demo
1. Click **preview icon** (eye) on project
2. Opens: `/demo/preview/[projectId]`

**Expected:**
- ✓ Shows branded welcome screen (if configured)
- ✓ Displays logo and brand colors
- ✓ "Start Demo" button works
- ✓ Tavus conversation iframe loads

**Preview Mode:**
- Uses mock session (doesn't create real Tavus conversation)
- Shows exact prospect experience
- Tests branding without consuming API credits

---

### Step 8: Test Real Demo Link
1. Paste generated demo link in new incognito window
2. Opens: `/demo/[sessionId]`

**Expected:**
- ✓ Welcome screen appears (if configured)
- ✓ Custom branding applied
- ✓ Click "Start Demo"
- ✓ Creates Tavus conversation
- ✓ Conversation iframe loads
- ✓ Can interact with AI replica

**Full Flow:**
1. Shows loading while creating conversation
2. Displays welcome screen with branding
3. Start button initializes Tavus
4. Conversation starts
5. CTA button visible (if configured)

---

### Step 9: Edit Project
1. Click **edit icon** (pencil) on project
2. Modify any fields
3. Click "Save Changes"

**Expected:**
- ✓ Loads existing values
- ✓ Can modify all fields
- ✓ Saves successfully
- ✓ Returns to projects list
- ✓ Changes reflected in database

---

### Step 10: Project Management
Test all actions:

**Toggle Status:**
- ✓ active ↔ draft works
- ✓ Can only generate links when "active"

**Delete Project:**
- ✓ Shows confirmation dialog
- ✓ Deletes successfully
- ✓ Removes from list
- ✓ Cascades to demo_sessions (if any)

---

## Common Issues & Solutions

### 🔴 "Unauthorized" on Dashboard
**Problem:** Not authenticated properly
**Fix:**
1. Clear browser cookies
2. Log out completely
3. Log back in with admin email
4. Check Supabase → Authentication → Users

### 🔴 Personas/Replicas Not Loading
**Problem:** Tavus API error
**Fix:**
1. Verify `TAVUS_API_KEY` in `.env.local`
2. Check Tavus dashboard for API key permissions
3. Look at Network tab → `/api/personas` response
4. Check console for detailed error

### 🔴 Can't Generate Demo Link
**Problem:** Project not active or API error
**Fix:**
1. Ensure project status is "active" (not draft)
2. Check `/api/projects/[id]/demo-link` endpoint
3. Verify Tavus API can create conversations
4. Check browser console

### 🔴 Demo Link Shows 404
**Problem:** Session not found or expired
**Fix:**
1. Check `demo_sessions` table for session
2. Verify `expires_at` hasn't passed
3. Confirm project is still "active"
4. Generate new link

### 🔴 Branding Not Showing
**Problem:** Fields not saved or logo URL broken
**Fix:**
1. Edit project → verify branding fields saved
2. Test logo URL in browser directly
3. Check color values are valid hex
4. Use preview mode to test

### 🔴 Conversation Won't Start
**Problem:** Tavus API or network issue
**Fix:**
1. Check Tavus API status
2. Verify persona/replica IDs are valid
3. Check browser console for errors
4. Test with different persona/replica

---

## Success Criteria

### ✅ Authentication Works
- Admin emails can login
- Non-admin emails rejected
- Session persists across page loads

### ✅ Project CRUD Operations
- Can create projects
- Can edit existing projects
- Can delete projects
- Can toggle active/draft status

### ✅ Tavus Integration
- Personas load from API
- Replicas load from API
- Can create conversations
- Demo links work end-to-end

### ✅ Branding System
- Can configure all branding fields
- Preview shows branded experience
- Demo links use correct branding
- Colors and logos render properly

### ✅ Demo Experience
- Welcome screen displays (if configured)
- Conversation initializes properly
- UI is polished and professional
- Works on mobile devices

---

## Database Verification Queries

Run in Supabase SQL Editor:

```sql
-- Check projects
SELECT id, name, status, demo_count, brand_name, brand_primary_color
FROM projects;

-- Check demo sessions
SELECT id, project_id, status, created_at, expires_at
FROM demo_sessions
ORDER BY created_at DESC;

-- Check team members
SELECT email, role, created_at
FROM team_members;

-- Count active demos
SELECT
  p.name,
  COUNT(ds.id) as session_count,
  COUNT(CASE WHEN ds.status = 'active' THEN 1 END) as active_sessions
FROM projects p
LEFT JOIN demo_sessions ds ON p.id = ds.project_id
GROUP BY p.id, p.name;
```

---

## Performance Checklist

- ✓ Dashboard loads in < 2 seconds
- ✓ Demo link generation < 3 seconds
- ✓ Tavus conversation starts < 5 seconds
- ✓ No JavaScript errors in console
- ✓ No broken images or links
- ✓ Mobile responsive design works

---

## Next Steps After Testing

1. **Create Real Projects:**
   - Use actual client branding
   - Configure meaningful welcome messages
   - Set appropriate session durations

2. **Share Demo Links:**
   - Test with internal team first
   - Get feedback on UX
   - Monitor analytics (demo_count)

3. **Iterate:**
   - Refine branding based on feedback
   - A/B test different welcome messages
   - Track conversion rates

---

## Questions or Issues?

- Check `ADMIN_REFINEMENTS.md` for feature details
- Review `ADMIN_SETUP.md` for configuration help
- Check browser console for errors
- Review Supabase logs for database issues
- Check Tavus dashboard for API issues

**Ready to test! Start with Step 1 and work through each step systematically.** ✓
