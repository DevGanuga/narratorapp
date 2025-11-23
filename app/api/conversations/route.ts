import { NextRequest, NextResponse } from 'next/server';
import { createTavusClient } from '@/lib/tavus-client';
import type { CreateConversationRequest, TavusApiError } from '@/types/tavus';

export async function POST(request: NextRequest) {
  try {
    const client = createTavusClient();
    const body: CreateConversationRequest = await request.json();
    
    const conversation = await client.createConversation(body);
    
    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    const apiError = error as TavusApiError;
    return NextResponse.json(
      { 
        error: apiError.error || 'Failed to create conversation',
        message: apiError.message 
      },
      { status: apiError.status_code || 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const client = createTavusClient();
    const searchParams = request.nextUrl.searchParams;
    
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');
    const status = searchParams.get('status');
    
    const conversations = await client.listConversations({
      limit: limit ? parseInt(limit) : undefined,
      page: page ? parseInt(page) : undefined,
      status: status as 'active' | 'ended' | undefined,
    });
    
    return NextResponse.json(conversations);
  } catch (error) {
    const apiError = error as TavusApiError;
    return NextResponse.json(
      { 
        error: apiError.error || 'Failed to list conversations',
        message: apiError.message 
      },
      { status: apiError.status_code || 500 }
    );
  }
}

