import { redirect } from 'next/navigation';
import { auth } from '@/lib/staff/auth';
import { isOwner } from '@/lib/staff/owner';
import AccessManager from '@/components/staff/AccessManager';
export default async function UsersPage() { if (!isOwner(await auth())) redirect('/staff/login'); return <AccessManager />; }
