import { redirect } from 'next/navigation';
import { auth, staffAuthConfigured } from '@/lib/staff/auth';
import { isOwner, isStaff } from '@/lib/staff/owner';
import { loadStaffSnapshot } from '@/lib/staff/data';
import StaffDashboard from '@/components/staff/StaffDashboard';
export default async function StaffPage({ searchParams }: { searchParams: { view?: string } }) {
  const session = await auth();
  if (!staffAuthConfigured() || !isStaff(session) || !session?.user) redirect('/staff/login');
  if (isOwner(session) && searchParams.view !== 'home-care') redirect('/staff/campaign');
  const viewer = { name: session.user.name || 'Staff', role: session.user.role };
  try { return <StaffDashboard initial={await loadStaffSnapshot()} viewer={viewer} />; }
  catch { return <StaffDashboard initial={null} viewer={viewer} />; }
}
