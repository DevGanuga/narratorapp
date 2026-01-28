/**
 * Intake Report Orchestrator
 * Coordinates transcript analysis, PDF generation, and email sending
 */

import { createClient } from '@supabase/supabase-js';
import { analyzeTranscript, extractPatientName, type TranscriptMessage } from './transcript-analyzer';
import { generateIntakeReportPDF } from './pdf-generator';
import { sendIntakeReportEmail } from './email-service';

// Use service role client for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface IntakeReportConfig {
  /** Email address to send the report to */
  doctorEmail: string;
  /** Whether to send the email (can be disabled for testing) */
  sendEmail?: boolean;
}

export interface IntakeReportResult {
  success: boolean;
  pdfGenerated: boolean;
  emailSent: boolean;
  error?: string;
  analysis?: {
    patientName: string;
    urgencyLevel: string;
    chiefComplaint: string;
  };
}

/**
 * Generate and send an intake report for a completed demo session
 */
export async function generateIntakeReport(
  sessionId: string,
  config: IntakeReportConfig
): Promise<IntakeReportResult> {
  console.log('[Intake Report] Starting report generation for session:', sessionId);

  try {
    // 1. Fetch the session with transcript
    const { data: session, error: sessionError } = await supabaseAdmin
      .from('demo_sessions')
      .select(`
        id,
        transcript,
        analysis_data,
        duration_seconds,
        completed_at,
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

    // Cast transcript to proper type
    const transcript = session.transcript as unknown as TranscriptMessage[];

    // 2. Analyze the transcript
    console.log('[Intake Report] Analyzing transcript...');
    const analysis = await analyzeTranscript(transcript);

    // Use prospect name if available, otherwise extract from transcript
    const patientName = session.prospect_name || analysis.patientName || extractPatientName(transcript);
    analysis.patientName = patientName;

    // 3. Generate PDF
    console.log('[Intake Report] Generating PDF...');
    const reportDate = session.completed_at
      ? new Date(session.completed_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });

    const projectData = session.projects as { name?: string; persona_name?: string } | null;
    const analysisData = session.analysis_data as { perception_analysis?: string } | null;

    const pdfBuffer = await generateIntakeReportPDF({
      analysis,
      transcript,
      patientName,
      reportDate,
      projectName: projectData?.name || 'AI Intake',
      sessionId: session.id,
      duration: session.duration_seconds || undefined,
      perceptionAnalysis: analysisData?.perception_analysis,
    });

    console.log('[Intake Report] PDF generated, size:', pdfBuffer.length, 'bytes');

    // 4. Send email (if enabled)
    let emailSent = false;
    if (config.sendEmail !== false && config.doctorEmail) {
      console.log('[Intake Report] Sending email to:', config.doctorEmail);

      const emailResult = await sendIntakeReportEmail({
        doctorEmail: config.doctorEmail,
        patientName,
        reportDate,
        summary: analysis.summary,
        pdfBuffer,
        projectName: projectData?.name,
      });

      emailSent = emailResult.success;

      if (!emailResult.success) {
        console.error('[Intake Report] Email failed:', emailResult.error);
      }
    }

    // 5. Update session with report status
    await supabaseAdmin
      .from('demo_sessions')
      .update({
        report_sent_at: emailSent ? new Date().toISOString() : null,
        report_recipient: emailSent ? config.doctorEmail : null,
        analysis_data: {
          ...(session.analysis_data as object || {}),
          intake_analysis: {
            patientName: analysis.patientName,
            chiefComplaint: analysis.chiefComplaint,
            urgencyLevel: analysis.urgencyLevel,
            symptomsCount: analysis.symptoms.length,
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
        urgencyLevel: analysis.urgencyLevel,
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

/**
 * Check if a project is configured for intake reports
 * (Can be extended to check project settings in the future)
 */
export async function isIntakeReportEnabled(projectId: string): Promise<{
  enabled: boolean;
  doctorEmail?: string;
}> {
  // For now, check if project has custom_fields with doctor email
  const { data: project } = await supabaseAdmin
    .from('projects')
    .select('custom_fields, name')
    .eq('id', projectId)
    .single();

  if (!project) {
    return { enabled: false };
  }

  // Check for doctor_email in custom_fields or branding
  const customFields = project.custom_fields as Record<string, unknown> | null;
  const doctorEmail = customFields?.doctor_email as string | undefined;

  // Enable if we have a doctor email configured
  if (doctorEmail) {
    return { enabled: true, doctorEmail };
  }

  return { enabled: false };
}
