import { redirect, notFound } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { BrandedDemoViewer } from '../../[sessionId]/branded-demo-viewer';

interface PreviewPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { projectId } = await params;
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
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/team/login');
  }
  
  // Get the project
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
  
  if (error || !project) {
    notFound();
  }

  // Create mock session for preview
  const mockSession = {
    id: 'preview',
    created_at: new Date().toISOString(),
    project_id: project.id,
    conversation_id: null,
    conversation_url: null,
    status: 'pending' as const,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    completed_at: null,
    duration_seconds: null,
    prospect_name: null,
    prospect_email: null,
    prospect_company: null,
    referrer: null,
    metadata: {},
    transcript: null,
    analysis_data: null,
    report_sent_at: null,
    report_recipient: null,
  };

  return <BrandedDemoViewer session={mockSession} project={project} />;
}
