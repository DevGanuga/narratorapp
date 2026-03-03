/**
 * Email Service
 * Handles sending emails via Resend
 */

import { Resend } from 'resend';

// Lazy-load Resend client to avoid build-time errors
let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }
  return resendClient;
}

export interface EmailAttachment {
  filename: string;
  content: Buffer;
  contentType?: string;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send an email via Resend
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const {
    to,
    subject,
    html,
    from = process.env.EMAIL_FROM || 'Flo Intake <flo@narrator.studio>',
    replyTo,
    attachments,
  } = options;

  try {
    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      replyTo,
      attachments: attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType,
      })),
    });

    if (error) {
      console.error('[Email Service] Resend error:', error);
      return { success: false, error: error.message };
    }

    console.log('[Email Service] Email sent successfully:', data?.id);
    return { success: true, messageId: data?.id };
  } catch (error) {
    console.error('[Email Service] Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send an intake report email to a doctor
 */
export async function sendIntakeReportEmail(options: {
  doctorEmail: string;
  patientName: string;
  reportDate: string;
  chiefComplaint: string;
  pdfBuffer: Buffer;
  replicaName?: string;
}): Promise<SendEmailResult> {
  const { doctorEmail, patientName, reportDate, chiefComplaint, pdfBuffer, replicaName } = options;

  const subject = `Intake Report: ${patientName} - ${reportDate}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Intake Report</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1a1a2e; padding: 30px; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Patient Intake Report</h1>
          ${replicaName ? `<p style="color: rgba(255,255,255,0.7); margin: 5px 0 0 0; font-size: 14px;">History obtained by ${replicaName}</p>` : ''}
        </div>

        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #666;"><strong>Patient:</strong> ${patientName}</p>
            <p style="margin: 5px 0 0 0; color: #666;"><strong>Chief Complaint:</strong> ${chiefComplaint}</p>
            <p style="margin: 5px 0 0 0; color: #666;"><strong>Date:</strong> ${reportDate}</p>
          </div>

          <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; border-left: 4px solid #1a1a2e;">
            <p style="margin: 0; color: #333; font-size: 14px;">
              <strong>Full Report Attached</strong><br>
              The complete intake report with risk factor assessment and review of systems is attached as a PDF.
            </p>
          </div>
        </div>

        <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
          <p style="margin: 0;">AI-Assisted Patient Intake</p>
          <p style="margin: 5px 0 0 0;">Powered by NR8R ConvoAI Studio</p>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: doctorEmail,
    subject,
    html,
    attachments: [
      {
        filename: `intake-report-${patientName.toLowerCase().replace(/\s+/g, '-')}-${reportDate}.pdf`,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}
