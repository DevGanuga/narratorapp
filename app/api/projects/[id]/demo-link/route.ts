import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { createServiceRoleClient } from '@/lib/supabase/admin';
import type { Database } from '@/types/database';

type Project = Database['public']['Tables']['projects']['Row'];
type DemoSessionInsert = Database['public']['Tables']['demo_sessions']['Insert'];

function generateDemoToken(): string {
  return `demo_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 11)}`;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    // Check authentication (supports both admin cookie and Supabase)
    const authUser = await requireAuth().catch(() => null);
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const sessionId = body.session_id || generateDemoToken();

    // Use service-role client to bypass RLS for admin-generated links
    const supabase = createServiceRoleClient() as any;

    // Get the project
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projectError || !projectData) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Type assertion after null check
    const project = projectData as Project;

    if (project.status !== 'active') {
      return NextResponse.json(
        { error: 'Project must be active to generate demo links' },
        { status: 400 }
      );
    }

    // Create a new demo session
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const sessionData: DemoSessionInsert = {
      id: sessionId,
      project_id: id,
      status: 'pending' as const,
      expires_at: expiresAt,
    };

    const { data: session, error: sessionError } = await supabase
      .from('demo_sessions')
      .insert(sessionData as any)
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return NextResponse.json({ error: 'Failed to create demo link' }, { status: 500 });
    }

    if (!session) {
      return NextResponse.json({ error: 'Failed to create demo link' }, { status: 500 });
    }

    // Update project demo count
    await supabase
      .from('projects')
      .update({
        demo_count: (project.demo_count || 0) + 1,
        last_demo_at: new Date().toISOString(),
      } as any)
      .eq('id', id);

    // Build the full demo URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const demo_url = `${baseUrl}/demo/${session.id}`;

    return NextResponse.json({
      session_id: session.id,
      demo_url,
      expires_at: session.expires_at,
    });
  } catch (error) {
    console.error('Failed to create demo link:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create demo link';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
