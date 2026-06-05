import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destination, startDate, endDate, budget, interests } = body;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysCount = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const activities = [
      "Visit historic landmarks",
      "Explore local markets",
      "Try authentic cuisine",
      "Nature walk in scenic parks",
      "Museum and art galleries",
      "Sunset cruise or boat tour",
      "Cultural performance",
      "Shopping at boutiques",
      "Day trip to nearby attractions",
      "Relax at a spa or beach",
    ];

    const hotelOptions = ["Luxury resort", "Boutique hotel", "Budget-friendly inn"];

    const days = [];
    for (let i = 1; i <= daysCount; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + (i - 1));
      const dateStr = date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
      const shuffled = [...activities].sort(() => 0.5 - Math.random());

      days.push({
        day: i,
        date: dateStr,
        summary: `Day ${i}: Discover ${destination} highlights`,
        schedule: [
          { time: "09:00 AM", activity: shuffled[0], location: "City center" },
          { time: "12:30 PM", activity: "Lunch at local restaurant", location: "Local restaurant" },
          { time: "02:00 PM", activity: shuffled[1], location: "Cultural district" },
          { time: "07:00 PM", activity: "Dinner at fine dining restaurant", location: "Downtown area" },
          { time: "09:00 PM", activity: shuffled[2], location: "Nightlife hub" },
        ],
        accommodation: hotelOptions[Math.floor(Math.random() * hotelOptions.length)],
        tips: ["Book tickets in advance", "Use local transport", "Carry a water bottle"],
      });
    }

    const itinerary = {
      destination,
      startDate,
      endDate,
      totalDays: daysCount,
      interests,
      summary: `Your ${daysCount}-day adventure in ${destination} blends culture, food, and fun.`,
      days,
      practicalTips: [
        "Check local weather before packing",
        "Learn basic phrases in the local language",
        "Keep digital copies of important documents",
        "Download offline maps",
      ],
    };

    return NextResponse.json({ success: true, data: itinerary });
  } catch (error) {
    console.error("Error generating itinerary:", error);
    return NextResponse.json({ success: false, error: "Failed to generate itinerary" }, { status: 500 });
  }
}