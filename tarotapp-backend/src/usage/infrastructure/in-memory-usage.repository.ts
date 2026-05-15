import { Injectable } from '@nestjs/common';
import { SpreadType } from '../../tarot/domain/tarot.enums';
import type { UsageRepository } from '../application/usage.repository';

@Injectable()
export class InMemoryUsageRepository implements UsageRepository {
  private readonly counts = new Map<string, number>();

  async getMonthlyUsage(
    userId: string,
    month: string,
    spreadType: SpreadType,
  ): Promise<number> {
    return this.counts.get(this.key(userId, month, spreadType)) ?? 0;
  }

  async incrementMonthlyUsage(
    userId: string,
    month: string,
    spreadType: SpreadType,
  ): Promise<number> {
    const key = this.key(userId, month, spreadType);
    const nextValue = (this.counts.get(key) ?? 0) + 1;
    this.counts.set(key, nextValue);
    return nextValue;
  }

  private key(userId: string, month: string, spreadType: SpreadType): string {
    return `${userId}:${month}:${spreadType}`;
  }
}
