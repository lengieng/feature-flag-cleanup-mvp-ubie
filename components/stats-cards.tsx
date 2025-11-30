import { Flag, FlagStatus } from '@prisma/client';

interface StatsCardsProps {
  flags: Flag[];
}

export function StatsCards({ flags }: StatsCardsProps) {
  const stats = {
    total: flags.length,
    expired: flags.filter((f) => f.status === FlagStatus.EXPIRED).length,
    cleanupPending: flags.filter((f) => f.status === FlagStatus.CLEANUP_PENDING)
      .length,
    cleanedUp: flags.filter((f) => f.status === FlagStatus.CLEANED_UP).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <StatCard title="Total Flags" value={stats.total} color="blue" />
      <StatCard title="Expired" value={stats.expired} color="red" />
      <StatCard
        title="Cleanup Pending"
        value={stats.cleanupPending}
        color="yellow"
      />
      <StatCard title="Cleaned Up" value={stats.cleanedUp} color="green" />
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: 'blue' | 'red' | 'yellow' | 'green';
}) {
  const colorClasses = {
    blue: 'text-blue-400',
    red: 'text-red-400',
    yellow: 'text-yellow-400',
    green: 'text-green-400',
  };

  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="text-gray-400 text-sm font-medium">{title}</div>
      <div className={`text-3xl font-bold mt-2 ${colorClasses[color]}`}>
        {value}
      </div>
    </div>
  );
}
