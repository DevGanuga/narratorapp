/**
 * Tavus API TypeScript Type Definitions
 * Generated from API documentation v2
 */

// ============================================================================
// Base Types
// ============================================================================

export type ConversationStatus = 'active' | 'ended';
export type PersonaType = 'user' | 'system';
export type PipelineMode = 'full' | 'echo';
export type DocumentRetrievalStrategy = 'speed' | 'quality' | 'balanced';
export type JsonPatchOp = 'add' | 'remove' | 'replace' | 'copy' | 'move' | 'test';

// ============================================================================
// Conversation Types
// ============================================================================

export interface CreateConversationRequest {
  replica_id: string;
  persona_id: string;
  audio_only?: boolean;
  callback_url?: string;
  conversation_name?: string;
  conversational_context?: string;
  custom_greeting?: string;
  memory_stores?: string[];
  document_ids?: string[];
  document_retrieval_strategy?: DocumentRetrievalStrategy;
  document_tags?: string[];
  test_mode?: boolean;
  properties?: Record<string, any>;
}

export interface ConversationResponse {
  conversation_id: string;
  conversation_name: string;
  status: ConversationStatus;
  conversation_url: string;
  replica_id: string;
  persona_id: string;
  created_at: string;
}

export interface ConversationDetails extends ConversationResponse {
  callback_url?: string;
  updated_at: string;
}

export interface VerboseConversationDetails extends ConversationDetails {
  shutdown_reason?: string;
  transcript?: ConversationTranscript[];
  'system.replica_joined'?: string;
  'system.shutdown'?: {
    timestamp: string;
    reason: string;
  };
  'application.perception_analysis'?: PerceptionAnalysis;
}

export interface ConversationTranscript {
  role: 'user' | 'assistant' | 'system';
  message: string;
  timestamp: string;
}

export interface PerceptionAnalysis {
  appearance?: string;
  behavior?: string;
  emotional_states?: string[];
  screen_activities?: string[];
}

export interface ListConversationsRequest {
  limit?: number;
  page?: number;
  status?: ConversationStatus;
}

export interface ListConversationsResponse {
  data: ConversationDetails[];
  total_count: number;
}

// ============================================================================
// Persona Types
// ============================================================================

export interface PersonaLayers {
  perception?: PerceptionLayer;
  stt?: STTLayer;
  conversational_flow?: ConversationalFlowLayer;
  llm?: LLMLayer;
  tts?: TTSLayer;
}

export interface PerceptionLayer {
  perception_tool_prompt?: string;
  [key: string]: any;
}

export interface STTLayer {
  hotwords?: string[];
  [key: string]: any;
}

export interface ConversationalFlowLayer {
  [key: string]: any;
}

export interface LLMLayer {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  [key: string]: any;
}

export interface TTSLayer {
  tts_engine?: string;
  tts_emotion_control?: boolean;
  voice?: string;
  [key: string]: any;
}

export interface CreatePersonaRequest {
  persona_name: string;
  system_prompt?: string; // Required for 'full' pipeline mode
  pipeline_mode?: PipelineMode;
  context?: string;
  default_replica_id?: string;
  document_ids?: string[];
  document_tags?: string[];
  layers?: PersonaLayers;
}

export interface PersonaResponse {
  persona_id: string;
  persona_name: string;
  created_at: string;
}

export interface PersonaDetails extends PersonaResponse {
  system_prompt?: string;
  pipeline_mode?: PipelineMode;
  context?: string;
  default_replica_id?: string;
  document_ids?: string[];
  document_tags?: string[];
  layers?: PersonaLayers;
  updated_at?: string;
}

export interface ListPersonasRequest {
  limit?: number;
  page?: number;
  persona_type?: PersonaType;
}

export interface ListPersonasResponse {
  data: PersonaDetails[];
  total_count: number;
}

export interface JsonPatchOperation {
  op: JsonPatchOp;
  path: string;
  value?: any; // Not required for 'remove' operation
  from?: string; // Required for 'copy' and 'move' operations
}

export type PatchPersonaRequest = JsonPatchOperation[];

// ============================================================================
// Replica Types
// ============================================================================

export type ReplicaStatus = 'started' | 'completed' | 'error';
export type ReplicaType = 'user' | 'system';
export type PhoenixModel = 'phoenix-3' | 'phoenix-2';

export interface CreateReplicaRequest {
  train_video_url: string;
  consent_video_url?: string;
  callback_url?: string;
  replica_name?: string;
  model_name?: PhoenixModel;
  properties?: Record<string, any>;
}

export interface ReplicaResponse {
  replica_id: string;
  status: ReplicaStatus;
}

export interface ReplicaDetails extends ReplicaResponse {
  replica_name?: string;
  thumbnail_video_url?: string;
  training_progress?: string; // e.g., "100/100"
  created_at?: string;
  updated_at?: string;
  error_message?: string | null;
  replica_type?: ReplicaType; // Only included in verbose mode
}

export interface ListReplicasRequest {
  limit?: number;
  page?: number;
  verbose?: boolean;
  replica_type?: ReplicaType;
  replica_ids?: string; // Comma-separated list
}

