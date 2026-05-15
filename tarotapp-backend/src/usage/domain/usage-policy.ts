import { DomainError } from '../../shared/domain/domain-error';
import { SpreadType } from '../../tarot/domain/tarot.enums';
import { Tier } from './tier.enum';

type UsageLimit = number | 'unlimited';

const LIMITS: Record<Tier, Record<SpreadType, UsageLimit>> = {
  [Tier.FREE]: {
    [SpreadType.CIRCULAR]: 2,
    [SpreadType.RAPID]: 2,
    [SpreadType.CELTIC]: 0,
  },
  [Tier.BASIC]: {
    [SpreadType.CIRCULAR]: 10,
    [SpreadType.RAPID]: 10,
    [SpreadType.CELTIC]: 5,
  },
  [Tier.PRO]: {
    [SpreadType.CIRCULAR]: 'unlimited',
    [SpreadType.RAPID]: 'unlimited',
    [SpreadType.CELTIC]: 'unlimited',
  },
};

export interface UsageCheck {
  allowed: boolean;
  tier: Tier;
  spreadType: SpreadType;
  used: number;
  limit: UsageLimit;
  remaining: number | 'unlimited';
}

export function checkUsagePolicy(
  tier: Tier,
  spreadType: SpreadType,
  used: number,
): UsageCheck {
  const limit = LIMITS[tier]?.[spreadType];

  if (limit === undefined) {
    throw new DomainError('Unsupported usage policy');
  }

  if (limit === 'unlimited') {
    return {
      allowed: true,
      tier,
      spreadType,
      used,
      limit,
      remaining: 'unlimited',
    };
  }

  const remaining = Math.max(limit - used, 0);
  return {
    allowed: used < limit,
    tier,
    spreadType,
    used,
    limit,
    remaining,
  };
}
