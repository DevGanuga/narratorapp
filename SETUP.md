# ConvoAI Studio - Setup Guide

## 🚀 Quick Setup (5 Minutes)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Environment File

Create a `.env.local` file in the root directory:

```env
TAVUS_API_KEY=your_actual_tavus_api_key_here
```

**That's it!** Just paste your Tavus API key and you're ready to go.

---

## 🎯 Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎬 Using the Studio

### Option 1: Use the Studio UI (Recommended)

1. Navigate to [http://localhost:3000/studio](http://localhost:3000/studio)
2. Click the **Settings** button (gear icon) in the control dock
3. **Select a Persona** from the dropdown (auto-loads your existing personas)
4. **Select a Replica** from the dropdown (auto-loads completed replicas only)
5. Click **"Start Conversation"**
6. The Tavus conversation iframe will load automatically
7. Grant camera/microphone permissions when prompted
8. Start talking with your AI replica!

### Option 2: Use the API Routes

#### Create a Conversation

```bash
curl -X POST http://localhost:3000/api/conversations \
  -H "Content-Type: application/json" \
  -d '{
    "replica_id": "r783537ef5",
    "persona_id": "p8c8d94dab90",
    "conversation_name": "Test Session"
  }'
```

#### List All Conversations

```bash
curl http://localhost:3000/api/conversations
```

#### Get Conversation Details

```bash
curl http://localhost:3000/api/conversations/c20b2d0faaf4f4a6
```

#### End a Conversation

```bash
curl -X POST http://localhost:3000/api/conversations/c20b2d0faaf4f4a6/end
```

---

## 📊 What's Been Built

### ✅ Fully Functional Features

1. **Complete Tavus API Integration**
   - All 35 endpoints wrapped with TypeScript
   - Proper error handling
   - Request timeout management
   - Environment-based configuration

2. **Studio Interface**
   - Real-time conversation management
   - Persona/Replica selection with auto-loading
   - Live iframe embedding of Tavus conversations
   - Connection status monitoring
   - Duration tracking
   - Session management (start/end/reset)
   - Error handling with user-friendly messages

3. **Server Actions** (Next.js 14+)
   - `createConversationAction()`
   - `endConversationAction()`
   - `listConversationsAction()`
   - `listPersonasAction()`
   - `listReplicasAction()`
   - All with proper error handling

4. **API Routes**
   - `POST /api/conversations` - Create conversation
   - `GET /api/conversations` - List conversations
   - `GET /api/conversations/[id]` - Get conversation
   - `POST /api/conversations/[id]/end` - End conversation
   - `DELETE /api/conversations/[id]` - Delete conversation
   - `GET /api/personas` - List personas
   - `POST /api/personas` - Create persona
   - `GET /api/replicas` - List replicas
   - `POST /api/replicas` - Create replica

5. **Rich UX Features**
   - Loading states with spinners
   - Error states with retry options
   - Success states with session info
   - Real-time duration counter
   - Connection status indicators
   - Settings panel (toggle with gear icon)
   - Responsive design (mobile/tablet/desktop)
   - Dark theme with gradient animations

---

## 🔧 Advanced Configuration

### Optional Environment Variables

```env
# Required
TAVUS_API_KEY=your_key_here

# Optional - App branding
NEXT_PUBLIC_APP_NAME=ConvoAI Studio
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional - Default IDs for quick testing
NEXT_PUBLIC_DEFAULT_REPLICA_ID=r783537ef5
NEXT_PUBLIC_DEFAULT_PERSONA_ID=p8c8d94dab90
```

### Custom Timeout

Edit `lib/tavus-client.ts` if you need longer timeouts:

```typescript
const client = new TavusClient({
  apiKey: process.env.TAVUS_API_KEY!,
  timeout: 60000, // 60 seconds instead of default 30
});
```

---

## 🎨 Studio Features

### Real-Time Monitoring

- ✅ Connection status (Connected/Disconnected/Connecting)
- ✅ Live duration timer (HH:MM:SS format)
- ✅ Session ID display
- ✅ Conversation URL management
- ✅ Auto-polling for conversation status (every 5 seconds)

### Controls

- **Mute/Unmute** - Toggle microphone (visual feedback)
- **Camera On/Off** - Toggle video (visual feedback)
- **Start Conversation** - Initialize new session
- **End Conversation** - Gracefully close session
- **Settings** - Configure persona/replica selection

### State Management

- `idle` - Ready to start
- `loading` - Connecting to Tavus
- `active` - Live conversation
- `ending` - Closing conversation
- `ended` - Session complete
- `error` - Something went wrong

---

## 📚 Code Examples

### Using Server Actions in a Component

```typescript
'use client';

import { createConversationAction } from '@/lib/tavus-server';

export default function MyComponent() {
  const handleStart = async () => {
    const result = await createConversationAction({
      replica_id: 'r783537ef5',
      persona_id: 'p8c8d94dab90',
    });
    
    if (result.success) {
      console.log('Conversation URL:', result.data.conversation_url);
    } else {
      console.error('Error:', result.error);
    }
  };
  
  return <button onClick={handleStart}>Start</button>;
}
```

### Using the API Client Directly

```typescript
import { createTavusClient } from '@/lib/tavus-client';

const client = createTavusClient();

// Create a conversation
const conversation = await client.createConversation({
  replica_id: 'r783537ef5',
  persona_id: 'p8c8d94dab90',
  conversation_name: 'My Session',
});

console.log('Join at:', conversation.conversation_url);
```

### Loading Personas and Replicas

```typescript
import { listPersonasAction, listReplicasAction } from '@/lib/tavus-server';

// Get all personas
const personasResult = await listPersonasAction({ limit: 50 });
if (personasResult.success) {
  console.log('Personas:', personasResult.data.data);
}

// Get completed replicas only
const replicasResult = await listReplicasAction({ 
  limit: 50, 
  verbose: true 
});
if (replicasResult.success) {
  const completed = replicasResult.data.data.filter(
    r => r.status === 'completed'
  );
  console.log('Ready replicas:', completed);
}
```

---

## 🐛 Troubleshooting

### "Invalid API key" Error

- Check that `.env.local` exists in the root directory
- Verify the API key is correct (no extra spaces)
- Restart the dev server after creating `.env.local`

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### No Personas or Replicas Showing

The studio automatically loads your existing personas and replicas from Tavus. If none appear:

1. Check that your API key has access
2. Verify you have created personas/replicas in Tavus
3. For replicas, only `completed` status replicas are shown

### Conversation Won't Start

- Ensure both a persona and replica are selected
- Check browser console for error messages
- Verify the selected replica has `completed` status
- Check that the persona ID is valid

### Iframe Not Loading

- Grant camera/microphone permissions when prompted
- Check browser console for CORS errors
- Verify your Tavus account is active
- Try in an incognito window (clear cache)

---

## 📖 Additional Documentation

- **[API Quick Reference](./docs/api-quick-reference.md)** - All endpoints at a glance
- **[Complete API Reference](./docs/tavus-api-reference.md)** - Detailed endpoint docs
- **[Usage Examples](./docs/usage-examples.md)** - Code patterns and recipes
- **[Getting Started Guide](./docs/GETTING_STARTED.md)** - Comprehensive tutorial
- **[Type Definitions](./types/tavus.ts)** - TypeScript types

---

## 🚀 Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add `TAVUS_API_KEY` to environment variables
4. Deploy!

Or use the Vercel CLI:

```bash
vercel deploy --prod
```

---

## ✨ What Makes This Production-Ready

✅ **Type Safety** - Full TypeScript coverage (60+ interfaces)  
✅ **Error Handling** - Graceful failures with user-friendly messages  
✅ **Loading States** - Professional UX with spinners and feedback  
✅ **Real-time Updates** - Status polling and duration tracking  
✅ **Responsive Design** - Works on mobile, tablet, desktop  
✅ **Clean Architecture** - Separation of concerns (client/server/types)  
✅ **Documentation** - Comprehensive guides and examples  
✅ **API Routes** - RESTful endpoints for external integration  
✅ **Server Actions** - Modern Next.js patterns  
✅ **Environment Config** - Secure API key management  

---

## 🎉 You're All Set!

The application is fully functional and production-ready. Just add your API key and start creating conversations!

**Questions?** Check the docs folder or refer to the Tavus API documentation at [https://docs.tavus.io](https://docs.tavus.io)

---

**Built with ❤️ by the NR8R team**

