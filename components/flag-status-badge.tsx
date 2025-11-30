import { FlagStatus } from '@prisma/client';

const statusConfig: Record<FlagStatus, { label: string; className: string }> = {
  ACTIVE: {
    label: '✅ Active',
    className: 'bg-green-900/50 text-green-300 border border-green-700',
  },
  EXPIRED: {
    label: '🚨 Expired',
    className: 'bg-red-900/50 text-red-300 border border-red-700',
  },
  CLEANUP_PENDING: {
    label: '🔄 Cleanup Pending',
    className: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
  },
  CLEANUP_IN_PROGRESS: {
    label: '⏳ In Progress',
    className: 'bg-blue-900/50 text-blue-300 border border-blue-700',
  },
  CLEANED_UP: {
    label: '✔️ Cleaned Up',
    className: 'bg-gray-700/50 text-gray-300 border border-gray-600',
  },
};

export function FlagStatusBadge({ status }: { status: FlagStatus }) {
  const config = statusConfig[status];

  return (
    <span
      className={`px-2.5 py-1 text-xs font-semibold rounded-md ${config.className}`}
    >
      {config.label}
    </span>
  );
}
