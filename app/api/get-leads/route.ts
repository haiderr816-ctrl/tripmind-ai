import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { apiSuccess } from "@/lib/api-response";
import { handleApiError } from "@/lib/api-error";

export async function GET() {
  try {
    const adminResult = await requireAdmin();
    if ("error" in adminResult) {
      return adminResult.error;
    }

    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });

    return apiSuccess({ leads });
  } catch (error) {
    return handleApiError(error);
  }
}
