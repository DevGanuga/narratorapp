/**
 * Transcript Analyzer Service
 * Uses Claude to extract structured chest pain triage data from intake conversations
 */

import Anthropic from '@anthropic-ai/sdk';

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
  content: string;
  timestamp?: string;
}

export interface RiskFactors {
  positive: string[];
  negative: string[];
  unknown: string[];
}

export interface ChestPainIntakeAnalysis {
  patientName: string;
  age: string;
  gender: string;

  chiefComplaint: string;
  onset: string;
  speedOfOnset: string;
  activityAtOnset: string;
  locationOfPain: string;
  aggravatingAlleviating: string;
  radiation: string;
  movementMigration: string;

  cadRiskFactors: RiskFactors;
  aodRiskFactors: RiskFactors;
  peRiskFactors: RiskFactors;

  chestPainROS: {
    positive: string[];
    negative: string[];
  };
}

const ANALYSIS_PROMPT = `You are a medical documentation assistant. Analyze the following conversation transcript between a patient and an AI intake assistant conducting a chest pain triage interview. Extract structured information for a physician's review.

IMPORTANT RULES:
- Only include information that was ACTUALLY discussed in the conversation. Do NOT invent or assume anything.
- If a risk factor was asked about and the patient CONFIRMED it, list it under "positive".
  Include relevant details in parentheses when provided (e.g., "Family history of AoD (father, uncle)", "Recent rotator cuff surgery (60 days)").
- If a risk factor was asked about and the patient DENIED it, list it under "negative".
- If a risk factor was NOT asked about or the answer was ambiguous/unclear, list it under "unknown".
- Use standard clinical shorthand: "HTN" for hypertension, "AoD" for aortic dissection, "DVT" for deep vein thrombosis, "PE" for pulmonary embolism, "LDL-C" for LDL cholesterol.
- For ROS, list symptoms the patient reported as positive, and symptoms asked about but denied as negative.
  Use lowercase descriptive phrases (e.g., "back pain", "left leg numbness", "left sided vision blurry this am").
- Each risk factor item should be a concise string. Use the EXACT labels from the reference list below when the patient's answer maps to one.

Return ONLY valid JSON in this exact structure:

{
  "patientName": "Full name or 'Unknown'",
  "age": "Age or 'Unknown'",
  "gender": "Male/Female/Other or 'Unknown'",

  "chiefComplaint": "e.g., 'Chest pain'",
  "onset": "e.g., 'This morning'",
  "speedOfOnset": "Sudden or Gradual",
  "activityAtOnset": "e.g., 'Resting'",
  "locationOfPain": "e.g., 'Right side chest'",
  "aggravatingAlleviating": "e.g., 'Nothing'",
  "radiation": "e.g., 'Back'",
  "movementMigration": "e.g., 'Chest to back'",

  "cadRiskFactors": {
    "positive": [],
    "negative": [],
    "unknown": []
  },
  "aodRiskFactors": {
    "positive": [],
    "negative": [],
    "unknown": []
  },
  "peRiskFactors": {
    "positive": [],
    "negative": [],
    "unknown": []
  },
  "chestPainROS": {
    "positive": [],
    "negative": []
  }
}

RISK FACTOR REFERENCE — use these exact labels when categorizing patient responses:

CAD (Coronary Artery Disease):
- HTN
- High cholesterol
- Diabetes
- Chronic kidney disease
- Chronic inflammatory conditions
- Family history of premature heart disease
- Smoking
- Obesity
- Physical inactivity
- Unhealthy diet

AOD (Aortic Dissection):
- HTN
- Smoking
- Known aortic aneurysm
- Genetic connective tissue disorder
- Bicuspid aortic valve/heart valve problem
- Family history of AoD (include which family members in parentheses)
- Drug use

PE (Pulmonary Embolism):
- Active cancer
- History of blood clots
- Known clotting disorder
- Recent immobilization (include details and timeframe in parentheses, e.g., "Recent rotator cuff surgery (60 days)")
- Estrogen use
- Family history of blood clots
- Obesity

Chest Pain ROS — common symptoms:
Positive examples: back pain, left leg numbness, vision changes, shortness of breath, palpitations, diaphoresis
Negative examples: fever, cough, neck pain, jaw pain, shoulder pain, abdominal pain, nausea, vomiting, syncope, faint, ankle swelling, calf pain

TRANSCRIPT:
`;

