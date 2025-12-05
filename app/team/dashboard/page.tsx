import { redirect } from 'next/navigation';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { DashboardClient } from './dashboard-client';

export default async function DashboardPage() {
  const isAdmin = await isAuthenticatedAdmin();

  if (!isAdmin) {
    redirect('/team/login');
  }

  return <DashboardClient />;
}





