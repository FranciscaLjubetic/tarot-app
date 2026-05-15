import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { INTERPRETATION_STREAMER } from '../src/interpretation/application/interpretation-streamer.port';
import { FakeInterpretationStreamer } from '../src/interpretation/infrastructure/fake-interpretation.streamer';
import { DomainErrorFilter } from '../src/shared/presentation/domain-error.filter';

describe('Tarot backend (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(INTERPRETATION_STREAMER)
      .useValue(new FakeInterpretationStreamer(['La carta abre ', 'un camino.']))
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new DomainErrorFilter());
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('returns health metadata', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect(({ body }) => {
        expect(body.status).toBe('ok');
        expect(body.ollama.model).toBeDefined();
      });
  });

  it('creates, reads, picks cards, and streams an interpretation', async () => {
    const createResponse = await request(app.getHttpServer())
      .post('/sessions')
      .send({ spreadType: 'rapid', deckId: 'marsella' })
      .expect(201);

    const sessionId = createResponse.body.session_id as string;
    expect(createResponse.body.current_status).toBe('AWAITING_BIO');

    await request(app.getHttpServer())
      .get(`/sessions/${sessionId}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.session_id).toBe(sessionId);
      });

    await request(app.getHttpServer())
      .post(`/sessions/${sessionId}/messages`)
      .send({ content: 'Quiero entender un cambio laboral.' })
      .expect(201)
      .expect(({ body }) => {
        expect(body.message.content).toContain('La carta abre');
        expect(body.session.messages).toHaveLength(3);
      });

    await request(app.getHttpServer())
      .get('/tarot/deck/shuffle?deckId=marsella&spreadType=rapid')
      .expect(200)
      .expect(({ body }) => {
        expect(body.cardIds).toHaveLength(22);
      });

    await request(app.getHttpServer())
      .post(`/sessions/${sessionId}/pick-cards`)
      .send({ cardIds: [0, 1, 2, 3, 4, 5], positions: [1, 2, 3, 4, 5, 6] })
      .expect(201)
      .expect(({ body }) => {
        expect(body.current_status).toBe('INTERPRETING');
      });

    await request(app.getHttpServer())
      .get(`/sessions/${sessionId}/stream`)
      .expect(200)
      .expect('content-type', /text\/event-stream/)
      .expect(({ text }) => {
        expect(text).toContain('Iniciando conexion');
        expect(text).toContain('La carta abre');
        expect(text).toContain('[DONE]');
      });
  });

  it('checks usage limits', () => {
    return request(app.getHttpServer())
      .get('/usage/check?type=rapid')
      .expect(200)
      .expect(({ body }) => {
        expect(body.allowed).toBe(true);
        expect(body.limit).toBe(2);
      });
  });
});