/**
 * Analyze a conversation transcript to extract structured chest pain triage data
 */
export async function analyzeTranscript(
  transcript: TranscriptMessage[]
): Promise<ChestPainIntakeAnalysis> {
  const formattedTranscript = transcript
    .filter((msg) => msg.role !== 'system')
    .map((msg) => {
      const role = msg.role === 'user' ? 'PATIENT' : 'AI INTAKE';
      const time = msg.timestamp ? ` [${msg.timestamp}]` : '';
      return `${role}${time}: ${msg.content}`;
    })
    .join('\n\n');

  try {
    const anthropic = getAnthropicClient();
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [
        {
          role: 'user',
          content: ANALYSIS_PROMPT + formattedTranscript,
        },
      ],
    });

    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from Claude');
    }

    const jsonMatch = textContent.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Could not extract JSON from response');
    }

    const raw = JSON.parse(jsonMatch[0]);

    return sanitizeAnalysis(raw);
  } catch (error) {
    console.error('[Transcript Analyzer] Error analyzing transcript:', error);

    return {
      patientName: 'Unknown',
      age: 'Unknown',
      gender: 'Unknown',
      chiefComplaint: 'Unable to analyze — see transcript',
      onset: 'Unknown',
      speedOfOnset: 'Unknown',
      activityAtOnset: 'Unknown',
      locationOfPain: 'Unknown',
      aggravatingAlleviating: 'Unknown',
      radiation: 'Unknown',
      movementMigration: 'Unknown',
      cadRiskFactors: { positive: [], negative: [], unknown: ['Analysis failed — review transcript'] },
      aodRiskFactors: { positive: [], negative: [], unknown: ['Analysis failed — review transcript'] },
      peRiskFactors: { positive: [], negative: [], unknown: ['Analysis failed — review transcript'] },
      chestPainROS: { positive: [], negative: [] },
    };
  }
}

function sanitizeAnalysis(raw: Record<string, unknown>): ChestPainIntakeAnalysis {
  const safeArray = (val: unknown): string[] =>
    Array.isArray(val) ? val.filter((v): v is string => typeof v === 'string') : [];

  const safeRisk = (val: unknown): RiskFactors => {
    const obj = (val && typeof val === 'object' ? val : {}) as Record<string, unknown>;
    return {
      positive: safeArray(obj.positive),
      negative: safeArray(obj.negative),
      unknown: safeArray(obj.unknown),
    };
  };

  const ros = (raw.chestPainROS && typeof raw.chestPainROS === 'object'
    ? raw.chestPainROS
    : {}) as Record<string, unknown>;

  return {
    patientName: String(raw.patientName || 'Unknown'),
    age: String(raw.age || 'Unknown'),
    gender: String(raw.gender || 'Unknown'),
    chiefComplaint: String(raw.chiefComplaint || 'Not specified'),
    onset: String(raw.onset || 'Not specified'),
    speedOfOnset: String(raw.speedOfOnset || 'Not specified'),
    activityAtOnset: String(raw.activityAtOnset || 'Not specified'),
    locationOfPain: String(raw.locationOfPain || 'Not specified'),
    aggravatingAlleviating: String(raw.aggravatingAlleviating || 'Not specified'),
    radiation: String(raw.radiation || 'Not specified'),
    movementMigration: String(raw.movementMigration || 'Not specified'),
    cadRiskFactors: safeRisk(raw.cadRiskFactors),
    aodRiskFactors: safeRisk(raw.aodRiskFactors),
    peRiskFactors: safeRisk(raw.peRiskFactors),
    chestPainROS: {
      positive: safeArray(ros.positive),
      negative: safeArray(ros.negative),
    },
  };
}

/**
 * Extract patient name from transcript if not provided by analysis
 */
export function extractPatientName(transcript: TranscriptMessage[]): string {
  const patterns = [
    /my name is (\w+(?:\s+\w+)?)/i,
    /i'm (\w+)/i,
    /this is (\w+)/i,
    /call me (\w+)/i,
  ];

  for (const msg of transcript) {
    if (msg.role === 'user') {
      for (const pattern of patterns) {
        const match = msg.content?.match(pattern);
        if (match) {
          return match[1]
            .split(' ')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(' ');
        }
      }
    }
  }

  return 'Unknown Patient';
}
