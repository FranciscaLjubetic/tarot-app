import { Module } from '@nestjs/common';
import { UserContextModule } from '../user-context/user-context.module';
import { USAGE_REPOSITORY } from './application/usage.repository';
import { UsageService } from './application/usage.service';
import { InMemoryUsageRepository } from './infrastructure/in-memory-usage.repository';
import { UsageController } from './presentation/usage.controller';

@Module({
  imports: [UserContextModule],
  controllers: [UsageController],
  providers: [
    UsageService,
    {
      provide: USAGE_REPOSITORY,
      useClass: InMemoryUsageRepository,
    },
  ],
  exports: [UsageService],
})
export class UsageModule {}
