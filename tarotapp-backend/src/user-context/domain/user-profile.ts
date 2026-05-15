import { DeckId } from '../../tarot/domain/tarot.enums';
import { Tier } from '../../usage/domain/tier.enum';

export interface UserProfile {
  id: string;
  email: string;
  tier: Tier;
  activeDeck: DeckId;
}
