import { Module, forwardRef } from '@nestjs/common';
import { InterpretationModule } from '../interpretation/interpretation.module';
import { TarotModule } from '../tarot/tarot.module';
import { UsageModule } from '../usage/usage.module';
import { UserContextModule } from '../user-context/user-context.module';
import { SESSION_REPOSITORY } from './application/session.repository';
import { SessionsService } from './application/sessions.service';
import { InMemorySessionRepository } from './infrastructure/in-memory-session.repository';
import { SessionsController } from './presentation/sessions.controller';

@Module({
  imports: [
    TarotModule,
    UsageModule,
    UserContextModule,
    forwardRef(() => InterpretationModule),
  ],
  controllers: [SessionsController],
  providers: [
    SessionsService,
    {
      provide: SESSION_REPOSITORY,
      useClass: InMemorySessionRepository,
    },
  ],
  exports: [SessionsService, SESSION_REPOSITORY],
})
export class SessionsModule {}
