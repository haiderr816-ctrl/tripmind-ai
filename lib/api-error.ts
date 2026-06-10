import { ZodError } from "zod";
import { apiError, badRequest } from "@/lib/api-response";

export class ApiError extends Error {
  constructor(
    message: string,
    public status = 500,
    public details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function handleApiError(error: unknown) {
  console.error("API error:", error);

  if (error instanceof ApiError) {
    return apiError(error.message, error.status, error.details);
  }

  if (error instanceof ZodError) {
    return badRequest("Validation failed", error.flatten());
  }

  if (error instanceof Error) {
    return apiError(error.message, 500);
  }

  return apiError("Internal server error", 500);
}
