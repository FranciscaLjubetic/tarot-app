export type SpreadType = 'rapid' | 'circular' | 'celtic';

export type SessionStatus =
  | 'AWAITING_BIO'
  | 'SELECTING_SPREAD'
  | 'SHUFFLING'
  | 'PICKING'
  | 'INTERPRETING'
  | 'FREE_CHAT';

export type ChatMessage = {
  role: 'assistant' | 'user' | 'system';
  content: string;
  createdAt?: string;
};

export type SpreadOption = {
  type: SpreadType;
  backendType: SpreadType;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  positionsKey: string;
};

export type SpreadPosition = {
  id: number;
  label: string;
  x: number;
  y: number;
};

export type SpreadLayout = {
  type: SpreadType;
  image?: number;
  positions: SpreadPosition[];
};

export type SessionResponse = {
  session_id: string;
  spread_type: SpreadType;
  deck_id: string;
  current_status: SessionStatus;
  messages: ChatMessage[];
};

export type PickedCard = {
  id: number;
  position: number;
};
