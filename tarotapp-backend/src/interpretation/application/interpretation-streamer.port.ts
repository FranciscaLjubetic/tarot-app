import type { TarotSession } from '../../sessions/domain/session.entity';
import type { TarotCard } from '../../tarot/domain/tarot-card';

export const INTERPRETATION_STREAMER = Symbol('INTERPRETATION_STREAMER');

export interface InterpretationStreamInput {
  session: TarotSession;
  cards: TarotCard[];
  prompt: string;
}

export interface InterpretationStreamerPort {
  stream(input: InterpretationStreamInput): AsyncIterable<string>;
}
