import { redirect } from 'next/navigation';
import { auth, staffAuthConfigured } from '@/lib/staff/auth';
import { isStaff } from '@/lib/staff/owner';
import { loadStaffSnapshot } from '@/lib/staff/data';
import StaffDashboard from '@/components/staff/StaffDashboard';
export default async function StaffPage() {
  const session = await auth();
  if (!staffAuthConfigured() || !isStaff(session) || !session?.user) redirect('/staff/login');
  const viewer = { name: session.user.name || 'Staff', role: session.user.role };
  try { return <StaffDashboard initial={await loadStaffSnapshot()} viewer={viewer} />; }
  catch { return <StaffDashboard initial={null} viewer={viewer} />; }
}
