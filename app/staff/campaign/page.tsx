import { redirect } from 'next/navigation';
import { auth } from '@/lib/staff/auth';
import { isOwner } from '@/lib/staff/owner';
import { campaignRequest } from '@/lib/staff/christmas';
import ChristmasCampaign from '@/components/staff/ChristmasCampaign';
export default async function CampaignPage() {
  const session = await auth();
  if (!isOwner(session)) redirect('/staff/login');
  let initial = null;
  try { initial = await campaignRequest({ operation: 'snapshot' }); } catch { /* Show reconnectable state. */ }
  return <ChristmasCampaign initial={initial} />;
}
