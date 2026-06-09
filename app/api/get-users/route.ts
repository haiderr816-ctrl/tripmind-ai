import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';

const ADMIN_EMAIL = 'haiderr816@gmail.com';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const res = await fetch('https://api.clerk.com/v1/users?limit=100&order_by=-created_at', {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      }
    });

    const users = await res.json();
    return NextResponse.json({ users });
  } catch (error: any) {
    console.error('get-users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}