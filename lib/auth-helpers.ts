/**
 * Authentication helpers for API routes
 * Supports both Supabase auth and cookie-based admin auth
 */

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();

  // Check for admin session cookie first
  const adminSessionCookie = cookieStore.get('admin_session');
  if (adminSessionCookie) {
    try {
      const sessionData = JSON.parse(adminSessionCookie.value);
      if (sessionData.expiresAt && Date.now() < sessionData.expiresAt) {
        return {
          type: 'admin' as const,
          email: sessionData.email,
          id: 'admin-' + sessionData.email,
        };
      }
    } catch {
      // Invalid admin session, continue to check Supabase
    }
  }

  // Check Supabase auth if configured
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
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
    if (user) {
      return {
        type: 'supabase' as const,
        email: user.email || '',
        id: user.id,
      };
    }
  }

  return null;
}

export async function requireAuth() {
  const user = await getAuthenticatedUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}
