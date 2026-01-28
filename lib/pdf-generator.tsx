/**
 * PDF Generator for Intake Reports
 * Professional medical intake document for clinical use
 */

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from '@react-pdf/renderer';
import type { IntakeAnalysis, TranscriptMessage } from './transcript-analyzer';

// Color palette
const colors = {
  primary: '#1e40af',      // Deep blue
  secondary: '#475569',    // Slate
  accent: '#0891b2',       // Cyan
  danger: '#dc2626',       // Red
  warning: '#d97706',      // Amber
  success: '#059669',      // Emerald
  background: '#f8fafc',   // Light gray
  white: '#ffffff',
  text: '#1e293b',
  muted: '#64748b',
  border: '#e2e8f0',
};

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: 'Helvetica',
    color: colors.text,
    backgroundColor: colors.white,
  },

  // Header styles
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottom: `2 solid ${colors.primary}`,
  },
  logo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  logoSubtext: {
    fontSize: 8,
    color: colors.muted,
    marginTop: 2,
  },
  reportMeta: {
    textAlign: 'right',
  },
  reportType: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.text,
  },
  reportDate: {
    fontSize: 9,
    color: colors.muted,
    marginTop: 2,
  },

  // Triage Alert Box
  triageAlert: {
    padding: 15,
    borderRadius: 6,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  triageHigh: {
    backgroundColor: '#fef2f2',
    borderLeft: `4 solid ${colors.danger}`,
  },
  triageMedium: {
    backgroundColor: '#fffbeb',
    borderLeft: `4 solid ${colors.warning}`,
  },
  triageLow: {
    backgroundColor: '#f0fdf4',
    borderLeft: `4 solid ${colors.success}`,
  },
  triageLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    marginRight: 10,
  },
  triageHighText: { color: colors.danger },
  triageMediumText: { color: colors.warning },
  triageLowText: { color: colors.success },
  triageDescription: {
    flex: 1,
    fontSize: 10,
    color: colors.text,
  },

  // Section styles
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottom: `1 solid ${colors.border}`,
  },
  sectionIcon: {
    width: 18,
    height: 18,
    marginRight: 8,
    backgroundColor: colors.primary,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionIconText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Two-column layout
  twoColumn: {
    flexDirection: 'row',
    gap: 20,
  },
  column: {
    flex: 1,
  },

  // Data display
  dataGrid: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 4,
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingBottom: 6,
    borderBottom: `1 solid ${colors.border}`,
  },
  dataRowLast: {
    flexDirection: 'row',
    marginBottom: 0,
    paddingBottom: 0,
    borderBottom: 'none',
  },
  dataLabel: {
    width: 100,
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.muted,
    textTransform: 'uppercase',
  },
  dataValue: {
    flex: 1,
    fontSize: 10,
    color: colors.text,
  },

  // Chief complaint box
  chiefComplaintBox: {
    backgroundColor: '#eff6ff',
    padding: 15,
    borderRadius: 4,
    borderLeft: `4 solid ${colors.primary}`,
  },
  chiefComplaintLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  chiefComplaintText: {
    fontSize: 12,
    color: colors.text,
    lineHeight: 1.5,
  },

  // List styles
  listContainer: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 4,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  listBullet: {
    width: 16,
    fontSize: 10,
    color: colors.primary,
    fontWeight: 'bold',
  },
  listText: {
    flex: 1,
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.4,
  },

  // Alert box for allergies
  alertBox: {
    backgroundColor: '#fef2f2',
    padding: 12,
    borderRadius: 4,
    borderLeft: `4 solid ${colors.danger}`,
  },
  alertLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.danger,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  alertItem: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  alertBullet: {
    width: 16,
    fontSize: 10,
    color: colors.danger,
    fontWeight: 'bold',
  },
  alertText: {
    flex: 1,
    fontSize: 10,
    color: colors.danger,
  },

  // Visual observations
  observationBox: {
    backgroundColor: '#f0fdfa',
    padding: 15,
    borderRadius: 4,
    borderLeft: `4 solid ${colors.accent}`,
  },
  observationLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.accent,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  observationText: {
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.6,
  },

  // Key quotes
  quoteBox: {
    backgroundColor: '#fefce8',
    padding: 10,
    borderRadius: 4,
    borderLeft: `3 solid ${colors.warning}`,
    marginBottom: 8,
  },
  quoteText: {
    fontSize: 10,
    fontStyle: 'italic',
    color: colors.text,
    lineHeight: 1.4,
  },

  // Recommendations
  recommendationItem: {
    flexDirection: 'row',
    marginBottom: 8,
    padding: 10,
    backgroundColor: colors.background,
    borderRadius: 4,
  },
  recommendationNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  recommendationNumberText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  recommendationText: {
    flex: 1,
    fontSize: 10,
    color: colors.text,
    lineHeight: 1.4,
    paddingTop: 4,
  },

  // Summary box
  summaryBox: {
    backgroundColor: colors.background,
    padding: 15,
    borderRadius: 4,
    border: `1 solid ${colors.border}`,
  },
  summaryText: {
    fontSize: 11,
    color: colors.text,
    lineHeight: 1.6,
  },

  // Transcript styles
  transcriptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottom: `2 solid ${colors.primary}`,
  },
  transcriptTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  transcriptMeta: {
    fontSize: 9,
    color: colors.muted,
  },
  messageContainer: {
    marginBottom: 10,
  },
  messagePatient: {
    backgroundColor: '#eff6ff',
    padding: 10,
    borderRadius: 4,
    marginLeft: 30,
    borderLeft: `3 solid ${colors.primary}`,
  },
  messageAI: {
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 4,
    marginRight: 30,
    borderLeft: `3 solid ${colors.muted}`,
  },
  messageRole: {
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.muted,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  messageText: {
    fontSize: 9,
    color: colors.text,
    lineHeight: 1.5,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTop: `1 solid ${colors.border}`,
  },
  footerText: {
    fontSize: 8,
    color: colors.muted,
  },
  pageNumber: {
    fontSize: 8,
    color: colors.muted,
  },

  // Empty state
  emptyState: {
    padding: 15,
    backgroundColor: colors.background,
    borderRadius: 4,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 10,
    color: colors.muted,
    fontStyle: 'italic',
  },
});

