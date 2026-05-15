import { Injectable, Logger } from '@nestjs/common';
import {
  InterpretationStreamInput,
  InterpretationStreamerPort,
} from '../application/interpretation-streamer.port';

interface OllamaGenerateChunk {
  response?: string;
  done?: boolean;
  error?: string;
}

@Injectable()
export class OllamaInterpretationStreamer implements InterpretationStreamerPort {
  private readonly logger = new Logger(OllamaInterpretationStreamer.name);
  private readonly baseUrl =
    process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434';
  private readonly model = process.env.OLLAMA_MODEL ?? 'llama3.1:latest';

  async *stream(input: InterpretationStreamInput): AsyncIterable<string> {
    const response = await fetch(`${this.baseUrl}/api/generate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        model: this.model,
        prompt: input.prompt,
        stream: true,
        options: {
          temperature: 0.7,
          top_p: 0.9,
        },
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error(
        `Ollama request failed with status ${response.status} ${response.statusText}`,
      );
    }

    this.logger.log(
      `Streaming interpretation for session ${input.session.id} using ${this.model}`,
    );

    const decoder = new TextDecoder();
    let buffer = '';
    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmedLine = line.trim();

        if (!trimmedLine) {
          continue;
        }

        const parsed = JSON.parse(trimmedLine) as OllamaGenerateChunk;

        if (parsed.error) {
          throw new Error(parsed.error);
        }

        if (parsed.response) {
          yield parsed.response;
        }

        if (parsed.done) {
          return;
        }
      }
    }

    const finalLine = buffer.trim();
    if (finalLine) {
      const parsed = JSON.parse(finalLine) as OllamaGenerateChunk;
      if (parsed.response) {
        yield parsed.response;
      }
    }
  }

  getHealth() {
    return {
      provider: 'ollama',
      baseUrl: this.baseUrl,
      model: this.model,
    };
  }
}
