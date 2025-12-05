# 🎬 ConvoAI Studio Demo Workflow

**Production-Ready Guide for Creating and Sharing Custom Branded AI Demos**

---

## 🚀 Quick Start Overview

ConvoAI Studio enables you to create fully branded, shareable AI conversation experiences in 4 simple steps:

1. **Login** → Access admin dashboard
2. **Create Project** → Configure persona, replica, and branding
3. **Generate Link** → Create shareable demo URL
4. **Share** → Send link to prospects (no login required)

---

## 📋 Step-by-Step Guide

### Step 1: Access Admin Dashboard

**URL:** `https://your-domain.com/team/login`

**Credentials:**
- **Email:** `ari@narrator.studio` OR `devganuga@gmail.com`
- **Password:** `ConvoAI2024!Admin`

**Session:** Stays logged in for 7 days

---

### Step 2: Create a New Project

Click **"Create New Project"** and configure:

#### **Tab 1: Basic Info**

| Field | Description | Example |
|-------|-------------|---------|
| **Project Name** | Internal identifier | "BB King Performance Demo" |
| **Description** | Internal notes | "Interactive performance for venue demos" |
| **Partner** | Client/Partner name | "Will Rogers Theatre" |
| **Persona ID** | AI behavior configuration | `p8c8d94dab90` |
| **Replica ID** | Visual AI avatar | `r783537ef5` |

**Finding Persona/Replica IDs:**
- Dashboard auto-loads from Tavus API
- Shows only completed replicas
- Dropdowns display available options

---

#### **Tab 2: Branding**

Customize the demo appearance:

| Field | Purpose | Example |
|-------|---------|---------|
| **Brand Name** | Client's company name | "Will Rogers Productions" |
| **Brand Logo URL** | Client logo | `https://example.com/logo.png` |
| **Primary Color** | Accent/button color | `#3b82f6` (blue) |
| **Background Color** | Main background | `#0a0a0a` (dark) |

**Preview:** Real-time preview shows how prospects will see it

---

#### **Tab 3: Content (Customization)**

Configure the conversation experience:

| Field | Description | Best Practices |
|-------|-------------|----------------|
| **Welcome Title** | First thing prospects see | "Meet BB King AI" |
| **Welcome Message** | Intro text | "Experience an interactive conversation with the legend" |
| **Instructions** | How to use | "Click 'Start Conversation' and speak naturally" |
| **Custom Greeting** | AI's first words | "Hey there! I'm BB King. What would you like to know about the blues?" |
| **Conversational Context** | Background info for AI | "You are BB King performing at Will Rogers Theatre. Discuss blues history, guitar techniques, and your career." |
| **CTA Text** | Call-to-action button | "Book This Experience" |
| **CTA URL** | Where CTA leads | `https://willrogers.com/book` |

**💡 Tavus Integration:**
- `custom_greeting` → AI's opening message
- `conversational_context` → Appended to persona's system prompt
- Both fields passed to Tavus `/v2/conversations` API

---

#### **Tab 4: Advanced**

| Setting | Default | Purpose |
|---------|---------|---------|
| **Session Duration** | 24 hours | How long demo link remains valid |
| **Show Narrator Branding** | Yes | Display "Powered by Narrator" badge |

---

### Step 3: Activate & Generate Demo Link

#### **Activate Project**
1. Toggle project status to **"Active"**
2. Only active projects can generate demo links

#### **Generate Shareable Link**
1. Click **"Generate Demo Link"** button
2. Link automatically copies to clipboard
3. Format: `https://your-domain.com/demo/demo_[unique-id]`

**Link Features:**
- ✅ No authentication required
- ✅ 24-hour expiration (configurable)
- ✅ Fully branded experience
- ✅ Session tracking in database

---

### Step 4: Share with Prospects

**What Prospects See:**

1. **Branded Landing Page**
   - Client logo and colors
   - Welcome title and message
   - Usage instructions
   - "Start Conversation" button

2. **AI Conversation Interface**
   - Tavus real-time video conversation
   - Custom persona behavior
   - Custom greeting message
   - Visual interaction tracking

3. **Call-to-Action**
   - Branded CTA button
   - Links to booking/contact page

**No Setup Required:**
- Prospects click link → immediately see branded experience
- No login, no forms, no barriers

---

## 🔧 Technical Architecture

### Conversation Flow

```
Project Created
    ↓
Admin generates demo link
    ↓
Prospect clicks link → /demo/[sessionId]
    ↓
System creates Tavus conversation with:
    - replica_id (from project)
    - persona_id (from project)
    - custom_greeting (from project content)
    - conversational_context (appended to persona)
    ↓
Branded viewer loads with:
    - Client branding
    - Custom messaging
    - Tavus video player
    ↓
Real-time conversation begins
```

