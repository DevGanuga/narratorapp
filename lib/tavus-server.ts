/**
 * Server-side Tavus API utilities
 * Use this in API routes and server components
 */

'use server';

import { createTavusClient } from './tavus-client';
import type {
  CreateConversationRequest,
  ConversationResponse,
  ConversationDetails,
  VerboseConversationDetails,
  ListConversationsResponse,
  CreatePersonaRequest,
  PersonaResponse,
  PersonaDetails,
  ListPersonasResponse,
  PatchPersonaRequest,
  ReplicaDetails,
  ListReplicasResponse,
  TavusApiError,
} from '@/types/tavus';

/**
 * Server-side instance of Tavus client
 * Automatically configured with environment variables
 */
const getTavusClient = () => {
  return createTavusClient();
};

// ============================================================================
// Server Actions for Conversations
// ============================================================================

export async function createConversationAction(
  data: CreateConversationRequest
): Promise<{ success: true; data: ConversationResponse } | { success: false; error: string }> {
  try {
    const client = getTavusClient();
    const conversation = await client.createConversation(data);
    return { success: true, data: conversation };
  } catch (error) {
    const apiError = error as TavusApiError;
    return { 
      success: false, 
      error: apiError.message || 'Failed to create conversation' 
    };
  }
}

export async function getConversationAction(
  conversationId: string,
  verbose: boolean = false
): Promise<{ success: true; data: ConversationDetails | VerboseConversationDetails } | { success: false; error: string }> {
  try {
    const client = getTavusClient();
    const conversation = await client.getConversation(conversationId, verbose);
    return { success: true, data: conversation };
  } catch (error) {
    const apiError = error as TavusApiError;
    return { 
      success: false, 
      error: apiError.message || 'Failed to fetch conversation' 
    };
  }
}

export async function listConversationsAction(params?: {
  limit?: number;
  page?: number;
  status?: 'active' | 'ended';
}): Promise<{ success: true; data: ListConversationsResponse } | { success: false; error: string }> {
  try {
    const client = getTavusClient();
    const conversations = await client.listConversations(params);
    return { success: true, data: conversations };
  } catch (error) {
    const apiError = error as TavusApiError;
    return { 
      success: false, 
      error: apiError.message || 'Failed to list conversations' 
    };
  }
}

export async function endConversationAction(
  conversationId: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const client = getTavusClient();
    await client.endConversation(conversationId);
    return { success: true };
  } catch (error) {
    const apiError = error as TavusApiError;
    return { 
      success: false, 
      error: apiError.message || 'Failed to end conversation' 
    };
  }
}

export async function deleteConversationAction(
  conversationId: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const client = getTavusClient();
    await client.deleteConversation(conversationId);
    return { success: true };
  } catch (error) {
    const apiError = error as TavusApiError;
    return { 
      success: false, 
      error: apiError.message || 'Failed to delete conversation' 
    };
  }
}

// ============================================================================
// Server Actions for Personas
// ============================================================================

export async function createPersonaAction(
  data: CreatePersonaRequest
): Promise<{ success: true; data: PersonaResponse } | { success: false; error: string }> {
  try {
    const client = getTavusClient();
    const persona = await client.createPersona(data);
    return { success: true, data: persona };
  } catch (error) {
    const apiError = error as TavusApiError;
    return { 
      success: false, 
      error: apiError.message || 'Failed to create persona' 
    };
  }
}

export async function getPersonaAction(
  personaId: string
): Promise<{ success: true; data: PersonaDetails } | { success: false; error: string }> {
  try {
    const client = getTavusClient();
    const persona = await client.getPersona(personaId);
    return { success: true, data: persona };
  } catch (error) {
    const apiError = error as TavusApiError;
    return { 
      success: false, 
      error: apiError.message || 'Failed to fetch persona' 
    };
  }
}

export async function listPersonasAction(params?: {
  limit?: number;
  page?: number;
  persona_type?: 'user' | 'system';
}): Promise<{ success: true; data: ListPersonasResponse } | { success: false; error: string }> {
  try {
    const client = getTavusClient();
    const personas = await client.listPersonas(params);
    return { success: true, data: personas };
  } catch (error) {
    const apiError = error as TavusApiError;
    return { 
      success: false, 
      error: apiError.message || 'Failed to list personas' 
    };
  }
}

export async function patchPersonaAction(
  personaId: string,
  operations: PatchPersonaRequest
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const client = getTavusClient();
    await client.patchPersona(personaId, operations);
    return { success: true };
  } catch (error) {
    const apiError = error as TavusApiError;
    return { 
      success: false, 
      error: apiError.message || 'Failed to update persona' 
    };
  }
}

export async function deletePersonaAction(
  personaId: string
): Promise<{ success: true } | { success: false; error: string }> {
  try {
    const client = getTavusClient();
    await client.deletePersona(personaId);
    return { success: true };
  } catch (error) {
    const apiError = error as TavusApiError;
    return { 
      success: false, 
      error: apiError.message || 'Failed to delete persona' 
    };
  }
}

// ============================================================================
// Server Actions for Replicas
// ============================================================================

export async function getReplicaAction(
  replicaId: string,
  verbose: boolean = false
): Promise<{ success: true; data: ReplicaDetails } | { success: false; error: string }> {
  try {
    const client = getTavusClient();
    const replica = await client.getReplica(replicaId, verbose);
    return { success: true, data: replica };
  } catch (error) {
    const apiError = error as TavusApiError;
    return { 
      success: false, 
      error: apiError.message || 'Failed to fetch replica' 
    };
  }
}

export async function listReplicasAction(params?: {
  limit?: number;
  page?: number;
  verbose?: boolean;
  replica_type?: 'user' | 'system';
  replica_ids?: string;
}): Promise<{ success: true; data: ListReplicasResponse } | { success: false; error: string }> {
  try {
    const client = getTavusClient();
    const replicas = await client.listReplicas(params);
    return { success: true, data: replicas };
  } catch (error) {
    const apiError = error as TavusApiError;
    return { 
      success: false, 
      error: apiError.message || 'Failed to list replicas' 
    };
  }
}

