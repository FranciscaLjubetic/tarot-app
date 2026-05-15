import { Module, forwardRef } from '@nestjs/common';
import { SessionsModule } from '../sessions/sessions.module';
import { TarotModule } from '../tarot/tarot.module';
import { InterpretationService } from './application/interpretation.service';
import { INTERPRETATION_STREAMER } from './application/interpretation-streamer.port';
import { PromptBuilderService } from './application/prompt-builder.service';
import { OllamaInterpretationStreamer } from './infrastructure/ollama-interpretation.streamer';

@Module({
  imports: [forwardRef(() => SessionsModule), TarotModule],
  providers: [
    InterpretationService,
    PromptBuilderService,
    {
      provide: INTERPRETATION_STREAMER,
      useClass: OllamaInterpretationStreamer,
    },
  ],
  exports: [InterpretationService, INTERPRETATION_STREAMER],
})
export class InterpretationModule {}
