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
      utm_source,
      utm_medium,
      utm_campaign,
      source,
    } = body;

    const resolvedDates =
      dates ||
      (startDate && endDate ? `${startDate} to ${endDate}` : startDate || "");

    // Build interests object with UTM tracking
    let interestsObj: any = {};
    if (interests) {
      try {
        interestsObj = typeof interests === 'string' ? JSON.parse(interests) : interests;
      } catch {
        interestsObj = { value: interests };
      }
    }

    // Add UTM tracking to interests
    if (utm_source || utm_medium || utm_campaign || source) {
      interestsObj.utm = {
        ...(utm_source && { source: utm_source }),
        ...(utm_medium && { medium: utm_medium }),
        ...(utm_campaign && { campaign: utm_campaign }),
        ...(source && { customSource: source }),
      };
    }

    const interestsString = Object.keys(interestsObj).length > 0 ? JSON.stringify(interestsObj) : interests || "";

    await prisma.lead.upsert({
      where: { email },
      update: {
        name: name || undefined,
        phone: phone || undefined,
        destination: destination || undefined,
        dates: resolvedDates || undefined,
        travelers: travelers || undefined,
        budget: budget || undefined,
        interests: interestsString || undefined,
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
        interests: interestsString || "",
      },
    });

    return apiSuccess({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
