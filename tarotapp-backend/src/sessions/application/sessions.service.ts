import { Inject, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { DomainError } from '../../shared/domain/domain-error';
import { TarotService } from '../../tarot/application/tarot.service';
import {
  CardOrientation,
  DeckId,
  SpreadType,
} from '../../tarot/domain/tarot.enums';
import { getSpreadRule } from '../../tarot/domain/spread-rules';
import { UsageService } from '../../usage/application/usage.service';
import { UserContextService } from '../../user-context/application/user-context.service';
import type { PickedCard, TarotSession } from '../domain/session.entity';
import { SessionStatus } from '../domain/session-status.enum';
import { SESSION_REPOSITORY } from './session.repository';
import type { SessionRepository } from './session.repository';

export interface CreateSessionCommand {
  userId: string;
  spreadType: SpreadType;
  deckId?: DeckId;
}

export interface PickCardsCommand {
  userId: string;
  sessionId: string;
  cardIds: number[];
  positions: number[];
}

export interface AddUserMessageCommand {
  userId: string;
  sessionId: string;
  content: string;
}

@Injectable()
export class SessionsService {
  private readonly logger = new Logger(SessionsService.name);

  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: SessionRepository,
    private readonly usageService: UsageService,
    private readonly userContextService: UserContextService,
    private readonly tarotService: TarotService,
  ) {}

  async createSession(command: CreateSessionCommand): Promise<TarotSession> {
    const profile = await this.userContextService.getProfile(command.userId);
    await this.usageService.assertCanUse(
      command.userId,
      profile.tier,
      command.spreadType,
    );
    await this.usageService.consume(command.userId, command.spreadType);

    const now = new Date().toISOString();
    const session: TarotSession = {
      id: randomUUID(),
      userId: command.userId,
      spreadType: command.spreadType,
      deckId: command.deckId ?? profile.activeDeck,
      currentStatus: SessionStatus.AWAITING_BIO,
      pickedCards: [],
      messages: [
        {
          role: 'assistant',
          content: 'Cuentame que te trae a esta lectura.',
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.logger.log(
      `Session ${session.id} created with status ${session.currentStatus}`,
    );
    return this.sessionRepository.save(session);
  }

  async getSession(userId: string, sessionId: string): Promise<TarotSession> {
    const session = await this.sessionRepository.findById(sessionId);

    if (!session || session.userId !== userId) {
      throw new DomainError('Session not found', 404, 'SESSION_NOT_FOUND');
    }

    return session;
  }

  async getHistory(userId: string): Promise<TarotSession[]> {
    return this.sessionRepository.findByUserId(userId);
  }

  async addUserMessage(command: AddUserMessageCommand): Promise<TarotSession> {
    const session = await this.getSession(command.userId, command.sessionId);
    const content = command.content.trim();

    if (!content) {
      throw new DomainError('Message content is required');
    }

    const updatedSession: TarotSession = {
      ...session,
      messages: [
        ...session.messages,
        {
          role: 'user',
          content,
          createdAt: new Date().toISOString(),
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    return this.sessionRepository.save(updatedSession);
  }

  async pickCards(command: PickCardsCommand): Promise<TarotSession> {
    const session = await this.getSession(command.userId, command.sessionId);
    const rule = getSpreadRule(session.spreadType);

    if (command.cardIds.length !== command.positions.length) {
      throw new DomainError('cardIds and positions must have the same length');
    }

    this.tarotService.validateCardIdsForSpread(
      session.spreadType,
      command.cardIds,
    );
    this.validatePositions(command.positions, rule.allowedPositions);

    const pickedCards: PickedCard[] = command.cardIds.map((cardId, index) => ({
      cardId,
      position: command.positions[index],
      orientation: CardOrientation.UPRIGHT,
    }));

    const updatedSession: TarotSession = {
      ...session,
      pickedCards,
      currentStatus: SessionStatus.INTERPRETING,
      updatedAt: new Date().toISOString(),
    };

    this.logger.log(
      `Session ${session.id} transitioned to ${updatedSession.currentStatus}`,
    );
    return this.sessionRepository.save(updatedSession);
  }

  async markFreeChat(session: TarotSession): Promise<TarotSession> {
    const updatedSession = {
      ...session,
      currentStatus: SessionStatus.FREE_CHAT,
      updatedAt: new Date().toISOString(),
    };

    this.logger.log(`Session ${session.id} transitioned to FREE_CHAT`);
    return this.sessionRepository.save(updatedSession);
  }

  async addAssistantMessage(
    session: TarotSession,
    content: string,
  ): Promise<TarotSession> {
    const updatedSession = {
      ...session,
      messages: [
        ...session.messages,
        {
          role: 'assistant' as const,
          content,
          createdAt: new Date().toISOString(),
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    return this.sessionRepository.save(updatedSession);
  }

  private validatePositions(positions: number[], allowedPositions: number[]) {
    const uniquePositions = new Set(positions);

    if (uniquePositions.size !== positions.length) {
      throw new DomainError('Selected positions must not contain duplicates');
    }

    const allowedPositionSet = new Set(allowedPositions);
    const invalidPosition = positions.find(
      (position) => !allowedPositionSet.has(position),
    );

    if (invalidPosition !== undefined) {
      throw new DomainError(`Invalid card position: ${invalidPosition}`);
    }
  }
}
