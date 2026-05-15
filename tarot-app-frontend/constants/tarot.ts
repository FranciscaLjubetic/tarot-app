import { Platform } from 'react-native';

import type { SpreadLayout, SpreadOption } from '../types/tarot';

export const SPREADS: SpreadOption[] = [
  {
    type: 'rapid',
    backendType: 'rapid',
    titleKey: 'spread.rapid.title',
    subtitleKey: 'spread.rapid.subtitle',
    descriptionKey: 'spread.rapid.description',
    positionsKey: 'spread.rapid.positions',
  },
  {
    type: 'circular',
    backendType: 'rapid',
    titleKey: 'spread.circular.title',
    subtitleKey: 'spread.circular.subtitle',
    descriptionKey: 'spread.circular.description',
    positionsKey: 'spread.circular.positions',
  },
  {
    type: 'celtic',
    backendType: 'rapid',
    titleKey: 'spread.celtic.title',
    subtitleKey: 'spread.celtic.subtitle',
    descriptionKey: 'spread.celtic.description',
    positionsKey: 'spread.celtic.positions',
  },
];

export const PREVIEW_CARDS = [
  require('../assets/cards/clean/arcanos mayores/fool.PNG'),
  require('../assets/cards/clean/arcanos mayores/wizard.PNG'),
  require('../assets/cards/clean/arcanos mayores/lovers.PNG'),
  require('../assets/cards/clean/arcanos mayores/moon.PNG'),
  require('../assets/cards/clean/arcanos mayores/star.PNG'),
  require('../assets/cards/clean/arcanos mayores/tower.PNG'),
  require('../assets/cards/clean/arcanos mayores/sun.PNG'),
];

export const CARD_ASSETS: Record<number, number> = {
  0: require('../assets/cards/clean/arcanos mayores/fool.PNG'),
  1: require('../assets/cards/clean/arcanos mayores/wizard.PNG'),
  2: require('../assets/cards/clean/arcanos mayores/lovers.PNG'),
  3: require('../assets/cards/clean/arcanos mayores/moon.PNG'),
  4: require('../assets/cards/clean/arcanos mayores/star.PNG'),
  5: require('../assets/cards/clean/arcanos mayores/tower.PNG'),
  6: require('../assets/cards/clean/arcanos mayores/sun.PNG'),
};

export const SPREAD_LAYOUTS: Record<SpreadOption['type'], SpreadLayout> = {
  rapid: {
    type: 'rapid',
    positions: [
      { id: 1, label: '1', x: 0.2, y: 0.45 },
      { id: 2, label: '2', x: 0.5, y: 0.45 },
      { id: 3, label: '3', x: 0.8, y: 0.45 },
      { id: 4, label: '4', x: 0.2, y: 0.75 },
      { id: 5, label: '5', x: 0.5, y: 0.75 },
      { id: 6, label: '6', x: 0.8, y: 0.75 },
    ],
  },
  circular: {
    type: 'circular',
    positions: [
      { id: 1, label: '1', x: 0.5, y: 0.12 },
      { id: 2, label: '2', x: 0.68, y: 0.16 },
      { id: 3, label: '3', x: 0.82, y: 0.3 },
      { id: 4, label: '4', x: 0.86, y: 0.5 },
      { id: 5, label: '5', x: 0.82, y: 0.7 },
      { id: 6, label: '6', x: 0.68, y: 0.84 },
      { id: 7, label: '7', x: 0.5, y: 0.88 },
      { id: 8, label: '8', x: 0.32, y: 0.84 },
      { id: 9, label: '9', x: 0.18, y: 0.7 },
      { id: 10, label: '10', x: 0.14, y: 0.5 },
      { id: 11, label: '11', x: 0.18, y: 0.3 },
      { id: 12, label: '12', x: 0.32, y: 0.16 },
    ],
  },
  celtic: {
    type: 'celtic',
    positions: [
      { id: 1, label: '1', x: 0.28, y: 0.42 },
      { id: 2, label: '2', x: 0.42, y: 0.42 },
      { id: 3, label: '3', x: 0.28, y: 0.6 },
      { id: 4, label: '4', x: 0.28, y: 0.25 },
      { id: 5, label: '5', x: 0.12, y: 0.42 },
      { id: 6, label: '6', x: 0.44, y: 0.6 },
      { id: 7, label: '7', x: 0.72, y: 0.2 },
      { id: 8, label: '8', x: 0.72, y: 0.38 },
      { id: 9, label: '9', x: 0.72, y: 0.56 },
      { id: 10, label: '10', x: 0.72, y: 0.74 },
    ],
  },
};

export const DEFAULT_API_URL =
  Platform.OS === 'android'
    ? 'http://192.168.1.159:3000'
    : 'http://192.168.1.159:3000';
