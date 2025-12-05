import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Skip if Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    // For public routes, just continue
    if (!request.nextUrl.pathname.startsWith('/team/dashboard') &&
        !request.nextUrl.pathname.startsWith('/demo/preview')) {
      return NextResponse.next({ request });
    }

    // For protected routes without Supabase, check for admin session cookie
    if (request.nextUrl.pathname.startsWith('/team/dashboard')) {
      const adminSessionCookie = request.cookies.get('admin_session');
      let hasAdminSession = false;

      if (adminSessionCookie) {
        try {
          const sessionData = JSON.parse(adminSessionCookie.value);
          if (sessionData.expiresAt && Date.now() < sessionData.expiresAt) {
            hasAdminSession = true;
          }
        } catch {
          hasAdminSession = false;
        }
      }

      // Redirect to login if no valid admin session
      if (!hasAdminSession) {
        const url = request.nextUrl.clone();
        url.pathname = '/team/login';
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Check for admin session cookie (cookie-based auth)
  const adminSessionCookie = request.cookies.get('admin_session');
  let hasAdminSession = false;

  if (adminSessionCookie) {
    try {
      const sessionData = JSON.parse(adminSessionCookie.value);
      // Check if session is not expired
      if (sessionData.expiresAt && Date.now() < sessionData.expiresAt) {
        hasAdminSession = true;
      }
    } catch {
      // Invalid session cookie
      hasAdminSession = false;
    }
  }

  // Protected routes - redirect to login if not authenticated
  // Allow access if either Supabase user OR admin session exists
  if (
    !user &&
    !hasAdminSession &&
    request.nextUrl.pathname.startsWith('/team') &&
    !request.nextUrl.pathname.startsWith('/team/login')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/team/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
