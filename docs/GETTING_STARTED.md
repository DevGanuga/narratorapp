# Getting Started with Tavus API Wrapper

This guide will walk you through setting up and using the Tavus API wrapper in your agency's applications.

---

## 📋 Prerequisites

- Node.js 18 or higher
- A Tavus account with API access
- Tavus API Key ([Get one here](https://tavus.io))

---

## 🚀 Installation

### 1. Clone or Set Up the Project

```bash
# If you're starting fresh
cd /path/to/narratorapp

# Install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Tavus API key:

```env
TAVUS_API_KEY=your_actual_tavus_api_key_here
NEXT_PUBLIC_APP_NAME=Your Agency Name
NEXT_PUBLIC_APP_URL=https://youragency.com
```

### 3. Verify Setup

Run the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app running.

---

## 🎯 Basic Usage

### Using the Client Directly

```typescript
import { createTavusClient } from '@/lib';

// Create a client instance (automatically loads API key from env)
const client = createTavusClient();

// Create a conversation
const conversation = await client.createConversation({
  replica_id: 'r783537ef5',
  persona_id: 'p5317866',
  conversation_name: 'Customer Support Demo',
  custom_greeting: 'Hi! How can I help you today?',
});

console.log('Join at:', conversation.conversation_url);
```

### Using Server Actions (Next.js 14+)

```typescript
// app/demo/page.tsx
import { createConversationAction } from '@/lib/tavus-server';

export default async function DemoPage() {
  const conversation = await createConversationAction({
    replica_id: 'r783537ef5',
    persona_id: 'p5317866',
    conversation_name: 'Demo',
  });

  return (
    <div>
      <h1>Your Conversation</h1>
      <iframe 
        src={conversation.conversation_url}
        width="100%"
        height="600px"
        allow="camera; microphone; autoplay"
      />
    </div>
  );
}
```

### Creating an API Route

```typescript
// app/api/conversations/route.ts
import { NextRequest } from 'next/server';
import { createTavusClient } from '@/lib';
import type { CreateConversationRequest } from '@/lib';

export async function POST(request: NextRequest) {
  try {
    const client = createTavusClient();
    const body: CreateConversationRequest = await request.json();
    
    const conversation = await client.createConversation(body);
    
    return Response.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Error:', error);
    return Response.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
```

---

## 📚 Common Operations

### 1. Create a Replica

```typescript
import { createTavusClient } from '@/lib';

const client = createTavusClient();

const replica = await client.createReplica({
  train_video_url: 'https://your-bucket.s3.amazonaws.com/training-video.mp4',
  replica_name: 'Sales Rep',
  callback_url: 'https://youragency.com/api/webhooks/replica',
});

console.log('Replica ID:', replica.replica_id);
console.log('Status:', replica.status); // 'started'
```

### 2. Create a Persona

```typescript
const persona = await client.createPersona({
  persona_name: 'Customer Support Agent',
  system_prompt: `You are a friendly and helpful customer support agent.
    Your goal is to resolve customer issues quickly and professionally.`,
  context: `You have access to our product documentation and can help with:
    - Account issues
    - Billing questions
    - Technical support
    - Feature requests`,
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

console.log('Persona ID:', persona.persona_id);
```

### 3. Upload a Document to Knowledge Base

```typescript
const document = await client.createDocument({
  document_url: 'https://youragency.com/docs/product-guide.pdf',
  document_name: 'Product User Guide',
  tags: ['support', 'product', 'documentation'],
  properties: {
    department: 'customer_success',
    version: '2.0',
  },
});

console.log('Document UUID:', document.uuid);
console.log('Status:', document.status); // 'processing'
```

### 4. Generate a Video

```typescript
const video = await client.generateVideo({
  replica_id: 'r783537ef5',
  script: 'Welcome to our product! Let me show you around.',
  video_name: 'Product Intro',
  background_url: 'https://youragency.com',
  callback_url: 'https://youragency.com/api/webhooks/video',
});

console.log('Video ID:', video.video_id);
console.log('Hosted URL:', video.hosted_url);
```

### 5. Create Objectives for a Persona

```typescript
const objective = await client.createObjectives({
  data: [
    {
      objective_name: 'Capture Lead Information',
      objective_prompt: 'Politely collect the user\'s name, email, and company',
      confirmation_mode: 'automatic',
      output_variables: ['name', 'email', 'company'],
      modality: 'conversational',
    },
  ],
});

console.log('Objective ID:', objective.objectives_id);
```

### 6. Create Guardrails

```typescript
const guardrails = await client.createGuardrails({
  name: 'Professional Boundaries',
  data: [
    {
      guardrails_prompt: 'Never discuss competitors or make negative comparisons',
    },
    {
      guardrails_prompt: 'Always maintain professional and respectful tone',
    },
    {
      guardrails_prompt: 'Do not share pricing without proper qualification',
    },
  ],
});

console.log('Guardrails ID:', guardrails.guardrails_id);
```

---

## 🔧 Advanced Usage

### Error Handling

```typescript
import { createTavusClient } from '@/lib';
import type { TavusApiError } from '@/lib';

const client = createTavusClient();

try {
  const conversation = await client.createConversation({
    replica_id: 'invalid_id',
    persona_id: 'p123',
  });
} catch (error) {
  const apiError = error as TavusApiError;
  
  switch (apiError.status_code) {
    case 404:
      console.error('Replica not found');
      break;
    case 401:
      console.error('Invalid API key');
      break;
    case 408:
      console.error('Request timed out');
      break;
    default:
      console.error('Error:', apiError.message);
  }
}
```

### Custom Timeout

```typescript
import { TavusClient } from '@/lib';

const client = new TavusClient({
  apiKey: process.env.TAVUS_API_KEY!,
  timeout: 60000, // 60 seconds
});
```

### Using Test Mode

```typescript
// Create a conversation in test mode (no cost, doesn't affect limits)
const testConversation = await client.createConversation({
  replica_id: 'r783537ef5',
  persona_id: 'p5317866',
  test_mode: true,
});

// Conversation is created but replica won't join
// Status will be 'ended'
```

### Verbose Mode for Detailed Data

```typescript
// Get conversation with full transcript and analytics
const verboseConversation = await client.getConversation('c123456', true);

if ('transcript' in verboseConversation) {
  verboseConversation.transcript?.forEach((entry) => {
    console.log(`[${entry.role}]: ${entry.message}`);
  });
}

// Get replica with type information
const verboseReplica = await client.getReplica('r123', true);
console.log('Replica type:', verboseReplica.replica_type); // 'user' or 'system'
```

### Updating with JSON Patch

```typescript
// Update persona using JSON Patch operations
await client.patchPersona('p5317866', [
  {
    op: 'replace',
    path: '/persona_name',
    value: 'Senior Support Agent',
  },
  {
    op: 'replace',
    path: '/layers/llm/temperature',
    value: 0.8,
  },
  {
    op: 'add',
    path: '/document_tags',
    value: ['advanced_support'],
  },
]);
```

---

## 🎬 Complete Example: End-to-End Flow

Here's a complete example showing how to set up everything:

```typescript
import { createTavusClient } from '@/lib';

async function setupConversation() {
  const client = createTavusClient();

  // 1. Upload knowledge base documents
  const document = await client.createDocument({
    document_url: 'https://example.com/product-docs.pdf',
    document_name: 'Product Documentation',
    tags: ['product', 'support'],
  });

  console.log('Document created:', document.uuid);

  // 2. Create a persona with the document
  const persona = await client.createPersona({
    persona_name: 'Product Expert',
    system_prompt: 'You are a product expert who helps customers.',
    document_tags: ['product', 'support'],
    layers: {
      llm: { model: 'tavus-gpt-4o' },
      tts: { tts_engine: 'cartesia' },
    },
  });

  console.log('Persona created:', persona.persona_id);

  // 3. Create objectives
  const objective = await client.createObjectives({
    data: [
      {
        objective_name: 'Understand Customer Need',
        objective_prompt: 'Identify the customer\'s main goal',
        confirmation_mode: 'automatic',
        output_variables: ['customer_goal'],
      },
    ],
  });

  console.log('Objective created:', objective.objectives_id);

  // 4. Create guardrails
  const guardrails = await client.createGuardrails({
    name: 'Professional Standards',
    data: [
      {
        guardrails_prompt: 'Always maintain professional tone',
      },
    ],
  });

  console.log('Guardrails created:', guardrails.guardrails_id);

  // 5. Create a conversation (assuming you have a replica)
  const conversation = await client.createConversation({
    replica_id: 'r783537ef5',
    persona_id: persona.persona_id,
    conversation_name: 'Product Demo',
    document_tags: ['product'],
    custom_greeting: 'Hi! I\'m here to help you with our product.',
  });

  console.log('Conversation URL:', conversation.conversation_url);

  return conversation;
}

// Run the setup
setupConversation()
  .then((conv) => console.log('Setup complete!', conv))
  .catch((err) => console.error('Setup failed:', err));
```

---

## 📖 Additional Resources

- **[Complete API Reference](./tavus-api-reference.md)** - Detailed documentation for all endpoints
- **[Quick Reference](./api-quick-reference.md)** - At-a-glance endpoint reference
- **[Usage Examples](./usage-examples.md)** - More code examples and patterns
- **[Type Definitions](../types/tavus.ts)** - Full TypeScript type reference
- **[Completion Summary](./COMPLETION_SUMMARY.md)** - What's been built

---

## 🐛 Troubleshooting

### "Invalid API key" error

Check that your `.env.local` file has the correct API key:
```bash
TAVUS_API_KEY=your_key_here
```

Restart your development server after changing environment variables.

### "Request timeout" error

Increase the timeout when creating the client:
```typescript
const client = createTavusClient({ timeout: 60000 });
```

### Type errors in imports

Make sure you're importing from the correct location:
```typescript
import { createTavusClient } from '@/lib';
import type { ConversationResponse } from '@/lib';
```

### Replica training taking too long

Use the callback URL to get notified when training completes:
```typescript
await client.createReplica({
  train_video_url: 'https://...',
  callback_url: 'https://youragency.com/api/webhooks/replica',
});
```

---

## 💡 Best Practices

1. **Use environment variables** for API keys - never hardcode them
2. **Implement error handling** for all API calls
3. **Use test_mode** during development to avoid costs
4. **Set callback URLs** for long-running operations
5. **Tag your documents** for easy organization and persona access
6. **Use verbose mode** when you need detailed analytics
7. **Clean up test resources** regularly (test conversations, old replicas)
8. **Monitor training progress** for replicas before using them
9. **Cache persona and replica IDs** to avoid repeated lookups
10. **Implement webhook handlers** for production deployments

---

## 🎉 Next Steps

Now that you're set up:

1. **Test the API** - Try creating a conversation
2. **Train a replica** - Upload a training video
3. **Create personas** - Build AI agents for different use cases
4. **Build your UI** - Create a white-label interface
5. **Deploy** - Take it to production

---

## 🆘 Support

Questions or issues? Check:
- [Tavus Documentation](https://docs.tavus.io)
- [API Reference](./tavus-api-reference.md)
- [Usage Examples](./usage-examples.md)

---

**Happy Building! 🚀**

