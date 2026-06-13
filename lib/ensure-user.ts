import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

/**
 * Ensures the current authenticated user exists in the database.
 * This should be called from server components (Node.js runtime) to sync
 * Clerk users with the database. Do NOT call from Edge Runtime (middleware).
 */
export async function ensureUserExists() {
  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    return null;
  }

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    `${clerkUser.id}@users.clerk.local`;

  const now = new Date();

  return prisma.user.upsert({
    where: { id: clerkUser.id },
    create: {
      id: clerkUser.id,
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      lastSeenAt: now,
    },
    update: {
      email,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      imageUrl: clerkUser.imageUrl,
      lastSeenAt: now,
    },
  });
}
