/**
 * Chest Pain Intake Report PDF Generator
 * Structured triage document matching clinical intake format
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
import type { ChestPainIntakeAnalysis, RiskFactors } from './transcript-analyzer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 60,
    fontSize: 11,
    fontFamily: 'Helvetica',
    color: '#000',
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: '2 solid #000',
  },
  headerText: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  fieldRow: {
    marginBottom: 2,
  },
  label: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
  },
  value: {
    fontFamily: 'Helvetica',
    fontSize: 11,
  },
  riskLine: {
    marginBottom: 3,
  },
  perceptionText: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.5,
    color: '#222',
  },
  footer: {
    position: 'absolute',
    bottom: 25,
    left: 40,
    right: 40,
    borderTop: '1 solid #ccc',
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 7,
    color: '#888',
  },
});

export interface IntakeReportProps {
  analysis: ChestPainIntakeAnalysis;
  replicaName: string;
  interviewTimestamp: string;
  perceptionAnalysis?: string;
}

function formatTimestamp(isoString: string): { time: string; date: string } {
  const d = new Date(isoString);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const year = d.getFullYear();
  return {
    time: `${hours}${minutes}`,
    date: `${month}/${day}/${year}`,
  };
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.fieldRow}>
      <Text>
        <Text style={styles.label}>{label}: </Text>
        <Text style={styles.value}>{value}</Text>
      </Text>
    </View>
  );
}

function RiskFactorSection({
  title,
  factors,
}: {
  title: string;
  factors: RiskFactors;
}) {
  const hasAny =
    factors.positive.length > 0 ||
    factors.negative.length > 0 ||
    factors.unknown.length > 0;

  if (!hasAny) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {factors.positive.length > 0 && (
        <View style={styles.riskLine}>
          <Text>
            <Text style={styles.label}>Positive: </Text>
            <Text style={styles.value}>{factors.positive.join('; ')}</Text>
          </Text>
        </View>
      )}
      {factors.negative.length > 0 && (
        <View style={styles.riskLine}>
          <Text>
            <Text style={styles.label}>Negative: </Text>
            <Text style={styles.value}>{factors.negative.join('; ')}</Text>
          </Text>
        </View>
      )}
      {factors.unknown.length > 0 && (
        <View style={styles.riskLine}>
          <Text>
            <Text style={styles.label}>Unknown: </Text>
            <Text style={styles.value}>{factors.unknown.join('; ')}</Text>
          </Text>
        </View>
      )}
    </View>
  );
}

function IntakeReportDocument({
  analysis,
  replicaName,
  interviewTimestamp,
  perceptionAnalysis,
}: IntakeReportProps) {
  const { time, date } = formatTimestamp(interviewTimestamp);

  return (
    <Document>
      <Page size="A4" style={styles.page} wrap>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerText}>
            Patient history obtained by {replicaName}: {time}, {date}
          </Text>
        </View>

        {/* Patient Demographics */}
        <View style={styles.section}>
          <Field label="Patient Name" value={analysis.patientName} />
          <Field label="Age" value={analysis.age} />
          <Field label="Gender" value={analysis.gender} />
        </View>

        {/* Chief Complaint Details */}
        <View style={styles.section}>
          <Field label="Chief Complaint" value={analysis.chiefComplaint} />
          <Field label="Onset" value={analysis.onset} />
          <Field label="Speed of Onset" value={analysis.speedOfOnset} />
          <Field label="Activity at Onset" value={analysis.activityAtOnset} />
          <Field label="Location of Pain" value={analysis.locationOfPain} />
          <Field label="Aggravating/Alleviating" value={analysis.aggravatingAlleviating} />
          <Field label="Radiation" value={analysis.radiation} />
          <Field label="Movement/Migration of Pain" value={analysis.movementMigration} />
        </View>

        {/* CAD Risk Factors */}
        <RiskFactorSection title="CAD Risk Factors" factors={analysis.cadRiskFactors} />

        {/* AOD Risk Factors */}
        <RiskFactorSection title="AOD Risk Factors" factors={analysis.aodRiskFactors} />

        {/* PE Risk Factors */}
        <RiskFactorSection title="PE Risk Factors" factors={analysis.peRiskFactors} />

        {/* Chest Pain ROS */}
        {(analysis.chestPainROS.positive.length > 0 ||
          analysis.chestPainROS.negative.length > 0 ||
          analysis.chestPainROS.notAssessed.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Chest Pain ROS:</Text>
            {analysis.chestPainROS.positive.length > 0 && (
              <View style={styles.riskLine}>
                <Text>
                  <Text style={styles.label}>Positive: </Text>
                  <Text style={styles.value}>
                    {analysis.chestPainROS.positive.join(', ')}
                  </Text>
                </Text>
              </View>
            )}
            {analysis.chestPainROS.negative.length > 0 && (
              <View style={styles.riskLine}>
                <Text>
                  <Text style={styles.label}>Negative: </Text>
                  <Text style={styles.value}>
                    {analysis.chestPainROS.negative.join(', ')}
                  </Text>
                </Text>
              </View>
            )}
            {analysis.chestPainROS.notAssessed.length > 0 && (
              <View style={styles.riskLine}>
                <Text>
                  <Text style={styles.label}>Not Assessed: </Text>
                  <Text style={styles.value}>
                    {analysis.chestPainROS.notAssessed.join(', ')}
                  </Text>
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Perception Analysis */}
        {perceptionAnalysis && (
          <View style={styles.section} break={false}>
            <Text style={styles.sectionTitle}>Perception Analysis</Text>
            <Text style={styles.perceptionText}>{perceptionAnalysis}</Text>
          </View>
        )}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generated: {new Date().toISOString()}
          </Text>
          <Text style={styles.footerText}>AI-Assisted Patient Intake</Text>
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
