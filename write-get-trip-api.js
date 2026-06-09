const fs = require('fs');
const path = require('path');

const content = `import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) return NextResponse.json({ error: 'Missing trip id' }, { status: 400 });

  try {
    const trip = await prisma.trip.findFirst({
      where: { id: String(id), userId },
    });

    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

    return NextResponse.json({ trip });
  } catch (err) {
    console.error('get-trip error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
`;

const dir = path.join(process.cwd(), 'app', 'api', 'get-trip');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'route.ts'), content);
console.log('✅ app/api/get-trip/route.ts written');