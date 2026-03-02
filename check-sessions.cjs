const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envContent = fs.readFileSync('.env.local', 'utf8');
const getEnv = (key) => {
  const match = envContent.match(new RegExp(`^${key}=(.*)$`, 'm'));
  return match ? match[1] : null;
};

const supabase = createClient(
  getEnv('NEXT_PUBLIC_SUPABASE_URL'),
  getEnv('SUPABASE_SERVICE_ROLE_KEY')
);

async function checkRecentSessions() {
  const { data, error } = await supabase
    .from('demo_sessions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('Recent sessions:');
  data.forEach(s => {
    const created = new Date(s.created_at);
    const ago = Math.round((Date.now() - created.getTime()) / 60000);
    console.log('---');
    console.log('Conversation:', s.conversation_id || 'none');
    console.log('Status:', s.status);
    console.log('Created:', created.toLocaleString(), `(${ago} min ago)`);
  });
}

checkRecentSessions();