interface IntakeReportProps {
  analysis: IntakeAnalysis;
  transcript: TranscriptMessage[];
  patientName: string;
  reportDate: string;
  projectName?: string;
  sessionId: string;
  duration?: number;
  perceptionAnalysis?: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (mins === 0) return `${secs} seconds`;
  return `${mins} min ${secs} sec`;
}

function getTriageStyles(level: string) {
  switch (level.toLowerCase()) {
    case 'high':
      return { box: styles.triageHigh, text: styles.triageHighText };
    case 'medium':
      return { box: styles.triageMedium, text: styles.triageMediumText };
    default:
      return { box: styles.triageLow, text: styles.triageLowText };
  }
}

function getTriageDescription(level: string): string {
  switch (level.toLowerCase()) {
    case 'high':
      return 'Immediate attention required. Patient may have serious or life-threatening symptoms.';
    case 'medium':
      return 'Prompt evaluation needed. Patient has concerning symptoms requiring timely assessment.';
    default:
      return 'Routine evaluation. Patient symptoms are non-urgent but require clinical attention.';
  }
}

// Filter out system messages from transcript
function filterTranscript(transcript: TranscriptMessage[]): TranscriptMessage[] {
  return transcript.filter(msg => msg.role !== 'system' && msg.content?.trim());
}

