# Tavus API Reference Documentation

## Overview

Tavus APIs allow you to create a Conversational Video Interface (CVI), an end-to-end pipeline for building real-time video conversations with an AI replica. Each replica is integrated with a persona that enables it to see, hear, and respond like a human.

### Core Components

1. **Persona** - Define the agent's behavior, tone, and knowledge
2. **Replica** - Train a lifelike digital twin from a short 2-minute video
3. **Conversation** - Create a real-time video call session with your AI replica

---

## Authentication

### API Key Setup

1. Go to the Developer Portal and select API Key from the sidebar menu
2. Click Create New Key to begin generating your API key
3. Enter a name for the key and (optional) specify allowed IP addresses
4. Copy your newly created API key and store it securely

**⚠️ Security Warning**: Never expose your API key in client-side code. Always load from environment variables or server-side configuration.

### Authentication Header

```
'x-api-key: <api-key>'
```

---

## Conversations API

### Create Conversation

**Endpoint**: `POST /v2/conversations`

Creates a real-time video conversation with your AI replica.

**Required Headers**:
- `x-api-key`: Your API key
- `Content-Type`: application/json

**Request Body Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `replica_id` | string | Yes* | The unique identifier for the replica |
| `persona_id` | string | Yes | The unique identifier for the persona |
| `audio_only` | boolean | No | Specifies if interaction should be voice-only |
| `callback_url` | string | No | URL to receive webhooks with conversation updates |
| `conversation_name` | string | No | A name for the conversation |
| `conversational_context` | string | No | Optional context appended to persona context |
| `custom_greeting` | string | No | Custom greeting the replica will give |
| `memory_stores` | string[] | No | Memory stores to use for the conversation |
| `document_ids` | string[] | No | IDs of documents persona can access |
| `document_retrieval_strategy` | string | No | Strategy for document retrieval: speed, quality, balanced (default: balanced) |
| `document_tags` | string[] | No | Tags of documents replica can access |
| `test_mode` | boolean | No | If true, creates conversation without replica joining (for testing) |
| `properties` | object | No | Optional properties to customize the conversation |

*Note: Required unless persona already has a valid replica_id

**Response** (200):

```json
{
  "conversation_id": "c123456",
  "conversation_name": "A Meeting with Hassaan",
  "status": "active",
  "conversation_url": "https://tavus.daily.co/c123456",
  "replica_id": "r79e1c033f",
  "persona_id": "p5317866",
  "created_at": "..."
}
```

---

### Get Conversation

**Endpoint**: `GET /v2/conversations/{conversation_id}`

Returns a single conversation by its unique identifier.

**Query Parameters**:
- `verbose=true` - Optional, returns additional event data including:
  - `shutdown_reason`: Why the conversation ended
  - `transcript`: Complete transcript with role-based messages
  - `system.replica_joined`: When replica joined
  - `system.shutdown`: When and why conversation ended
  - `application.perception_analysis`: Final visual analysis of the user

**Response** (200):

```json
{
  "conversation_id": "c123456",
  "conversation_name": "A Meeting with Hassaan",
  "conversation_url": "https://tavus.daily.co/c123456",
  "callback_url": "https://yourwebsite.com/webhook",
  "status": "active",
  "replica_id": "r79e1c033f",
  "persona_id": "p5317866",
  "created_at": "...",
  "updated_at": "..."
}
```

---

### List Conversations

**Endpoint**: `GET /v2/conversations`

Returns a list of all conversations created by the account.

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of conversations per page (default: 10) |
| `page` | integer | Page number to return (default: 1) |
| `status` | string | Filter by status: active, ended |

**Response** (200):

```json
{
  "data": [...],
  "total_count": 100
}
```

---

### End Conversation

**Endpoint**: `POST /v2/conversations/{conversation_id}/end`

Ends a single conversation by its unique identifier.

**Response**: 200 OK

---

### Delete Conversation

**Endpoint**: `DELETE /v2/conversations/{conversation_id}`

Deletes a single conversation by its unique identifier.

**Response**: 204 NO CONTENT

---

## Personas API

### Create Persona

**Endpoint**: `POST /v2/personas`

Creates and customizes a digital replica's behavior and capabilities.

**Request Body Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `persona_name` | string | Yes | A name for the persona |
| `system_prompt` | string | Yes* | System prompt for the LLM |
| `pipeline_mode` | enum | No | Pipeline mode: full (default), echo |
| `context` | string | No | Context for the LLM |
| `default_replica_id` | string | No | Default replica ID for this persona |
| `document_ids` | string[] | No | Document IDs persona has access to |
| `document_tags` | string[] | No | Document tags persona has access to |
| `layers` | object | No | Configuration for persona layers (Perception, STT, LLM, TTS, etc.) |

*Required when using full pipeline mode

