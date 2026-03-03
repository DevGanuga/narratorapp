import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateIntakeReport } from '@/lib/intake-report';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Complete a demo session — fetches transcript and generates report.
 *
 * Called from the client when the Tavus conversation ends (primary trigger)
 * and also by navigator.sendBeacon on page unload (backup trigger).
 *
 * Includes retry logic: if transcript isn't ready on the first attempt,
 * waits 5 seconds and tries once more before deferring to the webhook.
 */
export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json();

    if (!session_id) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    const { data: session, error: sessionError } = await supabaseAdmin
      .from('demo_sessions')
      .select('id, conversation_id, status, report_recipient, report_sent_at, prospect_name, transcript')
      .eq('id', session_id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    if (!session.conversation_id) {
      return NextResponse.json({ error: 'No conversation started' }, { status: 400 });
    }

    // Already handled
    if (session.report_sent_at) {
      return NextResponse.json({ success: true, message: 'Report already sent' });
    }

    // Mark session as completed if not already
    if (session.status !== 'completed') {
      await supabaseAdmin
        .from('demo_sessions')
        .update({ status: 'completed', completed_at: new Date().toISOString() })
        .eq('id', session_id);
    }

    // No recipient configured — nothing to do beyond marking completed
    if (!session.report_recipient) {
      return NextResponse.json({ success: true, message: 'No report recipient configured' });
    }

    // Attempt to get transcript (DB first, then Tavus API with one retry)
    let transcript = session.transcript;

    if (!transcript || (Array.isArray(transcript) && transcript.length === 0)) {
      transcript = await fetchTranscriptFromTavus(session.conversation_id, session_id);
    }

    if (!transcript || (Array.isArray(transcript) && transcript.length === 0)) {
      console.log('[Demo Complete] Transcript not ready, retrying in 5s...');
      await new Promise((r) => setTimeout(r, 5000));
      transcript = await fetchTranscriptFromTavus(session.conversation_id, session_id);
    }

    if (!transcript || (Array.isArray(transcript) && transcript.length === 0)) {
      console.log('[Demo Complete] Transcript still unavailable — webhook will handle it');
      return NextResponse.json({
        success: true,
        message: 'Transcript not available yet — report will be sent when ready via webhook',
      });
    }

    // Generate and send report
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
  } catch (error) {
    console.error('[Demo Complete] Error:', error);
    return NextResponse.json(
      { error: 'Failed to complete demo' },
      { status: 500 }
    );
  }
}

/**
 * Fetch transcript from Tavus verbose API and save to database
 */
async function fetchTranscriptFromTavus(
  conversationId: string,
  sessionId: string
): Promise<unknown[] | null> {
  try {
    console.log('[Demo Complete] Fetching transcript from Tavus for:', conversationId);

    const res = await fetch(
      `https://tavusapi.com/v2/conversations/${conversationId}?verbose=true`,
      {
        headers: {
          'x-api-key': process.env.TAVUS_API_KEY!,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!res.ok) {
      console.error('[Demo Complete] Tavus API error:', res.status);
      return null;
    }

    const data = await res.json();
    const events = data.events || [];

    const transcriptEvent = events.find(
      (e: { event_type: string }) => e.event_type === 'application.transcription_ready'
    );
    const transcript = transcriptEvent?.properties?.transcript;

    if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
      return null;
    }

    // Save transcript to database
    const updateData: Record<string, unknown> = {
      transcript,
      status: 'completed',
      completed_at: new Date().toISOString(),
    };

    // Also capture perception analysis and duration if available
    const perceptionEvent = events.find(
      (e: { event_type: string }) => e.event_type === 'application.perception_analysis'
    );
    const shutdownEvent = events.find(
      (e: { event_type: string }) => e.event_type === 'system.shutdown'
    );
    const replicaJoinedEvent = events.find(
      (e: { event_type: string }) => e.event_type === 'system.replica_joined'
    );

    if (perceptionEvent?.properties?.analysis || shutdownEvent?.properties?.shutdown_reason) {
      updateData.analysis_data = {
        ...(perceptionEvent?.properties?.analysis && {
          perception_analysis: perceptionEvent.properties.analysis,
        }),
        ...(shutdownEvent?.properties?.shutdown_reason && {
          shutdown_reason: shutdownEvent.properties.shutdown_reason,
        }),
      };
    }

    if (replicaJoinedEvent?.timestamp && shutdownEvent?.timestamp) {
      const startTime = new Date(replicaJoinedEvent.timestamp).getTime();
      const endTime = new Date(shutdownEvent.timestamp).getTime();
      const durationSeconds = Math.round((endTime - startTime) / 1000);
      if (durationSeconds > 0) {
        updateData.duration_seconds = durationSeconds;
      }
    }

    await supabaseAdmin
      .from('demo_sessions')
      .update(updateData)
      .eq('id', sessionId);

    console.log('[Demo Complete] Saved transcript:', transcript.length, 'messages');
    return transcript;
  } catch (error) {
    console.error('[Demo Complete] Error fetching from Tavus:', error);
    return null;
  }
}
