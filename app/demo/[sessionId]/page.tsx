import { notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { BrandedDemoViewer } from './branded-demo-viewer';

interface DemoPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function DemoPage({ params }: DemoPageProps) {
  const { sessionId } = await params;
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Ignore
          }
        },
      },
    }
  );
  
  // Get the session
  const { data: session, error: sessionError } = await supabase
    .from('demo_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();
  
  if (sessionError || !session) {
    notFound();
  }
  
  // Check if session is expired
  if (new Date(session.expires_at) < new Date() && session.status !== 'completed') {
    // Update status to expired
    await supabase
      .from('demo_sessions')
      .update({ status: 'expired' })
      .eq('id', sessionId);
    notFound();
  }
  
  // Get the project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', session.project_id)
    .single();
  
  if (projectError || !project || project.status !== 'active') {
    notFound();
  }

  return (
    <BrandedDemoViewer
      session={session}
      project={project}
    />
  );
}
