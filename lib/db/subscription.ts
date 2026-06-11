import { prisma } from "@/lib/prisma";
import {
  getStripeCustomerId,
  getSubscriptionPeriod,
  mapStripeSubscriptionStatus,
  planTierFromSubscriptionStatus,
} from "@/lib/stripe";
import { PlanTier, SubscriptionStatus } from "@prisma/client";
import type Stripe from "stripe";

const ACTIVE_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
];

export async function upsertSubscriptionFromStripe(
  userId: string,
  subscription: Stripe.Subscription
) {
  const status = mapStripeSubscriptionStatus(subscription.status);
  const { start, end } = getSubscriptionPeriod(subscription);
  const stripeCustomerId = getStripeCustomerId(subscription.customer);

  if (!stripeCustomerId) {
    throw new Error(`Subscription ${subscription.id} has no Stripe customer`);
  }

  const stripePriceId = subscription.items.data[0]?.price?.id ?? null;

  return prisma.subscription.upsert({
    where: { stripeSubscriptionId: subscription.id },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      stripeCustomerId,
      stripePriceId,
      status,
      planTier: planTierFromSubscriptionStatus(status),
      currentPeriodStart: start,
      currentPeriodEnd: end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
    },
    update: {
      userId,
      stripeCustomerId,
      stripePriceId,
      status,
      planTier: planTierFromSubscriptionStatus(status),
      currentPeriodStart: start,
      currentPeriodEnd: end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at * 1000)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end * 1000)
        : null,
    },
  });
}

export async function syncUserPlanTier(userId: string) {
  const activeSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: ACTIVE_SUBSCRIPTION_STATUSES },
    },
    orderBy: { currentPeriodEnd: "desc" },
  });

  await prisma.user.update({
    where: { id: userId },
    data: {
      planTier: activeSubscription ? PlanTier.PRO : PlanTier.FREE,
    },
  });
}

export async function findUserIdByStripeCustomerId(
  stripeCustomerId: string
): Promise<string | null> {
  const user = await prisma.user.findUnique({
    where: { stripeCustomerId },
    select: { id: true },
  });
  return user?.id ?? null;
}
