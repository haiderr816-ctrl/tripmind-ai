import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const trips = await prisma.trip.findMany({
      where: { userId: clerkUser.id },
      orderBy: { createdAt: 'desc' },
    });

    const parsed = trips.map((trip) => ({
      ...trip,
      interests: trip.interests || '',
      itinerary: (() => { try { return JSON.parse(trip.itinerary); } catch { return {}; } })(),
    }));

    return NextResponse.json({ trips: parsed });
  } catch (error) {
    console.error('get-trips error:', error);
    return NextResponse.json({ error: 'Failed to get trips' }, { status: 500 });
  }
}