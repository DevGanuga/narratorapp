import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';
import { DashboardClient } from './dashboard-client';

export default async function DashboardPage() {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect('/team/login');
  }

  return <DashboardClient />;
}

