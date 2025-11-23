import { NextRequest, NextResponse } from 'next/server';
import { createTavusClient } from '@/lib/tavus-client';
import type { TavusApiError } from '@/types/tavus';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = createTavusClient();
    const searchParams = request.nextUrl.searchParams;
    const verbose = searchParams.get('verbose') === 'true';
    
    const conversation = await client.getConversation(id, verbose);
    
    return NextResponse.json(conversation);
  } catch (error) {
    const apiError = error as TavusApiError;
    return NextResponse.json(
      { 
        error: apiError.error || 'Failed to get conversation',
        message: apiError.message 
      },
      { status: apiError.status_code || 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = createTavusClient();
    
    await client.deleteConversation(id);
    
    return NextResponse.json({ success: true }, { status: 204 });
  } catch (error) {
    const apiError = error as TavusApiError;
    return NextResponse.json(
      { 
        error: apiError.error || 'Failed to delete conversation',
        message: apiError.message 
      },
      { status: apiError.status_code || 500 }
    );
  }
}

