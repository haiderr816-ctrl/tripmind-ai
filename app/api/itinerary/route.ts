import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { destination, startDate, endDate, budget, interests } = await req.json();

    if (!destination || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Destination, start date and end date are required' },
        { status: 400 }
      );
    }

    const prompt = `You are an expert travel planner like a professional tour operator. Create a logical, geographically sensible day-by-day travel itinerary.

Trip Details:
- Destination: ${destination}
- Start Date: ${startDate}
- End Date: ${endDate}
- Budget Level: ${budget}
- Interests: ${interests || 'general sightseeing'}

CRITICAL RULES YOU MUST FOLLOW:
1. GEOGRAPHY LOGIC: Plan days in a logical geographic sequence. If visiting multiple cities, cluster nearby places together. Never jump back and forth between distant locations. Travel should flow naturally like a real tour route (e.g. Islamabad → Naran → Skardu → Hunza, not random jumping).
2. CITY FOCUS: Each day must be based in ONE specific city or area. Do not mix activities from different cities in one day unless they are on the travel route that day.
3. SPECIFIC LOCATION NAMES: For "locationPhoto" field, give the most famous and specific landmark or place name for that day's location (e.g. "Hunza Valley Pakistan", "Lahore Fort Pakistan", "Badshahi Mosque Lahore", "Attabad Lake Hunza"). This will be used to search for a photo.
4. ACCOMMODATION: Each day must have a real, specific hotel name appropriate for that city. Never repeat the same hotel across different cities.
5. SCHEDULE: At least 4 activities per day with realistic times and costs in local currency.
6. TRAVEL DAY: If moving between distant cities, mark that as the day's theme (e.g. "Islamabad to Naran — Scenic Drive") and include driving stops as activities.

Return ONLY a valid JSON object in exactly this format, no extra text, no markdown:
{
  "destination": "string",
  "startDate": "string",
  "endDate": "string",
  "budget": "string",
  "summary": "2-3 sentence overview of the trip",
  "days": [
    {
      "day": 1,
      "date": "string",
      "title": "string (e.g. Arrival in Lahore, Lahore to Islamabad Drive, Exploring Hunza Valley)",
      "cityOrArea": "string (the specific city or area for this day, e.g. Lahore, Hunza, Skardu)",
      "locationPhoto": "string (most famous specific landmark or place name for photo search, e.g. Badshahi Mosque Lahore, Hunza Valley Pakistan, Attabad Lake Gilgit)",
      "schedule": [
        {
          "time": "9:00 AM",
          "activity": "string",
          "description": "string",
          "cost": "string"
        }
      ],
      "accommodation": {
        "name": "string (specific real hotel name in that city)",
        "type": "string",
        "estimatedCost": "string"
      },
      "tips": "string"
    }
  ],
  "totalEstimatedCost": "string",
  "packingTips": ["string"],
  "bestTimeToVisit": "string"
}`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 8192
      })
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('Groq API error:', data);
      return NextResponse.json(
        { error: data.error?.message || 'Groq API failed' },
        { status: 500 }
      );
    }

    let text = data.choices?.[0]?.message?.content;

    if (!text) {
      return NextResponse.json({ error: 'No response from Groq' }, { status: 500 });
    }

    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const itinerary = JSON.parse(text);
    return NextResponse.json(itinerary);

  } catch (error: any) {
    console.error('Itinerary generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate itinerary' },
      { status: 500 }
    );
  }
}