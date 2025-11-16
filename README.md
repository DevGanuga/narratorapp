# ConvoAI Studio

**A proprietary conversational AI platform by [NR8R](https://narrator.studio)**

ConvoAI Studio is an award-winning creative agency's internal tool for creating real-time, human-like multimodal video conversations with AI replicas. Built to empower storytellers and creatives with cutting-edge AI conversation technology.

---

## About NR8R

**Narrator** is an artist-focused creative agency, production hub, and post campus partnering with storytellers to create visually compelling marketing materials and immersive campaigns that celebrate stories from all over the world.

### Our Mission
We are an award-winning creative agency working shoulder to shoulder with artists, filmmakers, and storytellers to celebrate and share their vision with the world.

### Our Values
As NR8Rs we are driven to continuously improve, innovate, and expand our capabilities in a rapidly evolving industry. We celebrate the unique perspective and contribution of every individual, taking proactive steps to cultivate creative environments that reflect the rich diversity of our community. We take ownership of our actions and decisions, with a commitment to deliver on our promises with transparency and integrity.

---

## Overview

ConvoAI Studio provides real-time, human-like multimodal video conversations with AI replicas. Each replica can see, hear, and respond like a human through an end-to-end conversational pipeline.

### Core Components

- **Persona** - Define the agent's behavior, tone, and knowledge
- **Replica** - Train a lifelike digital twin from a short 2-minute video
- **Conversation** - Create real-time video call sessions with AI replicas

## Getting Started

### Prerequisites

- Node.js 18+ 
- Tavus API Key ([Get one here](https://tavus.io))

### Installation

```bash
npm install
```

### Configuration

1. Copy the example environment file:
```bash
cp .env.example .env.local
```

2. Add your Tavus API key to `.env.local`:
```
TAVUS_API_KEY=your_actual_api_key_here
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
/
├── app/                    # Next.js app directory
├── docs/                   # API documentation reference
│   └── tavus-api-reference.md
├── types/                  # TypeScript type definitions
│   └── tavus.ts           # Tavus API types
├── lib/                    # Utility functions and API clients (to be created)
└── components/            # React components (to be created)
```

## Documentation

- [Tavus API Reference](./docs/tavus-api-reference.md) - Complete API documentation
- [Type Definitions](./types/tavus.ts) - TypeScript types for Tavus API

## API Endpoints Covered

### Conversations
- ✅ Create Conversation
- ✅ Get Conversation (with verbose mode)
- ✅ List Conversations
- ✅ End Conversation
- ✅ Delete Conversation

### Personas
- ✅ Create Persona
- ✅ Get Persona
- ✅ List Personas
- ✅ Patch Persona (JSON Patch)
- ✅ Delete Persona

### Replicas
- ✅ Create Replica (phoenix-3, phoenix-2)
- ✅ Get Replica (with verbose mode)
- ✅ List Replicas
- ✅ Delete Replica (with hard delete option)
- ✅ Rename Replica

### Objectives
- ✅ Create Objectives
- ✅ Get Objective
- ✅ List Objectives
- ✅ Patch Objective (JSON Patch)
- ✅ Delete Objective

### Guardrails
- ✅ Create Guardrails
- ✅ Get Guardrails
- ✅ List Guardrails
- ✅ Patch Guardrails (JSON Patch)
- ✅ Delete Guardrails

### Knowledge Base (Documents)
- ✅ Create Document
- ✅ Get Document
- ✅ List Documents (with filtering)
- ✅ Update Document
- ✅ Delete Document

### Video Generation
- ✅ Generate Video (text or audio)
- ✅ Get Video (with verbose mode)
- ✅ List Videos
- ✅ Delete Video (with hard delete option)
- ✅ Rename Video

## Roadmap

- [x] Complete API documentation capture
- [x] TypeScript type definitions for all endpoints
- [x] Core API client wrapper (all endpoints)
- [ ] Server actions for Next.js integration
- [ ] Webhook handling system
- [ ] Admin dashboard for managing personas and replicas
- [ ] Embeddable conversation widget
- [ ] Real-time conversation monitoring
- [ ] Analytics and reporting dashboard
- [ ] White-label branding system
- [ ] Client-facing portal for conversation management

## License

**Proprietary & Confidential**  
© 2025 NR8R (Narrator Studio). All rights reserved.

This software is proprietary to NR8R and is intended for internal use only. Unauthorized copying, distribution, modification, or use of this software is strictly prohibited.

## Team & Support

For questions, issues, or feature requests, contact the NR8R development team.

---

**Built with ❤️ by the NR8R team**
