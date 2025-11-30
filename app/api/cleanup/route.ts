import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { createCleanupIssue } from '@/lib/github';
import { FlagStatus, CleanupStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const { flagId } = await request.json();

    console.log(`🧹 Starting cleanup for flag: ${flagId}`);

    // Get the flag
    const flag = await prisma.flag.findUnique({
      where: { id: flagId },
    });

    if (!flag) {
      return NextResponse.json({ error: 'Flag not found' }, { status: 404 });
    }

    // Check if there's already a pending cleanup
    const existingCleanup = await prisma.cleanupJob.findFirst({
      where: {
        flagId: flag.id,
        status: {
          in: [
            CleanupStatus.PENDING,
            CleanupStatus.ISSUE_CREATED,
            CleanupStatus.IN_PROGRESS,
          ],
        },
      },
    });

    if (existingCleanup) {
      return NextResponse.json(
        {
          error: 'Cleanup already in progress for this flag',
          cleanupJob: existingCleanup,
        },
        { status: 409 }
      );
    }

    // Create GitHub issue
    console.log(`  📝 Creating GitHub issue...`);
    const issue = await createCleanupIssue(flag);

    // Create cleanup job record
    const cleanupJob = await prisma.cleanupJob.create({
      data: {
        flagId: flag.id,
        githubIssueUrl: issue.url,
        githubIssueNumber: issue.number,
        status: CleanupStatus.ISSUE_CREATED,
      },
    });

    // Update flag status
    await prisma.flag.update({
      where: { id: flag.id },
      data: { status: FlagStatus.CLEANUP_PENDING },
    });

    console.log(`✅ Cleanup initiated successfully`);

    return NextResponse.json({
      success: true,
      cleanupJob,
      issue,
    });
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    return NextResponse.json(
      {
        error: 'Cleanup failed',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
