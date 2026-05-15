import { Injectable } from '@nestjs/common';
import type { SessionRepository } from '../application/session.repository';
import type { TarotSession } from '../domain/session.entity';

@Injectable()
export class InMemorySessionRepository implements SessionRepository {
  private readonly sessions = new Map<string, TarotSession>();

  async save(session: TarotSession): Promise<TarotSession> {
    this.sessions.set(session.id, session);
    return session;
  }

  async findById(id: string): Promise<TarotSession | null> {
    return this.sessions.get(id) ?? null;
  }

  async findByUserId(userId: string): Promise<TarotSession[]> {
    return [...this.sessions.values()]
      .filter((session) => session.userId === userId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }
}
