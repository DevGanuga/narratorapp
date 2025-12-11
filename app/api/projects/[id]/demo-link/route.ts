import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { requireAuth } from '@/lib/auth-helpers';

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

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore
            }
          },
        },
      }
    );

    // Get the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    if (project.status !== 'active') {
      return NextResponse.json(
        { error: 'Project must be active to generate demo links' },
        { status: 400 }
      );
    }

    // Create a new demo session
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

    const { data: session, error: sessionError } = await supabase
      .from('demo_sessions')
      .insert({
        id: sessionId,
        project_id: id,
        status: 'pending',
        expires_at: expiresAt,
      })
      .select()
      .single();

    if (sessionError) {
      console.error('Error creating session:', sessionError);
      return NextResponse.json({ error: 'Failed to create demo link' }, { status: 500 });
    }

    // Update project demo count
    await supabase
      .from('projects')
      .update({
        demo_count: (project.demo_count || 0) + 1,
        last_demo_at: new Date().toISOString(),
      })
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
    return NextResponse.json({ error: 'Failed to create demo link' }, { status: 500 });
  }
}
