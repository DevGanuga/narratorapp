/**
 * Setup Script: Pre-configure Demo Projects
 *
 * This script creates demo projects directly in Supabase
 * Run with: npx tsx scripts/setup-demo-projects.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const DEMO_PROJECTS = [
  {
    name: 'FLO CU Demo',
    description: 'Interactive demo with FLO CU AI replica - Created April 29, 2025',
    partner: 'Narrator Studio',
    persona_id: 'pcb2101fd24e', // FloDan7
    replica_id: 'rc1dc6bbd651', // FLO CU
    custom_greeting: "Hi! I'm here to chat with you about our experience.",
    conversational_context: 'You are a friendly and engaging AI replica demonstrating conversational capabilities.',
    brand_name: 'Narrator',
    brand_logo_url: '/White logo - no background.png',
    brand_primary_color: '#ffffff',
    brand_background_color: '#0a0a0a',
    welcome_title: 'Experience FLO CU AI',
    welcome_message: 'Interactive conversation with FLO CU',
    instructions: 'Click "Start Demo" to begin your interactive experience. Make sure your camera and microphone are enabled.',
    cta_text: 'Learn More',
    cta_url: 'https://narrator.studio',
    session_duration_hours: 24,
    show_narrator_branding: true,
  },
  {
    name: 'CRESSI Demo',
    description: 'Interactive demo with CRESSI AI replica - Created November 17, 2025',
    partner: 'Narrator Studio',
    persona_id: 'p77b36071c50', // Cressi 1
    replica_id: 'r54a3ebbdd83', // CRESSI
    custom_greeting: "Welcome! Let's explore what we can do together.",
    conversational_context: 'You are a knowledgeable and helpful AI replica ready to demonstrate conversational AI capabilities.',
    brand_name: 'Narrator',
    brand_logo_url: '/White logo - no background.png',
    brand_primary_color: '#ffffff',
    brand_background_color: '#0a0a0a',
    welcome_title: 'Experience CRESSI AI',
    welcome_message: 'Interactive conversation with CRESSI',
    instructions: 'Click "Start Demo" to begin your interactive experience. Make sure your camera and microphone are enabled.',
    cta_text: 'Learn More',
    cta_url: 'https://narrator.studio',
    session_duration_hours: 24,
    show_narrator_branding: true,
  },
  {
    name: 'BB LIVE Demo',
    description: 'Interactive live performance demo with BB AI replica - Created October 7, 2025',
    partner: 'Narrator Studio',
    persona_id: 'p8b1357538d2', // DemoBB
    replica_id: 'r8b79330a2fd', // BB LIVE
    custom_greeting: 'Hey there! Ready to talk about the blues and music?',
    conversational_context: 'You are BB, a blues legend, performing live and engaging with your audience about music, guitar, and the blues.',
    brand_name: 'Narrator',
    brand_logo_url: '/White logo - no background.png',
    brand_primary_color: '#ffffff',
    brand_background_color: '#0a0a0a',
    welcome_title: 'Experience BB LIVE',
    welcome_message: 'Interactive live performance with BB',
    instructions: 'Click "Start Demo" to begin your interactive experience. Make sure your camera and microphone are enabled.',
    cta_text: 'Learn More',
    cta_url: 'https://narrator.studio',
    session_duration_hours: 24,
    show_narrator_branding: true,
  },
  {
    name: 'BB SEATED Demo',
    description: 'Interactive seated conversation demo with BB AI replica - Created June 3, 2025',
    partner: 'Narrator Studio',
    persona_id: 'p8b1357538d2', // DemoBB (same persona as BB LIVE)
    replica_id: 'r618a19d9521', // BB SEATED
    custom_greeting: 'Welcome! Let me tell you about the blues and my journey.',
    conversational_context: 'You are BB, a blues legend, in a more intimate seated conversation setting, sharing stories and wisdom about music.',
    brand_name: 'Narrator',
    brand_logo_url: '/White logo - no background.png',
    brand_primary_color: '#ffffff',
    brand_background_color: '#0a0a0a',
    welcome_title: 'Experience BB SEATED',
    welcome_message: 'Intimate conversation with BB',
    instructions: 'Click "Start Demo" to begin your interactive experience. Make sure your camera and microphone are enabled.',
    cta_text: 'Learn More',
    cta_url: 'https://narrator.studio',
    session_duration_hours: 24,
    show_narrator_branding: true,
  },
  {
    name: 'OSWALD Demo',
    description: 'Interactive demo with OSWALD AI replica - Created June 9, 2025',
    partner: 'Narrator Studio',
    persona_id: 'p8c8d94dab90', // LeeDN1
    replica_id: 'r8f68469a43b', // OSWALD
    custom_greeting: "Hello! I'm here to demonstrate our conversational capabilities.",
    conversational_context: 'You are OSWALD, a professional and engaging AI replica showcasing advanced conversational AI technology.',
    brand_name: 'Narrator',
    brand_logo_url: '/White logo - no background.png',
    brand_primary_color: '#ffffff',
    brand_background_color: '#0a0a0a',
    welcome_title: 'Experience OSWALD AI',
    welcome_message: 'Interactive conversation with OSWALD',
    instructions: 'Click "Start Demo" to begin your interactive experience. Make sure your camera and microphone are enabled.',
    cta_text: 'Learn More',
    cta_url: 'https://narrator.studio',
    session_duration_hours: 24,
    show_narrator_branding: true,
  },
  {
    name: 'SHAKESPEARE Demo',
    description: 'Interactive demo with William Shakespeare AI replica - Created June 2, 2025',
    partner: 'Narrator Studio',
    persona_id: 'pad4c7f239ca', // Shakey1
    replica_id: 'r297e831b6ca', // Ari Palitz June 02 2025
    custom_greeting: "Hark! Welcome, good friend. What wouldst thou discuss with the Bard this fine day?",
    conversational_context: 'You are William Shakespeare, the legendary English playwright and poet. Speak in eloquent, period-appropriate language while remaining engaging and accessible. Share wisdom about life, love, drama, and the human condition.',
    brand_name: 'Narrator',
    brand_logo_url: '/White logo - no background.png',
    brand_primary_color: '#ffffff',
    brand_background_color: '#0a0a0a',
    welcome_title: 'Converse with the Bard',
    welcome_message: 'An audience with William Shakespeare',
    instructions: 'Click "Start Demo" to begin your interactive experience. Make sure your camera and microphone are enabled.',
    cta_text: 'Learn More',
    cta_url: 'https://narrator.studio',
    session_duration_hours: 24,
    show_narrator_branding: true,
  },
  {
    name: 'FD Demo',
    description: 'Interactive demo with FD AI replica - Created February 27, 2026',
    partner: 'Narrator Studio',
    persona_id: 'p48e24928e56', // FD1
    replica_id: 'r86e83954590', // Ari Palitz February 27 2026
    custom_greeting: "Hello! I'm excited to chat with you today.",
    conversational_context: 'You are a friendly and professional AI replica demonstrating conversational capabilities.',
    brand_name: 'Narrator',
    brand_logo_url: '/White logo - no background.png',
    brand_primary_color: '#ffffff',
    brand_background_color: '#0a0a0a',
    welcome_title: 'Experience FD AI',
    welcome_message: 'Interactive conversation with FD',
    instructions: 'Click "Start Demo" to begin your interactive experience. Make sure your camera and microphone are enabled.',
    cta_text: 'Learn More',
    cta_url: 'https://narrator.studio',
    session_duration_hours: 24,
    show_narrator_branding: true,
  },
  {
    name: 'CASSIE ALT1 Demo',
    description: 'Interactive demo with CASSIE ALT1 AI replica - Created May 5, 2025',
    partner: 'Narrator Studio',
    persona_id: 'p26c91fbebfe', // CASSIE ALT1
    replica_id: 'r717b11e567e', // CASSIE ALT1
    custom_greeting: "Hi there! Great to meet you. What would you like to talk about?",
    conversational_context: 'You are CASSIE, a warm and engaging AI replica ready to have a natural conversation.',
    brand_name: 'Narrator',
    brand_logo_url: '/White logo - no background.png',
    brand_primary_color: '#ffffff',
    brand_background_color: '#0a0a0a',
    welcome_title: 'Meet CASSIE',
    welcome_message: 'Interactive conversation with CASSIE',
    instructions: 'Click "Start Demo" to begin your interactive experience. Make sure your camera and microphone are enabled.',
    cta_text: 'Learn More',
    cta_url: 'https://narrator.studio',
    session_duration_hours: 24,
    show_narrator_branding: true,
  },
  {
    name: 'MAT 1 Demo',
    description: 'Interactive demo with Mat 1 AI replica - Created March 1, 2026',
    partner: 'Narrator Studio',
    persona_id: 'pd63498bb155', // Mat 1
    replica_id: 'rd8880f24978', // Ari Palitz March 01 2026
    custom_greeting: "Hey! Thanks for joining. What's on your mind?",
    conversational_context: 'You are a personable and helpful AI replica showcasing advanced conversational AI technology.',
    brand_name: 'Narrator',
    brand_logo_url: '/White logo - no background.png',
    brand_primary_color: '#ffffff',
    brand_background_color: '#0a0a0a',
    welcome_title: 'Experience MAT AI',
    welcome_message: 'Interactive conversation with MAT',
    instructions: 'Click "Start Demo" to begin your interactive experience. Make sure your camera and microphone are enabled.',
    cta_text: 'Learn More',
    cta_url: 'https://narrator.studio',
    session_duration_hours: 24,
    show_narrator_branding: true,
  },
];

async function setupProjects() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log(`🚀 Setting up ${DEMO_PROJECTS.length} demo projects...\n`);

  for (const project of DEMO_PROJECTS) {
    try {
      console.log(`Creating: ${project.name}...`);

      // Check if project with same name already exists
      const { data: existing } = await supabase
        .from('projects')
        .select('id, user_id')
        .eq('name', project.name)
        .single();

      if (existing) {
        console.log(`⏭️  ${project.name} already exists (ID: ${existing.id}), skipping...\n`);
        continue;
      }

      // Get user_id from an existing project for consistency
      const { data: existingProject } = await supabase
        .from('projects')
        .select('user_id')
        .limit(1)
        .single();
      
      const userId = existingProject?.user_id;

      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: project.name,
          description: project.description,
          partner: project.partner,
          persona_id: project.persona_id,
          replica_id: project.replica_id,
          custom_greeting: project.custom_greeting,
          conversational_context: project.conversational_context,
          brand_name: project.brand_name,
          brand_logo_url: project.brand_logo_url,
          brand_primary_color: project.brand_primary_color,
          brand_background_color: project.brand_background_color,
          welcome_title: project.welcome_title,
          welcome_message: project.welcome_message,
          instructions: project.instructions,
          cta_text: project.cta_text,
          cta_url: project.cta_url,
          session_duration_hours: project.session_duration_hours,
          show_narrator_branding: project.show_narrator_branding,
          status: 'active',
          user_id: userId,
        })
        .select()
        .single();

      if (error) {
        console.error(`❌ Failed to create ${project.name}: ${error.message}\n`);
      } else {
        console.log(`✅ Created ${project.name} (ID: ${data.id})`);
        console.log(`   Persona: ${project.persona_id}`);
        console.log(`   Replica: ${project.replica_id}\n`);
      }
    } catch (error) {
      console.error(`❌ Error creating ${project.name}:`, error, '\n');
    }
  }

  console.log('✅ Setup complete! Go to /team/dashboard to manage demo links.');
}

// Run if called directly
if (require.main === module) {
  setupProjects().catch(console.error);
}

export { setupProjects, DEMO_PROJECTS };
