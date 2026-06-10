import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { parseSearchParams } from "@/lib/validate";
import { tripIdQuerySchema } from "@/lib/schemas/api";
import { apiSuccess, notFound } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-error";

export async function GET(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) {
      return authResult.error;
    }

    const { id } = parseSearchParams(new URL(req.url), tripIdQuerySchema);

    const trip = await prisma.trip.findFirst({
      where: { id, userId: authResult.userId },
    });

    if (!trip) {
      return notFound("Trip not found");
    }

    return apiSuccess({ trip });
  } catch (error) {
    return handleApiError(error);
  }
}
