/**
 * Simple admin authentication using environment password
 */

import { cookies } from 'next/headers';

// Admin email allowlist
const ALLOWED_ADMIN_EMAILS = [
  'ari@narrator.studio',
  'devganuga@gmail.com',
  'admin@narrator.studio'
];

const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export async function getUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);

  if (!session) return null;

  try {
    const userData = JSON.parse(session.value);
    // Check if session is expired
    if (Date.now() > userData.expiresAt) {
      return null;
    }
    return { email: userData.email };
  } catch {
    return null;
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getUser();
  return !!user;
}

export async function isAllowedAdmin(email: string): Promise<boolean> {
  return ALLOWED_ADMIN_EMAILS.includes(email.toLowerCase());
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  const user = await getUser();
  if (!user || !user.email) return false;
  return await isAllowedAdmin(user.email);
}

export function verifyPassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD not configured');
  }
  return password === adminPassword;
}

export async function signIn(email: string, password: string) {
  // Check if email is in allowlist
  if (!await isAllowedAdmin(email)) {
    return { success: false, error: 'Access denied. This email is not authorized.' };
  }

  // Verify password
  if (!verifyPassword(password)) {
    return { success: false, error: 'Invalid password.' };
  }

  // Create session
  const sessionData = {
    email,
    expiresAt: Date.now() + SESSION_DURATION
  };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION / 1000,
    path: '/'
  });

  return { success: true, user: { email } };
}

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  return { success: true };
}

export async function getSession() {
  const user = await getUser();
  if (!user) return null;
  return { user };
}
