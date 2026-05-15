import type { UserProfile } from '../domain/user-profile';

export const USER_PROFILE_REPOSITORY = Symbol('USER_PROFILE_REPOSITORY');

export interface UserProfileRepository {
  findById(userId: string): Promise<UserProfile | null>;
  save(profile: UserProfile): Promise<UserProfile>;
}
