import { prisma } from "@/lib/prisma";
import { PlanTier, UsageAction } from "@prisma/client";
import type { Prisma } from "@prisma/client";

const FREE_ITINERARY_LIMIT = 2;

export function getPeriodKey(date = new Date()): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export async function recordUsage(
  userId: string,
  action: UsageAction,
  metadata?: Prisma.InputJsonValue
) {
  return prisma.usageRecord.create({
    data: {
      userId,
      action,
      periodKey: getPeriodKey(),
      metadata,
    },
  });
}

export async function checkUsageLimit(
  userId: string,
  action: UsageAction
): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { planTier: true },
  });

  if (!user) {
    return false;
  }

  if (user.planTier === PlanTier.PRO) {
    return true;
  }

  if (action === UsageAction.ITINERARY) {
    const count = await prisma.usageRecord.count({
      where: {
        userId,
        action: UsageAction.ITINERARY,
        periodKey: getPeriodKey(),
      },
    });
    return count < FREE_ITINERARY_LIMIT;
  }

  return true;
}
