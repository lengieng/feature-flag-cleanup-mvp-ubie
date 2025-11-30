import { prisma } from '@/lib/db';
import { FlagTable } from '@/components/flag-table';
import { StatsCards } from '@/components/stats-cards';

async function getFlags() {
  return await prisma.flag.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      cleanupJobs: {
        orderBy: { triggeredAt: 'desc' },
        take: 1,
      },
    },
  });
}

export default async function Home() {
  const flags = await getFlags();

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-linear-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Feature Flags Dashboard
            </h1>
            <p className="text-gray-400 mt-2 text-lg">
              Proactive cleanup automation for your feature flags
            </p>
          </div>

          <form action="/api/scan" method="POST">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg hover:shadow-blue-500/50"
            >
              🔍 Run Cleanup Scan
            </button>
          </form>
        </div>

        {/* Stats */}
        <StatsCards flags={flags} />

        {/* Table */}
        <div className="bg-gray-900 rounded-lg shadow-xl overflow-hidden border border-gray-800">
          <div className="px-6 py-4 border-b border-gray-800">
            <h2 className="text-xl font-semibold">All Feature Flags</h2>
            <p className="text-sm text-gray-400 mt-1">
              Showing {flags.length} flag{flags.length !== 1 ? 's' : ''}
            </p>
          </div>
          <FlagTable flags={flags} />
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            Built with Next.js, Prisma, PostgreSQL, and GitHub Copilot
            integration
          </p>
        </div>
      </div>
    </div>
  );
}
