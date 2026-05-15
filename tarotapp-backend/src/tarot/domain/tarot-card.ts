export interface TarotCard {
  id: number;
  name: string;
  arcana: 'major' | 'minor';
}

const MAJOR_ARCANA_NAMES = [
  'El Loco',
  'El Mago',
  'La Papisa',
  'La Emperatriz',
  'El Emperador',
  'El Papa',
  'Los Enamorados',
  'El Carro',
  'La Justicia',
  'El Ermitano',
  'La Rueda de la Fortuna',
  'La Fuerza',
  'El Colgado',
  'La Muerte',
  'La Templanza',
  'El Diablo',
  'La Torre',
  'La Estrella',
  'La Luna',
  'El Sol',
  'El Juicio',
  'El Mundo',
];

const MINOR_SUITS = ['Bastos', 'Copas', 'Espadas', 'Oros'];
const MINOR_RANKS = [
  'As',
  'Dos',
  'Tres',
  'Cuatro',
  'Cinco',
  'Seis',
  'Siete',
  'Ocho',
  'Nueve',
  'Diez',
  'Sota',
  'Caballero',
  'Reina',
  'Rey',
];

export function buildTarotDeck(): TarotCard[] {
  const majorArcana = MAJOR_ARCANA_NAMES.map((name, id) => ({
    id,
    name,
    arcana: 'major' as const,
  }));

  const minorArcana = MINOR_SUITS.flatMap((suit, suitIndex) =>
    MINOR_RANKS.map((rank, rankIndex) => ({
      id: 22 + suitIndex * MINOR_RANKS.length + rankIndex,
      name: `${rank} de ${suit}`,
      arcana: 'minor' as const,
    })),
  );

  return [...majorArcana, ...minorArcana];
}
