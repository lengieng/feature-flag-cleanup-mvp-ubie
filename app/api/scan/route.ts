import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { isExpired } from '@/lib/cleanup-rules';
import { Flag, FlagStatus } from '@prisma/client';
import { redirect } from 'next/navigation';

export async function POST() {
  try {
    console.log('🔍 Starting cleanup scan...');

    // Get all active or already-expired flags
    const flags = await prisma.flag.findMany({
      where: {
        status: { in: [FlagStatus.ACTIVE, FlagStatus.EXPIRED] },
      },
    });

    console.log(`📊 Scanning ${flags.length} flags...`);

    const expiredFlags: Array<Flag & { reason: string }> = [];

    // Check each flag against expiration rules
    for (const flag of flags) {
      const { expired, reason } = isExpired(flag);

      if (expired && flag.status !== FlagStatus.EXPIRED) {
        // Update flag status to EXPIRED
        await prisma.flag.update({
          where: { id: flag.id },
          data: { status: FlagStatus.EXPIRED },
        });

        console.log(`  🚨 Flag expired: ${flag.key} - ${reason}`);
        expiredFlags.push({ ...flag, reason: reason ?? '' });
      }
    }

    console.log(`✅ Scan complete: ${expiredFlags.length} expired flags found`);
    console.log(
      JSON.stringify({
        success: true,
        scannedCount: flags.length,
        expiredCount: expiredFlags.length,
        expiredFlags: expiredFlags.map((f) => ({
          id: f.id,
          key: f.key,
          name: f.name,
          reason: f.reason,
        })),
      })
    );
  } catch (error) {
    console.error('❌ Scan failed:', error);
    return NextResponse.json(
      { error: 'Scan failed', details: String(error) },
      { status: 500 }
    );
  }

  // Redirect back to /
  redirect('/');
}
