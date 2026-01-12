import { redirect } from 'next/navigation';
import { isAuthenticatedAdmin } from '@/lib/auth';
import { EnhancedDashboardClient } from './enhanced-dashboard-client';

export default async function DashboardPage() {
  const isAdmin = await isAuthenticatedAdmin();

  if (!isAdmin) {
    redirect('/team/login');
  }

  return <EnhancedDashboardClient />;
}







