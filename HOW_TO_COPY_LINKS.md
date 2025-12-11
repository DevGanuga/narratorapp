# How to Copy Demo Links - Quick Guide

## The Problem
You're clicking the **WRONG BUTTON**! There are 5 buttons that appear when you hover over a project:

```
[📡 Status] [✏️ Edit] [🔗 Link] [👁️ Preview] [🗑️ Delete]
   ↑                      ↑
  DON'T CLICK THIS!    CLICK THIS ONE!
```

## What Happened
- **First button (📡 radio waves icon)**: Toggles status between active/draft
- **You clicked this** → Changed CRESSI from active to draft
- **Third button (🔗 chain link icon)**: Generates and copies demo link
- **You need to click this** → Copies link to clipboard

## Correct Steps to Copy Link

1. **Login** to `/team/dashboard` with:
   - Email: `admin@narrator.studio`
   - Password: `ConvoAI2024!Admin`

2. **Hover over any project row** - buttons will appear on the right

3. **Click the THIRD button** (🔗 link chain icon) - NOT the first button!

4. **Wait for alert**: "Demo link copied to clipboard!"

5. **Paste the link** - it's automatically in your clipboard

## Button Reference
| Position | Icon | Action | What It Does |
|----------|------|--------|--------------|
| 1st | 📡 Radio waves | Toggle Status | Changes active↔draft |
| 2nd | ✏️ Pencil | Edit | Opens edit form |
| **3rd** | **🔗 Chain link** | **Generate Link** | **← CLICK THIS!** |
| 4th | 👁️ Eye | Preview | Opens preview page |
| 5th | 🗑️ Trash | Delete | Deletes project |

## Quick Fix if Projects Are Draft

Run this in Supabase SQL Editor:
```sql
UPDATE projects
SET status = 'active'
WHERE name LIKE '%Demo' AND status != 'active';
```

## All 5 Demo Projects Should Show:
- ✅ BB LIVE Demo
- ✅ BB SEATED Demo
- ✅ CRESSI Demo
- ✅ FLO CU Demo
- ✅ OSWALD Demo

## Troubleshooting

**Q: I don't see any projects**
A: Run `FIX_RLS.sql` in Supabase first to disable RLS

**Q: Link button is grayed out**
A: Project status must be "active" - check badge shows green "ACTIVE"

**Q: Still not working**
A:
1. Hard refresh browser (Cmd+Shift+R)
2. Check browser console for errors (Cmd+Option+J)
3. Verify project status in Supabase is "active"

## Demo Link Format
Links look like: `https://your-domain.com/demo/demo_xxxxxxxxxxxxx`

Each link:
- ✅ Expires in 24 hours
- ✅ Works unlimited times until expiration
- ✅ No login required
- ✅ Tracks first view only
