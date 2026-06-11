import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import {
  findUserIdByStripeCustomerId,
  syncUserPlanTier,
  upsertSubscriptionFromStripe,
} from "@/lib/db/subscription";
import {
  constructWebhookEvent,
  getStripe,
  getStripeCustomerId,
} from "@/lib/stripe";
import { apiError } from "@/lib/api-response";

export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return apiError("Missing Stripe signature", 400);
  }

  let event: Stripe.Event;

  try {
    const payload = await req.text();
    event = constructWebhookEvent(payload, signature);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);
    return apiError("Invalid Stripe signature", 400);
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook handler error:", error);
    return apiError("Webhook handler failed", 500);
  }
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const userId = session.client_reference_id;
  if (!userId) {
    throw new Error("Checkout session is missing client_reference_id");
  }

  const stripeCustomerId = getStripeCustomerId(session.customer);
  if (stripeCustomerId) {
    await prisma.user.update({
      where: { id: userId },
      data: { stripeCustomerId },
    });
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription?.id;

  if (!subscriptionId) {
    throw new Error("Checkout session is missing subscription");
  }

  const subscription = await getStripe().subscriptions.retrieve(subscriptionId);
  await upsertSubscriptionFromStripe(userId, subscription);
  await syncUserPlanTier(userId);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = await resolveUserIdForSubscription(subscription);
  if (!userId) {
    throw new Error(
      `No user found for subscription ${subscription.id} (customer ${subscription.customer})`
    );
  }

  await upsertSubscriptionFromStripe(userId, subscription);
  await syncUserPlanTier(userId);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = await resolveUserIdForSubscription(subscription);
  if (!userId) {
    throw new Error(
      `No user found for deleted subscription ${subscription.id} (customer ${subscription.customer})`
    );
  }

  await upsertSubscriptionFromStripe(userId, subscription);
  await syncUserPlanTier(userId);
}

async function resolveUserIdForSubscription(
  subscription: Stripe.Subscription
): Promise<string | null> {
  const existing = await prisma.subscription.findUnique({
    where: { stripeSubscriptionId: subscription.id },
    select: { userId: true },
  });
  if (existing) {
    return existing.userId;
  }

  const stripeCustomerId = getStripeCustomerId(subscription.customer);
  if (!stripeCustomerId) {
    return null;
  }

  return findUserIdByStripeCustomerId(stripeCustomerId);
}
