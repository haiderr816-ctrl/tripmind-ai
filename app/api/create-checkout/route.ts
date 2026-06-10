import { NextRequest } from "next/server";
import Stripe from "stripe";
import { parseJsonBody } from "@/lib/validate";
import { checkoutBodySchema } from "@/lib/schemas/api";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-error";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const rateLimitResponse = applyRateLimit(req, "checkout", RATE_LIMITS.checkout);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const { email } = await parseJsonBody(req, checkoutBodySchema);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "TripMind AI Pro",
              description:
                "Unlimited AI itineraries, PDF exports, priority support",
            },
            unit_amount: 300,
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://tripmind-ai-kappa.vercel.app"}/dashboard?subscribed=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://tripmind-ai-kappa.vercel.app"}/pricing`,
    });

    return apiSuccess({ url: session.url });
  } catch (error) {
    return handleApiError(error);
  }
}
