import { Controller, Get, Query } from '@nestjs/common';
import { DomainError } from '../../shared/domain/domain-error';
import { TarotService } from '../application/tarot.service';
import { DeckId, SpreadType } from '../domain/tarot.enums';

@Controller('tarot')
export class TarotController {
  constructor(private readonly tarotService: TarotService) {}

  @Get('deck/shuffle')
  shuffle(
    @Query('deckId') deckId?: string,
    @Query('spreadType') spreadType?: string,
  ) {
    return this.tarotService.shuffle({
      deckId: parseOptionalEnum(DeckId, deckId, 'deckId'),
      spreadType: parseOptionalEnum(SpreadType, spreadType, 'spreadType'),
    });
  }
}

function parseOptionalEnum<T extends Record<string, string>>(
  source: T,
  value: string | undefined,
  fieldName: string,
): T[keyof T] | undefined {
  if (!value) {
    return undefined;
  }

  if (Object.values(source).includes(value)) {
    return value as T[keyof T];
  }

  throw new DomainError(`Invalid ${fieldName}: ${value}`);
}
