import { SpreadType } from '../../tarot/domain/tarot.enums';

export const USAGE_REPOSITORY = Symbol('USAGE_REPOSITORY');

export interface UsageRepository {
  getMonthlyUsage(
    userId: string,
    month: string,
    spreadType: SpreadType,
  ): Promise<number>;
  incrementMonthlyUsage(
    userId: string,
    month: string,
    spreadType: SpreadType,
  ): Promise<number>;
}
