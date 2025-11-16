/**
 * Server-side Tavus API utilities
 * Use this in API routes and server components
 */

'use server';

import { createTavusClient } from './tavus-client';
import type {
  CreateConversationRequest,
  ConversationResponse,
  CreatePersonaRequest,
  PersonaResponse,
  PatchPersonaRequest,
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
): Promise<ConversationResponse> {
  const client = getTavusClient();
  return await client.createConversation(data);
}

export async function getConversationAction(
  conversationId: string,
  verbose: boolean = false
) {
  const client = getTavusClient();
  return await client.getConversation(conversationId, verbose);
}

export async function listConversationsAction(params?: {
  limit?: number;
  page?: number;
  status?: 'active' | 'ended';
}) {
  const client = getTavusClient();
  return await client.listConversations(params);
}

export async function endConversationAction(conversationId: string) {
  const client = getTavusClient();
  return await client.endConversation(conversationId);
}

export async function deleteConversationAction(conversationId: string) {
  const client = getTavusClient();
  return await client.deleteConversation(conversationId);
}

// ============================================================================
// Server Actions for Personas
// ============================================================================

export async function createPersonaAction(
  data: CreatePersonaRequest
): Promise<PersonaResponse> {
  const client = getTavusClient();
  return await client.createPersona(data);
}

export async function getPersonaAction(personaId: string) {
  const client = getTavusClient();
  return await client.getPersona(personaId);
}

export async function listPersonasAction(params?: {
  limit?: number;
  page?: number;
  persona_type?: 'user' | 'system';
}) {
  const client = getTavusClient();
  return await client.listPersonas(params);
}

export async function patchPersonaAction(
  personaId: string,
  operations: PatchPersonaRequest
) {
  const client = getTavusClient();
  return await client.patchPersona(personaId, operations);
}

export async function deletePersonaAction(personaId: string) {
  const client = getTavusClient();
  return await client.deletePersona(personaId);
}

