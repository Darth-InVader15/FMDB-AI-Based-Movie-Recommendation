import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const recommendations = await prisma.recommendation.findMany({
      orderBy: {
        createdAt: 'asc', // Or maintain order via a position field if added
      },
    });

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Failed to fetch recommendations from DB', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
