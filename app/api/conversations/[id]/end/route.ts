import { NextRequest, NextResponse } from 'next/server';
import { createTavusClient } from '@/lib/tavus-client';
import type { TavusApiError } from '@/types/tavus';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const client = createTavusClient();
    
    await client.endConversation(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    const apiError = error as TavusApiError;
    return NextResponse.json(
      { 
        error: apiError.error || 'Failed to end conversation',
        message: apiError.message 
      },
      { status: apiError.status_code || 500 }
    );
  }
}

