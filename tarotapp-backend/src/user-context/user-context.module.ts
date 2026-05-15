import { Module } from '@nestjs/common';
import { USER_PROFILE_REPOSITORY } from './application/user-profile.repository';
import { UserContextService } from './application/user-context.service';
import { InMemoryUserProfileRepository } from './infrastructure/in-memory-user-profile.repository';
import { UserController } from './presentation/user.controller';

@Module({
  controllers: [UserController],
  providers: [
    UserContextService,
    {
      provide: USER_PROFILE_REPOSITORY,
      useClass: InMemoryUserProfileRepository,
    },
  ],
  exports: [UserContextService],
})
export class UserContextModule {}
