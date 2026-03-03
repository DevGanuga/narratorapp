/**
 * Admin endpoint to manually generate and send intake reports
 * POST /api/admin/send-report
 */

import { NextRequest, NextResponse } from 'next/server';
import { createTavusClient } from '@/lib/tavus-client';
import { analyzeTranscript } from '@/lib/transcript-analyzer';
import { generateIntakeReportPDF } from '@/lib/pdf-generator';
import { sendEmail } from '@/lib/email-service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversationId, recipientEmail, ccEmail, patientName } = body;

    if (!conversationId) {
      return NextResponse.json({ error: 'conversationId is required' }, { status: 400 });
    }

    if (!recipientEmail) {
      return NextResponse.json({ error: 'recipientEmail is required' }, { status: 400 });
    }

    console.log(`[Admin] Generating report for conversation: ${conversationId}`);

    const client = createTavusClient();
    const conversation = await client.getConversation(conversationId, false);
    console.log('[Admin] Conversation status:', conversation.status);

    const verboseData = await client.getConversation(conversationId, true);
    console.log('[Admin] Got verbose data');

    const verboseAny = verboseData as unknown as { events?: Array<{ event_type: string; timestamp?: string; properties?: { transcript?: Array<{ role: string; content: string }>; analysis?: string } }> };
    const events = verboseAny.events || [];
    const transcriptEvent = events.find(
      (e) => e.event_type === 'application.transcription_ready'
    );
    const transcript = transcriptEvent?.properties?.transcript;

    if (!transcript || transcript.length === 0) {
      return NextResponse.json({
        error: 'No transcript available for this conversation',
        conversationStatus: conversation.status,
        eventsFound: events.map((e) => e.event_type),
      }, { status: 400 });
    }

    console.log(`[Admin] Found transcript with ${transcript.length} messages`);

    // Extract perception analysis
    const perceptionEvent = events.find(
      (e) => e.event_type === 'application.perception_analysis'
    );
    const perceptionAnalysis = perceptionEvent?.properties?.analysis || undefined;
    if (perceptionAnalysis) {
      console.log('[Admin] Found perception analysis');
    }

    // Determine interview timestamp from conversation events
    const shutdownEvent = events.find((e) => e.event_type === 'system.shutdown');
    const interviewTimestamp = shutdownEvent?.timestamp || conversation.created_at || new Date().toISOString();

    // Analyze with Claude
    console.log('[Admin] Analyzing transcript with Claude...');
    const analysis = await analyzeTranscript(transcript as Array<{ role: 'user' | 'assistant' | 'system'; content: string }>);

    if (patientName) {
      analysis.patientName = patientName;
    }

    // Generate PDF
    console.log('[Admin] Generating PDF...');
    const pdfBuffer = await generateIntakeReportPDF({
      analysis,
      replicaName: 'AI Intake',
      interviewTimestamp,
      perceptionAnalysis,
    });

    // Send email
    const emailRecipients = ccEmail ? [recipientEmail, ccEmail] : [recipientEmail];
    const reportDate = new Date().toLocaleDateString('en-US');

    console.log(`[Admin] Sending email to ${emailRecipients.join(', ')}...`);

    const emailResult = await sendEmail({
      to: emailRecipients,
      subject: `Intake Report: ${analysis.patientName} - ${reportDate}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #1a1a1a;">Patient Intake Report</h1>
          <p><strong>Patient:</strong> ${analysis.patientName}</p>
          <p><strong>Chief Complaint:</strong> ${analysis.chiefComplaint}</p>
          <p>The complete intake report with risk factor assessment is attached as a PDF.</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">
            AI-Assisted Patient Intake<br />
            Conversation ID: ${conversationId}<br />
            Date: ${new Date().toISOString()}
          </p>
        </div>
      `,
      attachments: [
        {
          filename: `intake-report-${analysis.patientName.toLowerCase().replace(/\s+/g, '-')}-${reportDate}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    if (!emailResult.success) {
      return NextResponse.json({
        success: false,
        error: 'Email send failed',
        emailError: emailResult.error,
        conversationId,
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Report generated and sent',
      conversationId,
      recipientEmail,
      ccEmail,
      transcriptMessages: transcript.length,
      emailId: emailResult.messageId,
    });
  } catch (error) {
    console.error('[Admin] Error generating report:', error);
    return NextResponse.json({
      error: 'Failed to generate report',
      details: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
