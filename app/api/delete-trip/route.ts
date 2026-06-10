import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { parseSearchParams } from "@/lib/validate";
import { tripIdQuerySchema } from "@/lib/schemas/api";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-error";

export async function DELETE(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) {
      return authResult.error;
    }

    const { id } = parseSearchParams(new URL(req.url), tripIdQuerySchema);

    await prisma.trip.deleteMany({
      where: { id, userId: authResult.userId },
    });

    return apiSuccess({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
