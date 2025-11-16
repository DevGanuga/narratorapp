# Narrator App - Tavus API White-Label Wrapper

A white-label solution for integrating Tavus Conversational Video Interface (CVI) API into your agency's offerings.

## Overview

This project wraps the Tavus API to provide real-time, human-like multimodal video conversations with AI replicas. Each replica can see, hear, and respond like a human through an end-to-end conversational pipeline.

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

Proprietary - For agency use only

## Support

For questions or issues, contact your development team.
