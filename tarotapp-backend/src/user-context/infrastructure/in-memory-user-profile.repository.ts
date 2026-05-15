import { Injectable } from '@nestjs/common';
import type { UserProfileRepository } from '../application/user-profile.repository';
import type { UserProfile } from '../domain/user-profile';

@Injectable()
export class InMemoryUserProfileRepository implements UserProfileRepository {
  private readonly profiles = new Map<string, UserProfile>();

  async findById(userId: string): Promise<UserProfile | null> {
    return this.profiles.get(userId) ?? null;
  }

  async save(profile: UserProfile): Promise<UserProfile> {
    this.profiles.set(profile.id, profile);
    return profile;
  }
}
