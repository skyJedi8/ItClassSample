import { redirect } from 'next/navigation';
import { auth } from '@/lib/staff/auth';
import { isStaff } from '@/lib/staff/owner';
import ChangePassword from '@/components/staff/ChangePassword';
export default async function AccountPage() { if (!isStaff(await auth())) redirect('/staff/login'); return <ChangePassword />; }
