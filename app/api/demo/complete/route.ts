import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateIntakeReport } from '@/lib/intake-report';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Complete a demo session - fetches transcript and sends report
 * Called when user leaves the demo page (more reliable than webhooks)
 */
export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json();

    if (!session_id) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    // Get the session
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('demo_sessions')
      .select('id, conversation_id, status, report_recipient, prospect_name, transcript')
      .eq('id', session_id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (!session.conversation_id) {
      return NextResponse.json({ error: 'No conversation started' }, { status: 400 });
    }

    // If report already sent or no recipient, skip
    if (!session.report_recipient) {
      return NextResponse.json({ success: true, message: 'No report recipient' });
    }

    // Fetch transcript from Tavus if we don't have it
    let transcript = session.transcript;

    if (!transcript || transcript.length === 0) {
      console.log('[Demo Complete] Fetching transcript from Tavus...');

      const tavusRes = await fetch(
        `https://tavusapi.com/v2/conversations/${session.conversation_id}?verbose=true`,
        {
          headers: {
            'x-api-key': process.env.TAVUS_API_KEY!,
            'Content-Type': 'application/json',
          },
        }
      );

      if (tavusRes.ok) {
        const tavusData = await tavusRes.json();

        // Extract transcript from events array
        const transcriptEvent = tavusData.events?.find(
          (e: any) => e.event_type === 'application.transcription_ready'
        );
        transcript = transcriptEvent?.properties?.transcript;

        if (transcript && transcript.length > 0) {
          // Save transcript to database
          await supabaseAdmin
            .from('demo_sessions')
            .update({
              transcript,
              status: 'completed',
              completed_at: new Date().toISOString(),
            })
            .eq('id', session_id);

          console.log('[Demo Complete] Saved transcript:', transcript.length, 'messages');
        }
      }
    }

    // Generate and send report if we have transcript
    if (transcript && transcript.length > 0) {
      console.log('[Demo Complete] Generating report for:', session.report_recipient);

      const result = await generateIntakeReport(session_id, {
        doctorEmail: session.report_recipient,
        sendEmail: true,
      });

      console.log('[Demo Complete] Report result:', {
        success: result.success,
        emailSent: result.emailSent,
        error: result.error,
      });

      return NextResponse.json({
        success: result.success,
        emailSent: result.emailSent,
        patientName: result.analysis?.patientName,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'No transcript available yet',
    });
  } catch (error) {
    console.error('[Demo Complete] Error:', error);
    return NextResponse.json(
      { error: 'Failed to complete demo' },
      { status: 500 }
    );
  }
}
