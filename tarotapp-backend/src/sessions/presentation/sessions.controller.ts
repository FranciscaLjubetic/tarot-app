import { Body, Controller, Get, Param, Post, Req, Sse } from '@nestjs/common';
import type { Request } from 'express';
import { Observable } from 'rxjs';
import { DomainError } from '../../shared/domain/domain-error';
import { getCurrentUserId } from '../../shared/user/current-user';
import { DeckId, SpreadType } from '../../tarot/domain/tarot.enums';
import { InterpretationService } from '../../interpretation/application/interpretation.service';
import { SessionsService } from '../application/sessions.service';
import { toSessionResponse } from '../application/session-response.mapper';

interface CreateSessionBody {
  spreadType?: string;
  deckId?: string;
}

interface PickCardsBody {
  cardIds?: number[];
  positions?: number[];
}

interface SendMessageBody {
  content?: string;
}

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly interpretationService: InterpretationService,
  ) {}

  @Post()
  async create(@Req() request: Request, @Body() body: CreateSessionBody) {
    const session = await this.sessionsService.createSession({
      userId: getCurrentUserId(request),
      spreadType: parseRequiredEnum(SpreadType, body.spreadType, 'spreadType'),
      deckId: parseOptionalEnum(DeckId, body.deckId, 'deckId'),
    });

    return toSessionResponse(session);
  }

  @Get('history')
  async history(@Req() request: Request) {
    const sessions = await this.sessionsService.getHistory(
      getCurrentUserId(request),
    );
    return { sessions: sessions.map(toSessionResponse) };
  }

  @Get(':id')
  async get(@Req() request: Request, @Param('id') id: string) {
    const session = await this.sessionsService.getSession(
      getCurrentUserId(request),
      id,
    );
    return toSessionResponse(session);
  }

  @Post(':id/pick-cards')
  async pickCards(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() body: PickCardsBody,
  ) {
    if (!Array.isArray(body.cardIds) || !Array.isArray(body.positions)) {
      throw new DomainError('cardIds and positions must be arrays');
    }

    if (
      !body.cardIds.every(Number.isInteger) ||
      !body.positions.every(Number.isInteger)
    ) {
      throw new DomainError('cardIds and positions must contain integers');
    }

    const session = await this.sessionsService.pickCards({
      userId: getCurrentUserId(request),
      sessionId: id,
      cardIds: body.cardIds,
      positions: body.positions,
    });

    return toSessionResponse(session);
  }

  @Post(':id/messages')
  async sendMessage(
    @Req() request: Request,
    @Param('id') id: string,
    @Body() body: SendMessageBody,
  ) {
    if (typeof body.content !== 'string' || !body.content.trim()) {
      throw new DomainError('content is required');
    }

    const result = await this.interpretationService.replyToMessage({
      userId: getCurrentUserId(request),
      sessionId: id,
      content: body.content,
    });

    return {
      message: result.message,
      session: toSessionResponse(result.session),
    };
  }

  @Sse(':id/stream')
  stream(@Req() request: Request, @Param('id') id: string): Observable<unknown> {
    return this.interpretationService.streamInterpretation({
      userId: getCurrentUserId(request),
      sessionId: id,
    });
  }
}

function parseRequiredEnum<T extends Record<string, string>>(
  source: T,
  value: string | undefined,
  fieldName: string,
): T[keyof T] {
  const parsedValue = parseOptionalEnum(source, value, fieldName);

  if (!parsedValue) {
    throw new DomainError(`${fieldName} is required`);
  }

  return parsedValue;
}

function parseOptionalEnum<T extends Record<string, string>>(
  source: T,
  value: string | undefined,
  fieldName: string,
): T[keyof T] | undefined {
  if (!value) {
    return undefined;
  }

  if (Object.values(source).includes(value)) {
    return value as T[keyof T];
  }

  throw new DomainError(`Invalid ${fieldName}: ${value}`);
}
