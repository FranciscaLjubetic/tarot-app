import { TarotService } from '../../tarot/application/tarot.service';
import { SpreadType } from '../../tarot/domain/tarot.enums';
import { UsageService } from '../../usage/application/usage.service';
import { InMemoryUsageRepository } from '../../usage/infrastructure/in-memory-usage.repository';
import { UserContextService } from '../../user-context/application/user-context.service';
import { InMemoryUserProfileRepository } from '../../user-context/infrastructure/in-memory-user-profile.repository';
import { SessionStatus } from '../domain/session-status.enum';
import { InMemorySessionRepository } from '../infrastructure/in-memory-session.repository';
import { SessionsService } from './sessions.service';

describe('SessionsService', () => {
  let service: SessionsService;

  beforeEach(() => {
    service = new SessionsService(
      new InMemorySessionRepository(),
      new UsageService(new InMemoryUsageRepository()),
      new UserContextService(new InMemoryUserProfileRepository()),
      new TarotService(),
    );
  });

  it('creates a session in AWAITING_BIO', async () => {
    const session = await service.createSession({
      userId: 'user-1',
      spreadType: SpreadType.RAPID,
    });

    expect(session.currentStatus).toBe(SessionStatus.AWAITING_BIO);
    expect(session.messages[0]?.content).toContain('Cuentame');
  });

  it('transitions through INTERPRETING and FREE_CHAT', async () => {
    const session = await service.createSession({
      userId: 'user-1',
      spreadType: SpreadType.RAPID,
    });

    const interpretingSession = await service.pickCards({
      userId: 'user-1',
      sessionId: session.id,
      cardIds: [0, 1, 2, 3, 4, 5],
      positions: [1, 2, 3, 4, 5, 6],
    });

    expect(interpretingSession.currentStatus).toBe(SessionStatus.INTERPRETING);

    const freeChatSession = await service.markFreeChat(interpretingSession);
    expect(freeChatSession.currentStatus).toBe(SessionStatus.FREE_CHAT);
  });

  it('rejects invalid positions', async () => {
    const session = await service.createSession({
      userId: 'user-1',
      spreadType: SpreadType.RAPID,
    });

    await expect(
      service.pickCards({
        userId: 'user-1',
        sessionId: session.id,
        cardIds: [0, 1, 2, 3, 4, 5],
        positions: [1, 2, 3, 4, 5, 7],
      }),
    ).rejects.toThrow('Invalid card position');
  });
});
