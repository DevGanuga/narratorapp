import { redirect } from 'next/navigation';

// Redirect old studio route to team dashboard
export default function StudioPage() {
  redirect('/team/dashboard');
}
