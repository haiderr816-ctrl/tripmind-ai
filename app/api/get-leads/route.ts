import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ leads });
  } catch (error) {
    console.error('get-leads error:', error);
    return NextResponse.json({ error: 'Failed to get leads' }, { status: 500 });
  }
}