# Tavus API Quick Reference

A concise reference guide for all Tavus API endpoints.

## Base URL
```
https://tavusapi.com
```

## Authentication
```
x-api-key: <your-api-key>
```

---

## 📹 Conversations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v2/conversations` | Create a new conversation |
| GET | `/v2/conversations/{id}` | Get conversation details (add `?verbose=true` for full data) |
| GET | `/v2/conversations` | List all conversations |
| POST | `/v2/conversations/{id}/end` | End an active conversation |
| DELETE | `/v2/conversations/{id}` | Delete a conversation |

---

## 🎭 Personas

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v2/personas` | Create a new persona |
| GET | `/v2/personas/{id}` | Get persona details |
| GET | `/v2/personas` | List all personas |
| PATCH | `/v2/personas/{id}` | Update persona (JSON Patch) |
| DELETE | `/v2/personas/{id}` | Delete a persona |

---

## 👤 Replicas

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v2/replicas` | Create a new replica |
| GET | `/v2/replicas/{id}` | Get replica details (add `?verbose=true` for type) |
| GET | `/v2/replicas` | List all replicas |
| DELETE | `/v2/replicas/{id}` | Delete a replica (add `?hard=true` for permanent) |
| PATCH | `/v2/replicas/{id}/name` | Rename a replica |

---

## 🎯 Objectives

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v2/objectives` | Create objectives |
| GET | `/v2/objectives/{id}` | Get objective details |
| GET | `/v2/objectives` | List all objectives |
| PATCH | `/v2/objectives/{id}` | Update objective (JSON Patch) |
| DELETE | `/v2/objectives/{id}` | Delete an objective |

---

## 🛡️ Guardrails

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v2/guardrails` | Create guardrails |
| GET | `/v2/guardrails/{id}` | Get guardrails details |
| GET | `/v2/guardrails` | List all guardrails |
| PATCH | `/v2/guardrails/{id}` | Update guardrails (JSON Patch) |
| DELETE | `/v2/guardrails/{id}` | Delete guardrails |

---

## 📚 Documents (Knowledge Base)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v2/documents` | Upload a document |
| GET | `/v2/documents/{id}` | Get document details |
| GET | `/v2/documents` | List all documents |
| PATCH | `/v2/documents/{id}` | Update document metadata |
| DELETE | `/v2/documents/{id}` | Delete a document |

---

## 🎬 Video Generation

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/v2/videos` | Generate a video |
| GET | `/v2/videos/{id}` | Get video details (add `?verbose=true` for thumbnails) |
| GET | `/v2/videos` | List all videos |
| DELETE | `/v2/videos/{id}` | Delete a video (add `?hard=true` for permanent) |
| PATCH | `/v2/videos/{id}/name` | Rename a video |

---

## 📊 Common Response Codes

| Code | Status | Description |
|------|--------|-------------|
| 200 | OK | Request successful |
| 201 | Created | Resource created successfully |
| 204 | No Content | Request successful, no content to return |
| 400 | Bad Request | Invalid request parameters |
| 401 | Unauthorized | Invalid or missing API key |
| 404 | Not Found | Resource not found |
| 408 | Timeout | Request timed out |
| 500 | Internal Server Error | Server error |

---

## 🔧 Common Query Parameters

| Parameter | Endpoints | Description |
|-----------|-----------|-------------|
| `verbose=true` | GET conversations, replicas, videos | Include additional data |
| `limit={n}` | All list endpoints | Number of items per page |
| `page={n}` | All list endpoints | Page number |
| `hard=true` | DELETE replicas, videos | Permanent deletion (⚠️ irreversible) |

---

## 📝 JSON Patch Operations

Used for PATCH endpoints (personas, objectives, guardrails):

| Operation | Description | Value Required |
|-----------|-------------|----------------|
| `add` | Add a new field | Yes |
| `remove` | Remove a field | No |
| `replace` | Replace field value | Yes |
| `copy` | Copy value from another location | Yes (from path) |
| `move` | Move value to new location | Yes (from path) |
| `test` | Test if value matches | Yes |

**Example**:
```json
[
  { "op": "replace", "path": "/persona_name", "value": "New Name" },
  { "op": "remove", "path": "/context" }
]
```

---

## 🎯 Quick Start Examples

### Create a Conversation
```bash
curl -X POST https://tavusapi.com/v2/conversations \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "replica_id": "r123",
    "persona_id": "p456",
    "conversation_name": "Demo Call"
  }'
```

### Create a Replica
```bash
curl -X POST https://tavusapi.com/v2/replicas \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "train_video_url": "https://your-bucket.s3.amazonaws.com/video.mp4",
    "replica_name": "My Replica"
  }'
```

### Generate a Video
```bash
curl -X POST https://tavusapi.com/v2/videos \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "replica_id": "r123",
    "script": "Hello from Tavus!"
  }'
```

### Upload a Document
```bash
curl -X POST https://tavusapi.com/v2/documents \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "document_url": "https://example.com/doc.pdf",
    "document_name": "Product Guide",
    "tags": ["product", "documentation"]
  }'
```

---

## 🔗 Related Resources

- [Complete API Reference](./tavus-api-reference.md) - Detailed documentation
- [Usage Examples](./usage-examples.md) - Code examples and best practices
- [Type Definitions](../types/tavus.ts) - TypeScript types
- [API Client](../lib/tavus-client.ts) - Ready-to-use client wrapper

---

## 💡 Tips

1. **Use test_mode** when creating conversations for testing (no cost, no concurrency impact)
2. **Enable verbose mode** when you need detailed data (transcripts, analytics, etc.)
3. **Use hard delete** carefully - it's irreversible
4. **Tag documents** for easy filtering and persona access
5. **Set callback URLs** for long-running operations (replica training, video generation)
6. **Use memory stores** for personalized conversations across sessions

---

**Last Updated**: 2025-11-16  
**API Version**: v2

