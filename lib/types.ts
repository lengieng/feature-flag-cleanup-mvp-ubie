import { Flag, CleanupJob, FlagStatus, CleanupStatus } from '@prisma/client';

// Extended types with relations
export type FlagWithCleanup = Flag & {
  cleanupJobs: CleanupJob[];
};

// API Response types
export interface ScanResponse {
  success: boolean;
  scannedCount: number;
  expiredCount: number;
  expiredFlags: Array<{
    id: string;
    key: string;
    name: string;
    reason: string;
  }>;
}

export interface CleanupResponse {
  success: boolean;
  cleanupJob: CleanupJob;
  issue: {
    url: string;
    number: number;
  };
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

// Flag analysis types
export interface FlagAnalysis {
  expired: boolean;
  reason?: string;
  ageInDays: number;
  daysSinceEval: number | null;
}

// GitHub types
export interface GitHubIssue {
  url: string;
  number: number;
}

export interface GitHubConfig {
  success: boolean;
  owner: string;
  repo: string;
}

// Re-export Prisma enums for convenience
export { FlagStatus, CleanupStatus };
