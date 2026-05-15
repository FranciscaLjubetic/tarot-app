import {
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import type { MessageEvent } from '@nestjs/common';
import { Observable } from 'rxjs';
import type { Subscriber } from 'rxjs';
import { SessionsService } from '../../sessions/application/sessions.service';
import { SessionStatus } from '../../sessions/domain/session-status.enum';
import { DomainError } from '../../shared/domain/domain-error';
import { TarotService } from '../../tarot/application/tarot.service';
import { INTERPRETATION_STREAMER } from './interpretation-streamer.port';
import type { InterpretationStreamerPort } from './interpretation-streamer.port';
import { PromptBuilderService } from './prompt-builder.service';

export interface StreamInterpretationCommand {
  userId: string;
  sessionId: string;
}

export interface ReplyToMessageCommand {
  userId: string;
  sessionId: string;
  content: string;
}

@Injectable()
export class InterpretationService {
  private readonly logger = new Logger(InterpretationService.name);

  constructor(
    @Inject(forwardRef(() => SessionsService))
    private readonly sessionsService: SessionsService,
    private readonly tarotService: TarotService,
    private readonly promptBuilder: PromptBuilderService,
    @Inject(INTERPRETATION_STREAMER)
    private readonly streamer: InterpretationStreamerPort,
  ) {}

  streamInterpretation(command: StreamInterpretationCommand) {
    return new Observable<MessageEvent>((subscriber) => {
      void this.emitInterpretation(command, subscriber);
    });
  }

  async replyToMessage(command: ReplyToMessageCommand) {
    const sessionWithUserMessage = await this.sessionsService.addUserMessage({
      userId: command.userId,
      sessionId: command.sessionId,
      content: command.content,
    });
    const prompt = this.promptBuilder.buildConversation(sessionWithUserMessage);
    let assistantMessage = '';

    for await (const token of this.streamer.stream({
      session: sessionWithUserMessage,
      cards: [],
      prompt,
    })) {
      assistantMessage += token;
    }

    const updatedSession = await this.sessionsService.addAssistantMessage(
      sessionWithUserMessage,
      assistantMessage.trim(),
    );

    return {
      message: {
        role: 'assistant',
        content: assistantMessage.trim(),
      },
      session: updatedSession,
    };
  }

  private async emitInterpretation(
    command: StreamInterpretationCommand,
    subscriber: Subscriber<MessageEvent>,
  ) {
    let fullText = '';

    try {
      const session = await this.sessionsService.getSession(
        command.userId,
        command.sessionId,
      );
      if (
        session.currentStatus !== SessionStatus.INTERPRETING ||
        session.pickedCards.length === 0
      ) {
        throw new DomainError(
          'Session must have picked cards before streaming interpretation',
        );
      }

      const cards = this.tarotService.getCards(
        session.pickedCards.map((card) => card.cardId),
      );
      const prompt = this.promptBuilder.build(session, cards);

      subscriber.next({
        data: {
          token: 'Iniciando conexion con el oraculo...',
          type: 'status',
        },
      });

      for await (const token of this.streamer.stream({
        session,
        cards,
        prompt,
      })) {
        fullText += token;
        subscriber.next({ data: { token, type: 'content' } });
      }

      if (fullText.trim().length > 0) {
        const updatedSession = await this.sessionsService.addAssistantMessage(
          session,
          fullText,
        );
        await this.sessionsService.markFreeChat(updatedSession);
      } else {
        await this.sessionsService.markFreeChat(session);
      }

      subscriber.next({ data: '[DONE]' });
      subscriber.complete();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unknown interpretation error';
      this.logger.error(message);
      subscriber.next({
        type: 'error',
        data: {
          type: 'error',
          message,
        },
      });
      subscriber.complete();
    }
  }
}
