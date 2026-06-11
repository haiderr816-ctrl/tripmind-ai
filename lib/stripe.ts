import Stripe from "stripe";
import { PlanTier, SubscriptionStatus } from "@prisma/client";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeClient = new Stripe(secretKey);
  }
  return stripeClient;
}

export function getStripeWebhookSecret(): string {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }
  return secret;
}

export function getProPriceId(): string {
  const priceId = process.env.STRIPE_PRICE_ID_PRO;
  if (!priceId) {
    throw new Error("STRIPE_PRICE_ID_PRO is not configured");
  }
  return priceId;
}

export function constructWebhookEvent(
  payload: string,
  signature: string
): Stripe.Event {
  return getStripe().webhooks.constructEvent(
    payload,
    signature,
    getStripeWebhookSecret()
  );
}

const ACTIVE_SUBSCRIPTION_STATUSES: SubscriptionStatus[] = [
  SubscriptionStatus.ACTIVE,
  SubscriptionStatus.TRIALING,
];

export function mapStripeSubscriptionStatus(
  status: Stripe.Subscription.Status
): SubscriptionStatus {
  switch (status) {
    case "active":
      return SubscriptionStatus.ACTIVE;
    case "trialing":
      return SubscriptionStatus.TRIALING;
    case "past_due":
      return SubscriptionStatus.PAST_DUE;
    case "canceled":
      return SubscriptionStatus.CANCELED;
    case "incomplete":
      return SubscriptionStatus.INCOMPLETE;
    case "unpaid":
      return SubscriptionStatus.UNPAID;
    default:
      return SubscriptionStatus.INCOMPLETE;
  }
}

export function planTierFromSubscriptionStatus(
  status: SubscriptionStatus
): PlanTier {
  return ACTIVE_SUBSCRIPTION_STATUSES.includes(status)
    ? PlanTier.PRO
    : PlanTier.FREE;
}

export function getSubscriptionPeriod(subscription: Stripe.Subscription): {
  start: Date;
  end: Date;
} {
  const item = subscription.items.data[0];
  const startSeconds =
    item?.current_period_start ??
    (subscription as Stripe.Subscription & { current_period_start?: number })
      .current_period_start;
  const endSeconds =
    item?.current_period_end ??
    (subscription as Stripe.Subscription & { current_period_end?: number })
      .current_period_end;

  if (!startSeconds || !endSeconds) {
    throw new Error(
      `Subscription ${subscription.id} is missing billing period dates`
    );
  }

  return {
    start: new Date(startSeconds * 1000),
    end: new Date(endSeconds * 1000),
  };
}

export function getStripeCustomerId(
  customer: string | Stripe.Customer | Stripe.DeletedCustomer | null
): string | null {
  if (!customer || typeof customer === "string") {
    return customer;
  }
  if ("deleted" in customer && customer.deleted) {
    return null;
  }
  return customer.id;
}
