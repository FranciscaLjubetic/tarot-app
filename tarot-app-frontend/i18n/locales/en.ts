export default {
  app: {
    title: 'Tarot App',
    subtitle: 'Cyberpunk Oracle',
    status: {
      noSession: 'NO SESSION',
    },
    backendLabel: 'Backend',
    backendPlaceholder: 'http://localhost:3000',
    openSession: 'Open session',
    resetSession: 'Reset session',
  },
  welcome: {
    prompt: 'Start a session and tell me what is moving under the surface.',
  },
  chat: {
    you: 'You',
    reader: 'Tarotist',
    typing: 'Consulting Ollama...',
    inputPlaceholder: 'Write what you want to explore...',
    inputDisabled: 'Open a session to start chatting',
    send: 'Send',
  },
  spread: {
    active: 'Active spread',
    shuffle: 'Shuffle deck',
    deck: 'Deck',
    tapHint: 'Tap a position to draw a card.',
    noCards: 'No cards left in the deck.',
    rapid: {
      title: 'Quick',
      subtitle: 'Six cards for a lively question.',
      description:
        'Only Major Arcana are used. Two rows of three cards: the first three show the near future, and cards 4 to 6 show the more distant future. Cards 1 and 4 are favorable, 3 and 6 reveal obstacles, and 2 and 5 synthesize the outcome.',
      positions: '6 cards',
    },
    circular: {
      title: 'Circular',
      subtitle: 'Twelve houses to read the full cycle.',
      description:
        'Twelve cards in a circle. Cards 8, 9, and 10 speak of the past, 11, 12, and 1 describe the present, and 2, 3, and 4 announce the future. Cards 5, 6, and 7 remain face down as the mystery of the beyond.',
      positions: '12 cards',
    },
    celtic: {
      title: 'Celtic Cross',
      subtitle: 'A broad reading for layered decisions.',
      description:
        'Ten cards in a cross and a column. The central cross speaks of the present, influences, recent past, and origins. The right column shows fears, outside opinions, desires, and the final resolution of the query.',
      positions: '10 cards',
    },
  },
  actions: {
    close: 'Close',
  },
  language: {
    switchTo: 'Switch to {{locale}}',
    spanish: 'Spanish',
    english: 'English',
  },
};
