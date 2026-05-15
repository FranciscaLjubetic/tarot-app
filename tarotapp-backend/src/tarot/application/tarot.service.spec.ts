import { TarotService } from './tarot.service';
import { SpreadType } from '../domain/tarot.enums';

describe('TarotService', () => {
  let service: TarotService;

  beforeEach(() => {
    service = new TarotService();
  });

  it('shuffles a full deck with unique card ids', () => {
    const result = service.shuffle({ spreadType: SpreadType.CIRCULAR });

    expect(result.cardIds).toHaveLength(78);
    expect(new Set(result.cardIds).size).toBe(78);
  });

  it('uses only major arcana for rapid spreads', () => {
    const result = service.shuffle({ spreadType: SpreadType.RAPID });

    expect(result.cardIds).toHaveLength(22);
    expect(result.cardIds.every((cardId) => cardId >= 0 && cardId <= 21)).toBe(
      true,
    );
  });

  it('rejects duplicate picked cards', () => {
    expect(() =>
      service.validateCardIdsForSpread(SpreadType.RAPID, [0, 1, 2, 3, 4, 4]),
    ).toThrow('duplicates');
  });

  it('rejects minor arcana on rapid spreads', () => {
    expect(() =>
      service.validateCardIdsForSpread(SpreadType.RAPID, [0, 1, 2, 3, 4, 22]),
    ).toThrow('major arcana');
  });
});
