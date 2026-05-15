import { Inject, Injectable } from '@nestjs/common';
import { DomainError } from '../../shared/domain/domain-error';
import { SpreadType } from '../../tarot/domain/tarot.enums';
import { Tier } from '../domain/tier.enum';
import { checkUsagePolicy } from '../domain/usage-policy';
import type { UsageCheck } from '../domain/usage-policy';
import { USAGE_REPOSITORY } from './usage.repository';
import type { UsageRepository } from './usage.repository';

@Injectable()
export class UsageService {
  constructor(
    @Inject(USAGE_REPOSITORY)
    private readonly usageRepository: UsageRepository,
  ) {}

  async checkUsage(
    userId: string,
    tier: Tier,
    spreadType: SpreadType,
  ): Promise<UsageCheck> {
    const month = this.currentMonth();
    const used = await this.usageRepository.getMonthlyUsage(
      userId,
      month,
      spreadType,
    );

    return checkUsagePolicy(tier, spreadType, used);
  }

  async assertCanUse(
    userId: string,
    tier: Tier,
    spreadType: SpreadType,
  ): Promise<UsageCheck> {
    const check = await this.checkUsage(userId, tier, spreadType);

    if (!check.allowed) {
      throw new DomainError(
        `Monthly limit reached for ${spreadType} on ${tier} tier`,
        403,
        'USAGE_LIMIT_REACHED',
      );
    }

    return check;
  }

  async consume(userId: string, spreadType: SpreadType): Promise<number> {
    return this.usageRepository.incrementMonthlyUsage(
      userId,
      this.currentMonth(),
      spreadType,
    );
  }

  private currentMonth(): string {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Santiago',
      year: 'numeric',
      month: '2-digit',
    }).formatToParts(new Date());
    const year = parts.find((part) => part.type === 'year')?.value;
    const month = parts.find((part) => part.type === 'month')?.value;
    return `${year}-${month}`;
  }
}
