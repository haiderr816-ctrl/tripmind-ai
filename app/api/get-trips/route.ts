import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) {
      return authResult.error;
    }

    const trips = await prisma.trip.findMany({
      where: { userId: authResult.userId },
      orderBy: { createdAt: "desc" },
    });

    const parsed = trips.map((trip) => ({
      ...trip,
      interests: trip.interests || "",
      itinerary: (() => {
        try {
          return JSON.parse(trip.itinerary);
        } catch {
          return {};
        }
      })(),
    }));

    return apiSuccess({ trips: parsed });
  } catch (error) {
    return handleApiError(error);
  }
}
