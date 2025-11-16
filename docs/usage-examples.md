# ConvoAI Studio - Usage Examples

**Internal Development Guide**  
*For NR8R Team Members*

---

> **Note**: This document contains code examples and patterns for using ConvoAI Studio's API wrapper. These examples are for internal development purposes only.

This document provides practical examples for using the Tavus API wrapper in your Next.js application.

## Table of Contents

- [Server-Side Usage](#server-side-usage)
- [API Routes](#api-routes)
- [Creating Conversations](#creating-conversations)
- [Managing Personas](#managing-personas)
- [Error Handling](#error-handling)
- [Webhooks](#webhooks)

---

## Server-Side Usage

### Using Server Actions (Recommended for Next.js 14+)

Server actions provide a simple way to interact with the Tavus API from both server and client components.

```typescript
// app/conversations/page.tsx
import { createConversationAction } from '@/lib/tavus-server';

export default async function ConversationsPage() {
  // Create a conversation
  const conversation = await createConversationAction({
    replica_id: 'rfe12d8b9597',
    persona_id: 'p9a95912',
    conversation_name: 'Customer Support Demo',
    custom_greeting: 'Hi! How can I help you today?',
  });

  return (
    <div>
      <h1>Join Your Conversation</h1>
      <iframe 
        src={conversation.conversation_url}
        width="100%"
        height="600px"
      />
    </div>
  );
}
```

### Using the Client Directly

For more control, use the Tavus client directly in server components or API routes.

```typescript
// app/api/test-connection/route.ts
import { createTavusClient } from '@/lib/tavus-client';

export async function GET() {
  const client = createTavusClient();
  
  try {
    const personas = await client.listPersonas({ limit: 1 });
    return Response.json({ success: true, count: personas.total_count });
  } catch (error) {
    return Response.json({ success: false, error }, { status: 500 });
  }
}
```

---

## API Routes

### Create Conversation Endpoint

```typescript
// app/api/conversations/route.ts
import { NextRequest } from 'next/server';
import { createTavusClient } from '@/lib/tavus-client';
import type { CreateConversationRequest } from '@/types/tavus';

export async function POST(request: NextRequest) {
  try {
    const client = createTavusClient();
    const body: CreateConversationRequest = await request.json();
    
    // Add your custom validation here
    if (!body.replica_id || !body.persona_id) {
      return Response.json(
        { error: 'replica_id and persona_id are required' },
        { status: 400 }
      );
    }
    
    const conversation = await client.createConversation(body);
    
    return Response.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return Response.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = createTavusClient();
    const { searchParams } = new URL(request.url);
    
    const conversations = await client.listConversations({
      limit: parseInt(searchParams.get('limit') || '10'),
      page: parseInt(searchParams.get('page') || '1'),
      status: searchParams.get('status') as 'active' | 'ended' | undefined,
    });
    
    return Response.json(conversations);
  } catch (error) {
    console.error('Error listing conversations:', error);
    return Response.json(
      { error: 'Failed to list conversations' },
      { status: 500 }
    );
  }
}
```

### Get Conversation Details

```typescript
// app/api/conversations/[id]/route.ts
import { NextRequest } from 'next/server';
import { createTavusClient } from '@/lib/tavus-client';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = createTavusClient();
    const { searchParams } = new URL(request.url);
    const verbose = searchParams.get('verbose') === 'true';
    
    const conversation = await client.getConversation(params.id, verbose);
    
    return Response.json(conversation);
  } catch (error) {
    console.error('Error getting conversation:', error);
    return Response.json(
      { error: 'Failed to get conversation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = createTavusClient();
    await client.deleteConversation(params.id);
    
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return Response.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}
```

---

## Creating Conversations

### Basic Conversation

```typescript
import { createTavusClient } from '@/lib/tavus-client';

const client = createTavusClient();

const conversation = await client.createConversation({
  replica_id: 'rfe12d8b9597',
  persona_id: 'p9a95912',
  conversation_name: 'Sales Training',
});

console.log('Join at:', conversation.conversation_url);
```

### Audio-Only Conversation

```typescript
const audioConversation = await client.createConversation({
  replica_id: 'rfe12d8b9597',
  persona_id: 'p9a95912',
  audio_only: true,
  custom_greeting: 'Hello! I can help you with voice-only support.',
});
```

### Conversation with Documents

```typescript
const conversation = await client.createConversation({
  replica_id: 'rfe12d8b9597',
  persona_id: 'p9a95912',
  document_ids: ['doc_1234567890'],
  document_tags: ['sales', 'product_info'],
  document_retrieval_strategy: 'balanced',
});
```

### Conversation with Memory

```typescript
const conversation = await client.createConversation({
  replica_id: 'rfe12d8b9597',
  persona_id: 'p9a95912',
  memory_stores: ['customer_john_doe'],
  conversational_context: 'This is a follow-up conversation about the previous support ticket.',
});
```

### Test Mode Conversation

```typescript
// Create a conversation for testing without incurring costs
const testConversation = await client.createConversation({
  replica_id: 'rfe12d8b9597',
  persona_id: 'p9a95912',
  test_mode: true,
});

// This conversation will have status 'ended' and won't affect concurrency limits
```

---

## Managing Personas

### Create a Persona

```typescript
import { createTavusClient } from '@/lib/tavus-client';

const client = createTavusClient();

const persona = await client.createPersona({
  persona_name: 'Sales Coach',
  system_prompt: `You are an expert sales coach specializing in B2B SaaS. 
    Help sales representatives improve their pitch, handle objections, 
    and close deals more effectively.`,
  context: `You have 15 years of experience in enterprise software sales.
    You prefer consultative selling approaches and emphasize value over features.`,
  default_replica_id: 'rfe12d8b9597',
  layers: {
    llm: {
      model: 'tavus-gpt-4o',
      temperature: 0.7,
    },
    tts: {
      tts_engine: 'cartesia',
      tts_emotion_control: true,
    },
  },
});
```

### Update Persona with JSON Patch

```typescript
await client.patchPersona('p5317866', [
  {
    op: 'replace',
    path: '/persona_name',
    value: 'Senior Sales Coach',
  },
  {
    op: 'replace',
    path: '/layers/llm/temperature',
    value: 0.8,
  },
  {
    op: 'add',
    path: '/document_tags',
    value: ['advanced_techniques', 'enterprise_sales'],
  },
]);
```

### List All Personas

```typescript
const personas = await client.listPersonas({
  limit: 20,
  page: 1,
  persona_type: 'user', // Only user-created personas
});

console.log(`Total personas: ${personas.total_count}`);
personas.data.forEach((persona) => {
  console.log(`- ${persona.persona_name} (${persona.persona_id})`);
});
```

---

## Error Handling

### Handling API Errors

```typescript
import { createTavusClient } from '@/lib/tavus-client';
import type { TavusApiError } from '@/types/tavus';

const client = createTavusClient();

try {
  const conversation = await client.createConversation({
    replica_id: 'invalid_id',
    persona_id: 'p9a95912',
  });
} catch (error) {
  const apiError = error as TavusApiError;
  
  if (apiError.status_code === 404) {
    console.error('Replica not found');
  } else if (apiError.status_code === 401) {
    console.error('Invalid API key');
  } else if (apiError.status_code === 408) {
    console.error('Request timeout');
  } else {
    console.error(`API Error: ${apiError.message}`);
  }
}
```

### Timeout Configuration

```typescript
// Create a client with custom timeout
const client = createTavusClient({
  timeout: 60000, // 60 seconds
});
```

---

## Webhooks

### Setting Up Webhook Handler

```typescript
// app/api/webhooks/tavus/route.ts
import { NextRequest } from 'next/server';
import type { ConversationWebhookPayload } from '@/types/tavus';

export async function POST(request: NextRequest) {
  try {
    const payload: ConversationWebhookPayload = await request.json();
    
    console.log('Webhook received:', payload.event_type);
    
    switch (payload.event_type) {
      case 'conversation.started':
        console.log('Conversation started:', payload.conversation_id);
        // Handle conversation start
        break;
        
      case 'conversation.ended':
        console.log('Conversation ended:', payload.conversation_id);
        // Handle conversation end (e.g., save transcript, send email)
        break;
        
      case 'conversation.updated':
        console.log('Conversation updated:', payload.conversation_id);
        // Handle conversation updates
        break;
    }
    
    return Response.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return Response.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
```

### Creating Conversation with Webhook

```typescript
const conversation = await client.createConversation({
  replica_id: 'rfe12d8b9597',
  persona_id: 'p9a95912',
  callback_url: 'https://yourdomain.com/api/webhooks/tavus',
});
```

---

## Advanced Examples

### Embedding Conversation in Your App

```typescript
// app/components/TavusConversation.tsx
'use client';

import { useEffect, useState } from 'react';

interface TavusConversationProps {
  conversationUrl: string;
}

export function TavusConversation({ conversationUrl }: TavusConversationProps) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p>Loading conversation...</p>
        </div>
      )}
      <iframe
        src={conversationUrl}
        className="w-full h-full border-0"
        onLoad={() => setIsLoading(false)}
        allow="camera; microphone; autoplay"
      />
    </div>
  );
}
```

### Getting Conversation Transcript

```typescript
// Get conversation with verbose data including transcript
const conversation = await client.getConversation('c123456', true);

if ('transcript' in conversation && conversation.transcript) {
  conversation.transcript.forEach((entry) => {
    console.log(`[${entry.role}] ${entry.message}`);
  });
}
```

### Batch Operations

```typescript
// Create multiple conversations in parallel
const conversationRequests = [
  { replica_id: 'r1', persona_id: 'p1', conversation_name: 'Session 1' },
  { replica_id: 'r1', persona_id: 'p2', conversation_name: 'Session 2' },
  { replica_id: 'r2', persona_id: 'p1', conversation_name: 'Session 3' },
];

const conversations = await Promise.all(
  conversationRequests.map((req) => client.createConversation(req))
);

console.log(`Created ${conversations.length} conversations`);
```

---

## Best Practices

1. **Always use environment variables** for API keys
2. **Implement proper error handling** for all API calls
3. **Use test_mode** when developing to avoid costs
4. **Set appropriate timeouts** based on your use case
5. **Implement webhook handlers** for long-running conversations
6. **Cache persona and replica IDs** to avoid unnecessary lookups
7. **Use verbose mode** when you need detailed conversation analytics
8. **Clean up ended conversations** regularly to maintain data hygiene

---

## Next Steps

- Explore the complete [API Reference](./tavus-api-reference.md)
- Check [Type Definitions](../types/tavus.ts) for detailed TypeScript types
- Set up [webhook handlers](#webhooks) for real-time updates
- Implement [error handling](#error-handling) in your application

