import { Injectable } from '@nestjs/common';
import type { TarotSession } from '../../sessions/domain/session.entity';
import type { TarotCard } from '../../tarot/domain/tarot-card';

@Injectable()
export class PromptBuilderService {
  buildConversation(session: TarotSession): string {
    const contextLines = session.messages
      .map((message) => `${message.role}: ${message.content}`)
      .join('\n');

    return [
      'Eres un tarotista cyberpunk sobrio en Neo-Santiago.',
      'Hablas en espanol de Chile, con calidez, claridad y sin exagerar.',
      'Estas en la etapa conversacional previa o posterior a una tirada.',
      'Haz preguntas utiles para entender que le aqueja a la persona y ayudale a preparar la lectura.',
      'No hagas una interpretacion final de cartas si aun no hay cartas seleccionadas.',
      'No afirmes certezas absolutas ni promesas de futuro.',
      'Evita diagnosticos medicos, legales o financieros. Si surge algo de alto riesgo, recomienda apoyo profesional.',
      '',
      `Estado actual: ${session.currentStatus}`,
      `Tipo de tirada elegida: ${session.spreadType}`,
      `Mazo: ${session.deckId}`,
      '',
      'Historial de conversacion:',
      contextLines || 'Sin contexto adicional.',
      '',
      'Responde al ultimo mensaje del usuario en 1 a 3 parrafos breves.',
    ].join('\n');
  }

  build(session: TarotSession, cards: TarotCard[]): string {
    const cardsById = new Map(cards.map((card) => [card.id, card]));
    const cardLines = session.pickedCards
      .sort((left, right) => left.position - right.position)
      .map((pickedCard) => {
        const card = cardsById.get(pickedCard.cardId);
        return `- Posicion ${pickedCard.position}: ${card?.name ?? pickedCard.cardId} (${pickedCard.orientation})`;
      })
      .join('\n');

    const contextLines = session.messages
      .map((message) => `${message.role}: ${message.content}`)
      .join('\n');

    return [
      'Eres un tarotista cyberpunk sobrio en Neo-Santiago.',
      'Hablas en espanol de Chile, con calidez, claridad y sin exagerar.',
      'La lectura debe ser simbolica y no determinista: no afirmes certezas absolutas ni promesas de futuro.',
      'Integra el contexto de la sesion, la tirada, las cartas y sus posiciones.',
      'Evita diagnosticos medicos, legales o financieros. Si surge algo de alto riesgo, recomienda apoyo profesional.',
      '',
      `Tipo de tirada: ${session.spreadType}`,
      `Mazo: ${session.deckId}`,
      '',
      'Contexto de conversacion:',
      contextLines || 'Sin contexto adicional.',
      '',
      'Cartas seleccionadas:',
      cardLines || 'No hay cartas seleccionadas.',
      '',
      'Entrega una interpretacion final breve pero sustanciosa, en 4 a 7 parrafos.',
    ].join('\n');
  }
}
