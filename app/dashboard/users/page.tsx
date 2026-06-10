import { checkIsAdmin } from '@/lib/auth';
import { UsersPageClient } from './UsersPageClient';

export default async function UsersPage() {
  const isAdmin = await checkIsAdmin();
  return <UsersPageClient isAdmin={isAdmin} />;
}
