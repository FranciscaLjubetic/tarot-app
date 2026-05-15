import { OllamaInterpretationStreamer } from './ollama-interpretation.streamer';
import { SessionStatus } from '../../sessions/domain/session-status.enum';
import { DeckId, SpreadType } from '../../tarot/domain/tarot.enums';

describe('OllamaInterpretationStreamer', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('parses Ollama NDJSON chunks', async () => {
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(
          encoder.encode(
            '{"response":"Hola","done":false}\n{"response":" tarot","done":false}\n{"done":true}\n',
          ),
        );
        controller.close();
      },
    });

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      statusText: 'OK',
      body: stream,
    }) as unknown as typeof fetch;

    const streamer = new OllamaInterpretationStreamer();
    const tokens: string[] = [];

    for await (const token of streamer.stream({
      prompt: 'test',
      cards: [],
      session: {
        id: 'session-1',
        userId: 'user-1',
        spreadType: SpreadType.RAPID,
        deckId: DeckId.MARSELLA,
        currentStatus: SessionStatus.INTERPRETING,
        pickedCards: [],
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })) {
      tokens.push(token);
    }

    expect(tokens).toEqual(['Hola', ' tarot']);
  });
});
