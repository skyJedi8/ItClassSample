import { redirect } from 'next/navigation';
import { auth, staffAuthConfigured } from '@/lib/staff/auth';
import { isOwner } from '@/lib/staff/owner';
import { loadStaffSnapshot } from '@/lib/staff/data';
import StaffDashboard from '@/components/staff/StaffDashboard';
export default async function StaffPage() {
  if (!staffAuthConfigured() || !isOwner(await auth())) redirect('/staff/login');
  try { return <StaffDashboard initial={await loadStaffSnapshot()} />; }
  catch { return <StaffDashboard initial={null} />; }
}