export interface ListReplicasResponse {
  data: ReplicaDetails[];
  total_count: number;
}

export interface RenameReplicaRequest {
  replica_name: string;
}

// ============================================================================
// Objectives Types
// ============================================================================

export interface ObjectiveData {
  objective_name: string;
  objective_prompt: string;
  confirmation_mode?: string;
  output_variables?: string[];
  modality?: string;
  callback_url?: string;
}

export interface CreateObjectivesRequest {
  data: ObjectiveData[];
}

export interface ObjectiveResponse {
  objectives_id: string;
  objective_name: string;
  status: string;
  created_at: string;
}

export interface ObjectiveDetails {
  data: ObjectiveData & {
    objectives_id?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface ListObjectivesRequest {
  limit?: number;
  page?: number;
}

export interface ListObjectivesResponse {
  data: ObjectiveDetails[];
  total_count: number;
}

// ============================================================================
// Guardrails Types
// ============================================================================

export interface GuardrailData {
  guardrails_prompt: string;
  callback_url?: string;
}

export interface CreateGuardrailsRequest {
  name: string;
  data: GuardrailData[];
}

export interface GuardrailsResponse {
  guardrails_id: string;
  guardrails_name: string;
  status: string;
  created_at: string;
}

export interface GuardrailsDetails {
  data: GuardrailData & {
    guardrails_id?: string;
    guardrails_name?: string;
    created_at?: string;
    updated_at?: string;
  };
}

export interface ListGuardrailsRequest {
  limit?: number;
  page?: number;
}

export interface ListGuardrailsResponse {
  data: GuardrailsDetails[];
  total_count: number;
}

// ============================================================================
// Document Types
// ============================================================================

export type DocumentStatus = 'processing' | 'ready' | 'error';
export type DocumentSortDirection = 'ascending' | 'descending';

export interface CreateDocumentRequest {
  document_url: string;
  document_name?: string;
  callback_url?: string;
  properties?: Record<string, any>;
  tags?: string[];
}

export interface DocumentResponse {
  uuid: string;
  document_name: string;
  document_url: string;
  status: DocumentStatus;
  created_at: string;
  updated_at: string;
  callback_url?: string;
  tags?: string[];
  properties?: Record<string, any>;
}

export type DocumentDetails = DocumentResponse;

export interface ListDocumentsRequest {
  limit?: number;
  page?: number; // 0-based
  sort?: DocumentSortDirection;
  status?: DocumentStatus;
  name_or_uuid?: string;
  tags?: string; // Comma-separated list
}

export interface ListDocumentsResponse {
  data: DocumentDetails[];
  total_count: number;
  page: number;
  limit: number;
}

export interface UpdateDocumentRequest {
  document_name?: string;
  tags?: string[]; // Overwrites existing tags
}

// ============================================================================
// Video Generation Types
// ============================================================================

export type VideoStatus = 'queued' | 'generating' | 'ready' | 'deleted' | 'error';

export interface GenerateVideoFromTextRequest {
  replica_id: string;
  script: string;
  video_name?: string;
  background_url?: string;
  background_source_url?: string;
  callback_url?: string;
  fast?: boolean;
  transparent_background?: boolean;
  watermark_image_url?: string;
  properties?: Record<string, any>;
}

export interface GenerateVideoFromAudioRequest {
  replica_id: string;
  audio_url: string; // .wav or .mp3
  video_name?: string;
  background_url?: string;
  background_source_url?: string;
  callback_url?: string;
  fast?: boolean;
  transparent_background?: boolean;
  watermark_image_url?: string;
  properties?: Record<string, any>;
}

export type GenerateVideoRequest = 
  | GenerateVideoFromTextRequest 
  | GenerateVideoFromAudioRequest;

export interface VideoResponse {
  video_id: string;
  video_name: string;
  status: VideoStatus;
  hosted_url: string;
  created_at: string;
}

export interface VideoDetails extends VideoResponse {
  data?: Record<string, any>;
  download_url?: string;
  stream_url?: string;
  status_details?: string;
  updated_at?: string;
  still_image_thumbnail_url?: string; // Only in verbose mode
  gif_thumbnail_url?: string; // Only in verbose mode
}

export interface ListVideosRequest {
  limit?: number;
  page?: number;
}

export interface ListVideosResponse {
  data: VideoDetails[];
  total_count: number;
}

export interface RenameVideoRequest {
  video_name: string;
}

// ============================================================================
// API Error Types
// ============================================================================

export interface TavusApiError {
  error: string;
  message: string;
  status_code: number;
}

// ============================================================================
// Webhook Types
// ============================================================================

export interface ConversationWebhookPayload {
  conversation_id: string;
  status?: ConversationStatus;
  event_type:
    | 'conversation.started'
    | 'conversation.ended'
    | 'conversation.updated'
    | 'system.replica_joined'
    | 'system.shutdown'
    | 'application.transcription_ready'
    | 'application.perception_analysis';
  timestamp: string;
  data?: any;
}

// ============================================================================
// Client Configuration
// ============================================================================

export interface TavusClientConfig {
  apiKey: string;
  baseUrl?: string; // Default: 'https://tavusapi.com'
  timeout?: number; // Request timeout in milliseconds
}

