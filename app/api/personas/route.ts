import { NextRequest, NextResponse } from 'next/server';
import { createTavusClient } from '@/lib/tavus-client';
import type { CreatePersonaRequest, TavusApiError } from '@/types/tavus';

export async function POST(request: NextRequest) {
  try {
    const client = createTavusClient();
    const body: CreatePersonaRequest = await request.json();
    
    const persona = await client.createPersona(body);
    
    return NextResponse.json(persona, { status: 201 });
  } catch (error) {
    const apiError = error as TavusApiError;
    return NextResponse.json(
      { 
        error: apiError.error || 'Failed to create persona',
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
    const persona_type = searchParams.get('persona_type');
    
    const personas = await client.listPersonas({
      limit: limit ? parseInt(limit) : undefined,
      page: page ? parseInt(page) : undefined,
      persona_type: persona_type as 'user' | 'system' | undefined,
    });
    
    return NextResponse.json(personas);
  } catch (error) {
    const apiError = error as TavusApiError;
    return NextResponse.json(
      { 
        error: apiError.error || 'Failed to list personas',
        message: apiError.message 
      },
      { status: apiError.status_code || 500 }
    );
  }
}

