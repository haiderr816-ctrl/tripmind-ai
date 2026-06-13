import { checkIsAdmin } from "@/lib/auth";
import { DashboardShell } from "./DashboardShell";
import { ensureUserExists } from "@/lib/ensure-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sync user to database on dashboard visit (Node.js runtime)
  await ensureUserExists();
  
  const isAdmin = await checkIsAdmin();

  return <DashboardShell isAdmin={isAdmin}>{children}</DashboardShell>;
}
