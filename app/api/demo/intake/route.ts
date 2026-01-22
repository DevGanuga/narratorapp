import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role client for public intake submissions
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Save intake form data to a demo session
 * Called before the conversation starts to capture patient info and doctor email
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, prospect_name, report_recipient } = body;

    if (!session_id) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Verify session exists
    const { data: session, error: fetchError } = await supabaseAdmin
      .from('demo_sessions')
      .select('id, status')
      .eq('id', session_id)
      .single();

    if (fetchError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Allow saving intake data for pending or active sessions
    // (in case form is submitted slightly after conversation starts)
    if (session.status === 'completed' || session.status === 'expired') {
      return NextResponse.json(
        { error: 'Session has already ended' },
        { status: 400 }
      );
    }

    // Update session with intake data
    const { error: updateError } = await supabaseAdmin
      .from('demo_sessions')
      .update({
        prospect_name: prospect_name || null,
        report_recipient: report_recipient || null,
      })
      .eq('id', session_id);

    if (updateError) {
      console.error('[Intake API] Failed to update session:', updateError);
      return NextResponse.json(
        { error: 'Failed to save intake information' },
        { status: 500 }
      );
    }

    console.log('[Intake API] Saved intake data:', {
      session_id,
      prospect_name,
      report_recipient,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Intake API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
