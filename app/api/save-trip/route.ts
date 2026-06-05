import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { destination, startDate, endDate, budget, interests, itinerary } = body;

    const newTrip = await prisma.trip.create({
      data: {
        userId: clerkUser.id,
        destination,
        startDate,
        endDate,
        budget: Number(budget),
        interests: JSON.stringify(interests),
        itinerary: JSON.stringify(itinerary),
      },
    });

    return NextResponse.json({ success: true, trip: newTrip });
  } catch (error) {
    console.error("save-trip error:", error);
    return NextResponse.json({ error: "Failed to save trip" }, { status: 500 });
  }
}