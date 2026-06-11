import type { User as ClerkUser } from "@clerk/backend";
import { prisma } from "@/lib/prisma";
import type { Prisma, User } from "@prisma/client";
import { SubscriptionStatus } from "@prisma/client";

const ACTIVE_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
];

export type UserWithPlan = Prisma.UserGetPayload<{
  include: {
    subscriptions: true;
  };
}>;

function getClerkEmail(clerkUser: ClerkUser): string {
  return (
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress ??
    `${clerkUser.id}@users.clerk.local`
  );
}

export async function upsertUser(clerkUser: ClerkUser): Promise<User> {
  const email = getClerkEmail(clerkUser);
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

export async function getUserWithPlan(
  userId: string
): Promise<UserWithPlan | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: {
        where: {
          status: { in: ACTIVE_SUBSCRIPTION_STATUSES },
        },
        orderBy: { currentPeriodEnd: "desc" },
        take: 1,
      },
    },
  });
}
