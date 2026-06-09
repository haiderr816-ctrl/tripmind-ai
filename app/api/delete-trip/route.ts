import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  try {
    await prisma.trip.deleteMany({
      where: { id: String(id), userId },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('delete-trip error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}