import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseJsonBody } from "@/lib/validate";
import { saveLeadBodySchema } from "@/lib/schemas/api";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-error";

export async function POST(req: NextRequest) {
  try {
    const body = await parseJsonBody(req, saveLeadBodySchema);
    const {
      name,
      email,
      phone,
      destination,
      dates,
      startDate,
      endDate,
      travelers,
      budget,
      interests,
    } = body;

    const resolvedDates =
      dates ||
      (startDate && endDate ? `${startDate} to ${endDate}` : startDate || "");

    await prisma.lead.upsert({
      where: { email },
      update: {
        name: name || undefined,
        phone: phone || undefined,
        destination: destination || undefined,
        dates: resolvedDates || undefined,
        travelers: travelers || undefined,
        budget: budget || undefined,
        interests: interests || undefined,
        updatedAt: new Date(),
      },
      create: {
        email,
        name: name || "",
        phone: phone || "",
        destination: destination || "",
        dates: resolvedDates || "",
        travelers: travelers || "",
        budget: budget || "",
        interests: interests || "",
      },
    });

    return apiSuccess({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
