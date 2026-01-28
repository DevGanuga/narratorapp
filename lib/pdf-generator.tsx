/**
 * Medical Intake Report PDF Generator
 * Clinical-grade document following standard medical documentation practices
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

const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingBottom: 60,
    fontSize: 9,
    fontFamily: 'Helvetica',
    color: '#000',
    lineHeight: 1.4,
  },

  // Document Header
  documentHeader: {
    borderBottom: '2 solid #000',
    paddingBottom: 10,
    marginBottom: 15,
  },
  facilityName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 2,
  },
  documentTitle: {
    fontSize: 11,
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  confidentialBanner: {
    backgroundColor: '#000',
    color: '#fff',
    padding: '3 8',
    fontSize: 7,
    textAlign: 'center',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // Priority Banner
  priorityBanner: {
    padding: 8,
    marginBottom: 15,
    borderWidth: 2,
    borderStyle: 'solid',
  },
  priorityHigh: {
    borderColor: '#000',
    backgroundColor: '#f5f5f5',
  },
  priorityMedium: {
    borderColor: '#666',
    backgroundColor: '#fafafa',
  },
  priorityLow: {
    borderColor: '#999',
    backgroundColor: '#fff',
  },
  priorityLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  priorityText: {
    fontSize: 8,
    marginTop: 2,
  },

  // Section styling
  section: {
    marginBottom: 12,
  },
  sectionHeader: {
    backgroundColor: '#e5e5e5',
    padding: '4 6',
    marginBottom: 6,
    borderLeft: '3 solid #000',
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionContent: {
    paddingLeft: 6,
  },

  // Two-column grid
  grid: {
    flexDirection: 'row',
  },
  gridHalf: {
    flex: 1,
    paddingRight: 10,
  },

  // Field styling
  fieldRow: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'flex-start',
  },
  fieldLabel: {
    width: 85,
    fontSize: 8,
    fontWeight: 'bold',
    color: '#333',
  },
  fieldValue: {
    flex: 1,
    fontSize: 9,
  },
  fieldValueEmpty: {
    flex: 1,
    fontSize: 9,
    color: '#666',
    fontStyle: 'italic',
  },

  // List styling
  listItem: {
    flexDirection: 'row',
    marginBottom: 2,
    paddingLeft: 4,
  },
  listBullet: {
    width: 12,
    fontSize: 9,
  },
  listText: {
    flex: 1,
    fontSize: 9,
  },
  numberedItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  itemNumber: {
    width: 16,
    fontSize: 9,
    fontWeight: 'bold',
  },

  // Alert box (for allergies, critical info)
  alertBox: {
    border: '1 solid #000',
    padding: 6,
    marginTop: 4,
    backgroundColor: '#f9f9f9',
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertIcon: {
    fontSize: 10,
    fontWeight: 'bold',
    marginRight: 4,
  },
  alertTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  alertItem: {
    fontSize: 9,
    marginLeft: 14,
    marginBottom: 1,
  },

  // Clinical notes box
  notesBox: {
    border: '1 solid #ccc',
    padding: 8,
    minHeight: 40,
    backgroundColor: '#fafafa',
  },
  notesText: {
    fontSize: 9,
    lineHeight: 1.5,
  },

  // Observation box
  observationBox: {
    border: '1 solid #999',
    padding: 8,
    backgroundColor: '#f5f5f5',
  },
  observationLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#666',
    marginBottom: 4,
  },
  observationText: {
    fontSize: 9,
    lineHeight: 1.5,
  },

  // Quote styling
  quoteContainer: {
    borderLeft: '2 solid #666',
    paddingLeft: 8,
    marginBottom: 4,
    marginLeft: 4,
  },
  quoteText: {
    fontSize: 9,
    fontStyle: 'italic',
  },

  // Assessment box
  assessmentBox: {
    border: '2 solid #000',
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  assessmentTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 6,
    borderBottom: '1 solid #000',
    paddingBottom: 4,
  },

  // Disclaimer
  disclaimer: {
    marginTop: 15,
    padding: 8,
    border: '1 solid #666',
    backgroundColor: '#f9f9f9',
  },
  disclaimerTitle: {
    fontSize: 7,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 3,
  },
  disclaimerText: {
    fontSize: 7,
    color: '#444',
    lineHeight: 1.4,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    borderTop: '1 solid #ccc',
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerLeft: {
    fontSize: 7,
    color: '#666',
  },
  footerRight: {
    fontSize: 7,
    color: '#666',
  },

  // Transcript page
  transcriptHeader: {
    borderBottom: '1 solid #000',
    paddingBottom: 8,
    marginBottom: 12,
  },
  transcriptTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  transcriptMeta: {
    fontSize: 8,
    color: '#666',
    marginTop: 2,
  },
  messageBlock: {
    marginBottom: 8,
    paddingBottom: 8,
    borderBottom: '1 solid #eee',
  },
  messageHeader: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  messageRole: {
    fontSize: 8,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#333',
  },
  messageContent: {
    fontSize: 9,
    lineHeight: 1.4,
    paddingLeft: 2,
  },

  // Empty state
  emptyText: {
    fontSize: 9,
    color: '#666',
    fontStyle: 'italic',
    paddingLeft: 4,
  },

  // Checkbox style indicator
  checkbox: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  checkboxBox: {
    width: 10,
    height: 10,
    border: '1 solid #000',
    marginRight: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#000',
  },
  checkboxLabel: {
    fontSize: 9,
    flex: 1,
  },
  checkMark: {
    color: '#fff',
    fontSize: 7,
    fontWeight: 'bold',
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
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatDateTime(dateStr: string): { date: string; time: string } {
  const d = new Date(dateStr);
  return {
    date: d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }),
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
  };
}

function getPriorityStyle(level: string) {
  switch (level.toLowerCase()) {
    case 'high':
      return styles.priorityHigh;
    case 'medium':
      return styles.priorityMedium;
    default:
      return styles.priorityLow;
  }
}

function getPriorityDescription(level: string): string {
  switch (level.toLowerCase()) {
    case 'high':
      return 'STAT - Immediate physician evaluation required';
    case 'medium':
      return 'URGENT - Prompt evaluation recommended';
    default:
      return 'ROUTINE - Standard evaluation';
  }
}

function filterTranscript(transcript: TranscriptMessage[]): TranscriptMessage[] {
  return transcript.filter(msg => msg.role !== 'system' && msg.content?.trim());
}

function IntakeReportDocument({
  analysis,
  transcript,
  patientName,
  reportDate,
  sessionId,
  duration,
  perceptionAnalysis,
}: IntakeReportProps) {
  const filteredTranscript = filterTranscript(transcript);
  const timestamp = new Date().toISOString();

  return (
    <Document>
      {/* PAGE 1: Clinical Summary */}
      <Page size="A4" style={styles.page}>
        {/* Document Header */}
        <View style={styles.documentHeader}>
          <Text style={styles.facilityName}>AI-ASSISTED PATIENT INTAKE</Text>
          <Text style={styles.documentTitle}>Pre-Visit Assessment Report</Text>
          <Text style={styles.confidentialBanner}>
            Confidential Medical Record — Protected Health Information
          </Text>
        </View>

        {/* Priority/Triage */}
        <View style={[styles.priorityBanner, getPriorityStyle(analysis.urgencyLevel)]}>
          <Text style={styles.priorityLabel}>
            TRIAGE PRIORITY: {analysis.urgencyLevel.toUpperCase()}
          </Text>
          <Text style={styles.priorityText}>
            {getPriorityDescription(analysis.urgencyLevel)}
          </Text>
        </View>

        {/* Patient Demographics */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Patient Demographics</Text>
          </View>
          <View style={styles.grid}>
            <View style={styles.gridHalf}>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Patient Name:</Text>
                <Text style={styles.fieldValue}>{patientName}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Encounter ID:</Text>
                <Text style={styles.fieldValue}>{sessionId}</Text>
              </View>
            </View>
            <View style={styles.gridHalf}>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Date:</Text>
                <Text style={styles.fieldValue}>{reportDate}</Text>
              </View>
              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Duration:</Text>
                <Text style={styles.fieldValue}>
                  {duration ? formatDuration(duration) : 'N/A'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chief Complaint */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Chief Complaint (CC)</Text>
          </View>
          <View style={styles.notesBox}>
            <Text style={styles.notesText}>{analysis.chiefComplaint}</Text>
          </View>
        </View>

        {/* History of Present Illness */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>History of Present Illness (HPI)</Text>
          </View>
          <View style={styles.sectionContent}>
            <Text style={[styles.fieldLabel, { marginBottom: 4 }]}>Reported Symptoms:</Text>
            {analysis.symptoms.length > 0 ? (
              analysis.symptoms.map((symptom, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={styles.listText}>{symptom}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No specific symptoms documented</Text>
            )}
          </View>
        </View>

        {/* Allergies - Critical Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Allergies</Text>
          </View>
          {analysis.allergies.length > 0 ? (
            <View style={styles.alertBox}>
              <View style={styles.alertHeader}>
                <Text style={styles.alertIcon}>⚠</Text>
                <Text style={styles.alertTitle}>Known Allergies</Text>
              </View>
              {analysis.allergies.map((allergy, i) => (
                <Text key={i} style={styles.alertItem}>• {allergy}</Text>
              ))}
            </View>
          ) : (
            <View style={styles.sectionContent}>
              <View style={styles.checkbox}>
                <View style={[styles.checkboxBox, styles.checkboxChecked]}>
                  <Text style={styles.checkMark}>✓</Text>
                </View>
                <Text style={styles.checkboxLabel}>No Known Allergies (NKA)</Text>
              </View>
            </View>
          )}
        </View>

        {/* Current Medications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Current Medications</Text>
          </View>
          <View style={styles.sectionContent}>
            {analysis.medications.length > 0 ? (
              analysis.medications.map((med, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={styles.listText}>{med}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No current medications reported</Text>
            )}
          </View>
        </View>

        {/* Past Medical History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Past Medical History (PMH)</Text>
          </View>
          <View style={styles.sectionContent}>
            {analysis.medicalHistory.length > 0 ? (
              analysis.medicalHistory.map((item, i) => (
                <View key={i} style={styles.listItem}>
                  <Text style={styles.listBullet}>•</Text>
                  <Text style={styles.listText}>{item}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No significant PMH reported</Text>
            )}
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLeft}>Generated: {timestamp}</Text>
          <Text style={styles.footerRight}>Page 1 of 3</Text>
        </View>
      </Page>

      {/* PAGE 2: Assessment & Observations */}
      <Page size="A4" style={styles.page}>
        <View style={styles.documentHeader}>
          <Text style={styles.documentTitle}>Assessment & Observations</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ fontSize: 8 }}>Patient: {patientName}</Text>
            <Text style={{ fontSize: 8 }}>Date: {reportDate}</Text>
          </View>
        </View>

        {/* Visual/Physical Observations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Visual Assessment</Text>
          </View>
          {perceptionAnalysis ? (
            <View style={styles.observationBox}>
              <Text style={styles.observationLabel}>AI-Captured Observations</Text>
              <Text style={styles.observationText}>{perceptionAnalysis}</Text>
            </View>
          ) : (
            <View style={styles.sectionContent}>
              <Text style={styles.emptyText}>No visual observations captured</Text>
            </View>
          )}
        </View>

        {/* Key Patient Statements */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pertinent Patient Statements</Text>
          </View>
          <View style={styles.sectionContent}>
            {analysis.keyQuotes.length > 0 ? (
              analysis.keyQuotes.map((quote, i) => (
                <View key={i} style={styles.quoteContainer}>
                  <Text style={styles.quoteText}>"{quote}"</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No significant statements flagged</Text>
            )}
          </View>
        </View>

        {/* Clinical Assessment */}
        <View style={styles.section}>
          <View style={styles.assessmentBox}>
            <Text style={styles.assessmentTitle}>AI-Generated Clinical Summary</Text>
            <Text style={styles.notesText}>{analysis.summary}</Text>
          </View>
        </View>

        {/* Recommended Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended Follow-Up</Text>
          </View>
          <View style={styles.sectionContent}>
            {analysis.recommendedActions.length > 0 ? (
              analysis.recommendedActions.map((action, i) => (
                <View key={i} style={styles.numberedItem}>
                  <Text style={styles.itemNumber}>{i + 1}.</Text>
                  <Text style={styles.listText}>{action}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No specific follow-up actions recommended</Text>
            )}
          </View>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>Documentation Notice</Text>
          <Text style={styles.disclaimerText}>
            This report was generated by an AI-assisted intake system. All clinical information
            should be verified by the treating physician. This document is intended to supplement,
            not replace, standard clinical assessment and professional medical judgment. Patient
            responses were collected via automated video consultation and have not been independently verified.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerLeft}>Encounter ID: {sessionId}</Text>
          <Text style={styles.footerRight}>Page 2 of 3</Text>
        </View>
      </Page>

      {/* PAGE 3+: Transcript */}
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.transcriptHeader} fixed>
          <Text style={styles.transcriptTitle}>Verbatim Transcript</Text>
          <Text style={styles.transcriptMeta}>
            Patient: {patientName} | Date: {reportDate} | Messages: {filteredTranscript.length}
          </Text>
        </View>

        {filteredTranscript.map((message, index) => (
          <View key={index} style={styles.messageBlock} wrap={false}>
            <View style={styles.messageHeader}>
              <Text style={styles.messageRole}>
                [{message.role === 'user' ? 'PATIENT' : 'AI INTAKE'}]
              </Text>
            </View>
            <Text style={styles.messageContent}>{message.content}</Text>
          </View>
        ))}

        <View style={styles.footer} fixed>
          <Text style={styles.footerLeft}>Verbatim Record — {sessionId}</Text>
          <Text style={styles.footerRight}>Page 3</Text>
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
