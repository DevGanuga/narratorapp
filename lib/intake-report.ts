/**
 * Intake Report Orchestrator
 * Coordinates transcript analysis, PDF generation, and email sending
 */

import { createClient } from '@supabase/supabase-js';
import { analyzeTranscript, extractPatientName, type TranscriptMessage } from './transcript-analyzer';
import { generateIntakeReportPDF } from './pdf-generator';
import { sendIntakeReportEmail } from './email-service';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface IntakeReportConfig {
  doctorEmail: string;
  sendEmail?: boolean;
}

export interface IntakeReportResult {
  success: boolean;
  pdfGenerated: boolean;
  emailSent: boolean;
  error?: string;
  analysis?: {
    patientName: string;
    chiefComplaint: string;
  };
}

/**
 * Generate and send an intake report for a completed demo session.
 * Includes deduplication — skips if report_sent_at is already set.
 */
export async function generateIntakeReport(
  sessionId: string,
  config: IntakeReportConfig
): Promise<IntakeReportResult> {
  console.log('[Intake Report] Starting report generation for session:', sessionId);

  try {
    // Dedup: skip if report already sent
    const { data: existing } = await supabaseAdmin
      .from('demo_sessions')
      .select('report_sent_at')
      .eq('id', sessionId)
      .single();

    if (existing?.report_sent_at) {
      console.log('[Intake Report] Report already sent, skipping:', sessionId);
      return {
        success: true,
        pdfGenerated: false,
        emailSent: false,
        error: 'Report already sent',
      };
    }

    // Fetch session with transcript
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('demo_sessions')
      .select(`
        id,
        transcript,
        completed_at,
        created_at,
        project_id,
        prospect_name,
        projects (
          name,
          persona_name
        )
      `)
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return {
        success: false,
        pdfGenerated: false,
        emailSent: false,
        error: `Session not found: ${sessionError?.message || 'Unknown error'}`,
      };
    }

    if (!session.transcript) {
      return {
        success: false,
        pdfGenerated: false,
        emailSent: false,
        error: 'No transcript available for this session',
      };
    }

    const transcript = session.transcript as unknown as TranscriptMessage[];

    // Analyze transcript with Claude
    console.log('[Intake Report] Analyzing transcript...');
    const analysis = await analyzeTranscript(transcript);

    // Use prospect name if available, otherwise fall back to analysis or extraction
    if (session.prospect_name) {
      analysis.patientName = session.prospect_name;
    } else if (analysis.patientName === 'Unknown') {
      analysis.patientName = extractPatientName(transcript);
    }

    const projectData = session.projects as { name?: string; persona_name?: string } | null;
    const replicaName = projectData?.persona_name || projectData?.name || 'AI Intake';
    const interviewTimestamp = session.completed_at || session.created_at || new Date().toISOString();

    // Generate PDF
    console.log('[Intake Report] Generating PDF...');
    const pdfBuffer = await generateIntakeReportPDF({
      analysis,
      replicaName,
      interviewTimestamp,
    });
    console.log('[Intake Report] PDF generated, size:', pdfBuffer.length, 'bytes');

    // Send email
    let emailSent = false;
    if (config.sendEmail !== false && config.doctorEmail) {
      console.log('[Intake Report] Sending email to:', config.doctorEmail);

      const reportDate = new Date(interviewTimestamp).toLocaleDateString('en-US');

      const emailResult = await sendIntakeReportEmail({
        doctorEmail: config.doctorEmail,
        patientName: analysis.patientName,
        reportDate,
        chiefComplaint: analysis.chiefComplaint,
        pdfBuffer,
        replicaName,
      });

      emailSent = emailResult.success;

      if (!emailResult.success) {
        console.error('[Intake Report] Email failed:', emailResult.error);
      }
    }

    // Update session with report status
    await supabaseAdmin
      .from('demo_sessions')
      .update({
        report_sent_at: emailSent ? new Date().toISOString() : null,
        report_recipient: emailSent ? config.doctorEmail : null,
        analysis_data: {
          intake_analysis: {
            patientName: analysis.patientName,
            chiefComplaint: analysis.chiefComplaint,
            age: analysis.age,
            gender: analysis.gender,
            analyzedAt: new Date().toISOString(),
          },
        },
      })
      .eq('id', sessionId);

    console.log('[Intake Report] Report generation complete');

    return {
      success: true,
      pdfGenerated: true,
      emailSent,
      analysis: {
        patientName: analysis.patientName,
        chiefComplaint: analysis.chiefComplaint,
      },
    };
  } catch (error) {
    console.error('[Intake Report] Error generating report:', error);
    return {
      success: false,
      pdfGenerated: false,
      emailSent: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
