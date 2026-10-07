import type { Metadata } from 'next';
import './staff.css';
export const metadata: Metadata = { title: 'OCF Staff', description: 'Private Operation Clean Freedom staff area.', robots: { index: false, follow: false, noarchive: true }, referrer: 'no-referrer' };
export const dynamic = 'force-dynamic';
export default function StaffLayout({ children }: { children: React.ReactNode }) { return <div className="staff-shell">{children}</div>; }
