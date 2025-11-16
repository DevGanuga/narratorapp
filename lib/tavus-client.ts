/**
 * Tavus API Client
 * A TypeScript wrapper for the Tavus Conversational Video Interface API
 */

import type {
  CreateConversationRequest,
  ConversationResponse,
  ConversationDetails,
  VerboseConversationDetails,
  ListConversationsRequest,
  ListConversationsResponse,
  CreatePersonaRequest,
  PersonaResponse,
  PersonaDetails,
  ListPersonasRequest,
  ListPersonasResponse,
  PatchPersonaRequest,
  CreateReplicaRequest,
  ReplicaResponse,
  ReplicaDetails,
  ListReplicasRequest,
  ListReplicasResponse,
  RenameReplicaRequest,
  CreateObjectivesRequest,
  ObjectiveResponse,
  ObjectiveDetails,
  ListObjectivesRequest,
  ListObjectivesResponse,
  CreateGuardrailsRequest,
  GuardrailsResponse,
  GuardrailsDetails,
  ListGuardrailsRequest,
  ListGuardrailsResponse,
  CreateDocumentRequest,
  DocumentResponse,
  DocumentDetails,
  ListDocumentsRequest,
  ListDocumentsResponse,
  UpdateDocumentRequest,
  GenerateVideoRequest,
  VideoResponse,
  VideoDetails,
  ListVideosRequest,
  ListVideosResponse,
  RenameVideoRequest,
  TavusClientConfig,
  TavusApiError,
} from '@/types/tavus';

