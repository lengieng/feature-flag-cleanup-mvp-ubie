import { Flag } from '@prisma/client';
import { differenceInDays } from 'date-fns';

export interface ExpirationRule {
  name: string;
  check: (flag: Flag) => boolean;
  reason: (flag: Flag) => string;
}

export const EXPIRATION_RULES: ExpirationRule[] = [
  {
    name: 'Fully rolled out and inactive for 30+ days',
    check: (flag) => {
      // Must be 100% rolled out
      if (flag.rolloutPercent !== 100) return false;

      // Must have a last evaluation date
      if (!flag.lastEvaluatedAt) return false;

      // Must not have been evaluated in 30+ days
      const daysSinceEval = differenceInDays(new Date(), flag.lastEvaluatedAt);
      return daysSinceEval > 30;
    },
    reason: (flag) => {
      const days = differenceInDays(new Date(), flag.lastEvaluatedAt!);
      return `Flag is 100% enabled and hasn't been evaluated in ${days} days (threshold: 30 days)`;
    },
  },
];

export function isExpired(flag: Flag): { expired: boolean; reason?: string } {
  for (const rule of EXPIRATION_RULES) {
    if (rule.check(flag)) {
      return { expired: true, reason: rule.reason(flag) };
    }
  }
  return { expired: false };
}

export function analyzeFlag(flag: Flag) {
  const { expired, reason } = isExpired(flag);

  return {
    expired,
    reason,
    ageInDays: differenceInDays(new Date(), flag.createdAt),
    daysSinceEval: flag.lastEvaluatedAt
      ? differenceInDays(new Date(), flag.lastEvaluatedAt)
      : null,
  };
}
