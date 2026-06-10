import { auth, currentUser } from "@clerk/nextjs/server";
import { forbidden, unauthorized } from "@/lib/api-response";

export function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL ?? "";
}

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    return { error: unauthorized() } as const;
  }
  return { userId } as const;
}

export async function checkIsAdmin(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const adminEmail = getAdminEmail();
  if (!adminEmail) return false;

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  return !!email && email === adminEmail;
}

export async function requireAdmin() {
  const authResult = await requireAuth();
  if ("error" in authResult) {
    return authResult;
  }

  const isAdmin = await checkIsAdmin();
  if (!isAdmin) {
    const adminEmail = getAdminEmail();
    if (!adminEmail) {
      console.error("ADMIN_EMAIL is not configured");
      return { error: forbidden("Admin access is not configured") } as const;
    }
    return { error: forbidden() } as const;
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? "";

  return { userId: authResult.userId, user, email } as const;
}