### Tavus API Integration

**Endpoint:** `POST /v2/conversations`

**Request Payload:**
```json
{
  "replica_id": "r783537ef5",
  "persona_id": "p8c8d94dab90",
  "custom_greeting": "Hey there! I'm BB King...",
  "conversational_context": "You are performing at Will Rogers Theatre...",
  "conversation_name": "Will Rogers Demo - [timestamp]"
}
```

**Response:**
```json
{
  "conversation_id": "c123456",
  "conversation_url": "https://tavus.daily.co/c123456",
  "status": "active",
  "created_at": "2025-12-06T..."
}
```

**Key Configuration:**
- `custom_greeting` → AI's first message to user
- `conversational_context` → Additional persona instructions
- `replica_id` → Visual avatar appearance
- `persona_id` → Behavioral configuration + knowledge base

---

## 📊 Session Tracking

Every demo link creates a database record:

```sql
demo_sessions {
  id: "demo_xyz123",
  project_id: UUID,
  conversation_id: "c123456",  -- from Tavus
  conversation_url: "https://...",
  status: "pending" | "active" | "completed" | "expired",
  expires_at: timestamp,
  created_at: timestamp,
  prospect_name: string,
  prospect_email: string,
  metadata: jsonb
}
```

**Analytics Available:**
- Total demos generated per project
- Last demo timestamp
- Prospect information (if collected)
- Conversation duration
- Session status

---

## 🎯 Production Configuration

### Environment Variables Required

```bash
# Tavus API
TAVUS_API_KEY=your_tavus_api_key

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Authentication
ADMIN_PASSWORD=ConvoAI2024!Admin

# Application
NEXT_PUBLIC_BASE_URL=https://your-production-domain.com
```

### Default Persona & Replica

Set fallback defaults in `.env.local`:

```bash
NEXT_PUBLIC_DEFAULT_REPLICA_ID=r783537ef5
NEXT_PUBLIC_DEFAULT_PERSONA_ID=p8c8d94dab90
```

---

## 🚨 Troubleshooting

### "Nothing shows in dashboard after login"

**Issue:** API routes require authentication
**Solution:** ✅ Fixed - Now supports both Supabase auth AND cookie-based admin sessions

### "Can't generate demo link"

**Check:**
1. Project status is "Active"
2. Both persona_id and replica_id are set
3. Network tab shows successful POST to `/api/projects/[id]/demo-link`

### "Persona/Replica dropdowns empty"

**Check:**
1. Tavus API key is correct in `.env.local`
2. Network tab shows successful responses from `/api/personas` and `/api/replicas`
3. Replicas are in "completed" status (incomplete replicas filtered out)

### "Demo link expired"

- Links expire after 24 hours (configurable in project settings)
- Generate new link from dashboard

---

## 📈 Best Practices

### Project Naming
- **Good:** "BB King - Will Rogers Theatre Demo"
- **Bad:** "Project 1"

### Conversational Context
- Be specific about scenario/venue
- Include relevant background information
- Avoid conflicting with persona's core identity

**Example:**
```
You are BB King performing a special show at Will Rogers Theatre
in Oklahoma. The audience includes venue managers and event planners
interested in booking similar performances. Discuss your experience
with blues music, guitar techniques, and what makes a great venue
for live performance. Be warm, engaging, and help them understand
the value of live AI-powered experiences.
```

### Branding
- Use high-contrast colors for readability
- Ensure logo has transparent background
- Test on mobile devices

---

## 🔗 Quick Reference Links

| Resource | URL |
|----------|-----|
| **Admin Dashboard** | `/team/login` |
| **Demo Preview** | `/demo/preview/[projectId]` (requires login) |
| **Public Demo** | `/demo/[sessionId]` (no login) |
| **Tavus Docs** | `/docs/tavus-api-reference.md` |

---

## 📝 Example: Complete Demo Setup

**Scenario:** Will Rogers Theatre wants to demo BB King AI performance

**Step 1: Create Project**
- Name: "BB King Interactive Experience"
- Partner: "Will Rogers Theatre"
- Persona: BB King AI Performer
- Replica: BB King Visual Avatar

**Step 2: Brand It**
- Brand Name: "Will Rogers Productions"
- Logo: Will Rogers logo URL
- Colors: Theatre's brand colors

**Step 3: Customize**
- Welcome: "Experience BB King Live"
- Greeting: "Welcome to the blues! I'm BB King..."
- Context: "Performing at Will Rogers Theatre..."
- CTA: "Book This Experience" → booking page

**Step 4: Share**
- Generate link
- Send to venue managers
- Track engagement in dashboard

**Result:** Fully branded AI demo that looks like Will Rogers' own platform

---

**🎉 You're Ready to Create Amazing Demos!**

For questions or support, contact the NR8R development team.
