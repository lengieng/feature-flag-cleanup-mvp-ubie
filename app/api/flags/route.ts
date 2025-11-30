import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const flags = await prisma.flag.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        cleanupJobs: {
          orderBy: { triggeredAt: 'desc' },
          take: 1,
        },
      },
    });

    return NextResponse.json(flags);
  } catch (error) {
    console.error('Failed to fetch flags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch flags' },
      { status: 500 }
    );
  }
}
