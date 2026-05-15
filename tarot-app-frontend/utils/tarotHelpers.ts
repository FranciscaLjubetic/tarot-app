import type { SessionResponse, SpreadType } from '../types/tarot';
import { SPREADS } from '../constants/tarot';

export function cleanApiUrl(value: string) {
  return value.replace(/\/+$/, '');
}

export function getSelectedSpread(spreadType: SpreadType) {
  return SPREADS.find((spread) => spread.type === spreadType) ?? SPREADS[0];
}

export function getSpreadCardCount(spreadType: SpreadType) {
  switch (spreadType) {
    case 'circular':
      return 12;
    case 'celtic':
      return 11;
    case 'rapid':
    default:
      return 6;
  }
}

export function getShuffledIds(payload: unknown): number[] {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  if ('cardIds' in payload && Array.isArray(payload.cardIds)) {
    return payload.cardIds as number[];
  }

  if ('cards' in payload && Array.isArray(payload.cards)) {
    return payload.cards as number[];
  }

  if ('deck' in payload && Array.isArray(payload.deck)) {
    return payload.deck as number[];
  }

  return [];
}

export async function readJson(response: Response) {
  const payload = (await response.json()) as unknown;

  if (!response.ok) {
    const message =
      typeof payload === 'object' &&
      payload !== null &&
      'message' in payload &&
      typeof payload.message === 'string'
        ? payload.message
        : `HTTP ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'Error inesperado';
}

export function shouldTriggerSpread(
  userMessage: string,
  currentSession: SessionResponse,
  hasPicked: boolean,
  isShuffling: boolean,
) {
  if (hasPicked || isShuffling) {
    return false;
  }

  const lastAssistant = [...currentSession.messages]
    .reverse()
    .find((message) => message.role === 'assistant');

  const assistantAsked =
    lastAssistant?.content &&
    /tirad|cartas|barajar|spread|cards|shuffle/i.test(lastAssistant.content);

  const userSaidYes = /(^|\s)(si|sí|ok|okay|claro|dale|quiero|vamos|yes|yeah|sure|go)(\s|$)/i.test(
    userMessage,
  );

  if (assistantAsked && userSaidYes) {
    return true;
  }

  return (
    currentSession.current_status === 'SHUFFLING' ||
    currentSession.current_status === 'PICKING' ||
    currentSession.current_status === 'INTERPRETING'
  );
}
