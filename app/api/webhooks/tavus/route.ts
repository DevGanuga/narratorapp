import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createTavusClient } from '@/lib/tavus-client';
import { generateIntakeReport } from '@/lib/intake-report';
import type { ConversationWebhookPayload, VerboseConversationDetails } from '@/types/tavus';

// Use service role client for webhook operations (no user context)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Tavus Webhook Handler
 *
 * Receives callbacks from Tavus when conversation events occur.
 *
 * Events handled:
 * - system.shutdown: Marks session as completed
 * - application.transcription_ready: Fetches transcript and generates intake report
 */
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json() as ConversationWebhookPayload;

    console.log('[Tavus Webhook] Received event:', {
      event_type: payload.event_type,
      conversation_id: payload.conversation_id,
      status: payload.status,
      timestamp: payload.timestamp,
    });

    // Handle conversation shutdown - mark session as completed
    if (payload.event_type === 'conversation.ended' || payload.event_type === 'system.shutdown') {
      await handleConversationShutdown(payload);
    }

    // Handle transcription ready - fetch transcript and generate report
    // This event fires AFTER shutdown, when transcript is actually available
    if (payload.event_type === 'application.transcription_ready') {
      await handleTranscriptionReady(payload);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Tavus Webhook] Error processing webhook:', error);
    // Return 200 to acknowledge receipt even on error (prevents retries)
    return NextResponse.json({ received: true, error: 'Processing error' });
  }
}

/**
 * Handle conversation shutdown event
 * Marks the session as completed (transcript may not be ready yet)
 */
async function handleConversationShutdown(payload: ConversationWebhookPayload) {
  const { conversation_id } = payload;

  // Find the demo session for this conversation
  const { data: session, error: sessionError } = await supabaseAdmin
    .from('demo_sessions')
    .select('id')
    .eq('conversation_id', conversation_id)
    .single();

  if (sessionError || !session) {
    console.log('[Tavus Webhook] No demo session found for conversation:', conversation_id);
    return;
  }

  // Mark session as completed
  const { error: updateError } = await supabaseAdmin
    .from('demo_sessions')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', session.id);

  if (updateError) {
    console.error('[Tavus Webhook] Failed to update demo session status:', updateError);
    return;
  }

  console.log('[Tavus Webhook] Marked session as completed:', {
    session_id: session.id,
    conversation_id,
  });
}

/**
 * Handle transcription ready event
 * Fetches the transcript and generates the intake report
 */
async function handleTranscriptionReady(payload: ConversationWebhookPayload) {
  const { conversation_id } = payload;

  // Find the demo session for this conversation
  const { data: session, error: sessionError } = await supabaseAdmin
    .from('demo_sessions')
    .select('id, project_id, status, report_recipient, prospect_name')
    .eq('conversation_id', conversation_id)
    .single();

  if (sessionError || !session) {
    console.log('[Tavus Webhook] No demo session found for conversation:', conversation_id);
    return;
  }

  // Fetch verbose conversation data (includes transcript)
  const client = createTavusClient();
  let verboseData: VerboseConversationDetails | null = null;

  try {
    verboseData = await client.getConversation(conversation_id, true);
  } catch (error) {
    console.error('[Tavus Webhook] Failed to fetch verbose conversation data:', error);
    return;
  }

  if (!verboseData?.transcript || verboseData.transcript.length === 0) {
    console.log('[Tavus Webhook] No transcript in verbose data for conversation:', conversation_id);
    return;
  }

  // Update session with transcript and analysis data
  const updateData: Record<string, unknown> = {
    transcript: verboseData.transcript,
  };

  // Store perception analysis and shutdown info in metadata
  const analysisData: Record<string, unknown> = {};

  if (verboseData['application.perception_analysis']) {
    analysisData.perception_analysis = verboseData['application.perception_analysis'];
  }
  if (verboseData.shutdown_reason) {
    analysisData.shutdown_reason = verboseData.shutdown_reason;
  }
  if (verboseData['system.shutdown']) {
    analysisData.system_shutdown = verboseData['system.shutdown'];
  }

  if (Object.keys(analysisData).length > 0) {
    updateData.analysis_data = analysisData;
  }

  // Calculate duration if we have timestamps
  if (verboseData['system.replica_joined'] && verboseData['system.shutdown']?.timestamp) {
    const startTime = new Date(verboseData['system.replica_joined']).getTime();
    const endTime = new Date(verboseData['system.shutdown'].timestamp).getTime();
    const durationSeconds = Math.round((endTime - startTime) / 1000);
    if (durationSeconds > 0) {
      updateData.duration_seconds = durationSeconds;
    }
  }

  // Update the demo session
  const { error: updateError } = await supabaseAdmin
    .from('demo_sessions')
    .update(updateData)
    .eq('id', session.id);

  if (updateError) {
    console.error('[Tavus Webhook] Failed to update demo session with transcript:', updateError);
    return;
  }

  console.log('[Tavus Webhook] Saved transcript:', {
    session_id: session.id,
    conversation_id,
    transcript_length: verboseData.transcript.length,
  });

  // Generate intake report if we have a report recipient
  const doctorEmail = session.report_recipient;

  if (doctorEmail) {
    console.log('[Tavus Webhook] Triggering intake report generation:', {
      sessionId: session.id,
      projectId: session.project_id,
      doctorEmail,
      patientName: session.prospect_name,
    });

    try {
      const result = await generateIntakeReport(session.id, {
        doctorEmail,
        sendEmail: true,
      });

      console.log('[Tavus Webhook] Intake report result:', {
        success: result.success,
        pdfGenerated: result.pdfGenerated,
        emailSent: result.emailSent,
        patientName: result.analysis?.patientName,
        urgencyLevel: result.analysis?.urgencyLevel,
        error: result.error,
      });
    } catch (error) {
      console.error('[Tavus Webhook] Error generating intake report:', error);
    }
  } else {
    console.log('[Tavus Webhook] No report_recipient set for session:', session.id);
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'tavus-webhook-handler',
    timestamp: new Date().toISOString(),
  });
}
