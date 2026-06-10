import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { parseJsonBody } from "@/lib/validate";
import { saveTripBodySchema } from "@/lib/schemas/api";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-error";

export async function POST(req: NextRequest) {
  try {
    const authResult = await requireAuth();
    if ("error" in authResult) {
      return authResult.error;
    }

    const { destination, startDate, endDate, budget, interests, itinerary } =
      await parseJsonBody(req, saveTripBodySchema);

    const newTrip = await prisma.trip.create({
      data: {
        userId: authResult.userId,
        destination,
        startDate,
        endDate,
        budget: String(budget),
        interests: JSON.stringify(interests),
        itinerary: JSON.stringify(itinerary),
      },
    });

    return apiSuccess({ success: true, trip: newTrip });
  } catch (error) {
    return handleApiError(error);
  }
}
