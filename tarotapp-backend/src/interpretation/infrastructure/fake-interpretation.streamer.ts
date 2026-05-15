import {
  InterpretationStreamInput,
  InterpretationStreamerPort,
} from '../application/interpretation-streamer.port';

export class FakeInterpretationStreamer implements InterpretationStreamerPort {
  constructor(private readonly tokens = ['Lectura local de prueba.']) {}

  async *stream(_input: InterpretationStreamInput): AsyncIterable<string> {
    for (const token of this.tokens) {
      yield token;
    }
  }
}
