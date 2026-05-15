import { SpreadType } from '../../tarot/domain/tarot.enums';
import { Tier } from './tier.enum';
import { checkUsagePolicy } from './usage-policy';

describe('checkUsagePolicy', () => {
  it('allows free rapid usage before the limit', () => {
    const result = checkUsagePolicy(Tier.FREE, SpreadType.RAPID, 1);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(1);
  });

  it('blocks free celtic spreads', () => {
    const result = checkUsagePolicy(Tier.FREE, SpreadType.CELTIC, 0);

    expect(result.allowed).toBe(false);
    expect(result.limit).toBe(0);
  });

  it('allows unlimited pro usage', () => {
    const result = checkUsagePolicy(Tier.PRO, SpreadType.CELTIC, 99);

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe('unlimited');
  });
});
