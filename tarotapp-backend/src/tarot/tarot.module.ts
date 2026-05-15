import { Module } from '@nestjs/common';
import { TarotService } from './application/tarot.service';
import { TarotController } from './presentation/tarot.controller';

@Module({
  controllers: [TarotController],
  providers: [TarotService],
  exports: [TarotService],
})
export class TarotModule {}
