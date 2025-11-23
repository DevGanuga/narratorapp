import { NextRequest, NextResponse } from 'next/server';
import { createTavusClient } from '@/lib/tavus-client';
import type { CreateReplicaRequest, TavusApiError } from '@/types/tavus';

export async function POST(request: NextRequest) {
  try {
    const client = createTavusClient();
    const body: CreateReplicaRequest = await request.json();
    
    const replica = await client.createReplica(body);
    
    return NextResponse.json(replica, { status: 201 });
  } catch (error) {
    const apiError = error as TavusApiError;
    return NextResponse.json(
      { 
        error: apiError.error || 'Failed to create replica',
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
    const verbose = searchParams.get('verbose');
    const replica_type = searchParams.get('replica_type');
    const replica_ids = searchParams.get('replica_ids');
    
    const replicas = await client.listReplicas({
      limit: limit ? parseInt(limit) : undefined,
      page: page ? parseInt(page) : undefined,
      verbose: verbose === 'true',
      replica_type: replica_type as 'user' | 'system' | undefined,
      replica_ids: replica_ids || undefined,
    });
    
    return NextResponse.json(replicas);
  } catch (error) {
    const apiError = error as TavusApiError;
    return NextResponse.json(
      { 
        error: apiError.error || 'Failed to list replicas',
        message: apiError.message 
      },
      { status: apiError.status_code || 500 }
    );
  }
}

