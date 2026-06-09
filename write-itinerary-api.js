const fs = require('fs');
const path = require('path');

const content = `import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

async function getCountryInfo(destination: string) {
  try {
    const country = destination.split(',').pop()?.trim() || destination;
    const res = await fetch(\`https://restcountries.com/v3.1/search?name=\${encodeURIComponent(country)}\`);
    if (!res.ok) return null;
    const data = await res.json();
    const c = data[0];
    return {
      currency: Object.values(c.currencies || {})[0] as any,
      language: Object.values(c.languages || {})[0],
      capital: c.capital?.[0],
      timezone: c.timezones?.[0],
      flag: c.flag,
    };
  } catch { return null; }
}

async function getWeather(destination: string, startDate: string) {
  try {
    const geoRes = await fetch(\`https://geocoding-api.open-meteo.com/v1/search?name=\${encodeURIComponent(destination)}&count=1\`);
    const geoData = await geoRes.json();
    const loc = geoData.results?.[0];
    if (!loc) return null;
    const res = await fetch(
      \`https://api.open-meteo.com/v1/forecast?latitude=\${loc.latitude}&longitude=\${loc.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&start_date=\${startDate}&end_date=\${startDate}\`
    );
    const data = await res.json();
    const temp_max = data.daily?.temperature_2m_max?.[0];
    const temp_min = data.daily?.temperature_2m_min?.[0];
    const rain = data.daily?.precipitation_probability_max?.[0];
    if (temp_max == null) return null;
    return {
      tempMax: Math.round(temp_max),
      tempMin: Math.round(temp_min),
      rainChance: rain,
      summary: \`\${Math.round(temp_min)}°C – \${Math.round(temp_max)}°C, \${rain}% chance of rain\`,
    };
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { destination, startDate, endDate, budget, interests } = await req.json();
    if (!destination || !startDate || !endDate) {
      return NextResponse.json({ error: 'Destination, start date and end date are required' }, { status: 400 });
    }

    const [weather, countryInfo] = await Promise.all([
      getWeather(destination, startDate),
      getCountryInfo(destination),
    ]);

    const weatherContext = weather ? \`Weather forecast: \${weather.summary}\` : '';
    const countryContext = countryInfo
      ? \`Currency: \${(countryInfo.currency as any)?.name || ''} (\${(countryInfo.currency as any)?.symbol || ''}), Language: \${countryInfo.language}\`
      : '';

    const prompt = \`You are an expert travel planner and budget advisor. Create a detailed, realistic day-by-day itinerary with complete cost estimates for everything a traveler needs.

Trip Details:
- Destination: \${destination}
- Start Date: \${startDate}
- End Date: \${endDate}
- Budget Level: \${budget}
- Interests: \${interests || 'general sightseeing'}
\${weatherContext}
\${countryContext}

Be very specific with costs. Include local currency. Think like a real travel agent.

Return ONLY a valid JSON object, no markdown, no extra text:
{
  "destination": "string",
  "startDate": "string",
  "endDate": "string",
  "budget": "string",
  "summary": "2-3 sentence overview mentioning weather and culture",
  "weather": { "summary": "string", "tempMax": number, "tempMin": number, "rainChance": number },
  "countryInfo": { "currency": "string", "language": "string", "capital": "string", "timezone": "string", "flag": "string" },
  "flightEstimate": {
    "from": "Major nearby hub airport",
    "to": "Destination airport",
    "estimatedCost": "e.g. $400 - $800 return",
    "recommendedAirlines": ["airline1", "airline2"],
    "estimatedFlightTime": "e.g. 8 hours",
    "bestBookingTip": "Book 6-8 weeks in advance for best prices",
    "bookingLinks": ["https://www.skyscanner.com", "https://www.kayak.com", "https://www.google.com/flights"]
  },
  "budgetBreakdown": {
    "flights": "e.g. $600",
    "accommodation": "e.g. $560 total (7 nights x $80/night)",
    "food": "e.g. $350 total ($50/day)",
    "localTransport": "e.g. $100 (metro, buses, taxis)",
    "activities": "e.g. $200 (museums, tours, entry fees)",
    "miscellaneous": "e.g. $100 (souvenirs, tips, emergency)",
    "total": "e.g. $1,910 total estimated"
  },
  "days": [
    {
      "day": 1,
      "date": "string",
      "title": "string",
      "cityOrArea": "string",
      "schedule": [
        {
          "time": "9:00 AM",
          "activity": "string",
          "description": "string",
          "cost": "e.g. $15 per person",
          "type": "food|activity|transport|accommodation"
        }
      ],
      "accommodation": {
        "name": "string",
        "type": "e.g. 3-star hotel / hostel / airbnb",
        "estimatedCost": "e.g. $80 per night",
        "bookingTip": "Book on Booking.com or Airbnb for best rates"
      },
      "foodEstimate": {
        "breakfast": "e.g. $8 at local cafe",
        "lunch": "e.g. $15 at restaurant",
        "dinner": "e.g. $25 at recommended restaurant",
        "totalDay": "e.g. $48"
      },
      "transportForDay": "e.g. Metro day pass $10, or taxi $20",
      "tips": "string"
    }
  ],
  "totalEstimatedCost": "string",
  "packingTips": ["string"],
  "bestTimeToVisit": "string",
  "moneyTips": ["e.g. Use a travel card to avoid currency fees", "Withdraw cash at airport ATM"],
  "emergencyContacts": {
    "police": "string",
    "ambulance": "string",
    "touristHelpline": "string"
  }
}\`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${process.env.GROQ_API_KEY}\`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: 8192
      })
    });

    const data = await res.json();
    if (!res.ok) return NextResponse.json({ error: data.error?.message || 'Groq API failed' }, { status: 500 });

    let text = data.choices?.[0]?.message?.content;
    if (!text) return NextResponse.json({ error: 'No response from Groq' }, { status: 500 });

    text = text.replace(/\`\`\`json\\n?/g, '').replace(/\`\`\`\\n?/g, '').trim();
    const itinerary = JSON.parse(text);

    if (weather) itinerary.weather = weather;
    if (countryInfo) itinerary.countryInfo = countryInfo;

    const trip = await prisma.trip.create({
      data: {
        userId,
        destination,
        startDate,
        endDate,
        budget: budget || 'Medium',
        interests: interests || '',
        itinerary: JSON.stringify(itinerary),
      }
    });

    return NextResponse.json({ tripId: trip.id, itinerary });

  } catch (error: any) {
    console.error('Itinerary generation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate itinerary' }, { status: 500 });
  }
}
`;

const dir = path.join(process.cwd(), 'app', 'api', 'itinerary');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'route.ts'), content);
console.log('✅ app/api/itinerary/route.ts written');