import type { TarotSession } from '../domain/session.entity';

export const SESSION_REPOSITORY = Symbol('SESSION_REPOSITORY');

export interface SessionRepository {
  save(session: TarotSession): Promise<TarotSession>;
  findById(id: string): Promise<TarotSession | null>;
  findByUserId(userId: string): Promise<TarotSession[]>;
}
