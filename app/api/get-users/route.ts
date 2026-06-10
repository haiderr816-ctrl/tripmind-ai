import { requireAdmin } from "@/lib/auth";
import { apiSuccess } from "@/lib/api-response";
import { ApiError, handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const adminResult = await requireAdmin();
    if ("error" in adminResult) {
      return adminResult.error;
    }

    const res = await fetch(
      "https://api.clerk.com/v1/users?limit=100&order_by=-created_at",
      {
        headers: {
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new ApiError("Failed to fetch users from Clerk", 502);
    }

    const users = await res.json();
    return apiSuccess({ users });
  } catch (error) {
    return handleApiError(error);
  }
}
