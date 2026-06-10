import { NextResponse } from "next/server";

export function apiSuccess<T extends Record<string, unknown>>(
  data: T,
  status = 200
) {
  return NextResponse.json(data, { status });
}

export function apiError(
  message: string,
  status = 500,
  details?: unknown
) {
  return NextResponse.json(
    {
      error: message,
      ...(details !== undefined ? { details } : {}),
    },
    { status }
  );
}

export function unauthorized(message = "Unauthorized") {
  return apiError(message, 401);
}

export function forbidden(message = "Forbidden") {
  return apiError(message, 403);
}

export function badRequest(message: string, details?: unknown) {
  return apiError(message, 400, details);
}

export function notFound(message = "Not found") {
  return apiError(message, 404);
}

export function rateLimited(retryAfter?: number) {
  const headers =
    retryAfter !== undefined
      ? { "Retry-After": String(retryAfter) }
      : undefined;
  return NextResponse.json(
    { error: "Too many requests" },
    { status: 429, headers }
  );
}
