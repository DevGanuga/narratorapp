import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default async function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check authentication for all team routes except login
  const authenticated = await isAuthenticated();
  
  // This layout wraps all /team routes
  // The login page will handle its own auth state
  
  return <>{children}</>;
}





