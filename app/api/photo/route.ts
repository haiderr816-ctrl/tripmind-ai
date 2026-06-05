import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('query');

  if (!query) {
    return NextResponse.json({ url: null });
  }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=3&orientation=landscape`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY || ''
        }
      }
    );

    if (!res.ok) {
      console.error('Pexels error:', res.status, await res.text());
      return NextResponse.json({ url: null });
    }

    const data = await res.json();
    const photo = data.photos?.[0]?.src?.large || null;
    return NextResponse.json({ url: photo });

  } catch (error) {
    console.error('Photo fetch error:', error);
    return NextResponse.json({ url: null });
  }
}