import { NextRequest } from "next/server";
import { rateLimited } from "@/lib/api-response";

type RateLimitConfig = {
  limit: number;
  windowMs: number;
};

const store = new Map<string, { count: number; resetAt: number }>();

export function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") ?? "unknown";
}

export function checkRateLimit(key: string, config: RateLimitConfig) {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + config.windowMs });
    return { allowed: true as const };
  }

  if (entry.count >= config.limit) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return { allowed: false as const, retryAfter };
  }

  entry.count += 1;
  return { allowed: true as const };
}

export function applyRateLimit(
  req: NextRequest,
  routeName: string,
  config: RateLimitConfig,
  identifier?: string
) {
  const ip = identifier ?? getClientIp(req);
  const key = `${routeName}:${ip}`;
  const result = checkRateLimit(key, config);

  if (!result.allowed) {
    return rateLimited(result.retryAfter);
  }

  return null;
}

export const RATE_LIMITS = {
  agent: { limit: 30, windowMs: 60_000 },
  itinerary: { limit: 10, windowMs: 60_000 },
  photo: { limit: 60, windowMs: 60_000 },
  checkout: { limit: 10, windowMs: 60_000 },
} as const;
