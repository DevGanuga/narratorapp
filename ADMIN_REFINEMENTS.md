# Admin Panel Refinements - Complete Branding Control

## What's Been Added

Your admin panel now has comprehensive branding controls to make shared demo links look perfect for prospects.

### Database Enhancements

**New Project Fields:**
- `welcome_title` - Custom welcome screen title
- `welcome_message` - Personalized welcome text
- `instructions` - How-to guide for prospects
- `brand_logo_url` - Your partner's logo URL
- `brand_name` - Partner company name
- `brand_primary_color` - Text and accent color (#ffffff default)
- `brand_background_color` - Page background (#0a0a0a default)
- `cta_text` - Call-to-action button text
- `cta_url` - CTA button destination
- `session_duration_hours` - Link expiration (1-168 hours, default 24)
- `show_narrator_branding` - Show/hide "Powered by Narrator" footer

### Admin Dashboard Features

The dashboard form is now organized into 4 tabs:

#### 1. **Basic Info** Tab
- Project name (internal)
- Partner/client name
- Description (internal notes)
- Persona selection
- Replica selection

#### 2. **Branding** Tab
- Brand name (displayed in header)
- Logo URL (with preview)
- Primary color picker
- Background color picker
- Live preview of branding

#### 3. **Content** Tab
- Welcome screen title
- Welcome message
- Instructions for prospects
- Custom AI greeting
- Conversational context
- Call-to-action button (text + URL)

#### 4. **Advanced** Tab
- Session duration control
- Show/hide Narrator branding toggle
- Pro tips for optimization

### Prospect-Facing Experience

When prospects click your demo link, they see:

**Welcome Screen** (if configured):
- Branded header with logo and company name
- Custom welcome title and message
- Instructions on how to use the demo
- "Start Demo" button

**Demo Experience**:
- Fully branded header
- Partner colors throughout
- CTA button in header (if configured)
- Tavus conversation iframe
- Clean, professional footer

**Branding Applied**:
- Custom logo in header
- Partner colors (background + text)
- White-label option (hide Narrator branding)
- Responsive design

## How to Use

### Creating a Branded Demo

1. **Go to Dashboard**: `/team/dashboard`

2. **Click "New Project"**

3. **Fill Basic Info** (Tab 1):
   - Name: "Acme Corp Q1 Demo"
   - Partner: "Acme Corporation"
   - Select persona and replica

4. **Configure Branding** (Tab 2):
   - Brand Name: "Acme Corp"
   - Logo URL: "https://acme.com/logo.png"
   - Primary Color: #0066CC (Acme blue)
   - Background: #FFFFFF (white)
   - Preview to verify

5. **Add Content** (Tab 3):
   - Welcome Title: "Welcome to Your Acme Demo"
   - Welcome Message: "We're excited to show you how Acme can transform your workflow..."
   - Instructions: "Click Start Demo to begin. Make sure your camera and microphone are enabled."
   - CTA Text: "Schedule a Call"
   - CTA URL: "https://calendly.com/acme/demo-followup"

6. **Set Advanced Options** (Tab 4):
   - Session Duration: 48 hours (for weekend demos)
   - Show Narrator Branding: Off (white-label)

7. **Save as Draft**, then **Activate**

8. **Generate Demo Link** → Share with prospect

### Preview Before Sharing

Click the **Preview** icon to see exactly what prospects will see:
- Same branded experience
- Test the conversation flow
- Verify colors and branding
- Check responsive design

## Best Practices

### Branding
✅ Use partner's actual logo (transparent PNG works best)
✅ Match their brand colors exactly
✅ Keep background/text contrast high for readability
✅ Test on mobile devices

### Content
✅ Welcome message: 1-2 sentences, friendly tone
✅ Instructions: Clear, concise (3-4 bullet points max)
✅ CTA: Specific action ("Book 15-min call" not just "Learn More")

### Technical
✅ Logo URL: Use CDN or reliable hosting
✅ Session duration: 24-48 hours for urgency
✅ Test conversation before sharing
✅ Monitor analytics (demo_count updates)

### Don'ts
❌ Don't use low-contrast color combinations
❌ Don't write long welcome messages (keep it brief)
❌ Don't forget to activate project before generating links
❌ Don't use broken logo URLs (test first)

## API Updates

The `/api/projects` endpoint now accepts all branding fields:

```json
{
  "name": "Acme Demo",
  "partner": "Acme Corp",
  "persona_id": "p123",
  "replica_id": "r456",
  "brand_name": "Acme Corporation",
  "brand_logo_url": "https://acme.com/logo.png",
  "brand_primary_color": "#0066CC",
  "brand_background_color": "#FFFFFF",
  "welcome_title": "Welcome",
  "welcome_message": "...",
  "instructions": "...",
  "cta_text": "Book a Call",
  "cta_url": "https://calendly.com/...",
  "session_duration_hours": 48,
  "show_narrator_branding": false
}
```

## What Prospects See

### URL Format
`https://yourapp.com/demo/[unique-session-id]`

### Page Structure
1. **Header**: Logo + Brand name + CTA button
2. **Welcome Screen** (optional): Title, message, instructions, start button
3. **Conversation**: Full-screen Tavus iframe
4. **Footer**: Branding attribution (optional)

### Experience Flow
1. Prospect clicks link
2. Sees welcome screen with branding
3. Clicks "Start Demo"
4. Tavus conversation initializes
5. Has natural conversation with AI replica
6. Can click CTA button anytime
7. Session auto-expires after configured duration

## File Structure

**New/Updated Files:**
- `/types/database.ts` - Extended Project type
- `/app/api/projects/route.ts` - Handles branding fields
- `/app/demo/[sessionId]/branded-demo-viewer.tsx` - Branded prospect UI
- `/app/demo/preview/[projectId]/page.tsx` - Preview uses branded viewer
- `/app/team/dashboard/enhanced-dashboard-client.tsx` - Tabbed admin form

## Troubleshooting

**Logo not showing:**
- Verify URL is publicly accessible
- Check image dimensions (recommend max 40px height)
- Try different image format (PNG usually best)

**Colors look wrong:**
- Use hex format (#ffffff)
- Test contrast with WebAIM checker
- Preview in browser first

**Welcome screen not showing:**
- Must have `welcome_message` set
- Clicks "Start Demo" to proceed
- Leave blank to skip welcome screen

**CTA button not appearing:**
- Both `cta_text` AND `cta_url` required
- Validates URL format
- Only shows after welcome screen

## Next Steps

1. **Test the system:**
   - Create a test project with your branding
   - Generate a demo link
   - Open in incognito window
   - Verify everything looks perfect

2. **Share with prospects:**
   - Only share links from "active" projects
   - Track via `demo_count` in dashboard
   - Monitor session statuses

3. **Iterate:**
   - Use preview to refine branding
   - A/B test different welcome messages
   - Adjust session durations based on usage

Ready to create beautiful, branded demo experiences! 🎨
