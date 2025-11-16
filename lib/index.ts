/**
 * Tavus API Wrapper - Main Export File
 * 
 * Import everything you need from this single entry point:
 * 
 * @example
 * ```typescript
 * import { TavusClient, createTavusClient } from '@/lib';
 * import type { CreateConversationRequest, PersonaDetails } from '@/lib';
 * ```
 */

// Export the main client class and factory function
export { TavusClient, createTavusClient } from './tavus-client';

// Re-export all types for convenience
export type {
  // Base types
  ConversationStatus,
  PersonaType,
  PipelineMode,
  DocumentRetrievalStrategy,
  JsonPatchOperation,
  ReplicaStatus,
  ReplicaType,
  PhoenixModel,
  DocumentStatus,
  DocumentSortDirection,
  VideoStatus,
  
  // Conversation types
  CreateConversationRequest,
  ConversationResponse,
  ConversationDetails,
  VerboseConversationDetails,
  ConversationTranscript,
  PerceptionAnalysis,
  ListConversationsRequest,
  ListConversationsResponse,
  
  // Persona types
  PersonaLayers,
  PerceptionLayer,
  STTLayer,
  ConversationalFlowLayer,
  LLMLayer,
  TTSLayer,
  CreatePersonaRequest,
  PersonaResponse,
  PersonaDetails,
  ListPersonasRequest,
  ListPersonasResponse,
  JsonPatchOperation as JsonPatchOp,
  PatchPersonaRequest,
  
  // Replica types
  CreateReplicaRequest,
  ReplicaResponse,
  ReplicaDetails,
  ListReplicasRequest,
  ListReplicasResponse,
  RenameReplicaRequest,
  
  // Objectives types
  ObjectiveData,
  CreateObjectivesRequest,
  ObjectiveResponse,
  ObjectiveDetails,
  ListObjectivesRequest,
  ListObjectivesResponse,
  
  // Guardrails types
  GuardrailData,
  CreateGuardrailsRequest,
  GuardrailsResponse,
  GuardrailsDetails,
  ListGuardrailsRequest,
  ListGuardrailsResponse,
  
  // Document types
  CreateDocumentRequest,
  DocumentResponse,
  DocumentDetails,
  ListDocumentsRequest,
  ListDocumentsResponse,
  UpdateDocumentRequest,
  
  // Video types
  GenerateVideoFromTextRequest,
  GenerateVideoFromAudioRequest,
  GenerateVideoRequest,
  VideoResponse,
  VideoDetails,
  ListVideosRequest,
  ListVideosResponse,
  RenameVideoRequest,
  
  // Config and error types
  TavusClientConfig,
  TavusApiError,
  ConversationWebhookPayload,
} from '@/types/tavus';

