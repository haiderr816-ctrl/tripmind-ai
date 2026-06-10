import { checkIsAdmin } from "@/lib/auth";
import { DashboardShell } from "./DashboardShell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await checkIsAdmin();

  return <DashboardShell isAdmin={isAdmin}>{children}</DashboardShell>;
}