function IntakeReportDocument({
  analysis,
  transcript,
  patientName,
  reportDate,
  projectName,
  sessionId,
  duration,
  perceptionAnalysis,
}: IntakeReportProps) {
  const triageStyles = getTriageStyles(analysis.urgencyLevel);
  const filteredTranscript = filterTranscript(transcript);
  const messageCount = filteredTranscript.length;

  return (
    <Document>
      {/* PAGE 1: Clinical Summary */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.logo}>FLO</Text>
            <Text style={styles.logoSubtext}>AI Intake Assistant</Text>
          </View>
          <View style={styles.reportMeta}>
            <Text style={styles.reportType}>Patient Intake Report</Text>
            <Text style={styles.reportDate}>{reportDate}</Text>
          </View>
        </View>

        {/* Triage Alert */}
        <View style={[styles.triageAlert, triageStyles.box]}>
          <Text style={[styles.triageLabel, triageStyles.text]}>
            ⚠ TRIAGE: {analysis.urgencyLevel.toUpperCase()}
          </Text>
          <Text style={styles.triageDescription}>
            {getTriageDescription(analysis.urgencyLevel)}
          </Text>
        </View>

        {/* Patient Information & Visit Details */}
        <View style={styles.twoColumn}>
          <View style={styles.column}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Patient Information</Text>
              </View>
              <View style={styles.dataGrid}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Name</Text>
                  <Text style={styles.dataValue}>{patientName}</Text>
                </View>
                <View style={styles.dataRowLast}>
                  <Text style={styles.dataLabel}>Session ID</Text>
                  <Text style={styles.dataValue}>{sessionId}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.column}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Visit Details</Text>
              </View>
              <View style={styles.dataGrid}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Date</Text>
                  <Text style={styles.dataValue}>{reportDate}</Text>
                </View>
                <View style={styles.dataRowLast}>
                  <Text style={styles.dataLabel}>Duration</Text>
                  <Text style={styles.dataValue}>
                    {duration ? formatDuration(duration) : 'Not recorded'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Chief Complaint */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chief Complaint</Text>
          </View>
          <View style={styles.chiefComplaintBox}>
            <Text style={styles.chiefComplaintText}>{analysis.chiefComplaint}</Text>
          </View>
        </View>

        {/* Symptoms */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Reported Symptoms</Text>
          </View>
          {analysis.symptoms.length > 0 ? (
            <View style={styles.listContainer}>
              {analysis.symptoms.map((symptom, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={styles.listText}>{symptom}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No specific symptoms reported</Text>
            </View>
          )}
        </View>

        {/* Allergies - Prominent Alert */}
        {analysis.allergies.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>⚠ Allergies</Text>
            </View>
            <View style={styles.alertBox}>
              {analysis.allergies.map((allergy, index) => (
                <View key={index} style={styles.alertItem}>
                  <Text style={styles.alertBullet}>!</Text>
                  <Text style={styles.alertText}>{allergy}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by Flo AI Intake Assistant | {projectName || 'NR8R ConvoAI Studio'}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>

      {/* PAGE 2: Clinical Details */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.logo}>FLO</Text>
            <Text style={styles.logoSubtext}>Clinical Details</Text>
          </View>
          <View style={styles.reportMeta}>
            <Text style={styles.reportType}>{patientName}</Text>
            <Text style={styles.reportDate}>{reportDate}</Text>
          </View>
        </View>

        {/* Medical History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Medical History</Text>
          </View>
          {analysis.medicalHistory.length > 0 ? (
            <View style={styles.listContainer}>
              {analysis.medicalHistory.map((item, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No medical history reported during intake</Text>
            </View>
          )}
        </View>

        {/* Current Medications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Medications</Text>
          </View>
          {analysis.medications.length > 0 ? (
            <View style={styles.listContainer}>
              {analysis.medications.map((med, index) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={styles.listText}>{med}</Text>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No medications reported during intake</Text>
            </View>
          )}
        </View>

        {/* Visual Observations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Visual Observations</Text>
          </View>
          {perceptionAnalysis ? (
            <View style={styles.observationBox}>
              <Text style={styles.observationLabel}>AI Visual Assessment</Text>
              <Text style={styles.observationText}>{perceptionAnalysis}</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No visual observations recorded</Text>
            </View>
          )}
        </View>

        {/* Key Patient Statements */}
        {analysis.keyQuotes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Key Patient Statements</Text>
            </View>
            {analysis.keyQuotes.map((quote, index) => (
              <View key={index} style={styles.quoteBox}>
                <Text style={styles.quoteText}>"{quote}"</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by Flo AI Intake Assistant | {projectName || 'NR8R ConvoAI Studio'}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>

      {/* PAGE 3: Recommendations & Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.headerBar}>
          <View>
            <Text style={styles.logo}>FLO</Text>
            <Text style={styles.logoSubtext}>Recommendations</Text>
          </View>
          <View style={styles.reportMeta}>
            <Text style={styles.reportType}>{patientName}</Text>
            <Text style={styles.reportDate}>{reportDate}</Text>
          </View>
        </View>

        {/* Recommended Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Follow-up Actions</Text>
          </View>
          {analysis.recommendedActions.length > 0 ? (
            analysis.recommendedActions.map((action, index) => (
              <View key={index} style={styles.recommendationItem}>
                <View style={styles.recommendationNumber}>
                  <Text style={styles.recommendationNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.recommendationText}>{action}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No specific recommendations generated</Text>
            </View>
          )}
        </View>

        {/* AI Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Intake Summary</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryText}>{analysis.summary}</Text>
          </View>
        </View>

        {/* Disclaimer */}
        <View style={[styles.section, { marginTop: 20 }]}>
          <View style={[styles.dataGrid, { backgroundColor: '#fef3c7', padding: 15 }]}>
            <Text style={[styles.dataLabel, { width: '100%', marginBottom: 5, color: colors.warning }]}>
              CLINICAL DISCLAIMER
            </Text>
            <Text style={[styles.listText, { fontSize: 9, lineHeight: 1.5 }]}>
              This report was generated by an AI intake assistant and should be reviewed by a qualified healthcare
              professional before making any clinical decisions. The AI analysis is intended to assist, not replace,
              clinical judgment. All information should be verified with the patient during the clinical encounter.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Generated by Flo AI Intake Assistant | {projectName || 'NR8R ConvoAI Studio'}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>

      {/* PAGE 4+: Full Transcript */}
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.transcriptHeader}>
          <View>
            <Text style={styles.transcriptTitle}>Conversation Transcript</Text>
            <Text style={styles.transcriptMeta}>
              {patientName} | {reportDate} | {messageCount} exchanges
            </Text>
          </View>
        </View>

        {filteredTranscript.map((message, index) => (
          <View
            key={index}
            style={styles.messageContainer}
            wrap={false}
          >
            <View style={message.role === 'user' ? styles.messagePatient : styles.messageAI}>
              <Text style={styles.messageRole}>
                {message.role === 'user' ? '👤 PATIENT' : '🤖 FLO (AI NURSE)'}
              </Text>
              <Text style={styles.messageText}>{message.content}</Text>
            </View>
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Transcript | {projectName || 'NR8R ConvoAI Studio'}
          </Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  );
}

/**
 * Generate a PDF buffer from intake report data
 */
export async function generateIntakeReportPDF(
  options: IntakeReportProps
): Promise<Buffer> {
  const pdfBuffer = await renderToBuffer(
    <IntakeReportDocument {...options} />
  );
  return pdfBuffer as Buffer;
}
