import type { TarotSession } from '../domain/session.entity';

export function toSessionResponse(session: TarotSession) {
  return {
    session_id: session.id,
    user_id: session.userId,
    spread_type: session.spreadType,
    deck_id: session.deckId,
    current_status: session.currentStatus,
    picked_cards: session.pickedCards,
    messages: session.messages,
    created_at: session.createdAt,
    updated_at: session.updatedAt,
  };
}
