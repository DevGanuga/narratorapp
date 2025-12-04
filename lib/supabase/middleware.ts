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
    // For protected routes without Supabase, redirect to login
    if (request.nextUrl.pathname.startsWith('/team/dashboard')) {
      const url = request.nextUrl.clone();
      url.pathname = '/team/login';
      return NextResponse.redirect(url);
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

  // Protected routes - redirect to login if not authenticated
  if (
    !user &&
    request.nextUrl.pathname.startsWith('/team') &&
    !request.nextUrl.pathname.startsWith('/team/login')
  ) {
    const url = request.nextUrl.clone();
    url.pathname = '/team/login';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
