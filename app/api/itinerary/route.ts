import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

async function getCountryInfo(country: string) {
  try {
    const res = await fetch(`https://restcountries.com/v3.1/search?name=${encodeURIComponent(country)}`);
    if (!res.ok) return null;
    const data = await res.json();
    const c = data[0];
    return {
      currency: Object.values(c.currencies || {})[0] as any,
      language: Object.values(c.languages || {})[0],
      capital: c.capital?.[0],
      timezone: c.timezones?.[0],
    };
  } catch { return null; }
}

async function getWeather(destination: string, startDate: string) {
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(destination)}&count=1`);
    const geoData = await geoRes.json();
    const loc = geoData.results?.[0];
    if (!loc) return null;
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&start_date=${startDate}&end_date=${startDate}`
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
      summary: `${Math.round(temp_min)}°C – ${Math.round(temp_max)}°C, ${rain}% chance of rain`,
    };
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { destination, country, cities, startDate, endDate, budget, interests } = await req.json();
    if (!destination || !startDate || !endDate) {
      return NextResponse.json({ error: 'Destination, start date and end date are required' }, { status: 400 });
    }

    const filledCities = (cities || []).filter((c: string) => c.trim());
    const isMultiCity = filledCities.length > 1;

    const [weather, countryInfo] = await Promise.all([
      getWeather(filledCities[0] || country || destination, startDate),
      getCountryInfo(country || destination),
    ]);

    const weatherContext = weather ? `Weather forecast at start: ${weather.summary}` : '';
    const countryContext = countryInfo
      ? `Currency: ${(countryInfo.currency as any)?.name || ''} (${(countryInfo.currency as any)?.symbol || ''}), Language: ${countryInfo.language}`
      : '';

    const cityPlanningContext = isMultiCity
      ? `This is a MULTI-CITY trip. Distribute the days across these cities in order: ${filledCities.join(' → ')}. Allocate days proportionally. Each city should have at least 1-2 days. Show the city transition in the schedule.`
      : filledCities.length === 1
      ? `Focus the entire trip on ${filledCities[0]}, ${country}.`
      : `Plan the best highlights across ${country}.`;

    const prompt = `You are an expert travel planner and budget advisor. Create a detailed realistic day-by-day itinerary with complete cost estimates.

Trip Details:
- Destination: ${destination}
- Country: ${country || destination}
- Cities: ${filledCities.length > 0 ? filledCities.join(', ') : 'Best cities in ' + (country || destination)}
- Start Date: ${startDate}
- End Date: ${endDate}
- Budget Level: ${budget}
- Interests: ${interests || 'general sightseeing'}
${weatherContext}
${countryContext}

${cityPlanningContext}

Use local currency in ALL cost estimates. Be very specific and realistic with prices.

Return ONLY a valid JSON object, no markdown, no extra text:
{
  "destination": "${destination}",
  "startDate": "${startDate}",
  "endDate": "${endDate}",
  "budget": "${budget}",
  "summary": "2-3 sentence overview mentioning cities, weather and culture",
  "weather": { "summary": "string", "tempMax": 0, "tempMin": 0, "rainChance": 0 },
  "countryInfo": { "currency": "string", "language": "string", "capital": "string", "timezone": "string" },
  "flightEstimate": {
    "from": "Major international hub",
    "to": "${filledCities[0] || country || destination}",
    "estimatedCost": "string",
    "recommendedAirlines": ["string"],
    "estimatedFlightTime": "string",
    "bestBookingTip": "string",
    "bookingLinks": ["https://www.skyscanner.com", "https://www.kayak.com", "https://www.google.com/flights"]
  },
  "budgetBreakdown": {
    "flights": "string",
    "accommodation": "string",
    "food": "string",
    "localTransport": "string",
    "activities": "string",
    "miscellaneous": "string",
    "total": "string"
  },
  "days": [
    {
      "day": 1,
      "date": "string",
      "title": "string",
      "cityOrArea": "string",
      "schedule": [
        { "time": "9:00 AM", "activity": "string", "description": "string", "cost": "string", "type": "activity" }
      ],
      "accommodation": { "name": "string", "type": "string", "estimatedCost": "string", "bookingTip": "string" },
      "foodEstimate": { "breakfast": "string", "lunch": "string", "dinner": "string", "totalDay": "string" },
      "transportForDay": "string",
      "tips": "string"
    }
  ],
  "totalEstimatedCost": "string",
  "packingTips": ["string"],
  "bestTimeToVisit": "string",
  "moneyTips": ["string"],
  "emergencyContacts": { "police": "string", "ambulance": "string", "touristHelpline": "string" }
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
    if (!res.ok) return NextResponse.json({ error: data.error?.message || 'Groq API failed' }, { status: 500 });

    let text = data.choices?.[0]?.message?.content;
    if (!text) return NextResponse.json({ error: 'No response from Groq' }, { status: 500 });

    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
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