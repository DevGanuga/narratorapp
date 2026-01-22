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
 * Primary use case: capturing transcripts when conversations end.
 *
 * Events handled:
 * - conversation.ended: Fetches transcript and updates demo session
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

    // Handle conversation ended event
    if (payload.event_type === 'conversation.ended') {
      await handleConversationEnded(payload);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Tavus Webhook] Error processing webhook:', error);
    // Return 200 to acknowledge receipt even on error (prevents retries)
    return NextResponse.json({ received: true, error: 'Processing error' });
  }
}

/**
 * Handle conversation ended event
 * 1. Find the demo session by conversation_id
 * 2. Fetch verbose conversation data (includes transcript)
 * 3. Update demo session with transcript and completion status
 */
async function handleConversationEnded(payload: ConversationWebhookPayload) {
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
  }

  // Prepare update data
  const updateData: Record<string, unknown> = {
    status: 'completed',
    completed_at: new Date().toISOString(),
  };

  // Add transcript and analysis if available
  if (verboseData) {
    if (verboseData.transcript) {
      updateData.transcript = verboseData.transcript;
    }

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
  }

  // Update the demo session
  const { error: updateError } = await supabaseAdmin
    .from('demo_sessions')
    .update(updateData)
    .eq('id', session.id);

  if (updateError) {
    console.error('[Tavus Webhook] Failed to update demo session:', updateError);
    return;
  }

  console.log('[Tavus Webhook] Successfully processed conversation end:', {
    session_id: session.id,
    conversation_id,
    has_transcript: !!verboseData?.transcript,
    transcript_length: verboseData?.transcript?.length || 0,
  });

  // Trigger intake report generation if we have a transcript and a report recipient
  if (verboseData?.transcript && verboseData.transcript.length > 0) {
    // Use report_recipient from session (set via intake form) or fall back to project config
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
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'tavus-webhook-handler',
    timestamp: new Date().toISOString(),
  });
}