export class TavusClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: TavusClientConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://tavusapi.com';
    this.timeout = config.timeout || 30000;
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'x-api-key': this.apiKey,
          'Content-Type': 'application/json',
          ...options.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          error: errorData.error || 'API Error',
          message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
          status_code: response.status,
        } as TavusApiError;
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw {
          error: 'Timeout',
          message: `Request timed out after ${this.timeout}ms`,
          status_code: 408,
        } as TavusApiError;
      }
      
      throw error;
    }
  }

  // ============================================================================
  // Conversation Methods
  // ============================================================================

  /**
   * Create a new conversation with an AI replica
   * @param data Conversation configuration
   * @returns Conversation details including URL to join
   */
  async createConversation(
    data: CreateConversationRequest
  ): Promise<ConversationResponse> {
    return this.request<ConversationResponse>('/v2/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get details of a specific conversation
   * @param conversationId The unique identifier of the conversation
   * @param verbose If true, includes additional event data (transcript, shutdown reason, etc.)
   * @returns Conversation details
   */
  async getConversation(
    conversationId: string,
    verbose: boolean = false
  ): Promise<ConversationDetails | VerboseConversationDetails> {
    const query = verbose ? '?verbose=true' : '';
    return this.request<ConversationDetails | VerboseConversationDetails>(
      `/v2/conversations/${conversationId}${query}`,
      { method: 'GET' }
    );
  }

  /**
   * List all conversations
   * @param params Optional filters for pagination and status
   * @returns List of conversations with total count
   */
  async listConversations(
    params?: ListConversationsRequest
  ): Promise<ListConversationsResponse> {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.page) query.append('page', params.page.toString());
    if (params?.status) query.append('status', params.status);

    const queryString = query.toString();
    const endpoint = `/v2/conversations${queryString ? `?${queryString}` : ''}`;

    return this.request<ListConversationsResponse>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * End an active conversation
   * @param conversationId The unique identifier of the conversation
   */
  async endConversation(conversationId: string): Promise<void> {
    await this.request(`/v2/conversations/${conversationId}/end`, {
      method: 'POST',
    });
  }

  /**
   * Delete a conversation
   * @param conversationId The unique identifier of the conversation
   */
  async deleteConversation(conversationId: string): Promise<void> {
    await this.request(`/v2/conversations/${conversationId}`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // Persona Methods
  // ============================================================================

  /**
   * Create a new persona
   * @param data Persona configuration
   * @returns Created persona details
   */
  async createPersona(data: CreatePersonaRequest): Promise<PersonaResponse> {
    return this.request<PersonaResponse>('/v2/personas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get details of a specific persona
   * @param personaId The unique identifier of the persona
   * @returns Persona details
   */
  async getPersona(personaId: string): Promise<PersonaDetails> {
    return this.request<PersonaDetails>(`/v2/personas/${personaId}`, {
      method: 'GET',
    });
  }

  /**
   * List all personas
   * @param params Optional filters for pagination and type
   * @returns List of personas with total count
   */
  async listPersonas(
    params?: ListPersonasRequest
  ): Promise<ListPersonasResponse> {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.page) query.append('page', params.page.toString());
    if (params?.persona_type) query.append('persona_type', params.persona_type);

    const queryString = query.toString();
    const endpoint = `/v2/personas${queryString ? `?${queryString}` : ''}`;

    return this.request<ListPersonasResponse>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * Update a persona using JSON Patch operations
   * @param personaId The unique identifier of the persona
   * @param operations Array of JSON Patch operations
   */
  async patchPersona(
    personaId: string,
    operations: PatchPersonaRequest
  ): Promise<void> {
    await this.request(`/v2/personas/${personaId}`, {
      method: 'PATCH',
      body: JSON.stringify(operations),
    });
  }

  /**
   * Delete a persona
   * @param personaId The unique identifier of the persona
   */
  async deletePersona(personaId: string): Promise<void> {
    await this.request(`/v2/personas/${personaId}`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // Replica Methods
  // ============================================================================

  /**
   * Create a new replica using the phoenix-3 model (or phoenix-2)
   * @param data Replica training configuration
   * @returns Replica ID and initial status
   */
  async createReplica(data: CreateReplicaRequest): Promise<ReplicaResponse> {
    return this.request<ReplicaResponse>('/v2/replicas', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get details of a specific replica
   * @param replicaId The unique identifier of the replica
   * @param verbose If true, includes additional data like replica_type
   * @returns Replica details including training progress
   */
  async getReplica(
    replicaId: string,
    verbose: boolean = false
  ): Promise<ReplicaDetails> {
    const query = verbose ? '?verbose=true' : '';
    return this.request<ReplicaDetails>(
      `/v2/replicas/${replicaId}${query}`,
      { method: 'GET' }
    );
  }

  /**
   * List all replicas
   * @param params Optional filters for pagination and type
   * @returns List of replicas with total count
   */
  async listReplicas(
    params?: ListReplicasRequest
  ): Promise<ListReplicasResponse> {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.page) query.append('page', params.page.toString());
    if (params?.verbose) query.append('verbose', params.verbose.toString());
    if (params?.replica_type) query.append('replica_type', params.replica_type);
    if (params?.replica_ids) query.append('replica_ids', params.replica_ids);

    const queryString = query.toString();
    const endpoint = `/v2/replicas${queryString ? `?${queryString}` : ''}`;

    return this.request<ListReplicasResponse>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * Delete a replica
   * @param replicaId The unique identifier of the replica
   * @param hard If true, permanently deletes replica and training footage (IRREVERSIBLE)
   */
  async deleteReplica(replicaId: string, hard: boolean = false): Promise<void> {
    const query = hard ? '?hard=true' : '';
    await this.request(`/v2/replicas/${replicaId}${query}`, {
      method: 'DELETE',
    });
  }

  /**
   * Rename a replica
   * @param replicaId The unique identifier of the replica
   * @param data New name for the replica
   */
  async renameReplica(
    replicaId: string,
    data: RenameReplicaRequest
  ): Promise<void> {
    await this.request(`/v2/replicas/${replicaId}/name`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // ============================================================================
  // Objectives Methods
  // ============================================================================

  /**
   * Create a new objective for a persona
   * @param data Objective configuration
   * @returns Created objective details
   */
  async createObjectives(
    data: CreateObjectivesRequest
  ): Promise<ObjectiveResponse> {
    return this.request<ObjectiveResponse>('/v2/objectives', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get details of a specific objective
   * @param objectivesId The unique identifier of the objective
   * @returns Objective details
   */
  async getObjective(objectivesId: string): Promise<ObjectiveDetails> {
    return this.request<ObjectiveDetails>(`/v2/objectives/${objectivesId}`, {
      method: 'GET',
    });
  }

  /**
   * List all objectives
   * @param params Optional filters for pagination
   * @returns List of objectives with total count
   */
  async listObjectives(
    params?: ListObjectivesRequest
  ): Promise<ListObjectivesResponse> {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.page) query.append('page', params.page.toString());

    const queryString = query.toString();
    const endpoint = `/v2/objectives${queryString ? `?${queryString}` : ''}`;

    return this.request<ListObjectivesResponse>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * Update an objective using JSON Patch operations
   * @param objectivesId The unique identifier of the objective
   * @param operations Array of JSON Patch operations
   */
  async patchObjective(
    objectivesId: string,
    operations: PatchPersonaRequest
  ): Promise<void> {
    await this.request(`/v2/objectives/${objectivesId}`, {
      method: 'PATCH',
      body: JSON.stringify(operations),
    });
  }

  /**
   * Delete an objective
   * @param objectivesId The unique identifier of the objective
   */
  async deleteObjective(objectivesId: string): Promise<void> {
    await this.request(`/v2/objectives/${objectivesId}`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // Guardrails Methods
  // ============================================================================

  /**
   * Create a new set of guardrails for a persona
   * @param data Guardrails configuration
   * @returns Created guardrails details
   */
  async createGuardrails(
    data: CreateGuardrailsRequest
  ): Promise<GuardrailsResponse> {
    return this.request<GuardrailsResponse>('/v2/guardrails', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get details of a specific set of guardrails
   * @param guardrailsId The unique identifier of the guardrails
   * @returns Guardrails details
   */
  async getGuardrails(guardrailsId: string): Promise<GuardrailsDetails> {
    return this.request<GuardrailsDetails>(`/v2/guardrails/${guardrailsId}`, {
      method: 'GET',
    });
  }

  /**
   * List all guardrails
   * @param params Optional filters for pagination
   * @returns List of guardrails with total count
   */
  async listGuardrails(
    params?: ListGuardrailsRequest
  ): Promise<ListGuardrailsResponse> {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.page) query.append('page', params.page.toString());

    const queryString = query.toString();
    const endpoint = `/v2/guardrails${queryString ? `?${queryString}` : ''}`;

    return this.request<ListGuardrailsResponse>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * Update guardrails using JSON Patch operations
   * @param guardrailsId The unique identifier of the guardrails
   * @param operations Array of JSON Patch operations
   */
  async patchGuardrails(
    guardrailsId: string,
    operations: PatchPersonaRequest
  ): Promise<void> {
    await this.request(`/v2/guardrails/${guardrailsId}`, {
      method: 'PATCH',
      body: JSON.stringify(operations),
    });
  }

  /**
   * Delete a set of guardrails
   * @param guardrailsId The unique identifier of the guardrails
   */
  async deleteGuardrails(guardrailsId: string): Promise<void> {
    await this.request(`/v2/guardrails/${guardrailsId}`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // Document Methods
  // ============================================================================

  /**
   * Create a new document in the knowledge base
   * @param data Document configuration
   * @returns Created document details
   */
  async createDocument(data: CreateDocumentRequest): Promise<DocumentResponse> {
    return this.request<DocumentResponse>('/v2/documents', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get details of a specific document
   * @param documentId The unique identifier of the document
   * @returns Document details
   */
  async getDocument(documentId: string): Promise<DocumentDetails> {
    return this.request<DocumentDetails>(`/v2/documents/${documentId}`, {
      method: 'GET',
    });
  }

  /**
   * List all documents
   * @param params Optional filters for pagination, sorting, and filtering
   * @returns List of documents with total count
   */
  async listDocuments(
    params?: ListDocumentsRequest
  ): Promise<ListDocumentsResponse> {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.page !== undefined) query.append('page', params.page.toString());
    if (params?.sort) query.append('sort', params.sort);
    if (params?.status) query.append('status', params.status);
    if (params?.name_or_uuid) query.append('name_or_uuid', params.name_or_uuid);
    if (params?.tags) query.append('tags', params.tags);

    const queryString = query.toString();
    const endpoint = `/v2/documents${queryString ? `?${queryString}` : ''}`;

    return this.request<ListDocumentsResponse>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * Update a document's metadata (name and tags)
   * @param documentId The unique identifier of the document
   * @param data Updated document metadata
   */
  async updateDocument(
    documentId: string,
    data: UpdateDocumentRequest
  ): Promise<DocumentResponse> {
    return this.request<DocumentResponse>(`/v2/documents/${documentId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Delete a document
   * @param documentId The unique identifier of the document
   */
  async deleteDocument(documentId: string): Promise<void> {
    await this.request(`/v2/documents/${documentId}`, {
      method: 'DELETE',
    });
  }

  // ============================================================================
  // Video Generation Methods
  // ============================================================================

  /**
   * Generate a new video using a replica
   * @param data Video generation configuration (with script or audio URL)
   * @returns Video details including hosted URL
   */
  async generateVideo(data: GenerateVideoRequest): Promise<VideoResponse> {
    return this.request<VideoResponse>('/v2/videos', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * Get details of a specific video
   * @param videoId The unique identifier of the video
   * @param verbose If true, includes thumbnail URLs
   * @returns Video details including download/stream URLs
   */
  async getVideo(
    videoId: string,
    verbose: boolean = false
  ): Promise<VideoDetails> {
    const query = verbose ? '?verbose=true' : '';
    return this.request<VideoDetails>(
      `/v2/videos/${videoId}${query}`,
      { method: 'GET' }
    );
  }

  /**
   * List all videos
   * @param params Optional filters for pagination
   * @returns List of videos with total count
   */
  async listVideos(params?: ListVideosRequest): Promise<ListVideosResponse> {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.page) query.append('page', params.page.toString());

    const queryString = query.toString();
    const endpoint = `/v2/videos${queryString ? `?${queryString}` : ''}`;

    return this.request<ListVideosResponse>(endpoint, {
      method: 'GET',
    });
  }

  /**
   * Delete a video
   * @param videoId The unique identifier of the video
   * @param hard If true, permanently deletes video and thumbnails (IRREVERSIBLE)
   */
  async deleteVideo(videoId: string, hard: boolean = false): Promise<void> {
    const query = hard ? '?hard=true' : '';
    await this.request(`/v2/videos/${videoId}${query}`, {
      method: 'DELETE',
    });
  }

  /**
   * Rename a video
   * @param videoId The unique identifier of the video
   * @param data New name for the video
   */
  async renameVideo(
    videoId: string,
    data: RenameVideoRequest
  ): Promise<void> {
    await this.request(`/v2/videos/${videoId}/name`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

/**
 * Factory function to create a Tavus client instance
 * Automatically loads API key from environment variables if not provided
 */
export function createTavusClient(config?: Partial<TavusClientConfig>): TavusClient {
  const apiKey = config?.apiKey || process.env.TAVUS_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Tavus API key is required. Provide it in the config or set TAVUS_API_KEY environment variable.'
    );
  }

  return new TavusClient({
    apiKey,
    baseUrl: config?.baseUrl,
    timeout: config?.timeout,
  });
}

