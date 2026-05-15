import { Inject, Injectable } from '@nestjs/common';
import { DeckId } from '../../tarot/domain/tarot.enums';
import { Tier } from '../../usage/domain/tier.enum';
import type { UserProfile } from '../domain/user-profile';
import { USER_PROFILE_REPOSITORY } from './user-profile.repository';
import type { UserProfileRepository } from './user-profile.repository';

@Injectable()
export class UserContextService {
  constructor(
    @Inject(USER_PROFILE_REPOSITORY)
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

  async getProfile(userId: string): Promise<UserProfile> {
    const existingProfile = await this.userProfileRepository.findById(userId);

    if (existingProfile) {
      return existingProfile;
    }

    return this.userProfileRepository.save({
      id: userId,
      email: `${userId}@local.test`,
      tier: Tier.FREE,
      activeDeck: DeckId.MARSELLA,
    });
  }
}
