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

    // If no replica_type specified, fetch both user and system replicas
    if (!replica_type && !replica_ids) {
      const [userReplicas, systemReplicas] = await Promise.all([
        client.listReplicas({
          limit: limit ? parseInt(limit) : undefined,
          page: page ? parseInt(page) : undefined,
          verbose: verbose === 'true',
          replica_type: 'user',
        }),
        client.listReplicas({
          limit: limit ? parseInt(limit) : undefined,
          page: page ? parseInt(page) : undefined,
          verbose: verbose === 'true',
          replica_type: 'system',
        }),
      ]);

      // Combine and return with type labels
      return NextResponse.json({
        data: [
          ...userReplicas.data.map(r => ({ ...r, replica_type: 'user' as const })),
          ...systemReplicas.data.map(r => ({ ...r, replica_type: 'system' as const })),
        ],
        total_count: userReplicas.total_count + systemReplicas.total_count,
      });
    }

    // Fetch specific type or IDs if requested
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

