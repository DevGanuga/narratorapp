/**
 * PDF Generator for Intake Reports
 * Uses @react-pdf/renderer to create professional medical intake reports
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

// PDF Styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#333',
  },
  header: {
    marginBottom: 30,
    borderBottom: '2 solid #667eea',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: 140,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    flex: 1,
    color: '#333',
  },
  urgencyHigh: {
    backgroundColor: '#fee2e2',
    padding: '4 8',
    borderRadius: 4,
    color: '#dc2626',
    fontWeight: 'bold',
  },
  urgencyMedium: {
    backgroundColor: '#fef3c7',
    padding: '4 8',
    borderRadius: 4,
    color: '#d97706',
    fontWeight: 'bold',
  },
  urgencyLow: {
    backgroundColor: '#d1fae5',
    padding: '4 8',
    borderRadius: 4,
    color: '#059669',
    fontWeight: 'bold',
  },
  listItem: {
    marginBottom: 4,
    paddingLeft: 10,
  },
  bulletPoint: {
    marginRight: 8,
  },
  transcriptContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fafafa',
    borderRadius: 4,
  },
  transcriptMessage: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
  },
  userMessage: {
    backgroundColor: '#e8f4fd',
    marginLeft: 20,
  },
  assistantMessage: {
    backgroundColor: '#f0f0f0',
    marginRight: 20,
  },
  messageRole: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 2,
  },
  messageText: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  timestamp: {
    fontSize: 8,
    color: '#999',
    marginTop: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 40,
    right: 40,
    textAlign: 'center',
    fontSize: 9,
    color: '#999',
    borderTop: '1 solid #eee',
    paddingTop: 10,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    right: 40,
    fontSize: 9,
    color: '#999',
  },
  summary: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 4,
    marginBottom: 10,
    lineHeight: 1.5,
  },
  keyQuote: {
    fontStyle: 'italic',
    backgroundColor: '#fff3cd',
    padding: 8,
    borderRadius: 4,
    marginBottom: 6,
    borderLeft: '3 solid #ffc107',
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
}

// Helper to format duration
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

// Helper to get urgency style
function getUrgencyStyle(level: string) {
  switch (level.toLowerCase()) {
    case 'high':
      return styles.urgencyHigh;
    case 'medium':
      return styles.urgencyMedium;
    default:
      return styles.urgencyLow;
  }
}

// The PDF Document Component
function IntakeReportDocument({
  analysis,
  transcript,
  patientName,
  reportDate,
  projectName,
  sessionId,
  duration,
}: IntakeReportProps) {
  return (
    <Document>
      {/* Page 1: Summary */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Patient Intake Report</Text>
          <Text style={styles.subtitle}>
            {projectName || 'AI Intake Assistant'} | Generated {reportDate}
          </Text>
        </View>

        {/* Patient Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Patient Information</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{patientName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Session ID:</Text>
            <Text style={styles.value}>{sessionId}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{reportDate}</Text>
          </View>
          {duration && (
            <View style={styles.row}>
              <Text style={styles.label}>Call Duration:</Text>
              <Text style={styles.value}>{formatDuration(duration)}</Text>
            </View>
          )}
          <View style={styles.row}>
            <Text style={styles.label}>Urgency Level:</Text>
            <Text style={getUrgencyStyle(analysis.urgencyLevel)}>
              {analysis.urgencyLevel.toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Chief Complaint */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chief Complaint</Text>
          <Text style={styles.summary}>{analysis.chiefComplaint}</Text>
        </View>

        {/* Symptoms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reported Symptoms</Text>
          {analysis.symptoms.map((symptom, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.bulletPoint}>•</Text>
              <Text style={styles.value}>{symptom}</Text>
            </View>
          ))}
        </View>

        {/* Medical History */}
        {analysis.medicalHistory.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medical History Mentioned</Text>
            {analysis.medicalHistory.map((item, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.value}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Current Medications */}
        {analysis.medications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Current Medications</Text>
            {analysis.medications.map((med, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.value}>{med}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Allergies */}
        {analysis.allergies.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Allergies</Text>
            {analysis.allergies.map((allergy, index) => (
              <View key={index} style={styles.row}>
                <Text style={styles.bulletPoint}>•</Text>
                <Text style={styles.value}>{allergy}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.footer}>
          Generated by Flo AI Intake Assistant | NR8R ConvoAI Studio
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </Page>

      {/* Page 2: Key Quotes & Recommendations */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Clinical Notes</Text>
          <Text style={styles.subtitle}>{patientName} | {reportDate}</Text>
        </View>

        {/* Key Quotes */}
        {analysis.keyQuotes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Key Patient Statements</Text>
            {analysis.keyQuotes.map((quote, index) => (
              <View key={index} style={styles.keyQuote}>
                <Text>"{quote}"</Text>
              </View>
            ))}
          </View>
        )}

        {/* Recommended Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Follow-up Actions</Text>
          {analysis.recommendedActions.map((action, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.bulletPoint}>{index + 1}.</Text>
              <Text style={styles.value}>{action}</Text>
            </View>
          ))}
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI-Generated Summary</Text>
          <Text style={styles.summary}>{analysis.summary}</Text>
        </View>

        <Text style={styles.footer}>
          Generated by Flo AI Intake Assistant | NR8R ConvoAI Studio
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
      </Page>

      {/* Page 3+: Full Transcript */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Conversation Transcript</Text>
          <Text style={styles.subtitle}>{patientName} | {reportDate}</Text>
        </View>

        <View style={styles.transcriptContainer}>
          {transcript.map((message, index) => (
            <View
              key={index}
              style={[
                styles.transcriptMessage,
                message.role === 'user' ? styles.userMessage : styles.assistantMessage,
              ]}
            >
              <Text style={styles.messageRole}>
                {message.role === 'user' ? 'PATIENT' : 'FLO (AI)'}
              </Text>
              <Text style={styles.messageText}>{message.content}</Text>
              {message.timestamp && (
                <Text style={styles.timestamp}>{message.timestamp}</Text>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.footer}>
          Generated by Flo AI Intake Assistant | NR8R ConvoAI Studio
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        />
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
