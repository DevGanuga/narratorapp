import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createTavusClient } from '@/lib/tavus-client';

/**
 * Get the base URL for webhook callbacks
 * Handles both Vercel deployments and local development
 */
function getWebhookBaseUrl(): string {
  // Explicit app URL takes priority (for production custom domains)
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL;
  }
  // Vercel deployment URL (auto-provided in Vercel)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Local development fallback
  return 'http://localhost:3000';
}

export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json();

    if (!session_id) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

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

    // Get the session
    const { data: session, error: sessionError } = await supabase
      .from('demo_sessions')
      .select('*')
      .eq('id', session_id)
      .single();
    
    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    
    if (session.status === 'expired' || new Date(session.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Session expired' }, { status: 410 });
    }
    
    if (session.status === 'completed') {
      return NextResponse.json({ error: 'Session already completed' }, { status: 400 });
    }

    // Get the project
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', session.project_id)
      .single();
    
    if (projectError || !project || project.status !== 'active') {
      return NextResponse.json({ error: 'Project not available' }, { status: 404 });
    }

    // Create the Tavus conversation with webhook callback
    const client = createTavusClient();
    const webhookUrl = `${getWebhookBaseUrl()}/api/webhooks/tavus`;

    const conversation = await client.createConversation({
      replica_id: project.replica_id,
      persona_id: project.persona_id,
      conversation_name: `${project.name} - Demo ${session.id}`,
      custom_greeting: project.custom_greeting || undefined,
      conversational_context: project.conversational_context || undefined,
      callback_url: webhookUrl,
    });

    // Update the session with conversation details
    await supabase
      .from('demo_sessions')
      .update({
        status: 'active',
        conversation_id: conversation.conversation_id,
        conversation_url: conversation.conversation_url,
      })
      .eq('id', session_id);

    return NextResponse.json({
      conversation_id: conversation.conversation_id,
      conversation_url: conversation.conversation_url,
    });
  } catch (error) {
    console.error('Failed to start demo:', error);
    return NextResponse.json(
      { error: 'Failed to start conversation' },
      { status: 500 }
    );
  }
}