**Pipeline Modes**:
- `full`: Default end-to-end experience
- `echo`: Turns off most steps, allows replica to sync video with audio passed through Echo events

**Layers Configuration**:
- **Perception**: Multimodal vision and understanding settings (Raven)
- **STT**: Transcription and turn taking settings (Sparrow)
- **Conversational Flow**: Turn-taking, interruption handling, active listening
- **LLM**: Language model settings
- **TTS**: Text-to-Speech settings

**Response** (200):

```json
{
  "persona_id": "p5317866",
  "persona_name": "Life Coach",
  "created_at": "..."
}
```

---

### Get Persona

**Endpoint**: `GET /v2/personas/{persona_id}`

Returns a single persona by its unique identifier.

**Response** (200):

```json
{
  "data": [...]
}
```

---

### List Personas

**Endpoint**: `GET /v2/personas`

Returns a list of all personas created by the account.

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of personas per page (default: 10) |
| `page` | integer | Page number to return (default: 1) |
| `persona_type` | enum | Filter by type: user, system |

**Response** (200):

```json
{
  "data": [...],
  "total_count": 50
}
```

---

### Patch Persona

**Endpoint**: `PATCH /v2/personas/{persona_id}`

Updates a persona using JSON Patch payload (RFC 6902).

**Supported Operations**: add, remove, replace, copy, move, test

**Request Body** (array of operations):

```json
[
  { "op": "replace", "path": "/persona_name", "value": "Wellness Advisor" },
  { "op": "replace", "path": "/default_replica_id", "value": "r79e1c033f" },
  { "op": "replace", "path": "/context", "value": "New context..." },
  { "op": "replace", "path": "/layers/llm/model", "value": "tavus-gpt-4o" },
  { "op": "replace", "path": "/layers/tts/tts_engine", "value": "cartesia" },
  { "op": "add", "path": "/layers/tts/tts_emotion_control", "value": "true" },
  { "op": "remove", "path": "/layers/stt/hotwords" }
]
```

**Notes**:
- Path must match the current persona schema
- `remove` operation doesn't require a value parameter

**Response**: 200 OK

---

### Delete Persona

**Endpoint**: `DELETE /v2/personas/{persona_id}`

Deletes a single persona by its unique identifier.

**Response**: 204 NO CONTENT

---

## Base URL

All API requests should be made to:
```
https://tavusapi.com
```

---

## Status Codes

- `200 OK` - Request successful
- `204 NO CONTENT` - Request successful, no content to return
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Invalid or missing API key
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Notes

- All timestamps follow ISO 8601 format
- The `conversation_url` can be used to join the conversation directly or embedded in a website
- Callback URLs will receive webhooks with conversation status updates
- Test mode conversations don't count against concurrency limits

---

## Replicas API

### Create Replica

**Endpoint**: `POST /v2/replicas`

Creates a new replica using the latest phoenix-3 model for use in real-time conversations.

**Important**: Follow the Replica Training guide to ensure high-quality replica creation.

**Request Body Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `train_video_url` | string | Yes | Direct link to publicly accessible training video (e.g., S3 bucket) |
| `consent_video_url` | string | No | Direct link to consent statement video (required for personal replicas) |
| `callback_url` | string | No | URL to receive callbacks on training completion or error |
| `replica_name` | string | No | A name for the replica |
| `model_name` | string | No | Phoenix model version (default: phoenix-3, can use phoenix-2) |
| `properties` | object | No | Optional properties |

**Response** (200):

```json
{
  "replica_id": "r783537ef5",
  "status": "started"
}
```

**Status Values**: started, completed, error

---

### Get Replica

**Endpoint**: `GET /v2/replicas/{replica_id}`

Returns a single replica by its unique identifier, including training progress.

**Query Parameters**:
- `verbose=true` - Optional, includes additional data such as replica_type

**Response** (200):

```json
{
  "replica_id": "r783537ef5",
  "replica_name": "My Replica",
  "thumbnail_video_url": "https://...",
  "training_progress": "100/100",
  "status": "completed",
  "created_at": "2024-01-24T07:14:03.327Z",
  "updated_at": "2024-01-24T07:14:03.327Z",
  "error_message": null,
  "replica_type": "user"
}
```

**Replica Types** (verbose mode):
- `user`: User-created replicas
- `system`: Stock Tavus replicas available to all users

---

### List Replicas

**Endpoint**: `GET /v2/replicas`

Returns a list of all replicas created by the account.

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of replicas per page |
| `page` | integer | Page number to return |
| `verbose` | boolean | Include additional replica data |
| `replica_type` | enum | Filter by type: user, system |
| `replica_ids` | string | Comma-separated list of replica IDs to filter by |

**Response** (200):

```json
{
  "data": [...],
  "total_count": 42
}
```

---

### Delete Replica

**Endpoint**: `DELETE /v2/replicas/{replica_id}`

