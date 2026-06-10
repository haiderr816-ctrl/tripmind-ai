import { checkIsAdmin } from '@/lib/auth';
import { LeadsPageClient } from './LeadsPageClient';

export default async function LeadsPage() {
  const isAdmin = await checkIsAdmin();
  return <LeadsPageClient isAdmin={isAdmin} />;
}
