import { Injectable } from '@nestjs/common';
import { randomInt } from 'crypto';
import { DomainError } from '../../shared/domain/domain-error';
import { buildTarotDeck } from '../domain/tarot-card';
import type { TarotCard } from '../domain/tarot-card';
import { DeckId, SpreadType } from '../domain/tarot.enums';
import { getSpreadRule } from '../domain/spread-rules';

export interface ShuffleDeckCommand {
  deckId?: DeckId;
  spreadType?: SpreadType;
}

export interface ShuffleDeckResult {
  deckId: DeckId;
  spreadType: SpreadType;
  cardIds: number[];
}

@Injectable()
export class TarotService {
  private readonly deck = buildTarotDeck();

  shuffle(command: ShuffleDeckCommand): ShuffleDeckResult {
    const deckId = command.deckId ?? DeckId.MARSELLA;
    const spreadType = command.spreadType ?? SpreadType.CIRCULAR;
    const rule = getSpreadRule(spreadType);
    const cards = rule.majorArcanaOnly
      ? this.deck.filter((card) => card.arcana === 'major')
      : this.deck;

    return {
      deckId,
      spreadType,
      cardIds: this.fisherYates(cards.map((card) => card.id)),
    };
  }

  getCards(cardIds: number[]): TarotCard[] {
    return cardIds.map((cardId) => {
      const card = this.deck.find((candidate) => candidate.id === cardId);

      if (!card) {
        throw new DomainError(`Unknown tarot card id: ${cardId}`);
      }

      return card;
    });
  }

  validateCardIdsForSpread(spreadType: SpreadType, cardIds: number[]) {
    const rule = getSpreadRule(spreadType);
    const uniqueCardIds = new Set(cardIds);

    if (cardIds.length !== rule.requiredCards) {
      throw new DomainError(
        `${spreadType} requires exactly ${rule.requiredCards} cards`,
      );
    }

    if (uniqueCardIds.size !== cardIds.length) {
      throw new DomainError('Selected cards must not contain duplicates');
    }

    const cards = this.getCards(cardIds);
    if (rule.majorArcanaOnly && cards.some((card) => card.arcana !== 'major')) {
      throw new DomainError('Rapid spread only accepts major arcana cards');
    }
  }

  private fisherYates(cardIds: number[]): number[] {
    const shuffled = [...cardIds];

    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const swapIndex = randomInt(index + 1);
      [shuffled[index], shuffled[swapIndex]] = [
        shuffled[swapIndex],
        shuffled[index],
      ];
    }

    return shuffled;
  }
}
