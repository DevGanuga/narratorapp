/**
 * Transcript Analyzer Service
 * Uses Claude to extract structured health information from intake conversations
 */

import Anthropic from '@anthropic-ai/sdk';

// Lazy-load Anthropic client to avoid build-time errors
let anthropicClient: Anthropic | null = null;

function getAnthropicClient(): Anthropic {
  if (!anthropicClient) {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }
    anthropicClient = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }
  return anthropicClient;
}

export interface TranscriptMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;  // Tavus API returns 'content'
  timestamp?: string;
}

export interface IntakeAnalysis {
  patientName: string;
  chiefComplaint: string;
  symptoms: string[];
  medicalHistory: string[];
  medications: string[];
  allergies: string[];
  urgencyLevel: 'low' | 'medium' | 'high';
  keyQuotes: string[];
  recommendedActions: string[];
  summary: string;
}

const ANALYSIS_PROMPT = `You are a medical intake analysis assistant. Analyze the following conversation transcript between a patient and an AI intake nurse (Flo). Extract structured information for a doctor's review.

IMPORTANT: Be thorough but only include information that was actually discussed in the conversation. Do not invent or assume information that wasn't mentioned.

Extract the following information in JSON format:

{
  "patientName": "The patient's name if mentioned, otherwise 'Unknown Patient'",
  "chiefComplaint": "The main reason for the visit in 1-2 sentences",
  "symptoms": ["List of symptoms reported by the patient"],
  "medicalHistory": ["Any medical history mentioned (conditions, surgeries, etc.)"],
  "medications": ["Current medications mentioned"],
  "allergies": ["Any allergies mentioned"],
  "urgencyLevel": "low, medium, or high based on symptoms described",
  "keyQuotes": ["Important direct quotes from the patient (max 5)"],
  "recommendedActions": ["Suggested follow-up actions for the doctor (max 5)"],
  "summary": "A 2-3 sentence summary of the intake for quick doctor review"
}

Guidelines for urgency level:
- HIGH: Chest pain, difficulty breathing, severe bleeding, stroke symptoms, severe allergic reaction, thoughts of self-harm
- MEDIUM: Fever over 101°F, persistent pain, vomiting, concerning symptoms that aren't immediately life-threatening
- LOW: Routine complaints, minor injuries, prescription refills, general questions

TRANSCRIPT:
`;

/**
 * Analyze a conversation transcript to extract structured intake information
 */
export async function analyzeTranscript(
  transcript: TranscriptMessage[]
): Promise<IntakeAnalysis> {
  // Format transcript for analysis
  const formattedTranscript = transcript
    .filter((msg) => msg.role !== 'system')
    .map((msg) => {
      const role = msg.role === 'user' ? 'PATIENT' : 'FLO (AI Nurse)';
      const time = msg.timestamp ? ` [${msg.timestamp}]` : '';
      return `${role}${time}: ${msg.content}`;
    })
    .join('\n\n');

  try {
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: ANALYSIS_PROMPT + formattedTranscript,
        },
      ],
    });

    // Extract the text content from the response
    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    // Parse the JSON response
    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response');
    }

    const analysis = JSON.parse(jsonMatch[0]) as IntakeAnalysis;

    // Validate and sanitize the response
    return {
      patientName: analysis.patientName || 'Unknown Patient',
      chiefComplaint: analysis.chiefComplaint || 'Not specified',
      symptoms: Array.isArray(analysis.symptoms) ? analysis.symptoms : [],
      medicalHistory: Array.isArray(analysis.medicalHistory) ? analysis.medicalHistory : [],
      medications: Array.isArray(analysis.medications) ? analysis.medications : [],
      allergies: Array.isArray(analysis.allergies) ? analysis.allergies : [],
      urgencyLevel: ['low', 'medium', 'high'].includes(analysis.urgencyLevel)
        ? analysis.urgencyLevel
        : 'low',
      keyQuotes: Array.isArray(analysis.keyQuotes) ? analysis.keyQuotes.slice(0, 5) : [],
      recommendedActions: Array.isArray(analysis.recommendedActions)
        ? analysis.recommendedActions.slice(0, 5)
        : [],
      summary: analysis.summary || 'No summary available',
    };
  } catch (error) {
    console.error('[Transcript Analyzer] Error analyzing transcript:', error);

    // Return a fallback analysis on error
    return {
      patientName: 'Unknown Patient',
      chiefComplaint: 'Unable to analyze - see transcript',
      symptoms: [],
      medicalHistory: [],
      medications: [],
      allergies: [],
      urgencyLevel: 'medium',
      keyQuotes: [],
      recommendedActions: ['Review full transcript manually'],
      summary: 'Automated analysis failed. Please review the full transcript.',
    };
  }
}

/**
 * Extract patient name from transcript if not provided
 */
export function extractPatientName(transcript: TranscriptMessage[]): string {
  // Look for common name introduction patterns
  const patterns = [
    /my name is (\w+)/i,
    /i'm (\w+)/i,
    /this is (\w+)/i,
    /call me (\w+)/i,
  ];

  for (const msg of transcript) {
    if (msg.role === 'user') {
      for (const pattern of patterns) {
        const match = msg.content?.match(pattern);
        if (match) {
          return match[1].charAt(0).toUpperCase() + match[1].slice(1).toLowerCase();
        }
      }
    }
  }

  return 'Unknown Patient';
}
