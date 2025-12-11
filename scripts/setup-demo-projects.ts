/**
 * Setup Script: Pre-configure 5 Demo Projects
 *
 * This script creates the 5 demo projects via the API
 * Run with: npx tsx scripts/setup-demo-projects.ts
 */

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
    instructions: 'Click "Start Conversation" to begin your demo experience',
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
    instructions: 'Click "Start Conversation" to begin your demo experience',
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
    instructions: 'Click "Start Conversation" to begin your demo experience',
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
    instructions: 'Click "Start Conversation" to begin your demo experience',
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
    instructions: 'Click "Start Conversation" to begin your demo experience',
    cta_text: 'Learn More',
    cta_url: 'https://narrator.studio',
    session_duration_hours: 24,
    show_narrator_branding: true,
  },
];

async function setupProjects() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  console.log('🚀 Setting up 5 demo projects...\n');

  for (const project of DEMO_PROJECTS) {
    try {
      console.log(`Creating: ${project.name}...`);

      const response = await fetch(`${baseUrl}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Note: You'll need to add authentication headers if required
        },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Created ${project.name} (ID: ${data.id})`);
        console.log(`   Persona: ${project.persona_id}`);
        console.log(`   Replica: ${project.replica_id}\n`);
      } else {
        const error = await response.text();
        console.error(`❌ Failed to create ${project.name}: ${error}\n`);
      }
    } catch (error) {
      console.error(`❌ Error creating ${project.name}:`, error, '\n');
    }
  }

  console.log('✅ Setup complete! Go to /team/dashboard to activate and generate demo links.');
}

// Run if called directly
if (require.main === module) {
  setupProjects().catch(console.error);
}

export { setupProjects, DEMO_PROJECTS };
