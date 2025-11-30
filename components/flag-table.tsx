'use client';

import { formatDistanceToNow } from 'date-fns';
import { FlagStatusBadge } from './flag-status-badge';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { FlagWithCleanup } from '@/lib/types';

export function FlagTable({ flags }: { flags: FlagWithCleanup[] }) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();

  const handleCleanup = async (flagId: string, flagKey: string) => {
    const confirmed = confirm(`Create cleanup issue for flag "${flagKey}"?`);
    if (!confirmed) return;

    setLoading(flagId);

    try {
      const response = await fetch('/api/cleanup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ flagId }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Created issue: ${data.issue.url}`);
        router.refresh();
      } else {
        alert(`❌ Failed: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      alert('❌ Error creating cleanup issue');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-800">
        <thead className="bg-gray-800/50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Flag Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Created
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Rollout
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Last Evaluation
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {flags.map((flag) => (
            <tr
              key={flag.id}
              className="hover:bg-gray-800/30 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="text-sm font-medium text-white">
                  {flag.name}
                </div>
                <div className="text-sm text-gray-400 font-mono">
                  {flag.key}
                </div>
                {flag.description && (
                  <div className="text-xs text-gray-500 mt-1">
                    {flag.description}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {formatDistanceToNow(new Date(flag.createdAt), {
                  addSuffix: true,
                })}
                <div className="text-xs text-gray-500">by {flag.createdBy}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-300 mb-1">
                  {flag.rolloutPercent}%
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${flag.rolloutPercent}%` }}
                  />
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                {flag.lastEvaluatedAt
                  ? formatDistanceToNow(new Date(flag.lastEvaluatedAt), {
                      addSuffix: true,
                    })
                  : 'Never'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <FlagStatusBadge status={flag.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                {flag.status === 'EXPIRED' && (
                  <button
                    onClick={() => handleCleanup(flag.id, flag.key)}
                    disabled={loading === flag.id}
                    className="text-blue-400 hover:text-blue-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading === flag.id
                      ? 'Creating...'
                      : 'Create Cleanup Issue'}
                  </button>
                )}
                {flag.status === 'CLEANUP_PENDING' &&
                  flag.cleanupJobs[0]?.githubIssueUrl && (
                    <a
                      href={flag.cleanupJobs[0].githubIssueUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-400 hover:text-green-300 font-medium inline-flex items-center gap-1"
                    >
                      View Issue
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
