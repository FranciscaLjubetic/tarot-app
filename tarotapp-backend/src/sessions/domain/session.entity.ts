import {
  CardOrientation,
  DeckId,
  SpreadType,
} from '../../tarot/domain/tarot.enums';
import { SessionStatus } from './session-status.enum';

export interface PickedCard {
  cardId: number;
  position: number;
  orientation: CardOrientation;
}

export interface SessionMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: string;
}

export interface TarotSession {
  id: string;
  userId: string;
  spreadType: SpreadType;
  deckId: DeckId;
  currentStatus: SessionStatus;
  pickedCards: PickedCard[];
  messages: SessionMessage[];
  createdAt: string;
  updatedAt: string;
}