Deletes a replica by its unique ID. Deleted replicas cannot be used in conversations.

**Query Parameters**:
- `hard=true` - **CAUTION**: Irrevocably deletes replica and associated assets including training footage

**Response**: 204 NO CONTENT

---

### Rename Replica

**Endpoint**: `PATCH /v2/replicas/{replica_id}/name`

Renames a single replica by its unique identifier.

**Request Body**:

```json
{
  "replica_name": "Rio"
}
```

**Response**: 200 OK

---

## Objectives API

Objectives provide goal-oriented instructions that help guide conversations toward specific achievements and desired outcomes.

### Create Objectives

**Endpoint**: `POST /v2/objectives`

Creates a new objective for a persona.

**Request Body**:

```json
{
  "data": [
    {
      "objective_name": "New Objectives",
      "objective_prompt": "Guide the conversation towards...",
      "confirmation_mode": "automatic",
      "output_variables": ["variable1"],
      "modality": "conversational",
      "callback_url": "https://yourwebsite.com/webhook"
    }
  ]
}
```

**Response** (200):

```json
{
  "objectives_id": "o12345",
  "objective_name": "New Objectives",
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### Get Objective

**Endpoint**: `GET /v2/objectives/{objectives_id}`

Returns a single objective by its unique identifier.

---

### List Objectives

**Endpoint**: `GET /v2/objectives`

Returns a list of all objectives.

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of objectives per page (default: 10) |
| `page` | integer | Page number to return (default: 1) |

**Response** (200):

```json
{
  "data": [...],
  "total_count": 25
}
```

---

### Patch Objective

**Endpoint**: `PATCH /v2/objectives/{objectives_id}`

Updates specific fields of an objective using JSON Patch operations.

**Example Request**:

```json
[
  { "op": "replace", "path": "/data/0/objective_name", "value": "updated_objective_name" },
  { "op": "replace", "path": "/data/0/objective_prompt", "value": "Updated prompt" },
  { "op": "replace", "path": "/data/0/confirmation_mode", "value": "manual" },
  { "op": "add", "path": "/data/0/output_variables", "value": ["new_variable"] },
  { "op": "remove", "path": "/data/0/callback_url" }
]
```

**Response**: 200 OK

---

### Delete Objective

**Endpoint**: `DELETE /v2/objectives/{objectives_id}`

Deletes a single objective by its unique identifier.

**Response**: 204 NO CONTENT

---

## Guardrails API

Guardrails provide strict behavioral boundaries and guidelines that will be rigorously followed throughout conversations.

### Create Guardrails

**Endpoint**: `POST /v2/guardrails`

Creates a new set of guardrails for a persona.

**Request Body**:

```json
{
  "name": "Healthcare Compliance Guardrails",
  "data": [
    {
      "guardrails_prompt": "Never provide medical advice",
      "callback_url": "https://yourwebsite.com/webhook"
    }
  ]
}
```

**Response** (200):

```json
{
  "guardrails_id": "g12345",
  "guardrails_name": "Healthcare Compliance Guardrails",
  "status": "active",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

### Get Guardrails

**Endpoint**: `GET /v2/guardrails/{guardrails_id}`

Returns a single set of guardrails by its unique identifier.

---

### List Guardrails

**Endpoint**: `GET /v2/guardrails`

Returns a list of all sets of guardrails.

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of guardrails per page (default: 10) |
| `page` | integer | Page number to return (default: 1) |

**Response** (200):

```json
{
  "data": [...],
  "total_count": 15
}
```

---

### Patch Guardrails

**Endpoint**: `PATCH /v2/guardrails/{guardrails_id}`

Updates specific fields of guardrails using JSON Patch operations.

**Example Request**:

```json
[
  { "op": "replace", "path": "/data/0/guardrails_prompt", "value": "Your updated prompt" },
  { "op": "add", "path": "/data/0/callback_url", "value": "https://your-server.com/webhook" }
]
```

**Response**: 200 OK

---

### Delete Guardrails

**Endpoint**: `DELETE /v2/guardrails/{guardrails_id}`

Deletes a single set of guardrails by its unique identifier.

**Response**: 204 NO CONTENT

---

## Knowledge Base (Documents) API

Upload documents to your knowledge base for personas to reference during conversations.

**Supported Formats**: .pdf, .txt, .docx, .doc, .png, .jpg, .pptx, .csv, .xlsx, website URLs
**File Size Limit**: 50MB
**Language Support**: Currently English only

### Create Document

**Endpoint**: `POST /v2/documents`

Upload a new document to the knowledge base.

**Request Body Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `document_url` | string | Yes | URL of the document to be processed |
| `document_name` | string | No | Optional name (auto-generated if not provided) |
| `callback_url` | string | No | URL for processing status updates |
| `properties` | object | No | Additional key-value properties |
| `tags` | string[] | No | Array of tags to categorize the document |

**Response** (200):

```json
{
  "uuid": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "document_name": "Important Document",
  "document_url": "https://example.com/document.pdf",
  "status": "processing",
  "created_at": "2024-01-01T12:00:00Z",
  "updated_at": "2024-01-01T12:00:00Z",
  "callback_url": "https://your-server.com/webhook",
  "tags": ["important", "meeting"],
  "properties": { "department": "sales" }
}
```

**Status Values**: processing, ready, error

---

### Get Document

**Endpoint**: `GET /v2/documents/{document_id}`

Retrieve a specific document by ID.

---

### List Documents

**Endpoint**: `GET /v2/documents`

Retrieve a list of documents with filtering and pagination.

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of documents per page (default: 10) |
| `page` | integer | Page number for pagination (0-based, default: 0) |
| `sort` | enum | Sort direction: ascending, descending |
| `status` | string | Filter by status |
| `name_or_uuid` | string | Search by name or UUID |
| `tags` | string | Comma-separated list of tags to filter by |

**Response** (200):

```json
{
  "data": [...],
  "total_count": 42,
  "page": 0,
  "limit": 10
}
```

---

### Update Document

**Endpoint**: `PATCH /v2/documents/{document_id}`

Update a document's metadata (name and tags).

**Request Body**:

```json
{
  "document_name": "Updated Document Name",
  "tags": ["important", "meeting", "updated"]
}
```

**Note**: Tags array will overwrite existing tags.

**Response**: 200 OK

---

### Delete Document

**Endpoint**: `DELETE /v2/documents/{document_id}`

Delete a document and its associated data.

**Response**: 204 NO CONTENT

---

## Video Generation API

Generate videos using replicas with scripts or audio files.

### Generate Video

**Endpoint**: `POST /v2/videos`

Generates a new video using a replica and either a script or audio file.

**Request Body Parameters**:

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `replica_id` | string | Yes | Unique identifier for the replica |
| `script` | string | Yes* | Text script for the replica to speak |
| `audio_url` | string | Yes* | URL to audio file (.wav or .mp3) - alternative to script |
| `video_name` | string | No | A name for the video |
| `background_url` | string | No | Website URL to use as background |
| `background_source_url` | string | No | Direct link to video file for background |
| `callback_url` | string | No | URL for completion/error callbacks |
| `fast` | boolean | No | Use fast rendering (disables some features) |
| `transparent_background` | boolean | No | Generate .webm with transparency (requires fast=true) |
| `watermark_image_url` | string | No | Direct link to watermark image (png/jpeg) |
| `properties` | object | No | Optional properties |

*Either `script` or `audio_url` is required

**Response** (200):

```json
{
  "video_id": "abcd123",
  "video_name": "Sample Video",
  "status": "queued",
  "hosted_url": "https://tavus.video/abcd123",
  "created_at": "Mon, 14 Jul 2025 09:14:24 GMT"
}
```

**Status Values**: queued, generating, ready, deleted, error

---

### Get Video

**Endpoint**: `GET /v2/videos/{video_id}`

Returns a single video by its unique identifier.

**Query Parameters**:
- `verbose=true` - Optional, includes thumbnail image and gif links

**Response** (200):

```json
{
  "video_id": "abcd123",
  "video_name": "Sample Video",
  "status": "ready",
  "data": { ... },
  "download_url": "https://...",
  "stream_url": "https://...",
  "hosted_url": "https://tavus.video/abcd123",
  "status_details": "...",
  "created_at": "...",
  "updated_at": "...",
  "still_image_thumbnail_url": "...",
  "gif_thumbnail_url": "..."
}
```

---

### List Videos

**Endpoint**: `GET /v2/videos`

Returns a list of all videos created by the account.

**Query Parameters**:

| Parameter | Type | Description |
|-----------|------|-------------|
| `limit` | integer | Number of videos per page (default: 10) |
| `page` | integer | Page number to return (default: 1) |

**Response** (200):

```json
{
  "data": [...],
  "total_count": 50
}
```

---

### Delete Video

**Endpoint**: `DELETE /v2/videos/{video_id}`

Deletes a single video by its unique identifier.

**Query Parameters**:
- `hard=true` - **CAUTION**: Irrevocably deletes video and associated assets (thumbnails)

**Response**: 204 NO CONTENT

---

### Rename Video

**Endpoint**: `PATCH /v2/videos/{video_id}/name`

Renames a single video by its unique identifier.

**Request Body**:

```json
{
  "video_name": "Sales"
}
```

**Response**: 200 OK

---

**Document Status**: Complete API documentation captured
**Last Updated**: 2025-11-16
**Includes**: Conversations, Personas, Replicas, Objectives, Guardrails, Documents, Video Generation

