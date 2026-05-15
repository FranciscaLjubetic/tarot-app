import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { InterpretationModule } from './interpretation/interpretation.module';
import { SessionsModule } from './sessions/sessions.module';
import { TarotModule } from './tarot/tarot.module';
import { UsageModule } from './usage/usage.module';
import { UserContextModule } from './user-context/user-context.module';

@Module({
  imports: [
    HealthModule,
    UserContextModule,
    TarotModule,
    UsageModule,
    SessionsModule,
    InterpretationModule,
  ],
})
export class AppModule {}
