import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, destination, dates, startDate, endDate, travelers, budget, interests } = body;
const resolvedDates = dates || (startDate && endDate ? `${startDate} to ${endDate}` : startDate || '');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    await prisma.lead.upsert({
      where: { email },
      update: {
        name: name || undefined,
        phone: phone || undefined,
        destination: destination || undefined,
        dates: dates || undefined,
        travelers: travelers || undefined,
        budget: budget || undefined,
        interests: interests || undefined,
        updatedAt: new Date(),
      },
      create: {
        email,
        name: name || '',
        phone: phone || '',
        destination: destination || '',
        dates: dates || '',
        travelers: travelers || '',
        budget: budget || '',
        interests: interests || '',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Save lead error:', error);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}