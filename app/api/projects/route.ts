import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET() {
  try {
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

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return NextResponse.json({ error: 'Failed to get projects' }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Failed to get projects:', error);
    return NextResponse.json({ error: 'Failed to get projects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    
    if (!body.name || !body.persona_id || !body.replica_id) {
      return NextResponse.json(
        { error: 'Name, persona_id, and replica_id are required' },
        { status: 400 }
      );
    }

    const { data, error} = await supabase
      .from('projects')
      .insert({
        name: body.name,
        description: body.description || null,
        partner: body.partner || null,
        persona_id: body.persona_id,
        replica_id: body.replica_id,
        custom_greeting: body.custom_greeting || null,
        conversational_context: body.conversational_context || null,
        branding: body.branding || null,
        welcome_title: body.welcome_title || null,
        welcome_message: body.welcome_message || null,
        instructions: body.instructions || null,
        brand_logo_url: body.brand_logo_url || null,
        brand_name: body.brand_name || null,
        brand_primary_color: body.brand_primary_color || '#ffffff',
        brand_background_color: body.brand_background_color || '#0a0a0a',
        cta_text: body.cta_text || null,
        cta_url: body.cta_url || null,
        session_duration_hours: body.session_duration_hours || 24,
        show_narrator_branding: body.show_narrator_branding ?? true,
        status: 'draft',
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating project:', error);
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Failed to create project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
