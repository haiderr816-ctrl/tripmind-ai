import { NextRequest } from "next/server";
import { ZodError } from "zod";
import { photoQuerySchema } from "@/lib/schemas/api";
import { apiSuccess } from "@/lib/api-response";
import { applyRateLimit, RATE_LIMITS } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const rateLimitResponse = applyRateLimit(req, "photo", RATE_LIMITS.photo);
  if (rateLimitResponse) return rateLimitResponse;

  const query = req.nextUrl.searchParams.get("query");

  if (!query) {
    return apiSuccess({ url: null });
  }

  try {
    photoQuerySchema.parse({ query });

    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY || "",
        },
      }
    );

    if (!res.ok) {
      console.error("Pexels error:", res.status, await res.text());
      return apiSuccess({ url: null });
    }

    const data = await res.json();
    const photo = data.photos?.[0]?.src?.large || null;
    return apiSuccess({ url: photo });
  } catch (error) {
    if (error instanceof ZodError) {
      return apiSuccess({ url: null });
    }
    console.error("Photo fetch error:", error);
    return apiSuccess({ url: null });
  }
}
