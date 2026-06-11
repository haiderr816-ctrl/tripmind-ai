import { NextRequest } from "next/server";
import { requireUser } from "@/lib/auth";
import { parseJsonBody } from "@/lib/validate";
import { checkoutBodySchema } from "@/lib/schemas/api";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-error";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getProPriceId, getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const rateLimitResponse = applyRateLimit(req, "checkout", RATE_LIMITS.checkout);
  if (rateLimitResponse) return rateLimitResponse;

  try {
    const authResult = await requireUser();
    if (!("user" in authResult)) {
      return authResult.error;
    }

    const { user, userId } = authResult;

    await parseJsonBody(req, checkoutBodySchema);

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "https://tripmind-ai-kappa.vercel.app";

    const sessionParams: Parameters<
      ReturnType<typeof getStripe>["checkout"]["sessions"]["create"]
    >[0] = {
      payment_method_types: ["card"],
      mode: "subscription",
      client_reference_id: userId,
      line_items: [
        {
          price: getProPriceId(),
          quantity: 1,
        },
      ],
      success_url: `${appUrl}/dashboard?subscribed=true`,
      cancel_url: `${appUrl}/pricing`,
    };

    if (user.stripeCustomerId) {
      sessionParams.customer = user.stripeCustomerId;
    } else {
      sessionParams.customer_email = user.email;
    }

    const session = await getStripe().checkout.sessions.create(sessionParams);

    return apiSuccess({ url: session.url });
  } catch (error) {
    return handleApiError(error);
  }
}
