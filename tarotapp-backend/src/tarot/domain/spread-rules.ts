import { DomainError } from '../../shared/domain/domain-error';
import { SpreadType } from './tarot.enums';

export interface SpreadRule {
  type: SpreadType;
  requiredCards: number;
  allowedPositions: number[];
  majorArcanaOnly: boolean;
}

export const SPREAD_RULES: Record<SpreadType, SpreadRule> = {
  [SpreadType.CIRCULAR]: {
    type: SpreadType.CIRCULAR,
    requiredCards: 12,
    allowedPositions: Array.from({ length: 12 }, (_, index) => index + 1),
    majorArcanaOnly: false,
  },
  [SpreadType.RAPID]: {
    type: SpreadType.RAPID,
    requiredCards: 6,
    allowedPositions: Array.from({ length: 6 }, (_, index) => index + 1),
    majorArcanaOnly: true,
  },
  [SpreadType.CELTIC]: {
    type: SpreadType.CELTIC,
    requiredCards: 11,
    allowedPositions: Array.from({ length: 11 }, (_, index) => index),
    majorArcanaOnly: false,
  },
};

export function getSpreadRule(type: SpreadType): SpreadRule {
  const rule = SPREAD_RULES[type];

  if (!rule) {
    throw new DomainError(`Unsupported spread type: ${String(type)}`);
  }

  return rule;
}
